/**
 * ZAPATA COMPARATIVA: 5 modelos históricos ISSE lado a lado
 *
 * Ejemplo educativo para el TFM: muestra cómo la elección del modelo
 * de soporte cambia w_max, q_max y rigidez efectiva. Cada modelo
 * representa una era de la ingeniería estructural:
 *
 *   1. Base empotrada     — ingeniero clásico 1960 (UBC, antiguos)
 *   2. Winkler vertical   — Winkler 1867 / Hetényi 1946
 *   3. Winkler 3D Bowles  — Bowles 1996 §16 (kh = 0.5·kv)
 *   4. Vesic 1973         — ks computado de E_s (Bowles §16.2)
 *   5. Winkler + anti-sing — práctica moderna (resortes torsionales)
 *
 * El usuario elige modelo via dropdown. Se resuelve el caso para ESE
 * modelo + se computa w_max, q_max, q_avg, etc. En computedLabels se
 * muestra la **comparación numérica de TODOS los 5 modelos** corridos
 * en paralelo para que el usuario vea las diferencias.
 */
import { plateQ4Solve, type PlateQ4Output } from "hekatan-fem";
import { f2kDelPlateQ4 } from "../shared/f2kPlateQ4";
import { cargaColumnaConsistente } from "../shared/cargaColumnaConsistente";
import type { ExampleDef } from "../workspace/exampleRegistry";

const TONF_TO_KN = 9.80665;

type ModelResult = {
  w_max_mm: number;
  q_max_kNm2: number;
  q_avg_kNm2: number;
  uniformidad: number;     // q_min / q_max (1 = uniforme, <1 = concentración)
  output: PlateQ4Output;
};

function buildMesh(Lz: number, Bz: number, nx: number, ny: number) {
  const nxn = nx + 1, nyn = ny + 1;
  const dx = Lz / nx, dy = Bz / ny;
  const nodes: [number, number][] = [];
  for (let j = 0; j < nyn; ++j)
    for (let i = 0; i < nxn; ++i)
      nodes.push([i * dx, j * dy]);
  const elements: [number, number, number, number][] = [];
  for (let j = 0; j < ny; ++j)
    for (let i = 0; i < nx; ++i) {
      const n0 = j * nxn + i;
      elements.push([n0, n0 + 1, n0 + nxn + 1, n0 + nxn]);
    }
  return { nxn, nyn, dx, dy, nodes, elements };
}

