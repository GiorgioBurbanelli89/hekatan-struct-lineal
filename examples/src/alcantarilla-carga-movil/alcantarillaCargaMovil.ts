/**
 * «Alcantarilla cajón con carga móvil HL-93» — ejemplo y plantilla.
 *
 * El modelo se ESCRIBE como .heks (`modeloAlcantarilla.ts`) y se resuelve con `cliModeler`: el
 * mismo lector y el mismo solver de los .heks validados contra SAP2000. La carga móvil va
 * aparte, por líneas de influencia (`shared/cargaMovil.ts`), y se enseña con el animador de
 * carga móvil (`shared/animadorCargaMovil.ts`), que es otro modo del visor, no el modal.
 *
 * Dos entradas en el registro:
 *   · el EJEMPLO: las medidas del vídeo de referencia (2 celdas de 9.5 × 6 m), abre calculado y
 *     animando;
 *   · la PLANTILLA: una alcantarilla corriente (2 celdas de 3.0 × 2.5 m, 0.30 m) para poner
 *     tus datos.
 * Unidades: kN y m por dentro; E en kgf/cm², ks en kgf/cm³ (como se piden en Ecuador).
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import { cliModeler } from "../cli-modeler/cliModeler";
import { activeExampleVersion } from "../workspace/exampleVersion";
import { modeloAlcantarilla, type ParamsAlcantarilla } from "./modeloAlcantarilla";
import {
  camionHL93, caminoPorCoordenada, lineasDeInfluencia, posiciones, envolvente, separacionesHL93,
  respuestaFija, casosPorPosicion, HL93, type ModeloLineal, type Vehiculo, type Camino,
} from "../shared/cargaMovil";
import { crearAnimadorCargaMovil, cerrarCargaMovil } from "../shared/animadorCargaMovil";
import { currentLang } from "../shared/i18n";
import { exportS2k } from "../shared/s2kExporter";
import { exportE2k } from "../shared/e2kExporter";

const t = (es: string, en: string) => (currentLang() === "en" ? en : es);
const KGFCM2 = 98.0665;          // kgf/cm² → kN/m²
const KGFCM3 = 9806.65;          // kgf/cm³ → kN/m³
const W = (typeof window !== "undefined" ? window : globalThis) as any;

const P = (folder: string, label: string, def: number, min: number, max: number, step: number, description?: string) =>
  ({ default: def, min, max, step, label, folder, description });

function params(def: { nC: number; L: number; H: number; tS: number; tI: number; tM: number; ks: number; paso: number }) {
  return {
    nCeldas: { ...P("Geometría", "N.º de celdas", def.nC, 1, 4, 1), regenOnChange: false },
    L: P("Geometría", "Luz de cada celda, a ejes (m)", def.L, 1.5, 12, 0.1, "Distancia entre ejes de muros. Múltiplo del paso del tablero."),
    H: P("Geometría", "Alto, a ejes (m)", def.H, 1.0, 8, 0.1),
    tSup: P("Geometría", "Espesor losa superior (m)", def.tS, 0.15, 1.0, 0.01),
    tInf: P("Geometría", "Espesor losa inferior (m)", def.tI, 0.15, 1.0, 0.01),
    tMuro: P("Geometría", "Espesor muros (m)", def.tM, 0.15, 1.0, 0.01),
    Ekg: P("Material y suelo", "E hormigón (kgf/cm²)", 250000, 100000, 400000, 1000),
    nu: P("Material y suelo", "ν", 0.2, 0, 0.3, 0.01),
    kskg: P("Material y suelo", "ks balasto (kgf/cm³)", def.ks, 0.3, 20, 0.1, "Módulo de balasto vertical. 1 kgf/cm³ = 9806.65 kN/m³."),
    hRel: P("Relleno", "Relleno encima (m)", 0, 0, 5, 0.1, "Carga permanente γ·h sobre la losa superior (sin reparto del camión por el relleno)."),
    gRel: P("Relleno", "γ relleno (kN/m³)", 19, 14, 22, 0.5),
    sep2: P("Camión HL-93", "Separación trasera (m)", HL93.sepTraseraMin, HL93.sepTraseraMin, HL93.sepTraseraMax, 0.1, "AASHTO: 4.3 a 9.0 m. La de la animación."),
    varSep: { default: 1, boolean: true, label: "Envolvente: probar 4.3–9.0 m", folder: "Camión HL-93" },
    IM: P("Camión HL-93", "IM factor dinámico (%)", 0, 0, 75, 1, "Solo a los ejes (CSI Analysis Reference, p. 515)."),
    ancho: P("Camión HL-93", "Ancho de reparto (m)", 1, 0.5, 6, 0.05, "Las cargas se dividen por este ancho para dar kN por metro de franja. 1 = sin reparto."),
    carril: { default: 1, boolean: true, label: "Carga de carril 9.3 kN/m en la envolvente", folder: "Camión HL-93" },
    paso: { default: def.paso, options: { "0.10 m": 0.1, "0.05 m": 0.05 }, label: "Paso del camión = malla del tablero", folder: "Malla" },
    dxInf: P("Malla", "Malla losa inferior y muros (m)", 0.5, 0.1, 1.0, 0.05),
  } as Record<string, any>;
}

function aModelo(p: Record<string, number>): ParamsAlcantarilla {
  return {
    nCeldas: Math.round(p.nCeldas), L: p.L, H: p.H, tSup: p.tSup, tInf: p.tInf, tMuro: p.tMuro,
    E: p.Ekg * KGFCM2, nu: p.nu, ks: p.kskg * KGFCM3, dx: p.paso || 0.1, dxInf: p.dxInf,
    hRelleno: p.hRel, gRelleno: p.gRel,
  };
}

let turno = 0;
let ultimaVersion = -1;   // para encuadrar la cámara solo al abrir el ejemplo, no al mover un slider
const esperar = () => new Promise<void>((r) => setTimeout(r, 0));

function descargar(texto: string, nombre: string, tipo = "text/plain") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([texto], { type: tipo }));
  a.download = nombre; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/** OpenSeesPy 2D (ndm 2, ndf 3): el mismo pórtico, muelles como zeroLength, un caso por posición. */
