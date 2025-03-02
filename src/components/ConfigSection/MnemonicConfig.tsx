import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useLocalSeed } from "@/lib/context/useLocalSeed";
import { CopyContent } from "@/components/ui/copy-content";
import {
  empty as emptySeedMnemonic,
  randomMnemonic,
  seedMnemonicConfigSchema,
  save as saveMnemonicConfig,
  SeedMnemonicConfig,
} from "@/lib/storage/seedMnemonicConfig";

const capitalizeAndAddSpace = (str: string) => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const maskMnemonic = (mnemonic: string) => {
  if (!mnemonic) return "";
  return mnemonic
    .split(" ")
    .map(() => "••••••")
    .join(" ");
};

const MnemonicConfig = () => {
  const {
    data: { seedMnemonicConfig },
    refetch: refetchSeed,
  } = useLocalSeed();

  const seedMnemonicOptions = Object.keys(seedMnemonicConfigSchema.shape);
  const [newSeedMnemonic, setSeedMnemonic] = useState<
    typeof seedMnemonicConfig | undefined
  >(undefined);

  const formRef = useRef<HTMLDivElement>(null);

  const handleSave = (seedMnemonicToSave: SeedMnemonicConfig) => {
    // const seedMnemonicToSave =
    //   newSeedMnemonic || seedMnemonicConfig || emptySeedMnemonic();

    saveMnemonicConfig(seedMnemonicToSave);
    refetchSeed();

    // Reset the states
    setSeedMnemonic(undefined);

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
      {/* Config Panel */}
      <div className="w-full" ref={formRef}>
        <Button
          className="w-full"
          onClick={() => {
            if (
              window.confirm(
                "This will overwrite your current mnemonic. Are you sure?",
              )
            ) {
              localStorage.clear();
              // reload the page
              window.location.reload();
              handleSave(randomMnemonic());
            }
          }}
        >
          Generate new mnemonic
        </Button>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Seed mnemonic</h2>
          <div className="space-y-4">
            {seedMnemonicOptions.map((option) => (
              <div key={option}>
                <div className="flex">
                  <label className="text-sm font-medium mb-1 block">
                    {capitalizeAndAddSpace(option)}
                  </label>

                  <CopyContent
                    content={
                      seedMnemonicConfig
                        ? seedMnemonicConfig[
                            option as keyof typeof seedMnemonicConfig
                          ] || ""
                        : ""
                    }
                  />
                </div>
                <Input
                  placeholder={maskMnemonic(
                    seedMnemonicConfig
                      ? seedMnemonicConfig[
                          option as keyof typeof seedMnemonicConfig
                        ] || ""
                      : "",
                  )}
                  onChange={(e) => {
                    let cfg = { ...newSeedMnemonic! };
                    if (!newSeedMnemonic) {
                      cfg = { ...seedMnemonicConfig! };
                    }
                    if (!cfg) {
                      cfg = emptySeedMnemonic();
                    }
                    cfg[option as keyof typeof cfg] = e.target.value;
                    setSeedMnemonic(cfg);
                  }}
                />
              </div>
            ))}
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => {
                  localStorage.clear();
                  // reload the page
                  window.location.reload();
                  handleSave(
                    newSeedMnemonic ||
                      seedMnemonicConfig ||
                      emptySeedMnemonic(),
                  );
                }}
              >
                Load Mnemonic
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MnemonicConfig;
