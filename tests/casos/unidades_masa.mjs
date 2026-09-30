/**
 * UNIDADES DE LA MASA: `densities` es MASA (t/m3), no PESO (kN/m3).
 *
 * El motor lumpea `m = rho*A*L` (`getGlobalMassMatrix.cpp`) y el resto del
 * modelo va en kN y metros. Con fuerza en kN y longitud en m, la masa solo
 * cuadra en TONELADAS: `rho = gamma / g`. Poner el peso especifico (78 el
 * acero, 24 el hormigon) pesa 9.81 veces de mas y baja todas las frecuencias
 * sqrt(9.81) = 3.13 veces; ponerlo en kg/m3 (7849) pesa 1000 veces de mas y las
 * baja 31.6. Los dos errores estaban vivos y no los caza ningun test de
 * fuerzas, porque `deform()` NO usa las densidades: solo se ve en el modal.
 *
 * El arbitro no es una cuenta a mano ni un numero heredado: es la VELOCIDAD DE
 * ONDA LONGITUDINAL del material, `c = sqrt(E/rho)`, que es una propiedad
 * fisica medible y publicada:
 *
 *     acero     E = 200 GPa, rho = 7850 kg/m3  ->  c = 5048 m/s
 *     hormigon  E =  25 GPa, rho = 2400 kg/m3  ->  c = 3227 m/s
 *
 * Si un ejemplo da c = 1600 m/s con acero, la densidad esta 9.81x de mas; si da
 * 160 m/s, esta 1000x. Comprobado ademas contra el voladizo de Euler-Bernoulli
 * en SI puro (`f1 = (1.875104^2/2pi)*sqrt(EI/(rho*A*L^4))`): el ejemplo bueno
 * cerraba al 1.5 % y el malo daba 1/31.6 exacto.
 *
 * Solo se miran los ejemplos en el sistema kN-m-t (E entre 1e6 y 1e9 kN/m2).
 * Los `benchmark-paz-*` van en kip-in y quedan fuera del filtro solos.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

/** c = sqrt(E/rho) admisible, en m/s. Cubre madera (~3500) a acero (~5100). */
const C_MIN = 1500;
const C_MAX = 8000;

/**
 * Ejemplos que se saltan, con el motivo MEDIDO al lado. No es una lista para
 * tapar fallos: cada uno corrige la densidad mas adelante, y eso hay que
 * verlo en su codigo, no suponerlo.
 */
const EXENTOS = {
  "test-m-dual":    "runModal divide densities entre 9.80665 antes de llamar al modal",
  "test-m-portico": "idem",
  "test-m-losa":    "idem",
};

/**
 * PENDIENTES: fuera de rango y MEDIDOS, pero arreglarlos no es cambiar un
 * numero. No se tapan — la ultima fila del caso falla si aparece uno nuevo o
 * si esta lista deja de estar al dia.
 *
 * 1) [ARREGLADO] Los edificios daban al acero la densidad del hormigon.
 *
 * 2) [CERRADO 6-sep-2026 en 10-7 y 11-1; 7-1, 9-3, 12-1, 13-1 sin tocar] Los `benchmark-paz-*`
 *    pasaban rho en kg/m3 con E en kN/m2 (1000x): ya va en t/m3. Y no cerraban contra el
 *    libro por TRES cosas mas, todas medidas: (a) el 11.1 llevaba m = 0.078 y el libro usa
 *    m*L/420 = 1 -> m = 4.2 lb*s2/in2 (su M local sale sin factor, p.300); (b) el motor normal es
 *    LUMPED (rho*A*L/2 por extremo, como CSI) y el libro es masa CONSISTENTE: hay que llamar a
 *    `modalAnalysisPaz` (156/22L/4L2); (c) el portico es PLANO: sin restringir el fuera de plano
 *    salen modos de Iz. Con eso: 11.1 = 4.010/4.869/10.323 Hz (libro 4.02/4.97/10.33) y 10.7 =
 *    7.192/19.864/39.061 (Programa 13 rehecho: 7.231/20.089/39.856). Lo que queda es EXACTAMENTE
 *    la deformacion por cortante del motor Paz (Timoshenko, As = 5/6 A, phi = 0.06 y 0.043):
 *    con phi el Python da los mismos digitos. El libro es Euler. Siguen en PENDIENTES porque
 *    su masa es academica (rho = 22 442 t/m3 en 11.1): c = sqrt(E/rho) nunca va a caer en rango.
 */
