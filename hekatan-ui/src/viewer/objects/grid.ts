import * as THREE from "three";
import { getTheme } from "../../theme";

export type GridPlane = "xy" | "xz" | "yz";

/**
 * Grid CAD-style multi-plano con líneas MAYORES y MENORES.
 *
 * Antes: un único `THREE.GridHelper(size, 20)` rotado a XY.
 * Ahora:
 *   - 1 a 3 planos simultáneos (XY / XZ / YZ), todos centrados en (0,0,0).
 *   - Cada plano: líneas MAYORES (cada `majorStep`) + MENORES (cada `minorStep`).
 *   - El cursor snap default coincide con el `minorStep`.
 *
 * `__hekatanGridConfig` (window) expone los pasos para que el snap default
 * pueda derivarlos. UI cambiada SOLO acá en hekatan-ui (toggles en el panel
 * "Settings" del viewer, no en main.ts del workspace).
 */
export function grid(
  gridSize: number,
  options?: {
    planes?: GridPlane[];
    majorStep?: number;
    minorStep?: number;
    /** Rectángulo que tiene que cubrir la rejilla (17-oct-2026, Jorge: «el dibujo no puede quedar nunca
     *  fuera de la interfaz; si el dibujo es más grande, la interfaz se amplía»). Sin él, cuadrado de lado
     *  `gridSize` centrado en el origen, como siempre. */
    rect?: { x0: number; x1: number; y0: number; y1: number; z0: number; z1: number } | null;
  },
): THREE.Group {
  const t = getTheme();
  const group = new THREE.Group();
  group.name = "hekatan-grid";

  // Planos a renderizar — default solo XY (compat con vista de planta CAD)
  const planes: GridPlane[] = options?.planes ?? ["xy"];
  let majorStep = options?.majorStep ?? 1;
  let minorStep = options?.minorStep ?? 0.1;

  // Sanitización: pasos inválidos / demasiado densos colapsarían la GPU.
  if (majorStep <= 0) majorStep = 1;
  if (minorStep <= 0) minorStep = 0.1;
  while (gridSize / minorStep > 500) minorStep *= 2;
  while (gridSize / majorStep > 100) majorStep *= 2;

  // ── Acoplamiento minor ↔ major (PERO halfSize respeta al usuario) ──
  // El usuario quiere que su Dimensión se RESPETE exactamente — antes la
  // snapeábamos a múltiplo de major y eso perdía el valor solicitado.
  // Ahora:
  //  1) majorStep efectivo = round(major/minor)·minor → siempre múltiplo
  //     entero de minor, garantizando que mayor y menor estén ALINEADAS
  //     entre sí (líneas mayores caen sobre posiciones de menores).
  //  2) halfSize = gridSize/2 EXACTO (sin snap) → la plataforma mide lo
  //     que el usuario pidió. Las celdas del BORDE pueden ser más chicas
  //     que las del interior si dimensión no es múltiplo de major — eso
  //     es comportamiento esperado tipo AutoCAD/SketchUp.
  // Líneas se generan simétricamente alrededor del origen (i*step para
  // i = -nMax..nMax) → el centro (0,0,0) siempre está en la grilla y las
  // mayores marcan el origen.
  const halfSize = gridSize / 2;
  const R = options?.rect ?? null;
  // límites (u0..u1, v0..v1) de cada plano: los del rectángulo pedido o el cuadrado de siempre
  const lim = (plane: GridPlane): [number, number, number, number] => !R ? [-halfSize, halfSize, -halfSize, halfSize]
    : plane === "xy" ? [R.x0, R.x1, R.y0, R.y1] : plane === "xz" ? [R.x0, R.x1, R.z0, R.z1] : [R.y0, R.y1, R.z0, R.z1];
  if (R) { const L = Math.max(R.x1 - R.x0, R.y1 - R.y0); while (L / minorStep > 500) minorStep *= 2; while (L / majorStep > 100) majorStep *= 2; }
  const majorEff = Math.max(minorStep, Math.round(majorStep / minorStep) * minorStep);
  majorStep = majorEff;
  // La MAYOR es la referencia que se mira (cada 5 m): va un punto por encima del
  // color de rejilla. La menor, un punto por debajo. Las dos sobre un fondo casi
  // negro, así que el contraste se gana con el COLOR, no con la opacidad.
  const majorColor = new THREE.Color(t.grid).multiplyScalar(1.3);
  // ⚠️ 0.45 dejaba la línea menor por DEBAJO del fondo en el tema oscuro (grid
  // 0x2c3647 → 0x141920, y el fondo es 0x0b1220): rejilla invisible.
  const minorColor = new THREE.Color(t.grid).multiplyScalar(0.8);

  // Helper: construye geometría de líneas paralelas en un plano.
  // El plano se especifica por sus 2 ejes (u, v) — los ejes que NO son
  // el normal del plano. Las posiciones se generan en el espacio del plano
  // y luego se mapean a (x,y,z) según `mapper`.
  const buildPlaneGrid = (
    plane: GridPlane,
    step: number,
    color: THREE.Color,
    opacity: number,
  ) => {
    const positions: number[] = [];
    // Para cada plano, definir cómo mapear (u,v) a (x,y,z).
    const mapper: (u: number, v: number) => [number, number, number] =
      plane === "xy" ? (u, v) => [u, v, 0]
      : plane === "xz" ? (u, v) => [u, 0, v]
      : (u, v) => [0, u, v];  // yz
    // ── Generación SIMÉTRICA respecto al origen ──
    // Antes: `for (let u = -halfSize; u <= halfSize; u += step)`. Si
    // halfSize/step no era entero, la secuencia no incluía u=0 → grid
    // asimétrico (la línea mayor no pasaba por el centro).
    // Ahora: iteramos en múltiplos de step en ambas direcciones desde 0.
    // Esto GARANTIZA que el origen (0,0,0) esté siempre en la grilla
    // y que las líneas mayores marquen el centro.
    // múltiplos enteros del paso dentro de los límites: el origen, si cae dentro, siempre es línea
    const [u0, u1, v0, v1] = lim(plane);
    for (let i = Math.ceil(u0 / step - 1e-9); i * step <= u1 + 1e-9; i++) {
      const u = i * step;
      positions.push(...mapper(u, v0), ...mapper(u, v1));
    }
    for (let j = Math.ceil(v0 / step - 1e-9); j * step <= v1 + 1e-9; j++) {
      const v = j * step;
      positions.push(...mapper(u0, v), ...mapper(u1, v));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({
      color, transparent: true, opacity, depthWrite: false,
    });
    const seg = new THREE.LineSegments(geo, mat);
    seg.name = `grid-${plane}-${step === minorStep ? "minor" : "major"}`;
    return seg;
  };

  // Helper: rectángulo cerrado en el perímetro del plano (borde permanente).
  // Usa LineLoop para tener un único trazo continuo. El borde es importante
  // para que el usuario VEA dónde termina la plataforma del grid.
  const buildPlaneBorder = (
    plane: GridPlane, color: THREE.Color, opacity: number,
  ) => {
    const mapper: (u: number, v: number) => [number, number, number] =
      plane === "xy" ? (u, v) => [u, v, 0]
      : plane === "xz" ? (u, v) => [u, 0, v]
      : (u, v) => [0, u, v];
    const [u0, u1, v0, v1] = lim(plane);
    const corners: [number, number][] = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
    const positions: number[] = [];
    for (const [u, v] of corners) positions.push(...mapper(u, v));
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({
      color, transparent: true, opacity, depthWrite: false,
    });
    const loop = new THREE.LineLoop(geo, mat);
    loop.name = `grid-${plane}-border`;
    loop.renderOrder = 1;  // encima de minor/major lines
    return loop;
  };

  // Opacities sutiles — antes 0.30/0.80 era demasiado fuerte (dominaba la
  // escena especialmente con los 3 planos activos). Bajado a 0.12/0.40 para
  // que el grid sea referencia visual sin tapar la geometría / colormap.
  // ── Las dos líneas del ORIGEN, en color ───────────────────────────────────
  // Todas las líneas del grid eran del mismo gris, así que no había forma de
  // saber dónde está el (0,0) ni hacia dónde crece cada eje: en una isométrica
  // la cuadrícula es simétrica y no dice nada. AutoCAD, Revit y SketchUp
  // pintan los dos ejes del origen, y el color es el mismo del gizmo de la
  // esquina — rojo X, verde Y, azul Z — para que no haya que traducir nada.
  const ejeOrigen = (plane: GridPlane, cual: "u" | "v", color: number) => {
    const mapper: (u: number, v: number) => [number, number, number] =
      plane === "xy" ? (u, v) => [u, v, 0]
      : plane === "xz" ? (u, v) => [u, 0, v]
      : (u, v) => [0, u, v];
    const [u0, u1, v0, v1] = lim(plane);
    const p = cual === "u"
      ? [...mapper(u0, 0), ...mapper(u1, 0)]
      : [...mapper(0, v0), ...mapper(0, v1)];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
    // Opacidad baja a propósito: tienen que ORIENTAR, no competir con el
    // modelo. Un eje rojo saturado bajo una barra roja la esconde.
    const seg = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({
      color, transparent: true, opacity: 0.45, depthWrite: false,
    }));
    seg.name = `grid-${plane}-eje-${cual}`;
    seg.renderOrder = 1;
    return seg;
  };
  // Qué eje global es cada dirección del plano: xy → X e Y; xz → X y Z;
  // yz → Y y Z.
  const COLOR_EJE: Record<GridPlane, [number, number]> = {
    xy: [0xd6455b, 0x4ea96a],   // X rojo, Y verde
    xz: [0xd6455b, 0x4a7fd6],   // X rojo, Z azul
    yz: [0x4ea96a, 0x4a7fd6],   // Y verde, Z azul
  };

  for (const plane of planes) {
    group.add(buildPlaneGrid(plane, minorStep, minorColor, 0.12));
    group.add(buildPlaneGrid(plane, majorStep, majorColor, 0.40));
    const [cu, cv] = COLOR_EJE[plane];
    const [u0, u1, v0, v1] = lim(plane);
    if (v0 <= 0 && v1 >= 0) group.add(ejeOrigen(plane, "u", cu));
    if (u0 <= 0 && u1 >= 0) group.add(ejeOrigen(plane, "v", cv));
    // Borde perimetral del grid — SIEMPRE resaltado (rectángulo cerrado
    // con los 4 lados del plano). Independiente del multiplicador major.
    // Usa la misma escala de opacity que las mayores pero con renderOrder
    // alto para garantizar que se vea encima.
    group.add(buildPlaneBorder(plane, majorColor, 0.55));
  }

  group.position.set(0, 0, 0);

  // Exponer config al window — main.ts la usa para snap default y debugging.
  // gridSize coincide con lo solicitado (sin snap). majorStep puede haber
  // sido ajustado para que sea múltiplo entero de minorStep.
  (window as any).__hekatanGridConfig = {
    majorStep, minorStep, gridSize, planes: [...planes], rect: R,
  };

  return group;
}
