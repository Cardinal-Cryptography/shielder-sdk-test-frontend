import WasmProvider from "@/lib/providers/WasmProvider";
import DashboardInterface from "./components/DashboardInterface";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <WasmProvider>
          <DashboardInterface />
        </WasmProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
