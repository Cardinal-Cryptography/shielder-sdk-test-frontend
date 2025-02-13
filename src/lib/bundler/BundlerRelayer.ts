import { IRelayer } from "@cardinal-cryptography/shielder-sdk/__internal__";
import { toSimpleSmartAccount } from "permissionless/accounts";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { bytesToHex, http, PublicClient } from "viem";
import { entryPoint07Address } from "viem/account-abstraction";
import { privateKeyToAccount } from "viem/accounts";
import { Paymaster, PaymasterKind, createCustomPaymasterWithNoData } from "./paymasters";
import { createSmartAccountClient } from "permissionless";
import { sendUnshieldTransaction } from "./userOps";

// pivate key of the "owner" of the ERC-4337 SimpleAccount
// anyone can use it to withdraw from the shielder
const SINGLETON_PK = "0xedf13d9f403d84d88f76449a34b19a0388b110a1a5d447c0ef93db036df1ff50";
// 0.15 azero because @woocash2 deployed a very greedy paymaster :/
// (1.5 * actual cost of the operation + some constant)
const FLAT_TOTAL_FEE = BigInt(1.5 * 10 ** 17);

export class BundlerRelayer implements IRelayer {
  address: `0x${string}`;
  shielderAddress: `0x${string}`;
  publicClient: PublicClient;
  paymaster: Paymaster;
  constructor(
    shielderAddress: `0x${string}`,
    publicClient: PublicClient,
    paymaster: Paymaster,
  ) {
    this.address = paymaster.address;
    this.shielderAddress = shielderAddress;
    this.publicClient = publicClient;
    this.paymaster = paymaster;
  }

  initSmartAccount = async () => {
    const pimlicoClient = createPimlicoClient({
      chain: this.publicClient.chain,
      transport: http(this.paymaster.bundlerUrl),
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      },
    });

    const owner = privateKeyToAccount(SINGLETON_PK);
    const simpleSmartAccount = await toSimpleSmartAccount({
      owner,
      client: this.publicClient,
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      },
    });

    const paymaster =
    this.paymaster.kind == PaymasterKind.PIMLICO_ERC20
        ? pimlicoClient
        : createCustomPaymasterWithNoData(pimlicoClient, this.paymaster);

    // Client used to fill userOp object with data, and send requests to the bundler
    return createSmartAccountClient({
      account: simpleSmartAccount,
      chain: this.publicClient.chain,
      bundlerTransport: http(this.paymaster.bundlerUrl),
      paymaster,
      userOperation: {
        estimateFeesPerGas: async () => {
          return (await pimlicoClient.getUserOperationGasPrice()).fast;
        },
      },
    });
  };

  quoteFees = async () => {
    return {
      base_fee: 0n,
      relay_fee: 0n,
      total_fee: FLAT_TOTAL_FEE,
    };
  };

  withdraw = async (
    expectedContractVersion: `0x${string}`,
    idHiding: bigint,
    oldNullifierHash: bigint,
    newNote: bigint,
    merkleRoot: bigint,
    amount: bigint,
    proof: Uint8Array,
    withdrawAddress: `0x${string}`,
  ) => {
    const smartAccountClient = await this.initSmartAccount();
    const tx_hash = await sendUnshieldTransaction(
      smartAccountClient,
      this.shielderAddress,
      [
        expectedContractVersion,
        idHiding,
        amount,
        withdrawAddress,
        merkleRoot,
        oldNullifierHash,
        newNote,
        bytesToHex(proof),
        this.address,
        FLAT_TOTAL_FEE,
      ],
    );

    return { tx_hash };
  };
}
