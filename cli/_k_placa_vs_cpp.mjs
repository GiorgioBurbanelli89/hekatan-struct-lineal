/**
 * LA K DE LA PLACA: lo que enseña la web contra lo que ensambla el C++.
 *
 * `csiThickBendingK` (flexión Shell-Thick de CSI, 12×12 condensada) y `itwMembraneK`
 * (membrana tipo 12, 12×12 con la burbuja condensada) son los DOS bloques con los que
 * el motor resuelve una cáscara. El árbitro es `kelem_native`, compilado de los MISMOS
 * .cpp que el WASM: si la web enseña otra matriz, enseña una mentira bonita.
 *
 * ⚠️ El .exe se compila de los fuentes de HEAD a propósito: en el árbol de trabajo hay
 * cambios de otra sesión en shellQ4.cpp (drilling 13) y compilarlos daría un oráculo
 * que no es el del producto.
 *
 *   node cli/_k_placa_vs_cpp.mjs [ruta_del_exe]
 */
import { execFileSync } from "node:child_process";
import { empaquetar, R } from "../tests/lib/bundle.mjs";

const EXE = process.argv[2] ??
  "C:/Users/j-b-j/AppData/Local/Temp/claude/C--Users-j-b-j-Documents-Hekatan-Calc-1-0-0/0b066724-4b75-4ae2-81b1-6fb8f3dc4300/scratchpad/kelem/kelem_head.exe";

const mod = await empaquetar(
  `export { kPanoQ4 } from "${R}/hekatan-fem/src/utils/shellElementK";
`, "kplaca");

// gdl del C++: por nudo [ux uy uz rx ry rz]
const gMembrana = [], gFlexion = [];
for (let n = 0; n < 4; n++) {
  gMembrana.push(6 * n + 0, 6 * n + 1, 6 * n + 5);   // u, v, θz
  gFlexion.push(6 * n + 2, 6 * n + 3, 6 * n + 4);    // w, θx, θy
}

const casos = [
  { n: "cuadrado 1×1 t=0.20", P: [0,0,0, 1,0,0, 1,1,0, 0,1,0], E: 2.2e7, nu: 0.2, t: 0.20 },
  { n: "rectángulo 3×1.5",    P: [0,0,0, 3,0,0, 3,1.5,0, 0,1.5,0], E: 2.5e7, nu: 0.15, t: 0.15 },
  { n: "trapecio",            P: [0,0,0, 4,0,0, 3.2,2.5,0, 0.6,2.2,0], E: 2.1e7, nu: 0.25, t: 0.30 },
  { n: "paño inclinado 3D",   P: [0,0,0, 3,0,0.8, 3,2,0.8, 0,2,0], E: 2.2e7, nu: 0.2, t: 0.12 },
  { n: "cuadrado THIN (DKQ)", P: [0,0,0, 1,0,0, 1,1,0, 0,1,0], E: 2.2e7, nu: 0.2, t: 0.20, thin: true },
  { n: "trapecio THIN (DKQ)", P: [0,0,0, 4,0,0, 3.2,2.5,0, 0.6,2.2,0], E: 2.1e7, nu: 0.25, t: 0.30, thin: true },
];
let peor = 0, fallos = 0;
for (const c of casos) {
  const salida = execFileSync(EXE, [...c.P.map(String), String(c.E), String(c.nu), String(c.t), "12", "0.4", c.thin ? "1" : "0"], { encoding: "utf-8" });
  const Kcpp = salida.trim().split("\n").map((l) => l.trim().split(/\s+/).map(Number));
  const P4 = [0, 1, 2, 3].map((i) => [c.P[3 * i], c.P[3 * i + 1], c.P[3 * i + 2]]);
  const r = mod.kPanoQ4(P4, c.E, c.nu, c.t, { tipoPlaca: c.thin ? 1 : 0, tipoDrill: 12 });
  const Kf = r.flexion, Km = r.membrana;
  for (const [nombre, Kts, idx] of [["flexión", Kf, gFlexion], ["membrana", Km, gMembrana]]) {
    let maxAbs = 0, dif = 0;
    for (let a = 0; a < 12; a++) for (let b = 0; b < 12; b++) {
      const ref = Kcpp[idx[a]][idx[b]];
      maxAbs = Math.max(maxAbs, Math.abs(ref));
      dif = Math.max(dif, Math.abs(Kts[a][b] - ref));
    }
    const rel = (dif / maxAbs) * 100;
    peor = Math.max(peor, rel);
    const ok = rel < 1e-8;
    if (!ok) fallos++;
    console.log(`  ${ok ? "OK  " : "--  "} ${c.n} · ${nombre}: ${rel.toExponential(2)} % del término mayor`);
  }
}
console.log(`\npeor: ${peor.toExponential(2)} %  ${fallos ? fallos + " FALLO(S)" : "— la web enseña la K del motor"}`);
process.exit(fallos ? 1 : 0);
