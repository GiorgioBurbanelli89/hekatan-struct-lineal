/**
 * Tutorial 6 — La CAPILLA como estructura ANALÍTICA, dibujada solo con el
 * cursor y el menú (nada de comandos). El arco se DISCRETIZA en líneas (ETABS
 * no admite curvas). La cubierta se rellena como ÁREA (zinc / membrana).
 *
 * Construcción: en cada eje (Y = 0, 3, 6, 9, 12) un pórtico = 2 columnas + un
 * arco de 3 puntos discretizado; luego vigas longitudinales (cumbrera y aleros)
 * y la cubierta de zinc como paños de área entre pórticos.
 */
export const titulo = "Hekatan Struct · la capilla analítica";
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

// Cursor visible tramo a tramo (capturando fotograma). `pasos` alto = más lento.
const mover = async (a, x, y, pasos = 8) => {
  const p0 = await a.pag.evaluate(() => window.__tutXY || { x: 640, y: 300 });
  for (let i = 1; i <= pasos; i++) {
    const cx = p0.x + (x - p0.x) * (i / pasos), cy = p0.y + (y - p0.y) * (i / pasos);
    await a.pag.mouse.move(cx, cy);
    await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x: cx, y: cy });
    await a.quieto(1, 45);
  }
};
// Clic en un punto del MUNDO (con cursor rojo). `lento` para el paso didáctico.
const clk = async (a, wx, wy, wz, lento = false) => {
  const s = await proj(a, wx, wy, wz); if (!s) return;
  await mover(a, s.x, s.y, lento ? 14 : 4); await a.quieto(lento ? 4 : 1, 240);
  await a.pag.evaluate((q) => window.__tutClick && window.__tutClick(q.x, q.y), s);
  await a.quieto(lento ? 4 : 1, 240); await a.pag.mouse.click(s.x, s.y); await a.quieto(lento ? 3 : 1, 220);
};
const setPlano = async (a, k, off = 0) => a.pag.evaluate(({ kk, off }) => {
  const gt = window.__hekatanDrawingGridTarget;
  if (gt) {
    if (kk === "xy") gt.val = { position: [0, 0, off], rotation: [Math.PI / 2, 0, 0] };
    else if (kk === "xz") gt.val = { position: [0, off, 0], rotation: [0, 0, 0] };
    else gt.val = { position: [off, 0, 0], rotation: [0, 0, Math.PI / 2] };
  }
  try { window.__hekatanCadState.get().workPlane = kk; } catch (e) {}
}, { kk: k, off });
const setTool = async (a, t) => a.pag.evaluate((tt) => { try { window.__hekatanCadState.setTool(tt); } catch (e) {} }, t);
// Cámara manual (fiable): posición + objetivo sobre la cámara activa.
const vista = async (a, p, t) => a.pag.evaluate(({ p, t }) => {
  const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera);
  if (!h) return; const c = h.__ctx;
  c.camera.position.set(p[0], p[1], p[2]); if (c.camera.up) c.camera.up.set(0, 0, 1);
  c.controls.target.set(t[0], t[1], t[2]); c.camera.lookAt(t[0], t[1], t[2]);
  c.controls.update(); c.render();
}, { p, t });
const FRENTE = [[12, -10, 7.5], [2.5, 0.8, 2.8]];   // iso CERCANA al primer pórtico (se ve el arco curvo)
const ISO = [[20, -14, 13], [3, 6, 2]];              // isométrica del conjunto (probada en dbg)
const limpiar = async (a) => { await a.pag.keyboard.press("Escape"); await a.pag.evaluate(() => { try { window.__hekatanCadState?.setTool?.(null); } catch(e){} try { window.__hekatanClearMeasure && window.__hekatanClearMeasure(); } catch(e){} }); };
const linea = async (a, p, q) => { await setTool(a, "line"); await clk(a, ...p); await clk(a, ...q); await a.pag.keyboard.press("Escape"); };
const arco = async (a, p1, p2, p3, lento = false) => { await setTool(a, "arc"); await clk(a, ...p1, lento); await clk(a, ...p2, lento); await clk(a, ...p3, lento); };
const poli = async (a, pts) => { await setTool(a, "polyline"); for (const p of pts) await clk(a, ...p); await a.pag.keyboard.press("Escape"); };
const areaq = async (a, pts) => { await setTool(a, "area"); for (const p of pts) await clk(a, ...p); await a.quieto(2, 240); };
const YS = [0, 3, 6, 9, 12];

