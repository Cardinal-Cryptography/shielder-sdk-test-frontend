import { useChain } from "@/lib/context/useChain";

export const useChainId = () => {
  const chain = useChain();
  return chain.id;
};
