import { useConfig } from "@/lib/context/useConfig";
import { useShielderClient } from "@/lib/context/useShielderClient";
import useWasm from "@/lib/context/useWasm";
import { useQuery } from "@tanstack/react-query";

export const useShielderBalance = () => {
  const { shielderClient } = useShielderClient();
  const { shielderConfig, chainConfig } = useConfig();
  const { isWasmLoaded } = useWasm();
  const { data: config } = useQuery({
    queryKey: ["shielderBalance", shielderConfig, chainConfig, isWasmLoaded],
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
