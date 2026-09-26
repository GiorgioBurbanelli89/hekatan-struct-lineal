/**
 * SCRIPT de dibujo: pegar varias órdenes de la línea de órdenes y verlas dibujarse.
 *
 * Jorge, 26-sep-2026: «en Hekatan LISP se dibuja rápido». Allí escribes el dibujo una vez (con
 * bucles) y aparece entero; en Struct había que dar punto por punto. Esto usa LAS MISMAS órdenes
 * que ya existen (`run` de la línea de órdenes), así que no hay un segundo dibujante que mantener.
 *
 *   ; un pórtico de 2 vanos                  ← comentario (también // y #)
 *   l 0,0 0,4 6,4 6,0                        ← una línea = una orden con sus respuestas
 *   rec 10,0 16,4
 *   let paso = 6                             ← variable
 *   para i 0 3                               ← bucle (i = 0,1,2,3; 3.er número = paso)
 *     l {i*paso},0 {i*paso},4                ← {expresión}: + - * / ^ ( ) sin cos sqrt pi …
 *   fin
 *
 * Al acabar cada línea la herramienta se suelta (como pulsar Enter), así que la línea siguiente
 * empieza limpia; una polilínea cerrada se escribe con «c» al final (`pl 0,0 4,0 4,3 c`).
 */

export interface ScriptHooks {
  /** La línea de órdenes: recibe UNA palabra (orden o respuesta). */
  run: (t: string) => void;
  /** Suelta la herramienta en curso (el Enter vacío). */
  finalizar: () => void;
  /** Herramienta activa ("select" si ninguna). */
  herramienta: () => string;
}

const FUNC: Record<string, unknown> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan, sqrt: Math.sqrt, abs: Math.abs, min: Math.min,
  max: Math.max, round: Math.round, floor: Math.floor, ceil: Math.ceil, pi: Math.PI,
  rad: (g: number) => (g * Math.PI) / 180, deg: (r: number) => (r * 180) / Math.PI,
};

/** Evalúa una expresión aritmética con las variables del guion. Sin acceso a nada más. */
export function evaluar(expr: string, env: Record<string, number>): number {
  if (!/^[\w\s+\-*/().,^%]*$/.test(expr)) throw new Error(`carácter no permitido en «${expr}»`);
  const nombres = new Set([...Object.keys(FUNC), ...Object.keys(env)]);
  for (const id of expr.match(/[A-Za-z_]\w*/g) ?? []) {
    if (!nombres.has(id)) throw new Error(`«${id}» no está definido`);
  }
  const claves = [...Object.keys(FUNC), ...Object.keys(env)];
  const valores = [...Object.keys(FUNC).map((k) => FUNC[k]), ...Object.keys(env).map((k) => env[k])];
  // «^» como potencia, no como XOR
  const js = expr.replace(/\^/g, "**");
  const v = new Function(...claves, `"use strict"; return (${js});`)(...valores);
  if (typeof v !== "number" || !isFinite(v)) throw new Error(`«${expr}» no da un número`);
  return v;
}