// Dibuja un pórtico (2 columnas + arco discretizado) en el plano XZ del eje Y.
const portico = async (a, Y, lento = false) => {
  await setPlano(a, "xz", Y);
  await linea(a, [0, Y, 0], [0, Y, 3]);
  await linea(a, [6, Y, 0], [6, Y, 3]);
  await arco(a, [0, Y, 3], [3, Y, 5], [6, Y, 3], lento);
};

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("La capilla analítica", "Tutorial 6", 16); } },
  {
    rotulo: "1 · Lienzo limpio, plano frontal, arco en 8 líneas",
    hacer: async (a) => {
      await a.pag.evaluate(() => {
        try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo","0"); } catch(e){}
        try { window.__hekatanDrawingPoints.val=[]; window.__hekatanDrawingPolylines.val=[]; window.__hekatanDrawingAreas.val=[]; window.__hekatanRebuild?.(); } catch(e){}
        try { window.__hekatanRibbonPlegar?.(true); } catch(e){}
        window.__hekatanSnapEnabled = true; window.__hekatanSnap2D = 0.5;
        window.__hekatanArcSegs = 8;   // el arco se discretiza en 8 líneas rectas
      });
      await a.general(); await a.quieto(1, 200); await vista(a, ...FRENTE); await a.quieto(3, 320);
    },
  },
  {
    rotulo: "2 · Primer pórtico: 2 columnas + ARCO discretizado (3 puntos)",
    hacer: async (a) => {
      await vista(a, ...FRENTE);
      await setPlano(a, "xz", 0);
      await linea(a, [0, 0, 0], [0, 0, 3]);
      await linea(a, [6, 0, 0], [6, 0, 3]);
      await a.quieto(2, 300);
      await arco(a, [0, 0, 3], [3, 0, 5], [6, 0, 3], true);   // arco lento — se ve la discretización en 8 líneas
      await limpiar(a); await a.quieto(5, 360);
    },
  },
  {
    rotulo: "3 · Repito el pórtico a lo largo (ejes Y = 3, 6, 9, 12)",
    hacer: async (a) => { await vista(a, ...ISO); await a.quieto(2, 300); for (const Y of [3, 6, 9, 12]) await portico(a, Y); await limpiar(a); await vista(a, ...ISO); await a.quieto(3, 320); },
  },
  {
    rotulo: "4 · Vigas longitudinales: cumbrera y aleros",
    hacer: async (a) => {
      await vista(a, ...ISO);
      await setPlano(a, "xy", 3); await poli(a, YS.map((Y) => [0, Y, 3])); await poli(a, YS.map((Y) => [6, Y, 3]));
      await setPlano(a, "xy", 5); await poli(a, YS.map((Y) => [3, Y, 5]));
      await limpiar(a); await vista(a, ...ISO); await a.quieto(3, 320);
    },
  },
  {
    rotulo: "5 · La cubierta de ZINC como paños de área (membrana)",
    hacer: async (a) => {
      await vista(a, ...ISO);
      for (let i = 0; i < YS.length - 1; i++) {
        const A = YS[i], B = YS[i + 1];
        await areaq(a, [[0, A, 3], [3, A, 5], [3, B, 5], [0, B, 3]]);
        await areaq(a, [[3, A, 5], [6, A, 3], [6, B, 3], [3, B, 5]]);
      }
      await limpiar(a); await vista(a, ...ISO); await a.quieto(4, 340);
    },
  },
  {
    rotulo: "6 · La capilla analítica terminada — giramos para verla",
    hacer: async (a) => {
      await limpiar(a);
      const host = async () => a.pag.evaluate(() => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const r = h.getBoundingClientRect(); return { x: r.left + r.width/2, y: r.top + r.height/2 }; });
      const c = await host();
      await a.pag.mouse.move(c.x, c.y); await a.pag.mouse.down();
      for (let i = 1; i <= 20; i++) { await a.pag.mouse.move(c.x + i*7, c.y - i*1.2); await a.pag.evaluate((q)=>window.__tutCursor&&window.__tutCursor(q.x,q.y),{x:c.x+i*7,y:c.y-i*1.2}); await a.quieto(1, 55); }
      await a.pag.mouse.up(); await a.quieto(4, 340);
    },
  },
];
