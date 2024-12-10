import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  defaultTestnet as defaultTestnetShielderConfig,
  empty as emptyShielderConfig,
  save as saveShielderConfig,
  shielderConfigSchema,
} from "@/lib/storage/shielderConfig";
import { useShielderConfig } from "@/lib/context/useShielderConfig";
import { useChainConfig } from "@/lib/context/useChainConfig";
import {
  defaultTestnet as defaultTestnetChainConfig,
  empty as emptyChainConfig,
  save as saveChainConfig,
  chainConfigSchema,
} from "@/lib/storage/chainConfig";
import { useQueryClient } from "@tanstack/react-query";

const capitalizeAndAddSpace = (str: string) => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const ConfigSection = () => {
  const queryClient = useQueryClient();

  const shielderOptions = Object.keys(shielderConfigSchema.shape);
  const shielderConfig = useShielderConfig();
  const [newShielderConfig, setNewShielderConfig] = useState<
    typeof shielderConfig | undefined
  >(undefined);

  const chainOptions = Object.keys(chainConfigSchema.shape);
  const chainConfig = useChainConfig();
  const [newChainConfig, setNewChainConfig] = useState<
    typeof chainConfig | undefined
  >(undefined);

  return (
    <div className="relative flex">
      {/* Config Panel */}
      <ScrollArea className="h-[95vh]">
        <div
          className={`
          transition-all duration-300 ease-in-out
          border-l bg-gray-50
          w-80 p-4
          space-y-8
        `}
        >
          <h1 className="text-xl font-bold mb-4">Configuration</h1>
          <Button
            className="w-full"
            onClick={async () => {
              saveShielderConfig(defaultTestnetShielderConfig());
              saveChainConfig(defaultTestnetChainConfig());
              alert("Configuration saved!");
              await queryClient.invalidateQueries({
                queryKey: ["shielderConfig"],
              });
              await queryClient.invalidateQueries({
                queryKey: ["chainConfig"],
              });
              await queryClient.invalidateQueries({
                queryKey: ["shielderClient"],
              });
            }}
          >
            Preload Testnet Defaults
          </Button>
          <div>
            <h2 className="text-lg font-semibold mb-2">Shielder SDK</h2>
            <div className="space-y-4">
              {shielderOptions.map((option) => (
                <div key={option}>
                  <label className="text-sm font-medium mb-1 block">
                    {capitalizeAndAddSpace(option)}
                  </label>
                  <Input
                    placeholder={
                      shielderConfig
                        ? shielderConfig[
                            option as keyof typeof shielderConfig
                          ] || ""
                        : ""
                    }
                    onChange={(e) => {
                      let cfg = newShielderConfig!;
                      if (!newShielderConfig) {
                        cfg = shielderConfig!;
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
                <Button
                  className="w-full"
                  onClick={() => {
                    saveShielderConfig(
                      newShielderConfig ||
                        shielderConfig ||
                        emptyShielderConfig(),
                    );
                    alert("Configuration saved!");
                    queryClient.invalidateQueries({
                      queryKey: ["shielderClient"],
                    });
                  }}
                >
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
          {/* Chain Config */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Chain</h2>
            <div className="space-y-4">
              {chainOptions.map((option) => (
                <div key={option}>
                  <label className="text-sm font-medium mb-1 block">
                    {capitalizeAndAddSpace(option)}
                  </label>
                  <Input
                    placeholder={
                      chainConfig
                        ? chainConfig[option as keyof typeof chainConfig] || ""
                        : ""
                    }
                    onChange={(e) => {
                      let cfg = newChainConfig!;
                      if (!newChainConfig) {
                        cfg = chainConfig!;
                      }
                      if (!cfg) {
                        cfg = emptyChainConfig();
                      }
                      cfg[option as keyof typeof cfg] = e.target.value;
                      setNewChainConfig(cfg);
                    }}
                  />
                </div>
              ))}
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    saveChainConfig(
                      newChainConfig || chainConfig || emptyChainConfig(),
                    );
                    alert("Configuration saved!");
                    queryClient.invalidateQueries({
                      queryKey: ["shielderClient"],
                    });
                  }}
                >
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
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
      </ScrollArea>
    </div>
  );
};

export default ConfigSection;
