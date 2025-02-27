import { useTokenList } from "@/lib/context/useTokenList";
import { useChainId } from "@/lib/context/useChainId";
import { useConfig } from "@/lib/context/useConfig";
import { useShielderClient } from "@/lib/context/useShielderClient";
import useWasm from "@/lib/context/useWasm";
import { nativeToken, erc20Token } from "@cardinal-cryptography/shielder-sdk";
import { useQuery } from "@tanstack/react-query";

export const useShielderTokenBalances = () => {
  const tokens = useTokenList();
  const { shielderClient } = useShielderClient();
  const { shielderConfig } = useConfig();
  const { isWasmLoaded } = useWasm();
  const chainId = useChainId();

  // Create an array of token addresses for the query key
  const tokenAddresses = tokens.map((token) => token.address);

  // Use React Query to manage the fetching of all token balances
  const { data, refetch } = useQuery({
    queryKey: [
      "shielderTokenBalances",
      shielderConfig,
      isWasmLoaded,
      chainId,
      ...tokenAddresses,
    ],
    queryFn: async () => {
      if (!shielderClient) {
        throw new Error("Shielder client not available");
      }

      // Create a map to store token balances
      const balances = new Map<string, bigint>();

      // For each token, fetch its balance directly using the shielderClient
      for (const token of tokens) {
        try {
          // Convert app Token to shielder-sdk Token
          const shielderToken = token.isNative
            ? nativeToken()
            : erc20Token(token.address as `0x${string}`);

          // Fetch the balance for this token
          const accountState = await shielderClient.accountState(shielderToken);

          // Use a key that uniquely identifies the token
          const key = token.isNative ? "native" : token.address!;

          // Store the balance in the map
          balances.set(key, accountState.balance);
        } catch (error) {
          console.error(
            `Error fetching balance for token ${token.symbol}:`,
            error,
          );
          // Continue with other tokens even if one fails
        }
      }

      return balances;
    },
    enabled: !!shielderClient && !!shielderConfig && isWasmLoaded,
    refetchInterval: 10000,
  });

  return { data, refetch };
};
