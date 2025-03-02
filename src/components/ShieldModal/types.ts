import { Token } from "@/lib/tokens/types";

export interface SelectedToken extends Token {
  isNative: boolean;
}

export interface ShieldButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export interface TokenSelectorProps {
  tokens: Token[];
  selectedTokenValue: string;
  onTokenChange: (value: string) => void;
}

export interface AmountInputProps {
  amount: string;
  onAmountChange: (value: string) => void;
  selectedToken: SelectedToken | null;
  selectedTokenValue: string;
}

export interface ShieldActionButtonProps {
  isTokenSelected: boolean;
  isShielding: boolean;
  isApproving: boolean;
  needsApproval: boolean;
  amount: string;
  walletAddress: string | undefined;
  latestProof: number | null;
  onSubmit: () => Promise<void>;
}
