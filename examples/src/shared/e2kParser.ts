/**
 * ETABS .e2k File Parser
 * Converts ETABS text model files into awatif mesh data.
 *
 * Supported sections:
 *   CONTROLS (units), STORIES, MATERIAL PROPERTIES, FRAME SECTIONS,
 *   POINT COORDINATES, LINE CONNECTIVITIES, AREA CONNECTIVITIES,
 *   POINT ASSIGNS (restraints), LINE ASSIGNS (section assignment),
 *   FRAME OBJECT LOADS
 */
import type { Node, Element, NodeInputs, ElementInputs, SectionShape } from "hekatan-fem";

export interface E2kGrid {
  label: string;   // "A", "B", "1", "2", etc.
  dir: "X" | "Y";
  coord: number;
}

export interface E2kModel {
  units: { force: string; length: string };
  stories: { name: string; height: number; elev: number }[];
  grids: E2kGrid[];
  materials: Map<string, { type: string; E: number; G: number; nu: number; fy?: number; fc?: number; density?: number }>;
  frameSections: Map<string, { material: string; shape: string; D: number; B: number; TF: number; TW: number; R?: number; fillMaterial?: string; modI2?: number; modI3?: number }>;
  nodes: Node[];
  nodeNames: string[];           // e2k point name → index in nodes[]
  nodeNameToIdx: Map<string, number>;
  elements: Element[];
  elementNames: string[];
  elementTypes: string[];        // "COLUMN" | "BEAM" | "BRACE"
  elementStories: string[];
  elementSections: Map<number, string>;  // elemIdx → section name
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  /** Resortes Winkler (cimentación): {node, dof 0-5, k en kN/m} para pasar a deform() */
  springsList: { node: number; dof: number; k: number }[];
  sectionShapes: Map<number, SectionShape>;
  info: { nNodes: number; nFrames: number; nAreas: number; title: string };
  /** Raw text blocks from original e2k for round-trip export */
  rawSections?: Map<string, string[]>;
  /** Cabecera original ("$ ...") de cada seccion, verbatim, para round-trip exacto */
  rawSectionHeaders?: Map<string, string>;
}

