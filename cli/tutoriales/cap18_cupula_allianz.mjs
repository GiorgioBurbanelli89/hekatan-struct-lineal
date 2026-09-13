// Tutorial 8 · Cúpula y cáscara del Allianz Arena: dos superficies curvas hechas desde
// el menú y con el cursor. La cúpula = un arco meridiano en el alzado, girado
// (Revolución). El Allianz = un contorno de planta (rectángulo redondeado) barrido
// hacia afuera según un perfil de alzado (Barrido en alzado). Todo en tramos rectos
// Q4, que es lo que ETABS admite (y contra ETABS se comprobó: 0.09 % y 0.011 %).
export const ruta = "workspace/?t=new-blank";
export const titulo = "Hekatan Struct · cúpula y cáscara del Allianz Arena";
const LIM = { x: 0, y: 0, w: 1280, h: 640 };

// ── Cursor ───────────────────────────────────────────────────────────────────
const mover = async (a, x, y, pasos = 10) => {
  const p0 = (await a.pag.evaluate(() => window.__tutXY || null)) || { x, y };
  for (let i = 1; i <= pasos; i++) {
    const cx = p0.x + (x - p0.x) * (i / pasos), cy = p0.y + (y - p0.y) * (i / pasos);
    await a.pag.mouse.move(cx, cy);
    await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x: cx, y: cy });
    await a.quieto(1, 45);
  }
};
const clicRojo = async (a, x, y, lento = true) => {
  await mover(a, x, y, lento ? 14 : 6); await a.quieto(lento ? 3 : 1, 260);
  await a.pag.evaluate((q) => window.__tutClick && window.__tutClick(q.x, q.y), { x, y });
  await a.quieto(lento ? 3 : 2, 260); await a.pag.mouse.click(x, y); await a.quieto(2, 260);
};
const caja = async (a, r, txt, frames = 5) => { await a.pag.evaluate((q) => window.__tutCaja(q.r, q.t, q.L), { r, t: txt, L: LIM }); await a.quieto(frames, 340); await a.pag.evaluate(() => window.__tutSinCaja()); };
const rect = (a, fn, arg) => a.pag.evaluate((q) => { const f = new Function("arg", q.src); const el = f(q.arg); if (!el) return null; el.scrollIntoView?.({ block: "center" }); const rc = el.getBoundingClientRect(); return { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2, rx: rc.left, ry: rc.top, rw: rc.width, rh: rc.height }; }, { src: `return (${fn.toString()})(arg)`, arg });
const boton = (a, re) => rect(a, (re) => [...document.querySelectorAll("button")].find((b) => new RegExp(re, "i").test(b.textContent || "")), re);
const carpeta = (a, re) => rect(a, (re) => [...document.querySelectorAll(".tp-fldv_b")].find((x) => new RegExp(re, "i").test(x.textContent || "")), re);
const control = (a, re, que) => rect(a, ({ re, que }) => {
  const row = [...document.querySelectorAll(".tp-lblv")].find((x) => new RegExp(re, "i").test(x.textContent || "")); if (!row) return null;
  if (que === "check") return row.querySelector(".tp-ckbv_w") || row.querySelector("input[type=checkbox]") || row;
  return row.querySelector("input[type=text]") || row.querySelector("input") || row;
}, { re, que });
const abrirCarpeta = async (a, re, txt) => {
  const abierta = await a.pag.evaluate((re) => { const b = [...document.querySelectorAll(".tp-fldv_b")].find((x) => new RegExp(re, "i").test(x.textContent || "")); return !!b?.closest(".tp-fldv")?.classList.contains("tp-fldv-expanded"); }, re);
  const f = await carpeta(a, re); if (!f) { console.log("  x no está la carpeta " + re); return false; }
  if (txt) await caja(a, { x: f.rx, y: f.ry, w: f.rw, h: f.rh }, txt, 4);
  if (!abierta) await clicRojo(a, f.x, f.y, false);
  return true;
};
const pulsar = async (a, re, txt, lento = false) => {
  const b = await boton(a, re); if (!b) { console.log("  x no está el botón " + re); return false; }
  await mover(a, b.x, b.y, 12);
  if (txt) await caja(a, { x: b.rx, y: b.ry, w: b.rw, h: b.rh }, txt, 5);
  await clicRojo(a, b.x, b.y, lento); return true;
};
const escribir = async (a, re, valor, txt) => {
  const c = await control(a, re, "texto"); if (!c) { console.log("  x no está el control " + re); return false; }
  if (txt) await caja(a, { x: c.rx - 200, y: c.ry - 4, w: c.rw + 210, h: c.rh + 8 }, txt, 4);
  await clicRojo(a, c.x, c.y, false);
  await a.pag.keyboard.down("Control"); await a.pag.keyboard.press("a"); await a.pag.keyboard.up("Control");
  await a.pag.keyboard.type(String(valor), { delay: 60 }); await a.quieto(2, 260);
  await a.pag.keyboard.press("Enter"); await a.quieto(2, 300);
  return true;
};
const marcar = async (a, re, txt) => { const c = await control(a, re, "check"); if (!c) return false; if (txt) await caja(a, { x: c.rx - 200, y: c.ry - 4, w: c.rw + 210, h: c.rh + 8 }, txt, 5); await clicRojo(a, c.x, c.y); return true; };
const panel = async (a, lado, abrir) => {
  const id = lado === "izq" ? "hk-settings-toggle" : "hk-pane-toggle";
  const est = await a.pag.evaluate((id) => { const b = document.getElementById(id); if (!b) return null; const p = id === "hk-settings-toggle" ? document.getElementById("settings") : document.getElementById("hk-pane-host"); const t = p ? getComputedStyle(p).transform : "none"; const m = t && t !== "none" ? Math.abs(+t.split(",")[4]) : 0; const rc = b.getBoundingClientRect(); return { abierto: m <= 40, x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 }; }, id);
  if (!est || est.abierto === abrir) return;
  await clicRojo(a, est.x, est.y, false); await a.quieto(3, 320);
  for (let i = 0; i < 30; i++) {
    const m = await a.pag.evaluate((id) => { const p = id === "hk-settings-toggle" ? document.getElementById("settings") : document.getElementById("hk-pane-host"); const t = p ? getComputedStyle(p).transform : "none"; return t && t !== "none" ? Math.abs(+t.split(",")[4]) : 0; }, id);
    if ((abrir && m <= 1) || (!abrir && m >= 200)) break;
    await new Promise((r) => setTimeout(r, 50));
  }
};
const proj = (a, P) => a.pag.evaluate((P) => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; const r = h.querySelector("canvas").getBoundingClientRect(); const V = Object.getPrototypeOf(c.camera.position).constructor; return P.map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera); return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; }); }, P);
const vista = (a, p, t) => a.pag.evaluate(({ p, t }) => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; c.setActiveCamera?.(c.perspCamera); c.camera.position.set(...p); c.camera.up.set(0, 0, 1); c.controls.target.set(...t); c.camera.lookAt(...t); c.controls.update(); c.render(); }, { p, t });
// clic en un punto del MUNDO (se proyecta con la cámara actual) con etiqueta de lo que es
const clicMundo = async (a, p, txt) => {
  const [q] = await proj(a, [p]);
  await mover(a, q.x, q.y, 14);
  if (txt) await caja(a, { x: q.x - 12, y: q.y - 12, w: 24, h: 24 }, txt, 5);
  await clicRojo(a, q.x, q.y, false);
};
const orbita = async (a, c, r, z0, t, n = 24) => { for (let i = 0; i <= n; i++) { const th = -0.9 + 1.9 * Math.PI * i / n; await vista(a, [c[0] + r * Math.cos(th), c[1] + r * Math.sin(th), z0], t); await a.quieto(1, 120); } };
const vistaBoton = async (a, re, txt) => { await panel(a, "der", true); await abrirCarpeta(a, "Plano de trabajo"); return pulsar(a, re, txt); };
const estado = (a) => a.pag.evaluate(() => document.getElementById("hk-cad-status")?.textContent);

