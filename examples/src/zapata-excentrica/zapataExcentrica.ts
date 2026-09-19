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
import { botonTutorZapata } from "../shared/tutorFem";
import { opensees, datosOpenSeesDeStates } from "../shared/openseesZapata";
import { HOJA_DAS_48 as hojaDas48 } from "./das48";

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
  /** false = Winkler LINEAL (el suelo tira), para comparar. Por defecto true. */
  sinTraccion?: boolean;
}

export const DEFECTO: ParamsZapataExc = { Lx: 2, Ly: 2, t: 0.5, fc: 240, ks: 2000, c: 0.4, P: 60, exL: 0.25, eyB: 0, n: 60 };

/**
 * Braja M. Das, «Principles of Foundation Engineering», 9.ª ed. (2019), EJEMPLO 6.10, p. 247-248
 * (fig. 6.31): zapata cuadrada 1.5 × 1.5 m, D_f = 0.7 m, arena γ = 18 kN/m³, φ' = 30°, c' = 0,
 * e_L = 0.3 m y e_B = 0.15 m (dos direcciones). Das obtiene Q_u ≈ 606 kN (caso II, A' = 1.193 m²).
 * Con e_L/L = 0.2 > 1/6 la resultante sale del núcleo: un borde se levanta.
 * Notación: B en x (e_B = 0.15), L en y (e_L = 0.3). La carga que se aplica es la del libro, Q = Q_u
 * = 606 kN (el contacto no depende del valor de Q: todo escala con él).
 * Lo que Das NO da y hay que elegir para el FEM: espesor t = 0.40 m, columna 0.30 × 0.30, f'c 240,
 * ks = 2000 tonf/m³ (arena media).
 */
export const DAS_EJ610: ParamsZapataExc = { Lx: 1.5, Ly: 1.5, t: 0.4, fc: 240, ks: 2000, c: 0.3, P: 606 / 9.80665, exL: 0.1, eyB: 0.2, n: 30 };

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
    L.push(`areaspring ${s} ${+ks.toFixed(6)} nodal${p.sinTraccion === false ? "" : " compresion"}`);
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
  name: "Levantamiento de zapatas (suelo sin tracción) · Das ej. 6.10, p. 247",
  category: "4️⃣ Mixtos · 🧰 Cimentaciones",
  defaultShellResult: "pressure",
  availableShellResults: ["pressure", "displacementZ", "bendingXX", "bendingYY"],
  params: {
    Lx: F("Zapata", "B en x (m)", DAS_EJ610.Lx, 1, 5, 0.05),
    Ly: F("Zapata", "L en y (m)", DAS_EJ610.Ly, 1, 5, 0.05),
    t: F("Zapata", "Espesor (m)", DAS_EJ610.t, 0.25, 1.5, 0.05),
    fc: F("Zapata", "f'c (kgf/cm²)", DAS_EJ610.fc, 180, 420, 10),
    c: F("Columna", "Lado columna (m)", DAS_EJ610.c, 0.2, 0.8, 0.05),
    P: F("Columna", "Q (tonf)", DAS_EJ610.P, 1, 500, 0.001),
    exL: { default: DAS_EJ610.exL, label: "e_B/B (en x)", folder: "Columna",
           options: { "0": 0, "0.1 (Das 6.10)": 0.1, "1/12": 1 / 12, "1/6 (límite)": 1 / 6, "1/4": 0.25, "1/3": 1 / 3 } },
    eyB: { default: DAS_EJ610.eyB, label: "e_L/L (en y)", folder: "Columna",
           options: { "0": 0, "1/12": 1 / 12, "1/6 (límite)": 1 / 6, "0.2 (Das 6.10)": 0.2, "1/4": 0.25, "1/3": 1 / 3 } },
    ks: F("Suelo", "ks (tonf/m³)", DAS_EJ610.ks, 200, 20000, 100),
    n: F("Malla", "Divisiones por lado", DAS_EJ610.n, 10, 80, 2),
  },
  build(pr: any, states: any, mp: any) {
    const p = { ...DAS_EJ610, ...pr } as ParamsZapataExc;
    (window as any).__hekatanCliScript = heksZapataExcentrica(p);
    cliModeler.build({}, states, mp);
    // «🎓 Tutor FEM»: la hoja se escribe con ESTE modelo y sus vueltas reales del solver
    if (typeof document !== "undefined" && document.body?.appendChild) botonTutorZapata(() => {
      const it = (window as any).__hekatanCliContactoIter;
      const nodes = states?.nodes?.val as number[][] | undefined;
      if (!it?.vueltas?.length || !nodes?.length) return null;
      return { p, nodes, vueltas: it.vueltas, nodosComp: it.nodos };
    }, hojaDas48, ["zapata-excentrica", "zapata-levantamiento"], (lang) => {
      const d = datosOpenSeesDeStates(states, "Zapata con levantamiento (Hekatan Struct)");
      return d ? opensees(d, lang) : null;
    });
  },
  computedLabels(pr: any, states: any) {
    const p = { ...DAS_EJ610, ...pr } as ParamsZapataExc;
    const out: Record<string, string> = {};
    const U = states?.deformOutputs?.val?.deformations as Map<number, number[]> | undefined;
    const nodes = states?.nodes?.val as number[][] | undefined;
    const ref = zapataRigidaSinTraccion(p, 200);
    out["Rígida q_max"] = `${ref.qmax.toFixed(2)} tonf/m²`;
    out["Rígida contacto"] = `${(ref.contacto * p.Lx * p.Ly).toFixed(3)} m² (${(ref.contacto * 100).toFixed(1)} %)`;
    const d = areaEfectivaDas(p.Lx, p.Ly, p.exL * p.Lx, p.eyB * p.Ly);
    out["Das: caso / A' (cap. carga)"] = `${d.caso} · ${d.A.toFixed(3)} m²`;
    if (U && nodes?.length) {
      let wmin = 0, nC = 0;
      for (let i = 0; i < nodes.length; i++) { const w = U.get(i)?.[2] ?? 0; if (w < wmin) wmin = w; if (w < 0) nC++; }
      out["FEM q_max"] = `${(-wmin * p.ks).toFixed(2)} tonf/m²`;
      out["FEM asiento máx"] = `${(-wmin * 1000).toFixed(2)} mm`;
      out["FEM nudos en contacto"] = `${nC} de ${nodes.length}`;
    }
    const k = (window as any).__hekatanCliContacto;
    if (k) out["Iteraciones (ley Gap)"] = `${k.iteraciones}: ${k.historial.join(" → ")}`;
    const dentro = Math.abs(p.exL) * 6 + Math.abs(p.eyB) * 6 <= 1 + 1e-9;
    out["Estado"] = dentro ? "resultante en el núcleo: toda la base comprime (lineal)" : "resultante fuera del núcleo: parte de la base se LEVANTA";
    return out;
  },
} as ExampleDef;

