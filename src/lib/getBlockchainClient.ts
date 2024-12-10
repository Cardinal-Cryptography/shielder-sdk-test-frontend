import { ChainConfig } from "@/lib/storage/chainConfig";
import { ShielderConfig } from "@/lib/storage/shielderConfig";
import { createWalletClient, defineChain, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export const getBlockchainClient = async (
  chainConfig: ChainConfig,
  shielderConfig: ShielderConfig,
) => {
  if (!chainConfig) {
    throw new Error("Chain config not available");
  }
  if (!shielderConfig) {
    throw new Error("Shielder config not available");
  }
  if (!chainConfig.chainId) {
    throw new Error("Chain ID not available");
  }
  if (!chainConfig.publicRpcUrl) {
    throw new Error("Public RPC URL not available");
  }
  if (!shielderConfig.publicAccountKey) {
    throw new Error("Public account key not available");
  }
  const chain = defineChain({
    id: parseInt(chainConfig.chainId),
    name: "chain",
    nativeCurrency: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    rpcUrls: {
      default: {
        http: [chainConfig.publicRpcUrl],
      },
    },
  });
  const account = privateKeyToAccount(
    shielderConfig.publicAccountKey as `0x${string}`,
  );
  const publicClient = createWalletClient({
    account,
    chain,
    transport: http(),
  }).extend(publicActions);
  return publicClient;
};
