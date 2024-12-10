import { fromLocalStorage } from "@/lib/storage/chainConfig";
import { useQuery } from "@tanstack/react-query";

export const useChainConfig = () => {
  const { data: config } = useQuery({
    queryKey: ["chainConfig"],
    queryFn: () => {
      const chainConfig = fromLocalStorage();
      if (!chainConfig) {
        throw new Error("Chain config not available");
      }
      return chainConfig;
    },
  });

  return config;
};
