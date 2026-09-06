import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { GAME_CARD_ADDRESS, gameCardAbi } from "../config/contracts";

export interface CardMetadata {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string | number }[];
}

const ipfsToHttp = (uri: string) =>
  uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");

export function useCardMetadata(tokenId: bigint) {
  const [metadata, setMetadata] = useState<CardMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const publicClient = usePublicClient();

  useEffect(() => {
    async function fetchMetadata() {
      if (!publicClient) return;
      setLoading(true);

      try {
        const tokenURI = (await publicClient.readContract({
          address: GAME_CARD_ADDRESS,
          abi: gameCardAbi,
          functionName: "tokenURI",
          args: [tokenId],
        })) as string;

        const response = await fetch(ipfsToHttp(tokenURI));
        const data = (await response.json()) as CardMetadata;
        setMetadata(data);
      } catch (err) {
        console.error("Failed to load metadata for token", tokenId, err);
        setMetadata(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMetadata();
  }, [publicClient, tokenId]);

  return { metadata, loading };
}