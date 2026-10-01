// ¿Se ve la malla? edificio-con-muros en tema claro y oscuro con F22. node cli/_malla_check.mjs <dir>
import puppeteer from "puppeteer";
const DIR = process.argv[2] ?? "cli/shots/malla"; import("node:fs").then((fs) => fs.mkdirSync(DIR, { recursive: true }));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 900 });
const BASE = process.env.HK_BASE ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
for (const tema of ["oscuro", "claro"]) {
  await pag.goto(`${BASE}/workspace/?t=edificio-con-muros`, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 9000));
  const info = await pag.evaluate(async (tema) => {
    const b = [...document.querySelectorAll("button")].find((x) => /Claro|Oscuro/.test(x.innerText));
    if (tema === "claro" && b && /Claro/.test(b.innerText)) b.click();
    await new Promise((r) => setTimeout(r, 1500));
    const s = window.__hekatanSettings(); s.shellResults.val = "membraneYY";
    await new Promise((r) => setTimeout(r, 1500));
    return { elements: s.elements.val, edges: s.edges?.val, colorByType: s.colorByType?.val, boton: b?.innerText };
  }, tema);
  await pag.screenshot({ path: `${DIR}/${tema}.png` }); console.log(tema, JSON.stringify(info));
}
await nav.close();
