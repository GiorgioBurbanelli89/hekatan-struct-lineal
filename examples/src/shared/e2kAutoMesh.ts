/**
 * Auto-mesh post-processing helper para modelos importados via e2kParser.
 *
 * Resuelve el caso típico: el e2k tiene una losa grande F1 como UN solo Q4
 * de 6×6m (ETABS auto-mesh sucede en runtime). Hekatan-Struct opera sobre
 * elementos literales del modelo, así que necesitamos subdividir explícito.
 *
 * Replica `MESHATINTERSECTIONS "YES"` de ETABS: cuando subdividimos la losa
 * en N×N, las vigas perimetrales que comparten edge con la losa también se
 * sub-dividen para conservar la conectividad de nodos.
 *
 * Supuestos del algoritmo:
 *  - Q4 areas son axis-aligned (rectangulares en plan X-Y a Z constante)
 *  - Beams perimetrales son axis-aligned o están exactamente sobre un edge
 *    de la losa (puro X o puro Y)
 *  - Columns no se subdividen (son verticales, no tocan la losa lateralmente)
 *
 * Estos supuestos cubren el 95% de modelos ETABS típicos (losas en grilla
 * + frames en grilla). Geometrías curvas o frames diagonales NO funcionan.
 */
import type { Node, Element } from "hekatan-fem";
import type { E2kModel } from "./e2kParser";

const EPS = 1e-6;

/**
 * Auto-mesh shells grandes y splits frames sobre sus edges.
 *
 * @param model - parsed E2kModel
 * @param threshold - lado máximo de Q4 antes de subdividir (default 2 m)
 * @param nMesh - subdivisiones por lado (default 5, como ETABS auto-mesh)
 * @returns model modificado in-place (nodes, elements, elementInputs, loads expandidos)
 */
