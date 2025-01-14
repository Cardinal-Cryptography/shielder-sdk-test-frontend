import { z } from "zod";

const storageKey = "shielderConfig";

export const shielderConfigSchema = z.object({
  shielderContractAddress: z.string().nullable(),
  relayerUrl: z.string().nullable(),
});

export type ShielderConfig = z.infer<typeof shielderConfigSchema>;

export const empty = (): ShielderConfig => ({
  shielderContractAddress: null,
  relayerUrl: null,
});

export const fromLocalStorage = (): ShielderConfig | null => {
  const shielderConfig = localStorage.getItem(storageKey);
  if (!shielderConfig) {
    return null;
  }
  const parsed = shielderConfigSchema.parse(JSON.parse(shielderConfig));
  return parsed;
};

export const save = (shielderConfig: ShielderConfig) => {
  const stringValue = JSON.stringify(shielderConfig, (_, value): string =>
    typeof value === "bigint" ? value.toString() : value,
  );
  localStorage.setItem(storageKey, stringValue);
};

export const clear = () => {
  localStorage.removeItem(storageKey);
};

export const defaultTestnet = (): ShielderConfig => {
  return {
    shielderContractAddress: "0xEB05B73a4B512F71011d6C5Ba4d9A8419550d703",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
  };
};

export const defaultMainnet = (): ShielderConfig => {
  return {
    shielderContractAddress: "0x48237d5B3659182b1B70Ccf8E4D077e812AaA5FF",
    relayerUrl: "https://shielder-relayer.azero.dev",
  };
};
