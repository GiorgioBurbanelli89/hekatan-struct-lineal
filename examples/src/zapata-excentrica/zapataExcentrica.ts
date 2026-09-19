/**
 * Cimentaciones con no linealidad: levantamiento de zapatas (suelo sin tracción).
 *
 * Pregunta que llegó de un usuario (19-sep-2026): «hay situaciones en que las zapatas incurren en
 * rango no lineal, como cuando las columnas son demasiado excéntricas».
 *
 * El suelo EMPUJA pero no TIRA. Mientras la resultante cae dentro del núcleo central (e ≤ L/6) toda
 * la base está comprimida y el problema es lineal. Si e > L/6, el Winkler lineal pondría muelles en
 * TRACCIÓN bajo un borde: eso el suelo no lo hace. La zapata se levanta y el área de contacto baja.
 *
 * Esta plantilla escribe un .heks con el muelle de área `compresion` y lo resuelve con cliModeler:
 * el solver itera con la ley «Gap» de CSI (shared/muellesSoloCompresion.ts), como el caso
 * «Nonlinear (Allow Uplift)» de SAFE o el «Compression only» de SAP2000/ETABS.
 *
 * Referencia de zapata RÍGIDA (Guerra 2013, «Cimentaciones sismo resistentes utilizando SAFE», p. 16):
 *   e ≤ L/6 :  q = P/(B·L) · (1 ± 6e/L)
 *   e > L/6 :  contacto 3·(L/2 − e),  q_max = 2P / (3·B·(L/2 − e))
 * Para excentricidad en las DOS direcciones no hay fórmula cerrada sencilla: se resuelve la zapata
 * rígida por conjunto activo sobre una rejilla fina (`zapataRigidaSinTraccion`), que en una
 * dirección reproduce exactamente las dos fórmulas de arriba.
 *
 * Unidades: la app trabaja por dentro en kN y m (units.ts); los parámetros se piden en tonf, m y
 * kgf/cm² y se convierten al escribir el .heks. Se enseña en tonf/m².
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import { cliModeler } from "../cli-modeler/cliModeler";

export const TONF = 9.80665;                 // kN
export const KGF_CM2 = 98.0665;             // kN/m²

export interface ParamsZapataExc {
  Lx: number; Ly: number; t: number;         // m
  fc: number;                                // kgf/cm²
  ks: number;                                // tonf/m³
  c: number;                                 // lado de columna, m
  P: number;                                 // tonf (hacia abajo)
  exL: number; eyB: number;                  // e/L en x y en y
  n: number;                                 // divisiones por lado (mínimo)
}

export const DEFECTO: ParamsZapataExc = { Lx: 2, Ly: 2, t: 0.5, fc: 240, ks: 2000, c: 0.4, P: 60, exL: 0.25, eyB: 0, n: 60 };

/** E = 15100·√f'c (kgf/cm², ACI 318 en kgf) → kN/m² */
export const moduloE = (fc: number) => 15100 * Math.sqrt(fc) * KGF_CM2;

const uniq = (v: number[]) => [...new Set(v.map((x) => +x.toFixed(9)))].sort((a, b) => a - b);

/** Rejilla: n divisiones uniformes MÁS las líneas de la huella de la columna (así la carga cae en malla). */
export function lineasMalla(L: number, n: number, centro: number, c: number) {
  const u = Array.from({ length: n + 1 }, (_, i) => (L * i) / n);
  return uniq([...u, centro - c / 2, centro + c / 2].filter((x) => x >= -1e-12 && x <= L + 1e-12));
}

/**
 * El .heks de la zapata (kN, m). Nudos numerados 1.. por filas en x; shells 1..
 * Con `patrones` ([nombre, e/L, e/B]) escribe UNA malla con todas las huellas y un patrón de carga por
 * caso (para mandar a SAP2000/SAFE/ETABS y definir allí un caso no lineal por patrón).
 */
