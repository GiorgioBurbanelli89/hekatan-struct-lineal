/**
 * La matriz que ENSEÑA la tarjeta del visor al pasar por un paño tiene que ser la que RESUELVE el
 * solver. Mismo árbitro que la barra (`k_local_barra.mjs`): el WASM (`deform`), no una fórmula.
 *
 * Un paño suelto en voladizo (dos nudos empotrados, los otros cargados en sus seis gdl) se resuelve
 * con el WASM y, aparte, con la matriz de `kLocalPano` (flexión + membrana en los ejes del elemento)
 * girada a globales: K = Tᵀ·K_local·T. Los desplazamientos de los nudos libres tienen que coincidir.
 *
 * Tipos: Shell-Thick (defecto, MITC4 leída del motor), Shell-Thin (DKQ armada en TypeScript), un
 * trapecio inclinado en 3D y un triángulo Thick. Y el símbolo de la hoja: las D en letras con los
 * números de este paño tienen que dar las D del C++ (shellQ4.cpp: t³/12, 5/6·G·t).
 */
import { cargarFem, empaquetar, R } from "../lib/bundle.mjs";

const cargarPano = () =>
  empaquetar(`export * from "${R}/hekatan-ui/src/cad/kLocalPano";\n`, "kLocalPano");

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

const CASOS = [
  { nombre: "Shell-Thick, trapecio horizontal", P: [[0, 0, 0], [4, 0, 0], [3.2, 2.5, 0], [0.6, 2.2, 0]], tipo: 0, fijos: [0, 3] },
  { nombre: "Shell-Thin (DKQ), trapecio horizontal", P: [[0, 0, 0], [4, 0, 0], [3.2, 2.5, 0], [0.6, 2.2, 0]], tipo: 1, fijos: [0, 3] },
  { nombre: "Shell-Thick, paño inclinado en 3D", P: [[0, 0, 0], [3, 0, 0.8], [3, 2, 0.8], [0, 2, 0]], tipo: 0, fijos: [0, 3] },
  { nombre: "Shell-Thick, muro vertical", P: [[0, 0, 0], [3, 0, 0], [3, 0, 2.5], [0, 0, 2.5]], tipo: 0, fijos: [0, 1] },
  // ⚠️ Con UN solo nudo fijo el triángulo no se puede comparar: su placa tiene un modo de energía
  // nula de más (29-sep-2026: 4 autovalores a 1e-16 en todas las geometrías y espesores,
  // `cli/_t3_modos_nulos.mjs`), el sistema queda singular y cada solución es una cualquiera (75 %).
  // Con dos nudos fijos el mecanismo queda atado y la tarjeta = WASM a 1e-12 %.
  { nombre: "Shell-Thick, triángulo", P: [[0, 0, 0], [2, 0, 0], [0.5, 1.5, 0]], tipo: 0, fijos: [0, 1], mecanismo: true },
];
const E = 2.2e7, NU = 0.2, T = 0.2;
const CARGA = [15, -8, 20, 3, -4, 2.5];

export const nombre = "k-local-pano";
export const descripcion = "la matriz del paño que enseña la tarjeta = la del solver (paño en voladizo resuelto con las dos)";

