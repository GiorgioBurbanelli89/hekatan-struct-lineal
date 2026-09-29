/**
 * Estribo de puente: ¿adónde va la carga vertical? La zapata va sobre muelles de área
 * (`areaspring`) y los apoyos dejan Uz libre: la vertical la recoge el SUELO, no un apoyo.
 * Equilibrio del suelo:  Q = Σ_paños ks · ∫ w dA   contra   ΣFz aplicada.
 *
 *   node cli/_estribo_equilibrio.mjs [id]
 */
import { writeFileSync } from "node:fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { resolverHeks } from "../tests/lib/heks.mjs";

const id = process.argv[2] ?? "estribo-puente";
const tip = await empaquetar(`export { heksDeTipologia } from "${R}/examples/src/tipologias-heks/tipologiasHeks";\n`, "tipologias");
const texto = tip.heksDeTipologia(id);
const ruta = `cli/shots/estribo/${id}.heks`;
writeFileSync(ruta, texto);
const m = await resolverHeks(ruta);
const U = m.deformOutputs.deformations, Rr = m.deformOutputs.reactions;
const muelles = new Map();                       // paño -> ks
for (const l of texto.split(/\r?\n/)) {
  const t = l.trim().split(/\s+/);
  if (t[0] === "areaspring") muelles.set(Number(t[1]), Number(t[2]));
}
console.log(`${id}: ${m.nodes.length} nudos, ${m.elements.length} elementos, ${muelles.size} paños con muelle de área`);
console.log("primeras líneas areaspring:", texto.split(/\r?\n/).filter((l) => l.startsWith("areaspring")).slice(0, 2).join(" | "));
// reacciones
const sR = [0, 0, 0];
for (const [, r] of Rr) for (let k = 0; k < 3; k++) sR[k] += r[k] ?? 0;
// cargas nodales del guion (load) — la vertical aplicada
const sF = [0, 0, 0];
for (const [, f] of m.nodeInputs.loads ?? []) for (let k = 0; k < 3; k++) sF[k] += f[k] ?? 0;
console.log("ΣF cargas nodales (incluye lo que arme cliModeler):", sF.map((v) => v.toFixed(3)).join("  "));
console.log("ΣR apoyos:", sR.map((v) => v.toFixed(3)).join("  "));
// suelo: ks · ∫ w dA con el paño bilineal (Gauss 2×2)
const g = 1 / Math.sqrt(3);
let Q = 0, areaZap = 0, wmin = 1e9, wmax = -1e9;
const elemDeShell = (s) => s;                   // se resuelve abajo por el orden de creación
const ids = [...muelles.keys()];
// los ids de `areaspring` son los de shell del .heks; en el modelo los elementos van en orden de escritura
const lineas = texto.split(/\r?\n/).map((l) => l.trim().split(/\s+/));
const ordenElem = lineas.filter((t) => ["frame", "shell", "hex", "area"].includes(t[0]));
const idxDe = new Map();
ordenElem.forEach((t, i) => { if (t[0] === "shell" || t[0] === "area") idxDe.set(Number(t[1]), i); });
for (const s of ids) {
  const e = m.elements[idxDe.get(s)];
  if (!e || e.length !== 4) { console.log("paño sin elemento:", s); continue; }
  const P = e.map((n) => m.nodes[n]), w = e.map((n) => U.get(n)?.[2] ?? 0);
  for (const xi of [-g, g]) for (const et of [-g, g]) {
    const N = [(1 - xi) * (1 - et), (1 + xi) * (1 - et), (1 + xi) * (1 + et), (1 - xi) * (1 + et)].map((v) => v / 4);
    const dx = [-(1 - et), (1 - et), (1 + et), -(1 + et)].map((v) => v / 4);
    const de = [-(1 - xi), -(1 + xi), (1 + xi), (1 - xi)].map((v) => v / 4);
    let a = 0, b = 0, c = 0, d = 0, wg = 0;
    for (let k = 0; k < 4; k++) { a += dx[k] * P[k][0]; b += dx[k] * P[k][1]; c += de[k] * P[k][0]; d += de[k] * P[k][1]; wg += N[k] * w[k]; }
    const J = Math.abs(a * d - b * c);
    Q += -muelles.get(s) * wg * J; areaZap += J;
  }
  for (const v of w) { wmin = Math.min(wmin, v); wmax = Math.max(wmax, v); }
}
console.log(`zapata: ${areaZap.toFixed(3)} m² · asiento entre ${(wmin * 1000).toFixed(3)} y ${(wmax * 1000).toFixed(3)} mm`);
console.log(`Q suelo (ks·∫w dA) = ${Q.toFixed(3)} kN hacia arriba`);

// ── para el cálculo a mano: resultante del suelo, su momento y las presiones ──
{
  const puntos = [];                // (x, y, q) en Gauss
  let N = 0, Mx = 0, My = 0;
  for (const s of ids) {
    const e = m.elements[idxDe.get(s)];
    const P = e.map((k) => m.nodes[k]), w = e.map((k) => U.get(k)?.[2] ?? 0);
    for (const xi of [-g, g]) for (const et of [-g, g]) {
      const Nf = [(1 - xi) * (1 - et), (1 + xi) * (1 - et), (1 + xi) * (1 + et), (1 - xi) * (1 + et)].map((v) => v / 4);
      const dx = [-(1 - et), (1 - et), (1 + et), -(1 + et)].map((v) => v / 4);
      const de = [-(1 - xi), -(1 + xi), (1 + xi), (1 - xi)].map((v) => v / 4);
      let a = 0, b = 0, c = 0, d = 0, wg = 0, xg = 0, yg = 0;
      for (let k = 0; k < 4; k++) { a += dx[k] * P[k][0]; b += dx[k] * P[k][1]; c += de[k] * P[k][0]; d += de[k] * P[k][1]; wg += Nf[k] * w[k]; xg += Nf[k] * P[k][0]; yg += Nf[k] * P[k][1]; }
      const J = Math.abs(a * d - b * c), q = -muelles.get(s) * wg;
      N += q * J; Mx += q * J * yg; My += q * J * xg;
    }
  }
  const qn = [];
  for (const s of ids) for (const k of m.elements[idxDe.get(s)]) qn.push({ y: m.nodes[k][1], x: m.nodes[k][0], q: -muelles.get(s) * (U.get(k)?.[2] ?? 0) });
  const porY = new Map();
  for (const r of qn) if (Math.abs(r.x - 5) < 1e-6) porY.set(r.y, r.q);
  const out = { sF, sR, N, yN: Mx / N, xN: My / N, qmax: Math.max(...qn.map((r) => r.q)), qmin: Math.min(...qn.map((r) => r.q)),
    perfilCentro: [...porY.entries()].sort((a, b) => a[0] - b[0]),
    coronaUy: Math.max(...m.nodes.map((p, k) => (Math.abs(p[2] - Math.max(...m.nodes.map((q) => q[2]))) < 1e-9 ? Math.abs(U.get(k)?.[1] ?? 0) : 0))) };
  writeFileSync(`cli/shots/estribo/${id}_struct.json`, JSON.stringify(out, null, 1));
  console.log("resultante del suelo: N =", N.toFixed(3), "kN en y =", out.yN.toFixed(4), "m, x =", out.xN.toFixed(4), "m · q entre", out.qmin.toFixed(2), "y", out.qmax.toFixed(2), "kPa");
}
