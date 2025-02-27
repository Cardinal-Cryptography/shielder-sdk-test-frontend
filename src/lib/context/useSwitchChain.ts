import { chainConfigsByIds, ChainId } from "@/lib/chains";
import { useSaveConfig } from "@/lib/context/useSaveConfig";
import { defaultTestnet, ShielderConfig } from "@/lib/storage/shielderConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export const useSwitchChain = () => {
  const queryClient = useQueryClient();
  const { isConnected } = useAccount();
  const saveConfig = useSaveConfig();

  const mutation = useMutation({
    mutationKey: ["useSwitchCurrentChain"],
    mutationFn: async (chainId: ChainId) => {
      localStorage.setItem("currentChainId", chainId.toString());
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["currentChainId"],
      });
      if (isConnected) {
        const chainIdRaw = localStorage.getItem("currentChainId");
        if (!chainIdRaw) {
          return defaultTestnet();
        }
        const chainIdNumber = parseInt(chainIdRaw);
        if (isNaN(chainIdNumber)) {
          return defaultTestnet();
        }
        const newConfig: ShielderConfig =
          chainConfigsByIds[chainIdNumber as ChainId];
        await saveConfig.mutateAsync({
          shielderConfig: newConfig!,
        });
      }
    },
  });

  return mutation;
};
