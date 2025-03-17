import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveLatestProof } from "@/lib/shielder/useSaveLatestProof";
import { useLatestProof } from "@/lib/shielder/useLatestProof";
import { useAccount } from "wagmi";
import { Switch } from "@/components/ui/switch";
import { useTokenList } from "@/lib/tokens/useTokenList";
import {
  TokenSelector,
  AmountInput,
  useSelectedToken,
} from "@/components/shared/tokens";
import WithdrawButton from "./WithdrawButton";
import WithdrawActionButton from "./WithdrawActionButton";
import { useWithdraw } from "@/lib/shielder/useWithdraw";
import { useNativeToken } from "@/lib/tokens/useNativeToken";
import { useShielderClient } from "@/lib/shielder/useShielderClient";
import { parseDecimals } from "@/lib/utils";

const SendModal = () => {
  // State
  const [amount, setAmount] = useState("");
  const [addressTo, setAddressTo] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTokenValue, setSelectedTokenValue] = useState<string>("");
  const [useManualWithdraw] = useState(true);

  // Hooks
  const latestProof = useLatestProof();
  const { reset: resetLatestProof } = useSaveLatestProof();
  const { address: walletAddress, isConnected, chain } = useAccount();
  const nativeToken = useNativeToken();
  const tokens = [nativeToken!, ...useTokenList()];
  const { data: selectedToken } = useSelectedToken(tokens, selectedTokenValue);
  console.log(selectedToken);

  const { data: shielderClient } = useShielderClient();

  const { data: withdrawData, withdraw } = useWithdraw({
    token: selectedToken,
  });

  // Handlers
  const handleOpenChange = (open: boolean) => {
    resetLatestProof.mutate();
    setIsOpen(open);
    setAmount("");
    setAddressTo("");

    // Reset token selection when modal is closed
    if (!open) {
      setSelectedTokenValue("");
    }
  };

  const handleSubmit = async () => {
    const amountParsed = parseDecimals(amount, selectedToken?.decimals);
    try {
      await withdraw(
        amountParsed,
        addressTo as `0x${string}`,
        useManualWithdraw,
      );
    } catch (e) {
      console.error(e);
      setIsOpen(false);
      setSelectedTokenValue("");
      return;
    }
    setIsOpen(false);
    setAmount("");
    setAddressTo("");
    setSelectedTokenValue("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <WithdrawButton
          disabled={!(isConnected && chain && shielderClient)}
          onClick={() => setIsOpen(true)}
        />
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
              // onCheckedChange={setUseManualWithdraw}
            />
            <Label htmlFor="manual-mode">Manual transaction mode</Label>
          </div>
          <WithdrawActionButton
            isTokenSelected={!!selectedToken}
            isSending={withdrawData?.isSending ?? false}
            amount={amount}
            addressTo={addressTo}
            walletAddress={walletAddress}
            latestProof={latestProof}
            useManualWithdraw={useManualWithdraw}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendModal;
