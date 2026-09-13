// Tutorial 7 · Dibujar sobre el IFC: el IFC de fondo (como el DWG de fondo de
// Revit), corte en elevación → perfil de sección, y los DOS ARCOS de la capilla
// con la herramienta Arco discretizada (reparto Y igual), enganchando al perfil.
// Luego el entrepiso a su cota REAL (la del IFC, no la del EDB). Todo con el cursor.
export const ruta = "workspace/?t=new-blank";
export const titulo = "Hekatan Struct · dibujar sobre el IFC (los dos arcos)";
const LIM = { x: 0, y: 0, w: 1280, h: 720 };
const BASE = "/hekatan-struct-lineal/";
// Corte en X de un pórtico limpio (sin la torre): perfil z 4.0 → 7.6 → 0.8 (medido).
const X_CORTE = 16.5;
const Y_ENTREPISO = 124;

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
// Botón por texto (Tweakpane o normal)
const boton = (a, re) => rect(a, (re) => [...document.querySelectorAll("button")].find((b) => new RegExp(re, "i").test(b.textContent || "")), re);
// Cabecera de carpeta Tweakpane por texto
const carpeta = (a, re) => rect(a, (re) => [...document.querySelectorAll(".tp-fldv_b")].find((x) => new RegExp(re, "i").test(x.textContent || "")), re);
// Fila de Tweakpane por etiqueta → su control (checkbox / input de texto / select)
const control = (a, re, que) => rect(a, ({ re, que }) => {
  const row = [...document.querySelectorAll(".tp-lblv")].find((x) => new RegExp(re, "i").test(x.textContent || "")); if (!row) return null;
  if (que === "check") return row.querySelector(".tp-ckbv_w") || row.querySelector("input[type=checkbox]") || row;
  if (que === "texto") return row.querySelector("input[type=text]") || row.querySelector("input") || row;
  if (que === "select") { const s = row.querySelector("select"); if (s) s.id = "hk-tmp-select"; return s || row; }
  return row;
}, { re, que });
const abrirCarpeta = async (a, re, txt) => {
  const f = await carpeta(a, re); if (!f) return false;
  const abierta = await a.pag.evaluate((re) => { const b = [...document.querySelectorAll(".tp-fldv_b")].find((x) => new RegExp(re, "i").test(x.textContent || "")); return !!b?.closest(".tp-fldv")?.classList.contains("tp-fldv-expanded"); }, re);
  if (txt) await caja(a, { x: f.rx, y: f.ry, w: f.rw, h: f.rh }, txt, 4);
  if (!abierta) await clicRojo(a, f.x, f.y, false);
  return true;
};
const escribir = async (a, re, valor) => {
  const c = await control(a, re, "texto"); if (!c) return false;
  await clicRojo(a, c.x, c.y, false);
  await a.pag.keyboard.down("Control"); await a.pag.keyboard.press("a"); await a.pag.keyboard.up("Control");
  await a.pag.keyboard.type(String(valor), { delay: 60 }); await a.quieto(2, 260);
  await a.pag.keyboard.press("Enter"); await a.quieto(2, 300);
  return true;
};
const marcar = async (a, re, txt) => { const c = await control(a, re, "check"); if (!c) return false; if (txt) await caja(a, { x: c.rx - 200, y: c.ry - 4, w: c.rw + 210, h: c.rh + 8 }, txt, 5); await clicRojo(a, c.x, c.y); return true; };
// Puertas corredizas
const panel = async (a, lado, abrir) => {
  const id = lado === "izq" ? "hk-settings-toggle" : "hk-pane-toggle";
  const est = await a.pag.evaluate((id) => { const b = document.getElementById(id); if (!b) return null; const p = id === "hk-settings-toggle" ? document.getElementById("settings") : document.getElementById("hk-pane-host"); const t = p ? getComputedStyle(p).transform : "none"; const m = t && t !== "none" ? Math.abs(+t.split(",")[4]) : 0; const rc = b.getBoundingClientRect(); return { abierto: m <= 40, x: rc.left + rc.width / 2, y: rc.top + rc.height / 2 }; }, id);
  if (!est || est.abierto === abrir) return;
  await clicRojo(a, est.x, est.y, false); await a.quieto(3, 320);
  // Esperar a que la puerta TERMINE de correr: si no, las filas del panel se
  // miden a medio camino y el clic cae al lado (medido en el comprobador).
  for (let i = 0; i < 30; i++) {
    const m = await a.pag.evaluate((id) => { const p = id === "hk-settings-toggle" ? document.getElementById("settings") : document.getElementById("hk-pane-host"); const t = p ? getComputedStyle(p).transform : "none"; return t && t !== "none" ? Math.abs(+t.split(",")[4]) : 0; }, id);
    if ((abrir && m <= 1) || (!abrir && m >= 200)) break;
    await new Promise((r) => setTimeout(r, 50));
  }
};
// Proyección con la cámara ACTIVA (orto o perspectiva)
const proj = (a, P) => a.pag.evaluate((P) => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; const r = h.querySelector("canvas").getBoundingClientRect(); const V = Object.getPrototypeOf(c.camera.position).constructor; return P.map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera); return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; }); }, P);
const vista = (a, p, t) => a.pag.evaluate(({ p, t }) => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; c.camera.position.set(...p); c.camera.up.set(0, 0, 1); c.controls.target.set(...t); c.camera.lookAt(...t); c.controls.update(); c.render(); }, { p, t });
const setTool = (a, t) => a.pag.evaluate((t) => { try { window.__hekatanCadState.setTool(t); } catch (e) {} }, t);
// Puntos del perfil de sección: el más cercano a (y,z) en el plano del corte X (perfil exterior = z máx)
const perfil = (a) => a.pag.evaluate(() => window.__hekatanSeccionIfcPuntos?.(20000) || []);
const puntoPerfil = (P, y, z) => { let b = null, m = 1e9; for (const p of P) { const d = Math.hypot(p[1] - y, p[2] - z); if (d < m) { m = d; b = p; } } return b; };
const orbit = async (a, dx, dy, n = 6) => {
  const r = await a.pag.evaluate(() => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const rc = h.getBoundingClientRect(); return { x: rc.left, y: rc.top, w: rc.width, h: rc.height }; });
  const cx = r.x + r.w * 0.2, cy = r.y + r.h * 0.85;
  await mover(a, cx, cy, 6); await a.pag.mouse.down();
  for (let i = 1; i <= 18; i++) { const x = cx + dx * i / 18, y = cy + dy * i / 18; await a.pag.mouse.move(x, y); await a.pag.evaluate((q) => window.__tutCursor && window.__tutCursor(q.x, q.y), { x, y }); await a.quieto(1, 55); }
  await a.pag.mouse.up(); await a.quieto(n, 320);
};
export const nudos = (a) => a.pag.evaluate(() => (window.__hekatanDrawingPoints?.rawVal || []).map((p) => p.map((v) => +v.toFixed(3))));

