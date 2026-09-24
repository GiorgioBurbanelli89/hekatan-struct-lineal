/**
 * La HOJA: la ventana blanca que se abre a la IZQUIERDA del agente IA y donde
 * el agente escribe la explicación con las fórmulas ya compuestas.
 *
 * Jorge, 21-sep-2026: «que no explique así, siempre en Hekatan LISP, una
 * ventana que se abra al lado del agente IA — ahí, a la izquierda».
 *
 * El porqué: el modelo contesta en LaTeX (`$f'_c = 240\text{ kgf/cm}^2$`) y en
 * la burbuja del chat eso se lee tal cual, con los dólares y las barras. Aquí
 * se compone: papel claro, serif, la ecuación centrada y en grande, igual que
 * una hoja de Hekatan LISP.
 *
 *   import { abrirHoja } from "./hojaLisp";
 *   abrirHoja("Zapata excéntrica", textoConLatex);
 *
 * KaTeX se carga del CDN. Si no llega (sin red, o el CDN bloqueado) NO se
 * queda en blanco: hay un compositor propio, pequeño, que resuelve el LaTeX
 * corriente — subíndices, exponentes, fracciones, raíces y las letras griegas.
 */

const KATEX_CSS = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
const KATEX_JS = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";

let ventana: HTMLDivElement | null = null;
let cuerpo: HTMLDivElement;
let titulo: HTMLElement;

// ── KaTeX, si se deja ─────────────────────────────────────────────────
let katexPedido = false;
function pedirKatex(): void {
  if (katexPedido) return;
  katexPedido = true;
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = KATEX_CSS;
  document.head.appendChild(css);
  const js = document.createElement("script");
  js.src = KATEX_JS;
  js.onload = () => recomponer();          // lo ya pintado se vuelve a componer
  js.onerror = () => { /* se queda el compositor propio */ };
  document.head.appendChild(js);
}

const GRIEGAS: Record<string, string> = {
  alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", zeta: "ζ",
  eta: "η", theta: "θ", lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", pi: "π",
  rho: "ρ", sigma: "σ", tau: "τ", phi: "φ", psi: "ψ", omega: "ω",
  Delta: "Δ", Sigma: "Σ", Omega: "Ω", Phi: "Φ", Gamma: "Γ", Theta: "Θ",
  approx: "≈", times: "×", cdot: "·", le: "≤", ge: "≥", ne: "≠",
  pm: "±", to: "→", rightarrow: "→", infty: "∞", partial: "∂", int: "∫",
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Compositor de repuesto. No es un TeX completo y no lo pretende: cubre lo que
 * de verdad escribe el modelo cuando explica una zapata.
 */
function latexSencillo(tex: string): string {
  let s = tex;
  s = s.replace(/\\(?:text|mathrm|mathbf|operatorname)\s*\{([^{}]*)\}/g, "$1");
  s = s.replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g,
    '<span style="display:inline-block;vertical-align:-0.5em;text-align:center">' +
    '<span style="display:block;border-bottom:1px solid currentColor;padding:0 3px">$1</span>' +
    '<span style="display:block;padding:0 3px">$2</span></span>');
  s = s.replace(/\\sqrt\s*\{([^{}]*)\}/g, "√<span style=\"border-top:1px solid currentColor\">$1</span>");
  s = s.replace(/\\left|\\right/g, "");
  s = s.replace(/\\([A-Za-z]+)/g, (m, n) => GRIEGAS[n] ?? m.slice(1));
  s = s.replace(/\^\{([^{}]*)\}/g, "<sup>$1</sup>").replace(/\^(\w)/g, "<sup>$1</sup>");
  s = s.replace(/_\{([^{}]*)\}/g, "<sub>$1</sub>").replace(/_(\w)/g, "<sub>$1</sub>");
  s = s.replace(/[{}]/g, "");
  return s;
}

function formula(tex: string, bloque: boolean): string {
  const k = (window as any).katex;
  if (k) {
    try {
      return k.renderToString(tex, { displayMode: bloque, throwOnError: false });
    } catch { /* cae al compositor propio */ }
  }
  return latexSencillo(esc(tex));
}

// ── El texto del modelo → hoja ────────────────────────────────────────

