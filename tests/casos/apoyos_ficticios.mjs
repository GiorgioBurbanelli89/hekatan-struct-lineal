/**
 * APOYOS FICTICIOS: ataduras puestas «por si acaso» que nadie pidió.
 *
 * Jorge, mirando el pórtico plano en pantalla: *«¿qué es ese triángulo? ya hay
 * nodos blancos, ¿qué es eso?»*. Eran apoyos — una restricción fuera-de-plano
 * en **todos** los nudos, puesta para blindarse contra una singularidad que no
 * existía. El visor dibuja un marcador por cada nudo restringido, así que el
 * pórtico salía con un triángulo en cada junta y **parecía apoyado entero**.
 *
 * Medido antes de tocar nada:
 *
 *     CON ataduras:  35/35 nudos con apoyo · flecha 3.2266 mm
 *     SIN ataduras:   7/35 nudos con apoyo · flecha 3.2266 mm · NaN 0
 *
 * Flecha idéntica y cero NaN: sobraban enteras.
 *
 * ## Por qué esto necesita un test y no basta con haberlo arreglado
 *
 * Una atadura de más **no rompe nada que se note**. El modelo resuelve, los
 * números salen, la suite pasa. Lo único que cambia es que el resultado es de
 * otra estructura — una más rígida que la que el usuario cree tener. Y el día
 * que la atadura SÍ tape una singularidad de verdad, habrá escondido el fallo
 * en vez de enseñarlo, que es peor que no tenerla.
 *
 * Es el mismo modo de fallo que el `.heks` que no se leía entero y el modelo sin
 * carga que daba flecha 0: **el silencio se lee como «salió bien»**.
 *
 * ## Qué se juzga
 *
 * 1. **Las plantillas**: apoyo SOLO en la base. Son modelos generados por
 *    nosotros, sin excusa posible para una atadura en mitad del edificio.
 * 2. **Todo el catálogo**: ningún ejemplo puede tener apoyo en **casi todos**
 *    sus nudos sin declararlo.
 *
 * ⚠️ Y una atadura general **no siempre es un error**. Hay tres casos legítimos,
 * y por eso van en una lista con su motivo escrito en vez de en un límite mudo:
 *
 * * una **membrana o placa** plana, donde el fuera-de-plano no tiene rigidez y
 *   dejarlo suelto da un sistema mal condicionado (ahí sí hace falta);
 * * un banco de **simetría**, donde el borde restringido es la mitad del modelo;
 * * una losa sobre **suelo**, donde el «apoyo» son los muelles.
 *
 * La lista falla si aparece uno nuevo **y también si uno deja de hacer falta**,
 * para que no se quede ahí un permiso que ya nadie usa.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

/** Fracción de nudos con apoyo por encima de la cual hay que dar explicaciones. */
const SOSPECHA = 0.5;
/**
 * Y por debajo de esto no se mira: en un voladizo de 2 nudos, UN empotramiento
 * ya es el 50 % y no tiene nada de sospechoso. Lo que se persigue es la atadura
 * REPARTIDA por todo el modelo, y eso solo tiene sentido con bastantes nudos.
 */
const NUDOS_MIN = 12;

/**
 * Los que SÍ pueden tener apoyo en casi todos sus nudos, con el motivo.
 * Si uno se cae de la lista es que ya no lo necesita: quitarlo de aquí.
 */
