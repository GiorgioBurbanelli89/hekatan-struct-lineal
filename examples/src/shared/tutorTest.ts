/**
 * tutorTest.ts — «🎓 Tutor del test»: ventana flotante que explica un BANCO de validación paso a paso,
 * como un profesor, dentro de Hekatan Struct.
 *
 * Jorge, 22-sep-2026: «un tutor dinámico que al momento que necesite una explicación me muestre texto,
 * valores e indicaciones, para los test de Hekatan Struct».
 *
 * Cada paso tiene:
 *   - texto (qué se hace y POR QUÉ), con los valores leídos del modelo ABIERTO (no copiados);
 *   - una figura del paper (opcional);
 *   - una acción sobre el modelo (cambiar la malla y resolver), para que el usuario VEA el caso;
 *   - voz (speechSynthesis del navegador: funciona en cualquier máquina, sin servidor ni clave).
 *
 * Se abre desde «📐 Diseño» o con `window.__hekatanTutorTest()`.
 */
import { registrarDiseno, ventanaFlotante } from "./menuDiseno";

export interface PasoTutor {
  titulo: string;
  /** HTML del paso. Se evalúa DESPUÉS de la acción, así los números son los del modelo ya resuelto. */
  texto: () => string;
  /** Lo que se lee en voz alta (sin HTML ni fórmulas). Si falta, se lee el texto sin etiquetas. */
  voz?: () => string;
  fig?: string;
  /** Parámetros a poner antes de mostrar el paso (se resuelve el modelo con ellos). */
  params?: Record<string, number>;
  /** Qué SEÑALA el cursor virtual: el rótulo de un control («divisiones X»), un selector CSS
   *  («#legend») o «modelo» (el centro del visor 3D). Jorge: «tienes que señalar con un mouse
   *  virtual, si no, no se entiende». */
  senalar?: string;
}

const w = () => window as any;
const BASE = (import.meta as any).env?.BASE_URL ?? "/";

let pan: HTMLDivElement | null = null;
let i = 0, pasos: PasoTutor[] = [], nombre = "", hablar = true;

function decir(t: string) {
  const s = window.speechSynthesis; if (!s) return;
  s.cancel(); if (!hablar) return;
  const u = new SpeechSynthesisUtterance(t);
  u.lang = "es-ES"; u.rate = 1.0;
  const v = s.getVoices().find((x) => x.lang.startsWith("es"));
  if (v) u.voice = v;
  s.speak(u);
}