// ── Pasos ────────────────────────────────────────────────────────────────────
export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("Cúpula y cáscara del Allianz Arena", "Tutorial 8", 16); } },
  {
    rotulo: "1 · Archivo nuevo, alzado XZ real, grid snap y 8 tramos por arco",
    hacer: async (a) => {
      await a.pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo", "0"); } catch (e) {} try { window.__hekatanDrawingPoints.val = []; window.__hekatanDrawingPolylines.val = [[]]; window.__hekatanDrawingAreas.val = []; } catch (e) {} });
      await a.general(); await a.quieto(2, 320);
      const pl = await rect(a, () => document.getElementById("hk-ribbon-plegar"));
      if (pl) await clicRojo(a, pl.x, pl.y, false);
      await panel(a, "izq", false);
      await vistaBoton(a, "Plano XZ \\(elevaci", "Plano XZ: alzado frontal real, ortográfico.");
      await abrirCarpeta(a, "Precisión");
      await marcar(a, "Grid snap", "Grid snap: el clic cae en la rejilla, coordenadas exactas.");
      await abrirCarpeta(a, "Modos de dibujo");
      await escribir(a, "Segmentos arc", 8, "Ocho tramos rectos por arco: ETABS no admite curvas.");
      await marcar(a, "Curvas como gu", "Curvas como guía AUXILIAR: el meridiano no es estructura, se borra al usarlo.");
      await a.quieto(3, 320);
    },
  },
  {
    rotulo: "2 · El meridiano como guía auxiliar: Arco por 3 puntos (5,0,0) (3,0,4) (0,0,5); la regla mide el radio",
    hacer: async (a) => {
      await abrirCarpeta(a, "✏ Dibujar");
      await pulsar(a, "⌒ Arco \\(3 ptos\\)", "Arco por tres puntos.");
      await clicMundo(a, [5, 0, 0], "Arranque, en el suelo: (5, 0).");
      await clicMundo(a, [3, 0, 4], "Punto medio (3, 4): 3² + 4² = 5².");
      await clicMundo(a, [0, 0, 5], "Cumbre en el eje: (0, 5).");
      console.log("   ", await estado(a));
      await a.quieto(3, 360);
      await pulsar(a, "Medir / acotar", "Medir / acotar: la regla.");
      await clicMundo(a, [0, 0, 0], "Del centro…");
      await clicMundo(a, [5, 0, 0], "…al arranque: 5.000 m, el radio.");
      await a.quieto(5, 360);
    },
  },
  {
    rotulo: "3 · Seleccionar el arco con una ventana (clic, clic)",
    hacer: async (a) => {
      await abrirCarpeta(a, "✂ Modificar");
      await pulsar(a, "🖱 Seleccionar", "Seleccionar.");
      const [p, q] = await proj(a, [[-0.6, 0, 5.6], [5.6, 0, -0.6]]);
      await mover(a, p.x, p.y, 12); await caja(a, { x: p.x - 12, y: p.y - 12, w: 24, h: 24 }, "Primera esquina de la ventana.", 4);
      await clicRojo(a, p.x, p.y, false);
      await mover(a, q.x, q.y, 16); await a.quieto(3, 300);
      await clicRojo(a, q.x, q.y, false);
      await a.quieto(4, 360);
    },
  },
  {
    rotulo: "4 · Revolución: 16 sectores y un clic en el eje → la cúpula en paños Q4",
    hacer: async (a) => {
      await abrirCarpeta(a, "Áreas \\(shells\\)");
      await escribir(a, "Sectores \\(revoluci", 16, "Dieciséis sectores alrededor del eje.");
      await pulsar(a, "Revolución de la selecci", "Revolución de la selección: el meridiano gira.");
      await clicMundo(a, [0, 0, 2], "Un clic en el eje vertical (x = 0).");
      console.log("   ", await estado(a));
      await a.quieto(5, 360);
    },
  },
  {
    rotulo: "5 · Vista isométrica: 120 paños, 129 nudos, todos sobre la esfera; el polo cerrado con cometas",
    hacer: async (a) => {
      await vistaBoton(a, "Vista isom", "Vista isométrica.");
      await a.pag.evaluate(() => { const s = window.__hekatanSettings?.(); if (s?.extruded) s.extruded.val = true; });
      await panel(a, "der", false);
      await a.quieto(3, 360);
      await orbita(a, [0, 0], 14, 8, [0, 0, 2.5], 26);
      await vista(a, [0.01, -0.01, 16], [0, 0, 2.5]); await a.quieto(6, 360);   // desde arriba: las cometas del polo
      await vista(a, [11, -9, 6], [0, 0, 2.5]); await a.quieto(4, 360);
    },
  },
  {
    rotulo: "6 · Allianz: limpiar, planta XY, chaflán 5 m y Losa con chaflanes por dos esquinas (26 × 24)",
    hacer: async (a) => {
      await panel(a, "der", true);
      await abrirCarpeta(a, "Acciones");
      await pulsar(a, "Limpiar todo", "Limpiar todo: empezamos la segunda superficie.");
      await a.pag.evaluate(() => { try { window.__hekatanDrawingPoints.val = []; window.__hekatanDrawingPolylines.val = [[]]; window.__hekatanDrawingAreas.val = []; window.__hekatanRebuild?.(); } catch (e) {} });
      await vistaBoton(a, "Plano XY \\(planta\\)", "Planta.");
      await abrirCarpeta(a, "Modos de dibujo");
      await escribir(a, "Segmentos arc", 4, "Cuatro tramos por esquina redondeada.");
      await escribir(a, "Chaflán r", 5, "Radio de las esquinas: 5 m (escala 1 a 10).");
      await marcar(a, "Curvas como gu", "Sigue en guía auxiliar: contorno y perfil se borrarán al barrer.");
      await abrirCarpeta(a, "Áreas \\(shells\\)");
      await pulsar(a, "Losa con chaflanes", "Losa con chaflanes: el contorno de planta.");
      await clicMundo(a, [-13, -12, 0], "Esquina (−13, −12).");
      await clicMundo(a, [13, 12, 0], "Esquina opuesta (13, 12): 26 × 24.");
      console.log("   ", await estado(a));
      await a.quieto(4, 360);
    },
  },
  {
    rotulo: "7 · La panza en el alzado XZ: Parábola por (16,0) (17,2) (16,4), 12 tramos",
    hacer: async (a) => {
      await vistaBoton(a, "Plano XZ \\(elevaci", "Alzado.");
      await abrirCarpeta(a, "Modos de dibujo");
      await escribir(a, "Segmentos arc", 12, "Doce tramos en altura.");
      await abrirCarpeta(a, "✏ Dibujar");
      await pulsar(a, "∪ Parábola", "Parábola por tres puntos: la panza de la piel.");
      await clicMundo(a, [16, 0, 0], "Pie (16, 0).");
      await clicMundo(a, [17, 0, 2], "A media altura sale 1 m: (17, 2).");
      await clicMundo(a, [16, 0, 4], "Arriba vuelve: (16, 4).");
      console.log("   ", await estado(a));
      await a.quieto(3, 360);
      await pulsar(a, "Medir / acotar", "La regla: cuánto sale la panza.");
      await clicMundo(a, [16, 0, 2], "Del pie…");
      await clicMundo(a, [17, 0, 2], "…a media altura: 1.000 m.");
      await a.quieto(4, 360);
    },
  },
  {
    rotulo: "8 · Una ventana selecciona contorno y perfil; Barrido en alzado con un clic en el centro → 480 paños",
    hacer: async (a) => {
      await abrirCarpeta(a, "✂ Modificar");
      await pulsar(a, "🖱 Seleccionar", "Seleccionar.");
      const [p, q] = await proj(a, [[-14, 0, 4.6], [18, 0, -0.6]]);
      await mover(a, p.x, p.y, 12); await clicRojo(a, p.x, p.y, false);
      await mover(a, q.x, q.y, 16); await a.quieto(3, 300); await clicRojo(a, q.x, q.y, false);
      await a.quieto(3, 320);
      await abrirCarpeta(a, "Áreas \\(shells\\)");
      await pulsar(a, "Barrido en alzado", "Barrido en alzado: el contorno se desplaza según el perfil.");
      await clicMundo(a, [0, 0, 2], "Un clic en el centro de la planta.");
      console.log("   ", await estado(a));
      await a.quieto(5, 360);
    },
  },
  {
    rotulo: "9 · La piel del Allianz en isométrica: 480 Q4, 520 nudos; = ETABS al 0.011 %",
    hacer: async (a) => {
      await vistaBoton(a, "Vista isom", "Vista isométrica.");
      await a.pag.evaluate(() => { const s = window.__hekatanSettings?.(); if (s?.extruded) s.extruded.val = true; });
      await panel(a, "der", false);
      await a.quieto(3, 360);
      await orbita(a, [0, 0], 42, 20, [0, 0, 2], 30);
      await vista(a, [30, -34, 16], [0, 0, 2]); await a.quieto(8, 360);
    },
  },
];
