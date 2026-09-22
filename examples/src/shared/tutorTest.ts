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
  pan.querySelector("[data-x]")!.addEventListener("click", () => { window.speechSynthesis?.cancel(); pan?.remove(); pan = null; });
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
  registrarDiseno({ id: "tutor-" + id, orden: 5, icono: "🎓", titulo: "Tutor del test (paso a paso, con voz)",
    detalle: "Explica este banco: el problema del paper, la solución exacta y cada malla con los números de Hekatan.",
    abrir: () => abrirTutorTest(titulo, lista()) });
}
