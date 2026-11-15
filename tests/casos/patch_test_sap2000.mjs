/**
 * EL PATCH TEST — Ejemplo 2-001 del manual de verificacion de SAP2000 24
 * (`Manuals\Verification\Analysis\Shells\Problem 2-001.pdf`), que es el de
 * **MacNeal & Harder 1985**.
 *
 * Detalle completo, PNGs del calculo a mano del PDF y los drivers nativos en
 * `validation/02-placas/patch-test-sap2000-2001/`.
 *
 * ## Por que este caso y no otro
 *
 * Los shells se venian comparando contra ETABS. Aqui el arbitro es **teoria
 * publicada** —Timoshenko & Goodier 1951 p.6 y Timoshenko & Woinowsky-Krieger
 * 1959 p.81— y SAP2000 publica su tabla al **0 %** en thin y en thick.
 *
 * Y es EL test del jacobiano: cinco elementos IRREGULARES con un campo de
 * tension CONSTANTE impuesto en el contorno. Un elemento completo lo reproduce
 * EXACTO aunque este distorsionado. Uno que no, **no converge** — y no lo
 * delata ningun banco de malla regular, porque ahi el error vale cero por
 * casualidad geometrica.
 *
 * ## Lo que destapo (31-ago-2026)
 *
 * | formulacion | membrana | flexion ANTES | flexion AHORA |
 * |---|---|---|---|
 * | Shell-Thin (DKQ)    | 4e-14 % | 4e-13 %     | 4e-13 % |
 * | Shell-Thick (MITC4) | 4e-14 % | **276.9 %** | 2e-9 %  |
 *
 * (ese 276.9 % es valor a valor. Aqui el error se mide contra el MAYOR valor
 * del campo —si no, un GDL casi nulo daria un porcentaje enorme sin significar
 * nada— y con esa metrica el bug daba 43.8 %.)
 *
 * Dos bugs, los dos «cartesiano contra natural», los dos invisibles en
 * rectangulo:
 *   A · a los modos incompatibles les faltaba media receta de Taylor 1976, el
 *       factor `detJ0/detJ`. Sin el `∫Ba dA != 0`, que es LA condicion del
 *       patch test de curvatura constante.
 *   B · el MITC4 interpolaba el cortante CARTESIANO en vez del covariante.
 *
 * ## Como se impone el campo
 *
 * `deform` no tiene asientos prescritos, asi que el campo del contorno se mete
 * con el truco del **muelle rigido**: muelle `k` enorme en el GDL mas la fuerza
 * `k·u`. El error que introduce es del orden de `k_elemento/k`, y con
 * `k = 1e8 · k_elemento` queda en ~1e-6 %, cuatro ordenes por debajo del limite
 * que se pide aqui — y ocho por debajo del 277 % que daba el bug.
 *
 * El giro sobre Z queda LIBRE, como en SAP. El modelo es plano: membrana y
 * flexion NO se acoplan y se comprueban por separado.
 *
 * El limite es 0.01 % a proposito: esto no es «aproximar bien», es exacto o
 * mal. Si un dia sube, el elemento dejo de converger con malla real.
 */
import { cargarFem } from "../lib/bundle.mjs";

const E = 1e6, NU = 0.25, T = 0.001;      // lb, in
const XY = [[0, 0], [0, 0.12], [0.04, 0.02], [0.08, 0.08],
            [0.18, 0.03], [0.16, 0.08], [0.24, 0], [0.24, 0.12]];
// conectividad de MacNeal-Harder: 4 elementos de borde + 1 central
const ELEMS = [[1, 0, 2, 3], [0, 6, 4, 2], [6, 7, 5, 4], [7, 1, 3, 5], [2, 4, 5, 3]];
const BORDE = [0, 1, 6, 7];     // nudos 1, 2, 7 y 8 del PDF
const INT = [2, 3, 4, 5];       // nudos 3, 4, 5 y 6 — los que tienen que salir exactos

/** El campo exacto: [Ux, Uy, Uz, Rx, Ry, Rz]. Rx = +dw/dy, Ry = -dw/dx. */
const campo = (x, y) => [
  1e-3 * (x + y / 2),
  1e-3 * (y + x / 2),
  1e-3 * (x * x + x * y + y * y) / 2,
  1e-3 * (x / 2 + y),
  -1e-3 * (x + y / 2),
  0,
];

