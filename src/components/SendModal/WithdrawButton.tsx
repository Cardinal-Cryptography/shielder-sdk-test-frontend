import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { WithdrawButtonProps } from "./types";

const WithdrawButton = ({ disabled, onClick }: WithdrawButtonProps) => {
  if (!disabled) {
    return (
      <Button className="w-full h-12" size="lg" onClick={onClick}>
        <Send className="mr-2 h-5 w-5" />
        Withdraw
      </Button>
    );
  }

  return (
    <Button className="w-full h-12" size="lg" disabled>
      <Send className="mr-2 h-5 w-5" />
      Withdraw
    </Button>
  );
};

export default WithdrawButton;
