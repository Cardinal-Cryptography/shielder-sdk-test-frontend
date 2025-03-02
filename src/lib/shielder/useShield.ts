import { useTokenBalance } from "@/lib/balances/useTokenBalance";
import { useShielderClient } from "@/lib/shielder/useShielderClient";
import { Token } from "@/lib/tokens/types";
import {
  erc20Token,
  nativeToken,
  shieldActionGasLimit,
} from "@cardinal-cryptography/shielder-sdk";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";

export const useShield = ({ token }: { token: Token | undefined }) => {
  const { data: shielderClient } = useShielderClient();
  const { sendTransactionAsync } = useSendTransaction();
  const { address: walletAddress } = useAccount();

  const [isShielding, setIsShielding] = useState(false);

  const { refetchAll: refetchTokenBalance } = useTokenBalance({ token });

  const shield = async (amount: bigint) => {
    if (!token) {
      throw new Error("Token not defined");
    }
    setIsShielding(true);
    try {
      // Determine which token to use
      const sdkToken = token.isNative
        ? nativeToken()
        : erc20Token(token.address as `0x${string}`);

      await shielderClient!.shield(
        sdkToken,
        amount,
        async (params) => {
          const txHash = await sendTransactionAsync!({
            ...params,
            gas: shieldActionGasLimit,
          }).catch((e) => {
            throw e;
          });
          return txHash;
        },
        walletAddress!,
      );
      refetchTokenBalance();
    } catch (e) {
      console.error(e);
      setIsShielding(false);
    }
    setIsShielding(false);
  };

  const query = useQuery({
    queryKey: ["useShield", isShielding],
    queryFn: () => {
      return {
        isShielding,
      };
    },
  });
  return {
    ...query,
    shield,
  };
};
