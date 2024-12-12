import { Card, CardContent } from "@/components/ui/card";
import { CopyContent } from "@/components/ui/copy-content";
import { usePublicAccount } from "@/lib/context/usePublicAccount";
import {
  accountChainIdSupported,
  formatEtherTrim,
  formatHash,
} from "@/lib/utils";
import { useAccount } from "wagmi";

export const PublicBalance = () => {
  const { publicBalance, publicAddress } = usePublicAccount();
  const { isConnected, chainId: accountChainId } = useAccount();
  if (!isConnected || !accountChainIdSupported(accountChainId)) {
    return (
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Public Balance</h2>
          <p className="text-2xl font-semibold">-</p>
          <p className="text-sm text-gray-500">Connect to see your balance</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Public Balance</h2>
        <p className="text-2xl font-semibold">
          {formatEtherTrim(publicBalance)}
        </p>
        <div className="flex">
          <p className="text-sm text-gray-500">{formatHash(publicAddress)}</p>
          <CopyContent content={publicAddress} />
        </div>
      </CardContent>
    </Card>
  );
};
