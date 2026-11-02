/**
 * Selector de formulación de placa (2-nov-2026): la MISMA losa con cada formulación de la tabla única
 * `examples/src/shared/formulacionesPlaca.ts`, por el camino de la app (.heks → cliModeler → WASM).
 *
 * Losa 4×4 m apoyada DURO en los 4 bordes (w = 0 y giro tangencial 0), E = 2.2e7, ν = 0.2, q = −10 kN/m².
 * Jueces analíticos (serie de Navier, no otro elemento):
 *   - Kirchhoff  w = Σ 16q/(π² m n D K²)                      K = (mπ/a)² + (nπ/b)²
 *   - Mindlin    w = Σ 16q/(π² m n D K²) · (1 + D·K/(κ·G·t))  κ = 5/6  (FSDT, placa SS dura)
 * Thin (DKQ) se mide contra Kirchhoff; las gruesas contra Mindlin. Malla 16×16; t = 0.2 (L/t 20) y 0.02 (L/t 200).
 * Además: cada palabra de la tabla llega al solver con su pf, y `csi` (pf 8, aún no en el WASM) se RECHAZA.
 *
 *   node tests/run.mjs selector-formulacion
 *   HK_TABLA=1 node tests/run.mjs selector-formulacion   → imprime la tabla de flechas
 */
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { empaquetar, R } from "../lib/bundle.mjs";
import { resolverHeks } from "../lib/heks.mjs";

export const nombre = "selector-formulacion-placa";
export const descripcion = "misma losa con cada formulación elegible (thick, thin, dse, dkmq, auricchio) vs Navier Kirchhoff/Mindlin";

const A = 4, E = 2.2e7, NU = 0.2, Q = -10, KAPPA = 5 / 6;

function heks(t, N, clave) {
  const L = []; const id = (i, j) => i * (N + 1) + j + 1;
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) L.push(`node ${id(i, j)} ${i * A / N} ${j * A / N} 0`);
  let ns = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    ns++; L.push(`shell ${ns} ${id(i, j)} ${id(i + 1, j)} ${id(i + 1, j + 1)} ${id(i, j + 1)} ${t} ${E} ${NU} 0`, `areaload ${ns} ${Q}`);
  }
  L.push(`shelltype 1-${ns} ${clave}`);
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
    const bx = i === 0 || i === N, by = j === 0 || j === N;
    if (!bx && !by) continue;
    // apoyo DURO: borde x = cte → ∂w/∂y = 0 → rx; borde y = cte → ∂w/∂x = 0 → ry
    let s = [0, 0, 1, bx ? 1 : 0, by ? 1 : 0, 0];
    if (i === 0 && j === 0) s = [1, 1, 1, 1, 1, 1];
    if (i === N && j === 0) s = [0, 1, 1, 1, 1, 1];
    L.push(`support ${id(i, j)} ${s.join(" ")}`);
  }
  L.push("solve");
  return { texto: L.join("\n"), centro: id(N / 2, N / 2) - 1 };
}

async function resolver(t, N, clave) {
  const { texto, centro } = heks(t, N, clave);
  const f = join(mkdtempSync(join(tmpdir(), "hkSelPl-")), "p.heks"); writeFileSync(f, texto);
  const r = await resolverHeks(f);
  const d = r.deformOutputs.deformations?.get?.(centro);
  const pfs = new Set(r.elementInputs.plateFormulations?.values?.() ?? []);
  return { w: d ? d[2] : NaN, pfs };
}

function navier(t, mindlin) {
  const D = E * t ** 3 / (12 * (1 - NU * NU)), G = E / (2 * (1 + NU));
  let w = 0;
  for (let m = 1; m < 200; m += 2) for (let n = 1; n < 200; n += 2) {
    const K = (m * Math.PI / A) ** 2 + (n * Math.PI / A) ** 2;
    const s = Math.sin(m * Math.PI / 2) * Math.sin(n * Math.PI / 2);
    w += 16 * Q / (Math.PI ** 2 * m * n * D * K * K) * s * (mindlin ? 1 + D * K / (KAPPA * G * t) : 1);
  }
  return w;
}

export async function correr() {
  const { FORMULACIONES_PLACA } = await empaquetar(
    `export { FORMULACIONES_PLACA } from "${R}/examples/src/shared/formulacionesPlaca";\n`, "formulacionesPlaca");
  const filas = [], tabla = [];
  const N = 16;
  // límite contra Navier: malla 16×16 (MITC4/Thin/DSE/DKMQ/AT convergen a < 1 % aquí)
  const LIM = 1.0;
  for (const f of FORMULACIONES_PLACA) {
    if (!f.enWasm) {
      const r = await resolver(0.2, 4, f.clave);
      const ok = !r.pfs.has(f.pf);
      filas.push({ que: `«${f.clave}» (${f.nombre}) aún no en el WASM: se rechaza, no cae en MITC4 callando`,
                   medido: ok ? 0 : 1, limite: 0, ok, detalle: ok ? "rechazada" : "¡llegó al solver!" });
      continue;
    }
    for (const t of [0.2, 0.02]) {
      const r = await resolver(t, N, f.clave);
      const llega = r.pfs.size === 1 && r.pfs.has(f.pf);
      if (t === 0.2) filas.push({ que: `«${f.clave}» llega al solver como plateFormulations ${f.pf}`,
                                  medido: llega ? 0 : 1, limite: 0, ok: llega, detalle: [...r.pfs].join(",") || "(vacío = 0)" });
      const delgada = f.pf === 1;
      const ref = navier(t, !delgada);
      const dif = 100 * (r.w / ref - 1);
      tabla.push({ f: f.nombre, pf: f.pf, t, w: r.w, ref, juez: delgada ? "Kirchhoff" : "Mindlin", dif });
      filas.push({ que: `${f.nombre}, t = ${t} (L/t ${A / t}), 16×16: w centro vs Navier ${delgada ? "Kirchhoff" : "Mindlin"}`,
                   medido: Math.abs(dif), limite: LIM, ok: Math.abs(dif) < LIM,
                   detalle: `${(r.w * 1000).toFixed(5)} vs ${(ref * 1000).toFixed(5)} mm (${dif >= 0 ? "+" : ""}${dif.toFixed(3)} %)` });
    }
  }
  if (process.env.HK_TABLA) {
    console.log("\nformulación | pf | t | w centro (mm) | Navier (mm) | juez | dif %");
    for (const r of tabla) console.log(`${r.f} | ${r.pf} | ${r.t} | ${(r.w * 1000).toFixed(5)} | ${(r.ref * 1000).toFixed(5)} | ${r.juez} | ${r.dif.toFixed(3)}`);
    // diferencias entre formulaciones (contra MITC4, el defecto)
    for (const t of [0.2, 0.02]) {
      const base = tabla.find((r) => r.t === t && r.pf === 0);
      console.log(`\nt = ${t}: diferencia contra Shell-Thick MITC4 (${(base.w * 1000).toFixed(5)} mm)`);
      for (const r of tabla.filter((r) => r.t === t)) console.log(`  ${r.f}: ${(100 * (r.w / base.w - 1)).toFixed(3)} %`);
    }
  }
  return filas;
}
