/**
 * destinos.ts — el CATÁLOGO de adónde se puede ir en Hekatan Struct.
 *
 * Un solo índice para el buscador («🔎 ¿Qué buscas?», Ctrl+K) y para el guiado paso a
 * paso, para que los dos no se desincronicen (Jorge, 19-sep-2026). Cada destino tiene
 * nombre ES/EN, sinónimos (en los dos idiomas) y una ACCIÓN que lleva allí.
 *
 * Solo usa ganchos globales que ya expone la app (__hekatanRibbon, __hekatanExamples,
 * __hekatanAgenteIA…): así no crea dependencias circulares con workspace/main.ts.
 *
 * ⏳ Hueco para el agente IA: `guiar(destino)` y `abrir_ejemplo(id)` se enchufarán aquí
 * (window.__hekatanDestinos.ir / .buscar).
 */
export type TipoDestino = "pestaña" | "herramienta" | "panel" | "ejemplo" | "ayuda";

export interface Destino {
  id: string;
  tipo: TipoDestino;
  es: string;
  en: string;
  /** palabras clave y sinónimos, ES y EN, en minúsculas */
  sin: string[];
  /** lleva al usuario allí; devuelve un aviso corto (o nada) */
  ir: () => string | void;
}

const W = () => window as any;
export const idioma = (): "es" | "en" => { try { return localStorage.getItem("hk_lang") === "en" ? "en" : "es"; } catch { return "es"; } };

/** Abre la cinta (si está plegada). */
export const abrirCinta = () => { try { W().__hekatanRibbonPlegar?.(false); } catch {} };

/** ¿Está abierto un panel lateral? (lo pliegan con translateX, ver hekatanCadSkin.ts) */
export const panelAbierto = (lado: "izq" | "der"): boolean => {
  const p = document.getElementById(lado === "izq" ? "settings" : "hk-pane-host");
  if (!p || getComputedStyle(p).display === "none" || !p.offsetWidth) return false;
  const t = getComputedStyle(p).transform;
  const m = t && t !== "none" ? Math.abs(+t.split(",")[4]) : 0;
  return m <= 40;
};
/** Abre o pliega un panel lateral con su propia puerta (el mismo botón que usa la persona). */
export const panel = (lado: "izq" | "der", abrir: boolean) => {
  if (panelAbierto(lado) === abrir) return;
  document.getElementById(lado === "izq" ? "hk-settings-toggle" : "hk-pane-toggle")?.click();
};
export const plegarPaneles = () => { panel("izq", false); panel("der", false); };

const PESTANAS: Array<[string, string, string, string[]]> = [
  ["dibujo", "Pestaña Dibujo", "Draw tab", ["dibujar", "draw", "linea", "line", "polilinea", "columna", "viga", "beam", "muro", "wall", "losa", "slab", "apoyo", "support", "carga", "load", "modificar", "modify", "cercha", "truss", "portico", "frame"]],
  ["rejilla", "Pestaña Rejilla y planos", "Grid & planes tab", ["rejilla", "grid", "ejes", "axes", "pisos", "storeys", "niveles", "levels", "cota", "plano de trabajo", "work plane", "subir", "replicar pisos"]],
  ["areas", "Pestaña Áreas", "Areas tab", ["areas", "cascara", "shell", "paño", "rellenar", "fill", "cupula", "dome", "revolucion", "revolve", "barrido", "sweep", "chaflan", "fillet"]],
  ["resultados", "Pestaña Resultados", "Results tab", ["resultados", "results", "deformada", "deformed", "axil", "axial", "cortante", "shear", "momento", "moment", "reacciones", "reactions", "desplazamientos", "displacements", "diagrama", "calcular", "analizar", "analyze"]],
  ["ifc", "Pestaña IFC y cortes", "IFC & sections tab", ["ifc", "revit", "importar", "import", "corte", "cortes", "section", "cut", "objetos"]],
];

