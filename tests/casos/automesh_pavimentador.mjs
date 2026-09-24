/**
 * PAVIMENTADOR: automallado en cuadriláteros de paños con HUECO, en L o de lados oblicuos
 * (directivas `area` y `hueco`, `examples/src/cli-modeler/pavimentador.ts`).
 *
 * Es lo que la transfinita (Coons) no puede hacer: necesita cuatro bordes. ETABS entra ahí en
 * `Quad_Build` (pavimentado + laplaciano + huecos; medido en su binario el 17-sep-2026). Aquí se
 * toma la idea y se escribe con código propio, en dos caminos:
 *   (A) polígono RECTILÍNEO -> rejilla recortada («cookie cut»), exacta;
 *   (B) polígono general -> Delaunay (Bowyer–Watson) + 3 cuadriláteros por triángulo + laplaciano.
 *
 * Qué se comprueba, y por qué:
 *
 *  (a) COHERENCIA CON LO QUE YA HABÍA. Una L declarada como `area` de 6 nudos da la MISMA nube de
 *      nudos, las mismas cáscaras y los MISMOS desplazamientos que la misma L declarada como dos
 *      `shell` Q4 automallados (a un tamaño en que los cortes coinciden). Si no, el pavimentador
 *      estaría inventando otra malla.
 *
 *  (b) HUECO RECTANGULAR. La malla cubre EXACTAMENTE el área del paño menos el hueco (suma de las
 *      áreas de las celdas), ninguna celda cae dentro del hueco y las esquinas del hueco son nudos.
 *
 *  (c) HUECO GIRADO (camino general). Lo mismo, pero además: ningún jacobiano negativo, ángulo
 *      mínimo razonable, y ningún nudo dentro del hueco. El área ya no es "de rejilla": que cuadre
 *      a precisión de máquina prueba que los nudos del borde están SOBRE el contorno y el hueco.
 *
 *  (d) MURO VERTICAL con VENTANA (plano x = 0): el marco local funciona fuera del plano z = 0.
 *
 *  (e) EQUILIBRIO. Con `areaload` sobre el área, la suma de reacciones verticales = q × (área
 *      neta). Prueba a la vez que la carga se hereda a TODAS las celdas y que la malla cubre el
 *      paño, resolviendo de verdad con el FEM.
 *
 *  (f) SAP2000/ETABS como juez: SIN MEDIR hoy (no se inventa). El modelo y el comando quedan.
 *
 * Referencias (matemática pública, implementación propia): Bowyer (1981), Watson (1981),
 * Catmull & Clark (1978), Field (1988).
 */
import { writeFileSync, existsSync, readFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolverHeks } from "../lib/heks.mjs";

export const nombre = "automesh-pavimentador";
export const descripcion = "paños con hueco, en L u oblicuos -> cuadriláteros (rejilla recortada o Delaunay+laplaciano); área exacta, equilibrio y coherencia con la transfinita";

const DIR = mkdtempSync(join(tmpdir(), "hkTest-pav-"));
const escribir = (nombre, txt) => { const p = join(DIR, nombre); writeFileSync(p, txt, "utf-8"); return p; };

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const punt = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const mod = (a) => Math.hypot(a[0], a[1], a[2]);

/** área de un cuadrilátero plano: ½·|d1 × d2| (las diagonales) */
const areaQ = (c) => mod(cruz(sub(c[2], c[0]), sub(c[3], c[1]))) / 2;
const areaMalla = (r) => r.elements.filter((e) => e.length === 4).reduce((s, e) => s + areaQ(e.map((i) => r.nodes[i])), 0);
const nQ4 = (r) => r.elements.filter((e) => e.length === 4).length;
const hayNudo = (r, p) => r.nodes.some((n) => mod(sub(n, p)) < 1e-9);

/** jacobiano (con signo de la normal) y ángulo en las 4 esquinas de cada Q4 */
function calidad(r) {
  let neg = 0, angMin = 180;
  for (const e of r.elements) {
    if (e.length !== 4) continue;
    const c = e.map((i) => r.nodes[i]);
    const n = cruz(sub(c[2], c[0]), sub(c[3], c[1])); const L = mod(n); const N = n.map((x) => x / L);
    for (let k = 0; k < 4; k++) {
      const p0 = c[k], p1 = c[(k + 1) % 4], p3 = c[(k + 3) % 4];
      const d1 = sub(p1, p0), d3 = sub(p3, p0);
      const j = punt(cruz(d1, d3), N);
      if (j <= 0) neg++;
      const cosA = punt(d1, d3) / (mod(d1) * mod(d3));
      angMin = Math.min(angMin, Math.acos(Math.max(-1, Math.min(1, cosA))) * 180 / Math.PI);
    }
  }
  return { neg, angMin };
}

