import { Link } from "react-router-dom";
import { useAccount, useConnect, useDisconnect } from "wagmi";

function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">

      <div className="flex items-center gap-8">

        <Link
          to="/"
          className="font-black text-xl text-purple-400"
        >
          Mythic Realms
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link
            to="/"
            className="text-slate-300 hover:text-white transition"
          >
            Marketplace
          </Link>

          <Link
            to="/mint"
            className="text-slate-300 hover:text-white transition"
          >
            Mint Card
          </Link>
        </div>

      </div>

      {isConnected ? (
        <div className="flex items-center gap-3 text-sm">

          <span className="text-slate-300">
            {address?.slice(0, 6)}...
            {address?.slice(-4)}
          </span>

          <button
            onClick={() => disconnect()}
            className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition"
          >
            Disconnect
          </button>

        </div>
      ) : (
        <button
          onClick={() => connect({ connector: connectors[0] })}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition"
        >
          Connect Wallet
        </button>
      )}

    </nav>
  );
}

export default Navbar;