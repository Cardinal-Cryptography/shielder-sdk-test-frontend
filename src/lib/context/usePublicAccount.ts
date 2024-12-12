import { useQuery } from "@tanstack/react-query";
import { useAccount, useBalance } from "wagmi";

export const usePublicAccount = () => {
  const { address } = useAccount();
  const { data: dataBalance } = useBalance({
    address,
  });
  const { data: config } = useQuery({
    queryKey: ["publicBalance"],
    queryFn: async () => {
      return {
        publicBalance: dataBalance ? dataBalance.value : 0n,
        publicAddress: address ?? "",
      };
    },
    refetchInterval: 1000,
    initialData: { publicBalance: 0n, publicAddress: "" },
  });

  return config;
};
