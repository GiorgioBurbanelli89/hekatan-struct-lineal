/**
 * Tutorial 6 — La CAPILLA como estructura ANALÍTICA, dibujada solo con el
 * cursor y el menú (nada de comandos). El arco de MEDIO PUNTO se DISCRETIZA en
 * líneas rectas (ETABS no admite curvas). La bóveda se cierra con vigas
 * longitudinales en cada nudo del arco y la cubierta de zinc son las celdas
 * cerradas rellenas como área (membrana), siguiendo la curva.
 *
 * Receta validada headless (v9): arco z=6 en los 5 pórticos, 23 polilíneas,
 * «Llenar TODAS» = 24 paños. Dos trampas que hubo que sortear:
 *   • __hekatanDrawArc calculaba el centro en 2D (x,y) → deforme en planos
 *     verticales. ARREGLADO (circuncentro 3D).
 *   • El enganche a EJES auxiliares (__hekatanAxisSnap, 12 px desde el último
 *     punto) capturaba el vértice del arco y los nudos de las vigas → se apaga
 *     como ajuste de precisión antes de dibujar.
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
const clicPx = async (a, x, y, lento = false) => {
  await mover(a, x, y, lento ? 14 : 4); await a.quieto(lento ? 4 : 1, 240);
  await a.pag.evaluate((q) => window.__tutClick && window.__tutClick(q.x, q.y), { x, y });
  await a.quieto(lento ? 4 : 1, 240); await a.pag.mouse.click(x, y); await a.quieto(lento ? 3 : 1, 220);
};
// Clic en un punto del MUNDO (con cursor rojo). `lento` para el paso didáctico.
const clk = async (a, wx, wy, wz, lento = false) => {
  const s = await proj(a, wx, wy, wz); if (!s) return;
  await clicPx(a, s.x, s.y, lento);
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
const CERCA = [[14, -12, 10], [3, 0, 3.5]];   // iso cercana al primer pórtico (se ve el arco)
const ISO = [[20, -14, 13], [3, 6, 3]];       // isométrica del conjunto (validada)
const limpiar = async (a) => { await a.pag.keyboard.press("Escape"); await a.pag.evaluate(() => { try { window.__hekatanCadState?.setTool?.(null); } catch(e){} try { window.__hekatanClearMeasure && window.__hekatanClearMeasure(); } catch(e){} }); };
const linea = async (a, p, q) => { await setTool(a, "line"); await clk(a, ...p); await clk(a, ...q); await a.pag.keyboard.press("Escape"); };
const arco = async (a, p1, p2, p3, lento = false) => { await setTool(a, "arc"); await clk(a, ...p1, lento); await clk(a, ...p2, lento); await clk(a, ...p3, lento); await a.pag.keyboard.press("Escape"); };
const poli = async (a, pts) => { await setTool(a, "polyline"); for (const p of pts) await clk(a, ...p); await a.pag.keyboard.press("Escape"); };
// Botón del panel derecho (abre la carpeta si hace falta): recuadro + clic REAL con el cursor.
const boton = async (a, carpeta, texto, nota) => {
  const r = await a.pag.evaluate(({ f, b }) => {
    let btn = [...document.querySelectorAll("button")].find((x) => (x.textContent || "").includes(b));
    if (!btn || btn.getBoundingClientRect().width < 5) {
      const fld = [...document.querySelectorAll(".tp-fldv_b")].find((x) => (x.textContent || "").includes(f));
      if (fld) { fld.scrollIntoView({ block: "center" }); fld.click(); }
      btn = [...document.querySelectorAll("button")].find((x) => (x.textContent || "").includes(b));
    }
    if (!btn) return null; btn.scrollIntoView({ block: "center" });
    const rc = btn.getBoundingClientRect(); return { x: rc.left, y: rc.top, w: rc.width, h: rc.height };
  }, { f: carpeta, b: texto });
  if (!r || r.w < 5) return false;
  await mover(a, r.x + r.w / 2, r.y + r.h / 2, 10);
  await a.pag.evaluate((q) => window.__tutCaja(q.r, q.n, { x: 0, y: 0, w: 1280, h: 640 }), { r, n: nota });
  await a.quieto(5, 340);
  await a.pag.evaluate(() => window.__tutSinCaja());
  await clicPx(a, r.x + r.w / 2, r.y + r.h / 2, true);
  return true;
};
const YS = [0, 3, 6, 9, 12];
const SEG = 6;   // el arco de medio punto se discretiza en 6 líneas
// Nudo i del arco de medio punto (centro (3,·,3), radio 3): mismo reparto uniforme
// en ángulo que hace la herramienta Arco.
const nudoArco = (i) => { const th = Math.PI * (1 - i / SEG); return [3 + 3 * Math.cos(th), 3 + 3 * Math.sin(th)]; };
const portico = async (a, Y, lento = false) => {
  await setPlano(a, "xz", Y);
  await linea(a, [0, Y, 0], [0, Y, 3]);
  await linea(a, [6, Y, 0], [6, Y, 3]);
  await arco(a, [0, Y, 3], [3, Y, 6], [6, Y, 3], lento);
};

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("La capilla analítica", "Tutorial 6", 16); } },
  {
    rotulo: "1 · Lienzo limpio; el arco se discretizará en 6 líneas",
    hacer: async (a) => {
      await a.pag.evaluate((SEG) => {
        try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo","0"); } catch(e){}
        try { window.__hekatanDrawingPoints.val=[]; window.__hekatanDrawingPolylines.val=[]; window.__hekatanDrawingAreas.val=[]; window.__hekatanRebuild?.(); } catch(e){}
        try { window.__hekatanRibbonPlegar?.(true); } catch(e){}
        window.__hekatanSnapEnabled = true; window.__hekatanSnap2D = 0.5;
        window.__hekatanOrthoMode = false;     // orto apagado (fuerza horizontal)
        window.__hekatanAxisSnap = false;      // enganche a ejes apagado (captura el vértice)
        window.__hekatanArcSegs = SEG;         // discretización del arco
      }, SEG);
      await a.general(); await a.quieto(1, 200); await vista(a, ...CERCA); await a.quieto(3, 320);
    },
  },
  {
    rotulo: "2 · Primer pórtico: 2 columnas + ARCO de medio punto por 3 puntos",
    hacer: async (a) => {
      await vista(a, ...CERCA);
      await setPlano(a, "xz", 0);
      await linea(a, [0, 0, 0], [0, 0, 3]);
      await linea(a, [6, 0, 0], [6, 0, 3]);
      await a.quieto(2, 300);
      await arco(a, [0, 0, 3], [3, 0, 6], [6, 0, 3], true);   // LENTO: se ve nacer el arco en 6 barras
      await limpiar(a); await vista(a, ...CERCA); await a.quieto(6, 380);
    },
  },
  {
    rotulo: "3 · Repito el pórtico en los ejes Y = 3, 6, 9, 12",
    hacer: async (a) => { await vista(a, ...ISO); await a.quieto(2, 300); for (const Y of YS.slice(1)) await portico(a, Y); await limpiar(a); await vista(a, ...ISO); await a.quieto(3, 320); },
  },
  {
    rotulo: "4 · Vigas longitudinales en CADA nudo del arco (cierran las celdas)",
    hacer: async (a) => {
      await vista(a, ...ISO);
      await a.pag.evaluate(() => { window.__hekatanSnapEnabled = false; });   // solo osnap a nudo
      for (let i = 0; i <= SEG; i++) { const [x, z] = nudoArco(i); await setPlano(a, "xy", z); await poli(a, YS.map((Y) => [x, Y, z])); }
      await limpiar(a); await vista(a, ...ISO); await a.quieto(3, 320);
    },
  },
  {
    rotulo: "5 · Cubierta de ZINC: «Llenar TODAS las celdas cerradas» (área membrana)",
    hacer: async (a) => {
      await vista(a, ...ISO);
      await boton(a, "Áreas (shells)", "Llenar TODAS", "Un clic: cada celda cerrada de la bóveda se vuelve un paño de zinc (área).");
      await a.pag.evaluate(() => { const f = [...document.querySelectorAll(".tp-fldv_b")].find((x) => (x.textContent||"").includes("Áreas (shells)")); if (f) f.click(); });
      await limpiar(a); await vista(a, ...ISO); await a.quieto(5, 360);
    },
  },
  {
    rotulo: "6 · La capilla analítica terminada — giramos para verla",
    hacer: async (a) => {
      await limpiar(a);
      const c = await a.pag.evaluate(() => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const r = h.getBoundingClientRect(); return { x: r.left + r.width/2, y: r.top + r.height/2 }; });
      await a.pag.mouse.move(c.x, c.y); await a.pag.mouse.down();
      for (let i = 1; i <= 20; i++) { await a.pag.mouse.move(c.x + i*7, c.y - i*1.2); await a.pag.evaluate((q)=>window.__tutCursor&&window.__tutCursor(q.x,q.y),{x:c.x+i*7,y:c.y-i*1.2}); await a.quieto(1, 55); }
      await a.pag.mouse.up(); await a.quieto(4, 340);
    },
  },
];
