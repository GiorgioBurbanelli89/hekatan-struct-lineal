/**
 * SALUD DE TODOS LOS EJEMPLOS: ¿resuelven, equilibran y tienen deformada?
 *
 * Este caso existe porque Jorge abrió el workspace y vio deformadas que no
 * estaban bien, con la suite en verde. Y tenía razón: los tests miraban cinco
 * modelos con árbitro (Paz, mezanine, mesa-torsión, galpón, SAFE) y de los
 * otros ochenta nadie comprobaba **nada**. Un ejemplo podía no resolver
 * siquiera y la suite seguía diciendo 123/123.
 *
 * Tres comprobaciones, todas sin oráculo externo — son propiedades que
 * cualquier FEM correcto cumple:
 *
 *  1. EQUILIBRIO: ΣF + ΣR = 0. Es la primera prueba de un análisis estático y
 *     no hace falta otro programa para juzgarla. Si no cierra, o el modelo está
 *     mal armado o el solver no resolvió.
 *  2. DEFORMADA COMPLETA: hay un desplazamiento por cada nudo. Si faltan, el
 *     visor dibuja el modelo plano — que es exactamente lo que pasaba con las
 *     zapatas: `plateQ4Solve` devuelve `nodeResults` SIN campo `node`, y
 *     `deformations.set(r.node, …)` metía las 289 bajo la misma clave
 *     `undefined`.
 *  3. NADA DE NaN: ni en coordenadas ni en desplazamientos. `edificio-dual`
 *     tenía 450 nudos con `z = NaN` porque las alturas salían de un array
 *     literal de 8 y el ejemplo pide 10 pisos; el solver moría con «Matrix
 *     decomposition failed» y ETABS importaba joints con coordenada NaN.
 *
 * Y una cuarta, que es la que caza los mecanismos: ningún nudo puede tocar UN
 * SOLO elemento. Así se destapó que las vigas secundarias de `edif-acero`
 * flotaban sin conectar (nacían en un nudo nuevo sobre la viga principal sin
 * partirla) y hacían la matriz singular: 0 deformaciones y ΣRz = 0.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

/**
 * Exentos del EQUILIBRIO, con el motivo medido. No es para tapar fallos: en
 * estos la reacción no está en `reactions`, así que la suma nunca cerraría.
 */
const SIN_REACCIONES = {
  springs: "la reacción va por los resortes Winkler, no por un apoyo",
  placas: "resuelve con plateQ4Solve, que no devuelve `reactions`",
};
const EXENTOS_EQUILIBRIO = new Set([
  // Winkler: la carga la recoge el suelo, no un apoyo
  "zapata-aislada", "zapata-viga-amarre", "zapata-aislada-validacion",
  "safe-bench-losa-cimentacion", "safe-bench-viga-cimentacion",
  "safe-bench-zapata-combinada", "safe-bench-zapata-conectada",
  "safe-bench-zapata-comparativa", "viga-medio-elastico",
  "guerra-ej1-zapata-cuadrada", "guerra-ej2-zapata-rectangular-sismo",
  "guerra-ej3-zapata-rectangular-eccentricidad-grande",
  "guerra-ej4-zapata-combinada-rectangular",
  "guerra-ej5-zapata-combinada-trapezoidal",
  "guerra-ej6-zapata-unida-viga-amarre",
  "guerra-ej7-viga-cimentacion-new", "guerra-ej8-losa-cimentacion",
  "viga-cim-guerra-ej7", "viga-cim-guerra-ej7-tinv",
  // Winkler SIN TRACCIÓN (levantamiento): la carga la toman los muelles que siguen en contacto
  "zapata-excentrica", "zapata-levantamiento",
  // plateQ4Solve: no hay `reactions` que sumar
  "plate-thin", "plate-thick", "plate-thick-validacion", "triangular-plate",
  "plane", "layered-shell", "benchmark-safe-ex01-plate",
  "benchmark-safe-ex04-plate-beams", "membrana", "membrana-pstress",
  "shell-thin", "shell-thick", "membrana-csi", "plate-with-beams",
]);

/** Un nudo con un solo elemento no siempre es un fallo: en un voladizo de una
 *  barra el extremo libre es legítimo. Se exige en los modelos con malla. */
const MINIMO_PARA_EXIGIR_CONEXION = 50;   // nudos

