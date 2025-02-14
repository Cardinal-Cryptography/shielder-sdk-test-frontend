import { Call } from "node_modules/viem/_types/types/calls";
import { SmartAccountClient } from "permissionless";
import {
  Address,
  bytesToBigInt,
  encodeFunctionData,
  Hex,
  hexToBytes,
  keccak256,
} from "viem";
import { SHIELDER_ABI, SMART_ACCOUNT_ABI } from "./abis";

export type WithdrawNativeArgs = [
  Hex,
  bigint,
  bigint,
  Address,
  bigint,
  bigint,
  bigint,
  Hex,
  Address,
  bigint,
];

export const sendWIthdrawNativeTransaction = async (
  smartAccountClient: SmartAccountClient,
  shielderAddress: Address,
  args: WithdrawNativeArgs,
) => {
  return await smartAccountClient.sendTransaction({
    calls: [
      {
        to: shielderAddress,
        abi: SHIELDER_ABI,
        functionName: "withdrawNative",
        args,
      },
    ],
  });
};

export const getNonceKeyForWithdrawNative = (
  shielderAddress: Address,
  args: WithdrawNativeArgs,
): bigint => {
  const hash = hexToBytes(
    keccak256(
      encodeCalls([
        {
          to: shielderAddress,
          data: encodeFunctionData({
            abi: SHIELDER_ABI,
            functionName: "withdrawNative",
            args,
          }),
        },
      ]),
    ),
  );
  const key = hash.slice(0, 24);
  return bytesToBigInt(key);
};

function encodeCalls(calls: Call[]) {
  if (calls.length === 1)
    return encodeFunctionData({
      abi: SMART_ACCOUNT_ABI,
      functionName: "execute",
      args: [calls[0].to, calls[0].value ?? 0n, calls[0].data ?? "0x"],
    });
  return encodeFunctionData({
    abi: SMART_ACCOUNT_ABI,
    functionName: "executeBatch",
    args: [
      calls.map((call) => ({
        data: call.data ?? "0x",
        target: call.to,
        value: call.value ?? 0n,
      })),
    ],
  });
}
