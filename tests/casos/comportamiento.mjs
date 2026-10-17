/**
 * `comportamiento etabs|sap2000|safe` (16-oct-2026): la lista «Comportamiento» del panel .heks pone de una vez
 * las reglas POR DEFECTO de cada programa (cliModeler.ts, aplicarComportamiento).
 *
 * Juez: ETABS 22.6 con la rampa sobre el muro (la misma de e2k-rampa-muro-etabs). Las demas filas comprueban
 * que la directiva es EXACTAMENTE la suma de las directivas sueltas que reemplaza (no otro modelo).
 * El TACNA (modelo privado, fuera del repo) contra SAP2000 se midio aparte: registros/TACNA_e2k_struct_vs_etabs.md.
 */
import { empaquetar, R } from "../lib/bundle.mjs";
import { resolverHeks } from "../lib/heks.mjs";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { E2K_RAMPA, ETABS_RAMPA } from "./e2k_rampa_muro_etabs.mjs";

export const nombre = "comportamiento";
export const descripcion = "lista Comportamiento: ETABS / SAP2000 / SAFE por defecto con una sola directiva";

export async function correr() {
  const { e2kAHeks } = await empaquetar(`export { e2kAHeks } from "${R}/examples/src/shared/e2kAHeks";\n`, "compHeks");
  const base = e2kAHeks(E2K_RAMPA, "rampa.e2k").heks.split(/\r?\n/)
    .filter((l) => !/^load /.test(l) || / EMPUJE$/.test(l));
  const dir = mkdtempSync(join(tmpdir(), "hkComp-"));
  let n = 0;
  const resolver = async (lineas) => {
    const ruta = join(dir, `m${n++}.heks`);
    writeFileSync(ruta, lineas.join("\n"));
    delete globalThis.__hekatanFactoresPatron;
    const r = await resolverHeks(ruta);
    return r;
  };
  const esquina = (r) => {
    const i = r.nodes.findIndex((p) => Math.abs(p[0] - 1.2) < 1e-3 && Math.abs(p[1] - 3) < 1e-3 && Math.abs(p[2] - 3) < 1e-3);
    return (r.deformOutputs.deformations.get(i) ?? [NaN, NaN, NaN]).slice(0, 3).map((v) => v * 1000);
  };
  const todos = (r) => [...r.deformOutputs.deformations.values()].flatMap((v) => v.slice(0, 6));
  const difRel = (a, b) => {
    const mx = Math.max(...a.map(Math.abs), 1e-30);
    return Math.max(...a.map((v, k) => Math.abs(v - b[k]))) / mx * 100;
  };
  const filas = [];

  // 1. ETABS: el juez
  const rE = await resolver(["comportamiento etabs", ...base]);
  const uE = esquina(rE), e = ETABS_RAMPA["[1.2, 3.0, 3.0]"];
  const dE = Math.hypot(...uE.map((v, k) => v - e[k])) / Math.hypot(...e) * 100;
  filas.push({ que: "comportamiento etabs: esquina libre de la rampa vs ETABS", medido: dE, limite: 5, ok: dE < 5,
    detalle: `Struct ${uE.map((v) => v.toFixed(4)).join(" ")} · ETABS ${e.map((v) => v.toFixed(4)).join(" ")}` });

  // 2. ETABS = las directivas sueltas que reemplaza
  const sueltasE = ["etabsjoint 1", "deck etabs", "edge muros", "meshcross 1", "rigidzone auto 0"];
  const rE2 = await resolver([...sueltasE, ...base.filter((l) => !/^(edge|deck|etabsjoint|meshcross|rigidzone)\b/.test(l))]);
  const d2 = difRel(todos(rE), todos(rE2));
  filas.push({ que: "comportamiento etabs = sus directivas sueltas", medido: d2, limite: 1e-9, ok: d2 < 1e-9, detalle: sueltasE.join(" · ") });

  // 3. SAFE = torsion safe (la rampa conserva su atadura: SAFE no toca eso)
  const rS = await resolver(["comportamiento safe", ...base]);
  const rS2 = await resolver(["torsion safe", ...base]);
  const d3 = difRel(todos(rS), todos(rS2));
  filas.push({ que: "comportamiento safe = torsion safe (J×0.1)", medido: d3, limite: 1e-9, ok: d3 < 1e-9 });

  // 4. SAP2000 quita la atadura: la rampa queda colgando de un nudo (mecanismo), como en SAP sin edge constraint
  const rP = await resolver(["comportamiento sap2000", ...base]);
  const uP = esquina(rP), libre = uP.every((v) => Math.abs(v) < 100);
  filas.push({ que: "comportamiento sap2000: sin atadura de aristas", crudo: true, medido: libre ? "atada" : "suelta", limite: "suelta",
    ok: !libre, detalle: "SAP2000 por defecto no cose el nudo a mitad de arista" });
  // 5-7. TAL CUAL (16-oct-2026): el modelo pasa con las reglas de su programa de origen salvo que se elija otra
  const hk = e2kAHeks(E2K_RAMPA, "rampa.e2k").heks;
  const conOrigen = /^origen etabs$/m.test(hk);
  filas.push({ que: "importar un .e2k deja `origen etabs` en el .heks", crudo: true, medido: conOrigen ? "si" : "no", limite: "si", ok: conOrigen });
  const { aS2k, aE2k } = await empaquetar(`
const g = globalThis; g.window = g;
const nodo = () => ({ style:{}, appendChild(){}, setAttribute(){}, addEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, getContext:()=>null, querySelector:()=>null, querySelectorAll:()=>[], remove(){} });
g.document = g.document ?? { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
const { cliModeler } = await import("${R}/examples/src/cli-modeler/cliModeler");
const { exportS2k } = await import("${R}/examples/src/shared/s2kExporter");
const { exportE2k } = await import("${R}/examples/src/shared/e2kExporter");
export function aS2k(texto) {
  const st = (v) => ({ val: v });
  const s = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
  globalThis.window.__hekatanCliScript = texto;
  cliModeler.build({}, s);
  return exportS2k({ nodes: s.nodes.val, elements: s.elements.val, nodeInputs: s.nodeInputs.val, elementInputs: s.elementInputs.val, title: "t" });
}
export function aE2k(texto) {
  const st = (v) => ({ val: v });
  const s = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
  globalThis.window.__hekatanCliScript = texto;
  cliModeler.build({}, s);
  return exportE2k({ nodes: s.nodes.val, elements: s.elements.val, nodeInputs: s.nodeInputs.val, elementInputs: s.elementInputs.val, title: "t", weightMode: "manual" });
}`, "compS2k");
  const s2kTal = aS2k(hk), s2kSap = aS2k(["comportamiento sap2000", hk].join("\n"));
  const atadoTal = /AREA EDGE CONSTRAINT ASSIGNMENTS/.test(s2kTal), atadoSap = /AREA EDGE CONSTRAINT ASSIGNMENTS/.test(s2kSap);
  filas.push({ que: "tal cual (origen ETABS) → .s2k con la atadura de aristas de ETABS", crudo: true, medido: atadoTal ? "si" : "no", limite: "si", ok: atadoTal,
    detalle: "TACNA medido: SAP2000 8.863 mm, ETABS 8.482 (la diferencia: unión viga-muro de ETABS)" });
  filas.push({ que: "eligiendo SAP2000 por defecto → .s2k sin atadura", crudo: true, medido: atadoSap ? "si" : "no", limite: "no", ok: !atadoSap });
  // 8-9. tipo de objeto (17-oct-2026): la rampa inclinada es PANEL en el e2k; como FLOOR ETABS la conecta de otra forma
  // (TACNA: UY del techo +5.8 %; con PANEL −0.15 % del original)
  const conTipo = /^tipoarea \d+ PANEL$/m.test(hk);
  filas.push({ que: "la rampa inclinada lleva `tipoarea … PANEL` en el .heks", crudo: true, medido: conTipo ? "si" : "no", limite: "si", ok: conTipo });
  const e2k = aE2k(hk);
  const panelInclinado = e2k.split(String.fromCharCode(10)).some((l) => /AREA "[^"]+"\s+PANEL\s+4/.test(l) && new Set(l.match(/"[^"]+"/g).slice(1)).size === 4);
  filas.push({ que: "el .e2k devuelve la rampa como PANEL (4 puntos distintos)", crudo: true, medido: panelInclinado ? "si" : "no", limite: "si", ok: !!panelInclinado });
  return filas;
}
