/**
 * Genera los 4 archivos del benchmark SAP2000 existente:
 *   Zapata 2×2 m × 0.30, P=10 tonf, ks=12000 kN/m³, mesh 10×10
 * (mismo modelo que `03_zapata_winkler_comparison.py`)
 */
import { writeFileSync } from "fs";
import { exportZapataF2k } from "./f2kExporter.ts";
import { exportZapataTcl } from "./tclExporter.ts";
import { exportZapataOpsPy } from "./opsPyExporter.ts";

const params = {
  Lz: 2.0, Bz: 2.0, tz: 0.30, bc: 0.40,
  ks_kNm3: 12000,
  E_concreto_MPa: 25000,
  P_dead_kN: 10 * 9.80665,
  P_live_kN: 0,
  Mx_dead_kNm: 0, My_dead_kNm: 0,
  nx: 10, ny: 10,
};

const docs = (process.env.USERPROFILE ?? "") + "\\Documents\\";
const base = "Zapata_Bench_2x2_P10tonf";

writeFileSync(docs + base + ".f2k", exportZapataF2k(params), "utf8");
writeFileSync(docs + base + ".tcl", exportZapataTcl(params), "utf8");
writeFileSync(docs + base + ".py",  exportZapataOpsPy(params), "utf8");

console.log(`Exportados 4 archivos en ${docs}:`);
console.log(`   ${base}.f2k → SAFE`);
console.log(`   ${base}.tcl → OpenSees TCL`);
console.log(`   ${base}.py  → OpenSeesPy`);
console.log(`   (SAP2000: ya existe el script en Api sap 2000 examples/python/03_zapata_winkler_comparison.py)`);

// Asentamiento analítico rígido para referencia
const P_kN = params.P_dead_kN;
const A = params.Lz * params.Bz;
const delta_rigido_mm = P_kN / (params.ks_kNm3 * A) * 1000;
console.log(`\nReferencia analítica:`);
console.log(`   δ rígido (mm) = P / (ks × A) = ${P_kN.toFixed(2)} / (${params.ks_kNm3} × ${A}) × 1000 = ${delta_rigido_mm.toFixed(4)} mm`);
