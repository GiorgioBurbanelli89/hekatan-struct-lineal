/**
 * 📐 DWG / DXF ⇄ GEOMETRÍA de Hekatan Struct.
 *
 * IMPORTAR: el plano se lee con el MISMO motor del visor DWG
 * (hekatan-dwg-viewer: acadrust compilado a WASM, copiado en public/dwg/),
 * que devuelve `{layers, entities}`. De ahí salen nudos y barras:
 *
 *   LINE                    → una barra
 *   POLYLINE abierta        → una barra por tramo
 *   POLYLINE cerrada 3 ó 4  → un ÁREA (shell). El 3DFACE llega así del motor.
 *   POLYLINE cerrada > 4    → barras por el contorno
 *   ARC                     → barras que siguen el arco (12 por vuelta entera)
 *   TEXT, DIM, CIRCLE       → no son estructura: se ignoran
 *
 * Las capas de ejes, cotas, textos y rotulado se SALTAN por el nombre: en un
 * plano el eje A es una línea como cualquier otra, y convertirlo en barra
 * mete una viga donde no hay nada.
 *
 * Después, en ESTE orden (reference_cad_a_fem_partir_uniones_t):
 *   1. fundir extremos que coinciden (tolerancia 1 mm);
 *   2. PARTIR cada barra en los nudos que caen sobre ella — en el dibujo una
 *      columna es una línea de z=0 a z=8 y el entrepiso llega a media altura;
 *      sin partir, ese nudo queda suelto y el solver da un número absurdo
 *      (el galpón bajaba 5.9 m en vez de 7 mm);
 *   3. quitar las barras repetidas que deja el partir.
 *
 * EXPORTAR: nudos y barras del modelo → entidades del escritor de acadrust
 * (`write_dwg`) o un DXF R12 de texto. Cada familia en su capa (COLUMNAS,
 * VIGAS, DIAGONALES, LOSAS, MUROS), que es lo que el importador vuelve a leer.
 */

export type Vec3 = [number, number, number];

export interface DwgDoc {
  layers: { name: string }[];
  entities: any[];
}

export interface GeometriaImportada {
  nodes: Vec3[];
  polylines: number[][];      // [i,j] barra · [a,b,c,d,a] área
  areas: number[];            // índices de polylines que son área
  resumen: string;
  capasUsadas: string[];
  capasSaltadas: string[];
  escala: number;
}

export interface OpcionesImportar {
  /** 'auto': 3D tal cual; si el plano es 2D va a planta (XY). 'xz': un
   *  alzado dibujado en 2D (la Y del plano pasa a ser la Z). */
  plano?: "auto" | "xy" | "xz";
  /** metros por unidad del dibujo; si falta se adivina (mm si mide > 1000). */
  escala?: number;
  tol?: number;               // m
}

/** Capas que NO son estructura. */
export const CAPAS_NO_ESTRUCTURA =
  /(^|[^A-Z])(EJE|EJES|GRID|AXIS|COTA|COTAS|DIM|TEXT|TEXTO|HATCH|RAYAD|TITUL|ROTUL|MARCO|DEFPOINTS|NIVEL|VIEWPORT|VPORT|CAJETIN|MOBIL|PUERT|VENTAN)/i;

