// Resuelve un .heks por cliModeler patrón a patrón + modal y compara con un JSON de ETABS (etabs_ref.py).
// Uso: node cli/_e2k_vs_etabs.mjs modelo.heks etabs_ref.json [salida.json]
import { readFileSync, writeFileSync } from "node:fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const { cliModeler, combinar } = await empaquetar(`export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";\nexport { combinar } from "${R}/examples/src/shared/nec/espectral";\n`, "cliModeler-rs");
const [fHeks, fRef, fOut] = process.argv.slice(2);
const ref = JSON.parse(readFileSync(fRef, "utf-8"));
const texto = readFileSync(fHeks, "utf-8");
globalThis.window = globalThis;
const st = (v) => ({ val: v });
const resolver = (factores) => {
  globalThis.__hekatanCliScript = texto;
  globalThis.__hekatanFactoresPatron = factores;
  const s = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
  const lg = console.log; console.log = () => {}; try { cliModeler.build({}, s); } finally { console.log = lg; }
  return s;
};
const base = (s) => {   // reacción total (Fx Fy Fz Mx My Mz respecto al origen), signo de ETABS
  const r = [0, 0, 0, 0, 0, 0];
  for (const [n, v] of s.deformOutputs.val?.reactions ?? []) {
    const p = s.nodes.val[n];
    for (let k = 0; k < 6; k++) r[k] += v[k] ?? 0;
    r[3] += p[1] * v[2] - p[2] * v[1]; r[4] += p[2] * v[0] - p[0] * v[2]; r[5] += p[0] * v[1] - p[1] * v[0];
  }
  return r;
};
const out = { estatico: {}, modal: null };
const pct = (a, b) => Math.abs(b) > 1e-6 ? (100 * (a - b) / Math.abs(b)) : (Math.abs(a) < 1e-3 ? 0 : NaN);
for (const pat of Object.keys(ref.base)) {
  if (/^~|^Modal$|^SD/.test(pat)) continue;
  const s = resolver({ [pat]: 1 });
  const h = base(s), e = ref.base[pat];
  out.estatico[pat] = { hekatan: h, etabs: e };
  // nudo a nudo en los puntos-objeto de ETABS (por coordenada, 1 mm)
  if (ref.coords && ref.disp?.[pat]) {
    const idx = new Map(s.nodes.val.map((p, i) => [p.map((v) => Math.round(v * 1000)).join("|"), i]));
    const U = s.deformOutputs.val.deformations; let peor = 0, umax = 0, casados = 0;
    const comp = Math.abs(e[2]) > 1 ? 2 : Math.abs(e[0]) > Math.abs(e[1]) ? 0 : 1;
    for (const [nm, d] of Object.entries(ref.disp[pat])) {
      const c = ref.coords[nm]; if (!c) continue;
      const i = idx.get(c.map((v) => Math.round(v * 1000)).join("|")); if (i === undefined) continue;
      const u = U.get(i); if (!u) continue; casados++;
      umax = Math.max(umax, Math.abs(d[comp])); peor = Math.max(peor, Math.abs(u[comp] - d[comp]));
    }
    if (casados) console.log(`           nudo a nudo U${"xyz"[comp]}: ${casados} puntos, peor ${(100 * peor / umax).toFixed(3)} % del máx (${(umax * 1000).toFixed(3)} mm)`);
  }
  const k = Math.abs(e[2]) > 1 ? 2 : Math.abs(e[0]) > Math.abs(e[1]) ? 0 : 1;
  console.log(`${pat.padEnd(10)} F${"xyz"[k]} H ${h[k].toFixed(3)} E ${e[k].toFixed(3)} (${pct(h[k], e[k]).toFixed(3)} %) · Mz H ${h[5].toFixed(2)} E ${e[5].toFixed(2)} · Mx ${h[3].toFixed(1)}/${e[3].toFixed(1)} My ${h[4].toFixed(1)}/${e[4].toFixed(1)}`);
}
// modal
const s = resolver({ Dead: 1 });
let modal = null;
globalThis.__hekatanCliModalModes = String(ref.modos?.length || 12);
cliModeler.runModal({}, s, { render: (o) => { modal = o; } });
if (modal) {
  const T = modal.frequencies.map((f) => 1 / f), mp = modal.massParticipation ?? [];
  out.modal = { T, mp };
  console.log("modo  T Hekatan   T ETABS    dif %    Ux H/E        Uy H/E        Rz H/E");
  ref.modos.slice(0, 6).forEach((e, i) => {
    const p = mp[i] ?? [];
    console.log(`${i + 1}    ${T[i]?.toFixed(4)}    ${e.T.toFixed(4)}   ${pct(T[i], e.T).toFixed(2)}   ${(p[0] ?? 0).toFixed(3)}/${e.Ux.toFixed(3)}   ${(p[1] ?? 0).toFixed(3)}/${e.Uy.toFixed(3)}   ${(p[5] ?? 0).toFixed(3)}/${(e.Rz ?? 0).toFixed(3)}`);
  });
}
// ── espectro de respuesta (casors): V = CQC de Sa(T_i)·M_eff,i en la dirección del caso ──
if (modal) {
  const ei = s.elementInputs.val, Mtot = [...(s.nodeInputs.val.masses ?? new Map()).values()].reduce((a, b) => a + b, 0);
  const T = modal.frequencies.map((f) => 1 / f);
  for (const c of ei.casosRS ?? []) {
    const e = ei.espectros?.get?.(c.func); if (!e) continue;
    const Sa = (t) => { if (t <= e.T[0]) return e.Sa[0]; for (let k = 1; k < e.T.length; k++) if (t <= e.T[k]) return e.Sa[k - 1] + (e.Sa[k] - e.Sa[k - 1]) * (t - e.T[k - 1]) / (e.T[k] - e.T[k - 1]); return e.Sa[e.Sa.length - 1]; };
    const d = c.dir === "U1" ? 0 : c.dir === "U2" ? 1 : 2;
    const V = T.map((t, i) => Sa(t) * c.sf * (modal.massParticipation[i]?.[d] ?? 0) * Mtot);
    const Vb = combinar(V, T, c.amort, "CQC"), Ve = ref.base[c.nombre]?.[d];
    console.log(`${c.nombre.padEnd(10)} V${"xyz"[d]} CQC H ${Vb.toFixed(3)} E ${Ve !== undefined ? Math.abs(Ve).toFixed(3) : "—"} (${Ve ? pct(Vb, Math.abs(Ve)).toFixed(3) : "—"} %)`);
  }
}
const mt = [...(s.nodeInputs.val.masses ?? new Map()).values()].reduce((a, b) => a + b, 0);
console.log("masa de la fuente (t):", mt.toFixed(3));
if (fOut) writeFileSync(fOut, JSON.stringify(out));