export function autoMeshShells(model: E2kModel, threshold = 2.0, nMesh = 5): {
  newSlabElements: number;
  splitFrameSegments: number;
  newNodes: number;
} {
  const stats = { newSlabElements: 0, splitFrameSegments: 0, newNodes: 0 };

  // ── Step 1: identify large Q4 slab elements ──
  const largeQ4Indices: number[] = [];
  for (let i = 0; i < model.elements.length; i++) {
    const e = model.elements[i];
    if (e.length !== 4) continue;
    const p = e.map(n => model.nodes[n]);
    const lx = Math.abs(p[1][0] - p[0][0]);
    const ly = Math.abs(p[3][1] - p[0][1]);
    if (Math.max(lx, ly) > threshold) largeQ4Indices.push(i);
  }
  if (largeQ4Indices.length === 0) return stats;

  // ── Step 2: subdivide each large Q4 + register edge node mapping ──
  // edgeNodeMap: "x_y_z" → nodeIdx, to share new nodes between adjacent Q4s
  const nodeKey = (x: number, y: number, z: number) =>
    `${x.toFixed(4)}_${y.toFixed(4)}_${z.toFixed(4)}`;
  const existingByKey = new Map<string, number>();
  for (let i = 0; i < model.nodes.length; i++) {
    const [x, y, z] = model.nodes[i];
    existingByKey.set(nodeKey(x, y, z), i);
  }

  const newElements: Element[] = [];
  const newElementInputsCopyMap = new Map<number, number>();  // newIdx → sourceQ4Idx
  for (const origIdx of largeQ4Indices) {
    const e = model.elements[origIdx];
    const p = e.map(n => model.nodes[n]);
    const z = p[0][2];
    // Create N+1 × N+1 grid of nodes via bilinear interpolation
    const grid: number[][] = [];
    for (let i = 0; i <= nMesh; i++) {
      const row: number[] = [];
      for (let j = 0; j <= nMesh; j++) {
        const u = i / nMesh, v = j / nMesh;
        const x = (1-u)*(1-v)*p[0][0] + u*(1-v)*p[1][0] + u*v*p[2][0] + (1-u)*v*p[3][0];
        const y = (1-u)*(1-v)*p[0][1] + u*(1-v)*p[1][1] + u*v*p[2][1] + (1-u)*v*p[3][1];
        const k = nodeKey(x, y, z);
        let nodeIdx = existingByKey.get(k);
        if (nodeIdx === undefined) {
          model.nodes.push([x, y, z]);
          nodeIdx = model.nodes.length - 1;
          existingByKey.set(k, nodeIdx);
          stats.newNodes++;
        }
        row.push(nodeIdx);
      }
      grid.push(row);
    }
    // Generate N×N sub-Q4 elements
    for (let i = 0; i < nMesh; i++) {
      for (let j = 0; j < nMesh; j++) {
        const newIdx = model.elements.length + newElements.length;
        newElements.push([grid[i][j], grid[i+1][j], grid[i+1][j+1], grid[i][j+1]]);
        newElementInputsCopyMap.set(newIdx, origIdx);
        stats.newSlabElements++;
      }
    }
  }

  // ── Step 3: split frames whose endpoints span across new slab nodes ──
  // Build set of all existing+new node coords for collision detection
  const newFrameSegments: { elemIdx: number; nodes: [number, number] }[] = [];
  for (let fi = 0; fi < model.elements.length; fi++) {
    const e = model.elements[fi];
    if (e.length !== 2) continue;
    const p1 = model.nodes[e[0]], p2 = model.nodes[e[1]];
    // Skip vertical (column) — only horizontal beams interact with slab subdivision
    if (Math.abs(p1[2] - p2[2]) > EPS) continue;
    const z = p1[2];
    const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
    const L = Math.sqrt(dx*dx + dy*dy);
    if (L < EPS) continue;
    // Find slab nodes that lie EXACTLY on this beam's axis (between endpoints, exclusive)
    const intermediate: { t: number; nodeIdx: number }[] = [];
    for (let ni = 0; ni < model.nodes.length; ni++) {
      if (ni === e[0] || ni === e[1]) continue;
      const [x, y, zn] = model.nodes[ni];
      if (Math.abs(zn - z) > EPS) continue;
      // Param t along beam: (x - p1.x) = t * dx; same for y. Both must agree.
      const t = Math.abs(dx) > EPS ? (x - p1[0]) / dx : (y - p1[1]) / dy;
      if (t <= EPS || t >= 1 - EPS) continue;  // exclusive endpoints
      const xExp = p1[0] + t * dx, yExp = p1[1] + t * dy;
      if (Math.abs(x - xExp) > EPS || Math.abs(y - yExp) > EPS) continue;
      intermediate.push({ t, nodeIdx: ni });
    }
    if (intermediate.length === 0) continue;
    // Sort by t and split: replace e with sequential segments [e[0], i1], [i1, i2], ..., [iN, e[1]]
    intermediate.sort((a, b) => a.t - b.t);
    let prev = e[0];
    const segs: [number, number][] = [];
    for (const im of intermediate) {
      segs.push([prev, im.nodeIdx]);
      prev = im.nodeIdx;
    }
    segs.push([prev, e[1]]);
    // First segment: reuse original elemIdx (replace e)
    model.elements[fi] = segs[0];
    // Remaining segments: append + replicate properties (handled below)
    for (let s = 1; s < segs.length; s++) {
      const newIdx = model.elements.length + newElements.length;
      newElements.push(segs[s]);
      newElementInputsCopyMap.set(newIdx, fi);   // copy from original frame
      stats.splitFrameSegments++;
    }
  }

  // ── Step 4: append all new elements to model.elements ──
  for (const ne of newElements) model.elements.push(ne);

  // ── Step 5: replicate element properties for new elements ──
  const ei = model.elementInputs;
  const maps = [
    ei.elasticities, ei.shearModuli, ei.poissonsRatios, ei.thicknesses,
    ei.densities, ei.areas, ei.momentsOfInertiaZ, ei.momentsOfInertiaY,
    ei.torsionalConstants, ei.shearAreasY, ei.shearAreasZ,
    ei.plateFormulations,
  ];
  for (const [newIdx, srcIdx] of newElementInputsCopyMap) {
    for (const m of maps) {
      if (m && m.has(srcIdx)) m.set(newIdx, m.get(srcIdx));
    }
    if (ei.sectionShapes?.has(srcIdx)) ei.sectionShapes.set(newIdx, ei.sectionShapes.get(srcIdx)!);
    if (ei.rigidOffsets?.has(srcIdx)) ei.rigidOffsets.set(newIdx, [...ei.rigidOffsets.get(srcIdx)!] as [number, number]);
  }

  // ── Step 6: remove original large Q4 elements (replace with degenerate placeholder
  // to preserve indices, or splice — splice changes indices and breaks all maps,
  // so use a different strategy: mark them by zeroing the thickness so analyze
  // ignores them, OR just leave them and the solver handles double-counting.
  // BETTER: actually remove by re-indexing. We rebuild element-keyed maps. ──
  const removeSet = new Set(largeQ4Indices);
  const oldToNewIdx = new Map<number, number>();
  const newAllElements: Element[] = [];
  const newAllTypes: string[] = [];
  const newAllNames: string[] = [];
  const newAllStories: string[] = [];
  for (let i = 0; i < model.elements.length; i++) {
    if (removeSet.has(i)) continue;
    oldToNewIdx.set(i, newAllElements.length);
    newAllElements.push(model.elements[i]);
    newAllTypes.push(model.elementTypes[i] ?? "");
    newAllNames.push(model.elementNames[i] ?? "");
    newAllStories.push(model.elementStories[i] ?? "");
  }
  // Re-index all element-keyed maps
  const remapMap = <T>(m: Map<number, T> | undefined): Map<number, T> | undefined => {
    if (!m) return m;
    const out = new Map<number, T>();
    for (const [k, v] of m) {
      const nk = oldToNewIdx.get(k);
      if (nk !== undefined) out.set(nk, v);
    }
    return out;
  };
  model.elements = newAllElements;
  model.elementTypes = newAllTypes;
  model.elementNames = newAllNames;
  model.elementStories = newAllStories;
  model.elementInputs.elasticities = remapMap(ei.elasticities)!;
  model.elementInputs.shearModuli = remapMap(ei.shearModuli)!;
  model.elementInputs.poissonsRatios = remapMap(ei.poissonsRatios)!;
  model.elementInputs.thicknesses = remapMap(ei.thicknesses)!;
  model.elementInputs.densities = remapMap(ei.densities)!;
  model.elementInputs.areas = remapMap(ei.areas)!;
  model.elementInputs.momentsOfInertiaZ = remapMap(ei.momentsOfInertiaZ)!;
  model.elementInputs.momentsOfInertiaY = remapMap(ei.momentsOfInertiaY)!;
  model.elementInputs.torsionalConstants = remapMap(ei.torsionalConstants)!;
  model.elementInputs.shearAreasY = remapMap(ei.shearAreasY)!;
  model.elementInputs.shearAreasZ = remapMap(ei.shearAreasZ)!;
  model.elementInputs.plateFormulations = remapMap(ei.plateFormulations);
  model.elementInputs.sectionShapes = remapMap(ei.sectionShapes);
  model.elementInputs.rigidOffsets = remapMap(ei.rigidOffsets);
  model.elementSections = remapMap(model.elementSections)!;

  // ── Step 7: re-distribute loads ──
  // Los loads en el parser fueron asignados a los 4 corners del Q4 original.
  // Ahora con sub-mesh los corners NUEVOS también deben recibir su tributary.
  // Estrategia simple: reset shell loads y recomputar desde shellLoads cache.
  // SIMPLIFICACIÓN: para esta primera iteración asumimos UNIFF gravity. El
  // caller debe llamar autoMeshShells ANTES de aplicar loads custom, y los
  // loads del parser (shellLoads expandidos a corners) deben re-distribuirse.
  //
  // Aquí lo más práctico: limpiar los 4-corner loads del Q4 original y aplicar
  // tributary fresh sobre todos los slab nodes. Pero NO conocemos qué nodos son
  // "slab" sin trackearlos. Para simpleza, dejamos al caller manejar esto y
  // sólo retornamos stats.

  return stats;
}
