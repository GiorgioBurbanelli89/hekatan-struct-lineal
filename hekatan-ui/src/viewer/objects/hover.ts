// =============================================================================
// hover.ts — Sistema GLOBAL de hover-highlight para nodos y elementos
//
// Funcionalidad:
//   - Detecta el nodo o elemento más cercano al cursor en TODOS los ejemplos
//   - Resalta visualmente con MISMO TAMAÑO que el marker normal
//   - Tooltip muestra: ID, coordenadas, DESPLAZAMIENTOS y RESULTADOS shell
//   - Click → selección PERSISTENTE (highlight verde queda fijo)
//   - RESPETA UNIDADES del workspace (forceUnit, dispUnit, stressUnit)
//   - Secciones: hormigón en cm, acero/CFT en mm (evita 0.0XX)
//
// Uso: scene.add(setupHover(...)) en getViewer.ts
// =============================================================================
import * as THREE from "three";
import van, { State } from "vanjs-core";
import { Mesh, Element, Node, DeformOutputs, AnalyzeOutputs } from "hekatan-fem";
import { Settings } from "../settings/getSettings";

// Lectura de unidades globales del workspace. Estos states se persisten en
// localStorage y se actualizan via el folder "Unidades" de Tweakpane.
// Usamos require dinámico via window para evitar import cíclico hekatan-ui ↔ examples.
function getUnits() {
  const w = window as any;
  return {
    forceUnit: (w.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf") as "kN"|"tonf"|"kip",
    dispUnit:  (w.__hekatanDispUnit  ?? localStorage.getItem("hk_dispUnit")  ?? "mm")   as "mm"|"cm"|"m"|"in",
    stressUnit:(w.__hekatanStressUnit?? localStorage.getItem("hk_stressUnit")?? "tonf/m²") as string,
  };
}
const FORCE_FACTOR: Record<string, number> = { kN: 1, tonf: 1/9.80665, kip: 1/4.4482216 };
const DISP_FACTOR:  Record<string, number> = { mm: 1000, cm: 100, m: 1, in: 39.3700787402 };
const STRESS_FACTOR: Record<string, number> = {
  "kN/m²": 1, "kPa": 1, "MPa": 1/1000, "GPa": 1/1e6,
  "kgf/cm²": 1/98.0665, "tonf/m²": 1/9.80665, "psi": 1/6.89476,
  "ksi": 1/6894.76, "kip/ft²": 1/47.88026,
};

interface HoverContext {
  scene: THREE.Scene;
  rendererElm: HTMLCanvasElement;
  getActiveCamera: () => THREE.Camera;
  derivedNodes: State<Node[]>;
  derivedDisplayScale?: State<number>;  // mismo scale que usan nodos normales
  mesh?: Mesh & {
    deformOutputs?: State<DeformOutputs>;
    analyzeOutputs?: State<AnalyzeOutputs>;
  };
  settings: Settings;
  render: () => void;
}

// Helper: format number with sensible precision
function fmt(v: number | undefined | null, digits = 4): string {
  if (v === undefined || v === null || !isFinite(v)) return "—";
  if (v === 0) return "0";
  if (Math.abs(v) < 1e-3 || Math.abs(v) > 1e5) return v.toExponential(digits);
  return v.toFixed(digits);
}

const HOVER_COLOR_NODE = 0xffaa00;     // amber/orange (hover)
const HOVER_COLOR_FRAME = 0x00ddff;    // cyan (hover)
const HOVER_COLOR_SHELL = 0x00ddff;    // cyan (hover)
const HOVER_COLOR_SOLID = 0x00ddff;    // cyan (hover)
const SELECT_COLOR = 0x00ff66;         // green (selección persistente)

export function setupHover(ctx: HoverContext): THREE.Group {
  const group = new THREE.Group();
  group.name = "__hekatan_hover";
  group.renderOrder = 99; // dibujar siempre encima

  // ── Highlight de NODO: esfera amarillo-naranja brillante ──
  const nodeGeom = new THREE.SphereGeometry(1, 16, 16);
  const nodeMat = new THREE.MeshBasicMaterial({
    color: HOVER_COLOR_NODE,
    transparent: true,
    opacity: 0.85,
    depthTest: false,
  });
  const nodeHL = new THREE.Mesh(nodeGeom, nodeMat);
  nodeHL.visible = false;
  nodeHL.renderOrder = 100;
  group.add(nodeHL);

  // ── Highlight de FRAME: línea cyan gruesa (cilindro fino) ──
  const frameGeom = new THREE.BufferGeometry();
  const frameMat = new THREE.LineBasicMaterial({
    color: HOVER_COLOR_FRAME,
    linewidth: 4,        // limited support, but mejor que default
    transparent: true,
    opacity: 0.9,
    depthTest: false,
  });
  const frameHL = new THREE.LineSegments(frameGeom, frameMat);
  frameHL.visible = false;
  frameHL.renderOrder = 100;
  group.add(frameHL);
  // Adicionalmente, un cilindro/tubo brillante para hacerlo más visible
  // (ya que linewidth es limitado en WebGL)
  const tubeMat = new THREE.MeshBasicMaterial({
    color: HOVER_COLOR_FRAME,
    transparent: true,
    opacity: 0.7,
    depthTest: false,
  });
  const tubeHL = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 12), tubeMat);
  tubeHL.visible = false;
  tubeHL.renderOrder = 100;
  group.add(tubeHL);

  // ── Highlight de SHELL: relleno cyan transparente sobre la cara ──
  const shellGeom = new THREE.BufferGeometry();
  const shellMat = new THREE.MeshBasicMaterial({
    color: HOVER_COLOR_SHELL,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
    depthTest: false,
  });
  const shellHL = new THREE.Mesh(shellGeom, shellMat);
  shellHL.visible = false;
  shellHL.renderOrder = 100;
  group.add(shellHL);

  // ── Highlight de SOLID (H8): wireframe cyan grueso sobre las 12 aristas ──
  const solidGeom = new THREE.BufferGeometry();
  const solidMat = new THREE.LineBasicMaterial({
    color: HOVER_COLOR_SOLID,
    linewidth: 3,
    transparent: true,
    opacity: 0.95,
    depthTest: false,
  });
  const solidHL = new THREE.LineSegments(solidGeom, solidMat);
  solidHL.visible = false;
  solidHL.renderOrder = 100;
  group.add(solidHL);

  // ── SELECTION PERSISTENTE (verde, queda fijo al click) ──
  const selNodeMat = new THREE.MeshBasicMaterial({
    color: SELECT_COLOR, transparent: true, opacity: 0.95, depthTest: false,
  });
  const selTubeMat = new THREE.MeshBasicMaterial({
    color: SELECT_COLOR, transparent: true, opacity: 0.85, depthTest: false,
  });
  const selCylGeom = new THREE.CylinderGeometry(1, 1, 1, 12);
  const selShellMat = new THREE.MeshBasicMaterial({
    color: SELECT_COLOR, transparent: true, opacity: 0.55,
    side: THREE.DoubleSide, depthTest: false,
  });
  const selSolidMat = new THREE.LineBasicMaterial({
    color: SELECT_COLOR, linewidth: 4, transparent: true, opacity: 1.0, depthTest: false,
  });

  // ── EL CONJUNTO DE SELECCIÓN, con las reglas de AutoCAD ──────────────────
  // Antes esto era UN solo objeto y cada click reemplazaba al anterior, que es
  // el comportamiento de PICKADD = 0. AutoCAD 2027 viene con PICKADD = 2
  // (comprobado en el registro de la instalación real,
  // HKCU\Software\Autodesk\AutoCAD\R26.0\...\SysvarMonitor): cada designación
  // SUMA al conjunto y Mayús QUITA. Así se selecciona igual que en el visor DWG
  // y que en AutoCAD.
  type SelItem = { type: "node" | "frame" | "shell" | "solid"; idx: number };
  const selSet: SelItem[] = [];
  // Expuesto igual que `__hekatanSelection` de drawing.ts: lo leen las pruebas
  // y quien quiera saber qué hay designado del MODELO (nodos, barras, shells).
  (window as any).__hekatanModelSelection = selSet;
  const selGroup = new THREE.Group();
  selGroup.renderOrder = 101;
  group.add(selGroup);
  // `selected` = el ÚLTIMO designado. Lo leen el panel de propiedades y el
  // re-render de la deformada, que solo necesitan uno.
  let selected: SelItem | null = null;

  // ── Tooltip flotante (DOM, no THREE) ──
  const tooltip = document.createElement("div");
  Object.assign(tooltip.style, {
    position: "absolute",
    pointerEvents: "none",
    padding: "5px 9px",
    fontSize: "11px",
    fontFamily: "Consolas, 'Courier New', monospace",
    background: "rgba(0, 0, 0, 0.88)",
    color: "#ffd166",
    border: "1px solid rgba(255, 200, 80, 0.5)",
    borderRadius: "4px",
    whiteSpace: "pre-line",  // soporta \n para multi-line
    zIndex: "9999",
    display: "none",
    transform: "translate(12px, 12px)",  // offset desde el cursor
    lineHeight: "1.35",
    maxWidth: "260px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
  });
  tooltip.classList.add("hekatan-hover-tooltip");
  // Append al parent del canvas (el viewer container)
  setTimeout(() => {
    if (ctx.rendererElm.parentElement) {
      ctx.rendererElm.parentElement.appendChild(tooltip);
    }
  }, 0);

  // ── Helper: posición del nodo en world coords (con scale derived nodes) ──
  function nodePos(idx: number): THREE.Vector3 | null {
    const ns = ctx.derivedNodes.rawVal;
    if (!ns || idx < 0 || idx >= ns.length) return null;
    return new THREE.Vector3(ns[idx][0], ns[idx][1], ns[idx][2]);
  }

  // ── Detección hover: busca nodo o elemento bajo el mouse ──
  // Usa proyección 2D screen space para nodos (más rápido que raycaster en
  // puntos), y bounding boxes para elementos.
  function findHovered(clientX: number, clientY: number): {
    type: "node" | "frame" | "shell" | "solid";
    idx: number;
    info: string;
  } | null {
    const camera = ctx.getActiveCamera();
    if (!camera || !ctx.mesh) return null;

    const rect = ctx.rendererElm.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;

    const nodes = ctx.derivedNodes.rawVal;
    const elements = ctx.mesh.elements?.rawVal;
    if (!nodes || !elements) return null;

    // Proyección de un Vector3 a coords pixel del canvas
    const projectedCache = new Map<number, { x: number; y: number; z: number } | null>();
    const projectNode = (idx: number) => {
      if (projectedCache.has(idx)) return projectedCache.get(idx)!;
      const p = nodePos(idx);
      if (!p) { projectedCache.set(idx, null); return null; }
      const v = p.clone().project(camera);
      // NDC -> pixel
      const px = (v.x * 0.5 + 0.5) * rect.width;
      const py = (-v.y * 0.5 + 0.5) * rect.height;
      const out = { x: px, y: py, z: v.z };
      projectedCache.set(idx, out);
      return out;
    };

    // 1) Buscar el NODO más cercano dentro de tolerancia ESTRICTA.
    // 8 px → solo si el cursor está físicamente cerca del marker del nodo.
    // (antes era 12px → muy permisivo, mostraba tooltip muy lejos del nodo)
    // ── FILTRO: solo nodos que pertenecen a algún elemento (Frame/Shell/
    // Solid). Excluye nodos huérfanos del grid, axes helper o readouts —
    // "Ni grids ni puntos sin elementos".
    const usedNodes = new Set<number>();
    for (const el of elements) {
      if (!el) continue;
      for (const n of el) usedNodes.add(n);
    }
    const NODE_TOL = 8;
    let bestNode = -1;
    let bestNodeDist = NODE_TOL;
    for (let i = 0; i < nodes.length; i++) {
      if (!usedNodes.has(i)) continue; // skip nodos sin elemento conectado
      const pp = projectNode(i);
      if (!pp || pp.z < -1 || pp.z > 1) continue; // fuera del frustum
      const dx = pp.x - mx;
      const dy = pp.y - my;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < bestNodeDist) {
        bestNodeDist = d;
        bestNode = i;
      }
    }
    // Unidades globales (usadas en TODAS las secciones — nodo, frame, shell)
    const units = getUnits();
    const dF = DISP_FACTOR[units.dispUnit] ?? 1000;   // m → unidad UI
    const fF = FORCE_FACTOR[units.forceUnit] ?? 1;    // kN → unidad UI (tonf default)

    if (bestNode >= 0) {
      const n = nodes[bestNode];
      let info = `Nodo ${bestNode}\n(${n[0].toFixed(3)}, ${n[1].toFixed(3)}, ${n[2].toFixed(3)})`;
      // Agregar desplazamientos si existen (con UNIDADES del workspace)
      const def = ctx.mesh?.deformOutputs?.rawVal;
      if (def?.deformations) {
        const u = def.deformations.get(bestNode);
        if (u) {
          info += `\n──── Δ desplaz. ────`;
          info += `\nUx = ${fmt(u[0]*dF, 3)} ${units.dispUnit}`;
          info += `\nUy = ${fmt(u[1]*dF, 3)} ${units.dispUnit}`;
          info += `\nUz = ${fmt(u[2]*dF, 3)} ${units.dispUnit}`;
          if (Math.abs(u[3]) > 1e-9 || Math.abs(u[4]) > 1e-9 || Math.abs(u[5]) > 1e-9) {
            info += `\nRx = ${fmt(u[3]*1000, 3)} mrad`;
            info += `\nRy = ${fmt(u[4]*1000, 3)} mrad`;
            info += `\nRz = ${fmt(u[5]*1000, 3)} mrad`;
          }
        }
        // Reactions (si el nodo es soporte) — fuerza en unidad UI (tonf default)
        if (def.reactions) {
          const r = def.reactions.get(bestNode);
          if (r && (Math.abs(r[0]) > 1e-9 || Math.abs(r[1]) > 1e-9 || Math.abs(r[2]) > 1e-9
                    || Math.abs(r[3]) > 1e-6 || Math.abs(r[4]) > 1e-6 || Math.abs(r[5]) > 1e-6)) {
            info += `\n──── R reacciones ────`;
            info += `\nFx = ${fmt(r[0]*fF)} ${units.forceUnit}`;
            info += `\nFy = ${fmt(r[1]*fF)} ${units.forceUnit}`;
            info += `\nFz = ${fmt(r[2]*fF)} ${units.forceUnit}`;
            if (Math.abs(r[3]) > 1e-6 || Math.abs(r[4]) > 1e-6 || Math.abs(r[5]) > 1e-6) {
              info += `\nMx = ${fmt(r[3]*fF)} ${units.forceUnit}·m`;
              info += `\nMy = ${fmt(r[4]*fF)} ${units.forceUnit}·m`;
              info += `\nMz = ${fmt(r[5]*fF)} ${units.forceUnit}·m`;
            }
          }
        }
      }
      return { type: "node", idx: bestNode, info };
    }

    // 2) Buscar el ELEMENTO más cercano.
    // Para frames (líneas): tolerancia = ancho del marker frame + margen
    // (~5 px). El tooltip solo aparece cuando el cursor está FÍSICAMENTE
    // SOBRE la línea del frame, no cerca.
    // Para shells/solids: pointInPolygon — solo si está EXACTAMENTE dentro.
    const ELEM_TOL = 5;
    let bestElem = -1;
    let bestElemDist = ELEM_TOL;
    let bestElemType: "frame" | "shell" | "solid" = "frame";
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i] as Element;
      if (!el || el.length < 2) continue;

      if (el.length === 2) {
        // FRAME: distancia punto-segmento en 2D screen
        const p1 = projectNode(el[0]);
        const p2 = projectNode(el[1]);
        if (!p1 || !p2) continue;
        if (p1.z < -1 || p1.z > 1 || p2.z < -1 || p2.z > 1) continue;
        const d = pointToSegmentDist(mx, my, p1.x, p1.y, p2.x, p2.y);
        if (d < bestElemDist) {
          bestElemDist = d;
          bestElem = i;
          bestElemType = "frame";
        }
      } else if (el.length === 3 || el.length === 4) {
        // SHELL Q4 o triangle: chequear si el punto está dentro del polígono
        const pts: Array<{ x: number; y: number; z: number }> = [];
        let valid = true;
        for (const ni of el) {
          const pp = projectNode(ni);
          if (!pp || pp.z < -1 || pp.z > 1) { valid = false; break; }
          pts.push(pp);
        }
        if (!valid) continue;
        if (pointInPolygon(mx, my, pts)) {
          // Profundidad media para preferir el más cercano
          const avgZ = pts.reduce((s, p) => s + p.z, 0) / pts.length;
          // Para shells preferimos los más cercanos al ojo (z menor = más al frente)
          const d = avgZ * 0.001;  // tiny tiebreaker
          if (d < bestElemDist) {
            bestElemDist = d;
            bestElem = i;
            bestElemType = "shell";
          }
        }
      } else if (el.length === 8) {
        // SOLID H8: chequear si el punto está dentro del bounding polygon
        // (proyectamos las 8 esquinas y tomamos su convex hull simplificado)
        const pts: Array<{ x: number; y: number; z: number }> = [];
        let valid = true;
        for (const ni of el) {
          const pp = projectNode(ni);
          if (!pp || pp.z < -1 || pp.z > 1) { valid = false; break; }
          pts.push(pp);
        }
        if (!valid) continue;
        // Bounding box rapido en screen space
        const minX = Math.min(...pts.map(p => p.x));
        const maxX = Math.max(...pts.map(p => p.x));
        const minY = Math.min(...pts.map(p => p.y));
        const maxY = Math.max(...pts.map(p => p.y));
        if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
          const avgZ = pts.reduce((s, p) => s + p.z, 0) / pts.length;
          const d = avgZ * 0.001;
          if (d < bestElemDist) {
            bestElemDist = d;
            bestElem = i;
            bestElemType = "solid";
          }
        }
      }
    }

    if (bestElem >= 0) {
      const el = elements[bestElem];
      const typeLabel = bestElemType === "frame" ? "Frame" :
                       bestElemType === "shell" ? "Shell" : "Solid";
      let info = `${typeLabel} ${bestElem}`;

      // Información de sección — formato e2k de ETABS:
      //   FRAMESECTION "name" MATERIAL "mat" SHAPE "shape" D B TF TW [FILLMATERIAL]
      // Campos esperados en elementInputs (cada uno opcional):
      //   sectionInfo: Map<idx, {name, shape, D, B, TF, TW, material, fillMaterial}>
      //   sectionLabels: Map<idx, string>  ← legacy (compatibilidad atrás)
      //   materialTypes: Map<idx, string>  ← legacy
      const ei = ctx.mesh?.elementInputs?.rawVal as any;
      const sInfo = ei?.sectionInfo?.get?.(bestElem);
      if (sInfo) {
        // Formato e2k completo
        if (sInfo.name)  info += `\n  📋 ${sInfo.name}`;
        if (sInfo.shape) info += `\n  Shape: ${sInfo.shape}`;
        // Dimensiones (D × B × TF × TW) — MM para acero/CFT, CM para hormigón
        // Detección automática:
        //   - shape contiene "Concrete" → cm
        //   - shape contiene "Steel" / "Tube" / "Filled" → mm
        //   - default → mm
        const isConcrete = /concrete|hormig|rect.*sólida/i.test(sInfo.shape || "");
        const lenFactor = isConcrete ? 100 : 1000;
        const lenUnit   = isConcrete ? "cm" : "mm";
        // Helper: redondear a 1 decimal si es necesario, sino entero
        const fmtDim = (v: number) => {
          const x = v * lenFactor;
          return Math.abs(x - Math.round(x)) < 0.05 ? `${Math.round(x)}` : `${x.toFixed(1)}`;
        };
        const dimParts: string[] = [];
        if (sInfo.D  != null) dimParts.push(`D=${fmtDim(sInfo.D)}`);
        if (sInfo.B  != null) dimParts.push(`B=${fmtDim(sInfo.B)}`);
        if (sInfo.TF != null) dimParts.push(`TF=${fmtDim(sInfo.TF)}`);
        if (sInfo.TW != null) dimParts.push(`TW=${fmtDim(sInfo.TW)}`);
        if (sInfo.t  != null) dimParts.push(`t=${fmtDim(sInfo.t)}`);   // espesor shell
        if (dimParts.length) info += `\n  Dim: ${dimParts.join(" ")} ${lenUnit}`;
        // Material (+ FillMaterial si CFT)
        if (sInfo.material) {
          let matStr = sInfo.material;
          if (sInfo.fillMaterial) matStr += ` + FILL "${sInfo.fillMaterial}"`;
          info += `\n  Mat: ${matStr}`;
        }
      } else {
        // Legacy: solo string (sin estructura)
        const secLabel = ei?.sectionLabels?.get?.(bestElem);
        const matType  = ei?.materialTypes?.get?.(bestElem);
        if (secLabel) {
          info += `\n  ${secLabel}`;
          if (matType && !secLabel.includes(matType)) info += `  (${matType})`;
        } else if (matType) {
          info += `\n  Material: ${matType}`;
        }
      }
      info += `\nnodos: [${el.join(", ")}]`;

      // Agregar resultados de análisis para shells (con UNIDADES del workspace)
      // Convención SI base: bending [kN·m/m], membrane [kN/m], shear [kN/m], stress [kN/m²=kPa]
      // Workspace tonf default → mostrar [tonf·m/m], [tonf/m], [tonf/m²]
      if (bestElemType === "shell" && ctx.mesh?.analyzeOutputs) {
        const ao = ctx.mesh.analyzeOutputs.rawVal as any;
        const sF = STRESS_FACTOR[units.stressUnit] ?? 1;
        // [key del Map, label visible, factor de conversión, unidad string]
        const fields: [string, string, number, string][] = [
          ["bendingXX",  "Mxx", fF, `${units.forceUnit}·m/m`],   // momento por longitud
          ["bendingYY",  "Myy", fF, `${units.forceUnit}·m/m`],
          ["bendingXY",  "Mxy", fF, `${units.forceUnit}·m/m`],
          ["membraneXX", "Nxx", fF, `${units.forceUnit}/m`],     // fuerza membrana por longitud
          ["membraneYY", "Nyy", fF, `${units.forceUnit}/m`],
          ["membraneXY", "Nxy", fF, `${units.forceUnit}/m`],
          ["shearX",     "Qx",  fF, `${units.forceUnit}/m`],     // cortante out-of-plane
          ["shearY",     "Qy",  fF, `${units.forceUnit}/m`],
          ["vonMises",   "σVM", sF, units.stressUnit],           // tensión
          ["pressure",   "p",   sF, units.stressUnit],           // presión suelo
        ];
        const lines: string[] = [];
        for (const [key, label, fct, unit] of fields) {
          const m = ao?.[key];
          if (m && m instanceof Map) {
            const v = m.get(bestElem);
            if (v != null) {
              if (typeof v === "number") {
                lines.push(`${label} = ${fmt(v * fct, 3)} ${unit}`);
              } else if (Array.isArray(v)) {
                // 4 valores per-nodo; tomar el de mayor magnitud
                let vMax = v[0];
                for (const x of v) {
                  if (Math.abs(x) > Math.abs(vMax)) vMax = x;
                }
                lines.push(`${label} = ${fmt(vMax * fct, 3)} ${unit}`);
              }
            }
          }
        }
        if (lines.length > 0) {
          info += `\n──── results ────\n` + lines.slice(0, 8).join("\n");
        }
      }

      // Agregar fuerzas internas para frames (axial, cortante, momento)
      if (bestElemType === "frame" && ctx.mesh?.deformOutputs && ctx.mesh.elementInputs) {
        const dout = ctx.mesh.deformOutputs.rawVal as any;
        const ei = ctx.mesh.elementInputs.rawVal as any;
        const def = dout?.deformations;
        if (def && el.length === 2) {
          const u1 = def.get(el[0]);
          const u2 = def.get(el[1]);
          const n1 = nodes[el[0]];
          const n2 = nodes[el[1]];
          if (u1 && u2 && n1 && n2) {
            const dx = n2[0] - n1[0];
            const dy = n2[1] - n1[1];
            const dz = n2[2] - n1[2];
            const L0 = Math.sqrt(dx*dx + dy*dy + dz*dz);
            if (L0 > 1e-9) {
              const tx = dx / L0, ty = dy / L0, tz = dz / L0;
              // Δ axial (desplazamiento relativo en dirección del frame)
              const dL = (u2[0]-u1[0])*tx + (u2[1]-u1[1])*ty + (u2[2]-u1[2])*tz;
              // Propiedades de sección
              const E  = ei.elasticities?.get(bestElem) ?? 0;
              const A  = ei.areas?.get(bestElem) ?? 0;
              const Iy = ei.momentsOfInertiaY?.get(bestElem) ?? 0;
              const Iz = ei.momentsOfInertiaZ?.get(bestElem) ?? 0;
              const J  = ei.torsionalConstants?.get(bestElem) ?? 0;
              const G  = ei.shearModuli?.get(bestElem) ?? E / 2.6;

              // Axial N = EA·ε
              const N_axial = E * A * (dL / L0);

              // Δ rotación relativa (torsión y flexión)
              // Torsión: Δθ_axial = (θ_j − θ_i) · t̂
              const dRx_a = (u2[3]-u1[3])*tx + (u2[4]-u1[4])*ty + (u2[5]-u1[5])*tz;
              const T_torsion = G * J * (dRx_a / L0);

              // Momentos M_y, M_z: aproximación con Δθ perpendicular
              // (sólo válido para vigas alineadas con ejes principales — diagnóstico)
              const dRy = (u2[4]-u1[4]);  // Δθy global
              const dRz = (u2[5]-u1[5]);  // Δθz global
              const My_approx = E * Iy * dRy / L0;
              const Mz_approx = E * Iz * dRz / L0;

              info += `\n──── frame ────`;
              info += `\nL = ${fmt(L0, 3)} m`;
              info += `\nΔL = ${fmt(dL*dF, 3)} ${units.dispUnit}`;
              info += `\nε = ${fmt(dL/L0, 6)}`;
              if (Math.abs(N_axial) > 1e-6) info += `\nN ≈ ${fmt(N_axial*fF)} ${units.forceUnit}`;
              if (Math.abs(T_torsion) > 1e-6) info += `\nT ≈ ${fmt(T_torsion*fF)} ${units.forceUnit}·m`;
              if (Math.abs(My_approx) > 1e-6) info += `\nMy ≈ ${fmt(My_approx*fF)} ${units.forceUnit}·m`;
              if (Math.abs(Mz_approx) > 1e-6) info += `\nMz ≈ ${fmt(Mz_approx*fF)} ${units.forceUnit}·m`;
            }
          }
        }
      }

      return { type: bestElemType, idx: bestElem, info };
    }

    return null;
  }

  // ── Update visual del highlight ──
  function updateHighlight(
    hover: { type: string; idx: number; info: string } | null,
    clientX: number,
    clientY: number
  ) {
    nodeHL.visible = false;
    frameHL.visible = false;
    tubeHL.visible = false;
    shellHL.visible = false;
    solidHL.visible = false;

    if (!hover || !ctx.mesh) {
      tooltip.style.display = "none";
      ctx.render();
      return;
    }

    const elements = ctx.mesh.elements?.rawVal;

    if (hover.type === "node") {
      const p = nodePos(hover.idx);
      if (p) {
        // Tamaño = mismo cálculo que nodes.ts:
        //   nodes.ts: PointsMaterial.size = 0.03 * extent * displayScale  (DIÁMETRO)
        //   highlight Sphere RADIUS = (0.03 * extent * displayScale) / 2 * 1.4
        //   = 0.021 * extent * displayScale  (40% más grande que radio del nodo)
        const ns = ctx.derivedNodes.rawVal ?? [];
        let extent = 1.0;
        if (ns.length >= 2) {
          let mn = [Infinity, Infinity, Infinity];
          let mx = [-Infinity, -Infinity, -Infinity];
          for (const n of ns) {
            for (let i = 0; i < 3; i++) {
              if (n[i] < mn[i]) mn[i] = n[i];
              if (n[i] > mx[i]) mx[i] = n[i];
            }
          }
          extent = Math.max(mx[0]-mn[0], mx[1]-mn[1], mx[2]-mn[2], 0.1);
        }
        const ds = ctx.derivedDisplayScale?.rawVal ?? 1;
        const sz = 0.021 * extent * ds;
        nodeHL.position.copy(p);
        nodeHL.scale.setScalar(sz);
        nodeHL.visible = true;
      }
    } else if (hover.type === "frame" && elements) {
      const el = elements[hover.idx];
      const p1 = nodePos(el[0]);
      const p2 = nodePos(el[1]);
      if (p1 && p2) {
        // Posicionar el cilindro como tubo entre p1 y p2
        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        const dir = p2.clone().sub(p1);
        const len = dir.length();
        const camera = ctx.getActiveCamera();
        const dist = camera.position.distanceTo(mid);
        const radius = dist * 0.0035;  // ~3.5px aprox
        tubeHL.position.copy(mid);
        // Orientar el cilindro alineado con el segmento (eje Y por default)
        const up = new THREE.Vector3(0, 1, 0);
        const axis = up.clone().cross(dir).normalize();
        const angle = up.angleTo(dir);
        tubeHL.quaternion.setFromAxisAngle(axis, angle);
        tubeHL.scale.set(radius, len, radius);
        tubeHL.visible = true;
      }
    } else if (hover.type === "shell" && elements) {
      const el = elements[hover.idx];
      const positions: number[] = [];
      const indices: number[] = [];
      for (const ni of el) {
        const p = nodePos(ni);
        if (!p) return;
        positions.push(p.x, p.y, p.z);
      }
      // Triangular: para 4 vertices [0,1,2] y [0,2,3]; para 3 vertices [0,1,2]
      if (el.length === 4) {
        indices.push(0, 1, 2, 0, 2, 3);
      } else if (el.length === 3) {
        indices.push(0, 1, 2);
      }
      shellGeom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      shellGeom.setIndex(indices);
      shellGeom.computeVertexNormals();
      shellHL.visible = true;
    } else if (hover.type === "solid" && elements) {
      const el = elements[hover.idx];
      // 12 aristas de un H8 (vertices ordenados como en deform.cpp)
      const edges: [number, number][] = [
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7],
      ];
      const positions: number[] = [];
      for (const [a, b] of edges) {
        const pa = nodePos(el[a]);
        const pb = nodePos(el[b]);
        if (pa && pb) {
          positions.push(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z);
        }
      }
      solidGeom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      solidHL.visible = true;
    }

    // Tooltip — suprimir si el "tooltip grande" del shell results está activo
    // (evita doble tooltip cuando el cursor está sobre un shell con results activos)
    const shellTooltipActive = (window as any).__hekatanShellTooltipVisible === true;
    if (shellTooltipActive) {
      tooltip.style.display = "none";
      ctx.render();
      return;
    }
    tooltip.textContent = hover.info;
    tooltip.style.whiteSpace = "pre-line";
    tooltip.style.display = "block";
    const rect = ctx.rendererElm.getBoundingClientRect();
    const parentRect = ctx.rendererElm.parentElement?.getBoundingClientRect() ?? rect;
    tooltip.style.left = `${clientX - parentRect.left}px`;
    tooltip.style.top = `${clientY - parentRect.top}px`;

    ctx.render();
  }

  // ── Listener pointermove ──
  let lastHoverKey = "";
  let rafId = 0;
  let debugCount = 0;
  const DEBUG_HOVER = (window as any).__hekatanHoverDebug ?? false;
  const onPointerMove = (e: PointerEvent) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const hover = findHovered(e.clientX, e.clientY);
      if (DEBUG_HOVER && debugCount < 5) {
        const ns = ctx.derivedNodes.rawVal;
        const els = ctx.mesh?.elements?.rawVal;
        console.log(`[hover] pointer (${e.clientX}, ${e.clientY}) nodes=${ns?.length ?? 0} elems=${els?.length ?? 0} hover=`, hover);
        debugCount++;
      }
      const key = hover ? `${hover.type}:${hover.idx}` : "";
      if (key !== lastHoverKey) {
        lastHoverKey = key;
        updateHighlight(hover, e.clientX, e.clientY);
      } else if (hover) {
        // Mismo objeto pero mover tooltip al cursor
        const parentRect = ctx.rendererElm.parentElement?.getBoundingClientRect()
          ?? ctx.rendererElm.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - parentRect.left}px`;
        tooltip.style.top  = `${e.clientY - parentRect.top}px`;
      }
    });
  };

  // ── Limpieza con DEBOUNCE: solo ocultamos si el cursor está fuera del
  // canvas POR MÁS DE 200ms — evita parpadeo por eventos sintéticos.
  let leaveTimer: number | null = null;
  const clearHover = () => {
    lastHoverKey = "";
    nodeHL.visible = false;
    frameHL.visible = false;
    tubeHL.visible = false;
    shellHL.visible = false;
    solidHL.visible = false;
    tooltip.style.display = "none";
    ctx.render();
  };
  const onPointerLeave = (e: PointerEvent) => {
    const rect = ctx.rendererElm.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const reallyOutside = (mx < -2 || my < -2 || mx > rect.width + 2 || my > rect.height + 2);
    if (!reallyOutside) return; // cursor sigue sobre el canvas
    if (leaveTimer) clearTimeout(leaveTimer);
    leaveTimer = window.setTimeout(clearHover, 200);
  };
  const onPointerEnter = () => {
    if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
  };

  ctx.rendererElm.addEventListener("pointermove", onPointerMove);
  ctx.rendererElm.addEventListener("pointerleave", onPointerLeave);
  ctx.rendererElm.addEventListener("pointerenter", onPointerEnter);

  // ── Click handler: SELECCIÓN PERSISTENTE ──
  // Click sobre nodo/elemento → se DESIGNA y se suma al conjunto (PICKADD = 2)
  // Mayús+click → lo quita · Click sobre vacío → vacía el conjunto · Esc → igual

  /** ¿Se puede designar ahora mismo?
   *
   *  Este era el bug: el manejador NO miraba qué comando estaba activo, así que
   *  un click seleccionaba también mientras se dibujaba, se borraba o se medía.
   *  Jorge: *"cuando hago click sigue seleccionando sea lo que esté haciendo"*.
   *  La condición es la misma que ya usaba `drawing.ts` para su propia
   *  selección: sólo con la herramienta «select» (o ninguna).
   */
  function sePuedeDesignar(): boolean {
    const tool = ((window as any).__hekatanCadState?.get?.() as any)?.tool ?? "select";
    return tool === "select" || tool === "none" || !tool;
  }

  let pointerDownPos: { x: number; y: number } | null = null;
  ctx.rendererElm.addEventListener("pointerdown", (e: PointerEvent) => {
    if (e.button !== 0) return;  // solo left click
    pointerDownPos = { x: e.clientX, y: e.clientY };
  });
  ctx.rendererElm.addEventListener("pointerup", (e: PointerEvent) => {
    if (e.button !== 0 || !pointerDownPos) return;
    // Detectar drag (no tratar como click si se movió mucho)
    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    pointerDownPos = null;
    if (dx * dx + dy * dy > 9) return;  // > 3 px = drag, no click
    if (!sePuedeDesignar()) return;     // hay un comando en marcha: no se designa

    const hover = findHovered(e.clientX, e.clientY);
    if (hover) {
      designar({ type: hover.type, idx: hover.idx }, e.shiftKey);
      updateSelection();
    } else {
      limpiarSeleccion();               // click en vacío → conjunto vacío
    }
  });

  // Esc vacía el conjunto, como en AutoCAD.
  //
  // Va en fase de CAPTURA a propósito: la barra de comandos (`hk3-cmd-input`)
  // tiene el foco SIEMPRE —es el sumidero de teclado, igual que la línea de
  // comandos de AutoCAD— y su propio manejador corta la propagación, así que
  // en fase de burbuja este Escape no llegaba nunca y la selección no se
  // vaciaba. La condición de "campo de texto de verdad" es la misma que ya usa
  // `drawing.ts` para el Delete: los dos inputs de comando, si están vacíos,
  // no cuentan como escritura.
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key !== "Escape" || !selSet.length) return;
    const ae = document.activeElement as HTMLElement | null;
    const cmdVacio = !!ae && (ae.id === "hk3-cmd-input" || ae.id === "hk-dyn-input")
      && (ae as HTMLInputElement).value === "";
    const escribiendo = !!ae
      && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable)
      && !cmdVacio;
    if (escribiendo) return;
    limpiarSeleccion();
  }, { capture: true });

  // ── Update visual de la SELECCIÓN PERSISTENTE ──
  /** Borra los resaltados y libera las geometrías propias de cada uno. */
  function limpiarResaltados() {
    for (const o of selGroup.children.slice()) {
      selGroup.remove(o);
      const g = (o as THREE.Mesh).geometry;
      // nodeGeom y selCylGeom son compartidas: esas no se tiran
      if (g && g !== nodeGeom && g !== selCylGeom) g.dispose();
    }
  }

  /** Los metros que mide UN PÍXEL en el punto dado, con la cámara activa.
   *
   * ⚠️ El resaltado del nudo designado se dimensionaba con `0.025 · extensión del
   * MODELO · escala de dibujo`, y la esfera base tiene radio 1 m. O sea que crecía
   * con el edificio: en uno de 5 plantas (extensión 21 m) salía una bola de varios
   * metros que tapaba la estructura — lo vio Jorge en el render del 9-sep-2026.
   * El tamaño de un marcador no depende de lo grande que sea la obra, depende de la
   * pantalla: se pide en píxeles y se convierte aquí, como el cursor y la mirilla.
   */
  const metrosPorPixel = (punto: THREE.Vector3): number => {
    const cam = ctx.getActiveCamera() as any;
    const h = ctx.rendererElm?.clientHeight || 700;
    if (cam.isOrthographicCamera) return (cam.top - cam.bottom) / (cam.zoom || 1) / h;
    const dist = cam.position.distanceTo(punto);
    return (2 * dist * Math.tan(((cam.fov || 50) * Math.PI / 180) / 2)) / h;
  };

  /** Dibuja el resaltado de UN objeto designado. */
  function resaltar(sel: SelItem, extent: number) {
    const elements = ctx.mesh?.elements?.rawVal;
    if (sel.type === "node") {
      const p = nodePos(sel.idx);
      if (!p) return;
      // Tamaño = consistente con nodes.ts (radio = diámetro/2 * 1.7 = más grande
      // que el hover para distinguir selección persistente)
      const m = new THREE.Mesh(nodeGeom, selNodeMat);
      m.position.copy(p);
      // 7 px de radio: un nudo designado canta sin tapar nada. `nodeGeom` mide 1 m,
      // así que la escala son directamente los metros que se quieren.
      m.scale.setScalar(Math.max(1e-4, 7 * metrosPorPixel(p)));
      m.renderOrder = 101;
      selGroup.add(m);
    } else if (sel.type === "frame" && elements) {
      const el = elements[sel.idx];
      const p1 = nodePos(el[0]);
      const p2 = nodePos(el[1]);
      if (!p1 || !p2) return;
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const dir = p2.clone().sub(p1);
      const len = dir.length();
      const dist = ctx.getActiveCamera().position.distanceTo(mid);
      const m = new THREE.Mesh(selCylGeom, selTubeMat);
      m.position.copy(mid);
      const up = new THREE.Vector3(0, 1, 0);
      m.quaternion.setFromAxisAngle(up.clone().cross(dir).normalize(), up.angleTo(dir));
      m.scale.set(dist * 0.0035, len, dist * 0.0035);
      m.renderOrder = 101;
      selGroup.add(m);
    } else if (sel.type === "shell" && elements) {
      const el = elements[sel.idx];
      const positions: number[] = [];
      const indices: number[] = [];
      for (const ni of el) {
        const p = nodePos(ni);
        if (!p) return;
        positions.push(p.x, p.y, p.z);
      }
      if (el.length === 4) indices.push(0, 1, 2, 0, 2, 3);
      else if (el.length === 3) indices.push(0, 1, 2);
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      g.setIndex(indices);
      g.computeVertexNormals();
      const m = new THREE.Mesh(g, selShellMat);
      m.renderOrder = 101;
      selGroup.add(m);
    } else if (sel.type === "solid" && elements) {
      const el = elements[sel.idx];
      const edges: [number, number][] = [
        [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7],
      ];
      const positions: number[] = [];
      for (const [a, b] of edges) {
        const pa = nodePos(el[a]);
        const pb = nodePos(el[b]);
        if (pa && pb) positions.push(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      const m = new THREE.LineSegments(g, selSolidMat);
      m.renderOrder = 101;
      selGroup.add(m);
    }
  }

  function updateSelection() {
    limpiarResaltados();
    if (!selSet.length || !ctx.mesh) {
      ctx.render();
      return;
    }
    // La extensión del modelo se calcula UNA vez, no por objeto designado
    const ns = ctx.derivedNodes.rawVal ?? [];
    let extent = 1.0;
    if (ns.length >= 2) {
      const mn = [Infinity, Infinity, Infinity];
      const mx = [-Infinity, -Infinity, -Infinity];
      for (const n of ns) {
        for (let i = 0; i < 3; i++) {
          if (n[i] < mn[i]) mn[i] = n[i];
          if (n[i] > mx[i]) mx[i] = n[i];
        }
      }
      extent = Math.max(mx[0]-mn[0], mx[1]-mn[1], mx[2]-mn[2], 0.1);
    }
    for (const s of selSet) resaltar(s, extent);
    ctx.render();
  }

  /** Mete o saca un objeto del conjunto, con las reglas de PICKADD = 2.
   *  Suma; con Mayús quita; volver a pinchar lo mismo también quita (AutoCAD
   *  no admite duplicados en el conjunto). */
  function designar(item: SelItem, conMayus: boolean) {
    const i = selSet.findIndex((s) => s.type === item.type && s.idx === item.idx);
    if (i >= 0) {
      selSet.splice(i, 1);
    } else if (!conMayus) {
      selSet.push(item);
    }
    selected = selSet.length ? selSet[selSet.length - 1] : null;
  }

  function limpiarSeleccion() {
    selSet.length = 0;
    selected = null;
    updateSelection();
  }

  // Re-render selección cuando cambia la cámara o nodos (deformed shape)
  van.derive(() => {
    ctx.derivedNodes.val;  // trigger
    if (selSet.length) updateSelection();
  });

  // El group debe llevar el mismo "onBeforeRender" del scene para garantía de
  // visibilidad sobre los demás elementos: depthTest: false ya lo hace, pero
  // setting renderOrder = 99/100 garantiza que se dibuje al final.

  return group;
}

// ── Helpers de geometría 2D ──
function pointToSegmentDist(
  px: number, py: number,
  x1: number, y1: number,
  x2: number, y2: number
): number {
  const dx = x2 - x1, dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-9) {
    const ddx = px - x1, ddy = py - y1;
    return Math.sqrt(ddx * ddx + ddy * ddy);
  }
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const xx = x1 + t * dx;
  const yy = y1 + t * dy;
  const ex = px - xx, ey = py - yy;
  return Math.sqrt(ex * ex + ey * ey);
}

function pointInPolygon(
  px: number, py: number,
  poly: Array<{ x: number; y: number }>
): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    if ((yi > py) !== (yj > py) &&
        px < (xj - xi) * (py - yi) / (yj - yi + 1e-12) + xi) {
      inside = !inside;
    }
  }
  return inside;
}
