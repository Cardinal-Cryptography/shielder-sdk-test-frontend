import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatEtherTrim } from "@/lib/utils";
import { useTokenBalances } from "@/lib/context/useTokenBalances";
import { CopyContent } from "@/components/ui/copy-content";

export const TokenBalances = () => {
  const {
    data: { tokenBalances, isConnected },
  } = useTokenBalances();

  if (!isConnected) {
    return (
      <Card className="col-span-2">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Token Balances</h2>
          <p className="text-sm text-gray-500">Connect to see your balances</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Token Balances</h2>
        <ScrollArea className="h-[200px]">
          <div className="grid grid-cols-3 gap-4 font-medium text-sm mb-2">
            <div>Token</div>
            <div>Public Balance</div>
            <div>Private Balance</div>
          </div>
          {tokenBalances.map((tokenBalance) => (
            <div
              key={tokenBalance.token.symbol}
              className="grid grid-cols-3 gap-4 py-2 border-t"
            >
              {/* if token with address, place address copier next to symbol */}
              <div className="flex items-center">
                <div>{tokenBalance.token.symbol}</div>
                {tokenBalance.token.address && (
                  <CopyContent content={tokenBalance.token.address} />
                )}
              </div>
              <div>{formatEtherTrim(tokenBalance.publicBalance)}</div>
              <div>{formatEtherTrim(tokenBalance.privateBalance)}</div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
