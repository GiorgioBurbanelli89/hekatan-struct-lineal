// Capa NEC 4: espectral CQC por piso + control Vdin/Vest. node cli/_nec_espectral.mjs dump.json [nModos]
import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const D = JSON.parse(readFileSync(process.argv[2], "utf-8")), NM = +(process.argv[3] ?? 12);
const m = await empaquetar(`export { pisosDeModelo } from "${R}/examples/src/shared/nec/pisos";
export { cortanteEstatico, espectro, PORTOVIEJO_D } from "${R}/examples/src/shared/nec/estatico";
export { espectralPorPiso, escalaDinamico } from "${R}/examples/src/shared/nec/espectral";
export { jointMass, modalCpp } from "${R}/hekatan-fem/src/modalCpp";\n`, "nece4" + Date.now());
const aMap = (o) => new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v]));
const ei = {}; for (const [k, v] of Object.entries(D.elementInputs)) ei[k] = v && typeof v === "object" && !Array.isArray(v) ? aMap(v) : v;
const ni = { supports: aMap(D.nodeInputs.supports), diaphragms: aMap(D.nodeInputs.diaphragms), springs: D.nodeInputs.springs };
const P = m.pisosDeModelo(D.nodes, D.elements, ni, ei);
const masas = m.jointMass(D.nodes, D.elements, ei, { incluyeElementos: 1 });
const out = m.modalCpp(D.nodes, D.elements, ni, ei, NM, 0, 0, 1, ni.diaphragms, ni.springs);
const mp = out.massParticipation; let sx = 0, sy = 0, sz = 0;
out.frequencies.forEach((f, j) => { sx += mp[j][0]; sy += mp[j][1]; sz += mp[j][5]; if (j < 4) console.log(`modo ${j + 1} T ${(1 / f).toFixed(4)} UX ${(mp[j][0] * 100).toFixed(1)} UY ${(mp[j][1] * 100).toFixed(1)} RZ ${(mp[j][5] * 100).toFixed(1)}`); });
console.log(`Σ ${NM} modos: UX ${(sx * 100).toFixed(1)} % UY ${(sy * 100).toFixed(1)} % RZ ${(sz * 100).toFixed(1)} %`);
const esDia = (n) => ni.diaphragms.has(n);
for (const [norma, minimo] of [["NEC-15", 0.85], ["borrador", 1.0]]) {
  const d = m.PORTOVIEJO_D[norma], sp = m.espectro(d), red = d.I / (d.R * (d.phiP ?? 1) * (d.phiE ?? 1));
  const est = m.cortanteEstatico(d, P, 1 / out.frequencies[0]);
  for (const dir of [0, 1]) {
    const e = m.espectralPorPiso(D.nodes, P, out, masas, sp.Sa, red, dir, d.R, esDia);
    const c = m.escalaDinamico(e.V, est.V, minimo);
    console.log(`${norma} ${dir ? "Y" : "X"}: Vdin ${e.V.toFixed(1)} / Vest ${est.V.toFixed(1)} = ${(c.relacion * 100).toFixed(1)} % (mín ${minimo * 100} %) → escala ×${c.factor.toFixed(3)} · ` +
      e.pisos.map((q) => `p${q.k} V ${(q.V * c.factor).toFixed(1)} Δ ${(q.deriva * c.factor * 1000).toFixed(3)}‰ ΔM ${(q.derivaInel * c.factor * 100).toFixed(2)}%`).join(" | "));
  }
}
