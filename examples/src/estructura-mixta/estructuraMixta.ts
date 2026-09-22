/**
 * 🧬 ESTRUCTURA MIXTA — un edificio real, entero, leído de su `.e2k`.
 *
 * Los demás ejemplos construyen su modelo con código: se eligen las luces y los
 * pisos y sale una malla limpia. Éste no. Éste es un **encargo de verdad**
 * —anonimizado— que se lee tal cual del `.e2k` que escribió ETABS, con todo lo
 * que un modelo real tiene y un ejemplo de laboratorio nunca:
 *
 *   · **seis familias de material a la vez**: hormigón de tres resistencias
 *     (f'c 210 / 240 / 280), acero laminado (A36, A572Gr50, A992, A500 Gr.B),
 *     acero conformado en frío (A653SQ Gr33 y Gr50), armadura (fy 4200),
 *     poliestireno expandido y **MADERA**
 *   · **CFT** — tubos de acero rellenos de hormigón, de 125×125 a 400×400
 *   · pilotes de hormigón circulares de Ø40, Ø60 y Ø80
 *   · correas en C conformadas en frío, deck, losas y muros
 *   · cotas de −1.00 m (cimentación) a +12.80 m
 *
 * ## Para qué está aquí
 *
 * Un ejemplo generado por código solo prueba lo que el generador sabe hacer.
 * Éste prueba **el importador contra el dialecto de ETABS**: se lee con el
 * mismo `parseE2k` que usa el botón «📥 Importar E2K», así que si el lector se
 * rompe, este ejemplo deja de salir — y eso se ve.
 *
 * Vino de ahí un arreglo de fondo (2026-08-28): el parser **contaba** las áreas
 * y no montaba ninguna, y **no convertía ninguna unidad**. Este fichero va en
 * **KGF y M**, así que servía además para pillar lo segundo: si la conversión
 * no estuviera, las cotas saldrían mil veces más grandes.
 *
 * ## Lo que NO entra, y por qué
 *
 * ## ⚖️ EL VEREDICTO: el modelo es inestable EN ETABS TAMBIÉN
 *
 * Esto no es una interpretación, es lo que escribe ETABS en su propio log al
 * analizarlo. Y está comprobado sobre el `.EDB` **ORIGINAL**, no sobre la copia
 * de trabajo (`validation/modelos/riochico/etabs_analisis_ORIGINAL.log`):
 *
 *     TOTAL NUMBER OF EQUILIBRIUM EQUATIONS     =        7380
 *     * * * W A R N I N G * * *
 *     THE STRUCTURE IS UNSTABLE OR ILL-CONDITIONED !!
 *     CHECK THE STRUCTURE CAREFULLY FOR:
 *      - INADEQUATE SUPPORT CONDITIONS, OR
 *      - ONE OR MORE INTERNAL MECHANISMS, OR
 *      ...
 *
 * Y la OAPI lo confirma pieza a pieza (`cli/muelles_etabs.py` sobre el `.EDB`):
 * de los 787 joints, **CERO tienen muelle de punto**, y las siete propiedades
 * que darían sujeción horizontal —«BALASTO H X-X», «BALASTO H Y-Y», los tres
 * «SPRINK», los dos «RESORTE SOTANO»— están **definidas y sin asignar**. Los
 * dos que sí se usan, `RESORTE EN VIGAS` (51 barras) y `BALASTO V` (12 áreas),
 * son los dos **verticales**.
 *
 * O sea: la cimentación de este edificio no tiene nada que la sujete en
 * horizontal, ni aquí ni en ETABS. **El importador no tiene la culpa y no hay
 * nada que arreglarle**: reproduce fielmente lo que el fichero dice.
 *
 * ## No resuelve, y ya se sabe por qué (medido troceando el modelo planta a
 * planta y luego por familia de elemento). Con el lector ya arreglado quedan
 * **9 nudos** sin llegar a un apoyo, y el mecanismo de verdad lo saca
 * `cli/modo_mecanismo.mjs` por regularización: apartando **216 nudos** el
 * modelo **resuelve sin regularizar**, con `Uz = -83.28 mm`. Un trozo suelto flota — sus 6 GDL por nudo
 * no los sujeta nadie— y la matriz sale singular. La planta baja sola, que no
 * tiene ninguno, sí resuelve.
 *
 * No es un fallo del solver: **en ETABS esos trozos sí están sujetos**, por
 * links, muelles de pilote y diafragmas, que este lector todavía no importa.
 * Ésa es exactamente la lista de lo que falta, y está a la vista en el panel
 * («📊 Lo que trae el fichero» → *trozos sin apoyo*), no escondida en un
 * comentario. Lo que este ejemplo sí demuestra es que el fichero entra ENTERO.
 *
 * De sus 79 áreas se montan 76. Una es un **polígono de seis lados**, que ETABS
 * admite y `hekatan-fem` no (tiene Q4 y T3); triangularla a ciegas daría
 * elementos volteados si no es convexa. Las otras dos no resuelven su
 * `AREAASSIGN`. El parser lo dice por consola con la causa: se pierden, pero no
 * en silencio.
 */
import { deform, analyze, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";
import { parseE2k, piezasFlotantes } from "../shared/e2kParser";
import { muellesDelModelo } from "../shared/e2kMuelles";
import { prepararAnalisis, reaccionVertical } from "../shared/e2kAnalisis";
// El `.e2k` va embebido como texto (ver `modelo.ts`): es el modelo, no un dato
// de entrada. Está
// recortado a los bloques que definen la ESTRUCTURA (se le quitaron los de
// diseño, las combinaciones y el log: 1621 KB → 233 KB) y anonimizado.
import { modeloE2k } from "./modelo";

export const estructuraMixta: ExampleDef = {
  id: "estructura-mixta",
  name: "🧬 Estructura mixta — hormigón + acero + CFT + madera (modelo real)",
  category: "4️⃣ Mixtos · 🏢 Edificios",
  defaultShellResult: "displacementZ",
  availableShellResults: [
    "none", "pressure",
    "membraneXX", "membraneYY", "membraneXY",
    "membranePrincipalMax", "membranePrincipalMin", "vonMises",
    "tranverseShearX", "tranverseShearY", "transverseShearMax",
    "bendingXX", "bendingYY", "bendingXY",
    "bendingPrincipalMax", "bendingPrincipalMin",
    "displacementX", "displacementY", "displacementZ",
  ],
  params: {
    // El modelo viene dado: no hay luces ni pisos que tocar. Lo único que se
    // ofrece es CÓMO mirarlo, y un factor para escalar sus cargas.
    fCarga: { default: 1.0, min: 0, max: 2, step: 0.05,
              label: "factor de carga", folder: "⬇ Cargas" },
    // El MODELO: con su cimentacion sobre balasto, o cortado por z = 0 y
    // empotrado ahi, que es lo que monta un calculista para mirar la
    // superestructura sin modelar el terreno.
    cimentacion: { default: 0, options: { "Con cimentación (balasto)": 0, "Sin cimentación (empotrado en z=0)": 1 },
                   label: "cimentación", folder: "⬇ Cargas" },
    // ⚠️ Por defecto NO se resuelve, y es a proposito.
    //
    // Este ejemplo esta aqui para demostrar la IMPORTACION: que un `.e2k` real
    // de ETABS entra entero —786 nudos, 746 barras, 76 areas, 15 materiales,
    // 90 secciones, con CFT, conformado en frio y madera— y se ve. El
    // ANALISIS es otra cosa y hoy no cierra: la matriz sale singular.
    //
    // Medido (2026-08-28), y NO es por falta de propiedades —las 746 barras
    // tienen area e inercia, incluidas las 54 del Section Designer—: el modelo
    // importado no queda del todo conectado. 311 de sus nudos tocan UNA sola
    // barra y nada mas, y 47 solo tocan cascaras. Un modelo de ETABS se cose
    // ademas con lo que el `.e2k` no trae o el lector aun no monta (muelles de
    // pilote, links, releases), y sin eso quedan trozos sueltos.
    //
    // Ponerlo en "Si" deja ver el aviso y el modelo igual: no se rompe nada,
    // simplemente no hay desplazamientos que pintar.
    resolver: { default: 0, options: { "Solo el modelo": 0, "Intentar resolver": 1 },
                label: "análisis", folder: "⬇ Cargas" },
  },
  // Lo que trae el fichero, y lo que le falta, en el propio panel. Un ejemplo
  // que no resuelve y no dice por qué es un ejemplo que engaña.
  computedLabels(_p, states) {
    const els = (states.elements?.val ?? []) as Element[];
    const nds = (states.nodes?.val ?? []) as Node[];
    const nB = els.filter((e) => e.length === 2).length;
    const sup = (states.nodeInputs?.val as any)?.supports;
    const fl = piezasFlotantes(els as unknown as number[][], sup);
    const zs = nds.map((n) => n[2]);
    return {
      "nudos · barras · cáscaras": `${nds.length} · ${nB} · ${els.length - nB}`,
      "cotas": nds.length ? `${Math.min(...zs).toFixed(2)} a ${Math.max(...zs).toFixed(2)} m` : "—",
      "resultado": (() => {
        const i = (states as any).__informeMixta;
        return i ? `Uz ${(i.uz * 1000).toFixed(2)} mm · equilibrio ${i.dif.toFixed(2)} %`
                 : "pon «Intentar resolver»";
      })(),
      "apartado para resolver": (() => {
        const i = (states as any).__informeMixta;
        return i ? `${i.podados} nudos sueltos + ${i.deMecanismos} de mecanismos` : "—";
      })(),
      "⚠ trozos sin apoyo": fl.nPiezasFlotantes
        ? `${fl.nPiezasFlotantes} trozos · ${fl.nNudosFlotantes} nudos → K singular`
        : "ninguno",
      "por qué": "en ETABS los sujetan links / muelles de pilote / diafragmas",
    };
  },
  build(p, states) {
    const m = parseE2k(modeloE2k);

    // El COSIDO, los MUELLES y el resto de la tuberia van dentro de
    // `prepararAnalisis` (ver mas abajo). Aqui solo se monta lo que hay que
    // DIBUJAR — que es el modelo entero, con sus trozos sueltos incluidos:
    // esconderlos seria enganar sobre lo que trae el fichero.
    // El parser ya devuelve todo en kN y m — el fichero va en KGF/M y la
    // conversión es suya, no de aquí.
    const muelles = muellesDelModelo(m);
    const nodes = m.nodes as Node[];
    const elements = m.elements as Element[];
    const ni: any = { ...m.nodeInputs };
    const ei: any = { ...m.elementInputs };

    if (p.fCarga !== 1 && ni.loads instanceof Map) {
      const esc = new Map<number, number[]>();
      for (const [i, v] of ni.loads) esc.set(i, v.map((x: number) => x * p.fCarga));
      ni.loads = esc;
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = ni;
    states.elementInputs.val = ei;
    states.objects3D.val = [];

    const nBarras = elements.filter(e => e.length === 2).length;
    const nShells = elements.length - nBarras;
    const zs = nodes.map(n => n[2]);
    if (muelles.informe.definidasSinUsar.length)
      console.warn(`[Estructura mixta] ⚠️ el .e2k DEFINE y no ASIGNA estos muelles: ` +
        `${muelles.informe.definidasSinUsar.join(", ")}. Los dos que sí asigna son ` +
        `verticales, así que la cimentación no tiene sujeción horizontal — y de ahí ` +
        `sale el mecanismo. No es del lector: es lo que trae el fichero.`);
    console.info(
      `[Estructura mixta] ${nodes.length} nudos · ${nBarras} barras · ${nShells} cáscaras · ` +
      `cotas ${Math.min(...zs).toFixed(2)} a ${Math.max(...zs).toFixed(2)} m · ` +
      `${m.materials.size} materiales · ${m.frameSections.size} secciones · ` +
      `leído de un .e2k en ${m.units.force}/${m.units.length}`);

    if (!p.resolver) return;

    // ── EL ANALISIS, por la MISMA tuberia que usa el CLI ──
    //
    // `prepararAnalisis` hace los cinco pasos —coser, muelles, coartar, podar
    // los trozos sueltos y apartar los mecanismos— y devuelve el modelo listo.
    // Va aqui y no escrito a mano a proposito: cuando esto vivia dos veces, el
    // CLI daba -10.75 mm y la app CERO, y entonces no se puede decir «Hekatan
    // da esto» porque depende de por donde entres.
    const { listo, informe } = prepararAnalisis(
      m,
      { cortarBajo: p.cimentacion ? 0 : undefined, podar: true, vueltasMecanismo: 6 },
      deform as any,
    );

    states.nodes.val = listo.nodes as unknown as Node[];
    states.elements.val = listo.elements as unknown as Element[];
    states.nodeInputs.val = listo.nodeInputs as any;
    states.elementInputs.val = listo.elementInputs as any;

    try {
      const d = deform(listo.nodes as any, listo.elements as any,
                       listo.nodeInputs as any, listo.elementInputs as any,
                       listo.muelles as any);
      states.deformOutputs.val = d;
      states.analyzeOutputs.val = analyze(listo.nodes as any, listo.elements as any,
                                          listo.elementInputs as any, d);
      const r = reaccionVertical(d, listo.muelles);
      const total = r.apoyos + r.muelles;
      const dif = Math.abs(total + informe.cargaZ);
      const esc = Math.max(Math.abs(total), Math.abs(informe.cargaZ), 1e-9);
      let uz = 0;
      for (const [, v] of (d?.deformations ?? [])) if (Math.abs(v[2]) > Math.abs(uz)) uz = v[2];
      console.info(
        `[Estructura mixta] ${p.cimentacion ? "SIN" : "CON"} cimentación · ` +
        `${informe.nudos} nudos · ${informe.barras} barras · ${informe.shells} cáscaras · ` +
        `${informe.apoyos} apoyos · ${informe.muelles} muelles` +
        (informe.empotrados ? ` · ${informe.empotrados} empotrados en z=0` : ""));
      console.info(
        `[Estructura mixta] apartados: ${informe.podados} nudos de trozos sueltos + ` +
        `${informe.deMecanismos} de mecanismos (${informe.vueltas} vueltas) · ` +
        `Uz máx ${(uz * 1000).toFixed(2)} mm`);
      console.info(
        `[Estructura mixta] equilibrio: carga ${informe.cargaZ.toFixed(1)} kN = ` +
        `apoyos ${r.apoyos.toFixed(1)} + muelles ${r.muelles.toFixed(1)} = ${total.toFixed(1)} kN · ` +
        `dif ${(100 * dif / esc).toFixed(2)} %`);
      (states as any).__informeMixta = { ...informe, uz, ...r, dif: 100 * dif / esc };
    } catch (e) {
      console.error("[Estructura mixta] el solver no cerró:", e);
    }
  },
};
