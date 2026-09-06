import { useAccount, useConnect, useDisconnect } from "wagmi";

function App() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4 text-white">
      <h1 className="text-3xl font-bold text-purple-400">Mythic Realms</h1>

      {isConnected ? (
        <div className="text-center">
          <p>Connected: {address}</p>
          <p>Network: {chain?.name ?? "Unknown"}</p>
          <button
            onClick={() => disconnect()}
            className="mt-2 px-4 py-2 bg-red-600 rounded"
          >
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
    </div>
  );
}

export default App;