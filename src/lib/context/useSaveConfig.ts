import { save, SeedMnemonicConfig } from "@/lib/storage/seedMnemonicConfig";
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
      shielderConfig,
      seedMnemonicConfig,
    }: {
      shielderConfig: ShielderConfig;
      seedMnemonicConfig?: SeedMnemonicConfig;
    }) => {
      saveShielderConfig(shielderConfig);
      if (seedMnemonicConfig) {
        console.log("Saving seedMnemonicConfig", seedMnemonicConfig);
        save(seedMnemonicConfig);
      }
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
