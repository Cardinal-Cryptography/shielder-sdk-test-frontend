import { z } from "zod";
import { paymasters } from "../bundler/paymasters";
import { alephZero, alephZeroTestnet } from "viem/chains";

const storageKey = "shielderConfig";

export const shielderConfigSchema = z.object({
  shielderContractAddress: z.string().nullable(),
  bundlerUrl: z.string().nullable(),
  paymasterAddress: z.string().nullable(),
});

export type ShielderConfig = z.infer<typeof shielderConfigSchema>;

export const empty = (): ShielderConfig => ({
  shielderContractAddress: null,
  bundlerUrl: null,
  paymasterAddress: null,
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
    bundlerUrl: paymasters[alephZeroTestnet.id].bundlerUrl,
    paymasterAddress: paymasters[alephZeroTestnet.id].address,
  };
};

export const defaultMainnet = (): ShielderConfig => {
  return {
    shielderContractAddress: "0x48237d5B3659182b1B70Ccf8E4D077e812AaA5FF",
    bundlerUrl: paymasters[alephZero.id].bundlerUrl,
    paymasterAddress: paymasters[alephZero.id].address,
  };
};