export function heksZapataExcentrica(pp: Partial<ParamsZapataExc> = {}, patrones?: Array<[string, number, number]>): string {
  const p = { ...DEFECTO, ...pp };
  const casos: Array<[string, number, number]> = patrones ?? [["Dead", p.exL, p.eyB]];
  const huellas = casos.map(([nom, exL, eyB]) => {
    const xc = p.Lx / 2 + exL * p.Lx, yc = p.Ly / 2 + eyB * p.Ly;
    if (xc + p.c / 2 > p.Lx + 1e-9 || yc + p.c / 2 > p.Ly + 1e-9 || xc - p.c / 2 < -1e-9 || yc - p.c / 2 < -1e-9)
      throw new Error(`${nom}: la columna se sale de la zapata con esa excentricidad`);
    return { nom, xc, yc, exL, eyB };
  });
  const X = uniq(huellas.flatMap((h) => lineasMalla(p.Lx, p.n, h.xc, p.c)));
  const Y = uniq(huellas.flatMap((h) => lineasMalla(p.Ly, p.n, h.yc, p.c)));
  const E = moduloE(p.fc), ks = p.ks * TONF, q = -(p.P * TONF) / (p.c * p.c);
  const L: string[] = [];
  L.push(`# Cimentaciones con no linealidad: levantamiento de zapatas (suelo sin tracción)`);
  L.push(`# Zapata ${p.Lx} x ${p.Ly} x ${p.t} m, f'c ${p.fc} kgf/cm2 (E = ${E.toFixed(0)} kN/m2), ks ${p.ks} tonf/m3 (${ks.toFixed(3)} kN/m3)`);
  for (const h of huellas)
    L.push(`# ${h.nom}: columna ${p.c} x ${p.c} m, P = ${p.P} tonf en ex = ${(h.exL * p.Lx).toFixed(4)} m (e/L = ${+h.exL.toFixed(6)}), ey = ${(h.eyB * p.Ly).toFixed(4)} m (e/B = ${+h.eyB.toFixed(6)})`);
  L.push(`# Unidades kN, m. El muelle de área lleva «compresion»: el suelo no tira (ley Gap de CSI).`);
  const id = (i: number, j: number) => j * X.length + i + 1;
  for (let j = 0; j < Y.length; j++) for (let i = 0; i < X.length; i++)
    L.push(`node ${id(i, j)} ${+X[i].toFixed(9)} ${+Y[j].toFixed(9)} 0`);
  let s = 0;
  const cargas: string[] = [];
  for (let j = 0; j < Y.length - 1; j++) for (let i = 0; i < X.length - 1; i++) {
    s++;
    L.push(`shell ${s} ${id(i, j)} ${id(i + 1, j)} ${id(i + 1, j + 1)} ${id(i, j + 1)} ${p.t} ${+E.toFixed(3)} 0 0`);
    L.push(`shelltype ${s} thick`);
    L.push(`areaspring ${s} ${+ks.toFixed(6)} nodal compresion`);
    const mx = (X[i] + X[i + 1]) / 2, my = (Y[j] + Y[j + 1]) / 2;
    for (const h of huellas)
      if (Math.abs(mx - h.xc) < p.c / 2 && Math.abs(my - h.yc) < p.c / 2)
        cargas.push(`areaload ${s} ${+q.toFixed(6)}${h.nom === "Dead" ? "" : " " + h.nom}`);
  }
  // En el plano la zapata no se mueve ni gira sobre z (el suelo no lo sujeta y el sistema sería singular)
  for (let j = 0; j < Y.length; j++) for (let i = 0; i < X.length; i++) L.push(`support ${id(i, j)} 1 1 0 0 0 1`);
  L.push(...cargas);
  L.push(`fc ${+(p.fc * KGF_CM2).toFixed(3)}`);
  L.push(`vista pressure`);
  L.push(`solve`);
  return L.join("\n") + "\n";
}

export interface ResultadoRigida {
  qmax: number;              // tonf/m²
  contacto: number;          // fracción del área en contacto
  largoContactoX: number;    // m, sobre la línea y = yc de la columna... (uniaxial: 3(L/2 − e))
  wmax: number;              // m (asiento máximo, positivo hacia abajo)
  giroX: number; giroY: number;   // rad: pendiente de w en x y en y
}

/**
 * Zapata RÍGIDA sobre suelo sin tracción: w(x,y) = a + b·(x − Lx/2) + c·(y − Ly/2), q = ks·max(0, w)
 * (w positivo hacia abajo). Equilibrio de fuerza y de los dos momentos con conjunto activo sobre
 * una rejilla de m×m celdas. Con ey = 0 da las fórmulas cerradas de Guerra (2013, p. 16).
 */
