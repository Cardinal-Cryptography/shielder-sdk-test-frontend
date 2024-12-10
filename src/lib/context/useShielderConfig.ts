import { fromLocalStorage } from "@/lib/storage/shielderConfig";
import { useQuery } from "@tanstack/react-query";

export const useShielderConfig = () => {
  const { data: config } = useQuery({
    queryKey: ["shielderConfig"],
    queryFn: () => {
      const shielderConfig = fromLocalStorage();
      if (!shielderConfig) {
        throw new Error("Shielder config not available");
      }
      return shielderConfig;
    },
  });

  return config;
};
