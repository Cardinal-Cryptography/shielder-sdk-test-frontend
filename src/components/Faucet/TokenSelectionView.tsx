import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { useAccount } from "wagmi";
import { defaultTokenByChainId } from "@/lib/tokens/index";
import { ChainId } from "@/lib/chains";
import { TokenType } from "@/components/Faucet/types";

// TokenSelectionView Component
type TokenSelectionViewProps = {
  hasNativeFaucet: boolean;
  hasErc20Faucet: boolean;
  chain: ReturnType<typeof useAccount>["chain"];
  onSelectToken: (token: TokenType) => void;
};

export const TokenSelectionView = ({
  hasNativeFaucet,
  hasErc20Faucet,
  chain,
  onSelectToken,
}: TokenSelectionViewProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <p className="text-sm text-muted-foreground mb-2">
        Select a token to mint:
      </p>
      {hasNativeFaucet && (
        <Button
          className="w-full h-16 flex justify-between items-center"
          variant="outline"
          onClick={() => onSelectToken("native")}
        >
          <div className="flex items-center">
            <Coins className="mr-2 h-5 w-5" />
            <span>Native Token (TZERO)</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Requires captcha
          </span>
        </Button>
      )}
      {hasErc20Faucet && chain && (
        <Button
          className="w-full h-16 flex justify-between items-center"
          variant="outline"
          onClick={() => onSelectToken("erc20")}
        >
          <div className="flex items-center">
            <Coins className="mr-2 h-5 w-5 text-green-500" />
            <span>
              {defaultTokenByChainId[chain.id as ChainId]?.symbol} Token
            </span>
          </div>
          <span className="text-xs text-muted-foreground">No captcha</span>
        </Button>
      )}
    </div>
  );
};