function runModel(
  modelId: number,
  Lz: number, Bz: number, tz: number,
  E_kNm2: number, nu: number,
  ks_kNm3: number, P_kN: number,
  nx: number, ny: number, col_size: number,
): ModelResult {
  const { nxn, nyn, dx, dy, nodes, elements } = buildMesh(Lz, Bz, nx, ny);
  const springs: Array<{ node: number; dof: number; k: number }> = [];
  const bcs: Array<{ node: number; dof: number; value: number }> = [];

  const ic = Math.floor(nx / 2), jc = Math.floor(ny / 2);
  const centerNode = jc * nxn + ic;

  // ⚠️ Antes esto era `[{ node: centerNode, value: -P_kN }]`: TODA la carga de
  // la columna en UN nudo. Y una carga puntual sobre una placa es una
  // **singularidad**: la flecha bajo el punto no converge, CRECE al refinar la
  // malla. O sea que el `w_max` que compara los 5 modelos no era un resultado
  // sino un artefacto del tamaño de celda — y encima cambiaba al mover `nx`.
  // Medido contra la integral consistente en la zapata validada contra SAP2000
  // (1.50×1.50, t=0.40, P=100 tonf, ks=2000, malla 10×10): **0.472 %** ya en
  // malla gruesa, y subiendo.
  // Ahora la columna entra como presión sobre su huella, integrada contra las
  // funciones de forma — que es lo que hacen SAFE, SAP2000 y el propio `.heks`.
  const carga = cargaColumnaConsistente(nodes, elements, P_kN,
                                        Lz / 2, Bz / 2, col_size);
  const pointLoads = carga.pointLoads;

  // ── Springs según modelo ─────────────────────────────────────────
  const addNodalSpring = (nodeIdx: number, A_trib: number, includeHorizontal: boolean, includeTorsion: boolean) => {
    springs.push({ node: nodeIdx, dof: 0, k: ks_kNm3 * A_trib });     // dof 0 = w
    if (includeHorizontal) {
      // Winkler 3D Bowles: kh = 0.5·kv
      // En plateQ4 dof=1 es βx, dof=2 es βy (rotaciones plate),
      // NO ux/uy. Las "horizontal springs" reales requerirían el solver
      // 6-DOF, fuera del scope de plate Q4. Aquí se incluye como spring
      // torsional débil con valor escalado (proxy didáctico).
      const kh = 0.5 * ks_kNm3 * A_trib;
      springs.push({ node: nodeIdx, dof: 1, k: kh * 1e-3 });
      springs.push({ node: nodeIdx, dof: 2, k: kh * 1e-3 });
    }
    if (includeTorsion) {
      const k_theta = 1e-6 * ks_kNm3 * dx * dy;
      springs.push({ node: nodeIdx, dof: 1, k: k_theta });
      springs.push({ node: nodeIdx, dof: 2, k: k_theta });
    }
  };

  for (let j = 0; j < nyn; ++j)
    for (let i = 0; i < nxn; ++i) {
      const onEdgeI = (i === 0 || i === nxn - 1);
      const onEdgeJ = (j === 0 || j === nyn - 1);
      const factor = onEdgeI && onEdgeJ ? 0.25 : (onEdgeI || onEdgeJ ? 0.5 : 1.0);
      const A_trib = dx * dy * factor;
      const nodeIdx = j * nxn + i;
      const corner = onEdgeI && onEdgeJ;

      switch (modelId) {
        case 0:  // 1960 — Base empotrada (todos los nodos clamped en w)
          bcs.push({ node: nodeIdx, dof: 0, value: 0 });
          break;
        case 1:  // Winkler clásico (1867) — vertical solo
          addNodalSpring(nodeIdx, A_trib, false, false);
          break;
        case 2:  // Winkler 3D Bowles (1996) — vertical + horizontal proxy
          addNodalSpring(nodeIdx, A_trib, true, false);
          break;
        case 3:  // Vesic 1973 — ks viene de E_s (ya escalado en el caller)
          addNodalSpring(nodeIdx, A_trib, false, false);
          break;
        case 4:  // Winkler + anti-singular (moderno, lo que usamos en otros benchmarks)
          addNodalSpring(nodeIdx, A_trib, false, corner);
          break;
      }
    }

  // Anti-singular para todos los modelos que tienen Q4 plate (no para empotrada que ya tiene BCs)
  if (modelId !== 0) {
    // Asegurar que al menos un punto está restringido en βx/βy para suprimir
    // modos rígidos rotacionales
    if (modelId === 1 || modelId === 2 || modelId === 3) {
      bcs.push({ node: 0, dof: 1, value: 0 });
      bcs.push({ node: 0, dof: 2, value: 0 });
    }
  }

  const output = plateQ4Solve({
    E: E_kNm2, nu, thickness: tz, theoryType: 0,
    bcType: "none", nodes, elements,
    bcs, pointLoads, springs,
  });

  // Métricas
  let w_max = 0;
  let q_max = 0;
  let q_min = Infinity;
  let q_sum = 0, q_count = 0;
  for (const r of output.nodeResults) {
    if (Math.abs(r.w) > Math.abs(w_max)) w_max = r.w;
    const q = ks_kNm3 * Math.abs(r.w);
    if (q > q_max) q_max = q;
    if (q < q_min && q > 0) q_min = q;
    q_sum += q;
    q_count++;
  }
  if (!isFinite(q_min)) q_min = 0;
  const q_avg = q_count > 0 ? q_sum / q_count : 0;
  const uniformidad = q_max > 0 ? q_min / q_max : 1;

  return {
    w_max_mm: w_max * 1000,
    q_max_kNm2: q_max,
    q_avg_kNm2: q_avg,
    uniformidad,
    output,
    springs, pointLoads,   // para «Exportar F2K» (SAFE): el modelo que resolvio el solver
  };
}

const MODEL_NAMES: Record<number, string> = {
  0: "1️⃣ Empotrada (UBC 1960)",
  1: "2️⃣ Winkler vertical (1867)",
  2: "3️⃣ Winkler 3D Bowles (1996)",
  3: "4️⃣ Vesic ks-analítico (1973)",
  4: "5️⃣ Winkler + anti-sing (moderno)",
};

