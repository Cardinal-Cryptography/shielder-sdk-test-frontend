import { fromLocalStorage, save } from "@/lib/storage/transactions";
import { ShielderTransaction } from "@cardinal-cryptography/shielder-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";

export const useInsertTransaction = () => {
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();

  const mutation = useMutation({
    mutationKey: ["insertTransaction"],
    mutationFn: async (transaction: ShielderTransaction) => {
      if (!publicClient) {
        throw new Error("Public client not available");
      }
      const currentTransactions = fromLocalStorage() ?? [];
      // if transaction already exists, do not insert it again
      if (currentTransactions.find((t) => t.txHash === transaction.txHash)) {
        return currentTransactions;
      }
      const blockTimestampSeconds = (
        await publicClient.getBlock({
          blockNumber: transaction.block,
        })
      ).timestamp;

      const txReceipt = await publicClient.getTransactionReceipt({
        hash: transaction.txHash,
      });
      const txFee = txReceipt.gasUsed * txReceipt.effectiveGasPrice;
      const relayerFee = transaction.relayerFee;
      console.log(txReceipt, txFee, relayerFee);

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
