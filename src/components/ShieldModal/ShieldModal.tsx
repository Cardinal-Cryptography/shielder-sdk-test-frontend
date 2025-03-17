import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAccount } from "wagmi";
import { useLatestProof } from "@/lib/shielder/useLatestProof";
import { useSaveLatestProof } from "@/lib/shielder/useSaveLatestProof";
import { useTokenList } from "@/lib/tokens/useTokenList";

import ShieldButton from "./ShieldButton";
import ShieldActionButton from "./ShieldActionButton";
import {
  TokenSelector,
  AmountInput,
  useSelectedToken,
} from "@/components/shared/tokens";
import { useTokenAllowance } from "@/lib/tokens/useTokenAllowance";
import { useShield } from "@/lib/shielder/useShield";
import { useNativeToken } from "@/lib/tokens/useNativeToken";
import { useShielderClient } from "@/lib/shielder/useShielderClient";
import { parseDecimals } from "@/lib/utils";

const ShieldModal = () => {
  // State
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTokenValue, setSelectedTokenValue] = useState<string>("");
  const [needsApproval, setNeedsApproval] = useState(false);

  // Hooks
  const { address: walletAddress, isConnected, chain } = useAccount();
  const latestProof = useLatestProof();
  const { reset: resetLatestProof } = useSaveLatestProof();
  const nativeToken = useNativeToken();
  const tokens = [nativeToken!, ...useTokenList()];
  const { data: selectedToken } = useSelectedToken(tokens, selectedTokenValue);
  const { data: shielderClient } = useShielderClient();

  const { data: shieldData, shield } = useShield({
    token: selectedToken,
  });

  const { data: allowanceData, approve: approveToken } = useTokenAllowance({
    fromAddress: walletAddress,
    tokenAddress: selectedToken?.address as `0x${string}`,
  });

  // Check if approval is needed when amount or selected token changes
  useEffect(() => {
    if (
      selectedToken &&
      !selectedToken.isNative &&
      amount &&
      allowanceData?.tokenAllowance !== undefined
    ) {
      const amountParsed = parseDecimals(amount, selectedToken.decimals);
      setNeedsApproval(amountParsed > allowanceData.tokenAllowance);
    } else {
      setNeedsApproval(false);
    }
  }, [amount, selectedToken, allowanceData]);

  // Handlers
  const handleOpenChange = (open: boolean) => {
    resetLatestProof.mutate();
    setIsOpen(open);
    setAmount("");

    // Reset token selection when modal is closed
    if (!open) {
      setSelectedTokenValue("");
    }
  };

  // Handle token approval
  const handleApproveToken = async () => {
    if (!selectedToken || selectedToken.isNative || !amount) {
      return;
    }
    approveToken(parseDecimals("1000000000", selectedToken?.decimals));
  };

  const handleSubmit = async () => {
    const amountParsed = parseDecimals(amount, selectedToken?.decimals);
    try {
      await shield(amountParsed);
    } catch (e) {
      console.error(e);
      setIsOpen(false);
      setSelectedTokenValue("");
    }
    setIsOpen(false);
    setAmount("");
    setSelectedTokenValue("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <ShieldButton
          disabled={!(isConnected && chain && shielderClient)}
          onClick={() => setIsOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Shield Assets</DialogTitle>
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
          <ShieldActionButton
            isTokenSelected={!!selectedToken}
            isShielding={shieldData?.isShielding ?? false}
            isApproving={allowanceData?.isApproving ?? false}
            needsApproval={needsApproval}
            amount={amount}
            walletAddress={walletAddress}
            latestProof={latestProof}
            onSubmit={needsApproval ? handleApproveToken : handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShieldModal;
