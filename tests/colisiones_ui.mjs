// SIN COLISIONES: ningún texto flotante (leyendas, etiquetas fijas) puede pisar un botón. Jorge, 2-nov-2026: «no puede haber
// colisión de botón con texto» (la leyenda de tipos de barra quedaba debajo de la barra de acceso rápido).
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", channel: "chrome", args: ["--no-sandbox"] });
let ok = 0, mal = 0; const check = (n, c, d = "") => { c ? ok++ : mal++; console.log((c ? "  ✓ " : "  ✗ ") + n + (d ? "  " + d : "")); };
const w = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [W, H] of [[1500, 1000], [1100, 760]]) {
  const p = await b.newPage(); await p.setViewport({ width: W, height: H });
  const err = []; p.on("pageerror", (e) => err.push(e.message));
  await p.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2" }); await w(4500);
  await p.evaluate(() => { window.__hekatanGalponCurvo?.({}); const el = [...document.querySelectorAll("*")].find((e) => e.__settings && e.__ctx); el.__settings.colorByType.val = true; });
  await w(2500);
  const r = await p.evaluate(() => {
    const ley = document.getElementById("hk-leyenda-tipos"); if (!ley) return { err: "sin leyenda" };
    const L = ley.getBoundingClientRect(); if (!L.width || getComputedStyle(ley).display === "none") return { err: "oculta" };
    const choques = [];
    for (const e of document.querySelectorAll("button, .tp-btnv, [role=button], select, input")) {
      const q = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      if (!q.width || !q.height || cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) continue;
      if (q.left < L.right && L.left < q.right && q.top < L.bottom && L.top < q.bottom) choques.push((e.id || e.className || e.tagName) + ":" + (e.textContent || "").trim().slice(0, 14));
    }
    return { rect: [Math.round(L.left), Math.round(L.top), Math.round(L.right), Math.round(L.bottom)], choques };
  });
  console.log(`  ${W}×${H}:`, JSON.stringify(r));
  check(`${W}×${H}: la leyenda de tipos no pisa ningún botón`, !r.err && r.choques.length === 0, r.err || r.choques.join(" | "));
  check(`${W}×${H}: sin errores de página`, err.length === 0, err.join(" | "));
  await p.close();
}
console.log(`\n${ok} ok · ${mal} fallan`); await b.close(); process.exit(mal ? 1 : 0);
