import { Button } from "@/components/ui/button";
import { ChainId } from "@/lib/chains";
import { useChain } from "@/lib/context/useChain";
import { useShielderClient } from "@/lib/shielder/useShielderClient";
import { clear as clearShielderClient } from "@/lib/storage/shielderClient";
import { clear as clearTransactions } from "@/lib/storage/transactions";
import { useTransactions } from "@/lib/transactions/useTransactions";
import { RefreshCcw } from "lucide-react";

export const ResyncButton = () => {
  const { data: chainData } = useChain();
  const { refetch: refetchTransactions } = useTransactions();
  const { refetch: refetchShielderClient, data: shielderClient } =
    useShielderClient();
  return (
    <Button
      className="w-full h-12"
      size="lg"
      variant="outline"
      disabled={!shielderClient}
      onClick={() => {
        if (!chainData) {
          return;
        }
        localStorage.removeItem("shielderClient");
        clearShielderClient(chainData.chain.id as ChainId);
        clearTransactions(chainData.chain.id as ChainId);
        refetchTransactions();
        refetchShielderClient();
      }}
    >
      <RefreshCcw className="mr-2 h-5 w-5" />
      Resync
    </Button>
  );
};
