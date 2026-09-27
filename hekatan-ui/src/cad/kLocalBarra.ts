/**
 * La matriz de rigidez LOCAL de una barra del modelo: los datos, la matriz y la hoja.
 *
 * Jorge, 27-sep-2026: «al pasar por una barra, la matriz local de ese elemento; usa Hekatan LISP,
 * me gusta así; para reportes de Hekatan Struct: si quiero saber la matriz de rigidez o qué
 * elementos está usando».
 *
 * La matriz NO se calcula aquí con fórmulas de libro: sale de `getLocalStiffnessMatrix`, la misma
 * función del solver (Timoshenko con áreas de cortante y liberaciones por condensación estática).
 * Lo que se enseña es lo que se resuelve. Test: `node tests/run.mjs k-local`, que resuelve un
 * voladizo con ESTA matriz y lo compara con el WASM.
 *
 * ⚠️ Los BRAZOS RÍGIDOS con factor de rigidez (`endOffsets`, rz > 0) están en la matriz de
 * TypeScript pero NO llegan al WASM (`deformCpp.ts`: «rigidOffsets sigue sin llegar al C++»).
 * Medido el 27-sep-2026 con un voladizo: con rz = 1 la matriz de TS da 11.4 % menos flecha que el
 * solver. Aquí se enseña la del SOLVER (sin brazos) y, si la barra los trae, se avisa.
 *
 * Sin DOM: lo usan la tarjeta del visor (`kLocalHover.ts`) y los tests.
 */
import { getLocalStiffnessMatrix } from "hekatan-fem";

export interface DatosBarra {
  idx: number;
  n1: number; n2: number;
  a: number[]; b: number[];
  L: number;            // de nudo a nudo: el que usa el solver
  E: number; G: number; A: number;
  I22: number; I33: number; J: number;
  As2: number; As3: number;      // áreas de cortante que USA el solver
  asPorDefecto: boolean;         // true = no venían dadas y el solver puso 5/6·A
  phi2: number; phi3: number;    // parámetro de cortante en los planos 1-3 y 1-2
  ang: number;                   // giro del eje local, grados
  liberaciones: boolean[] | null;
  brazos: number[] | null;       // [offI, offJ, rz] que trae la barra y el solver NO aplica
  formulacion: string;
}

export const GDL = ["u₁", "u₂", "u₃", "r₁", "r₂", "r₃"];

const val = (s: any) => s?.rawVal ?? s?.val ?? s;
const de = (m: any, i: number, d = 0): number => {
  const v = m?.get?.(i) ?? m?.[i];
  const x = Number(v);
  return Number.isFinite(x) ? x : d;
};

/** Los estados del modelo abierto (los mismos que usa el solver). */
export function estados(st: any): { nodos: number[][]; elems: number[][]; ei: any } {
  return { nodos: val(st?.nodes) ?? [], elems: val(st?.elements) ?? [], ei: val(st?.elementInputs) ?? {} };
}

export function datosBarra(st: any, idx: number): DatosBarra | null {
  const { nodos, elems, ei } = estados(st);
  const el = elems[idx];
  if (!el || el.length !== 2) return null;
  const a = nodos[el[0]], b = nodos[el[1]];
  if (!a || !b) return null;
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const E = de(ei.elasticities, idx), G = de(ei.shearModuli, idx), A = de(ei.areas, idx);
  // convención CSI del motor: momentsOfInertiaZ = I33 (plano 1-2) y momentsOfInertiaY = I22 (plano 1-3);
  // el área de cortante que acompaña a I33 es la del cortante V2
  const I33 = de(ei.momentsOfInertiaZ, idx), I22 = de(ei.momentsOfInertiaY, idx);
  let As2 = de(ei.shearAreasZ, idx), As3 = de(ei.shearAreasY, idx);
  const asPorDefecto = As2 === 0 && As3 === 0 && A > 0 && G > 0;
  if (asPorDefecto) As2 = As3 = (5 / 6) * A;
  const eo = ei.endOffsets?.get?.(idx) ?? null;
  const phi3 = As2 > 0 && G > 0 && L > 0 ? (12 * E * I33) / (G * As2 * L * L) : 0;
  const phi2 = As3 > 0 && G > 0 && L > 0 ? (12 * E * I22) / (G * As3 * L * L) : 0;
  const rel = ei.momentReleases?.get?.(idx) ?? null;
  const hayRel = !!rel && rel.some((r: any) => !!r);
  const hayBrazos = !!eo && eo[2] > 0 && (eo[0] > 0 || eo[1] > 0);
  const partes = ["Barra 3D de 12 grados de libertad"];
  partes.push(phi2 > 0 || phi3 > 0 ? "viga de Timoshenko (con deformación por cortante)" : "viga de Euler-Bernoulli");
  if (hayRel) partes.push("con liberaciones (condensación estática)");
  return {
    idx, n1: el[0] + 1, n2: el[1] + 1, a, b, L, E, G, A, I22, I33, J: de(ei.torsionalConstants, idx),
    As2, As3, asPorDefecto, phi2, phi3, ang: de(ei.localAngles, idx),
    liberaciones: hayRel ? Array.from(rel, (r: any) => !!r) : null,
    brazos: hayBrazos ? Array.from(eo as number[]) : null,
    formulacion: partes.join(" · "),
  };
}

