/**
 * Capítulo 31 — Alcantarilla cajón con carga móvil HL-93 (estilo post de LinkedIn).
 * El camión cruza la losa superior paso a paso, deformada con colormap y momento; al final la
 * envolvente y la tabla contra SAP2000 (juez) y OpenSeesPy, leída de validation/carga-movil/.
 */
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

export const titulo = "Alcantarilla cajón · carga móvil HL-93";
export const ejemplo = "alcantarilla-carga-movil";
const AQUI = dirname(fileURLToPath(import.meta.url));

const esperaDatos = (a) => a.pag.waitForFunction(() => !!window.__hekatanCargaMovilDatos, { timeout: 180000 });
const rect = (a, sel) => a.pag.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }, sel);
const lim = { x: 0, y: 0, w: 1280, h: 640 };
const caja = async (a, sel, nota, n = 8) => {
  const r = await rect(a, sel); if (!r) return;
  await a.pag.evaluate((q) => { window.__tutCursor(q.r.x + q.r.w - 14, q.r.y + q.r.h / 2); window.__tutCaja(q.r, q.n, q.l); }, { r, n: nota, l: lim });
  await a.quieto(n, 330);
  await a.pag.evaluate(() => window.__tutSinCaja());
};
/** La ventana 🚚: a la derecha y compacta, para que el camión se vea. */
const ventanaCompacta = (a, plegada) => a.pag.evaluate((pl) => {
  const p = document.getElementById("hk-carga-movil"); if (!p) return;
  p.style.left = "auto"; p.style.right = "8px"; p.style.bottom = "auto"; p.style.top = "40px"; p.style.width = "290px";
  const d = p.dataset.plegado === "1";
  if (d !== pl) p.querySelector("[data-plegar]")?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
}, plegada);
/** Recorrido del camión: `cada` posiciones por fotograma. */
const cruzar = async (a, desde, hasta, cada, ms = 120) => {
  for (let i = desde; i <= hasta; i += cada) {
    await a.pag.evaluate((k) => { const A = window.__hekatanCargaMovil; A.pausa(); A.ir(k); }, i);
    await a.quieto(1, ms);
  }
};

function tablaSap() {
  const f = join(AQUI, "..", "..", "validation", "carga-movil", "COMPARACION_ejemplo.md");
  if (!existsSync(f)) return null;
  return readFileSync(f, "utf-8").split("\n").filter((l) => l.startsWith("|") && !/^\|---/.test(l));
}

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await esperaDatos(a); await a.portada("Alcantarilla cajón · carga móvil HL-93", "Capítulo 31", 14); } },
  {
    rotulo: "1 · El modelo: 2 celdas, franja de 1 m, suelo Winkler",
    hacer: async (a) => {
      await a.general();
      await a.pag.evaluate(() => { try { document.querySelector("#settings")?.closest("div")?.querySelector("[title*='Plegar']")?.click(); } catch (e) {} });
      await ventanaCompacta(a, true);
      await a.pag.evaluate(() => { const A = window.__hekatanCargaMovil; A.pausa(); A.ir(0); });
      await a.quieto(4, 300);
      await a.abrir("Geometría");
      await a.quieto(10, 330);
    },
  },
  {
    rotulo: "2 · El camión HL-93 (35/145/145 kN, 4.3 m) y la fuente",
    hacer: async (a) => {
      await a.abrir("Camión HL-93");
      await a.quieto(6, 330);
      await ventanaCompacta(a, false);
      await caja(a, "#hkcm-tit", "HL-93K: CSI Analysis Reference Manual, p. 515 y Fig. 92", 10);
      await ventanaCompacta(a, true);
    },
  },
  {
    rotulo: "3 · El camión cruza: deformada con colormap y momento M3",
    hacer: async (a) => { await a.general(); await cruzar(a, 0, 276, 3); },
  },
  {
    rotulo: "4 · Paso a paso: la posición del momento máximo",
    hacer: async (a) => {
      await ventanaCompacta(a, false);
      // la posición del camión que da el M3 máximo (la guarda la envolvente: xFFmax)
      const k = await a.pag.evaluate(() => { const d = window.__hekatanCargaMovilDatos; let j = 0;
        for (let i = 0; i < d.env.Fmax.length; i++) if (i % 6 >= 4 && d.env.Fmax[i] > d.env.Fmax[j]) j = i;
        const x = d.env.xFFmax[j]; let best = 0; d.xs.forEach((xF, i) => { if (Math.abs(xF - x) < Math.abs(d.xs[best] - x)) best = i; }); return best; });
      await cruzar(a, Math.max(0, k - 12), k, 2, 250);
      await caja(a, "#hkcm-est", "ΣR − ΣP ≈ 0: equilibrio en cada posición", 10);
      await caja(a, "#hkcm-ant", "◀ ▶ paso a paso · ⏸ pausa · velocidad y escala", 8);
    },
  },
  {
    rotulo: "5 · La envolvente: camión + carril",
    hacer: async (a) => {
      await a.pag.evaluate(() => document.querySelector("#hkcm-env")?.click());
      await a.quieto(4, 330);
      await caja(a, "#hkcm-envtxt", "Envolvente: separación trasera 4.3–9.0 m + carril 9.3 kN/m", 12);
    },
  },
  {
    rotulo: "6 · Contra SAP2000 y OpenSeesPy",
    hacer: async (a) => {
      const filas = tablaSap() ?? ["| (falta la comparación) |"];
      await a.pag.evaluate((F) => {
        const d = document.createElement("div"); d.id = "hk-tut-tabla";
        d.style.cssText = "position:fixed;left:50%;top:48%;transform:translate(-50%,-50%);z-index:2147483600;background:rgba(10,14,20,.97);border:2px solid #22d3ee;border-radius:10px;padding:16px 22px;color:#e8f6fb;font:15px 'Segoe UI',sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.8)";
        const celdas = (l) => l.split("|").slice(1, -1).map((c) => c.trim());
        d.innerHTML = `<div style="font:700 18px 'Segoe UI';margin-bottom:8px">Hekatan Struct contra ${celdas(F[0]).slice(2).join(" y ")} · 277 posiciones · mismo modelo nudo a nudo</div><table style="border-collapse:collapse">` +
          F.map((l, i) => `<tr>${celdas(l).map((c) => `<${i === 0 ? "th" : "td"} style="padding:3px 12px;border-bottom:1px solid #2a3a4a;text-align:${i ? "right" : "left"}">${c}</${i === 0 ? "th" : "td"}>`).join("")}</tr>`).join("") + `</table>`;
        document.body.appendChild(d);
      }, filas.slice(0, 7));
      await a.quieto(16, 360);
      await a.pag.evaluate(() => document.getElementById("hk-tut-tabla")?.remove());
    },
  },
  {
    rotulo: "7 · Exportar a SAP2000, ETABS y OpenSeesPy",
    hacer: async (a) => {
      await a.pag.evaluate(() => { const A = window.__hekatanCargaMovil; A.play(); });
      await caja(a, "#hkcm-exp", "Un caso por posición: el mismo modelo en SAP2000", 10);
      await a.quieto(8, 300);
    },
  },
];