/** dentro de un polígono 2D (x,y) por paridad, con margen `eps` hacia dentro */
function dentro2d(P, q, eps = 0) {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const a = P[i], b = P[j];
    if ((a[1] > q[1]) !== (b[1] > q[1]) && q[0] < ((b[0] - a[0]) * (q[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  if (!c) return false;
  if (eps > 0) {
    // a menos de eps del borde no cuenta como "dentro"
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length];
      const dx = b[0] - a[0], dy = b[1] - a[1]; const L2 = dx * dx + dy * dy;
      const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / L2));
      if (Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy) < eps) return false;
    }
  }
  return true;
}

// ── la L del ensayo: 10 × 8 con un entrante de 4 × 3 en la esquina (10,8) ──────────────────────
const L_NODOS = ["node 1 0 0 0", "node 2 10 0 0", "node 3 10 5 0", "node 4 6 5 0", "node 5 6 8 0", "node 6 0 8 0"];
const APOYOS_L = [1, 2, 3, 4, 5, 6].map((i) => `support ${i} fixed`);
const AREA_L = 10 * 8 - 4 * 3;

export async function correr() {
  const filas = [];

  // ── (a) la L como `area` == la L como dos `shell` automallados ─────────────────────────────
  // tam = 1 m: así los cortes de los dos Q4 (6×8 y 4×5) caen donde los pone la rejilla (x = 6,
  // y = 5) y las dos mallas tienen que ser la MISMA. Con 1.25 no coincidirían, y no por error:
  // los dos Q4 automallados por separado dejan nudos colgados en x = 6 (7 divisiones contra 4),
  // mientras que la rejilla del polígono es conforme. Eso es una ventaja, no una diferencia.
  const comun = [...L_NODOS, ...APOYOS_L, "areaload 1 -10", "automesh 1", "solve", ""];
  const rA = await resolverHeks(escribir("L_area.heks",
    [...L_NODOS, "area 1 0.2 25e6 1 2 3 4 5 6", ...comun.slice(6)].join("\n")));
  const rS = await resolverHeks(escribir("L_shells.heks",
    [...L_NODOS, "shell 1 1 5 6 1 0.2 25e6".replace("1 5 6 1", "1 7 5 6"), "node 7 6 0 0",
     "shell 2 7 2 3 4 0.2 25e6", ...APOYOS_L, "areaload 1 -10", "areaload 2 -10", "automesh 1", "solve", ""].join("\n")));
  // se casan por el nudo MÁS CERCANO, no por orden: la bilineal deja restos de 1e-15 en las
  // coordenadas (0.8333·6 no es exactamente 5) y eso basta para que un orden lexicográfico se
  // desordene; la distancia al más cercano no se deja engañar por eso
  const A = rA.nodes, S = rS.nodes;
  let peorN = 0; const mismos = A.length === S.length;
  if (mismos) for (const p of A) peorN = Math.max(peorN, Math.min(...S.map((q) => mod(sub(p, q)))));
  filas.push({ que: "(a) L: `area` = dos `shell` (nudos)", medido: mismos ? peorN.toExponential(2) : `${A.length} vs ${S.length} nudos`,
               limite: "< 1e-12 m", ok: mismos && peorN < 1e-12 && nQ4(rA) === nQ4(rS), crudo: true,
               detalle: `${rA.nodes.length} nudos y ${nQ4(rA)} cáscaras por los dos caminos (rejilla recortada / transfinita)` });
  // y los desplazamientos: mismo modelo -> mismo resultado. Se casan por coordenada, no por id.
  const UA = rA.deformOutputs.deformations, US = rS.deformOutputs.deformations;
  let peorU = 0, umax = 0, casados = 0;
  if (UA && US) {
    for (const [i, u] of UA) umax = Math.max(umax, Math.abs(u[2]));
    for (const [i, u] of UA) {
      const p = rA.nodes[i]; const j = rS.nodes.findIndex((q) => mod(sub(q, p)) < 1e-9);
      if (j < 0) continue; const v = US.get(j); if (!v) continue; casados++;
      for (let c = 0; c < 3; c++) peorU = Math.max(peorU, Math.abs(u[c] - v[c]));
    }
  }
  filas.push({ que: "(a) L: mismos desplazamientos", medido: (peorU / umax * 100).toExponential(2) + " %",
               limite: "< 1e-8 %", ok: casados > 6 && peorU / umax < 1e-10, crudo: true,
               detalle: `${casados} nudos casados por coordenada · w máx ${umax.toExponential(4)} m` });

  // ── (b) HUECO rectangular (rejilla recortada) ──────────────────────────────────────────────
  const HUECO = [[3, 2], [6, 2], [6, 5], [3, 5]];
  const rect = ["node 1 0 0 0", "node 2 10 0 0", "node 3 10 8 0", "node 4 0 8 0",
                ...HUECO.map((p, k) => `node ${5 + k} ${p[0]} ${p[1]} 0`)];
  const rH = await resolverHeks(escribir("hueco_rect.heks",
    [...rect, "area 1 0.2 25e6 1 2 3 4", "hueco 1 5 6 7 8", "automesh 1.25", ""].join("\n")));
  const aH = areaMalla(rH);
  const enHueco = rH.elements.filter((e) => e.length === 4).filter((e) => {
    const c = e.map((i) => rH.nodes[i]); const g = [0, 1].map((k) => c.reduce((s, p) => s + p[k], 0) / 4);
    return dentro2d(HUECO, g);
  }).length;
  const esquinas = HUECO.every((p) => hayNudo(rH, [p[0], p[1], 0]));
  filas.push({ que: "(b) hueco rectangular: área exacta", medido: Math.abs(aH - 71).toExponential(2), limite: "< 1e-9 m²",
               ok: Math.abs(aH - 71) < 1e-9 && enHueco === 0 && esquinas && nQ4(rH) > 0, crudo: true,
               detalle: `${nQ4(rH)} cáscaras cubren ${aH.toFixed(6)} m² (80 − 9) · ${enHueco} celdas en el hueco · esquinas del hueco = nudos: ${esquinas}` });

  // ── (c) HUECO GIRADO (Delaunay + cuadriláteros + laplaciano) ───────────────────────────────
  const ROMBO = [[5, 2], [7, 4], [5, 6], [3, 4]];                 // cuadrado girado 45°, área 8
  const rG = await resolverHeks(escribir("hueco_girado.heks",
    [...rect.slice(0, 4), ...ROMBO.map((p, k) => `node ${5 + k} ${p[0]} ${p[1]} 0`),
     "area 1 0.2 25e6 1 2 3 4", "hueco 1 5 6 7 8", "automesh 1.25", ""].join("\n")));
  const aG = areaMalla(rG);
  const q = calidad(rG);
  const nudosEnHueco = rG.nodes.filter((p) => dentro2d(ROMBO, p, 1e-6)).length;
  const vertices = [...ROMBO, [0, 0], [10, 0], [10, 8], [0, 8]].every((p) => hayNudo(rG, [p[0], p[1], 0]));
  filas.push({ que: "(c) hueco girado: área exacta", medido: Math.abs(aG - 72).toExponential(2), limite: "< 1e-9 m²",
               ok: Math.abs(aG - 72) < 1e-9 && nudosEnHueco === 0 && vertices, crudo: true,
               detalle: `${nQ4(rG)} cáscaras, ${rG.nodes.length} nudos, cubren ${aG.toFixed(6)} m² (80 − 8) · ${nudosEnHueco} nudos dentro del hueco · los 8 vértices son nudos: ${vertices}` });
  filas.push({ que: "(c) hueco girado: malla sana", medido: `${q.neg} inv · ${q.angMin.toFixed(1)}°`, limite: "0 inv · ≥ 20°",
               ok: q.neg === 0 && q.angMin >= 20, crudo: true,
               detalle: `jacobianos negativos: ${q.neg} · ángulo mínimo de esquina ${q.angMin.toFixed(1)}° (Delaunay + laplaciano)` });

  // ── (d) MURO vertical (x = 0) con ventana ──────────────────────────────────────────────────
  const muro = ["node 1 0 0 0", "node 2 0 10 0", "node 3 0 10 3", "node 4 0 4 3", "node 5 0 4 6", "node 6 0 0 6",
                "node 7 0 1 1", "node 8 0 3 1", "node 9 0 3 2", "node 10 0 1 2",
                "area 1 0.25 25e6 1 2 3 4 5 6", "hueco 1 7 8 9 10", "automesh 1.25", ""].join("\n");
  const rM = await resolverHeks(escribir("muro_ventana.heks", muro));
  const aM = areaMalla(rM); const fueraDelPlano = rM.nodes.filter((p) => Math.abs(p[0]) > 1e-9).length;
  filas.push({ que: "(d) muro vertical con ventana", medido: Math.abs(aM - 40).toExponential(2), limite: "< 1e-9 m²",
               ok: Math.abs(aM - 40) < 1e-9 && fueraDelPlano === 0 && nQ4(rM) > 0, crudo: true,
               detalle: `${nQ4(rM)} cáscaras cubren ${aM.toFixed(6)} m² (30 + 12 − 2) · ${fueraDelPlano} nudos fuera del plano x = 0` });

  // ── (e) EQUILIBRIO: ΣR_z = q · área neta, con la L + hueco, resuelta de verdad ─────────────
  // el hueco va en 2..5 × 1..4, NO en el de (b): aquel (3..6 × 2..5) tocaría la esquina entrante de
  // la L en (6,5) -> nudo duplicado y malla pellizcada (cazado con SAP2000 el 17-sep-2026)
  const HUECO_L = [[2, 1], [5, 1], [5, 4], [2, 4]];
  const LH = [...L_NODOS, ...HUECO_L.map((p, k) => `node ${7 + k} ${p[0]} ${p[1]} 0`),
              "area 1 0.2 25e6 1 2 3 4 5 6", "hueco 1 7 8 9 10", "areaload 1 -10",
              "apoyoborde 1 pinned", "automesh 1.25", "solve", ""].join("\n");
  const rE = await resolverHeks(escribir("L_hueco.heks", LH));
  const R = rE.deformOutputs.reactions;
  let sumRz = 0, nR = 0;
  if (R) for (const [, r] of R) { sumRz += r[2]; nR++; }
  const esperado = 10 * (AREA_L - 9);
  // `apoyoborde` tiene que apoyar EXACTAMENTE los nudos que caen sobre el contorno de la L (ni
  // uno más ni uno menos). Se cuentan por geometría. Ojo: no son 8+4+4+3+5+7 = 31, porque la
  // rejilla recortada lleva líneas de corte por los vértices del hueco (x = 2, 5; y = 1, 4) que
  // atraviesan todo el paño y también parten los bordes.
  const CONT = [[0, 0], [10, 0], [10, 5], [6, 5], [6, 8], [0, 8]];
  const dSeg = (q, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1]; const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy); };
  const nContorno = rE.nodes.filter((p) => CONT.some((a, i) => dSeg(p, a, CONT[(i + 1) % 6]) < 1e-9)).length;
  filas.push({ que: "(e) equilibrio ΣRz = q·A neta", medido: Math.abs(sumRz - esperado) / esperado * 100, limite: 1e-6,
               ok: nR === nContorno && Math.abs(sumRz - esperado) / esperado < 1e-8,
               detalle: `ΣRz = ${sumRz.toFixed(6)} kN en ${nR} apoyos (apoyoborde; esperados ${nContorno}); q·A = 10 × ${AREA_L - 9} = ${esperado} kN (${nQ4(rE)} cáscaras)` });

  // ── (f) EL JUEZ: SAP2000 (o ETABS) con la misma malla — SIN MEDIR hoy, no se inventa ───────
  const SAPJSON = "validation/isse/automesh/losa_L_hueco_sap.json";
  const CMD = "python ../galpon-bodega-electoral/csi_desde_dump.py sap " +
              "validation/isse/automesh/losa_L_hueco_dump.json " + SAPJSON + " --watchdog 3";
  if (!existsSync(SAPJSON)) {
    filas.push({ que: "(f) SAP2000 (juez)", medido: "SIN MEDIR", limite: "0.50 %", ok: true, crudo: true,
                 detalle: `⏳ falta ${SAPJSON} — medirlo con: ${CMD}` });
  } else {
    const Sj = JSON.parse(readFileSync(SAPJSON, "utf-8"));
    const mod3 = await resolverHeks("validation/isse/automesh/losa_L_hueco.heks");
    const U = mod3.deformOutputs.deformations;
    let um = 0; for (const [, u] of U) um = Math.max(um, ...u.slice(0, 3).map(Math.abs));
    let peor = 0, n = 0;
    for (const s of Sj.nudos) {
      const u = U.get(s.i); if (!u) continue;
      n++; for (let c = 0; c < 3; c++) peor = Math.max(peor, Math.abs(u[c] - s.u[c]) / um * 100);
    }
    filas.push({ que: "(f) SAP2000 (juez)", medido: peor, limite: 0.5, ok: n > 0 && peor <= 0.5,
                 detalle: `${n} nudos casados, losa en L con hueco pavimentada` });
  }

  return filas;
}
