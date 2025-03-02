import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import {
  empty as emptyShielderConfig,
  shielderConfigSchema,
  save as saveShielderConfig,
} from "@/lib/storage/shielderConfig";
import { CopyContent } from "@/components/ui/copy-content";
import { useChain } from "@/lib/context/useChain";
import { ChainId } from "@/lib/chains";

const capitalizeAndAddSpace = (str: string) => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const ShielderConfig = () => {
  const { data: chainData, refetch } = useChain();

  const shielderOptions = Object.keys(shielderConfigSchema.shape);
  const [newShielderConfig, setNewShielderConfig] = useState<
    NonNullable<typeof chainData>["shielderConfig"] | undefined
  >(undefined);

  const formRef = useRef<HTMLDivElement>(null);

  if (!chainData) {
    // say that chain is not available
    return (
      <div className="flex items-center justify-center h-96">
        <p>Chain not available</p>
      </div>
    );
  }

  const { shielderConfig, chain } = chainData;

  const handleSave = () => {
    saveShielderConfig(
      chain.id as ChainId,
      newShielderConfig || shielderConfig || emptyShielderConfig(),
    );

    // Reset the states
    setNewShielderConfig(undefined);

    refetch();

    // Reset all input fields
    if (formRef.current) {
      const inputs = formRef.current.getElementsByTagName("input");
      Array.from(inputs).forEach((input) => {
        input.value = "";
      });
    }

    alert("Configuration saved!");
  };

  return (
    <div className="">
      <div className="w-full" ref={formRef}>
        <h2 className="text-lg font-semibold mb-2">Shielder SDK</h2>
        <div className="space-y-4">
          {shielderOptions.map((option) => (
            <div key={option}>
              <div className="flex">
                <label className="text-sm font-medium mb-1 block">
                  {capitalizeAndAddSpace(option)}
                </label>

                <CopyContent
                  content={
                    shielderConfig
                      ? shielderConfig[option as keyof typeof shielderConfig] ||
                        ""
                      : ""
                  }
                />
              </div>
              <Input
                placeholder={
                  shielderConfig
                    ? shielderConfig[option as keyof typeof shielderConfig] ||
                      ""
                    : ""
                }
                onChange={(e) => {
                  let cfg = { ...newShielderConfig! };
                  if (!newShielderConfig) {
                    cfg = { ...shielderConfig! };
                  }
                  if (!cfg) {
                    cfg = emptyShielderConfig();
                  }
                  cfg[option as keyof typeof cfg] = e.target.value;
                  setNewShielderConfig(cfg);
                }}
              />
            </div>
          ))}
          <div className="space-y-2">
            <Button className="w-full" onClick={() => handleSave()}>
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShielderConfig;