// Escala de rigidez del problema, para dimensionar el muelle: la membrana va
// como E·t y la flexion como E·t³/L². Se toma la MAYOR y se multiplica por 1e8.
const K_MUELLE = E * T * 1e8;

export const nombre = "patch-test-sap2000";
export const descripcion =
  "Ejemplo 2-001 de SAP2000 (MacNeal & Harder): 5 elementos IRREGULARES, campo exacto";

export async function correr() {
  // ⚠️ `cargarFem()`, no un `empaquetar` propio: el cache de bundle.mjs va por
  // LLAVE, y montar otro entry con la llave "fem" se la pisa a los demas casos
  // (les desaparece `plateQ4Solve` y revientan con "is not a function").
  const { deform } = await cargarFem();

  const nodes = XY.map(([x, y]) => [x, y, 0]);
  const m = (v) => new Map(ELEMS.map((_, k) => [k, v]));

  function resolver(pf, gdls, quietos) {
    const supports = new Map(), loads = new Map(), springs = [];
    for (let n = 0; n < nodes.length; n++) {
      // los GDL que este caso no toca se sujetan (si no, sistema singular).
      // El theta_z (5) se deja LIBRE en los dos casos, como hace SAP.
      const fijo = [false, false, false, false, false, false];
      for (const g of quietos) fijo[g] = true;
      supports.set(n, fijo);
    }
    for (const n of BORDE) {
      const u = campo(...XY[n]);
      const f = [0, 0, 0, 0, 0, 0];
      for (const g of gdls) {
        springs.push({ node: n, dof: g, k: K_MUELLE });
        f[g] = K_MUELLE * u[g];
      }
      loads.set(n, f);
    }
    const d = deform(nodes, ELEMS, { supports, loads },
      { thicknesses: m(T), elasticities: m(E), poissonsRatios: m(NU),
        densities: m(0), plateFormulations: m(pf) }, springs);
    return nodes.map((_, n) => d.deformations?.get(n) ?? null);
  }

  const filas = [];
  const CASOS = [
    // etiqueta, GDL del campo, GDL que se sujetan a cero
    ["membrana", [0, 1], [2, 3, 4]],
    ["flexion",  [2, 3, 4], [0, 1]],
  ];

  const NOMBRES_PF = { 1: "Thin (DKE+ITW)", 6: "DKE libro (Wilson)", 0: "Thick (MITC4)", 4: "DSE (Wilson)", 8: "Thick CSI", 3: "DKMQ (Katili)", 5: "Auricchio-Taylor" };
  // PFS="1,6,0,4,8" corre más formulaciones; sin la variable, las dos de siempre
  const LISTA = process.env.PFS ? process.env.PFS.split(",").map(Number) : [1, 0];
  for (const [etiq, pf] of LISTA.map((q) => [q === 1 ? "Thin (DKQ)" : q === 0 ? "Thick (MITC4)" : NOMBRES_PF[q], q])) {
    for (const [caso, gdls, quietos] of CASOS) {
      const u = resolver(pf, gdls, quietos);
      // El error se mide contra el MAYOR valor del campo en ese GDL, no valor a
      // valor: un GDL casi nulo daria un porcentaje enorme sin significar nada.
      let peor = 0, detalle = "";
      for (const g of gdls) {
        const ref = Math.max(...XY.map(([x, y]) => Math.abs(campo(x, y)[g])));
        for (const n of INT) {
          const exacto = campo(...XY[n])[g];
          const dado = u[n]?.[g];
          if (!Number.isFinite(dado)) { peor = Infinity; detalle = "NaN"; continue; }
          const e = Math.abs(dado - exacto) / ref * 100;
          if (e > peor) {
            peor = e;
            detalle = `nudo ${n + 1} gdl ${g}: ${dado.toExponential(6)}` +
                      ` vs ${exacto.toExponential(6)}`;
          }
        }
      }
      filas.push({
        que: `${etiq} · ${caso}`,
        medido: peor, limite: 0.01, ok: peor <= 0.01,
        detalle: detalle + (etiq.startsWith("Thick") && caso === "flexion"
          ? "   — aqui daba 43.8 % con los dos bugs (277 % medido valor a valor)" : ""),
      });
    }
  }
  return filas;
}
