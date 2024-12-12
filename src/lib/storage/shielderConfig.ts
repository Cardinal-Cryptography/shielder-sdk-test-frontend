import { z } from "zod";
import { generatePrivateKey } from "viem/accounts";

const storageKey = "shielderConfig";

export const shielderConfigSchema = z.object({
  shielderContractAddress: z.string().nullable(),
  relayerUrl: z.string().nullable(),
  relayerAddress: z.string().nullable(),
  shielderSeedKey: z.string().nullable(),
  publicAccountKey: z.string().nullable(),
});

export type ShielderConfig = z.infer<typeof shielderConfigSchema>;

export const empty = (): ShielderConfig => ({
  shielderContractAddress: null,
  relayerUrl: null,
  relayerAddress: null,
  shielderSeedKey: null,
  publicAccountKey: null,
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
  const randomPrivateKey = generatePrivateKey();
  return {
    shielderContractAddress: "0x0CCf21fd6a2574D7186d94970F8D6E63a545879a",
    relayerUrl: "https://shielder-relayer-stage.test.azero.dev",
    relayerAddress: "0xf4dD733dD78DA8E19278254d19A12d9E537A70A8",
    shielderSeedKey: randomPrivateKey,
    publicAccountKey: randomPrivateKey,
  };
};