export function zapataRigidaSinTraccion(pp: Partial<ParamsZapataExc> = {}, m = 400): ResultadoRigida {
  const p = { ...DEFECTO, ...pp };
  const ex = p.exL * p.Lx, ey = p.eyB * p.Ly;
  const dx = p.Lx / m, dy = p.Ly / m, dA = dx * dy;
  const xs = Array.from({ length: m }, (_, i) => -p.Lx / 2 + (i + 0.5) * dx);
  const ys = Array.from({ length: m }, (_, j) => -p.Ly / 2 + (j + 0.5) * dy);
  let act = new Uint8Array(m * m).fill(1);
  let sol = [0, 0, 0];
  for (let it = 0; it < 200; it++) {
    // K·[a b c] = [P, P·ex, P·ey]/ks  sobre el área activa
    const K = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let j = 0; j < m; j++) for (let i = 0; i < m; i++) if (act[j * m + i]) {
      const v = [1, xs[i], ys[j]];
      for (let r = 0; r < 3; r++) for (let s = 0; s < 3; s++) K[r][s] += v[r] * v[s] * dA;
    }
    const f = [p.P / p.ks, (p.P * ex) / p.ks, (p.P * ey) / p.ks];
    sol = resolver3(K, f);
    const nuevo = new Uint8Array(m * m);
    let igual = true;
    for (let j = 0; j < m; j++) for (let i = 0; i < m; i++) {
      const w = sol[0] + sol[1] * xs[i] + sol[2] * ys[j];
      nuevo[j * m + i] = w > 0 ? 1 : 0;
      if (nuevo[j * m + i] !== act[j * m + i]) igual = false;
    }
    act = nuevo;
    if (igual) break;
  }
  const [a, b, c] = sol;
  // esquinas: el asiento máximo está en una esquina (plano)
  let wmax = -Infinity;
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) wmax = Math.max(wmax, a + b * sx * p.Lx / 2 + c * sy * p.Ly / 2);
  let nAct = 0;
  for (const v of act) nAct += v;
  // largo de contacto sobre la línea y = ey (la de la columna): donde w > 0
  let largo = 0;
  for (const x of xs) if (a + b * x + c * ey > 0) largo += dx;
  return { qmax: p.ks * wmax, contacto: nAct / (m * m), largoContactoX: largo, wmax, giroX: b, giroY: c };
}

/** Fórmulas cerradas de la zapata rígida, excentricidad en UNA dirección (Guerra 2013, p. 16). */
export function formulaUniaxial(P: number, B: number, L: number, e: number, ks: number) {
  if (e <= L / 6 + 1e-12) {
    const qmax = (P / (B * L)) * (1 + (6 * e) / L), qmin = (P / (B * L)) * (1 - (6 * e) / L);
    return { caso: "e ≤ L/6: toda la base comprimida", qmax, qmin, contacto: L, wmax: qmax / ks, giro: (qmax - qmin) / (ks * L) };
  }
  const a = L / 2 - e, qmax = (2 * P) / (3 * B * a);
  return { caso: "e > L/6: la zapata se levanta", qmax, qmin: 0, contacto: 3 * a, wmax: qmax / ks, giro: qmax / ks / (3 * a) };
}

