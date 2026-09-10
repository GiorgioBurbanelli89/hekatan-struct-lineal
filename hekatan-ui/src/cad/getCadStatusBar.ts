/**
 * getCadStatusBar.ts — la BARRA DE ESTADO de abajo, como la de AutoCAD.
 *
 * Una franja fija en el borde inferior con, de izquierda a derecha:
 *   · las coordenadas del cursor (X Y Z en metros),
 *   · el mensaje de estado del dibujo (lo que antes quedaba tapado por la
 *     ventana de comandos: iban las dos centradas abajo, una encima de otra),
 *   · el plano de trabajo y la cota Z,
 *   · los conmutadores SNAP (F9) · ORTO (F8) · POLAR (F10) · OSNAP (F3),
 *     encendidos en cian, que hacen lo mismo que sus teclas.
 *
 * No calcula nada: lee las banderas que ya expone drawing.ts
 * (__hekatanSnapEnabled, __hekatanOrthoMode, __hekatanPolarTrack,
 * __hekatanOsnapOn, __hekatanCursorXYZ, __hekatanCadStatusText) y llama a
 * sus conmutadores (__hekatanToggleSnap/Ortho/Polar/Osnap).
 */
export function addCadStatusBar(): HTMLElement {
  const W = window as any;
  const barra = document.createElement("div");
  barra.id = "hk-statusbar";
  barra.style.cssText = [
    "position:fixed", "left:0", "right:0", "bottom:0", "height:26px", "z-index:99998",
    "display:flex", "align-items:center", "gap:14px", "padding:0 10px",
    "background:var(--hk-chrome, rgba(10,18,32,.97))", "border-top:1px solid var(--hk-borde, #1e3a4a)",
    "color:var(--hk-suave, #94a3b8)", "font:11px Consolas,monospace", "white-space:nowrap",
    "user-select:none",
  ].join(";") + ";";

  const coords = document.createElement("span");
  coords.id = "hk-statusbar-xyz";
  coords.style.cssText = "color:var(--hk-foco, #22d3ee);min-width:230px;";
  coords.textContent = "X= 0.00  Y= 0.00  Z= 0.00 m";

  const msg = document.createElement("span");
  msg.id = "hk-statusbar-msg";
  msg.style.cssText = "flex:1;overflow:hidden;text-overflow:ellipsis;color:var(--hk-texto, #cbd5e1);";

  const plano = document.createElement("span");
  plano.id = "hk-statusbar-plano";
  plano.style.cssText = "color:#94a3b8;";

  const conm = document.createElement("span");
  conm.style.cssText = "display:flex;gap:4px;";
  const botones: Array<{ el: HTMLButtonElement; on: () => boolean }> = [];
  const boton = (texto: string, ayuda: string, on: () => boolean, toggle: () => void) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = texto;
    b.title = ayuda;
    b.style.cssText = "height:20px;padding:0 8px;border-radius:4px;cursor:pointer;font:600 10px Consolas,monospace;" +
      "border:1px solid #1e3a4a;background:transparent;color:#64748b;letter-spacing:.3px;";
    b.addEventListener("click", () => { try { toggle(); } catch {} pintar(); });
    botones.push({ el: b, on });
    conm.appendChild(b);
  };
  boton("SNAP F9", "Engancha a los CRUCES de la rejilla (F9). Apagado, el punto cae donde esta el cursor",
    () => W.__hekatanSnapEnabled !== false, () => W.__hekatanToggleSnap?.());
  boton("ORTO F8", "Solo horizontales y verticales (F8)",
    () => !!W.__hekatanOrthoMode, () => W.__hekatanToggleOrtho?.());
  boton("POLAR F10", "Rastreo polar a 45° (F10)",
    () => W.__hekatanPolarTrack !== false, () => W.__hekatanTogglePolar?.());
  boton("OSNAP F3", "Referencias: origen, extremo, medio, nudo, centro, interseccion... (F3). CLIC DERECHO: elegir cuales",
    () => W.__hekatanOsnapOn !== false, () => W.__hekatanToggleOsnap?.());

  // ── CUADRO DE REFERENCIAS (el «Object Snap Settings» de AutoCAD) ──────────
  //
  // Los enganches existían todos, pero no había DÓNDE elegirlos: el botón OSNAP
  // solo los encendía o apagaba en bloque. En AutoCAD se abre con el clic derecho
  // sobre ese mismo botón, y en Revit es la lista de «Snaps». Aquí igual: clic
  // derecho sobre OSNAP F3 → la lista, con su tecla y lo que engancha cada uno.
  const REFS: Array<[string, string, string]> = [
    ["ori",  "Origen (0,0,0)",     "el punto de partida del modelo"],
    ["end",  "Punto final",        "los extremos de cada barra"],
    ["node", "Nudo",               "los puntos dibujados"],
    ["int",  "Intersección",       "donde se cruzan dos líneas o dos ejes"],
    ["mid",  "Punto medio",        "la mitad de una barra"],
    ["cen",  "Centro",             "el centro de un círculo y el centroide de un paño"],
    ["per",  "Perpendicular",      "el pie de la perpendicular a una barra"],
    ["nea",  "Cercano",            "el punto de la barra más próximo al cursor"],
    ["grid", "Cruce de rejilla",   "los cruces de la cuadrícula — pide SNAP (F9)"],
    ["track","Rastreo",            "se alinea con un nudo ya dibujado y traza la guía"],
  ];
  const cuadro = document.createElement("div");
  cuadro.id = "hk-osnap-cuadro";
  cuadro.style.cssText = [
    "position:fixed", "z-index:99999", "display:none", "padding:8px 10px",
    "background:var(--hk-chrome, rgba(10,18,32,.98))", "border:1px solid var(--hk-foco, #22d3ee)",
    "border-radius:8px", "box-shadow:0 10px 30px rgba(0,0,0,.55)",
    "font:12px Consolas,monospace", "color:var(--hk-texto, #cbd5e1)", "min-width:270px",
  ].join(";") + ";";
  const leerRef = (k: string) => k === "track"
    ? W.__hekatanTrack !== false
    : (W.__hekatanOsnap?.[k] ?? false);
  const ponerRef = (k: string, v: boolean) => {
    if (k === "track") { W.__hekatanTrack = v; return; }
    W.__hekatanOsnap = W.__hekatanOsnap ?? {};
    W.__hekatanOsnap[k] = v;
  };
  {
    const tit = document.createElement("div");
    tit.textContent = "Referencias a objetos (OSNAP · F3)";
    tit.style.cssText = "color:var(--hk-foco,#22d3ee);font-weight:600;margin-bottom:6px";
    cuadro.appendChild(tit);
    for (const [k, nombre, ayuda] of REFS) {
      const fila = document.createElement("label");
      fila.title = ayuda;
      fila.style.cssText = "display:flex;align-items:center;gap:7px;padding:2px 0;cursor:pointer";
      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = leerRef(k);
      chk.style.cssText = "margin:0;cursor:pointer";
      chk.addEventListener("change", () => {
        ponerRef(k, chk.checked);
        // encender una referencia con el OSNAP apagado no serviría de nada
        if (chk.checked && W.__hekatanOsnapOn === false) W.__hekatanOsnapOn = true;
        pintar();
      });
      const txt = document.createElement("span");
      txt.textContent = nombre;
      fila.append(chk, txt);
      cuadro.appendChild(fila);
    }
    const pie = document.createElement("div");
    pie.textContent = "F3 las apaga todas · ALT las suelta mientras mueves";
    pie.style.cssText = "margin-top:7px;color:var(--hk-suave,#64748b);font-size:11px";
    cuadro.appendChild(pie);
    document.body.appendChild(cuadro);
  }
  const abrirCuadro = (x: number, y: number) => {
    for (const [k] of REFS) {
      const c = cuadro.querySelectorAll("input")[REFS.findIndex((r) => r[0] === k)] as HTMLInputElement;
      if (c) c.checked = leerRef(k);
    }
    cuadro.style.display = "block";
    const r = cuadro.getBoundingClientRect();
    cuadro.style.left = Math.max(6, Math.min(x - r.width / 2, window.innerWidth - r.width - 6)) + "px";
    cuadro.style.top = Math.max(6, y - r.height - 12) + "px";
  };
  const cerrarCuadro = () => { cuadro.style.display = "none"; };
  window.addEventListener("pointerdown", (e) => {
    if (!cuadro.contains(e.target as Node)) cerrarCuadro();
  }, true);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarCuadro(); }, true);
  W.__hekatanOsnapCuadro = (x?: number, y?: number) => {
    const b = botones.find(({ el }) => (el.textContent || "").includes("OSNAP"))?.el;
    const r = b?.getBoundingClientRect();
    abrirCuadro(x ?? (r ? r.left + r.width / 2 : 200), y ?? (r ? r.top : 400));
  };

  {
    const bOsnap = botones.find(({ el }) => (el.textContent || "").includes("OSNAP"))?.el;
    bOsnap?.addEventListener("contextmenu", (e) => {
      e.preventDefault(); e.stopPropagation();
      const r = bOsnap.getBoundingClientRect();
      abrirCuadro(r.left + r.width / 2, r.top);
    });
    if (bOsnap) bOsnap.textContent = "OSNAP F3 ▾";
  }

  const unidades = document.createElement("span");
  unidades.textContent = "m · kN";
  unidades.style.cssText = "color:#475569;";

  barra.append(coords, msg, plano, conm, unidades);
  document.body.appendChild(barra);

  // El viejo cartel centrado (#hk-cad-status) queda escondido: su texto va aquí.
  const viejo = document.getElementById("hk-cad-status");
  if (viejo) viejo.style.display = "none";

  const pintar = () => {
    for (const { el, on } of botones) {
      const v = on();
      el.style.background = v ? "var(--hk-hueco, rgba(34,211,238,.18))" : "transparent";
      el.style.color = v ? "var(--hk-foco, #22d3ee)" : "var(--hk-suave, #64748b)";
      el.style.borderColor = v ? "var(--hk-foco, #22d3ee)" : "var(--hk-borde, #1e3a4a)";
    }
    const xyz = W.__hekatanCursorXYZ as number[] | undefined;
    if (xyz) {
      const f = (v: number) => (v < 0 ? "" : " ") + v.toFixed(2);
      coords.textContent = `X=${f(xyz[0])}  Y=${f(xyz[1])}  Z=${f(xyz[2])} m`;
    }
    const st = W.__hekatanCadState?.get?.();
    if (st) {
      const p = String(st.workPlane ?? "xy").toUpperCase();
      const z = Number(st.workZ ?? 0);
      plano.textContent = `Plano ${p}${Math.abs(z) > 1e-9 ? ` · Z=${z} m` : ""}`;
    }
    const t = String(W.__hekatanCadStatusText ?? "").split("   |   ")[0];
    if (t && msg.textContent !== t) msg.textContent = t;
  };
  pintar();
  setInterval(pintar, 250);
  W.__hekatanStatusBarRefresh = pintar;
  return barra;
}
