/**
 * 🧵 COSER un modelo importado de ETABS.
 *
 * Un `.e2k` no describe la malla que ETABS resuelve: describe los OBJETOS que
 * dibujó el proyectista. ETABS malla al analizar, y lo dice en cada línea del
 * fichero:
 *
 *     LINEASSIGN "B55" "N+3.65m" SECTION "VS 300X100X4X6"
 *                AUTOMESH "YES"  MESHATINTERSECTIONS "YES"
 *
 * Leerlo literalmente da un modelo que **se ve entero y no resuelve**: las
 * vigas secundarias nacen y mueren en puntos que no comparte nadie, quedan
 * trozos sueltos y la matriz sale singular. Medido en un edificio real de 786
 * nudos y 746 barras: **125 trozos y 371 nudos no llegaban a ningún apoyo**, y
 * la causa no era ni el solver ni las secciones — era esto.
 *
 * Aquí se hacen los dos pasos que ETABS hace y el lector no hacía:
 *
 *   1. **Fundir nudos coincidentes.** Dos joints en el mismo punto son UN
 *      nudo. En ese modelo había 114 duplicados.
 *   2. **Partir cada barra por los nudos que caen encima** — eso es
 *      `MESHATINTERSECTIONS`. Había 486 nudos posados sobre 167 barras sin ser
 *      sus extremos: cada uno es una unión que ETABS hace y aquí no existía.
 *
 * ⚠️ **Los releases no se copian a todos los trozos.** Una viga con `M3I M3J`
 * partida en cuatro no son cuatro vigas biarticuladas — eso serían tres
 * rótulas internas de más, o sea un mecanismo. El release de la cara I va SOLO
 * en el primer trozo y el de la cara J SOLO en el último.
 *
 *   3. **Crear el nudo donde dos barras se cruzan sin haberlo.** Esto no es
 *      una suposición: es literalmente lo que pide la línea del fichero. Solo
 *      se hace entre barras que traen las DOS `MESHATINTERSECTIONS "YES"` y
 *      que de verdad **se tocan en el espacio** (distancia mínima entre los dos
 *      segmentos menor que la tolerancia). Una viga que pasa POR ENCIMA de otra
 *      tiene esa distancia grande y se deja en paz.
 */
import type { E2kModel } from "./e2kParser";

/** Tolerancia para «el mismo punto», en metros. ETABS usa 1 mm por defecto. */
export const TOL_FUSION = 1e-3;

export interface InformeCosido {
  nudosFundidos: number;
  /** Nudos creados en un cruce de barras que no tenía ninguno. */
  nudosDeCruce: number;
  barrasPartidas: number;
  trozosNuevos: number;
  /** Cruces que se dejaron sin tocar (distinta cota, o sin el flag). */
  crucesSinNudo: number;
  /** Nudos de cruce que acabaron unidos a MENOS de dos elementos: mecanismo. */
  crucesColgados: number;
  piezasFlotantesAntes: number;
  piezasFlotantesDespues: number;
}

/** Remapea un `Map` con clave de índice, por una tabla vieja→nueva. */
function remapear<T>(m: unknown, tabla: Map<number, number>): unknown {
  if (!(m instanceof Map)) return m;
  const out = new Map<number, T>();
  for (const [k, v] of m as Map<number, T>) {
    const j = tabla.get(k);
    if (j !== undefined && !out.has(j)) out.set(j, v);
  }
  return out;
}

/** Cuántas componentes conexas no tocan ningún apoyo. */
function flotantes(elements: number[][], supports?: Map<number, unknown>): number {
  const ady = new Map<number, number[]>();
  for (const el of elements)
    for (const a of el) for (const b of el)
      if (a !== b) { if (!ady.has(a)) ady.set(a, []); ady.get(a)!.push(b); }
  const usado = new Set<number>();
  for (const el of elements) for (const n of el) usado.add(n);
  const apoyo = new Set<number>([...(supports ?? new Map())].map(([k]) => k));
  const visto = new Set<number>();
  let n = 0;
  for (const s of usado) {
    if (visto.has(s)) continue;
    const pila = [s], c: number[] = [];
    visto.add(s);
    while (pila.length) {
      const v = pila.pop()!;
      c.push(v);
      for (const w of ady.get(v) ?? []) if (!visto.has(w)) { visto.add(w); pila.push(w); }
    }
    if (!c.some((x) => apoyo.has(x))) n++;
  }
  return n;
}

