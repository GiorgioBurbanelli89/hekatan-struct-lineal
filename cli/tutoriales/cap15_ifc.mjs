/**
 * Tutorial 5 — el VISOR IFC, SOLO con la cinta de acceso rápido (19-sep-2026, Jorge:
 * «debes usar solo acceso rápido»): importar y ver el modelo, ocultar/aislar objetos (su
 * propio panel), medir con la regla y cortar en Z desde la pestaña «IFC y cortes».
 *
 * Límite honesto: el diálogo de archivos del sistema no se graba. Se señala con el cursor
 * «📥 Importar» de la cinta y se carga el MISMO IFC.
 */
import { mover, clicRojo, caja, rect, panel, proj, estado, pestana, boton, senalar, casilla, soltar } from "./_cinta.mjs";
export const titulo = "Hekatan Struct · el visor IFC";
export const ruta = "workspace/?t=ifc-viewer";

// girar con la RUEDA PULSADA (botón central), que es el giro de la app: el izquierdo selecciona
const girar = async (a, dx, dy, n = 6) => {
  const r = await a.pag.evaluate(() => { const h = document.querySelector("#viewer"); const rc = h.getBoundingClientRect(); return { x: rc.left, y: rc.top, w: rc.width, h: rc.height }; });
  const cx = r.x + r.w * 0.5, cy = r.y + r.h * 0.55;
  await mover(a, cx, cy, 10);
  await a.pag.mouse.down({ button: "middle" });
  const K = 18;
  for (let i = 1; i <= K; i++) {
    const x = cx + (dx * i) / K, y = cy + (dy * i) / K;
    await a.pag.mouse.move(x, y);
    await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x, y });
    await a.quieto(1, 55);
  }
  await a.pag.mouse.up({ button: "middle" });
  await a.quieto(n, 320);
};
const porId = (a, id) => rect(a, (id) => document.getElementById(id), id);

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("El visor IFC", "Tutorial 5", 16); } },
  {
    rotulo: "1 · Cinta › pestaña IFC y cortes › Importar; se ve el modelo en 3D",
    hacer: async (a) => {
      await a.general(); await a.quieto(2, 320);
      await panel(a, "izq", false); await panel(a, "der", false);
      const ab = await porId(a, "hk-ribbon-abrir");
      if (ab && ab.rw > 0) { await mover(a, ab.x, ab.y, 12); await caja(a, { x: ab.rx - 4, y: ab.ry - 4, w: ab.rw + 8, h: ab.rh + 8 }, "✏ abre la cinta de acceso rápido.", 4); await clicRojo(a, ab.x, ab.y, false); }
      await pestana(a, "ifc", "Pestaña IFC y cortes.");
      await senalar(a, "^📥 ?Importar", "Importar: se elige el .ifc en el diálogo del sistema.", 6);
      await a.pag.evaluate(async () => {
        const base = location.pathname.startsWith("/hekatan-struct-lineal/") ? "/hekatan-struct-lineal/" : "/";
        const M = await fetch(base + "ifc_church.json").then((r) => r.json());
        window.__hekatanIfcMesh = M;
        try { window.__hekatanRebuild && window.__hekatanRebuild(); } catch (e) {}
        try { window.__hekatanAutoFit && window.__hekatanAutoFit(); } catch (e) {}
      });
      await a.quieto(3, 360);
      await girar(a, 150, -20, 2);
      await boton(a, "^⛶ ?Encuadrar", "Encuadrar: el edificio en el hueco libre.");
      await a.quieto(3, 340);
    },
  },
  {
    rotulo: "2 · «Objetos» de la cinta: la lista del IFC; ocultar dos objetos",
    hacer: async (a) => {
      await boton(a, "^🏛 ?Objetos", "Objetos: la lista de lo que trae el IFC.");
      const bm0 = await porId(a, "hk-ifc-min");
      const lista = await porId(a, "hk-ifc-objs");
      if (lista && lista.rh < 60 && bm0) await clicRojo(a, bm0.x, bm0.y, false);   // estaba minimizada
      const r = await porId(a, "hk-ifc-objs");
      if (r) await caja(a, { x: r.rx, y: r.ry, w: r.rw, h: r.rh }, "Cada objeto: color, triángulos, ocultar y «solo».", 5);
      for (const idx of [0, 2]) {
        const cb = await rect(a, (i) => document.querySelector(`[data-ifc-vis="${i}"]`), idx);
        if (cb) await clicRojo(a, cb.x, cb.y, false);
      }
      await a.quieto(3, 340);
    },
  },
  {
    rotulo: "3 · Ese panel se minimiza y se esconde (puerta); «ver todos»",
    hacer: async (a) => {
      const bm = await porId(a, "hk-ifc-min");
      if (bm) { await clicRojo(a, bm.x, bm.y, false); await a.quieto(3, 340); await clicRojo(a, bm.x, bm.y, false); }
      const bs = await porId(a, "hk-ifc-slide");
      if (bs) { await clicRojo(a, bs.x, bs.y, false); await a.quieto(3, 340); }
      await boton(a, "^🏛 ?Objetos", "Y vuelve desde la cinta.");
      const vt = await porId(a, "hk-ifc-all");
      if (vt) await clicRojo(a, vt.x, vt.y, false);
      const sl = await porId(a, "hk-ifc-slide");
      if (sl) await clicRojo(a, sl.x, sl.y, false);
      await a.quieto(2, 320);
    },
  },
  {
    rotulo: "4 · Pestaña Dibujo › Medir: la regla engancha a las esquinas del IFC",
    hacer: async (a) => {
      await pestana(a, "dibujo", "Pestaña Dibujo.");
      await boton(a, "^📏 ?Medir", "Medir: dos clics sobre el modelo.");
      const r = await a.pag.evaluate(() => { const h = document.querySelector("#viewer"); const rc = h.getBoundingClientRect(); return { x: rc.left, y: rc.top, w: rc.width, h: rc.height }; });
      await clicRojo(a, r.x + r.w * 0.42, r.y + r.h * 0.60, false);
      await clicRojo(a, r.x + r.w * 0.60, r.y + r.h * 0.55, false);
      await a.quieto(5, 350);
      await soltar(a);
    },
  },
  {
    rotulo: "5 · Pestaña IFC y cortes: altura del corte en la casilla Z y «Corte Z»",
    hacer: async (a) => {
      await pestana(a, "ifc", "Pestaña IFC y cortes.");
      const zmid = await a.pag.evaluate(() => { const bb = window.__hekatanIfcMesh?.bbox; return bb ? +(((bb[0][2] + bb[1][2]) / 2).toFixed(1)) : 5; });
      await casilla(a, "posZ", zmid, `Altura del corte: Z = ${zmid} m.`);
      await boton(a, "^✂ ?Corte Z", "Corte Z: el edificio se abre a esa altura.");
      await a.quieto(6, 360);
    },
  },
  {
    rotulo: "6 · El modelo abierto: se gira con la rueda pulsada para ver el interior",
    hacer: async (a) => {
      await girar(a, 120, -30, 2);
      await boton(a, "^⛶ ?Encuadrar");
      await girar(a, -90, 20, 2);
      await boton(a, "^⛶ ?Encuadrar");
      await a.quieto(5, 340);
    },
  },
];