export const safeBenchComparativa: ExampleDef = {
  id: "safe-bench-zapata-comparativa",
  name: "🎓 Zapata ISSE Comparativa: Empotrada vs Winkler vs Vesic (5 autores)",
  category: "2️⃣ Shells · 🧰 Cimentaciones",
  benchmark: true,
  defaultShellResult: "pressure",
  availableShellResults: [
    "none", "pressure",
    "membraneXX", "membraneYY", "membraneXY",
    "membranePrincipalMax", "membranePrincipalMin", "vonMises",
    "tranverseShearX", "tranverseShearY", "transverseShearMax",
    "bendingXX", "bendingYY", "bendingXY",
    "bendingPrincipalMax", "bendingPrincipalMin",
    "displacementX", "displacementY", "displacementZ",
  ],
  hasModal: false,
  guide: [
    "Ejemplo didáctico para mostrar la EVOLUCIÓN HISTÓRICA de modelos ISSE",
    "Selector 'Modelo' cambia entre 5 enfoques clásicos (1867-presente)",
    "Empotrada da MENOS asentamiento pero MAYORES momentos en columna (rigidez sobreestimada)",
    "Winkler/Vesic dan asentamientos realistas + redistribución a la zapata",
    "Tabla 'Comparativa autores' muestra los 5 modelos corridos en paralelo",
    "Use ks_factor=10.5 Bowles para arena media (default), 12 para arena densa, 15 para roca",
  ],
  params: {
    model: {
      default: 4,
      options: {
        "1️⃣ Empotrada (UBC 1960)":          0,
        "2️⃣ Winkler vertical (1867)":      1,
        "3️⃣ Winkler 3D Bowles (1996)":     2,
        "4️⃣ Vesic ks-analítico (1973)":   3,
        "5️⃣ Winkler + anti-sing (moderno)": 4,
      },
      label: "📚 Modelo histórico",
    },
    Lz: { default: 1.5, min: 1, max: 4, step: 0.05, label: "Lz (m)" },
    Bz: { default: 1.5, min: 1, max: 4, step: 0.05, label: "Bz (m)" },
    tz: { default: 0.30, min: 0.1, max: 1, step: 0.05, label: "t (m)" },
    q_adm_tonf: { default: 20, min: 1, max: 100, step: 1, label: "q_adm (tonf/m²)" },
    ks_factor_Bowles: { default: 10.5, min: 5, max: 20, step: 0.5, label: "ks_factor Bowles" },
    E_suelo_kPa: { default: 25000, min: 1000, max: 500000, step: 1000, label: "E suelo (kPa) — Vesic" },
    nu_suelo: { default: 0.30, min: 0.1, max: 0.45, step: 0.05, label: "ν suelo — Vesic" },
    P_tonf: { default: 20, min: 1, max: 100, step: 1, label: "P central (tonf)" },
    col_size: { default: 0.30, min: 0.15, max: 1.0, step: 0.05,
                label: "lado de la columna (m)" },
    nx: { default: 12, min: 6, max: 24, step: 2, label: "nx mesh" },
    ny: { default: 12, min: 6, max: 24, step: 2, label: "ny mesh" },
  },
  computedLabels(p) {
    const Lz = p.Lz, Bz = p.Bz, tz = p.tz;
    const q_adm_kN = p.q_adm_tonf * TONF_TO_KN;
    const P_kN = p.P_tonf * TONF_TO_KN;
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const col_size = p.col_size;
    const E_kNm2 = 24855e3;   // concreto 4000 psi
    const nu = 0.20;

    // ks según método: Bowles vs Vesic
    const ks_Bowles = q_adm_kN * p.ks_factor_Bowles;
    // Vesic 1973 (Bowles §16.2): ks = 0.65·E_s/(B(1-ν²)) · (E_s·B⁴/(E_c·I_c))^(1/12)
    const Es = p.E_suelo_kPa;
    const nus = p.nu_suelo;
    const Ec = E_kNm2;
    const Ic = tz ** 3 / 12;
    const B = Math.min(Lz, Bz);
    const ratio = Math.pow((Es * B ** 4) / (Ec * Ic), 1 / 12);
    const ks_Vesic = 0.65 * ratio * Es / (B * (1 - nus * nus));

    // Correr los 5 modelos en paralelo
    const r0 = runModel(0, Lz, Bz, tz, E_kNm2, nu, ks_Bowles, P_kN, nx, ny, col_size);
    const r1 = runModel(1, Lz, Bz, tz, E_kNm2, nu, ks_Bowles, P_kN, nx, ny, col_size);
    const r2 = runModel(2, Lz, Bz, tz, E_kNm2, nu, ks_Bowles, P_kN, nx, ny, col_size);
    const r3 = runModel(3, Lz, Bz, tz, E_kNm2, nu, ks_Vesic, P_kN, nx, ny, col_size);
    const r4 = runModel(4, Lz, Bz, tz, E_kNm2, nu, ks_Bowles, P_kN, nx, ny, col_size);

    // Cargas equivalentes para empotrada (no tiene springs → no aplica q_max)
    const fmt = (v: number, d = 2) => Number.isFinite(v) ? v.toFixed(d) : "—";

    return {
      "── 📚 Comparativa ISSE 5 autores ──": "",
      [`Modelo activo (vista 3D)`]: MODEL_NAMES[p.model | 0] ?? "—",
      "ks Bowles (kN/m³)": fmt(ks_Bowles, 0),
      "ks Vesic (kN/m³)":  fmt(ks_Vesic, 0),
      "── w_max [mm] por modelo ──": "",
      "1. Empotrada":      `${fmt(Math.abs(r0.w_max_mm), 4)} (rigid)`,
      "2. Winkler vert.":  fmt(Math.abs(r1.w_max_mm), 4),
      "3. Winkler 3D Bow.": fmt(Math.abs(r2.w_max_mm), 4),
      "4. Vesic ks-analit.": fmt(Math.abs(r3.w_max_mm), 4),
      "5. Winkler+antisig.": fmt(Math.abs(r4.w_max_mm), 4),
      "── q_max [kN/m²] por modelo ──": "",
      "q_max 1. Empot.":   "0 (no hay springs)",
      "q_max 2. Winkler":  fmt(r1.q_max_kNm2, 2),
      "q_max 3. W3D Bow.": fmt(r2.q_max_kNm2, 2),
      "q_max 4. Vesic":    fmt(r3.q_max_kNm2, 2),
      "q_max 5. W+antis.": fmt(r4.q_max_kNm2, 2),
      "── Uniformidad q_min/q_max ──": "",
      "Unif. 2. Winkler":  fmt(r1.uniformidad, 3),
      "Unif. 3. W3D Bow.": fmt(r2.uniformidad, 3),
      "Unif. 4. Vesic":    fmt(r3.uniformidad, 3),
      "Unif. 5. W+antis.": fmt(r4.uniformidad, 3),
      "── Análisis ──": "",
      "Era 1960 (1)": "Subestima asentamiento, sobreestima fuerzas en columna",
      "Era Bowles (2-3,5)": "Asentamiento realista, distribución uniforme",
      "Era Vesic (4)": "ks computado de E_s → mejor para suelos blandos",
      "Recomendación moderna": "Modelo 5 (Winkler + anti-sing)",
    };
  },
  build(p, states) {
    const Lz = p.Lz, Bz = p.Bz, tz = p.tz;
    const E_kNm2 = 24855e3, nu = 0.20;
    const ks_Bowles = p.q_adm_tonf * TONF_TO_KN * p.ks_factor_Bowles;
    // Vesic
    const Es = p.E_suelo_kPa, nus = p.nu_suelo;
    const Ec = E_kNm2;
    const Ic = tz ** 3 / 12;
    const B = Math.min(Lz, Bz);
    const ratio = Math.pow((Es * B ** 4) / (Ec * Ic), 1 / 12);
    const ks_Vesic = 0.65 * ratio * Es / (B * (1 - nus * nus));

    const modelId = Math.round(p.model);
    const ks_used = modelId === 3 ? ks_Vesic : ks_Bowles;
    const P_kN = p.P_tonf * TONF_TO_KN;
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const col_size = p.col_size;

    const r = runModel(modelId, Lz, Bz, tz, E_kNm2, nu, ks_used, P_kN, nx, ny, col_size);

    // Populate states
    const { nodes, elements } = buildMesh(Lz, Bz, nx, ny);
    const N3D: [number, number, number][] = nodes.map(n => [n[0], n[1], 0]);
    states.nodes.val = N3D;
    states.elements.val = elements as unknown as number[][];
    states.nodeInputs.val = { supports: new Map(), loads: new Map(),
      // Para «Exportar F2K» (SAFE): muelles y cargas del SOLVER en la convencion de 6 gdl.
      ...f2kDelPlateQ4(r.springs, r.pointLoads) } as any;
    states.elementInputs.val = {
      elasticities: new Map(elements.map((_, i) => [i, E_kNm2])),
      poissonsRatios: new Map(elements.map((_, i) => [i, nu])),
      thicknesses: new Map(elements.map((_, i) => [i, tz])),
    };
    const deformations = new Map<number, [number, number, number, number, number, number]>();
    r.output.nodeResults.forEach((nr, iNr) => {
      // nr.node no existe en PlateQ4NodeResult: es el indice del array.
      deformations.set(iNr, [0, 0, nr.w, nr.bx, nr.by, 0]);
    })
    states.deformOutputs.val = { deformations, reactions: new Map() };

    const pressure = new Map<number, number[]>();
    const bendingXX = new Map<number, number[]>();
    const bendingYY = new Map<number, number[]>();
    const bendingXY = new Map<number, number[]>();
    const vonMises = new Map<number, number[]>();
    elements.forEach((el, i) => {
      pressure.set(i, el.map(n => ks_used * r.output.nodeResults[n].w));
      const er = r.output.elementResults[i];
      bendingXX.set(i, [er.Mxx, er.Mxx, er.Mxx, er.Mxx]);
      bendingYY.set(i, [er.Myy, er.Myy, er.Myy, er.Myy]);
      bendingXY.set(i, [er.Mxy, er.Mxy, er.Mxy, er.Mxy]);
      const vm = Math.sqrt(er.Mxx**2 + er.Myy**2 - er.Mxx*er.Myy + 3*er.Mxy**2);
      vonMises.set(i, [vm, vm, vm, vm]);
    });
    states.analyzeOutputs.val = { pressure, bendingXX, bendingYY, bendingXY, vonMises };
    states.objects3D.val = [];
  },
};
