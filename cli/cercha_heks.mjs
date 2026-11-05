import { readFileSync, writeFileSync } from "node:fs";
import { cargarMod } from "../tests/lib/vano_cmp.mjs";
const mod = await cargarMod();
const l = console.log, w = console.warn, i = console.info; console.log = console.warn = console.info = () => {};
const res = mod.e2kAHeks(readFileSync("tests/datos/e2k_cercha.e2k", "latin1"), "cercha.e2k", JSON.parse(process.argv[2] || "{}"));
console.log = l; writeFileSync(process.argv[3] || "C:/Users/j-b-j/AppData/Local/Temp/claude/7a537ee28ba80366/fbf2d3af-5f8f-47d3-a4a3-36efffcafb9c/scratchpad/cercha.heks", res.heks);
