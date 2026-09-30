#!/usr/bin/env node
/**
 * De las salidas de CSI a las referencias del caso `muro-manabi-vs-csi`: solo los desplazamientos,
 * por nudo y por caso.
 *   node cli/muro_manabi_referencias.mjs <carpeta> [variante]     (variante lat1 = suelo lateral)
 *
 * SAP2000: `sap_<modelo>.json`, el modelo ARMADO por OAPI (csi_desde_dump.py), dos casos.
 * ETABS:   `abre_etabs_<modelo>.json`, ETABS ABRIENDO el `.e2k` que exporta Hekatan
 *          (csi_abrir_exportado.py): un caso, el que lleva el fichero (sísmico), y la precisión
 *          con la que el fichero escribe los números.
 * Por qué ETABS no va por OAPI: armado a mano con `SetSlab`/`SetWall` la membrana sale con la
 * base sin asentar y la cáscara a 0.47 % (28-sep-2026); con el `.e2k` del exportador, 0.002 %.
 * El fallo es del guion que arma, no del exportador ni del solver.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const AQUI = dirname(fileURLToPath(import.meta.url));
const carpeta = process.argv[2];
if (!carpeta) { console.error("uso: node cli/muro_manabi_referencias.mjs <carpeta>"); process.exit(2); }
const hoy = new Date().toISOString().slice(0, 10);
// 2.º argumento opcional: variante del modelo (p. ej. `lat1` = con suelo lateral) → muro_manabi_<prog>_<modelo>_lat1.json
const SUF = process.argv[3] ? `_${process.argv[3]}` : "";
const guardar = (prog, modelo, out) => writeFileSync(join(AQUI, "..", "tests", "datos", `muro_manabi_${prog}_${modelo}${SUF}.json`), JSON.stringify(out));

for (const modelo of ["membrana", "cascara", "solido"]) {
  const f = join(carpeta, `sap_${modelo}.json`);
  if (!existsSync(f)) { console.log(`falta sap_${modelo}.json`); continue; }
  const S = JSON.parse(readFileSync(f, "utf-8"));
  const out = { programa: "SAP2000", modelo, fecha: hoy, limite: 1e-6,
    como: "armado por OAPI (csi_desde_dump.py): misma malla, mismos muelles, mismas cargas nodales", casos: {} };
  for (const [caso, r] of Object.entries(S.casos)) {
    const N = Math.max(...r.nudos.map((n) => n.i)) + 1, u = Array.from({ length: N }, () => null);
    for (const n of r.nudos) u[n.i] = n.u.slice(0, 3);
    out.casos[caso] = u;
    console.log(`SAP2000 ${modelo} ${caso}: ${r.nudos.length} nudos, peor ${r.peor?.toExponential(2)} % del máximo`);
  }
  guardar("sap", modelo, out);
}
for (const modelo of ["membrana", "cascara"]) {
  const f = join(carpeta, `abre_etabs_${modelo}.json`);
  if (!existsSync(f)) { console.log(`falta abre_etabs_${modelo}.json`); continue; }
  const S = JSON.parse(readFileSync(f, "utf-8"));
  const N = Math.max(...S.res.map((n) => n.i)) + 1, u = Array.from({ length: N }, () => null);
  for (const n of S.res) u[n.i] = n.u;
  guardar("etabs", modelo, { programa: "ETABS", modelo, fecha: hoy, limite: 5e-3,
    como: "ETABS abre el .e2k que exporta Hekatan (csi_abrir_exportado.py); nudos casados por coordenadas", casos: { Sismico: u } });
  console.log(`ETABS ${modelo} Sismico: ${S.casados} nudos casados de ${S.nudos}, peor ${S.peor_pct.toExponential(2)} % del máximo`);
}
