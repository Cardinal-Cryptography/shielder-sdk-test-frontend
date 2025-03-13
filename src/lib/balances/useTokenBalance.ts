import { useShielderClient } from "@/lib/shielder/useShielderClient";
import { Token } from "@/lib/tokens/types";
import { tokenToSdkToken } from "@/lib/utils";
import { erc20Token, nativeToken } from "@cardinal-cryptography/shielder-sdk";
import { useQuery } from "@tanstack/react-query";
import { erc20Abi } from "viem";
import { useAccount, useBalance, useReadContract } from "wagmi";

export const useTokenBalance = ({ token }: { token: Token | undefined }) => {
  const { address: walletAddress, chain } = useAccount();
  const { data: nativeBalance, refetch: refetchNativeBalance } = useBalance({
    address: walletAddress,
    query: {
      enabled: token?.isNative ?? false,
    },
  });

  const { data: erc20Balance, refetch: refetchErc20Balance } = useReadContract({
    abi: erc20Abi,
    address: token?.address,
    functionName: "balanceOf",
    args: walletAddress ? [walletAddress] : undefined,
    query: {
      enabled: !(token?.isNative ?? false),
    },
  });

  const { data: shielderClient } = useShielderClient();

  const query = useQuery({
    queryKey: [
      "tokenBalance",
      token ? tokenToSdkToken(token) : null,
      nativeBalance,
      erc20Balance,
      chain,
      !!shielderClient,
    ],
    queryKeyHashFn: (queryKey) => {
      return JSON.stringify(
        queryKey,
        // handle bigints
        (_, value) => (typeof value === "bigint" ? value.toString() : value),
      );
    },
    queryFn: async () => {
      if (!token) {
        throw new Error("Token not defined");
      }

      const privateBalance = shielderClient
        ? ((
            await shielderClient.accountState(
              token.isNative ? nativeToken() : erc20Token(token.address!),
            )
          )?.balance ?? 0n)
        : 0n;
      if (token.isNative) {
        if (!nativeBalance) {
          throw new Error("Native balance not available");
        }
        return {
          publicBalance: nativeBalance.value,
          privateBalance,
        };
      } else {
        if (!erc20Balance) {
          throw new Error("ERC20 balance not available");
        }
        return {
          publicBalance: erc20Balance,
          privateBalance,
        };
      }
    },
  });
  return {
    ...query,
    refetchAll: () => {
      if (token) {
        if (token.isNative) {
          // Refetch native balance
          refetchNativeBalance();
        } else {
          // Refetch ERC20 balance
          refetchErc20Balance();
        }
      }
      // Then refetch the main query
      query.refetch();
    },
  };
};
