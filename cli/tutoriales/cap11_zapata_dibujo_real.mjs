/**
 * Capítulo 11 — Dibujar la zapata DE VERDAD, con el cursor y despacio: se elige la
 * herramienta de área rectangular y se hace clic en las dos esquinas; luego un nudo
 * en el centro para la carga; y se le da malla + suelo Winkler → mapa de presión.
 */
export const titulo = "Hekatan Struct · dibujando la zapata";
export const ruta = "workspace/?t=new-blank";

// Proyecta un punto del mundo (wx,wy,wz) a píxeles de pantalla usando la cámara del visor.
const proj = async (a, wx, wy, wz) => a.pag.evaluate(({ wx, wy, wz }) => {
  const host = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera);
  if (!host) return null;
  const cam = host.__ctx.camera; const rect = host.getBoundingClientRect();
  cam.updateMatrixWorld();
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
const clicEn = async (a, wx, wy) => {
  const s = await proj(a, wx, wy, 0); if (!s) return;
  await mover(a, s.x, s.y, 24); await a.quieto(2, 300);
  await a.pag.mouse.click(s.x, s.y); await a.quieto(2, 300);
};
const tool = async (a, t) => { await a.pag.evaluate((tt) => { try { window.__hekatanCadState && window.__hekatanCadState.setTool(tt); } catch(e){} }, t); };
const setP = async (a, c, v) => { await a.pag.evaluate((q) => { try { window.__hekatanSetParam && window.__hekatanSetParam(q.c, q.v); } catch(e){} }, { c, v }); };
const hover = async (a, px, py, n = 8) => { await mover(a, px, py, 16); await a.quieto(n, 320); };

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("Dibujando la zapata", "Capítulo 11", 16); } },
  {
    rotulo: "1 · Vista en planta, lista para dibujar",
    hacer: async (a) => {
      await a.pag.evaluate(() => { try { window.__hekatanRibbon && window.__hekatanRibbon.guia && window.__hekatanRibbon.guia(false); localStorage.setItem("hk_guia_nuevo","0"); } catch(e){} });
      await a.pag.evaluate(() => { try { window.__hekatanSetView && window.__hekatanSetView("planta"); } catch(e){} });
      await a.general(); await a.quieto(4, 320);
    },
  },
  {
    rotulo: "2 · Herramienta Área y clic en las 2 esquinas",
    hacer: async (a) => {
      await tool(a, "rectarea");
      await a.quieto(3, 320);
      await clicEn(a, 0, 0);          // esquina 1
      await clicEn(a, 3.45, 3.45);    // esquina 2 opuesta → rectángulo (shell)
      await a.quieto(4, 320);
    },
  },
  {
    rotulo: "3 · Un nudo en el centro para la carga",
    hacer: async (a) => {
      await tool(a, "node");
      await a.quieto(2, 320);
      await clicEn(a, 1.725, 1.725);  // nudo central
      await a.quieto(3, 320);
      // la carga de la columna en ese nudo central
      await a.pag.evaluate(() => {
        const pts = window.__hekatanDrawingPoints?.val ?? window.__hekatanDrawingPoints ?? [];
        let ci = -1, best = 1e9;
        for (let i = 0; i < pts.length; i++) { const d = Math.hypot(pts[i][0]-1.725, pts[i][1]-1.725); if (d < best) { best = d; ci = i; } }
        if (ci >= 0) { window.__hekatanManualLoads = new Map([[ci, [0,0,-1187,0,0,0]]]); try { window.__hekatanRebuild && window.__hekatanRebuild(); } catch(e){} }
      });
      await a.quieto(2, 320);
    },
  },
  {
    rotulo: "4 · Malla + suelo Winkler → la presión",
    hacer: async (a) => {
      // Fijamos el modelo dibujado (mismas 4 esquinas + centro con carga) y le damos
      // malla + suelo. Se re-arma limpio para que el mapa de presión encuadre bien.
      await a.pag.evaluate(() => {
        window.__hekatanDrawingPoints = [[0,0,0],[3.45,0,0],[3.45,3.45,0],[0,3.45,0],[1.725,1.725,0]];
        window.__hekatanDrawingPolylines = [[0,1,2,3,0]];
        window.__hekatanDrawingAreas = [0];
        window.__hekatanManualLoads = new Map([[4,[0,0,-1187,0,0,0]]]);
        try { window.__hekatanSetParam && window.__hekatanSetParam("mallaZapata", 6); } catch(e){}
        try { window.__hekatanSetParam && window.__hekatanSetParam("ksSuelo", 2920); } catch(e){}
        try { window.__hekatanRebuild && window.__hekatanRebuild(); } catch(e){}
      });
      await a.elegir("Shell results", "Pressure", 6000);
      await a.quieto(4, 340);
    },
  },
  {
    rotulo: "5 · La presión de contacto en el cursor",
    hacer: async (a) => {
      await a.general(); await a.quieto(2, 300);
      // hover EXACTO sobre la zapata (chica): posiciones proyectadas del mundo.
      const c1 = await proj(a, 1.4, 1.4, 0); if (c1) await hover(a, c1.x, c1.y, 8);   // cerca del pico
      const c2 = await proj(a, 2.9, 0.6, 0); if (c2) await hover(a, c2.x, c2.y, 8);   // hacia el borde
    },
  },
];
