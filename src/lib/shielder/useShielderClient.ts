import { useLocalSeed } from "@/lib/context/useLocalSeed";
import useWasm from "@/lib/context/useWasm";
import { useInsertTransaction } from "@/lib/transactions/newTransaction";
import {
  createShielderClient,
  erc20Token,
  nativeToken,
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
import { useTokenList } from "@/lib/tokens/useTokenList";
import { useTransactions } from "@/lib/transactions/useTransactions";

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
  const tokens = useTokenList();
  const { refetch: refetchTransactions } = useTransactions();

  // Create an array of token addresses for the query key

  return useQuery({
    queryKey: [
      "shielderClient",
      localSeedConfig,
      isWasmLoaded,
      chainData,
      tokens,
    ],
    queryFn: () => {
      if (!isWasmLoaded) {
        throw new Error("Wasm not loaded");
      }
      if (!chainData) {
        throw new Error("Chain not available");
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
      const publicRpcUrl = chain.rpcUrls.default.http[0];

      const client = createShielderClient(
        deriveShielderPrivateKey(
          localSeedConfig.seedMnemonicConfig?.shielderSeedMnemonic,
        ),
        chain.id,
        publicRpcUrl,
        shielderConfig.shielderContractAddress as `0x${string}`,
        shielderConfig.relayerUrl,
        fromLocalStorage(chain.id as ChainId),
        wasmCryptoClient!,
        {
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
        },
      );
      // Sync the native token
      client.syncShielderToken(nativeToken());

      // Sync all ERC20 tokens
      for (const token of tokens) {
        if (!token.isNative) {
          client.syncShielderToken(erc20Token(token.address as `0x${string}`));
        }
      }

      return client;
    },
  });
};
