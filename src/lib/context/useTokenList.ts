import { PEPE_TOKEN_ADDRESS } from "@/lib/constants";
import { useChain } from "@/lib/context/useChain";
import { Token } from "@/lib/tokens/types";

export const useTokenList = (): Token[] => {
  const chain = useChain();
  // We'll use chain-specific token addresses in the future

  // Native token (AZERO)
  const nativeTokenInfo: Token = {
    symbol: chain.nativeCurrency.symbol,
    name: chain.nativeCurrency.name,
    decimals: 18,
    isNative: true,
  };

  // Hardcoded ERC20 tokens
  // In a real implementation, these addresses would be chain-specific
  const erc20Tokens: Token[] =
    chain.id === 2039
      ? [
          {
            address: PEPE_TOKEN_ADDRESS, // Mock address for PEPE
            symbol: "PEPE",
            name: "Pepe",
            decimals: 18,
            isNative: false,
          },
        ]
      : [];

  return [nativeTokenInfo, ...erc20Tokens];
};
