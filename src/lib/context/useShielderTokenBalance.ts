import { useChainId } from "@/lib/context/useChainId";
import { useConfig } from "@/lib/context/useConfig";
import { useShielderClient } from "@/lib/context/useShielderClient";
import useWasm from "@/lib/context/useWasm";
import { Token } from "@/lib/tokens/types";
import { nativeToken, erc20Token } from "@cardinal-cryptography/shielder-sdk";
import { useQuery } from "@tanstack/react-query";

export const useShielderTokenBalance = (token: Token) => {
  const { shielderClient } = useShielderClient();
  const { shielderConfig } = useConfig();
  const { isWasmLoaded } = useWasm();
  const chainId = useChainId();

  const { data: balance } = useQuery({
    queryKey: [
      "shielderTokenBalance",
      shielderConfig,
      isWasmLoaded,
      chainId,
      token.address,
    ],
    queryFn: async () => {
      if (!shielderClient) {
        throw new Error("Shielder client not available");
      }

      // Convert app Token to shielder-sdk Token
      const shielderToken = token.isNative
        ? nativeToken()
        : erc20Token(token.address as `0x${string}`);

      const accountState = await shielderClient.accountState(shielderToken);
      return accountState.balance;
    },
    enabled: !!shielderClient && !!shielderConfig && isWasmLoaded,
    refetchInterval: 10000,
  });

  return balance;
};
