import ConfigSection from "@/components/ConfigSection/ConfigSection";
import ShieldModal from "@/components/ShieldModal";
import SendModal from "@/components/SendModal";
import useWasm from "@/lib/context/useWasm";
import DependenciesAlert from "@/components/DependenciesAlert";

import { ConnectKitButton } from "connectkit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { ChainId, chainsByIds } from "@/lib/chains";
import { ResyncButton } from "@/components/ResyncButton";
import { Transactions } from "@/components/Transactions";
import { TokenBalances } from "@/components/TokenBalances";
import { useLocalSeed } from "@/lib/context/useLocalSeed";
import Faucet from "@/components/Faucet/Faucet";

const DashboardInterface = () => {
  const { isWasmLoaded } = useWasm();
  // const { error } = useShielderClient();
  const { chain, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { data: seedMnemonicConfig } = useLocalSeed();

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
                  {isConnected && !chain ? (
                    <p className="text-red-500">Unsupported chain!</p>
                  ) : null}
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={chainId.toString()}
                    onValueChange={async (value) => {
                      const chainId = parseInt(value) as ChainId;
                      await switchChainAsync({ chainId });
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select chain" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(chainsByIds).map(([id, chain]) => (
                        <SelectItem key={id} value={id}>
                          {chain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center">
                  {seedMnemonicConfig.seedMnemonicConfig
                    ?.shielderSeedMnemonic ? (
                    <></>
                  ) : (
                    <p className="text-red-500">Seed mnemonic not found!</p>
                  )}
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

  return header(
    <div>
      {/* Two columns: Actions and Balance */}
      <div className="grid grid-cols-1 mb-4 md:grid-cols-3 gap-4">
        {/* Action Buttons */}
        <div className="space-y-2">
          <ShieldModal />
          <SendModal />
          <ResyncButton />
          <Faucet />
        </div>
        {/* Token Balances */}
        <TokenBalances />
      </div>

      {/* Transactions List */}
      <Transactions />
    </div>,
  );
};

export default DashboardInterface;
