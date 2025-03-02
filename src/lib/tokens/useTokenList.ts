import { useChain } from "@/lib/context/useChain";
import { Token } from "@/lib/tokens/types";
import { defaultTokenByChainId } from "@/lib/tokens";
import { ChainId } from "@/lib/chains";

export const useTokenList = (): Token[] => {
  const { data: chainData } = useChain();
  if (!chainData) {
    return [];
  }
  const { chain } = chainData;

  // Get default token for this chain (if any)
  const defaultToken = defaultTokenByChainId[chain.id as ChainId];

  return defaultToken ? [defaultToken] : [];
};
