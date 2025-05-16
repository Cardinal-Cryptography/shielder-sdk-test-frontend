/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Address,
  bytesToHex,
  Call,
  encodeFunctionData,
  Hex,
  http,
  PublicClient,
} from "viem";
import {
  IRelayer,
  QuotedFees,
  WithdrawResponse,
} from "@cardinal-cryptography/shielder-sdk/dist/chain/relayer";
import { Token } from "@cardinal-cryptography/shielder-sdk";
import { SHIELDER_ABI } from "./abis.ts";
import { createSharedAccountClient } from "./SharedAccount.ts";
import {
  PAYMASTER_VALIDATION_GAS_LIMIT,
  PAYMASTER_GAS_MARKUP_MULITPLIER,
} from "./ShielderPaymaster.ts";
import { SmartAccountClient } from "permissionless";
import { entryPoint07Address } from "viem/account-abstraction";
import { createPimlicoClient } from "permissionless/clients/pimlico";

// This should be passed as a parameter in withdraw and quoteFees e.g. "userOpCalls: Call[]"
const MOCK_CALLS: Call[] = [
  {
    to: "0x0000000000000000000000000000000000000000",
  },
];

export class BundlerRelayer implements IRelayer {
  publicClient: PublicClient;
  shielderAddress: Address;
  bundlerUrl: string;
  shielderPaymasterAddress: Address;
  constructor(
    publicClient: PublicClient,
    shielderAddress: Address,
    bundlerUrl: string,
    shielderPaymasterAddress: Address,
  ) {
    this.publicClient = publicClient;
    this.shielderAddress = shielderAddress;
    this.bundlerUrl = bundlerUrl;
    this.shielderPaymasterAddress = shielderPaymasterAddress;
  }

  smartAccountClient = async (
    paymasterData: Hex = "0x0",
    calls?: Call[],
  ): Promise<SmartAccountClient> => {
    return createSharedAccountClient(
      this.publicClient,
      this.shielderPaymasterAddress,
      this.bundlerUrl,
      paymasterData,
      calls,
    );
  };

  address = async (): Promise<Address> => {
    return new Promise((resolve) => {
      resolve(this.shielderPaymasterAddress);
    });
  };

  quoteFees = async (
    _token: Token,
    _pocketMoney: bigint,
  ): Promise<QuotedFees> => {
    // NOTE: we must use bundler's gas price estimation
    const gas_price = (
      await createPimlicoClient({
        chain: this.publicClient.chain,
        transport: http(this.bundlerUrl, {
          timeout: 120_000
        }),
        entryPoint: {
          address: entryPoint07Address,
          version: "0.7",
        },
      }).getUserOperationGasPrice()
    ).slow.maxFeePerGas;
    // get estimation for the user operation execution
    const gasEstimations = await (
      await this.smartAccountClient()
    ).estimateUserOperationGas({
      calls: MOCK_CALLS,
    });
    const totalGasLimit =
      gasEstimations.callGasLimit +
      gasEstimations.preVerificationGas +
      gasEstimations.verificationGasLimit +
      // PAYMASTER_VALIDATION_GAS_LIMIT;
    (PAYMASTER_VALIDATION_GAS_LIMIT * 135n) / 100n;
    console.log("GAS_PRICE");
    console.log(gas_price);
    const total_cost_native =
      gas_price * totalGasLimit * PAYMASTER_GAS_MARKUP_MULITPLIER;

    // TODO: fetch token prices and compute required cost in token
    const total_cost_fee_token = total_cost_native;

    return new Promise((resolve) => {
      resolve({
        fee_details: {
          total_cost_native,
          total_cost_fee_token,
          gas_cost_native: 0n,
          gas_cost_fee_token: 0n,
          relayer_cost_native: 0n,
          commission_native: 0n,
          commission_fee_token: 0n,
        },
        price_details: {
          gas_price,
          native_token_price: "0",
          native_token_unit_price: "0",
          fee_token_price: "0",
          fee_token_unit_price: "0",
          token_price_ratio: "0",
        },
      });
    });
  };
  withdraw = async (
    expectedContractVersion: `0x${string}`,
    token: Token,
    oldNullifierHash: bigint,
    newNote: bigint,
    merkleRoot: bigint,
    amount: bigint,
    proof: Uint8Array,
    withdrawalAddress: `0x${string}`,
    macSalt: bigint,
    macCommitment: bigint,
    _pocketMoney: bigint,
    quotedFees: QuotedFees,
  ): Promise<WithdrawResponse> => {
    const paymasterData = this.encodeWithdrawData(
      expectedContractVersion,
      token,
      oldNullifierHash,
      newNote,
      merkleRoot,
      amount,
      proof,
      withdrawalAddress,
      macSalt,
      macCommitment,
      quotedFees,
    );

    console.log("Sending user op");
    const tx_hash = await (
      await this.smartAccountClient(paymasterData, MOCK_CALLS)
    ).sendTransaction({
      calls: MOCK_CALLS,
    });
    console.log(`Withdraw tx hash: ${tx_hash}`);

    return { tx_hash };
  };

  private encodeWithdrawData(
    expectedContractVersion: `0x${string}`,
    token: Token,
    oldNullifierHash: bigint,
    newNote: bigint,
    merkleRoot: bigint,
    amount: bigint,
    proof: Uint8Array,
    withdrawalAddress: `0x${string}`,
    macSalt: bigint,
    macCommitment: bigint,
    quotedFees: QuotedFees,
  ): Hex {
    switch (token.type) {
      case "native":
        return encodeFunctionData({
          abi: SHIELDER_ABI,
          functionName: "withdrawNative",
          args: [
            expectedContractVersion,
            amount,
            withdrawalAddress,
            merkleRoot,
            oldNullifierHash,
            newNote,
            bytesToHex(proof),
            this.shielderPaymasterAddress,
            quotedFees.fee_details.total_cost_fee_token,
            macSalt,
            macCommitment,
          ],
        });
      case "erc20":
        return encodeFunctionData({
          abi: SHIELDER_ABI,
          functionName: "withdrawERC20",
          args: [
            expectedContractVersion,
            token.address,
            amount,
            withdrawalAddress,
            merkleRoot,
            oldNullifierHash,
            newNote,
            bytesToHex(proof),
            this.shielderPaymasterAddress,
            quotedFees.fee_details.total_cost_fee_token,
            macSalt,
            macCommitment,
          ],
        });
    }
  }
}
