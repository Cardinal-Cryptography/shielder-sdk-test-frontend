import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AmountInputProps } from "./types";

const AmountInput = ({
  amount,
  onAmountChange,
  selectedToken,
  selectedTokenValue,
}: AmountInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");
    onAmountChange(value);
  };

  const displaySymbol =
    selectedToken?.symbol ||
    (selectedTokenValue && selectedTokenValue !== "native" ? "Loading..." : "");

  return (
    <div className="grid gap-2">
      <Label htmlFor="amount">Amount</Label>
      <div className="relative">
        <Input
          id="amount"
          placeholder="Enter amount"
          value={amount}
          onChange={handleChange}
          className="pr-12"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          {displaySymbol}
        </span>
      </div>
    </div>
  );
};

export default AmountInput;