export async function correr() {
  const fem = await cargarFem();
  const pn = await cargarPano();
  const filas = [];
  for (const c of CASOS) {
    const n = c.P.length;
    const m = (v) => new Map([[0, v]]);
    const ei = { elasticities: m(E), thicknesses: m(T), poissonsRatios: m(NU), shearModuli: m(E / (2 * (1 + NU))) };
    if (c.tipo === 1) ei.plateFormulations = m(1);
    const sup = new Map(c.fijos.map((i) => [i, [true, true, true, true, true, true]]));
    const libres = c.P.map((_, i) => i).filter((i) => !c.fijos.includes(i));
    const ni = { supports: sup, loads: new Map(libres.map((i) => [i, CARGA])) };
    // 1) el solver
    const out = fem.deform(c.P, [c.P.map((_, i) => i)], ni, ei);
    // 2) la tarjeta
    const st = { nodes: { val: c.P }, elements: { val: [c.P.map((_, i) => i)] }, elementInputs: { val: ei } };
    const d = pn.datosPano(st, 0);
    const K = d ? pn.kPano6(d.k) : null;
    if (!K) { filas.push({ crudo: true, que: c.nombre, medido: "sin matriz", limite: "matriz", ok: false, detalle: d?.k?.aviso ?? "datosPano = null" }); continue; }
    const L = [d.k.ex, d.k.ey, d.k.ez];                      // filas = ejes locales en globales
    const N = 6 * n;
    const Tm = Array.from({ length: N }, () => new Array(N).fill(0));
    for (let b = 0; b < 2 * n; b++) for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) Tm[3 * b + i][3 * b + j] = L[i][j];
    const KT = K.map((f) => Tm[0].map((_, j) => f.reduce((s, v, k) => s + v * Tm[k][j], 0)));   // K·T
    const Kg = Tm[0].map((_, i) => Tm[0].map((__, j) => Tm.reduce((s, f, k) => s + f[i] * KT[k][j], 0)));  // Tᵀ·K·T
    const gl = libres.flatMap((i) => [0, 1, 2, 3, 4, 5].map((k) => 6 * i + k));
    const u = resolver(gl.map((a) => gl.map((b) => Kg[a][b])), gl.map(() => 0).map((_, q) => CARGA[gl[q] % 6]));
    let peor = 0, mx = 0;
    gl.forEach((g, q) => {
      const w = out.deformations.get(Math.floor(g / 6))[g % 6];
      mx = Math.max(mx, Math.abs(w));
      peor = Math.max(peor, Math.abs(u[q] - w));
    });
    const rel = peor / mx;
    filas.push({ crudo: true, que: `${c.nombre}: desplazamientos, tarjeta vs WASM`, medido: `${(rel * 100).toExponential(2)} %`,
      limite: "1e-6 %", ok: rel < 1e-8, detalle: `${d.k.formulacion}` });
    const cp = pn.comprobarPano(d.k);
    // En ROJO a propósito en el triángulo Thick: es un defecto del SOLVER (su placa tiene un
    // mecanismo), no de la tarjeta, y arreglarlo cambia el modelo: decide Jorge. La tarjeta lo dice.
    filas.push({ crudo: true, que: `${c.nombre}: simétrica y 3 + 3 modos nulos`, medido: `${cp.simetrica ? "sí" : "no"} · ${cp.nulosFlexion} + ${cp.nulosMembrana}`,
      limite: "sí · 3 + 3", ok: cp.simetrica && cp.nulosFlexion === 3 && cp.nulosMembrana === 3,
      detalle: c.mecanismo ? "defecto del solver: la placa gruesa triangular tiene un modo de energía nula de más" : "" });
    // la hoja se arma sin reventar y lleva sus secciones
    const h = pn.hojaPano(d);
    const okHoja = /D_b = E\*t\^3/.test(h) && /## 7/.test(h) && !/NaN|undefined|e[+-]\d/.test(h.replace(/^#.*$/gm, ""));
    filas.push({ crudo: true, que: `${c.nombre}: hoja LISP (letras + números, sin notación científica)`, medido: okHoja ? "bien" : "mal",
      limite: "bien", ok: okHoja, detalle: "" });
  }
  // tipos que el motor resuelve pero no se pueden leer todavía: la tarjeta lo DICE, no enseña otra
  for (const tp of [3, 4]) {
    const m = (v) => new Map([[0, v]]);
    const P = CASOS[0].P;
    const st = { nodes: { val: P }, elements: { val: [[0, 1, 2, 3]] }, elementInputs: { val: {
      elasticities: m(E), thicknesses: m(T), poissonsRatios: m(NU), plateFormulations: m(tp) } } };
    const d = pn.datosPano(st, 0);
    filas.push({ crudo: true, que: `placa tipo ${tp}: sin matriz inventada`, medido: d?.k?.flexion === null ? "avisa" : "enseña algo",
      limite: "avisa", ok: d?.k?.flexion === null && /no disponible/.test(d?.k?.aviso ?? ""), detalle: d?.k?.aviso ?? "" });
  }
  return filas;
}
