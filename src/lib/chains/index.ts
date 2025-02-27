import { alephMainnet } from "@/lib/chains/alephMainnet";
import { alephTestnet } from "@/lib/chains/alephTestnet";
import { defaultMainnet, defaultTestnet } from "@/lib/storage/shielderConfig";

export const chainsByIds = {
  41455: alephMainnet,
  2039: alephTestnet,
} as const;

export type ChainId = keyof typeof chainsByIds;

export const chainConfigsByIds = {
  41455: defaultMainnet(),
  2039: defaultTestnet(),
};
