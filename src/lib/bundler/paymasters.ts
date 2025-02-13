import { alephZero, alephZeroTestnet, arbitrum, base, optimism } from "viem/chains";
import { PimlicoClient } from "permissionless/clients/pimlico"
import { Hex } from "viem"
import { GetPaymasterDataParameters, GetPaymasterStubDataParameters } from "viem/account-abstraction"

const pimlicoApiKey = import.meta.env.VITE_PIMLICO_API_KEY as string;

export enum PaymasterKind {
  PIMLICO_ERC20,
  YOLO_ERC20,
  FREE_GAS,
  NATIVE
}

export interface Paymaster {
  kind: PaymasterKind;
  address: `0x${string}`;
  smartAccountSingletonPK?: `0x${string}`;
  bundlerUrl: string;
  token?: Token;
}

export interface Token {
  name: string;
  decimals: bigint;
  address: `0x${string}`;
}

export const paymasters: {
  [key: number]: Paymaster;
} = {
  [arbitrum.id]: 
    {
      kind: PaymasterKind.PIMLICO_ERC20,
      address: "0x0000000000000039cd5e8aE05257CE51C473ddd1",
      bundlerUrl: `https://api.pimlico.io/v2/arbitrum/rpc?apikey=${pimlicoApiKey}`,
      token: {
        name: "USDC",
        decimals: 6n,
        address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      },
    },
  [base.id]: 
    {
      kind: PaymasterKind.PIMLICO_ERC20,
      address: "0x0000000000000039cd5e8aE05257CE51C473ddd1",
      bundlerUrl: `https://api.pimlico.io/v2/base/rpc?apikey=${pimlicoApiKey}`,
      token: {
        name: "USDC",
        decimals: 6n,
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      },
    },
  [optimism.id]: 
    {
      kind: PaymasterKind.PIMLICO_ERC20,
      address: "0x0000000000000039cd5e8aE05257CE51C473ddd1",
      bundlerUrl: `https://api.pimlico.io/v2/optimism/rpc?apikey=${pimlicoApiKey}`,
      token: {
        name: "USDC",
        decimals: 6n,
        address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
      },
    },
  [alephZero.id]: 
    {
      kind: PaymasterKind.YOLO_ERC20,
      bundlerUrl: `https://api.pimlico.io/v2/alephzero/rpc?apikey=${pimlicoApiKey}`,
      address: "0x4B6017fb1ef6f90bEc1ebB41D0DE706c0c2Fb962",
      token: {
        name: "USDC",
        decimals: 6n,
        address: "0x18d25B4e18165c97e1285212e5d1f80eDD6d3Aa7",
      },
    },
  [alephZeroTestnet.id]: 
    {
      kind: PaymasterKind.NATIVE,
      address: "0xb3c551d16a4461435312Bc6faf50bb65A732fE7B",
      bundlerUrl: `https://api.pimlico.io/v2/alephzero-testnet/rpc?apikey=${pimlicoApiKey}`,
    },
};

export const createCustomPaymasterWithNoData = (pimlicoClient: PimlicoClient, paymaster: Paymaster) => {
    // Used Pimlico's suggested params for the paymaster object, from here:
    // https://docs.pimlico.io/permissionless/how-to/paymasters/use-custom-paymaster
    // from the ERC-20 paymaster tab, but replaced the erc20PaymasterAddress with own paymaster address.
    return {
        async getPaymasterData(parameters: GetPaymasterDataParameters) {
            const gasEstimates = await pimlicoClient.estimateUserOperationGas({
                ...parameters,
                paymaster: paymaster.address,
            })
            return {
                paymaster: paymaster.address,
                paymasterData: "0x" as Hex,
                paymasterPostOpGasLimit: gasEstimates.paymasterPostOpGasLimit ?? 0n,
                paymasterVerificationGasLimit: gasEstimates.paymasterVerificationGasLimit ?? 0n,
            }
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async getPaymasterStubData(_parameters: GetPaymasterStubDataParameters) {
            return {
                paymaster: paymaster.address,
                paymasterData: "0x" as Hex,
                paymasterVerificationGasLimit: 50_000n,
                paymasterPostOpGasLimit: 20_000n
            }
        }
    }
}
