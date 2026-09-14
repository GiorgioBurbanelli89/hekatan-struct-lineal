// Diagnóstico rápido de un .heks: errores del lector, ΣRz (Dead) y tipos de elemento.
//   node cli/_reac_heks.mjs modelo.heks
import { resolverHeks } from "../tests/lib/heks.mjs";
globalThis.__hekatanFactoresPatron = { Dead: 1 };
const ol = console.log; console.log = () => {};
let H, err;
try { H = await resolverHeks(process.argv[2]); } catch (e) { err = e; }
console.log = ol;
if (err) { console.log("EXCEPCION", String(err.stack ?? err).split("\n").slice(0, 4).join(" | ")); process.exit(0); }
console.log("claves", Object.keys(H).join(","));
console.log("errores", JSON.stringify(H.errors ?? H.modelo?.errors ?? []).slice(0, 400));
const R = H.deformOutputs?.reactions;
let Rz = 0; if (R) for (const [, r] of R) Rz += r[2];
console.log("deform", !!H.deformOutputs?.deformations, "sumRz", Rz.toFixed(3));
