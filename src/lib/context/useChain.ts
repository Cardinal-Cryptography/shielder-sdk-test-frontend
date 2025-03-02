import { ChainId, shielderConfigByChainId } from "@/lib/chains";
import {
  fromLocalStorage as localShielder,
  save,
} from "@/lib/storage/shielderConfig";
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
      const chainId = chain.id as ChainId;
      let shielderConfig = localShielder(chainId);
      if (!shielderConfig) {
        save(chainId, shielderConfigByChainId[chainId]);
        shielderConfig = shielderConfigByChainId[chain.id as ChainId];
      }
      return {
        chain,
        shielderConfig,
      };
    },
  });
};
