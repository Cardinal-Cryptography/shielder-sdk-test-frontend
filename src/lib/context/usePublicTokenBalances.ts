import { useTokenList } from "@/lib/context/useTokenList";
import { useChainId } from "@/lib/context/useChainId";
import { useQuery } from "@tanstack/react-query";
import { usePublicAccount } from "@/lib/context/usePublicAccount";
import { useReadContracts } from "wagmi";
import { erc20Abi } from "viem";

export const usePublicTokenBalances = () => {
  const tokens = useTokenList();
  const { publicBalance: nativeTokenBalance, publicAddress } =
    usePublicAccount();
  const chainId = useChainId();

  const readContractQueries = tokens
    .filter((token) => !token.isNative)
    .map((token) => {
      return {
        address: token.address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [publicAddress],
      };
    });

  const { data: tokenBalancesData, refetch: refetchErc20Balances } =
    useReadContracts({
      contracts: readContractQueries,
      query: {
        refetchInterval: 10000,
        enabled: !!nativeTokenBalance,
      },
    });

  const tokenBalancesList = tokenBalancesData;

  // Create an array of token addresses for the query key
  const tokenAddresses = tokens.map((token) => token.address);

  // Use React Query to manage the fetching of all token balances
  const { data, refetch } = useQuery({
    queryKey: [
      "publicTokenBalances",
      nativeTokenBalance?.toString() ?? "",
      chainId,
      ...tokenAddresses,
    ],
    queryFn: async () => {
      console.log(nativeTokenBalance);
      // Create a map to store token balances
      const balances = new Map<string, bigint>();
      if (!tokenBalancesList) {
        throw new Error("Token balances not available");
      }
      if (!nativeTokenBalance) {
        throw new Error("Native token balance not available");
      }

      balances.set("native", nativeTokenBalance);

      for (let i = 0; i < readContractQueries.length; i++) {
        const token = tokens.find(
          (token) => token.address === readContractQueries[i].address,
        );
        if (!token) {
          throw new Error("Token not found");
        }
        const tokenBalance = tokenBalancesList[i];
        const key = token.address!;
        if (tokenBalance.status === "success") {
          balances.set(key, tokenBalance.result as bigint);
        } else {
          balances.set(key, 0n);
          console.error(`Error fetching balance for token ${token.symbol}:`);
        }
      }

      return balances;
    },
    enabled: !!nativeTokenBalance && !!tokenBalancesList,
  });

  return {
    data,
    refetch: async () => {
      await refetchErc20Balances();
      await refetch();
    },
  };
};
