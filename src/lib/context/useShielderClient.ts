import { useConfig } from "@/lib/context/useConfig";
import useWasm from "@/lib/context/useWasm";
import { useInsertTransaction } from "@/lib/transactions/newTransaction";
import { shielderClientStorage } from "@/lib/utils";
import {
  createShielderClient,
  ShielderTransaction,
} from "@cardinal-cryptography/shielder-sdk";
import { useQuery } from "@tanstack/react-query";
import { mnemonicToAccount } from "viem/accounts";
import { sha256 } from "viem";
import { useChains } from "wagmi";
import { useSaveLatestProof } from "@/lib/context/useSaveLatestProof";
import { useToast } from "@/lib/context/useToast";
import { useChainId } from "@/lib/context/useChainId";

const SHIELDER_PRIVATE_ACCOUNT_DERIVATION_PATH = {
  accountIndex: 603302,
  //            COMMON
};

const deriveShielderPrivateKey = (mnemonic: string) => {
  const baseAccountForShielder = mnemonicToAccount(
    mnemonic,
    SHIELDER_PRIVATE_ACCOUNT_DERIVATION_PATH,
  );
  const { privateKey } = baseAccountForShielder.getHdKey();
  if (!privateKey) {
    throw new Error("Private key not available");
  }
  return sha256(privateKey);
};

export const useShielderClient = () => {
  const { shielderConfig, kek } = useConfig();
  const insertTransaction = useInsertTransaction();
  const { isWasmLoaded } = useWasm();
  const chains = useChains();
  const chainId = useChainId();
  const { saveLatestProof } = useSaveLatestProof();
  const { toast } = useToast();

  const { data: shielderClient, error } = useQuery({
    queryKey: ["shielderClient", shielderConfig, isWasmLoaded, chainId, kek],
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
      if (!shielderConfig.shielderSeedMnemonic) {
        throw new Error("Shielder seed mnemonic not available");
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
      if (!chainId) {
        throw new Error("Chain ID not available");
      }
      const client = createShielderClient(
        deriveShielderPrivateKey(shielderConfig.shielderSeedMnemonic),
        chainId,
        publicRpcUrl,
        shielderConfig.shielderContractAddress as `0x${string}`,
        shielderConfig.relayerAddress as `0x${string}`,
        shielderConfig.relayerUrl,
        shielderClientStorage,
        {
          onNewTransaction: async (tx: ShielderTransaction) => {
            await insertTransaction.mutateAsync(tx);
            toast({
              title: "Transaction completed",
              description: `Transaction ${tx.type} completed`,
            });
          },
          onCalldataGenerated: async (calldata) => {
            saveLatestProof.mutate(calldata.provingTimeMillis);
            toast({
              title: "Proof generated",
              description: `Proof generated in ${calldata.provingTimeMillis}ms`,
            });
          },
        },
      );
      client.syncShielder();
      return client;
    },
  });
  return { shielderClient, error };
};
