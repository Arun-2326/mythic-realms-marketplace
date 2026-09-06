import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import {
  GAME_CARD_ADDRESS,
  gameCardAbi,
} from "../config/contracts";

const DEPLOYMENT_BLOCK = 11644500n;
const CHUNK_SIZE = 999n;

export function useOwnedCards() {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const [tokenIds, setTokenIds] = useState<bigint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOwnedCards() {
      if (!publicClient || !address) {
        setTokenIds([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const latestBlock = await publicClient.getBlockNumber();

        let allLogs: any[] = [];
        let fromBlock = DEPLOYMENT_BLOCK;

        // Scan the blockchain in small chunks.
        while (fromBlock <= latestBlock) {
          const toBlock =
            fromBlock + CHUNK_SIZE > latestBlock
              ? latestBlock
              : fromBlock + CHUNK_SIZE;

          const logs = await publicClient.getContractEvents({
            address: GAME_CARD_ADDRESS,
            abi: gameCardAbi,
            eventName: "Transfer",
            fromBlock,
            toBlock,
          });

          allLogs = allLogs.concat(logs);

          fromBlock = toBlock + 1n;
        }

        // Get every token that has ever appeared in a Transfer event.
        const uniqueTokenIds = [
          ...new Set(
            allLogs
              .map((log) => log.args.tokenId as bigint)
              .map((id) => id.toString())
          ),
        ].map((id) => BigInt(id));

        const owned: bigint[] = [];

        // Check the CURRENT owner of every token.
        for (const tokenId of uniqueTokenIds) {
          try {
            const owner = (await publicClient.readContract({
              address: GAME_CARD_ADDRESS,
              abi: gameCardAbi,
              functionName: "ownerOf",
              args: [tokenId],
            })) as `0x${string}`;

            if (owner.toLowerCase() === address.toLowerCase()) {
              owned.push(tokenId);
            }
          } catch {
            // Ignore nonexistent tokens.
          }
        }

        // Sort newest cards first.
        owned.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));

        setTokenIds(owned);
      } catch (error) {
        console.error("Failed to load owned cards:", error);
        setTokenIds([]);
      } finally {
        setLoading(false);
      }
    }

    loadOwnedCards();
  }, [publicClient, address]);

  return {
    tokenIds,
    loading,
  };
}