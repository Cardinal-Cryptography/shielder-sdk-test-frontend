import WasmProvider from "@/lib/providers/WasmProvider";
import DashboardInterface from "./components/DashboardInterface";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, ConnectKitProvider } from "connectkit";
import { alephTestnet } from "@/lib/chains/alephTestnet";
import { WagmiProvider, createConfig } from "wagmi";
import { alephMainnet } from "@/lib/chains/alephMainnet";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wagmiChainConfig = createConfig(
  getDefaultConfig({
    appName: "Shielder-sdk test",
    walletConnectProjectId: "3bb69ec675f4b9c573beff23fc19ebdc",
    chains: [alephTestnet, alephMainnet],
  }),
);

function App() {
  return (
    <>
      <WagmiProvider config={wagmiChainConfig}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>
            <WasmProvider>
              <DashboardInterface />
            </WasmProvider>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
