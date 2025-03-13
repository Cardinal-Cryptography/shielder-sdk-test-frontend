import { Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import { defaultTokenByChainId } from "@/lib/tokens/index";
import { ChainId } from "@/lib/chains";
import { TokenType } from "@/components/Faucet/types";
// MintingLoadingView Component
type MintingLoadingViewProps = {
  selectedToken: TokenType;
  chain: ReturnType<typeof useAccount>["chain"];
};

export const MintingLoadingView = ({
  selectedToken,
  chain,
}: MintingLoadingViewProps) => {
  return (
    <div className="flex flex-col items-center py-8">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p className="text-sm text-muted-foreground">
        {selectedToken === "native"
          ? "Minting native tokens..."
          : `Minting ${
              chain && defaultTokenByChainId[chain.id as ChainId]?.symbol
            } tokens...`}
      </p>
    </div>
  );
};
