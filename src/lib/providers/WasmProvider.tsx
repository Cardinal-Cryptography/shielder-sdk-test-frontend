import { type ReactNode, useEffect, useState } from "react";
import {
  CryptoClient,
  Scalar,
} from "@cardinal-cryptography/shielder-sdk-crypto";

import { WasmContext } from "@/lib/context/useWasm";
import { wasmCryptoClientRead } from "@/lib/utils";

type Props = { children: ReactNode };

export let wasmCryptoClient: CryptoClient | null = null;

const WasmProvider = ({ children }: Props) => {
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    wasmCryptoClientRead
      .then((cryptoClient) => {
        console.log("Wasm loaded");
        cryptoClient.hasher
          .poseidonHash([Scalar.fromBigint(1n)])
          .then(console.log);
        wasmCryptoClient = cryptoClient;
        void setIsWasmLoaded(true);
      })
      .catch((err: unknown) => void setError(err as Error));
  }, []);

  return (
    <WasmContext.Provider value={{ isWasmLoaded, error }}>
      {children}
    </WasmContext.Provider>
  );
};

export default WasmProvider;
