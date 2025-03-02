import { Token } from "@/lib/tokens/types";
import { ChainId } from "@/lib/chains";

export const defaultTokenByChainId: Partial<Record<ChainId, Token>> = {
  2039: {
    address: "0x44d945a446E604cd2B30F90b75340348c0097cAd",
    symbol: "PEPE",
    name: "Pepe",
    decimals: 18,
    isNative: false,
  },
  421614: {
    address: "0xDD3d1697cd67728714A3AFF798C005C1999eF7D1",
    symbol: "PEPE",
    name: "Pepe",
    decimals: 18,
    isNative: false,
  },
  84532: {
    address: "0xA32BBb5ec47f217eB9e8e44306Ed0597e9d525CA",
    symbol: "PEPE",
    name: "Pepe",
    decimals: 18,
    isNative: false,
  },
  // Other chains can be added here as needed
};
