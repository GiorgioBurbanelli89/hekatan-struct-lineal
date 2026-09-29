/**
 * La matriz de rigidez LOCAL de un paño (cáscara Q4 o triángulo): los datos, la matriz y la hoja.
 *
 * Jorge, 29-sep-2026: «al acercar el cursor a las placas, cualquier tipo de placa, que se muestre
 * la matriz de rigidez local de la placa con sus formulaciones, igual que para barras, y que
 * muestren las operaciones simbólicas como Hekatan LISP».
 *
 * La matriz NO se escribe aquí: sale de `kPano` (hekatan-fem), que la LEE del motor C++ para el
 * Shell-Thick (`didactic_solve` devuelve la misma K que ensambla `deform`) y la arma con la DKQ para
 * el Shell-Thin. Test: `node tests/run.mjs k-local-pano`, que resuelve un paño en voladizo con ESTA
 * matriz y lo compara con el WASM.
 *
 * Lo simbólico de un paño no es una matriz de fórmulas cerradas como la de la barra: sus términos
 * salen de integrar Bᵀ·D·B en puntos de Gauss. Lo que se enseña en letras es lo que SÍ es cerrado —
 * las funciones de forma, el jacobiano, las matrices del material D y la regla de integración— y
 * después los números de ESTE paño. Solo formulaciones publicadas, con su cita.
 *
 * Sin DOM: lo usan la tarjeta del visor (`kLocalHover.ts`) y los tests.
 */
import { kPano, type KPano } from "hekatan-fem";
import { estados, lit } from "./kLocalBarra";

export interface DatosPano {
  idx: number;
  nudos: number[];              // numeración de 1
  p: number[][];                // coordenadas globales de los nudos
  E: number; nu: number; t: number; G: number;
  tipoPlaca: number;            // plateFormulations: 0/2 Thick (MITC4), 1 Thin, 3 DKMQ, 4 DSE
  tipoDrill: number;            // drillingTypes (13 = defecto del motor)
  gammaFac: number;             // drillingPenaltyScales (γ/G)
  modificadores: number[] | null;
  soloMembrana: boolean;        // M11 = M22 = M12 = 0: el paño trabaja solo en su plano
  k: KPano;
}

const de = (m: any, i: number, d: number): number => {
  const v = Number(m?.get?.(i) ?? m?.[i]);
  return Number.isFinite(v) ? v : d;
};

export function datosPano(st: any, idx: number): DatosPano | null {
  const { nodos, elems, ei } = estados(st);
  const el = elems[idx];
  if (!el || (el.length !== 4 && el.length !== 3)) return null;
  const p = el.map((n) => nodos[n]);
  if (p.some((q) => !q)) return null;
  const E = de(ei.elasticities, idx, 0), t = de(ei.thicknesses, idx, 0);
  const nu = de(ei.poissonsRatios, idx, 0.2);
  if (!(E > 0) || !(t > 0)) return null;
  const tipoPlaca = de(ei.plateFormulations, idx, 0), tipoDrill = de(ei.drillingTypes, idx, 13);
  const gammaFac = de(ei.drillingPenaltyScales, idx, 0.4);
  const mod = ei.shellModifiers?.get?.(idx);
  const modificadores = Array.isArray(mod) && mod.some((q: number) => q !== 1) ? Array.from(mod as number[]) : null;
  const soloMembrana = !!modificadores && modificadores.slice(3, 6).every((q) => q === 0);
  let k: KPano;
  try { k = kPano(p, E, nu, t, { tipoPlaca, tipoDrill, gammaFac }); } catch { return null; }
  return {
    idx, nudos: el.map((n) => n + 1), p, E, nu, t, G: E / (2 * (1 + nu)),
    tipoPlaca, tipoDrill, gammaFac, modificadores, soloMembrana, k,
  };
}