/** ¿Trae LaTeX o markdown que convenga componer? */
export function tieneFormulas(t: string): boolean {
  return /\$[^$\n]+\$|\\\(|\\\[|\\frac|\\text\{|\\sqrt|^\s*#{1,3}\s|\*\*[^*]+\*\*/m.test(t);
}

/** Un renglón de texto: negritas, `código` y las fórmulas en línea. */
function renglon(t: string): string {
  const trozos: string[] = [];
  // Las fórmulas se sacan ANTES de escapar, o el \text{} se llena de &amp;
  const marcado = t.replace(/\$\$([^$]+)\$\$|\$([^$\n]+)\$|\\\(([^)]+)\\\)/g, (_m, a, b, c) => {
    trozos.push(formula((a ?? b ?? c).trim(), false));
    return "\u0000" + (trozos.length - 1) + "\u0000";
  });
  let h = esc(marcado);
  h = h.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  h = h.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>");
  h = h.replace(/`([^`]+)`/g, '<code style="background:#eef2f7;padding:1px 4px;border-radius:3px">$1</code>');
  return h.replace(/\u0000(\d+)\u0000/g, (_m, i) => trozos[+i]);
}

function aHtml(texto: string): string {
  const out: string[] = [];
  const lineas = texto.split("\n");
  let enLista = false;
  const cerrarLista = () => { if (enLista) { out.push("</ul>"); enLista = false; } };

  for (let i = 0; i < lineas.length; i++) {
    const L = lineas[i];
    const t = L.trim();

    // ecuación en su propio renglón: va centrada y grande, como en la hoja
    const solaTex = t.match(/^\$\$?([^$]+)\$\$?$/) || t.match(/^\\\[([\s\S]+)\\\]$/);
    if (solaTex) {
      cerrarLista();
      out.push('<div class="hk-eq">' + formula(solaTex[1].trim(), true) + "</div>");
      continue;
    }
    if (!t) { cerrarLista(); continue; }

    const enc = t.match(/^(#{1,4})\s+(.*)$/);
    if (enc) {
      cerrarLista();
      const n = Math.min(enc[1].length + 1, 4);
      out.push(`<h${n}>${renglon(enc[2])}</h${n}>`);
      continue;
    }
    if (/^([-*•]|\d+[.)])\s+/.test(t)) {
      if (!enLista) { out.push("<ul>"); enLista = true; }
      out.push("<li>" + renglon(t.replace(/^([-*•]|\d+[.)])\s+/, "")) + "</li>");
      continue;
    }
    if (/^(-{3,}|_{3,})$/.test(t)) { cerrarLista(); out.push("<hr>"); continue; }
    cerrarLista();
    out.push("<p>" + renglon(t) + "</p>");
  }
  cerrarLista();
  return out.join("\n");
}

// ── La ventana ────────────────────────────────────────────────────────

const CSS = `
#hk-hoja-lisp .hk-papel{background:#fbfaf7;color:#1a1a1a;padding:14px 18px;
  font:15px/1.6 Georgia,"Times New Roman",serif;overflow:auto;flex:1;min-height:0;}
#hk-hoja-lisp h2,#hk-hoja-lisp h3,#hk-hoja-lisp h4{color:#0f3d63;margin:14px 0 6px;
  font-family:system-ui,Segoe UI,sans-serif;}
