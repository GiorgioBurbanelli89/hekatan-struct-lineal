// Placa FLEXIBLE 4x4, t = 0.20, ks = 20000 kN/m3, P = 1000 kN en el nudo central, 8x8, Shell-Thick,
// contra SAFE 20 con muelle de AREA (validation/isse/safe_area_flexible.py -> safe_area_flexible.json,
// SubModulus por tabla): Hekatan con `areaspring` CONSISTENTE y con muelles nodales (tributaria).
//   node validation/isse/muelle_area_flexible.mjs
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolverHeks } from "../../tests/lib/heks.mjs";
const L0 = 4.0, N = 8, T = 0.2, E = 25e6, NU = 0.2, KS = 20000, P = 1000;
const h = L0 / N;
const S = JSON.parse(readFileSync("validation/isse/safe_area_flexible.json", "utf-8"));
async function placa(modo) {
  const L = []; const id = new Map(); const k = (i, j) => `${i},${j}`;
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) { id.set(k(i, j), id.size + 1); L.push(`node ${id.get(k(i, j))} ${(i * h).toFixed(6)} ${(j * h).toFixed(6)} 0`); }
  let ns = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    ns++;
    L.push(`shell ${ns} ${id.get(k(i, j))} ${id.get(k(i + 1, j))} ${id.get(k(i + 1, j + 1))} ${id.get(k(i, j + 1))} ${T} ${E} ${NU} 0`);
    if (modo === "consistente") L.push(`areaspring ${ns} ${KS}`);
    if (modo === "nodal") L.push(`areaspring ${ns} ${KS} nodal`);
  }
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) L.push(`support ${id.get(k(i, j))} 1 1 0 0 0 1`);
  L.push(`load ${id.get(k(N / 2, N / 2))} 0 0 ${-P}`);
  L.push("solve");
  const dir = mkdtempSync(join(tmpdir(), "hkFlex-")); const ruta = join(dir, "placa.heks"); writeFileSync(ruta, L.join("\n") + "\n", "utf-8");
  const r = await resolverHeks(ruta);
  const w = (x, y) => { const i = r.nodes.findIndex((n) => Math.abs(n[0] - x) < 1e-9 && Math.abs(n[1] - y) < 1e-9); return r.deformOutputs.deformations.get(i)[2] * 1000; };
  return { w };
}
export async function medir() {
  const H = { consistente: await placa("consistente"), nodal: await placa("nodal") };
  const filas = [];
  for (const s of S.results.samples_9pts) filas.push({ label: s.label, x: s.x, y: s.y, safe: s.w_mm, cons: H.consistente.w(s.x, s.y), nod: H.nodal.w(s.x, s.y) });
  return filas;
}
if (process.argv[1].endsWith("muelle_area_flexible.mjs")) {
  const filas = await medir();
  console.log("placa 4x4 t=0.20 ks=20000 P=1000 (centro) 8x8 Shell-Thick · w en mm");
  console.log("  punto                  SAFE area   Hek consistente (dif)      Hek nodal (dif)");
  let pc = 0, pn = 0;
  for (const f of filas) {
    const dc = (f.cons / f.safe - 1) * 100, dn = (f.nod / f.safe - 1) * 100; pc = Math.max(pc, Math.abs(dc)); pn = Math.max(pn, Math.abs(dn));
    console.log(`  ${f.label.padEnd(22)} ${f.safe.toFixed(4).padStart(9)}   ${f.cons.toFixed(4).padStart(9)} (${dc.toFixed(3).padStart(7)} %)   ${f.nod.toFixed(4).padStart(9)} (${dn.toFixed(3).padStart(7)} %)`);
  }
  console.log(`  peor: consistente ${pc.toFixed(3)} % · nodal ${pn.toFixed(3)} %`);
}
