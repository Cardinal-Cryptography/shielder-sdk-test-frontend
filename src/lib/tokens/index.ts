import { Token } from "@/lib/tokens/types";
import { ChainId } from "@/lib/chains";

export const defaultTokensByChainId: Partial<Record<ChainId, Token[]>> = {
  2039: [
    {
      // Aleph Zero Testnet
      address: "0x57b7789b78A4606aFbe8138f6F9D4820D100096E",
      symbol: "USDT",
      name: "USDT",
      decimals: 18,
      isNative: false,
    },
    {
      address: "0xE907112ed7c64c7C9317Ca742d848D0Ef0198fFA",
      symbol: "SPR",
      name: "Spring",
      decimals: 18,
      isNative: false,
    },
  ],
  421614: [
    {
      // Arbitrum Sepolia
      address: "0xDD3d1697cd67728714A3AFF798C005C1999eF7D1",
      symbol: "PEPE",
      name: "Pepe",
      decimals: 18,
      isNative: false,
    },
  ],
  // Other chains can be added here as needed
};
