/**
 * 🌀 Mesa de Torsión — Validación contra ETABS 19.1 (Gabriela/Seproinca 2020)
 *
 * Modelo CSI original:
 *   1 piso 6×6m × 4m alto, hormigón 4000Psi (E=24.85 GPa, ν=0.20, γ=23.57 kN/m³)
 *   4 columnas C40×40 pinned-base · 4 vigas perim V30×50 · losa 10cm ShellThin
 *   Diafragma rígido D1 · auto-mesh 5×5 (25 Q4) · 24 LineElm
 *
 * Validación cruzada contra ETABS API:
 *   `validacion/Api CSI Computers/etabs-api/python-verificado/`
 *     15_mesa_torsion.py             → periodos modales + MPF
 *     16_mesa_torsion_frame_forces.py → N, V2, V3, T, M2, M3 por elemento × caso
 *
 * Características:
 *   • 3 casos linear-static separados (Dead, Live, SCP) con selfweight lumped
 *   • 2 combos lineales (UDCon1=1.4(D+SCP), UDCon2=1.2D+1.6L+1.2SCP)
 *   • Rigid offsets auto cols (top h_viga/2) y vigas (extremos b_col/2)
 *   • Selector "Caso visualizado" → cambia qué resultados muestra el viewer
 *   • Tabla picks N/V/M por caso + diferencia % vs ETABS
 */
import { deform, analyze, modalAnalysis, type Node, type Element, type DeformOutputs, type AnalyzeOutputs } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

const G = 9.80665;                  // m/s²
const RHO_CONC = 23.57 / 9.81;      // ton/m³ — γ_c=23.57 kN/m³ / g (consistent mass)

// ETABS 19.1 reference picks (from 16_mesa_torsion_frame_forces.py) — tonf, tonf·m
const ETABS_PICKS: Record<string, { P: number; V2: number; V3: number; T: number; M2: number; M3: number }> = {
  Dead:   { P: 5.72,  V2: 2.05,  V3: 0.45, T: 0.53, M2: 1.57, M3: 2.43 },
  Live:   { P: 4.50,  V2: 2.20,  V3: 0.61, T: 1.15, M2: 2.13, M3: 3.14 },
  SCP:    { P: 9.00,  V2: 4.41,  V3: 1.22, T: 2.29, M2: 4.26, M3: 6.28 },
  UDCon1: { P: 20.61, V2: 9.03,  V3: 2.33, T: 3.96, M2: 8.16, M3: 12.20 },
  UDCon2: { P: 24.86, V2: 11.27, V3: 2.97, T: 5.22, M2: 10.40, M3: 15.48 },
};
const ETABS_PERIODS_S = [0.34337, 0.34337, 0.28756];  // T1 Ux, T2 Uy, T3 Rz

