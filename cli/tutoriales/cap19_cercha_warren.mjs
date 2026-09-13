// Tutorial 9 · Cercha Warren desde la CINTA de acceso rápido: dibujar (polilíneas), apoyar
// («Apoyo»), cargar («Carga», −10 kN) y ver el CÁLCULO (la app resuelve sola: deformada y
// diagrama de axiles). Todo con el cursor sobre la cinta de dos filas, sin abrir menús.
export const ruta = "workspace/?t=new-blank";
export const titulo = "Hekatan Struct · cercha Warren: dibujar, apoyar, cargar y calcular";
const LIM = { x: 0, y: 0, w: 1280, h: 640 };

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
const inf = Array.from({ length: n + 1 }, (_, i) => [i * d - L / 2, 0, 0]);   // centrada en el origen: el alzado se centra en (0,0)
const sup = Array.from({ length: n }, (_, i) => [(i + 0.5) * d - L / 2, 0, H]);
const zig = []; for (let i = 0; i < n; i++) { zig.push(inf[i]); zig.push(sup[i]); } zig.push(inf[n]);
// Enter termina la polilínea (el clic derecho abre el menú contextual y ensucia el vídeo)
const terminar = async (a, p) => { const [q] = await proj(a, [p]); await mover(a, q.x + 40, q.y - 40, 6); await a.pag.keyboard.press("Enter"); await a.quieto(2, 260); };
// acercar con la rueda sobre un punto del mundo (la cercha de 12 × 2 m salía diminuta en la rejilla de 20 m)
const acercar = async (a, p, n) => { const [q] = await proj(a, [p]); await mover(a, q.x, q.y, 10); for (let i = 0; i < n; i++) { await a.pag.mouse.wheel({ deltaY: -120 }); await a.quieto(1, 120); } await a.quieto(2, 260); };
const modelo = (a) => a.pag.evaluate(() => { const S = window.__hekatanStates; const D = S.deformOutputs.rawVal; const A = S.analyzeOutputs.rawVal; const u = D?.deformations ? Math.max(...[...D.deformations.values()].map((v) => Math.abs(v[2]))) : 0; const N = A?.normals ? Math.max(...[...A.normals.values()].map((v) => Math.max(...v.map(Math.abs)))) : 0; return { nudos: S.nodes.rawVal.length, barras: S.elements.rawVal.length, apoyos: S.nodeInputs.rawVal.supports?.size ?? 0, cargas: S.nodeInputs.rawVal.loads?.size ?? 0, uz_mm: +(u * 1000).toFixed(3), N_kN: +N.toFixed(2) }; });

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("Cercha Warren: dibujar, apoyar, cargar y calcular", "Tutorial 9", 16); } },
  {
    rotulo: "1 · La cinta de acceso rápido (dos filas): Frente XZ y SNAP",
    hacer: async (a) => {
      await a.pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo", "0"); } catch (e) {} try { window.__hekatanDrawingPoints.val = []; window.__hekatanDrawingPolylines.val = [[]]; window.__hekatanDrawingAreas.val = []; } catch (e) {} });
      await a.general(); await a.quieto(2, 320);
      await panel(a, "izq", false); await panel(a, "der", false);
      const r = await rect(a, () => document.getElementById("hk-ribbon"));
      if (r) { await caja(a, { x: r.rx, y: r.ry, w: r.rw, h: r.rh / 2 }, "Fila 1: Dibujar · Estructura · Analizar · Vista.", 6); await caja(a, { x: r.rx, y: r.ry + r.rh / 2, w: r.rw, h: r.rh / 2 }, "Fila 2: Modificar · Rejilla · Cota Z · Carga.", 6); }
      await cinta(a, "Frente", "Frente: alzado X-Z, el clic cae en Y = 0.");
      await barraEstado(a, "^SNAP", "SNAP (F9): el clic cae en la rejilla, coordenadas exactas.");
      await acercar(a, [0, 0, 1], 24);   // ~5 % por muesca: 24 muescas ≈ ×3
      await a.quieto(3, 320);
    },
  },
  {
    rotulo: "2 · Cordón inferior: Polilínea, 7 clics de −6 a 6 m cada 2 m, Enter para terminar",
    hacer: async (a) => {
      await cinta(a, "Polilínea", "Polilínea: clics seguidos, Enter termina.");
      for (let i = 0; i <= n; i++) await clicMundo(a, inf[i], i === 0 ? "(−6, 0)" : i === n ? "(6, 0)" : "");
      await terminar(a, inf[n]); await a.quieto(3, 320);
    },
  },
  {
    rotulo: "3 · Cordón superior: 6 clics a 2 m de altura, sobre los centros de los paneles",
    hacer: async (a) => {
      await cinta(a, "Polilínea");
      for (let i = 0; i < n; i++) await clicMundo(a, sup[i], i === 0 ? "(−5, 2)" : "");
      await terminar(a, sup[n - 1]); await a.quieto(3, 320);
    },
  },
  {
    rotulo: "4 · Diagonales: una polilínea en zigzag, 13 clics; el clic sobre un nudo lo reusa",
    hacer: async (a) => {
      await cinta(a, "Polilínea");
      for (let i = 0; i < zig.length; i++) await clicMundo(a, zig[i], i === 1 ? "Sobre un nudo existente: se reusa, no se duplica." : "");
      await terminar(a, zig[zig.length - 1]);
      console.log("   modelo:", JSON.stringify(await modelo(a)));
      await a.quieto(4, 320);
    },
  },
  {
    rotulo: "5 · Apoyos: «Apoyo» de la cinta y un clic en cada extremo",
    hacer: async (a) => {
      await cinta(a, "Apoyo", "Apoyo: clic sobre un nudo, lo empotra.");
      await clicMundo(a, inf[0], "Apoyo izquierdo.", true);
      await clicMundo(a, inf[n], "Apoyo derecho.", true);
      await a.quieto(3, 320);
    },
  },
  {
    rotulo: "6 · Cargas: casilla −10 kN, «Carga» y un clic en cada nudo superior; la app calcula sola",
    hacer: async (a) => {
      const c = await rect(a, () => [...document.querySelectorAll("#hk-ribbon input")].find((i) => i.value === "-10"));
      if (c) { await mover(a, c.x, c.y, 12); await caja(a, { x: c.rx, y: c.ry, w: c.rw, h: c.rh }, "−10 kN por nudo (negativa = hacia abajo).", 5); }
      await cinta(a, "Carga", "Carga: clic sobre un nudo, le pone la carga de la casilla.");
      for (let i = 0; i < n; i++) await clicMundo(a, sup[i], i === 0 ? "−10 kN" : "");
      await a.pag.evaluate(() => { const s = window.__hekatanSettings?.(); if (s?.supports) s.supports.val = true; if (s?.loads) s.loads.val = true; });
      const m = await modelo(a); console.log("   modelo:", JSON.stringify(m));
      await a.quieto(5, 360);
    },
  },
  {
    rotulo: "6b · Carga distribuida: casilla −5 kN/m, «Carga q» y un clic en cada tramo del cordón superior",
    hacer: async (a) => {
      const c = await rect(a, () => [...document.querySelectorAll("#hk-ribbon input")].find((i) => i.value === "-5"));
      if (c) { await mover(a, c.x, c.y, 12); await caja(a, { x: c.rx, y: c.ry, w: c.rw, h: c.rh }, "−5 kN/m por barra: la carga distribuida, como Frame Distributed Load de ETABS.", 6); }
      await cinta(a, "Carga q", "Carga q: clic sobre una barra, le pone la distribuida de la casilla.");
      for (let i = 0; i + 1 < sup.length; i++) await clicMundo(a, [(sup[i][0] + sup[i + 1][0]) / 2, 0, H], i === 0 ? "En medio del tramo." : "");
      const m = await modelo(a); console.log("   modelo:", JSON.stringify(m));
      await a.quieto(5, 360);
    },
  },
  {
    rotulo: "7 · Resultados: deformada y diagrama de axiles (Settings › Frame results)",
    hacer: async (a) => {
      await panel(a, "izq", true);
      await a.abrir("Analyze").catch(() => {});
      const ok = await a.marcar("fila", "Deformed shape", "La deformada, amplificada.").catch(() => false);
      if (!ok) await a.ajuste("deformedShape", true);
      const sel = await rect(a, () => { const row = [...document.querySelectorAll(".tp-lblv")].find((x) => /Frame results/i.test(x.textContent || "")); const s = row?.querySelector("select"); if (s) s.id = "hk-tmp-frame-results"; return s || row; });
      if (sel) { await mover(a, sel.x, sel.y, 12); await caja(a, { x: sel.rx - 160, y: sel.ry - 4, w: sel.rw + 170, h: sel.rh + 8 }, "Frame results: Axial Force (diagram).", 5); await clicRojo(a, sel.x, sel.y, false); await a.pag.select("#hk-tmp-frame-results", "contour:normals").catch(() => {}); }
      await a.ajuste("frameResults", "contour:normals");
      await panel(a, "izq", false); await a.quieto(6, 360);
    },
  },
  {
    rotulo: "8 · Medir: «Medir» de la cinta, del apoyo izquierdo al derecho: 12.000 m",
    hacer: async (a) => {
      await cinta(a, "Medir", "Medir / acotar: dos clics.");
      await clicMundo(a, inf[0], "Del apoyo…", true); await clicMundo(a, inf[n], "…al apoyo: 12.000 m.", true);
      await a.quieto(4, 360);
    },
  },
  {
    rotulo: "9 · 3D con la deformada y los axiles; = ETABS 22",
    hacer: async (a) => {
      await cinta(a, "3D", "Vista 3D.");
      await a.quieto(3, 360);
      await orbita(a, [0, 0], 16, 6, [0, 0, 1], 24);
      await vista(a, [0, -18, 7], [0, 0, 1]); await a.quieto(8, 360);
    },
  },
];
