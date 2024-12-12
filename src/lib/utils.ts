import { clear } from "@/lib/storage/transactions";
import { QueryClient } from "@tanstack/react-query";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatEther } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shielderClientStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const shielderClientNamespaced = localStorage.getItem("shielderClient");
    if (!shielderClientNamespaced) {
      return null;
    }
    const shielderClient = JSON.parse(shielderClientNamespaced);
    return shielderClient[key];
  },
  setItem: async (key: string, value: string): Promise<void> => {
    const shielderClientNamespaced = localStorage.getItem("shielderClient");
    const shielderClient = shielderClientNamespaced
      ? JSON.parse(shielderClientNamespaced)
      : {};
    shielderClient[key] = value;
    localStorage.setItem("shielderClient", JSON.stringify(shielderClient));
  },
};

export const clearShielderClientStorage = async (queryClient: QueryClient) => {
  localStorage.removeItem("shielderClient");
  clear();
  await queryClient.invalidateQueries({
    queryKey: ["transactions"],
  });
  await queryClient.invalidateQueries({
    queryKey: ["shielderClient"],
  });
};

export const formatEtherTrim = (wei: bigint) => {
  const ether = formatEther(wei);
  // trim to 4 decimal places
  const [whole, decimal] = ether.split(".");
  if (!decimal) {
    return whole;
  }
  return `${whole}.${decimal.slice(0, 4)}`;
};

export const formatHash = (hash: string) => {
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
};

export const accountChainIdSupported = (chainId: number | undefined) => {
  return chainId === undefined || chainId === 2039 || chainId === 41455;
};