/** La matriz que usa el solver, 12 × 12, en los ejes de la barra. */
export function kLocalBarra(st: any, idx: number): number[][] | null {
  const { nodos, elems, ei } = estados(st);
  const el = elems[idx];
  if (!el || el.length !== 2) return null;
  // sin los brazos rígidos: el solver (WASM) no los aplica, y aquí se enseña lo que se resuelve
  const eiSolver = ei.endOffsets ? { ...ei, endOffsets: undefined } : ei;
  const K = getLocalStiffnessMatrix([nodos[el[0]], nodos[el[1]]] as any, eiSolver, idx) as number[][];
  return K && K.length === 12 ? K : null;
}

/** Dos comprobaciones sobre la matriz que se enseña (no sobre una fórmula). */
export function comprobar(K: number[][], L: number): { simetrica: boolean; asim: number; rigido: boolean; residuo: number } {
  let mx = 0, asim = 0;
  for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) {
    mx = Math.max(mx, Math.abs(K[i][j]));
    asim = Math.max(asim, Math.abs(K[i][j] - K[j][i]));
  }
  // mover la barra entera sin deformarla no cuesta fuerza: K · r = 0 en los seis movimientos de sólido
  const r: number[][] = [];
  for (let d = 0; d < 3; d++) { const v = new Array(12).fill(0); v[d] = 1; v[6 + d] = 1; r.push(v); }
  { const v = new Array(12).fill(0); v[3] = 1; v[9] = 1; r.push(v); }                       // giro sobre el eje 1
  { const v = new Array(12).fill(0); v[4] = 1; v[10] = 1; v[8] = -L; r.push(v); }            // giro sobre el eje 2
  { const v = new Array(12).fill(0); v[5] = 1; v[11] = 1; v[7] = L; r.push(v); }             // giro sobre el eje 3
  let residuo = 0;
  for (const v of r) for (let i = 0; i < 12; i++) {
    let s = 0;
    for (let j = 0; j < 12; j++) s += K[i][j] * v[j];
    residuo = Math.max(residuo, Math.abs(s));
  }
  const esc = mx > 0 ? mx : 1;
  return { simetrica: asim / esc < 1e-9, asim: asim / esc, rigido: residuo / (esc * Math.max(1, L)) < 1e-9, residuo: residuo / esc };
}

/** Número corto para la matriz: cinco cifras significativas, sin ceros de relleno. */
export function corto(v: number): string {
  if (!Number.isFinite(v)) return "—";
  const a = Math.abs(v);
  if (a < 1e-9) return "0";
  if (a >= 1e7 || a < 1e-3) return v.toExponential(3).replace("e+", "e");
  return String(+v.toPrecision(5));
}

