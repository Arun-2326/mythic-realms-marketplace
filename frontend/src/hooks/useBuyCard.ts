import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MARKETPLACE_ADDRESS, marketplaceAbi } from "../config/contracts";

export function useBuyCard() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  function buyCard(tokenId: bigint, priceInWei: bigint) {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: marketplaceAbi,
      functionName: "buyCard",
      args: [tokenId],
      value: priceInWei,
    });
  }

  return { buyCard, isPending, isConfirming, isConfirmed, error };
}