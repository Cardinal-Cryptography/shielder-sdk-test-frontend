import { useTokenBalance } from "@/lib/balances/useTokenBalance";
import { useShielderClient } from "@/lib/shielder/useShielderClient";
import { Token } from "@/lib/tokens/types";
import { erc20Token, nativeToken } from "@cardinal-cryptography/shielder-sdk";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";

export const useWithdraw = ({ token }: { token: Token | undefined }) => {
  const { data: shielderClient } = useShielderClient();
  const { sendTransactionAsync } = useSendTransaction();
  const { address: walletAddress } = useAccount();

  const [isSending, setIsSending] = useState(false);

  const { refetchAll: refetchTokenBalance } = useTokenBalance({ token });

  const withdraw = async (
    amount: bigint,
    addressTo: `0x${string}`,
    useManualWithdraw: boolean = false,
  ) => {
    if (!token) {
      throw new Error("Token not defined");
    }
    setIsSending(true);
    try {
      // Determine which token to use
      const sdkToken = token.isNative
        ? nativeToken()
        : erc20Token(token.address as `0x${string}`);

      if (useManualWithdraw) {
        const protocolFee =
          await shielderClient!.getProtocolWithdrawFee(amount);
        // Use withdrawManual for manual transaction handling
        await shielderClient!.withdrawManual(
          sdkToken,
          protocolFee.amount,
          addressTo,
          async (params) => {
            const txHash = await sendTransactionAsync!({
              ...params,
              // gas: shieldActionGasLimit,
            }).catch((e) => {
              throw e;
            });
            return txHash;
          },
          walletAddress!,
          protocolFee.protocolFee, // protocol fee
          new Uint8Array(),
        );
      } else {
        const relayerFees = await shielderClient!.getRelayerFees(sdkToken, 0n);

        const protocolFee = await shielderClient!.getProtocolWithdrawFee(
          amount + relayerFees.fee_details.total_cost_fee_token,
        );

        // Use regular withdraw
        await shielderClient!.withdraw(
          sdkToken,
          protocolFee.amount,
          relayerFees,
          addressTo,
          0n,
          protocolFee.protocolFee, // protocol fee
          new Uint8Array(),
        );
      }
      refetchTokenBalance();
    } catch (e) {
      console.error(e);
      setIsSending(false);
      throw e;
    }
    setIsSending(false);
  };

  const query = useQuery({
    queryKey: ["useWithdraw", isSending],
    queryFn: () => {
      return {
        isSending,
      };
    },
  });
  return {
    ...query,
    withdraw,
  };
};
