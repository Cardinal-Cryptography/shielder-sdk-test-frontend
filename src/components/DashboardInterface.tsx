import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import ConfigSection from "@/components/ConfigSection";
import ShieldModal from "@/components/ShieldModal";
import useWasm from "@/lib/context/useWasm";
import DependenciesAlert from "@/components/DependenciesAlert";
import { useShielderClient } from "@/lib/context/useShielderClient";
import { Transactions } from "@/components/Transactions";
import {
  accountChainIdSupported,
  clearShielderClientStorage,
} from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import SendModal from "@/components/SendModal";
import Faucet from "@/components/Faucet";
import { ConnectKitButton } from "connectkit";
import { Switch } from "@/components/ui/switch";
import { useSaveConfig } from "@/lib/context/useSaveConfig";
import { useConfig } from "@/lib/context/useConfig";
import { TokenBalances } from "@/components/TokenBalances";
import { useChain } from "@/lib/context/useChain";
import { useSwitchChain } from "@/lib/context/useSwitchChain";
import { useAccount } from "wagmi";
import { useChainId } from "@/lib/context/useChainId";

const DashboardInterface = () => {
  const { isWasmLoaded } = useWasm();
  const { error } = useShielderClient();
  const queryClient = useQueryClient();
  const { shielderConfig } = useConfig();
  const saveConfig = useSaveConfig();
  // const { switchChainAsync } = useSwitchChain();
  const { chainId: accountChainId } = useAccount();
  const switchChain = useSwitchChain();
  const currentChain = useChain();
  const chainId = useChainId();

  const header = (children: React.ReactNode) => {
    return (
      <div className="h-screen flex flex-col">
        {/* Navigation Bar */}
        <nav className="h-14 border-b px-4 flex items-center bg-white">
          <h1 className="text-xl font-bold">Testing grounds of shielder-sdk</h1>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Section - Main Content */}
          <div className="flex-1 p-4 flex flex-col gap-4">
            {/* Header */}
            {/* put them horizontally */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <DependenciesAlert />
              <div className="flex justify-center space-x-8">
                <div className="flex flex-col justify-center items-center">
                  <ConnectKitButton />
                  {accountChainId ? (
                    !accountChainIdSupported(accountChainId) ? (
                      <p className="text-red-500">Unsupported chain!</p>
                    ) : accountChainId !== chainId ? (
                      <p className="text-red-500">
                        Switch to{" "}
                        <span className="font-bold">{currentChain.name}</span>{" "}
                        in wallet!
                      </p>
                    ) : null
                  ) : null}
                </div>
                <div className="flex items-center space-x-2">
                  <p> Testnet </p>
                  <Switch
                    className="data-[state=unchecked]:bg-green-500 data-[state=checked]:bg-red-500"
                    checked={currentChain.id !== 2039}
                    onCheckedChange={async (checked) => {
                      if (checked) {
                        switchChain.mutate(41455);
                      } else {
                        switchChain.mutate(2039);
                      }
                      console.log(shielderConfig);
                      if (shielderConfig) {
                        saveConfig.mutate({
                          shielderConfig,
                        });
                      }
                    }}
                  />
                  <p> Mainnet </p>
                </div>
              </div>
            </div>

            {children}
          </div>
          {/* Right Section - Configuration */}
          <ConfigSection />
        </div>
      </div>
    );
  };

  // Sample transaction data

  if (!isWasmLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          Loading Shielder SDK, please wait...
        </p>
      </div>
    );
  }

  // if (!chainId) {
  //   return header(
  //     <div className="h-screen flex items-center justify-center">
  //       <p className="text-lg font-semibold">
  //         Unsupported chain. Please switch to Aleph Testnet or Mainnet.
  //       </p>
  //     </div>,
  //   );
  // }

  if (error) {
    return header(
      <div className="h-full flex items-center justify-center">
        <p className="text-lg font-semibold">
          Shielder SDK failed to load. Please check your configuration.
          <span> </span>
          <span className="font-bold text-orange-600 ">
            Error: {error.message}
          </span>
        </p>
      </div>,
    );
  }

  return header(
    <div>
      {!error ? (
        <>
          {/* Two columns: Actions and Balance */}
          <div className="grid grid-cols-1 mb-4 md:grid-cols-3 gap-4">
            {/* Action Buttons */}
            <div className="space-y-2">
              <ShieldModal />
              <SendModal />
              <Button
                className="w-full h-12"
                size="lg"
                variant="outline"
                onClick={() => {
                  clearShielderClientStorage(queryClient);
                }}
              >
                <RefreshCcw className="mr-2 h-5 w-5" />
                Resync
              </Button>
              <Faucet />
            </div>
            {/* Token Balances */}
            <TokenBalances />
          </div>

          {/* Transactions List */}
          <Transactions />
        </>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-lg font-semibold">
            Shielder SDK failed to load. Please check your configuration.
          </p>
        </div>
      )}
    </div>,
  );
};

export default DashboardInterface;
