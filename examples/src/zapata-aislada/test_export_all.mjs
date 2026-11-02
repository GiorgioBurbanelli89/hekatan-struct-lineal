/**
 * Genera F2K, TCL y OpenSeesPy para la zapata 1.5×1.5 P=20 tonf.
 * Output: 3 archivos en C:\Users\USUARIO\Documents\
 */
import { writeFileSync } from "fs";
import { exportZapataF2k } from "./f2kExporter.ts";
import { exportZapataTcl } from "./tclExporter.ts";
import { exportZapataOpsPy } from "./opsPyExporter.ts";

const params = {
  Lz: 1.50, Bz: 1.50, tz: 0.30, bc: 0.40,
  ks_kNm3: 19613,
  E_concreto_MPa: 24855,
  P_dead_kN: 20 * 9.80665,
  P_live_kN: 0,
  Mx_dead_kNm: 0, My_dead_kNm: 0,
  nx: 12, ny: 12,
};

const docs = (process.env.USERPROFILE ?? "") + "\\Documents\\";

writeFileSync(docs + "Zapata_Hekatan_1.5x1.5_P20tonf.f2k", exportZapataF2k(params), "utf8");
writeFileSync(docs + "Zapata_Hekatan_1.5x1.5_P20tonf.tcl", exportZapataTcl(params), "utf8");
writeFileSync(docs + "Zapata_Hekatan_1.5x1.5_P20tonf.py", exportZapataOpsPy(params), "utf8");

console.log("✅ 3 archivos exportados en " + docs);
console.log("   .f2k → SAFE 20.x");
console.log("   .tcl → OpenSees Classic (opensees.exe)");
console.log("   .py  → OpenSeesPy (python ...py)");