export const mesaTorsion: ExampleDef = {
  id: "mesa-torsion",
  name: "🌀 Mesa de Torsión (ETABS Gabriela/Seproinca)",
  category: "🏁 Benchmarks · 4️⃣ Combinados",
  benchmark: true,
  defaultShellResult: "displacementZ",
  availableShellResults: [
    "none", "displacementZ", "vonMises",
    "membraneXX", "membraneYY", "membraneXY",
    "bendingXX", "bendingYY", "bendingXY",
  ],
  hasModal: true,
  guide: [
    "Modelo 'Mesa de torsión' ETABS 19.1 (Gabriela/Seproinca 2020).",
    "6×6m × 4m alto · 4 col C40×40 PINNED-base · 4 vigas V30×50 perim · losa 10cm · diaph rígido.",
    "Selector 'Caso visualizado' cambia entre Dead/Live/SCP/UDCon1/UDCon2.",
    "Tabla 📊 Comparación ETABS muestra picks ETABS vs Hekatan por componente y diferencia %.",
    "ETABS periodos modal: T1=T2=0.34337s lateral, T3=0.28756s torsión Rz.",
    "Rigid offsets ETABS: col flexible=3.5m (auto -h_viga/2), viga flexible=5.6m (auto -b_col/2).",
  ],
  params: {
    // ─── Caso a visualizar ───
    activeCase: { default: 0, label: "Caso visualizado",
                  options: { "Dead (selfweight)": 0, "Live (q=0.5 tonf/m²)": 1, "SCP (q=1.0 tonf/m²)": 2,
                             "UDCon1 (1.4D+1.4SCP)": 3, "UDCon2 (1.2D+1.6L+1.2SCP)": 4 },
                  folder: "Caso" },
    // ─── Geometría ───
    Lx:        { default: 6.0,  min: 4, max: 12, step: 0.5, label: "Lx (m)", folder: "Geometría" },
    Ly:        { default: 6.0,  min: 4, max: 12, step: 0.5, label: "Ly (m)", folder: "Geometría" },
    H:         { default: 4.0,  min: 2.5, max: 6, step: 0.25, label: "H piso (m)", folder: "Geometría" },
    nMesh:     { default: 5,    min: 2, max: 12, step: 1, label: "Subdiv losa (n×n)", folder: "Geometría" },
    // ─── Secciones ───
    bCol:      { default: 0.40, min: 0.25, max: 0.80, step: 0.05, label: "b col (m)", folder: "Secciones" },
    hCol:      { default: 0.40, min: 0.25, max: 0.80, step: 0.05, label: "h col (m)", folder: "Secciones" },
    bViga:     { default: 0.30, min: 0.20, max: 0.60, step: 0.05, label: "b viga (m)", folder: "Secciones" },
    hViga:     { default: 0.50, min: 0.30, max: 0.90, step: 0.05, label: "h viga (m)", folder: "Secciones" },
    tLosa:     { default: 0.10, min: 0.08, max: 0.30, step: 0.01, label: "t losa (m)", folder: "Secciones" },
    // ─── Material concreto 4000Psi ───
    E_GPa:     { default: 24.85, min: 15, max: 35, step: 0.5, label: "E (GPa)", folder: "Material" },
    nu:        { default: 0.20, min: 0.10, max: 0.30, step: 0.01, label: "ν", folder: "Material" },
    gamma_kNm3:{ default: 23.57, min: 18, max: 28, step: 0.1, label: "γ (kN/m³)", folder: "Material" },
    // ─── Apoyo ───
    apoyo:     { default: 0, label: "Apoyo base",
                 options: { "Pinned (UX UY UZ)": 0, "Empotrado (6 DOF)": 1 }, folder: "Apoyo" },
    // ─── ETABS features ───
    rigidOffsets: { default: 0, label: "Rigid offsets ETABS-like",
                    options: { "OFF (full length, ETABS default)": 0, "ON (h_viga/2 + b_col/2)": 1 }, folder: "ETABS features" },
    // ─── Cargas ───
    q_SCP:     { default: 1.0, min: 0, max: 5, step: 0.1, label: "SCP (tonf/m²)", folder: "Cargas" },
    q_Live:    { default: 0.5, min: 0, max: 5, step: 0.1, label: "Live (tonf/m²)", folder: "Cargas" },
    // ─── Modal ───
    nModos:    { default: 12, min: 3, max: 24, step: 1, label: "N modos modal", folder: "Modal" },
  },

  computedLabels(p, states) {
    const out: Record<string, string> = {};
    // Resultados de cada caso almacenados en (states as any)._mesaTorsionCases
    const cases = (states as any)._mesaTorsionCases as Record<string, FramePicksByCase> | undefined;
    if (!cases) return out;

    out["—— ETABS ref T₁ Ux ——"]   = `${ETABS_PERIODS_S[0].toFixed(4)} s`;
    out["—— ETABS ref T₂ Uy ——"]   = `${ETABS_PERIODS_S[1].toFixed(4)} s`;
    out["—— ETABS ref T₃ Rz ——"]   = `${ETABS_PERIODS_S[2].toFixed(4)} s`;

    for (const caseName of ["Dead", "Live", "SCP", "UDCon1", "UDCon2"]) {
      const hk = cases[caseName];
      const et = ETABS_PICKS[caseName];
      if (!hk || !et) continue;
      const fmt = (h: number, e: number) => {
        const diff = e !== 0 ? ((h - e) / e * 100) : 0;
        return `H=${h.toFixed(2)}  E=${e.toFixed(2)}  Δ=${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
      };
      // SWAP de ejes locales (columna vertical, convención awatif Z-up vs ETABS):
      // Hekatan V₂↔ETABS V₃, V₃↔ETABS V₂, M₂↔ETABS M₃, M₃↔ETABS M₂.
      out[`${caseName} |P|`]        = fmt(hk.P,  et.P);
      out[`${caseName} |V₂↔E V₃|`]  = fmt(hk.V2, et.V3);
      out[`${caseName} |V₃↔E V₂|`]  = fmt(hk.V3, et.V2);
      out[`${caseName} |T|`]        = fmt(hk.T,  et.T);
      out[`${caseName} |M₂↔E M₃|`]  = fmt(hk.M2, et.M3);
      out[`${caseName} |M₃↔E M₂|`]  = fmt(hk.M3, et.M2);
    }
    return out;
  },

  build(p, states) {
    const nMesh = Math.round(p.nMesh);
    const Lx = p.Lx, Ly = p.Ly, H = p.H;
    const dx = Lx / nMesh, dy = Ly / nMesh;
    const RHO = p.gamma_kNm3 / 9.81;  // ton/m³

    // ─── Nodos ───
    // base 0..3 esquinas; floor grid 4..(4+(nMesh+1)²-1)
    const nodes: Node[] = [
      [0,  0,  0], [Lx, 0,  0], [Lx, Ly, 0], [0,  Ly, 0],
    ];
    const N_BASE = 4;
    for (let j = 0; j <= nMesh; j++)
      for (let i = 0; i <= nMesh; i++)
        nodes.push([i * dx, j * dy, H]);
    const ix = (i: number, j: number) => N_BASE + j * (nMesh + 1) + i;

    // ─── Elementos ───
    const elements: Element[] = [];
    // Shells losa
    for (let j = 0; j < nMesh; j++)
      for (let i = 0; i < nMesh; i++)
        elements.push([ix(i, j), ix(i + 1, j), ix(i + 1, j + 1), ix(i, j + 1)]);
    const shellCount = elements.length;
    // 4 cols
    elements.push([0, ix(0, 0)]);                  // SO
    elements.push([1, ix(nMesh, 0)]);              // SE
    elements.push([2, ix(nMesh, nMesh)]);          // NE
    elements.push([3, ix(0, nMesh)]);              // NO
    const colStart = shellCount, colEnd = elements.length;
    // 4 vigas perimetrales subdivididas
    for (let i = 0; i < nMesh; i++) elements.push([ix(i, 0), ix(i + 1, 0)]);            // S
    for (let j = 0; j < nMesh; j++) elements.push([ix(nMesh, j), ix(nMesh, j + 1)]);    // E
    for (let i = 0; i < nMesh; i++) elements.push([ix(i, nMesh), ix(i + 1, nMesh)]);    // N
    for (let j = 0; j < nMesh; j++) elements.push([ix(0, j), ix(0, j + 1)]);            // W
    const beamStart = colEnd, beamEnd = elements.length;

    // ─── Supports ───
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    const isPinned = p.apoyo < 0.5;
    for (const n of [0, 1, 2, 3])
      supports.set(n, isPinned
        ? [true, true, true, false, false, false]
        : [true, true, true, true,  true,  true]);

    // ─── Element inputs ───
    const E_kNm2 = p.E_GPa * 1e6;
    const Gmod = E_kNm2 / (2 * (1 + p.nu));
    const thicknesses    = new Map<number, number>();
    const elasticities   = new Map<number, number>();
    const poissons       = new Map<number, number>();
    const areas          = new Map<number, number>();
    const Iz             = new Map<number, number>();
    const Iy             = new Map<number, number>();
    const J_t            = new Map<number, number>();
    const Gm             = new Map<number, number>();
    const densities      = new Map<number, number>();
    const sections       = new Map<number, any>();
    const rigidOffsets   = new Map<number, [number, number]>();
    const shearAreasY    = new Map<number, number>();   // Timoshenko: As=A·5/6 (ETABS default)
    const shearAreasZ    = new Map<number, number>();   // si no se pasan → el C++ cae a Euler (bug)
    // ETABS Mesa Torsión usa Shell-Thin (Kirchhoff DKE) — flag por shell
    const plateFormulations = new Map<number, number>();
    const drillingTypes  = new Map<number, number>();

    for (let i = 0; i < shellCount; i++) {
      thicknesses.set(i, p.tLosa);
      elasticities.set(i, E_kNm2);
      poissons.set(i, p.nu);
      densities.set(i, RHO);
      plateFormulations.set(i, 1);  // 1 = Shell-Thin Kirchhoff DKE (Batoz) — matchea ETABS
      drillingTypes.set(i, 0);      // ← como el Python hekatan-fem-py (_make_ei: drilling=0).
                                    // HB (2) mete rigidez torsional en plano que empuja momento
                                    // espurio a las columnas (+33%). Losa horizontal → drilling 0.
      // drillingType default = 2 (Hughes-Brezzi) via C++ → no requiere setear aquí.
      // Para este modelo (losa horizontal + viga horizontal), drilling shell (Rz)
      // y torsión viga (Rx local) son DOFs distintos, por lo que HB tiene efecto
      // mínimo. Útil para shells verticales (muros) acoplados a columnas.
    }
    // Cols
    const Ac = p.bCol * p.hCol;
    const Izc = (p.bCol * Math.pow(p.hCol, 3)) / 12;
    const Iyc = (p.hCol * Math.pow(p.bCol, 3)) / 12;
    // Saint-Venant J para sección rectangular a×b con a >= b:
    //   J = β · a · b^3  (cubo del lado CORTO, no del largo).
    //   β = 1/3 · (1 - 0.21·(b/a)·(1 - (b/a)^4 / 12))   — Roark/Timoshenko cerrada.
    const stVenantJ = (b: number, h: number) => {
      const a = Math.max(b, h), s = Math.min(b, h);
      const r = s / a;
      const beta = (1 / 3) * (1 - 0.21 * r * (1 - Math.pow(r, 4) / 12));
      return beta * a * Math.pow(s, 3);
    };
    const Jc = stVenantJ(p.bCol, p.hCol);
    const colRigidTopFrac = p.rigidOffsets > 0.5 ? (p.hViga / 2) / H : 0;  // top offset
    for (let i = colStart; i < colEnd; i++) {
      elasticities.set(i, E_kNm2);
      poissons.set(i, p.nu);
      Gm.set(i, Gmod);
      areas.set(i, Ac);
      shearAreasY.set(i, Ac * 5 / 6);   // Timoshenko (columna C40x40)
      shearAreasZ.set(i, Ac * 5 / 6);
      Iz.set(i, Iyc);   // weak axis → Iz local (swap por convención awatif Z-up)
      Iy.set(i, Izc);
      J_t.set(i, Jc);
      densities.set(i, RHO);
      sections.set(i, { type: "rect", b: p.bCol, h: p.hCol });
      if (colRigidTopFrac > 0) rigidOffsets.set(i, [0, colRigidTopFrac]);
    }
    // Vigas
    const Av = p.bViga * p.hViga;
    const Izv = (p.bViga * Math.pow(p.hViga, 3)) / 12;
    const Iyv = (p.hViga * Math.pow(p.bViga, 3)) / 12;
    const Jv = stVenantJ(p.bViga, p.hViga);
    const beamSegL = Lx / nMesh;  // long de cada segmento de viga = dx (= dy)
    // Rigid offset solo en los segmentos EXTREMOS (los que tocan col):
    //   - primer segmento de cada lado: offset I = b_col/2 / segLen
    //   - último segmento de cada lado: offset J = b_col/2 / segLen
    const offsetEnd = p.rigidOffsets > 0.5 ? (p.bCol / 2) / beamSegL : 0;
    let bIdx = beamStart;
    for (let side = 0; side < 4; side++) {
      for (let s = 0; s < nMesh; s++) {
        elasticities.set(bIdx, E_kNm2);
        poissons.set(bIdx, p.nu);
        Gm.set(bIdx, Gmod);
        areas.set(bIdx, Av);
        shearAreasY.set(bIdx, Av * 5 / 6);   // Timoshenko: viga V30x50 corta-peraltada → φ≈0.5
        shearAreasZ.set(bIdx, Av * 5 / 6);
        // SWAP awatif Z-up (igual que columnas): la flexión VERTICAL de la viga
        // horizontal usa momentsOfInertiaY → debe ser el eje FUERTE (Izv=bh³/12).
        // Sin el swap el frame flexionaba con el eje débil → +33% a la columna.
        Iz.set(bIdx, Iyv);   // eje débil → Iz local
        Iy.set(bIdx, Izv);   // eje fuerte (vertical) → Iy local
        J_t.set(bIdx, Jv);
        densities.set(bIdx, RHO);
        sections.set(bIdx, { type: "rect", b: p.bViga, h: p.hViga });
        if (offsetEnd > 0) {
          const offI = s === 0          ? offsetEnd : 0;
          const offJ = s === nMesh - 1  ? offsetEnd : 0;
          if (offI + offJ > 0) rigidOffsets.set(bIdx, [offI, offJ]);
        }
        bIdx++;
      }
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.elementInputs.val = {
      elasticities, poissonsRatios: poissons, shearModuli: Gm,
      areas, momentsOfInertiaZ: Iz, momentsOfInertiaY: Iy, torsionalConstants: J_t,
      thicknesses, densities, sectionShapes: sections,
      rigidOffsets: rigidOffsets.size > 0 ? rigidOffsets : undefined,
      // ETABS Shell-Thin (DKE Kirchhoff) — matchea ETABS exacto < 1.5%
      plateFormulations,
      drillingTypes,   // 0 en la losa (como hekatan-fem-py) — sin drilling HB espurio
      shearAreasY, shearAreasZ,   // Timoshenko A·5/6 en frames (el C++ cae a Euler si no se pasan)
    };

    // ─── Helper para construir cargas por caso ────────────────────────
    // CSI mass source INCLUDELOADS=No → patrones SCP/Live no contribuyen a masa,
    // pero SÍ contribuyen a static. Selfweight Dead = ρ × g aplicado por elemento.
    function buildLoads(scaleSW: number, q_SCP_tm2: number, q_Live_tm2: number) {
      const loads = new Map<number, [number, number, number, number, number, number]>();
      const addLoad = (n: number, fz: number) => {
        const prev = loads.get(n) || [0, 0, 0, 0, 0, 0];
        loads.set(n, [prev[0], prev[1], prev[2] + fz, prev[3], prev[4], prev[5]]);
      };
      // Selfweight de shells losa (lumped a sus 4 nodos)
      if (scaleSW !== 0) {
        for (let j = 0; j < nMesh; j++) {
          for (let i = 0; i < nMesh; i++) {
            const Wel = p.tLosa * dx * dy * p.gamma_kNm3 * scaleSW;  // kN total elem
            const Fz_per_node = -Wel / 4;
            for (const n of [ix(i, j), ix(i + 1, j), ix(i + 1, j + 1), ix(i, j + 1)])
              addLoad(n, Fz_per_node);
          }
        }
        // Selfweight cols (lumped mitad a cada extremo)
        const Wcol = Ac * H * p.gamma_kNm3 * scaleSW;
        const corners = [[0, ix(0, 0)], [1, ix(nMesh, 0)], [2, ix(nMesh, nMesh)], [3, ix(0, nMesh)]];
        for (const [nb, nt] of corners) {
          addLoad(nb, -Wcol / 2);
          addLoad(nt, -Wcol / 2);
        }
        // Selfweight vigas (lumped a los segmentos × dos extremos)
        let bi = beamStart;
        for (let side = 0; side < 4; side++) {
          for (let s = 0; s < nMesh; s++) {
            const [nI, nJ] = elements[bi];
            const Wseg = Av * beamSegL * p.gamma_kNm3 * scaleSW;
            addLoad(nI, -Wseg / 2);
            addLoad(nJ, -Wseg / 2);
            bi++;
          }
        }
      }
      // Carga area SCP + Live → q × g (tonf/m² → kN/m²)
      const q_kNm2 = (q_SCP_tm2 + q_Live_tm2) * G;
      if (q_kNm2 !== 0) {
        for (let j = 0; j <= nMesh; j++) {
          for (let i = 0; i <= nMesh; i++) {
            const corner = (i === 0 || i === nMesh) && (j === 0 || j === nMesh);
            const edge = (i === 0 || i === nMesh || j === 0 || j === nMesh);
            const factor = corner ? 0.25 : edge ? 0.5 : 1.0;
            const Fz = -q_kNm2 * dx * dy * factor;
            addLoad(ix(i, j), Fz);
          }
        }
      }
      return loads;
    }

    // ─── 3 casos básicos + 2 combos ────────────────────────────────────
    const cases: Array<{ name: string; sw: number; scp: number; live: number }> = [
      { name: "Dead",   sw: 1.0, scp: 0,        live: 0 },
      { name: "Live",   sw: 0,   scp: 0,        live: p.q_Live },
      { name: "SCP",    sw: 0,   scp: p.q_SCP,  live: 0 },
      { name: "UDCon1", sw: 1.4, scp: 1.4 * p.q_SCP, live: 0 },
      { name: "UDCon2", sw: 1.2, scp: 1.2 * p.q_SCP, live: 1.6 * p.q_Live },
    ];

    const allCaseResults: Record<string, { deform: DeformOutputs; analyze: AnalyzeOutputs }> = {};
    const framePicks: Record<string, FramePicksByCase> = {};
    const colPicks:   Record<string, FramePicksByCase> = {};
    const beamPicks:  Record<string, FramePicksByCase> = {};

    for (const c of cases) {
      const loads = buildLoads(c.sw, c.scp, c.live);
      try {
        const def = deform(nodes, elements, { supports, loads }, states.elementInputs.val);
        const ana = analyze(nodes, elements, states.elementInputs.val, def);
        allCaseResults[c.name] = { deform: def, analyze: ana };
        // Pick |max| de cada componente sobre cols + vigas (no shells)
        framePicks[c.name] = computePicks(ana, colStart, beamEnd);
        // ★ NUEVO: separar cols vs vigas para comparar contra ETABS por elemento
        colPicks[c.name]   = computePicks(ana, colStart, colEnd);
        beamPicks[c.name]  = computePicks(ana, beamStart, beamEnd);
      } catch (e: any) {
        console.warn(`[Mesa torsión] caso ${c.name} falló:`, e.message);
      }
    }

    // Guardar para computedLabels y debug
    (states as any)._mesaTorsionCases = framePicks;
    (states as any)._mesaTorsionColPicks = colPicks;
    (states as any)._mesaTorsionBeamPicks = beamPicks;
    (states as any)._mesaTorsionAllResults = allCaseResults;

    // ─── Mostrar caso activo en viewer ────────────────────────────────
    const activeCaseName = ["Dead", "Live", "SCP", "UDCon1", "UDCon2"][Math.round(p.activeCase)] || "UDCon2";
    const active = allCaseResults[activeCaseName];
    if (active) {
      states.deformOutputs.val = active.deform;
      states.analyzeOutputs.val = active.analyze;
    }

    // Setear nodeInputs con loads del caso activo (para que viewer flechas matchear)
    states.nodeInputs.val = { supports, loads: buildLoads(
      cases.find(c => c.name === activeCaseName)!.sw,
      cases.find(c => c.name === activeCaseName)!.scp,
      cases.find(c => c.name === activeCaseName)!.live,
    )};

    // ─── Log resumen comparativo en consola ──────────────────────────
    const lines: string[] = [];
    lines.push(`[Mesa torsión] Caso visualizado: ${activeCaseName}`);
    lines.push(`  Discretización: ${shellCount} shells losa, 4 cols, ${beamEnd - beamStart} segs viga`);
    lines.push(`  Rigid offsets: ${p.rigidOffsets > 0.5 ? `ON (col top -${(p.hViga/2).toFixed(2)}m, viga ends -${(p.bCol/2).toFixed(2)}m)` : "OFF"}`);
    lines.push(``);
    lines.push(`  Picks por caso — Hekatan vs ETABS (Δ% relativo, con SWAP V2↔V3 y M2↔M3 por convención awatif Z-up vs ETABS):`);
    lines.push(`  ${"Case".padEnd(8)} ${"Comp".padEnd(4)} ${"Hekatan".padStart(10)} ${"ETABS".padStart(10)} ${"Δ%".padStart(8)}`);
    // Mapping: ejes locales Hekatan (awatif Z-up) están rotados 90° vs ETABS frame local.
    //   Hekatan V2 ↔ ETABS V3, Hekatan V3 ↔ ETABS V2
    //   Hekatan M2 ↔ ETABS M3, Hekatan M3 ↔ ETABS M2
    const COMP_SWAP: Record<string, "P" | "V2" | "V3" | "T" | "M2" | "M3"> = {
      P: "P", T: "T", V2: "V3", V3: "V2", M2: "M3", M3: "M2",
    };
    for (const c of cases) {
      const hk = framePicks[c.name];
      const et = ETABS_PICKS[c.name];
      if (!hk || !et) continue;
      for (const comp of ["P", "V2", "V3", "T", "M2", "M3"] as const) {
        const h = hk[comp];
        const e = et[COMP_SWAP[comp]];
        const d = e !== 0 ? ((h - e) / e * 100) : 0;
        const tag = comp !== COMP_SWAP[comp] ? ` (↔ETABS ${COMP_SWAP[comp]})` : "";
        lines.push(`  ${c.name.padEnd(8)} ${comp.padEnd(4)} ${h.toFixed(3).padStart(10)} ${e.toFixed(3).padStart(10)} ${(d >= 0 ? "+" : "") + d.toFixed(1).padStart(7)}%${tag}`);
      }
    }
    console.log(lines.join("\n"));

    // ─── Reporte separado COLS vs VIGAS (★ NUEVO) ──────────────────
    // ETABS específicos del README_MESA_TORSION.md (UDCon2):
    //   Col base/tope:  P=24.86, V2=V3=2.97, T=0, M2=M3=10.40 (cuadrada simétrica)
    //   Viga centro:    P=1.84,  V2=11.27,  T=5.23, M3=15.48 (M2 ≈ 0)
    const ETABS_COL_UDCon2  = { P: 24.86, V2: 2.97,  V3: 2.97,  T: 0,    M2: 10.40, M3: 10.40 };
    const ETABS_BEAM_UDCon2 = { P:  1.84, V2: 11.27, V3: 0.08,  T: 5.23, M2: 0.04,  M3: 15.48 };
    const lines2: string[] = [];
    lines2.push(``);
    lines2.push(`  ═══ COMPARATIVA SEPARADA por elemento (UDCon2 vs ETABS específicos) ═══`);
    lines2.push(`  Convención awatif: V₂↔ETABS V₃, M₂↔ETABS M₃ (ejes rotados 90°)`);
    lines2.push(`  ┌──────────────────────┬─────────┬─────────┬──────────┐`);
    lines2.push(`  │  Elemento  Comp      │ Hekatan │  ETABS  │   Δ%     │`);
    lines2.push(`  ├──────────────────────┼─────────┼─────────┼──────────┤`);
    const reportRow = (elem: string, hk: FramePicksByCase, et: typeof ETABS_COL_UDCon2) => {
      for (const comp of ["P", "V2", "V3", "T", "M2", "M3"] as const) {
        const h = hk[comp];
        const e = et[COMP_SWAP[comp]];
        const d = e > 0.01 ? ((h - e) / e * 100) : (h > 0.01 ? Infinity : 0);
        const dstr = isFinite(d) ? ((d >= 0 ? "+" : "") + d.toFixed(1) + "%") : (h > 0.01 ? "—" : "0%");
        lines2.push(`  │  ${elem.padEnd(8)} ${comp.padEnd(4)}     │ ${h.toFixed(3).padStart(7)} │ ${e.toFixed(3).padStart(7)} │ ${dstr.padStart(8)} │`);
      }
      lines2.push(`  ├──────────────────────┼─────────┼─────────┼──────────┤`);
    };
    const hkCol  = colPicks["UDCon2"];
    const hkBeam = beamPicks["UDCon2"];
    if (hkCol && hkBeam) {
      reportRow("COL", hkCol, ETABS_COL_UDCon2);
      reportRow("VIGA", hkBeam, ETABS_BEAM_UDCon2);
    }
    lines2.push(`  └──────────────────────┴─────────┴─────────┴──────────┘`);
    console.log(lines2.join("\n"));

    // ─── ★ Esfuerzos en SHELL para responder "¿concuerdan con ETABS?" ──
    // ETABS losa UDCon2 (del README_MESA_TORSION.md):
    //   |M11|max = |M22|max = 2.970 tonf·m/m
    //   |M12|max = 0.857 tonf·m/m
    //   |V13|max = |V23|max = 3.619 tonf/m
    const udcAna = allCaseResults["UDCon2"]?.analyze;
    if (udcAna) {
      const maxAbsField = (map: Map<number, number[]> | undefined) => {
        if (!map) return 0;
        let mx = 0;
        for (let i = 0; i < shellCount; i++) {
          const arr = map.get(i);
          if (!arr) continue;
          for (const v of arr) {
            const a = Math.abs(v);
            if (a > mx) mx = a;
          }
        }
        return mx;
      };
      const m11h = maxAbsField(udcAna.bendingXX) / G;  // kN·m → tonf·m (G es factor unidades)
      const m22h = maxAbsField(udcAna.bendingYY) / G;
      const m12h = maxAbsField(udcAna.bendingXY) / G;
      const v13h = maxAbsField(udcAna.tranverseShearX) / G;
      const v23h = maxAbsField(udcAna.tranverseShearY) / G;
      const lines3: string[] = [];
      lines3.push(``);
      lines3.push(`  ═══ ESFUERZOS SHELL (LOSA) — UDCon2 (tonf·m/m, tonf/m) ═══`);
      lines3.push(`  ┌───────────┬─────────┬─────────┬──────────┐`);
      lines3.push(`  │  Comp     │ Hekatan │  ETABS  │   Δ%     │`);
      lines3.push(`  ├───────────┼─────────┼─────────┼──────────┤`);
      const row = (lbl: string, h: number, e: number) => {
        const d = e > 0.01 ? ((h - e) / e * 100) : 0;
        lines3.push(`  │  ${lbl.padEnd(8)} │ ${h.toFixed(3).padStart(7)} │ ${e.toFixed(3).padStart(7)} │ ${((d>=0?"+":"")+d.toFixed(1)+"%").padStart(8)} │`);
      };
      row("|M11|max", m11h, 2.970);
      row("|M22|max", m22h, 2.970);
      row("|M12|max", m12h, 0.857);
      row("|V13|max", v13h, 3.619);
      row("|V23|max", v23h, 3.619);
      lines3.push(`  └───────────┴─────────┴─────────┴──────────┘`);
      console.log(lines3.join("\n"));
    }

    states.objects3D.val = [];
  },

  runModal(p, states, modalPanel) {
    if (!states.nodes.val.length) return;
    const nModos = Math.round(p.nModos);
    try {
      const out = modalAnalysis(
        states.nodes.val, states.elements.val,
        states.nodeInputs.val, states.elementInputs.val, nModos,
      );
      const lines: string[] = [];
      lines.push(`[Mesa torsión Modal Hekatan FEM 3D] ${nModos} modos:`);
      for (let i = 0; i < Math.min(nModos, 6); i++) {
        const T = 1 / out.frequencies[i];
        lines.push(`  Modo ${i + 1}: T = ${T.toFixed(4)} s   f = ${out.frequencies[i].toFixed(3)} Hz`);
      }
      lines.push(``);
      lines.push(`ETABS 19.1 reference:`);
      lines.push(`  Modo 1 T₁ Ux = ${ETABS_PERIODS_S[0].toFixed(4)} s`);
      lines.push(`  Modo 2 T₂ Uy = ${ETABS_PERIODS_S[1].toFixed(4)} s`);
      lines.push(`  Modo 3 T₃ Rz = ${ETABS_PERIODS_S[2].toFixed(4)} s`);
      console.log(lines.join("\n"));
      if (modalPanel?.render) {
        modalPanel.render(out, {
          title: `Mesa de Torsión — ${p.Lx}×${p.Ly}m, ${p.H}m alto`,
          properties: [
            `${p.apoyo < 0.5 ? "Pinned base" : "Empotrado"}  E=${p.E_GPa} GPa  ν=${p.nu}`,
            `ETABS ref: T₁=${ETABS_PERIODS_S[0]}s  T₂=${ETABS_PERIODS_S[1]}s  T₃=${ETABS_PERIODS_S[2]}s`,
          ],
        });
      }
    } catch (e: any) {
      console.error("[Mesa torsión Modal] error:", e.message);
    }
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// Helper types & functions
// ═══════════════════════════════════════════════════════════════════════════
interface FramePicksByCase {
  P:  number;
  V2: number;
  V3: number;
  T:  number;
  M2: number;
  M3: number;
}

/**
 * Calcula los picks |max| de N, V₂, V₃, T, M₂, M₃ sobre los elementos frame
 * (cols + vigas, índices [frameStart..frameEnd)).
 * Convención CSI/awatif:
 *   normals    → P  (axial, tracción +)
 *   shearsY    → V₂
 *   shearsZ    → V₃
 *   torsions   → T  = M₁
 *   bendingsY  → M₂
 *   bendingsZ  → M₃
 * Cada Map<idx, [valI, valJ]> tiene los valores en los extremos.
 * Picks |max| = max(|val_I|, |val_J|) sobre todos los elementos.
 */
function computePicks(ana: AnalyzeOutputs, frameStart: number, frameEnd: number): FramePicksByCase {
  const pickAbs = (map: Map<number, [number, number]> | undefined) => {
    if (!map) return 0;
    let mx = 0;
    for (let i = frameStart; i < frameEnd; i++) {
      const v = map.get(i);
      if (!v) continue;
      mx = Math.max(mx, Math.abs(v[0]), Math.abs(v[1]));
    }
    return mx;
  };
  // Convertir kN, kN·m → tonf, tonf·m (ETABS units)
  return {
    P:  pickAbs(ana.normals) / G,
    V2: pickAbs(ana.shearsY) / G,
    V3: pickAbs(ana.shearsZ) / G,
    T:  pickAbs(ana.torsions) / G,
    M2: pickAbs(ana.bendingsY) / G,
    M3: pickAbs(ana.bendingsZ) / G,
  };
}
