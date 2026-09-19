import van, { State } from "vanjs-core";
import * as THREE from "three";
import { Pane } from "tweakpane";
import { activeExampleVersion } from "../workspace/exampleVersion";
import {
  deform,
  analyze,
  getLocalStiffnessMatrix,
  getTransformationMatrix,
  plateQ4Solve,
  modalAnalysis,
  slopeSRM,
} from "hekatan-fem";
import type { ModalOutputs } from "hekatan-fem";
import { getMesh } from "hekatan-mesh";
import { multiply, transpose, norm, subtract } from "mathjs";
import type {
  Node,
  Element,
  NodeInputs,
  ElementInputs,
  DeformOutputs,
  AnalyzeOutputs,
} from "hekatan-fem";
import type { ViewerContext3D } from "hekatan-ui/src/viewer/getViewer";
import { getTheme, getThemeName, onThemeChange } from "hekatan-ui/src/theme";
import { UNIT_SYSTEMS, buildUnitSystem, FORCE_UNITS, LENGTH_UNITS, getGeneratorParams, getLoadParams, getSupportOptions, type UnitSystemId, type UnitSystem, type ForceUnitId, type LengthUnitId } from "./units";
import { createModalPanel } from "./renderModalTable";
import { MODE_SCALE_PERCENT, modelDiagonal } from "./modeScale";
import { STEEL_PROFILES, getWProfileOptions, getHSSProfileOptions } from "./steelProfiles";
import { buildReportExplained } from "./reportExplained";
import { buildElementReport } from "./elementReport";
import { currentLang, setLang, updateDomTranslations } from "./i18n";
import { createHelpButton } from "./helpTour";
import { parseE2k, type E2kModel } from "./e2kParser";
import { parseS2k } from "./s2kParser";
import { exportS2k } from "./s2kExporter";
import { exportE2k } from "./e2kExporter";
import { rectSection, circSection, iParamSection, hollowRectSection, cftSection } from "./cadSections";
import { exportOpenSeesPy, exportOpenSeesTcl, importOpenSeesPy, importOpenSeesTcl } from "./openseesIO";
import { parseIfcToAnalytical } from "./ifcAnalyticalParser";
import { loadIfcToScene, filterIfcByPreset, type IfcLoadResult, type IfcDetailCategory } from "./Draw3DIfc";
import { ecHormigonACI } from "./materials";

export interface Cad3dMesh {
  nodes: State<Node[]>;
  elements: State<Element[]>;
  nodeInputs?: State<NodeInputs>;
  elementInputs?: State<ElementInputs>;
  deformOutputs?: State<DeformOutputs>;
  analyzeOutputs?: State<AnalyzeOutputs>;
}

/** Reactive flag — true when getCad3d has an active generator/example controlling the model */
export const cadActive: State<boolean> = van.state(false);

/* ──────────────────────────────────────────────
 *  getCad3d — CLI `window.cad` + floating panel
 * ────────────────────────────────────────────── */
export function getCad3d(mesh: Cad3dMesh): HTMLElement {

  // ── Ensure all state objects exist (create if not passed) ──
  if (!mesh.nodeInputs) mesh.nodeInputs = van.state({} as NodeInputs);
  if (!mesh.elementInputs) mesh.elementInputs = van.state({} as ElementInputs);
  if (!mesh.deformOutputs) mesh.deformOutputs = van.state({} as DeformOutputs);
  if (!mesh.analyzeOutputs) mesh.analyzeOutputs = van.state({} as AnalyzeOutputs);

  // ── Unit system state ──
  let activeForceId: ForceUnitId = "tonf";
  let activeLengthId: LengthUnitId = "m";
  let activeUnits: UnitSystem = buildUnitSystem(activeForceId, activeLengthId);
  // Stress unit override (for MKS: kgf/cm² while force=tonf, length=m)
  type StressPreset = { forceId: ForceUnitId; lengthId: LengthUnitId; label: string };
  let activeStressUnit: StressPreset = { forceId: "kgf", lengthId: "cm", label: "kgf/cm²" };
  // Unit presets
  const UNIT_PRESETS: Record<string, { force: ForceUnitId; length: LengthUnitId; stress: StressPreset }> = {
    MKS: { force: "tonf", length: "m", stress: { forceId: "kgf", lengthId: "cm", label: "kgf/cm²" } },
    SI:  { force: "kN",   length: "m", stress: { forceId: "kN",  lengthId: "m",  label: "kPa" } },
    US:  { force: "kip",  length: "in", stress: { forceId: "kip", lengthId: "in", label: "ksi" } },
  };
  let activePreset = "MKS";

  // ── Per-element overrides & deletions ──
  type ElemOverride = {
    material?: number;  // 0=hormigón, 1=acero, 2=CFT
    secType?: string;   // "rect","circ","W","HSS","I-param","tubular"
    b?: number; h?: number; // rect dims
    profileIdx?: number;    // W/HSS profile
    bf?: number; hf?: number; tf?: number; tw?: number; // I-param
    bc?: number; hc?: number; t?: number;  // tubular/CFT
    fc?: number; Es?: number; nuS?: number; nuC?: number; // CFT
    // Releases — full 12-DOF [FxI,FyI,FzI,TI,M2I,M3I, FxJ,FyJ,FzJ,TJ,M2J,M3J]
    releases12?: boolean[];
    springs12?: number[];  // partial fixity spring stiffnesses
    // Legacy compat
    releaseRotStart?: boolean;
    releaseRotEnd?: boolean;
    releaseAxial?: boolean;
    releaseTorsion?: boolean;
    // Property/Stiffness Modification Factors (default = 1)
    modA?: number;      // Cross-section (axial) Area
    modAs2?: number;    // Shear Area dir 2 (0=Euler-Bernoulli, 1=Timoshenko)
    modAs3?: number;    // Shear Area dir 3 (0=Euler-Bernoulli, 1=Timoshenko)
    modJ?: number;      // Torsional Constant
    modI?: number;      // Moment of Inertia about 2 axis
    modI3?: number;     // Moment of Inertia about 3 axis
    modMass?: number;   // Mass modifier
    modWeight?: number; // Weight modifier
  };
  const deletedElements = new Set<number>();
  const hiddenElements = new Set<number>();
  let isolateMode = false;
  const isolatedElements = new Set<number>();
  const elementOverrides = new Map<number, ElemOverride>();

  // ── Active generator state ──
  let activeGenerator = "";
  let generatorParams: Record<string, { val: number; min: number; max: number; step: number; label: string }> = {};
  let cadPane: Pane | null = null; // Tweakpane instance for generator params
  let savedOriginalHTML = ""; // Original #parameters innerHTML to restore on Clear

  // ── Edificio: individual span arrays svx=[s1,s2,...], svy=[s1,s2,...], hpisos=[h1,h2,...] ──
  let edifSvx: number[] = [];  // individual span lengths in X
  let edifSvy: number[] = [];  // individual span lengths in Y
  let edifHpisos: number[] = []; // individual floor heights (Dr. Aguiar style)

  // ── Section tracking: which element indices are columns vs beams, floor, and bay ──
  let colElementIndices: Set<number> = new Set();
  let beamElementIndices: Set<number> = new Set();
  let wallElementIndices: Set<number> = new Set(); // shell Q4 elements (shear walls)
  let elementFloor: Map<number, number> = new Map(); // element index -> floor (0-based)
  let elementBay: Map<number, { dir: 'x' | 'y'; bay: number }> = new Map(); // beam element -> bay info
  let lastImportedE2k: E2kModel | null = null; // preserved for round-trip export

  // ── Shear wall state ──
  // wallPlacements: list of {dir, bay, axisIdx, floors} — which bays have walls
  // dir='x' → wall in X direction (between X bays), axis=Y index
  // dir='y' → wall in Y direction (between Y bays), axis=X index
  type WallPlacement = {
    dir: 'x' | 'y';  // direction of the wall span
    bay: number;      // bay index (0-based)
    axisIdx: number;  // grid axis on which wall sits
    floors: number[]; // which floors (0-based) have this wall (-1 = all)
  };
  let wallPlacements: WallPlacement[] = [];
  let wallThickness = 0.20; // m
  let wallSubdivH = 2; // vertical subdivisions per floor
  let wallSubdivW = 2; // horizontal subdivisions per wall

  // ── Secondary beams state ──
  let secondaryBeamsEnabled = false;
  let nSecondaryBeams = 2; // number of secondary beams per bay
  let secondaryBeamDir: 'x' | 'y' = 'x'; // direction they RUN (perpendicular to principal span)
  let secondaryBeamElementIndices: Set<number> = new Set();

  // ── Floor slab state ──
  let slabEnabled = true;            // toggle on/off
  let slabThickness = 0.15;         // m
  let slabSubdivX = 2;              // subdivisions per bay in X
  let slabSubdivY = 2;              // subdivisions per bay in Y
  let slabElementIndices: Set<number> = new Set();

  // ── Braces state (for generator-based buildings) ──
  let bracesEnabled = false;
  let bracesMode: string = "perimeter"; // "perimeter", "all", "x", "y"

  // ── Section state (persists across rebuilds) ──
  // secType: 0=rect(concrete), 1=circ(concrete), 2=W-profile, 3=HSS-profile, 4=I-param, 5=tubular-hueca, 6=CFT
  type BeamSec = {
    b: number; h: number;             // rect concrete (m)
    profileIdx?: number;              // W/HSS profile index
    // I paramétrica (secType=4):
    bf?: number; hf?: number; tf?: number; tw?: number;
    // Tubular hueca (secType=5):
    hc?: number; bc?: number; t?: number;
    secType?: number;                 // 0=rect, 2=W, 3=HSS, 4=I-param, 5=tubular, 6=CFT
  };
  type FloorSection = {
    bCol: number; hCol: number; dCol: number;   // column dims (m) — concrete
    colProfileIdx: number;                       // steel profile index
    // Column parametric (for steel non-profile):
    colSecType: number;       // 0=rect, 1=circ, 2=W, 3=HSS, 4=I-param, 5=tubular, 6=CFT
    colBf?: number; colHf?: number; colTf?: number; colTw?: number; // I param
    colHc?: number; colBc?: number; colT?: number;                   // tubular + CFT
    colFc?: number;                                                  // CFT concrete f'c (kN/m²)
    colEs?: number; colNuS?: number;                                 // CFT steel E (kN/m²) + ν
    colNuC?: number;                                                 // CFT concrete ν
    vigasX: BeamSec[];  // per X-span beam sections
    vigasY: BeamSec[];  // per Y-span beam sections
  };
  const defaultBeamSec = (): BeamSec => ({ b: 0.30, h: 0.40, profileIdx: 0, secType: 0,
    bf: 0.20, hf: 0.40, tf: 0.015, tw: 0.010,
    hc: 0.30, bc: 0.20, t: 0.008 });
  const defaultFloor = (nvx: number, nvy: number): FloorSection => ({
    bCol: 0.40, hCol: 0.40, dCol: 0.40, colProfileIdx: 0, colSecType: 0,
    colBf: 0.30, colHf: 0.30, colTf: 0.020, colTw: 0.012,
    colHc: 0.30, colBc: 0.30, colT: 0.010,
    colFc: 20594,  // f'c for CFT fill (kN/m² = 210 kgf/cm²)
    colEs: 200e6, colNuS: 0.30,  // steel E + ν
    colNuC: 0.20,                // concrete ν
    vigasX: Array.from({ length: nvx }, defaultBeamSec),
    vigasY: Array.from({ length: nvy }, defaultBeamSec),
  });
  const sectionState = {
    material: 0,     // LEGACY — not used directly anymore
    colMat: 0,       // 0=hormigón, 1=acero, 2=CFT
    vigaMat: 0,      // 0=hormigón, 1=acero
    colShape: 0,     // 0=rectangular, 1=circular (concrete columns only)
    fc: 20594,       // kN/m² (f'c = 210 kgf/cm²) for concrete columns/beams
    steelColType: 0, // 0=W, 1=HSS, 2=I-param, 3=tubular (for steel columns)
    steelVigaType: 0, // 0=W, 1=HSS, 2=I-param, 3=tubular (for steel beams)
    perFloor: [] as FloorSection[],
  };

  // ── Support type (index into getSupportOptions()[generator]) ──
  let supportType: number = 0;  // 0 = first option (usually "Empotrado" or "Simply Supported")

  // ── Plate theory type (for placa-3q / placa-q4) ──
  // 1 = Membrana, 2 = Kirchhoff (delgada), 3 = Mindlin-Reissner (gruesa)
  let plateTheory: number = 3;

  // ── Modal analysis state ──
  let modalEnabled: boolean = false;
  let modalMode: number = 0;        // active mode index (0-based)
  let modalResults: ModalOutputs | null = null;
  let modalAnimId: number = 0;       // requestAnimationFrame ID
  let modalOriginalNodes: Node[] = []; // undeformed positions
  let modalScale: number = 1.0;     // auto-computed amplitude scale
  let modalLoadsWasVisible: boolean = true; // loads visibility before modal
  const modalPanel = createModalPanel();
  modalPanel.div.style.display = "none";

  /** Get current support DOFs based on supportType and active generator */
  function getSupportDofs(): [boolean,boolean,boolean,boolean,boolean,boolean] {
    const opts = getSupportOptions()[activeGenerator];
    if (opts && opts[supportType]) return opts[supportType].dofs;
    return [true,true,true,true,true,true]; // default: empotrado
  }

  // ── Grid coordinates (for per-axis elevation views) ──
  let currentGridX: { label: string; coord: number }[] = [];  // X-axis positions (ejes A, B, C...)
  let currentGridY: { label: string; coord: number }[] = [];  // Y-axis positions (ejes 1, 2, 3...)
  let currentGridZmax = 0;
  let currentGridLevels: { label: string; elev: number }[] = [];  // Y-levels (Base, P1, P2...)

  // ── Construction/Reference grid (imaginary lines) ──
  let refGridGroup: THREE.Group | null = null;

  function clearRefGrid() {
    if (!refGridGroup) return;
    const ctx = getViewerCtx();
    if (ctx) ctx.scene.remove(refGridGroup);
    refGridGroup.traverse((obj) => {
      if ((obj as any).geometry) (obj as any).geometry.dispose();
      if ((obj as any).material) {
        const mat = (obj as any).material;
        if (mat.map) mat.map.dispose();
        mat.dispose();
      }
    });
    refGridGroup = null;
  }

  /**
   * Draw construction/reference grid lines in 3D.
   * Shows:
   *  - Floor grids (XZ lines at each Y level) — thin dashed lines at every floor
   *  - Vertical guide lines at each grid intersection (for column placement)
   *  - Works in 3D, Plan, EX, EY views
   */
  function createRefGrid(
    xCoords: number[], zCoords: number[], yLevels: number[],
    labelsX?: string[], labelsZ?: string[]
  ) {
    clearRefGrid();
    const ctx = getViewerCtx();
    if (!ctx) return;

    refGridGroup = new THREE.Group();
    refGridGroup.name = "refGrid";

    const xMin = Math.min(...xCoords), xMax = Math.max(...xCoords);
    const zMin = Math.min(...zCoords), zMax = Math.max(...zCoords);
    const yMax = Math.max(...yLevels);
    const extX = xMax - xMin || 1, extZ = zMax - zMin || 1;
    const gridColor = 0x334455;
    const vertColor = 0x223344;

    // Floor grids at each Y level
    for (const y of yLevels) {
      // X-parallel lines (one per Z coord)
      for (const z of zCoords) {
        const geom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(xMin, y, z), new THREE.Vector3(xMax, y, z)
        ]);
        const mat = new THREE.LineDashedMaterial({
          color: gridColor, dashSize: extX * 0.015, gapSize: extX * 0.01,
          transparent: true, opacity: 0.25,
        });
        const line = new THREE.Line(geom, mat);
        line.computeLineDistances();
        line.renderOrder = -10;
        refGridGroup.add(line);
      }
      // Z-parallel lines (one per X coord)
      for (const x of xCoords) {
        const geom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, y, zMin), new THREE.Vector3(x, y, zMax)
        ]);
        const mat = new THREE.LineDashedMaterial({
          color: gridColor, dashSize: extZ * 0.015, gapSize: extZ * 0.01,
          transparent: true, opacity: 0.25,
        });
        const line = new THREE.Line(geom, mat);
        line.computeLineDistances();
        line.renderOrder = -10;
        refGridGroup.add(line);
      }
    }

    // Vertical guide lines at each grid intersection (from base to top)
    for (const x of xCoords) {
      for (const z of zCoords) {
        const geom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, 0, z), new THREE.Vector3(x, yMax, z)
        ]);
        const mat = new THREE.LineDashedMaterial({
          color: vertColor, dashSize: yMax * 0.01, gapSize: yMax * 0.008,
          transparent: true, opacity: 0.15,
        });
        const line = new THREE.Line(geom, mat);
        line.computeLineDistances();
        line.renderOrder = -10;
        refGridGroup.add(line);
      }
    }

    // Small cross markers at grid intersections on each floor
    const crossSize = Math.min(extX, extZ) * 0.015;
    for (const y of yLevels) {
      for (const x of xCoords) {
        for (const z of zCoords) {
          // + shaped cross
          const pts = [
            new THREE.Vector3(x - crossSize, y, z), new THREE.Vector3(x + crossSize, y, z),
            new THREE.Vector3(x, y, z - crossSize), new THREE.Vector3(x, y, z + crossSize),
          ];
          const geom = new THREE.BufferGeometry().setFromPoints(pts);
          const mat = new THREE.LineBasicMaterial({ color: 0x556677, transparent: true, opacity: 0.4 });
          const cross = new THREE.LineSegments(geom, mat);
          cross.renderOrder = -5;
          refGridGroup.add(cross);
        }
      }
    }

    // Make immune to clipping planes
    refGridGroup.traverse((obj: any) => {
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m: any) => { m.clippingPlanes = []; });
        } else {
          obj.material.clippingPlanes = [];
        }
      }
    });

    ctx.scene.add(refGridGroup);
    ctx.render();
  }

  // ── Grid axes state (ETABS-style axis labels) ──
  let gridAxesGroup: THREE.Group | null = null;

  /** Remove grid axes from scene */
  function clearGridAxes() {
    if (!gridAxesGroup) return;
    const ctx = getViewerCtx();
    if (ctx) ctx.scene.remove(gridAxesGroup);
    gridAxesGroup.traverse((obj) => {
      if ((obj as any).geometry) (obj as any).geometry.dispose();
      if ((obj as any).material) {
        const mat = (obj as any).material;
        if (mat.map) mat.map.dispose();
        mat.dispose();
      }
    });
    gridAxesGroup = null;
  }

  /**
   * Create ETABS-style grid axes: dashed lines + circled labels
   * @param xCoords - X grid line positions
   * @param yCoords - Y grid line positions
   * @param zMax - top of building (for vertical extent of lines)
   * @param labelsX - labels for X lines (default: A, B, C, ...)
   * @param labelsY - labels for Y lines (default: 1, 2, 3, ...)
   */
  function createGridAxes(xCoords: number[], yCoords: number[], zMax: number, labelsX?: string[], labelsY?: string[]) {
    clearGridAxes();
    const ctx = getViewerCtx();
    if (!ctx) return;

    gridAxesGroup = new THREE.Group();
    gridAxesGroup.name = "gridAxes";

    const xMin = Math.min(...xCoords), xMax = Math.max(...xCoords);
    const yMin = Math.min(...yCoords), yMax = Math.max(...yCoords);
    const extentX = xMax - xMin || 1;
    const extentY = yMax - yMin || 1;
    const extent = Math.max(extentX, extentY);
    const overshoot = extent * 0.08; // how far axes extend beyond the grid

    // Default labels: A,B,C... for X; 1,2,3... for Y
    const lx = labelsX || xCoords.map((_, i) => String.fromCharCode(65 + i)); // A, B, C, ...
    const ly = labelsY || yCoords.map((_, i) => String(i + 1)); // 1, 2, 3, ...

    const circleRadius = extent * 0.018;
    const is2D = yCoords.length <= 1; // frame (2D) mode
    const lineColor = 0x888888;

    // X axis bubbles (A, B, C...) — placed at z=0 plan
    for (let ix = 0; ix < xCoords.length; ix++) {
      const x = xCoords[ix];
      if (is2D) {
        const bubbleZ = -overshoot - circleRadius * 1.5;
        // Projection line from structure base to bubble
        addProjectionLine(x, 0, 0, x, 0, bubbleZ + circleRadius, lineColor, gridAxesGroup);
        addAxisLabel(lx[ix] || `${ix}`, x, 0, bubbleZ, circleRadius, gridAxesGroup);
      } else {
        const bubbleY = yMin - overshoot - circleRadius * 1.5;
        // Projection line from structure edge to bubble
        addProjectionLine(x, yMin, 0, x, bubbleY + circleRadius, 0, lineColor, gridAxesGroup);
        addAxisLabel(lx[ix] || `${ix}`, x, bubbleY, 0, circleRadius, gridAxesGroup);
      }
    }

    // Y axis bubbles (1, 2, 3...) — only in 3D, placed at z=0 plan
    if (!is2D) {
      for (let iy = 0; iy < yCoords.length; iy++) {
        const y = yCoords[iy];
        const bubbleX = xMin - overshoot - circleRadius * 1.5;
        // Projection line from structure edge to bubble
        addProjectionLine(xMin, y, 0, bubbleX + circleRadius, y, 0, lineColor, gridAxesGroup);
        addAxisLabel(ly[iy] || `${iy}`, bubbleX, y, 0, circleRadius, gridAxesGroup);
      }
    }

    // ── Dimension labels between axes (cotas) ──
    const dimSize = circleRadius * 1.8; // larger for visibility
    const dimOffsetX = overshoot * 1.2;
    const dimOffsetY = overshoot * 1.2;
    // X spans (between A-B, B-C, etc.)
    for (let i = 0; i < xCoords.length - 1; i++) {
      const x1 = xCoords[i], x2 = xCoords[i + 1];
      const dist = Math.abs(x2 - x1);
      const midX = (x1 + x2) / 2;
      const label = `${dist.toFixed(2)} m`;
      if (is2D) {
        // 2D: cotas below axis bubbles
        addDimensionLabel(label, midX, 0, -dimOffsetX, dimSize, gridAxesGroup);
        // Dimension line between axis points
        addDimensionLine(x1, 0, -dimOffsetX * 0.7, x2, 0, -dimOffsetX * 0.7, 0xffcc00, gridAxesGroup);
      } else {
        // 3D: cotas between X-axis bubbles (in Y direction)
        addDimensionLabel(label, midX, yMin - dimOffsetY, 0, dimSize, gridAxesGroup);
        addDimensionLine(x1, yMin - dimOffsetY * 0.7, 0, x2, yMin - dimOffsetY * 0.7, 0, 0xffcc00, gridAxesGroup);
      }
    }
    // Y spans (between 1-2, 2-3, etc.)
    if (!is2D) {
      for (let i = 0; i < yCoords.length - 1; i++) {
        const y1 = yCoords[i], y2 = yCoords[i + 1];
        const dist = Math.abs(y2 - y1);
        const midY = (y1 + y2) / 2;
        const label = `${dist.toFixed(2)} m`;
        addDimensionLabel(label, xMin - dimOffsetX, midY, 0, dimSize, gridAxesGroup);
        addDimensionLine(xMin - dimOffsetX * 0.7, y1, 0, xMin - dimOffsetX * 0.7, y2, 0, 0xffcc00, gridAxesGroup);
      }
    }

    // Make grid axes immune to clipping planes
    gridAxesGroup.traverse((obj: any) => {
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m: any) => { m.clippingPlanes = []; });
        } else {
          obj.material.clippingPlanes = [];
        }
      }
    });

    ctx.scene.add(gridAxesGroup);
    ctx.render();
  }

  /** Story level group (horizontal lines + labels at each floor elevation) */
  let storyLevelGroup: THREE.Group | null = null;

  function clearStoryLevels() {
    if (!storyLevelGroup) return;
    const ctx = getViewerCtx();
    if (ctx) ctx.scene.remove(storyLevelGroup);
    storyLevelGroup.traverse((obj) => {
      if ((obj as any).geometry) (obj as any).geometry.dispose();
      if ((obj as any).material) {
        const mat = (obj as any).material;
        if (mat.map) mat.map.dispose();
        mat.dispose();
      }
    });
    storyLevelGroup = null;
  }

  /**
   * Draw horizontal dashed lines at each story elevation + labels
   * Like ETABS elevation view: thin dashed rectangles at each floor
   */
  function createStoryLevelLines(
    stories: { name: string; height: number; elev: number }[],
    xCoords: number[],
    yCoords: number[],
  ) {
    clearStoryLevels();
    if (stories.length === 0) return;
    const ctx = getViewerCtx();
    if (!ctx) return;

    storyLevelGroup = new THREE.Group();
    storyLevelGroup.name = "storyLevels";

    const xMin = Math.min(...xCoords), xMax = Math.max(...xCoords);
    const yMin = Math.min(...yCoords), yMax = Math.max(...yCoords);
    const extentX = xMax - xMin || 1;
    const extentY = yMax - yMin || 1;
    const extent = Math.max(extentX, extentY);
    const overshoot = extent * 0.06;
    const is2D = yCoords.length <= 1;

    const lineColor = 0x4488ff;
    const labelSize = extent * 0.015;

    for (const story of stories) {
      const z = story.elev;

      if (is2D) {
        // 2D: horizontal line at Z across X range
        addStoryLine(xMin - overshoot, 0, z, xMax + overshoot, 0, z, lineColor, storyLevelGroup);
        // Label at right side
        addStoryLabel(story.name, xMax + overshoot * 1.5, 0, z, labelSize, storyLevelGroup);
      } else {
        // 3D: dashed rectangle at elevation Z (plan outline)
        addStoryLine(xMin, yMin, z, xMax, yMin, z, lineColor, storyLevelGroup);
        addStoryLine(xMax, yMin, z, xMax, yMax, z, lineColor, storyLevelGroup);
        addStoryLine(xMax, yMax, z, xMin, yMax, z, lineColor, storyLevelGroup);
        addStoryLine(xMin, yMax, z, xMin, yMin, z, lineColor, storyLevelGroup);
        // Label at one corner
        addStoryLabel(story.name, xMin - overshoot * 1.5, yMin, z, labelSize, storyLevelGroup);
      }
    }

    // Make immune to clipping planes
    storyLevelGroup.traverse((obj: any) => {
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m: any) => { m.clippingPlanes = []; });
        } else {
          obj.material.clippingPlanes = [];
        }
      }
    });

    ctx.scene.add(storyLevelGroup);
    ctx.render();
  }

  function addStoryLine(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, color: number, group: THREE.Group) {
    const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2) || 1;
    const geom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3(x2, y2, z2),
    ]);
    const mat = new THREE.LineDashedMaterial({
      color,
      dashSize: len * 0.02,
      gapSize: len * 0.01,
      transparent: true,
      opacity: 0.5,
    });
    const line = new THREE.Line(geom, mat);
    line.computeLineDistances();
    line.renderOrder = 50;
    group.add(line);
  }

  function addStoryLabel(text: string, x: number, y: number, z: number, size: number, group: THREE.Group) {
    const canvas = document.createElement("canvas");
    const cw = 512, ch = 64;
    canvas.width = cw; canvas.height = ch;
    const c = canvas.getContext("2d")!;
    c.fillStyle = "rgba(30,60,120,0.8)";
    const r = 8;
    c.beginPath();
    c.moveTo(r, 0); c.lineTo(cw - r, 0); c.quadraticCurveTo(cw, 0, cw, r);
    c.lineTo(cw, ch - r); c.quadraticCurveTo(cw, ch, cw - r, ch);
    c.lineTo(r, ch); c.quadraticCurveTo(0, ch, 0, ch - r);
    c.lineTo(0, r); c.quadraticCurveTo(0, 0, r, 0);
    c.closePath(); c.fill();
    c.fillStyle = "#88bbff";
    c.font = "bold 38px monospace";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(text, cw / 2, ch / 2);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    const mat = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(x, y, z);
    sprite.scale.set(size * 8, size, 1);
    sprite.renderOrder = 101;
    group.add(sprite);
  }

  /** Add a dimension label (text sprite with background) */
  function addDimensionLabel(text: string, x: number, y: number, z: number, size: number, group: THREE.Group) {
    const canvas = document.createElement("canvas");
    const cw = 256, ch = 64;
    canvas.width = cw; canvas.height = ch;
    const c = canvas.getContext("2d")!;
    // Rounded rect background
    c.fillStyle = "rgba(0,0,0,0.75)";
    const r = 8;
    c.beginPath();
    c.moveTo(r, 0); c.lineTo(cw - r, 0); c.quadraticCurveTo(cw, 0, cw, r);
    c.lineTo(cw, ch - r); c.quadraticCurveTo(cw, ch, cw - r, ch);
    c.lineTo(r, ch); c.quadraticCurveTo(0, ch, 0, ch - r);
    c.lineTo(0, r); c.quadraticCurveTo(0, 0, r, 0);
    c.closePath(); c.fill();
    c.fillStyle = "#ffcc00";
    c.font = "bold 36px monospace";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(text, cw / 2, ch / 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(x, y, z);
    const aspect = cw / ch;
    sprite.scale.set(size * aspect, size, 1);
    sprite.renderOrder = 999;
    group.add(sprite);
  }

  /** Add a dimension line with end ticks */
  function addDimensionLine(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, color: number, group: THREE.Group) {
    const pts = [
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3(x2, y2, z2),
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6, depthTest: false });
    const line = new THREE.Line(geo, mat);
    line.renderOrder = 998;
    group.add(line);
  }

  /** Add a thin projection line from (x1,y1,z1) to (x2,y2,z2) */
  function addProjectionLine(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, color: number, group: THREE.Group) {
    const geom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3(x2, y2, z2),
    ]);
    const mat = new THREE.LineDashedMaterial({ color, dashSize: 0.15 * Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 0.1), gapSize: 0.1 * Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 0.1), transparent: true, opacity: 0.6 });
    const line = new THREE.Line(geom, mat);
    line.computeLineDistances(); // required for dashed material
    group.add(line);
  }

  /** Add a circled label (sprite) at position (x, y, z) */
  function addAxisLabel(label: string, x: number, y: number, z: number, radius: number, group: THREE.Group) {
    const canvas = document.createElement("canvas");
    const size = 128;
    canvas.width = size;
    canvas.height = size;
    const c = canvas.getContext("2d")!;

    // Circle background
    c.beginPath();
    c.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
    c.fillStyle = "rgba(255,255,255,0.9)";
    c.fill();
    c.lineWidth = size * 0.04;
    c.strokeStyle = "#555";
    c.stroke();

    // Text
    c.fillStyle = "#222";
    c.font = `bold ${size * 0.45}px Arial`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(label, size / 2, size / 2 + size * 0.02);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(x, y, z);
    const scale = radius * 2;
    sprite.scale.set(scale, scale, 1);
    sprite.renderOrder = 100;
    group.add(sprite);
  }

  // ── Subdivide beams: add intermediate nodes for visible bending ──
  function subdivideBeams(
    nodes: Node[], elements: Element[],
    supports: Map<number, boolean[]>,
    nSub: number = 3
  ): { nodes: Node[]; elements: Element[]; supports: Map<number, boolean[]> } {
    if (nSub <= 1) return { nodes, elements, supports };
    const outNodes = [...nodes];
    const outElements: Element[] = [];
    const outSupports = new Map(supports);
    for (const [ni, nj] of elements) {
      const p0 = nodes[ni], p1 = nodes[nj];
      let prev = ni;
      for (let k = 1; k < nSub; k++) {
        const t = k / nSub;
        const mid: Node = [
          p0[0] + (p1[0] - p0[0]) * t,
          p0[1] + (p1[1] - p0[1]) * t,
          p0[2] + (p1[2] - p0[2]) * t,
        ];
        const midIdx = outNodes.length;
        outNodes.push(mid);
        outElements.push([prev, midIdx]);
        prev = midIdx;
      }
      outElements.push([prev, nj]);
    }
    return { nodes: outNodes, elements: outElements, supports: outSupports };
  }

  // ── CLI object ──
  const cli = {
    addNode(x: number, y: number, z: number): number {
      const nodes = [...mesh.nodes.val]; const idx = nodes.length;
      nodes.push([x, y, z]); mesh.nodes.val = nodes;
      console.log(`Node ${idx} at (${x}, ${y}, ${z})`); updatePanel(); return idx;
    },
    removeNode(idx: number) {
      const nodes = [...mesh.nodes.val];
      if (idx < 0 || idx >= nodes.length) { console.error(`Node ${idx} not found`); return; }
      nodes.splice(idx, 1);
      const elements = mesh.elements.val
        .map(([i, j]) => { const ni = i > idx ? i - 1 : i; const nj = j > idx ? j - 1 : j; if (i === idx || j === idx) return null; return [ni, nj] as Element; })
        .filter((e) => e !== null) as Element[];
      mesh.nodes.val = nodes; mesh.elements.val = elements;
      console.log(`Node ${idx} removed`); updatePanel();
    },
    listNodes() { const nodes = mesh.nodes.val; console.table(nodes.map((n, i) => ({ id: i, x: n[0], y: n[1], z: n[2] }))); return nodes; },

    addFrame(nodeI: number, nodeJ: number): number {
      const elements = [...mesh.elements.val]; const idx = elements.length;
      elements.push([nodeI, nodeJ]); mesh.elements.val = elements;
      console.log(`Element ${idx}: node ${nodeI} -> node ${nodeJ}`); updatePanel(); return idx;
    },
    removeFrame(idx: number) {
      const elements = [...mesh.elements.val];
      if (idx < 0 || idx >= elements.length) { console.error(`Element ${idx} not found`); return; }
      elements.splice(idx, 1); mesh.elements.val = elements;
      console.log(`Element ${idx} removed`); updatePanel();
    },
    listFrames() { const elements = mesh.elements.val; console.table(elements.map((e, i) => ({ id: i, nodeI: e[0], nodeJ: e[1] }))); return elements; },

    addSupport(nodeIdx: number, dof?: boolean[]) {
      if (!mesh.nodeInputs) return;
      const ni = { ...mesh.nodeInputs.val }; const supports = new Map(ni.supports || []);
      supports.set(nodeIdx, dof || [true, true, true, true, true, true]);
      ni.supports = supports; mesh.nodeInputs.val = ni;
      console.log(`Support added at node ${nodeIdx}`); updatePanel();
    },
    removeSupport(nodeIdx: number) {
      if (!mesh.nodeInputs) return;
      const ni = { ...mesh.nodeInputs.val }; const supports = new Map(ni.supports || []);
      supports.delete(nodeIdx); ni.supports = supports; mesh.nodeInputs.val = ni;
      console.log(`Support removed from node ${nodeIdx}`); updatePanel();
    },
    addLoad(nodeIdx: number, force: number[]) {
      if (!mesh.nodeInputs) return;
      const ni = { ...mesh.nodeInputs.val }; const loads = new Map(ni.loads || []);
      loads.set(nodeIdx, force); ni.loads = loads; mesh.nodeInputs.val = ni;
      console.log(`Load added at node ${nodeIdx}: [${force.join(", ")}]`); updatePanel();
    },
    removeLoad(nodeIdx: number) {
      if (!mesh.nodeInputs) return;
      const ni = { ...mesh.nodeInputs.val }; const loads = new Map(ni.loads || []);
      loads.delete(nodeIdx); ni.loads = loads; mesh.nodeInputs.val = ni;
      console.log(`Load removed from node ${nodeIdx}`); updatePanel();
    },
    listSupports() {
      if (!mesh.nodeInputs) return;
      const supports = mesh.nodeInputs.val.supports;
      if (!supports || supports.size === 0) { console.log("No supports"); return; }
      const rows: any[] = []; supports.forEach((dof, idx) => rows.push({ node: idx, dof: dof.map(v => v ? 1 : 0).join("") }));
      console.table(rows); return supports;
    },
    listLoads() {
      if (!mesh.nodeInputs) return;
      const loads = mesh.nodeInputs.val.loads;
      if (!loads || loads.size === 0) { console.log("No loads"); return; }
      const rows: any[] = []; loads.forEach((f, idx) => rows.push({ node: idx, Fx: f[0], Fy: f[1], Fz: f[2] }));
      console.table(rows); return loads;
    },

    info() {
      const n = mesh.nodes.val.length; const e = mesh.elements.val.length;
      const s = mesh.nodeInputs?.val?.supports?.size || 0; const l = mesh.nodeInputs?.val?.loads?.size || 0;
      console.log(`Model: ${n} nodes, ${e} elements, ${s} supports, ${l} loads`);
      return { nodes: n, elements: e, supports: s, loads: l };
    },

    /** Toggle or set a setting: cad.set("nodes", true) or cad.set("deform") to toggle */
    set(name: string, value?: boolean) {
      const checkboxes = panel.querySelectorAll("input[type=checkbox]");
      for (const cb of checkboxes) {
        const label = (cb as HTMLInputElement).closest("label")?.textContent?.trim()
          || (cb as HTMLInputElement).parentElement?.textContent?.trim() || "";
        const id = (cb as HTMLInputElement).id || "";
        if (label.toLowerCase().includes(name.toLowerCase()) || id.toLowerCase().includes(name.toLowerCase())) {
          const input = cb as HTMLInputElement;
          input.checked = value !== undefined ? value : !input.checked;
          input.dispatchEvent(new Event("change", { bubbles: true }));
          console.log(`${label || id}: ${input.checked}`);
          return input.checked;
        }
      }
      console.log(`Setting "${name}" not found. Use cad.settings() to list.`);
    },

    /** List all settings (checkboxes) */
    settings() {
      const checkboxes = panel.querySelectorAll("input[type=checkbox]");
      const result: Record<string, boolean> = {};
      checkboxes.forEach(cb => {
        const input = cb as HTMLInputElement;
        const label = input.closest("label")?.textContent?.trim()
          || input.parentElement?.textContent?.trim() || input.id || "?";
        result[label] = input.checked;
      });
      console.table(result);
      return result;
    },

    /** Set a parameter: cad.param("Vanos X", 3) */
    param(name: string, value: number) {
      const cad = window.__cad;
      if (cad?.setParam) {
        cad.setParam(name, value);
        console.log(`${name} = ${value}`);
        return value;
      }
      console.log("Parameters not available");
    },

    /** List all current parameters */
    params() {
      const cad = window.__cad;
      if (cad?.getParams) {
        const p = cad.getParams();
        console.table(p);
        return p;
      }
      console.log("Parameters not available");
    },

    /** Switch generator: cad.use("Edificio") */
    use(name: string) {
      const cad = window.__cad;
      if (cad?.setGenerator) { cad.setGenerator(name); console.log(`Generator: ${name}`); return name; }
    },

    /**
     * Create a custom Tweakpane panel from CLI.
     * Returns an object with live values that update when sliders change.
     *
     * Usage:
     *   const p = cad.panel("Mi Estructura", {
     *     svx: { value: [2, 3, 4], label: "Vanos X (m)" },
     *     svy: { value: [3.44, 4, 5], label: "Vanos Y (m)" },
     *     sp:  { value: [3.5, 3, 3], label: "Alturas piso (m)" },
     *     fc:  { value: 210, min: 100, max: 500, label: "f'c (kgf/cm2)" },
     *     col: { value: "40x40", options: ["30x30","40x40","50x50"], label: "Columna" },
     *   })
     *   // p.svx, p.svy, p.sp, p.fc, p.col → live values
     *
     *   cad.panel("Grilla", {
     *     bx: { value: 5, min: 1, max: 20, step: 0.5, label: "Vano X" },
     *     nv: { value: 3, min: 1, max: 10, step: 1, label: "N. Vanos" },
     *   }, (params) => { cad.refgrid(...) })  // callback on change
     */
    panel(title: string, defs: Record<string, any>, onChange?: (params: any) => void) {
      const cad = window.__cad;
      if (cad?.createCustomPanel) {
        return cad.createCustomPanel(title, defs, onChange);
      }
      console.log("Custom panels not available");
    },

    /** Remove a custom panel by title */
    removePanel(title: string) {
      const cad = window.__cad;
      if (cad?.removeCustomPanel) {
        cad.removeCustomPanel(title);
        console.log(`Panel "${title}" removed`);
      }
    },

    /**
     * Create reference/construction grid (imaginary lines).
     * These guide lines appear in 3D, Plan, EX, EY views.
     *
     * Usage:
     *   cad.refgrid([5,5], [4,4], [3.5,3,3])   // baysX, baysZ, floorHeights
     *   cad.refgrid([6], [4], [3])              // single bay, single floor
     *   cad.refgrid()                           // clear reference grid
     */
    refgrid(baysX?: number[], baysZ?: number[], floorH?: number[]) {
      if (!baysX) { clearRefGrid(); console.log("Reference grid cleared"); return; }
      const xCoords = [0]; for (const s of baysX) xCoords.push(xCoords[xCoords.length - 1] + s);
      const zCoords = [0]; for (const s of (baysZ || [0])) zCoords.push(zCoords[zCoords.length - 1] + s);
      const yLevels = [0]; for (const h of (floorH || [3])) yLevels.push(yLevels[yLevels.length - 1] + h);

      createRefGrid(xCoords, zCoords, yLevels);

      // Also draw axis labels
      currentGridX = xCoords.map((x, i) => ({ label: String.fromCharCode(65 + i), coord: x }));
      currentGridY = zCoords.map((z, i) => ({ label: `${i + 1}`, coord: z }));
      currentGridZmax = yLevels[yLevels.length - 1];
      currentGridLevels = yLevels.map((e, i) => ({ label: i === 0 ? "Base" : `P${i}`, elev: e }));
      createGridAxes(currentGridX.map(g => g.coord), currentGridY.map(g => g.coord), currentGridZmax, currentGridX.map(g => g.label), currentGridY.map(g => g.label));
      { const stories = yLevels.map((e, i) => ({ name: i === 0 ? "Base" : `P${i}`, height: i > 0 ? e - yLevels[i-1] : 0, elev: e })); createStoryLevelLines(stories, currentGridX.map(g => g.coord), currentGridY.map(g => g.coord)); }

      console.log(`RefGrid: X=[${xCoords}] Z=[${zCoords}] Y=[${yLevels}]`);
      return { xCoords, zCoords, yLevels };
    },

    /**
     * Build model on existing refgrid — columns at every intersection, beams on every axis.
     * Must call cad.refgrid() first.
     *
     * Usage:
     *   cad.refgrid([5,5], [4,4], [3,3,3])
     *   cad.build()                                    // default sections
     *   cad.build({ col: "40x40", viga: "25x40", fc: 210 })
     *   cad.build({ col: "40x40", viga: "25x40", braces: "perimeter" })  // braces on perimeter
     *   cad.build({ braces: "all" })    // braces on all bays
     *   cad.build({ braces: "x" })      // braces only in X direction
     *   cad.build({ braces: "y" })      // braces only in Y direction
     */
    build(cfg?: { col?: string; viga?: string; fc?: number; braces?: string }) {
      if (currentGridX.length === 0 || currentGridLevels.length < 2) {
        console.log("Error: call cad.refgrid() first to define axes and levels");
        return;
      }
      const colStr = cfg?.col || "40x40";
      const vigaStr = cfg?.viga || "30x40";
      const fc = cfg?.fc || 210;

      const [colB, colH] = colStr.split("x").map(v => parseFloat(v) / 100);
      const [vigaB, vigaH] = vigaStr.split("x").map(v => parseFloat(v) / 100);

      const xc = currentGridX.map(g => g.coord);  // plan X coords
      const yc = currentGridY.map(g => g.coord);  // plan Y coords
      const zc = currentGridLevels.map(g => g.elev); // Z = elevation (height)
      const nX = xc.length, nY = yc.length, nZ = zc.length;
      const nFloors = nZ - 1;

      // Create nodes [x_plan, y_plan, z_elevation]
      const nodes: Node[] = [];
      const nid: Record<string, number> = {};
      for (let iz = 0; iz < nZ; iz++) {
        for (let iy = 0; iy < nY; iy++) {
          for (let ix = 0; ix < nX; ix++) {
            nid[`${ix},${iy},${iz}`] = nodes.length;
            nodes.push([xc[ix], yc[iy], zc[iz]]);
          }
        }
      }

      // Create elements
      const elements: Element[] = [];
      const newColIndices = new Set<number>();
      const newBeamIndices = new Set<number>();
      const newElementFloor = new Map<number, number>();

      // Columns (vertical: same ix,iy, different iz = elevation)
      for (let iz = 0; iz < nFloors; iz++)
        for (let iy = 0; iy < nY; iy++)
          for (let ix = 0; ix < nX; ix++) {
            const ei = elements.length;
            elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix},${iy},${iz + 1}`]]);
            newColIndices.add(ei);
            newElementFloor.set(ei, iz);
          }

      // Beams X (horizontal: same iy,iz, different ix)
      for (let iz = 1; iz < nZ; iz++)
        for (let iy = 0; iy < nY; iy++)
          for (let ix = 0; ix < nX - 1; ix++) {
            const ei = elements.length;
            elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix + 1},${iy},${iz}`]]);
            newBeamIndices.add(ei);
            newElementFloor.set(ei, iz - 1);
          }

      // Beams Y (horizontal: same ix,iz, different iy)
      for (let iz = 1; iz < nZ; iz++)
        for (let ix = 0; ix < nX; ix++)
          for (let iy = 0; iy < nY - 1; iy++) {
            const ei = elements.length;
            elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix},${iy + 1},${iz}`]]);
            newBeamIndices.add(ei);
            newElementFloor.set(ei, iz - 1);
          }

      // Braces (diagonals in vertical planes, Z=height)
      const braceMode = cfg?.braces?.toLowerCase() || "";
      const newBraceIndices = new Set<number>();
      if (braceMode) {
        const addBraceX = braceMode === "all" || braceMode === "x" || braceMode === "perimeter";
        const addBraceY = braceMode === "all" || braceMode === "y" || braceMode === "perimeter";

        for (let iz = 0; iz < nFloors; iz++) {
          // X-direction braces (in XZ vertical plane, constant iy)
          if (addBraceX) {
            for (let iy = 0; iy < nY; iy++) {
              if (braceMode === "perimeter" && iy !== 0 && iy !== nY - 1) continue;
              const midBay = Math.floor((nX - 1) / 2);
              for (let ix = 0; ix < nX - 1; ix++) {
                if (braceMode === "perimeter" && ix !== midBay) continue;
                // X-brace: two diagonals crossing
                const ei1 = elements.length;
                elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix + 1},${iy},${iz + 1}`]]);
                newBraceIndices.add(ei1);
                newElementFloor.set(ei1, iz);
                const ei2 = elements.length;
                elements.push([nid[`${ix + 1},${iy},${iz}`], nid[`${ix},${iy},${iz + 1}`]]);
                newBraceIndices.add(ei2);
                newElementFloor.set(ei2, iz);
              }
            }
          }
          // Y-direction braces (in YZ vertical plane, constant ix)
          if (addBraceY) {
            for (let ix = 0; ix < nX; ix++) {
              if (braceMode === "perimeter" && ix !== 0 && ix !== nX - 1) continue;
              const midBay = Math.floor((nY - 1) / 2);
              for (let iy = 0; iy < nY - 1; iy++) {
                if (braceMode === "perimeter" && iy !== midBay) continue;
                const ei1 = elements.length;
                elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix},${iy + 1},${iz + 1}`]]);
                newBraceIndices.add(ei1);
                newElementFloor.set(ei1, iz);
                const ei2 = elements.length;
                elements.push([nid[`${ix},${iy + 1},${iz}`], nid[`${ix},${iy},${iz + 1}`]]);
                newBraceIndices.add(ei2);
                newElementFloor.set(ei2, iz);
              }
            }
          }
        }
      }

      // Material
      const E_tonfm2 = 15100 * Math.sqrt(fc) * 10;
      const G = E_tonfm2 / (2 * (1 + 0.2));

      // Section properties
      const colA = colB * colH, colIz = colB * colH ** 3 / 12, colIy = colH * colB ** 3 / 12;
      const colJ = colB * colH * (colB ** 2 + colH ** 2) / 12;
      // viga horizontal → eje fuerte (canto³) va en momentsOfInertiaZ = I33 (gobierna flexión vertical)
      const vigaA = vigaB * vigaH, vigaIy = vigaB * vigaH ** 3 / 12, vigaIz = vigaH * vigaB ** 3 / 12;
      const vigaJ = vigaB * vigaH * (vigaB ** 2 + vigaH ** 2) / 12;

      const elasticities = new Map<number, number>();
      const shearModuli = new Map<number, number>();
      const areas = new Map<number, number>();
      const moiZ = new Map<number, number>();
      const moiY = new Map<number, number>();
      const torsion = new Map<number, number>();
      const sectionShapes = new Map<number, SectionShape>();

      for (let i = 0; i < elements.length; i++) {
        elasticities.set(i, E_tonfm2);
        shearModuli.set(i, G);
        if (newColIndices.has(i)) {
          areas.set(i, colA); moiZ.set(i, colIz); moiY.set(i, colIy); torsion.set(i, colJ);
          sectionShapes.set(i, { type: "rect" as const, b: colB, h: colH, name: `COL${colStr}` });
        } else if (newBraceIndices.has(i)) {
          areas.set(i, colA); moiZ.set(i, colIz); moiY.set(i, colIy); torsion.set(i, colJ);
          sectionShapes.set(i, { type: "rect" as const, b: colB, h: colH, name: `BR${colStr}` });
        } else {
          areas.set(i, vigaA); moiZ.set(i, vigaIz); moiY.set(i, vigaIy); torsion.set(i, vigaJ);
          sectionShapes.set(i, { type: "rect" as const, b: vigaB, h: vigaH, name: `V${vigaStr}` });
        }
      }

      // Supports at base (iz=0, Z=0 = ground level)
      const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
      for (let iy = 0; iy < nY; iy++)
        for (let ix = 0; ix < nX; ix++)
          supports.set(nid[`${ix},${iy},0`], [true, true, true, true, true, true]);

      // Apply
      mesh.nodes.val = nodes;
      mesh.elements!.val = elements;
      mesh.nodeInputs!.val = { supports, loads: new Map() };
      mesh.elementInputs!.val = { elasticities, shearModuli, areas, momentsOfInertiaY: moiZ, momentsOfInertiaZ: moiY, torsionalConstants: torsion, sectionShapes };
      colElementIndices = newColIndices;
      beamElementIndices = newBeamIndices;
      elementFloor = newElementFloor;

      console.log(`Built: ${nodes.length} nodes, ${elements.length} elements (${newColIndices.size} cols, ${newBeamIndices.size} beams, ${newBraceIndices.size} braces)`);
      console.log(`  Col: ${colStr}, Viga: ${vigaStr}, f'c=${fc}${braceMode ? `, braces=${braceMode}` : ""}`);
      return { nodes: nodes.length, elements: elements.length };
    },

    /**
     * Add a single column by axis names and story.
     *   cad.addCol("A", "1", "P1")   → column at axis A, axis 1, story P1
     *   cad.addCol("B", "2")         → column at B-2, all stories
     */
    addCol(axisX: string, axisY: string, story?: string) {
      const xi = currentGridX.findIndex(g => g.label === axisX);
      const zi = currentGridY.findIndex(g => g.label === axisY);
      if (xi < 0) { console.log(`Axis "${axisX}" not found. Available: ${currentGridX.map(g => g.label)}`); return; }
      if (zi < 0) { console.log(`Axis "${axisY}" not found. Available: ${currentGridY.map(g => g.label)}`); return; }
      const x = currentGridX[xi].coord, z = currentGridY[zi].coord;

      const nodes = [...mesh.nodes.val];
      const elements = [...(mesh.elements?.val || [])];
      const ei = mesh.elementInputs?.val || {};

      // Find or create nodes at this XY plan position, varying Z (elevation)
      const findOrAddNode = (elev: number): number => {
        const idx = nodes.findIndex(n => Math.abs(n[0] - x) < 0.001 && Math.abs(n[1] - z) < 0.001 && Math.abs(n[2] - elev) < 0.001);
        if (idx >= 0) return idx;
        nodes.push([x, z, elev]);  // [x_plan, y_plan, z_elevation]
        return nodes.length - 1;
      };

      const floors = story
        ? [currentGridLevels.findIndex(g => g.label === story)]
        : Array.from({ length: currentGridLevels.length - 1 }, (_, i) => i + 1);

      // Auto-add support at base level
      const supports = new Map(mesh.nodeInputs?.val?.supports || []);
      const baseNode = findOrAddNode(currentGridLevels[0].elev);
      if (!supports.has(baseNode)) {
        supports.set(baseNode, [true, true, true, true, true, true]);
      }

      let added = 0;
      for (const fi of floors) {
        if (fi < 1 || fi >= currentGridLevels.length) continue;
        const nBot = findOrAddNode(currentGridLevels[fi - 1].elev);
        const nTop = findOrAddNode(currentGridLevels[fi].elev);
        elements.push([nBot, nTop]);
        colElementIndices.add(elements.length - 1);
        elementFloor.set(elements.length - 1, fi - 1);
        added++;
      }

      mesh.nodes.val = nodes;
      mesh.elements!.val = elements;
      mesh.nodeInputs!.val = { ...mesh.nodeInputs!.val, supports, loads: mesh.nodeInputs?.val?.loads || new Map() };
      console.log(`Added ${added} column(s) at ${axisX}-${axisY}${story ? ` story ${story}` : ""}`);
      return added;
    },

    /**
     * Add a beam between two axis intersections at a given story.
     *   cad.addBeam("A","1", "B","1", "P1")  → beam from A-1 to B-1 at P1
     *   cad.addBeam("A","1", "A","2", "P2")  → beam from A-1 to A-2 at P2
     */
    addBeam(ax1: string, ay1: string, ax2: string, ay2: string, story: string) {
      const xi1 = currentGridX.findIndex(g => g.label === ax1);
      const zi1 = currentGridY.findIndex(g => g.label === ay1);
      const xi2 = currentGridX.findIndex(g => g.label === ax2);
      const zi2 = currentGridY.findIndex(g => g.label === ay2);
      const li = currentGridLevels.findIndex(g => g.label === story);
      if (xi1 < 0 || zi1 < 0 || xi2 < 0 || zi2 < 0) { console.log("Axis not found"); return; }
      if (li < 1) { console.log(`Story "${story}" not found. Available: ${currentGridLevels.filter(g => g.label !== "Base").map(g => g.label)}`); return; }

      const x1 = currentGridX[xi1].coord, y1 = currentGridY[zi1].coord;
      const x2 = currentGridX[xi2].coord, y2 = currentGridY[zi2].coord;
      const elev = currentGridLevels[li].elev;  // Z = elevation

      const nodes = [...mesh.nodes.val];
      const elements = [...(mesh.elements?.val || [])];

      const findOrAddNode = (px: number, py: number, pz: number): number => {
        const idx = nodes.findIndex(n => Math.abs(n[0] - px) < 0.001 && Math.abs(n[1] - py) < 0.001 && Math.abs(n[2] - pz) < 0.001);
        if (idx >= 0) return idx;
        nodes.push([px, py, pz]);  // [x_plan, y_plan, z_elevation]
        return nodes.length - 1;
      };

      const n1 = findOrAddNode(x1, y1, elev);
      const n2 = findOrAddNode(x2, y2, elev);
      elements.push([n1, n2]);
      beamElementIndices.add(elements.length - 1);
      elementFloor.set(elements.length - 1, li - 1);

      mesh.nodes.val = nodes;
      mesh.elements!.val = elements;
      console.log(`Added beam ${ax1}-${ay1} → ${ax2}-${ay2} at ${story}`);
      return elements.length - 1;
    },

    /**
     * Add a diagonal brace between two axis intersections across stories.
     *   cad.addBrace("A","1","P1", "B","2","P2")  → brace from A-1@P1 to B-2@P2
     *   cad.addBrace("A","1","Base", "A","1","P1") → vertical brace (same point, diff story)
     *   cad.addBrace("A","1","Base", "B","1","P1") → X-brace in frame A-B at axis 1
     */
    addBrace(ax1: string, ay1: string, story1: string, ax2: string, ay2: string, story2: string) {
      const xi1 = currentGridX.findIndex(g => g.label === ax1);
      const zi1 = currentGridY.findIndex(g => g.label === ay1);
      const li1 = currentGridLevels.findIndex(g => g.label === story1);
      const xi2 = currentGridX.findIndex(g => g.label === ax2);
      const zi2 = currentGridY.findIndex(g => g.label === ay2);
      const li2 = currentGridLevels.findIndex(g => g.label === story2);

      if (xi1 < 0 || zi1 < 0 || li1 < 0) { console.log(`Point 1 not found: ${ax1}-${ay1}@${story1}`); return; }
      if (xi2 < 0 || zi2 < 0 || li2 < 0) { console.log(`Point 2 not found: ${ax2}-${ay2}@${story2}`); return; }

      const px1 = currentGridX[xi1].coord, py1 = currentGridY[zi1].coord, elev1 = currentGridLevels[li1].elev;
      const px2 = currentGridX[xi2].coord, py2 = currentGridY[zi2].coord, elev2 = currentGridLevels[li2].elev;

      const nodes = [...mesh.nodes.val];
      const elements = [...(mesh.elements?.val || [])];

      const findOrAddNode = (x: number, y: number, z: number): number => {
        const idx = nodes.findIndex(n => Math.abs(n[0] - x) < 0.001 && Math.abs(n[1] - y) < 0.001 && Math.abs(n[2] - z) < 0.001);
        if (idx >= 0) return idx;
        nodes.push([x, y, z]);  // [x_plan, y_plan, z_elevation]
        return nodes.length - 1;
      };

      const n1 = findOrAddNode(px1, py1, elev1);
      const n2 = findOrAddNode(px2, py2, elev2);
      elements.push([n1, n2]);
      // Braces are neither col nor beam — they stay unclassified (rendered as generic frame)
      elementFloor.set(elements.length - 1, Math.min(li1, li2));

      mesh.nodes.val = nodes;
      mesh.elements!.val = elements;
      console.log(`Added brace ${ax1}-${ay1}@${story1} → ${ax2}-${ay2}@${story2}`);
      return elements.length - 1;
    },

    /** Show available commands */
    help() {
      return `=== CLI Commands ===
MODEL:
  cad.clear()                    New empty model
  cad.info()                     Model summary
  cad.addNode(x, y, z)          Add node (Y-up)
  cad.addFrame(i, j)            Add frame element
  cad.removeNode(i)             Remove node
  cad.removeFrame(i)            Remove element
  cad.listNodes()               List all nodes
  cad.listFrames()              List all elements

BOUNDARY:
  cad.addSupport(n)             Fixed support at node n
  cad.addSupport(n, [1,1,1,0,0,0])  Custom DOFs
  cad.removeSupport(n)          Remove support
  cad.addLoad(n, [fx,fy,fz,mx,my,mz])
  cad.removeLoad(n)
  cad.listSupports()            List supports
  cad.listLoads()               List loads

GENERATORS:
  cad.model3d()                 3D building (default 2x2, 3 floors)
  cad.model3d({bx:[5,6], bz:[4], h:[3.5,3], col:"40x40", viga:"25x30", fc:210})
  cad.use("Edificio")           Switch to parametric generator
  cad.frame([5,5], [3,3])       2D portal frame
  cad.building([5,5],[4],[3])   3D building (parametric)
  cad.galpon(12, 20, 6, 3)     Galpon/warehouse

REFERENCE GRID:
  cad.refgrid([5,5],[4,4],[3.5,3])  Construction grid lines
  cad.refgrid()                     Clear reference grid

SETTINGS & PARAMS:
  cad.settings()                List all settings
  cad.set("nodes", true)        Toggle setting on/off
  cad.set("deform")             Toggle setting
  cad.params()                  List all parameters
  cad.param("Vanos X", 3)       Set parameter value

CUSTOM PANELS (create your own Tweakpane):
  cad.panel("Grilla", {
    svx: { value: [2,3,4], label: "Vanos X" },
    svy: { value: [3.44,4,5], label: "Vanos Y" },
    sp:  { value: [3.5,3,3], label: "Alturas" },
    fc:  { value: 210, min:100, max:500, label: "f'c" },
    col: { value: "40x40", options:["30x30","40x40"], label: "Col" },
  }, (p) => { cad.refgrid(p.svx, p.svy, p.sp); })
  cad.removePanel("Grilla")     Remove custom panel

VIEW:
  cad.view("3d")                3D view
  cad.view("plan")              Plan view
  cad.view("ex")                X elevation
  cad.view("ey")                Y elevation
`;
    },

    /**
     * Create a full 3D building model from scratch with axes, floors, materials, sections.
     * Works with 3D view and Plan/EX/EY views by floor.
     *
     * Usage:
     *   cad.model3d()                              // default 2x2 bays, 3 floors
     *   cad.model3d({ bx:[5,6], bz:[4,4,4], h:[3.5,3,3] })  // custom
     *   cad.model3d({ bx:[5], bz:[4], h:[3], col:"40x40", viga:"25x30" })
     */
    model3d(cfg?: { bx?: number[]; bz?: number[]; h?: number[]; col?: string; viga?: string; fc?: number }) {
      cli.clear();
      const bx = cfg?.bx || [5, 5];        // bay spans in X
      const bz = cfg?.bz || [4, 4];        // bay spans in Z
      const heights = cfg?.h || [3.5, 3, 3]; // floor heights
      const colStr = cfg?.col || "40x40";
      const vigaStr = cfg?.viga || "30x40";
      const fc = cfg?.fc || 210; // f'c in kgf/cm2

      // Parse section dims
      const [colB, colH] = colStr.split("x").map(v => parseFloat(v) / 100);
      const [vigaB, vigaH] = vigaStr.split("x").map(v => parseFloat(v) / 100);

      // Grid coordinates
      const xCoords = [0]; for (const s of bx) xCoords.push(xCoords[xCoords.length - 1] + s);
      const zCoords = [0]; for (const s of bz) zCoords.push(zCoords[zCoords.length - 1] + s);
      const yCoords = [0]; for (const s of heights) yCoords.push(yCoords[yCoords.length - 1] + s);

      const nX = xCoords.length, nZ = zCoords.length, nY = yCoords.length;
      const nFloors = heights.length;

      // Create nodes [x, y_vertical, z]
      const nodes: Node[] = [];
      const nid: Record<string, number> = {};
      for (let iy = 0; iy < nY; iy++) {
        for (let iz = 0; iz < nZ; iz++) {
          for (let ix = 0; ix < nX; ix++) {
            nid[`${ix},${iy},${iz}`] = nodes.length;
            nodes.push([xCoords[ix], yCoords[iy], zCoords[iz]]);
          }
        }
      }

      // Create elements
      const elements: Element[] = [];
      const newColIndices = new Set<number>();
      const newBeamIndices = new Set<number>();
      const newElementFloor = new Map<number, number>();

      // Columns
      for (let iy = 0; iy < nFloors; iy++) {
        for (let iz = 0; iz < nZ; iz++) {
          for (let ix = 0; ix < nX; ix++) {
            const ei = elements.length;
            elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix},${iy + 1},${iz}`]]);
            newColIndices.add(ei);
            newElementFloor.set(ei, iy);
          }
        }
      }

      // Beams X
      for (let iy = 1; iy < nY; iy++) {
        for (let iz = 0; iz < nZ; iz++) {
          for (let ix = 0; ix < nX - 1; ix++) {
            const ei = elements.length;
            elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix + 1},${iy},${iz}`]]);
            newBeamIndices.add(ei);
            newElementFloor.set(ei, iy - 1);
          }
        }
      }

      // Beams Z
      for (let iy = 1; iy < nY; iy++) {
        for (let ix = 0; ix < nX; ix++) {
          for (let iz = 0; iz < nZ - 1; iz++) {
            const ei = elements.length;
            elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix},${iy},${iz + 1}`]]);
            newBeamIndices.add(ei);
            newElementFloor.set(ei, iy - 1);
          }
        }
      }

      // Material: E = 15100 * sqrt(f'c) in kgf/cm2, convert to tonf/m2
      const E_kgcm2 = 15100 * Math.sqrt(fc);
      const E_tonfm2 = E_kgcm2 * 10; // 1 kgf/cm2 = 10 tonf/m2
      const G = E_tonfm2 / (2 * (1 + 0.2));

      // Section properties
      const colA = colB * colH, colIz = colB * colH ** 3 / 12, colIy = colH * colB ** 3 / 12;
      const colJ = colB * colH * (colB ** 2 + colH ** 2) / 12;
      // viga horizontal → eje fuerte (canto³) va en momentsOfInertiaZ = I33 (gobierna flexión vertical)
      const vigaA = vigaB * vigaH, vigaIy = vigaB * vigaH ** 3 / 12, vigaIz = vigaH * vigaB ** 3 / 12;
      const vigaJ = vigaB * vigaH * (vigaB ** 2 + vigaH ** 2) / 12;

      // Build elementInputs
      const elasticities = new Map<number, number>();
      const shearModuli = new Map<number, number>();
      const areas = new Map<number, number>();
      const moiZ = new Map<number, number>();
      const moiY = new Map<number, number>();
      const torsion = new Map<number, number>();
      const sectionShapes = new Map<number, SectionShape>();

      for (let i = 0; i < elements.length; i++) {
        elasticities.set(i, E_tonfm2);
        shearModuli.set(i, G);
        if (newColIndices.has(i)) {
          areas.set(i, colA); moiZ.set(i, colIz); moiY.set(i, colIy); torsion.set(i, colJ);
          sectionShapes.set(i, { type: "rect" as const, b: colB, h: colH, name: `COL${colStr}` });
        } else {
          areas.set(i, vigaA); moiZ.set(i, vigaIz); moiY.set(i, vigaIy); torsion.set(i, vigaJ);
          sectionShapes.set(i, { type: "rect" as const, b: vigaB, h: vigaH, name: `V${vigaStr}` });
        }
      }

      // Supports at base (y=0)
      const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
      for (let iz = 0; iz < nZ; iz++) {
        for (let ix = 0; ix < nX; ix++) {
          supports.set(nid[`${ix},0,${iz}`], [true, true, true, true, true, true]);
        }
      }

      // Apply to mesh
      mesh.nodes.val = nodes;
      mesh.elements!.val = elements;
      mesh.nodeInputs!.val = { supports, loads: new Map() };
      mesh.elementInputs!.val = { elasticities, shearModuli, areas, momentsOfInertiaY: moiZ, momentsOfInertiaZ: moiY, torsionalConstants: torsion, sectionShapes };

      // Set up grid axes and floor buttons
      colElementIndices = newColIndices;
      beamElementIndices = newBeamIndices;
      elementFloor = newElementFloor;

      // Grid labels
      currentGridX = xCoords.map((x, i) => ({ label: String.fromCharCode(65 + i), coord: x })); // A, B, C...
      currentGridY = zCoords.map((z, i) => ({ label: `${i + 1}`, coord: z })); // 1, 2, 3...
      currentGridZmax = yCoords[yCoords.length - 1];
      createGridAxes(currentGridX.map(g => g.coord), currentGridY.map(g => g.coord), currentGridZmax, currentGridX.map(g => g.label), currentGridY.map(g => g.label));
      { const stories = yCoords.map((e, i) => ({ name: i === 0 ? "Base" : `P${i}`, height: i > 0 ? e - yCoords[i-1] : 0, elev: e })); createStoryLevelLines(stories, xCoords, zCoords); }

      // Create axis and floor buttons
      const axBtnContainer = panel.querySelector("#cad3d-axis-buttons") as HTMLElement;
      if (axBtnContainer) {
        axBtnContainer.style.display = "flex";
        const xLabels = currentGridX.map(g => g.label);
        const yLabels = currentGridY.map(g => g.label);
        axBtnContainer.innerHTML = `<span style="font-size:10px;color:var(--cad-heading);margin-right:4px">Ejes:</span>`;
        for (const l of xLabels) {
          axBtnContainer.innerHTML += `<button class="axis-btn" data-axis="x" data-label="${l}">${l}</button>`;
        }
        axBtnContainer.innerHTML += `<span style="margin:0 2px">|</span>`;
        for (const l of yLabels) {
          axBtnContainer.innerHTML += `<button class="axis-btn" data-axis="y" data-label="${l}">${l}</button>`;
        }
      }
      const floorBtnContainer = panel.querySelector("#cad3d-floor-buttons") as HTMLElement;
      if (floorBtnContainer) {
        floorBtnContainer.style.display = "flex";
        floorBtnContainer.innerHTML = `<span style="font-size:10px;color:var(--cad-heading);margin-right:4px">Planta:</span>`;
        for (let i = 0; i < nFloors; i++) {
          floorBtnContainer.innerHTML += `<button class="floor-btn" data-floor="${i}">P${i + 1}</button>`;
        }
      }

      // Draw reference grid
      createRefGrid(xCoords, zCoords, yCoords);

      updatePanel();
      console.log(`Model3D: ${nodes.length}n ${elements.length}e | ${nX}x${nZ} grid, ${nFloors} floors | COL${colStr} V${vigaStr} f'c=${fc}`);
      return { nodes: nodes.length, elements: elements.length, columns: newColIndices.size, beams: newBeamIndices.size };
    },

    clear() {
      mesh.nodes.val = []; mesh.elements.val = [];
      if (mesh.nodeInputs) mesh.nodeInputs.val = {};
      if (mesh.elementInputs) mesh.elementInputs.val = {};
      colElementIndices = new Set(); beamElementIndices = new Set(); elementFloor = new Map(); elementBay = new Map();
      currentGridX = []; currentGridY = []; currentGridZmax = 0;
      clearGridAxes();
      clearStoryLevels();
      clearRefGrid();
      const axBtnContainer = panel.querySelector("#cad3d-axis-buttons");
      if (axBtnContainer) { (axBtnContainer as HTMLElement).style.display = "none"; axBtnContainer.innerHTML = ""; }
      console.log("Model cleared"); updatePanel();
    },

    // === Frame Generator (portico 2D) ===
    frame(sv: number[], sp: number[], Lvi = 0, Lvd = 0) {
      cli.clear();
      const xCoords: number[] = [];
      if (Lvi > 0) xCoords.push(-Lvi);
      let xAcc = 0; xCoords.push(xAcc);
      for (const s of sv) { xAcc += s; xCoords.push(xAcc); }
      if (Lvd > 0) xCoords.push(xAcc + Lvd);
      const zCoords = [0]; let zAcc = 0;
      for (const s of sp) { zAcc += s; zCoords.push(zAcc); }
      const isCantTip = (ix: number) => (Lvi > 0 && ix === 0) || (Lvd > 0 && ix === xCoords.length - 1);
      const nid: Record<string, number> = {}; const nodes: Node[] = [];
      for (let iz = 0; iz < zCoords.length; iz++)
        for (let ix = 0; ix < xCoords.length; ix++) {
          if (iz === 0 && isCantTip(ix)) continue;
          nid[`${ix},${iz}`] = nodes.length; nodes.push([xCoords[ix], 0, zCoords[iz]]);
        }
      const elements: Element[] = [];
      colElementIndices = new Set(); beamElementIndices = new Set();
      for (let iz = 0; iz < zCoords.length - 1; iz++)
        for (let ix = 0; ix < xCoords.length; ix++) { if (isCantTip(ix)) continue; colElementIndices.add(elements.length); elements.push([nid[`${ix},${iz}`], nid[`${ix},${iz + 1}`]]); }
      for (let iz = 1; iz < zCoords.length; iz++)
        for (let ix = 0; ix < xCoords.length - 1; ix++) { beamElementIndices.add(elements.length); elements.push([nid[`${ix},${iz}`], nid[`${ix + 1},${iz}`]]); }
      const supports = new Map<number, boolean[]>();
      const sDofs = getSupportDofs();
      for (let ix = 0; ix < xCoords.length; ix++) { if (isCantTip(ix)) continue; const key = `${ix},0`; if (nid[key] !== undefined) supports.set(nid[key], [...sDofs]); }
      mesh.nodes.val = nodes; mesh.elements.val = elements;
      if (mesh.nodeInputs) mesh.nodeInputs.val = { supports };

      // Store grid coords for per-axis views
      currentGridX = [...xCoords]; currentGridY = [0]; currentGridZmax = zCoords[zCoords.length - 1] || 0;

      // Auto-fit grid/axes to model, then show axis bubbles
      setTimeout(() => { autoFitGridSize(); createGridAxes(xCoords, [0], currentGridZmax); updateAxisButtons(); updateFloorButtons(); }, 50);

      updatePanel(); return { nodes: nodes.length, elements: elements.length };
    },

    // === Building Generator (edificio 3D) ===
    building(svX: number[], svY: number[], sp: number[], nSubBeam: number = 3, Lvix: number = 0, Lvdx: number = 0, Lviy: number = 0, Lvdy: number = 0, nSubCol: number = 1) {
      cli.clear();
      const xCoords: number[] = [];
      if (Lvix > 0) xCoords.push(-Lvix);
      xCoords.push(0); for (const s of svX) xCoords.push(xCoords[xCoords.length - 1] + s);
      if (Lvdx > 0) xCoords.push(xCoords[xCoords.length - 1] + Lvdx);
      const yCoords: number[] = [];
      if (Lviy > 0) yCoords.push(-Lviy);
      yCoords.push(0); for (const s of svY) yCoords.push(yCoords[yCoords.length - 1] + s);
      if (Lvdy > 0) yCoords.push(yCoords[yCoords.length - 1] + Lvdy);
      const zCoords = [0]; for (const s of sp)  zCoords.push(zCoords[zCoords.length - 1] + s);
      // Cantilever tip detection (X and Y)
      const isCantTipX = (ix: number) => (Lvix > 0 && ix === 0) || (Lvdx > 0 && ix === xCoords.length - 1);
      const isCantTipY = (iy: number) => (Lviy > 0 && iy === 0) || (Lvdy > 0 && iy === yCoords.length - 1);
      const isCantTip = (ix: number, iy: number) => isCantTipX(ix) || isCantTipY(iy);
      const nodes: Node[] = []; const nid: Record<string, number> = {};
      for (let iz = 0; iz < zCoords.length; iz++)
        for (let iy = 0; iy < yCoords.length; iy++)
          for (let ix = 0; ix < xCoords.length; ix++) {
            if (iz === 0 && isCantTip(ix, iy)) continue; // no base node at cantilever tip
            nid[`${ix},${iy},${iz}`] = nodes.length; nodes.push([xCoords[ix], yCoords[iy], zCoords[iz]]);
          }
      const nJointNodes = nodes.length; // joint nodes count (before subdivision)
      const elements: Element[] = [];
      colElementIndices = new Set();
      beamElementIndices = new Set();
      elementFloor = new Map();
      // Columns (vertical) — skip cantilever tips; subdivide if nSubCol > 1
      // Track floor: iz=0 means floor 0 (piso 1), etc.
      const colElements: { el: Element; floor: number }[] = [];
      for (let iz = 0; iz < zCoords.length - 1; iz++) for (let iy = 0; iy < yCoords.length; iy++) for (let ix = 0; ix < xCoords.length; ix++) {
        if (isCantTip(ix, iy)) continue;
        colElements.push({ el: [nid[`${ix},${iy},${iz}`], nid[`${ix},${iy},${iz + 1}`]], floor: iz });
      }
      // Subdivide columns
      for (const { el: [ni, nj], floor } of colElements) {
        if (nSubCol <= 1) { colElementIndices.add(elements.length); elementFloor.set(elements.length, floor); elements.push([ni, nj]); continue; }
        const p0 = nodes[ni], p1 = nodes[nj];
        let prev = ni;
        for (let k = 1; k < nSubCol; k++) {
          const t = k / nSubCol;
          const midIdx = nodes.length;
          nodes.push([p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t, p0[2] + (p1[2] - p0[2]) * t]);
          colElementIndices.add(elements.length); elementFloor.set(elements.length, floor);
          elements.push([prev, midIdx]);
          prev = midIdx;
        }
        colElementIndices.add(elements.length); elementFloor.set(elements.length, floor);
        elements.push([prev, nj]);
      }
      // Beams X — subdivide with intermediate nodes
      // Beams at iz=1 are floor 0 (piso 1), iz=2 floor 1, etc.
      elementBay = new Map();
      const beamElements: { el: Element; floor: number; dir: 'x' | 'y'; bay: number }[] = [];
      for (let iz = 1; iz < zCoords.length; iz++) for (let iy = 0; iy < yCoords.length; iy++) for (let ix = 0; ix < xCoords.length - 1; ix++) beamElements.push({ el: [nid[`${ix},${iy},${iz}`], nid[`${ix + 1},${iy},${iz}`]], floor: iz - 1, dir: 'x', bay: ix });
      // Beams Y
      for (let iz = 1; iz < zCoords.length; iz++) for (let ix = 0; ix < xCoords.length; ix++) for (let iy = 0; iy < yCoords.length - 1; iy++) beamElements.push({ el: [nid[`${ix},${iy},${iz}`], nid[`${ix},${iy + 1},${iz}`]], floor: iz - 1, dir: 'y', bay: iy });
      // Subdivide beams
      for (const { el: [ni, nj], floor, dir, bay } of beamElements) {
        const p0 = nodes[ni], p1 = nodes[nj];
        let prev = ni;
        for (let k = 1; k < nSubBeam; k++) {
          const t = k / nSubBeam;
          const midIdx = nodes.length;
          nodes.push([p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t, p0[2] + (p1[2] - p0[2]) * t]);
          const ei = elements.length;
          beamElementIndices.add(ei); elementFloor.set(ei, floor); elementBay.set(ei, { dir, bay });
          elements.push([prev, midIdx]);
          prev = midIdx;
        }
        const ei = elements.length;
        beamElementIndices.add(ei); elementFloor.set(ei, floor); elementBay.set(ei, { dir, bay });
        elements.push([prev, nj]);
      }
      // ── Secondary Beams (run in one direction, spaced within perpendicular bays) ──
      secondaryBeamElementIndices = new Set();
      if (secondaryBeamsEnabled && nSecondaryBeams > 0) {
        // Helper: find or create a node at (x, y, z)
        const findOrCreateNode = (x: number, y: number, z: number): number => {
          for (let ni = 0; ni < nodes.length; ni++) {
            if (Math.abs(nodes[ni][0] - x) < 1e-6 &&
                Math.abs(nodes[ni][1] - y) < 1e-6 &&
                Math.abs(nodes[ni][2] - z) < 1e-6) return ni;
          }
          const idx = nodes.length;
          nodes.push([x, y, z]);
          return idx;
        };

        for (let iz = 1; iz < zCoords.length; iz++) {
          if (secondaryBeamDir === 'x') {
            // Secondary beams RUN in X direction, spaced within each Y-bay
            // They connect grid lines in X, at intermediate Y positions
            for (let by = 0; by < yCoords.length - 1; by++) {
              const y0 = yCoords[by], y1 = yCoords[by + 1];
              for (let k = 1; k <= nSecondaryBeams; k++) {
                const ySec = y0 + k / (nSecondaryBeams + 1) * (y1 - y0);
                // Create nodes at each X-grid line
                const secNodes: number[] = [];
                for (let ix = 0; ix < xCoords.length; ix++) {
                  secNodes.push(findOrCreateNode(xCoords[ix], ySec, zCoords[iz]));
                }
                // Create elements between consecutive X-grid lines
                for (let ix = 0; ix < xCoords.length - 1; ix++) {
                  const ei_sb = elements.length;
                  secondaryBeamElementIndices.add(ei_sb);
                  beamElementIndices.add(ei_sb);
                  elementFloor.set(ei_sb, iz - 1);
                  elementBay.set(ei_sb, { dir: 'x', bay: ix });
                  elements.push([secNodes[ix], secNodes[ix + 1]]);
                }
              }
            }
          } else {
            // Secondary beams RUN in Y direction, spaced within each X-bay
            for (let bx = 0; bx < xCoords.length - 1; bx++) {
              const x0 = xCoords[bx], x1 = xCoords[bx + 1];
              for (let k = 1; k <= nSecondaryBeams; k++) {
                const xSec = x0 + k / (nSecondaryBeams + 1) * (x1 - x0);
                const secNodes: number[] = [];
                for (let iy = 0; iy < yCoords.length; iy++) {
                  secNodes.push(findOrCreateNode(xSec, yCoords[iy], zCoords[iz]));
                }
                for (let iy = 0; iy < yCoords.length - 1; iy++) {
                  const ei_sb = elements.length;
                  secondaryBeamElementIndices.add(ei_sb);
                  beamElementIndices.add(ei_sb);
                  elementFloor.set(ei_sb, iz - 1);
                  elementBay.set(ei_sb, { dir: 'y', bay: iy });
                  elements.push([secNodes[iy], secNodes[iy + 1]]);
                }
              }
            }
          }
        }
      }

      // ── Supports (created early so walls can add base nodes) ──
      const supports = new Map<number, boolean[]>();
      const sDofs = getSupportDofs();
      for (let iy = 0; iy < yCoords.length; iy++) for (let ix = 0; ix < xCoords.length; ix++) {
        if (isCantTip(ix, iy)) continue;
        supports.set(nid[`${ix},${iy},0`], [...sDofs]);
      }

      // ── Shear Walls (Q4 shell elements) ──
      wallElementIndices = new Set();
      for (const wp of wallPlacements) {
        const nf = zCoords.length - 1; // number of floors
        const floorsToPlace = wp.floors.includes(-1) ? Array.from({length: nf}, (_,i) => i) : wp.floors.filter(f => f < nf);

        for (const iz of floorsToPlace) {
          // Determine the 4 corner nodes of this wall panel
          let ix0: number, iy0: number, ix1: number, iy1: number;
          if (wp.dir === 'x') {
            // Wall spans in X, on Y-axis = axisIdx
            ix0 = wp.bay; ix1 = wp.bay + 1;
            iy0 = wp.axisIdx; iy1 = wp.axisIdx;
          } else {
            // Wall spans in Y, on X-axis = axisIdx
            ix0 = wp.axisIdx; ix1 = wp.axisIdx;
            iy0 = wp.bay; iy1 = wp.bay + 1;
          }
          // Bottom-left, bottom-right, top-right, top-left (CCW)
          const nBL = nid[`${ix0},${iy0},${iz}`];
          const nTL = nid[`${ix0},${iy0},${iz + 1}`];
          let nBR: number, nTR: number;
          if (wp.dir === 'x') {
            nBR = nid[`${ix1},${iy1},${iz}`];
            nTR = nid[`${ix1},${iy1},${iz + 1}`];
          } else {
            nBR = nid[`${ix1},${iy1},${iz}`];
            nTR = nid[`${ix1},${iy1},${iz + 1}`];
          }
          if (nBL === undefined || nBR === undefined || nTL === undefined || nTR === undefined) continue;

          // Subdivide the wall panel into wallSubdivW × wallSubdivH quads
          const nW = wallSubdivW;
          const nH = wallSubdivH;
          // Create intermediate nodes
          const pBL = nodes[nBL], pBR = nodes[nBR], pTL = nodes[nTL], pTR = nodes[nTR];
          const wallNodeGrid: number[][] = []; // [row][col] = node index
          for (let jr = 0; jr <= nH; jr++) {
            const row: number[] = [];
            const tV = jr / nH;
            for (let jc = 0; jc <= nW; jc++) {
              const tH = jc / nW;
              // Bilinear interpolation
              const x = (1-tV)*((1-tH)*pBL[0]+tH*pBR[0]) + tV*((1-tH)*pTL[0]+tH*pTR[0]);
              const y = (1-tV)*((1-tH)*pBL[1]+tH*pBR[1]) + tV*((1-tH)*pTL[1]+tH*pTR[1]);
              const z = (1-tV)*((1-tH)*pBL[2]+tH*pBR[2]) + tV*((1-tH)*pTL[2]+tH*pTR[2]);
              // Reuse existing corner/edge nodes
              if (jr === 0 && jc === 0) { row.push(nBL); }
              else if (jr === 0 && jc === nW) { row.push(nBR); }
              else if (jr === nH && jc === 0) { row.push(nTL); }
              else if (jr === nH && jc === nW) { row.push(nTR); }
              else { row.push(nodes.length); nodes.push([x, y, z]); }
            }
            wallNodeGrid.push(row);
          }
          // Create Q4 elements (CCW: BL, BR, TR, TL)
          for (let jr = 0; jr < nH; jr++) {
            for (let jc = 0; jc < nW; jc++) {
              const n0 = wallNodeGrid[jr][jc];
              const n1 = wallNodeGrid[jr][jc + 1];
              const n2 = wallNodeGrid[jr + 1][jc + 1];
              const n3 = wallNodeGrid[jr + 1][jc];
              const ei_w = elements.length;
              wallElementIndices.add(ei_w);
              elementFloor.set(ei_w, iz);
              elements.push([n0, n1, n2, n3]);
            }
          }
          // Fix base nodes of wall (iz=0): empotramiento for intermediate nodes
          if (iz === 0) {
            for (let jc = 0; jc <= nW; jc++) {
              const baseNodeIdx = wallNodeGrid[0][jc];
              // Check if not already a joint node (corners are already supported)
              if (baseNodeIdx >= nJointNodes) {
                supports.set(baseNodeIdx, [...sDofs]);
              }
            }
          }
        }
      }

      // ── Floor Slabs (Q4 shell elements — horizontal, thin shell) ──
      // CRITICAL: slab subdivisions MUST match beam subdivisions
      // so that slab edge nodes coincide with beam intermediate nodes
      slabElementIndices = new Set();
      if (slabEnabled) {
        const nSx = nSubBeam; // match beam X subdivision
        const nSy = nSubBeam; // match beam Y subdivision
        // Build spatial index for fast node lookup (round to 4 decimals)
        const nodeIndex = new Map<string, number>();
        const nodeKey = (x: number, y: number, z: number) =>
          `${Math.round(x*10000)},${Math.round(y*10000)},${Math.round(z*10000)}`;
        for (let ni = 0; ni < nodes.length; ni++) {
          nodeIndex.set(nodeKey(nodes[ni][0], nodes[ni][1], nodes[ni][2]), ni);
        }
        // Create slab panels on each floor (iz=1 to nZ-1, i.e. every elevated floor)
        for (let iz = 1; iz < zCoords.length; iz++) {
          const z = zCoords[iz];
          // For each bay in X and Y
          for (let bx = 0; bx < xCoords.length - 1; bx++) {
            for (let by = 0; by < yCoords.length - 1; by++) {
              const x0 = xCoords[bx], x1 = xCoords[bx + 1];
              const y0 = yCoords[by], y1 = yCoords[by + 1];

              // Create node grid (nSx+1) x (nSy+1) for this bay
              const slabGrid: number[][] = [];
              for (let jr = 0; jr <= nSy; jr++) {
                const row: number[] = [];
                for (let jc = 0; jc <= nSx; jc++) {
                  const x = x0 + jc / nSx * (x1 - x0);
                  const y = y0 + jr / nSy * (y1 - y0);
                  // Reuse corner joint nodes
                  if (jr === 0 && jc === 0) { row.push(nid[`${bx},${by},${iz}`]); }
                  else if (jr === 0 && jc === nSx) { row.push(nid[`${bx+1},${by},${iz}`]); }
                  else if (jr === nSy && jc === 0) { row.push(nid[`${bx},${by+1},${iz}`]); }
                  else if (jr === nSy && jc === nSx) { row.push(nid[`${bx+1},${by+1},${iz}`]); }
                  else {
                    // Fast lookup for existing node (beam subdivision nodes)
                    const key = nodeKey(x, y, z);
                    const found = nodeIndex.get(key);
                    if (found !== undefined) { row.push(found); }
                    else {
                      const ni = nodes.length;
                      nodes.push([x, y, z]);
                      nodeIndex.set(key, ni);
                      row.push(ni);
                    }
                  }
                }
                slabGrid.push(row);
              }
              // Create Q4 elements (CCW viewed from above)
              for (let jr = 0; jr < nSy; jr++) {
                for (let jc = 0; jc < nSx; jc++) {
                  const n0 = slabGrid[jr][jc];
                  const n1 = slabGrid[jr][jc + 1];
                  const n2 = slabGrid[jr + 1][jc + 1];
                  const n3 = slabGrid[jr + 1][jc];
                  const ei_s = elements.length;
                  slabElementIndices.add(ei_s);
                  elementFloor.set(ei_s, iz - 1);
                  elements.push([n0, n1, n2, n3]);
                }
              }
            }
          }
        }
      }

      // ── Braces (diagonal elements in vertical planes) ──
      if (bracesEnabled && bracesMode) {
        const addBrX = bracesMode === "all" || bracesMode === "x" || bracesMode === "perimeter";
        const addBrY = bracesMode === "all" || bracesMode === "y" || bracesMode === "perimeter";
        const nfBr = zCoords.length - 1;

        for (let iz = 0; iz < nfBr; iz++) {
          // X-direction braces (in XZ vertical plane, constant iy)
          if (addBrX) {
            for (let iy = 0; iy < yCoords.length; iy++) {
              if (bracesMode === "perimeter" && iy !== 0 && iy !== yCoords.length - 1) continue;
              const midBay = Math.floor((xCoords.length - 1) / 2);
              for (let ix = 0; ix < xCoords.length - 1; ix++) {
                if (bracesMode === "perimeter" && ix !== midBay) continue;
                if (isCantTip(ix, iy) || isCantTip(ix+1, iy)) continue;
                const n0 = nid[`${ix},${iy},${iz}`], n1 = nid[`${ix + 1},${iy},${iz + 1}`];
                const n2 = nid[`${ix + 1},${iy},${iz}`], n3 = nid[`${ix},${iy},${iz + 1}`];
                if (n0 !== undefined && n1 !== undefined) { elements.push([n0, n1]); elementFloor.set(elements.length - 1, iz); }
                if (n2 !== undefined && n3 !== undefined) { elements.push([n2, n3]); elementFloor.set(elements.length - 1, iz); }
              }
            }
          }
          // Y-direction braces (in YZ vertical plane, constant ix)
          if (addBrY) {
            for (let ix = 0; ix < xCoords.length; ix++) {
              if (bracesMode === "perimeter" && ix !== 0 && ix !== xCoords.length - 1) continue;
              const midBay = Math.floor((yCoords.length - 1) / 2);
              for (let iy = 0; iy < yCoords.length - 1; iy++) {
                if (bracesMode === "perimeter" && iy !== midBay) continue;
                if (isCantTip(ix, iy) || isCantTip(ix, iy+1)) continue;
                const n0 = nid[`${ix},${iy},${iz}`], n1 = nid[`${ix},${iy + 1},${iz + 1}`];
                const n2 = nid[`${ix},${iy + 1},${iz}`], n3 = nid[`${ix},${iy},${iz + 1}`];
                if (n0 !== undefined && n1 !== undefined) { elements.push([n0, n1]); elementFloor.set(elements.length - 1, iz); }
                if (n2 !== undefined && n3 !== undefined) { elements.push([n2, n3]); elementFloor.set(elements.length - 1, iz); }
              }
            }
          }
        }
      }

      mesh.nodes.val = nodes; mesh.elements.val = elements;
      if (mesh.nodeInputs) mesh.nodeInputs.val = { supports };

      // Store grid coords for per-axis views
      currentGridX = [...xCoords]; currentGridY = [...yCoords]; currentGridZmax = zCoords[zCoords.length - 1] || 0;

      // Auto-fit grid/axes to model, then show axis bubbles
      setTimeout(() => { autoFitGridSize(); createGridAxes(xCoords, yCoords, currentGridZmax); updateAxisButtons(); updateFloorButtons(); }, 50);

      updatePanel(); return { nodes: nodes.length, elements: elements.length, nJointNodes };
    },

    // === Galpon (arco + cercha 3D) ===
    galpon(span = 12, length = 20, height = 6, archRise = 3, xDiv = 8, yDiv = 4) {
      cli.clear();
      const nodes: Node[] = []; const elements: Element[] = [];
      const archZ = (x: number) => height + archRise * (1 - Math.pow(2 * x / span - 1, 2));
      const nid: number[][] = []; const yn = yDiv + 1;
      for (let iy = 0; iy < yn; iy++) {
        const row: number[] = []; const y = (length / yDiv) * iy;
        row.push(nodes.length); nodes.push([0, y, 0]);
        row.push(nodes.length); nodes.push([span, y, 0]);
        row.push(nodes.length); nodes.push([0, y, height]);
        for (let ix = 1; ix < xDiv; ix++) { const x = (span / xDiv) * ix; row.push(nodes.length); nodes.push([x, y, archZ(x)]); }
        row.push(nodes.length); nodes.push([span, y, height]);
        nid.push(row);
      }
      for (let iy = 0; iy < yn; iy++) { const r = nid[iy]; elements.push([r[0], r[2]]); elements.push([r[1], r[r.length - 1]]); for (let i = 2; i < r.length - 1; i++) elements.push([r[i], r[i + 1]]); }
      for (let iy = 0; iy < yDiv; iy++) for (let iNode = 2; iNode < nid[0].length; iNode++) elements.push([nid[iy][iNode], nid[iy + 1][iNode]]);
      for (let iy = 0; iy < yDiv; iy++) for (let iNode = 2; iNode < nid[0].length - 1; iNode += 2) elements.push([nid[iy][iNode], nid[iy + 1][iNode + 1]]);
      const supports = new Map<number, boolean[]>();
      const sDofs = getSupportDofs();
      for (let iy = 0; iy < yn; iy++) { supports.set(nid[iy][0], [...sDofs]); supports.set(nid[iy][1], [...sDofs]); }

      mesh.nodes.val = nodes; mesh.elements.val = elements;
      if (mesh.nodeInputs) mesh.nodeInputs.val = { supports };
      updatePanel(); return { nodes: nodes.length, elements: elements.length };
    },

    // === Examples ===
    example(name?: string) {
      if (!name) { console.log(`Ejemplos: truss, beams, 3d, portico, edificio, galpon`); return; }
      switch (name) {
        case "truss": {
          // Cercha de acero: 2L 25×25×3mm
          sectionState.colMat = 1; sectionState.vigaMat = 1;
          cli.clear(); setGenerator("truss"); generateTruss(); break;
        }
        case "beams": {
          // Pórtico de hormigón: col 40×40, vigas 30×40
          sectionState.colMat = 0; sectionState.vigaMat = 0;
          sectionState.colShape = 0; // rectangular
          cli.clear(); setGenerator("beams"); generateBeams(); break;
        }
        case "3d": case "3d-structure": case "torre": {
          // Torre de acero: perfiles metálicos
          sectionState.colMat = 1; sectionState.vigaMat = 1;
          cli.clear(); setGenerator("3d"); generate3d(); break;
        }
        case "portico": {
          // Pórtico de hormigón
          sectionState.colMat = 0; sectionState.vigaMat = 0;
          sectionState.colShape = 0;
          setGenerator("frame"); regenerateFromParams(); break;
        }
        case "edificio": {
          // Edificio aporticado puro: hormigon, sin muros, sin losas, sin vigas sec
          setGenerator("edificio");
          sectionState.colMat = 0; sectionState.vigaMat = 0;
          sectionState.colShape = 0;
          wallPlacements = []; slabEnabled = false; secondaryBeamsEnabled = false; bracesEnabled = false;
          regenerateFromParams(); break;
        }
        case "edif-acero": case "edificio-acero": {
          // Edificio de acero: columnas W, vigas W, vigas secundarias en X, deck
          setGenerator("edificio");
          sectionState.colMat = 1; sectionState.vigaMat = 1;
          sectionState.steelColType = 0; sectionState.steelVigaType = 0;
          wallPlacements = [];
          secondaryBeamsEnabled = true; nSecondaryBeams = 2;
          // Auto: secundarias corren en la direccion CORTA (perpendicular al vano largo)
          const avgLx_a = edifSvx.reduce((a,b) => a+b, 0) / edifSvx.length;
          const avgLy_a = edifSvy.reduce((a,b) => a+b, 0) / edifSvy.length;
          secondaryBeamDir = avgLx_a >= avgLy_a ? 'y' : 'x'; // corren en la dir corta
          slabEnabled = true; slabThickness = 0.08; bracesEnabled = false;
          regenerateFromParams(); break;
        }
        case "edif-acero-diag": case "edificio-acero-diag": {
          // Edificio de acero con diagonales: columnas W, vigas W, secundarias, deck + braces
          setGenerator("edificio");
          sectionState.colMat = 1; sectionState.vigaMat = 1;
          sectionState.steelColType = 0; sectionState.steelVigaType = 0;
          wallPlacements = [];
          secondaryBeamsEnabled = true; nSecondaryBeams = 2;
          const avgLx_d = edifSvx.reduce((a,b) => a+b, 0) / edifSvx.length;
          const avgLy_d = edifSvy.reduce((a,b) => a+b, 0) / edifSvy.length;
          secondaryBeamDir = avgLx_d >= avgLy_d ? 'y' : 'x';
          slabEnabled = true; slabThickness = 0.08;
          bracesEnabled = true; bracesMode = "perimeter";
          regenerateFromParams(); break;
        }
        case "edif-muros": case "edificio-muros": {
          // Edificio aporticado con muros de corte + losas
          setGenerator("edificio");
          sectionState.colMat = 0; sectionState.vigaMat = 0;
          sectionState.colShape = 0;
          secondaryBeamsEnabled = false;
          const nvx = Math.round(generatorParams["nVanosX"]?.val ?? 2);
          const nvy = Math.round(generatorParams["nVanosY"]?.val ?? 2);
          // Muros en las 4 esquinas del edificio
          wallPlacements = [
            { dir: 'x', bay: 0, axisIdx: 0, floors: [-1] },
            { dir: 'x', bay: nvx - 1, axisIdx: nvy, floors: [-1] },
            { dir: 'y', bay: 0, axisIdx: 0, floors: [-1] },
            { dir: 'y', bay: nvy - 1, axisIdx: nvx, floors: [-1] },
          ];
          slabEnabled = true; slabThickness = 0.15;
          regenerateFromParams(); break;
        }
        case "edif-mixto": case "edificio-mixto": {
          // Edificio mixto: columnas CFT, vigas hormigon, muros de corte, losas
          setGenerator("edificio");
          sectionState.colMat = 2; // CFT
          sectionState.vigaMat = 0; // hormigon
          secondaryBeamsEnabled = false;
          const nvxM = Math.round(generatorParams["nVanosX"]?.val ?? 2);
          const nvyM = Math.round(generatorParams["nVanosY"]?.val ?? 2);
          wallPlacements = [
            { dir: 'x', bay: 0, axisIdx: 0, floors: [-1] },
            { dir: 'x', bay: nvxM - 1, axisIdx: nvyM, floors: [-1] },
          ];
          slabEnabled = true; slabThickness = 0.12;
          regenerateFromParams(); break;
        }
        case "mezanine": case "mezzanine": {
          // Mezanine: 1 piso acero con deck, vigas secundarias, sin muros
          setGenerator("edificio");
          if (generatorParams["nPisos"]) generatorParams["nPisos"].val = 1;
          if (generatorParams["hPiso"]) generatorParams["hPiso"].val = 4.5;
          if (generatorParams["nVanosX"]) generatorParams["nVanosX"].val = 3;
          if (generatorParams["nVanosY"]) generatorParams["nVanosY"].val = 2;
          if (generatorParams["nSubViga"]) generatorParams["nSubViga"].val = 3;
          edifSvx = [6, 6, 6]; edifSvy = [5, 5];
          sectionState.colMat = 1; sectionState.vigaMat = 1;
          sectionState.steelColType = 0; sectionState.steelVigaType = 0;
          wallPlacements = [];
          secondaryBeamsEnabled = true; nSecondaryBeams = 2;
          // Auto: secundarias en la dir corta (Lx=6 > Ly=5 → corren en Y)
          secondaryBeamDir = edifSvx[0] >= edifSvy[0] ? 'y' : 'x';
          slabEnabled = true; slabThickness = 0.08;
          slabSubdivX = 3; slabSubdivY = 3;
          regenerateFromParams(); break;
        }
        case "galpon": {
          setGenerator("galpon");
          // Galpón de acero: 2L 25×25×3mm (columnas/cerchas) + G 80×50×15×3mm (correas)
          sectionState.colMat = 1; // acero
          sectionState.vigaMat = 1; // acero
          regenerateFromParams(); break;
        }
        case "barra": { setGenerator("barra"); regenerateFromParams(); break; }
        case "placa3q": case "plate3q": case "placa-3q": {
          cli.clear(); setGenerator("placa-3q"); generatePlate3Q(); break;
        }
        case "placa": case "plate": case "plate-q4": case "placa-q4": {
          cli.clear(); setGenerator("placa-q4"); generatePlateQ4(); break;
        }
        case "losa-rect": case "rectangular-slab": {
          cli.clear(); setGenerator("losa-rect"); generateRectSlab(); break;
        }
        case "losa-plana": case "flat-slab": {
          cli.clear(); setGenerator("losa-plana"); generateFlatSlab(); break;
        }
        case "viga-alta": case "deep-beam": {
          cli.clear(); setGenerator("viga-alta"); generateDeepBeam(); break;
        }
        case "muro-contencion": case "retaining-wall": {
          cli.clear(); setGenerator("muro-contencion"); generateRetainingWall(); break;
        }
        case "zapata": case "footing": {
          cli.clear(); setGenerator("zapata"); generateFooting(); break;
        }
        case "placa-orificios": case "plate-holes": case "placa-base": {
          cli.clear(); setGenerator("placa-orificios"); generatePlateWithHoles(); break;
        }
        case "col-placa": case "columna-placa": {
          cli.clear(); setGenerator("col-placa"); generateColumnBasePlate(); break;
        }
        case "talud": case "slope": {
          cli.clear(); setGenerator("talud"); generateSlope(); break;
        }
        case "eiffel": case "torre-eiffel": {
          cli.clear(); setGenerator("eiffel"); generateEiffel(); break;
        }
        case "arco": case "arco-gateway": {
          cli.clear(); setGenerator("arco"); generateGatewayArch(); break;
        }
        case "puente": case "puente-colgante": {
          cli.clear(); setGenerator("puente"); generateBridge(); break;
        }
        case "twisted": case "torre-twisted": case "turning-torso": {
          cli.clear(); setGenerator("twisted"); generateTwistedTower(); break;
        }
        case "burj": case "burj-khalifa": {
          cli.clear(); setGenerator("burj"); generateBurjKhalifa(); break;
        }
        case "opera": case "sydney-opera": {
          cli.clear(); setGenerator("opera"); generateSydneyOpera(); break;
        }
        case "diagrid": case "gherkin": {
          cli.clear(); setGenerator("diagrid"); generateDiagrid(); break;
        }
        case "muro-q4": case "shear-wall": case "muro-cantilever": {
          cli.clear(); setGenerator("muro-q4"); generateShearWallQ4(); break;
        }
        case "viga-q4": case "cantilever-beam": case "viga-cantilever": {
          cli.clear(); setGenerator("viga-q4"); generateCantileverBeamQ4(); break;
        }
        case "placa-xy": case "placa-cantilever": case "losa-cantilever": {
          cli.clear(); setGenerator("placa-xy"); generatePlacaCantileverQ4(); break;
        }
        case "pergola": {
          cli.clear(); setGenerator("pergola"); generatePergola(); break;
        }
        default: console.error(`Ejemplo desconocido: "${name}".`);
      }
    },

    /** Run plate Q4 solver (WASM). theory: 0=Mindlin, 1=Kirchhoff, 2=Membrane */
    plateQ4(Lx = 10, Ly = 10, nx = 16, ny = 16, bcType: "simply-supported" | "clamped" = "simply-supported", pressure = -10, thickness = 0.2, E = 30e6, nu = 0.3, theory = 0) {
      const theoryNames = ['Mindlin (gruesa)', 'Kirchhoff (delgada)', 'Membrane'];
      console.log(`Plate Q4 [${theoryNames[theory]}]: ${Lx}×${Ly}, ${nx}×${ny} elem, BC=${bcType}, q=${pressure}, t=${thickness}`);
      const t0 = performance.now();
      const result = plateQ4Solve({ E, nu, thickness, meshLx: Lx, meshLy: Ly, meshNx: nx, meshNy: ny, bcType, pressure, theoryType: theory });
      const dt = performance.now() - t0;
      console.log(`Solved in ${dt.toFixed(1)} ms`);
      console.log(`w_max = ${result.maxW.toExponential(6)}`);
      console.log(`w_center = ${(result.centerW ?? 0).toExponential(6)}`);
      console.log(`Mxx_max = ${result.maxMxx.toExponential(4)}, Myy_max = ${result.maxMyy.toExponential(4)}`);
      console.log(`Mxy_max = ${result.maxMxy.toExponential(4)}`);
      console.log(`Qx_max = ${result.maxQx.toExponential(4)}, Qy_max = ${result.maxQy.toExponential(4)}`);

      // Map to mesh format for visualization
      const nodes: Node[] = result.nodeResults.map(n => [n.x, n.y, 0]);
      const elements: Element[] = result.elementResults.map(e => [...e.nodes]);
      mesh.nodes.val = nodes;
      mesh.elements.val = elements;

      // Map displacements: w → dz, βx → rx, βy → ry
      const deformations = new Map<number, [number,number,number,number,number,number]>();
      result.nodeResults.forEach((n, i) => {
        deformations.set(i, [0, 0, n.w, n.bx, n.by, 0]);
      });
      if (mesh.deformOutputs) mesh.deformOutputs.val = { deformations };

      // Supports (boundary nodes)
      const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
      result.nodeResults.forEach((n, i) => {
        const onBoundary = n.x < 1e-10 || n.x > Lx - 1e-10 || n.y < 1e-10 || n.y > Ly - 1e-10;
        if (onBoundary) supports.set(i, [true, true, true, true, true, true]);
      });
      // Nodal loads from uniform pressure for visualization
      const loads = new Map<number, [number,number,number,number,number,number]>();
      if (Math.abs(pressure) > 1e-30) {
        const loadPerNode = pressure * Lx * Ly / nodes.length;
        nodes.forEach((_, i) => { if (!supports.has(i)) loads.set(i, [0, 0, loadPerNode, 0, 0, 0]); });
      }
      if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads };
      if (mesh.elementInputs) mesh.elementInputs.val = {};

      // Map bending results to analyzeOutputs for color contour rendering
      // bendingXX/YY/XY format: Map<elementIndex, [val_node0, val_node1, val_node2, ...]>
      // For Q4 elements: element-center value assigned to all 4 nodes
      if (mesh.analyzeOutputs) {
        const bendingXX = new Map<number, [number, number, number]>();
        const bendingYY = new Map<number, [number, number, number]>();
        const bendingXY = new Map<number, [number, number, number]>();
        result.elementResults.forEach((e, i) => {
          bendingXX.set(i, [e.Mxx, e.Mxx, e.Mxx] as [number, number, number]);
          bendingYY.set(i, [e.Myy, e.Myy, e.Myy] as [number, number, number]);
          bendingXY.set(i, [e.Mxy, e.Mxy, e.Mxy] as [number, number, number]);
        });
        mesh.analyzeOutputs.val = { bendingXX, bendingYY, bendingXY };
      }

      setTimeout(() => autoFitGridSize(), 50);
      updatePanel();
      return result;
    },

    /** Set a generator parameter by key. Example: cad.setParam('Lx', 15) */
    setParam(key: string, value: number) {
      if (generatorParams[key]) {
        generatorParams[key].val = value;
        console.log(`${key} = ${value}`);
        rebuildTweakpane();
        regenerateFromParams();
      } else if (loadParams[key]) {
        loadParams[key].val = value;
        console.log(`${key} = ${value}`);
        rebuildTweakpane();
        regenerateFromParams();
      } else {
        console.error(`Parámetro "${key}" no encontrado. Disponibles: ${Object.keys({...generatorParams, ...loadParams}).join(', ')}`);
      }
    },

    /** Get current value of a generator parameter */
    get(key?: string) {
      if (!key) {
        const all: Record<string, number> = {};
        for (const k in generatorParams) all[k] = generatorParams[k].val;
        for (const k in loadParams) all[k] = loadParams[k].val;
        all["plateTheory"] = plateTheory;
        all["supportType"] = supportType;
        const opts = getSupportOptions()[activeGenerator];
        if (opts && opts[supportType]) (all as any)["supportLabel"] = opts[supportType].label as any;
        console.table(all);
        return all;
      }
      if (generatorParams[key]) return generatorParams[key].val;
      if (loadParams[key]) return loadParams[key].val;
      console.error(`Parámetro "${key}" no encontrado.`);
    },

    /** Set plate theory: 1=Membrana, 2=Kirchhoff (delgada), 3=Mindlin (gruesa) */
    setTheory(t: number | string) {
      if (typeof t === 'string') {
        const map: Record<string, number> = { membrana: 1, membrane: 1, kirchhoff: 2, delgada: 2, thin: 2, mindlin: 3, gruesa: 3, thick: 3 };
        t = map[t.toLowerCase()] || 3;
      }
      plateTheory = t as number;
      const names = { 1: 'Membrana', 2: 'Kirchhoff (delgada)', 3: 'Mindlin (gruesa)' } as any;
      console.log(`Teoría de placa: ${names[plateTheory] || plateTheory}`);
      if (activeGenerator.includes('placa')) { rebuildTweakpane(); regenerateFromParams(); }
    },

    /** Set support type by index or name. Example: cad.setBc('empotrado') or cad.setBc(0) */
    setBc(bc: number | string) {
      const opts = getSupportOptions()[activeGenerator];
      if (!opts || opts.length === 0) { console.error("No support options for current generator"); return; }
      if (typeof bc === 'string') {
        const idx = opts.findIndex(o => o.label.toLowerCase().includes(bc.toLowerCase()));
        bc = idx >= 0 ? idx : 0;
      }
      supportType = bc as number;
      if (supportType >= opts.length) supportType = 0;
      console.log(`Apoyo: ${opts[supportType].label} → DOFs: [${opts[supportType].dofs.map(d => d ? '1' : '0').join(',')}]`);
      rebuildTweakpane(); regenerateFromParams();
    },

    helpFull() {
      console.log(`
=== FEM Studio CLI ===
Nodos:    cad.addNode(x,y,z)  cad.removeNode(i)  cad.listNodes()
Elem:     cad.addFrame(n1,n2) cad.removeFrame(i)  cad.listFrames()
BC:       cad.addSupport(n)   cad.addLoad(n,[Fx,Fy,Fz,Mx,My,Mz])
Genera:   cad.frame(sv,sp)    cad.building(svX,svY,sp)
          cad.galpon(span,length,height,archRise,xDiv,yDiv)
Ejemplos: cad.example('truss') | 'beams' | '3d' | 'portico' | 'edificio' | 'galpon' | 'barra' | 'placa'
Placa Q4: cad.plateQ4(Lx, Ly, nx, ny, bcType, pressure, thickness, E, nu)
Params:   cad.setParam('Lx', 15)  cad.get()  cad.get('Lx')
Placa:    cad.setTheory('mindlin'|'kirchhoff'|'membrana')  cad.setBc('ss'|'empotrado')
Modal:    cad.modal()  cad.modal(true/false)  cad.setMode(0)  — análisis modal + animación
Unidades: cad.units('SI'|'US')  — cambia sistema de unidades
Util:     cad.info()  cad.clear()  cad.help()  cad.helpFull()
      `);
    },

    /** Switch units: force('kN','tonf','kgf','kip','lb','N'), length('m','cm','mm','in','ft') */
    units(forceId?: string, lengthId?: string) {
      if (forceId) activeForceId = forceId as ForceUnitId;
      if (lengthId) activeLengthId = lengthId as LengthUnitId;
      activeUnits = buildUnitSystem(activeForceId, activeLengthId);
      const fb = panel.querySelector("#cad3d-force-unit") as HTMLElement;
      const lb = panel.querySelector("#cad3d-length-unit") as HTMLElement;
      if (fb) fb.textContent = activeForceId;
      if (lb) lb.textContent = activeLengthId;
      if (activeGenerator) setGenerator(activeGenerator);
      console.log(`Unidades: ${activeUnits.label} | E=${activeUnits.E.toExponential(3)} ${activeUnits.stress}`);
      return activeUnits.id;
    },

    view(mode: string) { /* set by applyViewMode below */ },
    get mesh() { return mesh; },
  } as any;

  // ── Generator / load parameter definitions (driven by unit system) ──
  function GENERATOR_PARAMS() { return getGeneratorParams(activeUnits); }
  function LOAD_PARAMS() { return getLoadParams(activeUnits); }
  let loadParams: Record<string, { val: number; min: number; max: number; step: number; label: string }> = {};

  // ── Rebuild hekatan-ui Parameters Tweakpane with generator params ──
  function setGenerator(name: string) {
    activeGenerator = name;
    cadActive.val = true;
    supportType = 0; // reset to first support option for new generator
    // Stop modal animation when switching generators
    if (modalAnimId) stopModalAnimation();
    generatorParams = {};
    const defs = GENERATOR_PARAMS()[name];
    if (defs) for (const d of defs) generatorParams[d.key] = { val: d.val, min: d.min, max: d.max, step: d.step, label: d.label };
    loadParams = {};
    const ldefs = LOAD_PARAMS()[name];
    if (ldefs) for (const d of ldefs) loadParams[d.key] = { val: d.val, min: d.min, max: d.max, step: d.step, label: d.label };
    // Initialize individual span arrays for edificio
    if (name === "edificio") {
      const nvx = Math.round(generatorParams["nVanosX"]?.val ?? 2);
      const nvy = Math.round(generatorParams["nVanosY"]?.val ?? 2);
      edifSvx = Array(nvx).fill(activeUnits.defaultSpan);
      edifSvy = Array(nvy).fill(activeUnits.defaultSpan * 0.8);
      const np = Math.round(generatorParams["nPisos"]?.val ?? 3);
      const hp = generatorParams["hPiso"]?.val ?? 3.0;
      edifHpisos = Array(np).fill(hp);
      // No walls by default (aporticado puro). Use "Edif. Muros" for walls.
      // wallPlacements and slabEnabled are set per-example in cli.example().
    }
    rebuildTweakpane();
    // Reset view to 3D on example change, then regenerate geometry + run analysis
    setTimeout(() => {
      resetViewTo3D();
      regenerateFromParams();
    }, 50);
  }

  function gp(key: string): number { return generatorParams[key]?.val ?? loadParams[key]?.val ?? 0; }

  /** Generate geometry from current generatorParams (without resetting params) */
  function regenerateFromParams() {
    switch (activeGenerator) {
      case "truss": generateTruss(); break;
      case "beams": generateBeams(); break;
      case "3d": generate3d(); break;
      case "frame": {
        const nv = Math.round(gp("nVanos")), sv = gp("spanV");
        const np = Math.round(gp("nPisos")), hp = gp("hPiso");
        cli.frame(Array(nv).fill(sv), Array(np).fill(hp)); break;
      }
      case "edificio": {
        const lvix = gp("Lvix") || 0, lvdx = gp("Lvdx") || 0;
        const lviy = gp("Lviy") || 0, lvdy = gp("Lvdy") || 0;
        const nSubV = Math.max(1, Math.round(gp("nSubViga") || 3));
        const nSubC = Math.max(1, Math.round(gp("nSubCol") || 1));
        // Use individual floor heights if available, otherwise global hPiso
        const hp = gp("hPiso");
        const heights = edifHpisos.length > 0 ? [...edifHpisos] : Array(Math.round(gp("nPisos"))).fill(hp);
        cli.building([...edifSvx], [...edifSvy], heights, nSubV, lvix, lvdx, lviy, lvdy, nSubC); break;
      }
      case "galpon":
        cli.galpon(gp("span"), gp("length"), gp("height"), gp("archRise"), Math.round(gp("xDiv")), Math.round(gp("yDiv"))); break;
      case "barra": generateBarra(); break;
      case "placa-3q": generatePlate3Q(); break;
      case "placa-q4": generatePlateQ4(); break;
      case "losa-rect": generateRectSlab(); break;
      case "losa-plana": generateFlatSlab(); break;
      case "viga-alta": generateDeepBeam(); break;
      case "muro-contencion": generateRetainingWall(); break;
      case "zapata": generateFooting(); break;
      case "placa-orificios": generatePlateWithHoles(); break;
      case "col-placa": generateColumnBasePlate(); break;
      case "talud": generateSlope(); break;
      case "eiffel": generateEiffel(); break;
      case "arco": generateGatewayArch(); break;
      case "puente": generateBridge(); break;
      case "twisted": generateTwistedTower(); break;
      case "burj": generateBurjKhalifa(); break;
      case "opera": generateSydneyOpera(); break;
      case "diagrid": generateDiagrid(); break;
      case "muro-q4": generateShearWallQ4(); break;
      case "viga-q4": generateCantileverBeamQ4(); break;
      case "placa-xy": generatePlacaCantileverQ4(); break;
      case "pergola": generatePergola(); break;
    }
    // For generators that build their own loads (beams, 3d, truss, placa-q4), keep them.
    // For frame/edificio/galpon (use cli.frame/building/galpon), clear loads so runAnalysis creates them.
    if (activeGenerator === "frame" || activeGenerator === "edificio" || activeGenerator === "galpon") {
      if (mesh.nodeInputs) {
        const ni = mesh.nodeInputs.val;
        if (ni.supports) {
          mesh.nodeInputs.val = { supports: ni.supports };
        }
      }
    }
    // Re-run analysis after regeneration (skip for plate solvers — they run their own)
    const skipAnalysis = ["placa-q4", "placa-3q", "losa-rect", "losa-plana", "viga-alta", "muro-contencion", "zapata", "placa-orificios", "col-placa", "talud", "eiffel", "arco", "puente", "twisted", "burj", "opera", "diagrid", "muro-q4", "viga-q4", "placa-xy"];
    if (!skipAnalysis.includes(activeGenerator)) {
      // Apply element deletions + visibility
      if (deletedElements.size > 0 || hiddenElements.size > 0 || isolateMode) {
        const elems = mesh.elements.val;
        const filtered = elems.filter((_, i) => {
          if (deletedElements.has(i)) return false;
          if (hiddenElements.has(i)) return false;
          if (isolateMode && !isolatedElements.has(i)) return false;
          return true;
        });
        if (filtered.length !== elems.length) {
          mesh.elements.val = filtered;
        }
      }
      setTimeout(() => { setDefaultElementInputs(); runAnalysis(); }, 30);
    }
  }

  function generateTruss() {
    const span = gp("span"), div = Math.round(gp("divisions")), h = gp("height"), dx = span / div;
    const nodes: Node[] = []; const elements: Element[] = [];
    for (let i = 0; i <= div; i++) nodes.push([dx * i, 0, 0]);
    for (let i = 0; i <= div; i++) nodes.push([dx * i, 0, h]);
    const b = div + 1;
    for (let i = 0; i < div; i++) elements.push([i, i + 1]);
    for (let i = 0; i < div; i++) elements.push([b + i, b + i + 1]);
    for (let i = 0; i <= div; i++) elements.push([i, b + i]);
    for (let i = 0; i < div; i++) { if (i < div / 2) elements.push([i, b + i + 1]); else elements.push([b + i, i + 1]); }
    const supports = new Map<number, boolean[]>([[0, [true,true,true,true,true,true]], [Math.round(div), [true,true,true,true,true,true]]]);
    const fz = (gp("CM") ?? 0) + (gp("CV") ?? 0);
    const loads = new Map<number, number[]>();
    if (fz !== 0) { for (let i = 0; i <= div; i++) loads.set(i, [0, 0, fz, 0, 0, 0]); }
    mesh.nodes.val = nodes; mesh.elements.val = elements;
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads };
    updatePanel();
  }

  function generateBeams() {
    const w = gp("width"), h = gp("height");
    const fx = gp("Ex") ?? 0;
    const fz = (gp("CM") ?? 0) + (gp("CV") ?? 0);
    const nSub = Math.max(1, Math.round(gp("nSub") || 4));
    // Joint nodes: 0=base-left, 1=top-left, 2=top-right, 3=base-right
    const nodes: Node[] = [[0,0,0],[0,0,h],[w,0,h],[w,0,0]];
    const elements: Element[] = [];
    // Columns: [0,1] and [2,3] — no subdivision
    elements.push([0, 1], [2, 3]);
    // Beam [1,2] — subdivide for visible bending
    const p0: Node = [0,0,h], p1: Node = [w,0,h];
    let prev = 1;
    for (let k = 1; k < nSub; k++) {
      const t = k / nSub;
      const midIdx = nodes.length;
      nodes.push([p0[0]+(p1[0]-p0[0])*t, p0[1]+(p1[1]-p0[1])*t, p0[2]+(p1[2]-p0[2])*t]);
      elements.push([prev, midIdx]);
      prev = midIdx;
    }
    elements.push([prev, 2]);
    // Like 1d-mesh: ONE load entry only
    // Fx at node 2 (top-right), Fz distributed on beam nodes only when fz≠0
    const loads = new Map<number, number[]>();
    if (fx !== 0 && fz === 0) {
      // Pure Fx: one node only
      loads.set(2, [fx, 0, 0, 0, 0, 0]);
    } else if (fz !== 0 && fx === 0) {
      // Pure Fz: distributed on beam nodes (1, intermediates, 2)
      for (let i = 1; i < nodes.length; i++) {
        if (i === 0 || i === 3) continue;
        loads.set(i, [0, 0, fz, 0, 0, 0]);
      }
    } else if (fx !== 0 && fz !== 0) {
      // Combined: Fx at node 2, Fz on all beam nodes
      for (let i = 1; i < nodes.length; i++) {
        if (i === 0 || i === 3) continue;
        loads.set(i, [i === 2 ? fx : 0, 0, fz, 0, 0, 0]);
      }
    }
    mesh.nodes.val = nodes; mesh.elements.val = elements;
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports: new Map([[0,[true,true,true,true,true,true]],[3,[true,true,true,true,true,true]]]), loads };
    updatePanel();
  }

  function generate3d() {
    const dx = gp("dx"), dy = gp("dy"), dz = gp("dz"), stories = Math.round(gp("stories"));
    const nSub = Math.max(1, Math.round(gp("nSub") || 3));
    const jointNodes: Node[] = [];
    for (let i = 0; i <= stories; i++) jointNodes.push([0,0,dz*i],[dx,0,dz*i],[dx,dy,dz*i],[0,dy,dz*i]);
    const nJoint = jointNodes.length;
    const nodes: Node[] = [...jointNodes];
    const elements: Element[] = [];
    // Columns (vertical) — no subdivision
    for (let i = 0; i < stories; i++) for(let c=0;c<4;c++) elements.push([i*4+c,(i+1)*4+c]);
    // Diagonals — no subdivision
    for (let i = 0; i < stories; i++){const o=i*4;elements.push([o,o+5],[o+3,o+6],[o,o+7],[o+1,o+6]);}
    // Floor beams — subdivide for visible bending
    const floorBeams: Element[] = [];
    for (let i = 1; i <= stories; i++){const o=i*4;floorBeams.push([o,o+1],[o+1,o+2],[o+2,o+3],[o+3,o],[o,o+2]);}
    for (const [ni, nj] of floorBeams) {
      const p0 = jointNodes[ni], p1 = jointNodes[nj];
      let prev = ni;
      for (let k = 1; k < nSub; k++) {
        const t = k / nSub;
        const midIdx = nodes.length;
        nodes.push([p0[0]+(p1[0]-p0[0])*t, p0[1]+(p1[1]-p0[1])*t, p0[2]+(p1[2]-p0[2])*t]);
        elements.push([prev, midIdx]);
        prev = midIdx;
      }
      elements.push([prev, nj]);
    }
    const supports = new Map<number,boolean[]>(); for(let c=0;c<4;c++) supports.set(c,[true,true,true,true,true,true]);
    const fx = gp("Ex") ?? 0;
    const fz = (gp("CM") ?? 0) + (gp("CV") ?? 0);
    // Like 1d-mesh: minimal load entries
    const topNode = nJoint - 2;
    const loads = new Map<number, number[]>();
    if (fx !== 0 && fz === 0) {
      loads.set(topNode, [fx, 0, 0, 0, 0, 0]);
    } else if (fz !== 0 && fx === 0) {
      for (let i = 0; i < nodes.length; i++) {
        if (!supports.has(i)) loads.set(i, [0, 0, fz, 0, 0, 0]);
      }
    } else if (fx !== 0 && fz !== 0) {
      for (let i = 0; i < nodes.length; i++) {
        if (supports.has(i)) continue;
        loads.set(i, [i === topNode ? fx : 0, 0, fz, 0, 0, 0]);
      }
    }
    mesh.nodes.val = nodes; mesh.elements.val = elements;
    if(mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads };
    updatePanel();
  }

  function generateBarra() {
    const L = gp("L"), nElem = Math.round(gp("nElem")), F = gp("F");
    const dL = L / nElem;
    const nodes: Node[] = [];
    const elements: Element[] = [];
    for (let i = 0; i <= nElem; i++) nodes.push([dL * i, 0, 0]);
    for (let i = 0; i < nElem; i++) elements.push([i, i + 1]);
    const supports = new Map<number, boolean[]>([[0, [true, true, true, true, true, true]]]);
    const loads = new Map<number, number[]>([[nElem, [F, 0, 0, 0, 0, 0]]]);
    mesh.nodes.val = nodes;
    mesh.elements.val = elements;
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads };
    updatePanel();
  }

  function generatePlate3Q() {
    const Lx = gp("Lx") || 15, Ly = gp("Ly") || 10;
    const meshSize = gp("meshSize") || 0.5;
    const load = gp("q") || -3;
    const t = gp("t") || 1.0;
    const E = gp("E") || 30e6;
    const nu = gp("nu") || 0.3;
    const G = E / (2 * (1 + nu));
    const theory = plateTheory === 1 ? "Membrana" : plateTheory === 2 ? "Kirchhoff" : "Mindlin";

    const { nodes, elements, boundaryIndices } = getMesh({
      points: [[0, 0, 0], [Lx, 0, 0], [Lx, Ly, 0], [0, Ly, 0]],
      polygon: [0, 1, 2, 3],
      maxMeshSize: meshSize,
    });

    // Consistent nodal loads from uniform pressure q (kN/m²)
    // Each node receives q * tributary area / (number of contributing elements)
    // Simple approach: q * total_area / num_nodes (uniform distribution)
    const totalArea = Lx * Ly;
    const loadPerNode = load * totalArea / nodes.length;

    const supports = new Map(
      boundaryIndices.map((i: number) => [i, [true, true, true, true, true, true] as [boolean,boolean,boolean,boolean,boolean,boolean]])
    );
    const loads = new Map(
      nodes.map((_: any, i: number) => [i, [0, 0, loadPerNode, 0, 0, 0] as [number,number,number,number,number,number]])
    );

    mesh.nodes.val = nodes;
    mesh.elements.val = elements;
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads };

    // Shell element properties
    if (mesh.elementInputs) {
      mesh.elementInputs.val = {
        elasticities: new Map(elements.map((_: any, i: number) => [i, E])),
        elasticitiesOrthogonal: new Map(elements.map((_: any, i: number) => [i, E])),
        thicknesses: new Map(elements.map((_: any, i: number) => [i, t])),
        poissonsRatios: new Map(elements.map((_: any, i: number) => [i, nu])),
        shearModuli: new Map(elements.map((_: any, i: number) => [i, G])),
      };
    }

    // Run deform + analyze to get colored contours
    try {
      const dOut = deform(nodes, elements, mesh.nodeInputs!.val, mesh.elementInputs!.val);
      if (dOut && mesh.deformOutputs) mesh.deformOutputs.val = dOut;
      const aOut = analyze(nodes, elements, mesh.elementInputs!.val, dOut);
      if (aOut && mesh.analyzeOutputs) mesh.analyzeOutputs.val = aOut;
      console.log(`Plate 3Q [${theory}]: ${nodes.length} nodes, ${elements.length} triangles, t=${t}, E=${E}, ν=${nu}`);
    } catch (err: any) {
      console.warn("Plate 3Q analysis failed:", err.message);
    }
    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
  }

  function generatePlateQ4() {
    const Lx = gp("Lx") || 10, Ly = gp("Ly") || 10;
    const nx = Math.round(gp("nx") || 16), ny = Math.round(gp("ny") || 16);
    const t = gp("t") || 0.2, pressure = gp("q") || -10;
    const E = gp("E") || 30e6, nu = gp("nu") || 0.3;
    const bcStr = supportType === 1 ? "clamped" : "simply-supported";
    // Map UI theory (1=Membrana, 2=Kirchhoff, 3=Mindlin) → C++ (0=Mindlin, 1=Kirchhoff, 2=Membrane)
    const theoryMap: Record<number, number> = { 1: 2, 2: 1, 3: 0 };
    const theoryType = theoryMap[plateTheory] ?? 0;
    const result = cli.plateQ4(Lx, Ly, nx, ny, bcStr as any, pressure, t, E, nu, theoryType);
    // Disable normal runAnalysis — plateQ4 already solved
    return result;
  }

  /** Rectangular Slab (Calcpad example): SS on all edges, uniform load */
  function generateRectSlab() {
    const a = gp("a") || 6, b = gp("b") || 4;
    const nx = Math.round(gp("nx") || 12), ny = Math.round(gp("ny") || 8);
    const t = gp("t") || 0.1, q = gp("q") || -10;
    const E = gp("E") || 35e6, nu = gp("nu") || 0.15;
    const theoryMap: Record<number, number> = { 1: 2, 2: 1, 3: 0 };
    const theoryType = theoryMap[plateTheory] ?? 0;
    const result = cli.plateQ4(a, b, nx, ny, "simply-supported", q, t, E, nu, theoryType);
    // Navier analytical for comparison
    const D = E * t * t * t / (12 * (1 - nu * nu));
    let wNavier = 0;
    for (let m = 1; m <= 19; m += 2) {
      for (let n = 1; n <= 19; n += 2) {
        const mn = (m * m / (a * a) + n * n / (b * b));
        wNavier += 1 / (m * n * mn * mn);
      }
    }
    wNavier *= 16 * Math.abs(q) / (Math.PI ** 6 * D);
    console.log(`📐 Navier analítico w_center = ${wNavier.toExponential(6)}`);
    if (result) {
      const err = Math.abs((Math.abs(result.centerW || 0) - wNavier) / wNavier * 100);
      console.log(`   WASM w_center = ${(result.centerW || 0).toExponential(6)}, error = ${err.toFixed(2)}%`);
    }
    return result;
  }

  /** Flat Slab (Calcpad example): multi-span Q4 plate with spring supports at columns */
  function generateFlatSlab() {
    const t = gp("t") || 0.2, q = gp("q") || -10;
    const E = gp("E") || 35e6, nu = gp("nu") || 0.2;
    const elemSize = gp("meshSize") || 0.6;

    // Multi-span grid: a=[3.6, 4.2, 4.2, 3.6]m, b=[3.0, 3.6, 3.0]m
    const spansA = [3.6, 4.2, 4.2, 3.6];
    const spansB = [3.0, 3.6, 3.0];
    const La = spansA.reduce((s, v) => s + v, 0);
    const Lb = spansB.reduce((s, v) => s + v, 0);

    // Column positions at grid intersections
    const colX = [0]; for (const s of spansA) colX.push(colX[colX.length - 1] + s);
    const colY = [0]; for (const s of spansB) colY.push(colY[colY.length - 1] + s);

    // Generate Q4 rectangular mesh
    const nx = Math.max(2, Math.round(La / elemSize));
    const ny = Math.max(2, Math.round(Lb / elemSize));
    const dx = La / nx, dy = Lb / ny;
    const q4nodes: [number, number][] = [];
    for (let j = 0; j <= ny; j++) {
      for (let i = 0; i <= nx; i++) {
        q4nodes.push([i * dx, j * dy]);
      }
    }
    const q4elements: [number, number, number, number][] = [];
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const n0 = j * (nx + 1) + i;
        const n1 = n0 + 1;
        const n2 = n0 + (nx + 1) + 1;
        const n3 = n0 + (nx + 1);
        q4elements.push([n0, n1, n2, n3]);
      }
    }

    // Find nearest node to each column → spring support (w=0)
    const springs: Array<{ node: number; dof: number; k: number }> = [];
    const columnNodes = new Set<number>();
    for (const cx of colX) {
      for (const cy of colY) {
        let bestDist = Infinity, bestIdx = 0;
        for (let i = 0; i < q4nodes.length; i++) {
          const d = Math.hypot(q4nodes[i][0] - cx, q4nodes[i][1] - cy);
          if (d < bestDist) { bestDist = d; bestIdx = i; }
        }
        if (!columnNodes.has(bestIdx)) {
          columnNodes.add(bestIdx);
          springs.push({ node: bestIdx, dof: 0, k: 1e15 }); // w = 0 (vertical pin)
        }
      }
    }

    // Theory: Kirchhoff for thin slabs by default, respect UI selection
    const theoryMap: Record<number, number> = { 1: 2, 2: 1, 3: 0 };
    const theoryType = theoryMap[plateTheory] ?? 1; // default Kirchhoff

    console.log(`Losa Plana Q4 [${['Mindlin','Kirchhoff','Membrane'][theoryType]}]: ${La}×${Lb}m, ${nx}×${ny} elem, ${columnNodes.size} columnas`);
    const t0 = performance.now();

    // Use C++ auto-generated mesh + springs at columns (MITC4 element)
    const result = plateQ4Solve({
      E, nu, thickness: t,
      meshLx: La, meshLy: Lb, meshNx: nx, meshNy: ny,
      bcType: "none",
      pressure: q,
      theoryType,
      springs,
    });

    const dt = performance.now() - t0;
    console.log(`Solved in ${dt.toFixed(1)} ms, w_max = ${result.maxW.toExponential(4)}`);

    // Map to mesh format for visualization
    const nodes: Node[] = result.nodeResults.map(n => [n.x, n.y, 0]);
    const elements: Element[] = result.elementResults.map(e => [...e.nodes]);
    mesh.nodes.val = nodes;
    mesh.elements.val = elements;

    // Map displacements: w → dz, βx → rx, βy → ry
    const deformations = new Map<number, [number,number,number,number,number,number]>();
    result.nodeResults.forEach((n, i) => {
      deformations.set(i, [0, 0, n.w, n.bx, n.by, 0]);
    });
    if (mesh.deformOutputs) mesh.deformOutputs.val = { deformations };

    // Supports at column nodes
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (const ci of columnNodes) {
      supports.set(ci, [true, true, true, false, false, false]);
    }
    // Nodal loads from uniform pressure for visualization
    const flatLoads = new Map<number, [number,number,number,number,number,number]>();
    if (Math.abs(q) > 1e-30) {
      const loadPerNode = q * La * Lb / nodes.length;
      nodes.forEach((_: any, i: number) => { if (!supports.has(i)) flatLoads.set(i, [0, 0, loadPerNode, 0, 0, 0]); });
    }
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads: flatLoads };
    if (mesh.elementInputs) mesh.elementInputs.val = {};

    // Map bending results to analyzeOutputs for color contour rendering
    if (mesh.analyzeOutputs) {
      const bendingXX = new Map<number, [number, number, number]>();
      const bendingYY = new Map<number, [number, number, number]>();
      const bendingXY = new Map<number, [number, number, number]>();
      result.elementResults.forEach((e, i) => {
        bendingXX.set(i, [e.Mxx, e.Mxx, e.Mxx] as [number, number, number]);
        bendingYY.set(i, [e.Myy, e.Myy, e.Myy] as [number, number, number]);
        bendingXY.set(i, [e.Mxy, e.Mxy, e.Mxy] as [number, number, number]);
      });
      mesh.analyzeOutputs.val = { bendingXX, bendingYY, bendingXY };
    }

    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
  }

  /** Deep Beam (Calcpad example): plane stress membrane, triangular mesh */
  function generateDeepBeam() {
    const l = gp("L") || 4, h = gp("H") || 2;
    const t = gp("t") || 0.1;
    const E = gp("E") || 20e6, nu = gp("nu") || 0.2;
    const G = E / (2 * (1 + nu));
    const qLoad = gp("q") || -100; // kN/m on top edge
    const loadWidth = gp("b") || 0.8;
    const meshSize = gp("meshSize") || 0.2;

    // Mesh in XY plane for solver (shell solver only works in XY plane)
    const { nodes: meshNodes, elements, boundaryIndices } = getMesh({
      points: [[0, 0, 0], [l, 0, 0], [l, h, 0], [0, h, 0]],
      polygon: [0, 1, 2, 3],
      maxMeshSize: meshSize,
    });

    // Solver nodes: XY plane (Z=0) — required by shell solver
    const solverNodes: Node[] = meshNodes;

    // Supports: bottom edge (y=0) at x <= 0.4m and x >= l-0.4m
    const d = 0.4;
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (let i = 0; i < solverNodes.length; i++) {
      const x = solverNodes[i][0], y = solverNodes[i][1];
      if (Math.abs(y) < 1e-6) { // bottom edge
        if (x <= d + 1e-6 || x >= l - d - 1e-6) {
          supports.set(i, [true, true, true, true, true, true]);
        }
      }
    }

    // Loads: distributed on top edge (y=h) over center loadWidth
    const loadStart = (l - loadWidth) / 2;
    const loadEnd = loadStart + loadWidth;
    const topNodes: number[] = [];
    for (let i = 0; i < solverNodes.length; i++) {
      if (Math.abs(solverNodes[i][1] - h) < 1e-6) {
        const x = solverNodes[i][0];
        if (x >= loadStart - 1e-6 && x <= loadEnd + 1e-6) {
          topNodes.push(i);
        }
      }
    }
    const fPerNode = qLoad * loadWidth / Math.max(topNodes.length, 1);
    const loads = new Map<number, [number,number,number,number,number,number]>();
    for (const ni of topNodes) {
      loads.set(ni, [0, fPerNode, 0, 0, 0, 0]); // Fy = vertical load in XY plane
    }

    // Shell element properties (membrane behavior via shell elements)
    const elemInputs = {
      elasticities: new Map(elements.map((_: any, i: number) => [i, E])),
      elasticitiesOrthogonal: new Map(elements.map((_: any, i: number) => [i, E])),
      thicknesses: new Map(elements.map((_: any, i: number) => [i, t])),
      poissonsRatios: new Map(elements.map((_: any, i: number) => [i, nu])),
      shearModuli: new Map(elements.map((_: any, i: number) => [i, G])),
    };
    const nodeInputs = { supports, loads };

    // Run deform + analyze in XY plane
    try {
      const dOut = deform(solverNodes, elements, nodeInputs, elemInputs);
      const aOut = analyze(solverNodes, elements, elemInputs, dOut);

      // Remap to XZ for visualization: XY(x,y,0) → viewer(x,0,y) so beam stands vertical
      const viewNodes: Node[] = solverNodes.map(n => [n[0], 0, n[1]] as Node);
      mesh.nodes.val = viewNodes;
      mesh.elements.val = elements;

      // Remap deformations: solver (dx,dy,dz) → viewer (dx,dz,dy)
      if (dOut && dOut.deformations) {
        const viewDeforms = new Map<number, [number,number,number,number,number,number]>();
        dOut.deformations.forEach((def, idx) => {
          // XY→XZ: swap Y↔Z for displacements and rotations
          viewDeforms.set(idx, [def[0], def[2], def[1], def[3], def[5], def[4]]);
        });
        if (mesh.deformOutputs) mesh.deformOutputs.val = { deformations: viewDeforms };
      }

      if (mesh.nodeInputs) {
        const viewSupports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
        supports.forEach((s, idx) => viewSupports.set(idx, s));
        // Remap loads XY→XZ: Fy → Fz for visualization
        const viewLoads = new Map<number, [number,number,number,number,number,number]>();
        loads.forEach((f, idx) => viewLoads.set(idx, [f[0], f[2], f[1], f[3], f[5], f[4]]));
        if (mesh.nodeInputs) mesh.nodeInputs.val = { supports: viewSupports, loads: viewLoads };
      }
      if (mesh.elementInputs) mesh.elementInputs.val = {};

      // Membrane: no bending contours — clear analyzeOutputs
      if (mesh.analyzeOutputs) mesh.analyzeOutputs.val = {};

      let maxDisp = 0;
      if (dOut && dOut.deformations) {
        dOut.deformations.forEach((dd) => {
          const mag = Math.sqrt(dd[0]*dd[0] + dd[1]*dd[1] + dd[2]*dd[2]);
          maxDisp = Math.max(maxDisp, mag);
        });
      }
      console.log(`Viga Alta: ${solverNodes.length} nodos, ${elements.length} triangulos`);
      console.log(`  L=${l}, H=${h}, t=${t}, E=${E}, nu=${nu}`);
      console.log(`  Carga: q=${qLoad} kN/m sobre ${loadWidth}m central`);
      console.log(`  max|u| = ${maxDisp.toExponential(4)}`);
    } catch (err: any) {
      console.warn("Viga Alta analysis failed:", err.message);
    }
    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
  }

  /** Retaining Wall: L-shape cantilever wall with triangular earth pressure */
  function generateRetainingWall() {
    const H = gp("H") || 4, B = gp("B") || 3;
    const tw = gp("tw") || 0.3, tb = gp("tb") || 0.4;
    const meshSize = gp("meshSize") || 0.2;
    const E = gp("E") || 25e6, nu = gp("nu") || 0.2;
    const G = E / (2 * (1 + nu));
    const gamma = gp("gamma") || 18; // soil unit weight
    const Ka = gp("Ka") || 0.33; // active earth pressure coefficient
    const Es = gp("Es") || 50000; // soil elastic modulus
    const nus = gp("nus") || 0.3; // soil Poisson's ratio
    const Gs = Es / (2 * (1 + nus));
    const kn_interface = gp("kn") || 1e6; // interface normal stiffness (Goodman element)
    const ks_interface = gp("ks") || 1e4; // interface tangential stiffness (Goodman element)
    const gammaW = gp("gammaW") || 9.81; // water unit weight
    const Hw = gp("Hw") || 3.5; // water level height
    const qs = gp("qs") || 0; // surcharge load on soil surface (kPa) → lateral = Ka * qs

    const mode = supportType; // 0=Rankine, 1=Suelo continuo, 2=Interfaz, 3=Presion agua

    // L-shape wall geometry (XY plane for solver):
    const toeLen = B * 0.3;
    const heelLen = B * 0.7;

    // ── Helper: build wall-only L-shape polygon points ──
    const wallPts: [number,number,number][] = [
      [-toeLen, 0, 0],           // 0: base left
      [heelLen, 0, 0],           // 1: base right
      [heelLen, tb, 0],          // 2: base right top
      [tw, tb, 0],               // 3: stem-base right junction
      [tw, tb + H, 0],           // 4: stem top right
      [0, tb + H, 0],            // 5: stem top left
      [0, tb, 0],                // 6: stem-base left junction
      [-toeLen, tb, 0],          // 7: base left top
    ];

    let solverNodes: Node[] = [];
    let elements: Element[] = [];
    let supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    let loads = new Map<number, [number,number,number,number,number,number]>();
    let elemInputs: any;

    if (mode === 0) {
      // ══════════════════════════════════════════════════════════════
      // MODE 0: RANKINE (Ka) — Earth pressure as external loads
      // ══════════════════════════════════════════════════════════════
      const meshResult = getMesh({
        points: wallPts,
        polygon: [0, 1, 2, 3, 4, 5, 6, 7],
        maxMeshSize: meshSize,
      });
      solverNodes = meshResult.nodes;
      elements = meshResult.elements;

      // Fix bottom edge (y=0)
      for (let i = 0; i < solverNodes.length; i++) {
        if (Math.abs(solverNodes[i][1]) < 1e-6) {
          supports.set(i, [true, true, true, true, true, true]);
        }
      }

      // Triangular earth pressure on stem back face (x≈tw, y from tb to tb+H)
      const stemNodes: { idx: number; y: number }[] = [];
      for (let i = 0; i < solverNodes.length; i++) {
        const x = solverNodes[i][0], y = solverNodes[i][1];
        if (Math.abs(x - tw) < meshSize * 0.6 && y >= tb - 1e-6) {
          stemNodes.push({ idx: i, y });
        }
      }
      stemNodes.sort((a, b) => a.y - b.y);
      for (let k = 0; k < stemNodes.length; k++) {
        const { idx, y } = stemNodes[k];
        const depth = (tb + H) - y;
        const p = Ka * gamma * depth + Ka * qs; // earth pressure + surcharge
        let tribH = meshSize;
        if (k > 0 && k < stemNodes.length - 1) {
          tribH = (stemNodes[k+1].y - stemNodes[k-1].y) / 2;
        } else if (k === 0 && stemNodes.length > 1) {
          tribH = (stemNodes[1].y - stemNodes[0].y) / 2;
        } else if (k === stemNodes.length - 1 && stemNodes.length > 1) {
          tribH = (stemNodes[k].y - stemNodes[k-1].y) / 2;
        }
        const fx = p * tribH;
        if (Math.abs(fx) > 1e-10) {
          loads.set(idx, [fx, 0, 0, 0, 0, 0]);
        }
      }

      elemInputs = {
        elasticities: new Map(elements.map((_: any, i: number) => [i, E])),
        elasticitiesOrthogonal: new Map(elements.map((_: any, i: number) => [i, E])),
        thicknesses: new Map(elements.map((_: any, i: number) => [i, tw])),
        poissonsRatios: new Map(elements.map((_: any, i: number) => [i, nu])),
        shearModuli: new Map(elements.map((_: any, i: number) => [i, G])),
      };

    } else if (mode === 1 || mode === 2) {
      // ══════════════════════════════════════════════════════════════
      // MODE 1: SUELO CONTINUO — Combined soil+wall mesh, gravity
      // MODE 2: INTERFAZ — Same but with thin weak strip between soil and wall
      // ══════════════════════════════════════════════════════════════

      // Combined geometry: Wall L-shape + Soil mass behind the wall
      // Soil fills: from x=tw to x=tw+heelLen-tw, y=tb to y=tb+H (behind stem)
      //             plus soil under heel: from x=tw to x=heelLen, y=0 to y=tb
      // Simplification: rectangular soil block from x=tw to x=heelLen, y=0 to y=tb+H

      const soilRight = heelLen; // soil extends to right edge of base
      const soilTop = tb + H;    // soil height = same as wall top

      if (mode === 2) {
        // ══════════════════════════════════════════════════════════════
        // INTERFAZ: Goodman zero-thickness interface elements (1968)
        // 1. Create combined mesh (wall L + soil rectangle) — same as mode 1
        // 2. Identify interface nodes at x ≈ tw, y > tb
        // 3. Duplicate those nodes (same position)
        // 4. Reassign soil-side triangles to use duplicate nodes
        // 5. Create 4-node interface elements between originals and duplicates
        // ══════════════════════════════════════════════════════════════

        // Combined polygon: same as mode 1 (suelo continuo)
        const combinedPts: [number,number,number][] = [
          [-toeLen, 0, 0],         // 0
          [soilRight, 0, 0],       // 1
          [soilRight, soilTop, 0], // 2
          [tw, soilTop, 0],        // 3 (stem top right = soil top left)
          [0, soilTop, 0],         // 4 (stem top left)
          [0, tb, 0],              // 5 (stem-base left junction)
          [-toeLen, tb, 0],        // 6 (base left top)
        ];
        // Add constraint points along the interface line (x=tw, y from tb to soilTop)
        // This forces the mesh to place nodes along the interface boundary
        const nInterfaceSteps = Math.max(3, Math.ceil((soilTop - tb) / meshSize));
        const constraintPts: [number,number,number][] = [];
        for (let i = 0; i <= nInterfaceSteps; i++) {
          constraintPts.push([tw, tb + i * (soilTop - tb) / nInterfaceSteps, 0]);
        }

        const meshResult = getMesh({
          points: [...combinedPts, ...constraintPts],
          polygon: [0, 1, 2, 3, 4, 5, 6],
          maxMeshSize: meshSize,
        });
        solverNodes = meshResult.nodes;
        elements = meshResult.elements;

        // --- Step 1: Find interface nodes at x ≈ tw, y ≥ tb ---
        const tol = meshSize * 0.4;
        const interfaceNodeIndices: number[] = [];
        for (let i = 0; i < solverNodes.length; i++) {
          const x = solverNodes[i][0], y = solverNodes[i][1];
          if (Math.abs(x - tw) < tol && y >= tb - tol) {
            interfaceNodeIndices.push(i);
          }
        }
        // Sort by y ascending and remove duplicates (nodes at same y position)
        interfaceNodeIndices.sort((a, b) => solverNodes[a][1] - solverNodes[b][1]);
        // Filter out nodes that are too close to the previous one (duplicate y)
        const filteredInterface: number[] = [interfaceNodeIndices[0]];
        for (let i = 1; i < interfaceNodeIndices.length; i++) {
          const dy = solverNodes[interfaceNodeIndices[i]][1] - solverNodes[filteredInterface[filteredInterface.length - 1]][1];
          if (Math.abs(dy) > meshSize * 0.05) {
            filteredInterface.push(interfaceNodeIndices[i]);
          }
        }
        interfaceNodeIndices.length = 0;
        interfaceNodeIndices.push(...filteredInterface);

        // --- Step 2: Duplicate interface nodes for soil side ---
        const originalToDuplicate = new Map<number, number>();
        for (const origIdx of interfaceNodeIndices) {
          const newIdx = solverNodes.length;
          solverNodes.push([solverNodes[origIdx][0], solverNodes[origIdx][1], solverNodes[origIdx][2]] as Node);
          originalToDuplicate.set(origIdx, newIdx);
        }

        // --- Step 3: Classify triangles and reassign soil-side interface nodes ---
        const numTriangles = elements.length;
        const elemIsSoil: boolean[] = [];
        for (let i = 0; i < numTriangles; i++) {
          const el = elements[i];
          const cx = (solverNodes[el[0]][0] + solverNodes[el[1]][0] + solverNodes[el[2]][0]) / 3;
          const cy = (solverNodes[el[0]][1] + solverNodes[el[1]][1] + solverNodes[el[2]][1]) / 3;
          // Wall L-shape: base slab OR stem
          const inBase = cx >= -toeLen && cx <= heelLen && cy >= 0 && cy <= tb;
          const inStem = cx >= 0 && cx <= tw && cy >= tb && cy <= tb + H;
          const isWall = inBase || inStem;
          elemIsSoil.push(!isWall);

          // Reassign soil-side triangles: replace original interface nodes with duplicates
          if (!isWall) {
            for (let j = 0; j < el.length; j++) {
              const dup = originalToDuplicate.get(el[j]);
              if (dup !== undefined) {
                el[j] = dup;
              }
            }
          }
        }

        // --- Step 4: Create 4-node Goodman interface elements ---
        // For each consecutive pair of interface nodes (sorted by y):
        //   node0 = wall side (higher y), node1 = wall side (lower y)
        //   node2 = soil side (lower y),  node3 = soil side (higher y)
        // Tangent from node0→node1 points DOWN → normal CCW 90° points RIGHT (+x, into soil) ✓
        const interfaceStartIdx = elements.length;
        for (let k = 0; k < interfaceNodeIndices.length - 1; k++) {
          const wallLow = interfaceNodeIndices[k];      // lower y
          const wallHigh = interfaceNodeIndices[k + 1];  // higher y
          const soilLow = originalToDuplicate.get(wallLow)!;
          const soilHigh = originalToDuplicate.get(wallHigh)!;
          // node0=wallHigh, node1=wallLow → tangent DOWN → normal RIGHT
          elements.push([wallHigh, wallLow, soilLow, soilHigh]);
        }
        const numInterfaceElems = elements.length - interfaceStartIdx;

        // --- Step 5: Set material properties ---
        const elasMap = new Map<number, number>();
        const elasOrthoMap = new Map<number, number>();
        const thickMap = new Map<number, number>();
        const poissonMap = new Map<number, number>();
        const shearMap = new Map<number, number>();

        for (let i = 0; i < numTriangles; i++) {
          if (elemIsSoil[i]) {
            elasMap.set(i, Es); elasOrthoMap.set(i, Es);
            poissonMap.set(i, nus); shearMap.set(i, Gs); thickMap.set(i, 1.0);
          } else {
            elasMap.set(i, E); elasOrthoMap.set(i, E);
            poissonMap.set(i, nu); shearMap.set(i, G); thickMap.set(i, 1.0);
          }
        }

        // Interface elements: elasticities → kn, shearModuli → ks
        for (let i = interfaceStartIdx; i < elements.length; i++) {
          elasMap.set(i, kn_interface);
          elasOrthoMap.set(i, 0);
          poissonMap.set(i, 0);
          shearMap.set(i, ks_interface);
          thickMap.set(i, 0);
        }

        elemInputs = {
          elasticities: elasMap,
          elasticitiesOrthogonal: elasOrthoMap,
          thicknesses: thickMap,
          poissonsRatios: poissonMap,
          shearModuli: shearMap,
        };

        // Supports: fix bottom (y=0) and roller on right edge (x≈soilRight)
        for (let i = 0; i < solverNodes.length; i++) {
          const x = solverNodes[i][0], y = solverNodes[i][1];
          if (Math.abs(y) < 1e-6) {
            supports.set(i, [true, true, true, true, true, true]);
          } else if (Math.abs(x - soilRight) < meshSize * 0.1) {
            supports.set(i, [true, false, true, true, true, true]);
          }
        }

        // Gravity on soil elements
        for (let i = 0; i < numTriangles; i++) {
          if (!elemIsSoil[i]) continue;
          const el = elements[i];
          const n0 = solverNodes[el[0]], n1 = solverNodes[el[1]], n2 = solverNodes[el[2]];
          const area = Math.abs((n1[0]-n0[0])*(n2[1]-n0[1]) - (n2[0]-n0[0])*(n1[1]-n0[1])) / 2;
          const fNode = -gamma * area / 3;
          for (const ni of el) {
            const prev = loads.get(ni) || [0,0,0,0,0,0] as [number,number,number,number,number,number];
            prev[1] += fNode;
            loads.set(ni, prev);
          }
        }

        // Surcharge on soil surface (top, y ≈ soilTop, x > tw)
        if (qs > 0) {
          const surfNodes: { idx: number; x: number }[] = [];
          for (let i = 0; i < solverNodes.length; i++) {
            const x = solverNodes[i][0], y = solverNodes[i][1];
            if (Math.abs(y - soilTop) < meshSize * 0.1 && x > tw - 1e-6) {
              surfNodes.push({ idx: i, x });
            }
          }
          surfNodes.sort((a, b) => a.x - b.x);
          for (let k = 0; k < surfNodes.length; k++) {
            let tribW = meshSize;
            if (k > 0 && k < surfNodes.length - 1) {
              tribW = (surfNodes[k+1].x - surfNodes[k-1].x) / 2;
            } else if (k === 0 && surfNodes.length > 1) {
              tribW = (surfNodes[1].x - surfNodes[0].x) / 2;
            } else if (k === surfNodes.length - 1 && surfNodes.length > 1) {
              tribW = (surfNodes[k].x - surfNodes[k-1].x) / 2;
            }
            const fy = -qs * tribW;
            const prev = loads.get(surfNodes[k].idx) || [0,0,0,0,0,0] as [number,number,number,number,number,number];
            prev[1] += fy;
            loads.set(surfNodes[k].idx, prev);
          }
        }

        console.log(`  Interfaz Goodman: ${interfaceNodeIndices.length} nodos interfaz, ${numInterfaceElems} elem interfaz, kn=${kn_interface}, ks=${ks_interface}`);

      } else {
        // ── SUELO CONTINUO: Wall + soil as one continuous mesh ──

        // Combined polygon: L-shape wall on left + soil rectangle on right, sharing edge at x=tw
        // Full polygon enclosing everything:
        // Bottom: -toeLen,0 → soilRight,0 → soilRight,soilTop → tw,soilTop → tw,tb+H
        // Then wall top: 0,tb+H → 0,tb → -toeLen,tb → -toeLen,0
        const combinedPts: [number,number,number][] = [
          [-toeLen, 0, 0],         // 0
          [soilRight, 0, 0],       // 1
          [soilRight, soilTop, 0], // 2
          [tw, soilTop, 0],        // 3 (= stem top right = soil top left)
          [0, soilTop, 0],         // 4 (= stem top left)
          [0, tb, 0],              // 5 (= stem-base left junction)
          [-toeLen, tb, 0],        // 6 (= base left top)
        ];

        // Add internal constraint points for the wall-soil interface
        // Segment markers at x=tw from y=tb to y=soilTop (shared edge)
        const constraintPts: [number,number,number][] = [
          [tw, tb, 0],  // wall-soil junction at base top
        ];

        const meshResult = getMesh({
          points: [...combinedPts, ...constraintPts],
          polygon: [0, 1, 2, 3, 4, 5, 6],
          maxMeshSize: meshSize,
        });
        solverNodes = meshResult.nodes;
        elements = meshResult.elements;

        // Classify elements: concrete (centroid in wall L-shape) vs soil (centroid in soil zone)
        const isWallElem = (el: number[]) => {
          const cx = (solverNodes[el[0]][0] + solverNodes[el[1]][0] + solverNodes[el[2]][0]) / 3;
          const cy = (solverNodes[el[0]][1] + solverNodes[el[1]][1] + solverNodes[el[2]][1]) / 3;
          // Wall L-shape: base slab (-toeLen to heelLen, 0 to tb) + stem (0 to tw, tb to tb+H)
          const inBase = cx >= -toeLen && cx <= heelLen && cy >= 0 && cy <= tb;
          const inStem = cx >= 0 && cx <= tw && cy >= tb && cy <= tb + H;
          return inBase || inStem;
        };

        const elasMap = new Map<number, number>();
        const elasOrthoMap = new Map<number, number>();
        const thickMap = new Map<number, number>();
        const poissonMap = new Map<number, number>();
        const shearMap = new Map<number, number>();
        const elemIsSoil: boolean[] = [];

        for (let i = 0; i < elements.length; i++) {
          const wall = isWallElem(elements[i]);
          elemIsSoil.push(!wall);
          if (wall) {
            elasMap.set(i, E); elasOrthoMap.set(i, E);
            poissonMap.set(i, nu); shearMap.set(i, G); thickMap.set(i, 1.0);
          } else {
            elasMap.set(i, Es); elasOrthoMap.set(i, Es);
            poissonMap.set(i, nus); shearMap.set(i, Gs); thickMap.set(i, 1.0);
          }
        }

        elemInputs = {
          elasticities: elasMap,
          elasticitiesOrthogonal: elasOrthoMap,
          thicknesses: thickMap,
          poissonsRatios: poissonMap,
          shearModuli: shearMap,
        };

        // Supports: fix bottom (y=0) and right boundary (x=soilRight, roller)
        for (let i = 0; i < solverNodes.length; i++) {
          const x = solverNodes[i][0], y = solverNodes[i][1];
          if (Math.abs(y) < 1e-6) {
            supports.set(i, [true, true, true, true, true, true]);
          } else if (Math.abs(x - soilRight) < meshSize * 0.1) {
            supports.set(i, [true, false, true, true, true, true]);
          }
        }

        // Gravity on soil elements only
        for (let i = 0; i < elements.length; i++) {
          if (!elemIsSoil[i]) continue;
          const el = elements[i];
          const n0 = solverNodes[el[0]], n1 = solverNodes[el[1]], n2 = solverNodes[el[2]];
          const area = Math.abs((n1[0]-n0[0])*(n2[1]-n0[1]) - (n2[0]-n0[0])*(n1[1]-n0[1])) / 2;
          const fNode = -gamma * area / 3;
          for (const ni of el) {
            const prev = loads.get(ni) || [0,0,0,0,0,0] as [number,number,number,number,number,number];
            prev[1] += fNode;
            loads.set(ni, prev);
          }
        }

        // Surcharge on soil surface (top edge, y ≈ soilTop, x > tw)
        if (qs > 0) {
          const surfNodes: { idx: number; x: number }[] = [];
          for (let i = 0; i < solverNodes.length; i++) {
            const x = solverNodes[i][0], y = solverNodes[i][1];
            if (Math.abs(y - soilTop) < meshSize * 0.1 && x > tw - 1e-6) {
              surfNodes.push({ idx: i, x });
            }
          }
          surfNodes.sort((a, b) => a.x - b.x);
          for (let k = 0; k < surfNodes.length; k++) {
            let tribW = meshSize;
            if (k > 0 && k < surfNodes.length - 1) {
              tribW = (surfNodes[k+1].x - surfNodes[k-1].x) / 2;
            } else if (k === 0 && surfNodes.length > 1) {
              tribW = (surfNodes[1].x - surfNodes[0].x) / 2;
            } else if (k === surfNodes.length - 1 && surfNodes.length > 1) {
              tribW = (surfNodes[k].x - surfNodes[k-1].x) / 2;
            }
            const fy = -qs * tribW; // downward surcharge force
            const prev = loads.get(surfNodes[k].idx) || [0,0,0,0,0,0] as [number,number,number,number,number,number];
            prev[1] += fy;
            loads.set(surfNodes[k].idx, prev);
          }
        }
      }
    }

    if (mode === 3) {
      // ══════════════════════════════════════════════════════════════
      // MODE 3: PRESION AGUA — Hydrostatic pressure on wall face
      // p(y) = gammaW * (Hw_eff - (y - yBase)), triangular from water level down
      // Models a retaining wall / sheet pile with water on one side
      // ══════════════════════════════════════════════════════════════
      const meshResult = getMesh({
        points: wallPts,
        polygon: [0, 1, 2, 3, 4, 5, 6, 7],
        maxMeshSize: meshSize,
      });
      solverNodes = meshResult.nodes;
      elements = meshResult.elements;

      // Fix bottom edge (y=0)
      for (let i = 0; i < solverNodes.length; i++) {
        if (Math.abs(solverNodes[i][1]) < 1e-6) {
          supports.set(i, [true, true, true, true, true, true]);
        }
      }

      // Hydrostatic pressure on stem back face (x≈tw)
      // Water level: from y = (tb + H - Hw) to y = (tb + H), limited by wall geometry
      const yWaterTop = tb + H; // water surface at top of wall (or below)
      const Hw_eff = Math.min(Hw, H); // effective water height, limited by wall height
      const yWaterBottom = yWaterTop - Hw_eff; // bottom of water column

      const stemNodes: { idx: number; y: number }[] = [];
      for (let i = 0; i < solverNodes.length; i++) {
        const x = solverNodes[i][0], y = solverNodes[i][1];
        if (Math.abs(x - tw) < meshSize * 0.6 && y >= tb - 1e-6) {
          stemNodes.push({ idx: i, y });
        }
      }
      stemNodes.sort((a, b) => a.y - b.y);

      for (let k = 0; k < stemNodes.length; k++) {
        const { idx, y } = stemNodes[k];
        // Water depth at this point
        const waterDepth = Math.max(0, yWaterTop - y);
        if (waterDepth <= 0 || y < yWaterBottom - 1e-6) continue; // above water level or below water zone
        const effectiveDepth = Math.min(waterDepth, Hw_eff);
        const p = gammaW * effectiveDepth; // hydrostatic pressure

        // Tributary height
        let tribH = meshSize;
        if (k > 0 && k < stemNodes.length - 1) {
          tribH = (stemNodes[k+1].y - stemNodes[k-1].y) / 2;
        } else if (k === 0 && stemNodes.length > 1) {
          tribH = (stemNodes[1].y - stemNodes[0].y) / 2;
        } else if (k === stemNodes.length - 1 && stemNodes.length > 1) {
          tribH = (stemNodes[k].y - stemNodes[k-1].y) / 2;
        }
        const fx = p * tribH; // horizontal force from water
        if (Math.abs(fx) > 1e-10) {
          loads.set(idx, [fx, 0, 0, 0, 0, 0]);
        }
      }

      elemInputs = {
        elasticities: new Map(elements.map((_: any, i: number) => [i, E])),
        elasticitiesOrthogonal: new Map(elements.map((_: any, i: number) => [i, E])),
        thicknesses: new Map(elements.map((_: any, i: number) => [i, tw])),
        poissonsRatios: new Map(elements.map((_: any, i: number) => [i, nu])),
        shearModuli: new Map(elements.map((_: any, i: number) => [i, G])),
      };
    }

    const nodeInputs = { supports, loads };
    const modeLabels = ["Rankine (Ka)", "Suelo continuo", "Interfaz", "Presion agua"];

    try {
      const dOut = deform(solverNodes, elements, nodeInputs, elemInputs);

      // For analyze, only pass triangle elements (3 nodes) — interface elements (4 nodes) not supported
      const triElements = elements.filter(e => e.length === 3);
      // Build element inputs for triangles only (re-index)
      const triElemInputs: any = {};
      for (const key of Object.keys(elemInputs)) {
        const origMap = (elemInputs as any)[key] as Map<number, any>;
        if (origMap && origMap instanceof Map) {
          const newMap = new Map<number, any>();
          let newIdx = 0;
          for (let i = 0; i < elements.length; i++) {
            if (elements[i].length === 3) {
              if (origMap.has(i)) newMap.set(newIdx, origMap.get(i));
              newIdx++;
            }
          }
          triElemInputs[key] = newMap;
        }
      }
      const aOut = analyze(solverNodes, triElements, triElemInputs, dOut);

      // Remap XY→XZ for vertical display
      const viewNodes: Node[] = solverNodes.map(n => [n[0], 0, n[1]] as Node);
      mesh.nodes.val = viewNodes;
      // Only show triangle elements in viewer (interface elements are invisible)
      mesh.elements.val = triElements;

      if (dOut && dOut.deformations) {
        const viewDeforms = new Map<number, [number,number,number,number,number,number]>();
        dOut.deformations.forEach((def, idx) => {
          viewDeforms.set(idx, [def[0], def[2], def[1], def[3], def[5], def[4]]);
        });
        if (mesh.deformOutputs) mesh.deformOutputs.val = { deformations: viewDeforms };
      }

      const viewSupports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
      supports.forEach((s, idx) => viewSupports.set(idx, s));
      // Remap loads XY→XZ for visualization
      const viewLoads = new Map<number, [number,number,number,number,number,number]>();
      loads.forEach((f, idx) => viewLoads.set(idx, [f[0], f[2], f[1], f[3], f[5], f[4]]));
      if (mesh.nodeInputs) mesh.nodeInputs.val = { supports: viewSupports, loads: viewLoads };
      if (mesh.elementInputs) mesh.elementInputs.val = {};
      if (mesh.analyzeOutputs) mesh.analyzeOutputs.val = {};

      let maxDisp = 0;
      if (dOut && dOut.deformations) {
        dOut.deformations.forEach((dd) => {
          const mag = Math.sqrt(dd[0]*dd[0] + dd[1]*dd[1] + dd[2]*dd[2]);
          maxDisp = Math.max(maxDisp, mag);
        });
      }
      console.log(`Muro Contencion [${modeLabels[mode]}]: ${solverNodes.length} nodos, ${elements.length} triangulos`);
      console.log(`  H=${H}, B=${B}, tw=${tw}, tb=${tb}, Ka=${Ka}, gamma=${gamma}, qs=${qs}`);
      if (mode === 1) console.log(`  Es=${Es}, nus=${nus}`);
      if (mode === 2) console.log(`  Es=${Es}, nus=${nus}, kn=${kn_interface}, ks=${ks_interface}`);
      if (mode === 3) console.log(`  gammaW=${gammaW}, Hw=${Hw}`);
      console.log(`  max|u| = ${maxDisp.toExponential(4)}`);
    } catch (err: any) {
      console.warn("Muro Contencion failed:", err.message);
    }
    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
  }

  /** Footing: Q4 plate on Winkler springs with column load */
  function generateFooting() {
    const Lx = gp("Lx") || 2, Ly = gp("Ly") || 2;
    const t = gp("t") || 0.5;
    const colA = gp("colA") || 0.40;
    const colH = gp("colH") || 1.5;
    const nx = Math.round(gp("nx") || 8), ny = Math.round(gp("ny") || 8);
    const E = gp("E") || 25e6, nu = gp("nu") || 0.2;
    const G = E / (2 * (1 + nu));
    const P = gp("P") || -500;
    const Mx = gp("Mx") || 0;
    const My = gp("My") || 0;
    const ks_soil = gp("ks") || 20000;

    const dx = Lx / nx, dy = Ly / ny;
    const cx = Lx / 2, cy = Ly / 2;
    const colHalf = colA / 2;

    // ══════════════════════════════════════════════════════════════
    // Zapata: plateQ4Solve for slab analysis + pedestal visual
    // Uses proper Winkler springs + column load + Mx + My
    // ══════════════════════════════════════════════════════════════

    // ── Winkler springs at every node ──
    const springs: Array<{ node: number; dof: number; k: number }> = [];
    for (let j = 0; j <= ny; j++) {
      for (let i = 0; i <= nx; i++) {
        const nodeIdx = j * (nx + 1) + i;
        let ax = dx, ay = dy;
        if (i === 0 || i === nx) ax = dx / 2;
        if (j === 0 || j === ny) ay = dy / 2;
        springs.push({ node: nodeIdx, dof: 0, k: ks_soil * ax * ay });
      }
    }

    // ── Column load P distributed over column-zone nodes ──
    let colNodeCount = 0;
    for (let j = 0; j <= ny; j++) {
      for (let i = 0; i <= nx; i++) {
        if (Math.abs(i*dx - cx) <= colHalf + 1e-6 && Math.abs(j*dy - cy) <= colHalf + 1e-6) colNodeCount++;
      }
    }
    const fPerNode = P / Math.max(colNodeCount, 1);

    const pointLoads: Array<{ node: number; dof: number; value: number }> = [];
    for (let j = 0; j <= ny; j++) {
      for (let i = 0; i <= nx; i++) {
        const x = i * dx, y = j * dy;
        if (Math.abs(x - cx) <= colHalf + 1e-6 && Math.abs(y - cy) <= colHalf + 1e-6) {
          pointLoads.push({ node: j*(nx+1)+i, dof: 0, value: fPerNode });
        }
      }
    }

    // ── Moments Mx, My as equivalent couple forces ──
    // Mx (around X axis) → vertical force couple in Y direction
    // My (around Y axis) → vertical force couple in X direction
    if (Math.abs(Mx) > 1e-6) {
      // Mx = couple force × arm → F = Mx / (Ly/2)
      // Apply +F at top-center, -F at bottom-center of column zone
      const arm_y = colHalf > 1e-6 ? colHalf : dy;
      const Fcouple = Mx / arm_y;
      for (let j = 0; j <= ny; j++) {
        for (let i = 0; i <= nx; i++) {
          const x = i * dx, y = j * dy;
          if (Math.abs(x - cx) <= colHalf + 1e-6 && Math.abs(y - cy) <= colHalf + 1e-6) {
            const dy_from_center = y - cy;
            if (Math.abs(dy_from_center) > 1e-6) {
              const sign = dy_from_center > 0 ? 1 : -1;
              pointLoads.push({ node: j*(nx+1)+i, dof: 0, value: sign * Fcouple / colNodeCount * 2 });
            }
          }
        }
      }
    }
    if (Math.abs(My) > 1e-6) {
      const arm_x = colHalf > 1e-6 ? colHalf : dx;
      const Fcouple = My / arm_x;
      for (let j = 0; j <= ny; j++) {
        for (let i = 0; i <= nx; i++) {
          const x = i * dx, y = j * dy;
          if (Math.abs(x - cx) <= colHalf + 1e-6 && Math.abs(y - cy) <= colHalf + 1e-6) {
            const dx_from_center = x - cx;
            if (Math.abs(dx_from_center) > 1e-6) {
              const sign = dx_from_center > 0 ? 1 : -1;
              pointLoads.push({ node: j*(nx+1)+i, dof: 0, value: sign * Fcouple / colNodeCount * 2 });
            }
          }
        }
      }
    }

    // ── Solve with plateQ4Solve (Mindlin plate with Winkler springs) ──
    const theoryMap: Record<number, number> = { 1: 2, 2: 1, 3: 0 };
    const theoryType = theoryMap[plateTheory] ?? 1;

    console.log(`Zapata: ${Lx}x${Ly}m, t=${t}m, ${nx}x${ny} elem`);
    console.log(`  col=${colA}m, P=${P}, Mx=${Mx}, My=${My}, ks=${ks_soil}`);

    try {
      const result = plateQ4Solve({
        E, nu, thickness: t,
        meshLx: Lx, meshLy: Ly, meshNx: nx, meshNy: ny,
        bcType: "none",
        pressure: 0,
        theoryType,
        springs,
        pointLoads,
      });

      console.log(`  Solved: w_max = ${result.maxW.toExponential(4)}`);

      // ── Build view nodes: slab at Z=0 + pedestal column ──
      const viewNodes: Node[] = result.nodeResults.map(n => [n.x, n.y, 0]);

      // Add pedestal column nodes (4 corners at base + 4 at top)
      const pedBaseIdx = viewNodes.length;
      viewNodes.push([cx - colHalf, cy - colHalf, 0]); // 0: base corner
      viewNodes.push([cx + colHalf, cy - colHalf, 0]); // 1
      viewNodes.push([cx + colHalf, cy + colHalf, 0]); // 2
      viewNodes.push([cx - colHalf, cy + colHalf, 0]); // 3
      viewNodes.push([cx - colHalf, cy - colHalf, colH]); // 4: top corner
      viewNodes.push([cx + colHalf, cy - colHalf, colH]); // 5
      viewNodes.push([cx + colHalf, cy + colHalf, colH]); // 6
      viewNodes.push([cx - colHalf, cy + colHalf, colH]); // 7

      // Slab Q4 elements
      const viewElems: Element[] = result.elementResults.map(e => [...e.nodes]);

      // Pedestal frame elements (4 vertical edges of the column)
      viewElems.push([pedBaseIdx, pedBaseIdx + 4]);
      viewElems.push([pedBaseIdx + 1, pedBaseIdx + 5]);
      viewElems.push([pedBaseIdx + 2, pedBaseIdx + 6]);
      viewElems.push([pedBaseIdx + 3, pedBaseIdx + 7]);
      // Top edges
      viewElems.push([pedBaseIdx + 4, pedBaseIdx + 5]);
      viewElems.push([pedBaseIdx + 5, pedBaseIdx + 6]);
      viewElems.push([pedBaseIdx + 6, pedBaseIdx + 7]);
      viewElems.push([pedBaseIdx + 7, pedBaseIdx + 4]);
      // Bottom edges
      viewElems.push([pedBaseIdx, pedBaseIdx + 1]);
      viewElems.push([pedBaseIdx + 1, pedBaseIdx + 2]);
      viewElems.push([pedBaseIdx + 2, pedBaseIdx + 3]);
      viewElems.push([pedBaseIdx + 3, pedBaseIdx]);

      mesh.nodes.val = viewNodes;
      mesh.elements.val = viewElems;

      // Deformations (only slab nodes have them)
      const deformations = new Map<number, [number,number,number,number,number,number]>();
      result.nodeResults.forEach((n, i) => {
        deformations.set(i, [0, 0, n.w, n.bx, n.by, 0]);
      });
      if (mesh.deformOutputs) mesh.deformOutputs.val = { deformations };

      // Supports visual: show at slab edges + column zone
      const supportsVis = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
      result.nodeResults.forEach((n, i) => {
        const x = n.x, y = n.y;
        if (x < 1e-6 || x > Lx - 1e-6 || y < 1e-6 || y > Ly - 1e-6) {
          supportsVis.set(i, [false, false, true, false, false, false]);
        }
      });

      // Loads visual: show P at top of pedestal
      const footingLoads = new Map<number, [number,number,number,number,number,number]>();
      footingLoads.set(pedBaseIdx + 4, [0, 0, P/4, 0, 0, 0]);
      footingLoads.set(pedBaseIdx + 5, [0, 0, P/4, 0, 0, 0]);
      footingLoads.set(pedBaseIdx + 6, [0, 0, P/4, 0, 0, 0]);
      footingLoads.set(pedBaseIdx + 7, [0, 0, P/4, 0, 0, 0]);

      if (mesh.nodeInputs) mesh.nodeInputs.val = { supports: supportsVis, loads: footingLoads };
      if (mesh.elementInputs) mesh.elementInputs.val = {};

      // ── Shell contour colors (Mxx, Myy, Mxy) ──
      if (mesh.analyzeOutputs) {
        const nSlabElems = result.elementResults.length;
        const bendingXX = new Map<number, [number, number, number]>();
        const bendingYY = new Map<number, [number, number, number]>();
        const bendingXY = new Map<number, [number, number, number]>();
        result.elementResults.forEach((e, i) => {
          bendingXX.set(i, [e.Mxx, e.Mxx, e.Mxx] as [number, number, number]);
          bendingYY.set(i, [e.Myy, e.Myy, e.Myy] as [number, number, number]);
          bendingXY.set(i, [e.Mxy, e.Mxy, e.Mxy] as [number, number, number]);
        });
        mesh.analyzeOutputs.val = { bendingXX, bendingYY, bendingXY };
      }

      // Show bending contour by default
      const ctx = getViewerCtx();
      if (ctx) ctx.settings.shellResults.val = "bendingXX";

    } catch (err: any) {
      console.warn("Zapata solver failed:", err.message);
    }
    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
  }

  /** Base plate with circular bolt holes — Mindlin-Reissner shell analysis */
  function generatePlateWithHoles() {
    const Lx = gp("Lx") || 0.40, Ly = gp("Ly") || 0.40;
    const t = gp("t") || 0.025;
    const dBolt = gp("dBolt") || 0.022; // bolt hole diameter
    const sx = gp("sx") || 0.28; // bolt spacing in X
    const sy = gp("sy") || 0.28; // bolt spacing in Y
    const colA = gp("colA") || 0.20; // column width
    const meshSize = gp("meshSize") || 0.008;
    const E = gp("E") || 200e6, nu = gp("nu") || 0.30;
    const G = E / (2 * (1 + nu));
    const P = gp("P") || -200; // column axial load (negative = compression)
    const nBolts = Math.round(gp("nBolts") || 4);

    const cx = Lx / 2, cy = Ly / 2;
    const rBolt = dBolt / 2;
    const colHalf = colA / 2;

    // ── Bolt hole centers (symmetric pattern) ──
    const boltCenters: [number, number][] = [];
    if (nBolts >= 4) {
      boltCenters.push([cx - sx/2, cy - sy/2]);
      boltCenters.push([cx + sx/2, cy - sy/2]);
      boltCenters.push([cx + sx/2, cy + sy/2]);
      boltCenters.push([cx - sx/2, cy + sy/2]);
    }
    if (nBolts >= 6) {
      boltCenters.push([cx, cy - sy/2]);
      boltCenters.push([cx, cy + sy/2]);
    }
    if (nBolts >= 8) {
      boltCenters.push([cx - sx/2, cy]);
      boltCenters.push([cx + sx/2, cy]);
    }

    // ── Generate mesh, then remove elements inside bolt holes ──
    const { nodes: meshNodes, elements: fullElements } = getMesh({
      points: [[0, 0, 0], [Lx, 0, 0], [Lx, Ly, 0], [0, Ly, 0]],
      polygon: [0, 1, 2, 3],
      maxMeshSize: meshSize,
    });

    // Check if a point is inside any bolt hole
    const insideHole = (x: number, y: number): boolean => {
      for (const [bx, by] of boltCenters) {
        const dx2 = (x - bx) * (x - bx) + (y - by) * (y - by);
        if (dx2 < rBolt * rBolt) return true;
      }
      return false;
    };

    // Filter: remove elements whose centroid falls inside a hole
    const elements = fullElements.filter(el => {
      const xc = (meshNodes[el[0]][0] + meshNodes[el[1]][0] + meshNodes[el[2]][0]) / 3;
      const yc = (meshNodes[el[0]][1] + meshNodes[el[1]][1] + meshNodes[el[2]][1]) / 3;
      return !insideHole(xc, yc);
    });

    const solverNodes: Node[] = meshNodes;

    // ── Supports: fix bolt hole edge nodes (anchor bolts are fixed to foundation) ──
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (let i = 0; i < solverNodes.length; i++) {
      const x = solverNodes[i][0], y = solverNodes[i][1];
      // Nodes on bolt hole edges: within rBolt+tolerance but not inside
      for (const [bx, by] of boltCenters) {
        const d = Math.sqrt((x - bx) * (x - bx) + (y - by) * (y - by));
        if (d >= rBolt * 0.7 && d <= rBolt * 1.5) {
          // Bolt provides vertical support + lateral restraint
          supports.set(i, [true, true, true, false, false, false]);
        }
      }
    }

    // ── Loads: column load distributed over column footprint at center ──
    const loads = new Map<number, [number,number,number,number,number,number]>();
    let colNodeCount = 0;
    for (let i = 0; i < solverNodes.length; i++) {
      const x = solverNodes[i][0], y = solverNodes[i][1];
      if (Math.abs(x - cx) <= colHalf && Math.abs(y - cy) <= colHalf) {
        colNodeCount++;
      }
    }
    const fPerNode = P / Math.max(colNodeCount, 1);
    for (let i = 0; i < solverNodes.length; i++) {
      const x = solverNodes[i][0], y = solverNodes[i][1];
      if (Math.abs(x - cx) <= colHalf && Math.abs(y - cy) <= colHalf) {
        const prev = loads.get(i) || [0,0,0,0,0,0] as [number,number,number,number,number,number];
        prev[2] += fPerNode;
        loads.set(i, prev);
      }
    }

    // ── Element properties (steel, Mindlin-Reissner) ──
    const elemInputs = {
      elasticities: new Map(elements.map((_: any, i: number) => [i, E])),
      elasticitiesOrthogonal: new Map(elements.map((_: any, i: number) => [i, E])),
      thicknesses: new Map(elements.map((_: any, i: number) => [i, t])),
      poissonsRatios: new Map(elements.map((_: any, i: number) => [i, nu])),
      shearModuli: new Map(elements.map((_: any, i: number) => [i, G])),
    };

    console.log(`Placa Base: ${Lx*1000}x${Ly*1000}mm, t=${t*1000}mm, ${nBolts} pernos d=${dBolt*1000}mm`);
    console.log(`  P=${P} kN, col=${colA*1000}mm, mesh=${meshSize*1000}mm`);
    console.log(`  ${elements.length} triangulos, ${solverNodes.length} nodos`);

    try {
      const dOut = deform(solverNodes, elements, { supports, loads }, elemInputs);
      const aOut = analyze(solverNodes, elements, elemInputs, dOut);

      mesh.nodes.val = solverNodes;
      mesh.elements.val = elements;

      if (dOut && mesh.deformOutputs) mesh.deformOutputs.val = dOut;
      if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads };
      if (mesh.elementInputs) mesh.elementInputs.val = {};
      if (aOut && mesh.analyzeOutputs) mesh.analyzeOutputs.val = aOut;

      let maxDisp = 0;
      if (dOut && dOut.deformations) {
        dOut.deformations.forEach((dd) => {
          const mag = Math.sqrt(dd[0]*dd[0] + dd[1]*dd[1] + dd[2]*dd[2]);
          maxDisp = Math.max(maxDisp, mag);
        });
      }
      console.log(`  max|u| = ${maxDisp.toExponential(4)}`);
    } catch (err: any) {
      console.warn("Placa Base failed:", err.message);
    }
    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
  }

  /** Column HSS + Base Plate with bolt holes — full 3D shell model */
  function generateColumnBasePlate() {
    const colB = gp("colB") || 0.30, colH_sec = gp("colH") || 0.30;
    const colT = gp("colT") || 0.008;
    const colLen = gp("colLen") || 1.50;
    const Lx = gp("Lx") || 0.45, Ly = gp("Ly") || 0.45;
    const tPlaca = gp("tPlaca") || 0.025;
    const dBolt = gp("dBolt") || 0.022;
    const sx_bolt = gp("sx") || 0.32, sy_bolt = gp("sy") || 0.32;
    const nSubColV = Math.round(gp("nSubColV") || 6);  // vertical subdivisions
    const nSubColH = Math.round(gp("nSubColH") || 4);  // horizontal subdivisions per face
    const nSubPlaca = Math.round(gp("nSubPlaca") || 10);
    const E = gp("E") || 200e6, nu = gp("nu") || 0.30;
    const G = E / (2 * (1 + nu));
    const P = gp("P") || -300;

    const cx = Lx / 2, cy = Ly / 2;
    const rBolt = dBolt / 2;
    const colHalfB = colB / 2, colHalfH = colH_sec / 2;

    const nodes: Node[] = [];
    const elems: Element[] = [];

    // ═════════════════════════════════════════════════════════════
    // 1. BASE PLATE — Q4 mesh at Z=0 (horizontal)
    // ═════════════════════════════════════════════════════════════
    const nP = nSubPlaca;
    const dxP = Lx / nP, dyP = Ly / nP;
    const plateNid = (ix: number, iy: number) => iy * (nP + 1) + ix;

    for (let iy = 0; iy <= nP; iy++) {
      for (let ix = 0; ix <= nP; ix++) {
        nodes.push([ix * dxP, iy * dyP, 0]);
      }
    }

    // Bolt hole centers (4 bolts)
    const boltCenters: [number, number][] = [
      [cx - sx_bolt/2, cy - sy_bolt/2],
      [cx + sx_bolt/2, cy - sy_bolt/2],
      [cx + sx_bolt/2, cy + sy_bolt/2],
      [cx - sx_bolt/2, cy + sy_bolt/2],
    ];

    const insideHole = (x: number, y: number): boolean => {
      for (const [bx, by] of boltCenters) {
        if ((x-bx)*(x-bx) + (y-by)*(y-by) < rBolt*rBolt) return true;
      }
      return false;
    };

    // Create Q4 elements, skip if centroid is inside a bolt hole
    const plateElemStart = elems.length;
    for (let iy = 0; iy < nP; iy++) {
      for (let ix = 0; ix < nP; ix++) {
        const xc = (ix + 0.5) * dxP, yc = (iy + 0.5) * dyP;
        if (insideHole(xc, yc)) continue;
        elems.push([plateNid(ix,iy), plateNid(ix+1,iy), plateNid(ix+1,iy+1), plateNid(ix,iy+1)]);
      }
    }
    const nPlateElems = elems.length - plateElemStart;

    // ═════════════════════════════════════════════════════════════
    // 2. COLUMN HSS — 4 vertical panels (faces of the tube)
    // Column base at Z=0, centered at (cx, cy)
    // ═════════════════════════════════════════════════════════════
    const nC = nSubColV; // vertical subdivisions
    const nW = nSubColH; // horizontal subdivisions per face

    // Column corner coordinates at base (Z=0)
    const colCorners: [number, number][] = [
      [cx - colHalfB, cy - colHalfH], // 0: front-left
      [cx + colHalfB, cy - colHalfH], // 1: front-right
      [cx + colHalfB, cy + colHalfH], // 2: back-right
      [cx - colHalfB, cy + colHalfH], // 3: back-left
    ];

    // For each face, create a grid of nodes and Q4 elements
    const colElemStart = elems.length;
    const faces: [number, number][] = [[0,1], [1,2], [2,3], [3,0]]; // face defined by corner pairs

    // Helper: find existing plate node near (x, y, 0) or create new
    const findPlateNode = (x: number, y: number): number => {
      for (let i = 0; i < (nP+1)*(nP+1); i++) {
        if (Math.abs(nodes[i][0]-x) < dxP*0.3 && Math.abs(nodes[i][1]-y) < dyP*0.3 && Math.abs(nodes[i][2]) < 1e-6) return i;
      }
      return -1;
    };

    for (const [c0, c1] of faces) {
      const [x0, y0] = colCorners[c0];
      const [x1, y1] = colCorners[c1];

      // Node grid for this face: (nW+1) horizontal x (nC+1) vertical
      const faceNodes: number[][] = [];
      for (let iz = 0; iz <= nC; iz++) {
        const row: number[] = [];
        const z = iz / nC * colLen;
        for (let ih = 0; ih <= nW; ih++) {
          const t_h = ih / nW;
          const x = x0 + t_h * (x1 - x0);
          const y = y0 + t_h * (y1 - y0);

          if (iz === 0) {
            // Base of column: try to reuse plate node
            const existing = findPlateNode(x, y);
            if (existing >= 0) { row.push(existing); continue; }
          }
          // Check if node already exists (shared between faces at corners)
          let found = -1;
          for (let ni = 0; ni < nodes.length; ni++) {
            if (Math.abs(nodes[ni][0]-x) < 1e-6 && Math.abs(nodes[ni][1]-y) < 1e-6 && Math.abs(nodes[ni][2]-z) < 1e-6) {
              found = ni; break;
            }
          }
          if (found >= 0) { row.push(found); }
          else { row.push(nodes.length); nodes.push([x, y, z]); }
        }
        faceNodes.push(row);
      }

      // Q4 elements for this face
      for (let iz = 0; iz < nC; iz++) {
        for (let ih = 0; ih < nW; ih++) {
          elems.push([faceNodes[iz][ih], faceNodes[iz][ih+1], faceNodes[iz+1][ih+1], faceNodes[iz+1][ih]]);
        }
      }
    }
    const nColElems = elems.length - colElemStart;

    // ═════════════════════════════════════════════════════════════
    // 3. SUPPORTS — bolt hole edge nodes are fixed (anchored)
    // ═════════════════════════════════════════════════════════════
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (let i = 0; i < (nP+1)*(nP+1); i++) {
      const x = nodes[i][0], y = nodes[i][1];
      for (const [bx, by] of boltCenters) {
        const d = Math.sqrt((x-bx)*(x-bx) + (y-by)*(y-by));
        if (d >= rBolt * 0.5 && d <= rBolt * 2.0) {
          supports.set(i, [true, true, true, true, true, true]);
        }
      }
    }

    // ═════════════════════════════════════════════════════════════
    // 4. LOADS — P at top of column (distributed over top nodes)
    // ═════════════════════════════════════════════════════════════
    const loads = new Map<number, [number,number,number,number,number,number]>();
    const topNodes: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      if (Math.abs(nodes[i][2] - colLen) < 1e-6) topNodes.push(i);
    }
    const fPerNode = P / Math.max(topNodes.length, 1);
    for (const ni of topNodes) {
      loads.set(ni, [0, 0, fPerNode, 0, 0, 0]);
    }

    // ═════════════════════════════════════════════════════════════
    // 5. ELEMENT PROPERTIES
    // ═════════════════════════════════════════════════════════════
    const elemInputs: ElementInputs = {
      elasticities: new Map(),
      poissonsRatios: new Map(),
      thicknesses: new Map(),
      shearModuli: new Map(),
    };

    // Plate elements: tPlaca
    for (let i = plateElemStart; i < plateElemStart + nPlateElems; i++) {
      elemInputs.elasticities!.set(i, E);
      elemInputs.poissonsRatios!.set(i, nu);
      elemInputs.thicknesses!.set(i, tPlaca);
      elemInputs.shearModuli!.set(i, G);
    }

    // Column elements: colT
    for (let i = colElemStart; i < colElemStart + nColElems; i++) {
      elemInputs.elasticities!.set(i, E);
      elemInputs.poissonsRatios!.set(i, nu);
      elemInputs.thicknesses!.set(i, colT);
      elemInputs.shearModuli!.set(i, G);
    }

    console.log(`Col+Placa 3D: col ${colB*1000}x${colH_sec*1000}x${colT*1000}mm, h=${colLen}m`);
    console.log(`  Placa ${Lx*1000}x${Ly*1000}mm, t=${tPlaca*1000}mm, 4 pernos d=${dBolt*1000}mm`);
    console.log(`  ${nPlateElems} Q4 placa + ${nColElems} Q4 columna = ${elems.length} total`);
    console.log(`  ${nodes.length} nodos, P=${P} kN`);

    try {
      const dOut = deform(nodes, elems, { supports, loads }, elemInputs);
      const aOut = analyze(nodes, elems, elemInputs, dOut);

      mesh.nodes.val = nodes;
      mesh.elements.val = elems;
      if (dOut && mesh.deformOutputs) mesh.deformOutputs.val = dOut;
      if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads };
      if (mesh.elementInputs) mesh.elementInputs.val = elemInputs;
      if (aOut && mesh.analyzeOutputs) mesh.analyzeOutputs.val = aOut;

      let maxDisp = 0;
      if (dOut?.deformations) {
        dOut.deformations.forEach((dd) => {
          const mag = Math.sqrt(dd[0]*dd[0] + dd[1]*dd[1] + dd[2]*dd[2]);
          maxDisp = Math.max(maxDisp, mag);
        });
      }
      console.log(`  max|u| = ${maxDisp.toExponential(4)}`);
    } catch (err: any) {
      console.warn("Col+Placa failed:", err.message);
      mesh.nodes.val = nodes;
      mesh.elements.val = elems;
      if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads };
    }

    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
  }

  /** Slope stability: gravity-loaded triangular mesh (plane strain) */
  // ═══════════════════════════════════════════════════════════════════════
  // Bishop's Simplified Method — Slope Stability FOS
  // ═══════════════════════════════════════════════════════════════════════
  function bishopFOS(
    groundY: (x: number) => number,
    xMin: number, xMax: number, yDeep: number,
    c: number, phiDeg: number, gamma: number, qs: number
  ): { fos: number; xc: number; yc: number; R: number } {
    const tanPhi = Math.tan(phiDeg * Math.PI / 180);
    const H_total = groundY(xMax) - yDeep; // max height in domain

    // Compute FOS for one trial circle
    function computeFOS(xc: number, yc: number, R: number): number | null {
      const xL = Math.max(xMin, xc - R);
      const xR = Math.min(xMax, xc + R);
      if (xR - xL < 0.1) return null;

      const nSlices = 80;
      const dx = (xR - xL) / nSlices;
      let sumNumerator = 0, sumDriving = 0;
      let hasSlipMass = false;

      // First pass with FS estimate, then iterate
      let FS = 1.5;
      for (let iter = 0; iter < 30; iter++) {
        sumNumerator = 0;
        sumDriving = 0;
        hasSlipMass = false;

        for (let i = 0; i < nSlices; i++) {
          const x = xL + (i + 0.5) * dx;
          const xRel = x - xc;
          if (Math.abs(xRel) >= R) continue;

          const circleY = yc - Math.sqrt(R * R - xRel * xRel);
          const surfY = groundY(x);
          const baseY = Math.max(yDeep, circleY);
          const h = surfY - baseY;
          if (h <= 0.01) continue;
          hasSlipMass = true;

          const W = gamma * h * dx + (qs > 0 ? qs * dx : 0);
          const sinA = xRel / R;
          const cosA = Math.sqrt(1 - sinA * sinA);
          const mAlpha = cosA + sinA * tanPhi / FS;
          if (Math.abs(mAlpha) < 1e-10) continue;

          sumNumerator += (c * dx / cosA + W * tanPhi) / mAlpha;
          sumDriving += W * sinA;
        }

        if (!hasSlipMass || sumDriving <= 0.01) return null;
        const FS_new = sumNumerator / sumDriving;
        if (Math.abs(FS_new - FS) < 1e-5) { FS = FS_new; break; }
        FS = FS_new;
        if (FS < 0.01 || FS > 50) return null;
      }
      return FS > 0.05 && FS < 50 ? FS : null;
    }

    // Grid search for critical circle
    let bestFOS = Infinity, bestXc = 0, bestYc = 0, bestR = 0;
    const nGrid = 25, nR = 20;

    // Search area: centers ABOVE the slope (typical for slope stability)
    // Classic Bishop: centers above/behind the crest, circles passing through slope face
    const slopeH = groundY(xMax) - groundY(xMin);
    const xSrchMin = xMin;
    const xSrchMax = xMax * 0.7;
    const ySrchMin = groundY(xMax) + slopeH * 0.2;
    const ySrchMax = groundY(xMax) + slopeH * 4.0; // well above crest

    for (let ix = 0; ix < nGrid; ix++) {
      const xc = xSrchMin + (xSrchMax - xSrchMin) * ix / (nGrid - 1);
      for (let iy = 0; iy < nGrid; iy++) {
        const yc = ySrchMin + (ySrchMax - ySrchMin) * iy / (nGrid - 1);
        for (let ir = 0; ir < nR; ir++) {
          // Radius: from center to toe/crest (must intersect slope)
          const distToToe = Math.sqrt((xc - xMin) ** 2 + (yc - groundY(xMin)) ** 2);
          const distToCrest = Math.sqrt((xc - xMax) ** 2 + (yc - groundY(xMax)) ** 2);
          const Rmin = Math.min(distToToe, distToCrest) * 0.5;
          const Rmax = Math.max(distToToe, distToCrest) * 1.5;
          if (Rmax < Rmin + 0.1) continue;
          const R = Rmin + (Rmax - Rmin) * ir / (nR - 1);

          const fos = computeFOS(xc, yc, R);
          if (fos !== null && fos < bestFOS) {
            bestFOS = fos;
            bestXc = xc; bestYc = yc; bestR = R;
          }
        }
      }
    }

    // Refine around best found (stay within search bounds)
    if (bestFOS < Infinity) {
      const dxRef = (xSrchMax - xSrchMin) / nGrid * 0.5;
      const dyRef = (ySrchMax - ySrchMin) / nGrid * 0.5;
      const dRRef = bestR * 0.05;
      for (let ix = -5; ix <= 5; ix++) {
        const xc = bestXc + dxRef * ix;
        if (xc < xSrchMin || xc > xSrchMax) continue;
        for (let iy = -5; iy <= 5; iy++) {
          const yc = bestYc + dyRef * iy;
          if (yc < ySrchMin || yc > ySrchMax) continue;
          for (let ir = -5; ir <= 5; ir++) {
            const R = bestR + dRRef * ir;
            if (R < 0.5) continue;
            const fos = computeFOS(xc, yc, R);
            if (fos !== null && fos < bestFOS) {
              bestFOS = fos;
              bestXc = xc; bestYc = yc; bestR = R;
            }
          }
        }
      }
    }

    return { fos: bestFOS, xc: bestXc, yc: bestYc, R: bestR };
  }

  function generateSlope() {
    const H = gp("H") || 6;
    const angle = gp("angle") || 45;
    const bTop = gp("bTop") || 3;
    const bBot = gp("bBot") || 3;
    const meshSize = gp("meshSize") || 2.0;
    const E = gp("E") || 50000, nu = gp("nu") || 0.3;
    const gamma = gp("gamma") || 18;
    const c = gp("c") || 15;      // cohesion (kPa)
    const phi = gp("phi") || 30;  // friction angle (deg)
    const qs = gp("qs") || 0;     // surcharge on top surface

    // ── Complete slope geometry with depth below toe ──
    const slopeRun = H / Math.tan(angle * Math.PI / 180);
    const totalW = bBot + slopeRun + bTop;
    const D = H; // depth below toe = same as height

    // Polygon points (counterclockwise)
    const pts: [number,number,number][] = [
      [0, -D, 0],                // 0: deep-left
      [totalW, -D, 0],           // 1: deep-right
      [totalW, H, 0],            // 2: top-right (crest level)
      [bBot + slopeRun, H, 0],   // 3: crest-slope junction
      [bBot, 0, 0],              // 4: toe of slope
      [0, 0, 0],                 // 5: surface-left (toe level)
    ];

    const { nodes: meshNodes, elements } = getMesh({
      points: pts,
      polygon: [0, 1, 2, 3, 4, 5],
      maxMeshSize: meshSize,
    });

    const solverNodes: Node[] = meshNodes;

    // Supports for SRM solver: fix bottom (y=-D), rollers on sides
    const srmSupports: { node: number; fixX: boolean; fixY: boolean }[] = [];
    const viewSupports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (let i = 0; i < solverNodes.length; i++) {
      const x = solverNodes[i][0], y = solverNodes[i][1];
      if (Math.abs(y + D) < 1e-6) {
        srmSupports.push({ node: i, fixX: true, fixY: true });
        viewSupports.set(i, [true, true, true, true, true, true]);
      } else if (Math.abs(x) < 1e-6 || Math.abs(x - totalW) < 1e-6) {
        srmSupports.push({ node: i, fixX: true, fixY: false });
        viewSupports.set(i, [true, false, true, true, true, true]);
      }
    }

    // Surface Y threshold for surcharge (top of crest)
    const surfaceYThreshold = H - meshSize * 0.3;

    try {
      // ── SRM Mohr-Coulomb solver ──
      const nodes2D: [number,number][] = solverNodes.map(n => [n[0], n[1]]);
      const tris: [number,number,number][] = elements.map(
        (el: number[]) => [el[0], el[1], el[2]] as [number,number,number]
      );

      const result = slopeSRM({
        nodes: nodes2D,
        elements: tris,
        E, nu, gamma, c, phi,
        thickness: 1.0,
        supports: srmSupports,
        surcharge: qs,
        surfaceYThreshold,
      });

      // Remap XY→XZ for vertical display
      const viewNodes: Node[] = solverNodes.map(n => [n[0], 0, n[1]] as Node);

      mesh.nodes.val = viewNodes;
      mesh.elements.val = elements;

      // Convert SRM displacements to 6-DOF deformation map (remap Y→Z for viewer)
      const viewDeforms = new Map<number, [number,number,number,number,number,number]>();
      for (let i = 0; i < result.displacements.length; i++) {
        const [ux, uy] = result.displacements[i];
        viewDeforms.set(i, [ux, 0, uy, 0, 0, 0]);
      }
      if (mesh.deformOutputs) mesh.deformOutputs.val = { deformations: viewDeforms };

      if (mesh.nodeInputs) mesh.nodeInputs.val = { supports: viewSupports };
      if (mesh.elementInputs) mesh.elementInputs.val = {};

      // ── Plastic strain → shell result color map ──
      // Use analyzeOutputs.membraneXX to display equivalent plastic strain per element
      // (3 values per triangle → same value at all 3 nodes)
      const plasticMap = new Map<number, [number,number,number]>();
      for (let e = 0; e < result.plasticStrain.length; e++) {
        const eps = result.plasticStrain[e];
        plasticMap.set(e, [eps, eps, eps]);
      }
      if (mesh.analyzeOutputs) {
        mesh.analyzeOutputs.val = { membraneXX: plasticMap };
      }

      // Stats
      let maxDisp = 0;
      for (const [ux, uy] of result.displacements) {
        const mag = Math.sqrt(ux * ux + uy * uy);
        maxDisp = Math.max(maxDisp, mag);
      }
      let maxPlastic = 0;
      for (const eps of result.plasticStrain) {
        maxPlastic = Math.max(maxPlastic, eps);
      }

      console.log(`Talud SRM: ${solverNodes.length} nodos, ${elements.length} triangulos`);
      console.log(`  H=${H}, angulo=${angle}°, c=${c} kPa, φ=${phi}°, γ=${gamma}`);
      console.log(`  ═══ Strength Reduction Method (Mohr-Coulomb) ═══`);
      console.log(`  FOS = ${result.fos.toFixed(3)}`);
      console.log(`  max|u| = ${maxDisp.toExponential(4)}`);
      console.log(`  max ε_pl = ${maxPlastic.toExponential(4)}`);
      if (result.fos < 1.0) console.warn(`  ⚠ TALUD INESTABLE (FOS < 1.0)`);
      else if (result.fos < 1.5) console.warn(`  ⚠ FOS < 1.5 — revisar estabilidad`);
    } catch (err: any) {
      console.warn("Talud SRM failed:", err.message);
    }
    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
  }

  let loadPane: Pane | null = null; // Tweakpane for loads
  let sectionsPane: Pane | null = null; // Tweakpane for sections (side panel)
  let lucesPane: Pane | null = null; // Tweakpane for luces (middle column)
  let sectionsDivCreated = false;

  /** Ensure the #sections container exists next to #parameters */
  function ensureSectionsDiv(): HTMLElement | null {
    let div = document.getElementById("sections");
    if (!div) {
      div = document.createElement("div");
      div.id = "sections";

      // Create wrapper: 3 columns side by side (sections | luces | params+cargas)
      const paramsEl = document.getElementById("parameters");
      let wrapper = document.getElementById("right-panels-wrapper");
      if (!wrapper && paramsEl) {
        wrapper = document.createElement("div");
        wrapper.id = "right-panels-wrapper";
        wrapper.style.cssText = "position:absolute;bottom:0;right:0;z-index:3;max-height:95vh;display:flex;flex-direction:row;gap:0;align-items:flex-end;pointer-events:none;";
        // Luces panel (middle column — created in rebuildTweakpane)
        let lucesDiv = document.getElementById("luces-panel");
        if (!lucesDiv) {
          lucesDiv = document.createElement("div");
          lucesDiv.id = "luces-panel";
          lucesDiv.style.cssText = "width:180px;max-height:90vh;overflow-y:auto;pointer-events:auto;";
        }
        // Parameters stays as right column
        paramsEl.style.cssText = "width:240px;position:static;max-height:90vh;overflow-y:auto;pointer-events:auto;";
        const parent = paramsEl.parentElement!;
        parent.removeChild(paramsEl);
        // Order: sections | luces | params
        wrapper.appendChild(div);
        wrapper.appendChild(lucesDiv);
        wrapper.appendChild(paramsEl);
        parent.appendChild(wrapper);
      }

      if (wrapper) {
        div.style.cssText = "width:200px;max-height:90vh;overflow-y:auto;pointer-events:auto;";
      } else {
        div.style.cssText = "position:absolute;bottom:0;right:316px;width:250px;z-index:3;max-height:80vh;overflow-y:auto;";
        document.body.appendChild(div);
      }
      sectionsDivCreated = true;
    }
    return div;
  }

  /** Unit conversion helpers for sections (sectionState stores SI: kN, m) */
  function siToDisplay_length(val_m: number): number {
    const lu = LENGTH_UNITS.find(u => u.id === activeLengthId)!;
    return val_m / lu.toM; // m → display length unit
  }
  function displayToSi_length(val_disp: number): number {
    const lu = LENGTH_UNITS.find(u => u.id === activeLengthId)!;
    return val_disp * lu.toM; // display → m
  }
  function siToDisplay_stress(val_kNm2: number): number {
    // Use stress-specific units (e.g. MKS: kgf/cm², not tonf/m²)
    const fu = FORCE_UNITS.find(u => u.id === activeStressUnit.forceId)!;
    const lu = LENGTH_UNITS.find(u => u.id === activeStressUnit.lengthId)!;
    return val_kNm2 / (fu.toKN / (lu.toM * lu.toM));
  }
  function displayToSi_stress(val_disp: number): number {
    const fu = FORCE_UNITS.find(u => u.id === activeStressUnit.forceId)!;
    const lu = LENGTH_UNITS.find(u => u.id === activeStressUnit.lengthId)!;
    return val_disp * (fu.toKN / (lu.toM * lu.toM));
  }
  function stressUnitLabel(): string { return activeStressUnit.label; }

  /** Length range in display units */
  function secLenRange(): [number, number, number] {
    const lu = LENGTH_UNITS.find(u => u.id === activeLengthId)!;
    switch (lu.id) {
      case "m":  return [0.10, 2.0, 0.05];
      case "cm": return [10, 200, 5];
      case "mm": return [100, 2000, 50];
      case "in": return [4, 80, 1];
      case "ft": return [0.3, 6, 0.1];
    }
  }
  function secFcRange(): [number, number, number] {
    // 210 kgf/cm² = 20594 kN/m² (min), 600 kgf/cm² = 58840 kN/m² (max)
    const fcMin = siToDisplay_stress(20594); // 210 kgf/cm²
    const fcMax = siToDisplay_stress(58840); // 600 kgf/cm²
    const step = Math.max(1, Math.round((fcMax - fcMin) / 40));
    return [Math.round(fcMin), Math.round(fcMax), step];
  }

  /** Add viga bindings (concrete b/h, W/HSS profile, I-param, or Tubular) */
  function addVigaBindings(folder: any, vigas: BeamSec[], axis: string, lr: [number,number,number], tr: [number,number,number]) {
    const svt = sectionState.steelVigaType; // 0=W, 1=HSS, 2=I-param, 3=Tubular
    const vigaProfOpts = svt === 0 ? getWProfileOptions() : getHSSProfileOptions();

    if (sectionState.vigaMat === 0) {
      // Hormigón — b, h per span
      for (let vi = 0; vi < vigas.length; vi++) {
        const vs = vigas[vi];
        const pre = `b${axis}${vi}`, preh = `h${axis}${vi}`;
        const vObj: Record<string, number> = {};
        vObj[pre] = +siToDisplay_length(vs.b).toFixed(2);
        vObj[preh] = +siToDisplay_length(vs.h).toFixed(2);
        folder.addBinding(vObj, pre, { min: lr[0], max: lr[1], step: lr[2], label: `b sv${axis}${vi+1}` });
        folder.addBinding(vObj, preh, { min: lr[0], max: lr[1], step: lr[2], label: `h sv${axis}${vi+1}` });
      }
      folder.on('change', (e: any) => {
        const k = e.target?.key as string;
        const mb = k?.match(new RegExp(`^b${axis}(\\d+)$`));
        const mh = k?.match(new RegExp(`^h${axis}(\\d+)$`));
        if (mb) { vigas[parseInt(mb[1])].b = displayToSi_length(e.value); regenerateFromParams(); }
        if (mh) { vigas[parseInt(mh[1])].h = displayToSi_length(e.value); regenerateFromParams(); }
      });
    } else if (svt <= 1) {
      // Steel W or HSS profile dropdown per span
      for (let vi = 0; vi < vigas.length; vi++) {
        const vpObj: Record<string, number> = {};
        vpObj[`p${axis}${vi}`] = vigas[vi].profileIdx ?? 0;
        folder.addBinding(vpObj, `p${axis}${vi}`, { label: `sv${axis}${vi+1}`, options: vigaProfOpts });
      }
      folder.on('change', (e: any) => {
        const k = e.target?.key as string;
        const mp = k?.match(new RegExp(`^p${axis}(\\d+)$`));
        if (mp) { vigas[parseInt(mp[1])].profileIdx = e.value; regenerateFromParams(); }
      });
    } else if (svt === 2) {
      // I paramétrica per span
      for (let vi = 0; vi < vigas.length; vi++) {
        const vs = vigas[vi];
        const vObj: Record<string, number> = {};
        const p = `${axis}${vi}`;
        vObj[`bf${p}`] = +siToDisplay_length(vs.bf ?? 0.20).toFixed(3);
        vObj[`h${p}`] = +siToDisplay_length(vs.hf ?? 0.40).toFixed(3);
        vObj[`tf${p}`] = +siToDisplay_length(vs.tf ?? 0.015).toFixed(3);
        vObj[`tw${p}`] = +siToDisplay_length(vs.tw ?? 0.010).toFixed(3);
        folder.addBinding(vObj, `bf${p}`, { min: lr[0], max: lr[1], step: lr[2], label: `bf sv${axis}${vi+1}` });
        folder.addBinding(vObj, `h${p}`, { min: lr[0], max: lr[1], step: lr[2], label: `h sv${axis}${vi+1}` });
        folder.addBinding(vObj, `tf${p}`, { min: tr[0], max: tr[1], step: tr[2], label: `tf sv${axis}${vi+1}` });
        folder.addBinding(vObj, `tw${p}`, { min: tr[0], max: tr[1], step: tr[2], label: `tw sv${axis}${vi+1}` });
      }
      folder.on('change', (e: any) => {
        const k = e.target?.key as string;
        for (let vi = 0; vi < vigas.length; vi++) {
          const p = `${axis}${vi}`;
          if (k === `bf${p}`) { vigas[vi].bf = displayToSi_length(e.value); regenerateFromParams(); }
          if (k === `h${p}`) { vigas[vi].hf = displayToSi_length(e.value); regenerateFromParams(); }
          if (k === `tf${p}`) { vigas[vi].tf = displayToSi_length(e.value); regenerateFromParams(); }
          if (k === `tw${p}`) { vigas[vi].tw = displayToSi_length(e.value); regenerateFromParams(); }
        }
      });
    } else {
      // Tubular hueca per span
      for (let vi = 0; vi < vigas.length; vi++) {
        const vs = vigas[vi];
        const vObj: Record<string, number> = {};
        const p = `${axis}${vi}`;
        vObj[`bc${p}`] = +siToDisplay_length(vs.bc ?? 0.20).toFixed(3);
        vObj[`hc${p}`] = +siToDisplay_length(vs.hc ?? 0.30).toFixed(3);
        vObj[`t${p}`] = +siToDisplay_length(vs.t ?? 0.008).toFixed(3);
        folder.addBinding(vObj, `bc${p}`, { min: lr[0], max: lr[1], step: lr[2], label: `b sv${axis}${vi+1}` });
        folder.addBinding(vObj, `hc${p}`, { min: lr[0], max: lr[1], step: lr[2], label: `h sv${axis}${vi+1}` });
        folder.addBinding(vObj, `t${p}`, { min: tr[0], max: tr[1], step: tr[2], label: `t sv${axis}${vi+1}` });
      }
      folder.on('change', (e: any) => {
        const k = e.target?.key as string;
        for (let vi = 0; vi < vigas.length; vi++) {
          const p = `${axis}${vi}`;
          if (k === `bc${p}`) { vigas[vi].bc = displayToSi_length(e.value); regenerateFromParams(); }
          if (k === `hc${p}`) { vigas[vi].hc = displayToSi_length(e.value); regenerateFromParams(); }
          if (k === `t${p}`) { vigas[vi].t = displayToSi_length(e.value); regenerateFromParams(); }
        }
      });
    }
  }

  /** Build the Sections side panel (per-floor columns & beams) */
  function rebuildSectionsPane() {
    // Destroy existing
    if (sectionsPane) { try { sectionsPane.dispose(); } catch {} sectionsPane = null; }
    const div = document.getElementById("sections");
    if (div) div.innerHTML = "";

    // Only show for edificio/frame
    if (activeGenerator !== "edificio" && activeGenerator !== "frame") {
      if (div) div.style.display = "none";
      return;
    }

    const container = ensureSectionsDiv();
    if (!container) return;
    container.style.display = "";

    const u = activeUnits;
    const nPisos = Math.round(generatorParams["nPisos"]?.val ?? 3);
    const lr = secLenRange();
    const fcr = secFcRange();

    // Ensure sectionState.perFloor has entries for each floor with correct bay counts
    const nvx = edifSvx.length || 1;
    const nvy = edifSvy.length || 1;
    while (sectionState.perFloor.length < nPisos) {
      const last = sectionState.perFloor.length > 0
        ? JSON.parse(JSON.stringify(sectionState.perFloor[sectionState.perFloor.length - 1])) as FloorSection
        : defaultFloor(nvx, nvy);
      sectionState.perFloor.push(last);
    }
    if (sectionState.perFloor.length > nPisos) sectionState.perFloor.length = nPisos;
    // Resize vigasX/vigasY arrays to match current span count
    for (const fl of sectionState.perFloor) {
      while (fl.vigasX.length < nvx) fl.vigasX.push(fl.vigasX.length > 0 ? { ...fl.vigasX[fl.vigasX.length - 1] } : defaultBeamSec());
      if (fl.vigasX.length > nvx) fl.vigasX.length = nvx;
      while (fl.vigasY.length < nvy) fl.vigasY.push(fl.vigasY.length > 0 ? { ...fl.vigasY[fl.vigasY.length - 1] } : defaultBeamSec());
      if (fl.vigasY.length > nvy) fl.vigasY.length = nvy;
    }

    sectionsPane = new Pane({ title: `Sections (${u.label})`, container });

    // === Col Material ===
    const colMatObj = { colMat: sectionState.colMat };
    sectionsPane.addBinding(colMatObj, 'colMat', {
      label: 'Col Material', options: { 'Hormigon': 0, 'Acero': 1, 'CFT': 2 },
    }).on('change', (e: any) => { sectionState.colMat = e.value; rebuildSectionsPane(); regenerateFromParams(); });

    // Col sub-options (concrete shape, steel type)
    if (sectionState.colMat === 0) {
      const shapeObj = { forma: sectionState.colShape };
      sectionsPane.addBinding(shapeObj, 'forma', {
        label: 'Col forma', options: { 'Rectangular': 0, 'Circular': 1 },
      }).on('change', (e: any) => { sectionState.colShape = e.value; rebuildSectionsPane(); regenerateFromParams(); });
      const fcDisp = { fc: +siToDisplay_stress(sectionState.fc).toFixed(1) };
      sectionsPane.addBinding(fcDisp, 'fc', { min: fcr[0], max: fcr[1], step: fcr[2], label: `f'c col (${stressUnitLabel()})` });
      sectionsPane.on('change', (e: any) => { if (e.target?.key === 'fc') { sectionState.fc = displayToSi_stress(e.value); regenerateFromParams(); } });
    } else if (sectionState.colMat === 1) {
      const stObj = { colType: sectionState.steelColType };
      sectionsPane.addBinding(stObj, 'colType', { label: 'Col tipo', options: { 'W profile': 0, 'HSS profile': 1, 'I param': 2, 'Tubular': 3 } })
        .on('change', (e: any) => { sectionState.steelColType = e.value; rebuildSectionsPane(); regenerateFromParams(); });
    }
    // CFT col sub-options are per-floor (Es, νs, f'c, νc)

    sectionsPane.addBlade({ view: 'separator' });

    // === Viga Material ===
    const vigaMatObj = { vigaMat: sectionState.vigaMat };
    sectionsPane.addBinding(vigaMatObj, 'vigaMat', {
      label: 'Viga Material', options: { 'Hormigon': 0, 'Acero': 1 },
    }).on('change', (e: any) => { sectionState.vigaMat = e.value; rebuildSectionsPane(); regenerateFromParams(); });

    if (sectionState.vigaMat === 1) {
      const stObj = { vigaType: sectionState.steelVigaType };
      sectionsPane.addBinding(stObj, 'vigaType', { label: 'Viga tipo', options: { 'W profile': 0, 'HSS profile': 1, 'I param': 2, 'Tubular': 3 } })
        .on('change', (e: any) => { sectionState.steelVigaType = e.value; rebuildSectionsPane(); regenerateFromParams(); });
    }

    const colProfOpts = sectionState.steelColType === 0 ? getWProfileOptions() : getHSSProfileOptions();
    const vigaProfOpts = sectionState.steelVigaType === 0 ? getWProfileOptions() : getHSSProfileOptions();
    // Thinner range for tf, tw, t (wall thickness)
    const tr: [number, number, number] = activeLengthId === "m" ? [0.005, 0.10, 0.001]
      : activeLengthId === "cm" ? [0.5, 10, 0.1]
      : activeLengthId === "mm" ? [5, 100, 1]
      : activeLengthId === "in" ? [0.2, 4, 0.05]
      : [0.01, 0.5, 0.005];

    // Per-floor folders
    for (let p = 0; p < nPisos; p++) {
      const fl = sectionState.perFloor[p];
      const folder = sectionsPane.addFolder({ title: `Piso ${p + 1}`, expanded: p < 2 });

      // === COLUMNAS ===
      if (sectionState.colMat === 0) {
        // Hormigón columnas
        if (sectionState.colShape === 1) {
          const obj = { dCol: +siToDisplay_length(fl.dCol).toFixed(2) };
          folder.addBinding(obj, 'dCol', { min: lr[0], max: lr[1], step: lr[2], label: `d col` });
          folder.on('change', (e: any) => { if (e.target?.key === 'dCol') { fl.dCol = displayToSi_length(e.value); regenerateFromParams(); } });
        } else {
          const obj = { bCol: +siToDisplay_length(fl.bCol).toFixed(2), hCol: +siToDisplay_length(fl.hCol).toFixed(2) };
          folder.addBinding(obj, 'bCol', { min: lr[0], max: lr[1], step: lr[2], label: `b col` });
          folder.addBinding(obj, 'hCol', { min: lr[0], max: lr[1], step: lr[2], label: `h col` });
          folder.on('change', (e: any) => {
            if (e.target?.key === 'bCol') { fl.bCol = displayToSi_length(e.value); regenerateFromParams(); }
            if (e.target?.key === 'hCol') { fl.hCol = displayToSi_length(e.value); regenerateFromParams(); }
          });
        }
      } else if (sectionState.colMat === 1) {
        // Acero columnas
        if (sectionState.steelColType <= 1) {
          const cpObj = { col: fl.colProfileIdx };
          folder.addBinding(cpObj, 'col', { label: 'Columna', options: colProfOpts })
            .on('change', (e: any) => { fl.colProfileIdx = e.value; regenerateFromParams(); });
        } else if (sectionState.steelColType === 2) {
          // I paramétrica
          const obj = {
            bf: +siToDisplay_length(fl.colBf ?? 0.30).toFixed(3),
            h: +siToDisplay_length(fl.colHf ?? 0.30).toFixed(3),
            tf: +siToDisplay_length(fl.colTf ?? 0.020).toFixed(3),
            tw: +siToDisplay_length(fl.colTw ?? 0.012).toFixed(3),
          };
          folder.addBinding(obj, 'bf', { min: lr[0], max: lr[1], step: lr[2], label: 'Col bf' });
          folder.addBinding(obj, 'h', { min: lr[0], max: lr[1], step: lr[2], label: 'Col h' });
          folder.addBinding(obj, 'tf', { min: tr[0], max: tr[1], step: tr[2], label: 'Col tf' });
          folder.addBinding(obj, 'tw', { min: tr[0], max: tr[1], step: tr[2], label: 'Col tw' });
          folder.on('change', (e: any) => {
            if (e.target?.key === 'bf') { fl.colBf = displayToSi_length(e.value); regenerateFromParams(); }
            if (e.target?.key === 'h') { fl.colHf = displayToSi_length(e.value); regenerateFromParams(); }
            if (e.target?.key === 'tf') { fl.colTf = displayToSi_length(e.value); regenerateFromParams(); }
            if (e.target?.key === 'tw') { fl.colTw = displayToSi_length(e.value); regenerateFromParams(); }
          });
        } else {
          // Tubular hueca
          const obj = {
            bc: +siToDisplay_length(fl.colBc ?? 0.30).toFixed(3),
            hc: +siToDisplay_length(fl.colHc ?? 0.30).toFixed(3),
            t: +siToDisplay_length(fl.colT ?? 0.010).toFixed(3),
          };
          folder.addBinding(obj, 'bc', { min: lr[0], max: lr[1], step: lr[2], label: 'Col b' });
          folder.addBinding(obj, 'hc', { min: lr[0], max: lr[1], step: lr[2], label: 'Col h' });
          folder.addBinding(obj, 't', { min: tr[0], max: tr[1], step: tr[2], label: 'Col t' });
          folder.on('change', (e: any) => {
            if (e.target?.key === 'bc') { fl.colBc = displayToSi_length(e.value); regenerateFromParams(); }
            if (e.target?.key === 'hc') { fl.colHc = displayToSi_length(e.value); regenerateFromParams(); }
            if (e.target?.key === 't') { fl.colT = displayToSi_length(e.value); regenerateFromParams(); }
          });
        }
      } else {
        // Mixto: columnas CFT (Concrete-Filled Tube) — 2 materiales
        const obj = {
          bc: +siToDisplay_length(fl.colBc ?? 0.30).toFixed(3),
          hc: +siToDisplay_length(fl.colHc ?? 0.30).toFixed(3),
          t: +siToDisplay_length(fl.colT ?? 0.010).toFixed(3),
          Es: +siToDisplay_stress(fl.colEs ?? 200e6).toFixed(0),
          nuS: fl.colNuS ?? 0.30,
          fc: +siToDisplay_stress(fl.colFc ?? 28000).toFixed(1),
          nuC: fl.colNuC ?? 0.20,
        };
        folder.addBinding(obj, 'bc', { min: lr[0], max: lr[1], step: lr[2], label: 'Col b' });
        folder.addBinding(obj, 'hc', { min: lr[0], max: lr[1], step: lr[2], label: 'Col h' });
        folder.addBinding(obj, 't', { min: tr[0], max: tr[1], step: tr[2], label: 'Col t' });
        folder.addBlade({ view: 'separator' });
        const EsMin = +siToDisplay_stress(100e6).toFixed(0);
        const EsMax = +siToDisplay_stress(300e6).toFixed(0);
        const EsStep = Math.max(1, Math.round((EsMax - EsMin) / 200));
        folder.addBinding(obj, 'Es', { min: EsMin, max: EsMax, step: EsStep, label: `Es (${stressUnitLabel()})` });
        folder.addBinding(obj, 'nuS', { min: 0.15, max: 0.45, step: 0.01, label: 'νs' });
        folder.addBinding(obj, 'fc', { min: fcr[0], max: fcr[1], step: fcr[2], label: `f'c (${stressUnitLabel()})` });
        folder.addBinding(obj, 'nuC', { min: 0.10, max: 0.35, step: 0.01, label: 'νc' });
        folder.on('change', (e: any) => {
          if (e.target?.key === 'bc') { fl.colBc = displayToSi_length(e.value); regenerateFromParams(); }
          if (e.target?.key === 'hc') { fl.colHc = displayToSi_length(e.value); regenerateFromParams(); }
          if (e.target?.key === 't') { fl.colT = displayToSi_length(e.value); regenerateFromParams(); }
          if (e.target?.key === 'Es') { fl.colEs = displayToSi_stress(e.value); regenerateFromParams(); }
          if (e.target?.key === 'nuS') { fl.colNuS = e.value; regenerateFromParams(); }
          if (e.target?.key === 'fc') { fl.colFc = displayToSi_stress(e.value); regenerateFromParams(); }
          if (e.target?.key === 'nuC') { fl.colNuC = e.value; regenerateFromParams(); }
        });
      }

      // === VIGAS X (per span) ===
      if (fl.vigasX.length > 0) {
        const vxFolder = folder.addFolder({ title: `Vigas X (${fl.vigasX.length})`, expanded: false });
        addVigaBindings(vxFolder, fl.vigasX, 'x', lr, tr);
      }

      // === VIGAS Y (per span) ===
      if (fl.vigasY.length > 0) {
        const vyFolder = folder.addFolder({ title: `Vigas Y (${fl.vigasY.length})`, expanded: false });
        addVigaBindings(vyFolder, fl.vigasY, 'y', lr, tr);
      }
    }

    // ── VIGAS SECUNDARIAS ──
    sectionsPane.addBlade({ view: 'separator' });
    const secBeamFolder = sectionsPane.addFolder({ title: 'Vigas Secundarias', expanded: false });
    const secBeamObj: Record<string, any> = {
      activar: secondaryBeamsEnabled,
      direccion: secondaryBeamDir === 'x' ? 0 : 1,
      cantidad: nSecondaryBeams,
    };
    secBeamFolder.addBinding(secBeamObj, 'activar', { label: 'Activar' });
    secBeamFolder.addBinding(secBeamObj, 'direccion', { label: 'Corren en', options: { 'X (entre ejes Y)': 0, 'Y (entre ejes X)': 1 } });
    secBeamFolder.addBinding(secBeamObj, 'cantidad', { min: 1, max: 5, step: 1, label: 'Cantidad/vano' });
    secBeamFolder.on('change', (e: any) => {
      if (e.target?.key === 'activar') { secondaryBeamsEnabled = e.value; regenerateFromParams(); }
      if (e.target?.key === 'direccion') { secondaryBeamDir = e.value === 0 ? 'x' : 'y'; regenerateFromParams(); }
      if (e.target?.key === 'cantidad') { nSecondaryBeams = Math.round(e.value); regenerateFromParams(); }
    });

    // ── LOSAS DE PISO ──
    sectionsPane.addBlade({ view: 'separator' });
    const slabFolder = sectionsPane.addFolder({ title: 'Losas de Piso', expanded: true });
    const slabObj = {
      activar: slabEnabled,
      espesor: +siToDisplay_length(slabThickness).toFixed(3),
      subdivX: slabSubdivX,
      subdivY: slabSubdivY,
    };
    slabFolder.addBinding(slabObj, 'activar', { label: 'Activar losas' });
    slabFolder.addBinding(slabObj, 'espesor', { min: lr[0], max: lr[1] * 0.3, step: lr[2], label: `Espesor (${u.length})` });
    slabFolder.addBinding(slabObj, 'subdivX', { min: 1, max: 6, step: 1, label: 'Subdiv. X' });
    slabFolder.addBinding(slabObj, 'subdivY', { min: 1, max: 6, step: 1, label: 'Subdiv. Y' });
    slabFolder.on('change', (e: any) => {
      if (e.target?.key === 'activar') { slabEnabled = e.value; regenerateFromParams(); }
      if (e.target?.key === 'espesor') { slabThickness = displayToSi_length(e.value); regenerateFromParams(); }
      if (e.target?.key === 'subdivX') { slabSubdivX = Math.round(e.value); regenerateFromParams(); }
      if (e.target?.key === 'subdivY') { slabSubdivY = Math.round(e.value); regenerateFromParams(); }
    });

    // ── MUROS DE CORTE ──
    sectionsPane.addBlade({ view: 'separator' });
    const wallFolder = sectionsPane.addFolder({ title: 'Muros de Corte', expanded: true });
    const wallObj = {
      espesor: +siToDisplay_length(wallThickness).toFixed(3),
      subdivH: wallSubdivH,
      subdivW: wallSubdivW,
    };
    wallFolder.addBinding(wallObj, 'espesor', { min: lr[0], max: lr[1], step: lr[2], label: `Espesor (${u.length})` });
    wallFolder.addBinding(wallObj, 'subdivH', { min: 1, max: 6, step: 1, label: 'Subdiv. V' });
    wallFolder.addBinding(wallObj, 'subdivW', { min: 1, max: 6, step: 1, label: 'Subdiv. H' });
    wallFolder.on('change', (e: any) => {
      if (e.target?.key === 'espesor') { wallThickness = displayToSi_length(e.value); regenerateFromParams(); }
      if (e.target?.key === 'subdivH') { wallSubdivH = Math.round(e.value); regenerateFromParams(); }
      if (e.target?.key === 'subdivW') { wallSubdivW = Math.round(e.value); regenerateFromParams(); }
    });

    // Wall placement buttons — quick add for each X-bay and Y-bay
    const nvx_w = edifSvx.length || 1;
    const nvy_w = edifSvy.length || 1;
    const nGridX = nvx_w + 1; // number of X grid lines
    const nGridY = nvy_w + 1; // number of Y grid lines

    // X-direction walls (span in X, sit on Y-axis)
    if (nvx_w > 0) {
      const wxFolder = wallFolder.addFolder({ title: `Muros dir X (${nvx_w} vanos)`, expanded: false });
      for (let bay = 0; bay < nvx_w; bay++) {
        for (let yAxis = 0; yAxis < nGridY; yAxis++) {
          const key = `wx_${bay}_${yAxis}`;
          const hasWall = wallPlacements.some(w => w.dir === 'x' && w.bay === bay && w.axisIdx === yAxis);
          const obj: Record<string, boolean> = {};
          obj[key] = hasWall;
          const label = `Vano X${bay + 1} / Eje Y${String.fromCharCode(65 + yAxis)}`;
          wxFolder.addBinding(obj, key, { label }).on('change', (e: any) => {
            if (e.value) {
              wallPlacements.push({ dir: 'x', bay, axisIdx: yAxis, floors: [-1] });
            } else {
              wallPlacements = wallPlacements.filter(w => !(w.dir === 'x' && w.bay === bay && w.axisIdx === yAxis));
            }
            regenerateFromParams();
          });
        }
      }
    }

    // Y-direction walls (span in Y, sit on X-axis)
    if (nvy_w > 0) {
      const wyFolder = wallFolder.addFolder({ title: `Muros dir Y (${nvy_w} vanos)`, expanded: false });
      for (let bay = 0; bay < nvy_w; bay++) {
        for (let xAxis = 0; xAxis < nGridX; xAxis++) {
          const key = `wy_${bay}_${xAxis}`;
          const hasWall = wallPlacements.some(w => w.dir === 'y' && w.bay === bay && w.axisIdx === xAxis);
          const obj: Record<string, boolean> = {};
          obj[key] = hasWall;
          const label = `Vano Y${bay + 1} / Eje X${xAxis + 1}`;
          wyFolder.addBinding(obj, key, { label }).on('change', (e: any) => {
            if (e.value) {
              wallPlacements.push({ dir: 'y', bay, axisIdx: xAxis, floors: [-1] });
            } else {
              wallPlacements = wallPlacements.filter(w => !(w.dir === 'y' && w.bay === bay && w.axisIdx === xAxis));
            }
            regenerateFromParams();
          });
        }
      }
    }

    // Show count
    if (wallPlacements.length > 0) {
      wallFolder.addBlade({ view: 'separator' });
      const countObj = { muros: `${wallPlacements.length} ubicaciones` };
      wallFolder.addBinding(countObj, 'muros', { label: 'Total', readonly: true });
    }
  }

  /** Replace #parameters Tweakpane with generator-specific sliders + loads panel */
  function rebuildTweakpane() {
    const container = document.getElementById("parameters");
    if (!container) return;

    // Save original HTML once
    if (!savedOriginalHTML) savedOriginalHTML = container.innerHTML;

    // Destroy existing panes
    if (cadPane) { try { cadPane.dispose(); } catch {} cadPane = null; }
    if (loadPane) { try { loadPane.dispose(); } catch {} loadPane = null; }

    // Clear container
    container.innerHTML = "";
    const title = activeGenerator.charAt(0).toUpperCase() + activeGenerator.slice(1);

    // ── Panel 1: Geometry Parameters ──
    cadPane = new Pane({ title: `Parameters — ${title}`, container });
    const geoDefs = GENERATOR_PARAMS()[activeGenerator];
    if (geoDefs) {
      const tweakObj: Record<string, any> = {};
      for (const d of geoDefs) {
        const p = generatorParams[d.key];
        const isBool = p.min === 0 && p.max === 1 && p.step === 1;
        tweakObj[d.key] = isBool ? (p.val >= 0.5) : p.val;
      }
      // Split: numeric sliders vs boolean toggles (DOF checkboxes)
      const boolDefs = geoDefs.filter(d => { const p = generatorParams[d.key]; return p.min === 0 && p.max === 1 && p.step === 1; });
      const numDefs = geoDefs.filter(d => { const p = generatorParams[d.key]; return !(p.min === 0 && p.max === 1 && p.step === 1); });
      for (const d of numDefs) {
        const p = generatorParams[d.key];
        cadPane.addBinding(tweakObj, d.key, { min: p.min, max: p.max, step: p.step, label: p.label });
      }
      if (boolDefs.length > 0) {
        const apoyoFolder = cadPane.addFolder({ title: tr('Apoyos DOFs'), expanded: false });
        for (const d of boolDefs) {
          apoyoFolder.addBinding(tweakObj, d.key, { label: generatorParams[d.key].label });
        }
      }
      // ── Rangos folder (editable intervals, skip booleans) ──
      const rangosFolder = cadPane.addFolder({ title: 'Rangos', expanded: false });
      for (const d of numDefs) {
        const rangeObj = { min: generatorParams[d.key].min, max: generatorParams[d.key].max };
        rangosFolder.addBinding(rangeObj, 'min', { label: `${d.key} min`, step: d.step });
        rangosFolder.addBinding(rangeObj, 'max', { label: `${d.key} max`, step: d.step });
        // Update range when changed
        rangosFolder.on('change', () => {
          if (generatorParams[d.key]) {
            generatorParams[d.key].min = rangeObj.min;
            generatorParams[d.key].max = rangeObj.max;
            // Clamp current value
            if (generatorParams[d.key].val < rangeObj.min) generatorParams[d.key].val = rangeObj.min;
            if (generatorParams[d.key].val > rangeObj.max) generatorParams[d.key].val = rangeObj.max;
          }
          rebuildTweakpane();
          regenerateFromParams();
        });
      }

      cadPane.on("change", (e: any) => {
        const key = e.target?.key as string;
        if (key && generatorParams[key]) {
          generatorParams[key].val = (typeof e.value === 'boolean') ? (e.value ? 1 : 0) : (e.value as number);
          // When nVanosX/nVanosY changes, resize span arrays and rebuild UI
          if (activeGenerator === "edificio" && (key === "nVanosX" || key === "nVanosY" || key === "nPisos")) {
            if (key === "nVanosX" || key === "nVanosY") {
              const nvx = Math.round(generatorParams["nVanosX"].val);
              const nvy = Math.round(generatorParams["nVanosY"].val);
              while (edifSvx.length < nvx) edifSvx.push(edifSvx[edifSvx.length - 1] ?? activeUnits.defaultSpan);
              if (edifSvx.length > nvx) edifSvx.length = nvx;
              while (edifSvy.length < nvy) edifSvy.push(edifSvy[edifSvy.length - 1] ?? activeUnits.defaultSpan * 0.8);
              if (edifSvy.length > nvy) edifSvy.length = nvy;
            }
            if (key === "nPisos" || key === "hPiso") {
              const np = Math.round(generatorParams["nPisos"].val);
              const hp = generatorParams["hPiso"]?.val ?? 3.0;
              while (edifHpisos.length < np) edifHpisos.push(edifHpisos[edifHpisos.length - 1] ?? hp);
              if (edifHpisos.length > np) edifHpisos.length = np;
            }
            rebuildTweakpane();
          }
          regenerateFromParams();
        }
      });
    }

    // ── Edificio: Luces in separate panel (middle column) ──
    if (activeGenerator === "edificio") {
      if (lucesPane) { try { lucesPane.dispose(); } catch {} lucesPane = null; }
      const lucesContainer = document.getElementById("luces-panel");
      if (lucesContainer) {
        lucesContainer.innerHTML = "";
        const u = activeUnits;
        try {
          lucesPane = new Pane({ title: `Luces (${u.length})`, container: lucesContainer });
          // Luces X — per-binding change handler
          const fxFolder = lucesPane.addFolder({ title: `Luces X`, expanded: true });
          for (let i = 0; i < edifSvx.length; i++) {
            const idx = i;
            const obj = { v: edifSvx[i] };
            fxFolder.addBinding(obj, 'v', {
              min: u.spanRange[0], max: u.spanRange[1], step: u.spanRange[2],
              label: `svx${i + 1}`,
            }).on("change", (e: any) => {
              edifSvx[idx] = e.value; regenerateFromParams();
            });
          }
          // Luces Y — per-binding change handler
          const fyFolder = lucesPane.addFolder({ title: `Luces Y`, expanded: true });
          for (let i = 0; i < edifSvy.length; i++) {
            const idx = i;
            const obj = { v: edifSvy[i] };
            fyFolder.addBinding(obj, 'v', {
              min: u.spanRange[0], max: u.spanRange[1], step: u.spanRange[2],
              label: `svy${i + 1}`,
            }).on("change", (e: any) => {
              edifSvy[idx] = e.value; regenerateFromParams();
            });
          }
          // Alturas por piso — per-binding change handler
          if (edifHpisos.length > 0) {
            const fhFolder = lucesPane.addFolder({ title: `Alturas por Piso`, expanded: true });
            for (let i = 0; i < edifHpisos.length; i++) {
              const idx = i;
              const obj = { v: edifHpisos[i] };
              fhFolder.addBinding(obj, 'v', {
                min: u.heightRange[0], max: u.heightRange[1], step: u.heightRange[2],
                label: `Piso ${i + 1}`,
              }).on("change", (e: any) => {
                edifHpisos[idx] = e.value; regenerateFromParams();
              });
            }
          }
        } catch (err) {
          console.error("Luces Tweakpane error:", err);
          // Fallback: show axis diagram only
        }
        // ── Axis diagram (visual summary) ──
        const diagDiv = document.createElement("div");
        diagDiv.style.cssText = "font-family:monospace;font-size:10px;color:#aaa;padding:6px;background:#1a1a2e;border-radius:4px;margin-top:6px;line-height:1.6;white-space:pre;overflow-x:auto;";
        function updateAxisDiagram() {
          const axLabelsX = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          const lvix = generatorParams["Lvix"]?.val || 0;
          const lvdx = generatorParams["Lvdx"]?.val || 0;
          const lviy = generatorParams["Lviy"]?.val || 0;
          const lvdy = generatorParams["Lvdy"]?.val || 0;
          // Ejes X
          let lineX = "X: ";
          if (lvix > 0) lineX += `├${lvix.toFixed(1)}┤`;
          for (let i = 0; i < edifSvx.length; i++) {
            lineX += `[${axLabelsX[i + (lvix > 0 ? 1 : 0)]}]──${edifSvx[i].toFixed(1)}──`;
          }
          lineX += `[${axLabelsX[edifSvx.length + (lvix > 0 ? 1 : 0)]}]`;
          if (lvdx > 0) lineX += `├${lvdx.toFixed(1)}┤`;
          // Ejes Y
          let lineY = "Y: ";
          if (lviy > 0) lineY += `├${lviy.toFixed(1)}┤`;
          for (let i = 0; i < edifSvy.length; i++) {
            lineY += `[${i + 1 + (lviy > 0 ? 1 : 0)}]──${edifSvy[i].toFixed(1)}──`;
          }
          lineY += `[${edifSvy.length + 1 + (lviy > 0 ? 1 : 0)}]`;
          if (lvdy > 0) lineY += `├${lvdy.toFixed(1)}┤`;
          // Pisos
          let lineH = "Z: ";
          for (let i = 0; i < edifHpisos.length; i++) {
            lineH += `P${i + 1}=${edifHpisos[i].toFixed(1)} `;
          }
          diagDiv.textContent = lineX + "\n" + lineY + "\n" + lineH;
        }
        updateAxisDiagram();
        lucesContainer.appendChild(diagDiv);
        // Update diagram when any value changes (observe via MutationObserver fallback)
        const origRegen = regenerateFromParams;
        // We hook into the pane change events above — diagram updates on next rebuild
      }
    }

    // ── Sections: rebuild side panel ──
    rebuildSectionsPane();

    // ── Panel 1b: Support type (ALL generators) + Plate theory (plates only) ──
    if (cadPane) {
      cadPane.addBlade({ view: 'separator' });

      // Support type dropdown (all generators)
      const supportOpts = getSupportOptions()[activeGenerator];
      if (supportOpts && supportOpts.length > 0) {
        const optObj: Record<string, number> = {};
        supportOpts.forEach((o, i) => { optObj[o.label] = i; });
        const supObj = { apoyo: supportType };
        cadPane.addBinding(supObj, 'apoyo', {
          label: 'Apoyo',
          options: optObj,
        }).on('change', (e: any) => { supportType = e.value; regenerateFromParams(); });
      }

      // Plate theory dropdown (only for plates)
      if (activeGenerator === "placa-3q" || activeGenerator === "placa-q4") {
        const plateObj = { teoria: plateTheory };
        cadPane.addBinding(plateObj, 'teoria', {
          label: 'Teoría',
          options: { 'Membrana': 1, 'Kirchhoff (delgada)': 2, 'Mindlin (gruesa)': 3 },
        }).on('change', (e: any) => { plateTheory = e.value; regenerateFromParams(); });
      }
    }

    // ── Panel 2: Cargas Estáticas ──
    const loadDefs = LOAD_PARAMS()[activeGenerator];
    if (loadDefs && loadDefs.length > 0) {
      loadPane = new Pane({ title: `Cargas Estáticas — ${title}`, container });
      const loadObj: Record<string, number> = {};
      for (const d of loadDefs) loadObj[d.key] = loadParams[d.key].val;
      for (const d of loadDefs) {
        loadPane.addBinding(loadObj, d.key, {
          min: loadParams[d.key].min, max: loadParams[d.key].max,
          step: loadParams[d.key].step, label: loadParams[d.key].label,
        });
      }
      // ── Rangos folder for loads ──
      const loadRangosFolder = loadPane.addFolder({ title: 'Rangos', expanded: false });
      for (const d of loadDefs) {
        const rangeObj = { min: loadParams[d.key].min, max: loadParams[d.key].max };
        loadRangosFolder.addBinding(rangeObj, 'min', { label: `${d.key} min`, step: d.step });
        loadRangosFolder.addBinding(rangeObj, 'max', { label: `${d.key} max`, step: d.step });
        loadRangosFolder.on('change', () => {
          if (loadParams[d.key]) {
            loadParams[d.key].min = rangeObj.min;
            loadParams[d.key].max = rangeObj.max;
            if (loadParams[d.key].val < rangeObj.min) loadParams[d.key].val = rangeObj.min;
            if (loadParams[d.key].val > rangeObj.max) loadParams[d.key].val = rangeObj.max;
          }
          rebuildTweakpane();
          regenerateFromParams();
        });
      }

      loadPane.on("change", (e: any) => {
        const key = e.target?.key as string;
        if (key && loadParams[key]) {
          loadParams[key].val = e.value as number;
          // Loads changed → clear and re-run analysis (no geometry change)
          if (mesh.nodeInputs) {
            const ni = mesh.nodeInputs.val;
            if (ni.supports) mesh.nodeInputs.val = { supports: ni.supports };
          }
          setTimeout(() => runAnalysis(), 30);
        }
      });
    }

    // Expose test API for automated testing
    (window as any).__cad = {
      setParam: (key: string, val: number) => {
        if (generatorParams[key]) {
          generatorParams[key].val = val;
          regenerateFromParams();
          rebuildTweakpane();
        } else if (loadParams[key]) {
          loadParams[key].val = val;
          if (mesh.nodeInputs) {
            const ni = mesh.nodeInputs.val;
            if (ni.supports) mesh.nodeInputs.val = { supports: ni.supports };
          }
          setTimeout(() => { runAnalysis(); rebuildTweakpane(); }, 30);
        }
      },
      getParams: () => {
        const out: Record<string, number> = {};
        for (const k in generatorParams) out[k] = generatorParams[k].val;
        for (const k in loadParams) out[k] = loadParams[k].val;
        return out;
      },
      setGenerator,
      createCustomPanel: (title: string, defs: Record<string, any>, onChange?: (params: any) => void) => {
        return createCustomCliPanel(title, defs, onChange);
      },
      removeCustomPanel: (title: string) => {
        removeCustomCliPanel(title);
      },
    };
  }

  // ── Custom CLI Panels (user-created Tweakpane) ──
  const customPanels = new Map<string, { pane: Pane; values: Record<string, any> }>();

  function createCustomCliPanel(title: string, defs: Record<string, any>, onChange?: (params: any) => void): Record<string, any> {
    // Remove existing panel with same title
    removeCustomCliPanel(title);

    // Find or create container
    let container = document.querySelector("#cad3d-custom-panels") as HTMLDivElement;
    if (!container) {
      container = document.createElement("div");
      container.id = "cad3d-custom-panels";
      // Insert after parameters panel
      const paramsEl = document.querySelector("#parameters");
      if (paramsEl) paramsEl.parentElement?.insertBefore(container, paramsEl.nextSibling);
      else document.body.appendChild(container);
    }

    const panelDiv = document.createElement("div");
    panelDiv.className = "cad3d-custom-panel";
    panelDiv.style.marginBottom = "4px";
    container.appendChild(panelDiv);

    const pane = new Pane({ title, container: panelDiv });
    const values: Record<string, any> = {};

    for (const [key, def] of Object.entries(defs)) {
      const label = def.label || key;

      if (Array.isArray(def.value)) {
        // Array param → text input showing comma-separated values
        values[key] = def.value;
        const obj = { [key]: def.value.join(", ") };
        pane.addBinding(obj, key, { label }).on("change", (ev: any) => {
          values[key] = ev.value.split(",").map((s: string) => parseFloat(s.trim())).filter((n: number) => !isNaN(n));
          if (onChange) onChange({ ...values });
        });
      } else if (def.options) {
        // Dropdown
        values[key] = def.value;
        const obj = { [key]: def.value };
        const opts: Record<string, string> = {};
        for (const o of def.options) opts[o] = o;
        pane.addBinding(obj, key, { label, options: opts }).on("change", (ev: any) => {
          values[key] = ev.value;
          if (onChange) onChange({ ...values });
        });
      } else if (typeof def.value === "boolean") {
        // Checkbox
        values[key] = def.value;
        const obj = { [key]: def.value };
        pane.addBinding(obj, key, { label }).on("change", (ev: any) => {
          values[key] = ev.value;
          if (onChange) onChange({ ...values });
        });
      } else if (typeof def.value === "string") {
        // Text input
        values[key] = def.value;
        const obj = { [key]: def.value };
        pane.addBinding(obj, key, { label }).on("change", (ev: any) => {
          values[key] = ev.value;
          if (onChange) onChange({ ...values });
        });
      } else {
        // Number slider
        values[key] = def.value;
        const obj = { [key]: def.value };
        const opts: any = { label };
        if (def.min !== undefined) opts.min = def.min;
        if (def.max !== undefined) opts.max = def.max;
        if (def.step !== undefined) opts.step = def.step;
        pane.addBinding(obj, key, opts).on("change", (ev: any) => {
          values[key] = ev.value;
          if (onChange) onChange({ ...values });
        });
      }
    }

    // Add "Apply" button if onChange is provided
    if (onChange) {
      pane.addButton({ title: "Aplicar" }).on("click", () => {
        onChange({ ...values });
      });
    }

    customPanels.set(title, { pane, values });
    console.log(`Panel "${title}" created with ${Object.keys(defs).length} params`);
    return values;
  }

  function removeCustomCliPanel(title: string) {
    const existing = customPanels.get(title);
    if (existing) {
      try { existing.pane.dispose(); } catch {}
      customPanels.delete(title);
    }
  }

  /** Restore original #parameters Tweakpane */
  function restoreTweakpane() {
    if (cadPane) { try { cadPane.dispose(); } catch {} cadPane = null; }
    if (loadPane) { try { loadPane.dispose(); } catch {} loadPane = null; }
    if (sectionsPane) { try { sectionsPane.dispose(); } catch {} sectionsPane = null; }
    if (lucesPane) { try { lucesPane.dispose(); } catch {} lucesPane = null; }
    // Remove sections div and right-panels-wrapper
    const secDiv = document.getElementById("sections");
    if (secDiv) secDiv.remove();
    sectionsDivCreated = false;
    const wrapper = document.getElementById("right-panels-wrapper");
    const paramsEl = document.getElementById("parameters");
    if (wrapper && paramsEl) {
      // Move parameters back to body (restore original position)
      paramsEl.style.cssText = "";
      document.body.appendChild(paramsEl);
      wrapper.remove();
    }
    if (paramsEl && savedOriginalHTML) {
      paramsEl.innerHTML = savedOriginalHTML;
    }
  }

  // ── Panel flotante ──
  const panel = document.createElement("div");
  panel.id = "cad3d-panel";

  const style = document.createElement("style");
  style.textContent = `
    /* ── CSS Custom Properties (Dark = default) ── */
    :root {
      --fem-bg: rgba(20,20,28,0.97);
      --fem-text: #ccc;
      --fem-border: #555;
      --fem-border-light: #444;
      --fem-border-cell: #333;
      --fem-shadow: rgba(0,0,0,0.6);
      --fem-heading: #0a84ff;
      --fem-section-title: #ee9b00;
      --fem-close: #888;
      --fem-close-hover: #fff;
      --fem-key: #aaa;
      --fem-val: #fff;
      --fem-label: #888;
      --fem-cell-text: #ddd;
      --fem-nonzero: #0f0;
      --fem-header-bg: #222;
      --fem-eq-text: #e8e8ff;
      --fem-eq-var: #7cb3ff;
      --fem-eq-op: #ccc;
      --fem-eq-sub: #aaa;
      --fem-eq-border: #888;
      --fem-eq-dots: #666;
      --fem-eq-box-bg: rgba(255,255,255,0.05);
      --fem-eq-box-border: #444;
      --fem-overlay-bg: rgba(10,10,15,0.97);
      --fem-section-bg: rgba(30,30,50,0.8);
      --fem-coeff-bg: rgba(40,35,20,0.8);
      --fem-numeric-bg: rgba(30,40,30,0.8);
      --fem-step-bg: rgba(255,255,255,0.03);
      --fem-coeff-item-bg: rgba(255,255,255,0.04);
      --fem-btn-bg: #333;
      --fem-btn-hover: #444;
      --fem-btn-text: #0a84ff;
      --fem-btn-hover-text: #fff;
      --fem-frac-border: #999;
      --fem-sym-cell: #aad;
      --fem-sym-nz: #7cb3ff;
      --fem-diag-bg: rgba(255,255,0,0.06);
      --fem-vec-inline: #ccc;
      --fem-full-close-bg: #444;
      --fem-full-close-border: #666;
      /* FEM Studio panel */
      --cad-bg: rgba(30,30,36,0.95);
      --cad-text: #ccc;
      --cad-border: #555;
      --cad-shadow: rgba(0,0,0,0.5);
      --cad-heading: #ee9b00;
      --cad-info: #888;
      --cad-btn-bg: #444;
      --cad-btn-text: #ddd;
      --cad-btn-border: #666;
      --cad-btn-hover-bg: #555;
      --cad-btn-hover-text: #fff;
      --cad-input-bg: #222;
      --cad-input-text: #0f0;
      --cad-input-border: #555;
      --cad-input-placeholder: #666;
      --cad-toggle-text: #888;
      --cad-toggle-hover: #fff;
    }
    /* ── Light theme overrides ── */
    :root.hk-light {
      --fem-bg: rgba(250,250,252,0.97);
      --fem-text: #333;
      --fem-border: #bbb;
      --fem-border-light: #ccc;
      --fem-border-cell: #ccc;
      --fem-shadow: rgba(0,0,0,0.15);
      --fem-heading: #0066cc;
      --fem-section-title: #b87800;
      --fem-close: #888;
      --fem-close-hover: #000;
      --fem-key: #666;
      --fem-val: #111;
      --fem-label: #888;
      --fem-cell-text: #333;
      --fem-nonzero: #006600;
      --fem-header-bg: #e8e8e8;
      --fem-eq-text: #222;
      --fem-eq-var: #0055aa;
      --fem-eq-op: #555;
      --fem-eq-sub: #777;
      --fem-eq-border: #999;
      --fem-eq-dots: #aaa;
      --fem-eq-box-bg: rgba(0,0,0,0.03);
      --fem-eq-box-border: #ccc;
      --fem-overlay-bg: rgba(245,245,248,0.97);
      --fem-section-bg: rgba(240,240,250,0.9);
      --fem-coeff-bg: rgba(255,248,230,0.9);
      --fem-numeric-bg: rgba(240,250,240,0.9);
      --fem-step-bg: rgba(0,0,0,0.02);
      --fem-coeff-item-bg: rgba(0,0,0,0.03);
      --fem-btn-bg: #e0e0e0;
      --fem-btn-hover: #ccc;
      --fem-btn-text: #0066cc;
      --fem-btn-hover-text: #000;
      --fem-frac-border: #888;
      --fem-sym-cell: #336;
      --fem-sym-nz: #0055aa;
      --fem-diag-bg: rgba(255,255,0,0.08);
      --fem-vec-inline: #444;
      --fem-full-close-bg: #ddd;
      --fem-full-close-border: #aaa;
      /* FEM Studio panel light */
      --cad-bg: rgba(248,248,250,0.95);
      --cad-text: #333;
      --cad-border: #bbb;
      --cad-shadow: rgba(0,0,0,0.15);
      --cad-heading: #b87800;
      --cad-info: #888;
      --cad-btn-bg: #e0e0e0;
      --cad-btn-text: #333;
      --cad-btn-border: #bbb;
      --cad-btn-hover-bg: #ccc;
      --cad-btn-hover-text: #000;
      --cad-input-bg: #f0f0f0;
      --cad-input-text: #006600;
      --cad-input-border: #bbb;
      --cad-input-placeholder: #aaa;
      --cad-toggle-text: #888;
      --cad-toggle-hover: #000;
    }
    #cad3d-panel {
      position: fixed; bottom: 10px; left: 10px;
      background: var(--cad-bg); color: var(--cad-text);
      border: 1px solid var(--cad-border); border-radius: 6px;
      padding: 12px 14px; font-family: monospace; font-size: 12px;
      z-index: 999999; width: 200px; box-sizing: border-box;
      max-height: calc(100vh - 20px); overflow-y: auto; overflow-x: hidden;
      user-select: none; cursor: move;
      box-shadow: 0 4px 16px var(--cad-shadow); pointer-events: auto;
      height: auto;
    }
    #cad3d-panel::-webkit-scrollbar { width: 6px; }
    #cad3d-panel::-webkit-scrollbar-track { background: transparent; }
    #cad3d-panel::-webkit-scrollbar-thumb { background: var(--cad-border); border-radius: 3px; }
    #cad3d-panel::-webkit-scrollbar-thumb:hover { background: var(--cad-heading); }
    #cad3d-panel h3 { margin: 0 0 6px 0; color: var(--cad-heading); font-size: 13px; cursor: move; display: flex; justify-content: space-between; align-items: center; }
    #cad3d-panel .info-row { display: flex; justify-content: space-between; padding: 2px 0; }
    #cad3d-panel .info-val { color: var(--fem-val); font-weight: bold; }
    #cad3d-panel .btn-row { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
    #cad3d-panel button { background: var(--cad-btn-bg); color: var(--cad-btn-text); border: 1px solid var(--cad-btn-border); border-radius: 3px; padding: 3px 8px; font-family: monospace; font-size: 11px; cursor: pointer; }
    #cad3d-panel button:hover { background: var(--cad-btn-hover-bg); color: var(--cad-btn-hover-text); }
    #cad3d-panel button.active { background: var(--cad-heading); color: #000; border-color: var(--cad-heading); }
    #cad3d-panel button.view-active { background: var(--fem-heading); color: #fff; border-color: var(--fem-heading); }
    #cad3d-panel .cmd-input { width: 100%; box-sizing: border-box; margin-top: 8px; background: var(--cad-input-bg); color: var(--cad-input-text); border: 1px solid var(--cad-input-border); border-radius: 3px; padding: 4px 6px; font-family: monospace; font-size: 11px; cursor: text; }
    #cad3d-panel .cmd-input::placeholder { color: var(--cad-input-placeholder); }
    #cad3d-panel .section-label { color: var(--cad-info); font-size: 10px; margin-top: 8px; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 1px; }
    /* Collapsed: hide everything except the toggle button */
    #cad3d-panel.collapsed { width: auto; padding: 4px 6px; border-radius: 4px; overflow: hidden; }
    #cad3d-panel.collapsed h3 { display: none; }
    #cad3d-panel.collapsed .panel-body { display: none; }
    #cad3d-panel.collapsed .toggle-btn-collapsed { display: inline-block; }
    #cad3d-panel .toggle-btn-collapsed { display: none; background: var(--cad-heading); color: #000; border: none; border-radius: 3px; padding: 3px 8px; font-family: monospace; font-size: 11px; cursor: pointer; font-weight: bold; }
    #cad3d-panel .toggle-btn-collapsed:hover { background: #ffb300; }
    #cad3d-panel .toggle-btn { background: none; border: none; color: var(--cad-toggle-text); cursor: pointer; font-size: 14px; padding: 0; line-height: 1; }
    #cad3d-panel .toggle-btn:hover { color: var(--cad-toggle-hover); }
    /* ── Mobile: hamburger toggle ── */
    #mobile-menu-btn {
      display: none;
      position: fixed; top: 10px; left: 10px; z-index: 1000001;
      width: 40px; height: 40px; border-radius: 8px;
      background: rgba(30,30,30,0.9); color: #fff; border: 1px solid #555;
      font-size: 22px; cursor: pointer;
      align-items: center; justify-content: center;
      backdrop-filter: blur(4px);
    }
    /* ── Mobile portrait: FEM Studio panel ── */
    @media (max-width: 600px) {
      #mobile-menu-btn { display: flex; }
      #cad3d-panel {
        width: 170px; padding: 8px 10px; font-size: 11px;
        max-height: calc(100vh - 20px); top: 10px; bottom: auto; left: 5px;
        overflow-y: auto;
        display: none;
      }
      #cad3d-panel.mobile-open { display: block; }
      #cad3d-panel button { padding: 2px 5px; font-size: 10px; }
      #cad3d-panel .btn-row { gap: 2px; margin-top: 2px; }
      #cad3d-panel h3 { font-size: 11px; margin-bottom: 4px; }
      #cad3d-panel .cmd-input { font-size: 10px; padding: 3px 4px; margin-top: 4px; }
      #cad3d-panel .section-label { font-size: 9px; margin-top: 4px; }
      #fem-inspect-panel { width: calc(100% - 10px) !important; right: 5px !important; left: 5px !important; top: auto !important; bottom: 5px !important; max-height: 50vh; }
    }
    /* ── Mobile landscape: short height ── */
    @media (max-height: 500px) and (orientation: landscape) {
      #cad3d-panel {
        width: 140px; padding: 4px 6px; font-size: 10px;
        max-height: calc(100vh - 10px); bottom: 5px; left: 5px;
        top: 5px; overflow-y: auto;
      }
      #cad3d-panel h3 { font-size: 10px; margin-bottom: 2px; }
      #cad3d-panel button { padding: 1px 4px; font-size: 9px; }
      #cad3d-panel .btn-row { gap: 1px; margin-top: 1px; }
      #cad3d-panel .section-label { font-size: 8px; margin-top: 2px; }
      #cad3d-panel .cmd-input { font-size: 9px; padding: 2px 3px; margin-top: 2px; }
      /* Collapse sections panel on landscape mobile */
      .cad3d-sections-panel { display: none !important; }
      .cad3d-params-panel { display: none !important; }
      /* Make 3D viewer use full width minus CLI panel */
      canvas { position: fixed !important; top: 0 !important; left: 150px !important; width: calc(100vw - 150px) !important; height: 100vh !important; }
    }
    /* ── Small mobile (< 400px width) ── */
    @media (max-width: 400px) {
      #cad3d-panel {
        width: 130px; padding: 4px 6px; font-size: 9px;
        max-height: 50vh;
      }
      #cad3d-panel button { padding: 1px 3px; font-size: 8px; min-width: 0; }
    }
    #fem-inspect-panel {
      position: fixed; top: 10px; right: 10px;
      background: var(--fem-bg); color: var(--fem-text);
      border: 1px solid var(--fem-border); border-radius: 8px;
      padding: 14px 16px; font-family: monospace; font-size: 11px;
      z-index: 999999; width: 420px; max-height: calc(100vh - 20px);
      overflow-y: auto; box-shadow: 0 4px 20px var(--fem-shadow);
      pointer-events: auto;
    }
    #fem-inspect-panel h3 { margin: 0 0 8px 0; color: var(--fem-heading); font-size: 14px; display: flex; justify-content: space-between; }
    #fem-inspect-panel .close-btn { background: none; border: none; color: var(--fem-close); cursor: pointer; font-size: 16px; }
    #fem-inspect-panel .close-btn:hover { color: var(--fem-close-hover); }
    #fem-inspect-panel .section { margin-top: 10px; border-top: 1px solid var(--fem-border-light); padding-top: 8px; }
    #fem-inspect-panel .section-title { color: var(--fem-section-title); font-size: 12px; font-weight: bold; margin-bottom: 4px; }
    #fem-inspect-panel .prop-row { display: flex; justify-content: space-between; padding: 1px 0; }
    #fem-inspect-panel .prop-key { color: var(--fem-key); }
    #fem-inspect-panel .prop-val { color: var(--fem-val); font-weight: bold; }
    #fem-inspect-panel .matrix-label { color: var(--fem-label); font-size: 10px; margin-top: 6px; }
    #fem-inspect-panel table { border-collapse: collapse; width: 100%; margin-top: 4px; font-size: 10px; }
    #fem-inspect-panel td { border: 1px solid var(--fem-border-cell); padding: 2px 4px; text-align: right; color: var(--fem-cell-text); white-space: nowrap; }
    #fem-inspect-panel td.nonzero { color: var(--fem-nonzero); }
    #fem-inspect-panel td.header { color: var(--fem-section-title); font-weight: bold; background: var(--fem-header-bg); text-align: center; }
    #fem-inspect-panel .result-val { font-size: 13px; color: var(--fem-nonzero); font-weight: bold; }
    #fem-inspect-panel .dof-labels { color: var(--fem-label); font-size: 9px; }
    button.inspect-active { background: #ff4444 !important; color: #fff !important; border-color: #ff4444 !important; }
    /* Math formula rendering */
    .fem-eq { font-family: 'STIX Two Math','Cambria Math','Times New Roman',serif; font-size: 13px; color: var(--fem-eq-text); line-height: 1.6; margin: 6px 0 8px 0; text-align: center; }
    .fem-eq .var { color: var(--fem-eq-var); font-style: italic; }
    .fem-eq .op { color: var(--fem-eq-op); padding: 0 2px; }
    .fem-eq .frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; margin: 0 2px; }
    .fem-eq .frac-num { border-bottom: 1px solid var(--fem-frac-border); padding: 0 4px 1px; font-size: 11px; }
    .fem-eq .frac-den { padding: 1px 4px 0; font-size: 11px; }
    .fem-eq sub { font-size: 0.75em; vertical-align: sub; color: var(--fem-eq-sub); }
    .fem-eq sup { font-size: 0.75em; vertical-align: super; }
    .fem-eq .mat-sym { display: inline-grid; border-left: 2px solid var(--fem-eq-border); border-right: 2px solid var(--fem-eq-border); padding: 2px 6px; margin: 0 4px; vertical-align: middle; gap: 1px 8px; font-size: 11px; }
    .fem-eq .mat-sym .cell { text-align: center; }
    .fem-eq .mat-sym .dots { color: var(--fem-eq-dots); }
    .fem-eq .highlight { color: var(--fem-nonzero); font-weight: bold; }
    .fem-eq .eq-box { background: var(--fem-eq-box-bg); border: 1px solid var(--fem-eq-box-border); border-radius: 4px; padding: 6px 10px; margin: 4px 0; }
    /* Full matrix overlay */
    .fem-full-overlay { position: fixed; inset: 0; background: var(--fem-overlay-bg); z-index: 9999999; overflow: auto; padding: 20px; }
    .fem-full-overlay .close-full { position: fixed; top: 12px; right: 16px; background: var(--fem-full-close-bg); color: var(--fem-val); border: 1px solid var(--fem-full-close-border); border-radius: 4px; padding: 6px 14px; cursor: pointer; font-size: 13px; z-index: 10000000; }
    .fem-full-overlay .close-full:hover { background: var(--fem-btn-hover); }
    .fem-full-overlay h2 { color: var(--fem-section-title); margin: 0 0 16px 0; font-size: 18px; font-family: monospace; }
    .fem-full-sections { display: flex; flex-direction: column; gap: 20px; }
    .fem-full-sections .full-section { background: var(--fem-section-bg); border: 1px solid var(--fem-border); border-radius: 6px; padding: 16px; overflow-x: auto; }
    .fem-full-sections .full-section.coeff { background: var(--fem-coeff-bg); }
    .fem-full-sections .full-section.numeric { background: var(--fem-numeric-bg); }
    .fem-full-sections .side-title { font-size: 13px; color: var(--fem-label); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    .fem-full-sections table { border-collapse: collapse; font-family: monospace; font-size: 11px; }
    .fem-full-sections td { border: 1px solid var(--fem-border-cell); padding: 3px 6px; text-align: right; color: var(--fem-cell-text); white-space: nowrap; }
    .fem-full-sections td.nz { color: var(--fem-nonzero); }
    .fem-full-sections td.hdr { color: var(--fem-section-title); font-weight: bold; background: var(--fem-header-bg); text-align: center; }
    .fem-full-sections td.diag { background: var(--fem-diag-bg); }
    .fem-full-sections .coeff-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px; }

    /* Report Explained (FEM Solver) overlay */
    .fem-solver-overlay { position: fixed; inset: 0; background: #0d1117; z-index: 9999999; overflow: auto; padding: 20px 30px; color: #c9d1d9; font-family: 'Segoe UI', monospace, sans-serif; font-size: 13px; }
    .fem-solver-overlay h2 { color: #58a6ff; margin: 0 0 12px 0; font-size: 20px; }
    .fem-solver-overlay h3 { color: #f0883e; margin: 16px 0 6px 0; font-size: 15px; cursor: pointer; border-bottom: 1px solid #30363d; padding-bottom: 4px; }
    .fem-solver-overlay h3:hover { color: #ffa657; }
    .fem-solver-overlay h4 { color: #7ee787; margin: 8px 0 4px 0; font-size: 13px; cursor: pointer; }
    .fem-solver-overlay h4:hover { color: #a5f3c0; }
    .fem-rpt-close { position: fixed; top: 12px; right: 20px; background: #21262d; color: #c9d1d9; border: 1px solid #30363d; border-radius: 4px; padding: 6px 14px; cursor: pointer; font-size: 14px; z-index: 10000000; }
    .fem-rpt-close:hover { background: #30363d; }
    .fem-rpt-summary { display: flex; gap: 20px; margin-bottom: 12px; color: #8b949e; font-size: 13px; }
    .fem-rpt-summary b { color: #58a6ff; }
    .fem-rpt-body { margin-left: 8px; }
    .fem-rpt-elem { margin: 4px 0; border-left: 2px solid #21262d; padding-left: 8px; }
    .fem-rpt-elem-body { margin: 4px 0 8px 0; }
    .fem-rpt-props { color: #8b949e; font-size: 11px; margin: 2px 0; }
    .fem-rpt-mtx-title { color: #f78166; font-size: 11px; font-weight: bold; margin: 6px 0 2px 0; }
    .fem-rpt-matrix { border-collapse: collapse; font-family: 'Consolas', monospace; font-size: 10px; }
    .fem-rpt-matrix td { padding: 1px 5px; text-align: right; border: 1px solid #21262d; white-space: nowrap; }
    .fem-rpt-matrix .fem-hdr { color: #58a6ff; font-weight: bold; text-align: center; background: #161b22; font-size: 9px; }
    .fem-full-sections .coeff-item { background: var(--fem-coeff-item-bg); border: 1px solid var(--fem-eq-box-border); border-radius: 4px; padding: 8px 12px; font-family: 'STIX Two Math','Cambria Math','Times New Roman',serif; font-size: 13px; color: var(--fem-eq-text); line-height: 1.6; }
    .fem-full-sections .coeff-item .var { color: var(--fem-eq-var); font-style: italic; }
    .fem-full-sections .coeff-item .frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; margin: 0 2px; }
    .fem-full-sections .coeff-item .frac-num { border-bottom: 1px solid var(--fem-frac-border); padding: 0 4px 1px; font-size: 11px; }
    .fem-full-sections .coeff-item .frac-den { padding: 1px 4px 0; font-size: 11px; }
    .fem-full-sections .coeff-item .highlight { color: var(--fem-nonzero); font-weight: bold; }
    .fem-full-sections .coeff-item sub { font-size: 0.75em; vertical-align: sub; color: var(--fem-eq-sub); }
    .fem-full-sections .coeff-item sup { font-size: 0.75em; vertical-align: super; }
    /* Step-by-step force recovery */
    .fem-step { background: var(--fem-step-bg); border: 1px solid var(--fem-eq-box-border); border-radius: 4px; padding: 8px 12px; margin: 6px 0; font-family: 'STIX Two Math','Cambria Math','Times New Roman',serif; font-size: 12px; color: var(--fem-eq-text); overflow-x: auto; }
    .fem-step .step-title { color: var(--fem-section-title); font-weight: bold; font-size: 11px; margin-bottom: 4px; font-family: monospace; }
    .fem-step .step-eq { margin: 4px 0; }
    .fem-step .var { color: var(--fem-eq-var); font-style: italic; }
    .fem-step .highlight { color: var(--fem-nonzero); font-weight: bold; }
    .fem-step .vec-inline { color: var(--fem-vec-inline); font-family: monospace; font-size: 11px; }
    .fem-step sub { font-size: 0.75em; vertical-align: sub; color: var(--fem-eq-sub); }
    .fem-step .frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; margin: 0 2px; }
    .fem-step .frac-num { border-bottom: 1px solid var(--fem-frac-border); padding: 0 4px 1px; font-size: 10px; }
    .fem-step .frac-den { padding: 1px 4px 0; font-size: 10px; }
    .fem-full-sym { font-family: 'STIX Two Math','Cambria Math','Times New Roman',serif; }
    .fem-full-sym table { font-family: 'STIX Two Math','Cambria Math',serif; font-size: 13px; }
    .fem-full-sym td { border: 1px solid var(--fem-eq-box-border); padding: 4px 8px; text-align: center; color: var(--fem-sym-cell); vertical-align: middle; }
    .fem-full-sym td.nz { color: var(--fem-sym-nz); }
    .fem-full-sym .frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; margin: 0 1px; line-height: 1.2; }
    .fem-full-sym .frac-num { border-bottom: 1px solid var(--fem-eq-border); padding: 0 3px 1px; font-size: 11px; white-space: nowrap; }
    .fem-full-sym .frac-den { padding: 1px 3px 0; font-size: 11px; white-space: nowrap; }
    .fem-full-sym .var { color: var(--fem-sym-nz); font-style: italic; }
    .fem-full-sym sub { font-size: 0.7em; vertical-align: sub; color: var(--fem-eq-sub); }
    .fem-expand-btn { background: var(--fem-btn-bg); color: var(--fem-btn-text); border: 1px solid var(--fem-border); border-radius: 3px; padding: 2px 8px; cursor: pointer; font-size: 10px; margin-left: 8px; }
    .fem-expand-btn:hover { background: var(--fem-btn-hover); color: var(--fem-btn-hover-text); }
  `;
  document.head.appendChild(style);

  // Sync theme class on <html> element
  if (getThemeName() === "light") document.documentElement.classList.add("hk-light");
  onThemeChange((name) => {
    if (name === "light") document.documentElement.classList.add("hk-light");
    else document.documentElement.classList.remove("hk-light");
    // Recreate grid + axes with new theme colors (keep current camera)
    if (activeGenerator) {
      autoFitGridSize(true);
    }
  });

  panel.innerHTML = `
    <button class="toggle-btn-collapsed" id="cad3d-expand">FEM Studio</button>
    <h3>FEM Studio <span style="font-size:10px;color:var(--cad-info);margin-left:6px" id="cad3d-info">0n 0e</span><button class="toggle-btn" id="cad3d-toggle">_</button></h3>
    <div class="panel-body">
      <div class="btn-row">
        <button data-ex="truss">Cercha</button>
        <button data-ex="beams">Portico</button>
        <button data-ex="3d">Torre</button>
        <button data-ex="galpon">Galpon</button>
        <button data-ex="edificio">Edificio</button>
        <button data-ex="edif-muros">Edif. Muros</button>
        <button data-ex="edif-acero">Edif. Acero</button>
        <button data-ex="edif-acero-diag">Acero+Diag</button>
        <button data-ex="edif-mixto">Edif. Mixto</button>
        <button data-ex="mezanine">Mezanine</button>
        <button data-ex="barra">Barra</button>
        <button data-ex="placa3q">Placa 3Q</button>
        <button data-ex="placa">Placa Q4</button>
      </div>
      <div class="btn-row" style="margin-top:2px">
        <button data-ex="losa-rect">Losa Rect</button>
        <button data-ex="losa-plana">Losa Plana</button>
        <button data-ex="viga-alta">Viga Alta</button>
      </div>
      <div class="btn-row" style="margin-top:2px">
        <button data-ex="muro-contencion">Muro Cont.</button>
        <button data-ex="zapata">Zapata</button>
        <button data-ex="placa-orificios">Placa Base</button>
        <button data-ex="col-placa">Col+Placa 3D</button>
        <button data-ex="talud">Talud</button>
      </div>
      <div class="btn-row" style="margin-top:2px">
        <button data-ex="eiffel">Eiffel</button>
        <button data-ex="arco">Arco</button>
        <button data-ex="puente">Puente</button>
        <button data-ex="twisted">Twist</button>
        <button data-ex="burj">Burj</button>
        <button data-ex="opera">Opera</button>
        <button data-ex="diagrid">Diagrid</button>
        <button data-ex="muro-q4">Muro Q4</button>
        <button data-ex="viga-q4">Viga Q4</button>
        <button data-ex="placa-xy">Placa XY</button>
        <button data-ex="pergola" data-i18n="Pérgola">Pérgola</button>
      </div>
      <div class="btn-row" style="margin-top:4px">
        <button data-view="3d" class="view-active">3D</button>
        <button data-view="plan">Plan</button>
        <button data-view="elevX">EX</button>
        <button data-view="elevY">EY</button>
        <button id="cad3d-select">Select</button>
        <button id="cad3d-draw">Draw</button>
        <button id="cad3d-inspect">Inspect</button>
      </div>
      <div class="btn-row" id="cad3d-axis-buttons" style="margin-top:2px;display:none"></div>
      <div class="btn-row" id="cad3d-floor-buttons" style="margin-top:2px;display:none"></div>
      <div class="btn-row" style="margin-top:2px">
        <button id="cad3d-new-model" title="Nuevo modelo vacío">🆕 New</button>
        <button id="cad3d-export" title="Exportar coordenadas y datos del modelo">📋 Export</button>
        <select id="cad3d-io-menu" title="Import/Export modelos" style="background:var(--cad-btn-bg);color:var(--cad-btn-text);border:1px solid var(--cad-btn-border);padding:2px 4px;font-size:11px;cursor:pointer;">
          <option value="">📂 I/O</option>
          <option value="import-e2k">📥 Import E2K (ETABS)</option>
          <option value="import-s2k">📥 Import S2K (SAP2000)</option>
          <option value="import-ifc">📥 Import IFC (Revit/ArchiCAD)</option>
          <option value="export-e2k">📤 Export E2K (ETABS)</option>
          <option value="export-s2k">📤 Export S2K (SAP2000)</option>
          <option value="import-py">📥 Import OpenSeesPy</option>
          <option value="export-py">📤 Export OpenSeesPy</option>
          <option value="import-tcl">📥 Import OpenSees Tcl</option>
          <option value="export-tcl">📤 Export OpenSees Tcl</option>
        </select>
        <input type="file" id="cad3d-io-file" accept=".e2k,.E2K,.s2k,.S2K,.py,.tcl,.ifc,.IFC" style="display:none">
        <select id="cad3d-tests-menu" title="Validation tests vs ETABS" style="background:var(--cad-btn-bg);color:var(--cad-btn-text);border:1px solid var(--cad-btn-border);padding:2px 4px;font-size:11px;cursor:pointer;">
          <option value="">🧪 Tests</option>
          <option value="test-cantilever">1. Cantilever (Exact)</option>
          <option value="test-portal-1p">2. Portal 1-Story (ETABS)</option>
          <option value="test-portal-2p">3. Portal 2-Story (ETABS)</option>
          <option value="test-wall-only">4. Wall Q4 Only (ETABS)</option>
          <option value="test-portal-wall">5. Portal + Wall (ETABS)</option>
          <option value="test-wilson-beam">6. Wilson Cantilever Q4 (incomp.)</option>
          <!-- Scordelis-Lo requires MITC4 for curved shells - not yet implemented -->
          <option value="test-all">▶ Run All Tests</option>
        </select>
        <select id="cad3d-force-unit" title="Unidad de fuerza" style="background:var(--cad-btn-bg);color:var(--cad-btn-text);border:1px solid var(--cad-btn-border);padding:2px 4px;font-size:11px;cursor:pointer;">
          <option value="tonf">tonf</option><option value="kN">kN</option><option value="kgf">kgf</option>
          <option value="kip">kip</option><option value="lb">lb</option><option value="N">N</option>
        </select>
        <select id="cad3d-length-unit" title="Unidad de longitud" style="background:var(--cad-btn-bg);color:var(--cad-btn-text);border:1px solid var(--cad-btn-border);padding:2px 4px;font-size:11px;cursor:pointer;">
          <option value="m">m</option><option value="cm">cm</option><option value="mm">mm</option>
          <option value="ft">ft</option><option value="in">in</option>
        </select>
        <button id="cad3d-btn-clear" style="margin-left:auto">Clear</button>
      </div>
      <div class="btn-row" style="margin-top:2px">
        <button data-preset="MKS" class="active" title="tonf+m, esfuerzos kgf/cm²">MKS</button>
        <button data-preset="SI" title="kN+m, esfuerzos kPa">SI</button>
        <button data-preset="US" title="kip+in, esfuerzos ksi">US</button>
      </div>
      <div class="btn-row" style="margin-top:4px">
        <button id="cad3d-modal" title="Análisis modal (frecuencias y modos)">⚡ Modal</button>
        <button id="cad3d-mode-prev" style="display:none" title="Modo anterior">◀</button>
        <button id="cad3d-mode-next" style="display:none" title="Modo siguiente">▶</button>
        <input id="cad3d-modal-scale" type="number" min="0.1" max="100" step="0.5" value="3.7" style="display:none;width:40px;font-size:10px;padding:1px 3px;background:var(--cad-bg);color:var(--cad-heading);border:1px solid var(--cad-border);border-radius:3px;text-align:center" title="Escala de animacion (% de la diagonal; 3.7 = SAP2000 Automatic)" />
      </div>
      <div id="cad3d-mode-label" style="display:none;color:var(--cad-heading);font-size:10px;line-height:16px;padding:2px 4px;white-space:nowrap;overflow-x:auto">Modo 1</div>
      <div class="btn-row" style="margin-top:2px">
        <button id="cad3d-nonlinear" title="Análisis no-lineal dinámico (BRB + sismo)">🔥 Nonlinear</button>
        <button id="cad3d-pushover" title="Pushover cíclico con histéresis">📊 Pushover</button>
        <button id="cad3d-fem-solver" title="Report Explained: derivación FEM paso a paso de todos los elementos">📐 Report Explained</button>
        <button id="cad3d-calc" title="Calculadora FEM: editor MATLAB + output KaTeX">🧮 Cálculo</button>
        <button id="cad3d-log" title="Ver log del solver">📋 Log</button>
      </div>
      <div class="btn-row" style="margin-top:2px">
        <button id="cad3d-cli-toggle" title="Abrir/cerrar consola CLI">⌨ CLI</button>
      </div>
      <div id="cad3d-cli-panel" style="display:none;margin-top:2px;background:rgba(0,0,0,0.8);border:1px solid #444;border-radius:4px;padding:4px;max-height:200px;overflow-y:auto">
        <div id="cad3d-cli-output" style="font-family:monospace;font-size:10px;color:#0f0;white-space:pre-wrap;max-height:140px;overflow-y:auto;margin-bottom:4px"></div>
        <input class="cmd-input" id="cad3d-cmd" placeholder="cad.addNode(0,0,0) | cad.building([5,5],[4],3) | cad.info()" style="width:100%;font-family:monospace" />
      </div>
    </div>
  `;

  // ── Export Panel (coordenadas y datos copiables) ──
  let exportOverlay: HTMLDivElement | null = null;

  function buildExportText(): string {
    const ns = mesh.nodes.val;
    const es = mesh.elements.val;
    const ni = mesh.nodeInputs?.val;
    const ei = mesh.elementInputs?.val;
    const u = activeLengthId;
    const f = activeForceId;
    const lines: string[] = [];

    lines.push(`# Hekatan Struct — Model Export`);
    lines.push(`# Generator: ${activeGenerator || "custom"}`);
    lines.push(`# Units: ${f}, ${u}`);
    lines.push(`# ${new Date().toISOString()}`);
    lines.push("");

    // ── Nodes ──
    lines.push(`## NODES (${ns.length})`);
    lines.push(`# idx     X          Y          Z`);
    ns.forEach((n, i) => {
      lines.push(`  ${String(i).padStart(4)}  ${n[0].toFixed(4).padStart(10)}  ${n[1].toFixed(4).padStart(10)}  ${n[2].toFixed(4).padStart(10)}`);
    });
    lines.push("");

    // ── Elements ──
    lines.push(`## ELEMENTS (${es.length})`);
    lines.push(`# idx    nodeI  nodeJ`);
    es.forEach((e, i) => {
      const cols = e.map(v => String(v).padStart(6)).join("");
      lines.push(`  ${String(i).padStart(4)}  ${cols}`);
    });
    lines.push("");

    // ── Supports ──
    if (ni?.supports && ni.supports.size > 0) {
      lines.push(`## SUPPORTS (${ni.supports.size})`);
      lines.push(`# node   Ux  Uy  Uz  Rx  Ry  Rz`);
      ni.supports.forEach((dofs, idx) => {
        const d = (dofs as boolean[]).map(v => v ? "  1" : "  0").join("");
        lines.push(`  ${String(idx).padStart(4)} ${d}`);
      });
      lines.push("");
    }

    // ── Loads ──
    if (ni?.loads && ni.loads.size > 0) {
      lines.push(`## LOADS (${ni.loads.size})`);
      lines.push(`# node         Fx          Fy          Fz          Mx          My          Mz`);
      ni.loads.forEach((load, idx) => {
        const vals = (load as number[]).map(v => v.toFixed(3).padStart(11)).join(" ");
        lines.push(`  ${String(idx).padStart(4)}  ${vals}`);
      });
      lines.push("");
    }

    // ── Element Properties ──
    if (ei) {
      lines.push(`## ELEMENT PROPERTIES`);
      const props = [
        { name: "E", map: ei.elasticities },
        { name: "A", map: ei.areas },
        { name: "Iz", map: ei.momentsOfInertiaZ },
        { name: "Iy", map: ei.momentsOfInertiaY },
        { name: "G", map: ei.shearModuli },
        { name: "J", map: ei.torsionalConstants },
        { name: "rho", map: (ei as any).densities },
      ];
      const header = `# elem  ` + props.map(p => p.name.padStart(12)).join(" ");
      lines.push(header);
      for (let i = 0; i < es.length; i++) {
        const vals = props.map(p => {
          const v = p.map?.get(i);
          return v !== undefined ? v.toExponential(4).padStart(12) : "           -";
        }).join(" ");
        lines.push(`  ${String(i).padStart(4)}  ${vals}`);
      }
      lines.push("");
    }

    // ── Deformation Results ──
    const def = mesh.deformOutputs?.val?.deformations;
    if (def && def.size > 0) {
      lines.push(`## DISPLACEMENTS (${def.size} nodes)`);
      lines.push(`# node          Ux           Uy           Uz           Rx           Ry           Rz`);
      def.forEach((d, idx) => {
        const vals = (d as number[]).map(v => v.toExponential(4).padStart(12)).join(" ");
        lines.push(`  ${String(idx).padStart(4)}  ${vals}`);
      });
      lines.push("");
    }

    const react = mesh.deformOutputs?.val?.reactions;
    if (react && react.size > 0) {
      lines.push(`## REACTIONS (${react.size} supports)`);
      lines.push(`# node          Rx           Ry           Rz           Mx           My           Mz`);
      react.forEach((r, idx) => {
        const vals = (r as number[]).map(v => v.toFixed(4).padStart(12)).join(" ");
        lines.push(`  ${String(idx).padStart(4)}  ${vals}`);
      });
      lines.push("");
    }

    // ── CLI command to reproduce ──
    if (activeGenerator) {
      lines.push(`## CLI COMMAND`);
      const pEntries = Object.entries(generatorParams).map(([k, v]) => `${k}=${v.val}`).join(" ");
      lines.push(`cad.${activeGenerator === "edificio" ? "building" : activeGenerator}(${pEntries})`);
    }

    return lines.join("\n");
  }

  let exportMinimized = false;

  function showExportPanel() {
    // Toggle: if open, close
    if (exportOverlay) { exportOverlay.remove(); exportOverlay = null; exportMinimized = false; return; }

    const text = buildExportText();
    exportOverlay = document.createElement("div");
    exportOverlay.id = "export-overlay";
    exportOverlay.style.cssText = `
      position:fixed; bottom:10px; right:10px; z-index:10000;
      width:720px; max-width:90vw;
      display:flex; flex-direction:column;
      font-family:monospace; color:var(--cad-text,#ccc);
      background:var(--cad-bg,#1a1a2e); border:1px solid var(--cad-border,#333);
      border-radius:8px; box-shadow:0 4px 20px rgba(0,0,0,0.5);
      transition: height 0.2s ease;
    `;
    exportOverlay.innerHTML = `
      <div id="export-header" style="display:flex; align-items:center; justify-content:space-between;
        padding:8px 12px; border-bottom:1px solid var(--cad-border,#333); cursor:default;
        border-radius:8px 8px 0 0; background:var(--cad-bg,#1a1a2e);">
        <span style="font-size:12px; font-weight:bold; color:var(--cad-heading,#e0e0e0);">
          📋 Export — ${mesh.nodes.val.length}n ${mesh.elements.val.length}e
        </span>
        <div style="display:flex; gap:4px;">
          <button id="export-copy" style="padding:3px 8px; font-size:11px; cursor:pointer;
            background:#2d6a4f; color:#fff; border:1px solid #40916c; border-radius:3px;" title="Copiar al clipboard">
            📋 Copy
          </button>
          <button id="export-json" style="padding:3px 8px; font-size:11px; cursor:pointer;
            background:#1d3557; color:#fff; border:1px solid #457b9d; border-radius:3px;" title="Formato JSON">
            {} JSON
          </button>
          <button id="export-minimize" style="padding:3px 8px; font-size:11px; cursor:pointer;
            background:#555; color:#fff; border:1px solid #777; border-radius:3px;" title="Minimizar / Restaurar">
            ▬
          </button>
          <button id="export-close" style="padding:3px 8px; font-size:11px; cursor:pointer;
            background:#6c757d; color:#fff; border:1px solid #888; border-radius:3px;" title="Cerrar">
            ✕
          </button>
        </div>
      </div>
      <div id="export-body" style="display:flex; flex-direction:column; padding:8px 12px;">
        <textarea id="export-text" readonly style="height:350px; resize:vertical;
          font-family:'Cascadia Code','Fira Code',monospace; font-size:11px; line-height:1.4;
          background:#0d1117; color:#c9d1d9; border:1px solid #30363d; border-radius:4px;
          padding:10px; white-space:pre; overflow:auto; tab-size:8;"
        >${text.replace(/</g,"&lt;")}</textarea>
        <div id="export-status" style="font-size:11px; color:#40916c; margin-top:4px; height:14px;"></div>
      </div>
    `;
    document.body.appendChild(exportOverlay);

    // Close
    exportOverlay.querySelector("#export-close")?.addEventListener("click", () => {
      exportOverlay?.remove(); exportOverlay = null; exportMinimized = false;
    });

    // Minimize / Restore
    exportOverlay.querySelector("#export-minimize")?.addEventListener("click", () => {
      const body = exportOverlay!.querySelector("#export-body") as HTMLElement;
      const btn = exportOverlay!.querySelector("#export-minimize") as HTMLElement;
      exportMinimized = !exportMinimized;
      if (exportMinimized) {
        body.style.display = "none";
        btn.textContent = "▢";
        btn.title = "Restaurar";
        exportOverlay!.style.width = "auto";
      } else {
        body.style.display = "flex";
        btn.textContent = "▬";
        btn.title = "Minimizar";
        exportOverlay!.style.width = "720px";
      }
    });

    // Copy text
    exportOverlay.querySelector("#export-copy")?.addEventListener("click", () => {
      const ta = exportOverlay!.querySelector("#export-text") as HTMLTextAreaElement;
      navigator.clipboard.writeText(ta.value).then(() => {
        const st = exportOverlay!.querySelector("#export-status") as HTMLElement;
        st.textContent = "✓ Copiado al clipboard";
        setTimeout(() => st.textContent = "", 2000);
      });
    });

    // JSON export
    exportOverlay.querySelector("#export-json")?.addEventListener("click", () => {
      const ns = mesh.nodes.val;
      const es = mesh.elements.val;
      const ni = mesh.nodeInputs?.val;
      const ei = mesh.elementInputs?.val;
      const json: any = {
        generator: activeGenerator || "custom",
        units: { force: activeForceId, length: activeLengthId },
        nodes: ns.map((n, i) => ({ id: i, x: n[0], y: n[1], z: n[2] })),
        elements: es.map((e, i) => ({ id: i, nodes: e })),
      };
      if (ni?.supports) {
        json.supports = [] as any[];
        ni.supports.forEach((dofs, idx) => json.supports.push({ node: idx, dofs }));
      }
      if (ni?.loads) {
        json.loads = [] as any[];
        ni.loads.forEach((load, idx) => json.loads.push({ node: idx, forces: load }));
      }
      if (ei) {
        json.properties = {} as any;
        if (ei.elasticities) json.properties.E = Object.fromEntries(ei.elasticities);
        if (ei.areas) json.properties.A = Object.fromEntries(ei.areas);
        if (ei.momentsOfInertiaZ) json.properties.Iz = Object.fromEntries(ei.momentsOfInertiaZ);
        if (ei.momentsOfInertiaY) json.properties.Iy = Object.fromEntries(ei.momentsOfInertiaY);
        if (ei.shearModuli) json.properties.G = Object.fromEntries(ei.shearModuli);
        if (ei.torsionalConstants) json.properties.J = Object.fromEntries(ei.torsionalConstants);
      }
      const def = mesh.deformOutputs?.val?.deformations;
      if (def && def.size > 0) {
        json.displacements = {} as any;
        def.forEach((d, idx) => json.displacements[idx] = d);
      }
      const react = mesh.deformOutputs?.val?.reactions;
      if (react && react.size > 0) {
        json.reactions = {} as any;
        react.forEach((r, idx) => json.reactions[idx] = r);
      }

      const ta = exportOverlay!.querySelector("#export-text") as HTMLTextAreaElement;
      ta.value = JSON.stringify(json, null, 2);
      const st = exportOverlay!.querySelector("#export-status") as HTMLElement;
      st.textContent = "Formato JSON activo — presiona Copy para copiar";
    });
  }

  function updatePanel() {
    const info = panel.querySelector("#cad3d-info");
    if (info) {
      const n = mesh.nodes.val.length;
      const elems = mesh.elements.val;
      const e = elems.length;
      const s = mesh.nodeInputs?.val?.supports?.size || 0;

      // Count by type
      let nFrames = 0, nTri = 0, nQ4 = 0;
      for (const el of elems) {
        if (el.length === 2) nFrames++;
        else if (el.length === 3) nTri++;
        else if (el.length === 4) nQ4++;
      }

      let txt = `${n}n ${e}e ${s}s`;
      if (nQ4 > 0 || nTri > 0) {
        txt += ` | ${nFrames}fr`;
        if (nQ4 > 0) txt += ` ${nQ4}q4`;
        if (nTri > 0) txt += ` ${nTri}tri`;
      }
      info.textContent = txt;
    }
  }

  // ── Modal Analysis & Animation ──

  /** Run modal analysis (eigenvalues) on current model */
  function runModalAnalysis() {
    if (!modalEnabled) return;
    if (!mesh.nodeInputs || !mesh.elementInputs) return;
    const nodes = mesh.nodes.val;
    const elements = mesh.elements.val;
    const ni = mesh.nodeInputs.val;
    const ei = mesh.elementInputs.val;
    if (nodes.length === 0 || elements.length === 0) return;
    if (!ni.supports || ni.supports.size === 0) return;
    if (!ei.densities || ei.densities.size === 0) return;

    try {
      const numModes = Math.min(12, nodes.length * 6 - ni.supports.size * 6);
      if (numModes <= 0) return;
      const out = modalAnalysis(nodes, elements, ni, ei, Math.min(numModes, 12));
      if (out.frequencies && out.frequencies.length > 0) {
        modalResults = out;
        modalOriginalNodes = nodes.map(n => [...n] as Node);
        modalMode = 0;

        // Auto-scale: make max modal displacement ~10% of model extent
        const { extent } = getModelBounds();
        const shape = out.modeShapes?.[0];
        if (shape) {
          let maxDisp = 0;
          for (let i = 0; i < nodes.length; i++) {
            const dx = shape[i * 6] || 0, dy = shape[i * 6 + 1] || 0, dz = shape[i * 6 + 2] || 0;
            maxDisp = Math.max(maxDisp, Math.sqrt(dx * dx + dy * dy + dz * dz));
          }
          modalScale = maxDisp > 1e-12 ? (extent * 0.05) / maxDisp : 1;
          // modalScale target = extent * 0.05
        }

        // Show modal table
        const title = `${activeGenerator} — ${nodes.length}n ${elements.length}e`;
        modalPanel.render(out, { title });
        modalPanel.div.style.display = "";

        // Start animation
        startModalAnimation();
        console.log(`Modal: ${out.frequencies.length} modos. f₁ = ${out.frequencies[0].toFixed(4)} Hz`);
      }
    } catch (err: any) {
      console.warn("Modal analysis failed:", err.message);
      modalResults = null;
    }
  }

  /** Stop modal animation and restore original positions */
  function stopModalAnimation() {
    if (modalAnimId) { cancelAnimationFrame(modalAnimId); modalAnimId = 0; }
    // Restore original nodes
    if (modalOriginalNodes.length > 0) {
      mesh.nodes.val = modalOriginalNodes.map(n => [...n] as Node);
    }
    modalPanel.div.style.display = "none";
    modalResults = null;
  }

  /** Animate the selected modal shape (sinusoidal oscillation) */
  function startModalAnimation() {
    if (modalAnimId) cancelAnimationFrame(modalAnimId);
    if (!modalResults?.modeShapes || !modalOriginalNodes.length) return;

    const shape = modalResults.modeShapes[modalMode];
    if (!shape) return;
    const freq = modalResults.frequencies?.[modalMode] || 1;
    const visFreq = Math.max(0.5, Math.min(3, freq * 0.1));
    const t0 = performance.now();
    const nNodes = modalOriginalNodes.length;
    const elems = mesh.elements.rawVal;

    // Compute modal scale from user input (% of model extent)
    // Amplitud del modo: % de la DIAGONAL, con LA constante (`shared/modeScale.ts`).
    // Antes: 5 % del LADO MAYOR. El mismo modo daba tres amplitudes distintas
    // en el CAD, el visor y el GIF.
    const extent = modelDiagonal(mesh.nodes.val);
    const scaleInput = panel.querySelector("#cad3d-modal-scale") as HTMLInputElement;
    const scalePct = scaleInput
      ? parseFloat(scaleInput.value) || MODE_SCALE_PERCENT
      : MODE_SCALE_PERCENT;
    let maxDisp = 0;
    for (let i = 0; i < nNodes; i++) {
      const dx = shape[i * 6] || 0, dy = shape[i * 6 + 1] || 0, dz = shape[i * 6 + 2] || 0;
      maxDisp = Math.max(maxDisp, Math.sqrt(dx * dx + dy * dy + dz * dz));
    }
    const mScale = maxDisp > 1e-12 ? (extent * scalePct / 100) / maxDisp : 1;

    // Find Three.js objects in scene to update directly (bypass reactive system)
    const ctx = getViewerCtx();
    if (!ctx) return;
    let pointsObj: THREE.Points | null = null;
    let linesObj: THREE.LineSegments | null = null;
    let shellMeshObj: THREE.Mesh | null = null;
    ctx.scene.traverse((obj: any) => {
      if (!pointsObj && obj.isPoints && obj.geometry) pointsObj = obj;
      if (!linesObj && obj.isLineSegments && obj.geometry && !obj.name) linesObj = obj;
      // Find shell panel mesh (MeshBasicMaterial with transparency for shell faces)
      if (!shellMeshObj && obj.isMesh && obj.material?.transparent && obj.material?.opacity < 0.5 && obj.geometry) shellMeshObj = obj;
    });

    // Hide load arrows during modal (managed by modal toggle, not here)

    // Pre-allocate typed arrays for direct buffer updates
    const nodeBuffer = new Float32Array(nNodes * 3);
    // Build element edge list once
    const edges: [number, number][] = [];
    for (const e of elems) {
      if (e.length === 2) { edges.push([e[0], e[1]]); }
      else { for (let i = 0; i < e.length; i++) edges.push([e[i], e[(i + 1) % e.length]]); }
    }
    const lineBuffer = new Float32Array(edges.length * 6);

    function animate() {
      const t = (performance.now() - t0) / 1000;
      const amp = Math.sin(2 * Math.PI * visFreq * t) * mScale;

      // Compute displaced positions into nodeBuffer
      for (let i = 0; i < nNodes; i++) {
        const o = modalOriginalNodes[i];
        nodeBuffer[i * 3]     = o[0] + (shape[i * 6] || 0) * amp;
        nodeBuffer[i * 3 + 1] = o[1] + (shape[i * 6 + 1] || 0) * amp;
        nodeBuffer[i * 3 + 2] = o[2] + (shape[i * 6 + 2] || 0) * amp;
      }

      // Update node points geometry directly
      if (pointsObj) {
        const geom = (pointsObj as THREE.Points).geometry;
        const attr = geom.getAttribute("position") as THREE.BufferAttribute;
        if (attr && attr.array.length === nodeBuffer.length) {
          (attr.array as Float32Array).set(nodeBuffer);
          attr.needsUpdate = true;
        } else {
          geom.setAttribute("position", new THREE.Float32BufferAttribute(nodeBuffer.slice(), 3));
        }
      }

      // Update element lines geometry directly
      if (linesObj) {
        for (let e = 0; e < edges.length; e++) {
          const [a, b] = edges[e];
          lineBuffer[e * 6]     = nodeBuffer[a * 3];
          lineBuffer[e * 6 + 1] = nodeBuffer[a * 3 + 1];
          lineBuffer[e * 6 + 2] = nodeBuffer[a * 3 + 2];
          lineBuffer[e * 6 + 3] = nodeBuffer[b * 3];
          lineBuffer[e * 6 + 4] = nodeBuffer[b * 3 + 1];
          lineBuffer[e * 6 + 5] = nodeBuffer[b * 3 + 2];
        }
        const geom = (linesObj as THREE.LineSegments).geometry;
        const attr = geom.getAttribute("position") as THREE.BufferAttribute;
        if (attr && attr.array.length === lineBuffer.length) {
          (attr.array as Float32Array).set(lineBuffer);
          attr.needsUpdate = true;
        } else {
          geom.setAttribute("position", new THREE.Float32BufferAttribute(lineBuffer.slice(), 3));
        }
      }

      // Update shell panel mesh (Q4/CST faces)
      if (shellMeshObj) {
        const faceVerts: number[] = [];
        for (const e of elems) {
          if (e.length === 3) {
            const [a, b, c] = e;
            faceVerts.push(nodeBuffer[a*3], nodeBuffer[a*3+1], nodeBuffer[a*3+2]);
            faceVerts.push(nodeBuffer[b*3], nodeBuffer[b*3+1], nodeBuffer[b*3+2]);
            faceVerts.push(nodeBuffer[c*3], nodeBuffer[c*3+1], nodeBuffer[c*3+2]);
          } else if (e.length === 4) {
            const [a, b, c, d] = e;
            faceVerts.push(nodeBuffer[a*3], nodeBuffer[a*3+1], nodeBuffer[a*3+2]);
            faceVerts.push(nodeBuffer[b*3], nodeBuffer[b*3+1], nodeBuffer[b*3+2]);
            faceVerts.push(nodeBuffer[c*3], nodeBuffer[c*3+1], nodeBuffer[c*3+2]);
            faceVerts.push(nodeBuffer[a*3], nodeBuffer[a*3+1], nodeBuffer[a*3+2]);
            faceVerts.push(nodeBuffer[c*3], nodeBuffer[c*3+1], nodeBuffer[c*3+2]);
            faceVerts.push(nodeBuffer[d*3], nodeBuffer[d*3+1], nodeBuffer[d*3+2]);
          }
        }
        if (faceVerts.length > 0) {
          const geom = (shellMeshObj as THREE.Mesh).geometry;
          const fa = new Float32Array(faceVerts);
          const attr = geom.getAttribute("position") as THREE.BufferAttribute;
          if (attr && attr.array.length === fa.length) {
            (attr.array as Float32Array).set(fa);
            attr.needsUpdate = true;
          } else {
            geom.setAttribute("position", new THREE.Float32BufferAttribute(fa, 3));
          }
        }
      }

      // Render directly (no reactive overhead)
      ctx.render();
      modalAnimId = requestAnimationFrame(animate);
    }
    modalAnimId = requestAnimationFrame(animate);
  }

  /** Run FEM analysis (deform + analyze) and update mesh outputs */
  function runAnalysis() {
    if (!mesh.deformOutputs || !mesh.analyzeOutputs) return;
    if (!mesh.nodeInputs || !mesh.elementInputs) return;
    const nodes = mesh.nodes.val;
    const elements = mesh.elements.val;
    let nodeInputs = mesh.nodeInputs.val;
    const elementInputs = mesh.elementInputs.val;
    if (nodes.length === 0 || elements.length === 0) return;
    if (!nodeInputs.supports || nodeInputs.supports.size === 0) return;

    // Add default loads if none defined (like 1d-mesh: minimal entries)
    if (!nodeInputs.loads || nodeInputs.loads.size === 0) {
      const cm = gp("CM") ?? 0;
      const cv = gp("CV") ?? 0;
      const fz = cm + cv; // Total gravity = dead + live
      const fx = gp("Ex") ?? 0;  // Seismic X
      const fy = gp("Ey") ?? 0;  // Seismic Y
      if (fz === 0 && fx === 0 && fy === 0) return; // no loads to apply
      const loads = new Map<number, [number, number, number, number, number, number]>();

      // Collect free (non-supported) nodes
      const freeNodes: number[] = [];
      for (let i = 0; i < nodes.length; i++) {
        if (!nodeInputs.supports.has(i)) freeNodes.push(i);
      }

      const rd = (v: number) => Math.round(v * 1000) / 1000;

      // Identify joint nodes (column-beam intersections) — same X,Y as a support (column base)
      const supportXY = new Set<string>();
      nodeInputs.supports.forEach((_, si) => {
        supportXY.add(`${rd(nodes[si][0])},${rd(nodes[si][1])}`);
      });
      const jointNodes = new Set<number>();
      for (const i of freeNodes) {
        if (supportXY.has(`${rd(nodes[i][0])},${rd(nodes[i][1])}`)) jointNodes.add(i);
      }

      // Seismic: applied at last portal (boundary) where no more frames follow
      // Fx → nodes at max X, one per eje Y per floor → pushes in +X
      // Fy → nodes at max Y, one per eje X per floor → pushes in +Y
      // Fz (gravity): ALL free nodes (joints + beam intermediates)
      const fxNodes = new Set<number>();
      const fyNodes = new Set<number>();
      if (fx !== 0 || fy !== 0) {
        // Find max X and max Y among joints (last portal in each direction)
        let maxX = -Infinity, maxY = -Infinity;
        for (const i of jointNodes) {
          maxX = Math.max(maxX, rd(nodes[i][0]));
          maxY = Math.max(maxY, rd(nodes[i][1]));
        }
        // Group joints by floor
        const floorMap = new Map<number, number[]>();
        for (const i of jointNodes) {
          const z = rd(nodes[i][2]);
          if (!floorMap.has(z)) floorMap.set(z, []);
          floorMap.get(z)!.push(i);
        }
        floorMap.forEach((floorJoints) => {
          if (fx !== 0) {
            // Fx: joints at X=maxX (last portal), one per unique Y per floor
            const seenY = new Set<number>();
            for (const i of floorJoints) {
              if (rd(nodes[i][0]) === maxX) {
                const y = rd(nodes[i][1]);
                if (!seenY.has(y)) { seenY.add(y); fxNodes.add(i); }
              }
            }
          }
          if (fy !== 0) {
            // Fy: joints at Y=maxY (last portal), one per unique X per floor
            const seenX = new Set<number>();
            for (const i of floorJoints) {
              if (rd(nodes[i][1]) === maxY) {
                const x = rd(nodes[i][0]);
                if (!seenX.has(x)) { seenX.add(x); fyNodes.add(i); }
              }
            }
          }
        });
      }

      // ── SELF-WEIGHT: compute gravity from real element properties ──
      // Frame: W = rho * A * L * g (distributed to 2 end nodes)
      // Shell: W = rho * t * Area * g (distributed to 3 or 4 corner nodes)
      const g_acc = 9.81; // m/s²  (but loads are already in kN, so use rho directly)
      const selfWeight = new Map<number, number>(); // nodeIdx → accumulated Fz (negative = down)

      for (let ei = 0; ei < elements.length; ei++) {
        const el = elements[ei];
        const rho = elementInputs.densities?.get(ei) ?? 0;
        if (Math.abs(rho) < 1e-15) continue;

        if (el.length === 2) {
          // Frame element: W = rho * A * L
          const A_el = elementInputs.areas?.get(ei) ?? 0;
          const n0 = nodes[el[0]], n1 = nodes[el[1]];
          const L = Math.sqrt((n1[0]-n0[0])**2 + (n1[1]-n0[1])**2 + (n1[2]-n0[2])**2);
          const W = rho * A_el * L * g_acc; // weight in kN
          const wPerNode = -W / 2; // half to each node, negative = down
          selfWeight.set(el[0], (selfWeight.get(el[0]) ?? 0) + wPerNode);
          selfWeight.set(el[1], (selfWeight.get(el[1]) ?? 0) + wPerNode);
        } else if (el.length >= 3) {
          // Shell element: W = rho * t * Area
          const t_el = elementInputs.thicknesses?.get(ei) ?? 0;
          let area = 0;
          if (el.length === 3) {
            // Triangle area
            const [a, b, c] = el.map(ni => nodes[ni]);
            area = 0.5 * Math.abs((b[0]-a[0])*(c[1]-a[1]) - (c[0]-a[0])*(b[1]-a[1]));
          } else if (el.length === 4) {
            // Q4 area (2 triangles)
            const [a, b, c, d] = el.map(ni => nodes[ni]);
            area = 0.5 * Math.abs((b[0]-a[0])*(c[1]-a[1]) - (c[0]-a[0])*(b[1]-a[1]))
                 + 0.5 * Math.abs((c[0]-a[0])*(d[1]-a[1]) - (d[0]-a[0])*(c[1]-a[1]));
            // For 3D shells, use cross product for area
            if (area < 1e-10) {
              const v01 = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
              const v03 = [d[0]-a[0], d[1]-a[1], d[2]-a[2]];
              const cross = [v01[1]*v03[2]-v01[2]*v03[1], v01[2]*v03[0]-v01[0]*v03[2], v01[0]*v03[1]-v01[1]*v03[0]];
              area = Math.sqrt(cross[0]**2+cross[1]**2+cross[2]**2);
            }
          }
          const W = rho * t_el * area * g_acc;
          const wPerNode = -W / el.length;
          for (const ni of el) {
            selfWeight.set(ni, (selfWeight.get(ni) ?? 0) + wPerNode);
          }
        }
      }

      // ── Combine: self-weight + CM/CV surcharge + seismic ──
      // CM/CV surcharge: additional distributed load on frame joints only (area tributaria)
      const frameNodeSet = new Set<number>();
      for (const el of elements) {
        if (el.length === 2) { frameNodeSet.add(el[0]); frameNodeSet.add(el[1]); }
      }

      for (const i of freeNodes) {
        const lx = fxNodes.has(i) ? fx : 0;
        const ly = fyNodes.has(i) ? fy : 0;
        // Self-weight (computed from real rho*A*L or rho*t*Area)
        const sw = selfWeight.get(i) ?? 0;
        // CM/CV surcharge only on frame joint nodes (not shell-interior nodes)
        const surcharge = frameNodeSet.has(i) ? fz : 0;
        const lz = sw + surcharge;
        if (lx !== 0 || ly !== 0 || Math.abs(lz) > 1e-10) {
          loads.set(i, [lx, ly, lz, 0, 0, 0]);
        }
      }

      nodeInputs = { ...nodeInputs, loads };
      mesh.nodeInputs!.val = nodeInputs;
    }

    // ── Solver Log (console + visual panel) ──
    const t0 = performance.now();
    let nFrames = 0, nQ4 = 0, nTri = 0;
    for (const el of elements) {
      if (el.length === 2) nFrames++;
      else if (el.length === 3) nTri++;
      else if (el.length === 4) nQ4++;
    }
    const nSupports = nodeInputs.supports?.size || 0;
    const nLoads = nodeInputs.loads?.size || 0;
    const totalDOF = nodes.length * 6;
    const freeDOF = totalDOF - nSupports * 6;

    // Build formatted log
    const logLines: string[] = [];
    const addLog = (html: string) => logLines.push(html);

    addLog(`<b style="color:var(--cad-heading)">FEM Solver</b>`);
    addLog(`<span style="color:var(--cad-info)">Modelo:</span> ${nodes.length} nodos, ${elements.length} elem`);
    if (nFrames) addLog(`&nbsp;&nbsp;Frames: <b>${nFrames}</b>`);
    if (nQ4) addLog(`&nbsp;&nbsp;Shell Q4: <b>${nQ4}</b>`);
    if (nTri) addLog(`&nbsp;&nbsp;Triangulos: <b>${nTri}</b>`);
    addLog(`&nbsp;&nbsp;Apoyos: ${nSupports} &nbsp;|&nbsp; Cargas: ${nLoads}`);
    addLog(`<span style="color:var(--cad-info)">DOFs:</span> ${totalDOF} total, ~${freeDOF} libres`);
    addLog(`<hr style="border-color:var(--cad-border);margin:4px 0">`);
    addLog(`<span style="color:#888">1.</span> Ensamblaje <b>K</b> global (${totalDOF}&times;${totalDOF})`);
    addLog(`&nbsp;&nbsp;&nbsp;<i>K<sub>global</sub> = &Sigma; T<sup>T</sup> &middot; K<sub>local</sub> &middot; T</i>`);

    try {
      const dOut = deform(nodes, elements, nodeInputs, elementInputs);
      const dt1 = performance.now() - t0;

      if (dOut) {
        mesh.deformOutputs!.val = dOut;

        addLog(`<span style="color:#888">2.</span> <b>K &middot; u = F</b> &rarr; SparseLU &rarr; <span style="color:#00cc88">${dt1.toFixed(0)} ms</span>`);

        // Max displacement
        let maxDisp = 0, maxDispNode = -1;
        let maxUx = 0, maxUz = 0;
        if (dOut.deformations) {
          dOut.deformations.forEach((dd, ni) => {
            const mag = Math.sqrt(dd[0]*dd[0] + dd[1]*dd[1] + dd[2]*dd[2]);
            if (mag > maxDisp) {
              maxDisp = mag; maxDispNode = ni;
              maxUx = dd[0]; maxUz = dd[2];
            }
          });
        }
        addLog(`<span style="color:#888">3.</span> Desplazamientos:`);
        addLog(`&nbsp;&nbsp;&nbsp;max|<b>u</b>| = <b style="color:var(--cad-heading)">${maxDisp.toExponential(3)}</b> m <span style="color:#666">(nodo ${maxDispNode})</span>`);
        addLog(`&nbsp;&nbsp;&nbsp;u<sub>x</sub> = ${(maxUx*1000).toFixed(4)} mm &nbsp;|&nbsp; u<sub>z</sub> = ${(maxUz*1000).toFixed(4)} mm`);

        const t1 = performance.now();
        const aOut = analyze(nodes, elements, elementInputs, dOut);
        const dt2 = performance.now() - t1;
        if (aOut) {
          mesh.analyzeOutputs!.val = aOut;
          addLog(`<span style="color:#888">4.</span> Fuerzas internas: <span style="color:#00cc88">${dt2.toFixed(0)} ms</span>`);
          addLog(`&nbsp;&nbsp;&nbsp;<i>F<sub>int</sub> = K<sub>local</sub> &middot; T &middot; u</i>`);
        }

        const dtTotal = performance.now() - t0;
        addLog(`<hr style="border-color:var(--cad-border);margin:4px 0">`);
        addLog(`<b style="color:#00cc88">&#10004; Completado: ${dtTotal.toFixed(0)} ms</b>`);
      }
    } catch (err: any) {
      const dt = performance.now() - t0;
      addLog(`<b style="color:#ff4444">&#10008; Error (${dt.toFixed(0)} ms): ${err.message}</b>`);
    }

    // Store log for display
    (window as any).__femLog = logLines;
    // Console output (simplified)
    console.log(`FEM Solver: ${nodes.length}n ${elements.length}e → ${(performance.now()-t0).toFixed(0)}ms`);

    // Run modal analysis if enabled
    if (modalEnabled) {
      setTimeout(() => runModalAnalysis(), 50);
    }
  }

  // Helpers de sección (rectSection/circSection/iParamSection/hollowRectSection/cftSection)
  // extraídos a ./cadSections.ts — convención Iz=fuerte, Iy=débil (ver toLocalInertia).

  /** Set default element properties (E, A, Iz, Iy, J, ρ) using active unit system */
  function setDefaultElementInputs() {
    if (!mesh.elementInputs) return;
    const elements = mesh.elements.val;
    const u = activeUnits;
    const ei: ElementInputs = {
      elasticities: new Map(),
      shearModuli: new Map(),
      areas: new Map(),
      momentsOfInertiaY: new Map(),
      momentsOfInertiaZ: new Map(),
      torsionalConstants: new Map(),
      densities: new Map(),
      sectionShapes: new Map(),
      thicknesses: new Map(),
      poissonsRatios: new Map(),
    };

    // Check if edificio/frame with section params
    const hasSections = (activeGenerator === "edificio" || activeGenerator === "frame") && colElementIndices.size > 0;
    if (hasSections) {
      const { colMat, vigaMat, colShape, fc, perFloor } = sectionState;

      // Concrete material properties
      const Ec = ecHormigonACI(fc / 1000);
      const Gc = Ec / (2 * 1.2); // ν = 0.2
      const rhoC = 24 / 9.80665;
      // Steel material properties
      const Es = u.E, Gs = u.G, rhoS = u.rho;

      for (let i = 0; i < elements.length; i++) {
        // ── Shear wall elements (Q4 shell) ──
        if (wallElementIndices.has(i)) {
          // Muros de corte: shell thick (Mindlin-Reissner — includes transverse shear)
          const Ec_wall = ecHormigonACI(fc / 1000);
          const nuC_wall = 0.20;
          ei.elasticities!.set(i, Ec_wall);
          ei.poissonsRatios!.set(i, nuC_wall);
          ei.thicknesses!.set(i, wallThickness);
          ei.shearModuli!.set(i, Ec_wall / (2 * (1 + nuC_wall)));
          ei.densities!.set(i, 24 / 9.80665);
          continue;
        }
        if (slabElementIndices.has(i)) {
          // Losas: shell thin (Kirchhoff — losas delgadas, t/L < 1/10)
          const Ec_slab = ecHormigonACI(fc / 1000);
          const nuC_slab = 0.20;
          ei.elasticities!.set(i, Ec_slab);
          ei.poissonsRatios!.set(i, nuC_slab);
          ei.thicknesses!.set(i, slabThickness);
          ei.shearModuli!.set(i, Ec_slab / (2 * (1 + nuC_slab)));
          ei.densities!.set(i, 24 / 9.80665);
          continue;
        }
        const isCol = colElementIndices.has(i);
        const floor = elementFloor.get(i) ?? 0;
        const fl = perFloor[floor] ?? perFloor[0] ?? { bCol: 0.40, hCol: 0.40, dCol: 0.40, bViga: 0.30, hViga: 0.40 };

        let sec: { A: number; Iz: number; Iy: number; J: number };
        let elemE: number, elemG: number, elemRho: number;
        if (isCol) {
          if (colMat === 0) {
            // Hormigón columnas
            elemE = Ec; elemG = Gc; elemRho = rhoC;
            sec = colShape === 1 ? circSection(fl.dCol) : rectSection(fl.bCol, fl.hCol);
            ei.sectionShapes!.set(i, colShape === 1
              ? { type: "circ", d: fl.dCol }
              : { type: "rect", b: fl.bCol, h: fl.hCol });
          } else if (colMat === 1) {
            // Acero columnas: profile, I-param, o tubular
            elemE = Es; elemG = Gs; elemRho = rhoS;
            const sct = sectionState.steelColType;
            if (sct <= 1) {
              const p = STEEL_PROFILES[fl.colProfileIdx] ?? STEEL_PROFILES[0];
              sec = { A: p.A, Iz: p.Iz, Iy: p.Iy, J: p.J };
              ei.sectionShapes!.set(i, { type: "I", b: p.bf, h: p.d, name: p.name });
            } else if (sct === 2) {
              const bf = fl.colBf ?? 0.30, h = fl.colHf ?? 0.30, tf = fl.colTf ?? 0.020, tw = fl.colTw ?? 0.012;
              sec = iParamSection(bf, h, tf, tw);
              const label = `I${(h*100).toFixed(0)}x${(bf*100).toFixed(0)}`;
              ei.sectionShapes!.set(i, { type: "I", b: bf, h, tf, tw, name: label });
            } else {
              const bc = fl.colBc ?? 0.30, hc = fl.colHc ?? 0.30, t = fl.colT ?? 0.010;
              sec = hollowRectSection(bc, hc, t);
              const label = `□${(hc*100).toFixed(0)}x${(bc*100).toFixed(0)}x${(t*1000).toFixed(0)}`;
              ei.sectionShapes!.set(i, { type: "HSS", b: bc, h: hc, tw: t, name: label });
            }
          } else {
            // Mixto: columnas CFT — 2 materiales: acero (Es, νs) + concreto (f'c, νc)
            const bc = fl.colBc ?? 0.30, hc = fl.colHc ?? 0.30, t = fl.colT ?? 0.010;
            const fcCft = fl.colFc ?? 28000;
            const EsCft = fl.colEs ?? 200e6;
            const nuS = fl.colNuS ?? 0.30;
            const nuC = fl.colNuC ?? 0.20;
            const cft = cftSection(bc, hc, t, EsCft, nuS, fcCft, nuC);
            sec = { A: cft.A, Iz: cft.Iz, Iy: cft.Iy, J: cft.J };
            elemE = cft.Es;
            elemG = cft.Gs;
            // Densidad compuesta ponderada por áreas reales
            const rho_steel = 7.85;
            const rho_conc = 24 / 9.80665;
            elemRho = (rho_steel * cft.A_steel + rho_conc * cft.A_conc) / (cft.A_steel + cft.A_conc);
            const label = `CFT ${(hc*1000).toFixed(0)}X${(bc*1000).toFixed(0)}X${(t*1000).toFixed(0)}`;
            ei.sectionShapes!.set(i, { type: "CFT", b: bc, h: hc, tw: t, name: label });
          }
        } else {
          const bayInfo = elementBay.get(i);
          const arr = bayInfo ? (bayInfo.dir === 'x' ? fl.vigasX : fl.vigasY) : [];
          const vs = bayInfo ? (arr[bayInfo.bay] ?? arr[0] ?? defaultBeamSec()) : defaultBeamSec();
          if (vigaMat === 0) {
            // Hormigón vigas
            elemE = Ec; elemG = Gc; elemRho = rhoC;
            sec = rectSection(vs.b, vs.h);
            ei.sectionShapes!.set(i, { type: "rect", b: vs.b, h: vs.h });
          } else {
            // Acero vigas
            elemE = Es; elemG = Gs; elemRho = rhoS;
            const svt = sectionState.steelVigaType;
            if (svt <= 1) {
              const p = STEEL_PROFILES[vs.profileIdx ?? 0] ?? STEEL_PROFILES[0];
              sec = { A: p.A, Iz: p.Iz, Iy: p.Iy, J: p.J };
              ei.sectionShapes!.set(i, { type: "I", b: p.bf, h: p.d, name: p.name });
            } else if (svt === 2) {
              // I paramétrica
              const bf = vs.bf ?? 0.20, h = vs.hf ?? 0.40, tf = vs.tf ?? 0.015, tw = vs.tw ?? 0.010;
              sec = iParamSection(bf, h, tf, tw);
              const label = `I${(h*100).toFixed(0)}x${(bf*100).toFixed(0)}`;
              ei.sectionShapes!.set(i, { type: "I", b: bf, h, tf, tw, name: label });
            } else {
              // Tubular hueca
              const bc = vs.bc ?? 0.20, hc = vs.hc ?? 0.30, t = vs.t ?? 0.008;
              sec = hollowRectSection(bc, hc, t);
              const label = `□${(hc*100).toFixed(0)}x${(bc*100).toFixed(0)}x${(t*1000).toFixed(0)}`;
              ei.sectionShapes!.set(i, { type: "HSS", b: bc, h: hc, tw: t, name: label });
            }
          }
        }

        // Check for per-element override
        const ov = elementOverrides.get(i);
        if (ov) {
          const ovMat = ov.material ?? 1;
          if (ovMat === 0) { elemE = Ec; elemG = Gc; elemRho = rhoC; }
          else { elemE = Es; elemG = Gs; elemRho = rhoS; }
          if (ov.secType === "rect" && ov.b && ov.h) {
            sec = rectSection(ov.b, ov.h);
            ei.sectionShapes!.set(i, { type: "rect", b: ov.b, h: ov.h });
          } else if (ov.secType === "circ" && ov.b) {
            sec = circSection(ov.b);
            ei.sectionShapes!.set(i, { type: "circ", d: ov.b });
          } else if ((ov.secType === "W" || ov.secType === "HSS") && ov.profileIdx !== undefined) {
            const p = STEEL_PROFILES[ov.profileIdx] ?? STEEL_PROFILES[0];
            sec = { A: p.A, Iz: p.Iz, Iy: p.Iy, J: p.J };
            ei.sectionShapes!.set(i, { type: "I", b: p.bf, h: p.d, name: p.name });
          } else if (ov.secType === "I-param" && ov.bf && ov.hf && ov.tf && ov.tw) {
            sec = iParamSection(ov.bf, ov.hf, ov.tf, ov.tw);
            const label = `I${(ov.hf*100).toFixed(0)}x${(ov.bf*100).toFixed(0)}`;
            ei.sectionShapes!.set(i, { type: "I", b: ov.bf, h: ov.hf, tf: ov.tf, tw: ov.tw, name: label });
          } else if (ov.secType === "tubular" && ov.bc && ov.hc && ov.t) {
            sec = hollowRectSection(ov.bc, ov.hc, ov.t);
            const label = `□${(ov.hc*100).toFixed(0)}x${(ov.bc*100).toFixed(0)}x${(ov.t*1000).toFixed(0)}`;
            ei.sectionShapes!.set(i, { type: "HSS", b: ov.bc, h: ov.hc, tw: ov.t, name: label });
          }
        }

        // ── Apply Section Property Modifiers (ETABS-style) ──
        // modA, modI (Iz), modI3 (Iy), modJ multiplican el valor base.
        // modAs2, modAs3 son ESPECIALES (convención Hekatan/ETABS):
        //   = 1 (default)  → Timoshenko con As = 5/6·A
        //   = 0           → Bernoulli puro (sin shear deformation)
        //   = otro factor → Timoshenko con As = factor · 5/6 · A
        let A_eff = sec.A, Iz_eff = sec.Iy, Iy_eff = sec.Iz, J_eff = sec.J;
        let asY_explicit: number | undefined, asZ_explicit: number | undefined;
        if (ov) {
          if (ov.modA != null && ov.modA !== 1) A_eff *= ov.modA;
          if (ov.modI != null && ov.modI !== 1) Iz_eff *= ov.modI;
          if (ov.modI3 != null && ov.modI3 !== 1) Iy_eff *= ov.modI3;
          if (ov.modJ != null && ov.modJ !== 1) J_eff *= ov.modJ;
          // modAs2/3: 0 → Bernoulli (sentinel -1 al WASM); >0 → Timoshenko con factor
          if (ov.modAs2 != null) {
            if (ov.modAs2 === 0) asY_explicit = -1;       // Bernoulli sentinel
            else if (ov.modAs2 !== 1) asY_explicit = ov.modAs2 * (5/6) * A_eff;
          }
          if (ov.modAs3 != null) {
            if (ov.modAs3 === 0) asZ_explicit = -1;
            else if (ov.modAs3 !== 1) asZ_explicit = ov.modAs3 * (5/6) * A_eff;
          }
        }
        ei.elasticities!.set(i, elemE);
        ei.shearModuli!.set(i, elemG);
        ei.areas!.set(i, A_eff);
        ei.momentsOfInertiaZ!.set(i, Iz_eff);
        ei.momentsOfInertiaY!.set(i, Iy_eff);
        ei.torsionalConstants!.set(i, J_eff);
        ei.densities!.set(i, elemRho * (ov?.modMass ?? 1));
        if (asY_explicit !== undefined) {
          if (!ei.shearAreasY) (ei as any).shearAreasY = new Map();
          (ei as any).shearAreasY.set(i, asY_explicit);
        }
        if (asZ_explicit !== undefined) {
          if (!ei.shearAreasZ) (ei as any).shearAreasZ = new Map();
          (ei as any).shearAreasZ.set(i, asZ_explicit);
        }
        // Apply 12-DOF releases from override
        if (ov && ov.releases12 && ov.releases12.some((r: boolean) => r)) {
          if (!ei.momentReleases) (ei as any).momentReleases = new Map();
          ei.momentReleases!.set(i, ov.releases12);
        }
        if (ov && ov.springs12 && ov.springs12.some((s: number) => s > 0)) {
          if (!(ei as any).partialFixitySprings) (ei as any).partialFixitySprings = new Map();
          (ei as any).partialFixitySprings.set(i, ov.springs12);
        }
      }
    } else {
      // Default: same properties for all elements
      for (let i = 0; i < elements.length; i++) {
        ei.elasticities!.set(i, u.E);
        ei.shearModuli!.set(i, u.G);
        ei.areas!.set(i, u.A);
        ei.momentsOfInertiaZ!.set(i, u.Iy); // weak axis
        ei.momentsOfInertiaY!.set(i, u.Iz); // strong axis
        ei.torsionalConstants!.set(i, u.J);
        ei.densities!.set(i, u.rho);
      }
    }
    mesh.elementInputs.val = ei;
  }

  function highlightExButton(name: string) {
    panel.querySelectorAll("[data-ex]").forEach((btn) => {
      (btn as HTMLElement).classList.toggle("active", (btn as HTMLElement).dataset.ex === name);
    });
  }

  // Auto-collapse on mobile
  if (window.innerWidth <= 600) {
    panel.classList.add("collapsed");
  }

  setTimeout(() => {
    panel.querySelector("#cad3d-toggle")?.addEventListener("click", (ev) => {
      ev.stopPropagation(); panel.classList.add("collapsed");
    });
    panel.querySelector("#cad3d-expand")?.addEventListener("click", (ev) => {
      ev.stopPropagation(); panel.classList.remove("collapsed");
    });

    panel.querySelectorAll("[data-ex]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation(); const name = (btn as HTMLElement).dataset.ex!;
        highlightExButton(name); cli.example(name);
      });
    });

    // === View switching ===
    panel.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const mode = (btn as HTMLElement).dataset.view!;
        applyViewMode(mode);
        panel.querySelectorAll("[data-view]").forEach((b) => (b as HTMLElement).classList.remove("view-active"));
        (btn as HTMLElement).classList.add("view-active");
      });
    });

    panel.querySelector("#cad3d-btn-clear")?.addEventListener("click", (ev) => {
      ev.stopPropagation(); activeGenerator = ""; cadActive.val = false;
      restoreTweakpane(); cli.clear();
    });

    // === Select mode (multi-select + delete) ===
    panel.querySelector("#cad3d-select")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (inspectMode) { inspectMode = false; cleanupInspect(); }
      if (drawMode) cleanupDraw();
      selectMode = !selectMode;
      const btn = panel.querySelector("#cad3d-select") as HTMLElement;
      btn?.classList.toggle("inspect-active", selectMode);
      // Disable orbit rotation while selecting (so click doesn't rotate)
      const ctx_sel = getViewerCtx();
      if (ctx_sel) ctx_sel.controls.enabled = !selectMode;
      if (!selectMode) cleanupSelect();
    });

    // === Draw mode ===
    panel.querySelector("#cad3d-draw")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (inspectMode) { inspectMode = false; cleanupInspect(); }
      if (selectMode) cleanupSelect();
      drawMode = !drawMode;
      const btn = panel.querySelector("#cad3d-draw") as HTMLElement;
      btn?.classList.toggle("inspect-active", drawMode);
      if (drawMode) { showDrawToolbar(); } else { cleanupDraw(); }
    });

    // === Inspect mode ===
    panel.querySelector("#cad3d-inspect")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (selectMode) cleanupSelect();
      if (drawMode) cleanupDraw();
      inspectMode = !inspectMode;
      const btn = panel.querySelector("#cad3d-inspect") as HTMLElement;
      btn?.classList.toggle("inspect-active", inspectMode);
      if (!inspectMode) cleanupInspect();
    });

    // === New Model button ===
    panel.querySelector("#cad3d-new-model")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      cli.clear();
      lastImportedE2k = null;
    });

    // === Validation Tests ===
    const testsMenu = panel.querySelector("#cad3d-tests-menu") as HTMLSelectElement;
    if (testsMenu) testsMenu.addEventListener("change", () => {
      const testId = testsMenu.value;
      testsMenu.value = "";
      if (!testId) return;
      runValidationTest(testId);
    });

    function runValidationTest(testId: string) {
      // deform is already imported at top of file
      const H = 3, W = 4;
      const E_conc = 15000 * Math.sqrt(210) * 10; // tonf/m²
      const nu = 0.2, G = E_conc / (2 * (1 + nu));
      const Ac = 0.09, Ic = 0.3 ** 4 / 12, Jc = 0.141 * 0.3 ** 4;
      const Ab = 0.25 * 0.4, Izb = 0.25 * 0.4 ** 3 / 12, Iyb = 0.4 * 0.25 ** 3 / 12, Jb = 0.001;
      const AsC = 5 / 6 * Ac, AsB = 5 / 6 * Ab;

      const tests: { name: string; formulation: string; nodes: number[][]; elements: number[][]; results: { label: string; hekatan: number; reference: number; refSource: string }[] }[] = [];

      function makeFrameInputs(nElms: number, colIdx: number[], beamIdx: number[]) {
        const ei: any = {
          elasticities: new Map(), shearModuli: new Map(), areas: new Map(),
          momentsOfInertiaY: new Map(), momentsOfInertiaZ: new Map(),
          torsionalConstants: new Map(), shearAreasY: new Map(), shearAreasZ: new Map(),
        };
        for (const i of colIdx) {
          ei.elasticities.set(i, E_conc); ei.shearModuli.set(i, G); ei.areas.set(i, Ac);
          ei.momentsOfInertiaY.set(i, Ic); ei.momentsOfInertiaZ.set(i, Ic);
          ei.torsionalConstants.set(i, Jc); ei.shearAreasY.set(i, AsC); ei.shearAreasZ.set(i, AsC);
        }
        for (const i of beamIdx) {
          ei.elasticities.set(i, E_conc); ei.shearModuli.set(i, G); ei.areas.set(i, Ab);
          // Z-up convention: beam along X in XZ plane
          // local_y = global_Y (out of plane), local_z = global_Z (vertical)
          // Iz controls bending in local_z → deflection in global_Y (out of plane, weak)
          // Iy controls bending in local_y → deflection in global_Z (vertical, strong)
          // For portal in XZ plane: Iy = strong axis (D=0.4), Iz = weak axis (B=0.25)
          ei.momentsOfInertiaY.set(i, Iyb); // weak axis → out-of-plane
          ei.momentsOfInertiaZ.set(i, Izb); // strong axis → in-plane (XZ portal)
          ei.torsionalConstants.set(i, Jb); ei.shearAreasY.set(i, AsB); ei.shearAreasZ.set(i, AsB);
        }
        return ei;
      }

      // ══════════════════════════════════════════════════════════════
      // ALL TESTS USE Z-UP CONVENTION (engineering convention, like ETABS)
      // Node = [X_plan, Y_plan, Z_elevation]
      // Load = [Fx, Fy, Fz, Mx, My, Mz]  → lateral = Fx
      // Columns: vertical along Z; Beams: horizontal in XY
      // ══════════════════════════════════════════════════════════════

      // ── Test 1: Cantilever (Euler-Bernoulli exact) ──
      if (testId === "test-cantilever" || testId === "test-all") {
        const L = 3, P = 10;
        const exact = P * L ** 3 / (3 * E_conc * Ic);
        // Horizontal cantilever along X, load in Z (vertical)
        const nodes: Node[] = [[0, 0, 0], [L, 0, 0]];
        const elements: Element[] = [[0, 1]];
        const ei = makeFrameInputs(1, [], []);
        ei.elasticities.set(0, E_conc); ei.shearModuli.set(0, G); ei.areas.set(0, Ac);
        ei.momentsOfInertiaY.set(0, Ic); ei.momentsOfInertiaZ.set(0, Ic); ei.torsionalConstants.set(0, Jc);
        const r = deform(nodes, elements, {
          supports: new Map([[0, [true, true, true, true, true, true]]]),
          loads: new Map([[1, [0, 0, P, 0, 0, 0]]]),  // Fz = P (vertical)
        }, ei);
        tests.push({
          name: "Cantilever Beam", formulation: "Euler-Bernoulli (PL³/3EI)",
          nodes, elements,
          results: [{ label: "Uz tip (cm)", hekatan: r.deformations.get(1)[2] * 100, reference: exact * 100, refSource: "Analytical" }]
        });
      }

      // ── Test 2: Portal 1-Story (Timoshenko) ──
      if (testId === "test-portal-1p" || testId === "test-all") {
        // Z-up: columns along Z, beam along X at Z=H
        const nodes: Node[] = [[0, 0, 0], [W, 0, 0], [0, 0, H], [W, 0, H]];
        const elements: Element[] = [[0, 2], [1, 3], [2, 3]]; // 2 cols + 1 beam
        const ei = makeFrameInputs(3, [0, 1], [2]);
        const r = deform(nodes, elements, {
          supports: new Map([[0, [true, true, true, true, true, true]], [1, [true, true, true, true, true, true]]]),
          loads: new Map([[2, [10, 0, 0, 0, 0, 0]], [3, [10, 0, 0, 0, 0, 0]]]),  // Fx = lateral
        }, ei);
        tests.push({
          name: "Portal 1-Story (Timoshenko)", formulation: "Frame Timoshenko (As=5/6·A)",
          nodes, elements,
          results: [{ label: "Ux top (cm)", hekatan: r.deformations.get(2)[0] * 100, reference: 2.0618, refSource: "ETABS 22.6" }]
        });
      }

      // ── Test 3: Portal 2-Story ──
      if (testId === "test-portal-2p" || testId === "test-all") {
        const nodes: Node[] = [
          [0, 0, 0], [W, 0, 0],       // base
          [0, 0, H], [W, 0, H],       // Z=3m
          [0, 0, 2*H], [W, 0, 2*H],   // Z=6m
        ];
        const elements: Element[] = [[0, 2], [1, 3], [2, 4], [3, 5], [2, 3], [4, 5]];
        const ei = makeFrameInputs(6, [0, 1, 2, 3], [4, 5]);
        const r = deform(nodes, elements, {
          supports: new Map([[0, [true, true, true, true, true, true]], [1, [true, true, true, true, true, true]]]),
          loads: new Map([[4, [10, 0, 0, 0, 0, 0]], [5, [10, 0, 0, 0, 0, 0]]]),
        }, ei);
        tests.push({
          name: "Portal 2-Story", formulation: "Frame Timoshenko",
          nodes, elements,
          results: [
            { label: "Ux Z=3m (cm)", hekatan: r.deformations.get(2)[0] * 100, reference: 2.5188, refSource: "ETABS 22.6" },
            { label: "Ux Z=6m (cm)", hekatan: r.deformations.get(4)[0] * 100, reference: 5.6424, refSource: "ETABS 22.6" },
          ]
        });
      }

      // ── Test 4: Wall Q4 Only ──
      if (testId === "test-wall-only" || testId === "test-all") {
        // Z-up: wall in XZ plane (X=width, Z=height)
        const nodes: Node[] = [[0, 0, 0], [W, 0, 0], [W, 0, H], [0, 0, H]];
        const elements: Element[] = [[0, 1, 2, 3]];
        const ei: any = {
          elasticities: new Map([[0, E_conc]]), shearModuli: new Map([[0, G]]),
          thicknesses: new Map([[0, 0.2]]), poissonsRatios: new Map([[0, nu]]),
        };
        const r = deform(nodes, elements, {
          supports: new Map([[0, [true, true, true, true, true, true]], [1, [true, true, true, true, true, true]]]),
          loads: new Map([[2, [10, 0, 0, 0, 0, 0]], [3, [10, 0, 0, 0, 0, 0]]]),
        }, ei);
        tests.push({
          name: "Wall Q4 Only", formulation: "Membrane (incompatible modes) + Mindlin-Reissner + Hughes-Brezzi drilling",
          nodes, elements,
          results: [{ label: "Ux top (cm)", hekatan: r.deformations.get(2)[0] * 100, reference: 0.013519, refSource: "ETABS 22.6" }]
        });
      }

      // ── Test 5: Portal + Wall (Frame-Shell coupling) ──
      if (testId === "test-portal-wall" || testId === "test-all") {
        const nodes: Node[] = [
          [0, 0, 0], [W, 0, 0],       // base
          [0, 0, H], [W, 0, H],       // Z=3m
          [0, 0, 2*H], [W, 0, 2*H],   // Z=6m
        ];
        const elements: Element[] = [[0, 2], [1, 3], [2, 4], [3, 5], [2, 3], [4, 5], [0, 1, 3, 2]];
        const ei = makeFrameInputs(6, [0, 1, 2, 3], [4, 5]);
        ei.elasticities.set(6, E_conc); ei.shearModuli.set(6, G);
        ei.thicknesses = new Map([[6, 0.2]]); ei.poissonsRatios = new Map([[6, nu]]);
        const r = deform(nodes, elements, {
          supports: new Map([[0, [true, true, true, true, true, true]], [1, [true, true, true, true, true, true]]]),
          loads: new Map([[4, [10, 0, 0, 0, 0, 0]], [5, [10, 0, 0, 0, 0, 0]]]),
        }, ei);
        tests.push({
          name: "Portal 2-Story + Wall Q4", formulation: "Frame Timoshenko + Shell Q4 (Hughes-Brezzi drilling)",
          nodes, elements,
          results: [
            { label: "Ux h=3m (cm)", hekatan: r.deformations.get(2)[0] * 100, reference: 0.0195, refSource: "ETABS 22.6" },
            { label: "Ux h=6m (cm)", hekatan: r.deformations.get(4)[0] * 100, reference: 2.1133, refSource: "ETABS 22.6" },
          ]
        });
      }

      // ── Test 6: Wilson Fig 6.2 — Cantilever beam with Q4 membrane elements ──
      if (testId === "test-wilson-beam" || testId === "test-all") {
        // Wilson (2004) Table 6.1: Cantilever beam L=5, d=2, E=1500, nu=0.25
        // 2 Q4 elements (rectangular, no distortion, a=0)
        // Load case 1: Moment M at free end → exact normalized disp = 1.000 (with 4 incomp modes)
        // Load case 2: Shear V at free end → exact normalized disp = 0.932 (with 4 incomp modes)
        const Lw = 5, dw = 2, Ew = 1500, nuw = 0.25, tw = 1;
        const Gw = Ew / (2 * (1 + nuw));
        const Iw = tw * dw ** 3 / 12; // = 0.6667

        // 2 rectangular Q4 elements side by side
        // Nodes: 0=(0,0), 1=(2.5,0), 2=(5,0), 3=(5,1), 4=(2.5,1), 5=(0,1), 6=(5,-1), 7=(2.5,-1), 8=(0,-1)
        // Actually simpler: 6 nodes for 2 elements in a row
        // Bottom: y=-1, Mid: y=0 (but for plane stress, use full depth d=2)
        // Nodes: 0=(0,-1), 1=(2.5,-1), 2=(5,-1), 3=(5,1), 4=(2.5,1), 5=(0,1)
        const wn: Node[] = [
          [0, -1, 0], [2.5, -1, 0], [5, -1, 0],
          [5,  1, 0], [2.5,  1, 0], [0,  1, 0],
        ];
        const we: Element[] = [[0, 1, 4, 5], [1, 2, 3, 4]]; // 2 Q4 elements

        const wei: ElementInputs = {
          elasticities: new Map([[0, Ew], [1, Ew]]),
          shearModuli: new Map([[0, Gw], [1, Gw]]),
          thicknesses: new Map([[0, tw], [1, tw]]),
          poissonsRatios: new Map([[0, nuw], [1, nuw]]),
        };

        // BCs: left edge (nodes 0, 5) fully fixed
        const wsup = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
        wsup.set(0, [true, true, true, true, true, true]);
        wsup.set(5, [true, true, true, true, true, true]);

        // Load case: Shear V=1 at free end (nodes 2, 3)
        // Parabolic shear distribution: F_top = 0.5, F_bottom = 0.5
        const wloads = new Map<number, [number, number, number, number, number, number]>();
        wloads.set(2, [0, 0.5, 0, 0, 0, 0]); // V at bottom-right (upward)
        wloads.set(3, [0, 0.5, 0, 0, 0, 0]); // V at top-right (upward)

        // Exact solution: delta_exact = VL^3/(3EI) + 6VL/(5GA) [with shear correction]
        // For plane stress thin beam: delta = VL^3/(3EI) = 1*125/(3*1500*0.6667) = 0.04167
        // Wilson normalizes by this
        const delta_exact = Lw ** 3 / (3 * Ew * Iw); // = 0.04167

        try {
          const wr = deform(wn, we, { supports: wsup, loads: wloads }, wei);
          // Max displacement at free end (average of nodes 2 and 3)
          const uy2 = Math.abs(wr.deformations?.get(2)?.[1] ?? 0);
          const uy3 = Math.abs(wr.deformations?.get(3)?.[1] ?? 0);
          const uy_max = (uy2 + uy3) / 2;
          const normalized = uy_max / delta_exact;

          tests.push({
            name: "Wilson Fig 6.2 — Cantilever Q4",
            formulation: "2 Q4 elements + incompatible modes (Wilson 1971, Table 6.1)",
            nodes: wn, elements: we,
            results: [
              { label: "Uy/Uy_exact (cortante)", hekatan: normalized, reference: 0.932, refSource: "Wilson Table 6.1" },
              { label: "Uy free end", hekatan: uy_max, reference: delta_exact * 0.932, refSource: "Wilson" },
            ]
          });
        } catch (e: any) {
          tests.push({
            name: "Wilson Fig 6.2 — Cantilever Q4",
            formulation: "ERROR: " + e.message,
            nodes: wn, elements: we,
            results: [{ label: "Error", hekatan: 0, reference: 0.932, refSource: "Wilson" }]
          });
        }
      }

      // ── Test 7: Scordelis-Lo Barrel Vault (Classic shell benchmark) ──
      if (testId === "test-scordelis" || testId === "test-all") {
        // Scordelis & Lo (1964), Wilson (2004) — barrel vault under self-weight
        // R=25, L=50, theta=40deg, t=0.25, E=4.32e8, nu=0.0, w=360 (weight/vol)
        // 1/4 model with symmetry BCs
        // Reference: Uz_max = 0.3086 at midspan free edge
        const R_sl = 25, L_sl = 50, theta_deg = 40;
        const t_sl = 0.25, E_sl = 4.32e8, nu_sl = 0.0;
        const w_sl = 360 * t_sl; // surface weight = vol_weight * thickness = 90 psf
        const theta_rad = theta_deg * Math.PI / 180;
        const nL = 8, nT = 8; // mesh density

        // Generate 1/4 cylindrical mesh
        const sl_nodes: Node[] = [];
        for (let i = 0; i <= nL; i++) {
          for (let j = 0; j <= nT; j++) {
            const x = (L_sl / 2) * i / nL;
            const th = theta_rad * j / nT;
            const y = R_sl * Math.sin(th);
            const z = R_sl * Math.cos(th) - R_sl * Math.cos(theta_rad);
            sl_nodes.push([x, y, z]);
          }
        }

        const sl_elements: Element[] = [];
        for (let i = 0; i < nL; i++) {
          for (let j = 0; j < nT; j++) {
            const n0 = i * (nT + 1) + j;
            const n1 = (i + 1) * (nT + 1) + j;
            const n2 = (i + 1) * (nT + 1) + (j + 1);
            const n3 = i * (nT + 1) + (j + 1);
            sl_elements.push([n0, n1, n2, n3]);
          }
        }

        // Element properties
        const sl_ei: ElementInputs = {
          elasticities: new Map(), shearModuli: new Map(),
          thicknesses: new Map(), poissonsRatios: new Map(),
        };
        const G_sl = E_sl / (2 * (1 + nu_sl));
        for (let i = 0; i < sl_elements.length; i++) {
          sl_ei.elasticities!.set(i, E_sl);
          sl_ei.shearModuli!.set(i, G_sl);
          sl_ei.thicknesses!.set(i, t_sl);
          sl_ei.poissonsRatios!.set(i, nu_sl);
        }

        // Boundary conditions
        const sl_supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
        for (let i = 0; i <= nL; i++) {
          for (let j = 0; j <= nT; j++) {
            const ni = i * (nT + 1) + j;
            const fix: [boolean,boolean,boolean,boolean,boolean,boolean] = [false,false,false,false,false,false];
            // x=0 symmetry: ux=0, ry=0, rz=0
            if (i === 0) { fix[0] = true; fix[4] = true; fix[5] = true; }
            // x=L/2 diaphragm: uy=0, uz=0, rx=0
            if (i === nL) { fix[1] = true; fix[2] = true; fix[3] = true; }
            // theta=0 symmetry: uy=0, rx=0, rz=0
            if (j === 0) { fix[1] = true; fix[3] = true; fix[5] = true; }
            if (fix.some(f => f)) sl_supports.set(ni, fix);
          }
        }

        // Gravity loads: w * element_area / 4 per node in -Z direction
        const sl_loads = new Map<number, [number,number,number,number,number,number]>();
        for (const el of sl_elements) {
          // Compute element area (approximate as flat quad)
          const p0 = sl_nodes[el[0]], p1 = sl_nodes[el[1]], p2 = sl_nodes[el[2]], p3 = sl_nodes[el[3]];
          const d1 = [p2[0]-p0[0], p2[1]-p0[1], p2[2]-p0[2]];
          const d2 = [p3[0]-p1[0], p3[1]-p1[1], p3[2]-p1[2]];
          const cx = d1[1]*d2[2] - d1[2]*d2[1];
          const cy = d1[2]*d2[0] - d1[0]*d2[2];
          const cz = d1[0]*d2[1] - d1[1]*d2[0];
          const area = 0.5 * Math.sqrt(cx*cx + cy*cy + cz*cz);
          const fz = -w_sl * area / 4; // gravity load per node

          for (const ni of el) {
            const prev = sl_loads.get(ni) || [0,0,0,0,0,0] as [number,number,number,number,number,number];
            prev[2] += fz;
            sl_loads.set(ni, prev);
          }
        }

        try {
          const r = deform(sl_nodes, sl_elements,
            { supports: sl_supports, loads: sl_loads }, sl_ei);

          // Find max Uz at midspan free edge (x=0, theta=theta_max → node index nT)
          const midFreeIdx = nT; // x=0, j=nT
          const uz = r.deformations?.get(midFreeIdx)?.[2] ?? 0;

          tests.push({
            name: "Scordelis-Lo Barrel Vault",
            formulation: `Shell Q4 (${nL}x${nT} mesh), Mindlin-Reissner + incompatible modes`,
            nodes: sl_nodes, elements: sl_elements,
            results: [{
              label: "Uz midspan free edge (ft)",
              hekatan: Math.abs(uz),
              reference: 0.3086,
              refSource: "Wilson (2004) / MacNeal-Harder"
            }]
          });
        } catch (e: any) {
          tests.push({
            name: "Scordelis-Lo Barrel Vault",
            formulation: "ERROR: " + e.message,
            nodes: sl_nodes, elements: sl_elements,
            results: [{ label: "Error", hekatan: 0, reference: 0.3086, refSource: "Wilson" }]
          });
        }
      }

      // Display results
      showTestResults(tests);

      // Load model into viewport (last test) — include supports + loads
      if (tests.length > 0) {
        const last = tests[tests.length - 1];
        mesh.nodes.val = last.nodes as any;
        mesh.elements!.val = last.elements as any;
        // Build supports (nodes at Z=0) and loads (nodes at max Z)
        const supports = new Map<number, boolean[]>();
        const loads = new Map<number, number[]>();
        const maxZ = Math.max(...last.nodes.map((n: any) => n[2]));
        last.nodes.forEach((n: any, i: number) => {
          if (Math.abs(n[2]) < 0.01) supports.set(i, [true, true, true, true, true, true]);
          if (Math.abs(n[2] - maxZ) < 0.01) loads.set(i, [10, 0, 0, 0, 0, 0]);
        });
        mesh.nodeInputs!.val = { supports, loads };
        mesh.elementInputs!.val = {};
        mesh.deformOutputs!.val = {};
        mesh.analyzeOutputs!.val = {};
      }
    }

    function generateTestE2k(test: any): string {
      const E = 15000 * Math.sqrt(210) * 10;
      const lines: string[] = [];
      lines.push(`$ File exported from Hekatan Struct — validacion FEM: ${test.name}`);
      lines.push(` `);
      lines.push(`$ PROGRAM INFORMATION`);
      lines.push(`  PROGRAM  "ETABS"  VERSION "22.6.0"  `);
      lines.push(``);
      lines.push(`$ CONTROLS`);
      lines.push(`  UNITS  "TONF"  "M"  "C"  `);
      lines.push(``);
      // Stories from Y coords
      const ySet = new Set<number>();
      test.nodes.forEach((n: number[]) => ySet.add(Math.round(n[1] * 1e4) / 1e4));
      const sortedY = [...ySet].sort((a: number, b: number) => a - b);
      const storyNames = sortedY.map((y: number, i: number) => i === 0 ? "Base" : `Level_${i}`);
      const yToStory = new Map<number, string>();
      sortedY.forEach((y: number, i: number) => yToStory.set(y, storyNames[i]));
      lines.push(`$ STORIES - IN SEQUENCE FROM TOP`);
      for (let i = sortedY.length - 1; i >= 1; i--)
        lines.push(`  STORY "${storyNames[i]}"  HEIGHT ${sortedY[i] - sortedY[i - 1]} MASTERSTORY "Yes"  `);
      lines.push(`  STORY "Base"  ELEV ${sortedY[0]} `);
      lines.push(``);
      lines.push(`$ MATERIAL PROPERTIES`);
      lines.push(`  MATERIAL  "CONC"    TYPE "Concrete"    WEIGHTPERVOLUME 2.4`);
      lines.push(`  MATERIAL  "CONC"    SYMTYPE "Isotropic"  E ${E}  U 0.2  A 1E-05`);
      lines.push(``);
      lines.push(`$ FRAME SECTIONS`);
      lines.push(`  FRAMESECTION  "COL30"  MATERIAL "CONC"  SHAPE "Concrete Rectangular"  D 0.3 B 0.3 `);
      lines.push(`  FRAMESECTION  "VIGA"  MATERIAL "CONC"  SHAPE "Concrete Rectangular"  D 0.4 B 0.25 `);
      lines.push(``);
      const hasQ4 = test.elements.some((el: number[]) => el.length === 4);
      if (hasQ4) {
        lines.push(`$ WALL/SLAB/DECK SECTIONS`);
        lines.push(`  SHELLPROP  "Muro20"  PROPTYPE  "Wall"  MATERIAL "CONC"  MODELINGTYPE "ShellThick"  WALLTHICKNESS 0.2 `);
        lines.push(``);
      }
      // Points
      const xyToPoint = new Map<string, string>();
      let pi = 0;
      test.nodes.forEach((n: number[]) => {
        const key = `${n[0]},${n[2]}`;
        if (!xyToPoint.has(key)) xyToPoint.set(key, `${++pi}`);
      });
      lines.push(`$ POINT COORDINATES`);
      for (const [key, ptName] of xyToPoint) {
        const [x, z] = key.split(",").map(Number);
        lines.push(`  POINT "${ptName}"  ${x} ${z} `);
      }
      lines.push(``);
      const nToPS = (ni: number) => {
        const n = test.nodes[ni];
        const key = `${n[0]},${n[2]}`;
        return { pt: xyToPoint.get(key) || "1", story: yToStory.get(Math.round(n[1] * 1e4) / 1e4) || "Base" };
      };
      lines.push(`$ LINE CONNECTIVITIES`);
      const laEntries: string[] = [];
      test.elements.forEach((el: number[], i: number) => {
        if (el.length !== 2) return;
        const n0 = test.nodes[el[0]], n1 = test.nodes[el[1]];
        const dy = Math.abs(n1[1] - n0[1]);
        const dxz = Math.sqrt((n1[0] - n0[0]) ** 2 + (n1[2] - n0[2]) ** 2);
        const isCol = dy > dxz * 0.5;
        const ps0 = nToPS(el[0]), ps1 = nToPS(el[1]);
        const sec = isCol ? "COL30" : "VIGA";
        if (isCol) {
          lines.push(`  LINE  "E${i + 1}"  COLUMN  "${ps0.pt}"  "${ps0.pt}"  1`);
          laEntries.push(`  LINEASSIGN  "E${i + 1}"  "${ps1.story}"  SECTION "${sec}"  `);
        } else {
          lines.push(`  LINE  "E${i + 1}"  BEAM  "${ps0.pt}"  "${ps1.pt}"  0`);
          laEntries.push(`  LINEASSIGN  "E${i + 1}"  "${ps0.story}"  SECTION "${sec}"  `);
        }
      });
      lines.push(``);
      if (hasQ4) {
        lines.push(`$ AREA CONNECTIVITIES`);
        const aaEntries: string[] = [];
        test.elements.forEach((el: number[], i: number) => {
          if (el.length !== 4) return;
          const ps = el.map((ni: number) => nToPS(ni));
          lines.push(`  AREA "W${i + 1}"  PANEL  4  "${ps[0].pt}"  "${ps[1].pt}"  "${ps[2].pt}"  "${ps[3].pt}"  1  1  0  0  `);
          aaEntries.push(`  AREAASSIGN  "W${i + 1}"  "${ps[2].story}"  SECTION "Muro20"  `);
        });
        lines.push(``);
        lines.push(`$ AREA ASSIGNS`);
        aaEntries.forEach(aa => lines.push(aa));
        lines.push(``);
      }
      lines.push(`$ POINT ASSIGNS`);
      test.nodes.forEach((n: number[], ni: number) => {
        if (Math.abs(n[1]) < 0.01) {
          const ps = nToPS(ni);
          lines.push(`  POINTASSIGN  "${ps.pt}"  "${ps.story}"  RESTRAINT "UX UY UZ RX RY RZ"  `);
        }
      });
      lines.push(``);
      lines.push(`$ LINE ASSIGNS`);
      laEntries.forEach(la => lines.push(la));
      lines.push(``);
      lines.push(`$ LOAD PATTERNS`);
      lines.push(`  LOADPATTERN "Lat"  TYPE  "Other"  SELFWEIGHT  0`);
      lines.push(``);
      lines.push(`$ POINT OBJECT LOADS`);
      const maxY = Math.max(...test.nodes.map((n: number[]) => n[1]));
      test.nodes.forEach((n: number[], ni: number) => {
        if (Math.abs(n[1] - maxY) < 0.01) {
          const ps = nToPS(ni);
          lines.push(`  POINTLOAD  "${ps.pt}"  "${ps.story}"  "Lat"  TYPE "FORCE"  FX 10`);
        }
      });
      lines.push(``);
      lines.push(`  END`);
      lines.push(`$ END OF MODEL FILE`);
      return lines.join("\r\n");
    }

    function generateTestPy(test: any): string {
      const E = 15000 * Math.sqrt(210) * 10;
      const py: string[] = [];
      py.push(`"""ETABS API Validation: ${test.name}`);
      py.push(`Generated by Hekatan Struct"""`);
      py.push(`import comtypes.client, time, math`);
      py.push(``);
      py.push(`helper = comtypes.client.CreateObject('ETABSv1.Helper')`);
      py.push(`helper = helper.QueryInterface(comtypes.gen.ETABSv1.cHelper)`);
      py.push(`myETABS = helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")`);
      py.push(`myETABS.ApplicationStart()`);
      py.push(`time.sleep(10)`);
      py.push(`SapModel = myETABS.SapModel`);
      py.push(`SapModel.InitializeNewModel()`);
      py.push(`SapModel.File.NewBlank()`);
      py.push(`SapModel.SetPresentUnits(12)  # tonf_m_C`);
      py.push(``);
      py.push(`E = ${E}`);
      py.push(`SapModel.PropMaterial.SetMaterial("CONC", 2)`);
      py.push(`SapModel.PropMaterial.SetMPIsotropic("CONC", E, 0.2, 5.5e-6)`);
      py.push(`SapModel.PropFrame.SetRectangle("COL30", "CONC", 0.30, 0.30)`);
      py.push(`SapModel.PropFrame.SetRectangle("VIGA", "CONC", 0.40, 0.25)`);
      const hasQ4 = test.elements.some((el: number[]) => el.length === 4);
      if (hasQ4) py.push(`SapModel.PropArea.SetWall("Muro20", 6, False, "CONC", 0.20)`);
      py.push(``);
      py.push(`# Add elements`);
      py.push(`FN = ' '`);
      test.elements.forEach((el: number[], i: number) => {
        if (el.length === 2) {
          const n0 = test.nodes[el[0]], n1 = test.nodes[el[1]];
          const dy = Math.abs(n1[1] - n0[1]);
          const dxz = Math.sqrt((n1[0] - n0[0]) ** 2 + (n1[2] - n0[2]) ** 2);
          const sec = dy > dxz * 0.5 ? "COL30" : "VIGA";
          // ETABS: Z = height, Y = plan depth
          py.push(`[FN,r]=SapModel.FrameObj.AddByCoord(${n0[0]},${n0[2]},${n0[1]}, ${n1[0]},${n1[2]},${n1[1]}, FN,"${sec}","E${i + 1}","Global")`);
        } else if (el.length === 4) {
          const coords = el.map((ni: number) => test.nodes[ni]);
          py.push(`SapModel.AreaObj.AddByCoord(4, [${coords.map((c: number[]) => c[0]).join(",")}], [${coords.map((c: number[]) => c[2]).join(",")}], [${coords.map((c: number[]) => c[1]).join(",")}], "", "Muro20")`);
        }
      });
      py.push(``);
      py.push(`# Supports at Z=0`);
      py.push(`names = SapModel.PointObj.GetNameList()`);
      py.push(`for i in range(int(names[0])):`);
      py.push(`    c = SapModel.PointObj.GetCoordCartesian(names[1][i])`);
      py.push(`    if abs(float(c[2])) < 0.01:`);
      py.push(`        SapModel.PointObj.SetRestraint(names[1][i], [True]*6)`);
      py.push(``);
      py.push(`# Load at top`);
      py.push(`SapModel.LoadPatterns.Add("Lat", 8, 0, True)`);
      const maxY = Math.max(...test.nodes.map((n: number[]) => n[1]));
      py.push(`names = SapModel.PointObj.GetNameList()`);
      py.push(`for i in range(int(names[0])):`);
      py.push(`    c = SapModel.PointObj.GetCoordCartesian(names[1][i])`);
      py.push(`    if abs(float(c[2]) - ${maxY}) < 0.01:`);
      py.push(`        SapModel.PointObj.SetLoadForce(names[1][i], "Lat", [10,0,0,0,0,0])`);
      py.push(``);
      py.push(`SapModel.File.Save(r"C:\\Users\\j-b-j\\Downloads\\validation_${test.name.replace(/[^a-zA-Z0-9]/g, '_')}.EDB")`);
      py.push(`time.sleep(1)`);
      py.push(`SapModel.Analyze.RunAnalysis()`);
      py.push(`time.sleep(5)`);
      py.push(``);
      py.push(`# Results`);
      py.push(`SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()`);
      py.push(`SapModel.Results.Setup.SetCaseSelectedForOutput("Lat")`);
      py.push(`print(f"\\n=== ETABS: ${test.name} ===")`);
      py.push(`names = SapModel.PointObj.GetNameList()`);
      py.push(`for i in range(int(names[0])):`);
      py.push(`    name = names[1][i]`);
      py.push(`    c = SapModel.PointObj.GetCoordCartesian(name)`);
      py.push(`    NR=0;Obj=[];Elm=[];AC=[];ST=[];SN=[];U1=[];U2=[];U3=[];R1=[];R2=[];R3=[]`);
      py.push(`    [NR,Obj,Elm,AC,ST,SN,U1,U2,U3,R1,R2,R3,ret]=SapModel.Results.JointDispl(name,0,NR,Obj,Elm,AC,ST,SN,U1,U2,U3,R1,R2,R3)`);
      py.push(`    if NR > 0:`);
      py.push(`        print(f"  {name} Z={float(c[2]):.1f}: Ux={U1[0]*100:.4f} cm")`);
      py.push(``);
      py.push(`print("\\nHekatan results:")`);
      for (const r of test.results) {
        py.push(`print(f"  ${r.label}: Hekatan=${r.hekatan.toFixed(4)}, ETABS=${r.reference.toFixed(4)}, Ratio={${r.hekatan.toFixed(4)}/${r.reference.toFixed(4)}:.4f}")`);
      }
      py.push(`SapModel.View.RefreshView(0, False)`);
      return py.join("\n");
    }

    function downloadText2(text: string, filename: string) {
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    }

    function showTestResults(tests: any[]) {
      let overlay = document.getElementById("test-results-overlay");
      if (overlay) overlay.remove();

      overlay = document.createElement("div");
      overlay.id = "test-results-overlay";
      overlay.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
        background:#1a1a2e;color:#eee;border:2px solid #16213e;border-radius:8px;padding:20px;
        z-index:10000;max-width:750px;width:90%;max-height:80vh;overflow-y:auto;font-family:monospace;font-size:13px;
        box-shadow:0 10px 40px rgba(0,0,0,0.5);`;

      let html = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h3 style="margin:0;color:#00d4ff">Hekatan Struct — validacion FEM</h3>
        <button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:#888;font-size:18px;cursor:pointer">X</button>
      </div>`;

      let allPass = true;

      // Store tests on window for download buttons
      (window as any).__hekatanTests = tests;

      for (let ti = 0; ti < tests.length; ti++) {
        const test = tests[ti];
        html += `<div style="margin-bottom:16px;border:1px solid #333;border-radius:6px;padding:10px">`;
        html += `<div style="display:flex;justify-content:space-between;align-items:center">`;
        html += `<div style="font-weight:bold;color:#00d4ff">${test.name}</div>`;
        html += `<div>`;
        html += `<button onclick="window.__hekatanDownloadE2k(${ti})" style="background:#1e3a5f;color:#aaa;border:1px solid #444;padding:2px 6px;font-size:10px;cursor:pointer;margin-right:4px;border-radius:3px">e2k</button>`;
        html += `<button onclick="window.__hekatanDownloadPy(${ti})" style="background:#2a1e3a;color:#aaa;border:1px solid #444;padding:2px 6px;font-size:10px;cursor:pointer;border-radius:3px">py</button>`;
        html += `</div></div>`;
        html += `<div style="color:#888;font-size:11px;margin-bottom:8px">${test.formulation}</div>`;
        html += `<table style="width:100%;border-collapse:collapse;font-size:12px">
          <tr style="color:#888"><td style="padding:3px 6px">Measure</td><td style="text-align:right">Hekatan</td><td style="text-align:right">Reference</td><td style="text-align:right">Ratio</td><td style="text-align:right">Source</td><td style="text-align:center"></td></tr>`;

        for (const r of test.results) {
          const ratio = r.reference !== 0 ? r.hekatan / r.reference : 1;
          const pass = Math.abs(ratio - 1) < 0.05;
          if (!pass) allPass = false;
          const color = pass ? "#4caf50" : "#f44336";
          const icon = pass ? "PASS" : "FAIL";
          html += `<tr style="border-top:1px solid #333">
            <td style="padding:3px 6px">${r.label}</td>
            <td style="text-align:right;color:#fff">${r.hekatan.toFixed(4)}</td>
            <td style="text-align:right;color:#aaa">${r.reference.toFixed(4)}</td>
            <td style="text-align:right;color:${color};font-weight:bold">${ratio.toFixed(4)}</td>
            <td style="text-align:right;color:#888;font-size:11px">${r.refSource}</td>
            <td style="text-align:center;color:${color};font-size:10px;font-weight:bold">${icon}</td></tr>`;
        }
        html += `</table></div>`;
      }

      const summary = allPass
        ? `<div style="color:#4caf50;font-weight:bold;text-align:center;margin-top:8px">ALL TESTS PASSED (< 5% error vs ETABS)</div>`
        : `<div style="color:#f44336;font-weight:bold;text-align:center;margin-top:8px">Some tests exceeded 5% tolerance</div>`;
      html += summary;

      overlay.innerHTML = html;
      document.body.appendChild(overlay);

      // Download handlers
      (window as any).__hekatanDownloadE2k = (idx: number) => {
        const t = (window as any).__hekatanTests[idx];
        const fname = t.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        downloadText2(generateTestE2k(t), `${fname}.e2k`);
      };
      (window as any).__hekatanDownloadPy = (idx: number) => {
        const t = (window as any).__hekatanTests[idx];
        const fname = t.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        downloadText2(generateTestPy(t), `${fname}_etabs.py`);
      };
    }

    // === Export panel ===
    panel.querySelector("#cad3d-export")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      showExportPanel();
    });

    // === Import/Export Menu ===
    let ioAction = "";
    const ioMenu = panel.querySelector("#cad3d-io-menu") as HTMLSelectElement;
    const ioFile = panel.querySelector("#cad3d-io-file") as HTMLInputElement;

    function applyImportedModel(model: { nodes: any[]; elements: any[]; nodeInputs: any; elementInputs: any; sectionShapes?: Map<number, any>; info?: any }, label: string) {
      mesh.nodes.val = model.nodes;
      mesh.elements!.val = model.elements;
      mesh.nodeInputs!.val = model.nodeInputs;
      mesh.elementInputs!.val = model.elementInputs;
      if (model.sectionShapes && model.elementInputs) {
        (model.elementInputs as any).sectionShapes = model.sectionShapes;
      }
      mesh.deformOutputs!.val = {};
      mesh.analyzeOutputs!.val = {};
      const nFrames = model.elements.filter((e: any) => e.length === 2).length;
      const nShells = model.elements.filter((e: any) => e.length >= 3).length;
      console.log(`${label} (${model.nodes.length} nodos, ${nFrames} frames, ${nShells} shells): ${model.nodes.length} nodes, ${model.elements.length} elements`);
      // Rebuild scene and fit camera to new model
      setTimeout(() => autoFitGridSize(), 50);
    }

    function showIfcFilterPanel(ifcResult: IfcLoadResult, ifcAnalytical: any) {
      // Count elements per category from web-ifc geometry
      const cats: Record<string, number> = {};
      ifcResult.elementInfo.forEach(info => cats[info.category] = (cats[info.category] || 0) + 1);

      // Remove existing panel
      document.getElementById("ifc-filter-panel")?.remove();

      const panel = document.createElement("div");
      panel.id = "ifc-filter-panel";
      panel.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
        background:#1e1e2e;border:2px solid #00ccff;border-radius:12px;padding:20px;
        z-index:1000010;color:#eee;font-family:monospace;font-size:12px;min-width:320px;
        box-shadow:0 8px 32px rgba(0,0,0,0.6);`;

      const structural: IfcDetailCategory[] = ["column", "beam", "slab", "footing", "member", "wall"];
      const nonStructural: IfcDetailCategory[] = ["opening", "rebar", "plate", "fastener", "other"];
      const labels: Record<string, string> = {
        column: "Columnas", beam: "Vigas", slab: "Losas", footing: "Zapatas",
        member: "Diagonales", wall: "Muros", opening: "Aberturas", rebar: "Refuerzo",
        plate: "Placas", fastener: "Pernos", other: "Otros",
      };

      let html = `<h3 style="color:#00ccff;margin:0 0 12px">IFC → Modelo Analítico</h3>
        <div style="color:#888;margin-bottom:10px">Selecciona qué convertir a FEM:</div>
        <div style="border:1px solid #444;border-radius:6px;padding:8px;margin-bottom:8px">
          <div style="color:#33ff33;font-weight:bold;margin-bottom:4px">Estructural</div>`;

      for (const cat of structural) {
        const count = cats[cat] || 0;
        if (count === 0) continue;
        const checked = ["column", "beam", "slab"].includes(cat) ? "checked" : "";
        html += `<label style="display:flex;align-items:center;gap:6px;padding:2px 0">
          <input type="checkbox" data-ifc-cat="${cat}" ${checked}>
          <span>${labels[cat] || cat}</span>
          <span style="color:#888;margin-left:auto">(${count})</span>
        </label>`;
      }

      html += `</div><div style="border:1px solid #333;border-radius:6px;padding:8px;margin-bottom:12px">
        <div style="color:#ff6666;font-weight:bold;margin-bottom:4px">No estructural (solo visual)</div>`;

      for (const cat of nonStructural) {
        const count = cats[cat] || 0;
        if (count === 0) continue;
        html += `<label style="display:flex;align-items:center;gap:6px;padding:2px 0;color:#888">
          <input type="checkbox" data-ifc-cat="${cat}" disabled>
          <span>${labels[cat] || cat}</span>
          <span style="margin-left:auto">(${count})</span>
        </label>`;
      }

      html += `</div>
        <div style="display:flex;gap:8px">
          <button id="ifc-gen-analytical" style="flex:1;padding:8px;background:#0f3460;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:bold">
            🔧 Generar Modelo Analítico
          </button>
          <button id="ifc-cancel" style="padding:8px 12px;background:#333;color:#aaa;border:1px solid #555;border-radius:6px;cursor:pointer">✕</button>
        </div>`;

      panel.innerHTML = html;
      document.body.appendChild(panel);

      // Filter 3D view when checkboxes change
      panel.querySelectorAll<HTMLInputElement>("input[data-ifc-cat]").forEach(cb => {
        cb.addEventListener("change", () => {
          const cat = cb.dataset.ifcCat as IfcDetailCategory;
          const group = ifcResult.detailCategories.get(cat);
          if (group) {
            group.visible = cb.checked;
            const ctx = getViewerCtx();
            if (ctx) ctx.render();
          }
        });
      });

      // Generate analytical model
      panel.querySelector("#ifc-gen-analytical")?.addEventListener("click", () => {
        const selectedCats = new Set<string>();
        panel.querySelectorAll<HTMLInputElement>("input[data-ifc-cat]:checked").forEach(cb => {
          selectedCats.add(cb.dataset.ifcCat!);
        });

        // Build analytical model from selected categories
        const ifcNodes: [number, number, number][] = ifcAnalytical.nodes.map((n: any) => [n.x, n.y, n.z]);
        const ifcElements: number[][] = [];
        const ifcEI: any = {
          elasticities: new Map(), shearModuli: new Map(), areas: new Map(),
          momentsOfInertiaY: new Map(), momentsOfInertiaZ: new Map(),
          torsionalConstants: new Map(), densities: new Map(),
          sectionShapes: new Map(),
        };
        const ifcNI: any = { supports: new Map(), loads: new Map() };

        let ei = 0;
        for (const elem of ifcAnalytical.elements) {
          if (!selectedCats.has(elem.category)) continue;
          if (elem.type === "frame" && elem.nodeIds.length >= 2) {
            ifcElements.push(elem.nodeIds);
            const mat = ifcAnalytical.materials?.get(elem.material) || { E: 21328887.92, nu: 0.2, rho: 2.4 };
            const b = elem.b || 0.3, h = elem.h || 0.3;
            const A = b * h;
            const Iz = b * h * h * h / 12;
            const Iy = h * b * b * b / 12;
            const J = b * h * (b * b + h * h) / 12;
            const G = mat.E / (2 * (1 + mat.nu));
            ifcEI.elasticities.set(ei, mat.E);
            ifcEI.shearModuli.set(ei, G);
            ifcEI.areas.set(ei, A);
            ifcEI.momentsOfInertiaY.set(ei, Iy);
            ifcEI.momentsOfInertiaZ.set(ei, Iz);
            ifcEI.torsionalConstants.set(ei, J);
            ifcEI.densities.set(ei, mat.rho);
            ifcEI.sectionShapes.set(ei, { type: "rect", b, h, name: elem.sectionName });
            ei++;
          }
        }

        // Supports at base level
        const baseZ = Math.min(...ifcNodes.map(n => n[2]));
        ifcNodes.forEach((n, idx) => {
          if (Math.abs(n[2] - baseZ) < 0.05) {
            ifcNI.supports.set(idx, [true, true, true, true, true, true]);
          }
        });

        // Remove IFC 3D geometry from scene (keep only analytical)
        for (const [, group] of ifcResult.detailCategories) {
          const ctx = getViewerCtx();
          if (ctx) ctx.scene.remove(group);
        }

        applyImportedModel({
          nodes: ifcNodes,
          elements: ifcElements,
          nodeInputs: ifcNI,
          elementInputs: ifcEI,
          sectionShapes: ifcEI.sectionShapes,
          info: { nNodes: ifcNodes.length, nFrames: ifcElements.length, nShells: 0 },
        }, "IFC analytical");

        panel.remove();
      });

      // Cancel
      panel.querySelector("#ifc-cancel")?.addEventListener("click", () => {
        // Remove IFC geometry from scene
        for (const [, group] of ifcResult.detailCategories) {
          const ctx = getViewerCtx();
          if (ctx) ctx.scene.remove(group);
        }
        const ctx = getViewerCtx();
        if (ctx) ctx.render();
        panel.remove();
      });
    }

    function applyE2kGridsAndStories(model: E2kModel) {
      // ── Populate element classification (columns/beams, floors, bays) ──
      colElementIndices = new Set();
      beamElementIndices = new Set();
      elementFloor = new Map();
      elementBay = new Map();

      // Build story→floor index mapping (bottom=0)
      const storyFloorMap = new Map<string, number>();
      for (let i = 0; i < model.stories.length; i++) {
        storyFloorMap.set(model.stories[i].name, i);
      }

      for (let ei = 0; ei < model.elementTypes.length; ei++) {
        const etype = model.elementTypes[ei];
        const estory = model.elementStories[ei];
        const floor = storyFloorMap.get(estory) ?? 0;
        elementFloor.set(ei, floor);

        if (etype === "COLUMN" || etype === "BRACE") {
          colElementIndices.add(ei);
        } else {
          beamElementIndices.add(ei);
        }
      }

      // ── Set active generator to "edificio" for Settings/Parameters panels ──
      activeGenerator = "edificio";

      // Extract grid X/Y coords and labels from e2k GRIDS section
      const xGrids = model.grids.filter(g => g.dir === "X").sort((a, b) => a.coord - b.coord);
      const yGrids = model.grids.filter(g => g.dir === "Y").sort((a, b) => a.coord - b.coord);

      // If no grids parsed, derive from node coordinates
      let xCoords: number[], yCoords: number[];
      let labelsX: string[], labelsY: string[];

      if (xGrids.length > 0 || yGrids.length > 0) {
        xCoords = xGrids.map(g => g.coord);
        yCoords = yGrids.map(g => g.coord);
        labelsX = xGrids.map(g => g.label);
        labelsY = yGrids.map(g => g.label);
      } else {
        // Fallback: unique X and Y from nodes
        const xs = new Set(model.nodes.map(n => n[0]));
        const ys = new Set(model.nodes.map(n => n[1]));
        xCoords = [...xs].sort((a, b) => a - b);
        yCoords = [...ys].sort((a, b) => a - b);
        labelsX = xCoords.map((_, i) => String(i + 1));
        labelsY = yCoords.map((_, i) => String.fromCharCode(65 + i));
      }

      // Get max elevation from stories
      const zMax = model.stories.length > 0
        ? Math.max(...model.stories.map(s => s.elev))
        : Math.max(...model.nodes.map(n => n[2]));

      // Store grid state for per-axis views
      currentGridX = xCoords;
      currentGridY = yCoords;
      currentGridZmax = zMax;

      // Render grid axes + story level lines
      setTimeout(() => {
        autoFitGridSize();
        createGridAxes(xCoords, yCoords, zMax, labelsX, labelsY);
        createStoryLevelLines(model.stories, xCoords, yCoords);
        updateAxisButtons();
        updateFloorButtons();
      }, 100);

      // Log summary
      const typeCount = { COLUMN: 0, BEAM: 0, BRACE: 0 };
      for (const t of model.elementTypes) typeCount[t as keyof typeof typeCount]++;
      console.log(`E2K grids: X=[${labelsX.join(",")}] Y=[${labelsY.join(",")}]`);
      console.log(`E2K stories: ${model.stories.map(s => `${s.name}@${s.elev.toFixed(2)}`).join(", ")}`);
      console.log(`E2K elements: ${typeCount.COLUMN} columns, ${typeCount.BEAM} beams, ${typeCount.BRACE} braces`);

      updatePanel();
    }

    function downloadText(text: string, filename: string) {
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    }

    if (ioMenu) ioMenu.addEventListener("change", () => {
      ioAction = ioMenu.value;
      ioMenu.value = ""; // reset

      if (ioAction.startsWith("import")) {
        // Set file accept filter
        if (ioAction === "import-e2k") ioFile.accept = ".e2k,.E2K";
        else if (ioAction === "import-s2k") ioFile.accept = ".s2k,.S2K,.$2k";
        else if (ioAction === "import-ifc") ioFile.accept = ".ifc,.IFC";
        else if (ioAction === "import-py") ioFile.accept = ".py";
        else if (ioAction === "import-tcl") ioFile.accept = ".tcl";
        ioFile.click();
      } else if (ioAction.startsWith("export")) {
        const input = {
          nodes: mesh.nodes.val,
          elements: mesh.elements!.val,
          nodeInputs: mesh.nodeInputs!.val,
          elementInputs: mesh.elementInputs!.val,
        };
        try {
          if (ioAction === "export-e2k") {
            downloadText(exportE2k({ ...input, title: "Hekatan Model", e2kModel: lastImportedE2k ?? undefined }), "model.e2k");
          } else if (ioAction === "export-s2k") {
            downloadText(exportS2k({ ...input, title: "Hekatan Model" }), "model.s2k");
          } else if (ioAction === "export-py") {
            downloadText(exportOpenSeesPy(input), "model_opensees.py");
          } else if (ioAction === "export-tcl") {
            downloadText(exportOpenSeesTcl(input), "model_opensees.tcl");
          }
        } catch (err: any) { alert("Export error: " + err.message); }
      }
    });

    if (ioFile) ioFile.addEventListener("change", () => {
      const file = ioFile.files?.[0];
      if (!file) return;

      // IFC needs ArrayBuffer for web-ifc geometry + text for analytical parser
      if (ioAction === "import-ifc") {
        const readerBuf = new FileReader();
        readerBuf.onload = async () => {
          const arrayBuf = readerBuf.result as ArrayBuffer;
          try {
            // Step 1: Load full 3D geometry with web-ifc
            const ctx = getViewerCtx();
            if (!ctx) { alert("Viewer not ready"); return; }
            console.log("IFC: Loading 3D geometry...");
            const ifcResult = await loadIfcToScene(ctx.scene, arrayBuf);
            console.log(`IFC: ${ifcResult.meshCount} meshes loaded, bbox:`, ifcResult.bbox);

            // Adjust camera to fit IFC model
            const center = new THREE.Vector3();
            ifcResult.bbox.getCenter(center);
            const size = new THREE.Vector3();
            ifcResult.bbox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            ctx.controls.target.copy(center);
            ctx.camera.position.set(center.x + maxDim, center.y + maxDim * 0.5, center.z + maxDim);
            ctx.camera.lookAt(center);
            ctx.controls.maxDistance = maxDim * 5;
            ctx.controls.update();
            ctx.render();

            // Store IFC result for later analytical conversion
            (window as any).__ifcLoadResult = ifcResult;
            (window as any).__ifcArrayBuffer = arrayBuf;

            // Step 2: Also parse analytical model (text-based) for FEM
            const textReader = new FileReader();
            textReader.onload = () => {
              const text = textReader.result as string;
              const ifcModel = parseIfcToAnalytical(text);
              (window as any).__ifcAnalytical = ifcModel;

              // Show summary in console
              const cats: Record<string, number> = {};
              ifcResult.elementInfo.forEach(info => cats[info.category] = (cats[info.category] || 0) + 1);
              console.log("IFC categories:", cats);
              console.log(`IFC: ${ifcResult.elementInfo.size} geometric elements, ${ifcModel.elements.length} analytical elements`);

              // Show IFC filter panel
              showIfcFilterPanel(ifcResult, ifcModel);
            };
            textReader.readAsText(file);
          } catch (err: any) {
            alert("IFC error: " + err.message);
            console.error(err);
          }
        };
        readerBuf.readAsArrayBuffer(file);
        ioFile.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        try {
          if (ioAction === "import-e2k") {
            const model = parseE2k(text);
            lastImportedE2k = model; // preserve for round-trip export
            applyImportedModel(model, "E2K imported");
            applyE2kGridsAndStories(model);
          } else if (ioAction === "import-s2k") {
            const model = parseS2k(text);
            applyImportedModel({
              nodes: model.nodes,
              elements: model.elements,
              nodeInputs: model.nodeInputs,
              elementInputs: model.elementInputs,
              sectionShapes: model.sectionShapes,
              info: model.info,
            }, "S2K imported");
          } else if (ioAction === "import-py") {
            const model = importOpenSeesPy(text);
            applyImportedModel(model, "OpenSeesPy imported");
          } else if (ioAction === "import-tcl") {
            const model = importOpenSeesTcl(text);
            applyImportedModel(model, "OpenSees Tcl imported");
          } // IFC handled above with ArrayBuffer reader
        } catch (err: any) { alert("Import error: " + err.message); console.error(err); }
      };
      reader.readAsText(file);
      ioFile.value = ""; // reset
    });

    // === Force unit dropdown ===
    const forceSelect = panel.querySelector("#cad3d-force-unit") as HTMLSelectElement;
    if (forceSelect) {
      forceSelect.value = activeForceId;
      forceSelect.addEventListener("change", (ev) => {
        ev.stopPropagation();
        activeForceId = forceSelect.value as ForceUnitId;
        activeUnits = buildUnitSystem(activeForceId, activeLengthId);
        if (activeGenerator) setGenerator(activeGenerator);
      });
    }

    // === Length unit dropdown ===
    const lengthSelect = panel.querySelector("#cad3d-length-unit") as HTMLSelectElement;
    if (lengthSelect) {
      lengthSelect.value = activeLengthId;
      lengthSelect.addEventListener("change", (ev) => {
        ev.stopPropagation();
        activeLengthId = lengthSelect.value as LengthUnitId;
        activeUnits = buildUnitSystem(activeForceId, activeLengthId);
        if (activeGenerator) setGenerator(activeGenerator);
      });
    }

    // === Unit presets (MKS, SI, US) ===
    panel.querySelectorAll("[data-preset]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const preset = (btn as HTMLElement).dataset.preset!;
        const p = UNIT_PRESETS[preset];
        if (!p) return;
        activeForceId = p.force;
        activeLengthId = p.length;
        activeStressUnit = p.stress;
        activePreset = preset;
        activeUnits = buildUnitSystem(activeForceId, activeLengthId);
        // Update dropdowns
        if (forceSelect) forceSelect.value = activeForceId;
        if (lengthSelect) lengthSelect.value = activeLengthId;
        // Highlight active preset
        panel.querySelectorAll("[data-preset]").forEach((b) => {
          (b as HTMLElement).classList.toggle("active", (b as HTMLElement).dataset.preset === preset);
        });
        if (activeGenerator) setGenerator(activeGenerator);
        console.log(`Preset: ${preset} → ${activeForceId}+${activeLengthId}, stress: ${activeStressUnit.label}`);
      });
    });

    // === Modal analysis toggle ===
    // === Log panel ===
    panel.querySelector("#cad3d-log")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      showLogPanel();
    });

    // === Pushover panel ===
    panel.querySelector("#cad3d-pushover")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      showPushoverPanel();
    });

    // === Nonlinear panel ===
    panel.querySelector("#cad3d-nonlinear")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      showNonlinearPanel();
    });

    // === FEM Solver / Report Explained ===
    panel.querySelector("#cad3d-fem-solver")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      showFemSolverReport();
    });

    // === Calculadora FEM ===
    panel.querySelector("#cad3d-calc")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      import("../calc-editor/calcPanel").then(({ openCalcPanel }) => {
        const modelData = {
          nodes: mesh.nodes.val,
          elements: mesh.elements.val,
          nodeInputs: mesh.nodeInputs?.val ?? {},
          elementInputs: mesh.elementInputs?.val ?? {},
          modelName: activeGenerator ? activeGenerator.charAt(0).toUpperCase() + activeGenerator.slice(1) : "Modelo",
        };
        openCalcPanel(modelData);
      });
    });

    panel.querySelector("#cad3d-modal")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      modalEnabled = !modalEnabled;
      const btn = panel.querySelector("#cad3d-modal") as HTMLElement;
      btn?.classList.toggle("active", modalEnabled);
      const prevBtn = panel.querySelector("#cad3d-mode-prev") as HTMLElement;
      const nextBtn = panel.querySelector("#cad3d-mode-next") as HTMLElement;
      const modeLabel = panel.querySelector("#cad3d-mode-label") as HTMLElement;

      const scaleInput = panel.querySelector("#cad3d-modal-scale") as HTMLInputElement;
      if (modalEnabled) {
        // Hide load arrows via reactive system (works now that getViewer crash is fixed)
        const ctx = getViewerCtx();
        if (ctx?.settings?.loads) {
          modalLoadsWasVisible = ctx.settings.loads.rawVal;
          ctx.settings.loads.val = false;
        }
        // Run modal on current model
        runModalAnalysis();
        prevBtn.style.display = "";
        nextBtn.style.display = "";
        modeLabel.style.display = "";
        if (scaleInput) scaleInput.style.display = "";
        updateModeLabel();
      } else {
        stopModalAnimation();
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
        modeLabel.style.display = "none";
        if (scaleInput) scaleInput.style.display = "none";
        // Re-run static analysis to restore deformed shape
        if (activeGenerator && activeGenerator !== "placa-q4" && activeGenerator !== "placa-3q") {
          regenerateFromParams();
        }
        // Restore load arrows via reactive system AFTER regeneration settles
        setTimeout(() => {
          const ctx = getViewerCtx();
          if (ctx?.settings?.loads && modalLoadsWasVisible) {
            ctx.settings.loads.val = true;
          }
        }, 600);
      }
    });

    function updateModeLabel() {
      const label = panel.querySelector("#cad3d-mode-label") as HTMLElement;
      if (!label || !modalResults?.frequencies) return;
      const f = modalResults.frequencies[modalMode];
      const T = f > 0 ? 1 / f : 0;
      // Cumulative mass participation up to current mode
      const sumP = [0, 0, 0, 0, 0, 0];
      for (let i = 0; i <= modalMode; i++) {
        const mp = modalResults.massParticipation?.[i];
        if (mp) for (let d = 0; d < 6; d++) sumP[d] += mp[d];
      }
      label.textContent = `Modo ${modalMode + 1} — ${f.toFixed(2)} Hz — T=${T.toFixed(3)}s — ΣUx=${(sumP[0]*100).toFixed(1)}% ΣUy=${(sumP[1]*100).toFixed(1)}% ΣRz=${(sumP[5]*100).toFixed(1)}%`;
    }

    panel.querySelector("#cad3d-mode-prev")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (!modalResults?.modeShapes) return;
      modalMode = (modalMode - 1 + modalResults.modeShapes.length) % modalResults.modeShapes.length;
      // Recompute scale for this mode
      const shape = modalResults.modeShapes[modalMode];
      const { extent } = getModelBounds();
      let maxDisp = 0;
      for (let i = 0; i < modalOriginalNodes.length; i++) {
        const dx = shape[i * 6] || 0, dy = shape[i * 6 + 1] || 0, dz = shape[i * 6 + 2] || 0;
        maxDisp = Math.max(maxDisp, Math.sqrt(dx * dx + dy * dy + dz * dz));
      }
      modalScale = maxDisp > 1e-12 ? (extent * 0.05) / maxDisp : 1;
      startModalAnimation();
      updateModeLabel();
    });

    panel.querySelector("#cad3d-mode-next")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (!modalResults?.modeShapes) return;
      modalMode = (modalMode + 1) % modalResults.modeShapes.length;
      const shape = modalResults.modeShapes[modalMode];
      const { extent } = getModelBounds();
      let maxDisp = 0;
      for (let i = 0; i < modalOriginalNodes.length; i++) {
        const dx = shape[i * 6] || 0, dy = shape[i * 6 + 1] || 0, dz = shape[i * 6 + 2] || 0;
        maxDisp = Math.max(maxDisp, Math.sqrt(dx * dx + dy * dy + dz * dz));
      }
      modalScale = maxDisp > 1e-12 ? (extent * 0.05) / maxDisp : 1;
      startModalAnimation();
      updateModeLabel();
    });

    // Modal scale input: restart animation when changed
    const modalScaleInput = panel.querySelector("#cad3d-modal-scale") as HTMLInputElement;
    modalScaleInput?.addEventListener("mousedown", (ev) => ev.stopPropagation());
    modalScaleInput?.addEventListener("change", () => {
      if (modalEnabled && modalResults?.modeShapes) {
        startModalAnimation();
      }
    });

    // === CLI Panel ===
    const cliToggle = panel.querySelector("#cad3d-cli-toggle");
    const cliPanel = panel.querySelector("#cad3d-cli-panel") as HTMLDivElement;
    const cliOutput = panel.querySelector("#cad3d-cli-output") as HTMLDivElement;
    const cmdInput = panel.querySelector("#cad3d-cmd") as HTMLInputElement;
    const cmdHistory: string[] = [];
    let cmdHistIdx = -1;

    cliToggle?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (cliPanel) {
        const visible = cliPanel.style.display !== "none";
        cliPanel.style.display = visible ? "none" : "block";
        if (!visible) {
          cmdInput?.focus();
          if (cliOutput && !cliOutput.textContent) {
            cliOutput.textContent = `CLI ready. Commands:\n  cad.addNode(x, y, z)     cad.addFrame(i, j)\n  cad.addSupport(n)        cad.addLoad(n, [fx,fy,fz,0,0,0])\n  cad.frame([5,5],[3,3])   cad.building([5],[4],[3])\n  cad.galpon(12,20,6,3)    cad.clear()\n  cad.info()               cad.listNodes()\n`;
          }
        }
      }
    });
    cmdInput?.addEventListener("mousedown", (ev) => ev.stopPropagation());

    // Keyboard shortcuts
    document.addEventListener("keydown", (ev) => {
      // Ctrl+Z = Undo, Ctrl+Y or Ctrl+Shift+Z = Redo
      if ((ev.ctrlKey || ev.metaKey) && ev.key === "z" && !ev.shiftKey) {
        ev.preventDefault(); doUndo(); return;
      }
      if ((ev.ctrlKey || ev.metaKey) && (ev.key === "y" || (ev.key === "z" && ev.shiftKey))) {
        ev.preventDefault(); doRedo(); return;
      }
      // Delete key = delete selected elements
      if (ev.key === "Delete" || ev.key === "Backspace") {
        if (selectedElements.size > 0) {
          ev.preventDefault();
          selectedElements.forEach(idx => deletedElements.add(idx));
          selectedElements.clear();
          if (selectToolbar) { selectToolbar.remove(); selectToolbar = null; }
          regenerateFromParams();
          return;
        }
      }
      if (ev.key === "Escape") {
        if (drawMode) {
          if (drawStartNode !== null) {
            // Cancel current element, but stay in draw mode
            drawStartNode = null;
            const ctx = getViewerCtx();
            if (drawPreviewLine && ctx) { ctx.scene.remove(drawPreviewLine); drawPreviewLine.geometry.dispose(); (drawPreviewLine.material as THREE.Material).dispose(); drawPreviewLine = null; }
            if (drawSnapHighlight && ctx) { ctx.scene.remove(drawSnapHighlight); drawSnapHighlight.geometry.dispose(); (drawSnapHighlight.material as THREE.Material).dispose(); drawSnapHighlight = null; }
            ctx?.render();
          } else {
            cleanupDraw();
          }
        }
        if (selectMode) cleanupSelect();
        if (inspectMode) { inspectMode = false; cleanupInspect(); panel.querySelector("#cad3d-inspect")?.classList.remove("inspect-active"); }
      }
    });
    cmdInput?.addEventListener("keydown", (ev) => {
      ev.stopPropagation();
      if (ev.key === "Enter") {
        const cmd = cmdInput.value.trim();
        if (cmd) {
          cmdHistory.unshift(cmd);
          cmdHistIdx = -1;
          if (cliOutput) cliOutput.textContent += `> ${cmd}\n`;
          try {
            const result = new Function("cad", `return ${cmd}`)(cli);
            if (result !== undefined && cliOutput) {
              const str = typeof result === "object" ? JSON.stringify(result, null, 2) : String(result);
              cliOutput.textContent += `${str}\n`;
            }
          } catch (err: any) {
            if (cliOutput) cliOutput.textContent += `ERROR: ${err.message}\n`;
          }
          if (cliOutput) cliOutput.scrollTop = cliOutput.scrollHeight;
          cmdInput.value = "";
        }
      } else if (ev.key === "ArrowUp") {
        ev.preventDefault();
        if (cmdHistory.length > 0 && cmdHistIdx < cmdHistory.length - 1) {
          cmdHistIdx++;
          cmdInput.value = cmdHistory[cmdHistIdx];
        }
      } else if (ev.key === "ArrowDown") {
        ev.preventDefault();
        if (cmdHistIdx > 0) { cmdHistIdx--; cmdInput.value = cmdHistory[cmdHistIdx]; }
        else { cmdHistIdx = -1; cmdInput.value = ""; }
      }
    });

    let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;
    panel.addEventListener("mousedown", (e: MouseEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "BUTTON" || tag === "INPUT" || tag === "SELECT") return;
      dragging = true; const rect = panel.getBoundingClientRect();
      // Fix: clear bottom so top+bottom don't stretch the panel
      panel.style.bottom = "unset";
      startX = e.clientX; startY = e.clientY; startLeft = rect.left; startTop = rect.top; e.preventDefault();
    });
    window.addEventListener("mousemove", (e: MouseEvent) => { if (!dragging) return; e.preventDefault(); panel.style.left = (startLeft + (e.clientX - startX)) + "px"; panel.style.top = (startTop + (e.clientY - startY)) + "px"; });
    window.addEventListener("mouseup", () => { dragging = false; });
    updatePanel();
  }, 10);

  // === View switching logic ===
  function getViewerCtx(): ViewerContext3D | null {
    const viewer = document.getElementById("viewer");
    return viewer ? (viewer as any).__ctx : null;
  }

  function getModelBounds() {
    const nodes = mesh.nodes.val;
    if (nodes.length === 0) return { center: new THREE.Vector3(), extent: 10 };
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (const [x, y, z] of nodes) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
    }
    const center = new THREE.Vector3((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);
    const extent = Math.max(maxX - minX, maxY - minY, maxZ - minZ, 1);
    return { center, extent };
  }

  /** Auto-fit gridSize, grid, axes, and camera to the current model extent */
  function autoFitGridSize(keepCamera = false) {
    const ctx = getViewerCtx();
    if (!ctx) return;
    const { extent } = getModelBounds();
    // Smart grid sizing: round to nice numbers proportional to model extent
    // For small models (2m): gridSize ≈ 3-4m. For large (500in): gridSize ≈ 700in
    let newGridSize: number;
    if (extent <= 5) {
      newGridSize = Math.max(1, Math.ceil(extent * 1.5));           // round to 1
    } else if (extent <= 50) {
      newGridSize = Math.max(5, Math.ceil(extent * 1.3 / 5) * 5);  // round to 5
    } else {
      newGridSize = Math.max(20, Math.ceil(extent * 1.3 / 10) * 10); // round to 10
    }
    ctx.settings.gridSize.val = newGridSize;

    // 1. Remove ALL old grids (by type name)
    const oldGrids = ctx.scene.children.filter(c => c.type === 'GridHelper');
    oldGrids.forEach(g => { (g as any).geometry?.dispose(); (g as any).material?.dispose(); ctx.scene.remove(g); });

    // 2. Add new grid
    const t = getTheme();
    const newGrid = new THREE.GridHelper(newGridSize, 20, t.grid, t.grid);
    newGrid.rotation.x = Math.PI / 2;
    newGrid.position.set(0.5 * newGridSize, 0.5 * newGridSize, 0);
    ctx.scene.add(newGrid);

    // 3. Remove ALL old axes groups (named viewerAxes OR containing ArrowHelper)
    //    Exclude loadsGroup — it also uses ArrowHelper for load arrows
    const oldAxes = ctx.scene.children.filter(c =>
      c.type === 'Group' && c.name !== 'gridAxes' && c.name !== 'loadsGroup' &&
      (c.name === 'viewerAxes' || c.children.some(ch => ch instanceof THREE.ArrowHelper))
    );
    oldAxes.forEach(g => {
      g.traverse(obj => {
        if ((obj as any).geometry) (obj as any).geometry.dispose();
        if ((obj as any).material) {
          if ((obj as any).material.map) (obj as any).material.map.dispose();
          (obj as any).material.dispose();
        }
      });
      ctx.scene.remove(g);
    });

    // 4. Recreate axes with new size
    const size = 0.05 * newGridSize;
    const axGroup = new THREE.Group();
    axGroup.name = "viewerAxes";
    const ac = t.axisArrow;
    axGroup.add(new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(), 1, ac, 0.2, 0.2));
    axGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(), 1, ac, 0.2, 0.2));
    axGroup.add(new THREE.ArrowHelper(new THREE.Vector3(0,0,1), new THREE.Vector3(), 1, ac, 0.2, 0.2));
    axGroup.children.forEach(a => a.scale.set(size, size, size));
    for (const [label, color, pos] of [["X","red",[1.3*size,0,0]], ["Y","green",[0,1.3*size,0]], ["Z","blue",[0,0,1.3*size]]] as [string,string,number[]][]) {
      const canvas = document.createElement("canvas");
      canvas.width = 64; canvas.height = 64;
      const c2 = canvas.getContext("2d")!;
      c2.fillStyle = color;
      c2.font = "bold 50px Arial";
      c2.textAlign = "center"; c2.textBaseline = "middle";
      c2.fillText(label, 32, 34);
      const tex = new THREE.Texture(canvas); tex.needsUpdate = true;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
      sp.position.set(pos[0], pos[1], pos[2]);
      sp.scale.set(0.4 * size, 0.4 * size, 1);
      sp.renderOrder = 99;
      axGroup.add(sp);
    }
    ctx.scene.add(axGroup);

    // 5. Reframe camera to fit new model (skip when just refreshing theme)
    if (!keepCamera) applyViewMode("3d");
    else ctx.render();
  }

  /** Clip half-width: enough to isolate one grid line without cutting beams.
   *  For 3D buildings (multiple grid lines in the clipping direction), use a thin
   *  slice. For 2D frames (only 1 grid line in the other direction), don't clip. */
  function getClipHalf(coords: number[], idx: number, extent: number): number {
    if (coords.length < 2) return extent * 10; // effectively no clip
    let minDist = Infinity;
    if (idx > 0) minDist = Math.min(minDist, Math.abs(coords[idx] - coords[idx - 1]));
    if (idx < coords.length - 1) minDist = Math.min(minDist, Math.abs(coords[idx + 1] - coords[idx]));
    return (minDist * 0.45) || extent * 0.1;
  }

  function applyViewMode(mode: string) {
    const ctx = getViewerCtx();
    if (!ctx) return;
    const { center, extent } = getModelBounds();
    const aspect = ctx.renderer.domElement.clientWidth / (ctx.renderer.domElement.clientHeight || 1);
    const halfExt = extent * 0.7;

    // Adjust controls limits to fit any model size
    ctx.controls.maxDistance = extent * 5;
    ctx.controls.minDistance = extent * 0.05;

    ctx.renderer.clippingPlanes = [];

    /** After setting renderer.clippingPlanes, exempt grid/labels from clipping */
    const exemptFromClipping = () => {
      ctx.scene.traverse((obj: any) => {
        if (!obj.material) return;
        // Exempt: GridHelper, Text sprites, section shapes, axes
        const isGrid = obj.type === "GridHelper" || obj.type === "AxesHelper";
        const isSprite = obj.isSprite;
        const isNoClip = obj.userData?.noClip === true;
        if (isGrid || isSprite || isNoClip) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m: any) => { m.clippingPlanes = []; });
          } else {
            obj.material.clippingPlanes = [];
          }
        }
      });
    };

    if (mode === "3d") {
      // Perspective: fit model using FOV with generous margin
      const fov = (ctx.perspCamera as THREE.PerspectiveCamera).fov;
      const dist = extent / (2 * Math.tan((fov * Math.PI) / 360)) * 2.2;
      ctx.perspCamera.position.set(
        center.x + dist * 0.5,
        center.y - dist * 0.8,
        center.z + dist * 0.5
      );
      ctx.controls.target.copy(center);
      ctx.setActiveCamera(ctx.perspCamera);
    } else {
      // Orthographic views
      const cam = ctx.orthoCamera;
      cam.left = -halfExt * aspect;
      cam.right = halfExt * aspect;
      cam.top = halfExt;
      cam.bottom = -halfExt;
      cam.near = -extent * 10;
      cam.far = extent * 10;
      cam.updateProjectionMatrix();

      // Helper: force orthographic camera orientation
      const setOrthoView = (pos: THREE.Vector3, target: THREE.Vector3, up: THREE.Vector3) => {
        cam.position.copy(pos);
        cam.up.copy(up);
        ctx.controls.target.copy(target);
        cam.lookAt(target);
        ctx.controls.update();
      };

      if (mode === "plan") {
        ctx.renderer.clippingPlanes = [];
        setOrthoView(
          new THREE.Vector3(center.x, center.y, center.z + extent * 2),
          new THREE.Vector3(center.x, center.y, center.z),
          new THREE.Vector3(0, 1, 0)
        );
      } else if (mode.startsWith("plan:")) {
        // Plan view per floor — clip Z (height axis) to isolate floor
        const floorIdx = parseInt(mode.split(":")[1]);
        const hPiso = generatorParams["hPiso"]?.val ?? 3.0;
        const floorZ = (floorIdx + 1) * hPiso;
        const clipHalf = hPiso * 0.45;
        ctx.renderer.clippingPlanes = [
          new THREE.Plane(new THREE.Vector3(0, 0, -1), floorZ + clipHalf),
          new THREE.Plane(new THREE.Vector3(0, 0, 1), -floorZ + clipHalf),
        ];
        exemptFromClipping();
        setOrthoView(
          new THREE.Vector3(center.x, center.y, floorZ + extent * 2),
          new THREE.Vector3(center.x, center.y, floorZ),
          new THREE.Vector3(0, 1, 0)
        );
      } else if (mode === "elevX") {
        cam.position.set(center.x + extent * 2, center.y, center.z);
        cam.up.set(0, 0, 1);
      } else if (mode === "elevY") {
        cam.position.set(center.x, center.y - extent * 2, center.z);
        cam.up.set(0, 0, 1);
      } else if (mode.startsWith("axisX:")) {
        // Eje A/B/C — frame lies in YZ plane at this X position
        // Camera looks along ±X axis to see columns + Y-direction beams
        const idx = parseInt(mode.split(":")[1]);
        const xPos = currentGridX[idx] ?? center.x;
        const is3D = currentGridY.length > 1;

        if (is3D) {
          // 3D building: clip in X to isolate this frame plane, look along X
          const clipHalf = getClipHalf(currentGridX, idx, extent);
          ctx.renderer.clippingPlanes = [
            new THREE.Plane(new THREE.Vector3(-1, 0, 0), xPos + clipHalf),
            new THREE.Plane(new THREE.Vector3(1, 0, 0), -xPos + clipHalf),
          ];
          exemptFromClipping();
          // Look in -X direction: camera far in +X
          cam.position.set(center.x + extent * 2, center.y, center.z);
          ctx.controls.target.set(center.x, center.y, center.z);
        } else {
          // 2D frame (XZ plane): look in -Y (same as EY), no clipping
          cam.position.set(center.x, center.y - extent * 2, center.z);
          ctx.controls.target.copy(center);
        }
        cam.up.set(0, 0, 1);
      } else if (mode.startsWith("axisY:")) {
        // Eje 1/2/3 — frame lies in XZ plane at this Y position
        // Camera looks along ±Y axis to see columns + X-direction beams
        const idx = parseInt(mode.split(":")[1]);
        const yPos = currentGridY[idx] ?? center.y;
        const is3D = currentGridX.length > 1;

        if (is3D) {
          // 3D building: clip in Y to isolate this frame plane, look along Y
          const clipHalf = getClipHalf(currentGridY, idx, extent);
          ctx.renderer.clippingPlanes = [
            new THREE.Plane(new THREE.Vector3(0, -1, 0), yPos + clipHalf),
            new THREE.Plane(new THREE.Vector3(0, 1, 0), -yPos + clipHalf),
          ];
          exemptFromClipping();
          // Look in +Y direction: camera far in -Y
          cam.position.set(center.x, center.y - extent * 2, center.z);
          ctx.controls.target.set(center.x, center.y, center.z);
        } else {
          cam.position.set(center.x + extent * 2, center.y, center.z);
          ctx.controls.target.copy(center);
        }
        cam.up.set(0, 0, 1);
      }
      if (!mode.startsWith("axisX:") && !mode.startsWith("axisY:")) {
        ctx.controls.target.copy(center);
      }
      ctx.setActiveCamera(cam);
    }
  }

  /** Build dynamic axis buttons: Ejes X: A B C | Ejes Y: 1 2 3 */
  function updateAxisButtons() {
    const container = panel.querySelector("#cad3d-axis-buttons") as HTMLElement;
    if (!container) return;

    // Only show for edificio/frame with >=2 grid lines in either direction
    if (currentGridX.length < 2 && currentGridY.length < 2) {
      container.style.display = "none";
      return;
    }
    container.style.display = "";
    container.innerHTML = "";

    const makeBtn = (label: string, viewMode: string, title: string) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.dataset.view = viewMode;
      btn.title = title;
      btn.style.cssText = "min-width:22px;padding:1px 5px;font-weight:bold";
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        // Toggle: if already active, go back to 3D
        const wasActive = btn.classList.contains("view-active");
        panel.querySelectorAll("[data-view]").forEach((b) => (b as HTMLElement).classList.remove("view-active"));
        if (wasActive) {
          applyViewMode("3d");
          panel.querySelector('[data-view="3d"]')?.classList.add("view-active");
        } else {
          applyViewMode(viewMode);
          btn.classList.add("view-active");
        }
      });
      return btn;
    };

    // Label "Ejes:"
    const lbl = document.createElement("span");
    lbl.textContent = "Ejes:";
    lbl.style.cssText = "color:#888;font-size:10px;margin-right:2px;align-self:center";
    container.appendChild(lbl);

    // X grid lines → letters A, B, C...
    const xLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    currentGridX.forEach((_, i) => {
      const letter = i < xLabels.length ? xLabels[i] : `X${i}`;
      container.appendChild(makeBtn(letter, `axisX:${i}`, `Eje ${letter} — elevación mirando en Y`));
    });

    // Separator
    const sep = document.createElement("span");
    sep.textContent = "|";
    sep.style.cssText = "color:#555;margin:0 3px;align-self:center;font-weight:bold";
    container.appendChild(sep);

    // Y grid lines → numbers 1, 2, 3...
    currentGridY.forEach((_, i) => {
      const num = `${i + 1}`;
      container.appendChild(makeBtn(num, `axisY:${i}`, `Eje ${num} — elevación mirando en X`));
    });
  }

  function updateFloorButtons() {
    const container = panel.querySelector("#cad3d-floor-buttons") as HTMLElement;
    if (!container) return;

    const nPisos = Math.round(generatorParams["nPisos"]?.val ?? 0);
    if (nPisos < 1) { container.style.display = "none"; return; }
    container.style.display = "";
    container.innerHTML = "";

    const makeBtn = (label: string, viewMode: string, title: string) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.dataset.view = viewMode;
      btn.title = title;
      btn.style.cssText = "min-width:22px;padding:1px 5px;font-weight:bold";
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const wasActive = btn.classList.contains("view-active");
        panel.querySelectorAll("[data-view]").forEach((b) => (b as HTMLElement).classList.remove("view-active"));
        if (wasActive) {
          applyViewMode("3d");
          panel.querySelector('[data-view="3d"]')?.classList.add("view-active");
        } else {
          applyViewMode(viewMode);
          btn.classList.add("view-active");
        }
      });
      return btn;
    };

    const lbl = document.createElement("span");
    lbl.textContent = "Planta:";
    lbl.style.cssText = "color:#888;font-size:10px;margin-right:2px;align-self:center";
    container.appendChild(lbl);

    for (let i = 0; i < nPisos; i++) {
      container.appendChild(makeBtn(`P${i + 1}`, `plan:${i}`, `Planta Piso ${i + 1}`));
    }
  }

  function resetViewTo3D() {
    applyViewMode("3d");
    panel.querySelectorAll("[data-view]").forEach((b) =>
      (b as HTMLElement).classList.toggle("view-active", (b as HTMLElement).dataset.view === "3d")
    );
  }

  // Expose view command on CLI
  cli.view = (mode: string) => {
    const aliases: Record<string, string> = { planta: "plan", elevationX: "elevX", elevationY: "elevY", corte: "section" };
    mode = aliases[mode] || mode;
    applyViewMode(mode);
    panel.querySelectorAll("[data-view]").forEach((b) => (b as HTMLElement).classList.toggle("view-active", (b as HTMLElement).dataset.view === mode));
  };

  // ═══════════════════════════════════════════
  //  FEM ELEMENT INSPECTION (Raycasting + Detail Panel)
  // ═══════════════════════════════════════════
  let inspectMode = false;
  let selectMode = false;
  let drawMode = false;
  let drawTool: "line" | "arc" | "node" | "area" = "line";
  let areaPolyNodes: number[] = []; // node indices for area polygon being drawn
  let drawStartNode: number | null = null;
  let drawPreviewLine: THREE.Line | null = null;
  let drawSnapHighlight: THREE.Mesh | null = null;
  let drawHoverNode: number | null = null;
  let drawToolbar: HTMLDivElement | null = null;
  let drawArcMidNode: number | null = null; // for 3-point arc
  const drawSnaps = { node: true, grid: true, midpoint: true, track: true };
  const GRID_SNAP = 0.5; // snap grid size (m)
  let trackLines: THREE.LineSegments[] = [];
  let trackLabel: HTMLDivElement | null = null;
  let trackBaseNode: number | null = null; // node from which tracking extends

  // ═══════════════════════════════════════════
  //  UNDO SYSTEM (Ctrl+Z / Ctrl+Y)
  // ═══════════════════════════════════════════
  type UndoState = { nodes: Node[]; elements: Element[] };
  const undoStack: UndoState[] = [];
  const redoStack: UndoState[] = [];
  const MAX_UNDO = 50;

  function pushUndo() {
    undoStack.push({
      nodes: JSON.parse(JSON.stringify(mesh.nodes.val)),
      elements: JSON.parse(JSON.stringify(mesh.elements.val)),
    });
    if (undoStack.length > MAX_UNDO) undoStack.shift();
    redoStack.length = 0; // clear redo on new action
  }

  function doUndo() {
    if (undoStack.length === 0) return;
    redoStack.push({
      nodes: JSON.parse(JSON.stringify(mesh.nodes.val)),
      elements: JSON.parse(JSON.stringify(mesh.elements.val)),
    });
    const state = undoStack.pop()!;
    mesh.nodes.val = state.nodes;
    mesh.elements.val = state.elements;
    setDefaultElementInputs();
    mesh.elementInputs!.val = { ...mesh.elementInputs!.val };
  }

  function doRedo() {
    if (redoStack.length === 0) return;
    undoStack.push({
      nodes: JSON.parse(JSON.stringify(mesh.nodes.val)),
      elements: JSON.parse(JSON.stringify(mesh.elements.val)),
    });
    const state = redoStack.pop()!;
    mesh.nodes.val = state.nodes;
    mesh.elements.val = state.elements;
    setDefaultElementInputs();
    mesh.elementInputs!.val = { ...mesh.elementInputs!.val };
  }
  const selectedElements = new Set<number>();
  let highlightObj: THREE.LineSegments | null = null;
  let selectionHighlights: THREE.LineSegments[] = [];
  let inspectPanel: HTMLDivElement | null = null;
  let selectToolbar: HTMLDivElement | null = null;

  function addSelectionHighlight(elemIdx: number) {
    const ctx = getViewerCtx();
    if (!ctx) return;
    const nodes = mesh.nodes.val;
    const elem = mesh.elements.val[elemIdx];
    if (!elem) return;
    const points: number[] = [];
    for (let i = 0; i < elem.length; i++) {
      const a = nodes[elem[i]], b = nodes[elem[(i + 1) % elem.length]];
      points.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    const hl = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xff00ff, linewidth: 3, depthTest: false }));
    hl.renderOrder = 9998;
    (hl as any).__elemIdx = elemIdx;
    ctx.scene.add(hl);
    selectionHighlights.push(hl);
    ctx.render();
  }

  function clearSelectionHighlights() {
    const ctx = getViewerCtx();
    selectionHighlights.forEach(hl => {
      ctx?.scene.remove(hl);
      hl.geometry.dispose();
      (hl.material as THREE.Material).dispose();
    });
    selectionHighlights = [];
    ctx?.render();
  }

  function updateSelectToolbar() {
    if (selectToolbar) selectToolbar.remove();
    const hasVisFilter = hiddenElements.size > 0 || isolateMode;
    if (selectedElements.size === 0 && !hasVisFilter) { selectToolbar = null; return; }

    const div = document.createElement("div");
    div.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--cad-bg);color:var(--cad-text);border:2px solid var(--cad-heading);border-radius:8px;padding:10px 16px;z-index:10000;font-family:monospace;font-size:13px;display:flex;gap:12px;align-items:center;box-shadow:0 4px 20px var(--cad-shadow);";
    div.innerHTML = `
      <span style="color:var(--cad-heading);font-weight:bold;">${selectedElements.size} elem.</span>
      <button id="sel-assign" style="padding:5px 8px;background:#336699;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Asignar secci\u00f3n">📐</button>
      <button id="sel-info" style="padding:5px 8px;background:#225588;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Info del elemento">🔍</button>
      <button id="sel-hide" style="padding:5px 8px;background:#665500;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Ocultar seleccionados">👁‍🗨</button>
      <button id="sel-isolate" style="padding:5px 8px;background:#006633;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Aislar (mostrar solo seleccionados)">◎</button>
      <button id="sel-showall" style="padding:5px 8px;background:#444;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Mostrar todo">↺</button>
      <button id="sel-delete" style="padding:5px 8px;background:#cc3333;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Eliminar seleccionados">🗑</button>
      <button id="sel-clear" style="padding:5px 8px;background:#555;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Limpiar selección">✕</button>
    `;
    document.body.appendChild(div);
    selectToolbar = div;

    div.querySelector("#sel-assign")!.addEventListener("click", () => {
      showAssignSectionPanel([...selectedElements]);
    });
    div.querySelector("#sel-info")!.addEventListener("click", () => {
      if (selectedElements.size === 1) {
        const idx = [...selectedElements][0];
        showInspectPanel(idx);
      } else {
        // Multi-element summary
        const arr = [...selectedElements];
        const nodes_a = mesh.nodes.val;
        const elems = mesh.elements.val;
        let cols = 0, beams = 0, shells3 = 0, shells4 = 0;
        arr.forEach(i => {
          const e = elems[i]; if (!e) return;
          if (e.length === 2) {
            const n1 = nodes_a[e[0]], n2 = nodes_a[e[1]];
            const dx = Math.abs(n2[0]-n1[0]), dy = Math.abs(n2[1]-n1[1]), dz = Math.abs(n2[2]-n1[2]);
            if (dz > dx && dz > dy) cols++; else beams++;
          } else if (e.length === 3) { shells3++; }
          else if (e.length === 4) { shells4++; }
        });
        const parts = [];
        if (cols) parts.push(`${cols} columnas`);
        if (beams) parts.push(`${beams} vigas`);
        if (shells4) parts.push(`${shells4} shells Q4`);
        if (shells3) parts.push(`${shells3} triangulos`);
        alert(`${arr.length} elementos seleccionados:\n${parts.join(', ')}`);
      }
    });
    div.querySelector("#sel-hide")!.addEventListener("click", () => {
      selectedElements.forEach(idx => hiddenElements.add(idx));
      selectedElements.clear();
      clearSelectionHighlights();
      updateSelectToolbar();
      regenerateFromParams();
    });
    div.querySelector("#sel-isolate")!.addEventListener("click", () => {
      isolateMode = true;
      isolatedElements.clear();
      selectedElements.forEach(idx => isolatedElements.add(idx));
      selectedElements.clear();
      clearSelectionHighlights();
      updateSelectToolbar();
      regenerateFromParams();
    });
    div.querySelector("#sel-showall")!.addEventListener("click", () => {
      hiddenElements.clear();
      isolateMode = false;
      isolatedElements.clear();
      updateSelectToolbar();
      regenerateFromParams();
    });
    div.querySelector("#sel-delete")!.addEventListener("click", () => {
      pushUndo();
      selectedElements.forEach(idx => deletedElements.add(idx));
      selectedElements.clear();
      clearSelectionHighlights();
      updateSelectToolbar();
      regenerateFromParams();
    });
    div.querySelector("#sel-clear")!.addEventListener("click", () => {
      selectedElements.clear();
      clearSelectionHighlights();
      updateSelectToolbar();
    });
  }

  function cleanupSelect() {
    selectMode = false;
    selectedElements.clear();
    clearSelectionHighlights();
    if (selectToolbar) { selectToolbar.remove(); selectToolbar = null; }
    const btn = panel.querySelector("#cad3d-select") as HTMLElement;
    btn?.classList.remove("inspect-active");
    // Re-enable orbit controls when leaving select mode
    const ctx_cs = getViewerCtx();
    if (ctx_cs) ctx_cs.controls.enabled = true;
  }

  function cleanupInspect() {
    if (highlightObj) {
      const ctx = getViewerCtx();
      ctx?.scene.remove(highlightObj);
      highlightObj.geometry.dispose();
      (highlightObj.material as THREE.Material).dispose();
      highlightObj = null;
      ctx?.render();
    }
    if (inspectPanel) { inspectPanel.remove(); inspectPanel = null; }
  }

  // ═══════════════════════════════════════════
  //  DRAW MODE — Create new beam/column elements
  // ═══════════════════════════════════════════
  /** Show tracking lines from a node along X, Y, Z axes */
  function showTrackingLines(nodeIdx: number) {
    clearTrackingLines();
    const ctx = getViewerCtx();
    if (!ctx) return;
    const n = mesh.nodes.val[nodeIdx];
    if (!n) return;
    trackBaseNode = nodeIdx;

    const ext = 200; // extension length
    const axes: [number[], number, string][] = [
      [[1,0,0], 0xff3333, "X"], // X = red
      [[0,1,0], 0x33ff33, "Y"], // Y = green
      [[0,0,1], 0x3333ff, "Z"], // Z = blue
    ];

    for (const [dir, color] of axes) {
      const verts = new Float32Array([
        n[0] - dir[0]*ext, n[1] - dir[1]*ext, n[2] - dir[2]*ext,
        n[0] + dir[0]*ext, n[1] + dir[1]*ext, n[2] + dir[2]*ext,
      ]);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
      const mat = new THREE.LineDashedMaterial({ color, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.4, depthTest: false });
      const line = new THREE.LineSegments(geo, mat);
      line.computeLineDistances();
      line.renderOrder = 9990;
      ctx.scene.add(line);
      trackLines.push(line);
    }
    ctx.render();
  }

  function clearTrackingLines() {
    const ctx = getViewerCtx();
    for (const l of trackLines) {
      ctx?.scene.remove(l);
      l.geometry.dispose();
      (l.material as THREE.Material).dispose();
    }
    trackLines = [];
    trackBaseNode = null;
    if (trackLabel) { trackLabel.remove(); trackLabel = null; }
  }

  /** Update distance label near cursor */
  function updateTrackLabel(screenX: number, screenY: number, basePos: THREE.Vector3, curPos: THREE.Vector3) {
    if (!trackLabel) {
      trackLabel = document.createElement("div");
      trackLabel.style.cssText = "position:fixed;pointer-events:none;z-index:10002;background:var(--cad-bg);color:var(--cad-heading);font-family:monospace;font-size:11px;padding:2px 6px;border-radius:3px;white-space:nowrap;border:1px solid var(--cad-border);";
      document.body.appendChild(trackLabel);
    }
    const dx = curPos.x - basePos.x;
    const dy = curPos.y - basePos.y;
    const dz = curPos.z - basePos.z;
    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

    // Show which axis is dominant
    const adx = Math.abs(dx), ady = Math.abs(dy), adz = Math.abs(dz);
    let axisLabel = "";
    if (adx > ady && adx > adz) axisLabel = `ΔX=${dx.toFixed(2)}`;
    else if (ady > adx && ady > adz) axisLabel = `ΔY=${dy.toFixed(2)}`;
    else if (adz > 0.01) axisLabel = `ΔZ=${dz.toFixed(2)}`;

    trackLabel.textContent = `${dist.toFixed(3)} m  ${axisLabel}`;
    trackLabel.style.left = (screenX + 20) + "px";
    trackLabel.style.top = (screenY - 10) + "px";
  }

  /** Snap cursor to tracking axis lines (ortho-like behavior) */
  function snapToTrackAxis(worldPos: THREE.Vector3, baseNodeIdx: number): THREE.Vector3 | null {
    const nodes = mesh.nodes.val;
    const base = nodes[baseNodeIdx];
    if (!base) return null;
    const b = new THREE.Vector3(base[0], base[1], base[2]);
    const p = worldPos.clone();
    const diff = p.clone().sub(b);

    // Find closest axis
    const trackThreshold = 0.3; // world units
    const adx = Math.abs(diff.x), ady = Math.abs(diff.y), adz = Math.abs(diff.z);

    // Check if close to X axis (Y≈0, Z≈0)
    if (ady < trackThreshold && adz < trackThreshold && adx > 0.01) {
      return new THREE.Vector3(p.x, b.y, b.z);
    }
    // Check if close to Y axis
    if (adx < trackThreshold && adz < trackThreshold && ady > 0.01) {
      return new THREE.Vector3(b.x, p.y, b.z);
    }
    // Check if close to Z axis
    if (adx < trackThreshold && ady < trackThreshold && adz > 0.01) {
      return new THREE.Vector3(b.x, b.y, p.z);
    }
    return null;
  }

  function cleanupDraw() {
    const ctx = getViewerCtx();
    if (drawPreviewLine && ctx) { ctx.scene.remove(drawPreviewLine); drawPreviewLine.geometry.dispose(); (drawPreviewLine.material as THREE.Material).dispose(); drawPreviewLine = null; }
    if (drawSnapHighlight && ctx) { ctx.scene.remove(drawSnapHighlight); drawSnapHighlight.geometry.dispose(); (drawSnapHighlight.material as THREE.Material).dispose(); drawSnapHighlight = null; }
    clearTrackingLines();
    drawStartNode = null; drawHoverNode = null; drawArcMidNode = null;
    drawMode = false;
    if (drawToolbar) { drawToolbar.remove(); drawToolbar = null; }
    const btn = panel.querySelector("#cad3d-draw") as HTMLElement;
    btn?.classList.remove("inspect-active");
    ctx?.render();
  }

  function showDrawToolbar() {
    if (drawToolbar) drawToolbar.remove();
    const div = document.createElement("div");
    div.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);background:var(--cad-bg);border:1px solid var(--cad-border);border-radius:6px;padding:6px 10px;z-index:10000;display:flex;gap:6px;align-items:center;font-family:monospace;font-size:11px;box-shadow:0 2px 10px var(--cad-shadow);";
    const btnStyle = (active: boolean) => `padding:4px 10px;border:1px solid ${active ? "#00ccff" : "#555"};background:${active ? "#003355" : "#333"};color:${active ? "#00ccff" : "#ccc"};border-radius:3px;cursor:pointer;font-size:11px;font-family:monospace;`;
    const snapStyle = (active: boolean) => `padding:3px 6px;border:1px solid ${active ? "#33ff33" : "#444"};background:${active ? "#113311" : "#222"};color:${active ? "#33ff33" : "#888"};border-radius:3px;cursor:pointer;font-size:10px;`;

    div.innerHTML = `
      <span style="color:#00ccff;font-weight:bold;margin-right:4px;">Draw:</span>
      <button id="dt-line" style="${btnStyle(drawTool === 'line')}">📏 Line</button>
      <button id="dt-arc" style="${btnStyle(drawTool === 'arc')}">⌒ Arc</button>
      <button id="dt-node" style="${btnStyle(drawTool === 'node')}">⊕ Node</button>
      <button id="dt-area" style="${btnStyle(drawTool === 'area')}">▢ Area</button>
      <span style="color:#666;margin:0 4px;">|</span>
      <span style="color:#888;font-size:10px;">Snap:</span>
      <button id="ds-node" style="${snapStyle(drawSnaps.node)}">Node</button>
      <button id="ds-grid" style="${snapStyle(drawSnaps.grid)}">Grid</button>
      <button id="ds-mid" style="${snapStyle(drawSnaps.midpoint)}">Mid</button>
      <button id="ds-track" style="${snapStyle(drawSnaps.track)}">Prolong</button>
      <span style="color:#666;margin:0 4px;">|</span>
      <span style="color:#888;font-size:10px;">Grid:</span>
      <input id="ds-gridsize" type="number" value="${GRID_SNAP}" step="0.1" min="0.1" max="10" style="width:45px;background:#333;color:#fff;border:1px solid #555;padding:2px;font-size:10px;">
      <span style="color:#888;font-size:10px;">m</span>
      <span style="color:#666;margin:0 4px;">|</span>
      <button id="dt-undo" style="padding:3px 6px;background:#444;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:10px;" title="Ctrl+Z">↩ Undo</button>
      <button id="dt-redo" style="padding:3px 6px;background:#444;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:10px;" title="Ctrl+Y">↪ Redo</button>
    `;
    document.body.appendChild(div);
    drawToolbar = div;

    const refreshBtns = () => {
      const lb = div.querySelector("#dt-line") as HTMLElement;
      const ab = div.querySelector("#dt-arc") as HTMLElement;
      const nb = div.querySelector("#dt-node") as HTMLElement;
      const arb = div.querySelector("#dt-area") as HTMLElement;
      if (lb) lb.style.cssText = btnStyle(drawTool === "line");
      if (ab) ab.style.cssText = btnStyle(drawTool === "arc");
      if (nb) nb.style.cssText = btnStyle(drawTool === "node");
      if (arb) arb.style.cssText = btnStyle(drawTool === "area");
      const sn = div.querySelector("#ds-node") as HTMLElement;
      const sg = div.querySelector("#ds-grid") as HTMLElement;
      const sm = div.querySelector("#ds-mid") as HTMLElement;
      const st = div.querySelector("#ds-track") as HTMLElement;
      if (sn) sn.style.cssText = snapStyle(drawSnaps.node);
      if (sg) sg.style.cssText = snapStyle(drawSnaps.grid);
      if (sm) sm.style.cssText = snapStyle(drawSnaps.midpoint);
      if (st) st.style.cssText = snapStyle(drawSnaps.track);
    };

    div.querySelector("#dt-line")!.addEventListener("click", () => { drawTool = "line"; drawStartNode = null; drawArcMidNode = null; areaPolyNodes = []; refreshBtns(); });
    div.querySelector("#dt-arc")!.addEventListener("click", () => { drawTool = "arc"; drawStartNode = null; drawArcMidNode = null; areaPolyNodes = []; refreshBtns(); });
    div.querySelector("#dt-node")!.addEventListener("click", () => { drawTool = "node"; drawStartNode = null; drawArcMidNode = null; areaPolyNodes = []; refreshBtns(); });
    div.querySelector("#dt-area")!.addEventListener("click", () => {
      drawTool = "area"; drawStartNode = null; drawArcMidNode = null; areaPolyNodes = [];
      console.log("Area mode: click vertices del poligono. Doble-click o click cerca del 1er punto para cerrar.");
      refreshBtns();
    });
    div.querySelector("#ds-node")!.addEventListener("click", () => { drawSnaps.node = !drawSnaps.node; refreshBtns(); });
    div.querySelector("#ds-grid")!.addEventListener("click", () => { drawSnaps.grid = !drawSnaps.grid; refreshBtns(); });
    div.querySelector("#ds-mid")!.addEventListener("click", () => { drawSnaps.midpoint = !drawSnaps.midpoint; refreshBtns(); });
    div.querySelector("#ds-track")!.addEventListener("click", () => { drawSnaps.track = !drawSnaps.track; if (!drawSnaps.track) clearTrackingLines(); refreshBtns(); });
    div.querySelector("#ds-gridsize")!.addEventListener("change", (e: any) => { (drawSnaps as any).gridSize = parseFloat(e.target.value) || 0.5; });
    div.querySelector("#dt-undo")!.addEventListener("click", () => doUndo());
    div.querySelector("#dt-redo")!.addEventListener("click", () => doRedo());
  }

  type SnapResult = { nodeIdx: number | null; worldPos: THREE.Vector3 | null; snapType: "node" | "mid" | "grid" | "free" };

  function findSnap(screenX: number, screenY: number, camera: THREE.Camera, rendererElm: HTMLElement): SnapResult {
    const rect = rendererElm.getBoundingClientRect();
    const mx = ((screenX - rect.left) / rect.width) * 2 - 1;
    const my = -((screenY - rect.top) / rect.height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mx, my), camera);

    const nodes = mesh.nodes.val;
    const elements = mesh.elements.val;
    const snapThreshold = 0.12;

    // 1. Snap to node (highest priority)
    if (drawSnaps.node) {
      let bestIdx = -1, bestDist = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const projected = new THREE.Vector3(n[0], n[1], n[2]).project(camera);
        const dist = Math.sqrt((projected.x - mx) ** 2 + (projected.y - my) ** 2);
        if (dist < snapThreshold && dist < bestDist) { bestDist = dist; bestIdx = i; }
      }
      if (bestIdx >= 0) return { nodeIdx: bestIdx, worldPos: new THREE.Vector3(...nodes[bestIdx]), snapType: "node" };
    }

    // 2. Snap to midpoint of elements
    if (drawSnaps.midpoint) {
      let bestDist = Infinity;
      let bestMid: THREE.Vector3 | null = null;
      for (const elem of elements) {
        if (elem.length !== 2) continue;
        const n1 = nodes[elem[0]], n2 = nodes[elem[1]];
        const mid = new THREE.Vector3((n1[0]+n2[0])/2, (n1[1]+n2[1])/2, (n1[2]+n2[2])/2);
        const projected = mid.clone().project(camera);
        const dist = Math.sqrt((projected.x - mx) ** 2 + (projected.y - my) ** 2);
        if (dist < snapThreshold * 0.8 && dist < bestDist) { bestDist = dist; bestMid = mid; }
      }
      if (bestMid) return { nodeIdx: null, worldPos: bestMid, snapType: "mid" };
    }

    // 3. Snap to grid (project ray to XY plane at z=0, then snap)
    if (drawSnaps.grid) {
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // XY plane
      const worldPt = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(plane, worldPt)) {
        const gs = (drawSnaps as any).gridSize || GRID_SNAP;
        worldPt.x = Math.round(worldPt.x / gs) * gs;
        worldPt.y = Math.round(worldPt.y / gs) * gs;
        worldPt.z = Math.round(worldPt.z / gs) * gs;
        return { nodeIdx: null, worldPos: worldPt, snapType: "grid" };
      }
    }

    // 4. Free position (project to XY plane)
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const worldPt = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, worldPt);
    return { nodeIdx: null, worldPos: worldPt, snapType: "free" };
  }

  function updateDrawPreview(snap: SnapResult) {
    const ctx = getViewerCtx();
    if (!ctx) return;
    const nodes = mesh.nodes.val;

    // Snap highlight
    if (drawSnapHighlight) { ctx.scene.remove(drawSnapHighlight); drawSnapHighlight.geometry.dispose(); (drawSnapHighlight.material as THREE.Material).dispose(); drawSnapHighlight = null; }
    if (snap.worldPos) {
      const color = snap.snapType === "node" ? 0xffff00 : snap.snapType === "mid" ? 0xff00ff : snap.snapType === "grid" ? 0x00ffff : 0x888888;
      const size = snap.snapType === "node" ? 0.08 : 0.06;
      const geo = snap.snapType === "mid"
        ? new THREE.BoxGeometry(size * 2, size * 2, size * 2)
        : new THREE.SphereGeometry(size, 12, 12);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, depthTest: false });
      drawSnapHighlight = new THREE.Mesh(geo, mat);
      drawSnapHighlight.position.copy(snap.worldPos);
      drawSnapHighlight.renderOrder = 9999;
      ctx.scene.add(drawSnapHighlight);
    }

    // Preview line
    if (drawPreviewLine) { ctx.scene.remove(drawPreviewLine); drawPreviewLine.geometry.dispose(); (drawPreviewLine.material as THREE.Material).dispose(); drawPreviewLine = null; }
    if (drawStartNode !== null && snap.worldPos) {
      const startN = nodes[drawStartNode];
      const geo = new THREE.BufferGeometry();

      if (drawTool === "arc" && drawArcMidNode !== null) {
        // Preview arc through 3 points (start, mid, end)
        const midN = nodes[drawArcMidNode];
        const arcPts = generateArcPoints(
          new THREE.Vector3(startN[0], startN[1], startN[2]),
          new THREE.Vector3(midN[0], midN[1], midN[2]),
          snap.worldPos, 16
        );
        const verts: number[] = [];
        for (let i = 0; i < arcPts.length - 1; i++) {
          verts.push(arcPts[i].x, arcPts[i].y, arcPts[i].z, arcPts[i+1].x, arcPts[i+1].y, arcPts[i+1].z);
        }
        geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
      } else {
        geo.setAttribute("position", new THREE.Float32BufferAttribute([
          startN[0], startN[1], startN[2], snap.worldPos.x, snap.worldPos.y, snap.worldPos.z
        ], 3));
      }
      const mat = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2, depthTest: false });
      drawPreviewLine = new THREE.Line(geo, mat);
      if (drawTool === "arc" && drawArcMidNode !== null) {
        drawPreviewLine = new THREE.LineSegments(geo, mat);
      }
      drawPreviewLine.renderOrder = 9999;
      ctx.scene.add(drawPreviewLine);
    }
    ctx.render();
  }

  /** Generate arc points through 3 points (3-point arc) */
  function generateArcPoints(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, nSeg: number): THREE.Vector3[] {
    // Fit circle through 3 points, then subdivide
    // Use parametric approach: interpolate with quadratic Bezier as approximation
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= nSeg; i++) {
      const t = i / nSeg;
      // Quadratic Bezier: B(t) = (1-t)²P1 + 2(1-t)tP2 + t²P3
      // But for a true arc, use P2 as control point (not on-curve point)
      // Convert: midpoint at t=0.5 should be P2, so control = 2*P2 - 0.5*P1 - 0.5*P3
      const ctrl = p2.clone().multiplyScalar(2).sub(p1.clone().multiplyScalar(0.5)).sub(p3.clone().multiplyScalar(0.5));
      const a = (1 - t) * (1 - t);
      const b = 2 * (1 - t) * t;
      const c = t * t;
      points.push(new THREE.Vector3(
        a * p1.x + b * ctrl.x + c * p3.x,
        a * p1.y + b * ctrl.y + c * p3.y,
        a * p1.z + b * ctrl.z + c * p3.z,
      ));
    }
    return points;
  }

  /** Get or create a node at world position. Returns node index. */
  function getOrCreateNode(snap: SnapResult): number {
    if (snap.nodeIdx !== null) return snap.nodeIdx;
    if (!snap.worldPos) return -1;
    // Check if a node already exists at this position (within tolerance)
    const nodes = mesh.nodes.val;
    const tol = 0.001;
    for (let i = 0; i < nodes.length; i++) {
      if (Math.abs(nodes[i][0] - snap.worldPos.x) < tol &&
          Math.abs(nodes[i][1] - snap.worldPos.y) < tol &&
          Math.abs(nodes[i][2] - snap.worldPos.z) < tol) return i;
    }
    // Create new node
    pushUndo();
    const newNodes = [...nodes, [snap.worldPos.x, snap.worldPos.y, snap.worldPos.z] as Node];
    mesh.nodes.val = newNodes;
    return newNodes.length - 1;
  }

  function drawClickHandler(snap: SnapResult) {
    if (drawTool === "node") {
      // Just create a node at snap position
      if (!snap.worldPos) return;
      pushUndo();
      const nodes = [...mesh.nodes.val];
      nodes.push([snap.worldPos.x, snap.worldPos.y, snap.worldPos.z]);
      mesh.nodes.val = nodes;
      return;
    }

    if (drawTool === "line") {
      const nodeIdx = getOrCreateNode(snap);
      if (nodeIdx < 0) return;
      if (drawStartNode === null) {
        drawStartNode = nodeIdx;
        return;
      }
      if (nodeIdx === drawStartNode) return;

      pushUndo();
      const elements = [...mesh.elements.val];
      const exists = elements.some(e => e.length === 2 &&
        ((e[0] === drawStartNode && e[1] === nodeIdx) || (e[1] === drawStartNode && e[0] === nodeIdx)));
      if (!exists) {
        elements.push([drawStartNode!, nodeIdx]);
        mesh.elements.val = elements;
        setDefaultElementInputs();
        mesh.elementInputs!.val = { ...mesh.elementInputs!.val };
      }
      drawStartNode = nodeIdx; // chain
      return;
    }

    if (drawTool === "arc") {
      const nodeIdx = getOrCreateNode(snap);
      if (nodeIdx < 0) return;
      if (drawStartNode === null) {
        drawStartNode = nodeIdx; // 1st point
        return;
      }
      if (drawArcMidNode === null) {
        if (nodeIdx === drawStartNode) return;
        drawArcMidNode = nodeIdx; // 2nd point (arc passes through)
        return;
      }
      // 3rd point: generate arc segments
      if (nodeIdx === drawStartNode || nodeIdx === drawArcMidNode) return;
      const nodes = mesh.nodes.val;
      const p1 = new THREE.Vector3(...nodes[drawStartNode]);
      const p2 = new THREE.Vector3(...nodes[drawArcMidNode]);
      const p3 = new THREE.Vector3(...nodes[nodeIdx]);

      // Get subdivision from parameters or default 8
      const nDiv = Math.max(4, Math.round(generatorParams["nSubViga"]?.val ?? 8));
      const arcPts = generateArcPoints(p1, p2, p3, nDiv);

      pushUndo();
      const newNodes = [...mesh.nodes.val];
      const elements = [...mesh.elements.val];
      let prevIdx = drawStartNode;

      for (let i = 1; i < arcPts.length; i++) {
        let nextIdx: number;
        if (i === arcPts.length - 1) {
          nextIdx = nodeIdx; // last point = end node
        } else {
          // Create intermediate node
          const pt = arcPts[i];
          nextIdx = newNodes.length;
          newNodes.push([pt.x, pt.y, pt.z]);
        }
        elements.push([prevIdx, nextIdx]);
        prevIdx = nextIdx;
      }

      mesh.nodes.val = newNodes;
      mesh.elements.val = elements;
      setDefaultElementInputs();
      mesh.elementInputs!.val = { ...mesh.elementInputs!.val };

      // Chain: start new arc from end
      drawStartNode = nodeIdx;
      drawArcMidNode = null;
      return;
    }

    // ── AREA tool: collect polygon vertices, close on double-click or 1st node ──
    if (drawTool === "area") {
      const nodeIdx = getOrCreateNode(snap);
      if (nodeIdx < 0) return;

      // If clicking near the first node → close polygon
      if (areaPolyNodes.length >= 3 && nodeIdx === areaPolyNodes[0]) {
        // Close and create Q4 mesh
        pushUndo();
        const newNodes = [...mesh.nodes.val];
        const elements = [...mesh.elements.val];
        const polyPts: [number, number, number][] = areaPolyNodes.map(ni => newNodes[ni] as [number, number, number]);

        // Use getMesh to triangulate, then create shell elements
        try {
          const meshResult = getMesh({
            points: polyPts,
            polygon: Array.from({ length: polyPts.length }, (_, i) => i),
            maxMeshSize: GRID_SNAP || 0.5,
          });

          // Remap mesh nodes: reuse existing nodes if close, otherwise add new
          const nodeRemap: number[] = [];
          for (const mNode of meshResult.nodes) {
            // Check if close to an existing node
            let found = -1;
            for (let ni = 0; ni < newNodes.length; ni++) {
              const dx = Math.abs(newNodes[ni][0] - mNode[0]);
              const dy = Math.abs(newNodes[ni][1] - mNode[1]);
              const dz = Math.abs(newNodes[ni][2] - mNode[2]);
              if (dx < 0.01 && dy < 0.01 && dz < 0.01) { found = ni; break; }
            }
            if (found >= 0) {
              nodeRemap.push(found);
            } else {
              nodeRemap.push(newNodes.length);
              newNodes.push([mNode[0], mNode[1], mNode[2]]);
            }
          }

          // Add triangle elements (remapped)
          for (const tri of meshResult.elements) {
            elements.push([nodeRemap[tri[0]], nodeRemap[tri[1]], nodeRemap[tri[2]]]);
          }

          mesh.nodes.val = newNodes;
          mesh.elements.val = elements;
          setDefaultElementInputs();

          console.log(`Area: ${meshResult.elements.length} triangulos creados desde ${areaPolyNodes.length} vertices`);
        } catch (err: any) {
          console.error("Area mesh failed:", err.message);
        }

        areaPolyNodes = [];
        return;
      }

      // Add vertex to polygon
      areaPolyNodes.push(nodeIdx);
      console.log(`Area vertex ${areaPolyNodes.length}: node ${nodeIdx}`);

      // Draw edge from previous vertex
      if (areaPolyNodes.length >= 2) {
        const prevIdx = areaPolyNodes[areaPolyNodes.length - 2];
        // Visual feedback: add a temporary line
        const nodes = mesh.nodes.val;
        const ctx = getViewerCtx();
        if (ctx) {
          const geom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(...nodes[prevIdx]),
            new THREE.Vector3(...nodes[nodeIdx]),
          ]);
          const line = new THREE.LineSegments(geom, new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 }));
          line.name = "area-preview";
          ctx.scene.add(line);
          ctx.render();
        }
      }
      return;
    }
  }

  function highlightElement(elemIdx: number) {
    const ctx = getViewerCtx();
    if (!ctx) return;
    if (highlightObj) { ctx.scene.remove(highlightObj); highlightObj.geometry.dispose(); (highlightObj.material as THREE.Material).dispose(); }

    const nodes = mesh.nodes.val;
    const elem = mesh.elements.val[elemIdx];
    if (!elem) return;

    const points: number[] = [];
    for (let i = 0; i < elem.length; i++) {
      const a = nodes[elem[i]], b = nodes[elem[(i + 1) % elem.length]];
      points.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    highlightObj = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 3, depthTest: false }));
    highlightObj.renderOrder = 9999;
    ctx.scene.add(highlightObj);
    ctx.render();
  }

  /** Find nearest element to a mouse event using distance-based picking */
  function pickElement(ev: MouseEvent): number {
    const ctx = getViewerCtx();
    if (!ctx) return -1;
    const rect = ctx.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((ev.clientX - rect.left) / rect.width) * 2 - 1,
      -((ev.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, ctx.controls.object as THREE.Camera);
    raycaster.params.Line = { threshold: 0.5 };

    const nodes = mesh.nodes.val;
    const elements = mesh.elements.val;
    if (nodes.length === 0 || elements.length === 0) return -1;

    // Build temporary line geometry for each element and test
    let bestDist = Infinity, bestIdx = -1;
    const ray = raycaster.ray;

    for (let i = 0; i < elements.length; i++) {
      const elem = elements[i];
      if (elem.length === 2) {
        // Frame: closest point on line segment to ray
        const a = new THREE.Vector3(...nodes[elem[0]]);
        const b = new THREE.Vector3(...nodes[elem[1]]);
        const line = new THREE.Line3(a, b);
        const closestOnRay = new THREE.Vector3();
        const closestOnLine = new THREE.Vector3();
        ray.closestPointToPoint(line.getCenter(new THREE.Vector3()), closestOnRay);
        line.closestPointToPoint(closestOnRay, true, closestOnLine);
        const d = closestOnRay.distanceTo(closestOnLine);
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      } else if (elem.length === 3) {
        // Triangle: ray-triangle intersection
        const a = new THREE.Vector3(...nodes[elem[0]]);
        const b = new THREE.Vector3(...nodes[elem[1]]);
        const c = new THREE.Vector3(...nodes[elem[2]]);
        const target = new THREE.Vector3();
        const hit = ray.intersectTriangle(a, b, c, false, target);
        if (hit) {
          const d = ray.origin.distanceTo(target);
          if (d < bestDist) { bestDist = d; bestIdx = i; }
        } else {
          // Fallback: centroid distance
          const centroid = a.add(b).add(c).divideScalar(3);
          const cp = new THREE.Vector3();
          ray.closestPointToPoint(centroid, cp);
          const d = cp.distanceTo(centroid);
          if (d < bestDist) { bestDist = d; bestIdx = i; }
        }
      } else if (elem.length === 4) {
        // Q4 quad: split into 2 triangles and test intersection
        const a = new THREE.Vector3(...nodes[elem[0]]);
        const b = new THREE.Vector3(...nodes[elem[1]]);
        const c = new THREE.Vector3(...nodes[elem[2]]);
        const d_node = new THREE.Vector3(...nodes[elem[3]]);
        const target = new THREE.Vector3();
        // Triangle 1: a-b-c
        let hit = ray.intersectTriangle(a, b, c, false, target);
        if (hit) {
          const d = ray.origin.distanceTo(target);
          if (d < bestDist) { bestDist = d; bestIdx = i; }
        }
        // Triangle 2: a-c-d
        hit = ray.intersectTriangle(a, c, d_node, false, target);
        if (hit) {
          const d = ray.origin.distanceTo(target);
          if (d < bestDist) { bestDist = d; bestIdx = i; }
        }
      }
    }

    // Threshold based on model extent
    const { extent } = getModelBounds();
    return bestDist < extent * 0.1 ? bestIdx : -1;
  }

  /** Format number for display */
  function fmt(v: number, dec = 4): string {
    if (Math.abs(v) < 1e-10) return "0";
    if (Math.abs(v) >= 1e6) return v.toExponential(2);
    if (Math.abs(v) >= 100) return v.toFixed(1);
    return v.toFixed(dec);
  }

  /** Build matrix HTML table (compact, only non-zero highlighted) */
  function matrixHTML(m: number[][], labels?: string[], maxSize = 12): string {
    const rows = Math.min(m.length, maxSize);
    const cols = Math.min(m[0]?.length || 0, maxSize);
    let html = `<table>`;
    if (labels) {
      html += `<tr><td class="header"></td>`;
      for (let j = 0; j < cols; j++) html += `<td class="header">${labels[j] || j}</td>`;
      html += `</tr>`;
    }
    for (let i = 0; i < rows; i++) {
      html += `<tr>`;
      if (labels) html += `<td class="header">${labels[i] || i}</td>`;
      for (let j = 0; j < cols; j++) {
        const v = m[i][j];
        const cls = Math.abs(v) > 1e-10 ? "nonzero" : "";
        html += `<td class="${cls}">${fmt(v, 2)}</td>`;
      }
      html += `</tr>`;
    }
    html += `</table>`;
    return html;
  }

  // ── Math formula helpers ──
  function frac(num: string, den: string): string {
    return `<span class="frac"><span class="frac-num">${num}</span><span class="frac-den">${den}</span></span>`;
  }
  function v(name: string, sub?: string, sup?: string): string {
    let s = `<span class="var">${name}</span>`;
    if (sub) s += `<sub>${sub}</sub>`;
    if (sup) s += `<sup>${sup}</sup>`;
    return s;
  }

  /** Generate symbolic formula HTML for the frame local stiffness matrix */
  function frameStiffnessFormula(E: number, A: number, Iz: number, Iy: number, G: number, J: number, L: number): string {
    // Timoshenko shear deformation parameters
    const AsY = (5/6) * A, AsZ = (5/6) * A; // rectangular default
    const phiZ = (AsZ > 0 && G > 0) ? (12 * E * Iz) / (G * AsZ * L ** 2) : 0;
    const phiY = (AsY > 0 && G > 0) ? (12 * E * Iy) / (G * AsY * L ** 2) : 0;

    const EA_L = E * A / L;
    const GJ_L = G * J / L;
    const tz = (12 * E * Iz / L ** 3) / (1 + phiZ);
    const bz = (6 * E * Iz / L ** 2) / (1 + phiZ);
    const kz = (4 * E * Iz / L) * (1 + phiZ / 4) / (1 + phiZ);
    const az = (2 * E * Iz / L) * (1 - phiZ / 2) / (1 + phiZ);
    const ty = (12 * E * Iy / L ** 3) / (1 + phiY);
    const by = (6 * E * Iy / L ** 2) / (1 + phiY);
    const ky = (4 * E * Iy / L) * (1 + phiY / 4) / (1 + phiY);
    const ay = (2 * E * Iy / L) * (1 - phiY / 2) / (1 + phiY);

    const hasTimoshenko = phiZ > 1e-10 || phiY > 1e-10;

    return `<div class="fem-eq eq-box">
      <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">Formulación: ${hasTimoshenko ? "Timoshenko (con deformación por cortante)" : "Euler-Bernoulli"}</strong></div>
      ${hasTimoshenko ? `
      <div style="text-align:left;margin-bottom:6px;color:var(--fem-eq-sub)">
        ${v("A","s")} = ${frac("5","6")} · ${v("A")} = <span class="highlight">${fmt(AsY)}</span>
        &nbsp;&nbsp; φ<sub>z</sub> = ${frac("12·"+v("E")+"·"+v("I","z"), v("G")+"·"+v("A","s")+"·"+v("L")+"²")} = <span class="highlight">${fmt(phiZ)}</span>
        &nbsp;&nbsp; φ<sub>y</sub> = <span class="highlight">${fmt(phiY)}</span>
      </div>
      <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">Coeficientes Timoshenko (Dr. Aguiar):</strong></div>
      <div>${v("t","z")} = ${frac("12·"+v("E")+"·"+v("I","z"), v("L")+"³·(1+φ<sub>z</sub>)")} = <span class="highlight">${fmt(tz)}</span> &nbsp;(cortante)</div>
      <div>${v("b","z")} = ${frac("6·"+v("E")+"·"+v("I","z"), v("L")+"²·(1+φ<sub>z</sub>)")} = <span class="highlight">${fmt(bz)}</span> &nbsp;(acoplamiento)</div>
      <div>${v("k","z")} = ${frac("4·"+v("E")+"·"+v("I","z")+"·(1+φ/4)", v("L")+"·(1+φ<sub>z</sub>)")} = <span class="highlight">${fmt(kz)}</span> &nbsp;(flexión diagonal)</div>
      <div>${v("a","z")} = ${frac("2·"+v("E")+"·"+v("I","z")+"·(1−φ/2)", v("L")+"·(1+φ<sub>z</sub>)")} = <span class="highlight">${fmt(az)}</span> &nbsp;(flexión off-diag)</div>
      ` : `
      <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">Coeficientes de rigidez:</strong></div>
      `}
      <div>${frac(v("E")+"·"+v("A"),v("L"))} = <span class="highlight">${fmt(EA_L)}</span> &nbsp;(axial)</div>
      <div>${frac(v("G")+"·"+v("J"),v("L"))} = <span class="highlight">${fmt(GJ_L)}</span> &nbsp;(torsión)</div>
      ${!hasTimoshenko ? `
      <div>${frac("12·"+v("E")+"·"+v("I","z"),v("L")+"³")} = <span class="highlight">${fmt(tz)}</span></div>
      <div>${frac("4·"+v("E")+"·"+v("I","z"),v("L"))} = <span class="highlight">${fmt(kz)}</span></div>
      ` : ""}
    </div>
    <div class="fem-eq">
      ${v("k","local")} = <span class="mat-sym" style="grid-template-columns:repeat(4,auto)">
        <span class="cell">${frac(v("EA"),v("L"))}</span><span class="cell">0</span><span class="cell dots">⋯</span><span class="cell">${frac("−"+v("EA"),v("L"))}</span>
        <span class="cell">0</span><span class="cell">${v("t","z")}</span><span class="cell dots">⋯</span><span class="cell">${v("b","z")}</span>
        <span class="cell dots">⋮</span><span class="cell dots">⋮</span><span class="cell dots">⋱</span><span class="cell dots">⋮</span>
        <span class="cell">0</span><span class="cell">${v("b","z")}</span><span class="cell dots">⋯</span><span class="cell">${v("k","z")}</span>
      </span>
      <sub style="color:var(--fem-label)">12×12 ${hasTimoshenko ? "(Timoshenko)" : "(Euler-Bernoulli)"}</sub>
    </div>
    ${hasTimoshenko ? `<div class="fem-eq eq-box" style="margin-top:6px">
      <div style="text-align:left"><strong style="color:var(--fem-section-title)">Matrices de rigidez (Dr. Aguiar, Fig 7.9):</strong></div>
      <div style="margin-top:4px">${v("K","f")} = ${v("B","f")}${`<sup>T</sup>`} · ${v("E")}·${v("I")} · ${v("B","f")} · ${v("J")} &nbsp;<sub style="color:var(--fem-label)">(flexión, 1 pt Gauss)</sub></div>
      <div>${v("K","c")} = ${v("B","c")}${`<sup>T</sup>`} · ${v("G")}·${v("A'")} · ${v("B","c")} · ${v("J")} &nbsp;<sub style="color:var(--fem-label)">(cortante, 2 pts Gauss)</sub></div>
      <div>${v("K","total")} = ${v("K","f")} + ${v("K","c")}</div>
    </div>` : ""}`;
  }

  /** Generate symbolic formula for transformation */
  function transformFormula(elmNodes: Node[]): string {
    const isFrame = elmNodes.length === 2;
    if (isFrame) {
      const vec = subtract(elmNodes[1], elmNodes[0]) as number[];
      const L = norm(vec) as number;
      const l = vec[0] / L, m = vec[1] / L, n = vec[2] / L;
      return `<div class="fem-eq eq-box">
        <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">Cosenos directores:</strong></div>
        <div>${v("l")} = cos(α) = ${frac("Δx",v("L"))} = ${frac(fmt(vec[0]),fmt(L))} = <span class="highlight">${fmt(l)}</span></div>
        <div>${v("m")} = cos(β) = ${frac("Δy",v("L"))} = ${frac(fmt(vec[1]),fmt(L))} = <span class="highlight">${fmt(m)}</span></div>
        <div>${v("n")} = cos(γ) = ${frac("Δz",v("L"))} = ${frac(fmt(vec[2]),fmt(L))} = <span class="highlight">${fmt(n)}</span></div>
      </div>
      <div class="fem-eq">
        λ = <span class="mat-sym" style="grid-template-columns:repeat(3,auto)">
          <span class="cell">${v("l")}</span><span class="cell">${v("m")}</span><span class="cell">${v("n")}</span>
          <span class="cell">${frac("−"+v("m"),v("D"))}</span><span class="cell">${frac(v("l"),v("D"))}</span><span class="cell">0</span>
          <span class="cell">${frac("−"+v("l")+"·"+v("n"),v("D"))}</span><span class="cell">${frac("−"+v("m")+"·"+v("n"),v("D"))}</span><span class="cell">${v("D")}</span>
        </span>
        &nbsp; donde ${v("D")} = √(${v("l")}² + ${v("m")}²)
      </div>
      <div class="fem-eq">
        ${v("T")} = ${v("I","4")} ⊗ λ &nbsp; <sub style="color:var(--fem-label)">(Kronecker, 12×12)</sub>
      </div>`;
    }
    return `<div class="fem-eq">${v("T")} — sistema local del triángulo (normal × lados) <sub>18×18</sub></div>`;
  }

  /** Global stiffness formula */
  function globalStiffnessFormula(): string {
    return `<div class="fem-eq">
      ${v("K","global")} = ${v("T")}${`<sup>T</sup>`} · ${v("k","local")} · ${v("T")}
    </div>`;
  }

  /** Assembly formula */
  function assemblyFormula(elem: number[]): string {
    const offsets = elem.map(ni => `6·${ni} = ${6*ni}`).join(", ");
    return `<div class="fem-eq eq-box">
      <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">Ensamblaje en K global:</strong></div>
      <div>${v("K","global")}[${v("i")}, ${v("j")}] += ${v("K","elem")}[${v("i")}, ${v("j")}]</div>
      <div style="margin-top:4px">donde ${v("i")}, ${v("j")} ∈ {${offsets}} + (0..5)</div>
    </div>`;
  }

  /** Force recovery formula */
  function forceRecoveryFormula(isFrame: boolean): string {
    if (isFrame) {
      return `<div class="fem-eq eq-box">
        <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">Recuperación de fuerzas:</strong></div>
        <div>${v("u","local")} = ${v("T")} · ${v("u","global")}</div>
        <div>${v("f","local")} = ${v("k","local")} · ${v("u","local")}</div>
        <div style="margin-top:4px;color:var(--fem-eq-sub)">
          ${v("f")} = [${v("N","i")}, ${v("V","y,i")}, ${v("V","z,i")}, ${v("M","x,i")}, ${v("M","y,i")}, ${v("M","z,i")}, ${v("N","j")}, …]
        </div>
      </div>`;
    }
    return `<div class="fem-eq eq-box">
      <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">Esfuerzos en placa:</strong></div>
      <div>σ = ${frac("1","2"+v("A"))} · ${v("D")} · ${v("B")} · ${v("u")}</div>
      <div>${v("N","xx")} = σ<sub>xx</sub> · ${v("t")} &nbsp;&nbsp; ${v("M","xx")} = σ<sub>xx</sub> · ${frac(v("t")+"³","12")}</div>
    </div>`;
  }

  /** Build full numeric matrix HTML (all rows/cols, with diagonal highlight) */
  function fullMatrixHTML(m: number[][], labels: string[]): string {
    const n = m.length;
    let html = `<table><tr><td class="hdr"></td>`;
    for (let j = 0; j < n; j++) html += `<td class="hdr">${labels[j] || j}</td>`;
    html += `</tr>`;
    for (let i = 0; i < n; i++) {
      html += `<tr><td class="hdr">${labels[i] || i}</td>`;
      for (let j = 0; j < n; j++) {
        const val = m[i][j];
        const cls = (i === j ? "diag " : "") + (Math.abs(val) > 1e-10 ? "nz" : "");
        html += `<td class="${cls}">${fmt(val, 2)}</td>`;
      }
      html += `</tr>`;
    }
    html += `</table>`;
    return html;
  }

  /** Build symbolic stiffness matrix 12x12 for frame — Eq 6.1 style (upper triangular "symmetric") */
  function frameSymbolicMatrix12(): string {
    const _ = "0";
    const ea = frac(v("EA"), v("L"));
    const nea = frac("−"+v("EA"), v("L"));
    const vz3 = frac("12"+v("EI","z"), v("L")+"³");
    const nvz3 = frac("−12"+v("EI","z"), v("L")+"³");
    const vy3 = frac("12"+v("EI","y"), v("L")+"³");
    const nvy3 = frac("−12"+v("EI","y"), v("L")+"³");
    const vz2 = frac("6"+v("EI","z"), v("L")+"²");
    const nvz2 = frac("−6"+v("EI","z"), v("L")+"²");
    const vy2 = frac("6"+v("EI","y"), v("L")+"²");
    const nvy2 = frac("−6"+v("EI","y"), v("L")+"²");
    const gj = frac(v("GJ"), v("L"));
    const ngj = frac("−"+v("GJ"), v("L"));
    const iz4 = frac("4"+v("EI","z"), v("L"));
    const iz2 = frac("2"+v("EI","z"), v("L"));
    const iy4 = frac("4"+v("EI","y"), v("L"));
    const iy2 = frac("2"+v("EI","y"), v("L"));
    const SYM = `<span style="color:var(--fem-eq-dots);font-style:italic">sym</span>`;

    // Upper-triangular + "symmetric" label like Eq 6.1 from the textbook
    // P1..P12 = forces, δ1..δ12 = displacements
    const pLabels = ["P₁","P₂","P₃","P₄","P₅","P₆","P₇","P₈","P₉","P₁₀","P₁₁","P₁₂"];
    const dLabels = ["δ₁","δ₂","δ₃","δ₄","δ₅","δ₆","δ₇","δ₈","δ₉","δ₁₀","δ₁₁","δ₁₂"];

    // Full symmetric 12x12
    const full: string[][] = [
      [ea,  _,    _,    _,   _,     _,    nea, _,    _,    _,   _,     _],
      [_,   vz3,  _,    _,   _,     vz2,  _,   nvz3, _,    _,   _,     vz2],
      [_,   _,    vy3,  _,   nvy2,  _,    _,   _,    nvy3, _,   nvy2,  _],
      [_,   _,    _,    gj,  _,     _,    _,   _,    _,    ngj, _,     _],
      [_,   _,    nvy2, _,   iy4,   _,    _,   _,    vy2,  _,   iy2,   _],
      [_,   vz2,  _,    _,   _,     iz4,  _,   nvz2, _,    _,   _,     iz2],
      [nea, _,    _,    _,   _,     _,    ea,  _,    _,    _,   _,     _],
      [_,   nvz3, _,    _,   _,     nvz2, _,   vz3,  _,    _,   _,     nvz2],
      [_,   _,    nvy3, _,   vy2,   _,    _,   _,    vy3,  _,   vy2,   _],
      [_,   _,    _,    ngj, _,     _,    _,   _,    _,    gj,  _,     _],
      [_,   _,    nvy2, _,   iy2,   _,    _,   _,    vy2,  _,   iy4,   _],
      [_,   vz2,  _,    _,   _,     iz2,  _,   nvz2, _,    _,   _,     iz4],
    ];

    let html = `<div style="margin-bottom:8px;color:var(--fem-eq-sub);font-size:11px;font-family:monospace">Eq. 6.1 — Matriz de rigidez de elemento de pórtico espacial</div>`;
    html += `<table><tr><td class="hdr"></td>`;
    for (const lb of dLabels) html += `<td class="hdr">${lb}</td>`;
    html += `</tr>`;
    for (let i = 0; i < 12; i++) {
      html += `<tr><td class="hdr">${pLabels[i]}</td>`;
      for (let j = 0; j < 12; j++) {
        if (j < i) {
          // Lower triangle: show "sym" only in first lower-triangle cell of each row
          html += `<td style="color:var(--fem-border-cell)">${j === 0 && i > 0 ? SYM : ""}</td>`;
        } else {
          const c = full[i][j];
          const cls = (i === j ? "diag " : "") + (c !== "0" ? "nz" : "");
          html += `<td class="${cls}">${c}</td>`;
        }
      }
      html += `</tr>`;
    }
    html += `</table>`;
    return html;
  }

  /** Generate coefficient calculation HTML for frame stiffness matrix */
  function frameCoeffCalcHTML(E: number, A: number, Iz: number, Iy: number, G: number, J: number, L: number): string {
    const coeffs = [
      { name: `${frac(v("E")+"·"+v("A"), v("L"))}`, calc: `${frac(fmt(E)+"×"+fmt(A), fmt(L))}`, val: E*A/L, label: "Axial" },
      { name: `${frac("12·"+v("E")+"·"+v("I","z"), v("L")+"³")}`, calc: `${frac("12×"+fmt(E)+"×"+fmt(Iz), fmt(L)+"³")}`, val: 12*E*Iz/(L**3), label: "Corte Y" },
      { name: `${frac("6·"+v("E")+"·"+v("I","z"), v("L")+"²")}`, calc: `${frac("6×"+fmt(E)+"×"+fmt(Iz), fmt(L)+"²")}`, val: 6*E*Iz/(L**2), label: "Corte-Momento Z" },
      { name: `${frac("12·"+v("E")+"·"+v("I","y"), v("L")+"³")}`, calc: `${frac("12×"+fmt(E)+"×"+fmt(Iy), fmt(L)+"³")}`, val: 12*E*Iy/(L**3), label: "Corte Z" },
      { name: `${frac("6·"+v("E")+"·"+v("I","y"), v("L")+"²")}`, calc: `${frac("6×"+fmt(E)+"×"+fmt(Iy), fmt(L)+"²")}`, val: 6*E*Iy/(L**2), label: "Corte-Momento Y" },
      { name: `${frac(v("G")+"·"+v("J"), v("L"))}`, calc: `${frac(fmt(G)+"×"+fmt(J), fmt(L))}`, val: G*J/L, label: "Torsión" },
      { name: `${frac("4·"+v("E")+"·"+v("I","z"), v("L"))}`, calc: `${frac("4×"+fmt(E)+"×"+fmt(Iz), fmt(L))}`, val: 4*E*Iz/L, label: "Flexión Z (4EI/L)" },
      { name: `${frac("2·"+v("E")+"·"+v("I","z"), v("L"))}`, calc: `${frac("2×"+fmt(E)+"×"+fmt(Iz), fmt(L))}`, val: 2*E*Iz/L, label: "Flexión Z (2EI/L)" },
      { name: `${frac("4·"+v("E")+"·"+v("I","y"), v("L"))}`, calc: `${frac("4×"+fmt(E)+"×"+fmt(Iy), fmt(L))}`, val: 4*E*Iy/L, label: "Flexión Y (4EI/L)" },
      { name: `${frac("2·"+v("E")+"·"+v("I","y"), v("L"))}`, calc: `${frac("2×"+fmt(E)+"×"+fmt(Iy), fmt(L))}`, val: 2*E*Iy/L, label: "Flexión Y (2EI/L)" },
    ];
    return `<div class="coeff-grid">${coeffs.map(c =>
      `<div class="coeff-item"><div style="color:var(--fem-eq-sub);font-size:10px;font-family:monospace;margin-bottom:2px">${c.label}</div>${c.name} = ${c.calc} = <span class="highlight">${fmt(c.val)}</span></div>`
    ).join("")}</div>`;
  }

  /** Open full-screen overlay: symbolic formula → coefficient calculations → numeric matrix */
  function showFullMatrix(title: string, symHTML: string, numHTML: string, coeffHTML?: string) {
    const existing = document.querySelector(".fem-full-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.className = "fem-full-overlay";
    overlay.innerHTML = `
      <button class="close-full" id="fem-full-close">✕ Cerrar</button>
      <h2>${title}</h2>
      <div class="fem-full-sections">
        <div class="full-section">
          <div class="side-title">① Fórmula General (simbólica)</div>
          <div class="fem-full-sym">${symHTML}</div>
        </div>
        ${coeffHTML ? `<div class="full-section coeff">
          <div class="side-title">② Cálculo de Coeficientes (sustitución numérica)</div>
          ${coeffHTML}
        </div>` : ""}
        <div class="full-section numeric">
          <div class="side-title">${coeffHTML ? "③" : "②"} Matriz Numérica Resultante</div>
          ${numHTML}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector("#fem-full-close")?.addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  }

  /** Show the FEM detail panel for a selected element */
  function showInspectPanel(elemIdx: number) {
    if (inspectPanel) inspectPanel.remove();

    const nodes_arr = mesh.nodes.val;
    const elements = mesh.elements.val;
    const elem = elements[elemIdx];
    const elmNodes = elem.map(ni => nodes_arr[ni]) as Node[];
    const isFrame = elem.length === 2;
    const ei = mesh.elementInputs?.val || {};
    const dOut = mesh.deformOutputs?.val;
    const aOut = mesh.analyzeOutputs?.val;

    // Element properties
    let propsHTML = "";
    if (isFrame) {
      const L = norm(subtract(elmNodes[1], elmNodes[0])) as number;
      const E = ei.elasticities?.get(elemIdx) ?? 0;
      const A = ei.areas?.get(elemIdx) ?? 0;
      const Iz = ei.momentsOfInertiaZ?.get(elemIdx) ?? 0;
      const Iy = ei.momentsOfInertiaY?.get(elemIdx) ?? 0;
      const G = ei.shearModuli?.get(elemIdx) ?? 0;
      const J = ei.torsionalConstants?.get(elemIdx) ?? 0;
      // Get current releases for this element
      const curRel = ei.momentReleases?.get(elemIdx) || [];
      const curSpr = (ei as any).partialFixitySprings?.get(elemIdx) || [];
      const relLabels = ["P (Axial)", "V2 (Corte)", "V3 (Corte)", "T (Torsión)", "M22 (Momento)", "M33 (Momento)"];
      const relIds = ["FxI","FyI","FzI","TI","M2I","M3I","FxJ","FyJ","FzJ","TJ","M2J","M3J"];

      // Build releases table
      let relRows = "";
      for (let d = 0; d < 6; d++) {
        const idxI = d, idxJ = d + 6;
        const chkI = (curRel.length >= 12 ? curRel[idxI] : (d >= 3 && curRel.length >= 6 ? curRel[d - 3] : false)) ? "checked" : "";
        const chkJ = (curRel.length >= 12 ? curRel[idxJ] : (d >= 3 && curRel.length >= 6 ? curRel[d] : false)) ? "checked" : "";
        const sprI = curSpr.length >= 12 && curSpr[idxI] > 0 ? curSpr[idxI].toFixed(1) : "";
        const sprJ = curSpr.length >= 12 && curSpr[idxJ] > 0 ? curSpr[idxJ].toFixed(1) : "";
        relRows += `<tr>
          <td style="text-align:left;color:var(--fem-key)">${relLabels[d]}</td>
          <td style="text-align:center"><input type="checkbox" data-rel="${idxI}" ${chkI}></td>
          <td style="text-align:center"><input type="checkbox" data-rel="${idxJ}" ${chkJ}></td>
          <td><input type="number" data-spr="${idxI}" value="${sprI}" placeholder="0" style="width:50px;background:var(--fem-bg);color:var(--fem-val);border:1px solid var(--fem-border);font-size:10px;text-align:right"></td>
          <td><input type="number" data-spr="${idxJ}" value="${sprJ}" placeholder="0" style="width:50px;background:var(--fem-bg);color:var(--fem-val);border:1px solid var(--fem-border);font-size:10px;text-align:right"></td>
        </tr>`;
      }

      propsHTML = `
        <div class="prop-row"><span class="prop-key">Tipo</span><span class="prop-val">Frame (2 nodos)</span></div>
        <div class="prop-row"><span class="prop-key">Nodos</span><span class="prop-val">${elem[0]} → ${elem[1]}</span></div>
        <div class="prop-row"><span class="prop-key">L</span><span class="prop-val">${fmt(L)} m</span></div>
        <div class="prop-row"><span class="prop-key">E</span><span class="prop-val">${fmt(E)}</span></div>
        <div class="prop-row"><span class="prop-key">A</span><span class="prop-val">${fmt(A)}</span></div>
        <div class="prop-row"><span class="prop-key">Iz</span><span class="prop-val">${fmt(Iz)}</span></div>
        <div class="prop-row"><span class="prop-key">Iy</span><span class="prop-val">${fmt(Iy)}</span></div>
        <div class="prop-row"><span class="prop-key">G</span><span class="prop-val">${fmt(G)}</span></div>
        <div class="prop-row"><span class="prop-key">J</span><span class="prop-val">${fmt(J)}</span></div>
        <div class="section">
          <div class="section-title">Frame Releases</div>
          <table style="font-size:10px">
            <tr>
              <td class="header"></td>
              <td class="header" colspan="2">Release</td>
              <td class="header" colspan="2">Partial Fixity Springs</td>
            </tr>
            <tr>
              <td class="header"></td>
              <td class="header">Start</td><td class="header">End</td>
              <td class="header">Start</td><td class="header">End</td>
            </tr>
            ${relRows}
          </table>
          <button id="rel-apply" style="margin-top:4px;background:var(--fem-heading);color:#000;border:none;border-radius:3px;padding:3px 10px;font-size:10px;cursor:pointer;font-family:monospace">Aplicar</button>
        </div>
      `;
    } else {
      const E_sh = ei.elasticities?.get(elemIdx) ?? 0;
      const t_sh = ei.thicknesses?.get(elemIdx) ?? 0;
      const nu_sh = ei.poissonsRatios?.get(elemIdx) ?? 0;
      const G_sh = E_sh / (2 * (1 + nu_sh));
      const isQ4 = elem.length === 4;
      const Dval = E_sh / (1 - nu_sh * nu_sh);

      propsHTML = `
        <div class="prop-row"><span class="prop-key">Tipo</span><span class="prop-val">Shell Q${isQ4 ? "4" : "3"} (${elem.length} nodos)</span></div>
        <div class="prop-row"><span class="prop-key">Nodos</span><span class="prop-val">${elem.join(", ")}</span></div>
        <div class="prop-row"><span class="prop-key">E</span><span class="prop-val">${fmt(E_sh)}</span></div>
        <div class="prop-row"><span class="prop-key">G</span><span class="prop-val">${fmt(G_sh)}</span></div>
        <div class="prop-row"><span class="prop-key">t</span><span class="prop-val">${fmt(t_sh)}</span></div>
        <div class="prop-row"><span class="prop-key">ν</span><span class="prop-val">${fmt(nu_sh)}</span></div>
      `;

      if (isQ4) {
        // Wilson (2004) Cap 6 formulas for incompatible modes
        formulaStiffHTML = `<div class="fem-eq eq-box">
          <div style="text-align:left;margin-bottom:6px"><strong style="color:var(--fem-section-title)">Formulación Q4: Membrana + Mindlin-Reissner + Drilling</strong></div>

          <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">1. Matriz constitutiva (esfuerzo plano):</strong></div>
          <div>${v("D")} = ${frac(v("E"), "1−ν²")} · <span class="mat-sym" style="grid-template-columns:repeat(3,auto)">
            <span class="cell">1</span><span class="cell">ν</span><span class="cell">0</span>
            <span class="cell">ν</span><span class="cell">1</span><span class="cell">0</span>
            <span class="cell">0</span><span class="cell">0</span><span class="cell">${frac("1−ν","2")}</span>
          </span> = ${frac(fmt(E_sh), "1−"+fmt(nu_sh)+"²")} = <span class="highlight">${fmt(Dval)}</span></div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">2. Funciones de forma (Ec. 6.2, Wilson):</strong></div>
          <div>${v("N","i")} = ¼·(1±ξ)·(1±η) &nbsp;&nbsp; <sub style="color:var(--fem-label)">i = 1..4 (bilineal)</sub></div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">3. Modos incompatibles (Ec. 6.13, Wilson 1971):</strong></div>
          <div>${v("N","5")} = 1 − ξ² &nbsp;&nbsp; ${v("N","6")} = 1 − η²</div>
          <div style="margin-top:4px">${v("u","x")} = Σ${v("N","i")}·${v("u","xi")} + α₁·${v("N","5")} + α₂·${v("N","6")} &nbsp;<sub style="color:var(--fem-label)">(Ec. 6.12)</sub></div>
          <div>${v("u","y")} = Σ${v("N","i")}·${v("u","yi")} + α₃·${v("N","5")} + α₄·${v("N","6")}</div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">4. Deformación-desplazamiento (Ec. 6.3):</strong></div>
          <div>${v("d")} = [${v("B","C")} &nbsp; ${v("B","I")}] · [${v("u")} &nbsp; α]${`<sup>T</sup>`}</div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">5. Submatrices de rigidez (Ec. 6.9):</strong></div>
          <div>${v("k","CC")} = ∫${v("B","C")}${`<sup>T</sup>`}·${v("E")}·${v("B","C")} dV &nbsp;<sub style="color:var(--fem-label)">(8×8 estándar)</sub></div>
          <div>${v("k","CI")} = ∫${v("B","C")}${`<sup>T</sup>`}·${v("E")}·${v("B̄","I")} dV &nbsp;<sub style="color:var(--fem-label)">(8×4 acoplamiento)</sub></div>
          <div>${v("k","II")} = ∫${v("B̄","I")}${`<sup>T</sup>`}·${v("E")}·${v("B̄","I")} dV &nbsp;<sub style="color:var(--fem-label)">(4×4 modos internos)</sub></div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">6. Condensación estática (Ec. 6.11):</strong></div>
          <div style="font-size:13px"><span class="highlight">${v("k","C")} = ${v("k","CC")} − ${v("k","CI")} · ${v("k","II")}⁻¹ · ${v("k","IC")}</span></div>
          <div style="margin-top:4px;color:var(--fem-eq-sub)">Los 4 modos incompatibles α se eliminan antes del ensamblaje global</div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">7. Corrección de Taylor (Ec. 6.7):</strong></div>
          <div>${v("B̄","I")} = ${v("B","I")} + ${v("B","IC")} &nbsp; donde &nbsp; ${v("B","IC")} = −${frac("1","V")}∫${v("B","I")} dV</div>
          <div style="color:var(--fem-eq-sub)">Jacobiano del centro para modos incompatibles → pasa patch test</div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">8. Drilling DOF (Hughes-Brezzi 1989):</strong></div>
          <div>${v("K","drill")} = α·${v("G")}·${v("t")} · ∫${v("B","d")}${`<sup>T</sup>`}·${v("B","d")} dA &nbsp; donde α = 0.5</div>
          <div>${v("B","d")}[i] = θ<sub>z,i</sub> − ½·(∂v/∂x − ∂u/∂y) &nbsp;<sub style="color:var(--fem-label)">(rotación antisimétrica)</sub></div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">9. Placa Mindlin-Reissner + MITC4:</strong></div>
          <div>${v("D","b")} = ${frac(v("E")+"·"+v("t")+"³", "12·(1−ν²)")} = <span class="highlight">${fmt(E_sh * t_sh**3 / (12*(1-nu_sh**2)))}</span></div>
          <div>${v("D","s")} = κ·${v("G")}·${v("t")} = <span class="highlight">${fmt(5/6 * G_sh * t_sh)}</span> &nbsp; <sub style="color:var(--fem-label)">κ = 5/6</sub></div>
          <div style="color:var(--fem-eq-sub)">MITC4: interpolación de cortante en puntos de atado (tying points)</div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">10. Ensamblaje final:</strong></div>
          <div>${v("K","24×24")} = ${v("K","membrana")}(8×8) + ${v("K","flexión")}(12×12) + ${v("K","drilling")}(12×12)</div>
          <div style="color:var(--fem-eq-sub)">DOFs por nodo: [u, v, w, θx, θy, θz]</div>
        </div>`;
      }
    }

    // Compute matrices
    let kLocalHTML = "", tMatrixHTML = "", kGlobalHTML = "";
    let formulaStiffHTML = "", formulaTransHTML = "", formulaGlobalHTML = "", formulaAssemblyHTML = "", formulaForceHTML = "";
    let _kLocal: number[][] | null = null, _T: number[][] | null = null, _kGlobal: number[][] | null = null;
    let _dofLabels: string[] = [];
    try {
      _kLocal = getLocalStiffnessMatrix(elmNodes, ei, elemIdx);
      _T = getTransformationMatrix(elmNodes);
      _kGlobal = multiply(transpose(_T), multiply(_kLocal, _T)) as number[][];

      _dofLabels = isFrame
        ? ["ux₀","uy₀","uz₀","θx₀","θy₀","θz₀","ux₁","uy₁","uz₁","θx₁","θy₁","θz₁"]
        : ["ux₀","uy₀","uz₀","θx₀","θy₀","θz₀","ux₁","uy₁","uz₁","θx₁","θy₁","θz₁","ux₂","uy₂","uz₂","θx₂","θy₁","θz₂"];

      // Symbolic formulas
      if (isFrame) {
        const L_val = norm(subtract(elmNodes[1], elmNodes[0])) as number;
        const E_val = ei.elasticities?.get(elemIdx) ?? 0;
        const A_val = ei.areas?.get(elemIdx) ?? 0;
        const Iz_val = ei.momentsOfInertiaZ?.get(elemIdx) ?? 0;
        const Iy_val = ei.momentsOfInertiaY?.get(elemIdx) ?? 0;
        const G_val = ei.shearModuli?.get(elemIdx) ?? 0;
        const J_val = ei.torsionalConstants?.get(elemIdx) ?? 0;
        formulaStiffHTML = frameStiffnessFormula(E_val, A_val, Iz_val, Iy_val, G_val, J_val, L_val);
      }
      formulaTransHTML = transformFormula(elmNodes);
      formulaGlobalHTML = globalStiffnessFormula();
      formulaAssemblyHTML = assemblyFormula(elem);
      formulaForceHTML = forceRecoveryFormula(isFrame);

      const expandBtn = `<button class="fem-expand-btn" data-full="kLocal">⛶ Ver completa</button>`;
      const expandBtnT = `<button class="fem-expand-btn" data-full="T">⛶ Ver completa</button>`;
      const expandBtnKg = `<button class="fem-expand-btn" data-full="kGlobal">⛶ Ver completa</button>`;

      kLocalHTML = `<div class="matrix-label">k_local (${_kLocal.length}×${_kLocal.length}) ${expandBtn}</div>${matrixHTML(_kLocal, _dofLabels)}`;
      tMatrixHTML = `<div class="matrix-label">T — Transformación (${_T.length}×${_T.length}) ${expandBtnT}</div>${matrixHTML(_T, _dofLabels)}`;
      kGlobalHTML = `<div class="matrix-label">K_global = T^T · k · T ${expandBtnKg}</div>${matrixHTML(_kGlobal, _dofLabels)}`;
    } catch (err: any) {
      kLocalHTML = `<div style="color:red">Error: ${err.message}</div>`;
    }

    // Displacements at element nodes
    let dispHTML = "";
    if (dOut?.deformations) {
      const dofNames = ["ux","uy","uz","θx","θy","θz"];
      dispHTML = elem.map((ni, idx) => {
        const d = dOut.deformations?.get(ni) || [0,0,0,0,0,0];
        const rows = dofNames.map((name, j) => `<span class="prop-key">${name}</span>: <span class="${Math.abs(d[j]) > 1e-10 ? 'result-val' : ''}">${fmt(d[j])}</span>`).join(" &nbsp;");
        return `<div style="margin-bottom:2px"><strong>Nodo ${ni}:</strong> ${rows}</div>`;
      }).join("");
    }

    // Internal forces — step by step
    let resultsHTML = "";
    if (aOut && isFrame && dOut?.deformations && _kLocal && _T) {
      const N = aOut.normals?.get(elemIdx);
      const Vy = aOut.shearsY?.get(elemIdx);
      const Vz = aOut.shearsZ?.get(elemIdx);
      const Mx = aOut.torsions?.get(elemIdx);
      const My = aOut.bendingsY?.get(elemIdx);
      const Mz = aOut.bendingsZ?.get(elemIdx);

      // Step A: gather u_global for this element's nodes
      const dofNames = ["ux","uy","uz","θx","θy","θz"];
      const u_global: number[] = [];
      for (const ni of elem) {
        const d = dOut.deformations?.get(ni) || [0,0,0,0,0,0];
        u_global.push(...d);
      }

      // Step B: u_local = T · u_global
      let u_local: number[] = [];
      try { u_local = (multiply(_T, u_global) as number[]); } catch { u_local = new Array(12).fill(0); }

      // Step C: f_local = k_local · u_local
      let f_local: number[] = [];
      try { f_local = (multiply(_kLocal, u_local) as number[]); } catch { f_local = new Array(12).fill(0); }

      const vecStr = (arr: number[], names: string[]) => arr.map((val, i) =>
        `<span style="color:${Math.abs(val) > 1e-10 ? 'var(--fem-nonzero)' : 'var(--fem-eq-dots)'}">${names[i % 6]}=${fmt(val)}</span>`
      ).join(", ");

      const fLabels = ["N","Vy","Vz","Mx","My","Mz","N","Vy","Vz","Mx","My","Mz"];
      const fLabelsFull = fLabels.map((n, i) => `${n}${i < 6 ? "ᵢ" : "ⱼ"}`);

      resultsHTML = `
        <div class="fem-step">
          <div class="step-title">Paso A — Desplazamientos globales del elemento</div>
          <div class="step-eq">${v("u","global")} = [${elem.map((ni, idx) => `<span style="color:var(--fem-label)">nodo ${ni}:</span> ${dofNames.map((dn, j) => `<span style="color:${Math.abs(u_global[idx*6+j]) > 1e-10 ? 'var(--fem-eq-var)' : 'var(--fem-eq-dots)'}">${fmt(u_global[idx*6+j])}</span>`).join(", ")}`).join(" | ")}]</div>
        </div>
        <div class="fem-step">
          <div class="step-title">Paso B — Transformar a coordenadas locales</div>
          <div class="step-eq">${v("u","local")} = ${v("T")} · ${v("u","global")}</div>
          <div class="step-eq" style="margin-top:4px">${v("u","local")} = [${vecStr(u_local, [...dofNames, ...dofNames])}]</div>
        </div>
        <div class="fem-step">
          <div class="step-title">Paso C — Fuerzas internas: ${v("f","local")} = ${v("k","local")} · ${v("u","local")}</div>
          <div class="step-eq" style="margin-top:4px">${v("f","local")} = [${f_local.map((val, i) =>
            `<span style="color:${Math.abs(val) > 1e-10 ? 'var(--fem-nonzero)' : 'var(--fem-eq-dots)'}">${fLabelsFull[i]}=${fmt(val)}</span>`
          ).join(", ")}]</div>
        </div>
        <div class="fem-step">
          <div class="step-title">Paso D — Identificación de esfuerzos (nodo i → nodo j)</div>
          <div class="step-eq" style="display:grid;grid-template-columns:1fr 1fr;gap:2px 12px">
            <div>${v("P","1")} = ${v("N","i")} = <span class="highlight">${fmt(f_local[0])}</span></div>
            <div>${v("P","7")} = ${v("N","j")} = <span class="highlight">${fmt(f_local[6])}</span></div>
            <div>${v("P","2")} = ${v("V","y,i")} = <span class="highlight">${fmt(f_local[1])}</span></div>
            <div>${v("P","8")} = ${v("V","y,j")} = <span class="highlight">${fmt(f_local[7])}</span></div>
            <div>${v("P","3")} = ${v("V","z,i")} = <span class="highlight">${fmt(f_local[2])}</span></div>
            <div>${v("P","9")} = ${v("V","z,j")} = <span class="highlight">${fmt(f_local[8])}</span></div>
            <div>${v("P","4")} = ${v("M","x,i")} = <span class="highlight">${fmt(f_local[3])}</span></div>
            <div>${v("P","10")} = ${v("M","x,j")} = <span class="highlight">${fmt(f_local[9])}</span></div>
            <div>${v("P","5")} = ${v("M","y,i")} = <span class="highlight">${fmt(f_local[4])}</span></div>
            <div>${v("P","11")} = ${v("M","y,j")} = <span class="highlight">${fmt(f_local[10])}</span></div>
            <div>${v("P","6")} = ${v("M","z,i")} = <span class="highlight">${fmt(f_local[5])}</span></div>
            <div>${v("P","12")} = ${v("M","z,j")} = <span class="highlight">${fmt(f_local[11])}</span></div>
          </div>
        </div>
        <div style="margin-top:8px;border-top:1px solid var(--fem-border);padding-top:6px">
          <div style="color:var(--fem-label);font-size:10px;margin-bottom:4px">RESUMEN (hekatan-fem output):</div>
          <div class="prop-row"><span class="prop-key">N (normal)</span><span class="result-val">[${N ? N.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
          <div class="prop-row"><span class="prop-key">Vy (corte Y)</span><span class="result-val">[${Vy ? Vy.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
          <div class="prop-row"><span class="prop-key">Vz (corte Z)</span><span class="result-val">[${Vz ? Vz.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
          <div class="prop-row"><span class="prop-key">Mx (torsion)</span><span class="result-val">[${Mx ? Mx.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
          <div class="prop-row"><span class="prop-key">My (momento Y)</span><span class="result-val">[${My ? My.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
          <div class="prop-row"><span class="prop-key">Mz (momento Z)</span><span class="result-val">[${Mz ? Mz.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
        </div>
      `;
    } else if (aOut && isFrame) {
      // No deform data — just show results
      const N = aOut.normals?.get(elemIdx);
      const Vy = aOut.shearsY?.get(elemIdx);
      const Vz = aOut.shearsZ?.get(elemIdx);
      const Mx = aOut.torsions?.get(elemIdx);
      const My = aOut.bendingsY?.get(elemIdx);
      const Mz = aOut.bendingsZ?.get(elemIdx);
      resultsHTML = `
        <div class="prop-row"><span class="prop-key">N (normal)</span><span class="result-val">[${N ? N.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
        <div class="prop-row"><span class="prop-key">Vy (corte Y)</span><span class="result-val">[${Vy ? Vy.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
        <div class="prop-row"><span class="prop-key">Vz (corte Z)</span><span class="result-val">[${Vz ? Vz.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
        <div class="prop-row"><span class="prop-key">Mx (torsion)</span><span class="result-val">[${Mx ? Mx.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
        <div class="prop-row"><span class="prop-key">My (momento Y)</span><span class="result-val">[${My ? My.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
        <div class="prop-row"><span class="prop-key">Mz (momento Z)</span><span class="result-val">[${Mz ? Mz.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
      `;
    } else if (aOut && !isFrame) {
      const Mxx = aOut.bendingXX?.get(elemIdx);
      const Myy = aOut.bendingYY?.get(elemIdx);
      const Mxy = aOut.bendingXY?.get(elemIdx);
      const Nxx = aOut.membraneXX?.get(elemIdx);
      const Nyy = aOut.membraneYY?.get(elemIdx);
      const Nxy = aOut.membraneXY?.get(elemIdx);
      resultsHTML = `
        <div class="prop-row"><span class="prop-key">Mxx (flexion)</span><span class="result-val">[${Mxx ? Mxx.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
        <div class="prop-row"><span class="prop-key">Myy</span><span class="result-val">[${Myy ? Myy.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
        <div class="prop-row"><span class="prop-key">Mxy</span><span class="result-val">[${Mxy ? Mxy.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
        <div class="prop-row"><span class="prop-key">Nxx (membrana)</span><span class="result-val">[${Nxx ? Nxx.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
        <div class="prop-row"><span class="prop-key">Nyy</span><span class="result-val">[${Nyy ? Nyy.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
        <div class="prop-row"><span class="prop-key">Nxy</span><span class="result-val">[${Nxy ? Nxy.map(x=>fmt(x)).join(", ") : "—"}]</span></div>
      `;
    }

    // Assembly info
    const assemblyHTML = `
      <div class="prop-row"><span class="prop-key">DOF offset nodo ${elem[0]}</span><span class="prop-val">${6 * elem[0]}..${6 * elem[0] + 5}</span></div>
      <div class="prop-row"><span class="prop-key">DOF offset nodo ${elem[1]}</span><span class="prop-val">${6 * elem[1]}..${6 * elem[1] + 5}</span></div>
      ${elem.length === 3 ? `<div class="prop-row"><span class="prop-key">DOF offset nodo ${elem[2]}</span><span class="prop-val">${6 * elem[2]}..${6 * elem[2] + 5}</span></div>` : ""}
      <div class="prop-row"><span class="prop-key">K global total</span><span class="prop-val">${nodes_arr.length * 6} × ${nodes_arr.length * 6}</span></div>
    `;

    // Build panel using new 3-tab element report
    inspectPanel = buildElementReport(
      elemIdx, nodes_arr, elements, ei,
      dOut, aOut
    );
    inspectPanel.id = "fem-inspect-panel";
    document.body.appendChild(inspectPanel);
    inspectPanel.querySelector("#er-close")?.addEventListener("click", () => cleanupInspect());

    // Releases apply button
    inspectPanel.querySelector("#rel-apply")?.addEventListener("click", () => {
      const relChecks = inspectPanel!.querySelectorAll<HTMLInputElement>("input[data-rel]");
      const sprInputs = inspectPanel!.querySelectorAll<HTMLInputElement>("input[data-spr]");
      const releases: boolean[] = new Array(12).fill(false);
      const springs: number[] = new Array(12).fill(0);
      relChecks.forEach(cb => { releases[parseInt(cb.dataset.rel!)] = cb.checked; });
      sprInputs.forEach(inp => { const v = parseFloat(inp.value); if (v > 0) springs[parseInt(inp.dataset.spr!)] = v; });

      // Store in elementInputs
      if (!ei.momentReleases) (ei as any).momentReleases = new Map();
      if (!ei.partialFixitySprings) (ei as any).partialFixitySprings = new Map();
      if (releases.some(r => r)) ei.momentReleases!.set(elemIdx, releases);
      else ei.momentReleases!.delete(elemIdx);
      if (springs.some(s => s > 0)) (ei as any).partialFixitySprings.set(elemIdx, springs);
      else (ei as any).partialFixitySprings.delete(elemIdx);

      console.log(`Releases elem ${elemIdx}:`, releases.map((r,i) => r ? relIds[i] : "").filter(Boolean).join(" ") || "none");
      console.log(`Springs elem ${elemIdx}:`, springs);
      // Re-run analysis if available
      const btn = inspectPanel!.querySelector("#rel-apply") as HTMLButtonElement;
      btn.textContent = "✓ Aplicado";
      btn.style.background = "#4caf50";
      setTimeout(() => { btn.textContent = "Aplicar"; btn.style.background = "var(--fem-heading)"; }, 1500);
    });

    // Legacy shape function canvas code — now handled by elementReport.ts
    const sfCanvas = null as HTMLCanvasElement | null;
    if (sfCanvas) {
      const ctx2d = sfCanvas.getContext("2d")!;
      const W = sfCanvas.width, H = sfCanvas.height;
      const pad = 25, gw = W - 2*pad, gh = (H - 3*pad) / 2;

      // Background
      ctx2d.fillStyle = "#111";
      ctx2d.fillRect(0, 0, W, H);

      // Draw Axial (top graph)
      const drawGraph = (y0: number, title: string, funcs: {fn: (x:number)=>number, color: string, label: string}[]) => {
        ctx2d.strokeStyle = "#333";
        ctx2d.lineWidth = 1;
        ctx2d.strokeRect(pad, y0, gw, gh);
        // Zero line
        ctx2d.strokeStyle = "#444";
        ctx2d.beginPath(); ctx2d.moveTo(pad, y0 + gh/2); ctx2d.lineTo(pad + gw, y0 + gh/2); ctx2d.stroke();
        // Title
        ctx2d.fillStyle = "#888";
        ctx2d.font = "10px monospace";
        ctx2d.fillText(title, pad + 2, y0 + 12);
        // Functions
        for (const f of funcs) {
          ctx2d.strokeStyle = f.color;
          ctx2d.lineWidth = 2;
          ctx2d.beginPath();
          for (let i = 0; i <= 100; i++) {
            const xi = i / 100;
            const val = f.fn(xi);
            const px = pad + xi * gw;
            const py = y0 + gh/2 - val * (gh/2 * 0.9);
            if (i === 0) ctx2d.moveTo(px, py); else ctx2d.lineTo(px, py);
          }
          ctx2d.stroke();
        }
        // Legend
        let lx = pad + gw - 80;
        for (const f of funcs) {
          ctx2d.fillStyle = f.color;
          ctx2d.font = "9px monospace";
          ctx2d.fillText(f.label, lx, y0 + gh - 4);
          lx += 40;
        }
        // ξ labels
        ctx2d.fillStyle = "#666";
        ctx2d.font = "9px monospace";
        ctx2d.fillText("0", pad, y0 + gh + 10);
        ctx2d.fillText("1", pad + gw - 6, y0 + gh + 10);
        ctx2d.fillText("ξ", pad + gw/2, y0 + gh + 10);
      };

      // Axial shape functions
      drawGraph(pad, "Axial", [
        { fn: (x) => 1-x, color: "#ff6600", label: "N₁" },
        { fn: (x) => x, color: "#00ccff", label: "N₂" },
      ]);

      // Hermite shape functions
      drawGraph(pad + gh + pad, "Flexión (Hermite)", [
        { fn: (x) => 1 - 3*x*x + 2*x*x*x, color: "#ff6600", label: "H₁" },
        { fn: (x) => x*(1-x)*(1-x), color: "#ffcc00", label: "H₂" },
        { fn: (x) => 3*x*x - 2*x*x*x, color: "#00ccff", label: "H₃" },
        { fn: (x) => x*x*(x-1), color: "#00ff66", label: "H₄" },
      ]);
    }

    // Wire up "Ver completa" buttons
    const _coeffHTML = isFrame ? (() => {
      const L_v = norm(subtract(elmNodes[1], elmNodes[0])) as number;
      const E_v = ei.elasticities?.get(elemIdx) ?? 0;
      const A_v = ei.areas?.get(elemIdx) ?? 0;
      const Iz_v = ei.momentsOfInertiaZ?.get(elemIdx) ?? 0;
      const Iy_v = ei.momentsOfInertiaY?.get(elemIdx) ?? 0;
      const G_v = ei.shearModuli?.get(elemIdx) ?? 0;
      const J_v = ei.torsionalConstants?.get(elemIdx) ?? 0;
      return frameCoeffCalcHTML(E_v, A_v, Iz_v, Iy_v, G_v, J_v, L_v);
    })() : undefined;
    inspectPanel.querySelectorAll("[data-full]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const which = (btn as HTMLElement).dataset.full;
        if (which === "kLocal" && _kLocal) {
          const symHTML = isFrame ? frameSymbolicMatrix12() : "<em>Shell 18×18 — ver tabla numérica</em>";
          showFullMatrix(`Elemento ${elemIdx} — Rigidez Local k_local`, symHTML, fullMatrixHTML(_kLocal, _dofLabels), _coeffHTML);
        } else if (which === "T" && _T) {
          showFullMatrix(`Elemento ${elemIdx} — Transformación T`, formulaTransHTML, fullMatrixHTML(_T, _dofLabels));
        } else if (which === "kGlobal" && _kGlobal) {
          const symHTML = isFrame ? frameSymbolicMatrix12() : "<em>Shell 18×18</em>";
          showFullMatrix(`Elemento ${elemIdx} — Rigidez Global K = T^T · k · T`, symHTML, fullMatrixHTML(_kGlobal, _dofLabels), _coeffHTML);
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // ICONIC STRUCTURES — Parametric generators
  // ═══════════════════════════════════════════════════════════════

  /** Torre Eiffel — Lattice tower with tapered profile */
  function generateEiffel() {
    const H = 30; // total height (scaled)
    const baseW = 12; // base width
    const nLevels = 8;
    const nodes: Node[] = [];
    const elements: Element[] = [];

    // 4 legs that taper inward with height (parabolic profile)
    for (let iz = 0; iz <= nLevels; iz++) {
      const t = iz / nLevels;
      const z = H * t;
      // Width at this level: parabolic taper
      const w = baseW * (1 - t) * (1 - t * 0.3);
      const halfW = w / 2;

      // 4 corner nodes
      const base = nodes.length;
      nodes.push([-halfW, -halfW, z]); // 0: front-left
      nodes.push([halfW, -halfW, z]);  // 1: front-right
      nodes.push([halfW, halfW, z]);   // 2: back-right
      nodes.push([-halfW, halfW, z]);  // 3: back-left

      // Horizontal ring (connect 4 corners)
      elements.push([base, base + 1]);
      elements.push([base + 1, base + 2]);
      elements.push([base + 2, base + 3]);
      elements.push([base + 3, base]);

      // Diagonals in plan (X bracing)
      if (iz > 0 && iz < nLevels) {
        elements.push([base, base + 2]);
        elements.push([base + 1, base + 3]);
      }

      // Vertical connections to previous level
      if (iz > 0) {
        const prev = base - 4;
        for (let j = 0; j < 4; j++) {
          elements.push([prev + j, base + j]); // vertical leg
        }
        // Diagonal bracing on each face
        elements.push([prev, base + 1]);     // front face diag
        elements.push([prev + 1, base + 2]); // right face diag
        elements.push([prev + 2, base + 3]); // back face diag
        elements.push([prev + 3, base]);     // left face diag
      }
    }

    // Supports at base
    const supports = new Map<number, boolean[]>();
    for (let j = 0; j < 4; j++) supports.set(j, [true,true,true,true,true,true]);

    // Gravity load at top
    const topBase = nodes.length - 4;
    const loads = new Map<number, number[]>();
    for (let j = 0; j < 4; j++) loads.set(topBase + j, [0, 0, -50, 0, 0, 0]);

    mesh.nodes.val = nodes; mesh.elements.val = elements;
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads } as any;

    // Steel properties for all elements
    const E = 200e6, G = 77e6, A = 50e-4, I = 200e-8, J = 100e-8;
    const ei: any = {
      elasticities: new Map(elements.map((_,i) => [i, E])),
      shearModuli: new Map(elements.map((_,i) => [i, G])),
      areas: new Map(elements.map((_,i) => [i, A])),
      momentsOfInertiaY: new Map(elements.map((_,i) => [i, I])),
      momentsOfInertiaZ: new Map(elements.map((_,i) => [i, I])),
      torsionalConstants: new Map(elements.map((_,i) => [i, J])),
    };
    if (mesh.elementInputs) mesh.elementInputs.val = ei;

    try {
      const dOut = deform(nodes, elements, { supports, loads } as any, ei);
      if (dOut && mesh.deformOutputs) mesh.deformOutputs.val = dOut;
    } catch (e: any) { console.warn("Eiffel deform:", e.message); }
    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
    console.log(`Torre Eiffel: ${nodes.length} nodos, ${elements.length} elementos, H=${H}m`);
  }

  /** Gateway Arch — Catenary/parabolic arch */
  function generateGatewayArch() {
    const H = 20, span = 20;
    const nDiv = 20;
    const nodes: Node[] = [];
    const elements: Element[] = [];

    // Catenary curve: z(x) = H * (1 - cosh(a*(x-span/2)) / cosh(a*span/2))
    // Simplified as parabola: z(x) = H * (1 - (2x/span - 1)^2)
    for (let i = 0; i <= nDiv; i++) {
      const t = i / nDiv;
      const x = span * t;
      const z = H * (1 - Math.pow(2 * t - 1, 2));
      // Two parallel arches (depth in Y)
      const depth = 2;
      nodes.push([x, -depth / 2, z]);
      nodes.push([x, depth / 2, z]);
    }

    // Arch elements (each side)
    for (let i = 0; i < nDiv; i++) {
      elements.push([i * 2, (i + 1) * 2]);         // front arch
      elements.push([i * 2 + 1, (i + 1) * 2 + 1]); // back arch
      // Cross bracing
      elements.push([i * 2, i * 2 + 1]);            // transverse
      elements.push([i * 2, (i + 1) * 2 + 1]);      // X-brace
      elements.push([i * 2 + 1, (i + 1) * 2]);      // X-brace
    }
    // Last transverse
    elements.push([nDiv * 2, nDiv * 2 + 1]);

    const supports = new Map<number, boolean[]>();
    supports.set(0, [true,true,true,true,true,true]);
    supports.set(1, [true,true,true,true,true,true]);
    supports.set(nDiv * 2, [true,true,true,true,true,true]);
    supports.set(nDiv * 2 + 1, [true,true,true,true,true,true]);

    const loads = new Map<number, number[]>();
    // Distributed gravity
    for (let i = 0; i <= nDiv; i++) {
      loads.set(i * 2, [0, 0, -20, 0, 0, 0]);
      loads.set(i * 2 + 1, [0, 0, -20, 0, 0, 0]);
    }

    mesh.nodes.val = nodes; mesh.elements.val = elements;
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads } as any;

    const E = 200e6, G = 77e6, A = 100e-4, I = 500e-8, J = 200e-8;
    const ei: any = {
      elasticities: new Map(elements.map((_,i) => [i, E])),
      shearModuli: new Map(elements.map((_,i) => [i, G])),
      areas: new Map(elements.map((_,i) => [i, A])),
      momentsOfInertiaY: new Map(elements.map((_,i) => [i, I])),
      momentsOfInertiaZ: new Map(elements.map((_,i) => [i, I])),
      torsionalConstants: new Map(elements.map((_,i) => [i, J])),
    };
    if (mesh.elementInputs) mesh.elementInputs.val = ei;

    try {
      const dOut = deform(nodes, elements, { supports, loads } as any, ei);
      if (dOut && mesh.deformOutputs) mesh.deformOutputs.val = dOut;
    } catch (e: any) { console.warn("Arco:", e.message); }
    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
    console.log(`Arco Gateway: ${nodes.length} nodos, ${elements.length} elem, span=${span}m, H=${H}m`);
  }

  /** Puente colgante / atirantado — Cable-stayed bridge */
  function generateBridge() {
    const span = 60, towerH = 20, deckH = 8;
    const nSpanDiv = 16;
    const deckW = 6; // deck width (Y)
    const nodes: Node[] = [];
    const elements: Element[] = [];

    // Deck nodes (2 lines at Y = ±deckW/2)
    for (let i = 0; i <= nSpanDiv; i++) {
      const x = span * i / nSpanDiv;
      nodes.push([x, -deckW / 2, deckH]); // left edge
      nodes.push([x, deckW / 2, deckH]);  // right edge
    }
    const nDeckNodes = nodes.length;

    // Deck frame elements (longitudinal + transverse)
    for (let i = 0; i < nSpanDiv; i++) {
      elements.push([i * 2, (i + 1) * 2]);         // left girder
      elements.push([i * 2 + 1, (i + 1) * 2 + 1]); // right girder
      elements.push([i * 2, i * 2 + 1]);            // floor beam
    }
    elements.push([nSpanDiv * 2, nSpanDiv * 2 + 1]); // last floor beam

    // Tower at 1/3 and 2/3 of span
    const towerPositions = [Math.round(nSpanDiv / 3), Math.round(2 * nSpanDiv / 3)];
    const towerTopNodes: number[] = [];

    for (const tp of towerPositions) {
      const x = span * tp / nSpanDiv;
      // Tower base (at ground level)
      const baseL = nodes.length; nodes.push([x, -deckW / 2, 0]);
      const baseR = nodes.length; nodes.push([x, deckW / 2, 0]);
      // Tower top
      const topL = nodes.length; nodes.push([x, -deckW / 2, towerH + deckH]);
      const topR = nodes.length; nodes.push([x, deckW / 2, towerH + deckH]);
      towerTopNodes.push(topL, topR);

      // Tower legs
      elements.push([baseL, tp * 2]);       // left leg bottom to deck
      elements.push([tp * 2, topL]);         // left leg deck to top
      elements.push([baseR, tp * 2 + 1]);   // right leg bottom to deck
      elements.push([tp * 2 + 1, topR]);     // right leg deck to top

      // Tower cross beam at top
      elements.push([topL, topR]);

      // Supports at tower bases
    }

    // Cables from tower tops to deck nodes (fan pattern)
    for (const topIdx of towerTopNodes) {
      const towerX = nodes[topIdx][0];
      for (let i = 0; i <= nSpanDiv; i++) {
        const deckX = span * i / nSpanDiv;
        if (Math.abs(deckX - towerX) > span * 0.05 && Math.abs(deckX - towerX) < span * 0.45) {
          // Connect cable to nearest deck edge
          const deckNodeIdx = nodes[topIdx][1] < 0 ? i * 2 : i * 2 + 1;
          if (i % 2 === 0) elements.push([topIdx, deckNodeIdx]); // every other for visual clarity
        }
      }
    }

    // Supports: tower bases + deck ends (rollers)
    const supports = new Map<number, boolean[]>();
    // Deck ends: simple support
    supports.set(0, [true,true,true,false,false,false]);
    supports.set(1, [true,true,true,false,false,false]);
    supports.set(nSpanDiv * 2, [false,true,true,false,false,false]); // roller
    supports.set(nSpanDiv * 2 + 1, [false,true,true,false,false,false]);
    // Tower bases: fixed
    for (let i = nDeckNodes; i < nDeckNodes + towerPositions.length * 4; i += 4) {
      supports.set(i, [true,true,true,true,true,true]);
      supports.set(i + 1, [true,true,true,true,true,true]);
    }

    // Gravity loads on deck
    const loads = new Map<number, number[]>();
    for (let i = 0; i <= nSpanDiv; i++) {
      const w = -30; // kN per node
      loads.set(i * 2, [0, 0, w, 0, 0, 0]);
      loads.set(i * 2 + 1, [0, 0, w, 0, 0, 0]);
    }

    mesh.nodes.val = nodes; mesh.elements.val = elements;
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads } as any;

    // Properties: deck=steel beams, cables=steel truss (small A, high E)
    const E = 200e6, G = 77e6;
    const ei: any = {
      elasticities: new Map(elements.map((_,i) => [i, E])),
      shearModuli: new Map(elements.map((_,i) => [i, G])),
      areas: new Map(elements.map((_,i) => [i, i < (nSpanDiv * 3 + 1) ? 200e-4 : 10e-4])),
      momentsOfInertiaY: new Map(elements.map((_,i) => [i, 5000e-8])),
      momentsOfInertiaZ: new Map(elements.map((_,i) => [i, 2000e-8])),
      torsionalConstants: new Map(elements.map((_,i) => [i, 1000e-8])),
    };
    if (mesh.elementInputs) mesh.elementInputs.val = ei;

    try {
      const dOut = deform(nodes, elements, { supports, loads } as any, ei);
      if (dOut && mesh.deformOutputs) mesh.deformOutputs.val = dOut;
    } catch (e: any) { console.warn("Puente:", e.message); }
    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
    console.log(`Puente atirantado: ${nodes.length} nodos, ${elements.length} elem, span=${span}m`);
  }

  /** Torre retorcida (Turning Torso style) — Twisted tower with rotating floors */
  function generateTwistedTower() {
    const nFloors = 12;
    const H_floor = 3.5;
    const R = 5; // floor radius
    const nCols = 6; // columns per floor (hexagonal)
    const twistPerFloor = 5; // degrees rotation per floor
    const nodes: Node[] = [];
    const elements: Element[] = [];

    // Create floor rings with increasing rotation
    for (let iz = 0; iz <= nFloors; iz++) {
      const z = iz * H_floor;
      const angle0 = iz * twistPerFloor * Math.PI / 180;

      for (let ic = 0; ic < nCols; ic++) {
        const angle = angle0 + 2 * Math.PI * ic / nCols;
        const x = R * Math.cos(angle);
        const y = R * Math.sin(angle);
        nodes.push([x, y, z]);
      }
    }

    // Floor ring beams + columns + diagonals
    for (let iz = 0; iz <= nFloors; iz++) {
      const base = iz * nCols;
      // Ring beams (connect columns on same floor)
      for (let ic = 0; ic < nCols; ic++) {
        elements.push([base + ic, base + (ic + 1) % nCols]);
      }

      // Columns to next floor
      if (iz < nFloors) {
        const next = (iz + 1) * nCols;
        for (let ic = 0; ic < nCols; ic++) {
          elements.push([base + ic, next + ic]); // vertical column
          // Diagonal bracing (connecting to next column on upper floor due to twist)
          elements.push([base + ic, next + (ic + 1) % nCols]);
        }
      }
    }

    // Core: central column
    for (let iz = 0; iz <= nFloors; iz++) {
      const coreIdx = nodes.length;
      nodes.push([0, 0, iz * H_floor]);
      // Connect core to ring
      const base = iz * nCols;
      for (let ic = 0; ic < nCols; ic++) {
        elements.push([coreIdx, base + ic]);
      }
      // Core column to next level
      if (iz < nFloors) {
        // Will be connected on next iteration
      }
    }
    // Core columns (vertical)
    const coreStart = (nFloors + 1) * nCols;
    for (let iz = 0; iz < nFloors; iz++) {
      elements.push([coreStart + iz, coreStart + iz + 1]);
    }

    // Supports at base (iz=0)
    const supports = new Map<number, boolean[]>();
    for (let ic = 0; ic < nCols; ic++) {
      supports.set(ic, [true,true,true,true,true,true]);
    }
    supports.set(coreStart, [true,true,true,true,true,true]); // core base

    // Wind load (lateral in X)
    const loads = new Map<number, number[]>();
    for (let iz = 1; iz <= nFloors; iz++) {
      const Fw = 10 * iz / nFloors; // increasing with height
      const base = iz * nCols;
      for (let ic = 0; ic < nCols; ic++) {
        loads.set(base + ic, [Fw, 0, -5, 0, 0, 0]); // wind + gravity
      }
    }

    mesh.nodes.val = nodes; mesh.elements.val = elements;
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads } as any;

    const E = 200e6, G = 77e6, A = 80e-4, I = 1000e-8, J = 500e-8;
    const ei: any = {
      elasticities: new Map(elements.map((_,i) => [i, E])),
      shearModuli: new Map(elements.map((_,i) => [i, G])),
      areas: new Map(elements.map((_,i) => [i, A])),
      momentsOfInertiaY: new Map(elements.map((_,i) => [i, I])),
      momentsOfInertiaZ: new Map(elements.map((_,i) => [i, I])),
      torsionalConstants: new Map(elements.map((_,i) => [i, J])),
    };
    if (mesh.elementInputs) mesh.elementInputs.val = ei;

    try {
      const dOut = deform(nodes, elements, { supports, loads } as any, ei);
      if (dOut && mesh.deformOutputs) mesh.deformOutputs.val = dOut;
    } catch (e: any) { console.warn("Twisted:", e.message); }
    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
    console.log(`Torre Twist: ${nodes.length} nodos, ${elements.length} elem, ${nFloors} pisos, twist=${twistPerFloor}deg/piso`);
  }

  /** Burj Khalifa style — Stepped/tapered tower with Y-shaped plan */
  function generateBurjKhalifa() {
    const nFloors = 20, H_floor = 3;
    const baseR = 8;
    const nWings = 3; // Y-shaped: 3 wings
    const nodes: Node[] = [];
    const elements: Element[] = [];

    for (let iz = 0; iz <= nFloors; iz++) {
      const t = iz / nFloors;
      const z = iz * H_floor;
      // Setbacks: reduce radius at certain heights
      let R = baseR * (1 - t * 0.7);
      if (t > 0.4) R *= 0.85; // first setback
      if (t > 0.7) R *= 0.7;  // second setback

      // Core (center node)
      const coreIdx = nodes.length;
      nodes.push([0, 0, z]);

      // Wing tips (3 wings at 120 degrees)
      for (let w = 0; w < nWings; w++) {
        const angle = w * 2 * Math.PI / nWings - Math.PI / 2;
        const x = R * Math.cos(angle);
        const y = R * Math.sin(angle);
        const tipIdx = nodes.length;
        nodes.push([x, y, z]);
        // Connect wing tip to core
        elements.push([coreIdx, tipIdx]);
        // Midpoint of wing (for buttress)
        const midIdx = nodes.length;
        nodes.push([x * 0.5, y * 0.5, z]);
        elements.push([coreIdx, midIdx]);
        elements.push([midIdx, tipIdx]);
      }

      // Connect wing tips to form perimeter
      for (let w = 0; w < nWings; w++) {
        const tip1 = coreIdx + 1 + w * 2; // tip of wing w
        const tip2 = coreIdx + 1 + ((w + 1) % nWings) * 2;
        elements.push([tip1, tip2]);
      }

      // Columns to next floor
      if (iz < nFloors) {
        const nodesPerFloor = 1 + nWings * 2; // core + 3 tips + 3 midpoints
        const nextCore = coreIdx + nodesPerFloor;
        elements.push([coreIdx, nextCore]); // core column
        for (let w = 0; w < nWings; w++) {
          elements.push([coreIdx + 1 + w * 2, nextCore + 1 + w * 2]); // tip columns
          elements.push([coreIdx + 2 + w * 2, nextCore + 2 + w * 2]); // mid columns
          // Diagonal bracing on wings
          elements.push([coreIdx + 1 + w * 2, nextCore + 2 + w * 2]);
        }
      }
    }

    const supports = new Map<number, boolean[]>();
    const nodesPerFloor = 1 + nWings * 2;
    for (let i = 0; i < nodesPerFloor; i++) supports.set(i, [true,true,true,true,true,true]);

    const loads = new Map<number, number[]>();
    for (let iz = 1; iz <= nFloors; iz++) {
      const base = iz * nodesPerFloor;
      const Fw = 5 * iz / nFloors;
      loads.set(base, [Fw, 0, -10, 0, 0, 0]);
    }

    mesh.nodes.val = nodes; mesh.elements.val = elements;
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads } as any;
    const E = 35e6, G = 14e6, A = 200e-4, I = 5000e-8, J = 2000e-8; // hormigon
    const ei: any = { elasticities: new Map(elements.map((_,i) => [i, E])), shearModuli: new Map(elements.map((_,i) => [i, G])), areas: new Map(elements.map((_,i) => [i, A])), momentsOfInertiaY: new Map(elements.map((_,i) => [i, I])), momentsOfInertiaZ: new Map(elements.map((_,i) => [i, I])), torsionalConstants: new Map(elements.map((_,i) => [i, J])) };
    if (mesh.elementInputs) mesh.elementInputs.val = ei;
    try { const dOut = deform(nodes, elements, { supports, loads } as any, ei); if (dOut && mesh.deformOutputs) mesh.deformOutputs.val = dOut; } catch (e: any) { console.warn("Burj:", e.message); }
    setTimeout(() => autoFitGridSize(), 50); updatePanel();
    console.log(`Burj Khalifa: ${nodes.length} nodos, ${elements.length} elem, ${nFloors} pisos, H=${nFloors*H_floor}m`);
  }

  /** Sydney Opera House style — Shell roof structures */
  function generateSydneyOpera() {
    const nodes: Node[] = [];
    const elements: Element[] = [];
    const nArch = 12; // divisions per shell
    const nShells = 3; // number of shell "sails"

    for (let s = 0; s < nShells; s++) {
      const offsetX = s * 12;
      const H = 15 - s * 2; // each sail slightly smaller
      const span = 20 - s * 3;
      const depth = 8 - s;
      const baseIdx = nodes.length;

      // Generate shell surface: spherical cap
      for (let iy = 0; iy <= 4; iy++) {
        const tY = iy / 4;
        const yLocal = -depth / 2 + depth * tY;
        const widthAtY = span * (1 - tY * tY * 0.3); // narrower at back

        for (let ix = 0; ix <= nArch; ix++) {
          const tX = ix / nArch;
          const x = offsetX + widthAtY * tX;
          // Shell profile: z = H * sin(pi*t) * (1 - tY^2)
          const z = H * Math.sin(Math.PI * tX) * (1 - tY * tY * 0.5);
          const y = yLocal;
          nodes.push([x, y, z]);
        }
      }

      // Create shell Q4 elements
      const nX = nArch + 1;
      for (let iy = 0; iy < 4; iy++) {
        for (let ix = 0; ix < nArch; ix++) {
          const n0 = baseIdx + iy * nX + ix;
          const n1 = baseIdx + iy * nX + ix + 1;
          const n2 = baseIdx + (iy + 1) * nX + ix + 1;
          const n3 = baseIdx + (iy + 1) * nX + ix;
          elements.push([n0, n1, n2, n3]); // Q4 shell
        }
      }
    }

    // Supports at base edges (z near 0)
    const supports = new Map<number, boolean[]>();
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i][2] < 0.5) supports.set(i, [true,true,true,true,true,true]);
    }

    const loads = new Map<number, number[]>();
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i][2] > 2) loads.set(i, [0, 0, -5, 0, 0, 0]); // self-weight
    }

    mesh.nodes.val = nodes; mesh.elements.val = elements;
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads } as any;

    const E = 35e6, nu = 0.2, t = 0.15, G = E/(2*(1+nu)); // hormigon shell
    const ei: any = {
      elasticities: new Map(elements.map((_,i) => [i, E])),
      poissonsRatios: new Map(elements.map((_,i) => [i, nu])),
      thicknesses: new Map(elements.map((_,i) => [i, t])),
      shearModuli: new Map(elements.map((_,i) => [i, G])),
    };
    if (mesh.elementInputs) mesh.elementInputs.val = ei;
    try { const dOut = deform(nodes, elements, { supports, loads } as any, ei); if (dOut && mesh.deformOutputs) mesh.deformOutputs.val = dOut; } catch (e: any) { console.warn("Opera:", e.message); }
    setTimeout(() => autoFitGridSize(), 50); updatePanel();
    console.log(`Sydney Opera: ${nodes.length} nodos, ${elements.length} shells Q4, ${nShells} velas`);
  }

  /** Diagrid tower (Gherkin / 30 St Mary Axe style) — Cylindrical diagrid */
  function generateDiagrid() {
    const nFloors = 15, H_floor = 3.5;
    const nCols = 12; // columns around perimeter
    const nodes: Node[] = [];
    const elements: Element[] = [];

    // Tapered cylinder: wider in middle (like Gherkin)
    for (let iz = 0; iz <= nFloors; iz++) {
      const t = iz / nFloors;
      const z = iz * H_floor;
      // Gherkin profile: wider in middle
      const R = 5 * (0.6 + 0.4 * Math.sin(Math.PI * t));
      if (t > 0.9) { // taper at top
        const R2 = 5 * (0.6 + 0.4 * Math.sin(Math.PI * 0.9)) * (1 - (t - 0.9) * 8);
        for (let ic = 0; ic < nCols; ic++) {
          const angle = 2 * Math.PI * ic / nCols;
          nodes.push([Math.max(R2, 1) * Math.cos(angle), Math.max(R2, 1) * Math.sin(angle), z]);
        }
      } else {
        for (let ic = 0; ic < nCols; ic++) {
          const angle = 2 * Math.PI * ic / nCols;
          nodes.push([R * Math.cos(angle), R * Math.sin(angle), z]);
        }
      }
    }

    // Diagrid pattern: diagonal elements between floors (skip vertical columns!)
    for (let iz = 0; iz < nFloors; iz++) {
      const base = iz * nCols;
      const next = (iz + 1) * nCols;

      // Ring beams at each floor
      for (let ic = 0; ic < nCols; ic++) {
        elements.push([base + ic, base + (ic + 1) % nCols]);
      }

      // Diagonal members: each node connects to +1 and -1 on next floor
      const shift = (iz % 2 === 0) ? 1 : -1;
      for (let ic = 0; ic < nCols; ic++) {
        const nextCol = (ic + shift + nCols) % nCols;
        elements.push([base + ic, next + nextCol]); // primary diagonal
        elements.push([base + ic, next + ic]);       // secondary (vertical-ish)
      }
    }
    // Top ring
    const topBase = nFloors * nCols;
    for (let ic = 0; ic < nCols; ic++) {
      elements.push([topBase + ic, topBase + (ic + 1) % nCols]);
    }

    const supports = new Map<number, boolean[]>();
    for (let ic = 0; ic < nCols; ic++) supports.set(ic, [true,true,true,true,true,true]);

    const loads = new Map<number, number[]>();
    for (let iz = 1; iz <= nFloors; iz++) {
      const base = iz * nCols;
      const Fw = 3 * iz / nFloors;
      for (let ic = 0; ic < nCols; ic += 3) {
        loads.set(base + ic, [Fw, 0, -8, 0, 0, 0]);
      }
    }

    mesh.nodes.val = nodes; mesh.elements.val = elements;
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads } as any;

    const E = 200e6, G = 77e6, A = 60e-4, I = 800e-8, J = 400e-8; // acero
    const ei: any = { elasticities: new Map(elements.map((_,i) => [i, E])), shearModuli: new Map(elements.map((_,i) => [i, G])), areas: new Map(elements.map((_,i) => [i, A])), momentsOfInertiaY: new Map(elements.map((_,i) => [i, I])), momentsOfInertiaZ: new Map(elements.map((_,i) => [i, I])), torsionalConstants: new Map(elements.map((_,i) => [i, J])) };
    if (mesh.elementInputs) mesh.elementInputs.val = ei;
    try { const dOut = deform(nodes, elements, { supports, loads } as any, ei); if (dOut && mesh.deformOutputs) mesh.deformOutputs.val = dOut; } catch (e: any) { console.warn("Diagrid:", e.message); }
    setTimeout(() => autoFitGridSize(), 50); updatePanel();
    console.log(`Diagrid Tower: ${nodes.length} nodos, ${elements.length} elem, ${nFloors} pisos, H=${nFloors*H_floor}m`);
  }

  /** Muro de corte cantilever Q4 — validacion vs OpenSees/SAP2000/ETABS */
  function generateShearWallQ4() {
    const W  = generatorParams["W"]?.val ?? 5;
    const H  = generatorParams["H"]?.val ?? 3;
    const t  = generatorParams["t"]?.val ?? 0.2;
    const nx = Math.round(generatorParams["nx"]?.val ?? 8);
    const ny = Math.round(generatorParams["ny"]?.val ?? 6);
    const E  = generatorParams["E"]?.val ?? 25e6;
    const nu = generatorParams["nu"]?.val ?? 0.2;
    const P  = generatorParams["P"]?.val ?? 100;
    const G  = E / (2*(1+nu));
    const dx = W/nx, dz = H/ny;

    const nodes: Node[] = [];
    const elements: Element[] = [];
    const supports = new Map<number, boolean[]>();
    const loads = new Map<number, number[]>();

    for (let j = 0; j <= ny; j++)
      for (let i = 0; i <= nx; i++)
        nodes.push([i*dx, 0, j*dz]);

    const nNx = nx + 1;
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++)
        elements.push([j*nNx+i, j*nNx+i+1, (j+1)*nNx+i+1, (j+1)*nNx+i]);

    for (let i = 0; i <= nx; i++)
      supports.set(i, [true,true,true,true,true,true]);

    const topNodes: number[] = [];
    for (let i = 0; i <= nx; i++) topNodes.push(ny*nNx + i);
    const pn = P / topNodes.length;
    for (const n of topNodes) loads.set(n, [pn, 0, 0, 0, 0, 0]);

    mesh.nodes.val = nodes;
    mesh.elements.val = elements;
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads } as any;

    const ei: any = {
      elasticities: new Map(elements.map((_,i) => [i, E])),
      poissonsRatios: new Map(elements.map((_,i) => [i, nu])),
      thicknesses: new Map(elements.map((_,i) => [i, t])),
      shearModuli: new Map(elements.map((_,i) => [i, G])),
      densities: new Map(elements.map((_,i) => [i, 24/9.80665])),
    };
    if (mesh.elementInputs) mesh.elementInputs.val = ei;

    try {
      const dOut = deform(nodes, elements, { supports, loads } as any, ei);
      if (dOut && mesh.deformOutputs) {
        mesh.deformOutputs.val = dOut;
        const aOut = analyze(nodes, elements, ei, dOut);
        if (mesh.analyzeOutputs) mesh.analyzeOutputs.val = aOut;
        const topCenter = ny*nNx + Math.floor(nx/2);
        const def = dOut.deformations.get(topCenter);
        const ux = def ? def[0] : 0;
        console.log(`Muro Q4: Ux=${ux.toExponential(4)} m | OS:4.602e-5 | SAP:4.629e-5 | ETABS:4.582e-5`);
      }
    } catch (e: any) { console.warn("MuroQ4:", e.message); }
    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
  }

  /** Viga cantilever discretizada con Q4 — placa horizontal empotrada un extremo, carga puntual */
  function generateCantileverBeamQ4() {
    const L  = generatorParams["L"]?.val ?? 6;
    const h  = generatorParams["h"]?.val ?? 0.5;
    const t  = generatorParams["t"]?.val ?? 0.2;
    const nx = Math.round(generatorParams["nx"]?.val ?? 12);
    const ny = Math.round(generatorParams["ny"]?.val ?? 4);
    const E  = generatorParams["E"]?.val ?? 25e6;
    const nu = generatorParams["nu"]?.val ?? 0.2;
    const P  = generatorParams["P"]?.val ?? 50;
    const G  = E / (2*(1+nu));
    const dx = L/nx, dy = h/ny;

    const nodes: Node[] = [];
    const elements: Element[] = [];
    const supports = new Map<number, boolean[]>();
    const loads = new Map<number, number[]>();

    // Nodes in XZ plane (horizontal beam: X=length, Z=height, Y=0)
    for (let j = 0; j <= ny; j++)
      for (let i = 0; i <= nx; i++)
        nodes.push([i*dx, 0, j*dy]);

    const nNx = nx + 1;
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++)
        elements.push([j*nNx+i, j*nNx+i+1, (j+1)*nNx+i+1, (j+1)*nNx+i]);

    // Fixed left edge (x=0)
    for (let j = 0; j <= ny; j++)
      supports.set(j * nNx, [true,true,true,true,true,true]);

    // Load at tip (right edge, mid-height) — downward in Z
    const tipMid = Math.floor(ny/2) * nNx + nx;
    loads.set(tipMid, [0, 0, -P, 0, 0, 0]);

    mesh.nodes.val = nodes;
    mesh.elements.val = elements;
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads } as any;

    const ei: any = {
      elasticities: new Map(elements.map((_,i) => [i, E])),
      poissonsRatios: new Map(elements.map((_,i) => [i, nu])),
      thicknesses: new Map(elements.map((_,i) => [i, t])),
      shearModuli: new Map(elements.map((_,i) => [i, G])),
      densities: new Map(elements.map((_,i) => [i, 24/9.80665])),
    };
    if (mesh.elementInputs) mesh.elementInputs.val = ei;

    try {
      const dOut = deform(nodes, elements, { supports, loads } as any, ei);
      if (dOut && mesh.deformOutputs) {
        mesh.deformOutputs.val = dOut;
        const aOut = analyze(nodes, elements, ei, dOut);
        if (mesh.analyzeOutputs) mesh.analyzeOutputs.val = aOut;
        const tipDef = dOut.deformations.get(tipMid);
        const uz = tipDef ? tipDef[2] : 0;
        // Analytical: delta = PL^3/(3EI) where I = t*h^3/12
        const I_beam = t * h*h*h / 12;
        const delta_ana = P * L*L*L / (3 * E * I_beam);
        console.log(`Viga Q4: Uz_tip=${uz.toExponential(4)} | Analitico=${delta_ana.toExponential(4)} | ratio=${(Math.abs(uz)/delta_ana).toFixed(4)}`);
      }
    } catch (e: any) { console.warn("VigaQ4:", e.message); }
    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
  }

  /** Placa cantilever horizontal Q4 — plano XY, carga vertical Z, empotrada un borde */
  function generatePlacaCantileverQ4() {
    const Lx = generatorParams["Lx"]?.val ?? 4;
    const Ly = generatorParams["Ly"]?.val ?? 2;
    const t  = generatorParams["t"]?.val ?? 0.15;
    const nx = Math.round(generatorParams["nx"]?.val ?? 8);
    const ny = Math.round(generatorParams["ny"]?.val ?? 4);
    const E  = generatorParams["E"]?.val ?? 25e6;
    const nu = generatorParams["nu"]?.val ?? 0.2;
    const P  = generatorParams["P"]?.val ?? 20;
    const G  = E / (2*(1+nu));
    const dx = Lx/nx, dy = Ly/ny;

    const nodes: Node[] = [];
    const elements: Element[] = [];
    const supports = new Map<number, boolean[]>();
    const loads = new Map<number, number[]>();

    // Nodes in XY plane (horizontal plate): [x, y, z=0]
    // Three.js Y-up: x=X, y=Z(elev=0), z=Y
    for (let j = 0; j <= ny; j++)
      for (let i = 0; i <= nx; i++)
        nodes.push([i*dx, 0, j*dy]);  // [x, elev=0, y_plan]

    const nNx = nx + 1;
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++)
        elements.push([j*nNx+i, j*nNx+i+1, (j+1)*nNx+i+1, (j+1)*nNx+i]);

    // Fixed left edge (x=0)
    for (let j = 0; j <= ny; j++)
      supports.set(j * nNx, [true,true,true,true,true,true]);

    // Distributed load on free edge (x=Lx) — vertical downward (Y in Three.js)
    const freeEdge: number[] = [];
    for (let j = 0; j <= ny; j++) freeEdge.push(j * nNx + nx);
    const pn = P / freeEdge.length;
    for (const n of freeEdge) loads.set(n, [0, -pn, 0, 0, 0, 0]);  // Fy=-pn (down in Three.js Y)

    mesh.nodes.val = nodes;
    mesh.elements.val = elements;
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads } as any;

    const ei: any = {
      elasticities: new Map(elements.map((_,i) => [i, E])),
      poissonsRatios: new Map(elements.map((_,i) => [i, nu])),
      thicknesses: new Map(elements.map((_,i) => [i, t])),
      shearModuli: new Map(elements.map((_,i) => [i, G])),
      densities: new Map(elements.map((_,i) => [i, 24/9.80665])),
    };
    if (mesh.elementInputs) mesh.elementInputs.val = ei;

    try {
      const dOut = deform(nodes, elements, { supports, loads } as any, ei);
      if (dOut && mesh.deformOutputs) {
        mesh.deformOutputs.val = dOut;
        const aOut = analyze(nodes, elements, ei, dOut);
        if (mesh.analyzeOutputs) mesh.analyzeOutputs.val = aOut;

        // Report
        const tipMid = (ny/2|0) * nNx + nx;
        const def = dOut.deformations.get(tipMid);
        const uy = def ? def[1] : 0; // Y displacement (vertical in Three.js)
        console.log(`Placa XY Q4: Uy_tip=${uy.toExponential(4)} m`);
      }
    } catch (e: any) { console.warn("PlacaXY:", e.message); }
    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
  }

  /** Pérgola de acero: 3 pórticos con vigas inclinadas + correas + panel shell Q4 */
  function generatePergola() {
    const u = activeUnits;
    const Lx     = generatorParams["Lx"]?.val ?? 5.50;
    const Ly     = generatorParams["Ly"]?.val ?? 8;
    const H1     = generatorParams["H1"]?.val ?? 3.00;
    const H2     = generatorParams["H2"]?.val ?? 4.00;
    const nCol   = Math.round(generatorParams["nCol"]?.val ?? 4);
    const nCorr  = Math.round(generatorParams["nCorr"]?.val ?? 8);
    const E      = generatorParams["E"]?.val ?? u.E;
    const tPanel = generatorParams["t"]?.val ?? 0.0005;
    const q      = generatorParams["q"]?.val ?? 1.0;
    // Support DOFs
    const supUx = (generatorParams["supUx"]?.val ?? 1) >= 0.5;
    const supUy = (generatorParams["supUy"]?.val ?? 1) >= 0.5;
    const supUz = (generatorParams["supUz"]?.val ?? 1) >= 0.5;
    const supRx = (generatorParams["supRx"]?.val ?? 1) >= 0.5;
    const supRy = (generatorParams["supRy"]?.val ?? 1) >= 0.5;
    const supRz = (generatorParams["supRz"]?.val ?? 1) >= 0.5;
    // Section params
    const colD  = generatorParams["colD"]?.val  ?? 0.16;
    const colBf = generatorParams["colBf"]?.val ?? 0.16;
    const colTf = generatorParams["colTf"]?.val ?? 0.013;
    const colTw = generatorParams["colTw"]?.val ?? 0.008;
    const vigD  = generatorParams["vigD"]?.val  ?? 0.20;
    const vigBf = generatorParams["vigBf"]?.val ?? 0.10;
    const vigTf = generatorParams["vigTf"]?.val ?? 0.0085;
    const vigTw = generatorParams["vigTw"]?.val ?? 0.0056;
    const corrB = generatorParams["corrB"]?.val ?? 0.06;
    const corrT = generatorParams["corrT"]?.val ?? 0.004;

    const nu = 0.3;
    const G = E / (2 * (1 + nu));

    // I-section properties
    function Isec(d: number, bf: number, tf: number, tw: number) {
      const hw = d - 2 * tf;
      const A = 2 * bf * tf + hw * tw;
      const Iz = (bf * d * d * d - (bf - tw) * hw * hw * hw) / 12;
      const Iy = (2 * tf * bf * bf * bf + hw * tw * tw * tw) / 12;
      const J = (2 * bf * tf * tf * tf + hw * tw * tw * tw) / 3;
      return { A, Iz, Iy, J };
    }
    const colSec = Isec(colD, colBf, colTf, colTw);
    const vigSec = Isec(vigD, vigBf, vigTf, vigTw);
    // Correa: rectangular tube
    const corrA = corrB * corrB - (corrB - 2 * corrT) * (corrB - 2 * corrT);
    const corrIz = (corrB ** 4 - (corrB - 2 * corrT) ** 4) / 12;
    const corrIy = corrIz;
    const corrJ = 2 * corrT * (corrB - corrT) ** 2 * (corrB - corrT) ** 2 / (2 * (corrB - corrT) + 2 * (corrB - corrT));

    // Layout: 3 lines of vigas along X (at x=0, Lx/2, Lx)
    const nVig = 3;
    const vigX = [0, Lx / 2, Lx];

    // Correas along Y: merge column positions into correa positions
    const colY: number[] = [];
    for (let i = 0; i < nCol; i++) colY.push(i * Ly / (nCol - 1));
    // Generate correa Y positions
    const corrYSet = new Set<number>();
    for (const cy of colY) corrYSet.add(cy);
    for (let i = 0; i < nCorr; i++) corrYSet.add(i * Ly / (nCorr - 1));
    const corrY = Array.from(corrYSet).sort((a, b) => a - b);
    const nRoof = corrY.length;

    // Height interpolation along Y (inclined H1→H2)
    function roofH(y: number): number { return H1 + (H2 - H1) * y / Ly; }

    const nodes: Node[] = [];
    const elements: Element[] = [];

    // Node grids
    // baseGrid[k][i] = node index for base of column at vigX[k], colY[i]
    const baseGrid: number[][] = [];
    // roofGrid[k][j] = node index for roof at vigX[k], corrY[j]
    const roofGrid: number[][] = [];

    // Create base + roof nodes for each viga line
    for (let k = 0; k < nVig; k++) {
      const bRow: number[] = [];
      for (let i = 0; i < nCol; i++) {
        bRow.push(nodes.length);
        nodes.push([vigX[k], colY[i], 0] as Node); // base at Z=0 — column is vertical
      }
      baseGrid.push(bRow);

      const rRow: number[] = [];
      for (let j = 0; j < nRoof; j++) {
        rRow.push(nodes.length);
        nodes.push([vigX[k], corrY[j], roofH(corrY[j])] as Node); // roof at Z=H
      }
      roofGrid.push(rRow);
    }

    // Fix base node duplicates (colY positions exist in corrY)
    // baseGrid nodes are at colY positions → map to roofGrid where corrY matches colY
    // Actually base nodes are separate (Z=0 vs Z=H), so no duplicates

    const elasticities = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const areas = new Map<number, number>();
    const moiZ = new Map<number, number>();
    const moiY = new Map<number, number>();
    const torsion = new Map<number, number>();
    const sectionShapes = new Map<number, any>();
    const momentReleases = new Map<number, boolean[]>();
    const densities = new Map<number, number>();
    const rho = u.rho ?? 7850;

    // === COLUMNS (base → roof, at column Y positions) ===
    for (let k = 0; k < nVig; k++) {
      for (let i = 0; i < nCol; i++) {
        // Find roof node at this colY
        const cyi = corrY.indexOf(colY[i]);
        if (cyi < 0) continue;
        const ei = elements.length;
        elements.push([baseGrid[k][i], roofGrid[k][cyi]]);
        elasticities.set(ei, E); shearModuli.set(ei, G);
        areas.set(ei, colSec.A); moiZ.set(ei, colSec.Iy); moiY.set(ei, colSec.Iz);
        torsion.set(ei, colSec.J); densities.set(ei, rho);
        sectionShapes.set(ei, { type: "I" as const, d: colD, bf: colBf, tf: colTf, tw: colTw, name: `Col` });
        // Column pinned at top (J end): release M22 + M33
        const relCol = new Array(12).fill(false);
        relCol[10] = true; relCol[11] = true;
        momentReleases.set(ei, relCol);
      }
    }

    // === VIGAS (along Y at each viga line, connecting roof nodes) ===
    for (let k = 0; k < nVig; k++) {
      for (let j = 0; j < nRoof - 1; j++) {
        const ei = elements.length;
        elements.push([roofGrid[k][j], roofGrid[k][j + 1]]);
        elasticities.set(ei, E); shearModuli.set(ei, G);
        areas.set(ei, vigSec.A); moiZ.set(ei, vigSec.Iy); moiY.set(ei, vigSec.Iz);
        torsion.set(ei, vigSec.J); densities.set(ei, rho);
        sectionShapes.set(ei, { type: "I" as const, d: vigD, bf: vigBf, tf: vigTf, tw: vigTw, name: `Vig` });
      }
    }

    // === CORREAS (along X, connecting viga lines at each corrY) ===
    const corrStartIdx = elements.length;
    for (let j = 0; j < nRoof; j++) {
      for (let k = 0; k < nVig - 1; k++) {
        const ei = elements.length;
        elements.push([roofGrid[k][j], roofGrid[k + 1][j]]);
        elasticities.set(ei, E); shearModuli.set(ei, G);
        areas.set(ei, corrA); moiZ.set(ei, corrIy); moiY.set(ei, corrIz);
        torsion.set(ei, corrJ); densities.set(ei, rho);
        sectionShapes.set(ei, { type: "rect" as const, b: corrB, h: corrB, name: `Corr` });
        // Correa pinned both ends
        const rel = new Array(12).fill(false);
        rel[4] = true; rel[5] = true;   // M22_I, M33_I
        rel[10] = true; rel[11] = true;  // M22_J, M33_J
        momentReleases.set(ei, rel);
      }
    }

    // === SHELL PANELS (Q4 between viga lines on roof) ===
    for (let k = 0; k < nVig - 1; k++) {
      for (let j = 0; j < nRoof - 1; j++) {
        const ei = elements.length;
        elements.push([roofGrid[k][j], roofGrid[k + 1][j], roofGrid[k + 1][j + 1], roofGrid[k][j + 1]]);
        elasticities.set(ei, E); shearModuli.set(ei, G);
        densities.set(ei, rho);
        // Shell-specific
        (elasticities as any).set(ei, E);
      }
    }

    // === SUPPORTS ===
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    const supDofs: [boolean, boolean, boolean, boolean, boolean, boolean] = [supUx, supUy, supUz, supRx, supRy, supRz];
    for (let k = 0; k < nVig; k++) {
      for (let i = 0; i < nCol; i++) {
        supports.set(baseGrid[k][i], supDofs);
      }
    }

    // === LOADS (gravity on roof nodes, -Z) ===
    const loads = new Map<number, number[]>();
    for (let k = 0; k < nVig; k++) {
      for (let j = 0; j < nRoof; j++) {
        let tribDx: number;
        if (k === 0) tribDx = (vigX[1] - vigX[0]) / 2;
        else if (k === nVig - 1) tribDx = (vigX[nVig - 1] - vigX[nVig - 2]) / 2;
        else tribDx = (vigX[k + 1] - vigX[k - 1]) / 2;
        let tribDy: number;
        if (j === 0) tribDy = (corrY[1] - corrY[0]) / 2;
        else if (j === nRoof - 1) tribDy = (corrY[nRoof - 1] - corrY[nRoof - 2]) / 2;
        else tribDy = (corrY[j + 1] - corrY[j - 1]) / 2;
        const Fz = -q * tribDx * tribDy;
        loads.set(roofGrid[k][j], [0, 0, Fz, 0, 0, 0]);
      }
    }

    // Apply to mesh
    mesh.nodes.val = nodes;
    mesh.elements.val = elements;
    if (mesh.nodeInputs) mesh.nodeInputs.val = { supports, loads } as any;

    // Element inputs
    const nFrames = elements.filter(e => e.length === 2).length;
    const ei: any = {
      elasticities, shearModuli, areas,
      momentsOfInertiaY: moiZ, momentsOfInertiaZ: moiY,
      torsionalConstants: torsion, sectionShapes, momentReleases, densities,
    };
    // Shell-specific: thicknesses & poissonsRatios for Q4 elements
    const thicknesses = new Map<number, number>();
    const poissonsRatios = new Map<number, number>();
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].length === 4) {
        thicknesses.set(i, tPanel);
        poissonsRatios.set(i, nu);
      }
    }
    ei.thicknesses = thicknesses;
    ei.poissonsRatios = poissonsRatios;
    if (mesh.elementInputs) mesh.elementInputs.val = ei;

    // Solve
    try {
      const t0 = performance.now();
      const dOut = deform(nodes, elements, { supports, loads } as any, ei);
      const dt = performance.now() - t0;
      if (dOut && mesh.deformOutputs) {
        mesh.deformOutputs.val = dOut;
        const aOut = analyze(nodes, elements, ei, dOut);
        if (mesh.analyzeOutputs) mesh.analyzeOutputs.val = aOut;

        let maxUz = 0, maxNode = -1;
        dOut.deformations.forEach((d: number[], ni: number) => {
          if (Math.abs(d[2]) > Math.abs(maxUz)) { maxUz = d[2]; maxNode = ni; }
        });
        console.log(`Pérgola: Uz_max=${maxUz.toExponential(4)} m en nodo ${maxNode} | ${nFrames} frames + ${elements.length - nFrames} shells | ${dt.toFixed(0)} ms`);
      }
    } catch (e: any) { console.warn("Pergola:", e.message); }

    const ctxP = getViewerCtx();
    if (ctxP) {
      ctxP.settings.shellResults.val = "displacementZ";
      ctxP.settings.deformedShape.val = true;
    }
    setTimeout(() => autoFitGridSize(), 50);
    updatePanel();
  }

  /** Solver Log panel — formatted with math notation */
  function showLogPanel() {
    document.getElementById("fem-log-panel")?.remove();
    const logLines: string[] = (window as any).__femLog || ["<i>No hay log. Ejecuta un analisis primero.</i>"];

    const div = document.createElement("div");
    div.id = "fem-log-panel";
    div.style.cssText = "position:fixed;top:60px;right:10px;width:360px;max-height:500px;overflow-y:auto;background:var(--cad-bg);color:var(--cad-text);border:1px solid var(--cad-border);border-radius:8px;padding:10px;z-index:10001;font-family:'Segoe UI',system-ui,sans-serif;font-size:12px;line-height:1.6;box-shadow:0 4px 20px var(--cad-shadow);";

    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span style="font-size:14px;font-weight:bold;color:var(--cad-heading)">📋 Solver Log</span>
        <button id="fem-log-close" style="background:var(--cad-btn-bg);color:var(--cad-btn-text);border:1px solid var(--cad-btn-border);border-radius:3px;padding:2px 8px;cursor:pointer;font-size:11px;">✕</button>
      </div>
      <div style="font-family:'Segoe UI',system-ui,sans-serif;font-size:12px;line-height:1.7;">
        ${logLines.join('<br>')}
      </div>
    `;
    document.body.appendChild(div);
    div.querySelector("#fem-log-close")?.addEventListener("click", () => div.remove());
  }

  /** Pushover ciclico panel — fiber section + hysteresis */
  function showPushoverPanel() {
    // Remove existing
    document.getElementById("pushover-panel")?.remove();

    const div = document.createElement("div");
    div.id = "pushover-panel";
    div.style.cssText = "position:fixed;top:60px;right:10px;width:420px;background:var(--cad-bg);color:var(--cad-text);border:1px solid var(--cad-border);border-radius:8px;padding:12px;z-index:10000;font-family:monospace;font-size:12px;box-shadow:0 4px 20px var(--cad-shadow);";
    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <b style="color:var(--cad-heading);font-size:14px;">Pushover Ciclico</b>
        <button id="pushover-close" style="background:var(--cad-btn-bg);color:var(--cad-btn-text);border:1px solid var(--cad-btn-border);border-radius:3px;padding:2px 8px;cursor:pointer;">X</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px;">
        <label>Col b (m): <input id="po-colB" type="number" value="0.30" step="0.05" min="0.15" max="0.60" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>Col h (m): <input id="po-colH" type="number" value="0.30" step="0.05" min="0.15" max="0.60" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>f'c (MPa): <input id="po-fc" type="number" value="30" step="5" min="15" max="60" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>Fy (MPa): <input id="po-fy" type="number" value="420" step="10" min="250" max="700" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>H col (m): <input id="po-H" type="number" value="1.30" step="0.1" min="0.5" max="4" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>L viga (m): <input id="po-L" type="number" value="2.00" step="0.1" min="1" max="6" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>As bar (cm2): <input id="po-As" type="number" value="2.0" step="0.5" min="0.5" max="8" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>N barras: <input id="po-nbar" type="number" value="3" step="1" min="2" max="8" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>Drift max (%): <input id="po-drift" type="number" value="5" step="0.5" min="1" max="10" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>N ciclos: <input id="po-ncycles" type="number" value="3" step="1" min="1" max="6" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
      </div>
      <button id="pushover-run" style="width:100%;padding:6px;background:var(--cad-heading);color:#000;border:none;border-radius:4px;cursor:pointer;font-weight:bold;font-size:13px;">RUN PUSHOVER</button>
      <div id="pushover-status" style="margin-top:6px;height:16px;font-size:11px;color:var(--cad-info);"></div>
      <canvas id="pushover-canvas" width="400" height="280" style="width:100%;margin-top:6px;background:#111;border:1px solid var(--cad-border);border-radius:4px;"></canvas>
    `;
    document.body.appendChild(div);

    div.querySelector("#pushover-close")?.addEventListener("click", () => div.remove());

    div.querySelector("#pushover-run")?.addEventListener("click", async () => {
      const get = (id: string) => parseFloat((div.querySelector(`#${id}`) as HTMLInputElement)?.value || "0");
      const colB = get("po-colB"), colH_s = get("po-colH");
      const fc = get("po-fc") * 1000; // MPa → kN/m2
      const fy = get("po-fy") * 1000; // MPa → kN/m2
      const H_col = get("po-H"), L_beam = get("po-L");
      const As_bar = get("po-As") * 1e-4; // cm2 → m2
      const n_bar = get("po-nbar");
      const driftMax = get("po-drift") / 100;
      const nCycles = get("po-ncycles");

      const status = div.querySelector("#pushover-status") as HTMLElement;
      status.textContent = "Generando historia de desplazamientos...";

      // Generate cyclic displacement history (increasing amplitude)
      const dispHistory: number[] = [];
      const maxDisp = driftMax * H_col;
      const stepsPerCycle = 40;
      for (let c = 1; c <= nCycles; c++) {
        const amp = maxDisp * c / nCycles;
        for (let i = 0; i <= stepsPerCycle; i++) {
          dispHistory.push(amp * Math.sin(2 * Math.PI * i / stepsPerCycle));
        }
      }

      status.textContent = `Resolviendo pushover (${dispHistory.length} pasos)...`;

      try {
        // Dynamic import to avoid loading WASM until needed
        const { cyclicPushover } = await import("hekatan-fem/src/cyclicPushoverCpp");

        const result = await cyclicPushover({
          colHeight: H_col,
          beamLength: L_beam,
          col: {
            b: colB, h: colH_s,
            fpc: -fc, Fy_rebar: fy, E_rebar: 200e6,
            rebar_area: As_bar, cover: 0.04, n_rebar: n_bar,
          },
          beam: {
            b: 0.25, h: 0.30,
            fpc: -fc, Fy_rebar: fy, E_rebar: 200e6,
            rebar_area: As_bar * 0.7, cover: 0.03, n_rebar: n_bar,
          },
          dispHistory,
        });

        status.textContent = `Completado: ${result.nSteps} pasos`;

        // Draw hysteresis on canvas
        drawHysteresis(div.querySelector("#pushover-canvas") as HTMLCanvasElement,
                       result.displacements, result.forces,
                       `Pushover: ${colB*100}x${colH_s*100}cm, f'c=${fc/1000}MPa, Fy=${fy/1000}MPa`);

      } catch (err: any) {
        status.textContent = `Error: ${err.message}`;
        console.error("Pushover failed:", err);
      }
    });
  }

  function drawHysteresis(canvas: HTMLCanvasElement, disps: number[], forces: number[], title: string) {
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d || disps.length === 0) return;

    const W = canvas.width, H = canvas.height;
    const margin = { left: 55, right: 15, top: 30, bottom: 35 };
    const pw = W - margin.left - margin.right;
    const ph = H - margin.top - margin.bottom;

    // Clear
    ctx2d.fillStyle = "#111118";
    ctx2d.fillRect(0, 0, W, H);

    // Ranges
    let dMin = Math.min(...disps), dMax = Math.max(...disps);
    let fMin = Math.min(...forces), fMax = Math.max(...forces);
    if (dMin === dMax) { dMin -= 0.01; dMax += 0.01; }
    if (fMin === fMax) { fMin -= 1; fMax += 1; }
    const dRange = dMax - dMin, fRange = fMax - fMin;

    const toX = (d: number) => margin.left + (d - dMin) / dRange * pw;
    const toY = (f: number) => margin.top + ph - (f - fMin) / fRange * ph;

    // Grid
    ctx2d.strokeStyle = "#333";
    ctx2d.lineWidth = 0.5;
    // Zero axes
    if (dMin < 0 && dMax > 0) {
      ctx2d.strokeStyle = "#555";
      ctx2d.beginPath();
      ctx2d.moveTo(toX(0), margin.top);
      ctx2d.lineTo(toX(0), margin.top + ph);
      ctx2d.stroke();
    }
    if (fMin < 0 && fMax > 0) {
      ctx2d.beginPath();
      ctx2d.moveTo(margin.left, toY(0));
      ctx2d.lineTo(margin.left + pw, toY(0));
      ctx2d.stroke();
    }

    // Hysteresis curve
    ctx2d.strokeStyle = "#ff4444";
    ctx2d.lineWidth = 1.5;
    ctx2d.beginPath();
    ctx2d.moveTo(toX(disps[0]), toY(forces[0]));
    for (let i = 1; i < disps.length; i++) {
      ctx2d.lineTo(toX(disps[i]), toY(forces[i]));
    }
    ctx2d.stroke();

    // Axes labels
    ctx2d.fillStyle = "#aaa";
    ctx2d.font = "11px monospace";
    ctx2d.textAlign = "center";
    ctx2d.fillText("Desplazamiento (m)", margin.left + pw / 2, H - 5);
    ctx2d.save();
    ctx2d.translate(12, margin.top + ph / 2);
    ctx2d.rotate(-Math.PI / 2);
    ctx2d.fillText("Fuerza (kN)", 0, 0);
    ctx2d.restore();

    // Title
    ctx2d.fillStyle = "#ee9b00";
    ctx2d.font = "bold 11px monospace";
    ctx2d.textAlign = "center";
    ctx2d.fillText(title, W / 2, 15);

    // Tick labels
    ctx2d.fillStyle = "#888";
    ctx2d.font = "9px monospace";
    ctx2d.textAlign = "center";
    const dTick = dRange / 5;
    for (let i = 0; i <= 5; i++) {
      const v = dMin + dTick * i;
      ctx2d.fillText((v * 1000).toFixed(1), toX(v), H - margin.bottom + 15);
    }
    ctx2d.textAlign = "right";
    const fTick = fRange / 5;
    for (let i = 0; i <= 5; i++) {
      const v = fMin + fTick * i;
      ctx2d.fillText(v.toFixed(0), margin.left - 5, toY(v) + 3);
    }
  }

  /** Nonlinear analysis panel */
  let nlPanel: HTMLDivElement | null = null;
  function showNonlinearPanel() {
    if (nlPanel) { nlPanel.remove(); nlPanel = null; return; }
    const div = document.createElement("div");
    div.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a1a2e;color:#eee;border:2px solid #ff6600;border-radius:8px;padding:16px;z-index:10001;width:400px;font-family:monospace;font-size:12px;box-shadow:0 4px 20px rgba(0,0,0,0.5);max-height:80vh;overflow-y:auto;";

    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <b style="color:#ff6600;font-size:14px;">🔥 Nonlinear Analysis</b>
        <button id="nl-close" style="background:none;border:none;color:#888;cursor:pointer;font-size:18px;">✕</button>
      </div>
      <div style="margin-bottom:12px;">
        <b style="color:#ffcc00;">Steel02 Material Test</b>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:6px;">
          <label>Fy (kN/m²):<input id="nl-fy" type="number" value="250000" style="width:80px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>E₀ (kN/m²):<input id="nl-e0" type="number" value="200000000" style="width:80px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>b (ratio):<input id="nl-b" type="number" value="0.01" step="0.005" style="width:80px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>R₀:<input id="nl-r0" type="number" value="15" style="width:80px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>Amp (strain):<input id="nl-amp" type="number" value="0.02" step="0.005" style="width:80px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>Ciclos:<input id="nl-cycles" type="number" value="3" min="1" max="10" style="width:80px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
        </div>
        <button id="nl-test" style="margin-top:8px;padding:6px 16px;background:#ff6600;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;width:100%;">▶ Run Steel02 Test</button>
      </div>
      <canvas id="nl-canvas" width="370" height="250" style="background:#0a0a1a;border:1px solid #333;border-radius:4px;width:100%;"></canvas>
      <div id="nl-info" style="margin-top:6px;color:#888;font-size:10px;"></div>
    `;

    document.body.appendChild(div);
    nlPanel = div;

    div.querySelector("#nl-close")!.addEventListener("click", () => { div.remove(); nlPanel = null; });
    div.querySelector("#nl-test")!.addEventListener("click", () => runSteel02Test(div));
  }

  function runSteel02Test(div: HTMLDivElement) {
    const Fy = parseFloat((div.querySelector("#nl-fy") as HTMLInputElement).value);
    const E0 = parseFloat((div.querySelector("#nl-e0") as HTMLInputElement).value);
    const b = parseFloat((div.querySelector("#nl-b") as HTMLInputElement).value);
    const R0 = parseFloat((div.querySelector("#nl-r0") as HTMLInputElement).value);
    const amp = parseFloat((div.querySelector("#nl-amp") as HTMLInputElement).value);
    const cycles = parseInt((div.querySelector("#nl-cycles") as HTMLInputElement).value);

    // Generate cyclic strain history
    const nPtsPerCycle = 100;
    const strainHistory: number[] = [];
    for (let c = 0; c < cycles; c++) {
      const a = amp * (1 + c * 0.5); // increasing amplitude
      for (let i = 0; i < nPtsPerCycle; i++) {
        const t = i / nPtsPerCycle * 2 * Math.PI;
        strainHistory.push(a * Math.sin(t));
      }
    }

    // Simple JS Steel02 implementation (mirrors the C++ one)
    const epsy = Fy / E0;
    const Esh = b * E0;
    let epsP = 0, sigP = 0, eP = E0;
    let epsminP = -epsy, epsmaxP = epsy, epsplP = 0;
    let epss0P = 0, sigs0P = 0, epssrP = 0, sigsrP = 0;
    let konP = 0;

    const stresses: number[] = [];

    for (const eps of strainHistory) {
      let epsmin = epsminP, epsmax = epsmaxP, epspl = epsplP;
      let epss0 = epss0P, sigs0 = sigs0P, epssr = epssrP, sigsr = sigsrP;
      let kon = konP;
      let sig: number, e: number;

      const deps = eps - epsP;
      if (Math.abs(deps) < 1e-20) { stresses.push(sigP); continue; }

      if (kon === 0 || kon === 3) {
        if (deps < 0) { kon = 2; epss0 = -epsy; sigs0 = -Fy; epspl = epss0; epssr = 0; sigsr = 0; }
        else { kon = 1; epss0 = epsy; sigs0 = Fy; epspl = epss0; epssr = 0; sigsr = 0; }
      }

      if (kon === 2 && deps > 0) {
        kon = 1; epssr = epsP; sigsr = sigP;
        if (epsP < epsmin) epsmin = epsP;
        const d1 = (epsmax - epsmin) / (2 * 1.0 * epsy);
        const shft = 1.0 + 0.0 * Math.pow(d1, 0.8);
        epss0 = (Fy * shft - Esh * epsy * shft - sigsr + E0 * epssr) / (E0 - Esh);
        sigs0 = Fy * shft + Esh * (epss0 - epsy * shft);
        epspl = epsmax;
      } else if (kon === 1 && deps < 0) {
        kon = 2; epssr = epsP; sigsr = sigP;
        if (epsP > epsmax) epsmax = epsP;
        const d1 = (epsmax - epsmin) / (2 * 1.0 * epsy);
        const shft = 1.0 + 0.0 * Math.pow(d1, 0.8);
        epss0 = (-Fy * shft + Esh * epsy * shft - sigsr + E0 * epssr) / (E0 - Esh);
        sigs0 = -Fy * shft + Esh * (epss0 + epsy * shft);
        epspl = epsmin;
      }

      const xi = Math.abs((epspl - epss0) / epsy);
      let R = R0 - (0.925 * xi) / (0.15 + xi);
      if (R < 0.1) R = 0.1;
      const epsrat = (eps - epssr) / (epss0 - epssr);
      const dum1 = 1 + Math.pow(Math.abs(epsrat), R);
      const dum2 = Math.pow(dum1, 1 / R);

      sig = b * epsrat + (1 - b) * epsrat / dum2;
      sig = sig * (sigs0 - sigsr) + sigsr;
      e = (b + (1 - b) / (dum1 * dum2)) * (sigs0 - sigsr) / (epss0 - epssr);

      stresses.push(sig);
      epsP = eps; sigP = sig; eP = e;
      epsminP = epsmin; epsmaxP = epsmax; epsplP = epspl;
      epss0P = epss0; sigs0P = sigs0; epssrP = epssr; sigsrP = sigsr;
      konP = kon;
    }

    // Draw hysteresis curve
    const cv = div.querySelector("#nl-canvas") as HTMLCanvasElement;
    const ctx = cv.getContext("2d")!;
    const w = cv.width, h = cv.height;
    ctx.clearRect(0, 0, w, h);

    // Find bounds
    const maxStrain = Math.max(...strainHistory.map(Math.abs));
    const maxStress = Math.max(...stresses.map(Math.abs));
    const sx = (w - 40) / (2 * maxStrain);
    const sy = (h - 40) / (2 * maxStress);
    const cx = w / 2, cy = h / 2;

    // Axes
    ctx.strokeStyle = "#444"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(w - 20, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 20); ctx.lineTo(cx, h - 20); ctx.stroke();

    // Labels
    ctx.fillStyle = "#888"; ctx.font = "10px monospace"; ctx.textAlign = "center";
    ctx.fillText("ε (strain)", w - 40, cy - 5);
    ctx.fillText("σ (stress)", cx + 30, 15);
    ctx.fillText(`±${(maxStrain * 100).toFixed(1)}%`, w - 30, cy + 12);
    ctx.fillText(`±${(maxStress / 1000).toFixed(0)} MPa`, cx + 40, 30);

    // Hysteresis curve
    ctx.strokeStyle = "#00ccff"; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < strainHistory.length; i++) {
      const px = cx + strainHistory[i] * sx;
      const py = cy - stresses[i] * sy;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Yield lines
    ctx.strokeStyle = "#ff333366"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(20, cy - Fy * sy); ctx.lineTo(w - 20, cy - Fy * sy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, cy + Fy * sy); ctx.lineTo(w - 20, cy + Fy * sy); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#ff6666"; ctx.font = "9px monospace";
    ctx.fillText(`Fy = ${(Fy/1000).toFixed(0)} MPa`, w - 50, cy - Fy * sy - 5);

    const info = div.querySelector("#nl-info") as HTMLElement;
    info.textContent = `Steel02: Fy=${(Fy/1000).toFixed(0)} MPa, E₀=${(E0/1e6).toFixed(0)} GPa, b=${b}, R₀=${R0} — ${cycles} ciclos, amp=${(amp*100).toFixed(1)}%`;
  }

  /** ═══════════════════════════════════════════════════════════
   *  Report Explained — Full FEM solver step-by-step for ALL elements
   *  ═══════════════════════════════════════════════════════════ */
  function showFemSolverReport() {
    const existing = document.querySelector(".rpt-overlay");
    if (existing) { existing.remove(); return; }

    const nodes_arr = mesh.nodes.val;
    const elements_arr = mesh.elements.val;
    const ei = mesh.elementInputs?.val || {};
    const ni = mesh.nodeInputs?.val || {};
    const dOut = mesh.deformOutputs?.val;
    const aOut = mesh.analyzeOutputs?.val;

    if (!nodes_arr.length || !elements_arr.length) {
      alert("No hay modelo cargado"); return;
    }

    // Use the academic-style report builder
    const reportDiv = buildReportExplained({
      nodes: nodes_arr,
      elements: elements_arr,
      nodeInputs: ni,
      elementInputs: ei,
      deformOutputs: dOut,
      analyzeOutputs: aOut,
    });
    document.body.appendChild(reportDiv);
    return;

    // (Detras de este `return` habia 242 lineas INALCANZABLES: la version
    //  anterior del informe, escrita a mano en HTML. La sustituyo
    //  `buildReportExplained` de arriba y se quedaron ahi. Borradas el
    //  18-sep-2026; estan en el historial de git.)
  }

  /** Render a matrix as compact HTML table */
  function femMatrixHTML(mat: number[][], size: number): string {
    const show = Math.min(size, 12);
    let h = `<div style="overflow-x:auto;margin:4px 0"><table class="fem-rpt-matrix">`;
    for (let i = 0; i < show; i++) {
      h += `<tr>`;
      for (let j = 0; j < show; j++) {
        const v = mat[i]?.[j] ?? 0;
        const z = Math.abs(v) < 1e-10;
        const diag = i === j;
        const bg = diag && !z ? "#0a2a4a" : "";
        const clr = z ? "#333" : diag ? "#00d4ff" : "#aaa";
        h += `<td style="color:${clr};${bg ? "background:"+bg+";" : ""}text-align:right;padding:1px 4px;font-size:9px;white-space:nowrap">${z ? "0" : fmtM(v)}</td>`;
      }
      h += `</tr>`;
    }
    h += `</table>`;
    if (size > show) h += `<div style="color:#555;font-size:9px">(mostrando ${show}×${show} de ${size}×${size})</div>`;
    h += `</div>`;
    return h;
  }

  function fmtM(v: number): string {
    if (Math.abs(v) >= 1e6) return v.toExponential(1);
    if (Math.abs(v) < 0.01 && v !== 0) return v.toExponential(1);
    if (Math.abs(v) >= 100) return v.toFixed(0);
    return v.toFixed(2);
  }

  /** Show section assignment panel for selected elements */
  let assignPanel: HTMLDivElement | null = null;
  function showAssignSectionPanel(elemIndices: number[]) {
    if (assignPanel) assignPanel.remove();

    const div = document.createElement("div");
    div.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a1a2e;color:#eee;border:2px solid #00ccff;border-radius:8px;padding:16px;z-index:10001;width:320px;font-family:monospace;font-size:12px;box-shadow:0 4px 20px rgba(0,0,0,0.5);";

    // Build profile options HTML
    const wOpts = getWProfileOptions();
    const hssOpts = getHSSProfileOptions();
    const wOptHTML = Object.entries(wOpts).map(([k,v]) => `<option value="${v}">${k}</option>`).join("");
    const hssOptHTML = Object.entries(hssOpts).map(([k,v]) => `<option value="${v}">${k}</option>`).join("");

    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <b style="color:#00ccff;">Asignar Sección (${elemIndices.length} elem.)</b>
        <button id="asgn-close" style="background:none;border:none;color:#888;cursor:pointer;font-size:18px;">✕</button>
      </div>
      <div style="margin-bottom:8px;">
        <label>Tipo:</label>
        <select id="asgn-type" style="background:#333;color:#fff;border:1px solid #555;padding:3px;width:100%;margin-top:2px;">
          <option value="rect">Rectangular (b×h)</option>
          <option value="circ">Circular (d)</option>
          <option value="W">Perfil W</option>
          <option value="HSS">Perfil HSS</option>
          <option value="I-param">I Paramétrica</option>
          <option value="tubular">Tubular Hueca</option>
          <option value="CFT">CFT (Tubo relleno concreto)</option>
        </select>
      </div>
      <div id="asgn-params" style="margin-bottom:10px;"></div>

      <div style="border-top:1px solid #444;padding-top:8px;margin-bottom:8px;">
        <b style="color:#ff6666;font-size:11px;">Frame Releases</b>
        <table style="width:100%;border-collapse:collapse;font-size:10px;margin-top:4px;">
          <tr>
            <td style="color:#888"></td>
            <td colspan="2" style="text-align:center;color:#ff6666;font-weight:bold;font-size:9px">Release</td>
            <td colspan="2" style="text-align:center;color:#00ccff;font-weight:bold;font-size:9px">Partial Fixity Springs</td>
          </tr>
          <tr>
            <td style="color:#888"></td>
            <td style="text-align:center;color:#aaa;font-size:9px">Start</td>
            <td style="text-align:center;color:#aaa;font-size:9px">End</td>
            <td style="text-align:center;color:#aaa;font-size:9px">Start</td>
            <td style="text-align:center;color:#aaa;font-size:9px">End</td>
          </tr>
          <tr><td style="color:#ccc">Axial Load</td><td style="text-align:center"><input type="checkbox" data-asgn-rel="0"></td><td style="text-align:center"><input type="checkbox" data-asgn-rel="6"></td><td><input type="number" data-asgn-spr="0" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td><td><input type="number" data-asgn-spr="6" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td></tr>
          <tr><td style="color:#ccc">Shear V2</td><td style="text-align:center"><input type="checkbox" data-asgn-rel="1"></td><td style="text-align:center"><input type="checkbox" data-asgn-rel="7"></td><td><input type="number" data-asgn-spr="1" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td><td><input type="number" data-asgn-spr="7" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td></tr>
          <tr><td style="color:#ccc">Shear V3</td><td style="text-align:center"><input type="checkbox" data-asgn-rel="2"></td><td style="text-align:center"><input type="checkbox" data-asgn-rel="8"></td><td><input type="number" data-asgn-spr="2" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td><td><input type="number" data-asgn-spr="8" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td></tr>
          <tr><td style="color:#ccc">Torsion</td><td style="text-align:center"><input type="checkbox" data-asgn-rel="3"></td><td style="text-align:center"><input type="checkbox" data-asgn-rel="9"></td><td><input type="number" data-asgn-spr="3" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td><td><input type="number" data-asgn-spr="9" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td></tr>
          <tr><td style="color:#ccc">Moment 22</td><td style="text-align:center"><input type="checkbox" data-asgn-rel="4"></td><td style="text-align:center"><input type="checkbox" data-asgn-rel="10"></td><td><input type="number" data-asgn-spr="4" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td><td><input type="number" data-asgn-spr="10" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td></tr>
          <tr><td style="color:#ccc">Moment 33</td><td style="text-align:center"><input type="checkbox" data-asgn-rel="5"></td><td style="text-align:center"><input type="checkbox" data-asgn-rel="11"></td><td><input type="number" data-asgn-spr="5" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td><td><input type="number" data-asgn-spr="11" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td></tr>
        </table>
        <div style="color:#888;font-size:9px;margin-top:2px;">Release = condensación estática (DOF libre). Spring = conexión semi-rígida.</div>
      </div>

      <div style="border-top:1px solid #444;padding-top:8px;margin-bottom:10px;">
        <b style="color:#33ff33;font-size:11px;">Property/Stiffness Modification Factors</b>
        <div style="margin-top:6px;font-size:11px;">
          <div style="display:grid;grid-template-columns:160px 60px;gap:2px 8px;align-items:center;">
            <span style="color:#aaa">Cross-section (axial) Area</span>
            <input id="asgn-mod-a" type="number" value="1.0" step="0.1" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
            <span style="color:#aaa">Shear Area dir 2 <span style="color:#666;font-size:9px">(Vy)</span></span>
            <input id="asgn-mod-as2" type="number" value="1.0" step="0.1" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
            <span style="color:#aaa">Shear Area dir 3 <span style="color:#666;font-size:9px">(Vz)</span></span>
            <input id="asgn-mod-as3" type="number" value="1.0" step="0.1" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
            <span style="color:#aaa">Torsional Constant</span>
            <input id="asgn-mod-j" type="number" value="1.0" step="0.1" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
            <span style="color:#aaa">Moment of Inertia 2</span>
            <input id="asgn-mod-i" type="number" value="1.0" step="0.05" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
            <span style="color:#aaa">Moment of Inertia 3</span>
            <input id="asgn-mod-i3" type="number" value="1.0" step="0.05" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
            <span style="color:#aaa">Mass</span>
            <input id="asgn-mod-mass" type="number" value="1.0" step="0.1" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
            <span style="color:#aaa">Weight</span>
            <input id="asgn-mod-weight" type="number" value="1.0" step="0.1" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
          </div>
        </div>
        <div style="color:#888;font-size:9px;margin-top:4px;line-height:1.4;">
          1.0 = sin cambio &nbsp;|&nbsp; 0.35 = seccion agrietada (ACI 318)<br>
          <span style="color:#ffaa00">Shear Area:</span> 1 = <b>Timoshenko</b> (incluye corte) &nbsp;|&nbsp; 0 = <b>Euler-Bernoulli</b> (ignora corte)
        </div>
      </div>

      <div style="display:flex;gap:8px;">
        <button id="asgn-apply" style="flex:1;padding:8px;background:#00aa66;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">✓ Aplicar</button>
        <button id="asgn-remove" style="flex:1;padding:8px;background:#996600;color:#fff;border:none;border-radius:4px;cursor:pointer;">↺ Quitar Override</button>
      </div>
    `;

    document.body.appendChild(div);
    assignPanel = div;

    const typeSelect = div.querySelector("#asgn-type") as HTMLSelectElement;
    const paramsDiv = div.querySelector("#asgn-params") as HTMLDivElement;

    function updateParams() {
      const t = typeSelect.value;
      let html = "";
      if (t === "rect") {
        html = `<div style="display:flex;gap:6px;"><label>b(m):<input id="ap-b" type="number" value="0.30" step="0.05" min="0.1" max="2" style="width:70px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
                <label>h(m):<input id="ap-h" type="number" value="0.50" step="0.05" min="0.1" max="2" style="width:70px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label></div>`;
      } else if (t === "circ") {
        html = `<label>d(m):<input id="ap-d" type="number" value="0.40" step="0.05" min="0.1" max="2" style="width:70px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>`;
      } else if (t === "W") {
        html = `<select id="ap-profile" style="background:#333;color:#fff;border:1px solid #555;padding:3px;width:100%;">${wOptHTML}</select>`;
      } else if (t === "HSS") {
        html = `<select id="ap-profile" style="background:#333;color:#fff;border:1px solid #555;padding:3px;width:100%;">${hssOptHTML}</select>`;
      } else if (t === "I-param") {
        html = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
          <label>bf(m):<input id="ap-bf" type="number" value="0.20" step="0.01" style="width:65px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>h(m):<input id="ap-hf" type="number" value="0.40" step="0.01" style="width:65px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>tf(m):<input id="ap-tf" type="number" value="0.015" step="0.001" style="width:65px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>tw(m):<input id="ap-tw" type="number" value="0.010" step="0.001" style="width:65px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
        </div>`;
      } else if (t === "tubular") {
        html = `<div style="display:flex;gap:6px;">
          <label>b(m):<input id="ap-bc" type="number" value="0.20" step="0.01" style="width:60px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>h(m):<input id="ap-hc" type="number" value="0.30" step="0.01" style="width:60px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>t(m):<input id="ap-t" type="number" value="0.008" step="0.001" style="width:60px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
        </div>`;
      }
      paramsDiv.innerHTML = html;
    }
    typeSelect.addEventListener("change", updateParams);
    updateParams();

    div.querySelector("#asgn-close")!.addEventListener("click", () => { div.remove(); assignPanel = null; });
    div.querySelector("#asgn-apply")!.addEventListener("click", () => {
      const t = typeSelect.value;
      const override: ElemOverride = { secType: t };
      if (t === "rect") {
        override.b = parseFloat((div.querySelector("#ap-b") as HTMLInputElement).value);
        override.h = parseFloat((div.querySelector("#ap-h") as HTMLInputElement).value);
        override.material = 0;
      } else if (t === "circ") {
        override.b = parseFloat((div.querySelector("#ap-d") as HTMLInputElement).value);
        override.material = 0;
      } else if (t === "W" || t === "HSS") {
        override.profileIdx = parseInt((div.querySelector("#ap-profile") as HTMLSelectElement).value);
        override.material = 1;
      } else if (t === "I-param") {
        override.bf = parseFloat((div.querySelector("#ap-bf") as HTMLInputElement).value);
        override.hf = parseFloat((div.querySelector("#ap-hf") as HTMLInputElement).value);
        override.tf = parseFloat((div.querySelector("#ap-tf") as HTMLInputElement).value);
        override.tw = parseFloat((div.querySelector("#ap-tw") as HTMLInputElement).value);
        override.material = 1;
      } else if (t === "tubular") {
        override.bc = parseFloat((div.querySelector("#ap-bc") as HTMLInputElement).value);
        override.hc = parseFloat((div.querySelector("#ap-hc") as HTMLInputElement).value);
        override.t = parseFloat((div.querySelector("#ap-t") as HTMLInputElement).value);
        override.material = 1;
      }
      // Releases (12 DOFs: FxI,FyI,FzI,TI,M2I,M3I, FxJ,FyJ,FzJ,TJ,M2J,M3J)
      const releases12: boolean[] = new Array(12).fill(false);
      const springs12: number[] = new Array(12).fill(0);
      div.querySelectorAll<HTMLInputElement>("input[data-asgn-rel]").forEach(cb => {
        releases12[parseInt(cb.dataset.asgnRel!)] = cb.checked;
      });
      div.querySelectorAll<HTMLInputElement>("input[data-asgn-spr]").forEach(inp => {
        const v = parseFloat(inp.value); if (v > 0) springs12[parseInt(inp.dataset.asgnSpr!)] = v;
      });
      override.releases12 = releases12;
      override.springs12 = springs12;
      // Legacy compat
      override.releaseRotStart = releases12[4] || releases12[5]; // M2I or M3I
      override.releaseRotEnd = releases12[10] || releases12[11]; // M2J or M3J
      override.releaseAxial = releases12[0]; // FxI
      override.releaseTorsion = releases12[3]; // TI
      // Modifiers
      override.modI = parseFloat((div.querySelector("#asgn-mod-i") as HTMLInputElement)?.value) || 1;
      override.modA = parseFloat((div.querySelector("#asgn-mod-a") as HTMLInputElement)?.value) || 1;
      override.modJ = parseFloat((div.querySelector("#asgn-mod-j") as HTMLInputElement)?.value) || 1;
      override.modAs2 = parseFloat((div.querySelector("#asgn-mod-as2") as HTMLInputElement)?.value) ?? 1;
      override.modAs3 = parseFloat((div.querySelector("#asgn-mod-as3") as HTMLInputElement)?.value) ?? 1;
      override.modI3 = parseFloat((div.querySelector("#asgn-mod-i3") as HTMLInputElement)?.value) || 1;
      override.modMass = parseFloat((div.querySelector("#asgn-mod-mass") as HTMLInputElement)?.value) || 1;
      override.modWeight = parseFloat((div.querySelector("#asgn-mod-weight") as HTMLInputElement)?.value) || 1;

      elemIndices.forEach(idx => elementOverrides.set(idx, { ...override }));
      div.remove(); assignPanel = null;
      setDefaultElementInputs();
      mesh.elementInputs!.val = { ...mesh.elementInputs!.val };
    });
    div.querySelector("#asgn-remove")!.addEventListener("click", () => {
      elemIndices.forEach(idx => elementOverrides.delete(idx));
      div.remove(); assignPanel = null;
      setDefaultElementInputs();
      mesh.elementInputs!.val = { ...mesh.elementInputs!.val };
    });
  }

  /** Show element edit panel (change section/material or delete) */
  let editPanel: HTMLDivElement | null = null;
  function showElementEditPanel(elemIdx: number) {
    if (editPanel) editPanel.remove();
    const nodes = mesh.nodes.val;
    const elem = mesh.elements.val[elemIdx];
    if (!elem || elem.length !== 2) return; // only frames

    const n1 = nodes[elem[0]], n2 = nodes[elem[1]];
    const dx = Math.abs(n2[0] - n1[0]), dy = Math.abs(n2[1] - n1[1]), dz = Math.abs(n2[2] - n1[2]);
    const isCol = dy > dx && dy > dz;
    const L = Math.sqrt(dx*dx + dy*dy + dz*dz);
    const floor = elementFloor.get(elemIdx) ?? 0;

    // Current section info
    const shape = mesh.elementInputs?.val?.sectionShapes?.get(elemIdx);
    const shapeName = shape?.name || (shape ? `${shape.type} ${((shape.b??0)*100).toFixed(0)}x${((shape.h??0)*100).toFixed(0)}` : "—");

    const div = document.createElement("div");
    div.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a1a2e;color:#eee;border:2px solid #ff9900;border-radius:8px;padding:16px;z-index:10000;min-width:280px;font-family:monospace;font-size:13px;box-shadow:0 4px 20px rgba(0,0,0,0.5);";

    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <b style="color:#ff9900;">Elemento ${elemIdx}</b>
        <button id="ep-close" style="background:none;border:none;color:#888;cursor:pointer;font-size:18px;">✕</button>
      </div>
      <div style="margin-bottom:8px;">
        <span style="color:#888;">Tipo:</span> ${isCol ? "Columna" : "Viga"} &nbsp;
        <span style="color:#888;">Piso:</span> ${floor + 1} &nbsp;
        <span style="color:#888;">L:</span> ${L.toFixed(3)} m
      </div>
      <div style="margin-bottom:8px;">
        <span style="color:#888;">Sección:</span> <span style="color:#00ccff;">${shapeName}</span>
      </div>
      <div style="margin-bottom:8px;">
        <span style="color:#888;">Nodos:</span> ${elem[0]} → ${elem[1]}
      </div>
      <hr style="border-color:#333;margin:12px 0;">
      <div style="display:flex;gap:8px;">
        <button id="ep-delete" style="flex:1;padding:8px;background:#cc3333;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">🗑 Eliminar</button>
        <button id="ep-inspect" style="flex:1;padding:8px;background:#336699;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">🔍 Inspect</button>
      </div>
    `;

    document.body.appendChild(div);
    editPanel = div;

    div.querySelector("#ep-close")!.addEventListener("click", () => { div.remove(); editPanel = null; cleanupInspect(); });
    div.querySelector("#ep-delete")!.addEventListener("click", () => {
      deletedElements.add(elemIdx);
      div.remove(); editPanel = null; cleanupInspect();
      regenerateFromParams();
    });
    div.querySelector("#ep-inspect")!.addEventListener("click", () => {
      div.remove(); editPanel = null;
      showInspectPanel(elemIdx);
    });
  }

  // Mouse events on the viewer canvas for inspect/select mode
  setTimeout(() => {
    const viewerEl = document.getElementById("viewer");
    if (!viewerEl) return;
    const canvas = viewerEl.querySelector("canvas");
    if (!canvas) return;

    // ── Window/Crossing selection state ──
    let dragStart: { x: number; y: number } | null = null;
    let selRect: HTMLDivElement | null = null;
    const DRAG_THRESHOLD = 5; // pixels to distinguish click from drag

    function projectToScreen(node: Node): { x: number; y: number } | null {
      const ctx = getViewerCtx();
      if (!ctx) return null;
      const cam = ctx.controls.object as THREE.Camera;
      const v = new THREE.Vector3(node[0], node[1], node[2]);
      v.project(cam);
      const rect = canvas!.getBoundingClientRect();
      return { x: (v.x + 1) / 2 * rect.width, y: (-v.y + 1) / 2 * rect.height };
    }

    function elementsInRect(x0: number, y0: number, x1: number, y1: number, windowMode: boolean): number[] {
      const left = Math.min(x0, x1), right = Math.max(x0, x1);
      const top = Math.min(y0, y1), bottom = Math.max(y0, y1);
      const nodes_a = mesh.nodes.val;
      const elems = mesh.elements.val;
      const result: number[] = [];

      for (let i = 0; i < elems.length; i++) {
        const elem = elems[i];
        const pts = elem.map(ni => projectToScreen(nodes_a[ni])).filter(Boolean) as { x: number; y: number }[];
        if (pts.length === 0) continue;

        if (windowMode) {
          // Window: ALL points must be inside
          const allInside = pts.every(p => p.x >= left && p.x <= right && p.y >= top && p.y <= bottom);
          if (allInside) result.push(i);
        } else {
          // Crossing: ANY point inside OR line crosses rect
          const anyInside = pts.some(p => p.x >= left && p.x <= right && p.y >= top && p.y <= bottom);
          if (anyInside) { result.push(i); continue; }
          // Check if element line segment crosses rectangle edges
          if (elem.length === 2) {
            const a = pts[0], b = pts[1];
            // Simple line-rect intersection check
            const crosses = lineIntersectsRect(a.x, a.y, b.x, b.y, left, top, right, bottom);
            if (crosses) result.push(i);
          }
        }
      }
      return result;
    }

    function lineIntersectsRect(x1: number, y1: number, x2: number, y2: number, l: number, t: number, r: number, b: number): boolean {
      // Cohen-Sutherland style check
      const inside = (x: number, y: number) => x >= l && x <= r && y >= t && y <= b;
      if (inside(x1, y1) || inside(x2, y2)) return true;
      // Check intersection with 4 edges
      const intersects = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number) => {
        const det = (bx-ax)*(dy-cy) - (by-ay)*(dx-cx);
        if (Math.abs(det) < 1e-10) return false;
        const t1 = ((cx-ax)*(dy-cy) - (cy-ay)*(dx-cx)) / det;
        const t2 = ((cx-ax)*(by-ay) - (cy-ay)*(bx-ax)) / det;
        return t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1;
      };
      return intersects(x1,y1,x2,y2, l,t,r,t) || intersects(x1,y1,x2,y2, r,t,r,b) ||
             intersects(x1,y1,x2,y2, l,b,r,b) || intersects(x1,y1,x2,y2, l,t,l,b);
    }

    canvas.addEventListener("mousedown", (ev) => {
      if (!selectMode) return;
      dragStart = { x: ev.offsetX, y: ev.offsetY };
    });

    canvas.addEventListener("mousemove", (ev) => {
      // Draw mode: snap preview + tracking
      if (drawMode) {
        const ctx = getViewerCtx();
        if (!ctx) return;
        const snap = findSnap(ev.clientX, ev.clientY, ctx.camera, ctx.rendererElm);

        // Show tracking lines when hovering on a node
        if (drawSnaps.track && snap.snapType === "node" && snap.nodeIdx !== null && snap.nodeIdx !== trackBaseNode) {
          showTrackingLines(snap.nodeIdx);
        }

        // Try to snap to tracking axis if tracking is active
        if (drawSnaps.track && trackBaseNode !== null && snap.worldPos && snap.snapType !== "node") {
          const axisSnap = snapToTrackAxis(snap.worldPos, trackBaseNode);
          if (axisSnap) {
            snap.worldPos = axisSnap;
            snap.snapType = "grid"; // reuse color
          }
        }

        // Update distance label
        if (trackBaseNode !== null && snap.worldPos) {
          const baseN = mesh.nodes.val[trackBaseNode];
          if (baseN) {
            updateTrackLabel(ev.clientX, ev.clientY, new THREE.Vector3(...baseN), snap.worldPos);
          }
        } else if (drawStartNode !== null && snap.worldPos) {
          const startN = mesh.nodes.val[drawStartNode];
          if (startN) {
            updateTrackLabel(ev.clientX, ev.clientY, new THREE.Vector3(...startN), snap.worldPos);
          }
        } else {
          if (trackLabel) { trackLabel.remove(); trackLabel = null; }
        }

        drawHoverNode = snap.nodeIdx;
        updateDrawPreview(snap);
        canvas.style.cursor = snap.snapType !== "free" ? "pointer" : "crosshair";
        return;
      }

      if (!inspectMode && !selectMode) return;

      // Drag rectangle for window/crossing selection
      if (selectMode && dragStart) {
        const dx = ev.offsetX - dragStart.x, dy = ev.offsetY - dragStart.y;
        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
          if (!selRect) {
            selRect = document.createElement("div");
            selRect.style.cssText = "position:absolute;pointer-events:none;z-index:9999;";
            canvas.parentElement!.style.position = "relative";
            canvas.parentElement!.appendChild(selRect);
          }
          const isWindow = dx > 0; // left→right = window, right→left = crossing
          const left = Math.min(dragStart.x, ev.offsetX);
          const top = Math.min(dragStart.y, ev.offsetY);
          const w = Math.abs(dx), h = Math.abs(dy);
          selRect.style.left = left + "px";
          selRect.style.top = top + "px";
          selRect.style.width = w + "px";
          selRect.style.height = h + "px";
          selRect.style.border = isWindow ? "2px solid #3399ff" : "2px dashed #33ff33";
          selRect.style.background = isWindow ? "rgba(51,153,255,0.1)" : "rgba(51,255,51,0.1)";
          canvas.style.cursor = "crosshair";
          return;
        }
      }

      // Hover highlight
      const idx = pickElement(ev);
      if (idx >= 0) {
        highlightElement(idx);
        canvas.style.cursor = "pointer";
      } else {
        if (highlightObj) {
          const ctx = getViewerCtx();
          ctx?.scene.remove(highlightObj);
          highlightObj = null;
          ctx?.render();
        }
        canvas.style.cursor = selectMode ? "crosshair" : "";
      }
    });

    canvas.addEventListener("mouseup", (ev) => {
      if (selectMode && dragStart) {
        const dx = ev.offsetX - dragStart.x, dy = ev.offsetY - dragStart.y;
        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
          // Window/Crossing selection complete
          const isWindow = dx > 0;
          const hits = elementsInRect(dragStart.x, dragStart.y, ev.offsetX, ev.offsetY, isWindow);
          const ctrlKey = ev.ctrlKey || ev.metaKey;
          if (!ctrlKey) { selectedElements.clear(); clearSelectionHighlights(); }
          hits.forEach(idx => {
            if (!selectedElements.has(idx)) {
              selectedElements.add(idx);
              addSelectionHighlight(idx);
            }
          });
          updateSelectToolbar();
        }
        // Cleanup rect
        if (selRect) { selRect.remove(); selRect = null; }
        dragStart = null;
        canvas.style.cursor = "crosshair";
        return;
      }
      dragStart = null;
    });

    canvas.addEventListener("click", (ev) => {
      // Draw mode: click to start/end element
      if (drawMode) {
        const ctx = getViewerCtx();
        if (!ctx) return;
        const snap = findSnap(ev.clientX, ev.clientY, ctx.camera, ctx.rendererElm);
        if (snap.worldPos || snap.nodeIdx !== null) {
          drawClickHandler(snap);
          updateDrawPreview(snap);
        }
        return;
      }

      if (selectMode) {
        // Only handle if it wasn't a drag
        if (selRect) return; // was drag, handled by mouseup
        const idx = pickElement(ev);
        const ctrlKey = ev.ctrlKey || ev.metaKey;
        if (idx >= 0) {
          if (ctrlKey) {
            if (selectedElements.has(idx)) {
              selectedElements.delete(idx);
              const hlIdx = selectionHighlights.findIndex(h => (h as any).__elemIdx === idx);
              if (hlIdx >= 0) {
                const vCtx = getViewerCtx();
                vCtx?.scene.remove(selectionHighlights[hlIdx]);
                selectionHighlights[hlIdx].geometry.dispose();
                (selectionHighlights[hlIdx].material as THREE.Material).dispose();
                selectionHighlights.splice(hlIdx, 1);
                vCtx?.render();
              }
            } else {
              selectedElements.add(idx);
              addSelectionHighlight(idx);
            }
          } else {
            selectedElements.clear();
            clearSelectionHighlights();
            selectedElements.add(idx);
            addSelectionHighlight(idx);
          }
          updateSelectToolbar();
        } else if (!ctrlKey) {
          selectedElements.clear();
          clearSelectionHighlights();
          updateSelectToolbar();
        }
        return;
      }
      if (inspectMode) {
        const idx = pickElement(ev);
        if (idx >= 0) {
          highlightElement(idx);
          showElementEditPanel(idx);
        }
      }
    });
  }, 500);

  // ── BUGFIX zombie derive: guard ANTES de leer `.val`. Sin esto, cada vez
  // que se cargaba un ejemplo nuevo (que escribe a mesh.nodes/elements), TODOS
  // los getCad3d zombies de ejemplos previos se despertaban y rebuildeaban un
  // panel ya disposed. ──
  const cad3dVer = activeExampleVersion.v;
  van.derive(() => {
    if (activeExampleVersion.v !== cad3dVer) return;
    mesh.nodes.val; mesh.elements.val; mesh.nodeInputs?.val;
    updatePanel();
  });

  // CLI modal commands
  (cli as any).modal = (enable?: boolean) => {
    if (enable === undefined) enable = !modalEnabled;
    modalEnabled = enable;
    const btn = panel.querySelector("#cad3d-modal") as HTMLElement;
    btn?.classList.toggle("active", modalEnabled);
    if (modalEnabled) {
      // Hide loads via settings (checkbox unchecks reactively)
      const ctx = getViewerCtx();
      if (ctx?.settings?.loads) {
        modalLoadsWasVisible = ctx.settings.loads.rawVal;
        ctx.settings.loads.val = false;
      }
      runModalAnalysis();
      (panel.querySelector("#cad3d-mode-prev") as HTMLElement).style.display = "";
      (panel.querySelector("#cad3d-mode-next") as HTMLElement).style.display = "";
      (panel.querySelector("#cad3d-mode-label") as HTMLElement).style.display = "";
    } else {
      stopModalAnimation();
      (panel.querySelector("#cad3d-mode-prev") as HTMLElement).style.display = "none";
      (panel.querySelector("#cad3d-mode-next") as HTMLElement).style.display = "none";
      (panel.querySelector("#cad3d-mode-label") as HTMLElement).style.display = "none";
      // Restore loads
      if (activeGenerator && activeGenerator !== "placa-q4" && activeGenerator !== "placa-3q") {
        regenerateFromParams();
      }
      setTimeout(() => {
        const ctx = getViewerCtx();
        if (ctx?.settings?.loads && modalLoadsWasVisible) {
          ctx.settings.loads.val = true;
        }
      }, 600);
    }
    console.log(`Modal analysis: ${modalEnabled ? 'ON' : 'OFF'}`);
  };
  (cli as any).setMode = (m: number) => {
    if (!modalResults?.modeShapes) { console.error("No modal results"); return; }
    modalMode = Math.max(0, Math.min(m, modalResults.modeShapes.length - 1));
    const shape = modalResults.modeShapes[modalMode];
    const { extent } = getModelBounds();
    let maxDisp = 0;
    for (let i = 0; i < modalOriginalNodes.length; i++) {
      const dx = shape[i * 6] || 0, dy = shape[i * 6 + 1] || 0, dz = shape[i * 6 + 2] || 0;
      maxDisp = Math.max(maxDisp, Math.sqrt(dx * dx + dy * dy + dz * dz));
    }
    modalScale = maxDisp > 1e-12 ? (extent * 0.05) / maxDisp : 1;
    startModalAnimation();
    const label = panel.querySelector("#cad3d-mode-label") as HTMLElement;
    if (label && modalResults.frequencies) label.textContent = `Modo ${modalMode + 1} — ${modalResults.frequencies[modalMode].toFixed(2)} Hz`;
    console.log(`Modo ${modalMode + 1}: f = ${modalResults.frequencies?.[modalMode].toFixed(4)} Hz`);
  };

  (window as any).cad = cli;
  console.log("FEM Studio CLI ready. Type cad.help() for commands.");

  setTimeout(() => { document.body.appendChild(panel); document.body.appendChild(modalPanel.div); }, 0);

  // Auto-start: generate default edificio so grid axes are visible on load
  setTimeout(() => {
    if (mesh.nodes.val.length === 0) {
      setGenerator("muro-q4");
      generateShearWallQ4();
      highlightExButton("muro-q4");
      setTimeout(() => { if (activeGenerator === "muro-q4") rebuildTweakpane(); }, 200);
    }
  }, 100);

  // Add mobile hamburger menu button
  const mobileMenuBtn = document.createElement("button");
  mobileMenuBtn.id = "mobile-menu-btn";
  mobileMenuBtn.innerHTML = "☰";
  mobileMenuBtn.addEventListener("click", () => {
    const p = document.getElementById("cad3d-panel");
    if (p) {
      p.classList.toggle("mobile-open");
      mobileMenuBtn.innerHTML = p.classList.contains("mobile-open") ? "✕" : "☰";
    }
  });
  document.body.appendChild(mobileMenuBtn);

  // Add fullscreen button (to the left of help)
  const fsBtn = document.createElement("button");
  fsBtn.id = "fullscreen-btn";
  fsBtn.innerHTML = "⛶";
  fsBtn.title = "Pantalla completa";
  fsBtn.style.cssText = `
    position: fixed; bottom: 20px; right: 78px; z-index: 9999999;
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, #333, #555);
    color: white; border: 3px solid rgba(255,255,255,0.2);
    font-size: 22px; cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex; align-items: center; justify-content: center;
  `;
  fsBtn.addEventListener("mouseenter", () => { fsBtn.style.transform = "scale(1.15)"; });
  fsBtn.addEventListener("mouseleave", () => { fsBtn.style.transform = "scale(1)"; });
  fsBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });
  document.body.appendChild(fsBtn);

  // Add help tour button
  document.body.appendChild(createHelpButton());

  // ── Language toggle button (Es/En) ──
  const langBtn = document.createElement("button");
  langBtn.id = "lang-toggle-btn";
  langBtn.textContent = currentLang() === "es" ? "EN" : "ES";
  langBtn.title = currentLang() === "es" ? "Switch to English" : "Cambiar a Español";
  langBtn.style.cssText = `
    position: fixed; bottom: 20px; right: 136px; z-index: 9999999;
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, #1a4a7a, #2a6ab0);
    color: white; border: 3px solid rgba(255,255,255,0.2);
    font-size: 14px; font-weight: bold; cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex; align-items: center; justify-content: center;
  `;
  langBtn.addEventListener("mouseenter", () => { langBtn.style.transform = "scale(1.15)"; });
  langBtn.addEventListener("mouseleave", () => { langBtn.style.transform = "scale(1)"; });
  langBtn.addEventListener("click", () => {
    const newLang = currentLang() === "es" ? "en" : "es";
    setLang(newLang);
    langBtn.textContent = newLang === "es" ? "EN" : "ES";
    langBtn.title = newLang === "es" ? "Switch to English" : "Cambiar a Español";
    updateDomTranslations();
  });
  document.body.appendChild(langBtn);

  // ── Auto-load example from ?t= URL parameter ──
  const urlT = new URLSearchParams(window.location.search).get("t");
  if (urlT) {
    setTimeout(() => {
      highlightExButton(urlT);
      cli.example(urlT);
    }, 300);
  }

  const placeholder = document.createElement("span");
  placeholder.style.display = "none";
  return placeholder;
}