function resolver3(K: number[][], f: number[]) {
  const A = K.map((r, i) => [...r, f[i]]);
  for (let c = 0; c < 3; c++) {
    let piv = c;
    for (let r = c + 1; r < 3; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    [A[c], A[piv]] = [A[piv], A[c]];
    for (let r = 0; r < 3; r++) if (r !== c) {
      const k = A[r][c] / A[c][c];
      for (let s = c; s < 4; s++) A[r][s] -= k * A[c][s];
    }
  }
  return [A[0][3] / A[0][0], A[1][3] / A[1][1], A[2][3] / A[2][2]];
}

/** Resultados del FEM sobre la presión nodal: q_max, contacto, asiento y giro (tonf, m). */
export function resumenFem(nodes: number[][], U: Map<number, number[]>, p: ParamsZapataExc) {
  let wmin = 0, nC = 0;
  for (let i = 0; i < nodes.length; i++) { const w = U.get(i)?.[2] ?? 0; if (w < wmin) wmin = w; if (w < 0) nC++; }
  const yc = p.Ly / 2 + p.eyB * p.Ly;
  // línea de nudos más cercana a y = yc
  let yl = nodes[0][1];
  for (const q of nodes) if (Math.abs(q[1] - yc) < Math.abs(yl - yc)) yl = q[1];
  const fila = nodes.map((q, i) => ({ x: q[0], w: U.get(i)?.[2] ?? 0 })).filter((_, i) => Math.abs(nodes[i][1] - yl) < 1e-9).sort((a, b) => a.x - b.x);
  let largo = 0;
  for (let k = 0; k + 1 < fila.length; k++) {
    const A = fila[k], B = fila[k + 1], h = B.x - A.x;
    if (A.w < 0 && B.w < 0) largo += h;
    else if (A.w < 0 !== B.w < 0) largo += h * (A.w < 0 ? A.w / (A.w - B.w) : B.w / (B.w - A.w));
  }
  const giro = (fila[fila.length - 1].w - fila[0].w) / (fila[fila.length - 1].x - fila[0].x);
  return { qmax: -wmin * p.ks, wmax: -wmin, largoContactoX: largo, giroX: -giro, nudosContacto: nC };
}

// ─────────────────────────────────────────────────────────────────────
// ExampleDef
// ─────────────────────────────────────────────────────────────────────
const F = (folder: string, label: string, def: number, min: number, max: number, step: number) => ({ default: def, min, max, step, label, folder });

export const zapataExcentrica: ExampleDef = {
  id: "zapata-excentrica",
  name: "Cimentaciones con no linealidad: levantamiento de zapatas (suelo sin tracción)",
  category: "4️⃣ Mixtos · 🧰 Cimentaciones",
  defaultShellResult: "pressure",
  availableShellResults: ["pressure", "displacementZ", "bendingXX", "bendingYY"],
  params: {
    Lx: F("Zapata", "L en x (m)", DEFECTO.Lx, 1, 5, 0.1),
    Ly: F("Zapata", "B en y (m)", DEFECTO.Ly, 1, 5, 0.1),
    t: F("Zapata", "Espesor (m)", DEFECTO.t, 0.25, 1.5, 0.05),
    fc: F("Zapata", "f'c (kgf/cm²)", DEFECTO.fc, 180, 420, 10),
    c: F("Columna", "Lado columna (m)", DEFECTO.c, 0.25, 0.8, 0.05),
    P: F("Columna", "P (tonf)", DEFECTO.P, 1, 500, 1),
    exL: { default: DEFECTO.exL, label: "e/L en x", folder: "Columna",
           options: { "0 (centrada)": 0, "1/12": 1 / 12, "1/6 (límite)": 1 / 6, "1/4 (se levanta)": 0.25, "1/3 (se levanta)": 1 / 3 } },
    eyB: { default: DEFECTO.eyB, label: "e/B en y", folder: "Columna",
           options: { "0": 0, "1/12": 1 / 12, "1/6": 1 / 6, "1/4": 0.25 } },
    ks: F("Suelo", "ks (tonf/m³)", DEFECTO.ks, 200, 20000, 100),
    n: F("Malla", "Divisiones por lado", 40, 10, 80, 2),
  },
  build(pr: any, states: any, mp: any) {
    const p = { ...DEFECTO, ...pr } as ParamsZapataExc;
    (window as any).__hekatanCliScript = heksZapataExcentrica(p);
    cliModeler.build({}, states, mp);
  },
  computedLabels(pr: any, states: any) {
    const p = { ...DEFECTO, ...pr } as ParamsZapataExc;
    const out: Record<string, string> = {};
    const U = states?.deformOutputs?.val?.deformations as Map<number, number[]> | undefined;
    const nodes = states?.nodes?.val as number[][] | undefined;
    const ref = zapataRigidaSinTraccion(p, 200);
    out["Rígida q_max"] = `${ref.qmax.toFixed(2)} tonf/m²`;
    out["Rígida contacto"] = `${(ref.contacto * 100).toFixed(1)} % del área`;
    if (U && nodes?.length) {
      const r = resumenFem(nodes, U, p);
      out["FEM q_max"] = `${r.qmax.toFixed(2)} tonf/m²`;
      out["FEM contacto (línea de la columna)"] = `${r.largoContactoX.toFixed(3)} m de ${p.Lx} m`;
      out["FEM asiento máx"] = `${(r.wmax * 1000).toFixed(2)} mm`;
    }
    const k = (window as any).__hekatanCliContacto;
    if (k) out["Iteraciones (ley Gap)"] = `${k.iteraciones}: ${k.historial.join(" → ")} nudos en contacto`;
    if (p.exL <= 1 / 6 + 1e-9 && p.eyB === 0) out["Estado"] = "e ≤ L/6: toda la base comprime (lineal)";
    else out["Estado"] = "resultante fuera del núcleo: parte de la base se LEVANTA";
    return out;
  },
} as ExampleDef;
