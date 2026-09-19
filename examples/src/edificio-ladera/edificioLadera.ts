/**
 * Edificio en Ladera — Pórtico 3D escalonado por cotas (V1).
 *
 * Modela un edificio sobre terreno inclinado donde cada eje de columnas
 * en el sentido de la ladera (X) tiene una cota de cimentación distinta.
 * La cubierta y los pisos intermedios mantienen cota uniforme — quien
 * varía es el largo de cada columna del primer piso.
 *
 * Caso clásico de comportamiento sísmico asimétrico:
 *   - Columnas cortas (lado alto)  → muy rígidas → concentran cortante
 *   - Columnas largas (lado bajo)  → flexibles → mayor deriva
 *   - Centro de rigidez desplazado hacia el lado alto → torsión sísmica
 */
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";
import { ecHormigonACI } from "../shared/materials";

const G_GRAVITY = 9.81;
const rho_c = 24 / G_GRAVITY;

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });
const PE = (folder: string, label: string, def: number, options: Record<string, number>) =>
  ({ default: def, label, folder, options });

export const edificioLadera: ExampleDef = {
  id: "edificio-ladera",
  name: "Edificio en Ladera",
  category: "1️⃣ Frames · 🎯 n GDL Sistemas",
  defaultShellResult: "none",
  availableShellResults: [],
  hasModal: true,
  params: {
    // ── Geometría planta ──
    nVanosX:  { ...P("Geometría", "Vanos X (eje ladera)", 3, 1, 6, 1), regenOnChange: true },
    nVanosY:  { ...P("Geometría", "Vanos Y", 2, 1, 6, 1), regenOnChange: true },
    nPisos:   { ...P("Geometría", "N. Pisos", 3, 1, 8, 1), regenOnChange: true },
    spanX:    P("Geometría", "Luz X (m)", 5.0, 2, 12, 0.5),
    spanY:    P("Geometría", "Luz Y (m)", 5.0, 2, 12, 0.5),
    hPiso:    P("Geometría", "h piso (m)", 3.0, 2, 5, 0.1),

    // ── Ladera (cotas de cimentación) ──
    // Default: nPisos=3, hPiso=3 → cubierta=9 m. Columnas escalonadas:
    // eje 1 va de z=-3 (más bajo) hasta z=9 → 12 m total = 4 niveles
    // eje 4 va de z=0  (más alto) hasta z=9 →  9 m total = 3 niveles
    cotaCubierta: P("Ladera", "Cota cubierta (m)", 9.0, 0, 30, 0.25),
    cotaPortico1: P("Ladera", "Cota cim. eje X1 (m)", -3.0, -10, 5, 0.25),
    cotaPortico2: P("Ladera", "Cota cim. eje X2 (m)", -2.0, -10, 5, 0.25),
    cotaPortico3: P("Ladera", "Cota cim. eje X3 (m)", -1.0, -10, 5, 0.25),
    cotaPortico4: P("Ladera", "Cota cim. eje X4 (m)",  0.0, -10, 5, 0.25),
    cotaPortico5: P("Ladera", "Cota cim. eje X5 (m)",  0.0, -10, 5, 0.25),
    cotaPortico6: P("Ladera", "Cota cim. eje X6 (m)",  0.0, -10, 5, 0.25),
    cotaPortico7: P("Ladera", "Cota cim. eje X7 (m)",  0.0, -10, 5, 0.25),

    // ── Secciones ──
    fcConcr:  P("Secciones", "f'c (kg/cm²)", 240, 140, 420, 10),
    colSize:  P("Secciones", "b×h columna (m)", 0.40, 0.25, 0.80, 0.05),
    vigaB:    P("Secciones", "b viga (m)", 0.30, 0.20, 0.60, 0.05),
    vigaH:    P("Secciones", "h viga (m)", 0.50, 0.30, 0.90, 0.05),

    // ── Apoyos ──
    apoyo: PE("Apoyos", "Tipo", 0, { "Empotrado": 0, "Articulado (3 DOFs)": 1 }),

    // ── Cargas ──
    CM:    P("Cargas", "CM (kN/nodo cubierta)", -10, -50,   0,  0.5),
    CV:    P("Cargas", "CV (kN/nodo cubierta)",  -3, -20,   0,  0.5),
    Ex:    P("Cargas", "Ex sismo X tope (kN)",   80,   0, 500, 10),
    Ey:    P("Cargas", "Ey sismo Y tope (kN)",    0,   0, 500, 10),
    // Selector caso de carga (mismo que edificio-aporticado)
    loadCase: PE("Cargas", "Caso de carga", 0, {
      "Combinada (CM+CV+Ex+Ey)":     0,
      "Solo Vertical (CM+CV)":        1,
      "Solo Dead (CM)":               2,
      "Solo Live (CV)":               3,
      "Solo Sismo Ex":                4,
      "Solo Sismo Ey":                5,
      "Sismo XY (Ex+Ey)":             6,
      "1.2 CM + 1.6 CV (ASCE)":       7,
      "1.2 CM + 1.0 CV + 1.0 Ex":     8,
      "1.2 CM + 1.0 CV + 1.0 Ey":     9,
      "1.2 CM + 1.0 CV - 1.0 Ex":    10,
      "1.2 CM + 1.0 CV - 1.0 Ey":    11,
      "0.9 CM + 1.0 Ex":             12,
      "0.9 CM + 1.0 Ey":             13,
    }),

    // ── Cimentación ──
    q_adm_zapata: P("Cimentación", "q_adm (tonf/m²)",   10,   1,    100,   1),
    ks_zapata:    P("Cimentación", "ks (kN/m³)",       1030, 100,   2e5,  10),
  },

  computedLabels(p, states) {
    const TONF_TO_KN = 9.80665;
    const reactions = (states.deformOutputs.rawVal as any)?.reactions as
      Map<number, [number, number, number, number, number, number]> | undefined;
    const nodes = states.nodes.rawVal as number[][];
    if (!reactions || !nodes?.length) return { "Reacciones": "—" };

    // Cotas únicas de base
    const cotasSet = new Set<number>();
    reactions.forEach((_, idx) => {
      const n = nodes[idx];
      if (!n) return;
      // Es nodo base si su z es la mínima entre nodos con misma (x, y)
      cotasSet.add(Math.round(n[2] * 100) / 100);
    });

    // Recolectar reacciones por cota
    const porCota = new Map<number, { count: number; maxP: number; sumP: number; maxV: number }>();
    reactions.forEach((r, idx) => {
      const n = nodes[idx];
      if (!n) return;
      const cota = Math.round(n[2] * 100) / 100;
      // Solo nodos base = mínima cota en su columna (x,y)
      let isBase = true;
      for (let i = 0; i < nodes.length; i++) {
        if (i === idx) continue;
        const m = nodes[i];
        if (Math.abs(m[0] - n[0]) < 1e-3 && Math.abs(m[1] - n[1]) < 1e-3 && m[2] < n[2] - 1e-6) {
          isBase = false; break;
        }
      }
      if (!isBase) return;
      const Fz = r[2], Fx = r[0], Fy = r[1];
      const P_kN = Math.abs(Fz);
      const V_kN = Math.sqrt(Fx * Fx + Fy * Fy);
      const cur = porCota.get(cota) ?? { count: 0, maxP: 0, sumP: 0, maxV: 0 };
      cur.count += 1;
      cur.sumP  += P_kN;
      if (P_kN > cur.maxP) cur.maxP = P_kN;
      if (V_kN > cur.maxV) cur.maxV = V_kN;
      porCota.set(cota, cur);
    });

    const result: Record<string, string> = {
      "── Reacciones por cota ──": "",
    };
    const cotasOrdenadas = Array.from(porCota.keys()).sort((a, b) => a - b);
    for (const cota of cotasOrdenadas) {
      const v = porCota.get(cota)!;
      const Pmax = v.maxP / TONF_TO_KN;
      const Vmax = v.maxV / TONF_TO_KN;
      result[`z=${cota.toFixed(2)} m`] =
        `${v.count} cols, P_max=${Pmax.toFixed(1)} tonf, V_max=${Vmax.toFixed(2)} tonf`;
    }

    // ── Detección torsión / asimetría ──
    let zMin = Infinity, zMax = -Infinity;
    for (const cota of cotasOrdenadas) {
      if (cota < zMin) zMin = cota;
      if (cota > zMax) zMax = cota;
    }
    const desnivel = zMax - zMin;
    if (desnivel > 0.1) {
      const hPiso = p.hPiso ?? 3.0;
      const ratioCorto = (p.cotaCubierta - zMax) / hPiso;
      const ratioLargo = (p.cotaCubierta - zMin) / hPiso;
      result["── Asimetría ladera ──"] = "";
      result["Desnivel cim."] = `${desnivel.toFixed(2)} m`;
      result["Col. más corta"] = `~${ratioCorto.toFixed(1)} pisos`;
      result["Col. más larga"] = `~${ratioLargo.toFixed(1)} pisos`;
      const stiffRatio = Math.pow(ratioLargo / Math.max(ratioCorto, 0.5), 3);
      result["k_corta/k_larga"] = `${stiffRatio.toFixed(1)}× ⚠ torsión`;
    }
    return result;
  },

  build(p, states) {
    const nvx = Math.round(p.nVanosX);
    const nvy = Math.round(p.nVanosY);
    const np  = Math.round(p.nPisos);
    const Lx  = p.spanX, Ly = p.spanY, hp = p.hPiso;
    const cotaCubierta = p.cotaCubierta;

    // Cotas de cimentación por eje X (default desde lado bajo a alto)
    const cotasBase: number[] = [];
    for (let i = 0; i <= nvx; i++) {
      const k = `cotaPortico${i + 1}` as keyof typeof p;
      cotasBase.push((p[k] as number) ?? 0);
    }

    // Material (kN/m²)
    const fc_MPa = p.fcConcr * 0.0981;
    const Ec = ecHormigonACI(fc_MPa);
    const nu = 0.20;
    const Gc = Ec / (2 * (1 + nu));
    const Acol = p.colSize * p.colSize;
    const Aviga = p.vigaB * p.vigaH;
    const Iz_col = (p.colSize ** 4) / 12;
    const Iy_col = (p.colSize ** 4) / 12;
    const J_col = 0.14 * p.colSize ** 4;
    const Iz_viga = (p.vigaB * p.vigaH ** 3) / 12;
    const Iy_viga = (p.vigaH * p.vigaB ** 3) / 12;
    const J_viga = 0.14 * Math.min(p.vigaB, p.vigaH) ** 3 * Math.max(p.vigaB, p.vigaH);

    // ── Generar nodos ──
    // Cada eje X (ix) tiene su propia cota base. Los pisos se cuentan desde la
    // cubierta hacia abajo: cubierta = cotaCubierta, piso N+1 = cubierta - hp,
    // ..., piso 1 = cubierta - np*hp. La cimentación de cada eje termina cuando
    // la cota del piso ≤ cotaBase[ix] (ese eje no tiene pisos por debajo).
    const nodes: Node[] = [];
    const idMap = new Map<string, number>();
    const addNode = (x: number, y: number, z: number): number => {
      const k = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
      if (idMap.has(k)) return idMap.get(k)!;
      const id = nodes.length;
      nodes.push([x, y, z]);
      idMap.set(k, id);
      return id;
    };

    // Cotas de piso ABSOLUTAS — comunes a todos los ejes para que las vigas
    // intermedias puedan conectar columnas vecinas que tengan nodos en la misma z.
    // Cubierta arriba, restamos hp por piso, hasta np pisos abajo.
    const floorLevels: number[] = [];
    for (let k = 0; k <= np; k++) floorLevels.push(cotaCubierta - k * hp);
    // floorLevels (descendente): [cubierta, cubierta-hp, ..., cubierta-np*hp]

    // Para cada eje (ix,iy) la columna tiene:
    //   - Nodo base = cotasBase[ix]
    //   - Todos los floorLevels que sean > cotasBase[ix]  (pisos ABOVE la base)
    // Así dos ejes vecinos tienen nodos a la MISMA z en sus pisos comunes
    // (sólo cuando ambas cotas base están por debajo de ese floor level).
    const colNodes: Map<string, number[]> = new Map();
    for (let ix = 0; ix <= nvx; ix++) {
      for (let iy = 0; iy <= nvy; iy++) {
        const x = ix * Lx;
        const y = iy * Ly;
        const zBase = cotasBase[ix];
        const stack: number[] = [];
        stack.push(addNode(x, y, zBase));
        // Pisos arriba de la base, ordenados ascendente
        const aboveBase = floorLevels.filter(z => z > zBase + 1e-3).sort((a, b) => a - b);
        for (const z of aboveBase) stack.push(addNode(x, y, z));
        colNodes.set(`${ix},${iy}`, stack);
      }
    }

    // ── Elementos ──
    const elements: Element[] = [];
    const elasticities = new Map<number, number>();
    const poissonsRatios = new Map<number, number>();
    const areas = new Map<number, number>();
    const momentsOfInertiaZ = new Map<number, number>();
    const momentsOfInertiaY = new Map<number, number>();
    const torsionalConstants = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const densities = new Map<number, number>();
    const sectionShapes = new Map<number, any>();

    const addCol = (a: number, b: number) => {
      const e = elements.length;
      elements.push([a, b]);
      elasticities.set(e, Ec); poissonsRatios.set(e, nu);
      areas.set(e, Acol);
      momentsOfInertiaY.set(e, Iz_col); momentsOfInertiaZ.set(e, Iy_col);
      torsionalConstants.set(e, J_col); shearModuli.set(e, Gc);
      densities.set(e, rho_c);
      sectionShapes.set(e, { type: "rect", b: p.colSize, h: p.colSize });
    };
    const addBeam = (a: number, b: number) => {
      const e = elements.length;
      elements.push([a, b]);
      elasticities.set(e, Ec); poissonsRatios.set(e, nu);
      areas.set(e, Aviga);
      momentsOfInertiaY.set(e, Iz_viga); momentsOfInertiaZ.set(e, Iy_viga);
      torsionalConstants.set(e, J_viga); shearModuli.set(e, Gc);
      densities.set(e, rho_c);
      sectionShapes.set(e, { type: "rect", b: p.vigaB, h: p.vigaH });
    };

    // Columnas: cada par consecutivo en colNodes[ix,iy]
    for (let ix = 0; ix <= nvx; ix++)
      for (let iy = 0; iy <= nvy; iy++) {
        const stack = colNodes.get(`${ix},${iy}`)!;
        for (let k = 0; k < stack.length - 1; k++) addCol(stack[k], stack[k + 1]);
      }

    // Vigas en cada FLOOR LEVEL (cotas comunes) y en CADA COTA BASE individual.
    // Las cotas base sólo están en el eje correspondiente, pero entre dos ejes
    // vecinos con CIM. INFERIOR es válido conectar también con vigas escalón
    // si están a misma altura (caso poco común — lo ignoramos por simplicidad).
    const findNodeAt = (ix: number, iy: number, z: number): number | null => {
      const x = ix * Lx, y = iy * Ly;
      const k = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
      return idMap.has(k) ? idMap.get(k)! : null;
    };

    for (const z of floorLevels) {
      // Vigas en X (entre ix y ix+1, mismo iy) — sólo cuando AMBOS ejes
      // alcanzan este floor level (z > cotaBase de ambos ejes).
      for (let ix = 0; ix < nvx; ix++)
        for (let iy = 0; iy <= nvy; iy++) {
          const a = findNodeAt(ix, iy, z);
          const b = findNodeAt(ix + 1, iy, z);
          if (a !== null && b !== null) addBeam(a, b);
        }
      // Vigas en Y (entre iy y iy+1, mismo ix)
      for (let ix = 0; ix <= nvx; ix++)
        for (let iy = 0; iy < nvy; iy++) {
          const a = findNodeAt(ix, iy, z);
          const b = findNodeAt(ix, iy + 1, z);
          if (a !== null && b !== null) addBeam(a, b);
        }
    }

    // ── Apoyos en nodos base de cada columna ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    for (let ix = 0; ix <= nvx; ix++)
      for (let iy = 0; iy <= nvy; iy++) {
        const stack = colNodes.get(`${ix},${iy}`)!;
        const baseId = stack[0];
        const tipo = Math.round(p.apoyo) | 0;
        if (tipo === 0)      supports.set(baseId, [true, true, true, true, true, true]);
        else                 supports.set(baseId, [true, true, true, false, false, false]);
      }

    // ── Cargas filtradas por caso de carga seleccionado ──
    const lc = Math.round(p.loadCase ?? 0);
    const factors: [number, number, number, number] =
      lc === 1  ? [1.0, 1.0, 0.0, 0.0] :
      lc === 2  ? [1.0, 0.0, 0.0, 0.0] :
      lc === 3  ? [0.0, 1.0, 0.0, 0.0] :
      lc === 4  ? [0.0, 0.0, 1.0, 0.0] :
      lc === 5  ? [0.0, 0.0, 0.0, 1.0] :
      lc === 6  ? [0.0, 0.0, 1.0, 1.0] :
      lc === 7  ? [1.2, 1.6, 0.0, 0.0] :
      lc === 8  ? [1.2, 1.0, 1.0, 0.0] :
      lc === 9  ? [1.2, 1.0, 0.0, 1.0] :
      lc === 10 ? [1.2, 1.0, -1.0, 0.0] :
      lc === 11 ? [1.2, 1.0, 0.0, -1.0] :
      lc === 12 ? [0.9, 0.0, 1.0, 0.0] :
      lc === 13 ? [0.9, 0.0, 0.0, 1.0] :
                  [1.0, 1.0, 1.0, 1.0];
    const [fCM, fCV, fEx, fEy] = factors;
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const totalNodos = (nvx + 1) * (nvy + 1);
    const ExPorNodo = (fEx * (p.Ex ?? 0)) / totalNodos;
    const EyPorNodo = (fEy * (p.Ey ?? 0)) / totalNodos;
    const vertNodo = fCM * p.CM + fCV * p.CV;
    for (let ix = 0; ix <= nvx; ix++)
      for (let iy = 0; iy <= nvy; iy++) {
        const cub = findNodeAt(ix, iy, cotaCubierta);
        if (cub !== null) {
          loads.set(cub, [ExPorNodo, EyPorNodo, vertNodo, 0, 0, 0]);
        }
      }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = {
      elasticities, poissonsRatios,
      areas,
      momentsOfInertiaZ, momentsOfInertiaY,
      torsionalConstants, shearModuli,
      densities, sectionShapes,
    };

    try {
      states.deformOutputs.val = deform(
        states.nodes.val, states.elements.val,
        states.nodeInputs.val, states.elementInputs.val, [],
      );
      states.analyzeOutputs.val = analyze(
        states.nodes.val, states.elements.val,
        states.elementInputs.val, states.deformOutputs.val,
      );
    } catch (e) {
      console.error("[edificio-ladera] analysis failed:", e);
    }
  },

  runModal(p, states, modalPanel) {
    try {
      const out = modalAnalysis(
        states.nodes.val, states.elements.val,
        states.nodeInputs.val, states.elementInputs.val, 12,
      );
      // `states.modalOutputs` no siempre existe: al asignarle `.val` a secas
      // saltaba "Cannot set properties of undefined" ANTES de dibujar el
      // panel, asi que el modal moria sin decir nada visible.
      const mo = (states as any).modalOutputs;
      if (mo) mo.val = out;
      // Faltaba esto: el resultado se guardaba y se escribia en la CONSOLA, y
      // el panel de modos se quedaba vacio. El usuario apretaba "Correr modal"
      // y no pasaba nada visible.
      modalPanel?.render(out, {
        title: `Edificio en ladera — ${Math.round(p.nPisos)} pisos`,
        properties: [`${states.nodes.val.length} nudos · ${states.elements.val.length} elementos`],
      });
    } catch (e) {
      console.error("[edificio-ladera] modal failed:", e);
    }
  },
};
