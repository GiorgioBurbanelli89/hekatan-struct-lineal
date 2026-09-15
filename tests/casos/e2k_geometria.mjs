/**
 * E2K: ¿la geometria que EXPORTA Hekatan es la del modelo?
 *
 * El .e2k no guarda las coordenadas de un nudo. Guarda un POINT con (x, y) y un
 * descenso opcional, y la cota sale de la PLANTA del objeto que lo usa. O sea
 * que el exportador puede escribir un fichero perfectamente valido que describa
 * OTRA estructura, y no se nota hasta abrirlo en ETABS.
 *
 * Paso lo que pasa: el exportador ponia el MISMO punto de planta en los dos
 * extremos de cada COLUMN/BRACE (`LINE "C1" COLUMN "1" "1" 1`), que es lo
 * correcto para una columna vertical de edificio y es una MENTIRA para una
 * barra inclinada — ETABS le da al extremo de abajo la x,y del de arriba. En el
 * galpon (nave con arco) eso tumbaba 42 de las 102 barras. Arbitrado abriendo
 * los dos ficheros en ETABS 19.1 y leyendo `PointObj.GetCoordCartesian`:
 *
 *     antes:    60 de 102 barras bien · 90 joints (35 inventados)
 *     despues: 102 de 102 barras bien · 56 joints (1 suelto)
 *
 * Aqui la comprobacion se hace SIN ETABS, releyendo el e2k con la regla del
 * formato para que la suite corra en cualquier maquina. La regla no es una
 * suposicion: se decidio puntuando las cuatro combinaciones posibles contra los
 * nudos de un modelo real de ETABS y salio 1258 de 1258 extremos de barra sobre
 * un nudo (ver `galpon-bodega-electoral/e2k_a_dwg.py`):
 *
 *   1. El tercer numero del POINT es un DESCENSO bajo la cota de su planta.
 *   2. En una LINE, el punto que esta EN la planta del objeto es el SEGUNDO;
 *      el PRIMERO baja tantas plantas como diga el ultimo entero.
 *
 * Deliberadamente NO se usa `parseE2k` del propio repo: leer con el mismo
 * criterio con que se escribe mide una copia y da verde siempre.
 *
 * El arbitro de verdad, cuando haya ETABS a mano:
 *   python galpon-bodega-electoral/e2k_vs_etabs_coords.py <e2k> <salida.json>
 */
import { empaquetar, R } from "../lib/bundle.mjs";

/**
 * Umbral = lo YA MEDIDO, no un numero redondo. Si baja, algo se rompio; si
 * sube, hay que subir el umbral y decir por que.
 */
const CASOS = [
  { id: "galpon",        nota: "nave con arco: el caso que destapo el fallo" },
  { id: "mezanine",      nota: "edificio regular, siempre estuvo bien" },
  { id: "portico-2d",    nota: "portico plano" },
  { id: "test-m-dual",   nota: "edificio dual con muros" },
  { id: "tower-3d",      nota: "torre con diagonales" },
  { id: "galpon-bodega", nota: "la nave real, 960 barras" },
];

/**
 * Dos medidas, porque una sola miente:
 *
 *  A) EXTREMOS: cada extremo de cada LINE del e2k tiene que caer sobre un nudo
 *     del modelo. Si el exportador se inventa una cota (o vuelve vertical una
 *     barra inclinada), aqui salta.
 *  B) COBERTURA: cada barra del modelo tiene que estar DENTRO de alguna LINE
 *     del e2k. No se pide igualdad barra a barra a proposito: el exportador
 *     junta una columna de 4 tramos en UNA sola LINE con `MINNUMSTA`, y ETABS
 *     la vuelve a partir sola. Exigir igualdad daba 89 % en el galpon real
 *     castigando algo que esta bien.
 *
 * Las dos a la vez cierran la puerta: si una LINE fuera de mas o de menos, o
 * apuntara a otro sitio, una de las dos cae.
 */
const LIMITE_EXTREMOS = 100;   // %
const LIMITE_COBERTURA = 100;  // %

const FUENTE = `
const g = globalThis; g.window = g;
const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}),
  createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) },
  { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){},
  addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false},
  getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){},
  cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(),
  documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[],
  addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} };
g.addEventListener = () => {};
g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");
const { exportE2k } = await import("${R}/examples/src/shared/e2kExporter");

export function generar(id) {
  const ex = examplesRegistry.find(e => e.id === id);
  if (!ex) throw new Error("no existe el ejemplo " + id);
  const p = {}; for (const [k,d] of Object.entries(ex.params||{})) p[k] = d.default;
  const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}},
               deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]} };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  const e2k = exportE2k({ nodes: st.nodes.val, elements: st.elements.val,
    nodeInputs: st.nodeInputs.val, elementInputs: st.elementInputs.val,
    title: id, units: { force: "Tonf", length: "m" }, weightMode: "manual" });
  const ni = st.nodeInputs.val;
  let sumaFZ = 0, nCargas = 0;
  for (const [, v] of (ni.loads ?? [])) { if (v[2]) { sumaFZ += v[2]; nCargas++; } }
  return { e2k, nodes: st.nodes.val, elements: st.elements.val,
           nApoyos: ni.supports ? ni.supports.size : 0, nCargas, sumaFZ };
}`;

