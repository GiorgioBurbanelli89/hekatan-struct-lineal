// Las tipologías de examples/src/tipologias-heks contra SAP2000 / ETABS / SAFE, NUDO A NUDO.
// Cada programa leyó el .s2k/.e2k/.f2k que escribe Hekatan (cli/heks_a_csi.mjs) y volcó sus
// desplazamientos con coordenadas (galpon-bodega-electoral/csi_ida_vuelta.py). Aquí se casan por
// coordenada y se mide la peor diferencia de ux, uy, uz en % del máximo del modelo.
//   node cli/_tipologias_vs_csi.mjs <carpeta con .heks> <carpeta con *_sap.json / *_etabs.json / *_safe.json>
import { existsSync, readFileSync } from "node:fs";
import { resolverHeks } from "../tests/lib/heks.mjs";
const [dirHeks, dirRef] = process.argv.slice(2);
const IDS = ["galpon-curvo", "galpon-agua1", "puente-losa", "puente-losa-vigas", "puente-alcantarilla", "puente-pilas", "puente-estribos", "estribo-puente", "muro-contencion-areas", "muro-contencion-solido-winkler"];
const clave = (x, y, z) => `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
const filas = [];
for (const id of IDS) {
  const r = await resolverHeks(`${dirHeks}/${id}.heks`);
  const H = new Map();
  r.nodes.forEach((p, i) => H.set(clave(p[0], p[1], p[2]), r.deformOutputs.deformations?.get(i) ?? [0, 0, 0]));
  let umax = 0, uzH = 0;
  for (const [, u] of H) { umax = Math.max(umax, Math.hypot(u[0], u[1], u[2])); if (Math.abs(u[2]) > Math.abs(uzH)) uzH = u[2]; }
  for (const prog of ["sap", "etabs", "safe"]) {
    const f = `${dirRef}/${id}_${prog}.json`;
    if (!existsSync(f)) continue;
    const S = JSON.parse(readFileSync(f, "utf-8"));
    let peor = 0, casados = 0, uzS = 0, peorEn = "";
    for (const n of S.nudos ?? []) {
      const u = H.get(clave(n.x, n.y, n.z));
      if (!u) continue;
      casados++;
      if (Math.abs(n.u[2]) > Math.abs(uzS)) uzS = n.u[2];
      for (let c = 0; c < 3; c++) {
        const d = Math.abs(u[c] - n.u[c]) / umax * 100;
        if (d > peor) { peor = d; peorEn = `${"xyz"[c]} en (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`; }
      }
    }
    filas.push({ id, prog, casados: `${casados}/${H.size}`, peor_pct_max: +peor.toPrecision(3), peorEn,
      uz_hekatan_mm: +(uzH * 1e3).toFixed(4), uz_csi_mm: +(uzS * 1e3).toFixed(4), sumRz_csi: S.sumRz !== undefined ? +S.sumRz.toFixed(2) : "" });
  }
}
console.table(filas);
