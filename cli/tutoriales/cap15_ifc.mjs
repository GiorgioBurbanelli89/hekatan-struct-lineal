/**
 * Capítulo 15 — Mejoras del VISOR IFC: importar y ver el modelo, ocultar/aislar
 * objetos, medir con la regla (OSNAP a esquinas) y recortar para ver por dentro.
 */
export const titulo = "Hekatan Struct · el visor IFC";
export const ruta = "workspace/?t=ifc-viewer";

const host = async (a) => a.pag.evaluate(() => {
  const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera);
  if (!h) return null; const r = h.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height };
});
const mover = async (a, x, y, steps = 22) => {
  await a.pag.mouse.move(x, y, { steps });
  await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x, y });
};
const clicRojoPx = async (a, x, y) => {
  await mover(a, x, y, 22); await a.quieto(2, 300);
  await a.pag.evaluate((q) => window.__tutClick && window.__tutClick(q.x, q.y), { x, y });
  await a.quieto(3, 320); await a.pag.mouse.click(x, y); await a.quieto(2, 300);
};
const orbit = async (a, dx, dy, n = 6) => {
  const r = await host(a); if (!r) return;
  const cx = r.x + r.w * 0.5, cy = r.y + r.h * 0.5;
  await a.pag.mouse.move(cx, cy); await a.pag.mouse.down();
  await a.pag.mouse.move(cx + dx, cy + dy, { steps: 22 }); await a.pag.mouse.up();
  await a.quieto(n, 320);
};

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("El visor IFC", "Capítulo 15", 16); } },
  {
    rotulo: "1 · Importar el IFC y ver el modelo",
    hacer: async (a) => {
      await a.pag.evaluate(async (base) => {
        const M = await fetch(base + "ifc_church.json").then((r) => r.json());
        window.__hekatanIfcMesh = M;
        try { window.__hekatanRebuild && window.__hekatanRebuild(); } catch (e) {}
        try { window.__hekatanAutoFit && window.__hekatanAutoFit(); } catch (e) {}
      }, "/hekatan-struct-lineal/");
      await a.general(); await a.quieto(5, 360);
      await orbit(a, 150, -20, 4);
    },
  },
  {
    rotulo: "2 · Ocultar / aislar objetos (panel con la info)",
    hacer: async (a) => {
      // Panel hk-ifc-objs abajo-izquierda: destacar y ocultar 2 objetos.
      const r = await a.pag.evaluate(() => { const p = document.getElementById("hk-ifc-objs"); if (!p) return null; const rc = p.getBoundingClientRect(); return { x: rc.left, y: rc.top, w: rc.width, h: rc.height }; });
      if (r) { await a.pag.evaluate((q) => window.__tutCaja(q.r, q.n, { x: 0, y: 0, w: 1280, h: 720 }), { r, n: "Lista de objetos del IFC: color, nº de triángulos, ocultar y «solo»." }); await a.quieto(5, 340); await a.pag.evaluate(() => window.__tutSinCaja()); }
      // Ocultar dos objetos (checkboxes) para que se vea el efecto.
      for (const idx of [0, 2]) {
        const cb = await a.pag.evaluate((i) => { const c = document.querySelector(`[data-ifc-vis="${i}"]`); if (!c) return null; const rc = c.getBoundingClientRect(); return { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 }; }, idx);
        if (cb) await clicRojoPx(a, cb.x, cb.y);
      }
      await a.quieto(3, 340);
    },
  },
  {
    rotulo: "3 · Medir con la regla (engancha a las esquinas)",
    hacer: async (a) => {
      // ver todos otra vez
      await a.pag.evaluate(() => { const b = document.getElementById("hk-ifc-all"); if (b) b.click(); });
      await a.quieto(2, 320);
      await a.pag.evaluate(() => window.__hekatanCadState.setTool("medir"));
      const r = await host(a); if (!r) return;
      await clicRojoPx(a, r.x + r.w * 0.40, r.y + r.h * 0.55);
      await clicRojoPx(a, r.x + r.w * 0.62, r.y + r.h * 0.50);
      await a.quieto(5, 350);   // se ve la cota
    },
  },
  {
    rotulo: "4 · Recortar para ver por dentro (corte)",
    hacer: async (a) => {
      await a.pag.evaluate(() => {
        const bb = window.__hekatanIfcMesh?.bbox;
        const zmid = bb ? (bb[0][2] + bb[1][2]) / 2 : 5;
        window.__hekatanClip = { enableX: false, enableY: false, enableZ: true, posX: 0, posY: 0, posZ: zmid, invertX: false, invertY: false, invertZ: false };
        try { window.__hekatanClipApply && window.__hekatanClipApply(); } catch (e) {}
      });
      await a.quieto(3, 340);
      await orbit(a, 120, -30, 5);
      await orbit(a, -90, 20, 5);
    },
  },
];
