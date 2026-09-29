#!/usr/bin/env node
/**
 * La zapata del muro de Manabí, SOLA (con el fuste sustituido por lo que transmite), resuelta por
 * Hekatan y comparada nudo a nudo con el modelo de cáscara completo del que salió.
 *   node cli/zapata_muro_comparar.mjs <carpeta>
 * La carpeta trae `zapata_muro_<caso>.heks` y `zapata_muro_<caso>_ref.json`
 * (de hekatan-school/serie_muro_manabi/zapata_desde_dump.py). Escribe `zapata_muro_<caso>_hekatan.json`.
 * Si además hay `zapata_muro_<caso>_safe.json` ({ uz: { nudo: m } }), compara también con SAFE.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { resolverHeks } from "../tests/lib/heks.mjs";

const carpeta = process.argv[2];
if (!carpeta) { console.error("uso: node cli/zapata_muro_comparar.mjs <carpeta>"); process.exit(2); }
const KS = 64625.8235;                       // kN/m3 = 6.59 kgf/cm3 (estudio de suelos, tramo de −2.55 a −3.00 m)
for (const caso of ["estatico", "sismico"]) {
  const r = await resolverHeks(join(carpeta, `zapata_muro_${caso}.heks`));
  const ref = JSON.parse(readFileSync(join(carpeta, `zapata_muro_${caso}_ref.json`), "utf-8"));
  const def = r.deformOutputs.deformations;            // Map<nudo, [6]>
  const uz = {};
  let peor = 0, max = 0;
  for (const [k, v] of Object.entries(ref.uz)) {
    const u = def.get(Number(k) - 1)[2];
    uz[k] = u; max = Math.max(max, Math.abs(v)); peor = Math.max(peor, Math.abs(u - v));
  }
  const p = Object.values(uz).map((u) => -KS * u);
  writeFileSync(join(carpeta, `zapata_muro_${caso}_hekatan.json`), JSON.stringify({ caso, ks: KS, uz }, null, 1));
  console.log(`${caso}: zapata sola contra el modelo completo, peor nudo ${(100 * peor / max).toExponential(2)} % del máximo · ` +
              `presión ${Math.min(...p).toFixed(2)} a ${Math.max(...p).toFixed(2)} kPa · flecha máx ${(1000 * max).toFixed(4)} mm`);
  const fs = join(carpeta, `zapata_muro_${caso}_safe.json`);
  if (existsSync(fs)) {
    const safe = JSON.parse(readFileSync(fs, "utf-8")).uz;
    let peorS = 0, n = 0;
    for (const [k, v] of Object.entries(safe)) if (k in uz) { peorS = Math.max(peorS, Math.abs(v - uz[k])); n++; }
    const ps = Object.values(safe).map((u) => -KS * u);
    console.log(`   SAFE: ${n} nudos, peor nudo ${(100 * peorS / max).toExponential(2)} % del máximo · presión ${Math.min(...ps).toFixed(2)} a ${Math.max(...ps).toFixed(2)} kPa`);
  }
}
