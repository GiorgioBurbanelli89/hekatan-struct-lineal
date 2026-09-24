/**
 * tutorTest.ts — «🎓 Tutor del test»: explica un BANCO de validación como un profesor, dentro de
 * Hekatan Struct, con voz y con un cursor virtual que VA a lo que se explica.
 *
 * Jorge, 22-sep-2026: «un tutor dinámico que me muestre texto, valores e indicaciones» · «tienes que
 * señalar con un mouse virtual, si no, no se entiende» · «está estático, no se comprende» · «si dices
 * que una membrana de tanto por tanto, acótala» · «el cursor debe ser más dinámico».
 *
 * Un PASO es una ficha (título, figura del paper, texto con los números del modelo ABIERTO) y una
 * secuencia de TIEMPOS sincronizados con la voz. En cada tiempo:
 *   - se dice una frase (speechSynthesis del navegador: cualquier máquina, sin servidor ni clave);
 *   - el cursor VUELA en arco hasta lo que se nombra (nudos del modelo proyectados con la cámara, un
 *     control del panel por su rótulo, o un selector CSS), hace «clic» (onda) y, mientras se habla,
 *     rodea lo señalado; el aro lo encierra y un globo muestra el valor;
 *   - se dibujan COTAS entre nudos del modelo (línea con flechas y la medida);
 *   - opcionalmente se cambian parámetros y se resuelve (la malla cambia DELANTE del usuario).
 * «▶ Reproducir» encadena todos los pasos solo, como un vídeo.
 *
 * Se abre desde «📐 Diseño», con `window.__hekatanTutorTest()` o con `?tutor=1` en la URL.
 */
import * as THREE from "three";
import { registrarDiseno } from "./menuDiseno";

/** Qué señala el cursor: rótulo de control, selector CSS, «modelo», o nudos del modelo. */
export type Blanco = string | { nudos: number[] };
/** Cota entre dos nudos: [nudo a, nudo b, NOMBRE opcional («l =»), separación en px]. El VALOR lo mide el modelo. */
export type Cota = [number, number, (string | undefined)?, number?, TipoCota?];

export interface Tiempo {
  voz: string | (() => string);
  senalar?: Blanco | (() => Blanco | undefined);
  globo?: string | (() => string);
  cotas?: Cota[] | (() => Cota[]);
  /** Rótulos sobre el modelo: [nudos (se pone en su centro), texto] — p. ej. el número de cada elemento. */
  etiquetas?: Array<[number[], string]> | (() => Array<[number[], string]>);
  params?: Record<string, number>;
  /** Acción sobre la app ANTES de señalar (cambiar vista, resultado del visor, iterar un parámetro). */
  accion?: () => void | Promise<void>;
  /** Con `audio` en el paso: cuánto dura este tiempo (ms). La voz grabada manda; los tiempos la acompañan. */
  ms?: number;
}

export interface PasoTutor {
  titulo: string;
  /** HTML de la ficha. Se evalúa DESPUÉS de la acción: los números son los del modelo ya resuelto. */
  texto: () => string;
  fig?: string;
  params?: Record<string, number>;
  /** La secuencia hablada. Si falta, se usa `voz`/`senalar` como un único tiempo. */
  tiempos?: Tiempo[];
  voz?: () => string;
  senalar?: Blanco;
  /**
   * Voz GRABADA del paso (mp3, relativo a BASE_URL). Con ella no se sintetiza nada: suena el
   * fichero y los tiempos avanzan por su `ms`. El audio arranca con un clic del usuario
   * (política de reproducción automática de los navegadores): ▶ Reproducir, Siguiente o ↻.
   */
  audio?: string;
}

const w = () => window as any;
const BASE = (import.meta as any).env?.BASE_URL ?? "/";
const val = <T,>(x: T | (() => T)): T => (typeof x === "function" ? (x as () => T)() : x);
const espera = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

let pan: HTMLDivElement | null = null;
let i = 0, pasos: PasoTutor[] = [], nombre = "", hablar = true, auto = false, turno = 0;
let sonido: HTMLAudioElement | null = null;
const callar = () => { window.speechSynthesis?.cancel(); if (sonido) { sonido.pause(); sonido = null; } };

/** Reproduce el mp3 del paso. Devuelve la promesa de su final, o null si el navegador no lo deja sonar. */
async function sonar(url: string, mio: number): Promise<{ fin: Promise<void> } | null> {
  callar();
  const a = new Audio(BASE + url); sonido = a;
  const fin = new Promise<void>((ok) => { a.onended = () => ok(); a.onerror = () => ok(); });
  try { await a.play(); } catch { if (sonido === a) sonido = null; return null; }
  return mio === turno ? { fin } : null;
}

