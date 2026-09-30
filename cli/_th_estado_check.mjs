// Compartir TAL COMO ESTÁ: A) panel abierto + gráfica del registro, sin calcular; B) calculado + cortante basal.
//   node cli/_th_estado_check.mjs <base> <carpeta_png>
import puppeteer from "puppeteer";
const [BASE, OUT] = process.argv.slice(2);
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const err = [];
const abrir = async (url) => { const p = await nav.newPage(); await p.setViewport({ width: 1600, height: 1000 }); p.on("pageerror", (e) => err.push(String(e)));
  await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 9000)); return p; };
const estado = (p) => p.evaluate(() => { const th = window.__hekatanTiempoHistoria; const g = document.getElementById("hk-shared-chart");
  const t = [...document.querySelectorAll(".tp-fldv_t")].find((e) => e.innerText.includes("Tiempo-historia"));
  return { panel: !!t && t.closest(".tp-fldv").classList.contains("tp-fldv-expanded"), grafica: g ? g.style.display : "—",
    titulo: g?.innerText.split("\n")[0], calculado: !!th.resultado(), registro: th.params.registro }; });
for (const caso of ["A", "B"]) {
  const a = await abrir(`${BASE}/workspace/?t=plantillas`);
  await a.evaluate(async (caso) => { const th = window.__hekatanTiempoHistoria;
    const t = [...document.querySelectorAll(".tp-fldv_t")].find((e) => e.innerText.includes("Tiempo-historia"));
    t.closest(".tp-fldv").querySelector(".tp-fldv_b").click();
    th.params.escala = 2.6524; th.params.grafica = caso === "A" ? 2 : 1; th.refrescar();
    if (caso === "B") th.correr(); else { const s = [...document.querySelectorAll(".tp-lblv")].find((e) => e.innerText.startsWith("Gráfica")); s.querySelector("select").dispatchEvent(new Event("change", { bubbles: true })); }
  }, caso);
  await new Promise((r) => setTimeout(r, 2500));
  console.log(caso, "ORIGEN ", JSON.stringify(await estado(a)));
  const url = (await a.evaluate(() => window.__hekatanEnlaceEjemplo())).url; console.log("   enlace", url.replace(/^.*\?/, "?"));
  const b = await abrir(url);
  console.log(caso, "ABIERTO", JSON.stringify(await estado(b)));
  await b.screenshot({ path: `${OUT}/compartir_${caso}.png` });
}
console.log("errores", err.length, err.slice(0, 2)); await nav.close();