export function parseE2k(text: string): E2kModel {
  const lines = text.split(/\r?\n/);

  // State
  const units = { force: "TONF", length: "M" };
  const stories: E2kModel["stories"] = [];
  const materials: E2kModel["materials"] = new Map();
  const frameSections: E2kModel["frameSections"] = new Map();
  const pointCoords = new Map<string, [number, number]>(); // name → [x, y] (plan coords)
  const lineConns: { name: string; type: string; pt1: string; pt2: string; nStories: number }[] = [];
  const areaConns: { name: string; pts: string[]; nStories: number; storyOffsets?: number[] }[] = [];
  const restraints = new Map<string, string[]>(); // pointName+story → restrained DOFs
  const lineAssigns = new Map<string, { story: string; section: string; rigidZone: number; releases: string[]; angle: number }>(); // lineName+story → assignment
  const frameLoads: { line: string; story: string; type: string; dir: string; lc: string; val: number }[] = [];
  // areaName+story → assignment (section name, modelingType, cardinal point)
  const areaAssigns = new Map<string, { story: string; section: string; modelingType: string; cardinalPoint: string }>();
  // SHELL/SLAB section: name → properties
  const shellSections = new Map<string, { material: string; modelingType: string; thickness: number }>();
  // SHELL OBJECT LOADS: q uniforme por (area, story, loadcase)
  const shellLoads: { area: string; story: string; type: string; dir: string; lc: string; val: number }[] = [];
  // SHELL UNIFORM LOAD SETS: setName → array of {loadpat, value}
  const shellLoadSets = new Map<string, { loadpat: string; value: number }[]>();
  // ── RESORTES WINKLER (cimentación sobre suelo) ──
  // AREA SPRING: nombre → rigidez por unidad de área (subgrade modulus) en U1/U2/U3.
  const areaSprings = new Map<string, { u1: number; u2: number; u3: number }>();
  // POINT SPRING: nombre → rigidez de resorte puntual en UX/UY/UZ.
  const pointSprings = new Map<string, { ux: number; uy: number; uz: number }>();
  // asignación área→spring: "area@story" → nombre de spring (de AREAASSIGN ... SPRINGPROP)
  const areaSpringAssign = new Map<string, string>();
  // asignación punto→spring: "point@story" → nombre (de POINTASSIGN ... SPRINGPROP)
  const pointSpringAssign = new Map<string, string>();
  const grids: E2kGrid[] = [];
  let title = "";

  let currentSection = "";

  // Capture raw lines for sections we can't reconstruct perfectly
  const rawSections = new Map<string, string[]>();
  // Cabecera ORIGINAL ($ ...) de cada seccion, verbatim, para round-trip exacto
  // (preserva espacios finales y mayusculas tal cual ETABS las escribio).
  const rawSectionHeaders = new Map<string, string>();
  const capturedSectionNames = [
    "PROGRAM INFORMATION", "CONTROLS", "STORIES - IN SEQUENCE FROM TOP",
    "GRIDS", "DIAPHRAGM NAMES", "MATERIAL PROPERTIES", "REBAR DEFINITIONS",
    "FRAME SECTIONS", "AUTO SELECT SECTION LISTS", "CONCRETE SECTIONS",
    "WALL/SLAB/DECK SECTIONS", "POINT COORDINATES",
    "LINE CONNECTIVITIES", "AREA CONNECTIVITIES",
    "POINT ASSIGNS", "LINE ASSIGNS", "AREA ASSIGNS",
    "LOAD PATTERNS", "POINT OBJECT LOADS", "FRAME OBJECT LOADS",
    "SHELL OBJECT LOADS", "ANALYSIS OPTIONS", "MASS SOURCE",
    "FUNCTIONS", "LOAD CASES", "LOAD COMBINATIONS",
  ];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("$ ")) {
      // Nueva seccion: registrar la clave y la cabecera AUNQUE quede vacia.
      currentSection = line.substring(2).trim();
      if (!rawSections.has(currentSection)) rawSections.set(currentSection, []);
      if (!rawSectionHeaders.has(currentSection)) rawSectionHeaders.set(currentSection, rawLine);
      continue;
    }
    // Capturar TODA otra linea (contenido, blancos, y comentarios "$"/"$$" sin
    // nombre de seccion) para el round-trip exacto.
    if (currentSection) {
      if (!rawSections.has(currentSection)) rawSections.set(currentSection, []);
      rawSections.get(currentSection)!.push(rawLine);
    }
    if (!line || line.startsWith("$")) continue;   // blancos/comentarios: no se parsean

    // ── CONTROLS ──
    if (currentSection === "CONTROLS") {
      const um = line.match(/UNITS\s+"([^"]+)"\s+"([^"]+)"/);
      if (um) { units.force = um[1]; units.length = um[2]; }
      const tm = line.match(/TITLE2\s+"([^"]+)"/);
      if (tm) title = tm[1];
    }

    // ── STORIES ──
    if (currentSection === "STORIES - IN SEQUENCE FROM TOP") {
      const sm = line.match(/STORY\s+"([^"]+)"\s+(?:HEIGHT\s+([\d.]+)|ELEV\s+([-\d.]+))/);
      if (sm) {
        const name = sm[1];
        const height = sm[2] ? parseFloat(sm[2]) : 0;
        const elev = sm[3] ? parseFloat(sm[3]) : undefined;
        stories.push({ name, height, elev: elev ?? 0 });
      }
    }

    // ── MATERIAL PROPERTIES ──
    if (currentSection === "MATERIAL PROPERTIES") {
      const mm = line.match(/MATERIAL\s+"([^"]+)"\s+(?:TYPE\s+"([^"]+)")?/);
      if (mm) {
        const name = mm[1];
        if (!materials.has(name)) materials.set(name, { type: mm[2] || "", E: 0, G: 0, nu: 0 });
        const mat = materials.get(name)!;
        if (mm[2]) mat.type = mm[2];
        const eMatch = line.match(/\bE\s+([\d.eE+-]+)/);
        if (eMatch) mat.E = parseFloat(eMatch[1]);
        const uMatch = line.match(/\bU\s+([\d.eE+-]+)/);
        if (uMatch) { mat.nu = parseFloat(uMatch[1]); mat.G = mat.E / (2 * (1 + mat.nu)); }
        const fyMatch = line.match(/\bFY\s+([\d.eE+-]+)/);
        if (fyMatch) mat.fy = parseFloat(fyMatch[1]);
        const fcMatch = line.match(/\bFC\s+([\d.eE+-]+)/);
        if (fcMatch) mat.fc = parseFloat(fcMatch[1]);
        const wMatch = line.match(/WEIGHTPERVOLUME\s+([\d.eE+-]+)/);
        if (wMatch) mat.density = parseFloat(wMatch[1]);
      }
    }

    // ── FRAME SECTIONS ──
    if (currentSection === "FRAME SECTIONS") {
      const fsm = line.match(/FRAMESECTION\s+"([^"]+)"/);
      if (fsm) {
        const name = fsm[1];
        if (!frameSections.has(name)) frameSections.set(name, { material: "", shape: "", D: 0, B: 0, TF: 0, TW: 0 });
        const sec = frameSections.get(name)!;
        const matM = line.match(/MATERIAL\s+"([^"]+)"/);
        if (matM) sec.material = matM[1];
        const shM = line.match(/SHAPE\s+"([^"]+)"/);
        if (shM) sec.shape = shM[1];
        const dM = line.match(/\bD\s+([\d.eE+-]+)/);
        if (dM) sec.D = parseFloat(dM[1]);
        const bM = line.match(/\bB\s+([\d.eE+-]+)/);
        if (bM) sec.B = parseFloat(bM[1]);
        const tfM = line.match(/\bTF\s+([\d.eE+-]+)/);
        if (tfM) sec.TF = parseFloat(tfM[1]);
        const twM = line.match(/\bTW\s+([\d.eE+-]+)/);
        if (twM) sec.TW = parseFloat(twM[1]);
        const rM = line.match(/\bR\s+([\d.eE+-]+)/);
        if (rM) sec.R = parseFloat(rM[1]);
        const fillM = line.match(/FILLMATERIAL\s+"([^"]+)"/);
        if (fillM) sec.fillMaterial = fillM[1];
        const i2M = line.match(/I2MOD\s+([\d.eE+-]+)/);
        if (i2M) sec.modI2 = parseFloat(i2M[1]);
        const i3M = line.match(/I3MOD\s+([\d.eE+-]+)/);
        if (i3M) sec.modI3 = parseFloat(i3M[1]);
      }
    }

    // ── POINT COORDINATES ──
    if (currentSection === "POINT COORDINATES") {
      const pm = line.match(/POINT\s+"([^"]+)"\s+([-\d.eE+]+)\s+([-\d.eE+]+)/);
      if (pm) pointCoords.set(pm[1], [parseFloat(pm[2]), parseFloat(pm[3])]);
    }

    // ── LINE CONNECTIVITIES ──
    if (currentSection === "LINE CONNECTIVITIES") {
      const lm = line.match(/LINE\s+"([^"]+)"\s+(COLUMN|BEAM|BRACE)\s+"([^"]+)"\s+"([^"]+)"\s+(\d+)/);
      if (lm) lineConns.push({ name: lm[1], type: lm[2], pt1: lm[3], pt2: lm[4], nStories: parseInt(lm[5]) });
    }

    // ── POINT ASSIGNS ──
    if (currentSection === "POINT ASSIGNS") {
      const rm = line.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)".*RESTRAINT\s+"([^"]+)"/);
      if (rm) restraints.set(`${rm[1]}@${rm[2]}`, rm[3].split(/\s+/));
    }

    // ── LINE ASSIGNS ──
    if (currentSection === "LINE ASSIGNS") {
      const lam = line.match(/LINEASSIGN\s+"([^"]+)"\s+"([^"]+)".*SECTION\s+"([^"]+)"/);
      if (lam) {
        const entry: typeof lineAssigns extends Map<string, infer V> ? V : never = {
          story: lam[2], section: lam[3], rigidZone: 0, releases: [], angle: 0,
        };
        const rzm = line.match(/RIGIDZONE\s+([\d.eE+-]+)/);
        if (rzm) entry.rigidZone = parseFloat(rzm[1]);
        const relm = line.match(/RELEASE\s+"([^"]+)"/);
        if (relm) entry.releases = relm[1].split(/\s+/);
        const angm = line.match(/ANG\s+([-\d.eE+]+)/);
        if (angm) entry.angle = parseFloat(angm[1]);
        lineAssigns.set(`${lam[1]}@${lam[2]}`, entry);
      }
    }

    // ── GRIDS ──
    if (currentSection === "GRIDS") {
      const gm = line.match(/^\s*GRID\s+"[^"]+"\s+LABEL\s+"([^"]+)"\s+DIR\s+"([XY])"\s+COORD\s+([-\d.eE+]+)/);
      if (gm) {
        grids.push({ label: gm[1], dir: gm[2] as "X" | "Y", coord: parseFloat(gm[3]) });
      }
    }

    // ── FRAME OBJECT LOADS ──
    if (currentSection === "FRAME OBJECT LOADS") {
      const flm = line.match(/LINELOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"([^"]+)"\s+DIR\s+"([^"]+)"\s+LC\s+"([^"]+)"\s+FVAL\s+([-\d.eE+]+)/);
      if (flm) {
        frameLoads.push({
          line: flm[1], story: flm[2], type: flm[3], dir: flm[4],
          lc: flm[5], val: parseFloat(flm[6]),
        });
      }
    }

    // ── AREA CONNECTIVITIES ──
    // Formato real ETABS: AREA "F1"  FLOOR  4  "2"  "3"  "4"  "1"  0  0  0  0
    // El keyword "FLOOR"/"WALL"/"RAMP" puede estar entre name y el conteo.
    if (currentSection === "AREA CONNECTIVITIES") {
      const am = line.match(/AREA\s+"([^"]+)"\s+(?:FLOOR|WALL|RAMP|PANEL)?\s*\d+\s+(.+)/);
      if (am) {
        const pts = am[2].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, "")) || [];
        // Enteros tras los puntos = offset de story por esquina (0=story asignada,
        // 1=una story abajo). FLOOR: "0 0 0 0" (plano). PANEL/muro: ej "1 1 0 0" (vertical).
        const storyOffsets = (am[2].replace(/"[^"]*"/g, " ").trim().match(/-?\d+/g) || []).map(Number);
        areaConns.push({ name: am[1], pts, nStories: 0, storyOffsets });
      }
    }

    // ── SLAB / WALL / DECK PROPERTIES ──
    // Headers reales: "SLAB PROPERTIES", "WALL PROPERTIES", "DECK PROPERTIES",
    // o el legacy combinado "WALL/SLAB/DECK SECTIONS".
    if (currentSection === "WALL/SLAB/DECK SECTIONS" ||
        currentSection === "SLAB PROPERTIES" ||
        currentSection === "WALL PROPERTIES" ||
        currentSection === "DECK PROPERTIES") {
      const sm = line.match(/SHELLPROP\s+"([^"]+)"\s+(.+)/);
      if (sm) {
        const name = sm[1];
        const tStr = sm[2].match(/SLABTHICKNESS\s+([\d.eE+-]+)/)?.[1];
        const wStr = sm[2].match(/WALLTHICKNESS\s+([\d.eE+-]+)/)?.[1];
        const mat = sm[2].match(/MATERIAL\s+"([^"]+)"/)?.[1];
        const mtype = sm[2].match(/MODELINGTYPE\s+"([^"]+)"/)?.[1];
        if (tStr || wStr) {
          const existing = shellSections.get(name) || { material: "", modelingType: "ShellThin", thickness: 0 };
          shellSections.set(name, {
            material: mat ?? existing.material,
            modelingType: mtype ?? existing.modelingType,
            thickness: parseFloat(tStr ?? wStr ?? "0"),
          });
        }
      }
    }

    // ── AREA ASSIGNS ──
    // AREAASSIGN "F1" "Story1" SECTION "Slab1" CARDINALPOINT "TOP" TRANSFORMSTIFFNESSFOROFFSETS "No"
    if (currentSection === "AREA ASSIGNS") {
      const aa = line.match(/AREAASSIGN\s+"([^"]+)"\s+"([^"]+)"\s+(.+)/);
      if (aa) {
        const areaName = aa[1], story = aa[2], rest = aa[3];
        const sec = rest.match(/SECTION\s+"([^"]+)"/)?.[1] ?? "";
        const cp  = rest.match(/CARDINALPOINT\s+"([^"]+)"/)?.[1] ?? "CENTROID";
        const mtype = rest.match(/MODELINGTYPE\s+"([^"]+)"/)?.[1] ?? "ShellThin";
        areaAssigns.set(`${areaName}@${story}`, { story, section: sec, modelingType: mtype, cardinalPoint: cp });
        const sp = rest.match(/SPRINGPROP\s+"([^"]+)"/)?.[1];
        if (sp) areaSpringAssign.set(`${areaName}@${story}`, sp);
      }
    }

    // ── RESORTES: propiedades (AREA/POINT SPRING PROPERTIES) ──
    if (currentSection === "AREA SPRING PROPERTIES") {
      const m = line.match(/AREASPRING\s+"([^"]+)"\s+(.+)/);
      if (m) {
        const name = m[1], r = m[2];
        const u1 = parseFloat(r.match(/U1\s+([\d.eE+-]+)/)?.[1] ?? "0");
        const u2 = parseFloat(r.match(/U2\s+([\d.eE+-]+)/)?.[1] ?? "0");
        const u3 = parseFloat(r.match(/U3\s+([\d.eE+-]+)/)?.[1] ?? "0");
        areaSprings.set(name, { u1, u2, u3 });
      }
    }
    if (currentSection === "POINT SPRING PROPERTIES") {
      const m = line.match(/POINTSPRING\s+"([^"]+)"\s+(.+)/);
      if (m) {
        const name = m[1], r = m[2];
        const ux = parseFloat(r.match(/UX\s+([\d.eE+-]+)/)?.[1] ?? "0");
        const uy = parseFloat(r.match(/UY\s+([\d.eE+-]+)/)?.[1] ?? "0");
        const uz = parseFloat(r.match(/UZ\s+([\d.eE+-]+)/)?.[1] ?? "0");
        pointSprings.set(name, { ux, uy, uz });
      }
    }
    // POINTASSIGN ... SPRINGPROP "name"
    if (currentSection === "POINT ASSIGNS") {
      const pa = line.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)"\s+(.+)/);
      const sp = pa?.[3]?.match(/SPRINGPROP\s+"([^"]+)"/)?.[1];
      if (pa && sp) pointSpringAssign.set(`${pa[1]}@${pa[2]}`, sp);
    }

    // ── SHELL UNIFORM LOAD SETS ──
    // SHELLUNIFORMLOADSET "ULoadSet1"  LOADPAT "Live"  VALUE 0.5
    if (currentSection === "SHELL UNIFORM LOAD SETS") {
      const su = line.match(/SHELLUNIFORMLOADSET\s+"([^"]+)"\s+LOADPAT\s+"([^"]+)"\s+VALUE\s+([\d.eE+-]+)/);
      if (su) {
        const setName = su[1], loadpat = su[2], value = parseFloat(su[3]);
        if (!shellLoadSets.has(setName)) shellLoadSets.set(setName, []);
        shellLoadSets.get(setName)!.push({ loadpat, value });
      }
    }

    // ── SHELL OBJECT LOADS ──
    // Forma A: AREALOAD "F1" "Story1" TYPE "UNIFF" DIR "GRAV" LC "Live" FVAL 1.019716
    // Forma B: AREALOAD "F1" "Story1" TYPE "UNIFLOADSET" "ULoadSet1"
    if (currentSection === "SHELL OBJECT LOADS") {
      const sl = line.match(/AREALOAD\s+"([^"]+)"\s+"([^"]+)"\s+(.+)/);
      if (sl) {
        const areaName = sl[1], story = sl[2], rest = sl[3];
        const typ = rest.match(/TYPE\s+"([^"]+)"/)?.[1] ?? "";
        if (typ === "UNIFLOADSET") {
          // Resolver el set DESPUÉS de parsear (porque los SETS pueden estar
          // antes o después). Almacenamos referencia y resolvemos en post.
          const setName = rest.match(/UNIFLOADSET"\s+"([^"]+)"/)?.[1]
                       ?? rest.match(/"([^"]+)"\s*$/)?.[1] ?? "";
          shellLoads.push({ area: areaName, story, type: "UNIFLOADSET",
                            dir: "GRAV", lc: setName, val: 0 });
        } else {
          const dir = rest.match(/DIR\s+"([^"]+)"/)?.[1] ?? "GRAV";
          const lc  = rest.match(/LC\s+"([^"]+)"/)?.[1] ?? "";
          const val = parseFloat(rest.match(/FVAL\s+([\d.eE+-]+)/)?.[1] ?? "0");
          shellLoads.push({ area: areaName, story, type: typ, dir, lc, val });
        }
      }
    }
  }

  // Resolver UNIFLOADSET references: expand a una row por (loadpat, value) del set
  const expandedShellLoads: typeof shellLoads = [];
  for (const sl of shellLoads) {
    if (sl.type === "UNIFLOADSET") {
      const set = shellLoadSets.get(sl.lc);
      if (set) {
        for (const e of set) {
          expandedShellLoads.push({ area: sl.area, story: sl.story, type: "UNIFF",
                                    dir: sl.dir, lc: e.loadpat, val: e.value });
        }
      }
    } else {
      expandedShellLoads.push(sl);
    }
  }
  shellLoads.length = 0;
  shellLoads.push(...expandedShellLoads);

  // ── Compute story elevations ──
  // Stories are listed top-to-bottom in the file. Each story's HEIGHT is
  // the floor-to-floor distance from the story below to this story.
  // The last story ("Base") has an absolute ELEV.
  // Elevation of story[i] = elevation of story[i+1] + height of story[i]
  const storyElevs = new Map<string, number>();
  if (stories.length > 0) {
    // Base story has its absolute elevation
    const baseIdx = stories.length - 1;
    storyElevs.set(stories[baseIdx].name, stories[baseIdx].elev);
    // Accumulate upward: each story's elev = story_below.elev + this_story.height
    for (let i = baseIdx - 1; i >= 0; i--) {
      const belowElev = storyElevs.get(stories[i + 1].name)!;
      const thisElev = belowElev + stories[i].height;
      stories[i].elev = thisElev;
      storyElevs.set(stories[i].name, thisElev);
    }
  }

  // ── Build 3D nodes & elements ──
  // ETABS POINT COORDINATES are 2D plan (X, Y). 3D position depends on story.
  // For COLUMN/BRACE at story S with nStories N:
  //   bottom node (pt1) at elevation of story N levels below S
  //   top node (pt2) at elevation of story S
  // For BEAM at story S: both nodes at elevation of story S
  const nodes: Node[] = [];
  const nodeNames: string[] = [];
  const nodeNameToIdx = new Map<string, number>();

  const nodeKey = (pt: string, story: string) => `${pt}@${story}`;
  const allNodeKeys = new Set<string>();

  // Build a lookup: line name → lineConn (for nStories access)
  const lineConnMap = new Map<string, typeof lineConns[0]>();
  for (const lc of lineConns) lineConnMap.set(lc.name, lc);

  // Collect all unique (point, story) pairs needed
  for (const lc of lineConns) {
    for (const [key, la] of lineAssigns) {
      if (!key.startsWith(lc.name + "@")) continue;
      const story = la.story;
      const storyIdx = stories.findIndex(s => s.name === story);
      if (storyIdx < 0) continue;

      if (lc.type === "COLUMN" || lc.type === "BRACE") {
        // Top node at this story's elevation
        allNodeKeys.add(nodeKey(lc.pt2, story));
        // Bottom node at nStories levels below this story
        const nSt = Math.max(lc.nStories, 1);
        const bottomIdx = Math.min(storyIdx + nSt, stories.length - 1);
        allNodeKeys.add(nodeKey(lc.pt1, stories[bottomIdx].name));
      } else {
        // BEAM: both nodes at this story's elevation
        allNodeKeys.add(nodeKey(lc.pt1, story));
        allNodeKeys.add(nodeKey(lc.pt2, story));
      }
    }
  }

  // Also from restraints
  for (const [key] of restraints) {
    allNodeKeys.add(key);
  }

  // Also from area assignments: corner nodes at story level
  // Helper: story de cada esquina de área según su offset (0=asignada, n=n abajo).
  // Las losas (offset 0) quedan en su story; los muros PANEL (offset 1 en 2 esquinas)
  // bajan esas esquinas una story → quad vertical, no degenerado.
  const storyIdxByName = new Map(stories.map((s, i) => [s.name, i] as [string, number]));
  const offsetStory = (assignedStory: string, off: number): string => {
    const i = storyIdxByName.get(assignedStory);
    if (i === undefined) return assignedStory;
    return stories[Math.max(0, i - (off || 0))].name;
  };
  for (const ac of areaConns) {
    for (const [key, aa] of areaAssigns) {
      if (!key.startsWith(ac.name + "@")) continue;
      for (let c = 0; c < ac.pts.length; c++)
        allNodeKeys.add(nodeKey(ac.pts[c], offsetStory(aa.story, ac.storyOffsets?.[c] ?? 0)));
    }
  }

  // Create nodes — deduplicate by (point, story) key
  for (const nk of allNodeKeys) {
    const [pt, story] = nk.split("@");
    const xy = pointCoords.get(pt);
    const elev = storyElevs.get(story);
    if (xy === undefined || elev === undefined) continue;
    nodes.push([xy[0], xy[1], elev]);
    nodeNames.push(nk);
    nodeNameToIdx.set(nk, nodes.length - 1);
  }

  // ── Build elements ──
  const elements: Element[] = [];
  const elementNames: string[] = [];
  const elementTypes: string[] = [];
  const elementStoriesArr: string[] = [];
  const elementSections = new Map<number, string>();
  // Declarados aqui (antes de su uso en LINE ASSIGNS) para evitar TDZ:
  // se llenaban antes de su antigua declaracion -> "Cannot access before initialization".
  const rigidOffsets = new Map<number, [number, number]>();
  const momentReleases = new Map<number, boolean[]>();

  for (const lc of lineConns) {
    for (const [key, la] of lineAssigns) {
      if (!key.startsWith(lc.name + "@")) continue;
      const story = la.story;
      const storyIdx = stories.findIndex(s => s.name === story);
      if (storyIdx < 0) continue;

      let n1key: string, n2key: string;
      if (lc.type === "COLUMN" || lc.type === "BRACE") {
        // Top at this story, bottom at nStories below
        const nSt = Math.max(lc.nStories, 1);
        const bottomIdx = Math.min(storyIdx + nSt, stories.length - 1);
        n1key = nodeKey(lc.pt1, stories[bottomIdx].name); // bottom
        n2key = nodeKey(lc.pt2, story);                    // top
      } else {
        // BEAM: both at this story level
        n1key = nodeKey(lc.pt1, story);
        n2key = nodeKey(lc.pt2, story);
      }

      const i1 = nodeNameToIdx.get(n1key);
      const i2 = nodeNameToIdx.get(n2key);
      if (i1 === undefined || i2 === undefined || i1 === i2) continue;

      const elemIdx = elements.length;
      elements.push([i1, i2]);
      elementNames.push(lc.name);
      elementTypes.push(lc.type);
      elementStoriesArr.push(story);
      elementSections.set(elemIdx, la.section);

      // Store rigid zone factor for this element
      if (la.rigidZone > 0) {
        rigidOffsets.set(elemIdx, [la.rigidZone, la.rigidZone]);
      }
      // Store releases (12-flag: FxI,FyI,FzI,TI,M2I,M3I, FxJ,FyJ,FzJ,TJ,M2J,M3J)
      if (la.releases.length > 0) {
        const rel: boolean[] = new Array(12).fill(false);
        // ETABS release names → 12-flag index
        const releaseMap: Record<string, number> = {
          "PI": 0,  "V2I": 1,  "V3I": 2,  "TI": 3,  "M2I": 4,  "M3I": 5,
          "PJ": 6,  "V2J": 7,  "V3J": 8,  "TJ": 9,  "M2J": 10, "M3J": 11,
        };
        for (const r of la.releases) {
          const idx = releaseMap[r];
          if (idx !== undefined) rel[idx] = true;
        }
        momentReleases.set(elemIdx, rel);
      }
    }
  }

  // ── Build area (shell) elements (Q4 4-node) ──
  // Cada area F# en una story da 1 Q4 element con los 4 corner nodes a esa
  // elevación de story. Las losas grandes (>2m lado) idealmente se sub-mesh
  // después por el caller — el parser solo crea el Q4 grande (lo que figura
  // en el e2k literalmente).
  const areaElementSection = new Map<number, string>();  // elemIdx → "Slab1" name
  const areaElementCardinal = new Map<number, string>(); // elemIdx → "TOP"/"CENTROID"
  for (const ac of areaConns) {
    for (const [key, aa] of areaAssigns) {
      if (!key.startsWith(ac.name + "@")) continue;
      const idxs: number[] = [];
      for (let c = 0; c < ac.pts.length; c++) {
        const nk = nodeKey(ac.pts[c], offsetStory(aa.story, ac.storyOffsets?.[c] ?? 0));
        const idx = nodeNameToIdx.get(nk);
        if (idx === undefined) { idxs.length = 0; break; }
        idxs.push(idx);
      }
      // descartar degenerados (nodos repetidos) por si algún offset no resolvió
      if (idxs.length !== 4 || new Set(idxs).size !== 4) continue;  // solo Q4 válidos
      const elemIdx = elements.length;
      elements.push(idxs);
      elementNames.push(ac.name);
      elementTypes.push("FLOOR");
      elementStoriesArr.push(aa.story);
      areaElementSection.set(elemIdx, aa.section);
      areaElementCardinal.set(elemIdx, aa.cardinalPoint);
    }
  }

  // ── RESORTES WINKLER → springsList {node, dof, k} ──
  // (a) AREA SPRING (balasto bajo la losa de cimentación): el "subgrade modulus"
  //     ks [fuerza/long³] se distribuye a los 4 nodos del Q4 como k = ks·A/4
  //     [fuerza/long]. dof: 0=UX 1=UY 2=UZ.
  // (b) POINT SPRING: resorte puntual directo en el nodo.
  // Los valores quedan en unidades NATIVAS del e2k; se convierten a kN-m en el
  // bloque de unidades junto con el resto (springs se escalan ×Ff/Lf).
  const springAccum = new Map<string, number>();   // "node:dof" → k
  const addSpring = (node: number, dof: number, k: number) => {
    if (!(k > 0)) return;
    const key = `${node}:${dof}`;
    springAccum.set(key, (springAccum.get(key) ?? 0) + k);
  };
  for (let ei = 0; ei < elements.length; ei++) {
    const e = elements[ei];
    if (e.length !== 4) continue;
    const spName = areaSpringAssign.get(`${elementNames[ei]}@${elementStoriesArr[ei]}`);
    const sp = spName ? areaSprings.get(spName) : undefined;
    if (!sp) continue;
    const p = e.map((n) => nodes[n]);
    const v1 = [p[1][0] - p[0][0], p[1][1] - p[0][1]];
    const v2 = [p[3][0] - p[0][0], p[3][1] - p[0][1]];
    const A = Math.abs(v1[0] * v2[1] - v1[1] * v2[0]);  // área en plano XY (cimentación)
    const per = A / 4;
    for (const n of e) {
      addSpring(n, 0, sp.u1 * per);
      addSpring(n, 1, sp.u2 * per);
      addSpring(n, 2, sp.u3 * per);
    }
  }
  for (const [key, spName] of pointSpringAssign) {
    const idx = nodeNameToIdx.get(key);
    const sp = pointSprings.get(spName);
    if (idx === undefined || !sp) continue;
    addSpring(idx, 0, sp.ux);
    addSpring(idx, 1, sp.uy);
    addSpring(idx, 2, sp.uz);
  }
  const springsList: { node: number; dof: number; k: number }[] = [];
  for (const [key, k] of springAccum) {
    const [n, d] = key.split(":").map(Number);
    springsList.push({ node: n, dof: d, k });
  }

  // ── Apply shell loads → equivalent nodal loads on slab corners ──
  // Distribuye q_uniff sobre los 4 nodos del Q4 (area/4 c/u). Quick & dirty;
  // un sub-mesh adicional posterior re-distribuye con tributary areas finas.
  const nodalLoads = new Map<number, [number, number, number, number, number, number]>();
  for (const sl of shellLoads) {
    if (sl.type !== "UNIFF") continue;
    for (let ei = 0; ei < elements.length; ei++) {
      if (elementNames[ei] !== sl.area || elementStoriesArr[ei] !== sl.story) continue;
      const e = elements[ei];
      if (e.length !== 4) continue;
      const p = e.map(n => nodes[n]);
      // Compute plan area (assume Q4 in XY plane)
      const v1 = [p[1][0]-p[0][0], p[1][1]-p[0][1]];
      const v2 = [p[3][0]-p[0][0], p[3][1]-p[0][1]];
      const A = Math.abs(v1[0]*v2[1] - v1[1]*v2[0]);
      const Fz_per_node = -sl.val * A / 4;   // GRAV = downward
      for (const ni of e) {
        const prev = nodalLoads.get(ni) || [0, 0, 0, 0, 0, 0];
        prev[2] += Fz_per_node;
        nodalLoads.set(ni, prev);
      }
    }
  }

  // ── Build element inputs (properties) ──
  const elasticities = new Map<number, number>();
  const shearModuli = new Map<number, number>();
  const areas = new Map<number, number>();
  const shearAreasY = new Map<number, number>();
  const shearAreasZ = new Map<number, number>();
  // (rigidOffsets y momentReleases se declaran arriba, junto a elementSections)
  const momentsOfInertiaZ = new Map<number, number>();
  const momentsOfInertiaY = new Map<number, number>();
  const torsionalConstants = new Map<number, number>();
  const sectionShapes = new Map<number, SectionShape>();

  for (const [elemIdx, secName] of elementSections) {
    const sec = frameSections.get(secName);
    if (!sec) continue;
    const mat = materials.get(sec.material);
    if (mat) {
      elasticities.set(elemIdx, mat.E);
      shearModuli.set(elemIdx, mat.G);
    }

    // Compute section properties from dimensions
    const D = sec.D, B = sec.B, tf = sec.TF, tw = sec.TW;
    let A = 0, Iz = 0, Iy = 0, J = 0, AsY = 0, AsZ = 0;
    let shapeType: SectionShape["type"] = "rect";

    switch (sec.shape) {
      case "Concrete Rectangular":
        A = D * B;
        Iz = B * D ** 3 / 12;
        Iy = D * B ** 3 / 12;
        J = (B * D ** 3) * (1/3 - 0.21 * (D/B) * (1 - D**4 / (12 * B**4)));
        AsY = AsZ = 5 / 6 * A; // rectangular shear area factor
        shapeType = "rect";
        break;
      case "Concrete Circle":
        A = Math.PI * D ** 2 / 4;
        Iz = Iy = Math.PI * D ** 4 / 64;
        J = Math.PI * D ** 4 / 32;
        AsY = AsZ = 0.9 * A; // circular shear area factor ~0.9
        shapeType = "circ";
        break;
      case "Steel I/Wide Flange":
        A = 2 * B * tf + (D - 2 * tf) * tw;
        Iz = (B * D ** 3 - (B - tw) * (D - 2 * tf) ** 3) / 12;
        Iy = (2 * tf * B ** 3 + (D - 2 * tf) * tw ** 3) / 12;
        J = (2 * B * tf ** 3 + (D - 2 * tf) * tw ** 3) / 3;
        AsY = (D - 2 * tf) * tw; // web area (shear in Y = strong axis bending)
        AsZ = 2 * B * tf * 5/6; // flange area (shear in Z = weak axis bending)
        shapeType = "I";
        break;
      case "Steel Tube":
        A = D * B - (D - 2 * tw) * (B - 2 * tw);
        Iz = (B * D ** 3 - (B - 2 * tw) * (D - 2 * tw) ** 3) / 12;
        Iy = (D * B ** 3 - (D - 2 * tw) * (B - 2 * tw) ** 3) / 12;
        J = 2 * tw * (D - tw) * (B - tw) * ((D - tw) * (B - tw)) / ((D - tw) + (B - tw));
        AsY = 2 * D * tw; // two webs
        AsZ = 2 * B * tw; // two flanges
        shapeType = "HSS";
        break;
      case "Filled Steel Tube":
        A = D * B;
        Iz = B * D ** 3 / 12;
        Iy = D * B ** 3 / 12;
        J = 2 * tw * (D - tw) * (B - tw) * ((D - tw) * (B - tw)) / ((D - tw) + (B - tw));
        AsY = 2 * D * tw + 5/6 * (D - 2*tw) * (B - 2*tw); // steel webs + concrete core
        AsZ = 2 * B * tw + 5/6 * (D - 2*tw) * (B - 2*tw);
        shapeType = "CFT";
        break;
      case "Steel Angle": {
        const t = tf || tw;
        A = t * (D + B - t);
        Iz = t * (D ** 3 + B * t ** 2 + t ** 2 * (D - t)) / 12;
        Iy = t * (B ** 3 + D * t ** 2 + t ** 2 * (B - t)) / 12;
        J = (D + B - t) * t ** 3 / 3;
        AsY = D * t; // vertical leg
        AsZ = B * t; // horizontal leg
        shapeType = "L";
        break;
      }
      case "Steel Channel":
      case "Cold Formed C":
        A = 2 * B * tf + (D - 2 * tf) * tw;
        Iz = (tw * D ** 3 + 2 * B * tf * (D - tf) ** 2) / 12;
        Iy = (2 * tf * B ** 3 + (D - 2 * tf) * tw ** 3) / 12;
        J = (2 * B * tf ** 3 + (D - 2 * tf) * tw ** 3) / 3;
        AsY = (D - 2 * tf) * tw; // web
        AsZ = 2 * B * tf * 5/6; // flanges
        shapeType = sec.shape === "Cold Formed C" ? "coldC" : "C";
        break;
      case "Steel Double Channel":
        A = 2 * (2 * B * tf + (D - 2 * tf) * tw);
        Iz = 2 * (tw * D ** 3 + 2 * B * tf * (D - tf) ** 2) / 12;
        Iy = 2 * (2 * tf * B ** 3 + (D - 2 * tf) * tw ** 3) / 12;
        J = 2 * (2 * B * tf ** 3 + (D - 2 * tf) * tw ** 3) / 3;
        AsY = 2 * (D - 2 * tf) * tw; // two webs
        AsZ = 4 * B * tf * 5/6; // four flanges
        shapeType = "2C";
        break;
      default:
        if (D > 0 && B > 0) {
          A = D * B; Iz = B * D ** 3 / 12; Iy = D * B ** 3 / 12;
          J = Math.min(D, B) * Math.max(D, B) ** 3 / 3 * 0.3;
          AsY = AsZ = 5 / 6 * A;
        }
        break;
    }

    // Apply modifiers
    if (sec.modI2) Iy *= sec.modI2;
    if (sec.modI3) Iz *= sec.modI3;

    areas.set(elemIdx, A);
    momentsOfInertiaZ.set(elemIdx, Iz);
    momentsOfInertiaY.set(elemIdx, Iy);
    torsionalConstants.set(elemIdx, J);
    if (AsY > 0) shearAreasY.set(elemIdx, AsY);
    if (AsZ > 0) shearAreasZ.set(elemIdx, AsZ);

    sectionShapes.set(elemIdx, {
      type: shapeType,
      b: B || undefined,
      h: D || undefined,
      d: (shapeType === "circ" || shapeType === "pipe") ? D : undefined,
      tw: tw || undefined,
      tf: tf || undefined,
      r: sec.R,
      name: secName,
    });
  }

  // Fallback de frame: vigas/columnas cuya sección no se parseó o cuya forma no se
  // reconoció quedan con A/I=0 → rigidez nula → matriz singular. Les damos una sección
  // de concreto 0.30×0.30 por defecto para que el modelo resuelva (aprox, no exacta).
  {
    let dm: { E: number; G: number } | undefined;
    for (const mat of materials.values()) { if (mat.E > 0) { dm = mat; break; } }
    const DEF_E = dm?.E ?? 2.5e7, DEF_G = dm?.G ?? 1.04e7;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].length !== 2) continue;  // solo frames
      if (!((areas.get(i) ?? 0) > 0)) {
        areas.set(i, 0.09); momentsOfInertiaZ.set(i, 6.75e-4); momentsOfInertiaY.set(i, 6.75e-4);
        torsionalConstants.set(i, 1.14e-3); shearAreasY.set(i, 0.075); shearAreasZ.set(i, 0.075);
      }
      if (!((elasticities.get(i) ?? 0) > 0)) elasticities.set(i, DEF_E);
      if (!((shearModuli.get(i) ?? 0) > 0)) shearModuli.set(i, DEF_G);
    }
  }

  // ── Apply shell element properties (E, ν, t, plateFormulations) ──
  const thicknesses = new Map<number, number>();
  const poissonsRatios = new Map<number, number>();
  const plateFormulations = new Map<number, number>();
  const drillingTypes = new Map<number, number>();
  const densitiesArea = new Map<number, number>();
  // Material concreto por defecto para shells cuya sección no se parseó (deck metálico,
  // nombres con caracteres raros, etc.) → evita que queden con rigidez 0 (matriz singular).
  let defMat: { E: number; G: number; nu: number; density?: number } | undefined;
  for (const mat of materials.values()) { if (mat.E > 0) { defMat = mat; break; } }
  for (const [elemIdx, secName] of areaElementSection) {
    const shellSec = shellSections.get(secName);
    // espesor de la sección si se parseó y es >0; si no, fallback 0.20 m (evita rigidez cero)
    const t = (shellSec && shellSec.thickness > 0) ? shellSec.thickness : 0.20;
    thicknesses.set(elemIdx, t);
    const mat = (shellSec ? materials.get(shellSec.material) : undefined) || defMat;
    if (mat) {
      elasticities.set(elemIdx, mat.E);
      shearModuli.set(elemIdx, mat.G);
      poissonsRatios.set(elemIdx, mat.nu);
      if (mat.density !== undefined) densitiesArea.set(elemIdx, mat.density);
    }
    // ShellThin → MZC Kirchhoff (1); ShellThick/Membrane/desconocido → Mindlin (0)
    plateFormulations.set(elemIdx, shellSec?.modelingType === "ShellThin" ? 1 : 0);
    drillingTypes.set(elemIdx, 2);  // Hughes-Brezzi drilling → evita rz singular en nodos de shell
  }

  // ── Build node inputs (supports) ──
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (const [key, dofs] of restraints) {
    const nodeIdx = nodeNameToIdx.get(key);
    if (nodeIdx === undefined) continue;
    const fix: [boolean, boolean, boolean, boolean, boolean, boolean] = [false, false, false, false, false, false];
    for (const d of dofs) {
      if (d === "UX") fix[0] = true;
      if (d === "UY") fix[1] = true;
      if (d === "UZ") fix[2] = true;
      if (d === "RX") fix[3] = true;
      if (d === "RY") fix[4] = true;
      if (d === "RZ") fix[5] = true;
    }
    supports.set(nodeIdx, fix);
  }

  // Restringir nodos AISLADOS (en ningún elemento) → sus 6 GDL quedan libres → matriz
  // singular. Un nodo aislado no transmite carga, así que fijarlo no altera el resultado.
  {
    const usedNodes = new Set<number>();
    for (const e of elements) for (const n of e) usedNodes.add(n);
    for (let n = 0; n < nodes.length; n++)
      if (!usedNodes.has(n) && !supports.has(n))
        supports.set(n, [true, true, true, true, true, true]);
  }

  // ── Convert LINELOAD to equivalent nodal loads ──
  // LINELOAD "B120" "N+13.00m" TYPE "UNIFF" DIR "GRAV" LC "SCP" FVAL 0.0148
  // UNIFF = uniform full length, w (force/length)
  // Equivalent nodal: F = w*L/2 at each end node, applied in gravity direction (-Z)
  // Combine all load cases (SCP + CV = total service load)
  const loads = new Map<number, [number, number, number, number, number, number]>();

  // Build element lookup: "lineName@story" → element index
  const elemLookup = new Map<string, number>();
  for (let ei = 0; ei < elementNames.length; ei++) {
    elemLookup.set(`${elementNames[ei]}@${elementStoriesArr[ei]}`, ei);
  }

  for (const fl of frameLoads) {
    const elemIdx = elemLookup.get(`${fl.line}@${fl.story}`);
    if (elemIdx === undefined) continue;

    const [n1, n2] = elements[elemIdx];
    const p1 = nodes[n1], p2 = nodes[n2];
    const L = Math.sqrt((p2[0]-p1[0])**2 + (p2[1]-p1[1])**2 + (p2[2]-p1[2])**2);
    if (L < 1e-10) continue;

    // Equivalent nodal force = w * L / 2 at each node
    const F = fl.val * L / 2;

    // Direction: GRAV = -Z, GRAVITY = -Z
    let fx = 0, fy = 0, fz = 0;
    if (fl.dir === "GRAV" || fl.dir === "GRAVITY") {
      fz = -F; // gravity = downward
    } else if (fl.dir === "X") {
      fx = F;
    } else if (fl.dir === "Y") {
      fy = F;
    } else if (fl.dir === "Z") {
      fz = -F;
    }

    // Accumulate on both nodes
    for (const ni of [n1, n2]) {
      const prev = loads.get(ni) || [0, 0, 0, 0, 0, 0] as [number, number, number, number, number, number];
      prev[0] += fx; prev[1] += fy; prev[2] += fz;
      loads.set(ni, prev);
    }
  }

  // ── Add material densities to element inputs ──
  const densities = new Map<number, number>();
  for (const [elemIdx, secName] of elementSections) {
    const sec = frameSections.get(secName);
    if (!sec) continue;
    const mat = materials.get(sec.material);
    if (mat?.density) densities.set(elemIdx, mat.density);
  }
  for (const [eIdx, d] of densitiesArea) densities.set(eIdx, d);

  // ── Merge shell loads into the existing nodal loads map ──
  for (const [ni, fz] of nodalLoads) {
    const prev = loads.get(ni) || [0, 0, 0, 0, 0, 0];
    loads.set(ni, [prev[0]+fz[0], prev[1]+fz[1], prev[2]+fz[2],
                    prev[3]+fz[3], prev[4]+fz[4], prev[5]+fz[5]]);
  }

  // ── Conversión de UNIDADES del e2k a las internas de Hekatan (kN, m) ──
  // El e2k declara sus unidades (ej. "N" "MM") y los valores se parsearon CRUDOS.
  // Acá escalamos TODO lo que entra al ANÁLISIS (nodos, cargas, E, áreas,
  // inercias, espesores, densidades) a kN-m. Sin esto, un modelo ETABS en N-mm
  // daba geometría 1000× y cargas 1e6× → resultados absurdos.
  // El ROUND-TRIP (rawSections) NO se toca: re-exporta el e2k original verbatim.
  const LEN_TO_M: Record<string, number> = { M: 1, CM: 0.01, MM: 0.001, FT: 0.3048, IN: 0.0254, INCH: 0.0254 };
  const FRC_TO_KN: Record<string, number> = { KN: 1, N: 0.001, TONF: 9.80665, TON: 9.80665, KGF: 0.00980665, KG: 0.00980665, KIP: 4.448222, LB: 0.004448222 };
  const Lf = LEN_TO_M[(units.length || "M").toUpperCase()] ?? 1;
  const Ff = FRC_TO_KN[(units.force || "KN").toUpperCase()] ?? 1;
  if (Lf !== 1 || Ff !== 1) {
    const stress = Ff / (Lf * Lf);            // E, G  (fuerza/longitud²)
    for (const n of nodes) { n[0] *= Lf; n[1] *= Lf; n[2] *= Lf; }
    for (const [k, v] of loads) {
      loads.set(k, [v[0] * Ff, v[1] * Ff, v[2] * Ff, v[3] * Ff * Lf, v[4] * Ff * Lf, v[5] * Ff * Lf]);
    }
    const scale = (m: Map<number, number>, f: number) => { for (const [k, v] of m) m.set(k, v * f); };
    scale(elasticities, stress);
    scale(shearModuli, stress);
    scale(areas, Lf * Lf);
    scale(momentsOfInertiaZ, Lf ** 4);
    scale(momentsOfInertiaY, Lf ** 4);
    scale(torsionalConstants, Lf ** 4);
    scale(shearAreasY, Lf * Lf);
    scale(shearAreasZ, Lf * Lf);
    scale(thicknesses, Lf);
    scale(densities, Ff / (Lf ** 3));         // peso/volumen = fuerza/longitud³
    // resortes: k [fuerza/longitud] → ×Ff/Lf. OJO: el área tributaria usada para
    // los AREASPRING se calculó con coords NATIVAS, así que k nativo = ks·A_nat;
    // ks es fuerza/long³ y A long² → fuerza/long. Convertir a kN/m = ×Ff/Lf.
    const springFactor = Ff / Lf;
    for (const s of springsList) s.k *= springFactor;
    units.force = "KN"; units.length = "M";   // los VALORES quedan en kN-m
  }

  return {
    units,
    stories: stories.reverse(), // bottom to top
    materials,
    frameSections,
    nodes,
    nodeNames,
    nodeNameToIdx,
    elements,
    elementNames,
    elementTypes: elementTypes,
    elementStories: elementStoriesArr,
    elementSections,
    nodeInputs: { supports, loads },
    elementInputs: {
      elasticities,
      shearModuli,
      areas,
      momentsOfInertiaZ,
      momentsOfInertiaY,
      torsionalConstants,
      shearAreasY,
      shearAreasZ,
      rigidOffsets,
      momentReleases,
      densities,
      sectionShapes,
      thicknesses,
      poissonsRatios,
      plateFormulations,
      drillingTypes,
    },
    sectionShapes,
    grids,
    springsList,
    info: {
      nNodes: nodes.length,
      nFrames: elements.length,
      nAreas: areaConns.length,
      title,
    },
    rawSections,
    rawSectionHeaders,
  };
}
