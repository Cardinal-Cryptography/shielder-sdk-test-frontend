import { type Transactions as TransactionsType } from "@/lib/storage/transactions";

// Transaction type enum
export enum TransactionType {
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
  NEW_ACCOUNT = "NewAccount",
}

// Transaction item type
export type Transaction = TransactionsType[number];

// Transaction list type
export type TransactionList = TransactionsType;