/** Número para la VOZ: coma decimal y sin ceros de cola, que es como lo lee bien una voz en español. */
export const numVoz = (x: number, d = 4) => (+x.toFixed(d)).toString().replace(".", ",");

/** Dice una frase y espera a que acabe. Sin voces (o en silencio) espera lo que tardaría leerla. */
function decir(t: string, mio: number): Promise<void> {
  const s = window.speechSynthesis;
  const leer = Math.max(1800, t.length * 62);
  if (!s || !hablar) return espera(leer);
  return new Promise((ok) => {
    s.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "es-ES"; u.rate = 1.02;
    const v = s.getVoices().find((x) => x.lang.startsWith("es"));
    if (v) u.voice = v;
    let hecho = false; const fin = () => { if (!hecho) { hecho = true; ok(); } };
    u.onend = fin; u.onerror = fin;
    setTimeout(fin, leer + 4000);           // por si el navegador nunca avisa del final
    if (mio === turno) s.speak(u); else fin();
  });
}

// ── Cursor virtual, aro, globo y capa de cotas ──
let cur: HTMLDivElement | null = null, aro: HTMLDivElement | null = null, glo: HTMLDivElement | null = null;
let capa: SVGSVGElement | null = null;
let px = 300, py = 300, raf = 0, rodeo: DOMRect | null = null;
const NS = "http://www.w3.org/2000/svg";
function montarCursor() {
  if (cur) return;
  cur = document.createElement("div");
  cur.innerHTML = `<svg width="34" height="34" viewBox="0 0 24 24"><path d="M3 2l7 19 2.5-7.5L20 11z" fill="#fff" stroke="#000" stroke-width="1.4"/></svg>`;
  cur.style.cssText = "position:fixed;z-index:9700;pointer-events:none;left:0;top:0;filter:drop-shadow(0 3px 4px #000c)";
  aro = document.createElement("div");
  aro.style.cssText = "position:fixed;z-index:9690;pointer-events:none;border:3px solid #22d3ee;border-radius:12px;" +
    "box-shadow:0 0 0 5px #22d3ee40;transition:all .7s ease;opacity:0";
  glo = document.createElement("div");
  glo.style.cssText = "position:fixed;z-index:9710;pointer-events:none;background:#111827;color:#cffafe;border:1px solid #22d3ee;" +
    "border-radius:8px;padding:5px 9px;font:600 14px system-ui;transition:left .7s ease,top .7s ease,opacity .3s;opacity:0;white-space:nowrap";
  capa = document.createElementNS(NS, "svg");
  capa.setAttribute("style", "position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:9680;pointer-events:none");
  capa.innerHTML = `<defs><marker id="hk-fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">` +
    `<path d="M0,0 L10,5 L0,10 z" fill="#22d3ee"/></marker></defs>`;
  document.body.append(capa, aro, cur, glo);
  const st = document.createElement("style"); st.id = "hk-tutor-st";
  st.textContent = "@keyframes hkOnda{from{transform:translate(-50%,-50%) scale(.2);opacity:.9}to{transform:translate(-50%,-50%) scale(2.4);opacity:0}}";
  document.head.appendChild(st);
  colocar(px, py);
  bucle();
}
function quitarCursor() {
  cancelAnimationFrame(raf); cur?.remove(); aro?.remove(); glo?.remove(); capa?.remove();
  document.getElementById("hk-tutor-st")?.remove(); cur = aro = glo = null; capa = null; rodeo = null;
}
function colocar(x: number, y: number) {
  x = Math.min(Math.max(x, 4), innerWidth - 30); y = Math.min(Math.max(y, 34), innerHeight - 30);
  px = x; py = y; if (cur) cur.style.transform = `translate(${x - 3}px,${y - 2}px)`; }

