/**
 * Caja negra de Hekatan Struct.
 *
 * Anota sola lo que pasa mientras se trabaja: los comandos tecleados, los
 * botones pulsados, los cálculos y, sobre todo, LOS ERRORES — también los que
 * no sacan ningún aviso en pantalla. Se exporta a un archivo y con eso se ve
 * la secuencia exacta de lo que se hizo y dónde se rompió, sin tener que
 * acordarse ni describirlo.
 *
 * Jorge, 20-sep-2026: «¿hay posibilidad de que puedas ver cada recorrido que
 * hago y si algo no me funciona tú saberlo?».
 *
 * Uso:
 *   import { arrancarCajaNegra } from "./cajaNegra";
 *   arrancarCajaNegra();            // idempotente
 *
 * Y para sacar el informe: el botón 📋 al lado del 🤖, o `hkInforme()` en la
 * consola del navegador.
 *
 * NO se guarda nada sensible: las claves de API y los campos de contraseña se
 * descartan antes de anotar (ver `limpiar`).
 */

type Evento = {
  t: number;                 // ms desde que arrancó la sesión
  hora: string;              // hora de reloj, para casarlo con lo que cuenta el usuario
  tipo: "inicio" | "comando" | "clic" | "calculo" | "error" | "aviso" | "modelo" | "nota";
  que: string;
  datos?: Record<string, unknown>;
};

const MAX = 4000;                       // eventos guardados (circular)
const CLAVE = "hk_caja_negra_v1";
const t0 = Date.now();
let eventos: Evento[] = [];
let arrancada = false;

const hora = () => new Date().toTimeString().slice(0, 8);

/** Quita de un texto lo que no debe salir del ordenador del usuario. */
function limpiar(s: string): string {
  if (!s) return s;
  let out = s.slice(0, 400);
  // El ORDEN importa: primero lo que va tras "key/token/...", porque si no la
  // otra regla deja un "sk-<clave oculta>" que esta vuelve a cortar y sale el
  // churro "<oculto> oculta>".
  out = out.replace(/("?(api[_ -]?key|token|password|clave|secret)"?\s*[:=]\s*)("[^"]*"|\S+)/gi,
                    "$1<oculto>");
  out = out.replace(/(sk-|AIza|ghp_|gsk_)[A-Za-z0-9_-]{8,}/g, "<clave oculta>");
  return out;
}

function anota(tipo: Evento["tipo"], que: string, datos?: Record<string, unknown>) {
  eventos.push({ t: Date.now() - t0, hora: hora(), tipo, que: limpiar(que), datos });
  if (eventos.length > MAX) eventos = eventos.slice(-Math.floor(MAX * 0.8));
  if (tipo === "error") guardar();          // un error puede venir seguido de un cuelgue
}

let pendiente: number | undefined;
function guardar() {
  if (pendiente) return;
  pendiente = window.setTimeout(() => {
    pendiente = undefined;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(eventos.slice(-1200)));
    } catch { /* cuota llena: se pierde el historial viejo, no pasa nada */ }
  }, 1500);
}

/** Texto corto y útil de un elemento pulsado. */
function describe(el: Element): string {
  const e = el as HTMLElement;
  const txt = (e.innerText || e.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60);
  if (txt) return txt;
  if (e.id) return "#" + e.id;
  const t = e.getAttribute("title") || e.getAttribute("aria-label");
  if (t) return t;
  return e.tagName.toLowerCase();
}

