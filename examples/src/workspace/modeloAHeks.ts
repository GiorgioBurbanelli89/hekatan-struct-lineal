/**
 * 💾 El modelo que hay en pantalla, escrito como `.heks`.
 *
 * POR QUÉ EXISTE (18-sep-2026). «Guardar .heks», «Compartir enlace» y «Exportar .tcl»
 * llamaban a `window.__hekatanModeloAHeks`, un gancho que **solo definía `new-blank`**
 * (el lienzo en blanco). Con una plantilla cargada —un edificio dual, por ejemplo— el
 * gancho no existía y los tres se quedaban con el texto del cuadro CLI: vacío. Resultado
 * medido: fichero de 0 KB, enlace sin modelo y un `.tcl` de 93 bytes para un edificio de
 * tres plantas. Jorge pidió el `.heks` del modelo dual y no había forma de dárselo.
 *
 * Aquí se escribe el `.heks` desde los `states` —lo que el solver tiene de verdad—, así
 * que sirve para CUALQUIER modelo: plantilla, ejemplo, dibujo a mano o importado.
 *
 * ── LAS DOS TRAMPAS DEL FORMATO (están en CLAUDE.md, y aquí se respetan) ──
 *   · `frame id nI nJ E A I22 I33 J nu rho`: el 6.º token es **I22** (plano 1-3) y el
 *     7.º es **I33** (el del canto). Cruzarlos cambia la estructura.
 *   · `as id As2 As3`: **As2 va con I33** → `shearAreasZ`; As3 con I22 → `shearAreasY`
 *     (así lo lee `cliModeler.ts`, líneas 1299-1300).
 *   · `shell id n1 n2 n3 n4 t E [q] [rho]`: el espesor va ANTES que E, y el 8.º token es
 *     CARGA de superficie (kN/m²), no ν.
 *
 * ── LO QUE NO SABE GUARDAR ──
 * Los muelles de Winkler no viven en `states` (cada ejemplo se los pasa a `deform()`
 * aparte), así que si no llegan por `opts.springs` o por `window.__hekatanSpringsUltimos`
 * NO se inventan: el fichero sale con un aviso visible en la cabecera. Un modelo al que
 * le faltan los muelles es otra estructura, y callarlo sería peor que no guardar.
 */

type Mapa = Map<number, number> | undefined;

export interface OpcionesHeks {
  /** Nombre del modelo, para el comentario de cabecera. */
  nombre?: string;
  /** Directivas de semántica que van ARRIBA del todo (`deck etabs`, `etabsjoint 1`…). */
  directivas?: string[];
  /** Muelles nodales, si el ejemplo los tiene: `{node, dof, k}` con node = índice 0-based. */
  springs?: Array<{ node: number; dof: number; k: number }>;
}

const N = (v: number | undefined, def: number): string => {
  const x = v === undefined || !isFinite(v) ? def : v;
  // 6 cifras significativas: suficiente para reconstruir el modelo y legible.
  return String(Number(x.toPrecision(6)));
};
const g = (m: Mapa, i: number): number | undefined => m?.get(i);

/** Nombres de GDL de `spring` tal y como los lee el parser. */
const DOF = ["ux", "uy", "uz", "rx", "ry", "rz"];

