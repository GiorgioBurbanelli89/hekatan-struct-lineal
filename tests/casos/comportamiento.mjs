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
  return filas;
}
