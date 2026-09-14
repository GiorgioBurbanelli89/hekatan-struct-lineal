// ¿Combo usa SOLO la combinación? Flecha máxima por caso y por combo en el deploy público.
import puppeteer from "puppeteer";
const U = process.argv[2] || "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?m=7nF68EUiy5UVJuli";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 950 });
await p.goto(U, { waitUntil: "domcontentloaded", timeout: 120000 });
await new Promise(r => setTimeout(r, 20000));
const poner = (label, texto) => p.evaluate((label, texto) => {
  const f = [...document.querySelectorAll("#settings .tp-lblv")].find(e => e.querySelector(".tp-lblv_l")?.textContent.trim() === label);
  const s = f?.querySelector("select"); if (!s) return "no hay " + label + " (hay: " + [...document.querySelectorAll("#settings .tp-lblv_l")].map(x => x.textContent.trim()).filter(t => /Result|Case|Combo|Modo/.test(t)).join(",") + ")";
  const o = [...s.options].find(o => o.textContent.replace(/\s+/g, " ").trim() === texto) || [...s.options].find(o => o.textContent.includes(texto));
  if (!o) return "no hay opcion " + texto + " en " + [...s.options].map(o => o.textContent.trim()).join("|");
  s.value = o.value; s.dispatchEvent(new Event("change", { bubbles: true })); return o.textContent.trim();
}, label, texto);
const medir = () => p.evaluate(() => {
  const st = window.__hekatanStates; const U = st?.deformOutputs?.val?.deformations;
  let uz = 0, ux = 0, n = 0; U?.forEach(d => { n++; if (Math.abs(d[2]) > Math.abs(uz)) uz = d[2]; if (Math.abs(d[0]) > Math.abs(ux)) ux = d[0]; });
  const L = st?.nodeInputs?.val?.loads; let fz = 0; L?.forEach(v => fz += v[2] ?? 0);
  return { uz_mm: +(uz * 1000).toFixed(5), ux_mm: +(ux * 1000).toFixed(5), sumFz: +fz.toFixed(3), nudos: n };
});
const res = {};
for (const [lab, txt] of [["Resultado", "Case"], ["Case", "Dead"], ["Case", "Live"], ["Resultado", "Combo"], ["Combo", "Servicio D+L"], ["Combo", "1.4D"], ["Combo", "1.2D+1.6L"]]) {
  const r = await poner(lab, txt); await new Promise(r => setTimeout(r, 4000));
  const m = await medir(); console.log(JSON.stringify({ puse: `${lab}=${r}`, ...m }));
  if (lab !== "Resultado") res[txt] = m;
}
const D = res["Dead"], L = res["Live"];
if (D && L) {
  const chk = (nombre, esperado) => { const m = res[nombre]; if (m) console.log(JSON.stringify({ combo: nombre, uz_mm: m.uz_mm, esperado_por_superposicion: +esperado.toFixed(5), iguales: Math.abs(m.uz_mm - esperado) < 1e-4 * Math.max(1, Math.abs(esperado)) })); };
  chk("Servicio D+L", D.uz_mm + L.uz_mm); chk("1.4D", 1.4 * D.uz_mm); chk("1.2D+1.6L", 1.2 * D.uz_mm + 1.6 * L.uz_mm);
}
await nav.close();
