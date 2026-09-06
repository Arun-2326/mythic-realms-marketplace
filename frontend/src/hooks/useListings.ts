import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { MARKETPLACE_ADDRESS, marketplaceAbi } from "../config/contracts";

export interface Listing {
  tokenId: bigint;
  seller: `0x${string}`;
  price: bigint;
}

const DEPLOYMENT_BLOCK = 11644505n;
const CHUNK_SIZE = 999n;

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const publicClient = usePublicClient();

  useEffect(() => {
    async function fetchListings() {
      if (!publicClient) return;
      setLoading(true);

      const latestBlock = await publicClient.getBlockNumber();

      let allLogs: any[] = [];
      let fromBlock = DEPLOYMENT_BLOCK;

      while (fromBlock <= latestBlock) {
        const toBlock =
          fromBlock + CHUNK_SIZE > latestBlock ? latestBlock : fromBlock + CHUNK_SIZE;

        const logs = await publicClient.getContractEvents({
          address: MARKETPLACE_ADDRESS,
          abi: marketplaceAbi,
          eventName: "CardListed",
          fromBlock,
          toBlock,
        });

        allLogs = allLogs.concat(logs);
        fromBlock = toBlock + 1n;
      }

      // Get the UNIQUE set of token IDs that have ever been listed
      const uniqueTokenIds = [
        ...new Set(allLogs.map((log) => (log.args.tokenId as bigint).toString())),
      ].map((s) => BigInt(s));

      // For each unique token, check its CURRENT state exactly once
      const activeListings: Listing[] = [];

      for (const tokenId of uniqueTokenIds) {
        const listing = (await publicClient.readContract({
          address: MARKETPLACE_ADDRESS,
          abi: marketplaceAbi,
          functionName: "getListing",
          args: [tokenId],
        })) as { seller: `0x${string}`; price: bigint; active: boolean };

        if (listing.active) {
          activeListings.push({
            tokenId,
            seller: listing.seller,
            price: listing.price,
          });
        }
      }

      setListings(activeListings);
      setLoading(false);
    }

    fetchListings();
  }, [publicClient]);

  return { listings, loading };
}