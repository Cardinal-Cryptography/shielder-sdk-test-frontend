import { IRelayer } from "@cardinal-cryptography/shielder-sdk/__internal__";
import { Address, bytesToHex, Hex, PublicClient } from "viem";
import { Paymaster } from "./paymasters";
import { getNonceKeyForWithdrawNative, sendWIthdrawNativeTransaction, WithdrawNativeArgs } from "./userOps";
import { toSharedAccountClient } from "./toSharedAccount";

// 0.15 azero because @woocash2 deployed a very greedy paymaster :/
// (1.5 * actual cost of the operation + some constant)
const FLAT_TOTAL_FEE = 15n * 10n ** 16n;

export class BundlerRelayer implements IRelayer {
  address: Address; // paymaster address
  shielderAddress: Address;
  publicClient: PublicClient;
  paymaster: Paymaster;
  constructor(
    shielderAddress: Address,
    publicClient: PublicClient,
    paymaster: Paymaster,
  ) {
    this.address = paymaster.address;
    this.shielderAddress = shielderAddress;
    this.publicClient = publicClient;
    this.paymaster = paymaster;
  }

  quoteFees = async () => {
    return {
      base_fee: 0n,
      relay_fee: 0n,
      total_fee: FLAT_TOTAL_FEE,
    };
  };

  withdraw = async (
    expectedContractVersion: Hex,
    idHiding: bigint,
    oldNullifierHash: bigint,
    newNote: bigint,
    merkleRoot: bigint,
    amount: bigint,
    proof: Uint8Array,
    withdrawAddress: Address,
  ) => {
    const args = [
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
    ] as WithdrawNativeArgs;
    const nonceKey = getNonceKeyForWithdrawNative(this.shielderAddress, args);
    const smartAccountClient = await toSharedAccountClient(this.publicClient, this.paymaster, nonceKey);
    console.log("Sending user op");
    const tx_hash = await sendWIthdrawNativeTransaction(
      smartAccountClient,
      this.shielderAddress,
      args,
    );
    console.log(`Withdraw tx hash: ${tx_hash}`);
    return { tx_hash };
  };

}
