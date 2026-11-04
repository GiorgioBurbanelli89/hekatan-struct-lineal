/**
 * Export e2k de un modelo IMPORTADO y luego EDITADO en Struct (4-nov-2026).
 *
 * Antes: `exportE2k` con `e2kModel` re-emitia el texto crudo y descartaba cualquier edicion. Sin `e2kModel`
 * reconstruia desde nudos y barras y perdia combinaciones, casos de espectro, materiales con nombre, etc.
 *
 * Ahora: al importar (`parseE2k`) se toma una FOTO (`model.base`: nudos, elementos, cargas, apoyos, seccion).
 * Al exportar se compara el modelo actual con la foto y las diferencias se APLICAN SOBRE EL TEXTO CRUDO, seccion a
 * seccion: lo que no se tocó sale tal cual (combos, casos, espectros, materiales, DECK, malla, MAXSTASPC...).
 *
 * Ediciones que se parchean:  barra/area BORRADA, barra AÑADIDA (entre nudos existentes o nuevos), nudo MOVIDO,
 *   nudo AÑADIDO/BORRADO, seccion de barra CAMBIADA, carga nodal CAMBIADA (delta), apoyo cambiado.
 * Limites (salen en `avisos`, no se aplican): areas nuevas, barras partidas (`C1-2`), nudos `np@`/de malla,
 *   cambio de material o de propiedades que no sean A/I/J, cargas en nudos tocados por otra edicion (las
 *   recalcula ETABS: peso propio, AREALOAD), barras añadidas sin liberaciones/modificadores/offsets.
 */
import type { E2kModel } from "./e2kParser";

export interface BaseE2k {
  nodes: number[][];
  elements: number[][];
  loads: Map<number, number[]>;
  supports: Map<number, boolean[]>;
  /** clave de seccion por elemento (E|A|Iz|Iy|J o t=espesor). */
  secClave: string[];
}

const r6 = (v: number | undefined) => (v === undefined || !isFinite(v)) ? "0" : Number(v.toPrecision(7)).toString();

export function claveSeccion(m: E2kModel | { elementInputs: any }, i: number, nElem: number[]): string {
  const ei: any = (m as any).elementInputs;
  if (nElem.length >= 3) return `t=${r6(ei.thicknesses?.get(i))}`;
  return [ei.elasticities?.get(i), ei.areas?.get(i), ei.momentsOfInertiaZ?.get(i), ei.momentsOfInertiaY?.get(i),
          ei.torsionalConstants?.get(i)].map(r6).join("|");
}

/** Foto del modelo recien importado (copias, para que editar los arrays vivos no la toque). */
export function tomarBase(m: E2kModel): BaseE2k {
  return {
    nodes: m.nodes.map((n) => [n[0], n[1], n[2]]),
    elements: m.elements.map((e) => [...e]),
    loads: new Map([...m.nodeInputs.loads].map(([k, v]) => [k, [...v]] as [number, number[]])),
    supports: new Map([...m.nodeInputs.supports].map(([k, v]) => [k, [...v]] as [number, boolean[]])),
    secClave: m.elements.map((e, i) => claveSeccion(m, i, e)),
  };
}

const FL: Record<string, number> = { MM: 1e-3, CM: 1e-2, M: 1, IN: 0.0254, FT: 0.3048 };
const FF: Record<string, number> = { N: 1e-3, KN: 1, KGF: 9.80665e-3, TONF: 9.80665, LB: 4.44822e-3, KIP: 4.44822 };
const RES = ["UX", "UY", "UZ", "RX", "RY", "RZ"];
const q = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const num = (v: number) => Number(v.toPrecision(10)).toString();

export interface EntradaParche {
  nodes: number[][];
  elements: number[][];
  nodeInputs: any;
  elementInputs: any;
  avisos?: string[];
}

/**
 * Devuelve las secciones crudas ya parcheadas, o null si no hay foto (modelo viejo) — el llamador cae al camino de siempre.
 * `cambios` cuenta lo aplicado (0 = modelo sin tocar → salida identica al crudo).
 */
