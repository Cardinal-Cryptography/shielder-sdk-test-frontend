import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useSwitchChain as useSwitchChainWagmi } from "wagmi";

export const useSwitchChain = () => {
  const queryClient = useQueryClient();
  const { isConnected } = useAccount();
  const { switchChain: switchChainWagmi } = useSwitchChainWagmi();

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
        console.log("here");
        if (localStorage.getItem("currentChain") === "mainnet") {
          switchChainWagmi({ chainId: 41455 });
        }
        if (localStorage.getItem("currentChain") === "testnet") {
          switchChainWagmi({ chainId: 2039 });
        }
      }
    },
  });

  return mutation;
};
