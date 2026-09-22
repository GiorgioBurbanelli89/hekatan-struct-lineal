// ¿Hekatan Struct se puede usar desde el movil? Se mide, no se opina.
import puppeteer from "puppeteer";
const URL = process.argv[2];
const APARATOS = [
  { n: "iPhone 14",      w: 390, h: 844, dpr: 3, ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1", touch: true },
  { n: "Android medio", w: 412, h: 915, dpr: 2.6, ua: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36", touch: true },
  { n: "Tablet 10\"",   w: 820, h: 1180, dpr: 2, ua: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1", touch: true },
];
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
for (const a of APARATOS) {
  const p = await b.newPage();
  await p.setUserAgent(a.ua);
  await p.setViewport({ width: a.w, height: a.h, deviceScaleFactor: a.dpr, isMobile: true, hasTouch: a.touch });
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
  try {
    await p.goto(URL, { waitUntil: "networkidle2", timeout: 90000 });
    await new Promise((r) => setTimeout(r, 11000));
    const d = await p.evaluate(() => {
      const c = document.querySelector("canvas");
      const r = c?.getBoundingClientRect();
      const fuera = [...document.querySelectorAll("button,select,input")]
        .filter((e) => { const b = e.getBoundingClientRect();
          return b.width > 0 && (b.right > window.innerWidth + 2 || b.left < -2); }).length;
      const chicos = [...document.querySelectorAll("button")]
        .filter((e) => { const b = e.getBoundingClientRect();
          return b.width > 0 && (b.width < 32 || b.height < 32); }).length;
      return {
        canvas: r ? `${Math.round(r.width)}x${Math.round(r.height)}` : "NO HAY",
        scrollH: document.documentElement.scrollWidth > window.innerWidth + 2,
        fuera, chicos,
        botones: document.querySelectorAll("button").length,
        grabar: !!document.getElementById("hk-grabar-btn"),
        agente: !!document.getElementById("hk-agente-lanzador"),
      };
    });
    console.log(`${a.n.padEnd(14)} ${a.w}x${a.h}  canvas ${String(d.canvas).padEnd(9)} | se sale a los lados: ${d.scrollH} | controles fuera: ${d.fuera} | botones < 32 px: ${d.chicos}/${d.botones} | ⏺ ${d.grabar} 🤖 ${d.agente} | errores ${errs.length}`);
    await p.screenshot({ path: `${process.argv[3]}_${a.n.replace(/\W/g, "")}.png` });
  } catch (e) { console.log(`${a.n}: FALLO ${String(e).slice(0, 90)}`); }
  await p.close();
}
await b.close();