export function parchearSecciones(input: EntradaParche, model: E2kModel): { raw: Map<string, string[]>; cambios: number } | null {
  const base = model.base;
  if (!base) return null;
  const avisos = input.avisos ?? [];
  const L = FL[(model.units.length || "M").toUpperCase()] ?? 1;
  const F = FF[(model.units.force || "KN").toUpperCase()] ?? 1;
  const cur = input.nodes, els = input.elements;

  // ── 1. nudos actuales → nudos de la foto ───────────────────────────
  const kk = (n: number[]) => `${Math.round(n[0] * 1e6)},${Math.round(n[1] * 1e6)},${Math.round(n[2] * 1e6)}`;
  const porClave = new Map<string, number[]>();
  base.nodes.forEach((n, i) => { const k = kk(n); (porClave.get(k) ?? porClave.set(k, []).get(k)!).push(i); });
  const aBase = new Array<number>(cur.length).fill(-1);
  const baseUsado = new Set<number>();
  for (let i = 0; i < cur.length; i++) {
    const l = porClave.get(kk(cur[i]));
    const b = l?.find((x) => !baseUsado.has(x));
    if (b !== undefined) { aBase[i] = b; baseUsado.add(b); }
  }
  // movidos en el sitio: mismo indice, sin pareja por posicion (solo si el array no se compacto: no hay nudos borrados)
  const movidos: Array<[number, number]> = [];
  if (cur.length >= base.nodes.length)
    for (let i = 0; i < base.nodes.length; i++) if (aBase[i] < 0 && !baseUsado.has(i)) { aBase[i] = i; baseUsado.add(i); movidos.push([i, i]); }
  const nuevosNudos = cur.map((_, i) => i).filter((i) => aBase[i] < 0);
  const nudosBorrados = base.nodes.map((_, i) => i).filter((i) => !baseUsado.has(i));

  // ── 2. elementos ───────────────────────────────────────────────
  const idNudo = (i: number) => aBase[i] >= 0 ? `b${aBase[i]}` : `n${i}`;
  const sigEl = (e: number[]) => e.map(idNudo).sort().join(",");
  const sigBase = (e: number[]) => e.map((i) => `b${i}`).sort().join(",");
  const baseEl = new Map<string, number[]>();
  base.elements.forEach((e, i) => { const k = sigBase(e); (baseEl.get(k) ?? baseEl.set(k, []).get(k)!).push(i); });
  const elABase = new Array<number>(els.length).fill(-1);
  const elBaseUsado = new Set<number>();
  els.forEach((e, i) => {
    const b = baseEl.get(sigEl(e))?.find((x) => !elBaseUsado.has(x));
    if (b !== undefined) { elABase[i] = b; elBaseUsado.add(b); }
  });
  const elBorrados = base.elements.map((_, i) => i).filter((i) => !elBaseUsado.has(i));
  const elNuevos = els.map((_, i) => i).filter((i) => elABase[i] < 0);
  const elCambioSec = els.map((_, i) => i).filter((i) => elABase[i] >= 0 &&
    claveSeccion({ elementInputs: input.elementInputs }, i, els[i]) !== base.secClave[elABase[i]]);

  // Sin ediciones → crudo tal cual.
  const sinTocar = !movidos.length && !nuevosNudos.length && !nudosBorrados.length && !elBorrados.length && !elNuevos.length && !elCambioSec.length;
  const raw = new Map<string, string[]>();
  for (const [k, v] of model.rawSections ?? []) raw.set(k, [...v]);
  let cambios = 0;
  const sec = (n: string) => raw.get(n) ?? (raw.set(n, []), raw.get(n)!);
  const quitar = (n: string, re: RegExp) => { const s = raw.get(n); if (!s) return 0; const antes = s.length; raw.set(n, s.filter((l) => !re.test(l))); return antes - raw.get(n)!.length; };
  const tiene = (n: string, re: RegExp) => (raw.get(n) ?? []).some((l) => re.test(l));

  // ── nudos tocados por una edicion de elemento (sus cargas las recalcula ETABS) ──
  const tocado = new Set<number>();   // ids de foto
  for (const b of elBorrados) base.elements[b].forEach((i) => tocado.add(i));
  const tocadoNuevo = new Set<number>();
  for (const e of elNuevos) els[e].forEach((i) => aBase[i] >= 0 ? tocado.add(aBase[i]) : tocadoNuevo.add(i));

  const nombreNodo = (b: number): [string, string] | null => {
    const nm = model.nodeNames[b]; if (!nm || nm.startsWith("np@")) return null;
    const j = nm.lastIndexOf("@"); return j < 0 ? null : [nm.slice(0, j), nm.slice(j + 1)];
  };
  if (sinTocar && !hayCambioCargaApoyo()) return { raw, cambios: 0 };

  // ── puntos y plantas ────────────────────────────────────
  const plantas = model.stories;                      // de abajo arriba, elev en m
  const puntosExistentes = new Set<string>();
  for (const l of raw.get("POINT COORDINATES") ?? []) { const m = l.match(/POINT\s+"([^"]+)"/); if (m) puntosExistentes.add(m[1]); }
  let contPunto = 0, contLinea = 0;
  const nuevoPunto = () => { let n: string; do { n = `HS${++contPunto}`; } while (puntosExistentes.has(n)); puntosExistentes.add(n); return n; };
  const lineasExistentes = new Set<string>();
  for (const l of raw.get("LINE CONNECTIVITIES") ?? []) { const m = l.match(/LINE\s+"([^"]+)"/); if (m) lineasExistentes.add(m[1]); }
  const nuevaLinea = () => { let n: string; do { n = `HE${++contLinea}`; } while (lineasExistentes.has(n)); lineasExistentes.add(n); return n; };

  /** (punto, planta) de un nudo actual — existente o recien creado. */
  const nombreActual = new Map<number, [string, string]>();
  function nombrar(i: number): [string, string] | null {
    if (nombreActual.has(i)) return nombreActual.get(i)!;
    if (aBase[i] >= 0) { const r = nombreNodo(aBase[i]); if (r) nombreActual.set(i, r); return r; }
    return null;
  }

  // ── movidos ────────────────────────────────────────────
  for (const [i, b] of movidos) {
    const nn = nombreNodo(b); if (!nn) { avisos.push(`nudo ${i} movido pero es de malla/np: no aplicado`); continue; }
    const [pt, st] = nn;
    const comparten = model.nodeNames.filter((x) => x.startsWith(pt + "@")).length;
    if (comparten > 1) { avisos.push(`nudo ${i} (punto ${pt}) esta en ${comparten} plantas: movido no aplicado`); continue; }
    const pl = plantas.find((s) => s.name === st); if (!pl) continue;
    const reP = new RegExp(`^(\\s*POINT\\s+"${q(pt)}"\\s+)`);
    const s = sec("POINT COORDINATES"); const k = s.findIndex((l) => reP.test(l));
    if (k < 0) continue;
    const drop = (pl.elev - cur[i][2]) / L;
    s[k] = s[k].match(reP)![1] + `${num(cur[i][0] / L)} ${num(cur[i][1] / L)}` + (Math.abs(drop) > 1e-9 ? ` ${num(drop)}` : " ");
    nombreActual.set(i, [pt, st]); cambios++;
  }

  // ── borrar elementos ───────────────────────────────────────
  const nombresLinea = new Set((raw.get("LINE CONNECTIVITIES") ?? []).map((l) => l.match(/LINE\s+"([^"]+)"/)?.[1]).filter(Boolean) as string[]);
  const nombresArea = new Set((raw.get("AREA CONNECTIVITIES") ?? []).map((l) => l.match(/AREA\s+"([^"]+)"/)?.[1]).filter(Boolean) as string[]);
  for (const b of elBorrados) {
    const nm = model.elementNames[b], st = model.elementStories[b];
    const esArea = base.elements[b].length >= 3;
    if (esArea) {
      if (!nombresArea.has(nm)) { avisos.push(`area ${nm} no esta en el fichero (malla): borrado no aplicado`); continue; }
      cambios += quitar("AREA ASSIGNS", new RegExp(`^\\s*AREAASSIGN\\s+"${q(nm)}"\\s+"${q(st)}"`));
      quitar("SHELL OBJECT LOADS", new RegExp(`^\\s*AREALOAD\\s+"${q(nm)}"\\s+"${q(st)}"`));
      if (!tiene("AREA ASSIGNS", new RegExp(`^\\s*AREAASSIGN\\s+"${q(nm)}"\\s`))) quitar("AREA CONNECTIVITIES", new RegExp(`^\\s*AREA\\s+"${q(nm)}"\\s`));
    } else {
      if (!nombresLinea.has(nm)) { avisos.push(`barra ${nm} es un tramo partido: borrado no aplicado`); continue; }
      const sib = model.elementNames.some((x, j) => j !== b && x.startsWith(nm + "-") && model.elementStories[j] === st);
      if (sib) { avisos.push(`barra ${nm} tiene tramos hermanos: borrado no aplicado`); continue; }
      cambios += quitar("LINE ASSIGNS", new RegExp(`^\\s*LINEASSIGN\\s+"${q(nm)}"\\s+"${q(st)}"`));
      quitar("FRAME OBJECT LOADS", new RegExp(`^\\s*LINELOAD\\s+"${q(nm)}"\\s+"${q(st)}"`));
      if (!tiene("LINE ASSIGNS", new RegExp(`^\\s*LINEASSIGN\\s+"${q(nm)}"\\s`))) quitar("LINE CONNECTIVITIES", new RegExp(`^\\s*LINE\\s+"${q(nm)}"\\s`));
    }
  }

  // ── cambios de seccion ─────────────────────────────────────
  const nombreSeccionDe = new Map<string, string>();   // clave → nombre (de la foto)
  base.elements.forEach((e, i) => { if (e.length === 2) { const s = model.elementSections.get(i); if (s && !nombreSeccionDe.has(base.secClave[i])) nombreSeccionDe.set(base.secClave[i], s); } });
  let contSec = 0;
  const seccionesNuevas = new Map<string, string>();
  function seccionPara(i: number, cercano?: number): string {
    const clave = claveSeccion({ elementInputs: input.elementInputs }, i, els[i]);
    const ya = nombreSeccionDe.get(clave) ?? seccionesNuevas.get(clave);
    if (ya) return ya;
    const ei = input.elementInputs;
    const nombre = `HS_SEC${++contSec}`;
    const matRef = cercano !== undefined ? model.elementSections.get(cercano) : [...model.elementSections.values()][0];
    const mat = (matRef && model.frameSections.get(matRef)?.material) || [...model.frameSections.values()][0]?.material || "STEEL";
    const A = ei.areas?.get(i) ?? 0, As2 = ei.shearAreasY?.get(i) ?? A * 0.833, As3 = ei.shearAreasZ?.get(i) ?? A * 0.833;
    const I33 = ei.momentsOfInertiaZ?.get(i) ?? 0, I22 = ei.momentsOfInertiaY?.get(i) ?? 0, J = ei.torsionalConstants?.get(i) ?? 0;
    sec("FRAME SECTIONS").push(`  FRAMESECTION  "${nombre}"  MATERIAL "${mat}"  SHAPE "General"  AREA ${num(A / (L * L))} AS2 ${num(As2 / (L * L))} AS3 ${num(As3 / (L * L))} I33 ${num(I33 / L ** 4)} I22 ${num(I22 / L ** 4)} TORSION ${num(J / L ** 4)} `);
    seccionesNuevas.set(clave, nombre); cambios++;
    return nombre;
  }
  for (const i of elCambioSec) {
    const b = elABase[i], nm = model.elementNames[b], st = model.elementStories[b];
    if (els[i].length >= 3) { avisos.push(`espesor de ${nm} cambiado: no aplicado`); continue; }
    if (!nombresLinea.has(nm)) { avisos.push(`seccion de ${nm} (tramo partido): no aplicada`); continue; }
    const s = seccionPara(i, b);
    const re = new RegExp(`^(\\s*LINEASSIGN\\s+"${q(nm)}"\\s+"${q(st)}".*?SECTION\\s+")[^"]*(")`);
    const arr = sec("LINE ASSIGNS"); const k = arr.findIndex((l) => re.test(l));
    if (k >= 0) { arr[k] = arr[k].replace(re, `$1${s}$2`); cambios++; }
  }

  // ── nudos nuevos: punto + planta ───────────────────────────────
  for (const i of nuevosNudos) {
    if (!plantas.length) break;
    const z = cur[i][2];
    // la planta mas baja que esta a z o por encima; el resto cuelga con caida
    let pl = plantas.find((s) => s.elev >= z - 1e-6) ?? plantas[plantas.length - 1];
    const nm = nuevoPunto();
    const drop = (pl.elev - z) / L;
    sec("POINT COORDINATES").push(`  POINT "${nm}"  ${num(cur[i][0] / L)} ${num(cur[i][1] / L)}` + (Math.abs(drop) > 1e-9 ? ` ${num(drop)}` : " "));
    nombreActual.set(i, [nm, pl.name]); cambios++;
  }

  // ── elementos nuevos ───────────────────────────────────
  const idxPlanta = (n: string) => plantas.findIndex((s) => s.name === n);
  for (const e of elNuevos) {
    if (els[e].length >= 3) { avisos.push(`area nueva (elemento ${e}): no aplicada (falta propiedad de area)`); continue; }
    const a = nombrar(els[e][0]), b = nombrar(els[e][1]);
    if (!a || !b) { avisos.push(`barra nueva ${e}: un extremo es nudo de malla/np: no aplicada`); continue; }
    let [p1, s1] = a, [p2, s2] = b;
    let i1 = idxPlanta(s1), i2 = idxPlanta(s2);
    if (i1 < 0 || i2 < 0) continue;
    if (i1 > i2) { [p1, p2] = [p2, p1]; [s1, s2] = [s2, s1]; [i1, i2] = [i2, i1]; }   // pt1 = el de abajo
    const nSt = i2 - i1;
    const xy1 = cur[els[e][0]], xy2 = cur[els[e][1]];
    const vertical = Math.hypot(xy1[0] - xy2[0], xy1[1] - xy2[1]) < 1e-6;
    const tipo = nSt === 0 ? "BEAM" : vertical ? "COLUMN" : "BRACE";
    const nm = nuevaLinea();
    const sName = seccionPara(e);
    sec("LINE CONNECTIVITIES").push(`  LINE  "${nm}"  ${tipo}  "${p1}"  "${p2}"  ${nSt}`);
    sec("LINE ASSIGNS").push(`  LINEASSIGN  "${nm}"  "${s2}"  SECTION "${sName}"  ` +
      (tipo === "COLUMN" ? `MINNUMSTA 3 ` : `MAXSTASPC 500 `) + `AUTOMESH "YES"  MESHATINTERSECTIONS "YES"  `);
    cambios++;
  }

  // ── nudos borrados ──────────────────────────────────────
  for (const b of nudosBorrados) {
    const nn = nombreNodo(b); if (!nn) continue;
    const [pt, st] = nn;
    quitar("POINT ASSIGNS", new RegExp(`^\\s*POINTASSIGN\\s+"${q(pt)}"\\s+"${q(st)}"`));
    quitar("POINT OBJECT LOADS", new RegExp(`^\\s*POINTLOAD\\s+"${q(pt)}"\\s+"${q(st)}"`));
    const otros = model.nodeNames.some((x, j) => j !== b && x.startsWith(pt + "@") && baseUsado.has(j));
    if (!otros) quitar("POINT COORDINATES", new RegExp(`^\\s*POINT\\s+"${q(pt)}"\\s`));
    cambios++;
  }

  // ── cargas nodales (delta) y apoyos ───────────────────────────
  const patrones = (raw.get("LOAD PATTERNS") ?? []).map((l) => l.match(/LOADPATTERN\s+"([^"]+)"/)?.[1]).filter(Boolean) as string[];
  const patron = patrones.includes("Dead") ? "Dead" : patrones[0] ?? "Dead";
  const comp = ["FX", "FY", "FZ", "MX", "MY", "MZ"];
  const curLoads: Map<number, number[]> = input.nodeInputs.loads, curSup: Map<number, boolean[]> = input.nodeInputs.supports;
  for (let i = 0; i < cur.length; i++) {
    const b = aBase[i];
    const nn = nombrar(i); if (!nn) continue;
    const [pt, st] = nn;
    // cargas
    const c = curLoads?.get(i) ?? [0, 0, 0, 0, 0, 0];
    const c0 = b >= 0 ? (base.loads.get(b) ?? [0, 0, 0, 0, 0, 0]) : [0, 0, 0, 0, 0, 0];
    const d = c.map((v, k) => v - (c0[k] ?? 0));
    if (d.some((v) => Math.abs(v) > 1e-9)) {
      if ((b >= 0 && tocado.has(b)) || tocadoNuevo.has(i)) avisos.push(`carga del nudo ${i} (tocado por otra edicion): no aplicada`);
      else {
        const vals = d.map((v, k) => k < 3 ? v / F : v / (F * L));
        const txt = comp.map((n, k) => Math.abs(d[k]) > 1e-9 ? `${n} ${num(vals[k])}` : "").filter(Boolean).join(" ");
        sec("POINT OBJECT LOADS").push(`  POINTLOAD  "${pt}"  "${st}"  TYPE "FORCE"  LC "${patron}"  ${txt}`); cambios++;
      }
    }
    // apoyos
    const sBase = b >= 0 ? base.supports.get(b) : undefined, sCur = curSup?.get(i);
    const str = (s?: boolean[]) => s ? RES.filter((_, k) => s[k]).join(" ") : "";
    if (str(sBase) !== str(sCur)) {
      const reA = new RegExp(`^(\\s*POINTASSIGN\\s+"${q(pt)}"\\s+"${q(st)}")(.*)$`);
      const arr = sec("POINT ASSIGNS"); const k = arr.findIndex((l) => reA.test(l));
      const nuevo = str(sCur);
      if (k >= 0) {
        let resto = arr[k].match(reA)![2].replace(/\s+RESTRAINT\s+"[^"]*"/, "");
        if (nuevo) resto += `  RESTRAINT "${nuevo}"`;
        if (!nuevo && !resto.trim()) arr.splice(k, 1); else arr[k] = arr[k].match(reA)![1] + "  " + resto.trim() + "  ";
      } else if (nuevo) arr.push(`  POINTASSIGN  "${pt}"  "${st}"  RESTRAINT "${nuevo}"  `);
      cambios++;
    }
  }
  return { raw, cambios };

  function hayCambioCargaApoyo(): boolean {
    for (let i = 0; i < cur.length; i++) {
      const b = aBase[i]; if (b < 0) continue;
      const c = input.nodeInputs.loads?.get(i) ?? [], c0 = base.loads.get(b) ?? [];
      for (let k = 0; k < 6; k++) if (Math.abs((c[k] ?? 0) - (c0[k] ?? 0)) > 1e-9) return true;
      const a = (input.nodeInputs.supports?.get(i) ?? []).map(Boolean).join(), a0 = (base.supports.get(b) ?? []).map(Boolean).join();
      if (a !== a0) return true;
    }
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════
// Camino 2 con datos preservados: toma del e2k importado lo que el modelo reconstruido no puede saber.
// ═══════════════════════════════════════════════════════════════════

/** Secciones del e2k leido que se guardan en el modelo (elementInputs.e2kPreservado) para exportar sin perderlas. */
export const SECCIONES_PRESERVADAS = [
  "MATERIAL PROPERTIES", "REBAR DEFINITIONS", "FRAME SECTIONS", "CONCRETE SECTIONS", "SLAB PROPERTIES", "DECK PROPERTIES",
  "WALL PROPERTIES", "WALL/SLAB/DECK SECTIONS", "DIAPHRAGM NAMES", "FUNCTIONS", "LOAD CASES", "LOAD COMBINATIONS",
  "MASS SOURCE", "ANALYSIS OPTIONS", "LOAD PATTERNS",
];

export function resumenPreservado(raw: Map<string, string[]> | undefined, units?: { force: string; length: string }): Record<string, string[]> | undefined {
  if (!raw) return undefined;
  const o: Record<string, string[]> = {};
  if (units) o["__UNITS"] = [`${units.force.toUpperCase()}|${units.length.toUpperCase()}`];
  for (const s of SECCIONES_PRESERVADAS) { const l = raw.get(s); if (l && l.length) o[s] = [...l]; }
  return Object.keys(o).length ? o : undefined;
}

const nombreDe = (l: string) => l.match(/^\s*(?:MATERIAL|FRAMESECTION|SHELLPROP|DIAPHRAGM|REBARDEFINITION|CONCRETESECTION|COMBO|FUNCTION|LOADCASE|MASSSOURCE(?:LOAD)?|LOADPATTERN)\s+"([^"]+)"/)?.[1];

/**
 * Inyecta en un e2k reconstruido (texto) lo preservado:
 *  - FUNCTIONS, LOAD CASES, LOAD COMBINATIONS, MASS SOURCE: los del fichero REEMPLAZAN a los genericos.
 *  - MATERIAL / FRAME SECTIONS / propiedades de area / DIAPHRAGM: los del fichero ganan por nombre; los
 *    reconstruidos con otro nombre se conservan (sin uso no estorban).
 *  - ANALYSIS OPTIONS: se añade AUTOMESHOPTIONS si el reconstruido no lo trae.
 */
export function inyectarPreservado(texto: string, pres: Record<string, string[]>): string {
  // El exportador reconstruido escribe SIEMPRE N y mm; lo preservado va en las unidades del fichero leido.
  // Si no son N/MM solo se inyecta lo que no lleva unidades (diafragma, fuente de masa).
  const enNmm = pres["__UNITS"]?.[0] === "N|MM";
  const nl = texto.includes("\r\n") ? "\r\n" : "\n";
  const lines = texto.split(/\r?\n/);
  const rango = (s: string): [number, number] => {
    const i = lines.findIndex((l) => l.trim() === `$ ${s}`);
    if (i < 0) return [-1, -1];
    let j = i + 1; while (j < lines.length && !/^\$ /.test(lines[j]) && lines[j].trim() !== "END") j++;
    return [i, j];
  };
  const insertarSeccion = (s: string, cuerpo: string[]) => {
    const e = lines.findIndex((l) => l.trim() === "END");
    lines.splice(e >= 0 ? e : lines.length, 0, `$ ${s}`, ...cuerpo, ``);
  };
  for (const s of ["FUNCTIONS", "LOAD CASES", "LOAD COMBINATIONS", "MASS SOURCE"]) {
    const cuerpo = pres[s]; if (!cuerpo?.length) continue;
    if (!enNmm && s !== "MASS SOURCE") continue;
    const [i, j] = rango(s);
    if (i < 0) insertarSeccion(s, cuerpo); else lines.splice(i + 1, j - i - 1, ...cuerpo, ``);
  }
  for (const s of ["MATERIAL PROPERTIES", "REBAR DEFINITIONS", "FRAME SECTIONS", "CONCRETE SECTIONS", "SLAB PROPERTIES", "DECK PROPERTIES",
                   "WALL PROPERTIES", "WALL/SLAB/DECK SECTIONS", "DIAPHRAGM NAMES"]) {
    const cuerpo = pres[s]; if (!cuerpo?.length) continue;
    if (!enNmm && s !== "DIAPHRAGM NAMES") continue;
    const [i, j] = rango(s);
    if (i < 0) { insertarSeccion(s, cuerpo); continue; }
    const propios = new Set(cuerpo.map(nombreDe).filter(Boolean) as string[]);
    const quedan = lines.slice(i + 1, j).filter((l) => l.trim() && !propios.has(nombreDe(l) ?? "\u0000"));
    lines.splice(i + 1, j - i - 1, ...quedan, ...cuerpo, ``);
  }
  const ao = !enNmm ? undefined : pres["ANALYSIS OPTIONS"]?.filter((l) => /AUTOMESHOPTIONS/.test(l));
  if (ao?.length) {
    const [i, j] = rango("ANALYSIS OPTIONS");
    if (i < 0) insertarSeccion("ANALYSIS OPTIONS", ao);
    else if (!lines.slice(i, j).some((l) => /AUTOMESHOPTIONS/.test(l))) lines.splice(j, 0, ...ao);
  }
  return lines.join(nl);
}
