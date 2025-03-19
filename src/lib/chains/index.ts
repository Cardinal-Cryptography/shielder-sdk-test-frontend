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
    shielderContractAddress: "0x7126761c7E18915C891c215a23100739492B78a1",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  },
  421614: {
    // Arbitrum Sepolia
    shielderContractAddress: "0x5314E765c06afC06b2FC4811CF7172B386e16826",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  },
  84532: {
    // Base Sepolia
    shielderContractAddress: "0x72B16db09D234A69a7e2df05503923A885eCe0Ea",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  },
  11155111: {
    // Sepolia
    shielderContractAddress: "0x9A31e096d3aFa31a50Dede2d8a8d8292dBFb0190",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  },
  10143: {
    // Monad Testnet
    shielderContractAddress: "0xE83577c082F95b17dc0688F8Ad4Cf8C1ba5d9634",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  },
  57054: {
    // Sonic Testnet
    shielderContractAddress: "0x91425e66c9Ca30D1326cffe91FDddd147837aABf",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  },
} as const;