/**
 * Cose el modelo: funde nudos coincidentes y parte las barras por los nudos
 * que caen encima. Modifica el modelo y devuelve el informe.
 */
export interface OpcionesCosido {
  /**
   * No crear los nudos de cruce (`MESHATINTERSECTIONS`).
   *
   * Es para BISECAR, no para calcular: un nudo de cruce necesita las DOS barras
   * que lo cruzan, asi que en un subconjunto donde solo esta una queda colgando
   * y la biseccion acusa a esa barra de un mecanismo que ha creado la propia
   * biseccion. Con esto el subconjunto es honrado.
   */
  sinCruces?: boolean;
}

export function coserModelo(m: E2kModel, tol = TOL_FUSION,
                            opciones: OpcionesCosido = {}): InformeCosido {
  const inf: InformeCosido = {
    nudosFundidos: 0, nudosDeCruce: 0, barrasPartidas: 0, trozosNuevos: 0,
    crucesSinNudo: 0, crucesColgados: 0,
    piezasFlotantesAntes: flotantes(
      m.elements as unknown as number[][], (m.nodeInputs as any).supports),
    piezasFlotantesDespues: 0,
  };

  // ── 1) fundir nudos coincidentes ─────────────────────────────────────────
  // La clave se redondea a la rejilla de la tolerancia. Ojo con los empates:
  // se redondea ANTES de formatear, no se formatea y luego se compara texto.
  {
    const paso = Math.max(tol, 1e-9);
    const primero = new Map<string, number>();
    const tabla = new Map<number, number>();
    const nuevos: number[][] = [];
    (m.nodes as unknown as number[][]).forEach((n, i) => {
      const k = `${Math.round(n[0] / paso)}|${Math.round(n[1] / paso)}|${Math.round(n[2] / paso)}`;
      const ya = primero.get(k);
      if (ya !== undefined) { tabla.set(i, ya); inf.nudosFundidos++; return; }
      primero.set(k, nuevos.length);
      tabla.set(i, nuevos.length);
      nuevos.push(n);
    });
    if (inf.nudosFundidos) {
      const nombresViejos = m.nodeNames;
      m.nodes = nuevos as unknown as typeof m.nodes;
      m.elements = (m.elements as unknown as number[][]).map(
        (el) => el.map((i) => tabla.get(i)!)) as unknown as typeof m.elements;
      const ni = m.nodeInputs as unknown as Record<string, unknown>;
      for (const k of Object.keys(ni)) ni[k] = remapear(ni[k], tabla);
      // fuera de nodeInputs: las cargas por patrón (Map de Maps) y los diafragmas
      if (m.cargasPatron) for (const [p, mp] of m.cargasPatron) {
        const out = new Map<number, number[]>();
        for (const [k, v] of mp) {
          const j = tabla.get(k); if (j === undefined) continue;
          const prev = out.get(j);
          out.set(j, prev ? prev.map((x, q) => x + (v[q] ?? 0)) : [...v]);
        }
        m.cargasPatron.set(p, out);
      }
      if (m.diafragmas) m.diafragmas = remapear(m.diafragmas, tabla) as Map<number, number>;
      if (nombresViejos) {
        const nom: string[] = [];
        tabla.forEach((j, i) => { if (nom[j] === undefined) nom[j] = nombresViejos[i]; });
        m.nodeNames = nom;
      }
      if (m.nodeNameToIdx) {
        const idx = new Map<string, number>();
        for (const [nombre, i] of m.nodeNameToIdx) {
          const j = tabla.get(i);
          if (j !== undefined) idx.set(nombre, j);
        }
        m.nodeNameToIdx = idx;
      }
    }
  }

  // ⚠️ AQUI HABIA un paso que creaba un nudo donde CUALQUIER barra inclinada
  // cruzaba la cota de una planta. Esta quitado a proposito y no hay que
  // volver a ponerlo: partia por los niveles cosas que no son de planta —el
  // arco de una cascara curva, una diagonal— y eso ESTROPEA el modelo en vez
  // de arreglarlo. ETABS tampoco lo hace: sus niveles auxiliares no cortan lo
  // que no es una columna.
  //
  // Lo que si hay que partir —las columnas de varios pisos— se parte donde
  // toca, en el IMPORTADOR (`e2kParser`), que es el unico sitio que sabe que
  // esa `LINE` es una `COLUMN` con `nStories 4`. Desde la geometria sola no se
  // distingue de un arco.

  // ── 2) el nudo del CRUCE, donde ETABS lo pide y no lo hay ────────────────
  //
  // Se hace ANTES de partir: creado el nudo, el paso siguiente parte las dos
  // barras por el solo, sin un caso especial. Solo entre barras que traen las
  // dos `MESHATINTERSECTIONS "YES"` y en el MISMO plano horizontal — un cruce
  // a distinta cota es una viga pasando por encima de otra.
  {
    const N = m.nodes as unknown as number[][];
    const elems = m.elements as unknown as number[][];
    const flag = (m.elementInputs as any).mallaEnCruces as Map<number, boolean> | undefined;
    if (opciones.sinCruces) { inf.nudosDeCruce = 0; }
    const idxBar: number[] = [];
    elems.forEach((el, i) => { if (el.length === 2) idxBar.push(i); });
    const clave = (x: number, y: number, z: number) =>
      `${Math.round(x / tol)}|${Math.round(y / tol)}|${Math.round(z / tol)}`;
    const hay = new Set(N.map((n) => clave(n[0], n[1], n[2])));
    const nuevos = new Map<string, number[]>();

    // El cruce se busca en 3D por ACERCAMIENTO MINIMO entre los dos segmentos.
    // Antes se exigia que las dos barras fueran horizontales y coplanarias, y
    // con eso valia mientras todos los nudos estaban a la cota de su planta.
    // Al leer la CAIDA de cada punto el modelo pasa a tener 137 cotas
    // distintas (lo confirma ETABS por OAPI) y esas cubiertas inclinadas ya no
    // son horizontales: la version plana encontraba CERO cruces.
    //
    // Dos rectas que se cruzan en el espacio casi nunca se cortan exactamente;
    // lo que se mide es la distancia minima entre los segmentos. Si es menor
    // que la tolerancia, se tocan de verdad — que es lo que ETABS malla. Una
    // viga que pasa POR ENCIMA de otra tiene esa distancia grande y no se toca.
    for (let a = 0; opciones.sinCruces ? false : a < idxBar.length; a++) {
      for (let b = a + 1; b < idxBar.length; b++) {
        const ea = elems[idxBar[a]], eb = elems[idxBar[b]];
        if (ea.some((x) => eb.includes(x))) continue;
        const P = N[ea[0]], Q = N[ea[1]], R = N[eb[0]], S = N[eb[1]];
        if (!P || !Q || !R || !S) continue;
        const u = [Q[0] - P[0], Q[1] - P[1], Q[2] - P[2]];
        const v = [S[0] - R[0], S[1] - R[1], S[2] - R[2]];
        const w = [P[0] - R[0], P[1] - R[1], P[2] - R[2]];
        const pt = (x: number[], y: number[]) => x[0] * y[0] + x[1] * y[1] + x[2] * y[2];
        const A = pt(u, u), B = pt(u, v), C = pt(v, v), D = pt(u, w), E = pt(v, w);
        const den = A * C - B * B;
        if (Math.abs(den) < 1e-14) continue;          // paralelas
        const sc = (B * E - C * D) / den;             // parametro en la barra a
        const tc = (A * E - B * D) / den;             // parametro en la barra b
        // el cruce tiene que caer DENTRO de las dos, no en su prolongacion
        if (sc <= 1e-6 || sc >= 1 - 1e-6 || tc <= 1e-6 || tc >= 1 - 1e-6) continue;
        const p1 = [P[0] + sc * u[0], P[1] + sc * u[1], P[2] + sc * u[2]];
        const p2 = [R[0] + tc * v[0], R[1] + tc * v[1], R[2] + tc * v[2]];
        if (Math.hypot(p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]) > tol) continue;
        // ⚠️ EL PUNTO MEDIO de los dos, no el de una. Las dos rectas casi nunca
        // se cortan exacto: cogiendo `p1` el nudo queda ENCIMA de la barra `a` y
        // a casi `tol` de la `b`, asi que el paso de partir lo acepta en una y
        // lo rechaza en la otra — y queda un nudo colgado de una sola barra,
        // que es un mecanismo. Con el medio, las dos lo tienen a tol/2.
        const pm = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2];
        const k = clave(pm[0], pm[1], pm[2]);
        if (hay.has(k) || nuevos.has(k)) continue;
        // Sin el flag NO se toca: se cuenta y se deja.
        if (flag && !(flag.get(idxBar[a]) && flag.get(idxBar[b]))) { inf.crucesSinNudo++; continue; }
        nuevos.set(k, pm);
      }
    }
    for (const [, p] of nuevos) {
      (m.nodes as unknown as number[][]).push(p);
      if (m.nodeNames) m.nodeNames.push(`cruce@${m.nodeNames.length}`);
      inf.nudosDeCruce++;
    }
  }

  // ── 3) partir cada barra por los nudos que caen encima ───────────────────
  // Se recorren todas las barras contra todos los nudos: en 750 × 800 son
  // 600 000 comprobaciones, instantáneo. Un índice espacial solo haría falta
  // con decenas de miles, y sería un sitio más donde equivocarse.
  {
    const N = m.nodes as unknown as number[][];
    const ei = m.elementInputs as unknown as Record<string, unknown>;
    const elems = m.elements as unknown as number[][];
    const nuevosElems: number[][] = [];
    const origen: number[] = [];
    const posicion: Array<"unico" | "primero" | "medio" | "ultimo"> = [];

    elems.forEach((el, e) => {
      const suelto = () => { nuevosElems.push(el); origen.push(e); posicion.push("unico"); };
      if (el.length !== 2) return suelto();
      const a = N[el[0]], c = N[el[1]];
      if (!a || !c) return suelto();
      const d = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      const L2 = d[0] ** 2 + d[1] ** 2 + d[2] ** 2;
      if (L2 < 1e-12) return suelto();

      const dentro: Array<{ t: number; n: number }> = [];
      for (let k = 0; k < N.length; k++) {
        if (k === el[0] || k === el[1]) continue;
        const p = N[k];
        const w = [p[0] - a[0], p[1] - a[1], p[2] - a[2]];
        const t = (w[0] * d[0] + w[1] * d[1] + w[2] * d[2]) / L2;
        if (t <= 1e-6 || t >= 1 - 1e-6) continue;
        const q = [a[0] + t * d[0], a[1] + t * d[1], a[2] + t * d[2]];
        if (Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) < tol) dentro.push({ t, n: k });
      }
      if (!dentro.length) return suelto();

      dentro.sort((x, y) => x.t - y.t);
      const cadena = [el[0], ...dentro.map((x) => x.n), el[1]];
      inf.barrasPartidas++;
      inf.trozosNuevos += cadena.length - 2;
      for (let s = 0; s < cadena.length - 1; s++) {
        nuevosElems.push([cadena[s], cadena[s + 1]]);
        origen.push(e);
        posicion.push(s === 0 ? "primero" : s === cadena.length - 2 ? "ultimo" : "medio");
      }
    });

    if (inf.barrasPartidas) {
      const nombresViejos = m.elementNames;
      const tiposViejos = m.elementTypes;
      // ⚠️ Y las PLANTAS. Se quedaban sin reindexar, asi que todo trozo nuevo
      // salia con planta `undefined` — y cualquier herramienta que agrupe por
      // planta (la biseccion, un filtro del visor) los mete en un cajon «?»
      // que no existe. No daba error: daba un grupo fantasma.
      const plantasViejas = m.elementStories;
      for (const clave of Object.keys(ei)) {
        const viejo = ei[clave];
        if (!(viejo instanceof Map)) continue;
        const nuevo = new Map<number, unknown>();
        origen.forEach((o, j) => {
          if (!viejo.has(o)) return;
          let v = viejo.get(o);
          if (clave === "endOffsets" && Array.isArray(v)) {
            // el brazo de la cara I solo en el primer trozo y el de la J solo en el último
            const r = (v as number[]).slice();
            const pos = posicion[j];
            if (pos !== "primero" && pos !== "unico") r[0] = 0;
            if (pos !== "ultimo" && pos !== "unico") r[1] = 0;
            v = r;
          }
          if (clave === "frameFixedEnd" && posicion[j] !== "unico") return;   // empotramiento de la barra ENTERA
          if (clave === "momentReleases" && Array.isArray(v)) {
            // El release de la cara I solo en el primer trozo, el de la J solo
            // en el último. Copiarlo a todos serían rótulas internas de más.
            const r = (v as boolean[]).slice();
            const pos = posicion[j];
            if (pos !== "primero" && pos !== "unico") for (let q = 0; q < 6; q++) r[q] = false;
            if (pos !== "ultimo" && pos !== "unico") for (let q = 6; q < 12; q++) r[q] = false;
            v = r;
          }
          nuevo.set(j, v);
        });
        ei[clave] = nuevo;
      }
      const elemsViejos = elems;
      m.elements = nuevosElems as unknown as typeof m.elements;
      if (nombresViejos) {
        const cuenta = new Map<number, number>();
        m.elementNames = origen.map((o, j) => {
          const base = nombresViejos[o] ?? String(o);
          if (posicion[j] === "unico") return base;
          const k = (cuenta.get(o) ?? 0) + 1;
          cuenta.set(o, k);
          return `${base}-${k}`;
        });
      }
      if (tiposViejos) m.elementTypes = origen.map((o) => tiposViejos[o]);
      if (plantasViejas) m.elementStories = origen.map((o) => plantasViejas[o]);
      // peso propio de barra aparte: cada trozo se queda con el tramo cargado que le cae dentro
      if (m.pesoBarras) {
        const pb = new Map<number, { q: number; s0: number; s1: number }>();
        const N0 = m.nodes as unknown as number[][];
        const dist = (p: number[], q: number[]) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
        origen.forEach((o, j) => {
          const v = m.pesoBarras!.get(o); if (!v) return;
          const ini = N0[elemsViejos[o][0]], [pa, pb2] = nuevosElems[j].map((n) => N0[n]);
          const sa = dist(ini, pa), sb = dist(ini, pb2);
          const s0 = Math.max(v.s0, Math.min(sa, sb)), s1 = Math.min(v.s1, Math.max(sa, sb));
          if (s1 - s0 > 1e-9) pb.set(j, { q: v.q, s0: s0 - Math.min(sa, sb), s1: s1 - Math.min(sa, sb) });
        });
        m.pesoBarras = pb;
      }
      if (m.elementSections) { const es = new Map<number, string>(); origen.forEach((o, j) => { const v = m.elementSections.get(o); if (v !== undefined) es.set(j, v); }); m.elementSections = es; }
      if (m.zonaRigida) { const zr = new Map<number, number>(); origen.forEach((o, j) => { const v = m.zonaRigida!.get(o); if (v !== undefined) zr.set(j, v); }); m.zonaRigida = zr; }
    }
  }

  inf.piezasFlotantesDespues = flotantes(
    m.elements as unknown as number[][], (m.nodeInputs as any).supports);
  return inf;
}
