// Ayudantes de los tutoriales que van SOLO por la cinta de acceso rápido (19-sep-2026).
// Jorge: «debes usar solo acceso rápido». Aquí no hay nada que busque en los paneles
// (Tweakpane): pestañas, botones y casillas de #hk-ribbon, y clics en el lienzo.
export const LIM = { x: 0, y: 0, w: 1280, h: 640 };

export const mover = async (a, x, y, pasos = 10) => {
  const p0 = (await a.pag.evaluate(() => window.__tutXY || null)) || { x, y };
  for (let i = 1; i <= pasos; i++) {
    const cx = p0.x + (x - p0.x) * (i / pasos), cy = p0.y + (y - p0.y) * (i / pasos);
    await a.pag.mouse.move(cx, cy);
    await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x: cx, y: cy });
    await a.quieto(1, 45);
  }
};
export const clicRojo = async (a, x, y, lento = true) => {
  await mover(a, x, y, lento ? 14 : 6); await a.quieto(lento ? 3 : 1, 260);
  await a.pag.evaluate((q) => window.__tutClick && window.__tutClick(q.x, q.y), { x, y });
  await a.quieto(lento ? 3 : 2, 260); await a.pag.mouse.click(x, y); await a.quieto(2, 260);
};
export const caja = async (a, r, txt, frames = 5) => { await a.pag.evaluate((q) => window.__tutCaja(q.r, q.t, q.L), { r, t: txt, L: LIM }); await a.quieto(frames, 340); await a.pag.evaluate(() => window.__tutSinCaja()); };
export const rect = (a, fn, arg) => a.pag.evaluate((q) => { const f = new Function("arg", q.src); const el = f(q.arg); if (!el) return null; const rc = el.getBoundingClientRect(); return { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2, rx: rc.left, ry: rc.top, rw: rc.width, rh: rc.height }; }, { src: `return (${fn.toString()})(arg)`, arg });
export const panel = async (a, lado, abrir) => {
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
export const proj = (a, P) => a.pag.evaluate((P) => { const h = document.querySelector("#viewer"); const c = h.__ctx; const r = h.querySelector("canvas").getBoundingClientRect(); const V = c.camera.position.constructor; return P.map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera); return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; }); }, P);
export const clicMundo = async (a, p, txt, lento = false) => {
  const [q] = await proj(a, [p]);
  await mover(a, q.x, q.y, txt ? 14 : 8);
  if (txt) await caja(a, { x: q.x - 12, y: q.y - 12, w: 24, h: 24 }, txt, 5);
  await clicRojo(a, q.x, q.y, lento);
};
export const vista = (a, p, t) => a.pag.evaluate(({ p, t }) => { const c = document.querySelector("#viewer").__ctx; c.setActiveCamera?.(c.perspCamera); c.camera.position.set(...p); c.camera.up.set(0, 0, 1); c.controls.target.set(...t); c.camera.lookAt(...t); c.controls.update(); c.render(); }, { p, t });
export const orbita = async (a, c, r, z0, t, n = 24) => { for (let i = 0; i <= n; i++) { const th = -1.2 + 1.6 * Math.PI * i / n; await vista(a, [c[0] + r * Math.cos(th), c[1] + r * Math.sin(th), z0], t); await a.quieto(1, 120); } };
export const estado = (a) => a.pag.evaluate(() => document.getElementById("hk-ribbon-estado")?.textContent || document.getElementById("hk-cad-status")?.textContent);