/**
 * La K del paño en los ejes del elemento, con los 6 gdl de cada nudo [u1 u2 u3 θ1 θ2 θ3]:
 * la flexión va en [u3 θ1 θ2] y la membrana en [u1 u2 θ3]. En un paño plano no se acoplan.
 * `null` si falta alguno de los dos bloques.
 */
export function kPano6(k: KPano): number[][] | null {
  if (!k.flexion || !k.membrana) return null;
  const n = k.nNudos, N = 6 * n;
  const K = Array.from({ length: N }, () => new Array<number>(N).fill(0));
  const pon = (B: number[][], loc: number[]) => {
    for (let a = 0; a < n; a++) for (let b = 0; b < n; b++)
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++)
        K[6 * a + loc[i]][6 * b + loc[j]] = B[3 * a + i][3 * b + j];
  };
  pon(k.flexion, [2, 3, 4]);
  pon(k.membrana, [0, 1, 5]);
  return K;
}

export const GDL_FLEXION = ["w", "θ₁", "θ₂"];
export const GDL_MEMBRANA = ["u₁", "u₂", "θ₃"];

/** Texto de la formulación de este paño, con su cita. */
export function formulacionPano(d: DatosPano): { placa: string; membrana: string; cita: string } {
  const t = d.tipoPlaca;
  const placa =
    t === 1 ? (d.p.length === 4 ? "Shell-Thin: placa DKQ (Batoz y Tahar, 1982), sin deformación por cortante" : "Shell-Thin: placa DKT (triángulo)")
    : t === 3 ? "placa DKMQ (Katili, 1993)"
    : t === 4 ? "placa DSE (Wilson, cap. 8)"
    : d.p.length === 4 ? "Shell-Thick: placa MITC4 (Bathe y Dvorkin, 1985) con modos incompatibles de Wilson"
    : "Shell-Thick (triángulo)";
  const membrana = d.tipoDrill === 13
    ? "membrana con giro de Ibrahimbegović, Taylor y Wilson (1990), Gauss 2×2, penalización γ = 0.4·G y estabilización del reloj de arena"
    : `membrana con giro, tipo ${d.tipoDrill}`;
  const cita = t === 1
    ? "Batoz y Tahar (1982), IJNME 18:1655 · Ibrahimbegović, Taylor y Wilson (1990), IJNME 30:445"
    : "Bathe y Dvorkin (1985), IJNME 21:367 · Wilson et al. (1973) · Ibrahimbegović, Taylor y Wilson (1990), IJNME 30:445";
  return { placa, membrana, cita };
}

const n = (v: number, dd: number) => String(+v.toFixed(dd));
const bloque6 = (K: number[][], f0: number, c0: number, nf: number, nc: number) =>
  "[" + K.slice(f0, f0 + nf).map((f) => f.slice(c0, c0 + nc).map((v) => (Math.abs(v) < 1e-9 ? "0" : lit(v, 6))).join(", ")).join("; ") + "]";

/**
 * La hoja de Hekatan LISP del paño, en el lenguaje simple de la hoja: primero en letras (funciones de
 * forma, jacobiano, matrices del material, integral), después con los números de este paño y al final
 * la matriz que usa el solver, en bloques de 6 × 6.
 */
