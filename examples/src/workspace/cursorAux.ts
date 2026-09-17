/**
 * Cursor auxiliar y SIMULADOR DE RATÓN.
 *
 * Dos cosas, y la segunda es la que importa:
 *
 * 1. Un puntero DIBUJADO encima de la página. El cursor del sistema no sale en
 *    las capturas ni en la automatización por DevTools, así que al enseñar la
 *    app —un LIVE, un tutorial, una comprobación con el navegador— no se ve
 *    dónde se está pulsando.
 *
 * 2. Un ratón de mentira que mueve ese puntero Y EMITE LOS EVENTOS DE VERDAD
 *    (`pointermove`, `pointerdown`, `pointerup`, `click`, `wheel`) sobre el
 *    elemento que toca. Sin esto no se podía dibujar de forma automática: mover
 *    el puntero pintado no dibuja nada, y mover el ratón del sistema desde fuera
 *    no siempre llega al canvas. Medido el 17-sep-2026 intentando trazar una
 *    cercha curva en el deploy público.
 *
 * Y sabe ir a un punto del MODELO, no solo a un píxel: `aPunto(x, y, z)`
 * proyecta con la cámara de ese momento. Es la diferencia entre «pincha en
 * (700, 400)» y «pincha en el arranque del cordón», que es lo que uno quiere
 * decir. Al dibujar, el visor reencuadra solo, así que la proyección se rehace
 * en cada paso: una calculada al principio se queda vieja enseguida.
 *
 * Se enciende con `?cursor=1` en la URL, o desde la consola:
 *     window.__hkCursorAux(true)         // encender
 *     window.__hkCursor(x, y)            // moverlo (píxeles)
 *     window.__hkClic(x, y)              // moverlo y marcar el clic
 *
 * El simulador vive en `window.__hkRaton`, y todo lo suyo devuelve promesa:
 *     await __hkRaton.mover(x, y)             // en píxeles, con recorrido visible
 *     await __hkRaton.aPunto(3, 0, 6.5)       // a un punto del modelo
 *     await __hkRaton.clic()                  // donde esté
 *     await __hkRaton.clic(x, y)              // moverse y pulsar
 *     await __hkRaton.clicEnPunto(3, 0, 6.5)  // moverse a un punto del modelo y pulsar
 *     await __hkRaton.dobleClic() / .clicDerecho()
 *     await __hkRaton.arrastrar(x1, y1, x2, y2)
 *     await __hkRaton.rueda(-3)               // negativo = acercar
 *     await __hkRaton.teclear("20,0,6.5", { enter: true })
 *     await __hkRaton.recorrido([[0,0,6.5], [10,0,9], [20,0,6.5]])   // clic en cada uno
 *     __hkRaton.donde()                       // dónde está y qué hay debajo
 *     __hkRaton.velocidad = 700               // px/s del recorrido (0 = instantáneo)
 */
const ID = "hk-cursor-aux";

function crear(): HTMLDivElement {
  const c = document.createElement("div");
  c.id = ID;
  c.style.cssText = [
    "position:fixed", "left:0", "top:0", "z-index:2147483647", "pointer-events:none",
    "width:34px", "height:34px", "margin:-17px 0 0 -17px",
  ].join(";");
  c.innerHTML =
    '<svg width="34" height="34" viewBox="0 0 34 34">' +
    '<circle cx="17" cy="17" r="15" fill="none" stroke="#ffb547" stroke-width="2" opacity=".9"/>' +
    '<circle cx="17" cy="17" r="3.5" fill="#ffb547"/>' +
    '<circle class="hk-halo" cx="17" cy="17" r="3" fill="none" stroke="#ffb547" stroke-width="2" opacity="0"/>' +
    "</svg>";
  document.body.appendChild(c);
  return c;
}

/** El rótulo que dice lo que el ratón está haciendo («clic», «arrastra»…). */
function crearRotulo(): HTMLDivElement {
  const r = document.createElement("div");
  r.id = "hk-cursor-rotulo";
  r.style.cssText = [
    "position:fixed", "left:0", "top:0", "z-index:2147483646", "pointer-events:none",
    "font:12px Consolas,monospace", "color:#0d1017", "background:#ffb547",
    "padding:2px 6px", "border-radius:3px", "white-space:nowrap", "opacity:0",
    "transition:opacity .15s",
  ].join(";");
  document.body.appendChild(r);
  return r;
}

/**
 * Esperar `ms`… también con la pestaña en segundo plano.
 *
 * ⚠️ Chrome y Edge CONGELAN los `setTimeout` de una pestaña que no se está
 * viendo. No los retrasan: los paran. Medido el 17-sep-2026 en el deploy
 * público — un `await setTimeout(100)` no volvía nunca, así que la promesa del
 * clic se quedaba colgada para siempre y el simulador parecía roto cuando lo
 * único que pasaba es que la pestaña estaba detrás. Y eso es justo lo normal
 * mientras se automatiza: uno no mira el navegador.
 *
 * Con la pestaña a la vista se espera de verdad (el recorrido se ve suave). Sin
 * ella se espera BLOQUEANDO el hilo, que no es bonito pero termina: el objetivo
 * en segundo plano es que la secuencia se complete, no que se vea.
 */
const espera = (ms: number) => {
  if (ms <= 0) return Promise.resolve();
  if (document.visibilityState === "visible") {
    return new Promise<void>((r) => setTimeout(r, ms));
  }
  const fin = performance.now() + Math.min(ms, 250);   // tope: no colgar el hilo
  while (performance.now() < fin) { /* espera activa, la pestaña está detrás */ }
  return Promise.resolve();
};

export function cursorAux(encender = true): void {
  const viejo = document.getElementById(ID);
  if (!encender) {
    viejo?.remove();
    document.getElementById("hk-cursor-rotulo")?.remove();
    return;
  }
  const c = (viejo as HTMLDivElement) ?? crear();
  const rot = (document.getElementById("hk-cursor-rotulo") as HTMLDivElement) ?? crearRotulo();

  // Dónde está el puntero. Se guarda aparte del `transform` porque leerlo de
  // vuelta del estilo y parsearlo es frágil (y ya falló una vez).
  let px = innerWidth / 2, py = innerHeight / 2;

  const mover = (x: number, y: number) => {
    px = x; py = y;
    c.style.transform = `translate(${x}px,${y}px)`;
    if (rot.style.opacity !== "0") { rot.style.left = `${x + 22}px`; rot.style.top = `${y - 10}px`; }
  };
  const decir = (txt: string, ms = 900) => {
    rot.textContent = txt;
    rot.style.left = `${px + 22}px`; rot.style.top = `${py - 10}px`;
    rot.style.opacity = "1";
    setTimeout(() => { rot.style.opacity = "0"; }, ms);
  };
  const halo = (x: number, y: number) => {
    mover(x, y);
    const h = c.querySelector(".hk-halo") as SVGCircleElement | null;
    if (!h) return;
    const t0 = performance.now();
    const paso = () => {
      const k = Math.min(1, (performance.now() - t0) / 480);
      h.setAttribute("r", String(3 + 14 * k));
      h.setAttribute("opacity", String(0.9 * (1 - k)));
      if (k < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };

  (window as any).__hkCursor = mover;
  (window as any).__hkClic = halo;
  addEventListener("mousemove", (e) => mover(e.clientX, e.clientY), true);
  addEventListener("mousedown", (e) => halo(e.clientX, e.clientY), true);
  mover(px, py);

  // ── El simulador ────────────────────────────────────────────────────────
  //
  // Los eventos van al elemento que hay DEBAJO del puntero (`elementFromPoint`),
  // no a uno fijo: así un clic en la cinta pulsa el botón y un clic en el lienzo
  // dibuja, con el mismo código. El propio puntero lleva `pointer-events:none`,
  // o se taparía a sí mismo.
  const debajo = (x: number, y: number): Element =>
    (document.elementFromPoint(x, y) as Element) ?? document.body;

  const ev = (tipo: string, x: number, y: number, extra: any = {}) => {
    const el = debajo(x, y);
    const base = {
      clientX: x, clientY: y, screenX: x, screenY: y,
      bubbles: true, cancelable: true, composed: true, view: window,
      ...extra,
    };
    const e = tipo === "wheel"
      ? new WheelEvent(tipo, base)
      : tipo.startsWith("pointer")
        ? new PointerEvent(tipo, { pointerId: 1, pointerType: "mouse", isPrimary: true, ...base })
        : new MouseEvent(tipo, base);
    el.dispatchEvent(e);
    return el;
  };

  /** El punto 3D del modelo, en píxeles de pantalla, con la cámara de AHORA. */
  const proyectar = (x: number, y: number, z: number): [number, number] | null => {
    const host = document.querySelector("#viewer") as any;
    const ctx = host?.__ctx;
    const cv = host?.querySelector("canvas") as HTMLCanvasElement | null;
    if (!ctx?.camera || !cv) return null;
    const V: any = Object.getPrototypeOf(ctx.camera.position).constructor;
    const v = new V(x, y, z).project(ctx.camera);
    const r = cv.getBoundingClientRect();
    return [(v.x * 0.5 + 0.5) * r.width + r.left, (-v.y * 0.5 + 0.5) * r.height + r.top];
  };

  let velocidad = 900;          // px/s; 0 = de un salto

  /** Movimiento visible, con suavizado a la entrada y a la salida. */
  const irA = async (x: number, y: number) => {
    const d = Math.hypot(x - px, y - py);
    // Con la pestaña detrás no hay nadie mirando y cada espera bloquea el hilo:
    // el recorrido se hace de un salto. Los eventos que importan (el
    // `pointermove` final, que es el que fija el punto bajo el cursor) se
    // emiten igual.
    const aLaVista = document.visibilityState === "visible";
    const pasos = velocidad > 0 && aLaVista ? Math.max(1, Math.round(d / 12)) : 1;
    const x0 = px, y0 = py;
    for (let i = 1; i <= pasos; i++) {
      const t = i / pasos;
      const s = t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);   // ease-in-out
      const cx = x0 + (x - x0) * s, cy = y0 + (y - y0) * s;
      mover(cx, cy);
      ev("pointermove", cx, cy);
      ev("mousemove", cx, cy);
      if (velocidad > 0 && aLaVista) await espera(Math.max(8, (d / pasos) / velocidad * 1000));
    }
    mover(x, y);
    ev("pointermove", x, y);
    ev("mousemove", x, y);
    await espera(40);            // que al visor le dé tiempo a recalcular el punto
  };

  // El píxel del último clic: es el origen de las medidas relativas de
  // `aMedida`. Se guarda en PÍXELES a propósito — el simulador no sabe ni tiene
  // por qué saber en qué coordenada del modelo cayó; eso lo dice la pantalla.
  let ultimoClic: [number, number] | null = null;

  const pulsar = async (boton = 0, veces = 1) => {
    ultimoClic = [px, py];
    for (let k = 1; k <= veces; k++) {
      const com = { button: boton, buttons: boton === 2 ? 2 : 1, detail: k };
      ev("pointerdown", px, py, com);
      ev("mousedown", px, py, com);
      halo(px, py);
      await espera(70);
      ev("pointerup", px, py, { ...com, buttons: 0 });
      ev("mouseup", px, py, { ...com, buttons: 0 });
      ev(boton === 2 ? "contextmenu" : "click", px, py, { ...com, buttons: 0 });
      if (veces > 1 && k < veces) await espera(90);
    }
    if (veces === 2) ev("dblclick", px, py, { button: boton, detail: 2 });
    await espera(120);
  };

  const raton: any = {
    get velocidad() { return velocidad; },
    set velocidad(v: number) { velocidad = Math.max(0, +v || 0); },

    async mover(x: number, y: number) { await irA(x, y); return [px, py]; },

    /** A un punto del MODELO. Devuelve null si no se puede proyectar. */
    async aPunto(x: number, y: number, z: number) {
      const p = proyectar(x, y, z);
      if (!p) return null;
      decir(`(${x}, ${y}, ${z})`);
      await irA(p[0], p[1]);
      return p;
    },

    async clic(x?: number, y?: number) {
      if (x !== undefined && y !== undefined) await irA(x, y);
      decir("clic");
      await pulsar(0, 1);
      return [px, py];
    },
    async dobleClic(x?: number, y?: number) {
      if (x !== undefined && y !== undefined) await irA(x, y);
      decir("doble clic");
      await pulsar(0, 2);
      return [px, py];
    },
    async clicDerecho(x?: number, y?: number) {
      if (x !== undefined && y !== undefined) await irA(x, y);
      decir("clic derecho");
      await pulsar(2, 1);
      return [px, py];
    },
    async clicEnPunto(x: number, y: number, z: number) {
      const p = await raton.aPunto(x, y, z);
      if (!p) return null;
      decir(`clic en (${x}, ${y}, ${z})`);
      await pulsar(0, 1);
      return p;
    },

    async arrastrar(x1: number, y1: number, x2: number, y2: number) {
      await irA(x1, y1);
      decir("arrastra");
      ev("pointerdown", px, py, { button: 0, buttons: 1 });
      ev("mousedown", px, py, { button: 0, buttons: 1 });
      halo(px, py);
      await espera(80);
      const d = Math.hypot(x2 - x1, y2 - y1);
      const aLaVista = document.visibilityState === "visible";
      // Con la pestaña detrás, el arrastre sigue necesitando pasos INTERMEDIOS
      // —un OrbitControls que solo ve el principio y el final no gira—, pero
      // pocos: cada espera bloquea el hilo.
      const pasos = velocidad > 0 && aLaVista ? Math.max(2, Math.round(d / 12)) : 6;
      for (let i = 1; i <= pasos; i++) {
        const t = i / pasos;
        const cx = x1 + (x2 - x1) * t, cy = y1 + (y2 - y1) * t;
        mover(cx, cy);
        ev("pointermove", cx, cy, { buttons: 1 });
        ev("mousemove", cx, cy, { buttons: 1 });
        if (velocidad > 0 && aLaVista) await espera(Math.max(8, (d / pasos) / velocidad * 1000));
      }
      ev("pointerup", px, py, { button: 0, buttons: 0 });
      ev("mouseup", px, py, { button: 0, buttons: 0 });
      await espera(120);
      return [px, py];
    },

    /** Rueda. Negativo = acercar, que es como va en el visor. */
    async rueda(muescas: number, x?: number, y?: number) {
      if (x !== undefined && y !== undefined) await irA(x, y);
      decir(muescas < 0 ? "acerca" : "aleja");
      const n = Math.max(1, Math.abs(Math.round(muescas)));
      for (let i = 0; i < n; i++) {
        ev("wheel", px, py, { deltaY: Math.sign(muescas) * 100, deltaMode: 0 });
        await espera(60);
      }
      await espera(120);
    },

    /** Teclea donde esté el foco, tecla a tecla (como una persona). */
    async teclear(txt: string, o: { enter?: boolean; ms?: number } = {}) {
      const el = (document.activeElement as HTMLInputElement) ?? null;
      decir(`teclea «${txt}»`, 1400);
      for (const ch of txt) {
        const com = { key: ch, bubbles: true, cancelable: true };
        (el ?? document.body).dispatchEvent(new KeyboardEvent("keydown", com));
        if (el && "value" in el) {
          el.value += ch;
          el.dispatchEvent(new InputEvent("input", { bubbles: true, data: ch }));
        }
        (el ?? document.body).dispatchEvent(new KeyboardEvent("keyup", com));
        await espera(o.ms ?? 28);
      }
      if (o.enter) {
        const com = { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true };
        (el ?? document.body).dispatchEvent(new KeyboardEvent("keydown", com));
        (el ?? document.body).dispatchEvent(new KeyboardEvent("keyup", com));
        await espera(200);
      }
    },

    /** Una serie de puntos del modelo, con clic en cada uno. */
    async recorrido(pts: Array<[number, number, number]>, o: { pausa?: number } = {}) {
      const hechos: Array<{ punto: number[]; px: number[] | null }> = [];
      for (const p of pts) {
        const q = await raton.clicEnPunto(p[0], p[1], p[2]);
        hechos.push({ punto: p, px: q });
        await espera(o.pausa ?? 220);
      }
      return hechos;
    },

    /**
     * Lo que la PANTALLA está diciendo ahora mismo: la cota viva, el ángulo y
     * la referencia enganchada. Es lo único que mira `aMedida`, igual que mira
     * una persona mientras dibuja.
     */
    lee() {
      const n = (s: string | null | undefined) => {
        const m = /(-?\d+(?:\.\d+)?)/.exec(s ?? "");
        return m ? parseFloat(m[1]) : null;
      };
      const cota = document.getElementById("hk-rubber-label") as HTMLInputElement | null;
      const ang = document.getElementById("hk-rubber-angle");
      const osn = document.getElementById("hk-osnap-etiqueta");
      const visible = (e: Element | null) =>
        !!e && getComputedStyle(e).display !== "none" && (e as HTMLElement).offsetParent !== null;
      return {
        distancia: visible(cota) ? n(cota!.value) : null,
        angulo: visible(ang) ? n(ang!.textContent) : null,
        referencia: visible(osn) ? (osn!.textContent ?? "").trim() : null,
      };
    },

    /**
     * Llevar el cursor hasta que la pantalla cante la MEDIDA pedida.
     *
     * Esto es dibujar con el ratón de verdad: no se le dan coordenadas, se le
     * da la cota y el ángulo —lo que pone el plano— y el cursor se mueve hasta
     * que los rótulos del programa dicen eso, exactamente como haría una
     * persona mirando la pantalla. La única coordenada de toda la cercha es la
     * del primer punto; de ahí en adelante todo es relativo.
     *
     * Se autocalibra: mide cuántos píxeles vale un metro y hacia dónde crece el
     * ángulo con dos tanteos, en vez de dar por supuesta una convención. Luego
     * corrige el radio por proporción y el ángulo por diferencia, y repite.
     */
    async aMedida(o: { dist: number; ang?: number; angGeom?: number;
                       tolD?: number; tolA?: number; pasos?: number }) {
      const tolD = o.tolD ?? 0.01, tolA = o.tolA ?? 0.15;
      const maxIter = o.pasos ?? 22;
      const O = ultimoClic ?? [px, py];
      const vAnt = velocidad; velocidad = 0;          // el tanteo, sin recorrido
      const poner = async (r: number, t: number) => {
        await irA(O[0] + r * Math.cos(t), O[1] + r * Math.sin(t));
        return raton.lee();
      };
      // 1. calibrar: dos tanteos a radios distintos → píxeles por metro
      let r = 120, t = 0;
      const a = await poner(r, t);
      const b = await poner(r * 2, t);
      if (a.distancia == null || b.distancia == null || b.distancia === a.distancia) {
        velocidad = vAnt;
        return { ok: false, msg: "la pantalla no está cantando la cota: ¿hay un punto de arranque?" };
      }
      const pxPorMetro = r / (b.distancia - a.distancia);
      // 2. calibrar el sentido del ángulo: girar un poco y ver qué hace el rótulo
      const c0 = await poner(r, t);
      const c1 = await poner(r, t + 0.20);
      let signo = 1;
      if (c0.angulo != null && c1.angulo != null) {
        let d = c1.angulo - c0.angulo;
        while (d > 180) d -= 360; while (d < -180) d += 360;
        signo = d >= 0 ? 1 : -1;
      }
      // 2 bis. ¿En qué convención canta el ángulo esta pantalla? No hace falta
      // saberlo: con el cursor puesto a la DERECHA del origen (t = 0) el rótulo
      // dice cuánto vale esa dirección, y eso fija el cero. Así se le puede
      // pedir un ángulo «respecto a la horizontal, positivo hacia arriba» —que
      // es como viene acotado un plano— sin conocer nada del programa ni una
      // sola coordenada. En píxeles la Y crece hacia ABAJO, de ahí el signo.
      let objAng = o.ang;
      if (objAng === undefined) {
        if (o.angGeom === undefined || c0.angulo == null) {
          velocidad = vAnt;
          return { ok: false, msg: "hace falta `ang` (crudo de pantalla) o `angGeom` (del plano)" };
        }
        objAng = c0.angulo + signo * (-o.angGeom);
        while (objAng > 360) objAng -= 360; while (objAng < 0) objAng += 360;
      }
      // 3. corregir hasta que los dos rótulos digan lo pedido
      const traza: Array<{ dist: number | null; ang: number | null }> = [];
      let leido = c0;
      for (let k = 0; k < maxIter; k++) {
        leido = await poner(r, t);
        traza.push({ dist: leido.distancia, ang: leido.angulo });
        if (leido.distancia == null) break;
        const eD = o.dist - leido.distancia;
        let eA = 0;
        if (leido.angulo != null) {
          eA = objAng - leido.angulo;
          while (eA > 180) eA -= 360; while (eA < -180) eA += 360;
        }
        if (Math.abs(eD) <= tolD && Math.abs(eA) <= tolA) {
          velocidad = vAnt;
          return { ok: true, iteraciones: k + 1, distancia: leido.distancia,
                   angulo: leido.angulo, referencia: leido.referencia,
                   px: [Math.round(px), Math.round(py)], pxPorMetro: +pxPorMetro.toFixed(2) };
        }
        r = Math.max(6, r + eD * pxPorMetro);
        t += signo * eA * Math.PI / 180;
      }
      velocidad = vAnt;
      return { ok: false, msg: "no llegué a la medida pedida", ultimo: leido, traza: traza.slice(-4) };
    },

    /**
     * Ídem, pero pulsando al llegar: un punto de la cercha dado por su cota y
     * su ángulo respecto al anterior, sin una sola coordenada.
     */
    async clicAMedida(o: { dist: number; ang?: number; angGeom?: number; tolD?: number; tolA?: number }) {
      const r = await raton.aMedida(o);
      if (!r.ok) return r;
      decir(`${o.dist} m  ${o.angGeom ?? o.ang}°`);
      await pulsar(0, 1);
      return r;
    },

    /** Dónde está y qué hay debajo: para comprobar antes de pulsar. */
    donde() {
      const el = debajo(px, py);
      const host = document.querySelector("#viewer") as any;
      const lee = [...document.querySelectorAll("span,div")]
        .filter((e) => e.children.length === 0 && /^X=/.test((e as HTMLElement).innerText ?? ""))
        .map((e) => (e as HTMLElement).innerText.trim())[0];
      return {
        px: [Math.round(px), Math.round(py)],
        encima: `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}`,
        texto: (el as HTMLElement).innerText?.slice(0, 40) ?? "",
        enElLienzo: !!host?.contains(el),
        coordenadaDelModelo: lee ?? null,
      };
    },
  };

  (window as any).__hkRaton = raton;
}

(window as any).__hkCursorAux = cursorAux;
if (new URLSearchParams(location.search).get("cursor") === "1") {
  if (document.body) cursorAux(true);
  else addEventListener("DOMContentLoaded", () => cursorAux(true));
}
