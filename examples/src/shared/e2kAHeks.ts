/**
 * 📥 Un `.e2k` de ETABS → un `.heks` de Hekatan Struct que se puede CALCULAR (y compartir por enlace).
 *
 * POR QUÉ EXISTE (1-oct-2026). «Importar E2K» llevaba el modelo a «Importar CSI», que lo DIBUJA pero no
 * lo analiza: sin estático, sin modal, y el enlace #h= salía con nudos y barras pero sin releases, sin
 * brazos rígidos, sin diafragma, sin patrones y sin fuente de masa. Jorge: «siempre debe poder importar
 * los modelos e2k». Aquí se hace la tubería entera, la MISMA en la app y en las pruebas:
 *
 *   1. `parseE2k(texto, { brazosAuto: true })`: geometría, secciones, releases, losas malladas como ETABS
 *      (AUTOMESH + MESHAT BEAMS) con sus ORIFICIOS recortados, cargas POR PATRÓN (peso propio dentro
 *      del suyo, cargas nocionales), diafragmas por planta, fuente de masa, sismo por coeficiente y
 *      espectros.
 *   2. `coserModelo`: funde nudos coincidentes y parte cada barra por los nudos que caen encima (las
 *      vigas por los nudos de la malla de la losa), con el release y el brazo de cada cara solo en su
 *      trozo extremo.
 *   3. Se escribe el `.heks` EXPLÍCITO: cada nudo, cada barra, cada celda de losa, las cargas de cada
 *      patrón ya en los nudos. Lo que ETABS calcula al analizar (masa desde las cargas, el sismo por
 *      coeficiente) va como DIRECTIVA (`masssource`, `sismocoef`) y lo calcula `cliModeler` al resolver.
 */
import { parseE2k, type E2kModel } from "./e2kParser";
import { coserModelo, type InformeCosido } from "./e2kCoser";
import { cargaBarraConsistente } from "./cargaBarraConsistente";

export interface ResultadoE2kHeks {
  heks: string;
  modelo: E2kModel;
  cosido: InformeCosido;
  avisos: string[];
  /** Lo que la MEMORIA TÉCNICA lista y el .heks no guarda: materiales y secciones con su nombre de ETABS, plantas. */
  inventario: InventarioE2k;
}

export type InventarioE2k = {
  archivo: string;
  plantas: { name: string; height: number; elev: number }[];
  /** E, fy, fc en kN/m²; densidad = PESO por volumen en kN/m³ */
  materiales: { nombre: string; tipo: string; E: number; fy?: number; fc?: number; densidad?: number }[];
  secciones: { nombre: string; forma: string; material: string; relleno?: string; D: number; B: number; TF: number; TW: number;
    tipo: string; n: number; L: number }[];
  patrones: { nombre: string; tipo: string; pesoPropio: number }[];
  sismos: { nombre: string; dir: string; coef?: number; ecc: number }[];
  nAreas: number;
  combos?: { nombre: string; items: [string, number][] }[];
};

