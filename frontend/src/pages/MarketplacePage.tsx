import { useAccount } from "wagmi";
import { useListings } from "../hooks/useListings";
import { useBuyCard } from "../hooks/useBuyCard";
import CardTile from "../components/CardTile";

function MarketplacePage() {
  const { address } = useAccount();
  const { listings, loading } = useListings();
  const { buyCard, isPending, isConfirming, isConfirmed, error } = useBuyCard();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Marketplace</h1>

      {(isPending || isConfirming) && (
        <p className="text-yellow-400 mb-4">Processing purchase...</p>
      )}
      {isConfirmed && <p className="text-green-400 mb-4">Purchase confirmed! ✅</p>}
      {error && <p className="text-red-400 mb-4">Error: {error.message}</p>}

      {loading ? (
        <p className="text-slate-400">Loading listings...</p>
      ) : listings.length === 0 ? (
        <p className="text-slate-400">No cards listed yet. Be the first to mint and list one!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {listings.map((l) => (
            <CardTile
              key={l.tokenId.toString()}
              tokenId={l.tokenId}
              price={l.price}
              seller={l.seller}
              isOwnListing={address?.toLowerCase() === l.seller.toLowerCase()}
              onBuy={() => buyCard(l.tokenId, l.price)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MarketplacePage;