export function docAGeometria(doc: DwgDoc, op: OpcionesImportar = {}): GeometriaImportada {
  const nomCapa = (li: number) => (doc.layers[li] && doc.layers[li].name) || "0";
  const usadas = new Set<string>(), saltadas = new Set<string>();
  const segs: [Vec3, Vec3][] = [];
  const caras: Vec3[][] = [];
  const P = (q: number[]): Vec3 => [q[0], q[1], q[2] || 0];

  // Si el plano trae un MODELO ANALÍTICO en sus propias capas (ANALITICO-*,
  // SHELL-*), eso es lo que se importa: el resto son los perfiles extruidos,
  // el alma y las alas dibujadas, que como barras serían basura.
  const hayAnalitico = doc.layers.some(l => /ANALITIC/i.test(l.name || ""));
  const esAnalitica = (c: string) => /ANALITIC|^SHELL/i.test(c);
  for (const e of doc.entities) {
    const capa = nomCapa(e.li || 0);
    const tipo = e.type;
    if (!["LINE", "POLYLINE", "ARC"].includes(tipo)) continue;
    if (CAPAS_NO_ESTRUCTURA.test(capa) || (hayAnalitico && !esAnalitica(capa))) {
      saltadas.add(capa); continue;
    }
    usadas.add(capa);
    if (tipo === "LINE") segs.push([P(e.start), P(e.end)]);
    else if (tipo === "POLYLINE") {
      // sin vertices repetidos seguidos (el 3DFACE de 3 lados repite el 3.º)
      const p: Vec3[] = [];
      for (const q of (e.points || []).map(P))
        if (!p.length || dist(p[p.length - 1], q) > 1e-9) p.push(q);
      // un contorno cerrado se repite a veces con el primer punto al final
      if (p.length > 2 && dist(p[0], p[p.length - 1]) < 1e-9) p.pop();
      if (e.closed && (p.length === 3 || p.length === 4)) caras.push(p);
      else {
        for (let i = 0; i < p.length - 1; i++) segs.push([p[i], p[i + 1]]);
        if (e.closed && p.length > 2) segs.push([p[p.length - 1], p[0]]);
      }
    } else if (tipo === "ARC") {
      const c = P(e.center), r = e.radius;
      if (!(r > 0)) continue;
      let span = ((e.end_angle - e.start_angle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) || 2 * Math.PI;
      const n = Math.max(2, Math.round(span / (2 * Math.PI) * 12));
      for (let k = 0; k < n; k++) {
        const a0 = e.start_angle + span * k / n, a1 = e.start_angle + span * (k + 1) / n;
        segs.push([[c[0] + r * Math.cos(a0), c[1] + r * Math.sin(a0), c[2]],
                   [c[0] + r * Math.cos(a1), c[1] + r * Math.sin(a1), c[2]]]);
      }
    }
  }

  // ── escala y plano ──
  const todos: Vec3[] = [...segs.flat(), ...caras.flat()];
  let min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (const q of todos) for (let k = 0; k < 3; k++) {
    if (q[k] < min[k]) min[k] = q[k];
    if (q[k] > max[k]) max[k] = q[k];
  }
  const tam = todos.length ? Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2]) : 0;
  const escala = op.escala ?? (tam > 1000 ? 0.001 : 1);
  const es3D = todos.length > 0 && (max[2] - min[2]) > 1e-6 * Math.max(1, tam);
  const plano = op.plano && op.plano !== "auto" ? op.plano : "xy";
  const aModelo = (q: Vec3): Vec3 => {
    const x = q[0] * escala, y = q[1] * escala, z = q[2] * escala;
    return (plano === "xz" && !es3D) ? [x, 0, y] : [x, y, z];
  };

  // ── 1. fundir nudos (rejilla de la tolerancia) ──
  const tol = op.tol ?? 1e-3;
  const nodes: Vec3[] = [];
  const rejilla = new Map<string, number[]>();
  const clave = (q: Vec3) => q.map(v => Math.round(v / tol)).join(",");
  const nudo = (q0: Vec3): number => {
    const q = aModelo(q0);
    const r = q.map(v => Math.round(v / tol));
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
      const l = rejilla.get(`${r[0] + dx},${r[1] + dy},${r[2] + dz}`);
      if (l) for (const i of l) if (dist(nodes[i], q) <= tol) return i;
    }
    nodes.push(q);
    const k = clave(q);
    (rejilla.get(k) ?? rejilla.set(k, []).get(k)!).push(nodes.length - 1);
    return nodes.length - 1;
  };
  let barras: [number, number][] = [];
  for (const [a, b] of segs) {
    const i = nudo(a), j = nudo(b);
    if (i !== j) barras.push([i, j]);
  }
  const areasNud: number[][] = [];
  for (const c of caras) {
    const ids = c.map(nudo);
    if (new Set(ids).size === ids.length) areasNud.push(ids);
  }

  // ── 2. partir en los nudos intermedios (uniones en T) ──
  barras = partirEnNudos(nodes, barras, tol);

  // ── 3. sin repetidas ──
  const vistas = new Set<string>();
  const polylines: number[][] = [], areas: number[] = [];
  for (const [i, j] of barras) {
    const k = i < j ? `${i}-${j}` : `${j}-${i}`;
    if (vistas.has(k)) continue;
    vistas.add(k); polylines.push([i, j]);
  }
  for (const ids of areasNud) { polylines.push([...ids, ids[0]]); areas.push(polylines.length - 1); }

  const nb = polylines.length - areas.length;
  return {
    nodes, polylines, areas, escala,
    capasUsadas: [...usadas], capasSaltadas: [...saltadas],
    resumen: `${nodes.length} nudos · ${nb} barras · ${areas.length} áreas` +
      (escala !== 1 ? ` · unidades del dibujo × ${escala}` : "") +
      (!es3D ? ` · plano ${plano.toUpperCase()}` : " · 3D"),
  };
}

