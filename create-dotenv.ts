import fs from "fs";
import YAML from "yaml";

const file = fs.readFileSync("./pnpm-lock.yaml", "utf8");

const parsed = YAML.parse(file);

const version = parsed["importers"]["."]["dependencies"][
  "@cardinal-cryptography/shielder-sdk"
]["version"]
  .split("(")[0]
  .trim();

fs.writeFileSync(
  ".env",
  `VITE_SDK_VERSION=${version}\nVITE_CF_KEY=${process.env.VITE_CF_KEY}\n`,
  { flag: "w" },
);
