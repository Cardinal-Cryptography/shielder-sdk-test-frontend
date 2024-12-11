import { z } from "zod";

const storageKey = "transactions";

const validateBigInt = z.string().transform((value, ctx) => {
  try {
    return BigInt(value);
  } catch {
    ctx.addIssue({
      message: "Invalid bigint string.",
      code: z.ZodIssueCode.custom,
      fatal: true,
    });
    return z.NEVER;
  }
});

const validateTxHash = z
  .string()
  .regex(/^0x[0-9a-fA-F]{64}$/)
  .transform((val) => val as `0x${string}`);

/**
 * 
export type ShielderTransaction = {
    type: "NewAccountNative" | "DepositNative" | "WithdrawNative";
    amount: bigint;
    to?: Address;
    txHash: Hex;
    block: bigint;
};
 */

const transactionsSchema = z.array(
  z.object({
    type: z.enum(["NewAccountNative", "DepositNative", "WithdrawNative"]),
    amount: validateBigInt,
    to: z.string().optional(),
    txHash: validateTxHash,
    block: validateBigInt,
    date: z.number(),
    txFee: validateBigInt,
    relayerFee: validateBigInt.optional(),
  }),
);

export type Transactions = z.infer<typeof transactionsSchema>;

export const fromLocalStorage = (): Transactions | null => {
  const transactions = localStorage.getItem(storageKey);
  if (!transactions) {
    return null;
  }
  const parsed = transactionsSchema.parse(JSON.parse(transactions));
  return parsed;
};

export const save = (transactions: Transactions) => {
  const stringValue = JSON.stringify(transactions, (_, value): string =>
    typeof value === "bigint" ? value.toString() : value,
  );
  localStorage.setItem(storageKey, stringValue);
};

export const clear = () => {
  localStorage.removeItem(storageKey);
};
