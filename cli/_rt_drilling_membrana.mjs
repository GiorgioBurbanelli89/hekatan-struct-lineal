// Ida y vuelta del drilling aparte: .heks → .s2k → lector s2k → deform. Tiene que dar lo mismo que el .heks.
import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { resolverHeks } from "../tests/lib/heks.mjs";
import { readFileSync } from "node:fs";
const m = await empaquetar(`export * from "${R}/examples/src/shared/s2kParser";\nexport { deform } from "${R}/hekatan-fem/src/index";\n`, "rtdm");
const ol = console.log, ow = console.warn; console.log = () => {}; console.warn = () => {};
globalThis.__hekatanFactoresPatron = { Dead: 1 };
const H = await resolverHeks("cli/shots/drilling_membrana/drilling_membrana.heks");
const S = (m.parseS2k ?? m.parseS2K)(readFileSync("cli/shots/drilling_membrana/drilling_membrana.s2k", "utf-8"));
const d = m.deform(S.nodes, S.elements, S.nodeInputs, S.elementInputs);
console.log = ol; console.warn = ow;
const umax = (defs) => { let x = 0; for (const [, u] of defs) x = Math.max(x, Math.hypot(u[0], u[1], u[2])); return x * 1000; };
const flex0 = [...(S.elementInputs.bendingModifiers ?? new Map()).values()].filter(v => v === 0).length;
console.log("heks umax", umax(H.deformOutputs.deformations).toFixed(4), "mm · s2k->Hekatan umax", umax(d.deformations).toFixed(4), "mm · shells con flexion 0:", flex0);
