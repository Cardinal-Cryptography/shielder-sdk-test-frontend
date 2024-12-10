import { useShielderSdk } from "@/lib/context/useShielderSdk";
import { useQuery } from "@tanstack/react-query";

export const useShielderBalance = () => {
  const { shielderClient } = useShielderSdk();
  const { data: config } = useQuery({
    queryKey: ["shielderBalance"],
    queryFn: async () => {
      if (!shielderClient) {
        throw new Error("Shielder client not available");
      }
      const balance = (await shielderClient.accountState()).balance;
      return balance;
    },
    refetchInterval: 1000,
  });

  return config;
};
