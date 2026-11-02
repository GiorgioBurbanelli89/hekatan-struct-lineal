/**
 * Exporta una zapata específica a F2K para que el usuario la abra en SAFE.
 * Caso: 1.50 × 1.50 m × 0.30 m, P_dead = 20 tonf, ks típico arena media.
 *
 * Uso: npx tsx test_export_f2k.mjs
 * Output: C:\Users\USUARIO\Documents\Zapata_Hekatan_1.5x1.5.f2k
 */
import { writeFileSync } from "fs";
import { exportZapataF2k } from "./f2kExporter.ts";

const params = {
  Lz: 1.50,           // m
  Bz: 1.50,           // m
  tz: 0.30,           // m (300 mm = 30 cm)
  bc: 0.40,           // m (columna 40 cm cuadrada)
  ks_kNm3: 19613,     // = SAFE 0.000002 tonf/mm/mm (arena media)
  E_concreto_MPa: 24855,  // f'c=4000psi (= F2K user's previous file)
  gamma_concreto: 23.56,  // tonf/m³ × 9.80665 = 24 kN/m³
  P_dead_kN: 20 * 9.80665,    // 20 tonf = 196.13 kN
  P_live_kN: 0,
  Mx_dead_kNm: 0,
  My_dead_kNm: 0,
  nx: 12,             // mesh fino
  ny: 12,
};

const f2k = exportZapataF2k(params);
const path = (process.env.USERPROFILE ?? "") + "\\Documents\\Zapata_Hekatan_1.5x1.5_P20tonf.f2k";
writeFileSync(path, f2k, "utf8");
console.log(`✅ F2K exportado: ${path}`);
console.log(`   ${f2k.length} bytes, ${f2k.split("\n").length} líneas`);
console.log(`\nPreview (primeras 30 líneas):`);
console.log(f2k.split("\n").slice(0, 30).join("\n"));
console.log(`\n... (${f2k.split("\n").length - 30} líneas más) ...`);
console.log(`\nEspecificaciones:`);
console.log(`   Foundation: ${params.Lz} × ${params.Bz} × ${params.tz} m`);
console.log(`   Column:     ${params.bc} × ${params.bc} m`);
console.log(`   ks:         ${params.ks_kNm3} kN/m³ = ${(params.ks_kNm3 / 9.80665).toFixed(2)} tonf/m³`);
console.log(`   P_dead:     ${(params.P_dead_kN / 9.80665).toFixed(2)} tonf = ${params.P_dead_kN.toFixed(2)} kN`);
console.log(`\nAbrilo en SAFE:  File → Import → SAFE Text File... → ${path}`);
