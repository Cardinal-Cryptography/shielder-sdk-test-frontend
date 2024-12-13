import { fromLocalStorage as localSeedMnemonic } from "@/lib/storage/seedMnemonicConfig";
import {
  defaultTestnet,
  fromLocalStorage as localShielder,
  save,
} from "@/lib/storage/shielderConfig";
import { useQuery } from "@tanstack/react-query";

export const useConfig = () => {
  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: () => {
      const shielderConfig = localShielder();
      if (!shielderConfig) {
        save(defaultTestnet());
      }
      const seedMnemonicConfig = localSeedMnemonic();
      return {
        shielderConfig,
        seedMnemonicConfig,
        kek: Math.random(),
      };
    },
    initialData: {
      shielderConfig: null,
      seedMnemonicConfig: null,
      kek: Math.random(),
    },
  });

  return config;
};
