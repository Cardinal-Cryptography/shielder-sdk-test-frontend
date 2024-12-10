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
    shielderContractAddress: "0x77D966DcAdD93227d34919e93B1169453Eeca86B",
    relayerUrl: "https://shielder-relayer-dev.test.azero.dev",
    relayerAddress: "0xF2Fd9bc1e9DC1863f923aCa59df265134DD65AB7",
    shielderSeedKey: randomPrivateKey,
    publicAccountKey: randomPrivateKey,
  };
};
