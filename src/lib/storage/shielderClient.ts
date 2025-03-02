import { ChainId } from "@/lib/chains";
import { InjectedStorageInterface } from "@cardinal-cryptography/shielder-sdk";

const storageKey = "shielderClient";

export const fromLocalStorage = (
  chainId: ChainId,
): InjectedStorageInterface => {
  return {
    getItem: async (key: string): Promise<string | null> => {
      const shielderClientNamespaced = localStorage.getItem(
        storageKey + chainId.toString(),
      );
      if (!shielderClientNamespaced) {
        return null;
      }
      const shielderClient = JSON.parse(shielderClientNamespaced);
      return shielderClient[key];
    },
    setItem: async (key: string, value: string): Promise<void> => {
      const shielderClientNamespaced = localStorage.getItem(
        storageKey + chainId.toString(),
      );
      const shielderClient = shielderClientNamespaced
        ? JSON.parse(shielderClientNamespaced)
        : {};
      shielderClient[key] = value;
      localStorage.setItem(
        storageKey + chainId.toString(),
        JSON.stringify(shielderClient),
      );
    },
  };
};

export const clear = (chainId: ChainId) => {
  localStorage.removeItem(storageKey + chainId.toString());
};