// ─────────────────────────────────────────────────────────────────────
// Braja M. Das, «Principles of Foundation Engineering», 9.ª ed. (2019), §6.11-6.12, p. 236-246
// (= «Fundamentos de ingeniería de cimentaciones», 7.ª ed., §3.10-3.11, p. 158-167).
// Área EFECTIVA de Meyerhof / Highter & Anders (1985): es de CAPACIDAD DE CARGA (presión última
// uniforme sobre A' con su centroide en la carga), NO el área de contacto elástica del Winkler.
// Notación de Das: B y L lados, e_B en la dirección de B y e_L en la de L (fig. 6.25).
// ─────────────────────────────────────────────────────────────────────
export interface AreaEfectivaDas { caso: string; A: number; Bp: number; Lp: number; L1?: number; L2?: number; B1?: number; B2?: number }

/**
 * Casos I-IV de Das 9.ª ed. p. 243-246 (ecs. 6.71-6.83). Los ábacos 6.27b/6.28b se sustituyen por la
 * MISMA condición que dibujan (centroide de A' en la carga), que en los casos II y III es cerrada:
 *   m = (L/2 − e_L) / (1/2 + 6(e_B/B)²),  L1 − L2 = 12·m·e_B/B,  L1 + L2 = 2m   (caso II)
 * Con el ejemplo 6.10 da L1/L = 0.857 y L2/L = 0.214 (el libro lee 0.85 y 0.21 del ábaco).
 * Caso IV (pentágono) por Newton sobre la misma condición.
 */
