/**
 * La MEMBRANA de Shell-Thin y la de Shell-Thick tienen que ser LA MISMA.
 *
 * En ETABS, thin/thick cambia la FLEXION (si se tiene en cuenta el cortante
 * transversal), no el comportamiento en el plano. Medido en ETABS con una
 * celda de 1x1 m y los tres grados del plano libres (`shell_una_celda2.py 1
 * plano` y `... 2 plano`), ETABS da EXACTAMENTE los mismos numeros para las dos:
 *
 *     U1 1.353869e-06   U2 9.019470e-07   R3 1.548840e-05
 *
 * En Hekatan no era asi. `shellQ4.cpp` (Shell-Thick) tiene la membrana con
 * MODOS INCOMPATIBLES de Wilson 1971 + la correccion de Taylor 1976, y
 * `shellThin.cpp` (Shell-Thin) tenia su propio Q4 bilineal. Un Q4 bilineal se
 * atasca en flexion EN EL PLANO (shear locking) y sale demasiado rigido:
 *
 *     grado   ETABS          Shell-Thin      Shell-Thick
 *     U1      1.353869e-06   -21.7 %         -8.0 %
 *     U2      9.019470e-07   -25.8 %         -4.6 %
 *
 * El arbitro de aqui NO es ETABS sino la propia coherencia del motor mas la
 * viga en voladizo, que tiene solucion cerrada. Se modela un muro en voladizo
 * de 1 m de ancho y 4 m de alto con 4 cascaras, cargado EN SU PLANO en la
 * punta: eso es flexion en el plano pura, el caso donde el locking pega.
 *
 *     d = P*H^3/(3*E*I) + P*H/(G*A_c)      I = t*b^3/12,  A_c = (5/6)*t*b
 *
 * Con 4 elementos un Q4 bilineal se queda MUY corto; con modos incompatibles
 * llega. Por eso el limite del voladizo es holgado (15 %) y el de la
 * coherencia thin/thick es cerrado (0.01 %): lo que se vigila es que nadie
 * vuelva a darle a Shell-Thin una membrana distinta.
 */
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolverHeks } from "../lib/heks.mjs";

const B = 1.0;            // m, ancho del muro (en X)
const H = 4.0;            // m, alto (en Z)
const T = 0.20;           // m, espesor
const N = 4;              // cascaras en altura
const E = 2.2e7;          // kPa
const NU = 0.20;
const P = 100;            // kN en la punta, EN EL PLANO del muro (direccion X)

/**
 * Muro en el plano XZ: dos columnas de nudos (x = 0 y x = B), N+1 filas.
 * Nudo (fila i, columna j) → id = 2*i + j + 1.
 */
function guion(tipo) {
  const l = [];
  for (let i = 0; i <= N; i++) {
    const z = (i * H) / N;
    l.push(`node ${2 * i + 1} 0 0 ${z}`);
    l.push(`node ${2 * i + 2} ${B} 0 ${z}`);
  }
  l.push("support 1 fixed");
  l.push("support 2 fixed");
  // Fuera de su plano el muro es un mecanismo (una sola fila de cascaras no
  // sujeta Uy ni los giros de eje X/Z): se atan para que el problema sea
  // exactamente el del plano y no haya que apoyarse en el drilling.
  for (let i = 1; i <= N; i++) {
    l.push(`support ${2 * i + 1} 0 1 0 1 0 0`);
    l.push(`support ${2 * i + 2} 0 1 0 1 0 0`);
  }
  for (let i = 0; i < N; i++) {
    const n1 = 2 * i + 1, n2 = 2 * i + 2, n3 = 2 * i + 4, n4 = 2 * i + 3;
    l.push(`shell ${i + 1} ${n1} ${n2} ${n3} ${n4} ${T} ${E} ${NU} 2.4`);
    if (tipo) l.push(`shelltype ${i + 1} ${tipo}`);
  }
  // Media carga en cada nudo de la punta, en X (el plano del muro)
  l.push(`load ${2 * N + 1} ${P / 2} 0 0`);
  l.push(`load ${2 * N + 2} ${P / 2} 0 0`);
  l.push("solve");
  return l.join("\n") + "\n";
}

/** Desplazamiento en X de la punta, en metros. */
async function puntaUx(dir, tipo, nombre) {
  const ruta = join(dir, `${nombre}.heks`);
  writeFileSync(ruta, guion(tipo), "utf-8");
  const r = await resolverHeks(ruta);
  const a = r.deformOutputs?.deformations?.get?.(2 * N);       // nudo 2N+1
  const b = r.deformOutputs?.deformations?.get?.(2 * N + 1);   // nudo 2N+2
  if (!a || !b) return NaN;
  return (a[0] + b[0]) / 2;
}

export const nombre = "membrana-thin-thick";
export const descripcion =
  "La membrana de Shell-Thin tiene que ser la misma que la de Shell-Thick (modos incompatibles)";

export async function correr() {
  const dir = mkdtempSync(join(tmpdir(), "hkMembrana-"));
  const filas = [];

  const uThin = await puntaUx(dir, "thin", "muro_thin");
  const uThick = await puntaUx(dir, "thick", "muro_thick");
  const uDefecto = await puntaUx(dir, null, "muro_defecto");

  const I = (T * B ** 3) / 12;
  const G = E / (2 * (1 + NU));
  const Ac = (5 / 6) * T * B;
  const teo = (P * H ** 3) / (3 * E * I) + (P * H) / (G * Ac);

  // 1) EL invariante: thin y thick tienen que coincidir en el plano.
  //    Con el Q4 bilineal de antes, Shell-Thin salia ~15 % mas rigido aqui.
  const dTT = (100 * (uThin - uThick)) / uThick;
  filas.push({
    que: "Shell-Thin = Shell-Thick en su plano",
    medido: Number.isFinite(dTT) ? dTT : 1e9, limite: 0.01,
    ok: Number.isFinite(dTT) && Math.abs(dTT) <= 0.01,
    detalle: `${(uThin * 1000).toFixed(5)} mm vs ${(uThick * 1000).toFixed(5)} mm`,
  });

  // 2) control: el defecto (sin `shelltype`) tambien.
  const dDT = (100 * (uDefecto - uThick)) / uThick;
  filas.push({
    que: "sin 'shelltype' = Shell-Thick",
    medido: Number.isFinite(dDT) ? dDT : 1e9, limite: 0.01,
    ok: Number.isFinite(dDT) && Math.abs(dDT) <= 0.01,
    detalle: `${(uDefecto * 1000).toFixed(5)} mm vs ${(uThick * 1000).toFixed(5)} mm`,
  });

  // 3) y que el voladizo se parezca a la formula: si alguien quita los modos
  //    incompatibles a los DOS a la vez, el punto 1 seguiria pasando y este no.
  const dTeo = (100 * (uThin - teo)) / teo;
  filas.push({
    que: "voladizo en su plano vs PH^3/3EI + PH/GAc",
    medido: Number.isFinite(dTeo) ? dTeo : 1e9, limite: 15.0,
    ok: Number.isFinite(dTeo) && Math.abs(dTeo) <= 15.0,
    detalle: `${(uThin * 1000).toFixed(5)} mm vs ${(teo * 1000).toFixed(5)} (${N} cascaras)`,
  });

  return filas;
}
