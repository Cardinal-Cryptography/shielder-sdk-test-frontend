import { useChainId } from "@/lib/context/useChainId";
import { useConfig } from "@/lib/context/useConfig";
import { useShielderClient } from "@/lib/context/useShielderClient";
import useWasm from "@/lib/context/useWasm";
import { useQuery } from "@tanstack/react-query";

export const useShielderBalance = () => {
  const { shielderClient } = useShielderClient();
  const { shielderConfig } = useConfig();
  const { isWasmLoaded } = useWasm();
  const chainId = useChainId();
  const { data: config } = useQuery({
    queryKey: ["shielderBalance", shielderConfig, isWasmLoaded, chainId],
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