export function areaEfectivaDas(B: number, L: number, eB: number, eL: number): AreaEfectivaDas {
  const rB = eB / B, rL = eL / L;
  if (rB === 0 || rL === 0) {
    // una dirección, §6.11 paso 1: la dimensión con excentricidad se reduce en 2e
    const Bp = B - 2 * eB, Lp = L - 2 * eL;
    return { caso: "una dirección (Meyerhof)", A: Bp * Lp, Bp: Math.min(Bp, Lp), Lp: Math.max(Bp, Lp) };
  }
  if (rL >= 1 / 6 && rB >= 1 / 6) {                 // Caso I, ecs. 6.71-6.74
    const B1 = B * (1.5 - 3 * rB), L1 = L * (1.5 - 3 * rL), A = 0.5 * B1 * L1, Lp = Math.max(B1, L1);
    return { caso: "I", A, Bp: A / Lp, Lp, B1, L1 };
  }
  const trapecio = (lado: number, otro: number, eOtro: number, eLado: number) => {
    const m = (lado / 2 - eLado) / (0.5 + 6 * (eOtro / otro) ** 2), u = 12 * m * (eOtro / otro);
    return [m + u / 2, m - u / 2];
  };
  if (rL > 1 / 6 && rL < 0.5 && rB < 1 / 6) {         // Caso II, ecs. 6.75-6.77
    const [L1, L2] = trapecio(L, B, eB, eL), A = 0.5 * (L1 + L2) * B, Lp = Math.max(L1, L2);
    return { caso: "II", A, Bp: A / Lp, Lp, L1, L2 };
  }
  if (rL < 1 / 6 && rB > 1 / 6 && rB < 0.5) {         // Caso III, ecs. 6.78-6.80
    const [B1, B2] = trapecio(B, L, eL, eB), A = 0.5 * (B1 + B2) * L;
    return { caso: "III", A, Bp: A / L, Lp: L, B1, B2 };
  }
  // Caso IV (e_L/L < 1/6 y e_B/B < 1/6), ec. 6.81: A' = BL − ½(B − B2)(L − L2); se busca el triángulo
  // (catetos p = B − B2, q = L − L2) cuyo recorte deja el centroide en (e_B, e_L).
  let p = 0.5 * B, q = 0.5 * L;
  const F = (p: number, q: number) => {
    const At = (p * q) / 2, A = B * L - At;
    return [-At * (-B / 2 + p / 3) / A - eB, -At * (-L / 2 + q / 3) / A - eL];
  };
  for (let it = 0; it < 100; it++) {
    const f = F(p, q), h = 1e-7;
    const fp = F(p + h, q), fq = F(p, q + h);
    const J = [[(fp[0] - f[0]) / h, (fq[0] - f[0]) / h], [(fp[1] - f[1]) / h, (fq[1] - f[1]) / h]];
    const det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
    const dp = (f[0] * J[1][1] - f[1] * J[0][1]) / det, dq = (J[0][0] * f[1] - J[1][0] * f[0]) / det;
    p -= dp; q -= dq;
    if (Math.abs(dp) + Math.abs(dq) < 1e-13) break;
  }
  const B2 = B - p, L2 = L - q, A = B * L - (p * q) / 2;
  return { caso: "IV", A, Bp: A / L, Lp: L, B2, L2 };
}

// ─────────────────────────────────────────────────────────────────────
// PLANTILLA: el usuario pone SUS datos (el ejemplo abre con los de Das 6.10 ya calculado)
// ─────────────────────────────────────────────────────────────────────
import { SOIL_TYPES } from "../zapata-aislada/zapataAislada";

/** Parámetros de la plantilla → los del generador. e = posición de la columna + M/P (Mx gira sobre x: mueve en y). */
export function paramsDePlantilla(pr: Record<string, number>): ParamsZapataExc & { q_adm: number } {
  const P = pr.P ?? DAS_EJ610.P;
  const Lx = pr.Lx ?? DAS_EJ610.Lx, Ly = pr.Ly ?? DAS_EJ610.Ly;
  const ex = (pr.xcol ?? 0) + (P > 0 ? (pr.My ?? 0) / P : 0);
  const ey = (pr.ycol ?? 0) + (P > 0 ? (pr.Mx ?? 0) / P : 0);
  return { Lx, Ly, t: pr.t ?? DAS_EJ610.t, fc: pr.fc ?? DAS_EJ610.fc, ks: pr.ks ?? DAS_EJ610.ks, c: pr.c ?? DAS_EJ610.c, P,
           exL: ex / Lx, eyB: ey / Ly, n: Math.round(pr.n ?? DAS_EJ610.n), sinTraccion: (pr.sinTraccion ?? 1) >= 0.5, q_adm: pr.q_adm ?? 20 };
}