/** Qué elementos usa el modelo entero: tipo, cuántos y con qué formulación. */
export function elementosDelModelo(st: any): { tipo: string; n: number; formulacion: string }[] {
  const { elems, ei } = estados(st);
  let barras = 0, tri = 0, solidos = 0, thin = 0, thick = 0, memb = 0, timo = 0;
  elems.forEach((el, i) => {
    if (el.length === 2) { barras++; const d = datosBarra(st, i); if (d && (d.phi2 > 0 || d.phi3 > 0)) timo++; }
    else if (el.length === 3) tri++;
    else if (el.length === 4) {
      const pf = ei.plateFormulations?.get?.(i);
      const soloMembrana = ei.shellModifiers?.get?.(i)?.slice?.(3, 6)?.every?.((x: number) => x === 0);
      if (soloMembrana) memb++; else if (pf === 1) thin++; else thick++;
    } else if (el.length === 8) solidos++;
  });
  const out: { tipo: string; n: number; formulacion: string }[] = [];
  if (barras) out.push({ tipo: "Barra", n: barras, formulacion: timo ? `12 GDL, Timoshenko (${timo} con cortante)` : "12 GDL, Euler-Bernoulli" });
  if (thin) out.push({ tipo: "Cáscara delgada", n: thin, formulacion: "placa DKQ (Batoz y Tahar) + membrana con giro de Ibrahimbegović, Taylor y Wilson" });
  if (thick) out.push({ tipo: "Cáscara gruesa", n: thick, formulacion: "placa MITC4 (Bathe y Dvorkin) + membrana con giro de Ibrahimbegović, Taylor y Wilson" });
  if (memb) out.push({ tipo: "Membrana", n: memb, formulacion: "solo esfuerzos en su plano" });
  if (tri) out.push({ tipo: "Cáscara triangular", n: tri, formulacion: "3 nudos" });
  if (solidos) out.push({ tipo: "Sólido", n: solidos, formulacion: "hexaedro de 8 nudos" });
  return out;
}

const n = (v: number, d: number) => String(+v.toFixed(d));
/** Número ENTERO de escribir, sin exponente: la hoja de Hekatan LISP no lee «2e+8» (lo toma por 2). */
export function lit(v: number, cifras = 10): string {
  if (!Number.isFinite(v) || v === 0) return "0";
  const a = Math.abs(v), e = Math.floor(Math.log10(a));
  const dec = Math.min(20, Math.max(0, cifras - 1 - e));
  let t = v.toFixed(dec);
  if (t.includes(".")) t = t.replace(/0+$/, "").replace(/\.$/, "");
  return t;
}

const bloque = (K: number[][], f0: number, c0: number) =>
  "[" + K.slice(f0, f0 + 6).map((f) => f.slice(c0, c0 + 6).map((v) => (Math.abs(v) < 1e-9 ? "0" : lit(v, 6))).join(", ")).join("; ") + "]";

/**
 * La hoja de Hekatan LISP, en el lenguaje SIMPLE de la hoja (nada de defun): primero las fórmulas
 * en letras, después con los números de esta barra, y la matriz que usa el solver.
 */
