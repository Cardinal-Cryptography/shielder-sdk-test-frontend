import { useConfig } from "@/lib/context/useConfig";
import useWasm from "@/lib/context/useWasm";
import { useInsertTransaction } from "@/lib/transactions/newTransaction";
import { shielderClientStorage } from "@/lib/utils";
import {
  createShielderClient,
  ShielderTransaction,
} from "@cardinal-cryptography/shielder-sdk";
import { useQuery } from "@tanstack/react-query";
import { useChainId, useChains } from "wagmi";

export const useShielderClient = () => {
  const { shielderConfig, kek } = useConfig();
  const insertTransaction = useInsertTransaction();
  const { isWasmLoaded } = useWasm();
  const chains = useChains();
  const chainId = useChainId();

  const { data: shielderClient, error } = useQuery({
    queryKey: ["shielderClient", shielderConfig, isWasmLoaded, kek],
    queryFn: () => {
      if (!isWasmLoaded) {
        throw new Error("Wasm not loaded");
      }
      const currentConfig = chains.find((c) => c.id === chainId);
      if (!currentConfig) {
        throw new Error("Chain config not available");
      }
      const publicRpcUrl = currentConfig.rpcUrls.default.http[0];
      if (!shielderConfig) {
        throw new Error("Config not available");
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
      const client = createShielderClient(
        shielderConfig.shielderSeedKey as `0x${string}`,
        chainId,
        publicRpcUrl,
        shielderConfig.shielderContractAddress as `0x${string}`,
        shielderConfig.relayerAddress as `0x${string}`,
        shielderConfig.relayerUrl,
        shielderClientStorage,
        {
          onNewTransaction: async (tx: ShielderTransaction) => {
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