export const zapataLevantamientoPlantilla: ExampleDef = {
  id: "zapata-levantamiento",
  name: "Zapata con levantamiento (suelo sin tracción) · cimentación no lineal por contacto · Footing with uplift (tensionless soil)",
  category: "4️⃣ Mixtos · 🧰 Cimentaciones",
  defaultShellResult: "pressure",
  availableShellResults: ["pressure", "displacementZ", "bendingXX", "bendingYY"],
  params: {
    Lx: F("Geometría", "B en x (m)", DAS_EJ610.Lx, 0.8, 8, 0.05),
    Ly: F("Geometría", "L en y (m)", DAS_EJ610.Ly, 0.8, 8, 0.05),
    t: F("Geometría", "Espesor (m)", DAS_EJ610.t, 0.25, 2, 0.05),
    fc: F("Geometría", "f'c (kgf/cm²)", DAS_EJ610.fc, 180, 420, 10),
    c: F("Columna", "Lado columna (m)", DAS_EJ610.c, 0.2, 1, 0.05),
    xcol: F("Columna", "Posición x desde el centro (m)", 0.15, -3, 3, 0.05),
    ycol: F("Columna", "Posición y desde el centro (m)", 0.30, -3, 3, 0.05),
    P: F("Cargas", "P (tonf, hacia abajo)", DAS_EJ610.P, 0.1, 2000, 0.1),
    Mx: F("Cargas", "Mx (tonf·m) → mueve la resultante en y", 0, -500, 500, 0.5),
    My: F("Cargas", "My (tonf·m) → mueve la resultante en x", 0, -500, 500, 0.5),
    soilType: { default: 0, label: "Tipo de suelo", folder: "Suelo", options: Object.fromEntries(SOIL_TYPES.map((s, i) => [s.name, i])) },
    q_adm: F("Suelo", "q_adm (tonf/m²)", 20, 1, 300, 1),
    ks: F("Suelo", "ks (tonf/m³)", DAS_EJ610.ks, 50, 50000, 10),
    sinTraccion: { default: 1, boolean: true, label: "Suelo sin tracción (no lineal)", folder: "Suelo" },
    n: F("Malla", "Divisiones por lado", DAS_EJ610.n, 10, 80, 2),
  },
  onParamChange(key: string, params: any) {
    if (key !== "soilType") return;
    const s = SOIL_TYPES[Math.round(params.soilType)];
    if (!s || s.name === "Custom") return;
    params.q_adm = s.q_adm;
    params.ks = +(s.q_adm * s.ks_factor).toFixed(0);     // la misma correlación de zapata-aislada (kN/m³ = q_adm·9.807·f), en tonf/m³
  },
  build(pr: any, states: any, mp: any) {
    const p = paramsDePlantilla(pr);
    (window as any).__hekatanCliScript = heksZapataExcentrica(p);
    cliModeler.build({}, states, mp);
    if (typeof document !== "undefined" && document.body?.appendChild) botonTutorZapata(() => {
      const it = (window as any).__hekatanCliContactoIter;
      const nodes = states?.nodes?.val as number[][] | undefined;
      if (!it?.vueltas?.length || !nodes?.length) return null;
      return { p, nodes, vueltas: it.vueltas, nodosComp: it.nodos };
    }, hojaDas48, ["zapata-excentrica", "zapata-levantamiento"], (lang) => {
      const d = datosOpenSeesDeStates(states, "Zapata con levantamiento (Hekatan Struct)");
      return d ? opensees(d, lang) : null;
    });
  },
  computedLabels(pr: any, states: any) {
    const p = paramsDePlantilla(pr);
    const out: Record<string, string> = {};
    const ex = p.exL * p.Lx, ey = p.eyB * p.Ly;
    out["Excentricidad"] = `e_x = ${ex.toFixed(3)} m (e/B ${(p.exL).toFixed(3)}) · e_y = ${ey.toFixed(3)} m (e/L ${(p.eyB).toFixed(3)})`;
    const d = areaEfectivaDas(p.Lx, p.Ly, ex, ey);
    out["Das: caso / A' (cap. carga)"] = `${d.caso} · ${d.A.toFixed(3)} m²`;
    const U = states?.deformOutputs?.val?.deformations as Map<number, number[]> | undefined;
    const nodes = states?.nodes?.val as number[][] | undefined;
    if (U && nodes?.length) {
      let wmin = 0, nC = 0, wmax = 0;
      for (let i = 0; i < nodes.length; i++) { const w = U.get(i)?.[2] ?? 0; wmin = Math.min(wmin, w); wmax = Math.max(wmax, w); if (w < 0) nC++; }
      const q = -wmin * p.ks;
      out["q_max"] = `${q.toFixed(2)} tonf/m²`;
      out["q_max / q_adm"] = `${(q / p.q_adm).toFixed(2)} ${q > p.q_adm ? "⚠️ NO CUMPLE" : "✓"}`;
      out["Nudos en contacto"] = p.sinTraccion ? `${nC} de ${nodes.length}` : `lineal: ${nodes.length - nC} nudos con el suelo TIRANDO`;
    }
    const dentro = Math.abs(p.exL) * 6 + Math.abs(p.eyB) * 6 <= 1 + 1e-9;
    out["Estado"] = dentro ? "resultante en el núcleo: toda la base comprime" : "resultante fuera del núcleo: parte de la base se LEVANTA";
    return out;
  },
} as ExampleDef;