const PERMITIDOS = {
  // El muro de LARGUEROS es un modelo PLANO y ademas TODO axil: ni el larguero
  // ni la diagonal dan rigidez de giro, y la inercia es del orden de 1e-12. Los
  // tres giros y la traslacion fuera del plano no los sujeta NADIE, asi que sus
  // GDL tienen fuerza nula y su valor lo decidiria el redondeo. Atarlos es lo
  // que hace `getZerosIndices` en el solver; dejarlos sueltos es una matriz
  // singular. Las traslaciones del plano solo estan atadas en la base.
  "muro-largueros": "modelo plano y todo axil: nadie sujeta los giros ni el fuera-de-plano",

  // Los tres bancos ITW VIEJOS (`examples/src/test/itwBenchmarks.ts`, otro
  // fichero que el de la categoria Drilling ITW). Son membranas PLANAS: el
  // fuera-de-plano no tiene rigidez propia y dejarlo suelto deja el sistema mal
  // condicionado. Aqui la atadura general si hace falta.
  "itw-patch-test": "membrana plana: sin atar el fuera-de-plano el sistema queda mal condicionado",
  "itw-cantilever": "membrana plana (idem)",
  "itw-cook": "membrana plana (idem)",

  // Los de la categoria Drilling ITW. MISMO motivo: son membranas planas en el
  // plano X-Z. ⚠️ El hemisferio NO esta aqui — es una cascara curva y solo se
  // sujeta por los dos bordes de simetria; si algun dia aparece en esta lista es
  // que alguien le metio una atadura general y hay que quitarsela.
  "itw-test-1-flexion-pura": "membrana plana (X-Z): se ata el fuera-de-plano",
  "itw-test-2-voladizo": "membrana plana (X-Z)",
  "itw-test-3-cook": "membrana plana (X-Z)",
  // ⚠️ `itw-muro-acople` e `itw-muro-frame` ya NO estan (24-sep-2026): llevaban
  // la misma atadura (uy, rx, rz en todos los nudos) y el visor pintaba un cono
  // azul en cada nudo libre. Medido: reacciones de la atadura ~1e-12 y deriva
  // identica sin ella (0.2370 mm y 6.7606 mm) — la cascara tiene flexion de
  // placa y la carga va en el plano, asi que sobraba. Ahora solo base empotrada.

  // Los cuatro Q4 rescatados de FEM Studio (18-sep-2026). MISMO motivo, y está
  // medido en su `gen`, no supuesto: los cuatro generan TODOS sus nudos con
  // `y = 0` (malla en el plano X-Z) y atan exactamente
  // `[false, true, false, true, true, true]` — o sea uy y los tres giros, dejando
  // libres ux y uz, que son los GDL del plano. Es la misma atadura que llevan los
  // `itw-*` de arriba. La base, esa sí, va empotrada aparte.
  "viga-alta": "membrana plana (X-Z): se ata uy y los tres giros, ux/uz libres",
  "muro-contencion": "membrana plana (X-Z) (idem)",
  "muro-q4": "membrana plana (X-Z) (idem)",
  "viga-q4": "membrana plana (X-Z) (idem)",
};

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
   // ⚠️ El try envuelve TODO el cuerpo, no solo el \`build\`. Algunos ejemplos
   // (zapata-aislada) montan estado REACTIVO y lanzan al leer sus salidas, o
   // sea despues del build y fuera de un try que solo lo cubriera a el. Un
   // barrido que revienta por un ejemplo deja de mirar los otros setenta.
   try {
    const p = {}; for (const [k,d] of Object.entries(ex.params||{})) p[k] = d.default;
    const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}},
                 deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]} };
    try { ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} }); } catch { continue; }
    const nodes = st.nodes.val || [], sup = st.nodeInputs.val && st.nodeInputs.val.supports;
    if (!nodes.length || !sup || !sup.size) continue;
    let zmin = Infinity;
    for (const n of nodes) if (n && n[2] < zmin) zmin = n[2];
    // ⚠️ Solo cuentan las entradas que RESTRINGEN algo. Una entrada con los
    // seis GDL en \`false\` no ata nada —el solver la ignora— pero existe en el
    // mapa, y el visor dibuja un marcador por cada nudo del mapa: apoyo
    // ficticio puro, invisible para cualquier comprobación numérica.
    let base = 0, fuera = 0, vacias = 0;
    for (const [k, v] of sup) {
      const ata = Array.isArray(v) ? v.some(Boolean) : !!v;
      if (!ata) { vacias++; continue; }
      const z = (nodes[k] && nodes[k][2]) || 0;
      if (Math.abs(z - zmin) < 1e-6) base++; else fuera++;
    }
    out.push({ id: ex.id, n: nodes.length, sup: base + fuera, base, fuera, vacias });
   } catch (e) { /* ejemplo que no monta fuera del workspace: no es cosa de apoyos */ }
  }
  return out;
}

