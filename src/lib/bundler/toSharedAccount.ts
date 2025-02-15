import { toSimpleSmartAccount } from "permissionless/accounts";
import { http, PublicClient } from "viem";
import { entryPoint07Address } from "viem/account-abstraction";
import { privateKeyToAccount } from "viem/accounts";
import { createPaymaster, Paymaster } from "./paymasters";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { createSmartAccountClient } from "permissionless";

// Address of the Shared Account instance
const SHARED_ACCOUNT_ADDRESS = "0x1AE8160D9724D7644CC5f9872d0DAE295Da2debA";

// Mocks needed to use pimilicos `toSimpleAccount(...)`
const MOCK_PK = "0xedf13d9f403d84d88f76449a34b19a0388b110a1a5d447c0ef93db036df1ff50";
const MOCK_ADDRESS = "0x16098Aa4e6fD54bae9733A5f43Ef4ab001b12f8d";

export const toSharedAccountClient = async (publicClient: PublicClient, paymaster: Paymaster, bundlerUrl: string, nonceKey: bigint) => {    
    const sharedAccount = await toSimpleSmartAccount({
      owner: privateKeyToAccount(MOCK_PK),
      address: SHARED_ACCOUNT_ADDRESS,
      nonceKey,
      factoryAddress: MOCK_ADDRESS,
      client: publicClient,
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      },
    });

    const pimlicoClient = createPimlicoClient({
      chain: publicClient.chain,
      transport: http(bundlerUrl),
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      },
    });

    // Client used to fill userOp object with data, and send requests to the bundler
    return createSmartAccountClient({
      account: sharedAccount,
      chain: publicClient.chain,
      bundlerTransport: http(bundlerUrl),
      paymaster: createPaymaster(pimlicoClient, paymaster),
      userOperation: {
        estimateFeesPerGas: async () => {
          return (await pimlicoClient.getUserOperationGasPrice()).fast;
        },
      },
    });
}
