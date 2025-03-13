import { Token } from "@/lib/tokens/types";
import { Client, erc20Abi, getContract } from "viem";

export const getTokenByAddress = async (
  tokenAddress: `0x${string}`,
  client: Client,
): Promise<Token> => {
  const tokenContract = getContract({
    address: tokenAddress,
    abi: erc20Abi,
    client,
  });

  const name = await tokenContract.read.name();
  const symbol = await tokenContract.read.symbol();
  const decimals = await tokenContract.read.decimals();

  return {
    isNative: false,
    address: tokenAddress,
    name,
    symbol,
    decimals,
  };
};
