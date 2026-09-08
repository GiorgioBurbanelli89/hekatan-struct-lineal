/**
 * ETABS .e2k File Exporter
 *
 * Strategy:
 *  - When e2kModel with rawSections is available (round-trip from import),
 *    re-emit the original raw text for each section exactly as ETABS wrote it.
 *  - When no e2kModel exists (model created from scratch), reconstruct best-effort.
 */
import type { Node, Element, NodeInputs, ElementInputs, SectionShape } from "hekatan-fem";
import type { E2kModel } from "./e2kParser";

export interface ExportE2kInput {
  nodes: Node[];
  elements: Element[];
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  title?: string;
  units?: { force: string; length: string };
  e2kModel?: E2kModel;
  /**
   * Modo de manejo de peso propio en el pattern Dead:
   *  - "auto" (default): SELFWEIGHT=1 → ETABS computa γ·V de cada material
   *    automáticamente. Se omiten cargas nodales FZ (asume que son self-weight).
   *  - "manual": SELFWEIGHT=0 → el peso propio se emite como POINTLOAD nodal
   *    (control fino del lumping). Para que ETABS resuelva las cargas
   *    correctamente, se emite POINTASSIGN por cada (plan-point, story) con
   *    carga o restraint, registrando el plan-point a esa altura.
   */
  weightMode?: "auto" | "manual";
  /**
   * Property modifiers por elemento (multipliers ETABS-style sobre A, I, etc).
   * Si no se provee, hekatan asume que los valores en `elementInputs.areas/Iy/Iz`
   * ya incluyen los modifiers baked-in y se emite `PROPMODIFIERS` = 1.0 (no-op).
   * Formato: 8 valores [A, As2, As3, Torsion, I22, I33, Mass, Weight].
   */
  propertyModifiers?: Map<number, [number, number, number, number, number, number, number, number]>;
  /**
   * Sísmico NEC opcional: si se provee, el e2k exportado trae el espectro NEC
   * como función USER-defined (portable a cualquier ETABS/SAP) + un caso
   * Response Spectrum. `points` = pares (T, Sa) del espectro NEC elástico
   * (el caller los muestrea de espectroNEC.necSpectrum). Validado: ETABS lee
   * los puntos exactos. La R suele ir en sfX/sfY (= g/(R·φ)).
   */
  /**
   * Combinaciones del MODELO. Antes el exportador escribia 1.4D y 1.2D+1.6L
   * a mano, siempre, hubiera o no combinaciones — y el e2k que saca ETABS del
   * mismo modelo no trae el bloque. Si no se pasa nada, no se emite nada.
   */
  loadCombinations?: Array<{ name: string; type?: string; cases?: Array<{ case: string; scaleFactor: number }> }>;
  /**
   * Patrones y casos del MODELO. Igual que las combinaciones, estaban escritos
   * a mano: todo e2k salia con "Dead" y "Live" aunque el modelo tuviera otros.
   * Si no se pasan, se mantiene ese par por defecto — las cargas nodales
   * necesitan un LC al que referirse.
   */
  loadPatterns?: Array<{ name: string; type?: string; selfWeightMultiplier?: number }>;
  /**
   * A que PATRON se cuelgan las cargas aplicadas por el usuario (nodales, de
   * vano y de superficie). Por defecto, el primer patron de tipo "Dead".
   *
   * ⚠️ Ese defecto SUMA DOS COSAS. Si el patron Dead lleva `SELFWEIGHT 1`,
   * ETABS ya le mete el peso propio de la estructura; si ademas se le cuelgan
   * ahi las cargas del usuario, el caso Dead es peso propio + sobrecarga, y el
   * caso Live sale con desplazamientos 0.000 en todos los nudos. Verificado en
   * ETABS sobre un modelo exportado: «3-D View - Displacements (Live)» con
   * Ux = Uy = Uz = 0.
   *
   * Para separarlos: `loadPatternDestino: "Live"`.
   */
  loadPatternDestino?: string;
  loadCases?: Array<{ name: string; type?: string; patterns?: Array<{ pattern: string; scaleFactor: number }> }>;
  /**
   * Carga de SUPERFICIE por elemento shell, tal como se asigno — no ya
   * convertida a nodal. Hekatan la reparte a los nudos con el vector de carga
   * consistente antes de resolver, asi que al llegar aca ya no existe: el e2k
   * salia con POINTLOAD donde ETABS pone AREALOAD. Se pasa aparte para poder
   * escribir el bloque que ETABS escribe.
   *   value = fuerza por unidad de AREA (mismas unidades que el resto)
   *   dir   = "GRAV" (default), "Z", "X", ... segun el eje al que va
   */
  shellLoads?: Map<number, { value: number; dir?: string; pattern?: string }>;
  /**
   * Diafragma rigido en los nudos de cabeza de columna y en las losas.
   *  - "auto" (default): se asigna DIAPH "D1", que es lo idiomatico en ETABS
   *    para un edificio y es como se validaron los ejemplos de edificio.
   *  - "none": no se asigna ninguno. Para modelos que NO lo declaran — el
   *    CLI Modeler, por ejemplo, donde el modelo es exactamente lo escrito.
   *    Ponerlo igual no era cosmetico: un diafragma rigido que el modelo
   *    original no tiene lo rigidiza lateralmente, asi que el e2k reimportado
   *    daba OTRA estructura.
   */
  diaphragm?: "auto" | "none" | "d1";
  /** Angulo del eje local 1 de cada shell, en grados. Es lo que decide a que
   *  vigas les entrega la carga un deck de un solo sentido. */
  shellAngles?: Map<number, number>;
  seismicNEC?: {
    points: [number, number][];
    name?: string;        // nombre de la función (default "NEC")
    dampRatio?: number;   // default 0.05
    caseName?: string;    // nombre del caso RS (default "Sismo NEC")
    modalCase?: string;   // caso modal de referencia (default "Modal")
    sfX?: number; sfY?: number;
    /** Define el caso Modal en el e2k (Eigen o Ritz + N° de modos), para que el RS
     *  tenga su MODALCASE y ETABS/SAP corran el mismo modal que Hekatan en Settings. */
    modal?: { ritz?: boolean; nModes?: number };
  };
  /** Nº de modos del caso `Modal` que se escribe en el e2k. Por defecto 12, los
   *  mismos que devuelve `_modal`: con menos, los modos altos de ETABS no se
   *  calculan y no hay contra que comparar los del motor. */
  modalModes?: number;
}

/**
 * Bloque e2k de una función de espectro de respuesta USER (puntos T,Sa).
 * Formato real de ETABS (verificado por RE):
 *   FUNCTION "<n>"  FUNCTYPE "SPECTRUM"  DAMPRATIO 0.05  SPECTYPE "USER"
 *   FUNCTION "<n>"  TIMEVAL "T1 Sa1  T2 Sa2  ..."
 * Lo lee CUALQUIER ETABS (19/22) y SAP2000 — NO depende de la NEC nativa
 * (`SPECTYPE "ECUADOR..."` solo abre en versiones que la traigan). Los puntos
 * salen del espectro NEC de Hekatan, que coincide 0.00% con la NEC nativa.
 */
export function necUserSpectrumE2k(
  name: string, points: [number, number][], dampRatio = 0.05,
): string[] {
  const pairs = points.map(([T, Sa]) => `${(+T).toFixed(4)} ${(+Sa).toFixed(5)}`).join("  ");
  return [
    `  FUNCTION "${name}"  FUNCTYPE "SPECTRUM"  DAMPRATIO ${dampRatio}  SPECTYPE "USER"  `,
    `  FUNCTION "${name}"  TIMEVAL "${pairs}"  `,
  ];
}

/**
 * Bloque e2k de un caso Response Spectrum (modal). Patrón verificado en modelos
 * reales de ETABS:  TYPE "Response Spectrum" + MODALCASE + ACCEL U1/U2 con FUNC y SF.
 * SF típico = g/(R·φP·φE) para pasar Sa[g]→fuerza (o ×V/Vt del control NEC §6.2.2).
 */
export function responseSpectrumCaseE2k(opt: {
  name: string; func: string; modalCase?: string; sfX?: number; sfY?: number;
}): string[] {
  const { name, func, modalCase = "Modal", sfX = 9.81, sfY = 9.81 } = opt;
  const L = [`  LOADCASE "${name}"  TYPE  "Response Spectrum"  MODALCASE  "${modalCase}"  `];
  if (sfX) L.push(`  LOADCASE "${name}"  ACCEL  "U1"  FUNC  "${func}"  SF  ${sfX}  `);
  if (sfY) L.push(`  LOADCASE "${name}"  ACCEL  "U2"  FUNC  "${func}"  SF  ${sfY}  `);
  return L;
}

/**
 * Bloque e2k del caso Modal (Eigen o Ritz). Sintaxis verificada en e2k reales de ETABS:
 *   LOADCASE "Modal"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"
 *   LOADCASE "Modal"  MAXMODES n MINMODES 1 EIGENSHIFTFREQ 0 EIGENCUTOFF 0 EIGENTOL 1E-09
 * Ritz: TYPE "Modal - Ritz" + vectores de carga por aceleración (UX/UY/UZ) — como ETABS.
 */
export function modalCaseE2k(opt: { name?: string; ritz?: boolean; nModes?: number }): string[] {
  const { name = "Modal", ritz = false, nModes = 12 } = opt;
  if (ritz) {
    return [
      `  LOADCASE "${name}"  TYPE  "Modal - Ritz"  INITCOND  "PRESET"  `,
      `  LOADCASE "${name}"  MAXMODES  ${nModes} MINMODES  1 `,
      `  LOADCASE "${name}"  LOADTYPE  "Accel"  LOADNAME  "UX"  RITZMAXCYCLES  0 `,
      `  LOADCASE "${name}"  LOADTYPE  "Accel"  LOADNAME  "UY"  RITZMAXCYCLES  0 `,
      `  LOADCASE "${name}"  LOADTYPE  "Accel"  LOADNAME  "UZ"  RITZMAXCYCLES  0 `,
    ];
  }
  return [
    `  LOADCASE "${name}"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  `,
    `  LOADCASE "${name}"  MAXMODES  ${nModes} MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 `,
  ];
}

export function exportE2k(input: ExportE2kInput): string {
  const raw = input.e2kModel?.rawSections;
  // Raw round-trip (preserva ETABS) o reconstrucción sintética.
  let e2k = (raw && raw.size > 0) ? exportFromRaw(raw, input.e2kModel!) : exportFromScratch(input);
  // Inyectar el sísmico NEC (función USER + caso RS) si se pidió. Sirve para
  // ambos modos: post-procesa la salida insertando en FUNCTIONS y LOAD CASES.
  if (input.seismicNEC) e2k = injectNecSeismic(e2k, input.seismicNEC);
  return e2k;
}

/** Inserta el espectro NEC USER-defined + caso Response Spectrum en un e2k ya armado. */
function injectNecSeismic(e2k: string, nec: NonNullable<ExportE2kInput["seismicNEC"]>): string {
  const nl = e2k.includes("\r\n") ? "\r\n" : "\n";
  const lines = e2k.split(/\r?\n/);
  const funcName = nec.name ?? "NEC";
  const fnLines = necUserSpectrumE2k(funcName, nec.points, nec.dampRatio ?? 0.05);
  const modalName = nec.modalCase ?? "Modal";
  const lcLines = responseSpectrumCaseE2k({
    name: nec.caseName ?? "Sismo NEC", func: funcName,
    modalCase: modalName, sfX: nec.sfX, sfY: nec.sfY,
  });
  // Caso Modal (Eigen/Ritz) según Settings.
  let modalLines: string[] = [];
  const tieneModal = (re: RegExp) => lines.some((l) => re.test(l));
  if (nec.modal) {
    // El usuario eligió método / N° de modos en Settings → REEMPLAZAR cualquier Modal case
    // por default (exportFromScratch pone MAXMODES 3) con el de Settings.
    const reDel = new RegExp(`^\\s*LOADCASE\\s+"${modalName}"\\s+(TYPE\\s+"Modal|MAXMODES|MINMODES|EIGEN|LOADTYPE|RITZ)`, "i");
    for (let k = lines.length - 1; k >= 0; k--) if (reDel.test(lines[k])) lines.splice(k, 1);
    modalLines = modalCaseE2k({ name: modalName, ritz: !!nec.modal.ritz, nModes: nec.modal.nModes });
  } else if (!tieneModal(new RegExp(`LOADCASE\\s+"${modalName}"\\s+TYPE\\s+"Modal`))) {
    modalLines = modalCaseE2k({ name: modalName });
  }
  insertAfterSection(lines, "FUNCTIONS", fnLines);
  // El caso Modal va ANTES del RS (el RS lo referencia con MODALCASE).
  insertAfterSection(lines, "LOAD CASES", [...modalLines, ...lcLines]);
  return lines.join(nl);
}

/** Inserta `payload` tras el header `$ <section>`; si la sección no existe, la crea antes de END. */
function insertAfterSection(lines: string[], section: string, payload: string[]): void {
  const i = lines.findIndex((l) => l.trim() === `$ ${section}`);
  if (i >= 0) { lines.splice(i + 1, 0, ...payload); return; }
  const endIdx = lines.findIndex((l) => l.trim() === "END");
  const at = endIdx >= 0 ? endIdx : lines.length;
  lines.splice(at, 0, `$ ${section}`, ...payload, ``);
}

/**
 * Re-emit the original e2k file sections verbatim.
 * This preserves ETABS compatibility perfectly.
 */
function exportFromRaw(raw: Map<string, string[]>, model: E2kModel): string {
  const out: string[] = [];

  // Ordered section names as they appear in ETABS e2k files
  const sectionOrder = [
    "PROGRAM INFORMATION",
    "CONTROLS",
    "STORIES - IN SEQUENCE FROM TOP",
    "GRIDS",
    "DIAPHRAGM NAMES",
    "MATERIAL PROPERTIES",
    "REBAR DEFINITIONS",
    "FRAME SECTIONS",
    "AUTO SELECT SECTION LISTS",
    "CONCRETE SECTIONS",
    "WALL/SLAB/DECK SECTIONS",
    "POINT COORDINATES",
    "LINE CONNECTIVITIES",
    "AREA CONNECTIVITIES",
    "POINT ASSIGNS",
    "LINE ASSIGNS",
    "AREA ASSIGNS",
    "LOAD PATTERNS",
    "POINT OBJECT LOADS",
    "FRAME OBJECT LOADS",
    "SHELL OBJECT LOADS",
    "ANALYSIS OPTIONS",
    "MASS SOURCE",
    "FUNCTIONS",
    "LOAD CASES",
    "LOAD COMBINATIONS",
  ];

  out.push(`$ File exported from Hekatan Struct Lineal (round-trip)`);
  out.push(``);

  for (const secName of sectionOrder) {
    const lines = raw.get(secName);
    if (!lines || lines.length === 0) continue;
    out.push(`$ ${secName}`);
    for (const line of lines) {
      out.push(line);
    }
    out.push(``);
  }

  // Emit any sections not in our ordered list
  for (const [secName, lines] of raw) {
    if (sectionOrder.includes(secName)) continue;
    if (lines.length === 0) continue;
    out.push(`$ ${secName}`);
    for (const line of lines) {
      out.push(line);
    }
    out.push(``);
  }

  out.push(`  END`);
  out.push(`$ END OF MODEL FILE`);
  return out.join("\r\n");
}

/**
 * Best-effort reconstruction when no original e2k exists.
 *
 * Internal model units (Hekatan-Struct convention, see shared/units.ts):
 *   - Force:  kN
 *   - Length: m
 *   - E:      kN/m²
 *
 * Output target units come from `units` arg. We convert numbers accordingly.
 */