export function hojaBarra(d: DatosBarra, K: number[][], modelo: { tipo: string; n: number; formulacion: string }[] = []): string {
  const timo = d.phi2 > 0 || d.phi3 > 0;
  const c = comprobar(K, d.L);
  const T = [
    `# Matriz de rigidez local · barra ${d.idx + 1}`,
    `#: Barra del nudo **${d.n1}** (${n(d.a[0], 3)}, ${n(d.a[1], 3)}, ${n(d.a[2], 3)}) al nudo **${d.n2}** (${n(d.b[0], 3)}, ${n(d.b[1], 3)}, ${n(d.b[2], 3)}), del modelo abierto en Hekatan Struct. La matriz local relaciona las doce fuerzas de los extremos con los doce desplazamientos, **en los ejes de la propia barra**: primero el nudo inicial (tres traslaciones y tres giros) y después el final.`,
    `#: **Elemento:** ${d.formulacion}.`,
    "",
    "## 1 · Los términos, en letras",
    "#: **Estirarse** y **torcerse**: la barra es un resorte.",
    "k_a = E*A/L",
    "k_t = G*J/L",
  ];
  if (timo) {
    T.push(
      "#: **Flectar**, con la deformación por cortante. El parámetro de cortante compara la rigidez a flexión con la de corte; si el área de cortante es muy grande vale cero y queda la viga de Euler-Bernoulli.",
      "phi = 12*E*I/(G*A_s*L^2)",
      "k_v = 12*E*I/(L^3*(1 + phi))",
      "k_m = 6*E*I/(L^2*(1 + phi))",
      "k_g = 4*E*I*(1 + phi/4)/(L*(1 + phi))",
      "k_c = 2*E*I*(1 - phi/2)/(L*(1 + phi))",
    );
  } else {
    T.push(
      "#: **Flectar**: desplazar un extremo sin dejarlo girar, el acoplamiento entre desplazar y girar, girar un extremo, y el giro cruzado del otro extremo.",
      "k_v = 12*E*I/L^3",
      "k_m = 6*E*I/L^2",
      "k_g = 4*E*I/L",
      "k_c = 2*E*I/L",
    );
  }
  T.push(
    "",
    "## 2 · Los datos de esta barra",
    "#| Dato | Valor | Dato | Valor |",
    "#|---|---:|---|---:|",
    `#| Largo L | ${n(d.L, 4)} m | Módulo E | ${lit(d.E)} kN/m² |`,
    `#| Área A | ${lit(d.A)} m² | Módulo de corte G | ${lit(d.G)} kN/m² |`,
    `#| Inercia I_{33} (plano 1-2) | ${lit(d.I33)} m⁴ | Inercia I_{22} (plano 1-3) | ${lit(d.I22)} m⁴ |`,
    `#| Área de cortante A_{s2} | ${lit(d.As2)} m² | Área de cortante A_{s3} | ${lit(d.As3)} m² |`,
    `#| Constante de torsión J | ${lit(d.J)} m⁴ | Giro del eje local | ${n(d.ang, 3)}° |`,
  );
  if (d.asPorDefecto) T.push("#: Las áreas de cortante no venían dadas: el solver usa cinco sextos del área, como ETABS.");
  if (d.brazos) T.push(`#: **Aviso:** esta barra trae brazos rígidos (${n(d.brazos[0], 4)} m y ${n(d.brazos[1], 4)} m, factor ${n(d.brazos[2], 2)}). El solver estático **no los aplica**: la matriz de abajo es la de la barra de nudo a nudo, que es con la que se calcula.`);
  if (d.liberaciones) T.push("#: Esta barra tiene **liberaciones**: los términos de abajo son los de la barra continua y la matriz final ya lleva la condensación estática.");
  const L = lit(d.L), Lf = L, E = lit(d.E), G = lit(d.G);
  T.push(
    "",
    "## 3 · Los términos, con números",
    `k_a = dec(${E}*${lit(d.A)}/${L}, 2) [kN/m] 'axial`,
    `k_t = dec(${G}*${lit(d.J)}/${L}, 2) [kN·m] 'torsión`,
    "#: Flexión en el plano 1-2 (inercia I_{33}, cortante V_{2}):",
  );
  const plano = (I: number, phi: number, s: string) => {
    const Il = lit(I), p = lit(phi);
    if (phi > 0) T.push(`phi_${s} = dec(${p}, 6) [—] 'parámetro de cortante`);
    T.push(
      `k_v${s} = dec(12*${E}*${Il}/(${Lf}^3*(1 + ${p})), 2) [kN/m]`,
      `k_m${s} = dec(6*${E}*${Il}/(${Lf}^2*(1 + ${p})), 2) [kN]`,
      `k_g${s} = dec(4*${E}*${Il}*(1 + ${p}/4)/(${Lf}*(1 + ${p})), 2) [kN·m]`,
      `k_c${s} = dec(2*${E}*${Il}*(1 - ${p}/2)/(${Lf}*(1 + ${p})), 2) [kN·m]`,
    );
  };
  plano(d.I33, d.phi3, "3");
  T.push("#: Flexión en el plano 1-3 (inercia I_{22}, cortante V_{3}):");
  plano(d.I22, d.phi2, "2");
  T.push(
    "",
    "## 4 · La matriz que usa el solver",
    "#: Orden de filas y columnas: u₁ u₂ u₃ r₁ r₂ r₃ del nudo inicial y los mismos seis del nudo final. Unidades: kN y m.",
    "#: La matriz de doce por doce se lee en cuatro bloques de seis por seis: las fuerzas de un nudo por los desplazamientos de un nudo.",
    "#: **Nudo inicial con nudo inicial:**",
    "K_ii = " + bloque(K, 0, 0),
    "#: **Nudo inicial con nudo final** (el bloque del otro lado es este mismo, traspuesto):",
    "K_ij = " + bloque(K, 0, 6),
    "#: **Nudo final con nudo final:**",
    "K_jj = " + bloque(K, 6, 6),
    `#: **Comprobaciones sobre esta matriz:** es simétrica (${c.simetrica ? "sí" : "NO"}) y los seis movimientos de sólido rígido no generan fuerza (${c.rigido ? "sí" : "NO"}).`,
  );
  if (modelo.length) {
    T.push("", "## 5 · Los elementos que usa este modelo", "#| Elemento | Cantidad | Formulación |", "#|---|---:|---|");
    for (const m of modelo) T.push(`#| ${m.tipo} | ${m.n} | ${m.formulacion} |`);
  }
  return T.join("\n");
}
