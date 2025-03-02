import { Token } from "@/lib/tokens/types";
import { initWasmWorker } from "@cardinal-cryptography/shielder-sdk-crypto-wasm";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatEther } from "viem";
import {
  erc20Token,
  nativeToken,
  Token as SDKToken,
} from "@cardinal-cryptography/shielder-sdk";

export const wasmCryptoClientRead = initWasmWorker(
  navigator.hardwareConcurrency,
);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  return (
    chainId === undefined ||
    chainId === 2039 ||
    chainId === 41455 ||
    chainId === 421614 ||
    chainId === 84532 ||
    chainId === 11155111
  );
};

export const tokenToSdkToken = (token: Token): SDKToken => {
  if (token.isNative) {
    return nativeToken();
  } else {
    return erc20Token(token.address!);
  }
};

export const bigintQueryHashKey = <T>(queryKey: T) => {
  return JSON.stringify(
    queryKey,
    // handle bigints
    (_, value) => (typeof value === "bigint" ? value.toString() : value),
  );
};
