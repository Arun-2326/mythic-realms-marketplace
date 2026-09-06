import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MARKETPLACE_ADDRESS, marketplaceAbi } from "../config/contracts";

export function useCancelListing() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  function cancelListing(tokenId: bigint) {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: marketplaceAbi,
      functionName: "cancelListing",
      args: [tokenId],
    });
  }

  return { cancelListing, isPending, isConfirming, isConfirmed, error };
}