/** materiales y secciones USADOS (con cuántas barras y cuántos metros), antes de coser: un objeto de ETABS = una barra */
function inventarioDe(m: E2kModel, archivo: string): InventarioE2k {
  const N0 = m.nodes as unknown as number[][], E0 = m.elements as unknown as number[][];
  const porSec = new Map<string, { n: number; L: number; tipos: Map<string, number> }>();
  for (const [e, nom] of m.elementSections) {
    const el = E0[e]; if (!el || el.length !== 2) continue;
    const a = N0[el[0]], b = N0[el[1]], L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    const q = porSec.get(nom) ?? porSec.set(nom, { n: 0, L: 0, tipos: new Map() }).get(nom)!;
    q.n++; q.L += L; const t = m.elementTypes[e] || "BEAM"; q.tipos.set(t, (q.tipos.get(t) ?? 0) + 1);
  }
  // materiales y secciones quedan en las unidades del FICHERO (ETABS suele escribir N y mm): a kN y m
  const Lf = ({ MM: 1e-3, CM: 1e-2, M: 1, IN: 0.0254, FT: 0.3048 } as Record<string, number>)[(m.units.length || "M").toUpperCase()] ?? 1;
  const Ff = ({ N: 1e-3, KN: 1, KGF: 9.80665e-3, TONF: 9.80665, LB: 4.44822e-3, KIP: 4.44822 } as Record<string, number>)[(m.units.force || "KN").toUpperCase()] ?? 1;
  const tens = Ff / (Lf * Lf), peso = Ff / (Lf * Lf * Lf);
  const usados = new Set<string>();
  const secciones = [...porSec].map(([nombre, q]) => {
    const s = m.frameSections.get(nombre);
    if (s?.material) usados.add(s.material); if (s?.fillMaterial) usados.add(s.fillMaterial);
    const tipo = [...q.tipos].sort((x, y) => y[1] - x[1])[0][0];
    return { nombre, forma: s?.shape ?? "", material: s?.material ?? "", relleno: s?.fillMaterial, D: (s?.D ?? 0) * Lf, B: (s?.B ?? 0) * Lf, TF: (s?.TF ?? 0) * Lf, TW: (s?.TW ?? 0) * Lf, tipo, n: q.n, L: q.L };
  }).sort((x, y) => x.tipo.localeCompare(y.tipo) || x.nombre.localeCompare(y.nombre));
  const materiales = [...m.materials].filter(([n]) => usados.has(n))
    .map(([nombre, x]) => ({ nombre, tipo: x.type, E: x.E * tens, fy: x.fy && x.fy * tens, fc: x.fc && x.fc * tens, densidad: x.density && x.density * peso }));
  return {
    archivo, plantas: m.stories.map((s) => ({ ...s })), materiales, secciones,
    patrones: (m.analisis?.patrones ?? []).map((p) => ({ nombre: p.nombre, tipo: p.tipo, pesoPropio: p.pesoPropio })),
    sismos: (m.analisis?.sismos ?? []).map((s) => ({ nombre: s.nombre, dir: s.dir, coef: s.coef, ecc: s.ecc })),
    nAreas: m.info.nAreas,
  };
}

const N = (v: number | undefined, def = 0): string => {
  const x = v === undefined || !isFinite(v) ? def : v;
  return String(Number(x.toPrecision(7)));
};

