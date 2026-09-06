import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { GAME_CARD_ADDRESS, gameCardAbi, MARKETPLACE_ADDRESS } from "../config/contracts";

export function useApproveCard() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  function approveCard(tokenId: bigint) {
    writeContract({
      address: GAME_CARD_ADDRESS,
      abi: gameCardAbi,
      functionName: "approve",
      args: [MARKETPLACE_ADDRESS, tokenId],
    });
  }

  return { approveCard, isPending, isConfirming, isConfirmed, error };
}