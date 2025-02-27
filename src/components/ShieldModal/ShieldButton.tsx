import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { ShieldButtonProps } from "./types";

const ShieldButton = ({
  isConnected,
  accountChainIdSupported,
  onClick,
}: ShieldButtonProps) => {
  if (isConnected && accountChainIdSupported) {
    return (
      <Button className="w-full h-12" size="lg" onClick={onClick}>
        <Shield className="mr-2 h-5 w-5" />
        Shield
      </Button>
    );
  }

  return (
    <Button className="w-full h-12" size="lg" disabled>
      <Shield className="mr-2 h-5 w-5" />
      Shield (Connect Wallet)
    </Button>
  );
};

export default ShieldButton;
