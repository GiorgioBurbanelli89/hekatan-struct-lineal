// Sonda: durante la animación modal la línea GRUESA sigue a la fina (misma geometría en cada instante).
import puppeteer from "puppeteer";
const PUERTO = process.argv[2] || "4610";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pag = await nav.newPage(); const err = []; pag.on("pageerror", (e) => err.push(e.message.slice(0, 160)));
await pag.setViewport({ width: 1280, height: 720 });
await pag.goto(`http://localhost:${PUERTO}/workspace/?heks=${encodeURIComponent(`http://localhost:${PUERTO}/tutoriales/warren.heks`)}`, { waitUntil: "networkidle2", timeout: 120000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await new Promise((r) => setTimeout(r, 4000));
console.log("anima:", await pag.evaluate(() => typeof window.__hekatanRunModalAnimate));
await pag.evaluate(() => window.__hekatanRunModalAnimate?.());
await new Promise((r) => setTimeout(r, 8000));
for (let k = 0; k < 4; k++) {
  console.log(JSON.stringify(await pag.evaluate(() => {
    const c = document.querySelector("#viewer").__ctx; let fat = null, fina = null;
    c.scene.traverse((o) => { if (o.name === "__hekatan_element_lines_fat") { fat = o; fina = o.parent.children.find((x) => x.isLineSegments && !x.isLineSegments2); } });
    const f = fat.geometry.attributes.instanceStart, p = fina.geometry.attributes.position;
    let dmax = 0; for (let i = 0; i < Math.min(f.count, 40); i++) dmax = Math.max(dmax, Math.abs(f.getX(i) - p.getX(2 * i)) + Math.abs(f.getZ(i) - p.getZ(2 * i)));
    return { anim: !!window.__hekatanSettings().__modoAnim, fat: f.count, z5: +f.getZ(5).toFixed(4), difFinaGruesa: dmax };
  })));
  await new Promise((r) => setTimeout(r, 700));
}
console.log("pageerror:", err.length ? err : 0);
await nav.close();
