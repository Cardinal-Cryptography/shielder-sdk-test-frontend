import { Token } from "@/lib/tokens/types";
import { initWasmWorker } from "@cardinal-cryptography/shielder-sdk-crypto-wasm";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import {
  erc20Token,
  nativeToken,
  Token as SDKToken,
} from "@cardinal-cryptography/shielder-sdk";

import newAccountParamsUrl from "@cardinal-cryptography/shielder-sdk-crypto-wasm/keys/new_account/params.bin?url";
import newAccountPkUrl from "@cardinal-cryptography/shielder-sdk-crypto-wasm/keys/new_account/pk.bin?url";
import depositParamsUrl from "@cardinal-cryptography/shielder-sdk-crypto-wasm/keys/deposit/params.bin?url";
import depositPkUrl from "@cardinal-cryptography/shielder-sdk-crypto-wasm/keys/deposit/pk.bin?url";
import withdrawParamsUrl from "@cardinal-cryptography/shielder-sdk-crypto-wasm/keys/withdraw/params.bin?url";
import withdrawPkUrl from "@cardinal-cryptography/shielder-sdk-crypto-wasm/keys/withdraw/pk.bin?url";

async function fetchArrayBuffer(url: string): Promise<Uint8Array> {
  return fetch(url)
    .then((r) => r.arrayBuffer())
    .then((b) => new Uint8Array(b));
}

export const wasmCryptoClientRead = (async () => {
  const newAccountParams = await fetchArrayBuffer(newAccountParamsUrl);
  const newAccountPk = await fetchArrayBuffer(newAccountPkUrl);
  const depositParams = await fetchArrayBuffer(depositParamsUrl);
  const depositPk = await fetchArrayBuffer(depositPkUrl);
  const withdrawParams = await fetchArrayBuffer(withdrawParamsUrl);
  const withdrawPk = await fetchArrayBuffer(withdrawPkUrl);
  return initWasmWorker(
    "single",
    {
      paramsBuf: newAccountParams,
      pkBuf: newAccountPk,
    },
    {
      paramsBuf: depositParams,
      pkBuf: depositPk,
    },
    {
      paramsBuf: withdrawParams,
      pkBuf: withdrawPk,
    },
  );
})();

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

function formatAmount(wei: bigint, decimals: number | undefined) {
  if (decimals === undefined) {
    return formatEther(wei);
  }
  if (decimals > 18) {
    throw new Error("Decimals greater than 18 are not supported");
  }
  const amount = formatUnits(wei, decimals);
  return amount;
}

export function formatAmountTrim(wei: bigint, decimals: number | undefined) {
  const ether = formatAmount(wei, decimals);
  // trim to 4 decimal places
  const [whole, decimal] = ether.split(".");
  if (!decimal) {
    return whole;
  }
  return `${whole}.${decimal.slice(0, 4)}`;
}

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

export function parseDecimals(amount: string, decimals: number | undefined) {
  if (decimals === undefined) {
    return parseEther(amount);
  }
  if (decimals > 18) {
    throw new Error("Decimals greater than 18 are not supported");
  }
  const amountParsed = parseUnits(amount, decimals);
  return amountParsed;
}