export function e2kAHeks(texto: string, nombre = "modelo.e2k"): ResultadoE2kHeks {
  const m = parseE2k(texto, { brazosAuto: true, pesoBarrasAparte: true, losaUnaDireccion: true });
  const inventario = inventarioDe(m, nombre);
  // El peso propio de cada barra ENTERA (antes de partirla), por coordenadas de sus extremos: es lo que ETABS
  // convierte en MASA (la mitad a cada nudo del objeto). Medido en el modelo sintético: repartiéndola por los
  // trozos de la malla, el modo de torsión salía 0.55 % más corto que el de ETABS; así, 0.10 %.
  const ppObjetos = [...(m.pesoBarras ?? new Map())].map(([e, pb]) => {
    const el = (m.elements as unknown as number[][])[e], N0 = m.nodes as unknown as number[][];
    return { w: pb.q * (pb.s1 - pb.s0), a: [...N0[el[0]]], b: [...N0[el[1]]] };
  });
  const cosido = coserModelo(m);
  // las cargas de los patrones SIN el peso propio de barras (para la masa, ver arriba)
  const sinPP = new Map([...(m.cargasPatron ?? new Map())].map(([p, mp]) => [p, new Map([...mp].map(([n, v]) => [n, [...v]]))]));
  // el peso propio de las barras, YA partidas: cada trozo su tramo, vector consistente (fuerzas y momentos)
  if (m.pesoBarras?.size) {
    const pats = (m.analisis?.patrones ?? []).filter((p) => p.pesoPropio > 0);
    if (!pats.length) pats.push({ nombre: "Dead", tipo: "Dead", pesoPropio: 1 });
    const N0 = m.nodes as unknown as number[][];
    for (const [e, pb] of m.pesoBarras) {
      const [i, j] = (m.elements as unknown as number[][])[e];
      const eq = cargaBarraConsistente(N0[i], N0[j], pb.s0, pb.s1, pb.q, pb.q, [0, 0, -1]);
      for (const p of pats) {
        const mp = m.cargasPatron!.get(p.nombre) ?? m.cargasPatron!.set(p.nombre, new Map()).get(p.nombre)!;
        for (const [n, o] of [[i, 0], [j, 6]] as const) {
          const v = mp.get(n) ?? [0, 0, 0, 0, 0, 0];
          for (let k = 0; k < 6; k++) v[k] += eq[o + k] * p.pesoPropio;
          mp.set(n, v);
        }
      }
    }
  }
  // las losas en UNA dirección (Deck, ONEWAYLOADDIST): su carga, ya en las barras partidas, como cargas puntuales con
  // el vector consistente de Hermite (las fórmulas de `deck etabs oneway` del cliModeler). También a la MASA: la fuente
  // por cargas toma Fz/g de los nudos de cada trozo (va a `sinPP`).
  if (m.cargasLosa?.size) {
    const N0 = m.nodes as unknown as number[][];
    for (const [e, lista] of m.cargasLosa) {
      const [i, j] = (m.elements as unknown as number[][])[e];
      const pi = N0[i], pj = N0[j], L = Math.hypot(pj[0] - pi[0], pj[1] - pi[1], pj[2] - pi[2]);
      if (!(L > 1e-9)) continue;
      const tv = [0, 1, 2].map((k) => (pj[k] - pi[k]) / L), txw = [tv[1], -tv[0], 0];   // t × ẑ
      for (const q of lista) {
        const xi = Math.min(1, Math.max(0, q.s / L)), dP = -q.P;
        const F1 = 1 - 3 * xi * xi + 2 * xi ** 3, M1 = L * (xi - 2 * xi * xi + xi ** 3);
        const F3 = 3 * xi * xi - 2 * xi ** 3, M4 = L * (-xi * xi + xi ** 3);
        for (const mp of [m.cargasPatron!.get(q.lc) ?? m.cargasPatron!.set(q.lc, new Map()).get(q.lc)!,
                          sinPP.get(q.lc) ?? sinPP.set(q.lc, new Map()).get(q.lc)!])
          for (const [n, F, M] of [[i, F1, M1], [j, F3, M4]] as const) {
            const v = mp.get(n) ?? [0, 0, 0, 0, 0, 0];
            v[2] += dP * F; v[3] += txw[0] * dP * M; v[4] += txw[1] * dP * M; v[5] += txw[2] * dP * M;
            mp.set(n, v);
          }
      }
    }
  }
  const nodes = m.nodes as unknown as number[][];
  const elements = m.elements as unknown as number[][];
  const ei = m.elementInputs as any;
  const ni = m.nodeInputs as any;
  const an = m.analisis;
  const avisos: string[] = [];
  const L: string[] = [];
  const g = (mp: Map<number, any> | undefined, i: number) => mp?.get?.(i);

  L.push(`# ${nombre} — importado de ETABS (.e2k) por Hekatan Struct`);
  L.push(`# ${nodes.length} nudos · ${elements.filter((e) => e.length === 2).length} barras · ` +
         `${elements.filter((e) => e.length > 2).length} cáscaras · ${m.stories.length} plantas`);
  if (an?.orificios.leidos) L.push(`# orificios: ${an.orificios.recortes} recortados en las losas`);
  if (cosido.nudosFundidos || cosido.barrasPartidas)
    L.push(`# cosido como ETABS: ${cosido.nudosFundidos} nudos fundidos, ${cosido.barrasPartidas} barras partidas en ${cosido.trozosNuevos} trozos`);
  L.push("");

  // ── Cómo se analiza: fuente de masa y sismos por coeficiente ──
  const fm = an?.fuenteMasa;
  // MASA desde las CARGAS (INCLUDELOADS): se calcula aquí, como ETABS — la carga nodal y de área /g en sus nudos y
  // el peso propio de cada barra, mitad y mitad en los nudos del OBJETO —, y va como `mass` explícita.
  const masas = new Map<number, number>();
  if (fm?.cargas) {
    const clave = (p: number[]) => p.map((v) => Math.round(v * 1000)).join("|");
    const idx = new Map((m.nodes as unknown as number[][]).map((p, i) => [clave(p), i]));
    const sumar = (n: number | undefined, mm: number) => { if (n !== undefined && mm) masas.set(n, (masas.get(n) ?? 0) + mm); };
    for (const [p, f] of fm.patrones) {
      for (const [n, v] of sinPP.get(p) ?? []) sumar(n, f * -(v[2] ?? 0) / 9.80665);
      const pp = (an?.patrones ?? []).find((q) => q.nombre === p)?.pesoPropio ?? 0;
      if (pp) for (const o of ppObjetos) { sumar(idx.get(clave(o.a)), f * pp * o.w / 2 / 9.80665); sumar(idx.get(clave(o.b)), f * pp * o.w / 2 / 9.80665); }
    }
  }
  if (fm) {
    L.push(`# fuente de masa de ETABS (MASSSOURCE): elementos ${fm.elementos ? "sí" : "no"}, cargas ${fm.cargas ? "sí (" + fm.patrones.map(([p, f]) => `${p}×${N(f)}`).join(" + ") + ", en las líneas mass)" : "no"}`);
    L.push(`masssource elementos ${fm.elementos ? 1 : 0} lateral ${fm.lateral ? 1 : 0} lump ${fm.lump ? 1 : 0}`);
  }
  if (an?.metodoDirecto?.barras)
    L.push(`# AISC método de análisis directo (ETABS ${[an.metodoDirecto.acero && "acero " + an.metodoDirecto.acero, an.metodoDirecto.compuesto && "compuestas " + an.metodoDirecto.compuesto].filter(Boolean).join(", ")}): EI y EA × 0.8 (τb = 1) en ${an.metodoDirecto.barras} barras, ya en su E`);
  for (const s of an?.sismos ?? []) {
    if (/user coefficient/i.test(s.tipo) && s.coef !== undefined) {
      const zDe = (p?: string) => (p ? m.stories.find((q) => q.name === p)?.elev : undefined);
      const zb = zDe(s.pisoBase), zt = zDe(s.pisoTope);
      L.push(`sismocoef ${s.nombre} ${s.dir} ${N(s.coef)} ${N(s.k ?? 1)} ecc ${N(s.ecc)} signo ${s.signoEcc >= 0 ? "+" : "-"}` +
        (zb !== undefined ? ` zbase ${N(zb)}` : "") + (zt !== undefined ? ` ztope ${N(zt)}` : ""));
    } else {
      avisos.push(`sismo «${s.nombre}» (${s.tipo}): solo se calcula el «User Coefficient»; este patrón entra sin carga`);
    }
  }
  // espectros y casos de espectro de respuesta
  for (const [nom, e] of an?.espectros ?? []) {
    const pares: string[] = [];
    for (let k = 0; k < e.T.length; k++) pares.push(`${N(e.T[k])} ${N(e.Sa[k])}`);
    L.push(`espectro ${nom.replace(/\s+/g, "_")} ${N(e.amort)} ${pares.join(" ")}`);
  }
  for (const c of an?.casosRS ?? [])
    L.push(`casors ${c.nombre.replace(/\s+/g, "_")} ${c.dir} ${c.func.replace(/\s+/g, "_")} ${N(c.sf)} amort ${N(c.amort)} ecc ${N(c.ecc)}${c.combModal ? " modal " + c.combModal : ""}`);
  if (an?.nModos) L.push(`# modos del caso Modal de ETABS: ${an.nModos}`);
  L.push("");

  // ── Nudos ──
  L.push("# nudos: node id x y z");
  nodes.forEach((p, i) => L.push(`node ${i + 1} ${N(p[0])} ${N(p[1])} ${N(p[2])}`));
  L.push("");

  // ── Barras ──
  const barras: number[] = [], cascaras: number[] = [];
  elements.forEach((el, e) => (el.length === 2 ? barras : el.length >= 3 ? cascaras : []).push(e));
  if (barras.length) {
    L.push("# barras: frame id nI nJ E A I22 I33 J nu rho    (6.º token = I22, 7.º = I33)");
    for (const e of barras) {
      const el = elements[e];
      const E = g(ei.elasticities, e) ?? 2e8, G = g(ei.shearModuli, e);
      const nu = g(ei.poissonsRatios, e) ?? (G ? E / (2 * G) - 1 : 0.3);
      L.push(`frame ${e + 1} ${el[0] + 1} ${el[1] + 1} ${N(E)} ${N(g(ei.areas, e))} ${N(g(ei.momentsOfInertiaY, e))} ` +
             `${N(g(ei.momentsOfInertiaZ, e))} ${N(g(ei.torsionalConstants, e))} ${N(nu)} ${N(g(ei.densities, e) ?? 0)}` +
             (m.elementSections?.get?.(e) ? `   # ${m.elementSections.get(e)}` : ""));
    }
    for (const e of barras) {
      const a2 = g(ei.shearAreasZ, e), a3 = g(ei.shearAreasY, e);
      if (a2 !== undefined || a3 !== undefined) L.push(`as ${e + 1} ${N(a2)} ${N(a3)}`);
    }
    for (const e of barras) { const a = g(ei.localAngles, e); if (a) L.push(`ang ${e + 1} ${N(a)}`); }
    for (const e of barras) {
      const r = g(ei.momentReleases, e) as boolean[] | undefined;
      if (r?.some(Boolean)) L.push(`release ${e + 1} ${r.map((b) => (b ? 1 : 0)).join(" ")}`);
    }
    for (const e of barras) {
      const o = g(ei.endOffsets, e) as number[] | undefined;
      if (o && (o[0] > 0 || o[1] > 0)) L.push(`endoffset ${e + 1} ${N(o[0])} ${N(o[1])} ${N(o[2] ?? 0)}`);
    }
    L.push("");
  }

  // ── Cáscaras (las celdas de la malla de cada losa) ──
  if (cascaras.length) {
    L.push("# cáscaras: shell id n1 n2 n3 n4 t E 0 rho   (las cargas de área ya van en los nudos)");
    for (const e of cascaras) {
      const el = elements[e];
      const t = g(ei.thicknesses, e) ?? 0.1, E = g(ei.elasticities, e) ?? 2.5e7, rho = g(ei.densities, e) ?? 0;
      L.push(el.length === 3
        ? `tri ${e + 1} ${el[0] + 1} ${el[1] + 1} ${el[2] + 1} ${N(t)} ${N(E)} 0 ${N(rho)}`
        : `shell ${e + 1} ${el.map((n) => n + 1).join(" ")} ${N(t)} ${N(E)} 0 ${N(rho)}`);
    }
    // formulación por RANGOS de ids seguidos (una losa mallada son cientos de celdas iguales)
    let ini = -1, ant = -1, tipoAnt = "";
    const cerrar = () => { if (ini >= 0) L.push(`shelltype ${ini === ant ? ini : `${ini}-${ant}`} ${tipoAnt}`); };
    for (const e of cascaras) {
      const f = g(ei.plateFormulations, e);
      const tp = f === undefined ? "" : f === 1 ? "thin" : "thick";
      if (tp && tp === tipoAnt && e + 1 === ant + 1) { ant = e + 1; continue; }
      cerrar(); ini = tp ? e + 1 : -1; ant = e + 1; tipoAnt = tp;
    }
    cerrar();
    for (const e of cascaras) {
      const md = g(ei.shellModifiers, e) as number[] | undefined;
      if (md && md.some((v) => v !== 1)) L.push(`shellmod ${e + 1} ${md.slice(0, 8).map((v) => N(v)).join(" ")}`);
    }
    L.push("");
  }

  // ── Apoyos y diafragmas ──
  const sup = ni.supports as Map<number, boolean[]> | undefined;
  if (sup?.size) {
    L.push("# apoyos: support nudo ux uy uz rx ry rz");
    for (const [i, s] of sup) L.push(`support ${i + 1} ${s.map((b) => (b ? 1 : 0)).join(" ")}`);
    L.push("");
  }
  if (m.diafragmas?.size) {
    L.push("# diafragma rígido por planta: diaph grupo G nudos…");
    const porGrupo = new Map<number, number[]>();
    for (const [i, d] of m.diafragmas) (porGrupo.get(d) ?? porGrupo.set(d, []).get(d)!).push(i + 1);
    for (const [d, ns] of porGrupo) for (let k = 0; k < ns.length; k += 40) L.push(`diaph grupo ${d} ${ns.slice(k, k + 40).join(" ")}`);
    L.push("");
  }

  if (masas.size) {
    L.push("# masa de la fuente (t): mass nudo m");
    for (const [i, mm] of masas) L.push(`mass ${i + 1} ${N(mm)}`);
    L.push("");
  }
  // ── Cargas por patrón (kN, kN·m) ──
  const pats = m.cargasPatron ?? new Map<string, Map<number, number[]>>();
  for (const p of an?.patrones ?? []) if (!pats.has(p.nombre)) pats.set(p.nombre, new Map());
  const nocionales = new Map((an?.patrones ?? []).filter((p) => p.nocional).map((p) => [p.nombre, p.nocional!]));
  for (const [nom, nc] of nocionales) L.push(`nocional ${nom.replace(/\s+/g, "_")} ${nc.base.replace(/\s+/g, "_")} ${N(nc.factor)} ${nc.dir}`);
  for (const [pat, mp] of pats) {
    if (nocionales.has(pat)) continue;      // las calcula `nocional` al resolver
    const nom = pat.replace(/\s+/g, "_");
    L.push(`# patrón ${nom}`);
    for (const [i, v] of mp) {
      if (v.every((x) => Math.abs(x) < 1e-12)) continue;
      L.push(`load ${i + 1} ${v.map((x) => N(x)).join(" ")} ${nom}`);
    }
  }
  L.push("");
  // combinaciones lineales de patrones (las que solo nombran patrones)
  const combos = new Map<string, Array<[string, number]>>();
  for (const raw of m.rawSections?.get("LOAD COMBINATIONS") ?? []) {
    const c = raw.trim().match(/^COMBO\s+"([^"]+)"\s+LOADCASE\s+"([^"]+)"\s+SF\s+([-\d.eE+]+)/);
    if (c) (combos.get(c[1]) ?? combos.set(c[1], []).get(c[1])!).push([c[2], parseFloat(c[3])]);
  }
  const conocidos = new Set([...pats.keys()]);
  inventario.combos = [...combos].map(([nombre, items]) => ({ nombre, items }));
  for (const [nom, items] of combos) {
    if (!items.every(([p]) => conocidos.has(p))) continue;
    L.push(`combo ${nom.replace(/\s+/g, "_")} ${items.map(([p, f]) => `${p.replace(/\s+/g, "_")} ${N(f)}`).join(" ")}`);
  }
  // abre mostrando el asiento del caso Dead (el patrón de peso propio)
  const muerto = (an?.patrones ?? []).find((p) => p.pesoPropio > 0)?.nombre ?? "Dead";
  L.push(`vista displacementZ ${muerto.replace(/\s+/g, "_")}`);
  L.push("solve");
  if (avisos.length) L.splice(2, 0, ...avisos.map((a) => `# ⚠️ ${a}`));
  return { heks: L.join("\n") + "\n", modelo: m, cosido, avisos, inventario };
}
