import { useState } from "react";
import { useAccount } from "wagmi";
import { useToast } from "@/lib/context/useToast";
import { useNativeToken } from "@/lib/tokens/useNativeToken";
import { useTokenBalance } from "@/lib/balances/useTokenBalance";

export function useNativeTokenMint() {
  const [isMinting, setIsMinting] = useState(false);
  const { address } = useAccount();
  const { toast } = useToast();
  const nativeToken = useNativeToken();
  const { refetchAll } = useTokenBalance({ token: nativeToken });

  const mintNativeToken = async (cfToken: string) => {
    setIsMinting(true);
    try {
      const response = await fetch("/api/faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: address!, cfToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to top up account.");
      }

      refetchAll();

      toast({
        title: "Success",
        description: "Native tokens have been minted to your account.",
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to mint native tokens.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsMinting(false);
    }
  };

  return { mintNativeToken, isMinting };
}
