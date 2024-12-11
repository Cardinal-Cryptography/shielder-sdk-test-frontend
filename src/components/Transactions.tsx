import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChainConfig } from "@/lib/context/useChainConfig";
import { useTransactions } from "@/lib/transactions/useTransactions";
import { formatEtherTrim } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, User } from "lucide-react";

const TransactionIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "DepositNative":
      return <ArrowDownLeft className="text-green-500" />;
    case "WithdrawNative":
      return <ArrowUpRight className="text-red-500" />;
    case "NewAccountNative":
      return <User className="text-blue-500" />;
    default:
      return null;
  }
};

const TransactionLabel = ({ type }: { type: string }) => {
  switch (type) {
    case "DepositNative":
      return <span className="text-green-500">Deposit</span>;
    case "WithdrawNative":
      return <span className="text-red-500">Withdraw</span>;
    case "NewAccountNative":
      return <span className="text-blue-500">New Account</span>;
    default:
      return null;
  }
};

const formatHash = (hash: string) => {
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
};

export const Transactions = () => {
  const transactions = useTransactions();
  const chainConfig = useChainConfig();
  if (!transactions || transactions.length === 0)
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
  return (
    <Card className="h-[45vh] max-h-screen overflow-y-auto">
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {transactions
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((transaction) => (
              <div
                key={transaction.txHash}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-50 rounded-full">
                    <TransactionIcon type={transaction.type} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <TransactionLabel type={transaction.type} />
                      <span className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <div>
                        <span>hash: </span>
                        <a
                          className="font-mono text-blue-500 hover:underline"
                          href={
                            chainConfig!.explorerUrl +
                            "/tx/" +
                            transaction.txHash
                          }
                          target="_blank"
                        >
                          {formatHash(transaction.txHash)}
                        </a>
                      </div>
                      <span className="font-mono"></span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.to && (
                        <div>
                          <span>to: </span>
                          <a
                            className="font-mono text-blue-500 hover:underline"
                            href={
                              chainConfig!.explorerUrl +
                              "/address/" +
                              transaction.to
                            }
                            target="_blank"
                          >
                            {formatHash(transaction.to)}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {formatEtherTrim(transaction.amount)} AZERO
                  </div>
                  <div className="text-sm text-gray-500">
                    Block #{transaction.block.toString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    Chain Fee: {formatEtherTrim(transaction.txFee)} AZERO
                  </div>
                  {transaction.relayerFee !== undefined && (
                    <div>
                      <div className="text-xs text-gray-400">
                        Relayer Fee:{" "}
                        {formatEtherTrim(
                          transaction.relayerFee - transaction.txFee,
                        )}{" "}
                        AZERO
                      </div>
                      <div className="text-xs text-gray-400">
                        Total Fee: {formatEtherTrim(transaction.relayerFee)}{" "}
                        AZERO
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
