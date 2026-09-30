/**
 * La placa de Auricchio-Taylor en la APP: abre el CLI, resuelve la placa 4×4 apoyada (t 0.2, malla 8×8) con
 * `shelltype auricchio` y con la de siempre, y lee la flecha. Esperado: −0.715679 mm (= Python/FEAPpv) y
 * −0.699800 mm (MITC4 + Wilson).      node cli/ctl_placa_auricchio.mjs [--base URL]
 */
import puppeteer from "puppeteer";
const i = process.argv.indexOf("--base");
const BASE = i >= 0 ? process.argv[i + 1] : "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const heks = (form) => { const A = 4, N = 8, L = []; const id = (i, j) => i * (N + 1) + j + 1;
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) L.push(`node ${id(i, j)} ${i * A / N} ${j * A / N} 0`);
  let ns = 0; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { ns++; L.push(`shell ${ns} ${id(i, j)} ${id(i + 1, j)} ${id(i + 1, j + 1)} ${id(i, j + 1)} 0.2 22000000 0.2 0`, `areaload ${ns} -10`); if (form) L.push(`shelltype ${ns} ${form}`); }
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) if (i === 0 || i === N || j === 0 || j === N) L.push(`support ${id(i, j)} 0 0 1 0 0 0`);
  L.push(`support ${id(0, 0)} 1 1 1 0 0 1`, `support ${id(N, 0)} 0 1 1 0 0 1`, "solve"); return L.join("\n"); };
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); const errores = []; pag.on("pageerror", (e) => errores.push(String(e)));
await pag.goto(`${BASE}/workspace/?t=cli-modeler`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 3000));
const res = {};
for (const form of ["auricchio", ""]) {
  res[form || "thick"] = await pag.evaluate(async (txt) => { window.__hekatanCliScript = txt; window.__hekatanRebuild?.();
    await new Promise((r) => setTimeout(r, 2500)); let w = 0; window.__hekatanStates.deformOutputs.val.deformations.forEach((d) => { w = Math.min(w, d[2]); });
    return { w: w * 1000, err: (window.__hekatanCliErrors ?? []).length }; }, heks(form));
}
await nav.close();
console.log(JSON.stringify(res), "errores de página", errores.length);
const ok = Math.abs(res.auricchio.w + 0.715679) < 1e-5 && Math.abs(res.thick.w + 0.6998) < 1e-4 && !errores.length && !res.auricchio.err;
console.log(ok ? "OK: auricchio = Python (FEAPpv), thick sin cambio" : "FALLA"); process.exit(ok ? 0 : 1);
