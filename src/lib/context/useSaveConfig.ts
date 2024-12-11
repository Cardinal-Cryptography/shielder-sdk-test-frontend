import {
  ChainConfig,
  save as saveChainConfig,
} from "@/lib/storage/chainConfig";
import {
  save as saveShielderConfig,
  ShielderConfig,
} from "@/lib/storage/shielderConfig";
import { clear } from "@/lib/storage/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSaveConfig = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["saveConfig"],
    mutationFn: async ({
      chainConfig,
      shielderConfig,
    }: {
      chainConfig: ChainConfig;
      shielderConfig: ShielderConfig;
    }) => {
      saveShielderConfig(shielderConfig);
      saveChainConfig(chainConfig);
      clear();
      localStorage.removeItem("shielderClient");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["config"],
      });
    },
  });

  return mutation;
};
