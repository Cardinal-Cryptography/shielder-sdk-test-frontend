export interface Token {
  address?: `0x${string}`; // Contract address, empty for native token
  symbol: string; // Token symbol (e.g., "AZERO", "USDC")
  name: string; // Token name (e.g., "Aleph Zero", "USD Coin")
  decimals: number; // Token decimals
  isNative: boolean; // Whether this is the native token
}

export interface TokenBalance {
  token: Token;
  publicBalance: bigint;
  privateBalance: bigint;
}
