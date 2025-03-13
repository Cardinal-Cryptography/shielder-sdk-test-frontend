import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { useAccount, useWatchAsset } from "wagmi";
import { Token } from "@/lib/tokens/types";

// Erc20TokenMintView Component
type Erc20TokenMintViewProps = {
  token: Token;
  chain: ReturnType<typeof useAccount>["chain"];
  onMint: () => Promise<void>;
};

export const Erc20TokenMintView = ({
  token,
  chain,
  onMint,
}: Erc20TokenMintViewProps) => {
  const { watchAsset } = useWatchAsset();

  if (!chain) return null;

  const tokenSymbol = token.symbol;

  return (
    <div className="flex flex-col items-center">
      <Button
        className="w-full mb-4"
        onClick={() => {
          watchAsset({
            type: "ERC20",
            options: {
              address: token.address!,
              symbol: token.symbol,
              decimals: token.decimals,
            },
          });
        }}
      >
        Add {tokenSymbol} to wallet
      </Button>
      <Button className="w-full" onClick={() => void onMint()}>
        <Coins className="mr-2 h-5 w-5 text-green-500" />
        Mint {tokenSymbol} Tokens
      </Button>
    </div>
  );
};
