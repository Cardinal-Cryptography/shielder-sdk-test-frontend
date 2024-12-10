import { useChainConfig } from "@/lib/context/useChainConfig";
import { useShielderConfig } from "@/lib/context/useShielderConfig";
import { useQuery } from "@tanstack/react-query";
import { createPublicClient, defineChain, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export const usePublicAccount = () => {
  const chainConfig = useChainConfig();
  const shielderConfig = useShielderConfig();
  const { data: config } = useQuery({
    queryKey: ["publicBalance", chainConfig, shielderConfig],
    queryFn: async () => {
      if (!chainConfig) {
        throw new Error("Chain config not available");
      }
      if (!shielderConfig) {
        throw new Error("Shielder config not available");
      }
      if (!chainConfig.chainId) {
        throw new Error("Chain ID not available");
      }
      if (!chainConfig.publicRpcUrl) {
        throw new Error("Public RPC URL not available");
      }
      const chain = defineChain({
        id: parseInt(chainConfig.chainId),
        name: "chain",
        nativeCurrency: {
          decimals: 18,
          name: "Ether",
          symbol: "ETH",
        },
        rpcUrls: {
          default: {
            http: [chainConfig.publicRpcUrl],
          },
        },
      });
      const publicClient = createPublicClient({
        chain,
        transport: http(),
      });
      const address = privateKeyToAccount(
        shielderConfig.publicAccountKey as `0x${string}`,
      ).address;
      const balance = await publicClient.getBalance({
        address,
      });
      return { publicBalance: balance, publicAddress: address };
    },
    refetchInterval: 1000,
    initialData: { publicBalance: 0n, publicAddress: "" },
  });

  return config;
};
