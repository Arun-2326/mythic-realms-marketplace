import { formatEther } from "viem";
import { useCardMetadata } from "../hooks/useCardMetadata";

interface CardTileProps {
  tokenId: bigint;
  price: bigint;
  seller: `0x${string}`;
  onBuy: () => void;
  isOwnListing: boolean;
}

function CardTile({ tokenId, price, seller, onBuy, isOwnListing }: CardTileProps) {
  const { metadata, loading } = useCardMetadata(tokenId);

  const imageUrl = metadata?.image.replace(
    "ipfs://",
    "https://gateway.pinata.cloud/ipfs/",
  );

  const rarity = metadata?.attributes.find((a) => a.trait_type === "Rarity")?.value;
  const element = metadata?.attributes.find((a) => a.trait_type === "Element")?.value;

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-purple-500 transition">
      {loading ? (
        <div className="aspect-square bg-slate-700 animate-pulse" />
      ) : imageUrl ? (
        <img src={imageUrl} alt={metadata?.name} className="aspect-square w-full object-cover" />
      ) : (
        <div className="aspect-square bg-slate-700 flex items-center justify-center text-slate-500 text-sm">
          No image
        </div>
      )}

      <div className="p-3">
        <h3 className="font-bold truncate">{metadata?.name ?? `Token #${tokenId}`}</h3>
        <div className="flex gap-2 text-xs text-slate-400 mt-1">
          {rarity && <span>{rarity}</span>}
          {element && <span>• {element}</span>}
        </div>
        <p className="mt-2 font-mono text-sm">{formatEther(price)} ETH</p>
        <p className="text-xs text-slate-500 truncate">
          Seller: {seller.slice(0, 6)}...{seller.slice(-4)}
        </p>

        {!isOwnListing && (
          <button
            onClick={onBuy}
            className="mt-2 w-full px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded text-sm"
          >
            Buy
          </button>
        )}
      </div>
    </div>
  );
}

export default CardTile;