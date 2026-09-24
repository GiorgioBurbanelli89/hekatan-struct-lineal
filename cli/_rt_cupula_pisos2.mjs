import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { resolverHeks } from "../tests/lib/heks.mjs";
import { readFileSync } from "node:fs";
const m = await empaquetar(`export * from "${R}/examples/src/shared/e2kParser";\nexport * from "${R}/examples/src/shared/s2kParser";\nexport { deform } from "${R}/hekatan-fem/src/index";\n`, "rtcp2");
const ol = console.log, ow = console.warn; console.log = () => {}; console.warn = () => {};
globalThis.__hekatanFactoresPatron = { Dead: 1 };
const H = await resolverHeks("cli/shots/cupula_niveles/cupula_pisos.heks");
const E = m.parseE2k(readFileSync("cli/shots/cupula_niveles/cupula_pisos.e2k", "utf-8"));
const S = (m.parseS2k ?? m.parseS2K)(readFileSync("cli/shots/cupula_niveles/cupula_pisos.s2k", "utf-8"));
const resolver = (mm) => { try { return m.deform(mm.nodes, mm.elements, mm.nodeInputs, mm.elementInputs); } catch (e) { return { error: String(e.message || e) }; } };
const dE = resolver(E), dS = resolver(S);
console.log = ol; console.warn = ow;
// peor corrimiento de coordenadas: nudo de Hekatan -> nudo más cercano del releído
const peorCoord = (mm) => { let p = 0; for (const a of H.nodes) { let d = 1e9; for (const b of mm.nodes) d = Math.min(d, Math.hypot(a[0]-b[0], a[1]-b[1], a[2]-b[2])); p = Math.max(p, d); } return +(p * 1000).toFixed(3); };
const uMax = (U) => { let mx = 0; U?.forEach(u => { mx = Math.max(mx, Math.hypot(u[0], u[1], u[2])); }); return mx; };
const cmpU = (mm, D) => {
  if (!D?.deformations?.size) return { error: D?.error ?? "sin resultados" };
  const UH = H.deformOutputs.deformations; const mxH = uMax(UH); let peor = 0;
  H.nodes.forEach((a, i) => { let jb = -1, d = 1e9; mm.nodes.forEach((b, j) => { const q = Math.hypot(a[0]-b[0], a[1]-b[1], a[2]-b[2]); if (q < d) { d = q; jb = j; } });
    const u = UH.get(i), v = D.deformations.get(jb); if (!u || !v) return; for (let c = 0; c < 3; c++) peor = Math.max(peor, Math.abs(u[c] - v[c]) / mxH * 100); });
  return { umax_mm: +(uMax(D.deformations) * 1000).toFixed(5), peor_nudo_pct: +peor.toPrecision(3) };
};
const fz = (L) => { let s = 0; L?.forEach(v => s += v[2] ?? 0); return +s.toFixed(3); };
console.log(JSON.stringify({ sumFz: { hekatan_deform: "Dead", e2k: fz(E.nodeInputs?.loads), s2k: fz(S.nodeInputs?.loads) } }));
console.log(JSON.stringify({ hekatan_umax_mm: +(uMax(H.deformOutputs.deformations) * 1000).toFixed(5),
  e2k: { peor_corrimiento_mm: peorCoord(E), ...cmpU(E, dE) }, s2k: { peor_corrimiento_mm: peorCoord(S), ...cmpU(S, dS) } }));
