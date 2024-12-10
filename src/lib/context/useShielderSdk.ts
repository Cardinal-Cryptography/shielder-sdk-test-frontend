import { useChainConfig } from "@/lib/context/useChainConfig";
import { useShielderConfig } from "@/lib/context/useShielderConfig";
import useWasm from "@/lib/context/useWasm";
import { useInsertTransaction } from "@/lib/transactions/newTransaction";
import { shielderClientStorage } from "@/lib/utils";
import {
  createShielderClient,
  ShielderTransaction,
} from "@cardinal-cryptography/shielder-sdk";
import { useQuery } from "@tanstack/react-query";

export const useShielderSdk = () => {
  const shielderConfig = useShielderConfig();
  const chainConfig = useChainConfig();
  const insertTransaction = useInsertTransaction();
  const { isWasmLoaded } = useWasm();

  const { data: shielderClient, error } = useQuery({
    queryKey: ["shielderClient", shielderConfig, chainConfig, isWasmLoaded],
    queryFn: () => {
      if (!isWasmLoaded) {
        throw new Error("Wasm not loaded");
      }
      if (!shielderConfig) {
        throw new Error("Config not available");
      }
      if (!chainConfig) {
        throw new Error("Chain config not available");
      }
      if (!shielderConfig.shielderSeedKey) {
        throw new Error("Shielder seed key not available");
      }
      if (!shielderConfig.shielderContractAddress) {
        throw new Error("Shielder contract address not available");
      }
      if (!shielderConfig.relayerAddress) {
        throw new Error("Relayer address not available");
      }
      if (!shielderConfig.relayerUrl) {
        throw new Error("Relayer URL not available");
      }
      if (!chainConfig.publicRpcUrl) {
        throw new Error("Public RPC URL not available");
      }
      if (!chainConfig.chainId) {
        throw new Error("Chain ID not available");
      }
      const client = createShielderClient(
        shielderConfig.shielderSeedKey as `0x${string}`,
        parseInt(chainConfig.chainId),
        chainConfig.publicRpcUrl,
        shielderConfig.shielderContractAddress as `0x${string}`,
        shielderConfig.relayerAddress as `0x${string}`,
        shielderConfig.relayerUrl,
        shielderClientStorage,
        {
          onNewTransaction: async (tx: ShielderTransaction) => {
            console.log("New transaction", tx);
            await insertTransaction.mutateAsync(tx);
          },
        },
      );
      client.syncShielder();
      return client;
    },
  });
  return { shielderClient, error };
};