const sinComentario = (l: string) => l.replace(/(^|\s)(;|\/\/|#).*$/, "").trim();

/** Palabras de una línea, sin partir lo que va entre llaves ({i * 6}, 0). */
function palabras(l: string): string[] {
  const out: string[] = [];
  let cur = "", prof = 0;
  for (const ch of l) {
    if (ch === "{") prof++;
    if (ch === "}") prof = Math.max(0, prof - 1);
    if (/\s/.test(ch) && prof === 0) { if (cur) out.push(cur); cur = ""; } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

/** Aplana el guion: resuelve `let`, `para … fin` y las {llaves}. Devuelve las órdenes ya listas. */
export function expandir(texto: string, limite = 5000): string[][] {
  const lineas = texto.split(/\r?\n/).map(sinComentario);
  const salida: string[][] = [];
  const env: Record<string, number> = {};
  const bloque = (desde: number, hasta: number) => {
    for (let k = desde; k < hasta; k++) {
      const l = lineas[k];
      if (!l) continue;
      const num = k + 1;
      try {
        const mLet = l.match(/^(?:let|def|sea)\s+([A-Za-z_]\w*)\s*=\s*(.+)$/i);
        if (mLet) { env[mLet[1]] = evaluar(mLet[2], env); continue; }
        const mFor = l.match(/^(?:para|for)\s+([A-Za-z_]\w*)\s+(\S+)\s+(\S+)(?:\s+(\S+))?$/i);
        if (mFor) {
          // buscar el «fin» que le corresponde (los bucles se pueden anidar)
          let prof = 1, j = k + 1;
          for (; j < hasta; j++) {
            if (/^(?:para|for)\s/i.test(lineas[j])) prof++;
            else if (/^(?:fin|end)$/i.test(lineas[j]) && --prof === 0) break;
          }
          if (j >= hasta) throw new Error("falta «fin» del bucle");
          const a = evaluar(mFor[2], env), b = evaluar(mFor[3], env);
          const paso = mFor[4] ? evaluar(mFor[4], env) : (b >= a ? 1 : -1);
          if (!paso || (b - a) * paso < 0) throw new Error("el paso no lleva de inicio a fin");
          const previo = env[mFor[1]];
          for (let v = a, n = 0; paso > 0 ? v <= b + 1e-9 : v >= b - 1e-9; v += paso, n++) {
            if (n > limite) throw new Error("bucle demasiado largo");
            env[mFor[1]] = +v.toFixed(10);
            bloque(k + 1, j);
          }
          if (previo === undefined) delete env[mFor[1]]; else env[mFor[1]] = previo;
          k = j;
          continue;
        }
        if (/^(?:fin|end)$/i.test(l)) throw new Error("«fin» sin «para»");
        const pal = palabras(l).map((p) => p.replace(/\{([^{}]*)\}/g, (_, e) => {
          const v = evaluar(e, env);
          return String(+v.toFixed(6));
        }));
        salida.push(pal);
        if (salida.length > limite) throw new Error("demasiadas órdenes");
      } catch (e: any) {
        throw new Error(`línea ${num}: ${e?.message ?? e}`);
      }
    }
  };
  bloque(0, lineas.length);
  return salida;
}

/** Ejecuta el guion línea a línea (cede el hilo entre líneas para que se vea dibujar). */
export async function ejecutarScript(
  texto: string, h: ScriptHooks, alAvanzar?: (hecho: number, total: number) => void,
): Promise<{ ordenes: number; error?: string }> {
  let plan: string[][];
  try { plan = expandir(texto); } catch (e: any) { return { ordenes: 0, error: String(e?.message ?? e) }; }
  let n = 0;
  for (let i = 0; i < plan.length; i++) {
    try {
      for (const p of plan[i]) h.run(p);
      const t = h.herramienta();
      if (t && t !== "select" && t !== "none") h.finalizar();      // el Enter de fin de línea
    } catch (e: any) {
      return { ordenes: n, error: `orden ${i + 1} («${plan[i].join(" ")}»): ${e?.message ?? e}` };
    }
    n++;
    alAvanzar?.(n, plan.length);
    if (i % 4 === 3) await new Promise((r) => setTimeout(r, 0));
  }
  return { ordenes: n };
}

// ── La ventana ────────────────────────────────────────────────────────────
const EJEMPLO = `; Pórtico de 3 vanos con columnas en bucle y una losa
let luz = 6
let alto = 4
para i 0 3
  l {i*luz},0 {i*luz},{alto}          ; columna
fin
l 0,{alto} {3*luz},{alto}              ; viga de piso
rec 0,0 {3*luz},{alto}
`;
const LS = "hekatan.script.texto";
let ventana: HTMLDivElement | null = null;

export function abrirScriptCad(h: ScriptHooks): void {
  if (ventana) { ventana.style.display = "block"; (ventana.querySelector("textarea") as HTMLTextAreaElement)?.focus(); return; }
  const v = document.createElement("div");
  v.id = "hk-script-cad";
  v.style.cssText = "position:fixed;left:320px;bottom:140px;width:400px;z-index:9200;background:rgba(15,23,42,.97);" +
    "border:1px solid #22d3ee;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,.6);color:#cbd5e1;" +
    "font:12px system-ui,-apple-system,Segoe UI,sans-serif;";
  v.innerHTML =
    `<div id="hk-script-cab" style="display:flex;align-items:center;gap:8px;padding:7px 10px;cursor:move;` +
    `border-bottom:1px solid #1e3a4a"><b style="color:#22d3ee">📝 Script de dibujo</b>` +
    `<span style="flex:1"></span><button id="hk-script-x" title="Cerrar" style="background:none;border:0;color:#94a3b8;` +
    `cursor:pointer;font-size:14px">✕</button></div>` +
    `<textarea id="hk-script-txt" spellcheck="false" rows="12" style="width:calc(100% - 20px);margin:8px 10px 4px;` +
    `background:#0b1220;color:#e2e8f0;border:1px solid #334155;border-radius:6px;padding:8px;` +
    `font:12px/1.5 Consolas,monospace;resize:vertical;box-sizing:border-box"></textarea>` +
    `<div style="display:flex;gap:6px;padding:4px 10px 6px;align-items:center">` +
    `<button id="hk-script-go" style="cursor:pointer;background:#0e7490;border:1px solid #22d3ee;color:#ecfeff;` +
    `border-radius:6px;padding:5px 12px;font:600 12px inherit">▶ Ejecutar <small>(Ctrl+Enter)</small></button>` +
    `<button id="hk-script-ej" style="cursor:pointer;background:transparent;border:1px solid #475569;color:#cbd5e1;` +
    `border-radius:6px;padding:5px 10px;font:12px inherit">Ejemplo</button>` +
    `<button id="hk-script-un" title="Deshace lo dibujado por el script (Ctrl+Z, una vez por orden)" style="cursor:pointer;` +
    `background:transparent;border:1px solid #475569;color:#cbd5e1;border-radius:6px;padding:5px 10px;font:12px inherit">↶ Deshacer</button></div>` +
    `<div id="hk-script-est" style="padding:0 10px 8px;color:#94a3b8;min-height:16px">` +
    `Una línea = una orden: <code>l 0,0 6,0 6,4</code> · <code>para i 0 3 … fin</code> · <code>{i*6}</code> · <code>let a = 6</code></div>`;
  document.body.appendChild(v);
  ventana = v;
  const $ = <T extends HTMLElement>(id: string) => v.querySelector("#" + id) as T;
  const txt = $<HTMLTextAreaElement>("hk-script-txt"), est = $("hk-script-est");
  try { txt.value = localStorage.getItem(LS) || EJEMPLO; } catch { txt.value = EJEMPLO; }
  let hechas = 0;
  const ir = async () => {
    try { localStorage.setItem(LS, txt.value); } catch { /* sin almacenamiento */ }
    est.style.color = "#94a3b8"; est.textContent = "Ejecutando…";
    const r = await ejecutarScript(txt.value, h, (n, t) => { est.textContent = `Ejecutando… ${n}/${t}`; });
    hechas = r.ordenes;
    est.style.color = r.error ? "#f87171" : "#4ade80";
    est.textContent = r.error ? `✕ ${r.error}` : `✓ ${r.ordenes} órdenes ejecutadas`;
    (window as any).__hekatanAutoFit?.();
  };
  $("hk-script-go").addEventListener("click", ir);
  txt.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") { e.preventDefault(); ir(); }
    e.stopPropagation();                      // las letras del guion no son atajos del CAD
  }, true);
  $("hk-script-ej").addEventListener("click", () => { txt.value = EJEMPLO; });
  $("hk-script-un").addEventListener("click", () => {
    for (let k = 0; k < Math.max(1, hechas); k++) (window as any).__hekatanUndo?.();
    est.style.color = "#94a3b8"; est.textContent = "Deshecho.";
  });
  $("hk-script-x").addEventListener("click", () => { v.style.display = "none"; });
  // arrastrar por la cabecera
  const cab = $("hk-script-cab");
  cab.addEventListener("pointerdown", (e) => {
    if ((e.target as HTMLElement).id === "hk-script-x") return;
    const r = v.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
    const mv = (m: PointerEvent) => { v.style.left = Math.max(0, m.clientX - dx) + "px"; v.style.top = Math.max(0, m.clientY - dy) + "px"; };
    const up = () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
  });
  txt.focus();
}
