import { ChainId, chainsByIds } from "@/lib/chains";
import { alephTestnet } from "@/lib/chains/alephTestnet";
import { useQuery } from "@tanstack/react-query";

export const useChain = () => {
  const { data: chain } = useQuery({
    queryKey: ["currentChainId"],
    queryFn: () => {
      const chainIdRaw = localStorage.getItem("currentChainId");
      if (!chainIdRaw) {
        return alephTestnet;
      }
      const chainIdNumber = parseInt(chainIdRaw);
      if (isNaN(chainIdNumber)) {
        return alephTestnet;
      }
      return chainsByIds[chainIdNumber as ChainId];
    },
    initialData: alephTestnet,
  });
  return chain;
};
