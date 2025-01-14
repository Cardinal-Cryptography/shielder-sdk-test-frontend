import fs from "fs";
import YAML from "yaml";

const file = fs.readFileSync("./pnpm-lock.yaml", "utf8");

const parsed = YAML.parse(file);

// clear .env file

fs.writeFileSync(".env", "", { flag: "w" });

const dependencies = [
  {
    name: "@cardinal-cryptography/shielder-sdk",
    envKey: "VITE_SDK_VERSION",
  },
  {
    name: "@cardinal-cryptography/shielder-sdk-crypto",
    envKey: "VITE_SDK_CRYPTO_VERSION",
  },
  {
    name: "@cardinal-cryptography/shielder-sdk-crypto-wasm",
    envKey: "VITE_SDK_CRYPTO_WASM_VERSION",
  },
];

for (const dep of dependencies) {
  const version = parsed["importers"]["."]["dependencies"][dep.name]["version"]
    .split("(")[0]
    .trim();
  fs.writeFileSync(".env", `${dep.envKey}=${version}\n`, { flag: "a" });
}
