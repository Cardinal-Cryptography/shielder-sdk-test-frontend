import { alephTestnet } from "@/lib/chains/alephTestnet";
import { monadTestnet } from "@/lib/chains/monadTestnet";
import { sonicTestnet } from "@/lib/chains/sonicTestnet";
import { arbitrumSepolia, baseSepolia, sepolia } from "viem/chains";

export const chainsByIds = {
  2039: alephTestnet,
  421614: arbitrumSepolia,
  84532: baseSepolia,
  11155111: sepolia,
  10143: monadTestnet,
  57054: sonicTestnet,
} as const;

export type ChainId = keyof typeof chainsByIds;

export const shielderConfigByChainId = {
  2039: {
    // Aleph Zero Testnet
    shielderContractAddress: "0x819Df6F66F9064A3d1FB912c12DebBce9e1E845f",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  },
  421614: {
    // Arbitrum Sepolia
    shielderContractAddress: "0x78823aE79E779C544dBff606311259ADcBBb123a",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  },
  84532: {
    // Base Sepolia
    shielderContractAddress: "0x91425e66c9Ca30D1326cffe91FDddd147837aABf",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  },
  11155111: {
    // Sepolia
    shielderContractAddress: "0x72262094b81DB737CB2ee25614d082004AFEe195",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  },
  10143: {
    // Monad Testnet
    shielderContractAddress: "0xe4292eA13218b1885F92B25175a1d79cccb2cd01",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  },
  57054: {
    // Sonic Testnet
    shielderContractAddress: "0x7C848c81e1d428E952317d37008fE500b54d5B68",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  },
} as const;
