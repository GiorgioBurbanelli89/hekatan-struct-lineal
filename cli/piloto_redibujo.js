/**
 * PILOTO DE REDIBUJO (17-oct-2026) — demuestra que un ejemplo se puede DIBUJAR con la interfaz.
 * Jorge: «todas las estructuras de ejemplo deben tener una forma de demostrar que también se pueden
 * dibujar · siempre con el cursor virtual, presionando el botón que se requiera».
 *
 * Corre DENTRO de la página (sirve igual en el panel de vista previa y en puppeteer):
 *   1. en /workspace/?t=<id>:   __piloto.leer()       → guarda el modelo del ejemplo (sessionStorage)
 *   2. en /workspace/?t=new-blank: __piloto.dibujar() → con un cursor virtual VISIBLE pulsa «Nuevo»,
 *      «Línea» (una vez por barra) y «Losa» (una por cáscara) en la cinta, y teclea las coordenadas en la
 *      línea de órdenes, como en AutoCAD/ETABS. Nada se escribe en los datos del dibujo por código.
 *   3. __piloto.comparar() → mismas barras y mismas cáscaras (por coordenadas, a 1e-4 m).
 * Estado en vivo: __piloto.estado (paso, hechos, total, error).
 */
(() => {
  const W = window;
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
  const CLAVE = "hk_piloto_modelo";
  const k4 = (v) => (Math.round(v * 1e4) / 1e4).toFixed(4);
  const clavePunto = (p) => p.map(k4).join(",");
  const estado = { paso: "", hechos: 0, total: 0, error: null, fin: false };

  // ── cursor virtual ───────────────────────────────────────────────────────────
  let cur = { x: 400, y: 300 };
  const cursor = () => {
    let c = document.getElementById("hk-piloto-cursor");
    if (!c) {
      c = document.createElement("div"); c.id = "hk-piloto-cursor";
      c.innerHTML = '<svg width="22" height="30" viewBox="0 0 26 34"><path d="M2 2 L2 27 L8.5 21 L13 32 L17.5 30 L13 19.5 L22 19.5 Z" fill="#fff" stroke="#000" stroke-width="2" stroke-linejoin="round"/></svg>';
      c.style.cssText = "position:fixed;left:400px;top:300px;z-index:2147483647;pointer-events:none;transform:translate(-2px,-2px)";
      document.body.appendChild(c);
    }
    return c;
  };
  const aro = (x, y) => { const a = document.createElement("div");
    a.style.cssText = `position:fixed;left:${x - 14}px;top:${y - 14}px;width:28px;height:28px;border-radius:50%;border:3px solid #fbbf24;z-index:2147483646;pointer-events:none;transition:all .35s ease-out`;
    document.body.appendChild(a); requestAnimationFrame(() => { a.style.transform = "scale(1.7)"; a.style.opacity = "0"; }); setTimeout(() => a.remove(), 450); };
  const mover = async (x, y, ms) => {
    const c = cursor(), p0 = { ...cur }, n = Math.max(1, Math.round(ms / 16));
    for (let i = 1; i <= n; i++) { const t = i / n, s = t * t * (3 - 2 * t);
      c.style.left = p0.x + (x - p0.x) * s + "px"; c.style.top = p0.y + (y - p0.y) * s + "px"; if (ms > 0) await esperar(16); }
    cur = { x, y };
  };
  const centro = (e) => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  /** lleva el cursor al elemento y lo pulsa (comprueba que es ESE elemento el que está debajo) */
  const pulsar = async (e, ms) => {
    if (!e) throw new Error("botón no encontrado");
    const [x, y] = centro(e);
    await mover(x, y, ms);
    const debajo = document.elementFromPoint(x, y);
    if (!debajo || !(debajo === e || e.contains(debajo))) throw new Error(`el botón «${(e.title || e.textContent || "").trim().slice(0, 30)}» está tapado por ${debajo ? (debajo.id || debajo.className || debajo.tagName) : "nada"}`);
    aro(x, y);
    for (const t of ["pointerdown", "mousedown", "pointerup", "mouseup"]) e.dispatchEvent(new MouseEvent(t, { bubbles: true, clientX: x, clientY: y }));
    e.click(); await esperar(ms > 0 ? 60 : 0);
  };
  const botonCinta = (nombre) => [...document.querySelectorAll("#hk-ribbon button")].find((b) => (b.title || "").startsWith(nombre + " ("));
  const cmd = () => document.getElementById("hk3-cmd-input");
  /** teclea en la línea de órdenes y Enter */
  const teclear = async (texto, ms) => {
    const i = cmd(); i.focus(); i.value = texto; i.dispatchEvent(new Event("input", { bubbles: true }));
    for (const t of ["keydown", "keypress", "keyup"]) i.dispatchEvent(new KeyboardEvent(t, { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true }));
    await esperar(ms > 0 ? Math.max(30, ms / 3) : 0);
  };
  const escape = () => cmd().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", code: "Escape", keyCode: 27, bubbles: true }));

  // ── 1. leer el ejemplo ───────────────────────────────────────────────────────
  function leer() {
    const S = W.__hekatanStates;
    const N = S?.nodes?.rawVal ?? [], E = S?.elements?.rawVal ?? [];
    const frames = [], shells = [], otros = {};
    for (const e of E) {
      if (e.length === 2) frames.push([N[e[0]], N[e[1]]]);
      else if (e.length === 3 || e.length === 4) shells.push(e.map((i) => N[i]));
      else otros[e.length] = (otros[e.length] ?? 0) + 1;
    }
    const m = { id: new URLSearchParams(location.search).get("t"), frames, shells, otros, nudos: N.length };
    try { sessionStorage.setItem(CLAVE, JSON.stringify(m)); } catch {}
    return { id: m.id, nudos: N.length, barras: frames.length, cascaras: shells.length, otros };
  }

  // ── 2. dibujarlo con la interfaz ─────────────────────────────────────────────
  async function dibujar(opc = {}) {
    const ms = opc.ms ?? 120;            // duración de cada movimiento del cursor (0 = sin animar)
    const m = opc.modelo ?? JSON.parse(sessionStorage.getItem(CLAVE) || "null");
    Object.assign(estado, { paso: "inicio", hechos: 0, total: 0, error: null, fin: false });
    try {
      if (!m) throw new Error("no hay modelo leído: primero __piloto.leer() en el ejemplo");
      estado.total = m.frames.length + m.shells.length;
      // cinta clásica (el Modo Revit no tiene Línea ni Losa libres); al final se deja como estaba
      estado.revitAntes = document.body.classList.contains("hk-revit-on");
      if (estado.revitAntes) {
        estado.paso = "cinta clásica";
        await pulsar([...document.querySelectorAll("button")].find((b) => /Cinta clásica/.test(b.textContent) && b.getBoundingClientRect().width > 0), ms * 3);
        await esperar(700);
      }
      // archivo nuevo
      estado.paso = "nuevo";
      await pulsar(document.querySelector('#hk-cad-tit button[title="Nuevo"]'), ms * 3);
      for (let i = 0; i < 30 && !document.querySelector("#hk-confirmar"); i++) await esperar(30);
      const si = [...document.querySelectorAll("#hk-confirmar button")].pop();
      if (si) await pulsar(si, ms * 2);
      await esperar(300);
      // barras: «Línea», punto i, punto j, Esc
      estado.paso = "barras";
      for (const [a, b] of m.frames) {
        await pulsar(botonCinta("Línea"), ms);
        await mover(...centro(cmd()), ms);
        await teclear(a.map(k4).join(","), ms); await teclear(b.map(k4).join(","), ms);
        escape(); estado.hechos++;
        if (ms === 0 && estado.hechos % 50 === 0) await esperar(0);   // deja respirar a la página
      }
      // cáscaras: «Losa» y sus vértices
      estado.paso = "cascaras";
      for (const s of m.shells) {
        await pulsar(botonCinta("Losa"), ms);
        await mover(...centro(cmd()), ms);
        for (const p of s) await teclear(p.map(k4).join(","), ms);
        escape(); estado.hechos++;
        if (ms === 0 && estado.hechos % 50 === 0) await esperar(0);
      }
      if (estado.revitAntes) { const t = document.getElementById("hk-revit-toggle"); if (t) await pulsar(t, ms * 3); }
      estado.paso = "listo";
    } catch (e) { estado.error = String(e?.message ?? e); }
    estado.fin = true;
    return { ...estado };
  }

  // ── 3. comparar lo dibujado con el ejemplo ───────────────────────────────────
  function comparar() {
    const m = JSON.parse(sessionStorage.getItem(CLAVE) || "null");
    const P = W.__hekatanDrawingPoints?.rawVal ?? [], L = W.__hekatanDrawingPolylines?.rawVal ?? [], A = new Set(W.__hekatanDrawingAreas?.rawVal ?? []);
    const seg = (p, q) => [clavePunto(p), clavePunto(q)].sort().join("|");
    const cara = (pts) => pts.map(clavePunto).sort().join("|");
    const dibBarras = new Set(), dibCaras = new Set();
    L.forEach((pl, i) => {
      if (!pl?.length) return;
      if (A.has(i)) { const v = pl[0] === pl[pl.length - 1] ? pl.slice(0, -1) : pl; dibCaras.add(cara(v.map((j) => P[j]))); return; }
      for (let j = 0; j + 1 < pl.length; j++) dibBarras.add(seg(P[pl[j]], P[pl[j + 1]]));
    });
    const faltanB = m.frames.filter(([a, b]) => !dibBarras.has(seg(a, b)));
    const faltanC = m.shells.filter((s) => !dibCaras.has(cara(s)));
    const esperadas = new Set(m.frames.map(([a, b]) => seg(a, b)));
    const sobranB = [...dibBarras].filter((s) => !esperadas.has(s));
    return { id: m.id, barras: m.frames.length, cascaras: m.shells.length, otros: m.otros,
      faltanBarras: faltanB.length, faltanCascaras: faltanC.length, sobranBarras: sobranB.length,
      ejemploFalta: faltanB.slice(0, 2).map(([a, b]) => clavePunto(a) + " → " + clavePunto(b)), ok: !faltanB.length && !faltanC.length && !sobranB.length };
  }

  W.__piloto = { leer, dibujar, comparar, estado };
})();
