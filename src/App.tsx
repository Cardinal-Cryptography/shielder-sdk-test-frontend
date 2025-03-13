import WasmProvider from "@/lib/providers/WasmProvider";
import DashboardInterface from "./components/DashboardInterface";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, ConnectKitProvider } from "connectkit";
import { alephTestnet } from "@/lib/chains/alephTestnet";
import {
  WagmiProvider,
  createConfig,
  fallback,
  http,
  injected,
  unstable_connector,
} from "wagmi";
import { Toaster } from "@/components/ui/toaster";
import { arbitrumSepolia, baseSepolia, sepolia } from "wagmi/chains";
import { monadTestnet } from "@/lib/chains/monadTestnet";
import { sonicTestnet } from "@/lib/chains/sonicTestnet";

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
    chains: [
      alephTestnet,
      arbitrumSepolia,
      baseSepolia,
      sepolia,
      monadTestnet,
      sonicTestnet,
    ],
    transports: {
      [alephTestnet.id]: fallback([unstable_connector(injected), http()]),
      [arbitrumSepolia.id]: fallback([unstable_connector(injected), http()]),
      [baseSepolia.id]: fallback([unstable_connector(injected), http()]),
      [sepolia.id]: fallback([unstable_connector(injected), http()]),
      [monadTestnet.id]: fallback([unstable_connector(injected), http()]),
      [sonicTestnet.id]: fallback([unstable_connector(injected), http()]),
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
