import { useMemo } from "react";
import { isAddress } from "viem";
import { Token } from "@/lib/tokens/types";
import { SelectedToken } from "./types";
import { getTokenByAddress } from "@/lib/tokens/getTokenByAddress";
import { useQuery } from "@tanstack/react-query";
import { useClient } from "wagmi";
import { bigintQueryHashKey } from "@/lib/utils";

export const useSelectedToken = (
  tokens: Token[],
  selectedTokenValue: string,
) => {
  const client = useClient();

  // Find token from the list
  const listToken = useMemo(() => {
    if (!selectedTokenValue) return undefined;

    return tokens.find(
      (token) =>
        (token.isNative && selectedTokenValue === "native") ||
        (!token.isNative && token.address === selectedTokenValue),
    ) as SelectedToken | undefined;
  }, [tokens, selectedTokenValue]);

  // Fetch custom token data if needed
  const query = useQuery({
    queryKey: ["customToken", selectedTokenValue, !!client, listToken],
    queryKeyHashFn: bigintQueryHashKey,
    queryFn: async () => {
      if (listToken) return listToken;
      if (
        !client ||
        !selectedTokenValue ||
        !isAddress(selectedTokenValue as `0x${string}`)
      ) {
        throw new Error("Invalid token address or client not available");
      }

      try {
        const tokenData = await getTokenByAddress(
          selectedTokenValue as `0x${string}`,
          client,
        );
        return tokenData as SelectedToken;
      } catch (error) {
        console.error("Error fetching token data:", error);
        // Fallback to default custom token
        return {
          address: selectedTokenValue as `0x${string}`,
          symbol: "Custom Token",
          name: "Custom Token",
          decimals: 18,
          isNative: false,
        } as SelectedToken;
      }
    },
  });

  // Return the appropriate token
  return query;
};
