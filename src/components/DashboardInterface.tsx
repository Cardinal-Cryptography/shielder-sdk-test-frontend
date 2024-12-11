import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCcw, Terminal } from "lucide-react";
import ConfigSection from "@/components/ConfigSection";
import ShieldModal from "@/components/ShieldModal";
import useWasm from "@/lib/context/useWasm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useShielderSdk } from "@/lib/context/useShielderSdk";
import { usePublicAccount } from "@/lib/context/usePublicAccount";
import { useShielderBalance } from "@/lib/context/useShielderBalance";
import { Transactions } from "@/components/Transactions";
import { clearShielderClientStorage, formatEtherTrim } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import SendModal from "@/components/SendModal";
import Faucet from "@/components/Faucet";

const DashboardInterface = () => {
  const { isWasmLoaded } = useWasm();
  const { error } = useShielderSdk();
  const { publicBalance, publicAddress } = usePublicAccount();
  const shielderBalance = useShielderBalance();
  const queryClient = useQueryClient();

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

  if (error) {
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
            <div>
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
            </div>

            <div className="h-full flex items-center justify-center">
              <p className="text-lg font-semibold">
                Shielder SDK failed to load. Please check your configuration.
                <span> </span>
                <span className="font-bold text-orange-600 ">
                  Error: {error.message}
                </span>
              </p>
            </div>
          </div>

          {/* Right Section - Configuration */}
          <ConfigSection />
        </div>
      </div>
    );
  }

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
          <div>
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
          </div>
          {!error ? (
            <>
              {/* Two columns: Actions and Balance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <h2 className="text-lg font-semibold mb-4">
                      Public Balance
                    </h2>
                    <p className="text-2xl font-semibold">
                      {formatEtherTrim(publicBalance)}
                    </p>
                    <p className="text-sm text-gray-500">{publicAddress}</p>
                  </CardContent>
                </Card>
                {/* Private Balance */}
                <Card>
                  <CardContent className="p-4">
                    <h2 className="text-lg font-semibold mb-4">
                      Private Balance
                    </h2>
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
        </div>

        {/* Right Section - Configuration */}
        <ConfigSection />
      </div>
    </div>
  );
};

export default DashboardInterface;
