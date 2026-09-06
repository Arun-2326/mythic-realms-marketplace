import { useState } from "react";
import { useAccount } from "wagmi";
import { uploadImageToIPFS, uploadMetadataToIPFS } from "../services/ipfs";
import { useMintCard } from "../hooks/useMintCard";

const elements = [
  "Fire",
  "Water",
  "Earth",
  "Air",
  "Lightning",
  "Shadow",
  "Light",
];

const rarities = [
  "Common",
  "Rare",
  "Epic",
  "Legendary",
  "Mythic",
];

function MintPage() {
  const { address, isConnected } = useAccount();

  const {
    mintCard,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  } = useMintCard();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [element, setElement] = useState("Fire");
  const [rarity, setRarity] = useState("Common");

  const [attack, setAttack] = useState(50);
  const [defense, setDefense] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [health, setHealth] = useState(500);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [status, setStatus] = useState("");

  function handleImageChange(file: File | null) {
    if (!file) return;

    setImage(file);

    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function handleMint() {
    if (!address) {
      setStatus("Please connect your wallet first.");
      return;
    }

    if (!name.trim()) {
      setStatus("Please enter a card name.");
      return;
    }

    if (!description.trim()) {
      setStatus("Please enter a description.");
      return;
    }

    if (!image) {
      setStatus("Please select a card image.");
      return;
    }

    try {
      setStatus("Uploading card artwork to IPFS...");

      const imageCid = await uploadImageToIPFS(image);

      setStatus("Creating card metadata...");

      const metadata = {
        name,
        description,
        image: `ipfs://${imageCid}`,
        attributes: [
          {
            trait_type: "Rarity",
            value: rarity,
          },
          {
            trait_type: "Element",
            value: element,
          },
          {
            trait_type: "Attack",
            value: attack,
          },
          {
            trait_type: "Defense",
            value: defense,
          },
          {
            trait_type: "Speed",
            value: speed,
          },
          {
            trait_type: "Health",
            value: health,
          },
        ],
      };

      setStatus("Uploading metadata to IPFS...");

      const metadataCid = await uploadMetadataToIPFS(metadata);

      setStatus("Waiting for wallet confirmation...");

      mintCard(address, `ipfs://${metadataCid}`);
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong while creating the card.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <p className="text-purple-400 uppercase tracking-[0.3em] text-sm font-semibold">
            Mythic Realms
          </p>

          <h1 className="text-4xl md:text-5xl font-black mt-2">
            Forge Your Card
          </h1>

          <p className="text-slate-400 mt-3 max-w-2xl">
            Create a unique blockchain game card with permanent IPFS
            metadata and verifiable ownership.
          </p>
        </div>

        {!isConnected ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold">
              Connect your wallet
            </h2>

            <p className="text-slate-400 mt-2">
              Connect your wallet to start creating a Mythic Realms card.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-10">

            {/* CARD PREVIEW */}
            <div>
              <h2 className="text-xl font-bold mb-4">
                Card Preview
              </h2>

              <div className="max-w-sm mx-auto bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">

                <div className="aspect-[3/4] bg-slate-900 relative overflow-hidden">

                  {preview ? (
                    <img
                      src={preview}
                      alt="Card preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎴</div>
                        <p>Upload artwork</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur text-sm">
                    {rarity}
                  </div>

                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur text-sm">
                    {element}
                  </div>
                </div>

                <div className="p-6">

                  <h3 className="text-2xl font-black">
                    {name || "Unnamed Hero"}
                  </h3>

                  <p className="text-slate-400 text-sm mt-2 min-h-10">
                    {description || "Your card description will appear here."}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-6">

                    <div className="bg-slate-800 rounded-xl p-3">
                      <p className="text-xs text-slate-500">ATTACK</p>
                      <p className="text-xl font-bold">{attack}</p>
                    </div>

                    <div className="bg-slate-800 rounded-xl p-3">
                      <p className="text-xs text-slate-500">DEFENSE</p>
                      <p className="text-xl font-bold">{defense}</p>
                    </div>

                    <div className="bg-slate-800 rounded-xl p-3">
                      <p className="text-xs text-slate-500">SPEED</p>
                      <p className="text-xl font-bold">{speed}</p>
                    </div>

                    <div className="bg-slate-800 rounded-xl p-3">
                      <p className="text-xs text-slate-500">HEALTH</p>
                      <p className="text-xl font-bold">{health}</p>
                    </div>

                  </div>

                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">

              <h2 className="text-2xl font-bold mb-6">
                Card Details
              </h2>

              <div className="space-y-5">

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Card Name
                  </label>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Example: Ember Wolf"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your legendary creature..."
                    rows={4}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      Element
                    </label>

                    <select
                      value={element}
                      onChange={(e) => setElement(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
                    >
                      {elements.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      Rarity
                    </label>

                    <select
                      value={rarity}
                      onChange={(e) => setRarity(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
                    >
                      {rarities.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      Attack
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={attack}
                      onChange={(e) => setAttack(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      Defense
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={defense}
                      onChange={(e) => setDefense(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      Speed
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      Health
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={health}
                      onChange={(e) => setHealth(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
                    />
                  </div>

                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Card Artwork
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(e.target.files?.[0] ?? null)
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
                  />
                </div>

                {status && (
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-slate-300">
                    {status}
                  </div>
                )}

                {error && (
                  <div className="bg-red-950 border border-red-800 rounded-xl p-4 text-sm text-red-300">
                    Transaction error: {error.message}
                  </div>
                )}

                <button
                  onClick={handleMint}
                  disabled={isPending || isConfirming}
                  className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:cursor-not-allowed font-bold text-lg transition"
                >
                  {isPending
                    ? "Confirm in Wallet..."
                    : isConfirming
                    ? "Minting on Sepolia..."
                    : "✨ Mint Card"}
                </button>

                {isConfirmed && (
                  <div className="bg-green-950 border border-green-800 rounded-xl p-4">
                    <p className="text-green-400 font-bold">
                      🎉 Card minted successfully!
                    </p>

                    {hash && (
                      <p className="text-xs text-green-300 mt-2 break-all">
                        Transaction: {hash}
                      </p>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default MintPage;