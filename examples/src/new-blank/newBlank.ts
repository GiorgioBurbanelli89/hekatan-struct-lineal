/**
 * NewBlank — lienzo en blanco para dibujar estructuras 2D / 3D con CAD.
 *
 * Patrón:
 *   1. El usuario abre el ejemplo y obtiene un viewer vacío con plano de
 *      trabajo XY (planta) o XZ (elevación) a Z=0.
 *   2. El folder Tweakpane "📐 Herramientas CAD" del workspace ya provee:
 *      tools (select/node/line/area), planos (XY/XZ/YZ), snap, cota Z,
 *      plantas de pisos, copiar a CLI.
 *   3. El usuario dibuja con mouse en el viewer. drawingPoints +
 *      drawingPolylines del workspace se sincronizan automáticamente al
 *      script CLI (van.derive en main.ts) y este ejemplo los lee para
 *      construir el FEM model.
 *   4. Tweakpane params expuestos aquí: secciones (b, h, E, material),
 *      modo dim (2D/3D), tipo de apoyo, cargas default verticales y
 *      laterales. Todo en Tweakpane.
 *
 * Diferencia con cad-draw: este ejemplo lee directo de drawingPoints +
 * drawingPolylines (Hekatan-native simple), expone params físicos
 * en Tweakpane (secciones/cargas/apoyos) y permite alternar 2D/3D con
 * un toggle. Es el "nuevo proyecto en blanco" de Hekatan.
 */
import { deform, analyze, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

const Ec = 25e6, nu_c = 0.2, Gc = Ec / (2 * (1 + nu_c)), rho_c = 24;
const Es = 200e6, nu_s = 0.3, Gs = Es / (2 * (1 + nu_s)), rho_s = 78;

// Helpers para params con folder
const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });
// Área 3D de un cuadrilátero (dos triángulos por el producto cruz).
function quadArea(nodes: number[][], q: number[]): number {
  const P0 = nodes[q[0]], P1 = nodes[q[1]], P2 = nodes[q[2]], P3 = nodes[q[3]];
  const cr = (a: number[], b: number[], c: number[]) => {
    const u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]], v = [c[0]-a[0], c[1]-a[1], c[2]-a[2]];
    return 0.5 * Math.hypot(u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]);
  };
  return cr(P0, P1, P2) + cr(P0, P2, P3);
}

const PE = (folder: string, label: string, def: number, options: Record<string, number>) =>
  ({ default: def, label, folder, options });

