import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { MARKETPLACE_ADDRESS, marketplaceAbi } from "../config/contracts";

export function useListCard() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  function listCard(tokenId: bigint, priceInEth: string) {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: marketplaceAbi,
      functionName: "listCard",
      args: [tokenId, parseEther(priceInEth)],
    });
  }

  return { listCard, isPending, isConfirming, isConfirmed, error };
}