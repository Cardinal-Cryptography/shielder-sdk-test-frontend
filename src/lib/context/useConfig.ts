import { fromLocalStorage as localChain } from "@/lib/storage/chainConfig";
import { fromLocalStorage as localShielder } from "@/lib/storage/shielderConfig";
import { useQuery } from "@tanstack/react-query";

export const useConfig = () => {
  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: () => {
      const chainConfig = localChain();
      const shielderConfig = localShielder();
      return {
        chainConfig,
        shielderConfig,
        kek: Math.random(),
      };
    },
    initialData: {
      chainConfig: null,
      shielderConfig: null,
      kek: Math.random(),
    },
  });

  return config;
};
