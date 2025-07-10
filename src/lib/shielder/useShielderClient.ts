import { useLocalSeed } from "@/lib/context/useLocalSeed";
import useWasm from "@/lib/context/useWasm";
import { useInsertTransaction } from "@/lib/transactions/newTransaction";
import {
  createShielderClient,
  ShielderTransaction,
} from "@cardinal-cryptography/shielder-sdk";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mnemonicToAccount } from "viem/accounts";
import { sha256 } from "viem";
import { useSaveLatestProof } from "@/lib/shielder/useSaveLatestProof";
import { useToast } from "@/lib/context/useToast";
import { wasmCryptoClient } from "@/lib/providers/WasmProvider";
import { useChain } from "@/lib/context/useChain";
import { ChainId } from "@/lib/chains";
import { fromLocalStorage } from "@/lib/storage/shielderClient";
import { useTransactions } from "@/lib/transactions/useTransactions";
import { usePublicClient } from "wagmi";

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
  const queryClient = useQueryClient();
  const { data: localSeedConfig } = useLocalSeed();
  const { isWasmLoaded } = useWasm();
  const { data: chainData } = useChain();
  const { saveLatestProof } = useSaveLatestProof();
  const insertTransaction = useInsertTransaction();
  const { toast } = useToast();
  const { refetch: refetchTransactions } = useTransactions();

  const publicClient = usePublicClient({
    chainId: chainData?.chain.id,
  });

  // Create an array of token addresses for the query key

  return useQuery({
    queryKey: [
      "shielderClient",
      localSeedConfig,
      isWasmLoaded,
      chainData,
      publicClient,
    ],
    queryFn: () => {
      if (!isWasmLoaded) {
        throw new Error("Wasm not loaded");
      }
      if (!chainData) {
        throw new Error("Chain not available");
      }
      if (!publicClient) {
        throw new Error("Public client not available");
      }
      const { chain, shielderConfig } = chainData;
      if (!localSeedConfig.seedMnemonicConfig?.shielderSeedMnemonic) {
        throw new Error("Configure Shielder seed mnemonic");
      }
      if (!shielderConfig.shielderContractAddress) {
        throw new Error("Shielder contract address not available");
      }
      if (!shielderConfig.relayerUrl) {
        throw new Error("Relayer URL not available");
      }

      const client = createShielderClient({
        shielderSeedPrivateKey: deriveShielderPrivateKey(
          localSeedConfig.seedMnemonicConfig
            ?.shielderSeedMnemonic as `0x${string}`,
        ),
        chainId: BigInt(chain.id),
        publicClient,
        contractAddress:
          shielderConfig.shielderContractAddress as `0x${string}`,
        relayerUrl: shielderConfig.relayerUrl,
        storage: fromLocalStorage(chain.id as ChainId),
        cryptoClient: wasmCryptoClient!,
        callbacks: {
          onNewTransaction: async (tx: ShielderTransaction) => {
            await insertTransaction.mutateAsync(tx);
            toast({
              title: "Transaction completed",
              description: `Transaction ${tx.type} completed`,
            });
            refetchTransactions();
            queryClient.invalidateQueries({
              queryKey: ["tokenBalance", tx.token],
            });
          },
          onCalldataGenerated: async (calldata) => {
            saveLatestProof.mutate(calldata.provingTimeMillis);
            toast({
              title: "Proof generated",
              description: `Proof generated in ${calldata.provingTimeMillis}ms`,
            });
          },
          onAccountNotOnChain: async (error, stage, operation) => {
            toast({
              title: "Account not on chain",
              description: `Account not found on chain during ${stage} for operation ${operation}. Please ensure the account is funded and try again.`,
              variant: "destructive",
            });
            console.error(
              `Account not found on chain during ${stage} for operation ${operation}:`,
              error,
            );
          },
          onSdkOutdated: async (error, stage, operation) => {
            toast({
              title: "SDK Outdated",
              description: `The Shielder SDK is outdated. Please update to the latest version to continue using the service.`,
              variant: "destructive",
            });
            console.error(
              `Shielder SDK is outdated during ${stage} for operation ${operation}:`,
              error,
            );
          },
        },
      });
      // Sync the native token
      client.syncShielder();

      return client;
    },
  });
};
