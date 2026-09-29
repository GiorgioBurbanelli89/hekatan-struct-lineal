import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const p = await nav.newPage(); await p.setViewport({ width: 1600, height: 900 });
await p.goto("http://localhost:4600/workspace/index.html?t=plantillas", { waitUntil: "networkidle2", timeout: 180000 });
await p.waitForFunction(() => !!document.getElementById("hk-compartir-btn"), { timeout: 120000 }); await new Promise((r) => setTimeout(r, 3000));
for (const w of [1280, 1100, 1024, 960, 900, 800]) {
  await p.setViewport({ width: w, height: 700 }); await new Promise((r) => setTimeout(r, 800));
  const r = await p.evaluate(() => {
    const tit = document.getElementById("hk-cad-tit");
    const fuera = [...document.querySelectorAll("#hk-cad-tit button, #hk-cad-tit .marca, #hk-cad-tit a, #hk-cad-tit span.doc")].filter((e) => {
      const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden") return false;
      const r = e.getBoundingClientRect(); return r.width > 2 && (r.right > innerWidth + 0.5 || r.left < 0); })
      .map((e) => (e.id || e.className || e.tagName) + " «" + (e.textContent || "").trim().slice(0, 12) + "» " + Math.round(e.getBoundingClientRect().right));
    return { ancho: Math.round(tit.scrollWidth), fuera };
  });
  console.log(w, "barra", r.ancho, "· fuera:", r.fuera.join(" | ") || "nada");
}
await nav.close();
