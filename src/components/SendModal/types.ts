import { Token } from "@/lib/tokens/types";

export interface SelectedToken extends Token {
  isNative: boolean;
}

export interface WithdrawButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

export interface WithdrawActionButtonProps {
  isTokenSelected: boolean;
  isSending: boolean;
  amount: string;
  addressTo: string;
  walletAddress: string | undefined;
  latestProof: number | null;
  useManualWithdraw: boolean;
  onSubmit: () => Promise<void>;
}
