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
import { useShielderClient } from "@/lib/context/useShielderClient";
import { parseEther } from "viem";
import { shieldActionGasLimit } from "@cardinal-cryptography/shielder-sdk";
import { useAccount, useSendTransaction } from "wagmi";
import { useLatestProof } from "@/lib/context/useLatestProof";
import { useSaveLatestProof } from "@/lib/context/useSaveLatestProof";

const ShieldModal = () => {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { shielderClient } = useShielderClient();
  const { sendTransactionAsync } = useSendTransaction();
  const { address: walletAddress } = useAccount();
  const [isShielding, setIsShielding] = useState(false);
  const latestProof = useLatestProof();
  const { reset: resetLatestProof } = useSaveLatestProof();

  const handleSubmit = async () => {
    // Here you would typically handle the shield action
    const amountParsed = parseEther(amount);
    setIsShielding(true);
    await shielderClient!.shield(
      amountParsed,
      async (params) => {
        const txHash = await sendTransactionAsync!({
          ...params,
          gas: shieldActionGasLimit,
        }).catch((e) => {
          setIsShielding(false);
          setIsOpen(false);
          throw e;
        });
        return txHash;
      },
      walletAddress!,
    );
    setIsShielding(false);
    setIsOpen(false);
    setAmount("");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        resetLatestProof.mutate();
        setIsOpen(open);
        setIsShielding(false);
        setAmount("");
      }}
    >
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
            disabled={!amount || !shielderClient || !walletAddress}
          >
            {isShielding ? (
              // spinning loader
              <div>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </div>
            ) : (
              <div>
                <Shield className="mr-2 h-4 w-4" />
              </div>
            )}
            {isShielding
              ? !latestProof
                ? "Generating Proof..."
                : "Confirm transaction in Wallet"
              : "Shield Assets"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShieldModal;
