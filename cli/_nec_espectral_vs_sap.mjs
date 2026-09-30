// Espectral NEC-15 (sin escalar) de Hekatan contra SAP2000 (sap_espectral.json): cortante basal y u CQC nudo a nudo.
import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const D = JSON.parse(readFileSync("validation/nec-edificio/edif.json", "utf-8"));
const S = JSON.parse(readFileSync("validation/nec-edificio/sap_espectral.json", "utf-8"));
const m = await empaquetar(`export { pisosDeModelo } from "${R}/examples/src/shared/nec/pisos";
export { espectro, PORTOVIEJO_D } from "${R}/examples/src/shared/nec/estatico";
export { espectralPorPiso } from "${R}/examples/src/shared/nec/espectral";
export { jointMass, modalCpp } from "${R}/hekatan-fem/src/modalCpp";\n`, "necsap" + Date.now());
const aMap = (o) => new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v]));
const ei = {}; for (const [k, v] of Object.entries(D.elementInputs)) ei[k] = v && typeof v === "object" && !Array.isArray(v) ? aMap(v) : v;
const ni = { supports: aMap(D.nodeInputs.supports), diaphragms: aMap(D.nodeInputs.diaphragms), springs: D.nodeInputs.springs };
const P = m.pisosDeModelo(D.nodes, D.elements, ni, ei);
const masas = m.jointMass(D.nodes, D.elements, ei, { incluyeElementos: 1 });
const out = m.modalCpp(D.nodes, D.elements, ni, ei, 12, 0, 0, 1, ni.diaphragms, ni.springs);
console.log("T Hekatan", out.frequencies.slice(0, 4).map((f) => (1 / f).toFixed(4)).join(" "), "· SAP", S.T.slice(0, 4).map((t) => t.toFixed(4)).join(" "));
const d = m.PORTOVIEJO_D["NEC-15"], red = d.I / (d.R * d.phiP * d.phiE);
for (const [dir, c] of [[0, "RSX"], [1, "RSY"]]) {
  const e = m.espectralPorPiso(D.nodes, P, out, masas, m.espectro(d).Sa, red, dir, d.R, (n) => ni.diaphragms.has(n), 0.05, true);
  const Vs = Math.abs(S[c].base[dir]);
  let umax = 0, peor = 0;
  for (const [nm, u] of Object.entries(S[c].nudos)) { const i = +nm.slice(1); umax = Math.max(umax, Math.abs(u[dir])); peor = Math.max(peor, Math.abs(Math.abs(u[dir]) - e.u[i])); }
  console.log(`${c}: V Hekatan ${e.V.toFixed(3)} SAP ${Vs.toFixed(3)} (${((e.V / Vs - 1) * 100).toFixed(4)} %) · u CQC peor nudo ${(peor / umax * 100).toExponential(2)} % del máx (${(umax * 1000).toFixed(3)} mm)`);
}
