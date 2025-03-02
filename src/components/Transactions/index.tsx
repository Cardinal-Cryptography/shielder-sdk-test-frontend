import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/lib/transactions/useTransactions";
import { useMemo } from "react";
import { TransactionItem } from "./TransactionItem";
import { useChain } from "@/lib/context/useChain";

export const Transactions = () => {
  const { data: chainData } = useChain();
  const { data: transactions } = useTransactions();

  const blockExplorerUrl = chainData?.chain.blockExplorers?.default.url;

  const sortedTransactions = useMemo(
    () =>
      transactions
        ? [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1))
        : [],
    [transactions],
  );

  // Early return for empty transactions
  if (!transactions || transactions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-gray-500">
          No transactions found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[45vh] max-h-screen overflow-y-auto">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {sortedTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.txHash}
              transaction={transaction}
              blockExplorerUrl={blockExplorerUrl}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
