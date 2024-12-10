import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield } from "lucide-react";
import { useShielderSdk } from "@/lib/context/useShielderSdk";
import { parseEther } from "viem";
import { shieldActionGasLimit } from "@cardinal-cryptography/shielder-sdk";
import { useChainConfig } from "@/lib/context/useChainConfig";
import { useShielderConfig } from "@/lib/context/useShielderConfig";
import { getBlockchainClient } from "@/lib/getBlockchainClient";

const ShieldModal = () => {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { shielderClient } = useShielderSdk();
  const chainConfig = useChainConfig();
  const shielderConfig = useShielderConfig();
  const [isShielding, setIsShielding] = useState(false);

  const handleSubmit = async () => {
    // Here you would typically handle the shield action
    console.log("Shield amount:", amount);
    const amountParsed = parseEther(amount);
    const walletClient = await getBlockchainClient(
      chainConfig!,
      shielderConfig!,
    );
    setIsShielding(true);
    const txHash = await shielderClient!.shield(
      amountParsed,
      async (params) => {
        const txHash = await walletClient!.sendTransaction({
          ...params,
          gas: shieldActionGasLimit,
        });
        return txHash;
      },
      walletClient!.account.address,
    );
    setIsShielding(false);
    console.log("Shield transaction hash:", txHash);
    setIsOpen(false);
    setAmount("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-12" size="lg">
          <Shield className="mr-2 h-5 w-5" />
          Shield
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Shield Assets</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  // Only allow numbers and decimal point
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  setAmount(value);
                }}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                AZERO
              </span>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={
              !amount || !shielderClient || !chainConfig || !shielderConfig
            }
          >
            {isShielding ? (
              // spinning loader
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Shield className="mr-2 h-4 w-4" />
            )}
            Shield Assets
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShieldModal;
