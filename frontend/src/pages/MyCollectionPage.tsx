import { useState } from "react";
import { useAccount } from "wagmi";
import { useOwnedCards } from "../hooks/useOwnedCards";
import { useCardMetadata } from "../hooks/useCardMetadata";
import { useApproveCard } from "../hooks/useApproveCard";
import { useListCard } from "../hooks/useListCard";
import { useCancelListing } from "../hooks/useCancelListing";
import { useListings } from "../hooks/useListings";

function CollectionCard({
  tokenId,
  isAlreadyListed,
}: {
  tokenId: bigint;
  isAlreadyListed: boolean;
}) {
  const { metadata, loading } = useCardMetadata(tokenId);

  const {
    approveCard,
    isPending: isApproving,
    isConfirming: isApprovalConfirming,
    isConfirmed: isApproved,
    error: approveError,
  } = useApproveCard();

  const {
    listCard,
    isPending: isListing,
    isConfirming: isListingConfirming,
    isConfirmed: isListed,
    error: listError,
  } = useListCard();

  const {
    cancelListing,
    isPending: isCancelling,
    isConfirming: isCancelConfirming,
    isConfirmed: isCancelled,
    error: cancelError,
  } = useCancelListing();

  const [price, setPrice] = useState("0.01");

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

  const currentlyListed = isAlreadyListed || isListed;

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

        {/* =====================================================
            NOT LISTED
        ====================================================== */}

        {!currentlyListed && !isCancelled && (
          <>
            <label className="block text-sm text-slate-400 mt-4 mb-1">
              Sale Price (ETH)
            </label>

            <input
              type="number"
              min="0.0001"
              step="0.001"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-purple-500"
            />

            {/* Approve */}
            {!isApproved && (
              <button
                onClick={() => approveCard(tokenId)}
                disabled={isApproving || isApprovalConfirming}
                className="mt-3 w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 rounded-lg font-semibold transition"
              >
                {isApproving
                  ? "Approving..."
                  : isApprovalConfirming
                  ? "Confirming Approval..."
                  : "Approve Marketplace"}
              </button>
            )}

            {/* List */}
            {isApproved && !isListing && !isListingConfirming && (
              <button
                onClick={() => listCard(tokenId, price)}
                className="mt-3 w-full px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition"
              >
                List for Sale
              </button>
            )}

            {/* Listing transaction */}
            {(isListing || isListingConfirming) && (
              <button
                disabled
                className="mt-3 w-full px-4 py-2 bg-slate-600 rounded-lg font-semibold"
              >
                {isListing
                  ? "Listing..."
                  : "Confirming Listing..."}
              </button>
            )}
          </>
        )}

        {/* =====================================================
            LISTED
        ====================================================== */}

        {currentlyListed && !isCancelled && (
          <>
            <div className="mt-4 p-3 bg-green-900/40 border border-green-700 rounded-lg text-green-300 text-sm text-center">
              Listed for sale ✅
            </div>

            <button
              onClick={() => cancelListing(tokenId)}
              disabled={isCancelling || isCancelConfirming}
              className="mt-3 w-full px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-600 rounded-lg font-semibold transition"
            >
              {isCancelling
                ? "Cancelling..."
                : isCancelConfirming
                ? "Confirming Cancellation..."
                : "Cancel Listing"}
            </button>
          </>
        )}

        {/* =====================================================
            CANCELLED
        ====================================================== */}

        {isCancelled && (
          <div className="mt-4 p-3 bg-yellow-900/40 border border-yellow-700 rounded-lg text-yellow-300 text-sm text-center">
            Listing cancelled successfully! ✅
          </div>
        )}

        {/* =====================================================
            ERRORS
        ====================================================== */}

        {approveError && (
          <p className="mt-2 text-red-400 text-xs">
            Approval error: {approveError.message}
          </p>
        )}

        {listError && (
          <p className="mt-2 text-red-400 text-xs">
            Listing error: {listError.message}
          </p>
        )}

        {cancelError && (
          <p className="mt-2 text-red-400 text-xs">
            Cancellation error: {cancelError.message}
          </p>
        )}

      </div>
    </div>
  );
}

function MyCollectionPage() {
  const { isConnected } = useAccount();

  const { tokenIds, loading } = useOwnedCards();

  const { listings } = useListings();

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

        {/* Not connected */}
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

          /* Loading */
          <p className="text-slate-400">
            Loading your cards...
          </p>

        ) : tokenIds.length === 0 ? (

          /* Empty collection */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

            <div className="text-5xl mb-4">
              🎴
            </div>

            <h2 className="text-xl font-bold">
              Your collection is empty
            </h2>

            <p className="text-slate-400 mt-2">
              Mint or buy a Mythic Realms card to get started.
            </p>

          </div>

        ) : (

          /* Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {tokenIds.map((tokenId) => (
              <CollectionCard
                key={tokenId.toString()}
                tokenId={tokenId}
                isAlreadyListed={listings.some(
                  (listing) => listing.tokenId === tokenId
                )}
              />
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyCollectionPage;