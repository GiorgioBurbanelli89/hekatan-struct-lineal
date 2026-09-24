/**
 * TUTORIAL — «Análisis lineal según la NEC-15: estático y dinámico, paso a paso».
 *
 * Jorge (18-sep-2026): «yo necesito ver CON EL CURSOR VIRTUAL cómo calcularlo,
 * porque no lo sé». Así que aquí NO se explica en una pizarra: se hacen los clics
 * de verdad sobre la app, uno a uno, sobre el modelo del artículo (Test M dual,
 * 2×2×4, 545 nudos) que es el mismo del sitio público `?t=test-m-dual`.
 *
 * Un paso = una frase de voz. Los pasos van agrupados en CAPÍTULOS (marcados con
 * «C1 ·», «C2 ·» … en el rótulo) y `_partir_capitulos.py` los corta en vídeos de
 * ≤ 90 s a partir de `pasos.json`.
 *
 * Capítulos:
 *   C1  qué es un análisis lineal y cuándo lo permite la norma
 *   C2  los datos de entrada de la NEC-15 (Z, suelo, región/η, R, I, φP, φE)
 *   C3  el espectro (T0, Tc, meseta, rama descendente)
 *   C4  el cortante basal ESTÁTICO
 *   C5  el DINÁMICO (modal espectral) y los controles de la norma
 *   (C6, el borrador 2023, se monta aparte: la app solo conoce NEC-15)
 */
export const titulo = "Análisis lineal NEC-15 · estático y dinámico en Hekatan Struct";
export const ejemplo = "test-m-dual";

/**
 * El grabador solo recoge los 640 px de ARRIBA (los 80 de abajo son la franja del
 * subtítulo). El panel del espectro nace en `bottom:10px` y el de modos flota: los dos
 * caerían fuera de cuadro. Aquí se suben — es mover una ventana, no falsear nada.
 */
const subirPaneles = (a) => a.pag.evaluate(() => {
  const esp = document.querySelector(".hk-sp-hdr")?.parentElement;
  if (esp) { esp.style.bottom = "auto"; esp.style.top = "300px"; esp.style.left = "300px"; esp.style.zIndex = "9998"; }
  const mr = document.getElementById("modal-results");
  if (mr) { mr.style.bottom = "auto"; mr.style.top = "60px"; mr.style.left = "330px"; mr.style.maxHeight = "520px"; mr.style.zIndex = "9997"; }
  return { esp: !!esp, mr: !!mr };
});

/** Rectángulo de un elemento del DOM, en CSS, tal como lo quiere `a.marcarR`. */
const rectSel = (a, sel) => a.pag.evaluate((s) => {
  const e = document.querySelector(s);
  if (!e) return null;
  const b = e.getBoundingClientRect();
  if (b.width < 2 || b.height < 2) return null;
  return { x: b.left, y: b.top, w: Math.min(b.width, 700), h: Math.min(b.height, 260) };
}, sel);


/**
 * El `rect()` del motor prefiere las filas del panel DERECHO (`#hk-pane-host`) y
 * devuelve null si algo cae por debajo de los 640 px que se graban. Los mandos del
 * modal viven en el panel IZQUIERDO (Settings ▸ ⚡ Modal + Animación) y con esa
 * búsqueda salían «no se ve». Aquí se localizan a mano, exigiendo que estén VISIBLES,
 * y se pulsan con `a.pulsarR` / `a.marcarR`, que sí llevan el cursor a la vista.
 */
