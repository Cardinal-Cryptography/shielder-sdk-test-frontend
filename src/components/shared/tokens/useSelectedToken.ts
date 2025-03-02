import { useMemo } from "react";
import { isAddress } from "viem";
import { Token } from "@/lib/tokens/types";
import { SelectedToken } from "./types";

export const useSelectedToken = (
  tokens: Token[],
  selectedTokenValue: string,
): SelectedToken | undefined => {
  return useMemo(() => {
    if (!selectedTokenValue) return undefined;

    // Check if it's a token from the list
    const token = tokens.find(
      (token) =>
        (token.isNative && selectedTokenValue === "native") ||
        (!token.isNative && token.address === selectedTokenValue),
    );

    if (token) return token as SelectedToken;

    // If it's a valid address but not in the list, it's a custom token
    if (selectedTokenValue && isAddress(selectedTokenValue as `0x${string}`)) {
      return {
        address: selectedTokenValue as `0x${string}`,
        symbol: "Custom Token",
        name: "Custom Token",
        decimals: 18,
        isNative: false,
      };
    }

    return undefined;
  }, [tokens, selectedTokenValue]);
};
