/**
 * INTERPOLACION TRANSFINITA (parche de Coons) en el automallado de Hekatan.
 *
 * Que se comprueba, y por que:
 *
 *  (a) EQUIVALENCIA CON LA BILINEAL. Con los cuatro bordes RECTOS la transfinita
 *      P(u,v) = (1-v)Cb(u) + v·Ct(u) + (1-u)Dl(v) + u·Dr(v) - bilineal(esquinas)
 *      se reduce EXACTAMENTE a la bilineal de las 4 esquinas (los dos primeros términos valen
 *      cada uno la bilineal, y el tercero la resta una vez). Eso es lo que explica que el
 *      automallado de Hekatan —bilineal— ya casara nudo a nudo con el de ETABS, que usa
 *      `transfinite_interpolation()` (medido en su binario el 17-sep-2026). Se comprueba a nivel
 *      de fórmula y de extremo a extremo (misma malla con y sin la directiva).
 *
 *  (b) BORDE CURVO. Lo que la transfinita añade: si un borde es un arco, los nudos caen SOBRE el
 *      arco y no sobre la cuerda. Juez: la geometría exacta del cilindro (radio constante), que
 *      es matemática, no un número heredado. Se mide además cuánto se equivocaba la bilineal.
 *
 *  (c) MALLA SANA. Ningún elemento invertido ni degenerado: el jacobiano del mapa bilineal de
 *      cada celda, evaluado en sus 4 esquinas, positivo y con poca dispersión.
 *
 *  (d) SUELO INCLINADO. La regla medida en el binario de ETABS: «Inclined floors use the no auto
 *      meshing option ... and remain as a single element». En Hekatan es una OPCION explícita
 *      (`automesh <tam> noinclinados`); el defecto no cambia.
 *
 * REFERENCIAS de la fórmula (matemática pública, implementación propia):
 *   Coons (1967), MIT MAC-TR-41 · Gordon (1971), SIAM J. Numer. Anal. 8(1).
 *
 * VALIDACION CONTRA SAP2000: ver el informe. Hoy NO hay en `validation/` ninguna medición de
 * SAP2000 de un paño automallado con borde curvo (SAP2000 no automalla arcos: sus áreas son
 * polígonos), así que este caso NO inventa una referencia — juzga con la geometría exacta del
 * arco y deja el contraste con SAP2000 apuntado en la bitácora.
 */
import { writeFileSync, existsSync, readFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolverHeks } from "../lib/heks.mjs";
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "automesh-transfinito";
export const descripcion = "interpolación transfinita (Coons/Gordon): = bilineal en paño recto, y nudos sobre el arco en paño curvo";

const DIR = mkdtempSync(join(tmpdir(), "hkTest-transf-"));
const escribir = (nombre, txt) => { const p = join(DIR, nombre); writeFileSync(p, txt, "utf-8"); return p; };

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const punt = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const mod = (a) => Math.hypot(a[0], a[1], a[2]);

// ── el paño curvo del ensayo: bóveda cilíndrica de LUZ 20 m y FLECHA 2.5 m ────────────────────
// (las medidas del galpón curvo del repo, `cli/shots/galpones/galpon_curvo.heks`)
// Radio del círculo por (0,7)-(10,9.5)-(20,7):  R = (L²/4 + f²) / (2f)
const LUZ = 20, FLECHA = 2.5, Z0 = 7, ANCHO = 6;
const RAD = (LUZ * LUZ / 4 + FLECHA * FLECHA) / (2 * FLECHA);     // 21.25 m
const YC = LUZ / 2, ZC = Z0 + FLECHA - RAD;                        // eje del cilindro

/** Jacobiano del mapa bilineal de una celda Q4 en sus 4 esquinas, con el signo de su normal. */
function jacobianos(c) {
  const n = cruz(sub(c[2], c[0]), sub(c[3], c[1]));
  const L = mod(n); const N = [n[0] / L, n[1] / L, n[2] / L];
  const out = [];
  for (const [u, v] of [[0, 0], [1, 0], [1, 1], [0, 1]]) {
    const du = [0, 1, 2].map(k => (1 - v) * (c[1][k] - c[0][k]) + v * (c[2][k] - c[3][k]));
    const dv = [0, 1, 2].map(k => (1 - u) * (c[3][k] - c[0][k]) + u * (c[2][k] - c[1][k]));
    out.push(punt(cruz(du, dv), N));
  }
  return out;
}

