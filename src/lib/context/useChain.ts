import { ChainId, shielderConfigByChainId } from "@/lib/chains";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export const useChain = () => {
  const { chain } = useAccount();
  return useQuery({
    queryKey: ["config", chain],
    queryFn: () => {
      if (!chain) {
        throw new Error("Chain not available");
      }
      const shielderConfig = shielderConfigByChainId[chain.id as ChainId];

      return {
        chain,
        shielderConfig,
      };
    },
  });
};
