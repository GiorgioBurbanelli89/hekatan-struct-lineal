/**
 * BRAZOS RÍGIDOS (end length offsets de CSI) en el SOLVER: el WASM contra ETABS.
 *
 * Hasta el 27-sep-2026 la ley estaba en TypeScript y en Python pero NO en el C++: `deform` (el
 * solver del producto) resolvía la barra sin brazos y `analyze` recuperaba esfuerzos con ellos.
 *
 * Árbitro: ETABS 22.6 (`hekatan-struct-py/tests/ref_end_offsets_etabs.json`, sacado por OAPI con
 * `galpon-bodega-electoral/ref_end_offsets_etabs.py`). Dos voladizos de 6 m, offset de 1 m una vez
 * en el empotrado (caso I: mide la longitud flexible) y otra en el libre (caso J: mide el brazo y
 * su signo), con RZ = 0 … 1.
 *
 *   flecha (P)   → cambia con RZ
 *   axil (N)     → NO cambia: «The rigid zones never affect axial and torsional deformations»
 *   torsión (T)  → NO cambia
 *
 * Y una fila más por caso: la matriz local de TypeScript (la de `analyze` y la de la tarjeta del
 * visor) resuelve el mismo voladizo igual que el WASM. Dos motores, una sola barra.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cargarFem } from "../lib/bundle.mjs";
import { RAIZ } from "../lib/wasm.mjs";

const REF = JSON.parse(readFileSync(join(RAIZ, "hekatan-struct-py/tests/ref_end_offsets_etabs.json"), "utf-8"));
const { L, P, N, T, b, h, E, nu } = REF;
const G = E / (2 * (1 + nu));
const A = b * h, I33 = (b * h ** 3) / 12, I22 = (h * b ** 3) / 12;
// J no se mide aquí (se mide que la torsión NO cambia con RZ): el que cuadra ETABS en RZ = 0
const J = (T * L) / (G * REF.casos[0].rx);

function resolver(Am, bv) {
  const n = bv.length, M = Am.map((f, i) => [...f, bv[i]]);
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

export const nombre = "brazos-rigidos-etabs";
export const descripcion = "end length offsets en el WASM: voladizos contra ETABS 22.6 (RZ 0…1) y TS = WASM";

export async function correr() {
  const fem = await cargarFem();
  const filas = [];
  const nudos = [[0, 0, 0], [L, 0, 0]];
  const elems = [[0, 1]];
  const m = (v) => new Map([[0, v]]);
  const dif = (a, r) => (100 * Math.abs(a - r)) / Math.abs(r);

  for (const c of REF.casos) {
    const ei = {
      elasticities: m(E), shearModuli: m(G), areas: m(A), poissonsRatios: m(nu),
      momentsOfInertiaZ: m(I33), momentsOfInertiaY: m(I22), torsionalConstants: m(J),
      endOffsets: m([c.offI, c.offJ, c.rz]),
    };
    const con = (carga) => fem.deform(nudos, elems, {
      supports: new Map([[0, [true, true, true, true, true, true]]]),
      loads: new Map([[1, carga]]),
    }, ei).deformations.get(1);

    const et = `caso ${c.caso} RZ=${c.rz}`;
    const uz = con([0, 0, -P, 0, 0, 0])[2];
    filas.push({ que: `${et}: flecha WASM vs ETABS`, medido: dif(uz, c.uz), limite: 0.05, ok: dif(uz, c.uz) < 0.05,
                 detalle: `WASM ${uz.toFixed(7)} · ETABS ${c.uz.toFixed(7)}` });
    const ux = con([N, 0, 0, 0, 0, 0])[0];
    const rx = con([0, 0, 0, T, 0, 0])[3];
    const dAT = Math.max(dif(ux, c.ux), dif(rx, c.rx));
    filas.push({ que: `${et}: axil y torsión no cambian`, medido: dAT, limite: 0.05, ok: dAT < 0.05,
                 detalle: `ux ${ux.toExponential(6)} · rx ${rx.toExponential(6)}` });

    // TS (analyze, tarjeta del visor) = WASM: el mismo voladizo con la K local de TypeScript
    const carga = [12, -7, 25, 3, -4, 6];
    const uW = con(carga);
    const K = fem.getLocalStiffnessMatrix(nudos, ei, 0);
    const Tm = fem.getTransformationMatrix(nudos, 0);
    const Kg = Array.from({ length: 12 }, () => new Array(12).fill(0));
    for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) {
      let s = 0;
      for (let a = 0; a < 12; a++) for (let d = 0; d < 12; d++) s += Tm[a][i] * K[a][d] * Tm[d][j];
      Kg[i][j] = s;
    }
    const uT = resolver(Kg.slice(6).map((f) => f.slice(6)), carga);
    let peor = 0, mx = 0;
    for (let k = 0; k < 6; k++) { mx = Math.max(mx, Math.abs(uW[k])); peor = Math.max(peor, Math.abs(uW[k] - uT[k])); }
    filas.push({ que: `${et}: K local de TypeScript = WASM`, medido: (100 * peor) / mx, limite: 1e-6, ok: (100 * peor) / mx < 1e-6,
                 detalle: `uz WASM ${uW[2].toExponential(6)} · TS ${uT[2].toExponential(6)}` });
  }

  // Sin brazos (SAP2000, o ETABS con RZ = 0): la barra de siempre, con y sin la entrada
  {
    const base = {
      elasticities: m(E), shearModuli: m(G), areas: m(A), poissonsRatios: m(nu),
      momentsOfInertiaZ: m(I33), momentsOfInertiaY: m(I22), torsionalConstants: m(J),
    };
    const ni = { supports: new Map([[0, [true, true, true, true, true, true]]]), loads: new Map([[1, [0, 0, -P, 0, 0, 0]]]) };
    const sin = fem.deform(nudos, elems, ni, base).deformations.get(1)[2];
    const rz0 = fem.deform(nudos, elems, ni, { ...base, endOffsets: m([1, 1, 0]) }).deformations.get(1)[2];
    filas.push({ que: "RZ = 0 es la barra sin brazos", medido: dif(rz0, sin), limite: 1e-10, ok: dif(rz0, sin) < 1e-10,
                 detalle: `sin brazos ${sin.toFixed(9)} · offsets con RZ=0 ${rz0.toFixed(9)}` });
  }
  return filas;
}
