import { Token } from "@/lib/tokens/types";
import { ChainId } from "@/lib/chains";

export const defaultTokenByChainId: Partial<Record<ChainId, Token>> = {
  2039: {
    // Aleph Zero Testnet
    address: "0x44d945a446E604cd2B30F90b75340348c0097cAd",
    symbol: "PEPE",
    name: "Pepe",
    decimals: 18,
    isNative: false,
  },
  421614: {
    // Arbitrum Sepolia
    address: "0xDD3d1697cd67728714A3AFF798C005C1999eF7D1",
    symbol: "PEPE",
    name: "Pepe",
    decimals: 18,
    isNative: false,
  },
  84532: {
    // Base Sepolia
    address: "0xA32BBb5ec47f217eB9e8e44306Ed0597e9d525CA",
    symbol: "PEPE",
    name: "Pepe",
    decimals: 18,
    isNative: false,
  },
  10143: {
    // Monad Testnet
    address: "0x9A31e096d3aFa31a50Dede2d8a8d8292dBFb0190",
    symbol: "PEPE",
    name: "Pepe",
    decimals: 18,
    isNative: false,
  },
  57054: {
    // Sonic Testnet
    address: "0xAeB69a4F8f1afcCD61Fb3f1dDA14038Cd3C62a72",
    symbol: "PEPE",
    name: "Pepe",
    decimals: 18,
    isNative: false,
  },
  11155111: {
    // Sepolia
    address: "0xB7d0fb507fb6B317bA2040f352661eA52bf39B9B",
    symbol: "PEPE",
    name: "Pepe",
    decimals: 18,
    isNative: false,
  },
  // Other chains can be added here as needed
};
