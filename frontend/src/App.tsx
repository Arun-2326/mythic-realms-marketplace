import { useBuyCard } from "./hooks/useBuyCard";
import { useApproveCard } from "./hooks/useApproveCard";
import { useListCard } from "./hooks/useListCard";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useListings } from "./hooks/useListings";
import { useMintCard } from "./hooks/useMintCard";
import { uploadImageToIPFS, uploadMetadataToIPFS } from "./services/ipfs";
import { formatEther } from "viem";

function App() {
  const { approveCard, isConfirmed: isApproved } = useApproveCard();
  const { buyCard, isPending: isBuying, isConfirmed: isBought } = useBuyCard();
  const { listCard, isPending: isListing, isConfirmed: isListed } = useListCard();
  const [priceInput, setPriceInput] = useState("0.01");
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { listings, loading } = useListings();
  const { mintCard, isPending, isConfirming, isConfirmed, error } = useMintCard();

  const [mintStatus, setMintStatus] = useState("");

  async function handleMint(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !address) return;

    setMintStatus("Uploading image to IPFS...");
    const imageCid = await uploadImageToIPFS(file);

    setMintStatus("Uploading metadata to IPFS...");
    const metadataCid = await uploadMetadataToIPFS({
      name: "Ember Wolf",
      description: "A fierce fire-elemental wolf.",
      image: `ipfs://${imageCid}`,
      attributes: [
        { trait_type: "Rarity", value: "Rare" },
        { trait_type: "Element", value: "Fire" },
        { trait_type: "Attack", value: 72 },
      ],
    });

    setMintStatus("Waiting for you to approve the transaction in MetaMask...");
    mintCard(address, `ipfs://${metadataCid}`);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center gap-4 text-white p-8">
      <h1 className="text-3xl font-bold text-purple-400">Mythic Realms</h1>

      {isConnected ? (
        <div className="text-center">
          <p>Connected: {address}</p>
          <p>Network: {chain?.name ?? "Unknown"}</p>
          <button onClick={() => disconnect()} className="mt-2 px-4 py-2 bg-red-600 rounded">
            Disconnect
          </button>
        </div>
      ) : (
        connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            className="px-4 py-2 bg-purple-600 rounded"
          >
            Connect {connector.name}
          </button>
        ))
      )}

      {isConnected && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold mb-2">Mint a Test Card</h2>
          <input type="file" accept="image/*" onChange={handleMint} />
          <p className="mt-2">{mintStatus}</p>
          {isPending && <p className="text-yellow-400">Confirm in MetaMask...</p>}
          {isConfirming && <p className="text-yellow-400">Confirming on Sepolia...</p>}
          {isConfirmed && <p className="text-green-400">Card minted! ✅</p>}
          {error && <p className="text-red-400">Error: {error.message}</p>}
        </div>
      )}
      {isConnected && (
        <div className="mt-6 text-center bg-slate-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">List Token #0 For Sale</h2>
          <input
            type="text"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            className="text-black px-2 py-1 rounded"
            placeholder="Price in ETH"
          />
          <div className="mt-2 flex gap-2 justify-center">
            <button
              onClick={() => approveCard(0n)}
              className="px-3 py-2 bg-blue-600 rounded"
            >
              1. Approve
            </button>
            <button
              onClick={() => listCard(0n, priceInput)}
              className="px-3 py-2 bg-purple-600 rounded"
            >
              2. List
            </button>
          </div>
          {isApproved && <p className="text-green-400 text-sm mt-1">Approved ✅</p>}
          {isListing && <p className="text-yellow-400 text-sm mt-1">Listing...</p>}
          {isListed && <p className="text-green-400 text-sm mt-1">Listed! ✅</p>}
        </div>
      )}
      <div className="mt-8 w-full max-w-md">
  <h2 className="text-xl font-bold mb-2">Active Listings</h2>
  {loading ? (
    <p>Loading listings...</p>
  ) : listings.length === 0 ? (
    <p className="text-slate-400">No cards listed yet.</p>
  ) : (
    listings.map((l) => (
      <div key={l.tokenId.toString()} className="bg-slate-800 p-3 rounded mb-2">
        <p>Token ID: {l.tokenId.toString()}</p>
        <p>Price: {formatEther(l.price)} ETH</p>
        <p className="text-xs text-slate-400">Seller: {l.seller}</p>
        {address?.toLowerCase() !== l.seller.toLowerCase() && (
          <button
            onClick={() => buyCard(l.tokenId, l.price)}
            className="mt-2 px-3 py-1 bg-green-600 rounded text-sm"
          >
            Buy
          </button>
        )}
      </div>
    ))
  )}
  {isBuying && <p className="text-yellow-400 text-sm mt-1">Confirm purchase in MetaMask...</p>}
  {isBought && <p className="text-green-400 text-sm mt-1">Purchased! ✅</p>}
</div>
    </div>
  );
}

export default App;