import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import {
  empty as emptyShielderConfig,
  shielderConfigSchema,
} from "@/lib/storage/shielderConfig";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { useConfig } from "@/lib/context/useConfig";
import { useSaveConfig } from "@/lib/context/useSaveConfig";
import { CopyContent } from "@/components/ui/copy-content";
import {
  empty as emptySeedMnemonic,
  randomMnemonic,
  seedMnemonicConfigSchema,
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

const ConfigSection = () => {
  const { shielderConfig, seedMnemonicConfig } = useConfig();

  const shielderOptions = Object.keys(shielderConfigSchema.shape);
  const [newShielderConfig, setNewShielderConfig] = useState<
    typeof shielderConfig | undefined
  >(undefined);

  const seedMnemonicOptions = Object.keys(seedMnemonicConfigSchema.shape);
  const [newSeedMnemonic, setSeedMnemonic] = useState<
    typeof seedMnemonicConfig | undefined
  >(undefined);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const saveConfig = useSaveConfig();

  const formRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    saveConfig.mutate({
      shielderConfig:
        newShielderConfig || shielderConfig || emptyShielderConfig(),
      seedMnemonicConfig:
        newSeedMnemonic || seedMnemonicConfig || emptySeedMnemonic(),
    });

    // Reset the states
    setNewShielderConfig(undefined);
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
      {/* Toggle Button for Mobile */}
      <Button
        className="md:hidden fixed top-1 right-2 z-50 font-semibold text-xs w-20 h-8"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        Config {isMobileMenuOpen ? <ArrowLeftCircle /> : <ArrowRightCircle />}
      </Button>
      {/* Config Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 bg-gray-50 border-l p-4 space-y-8
          z-40 transform transition-transform duration-300 ease-in-out
          overflow-y-auto
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          md:static md:translate-x-0 md:h-[95vh] md:flex
        `}
      >
        <div className="w-full" ref={formRef}>
          <h1 className="text-xl font-bold mb-4">Configuration</h1>
          <Button
            className="w-full"
            onClick={() => {
              saveConfig.mutate({
                shielderConfig:
                  newShielderConfig || shielderConfig || emptyShielderConfig(),
                seedMnemonicConfig: randomMnemonic(),
              });
              if (formRef.current) {
                const inputs = formRef.current.getElementsByTagName("input");
                Array.from(inputs).forEach((input) => {
                  input.value = "";
                });
              }
              alert("Configuration saved!");
            }}
          >
            Generate random mnemonic
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
                <Button className="w-full" onClick={() => handleSave()}>
                  Load Mnemonic
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8">
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
                          ? shielderConfig[
                              option as keyof typeof shielderConfig
                            ] || ""
                          : ""
                      }
                    />
                  </div>
                  <Input
                    placeholder={
                      shielderConfig
                        ? shielderConfig[
                            option as keyof typeof shielderConfig
                          ] || ""
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
          <Button
            className="w-full mb-4 mt-8"
            onClick={async () => {
              localStorage.clear();
              // reload the page
              window.location.reload();
            }}
            variant="destructive"
          >
            Reset the whole app
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfigSection;