/** Relee el e2k con la regla del formato y devuelve los extremos de cada barra. */
function leerE2k(txt) {
  const L = txt.split(/\r?\n/);

  // El fichero esta escrito EN LAS UNIDADES DEL HEADER (hoy N y MM: el parser
  // del e2k de ETABS no lee UNITS y asume N/MM, medido importando). Aqui se
  // lee el header y se pasa TODO a m y kN, que es en lo que esta el modelo. Si
  // el exportador cambia de unidades, esta lectura lo sigue sola.
  const uni = txt.match(/^\s*UNITS\s+"([^"]+)"\s+"([^"]+)"/m);
  const FUERZA = { N: 1e-3, KN: 1, KGF: 9.80665e-3, TONF: 9.80665, KIP: 4.4482216 };
  const LONG = { MM: 1e-3, CM: 1e-2, M: 1, IN: 0.0254, FT: 0.3048 };
  const cF = FUERZA[(uni ? uni[1] : "KN").toUpperCase()] ?? 1;
  const cL = LONG[(uni ? uni[2] : "M").toUpperCase()] ?? 1;

  const stories = [];
  for (const l of L) {
    let m = l.match(/^\s*STORY\s+"([^"]+)"\s+HEIGHT\s+([\d.eE+-]+)/);
    if (m) { stories.push({ n: m[1], h: +m[2] * cL }); continue; }
    m = l.match(/^\s*STORY\s+"([^"]+)"\s+ELEV\s+([\d.eE+-]+)/);
    if (m) stories.push({ n: m[1], elev: +m[2] * cL });
  }
  stories.reverse();                       // el bloque va de arriba abajo
  const zStory = new Map();
  const orden = [];
  let z = 0;
  for (const s of stories) {
    z = s.elev != null ? s.elev : z + s.h;
    zStory.set(s.n, z);
    orden.push(s.n);
  }

  const P = new Map();
  for (const l of L) {
    const m = l.match(/^\s*POINT\s+"([^"]+)"\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s*([\d.eE+-]+)?/);
    if (m) P.set(m[1], { x: +m[2] * cL, y: +m[3] * cL, dz: m[4] ? +m[4] * cL : 0 });
  }

  const LN = new Map();
  for (const l of L) {
    const m = l.match(/^\s*LINE\s+"([^"]+)"\s+(COLUMN|BEAM|BRACE)\s+"([^"]+)"\s+"([^"]+)"\s+(\d+)/);
    if (m) LN.set(m[1], { p1: m[3], p2: m[4], salto: +m[5] });
  }
  // Una LINE se define UNA vez y se asigna en cada planta donde existe (asi
  // escribe ETABS sus columnas, y asi las exporta Hekatan desde el 3-sep-2026):
  // cada LINEASSIGN es una barra.
  const asignaciones = [];
  for (const l of L) {
    const m = l.match(/^\s*LINEASSIGN\s+"([^"]+)"\s+"([^"]+)"/);
    if (m && LN.has(m[1])) asignaciones.push({ ...LN.get(m[1]), story: m[2] });
  }

  const zde = (pid, st) => zStory.get(st) - (P.get(pid)?.dz ?? 0);
  const barras = [];
  for (const b of asignaciones) {
    const i = orden.indexOf(b.story);
    if (i < 0 || !P.has(b.p1) || !P.has(b.p2)) continue;
    const abajo = orden[Math.max(0, i - b.salto)];
    const a = P.get(b.p1), c = P.get(b.p2);
    barras.push([[a.x, a.y, zde(b.p1, abajo)], [c.x, c.y, zde(b.p2, b.story)]]);
  }

  // Los apoyos y las cargas van explícitos en el fichero (no dependen de la
  // regla de plantas), así que aquí basta con leerlos.
  let nApoyos = 0;
  for (const l of L) if (/^\s*POINTASSIGN\b.*\bRESTRAINT\s+"[^"]*[UR]/.test(l)) nApoyos++;
  let sumaFZ = 0, nCargas = 0;
  for (const l of L) {
    const m = l.match(/^\s*POINTLOAD\b.*\bFZ\s+(-?[\d.eE+-]+)/);
    if (m) { sumaFZ += +m[1]; nCargas++; }
  }
  return { barras, nApoyos, nCargas, sumaFZ: sumaFZ * cF };
}

export const nombre = "e2k-geometria";
export const descripcion =
  "el e2k que exporta Hekatan describe el MISMO modelo (arbitrado en ETABS 19.1)";

const TOL = 2e-3;   // m

