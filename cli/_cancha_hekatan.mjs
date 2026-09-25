// Cancha Parque: mismo .s2k en Hekatan. Un caso por patrón (PP, CV, SCP, VI) + sismo aprox (C·W por nudo),
// fuerzas por barra, y envolventes de combos ORIGINALES vs CORREGIDOS (NEC-15).
import { readFileSync, writeFileSync } from "node:fs";
import { empaquetar, R, cargarFem } from "../tests/lib/bundle.mjs";
const [src, out, Carg] = process.argv.slice(2);
const C = parseFloat(Carg ?? "0.035");
const mod = await empaquetar(`export { parseS2k } from "${R}/examples/src/shared/s2kParser";\n`, "s2k");
const fem = await cargarFem();
const txt = readFileSync(src, "latin1");
const pats = { PP: "PESO PROPIO", CV: "CARGA VIVA", SCP: "SOBRECARGA PERMANENTE", VI: "VIENTO", VIc: "VIENTO" };
const modelo = (caso) => {
  const pat = pats[caso];
  let t = txt.split("\n").filter(l => !/^\s+Frame=\S+\s+LoadPat=/.test(l) || l.includes(`LoadPat="${pat}"`) || l.includes(`LoadPat=${pat} `)).join("\n");
  if (caso !== "PP") t = t.replace(/SelfWtMult=1/g, "SelfWtMult=0");
  // VIc: sotavento con el signo corregido (succión = hacia arriba)
  if (caso === "VIc") t = t.replace(/FOverLA=0\.718827459631158   FOverLB=0\.718827459631158/g, "FOverLA=-0.718827459631158   FOverLB=-0.718827459631158");
  return mod.parseS2k(t);
};
const res = { cases: {}, C };
let base = null;
const correr = (m, caso) => {
  const d = fem.deform(m.nodes, m.elements, m.nodeInputs, m.elementInputs);
  const a = fem.analyze(m.nodes, m.elements, m.elementInputs, d);
  const F = [0, 0, 0]; for (const [, r] of d.reactions) for (let k = 0; k < 3; k++) F[k] += r[k];
  const U = {}; for (const [i, u] of d.deformations) U[m.nodeNames[i]] = u.slice(0, 3);
  const E = {}; // por barra: [N_i, N_j, M3max, M2max]
  m.elements.forEach((e, i) => {
    const n = a.normals?.get(i) ?? [0, 0], mz = a.bendingsZ?.get(i) ?? [0, 0], my = a.bendingsY?.get(i) ?? [0, 0];
    E[m.elementNames[i]] = [n[0], n[1], Math.max(Math.abs(mz[0]), Math.abs(mz[1])), Math.max(Math.abs(my[0]), Math.abs(my[1]))];
  });
  res.cases[caso] = { sumR: F, U, E };
  console.log(caso, "ΣR", F.map(v => v.toFixed(2)).join(" "));
};
const W = {};
for (const caso of Object.keys(pats)) {
  const m = modelo(caso); base ??= m;
  for (const [i, l] of m.nodeInputs.loads) W[i] = (W[i] ?? 0) - l[2] * (caso === "PP" ? 1 : caso === "CV" || caso === "SCP" ? 0.5 : 0);
  correr(m, caso);
}
// Sismo estático aprox.: F_i = C·W_i (W = masa de SAP: PP + 0.5 CV + 0.5 SCP), X e Y
for (const [caso, k] of [["SX", 0], ["SY", 1]]) {
  const m = modelo("PP"); const L = new Map();
  for (const [i, w] of Object.entries(W)) { const f = [0, 0, 0, 0, 0, 0]; f[k] = C * w; L.set(+i, f); }
  m.nodeInputs.loads = L; delete m.elementInputs.frameFixedEnd;
  correr(m, caso);
}
res.nodes = Object.fromEntries(base.nodeNames.map((n, i) => [n, base.nodes[i]]));
res.frames = Object.fromEntries(base.elementNames.map((n, i) => [n, [base.nodeNames[base.elements[i][0]], base.nodeNames[base.elements[i][1]], base.elementSections.get(i)]]));
writeFileSync(out, JSON.stringify(res));
