#!/usr/bin/env node
/**
 * Suite de regresion de Hekatan Struct Lineal contra los programas de CSI.
 *
 *   npm test                 (todos los casos)
 *   node tests/run.mjs paz   (solo los que contengan "paz" en el nombre)
 *
 * Todo caso vive en tests/casos/ y exporta { nombre, descripcion, correr() },
 * donde correr() devuelve filas { que, medido, limite, ok, detalle }. La
 * referencia de cada caso es otro PROGRAMA (ETABS, SAP2000, SAFE) con el mismo
 * modelo, la misma malla nodo a nodo y los brazos rigidos anulados — nunca una
 * cuenta a mano ni un numero heredado sin fuente reproducible.
 *
 * Sale con codigo 1 si algo se sale de su limite.
 */
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const AQUI = dirname(fileURLToPath(import.meta.url));
const filtro = process.argv[2];

const archivos = readdirSync(join(AQUI, "casos")).filter(f => f.endsWith(".mjs")).sort();
let fallos = 0, total = 0;
const t0 = Date.now();

// Un temporizador que un ejemplo deja armado (un menu que se monta «dentro de un rato») dispara
// cuando ya corre OTRO caso, con el `document` de mentira de ese caso, y tumbaba la suite entera:
// el 28-sep-2026 moria en `unidades-densidad` y los casos de detras no corrian nunca. Se anota
// como UN fallo, con el caso que corria cuando salto, y la suite sigue.
let casoActual = "(arranque)";
const fueraDeCaso = [];
const anotar = (e) => fueraDeCaso.push(`${casoActual}: ${e?.message ?? e}`);
process.on("uncaughtException", anotar);
process.on("unhandledRejection", anotar);

for (const archivo of archivos) {
  const caso = await import(pathToFileURL(join(AQUI, "casos", archivo)).href);
  casoActual = caso.nombre;
  // el filtro casa con el NOMBRE del caso o con el del fichero: los nombres van
  // con guion ("placa-opensees-vs-sap2000") y los ficheros con guion bajo, y no
  // tiene sentido que `node tests/run.mjs placa_opensees` no encuentre el suyo.
  if (filtro && !caso.nombre.includes(filtro) && !archivo.includes(filtro)) continue;

  console.log(`\n── ${caso.nombre} ${"─".repeat(Math.max(0, 60 - caso.nombre.length))}`);
  console.log(`   ${caso.descripcion}`);
  let filas;
  try {
    filas = await caso.correr();
  } catch (e) {
    console.log(`   ERROR: ${e.message}`);
    fallos++; total++;
    continue;
  }
  for (const f of filas) {
    total++;
    if (!f.ok) fallos++;
    const marca = f.ok ? "ok  " : "FALLA";
    const medido = f.crudo ? String(f.medido) : `${f.medido.toFixed(3)} %`;
    const limite = f.crudo ? String(f.limite) : `${f.limite.toFixed(2)} %`;
    console.log(`   ${marca} ${f.que.padEnd(22)} ${medido.padStart(10)}  (limite ${limite})` +
                (f.detalle ? `   ${f.detalle}` : ""));
  }
}

if (fueraDeCaso.length) {
  console.log(`\n── fuera-de-caso ${"─".repeat(47)}`);
  console.log("   excepciones que saltaron FUERA de un caso (temporizadores que dejo armados un ejemplo)");
  for (const f of new Set(fueraDeCaso)) { total++; fallos++; console.log(`   FALLA ${f}`); }
}

const seg = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`\n${fallos ? "FALLA" : "OK"}: ${total - fallos}/${total} comprobaciones en ${seg} s`);
process.exit(fallos ? 1 : 0);
