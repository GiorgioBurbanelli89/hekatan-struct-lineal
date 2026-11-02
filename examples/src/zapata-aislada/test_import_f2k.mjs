/**
 * Test del importer F2K usando el archivo real del usuario.
 */
import { readFileSync } from "fs";
import { parseZapataF2k } from "./f2kImporter.ts";

const path = (process.env.USERPROFILE ?? "") + "\\Documents\\Zapata_Bench_2x2_P10tonf.f2k";
const text = readFileSync(path, "utf8");
const parsed = parseZapataF2k(text);

console.log("Importado desde:", path);
console.log("\nParámetros extraídos:");
console.log("  Lz =", parsed.Lz, "m");
console.log("  Bz =", parsed.Bz, "m");
console.log("  tz =", parsed.tz, "m");
console.log("  bc =", parsed.bc, "m");
console.log("  ks_kNm3 =", parsed.ks_kNm3, "kN/m³");
console.log("  q_adm =", parsed.q_adm, "tonf/m²");
console.log("  ks_factor =", parsed.ks_factor);
console.log("  P_dead_tonf =", parsed.P_dead_tonf, "tonf");
console.log("  P_live_tonf =", parsed.P_live_tonf, "tonf");
console.log("  Mx_dead_tonfm =", parsed.Mx_dead_tonfm, "tonf·m");
console.log("  My_dead_tonfm =", parsed.My_dead_tonfm, "tonf·m");
console.log("  springType =", parsed._springType);
