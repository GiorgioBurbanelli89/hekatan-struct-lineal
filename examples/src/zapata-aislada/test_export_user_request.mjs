/**
 * Genera F2K para zapata 1.5×1.5 con P=20 tonf, Mx=My=0.5 tonf·m, q_adm=10 tonf/m².
 * Triple export: Bowles / Vesic / Placa de carga — para comparación.
 */
import { writeFileSync } from "fs";
import { exportZapataF2k } from "./f2kExporter.ts";

const TONF_TO_KN = 9.80665;

// Params
const Lz = 1.50, Bz = 1.50, tz = 0.30, bc = 0.40;
const q_adm_tonf = 10;
const P_tonf = 20, Mx_tonfm = 0.5, My_tonfm = 0.5;

// ── Calcular ks por los 3 métodos ──
// 1. Bowles
const ks_bowles = q_adm_tonf * TONF_TO_KN * 10.5;  // factor 10.5 (Custom)

// 2. Vesic 1973
const Ec = 25e6;  // kN/m² (concreto)
const E_s = 25000;  // kN/m² (arena media típica)
const nu_s = 0.30;
const I_c = tz ** 3 / 12;
const ratio = (E_s * Lz ** 4) / (Ec * I_c);
const ks_vesic = 0.65 * Math.pow(ratio, 1/12) * E_s / (Lz * (1 - nu_s**2));

// 3. Placa de carga (placa 30cm, q=5 tonf/m², δ=5mm, granular)
const Bp = 0.30;
const ks_p = (5 * TONF_TO_KN) / (5/1000);
const ks_plate = ks_p * Math.pow((Lz + Bp)/(2*Lz), 2);

console.log(`Comparación ks para zapata ${Lz}×${Bz}m, q_adm=${q_adm_tonf} tonf/m²:`);
console.log(`  Bowles 1996:    ${ks_bowles.toFixed(0)} kN/m/m²  =  ${(ks_bowles/TONF_TO_KN).toFixed(2)} tonf/m/m²`);
console.log(`  Vesic 1973:     ${ks_vesic.toFixed(0)} kN/m/m²  =  ${(ks_vesic/TONF_TO_KN).toFixed(2)} tonf/m/m²`);
console.log(`  Placa de carga: ${ks_plate.toFixed(0)} kN/m/m²  =  ${(ks_plate/TONF_TO_KN).toFixed(2)} tonf/m/m²`);

// Exportar 3 F2Ks separados
const baseData = {
  Lz, Bz, tz, bc,
  P_dead_kN: P_tonf * TONF_TO_KN,
  P_live_kN: 0,
  Mx_dead_kNm: Mx_tonfm * TONF_TO_KN,
  My_dead_kNm: My_tonfm * TONF_TO_KN,
};

const exportPairs = [
  ["Bowles",       ks_bowles],
  ["Vesic",        ks_vesic],
  ["PlacaDeCarga", ks_plate],
];

for (const [name, ks] of exportPairs) {
  const text = exportZapataF2k({ ...baseData, ks_kNm3: ks });
  const path = `${process.env.USERPROFILE}\\Documents\\Zapata_Hekatan_1.5x1.5_P20_Mx05_My05_${name}.f2k`;
  writeFileSync(path, text, "utf8");
  console.log(`✓ Generado: ${path}`);
}
