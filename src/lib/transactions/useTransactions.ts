import { fromLocalStorage } from "@/lib/storage/transactions";
import { useQuery } from "@tanstack/react-query";

export const useTransactions = () => {
  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => {
      const transactions = fromLocalStorage() ?? [];
      return transactions;
    },
  });
  return transactions;
};
