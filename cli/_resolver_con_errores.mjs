import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const m = await empaquetar(`export * from "${R}/examples/src/shared/e2kParser";\nexport * from "${R}/examples/src/shared/e2kAnalisis";\nexport { deform } from "${R}/hekatan-fem/src/index";\n`, "an");
const DL = "C:/Users/j-b-j/Downloads/";
for (const f of process.argv.slice(2)) {
  const logs = []; const ol = console.log, ow = console.warn, oe = console.error;
  console.log = (...a) => logs.push("L " + a.join(" ")); console.warn = (...a) => logs.push("W " + a.join(" ")); console.error = (...a) => logs.push("E " + a.join(" "));
  const res = { f: f.split("/").pop() };
  try {
    const mod = m.parseE2k(readFileSync(DL + f, "utf-8"));
    const s = [0, 0, 0]; for (const [, v] of mod.nodeInputs?.loads ?? []) for (let k = 0; k < 3; k++) s[k] += Math.abs(v[k] ?? 0);
    res.sumAbsF = s.map(v => +v.toFixed(3));
    const { listo, informe } = m.prepararAnalisis(mod, { podar: false, vueltasMecanismo: 0 }, m.deform);
    const s2 = [0, 0, 0]; for (const [, v] of listo.nodeInputs.loads ?? []) for (let k = 0; k < 3; k++) s2[k] += Math.abs(v[k] ?? 0);
    res.sumAbsF_listo = s2.map(v => +v.toFixed(3)); res.informe = informe;
    const out = m.deform(listo.nodes, listo.elements, listo.nodeInputs, listo.elementInputs, listo.muelles);
    let umax = 0; for (const [, u] of out.deformations) for (let k = 0; k < 3; k++) umax = Math.max(umax, Math.abs(u[k]));
    res.umax_mm = umax * 1000; res.nDef = out.deformations.size;
  } catch (e) { res.error = String(e?.message || e).slice(0, 200); }
  console.log = ol; console.warn = ow; console.error = oe;
  res.logs = logs.filter(s => !/^L \[e2kParser\] (peso propio|cargas)/.test(s)).map(s => s.slice(0, 170)).slice(0, 8);
  console.log(JSON.stringify(res));
}