/** Vuelo en ARCO (curva de Bézier) con aceleración suave, y «clic» con onda al llegar. */
let vuelo: { x0: number; y0: number; x1: number; y1: number; t0: number; ms: number; ok: () => void } | null = null;
function volar(x1: number, y1: number): Promise<void> {
  const d = Math.hypot(x1 - px, y1 - py);
  const ms = Math.min(1300, 450 + d * 0.9);
  return new Promise((ok) => { vuelo = { x0: px, y0: py, x1, y1, t0: performance.now(), ms, ok }; });
}
function onda(x: number, y: number) {
  const o = document.createElement("div");
  o.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:46px;height:46px;border:3px solid #22d3ee;border-radius:50%;` +
    "z-index:9695;pointer-events:none;animation:hkOnda .7s ease-out forwards";
  document.body.appendChild(o); setTimeout(() => o.remove(), 750);
}
function bucle() {
  raf = requestAnimationFrame(bucle);
  const ahora = performance.now();
  if (vuelo) {
    const v = vuelo, t = Math.min(1, (ahora - v.t0) / v.ms);
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;          // ease in-out
    // punto de control desplazado a un lado: el cursor describe un arco, no una recta
    const mx = (v.x0 + v.x1) / 2, my = (v.y0 + v.y1) / 2, L = Math.hypot(v.x1 - v.x0, v.y1 - v.y0) || 1;
    const cx = mx - (v.y1 - v.y0) * 0.12, cy = my + (v.x1 - v.x0) * 0.12;
    const u = 1 - e;
    colocar(u * u * v.x0 + 2 * u * e * cx + e * e * v.x1, u * u * v.y0 + 2 * u * e * cy + e * e * v.y1);
    if (t >= 1) { vuelo = null; onda(v.x1, v.y1); v.ok(); }
    return;
  }
  // mientras se explica, el cursor RODEA lo señalado (una elipse lenta dentro del aro)
  if (rodeo) {
    const a = ahora / 900, rx = Math.max(8, rodeo.width * 0.3), ry = Math.max(6, rodeo.height * 0.3);
    colocar(rodeo.left + rodeo.width / 2 + rx * Math.cos(a), rodeo.top + rodeo.height / 2 + ry * Math.sin(a));
  }
}

