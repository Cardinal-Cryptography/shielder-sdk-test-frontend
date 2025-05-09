import { Button } from "@/components/ui/button";
import { HandCoins } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { defaultTokensByChainId } from "@/lib/tokens/index";
import { ChainId } from "@/lib/chains";
import { useNativeTokenMint } from "@/lib/faucet/useNativeTokenMint";
import { useErc20TokenMint } from "@/lib/faucet/useErc20TokenMint";
import { TokenSelectionView } from "@/components/Faucet/TokenSelectionView";
import { NativeTokenMintView } from "@/components/Faucet/NativeTokenMintView";
import { Erc20TokenMintView } from "@/components/Faucet/ERC20TokenMintView";
import { MintingLoadingView } from "@/components/Faucet/MintingLoadingView";
import { TokenType } from "@/components/Faucet/types";

// BackButton Component
type BackButtonProps = {
  onClick: () => void;
};

const BackButton = ({ onClick }: BackButtonProps) => (
  <Button variant="outline" onClick={onClick} className="mt-2">
    Back to token selection
  </Button>
);

// Main Faucet Component
const Faucet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenType | null>(null);
  const { isConnected, chain } = useAccount();

  const defaultErc20Token = defaultTokensByChainId[chain?.id as ChainId]?.at(0);
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
    if (!chain || !defaultTokensByChainId[chain.id as ChainId]) {
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
  const hasNativeFaucet = chain?.id === 2039 || false;
  const hasErc20Faucet =
    chain && defaultTokensByChainId[chain.id as ChainId] !== undefined
      ? true
      : false;
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
            <TokenSelectionView
              hasNativeFaucet={hasNativeFaucet}
              hasErc20Faucet={hasErc20Faucet}
              chain={chain}
              onSelectToken={setSelectedToken}
            />
          ) : selectedToken === "native" && !isMinting ? (
            <NativeTokenMintView onSubmit={handleNativeTokenSubmit} />
          ) : selectedToken === "erc20" && !isMinting && chain ? (
            <Erc20TokenMintView
              token={defaultTokensByChainId[chain.id as ChainId]![0]}
              chain={chain}
              onMint={handleErc20TokenMint}
            />
          ) : (
            <MintingLoadingView selectedToken={selectedToken} chain={chain} />
          )}

          {selectedToken && !isMinting && (
            <BackButton onClick={() => setSelectedToken(null)} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Faucet;
