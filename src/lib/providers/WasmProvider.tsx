import { type ReactNode, useEffect, useState } from "react";
import { wasmClientWorkerInit } from "@cardinal-cryptography/shielder-sdk";

import { WasmContext } from "@/lib/context/useWasm";

type Props = { children: ReactNode };

const wasmClientWorkerReady = wasmClientWorkerInit(
  navigator.hardwareConcurrency,
);

const WasmProvider = ({ children }: Props) => {
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    wasmClientWorkerReady
      .then(() => void setIsWasmLoaded(true))
      .catch((err: unknown) => void setError(err as Error));
  }, []);

  return (
    <WasmContext.Provider value={{ isWasmLoaded, error }}>
      {children}
    </WasmContext.Provider>
  );
};

export default WasmProvider;
