// Tutorial 9/10/11 · Cerchas Warren / Howe / Pratt desde la CINTA de acceso rápido: dibujar (polilíneas), apoyar
// («Apoyo»), cargar («Carga», −10 kN) y ver el CÁLCULO (la app resuelve sola: deformada y
// diagrama de axiles). Todo con el cursor sobre la cinta de dos filas, sin abrir menús.
const LIM = { x: 0, y: 0, w: 1280, h: 640 };
const NOMBRE = { warren: "Warren", howe: "Howe", pratt: "Pratt" };
const ARCHIVO = { warren: "cercha_warren", howe: "cercha_howe", pratt: "cercha_pratt" };   // nombre para «Guardar como…»
const NUM = { warren: 9, howe: 10, pratt: 11 };

const mover = async (a, x, y, pasos = 10) => {
  const p0 = (await a.pag.evaluate(() => window.__tutXY || null)) || { x, y };
  for (let i = 1; i <= pasos; i++) {
    const cx = p0.x + (x - p0.x) * (i / pasos), cy = p0.y + (y - p0.y) * (i / pasos);
    await a.pag.mouse.move(cx, cy);
    await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x: cx, y: cy });
    await a.quieto(1, 45);
  }
};
const clicRojo = async (a, x, y, lento = true, boton = "left") => {
  await mover(a, x, y, lento ? 14 : 6); await a.quieto(lento ? 3 : 1, 260);
  await a.pag.evaluate((q) => window.__tutClick && window.__tutClick(q.x, q.y), { x, y });
  await a.quieto(lento ? 3 : 2, 260); await a.pag.mouse.click(x, y, { button: boton }); await a.quieto(2, 260);
};
const caja = async (a, r, txt, frames = 5) => { await a.pag.evaluate((q) => window.__tutCaja(q.r, q.t, q.L), { r, t: txt, L: LIM }); await a.quieto(frames, 340); await a.pag.evaluate(() => window.__tutSinCaja()); };
const rect = (a, fn, arg) => a.pag.evaluate((q) => { const f = new Function("arg", q.src); const el = f(q.arg); if (!el) return null; el.scrollIntoView?.({ block: "center" }); const rc = el.getBoundingClientRect(); return { x: rc.left + rc.width / 2, y: rc.top + rc.height / 2, rx: rc.left, ry: rc.top, rw: rc.width, rh: rc.height }; }, { src: `return (${fn.toString()})(arg)`, arg });
// botón de la CINTA por texto
const cinta = async (a, re, txt, lento = false) => {
  const b = await rect(a, (re) => [...document.querySelectorAll("#hk-ribbon button")].find((b) => new RegExp(re, "i").test(b.textContent || "")), re);
  if (!b) { console.log("  x no está en la cinta: " + re); return false; }
  await mover(a, b.x, b.y, 12);
  if (txt) await caja(a, { x: b.rx, y: b.ry, w: b.rw, h: b.rh }, txt, 5);
  await clicRojo(a, b.x, b.y, lento); return true;
};
const barraEstado = async (a, re, txt) => {
  const b = await rect(a, (re) => [...document.querySelectorAll("button")].find((b) => new RegExp(re).test((b.textContent || "").trim())), re);
  if (!b) { console.log("  x no está el conmutador " + re); return false; }
  await mover(a, b.x, b.y, 12);
  if (txt) await caja(a, { x: b.rx, y: b.ry - 40, w: b.rw, h: b.rh + 40 }, txt, 4);
  await clicRojo(a, b.x, b.y, false); return true;
};
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
const clicMundo = async (a, p, txt, lento = false) => {
  const [q] = await proj(a, [p]);
  await mover(a, q.x, q.y, txt ? 14 : 8);
  if (txt) await caja(a, { x: q.x - 12, y: q.y - 12, w: 24, h: 24 }, txt, 5);
  await clicRojo(a, q.x, q.y, lento);
};
const estado = (a) => a.pag.evaluate(() => document.getElementById("hk-cad-status")?.textContent);
const vista = (a, p, t) => a.pag.evaluate(({ p, t }) => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; c.setActiveCamera?.(c.perspCamera); c.camera.position.set(...p); c.camera.up.set(0, 0, 1); c.controls.target.set(...t); c.camera.lookAt(...t); c.controls.update(); c.render(); }, { p, t });
const orbita = async (a, c, r, z0, t, n = 24) => { for (let i = 0; i <= n; i++) { const th = -1.2 + 1.6 * Math.PI * i / n; await vista(a, [c[0] + r * Math.cos(th), c[1] + r * Math.sin(th), z0], t); await a.quieto(1, 120); } };