// ── Pasos ────────────────────────────────────────────────────────────────────
export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("Dibujar sobre el IFC", "Tutorial 7", 16); } },
  {
    rotulo: "1 · Archivo nuevo + Importar IFC: la iglesia queda de fondo como referencia",
    hacer: async (a) => {
      await a.pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo", "0"); } catch (e) {} });
      await a.general(); await a.quieto(2, 320);
      // plegar la cinta con el cursor (tapa la escena)
      const pl = await rect(a, () => document.getElementById("hk-ribbon-plegar"));
      if (pl) await clicRojo(a, pl.x, pl.y, false);
      await abrirCarpeta(a, "Importar archivo");
      const b = await boton(a, "Importar IFC");
      if (b) { await mover(a, b.x, b.y, 14); await caja(a, { x: b.rx, y: b.ry, w: b.rw, h: b.rh }, "Importar IFC: elijo el archivo de la iglesia.", 5); await a.pag.evaluate((q) => window.__tutClick && window.__tutClick(q.x, q.y), b); await a.quieto(2, 300); }
      await a.pag.evaluate(async (base) => { const M = await fetch(base + "ifc_church.json").then((r) => r.json()); window.__hekatanIfcMesh = M; try { window.__hekatanRebuild?.(); } catch (e) {} }, BASE);
      await a.quieto(3, 400);
      await vista(a, [55, 90, 30], [19.7, 126, 5]);
      await a.quieto(5, 360);
    },
  },
  {
    rotulo: `2 · Corte en X = ${X_CORTE} (panel ✂ Cortes): aparece el PERFIL de sección en naranja`,
    hacer: async (a) => {
      await panel(a, "izq", true);
      await abrirCarpeta(a, "Cortes", "AQUÍ va el corte: ✂ Cortes X/Y/Z.");
      await escribir(a, "pos X", X_CORTE);
      await marcar(a, "invertir X");
      await marcar(a, "Cortar X", "Marco «Cortar X»: se corta el IFC por ese pórtico.");
      await a.quieto(3, 320);
      await panel(a, "izq", false);
      // vista lateral (mirando +X) sobre el perfil
      await vista(a, [X_CORTE - 30, 123.5, 4.5], [X_CORTE, 123.5, 4.5]);
      await a.pag.mouse.move(400, 300); await a.quieto(4, 360);
    },
  },
  {
    rotulo: "3 · Ajustes del arco: 6 tramos y reparto «Y igual» (así está partido el modelo de ETABS)",
    hacer: async (a) => {
      await panel(a, "der", true);
      await abrirCarpeta(a, "Precisi");
      await abrirCarpeta(a, "Modos de dibujo");
      await escribir(a, "Segmentos arc", 6);
      const s = await control(a, "Reparto del arco", "select");
      if (s) { await clicRojo(a, s.x, s.y, false); await a.pag.select("#hk-tmp-select", "Y igual"); await a.quieto(3, 320); }
      const ok = await a.pag.evaluate(() => ({ segs: window.__hekatanArcSegs, modo: window.__hekatanArcModo }));
      console.log("  arco:", JSON.stringify(ok));
    },
  },
  {
    rotulo: "4 · Arco de la nave: herramienta Arco, tres clics sobre el perfil (arranque, medio, cumbre)",
    hacer: async (a) => {
      const b = await boton(a, "Arco \\(3");
      if (b) await clicRojo(a, b.x, b.y);
      await a.pag.mouse.move(400, 300); await a.quieto(2, 200);
      const P = await perfil(a);
      const pts = [puntoPerfil(P, 115.2, 4.0), puntoPerfil(P, 121, 7.1), puntoPerfil(P, 126.5, 7.6)];
      const px = await proj(a, pts);
      for (let i = 0; i < 3; i++) { await clicRojo(a, px[i].x, px[i].y); }
      await a.pag.keyboard.press("Escape");
      await a.quieto(5, 360);
    },
  },
  {
    rotulo: "5 · Arco del ala: otros tres clics, 5 tramos, hasta el suelo",
    hacer: async (a) => {
      await escribir(a, "Segmentos arc", 5);
      const b = await boton(a, "Arco \\(3");
      if (b) await clicRojo(a, b.x, b.y, false);
      await a.pag.mouse.move(400, 300); await a.quieto(2, 200);
      const P = await perfil(a);
      // arranca en el ÚLTIMO nudo del arco de la nave (la cumbre): la mirilla lo
      // engancha como «Nudo» y los dos arcos comparten el nudo, como en el EDB.
      const N0 = await nudos(a); const cumbre = N0.length ? N0[N0.length - 1] : puntoPerfil(P, 127.3, 7.5);
      const pts = [cumbre, puntoPerfil(P, 130, 4.3), puntoPerfil(P, 132, 0.8)];
      const px = await proj(a, pts);
      console.log("  ala objetivos:", JSON.stringify(pts.map((p) => p.map((v) => +v.toFixed(2)))), JSON.stringify(px.map((q) => [Math.round(q.x), Math.round(q.y)])));
      for (let i = 0; i < 3; i++) { await clicRojo(a, px[i].x, px[i].y); }
      await a.pag.keyboard.press("Escape");
      await a.quieto(5, 360);
      console.log("  nudos tras los arcos:", JSON.stringify(await nudos(a)));
    },
  },
  {
    rotulo: `6 · El entrepiso a su cota REAL: corte Y = ${Y_ENTREPISO}, vista de frente, Línea entre los dos bordes del perfil`,
    hacer: async (a) => {
      await panel(a, "der", false);
      await panel(a, "izq", true);
      await abrirCarpeta(a, "Cortes");
      await marcar(a, "Cortar X");                 // apaga X
      await escribir(a, "pos Y", Y_ENTREPISO);
      await marcar(a, "invertir Y");
      await marcar(a, "Cortar Y");
      await panel(a, "izq", false);
      // cerca (16 m): el canto del entrepiso a x = 17 está a solo 0.5 m de los arcos
      // (x = 16.5); de lejos el «Punto medio» de una barra del arco caía dentro de
      // la mirilla y se llevaba el clic (medido). Y primero el extremo derecho.
      await vista(a, [20, Y_ENTREPISO - 16, 4.5], [20, Y_ENTREPISO, 4.5]);
      await a.pag.mouse.move(400, 300); await a.quieto(3, 320);
      await panel(a, "der", true);
      const b = await boton(a, "Línea \\(frame");
      if (b) await clicRojo(a, b.x, b.y, false);
      await a.pag.mouse.move(400, 300); await a.quieto(2, 200);
      const P = (await perfil(a)).filter((p) => Math.abs(p[1] - Y_ENTREPISO) < 0.01);   // solo el perfil del corte Y
      // el canto del entrepiso: z ≈ 5.0, entre x ≈ 17 y 23 (medido en el IFC)
      const cerca = (x, z) => { let b = null, m = 1e9; for (const p of P) { const d = Math.hypot(p[0] - x, p[2] - z); if (d < m) { m = d; b = p; } } return b; };
      const pts = [cerca(23.0, 5.0), cerca(17.0, 5.0)];
      if (pts[0] && pts[1]) { const px = await proj(a, pts); for (let i = 0; i < 2; i++) await clicRojo(a, px[i].x, px[i].y); }
      await a.pag.keyboard.press("Escape");
      await a.quieto(4, 340);
      console.log("  entrepiso:", JSON.stringify(pts));
    },
  },
  {
    rotulo: "7 · Sin corte: los dos arcos y el entrepiso sobre el IFC, giramos",
    hacer: async (a) => {
      await panel(a, "der", false);
      await panel(a, "izq", true);
      await abrirCarpeta(a, "Cortes");
      await marcar(a, "Cortar Y");
      await panel(a, "izq", false);
      await a.pag.keyboard.press("Escape"); await setTool(a, null);
      await vista(a, [-10, 100, 18], [19.7, 124, 4.5]);
      await a.quieto(3, 320);
      await orbit(a, 140, -10, 6);
    },
  },
];
