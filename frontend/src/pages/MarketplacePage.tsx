import { useAccount } from "wagmi";
import { useListings } from "../hooks/useListings";
import { useBuyCard } from "../hooks/useBuyCard";
import CardTile from "../components/CardTile";

function MarketplacePage() {
  const { address } = useAccount();
  const { listings, loading } = useListings();
  const {
    buyCard,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useBuyCard();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black">
          Mythic Realms Marketplace
        </h1>

        <p className="text-slate-400 mt-1">
          Discover, collect and trade legendary game cards.
        </p>
      </div>

      {isPending || isConfirming ? (
        <p className="text-yellow-400 mb-4">
          Processing purchase...
        </p>
      ) : null}

      {isConfirmed ? (
        <p className="text-green-400 mb-4">
          Purchase confirmed! ✅
        </p>
      ) : null}

      {error ? (
        <p className="text-red-400 mb-4">
          Error: {error.message}
        </p>
      ) : null}

      {loading ? (
        <p className="text-slate-400">
          Loading listings...
        </p>
      ) : listings.length === 0 ? (
        <p className="text-slate-400">
          No cards listed yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {listings.map((listing) => (
            <CardTile
              key={listing.tokenId.toString()}
              tokenId={listing.tokenId}
              price={listing.price}
              seller={listing.seller}
              isOwnListing={
                address?.toLowerCase() ===
                listing.seller.toLowerCase()
              }
              onBuy={() =>
                buyCard(listing.tokenId, listing.price)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MarketplacePage;