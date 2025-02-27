import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { TokenSelectorProps } from "./types";

const TokenSelector = ({
  tokens,
  selectedTokenValue,
  onTokenChange,
}: TokenSelectorProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="token">Token</Label>
      <Combobox
        tokens={tokens}
        value={selectedTokenValue}
        onChange={onTokenChange}
        placeholder="Select token or enter address"
      />
    </div>
  );
};

export default TokenSelector;