/**
 * Ejemplos cuyo DEFAULT no analiza, con los parámetros con los que SÍ hay que
 * medirlos. No es una exención: al revés, es medir de verdad lo que el ejemplo
 * hace cuando se le pide el análisis. Sin esto el barrido leía un modelo sin
 * resolver y decía «0 desplazamientos», que es lo que el ejemplo anuncia.
 */
const PARAMS_PARA_MEDIR = {
  // Su default es «Solo el modelo» a propósito: está aquí para demostrar la
  // IMPORTACIÓN de un `.e2k` real. Se mide sin cimentación (empotrado en z=0),
  // que es el análisis que cierra el equilibrio exacto; el de balasto lleva
  // muelles Winkler y su reacción no está en `reactions` (ver EXENTOS_EQUILIBRIO).
  "estructura-mixta": { resolver: 1, cimentacion: 1 },
};

/**
 * Nudos colgando ADMITIDOS, con el número medido. No es para tapar: es un
 * modelo REAL cuya cubierta no está unida —231 uniones que se quedan a un palmo,
 * siete vigas planas a z=12.80 sobre correas en pendiente— y ETABS también lo
 * declara UNSTABLE en su propio log. El límite está justo por encima de lo
 * medido para que un empeoramiento SALTE.
 */
const COLGADOS_ADMITIDOS = {
  "estructura-mixta": 40,   // medido 36 (29-ago-2026), con el análisis encendido
};

const FUENTE = `
const MEDIR_CON = ${JSON.stringify(PARAMS_PARA_MEDIR)};
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

export function barrer() {
  const out = [];
  for (const ex of examplesRegistry) {
    if (typeof ex.build !== "function") continue;
    const p = {}; for (const [k,d] of Object.entries(ex.params||{})) p[k] = d.default;
    Object.assign(p, MEDIR_CON[ex.id] || {});
    const estado = (ini) => { let v = ini;
      return { get val(){return v}, set val(x){v=x}, get rawVal(){return v}, set rawVal(x){v=x} }; };
    const st = { nodes: estado([]), elements: estado([]), nodeInputs: estado({}),
                 elementInputs: estado({}), deformOutputs: estado({}),
                 analyzeOutputs: estado({}), objects3D: estado([]) };
    let err = null;
    try { ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} }); }
    catch (e) { err = String((e && e.message)||e).slice(0, 60); }
    const nodes = st.nodes.val || [], els = st.elements.val || [];
    const ni = st.nodeInputs.val || {}, d = st.deformOutputs.val || {};

    let nDef = 0, defNaN = 0;
    if (d.deformations) for (const [, v] of d.deformations) {
      nDef++;
      for (let i = 0; i < 3; i++) if (!Number.isFinite(v[i])) defNaN++;
    }
    let nodosNaN = 0;
    for (const n of nodes) if (n.some((v) => !Number.isFinite(v))) nodosNaN++;

    const sF = [0,0,0], sR = [0,0,0];
    if (ni.loads) for (const [, v] of ni.loads) for (let i=0;i<3;i++) sF[i] += (v[i]||0);
    if (d.reactions) for (const [, v] of d.reactions) for (let i=0;i<3;i++) sR[i] += (v[i]||0);

    // Se cuentan solo los nudos que tocan UNA barra y NINGUN shell: la esquina
    // de una malla Q4 toca un solo elemento y eso es normal, no un mecanismo.
    const nFrames = new Array(nodes.length).fill(0);
    const nShells = new Array(nodes.length).fill(0);
    for (const e of els) for (const i of e) {
      if (i < 0 || i >= nodes.length) continue;
      if (e.length === 2) nFrames[i]++; else nShells[i]++;
    }
    // Tampoco cuenta el nudo donde se APLICA una carga: la cabeza de un
    // pedestal de cimentacion toca una sola barra justamente porque ahi entra
    // la carga de la columna. Un voladizo cargado es legitimo; lo que no lo es
    // es una barra colgada de la nada, sin carga y sin apoyo.
    const sup = ni.supports || new Map();
    const car = ni.loads || new Map();
    let soloUno = 0;
    for (let i = 0; i < nodes.length; i++)
      if (nFrames[i] === 1 && nShells[i] === 0 && !sup.has(i) && !car.has(i)) soloUno++;

    out.push({ id: ex.id, err, nNodos: nodes.length, nElem: els.length,
               nDef, defNaN, nodosNaN, sF, sR, soloUno,
               tieneReac: !!d.reactions, nCargas: ni.loads ? ni.loads.size : 0 });
  }
  return out;
}`;

