import { Link } from "react-router-dom";
import { useAccount, useConnect, useDisconnect } from "wagmi";

function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <nav className="flex items-center justify-between p-4 bg-slate-800">
      <div className="flex gap-4">
        <Link to="/" className="font-bold text-purple-400">
          Mythic Realms
        </Link>
        <Link to="/debug" className="text-slate-400 text-sm">
          (debug)
        </Link>
      </div>

      {isConnected ? (
        <div className="flex items-center gap-2 text-sm">
          <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          <button onClick={() => disconnect()} className="px-2 py-1 bg-red-600 rounded text-xs">
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={() => connect({ connector: connectors[0] })}
          className="px-3 py-1 bg-purple-600 rounded text-sm"
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
}

export default Navbar;