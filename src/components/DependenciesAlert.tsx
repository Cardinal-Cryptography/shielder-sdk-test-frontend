import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DependenciesAlert = () => {
  const dependencies = [
    {
      name: "shielder-sdk",
      version: import.meta.env.VITE_SDK_VERSION,
    },
    {
      name: "shielder-sdk-crypto",
      version: import.meta.env.VITE_SDK_CRYPTO_VERSION,
    },
    {
      name: "shielder-sdk-crypto-wasm",
      version: import.meta.env.VITE_SDK_CRYPTO_WASM_VERSION,
    },
  ];
  return (
    <Alert className="max-w-sm">
      <AlertTitle className="flex items-center gap-2 mb-2">
        <Terminal className="h-4 w-4" />
        <span>Shielder SDK dependencies</span>
      </AlertTitle>
      <AlertDescription className="text-sm">
        <table className="w-full">
          <tbody className="space-y-1">
            {dependencies.map((dep) => (
              <tr key={dep.name}>
                <td className="text-gray-600 pr-4">{dep.name}</td>
                <td>
                  <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-xs">
                    {dep.version}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AlertDescription>
    </Alert>
  );
};

export default DependenciesAlert;
