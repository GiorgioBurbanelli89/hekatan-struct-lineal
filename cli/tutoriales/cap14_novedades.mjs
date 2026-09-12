/**
 * Capítulo 14 — NOVEDADES: rellenar área (hover + clic), llenar todas las celdas
 * cerradas, la regla de medir, el panel corredizo y el botón de volver / menú.
 * Todo con el cursor (que se pone ROJO al hacer clic).
 */
export const titulo = "Hekatan Struct · novedades";
export const ruta = "workspace/?t=new-blank";

const proj = async (a, wx, wy, wz = 0) => a.pag.evaluate(({ wx, wy, wz }) => {
  const host = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera);
  if (!host) return null;
  const cam = host.__ctx.camera; const rect = host.getBoundingClientRect(); cam.updateMatrixWorld();
  const ap = (m, v) => { const e = m.elements; return [
    e[0]*v[0]+e[4]*v[1]+e[8]*v[2]+e[12]*v[3], e[1]*v[0]+e[5]*v[1]+e[9]*v[2]+e[13]*v[3],
    e[2]*v[0]+e[6]*v[1]+e[10]*v[2]+e[14]*v[3], e[3]*v[0]+e[7]*v[1]+e[11]*v[2]+e[15]*v[3] ]; };
  let v = ap(cam.matrixWorldInverse, [wx, wy, wz, 1]); v = ap(cam.projectionMatrix, v);
  return { x: rect.left + (v[0]/v[3]*0.5+0.5)*rect.width, y: rect.top + (-v[1]/v[3]*0.5+0.5)*rect.height };
}, { wx, wy, wz });

const mover = async (a, x, y, steps = 22) => {
  await a.pag.mouse.move(x, y, { steps });
  await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x, y });
};
const clicRojoW = async (a, wx, wy, wz = 0) => {
  const s = await proj(a, wx, wy, wz); if (!s) return;
  await mover(a, s.x, s.y, 24); await a.quieto(3, 300);
  await a.pag.evaluate((q) => window.__tutClick && window.__tutClick(q.x, q.y), s);
  await a.quieto(3, 300); await a.pag.mouse.click(s.x, s.y); await a.quieto(2, 300);
};
const clicRojoPx = async (a, x, y) => {
  await mover(a, x, y, 20); await a.quieto(2, 300);
  await a.pag.evaluate((q) => window.__tutClick && window.__tutClick(q.x, q.y), { x, y });
  await a.quieto(3, 300); await a.pag.mouse.click(x, y); await a.quieto(2, 300);
};
const botonEnCarpeta = async (a, carpeta, boton, nota) => {
  const r = await a.pag.evaluate(({ f, b }) => {
    let btn = [...document.querySelectorAll("button")].find((x) => (x.textContent || "").includes(b));
    if (!btn || btn.getBoundingClientRect().width < 5) {
      const fld = [...document.querySelectorAll(".tp-fldv_b")].find((x) => (x.textContent || "").includes(f));
      if (fld) { fld.scrollIntoView({ block: "center" }); fld.click(); }
      btn = [...document.querySelectorAll("button")].find((x) => (x.textContent || "").includes(b));
    }
    if (!btn) return null; btn.scrollIntoView({ block: "center" });
    const rc = btn.getBoundingClientRect(); return { x: rc.left, y: rc.top, w: rc.width, h: rc.height };
  }, { f: carpeta, b: boton });
  if (!r || r.w < 5) return false;
  await mover(a, r.x + r.w - 20, r.y + r.h / 2, 22);
  await a.pag.evaluate((q) => window.__tutCaja(q.r, q.n, { x: 0, y: 0, w: 1280, h: 640 }), { r, n: nota });
  await a.quieto(5, 330);
  await a.pag.evaluate((q) => window.__tutClick && window.__tutClick(q.x, q.y), { x: r.x + r.w - 20, y: r.y + r.h / 2 });
  await a.quieto(2, 300);
  await a.pag.evaluate((b) => { const x = [...document.querySelectorAll("button")].find((y) => (y.textContent || "").includes(b)); if (x) x.click(); }, boton);
  await a.pag.evaluate(() => window.__tutSinCaja());
  await a.quieto(2, 300); return true;
};
const rectDe = async (a, sel) => a.pag.evaluate((s) => { const el = document.querySelector(s); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }, sel);

