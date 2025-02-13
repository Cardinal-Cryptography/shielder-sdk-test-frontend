import { useConfig } from "@/lib/context/useConfig";
import useWasm from "@/lib/context/useWasm";
import { useInsertTransaction } from "@/lib/transactions/newTransaction";
import { shielderClientStorage } from "@/lib/utils";
import { ShielderTransaction } from "@cardinal-cryptography/shielder-sdk";
import { useQuery } from "@tanstack/react-query";
import { mnemonicToAccount } from "viem/accounts";
import { createPublicClient, defineChain, http, sha256 } from "viem";
import { useChains } from "wagmi";
import { useSaveLatestProof } from "@/lib/context/useSaveLatestProof";
import { useToast } from "@/lib/context/useToast";
import { useChainId } from "@/lib/context/useChainId";
import { ShielderClient } from "@cardinal-cryptography/shielder-sdk/__internal__";
import { Contract } from "@cardinal-cryptography/shielder-sdk/__internal__";
import { BundlerRelayer } from "../bundler/BundlerRelayer";
import { paymasters } from "../bundler/paymasters";

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
  const { shielderConfig, seedMnemonicConfig, kek } = useConfig();
  const insertTransaction = useInsertTransaction();
  const { isWasmLoaded } = useWasm();
  const chains = useChains();
  const chainId = useChainId();
  const { saveLatestProof } = useSaveLatestProof();
  const { toast } = useToast();

  const { data: shielderClient, error } = useQuery({
    queryKey: [
      "shielderClientWithBundler",
      shielderConfig,
      seedMnemonicConfig,
      isWasmLoaded,
      chainId,
      kek,
    ],
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
      if (!seedMnemonicConfig) {
        throw new Error("Seed mnemonic config not available");
      }
      if (!seedMnemonicConfig.shielderSeedMnemonic) {
        throw new Error("Shielder seed mnemonic not available");
      }
      if (!shielderConfig.shielderContractAddress) {
        throw new Error("Shielder contract address not available");
      }
      if (!shielderConfig.paymasterAddress) {
        throw new Error("Paymaster address not available");
      }
      if (!shielderConfig.bundlerUrl) {
        throw new Error("Bundler URL not available");
      }
      if (!chainId) {
        throw new Error("Chain ID not available");
      }

      const publicClient = createPublicClient({
        chain: defineChain({
          name: "chain",
          id: chainId,
          rpcUrls: {
            default: {
              http: [publicRpcUrl],
            },
          },
          nativeCurrency: {
            name: "AZERO",
            symbol: "AZERO",
            decimals: 18,
          },
        }),
        transport: http(),
      });
      const contract = new Contract(
        publicClient,
        shielderConfig.shielderContractAddress as `0x${string}`,
      );

      const bundlerRelayer = new BundlerRelayer(
        shielderConfig.shielderContractAddress! as `0x${string}`,
        publicClient,
        paymasters[chainId],
      );

      const client = new ShielderClient(
        deriveShielderPrivateKey(seedMnemonicConfig.shielderSeedMnemonic),
        contract,
        bundlerRelayer,
        shielderClientStorage,
        publicClient,
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
