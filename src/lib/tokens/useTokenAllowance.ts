import { useChain } from "@/lib/context/useChain";
import { bigintQueryHashKey } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Address, erc20Abi } from "viem";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export type TokenAllowanceProps = {
  fromAddress: Address | undefined;
  tokenAddress: Address | undefined;
};

export const useTokenAllowance = ({
  fromAddress,
  tokenAddress,
}: TokenAllowanceProps) => {
  const { data: chainData } = useChain();
  const { data: tokenAllowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args:
      !!fromAddress && !!chainData?.shielderConfig.shielderContractAddress
        ? [
            fromAddress,
            chainData.shielderConfig.shielderContractAddress as `0x${string}`,
          ]
        : undefined,
  });

  // Token approval hooks
  const { writeContract, data: approvalTxHash, isPending } = useWriteContract();

  // Handle transaction receipt for approval
  const { data: approvalReceipt, isLoading: isWaitingForApproval } =
    useWaitForTransactionReceipt({
      hash: approvalTxHash,
    });

  const isApproving = isPending || isWaitingForApproval;

  useEffect(() => {
    if (approvalReceipt) {
      refetchAllowance();
    }
  }, [approvalReceipt, refetchAllowance]);

  const approve = (amount: bigint) => {
    if (!tokenAddress || !chainData?.shielderConfig.shielderContractAddress) {
      throw new Error("Token or shielder contract address not available");
    }
    writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [
        chainData?.shielderConfig.shielderContractAddress as `0x${string}`,
        amount,
      ],
    });
  };

  const query = useQuery({
    queryKey: [
      "useTokenApproval",
      tokenAllowance,
      isApproving,
      approvalReceipt,
    ],
    queryKeyHashFn: (queryKey) => {
      return bigintQueryHashKey(queryKey);
    },
    queryFn: () => {
      return {
        tokenAllowance,
        isApproving,
        approvalReceipt,
      };
    },
  });

  return {
    ...query,
    approve,
  };
};