function exportFromScratch(input: ExportE2kInput): string {
  const { nodes, elements, nodeInputs, elementInputs, title, units } = input;
  // Si el llamador no los pasa aparte, salen de elementInputs — que es donde
  // los deja el modelador, igual que los modificadores de shell.
  const shellLoadsRaw = input.shellLoads
    ?? (elementInputs as any).shellSurfaceLoads as Map<number, number> | undefined;
  type QArea = { value: number; dir?: string; pattern?: string };
  let shellLoads: Map<number, QArea> | undefined;
  if (shellLoadsRaw instanceof Map) {
    shellLoads = new Map<number, QArea>();
    shellLoadsRaw.forEach((v: number | QArea, k: number) => {
      shellLoads!.set(k, typeof v === "number" ? { value: v } : v);
    });
  }
  const shellAngles = input.shellAngles
    ?? (elementInputs as any).shellAngles as Map<number, number> | undefined;
  // La parte de la carga nodal que vino de un area NO se emite como POINTLOAD:
  // ya sale como AREALOAD sobre el objeto, y emitir las dos la duplica. Este
  // es el criterio unico — lo usan tanto POINT ASSIGNS (para no registrar
  // plan-points que no van a llevar nada) como POINT OBJECT LOADS.
  const deArea = (elementInputs as any).cargaDeArea as Map<number, number> | undefined;
  const hayAreaLoads = !!(shellLoads && shellLoads.size > 0);
  // ── Modo AUTO EXACTO (modelos del .heks): el modelador ya repartio a los
  // nudos las cargas de barra (w*L/2 y L^2/12*(t x w)) y el peso propio
  // (rho*A*L/2, luz libre en vigas; rho*t*A/4 en cascaras). En "auto" ETABS
  // calcula esas dos por su cuenta (LINELOAD + SELFWEIGHT), asi que hay que
  // DESCONTARLAS de las nodales o van dos veces. Se recalculan aqui con las
  // MISMAS formulas del cliModeler (galpon: 4078.448 kN exactos).
  const swDecl = (elementInputs as any).selfWeight as number | undefined;
  const fLoadsAll = (elementInputs as any).frameLoads as Map<number, [number, number, number]> | undefined;
  const modoExacto = (input.weightMode ?? "auto") === "auto" && swDecl !== undefined;
  const restaExtra = new Map<number, number[]>();
  const restar = (n: number, v: number[]) => {
    const a = restaExtra.get(n) ?? [0, 0, 0, 0, 0, 0];
    restaExtra.set(n, a.map((x, k) => x + v[k]));
  };
  /** Barras cuya carga repartida va como LINELOAD (no las de una cadena de columnas). */
  const conLineLoad = new Set<number>();
  if (modoExacto) {
    if (fLoadsAll) for (const [idx, w] of fLoadsAll) {
      const el = elements[idx]; if (!el || el.length !== 2) continue;
      const a = nodes[el[0]], b = nodes[el[1]];
      const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]; const L = Math.hypot(d[0], d[1], d[2]);
      if (L < 1e-9) continue;
      const t = [d[0] / L, d[1] / L, d[2] / L], c = L * L / 12;
      const txw = [t[1] * w[2] - t[2] * w[1], t[2] * w[0] - t[0] * w[2], t[0] * w[1] - t[1] * w[0]];
      restar(el[0], [w[0] * L / 2, w[1] * L / 2, w[2] * L / 2, c * txw[0], c * txw[1], c * txw[2]]);
      restar(el[1], [w[0] * L / 2, w[1] * L / 2, w[2] * L / 2, -c * txw[0], -c * txw[1], -c * txw[2]]);
      conLineLoad.add(idx);
    }
    if (swDecl && swDecl > 0) {
      const G = 9.80665;
      const eoAll = (elementInputs as any).endOffsets as Map<number, number[]> | undefined;
      elements.forEach((e, i) => {
        const rho = elementInputs.densities?.get(i) ?? 0;
        if (!rho) return;
        if (e.length === 2) {
          const A = elementInputs.areas?.get(i) ?? 0;
          const p0 = nodes[e[0]], p1 = nodes[e[1]];
          const d = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
          let L = Math.hypot(d[0], d[1], d[2]);
          const eo = eoAll?.get(i);
          if (eo) {
            const dh = Math.hypot(d[0], d[1]);
            const esViga = dh > 1e-9 && Math.abs(Math.atan2(Math.abs(d[2]), dh)) * 180 / Math.PI < 20;
            if (esViga) L = Math.max(L - eo[0] - eo[1], 0);
          }
          const W = A * L * rho * G * swDecl;
          restar(e[0], [0, 0, -W / 2, 0, 0, 0]); restar(e[1], [0, 0, -W / 2, 0, 0, 0]);
        } else if (e.length === 4) {
          const t = elementInputs.thicknesses?.get(i) ?? 0;
          const P = e.map(n => nodes[n]);
          let nx = 0, ny = 0, nz = 0;
          for (let k = 0; k < 4; k++) {
            const a = P[k], b = P[(k + 1) % 4];
            nx += a[1] * b[2] - a[2] * b[1]; ny += a[2] * b[0] - a[0] * b[2]; nz += a[0] * b[1] - a[1] * b[0];
          }
          const Ar = Math.hypot(nx, ny, nz) / 2;
          const W = t * Ar * rho * G * swDecl;
          for (const n of e) restar(n, [0, 0, -W / 4, 0, 0, 0]);
        }
      });
    }
  }
  /** Carga nodal que de verdad se va a escribir, ya descontada la del area
   *  (y, en modo auto exacto, la de barra y el peso propio). */
  const cargaPropia = (nodeIdx: number, load: readonly number[]): [number, number, number] => {
    const r = restaExtra.get(nodeIdx);
    return [load[0] - (r?.[0] ?? 0), load[1] - (r?.[1] ?? 0),
            load[2] - (hayAreaLoads ? (deArea?.get(nodeIdx) ?? 0) : 0) - (r?.[2] ?? 0)];
  };
  /** Momentos nodales que de verdad se escriben (descontado el empotramiento de LINELOAD). */
  const momentoPropio = (nodeIdx: number, load: readonly number[]): [number, number, number] => {
    const r = restaExtra.get(nodeIdx);
    return [(load[3] ?? 0) - (r?.[3] ?? 0), (load[4] ?? 0) - (r?.[4] ?? 0), (load[5] ?? 0) - (r?.[5] ?? 0)];
  };
  // ⚠️ N y MM SIEMPRE. El lector del e2k de ETABS **no tiene token de
  // unidades** — comprobado en el binario (ETABS.dll ~0x03490e00: sus palabras
  // clave son LINE/COLUMN/BEAM/BRACE/$ CONTROLS/TITLE1/TITLE2/PREFERENCE, y
  // UNITS no esta) y comprobado midiendo (con "Tonf", "KN" y "KN"/"M" el
  // resultado es identico). Lee todo en las unidades base de SAPFire, N y mm.
  // Escribir en tonf-m hacia que ETABS leyera A con factor 1e-6, E con x102 y
  // las cargas con 1e-3: de 4078.45 kN llegaban 0.42.
  const force = "N";
  const length = "MM";
  const lines: string[] = [];
  const rd = (v: number) => Math.round(v * 10000) / 10000;
  /**
   * Las CARGAS tampoco pueden ir por `rd`: al pasar de kN a tonf, una carga de
   * -1 kN queda en -0.1020 tonf, que son -1.00028 kN. Medido contra ETABS: la
   * suma de FZ del galpon salia -45.0125 en vez de -45.0000, un +0.028 %. Poco,
   * pero es un error que se mete SOLO por como se escribe el fichero, y encima
   * crece si las unidades del e2k son mas grandes que las del modelo.
   */
  /**
   * Para PROPIEDADES DE SECCION, no coordenadas. `rd` redondea a 4 decimales,
   * que en metros esta bien para una longitud pero aniquila una inercia: I de
   * un perfil de 25 cm vale 3.1e-5 m^4 y salia como "0". El e2k exportado
   * llevaba I33 0 e I22 0, o sea barras sin rigidez a flexion.
   */
  const rp = (v: number) => {
    if (!isFinite(v) || v === 0) return "0";
    return Number(v.toPrecision(10)).toString();
  };

  // ── UNIT CONVERSION (internal kN-m → target force-length) ────────────
  // Hekatan-Struct stores everything in kN-m internally. ETABS .e2k accepts
  // any consistent system as long as numbers + UNITS header agree.
  // 1 tonf = 9.80665 kN  (force unit)
  // 1 m    = 1 m         (length unaltered, all SI variants use meters)
  const forceFactor = 1000;              // kN → N
  const lengthFactor = 1000;             // m  → mm
  /** longitud: metros del modelo → milimetros del fichero */
  const cL = (m: number) => m * lengthFactor;
  // Force conversion (loads, reactions, point loads)
  const cF  = (kN: number) => kN * forceFactor;
  // ⚠️ LAS CARGAS NODALES VAN EN NEWTONS, SIEMPRE.
  //
  // El comentario de arriba decia que "ETABS acepta cualquier sistema
  // consistente mientras los numeros y el header UNITS concuerden". **Es
  // falso, y esta medido**: con `UNITS "Tonf" "m"` y `FZ -0.1736`, ETABS
  // importa `-0.00017357 kN`, o sea lee el numero como NEWTONS y lo pasa a kN
  // dividiendo por 1000. Con `UNITS "KN"` hace exactamente lo mismo: ignora el
  // header para las cargas. Las LONGITUDES si respetan el header (el modelo
  // sale bien colocado), solo las fuerzas no.
  //
  // Consecuencia sin esto: de los 4078.45 kN del galpon llegaban **0.42 kN** y
  // el modelo reimportado resolvia con la deformada en cero, sin un solo aviso.
  // Y encaja con lo que exporta el propio ETABS, que escribe `UNITS "N" "MM"`
  // y `FX 100000` para una carga de 100 kN.
  const cFN = (kN: number) => kN * forceFactor;
  // ⚠️ Un MOMENTO no es una fuerza: es fuerza x longitud. Con el fichero en
  // N y mm, kN·m -> N·mm son 1e6, no 1e3. Escribiendolo con el factor de
  // fuerza los momentos de empotramiento entran MIL VECES pequeños, o sea
  // como si no estuvieran — y son justo lo que distingue una viga continua de
  // un reparto nodal.
  const cMN = (kNm: number) => kNm * forceFactor * lengthFactor;
  // Stress conversion (E, fy): kN/m² → tonf/m² = same factor as force
  // tension: kN/m2 → N/mm2  (x1000 de fuerza / 1e6 de area)
  const cE  = (kN_m2: number) => kN_m2 * forceFactor / (lengthFactor ** 2);
  // Volume weight: kN/m³ → tonf/m³ = same factor as force (length cancels)
  // peso por volumen: kN/m3 → N/mm3
  const cWV = (kN_m3: number) => kN_m3 * forceFactor / (lengthFactor ** 3);

  // Header reconocido por ETABS 22.x. PROGRAM debe decir "ETABS" exactamente
  // o ETABS rechaza el archivo con "May not be a valid ETABS X.X.X text file".
  // Ground truth: Benchmark_Placa/.../etabs_canonical/case_cantileverBeam.e2k (ETABS 22.6.0).
  const now = new Date();
  const dateStr = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}  ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  lines.push(`$ File   "Hekatan_export.e2k"  saved ${dateStr} in ETABS 22.6.0`);
  lines.push(``);
  lines.push(`$ PROGRAM INFORMATION`);
  lines.push(`  PROGRAM  "ETABS"  VERSION "22.6.0"  `);
  lines.push(``);
  lines.push(`$ CONTROLS`);
  lines.push(`  UNITS  "${force}"  "${length}"  "C"  `);
  lines.push(`  TITLE1  "Hekatan Struct Lineal export"  `);
  if (title) lines.push(`  TITLE2  "${title}"  `);
  // MERGETOL 0.001 (1mm) — match ETABS GUI default, evita over-merge de joints
  // próximos en plan distinto. El 0.1 anterior era loose y podía mergear
  // joints que no debían unirse.
  lines.push(`  PREFERENCE  MERGETOL 0.001`);
  lines.push(`  RLLF  METHOD "ASCE7-10"  USEDEFAULTMIN "YES"  `);
  lines.push(``);

  // GRIDSYSTEM + GRID lines (X y Y) — ETABS-idiomatic, mejora UX en GUI.
  // X grids → letras (A, B, C, ...) | Y grids → números (1, 2, 3, ...)
  // No afectan el análisis pero hacen el modelo legible al abrir en GUI.
  const xValuesSet = new Set<number>();
  const yValuesSet = new Set<number>();
  nodes.forEach(n => { xValuesSet.add(rd(n[0])); yValuesSet.add(rd(n[1])); });
  const xValues = [...xValuesSet].sort((a, b) => a - b);
  const yValues = [...yValuesSet].sort((a, b) => a - b);
  lines.push(`$ GRIDS`);
  lines.push(`  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 `);
  xValues.forEach((x, i) => {
    // Letras A-Z, después AA, BB, ... (raro pasar de 26 grids)
    const label = i < 26 ? String.fromCharCode(65 + i) : String.fromCharCode(65 + (i % 26)).repeat(Math.floor(i / 26) + 1);
    lines.push(`  GRID "G1"  LABEL "${label}"  DIR "X"  COORD ${x}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  });
  yValues.forEach((y, i) => {
    lines.push(`  GRID "G1"  LABEL "${i + 1}"  DIR "Y"  COORD ${y}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  });
  lines.push(``);

  // Stories from Z elevations.
  // Hekatan-Struct uses Z-up convention (CLAUDE.md: THREE.Object3D.DEFAULT_UP=(0,0,1)).
  // Node = [x_horizontal, y_horizontal, z_vertical]. ETABS .e2k POINT format
  // is (id, X, Y) with Z derived from STORY assignment.
  // UNA PLANTA POR NIVEL REAL, no una por cada cota de nudo.
  //
  // Antes se creaba un `Level_i` por CADA z distinta. En una nave con la
  // cubierta inclinada y una rampa eso da 52 plantas (medido en el galpon:
  // Level_1 a 0.1471 m, Level_10 a 0.0884...) contra las 4 que escribe ETABS.
  // Y no es cosmetico: ETABS reparte la masa POR PISO, asi que 52 pisos de dos
  // nudos cada uno destrozan el modal.
  //
  // Criterio: es PLANTA la cota que reune al menos `MIN_NUDOS` nudos. Las
  // demas —la rampa subiendo, el faldon de cubierta— cuelgan de la planta
  // inmediatamente superior con un DESCENSO, que es exactamente como lo
  // resuelve ETABS (el 3er campo del POINT).
  const MIN_NUDOS = 3;
  const TOL_PLANTA = 0.5;      // m: cotas mas juntas que esto son la MISMA planta
  const cuenta = new Map<number, number>();
  nodes.forEach(n => {
    const z = rd(n[2]);
    cuenta.set(z, (cuenta.get(z) ?? 0) + 1);
  });
  const zSet = new Set<number>();
  nodes.forEach(n => zSet.add(rd(n[2])));
  const todasZ = [...zSet].sort((a, b) => a - b);
  let sortedZ = todasZ.filter(z => (cuenta.get(z) ?? 0) >= MIN_NUDOS);
  // Fusionar cotas casi iguales: las 12 correas de una cubierta inclinada
  // tienen muchos nudos cada una y estan a 9 cm de distancia — con el filtro de
  // MIN_NUDOS solo, salian 15 plantas de 0.0921 m de altura. Se conserva la
  // mas ALTA del grupo, y las de abajo cuelgan de ella con descenso.
  if (sortedZ.length > 1) {
    const fus: number[] = [sortedZ[0]];
    for (const z of sortedZ.slice(1)) {
      if (z - fus[fus.length - 1] < TOL_PLANTA) fus[fus.length - 1] = z;
      else fus.push(z);
    }
    sortedZ = fus;
  }
  // Si NO hay ninguna planta real (una malla que no es un edificio: la membrana
  // de Cook, una cascara 3D, un talud), NO se pone una planta por cada cota.
  // Se pone UNA sola y todo cuelga de ella con su descenso — que es
  // exactamente lo que hace ETABS. Comprobado pidiendole a ETABS que exportara
  // su propio e2k del mismo modelo (galpon-bodega-electoral/e2k_de_etabs.py):
  //
  //     ETABS    81 POINT, cada uno con su DESCENSO, todos a "Story1"
  //     Hekatan   9 POINT sin descenso, repartidos en 44 "Level_i"
  //
  // Con 9 puntos y 44 plantas, ETABS al reimportar coloca cada punto en la
  // elevacion de SU planta; como el punto es el mismo para toda la columna,
  // salian 168 nudos y 36 areas en vez de 81 y 64: OTRO modelo. El fallback de
  // "si no hay plantas, que TODAS las cotas sean planta" era justo lo contrario
  // de lo que hay que hacer.
  if (!sortedZ.length) sortedZ = [todasZ[0], todasZ[todasZ.length - 1]];
  if (sortedZ[0] !== todasZ[0]) sortedZ.unshift(todasZ[0]);
  if (sortedZ[sortedZ.length - 1] !== todasZ[todasZ.length - 1])
    sortedZ.push(todasZ[todasZ.length - 1]);

  const storyNames: string[] = [];
  const zToStory = new Map<number, string>();
  storyNames.push("Base");
  zToStory.set(sortedZ[0], "Base");
  for (let i = 1; i < sortedZ.length; i++) {
    const name = `Level_${i}`;
    storyNames.push(name);
    zToStory.set(sortedZ[i], name);
  }
  /** Planta de una cota cualquiera: la primera >= z (se cuelga con descenso). */
  const plantaDe = (z: number): { story: string; dz: number } => {
    const zz = rd(z);
    if (zToStory.has(zz)) return { story: zToStory.get(zz)!, dz: 0 };
    for (let i = 0; i < sortedZ.length; i++) {
      if (sortedZ[i] >= zz) return { story: zToStory.get(sortedZ[i])!,
                                     dz: rd(sortedZ[i] - zz) };
    }
    const ult = sortedZ[sortedZ.length - 1];
    return { story: zToStory.get(ult)!, dz: rd(ult - zz) };
  };

  lines.push(`$ STORIES - IN SEQUENCE FROM TOP`);
  for (let i = sortedZ.length - 1; i >= 1; i--) {
    lines.push(`  STORY "${storyNames[i]}"  HEIGHT ${rd(cL(sortedZ[i] - sortedZ[i - 1]))} MASTERSTORY "Yes"  `);
  }
  // ELEV va en las unidades del fichero (mm) como HEIGHT: sin cL() la base de la cimentacion a -0.5 m salia a -0.5 mm (medido 5-sep-2026: ETABS devolvia las cotas 0.4995 m mas arriba).
  if (sortedZ.length > 0) lines.push(`  STORY "Base"  ELEV ${rd(cL(sortedZ[0]))} `);
  lines.push(``);

  // DIAPHRAGM siempre — para ETABS-idiomatic export. Usado para asignar a
  // top joints de columnas verticales (estándar ETABS) y para top joints de
  // shells (losas / muros). Default RIGID (típico).
  const hasQ4 = elements.some(el => el.length === 4);
  {
    lines.push(`$ DIAPHRAGM NAMES`);
    lines.push(`  DIAPHRAGM "D1"    TYPE RIGID`);
    lines.push(``);
  }

  // ── MATERIAL PROPERTIES ─────────────────────────────────────────────
  // Detect material type by E (kN/m² = Pa·1000):
  //   E ≥ 100,000,000 kN/m² (= 100 GPa) → STEEL  (acero ~200 GPa)
  //   E <  100,000,000 kN/m²            → CONCRETE (hormigón ~25 GPa)
  // Auto-emit weight per volume + Poisson + thermal coeff for each.
  lines.push(`$ MATERIAL PROPERTIES`);
  // Un material por (E, PESO), no solo por E: el CFT del galpon (acero relleno,
  // 13.24 t/m3) y sus vigas (7.95 t/m3) tienen el mismo E; con un material por E
  // ETABS pesaba las columnas como acero y la carga muerta salia -0.99 %
  // (medido 2-sep-2026, modo auto). La clave es `${E}|${w kN/m3}`.
  const G_KN_PER_KG = 9.80665e-3;  // kg/m3 -> kN/m3
  const wpvDe = (elemIdx: number): number | undefined => {
    const rho = elementInputs.densities?.get(elemIdx);
    if (rho === undefined) return undefined;
    // Heuristica de unidad: > 100 -> kg/m3 (acero 7850); si no, t/m3
    return rho > 100 ? rho * G_KN_PER_KG : rho * 9.80665;
  };
  const matKeyDe = (elemIdx: number): string => {
    const E = elementInputs.elasticities?.get(elemIdx) ?? 0;
    const w = wpvDe(elemIdx);
    return `${E}|${w === undefined ? "-" : w.toFixed(4)}`;
  };
  const uniqueE = new Set<string>();
  elementInputs.elasticities?.forEach((_v, i) => uniqueE.add(matKeyDe(i)));
  const matNames = new Map<string, string>();
  const matIsSteel = new Map<string, boolean>();
  let miStl = 0, miCnc = 0;
  // Buscar densidad real por valor de E (densities está en kg/m³ → kN/m³ × g)
  // Si hekatan provee densidades por elemento, usamos la moda para el material
  // que comparte ese E. Si no hay densidades, fallback a defaults estándar.
  for (const matKey of uniqueE) {
    const E_kNm2 = parseFloat(matKey.split("|")[0]);
    const wKey = matKey.split("|")[1];
    const isSteel = E_kNm2 >= 1e8;  // >= 100 GPa
    const name = isSteel ? `Steel_${++miStl}` : `Conc_${++miCnc}`;
    matNames.set(matKey, name);
    matIsSteel.set(matKey, isSteel);

    // Weight per volume: la densidad real del modelo si la hay; si no,
    // defaults (steel ~ 76.97, concrete ~ 24.0 kN/m3)
    const wpv_kN = wKey !== "-" ? parseFloat(wKey) : (isSteel ? 76.97 : 24.0);
    const E_out  = cE(E_kNm2);
    const wpv_out = cWV(wpv_kN);
    // ⚠️ El Poisson iba FIJO (0.3 acero / 0.2 hormigon), sin mirar el modelo.
    // Con un modelo de nu = 0 el .e2k salia con U 0.2 y ETABS daba 1.491651
    // donde el mismo modelo montado por la OAPI da 1.500000 exacto. Ese 0.5 %
    // parecia del exportador de geometria o del tipo de cascara: era el
    // MATERIAL. Ahora se toma el declarado (poissonsRatios, que es donde lo
    // ponen las cascaras) y solo se cae al tipico si no hay ninguno.
    const nuDecl = (() => {
      const pr = (input.elementInputs as any).poissonsRatios as Map<number, number> | undefined;
      if (!pr) return undefined;
      for (const [idx, v] of pr) {
        if (matKeyDe(idx) === matKey) return v;
      }
      return undefined;
    })();
    const nu = nuDecl !== undefined ? nuDecl : (isSteel ? 0.3 : 0.2);
    const alpha = isSteel ? 1.17e-5 : 1.0e-5;

    if (isSteel) {
      lines.push(`  MATERIAL  "${name}"    TYPE "Steel"    GRADE "Grade 50"    WEIGHTPERVOLUME ${rp(wpv_out)}`);
      lines.push(`  MATERIAL  "${name}"    SYMTYPE "Isotropic"  E ${rd(E_out)}  U ${nu}  A ${alpha}`);
      // FY/FU típicos A572Gr50 en tonf/m² (35,153 / 45,699)
      const fy_kN = 345e3, fu_kN = 450e3;
      lines.push(`  MATERIAL  "${name}"  FY ${rd(cE(fy_kN))}  FU ${rd(cE(fu_kN))}  FYE ${rd(cE(fy_kN*1.1))}  FUE ${rd(cE(fu_kN*1.1))}`);
    } else {
      lines.push(`  MATERIAL  "${name}"    TYPE "Concrete"    WEIGHTPERVOLUME ${rp(wpv_out)}`);
      lines.push(`  MATERIAL  "${name}"    SYMTYPE "Isotropic"  E ${rd(E_out)}  U ${nu}  A ${alpha}`);
      // f'c típico 24 MPa en tonf/m² (≈ 2,448)
      const fc_kN = 24e3;
      lines.push(`  MATERIAL  "${name}"    FC ${rd(cE(fc_kN))}`);
    }
  }
  // El HORMIGON DE RELLENO de las columnas CFT: en ETABS la "Filled Steel Tube"
  // lleva MATERIAL (el acero) y FILLMATERIAL. Su peso: ETABS suma acero·wpv_s +
  // relleno·wpv_c; Hekatan pone wpv sobre el area TRANSFORMADA. Con
  // wpv_c = n·wpv_s la carga muerta por metro sale identica.
  const fillMatOf = new Map<number, string>();
  {
    const fillNames = new Map<string, string>();
    const shapes = (elementInputs as any).sectionShapes as Map<number, any> | undefined;
    shapes?.forEach((sh, idx) => {
      if (sh?.type !== "CFT" || !(sh.fillE > 0)) return;
      const Es = elementInputs.elasticities?.get(idx) ?? 0; if (!(Es > 0)) return;
      const n = sh.fillE / Es;
      const wS = wpvDe(idx) ?? 76.97;
      const key = `${sh.fillE}|${(n * wS).toFixed(4)}`;
      let name = fillNames.get(key);
      if (!name) {
        name = `ConcFill_${fillNames.size + 1}`; fillNames.set(key, name);
        lines.push(`  MATERIAL  "${name}"    TYPE "Concrete"    WEIGHTPERVOLUME ${rp(cWV(n * wS))}`);
        lines.push(`  MATERIAL  "${name}"    SYMTYPE "Isotropic"  E ${rd(cE(sh.fillE))}  U 0.2  A 1.0e-5`);
        lines.push(`  MATERIAL  "${name}"    FC ${rd(cE(24e3))}`);
      }
      fillMatOf.set(idx, name);
    });
  }
  lines.push(``);

  // ── FRAME SECTIONS ──────────────────────────────────────────────────
  // Si hay sectionShapes válidos: usar dimensiones del shape.
  // Si NO: derivar h, b equivalentes desde area / momentos de inercia
  //        (rectangular equivalent), de modo que ETABS calcule la misma A,
  //        I33, I22 que tiene Hekatan.
  //
  // Para una sección rectangular b×h:
  //   A    = b·h
  //   I33  = b·h³/12   (eje fuerte, "y" en Hekatan / "I22" en ETABS si col)
  //   I22  = h·b³/12   (eje débil)
  //
  // Conociendo A, I33, I22:
  //   h = √(12·I33 / b), pero b = A/h ⇒ h⁴ = 12·I33·h/A ⇒ h³ = 12·I33/A · h
  //   Mejor: h = √(12·I33/A)·something… resolvemos como sistema:
  //     b·h = A
  //     b·h³ = 12·I33
  //   Dividiendo:  h² = 12·I33 / A     →  h = √(12·I33/A)
  //                b  = A / h
  lines.push(`$ FRAME SECTIONS`);
  const writtenSections = new Set<string>();
  const elemToSecName = new Map<number, string>();
  const shapeKeyToSecName = new Map<string, string>();

  const minDim = 0.05; // 5 cm mínimo, evita "R0x0"

  elements.forEach((el, i) => {
    if (el.length !== 2) return;
    const shape = elementInputs.sectionShapes?.get(i);
    const E_kNm2 = elementInputs.elasticities?.get(i) ?? 0;
    const matName = matNames.get(matKeyDe(i)) || "Conc_1";
    const isSteel = matIsSteel.get(matKeyDe(i)) ?? (E_kNm2 >= 1e8);

    const A      = elementInputs.areas?.get(i) ?? 0;
    // Ejes locales en convencion CSI: momentsOfInertiaZ ES I33 y la Y es I22.
    // Antes iban cruzados porque la triada de Hekatan tambien lo estaba.
    const I33    = elementInputs.momentsOfInertiaZ?.get(i) ?? 0;
    const I22    = elementInputs.momentsOfInertiaY?.get(i) ?? 0;
    const J      = elementInputs.torsionalConstants?.get(i) ?? 0;

    // "general" no es una forma geometrica sino "sin forma, con propiedades":
    // por eso se ensancha el tipo mas alla de las de SectionShape.
    let stype: SectionShape["type"] | "general" = shape?.type || "rect";
    let h     = shape?.h ?? 0;
    let b     = shape?.b ?? 0;
    let d     = shape?.d ?? 0;
    const tfw = shape?.tf ?? 0;
    const tww = shape?.tw ?? 0;

    // Si no hay shape pero SI hay propiedades, se exporta la seccion GENERAL
    // con A, I33, I22 y J tal cual. Antes se invertia A e I33 para inventar un
    // rectangulo equivalente — y un rectangulo no puede casar las CUATRO: el
    // I22 y el J salian los del rectangulo, no los del perfil. Medido: el
    // mezanine reimportado daba -88.4 mm contra los -2.7 mm del modelo nativo,
    // 32 veces mas blando. ETABS acepta SHAPE "General" con estos valores
    // exactos — es lo que usa su propia API (SetGeneral).
    const sinForma = !shape && h <= 0 && b <= 0 && d <= 0;
    const general = sinForma && A > 0 && I33 > 0 && I22 > 0;
    if (general) {
      // D y B no entran en la rigidez (mandan AREA/I33/I22/TORSION), pero
      // ETABS saca de ellos los BRAZOS de los extremos. Si el modelo declara
      // el canto real se usa ese; si no, hay que caer en el rectangulo
      // equivalente — y para un perfil I eso da otro canto (VA-250: 0.357 m
      // en vez de 0.250), asi que el brazo sale mayor y los momentos se
      // reportan en otro sitio. La rigidez no cambia: el factor de zona
      // rigida es 0 por defecto (medido en re_brazos_rigidos_etabs.py).
      const dDecl = (elementInputs as any).cantos?.get(i) as number | undefined;
      const bDecl = (elementInputs as any).anchos?.get(i) as number | undefined;
      h = dDecl && dDecl > 0 ? dDecl : Math.sqrt(12 * I33 / A);
      b = bDecl && bDecl > 0 ? bDecl : A / h;
      if (!isFinite(h) || h < minDim) h = minDim;
      if (!isFinite(b) || b < minDim) b = minDim;
      stype = "general";
    }
    else if (h <= 0 && b <= 0 && d <= 0 && A > 0) {
      if (I33 > 0) {
        h = Math.sqrt(12 * I33 / A);
        b = A / h;
      } else {
        // Sección sin I → cuadrada equivalente
        h = b = Math.sqrt(A);
      }
      // Defaults razonables si los cálculos dan dimensiones absurdas
      if (!isFinite(h) || h < minDim) h = minDim;
      if (!isFinite(b) || b < minDim) b = minDim;
      stype = "rect";
    }
    // Si todavía no tenemos dimensiones, usar default
    if (h <= 0 && b <= 0 && d <= 0) {
      h = 0.30; b = 0.30; stype = "rect";
    }

    // El NOMBRE entra en la clave: dos secciones que se llaman distinto son
    // secciones distintas, aunque sus dimensiones no se conozcan. Sin esto,
    // todas las que traen D/B sin declarar caian en la misma clave
    // (`general_NaN_NaN_...`) y se fundian en una sola: medido, las 723 barras
    // del galpon salian con 2 secciones y COL-150 se comia 609 de ellas.
    const shapeKey = shape?.name
      ? `NAME_${shape.name}`
      : `${stype}_${rd(h)}_${rd(b)}_${rd(d)}_${rd(tfw)}_${rd(tww)}_${matName}`;
    if (shape?.name && !shapeKeyToSecName.has(shapeKey)) {
      shapeKeyToSecName.set(shapeKey, shape.name);
    }
    let secName = shapeKeyToSecName.get(shapeKey);
    if (!secName) {
      const tag = isSteel ? "S" : "C";
      if (stype === "general")  secName = `${tag}_G${writtenSections.size + 1}`;
      else if (stype === "rect")secName = `${tag}_R${Math.round(b*100)}x${Math.round(h*100)}`;
      else if (stype === "circ")secName = `${tag}_C_D${Math.round(d*100)}`;
      else if (stype === "I")   secName = `${tag}_I${Math.round(h*100)}x${Math.round(b*100)}`;
      else if (stype === "HSS") secName = `${tag}_HSS${Math.round(b*100)}x${Math.round(h*100)}x${Math.round(tww*1000)}`;
      else                      secName = `${tag}_Sec${writtenSections.size + 1}`;
      shapeKeyToSecName.set(shapeKey, secName);
    }
    elemToSecName.set(i, secName);

    if (writtenSections.has(secName)) return;
    writtenSections.add(secName);

    // ETABS shape selection — IMPORTANTE:
    //
    // ETABS 22 NO acepta "Steel Rectangular" como SHAPE built-in (no existe).
    // Para perfiles steel sólidos rectangulares, ETABS espera "Steel Plate"
    // o un steel-tube degenerado. La opción más robusta y portable es usar
    // "Concrete Rectangular" como shape geométrico — ETABS lo acepta y usa
    // SOLO la geometría (D, B); el MATERIAL referenciado (Steel_1 con E=200GPa)
    // determina las propiedades del análisis. El nombre "Concrete" es solo
    // una etiqueta en el catálogo de shapes.
    //
    // Shapes válidos en ETABS E2K (verificados 22.6.0):
    //   "Concrete Rectangular"  → rect sólido (cualquier material)
    //   "Concrete Circle"       → circ sólido
    //   "Steel I/Wide Flange"   → I beam (D B TF TW T2b TFb)
    //   "Steel Tube"            → HSS rect hueco (D B TF, TF=wall thick)
    //   "Steel Pipe"            → HSS circ hueco (D TF)
    //   "Steel Channel"         → C
    //   "Steel Angle"           → L
    //   "Filled Steel Tube"     → CFT (D B TF + FILLMATERIAL)
    // ⚠️ SIEMPRE "General" cuando el modelo trae A / I33 / I22.
    //
    // Con una forma PARAMETRICA ("Concrete Rectangular", "Steel I/Wide
    // Flange"...) ETABS **recalcula** las propiedades desde D/B/TF/TW y tira
    // las que van escritas. Y el D/B que se emite es un rectangulo
    // EQUIVALENTE, asi que el modelo importado tiene otra seccion: medido en
    // el galpon, A 0.0121408 contra la real 0.00978997, y la flecha se iba de
    // -28.378 a -8.278. Lo mismo pasaba en el s2k con `Shape=Rectangular`.
    //
    // La forma real solo importa para el DISEÑO y para dibujar; la rigidez la
    // mandan A, I33, I22 y J, y esas las tenemos exactas.
    // CFT con E del relleno: la "Filled Steel Tube" de ETABS (parametrica, con
    // FILLMATERIAL), no una General. ETABS le calcula A e I transformadas, As de
    // Timoshenko y J de Saint-Venant — los mismos que pone `cft` en el .heks
    // (medido 2-sep-2026: 0.003 % en la flecha lateral de la columna de prueba).
    const fillName = fillMatOf.get(i);
    if (stype === "CFT" && fillName && d > 0 && tww > 0 && !(h > 0 && b > 0)) {
      // tubo REDONDO relleno: la "Filled Steel Pipe" de ETABS (D y T; ETABS reescribe T)
      lines.push(`  FRAMESECTION  "${secName}"  MATERIAL "${matName}"  SHAPE "Filled Steel Pipe"  D ${rd(cL(d))} T ${rd(cL(tww))} FILLMATERIAL "${fillName}"`);
      return;
    }
    if (stype === "CFT" && fillName && h > 0 && b > 0 && tww > 0) {
      lines.push(`  FRAMESECTION  "${secName}"  MATERIAL "${matName}"  SHAPE "Filled Steel Tube"  D ${rd(cL(h))} B ${rd(cL(b))} TF ${rd(cL(tww))} TW ${rd(cL(tww))} FILLMATERIAL "${fillName}"`);
      return;
    }
    const tieneProps = A > 0 && I33 > 0 && I22 > 0;
    let etabsShape: string;
    if (stype === "general" || tieneProps) etabsShape = "General";
    else if (stype === "I")     etabsShape = "Steel I/Wide Flange";
    else if (stype === "HSS")   etabsShape = "Steel Tube";
    else if (stype === "CFT")   etabsShape = "Filled Steel Tube";
    else if (stype === "pipe")  etabsShape = "Steel Pipe";
    else if (stype === "L")     etabsShape = "Steel Angle";
    else if (stype === "C")     etabsShape = "Steel Channel";
    else if (stype === "2C")    etabsShape = "Steel Double Channel";
    else if (stype === "circ")  etabsShape = "Concrete Circle";
    else                        etabsShape = "Concrete Rectangular";  // ← FIX: rect sólido siempre

    let line = `  FRAMESECTION  "${secName}"  MATERIAL "${matName}"  SHAPE "${etabsShape}"`;
    if (etabsShape === "General") {
      // AS2/AS3: si el modelo no da area de cortante, se usa la de ETABS por
      // defecto para rectangulo (5/6·A). No inventa rigidez de flexion.
      // As2 resiste V2 (plano 1-2, el de I33) -> shearAreasZ
      // As3 resiste V3 (plano 1-3, el de I22) -> shearAreasY
      // Estaban CRUZADAS: en un perfil I, As2 (el alma) es varias veces As3.
      const as2 = elementInputs.shearAreasZ?.get(i) || A * 5 / 6;
      const as3 = elementInputs.shearAreasY?.get(i) || A * 5 / 6;
      line += `  D ${rd(cL(h))} B ${rd(cL(b))} AREA ${rp(A*1e6)} AS2 ${rp(as2*1e6)} AS3 ${rp(as3*1e6)}`
            // inercias: m4 -> mm4 (1e12)
            + ` I33 ${rp(I33*1e12)} I22 ${rp(I22*1e12)} TORSION ${rp((J || I33 + I22)*1e12)}`
            // modulos: m3 -> mm3 (1e9).  radios de giro: m -> mm (1e3)
            + ` S33POS ${rp(2 * I33 / h * 1e9)} S33NEG ${rp(2 * I33 / h * 1e9)}`
            + ` S22POS ${rp(2 * I22 / b * 1e9)} S22NEG ${rp(2 * I22 / b * 1e9)}`
            + ` Z33 ${rp(2 * I33 / h * 1e9)} Z22 ${rp(2 * I22 / b * 1e9)}`
            + ` R33 ${rp(Math.sqrt(I33 / A) * 1e3)} R22 ${rp(Math.sqrt(I22 / A) * 1e3)} `;
      lines.push(line);
      return;
    }
    if (h) line += `  D ${rd(cL(h))}`;
    if (b) line += `  B ${rd(cL(b))}`;
    if (d && !h) line += `  D ${rd(cL(d))}`;
    if (tfw) line += `  TF ${rd(cL(tfw))}`;
    if (tww) line += `  TW ${rd(cL(tww))}`;
    lines.push(line);
  });
  lines.push(``);

  // Plan Points (X, Y in plan; Z = elevation in Hekatan-Struct Z-up convention).
  // ETABS .e2k POINT format is `POINT id  X Y` (no Z) — Z comes from STORY.
  const xyToPoint = new Map<string, string>();
  let ptIdx = 0;
  nodes.forEach(n => {
    // La clave del POINT es (X, Y, DESCENSO), no solo (X, Y). Un e2k de ETABS
    // lleva el descenso como TERCER campo del POINT, y dos nudos en la misma
    // vertical que cuelguen distinto de su planta son DOS puntos distintos.
    // Agrupando solo por (X, Y) se fundian en uno y se perdian nudos: medido,
    // 293 puntos contra los 333 que escribe ETABS del mismo modelo.
    const { dz } = plantaDe(n[2]);
    const key = `${rd(n[0])},${rd(n[1])},${dz}`;
    if (!xyToPoint.has(key)) xyToPoint.set(key, `${++ptIdx}`);
  });
  // ── MUELLES NODALES (Winkler) ─────────────────────────────────────
  // Hasta el 5-sep-2026 el e2k NO llevaba los muelles: una cimentacion sobre
  // Winkler llegaba a ETABS sin ningun apoyo (o con solo el nudo de arriba) y
  // ETABS la auto-apoyaba o daba mecanismo. Gramatica leida de un e2k real
  // (`estructura-mixta/modelo.e2k`):
  //   POINTSPRING "nombre" NONLINEARSPECOPTION "LINKS" UX kx UY ky UZ kz RX .. RY .. RZ ..
  //   POINTASSIGN "pt" "story" ... SPRINGPROP "nombre"
  // Unidades del fichero: N y mm. kN/m -> N/mm es el MISMO numero (x1000/1000);
  // kN·m/rad -> N·mm/rad es x1e6.
  const springDeNudo = new Map<number, string>();
  const springProps: string[] = [];
  {
    const kNudo = new Map<number, number[]>();
    for (const sp of (nodeInputs as any).springs ?? []) {
      if (!(sp.k > 0)) continue;
      const v = kNudo.get(sp.node) ?? [0, 0, 0, 0, 0, 0];
      v[sp.dof] += sp.k; kNudo.set(sp.node, v);
    }
    const nombrePorK = new Map<string, string>();
    for (const [ni, v] of kNudo) {
      const enFichero = v.map((k, i) => i < 3 ? k * forceFactor / lengthFactor : k * forceFactor * lengthFactor);
      const key = enFichero.map(k => +k.toPrecision(12)).join("|");   // precision completa: rd() a 4 decimales perdia 108.7936 -> 108.794
      let nm = nombrePorK.get(key);
      if (!nm) {
        nm = `SPR${nombrePorK.size + 1}`; nombrePorK.set(key, nm);
        const L6 = ["UX", "UY", "UZ", "RX", "RY", "RZ"];
        const trozos = enFichero.map((k, i) => `${L6[i]}  ${+k.toPrecision(12)}`);
        springProps.push(`  POINTSPRING  "${nm}"  NONLINEARSPECOPTION  "LINKS"  ${trozos.join(" ")} `);
      }
      springDeNudo.set(ni, nm);
    }
    if (springProps.length) { lines.push(`$ POINT SPRING PROPERTIES`); springProps.forEach(l => lines.push(l)); lines.push(``); }
  }

  lines.push(`$ POINT COORDINATES`);
  for (const [key, ptName] of xyToPoint) {
    const [x, y, dz] = key.split(",").map(Number);
    // las claves van en METROS (son claves internas); al fichero, en mm
    lines.push(dz ? `  POINT "${ptName}"  ${rd(cL(x))} ${rd(cL(y))} ${rd(cL(dz))} `
                  : `  POINT "${ptName}"  ${rd(cL(x))} ${rd(cL(y))} `);
  }
  lines.push(``);

  const nodeToPS = (ni: number): { pt: string; story: string } => {
    const n = nodes[ni];
    const { story, dz } = plantaDe(n[2]);
    const key = `${rd(n[0])},${rd(n[1])},${dz}`;
    return { pt: xyToPoint.get(key) || "1", story };
  };

  // ── Helper: construir cláusulas extras de LINEASSIGN ────────────────
  // Genera PROPMODIFIERS, RELEASE, CARDINALPT, LENGTHOFFI/J según lo que
  // hekatan tenga en elementInputs[i]. Si no hay nada, devuelve "" y
  // la línea queda con sólo SECTION + MINNUMSTA + AUTOMESH.
  const buildLineExtras = (i: number): string => {
    const parts: string[] = [];

    // Property Modifiers (ETABS: 8 multipliers [A, As2, As3, J, I22, I33, Mass, Weight])
    const mods = input.propertyModifiers?.get(i);
    if (mods && mods.some((m: number) => Math.abs(m - 1) > 1e-9)) {
      parts.push(`PROPMODIFIERS "${mods.map((m: number) => rd(m)).join(" ")}"`);
    }

    // ANGULO LOCAL (el "local axis angle" de CSI). Sin esto, un e2k exportado
    // desde Hekatan salia con ANG 0 en TODAS las barras mientras el de ETABS
    // del mismo modelo llevaba 294 con ANG 90 — los cordones de cercha en C y
    // sus diagonales 2L, que con angulo 0 quedan con la hendidura mirando fuera
    // del plano de la cercha.
    const angL = (elementInputs as any).localAngles?.get(i);
    if (angL !== undefined && isFinite(angL) && Math.abs(angL) > 1e-9) {
      parts.push(`ANG ${rd(angL)}`);
    }

    // End Releases — momentReleases puede ser 6 (rotacionales) o 12 (todos DOFs)
    const rel = elementInputs.momentReleases?.get(i);
    if (rel && rel.some(r => r)) {
      // Mapeo a notación ETABS: I-end = "T M2 M3" (torsion, bending 22, bending 33)
      // 6 flags [TI, M2I, M3I, TJ, M2J, M3J] o 12 flags [Fx..M3 I, Fx..M3 J]
      const tokens: string[] = [];
      if (rel.length === 12) {
        // [FxI, FyI, FzI, TI, M2I, M3I, FxJ, FyJ, FzJ, TJ, M2J, M3J]
        if (rel[0]) tokens.push("PI"); if (rel[1]) tokens.push("V2I"); if (rel[2]) tokens.push("V3I");
        if (rel[3]) tokens.push("TI"); if (rel[4]) tokens.push("M2I"); if (rel[5]) tokens.push("M3I");
        if (rel[6]) tokens.push("PJ"); if (rel[7]) tokens.push("V2J"); if (rel[8]) tokens.push("V3J");
        if (rel[9]) tokens.push("TJ"); if (rel[10]) tokens.push("M2J"); if (rel[11]) tokens.push("M3J");
      } else if (rel.length === 6) {
        // [TI, M2I, M3I, TJ, M2J, M3J]
        if (rel[0]) tokens.push("TI"); if (rel[1]) tokens.push("M2I"); if (rel[2]) tokens.push("M3I");
        if (rel[3]) tokens.push("TJ"); if (rel[4]) tokens.push("M2J"); if (rel[5]) tokens.push("M3J");
      }
      if (tokens.length > 0) parts.push(`RELEASE "${tokens.join(" ")}"`);
    }

    // Insertion Point (Cardinal Point en ETABS, valor 1-11; 10 = centroid)
    // hekatan guarda offset [dy, dz] del centroide; si es (0,0) → centroid (10).
    const ip = elementInputs.insertionPoints?.get(i);
    if (ip && (Math.abs(ip[0]) > 1e-9 || Math.abs(ip[1]) > 1e-9)) {
      parts.push(`LATEROFFSET ${rd(cL(ip[0]))} TRANSOFFSET ${rd(cL(ip[1]))}`);
    }

    // End Length Offsets. LENGTHOFFI/J son las longitudes absolutas y RIGIDZONE
    // el factor de zona rigida.
    //
    // ⚠️ RIGIDZONE iba 0.5 FIJO, y el defecto de ETABS es **0** — medido en su
    // propia tabla («Frame Assignments - End Length Offsets»): las 247 barras
    // del mezanine salen con `Rigid Factor = 0`. La diferencia no es cosmetica:
    // con rz = 0 el brazo NO rigidiza (`Lf = L - rz*(offI+offJ)` da Lf = L) y
    // solo quita peso; con 0.5 acorta la barra media zona rigida y el modelo se
    // vuelve mas rigido. Ahora se escribe el rz que traiga el modelo —el
    // tercer valor de `endOffsets`, que `a_heks.py` pone a 0 como ETABS— y 0 si
    // no trae ninguno.
    const off = elementInputs.rigidOffsets?.get(i);
    const eof = (elementInputs as any).endOffsets?.get(i) as number[] | undefined;
    const offL = eof ? [eof[0], eof[1]] : off;
    const rz = eof && eof.length > 2 ? eof[2] : (off ? 0 : 0);
    if (offL && (Math.abs(offL[0]) > 1e-9 || Math.abs(offL[1]) > 1e-9)) {
      // ⚠️ En MM, como todo el fichero: iban en metros y ETABS leia 0.25 mm
      // (medido 2-sep-2026: GetEndLengthOffset devolvia 0.0003 m).
      parts.push(`LENGTHOFFI ${rd(cL(offL[0]))} LENGTHOFFJ ${rd(cL(offL[1]))} RIGIDZONE ${rd(rz)}`);
    }

    return parts.length > 0 ? ` ${parts.join(" ")} ` : "";
  };

  // ════════════════════════════════════════════════════════════════════
  // CHAIN DETECTION para columnas verticales
  // ════════════════════════════════════════════════════════════════════
  // Si N elementos column comparten plan-point + sección + forman cadena
  // vertical contigua, los emitimos como UN SOLO LINE element con auto-mesh
  // interno (MINNUMSTA=N). Eso produce el formato ETABS-idiomatic que el
  // usuario espera (1 columna con auto-mesh vs N elementos apilados).
  //
  // Heurística:
  //   1. Para cada elemento COLUMN/BRACE, key = `${planPt}_${secName}_${type}`
  //   2. Group elementos por key
  //   3. Para cada group, sort por Z y check contiguidad (top de elem[i] == bot de elem[i+1])
  //   4. Si contiguo → un chain
  type Chain = {
    elemIndices: number[];   // ordered bottom-up
    planPt: string;
    bottomNodeIdx: number;
    topNodeIdx: number;
    secName: string;
    type: string;
    nSegments: number;        // N elementos en la cadena → MINNUMSTA del LINEASSIGN
  };
  const chains: Chain[] = [];
  const inChain = new Set<number>();   // elementos ya consolidados en chains

  // Mapa intermedio: key → lista de elementos column candidatos (con sus Z bot/top)
  type ColElem = { i: number; bot: number; top: number; zBot: number; zTop: number; planPt: string; secName: string; type: string };
  const colByKey = new Map<string, ColElem[]>();
  elements.forEach((el, i) => {
    if (el.length !== 2) return;
    const type = guessElementType(nodes, el);
    if (type === "BEAM") return;  // solo column/brace son candidatos
    const bot = nodes[el[0]][2] <= nodes[el[1]][2] ? el[0] : el[1];
    const top = nodes[el[0]][2] <= nodes[el[1]][2] ? el[1] : el[0];
    // Solo columnas verticales (mismo plan en ambos extremos)
    if (Math.abs(nodes[bot][0] - nodes[top][0]) > 1e-6 || Math.abs(nodes[bot][1] - nodes[top][1]) > 1e-6) return;
    const ps = nodeToPS(bot);   // mismo plan que top
    const secName = elemToSecName.get(i) || `Sec_${i}`;
    const key = `${ps.pt}_${secName}_${type}`;
    if (!colByKey.has(key)) colByKey.set(key, []);
    colByKey.get(key)!.push({
      i, bot, top, zBot: rd(nodes[bot][2]), zTop: rd(nodes[top][2]),
      planPt: ps.pt, secName, type,
    });
  });

  colByKey.forEach((arr, _key) => {
    arr.sort((a, b) => a.zBot - b.zBot);
    // Si todos están contiguos (zTop[i] == zBot[i+1]), forman una sola chain
    let chainStart = 0;
    for (let k = 1; k <= arr.length; k++) {
      const isBreak = (k === arr.length) ||
                      (Math.abs(arr[k].zBot - arr[k - 1].zTop) > 1e-6);
      if (isBreak) {
        // Cerrar chain [chainStart..k-1]
        const segment = arr.slice(chainStart, k);
        if (segment.length >= 1) {
          chains.push({
            elemIndices: segment.map(s => s.i),
            planPt: segment[0].planPt,
            bottomNodeIdx: segment[0].bot,
            topNodeIdx: segment[segment.length - 1].top,
            secName: segment[0].secName,
            type: segment[0].type,
            nSegments: segment.length,
          });
          segment.forEach(s => inChain.add(s.i));
        }
        chainStart = k;
      }
    }
  });

  // ════════════════════════════════════════════════════════════════════
  // EMIT LINE CONNECTIVITIES + LINE ASSIGNS
  // ════════════════════════════════════════════════════════════════════
  lines.push(`$ LINE CONNECTIVITIES`);
  const laEntries: string[] = [];

  /**
   * Indice de una planta dentro de la pila (0 = Base). El salto de plantas de
   * una LINE se cuenta en PLANTAS, no en cotas distintas de nudo: `sortedZ` y
   * `storyNames` van a la par, pero un nudo que cuelga con descenso NO tiene
   * entrada en `sortedZ`, y buscarlo ahi devolvia -1.
   */
  const idxDe = (story: string) => storyNames.indexOf(story);

  /**
   * Escribe una LINE que puede estar INCLINADA.
   *
   * Antes se ponia el MISMO punto de planta en los dos extremos
   * (`"${psTop.pt}"  "${psTop.pt}"`), y eso solo sabe describir una barra
   * VERTICAL: ETABS le pone al extremo de abajo la x,y del de arriba. En un
   * edificio no se nota —las columnas son verticales—, pero en una nave con
   * arco se lleva por delante la geometria: medido en el galpon, **42 de las
   * 102 barras** caian fuera del modelo (los tramos del arco salian verticales
   * y las cotas intermedias inventadas). Se veia al abrirlo en ETABS 19.
   *
   * La regla del formato: el SEGUNDO punto es el que esta EN la planta del
   * objeto (la del LINEASSIGN) y el PRIMERO baja `nStories` plantas. Asi que
   * basta con dar los dos puntos de verdad y contar el salto entre sus plantas.
   */
  /** elemento -> {nombre de LINE, planta}; solo las barras sueltas (no cadenas). */
  const lineaDe = new Map<number, { name: string; story: string }>();
  const emitirLinea = (eName: string, tipo: string, botNode: number, topNode: number,
                       secName: string, extras: string, minNumSta: number, elemIdx?: number) => {
    const psTop = nodeToPS(topNode);
    const psBot = nodeToPS(botNode);
    if (elemIdx !== undefined) lineaDe.set(elemIdx, { name: eName, story: psTop.story });
    const salto = idxDe(psTop.story) - idxDe(psBot.story);
    if (salto <= 0) {
      // Los dos extremos cuelgan de la MISMA planta (cada uno con su descenso):
      // eso en el e2k es una BEAM, aunque la barra suba.
      lines.push(`  LINE  "${eName}"  BEAM  "${psBot.pt}"  "${psTop.pt}"  0`);
    } else {
      lines.push(`  LINE  "${eName}"  ${tipo}  "${psBot.pt}"  "${psTop.pt}"  ${salto}`);
    }
    laEntries.push(`  LINEASSIGN  "${eName}"  "${psTop.story}"  SECTION "${secName}" ${extras} MINNUMSTA ${minNumSta} AUTOMESH "YES"  MESHATINTERSECTIONS "${(elementInputs as any).meshAtIntersections === false ? "NO" : "YES"}"  `);
  };

  // 1. Chains de columnas — UN solo LINE element por cadena
  //
  // MINNUMSTA = nSegments para que el auto-mesh interno de ETABS coincida con
  // la discretización de hekatan.
  //
  // NO se emite RIGIDZONE: no es el default de ETABS (el e2k que él mismo
  // escribe no lo lleva) sino una zona rígida en los extremos de CADA barra,
  // que el modelo no pidió. Medido: rigidizaba el mezanine un 10 % (-178.2
  // contra -186.9 mm del nativo). Solo se emite si el modelo trae
  // rigidOffsets, y eso ya lo hace buildLineExtras.
  //
  // PISO A PISO, como lo escribe ETABS (`LINE "C1" COLUMN "1" "1" 1` una vez y
  // un LINEASSIGN por planta). Antes salia UN objeto de N pisos (salto N), y
  // ETABS con LUMPATSTORIES reparte la masa del OBJETO a sus dos extremos: los
  // pisos intermedios se quedaban SIN masa. Medido el 3-sep-2026 en la
  // plantilla «solo rejilla» (16 columnas de 4 pisos): ETABS ponia 39.2 t en
  // la base y 39.2 t en la azotea, encontraba 3 modos y daba T1 = 1.134 s
  // contra 0.812 de Hekatan. El estatico no lo notaba (ETABS si parte el
  // objeto en los niveles para la rigidez), la masa si.
  const lineasEmitidas = new Map<string, string>();   // nombre -> fila LINE
  chains.forEach((ch, ci) => {
    // Extras usa el primer elemento de la cadena (asumimos uniforme)
    const extras = buildLineExtras(ch.elemIndices[0]);
    // Grupos por planta: un grupo acaba en el tramo cuyo nudo de arriba cae
    // exactamente en un nivel (dz = 0). Un nudo intermedio de «Div. columnas»
    // se queda dentro del grupo y va al MINNUMSTA.
    const grupos: number[][] = [];
    let actual: number[] = [];
    ch.elemIndices.forEach((ei, k) => {
      actual.push(ei);
      const [a, b] = elements[ei];
      const top = nodes[a][2] >= nodes[b][2] ? a : b;
      if (plantaDe(nodes[top][2]).dz === 0 || k === ch.elemIndices.length - 1) { grupos.push(actual); actual = []; }
    });
    grupos.forEach(g => {
      const [a0, b0] = elements[g[0]];
      const bot = nodes[a0][2] <= nodes[b0][2] ? a0 : b0;
      const [a1, b1] = elements[g[g.length - 1]];
      const top = nodes[a1][2] >= nodes[b1][2] ? a1 : b1;
      const salto = idxDe(nodeToPS(top).story) - idxDe(nodeToPS(bot).story);
      // El mismo nombre en todas las plantas (es el mismo objeto de ETABS). Si
      // un grupo produce OTRA fila LINE (salta distinto numero de plantas, o su
      // nudo de abajo cuelga de una planta con descenso y sale como BEAM) se
      // le da nombre propio: dos LINE distintas con el mismo nombre rompian
      // tower-3d y el galpon (barras sin cubrir en el ciclo e2k).
      let nombre = `C${ci + 1}`;
      for (let v = 1; ; v++) {
        const filas = lines.length;
        emitirLinea(nombre, ch.type, bot, top, ch.secName, extras, g.length);
        const fila = lines[filas];
        const previa = lineasEmitidas.get(nombre);
        if (previa === undefined) { lineasEmitidas.set(nombre, fila); break; }
        lines.splice(filas, lines.length - filas);            // la LINE ya estaba
        if (previa === fila) break;                           // misma fila: solo el LINEASSIGN
        laEntries.pop();                                      // fila distinta: otro nombre
        nombre = `C${ci + 1}_${v}`;
      }
    });
  });

  // 2. Elementos no-chain (beams + columnas sueltas/no-contiguas) — uno por uno
  elements.forEach((el, i) => {
    if (el.length !== 2) return;
    if (inChain.has(i)) return;   // ya emitido como parte de un chain
    const type = guessElementType(nodes, el);
    const secName = elemToSecName.get(i) || `Sec_${i}`;
    const extras = buildLineExtras(i);

    // Ordenados por cota: el de arriba manda la planta del objeto.
    const bot = nodes[el[0]][2] <= nodes[el[1]][2] ? el[0] : el[1];
    const top = nodes[el[0]][2] <= nodes[el[1]][2] ? el[1] : el[0];
    // Un BEAM cuyos extremos caen en plantas DISTINTAS no es un beam para el
    // e2k (un beam vive dentro de una planta): sale como BRACE con su salto, y
    // `emitirLinea` lo devuelve a BEAM si al final los dos cuelgan de la misma.
    emitirLinea(`E${i + 1}`, type === "BEAM" ? "BRACE" : type, bot, top, secName, extras, 3, i);
  });
  lines.push(``);

  // ── POINT ASSIGNS ────────────────────────────────────────────────
  // Para Modo Manual emitimos POINTASSIGN por cada (plan-point, story)
  // que tenga carga o restraint — así ETABS "registra" el plan-point en
  // ese story y los POINTLOAD posteriores resuelven al joint correcto.
  // Para Modo Auto (default) sólo emitimos restraints.
  const weightMode = input.weightMode ?? "auto";
  const emittedPointAssigns = new Set<string>(); // key: "pt@story"
  lines.push(`$ POINT ASSIGNS`);
  // 1. Restraints (con DIAPH "DISCONNECTED" si está en story Base para
  //    evitar que el rigid diaphragm afecte al empotramiento).
  nodeInputs.supports?.forEach((sup, nodeIdx) => {
    const dofs: string[] = [];
    if (sup[0]) dofs.push("UX"); if (sup[1]) dofs.push("UY"); if (sup[2]) dofs.push("UZ");
    if (sup[3]) dofs.push("RX"); if (sup[4]) dofs.push("RY"); if (sup[5]) dofs.push("RZ");
    if (dofs.length > 0) {
      const ps = nodeToPS(nodeIdx);
      const diaphClause = ps.story === "Base" ? ` DIAPH "DISCONNECTED" ` : "";
      const sprClause = springDeNudo.has(nodeIdx) ? ` SPRINGPROP "${springDeNudo.get(nodeIdx)}" ` : "";
      lines.push(`  POINTASSIGN  "${ps.pt}"  "${ps.story}"  RESTRAINT "${dofs.join(" ")}" ${diaphClause}${sprClause} `);
      emittedPointAssigns.add(`${ps.pt}@${ps.story}`);
    }
  });
  // 1b. Muelles en nudos SIN restraint (los de una zapata sobre Winkler).
  for (const [nodeIdx, nm] of springDeNudo) {
    const ps = nodeToPS(nodeIdx);
    if (emittedPointAssigns.has(`${ps.pt}@${ps.story}`)) continue;
    lines.push(`  POINTASSIGN  "${ps.pt}"  "${ps.story}"  SPRINGPROP "${nm}" `);
    emittedPointAssigns.add(`${ps.pt}@${ps.story}`);
  }
  // 2. Top joints de chains → asignar DIAPHRAGM D1 (ETABS-idiomatic — la
  //    masa lateral se agrupa por nivel via el rigid diaphragm).
  // "auto" (defecto): D1 SOLO si el modelo de Hekatan lleva diafragmas
  // (nodeInputs.diaphragms). Antes se ponia siempre, y un modelo flexible en
  // Hekatan salia atado en ETABS: el borde del deck del mezanine daba 1 % de
  // diferencia que no era del motor (3-sep-2026). "d1" lo fuerza, "none" lo quita.
  const hayDiaf = !!(nodeInputs.diaphragms && [...nodeInputs.diaphragms.values()].some(v => v !== 0));
  const modoDiaf = input.diaphragm ?? "auto";
  const usarDiafragma = modoDiaf === "d1" || (modoDiaf === "auto" && hayDiaf);
  // ⚠️ Hasta el 3-sep-2026 solo se asignaba D1 al nudo de CORONACION de cada
  // cadena: ETABS tenia diafragma solo en la ultima planta y las de abajo iban
  // flexibles. Medido (dual de 2 plantas, empuje en esquina): la planta 2 casaba
  // con Hekatan al 0.7 % y la planta 1 se iba un 100 %. Ahora va en el nudo de
  // cada planta por la que pasa la cadena (todos los ejes de columna, cada nivel).
  // ⚠️ Y hasta el 8-sep-2026 el D1 iba en el nudo superior de CADA TRAMO de
  // columna: con las columnas malladas a 0.5 m, cada nivel de malla es una
  // STORY y ETABS ataba con diafragma rigido la mitad de la altura de columnas
  // y muros. Medido (1 piso con muro, 578 nudos, empuje de 50 kN): ETABS por
  // e2k salia 15.9 % mas rigido que por OAPI; con el D1 solo en la planta,
  // 0.0000 %. Ahora manda el mapa de Hekatan (nodeInputs.diaphragms, el mismo
  // que usa el s2k): D1 exactamente en los nudos que Hekatan ata. Sin mapa
  // ("d1" forzado) se cae al criterio viejo de las cadenas, planta a planta.
  const nudosDiaf = new Set<number>();
  if (nodeInputs.diaphragms) nodeInputs.diaphragms.forEach((g, n) => { if (g !== 0) nudosDiaf.add(n); });
  if (usarDiafragma && nudosDiaf.size) {
    nudosDiaf.forEach((n) => {
      const ps = nodeToPS(n);
      const key = `${ps.pt}@${ps.story}`;
      if (!emittedPointAssigns.has(key) && ps.story !== "Base") {
        lines.push(`  POINTASSIGN  "${ps.pt}"  "${ps.story}"  DIAPH "D1"  `);
        emittedPointAssigns.add(key);
      }
    });
  } else if (usarDiafragma) chains.forEach(ch => {
    for (const ei of ch.elemIndices) {
      const [a, b] = elements[ei];
      const topIdx = nodes[a][2] >= nodes[b][2] ? a : b;
      const ps = nodeToPS(topIdx);
      const key = `${ps.pt}@${ps.story}`;
      if (!emittedPointAssigns.has(key) && ps.story !== "Base") {
        lines.push(`  POINTASSIGN  "${ps.pt}"  "${ps.story}"  DIAPH "D1"  `);
        emittedPointAssigns.add(key);
      }
    }
  });
  // En Modo Manual, asegurar POINTASSIGN existente para cada nodo con carga
  // (el "  " vacío sirve para registrar el plan-point a esa story sin asignar
  // restraint ni propiedad — necesario para que POINTLOAD resuelva).
  if (weightMode === "manual" && nodeInputs.loads) {
    nodeInputs.loads.forEach((_load, nodeIdx) => {
      // Solo si al nudo le queda carga PROPIA. La que vino del deck se escribe
      // como AREALOAD, asi que registrar su plan-point no sirve de nada: eran
      // 116 POINTASSIGN contra los 6 de ETABS, todos inertes.
      const [px, py, pz] = cargaPropia(nodeIdx, _load);
      if (Math.abs(px) < 1e-10 && Math.abs(py) < 1e-10 && Math.abs(pz) < 1e-10) return;
      const ps = nodeToPS(nodeIdx);
      const key = `${ps.pt}@${ps.story}`;
      if (!emittedPointAssigns.has(key)) {
        // Sólo necesitamos registrar la existencia — DIAPH "DISCONNECTED" es
        // un no-op semántico válido en ETABS que asegura el plan-point esté
        // ligado a esta story sin alterar diafragmas.
        lines.push(`  POINTASSIGN  "${ps.pt}"  "${ps.story}"  DIAPH "DISCONNECTED"  `);
        emittedPointAssigns.add(key);
      }
    });
  }
  lines.push(``);

  // Line Assigns
  lines.push(`$ LINE ASSIGNS`);
  laEntries.forEach(la => lines.push(la));
  lines.push(``);

  // ═══════════════════════════════════════════
  // AREA ELEMENTS (Q4 shells: walls + slabs)
  // ═══════════════════════════════════════════
  const areaElements: { idx: number; el: number[]; isWall: boolean }[] = [];
  // Areas COMO LAS DIBUJO el usuario. Si el modelo las trae, se exporta el
  // objeto y NO sus celdas: ETABS guarda 1 area y la malla el solo. Exportar
  // las 90 celdas daba un modelo que analiza igual pero con la malla
  // congelada — al reimportarlo ya no se puede remallar ni cambiar el borde.
  const areaObjects = (elementInputs as any).areaObjects as
    Array<{ nodes: number[]; cells: number[]; q?: number; ang?: number }> | undefined;
  const celdaDeObjeto = new Set<number>();
  const qDeObjeto = new Map<number, number>();
  const angDeObjeto = new Map<number, number>();
  areaObjects?.forEach(o => o.cells.forEach(c => celdaDeObjeto.add(c)));
  elements.forEach((el, i) => {
    // ⚠️ Los TRIANGULOS entran tambien. Antes la condicion era
    // `el.length === 4` a secas y una malla triangular se exportaba con CERO
    // areas: `triangular-plate` escribia sus 128 shells como nada, sin un
    // aviso. ETABS admite `AREA "F1" FLOOR 3 "p1" "p2" "p3" 0 0 0`.
    if (el.length === 4 || el.length === 3) {
      // Determine if wall (vertical) or slab (horizontal) by normal direction.
      // Hekatan-Struct uses Z-up: normal vertical (high |nz|) → SLAB (floor);
      // normal mostly horizontal (low |nz|) → WALL (panel).
      const p0 = nodes[el[0]], p1 = nodes[el[1]], p2 = nodes[el[2]];
      const v1 = [p1[0]-p0[0], p1[1]-p0[1], p1[2]-p0[2]];
      const v2 = [p2[0]-p0[0], p2[1]-p0[1], p2[2]-p0[2]];
      // Cross product v1 × v2 = normal vector
      const nx = v1[1]*v2[2] - v1[2]*v2[1];
      const ny = v1[2]*v2[0] - v1[0]*v2[2];
      const nz = v1[0]*v2[1] - v1[1]*v2[0];
      const nLen = Math.sqrt(nx*nx + ny*ny + nz*nz);
      const isWall = nLen > 1e-10 && (Math.abs(nz) / nLen) < 0.5;
      // |nz|/|n| close to 1 → horizontal slab; close to 0 → vertical wall.
      areaElements.push({ idx: i, el, isWall });
      if (celdaDeObjeto.has(i)) areaElements.pop();   // la cubre su objeto padre
    }
  });

  // Material default para shells: el primer Concrete que aparezca; si solo
  // hay acero (raro en losas), usa el primer steel.
  const defaultShellMat = (() => {
    for (const [k, isStl] of matIsSteel) if (!isStl) return matNames.get(k);
    return matNames.values().next().value || "Conc_1";
  })();

  areaObjects?.forEach((o, k) => {
    areaElements.push({ idx: o.cells[0], el: o.nodes, isWall: false });
    if (o.q !== undefined) qDeObjeto.set(o.cells[0], o.q);
    if (o.ang !== undefined) angDeObjeto.set(o.cells[0], o.ang);
  });
  const DECK_SEC = "DECK";
  let esMembrana = false;
  const areaLoadRefs: { name: string; story: string; idx: number }[] = [];
  /**
   * `MODELINGTYPE` de un tipo de cascara, leido del elemento que toca.
   *
   * ⚠️ Antes esto miraba `plateFormulations.values().next().value` — LA PRIMERA
   * del mapa — asi que si la losa y el muro llevaban formulacion distinta, el
   * muro heredaba la de la losa. Ahora se busca un elemento de ese tipo.
   *   1 = ShellThin (Kirchhoff) · 2 = Membrane · resto = ShellThick (MITC4)
   */
  const modelingDe = (wall: boolean): string => {
    const pf = (input.elementInputs as any).plateFormulations as Map<number, number> | undefined;
    const a = areaElements.find(x => x.isWall === wall);
    const v = pf && a ? pf.get(a.idx) : undefined;
    return v === 2 ? "Membrane" : v === 1 ? "ShellThin" : "ShellThick";
  };
  /**
   * Espesor de un tipo de cascara, del elemento que toca.
   *
   * ⚠️ Igual que arriba, esto era `thicknesses.values().next().value` — EL
   * PRIMERO del mapa. En un modelo con losa y muro de distinto espesor, el
   * muro se llevaba el de la losa: la plantilla dual (losa 0.20 / muro 0.25)
   * exportaba `WALLTHICKNESS 200`, o sea muros un 20 % mas delgados de los que
   * Hekatan analiza, y ETABS resolvia otro edificio. Medido el 2026-08-26.
   */
  const espesorDe = (wall: boolean, porDefecto: number): number => {
    const th = input.elementInputs.thicknesses;
    const a = areaElements.find(x => x.isWall === wall);
    return (a ? th?.get(a.idx) : undefined) ?? th?.values().next().value ?? porDefecto;
  };
  // ── Los MODIFICADORES de cascara ────────────────────────────────────
  //
  // ETABS los escribe como una SEGUNDA linea `SHELLPROP` con el MISMO nombre,
  // solo con los factores, y **omite los que valen 1**. Copiado de un e2k
  // escrito por el propio ETABS (`galpon-bodega-electoral/ref_riochico.e2k`):
  //
  //   SHELLPROP "LOSA DE 30CM"  PROPTYPE "Slab" ... SLABTHICKNESS 0.3
  //   SHELLPROP "LOSA DE 30CM"  F11MOD 0.25 F22MOD 0.25 ... V13MOD 0.25 V23MOD 0.25
  //   SHELLPROP "LOSA DE ESCALERA"  M11MOD 0.25 M22MOD 0.25 M12MOD 0.25
  //
  // ⚠️ Esto NO se exportaba. El modelo podia llevar una losa fisurada al 25 %
  // (`shellmod`) y el `.e2k` se la mandaba a ETABS INTACTA, sin avisar: dos
  // rigideces distintas para el mismo modelo, y la diferencia aparecia luego en
  // los periodos sin saber de donde salia.
  //
  // El orden de `shellModifiers` ES el de ETABS: F11 F22 F12 M11 M22 M12 V13
  // V23 (`shellQ4.cpp` lee dmod[3..5] como la flexion). Los escalares
  // `membraneModifiers` / `bendingModifiers` son el caso isotropo del mismo
  // vector, y se traducen a el.
  const MOD_NOMBRES = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD",
                       "M12MOD", "V13MOD", "V23MOD"];
  const modsDe = (idx: number): number[] | null => {
    const dmods = (elementInputs as any).shellModifiers as Map<number, number[]> | undefined;
    const d = dmods?.get(idx);
    if (d && d.length >= 8) return d.slice(0, 8);
    const mm = (elementInputs as any).membraneModifiers as Map<number, number> | undefined;
    const bm = (elementInputs as any).bendingModifiers as Map<number, number> | undefined;
    const m = mm?.get(idx), b = bm?.get(idx);
    if (m === undefined && b === undefined) return null;
    const mv = m ?? 1, bv = b ?? 1;
    return [mv, mv, mv, bv, bv, bv, bv, bv];
  };
  /**
   * La linea de modificadores de una propiedad, o "" si no hace falta.
   * Si dentro del grupo hay elementos con modificadores DISTINTOS no se puede
   * decir en una propiedad: se avisa y se emite el del primero, que es lo unico
   * que se puede hacer sin partir la propiedad en varias.
   */
  const lineaMods = (nombre: string, esMuro: boolean): string => {
    const delGrupo = areaElements.filter(a => a.isWall === esMuro);
    const vistos = new Map<string, number[]>();
    for (const a of delGrupo) {
      const m = modsDe(a.idx) ?? [1, 1, 1, 1, 1, 1, 1, 1];
      vistos.set(m.map(v => rd(v)).join(","), m);
    }
    if (vistos.size === 0) return "";
    if (vistos.size > 1)
      console.warn(`[e2k] "${nombre}": ${vistos.size} juegos de modificadores distintos ` +
        `en la misma propiedad. ETABS los guarda POR PROPIEDAD, asi que se exporta el ` +
        `primero y los demas se pierden.`);
    const m = vistos.values().next().value as number[];
    const partes = MOD_NOMBRES
      .map((n, i) => (Math.abs(m[i] - 1) > 1e-9 ? `${n} ${rd(m[i])}` : ""))
      .filter(Boolean);
    if (!partes.length) return "";              // todos a 1: ETABS los omite
    return `  SHELLPROP  "${nombre}"  ${partes.join(" ")} `;
  };

  // ── UNA PROPIEDAD POR CADA CASCARA DISTINTA ─────────────────────────
  //
  // ⚠️ El exportador escribia UNA sola `SHELLPROP "Losa"` y UNA `"Muro"`, con
  // el espesor del PRIMER elemento de cada tipo. En un modelo con varias
  // cascaras distintas —una conexion con ala de 12 mm, alma de 18 y placa de
  // 25— todas salian con el mismo espesor y las demas se perdian. Medido el
  // 2026-08-28 con el ciclo completo (`cli/roundtrip_areas.mjs`): de 58
  // ejemplos con area, 5 volvian con menos espesores de los que salieron
  // (`placa-base` [0.014, 0.022, 0.025] volvia como [0.022, 0.025]).
  //
  // Se agrupa por lo que DEFINE la cascara —muro o losa, espesor, formulacion
  // y modificadores— y sale una propiedad por grupo. El primero conserva el
  // nombre de siempre ("Losa" / "Muro") para no mover lo ya validado contra
  // ETABS; los demas van numerados.
  const thAll = input.elementInputs.thicknesses;
  const pfAll = (input.elementInputs as any).plateFormulations as Map<number, number> | undefined;
  const claveDe = (ae: { idx: number; isWall: boolean }) => {
    const t = thAll?.get(ae.idx);
    const pf = pfAll?.get(ae.idx);
    const m = modsDe(ae.idx);
    // El MATERIAL tambien separa grupo: el zinc de 0.8 mm (acero) del galpon
    // salia como "Deck" de hormigon con cotas absurdas (DECKSLABDEPTH 35 m).
    return `${ae.isWall ? "W" : "F"}|${t ?? "-"}|${pf ?? "-"}|${m ? m.map(v => rd(v)).join(",") : "-"}|${matKeyDe(ae.idx)}`;
  };
  /**
   * .Este area es una MEMBRANA? Se decide por el modificador de FLEXION del
   * PROPIO elemento: si es ~0 no aporta rigidez fuera del plano, y en ETABS eso
   * es un DECK, no una losa.
   *
   * ⚠️ Esto se miraba una sola vez para TODAS las areas: bastaba que UNA fuera
   * membrana para que el fichero entero saliera como deck. En un modelo mixto
   * de verdad —deck en una planta y losa maciza en otra— las losas se perdian:
   * `estructura-mixta` salia con [0.1, 0.105, 0.3] y volvia con un solo
   * espesor. Ahora se decide POR GRUPO.
   */
  const esMembranaDe = (idx: number): boolean => {
    const d = modsDe(idx);
    if (d) return Math.abs(d[3]) < 1e-9 && Math.abs(d[4]) < 1e-9;
    return false;
  };
  const grupos = new Map<string, { nombre: string; isWall: boolean; mem: boolean;
                                   t?: number; pf?: number; mat?: string; acero?: boolean }>();
  let nLosa = 0, nMuro = 0, nDeck = 0;
  for (const ae of areaElements) {
    const k = claveDe(ae);
    if (grupos.has(k)) continue;
    const isWall = ae.isWall;
    const mem = !isWall && esMembranaDe(ae.idx);
    const n = isWall ? ++nMuro : (mem ? ++nDeck : ++nLosa);
    const kae = matKeyDe(ae.idx);
    grupos.set(k, {
      nombre: (isWall ? "Muro" : mem ? DECK_SEC : "Losa") + (n === 1 ? "" : String(n)),
      isWall, mem, t: thAll?.get(ae.idx), pf: pfAll?.get(ae.idx),
      mat: matNames.get(kae) ?? defaultShellMat,
      acero: matIsSteel.get(kae) ?? false,
    });
  }
  /** El nombre de la propiedad que le toca a este elemento. */
  const secDe = (ae: { idx: number; isWall: boolean }) =>
    grupos.get(claveDe(ae))?.nombre ?? (ae.isWall ? "Muro" : "Losa");
  const modelingDeGrupo = (pf?: number) =>
    pf === 2 ? "Membrane" : pf === 1 ? "ShellThin" : "ShellThick";
  /** Los MOD de un grupo, leidos de su primer elemento. */
  const lineaModsGrupo = (nombre: string, k: string): string => {
    const ae = areaElements.find(a => claveDe(a) === k);
    const m = ae ? (modsDe(ae.idx) ?? null) : null;
    if (!m) return "";
    const partes = MOD_NOMBRES
      .map((n, i) => (Math.abs(m[i] - 1) > 1e-9 ? `${n} ${rd(m[i])}` : ""))
      .filter(Boolean);
    return partes.length ? `  SHELLPROP  "${nombre}"  ${partes.join(" ")} ` : "";
  };
  // Los grupos EXTRA se emiten aparte; por el camino de siempre sale UNO por
  // tipo: el del PRIMER area no-muro y el del primer muro.
  //
  // ⚠️ Esto miraba el NOMBRE (`/\d$/`, o sea «del segundo en adelante»), y en un
  // modelo con losa maciza Y deck a la vez los dos grupos se llaman sin
  // numero —"Losa" y "DECK"— pero arriba solo se emite uno. El otro no salia
  // por ningun lado: `estructura-mixta` exportaba [0.1, 0.105, 0.3] y volvia
  // con un solo espesor. Ahora se marca la CLAVE de lo que ya se emitio.
  const primeroNoMuro = areaElements.find(a => !a.isWall);
  const primerMuro = areaElements.find(a => a.isWall);
  const yaEmitidas = new Set<string>();
  if (primeroNoMuro) yaEmitidas.add(claveDe(primeroNoMuro));
  if (primerMuro) yaEmitidas.add(claveDe(primerMuro));
  const extra = [...grupos.entries()].filter(([k]) => !yaEmitidas.has(k));

  if (areaElements.some(a => !a.isWall)) {
    // .LOSA o DECK? Se decide por el modificador de FLEXION: si es ~0 el area
    // es una MEMBRANA, y en ETABS eso es un DECK, no una losa. Exportarlo
    // siempre como `Slab` hacia que al reimportar volviera con flexion — o
    // sea, lo contrario de lo que el modelo dice. Y ETABS es tajante: un deck
    // queda en ShellType 3 (Membrane) le pidas lo que le pidas (medido).
    // ⚠️ Esto era «alguna area es membrana», y con eso bastaba UNA para que la
    // propiedad de arriba saliera como DECK — llevandose el espesor de la
    // primera losa, que no es deck. Se mira la que de verdad se emite aqui: la
    // PRIMERA no-muro. Las demas van cada una por su grupo.
    esMembrana = !!primeroNoMuro && esMembranaDe(primeroNoMuro.idx);
    const t_slab = espesorDe(false, 0.15);
    if (esMembrana) {
      // Tokens copiados del e2k que escribe ETABS para el mismo modelo. No son
      // los de una losa con otro nombre: llevan el prefijo DECK y describen el
      // perfil de la lamina (nervio, paso, conectores). ETABS los exige — con
      // SLABDEPTH/MODELINGTYPE, que era lo que yo suponia, no lee el bloque.
      // El espesor `t` de Hekatan es el TOTAL, y en ETABS el total es
      // DECKSLABDEPTH + DECKRIBDEPTH: el primero es SOLO el hormigon por
      // encima del nervio. Poniendo el total en DECKSLABDEPTH y ademas un
      // nervio salia un deck de 22 cm donde el modelo pedia 12 — mas rigido.
      // Las proporciones son las del deck real del mezanine: 65/55 de 120.
      // El DECKUNITWEIGHT es el peso de la lamina (0.11 kN/m2), convertido:
      // estaba copiado tal cual del e2k de ETABS, que va en N/mm.
      lines.push(`$ DECK PROPERTIES`);
      // ⚠️ Las cotas del deck van por `cL`, como cualquier otra longitud del
      // fichero. Iban con `rp()` a secas, o sea EN METROS mientras el resto del
      // `.e2k` va en milimetros: un deck de 12 cm se escribia como
      // `DECKSLABDEPTH 0.065` y al releerlo salia de 0.065 MM. Lo caza el test
      // `e2k-areas-roundtrip` — el espesor volvia como 0.000105 m.
      const dk = (v: number) => rp(cL(v));
      // Si la PRIMERA membrana es de ACERO (zinc de 0.8 mm, chapa) no es un deck
      // de hormigon: losa Membrane con su material y su espesor. Con el deck
      // salia DECKSLABDEPTH 35 m de material Conc_1 y ETABS/Hekatan la leian
      // como otra cosa (galpon, +0.07 %).
      const g1 = [...grupos.values()].find(g => g.nombre === DECK_SEC);
      if (g1?.acero) lines.push(`  SHELLPROP  "${DECK_SEC}"  PROPTYPE  "Slab"  MATERIAL "${g1.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${rd(cL(t_slab))} `);
      else
      lines.push(`  SHELLPROP  "${DECK_SEC}"  PROPTYPE  "Deck"  DECKTYPE "Filled"  CONCMATERIAL "${defaultShellMat}"  DECKMATERIAL "${defaultShellMat}"  DECKSLABDEPTH ${dk(t_slab * 65 / 120)} DECKRIBDEPTH ${dk(t_slab * 55 / 120)} DECKRIBWIDTHTOP ${dk(t_slab * 150 / 120)} DECKRIBWIDTHBOTTOM ${dk(t_slab * 100 / 120)} DECKRIBSPACING ${dk(t_slab * 200 / 120)} DECKSHEARTHICKNESS ${dk(t_slab * 0.76 / 120)} DECKUNITWEIGHT ${rp(cF(0.11012))} SHEARSTUDDIAM ${dk(t_slab * 19 / 120)} SHEARSTUDHEIGHT ${dk(t_slab * 100 / 120)} SHEARSTUDFU 400 `);
    } else {
      lines.push(`$ SLAB PROPERTIES`);
      lines.push(`  SHELLPROP  "Losa"  PROPTYPE  "Slab"  MATERIAL "${defaultShellMat}"  MODELINGTYPE "${modelingDe(false)}"  SLABTYPE "Slab"  SLABTHICKNESS ${rd(cL(t_slab))} `);
    }
    const modLosa = lineaMods(esMembrana ? DECK_SEC : "Losa", false);
    if (modLosa) lines.push(modLosa);
    lines.push(``);
  }
  if (areaElements.some(a => a.isWall)) {
    lines.push(`$ WALL PROPERTIES`);
    const t_wall = espesorDe(true, 0.2);
    // MODELINGTYPE tal cual lo escribe ETABS: "ShellThin" | "ShellThick" |
    // "Membrane". Antes iba "ShellThick" FIJO, sin mirar el modelo, y por eso
    // el mismo caso daba 1.500000 montado por la OAPI (con Membrana) y
    // 1.491651 al pasar por el .e2k — la comparacion no medía el exportador,
    // medía dos elementos. Verificado pidiendole a ETABS que exportara su
    // propio .e2k de cada tipo (galpon-bodega-electoral/tipos_cascara_export.py).
    const modelingMuro = modelingDe(true);
    lines.push(`  SHELLPROP  "Muro"  PROPTYPE  "Wall"  MATERIAL "${defaultShellMat}"  MODELINGTYPE "${modelingMuro}"  WALLTHICKNESS ${rd(cL(t_wall))} `);
    const modMuro = lineaMods("Muro", true);
    if (modMuro) lines.push(modMuro);
    lines.push(``);
  }

  // Y las cascaras que NO son la primera de su tipo: cada una con su espesor y
  // su formulacion. Sin esto se perdian todas menos una.
  if (extra.length) {
    lines.push(`$ OTRAS SECCIONES DE CASCARA`);
    for (const [k, g] of extra) {
      const t = g.t ?? (g.isWall ? 0.2 : 0.15);
      const dk2 = (v: number) => rp(cL(v));
      lines.push(g.isWall
        ? `  SHELLPROP  "${g.nombre}"  PROPTYPE  "Wall"  MATERIAL "${g.mat ?? defaultShellMat}"  MODELINGTYPE "${modelingDeGrupo(g.pf)}"  WALLTHICKNESS ${rd(cL(t))} `
        // Una membrana de ACERO (lamina de zinc, chapa) no es un deck de
        // hormigon: va como losa Membrane con su material y su espesor.
        : g.mem && g.acero
        ? `  SHELLPROP  "${g.nombre}"  PROPTYPE  "Slab"  MATERIAL "${g.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${rd(cL(t))} `
        : g.mem
        // Un DECK no es una losa con otro nombre: ETABS lo deja en ShellType 3
        // (Membrane) le pidas lo que le pidas, y sus cotas describen el perfil
        // de la lamina. El espesor `t` es el TOTAL = capa + nervio.
        ? `  SHELLPROP  "${g.nombre}"  PROPTYPE  "Deck"  DECKTYPE "Filled"  CONCMATERIAL "${defaultShellMat}"  DECKMATERIAL "${defaultShellMat}"  DECKSLABDEPTH ${dk2(t * 65 / 120)} DECKRIBDEPTH ${dk2(t * 55 / 120)} DECKRIBWIDTHTOP ${dk2(t * 150 / 120)} DECKRIBWIDTHBOTTOM ${dk2(t * 100 / 120)} DECKRIBSPACING ${dk2(t * 200 / 120)} DECKSHEARTHICKNESS ${dk2(t * 0.76 / 120)} DECKUNITWEIGHT ${rp(cF(0.11012))} SHEARSTUDDIAM ${dk2(t * 19 / 120)} SHEARSTUDHEIGHT ${dk2(t * 100 / 120)} SHEARSTUDFU 400 `
        : `  SHELLPROP  "${g.nombre}"  PROPTYPE  "Slab"  MATERIAL "${defaultShellMat}"  MODELINGTYPE "${modelingDeGrupo(g.pf)}"  SLABTYPE "Slab"  SLABTHICKNESS ${rd(cL(t))} `);
      const lm = lineaModsGrupo(g.nombre, k);
      if (lm) lines.push(lm);
    }
    lines.push(``);
  }

  if (areaElements.length > 0) {
    lines.push(`$ AREA CONNECTIVITIES`);
    const aaEntries: string[] = [];
    areaElements.forEach((ae, ai) => {
      const { el, isWall } = ae;
      const aName = isWall ? `W${ai + 1}` : `F${ai + 1}`;
      const aType = isWall ? "PANEL" : "FLOOR";
      // Get plan points for 4 nodes
      const ps = el.map(ni => nodeToPS(ni));
      if (isWall) {
        // PANEL de muro: pt1 pt2 pt2 pt1 con salto de planta 1 1 0 0. Es la
        // forma de ETABS para un pano vertical que sube de una planta a la
        // siguiente: DOS puntos en planta y dos plantas.
        //
        // ⚠️ Pero eso solo vale si el pano ES eso. Cuando los cuatro nudos
        // caen en la misma planta con descensos distintos (la membrana de
        // Cook, una cascara 3D), ETABS escribe los CUATRO puntos distintos y
        // el salto de planta de cada uno:
        //
        //     ETABS    AREA "W1" PANEL 4 "1" "2" "11" "10"  1 0 0 0
        //     Hekatan  AREA "W1" PANEL 4 "1" "2" "2"  "1"   1 1 0 0
        //
        // Con la forma de muro, ETABS al reimportar Cook daba 125 nudos y 36
        // areas en vez de 81 y 64. Comprobado pidiendole a ETABS su propio e2k
        // del mismo modelo (galpon-bodega-electoral/e2k_de_etabs.py).
        const idxPl = (st: string) => storyNames.indexOf(st);
        const cuatroDistintos = new Set(ps.map(q => q.pt)).size === 4;
        if (cuatroDistintos) {
          const iTop = Math.max(...ps.map(q => idxPl(q.story)));
          const salto = ps.map(q => iTop - idxPl(q.story));
          lines.push(`  AREA "${aName}"  ${aType}  4  "${ps[0].pt}"  "${ps[1].pt}"  "${ps[2].pt}"  "${ps[3].pt}"  ${salto.join("  ")}  `);
          // ⚠️ ADDRESTRAINT "No", NO "Yes" (8-sep-2026). Con "Yes", cuando ETABS AUTOMALLA el pano
          // empotra todos los nudos NUEVOS del borde que toquen un nudo restringido: una losa de
          // 5x5 apoyada solo en sus 4 esquinas salia con el borde entero empotrado y 7 VECES mas
          // rigida (w 4.99e-4 contra 3.58e-3). Con "No" da 3.5841e-3 = Hekatan con `automesh 1.25`
          // a 0.00000 %. Y "No" es lo que escribe ETABS en su propio .$et (medido con un modelo
          // hecho por OAPI sin tocar nada). No se veia en las plantillas porque alli la malla ya
          // va hecha en el fichero y ETABS no crea ni un nudo.
          aaEntries.push(`  AREAASSIGN  "${aName}"  "${storyNames[iTop]}"  SECTION "${secDe(ae)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
          return;
        }
        // Use bottom-left and bottom-right points (Z-up: n[2] = elevation)
        const bot0 = nodes[el[0]][2] <= nodes[el[2]][2] ? 0 : 2;
        const bot1 = nodes[el[1]][2] <= nodes[el[3]][2] ? 1 : 3;
        lines.push(`  AREA "${aName}"  ${aType}  4  "${ps[bot0].pt}"  "${ps[bot1].pt}"  "${ps[bot1].pt}"  "${ps[bot0].pt}"  1  1  0  0  `);
        // Assign at story of top nodes
        const topStory = ps[bot0 === 0 ? 2 : 0].story;
        aaEntries.push(`  AREAASSIGN  "${aName}"  "${topStory}"  SECTION "${secDe(ae)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
      } else {
        // FLOOR: pt1 pt2 pt3 pt4 + el salto de planta de cada punto — y con 3
        // puntos, un triangulo. El contador y el numero de saltos siguen al
        // numero de puntos: un `3` con cuatro saltos deja a ETABS leyendo
        // basura.
        //
        // ⚠️ Los saltos iban a `0 0 0 0` FIJO, o sea que los cuatro nudos
        // acababan en la MISMA planta y el area salia PLANA. En un edificio da
        // igual —una losa es horizontal— pero una CASCARA CURVA se aplasta:
        // medido el 2026-08-28 con el hemisferio de R = 10 m, sus 40 FLOOR
        // salian con `0 0 0 0` y ETABS lo devolvia con los radios entre
        // **9.4884 y 10.7448** (7 % fuera de la esfera), 131 nudos en vez de 81
        // y solo 82 sobre la superficie.
        //
        // Se cuenta igual que en el muro de cuatro puntos distintos: se asigna
        // a la planta MAS ALTA de los nudos y cada punto lleva cuantas plantas
        // baja. `storyNames` va de abajo arriba (Base primero), asi que el
        // indice mayor es la cota mayor y `iTop - idx` sale positivo hacia
        // abajo — que es el criterio de ETABS (medido con el muro W901).
        const n = ps.length;
        const idxPl2 = (st: string) => storyNames.indexOf(st);
        const iTop2 = Math.max(...ps.map(q => idxPl2(q.story)));
        const salto2 = ps.map(q => iTop2 - idxPl2(q.story));
        const storyArea = storyNames[iTop2] ?? ps[0].story;
        lines.push(`  AREA "${aName}"  ${aType}  ${n}  ` +
          ps.map(q => `"${q.pt}"`).join("  ") + "  " +
          salto2.join("  ") + "  ");
        // Un deck se asigna por su propio nombre de seccion y con ANG: el eje
        // local decide A QUIEN le entrega la carga (salva perpendicular a las
        // secundarias). Sin el ANG la reparte al reves. Y no lleva DIAPH ni
        // ADDRESTRAINT "No" — asi lo escribe ETABS.
        const ang = angDeObjeto.get(ae.idx) ?? shellAngles?.get(ae.idx);
        // La planta del assign es la de REFERENCIA de los saltos: la mas alta.
        // ⚠️ Iba `SECTION "${DECK_SEC}"` FIJO y la rama la elegia la bandera
        // GLOBAL: en un modelo mixto las 76 areas se asignaban a "DECK",
        // incluidas las losas macizas, y los demas grupos quedaban escritos y
        // sin usar. Se decide POR ELEMENTO y se asigna SU grupo.
        aaEntries.push(esMembranaDe(ae.idx)
          ? `  AREAASSIGN  "${aName}"  "${storyArea}"  SECTION "${secDe(ae)}"  ANG ${rd(ang ?? 0)} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `
          // DIAPH en el AREA hace que ETABS ate TODA la malla de la losa (medido
          // el 8-sep-2026: no es lo mismo que atar los POINTs de eje). Solo va si
          // Hekatan ata los cuatro nudos del elemento; si solo ata los ejes de
          // columna (como SAP2000), el area no lleva DIAPH.
          : `  AREAASSIGN  "${aName}"  "${storyArea}"  SECTION "${secDe(ae)}" ${usarDiafragma && (!nudosDiaf.size || (elements[ae.idx] ?? []).every((n) => nudosDiaf.has(n))) ? ` DIAPH  "D1" ` : ""} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "TOP"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
        areaLoadRefs.push({ name: aName, story: storyArea, idx: ae.idx });
      }
    });
    lines.push(``);

    lines.push(`$ AREA ASSIGNS`);
    aaEntries.forEach(aa => lines.push(aa));
    lines.push(``);
  }

  // ── LOAD PATTERNS ───────────────────────────────────────────────────
  // Dos modos según `weightMode`:
  //   "auto" (default): SELFWEIGHT=1 → ETABS computa γ·V de cada material
  //     automáticamente. Se omiten cargas nodales FZ (asumidas self-weight).
  //     Se mantienen FX/FY (laterales) y momentos como POINTLOAD.
  //   "manual": SELFWEIGHT=0 + emite TODAS las cargas nodales (incluyendo FZ).
  //     Requiere que POINTASSIGN registre el plan-point en cada story con carga
  //     (ya emitido arriba). El formato POINTLOAD usa sintaxis `LC "${patronGravedad}"`
  //     después de TYPE para mayor compatibilidad con ETABS.
  const selfWt = weightMode === "manual" ? 0 : (swDecl ?? 1);
  lines.push(`$ LOAD PATTERNS`);
  const pats = input.loadPatterns?.length
    ? input.loadPatterns
    : [{ name: "Dead", type: "Dead", selfWeightMultiplier: selfWt },
       { name: "Live", type: "Live", selfWeightMultiplier: 0 }];
  for (const lp of pats) {
    // ── El PESO PROPIO va SOLO en Dead ───────────────────────────────────────
    //
    // Es el peso de la estructura: no es una sobrecarga de uso, ni viento, ni
    // sismo. Antes se respetaba el `selfWeightMultiplier` que trajera cada
    // patron, asi que un Live con SW = 1 metia el peso de la estructura DOS
    // veces en cuanto se combinaba con Dead — y sin que nada lo dijera.
    // Ahora, en cualquier patron que no sea de tipo Dead, se fuerza a 0.
    //
    // Sigue siendo OPCIONAL en Dead: `selfWeightMultiplier: 0` (o el modo de
    // peso "manual", que lo emite como cargas nodales) lo apaga.
    let sw: number;
    if (lp.type === "Dead") {
      sw = weightMode === "manual" ? 0 : (lp.selfWeightMultiplier ?? swDecl ?? 1);
    } else {
      sw = 0;
      if ((lp.selfWeightMultiplier ?? 0) !== 0) {
        console.warn(`[e2k] El patron "${lp.name}" (tipo ${lp.type ?? "Other"}) pedia ` +
          `SELFWEIGHT ${lp.selfWeightMultiplier}. Se exporta 0: el peso propio va solo en Dead.`);
      }
    }
    lines.push(`  LOADPATTERN "${lp.name}"  TYPE  "${lp.type ?? "Other"}"  SELFWEIGHT  ${sw}`);
  }
  lines.push(``);
  // El LC al que se cuelgan las cargas nodales: el primer patron de gravedad
  // del modelo. Antes era la cadena "Dead" fija, asi que si el modelo llamaba
  // a su patron de otra forma, ETABS importaba cargas huerfanas.
  // El patron al que van las cargas del USUARIO. Por defecto el de gravedad
  // (compatibilidad con todo lo exportado hasta ahora), pero se puede mandar a
  // "Live" para separarlo del peso propio — ver `loadPatternDestino`.
  const patronGravedad = input.loadPatternDestino
    && pats.some(p => p.name === input.loadPatternDestino)
      ? input.loadPatternDestino
      : (pats.find(p => p.type === "Dead")?.name ?? pats[0].name);

  // ── POINT OBJECT LOADS ─────────────────────────────────────────────
  //
  // ⚠️ UNA SOLA linea POINTLOAD por nudo, con las SEIS componentes.
  //
  // Antes se emitia una linea por componente no nula (FX, FY, los momentos, y
  // FZ aparte), o sea hasta CUATRO lineas para el mismo nudo. ETABS al importar
  // se queda con UNA y descarta las demas: de los 4078.45 kN del galpon
  // llegaban **0.42 kN**, y el modelo reimportado resolvia con la deformada
  // practicamente en cero sin dar ningun error. Medido: 198 de 252 nudos
  // llevaban mas de una POINTLOAD.
  //
  // El formato sale de un e2k real de ETABS:
  //   POINTLOAD "3" "Level_1" LC "Dead" TYPE "FORCE" FX 0 FY 0 FZ -20 MX 0 MY 0 MZ 0
  //
  // Los MOMENTOS no son opcionales: una carga repartida sobre barra
  // (`frameload`) se convierte a fuerzas Y momentos de empotramiento, y son los
  // momentos los que distinguen una viga continua de un reparto nodal —
  // omitirlos manda 16 % menos carga al apoyo interior de un vano ancho.
  const userLoadLines: string[] = [];
  const acumulado = new Map<number, number[]>();
  const meter = (nodeIdx: number, v: number[]) => {
    const a = acumulado.get(nodeIdx) ?? [0, 0, 0, 0, 0, 0];
    for (let k = 0; k < 6; k++) a[k] += v[k] ?? 0;
    acumulado.set(nodeIdx, a);
  };

  // FZ: en modo "auto" se omite porque se da por hecho que ESA carga vertical
  // ES el peso propio y ETABS ya lo mete por `SELFWEIGHT 1`. En "manual" se
  // emite. Y SIEMPRE que las cargas NO vayan al patron del peso propio: si van
  // a Live (que lleva SELFWEIGHT 0), omitir la FZ deja el caso sin una sola
  // carga y ETABS lo resuelve con todo a 0.000.
  const esPatronDePesoPropio = patronGravedad
    === (pats.find(p => p.type === "Dead")?.name ?? pats[0].name);
  const emitirFz = weightMode === "manual" || !esPatronDePesoPropio || modoExacto;

  if (nodeInputs.loads && nodeInputs.loads.size > 0) {
    nodeInputs.loads.forEach((load, nodeIdx) => {
      const [fx, fy, fz] = cargaPropia(nodeIdx, load);
      const [mx, my, mz] = momentoPropio(nodeIdx, load);
      meter(nodeIdx, [fx, fy, emitirFz ? fz : 0, mx, my, mz]);
    });
  }
  if ((nodeInputs as any).moments && (nodeInputs as any).moments.size > 0) {
    (nodeInputs as any).moments.forEach((m: number[], nodeIdx: number) => {
      meter(nodeIdx, [0, 0, 0, m[0] ?? 0, m[1] ?? 0, m[2] ?? 0]);
    });
  }
  acumulado.forEach((v, nodeIdx) => {
    if (v.every(x => Math.abs(x) <= 1e-10)) return;
    const ps = nodeToPS(nodeIdx);
    userLoadLines.push(
      `  POINTLOAD  "${ps.pt}"  "${ps.story}"  TYPE "FORCE"  LC "${patronGravedad}"` +
      `  FX ${rp(cFN(v[0]))}  FY ${rp(cFN(v[1]))}  FZ ${rp(cFN(v[2]))}` +
      `  MX ${rp(cMN(v[3]))}  MY ${rp(cMN(v[4]))}  MZ ${rp(cMN(v[5]))}`);
  });
  if (userLoadLines.length > 0) {
    lines.push(`$ POINT OBJECT LOADS`);
    userLoadLines.forEach(l => lines.push(l));
    lines.push(``);
  }

  // ── FRAME OBJECT LOADS (modo auto exacto): la carga repartida de cada barra
  // tal cual la escribe ETABS: LINELOAD "E12" "Story1" TYPE "UNIFF" DIR "GRAV"
  // LC "Dead" FVAL w  (N/mm; GRAV positivo hacia abajo). Una barra que quedo
  // dentro de una cadena de columnas no tiene LINE propia: su carga se queda
  // repartida en los nudos (no se desconto arriba).
  if (modoExacto && conLineLoad.size > 0) {
    const ll: string[] = [];
    for (const idx of conLineLoad) {
      const w = fLoadsAll!.get(idx)!; const ln = lineaDe.get(idx);
      if (!ln) continue;
      const cw = (v: number) => rp(cF(v) / lengthFactor);   // kN/m -> N/mm
      if (Math.abs(w[2]) > 1e-12) ll.push(`  LINELOAD  "${ln.name}"  "${ln.story}"  TYPE "UNIFF"  DIR "${w[2] < 0 ? "GRAV" : "Z"}"  LC "${patronGravedad}"  FVAL ${cw(Math.abs(w[2]))}`);
      if (Math.abs(w[0]) > 1e-12) ll.push(`  LINELOAD  "${ln.name}"  "${ln.story}"  TYPE "UNIFF"  DIR "X"  LC "${patronGravedad}"  FVAL ${cw(w[0])}`);
      if (Math.abs(w[1]) > 1e-12) ll.push(`  LINELOAD  "${ln.name}"  "${ln.story}"  TYPE "UNIFF"  DIR "Y"  LC "${patronGravedad}"  FVAL ${cw(w[1])}`);
    }
    if (ll.length) { lines.push(`$ FRAME OBJECT LOADS`); ll.forEach(l => lines.push(l)); lines.push(``); }
  }

  // ── SHELL OBJECT LOADS ─────────────────────────────────────────────
  // La carga de superficie tal cual, sin repartir. Hekatan la convierte a
  // nodal para resolver (vector consistente), pero si la exporta ya repartida
  // el e2k deja de parecerse al de ETABS y, peor, al reimportarlo la carga
  // queda clavada en los nudos: cambias la malla y ya no se redistribuye.
  //   TYPE "UNIFF"  DIR "GRAV"  — asi lo escribe ETABS (medido, no supuesto).
  if (shellLoads && shellLoads.size > 0 && areaLoadRefs.length > 0) {
    const shellLoadLines: string[] = [];
    for (const ref of areaLoadRefs) {
      const qObj = qDeObjeto.get(ref.idx);
      const q = qObj !== undefined ? { value: qObj } : shellLoads.get(ref.idx);
      if (!q || Math.abs(q.value) < 1e-12) continue;
      // Ojo con el signo: en Hekatan (Z arriba) la carga hacia abajo es
      // NEGATIVA, pero DIR "GRAV" de ETABS YA apunta hacia abajo. Pasarle el
      // -0.0093 tal cual la levantaria. Medido en re_carga_inclinada_etabs.py.
      const dir = q.dir ?? "GRAV";
      const fval = dir === "GRAV" ? Math.abs(q.value) : q.value;
      // ⚠️ FVAL es una PRESION: N/mm², no N/m². Con cF a secas (kN → N) el
      // 6.85 kN/m² del mezanine salia como 6850 y ETABS lo leia como 6850 N/mm²
      // = 6.85e9 N/m²: ΣRz 2.25e9 kN y la losa a −21 km (medido 2-sep-2026,
      // csi_ida_vuelta.py). La fuerza se multiplica por 1e3 y el area por 1e6.
      shellLoadLines.push(
        `  AREALOAD  "${ref.name}"  "${ref.story}"  TYPE "UNIFF"  DIR "${dir}"  LC "${q.pattern ?? patronGravedad}"  FVAL ${rp(cF(fval) / (lengthFactor * lengthFactor))}`);
    }
    if (shellLoadLines.length > 0) {
      lines.push(`$ SHELL OBJECT LOADS`);
      shellLoadLines.forEach(l => lines.push(l));
      lines.push(``);
    }
  }

  // ── ANALYSIS OPTIONS ────────────────────────────────────────────────
  // ACTIVEDOF: todos los 6 DOFs habilitados globalmente (frames 3D).
  // PDELTA NONE: análisis lineal puro (no 2do orden geométrico).
  //   Para análisis sísmico ASCE 7/NSR/NEC el usuario activaría manualmente
  //   "Non-iterative Based on Mass" en ETABS GUI (Define → P-Delta Options).
  //   Sintaxis E2K alternativa para activarlo:
  //     PDELTA METHOD "NON_ITERATIVE_BASED_ON_MASS"  MASSSOURCE "MsSrc1"
  //   Lo dejamos en NONE para el caso default lineal.
  lines.push(`$ ANALYSIS OPTIONS`);
  lines.push(`  ACTIVEDOF "UX UY UZ RX RY RZ"  `);
  lines.push(`  PDELTA  METHOD "NONE"  `);
  lines.push(``);

  // ── MASS SOURCE ─────────────────────────────────────────────────────
  //
  // De dónde saca ETABS la MASA para el modal. Y **depende de `weightMode`**,
  // porque los dos modos ponen el peso propio en sitios distintos:
  //
  //   "auto"   → SELFWEIGHT 1: el peso propio ES el patrón Dead.
  //              masa = las CARGAS del patrón Dead = γ·V/g. Correcto.
  //   "manual" → SELFWEIGHT 0: el peso propio NO está en ninguna carga; las
  //              POINTLOAD que se emiten son las cargas IMPUESTAS del modelo.
  //              Pedir la masa "de las cargas" ahí da la masa de la sobrecarga
  //              y TIRA la del material.
  //
  // ⚠️ Esto estaba fijo en `INCLUDELOADS "Yes"` para los dos modos, y en
  // "manual" mandaba a ETABS un edificio con OTRA masa. Medido el 2026-08-27
  // con las 8 plantillas (`cli/plantillas_vs_csi.mjs`): el estático cerraba al
  // 0.000 % y el modal se iba de **−72 % a +21 %** — imposible de leer, porque
  // no eran dos solvers discrepando sino dos masas distintas. El caso peor era
  // `solo-rejilla` (T₁ 0.81 s contra 2.91 s): ahí no hay losa ni vigas, o sea
  // casi nada de material, y la carga impuesta es toda la masa.
  //
  // En "manual" se pide `INCLUDEELEMENTS "Yes"` / `INCLUDELOADS "No"`, que es
  // justo lo que hace el motor: `getGlobalMassMatrix.cpp` pesa los elementos
  // por `densities` (MASA, t/m³) y no mira las cargas.
  //
  // Lo demás sigue igual y a propósito, porque el motor lo replica paso a paso
  // en `ensamblarMasa()` (modal.cpp): sólo masa LATERAL
  // (`INCLUDEVERTICALMASS "No"`) y agrupada por piso (`LUMPATSTORIES "Yes"`).
  const masaDeElementos = weightMode === "manual";
  lines.push(`$ MASS SOURCE`);
  lines.push(`  MASSSOURCE  "MsSrc1"    INCLUDEELEMENTS "${masaDeElementos ? "Yes" : "No"}"    INCLUDEADDEDMASS "No"    INCLUDELOADS "${masaDeElementos ? "No" : "Yes"}"    INCLUDEMOVE "No"    INCLUDELATERALMASS "Yes"    INCLUDEVERTICALMASS "No"    LUMPATSTORIES "Yes"    ISDEFAULT "Yes"  `);
  if (!masaDeElementos) lines.push(`  MASSSOURCELOAD  "MsSrc1"  "Dead"  1 `);
  lines.push(``);

  // ── LOAD CASES (Linear Static) ─────────────────────────────────────
  // Sin esto ETABS NO corre análisis. Define Dead y Live como casos
  // estáticos lineales independientes.
  lines.push(`$ LOAD CASES`);
  const casos = input.loadCases?.length
    ? input.loadCases
    : pats.map(p => ({ name: p.name, type: "Linear Static",
                       patterns: [{ pattern: p.name, scaleFactor: 1 }] }));
  for (const lc of casos) {
    lines.push(`  LOADCASE "${lc.name}"  TYPE  "${lc.type ?? "Linear Static"}"  INITCOND  "PRESET"  `);
    for (const pp of lc.patterns ?? []) {
      lines.push(`  LOADCASE "${lc.name}"  LOADPAT  "${pp.pattern}"  SF ${pp.scaleFactor} `);
    }
  }
  // Caso modal estándar (Modal-Eigen).
  //
  // ⚠️ Eran **3 modos**, con el argumento de que bastan para validar f₁/f₂/f₃.
  // No bastan: el motor devuelve 12 y los modos se emparejan por PARTICIPACIÓN
  // de masa, no por número de orden — un edificio con muros tiene el modo de
  // torsión por debajo del cuarto, y con 3 modos ETABS ni lo calcula, así que
  // ese modo se queda sin pareja y no se puede comparar. Medido el 2026-08-27
  // en las 8 plantillas: al plantilla dual le faltaba el modo 2 y a
  // `solo-rejilla` dos de los tres (`cli/plantillas_vs_csi.mjs`).
  //
  // 12 es lo que pide un modal serio y lo que devuelve `_modal` por defecto.
  // No cuesta: ETABS reduce solo a la cantidad de GDL con masa disponibles si
  // el modelo tiene menos.
  const nModosModal = input.modalModes ?? 12;
  lines.push(`  LOADCASE "Modal"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  `);
  lines.push(`  LOADCASE "Modal"  MAXMODES ${nModosModal}  MINMODES 1  EIGENSHIFTFREQ 0  EIGENCUTOFFFREQ 0  EIGENTOL 1E-09  ALLOWAUTOFREQSHIFT "Yes"  `);
  lines.push(``);

  // ── LOAD COMBINATIONS ──────────────────────────────────────────────
  // SOLO las que trae el modelo. Antes estaban ESCRITAS A MANO aqui (1.4D y
  // 1.2D+1.6L fijas), asi que todo e2k exportado las llevaba aunque el modelo
  // no tuviera ninguna — y el e2k que escribe ETABS para el mismo modelo no
  // trae `$ LOAD COMBINATIONS` en absoluto. Eso rompia la ida y vuelta:
  // exportabas, reimportabas, y aparecian combinaciones de la nada.
  const combos = input.loadCombinations;
  if (combos && combos.length) {
    lines.push(`$ LOAD COMBINATIONS`);
    for (const cm of combos) {
      lines.push(`  COMBO "${cm.name}"  TYPE "${cm.type ?? "Linear Add"}"  `);
      for (const c of cm.cases ?? []) {
        lines.push(`  COMBO "${cm.name}"  LOADCASE  "${c.case}"  SF ${c.scaleFactor} `);
      }
    }
    lines.push(``);
  }

  lines.push(`  END`);
  lines.push(`$ END OF MODEL FILE`);
  return lines.join("\r\n");
}

/** Guess element type from geometry (Y-up convention: Y = vertical) */
function guessElementType(nodes: Node[], el: number[]): string {
  const n0 = nodes[el[0]], n1 = nodes[el[1]];
  const dz = Math.abs(n1[2] - n0[2]); // Z = vertical (Hekatan-Struct convention)
  const dxy = Math.sqrt((n1[0] - n0[0]) ** 2 + (n1[1] - n0[1]) ** 2); // XY = horizontal plane
  const isCol = dz > dxy * 0.5;
  const isBrace = isCol && dxy > 0.01;
  return isBrace ? "BRACE" : isCol ? "COLUMN" : "BEAM";
}