export function openseesCargaMovil(m: ModeloLineal, cam: Camino, v: Vehiculo, xs: number[], E: number, nu: number): string {
  const L: string[] = [];
  const casos = casosPorPosicion(cam, v, xs);
  L.push("# OpenSeesPy — alcantarilla cajón con carga móvil HL-93 (exportado desde Hekatan Struct)");
  L.push("# 2D (ndm 2, ndf 3): X horizontal, Y del script = Z de Hekatan. Unidades kN, m.");
  L.push("# Barras elasticTimoshenkoBeam (As = 5/6·A, como SAP2000 en un rectángulo). Un análisis por posición.");
  L.push("import json, openseespy.opensees as ops");
  L.push(`E, G = ${E}, ${E / (2 * (1 + nu))}`);
  L.push("def modelo():");
  L.push("    ops.wipe(); ops.model('basic', '-ndm', 2, '-ndf', 3)");
  m.nodes.forEach((n, i) => L.push(`    ops.node(${i + 1}, ${n[0]}, ${n[2]})`));
  L.push("    ops.geomTransf('Linear', 1)");
  m.elements.forEach((el, e) => {
    const A = m.elementInputs.areas.get(e), I = m.elementInputs.momentsOfInertiaZ.get(e);
    L.push(`    ops.element('ElasticTimoshenkoBeam', ${e + 1}, ${el[0] + 1}, ${el[1] + 1}, E, G, ${A}, ${I}, ${A * 5 / 6}, 1)`);
  });
  L.push("    ops.uniaxialMaterial('Elastic', 1, 1.0)");
  (m.springs ?? []).forEach((s, k) => {
    const n = m.nodes[s.node];
    L.push(`    ops.node(${100000 + k}, ${n[0]}, ${n[2]}); ops.fix(${100000 + k}, 1, 1, 1)`);
    L.push(`    ops.uniaxialMaterial('Elastic', ${1000 + k}, ${s.k})`);
    L.push(`    ops.element('zeroLength', ${100000 + k}, ${100000 + k}, ${s.node + 1}, '-mat', ${1000 + k}, '-dir', 2)`);
  });
  m.nodeInputs.supports?.forEach((sup: boolean[], n: number) => { if (sup[0]) L.push(`    ops.fix(${n + 1}, 1, 0, 0)`); });
  L.push(`casos = ${JSON.stringify(casos.map((c) => ({ n: c.nombre, x: c.xF, c: c.cargas.map(([nd, P]) => [nd + 1, P]) })))}`);
  L.push("res = {}");
  L.push("for caso in casos:");
  L.push("    modelo(); ops.timeSeries('Linear', 1); ops.pattern('Plain', 1, 1)");
  L.push("    for nd, P in caso['c']: ops.load(nd, 0.0, -P, 0.0)");
  L.push("    ops.system('BandGeneral'); ops.numberer('RCM'); ops.constraints('Plain'); ops.integrator('LoadControl', 1.0)");
  L.push("    ops.algorithm('Linear'); ops.analysis('Static'); ops.analyze(1)");
  L.push(`    U = [ops.nodeDisp(i + 1) for i in range(${m.nodes.length})]`);
  L.push(`    F = [ops.eleResponse(e + 1, 'localForce') for e in range(${m.elements.length})]`);
  L.push("    res[caso['n']] = {'x': caso['x'], 'U': U, 'F': F}");
  L.push("json.dump(res, open('opensees_carga_movil.json', 'w'))");
  L.push("print('OK', len(res), 'posiciones')");
  return L.join("\n") + "\n";
}