const filaRect = (a, etiqueta, que = "fila") => a.pag.evaluate((q) => {
  // ⚠️ `abrir()` del motor desplaza SIEMPRE `#hk-pane-host` — que es el panel
  // IZQUIERDO — usando el rectángulo de la carpeta que abre, esté donde esté. Al abrir
  // «Sísmico NEC» (panel DERECHO, y ~800 px abajo) le mete un scrollTop de ~640 al panel
  // izquierdo: los mandos del modal se van por ARRIBA y todo sale «no se ve». Aquí se
  // vuelve a colocar el contenedor del propio elemento antes de medirlo.
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
  const vis = (e) => { const b = e.getBoundingClientRect();
    return e.offsetParent !== null && b.width > 2 && b.height > 2 && b.top >= 0 && b.bottom <= 640; };
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

/** Elige la opción n de un desplegable, con el cursor encima de su fila. */
const elegirModo = async (a, n) => {
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
  await a.sinCuadro();
  return txt;
};

export const pasos = [
  // ──────────────────────────── C1 ────────────────────────────
  {
    rotulo: "C1 · Portada",
    hacer: async (a) => { await a.portada("Análisis lineal según la NEC-15",
      "Estático y dinámico, clic a clic, en Hekatan Struct", 12); },
  },
  {
    rotulo: "C1 · El modelo con el que se trabaja",
    hacer: async (a) => { await a.general(); await a.quieto(12, 300); },
  },
  {
    rotulo: "C1 · Lineal quiere decir que la rigidez no cambia",
    hacer: async (a) => {
      await a.abrir("📊 Load Cases");
      await a.quieto(4, 300);
      const rt = await filaRect(a, "Type");
      if (rt) await a.marcarR(rt, "Linear Static y Modal - Eigen: la matriz de rigidez K es la misma antes y después de cargar.");
      else console.log("  x fila Type no visible");
      await a.quieto(10, 300);
    },
  },
  {
    rotulo: "C1 · La norma pide dos análisis: uno estático y uno dinámico",
    hacer: async (a) => {
      await a.sinCuadro(); await a.cerrar("📊 Load Cases");
      await a.general(); await a.quieto(11, 300);
    },
  },

  // ──────────────────────────── C2 ────────────────────────────
  {
    rotulo: "C2 · Aquí se meten los datos sísmicos",
    hacer: async (a) => {
      await a.abrir("Sísmico NEC");
      await a.quieto(6, 300);
    },
  },
  {
    rotulo: "C2 · Z, el factor de zona",
    hacer: async (a) => {
      await a.cerca("fila", "NEC Z (zona)");
      await a.marcar("fila", "NEC Z (zona)", "Z = 0.40 g · zona V · NEC-SE-DS cap. 3.1, Tabla 1, pág. 27");
      await a.quieto(10, 300);
    },
  },
  {
    rotulo: "C2 · Se escribe con el teclado, como lo haría cualquiera",
    hacer: async (a) => {
      await a.param("NEC Z (zona)", "necZ", 0.35, 6000);
      await a.quieto(5, 300);
      await a.param("NEC Z (zona)", "necZ", 0.40, 6000);
      await a.quieto(6, 300);
    },
  },
  {
    rotulo: "C2 · El tipo de suelo manda Fa, Fd y Fs",
    hacer: async (a) => {
      await a.cerca("fila", "NEC suelo");
      await a.marcar("fila", "NEC suelo", "Suelo E · Tablas 3, 4 y 5 (págs. 31-32): Fa = 1.0 · Fd = 1.6 · Fs = 1.9");
      await a.quieto(11, 300);
    },
  },
  {
    rotulo: "C2 · La región da η, la relación entre la meseta y el suelo firme",
    hacer: async (a) => {
      await a.sinCuadro();
      await a.cerca("fila", "NEC región");
      await a.marcar("fila", "NEC región", "Costa η = 1.80 · Sierra 2.48 · Oriente 2.60 — NEC-SE-DS cap. 3.3.1, pág. 34");
      await a.quieto(11, 300);
    },
  },
  {
    rotulo: "C2 · R reduce la fuerza porque la estructura se deforma sin romperse",
    hacer: async (a) => {
      await a.sinCuadro();
      await a.cerca("fila", "NEC R");
      await a.marcar("fila", "NEC R", "R = 8 · dual: pórticos especiales de H.A. con muros — Tabla 15, pág. 64");
      await a.quieto(11, 300);
    },
  },
  {
    rotulo: "C2 · I sube la fuerza en los edificios que no pueden fallar, y φP·φE castiga la irregularidad",
    hacer: async (a) => {
      await a.sinCuadro();
      await a.cerca("fila", "NEC I");
      await a.marcar("fila", "NEC I", "I = 1.0 (ocupación normal) · φP = φE = 1 si es regular — cap. 5.2, Tablas 13 y 14, págs. 50-52");
      await a.quieto(10, 300);
      await a.sinCuadro();
      await a.cerca("fila", "¿Irregular?");
      await a.marcar("fila", "¿Irregular?", "Sin marcar = estructura regular → el control del cortante dinámico será el 80 %");
      await a.quieto(8, 300);
    },
  },

  // ──────────────────────────── C3 ────────────────────────────
  {
    rotulo: "C3 · Se enciende el espectro",
    hacer: async (a) => {
      await a.sinCuadro(); await a.general();
      // deshacer el desplazamiento que dejó `abrir("Sísmico NEC")` en el panel izquierdo
      await a.pag.evaluate(() => { const h = document.getElementById("hk-pane-host"); if (h) h.scrollTop = 0; });
      await a.abrir("⚡ Modal + Animación");
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
      await a.quieto(80, 900);      // el modal tarda ~70 s: se graba mientras piensa
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
      await a.quieto(14, 300);
    },
  },
  {
    rotulo: "C3 · T0 y Tc salen de Fa, Fd y Fs",
    hacer: async (a) => { await a.quieto(14, 300); },
  },
  {
    rotulo: "C3 · El periodo del edificio cae dentro de la meseta",
    hacer: async (a) => { await a.sinCuadro(); await a.general(); await a.quieto(13, 300); },
  },

  // ──────────────────────────── C4 ────────────────────────────
  {
    rotulo: "C4 · El cortante basal estático, en pantalla",
    hacer: async (a) => {
      await subirPaneles(a);
      const r = await rectSel(a, "#modal-results");
      if (r) await a.marcarR(r, "V = I·Sa(Ta)/(R·φP·φE)·W — NEC-SE-DS cap. 6.3.2, pág. 61");
      await a.quieto(13, 300);
    },
  },
  {
    rotulo: "C4 · Primero el periodo aproximado Ta = Ct·h elevado a n",
    hacer: async (a) => { await a.quieto(13, 300); },
  },
  {
    rotulo: "C4 · Con Ta se entra al espectro y sale Sa",
    hacer: async (a) => { await a.quieto(12, 300); },
  },
  {
    rotulo: "C4 · El coeficiente Cs y el peso sísmico W",
    hacer: async (a) => { await a.quieto(12, 300); },
  },
  {
    rotulo: "C4 · Y el cortante: 32.07 toneladas fuerza",
    hacer: async (a) => { await a.sinCuadro(); await a.general(); await a.quieto(12, 300); },
  },

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
        console.log("  modo -> " + (await elegirModo(a, n)));
        await a.quieto(9, 300);
      }
    },
  },
  {
    rotulo: "C5 · Las seis sumatorias y el 90 % que pide la norma",
    hacer: async (a) => {
      await subirPaneles(a);
      const r = await rectSel(a, "#modal-results");
      if (r) await a.marcarR(r, "ΣUx ΣUy ΣUz ΣRx ΣRy ΣRz · «al menos el 90 % de la masa» — cap. 6.2.2 e, pág. 58");
      await a.quieto(13, 300);
    },
  },
  {
    rotulo: "C5 · Cada modo aporta su cortante, y se combinan con CQC",
    hacer: async (a) => { await a.quieto(13, 300); },
  },
  {
    rotulo: "C5 · El control: el dinámico no puede bajar del 80 % del estático",
    hacer: async (a) => { await a.quieto(13, 300); },
  },
  {
    rotulo: "C5 · Lo que queda por hacer",
    hacer: async (a) => { await a.sinCuadro(); await a.general(); await a.quieto(12, 300); },
  },
];
