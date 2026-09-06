import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { GAME_CARD_ADDRESS, gameCardAbi } from "../config/contracts";

export function useMintCard() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  function mintCard(to: `0x${string}`, tokenURI: string) {
    writeContract({
      address: GAME_CARD_ADDRESS,
      abi: gameCardAbi,
      functionName: "mintCard",
      args: [to, tokenURI],
    });
  }

  return { mintCard, hash, isPending, isConfirming, isConfirmed, error };
}