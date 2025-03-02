import { useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useToast } from "@/lib/context/useToast";
import { Token } from "@/lib/tokens/types";
import { useTokenBalance } from "@/lib/balances/useTokenBalance";
import { useQuery } from "@tanstack/react-query";
import { bigintQueryHashKey } from "@/lib/utils";

export function useErc20TokenMint({ token }: { token: Token | undefined }) {
  const { address } = useAccount();
  const { toast } = useToast();
  const { refetchAll } = useTokenBalance({ token });

  // Token minting hooks
  const {
    writeContract,
    data: mintTxHash,
    isPending,
    reset,
  } = useWriteContract();

  // Handle transaction receipt for minting
  const { data: mintReceipt, isLoading: isWaitingForReceipt } =
    useWaitForTransactionReceipt({
      hash: mintTxHash,
      query: {
        enabled: !!mintTxHash,
      },
    });

  const isMinting = isPending || isWaitingForReceipt;

  useEffect(() => {
    if (mintReceipt) {
      toast({
        title: "Success",
        description: `Successfully minted ${token?.symbol} tokens.`,
        variant: "default",
      });
      refetchAll();
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mintReceipt, token, isMinting]);

  const mintErc20Token = () => {
    if (!token?.address) {
      toast({
        title: "Error",
        description: "Token address not found",
        variant: "destructive",
      });
      return false;
    }

    try {
      writeContract({
        address: token.address as `0x${string}`,
        abi: [
          {
            type: "function",
            name: "mint",
            inputs: [
              { name: "to", type: "address", internalType: "address" },
              { name: "amount", type: "uint256", internalType: "uint256" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
        functionName: "mint",
        args: [address!, 10n * 10n ** BigInt(token.decimals)], // Mint 10 tokens
      });

      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `Failed to mint ${token.symbol} tokens.`,
        variant: "destructive",
      });
      return false;
    }
  };

  const query = useQuery({
    queryKey: ["useErc20TokenMint", token?.address, isMinting, mintReceipt],
    queryKeyHashFn: (queryKey) => {
      return bigintQueryHashKey(queryKey);
    },
    queryFn: () => {
      return {
        isMinting,
        mintReceipt,
      };
    },
  });

  return {
    ...query,
    mintErc20Token,
  };
}
