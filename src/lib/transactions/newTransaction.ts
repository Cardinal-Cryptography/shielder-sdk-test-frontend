import { useConfig } from "@/lib/context/useConfig";
import { getBlockchainClient } from "@/lib/getBlockchainClient";
import { fromLocalStorage, save } from "@/lib/storage/transactions";
import { ShielderTransaction } from "@cardinal-cryptography/shielder-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decodeEventLog, parseAbi, TransactionReceipt } from "viem";

const findRelayerFee = (receipt: TransactionReceipt) => {
  const relayerEvent = [
    `event WithdrawNative(bytes3 contractVersion,uint256 idHiding,uint256 amount,address to,uint256 newNote,uint256 newNoteIndex,address relayerAddress,uint256 fee)`,
  ];
  const relayerEventAbi = parseAbi(relayerEvent);
  for (const log of receipt.logs) {
    try {
      const decodedLog = decodeEventLog({
        abi: relayerEventAbi,
        data: log.data,
        topics: log.topics,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (decodedLog.args as any).fee as bigint;
    } catch {
      // ignore
    }
  }
  return undefined;
};

export const useInsertTransaction = () => {
  const queryClient = useQueryClient();
  const { chainConfig, shielderConfig } = useConfig();

  const mutation = useMutation({
    mutationKey: ["insertTransaction"],
    mutationFn: async (transaction: ShielderTransaction) => {
      const currentTransactions = fromLocalStorage() ?? [];
      // if transaction already exists, do not insert it again
      if (currentTransactions.find((t) => t.txHash === transaction.txHash)) {
        return currentTransactions;
      }
      const walletClient = await getBlockchainClient(
        chainConfig!,
        shielderConfig!,
      );
      const blockTimestampSeconds = (
        await walletClient.getBlock({
          blockNumber: transaction.block,
        })
      ).timestamp;

      const txReceipt = await walletClient.getTransactionReceipt({
        hash: transaction.txHash,
      });
      const txFee = txReceipt.gasUsed * txReceipt.effectiveGasPrice;
      const relayerFee = findRelayerFee(txReceipt);

      const newTransactions = [
        ...currentTransactions,
        {
          ...transaction,
          date: parseInt((blockTimestampSeconds * 1000n).toString()),
          txFee,
          relayerFee,
        },
      ];
      save(newTransactions);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
  });

  return mutation;
};
