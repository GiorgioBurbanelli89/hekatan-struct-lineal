// Sonda: líneas gruesas de las barras (elements.ts). Mide el coste de render con y sin la
// gruesa (mismo modelo, misma cámara) y guarda PNG. node cli/_lineas_gruesas_check.mjs [puerto]
import puppeteer from "puppeteer";
const PUERTO = process.argv[2] || "4610";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pag = await nav.newPage(); const err = []; pag.on("pageerror", (e) => err.push(e.message.slice(0, 160)));
await pag.setViewport({ width: 1280, height: 720 });
const casos = [["warren", `workspace/?heks=${encodeURIComponent(`http://localhost:${PUERTO}/tutoriales/warren.heks`)}`],
               ["allianz", `workspace/?heks=${encodeURIComponent(`http://localhost:${PUERTO}/tutoriales/allianz.heks`)}`],
               ["edificio-dual", "workspace/?t=edificio-dual"]];
for (const [nom, ruta] of casos) {
  await pag.goto(`http://localhost:${PUERTO}/${ruta}`, { waitUntil: "networkidle2", timeout: 180000 });
  await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
  await new Promise((r) => setTimeout(r, 6000));
  const m = await pag.evaluate(() => {
    const c = document.querySelector("#viewer").__ctx; let fat = null;
    c.scene.traverse((o) => { if (o.name === "__hekatan_element_lines_fat") fat = o; });
    const t = (n) => { const t0 = performance.now(); for (let i = 0; i < n; i++) c.render(); return (performance.now() - t0) / n; };
    t(5);
    const con = t(40); if (fat) fat.visible = false; const sin = t(40); if (fat) fat.visible = true; c.render();
    return { nudos: window.__hekatanStates?.nodes?.rawVal?.length, segs: fat ? fat.geometry.attributes.instanceStart?.count : null, ms_con: +con.toFixed(2), ms_sin: +sin.toFixed(2) };
  });
  console.log(nom, JSON.stringify(m));
  await pag.screenshot({ path: `cli/shots/cinta/lineas_${nom}.png` });
}
console.log("pageerror:", err.length ? err : 0);
await nav.close();
