import { useChain } from "@/lib/context/useChain";
import { Token } from "@/lib/tokens/types";
import { defaultTokenByChainId } from "@/lib/tokens";
import { ChainId } from "@/lib/chains";
import { useShielderTokens } from "@/lib/shielder/useShielderTokens";

export const useTokenList = (): Token[] => {
  const { data: chainData } = useChain();
  const { data: shielderTokens } = useShielderTokens();
  if (!chainData) {
    return [];
  }
  const { chain } = chainData;

  // Get default token for this chain (if any)
  const defaultToken = defaultTokenByChainId[chain.id as ChainId];

  const defaultTokenList = defaultToken ? [defaultToken] : [];

  if (!shielderTokens) {
    return defaultTokenList;
  }

  // concat shielder tokens with default tokens, omit duplicates (by address)
  const tokenMap = new Map<string, Token>();

  // Add default tokens to the map
  defaultTokenList.forEach((token) => {
    const key = token.isNative ? "NATIVE" : token.address;
    if (key) {
      tokenMap.set(key, token);
    }
  });

  // Add shielder tokens to the map (will overwrite duplicates)
  shielderTokens.forEach((token) => {
    const key = token.isNative ? "NATIVE" : token.address;
    if (key) {
      tokenMap.set(key, token);
    }
  });

  // Convert map values back to array
  return Array.from(tokenMap.values());
};
