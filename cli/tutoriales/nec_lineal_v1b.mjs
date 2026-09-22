/**
 * TUTORIAL NEC — SEGUNDA TOMA: capítulos C3 (espectro), C4 (estático) y C5 (dinámico).
 *
 * Por qué una toma aparte: en la primera, `a.abrir("⚡ Modal + Animación")` acabó
 * **CERRANDO la carpeta «🔬 Analyze»** del panel izquierdo (el motor decide si una
 * carpeta está plegada por `tp-fldv-cpl` y aquí se equivocó), y con Analyze cerrada no
 * existen ni el botón «▶ Correr modal + animar», ni las casillas del espectro y la tabla,
 * ni el selector «Modo». Se veía en el fotograma 250: el panel izquierdo solo tenía
 * Grid / Ver / Analysis Inputs / Analyze / Cortes, todo plegado.
 *
 * Aquí las carpetas se abren con código propio (`asegurarAbierta`), que pulsa SOLO si la
 * carpeta está plegada de verdad, y siempre con el cursor a la vista.
 *
 * C1 y C2 salen de la primera toma (`frames_tut_nec_lineal_v1`).
 */
export const titulo = "Análisis lineal NEC-15 · espectro, estático y dinámico";
export const ejemplo = "test-m-dual";

const subirPaneles = (a) => a.pag.evaluate(() => {
  const esp = document.querySelector(".hk-sp-hdr")?.parentElement;
  if (esp) { esp.style.bottom = "auto"; esp.style.top = "270px"; esp.style.left = "300px"; esp.style.zIndex = "9998"; }
  const mr = document.getElementById("modal-results");
  if (mr) { mr.style.bottom = "auto"; mr.style.top = "40px"; mr.style.left = "330px"; mr.style.maxHeight = "560px"; mr.style.zIndex = "9997"; }
  return { esp: !!esp, mr: !!mr };
});

const rectSel = (a, sel) => a.pag.evaluate((s) => {
  const e = document.querySelector(s);
  if (!e) return null;
  const b = e.getBoundingClientRect();
  if (b.width < 2 || b.height < 2) return null;
  return { x: b.left, y: Math.max(b.top, 2), w: Math.min(b.width, 700), h: Math.min(b.height, 240) };
}, sel);

/** Rectángulo de un mando VISIBLE, recolocando antes su contenedor. */
const filaRect = (a, etiqueta, que = "fila") => a.pag.evaluate((q) => {
  const colocar = (e) => {
    let p = e.parentElement;
    while (p && p !== document.body) {
      if (p.scrollHeight > p.clientHeight + 4) {
        const rp = p.getBoundingClientRect(), re = e.getBoundingClientRect();
        p.scrollTop += re.top - (rp.top + Math.min(rp.height, 520) * 0.35);
        break;
      }
      p = p.parentElement;
    }
  };
  let e = null;
  if (q.que === "boton") {
    e = [...document.querySelectorAll("button, .tp-btnv_b")].filter((x) =>
      (x.textContent || "").includes(q.t) && x.offsetParent !== null)[0];
  } else if (q.que === "casilla") {
    const f = [...document.querySelectorAll(".tp-lblv")].filter((x) =>
      ((x.querySelector(".tp-lblv_l") || {}).textContent || "").includes(q.t) && x.offsetParent !== null)[0];
    e = f && (f.querySelector(".tp-ckbv_w") || f.querySelector("input[type=checkbox]"));
    if (e && e.offsetParent === null) e = null;
  } else {
    e = [...document.querySelectorAll(".tp-lblv")].filter((x) =>
      ((x.querySelector(".tp-lblv_l") || {}).textContent || "").includes(q.t)
      && x.offsetParent !== null && x.getBoundingClientRect().width > 2)[0];
  }
  if (!e) return null;
  colocar(e);
  const b = e.getBoundingClientRect();
  if (b.width < 2 || b.height < 2 || b.top < 0 || b.bottom > 640) return null;
  return { x: b.left, y: b.top, w: Math.max(b.width, 18), h: Math.max(b.height, 18) };
}, { t: etiqueta, que });

/**
 * Abre una carpeta del panel SOLO si está plegada, y con el cursor. Devuelve el estado
 * antes y después, que se imprime en el log: así se ve si se abrió, si ya estaba, o si
 * el clic la cerró.
 */
const asegurarAbierta = async (a, titulo) => {
  for (let intento = 0; intento < 3; intento++) {
    const est = await a.pag.evaluate((t) => {
      const tit = [...document.querySelectorAll(".tp-fldv_t")]
        .filter((x) => x.offsetParent !== null && (x.textContent || "").includes(t))[0];
      if (!tit) return { hay: false };
      const f = tit.closest(".tp-fldv");
      const b = f.querySelector(":scope > .tp-fldv_b") || tit;
      const r = b.getBoundingClientRect();
      // ⚠️ NO mirar `tp-fldv-cpl`: en esta versión de Tweakpane esa clase está también en
      // las carpetas ABIERTAS (por eso `abrir()` del motor cerró «Analyze» en la 1.ª toma).
      // Lo que no miente es la ALTURA del contenedor de contenido.
      const cont = f.querySelector(":scope > .tp-fldv_c");
      const alto = cont ? cont.getBoundingClientRect().height : 0;
      return { hay: true, plegada: alto < 4, alto: Math.round(alto),
               r: { x: r.left, y: r.top, w: r.width, h: r.height },
               visible: r.top >= 0 && r.bottom <= 640 && r.width > 2 };
    }, titulo);
    if (!est.hay) { console.log("  x no existe la carpeta: " + titulo); return false; }
    if (!est.plegada) { console.log("  ✓ abierta: " + titulo + " (alto " + est.alto + ")"); return true; }
    if (!est.visible) { console.log("  x carpeta fuera de cuadro: " + titulo); return false; }
    console.log("  · plegada, se pulsa: " + titulo);
    await a.pulsarR(est.r, 900);
  }
  return false;
};

