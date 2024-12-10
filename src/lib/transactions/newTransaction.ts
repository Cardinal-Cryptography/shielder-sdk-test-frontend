import { useChainConfig } from "@/lib/context/useChainConfig";
import { useShielderConfig } from "@/lib/context/useShielderConfig";
import { getBlockchainClient } from "@/lib/getBlockchainClient";
import { fromLocalStorage, save } from "@/lib/storage/transactions";
import { ShielderTransaction } from "@cardinal-cryptography/shielder-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useInsertTransaction = () => {
  const queryClient = useQueryClient();
  const chainConfig = useChainConfig();
  const shielderConfig = useShielderConfig();

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
      const newTransactions = [
        ...currentTransactions,
        {
          ...transaction,
          date: parseInt((blockTimestampSeconds * 1000n).toString()),
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
