/**
 * Genera ej6_hekatan.f2k — cimentacion COMPLETA de Guerra Ej.6 (2 zapatas +
 * viga de amarre) usando el MISMO exporter de Hekatan (exportEdificioCimentacionF2k).
 *
 * Replica la logica de zapataVigaAmarre.exportF2k() con los params de Ej.6
 * (guerraEj6.ts overrides + zapataVigaAmarre defaults).
 *
 * Uso: npx tsx gen_ej6_f2k.mjs
 * Salida: validacion/safe-api/ej6_hekatan.f2k
 */
import { writeFileSync } from "fs";
import { exportEdificioCimentacionF2k } from "../shared/f2kCimentacionCompleta.ts";

const TONF_TO_KN = 9.80665;

// ── Params Ej.6 (defaults zapataVigaAmarre + overrides guerraEj6.ts) ──
const p = {
  Lz1: 2.38, Bz1: 3.00,
  Lv: 1.64, Bv: 0.45, Hv: 0.95,
  Lz2: 2.45, Bz2: 2.45,
  tz: 0.55, bc: 0.50, Hp: 0.5,
  ks: 37461,            // kN/m3 (= 3820 tonf/m3)
  // Cargas libro Ej.6 (D y L separadas):
  P1: 70, P1_L: 40, M1x: 0, M1y: 0, M1x_L: 0, M1y_L: 0,
  P2: 89, P2_L: 51, M2x: 0, M2y: -35, M2x_L: 0, M2y_L: 0,
  useDead: 1, useLive: 1,
};

// ── Mismas coordenadas que build()/exportF2k() ──
const { Lz1, Bz1, Lv, Bv, Hv, Lz2, Bz2, tz, bc } = p;
const ks = p.ks;
const yOff2 = (Bz1 - Bz2) / 2;
const xCol1 = bc / 2,             yCol1 = Bz1 / 2;            // col Z1 al lindero
const xCol2 = Lz1 + Lv + Lz2 / 2, yCol2 = Bz2 / 2 + yOff2;   // col Z2 centrada
const xC_Z1 = Lz1 / 2,            yC_Z1 = Bz1 / 2;
const xC_Z2 = Lz1 + Lv + Lz2 / 2, yC_Z2 = yOff2 + Bz2 / 2;

const fD = p.useDead >= 0.5 ? 1 : 0;
const fL = p.useLive >= 0.5 ? 1 : 0;

const zapatas = [
  {
    xC: xC_Z1, yC: yC_Z1, xCol: xCol1, yCol: yCol1,
    Lz: Lz1, Bz: Bz1, tz, bc,
    P_dead_kN: fD * p.P1 * TONF_TO_KN,
    Mx_dead_kNm: fD * p.M1x * TONF_TO_KN,
    My_dead_kNm: fD * p.M1y * TONF_TO_KN,
    P_live_kN: fL * p.P1_L * TONF_TO_KN,
    Mx_live_kNm: fL * p.M1x_L * TONF_TO_KN,
    My_live_kNm: fL * p.M1y_L * TONF_TO_KN,
    label: 1,
  },
  {
    xC: xC_Z2, yC: yC_Z2, xCol: xCol2, yCol: yCol2,
    Lz: Lz2, Bz: Bz2, tz, bc,
    P_dead_kN: fD * p.P2 * TONF_TO_KN,
    Mx_dead_kNm: fD * p.M2x * TONF_TO_KN,
    My_dead_kNm: fD * p.M2y * TONF_TO_KN,
    P_live_kN: fL * p.P2_L * TONF_TO_KN,
    Mx_live_kNm: fL * p.M2x_L * TONF_TO_KN,
    My_live_kNm: fL * p.M2y_L * TONF_TO_KN,
    label: 2,
  },
];

const vigasAmarre = [{
  x1: xCol1, y1: yCol1,
  x2: xCol2, y2: yCol2,
  h: Hv, b: Bv, z: 0,
}];

const f2k = exportEdificioCimentacionF2k({ zapatas, vigasAmarre, ks_kNm3: ks, Z: 0 });

const out = (process.env.USERPROFILE ?? "") + "\\Documents\\Hekatan Calc 1.0.0\\validacion\\safe-api\\ej6_hekatan.f2k";
writeFileSync(out, f2k, "utf8");
console.log("F2K Ej.6 exportado:", out);
console.log("  ", f2k.length, "bytes,", f2k.split("\n").length, "lineas");
console.log("  Z1:", Lz1+"x"+Bz1, "col@("+xCol1.toFixed(2)+","+yCol1.toFixed(2)+") lindero | P="+(p.P1+p.P1_L)+"t");
console.log("  Z2:", Lz2+"x"+Bz2, "col@("+xCol2.toFixed(2)+","+yCol2.toFixed(2)+") centrada | P="+(p.P2+p.P2_L)+"t");
console.log("  Viga amarre:", Bv+"x"+Hv, "de ("+xCol1.toFixed(2)+","+yCol1.toFixed(2)+") a ("+xCol2.toFixed(2)+","+yCol2.toFixed(2)+")");
console.log("  ks =", ks, "kN/m3 =", (ks/TONF_TO_KN).toFixed(0), "tonf/m3");

// Reportar joints para comparacion nodo-a-nodo
const jointLines = f2k.split("\n").filter(l => l.includes("Joint=") && l.includes("GlobalX="));
console.log("\nJoints en el f2k:", jointLines.length);
for (const jl of jointLines.slice(0, 30)) {
  const m = jl.match(/Joint=(\S+)\s+GlobalX=(\S+)\s+GlobalY=(\S+)\s+GlobalZ=(\S+)/);
  if (m) console.log("  J"+m[1], "("+m[2]+", "+m[3]+", "+m[4]+")");
}
