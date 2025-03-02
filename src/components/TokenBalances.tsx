import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatEtherTrim } from "@/lib/utils";
import { CopyContent } from "@/components/ui/copy-content";
import { Token } from "@/lib/tokens/types";
import { useTokenBalance } from "@/lib/balances/useTokenBalance";
import { useTokenList } from "@/lib/tokens/useTokenList";
import { useNativeToken } from "@/lib/tokens/useNativeToken";

const TokenBalance = ({ token }: { token: Token }) => {
  const { data: tokenBalance } = useTokenBalance({ token });
  return (
    <div key={token.symbol} className="grid grid-cols-3 gap-4 py-2 border-t">
      {/* if token with address, place address copier next to symbol */}
      <div className="flex items-center">
        <div>{token.symbol}</div>
        {token.address && <CopyContent content={token.address} />}
      </div>
      <div>{formatEtherTrim(tokenBalance?.publicBalance ?? 0n)}</div>
      <div>{formatEtherTrim(tokenBalance?.privateBalance ?? 0n)}</div>
    </div>
  );
};

export const TokenBalances = () => {
  const nativeToken = useNativeToken();
  const tokens = useTokenList();

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
          {nativeToken && <TokenBalance token={nativeToken} />}
          {tokens.map((token) => (
            <TokenBalance token={token} />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
