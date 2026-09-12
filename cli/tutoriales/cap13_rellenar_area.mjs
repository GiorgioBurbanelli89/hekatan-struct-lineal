/**
 * Capítulo 13 — RELLENAR ÁREA: 4 barras que cierran un recuadro, y con un clic
 * DENTRO del vacío se crea el área (shell). Como el "draw floor" de ETABS pero
 * sobre barras sueltas que cierran un lazo, sin necesidad de grilla. El cursor
 * se pone ROJO al hacer el clic.
 */
export const titulo = "Hekatan Struct · rellenar área entre barras";
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

const mover = async (a, x, y, steps = 24) => {
  await a.pag.mouse.move(x, y, { steps });
  await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x, y });
};
// Clic con cursor ROJO en un punto del MUNDO.
const clicRojoW = async (a, wx, wy, wz = 0) => {
  const s = await proj(a, wx, wy, wz); if (!s) return;
  await mover(a, s.x, s.y, 26); await a.quieto(3, 320);
  await a.pag.evaluate((q) => window.__tutClick && window.__tutClick(q.x, q.y), s);
  await a.quieto(3, 320);
  await a.pag.mouse.click(s.x, s.y);
  await a.quieto(3, 320);
};

// Resalta + clickea (DOM) un botón que vive en una carpeta plegada del panel.
const botonEnCarpeta = async (a, carpeta, boton, nota) => {
  const r = await a.pag.evaluate(({ f, b }) => {
    let btn = [...document.querySelectorAll("button")].find((x) => (x.textContent || "").includes(b));
    if (!btn || btn.getBoundingClientRect().width < 5) {
      const fld = [...document.querySelectorAll(".tp-fldv_b")].find((x) => (x.textContent || "").includes(f));
      if (fld) { fld.scrollIntoView({ block: "center" }); fld.click(); }
      btn = [...document.querySelectorAll("button")].find((x) => (x.textContent || "").includes(b));
    }
    if (!btn) return null;
    btn.scrollIntoView({ block: "center" });
    const rc = btn.getBoundingClientRect();
    return { x: rc.left, y: rc.top, w: rc.width, h: rc.height };
  }, { f: carpeta, b: boton });
  if (!r || r.w < 5) return false;
  await mover(a, r.x + r.w - 22, r.y + r.h / 2, 24);
  await a.pag.evaluate((q) => window.__tutCaja(q.r, q.n, { x: 0, y: 0, w: 1280, h: 640 }), { r, n: nota });
  await a.quieto(6, 340);
  await a.pag.evaluate((b) => { const x = [...document.querySelectorAll("button")].find((y) => (y.textContent || "").includes(b)); if (x) x.click(); }, boton);
  await a.pag.evaluate(() => window.__tutSinCaja());
  await a.quieto(2, 320);
  return true;
};

const orbit = async (a, dx, dy, n = 6) => {
  const s = await proj(a, 2, 1.5, 0); const cx = s ? s.x : 640, cy = s ? s.y : 380;
  await a.pag.mouse.move(cx, cy); await a.pag.mouse.down();
  await a.pag.mouse.move(cx + dx, cy + dy, { steps: 22 }); await a.pag.mouse.up();
  await a.quieto(n, 320);
};

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("Rellenar área entre barras", "Capítulo 13", 16); } },
  {
    rotulo: "1 · Tenemos 4 barras que cierran un recuadro",
    hacer: async (a) => {
      await a.pag.evaluate(() => { try { window.__hekatanRibbon && window.__hekatanRibbon.guia && window.__hekatanRibbon.guia(false); localStorage.setItem("hk_guia_nuevo","0"); } catch(e){} });
      await a.general(); await a.quieto(2, 320);
      // 4 barras sueltas (4 polilíneas) que cierran un cuadrilátero
      await a.pag.evaluate(() => {
        const P = window.__hekatanDrawingPoints, PL = window.__hekatanDrawingPolylines, A = window.__hekatanDrawingAreas;
        P.val = [[0,0,0],[4,0,0],[4,3,0],[0,3,0]];
        PL.val = [[0,1],[1,2],[2,3],[3,0]];
        A.val = [];
        try { window.__hekatanRebuild && window.__hekatanRebuild(); } catch(e){}
        try { window.__hekatanAutoFit && window.__hekatanAutoFit(); } catch(e){}
      });
      await a.quieto(4, 340);
    },
  },
  {
    rotulo: "2 · Herramienta «Rellenar área»",
    hacer: async (a) => {
      const ok = await botonEnCarpeta(a, "Áreas (shells)", "Rellenar área",
        "Aquí: «Rellenar área» — clic DENTRO de las 4 barras y se crea el shell.");
      if (!ok) await a.pag.evaluate(() => window.__hekatanCadState.setTool("fillarea"));
      await a.pag.evaluate(() => { const f = [...document.querySelectorAll(".tp-fldv_b")].find((x) => (x.textContent || "").includes("Áreas (shells)")); if (f) f.click(); });
      await a.pag.evaluate(() => window.__hekatanCadState.setTool("fillarea"));
      await a.quieto(2, 320);
    },
  },
  {
    rotulo: "3 · Clic DENTRO (cursor rojo) → se crea el área",
    hacer: async (a) => {
      await clicRojoW(a, 2, 1.5, 0);   // centro del recuadro
      await a.quieto(4, 340);
    },
  },
  {
    rotulo: "4 · El shell queda entre las 4 barras",
    hacer: async (a) => {
      await a.general();
      await orbit(a, 150, -25, 6);
      await orbit(a, -110, 15, 5);
    },
  },
];
