import {
  Chain,
  createWalletClient,
  defineChain,
  http,
  HttpTransport,
  PrivateKeyAccount,
  publicActions,
  PublicClient,
  PublicRpcSchema,
  WalletClient,
  WalletRpcSchema,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { createNonceManager, jsonRpc } from "viem/nonce";

const chainName = "devnet";
const chainNativeCurrency = {
  name: "AZERO",
  symbol: "AZERO",
  decimals: 18,
};

export const createAccount = (
  privateKey: `0x${string}`,
  chainId: number,
  rpcHttpEndpoint: string,
): WalletClient<HttpTransport, Chain, PrivateKeyAccount, WalletRpcSchema> &
  PublicClient<HttpTransport, Chain, PrivateKeyAccount, PublicRpcSchema> => {
  const nonceManager = createNonceManager({
    source: jsonRpc(),
  });
  const privateKeyAccount: PrivateKeyAccount = privateKeyToAccount(privateKey, {
    nonceManager,
  }) as PrivateKeyAccount;
  const account = createWalletClient({
    account: privateKeyAccount,
    chain: defineChain({
      name: chainName,
      id: chainId,
      rpcUrls: {
        default: {
          http: [rpcHttpEndpoint],
        },
      },
      nativeCurrency: chainNativeCurrency,
    }),
    transport: http(),
  }).extend(publicActions);
  return account;
};

export type SeededAccount = ReturnType<typeof createAccount>;
