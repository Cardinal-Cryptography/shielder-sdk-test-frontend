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
import { Loader2, Send } from "lucide-react";
import { useShielderClient } from "@/lib/context/useShielderClient";
import { parseEther } from "viem";
import { useConfig } from "@/lib/context/useConfig";
import { useSaveLatestProof } from "@/lib/context/useSaveLatestProof";
import { useLatestProof } from "@/lib/context/useLatestProof";

const SendModal = () => {
  const [amount, setAmount] = useState("");
  const [addressTo, setAddressTo] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { shielderClient } = useShielderClient();
  const { shielderConfig } = useConfig();
  const [isSending, setIsSending] = useState(false);
  const latestProof = useLatestProof();
  const { reset: resetLatestProof } = useSaveLatestProof();

  const handleSubmit = async () => {
    // Here you would typically handle the shield action
    const amountParsed = parseEther(amount);
    const fees = await shielderClient!.getWithdrawFees();
    setIsSending(true);
    await shielderClient!.withdraw(
      amountParsed + fees.totalFee,
      fees.totalFee,
      addressTo as `0x${string}`,
    );
    setIsOpen(false);
    setIsSending(false);
    setAmount("");
    setAddressTo("");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        resetLatestProof.mutate();
        setIsOpen(open);
        setIsSending(false);
        setAmount("");
        setAddressTo("");
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full h-12" size="lg">
          <Send className="mr-2 h-5 w-5" />
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Assets</DialogTitle>
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
          <div className="grid gap-2">
            <Label htmlFor="amount">To address</Label>
            <div className="relative">
              <Input
                id="amount"
                placeholder="Enter address"
                value={addressTo}
                onChange={(e) => {
                  setAddressTo(e.target.value);
                }}
              />
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!amount || !shielderClient || !shielderConfig}
          >
            {isSending ? (
              // spinning loader
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isSending
              ? !latestProof
                ? "Generating Proof..."
                : "Sending..."
              : "Withdraw Assets"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendModal;