/** Construye el catálogo en el momento (los ejemplos y la cinta se montan después del módulo). */
export function catalogo(): Destino[] {
  const out: Destino[] = [];
  const cinta = W().__hekatanRibbon;
  for (const [p, es, en, sin] of PESTANAS) {
    out.push({ id: "pest:" + p, tipo: "pestaña", es, en, sin,
      ir: () => { abrirCinta(); cinta?.pestana?.(p); return idioma() === "en" ? en : es; } });
  }
  // cada herramienta de la cinta: abre su pestaña y la resalta un momento
  for (const h of (cinta?.fichas?.() ?? []) as Array<{ id: string; nombre: string; ayuda: string; tecla: string; pest: string }>) {
    out.push({ id: "herr:" + h.id, tipo: "herramienta", es: h.nombre, en: cinta?.traducir?.(h.nombre) ?? h.nombre,
      sin: [h.id.replace(/[-_]/g, " "), h.tecla?.toLowerCase?.() ?? "", ...h.ayuda.toLowerCase().split(/[^a-záéíóúñü0-9]+/).filter((x) => x.length > 3)],
      ir: () => { abrirCinta(); cinta?.resaltar?.(h.id); return `${h.nombre}: ${h.ayuda}`; } });
  }
  out.push(
    { id: "panel:izq", tipo: "panel", es: "Panel de ajustes (resultados, vista, cortes)", en: "Settings panel (results, view, sections)",
      sin: ["ajustes", "settings", "panel izquierdo", "left panel", "vista", "view", "tablas", "tables", "modal", "animar"],
      ir: () => { panel("izq", true); } },
    { id: "panel:der", tipo: "panel", es: "Panel del modelo (ejemplos, parámetros, CAD)", en: "Model panel (examples, parameters, CAD)",
      sin: ["panel derecho", "right panel", "parametros", "parameters", "ejemplo", "plantilla", "template", "exportar", "export", "etabs", "sap2000", "safe", "opensees", "cli"],
      ir: () => { panel("der", true); } },
    { id: "ayuda:tutoriales", tipo: "ayuda", es: "Tutoriales en vídeo", en: "Video tutorials",
      sin: ["tutorial", "tutoriales", "video", "vídeo", "aprender", "learn", "clips"],
      ir: () => { (document.getElementById("hk-cad-tutorial") as HTMLButtonElement | null)?.click(); } },
    { id: "ayuda:ia", tipo: "ayuda", es: "Agente IA (pídele una estructura)", en: "AI agent (ask it for a structure)",
      sin: ["ia", "ai", "agente", "agent", "chat", "gemini", "ollama", "asistente"],
      ir: () => { W().__hekatanAgenteIA?.(); } },
    { id: "ayuda:guia", tipo: "ayuda", es: "Cómo usar · cuatro pasos (F1)", en: "How to use · four steps (F1)",
      sin: ["ayuda", "help", "guia", "guide", "como", "how", "f1", "pasos", "steps"],
      ir: () => { abrirCinta(); cinta?.guia?.(true); } },
  );
  for (const e of (W().__hekatanExamples ?? []) as Array<{ id: string; name: string; category: string }>) {
    out.push({ id: "ej:" + e.id, tipo: "ejemplo", es: e.name, en: e.name,
      sin: [e.id.replace(/[-_]/g, " "), (e.category || "").toLowerCase(), "ejemplo", "example", "plantilla", "template"],
      ir: () => { const u = new URL(location.href); u.search = ""; u.searchParams.set("t", e.id); location.href = u.toString(); } });
  }
  return out;
}

/** minúsculas y sin tildes */
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** ¿`q` cabe en `t` con como mucho 1 error por palabra (falta de tecleo)? */
const casiIgual = (q: string, t: string): boolean => {
  if (Math.abs(q.length - t.length) > 1) return false;
  let i = 0, j = 0, err = 0;
  while (i < q.length && j < t.length) {
    if (q[i] === t[j]) { i++; j++; continue; }
    if (++err > 1) return false;
    if (q.length > t.length) i++; else if (q.length < t.length) j++; else { i++; j++; }
  }
  return err + (q.length - i) + (t.length - j) <= 1;
};

/** Busca en el catálogo: puntúa nombre (ES y EN) y sinónimos, tolera una falta por palabra. */
export function buscar(consulta: string, max = 12): Destino[] {
  const q = norm(consulta.trim());
  const todos = catalogo();
  if (!q) return todos.filter((d) => d.tipo === "pestaña" || d.tipo === "ayuda").slice(0, max);
  const pals = q.split(/\s+/).filter(Boolean);
  const res: Array<[number, Destino]> = [];
  for (const d of todos) {
    const nombre = norm(d.es + " " + d.en), sin = d.sin.map(norm);
    let pts = 0;
    for (const p of pals) {
      if (nombre.startsWith(p)) pts += 6;
      else if (nombre.includes(p)) pts += 4;
      else if (sin.some((s) => s.startsWith(p))) pts += 3;
      else if (sin.some((s) => s.includes(p))) pts += 2;
      else if ([...nombre.split(/\s+/), ...sin].some((w) => p.length > 3 && casiIgual(p, w))) pts += 1;
      else { pts = 0; break; }
    }
    if (pts > 0) res.push([pts + (d.tipo === "pestaña" ? 0.5 : 0), d]);
  }
  return res.sort((a, b) => b[0] - a[0]).slice(0, max).map((x) => x[1]);
}

if (typeof window !== "undefined") {
  W().__hekatanDestinos = { catalogo, buscar, ir: (id: string) => catalogo().find((d) => d.id === id)?.ir() };
}