function crear(id: string, name: string, def: Parameters<typeof params>[0], guia: string[]): ExampleDef {
  return {
    id, name,
    category: "1️⃣ Frames · 🚚 Carga móvil y puentes",
    params: params(def),
    guide: guia,
    viewFrom: [0.3, -1, 0.3],
    defaultFrameResult: "none",
    availableShellResults: ["none"],
    build(p: any, states: any, mp: any) {
      cerrarCargaMovil();
      const miTurno = ++turno;
      const version = activeExampleVersion.v;
      const pm = aModelo(p);
      const g = modeloAlcantarilla(pm);
      W.__hekatanCliScript = g.heks;
      cliModeler.build({}, states, mp);
      const vigente = () => miTurno === turno && activeExampleVersion.v === version;
      const primera = version !== ultimaVersion; ultimaVersion = version;
      setTimeout(async () => {
        // sin navegador (tests en Node) no hay visor que animar: el modelo ya quedó armado
        if (!vigente() || typeof document === "undefined" || typeof requestAnimationFrame === "undefined") return;
        const nodes = states.nodes.rawVal ?? states.nodes.val;
        const elements = states.elements.rawVal ?? states.elements.val;
        const nodeInputs = states.nodeInputs.rawVal ?? states.nodeInputs.val;
        const elementInputs = states.elementInputs.rawVal ?? states.elementInputs.val;
        const springs = (W.__hekatanCliSprings ?? []) as Array<{ node: number; dof: number; k: number }>;
        const modelo: ModeloLineal = { nodes, elements, nodeInputs, elementInputs, springs };
        const cam = caminoPorCoordenada(nodes, (n) => Math.abs(n[2] - pm.H) < 1e-6);
        const veh = camionHL93({ sepTrasera: p.sep2, IM: p.IM, ancho: p.ancho, conCarril: !!p.carril });
        const xs = posiciones(cam, veh, pm.dx);
        const anim = crearAnimadorCargaMovil(vigente);
        anim.progreso(t("Líneas de influencia:", "Influence lines:"), 0);
        const IL = await lineasDeInfluencia(modelo, cam, { progreso: async (f) => { anim.progreso(t("Líneas de influencia:", "Influence lines:"), f); await esperar(); } });
        if (!vigente()) { anim.dispose(); return; }
        const fija = g.relleno.size ? respuestaFija(modelo, new Map([...g.relleno].map(([id, P]) => [nodes.findIndex((n: number[]) => {
          const c = g.nudos.get(id)!; return Math.abs(n[0] - c[0]) < 1e-9 && Math.abs(n[2] - c[2]) < 1e-9;
        }), [0, 0, -P, 0, 0, 0]]))) : null;
        const idxElem = (e: number) => {
          const el = elements[e]; const a = nodes[el[0]], b = nodes[el[1]];
          if (Math.abs(a[0] - b[0]) < 1e-9) return pm.tMuro;
          return Math.abs(a[2] - pm.H) < 1e-6 ? pm.tSup : pm.tInf;
        };
        // dibujo a caras: el muro de cara a cara de losa, la losa hasta la cara exterior del muro
        const largo = pm.nCeldas * pm.L;
        const extremos = (e: number): [number, number] => {
          const el = elements[e]; const a = nodes[el[0]], b = nodes[el[1]];
          if (Math.abs(a[0] - b[0]) < 1e-9) return [a[2] < 1e-9 ? -pm.tInf / 2 : 0, b[2] > pm.H - 1e-9 ? -pm.tSup / 2 : 0];
          return [a[0] < 1e-9 ? pm.tMuro / 2 : 0, b[0] > largo - 1e-9 ? pm.tMuro / 2 : 0];
        };
        const exportar = [
          { etiqueta: "SAP2000 .s2k", accion: () => exportarS2k(states, modelo, cam, veh, xs, id) },
          { etiqueta: "ETABS .e2k", accion: () => exportarE2k(states, id) },
          { etiqueta: "OpenSeesPy .py", accion: () => descargar(openseesCargaMovil(modelo, cam, veh, xs, pm.E, pm.nu), `${id}_opensees.py`, "text/x-python") },
          { etiqueta: t("Envolvente .csv", "Envelope .csv"), accion: () => env && descargar(csvEnvolvente(), `${id}_envolvente.csv`, "text/csv") },
        ];
        let env: ReturnType<typeof envolvente> | null = null;
        const csvEnvolvente = () => {
          const f = ["barra,xi,zi,xj,zj,M3i_max,M3i_min,M3j_max,M3j_min,V2i_max,V2i_min,V2j_max,V2j_min,Pi_max,Pi_min (kN, kN·m)"];
          elements.forEach((el: number[], e: number) => {
            const a = nodes[el[0]], b = nodes[el[1]], k = e * 6;
            f.push([e + 1, a[0], a[2], b[0], b[2], env!.Fmax[k + 4], env!.Fmin[k + 4], env!.Fmax[k + 5], env!.Fmin[k + 5],
              env!.Fmax[k + 2], env!.Fmin[k + 2], env!.Fmax[k + 3], env!.Fmin[k + 3], env!.Fmax[k], env!.Fmin[k]].map((x) => +(+x).toFixed(6)).join(","));
          });
          return f.join("\n") + "\n";
        };
        anim.cargar({
          nodes, elements, IL, vehiculo: veh, xs, fija, canto: idxElem, zRodadura: pm.H + pm.tSup / 2 + (pm.hRelleno || 0), extremos, x0: nodes[cam.nudos[0]][0],
          titulo: `${t("Alcantarilla", "Box culvert")} ${pm.nCeldas}×${pm.L} m × ${pm.H} m · ${veh.nombre}`,
          exportar,
          encuadrar: primera,
          notas: [
            t("Franja de 1 m, dibujada con 3 m de fondo para verla. Suelo lineal (Winkler).", "1 m strip, drawn 3 m deep to be seen. Linear soil (Winkler)."),
            t(`Camión y carril: ${HL93.fuente}.`, `Truck and lane: ${HL93.fuente}.`),
            ...g.avisos,
          ],
        });
        await esperar();
        if (!vigente()) return;
        env = envolvente(IL, veh, xs, {
          carril: !!p.carril,
          separacionesTraseras: p.varSep ? separacionesHL93(0.1) : undefined,
          vehiculoCon: (s) => camionHL93({ sepTrasera: s, IM: p.IM, ancho: p.ancho, conCarril: !!p.carril }),
        });
        if (!vigente()) return;
        anim.ponerEnvolvente(env);
        W.__hekatanCargaMovilDatos = { IL, env, xs, veh, cam, modelo };
      }, 30);
    },
  } as ExampleDef;
}

