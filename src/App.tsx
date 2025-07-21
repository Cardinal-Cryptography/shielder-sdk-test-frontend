import WasmProvider from "@/lib/providers/WasmProvider";
import DashboardInterface from "./components/DashboardInterface";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, ConnectKitProvider } from "connectkit";
import {
  WagmiProvider,
  createConfig,
  fallback,
  http,
  injected,
  unstable_connector,
} from "wagmi";
import { Toaster } from "@/components/ui/toaster";
import { baseSepolia } from "wagmi/chains";

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
    connectors: [injected()],
    walletConnectProjectId: "3bb69ec675f4b9c573beff23fc19ebdc",
    chains: [baseSepolia],
    transports: {
      [baseSepolia.id]: fallback([unstable_connector(injected), http()]),
    },
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
              <Toaster />
            </WasmProvider>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
