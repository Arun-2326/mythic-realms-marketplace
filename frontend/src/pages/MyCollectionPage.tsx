import { useAccount } from "wagmi";
import { useOwnedCards } from "../hooks/useOwnedCards";
import { useCardMetadata } from "../hooks/useCardMetadata";

function CollectionCard({ tokenId }: { tokenId: bigint }) {
  const { metadata, loading } = useCardMetadata(tokenId);

  const imageUrl = metadata?.image?.replace(
    "ipfs://",
    "https://gateway.pinata.cloud/ipfs/"
  );

  const rarity = metadata?.attributes.find(
    (a) => a.trait_type === "Rarity"
  )?.value;

  const element = metadata?.attributes.find(
    (a) => a.trait_type === "Element"
  )?.value;

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
        <div className="aspect-[3/4] bg-slate-700 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-purple-500 transition">

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={metadata?.name}
          className="aspect-[3/4] w-full object-cover"
        />
      ) : (
        <div className="aspect-[3/4] bg-slate-700 flex items-center justify-center">
          No image
        </div>
      )}

      <div className="p-4">

        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">
            {metadata?.name ?? `Token #${tokenId}`}
          </h3>

          <span className="text-xs text-purple-400">
            #{tokenId.toString()}
          </span>
        </div>

        <div className="flex gap-2 text-sm text-slate-400 mt-2">
          {rarity && <span>{rarity}</span>}
          {element && <span>• {element}</span>}
        </div>

        <p className="text-slate-500 text-xs mt-3">
          Owned by you
        </p>

      </div>
    </div>
  );
}

function MyCollectionPage() {
  const { isConnected } = useAccount();
  const { tokenIds, loading } = useOwnedCards();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <p className="text-purple-400 uppercase tracking-widest text-sm font-semibold">
            Your Collection
          </p>

          <h1 className="text-4xl font-black mt-2">
            My Cards
          </h1>

          <p className="text-slate-400 mt-2">
            Every Mythic Realms card currently owned by your wallet.
          </p>
        </div>

        {!isConnected ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
            <h2 className="text-xl font-bold">
              Connect your wallet
            </h2>

            <p className="text-slate-400 mt-2">
              Connect your wallet to view your collection.
            </p>
          </div>
        ) : loading ? (
          <p className="text-slate-400">
            Loading your cards...
          </p>
        ) : tokenIds.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">🎴</div>

            <h2 className="text-xl font-bold">
              Your collection is empty
            </h2>

            <p className="text-slate-400 mt-2">
              Mint or buy a Mythic Realms card to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {tokenIds.map((tokenId) => (
              <CollectionCard
                key={tokenId.toString()}
                tokenId={tokenId}
              />
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyCollectionPage;