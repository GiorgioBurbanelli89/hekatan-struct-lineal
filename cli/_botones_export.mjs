// ¿Están los botones de exportar a CSI, y dónde?
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1600, height: 950 });
await p.goto(process.argv[2], { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 18000));
const r = await p.evaluate(() => {
  const txt = (e) => (e.textContent || "").replace(/\s+/g, " ").trim();
  const hits = [...document.querySelectorAll("button,.tp-btnv_b,div")]
    .filter((e) => /E2K|S2K|F2K|OpenSees|\.tcl/i.test(txt(e)) && txt(e).length < 70)
    .map((e) => {
      const r = e.getBoundingClientRect();
      // ¿de qué carpeta cuelga?
      let padre = e.closest(".tp-fldv"), nombre = "";
      if (padre) nombre = (padre.querySelector(".tp-fldv_t")?.textContent || "").trim();
      return { t: txt(e), carpeta: nombre, visible: r.width > 0 && r.height > 0 };
    });
  // quitar duplicados por texto
  const vistos = new Set(), out = [];
  for (const h of hits) if (!vistos.has(h.t)) { vistos.add(h.t); out.push(h); }
  return out.slice(0, 12);
});
console.log(JSON.stringify(r, null, 1));
await b.close();
