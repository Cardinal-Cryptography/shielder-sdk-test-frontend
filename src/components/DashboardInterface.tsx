import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCcw, Terminal } from "lucide-react";
import ConfigSection from "@/components/ConfigSection";
import ShieldModal from "@/components/ShieldModal";
import useWasm from "@/lib/context/useWasm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useShielderClient } from "@/lib/context/useShielderClient";
import { usePublicAccount } from "@/lib/context/usePublicAccount";
import { useShielderBalance } from "@/lib/context/useShielderBalance";
import { Transactions } from "@/components/Transactions";
import {
  clearShielderClientStorage,
  formatEtherTrim,
  formatHash,
} from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import SendModal from "@/components/SendModal";
import Faucet from "@/components/Faucet";
import { ConnectKitButton } from "connectkit";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { Switch } from "@/components/ui/switch";
import { useSaveConfig } from "@/lib/context/useSaveConfig";
import { useConfig } from "@/lib/context/useConfig";
import { CopyContent } from "@/components/ui/copy-content";

const DashboardInterface = () => {
  const { isWasmLoaded } = useWasm();
  const { error } = useShielderClient();
  const { publicBalance, publicAddress } = usePublicAccount();
  const shielderBalance = useShielderBalance();
  const queryClient = useQueryClient();
  const chainId = useChainId();
  const account = useAccount();
  const { shielderConfig } = useConfig();
  const saveConfig = useSaveConfig();
  const { switchChainAsync } = useSwitchChain();

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
              <Alert>
                <Terminal className="mr-2 h-5 w-5" />
                <AlertTitle>Shielder SDK dependency</AlertTitle>
                <AlertDescription>
                  @cardinal-cryptography/shielder-sdk@
                  <span className="font-bold">
                    {import.meta.env.VITE_SDK_VERSION}
                  </span>
                </AlertDescription>
              </Alert>
              <div className="flex justify-center space-x-8">
                <ConnectKitButton />
                <div className="flex items-center space-x-2">
                  <p> Testnet </p>
                  <Switch
                    className="data-[state=unchecked]:bg-green-500 data-[state=checked]:bg-red-500"
                    checked={chainId !== 2039}
                    onCheckedChange={async (checked) => {
                      if (checked) {
                        await switchChainAsync({ chainId: 41455 });
                      } else {
                        await switchChainAsync({ chainId: 2039 });
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

  if (account.chainId !== 2039 && account.chainId !== 41455) {
    return header(
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          Unsupported chain. Please switch to Aleph Testnet or Mainnet.
        </p>
      </div>,
    );
  }

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
            {/* Public Balance */}
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Public Balance</h2>
                <p className="text-2xl font-semibold">
                  {formatEtherTrim(publicBalance)}
                </p>
                <div className="flex">
                  <p className="text-sm text-gray-500">
                    {formatHash(publicAddress)}
                  </p>
                  <CopyContent content={publicAddress} />
                </div>
              </CardContent>
            </Card>
            {/* Private Balance */}
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Private Balance</h2>
                <p className="text-2xl font-semibold">
                  {formatEtherTrim(shielderBalance || 0n)}
                </p>
                <p className="text-sm text-gray-500">shielded account</p>
              </CardContent>
            </Card>
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
