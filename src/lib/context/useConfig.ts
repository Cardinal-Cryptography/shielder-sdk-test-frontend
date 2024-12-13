import { fromLocalStorage as localShielder } from "@/lib/storage/shielderConfig";
import { useQuery } from "@tanstack/react-query";

export const useConfig = () => {
  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: () => {
      const shielderConfig = localShielder();
      return {
        shielderConfig,
        kek: Math.random(),
      };
    },
    initialData: {
      shielderConfig: null,
      kek: Math.random(),
    },
  });

  return config;
};
