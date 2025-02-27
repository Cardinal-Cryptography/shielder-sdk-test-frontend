import { Button } from "@/components/ui/button";
import { HandCoins, Loader2, Coins } from "lucide-react";
import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useAccount, useSendTransaction } from "wagmi";
import { useChainId } from "@/lib/context/useChainId";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/lib/context/useToast";
import { encodeFunctionData } from "viem";
import { PEPE_TOKEN_ADDRESS } from "@/lib/constants";

type TokenType = "native" | "pepe";

const Faucet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenType | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { toast } = useToast();
  const { sendTransactionAsync } = useSendTransaction();

  const handleNativeTokenSubmit = async (cfToken: string) => {
    setIsMinting(true);
    try {
      const response = await fetch("/api/faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: address!, cfToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to top up account.");
      }

      toast({
        title: "Success",
        description: "Native tokens have been minted to your account.",
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to mint native tokens.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
      setSelectedToken(null);
      setIsOpen(false);
    }
  };

  const handlePepeTokenMint = async () => {
    setIsMinting(true);
    try {
      // Mock implementation for PEPE token minting
      const functionCalldata = encodeFunctionData({
        abi: [
          {
            type: "function",
            name: "mint",
            inputs: [
              { name: "to", type: "address", internalType: "address" },
              { name: "amount", type: "uint256", internalType: "uint256" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
        args: [address!, 10n * 10n ** 18n], // Mint 10 PEPE tokens
      });
      await sendTransactionAsync!({
        to: PEPE_TOKEN_ADDRESS,
        data: functionCalldata,
      });

      console.log("Minting PEPE tokens to address:", address);

      toast({
        title: "Success",
        description: "Sent mint transaction for PEPE tokens.",
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to mint PEPE tokens.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
      setSelectedToken(null);
      setIsOpen(false);
    }
  };

  if (chainId !== 2039) {
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
          setIsMinting(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full h-12" size="lg" variant="outline">
          <HandCoins className="mr-2 h-5 w-5" />
          Faucet (Testnet)
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
              <Button
                className="w-full h-16 flex justify-between items-center"
                variant="outline"
                onClick={() => setSelectedToken("pepe")}
              >
                <div className="flex items-center">
                  <Coins className="mr-2 h-5 w-5 text-green-500" />
                  <span>PEPE Token</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  No captcha
                </span>
              </Button>
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
          ) : selectedToken === "pepe" && !isMinting ? (
            // PEPE token - Direct mint button
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-4">
                Click the button below to mint PEPE tokens:
              </p>
              <Button
                className="w-full"
                onClick={() => void handlePepeTokenMint()}
              >
                <Coins className="mr-2 h-5 w-5 text-green-500" />
                Mint PEPE Tokens
              </Button>
            </div>
          ) : (
            // Loading state
            <div className="flex flex-col items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">
                {selectedToken === "native"
                  ? "Minting native tokens..."
                  : "Minting PEPE tokens..."}
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