export function modeloAHeks(states: any, opts: OpcionesHeks = {}): string {
  const nodes: number[][] = states?.nodes?.val ?? [];
  const elements: number[][] = states?.elements?.val ?? [];
  const ni: any = states?.nodeInputs?.val ?? {};
  const ei: any = states?.elementInputs?.val ?? {};
  if (!nodes.length) return "";

  const L: string[] = [];
  const avisos: string[] = [];   // lo que el fichero NO puede guardar fiel: va a la cabecera
  const hoy = new Date().toISOString().slice(0, 10);
  L.push(`# ${opts.nombre ?? "Modelo de Hekatan Struct"} — guardado el ${hoy}`);
  L.push(`# ${nodes.length} nudos · ${elements.length} elementos`);

  // Los muelles van DENTRO de `nodeInputs.springs` desde que cliModeler los mete ahí
  // (cliModeler.ts:1721). Un nudo NEGATIVO no es un nudo: es −(elemento+1), o sea un
  // muelle de ÁREA o el nudo colgado del `edge etabs`.
  const springs: Array<{ node: number; dof: number; k: number }> =
    opts.springs ?? ni.springs ?? (globalThis as any).__hekatanSpringsUltimos ?? [];
  const hayMuellesSinGuardar = !springs.length && !!ei.areaSpringsExport?.size;
  if (hayMuellesSinGuardar) {
    L.push("# ⚠️ ESTE MODELO LLEVABA MUELLES (Winkler) QUE NO SE HAN PODIDO GUARDAR:");
    L.push("#    sin ellos la estructura NO es la misma. Revisalo antes de usar el fichero.");
  }
  L.push("");

  // ── Directivas. Las que cambian el MODELO al leerlo (`deck etabs`, `automesh`) NO se
  // reescriben: sus efectos ya están dentro de los nudos, elementos y cargas que se
  // guardan, y volver a aplicarlas los duplicaría. Sí van las que cambian cómo se
  // RESUELVE (peso propio, sólidos incompatibles, unión de ETABS, cruces).
  //
  // ⚠️ `selfweight` NO se reescribe, y esto costó una medida: el lector reparte el peso
  // propio a los nudos en cuanto lo lee, así que ya viaja DENTRO de `load`. Guardándolo
  // otra vez, el modelo releído pesaba el doble — la cimentación de 9 zapatas se iba un
  // 44 % en desplazamientos (test `heks-ida-y-vuelta`, 18-sep-2026). Se deja constancia
  // en un comentario para quien abra el fichero.
  const directivas = [...(opts.directivas ?? [])];
  if (ei.selfWeight) L.push(`# (el peso propio × ${N(ei.selfWeight, 1)} ya está repartido en las cargas nodales de abajo)`);
  if (ei.solidIncompatible !== undefined) directivas.push(`incompatible ${ei.solidIncompatible ? 1 : 0}`);
  if (ei.etabsWallJoint !== undefined) directivas.push(`etabsjoint ${ei.etabsWallJoint ? 1 : 0}`);
  if (ei.meshAtIntersections) directivas.push("meshcross 1");
  // El nudo colgado del `edge etabs` llega como muelle de elemento (gdl −2/−4): no es un
  // muelle que se pueda escribir nudo a nudo, se reproduce con su directiva.
  if (springs.some((s) => s.node < 0 && (s.dof === -2 || s.dof === -4))) directivas.push("edge etabs");
  for (const d of directivas) if (d?.trim()) L.push(d.trim());
  if (directivas.length) L.push("");

  // ── Nudos. El id del .heks es el índice + 1 (1-based, como se lee mejor). ──
  L.push("# nudos: node id x y z");
  nodes.forEach((p, i) => L.push(`node ${i + 1} ${N(p[0], 0)} ${N(p[1], 0)} ${N(p[2], 0)}`));
  L.push("");

  // ── Elementos ──
  const barras: number[] = [];
  const cascaras: number[] = [];
  const solidos: number[] = [];
  elements.forEach((el, e) => {
    if (el.length === 2) barras.push(e);
    else if (el.length === 3 || el.length === 4) cascaras.push(e);
    else if (el.length === 8) solidos.push(e);
  });

  if (barras.length) {
    L.push("# barras: frame id nI nJ E A I22 I33 J nu rho    (6.º token = I22, 7.º = I33)");
    for (const e of barras) {
      const el = elements[e];
      const E = g(ei.elasticities, e) ?? 25e6;
      const A = g(ei.areas, e) ?? 0.16;
      const I22 = g(ei.momentsOfInertiaY, e) ?? 0.001;   // plano 1-3
      const I33 = g(ei.momentsOfInertiaZ, e) ?? I22;     // plano 1-2 (canto)
      const J = g(ei.torsionalConstants, e) ?? I22 + I33;
      const nu = g(ei.poissonsRatios, e) ?? 0.2;
      const rho = g(ei.densities, e) ?? 2.45;
      L.push(`frame ${e + 1} ${el[0] + 1} ${el[1] + 1} ${N(E, 25e6)} ${N(A, 0.16)} ` +
             `${N(I22, 0.001)} ${N(I33, 0.001)} ${N(J, 0.002)} ${N(nu, 0.2)} ${N(rho, 2.45)}`);
    }
    // Áreas de cortante: As2 ↔ shearAreasZ, As3 ↔ shearAreasY (ver cabecera).
    const conAs = barras.filter((e) => g(ei.shearAreasZ, e) !== undefined || g(ei.shearAreasY, e) !== undefined);
    if (conAs.length) {
      L.push("# áreas de cortante: as id As2 As3   (As2 va con I33)");
      for (const e of conAs) {
        L.push(`as ${e + 1} ${N(g(ei.shearAreasZ, e), 0)} ${N(g(ei.shearAreasY, e), 0)}`);
      }
    }
    const conAng = barras.filter((e) => (g(ei.localAngles, e) ?? 0) !== 0);
    if (conAng.length) {
      L.push("# ángulo del eje local (CSI): ang id grados");
      for (const e of conAng) L.push(`ang ${e + 1} ${N(g(ei.localAngles, e), 0)}`);
    }
    L.push("");
  }

  if (cascaras.length) {
    L.push("# cáscaras: shell id n1 n2 n3 n4 t E [q] [rho]   (el espesor va ANTES que E)");
    for (const e of cascaras) {
      const el = elements[e];
      const p = el.length === 4 ? el : [el[0], el[1], el[2], el[2]];  // triángulo = Q4 con el 3.º repetido
      const t = g(ei.thicknesses, e) ?? 0.2;
      const E = g(ei.elasticities, e) ?? 25e6;
      const q = g(ei.shellSurfaceLoads, e) ?? 0;
      const rho = g(ei.densities, e) ?? 2.45;
      L.push(`shell ${e + 1} ${p[0] + 1} ${p[1] + 1} ${p[2] + 1} ${p[3] + 1} ` +
             `${N(t, 0.2)} ${N(E, 25e6)} ${N(q, 0)} ${N(rho, 2.45)}`);
    }
    // `plateFormulations`: 0 = Thick (MITC4), 1 = Thin (DKQ) y 2 = **placa DSE completa de
    // Wilson (cap. 8)** — así lo resuelve el solver (`shellQ4.cpp:1787`), aunque el
    // comentario de `data-model.ts` diga «2 = MEMBRANA». El lector `.heks` solo sabe
    // `shelltype thin|thick`: el 2 NO se puede declarar. Se escribe como `thick` (lo más
    // cercano) y la cabecera AVISA con cuántas cáscaras, porque el modelo releído NO es
    // el mismo (medido en el dual `test-m-dual` ms=1.0: 4.4 % en el peor nudo). Callarlo
    // sería entregar un fichero que parece bueno y no lo es.
    const conTipo = cascaras.filter((e) => g(ei.plateFormulations, e) !== undefined);
    const dse = conTipo.filter((e) => g(ei.plateFormulations, e) === 2);
    if (dse.length) avisos.push(
      `# ⚠️ ${dse.length} cáscara(s) usan la placa DSE de Wilson (plateFormulations = 2), que el ` +
      `lector .heks aún no sabe declarar:`,
      "#    se guardan como `thick` y el modelo releído DIFIERE. Falta en el lector: `shelltype id dse`.");
    if (conTipo.length) {
      L.push("# formulación de placa: shelltype id thin|thick   (el 2 = DSE sale como thick, ver aviso arriba)");
      for (const e of conTipo) L.push(`shelltype ${e + 1} ${g(ei.plateFormulations, e) === 1 ? "thin" : "thick"}`);
    }
    // El tipo de DRILLING tampoco tiene orden en el `.heks` (el lector usa el suyo). Medido en
    // el dual: pesa un 0.004 % en desplazamientos, pero se avisa igual — no es el mismo elemento.
    const conDrill = cascaras.filter((e) => g(ei.drillingTypes, e) !== undefined);
    if (conDrill.length) avisos.push(
      `# ⚠️ ${conDrill.length} cáscara(s) declaran su tipo de drilling (drillingTypes), que el .heks no guarda:`,
      "#    al releerlo se usa el del lector (en el dual medido: 0.004 % en desplazamientos).");
    const conMod = cascaras.filter((e) =>
      g(ei.membraneModifiers, e) !== undefined || g(ei.bendingModifiers, e) !== undefined);
    if (conMod.length) {
      L.push("# modificadores: shellmod id membrana flexión");
      for (const e of conMod) {
        L.push(`shellmod ${e + 1} ${N(g(ei.membraneModifiers, e), 1)} ${N(g(ei.bendingModifiers, e), 1)}`);
      }
    }
    const conAngS = cascaras.filter((e) => (g(ei.shellAngles, e) ?? 0) !== 0);
    if (conAngS.length) {
      L.push("# ángulo local de cáscara: shellang id grados");
      for (const e of conAngS) L.push(`shellang ${e + 1} ${N(g(ei.shellAngles, e), 0)}`);
    }
    L.push("");
  }

  if (solidos.length) {
    L.push("# sólidos: hex id n1..n8 [E nu rho]");
    for (const e of solidos) {
      const el = elements[e];
      L.push(`hex ${e + 1} ${el.map((n) => n + 1).join(" ")} ` +
             `${N(g(ei.elasticities, e), 25e6)} ${N(g(ei.poissonsRatios, e), 0.2)} ${N(g(ei.densities, e), 2.45)}`);
    }
    L.push("");
  }

  // ── Apoyos, cargas, muelles, diafragmas, masas ──
  if (ni.supports?.size) {
    L.push("# apoyos: support nudo ux uy uz rx ry rz   (1 = restringido)");
    for (const [i, s] of ni.supports as Map<number, boolean[]>) {
      L.push(`support ${i + 1} ${s.map((b) => (b ? 1 : 0)).join(" ")}`);
    }
    L.push("");
  }
  if (ni.loads?.size) {
    L.push("# cargas nodales: load nudo fx fy fz mx my mz   (kN, kN·m)");
    for (const [i, f] of ni.loads as Map<number, number[]>) {
      if (f.every((v) => !v)) continue;
      L.push(`load ${i + 1} ${f.map((v) => N(v, 0)).join(" ")}`);
    }
    L.push("");
  }
  const nodales = springs.filter((s) => s.node >= 0);
  const deArea = springs.filter((s) => s.node < 0 && (s.dof === -1 || s.dof === -3));
  if (nodales.length) {
    L.push("# muelles (Winkler): spring nudo gdl k   (kN/m)");
    for (const s of nodales) L.push(`spring ${s.node + 1} ${DOF[s.dof] ?? "uz"} ${N(s.k, 0)}`);
    L.push("");
  }
  if (deArea.length) {
    L.push("# muelles de área: areaspring cáscara ks [nodal]   (kN/m³)");
    for (const s of deArea) {
      // node = −(elemento+1) → el id de la cáscara en este fichero es elemento+1
      L.push(`areaspring ${-s.node} ${N(s.k, 0)}${s.dof === -3 ? " nodal" : ""}`);
    }
    L.push("");
  }
  if (ni.diaphragms?.size) {
    L.push("# diafragma rígido: diaph nudo grupo");
    for (const [i, d] of ni.diaphragms as Map<number, number>) if (d > 0) L.push(`diaph ${i + 1} ${d}`);
    L.push("");
  }
  if (ni.masses?.size) {
    L.push("# masa concentrada (t): mass nudo m");
    for (const [i, m] of ni.masses as Map<number, number>) if (m) L.push(`mass ${i + 1} ${N(m, 0)}`);
    L.push("");
  }

  L.push("solve");
  // Los avisos van ARRIBA, justo después de las dos líneas de título, para que se vean
  // nada más abrir el fichero.
  if (avisos.length) L.splice(2, 0, ...avisos);
  return L.join("\n") + "\n";
}

/** Lo que el fichero NO pudo guardar fiel (para decírselo al usuario al guardar). */
export function avisosHeks(texto: string): string[] {
  // Cada aviso son dos líneas: la del ⚠️ y su explicación («#    …»). Se devuelven las dos.
  const out: string[] = [];
  const ls = texto.split("\n");
  ls.forEach((l, i) => {
    if (!l.startsWith("# ⚠️")) return;
    out.push(l);
    if (ls[i + 1]?.startsWith("#    ")) out.push(ls[i + 1]);
  });
  return out;
}

/** ¿Hay algo que guardar? Sirve para no descargar un fichero vacío y decirlo. */
export function hayModelo(states: any): boolean {
  return (states?.nodes?.val?.length ?? 0) > 0 && (states?.elements?.val?.length ?? 0) > 0;
}
