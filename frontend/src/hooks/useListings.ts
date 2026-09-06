import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { MARKETPLACE_ADDRESS, marketplaceAbi } from "../config/contracts";

export interface Listing {
  tokenId: bigint;
  seller: `0x${string}`;
  price: bigint;
}

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const publicClient = usePublicClient();

  useEffect(() => {
    async function fetchListings() {
      if (!publicClient) return;
      setLoading(true);

      // Get every CardListed event ever emitted
      const listedLogs = await publicClient.getContractEvents({
        address: MARKETPLACE_ADDRESS,
        abi: marketplaceAbi,
        eventName: "CardListed",
        fromBlock: 0n,
        toBlock: "latest",
      });

      // For each listed card, ask the contract directly if it's STILL active
      // (this correctly handles both sold and cancelled listings)
      const activeListings: Listing[] = [];

      for (const log of listedLogs) {
        const tokenId = (log as any).args.tokenId as bigint;

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