// ── la CINTA ────────────────────────────────────────────────────────────────
export const pestana = async (a, id, txt) => {
  const b = await rect(a, (id) => document.getElementById("hk-ribbon-tab-" + id), id);
  if (!b) { console.log("  x no está la pestaña " + id); return false; }
  await mover(a, b.x, b.y, 12);
  if (txt) await caja(a, { x: b.rx, y: b.ry, w: b.rw, h: b.rh }, txt, 5);
  await clicRojo(a, b.x, b.y, false); return true;
};
const botonRect = (a, re) => rect(a, (re) => [...document.querySelectorAll("#hk-ribbon button")].find((b) => b.offsetParent !== null && new RegExp(re).test((b.textContent || "").replace(/\s+/g, " ").trim())), re);
export const boton = async (a, re, txt, lento = false) => {
  const b = await botonRect(a, re);
  if (!b) { console.log("  x no está en la cinta: " + re); return false; }
  await mover(a, b.x, b.y, 12);
  if (txt) await caja(a, { x: b.rx, y: b.ry, w: b.rw, h: b.rh }, txt, 5);
  await clicRojo(a, b.x, b.y, lento); return true;
};
export const senalar = async (a, re, txt, frames = 6) => {
  const b = await botonRect(a, re);
  if (!b) { console.log("  x no está en la cinta: " + re); return false; }
  await mover(a, b.x, b.y, 12); await caja(a, { x: b.rx, y: b.ry, w: b.rw, h: b.rh }, txt, frames); return true;
};
/** ¿Está encendido un botón-interruptor de la cinta? (fondo #0e7490 o borde cian) */
export const encendido = (a, re) => a.pag.evaluate((re) => { const b = [...document.querySelectorAll("#hk-ribbon button")].find((b) => b.offsetParent !== null && new RegExp(re).test((b.textContent || "").replace(/\s+/g, " ").trim())); if (!b) return null; const bg = getComputedStyle(b).backgroundColor; return bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent"; }, re);
/** Escribe en una casilla de la cinta (por su data-mando) con el teclado. */
export const casilla = async (a, mando, valor, txt) => {
  const c = await rect(a, (m) => document.querySelector(`#hk-ribbon input[data-mando="${m}"]`), mando);
  if (!c) { console.log("  x no está la casilla " + mando); return false; }
  await mover(a, c.x, c.y, 12);
  if (txt) await caja(a, { x: c.rx - 4, y: c.ry - 4, w: c.rw + 8, h: c.rh + 8 }, txt, 5);
  await clicRojo(a, c.x, c.y, false);
  await a.pag.keyboard.down("Control"); await a.pag.keyboard.press("a"); await a.pag.keyboard.up("Control");
  await a.pag.keyboard.type(String(valor), { delay: 70 }); await a.pag.keyboard.press("Enter");
  await a.quieto(2, 260); return true;
};
/** Ventana de selección clic-clic entre dos puntos del mundo. */
export const ventana = async (a, p1, p2, txt) => {
  const [p, q] = await proj(a, [p1, p2]);
  await mover(a, p.x, p.y, 12);
  if (txt) await caja(a, { x: p.x - 12, y: p.y - 12, w: 24, h: 24 }, txt, 4);
  await clicRojo(a, p.x, p.y, false);
  await mover(a, q.x, q.y, 16); await a.quieto(2, 300);
  await clicRojo(a, q.x, q.y, false);
};
/** Hueco libre del lienzo: debajo de la cinta y su línea de estado, encima de la línea de órdenes. */
export const hueco = (a) => a.pag.evaluate(() => {
  const rb = document.getElementById("hk-ribbon")?.getBoundingClientRect();
  const es = document.getElementById("hk-ribbon-estado")?.getBoundingClientRect();
  const cmd = document.getElementById("hk3-cmdline")?.getBoundingClientRect();
  const arr = Math.max(rb?.bottom ?? 0, es?.bottom ?? 0) + 20, aba = Math.min(cmd?.top ?? 630, 630) - 10;
  return { x: innerWidth / 2, y: (arr + aba) / 2, alto: aba - arr };
});
const pxm = async (a) => { const [p, q] = await proj(a, [[0, 0, 0], [1, 0, 0]]); return Math.hypot(q.x - p.x, q.y - p.y); };
/**
 * ACERCAR con la rueda (hacia el cursor, como AutoCAD) hasta `ppm` px por metro, con
 * `centro` en el centro del hueco libre. Se mide cuánto acerca una muesca y se elige
 * DÓNDE poner el cursor para acabar centrado.
 */
export const acercarA = async (a, centro, ppm) => {
  const [s0] = await proj(a, [centro]);
  const T0 = await hueco(a);
  // el cursor, sobre el punto (si está en el lienzo) o en el centro del hueco
  const dentro = (p) => p.x > 30 && p.x < 1250 && p.y > T0.y - T0.alto / 2 && p.y < T0.y + T0.alto / 2;
  const c0 = dentro(s0) ? s0 : { x: T0.x, y: T0.y };
  await mover(a, c0.x, c0.y, 10);
  const m0 = await pxm(a);
  const dir = ppm >= m0 ? -120 : 120;              // rueda adelante acerca, atrás aleja
  for (let i = 0; i < 2; i++) { await a.pag.mouse.wheel({ deltaY: dir }); await a.quieto(1, 140); }
  const m1 = await pxm(a); const k1 = Math.pow(m1 / m0, 1 / 2);
  if (!(Math.abs(k1 - 1) > 0.001)) { console.log("  x la rueda no cambia la escala"); return; }
  const N = Math.max(0, Math.round(Math.log(ppm / m1) / Math.log(k1)));
  const K = Math.pow(k1, N);
  const [s1] = await proj(a, [centro]); const T = await hueco(a);
  let c = { x: (T.x - K * s1.x) / (1 - K), y: (T.y - K * s1.y) / (1 - K) };
  // que el cursor no caiga en la cinta ni en la línea de órdenes (la rueda haría otra cosa)
  c = { x: Math.max(40, Math.min(1240, c.x)), y: Math.max(T.y - T.alto / 2, Math.min(T.y + T.alto / 2, c.y)) };
  if (N > 0) {
    await mover(a, c.x, c.y, 10);
    for (let i = 0; i < N; i++) { await a.pag.mouse.wheel({ deltaY: dir }); await a.quieto(1, 120); }
  }
  const [s2] = await proj(a, [centro]);
  console.log(`   acercar: ${N + 2} muescas ${dir < 0 ? "adelante" : "atrás"}, ${(await pxm(a)).toFixed(1)} px/m, centro (${s2.x.toFixed(0)}, ${s2.y.toFixed(0)}) objetivo (${T.x.toFixed(0)}, ${T.y.toFixed(0)})`);
};
/** Soltar lo que quede puesto (Esc) y la selección; el cursor a un rincón del hueco. */
export const soltar = async (a) => {
  await a.pag.keyboard.press("Escape");
  await a.pag.evaluate(() => { try { window.__hekatanClearSelection?.(); } catch (e) {} try { window.dispatchEvent(new CustomEvent("hk:model-selection", { detail: { ultimo: null } })); } catch (e) {} });
  await a.quieto(1, 200);
};
export const modeloInfo = (a) => a.pag.evaluate(() => { const S = window.__hekatanStates; return { nudos: S.nodes.rawVal.length, elems: S.elements.rawVal.length, q4: S.elements.rawVal.filter((e) => e.length === 4).length, apoyos: S.nodeInputs.rawVal.supports?.size ?? 0 }; });
