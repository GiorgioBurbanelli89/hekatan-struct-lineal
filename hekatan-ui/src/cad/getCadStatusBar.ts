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
  boton("OSNAP F3", "Referencias: origen, extremo, medio, nudo, centro de area, interseccion (F3)",
    () => W.__hekatanOsnapOn !== false, () => W.__hekatanToggleOsnap?.());

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
