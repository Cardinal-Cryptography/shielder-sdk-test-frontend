import { Button } from "@/components/ui/button";
import { HandCoins, Loader2, Coins } from "lucide-react";
import { useEffect, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useAccount } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { defaultTokenByChainId } from "@/lib/tokens/index";
import { ChainId } from "@/lib/chains";
import { useNativeTokenMint } from "@/lib/faucet/useNativeTokenMint";
import { useErc20TokenMint } from "@/lib/faucet/useErc20TokenMint";

type TokenType = "native" | "erc20";

const Faucet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenType | null>(null);
  const { isConnected, chain } = useAccount();

  const defaultErc20Token = defaultTokenByChainId[chain?.id as ChainId];
  const { mintNativeToken, isMinting: isNativeMinting } = useNativeTokenMint();
  const { mintErc20Token, data: erc20Mint } = useErc20TokenMint({
    token: defaultErc20Token,
  });

  const isMinting = isNativeMinting || erc20Mint?.isMinting;

  const handleNativeTokenSubmit = async (cfToken: string) => {
    const success = await mintNativeToken(cfToken);
    if (success) {
      setSelectedToken(null);
      setIsOpen(false);
    }
  };

  const handleErc20TokenMint = async () => {
    if (!chain || !defaultTokenByChainId[chain.id as ChainId]) {
      return;
    }
    mintErc20Token();
  };

  useEffect(() => {
    if (erc20Mint?.mintReceipt) {
      setSelectedToken(null);
      setIsOpen(false);
    }
  }, [erc20Mint?.mintReceipt]);

  // Check if the current chain supports any faucet
  const hasNativeFaucet = chain?.id === 2039;
  const hasErc20Faucet =
    chain && defaultTokenByChainId[chain.id as ChainId] !== undefined;

  // Hide the faucet if no tokens are available for the current chain
  if (!hasNativeFaucet && !hasErc20Faucet) {
    return null;
  }
  if (!isConnected) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setSelectedToken(null);
          // isMinting state is now managed by the hooks
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full h-12" size="lg" variant="outline">
          <HandCoins className="mr-2 h-5 w-5" />
          Token Faucet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Faucet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!selectedToken ? (
            // Token selection view
            <div className="grid grid-cols-1 gap-4">
              <p className="text-sm text-muted-foreground mb-2">
                Select a token to mint:
              </p>
              {hasNativeFaucet && (
                <Button
                  className="w-full h-16 flex justify-between items-center"
                  variant="outline"
                  onClick={() => setSelectedToken("native")}
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
                  onClick={() => setSelectedToken("erc20")}
                >
                  <div className="flex items-center">
                    <Coins className="mr-2 h-5 w-5 text-green-500" />
                    <span>
                      {defaultTokenByChainId[chain.id as ChainId]?.symbol} Token
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    No captcha
                  </span>
                </Button>
              )}
            </div>
          ) : selectedToken === "native" && !isMinting ? (
            // Native token - Turnstile captcha
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-4">
                Complete the captcha to mint native tokens:
              </p>
              <Turnstile
                options={{
                  size: "normal",
                }}
                siteKey={import.meta.env.VITE_CF_KEY!}
                onSuccess={(cfToken) => void handleNativeTokenSubmit(cfToken)}
              />
            </div>
          ) : selectedToken === "erc20" && !isMinting && chain ? (
            // ERC20 token - Direct mint button
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-4">
                Click the button below to mint{" "}
                {defaultTokenByChainId[chain.id as ChainId]?.symbol} tokens:
              </p>
              <Button
                className="w-full"
                onClick={() => void handleErc20TokenMint()}
              >
                <Coins className="mr-2 h-5 w-5 text-green-500" />
                Mint {defaultTokenByChainId[chain.id as ChainId]?.symbol} Tokens
              </Button>
            </div>
          ) : (
            // Loading state
            <div className="flex flex-col items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">
                {selectedToken === "native"
                  ? "Minting native tokens..."
                  : `Minting ${chain && defaultTokenByChainId[chain.id as ChainId]?.symbol} tokens...`}
              </p>
            </div>
          )}

          {selectedToken && !isMinting && (
            <Button
              variant="outline"
              onClick={() => setSelectedToken(null)}
              className="mt-2"
            >
              Back to token selection
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Faucet;
