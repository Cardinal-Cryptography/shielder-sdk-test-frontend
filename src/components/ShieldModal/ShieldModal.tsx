import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { parseEther, erc20Abi } from "viem";
import {
  nativeToken,
  erc20Token,
  shieldActionGasLimit,
} from "@cardinal-cryptography/shielder-sdk";
import {
  useAccount,
  useSendTransaction,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useShielderClient } from "@/lib/context/useShielderClient";
import { useLatestProof } from "@/lib/context/useLatestProof";
import { useSaveLatestProof } from "@/lib/context/useSaveLatestProof";
import { accountChainIdSupported } from "@/lib/utils";
import { useTokenList } from "@/lib/context/useTokenList";
import { useConfig } from "@/lib/context/useConfig";

import ShieldButton from "./ShieldButton";
import ShieldActionButton from "./ShieldActionButton";
import { useTokenBalances } from "@/lib/context/useTokenBalances";
import {
  TokenSelector,
  AmountInput,
  useSelectedToken,
} from "@/components/shared/tokens";

const ShieldModal = () => {
  // State
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTokenValue, setSelectedTokenValue] = useState<string>("");
  const [isShielding, setIsShielding] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalTxHash, setApprovalTxHash] = useState<
    `0x${string}` | undefined
  >(undefined);

  // Hooks
  const { shielderClient } = useShielderClient();
  const { sendTransactionAsync } = useSendTransaction();
  const {
    address: walletAddress,
    isConnected,
    chainId: accountChainId,
  } = useAccount();
  const latestProof = useLatestProof();
  const { reset: resetLatestProof } = useSaveLatestProof();
  const tokens = useTokenList();
  const selectedToken = useSelectedToken(tokens, selectedTokenValue);
  const config = useConfig();

  const { refetch: refetchBalances } = useTokenBalances();

  // Token approval hooks
  const { writeContractAsync } = useWriteContract();

  // Check token allowance
  const { data: tokenAllowance, refetch } = useReadContract({
    address: selectedToken?.address as `0x${string}` | undefined,
    abi: erc20Abi,
    functionName: "allowance",
    args:
      walletAddress && config?.shielderConfig?.shielderContractAddress
        ? [
            walletAddress,
            config.shielderConfig.shielderContractAddress as `0x${string}`,
          ]
        : undefined,
    query: {
      enabled:
        !!selectedToken &&
        !selectedToken.isNative &&
        !!walletAddress &&
        !!config?.shielderConfig?.shielderContractAddress,
    },
  });

  // Check if approval is needed when amount or selected token changes
  useEffect(() => {
    if (
      selectedToken &&
      !selectedToken.isNative &&
      amount &&
      tokenAllowance !== undefined
    ) {
      const amountParsed = parseEther(amount);
      setNeedsApproval(amountParsed > tokenAllowance);
      // setNeedsApproval(true);
    } else {
      setNeedsApproval(false);
    }
  }, [amount, selectedToken, tokenAllowance]);

  // Handle transaction receipt for approval
  const { data: approvalReceipt, isLoading: isWaitingForApproval } =
    useWaitForTransactionReceipt({
      hash: approvalTxHash,
    });

  // Reset approval state when receipt is received
  useEffect(() => {
    if (approvalReceipt) {
      console.log("approved");
      setIsApproving(false);
      setApprovalTxHash(undefined);
      refetch();
    }
  }, [approvalReceipt, refetch]);

  // Handlers
  const handleOpenChange = (open: boolean) => {
    resetLatestProof.mutate();
    setIsOpen(open);
    setIsShielding(false);
    setIsApproving(false);
    setAmount("");

    // Reset token selection when modal is closed
    if (!open) {
      setSelectedTokenValue("");
    }
  };

  // Handle token approval
  const handleApproveToken = async () => {
    if (
      !selectedToken ||
      selectedToken.isNative ||
      !config?.shielderConfig?.shielderContractAddress ||
      !amount
    ) {
      return;
    }

    setIsApproving(true);
    try {
      const hash = await writeContractAsync({
        address: selectedToken.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [
          config.shielderConfig.shielderContractAddress as `0x${string}`,
          // Approve for a very large amount to avoid frequent approvals
          parseEther("1000000000"),
        ],
      });

      // Set the transaction hash to track with useWaitForTransactionReceipt
      setApprovalTxHash(hash);
      console.log("Approval transaction submitted:", hash);
    } catch (error) {
      console.error("Error approving token:", error);
      setIsApproving(false);
    }
  };

  const handleSubmit = async () => {
    const amountParsed = parseEther(amount);
    setIsShielding(true);
    try {
      // Determine which token to use
      const token =
        !selectedTokenValue || selectedTokenValue === "native"
          ? nativeToken()
          : erc20Token(selectedTokenValue as `0x${string}`);

      await shielderClient!.shield(
        token,
        amountParsed,
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
      refetchBalances();
    } catch (e) {
      console.error(e);
      setIsShielding(false);
      setIsOpen(false);
      setSelectedTokenValue("");
    }
    setIsShielding(false);
    setIsOpen(false);
    setAmount("");
    setSelectedTokenValue("");
  };

  console.log(selectedToken);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <ShieldButton
          isConnected={isConnected}
          accountChainIdSupported={accountChainIdSupported(accountChainId)}
          onClick={() => setIsOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Shield Assets</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <TokenSelector
            tokens={tokens}
            selectedTokenValue={selectedTokenValue}
            onTokenChange={setSelectedTokenValue}
          />
          <AmountInput
            amount={amount}
            onAmountChange={setAmount}
            selectedToken={selectedToken}
            selectedTokenValue={selectedTokenValue}
          />
          <ShieldActionButton
            isTokenSelected={!!selectedToken}
            isShielding={isShielding}
            isApproving={isApproving || isWaitingForApproval}
            needsApproval={needsApproval}
            amount={amount}
            shielderClient={shielderClient}
            walletAddress={walletAddress}
            latestProof={latestProof}
            onSubmit={needsApproval ? handleApproveToken : handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShieldModal;
