/**
 * Capítulo 11 — Dibujar la zapata DE VERDAD, con el cursor: se ve DÓNDE está la
 * herramienta de área (flecha + recuadro), se hace clic en las 2 esquinas, un nudo
 * central para la carga, se elige la formulación de placa y el suelo Winkler, y sale
 * el mapa de presión. Todo con el cursor del ratón.
 */
export const titulo = "Hekatan Struct · dibujando la zapata";
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

const mover = async (a, x, y, steps = 26) => {
  await a.pag.mouse.move(x, y, { steps });
  await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x, y });
};
const clicEn = async (a, wx, wy) => { const s = await proj(a, wx, wy); if (!s) return; await mover(a, s.x, s.y, 26); await a.quieto(3, 320); await a.pag.mouse.click(s.x, s.y); await a.quieto(2, 300); };
const tool = async (a, t) => { await a.pag.evaluate((tt) => { try { window.__hekatanCadState && window.__hekatanCadState.setTool(tt); } catch(e){} }, t); };
const setP = async (a, c, v) => { await a.pag.evaluate((q) => { try { window.__hekatanSetParam && window.__hekatanSetParam(q.c, q.v); } catch(e){} }, { c, v }); };
const hoverW = async (a, wx, wy, n = 8) => { const s = await proj(a, wx, wy); if (!s) return; await mover(a, s.x, s.y, 18); await a.quieto(n, 340); };

// Resalta y clickea un botón que vive en una carpeta plegada del panel: la abre,
// lo trae a la vista, lleva el cursor + FLECHA hasta él y hace clic. Se ve dónde está.
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
  await a.quieto(7, 340);
  // Clic por el DOM (el botón EXACTO por texto) para no errar de fila.
  await a.pag.evaluate((b) => { const btn = [...document.querySelectorAll("button")].find((x) => (x.textContent || "").includes(b)); if (btn) btn.click(); }, boton);
  await a.pag.evaluate(() => window.__tutSinCaja());
  await a.quieto(2, 320);
  return true;
};

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("Dibujando la zapata", "Capítulo 11", 16); } },
  {
    rotulo: "1 · Archivo nuevo, lienzo en blanco",
    hacer: async (a) => {
      await a.pag.evaluate(() => { try { window.__hekatanRibbon && window.__hekatanRibbon.guia && window.__hekatanRibbon.guia(false); localStorage.setItem("hk_guia_nuevo","0"); } catch(e){} });
      await a.general(); await a.quieto(3, 340);
    },
  },
  {
    rotulo: "2 · Aquí está la herramienta: Área rectangular",
    hacer: async (a) => {
      const ok = await botonEnCarpeta(a, "Áreas (shells)", "Área rectangular", "Aquí: «Área rectangular» (2 clics). Ábrela en «Áreas (shells)».");
      if (!ok) await tool(a, "rectarea");
      // Cerrar la carpeta «Áreas (shells)»: expandida, sus botones tapan la zona de
      // dibujo y el 2º clic caía sobre «Área libre» → cambiaba de herramienta.
      await a.pag.evaluate(() => { const f = [...document.querySelectorAll(".tp-fldv_b")].find((x) => (x.textContent || "").includes("Áreas (shells)")); if (f) f.click(); });
      await tool(a, "rectarea");
      await a.quieto(2, 320);
    },
  },
  {
    rotulo: "3 · Clic en las 2 esquinas opuestas",
    hacer: async (a) => {
      await tool(a, "rectarea");     // por si el botón quedó a medio activar
      await clicEn(a, 0, 0);
      await clicEn(a, 3.45, 3.45);
      await a.quieto(4, 340);
    },
  },
  {
    rotulo: "4 · Un nudo en el centro para la carga",
    hacer: async (a) => {
      await tool(a, "node");
      await a.quieto(2, 320);
      await clicEn(a, 1.725, 1.725);
      await a.pag.evaluate(() => {
        const st = window.__hekatanDrawingPoints; const pts = (st && st.val) ? st.val : st;
        let ci = -1, best = 1e9;
        for (let i = 0; i < (pts||[]).length; i++) { const d = Math.hypot(pts[i][0]-1.725, pts[i][1]-1.725); if (d < best) { best = d; ci = i; } }
        if (ci >= 0) { window.__hekatanManualLoads = new Map([[ci, [0,0,-1187,0,0,0]]]); try { window.__hekatanRebuild && window.__hekatanRebuild(); } catch(e){} }
      });
      await a.quieto(3, 320);
    },
  },
  {
    rotulo: "5 · Malla, formulación de placa y suelo Winkler",
    hacer: async (a) => {
      await tool(a, "select");
      await setP(a, "mallaZapata", 6);
      await setP(a, "formaPlaca", 0);   // Shell-Thick (Mindlin) para zapata gruesa
      await setP(a, "ksSuelo", 2920);
      await a.elegir("Shell results", "Pressure", 6000);
      await a.quieto(5, 340);
    },
  },
  {
    rotulo: "6 · La presión de contacto en el cursor",
    hacer: async (a) => {
      await hoverW(a, 1.4, 1.4, 8);
      await hoverW(a, 2.9, 0.6, 8);
    },
  },
];
