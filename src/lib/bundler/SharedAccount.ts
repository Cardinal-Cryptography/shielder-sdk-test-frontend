import { toSimpleSmartAccount } from "permissionless/accounts";
import { entryPoint07Address, SmartAccount } from "viem/account-abstraction";
import { privateKeyToAccount } from "viem/accounts";
import { createSmartAccountClient, SmartAccountClient } from "permissionless";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import {
  Address,
  bytesToBigInt,
  Call,
  encodePacked,
  Hex,
  hexToBytes,
  keccak256,
  PublicClient,
  http,
} from "viem";
import { createShielderPaymaster } from "./ShielderPaymaster.ts";

// Address of the Shared Account instance
const SHARED_ACCOUNT_ADDRESS = "0x8bd839145f330840E9451bfBfC4a05451c06033B";

// Mocks needed to use pimilicos `toSimpleSmartAccount(...)`
// https://github.com/pimlicolabs/permissionless.js/blob/main/packages/permissionless/accounts/simple/toSimpleSmartAccount.ts
// TODO: create SharedAccount class that extends SmartAccount
const MOCK_PK =
  "0xedf13d9f403d84d88f76449a34b19a0388b110a1a5d447c0ef93db036df1ff50";
const MOCK_ADDRESS = "0x16098Aa4e6fD54bae9733A5f43Ef4ab001b12f8d";

export const toSharedAccount = async (
  client: PublicClient,
  nonceKey?: bigint,
): Promise<SmartAccount> => {
  return await toSimpleSmartAccount({
    owner: privateKeyToAccount(MOCK_PK),
    address: SHARED_ACCOUNT_ADDRESS,
    nonceKey,
    factoryAddress: MOCK_ADDRESS,
    client,
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
  });
};

export const createSharedAccountClient = async (
  client: PublicClient,
  paymasterAddress: Address,
  bundlerUrl: string,
  paymasterData: Hex,
  calls?: Call[],
): Promise<SmartAccountClient> => {
  const pimlicoClient = createPimlicoClient({
    chain: client.chain,
    transport: http(bundlerUrl, {
      timeout: 120_000 
    }),
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
  });

  const userOpCalldata = await (
    await toSharedAccount(client)
  ).encodeCalls(
    calls ?? [
      {
        to: "0x0000000000000000000000000000000000000000",
      },
    ],
  );
  const nonceKey = calculateNonceKey(userOpCalldata, paymasterData);

  return createSmartAccountClient({
    account: await toSharedAccount(client, nonceKey),
    chain: client.chain,
    bundlerTransport: http(bundlerUrl,{
      timeout: 120_000
    }),
    paymaster: createShielderPaymaster(paymasterAddress, paymasterData),
    userOperation: {
      estimateFeesPerGas: async () => {
        // return (await pimlicoClient.getUserOperationGasPrice()).fast;
        return (await pimlicoClient.getUserOperationGasPrice()).slow;
      },
    },
  });
};

const calculateNonceKey = (
  userOpCalldata: Hex,
  paymasterData?: Hex,
): bigint => {
  const hash = hexToBytes(
    keccak256(
      paymasterData
        ? encodePacked(["bytes", "bytes"], [userOpCalldata, paymasterData])
        : userOpCalldata,
    ),
  );
  const key = hash.slice(0, 24);
  return bytesToBigInt(key);
};
