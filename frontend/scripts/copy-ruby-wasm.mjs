import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("public/ruby", { recursive: true });
copyFileSync(
  "node_modules/@ruby/3.4-wasm-wasi/dist/ruby+stdlib.wasm",
  "public/ruby/ruby+stdlib.wasm"
);
