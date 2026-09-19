// Comprueba las tipologías de examples/src/tipologias-heks: que el .heks se lea sin errores, que
// resuelva, y el EQUILIBRIO contra la carga calculada a mano (empuje de Rankine, reacción del tablero).
//   node cli/_tipologias_check.mjs [carpeta_salida]
import { writeFileSync, mkdirSync } from "node:fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { resolverHeks } from "../tests/lib/heks.mjs";
const out = process.argv[2] ?? "cli/shots/tipologias";
mkdirSync(out, { recursive: true });
const { heksDeTipologia, tipologiasHeks } = await empaquetar(
  `export { heksDeTipologia, tipologiasHeks } from "${R}/examples/src/tipologias-heks/tipologiasHeks";\n`, "tipologias");
const Ka = (f) => Math.tan((45 - f / 2) * Math.PI / 180) ** 2;
for (const t of tipologiasHeks) {
  const p = Object.fromEntries(Object.entries(t.params).map(([k, v]) => [k, v.default]));
  const txt = heksDeTipologia(t.id);
  const f = `${out}/${t.id}.heks`; writeFileSync(f, txt);
  const t0 = Date.now();
  const r = await resolverHeks(f);
  const err = globalThis.window.__hekatanCliErrors ?? [];
  const d = r.deformOutputs;
  let umax = [0, 0, 0], R3 = [0, 0, 0];
  for (const [, v] of d.deformations ?? []) for (let k = 0; k < 3; k++) if (Math.abs(v[k]) > Math.abs(umax[k])) umax[k] = v[k];
  for (const [, v] of d.reactions ?? []) for (let k = 0; k < 3; k++) R3[k] += v[k] || 0;
  // Balance: reacciones de apoyo + fuerza de los muelles nodales (−k·u) contra la carga a mano.
  let kSpr = [];
  for (const l of txt.split("\n")) {
    const t = l.trim().split(/\s+/);
    if (t[0] === "spring") kSpr.push([+t[1] - 1, { ux: 0, uy: 1, uz: 2 }[t[2]], +t[3]]);
  }
  const muelle = [0, 0, 0];
  for (const [n, k, kk] of kSpr) muelle[k] += kk * ((d.deformations?.get(n)?.[k]) ?? 0);
  const Rt = [0, 1, 2].map((k) => R3[k] - muelle[k]);   // apoyos + muelles (−k·u)
  // carga horizontal esperada
  let esperado = "";
  if (t.id.startsWith("muro")) {
    const E = Ka(p.phi) * (p.gamma * p.H ** 2 / 2 + p.q * p.H) * p.Lm;
    esperado = `empuje Rankine ${E.toFixed(2)} kN → apoyos ${Rt[1].toFixed(2)} (${(100 * (Rt[1] - E) / E).toFixed(4)} %)`;
    if (t.id.endsWith("solido")) {
      const W = 2.4 * 9.80665 * p.Lm * (p.t * p.H + (p.puntera + p.talon) * p.tz) + (p.gamma * p.H + p.q) * (p.talon - p.t / 2) * p.Lm;
      esperado += `\n   peso ρgV + tierra ${W.toFixed(2)} kN → muelles ${Rt[2].toFixed(2)} (${(100 * (Rt[2] - W) / W).toFixed(4)} %)`;
    }
  } else if (t.id === "puente-losa-vigas") {
    const W = (Math.round(p.nVigas) - 1) * p.sep + 2 * p.volado;
    const q = (p.qCM + p.qCV) * W * p.L;
    const sw = 2.4 * 9.80665 * (p.tL * W * p.L + Math.round(p.nVigas) * p.bV * p.hV * p.L + 2 * (Math.round(p.nVigas) - 1) * p.sep * 0.25 * p.hV * 0.8);
    esperado = `losa+vigas+diafragmas ${sw.toFixed(2)} + CM/CV ${q.toFixed(2)} = ${(sw + q).toFixed(2)} kN → ΣRz ${R3[2].toFixed(2)} (${(100 * (R3[2] - sw - q) / (sw + q)).toFixed(4)} %)`;
  } else if (t.id === "estribo-puente") {
    const e = Ka(p.phi) * (p.gamma * p.H ** 2 / 2 + p.q * p.H);
    const Ey = e * p.B + p.Fh;
    esperado = `pantalla+frenado ${Ey.toFixed(2)} kN → apoyos ${Rt[1].toFixed(2)} (${(100 * (Rt[1] - Ey) / Ey).toFixed(4)} %); aletas se anulan → ΣRx = ${Rt[0].toFixed(3)}`;
  }
  const n = r.nodes.length, nf = r.elements.filter((e) => e.length === 2).length, ns = r.elements.filter((e) => e.length === 4).length, nh = r.elements.filter((e) => e.length === 8).length;
  console.log(`\n## ${t.id}: ${n} nudos · ${nf} barras · ${ns} áreas · ${nh} sólidos · ${Date.now() - t0} ms · errores ${err.length}${err.length ? " " + err.slice(0, 2) : ""}`);
  console.log(`   umax mm: ux ${(umax[0] * 1e3).toFixed(3)} uy ${(umax[1] * 1e3).toFixed(3)} uz ${(umax[2] * 1e3).toFixed(3)} · ΣR kN: ${R3.map((x) => x.toFixed(2)).join(", ")}`);
  if (esperado) console.log("   " + esperado);
}
