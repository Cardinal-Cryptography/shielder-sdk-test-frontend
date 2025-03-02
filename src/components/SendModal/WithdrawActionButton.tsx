import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { WithdrawActionButtonProps } from "./types";

const WithdrawActionButton = ({
  isSending,
  amount,
  addressTo,
  walletAddress,
  latestProof,
  isTokenSelected,
  useManualWithdraw,
  onSubmit,
}: WithdrawActionButtonProps) => {
  const getButtonText = () => {
    if (!isTokenSelected) {
      return "Select Token";
    }

    if (isSending) {
      return !latestProof
        ? "Generating Proof..."
        : useManualWithdraw
          ? "Confirm transaction in Wallet"
          : "Sending...";
    }

    return "Withdraw Assets";
  };

  const getButtonIcon = () => {
    if (isSending) {
      return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
    }

    return <Send className="mr-2 h-4 w-4" />;
  };

  return (
    <Button
      onClick={onSubmit}
      className="w-full"
      disabled={
        !amount ||
        !addressTo ||
        !walletAddress ||
        (isSending && !latestProof) ||
        !isTokenSelected
      }
    >
      {getButtonIcon()}
      {getButtonText()}
    </Button>
  );
};

export default WithdrawActionButton;
