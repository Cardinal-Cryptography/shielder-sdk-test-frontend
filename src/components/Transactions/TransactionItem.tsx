import { useTokenList } from "@/lib/context/useTokenList";
import { formatEtherTrim, formatHash } from "@/lib/utils";
import { Transaction } from "./types";
import {
  TransactionTypeIcon,
  TransactionTypeLabel,
} from "./TransactionTypeDisplay";
import { useMemo } from "react";
import { ERC20Token } from "@cardinal-cryptography/shielder-sdk";

interface TransactionItemProps {
  transaction: Transaction;
  blockExplorerUrl?: string;
}

export const TransactionItem = ({
  transaction,
  blockExplorerUrl,
}: TransactionItemProps) => {
  const tokenList = useTokenList();

  const formattedDate = useMemo(
    () => new Date(transaction.date).toLocaleString(),
    [transaction.date],
  );

  const netAmount = useMemo(
    () => transaction.amount - (transaction.relayerFee ?? 0n),
    [transaction.amount, transaction.relayerFee],
  );

  const relayerProfit = useMemo(
    () =>
      transaction.relayerFee !== undefined
        ? transaction.relayerFee - transaction.txFee
        : 0n,
    [transaction.relayerFee, transaction.txFee],
  );

  const tokenSymbol = useMemo(() => {
    if (!transaction.token) return tokenList[0].symbol; // Default to native token

    if (transaction.token.type === "native") {
      return tokenList[0].symbol; // Native token is always first in the list
    } else if (transaction.token.type === "erc20") {
      // Find the matching ERC20 token by address
      const erc20Token = tokenList.find(
        (t) =>
          !t.isNative &&
          t.address!.toLowerCase() ===
            (transaction.token as ERC20Token).address.toLowerCase(),
      );
      return erc20Token?.symbol || "ERC20"; // Fallback to "ERC20" if not found
    }

    return tokenList[0].symbol; // Default fallback
  }, [transaction.token, tokenList]);

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-gray-50 rounded-full">
          <TransactionTypeIcon type={transaction.type} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <TransactionTypeLabel type={transaction.type} />
            <span className="text-sm text-gray-500">{formattedDate}</span>
          </div>
          <div className="text-sm text-gray-500">
            <div>
              <span>hash: </span>
              {blockExplorerUrl && (
                <a
                  className="font-mono text-blue-500 hover:underline"
                  href={`${blockExplorerUrl}/tx/${transaction.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formatHash(transaction.txHash)}
                </a>
              )}
              {!blockExplorerUrl && (
                <span className="font-mono">
                  {formatHash(transaction.txHash)}
                </span>
              )}
            </div>
          </div>
          {transaction.to && (
            <div className="text-sm text-gray-500">
              <div>
                <span>to: </span>
                {blockExplorerUrl && (
                  <a
                    className="font-mono text-blue-500 hover:underline"
                    href={`${blockExplorerUrl}/address/${transaction.to}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formatHash(transaction.to)}
                  </a>
                )}
                {!blockExplorerUrl && (
                  <span className="font-mono">
                    {formatHash(transaction.to)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">
          {formatEtherTrim(netAmount)} {tokenSymbol}
        </div>
        <div className="text-sm text-gray-500">
          Block #{transaction.block.toString()}
        </div>
        <div className="text-xs text-gray-400">
          Chain Fee: {formatEtherTrim(transaction.txFee)} {tokenSymbol}
        </div>
        {transaction.relayerFee !== undefined && (
          <div>
            <div className="text-xs text-gray-400">
              Relayer Fee: {formatEtherTrim(relayerProfit)} {tokenSymbol}
            </div>
            <div className="text-xs text-gray-400">
              Total Fee: {formatEtherTrim(transaction.relayerFee)} {tokenSymbol}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