export const newBlank: ExampleDef = {
  id: "new-blank",
  name: "📄 Archivo nuevo (lienzo CAD 2D/3D)",
  category: "🧪 Utilidades",
  defaultShellResult: "none",
  availableShellResults: ["none", "pressure", "displacementZ", "vonMises", "bendingXX", "bendingYY"],
  hasModal: false,
  params: {
    // ── Modo dimensión ──
    mode: PE("Modo", "Espacio de trabajo", 1, {
      "2D (plano XZ — elevación)": 0,
      "3D (espacial)":              1,
    }),

    // ── Sección por defecto para frames dibujados ──
    mat:   PE("Sección frames", "Material", 0, { "Hormigón": 0, "Acero": 1 }),
    bCol:  P("Sección frames", "b columna (m)", 0.40, 0.10, 1.00, 0.05),
    hCol:  P("Sección frames", "h columna (m)", 0.40, 0.10, 1.00, 0.05),
    bViga: P("Sección frames", "b viga (m)", 0.30, 0.10, 0.80, 0.05),
    hViga: P("Sección frames", "h viga (m)", 0.50, 0.10, 1.00, 0.05),

    // ── Sección por defecto para shells dibujados ──
    tShell: P("Sección shells", "Espesor shell (m)", 0.20, 0.05, 1.00, 0.01),
    matShell: PE("Sección shells", "Material shell", 0, { "Hormigón": 0, "Acero": 1 }),

    // ── Zapata: mallar el área dibujada + suelo Winkler ──
    // Dibujas un rectángulo (área) y aquí lo conviertes en zapata: se subdivide
    // en nx×ny celdas y, con ks>0, se ponen resortes de suelo (Winkler) nodales
    // k=ks·A_trib → sale el mapa de presión de contacto.
    mallaZapata: P("🧰 Zapata / Suelo", "Malla del área (nx = ny)", 1, 1, 12, 1),
    ksSuelo:     P("🧰 Zapata / Suelo", "Suelo ks (tonf/m³, 0 = off)", 0, 0, 8000, 50),

    // ── Apoyos automáticos en nodos del nivel más bajo ──
    // Default = "Sin apoyo automático" — el lienzo arranca limpio. El
    // usuario configura los apoyos cuando termine de dibujar.
    apoyo: PE("Apoyos", "Tipo apoyo en Z mínimo", 3, {
      "Empotrado (6 DOFs)":         0,
      "Articulado (3 trans.)":      1,
      "Rótula (Ux,Uz, libre Uy/R)": 2,
      "Sin apoyo automático":       3,
    }),

    // ── Cargas por defecto en nodos del nivel más alto ──
    // Default OFF — el lienzo arranca limpio. El usuario activa cargas
    // explícitamente cuando ya tenga geometría dibujada.
    aplicarCargas: PE("Cargas", "Aplicar cargas auto", 0, { "Sí": 1, "No": 0 }),
    // A que PATRON pertenecen las cargas de este modelo. Sin esto, el selector
    // "Case results" solo apagaba el peso propio y las cargas se aplicaban en
    // TODOS los casos por igual: poner Live no cambiaba nada salvo quitar el
    // peso, y el modelo aparecia casi vacio.
    patronCargas: PE("Cargas", "Pertenecen al patron", 0, { "Dead": 0, "Live": 1 }),
    Fz: P("Cargas", "Fz vertical/nodo (kN)", -10, -200, 0, 1),
    Fx: P("Cargas", "Fx lateral/nodo (kN)", 0, -100, 100, 1),

    // ── Solver ──
    autoSolve: PE("Solver", "Auto-resolver", 1, { "Sí": 1, "No": 0 }),
  },

  build(p, states) {
    // ── Leer puntos, polilíneas y áreas dibujadas (workspace native drawing) ──
    // Ambos están en window globals (escritos por van.derive en
    // workspace/main.ts cada vez que el usuario hace click).
    const drawPoints: number[][] =
      ((window as any).__hekatanDrawingPoints?.val) ??
      ((window as any).__hekatanDrawingPoints) ??
      [];
    const drawPolylines: number[][] =
      ((window as any).__hekatanDrawingPolylines?.val) ??
      ((window as any).__hekatanDrawingPolylines) ??
      [];
    // drawingAreas: índices de polylines marcadas como ÁREA (shell Q4)
    // por el tool "area" explícito. NO inferido de geometría — una
    // polilínea cerrada con tool "polyline" sigue siendo una cadena
    // de frames (cercha/truss).
    const drawAreasArr: number[] =
      ((window as any).__hekatanDrawingAreas?.val) ??
      ((window as any).__hekatanDrawingAreas) ??
      [];
    const drawAreas = new Set<number>(drawAreasArr);

    // ── Si no hay nada dibujado, mostrar viewer vacío ──
    if (!drawPoints.length) {
      states.nodes.val = [];
      states.elements.val = [];
      states.nodeInputs.val = { supports: new Map(), loads: new Map() };
      states.elementInputs.val = {} as any;
      states.objects3D.val = [];
      console.log("[NewBlank] Lienzo vacío — usá el folder 📐 Herramientas CAD para dibujar.");
      return;
    }

    // ── Construir nodes ──
    // Modo 2D: aplastamos Y a 0 (todos los puntos en plano XZ).
    const is2D = Math.round(p.mode ?? 1) === 0;
    const nodes: Node[] = drawPoints.map((pt) =>
      is2D ? [pt[0], 0, pt[2]] : [pt[0], pt[1], pt[2]]
    );

    // ── SOLDAR los puntos que caen en el mismo sitio ────────────────────────
    //
    // Cada trazo guarda sus propios extremos: el pórtico de 3 líneas dejaba 6
    // puntos donde hay 4 nudos, y replicado ocho veces, 72 donde hay 16. Las
    // barras se TOCABAN en la pantalla y en el modelo estaban sueltas: 36
    // voladizos flotando, no un edificio. Es el «merge joints» de ETABS.
    //
    // Se sueldan los ÍNDICES, no el array: `nodes` sigue siendo 1:1 con los
    // puntos dibujados (los apoyos y las cargas entran por ese índice directo,
    // y `pt:i` de la selección también). El punto repetido queda huérfano, sin
    // ninguna barra, y `getZerosIndices` del solver le quita los GDL.
    const TOL_SOLDAR = 1e-4;                       // 0.1 mm
    const canon = new Int32Array(nodes.length);
    {
      const donde = new Map<string, number>();
      for (let i = 0; i < nodes.length; i++) {
        const k = nodes[i].map((v) => Math.round(v / TOL_SOLDAR)).join(",");
        const ya = donde.get(k);
        if (ya === undefined) { donde.set(k, i); canon[i] = i; } else canon[i] = ya;
      }
    }
    const sold = (i: number) => (i >= 0 && i < canon.length ? canon[i] : i);

    // ── Construir elements según tipo de polilínea ──
    // Polilínea NO marcada como área → cadena de frames (1D, columnas/vigas)
    // Polilínea marcada como área → shell Q4 (4 vértices, elemento 2D)
    const elements: Element[] = [];
    const colIdx = new Set<number>();
    const beamIdx = new Set<number>();
    const shellIdx = new Set<number>();
    // Malla de la zapata dibujada + qué shells/nudos forman zapata (para Winkler).
    const nMalla = Math.max(1, Math.round(p.mallaZapata ?? 1));
    const zapataShells = new Set<number>();
    const zapataNodes = new Set<number>();
    // Mapa posición→índice para SOLDAR los nudos de malla que caen sobre un nudo
    // ya dibujado (p. ej. el nudo central donde va la carga de la columna).
    const TOL_MESH = 1e-3;
    const posKey = (q: Node) => `${Math.round(q[0]/TOL_MESH)},${Math.round(q[1]/TOL_MESH)},${Math.round(q[2]/TOL_MESH)}`;
    const nodeAt = new Map<string, number>();
    for (let i = 0; i < nodes.length; i++) nodeAt.set(posKey(nodes[i]), sold(i));
    // Mapeo segId ("polyIdx:segIdx") → elementIdx para que el listener del
    // Properties Pane pueda resolver qué frame FEM corresponde a cada
    // segmento dibujado. Necesario para asignar sec manuales por segId.
    const segIdToElemIdx = new Map<string, number>();
    for (let pi = 0; pi < drawPolylines.length; pi++) {
      const poly = drawPolylines[pi];
      if (drawAreas.has(pi)) {
        // ─ ÁREA → shell Q4 ─
        // El click handler cierra la polilínea agregando poly[0] al final,
        // así que poly = [v0, v1, v2, v3, v0]. Tomamos los 4 vértices únicos.
        const verts = (poly.length === 5 ? poly.slice(0, 4) : poly.slice(0, Math.min(4, poly.length)))
          .map(sold);
        if (verts.length !== 4) continue;
        if (verts.some(v => nodes[v] === undefined)) continue;
        if (nMalla <= 1) {
          const eIdx = elements.length;
          elements.push(verts as unknown as Element);
          shellIdx.add(eIdx); zapataShells.add(eIdx);
          for (const v of verts) zapataNodes.add(v);
        } else {
          // Subdividir el quad en nMalla×nMalla celdas (interpolación bilineal),
          // reutilizando las 4 esquinas. Igual que automallar la losa dibujada.
          const [c0, c1, c2, c3] = verts;
          const P0 = nodes[c0], P1 = nodes[c1], P2 = nodes[c2], P3 = nodes[c3];
          const bil = (s: number, t: number): Node => [
            (1-s)*(1-t)*P0[0] + s*(1-t)*P1[0] + s*t*P2[0] + (1-s)*t*P3[0],
            (1-s)*(1-t)*P0[1] + s*(1-t)*P1[1] + s*t*P2[1] + (1-s)*t*P3[1],
            (1-s)*(1-t)*P0[2] + s*(1-t)*P1[2] + s*t*P2[2] + (1-s)*t*P3[2],
          ];
          const grid: number[][] = [];
          for (let gi = 0; gi <= nMalla; gi++) {
            const fila: number[] = [];
            for (let gj = 0; gj <= nMalla; gj++) {
              if (gi === 0 && gj === 0) fila.push(c0);
              else if (gi === nMalla && gj === 0) fila.push(c1);
              else if (gi === nMalla && gj === nMalla) fila.push(c2);
              else if (gi === 0 && gj === nMalla) fila.push(c3);
              else {
                const pos = bil(gi/nMalla, gj/nMalla);
                const key = posKey(pos);
                let ni = nodeAt.get(key);
                if (ni === undefined) { ni = nodes.length; nodes.push(pos); nodeAt.set(key, ni); }
                fila.push(ni);
              }
            }
            grid.push(fila);
          }
          for (let gi = 0; gi < nMalla; gi++) for (let gj = 0; gj < nMalla; gj++) {
            const q = [grid[gi][gj], grid[gi+1][gj], grid[gi+1][gj+1], grid[gi][gj+1]];
            const eIdx = elements.length;
            elements.push(q as unknown as Element);
            shellIdx.add(eIdx); zapataShells.add(eIdx);
            for (const v of q) zapataNodes.add(v);
          }
        }
      } else {
        // ─ POLILÍNEA o LÍNEA → cadena de frames ─
        for (let i = 0; i < poly.length - 1; i++) {
          const a = sold(poly[i]), b = sold(poly[i + 1]);
          if (a === b || nodes[a] === undefined || nodes[b] === undefined) continue;
          const eIdx = elements.length;
          elements.push([a, b]);
          segIdToElemIdx.set(`${pi}:${i}`, eIdx);
          // Heurística: frame vertical (Δz dominante) → columna; horizontal → viga
          const dx = nodes[b][0] - nodes[a][0];
          const dy = nodes[b][1] - nodes[a][1];
          const dz = nodes[b][2] - nodes[a][2];
          const isVert = Math.abs(dz) > Math.max(Math.abs(dx), Math.abs(dy));
          if (isVert) colIdx.add(eIdx);
          else beamIdx.add(eIdx);
        }
      }
    }

    // ── Properties por elemento (frames: I/J/A; shells: thickness) ──
    const matIdx = Math.round(p.mat ?? 0);
    const E_frm = matIdx === 0 ? Ec : Es;
    const G_frm = matIdx === 0 ? Gc : Gs;
    const nu_frm = matIdx === 0 ? nu_c : nu_s;
    const rho_frm = matIdx === 0 ? rho_c : rho_s;

    const matShellIdx = Math.round(p.matShell ?? 0);
    const E_sh = matShellIdx === 0 ? Ec : Es;
    const G_sh = matShellIdx === 0 ? Gc : Gs;
    const nu_sh = matShellIdx === 0 ? nu_c : nu_s;
    const rho_sh = matShellIdx === 0 ? rho_c : rho_s;

    const elasticities = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const areas = new Map<number, number>();
    const Iz = new Map<number, number>();
    const Iy = new Map<number, number>();
    const J = new Map<number, number>();
    const densities = new Map<number, number>();
    const poissons = new Map<number, number>();
    const thicknesses = new Map<number, number>();

    for (let i = 0; i < elements.length; i++) {
      if (shellIdx.has(i)) {
        // Shell Q4 — solo necesita E, G, nu, density y espesor
        elasticities.set(i, E_sh);
        shearModuli.set(i, G_sh);
        densities.set(i, rho_sh);
        poissons.set(i, nu_sh);
        thicknesses.set(i, (p.tShell ?? 0.20) as number);
      } else {
        // Frame 1D — propiedades de sección rectangular
        const isCol = colIdx.has(i);
        const b = isCol ? p.bCol : p.bViga;
        const h = isCol ? p.hCol : p.hViga;
        const A = b * h;
        const Iz_ = (h * Math.pow(b, 3)) / 12;
        const Iy_ = (b * Math.pow(h, 3)) / 12;
        const J_ = 0.14 * Math.pow(Math.min(b, h), 4);
        elasticities.set(i, E_frm);
        shearModuli.set(i, G_frm);
        areas.set(i, A);
        Iz.set(i, Iz_);
        Iy.set(i, Iy_);
        J.set(i, J_);
        densities.set(i, rho_frm);
        poissons.set(i, nu_frm);
      }
    }
    // ── Secciones manuales (kind:"segs" prop:"section") ──
    type SectionProps = { A: number; Iz: number; Iy: number; J: number; name?: string };
    const manualSecs: Map<string, SectionProps> | undefined =
      (window as any).__hekatanManualSections;
    if (manualSecs && manualSecs.size > 0) {
      for (const [segKey, sec] of manualSecs.entries()) {
        const eIdx = segIdToElemIdx.get(segKey);
        if (eIdx === undefined || shellIdx.has(eIdx)) continue;
        if (sec.A != null) areas.set(eIdx, sec.A);
        if (sec.Iz != null) Iz.set(eIdx, sec.Iz);
        if (sec.Iy != null) Iy.set(eIdx, sec.Iy);
        if (sec.J != null) J.set(eIdx, sec.J);
      }
    }
    // ── Material override por segmento (prop:"material") ──
    // El nombre se busca en window.__hekatanMaterialDB. Override E, G, ν, ρ.
    const matDB: Record<string, { E: number; nu: number; rho: number }> | undefined =
      (window as any).__hekatanMaterialDB;
    const manualMat: Map<string, string> | undefined =
      (window as any).__hekatanManualMaterial;
    if (manualMat && manualMat.size > 0 && matDB) {
      for (const [segKey, matName] of manualMat.entries()) {
        const eIdx = segIdToElemIdx.get(segKey);
        if (eIdx === undefined || shellIdx.has(eIdx)) continue;
        const m = matDB[matName];
        if (!m) continue;
        elasticities.set(eIdx, m.E);
        const G_ = m.E / (2 * (1 + m.nu));
        shearModuli.set(eIdx, G_);
        densities.set(eIdx, m.rho);
        poissons.set(eIdx, m.nu);
      }
    }
    // ── Property Modifiers (prop:"modifiers") ──
    // Multipliers sobre A, Iz, Iy, J (estilo ETABS section property modifiers).
    type FrameMods = { A: number; Iz: number; Iy: number; J: number };
    const manualMods: Map<string, FrameMods> | undefined =
      (window as any).__hekatanManualModifiers;
    if (manualMods && manualMods.size > 0) {
      for (const [segKey, mods] of manualMods.entries()) {
        const eIdx = segIdToElemIdx.get(segKey);
        if (eIdx === undefined || shellIdx.has(eIdx)) continue;
        const A0 = areas.get(eIdx); if (A0 != null) areas.set(eIdx, A0 * mods.A);
        const Iz0 = Iz.get(eIdx); if (Iz0 != null) Iz.set(eIdx, Iz0 * mods.Iz);
        const Iy0 = Iy.get(eIdx); if (Iy0 != null) Iy.set(eIdx, Iy0 * mods.Iy);
        const J0 = J.get(eIdx); if (J0 != null) J.set(eIdx, J0 * mods.J);
      }
    }

    // ── Apoyos automáticos en nodos del Z mínimo ──
    const apoyoMode = Math.round(p.apoyo ?? 0);
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    if (nodes.length > 0 && apoyoMode !== 3) {
      const zMin = Math.min(...nodes.map(n => n[2]));
      const sDofs: [boolean,boolean,boolean,boolean,boolean,boolean] =
        apoyoMode === 0 ? [true, true, true, true,  true,  true]  : // empotrado
        apoyoMode === 1 ? [true, true, true, false, false, false] : // articulado
                          [true, false, true, false, false, false]; // rótula
      for (let i = 0; i < nodes.length; i++) {
        if (Math.abs(nodes[i][2] - zMin) < 1e-6) supports.set(i, [...sDofs]);
      }
    }
    // ── Apoyos manuales (vía Properties Pane → "hk:property-applied") ──
    // window.__hekatanManualSupports es un Map<drawingPtIdx, [Ux,Uy,Uz,Rx,Ry,Rz]>.
    // `nodes = drawPoints.map(...)` es 1:1 (mismo índice y orden), así que el
    // drawIdx ES directamente el índice del nodo FEM. Usamos índice DIRECTO —
    // NO matchear por coordenadas (fallaba con Y≠0 en modo 2D, donde el nodo se
    // aplasta a Y=0, y con cualquier diferencia > 1 mm).
    const manualSup: Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]> | undefined =
      (window as any).__hekatanManualSupports;
    if (manualSup && manualSup.size > 0) {
      for (const [drawIdx, dofs] of manualSup.entries()) {
        if (drawIdx >= 0 && drawIdx < nodes.length) supports.set(sold(drawIdx), [...dofs]);
      }
    }

    // ── ¿Este caso incluye el patrón al que pertenecen las cargas? ──────────
    //
    // El selector "Case results" (Settings → Analyze) elegia el caso, pero las
    // cargas no pertenecian a ningun patron: se aplicaban SIEMPRE. Poner Live
    // solo quitaba el peso propio, asi que el modelo salia sin nada — que es
    // justo lo que se veia.
    //
    // Ahora las cargas declaran su patron y se aplican solo si el caso activo
    // lo usa. Con "Case results = Live" y cargas de patron Live, se ven; con
    // cargas de Dead, no, que es lo correcto: una sobrecarga de uso no actua en
    // el caso de peso propio.
    const patronDeLasCargas = Math.round(p.patronCargas ?? 0) === 1 ? "Live" : "Dead";
    const casoActivo = (window as any).__hekatanActiveCase as string | undefined;
    const patronesDelCaso: string[] = (() => {
      const cs = (states as any).loadCases?.val ?? [];
      const c = cs.find((x: any) => x.name === casoActivo);
      if (!c) return [];                       // sin casos definidos: no se filtra
      return (c.patterns ?? []).map((pp: any) => pp.pattern);
    })();
    // Si el modelo no define casos, se comporta como siempre (aplicar cargas).
    const cargasActivas = patronesDelCaso.length === 0
      || patronesDelCaso.includes(patronDeLasCargas);

    // ── Cargas automáticas en nodos del Z máximo ──
    const loads = new Map<number, [number,number,number,number,number,number]>();
    if (cargasActivas && Math.round(p.aplicarCargas ?? 1) === 1 && nodes.length > 0) {
      const zMax = Math.max(...nodes.map(n => n[2]));
      const Fx = (p.Fx ?? 0) as number;
      const Fz = (p.Fz ?? -10) as number;
      for (let i = 0; i < nodes.length; i++) {
        if (Math.abs(nodes[i][2] - zMax) < 1e-6) loads.set(i, [Fx, 0, Fz, 0, 0, 0]);
      }
    }
    // ── Cargas manuales (vía Properties Pane) — índice DIRECTO (ver apoyos) ──
    const manualLoads: Map<number, [number,number,number,number,number,number]> | undefined =
      (window as any).__hekatanManualLoads;
    if (cargasActivas && manualLoads && manualLoads.size > 0) {
      for (const [drawIdx, lds] of manualLoads.entries()) {
        if (drawIdx >= 0 && drawIdx < nodes.length) loads.set(sold(drawIdx), [...lds]);
      }
    }

    // Con modelo por ENLACE (?heks= / ?m=) el lienzo tiene que quedarse VACIO.
    // `new-blank` dibuja un modelo de demostracion (4 nodos, 2 columnas, 1
    // viga) y se veia aparecer ese primero y despues el de verdad: parecian
    // dos cargas. Limpiarlo desde fuera no alcanza porque este derive vuelve a
    // correr y lo repone — hay que cortarlo aca, en el origen.
    if (new URLSearchParams(window.location.search).get("heks") ||
        new URLSearchParams(window.location.search).get("m")) {
      states.nodes.val = [];
      states.elements.val = [];
      states.nodeInputs.val = { supports: new Map(), loads: new Map() };
      return;
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = {
      elasticities, shearModuli, areas,
      momentsOfInertiaY: Iz, momentsOfInertiaZ: Iy,
      torsionalConstants: J, densities, poissonsRatios: poissons,
      thicknesses,
    } as any;
    states.objects3D.val = [];

    // ── Auto-solve si hay apoyos + cargas + elementos ──
    // ── Springs joint (prop:"springs") → springsList Array<{node, dof, k}> ──
    // Mapeo desde drawingPtIdx → coords → fem nodeIdx (mismo método que supports)
    const springsList: Array<{ node: number; dof: number; k: number }> = [];
    const manualSprings: Map<number, [number, number, number, number, number, number]> | undefined =
      (window as any).__hekatanManualSprings;
    if (manualSprings && manualSprings.size > 0) {
      for (const [drawIdx, kArr] of manualSprings.entries()) {
        if (drawIdx < 0 || drawIdx >= nodes.length) continue; // índice DIRECTO (ver apoyos)
        // dof: 0=Ux, 1=Uy, 2=Uz, 3=Rx, 4=Ry, 5=Rz
        for (let dof = 0; dof < 6; dof++) {
          if (kArr[dof] !== 0) springsList.push({ node: sold(drawIdx), dof, k: kArr[dof] });
        }
      }
    }
    // ── Suelo Winkler bajo la zapata dibujada: k = ks·A_trib por nudo (dof Uz) ──
    const ks_kNm3 = (p.ksSuelo ?? 0) * 9.80665;   // tonf/m³ → kN/m³
    if (ks_kNm3 > 0 && zapataNodes.size > 0) {
      const aTrib = new Map<number, number>();
      for (const eIdx of zapataShells) {
        const e = elements[eIdx] as number[];
        const A = quadArea(nodes, e);
        for (const n of e) aTrib.set(n, (aTrib.get(n) ?? 0) + A / 4);
      }
      for (const [n, A] of aTrib) {
        const kv = ks_kNm3 * A;
        springsList.push({ node: n, dof: 2, k: kv });         // vertical (Winkler)
        springsList.push({ node: n, dof: 0, k: kv * 0.5 });   // lateral X (fricción del suelo)
        springsList.push({ node: n, dof: 1, k: kv * 0.5 });   // lateral Y — evita que la zapata quede suelta
      }
    }

    if (
      Math.round(p.autoSolve ?? 1) === 1 &&
      nodes.length > 0 &&
      elements.length > 0 &&
      (supports.size > 0 || springsList.length > 0) &&   // una zapata se sostiene por sus resortes, sin apoyo rígido
      loads.size > 0
    ) {
      try {
        states.deformOutputs.val = deform(
          nodes, elements,
          { supports, loads },
          states.elementInputs.val,
          springsList.length > 0 ? springsList : undefined,
        );
        // Los DIAGRAMAS (teclas A S D) leen `analyzeOutputs`, no las flechas:
        // sin esta llamada la tecla cambiaba el rótulo y la barra seguía pelada.
        states.analyzeOutputs.val = analyze(
          nodes, elements, states.elementInputs.val, states.deformOutputs.rawVal,
        );
        // ── Presión de contacto del suelo (Winkler): σ = ks·Uz por nudo ──
        if (ks_kNm3 > 0 && zapataShells.size > 0) {
          try {
            const U = states.deformOutputs.rawVal.deformations;
            const ao: any = states.analyzeOutputs.rawVal ?? {};
            const pressure = new Map<number, number[]>();
            let pmin = 0, pmax = 0;
            for (const eIdx of zapataShells) {
              const e = elements[eIdx] as number[];
              const vals = e.map((n) => {
                const uz = U.get(n)?.[2] ?? 0;
                const pp = ks_kNm3 * uz;        // kN/m² (compresión < 0)
                if (pp < pmin) pmin = pp;
                if (pp > pmax) pmax = pp;
                return pp;
              });
              pressure.set(eIdx, vals);
            }
            ao.pressure = pressure;
            ao.colorMapRanges = { ...(ao.colorMapRanges ?? {}), pressure: [pmax, pmin] };
            states.analyzeOutputs.val = ao;
          } catch (e: any) { console.warn("[NewBlank] presión:", e?.message ?? e); }
        }
        const nud = new Set<number>();
        for (const e of elements) for (const n of e as number[]) nud.add(n);
        console.log(`[NewBlank] Solve OK — ${nud.size} nudos (de ${nodes.length} puntos), ${elements.length} elementos, ${supports.size} apoyos, ${loads.size} cargas, ${springsList.length} springs`);
      } catch (e: any) {
        console.warn(`[NewBlank] Solver falló: ${e.message}`);
      }
    } else {
      console.log(
        `[NewBlank] mode=${is2D ? "2D" : "3D"} | nodes=${nodes.length} elem=${elements.length} ` +
        `cols=${colIdx.size} vigas=${beamIdx.size} shells=${shellIdx.size} ` +
        `apoyos=${supports.size} cargas=${loads.size} springs=${springsList.length}`,
      );
    }
  },

  computedLabels(p, states) {
    const out: Record<string, string> = {};
    const ns = states.nodes.val.length;
    const es = states.elements.val.length;
    let frames = 0, shells = 0;
    for (const e of states.elements.val) {
      if ((e as number[]).length === 4) shells++;
      else frames++;
    }
    out["Stats"] = `${ns} nodos · ${frames} frames · ${shells} shells`;
    if (ns === 0) {
      out["💡 Tip"] = "Línea = 2 clicks · Polilínea = N clicks + click derecho · Área = 4 clicks";
    }
    return out;
  },
};