/** Paño plano de 6×5 m con las 4 esquinas dadas (alabeado a propósito en el caso (a)). */
const panoRecto = (Q, extra = "") =>
  Q.map((p, i) => `node ${i + 1} ${p.join(" ")}`).join("\n") +
  `\nshell 1 1 2 3 4 0.2 25e6\n${extra}automesh 1.25\n`;

export async function correr() {
  const filas = [];

  // ── (a1) la FORMULA: transfinita con 4 bordes rectos == bilineal, a precisión de máquina ────
  const T = await empaquetar(`export * from "${R}/examples/src/cli-modeler/transfinito";\n`, "transfinito");
  // un cuadrilátero ALABEADO (las 4 esquinas no coplanarias) y con lados desiguales: el caso
  // más duro para que las dos fórmulas coincidan por casualidad
  const Q = [[0, 0, 0], [6.3, 0.4, 0], [5.9, 4.8, 1.7], [-0.2, 5.1, 0.9]];
  const B = {
    Cb: T.recta(Q[0], Q[1]), Dr: T.recta(Q[1], Q[2]),
    Ct: T.recta(Q[3], Q[2]), Dl: T.recta(Q[0], Q[3]),
  };
  let peorF = 0;
  for (let i = 0; i <= 40; i++) for (let j = 0; j <= 40; j++) {
    const u = i / 40, v = j / 40;
    const a = T.transfinita(B, Q, u, v), b = T.bilineal(Q, u, v);
    for (let k = 0; k < 3; k++) peorF = Math.max(peorF, Math.abs(a[k] - b[k]));
  }
  filas.push({ que: "(a) fórmula: transfinita = bilineal", medido: peorF.toExponential(2),
               limite: "< 1e-12 m", ok: peorF < 1e-12, crudo: true,
               detalle: `4 bordes rectos, 1681 puntos (u,v) en un cuadrilátero alabeado` });

  // ── (a2) de extremo a extremo: la MISMA malla con y sin pasar por la transfinita ────────────
  // `arco` con un punto COLINEAL: no hay círculo, la curva del borde es la recta, pero el
  // automallado SI entra por el camino transfinito. Si las dos fórmulas son la misma, la malla
  // tiene que salir idéntica.
  const Qr = [[0, 0, 0], [6, 0, 0], [6, 5, 0], [0, 5, 0]];
  const sinDir = await resolverHeks(escribir("recto_bilineal.heks", panoRecto(Qr)));
  const conDir = await resolverHeks(escribir("recto_transfinito.heks",
                    panoRecto(Qr, "arco 1 2 3 0 0\narco 4 3 3 5 0\n")));
  let peorE = 0;
  const mismos = sinDir.nodes.length === conDir.nodes.length;
  if (mismos) for (let i = 0; i < sinDir.nodes.length; i++)
    for (let k = 0; k < 3; k++) peorE = Math.max(peorE, Math.abs(sinDir.nodes[i][k] - conDir.nodes[i][k]));
  filas.push({ que: "(a) malla real: misma nube de nudos", medido: mismos ? peorE.toExponential(2) : "nº de nudos distinto",
               limite: "< 1e-12 m", ok: mismos && peorE < 1e-12, crudo: true,
               detalle: `${sinDir.nodes.length} nudos por los dos caminos (bilineal y transfinito)` });

  // ── (b) BORDE CURVO: los nudos sobre el arco, no sobre la cuerda ────────────────────────────
  const curvo = [`node 1 0 0 ${Z0}`, `node 2 0 ${LUZ} ${Z0}`,
                 `node 3 ${ANCHO} ${LUZ} ${Z0}`, `node 4 ${ANCHO} 0 ${Z0}`,
                 `shell 1 1 2 3 4 0.2 25e6`,
                 `arco 1 2 0 ${YC} ${Z0 + FLECHA}`,          // borde curvo (pórtico en x=0)
                 `arco 4 3 ${ANCHO} ${YC} ${Z0 + FLECHA}`,   // el mismo arco en x=6
                 `automesh 2.5`, ``].join("\n");
  const rc = await resolverHeks(escribir("curvo.heks", curvo));
  const nQ4 = rc.elements.filter(e => e.length === 4).length;
  // error radial de CADA nudo respecto del cilindro exacto
  let peorR = 0;
  for (const p of rc.nodes) peorR = Math.max(peorR, Math.abs(Math.hypot(p[1] - YC, p[2] - ZC) - RAD));
  filas.push({ que: "(b) nudos SOBRE el arco", medido: peorR.toExponential(2), limite: "< 1e-9 m",
               ok: rc.nodes.length > 4 && peorR < 1e-9, crudo: true,
               detalle: `${rc.nodes.length} nudos, ${nQ4} cáscaras · cilindro R=${RAD} m exacto` });
  // cuánto se equivocaba la cuerda (bilineal) en esos mismos nudos: es la mejora
  const sinArco = await resolverHeks(escribir("curvo_cuerda.heks",
                    curvo.replace(/^arco .*$/gm, "").replace(/\n\n+/g, "\n")));
  let peorCuerda = 0;
  for (const p of sinArco.nodes) peorCuerda = Math.max(peorCuerda, Math.abs(Math.hypot(p[1] - YC, p[2] - ZC) - RAD));
  filas.push({ que: "(b) la cuerda (bilineal) se aleja", medido: peorCuerda.toFixed(4) + " m",
               limite: "> 0.1 m", ok: peorCuerda > 0.1, crudo: true,
               detalle: `sin la directiva los nudos caen hasta ${peorCuerda.toFixed(3)} m por debajo del arco (flecha ${FLECHA} m)` });

  // ── (b2) el MISMO borde curvo, pero declarado con `borde` (polilínea de nudos que ya existen,
  // que es como el CAD y los generadores del repo discretizan hoy una curva: el galpón curvo no
  // guarda ningún «arco», guarda la cadena de nudos). Los nudos nuevos caen sobre la polilínea,
  // así que su error contra el círculo exacto es, como mucho, la flecha de un tramo de 5 m.
  const zc = (y) => ZC + Math.sqrt(RAD * RAD - (y - YC) * (y - YC));
  // tope teórico: la flecha del tramo MÁS LARGO de la polilínea, f = R - sqrt(R² - (c/2)²).
  // Ojo: la cuerda no mide 5 m aunque y avance de 5 en 5, porque el arco también sube en z.
  const ys = [0, 5, 10, 15, 20];
  let cmax = 0;
  for (let i = 1; i < ys.length; i++)
    cmax = Math.max(cmax, Math.hypot(ys[i] - ys[i - 1], zc(ys[i]) - zc(ys[i - 1])));
  const flechaTramo = RAD - Math.sqrt(RAD * RAD - (cmax / 2) * (cmax / 2));
  const poli = [`node 1 0 0 ${Z0}`, `node 2 0 ${LUZ} ${Z0}`, `node 3 ${ANCHO} ${LUZ} ${Z0}`, `node 4 ${ANCHO} 0 ${Z0}`,
                `node 5 0 5 ${zc(5)}`, `node 6 0 10 ${zc(10)}`, `node 7 0 15 ${zc(15)}`,
                `node 8 ${ANCHO} 5 ${zc(5)}`, `node 9 ${ANCHO} 10 ${zc(10)}`, `node 10 ${ANCHO} 15 ${zc(15)}`,
                `shell 1 1 2 3 4 0.2 25e6`, `borde 1 2 5 6 7`, `borde 4 3 8 9 10`,
                `automesh 2.5`, ``].join("\n");
  const rp = await resolverHeks(escribir("curvo_polilinea.heks", poli));
  let peorP = 0;
  for (const p of rp.nodes) peorP = Math.max(peorP, Math.abs(Math.hypot(p[1] - YC, p[2] - ZC) - RAD));
  filas.push({ que: "(b) `borde` = polilínea del CAD", medido: peorP.toFixed(4) + " m",
               limite: `<= ${flechaTramo.toFixed(4)} m`, ok: rp.nodes.length > 10 && peorP <= flechaTramo + 1e-9, crudo: true,
               detalle: `${rp.nodes.length} nudos · el tope es la flecha del tramo más largo de la polilínea` });

  // ── (c) MALLA SANA: jacobianos positivos en las 4 esquinas de cada celda ────────────────────
  let jmin = Infinity, jmax = -Infinity, negativos = 0;
  for (const el of rc.elements) {
    if (el.length !== 4) continue;
    for (const j of jacobianos(el.map(i => rc.nodes[i]))) {
      if (j <= 0) negativos++;
      jmin = Math.min(jmin, j); jmax = Math.max(jmax, j);
    }
  }
  filas.push({ que: "(c) jacobianos positivos", medido: negativos, limite: 0, ok: negativos === 0, crudo: true,
               detalle: `J entre ${jmin.toExponential(3)} y ${jmax.toExponential(3)} (relación ${(jmax / jmin).toFixed(3)})` });

  // ── (d) SUELO INCLINADO: la opción de ETABS, explícita ──────────────────────────────────────
  const incl = ["node 1 0 0 0", "node 2 6 0 1.5", "node 3 6 5 1.5", "node 4 0 5 0",
                "shell 1 1 2 3 4 0.2 25e6", ""].join("\n");
  const im = await resolverHeks(escribir("inclinado_mallado.heks", incl + "automesh 1.25\n"));
  const iNo = await resolverHeks(escribir("inclinado_sin_mallar.heks", incl + "automesh 1.25 noinclinados\n"));
  const iPlano = await resolverHeks(escribir("plano_noinclinados.heks",
                   ["node 1 0 0 0", "node 2 6 0 0", "node 3 6 5 0", "node 4 0 5 0",
                    "shell 1 1 2 3 4 0.2 25e6", "automesh 1.25 noinclinados", ""].join("\n")));
  const nInc = im.elements.filter(e => e.length === 4).length;
  const nNo = iNo.elements.filter(e => e.length === 4).length;
  const nPla = iPlano.elements.filter(e => e.length === 4).length;
  filas.push({ que: "(d) `noinclinados` = regla de ETABS", medido: `${nInc} → ${nNo}`, limite: "n → 1",
               ok: nInc > 1 && nNo === 1 && nPla > 1, crudo: true,
               detalle: `inclinado: ${nInc} cáscaras por defecto y ${nNo} con la opción; horizontal con la opción: ${nPla} (se sigue mallando)` });

  // ── (e) EL JUEZ: SAP2000, con la MISMA malla (bóveda cilíndrica automallada) ────────────────
  // Hoy NO hay en `validation/` ninguna medición de SAP2000 de un paño automallado con borde
  // curvo, y no se inventa: SAP2000 no automalla arcos (sus áreas son polígonos), así que la
  // referencia hay que MEDIRLA. El modelo y su volcado ya están listos; el comando exacto va en
  // el detalle. En cuanto exista el JSON, esta fila compara de verdad.
  const SAPJSON = "validation/isse/automesh/boveda_transfinita_sap.json";
  const CMD = "python ../galpon-bodega-electoral/csi_desde_dump.py sap " +
              "validation/isse/automesh/boveda_transfinita_dump.json " + SAPJSON + " --watchdog 3";
  if (!existsSync(SAPJSON)) {
    filas.push({ que: "(e) SAP2000 (juez)", medido: "SIN MEDIR", limite: "0.50 %", ok: true, crudo: true,
                 detalle: `⏳ falta ${SAPJSON} — medirlo con: ${CMD}` });
  } else {
    const S = JSON.parse(readFileSync(SAPJSON, "utf-8"));
    const bov = await resolverHeks("validation/isse/automesh/boveda_transfinita.heks");
    const U = bov.deformOutputs.deformations;
    let umax = 0; for (const [, u] of U) umax = Math.max(umax, ...u.slice(0, 3).map(Math.abs));
    let peor = 0, n = 0;
    for (const s of S.nudos) {
      const u = U.get(s.i); if (!u) continue;
      n++; for (let c = 0; c < 3; c++) peor = Math.max(peor, Math.abs(u[c] - s.u[c]) / umax * 100);
    }
    filas.push({ que: "(e) SAP2000 (juez)", medido: peor, limite: 0.5, ok: n > 0 && peor <= 0.5,
                 detalle: `${n} nudos casados, bóveda automallada con \`arco\`` });
  }

  return filas;
}
