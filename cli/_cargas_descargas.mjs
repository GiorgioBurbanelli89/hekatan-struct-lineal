import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const m = await empaquetar(`export * from "${R}/examples/src/shared/e2kParser";\n`, "c");
const DL = "C:/Users/j-b-j/Downloads/";
for (const f of ["Telegram Desktop/CIMENTACION_MDP-P3P4-EME-MDL-24-101.e2k", "Telegram Desktop/EXPORTADO_PEDESTAL_MDP-P3P4-EME-MDL-24-101-REVB.e2k", "Telegram Desktop/IFC_DORIS_V02.PEDESTAL_MDP-P3P4-EME-MDL-24-104-C.e2k", "Telegram Desktop/Analisis modal 1 piso concreto.e2k", "slab_plate6x4.e2k", "benchmark-cft-cantilever_1778266884989.e2k"]) {
  const ol = console.log, ow = console.warn; console.log = () => {}; console.warn = () => {};
  const r = m.parseE2k(readFileSync(DL + f, "utf-8"));
  console.log = ol; console.warn = ow;
  const L = r.nodeInputs?.loads ?? new Map(); let fz = 0; for (const [, v] of L) fz += v[2] ?? 0;
  const txt = readFileSync(DL + f, "utf-8");
  console.log(JSON.stringify({ f: f.split("/").pop(), cargasNodales: L.size, sumFz: +fz.toFixed(3), pointload: (txt.match(/^\s*POINTLOAD/gm) || []).length, frameload: (txt.match(/^\s*LINELOAD/gm) || []).length, areaload: (txt.match(/^\s*AREALOAD/gm) || []).length, selfweight: (txt.match(/SELFWEIGHT\s+1/g) || []).length, patrones: Object.keys(r.loadPatterns ?? {}).length || (r.loadCases?.length ?? "?") }));
}
