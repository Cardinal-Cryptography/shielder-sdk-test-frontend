import { useTokenList } from "@/lib/context/useTokenList";
import { useShielderTokenBalances } from "@/lib/context/useShielderTokenBalances";
import { TokenBalance } from "@/lib/tokens/types";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { accountChainIdSupported } from "@/lib/utils";
import { usePublicTokenBalances } from "@/lib/context/usePublicTokenBalances";

export const useTokenBalances = () => {
  const tokens = useTokenList();
  const { data: publicTokenBalances, refetch: refetchPublicTokenBalances } =
    usePublicTokenBalances();
  const { data: shielderTokenBalances, refetch: refetchShielderTokenBalances } =
    useShielderTokenBalances();
  const { isConnected, chainId: accountChainId } = useAccount();

  const { data, refetch: refetchMyself } = useQuery({
    queryKey: [
      "tokenBalances",
      tokens.length,
      isConnected,
      Object.fromEntries(shielderTokenBalances?.entries() || []),
      Object.fromEntries(publicTokenBalances?.entries() || []),
    ],
    queryKeyHashFn: (queryKey) => {
      return JSON.stringify(
        queryKey,
        // handle bigints
        (_, value) => (typeof value === "bigint" ? value.toString() : value),
      );
    },
    queryFn: async () => {
      if (!publicTokenBalances || !shielderTokenBalances) {
        throw new Error("Token balances not available");
      }
      // Map tokens to token balances
      const tokenBalances: TokenBalance[] = tokens.map((token) => {
        // Get the private balance for this token
        const key = token.isNative ? "native" : token.address!;
        const publicBalance = publicTokenBalances.get(key) || 0n;
        const privateBalance = shielderTokenBalances.get(key) || 0n;

        return {
          token,
          publicBalance,
          privateBalance,
        };
      });

      return {
        tokenBalances,
        isConnected: isConnected && accountChainIdSupported(accountChainId),
      };
    },
    refetchInterval: 10000,
    enabled: !!publicTokenBalances && !!shielderTokenBalances,
    initialData: {
      tokenBalances: tokens.map((token) => ({
        token,
        publicBalance: 0n,
        privateBalance: 0n,
      })),
      isConnected: false,
    },
  });

  return {
    data,
    refetch: async () => {
      await refetchPublicTokenBalances();
      await refetchShielderTokenBalances();
      await refetchMyself();
    },
  };
};
