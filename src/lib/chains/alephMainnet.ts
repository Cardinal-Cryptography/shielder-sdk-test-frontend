import { defineChain } from "viem";

export const alephMainnet = defineChain({
  id: 41455,
  name: "Aleph Zero Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "AZERO",
    symbol: "AZERO",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.alephzero.raas.gelato.cloud"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://evm-explorer.alephzero.org",
    },
  },
});