/** ¿El punto P cae sobre el segmento AB (colineal y entre los extremos)? */
function enSegmento(P, A, B) {
  const d = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
  const v = [P[0] - A[0], P[1] - A[1], P[2] - A[2]];
  const L2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2];
  if (L2 < 1e-12) return Math.hypot(...v) <= TOL;
  const t = (v[0] * d[0] + v[1] * d[1] + v[2] * d[2]) / L2;
  if (t < -TOL || t > 1 + TOL) return false;
  const dist = Math.hypot(v[0] - t * d[0], v[1] - t * d[1], v[2] - t * d[2]);
  return dist <= TOL;
}

export async function correr() {
  const mod = await empaquetar(FUENTE, "e2k-geometria");
  const filas = [];
  const apoyosMal = [], cargasMal = [];
  // Clave a 0.1 mm, redondeando ANTES de formatear: el e2k viene en mm y al
  // pasarlo a m sale 7.537500000000001 donde el modelo tiene 7.5375 exacto.
  // Con `toFixed(3)` a pelo esos dos caen en milimetros distintos (7.537 vs
  // 7.538) y 96 extremos buenos del galpon salian "sueltos".
  const k = (p) => p.map((v) => (Math.round(v * 1e4) / 1e4).toFixed(4)).join(",");

  for (const caso of CASOS) {
    let pExtremos = 0, pCobertura = 0, det1 = "", det2 = "";
    try {
      const g = mod.generar(caso.id);
      const { e2k, nodes, elements } = g;
      const nudos = new Set(nodes.map((n) => k(n)));
      const rel = leerE2k(e2k);
      const leidas = rel.barras;
      // apoyos y carga vertical: el e2k tiene que llevarlos, y completos
      if (rel.nApoyos !== g.nApoyos)
        apoyosMal.push(`${caso.id}: modelo ${g.nApoyos} apoyos, e2k ${rel.nApoyos}`);
      if (g.nCargas) {
        const dif = Math.abs(rel.sumaFZ - g.sumaFZ) / Math.abs(g.sumaFZ);
        if (dif > 1e-4)
          cargasMal.push(`${caso.id}: ΣFZ modelo ${g.sumaFZ.toFixed(3)} kN, e2k ${rel.sumaFZ.toFixed(3)} (${(100*dif).toFixed(3)} %)`);
      }

      // A) extremos sobre un nudo del modelo
      let extOk = 0;
      const huerfanos = [];
      for (const [A, B] of leidas) {
        for (const P of [A, B]) {
          if (nudos.has(k(P))) extOk++;
          else if (huerfanos.length < 3) huerfanos.push(k(P));
        }
      }
      pExtremos = leidas.length ? (100 * extOk) / (2 * leidas.length) : 0;
      det1 = `${extOk}/${2 * leidas.length} extremos · ${caso.nota}`;
      // Si falla, decir DONDE: un extremo suelto sin coordenada no se depura.
      if (huerfanos.length) det1 += ` · sueltos: ${huerfanos.join(" | ")}`;

      // B) cada barra del modelo, dentro de alguna LINE
      const barras = elements.filter((e) => e.length === 2);
      let cubOk = 0;
      for (const e of barras) {
        const P = nodes[e[0]], Q = nodes[e[1]];
        if (leidas.some(([A, B]) => enSegmento(P, A, B) && enSegmento(Q, A, B))) cubOk++;
      }
      pCobertura = barras.length ? (100 * cubOk) / barras.length : 0;
      det2 = `${cubOk}/${barras.length} barras del modelo dentro de una LINE`;
    } catch (e) {
      det1 = det2 = "no se pudo generar: " + String((e && e.message) || e).slice(0, 60);
    }
    filas.push({
      que: `e2k ${caso.id}: extremos de LINE sobre un nudo`,
      medido: pExtremos, limite: LIMITE_EXTREMOS,
      ok: pExtremos >= LIMITE_EXTREMOS, detalle: det1,
    });
    filas.push({
      que: `e2k ${caso.id}: barras del modelo cubiertas`,
      medido: pCobertura, limite: LIMITE_COBERTURA,
      ok: pCobertura >= LIMITE_COBERTURA, detalle: det2,
    });
  }
  // Apoyos y cargas: la geometria puede estar perfecta y el analisis dar otra
  // cosa si un empotramiento entra como articulado o falta media carga.
  // Arbitrado en ETABS sobre el galpon: 10 de 10 apoyos identicos en sus 6
  // bits, 45 de 45 cargas y SumaFZ -45.0000 kN contra -45.0000 (0.000 %). Y de
  // paso salio que las cargas se redondeaban a 4 decimales: -1 kN se escribia
  // como -0.1020 tonf = -1.00028 kN, un +0.028 % en toda la carga del modelo.
  filas.push({
    que: "e2k: los apoyos del modelo estan en el fichero",
    medido: apoyosMal.length, limite: 0, ok: apoyosMal.length === 0,
    detalle: apoyosMal.length ? apoyosMal.join(" · ") : `los ${CASOS.length} ejemplos`,
  });
  filas.push({
    que: "e2k: la carga vertical total no se pierde ni se redondea",
    medido: cargasMal.length, limite: 0, ok: cargasMal.length === 0,
    detalle: cargasMal.length ? cargasMal.join(" · ") : "SumaFZ igual al modelo en todos",
  });

  return filas;
}
