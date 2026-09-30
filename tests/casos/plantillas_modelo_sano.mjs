/**
 * Las PLANTILLAS montan un modelo sano: la carga cuadra, no sobran nudos y la
 * malla es la de ETABS.
 *
 * Los tres fallos que vigila salieron de que Jorge MIRARA la pantalla, no de
 * que fallara nada. Ninguno lanza un error, ninguno da NaN, y los tres cambian
 * el resultado.
 *
 * ## 1 · La carga tiene que sumar `q · A · pisos`
 *
 * Jorge: *«veo cargas puntuales sin la carga en cada nodo en edificaciones con
 * aporte de la losa o muros»*, y *«el tema es que la carga por área y la carga
 * puntual, pero esa carga puntual solo a los nodos»*.
 *
 * Tiene razón en las dos cosas, y la segunda es la importante: **un FEM siempre
 * acaba aplicando fuerzas en los nudos**. Una carga de área no se «aplica sobre
 * el área»: se integra contra las funciones de forma y sale un vector nodal,
 * `f_i = ∫N_i·q·dA`. Lo que distingue un modelo bueno de uno malo no es que las
 * fuerzas sean nodales —siempre lo son— sino **si esas fuerzas son la integral
 * correcta o un reparto inventado**.
 *
 * Y aquí eran inventadas. Medido con `q = 5 kN/m²` sobre 18 × 18 m y 4 pisos,
 * o sea **6480 kN** exactos:
 *
 * | plantilla | antes | ahora |
 * |---|---|---|
 * | Pórtico + losa · Losa plana · Dual | −6480 ✓ | −6480 ✓ |
 * | **Pórtico 3D · Arriostrado** | **−8640** (+33 %) | −6480 ✓ |
 * | **Solo rejilla** | **−2880** (−56 %) | −6480 ✓ |
 *
 * El +33 % venía de cargar las vigas de X **y** las de Y con medio ancho
 * tributario cada una: eso no es una partición del área, es contarla vez y
 * media. El −56 % era repartir `q·sx·sy/4` por nudo sin mirar si el nudo era de
 * esquina, de borde o interior.
 *
 * **Ninguno de los dos da error.** El modelo resuelve, la flecha sale, y es la
 * de otra estructura.
 *
 * ## 2 · Nudos huérfanos
 *
 * Sin losa, la malla fina creaba nudos interiores que **no tocaban un solo
 * elemento**: `Pórtico 3D` salía con 6845 nudos y 1216 elementos — más de cinco
 * mil huérfanos. El solver los descarta (`getZerosIndices`), así que no fallan;
 * pero se dibujan, engordan el modelo y falsean cualquier cuenta que mire
 * «nudos». Ahora la malla fina solo existe donde hay losa que la sujete.
 *
 * ## 3 · La malla, como la hace ETABS
 *
 * Leído de las cadenas de ayuda de `ETABS.exe`:
 *
 * > *«Determines how the floor is meshed. Default behavior is auto COOKIE CUT at
 * > beams and walls if membrane, auto rectangle mesh if shell/plate.»*
 * > *«Indicates if the elements that are cookie cut are to be further meshed to
 * > a MAX ELEMENT SIZE.»*
 *
 * Dos etapas: cortar por cada línea de viga y muro, y luego remallar cada trozo
 * hasta un **tamaño máximo**. Por eso el parámetro va en metros y no en
 * «divisiones por vano» — y no es cosmético:
 *
 * | malla máx | elemento | flecha (pórtico + losa) |
 * |---|---|---|
 * | 3.0 m | 3.00 m | 1.643 mm |
 * | 1.0 m | 1.00 m | 2.735 mm |
 * | **0.5 m** (el de ETABS) | 0.50 m | **2.869 mm** |
 * | 0.35 m | 0.33 m | 2.895 mm |
 *
 * Con la malla vieja la flecha salía un **43 % corta**. Y sobre ESA malla se
 * había medido «la losa rigidiza un 32 %», que por tanto no valía.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

const MS = 0.5;          // el tamaño de malla de ETABS para losa
const TOL_CARGA = 0.5;   // % — es una suma exacta, no una aproximación

const FUENTE = `
const g = globalThis; g.window = g;
g.document = { createElement: () => ({ style:{}, appendChild(){}, getContext:()=>null }),
  body:{appendChild(){}}, addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){} };
g.addEventListener = () => {};
const { plantillas } = await import("${R}/examples/src/plantillas/plantillas");

export function barrer(ms) {
  const tipos = Object.entries(plantillas.params.tipo.options);
  const out = [];
  for (const [nombre, t] of tipos) {
    const p = {}; for (const [k,d] of Object.entries(plantillas.params)) p[k] = d.default;
    p.tipo = t; p.ms = ms;
    const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}},
                 deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]} };
    try { plantillas.build(p, st, { render(){} }); }
    catch (e) { out.push({ nombre, t, err: String(e.message) }); continue; }

    const nodes = st.nodes.val, elements = st.elements.val;
    const loads = st.nodeInputs.val.loads, sup = st.nodeInputs.val.supports;

    // area de planta y carga que DEBERIA haber
    const X = nodes.map(n => n[0]), Y = nodes.map(n => n[1]), Zs = nodes.map(n => n[2]);
    const Lx = Math.max(...X) - Math.min(...X);
    const Ly = Math.max(...Y) - Math.min(...Y);
    const niveles = [...new Set(Zs.map(z => +z.toFixed(6)))].sort((a,b)=>a-b);
    const pisos = niveles.length - 1;
    // El portico plano es una CRUJIA: su area tributaria es su luz por sy.
    const A = (Ly > 1e-9 ? Lx * Ly : Lx * p.sy);
    const debe = p.q * A * pisos;

    let suma = 0;
    for (const v of loads.values()) suma += v[2];

    // nudos huerfanos: los que no aparecen en ningun elemento
    const tocado = new Set();
    for (const e of elements) for (const n of e) tocado.add(n);
    let huerfanos = 0;
    for (let n = 0; n < nodes.length; n++) if (!tocado.has(n)) huerfanos++;

    // apoyos fuera de la base
    let fuera = 0;
    for (const [k, v] of sup) {
      if (!(Array.isArray(v) ? v.some(Boolean) : !!v)) continue;
      if (Math.abs(nodes[k][2]) > 1e-9) fuera++;
    }

    let flecha = 0;
    const d = st.deformOutputs.val && st.deformOutputs.val.deformations;
    if (d) for (const v of d.values()) flecha = Math.max(flecha, Math.abs((v && v[2]) || 0));

    out.push({ nombre, t, nodes: nodes.length, elements: elements.length,
               suma: -suma, debe, huerfanos, fuera, flecha: flecha * 1000 });
  }
  return out;
}
`;

export const nombre = "plantillas-modelo-sano";
export const descripcion =
  "las plantillas: la carga suma q·A, sin nudos huerfanos, apoyos solo en la base";

export async function correr() {
  const { barrer } = await empaquetar(FUENTE, "plantsano");
  const r = barrer(MS);
  const filas = [];

  filas.push({
    que: "las 8 plantillas montan y resuelven",
    medido: r.filter((x) => !x.err).length, limite: r.length,
    ok: r.every((x) => !x.err),
    detalle: r.filter((x) => x.err).map((x) => `${x.nombre}: ${x.err}`).join(" · ")
          || r.map((x) => `${x.nodes}n/${x.elements}e`).join(" "),
    crudo: true,
  });

  // ── 1 · la carga: es una SUMA EXACTA, no una aproximación ────────────────
  // Solo las plantillas de EDIFICIO se cargan por area (q·A por piso). Las de CIMENTACION (añadidas
  // despues) llevan cargas de COLUMNA: ahi q·A no es la carga y la fila salia roja sin serlo (29-sep-2026).
  // Su equilibrio (suelo = carga) lo mide cli/barrido_162.mjs.
  for (const x of r.filter((y) => !y.err && !/Cimentaci/i.test(y.nombre))) {
    const d = Math.abs(x.suma / x.debe - 1) * 100;
    filas.push({
      que: `${x.nombre} · Σ carga = q·A·pisos`,
      medido: d, limite: TOL_CARGA, ok: d <= TOL_CARGA,
      detalle: `${x.suma.toFixed(1)} kN aplicados vs ${x.debe.toFixed(1)} kN de área`,
    });
  }

  // ── 2 · ni un nudo suelto ────────────────────────────────────────────────
  const conHuerfanos = r.filter((x) => !x.err && x.huerfanos > 0);
  filas.push({
    que: "ningun nudo HUERFANO (sin un solo elemento que lo toque)",
    medido: conHuerfanos.length, limite: 0, ok: conHuerfanos.length === 0,
    detalle: conHuerfanos.length
      ? conHuerfanos.map((x) => `${x.nombre}: ${x.huerfanos} de ${x.nodes}`).join(" · ")
      : r.filter((x) => !x.err).map((x) => `${x.nodes}n`).join(" ") + " — todos con elemento",
    crudo: true,
  });

  // ── 3 · apoyos solo en la base ───────────────────────────────────────────
  const conFuera = r.filter((x) => !x.err && x.fuera > 0);
  filas.push({
    que: "apoyos SOLO en la base (nada de ataduras «por si acaso»)",
    medido: conFuera.length, limite: 0, ok: conFuera.length === 0,
    detalle: conFuera.length
      ? conFuera.map((x) => `${x.nombre}: ${x.fuera} fuera`).join(" · ")
      : "las 8 con el apoyo solo abajo",
    crudo: true,
  });

  // ── 4 · el tamano de malla sigue mandando, y el elemento CONVERGE ─────────
  //
  // ⚠️ Esto exigia que la malla fina cambiara la flecha MAS DE UN 20 %, y era
  // cierto cuando la plantilla venia con Shell-Thick: el MITC4 a 3 m se queda
  // corto. El default paso a Shell-Thin (Kirchhoff), que no bloquea a
  // cortante, y con el la malla gruesa ya acierta. Medido hoy (29-ago-2026)
  // sobre la MISMA plantilla y la misma malla, cambiando solo `formLosa`:
  //
  //   malla   shells   Thin (el default)   Thick (MITC4)
  //   3.00 m     144       2.7884 mm         1.6432 mm   <- el 1.643 de la tabla de arriba
  //   1.25 m     900       2.8493 mm         2.6865 mm
  //   0.50 m    5184       2.8876 mm         2.8691 mm
  //
  // O sea que la tabla del encabezado no medía la malla: medía el elemento. Lo
  // que hay que vigilar aqui es lo otro, que es lo que puede romperse sin
  // avisar: que `ms` siga MALLANDO (si se desconecta, los elementos no cambian)
  // y que el resultado este CONVERGIDO (se mueve poco, pero no exactamente
  // nada). Que el MITC4 necesite malla fina lo mide `shell-thick`.
  const grueso = barrer(3.0);
  const fino = r;
  const losa = (v) => v.find((x) => /losa \(aporte/i.test(x.nombre));
  const g = losa(grueso), f = losa(fino);
  if (g && f) {
    const veces = f.elements / g.elements;
    filas.push({
      que: "`ms` sigue mallando: de 3 m a la malla de ETABS hay 10 veces mas elementos",
      medido: `${g.elements} -> ${f.elements} (x${veces.toFixed(0)})`,
      limite: "x10 o mas", ok: veces >= 10, crudo: true,
      detalle: "si esto se pusiera a x1 seria que el parametro dejo de llegar al mallador",
    });
    const gana = Math.abs(f.flecha / g.flecha - 1) * 100;
    filas.push({
      que: "y el elemento CONVERGE: la malla fina apenas mueve la flecha, pero la mueve",
      medido: gana, limite: 6, ok: gana > 0.2 && gana <= 6,
      detalle: `3.0 m -> ${g.flecha.toFixed(3)} mm · ${MS} m -> ${f.flecha.toFixed(3)} mm`
             + ` (${gana.toFixed(2)} % mas). Por debajo de 0.2 % seria que la malla no`
             + " llega al resultado; por encima de 6 % que el elemento dejo de converger.",
      crudo: true,
    });
  }

  return filas;
}
