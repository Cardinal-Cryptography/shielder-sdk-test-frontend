import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Token } from "@/lib/tokens/types";
import { isAddress } from "viem";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = PopoverPrimitive.Content;

export interface ComboboxProps {
  tokens: Token[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Combobox({
  tokens,
  value,
  onChange,
  placeholder = "Select token...",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || "");

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // If it's a valid address, update the value
    if (newValue && isAddress(newValue as `0x${string}`)) {
      onChange(newValue);
    } else if (!newValue) {
      // If the input is cleared, reset the value
      onChange("");
    }
  };

  // Handle token selection
  const handleTokenSelect = (token: Token) => {
    if (token.isNative) {
      onChange("native");
      setInputValue(token.symbol);
    } else if (token.address) {
      onChange(token.address);
      setInputValue(token.symbol);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <input
          value={inputValue}
          onChange={handleInputChange}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          placeholder={placeholder}
        />
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="absolute inset-y-0 right-0 h-full px-3 hover:bg-transparent"
          >
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        className="w-[200px] p-0 bg-white rounded-md shadow-md z-50"
        align="start"
        sideOffset={4}
      >
        <div className="max-h-[300px] overflow-auto p-1">
          {tokens.map((token) => (
            <div
              key={token.isNative ? "native" : token.address}
              className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100",
                (token.isNative && value === "native") ||
                  (!token.isNative && token.address === value)
                  ? "bg-slate-100"
                  : "bg-transparent",
              )}
              onClick={() => handleTokenSelect(token)}
            >
              <span>{token.symbol}</span>
              {((token.isNative && value === "native") ||
                (!token.isNative && token.address === value)) && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </div>
          ))}
          {tokens.length === 0 && (
            <div className="text-center py-2 text-sm text-gray-500">
              No tokens available
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
