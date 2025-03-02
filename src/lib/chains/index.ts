import { alephTestnet } from "@/lib/chains/alephTestnet";
import { monadTestnet } from "@/lib/chains/monadTestnet";
import { sonicTestnet } from "@/lib/chains/sonicTestnet";
import { ShielderConfig } from "@/lib/storage/shielderConfig";
import { arbitrumSepolia, baseSepolia, sepolia } from "viem/chains";

export const chainsByIds = {
  2039: alephTestnet,
  421614: arbitrumSepolia,
  84532: baseSepolia,
  11155111: sepolia,
  57054: sonicTestnet,
  10143: monadTestnet,
} as const;

export type ChainId = keyof typeof chainsByIds;

export const shielderConfigByChainId = {
  2039: {
    // Aleph Zero Testnet
    shielderContractAddress: "0x68D624B7b18173b3F8C9880f5f45854C3c6a6800",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  } as ShielderConfig,
  421614: {
    // Arbitrum Sepolia
    shielderContractAddress: "0x0d3ad358196C797B60939B6bBa96C580f5B628Dc",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  } as ShielderConfig,
  84532: {
    // Base Sepolia
    shielderContractAddress: "0xCe05Bb6Dc141c9131777838cfDF429a806835da3",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  } as ShielderConfig,
  11155111: {
    // Sepolia
    shielderContractAddress: "0x38e17dBC2B7af2B3Fc8138aeb29d15CBE8008BCC",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  } as ShielderConfig,
  57054: {
    // Sonic Blaze Testnet
    shielderContractAddress: "0x8729837fEbc24aAC834D54E5c9C3FC18e1d9E7F1",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  },
  10143: {
    // Monad Testnet
    shielderContractAddress: "0x8729837fEbc24aAC834D54E5c9C3FC18e1d9E7F1",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  },
} as const;