export const nombre = "salud-ejemplos";
export const descripcion =
  "todos los ejemplos: equilibran, tienen deformada completa y no traen NaN";

export async function correr() {
  const mod = await empaquetar(FUENTE, "salud-ejemplos");
  const E = mod.barrer();
  const filas = [];

  // 1) NaN
  const conNaN = E.filter((e) => e.nodosNaN || e.defNaN)
    .map((e) => `${e.id} (${e.nodosNaN} nudos, ${e.defNaN} despl.)`);
  filas.push({
    que: "sin NaN en coordenadas ni desplazamientos",
    medido: conNaN.length, limite: 0, ok: conNaN.length === 0,
    detalle: conNaN.length ? conNaN.slice(0, 5).join(" · ") : `los ${E.length} ejemplos`,
  });

  // 2) deformada completa
  const sinDef = E.filter((e) => e.nElem && e.nDef === 0).map((e) => e.id);
  const incompletas = E.filter((e) => e.nDef && e.nDef < e.nNodos)
    .map((e) => `${e.id} (${e.nDef}/${e.nNodos})`);
  filas.push({
    que: "deformada con un desplazamiento por nudo",
    medido: sinDef.length + incompletas.length, limite: 0,
    ok: sinDef.length + incompletas.length === 0,
    detalle: sinDef.length || incompletas.length
      ? [...sinDef.map((s) => s + " (0)"), ...incompletas].slice(0, 5).join(" · ")
      : `${E.filter((e) => e.nDef).length} ejemplos resuelven`,
  });

  // 3) equilibrio
  const desequilibrados = [];
  for (const e of E) {
    if (EXENTOS_EQUILIBRIO.has(e.id) || !e.tieneReac || !e.nCargas) continue;
    // La escala es la carga TOTAL del modelo, no la de cada eje: si en Y solo
    // hay 1e-5 kN de redondeo, medir ese eje contra si mismo da un 100 % de
    // error sobre nada. (Asi saltaba `edificio-muros` con "0.0 + 0.0".)
    const total = Math.hypot(...e.sF) || Math.hypot(...e.sR);
    for (let i = 0; i < 3; i++) {
      const dif = Math.abs(e.sF[i] + e.sR[i]);
      const esc = Math.max(Math.abs(e.sF[i]), Math.abs(e.sR[i]));
      if (esc > 1e-6 && dif / Math.max(esc, 0.01 * total) > 0.01) {
        desequilibrados.push(`${e.id} ${"XYZ"[i]}: ${e.sF[i].toFixed(1)} + ${e.sR[i].toFixed(1)}`);
        break;
      }
    }
  }
  filas.push({
    que: "equilibrio global (SumaF + SumaR = 0)",
    medido: desequilibrados.length, limite: 0, ok: desequilibrados.length === 0,
    detalle: desequilibrados.length ? desequilibrados.slice(0, 5).join(" · ")
      : `${E.filter((e) => !EXENTOS_EQUILIBRIO.has(e.id) && e.tieneReac && e.nCargas).length} ejemplos cierran`,
  });

  // 4) nudos colgando de un solo elemento (mecanismo)
  // Los modelos sobre resortes Winkler quedan fuera: ahi el apoyo ES el
  // resorte y no aparece en `supports`, asi que el extremo de una viga de
  // cimentacion parece colgado cuando lo sostiene el suelo en toda su
  // longitud. Es la misma lista y el mismo motivo que en el equilibrio.
  const colgados = E.filter((e) => e.nNodos >= MINIMO_PARA_EXIGIR_CONEXION &&
                                   e.soloUno && !EXENTOS_EQUILIBRIO.has(e.id) &&
                                   e.soloUno > (COLGADOS_ADMITIDOS[e.id] ?? 0))
    .map((e) => `${e.id} (${e.soloUno})`);
  filas.push({
    que: "sin nudos colgando de un solo elemento",
    medido: colgados.length, limite: 0, ok: colgados.length === 0,
    detalle: colgados.length ? colgados.slice(0, 5).join(" · ")
      : `${E.filter((e) => e.nNodos >= MINIMO_PARA_EXIGIR_CONEXION).length} mallas revisadas`,
  });

  return filas;
}
