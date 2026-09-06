import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useListings } from "./hooks/useListings";
import { formatEther } from "viem";

function App() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { listings, loading } = useListings();

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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;