// geometría: vano 12, canto 2, 6 paneles
const L = 12, H = 2, n = 6, d = L / n;
export function crear(tipo) {
const inf = Array.from({ length: n + 1 }, (_, i) => [i * d - L / 2, 0, 0]);   // centrada en el origen: el alzado se centra en (0,0)
// Warren: cordón superior sobre los CENTROS de panel (6 nudos) y diagonales en zigzag.
// Howe / Pratt: cordón superior sobre los nudos (7), verticales y diagonales (Howe: caen hacia
// el apoyo, a compresión; Pratt: al revés, a tracción).
const sup = tipo === "warren" ? Array.from({ length: n }, (_, i) => [(i + 0.5) * d - L / 2, 0, H]) : Array.from({ length: n + 1 }, (_, i) => [i * d - L / 2, 0, H]);
const zig = []; for (let i = 0; i < n; i++) { zig.push(inf[i]); zig.push(sup[i]); } zig.push(inf[n]);
const cargados = tipo === "warren" ? sup : sup.slice(1, n);   // nudos superiores cargados (no los de apoyo)
const diagonales = []; for (let i = 0; i < n; i++) { const izq = i < n / 2; diagonales.push(tipo === "howe" ? (izq ? [inf[i], sup[i + 1]] : [sup[i], inf[i + 1]]) : (izq ? [sup[i], inf[i + 1]] : [inf[i], sup[i + 1]])); }
// Enter termina la polilínea (el clic derecho abre el menú contextual y ensucia el vídeo)
const terminar = async (a, p) => { const [q] = await proj(a, [p]); await mover(a, q.x + 40, q.y - 40, 6); await a.pag.keyboard.press("Enter"); await a.quieto(2, 260); };
// acercar con la rueda sobre un punto del mundo (la cercha de 12 × 2 m salía diminuta en la rejilla de 20 m)
const acercar = async (a, p, n) => { const [q] = await proj(a, [p]); await mover(a, q.x, q.y, 10); for (let i = 0; i < n; i++) { await a.pag.mouse.wheel({ deltaY: -120 }); await a.quieto(1, 120); } await a.quieto(2, 260); };
const modelo = (a) => a.pag.evaluate(() => { const S = window.__hekatanStates; const D = S.deformOutputs.rawVal; const A = S.analyzeOutputs.rawVal; const u = D?.deformations ? Math.max(...[...D.deformations.values()].map((v) => Math.abs(v[2]))) : 0; const N = A?.normals ? Math.max(...[...A.normals.values()].map((v) => Math.max(...v.map(Math.abs)))) : 0; return { nudos: S.nodes.rawVal.length, barras: S.elements.rawVal.length, apoyos: S.nodeInputs.rawVal.supports?.size ?? 0, cargas: S.nodeInputs.rawVal.loads?.size ?? 0, uz_mm: +(u * 1000).toFixed(3), N_kN: +N.toFixed(2) }; });

// ── Herramientas de la cinta de acceso rápido (19-sep-2026) ─────────────────
// Jorge: «debes usar solo acceso rápido». Todo por la cinta: pestañas, botones, casillas.
const pestana = async (a, id, txt) => {
  const b = await rect(a, (id) => document.getElementById("hk-ribbon-tab-" + id), id);
  if (!b) { console.log("  x no está la pestaña " + id); return false; }
  await mover(a, b.x, b.y, 12);
  if (txt) await caja(a, { x: b.rx, y: b.ry, w: b.rw, h: b.rh }, txt, 5);
  await clicRojo(a, b.x, b.y, false); return true;
};
// botón VISIBLE de la cinta cuyo texto casa con la expresión (anclada: «Carga» no es «Carga q»)
const botonRect = (a, re) => rect(a, (re) => [...document.querySelectorAll("#hk-ribbon button")].find((b) => b.offsetParent !== null && new RegExp(re).test((b.textContent || "").replace(/\s+/g, " ").trim())), re);
const boton = async (a, re, txt, lento = false) => {
  const b = await botonRect(a, re);
  if (!b) { console.log("  x no está en la cinta: " + re); return false; }
  await mover(a, b.x, b.y, 12);
  if (txt) await caja(a, { x: b.rx, y: b.ry, w: b.rw, h: b.rh }, txt, 5);
  await clicRojo(a, b.x, b.y, lento); return true;
};
const senalar = async (a, re, txt, frames = 6) => {
  const b = await botonRect(a, re);
  if (!b) { console.log("  x no está en la cinta: " + re); return false; }
  await mover(a, b.x, b.y, 12); await caja(a, { x: b.rx, y: b.ry, w: b.rw, h: b.rh }, txt, frames); return true;
};
// Hueco libre del lienzo: debajo de la cinta y su línea de estado, encima de la línea de órdenes
const hueco = (a) => a.pag.evaluate(() => {
  const rb = document.getElementById("hk-ribbon")?.getBoundingClientRect();
  const es = document.getElementById("hk-ribbon-estado")?.getBoundingClientRect();
  const cmd = document.getElementById("hk3-cmdline")?.getBoundingClientRect();
  const arr = Math.max(rb?.bottom ?? 0, es?.bottom ?? 0) + 20, aba = Math.min(cmd?.top ?? 630, 630) - 10;
  return { x: innerWidth / 2, y: (arr + aba) / 2, alto: aba - arr };
});
const pxm = async (a) => { const [p, q] = await proj(a, [[0, 0, 0], [1, 0, 0]]); return Math.hypot(q.x - p.x, q.y - p.y); };
// ACERCAR con la rueda, con el cursor, hasta que el vano L ocupe `ancho` px, centrado en el hueco.
// La rueda acerca hacia el cursor (el punto bajo él se queda quieto): se mide cuánto acerca una
// muesca y se elige DÓNDE poner el cursor para que la cercha acabe en el centro del hueco.
const acercarA = async (a, centro, Lm, ancho) => {
  const [s0] = await proj(a, [centro]);
  await mover(a, s0.x, s0.y, 10);
  const m0 = await pxm(a);
  for (let i = 0; i < 3; i++) { await a.pag.mouse.wheel({ deltaY: -120 }); await a.quieto(1, 140); }
  const m1 = await pxm(a); const k1 = Math.pow(m1 / m0, 1 / 3);
  if (!(k1 > 1.001)) { console.log("  x la rueda no acerca"); return; }
  const N = Math.max(0, Math.round(Math.log((ancho / Lm) / m1) / Math.log(k1)));
  const K = Math.pow(k1, N);
  const [s1] = await proj(a, [centro]); const T = await hueco(a);
  const c = { x: (T.x - K * s1.x) / (1 - K), y: (T.y - K * s1.y) / (1 - K) };
  if (N > 0) {
    await mover(a, c.x, c.y, 10);
    for (let i = 0; i < N; i++) { await a.pag.mouse.wheel({ deltaY: -120 }); await a.quieto(1, 120); }
  }
  const [s2] = await proj(a, [centro]);
  console.log(`   acercar: ${N + 3} muescas, ${(await pxm(a)).toFixed(0)} px/m, centro (${s2.x.toFixed(0)}, ${s2.y.toFixed(0)}) objetivo (${T.x.toFixed(0)}, ${T.y.toFixed(0)})`);
};

const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada(`Cercha ${NOMBRE[tipo]}: dibujar, apoyar, cargar y calcular`, `Tutorial ${NUM[tipo]}`, 16); } },
  {
    rotulo: "1 · La cinta de acceso rápido y sus pestañas; los paneles laterales se cierran",
    hacer: async (a) => {
      await a.pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo", "0"); } catch (e) {} try { window.__hekatanDrawingPoints.val = []; window.__hekatanDrawingPolylines.val = [[]]; window.__hekatanDrawingAreas.val = []; } catch (e) {} });
      await a.general(); await a.quieto(2, 320);
      await panel(a, "izq", false); await panel(a, "der", false);
      const t = await rect(a, () => document.getElementById("hk-ribbon-tab-dibujo"));
      const t2 = await rect(a, () => document.getElementById("hk-ribbon-tab-ifc"));
      if (t && t2) await caja(a, { x: t.rx, y: t.ry, w: t2.rx + t2.rw - t.rx, h: t.rh }, "Pestañas, como en AutoCAD: Dibujo · Rejilla · Áreas · Resultados · IFC.", 8);
      const r = await rect(a, () => document.getElementById("hk-ribbon"));
      if (r) await caja(a, { x: r.rx, y: r.ry + 28, w: r.rw * 0.62, h: r.rh - 28 }, "Pestaña Dibujo: dibujar, apoyos, cargas y modificar.", 6);
    },
  },
  {
    rotulo: "2 · Frente (alzado XZ), SNAP y acercar con la rueda",
    hacer: async (a) => {
      await boton(a, "^➡ ?Frente", "Frente: alzado X-Z, el clic cae en Y = 0.");
      await boton(a, "^SNAP", "SNAP: el clic cae en la rejilla, coordenadas exactas.");
      await acercarA(a, [0, 0, H / 2], L, 880);
      await a.quieto(3, 320);
    },
  },
  {
    rotulo: "3 · Cordón inferior: Polilínea, 7 clics de −6 a 6 m cada 2 m, Enter",
    hacer: async (a) => {
      await boton(a, "^⌒ ?Polilínea", "Polilínea: clics seguidos, Enter termina.");
      for (let i = 0; i <= n; i++) await clicMundo(a, inf[i], i === 0 ? "(−6, 0)" : i === n ? "(6, 0)" : "");
      await terminar(a, inf[n]); await a.quieto(3, 320);
    },
  },
  {
    rotulo: tipo === "warren" ? "4 · Cordón superior: 6 clics a 2 m de altura, sobre los centros de los paneles" : "4 · Cordón superior: 7 clics a 2 m de altura, sobre los nudos",
    hacer: async (a) => {
      await boton(a, "^⌒ ?Polilínea");
      for (let i = 0; i < sup.length; i++) await clicMundo(a, sup[i], i === 0 ? (tipo === "warren" ? "(−5, 2)" : "(−6, 2)") : "");
      await terminar(a, sup[sup.length - 1]); await a.quieto(3, 320);
    },
  },
  tipo === "warren" ? {
    rotulo: "5 · Diagonales: una polilínea en zigzag, 13 clics; el clic sobre un nudo lo reusa",
    hacer: async (a) => {
      await boton(a, "^⌒ ?Polilínea");
      for (let i = 0; i < zig.length; i++) await clicMundo(a, zig[i], i === 1 ? "Sobre un nudo que ya existe: se reusa." : "");
      await terminar(a, zig[zig.length - 1]);
      console.log("   modelo:", JSON.stringify(await modelo(a)));
      await a.quieto(4, 320);
    },
  } : {
    rotulo: "5 · Verticales y diagonales con Línea (2 clics + Esc cada una)",
    hacer: async (a) => {
      for (let i = 1; i < n; i++) { await boton(a, "^／ ?Línea", i === 1 ? "Línea: dos clics, Esc termina." : ""); await clicMundo(a, inf[i]); await clicMundo(a, sup[i]); await a.pag.keyboard.press("Escape"); await a.quieto(1, 200); }
      for (let i = 0; i < n; i++) { const [p1, p2] = diagonales[i]; await boton(a, "^／ ?Línea"); await clicMundo(a, p1, i === 0 ? "Diagonal: del nudo inferior al superior del panel." : ""); await clicMundo(a, p2); await a.pag.keyboard.press("Escape"); await a.quieto(1, 200); }
      console.log("   modelo:", JSON.stringify(await modelo(a)));
      await a.quieto(4, 320);
    },
  },
  {
    rotulo: "6 · Apoyos: «Empotr.» y un clic en cada extremo; «Articul.» al lado",
    hacer: async (a) => {
      await boton(a, "^▲ ?Empotr", "Empotr.: clic sobre un nudo, lo empotra (6 grados de libertad).");
      await clicMundo(a, inf[0], "Apoyo izquierdo.", true);
      await clicMundo(a, inf[n], "Apoyo derecho.", true);
      await a.quieto(2, 320);
      await senalar(a, "^△ ?Articul", "Articul.: el apoyo articulado, giros libres. Se usa igual.", 7);
      await a.pag.keyboard.press("Escape");
      await a.pag.evaluate(() => { try { window.__hekatanClearSelection?.(); } catch (e) {} });
      await a.quieto(1, 300);
    },
  },
  {
    rotulo: "7 · Cargas: casilla −10 kN, «Carga» y un clic en cada nudo superior",
    hacer: async (a) => {
      const c = await rect(a, () => [...document.querySelectorAll("#hk-ribbon input")].find((i) => i.offsetParent !== null && i.value === "-10"));
      if (c) { await mover(a, c.x, c.y, 12); await caja(a, { x: c.rx, y: c.ry, w: c.rw, h: c.rh }, "−10 kN por nudo (negativa = hacia abajo).", 5); }
      await boton(a, "^↓ ?Carga ?CG", "Carga: clic sobre un nudo.");
      for (let i = 0; i < cargados.length; i++) await clicMundo(a, cargados[i], i === 0 ? "−10 kN" : "");
      await a.pag.evaluate(() => { const s = window.__hekatanSettings?.(); if (s?.supports) s.supports.val = true; if (s?.loads) s.loads.val = true; });
      console.log("   modelo:", JSON.stringify(await modelo(a)));
      await a.quieto(5, 360);
    },
  },
  {
    rotulo: "8 · Carga distribuida: casilla −5 kN/m, «Carga q» y un clic en cada tramo del cordón superior",
    hacer: async (a) => {
      const c = await rect(a, () => [...document.querySelectorAll("#hk-ribbon input")].find((i) => i.offsetParent !== null && i.value === "-5"));
      if (c) { await mover(a, c.x, c.y, 12); await caja(a, { x: c.rx, y: c.ry, w: c.rw, h: c.rh }, "−5 kN/m sobre la barra.", 5); }
      await boton(a, "^⇊ ?Carga q", "Carga q: clic sobre una barra.");
      for (let i = 0; i + 1 < sup.length; i++) await clicMundo(a, [(sup[i][0] + sup[i + 1][0]) / 2, 0, H], i === 0 ? "En medio del tramo." : "");
      console.log("   modelo:", JSON.stringify(await modelo(a)));
      // soltar el modo (Esc) y la selección que deja, y el cursor fuera del dibujo: si no,
      // la tarjeta de la barra bajo el cursor y «Ver K local» tapan los resultados
      await a.pag.keyboard.press("Escape");
      await a.pag.evaluate(() => { try { window.__hekatanClearSelection?.(); } catch (e) {} });
      { const h = await hueco(a); await mover(a, 1180, h.y + h.alto / 2 - 10, 8); }
      await a.quieto(5, 360);
    },
  },
  {
    rotulo: "9 · Pestaña Resultados: Deformada y Axil",
    hacer: async (a) => {
      await pestana(a, "resultados", "Pestaña Resultados.");
      // la deformada puede venir ya encendida (defecto del lienzo): pulsarla la APAGARÍA
      const yaDef = await a.pag.evaluate(() => !!window.__hekatanSettings?.()?.deformedShape?.rawVal);
      if (yaDef) await senalar(a, "^〰 ?Deformada", "Deformada: ya encendida (botón resaltado).", 5);
      else await boton(a, "^〰 ?Deformada", "Deformada.");
      // 0.3 mm en 12 m no se ven: la escala a 1000 en su casilla de la cinta
      const e = await rect(a, () => document.querySelector('#hk-ribbon input[data-mando="escala"]'));
      if (e) {
        await mover(a, e.x, e.y, 12); await caja(a, { x: e.rx, y: e.ry, w: e.rw, h: e.rh }, "Escala ×1000: 0.3 mm se ven como 30 cm.", 5);
        await clicRojo(a, e.x, e.y, false);
        await a.pag.keyboard.down("Control"); await a.pag.keyboard.press("a"); await a.pag.keyboard.up("Control");
        await a.pag.keyboard.type("1000", { delay: 70 }); await a.pag.keyboard.press("Enter");
      } else console.log("  x no está la casilla de escala");
      await a.quieto(4, 360);
      await boton(a, "^N ?Axil", "Axil: el diagrama con su valor en cada barra.");
      console.log("   modelo:", JSON.stringify(await modelo(a)));
      await a.quieto(6, 360);
    },
  },
  {
    rotulo: "10 · Momento y reacciones",
    hacer: async (a) => {
      await boton(a, "^M ?Momento", "Momento M3.");
      await a.quieto(5, 360);
      await boton(a, "^⤒ ?Reacción", "Reacciones en los apoyos.");
      await a.quieto(6, 360);
      await boton(a, "^⤒ ?Reacción"); await boton(a, "^N ?Axil"); await a.quieto(2, 300);
    },
  },
  {
    rotulo: "11 · Diagrama 2D: el alzado con el diagrama y sus valores",
    hacer: async (a) => {
      await boton(a, "^📐 ?Diagrama 2D", "Diagrama 2D: sin perspectiva, con los valores.");
      await a.quieto(9, 360);
      const x = await rect(a, () => [...document.querySelectorAll("#hk-diagrama-2d button")].find((b) => /✕|×/.test(b.textContent || "")));
      if (x) await clicRojo(a, x.x, x.y, false); else { console.log("  x no está la ✕ del 2D"); await a.pag.keyboard.press("Escape"); }
      await a.quieto(2, 300);
    },
  },
  {
    rotulo: "12 · Medir: pestaña Dibujo, «Medir», del apoyo izquierdo al derecho: 12.000 m",
    hacer: async (a) => {
      await pestana(a, "dibujo", "Pestaña Dibujo.");
      await boton(a, "^📏 ?Medir", "Medir: dos clics.");
      await clicMundo(a, inf[0], "Del apoyo…", true); await clicMundo(a, inf[n], "…al apoyo: 12.000 m.", true);
      await a.quieto(4, 360);
      await a.pag.keyboard.press("Escape"); await a.quieto(1, 200);
      await a.pag.evaluate(() => { try { window.__hekatanClearSelection?.(); } catch (e) {} });
      await a.quieto(1, 200);
    },
  },
  {
    rotulo: "13 · 3D, Encuadrar y girar; = ETABS 22",
    hacer: async (a) => {
      await boton(a, "^🧊 ?3D", "Vista 3D.");
      await boton(a, "^⛶ ?Encuadrar", "Encuadrar: todo el modelo en el hueco libre.");
      await a.quieto(3, 360);
      await orbita(a, [0, 0], 16, 6, [0, 0, 1], 24);
      await vista(a, [0, -18, 7], [0, 0, 1]);
      await boton(a, "^⛶ ?Encuadrar");
      await a.quieto(6, 360);
    },
  },
  {
    rotulo: "14 · Guardar como… (barra de arriba): pide el nombre y descarga el .heks",
    hacer: async (a) => {
      const gc = await rect(a, () => document.querySelector('#hk-cad-tit button[title="Guardar como"]'));
      if (!gc) { console.log("  x no está Guardar como"); return; }
      await mover(a, gc.x, gc.y, 12);
      await caja(a, { x: gc.rx - 4, y: gc.ry - 4, w: gc.rw + 8, h: gc.rh + 8 }, "Guardar como…: pide el nombre. Aquí «" + ARCHIVO[tipo] + ".heks».", 6);
      a.responder(ARCHIVO[tipo]);
      await clicRojo(a, gc.x, gc.y, false);
      await a.archivo("El modelo en .heks: nudos, barras, apoyos y cargas, en texto.", { lineas: 16, marcas: ["support", "load", "frameload"] }).catch(() => null);
      await a.quieto(7, 360);
      await a.sinArchivo().catch(() => {});
      await a.quieto(2, 300);
    },
  },
];
return { ruta: "workspace/?t=new-blank", titulo: `Hekatan Struct · cercha ${NOMBRE[tipo]}: dibujar, apoyar, cargar y calcular`, pasos };
}
