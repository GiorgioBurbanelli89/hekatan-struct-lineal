/**
 * La matriz que ENSEÑA la tarjeta del visor (al pasar por una barra) tiene que ser la que RESUELVE
 * el solver. Si no, el informe enseña una matriz de libro y el programa calcula con otra.
 *
 * El árbitro es el WASM (`deform`, el que da los números del producto), no una fórmula: se arma un
 * voladizo de UNA barra en el espacio, se resuelve con el WASM, y aparte se resuelve el mismo
 * voladizo con la matriz de `kLocalBarra` (la de la tarjeta) girada a ejes globales. Los seis
 * desplazamientos del extremo libre tienen que coincidir.
 *
 * Tres barras: con áreas de cortante y el eje local girado; sin áreas de cortante (el solver pone
 * cinco sextos del área); y una con brazos rígidos con factor de rigidez. Hasta el 27-sep-2026
 * `endOffsets` (rz > 0) estaba en la matriz de TypeScript y no llegaba al WASM (11.4 % en este
 * voladizo); desde entonces el solver los aplica y la tarjeta enseña la matriz con brazos.
 */
import { cargarFem, empaquetar, R } from "../lib/bundle.mjs";

const cargarTarjeta = () =>
  empaquetar(`export * from "${R}/hekatan-ui/src/cad/kLocalBarra";\n`, "kLocalBarra");

/** Resuelve A·x = b (6 × 6) por eliminación con pivote. */
function resolver(A, b) {
  const n = b.length, M = A.map((f, i) => [...f, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) {
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let s = M[r][n];
    for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k];
    x[r] = s / M[r][r];
  }
  return x;
}

const E = 2.0e8, NU = 0.3, G = E / (2 * (1 + NU));
const BASE = { A: 0.0096, I33: 1.2e-4, I22: 2.1e-5, J: 3.4e-6 };
const CARGA = [12, -7, 25, 3, -4, 6];                       // kN y kN·m en el extremo libre

const CASOS = [
  { nombre: "con áreas de cortante y eje girado 30°", nudos: [[0, 0, 0], [3, 2, 1.5]], as: [0.004, 0.006], ang: 30 },
  { nombre: "sin áreas de cortante (5/6·A)", nudos: [[1, 1, 0], [1, 1, 4]], as: null, ang: 0 },
  { nombre: "con brazos rígidos (factor 1)", nudos: [[0, 0, 3], [5, 0, 3]], as: [0.004, 0.006], ang: 0, brazos: [0.2, 0.3, 1] },
];

export const nombre = "k-local-barra";
export const descripcion = "la matriz de la tarjeta del visor = la del solver (voladizo resuelto con las dos)";

export async function correr() {
  {
    const fem = await cargarFem();
    const tj = await cargarTarjeta();
    const filas = [];
    for (const c of CASOS) {
      const m = (v) => new Map([[0, v]]);
      const ei = {
        elasticities: m(E), shearModuli: m(G), areas: m(BASE.A),
        momentsOfInertiaZ: m(BASE.I33), momentsOfInertiaY: m(BASE.I22), torsionalConstants: m(BASE.J),
        localAngles: m(c.ang),
      };
      if (c.as) { ei.shearAreasZ = m(c.as[0]); ei.shearAreasY = m(c.as[1]); }
      if (c.brazos) ei.endOffsets = m(c.brazos);
      const ni = {
        supports: new Map([[0, [true, true, true, true, true, true]]]),
        loads: new Map([[1, CARGA]]),
      };
      const elems = [[0, 1]];
      // 1) el solver de verdad
      const out = fem.deform(c.nudos, elems, ni, ei);
      const uW = out.deformations.get(1);
      // 2) la matriz de la tarjeta, girada a globales, y el mismo voladizo
      const st = { nodes: { val: c.nudos }, elements: { val: elems }, elementInputs: { val: ei } };
      const K = tj.kLocalBarra(st, 0);
      const d = tj.datosBarra(st, 0);
      const T = fem.getTransformationMatrix(c.nudos, c.ang);
      const Kg = Array.from({ length: 12 }, () => new Array(12).fill(0));
      for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) {
        let s = 0;
        for (let a = 0; a < 12; a++) for (let b = 0; b < 12; b++) s += T[a][i] * K[a][b] * T[b][j];
        Kg[i][j] = s;
      }
      const Kff = Kg.slice(6).map((f) => f.slice(6));
      const uT = resolver(Kff, CARGA);
      let peor = 0, mx = 0;
      for (let k = 0; k < 6; k++) { mx = Math.max(mx, Math.abs(uW[k])); peor = Math.max(peor, Math.abs(uW[k] - uT[k])); }
      const dif = (100 * peor) / mx;
      filas.push({ que: `${c.nombre}: desplazamientos tarjeta vs WASM`, medido: dif, limite: 1e-6, ok: dif < 1e-6,
                   detalle: `uz WASM ${uW[2].toExponential(6)} · tarjeta ${uT[2].toExponential(6)} · φ₃ ${d.phi3.toFixed(5)}` });
      const cmp = tj.comprobar(K, d.L);
      filas.push({ que: `${c.nombre}: simétrica y sólido rígido sin fuerza`, medido: Math.max(cmp.asim, cmp.residuo), limite: 1e-9,
                   ok: cmp.simetrica && cmp.rigido, detalle: `asimetría ${cmp.asim.toExponential(2)} · residuo ${cmp.residuo.toExponential(2)}` });
      // la hoja tiene que salir en el lenguaje simple: ni una palabra de LISP crudo
      const hoja = tj.hojaBarra(d, K, tj.elementosDelModelo(st));
      const crudo = /\(defun|\(setq|\(let\b|macrolet|\(car |\(cadr |```/.test(hoja);
      filas.push({ que: `${c.nombre}: la hoja va sin LISP crudo`, medido: crudo ? 1 : 0, limite: 0, ok: !crudo,
                   detalle: `${hoja.split("\n").length} líneas` });
    }
    return filas;
  }
}
