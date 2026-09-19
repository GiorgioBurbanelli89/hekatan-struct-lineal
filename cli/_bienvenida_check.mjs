// Sonda de la PANTALLA DE BIENVENIDA (examples/src/shared/bienvenida.ts): PNG en varios tamaños,
// la pantalla y lo que queda tras cada opción; cuenta lo que se solapa tras elegir.
//   node cli/_bienvenida_check.mjs [puerto=4610] [ruta=workspace/?t=new-blank]
import puppeteer from "puppeteer";
import { mkdirSync } from "fs";
const PUERTO = process.argv[2] || "4610";
const RUTA = process.argv[3] || "workspace/?t=new-blank";
const OUT = "cli/shots/bienvenida"; mkdirSync(OUT, { recursive: true });
const TAM = [[1920, 1080], [1366, 768], [390, 844]];
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const err = [];
for (const [w, h] of TAM) {
  for (const opcion of ["pantalla", "guiado", "buscar", "ia", "manual"]) {
    const pag = await nav.newPage();
    pag.on("pageerror", (e) => err.push(`${w}:${opcion}: ${e.message.slice(0, 120)}`));
    await pag.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 600, hasTouch: w < 600 });
    const url = `http://localhost:${PUERTO}/${RUTA}${RUTA.includes("?") ? "&" : "?"}bienvenida=1`;
    await pag.goto(url, { waitUntil: "networkidle2", timeout: 120000 }).catch(() => {});
    await pag.waitForSelector("#hk-bienv", { timeout: 60000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));
    const hay = await pag.evaluate(() => !!document.getElementById("hk-bienv"));
    if (opcion !== "pantalla" && hay) {
      await pag.click("#hk-bienv-" + opcion).catch((e) => err.push(`${w}:${opcion}: sin tarjeta`));
      await new Promise((r) => setTimeout(r, 1800));
      if (opcion === "buscar") { await pag.keyboard.type("apoyo", { delay: 40 }); await new Promise((r) => setTimeout(r, 600)); }
    }
    // ¿qué tapa a los paneles o a la cinta tras elegir?
    const m = await pag.evaluate(() => {
      const vis = (e) => !!e && getComputedStyle(e).display !== "none" && getComputedStyle(e).visibility !== "hidden" && e.getClientRects().length > 0 && e.getBoundingClientRect().width > 0;
      const r = (s) => { const e = document.querySelector(s); return vis(e) ? e.getBoundingClientRect() : null; };
      const cruza = (a, b) => a && b && Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2;
      const flot = ["#hk-ribbon-guia", "#hk-busca", "#hk-bienv", ".hk-agente-ventana, #hk-agente", "#hk-bienv-toast"];
      const paneles = { settings: r("#settings"), pane: r("#hk-pane-host"), cinta: r("#hk-ribbon") };
      const choques = [];
      for (const f of flot) { const a = r(f); if (!a) continue; for (const [k, b] of Object.entries(paneles)) if (cruza(a, b)) choques.push(`${f}×${k}`); }
      return { bienvenida: vis(document.getElementById("hk-bienv")), guia: vis(document.getElementById("hk-ribbon-guia")), busca: vis(document.getElementById("hk-busca")),
               ayudo: document.getElementById("hk-agente-lanzador")?.textContent, choques };
    });
    console.log(`${w}x${h} ${opcion}:`, JSON.stringify(m));
    await pag.screenshot({ path: `${OUT}/b_${w}_${opcion}.png` });
    await pag.close();
  }
}
console.log("pageerror:", err.length ? err : 0);
await nav.close();
