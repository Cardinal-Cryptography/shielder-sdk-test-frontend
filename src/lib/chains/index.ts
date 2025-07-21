import { baseSepolia } from "viem/chains";

export const chainsByIds = {
  84532: baseSepolia,
} as const;

export type ChainId = keyof typeof chainsByIds;

export const shielderConfigByChainId = {
  84532: {
    // Base Sepolia
    shielderContractAddress: "0x235FE8FaeC7716869fB1ABA6891C596e23bE122c",
    relayerUrl: "https://base-testnet-shielder-relayer-v3.test.blanksquare.dev",
  },
} as const;