export function arrancarCajaNegra() {
  if (arrancada) return;
  arrancada = true;

  // lo de la sesión anterior se conserva aparte: si la app se colgó, ahí está el porqué
  try {
    const previo = localStorage.getItem(CLAVE);
    if (previo) localStorage.setItem(CLAVE + "_anterior", previo);
  } catch { /* sin localStorage */ }

  anota("inicio", "sesión nueva", {
    url: location.pathname + location.search,
    pantalla: window.innerWidth + "x" + window.innerHeight,
    navegador: navigator.userAgent.slice(0, 120),
  });

  // --- errores, que es lo que de verdad importa ---------------------------
  window.addEventListener("error", (ev) => {
    const e = ev as ErrorEvent;
    anota("error", e.message || "error sin mensaje", {
      donde: (e.filename || "").split("/").pop() + ":" + e.lineno,
      traza: (e.error && e.error.stack ? String(e.error.stack) : "").slice(0, 700),
    });
  });

  window.addEventListener("unhandledrejection", (ev) => {
    const r = (ev as PromiseRejectionEvent).reason;
    anota("error", "promesa rechazada: " + String(r && r.message ? r.message : r).slice(0, 200), {
      traza: (r && r.stack ? String(r.stack) : "").slice(0, 700),
    });
  });

  // console.error / warn sin romper la consola de siempre
  for (const nivel of ["error", "warn"] as const) {
    const orig = console[nivel].bind(console);
    console[nivel] = (...args: unknown[]) => {
      try {
        anota(nivel === "error" ? "error" : "aviso",
              args.map((a) => (typeof a === "string" ? a : String(a))).join(" ").slice(0, 300));
      } catch { /* nunca estorbar a la consola */ }
      orig(...args);
    };
  }

  // --- lo que hace el usuario --------------------------------------------
  document.addEventListener("click", (ev) => {
    const el = (ev.target as Element | null)?.closest(
      "button,a,[role=button],.tp-btnv_b,.tp-lblv_v,select,input[type=checkbox]");
    if (!el) return;
    anota("clic", describe(el), { id: (el as HTMLElement).id || undefined });
  }, true);

  // la línea de órdenes del CAD: se anota lo que se teclea al pulsar Enter
  document.addEventListener("keydown", (ev) => {
    if (ev.key !== "Enter") return;
    const el = ev.target as HTMLInputElement | null;
    if (!el || (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA")) return;
    if (el.type === "password") return;
    const v = (el.value || "").trim();
    if (!v) return;
    anota("comando", v, { campo: el.id || el.className.slice(0, 40) || undefined });
  }, true);

  // eventos propios de la app, si los emite
  for (const nombre of ["hk:property-applied", "hk:model-loaded", "hk:solved", "hk:error"]) {
    window.addEventListener(nombre, (ev: Event) => {
      const d = (ev as CustomEvent).detail;
      anota(nombre === "hk:solved" ? "calculo" : "modelo", nombre,
            d && typeof d === "object" ? { detalle: JSON.stringify(d).slice(0, 300) } : undefined);
    });
  }

  window.addEventListener("beforeunload", guardar);
  setInterval(guardar, 20000);

  (window as any).hkInforme = descargarInforme;
  (window as any).hkEventos = () => eventos;
  montarBotonInforme();
}

/** Anotar algo a mano desde cualquier parte de la app. */
export function anotar(que: string, datos?: Record<string, unknown>) {
  anota("nota", que, datos);
}

function texto(): string {
  const l: string[] = [];
  l.push("INFORME DE HEKATAN STRUCT");
  l.push("generado: " + new Date().toLocaleString());
  l.push("sesión: " + ((Date.now() - t0) / 1000).toFixed(0) + " s  ·  " + eventos.length + " eventos");
  const errores = eventos.filter((e) => e.tipo === "error");
  l.push("ERRORES: " + errores.length);
  l.push("");
  if (errores.length) {
    l.push("--- los errores, primero ---");
    for (const e of errores) {
      l.push("[" + e.hora + "] " + e.que);
      if (e.datos?.donde) l.push("         en " + e.datos.donde);
      if (e.datos?.traza) l.push("         " + String(e.datos.traza).split("\n").slice(0, 4).join("\n         "));
    }
    l.push("");
  }
  l.push("--- todo, en orden ---");
  for (const e of eventos) {
    const extra = e.datos ? "  " + JSON.stringify(e.datos).slice(0, 200) : "";
    l.push("[" + e.hora + "] " + e.tipo.padEnd(8) + " " + e.que + extra);
  }
  return l.join("\n");
}

export function descargarInforme() {
  guardar();
  const blob = new Blob([texto()], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "hekatan_informe_" + new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-") + ".txt";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
}

function montarBotonInforme() {
  if (document.getElementById("hk-caja-negra-btn")) return;
  const b = document.createElement("button");
  b.id = "hk-caja-negra-btn";
  b.textContent = "📋";
  b.title = "Informe de la sesión: lo que hiciste y los errores (se descarga un .txt)";
  b.style.cssText = [
    "position:fixed", "right:16px", "bottom:18px", "z-index:9600",
    "width:34px", "height:34px", "border-radius:50%",
    "border:1px solid #64748b", "background:#0b1220", "font-size:15px",
    "cursor:pointer", "opacity:.75", "box-shadow:0 3px 10px rgba(0,0,0,.35)",
  ].join(";");
  b.onclick = descargarInforme;
  const poner = () => document.body && document.body.appendChild(b);
  if (document.body) poner();
  else document.addEventListener("DOMContentLoaded", poner);
}
