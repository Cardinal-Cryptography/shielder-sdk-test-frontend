import { useChain } from "@/lib/context/useChain";
import { Token } from "@/lib/tokens/types";

export const useNativeToken = (): Token | undefined => {
  const { data: chainData } = useChain();
  if (!chainData) {
    return undefined;
  }
  const { chain } = chainData;

  // Native token based on chain's native currency
  const nativeTokenInfo: Token = {
    symbol: chain.nativeCurrency.symbol,
    name: chain.nativeCurrency.name,
    decimals: 18,
    isNative: true,
  };

  return nativeTokenInfo;
};
