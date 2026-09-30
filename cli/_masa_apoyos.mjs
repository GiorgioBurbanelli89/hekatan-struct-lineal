import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const D = JSON.parse(readFileSync("validation/tiempo-historia/dual_sap.json", "utf-8"));
const T = JSON.parse(readFileSync("validation/tiempo-historia/spec_modal.json", "utf-8"));
const { masaEnsamblada } = await import("../tests/lib/wasm.mjs");
const aMap = (o) => new Map(Object.entries(o).map(([k, v]) => [Number(k), v]));
const ei = {}; for (const [k, v] of Object.entries(D.elementInputs)) ei[k] = v && typeof v === "object" && !Array.isArray(v) ? aMap(v) : v;
const m = await masaEnsamblada(D.nodes, D.elements, ei, {});
console.log('forma', Array.isArray(m) ? 'array ' + m.length : typeof m, JSON.stringify(m[0] ?? Object.values(m)[0]).slice(0,120));
const apoyos = Object.keys(D.nodeInputs.supports).map(Number);
let mx = 0; for (const i of apoyos) { const v = Array.isArray(m) ? m[i] : m.get?.(i); mx += typeof v === "number" ? v : 0; }
console.log("masa X en los apoyos:", mx, "t; a(0.01) =", T.a[1], "→ m·a =", mx * T.a[1], "kN (diferencia medida 10.6)");
