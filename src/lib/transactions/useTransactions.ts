import { ChainId } from "@/lib/chains";
import { useChain } from "@/lib/context/useChain";
import { fromLocalStorage } from "@/lib/storage/transactions";
import { useQuery } from "@tanstack/react-query";

export const useTransactions = () => {
  const { data: chainData } = useChain();
  return useQuery({
    queryKey: ["transactions", chainData],
    queryFn: () => {
      if (!chainData) {
        throw new Error("Chain ID not available");
      }
      const transactions =
        fromLocalStorage(chainData.chain.id as ChainId) ?? [];
      return transactions;
    },
  });
};