const PENDIENTES = [
  // (1) ARREGLADO: los cinco edificios daban al acero la densidad del hormigon.
  //     `edificioAporticado.ts` ponia `rho_c` a todo sin mirar `matCol`/`matViga`,
  //     asi que una columna de acero pesaba 2.447 t/m3 en vez de 7.951: 3.25
  //     veces menos masa. Ahora la densidad va por material, como E, G y nu.
  // (2) 30-sep-2026: 7-1, 9-3 y 13-1 CERRADOS (masa de piso en nudos, rho del 13.1 bien convertida:
  //     tests/casos/paz_libro_dinamica.mjs). Quedan los de masa académica (c = sqrt(E/rho) fuera de rango).
  "benchmark-paz-10-7", "benchmark-paz-11-1", "benchmark-paz-12-1",
];

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

export function barrer() {
  const out = [];
  for (const ex of examplesRegistry) {
    if (!ex.hasModal) continue;
    const p = {}; for (const [k,d] of Object.entries(ex.params||{})) p[k] = d.default;
    const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}},
                 deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]} };
    const panel = { render(){}, clear(){}, show(){}, hide(){} };
    let err = null;
    try { ex.build(p, st, panel); } catch (e) { err = String((e && e.message) || e); }
    const ei = st.elementInputs.val || {};
    const pares = [];
    if (ei.densities && ei.elasticities)
      for (const [k, rho] of ei.densities) {
        const E = ei.elasticities.get(k);
        if (E && rho) pares.push({ E, rho, c: Math.sqrt(E / rho) });
      }
    out.push({ id: ex.id, err, pares });
  }
  return out;
}
`;

export const nombre = "unidades-masa";
export const descripcion =
  "densities es MASA (t/m3): c = sqrt(E/rho) tiene que dar la velocidad de onda del material";

export async function correr() {
  const mod = await empaquetar(FUENTE, "unidades-masa");
  const filas = [];
  const malos = [];
  let mirados = 0;

  for (const ej of mod.barrer()) {
    if (EXENTOS[ej.id]) continue;
    // solo el sistema kN-m-t: E de 1e6 a 1e9 kN/m2 (1 GPa a 1000 GPa)
    const enSistema = ej.pares.filter((x) => x.E >= 1e6 && x.E <= 1e9);
    if (!enSistema.length) continue;
    mirados++;
    const cs = enSistema.map((x) => x.c);
    const cmin = Math.min(...cs), cmax = Math.max(...cs);
    if (cmin < C_MIN || cmax > C_MAX) {
      const factor = cmin < C_MIN ? Math.sqrt(9.81) : null;
      malos.push(`${ej.id} c=${cmin.toFixed(0)}..${cmax.toFixed(0)} m/s` +
                 (factor && cmin > 900 ? " (huele a peso especifico: 3.13x)" : "") +
                 (cmin < 300 ? " (huele a kg/m3: 31.6x)" : ""));
    }
  }

  filas.push({
    que: "ejemplos con modal en kN-m-t revisados",
    medido: mirados, limite: 15,
    ok: mirados >= 15,
    detalle: `si baja de golpe es que el barrido dejo de construir los ejemplos, no que se arreglaron`,
  });

  const nuevos = malos.filter((m) => !PENDIENTES.some((p) => m.startsWith(p + " ")));
  const arreglados = PENDIENTES.filter((p) => !malos.some((m) => m.startsWith(p + " ")));

  filas.push({
    que: "densidad de masa coherente (c = sqrt(E/rho) en m/s)",
    medido: nuevos.length, limite: 0,
    ok: nuevos.length === 0,
    detalle: nuevos.length ? nuevos.join(" · ")
      : `${mirados - PENDIENTES.length} ejemplos dentro de ${C_MIN}-${C_MAX} m/s`,
  });

  filas.push({
    que: "la lista de PENDIENTES sigue al dia (ni uno de mas ni de menos)",
    medido: arreglados.length, limite: 0,
    ok: arreglados.length === 0,
    detalle: arreglados.length
      ? `ya cierran, sacalos de PENDIENTES: ${arreglados.join(", ")}`
      : `${PENDIENTES.length} pendientes, con su motivo escrito en el caso`,
  });

  return filas;
}
