import { z } from "zod";

const storageKey = "chainConfig";

export const chainConfigSchema = z.object({
  publicRpcUrl: z.string().nullable(),
  chainId: z.string().nullable(),
  explorerUrl: z.string().nullable(),
});

export type ChainConfig = z.infer<typeof chainConfigSchema>;

export const fromLocalStorage = (): ChainConfig | null => {
  const chainConfig = localStorage.getItem(storageKey);
  if (!chainConfig) {
    return null;
  }
  const parsed = chainConfigSchema.parse(JSON.parse(chainConfig));
  return parsed;
};

export const empty = (): ChainConfig => ({
  publicRpcUrl: null,
  chainId: null,
  explorerUrl: null,
});

export const save = (chainConfig: ChainConfig) => {
  const stringValue = JSON.stringify(chainConfig, (_, value): string =>
    typeof value === "bigint" ? value.toString() : value,
  );
  localStorage.setItem(storageKey, stringValue);
};

export const clear = () => {
  localStorage.removeItem(storageKey);
};

export const defaultTestnet = (): ChainConfig => {
  return {
    publicRpcUrl: "https://rpc.alephzero-testnet.gelato.digital",
    chainId: "2039",
    explorerUrl: "https://evm-explorer-testnet.alephzero.org/",
  };
};