function dist(a: number[], b: number[]) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/** Parte cada barra en los nudos cuyo pie de perpendicular cae DENTRO de ella
 *  a menos de `tol`. Rejilla espacial para no hacer barras × nudos a lo bruto. */
export function partirEnNudos(nodes: Vec3[], barras: [number, number][], tol: number): [number, number][] {
  const celda = Math.max(tol * 50, 0.5);
  const grid = new Map<string, number[]>();
  const ck = (x: number, y: number, z: number) =>
    `${Math.floor(x / celda)},${Math.floor(y / celda)},${Math.floor(z / celda)}`;
  nodes.forEach((p, i) => {
    const k = ck(p[0], p[1], p[2]);
    (grid.get(k) ?? grid.set(k, []).get(k)!).push(i);
  });
  const out: [number, number][] = [];
  for (const [i, j] of barras) {
    const a = nodes[i], b = nodes[j];
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const L2 = d[0] ** 2 + d[1] ** 2 + d[2] ** 2;
    if (L2 === 0) continue;
    const lo = [0, 1, 2].map(k => Math.floor((Math.min(a[k], b[k]) - tol) / celda));
    const hi = [0, 1, 2].map(k => Math.floor((Math.max(a[k], b[k]) + tol) / celda));
    const cortes: [number, number][] = [];
    // barras largas en celdas pequeñas: si la caja tiene demasiadas celdas se
    // recorren los nudos directamente (más barato que millones de celdas vacías)
    const nCeldas = (hi[0] - lo[0] + 1) * (hi[1] - lo[1] + 1) * (hi[2] - lo[2] + 1);
    const candidatos: Iterable<number> = nCeldas > nodes.length ? nodes.keys() : (function* () {
      for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) {
        const l = grid.get(`${x},${y},${z}`); if (l) yield* l;
      }
    })();
    for (const n of candidatos) {
      if (n === i || n === j) continue;
      const p = nodes[n];
      const t = ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1] + (p[2] - a[2]) * d[2]) / L2;
      if (t <= 1e-9 || t >= 1 - 1e-9) continue;
      const f = [a[0] + t * d[0], a[1] + t * d[1], a[2] + t * d[2]];
      if (dist(f, p) <= tol) cortes.push([t, n]);
    }
    cortes.sort((u, v) => u[0] - v[0]);
    let prev = i;
    for (const [, n] of cortes) { if (n !== prev) out.push([prev, n]); prev = n; }
    if (prev !== j) out.push([prev, j]);
  }
  return out;
}

// ═══════════════════════════════════════════════════════════════ EXPORTAR
export interface EntidadEscritor {
  t: "LINE" | "FACE"; l: string; c: number; p: number[][];
}

const COLOR_CAPA: Record<string, number> = {
  COLUMNAS: 0xff3030, VIGAS: 0x30ff30, DIAGONALES: 0x30e0ff, LOSAS: 0x30c0ff, MUROS: 0xc080ff,
};

/** Familia de una barra por su dirección (Z arriba, como ETABS). */
export function familiaBarra(a: number[], b: number[]): string {
  const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
  const h = Math.hypot(dx, dy), L = Math.hypot(h, dz);
  if (L === 0) return "VIGAS";
  if (h / L < 0.02) return "COLUMNAS";
  if (Math.abs(dz) / L < 0.02) return "VIGAS";
  return "DIAGONALES";
}

