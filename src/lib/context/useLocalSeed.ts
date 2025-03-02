import { fromLocalStorage as localSeedMnemonic } from "@/lib/storage/seedMnemonicConfig";
import { useQuery } from "@tanstack/react-query";

export const useLocalSeed = () => {
  return useQuery({
    queryKey: ["localSeedConfig"],
    queryFn: () => {
      const seedMnemonicConfig = localSeedMnemonic();
      return {
        seedMnemonicConfig,
      };
    },
    initialData: {
      seedMnemonicConfig: null,
    },
  });
};