/** Proyecta un nudo del modelo a pantalla. */
function aPantalla(id: number): [number, number] | null {
  const ctx = w().__hekatanViewerCtx?.(), N = w().__hekatanStates?.nodes?.val;
  const n = N?.[id]; if (!ctx || !n) return null;
  const c = ctx.rendererElm.getBoundingClientRect();
  const v = new THREE.Vector3(n[0], n[1], n[2]).project(ctx.camera);
  return [c.left + (v.x + 1) / 2 * c.width, c.top + (1 - v.y) / 2 * c.height];
}
function rectNudos(ids: number[]): DOMRect | null {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const id of ids) { const p = aPantalla(id); if (!p) continue;
    x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
  if (x0 > x1) return null;
  const m = 4; return new DOMRect(x0 - m, y0 - m, x1 - x0 + 2 * m, y1 - y0 + 2 * m);
}
function rectControl(q: string): DOMRect | null {
  if (q === "modelo") {
    const c = w().__hekatanViewerCtx?.()?.rendererElm?.getBoundingClientRect(); if (!c) return null;
    return new DOMRect(c.left + c.width * 0.4, c.top + c.height * 0.4, c.width * 0.2, c.height * 0.2);
  }
  if (/^[#.[]/.test(q)) return document.querySelector(q)?.getBoundingClientRect() ?? null;
  const t = q.trim().toLowerCase(); let mejor: HTMLElement | null = null, area = 1e12;
  for (const e of document.querySelectorAll<HTMLElement>("body *")) {
    if (pan?.contains(e) || e.children.length > 2) continue;
    if ((e.textContent || "").trim().toLowerCase() !== t) continue;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
    if (r.width * r.height < area) { mejor = e; area = r.width * r.height; }
  }
  if (!mejor) return null;
  const fila = (mejor.closest(".tp-lblv, .tp-rotv, tr, li") as HTMLElement) || mejor;
  fila.scrollIntoView({ block: "center" });
  return fila.getBoundingClientRect();
}

/**
 * Mide de verdad entre dos nudos del modelo ABIERTO. La cota que se dibuja no puede salir del
 * parámetro que el guion creía (si la malla está distorsionada, ese número miente): sale de
 * `states.nodes`, que es la geometría que el solver tiene delante.
 */
export function medirNudos(a: number, b: number, tipo: TipoCota = "alineada"): number | null {
  const N = w().__hekatanStates?.nodes?.val;
  const p = N?.[a], q = N?.[b];
  if (!p || !q) return null;
  const d = [q[0] - p[0], q[1] - p[1], q[2] - p[2]];
  // Como en AutoCAD: DIMALIGNED mide la distancia verdadera; DIMLINEAR mide la PROYECCIÓN
  // (horizontal = en planta, vertical = el desnivel).
  if (tipo === "vertical") return Math.abs(d[2]);
  if (tipo === "horizontal") return Math.hypot(d[0], d[1]);
  return Math.hypot(d[0], d[1], d[2]);
}

/** Número de la cota: medida real, con los decimales justos (48, 12.5, 0.375). */
const medida = (d: number) => (+d.toFixed(DIMSTYLE.DIMDEC + (Math.abs(d) < 10 ? 1 : 0))).toString();

/**
 * Texto de una cota. El rótulo que trae el guion solo aporta el NOMBRE («l =», «h =»);
 * el valor es siempre el medido. Si el guion traía un número y no coincide, se avisa por
 * consola (lo recoge la caja negra) en vez de dibujar una cota falsa.
 */
function textoCota(a: number, b: number, dado?: string, tipo: TipoCota = "alineada"): string {
  const d = medirNudos(a, b, tipo);
  if (d === null) return dado ?? "";
  const nombre = dado && dado.includes("=") ? dado.split("=")[0].trim() + " = " : "";
  const suelto = dado && !dado.includes("=") ? dado.trim() : dado?.split("=")[1]?.trim();
  const n = suelto === undefined ? NaN : parseFloat(suelto.replace(",", "."));
  if (Number.isFinite(n) && Math.abs(n - d) > Math.max(5e-3, 0.005 * Math.abs(d)))
    console.warn(`[tutor] cota ${a}-${b}: el guion decía ${suelto} y el modelo mide ${medida(d)}; se dibuja la del modelo`);
  return nombre + medida(d);
}

/**
 * Estilo de acotación, con los NOMBRES y los valores por defecto de AutoCAD (estilo ISO-25 de
 * `acadiso.dwt`, leídos de un DXF real y del lector DWG `acadrust`; ver
 * registros/2026-09-22_cotas_autocad.md). Aquí van en píxeles de pantalla, no en unidades de
 * dibujo, porque la cota se pinta encima del lienzo 3D.
 *
 *   DIMEXO  hueco entre el punto acotado y el arranque de la línea de extensión
 *   DIMEXE  cuánto sobresale la extensión por encima de la línea de cota
 *   DIMASZ  tamaño de la flecha
 *   DIMTXT  altura del texto
 *   DIMGAP  hueco entre la línea de cota y el texto
 *   DIMTAD  1 = el texto va ENCIMA de la línea (ISO); 0 = partiéndola
 *   DIMTIH  0 = el texto va alineado con la cota, no horizontal
 *   DIMDEC  decimales de la medida
 */
export const DIMSTYLE = { DIMEXO: 5, DIMEXE: 6, DIMASZ: 9, DIMTXT: 14, DIMGAP: 4, DIMTAD: 1, DIMTIH: 0, DIMDEC: 2 };

/** Tipos de cota, como las órdenes de AutoCAD (DIMLINEAR, DIMALIGNED, DIMANGULAR, DIMRADIUS). */
export type TipoCota = "alineada" | "horizontal" | "vertical";

/** Dibuja una cota al estilo AutoCAD: extensiones con hueco y remate, línea con flechas y el texto encima. */
function unaCota(p: number[], q: number[], texto: string, nx: number, ny: number, sep: number) {
  const S = DIMSTYLE;
  const A = [p[0] + nx * sep, p[1] + ny * sep], B = [q[0] + nx * sep, q[1] + ny * sep];
  // extensión: arranca a DIMEXO del punto y termina DIMEXE más allá de la línea de cota
  const ext = (o: number[], f: number[]) =>
    `<line x1="${o[0] + nx * S.DIMEXO}" y1="${o[1] + ny * S.DIMEXO}" x2="${f[0] + nx * S.DIMEXE}" y2="${f[1] + ny * S.DIMEXE}" stroke="#22d3ee" stroke-width="1"/>`;
  // texto ENCIMA de la línea (DIMTAD 1) y girado con ella (DIMTIH 0), nunca cabeza abajo
  let ang = (Math.atan2(B[1] - A[1], B[0] - A[0]) * 180) / Math.PI;
  if (ang > 90 || ang < -90) ang += 180;
  const cx = (A[0] + B[0]) / 2 + nx * (S.DIMGAP + S.DIMTXT * 0.35);
  const cy = (A[1] + B[1]) / 2 + ny * (S.DIMGAP + S.DIMTXT * 0.35);
  return ext(p, A) + ext(q, B) +
    `<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="#22d3ee" stroke-width="1.6" marker-start="url(#hk-fl)" marker-end="url(#hk-fl)"/>` +
    `<text x="${cx}" y="${cy}" transform="rotate(${ang.toFixed(1)} ${cx} ${cy})" fill="#cffafe" font-family="system-ui" ` +
    `font-weight="700" font-size="${S.DIMTXT}" text-anchor="middle" paint-order="stroke" stroke="#0b1020" stroke-width="4">${texto}</text>`;
}

/** Dibuja cotas entre nudos: línea con flechas, líneas de referencia y la medida, separadas hacia fuera. */
function dibujarCotas(lista?: Cota[]) {
  if (!capa) return;
  capa.querySelectorAll("g").forEach((g) => g.remove());
  // centro del modelo EN PANTALLA: la cota se separa siempre hacia el lado contrario (afuera)
  const N = w().__hekatanStates?.nodes?.val ?? [];
  let sx = 0, sy = 0, sn = 0;
  for (let k = 0; k < N.length; k++) { const q = aPantalla(k); if (q) { sx += q[0]; sy += q[1]; sn++; } }
  const mx = sx / (sn || 1), my = sy / (sn || 1);
  for (const [a, b, dado, sepIn = 36, tipo = "alineada"] of lista ?? []) {
    const p = aPantalla(a), q = aPantalla(b); if (!p || !q) continue;
    const texto = textoCota(a, b, dado, tipo);
    const sep = Math.abs(sepIn);
    // DIMLINEAR mide la proyección sobre el eje; DIMALIGNED, la distancia verdadera. Al dibujar,
    // la horizontal lleva la línea de cota horizontal y la vertical, vertical.
    const P = tipo === "horizontal" ? [p[0], Math.max(p[1], q[1])] : tipo === "vertical" ? [Math.max(p[0], q[0]), p[1]] : p;
    const Q = tipo === "horizontal" ? [q[0], Math.max(p[1], q[1])] : tipo === "vertical" ? [Math.max(p[0], q[0]), q[1]] : q;
    const L = Math.hypot(Q[0] - P[0], Q[1] - P[1]) || 1;
    let nx = -(Q[1] - P[1]) / L, ny = (Q[0] - P[0]) / L;
    if (nx * ((P[0] + Q[0]) / 2 - mx) + ny * ((P[1] + Q[1]) / 2 - my) < 0) { nx = -nx; ny = -ny; }
    const g = document.createElementNS(NS, "g");
    g.innerHTML = unaCota(P, Q, texto, nx, ny, sep);
    g.style.opacity = "0"; g.style.transition = "opacity .5s";
    capa.appendChild(g); requestAnimationFrame(() => (g.style.opacity = "1"));
  }
}

/** Rótulos en el centro de grupos de nudos (número de elemento, nombre de un borde…). */
function dibujarEtiquetas(lista?: Array<[number[], string]>) {
  if (!capa) return;
  for (const [ids, texto] of lista ?? []) {
    const r = rectNudos(ids); if (!r) continue;
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const g = document.createElementNS(NS, "g");
    g.innerHTML = `<circle cx="${x}" cy="${y}" r="13" fill="#1e3a8a" stroke="#93c5fd" stroke-width="1.5"/>` +
      `<text x="${x}" y="${y + 5}" fill="#fff" font-family="system-ui" font-weight="700" font-size="13" text-anchor="middle">${texto}</text>`;
    g.style.opacity = "0"; g.style.transition = "opacity .5s";
    capa.appendChild(g); requestAnimationFrame(() => (g.style.opacity = "1"));
  }
}

async function senalar(b: Blanco | undefined, globo?: string) {
  montarCursor();
  // Un control del panel de PARÁMETROS con el panel recogido: el cursor va al botón ⟨, lo pulsa
  // y el panel entra. Sin esto el rótulo existe pero está fuera de la pantalla (Jorge: «no se ven
  // los materiales»).
  if (typeof b === "string" && b !== "modelo" && !/^[#.[]/.test(b) && document.body.classList.contains("hk-pane-oculto")) {
    const t = document.getElementById("hk-pane-toggle");
    if (t) { const r = t.getBoundingClientRect(); aro!.style.opacity = "0"; glo!.style.opacity = "0";
      await volar(r.left + r.width / 2, r.top + r.height / 2); t.click(); panelLoAbriTutor = true; anchoVista(true); await espera(700); }
  } else if (panelLoAbriTutor && (b === undefined || typeof b !== "string" || b === "modelo" || b.startsWith("[data-cuerpo]"))) {
    pulsarPanel(); panelLoAbriTutor = false; anchoVista(false); await espera(700);   // de vuelta al modelo: el panel se recoge otra vez
  }
  const r = b === undefined ? null : typeof b === "string" ? rectControl(b) : rectNudos(b.nudos);
  rodeo = null;
  // señalando un control del PANEL (que tapa parte del lienzo): las cotas del modelo se apagan
  const enPanel = typeof b === "string" && b !== "modelo" && !b.startsWith("[data-cuerpo]");
  if (capa) { capa.style.transition = "opacity .3s"; capa.style.opacity = enPanel ? "0" : "1"; }
  if (!r) {
    aro!.style.opacity = "0"; glo!.style.opacity = "0";
    if (pan) { const p = pan.getBoundingClientRect(); await volar(p.right - 50, p.bottom - 70); }
    return;
  }
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  capa!.querySelectorAll("[data-punto]").forEach((e) => e.remove());
  if (b !== undefined && typeof b !== "string") {
    // en el MODELO no va rectángulo (tapa la gráfica): se marcan los nudos con un punto que late
    aro!.style.opacity = "0";
    for (const id of b.nudos) { const q = aPantalla(id); if (!q) continue;
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("data-punto", "1"); c.setAttribute("cx", `${q[0]}`); c.setAttribute("cy", `${q[1]}`); c.setAttribute("r", "7");
      c.setAttribute("fill", "#22d3ee"); c.setAttribute("stroke", "#000"); c.setAttribute("stroke-width", "1.5");
      c.innerHTML = `<animate attributeName="r" values="5;10;5" dur="1.2s" repeatCount="indefinite"/>`;
      capa!.appendChild(c); }
  } else Object.assign(aro!.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px", opacity: "1" });
  if (globo) {
    glo!.textContent = globo;
    // el globo no pasa del borde derecho del MODELO (ahí está la barra de colores): si no cabe, va a la izquierda
    const borde = (w().__hekatanViewerCtx?.()?.rendererElm?.getBoundingClientRect()?.right ?? innerWidth) - 10;
    const ancho = glo!.offsetWidth || 260;
    const x = cx + 30 + ancho > borde ? cx - 30 - ancho : cx + 30;
    Object.assign(glo!.style, { left: Math.max(x, 8) + "px", top: Math.max(r.top - 40, 40) + "px", opacity: "1" });
  } else glo!.style.opacity = "0";
  await volar(cx, cy);
  rodeo = typeof b === "string" ? r : new DOMRect(cx - 20, cy - 14, 40, 28);
}

async function ponerParams(p?: Record<string, number>) {
  if (!p || !w().__hekatanParams || !w().__hekatanRebuild) return;
  Object.assign(w().__hekatanParams(), p);
  w().__hekatanRebuild();
  await espera(500);
  // El rebuild reencuadra en isométrica: hay que volver a mirar el plano de frente, o las cotas
  // salen escorzadas y no se pueden comprobar contra el paper.
  encuadrar();
  await espera(250);
}

function pintarFicha() {
  if (!pan) return;
  const p = pasos[i];
  const cuerpo = pan.querySelector<HTMLDivElement>("[data-cuerpo]")!;
  cuerpo.innerHTML =
    `<div style="color:#94a3b8;font-size:12px;margin-bottom:2px">${nombre.replace(/^Tutor · /, "")}</div>` +
    `<div style="font-weight:700;color:#7dd3fc;margin-bottom:6px">${i + 1}/${pasos.length} · ${p.titulo}</div>` +
    (p.fig ? `<img src="${BASE}img/itw/${p.fig}" style="width:100%;max-height:44vh;object-fit:contain;background:#fff;border-radius:6px;margin:6px 0 12px">` : "") +
    `<div style="line-height:1.5">${p.texto()}</div>`;
  pan.querySelector<HTMLButtonElement>("[data-ant]")!.disabled = i === 0;
  pan.querySelector<HTMLButtonElement>("[data-sig]")!.disabled = i === pasos.length - 1;
  pan.querySelector<HTMLDivElement>("[data-barra]")!.style.width = `${((i + 1) / pasos.length) * 100}%`;
}

/** Muestra el paso i y recorre sus tiempos. Un turno nuevo (otro clic) corta el anterior. */
async function mostrar() {
  if (!pan) return;
  const mio = ++turno;
  callar();
  const p = pasos[i];
  await ponerParams(p.params);
  if (mio !== turno) return;
  pintarFicha();
  await pan?.querySelector<HTMLImageElement>("[data-cuerpo] img")?.decode().catch(() => {});
  dibujarCotas([]);
  const tiempos: Tiempo[] = p.tiempos ?? [{ voz: p.voz ?? (() => pan!.querySelector<HTMLElement>("[data-cuerpo]")!.innerText), senalar: p.senalar }];
  // Voz grabada: suena el mp3 y los tiempos avanzan por su duración. Si el navegador no deja
  // sonar (todavía sin clic) se sigue por tiempos y la ficha avisa.
  const grabada = p.audio && hablar ? await sonar(p.audio, mio) : null;
  if (p.audio && hablar && !grabada && pan) {
    const av = document.createElement("div");
    av.style.cssText = "margin-top:10px;color:#fca5a5;font-size:13px";
    av.textContent = "Pulsa ▶ Reproducir o ↻ para oír la voz (el navegador pide un clic).";
    pan.querySelector("[data-cuerpo]")?.appendChild(av);
    // Sin voz no se avanza solo: el tutor espera en este paso a que el usuario pulse ▶ (un clic).
    if (auto) { auto = false; botonAuto(); return; }
  }
  for (const t of tiempos) {
    if (mio !== turno || !pan) return;
    if (t.params) await ponerParams(t.params);
    if (t.accion) { await t.accion(); await espera(300); }
    if (t.params || t.accion) pintarFicha();
    if (t.cotas || t.etiquetas) { dibujarCotas(t.cotas ? val(t.cotas) : []); dibujarEtiquetas(t.etiquetas ? val(t.etiquetas) : []); }
    const voz = p.audio ? espera(t.ms ?? 2500) : decir(val(t.voz), mio);   // habla MIENTRAS el cursor vuela
    await senalar(t.senalar === undefined ? undefined : val(t.senalar as any), t.globo === undefined ? undefined : val(t.globo));
    await voz;
    await espera(250);
  }
  if (grabada && mio === turno) await grabada.fin;
  if (auto && mio === turno && i < pasos.length - 1) { await espera(500); if (mio === turno) { i++; mostrar(); } }
  else if (auto && i === pasos.length - 1) { auto = false; botonAuto(); }
}

function botonAuto() {
  const b = pan?.querySelector<HTMLButtonElement>("[data-auto]"); if (b) b.textContent = auto ? "⏸ Pausa" : "▶ Reproducir";
}

// ── Pantalla PARTIDA: el tutor a la izquierda (paper legible), el modelo a la derecha ──
// Jorge: «muestra de mayor tamaño el paper, no se entiende; que se divida la ventana».
const ANCHO = "min(44vw, 720px)";
let vistaAntes: string | null = null;
let panelLoAbriTutor = false, panelAntes = false;
const panelOculto = () => document.body.classList.contains("hk-pane-oculto");
const pulsarPanel = () => document.getElementById("hk-pane-toggle")?.click();

/**
 * Si el modelo es PLANO (una membrana, una placa, un pórtico), mira de frente a su plano.
 * Jorge: «explicar en 2D, el 3D solo de referencia». En isométrica una cota de 48 se dibuja
 * escorzada y el que mira no puede comprobarla contra el paper; de frente, sí.
 * El plano se saca de la caja del modelo: la dirección en la que no tiene espesor es la normal.
 */
function vistaPlana() {
  const ctx = w().__hekatanViewerCtx?.(); const N = w().__hekatanStates?.nodes?.val;
  if (!ctx || !N?.length) return;
  const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (const p of N) for (let k = 0; k < 3; k++) { if (p[k] < mn[k]) mn[k] = p[k]; if (p[k] > mx[k]) mx[k] = p[k]; }
  const d = [mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]];
  const may = Math.max(...d);
  const n = d.indexOf(Math.min(...d));                       // la dirección más delgada
  if (d[n] > 0.02 * may) return;                             // no es plano: se deja la isométrica
  const c = ctx.camera, t = ctx.controls.target;
  t.set((mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, (mn[2] + mx[2]) / 2);
  const r = Math.hypot(...d) * 1.6 + 1;
  c.position.set(t.x + (n === 0 ? r : 0), t.y + (n === 1 ? r : 0), t.z + (n === 2 ? r : 0));
  c.up.set(n === 2 ? 0 : 0, n === 2 ? 1 : 0, n === 2 ? 0 : 1);   // arriba = Z, salvo si se mira desde Z
  c.lookAt(t); c.updateProjectionMatrix(); ctx.controls.update?.(); ctx.render();
}

/** Reencuadra el modelo en SU franja y lo aleja un poco: las cotas van por fuera y necesitan sitio. */
function encuadrar() {
  w().__hekatanAutoFit?.();
  setTimeout(() => {
    vistaPlana();                                    // después del autoFit, que mueve la cámara él también
    const ctx = w().__hekatanViewerCtx?.(); if (!ctx) return;
    const t = ctx.controls.target, c = ctx.camera;
    if (c.isOrthographicCamera) c.zoom /= 1.3;
    else c.position.sub(t).multiplyScalar(1.3).add(t);
    c.updateProjectionMatrix(); ctx.controls.update?.(); ctx.render();
  }, 120);
}

/** Ancho de la franja del modelo: con el panel de parámetros abierto se le quita su ancho, para que no lo tape. */
function anchoVista(conPanel: boolean) {
  const v = w().__hekatanViewerElm?.() as HTMLElement | undefined; if (!v || vistaAntes === null) return;
  const pane = document.getElementById("hk-pane-toggle")?.previousElementSibling as HTMLElement | null;
  const derecha = conPanel ? 450 : 130;      // panel (≈320) + barra de colores (≈130)
  v.style.width = `calc(100% - ${ANCHO} - ${derecha}px)`;
  setTimeout(() => { window.dispatchEvent(new Event("resize")); encuadrar(); }, 300);
  void pane;
}

function partir(si: boolean) {
  const v = w().__hekatanViewerElm?.() as HTMLElement | undefined; if (!v) return;
  if (si) {
    if (vistaAntes === null) { vistaAntes = v.style.cssText; panelAntes = panelOculto(); }
    if (!panelOculto()) pulsarPanel();                 // el panel de la derecha se recoge
    document.body.classList.add("hk-tutor");
    // franja del modelo: entre el tutor y la barra de colores (que queda en su propia franja a la derecha)
    v.style.marginLeft = ANCHO; v.style.width = `calc(100% - ${ANCHO} - 130px)`;
  } else if (vistaAntes !== null) {
    v.style.cssText = vistaAntes; vistaAntes = null;
    document.body.classList.remove("hk-tutor");
    if (panelOculto() !== panelAntes) pulsarPanel();
  }
  setTimeout(() => { window.dispatchEvent(new Event("resize")); encuadrar(); }, 400);
  setTimeout(encuadrar, 1100);
}

export function abrirTutorTest(titulo: string, lista: PasoTutor[], reproducir = false) {
  pasos = lista; nombre = titulo; i = 0; auto = reproducir;
  // Los tests comparan FLECHAS: el colormap pasa a desplazamiento Z (von Mises es una tensión, no la flecha)
  try { const st = w().__hekatanSettings?.(); if (st?.shellResults) st.shellResults.val = "displacementZ"; } catch { /* nada */ }
  pan?.remove();
  pan = document.createElement("div");
  pan.style.cssText = `position:fixed;top:32px;left:0;width:${ANCHO};bottom:92px;overflow-y:auto;overflow-x:hidden;z-index:9500;` +
    "background:#0f172a;color:#e2e8f0;border-right:2px solid #334155;font:16px system-ui;box-shadow:6px 0 20px #0008";
  pan.innerHTML =
    `<div style="padding:8px 10px;background:#1e3a8a;border-radius:10px 10px 0 0;display:flex;gap:8px;align-items:center;cursor:move">` +
    `<b style="flex:1">🎓 Tutor</b>` +
    `<button data-voz title="Voz sí / no" style="background:none;border:0;color:#fff;cursor:pointer">🔊</button>` +
    `<button data-x title="Cerrar" style="background:none;border:0;color:#fff;cursor:pointer">✕</button></div>` +
    `<div style="height:3px;background:#1e293b"><div data-barra style="height:3px;background:#22d3ee;width:0;transition:width .5s"></div></div>` +
    `<div data-cuerpo style="padding:12px 18px;line-height:1.55"></div>` +
    `<div style="display:flex;gap:8px;padding:10px 18px 16px;position:sticky;bottom:0;background:#0f172a;font-size:16px">` +
    `<button data-ant style="padding:6px 10px">◀</button>` +
    `<button data-auto style="flex:1;padding:6px;background:#16a34a;color:#fff;border:0;border-radius:4px;font-weight:600">▶ Reproducir</button>` +
    `<button data-rep style="padding:6px 10px" title="Repetir este paso">↻</button>` +
    `<button data-sig style="flex:1;padding:6px;background:#2563eb;color:#fff;border:0;border-radius:4px">Siguiente ▶</button></div>`;
  document.body.appendChild(pan);
  partir(true);
  botonAuto();
  const q = (s: string) => pan!.querySelector(s)!;
  q("[data-x]").addEventListener("click", () => { turno++; auto = false; callar(); pan?.remove(); pan = null; quitarCursor(); partir(false); });
  q("[data-voz]").addEventListener("click", (e) => {
    hablar = !hablar; (e.target as HTMLElement).textContent = hablar ? "🔊" : "🔇"; if (!hablar) callar();
  });
  q("[data-ant]").addEventListener("click", () => { if (i > 0) { auto = false; botonAuto(); i--; mostrar(); } });
  q("[data-sig]").addEventListener("click", () => { if (i < pasos.length - 1) { i++; mostrar(); } });
  q("[data-rep]").addEventListener("click", () => mostrar());
  q("[data-auto]").addEventListener("click", () => {
    auto = !auto; botonAuto();
    if (auto) mostrar(); else { turno++; callar(); }
  });
  mostrar();
}

/** Registra el tutor del banco abierto en «📐 Diseño». Solo en el navegador de verdad (no en los tests de Node). */
export function registrarTutorTest(id: string, titulo: string, lista: () => PasoTutor[]) {
  if (typeof window === "undefined" || !w().__hekatanRebuild) return;
  w().__hekatanTutorTest = (reproducir?: boolean) => abrirTutorTest(titulo, lista(), !!reproducir);
  // ?tutor=1 en la URL: el tutor arranca solo y REPRODUCE (una vez), para mandar el enlace y que se vea directo
  if (!w().__hekatanTutorAuto && new URLSearchParams(location.search).get("tutor") === "1") {
    w().__hekatanTutorAuto = true; setTimeout(() => abrirTutorTest(titulo, lista(), true), 2500);
  }
  registrarDiseno({ id: "tutor-" + id, orden: 5, icono: "🎓", titulo: "Tutor del test (paso a paso, con voz)",
    detalle: "Explica este banco: el problema del paper, la solución exacta y cada malla con los números de Hekatan.",
    abrir: () => abrirTutorTest(titulo, lista()) });
}
