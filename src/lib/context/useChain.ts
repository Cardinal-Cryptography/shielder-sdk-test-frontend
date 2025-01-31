import { useQuery } from "@tanstack/react-query";

export const useChain = () => {
  const { data: chain } = useQuery({
    queryKey: ["currentChain"],
    queryFn: () => {
      const chain = localStorage.getItem("currentChain");
      if (!chain) {
        return "testnet";
      }
      return chain as "testnet" | "mainnet" | "arbitrum_sepolia";
    },
    initialData: "testnet" as "testnet" | "mainnet" | "arbitrum_sepolia",
  });
  return chain;
};
