import { useChain } from "@/lib/context/useChain";

export const useChainId = () => {
  const chain = useChain();
  if (chain === "testnet") {
    return 2039;
  }
  if (chain === "arbitrum_sepolia") {
    return 421614;
  }
  return 41455;
};
