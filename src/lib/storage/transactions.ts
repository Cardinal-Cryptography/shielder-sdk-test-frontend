import { ChainId } from "@/lib/chains";
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

// Token schema based on the shielder-sdk Token type
const tokenSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("native") }),
  z.object({
    type: z.literal("erc20"),
    address: z
      .string()
      .regex(/^0x[0-9a-fA-F]+$/)
      .transform((val) => val as `0x${string}`),
  }),
]);

const transactionsSchema = z.array(
  z.object({
    type: z.enum(["NewAccount", "Deposit", "Withdraw"]),
    amount: validateBigInt,
    to: z.string().optional(),
    txHash: validateTxHash,
    block: validateBigInt,
    date: z.number(),
    txFee: validateBigInt,
    relayerFee: validateBigInt.optional(),
    token: tokenSchema,
  }),
);

export type Transactions = z.infer<typeof transactionsSchema>;

export const fromLocalStorage = (chainId: ChainId): Transactions | null => {
  const transactions = localStorage.getItem(storageKey + chainId.toString());
  if (!transactions) {
    return null;
  }
  const parsed = transactionsSchema.parse(JSON.parse(transactions));
  return parsed;
};

export const save = (chainId: ChainId, transactions: Transactions) => {
  const stringValue = JSON.stringify(transactions, (_, value): string =>
    typeof value === "bigint" ? value.toString() : value,
  );
  localStorage.setItem(storageKey + chainId.toString(), stringValue);
};

export const clear = (chainId: ChainId) => {
  localStorage.removeItem(storageKey + chainId.toString());
};
