import fs from "fs";
import os from "os";
import YAML from "yaml";

let ENV_VARS = [""];
try {
  ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (e) {
  /* empty */
}

const file = fs.readFileSync("./pnpm-lock.yaml", "utf8");
const parsed = YAML.parse(file);
const version = parsed["importers"]["."]["dependencies"][
  "@cardinal-cryptography/shielder-sdk"
]["version"]
  .split("(")[0]
  .trim();

setEnvValue("VITE_SDK_VERSION", version);
setEnvValue("VITE_CF_KEY", process.env.VITE_CF_KEY);

fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));

function setEnvValue(key: string, value?: string | number) {
  // find the env we want based on the key
  const target = ENV_VARS.indexOf(
    ENV_VARS.find((line) => {
      return line.match(new RegExp(key));
    }) ?? "!@#$%^&*()-+",
  );
  if (target == -1) {
    ENV_VARS[ENV_VARS.length - 1] = `${key}=${value}`;
    ENV_VARS.push("");
  } else {
    ENV_VARS.splice(target, 1, `${key}=${value}`);
  }
}
