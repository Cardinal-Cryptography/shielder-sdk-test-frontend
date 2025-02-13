import { IRelayer } from "@cardinal-cryptography/shielder-sdk/__internal__";
import { toSimpleSmartAccount } from "permissionless/accounts";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { bytesToHex, http, PublicClient } from "viem";
import { entryPoint07Address } from "viem/account-abstraction";
import { privateKeyToAccount } from "viem/accounts";
import { Paymaster, PaymasterKind, createCustomPaymasterWithNoData } from "./paymasters";
import { createSmartAccountClient } from "permissionless";
import { sendUnshieldTransaction } from "./userOps";
import { ShielderConfig } from "../storage/shielderConfig";

export class BundlerRelayer implements IRelayer {
  address: `0x${string}`;
  shielderConfig: ShielderConfig;
  publicClient: PublicClient;
  paymaster: Paymaster;
  pk: `0x${string}`;
  constructor(
    shielderConfig: ShielderConfig,
    publicClient: PublicClient,
    pk: `0x${string}`,
    paymaster: Paymaster,
  ) {
    this.address = shielderConfig.relayerAddress! as `0x${string}`;
    this.shielderConfig = shielderConfig;
    this.publicClient = publicClient;
    this.pk = pk;
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

    const owner = privateKeyToAccount(this.pk);
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
      total_fee: 0n,
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
      this.shielderConfig!.shielderContractAddress! as `0x${string}`,
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
        0n,
      ],
    );

    return { tx_hash };
  };
}
