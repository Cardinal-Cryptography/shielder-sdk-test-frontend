import { z } from "zod";

const storageKey = "shielderConfig";

export const shielderConfigSchema = z.object({
  shielderContractAddress: z.string().nullable(),
  relayerUrl: z.string().nullable(),
  relayerAddress: z.string().nullable(),
});

export type ShielderConfig = z.infer<typeof shielderConfigSchema>;

export const empty = (): ShielderConfig => ({
  shielderContractAddress: null,
  relayerUrl: null,
  relayerAddress: null,
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
    shielderContractAddress: "0x0019849f3fBA1ECd3fB4A2e27759e9432b19F6F3",
    relayerUrl: "https://shielder-relayer-stage.test.azero.dev",
    relayerAddress: "0xf4dD733dD78DA8E19278254d19A12d9E537A70A8",
  };
};
