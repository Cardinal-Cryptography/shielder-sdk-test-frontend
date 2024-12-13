import { useSaveConfig } from "@/lib/context/useSaveConfig";
import {
  defaultMainnet,
  defaultTestnet,
  ShielderConfig,
} from "@/lib/storage/shielderConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export const useSwitchChain = () => {
  const queryClient = useQueryClient();
  const { isConnected } = useAccount();
  const saveConfig = useSaveConfig();

  const mutation = useMutation({
    mutationKey: ["useSwitchCurrentChain"],
    mutationFn: async (currentChain: "mainnet" | "testnet") => {
      localStorage.setItem("currentChain", currentChain);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["currentChain"],
      });
      if (isConnected) {
        let newConfig: ShielderConfig | null = null;
        if (localStorage.getItem("currentChain") === "mainnet") {
          //   switchChainWagmi({ chainId: 41455 });
          newConfig = defaultMainnet();
        }
        if (localStorage.getItem("currentChain") === "testnet") {
          //   switchChainWagmi({ chainId: 2039 });
          newConfig = defaultTestnet();
        }
        await saveConfig.mutateAsync({
          shielderConfig: newConfig!,
        });
      }
    },
  });

  return mutation;
};