function exportarS2k(states: any, m: ModeloLineal, cam: Camino, v: Vehiculo, xs: number[], id: string) {
  {
    const casos = casosPorPosicion(cam, v, xs);
    const cargasPorPatron: Record<string, Map<number, number[]>> = {};
    for (const c of casos) cargasPorPatron[c.nombre] = new Map(c.cargas.map(([n, P]) => [n, [0, 0, -P, 0, 0, 0]]));
    const ni = { ...states.nodeInputs.rawVal, cargasPorPatron };
    const texto = exportS2k({
      nodes: m.nodes as any, elements: m.elements as any, nodeInputs: ni, elementInputs: { ...m.elementInputs, frameLoadsPorPatron: {} },
      title: `Alcantarilla + HL-93 (${casos.length} posiciones) — Hekatan`, patrones: true,
    });
    descargar(texto, `${id}_${casos.length}pos.s2k`);
  }
}

function exportarE2k(states: any, id: string) {
  {
    const texto = exportE2k({
      nodes: states.nodes.rawVal, elements: states.elements.rawVal, nodeInputs: states.nodeInputs.rawVal,
      elementInputs: states.elementInputs.rawVal, title: "Alcantarilla — Hekatan",
    } as any);
    descargar(texto, `${id}.e2k`);
  }
}

export const alcantarillaCargaMovil = crear(
  "alcantarilla-carga-movil",
  "Alcantarilla cajón con carga móvil HL-93",
  { nC: 2, L: 9.5, H: 6.0, tS: 0.50, tI: 0.55, tM: 0.45, ks: 2.0, paso: 0.1 },
  [
    "Abre calculada: el camión HL-93 cruza la losa superior paso a paso.",
    "Colores = desplazamiento |u| (escala fija para todo el recorrido). Rojo/azul = momento M3.",
    "Al final de la pasada se ven las envolventes (camión + carril).",
    "Exporta a SAP2000 (un caso por posición), ETABS y OpenSeesPy desde la ventana 🚚.",
  ],
);

export const plantillaAlcantarilla = crear(
  "plantilla-alcantarilla-carga-movil",
  "Plantilla · Alcantarilla cajón + carga móvil (tus datos)",
  { nC: 2, L: 3.0, H: 2.5, tS: 0.30, tI: 0.30, tM: 0.30, ks: 2.0, paso: 0.1 },
  [
    "Pon tus celdas, luces, espesores y el balasto ks.",
    "El paso del camión es la malla del tablero: los ejes caen siempre en nudo.",
    "Ancho de reparto = el de tu norma (AASHTO para alcantarillas); 1 m = sin reparto.",
  ],
);
