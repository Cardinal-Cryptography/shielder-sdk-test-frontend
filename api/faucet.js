/**
 * pass env variables to the script:
 * CF_SECRET
 * WALLET_PRIVATE_KEY
 * FAUCET_AMOUNT
 */

import { createWalletClient, defineChain, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { verifyCaptcha } from "./_verifyCaptcha.js";

const verifyEndpoint =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const FAUCET_RETRIES = 20;

export async function POST(req) {
  const { address, cfToken } = await req.json();

  if (!(await verifyCaptcha(cfToken))) {
    return new Response("Failed to verify captcha", { status: 500 });
  }

  for (let i = 0; i < FAUCET_RETRIES; i++) {
    try {
      const chain = defineChain({
        id: 2039,
        rpcUrls: {
          default: {
            http: ["https://rpc.alephzero-testnet.gelato.digital"],
          },
        },
        name: "Aleph Zero Testnet",
        nativeCurrency: {
          name: "TZERO",
          symbol: "TZERO",
          decimals: 18,
        },
      });
      const client = createWalletClient({
        account: privateKeyToAccount(process.env.WALLET_PRIVATE_KEY),
        chain,
        transport: http(),
      });
      await client.sendTransaction({
        to: address,
        value: BigInt(process.env.FAUCET_AMOUNT),
      });
      return new Response("OK", { status: 200 });
    } catch (e) {
      console.error(e);
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  return new Response("Failed to send transaction", { status: 500 });
}