#hk-hoja-lisp h2{font-size:18px;border-bottom:2px solid #d8cfc0;padding-bottom:3px;}
#hk-hoja-lisp h3{font-size:16px;} #hk-hoja-lisp h4{font-size:14px;}
#hk-hoja-lisp p{margin:6px 0;} #hk-hoja-lisp ul{margin:6px 0 6px 20px;padding:0;}
#hk-hoja-lisp li{margin:3px 0;}
#hk-hoja-lisp hr{border:none;border-top:1px solid #ddd5c6;margin:12px 0;}
#hk-hoja-lisp .hk-eq{margin:12px 0;text-align:center;font-size:17px;color:#0b2d4d;}
#hk-hoja-lisp .katex{font-size:1.02em;}
`;

/** Coloca la hoja pegada a la IZQUIERDA del agente, sin salirse de la pantalla. */
function colocar() {
  if (!ventana) return;
  const a = document.getElementById("hk-agente-ia");
  const r = a && a.style.display !== "none" ? a.getBoundingClientRect() : null;
  const ancho = ventana.offsetWidth || 430;
  if (r && r.width > 0) {
    ventana.style.left = Math.max(8, Math.round(r.left - ancho - 10)) + "px";
    ventana.style.top = Math.round(r.top) + "px";
    ventana.style.height = Math.round(r.height) + "px";
  } else {
    ventana.style.left = "auto";
    ventana.style.right = "410px";
    ventana.style.top = "auto";
    ventana.style.bottom = "96px";
  }
}

function crear(): HTMLDivElement {
  const est = document.createElement("style");
  est.textContent = CSS;
  document.head.appendChild(est);

  const v = document.createElement("div");
  v.id = "hk-hoja-lisp";
  v.style.cssText = [
    "position:fixed", "left:auto", "right:410px", "bottom:96px",
    "width:430px", "height:540px", "max-height:calc(100vh - 150px)",
    "max-width:calc(100vw - 32px)", "z-index:8990", "display:flex",
    "flex-direction:column", "background:#fbfaf7", "border:1px solid #cbbfa8",
    "border-radius:10px", "box-shadow:0 12px 40px rgba(0,0,0,.45)", "overflow:hidden",
  ].join(";");

  const cab = document.createElement("div");
  cab.style.cssText = "display:flex;align-items:center;gap:6px;padding:7px 10px;" +
    "background:#13314f;color:#e8eef5;font:600 13px system-ui,Segoe UI,sans-serif;" +
    "cursor:move;flex-shrink:0;";
  titulo = document.createElement("span");
  titulo.style.cssText = "flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
  titulo.textContent = "📄 Hoja · Hekatan LISP";
  cab.appendChild(titulo);

  const fuera = document.createElement("button");
  fuera.textContent = "↗ Abrir";
  fuera.title = "Abrir la hoja en Hekatan LISP web, en una pestaña aparte";
  fuera.style.cssText = "background:#1e4468;border:1px solid #2f5f8d;border-radius:4px;color:#dbe7f3;" +
    "cursor:pointer;font:11px system-ui,Segoe UI,sans-serif;padding:2px 7px;";
  fuera.onclick = () => { if (enlaceHoja) window.open(enlaceHoja, "_blank", "noopener"); };
  cab.appendChild(fuera);

  const copiar = document.createElement("button");
  copiar.textContent = "🔗 Enlace";
  copiar.title = "Copiar el enlace: la hoja viaja DENTRO del enlace, se comparte tal cual";
  copiar.style.cssText = "background:#1e4468;border:1px solid #2f5f8d;border-radius:4px;color:#dbe7f3;" +
    "cursor:pointer;font:11px system-ui,Segoe UI,sans-serif;padding:2px 7px;";
  copiar.onclick = () => {
    navigator.clipboard?.writeText(enlaceHoja || ultimoTexto).catch(() => {});
    const antes = copiar.textContent;
    copiar.textContent = "✓ Copiado";
    setTimeout(() => { copiar.textContent = antes; }, 1800);
  };
  cab.appendChild(copiar);

  const cerrar = document.createElement("button");
  cerrar.textContent = "✕";
  cerrar.title = "Cerrar la hoja";
  cerrar.style.cssText = "background:none;border:none;color:#cbd5e1;cursor:pointer;font-size:14px;";
  cerrar.onclick = () => { v.style.display = "none"; };
  cab.appendChild(cerrar);

  v.appendChild(cab);
  cuerpo = document.createElement("div");
  cuerpo.className = "hk-papel";
  v.appendChild(cuerpo);
  document.body.appendChild(v);

  // arrastrar por la cabecera
  let ox = 0, oy = 0, arrastrando = false;
  cab.addEventListener("mousedown", (e) => {
    if ((e.target as HTMLElement).tagName === "BUTTON") return;
    const r = v.getBoundingClientRect();
    ox = e.clientX - r.left; oy = e.clientY - r.top; arrastrando = true;
    e.preventDefault();
  });
  window.addEventListener("mousemove", (e) => {
    if (!arrastrando) return;
    v.style.right = "auto";
    v.style.bottom = "auto";
    v.style.left = Math.max(0, e.clientX - ox) + "px";
    v.style.top = Math.max(0, e.clientY - oy) + "px";
  });
  window.addEventListener("mouseup", () => { arrastrando = false; });
  window.addEventListener("resize", colocar);

  return v;
}

let ultimoTexto = "";
let enlaceHoja = "";

/**
 * Abre la hoja (o la reutiliza) y pone ahi la explicacion.
 *
 * Dos caminos, y el bueno es el primero:
 *   1. si la respuesta trae un bloque de codigo Hekatan LISP, lo ejecuta el
 *      MOTOR de verdad en un iframe: simbolico, #dibujo, #graf, unidades;
 *   2. si solo trae LaTeX suelto, se compone aqui con KaTeX.
 */
export function abrirHoja(tit: string, texto: string): void {
  if (!ventana || !document.body.contains(ventana)) ventana = crear();
  ventana.style.display = "flex";
  titulo.textContent = "\ud83d\udcc4 " + (tit || "Hoja \u00b7 Hekatan LISP");
  ultimoTexto = texto;
  colocar();
  setTimeout(colocar, 60);

  const codigo = sacarLisp(texto);
  if (codigo) {
    enlaceHoja = "";
    montarMotor(cuerpo, codigo).then((u) => {
      enlaceHoja = u;
      if (!u) { cuerpo.style.padding = ""; pedirKatex(); cuerpo.innerHTML = aHtml(texto); }
    });
    return;
  }
  pedirKatex();
  cuerpo.style.padding = "";
  cuerpo.innerHTML = aHtml(texto);
  cuerpo.scrollTop = 0;
}

/** Vuelve a componer lo que ya está puesto (se llama al llegar KaTeX). */
function recomponer(): void {
  if (ventana && ultimoTexto) cuerpo.innerHTML = aHtml(ultimoTexto);
}

export function hojaVisible(): boolean {
  return !!ventana && ventana.style.display !== "none";
}

export function recolocarHoja(): void { colocar(); }

// para probarla sin el agente (y para la consola del navegador)
(window as any).__hkHoja = abrirHoja;

// ── El MOTOR de verdad: Hekatan LISP web dentro de la hoja ────────────
//
// Jorge, 21-sep-2026: «para eso tenemos Hekatan LISP web, integrada en Hekatan
// Struct». Y tiene razon: componer LaTeX a mano es reinventar lo que el motor
// ya hace — simbolico, #dibujo, #graf, unidades, tablas.
//
// La hoja viaja DENTRO del enlace, igual que el boton «compartir» de la web:
// deflate-raw + base64url en el #hash. No pasa por ningun servidor, no hay que
// guardar nada. `solo=1` muestra el resultado y esconde el editor.

const LISP_WEB = "https://giorgioburbanelli89.github.io/hekatan-lisp/";

async function comprimir(t: string): Promise<string> {
  const s = new Blob([t]).stream().pipeThrough(new (window as any).CompressionStream("deflate-raw"));
  const b = new Uint8Array(await new Response(s).arrayBuffer());
  let bin = "";
  for (const x of b) bin += String.fromCharCode(x);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Saca el bloque de codigo Hekatan LISP de la respuesta, si lo hay. */
export function sacarLisp(t: string): string | null {
  const m = t.match(/```(?:lisp|hekatan|hoja)?\s*\n([\s\S]*?)```/i);
  if (!m) return null;
  const cuerpo = m[1].trim();
  // que de verdad sea una hoja: titulo, comentario de texto, dibujo o grafica
  return /^\s*#|#dibujo|#graf|#:/m.test(cuerpo) ? cuerpo : null;
}

/** Pinta la hoja en un iframe del motor. Devuelve el enlace para abrirla aparte. */
export async function montarMotor(destino: HTMLElement, codigo: string): Promise<string> {
  destino.innerHTML = '<p style="color:#5a6673;font:13px system-ui">Abriendo el motor de Hekatan LISP…</p>';
  let url: string;
  try {
    url = LISP_WEB + "#h=" + (await comprimir(codigo)) + "&solo=1&embed=1";
  } catch {
    // sin CompressionStream (navegador viejo): se queda el compositor propio
    return "";
  }
  const f = document.createElement("iframe");
  f.src = url;
  f.style.cssText = "width:100%;height:100%;border:none;background:#fbfaf7;";
  f.setAttribute("loading", "eager");
  destino.innerHTML = "";
  destino.style.padding = "0";
  destino.appendChild(f);
  return url;
}

// para probarla sin el agente (y para la consola del navegador)
(window as any).__hkHoja = abrirHoja;
