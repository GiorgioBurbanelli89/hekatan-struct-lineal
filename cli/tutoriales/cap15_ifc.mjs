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
  // Cursor VISIBLE durante el giro: se pinta en cada tramo del arrastre para
  // que se vea que es el ratón quien orbita el modelo (no la cámara sola).
  await a.pag.mouse.move(cx, cy);
  await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); }, { x: cx, y: cy });
  await a.pag.mouse.down();
  const K = 16;
  for (let i = 1; i <= K; i++) {
    const x = cx + (dx * i) / K, y = cy + (dy * i) / K;
    await a.pag.mouse.move(x, y);
    await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); }, { x, y });
  }
  await a.pag.mouse.up();
  await a.quieto(n, 320);
};

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("El visor IFC", "Capítulo 15", 16); } },
  {
    rotulo: "1 · Importar el IFC y ver el modelo",
    hacer: async (a) => {
      await a.general(); await a.quieto(2, 320);
      // Señalar con el CURSOR el botón de importar (el diálogo de archivo del
      // sistema no se puede grabar, así que aquí se carga el mismo IFC).
      const r = await a.pag.evaluate(() => {
        const b = [...document.querySelectorAll("button")].find((x) => /Importar IFC/i.test(x.textContent || ""));
        if (!b) return null; b.scrollIntoView({ block: "center" });
        const rc = b.getBoundingClientRect(); return { x: rc.left, y: rc.top, w: rc.width, h: rc.height };
      });
      if (r) {
        await mover(a, r.x + r.w / 2, r.y + r.h / 2, 22);
        await a.pag.evaluate((q) => window.__tutCaja(q.r, q.n, { x: 0, y: 0, w: 1280, h: 720 }),
          { r, n: "Importar IFC: se elige el archivo .ifc y se ve el modelo." });
        await a.quieto(4, 340);
        await a.pag.evaluate((q) => window.__tutClick && window.__tutClick(q.x, q.y), { x: r.x + r.w / 2, y: r.y + r.h / 2 });
        await a.quieto(2, 300);
        await a.pag.evaluate(() => window.__tutSinCaja());
      }
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
      // El panel arranca MINIMIZADO (abajo-centro, no tapa los menús). Se
      // expande CON EL CURSOR (botón ▢) para ver la lista.
      const bm0 = await a.pag.evaluate(() => { const b = document.getElementById("hk-ifc-min"); if (!b) return null; const rc = b.getBoundingClientRect(); return { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 }; });
      if (bm0) { await clicRojoPx(a, bm0.x, bm0.y); await a.quieto(2, 320); }
      // Panel hk-ifc-objs: destacar y ocultar 2 objetos.
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
    rotulo: "3 · El panel también es corredizo: minimizar y puerta",
    hacer: async (a) => {
      // Botón minimizar (▁): encoge el panel para no tapar los otros menús.
      const bm = await a.pag.evaluate(() => { const b = document.getElementById("hk-ifc-min"); if (!b) return null; const rc = b.getBoundingClientRect(); return { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 }; });
      if (bm) { await clicRojoPx(a, bm.x, bm.y); await a.quieto(4, 340);
                await clicRojoPx(a, bm.x, bm.y); await a.quieto(2, 300); }  // restaurar
      // Botón puerta corrediza (⟨): esconde el panel del todo, deja una pestaña.
      const bs = await a.pag.evaluate(() => { const b = document.getElementById("hk-ifc-slide"); if (!b) return null; const rc = b.getBoundingClientRect(); return { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 }; });
      if (bs) { await clicRojoPx(a, bs.x, bs.y); await a.quieto(4, 340);
        // reaparece con la pestaña
        const tab = await a.pag.evaluate(() => { const t = document.getElementById("hk-ifc-tab"); if (!t) return null; const rc = t.getBoundingClientRect(); return { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 }; });
        if (tab) { await clicRojoPx(a, tab.x, tab.y); await a.quieto(3, 320); }
      }
    },
  },
  {
    rotulo: "4 · Medir con la regla (engancha a las esquinas)",
    hacer: async (a) => {
      // ver todos otra vez — CON EL CURSOR (botón «ver todos» del panel IFC).
      const vt = await a.pag.evaluate(() => { const b = document.getElementById("hk-ifc-all"); if (!b) return null; const rc = b.getBoundingClientRect(); return { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 }; });
      if (vt) await clicRojoPx(a, vt.x, vt.y);
      await a.quieto(2, 320);
      await a.pag.evaluate(() => window.__hekatanCadState.setTool("medir"));
      const r = await host(a); if (!r) return;
      await clicRojoPx(a, r.x + r.w * 0.40, r.y + r.h * 0.55);
      await clicRojoPx(a, r.x + r.w * 0.62, r.y + r.h * 0.50);
      await a.quieto(5, 350);   // se ve la cota
    },
  },
  {
    rotulo: "5 · DÓNDE se activa el corte: panel ✂ Cortes X/Y/Z, casilla Cortar Z",
    hacer: async (a) => {
      // Limpiar la regla de paso 4: soltar herramienta y borrar la cota (label
      // DOM + línea de la escena) para que no quede flotando sobre el modelo.
      await a.pag.keyboard.press("Escape");
      await a.pag.keyboard.press("Escape");
      await a.pag.evaluate(() => {
        try { window.__hekatanCadState?.setTool?.("select"); } catch(e){}
        try { window.__hekatanClearMeasure && window.__hekatanClearMeasure(); } catch(e){}
      });
      await a.quieto(2, 320);
      // 1. Abrir el folder «✂️ Cortes X/Y/Z» del panel Settings (izquierda) CON EL CURSOR.
      const fold = await a.pag.evaluate(() => {
        const f = [...document.querySelectorAll(".tp-fldv_b")].find((x) => /Cortes/i.test(x.textContent || ""));
        if (!f) return null; f.scrollIntoView({ block: "center" });
        const rc = f.getBoundingClientRect(); return { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2, rx: rc.left, ry: rc.top, rw: rc.width, rh: rc.height };
      });
      if (fold) {
        await a.pag.evaluate((q) => window.__tutCaja({ x: q.rx, y: q.ry, w: q.rw, h: q.rh }, "AQUÍ se activa el corte: panel ✂ Cortes X/Y/Z.", { x: 0, y: 0, w: 1280, h: 720 }), fold);
        await a.quieto(4, 340);
        await a.pag.evaluate(() => window.__tutSinCaja());
        await clicRojoPx(a, fold.x, fold.y);   // abre el folder
        await a.quieto(2, 320);
      }
      // 2. Fijar la altura del corte ARRASTRANDO el slider «pos Z» CON EL CURSOR.
      const sld = await a.pag.evaluate(() => {
        const row = [...document.querySelectorAll(".tp-lblv")].find((x) => /pos Z/i.test(x.textContent || ""));
        if (!row) return null; row.scrollIntoView({ block: "center" });
        const s = row.querySelector(".tp-sldv") || row.querySelector("input[type=range]") || row.querySelector(".tp-lblv_v");
        const rc = s.getBoundingClientRect();
        const bb = window.__hekatanIfcMesh?.bbox; const zmid = bb ? (bb[0][2] + bb[1][2]) / 2 : 5;
        const frac = Math.max(0.02, Math.min(0.98, (zmid + 50) / 100));  // rango -50..50
        return { x0: rc.left + rc.width * 0.5, y: rc.top + rc.height / 2, xt: rc.left + rc.width * frac };
      });
      if (sld) {
        // Arrastre visible del knob de 0 (centro) a la altura media.
        await mover(a, sld.x0, sld.y, 18);
        await a.pag.mouse.down();
        const K = 14;
        for (let i = 1; i <= K; i++) {
          const x = sld.x0 + (sld.xt - sld.x0) * (i / K);
          await a.pag.mouse.move(x, sld.y);
          await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); }, { x, y: sld.y });
        }
        await a.pag.mouse.up();
        await a.quieto(2, 320);
      }
      // 3. Activar «Cortar Z» con el cursor: se abre el modelo en el corte fijado.
      const cz = await a.pag.evaluate(() => {
        const row = [...document.querySelectorAll(".tp-lblv")].find((x) => /Cortar Z/i.test(x.textContent || ""));
        if (!row) return null; row.scrollIntoView({ block: "center" });
        const ctl = row.querySelector(".tp-ckbv_w") || row.querySelector("input[type=checkbox]") || row.querySelector(".tp-lblv_v") || row;
        const rc = ctl.getBoundingClientRect(); const rr = row.getBoundingClientRect();
        return { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2, rx: rr.left, ry: rr.top, rw: rr.width, rh: rr.height };
      });
      if (cz) {
        await a.pag.evaluate((q) => window.__tutCaja({ x: q.rx, y: q.ry, w: q.rw, h: q.rh }, "Marco «Cortar Z» y el modelo se abre para ver el interior.", { x: 0, y: 0, w: 1280, h: 720 }), cz);
        await a.quieto(4, 340);
        await a.pag.evaluate(() => window.__tutSinCaja());
        await clicRojoPx(a, cz.x, cz.y);
      }
      // Limpiar cualquier rectángulo de selección o regla a medias que haya
      // quedado colgando sobre el modelo antes del giro final.
      await a.pag.keyboard.press("Escape");
      await a.pag.evaluate(() => { try { window.__hekatanCadState?.setTool?.("select"); } catch(e){} try { window.__hekatanClearMeasure && window.__hekatanClearMeasure(); } catch(e){} });
      await a.quieto(3, 340);   // ya se ve el corte a media altura
      await orbit(a, 120, -30, 5);
      await orbit(a, -90, 20, 5);
    },
  },
];