// ── Cursor virtual: una flecha que VIAJA hasta lo que se explica y lo encierra en un círculo ──
let cur: HTMLDivElement | null = null, aro: HTMLDivElement | null = null;
function buscar(q: string): DOMRect | null {
  if (q === "modelo") {
    const c = [...document.querySelectorAll("canvas")].sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0];
    if (!c) return null; const r = c.getBoundingClientRect();
    return new DOMRect(r.left + r.width * 0.45, r.top + r.height * 0.45, r.width * 0.1, r.height * 0.1);
  }
  if (/^[#.\[]/.test(q)) return document.querySelector(q)?.getBoundingClientRect() ?? null;
  // por rótulo: el elemento visible más pequeño cuyo texto es EXACTAMENTE ese; se señala su fila entera
  const t = q.trim().toLowerCase();
  let mejor: HTMLElement | null = null;
  for (const e of document.querySelectorAll<HTMLElement>("body *")) {
    if (pan?.contains(e) || e.children.length > 2) continue;
    if ((e.textContent || "").trim().toLowerCase() !== t) continue;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
    if (!mejor || r.width * r.height < mejor.getBoundingClientRect().width * mejor.getBoundingClientRect().height) mejor = e;
  }
  if (!mejor) return null;
  const fila = (mejor.closest(".tp-lblv, .tp-rotv, tr, li") as HTMLElement) || mejor;
  fila.scrollIntoView({ block: "center" });      // si está más abajo en el panel, primero se trae a la vista
  return fila.getBoundingClientRect();
}
function senalar(q?: string) {
  if (!cur) {
    cur = document.createElement("div");
    cur.innerHTML = `<svg width="34" height="34" viewBox="0 0 24 24"><path d="M3 2l7 19 2.5-7.5L20 11z" fill="#fff" stroke="#000" stroke-width="1.4"/></svg>`;
    cur.style.cssText = "position:fixed;z-index:9700;pointer-events:none;transition:left .9s ease,top .9s ease;left:200px;top:200px;filter:drop-shadow(0 2px 3px #000a)";
    aro = document.createElement("div");
    aro.style.cssText = "position:fixed;z-index:9690;pointer-events:none;border:3px solid #fbbf24;border-radius:10px;" +
      "box-shadow:0 0 0 4px #fbbf2455;transition:all .9s ease;opacity:0";
    document.body.append(aro, cur);
  }
  const r = q ? buscar(q) : null;
  if (!r) { aro!.style.opacity = "0"; if (pan) { const p = pan.getBoundingClientRect(); cur.style.left = p.right - 40 + "px"; cur.style.top = p.bottom - 40 + "px"; } return; }
  cur.style.left = r.left + r.width * 0.5 + "px"; cur.style.top = r.top + r.height * 0.5 + "px";
  Object.assign(aro!.style, { left: r.left - 6 + "px", top: r.top - 4 + "px", width: r.width + 12 + "px", height: r.height + 8 + "px", opacity: "1" });
}
function quitarCursor() { cur?.remove(); aro?.remove(); cur = aro = null; }

async function mostrar() {
  if (!pan) return;
  const p = pasos[i];
  if (p.params && w().__hekatanParams && w().__hekatanRebuild) {
    Object.assign(w().__hekatanParams(), p.params);
    w().__hekatanRebuild();
    await new Promise((r) => setTimeout(r, 400));
  }
  const cuerpo = pan.querySelector<HTMLDivElement>("[data-cuerpo]")!;
  const html = p.texto();
  cuerpo.innerHTML =
    `<div style="font-weight:700;color:#7dd3fc;margin-bottom:6px">${i + 1}/${pasos.length} · ${p.titulo}</div>` +
    (p.fig ? `<img src="${BASE}img/itw/${p.fig}" style="width:100%;background:#fff;border-radius:6px;margin:4px 0 8px">` : "") +
    `<div style="line-height:1.5">${html}</div>`;
  pan.querySelector<HTMLButtonElement>("[data-ant]")!.disabled = i === 0;
  pan.querySelector<HTMLButtonElement>("[data-sig]")!.disabled = i === pasos.length - 1;
  decir(p.voz ? p.voz() : cuerpo.innerText.replace(/\s+/g, " "));
  senalar(p.senalar);
}

export function abrirTutorTest(titulo: string, lista: PasoTutor[]) {
  pasos = lista; nombre = titulo; i = 0;
  pan?.remove();
  pan = document.createElement("div");
  pan.style.cssText = "position:fixed;top:60px;left:6px;width:400px;max-height:85vh;overflow:auto;z-index:9500;" +
    "background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:10px;font:13px system-ui;box-shadow:0 10px 30px #0008";
  pan.innerHTML =
    `<div style="padding:8px 10px;background:#1e3a8a;border-radius:10px 10px 0 0;display:flex;gap:8px;align-items:center;cursor:move">` +
    `<b style="flex:1">🎓 ${nombre}</b>` +
    `<button data-voz title="Voz sí / no" style="background:none;border:0;color:#fff;cursor:pointer">🔊</button>` +
    `<button data-x title="Cerrar" style="background:none;border:0;color:#fff;cursor:pointer">✕</button></div>` +
    `<div data-cuerpo style="padding:10px 12px"></div>` +
    `<div style="display:flex;gap:8px;padding:8px 12px 12px">` +
    `<button data-ant style="flex:1;padding:6px">◀ Anterior</button>` +
    `<button data-rep style="padding:6px" title="Repetir la explicación">↻</button>` +
    `<button data-sig style="flex:1;padding:6px;background:#2563eb;color:#fff;border:0;border-radius:4px">Siguiente ▶</button></div>`;
  document.body.appendChild(pan);
  ventanaFlotante(pan);
  pan.querySelector("[data-x]")!.addEventListener("click", () => { window.speechSynthesis?.cancel(); pan?.remove(); pan = null; quitarCursor(); });
  pan.querySelector("[data-voz]")!.addEventListener("click", (e) => {
    hablar = !hablar; (e.target as HTMLElement).textContent = hablar ? "🔊" : "🔇"; if (!hablar) window.speechSynthesis?.cancel();
  });
  pan.querySelector("[data-ant]")!.addEventListener("click", () => { if (i > 0) { i--; mostrar(); } });
  pan.querySelector("[data-sig]")!.addEventListener("click", () => { if (i < pasos.length - 1) { i++; mostrar(); } });
  pan.querySelector("[data-rep]")!.addEventListener("click", () => mostrar());
  mostrar();
}

/** Registra el tutor del banco abierto en «📐 Diseño». Solo en el navegador de verdad (no en los tests de Node). */
export function registrarTutorTest(id: string, titulo: string, lista: () => PasoTutor[]) {
  if (typeof window === "undefined" || !w().__hekatanRebuild) return;
  w().__hekatanTutorTest = () => abrirTutorTest(titulo, lista());
  // ?tutor=1 en la URL: el tutor arranca solo (una vez), para mandar el enlace y que se vea directo
  if (!w().__hekatanTutorAuto && new URLSearchParams(location.search).get("tutor") === "1") {
    w().__hekatanTutorAuto = true; setTimeout(() => abrirTutorTest(titulo, lista()), 2500);
  }
  registrarDiseno({ id: "tutor-" + id, orden: 5, icono: "🎓", titulo: "Tutor del test (paso a paso, con voz)",
    detalle: "Explica este banco: el problema del paper, la solución exacta y cada malla con los números de Hekatan.",
    abrir: () => abrirTutorTest(titulo, lista()) });
}
