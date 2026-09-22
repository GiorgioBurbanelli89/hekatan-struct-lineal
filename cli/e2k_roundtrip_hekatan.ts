/**
 * e2k_roundtrip_hekatan.ts
 * --------------------------------------------------------------------------
 * Round-trip e2k del lado HEKATAN (sin browser):
 *    e2k_in  →  parseE2k  →  exportE2k  →  e2k_out
 * y compara línea por línea. Si Hekatan parsea y re-exporta IGUAL, su
 * import/export es fiel.
 *
 * Uso:  npx tsx cli/e2k_roundtrip_hekatan.ts <archivo.e2k> [salida.e2k]
 */
import * as fs from "fs";
import { parseE2k } from "../examples/src/shared/e2kParser";
import { exportE2k } from "../examples/src/shared/e2kExporter";

const inPath = process.argv[2];
if (!inPath || !fs.existsSync(inPath)) {
  console.error("ERROR: pasá la ruta de un .e2k existente");
  process.exit(2);
}
const outPath = process.argv[3] || inPath.replace(/\.e2k$/i, "_hekatan_rt.e2k");

const textIn = fs.readFileSync(inPath, "utf-8");
console.log("=".repeat(70));
console.log("  ROUND-TRIP HEKATAN:  e2k → parseE2k → exportE2k → e2k");
console.log("=".repeat(70));
console.log(`  entrada: ${inPath}  (${textIn.length} chars)`);

const model = parseE2k(textIn);
console.log(`  parseE2k OK → ${model.info.nNodes} nodos, ${model.info.nFrames} frames, ${model.info.nAreas} areas`);
console.log(`  rawSections capturadas: ${model.rawSections?.size ?? 0}`);

const textOut = exportE2k({
  nodes: model.nodes,
  elements: model.elements,
  nodeInputs: model.nodeInputs,
  elementInputs: model.elementInputs,
  title: model.info.title,
  units: { force: model.units.force, length: model.units.length },
  e2kModel: model,
});
fs.writeFileSync(outPath, textOut);
console.log(`  exportE2k OK → ${outPath}  (${textOut.length} chars)`);

// ── Comparación línea por línea (ignorando CRLF/LF y timestamps de LOG) ──
const norm = (s: string) =>
  s.split(/\r?\n/)
    .map((l) => l.replace(/\s+$/, ""))         // trailing spaces
    .filter((l) => !/^\s*LOG\b/i.test(l))       // líneas de LOG (timestamp ETABS)
    .filter((l) => l.trim() !== "");            // blancos
const A = norm(textIn);
const B = norm(textOut);

let diffs = 0;
const maxLines = Math.max(A.length, B.length);
console.log("\n  ────── Diferencias (entrada vs salida) ──────");
for (let i = 0; i < maxLines; i++) {
  if (A[i] !== B[i]) {
    diffs++;
    if (diffs <= 15) {
      console.log(`  línea ${i + 1}:`);
      console.log(`    IN : ${A[i] ?? "(falta)"}`);
      console.log(`    OUT: ${B[i] ?? "(falta)"}`);
    }
  }
}
console.log("\n" + "=".repeat(70));
if (diffs === 0) {
  console.log(`  ✅ IDÉNTICO — Hekatan re-exporta el e2k sin cambios (${A.length} líneas).`);
} else {
  console.log(`  ⚠ ${diffs} líneas distintas de ${maxLines} (ver arriba las primeras 15).`);
}
console.log("=".repeat(70));
process.exit(diffs === 0 ? 0 : 1);