export function hojaPano(d: DatosPano): string {
  const f = formulacionPano(d);
  const q4 = d.p.length === 4;
  const thin = d.tipoPlaca === 1;
  const { xl, yl } = d.k;
  const T: string[] = [
    `# Matriz de rigidez local · paño ${d.idx + 1}`,
    `#: Paño de **${d.p.length} nudos** (${d.nudos.join(", ")}) del modelo abierto en Hekatan Struct. Un paño de cáscara plana son **dos elementos superpuestos** que no se acoplan: una **placa** (flexión: el paño se dobla) y una **membrana** (el paño se estira en su plano). Por eso la matriz se enseña en dos bloques.`,
    `#: **Placa:** ${f.placa}.`,
    `#: **Membrana:** ${f.membrana}.`,
    `#: Fuentes: ${f.cita}.`,
    "",
    "## 1 · Las funciones de forma, en letras",
  ];
  if (q4) {
    T.push(
      "#: El paño real se dibuja sobre un cuadrado de referencia con coordenadas {xi} y {eta} entre −1 y 1. Cada función de forma vale 1 en su nudo y 0 en los otros tres:",
      "N_1 = (1 - xi)*(1 - eta)/4",
      "N_2 = (1 + xi)*(1 - eta)/4",
      "N_3 = (1 + xi)*(1 + eta)/4",
      "N_4 = (1 - xi)*(1 + eta)/4",
      "#: Cualquier punto del paño es la suma de los nudos pesados con esas funciones: x = Σ N_{i}·x_{i}, y = Σ N_{i}·y_{i}.",
      "",
      "## 2 · El jacobiano: del cuadrado al paño real",
      "#: El jacobiano mide cuánto se estira el cuadrado de referencia para llegar al paño. Son las derivadas de x e y respecto a {xi} y {eta}:",
      "dN1_dxi = Diff{(1 - xi)*(1 - eta)/4 @ xi}",
      "dN1_deta = Diff{(1 - xi)*(1 - eta)/4 @ eta}",
      "#: Con las cuatro funciones: J_{11} = Σ ∂N_{i}/∂ξ · x_{i}, J_{12} = Σ ∂N_{i}/∂ξ · y_{i}, J_{21} = Σ ∂N_{i}/∂η · x_{i}, J_{22} = Σ ∂N_{i}/∂η · y_{i}. Su determinante es el factor de área: dA = det(J)·dξ·dη.",
    );
  } else {
    T.push(
      "#: En el triángulo las funciones de forma son las coordenadas de área: N_{1} = 1 − r − s, N_{2} = r, N_{3} = s.",
    );
  }
  T.push(
    "",
    "## 3 · El material: las matrices D, en letras",
    "#: **Placa, flexión.** Relaciona los momentos con las curvaturas. Sale de Hooke en tensión plana integrado en el espesor (por eso el t³):",
    "D_b = E*t^3/(12*(1 - nu^2))*[1, nu, 0; nu, 1, 0; 0, 0, (1 - nu)/2]",
  );
  if (!thin) T.push(
    "#: **Placa, cortante transversal** (solo en la placa gruesa). El factor 5/6 corrige que el cortante real no es uniforme en el espesor:",
    "D_s = 5/6*G*t*[1, 0; 0, 1]",
  );
  else T.push("#: La placa delgada (DKQ) **no tiene cortante transversal**: impone la hipótesis de Kirchhoff en puntos discretos del borde, y por eso no lleva D_{s}.");
  T.push(
    "#: **Membrana.** Relaciona las fuerzas en el plano con los estiramientos (el espesor entra una vez):",
    "D_m = E*t/(1 - nu^2)*[1, nu, 0; nu, 1, 0; 0, 0, (1 - nu)/2]",
    "",
    "## 4 · La rigidez: la integral de Bᵀ·D·B",
    "#: La matriz B convierte los desplazamientos de los nudos en curvaturas (placa) o estiramientos (membrana): son derivadas de las funciones de forma. La rigidez es la energía de deformación, integrada en el paño:",
    "#: K_{b} = ∫ B_{b}ᵀ·D_{b}·B_{b} dA" + (thin ? "" : "   +   ∫ B_{s}ᵀ·D_{s}·B_{s} dA") + "   (placa)",
    "#: K_{m} = ∫ B_{m}ᵀ·D_{m}·B_{m} dA   +   la penalización del giro en el plano   (membrana)",
    "#: La integral se hace con puntos de Gauss: se evalúa el integrando en cada punto, se multiplica por det(J) y por el peso, y se suma.",
  );
  if (q4) T.push(
    "g = 1/sqrt(3) @@(puntos de Gauss 2×2: ξ, η = ±g, peso 1)",
    `#: **Lo propio de cada formulación.** ${thin
      ? "DKQ: la B_{b} sale de los giros de Kirchhoff impuestos en los lados (Batoz y Tahar, 1982)."
      : "MITC4: el cortante B_{s} no se toma de las funciones de forma sino de cuatro puntos en la mitad de los lados, para que el paño delgado no se bloquee (Bathe y Dvorkin, 1985). A la flexión se le suman cuatro modos incompatibles de Wilson, que se condensan: K = K_{cc} − K_{ci}·K_{ii}⁻¹·K_{ic}."}`,
    "#: Membrana: los lados llevan el giro en el plano (interpolación de Allman) y una burbuja que se condensa; el giro se ata al giro del sólido con la penalización γ = 0.4·G en el centro (Ibrahimbegović, Taylor y Wilson, 1990).",
  );
  // ── con números ──
  const D0 = (d.E * d.t ** 3) / (12 * (1 - d.nu ** 2));
  const Dm0 = (d.E * d.t) / (1 - d.nu ** 2);
  T.push(
    "",
    "## 5 · Los datos de este paño",
    "#| Dato | Valor | Dato | Valor |",
    "#|---|---:|---|---:|",
    `#| Módulo E | ${lit(d.E)} kN/m² | Poisson ν | ${n(d.nu, 4)} |`,
    `#| Espesor t | ${n(d.t, 4)} m | Módulo de corte G | ${lit(d.G)} kN/m² |`,
    `#| Área | ${n(d.k.area, 4)} m² | Nudos | ${d.nudos.join(", ")} |`,
    "#: Coordenadas de los nudos **en los ejes del elemento** (origen en el centro del paño; el eje 1 va del lado 1-2 al 4-3, el eje 3 es la normal):",
    "#| Nudo | x (m) | y (m) |",
    "#|---|---:|---:|",
    ...d.nudos.map((nn, i) => `#| ${nn} | ${n(xl[i], 4)} | ${n(yl[i], 4)} |`),
  );
  if (d.modificadores) T.push(`#: Este paño tiene **modificadores** (${d.modificadores.join(" / ")}): la matriz de abajo es la SIN modificar.`);
  T.push(
    "",
    "## 6 · Las matrices D, con números",
    `D_b = dec(${lit(D0)}*[1, ${lit(d.nu)}, 0; ${lit(d.nu)}, 1, 0; 0, 0, ${lit((1 - d.nu) / 2)}], 2) [kN·m]`,
  );
  if (!thin) T.push(`D_s = dec(${lit((5 / 6) * d.G * d.t)}*[1, 0; 0, 1], 2) [kN/m]`);
  T.push(`D_m = dec(${lit(Dm0)}*[1, ${lit(d.nu)}, 0; ${lit(d.nu)}, 1, 0; 0, 0, ${lit((1 - d.nu) / 2)}], 2) [kN/m]`);
  if (q4) {
    // det(J) en los 4 puntos de Gauss, con las coordenadas de este paño
    const g = 1 / Math.sqrt(3);
    const dets: string[] = [];
    for (const [xi, et] of [[-g, -g], [g, -g], [g, g], [-g, g]]) {
      const dxi = [-(1 - et), 1 - et, 1 + et, -(1 + et)].map((v) => v / 4);
      const det = [-(1 - xi), -(1 + xi), 1 + xi, 1 - xi].map((v) => v / 4);
      let a = 0, b = 0, c = 0, e = 0;
      for (let i = 0; i < 4; i++) { a += dxi[i] * xl[i]; b += dxi[i] * yl[i]; c += det[i] * xl[i]; e += det[i] * yl[i]; }
      dets.push(n(a * e - b * c, 6));
    }
    T.push(
      "#: El determinante del jacobiano en los cuatro puntos de Gauss. Sumados (peso 1) dan el área del paño:",
      `#| Punto | ξ, η | det(J) |`,
      "#|---|---|---:|",
      ...dets.map((v, i) => `#| ${i + 1} | ${["−g, −g", "+g, −g", "+g, +g", "−g, +g"][i]} | ${v} |`),
      `#: Suma = ${n(dets.reduce((s, v) => s + Number(v), 0), 6)} m², área del paño = ${n(d.k.area, 6)} m².`,
    );
  }
  // ── la matriz del solver ──
  const nn = d.p.length, N = 3 * nn;
  const orden = (g: string[]) => d.nudos.map((x) => g.map((q) => `${q}(${x})`).join(" ")).join(" · ");
  T.push("", "## 7 · La matriz que usa el solver");
  if (d.k.aviso) T.push(`#: ${d.k.aviso}`);
  const partes = (K: number[][], nombre: string) => {
    // 12 × 12 en bloques de 6 × 6 (la hoja recorta más de 6 columnas)
    const m = Math.ceil(N / 6);
    for (let a = 0; a < m; a++) for (let b = a; b < m; b++) {
      const nf = Math.min(6, N - 6 * a), nc = Math.min(6, N - 6 * b);
      T.push(`${nombre}_${a + 1}${b + 1} = ` + bloque6(K, 6 * a, 6 * b, nf, nc));
    }
    T.push(`#: Los bloques de debajo de la diagonal son los de arriba traspuestos (la matriz es simétrica).`);
  };
  if (d.k.flexion) {
    T.push(`#: **Placa** (${N} × ${N}), filas y columnas en este orden: ${orden(["w", "θ1", "θ2"])}. Unidades: kN y m.`);
    partes(d.k.flexion, "K_b");
  }
  if (d.k.membrana) {
    T.push(`#: **Membrana** (${N} × ${N}), orden: ${orden(["u1", "u2", "θ3"])}.`);
    partes(d.k.membrana, "K_m");
  }
  const c = comprobarPano(d.k);
  T.push(`#: **Comprobaciones sobre esta matriz:** simétrica (${c.simetrica ? "sí" : "NO"}); modos de energía nula de la placa: ${c.nulosFlexion ?? "—"} (tiene que haber 3: bajar el paño y girarlo sobre sus dos ejes); de la membrana: ${c.nulosMembrana ?? "—"} (3: dos traslaciones en el plano y el giro).`);
  return T.join("\n");
}

