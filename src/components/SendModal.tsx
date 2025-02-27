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
import {
  nativeToken,
  erc20Token,
  shieldActionGasLimit,
} from "@cardinal-cryptography/shielder-sdk";
import { useAccount, useSendTransaction } from "wagmi";
import { Switch } from "@/components/ui/switch";
import { useTokenList } from "@/lib/context/useTokenList";
import {
  TokenSelector,
  AmountInput,
  useSelectedToken,
} from "@/components/shared/tokens";

const SendModal = () => {
  const [amount, setAmount] = useState("");
  const [addressTo, setAddressTo] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTokenValue, setSelectedTokenValue] = useState<string>("");
  const { shielderClient } = useShielderClient();
  const { shielderConfig } = useConfig();
  const [isSending, setIsSending] = useState(false);
  const [useManualWithdraw, setUseManualWithdraw] = useState(false);
  const latestProof = useLatestProof();
  const { reset: resetLatestProof } = useSaveLatestProof();
  const { sendTransactionAsync } = useSendTransaction();
  const { address: walletAddress } = useAccount();
  const tokens = useTokenList();
  const selectedToken = useSelectedToken(tokens, selectedTokenValue);
  console.log(selectedToken);

  const handleSubmit = async () => {
    // Here you would typically handle the shield action
    const amountParsed = parseEther(amount);
    setIsSending(true);

    try {
      // Determine which token to use
      const token =
        !selectedTokenValue || selectedTokenValue === "native"
          ? nativeToken()
          : erc20Token(selectedTokenValue as `0x${string}`);

      if (useManualWithdraw) {
        // Use withdrawManual for manual transaction handling
        await shielderClient!.withdrawManual(
          token,
          amountParsed,
          addressTo as `0x${string}`,
          async (params) => {
            const txHash = await sendTransactionAsync!({
              ...params,
              gas: shieldActionGasLimit,
            }).catch((e) => {
              throw e;
            });
            return txHash;
          },
          walletAddress!,
        );
      } else {
        const fees = await shielderClient!.getWithdrawFees();
        // Use regular withdraw
        await shielderClient!.withdraw(
          token,
          amountParsed + fees.totalFee,
          fees.totalFee,
          addressTo as `0x${string}`,
        );
      }
    } catch (e) {
      console.error(e);
      setIsSending(false);
      setIsOpen(false);
      return;
    }

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
        setSelectedTokenValue("");
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
          <TokenSelector
            tokens={tokens}
            selectedTokenValue={selectedTokenValue}
            onTokenChange={setSelectedTokenValue}
          />
          <AmountInput
            amount={amount}
            onAmountChange={setAmount}
            selectedToken={selectedToken}
            selectedTokenValue={selectedTokenValue}
          />
          <div className="grid gap-2">
            <Label htmlFor="address">To address</Label>
            <div className="relative">
              <Input
                id="address"
                placeholder="Enter address"
                value={addressTo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAddressTo(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="manual-mode"
              checked={useManualWithdraw}
              onCheckedChange={setUseManualWithdraw}
            />
            <Label htmlFor="manual-mode">Manual transaction mode</Label>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={
              !amount ||
              !shielderClient ||
              selectedToken == null ||
              !shielderConfig ||
              (useManualWithdraw && (!walletAddress || !sendTransactionAsync))
            }
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
                : useManualWithdraw
                  ? "Confirm transaction in Wallet"
                  : "Sending..."
              : "Withdraw Assets"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendModal;
