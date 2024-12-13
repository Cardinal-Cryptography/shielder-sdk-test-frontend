import { z } from "zod";
import { english, generateMnemonic } from "viem/accounts";

const storageKey = "seedMnemonicConfig";

export const seedMnemonicConfigSchema = z.object({
  shielderSeedMnemonic: z.string().nullable(),
});

export type SeedMnemonicConfig = z.infer<typeof seedMnemonicConfigSchema>;

export const empty = (): SeedMnemonicConfig => ({
  shielderSeedMnemonic: null,
});

export const fromLocalStorage = (): SeedMnemonicConfig | null => {
  const seedMnemonicConfig = localStorage.getItem(storageKey);
  if (!seedMnemonicConfig) {
    return null;
  }
  const parsed = seedMnemonicConfigSchema.parse(JSON.parse(seedMnemonicConfig));
  return parsed;
};

export const save = (seedMnemonicConfig: SeedMnemonicConfig) => {
  const stringValue = JSON.stringify(seedMnemonicConfig, (_, value): string =>
    typeof value === "bigint" ? value.toString() : value,
  );
  localStorage.setItem(storageKey, stringValue);
};

export const clear = () => {
  localStorage.removeItem(storageKey);
};

export const randomMnemonic = (): SeedMnemonicConfig => {
  const randomMnemonic = generateMnemonic(english);
  return {
    shielderSeedMnemonic: randomMnemonic,
  };
};
