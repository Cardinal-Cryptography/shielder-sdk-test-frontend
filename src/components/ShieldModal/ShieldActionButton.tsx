import { Button } from "@/components/ui/button";
import { Loader2, Shield, Check } from "lucide-react";
import { ShieldActionButtonProps } from "./types";

const ShieldActionButton = ({
  isShielding,
  isApproving,
  needsApproval,
  amount,
  shielderClient,
  walletAddress,
  latestProof,
  isTokenSelected,
  onSubmit,
}: ShieldActionButtonProps) => {
  const getButtonText = () => {
    if (!isTokenSelected) {
      return "Select Token";
    }
    if (isApproving) {
      return "Approving Tokens...";
    }

    if (isShielding) {
      return !latestProof
        ? "Generating Proof..."
        : "Confirm transaction in Wallet";
    }

    if (needsApproval) {
      return "Approve Tokens";
    }

    return "Shield Assets";
  };

  const getButtonIcon = () => {
    if (isShielding || isApproving) {
      return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
    }

    if (needsApproval) {
      return <Check className="mr-2 h-4 w-4" />;
    }

    return <Shield className="mr-2 h-4 w-4" />;
  };

  return (
    <Button
      onClick={onSubmit}
      className="w-full"
      disabled={
        !amount ||
        !shielderClient ||
        !walletAddress ||
        (isShielding && !latestProof) ||
        isApproving
      }
    >
      <div>{getButtonIcon()}</div>
      {getButtonText()}
    </Button>
  );
};

export default ShieldActionButton;
