import { empaquetar, R } from "../tests/lib/bundle.mjs";
const EJ = { "13-1": "benchmarkPaz13_1", "10-7": "benchmarkPaz10_7", "4-1": "benchmarkPaz4_1", "6-1": "benchmarkPaz6_1", "7-1": "benchmarkPaz7_1", "8-1": "benchmarkPaz8_1", "9-3": "benchmarkPaz9_3" };
const src = Object.entries(EJ).map(([k, n]) => `export { ${n} } from "${R}/examples/src/benchmark-paz-${k}/${n}";`).join("\n") +
  `\nexport { modalAnalysis, modalAnalysisPaz } from "${R}/hekatan-fem/src/index";\n`;
globalThis.window = globalThis; globalThis.document = { createElement: () => ({ style: {}, getContext: () => null, appendChild() {}, addEventListener() {} }), body: { appendChild() {} }, querySelector: () => null };
const m = await empaquetar(src, "pazej" + Date.now());
const v = (x) => ({ val: x });
for (const [k, n] of Object.entries(EJ)) {
  const ex = m[n]; const p = {};
  for (const [key, d] of Object.entries(ex.params)) p[key] = d.default;
  p.showTH = +(process.env.TH ?? 0); p.exportE2k = 0;
  const st = { nodes: v([]), elements: v([]), nodeInputs: v({}), elementInputs: v({}), deformOutputs: v({}), analyzeOutputs: v({}), objects3D: v([]) };
  const log = console.log; let rep = ""; console.log = (...a) => { rep += a.join(" ") + "\n"; };
  try { ex.build(p, st); } catch (e) { rep += "ERR " + e.message; }
  console.log = log;
  const out = (k === "13-1" || k === "10-7" ? m.modalAnalysisPaz : m.modalAnalysis)(st.nodes.val, st.elements.val, st.nodeInputs.val, st.elementInputs.val, 4);
  log(`== ${k}: modal 3D f(Hz) = ${out.frequencies.slice(0, 4).map((f) => f.toFixed(4)).join(" ")}`);
  log(rep.split("\n").filter((l) => /f1|f2|f=|T=|ω|omega|u_max|u1|u2|libro/i.test(l)).slice(0, 8).join("\n"));
}
