import { Card, CardContent } from "@/components/ui/card";
import { useChainConfig } from "@/lib/context/useChainConfig";
import { useTransactions } from "@/lib/transactions/useTransactions";
import { formatEther } from "viem";

export const Transactions = () => {
  const transactions = useTransactions();
  const chainConfig = useChainConfig();
  if (!transactions)
    return (
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Transactions</h2>
          <p>No transactions found.</p>
        </CardContent>
      </Card>
    );
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Transactions</h2>
        <div className="h-[40vh] max-h-screen overflow-y-auto">
          <div className="space-y-2">
            {transactions
              .sort((a, b) => (a.date < b.date ? 1 : -1))
              .map((transaction) => (
                <div
                  key={transaction.txHash}
                  className="p-3 border rounded-lg flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">
                      {new Date(transaction.date).toLocaleTimeString() +
                        " " +
                        new Date(transaction.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.type}</p>
                    <a
                      className="text-blue-500 hover:underline"
                      href={
                        chainConfig!.explorerUrl + "/tx/" + transaction.txHash
                      }
                      target="_blank"
                    >
                      TxHash
                    </a>
                  </div>
                  {transaction.to && (
                    <a
                      className="text-blue-500 hover:underline"
                      href={
                        chainConfig!.explorerUrl + "/address/" + transaction.to
                      }
                      target="_blank"
                    >
                      sent to
                    </a>
                  )}
                  <p className="font-semibold">
                    {formatEther(transaction.amount) + " AZERO"}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
