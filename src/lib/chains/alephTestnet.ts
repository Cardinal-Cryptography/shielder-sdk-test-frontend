import { defineChain } from "viem";

export const alephTestnet = defineChain({
  id: 2039,
  name: "Aleph Zero Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "TZERO",
    symbol: "TZERO",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.alephzero-testnet.gelato.digital"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://evm-explorer-testnet.alephzero.org",
    },
  },
});
