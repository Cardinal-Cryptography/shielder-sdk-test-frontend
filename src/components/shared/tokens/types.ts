import { Token } from "@/lib/tokens/types";

export interface SelectedToken extends Token {
  isNative: boolean;
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
