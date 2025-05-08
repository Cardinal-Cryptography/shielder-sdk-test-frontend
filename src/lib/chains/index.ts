import { alephTestnet } from "@/lib/chains/alephTestnet";
import { arbitrumSepolia } from "viem/chains";

export const chainsByIds = {
  2039: alephTestnet,
  421614: arbitrumSepolia,
} as const;

export type ChainId = keyof typeof chainsByIds;

export const shielderConfigByChainId = {
  2039: {
    // Aleph Zero Testnet
    shielderContractAddress: "0x5B496EB83172B52885f80207426042eA21597077",
    relayerUrl: "https://shielder-relayer-v2.test.azero.dev/azero-testnet",
  },
  421614: {
    // Arbitrum Sepolia
    shielderContractAddress: "0xca2Ca45089Fa4E2BBef2BF26E632a8CA9CD1aFd0",
    relayerUrl: "https://shielder-relayer-v2.test.azero.dev/arbitrum-testnet",
  },
} as const;
