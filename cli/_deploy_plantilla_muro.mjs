import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 1000 });
await p.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=plantillas`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 8000));
const setSel = (label, texto) => p.evaluate((label, texto) => { const row = [...document.querySelectorAll(".tp-lblv")].find((e) => e.querySelector(".tp-lblv_l")?.textContent.trim().includes(label)); const sel = row?.querySelector("select"); if (!sel) return "no select " + label; const opt = [...sel.options].find((o) => o.textContent.includes(texto)); if (!opt) return "no opt: " + [...sel.options].map((o) => o.textContent).join("|"); sel.value = opt.value; sel.dispatchEvent(new Event("change", { bubbles: true })); return "ok"; }, label, texto);
console.log("plantilla:", await setSel("Plantilla", "muros")); await new Promise((r) => setTimeout(r, 6000));
for (const [campo, scope, nom] of [["Uz", "solo muros", "uz_muros"]]) {
  console.log(campo, await setSel("Shell results", campo), await setSel("Rango colormap", scope)); await new Promise((r) => setTimeout(r, 2500));
  await p.evaluate(() => { const ctx = [...document.querySelectorAll("div")].map(d => d.__ctx).find(Boolean); ctx.render?.(); }); await new Promise((r) => setTimeout(r, 800));
  await p.screenshot({ path: `cli/shots/deploy/_plantilla_dual_${nom}.png` });
}
await nav.close();
