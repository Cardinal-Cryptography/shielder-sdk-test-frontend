import { useShielderClient } from "@/lib/shielder/useShielderClient";
import { getTokenByAddress } from "@/lib/tokens/getTokenByAddress";
import { useQuery } from "@tanstack/react-query";
import { useClient } from "wagmi";

export const useShielderTokens = () => {
  const { data: shielderClient } = useShielderClient();

  const client = useClient();

  const query = useQuery({
    queryKey: ["shielderTokens", !!shielderClient, client],
    queryKeyHashFn: (queryKey) => {
      return JSON.stringify(
        queryKey,
        // handle bigints
        (_, value) => (typeof value === "bigint" ? value.toString() : value),
      );
    },
    queryFn: async () => {
      if (!shielderClient) {
        throw new Error("Shielder client not available");
      }
      if (!client) {
        throw new Error("Client not available");
      }
      const accountStates = await shielderClient?.accountStatesList();
      return Promise.all(
        accountStates
          .map((accountState) => accountState.token)
          .filter((token) => token.type === "erc20")
          .map((token) => getTokenByAddress(token.address, client)),
      );
    },
  });
  return query;
};