/** Autovalores de una matriz simétrica (Jacobi cíclico). Chica: 12 × 12. */
function autovalores(A0: number[][]): number[] {
  const n = A0.length, A = A0.map((f) => [...f]);
  for (let barrido = 0; barrido < 100; barrido++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
      const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
      const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) {
        const akp = A[k][p], akq = A[k][q];
        A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq;
      }
      for (let k = 0; k < n; k++) {
        const apk = A[p][k], aqk = A[q][k];
        A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk;
      }
    }
  }
  return A.map((f, i) => f[i]);
}

/** Simetría y modos de energía nula (autovalores ≈ 0 respecto al mayor). */
export function comprobarPano(k: KPano): { simetrica: boolean; nulosFlexion: number | null; nulosMembrana: number | null } {
  let simetrica = true;
  const nulos = (K: number[][] | null) => {
    if (!K) return null;
    let mx = 0;
    for (let i = 0; i < K.length; i++) for (let j = 0; j < K.length; j++) {
      mx = Math.max(mx, Math.abs(K[i][j]));
      if (Math.abs(K[i][j] - K[j][i]) > 1e-9 * (Math.abs(K[i][j]) + 1)) simetrica = false;
    }
    const ev = autovalores(K);
    const top = Math.max(...ev.map(Math.abs));
    return ev.filter((v) => Math.abs(v) < 1e-8 * top).length;
  };
  const nf = nulos(k.flexion), nm = nulos(k.membrana);
  return { simetrica, nulosFlexion: nf, nulosMembrana: nm };
}