export const pasos = [
  // ──────────────────────────── C3 ────────────────────────────
  {
    rotulo: "C3 · Se enciende el espectro",
    hacer: async (a) => {
      await a.general();
      await asegurarAbierta(a, "Analyze");
      await asegurarAbierta(a, "Modal + Animación");
      await a.quieto(4, 300);
      for (const et of ["Mostrar espectro", "Tabla de modos"]) {
        const r = await filaRect(a, et, "casilla");
        if (r) await a.pulsarR(r, 2200);
        else console.log("  x casilla no visible: " + et);
      }
      await a.quieto(6, 300);
    },
  },
  {
    rotulo: "C3 · Y se corre el análisis: un solo botón",
    hacer: async (a) => {
      const rb = await filaRect(a, "Correr modal", "boton");
      if (rb) await a.pulsarR(rb, 1500);
      else { console.log("  x boton Correr modal no visible -> por dentro");
             await a.pag.evaluate(() => window.__hekatanRunModalAnimate?.()); }
      await a.general();
      await a.quieto(80, 900);
      console.log("  paneles subidos:", JSON.stringify(await subirPaneles(a)));
      await a.quieto(6, 300);
    },
  },
  {
    rotulo: "C3 · El espectro que dibuja la app es el de la NEC-15",
    hacer: async (a) => {
      await subirPaneles(a);
      const r = await rectSel(a, ".hk-spectrum-svg");
      await a.general();
      if (r) await a.marcarR(r, "Sa(T) elástico · meseta η·Z·Fa · sube hasta T0 · cae desde Tc con (Tc/T)^r");
      else console.log("  x no se ve el espectro");
      await a.quieto(14, 300);
    },
  },
  { rotulo: "C3 · T0 y Tc salen de Fa, Fd y Fs", hacer: async (a) => { await a.quieto(14, 300); } },
  { rotulo: "C3 · El periodo del edificio cae dentro de la meseta",
    hacer: async (a) => { await a.sinCuadro(); await a.general(); await a.quieto(13, 300); } },

  // ──────────────────────────── C4 ────────────────────────────
  {
    rotulo: "C4 · El cortante basal estático, en pantalla",
    hacer: async (a) => {
      await subirPaneles(a);
      const r = await rectSel(a, "#modal-results");
      if (r) await a.marcarR(r, "V = I·Sa(Ta)/(R·φP·φE)·W — NEC-SE-DS cap. 6.3.2, pág. 61");
      else console.log("  x no se ve el panel modal");
      await a.quieto(13, 300);
    },
  },
  { rotulo: "C4 · Primero el periodo aproximado Ta = Ct·h elevado a n", hacer: async (a) => { await a.quieto(13, 300); } },
  { rotulo: "C4 · Con Ta se entra al espectro y sale Sa", hacer: async (a) => { await a.quieto(12, 300); } },
  { rotulo: "C4 · El coeficiente Cs y el peso sísmico W", hacer: async (a) => { await a.quieto(12, 300); } },
  { rotulo: "C4 · Y el cortante: 32.07 toneladas fuerza",
    hacer: async (a) => { await a.sinCuadro(); await a.general(); await a.quieto(12, 300); } },

  // ──────────────────────────── C5 ────────────────────────────
  {
    rotulo: "C5 · El dinámico empieza por los modos",
    hacer: async (a) => {
      await subirPaneles(a);
      const r = await rectSel(a, "#modal-results table, #modal-results");
      if (r) await a.marcarR(r, "Modo 1 · 2 · 3 con su periodo, y las SEIS participaciones Ux Uy Uz Rx Ry Rz");
      await a.quieto(13, 300);
    },
  },
  {
    rotulo: "C5 · Modo 1, modo 2 y modo 3: se ven moverse",
    hacer: async (a) => {
      await a.sinCuadro(); await a.general();
      for (const n of [0, 1, 2]) {
        const r = await filaRect(a, "Modo");
        if (r) await a.marcarR(r, "");
        const txt = await a.pag.evaluate((n) => {
          const f = [...document.querySelectorAll(".tp-lblv")].find((e) =>
            (e.querySelector(".tp-lblv_l")?.textContent ?? "").trim() === "Modo");
          const s = f?.querySelector("select");
          if (!s || !s.options[n]) return null;
          s.selectedIndex = n; s.value = s.options[n].value;
          s.dispatchEvent(new Event("input", { bubbles: true }));
          s.dispatchEvent(new Event("change", { bubbles: true }));
          return s.options[n].textContent.trim();
        }, n);
        console.log("  modo -> " + txt);
        await a.sinCuadro();
        await a.quieto(9, 300);
      }
    },
  },
  {
    rotulo: "C5 · Las seis sumatorias y el 90 % que pide la norma",
    hacer: async (a) => {
      const r = await rectSel(a, "#modal-results");
      if (r) await a.marcarR(r, "ΣUx ΣUy ΣUz ΣRx ΣRy ΣRz · «al menos el 90 % de la masa» — cap. 6.2.2 e, pág. 58");
      await a.quieto(13, 300);
    },
  },
  { rotulo: "C5 · Cada modo aporta su cortante, y se combinan con CQC", hacer: async (a) => { await a.quieto(13, 300); } },
  { rotulo: "C5 · El control: el dinámico no puede bajar del 80 % del estático", hacer: async (a) => { await a.quieto(13, 300); } },
  { rotulo: "C5 · Lo que queda por hacer",
    hacer: async (a) => { await a.sinCuadro(); await a.general(); await a.quieto(12, 300); } },
];