/** Las plantillas, tipo a tipo: aquí el apoyo tiene que estar SOLO en la base. */
export function barrerPlantillas() {
  const ex = examplesRegistry.find((e) => e.id === "plantillas");
  if (!ex) return [];
  const tipos = Object.values(ex.params.tipo.options || {});
  const out = [];
  for (const t of tipos) {
    const p = {}; for (const [k,d] of Object.entries(ex.params)) p[k] = d.default;
    p.tipo = t;
    const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}},
                 deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]} };
    try { ex.build(p, st, { render(){} }); } catch (e) { out.push({ t, err: String(e.message) }); continue; }
    const nodes = st.nodes.val, sup = st.nodeInputs.val.supports;
    let fuera = 0, base = 0, vacias = 0;
    for (const [k, v] of sup) {
      if (!(Array.isArray(v) ? v.some(Boolean) : !!v)) { vacias++; continue; }
      (Math.abs(nodes[k][2]) < 1e-9 ? base++ : fuera++);
    }
    out.push({ t, n: nodes.length, base, fuera, vacias });
  }
  return out;
}
`;

export const nombre = "apoyos-ficticios";
export const descripcion =
  "ninguna atadura «por si acaso»: las plantillas solo en la base, y el resto declarado";

export async function correr() {
  const { barrer, barrerPlantillas } = await empaquetar(FUENTE, "apoyosfict");
  const filas = [];

  // ── 1 · las plantillas: apoyo SOLO en la base ───────────────────────────
  const pl = barrerPlantillas();
  const conFuera = pl.filter((x) => x.fuera > 0);
  filas.push({
    que: "plantillas · apoyo SOLO en la base",
    medido: conFuera.length, limite: 0, ok: conFuera.length === 0,
    detalle: conFuera.length
      ? conFuera.map((x) => `tipo ${x.t}: ${x.fuera} apoyos fuera de la base`).join(" · ")
      : `${pl.length} tipos · ${pl.map((x) => x.base).join("/")} apoyos, todos en la base`,
    crudo: true,
  });

  // ── 2 · el catálogo: nadie ata casi todo sin declararlo ──────────────────
  const todos = barrer();
  const masivos = todos.filter((x) => x.n >= NUDOS_MIN && x.sup / x.n >= SOSPECHA);
  const nuevos = masivos.filter((x) => !(x.id in PERMITIDOS));
  const yaNo = Object.keys(PERMITIDOS).filter(
    (id) => !masivos.some((x) => x.id === id) && todos.some((x) => x.id === id));

  filas.push({
    que: `ningun ejemplo NUEVO ata mas del ${SOSPECHA * 100} % de sus nudos`,
    medido: nuevos.length, limite: 0, ok: nuevos.length === 0,
    detalle: nuevos.length
      ? nuevos.map((x) => `${x.id} (${x.sup}/${x.n}, ${x.fuera} fuera de la base)`).join(" · ")
      : `${todos.length} ejemplos mirados · ${masivos.length} atan mucho, todos con motivo escrito`,
    crudo: true,
  });

  // ── 3 · entradas de apoyo que no atan nada ──────────────────────────────
  // Son las peores: no cambian un solo numero, asi que ninguna comprobacion
  // numerica las ve, y el visor pinta un apoyo en cada una.
  const conVacias = todos.filter((x) => x.vacias > 0);
  filas.push({
    que: "ninguna entrada de apoyo con los SEIS GDL en false (no ata, pero se dibuja)",
    medido: conVacias.length, limite: 0, ok: conVacias.length === 0,
    detalle: conVacias.length
      ? conVacias.map((x) => `${x.id} (${x.vacias} vacias de ${x.n} nudos)`).join(" · ")
      : `${todos.length} ejemplos mirados, ninguno mete apoyos que no aten`,
    crudo: true,
  });

  filas.push({
    // Si uno deja de necesitar el permiso, hay que quitarlo: si no, la lista se
    // convierte en un cajon donde todo esta permitido y deja de avisar.
    que: "la lista de PERMITIDOS sigue al dia (ni uno de mas)",
    medido: yaNo.length, limite: 0, ok: yaNo.length === 0,
    detalle: yaNo.length
      ? `ya no atan casi todo, sacalos de PERMITIDOS: ${yaNo.join(", ")}`
      : `${Object.keys(PERMITIDOS).length} permitidos, cada uno con su motivo`,
    crudo: true,
  });

  return filas;
}
