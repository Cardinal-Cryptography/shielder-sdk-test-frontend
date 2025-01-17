import { Button } from "@/components/ui/button";
import { HandCoins } from "lucide-react";
import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useAccount } from "wagmi";
import { useChainId } from "@/lib/context/useChainId";

const Faucet = () => {
  const [isToppingUp, setIsToppingUp] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const handleSubmit = async (cfToken: string) => {
    const response = await fetch("/api/faucet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address: address!, cfToken }),
    });
    setIsToppingUp(false);

    if (!response.ok) {
      throw new Error("Failed to top up account.");
    }
  };

  if (chainId !== 2039) {
    return null;
  }
  if (!isConnected) {
    return null;
  }

  return (
    <div>
      {!isToppingUp ? (
        <Button
          className="w-full h-12"
          size="lg"
          variant="outline"
          onClick={() => setIsToppingUp(true)}
        >
          <HandCoins className="mr-2 h-5 w-5" />
          Faucet (Testnet)
        </Button>
      ) : (
        <Turnstile
          options={{
            size: "flexible",
          }}
          siteKey={import.meta.env.VITE_CF_KEY!}
          onSuccess={(cfToken) => void handleSubmit(cfToken)}
        />
      )}
    </div>
  );
};

export default Faucet;