export function modeloAEntidades(nodes: number[][], elements: number[][]) {
  const ents: EntidadEscritor[] = [];
  const usadas = new Set<string>();
  for (const e of elements) {
    if (!e || e.length < 2) continue;
    if (e.length === 2) {
      const a = nodes[e[0]], b = nodes[e[1]];
      if (!a || !b) continue;
      const l = familiaBarra(a, b); usadas.add(l);
      ents.push({ t: "LINE", l, c: COLOR_CAPA[l], p: [[a[0], a[1], a[2]], [b[0], b[1], b[2]]] });
    } else if (e.length === 3 || e.length === 4) {
      const p = e.map(i => nodes[i]);
      if (p.some(q => !q)) continue;
      const zs = p.map(q => q[2]);
      const l = Math.max(...zs) - Math.min(...zs) < 1e-6 ? "LOSAS" : "MUROS"; usadas.add(l);
      const q4 = p.length === 3 ? [...p, p[2]] : p;          // 3DFACE: el 4.º repite el 3.º
      ents.push({ t: "FACE", l, c: COLOR_CAPA[l], p: q4.map(q => [q[0], q[1], q[2]]) });
    }
  }
  const layers = [...usadas].map(name => ({ name, color: COLOR_CAPA[name] }));
  return { layers, entities: ents };
}

/** DXF R12 de texto: LINE y 3DFACE en su capa. Lo abre AutoCAD, el visor y
 *  cualquier CAD. */
export function entidadesADxf(m: { layers: { name: string; color: number }[]; entities: EntidadEscritor[] }): string {
  const aci: Record<string, number> = { COLUMNAS: 1, VIGAS: 3, DIAGONALES: 4, LOSAS: 5, MUROS: 6 };
  const o: string[] = [];
  const g = (c: number, v: string | number) => { o.push(String(c), typeof v === "number" ? fmt(v) : v); };
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(6));
  g(0, "SECTION"); g(2, "TABLES"); g(0, "TABLE"); g(2, "LAYER"); g(70, m.layers.length);
  for (const l of m.layers) { g(0, "LAYER"); g(2, l.name); g(70, 0); g(62, aci[l.name] ?? 7); g(6, "CONTINUOUS"); }
  g(0, "ENDTAB"); g(0, "ENDSEC");
  g(0, "SECTION"); g(2, "ENTITIES");
  for (const e of m.entities) {
    if (e.t === "LINE") {
      g(0, "LINE"); g(8, e.l);
      g(10, e.p[0][0]); g(20, e.p[0][1]); g(30, e.p[0][2]);
      g(11, e.p[1][0]); g(21, e.p[1][1]); g(31, e.p[1][2]);
    } else {
      g(0, "3DFACE"); g(8, e.l);
      e.p.forEach((q, k) => { g(10 + k, q[0]); g(20 + k, q[1]); g(30 + k, q[2]); });
    }
  }
  g(0, "ENDSEC"); g(0, "EOF");
  return o.join("\n") + "\n";
}

// ═══════════════════════════════════════════════════════ motor (navegador)
let _motor: any = null;
async function motor(base: string) {
  if (_motor) return _motor;
  // contra la PAGINA, no contra este chunk (que vive en assets/): un import()
  // relativo se resuelve desde el modulo que lo pide y acababa en assets/dwg/
  const url = new URL(`${base}dwg/_native.js`, document.baseURI).href;
  const m = await import(/* @vite-ignore */ url);
  await m.default();
  _motor = m;
  return m;
}

/** Lee un .dwg o .dxf y devuelve el `{layers, entities}` del motor del visor. */
export async function leerPlano(file: File, base: string): Promise<DwgDoc> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (/\.dxf$/i.test(file.name)) {
    const { importarDXF } = await import(/* @vite-ignore */ new URL(`${base}dwg/dxf_in.js`, document.baseURI).href);
    return (await importarDXF(new TextDecoder().decode(bytes))).doc;
  }
  const m = await motor(base);
  return JSON.parse(m.read_dwg_full(bytes));
}

export async function escribirDwg(nodes: number[][], elements: number[][], base: string): Promise<Uint8Array> {
  const m = await motor(base);
  return m.write_dwg(JSON.stringify(modeloAEntidades(nodes, elements)));
}