const GRID = () => {
  const P = []; for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) P.push([i * 2, j * 2, 0]);
  const idx = (i, j) => j * 3 + i; const PL = [];
  for (let j = 0; j < 3; j++) for (let i = 0; i < 2; i++) PL.push([idx(i, j), idx(i + 1, j)]);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) PL.push([idx(i, j), idx(i, j + 1)]);
  return { P, PL };
};

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("Novedades", "Capítulo 14", 16); } },
  {
    rotulo: "1 · Dibujo celdas cerradas CON EL CURSOR (herramienta Rectángulo)",
    hacer: async (a) => {
      await a.pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo","0"); } catch(e){} });
      // Lienzo limpio, ribbon abierto (se ve que tapa; luego el cursor lo pliega).
      await a.pag.evaluate(() => {
        window.__hekatanDrawingPoints.val = []; window.__hekatanDrawingPolylines.val = []; window.__hekatanDrawingAreas.val = [];
        try { window.__hekatanRebuild?.(); } catch(e){}
        try { window.__hekatanRibbonPlegar?.(false); } catch(e){}
      });
      await a.general(); await a.quieto(2, 300);
      // Grid snap a 1 m: el clic en vista iso cae en enteros (si no, el
      // raycast deja 2.95 en vez de 3.0 y la cota sale sucia).
      await a.pag.evaluate(() => { window.__hekatanSnapEnabled = true; window.__hekatanSnap2D = 1.0; });
      // Herramienta Rectángulo: cada rectángulo = una celda cerrada (4 barras).
      // Se dibujan CON EL CURSOR (2 clics cada uno), nada inyectado por código.
      await a.pag.evaluate(() => window.__hekatanCadState.setTool("rect"));
      await clicRojoW(a, 0, 0, 0); await clicRojoW(a, 3, 3, 0);   // celda 1
      await clicRojoW(a, 3, 0, 0); await clicRojoW(a, 6, 3, 0);   // celda 2
      await clicRojoW(a, 0, 3, 0); await clicRojoW(a, 3, 6, 0);   // celda 3
      await a.pag.evaluate(() => window.__hekatanCadState.setTool("select"));
      // Reencuadrar sobre lo dibujado: si no, las celdas quedan diminutas y
      // los clics siguientes (relleno, regla) caen imprecisos.
      await a.pag.evaluate(() => { try { window.__hekatanAutoFit?.(); } catch(e){} });
      await a.quieto(3, 330);
    },
  },
  {
    rotulo: "2 · Plego el menú de dibujo CON EL CURSOR (botón ▴)",
    hacer: async (a) => {
      // Enmarcar el botón de plegar para que se vea CUÁL es.
      const r = await rectDe(a, "#hk-ribbon-plegar");
      if (r) {
        await a.pag.evaluate((q) => window.__tutCaja(q.r, q.n, { x: 0, y: 0, w: 1280, h: 640 }),
          { r, n: "El menú de dibujo es opaco y tapa la escena. Este botón lo pliega." });
        await a.quieto(5, 340);
        await a.pag.evaluate(() => window.__tutSinCaja());
        // Clic REAL del cursor rojo sobre el botón ▴.
        await clicRojoPx(a, r.x + r.w / 2, r.y + r.h / 2);
        await a.quieto(4, 340);   // ya plegado: se ve toda la geometría
      }
    },
  },
  {
    rotulo: "3 · Rellenar área: hover resalta, clic crea",
    hacer: async (a) => {
      await a.pag.evaluate(() => window.__hekatanCadState.setTool("fillarea"));
      const s = await proj(a, 1, 1, 0);   // centro de una celda
      await mover(a, s.x, s.y, 24); await a.quieto(4, 340);   // se ve el HOVER naranja
      await a.pag.evaluate((q) => window.__tutClick && window.__tutClick(q.x, q.y), s);
      await a.quieto(2, 300); await a.pag.mouse.click(s.x, s.y); await a.quieto(3, 330);
    },
  },
  {
    rotulo: "4 · Llenar TODAS las celdas cerradas",
    hacer: async (a) => {
      await botonEnCarpeta(a, "Áreas (shells)", "Llenar TODAS", "Un clic: rellena TODAS las celdas cerradas de golpe.");
      await a.pag.evaluate(() => { const f = [...document.querySelectorAll(".tp-fldv_b")].find((x) => (x.textContent||"").includes("Áreas (shells)")); if (f) f.click(); });
      await a.general(); await a.quieto(4, 340);
    },
  },
  {
    rotulo: "5 · La regla: medir / acotar",
    hacer: async (a) => {
      await a.pag.evaluate(() => window.__hekatanCadState.setTool("medir"));
      await clicRojoW(a, 0, 0, 0);
      await clicRojoW(a, 6, 0, 0);
      // Cerrar la medición para que no quede una goma elástica (segunda cota
      // en vivo) colgando del cursor; queda solo la cota fija 6.000 m.
      await a.pag.keyboard.press("Escape");
      await a.pag.evaluate(() => { try { window.__hekatanCadState.setTool("select"); } catch(e){} });
      await a.quieto(5, 350);   // se ve la cota limpia (6.000 m, engancha a los nudos)
    },
  },
  {
    rotulo: "6 · Puerta corrediza DERECHA: ocultar y mostrar el panel",
    hacer: async (a) => {
      const r = await rectDe(a, "#hk-pane-toggle");
      if (r) { await clicRojoPx(a, r.x + r.w / 2, r.y + r.h / 2); await a.quieto(4, 340);
               await clicRojoPx(a, r.x + r.w / 2, r.y + r.h / 2); await a.quieto(3, 320); }
    },
  },
  {
    rotulo: "7 · Puerta corrediza IZQUIERDA: los ajustes también",
    hacer: async (a) => {
      const r = await rectDe(a, "#hk-settings-toggle");
      if (r) { await clicRojoPx(a, r.x + r.w / 2, r.y + r.h / 2); await a.quieto(4, 340);
               await clicRojoPx(a, r.x + r.w / 2, r.y + r.h / 2); await a.quieto(3, 320); }
    },
  },
  {
    rotulo: "8 · Volver al menú principal (botón 🏠 Menú)",
    hacer: async (a) => {
      // Soltar la herramienta y borrar el tooltip de osnap que si no queda
      // encima del botón, tapándolo.
      await a.pag.evaluate(() => { try { window.__hekatanCadState?.setTool?.(null); } catch(e){}
        document.querySelectorAll(".hk-osnap-tip,#hk-osnap-tip,[data-osnap-tip]").forEach(n=>n.remove()); });
      await a.quieto(2, 300);
      const r = await rectDe(a, "#hk-home-btn");
      if (r) {
        // Enmarcar el botón para que se vea CUÁL es antes de pulsarlo.
        await a.pag.evaluate((q) => window.__tutCaja(q.r, q.n, { x: 0, y: 0, w: 1280, h: 640 }),
          { r, n: "🏠 Menú: vuelve a la ventana principal desde cualquier ejemplo." });
        await a.quieto(4, 340);
        await a.pag.evaluate(() => window.__tutSinCaja());
        await clicRojoPx(a, r.x + r.w / 2, r.y + r.h / 2);
        await a.quieto(5, 350);
      }
    },
  },
];
