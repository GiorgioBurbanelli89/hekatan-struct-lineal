/**
 * Agente de IA de Hekatan Struct — la IA MODELA, no solo escribe texto.
 *
 * El asistente de `aiAssistant.ts` devuelve un script que el usuario copia y ejecuta. Aquí la
 * IA llama HERRAMIENTAS (tool calling) que actúan sobre el programa abierto: carga una
 * plantilla, cambia parámetros, escribe un .heks, lee los resultados, corre el modal, gira la
 * cámara… y VE lo que salió antes de dar el siguiente paso. Es el esquema de Structon.AI
 * (agente con herramientas) pero sobre el motor de Hekatan y sin servidor: todo corre en el
 * navegador y las claves se quedan en localStorage.
 *
 * Un solo protocolo, el de OpenAI (`/chat/completions` con `tools`), porque lo hablan los
 * cuatro proveedores gratuitos que ya tenía el panel:
 *   Ollama      http://localhost:11434/v1          (local, sin clave)
 *   Groq        https://api.groq.com/openai/v1
 *   OpenRouter  https://openrouter.ai/api/v1
 *   Gemini      https://generativelanguage.googleapis.com/v1beta/openai
 *
 * La ventana es flotante y vive fuera del panel de parámetros: ese panel se reconstruye cada
 * vez que se carga una plantilla, y con el chat dentro el agente se borraba a sí mismo a mitad
 * de la tarea.
 */

import { aiStorage } from "./aiAssistant";
import { abrirHoja, tieneFormulas } from "./hojaLisp";
import { leerArchivos, mensajeCon, pedirArchivos, type Adjunto } from "./adjuntos";

const W = () => window as any;

// ─────────────────────────────────────────────────────────────────────
// Proveedores (protocolo OpenAI)
// ─────────────────────────────────────────────────────────────────────

interface AgentProvider {
  id: string;
  nombre: string;
  url: string;
  clave: boolean;
  modelos: string[];
  pista: string;
}

const PROVEEDORES: AgentProvider[] = [
  {
    id: "ollama", nombre: "🦙 Ollama (local)", url: "http://localhost:11434/v1/chat/completions",
    clave: false, modelos: ["qwen2.5:7b", "qwen2.5:3b", "llama3.1:8b", "qwen3:8b"],
    pista: "Local y gratis: ollama.com → ollama pull qwen2.5:7b. Desde la web pública, arrancar Ollama con OLLAMA_ORIGINS=* (si no, bloquea la página).",
  },
  {
    id: "gemini", nombre: "✨ Gemini", url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    clave: true, modelos: ["gemini-3.6-flash", "gemini-flash-latest", "gemini-flash-lite-latest"],
    pista: "Clave gratis: aistudio.google.com/apikey",
  },
  {
    id: "groq", nombre: "⚡ Groq", url: "https://api.groq.com/openai/v1/chat/completions",
    clave: true, modelos: ["llama-3.3-70b-versatile", "qwen/qwen3-32b"],
    pista: "Clave gratis: console.groq.com/keys",
  },
  {
    id: "openrouter", nombre: "🌐 OpenRouter", url: "https://openrouter.ai/api/v1/chat/completions",
    clave: true, modelos: ["deepseek/deepseek-chat-v3-0324:free", "qwen/qwen-2.5-72b-instruct:free"],
    pista: "Clave: openrouter.ai/keys (sufijo :free = gratis)",
  },
];

// ─────────────────────────────────────────────────────────────────────
// Herramientas: lo que la IA puede hacer sobre el programa
// ─────────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: "obtener_modelo",
    description: "Resumen del modelo abierto: plantilla, parámetros, número de nudos, barras, cáscaras, apoyos, cargas y dimensiones. Úsala al empezar si el usuario habla del modelo actual.",
    parameters: { type: "object", properties: {}, required: [] },
  },
  {
    name: "listar_plantillas",
    description: "Busca plantillas paramétricas del programa (edificios, pórticos, galpones, zapatas, losas, muros…). Devuelve id, nombre y categoría.",
    parameters: {
      type: "object",
      properties: { filtro: { type: "string", description: "palabra a buscar, p. ej. 'edificio', 'zapata', 'galpon'. Vacío = todas." } },
      required: [],
    },
  },
  {
    name: "cargar_plantilla",
    description: "Abre una plantilla por su id y opcionalmente le pone parámetros. Devuelve la lista de parámetros de la plantilla con sus valores, para poder ajustarlos después.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string", description: "id de la plantilla (de listar_plantillas)" },
        parametros: { type: "object", description: "clave → valor numérico, p. ej. {\"nFloors\": 4}" },
      },
      required: ["id"],
    },
  },
  {
    name: "cambiar_parametros",
    description: "Cambia parámetros numéricos de la plantilla abierta y recalcula.",
    parameters: {
      type: "object",
      properties: { parametros: { type: "object", description: "clave → valor numérico" } },
      required: ["parametros"],
    },
  },
  {
    name: "modelar_heks",
    description: "Construye un modelo a medida con comandos .heks (nudos, barras, cáscaras, apoyos, cargas) y lo resuelve. Devuelve conteos, errores de sintaxis, flecha máxima y suma de reacciones.",
    parameters: {
      type: "object",
      properties: {
        script: { type: "string", description: "comandos .heks, uno por línea; terminar con 'solve'" },
        modo: { type: "string", enum: ["nuevo", "agregar"], description: "nuevo = reemplaza el modelo; agregar = añade al modelo actual" },
      },
      required: ["script"],
    },
  },
  {
    name: "resultados",
    description: "Resultados del análisis estático: desplazamientos máximos (mm), suma de reacciones (kN) y, si hay un mapa de colores a la vista, su mínimo y máximo en texto. Úsala para comprobar el modelo.",
    parameters: { type: "object", properties: {}, required: [] },
  },
  {
    name: "analisis_modal",
    description: "Corre el análisis modal y anima el modo 1. Devuelve periodos (s) y participación de masa UX, UY, RZ de los primeros modos.",
    parameters: { type: "object", properties: {}, required: [] },
  },
  {
    name: "vista",
    description: "Cambia la vista 3D: cámara, deformada y campo de colores de cáscaras.",
    parameters: {
      type: "object",
      properties: {
        camara: { type: "string", enum: ["iso", "plan", "elevX", "elevY"] },
        deformada: { type: "boolean" },
        campo_cascara: { type: "string", enum: ["none", "displacementZ", "bendingXX", "bendingYY", "membraneXX", "membraneYY", "vonMises"] },
      },
      required: [],
    },
  },
  {
    name: "deshacer",
    description: "Vuelve el modelo al estado anterior al último cambio hecho por el agente.",
    parameters: { type: "object", properties: {}, required: [] },
  },
];

const SYSTEM_PROMPT = `Eres el agente de Hekatan Struct, un programa de análisis estructural por elementos finitos.
No escribes el modelo en el chat: lo CONSTRUYES llamando a las herramientas, y compruebas cada paso.

Unidades: kN, m, s. Ejes: Z hacia arriba, gravedad = -Z.

Cómo trabajar:
1. Si piden una tipología estándar (edificio, pórtico, galpón, zapata, losa, muro…), busca con
   listar_plantillas, ábrela con cargar_plantilla y ajusta los parámetros que devuelve.
   Plantillas por tipología (id):
     edificio de pórticos → edificio-aporticado (claves nPisos, nVanosX, nVanosY, spanX, spanY, hPiso)
     edificio con losas → edificio-hormigon · galpón a dos aguas → galpon
     galpón curvo → galpon-curvo · galpón a un agua → galpon-agua1
     puente de losa sobre vigas → puente-losa-vigas · puente reticular → puente
     estribo de puente (áreas) → estribo-puente
     muro de contención con áreas → muro-contencion-areas · con sólidos → muro-contencion-solido
     placa base (áreas) → placa-base · zapata aislada → zapata-aislada
     zapatas con viga de amarre → zapata-viga-amarre · viga de cimentación → viga-cim-guerra-ej7
     losa de cimentación → guerra-ej8-losa-cimentacion
   Usa SIEMPRE las claves exactas que devuelve la herramienta.
2. Si es una estructura a medida, usa modelar_heks.
3. Después de modelar, llama a resultados (y a analisis_modal si preguntan por periodos o sismo).
   Si hay errores, flecha absurda o la suma de reacciones no equilibra la carga, corrige y repite.
4. Termina con 2-4 líneas en español: qué modelaste y los números clave (flecha, periodo).
   No inventes números: usa solo los que devolvieron las herramientas.

Cómo se escribe una EXPLICACIÓN (cuando piden explicar, comprobar, deducir o un dibujo):
NO se escribe en el chat: se escribe como HOJA DE HEKATAN LISP en un bloque de código marcado
«lisp», y el motor la resuelve y la dibuja en la ventana de la izquierda. Nada de LaTeX.

  # Título de la hoja
  #: Texto corrido, con **negrita**. Aquí se dice de dónde sale cada cosa.
  ## 1 · Datos
  #: Los DATOS van en TABLA, en columnas — nunca uno por renglón, que deja la hoja medio vacía:
  #| Dato | Valor | Dato | Valor |
  #|---|---:|---|---:|
  #| B | 1.50 m | P | 606 kN |
  #| L | 1.50 m | e_{x} | 0.15 m |
  #| h | 0.40 m | e_{y} | 0.30 m |
  ## 2 · El cálculo
  #: Primero en letras, que el motor la deja simbólica:
  sigma_max = P/A*(1 + 6*e_x/B)
  #: Y ahora con los números y SUS UNIDADES:
  A = 1.5m*1.5m|m^2
  sigma_max = dec(606kN/2.25m^2*(1 + 6*0.15/1.5), 1)|kPa

UNIDADES — OBLIGATORIAS en TODA línea que tenga un número. El motor las calcula de verdad.
  MAL:   Lx = 1.5          P = 606.2         s = sigma_max/ks      → sale «≈ 0.0» y no dice nada
  BIEN:  L_x = 1.5m        P = 606.2kN       s = dec(754.3kPa/20000kN/m^3, 1)|mm   → «37.7 mm»
  · se pegan al número, sin espacio: 606kN, 1.5m, 20000kN/m^3, 240kgf/cm^2;
  · la BARRA dice en qué unidad se quiere LEER: |kPa, |mm, |tonf/m2, |kgf/cm2;
  · sin la barra el resultado sale en la unidad base (metros) y un asiento de 37 mm
    se convierte en «0.0»: por eso la barra NO es opcional;
  · si las dimensiones no cuadran el motor avisa, así que no hay que inventar factores.
DECIMALES: el motor es exacto y escribe 9/4 en vez de 2.25. Para leerlo en decimal: dec(expr, 2).
  Nunca metas un dec() dentro de otro dec(): deja de evaluar.
SUBÍNDICES: en la línea de cálculo SIN llaves (e_x, N_q, sigma_max). En el texto «#:» y en las
  tablas CON llaves (e_{x}), que si no el guion bajo abre cursiva.
  En las tablas el exponente tambien con llaves: kN/m^{3}, kgf/cm^{2}.

Para DIBUJAR (croquis a escala, con cotas); coordenadas del problema en metros, Y hacia arriba:

  #dibujo("Zapata 1.5 x 1.5 m", ud = m, escala = 1:28, cotas = m, alto = 240)
  #  rect(0, 0, 1.5, 0.4, "gruesa")
  #  achurado(0, 0, 1.5, 0.4, "diagonal")
  #  rect(0.6, 0.4, 0.3, 0.9, "gruesa")
  #  flecha(0.75, 1.75, 0.75, 1.35, "rojo")
  #  texto(0.95, 1.6, "P = 606 kN", 2.6, "i")
  #  cota(0, -0.3, 1.5, -0.3, -0.12, "B = 1.50")
  #fin

Y para una GRÁFICA: #fplot(...). Dos o tres apartados bastan; la ventana es estrecha.
Usa los números que devolvieron las herramientas, nunca inventados.

Si te falta un dato para contestar bien — una fórmula, una tabla de la norma, un plano, el
enunciado de un ejercicio — NO lo inventes ni te disculpes: PÍDELO. Di exactamente esto:
  «Eso no lo sé de memoria. Adjúntame la página con el botón ' + chr(0x1F4CE) + ' de abajo: vale una FOTO o una
   captura (la leo yo), un PDF (le saco el texto) o un .txt. Dime también qué parte miro.»
Cuando llegue, trabaja SOLO con lo que ponga ahí, y cita de dónde sale cada número.

Si piden COMPROBAR algo a mano, la hoja es además la CALCULADORA: dilo y explica cómo se usa.
En la ventana de la izquierda, sobre el papel, está la barra del motor:
  · «✎ Volver al editor» abre el código: se cambia un número y se ve el resultado nuevo.
  · «▶ Ejecutar» (o AutoRun) vuelve a calcular.
  · «🔗 Enlace», arriba, copia la hoja ENTERA dentro del enlace: se pega en WhatsApp o Telegram y
    el que lo abra ve la misma hoja, sin instalar nada. «↗ Abrir» la saca a una pestaña aparte.
Una hoja de comprobación lleva los datos arriba y las fórmulas debajo: así basta tocar un dato.

Sintaxis .heks (un comando por línea, # comentario):
node <id> <x> <y> <z>
frame <id> <nI> <nJ> <E> <A> <I22> <I33>      E en kN/m² (hormigón 25e6, acero 2e8)
shell <id> <n1> <n2> <n3> <n4> <t> <E>          losa/muro Q4, nudos en orden de giro
support <nudo> fixed | pinned | roller          o seis 0/1: support 1 1 1 1 1 1 1
load <nudo> <Fx> <Fy> <Fz> <Mx> <My> <Mz>       kN (hacia abajo = Fz negativo)
frameload <barra> <wx> <wy> <wz>                kN/m globales
areaload <shell> <q>                            kN/m² (+z; gravedad negativa)
selfweight 1                                    peso propio
solve                                           al final, siempre

Parte las vigas en 4 tramos o más si quieres ver su flecha: el resultado es solo en nudos.
Secciones típicas: columna 40×40 A=0.16 I=0.002133; viga 30×50 A=0.15 I22=0.001125 I33=0.003125.
Ejemplo pórtico de un vano 5 m × 3 m empotrado:
node 1 0 0 0
node 2 0 0 3
node 3 5 0 3
node 4 5 0 0
frame 1 1 2 25e6 0.16 0.002133 0.002133
frame 2 2 3 25e6 0.15 0.001125 0.003125
frame 3 3 4 25e6 0.16 0.002133 0.002133
support 1 fixed
support 4 fixed
frameload 2 0 0 -20
solve`;

// ─────────────────────────────────────────────────────────────────────
// Ejecutores de herramientas
// ─────────────────────────────────────────────────────────────────────

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));
const cuadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

type Foto = { ex: string | null; params: Record<string, number>; script: string };
const historial: Foto[] = [];

function foto(): Foto {
  return {
    ex: W().__hekatanExample?.() ?? null,
    params: { ...(W().__hekatanGetParams?.() ?? {}) },
    script: W().__hekatanCliScript ?? "",
  };
}

async function abrirEjemplo(id: string) {
  if (W().__hekatanExample?.() === id) W().__hekatanRebuild?.();
  else W().__hekatanLoadExampleById?.(id);
  await cuadro();
  await espera(150);
}

async function ponerParametros(p: Record<string, any> | undefined) {
  if (!p || !Object.keys(p).length) return [];
  const vivos = W().__hekatanParams?.();
  if (!vivos) return ["no hay plantilla abierta"];
  const avisos: string[] = [];
  for (const [k, v] of Object.entries(p)) {
    const num = typeof v === "boolean" ? (v ? 1 : 0) : Number(v);
    if (!(k in vivos)) { avisos.push(`parámetro desconocido: ${k}`); continue; }
    if (!Number.isFinite(num)) { avisos.push(`${k}: valor no numérico`); continue; }
    vivos[k] = num;
  }
  W().__hekatanRebuild?.();
  await cuadro();
  await espera(150);
  return avisos;
}

function contarModelo() {
  const s = W().__hekatanStates;
  if (!s) return null;
  const nodes: number[][] = s.nodes?.val ?? [];
  const els: number[][] = s.elements?.val ?? [];
  const ni = s.nodeInputs?.val ?? {};
  const bb = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
  for (const n of nodes) for (let k = 0; k < 3; k++) {
    bb[k] = Math.min(bb[k], n[k]); bb[k + 3] = Math.max(bb[k + 3], n[k]);
  }
  const r = (x: number) => +x.toFixed(1);
  return {
    nudos: nodes.length,
    barras: els.filter((e) => e.length === 2).length,
    cascaras: els.filter((e) => e.length >= 3).length,
    apoyos: ni.supports?.size ?? 0,
    cargas_nodales: ni.loads?.size ?? 0,
    // aprox.: con el modal animando, los nudos del estado son los de la deformada
    dimensiones_m: nodes.length
      ? { x: r(bb[3] - bb[0]), y: r(bb[4] - bb[1]), z: r(bb[5] - bb[2]) } : null,
  };
}

function leerResultados() {
  const d = W().__hekatanStates?.deformOutputs?.val;
  if (!d?.deformations?.size) return { error: "no hay resultados: el modelo no se resolvió (¿falta solve, apoyos o cargas?)" };
  const max = [0, 0, 0], nudo = [0, 0, 0];
  for (const [id, v] of d.deformations as Map<number, number[]>) {
    for (let k = 0; k < 3; k++) if (Math.abs(v[k]) > Math.abs(max[k])) { max[k] = v[k]; nudo[k] = id; }
  }
  const R = [0, 0, 0];
  for (const [, v] of (d.reactions ?? new Map()) as Map<number, number[]>) for (let k = 0; k < 3; k++) R[k] += v[k] || 0;
  const mm = (x: number) => +(x * 1000).toFixed(3);
  // El mapa de colores EN TEXTO: una IA sin visión no lee una captura, y una con visión no saca
  // números de una escala de colores. Se le da el máx/mín del campo que está a la vista.
  let campo: any = undefined;
  const nombre = W().__hekatanSettings?.()?.shellResults?.val;
  const vals = nombre && nombre !== "none" ? W().__hekatanStates?.analyzeOutputs?.val?.[nombre] : null;
  if (vals instanceof Map && vals.size) {
    let lo = Infinity, hi = -Infinity, eLo = -1, eHi = -1;
    for (const [e, v] of vals as Map<number, number | number[]>)
      for (const x of (Array.isArray(v) ? v : [v])) if (Number.isFinite(x)) {
        if (x < lo) { lo = x; eLo = e; } if (x > hi) { hi = x; eHi = e; }
      }
    if (Number.isFinite(lo)) campo = { campo: nombre, minimo: +lo.toPrecision(5), elemento_min: eLo, maximo: +hi.toPrecision(5), elemento_max: eHi,
      unidades: "kN, m (momentos kN·m/m, fuerzas kN/m, tensiones kN/m²)" };
  }
  return {
    ...(campo ? { mapa_de_colores: campo } : {}),
    // el nudo es el índice interno (0, 1, 2…), no el id del .heks
    ux_max_mm: mm(max[0]), indice_nudo_ux: nudo[0],
    uy_max_mm: mm(max[1]), indice_nudo_uy: nudo[1],
    uz_max_mm: mm(max[2]), indice_nudo_uz: nudo[2],
    suma_reacciones_kN: { Fx: +R[0].toFixed(2), Fy: +R[1].toFixed(2), Fz: +R[2].toFixed(2) },
  };
}

function listaParametros() {
  const defs = W().__hekatanParamDefs?.() ?? {};
  const vivos = W().__hekatanGetParams?.() ?? {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(vivos)) {
    const d: any = (defs as any)[k];
    // Compacto: una plantilla trae ~100 parámetros y con etiquetas largas se comía el
    // contexto de un modelo local (4096 tokens en Ollama) y olvidaba el pedido.
    const et = d?.label ? String(d.label).slice(0, 28) : "";
    const ops = d?.options ? Object.entries(d.options) : [];
    const op = ops.length && ops.length <= 4 ? "; " + ops.map(([n, x]) => `${x}=${String(n).slice(0, 14)}`).join(", ") : "";
    out[k] = et || op ? `${v} (${et}${op})` : String(v);
  }
  return out;
}

async function ejecutar(nombre: string, a: any): Promise<any> {
  switch (nombre) {
    case "obtener_modelo": {
      const ex = W().__hekatanExample?.();
      const r: any = { plantilla: ex, ...contarModelo() };
      if (ex === "cli-modeler") r.script = String(W().__hekatanCliScript ?? "").slice(0, 3000);
      else if (ex) r.parametros = listaParametros();
      return r;
    }
    case "listar_plantillas": {
      const todas: any[] = W().__hekatanExamples ?? [];
      const f = String(a?.filtro ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      const hit = todas.filter((e) => !f || `${e.id} ${e.name} ${e.category}`.toLowerCase()
        .normalize("NFD").replace(/[̀-ͯ]/g, "").includes(f));
      return { total: hit.length, plantillas: hit.slice(0, 30).map((e) => `${e.id} — ${e.name} [${e.category}]`) };
    }
    case "cargar_plantilla": {
      const id = String(a?.id ?? "");
      if (!(W().__hekatanExamples ?? []).some((e: any) => e.id === id))
        return { error: `no existe la plantilla '${id}'. Usa listar_plantillas.` };
      historial.push(foto());
      await abrirEjemplo(id);
      const avisos = await ponerParametros(a?.parametros);
      return {
        ok: true, plantilla: id, ...contarModelo(), avisos, parametros: listaParametros(),
        siguiente: avisos.length
          ? "Hay claves que no existen. Llama cambiar_parametros usando SOLO claves de 'parametros'."
          : "Ajusta con cambiar_parametros si hace falta y luego llama resultados.",
      };
    }
    case "cambiar_parametros": {
      historial.push(foto());
      const avisos = await ponerParametros(a?.parametros);
      return {
        ok: avisos.length === 0, avisos, ...contarModelo(),
        ...(avisos.length ? { claves_validas: Object.keys(W().__hekatanGetParams?.() ?? {}) } : {}),
      };
    }
    case "modelar_heks": {
      let script = String(a?.script ?? "").replace(/^```[a-z]*\n?/i, "").replace(/\n?```\s*$/, "");
      if (a?.modo === "agregar") {
        const ex = W().__hekatanExample?.();
        const base = ex === "cli-modeler" ? String(W().__hekatanCliScript ?? "") : String(W().__hekatanModeloAHeks?.() ?? "");
        script = base.replace(/^\s*solve\s*$/gim, "") + "\n" + script;
      }
      if (!/^\s*solve\s*$/im.test(script)) script += "\nsolve";
      historial.push(foto());
      W().__hekatanCliStats = null;
      W().__hekatanCliScript = script;
      await abrirEjemplo("cli-modeler");
      for (let i = 0; i < 20 && !W().__hekatanCliStats; i++) await espera(100);
      const st = W().__hekatanCliStats ?? {};
      const err: string[] = W().__hekatanCliErrors ?? [];
      return {
        nudos: st.nodes, barras: st.frames, cascaras: st.shells, apoyos: st.supports, cargas: st.loads,
        resuelto: !!st.solved, uz_max_mm: st.maxUzMm, suma_Rz_kN: st.sumRz,
        errores: err.slice(0, 8),
      };
    }
    case "resultados":
      return leerResultados();
    case "analisis_modal": {
      const antes = W().__hekatanModalResults?.();
      if (typeof W().__hekatanRunModalAnimate !== "function") return { error: "esta plantilla no tiene análisis modal" };
      W().__hekatanRunModalAnimate();
      let out: any = null;
      for (let i = 0; i < 100; i++) {
        await espera(150);
        const r = W().__hekatanModalResults?.();
        if (r && r !== antes && r.frequencies?.length) { out = r; break; }
      }
      if (!out) return { error: "el modal no devolvió modos (¿modelo sin masa o sin apoyos?)" };
      const n = Math.min(6, out.frequencies.length);
      const modos = [];
      for (let m = 0; m < n; m++) {
        const f = out.frequencies[m];
        const p = out.massParticipation?.[m] ?? [];
        modos.push({
          modo: m + 1, T_s: +(1 / f).toFixed(4),
          UX: +((p[0] ?? 0) * 100).toFixed(1), UY: +((p[1] ?? 0) * 100).toFixed(1), RZ: +((p[5] ?? 0) * 100).toFixed(1),
        });
      }
      return { modos, nota: "UX/UY/RZ = % de masa participante" };
    }
    case "vista": {
      const s = W().__hekatanSettings?.();
      if (a?.deformada !== undefined && s?.deformedShape) s.deformedShape.val = !!a.deformada;
      if (a?.campo_cascara && s?.shellResults) s.shellResults.val = a.campo_cascara;
      if (a?.camara) W().__hekatanSetView?.(a.camara);
      await cuadro();
      return { ok: true };
    }
    case "deshacer": {
      const f = historial.pop();
      if (!f?.ex) return { error: "no hay nada que deshacer" };
      if (f.ex === "cli-modeler") W().__hekatanCliScript = f.script;
      await abrirEjemplo(f.ex);
      if (f.ex !== "cli-modeler") {
        const vivos = W().__hekatanParams?.();
        if (vivos) { Object.assign(vivos, f.params); W().__hekatanRebuild?.(); await cuadro(); }
      }
      return { ok: true, plantilla: f.ex, ...contarModelo() };
    }
  }
  return { error: `herramienta desconocida: ${nombre}` };
}

// ─────────────────────────────────────────────────────────────────────
// Bucle del agente
// ─────────────────────────────────────────────────────────────────────

type Msg = { role: string; content?: string | null; tool_calls?: any[]; tool_call_id?: string };

const MAX_PASOS = 14;
const conversacion: Msg[] = [];

// Lo que el usuario adjunto para el PROXIMO mensaje (se vacia al enviarlo).
let bandeja: Adjunto[] = [];
let pintarBandeja: () => void = () => {};

/**
 * El modelo se satura y contesta 503 «high demand» (o 429, que es la cuota por
 * minuto). No es culpa de la clave ni del programa, y se arregla esperando o
 * cambiando de modelo — asi que lo hace el agente solo.
 *
 * Jorge, 21-sep-2026: «Gemini 503 UNAVAILABLE» en mitad de la demostracion.
 *
 *   1. reintenta el MISMO modelo, esperando cada vez mas (2 s, 5 s, 12 s);
 *   2. si sigue caido, pasa al siguiente de la lista del proveedor y avisa.
 */
const REINTENTOS = [2000, 5000, 12000];
const SATURADO = new Set([429, 500, 502, 503, 504]);

let modeloActual = "";

async function llamarConAguante(p: AgentProvider, modelo: string, clave: string, señal: AbortSignal) {
  const cola = [modelo, ...p.modelos.filter((m) => m !== modelo)];
  let ultimo: any = null;
  for (let i = 0; i < cola.length; i++) {
    for (let r = 0; r <= REINTENTOS.length; r++) {
      try {
        const msg = await llamarModelo(p, cola[i], clave, señal);
        if (cola[i] !== modeloActual) {
          modeloActual = cola[i];
          if (i > 0) {
            burbuja("paso", `El modelo estaba saturado; sigo con ${cola[i]}.`);
            aiStorage.setModel(`agente_${p.id}`, cola[i]);
            const caja = document.getElementById("hk-agente-modelo") as HTMLInputElement | null;
            if (caja) caja.value = cola[i];
          }
        }
        return msg;
      } catch (e: any) {
        if (e?.name === "AbortError") throw e;
        ultimo = e;
        const cod = parseInt((String(e?.message ?? "").match(/\b(\d{3})\b/) ?? [])[1] ?? "0", 10);
        // un 404 es un modelo retirado (le paso a gemini-2.5-flash el 21-sep-2026:
        // «no longer available to new users»): no se reintenta, pero SÍ se prueba
        // el siguiente de la lista. Un 401 es la clave: ahí no hay nada que hacer.
        if (cod === 404 && i < cola.length - 1) break;
        if (!SATURADO.has(cod)) throw e;                 // 401 y demás: esperar no arregla nada
        if (r === REINTENTOS.length) break;              // agotado: al siguiente modelo
        burbuja("paso", `El modelo está saturado (${cod}). Reintento en ${REINTENTOS[r] / 1000} s…`);
        await new Promise((ok, mal) => {
          const t = setTimeout(ok, REINTENTOS[r]);
          señal.addEventListener("abort", () => { clearTimeout(t); mal(new DOMException("", "AbortError")); }, { once: true });
        });
      }
    }
  }
  throw ultimo ?? new Error("sin respuesta");
}

async function llamarModelo(p: AgentProvider, modelo: string, clave: string, señal: AbortSignal) {
  const cab: Record<string, string> = { "content-type": "application/json" };
  if (p.clave) cab["Authorization"] = `Bearer ${clave}`;
  if (p.id === "openrouter") {
    cab["HTTP-Referer"] = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/";
    cab["X-Title"] = "Hekatan Struct";
  }
  // Ollama por su API NATIVA: la compatible con OpenAI no deja subir `num_ctx` y se queda en
  // 4096 tokens; con el prompt, las herramientas y dos resultados el modelo perdía el pedido.
  const nativo = p.id === "ollama";
  const mensajes = [{ role: "system", content: SYSTEM_PROMPT }, ...conversacion];
  const cuerpo = nativo
    ? {
        model: modelo, stream: false, options: { temperature: 0.1, num_ctx: 16384 },
        tools: TOOLS.map((t) => ({ type: "function", function: t })),
        messages: mensajes.map((m) => m.tool_calls ? {
          ...m, tool_calls: m.tool_calls.map((c) => ({ function: {
            name: c.function.name,
            arguments: typeof c.function.arguments === "string" ? JSON.parse(c.function.arguments || "{}") : c.function.arguments,
          } })),
        } : m),
      }
    : {
        model: modelo, messages: mensajes, temperature: 0.1, tool_choice: "auto",
        tools: TOOLS.map((t) => ({ type: "function", function: t })),
      };
  const r = await fetch(nativo ? "http://localhost:11434/api/chat" : p.url, {
    method: "POST", headers: cab, signal: señal, body: JSON.stringify(cuerpo),
  }).catch((e) => {
    if (e?.name === "AbortError") throw e;
    if (p.id === "ollama") {
      // Ollama solo acepta peticiones del PROPIO localhost. Desde el sitio
      // publico (github.io) contesta 403 y el navegador lo da como fallo de red:
      // parece «no responde» cuando en realidad esta corriendo y rechaza el
      // origen (medido el 21-sep-2026: localhost 200, github.io 403).
      const fuera = location.protocol !== "file:" &&
                    !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
      // Desde un sitio PUBLICO no se puede llegar a Ollama aunque este corriendo
      // y aunque se le den permisos: Chrome/Edge bloquean que una web publica
      // alcance la red local si el servidor no devuelve
      // `Access-Control-Allow-Private-Network: true`, y Ollama no la envia
      // (medido el 21-sep-2026: CORS 204 correcto y aun asi «Failed to fetch»).
      // Es Private Network Access, una proteccion del navegador, no un ajuste.
      throw new Error(fuera
        ? "Desde el sitio público el navegador NO deja llegar a Ollama de tu PC " +
          "(protección de red privada de Chrome/Edge), aunque Ollama esté abierto. " +
          "Opciones: abre Hekatan Struct en local, o elige aquí arriba un proveedor " +
          "en la nube (Gemini tiene clave gratis en aistudio.google.com/apikey)."
        : "Ollama no responde en localhost:11434. Ábrelo o instala: ollama.com → ollama pull qwen2.5:7b");
    }
    throw new Error(`sin conexión con ${p.nombre}: ${e?.message ?? e}`);
  });
  if (!r.ok) {
    const txt = (await r.text()).slice(0, 400);
    if (p.id === "ollama" && r.status === 404) throw new Error(`Modelo «${modelo}» no instalado: ollama pull ${modelo}`);
    if (p.id === "ollama" && r.status === 403)
      throw new Error("Ollama rechaza a " + location.origin + ". Dale permiso: " +
                      "setx OLLAMA_ORIGINS \"" + location.origin + "\" y reinicia Ollama.");
    throw new Error(`${p.nombre} ${r.status}: ${txt}`);
  }
  const j = await r.json();
  if (nativo) {
    const m = j.message ?? { role: "assistant", content: "" };
    if (m.tool_calls?.length) m.tool_calls = m.tool_calls.map((c: any, i: number) => ({
      id: c.id ?? `t${Date.now()}${i}`, type: "function",
      function: { name: c.function.name, arguments: JSON.stringify(c.function.arguments ?? {}) },
    }));
    return m;
  }
  return j.choices?.[0]?.message ?? { role: "assistant", content: "" };
}

/** Modelos locales pequeños a veces escriben la llamada como TEXTO en vez de `tool_calls`. */
function llamadasEnTexto(txt: string): any[] {
  const out: any[] = [];
  const re = /\{[^{}]*"name"\s*:\s*"([a-z_]+)"[^{}]*"arguments"\s*:\s*(\{[\s\S]*?\})\s*\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(txt))) {
    if (!TOOLS.some((t) => t.name === m![1])) continue;
    out.push({ id: `t${Date.now()}${out.length}`, type: "function", function: { name: m[1], arguments: m[2] } });
  }
  return out;
}

function resumenResultado(nombre: string, r: any): string {
  if (r?.error) return `✗ ${r.error}`;
  switch (nombre) {
    case "listar_plantillas": return `${r.total} plantillas`;
    case "cargar_plantilla":
    case "cambiar_parametros":
    case "deshacer":
      return `${r.nudos} nudos · ${r.barras} barras · ${r.cascaras} cáscaras` + (r.avisos?.length ? ` · ⚠ ${r.avisos[0]}` : "");
    case "modelar_heks":
      return `${r.nudos} nudos · ${r.barras} barras · ${r.cascaras} cáscaras · Uz ${r.uz_max_mm} mm · ΣRz ${r.suma_Rz_kN} kN`
        + (r.errores?.length ? ` · ⚠ ${r.errores.length} errores` : "");
    case "resultados": return `Uz ${r.uz_max_mm} mm · Ux ${r.ux_max_mm} mm · ΣFz ${r.suma_reacciones_kN?.Fz} kN`
      + (r.mapa_de_colores ? ` · ${r.mapa_de_colores.campo} ${r.mapa_de_colores.minimo}…${r.mapa_de_colores.maximo}` : "");
    case "analisis_modal": return r.modos?.slice(0, 3).map((m: any) => `T${m.modo} = ${m.T_s} s`).join(" · ");
    case "obtener_modelo": return `${r.plantilla ?? "vacío"} · ${r.nudos ?? 0} nudos`;
    default: return "✓";
  }
}

// ─────────────────────────────────────────────────────────────────────
// Ventana flotante
// ─────────────────────────────────────────────────────────────────────

let ventana: HTMLDivElement | null = null;
let lista: HTMLDivElement;
let entrada: HTMLTextAreaElement;
let btnEnviar: HTMLButtonElement;
let control: AbortController | null = null;

/** Al cargar una plantilla el workspace limpia los flotantes del body y se llevaba la
 *  ventana a mitad de la tarea. Se la vuelve a colgar tal cual (con su conversación). */
function reenganchar() {
  if (ventana && !document.body.contains(ventana)) document.body.appendChild(ventana);
}

function burbuja(clase: "user" | "ia" | "paso" | "error", texto: string) {
  reenganchar();
  const d = document.createElement("div");
  const estilos: Record<string, string> = {
    user: "align-self:flex-end;background:#0e7490;color:#fff;border-radius:10px 10px 2px 10px;",
    ia: "align-self:flex-start;background:#1f2937;color:#e5e7eb;border-radius:10px 10px 10px 2px;",
    paso: "align-self:stretch;background:#111827;color:#93c5fd;border-left:3px solid #22d3ee;font-family:Consolas,monospace;font-size:11px;",
    error: "align-self:stretch;background:#3f1d1d;color:#fca5a5;border-left:3px solid #ef4444;",
  };
  d.style.cssText = "padding:6px 9px;max-width:92%;white-space:pre-wrap;word-break:break-word;line-height:1.35;" + estilos[clase];
  d.textContent = texto;
  lista.appendChild(d);
  lista.scrollTop = lista.scrollHeight;
  return d;
}

function argsCortos(a: any): string {
  const s = JSON.stringify(a ?? {});
  if (a?.script) return `(${String(a.script).split("\n").filter((l) => l.trim() && !l.trim().startsWith("#")).length} líneas .heks)`;
  return s.length > 90 ? s.slice(0, 87) + "…" : s;
}

async function enviar() {
  const texto = entrada.value.trim();
  if (!texto || control) return;
  const pid = aiStorage.getProvider();
  const p = PROVEEDORES.find((x) => x.id === pid) ?? PROVEEDORES[0];
  const clave = aiStorage.getKey(p.id);
  const modelo = aiStorage.getModel(`agente_${p.id}`) || p.modelos[0];
  if (p.clave && !clave) { burbuja("error", `${p.nombre} necesita clave. ${p.pista}`); return; }

  entrada.value = "";
  burbuja("user", texto);
  const adj = bandeja;
  bandeja = [];
  pintarBandeja();
  conversacion.push(mensajeCon(texto, adj) as Msg);
  control = new AbortController();
  btnEnviar.textContent = "■ Parar";
  const pensando = burbuja("ia", "…");
  // Barandas para modelos pequeños: no dejarlo cerrar sin haber comprobado lo que modeló.
  const MODIFICAN = new Set(["cargar_plantilla", "cambiar_parametros", "modelar_heks"]);
  let modifico = false, verifico = false, empujones = 0;
  try {
    for (let paso = 0; paso < MAX_PASOS; paso++) {
      const msg = await llamarConAguante(p, modelo, clave, control.signal);
      let calls: any[] = msg.tool_calls ?? [];
      if (!calls.length && msg.content) calls = llamadasEnTexto(msg.content);
      conversacion.push({ role: "assistant", content: calls.length ? (msg.content ?? "") : msg.content, tool_calls: calls.length ? calls : undefined });
      if (!calls.length && modifico && !verifico && empujones < 2) {
        empujones++;
        conversacion.push({ role: "user", content:
          "(Hekatan) Todavía no comprobaste el modelo. Corrige los avisos con cambiar_parametros si los hubo, " +
          "llama resultados (y analisis_modal si se pidió el periodo) y responde en 2-4 líneas con esos números." });
        continue;
      }
      if (!calls.length) {
        pensando.remove();
        responder((msg.content ?? "").trim() || "(sin respuesta)");
        return;
      }
      for (const c of calls) {
        let a: any = {};
        try { a = typeof c.function.arguments === "string" ? JSON.parse(c.function.arguments || "{}") : c.function.arguments; }
        catch { a = null; }
        const fila = burbuja("paso", `🔧 ${c.function.name} ${a ? argsCortos(a) : "(argumentos inválidos)"}`);
        lista.insertBefore(fila, pensando);
        let r: any;
        try { r = a ? await ejecutar(c.function.name, a) : { error: "JSON de argumentos inválido" }; }
        catch (e: any) { r = { error: String(e?.message ?? e) }; }
        reenganchar();
        fila.textContent += `\n   → ${resumenResultado(c.function.name, r)}`;
        if (MODIFICAN.has(c.function.name)) { modifico = true; verifico = false; }
        if (c.function.name === "resultados" || c.function.name === "analisis_modal") verifico = true;
        conversacion.push({ role: "tool", tool_call_id: c.id, content: JSON.stringify(r).slice(0, 6000) });
      }
    }
    pensando.remove();
    burbuja("error", `Paré tras ${MAX_PASOS} pasos. Pídeme que siga si hace falta.`);
  } catch (e: any) {
    pensando.remove();
    if (e?.name !== "AbortError") burbuja("error", String(e?.message ?? e));
    else burbuja("error", "Detenido.");
  } finally {
    control = null;
    btnEnviar.textContent = "Enviar ▶";
  }
}

/**
 * La respuesta final. Si trae formulas NO se vuelca en la burbuja: ahi se leia
 * el LaTeX en crudo («$f'_c = 240\text{ kgf/cm}^2$»). Va a la HOJA de la
 * izquierda, compuesta, y en el chat queda solo el aviso y la primera linea.
 * Jorge, 21-sep-2026: «que no explique asi, siempre en Hekatan LISP».
 */
function responder(texto: string) {
  if (!tieneFormulas(texto)) { burbuja("ia", texto); return; }
  abrirHoja(tituloHoja(texto), texto);
  const primera = texto.split("\n").map((l) => l.trim())
    .find((l) => l && !/^[#*\-]/.test(l) && !l.includes("$")) ?? "";
  const d = burbuja("ia", (primera ? primera + "\n" + "\n" : "") +
                          "\ud83d\udcc4 La explicaci\u00f3n, con las f\u00f3rmulas, est\u00e1 en la hoja de la izquierda.");
  const b = document.createElement("button");
  b.textContent = "Abrir la hoja \u25b8";
  b.style.cssText = "margin-top:6px;background:#13314f;color:#e8eef5;border:1px solid #2b5480;" +
                    "border-radius:5px;padding:3px 8px;font-size:12px;cursor:pointer;display:block;";
  b.onclick = () => abrirHoja(tituloHoja(texto), texto);
  d.appendChild(b);
}

/** El titulo de la hoja: el primer encabezado, o algo corto de la primera linea. */
function tituloHoja(t: string): string {
  const h = t.match(/^\s*#{1,3}\s+(.+)$/m);
  if (h) return h[1].replace(/[*`$]/g, "").trim().slice(0, 60);
  const l = t.split("\n").map((x) => x.trim()).find(Boolean) ?? "";
  return l.replace(/[*`$]/g, "").slice(0, 60) || "Hoja \u00b7 Hekatan LISP";
}

/**
 * Ollama SOLO si de verdad esta corriendo aqui.
 *
 * Jorge, 21-sep-2026: «no pongas Ollama por defecto, sino si esta local».
 * Y tiene razon: Ollama era el primero de la lista, asi que un ingeniero que
 * abria el agente se encontraba un proveedor que no tiene instalado, veia un
 * fallo de red y se iba pensando que el agente no funciona.
 *
 * Se le pregunta a Ollama si esta ahi (una peticion corta a su puerto). Si
 * contesta, se deja elegido; si no, se pasa a Gemini, que es el que cualquiera
 * puede usar con una clave gratis.
 *
 * Desde el sitio PUBLICO no se puede llegar a Ollama aunque este corriendo
 * (Chrome bloquea publico -> localhost), asi que alli ni se intenta.
 */
async function ollamaEstaAqui(): Promise<boolean> {
  const local = location.protocol === "file:" ||
                /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if (!local) return false;
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 900);
    const r = await fetch("http://localhost:11434/api/tags", { signal: c.signal });
    clearTimeout(t);
    return r.ok;
  } catch { return false; }
}

function crearVentana() {
  const v = document.createElement("div");
  v.id = "hk-agente-ia";
  v.style.cssText = [
    "position:fixed", "right:16px", "bottom:96px", "width:380px", "height:540px", "max-height:calc(100vh - 150px)",
    "max-width:calc(100vw - 32px)", "z-index:9000", "display:flex", "flex-direction:column",
    "background:#0b1220", "border:1px solid #334155", "border-radius:10px",
    "box-shadow:0 12px 40px rgba(0,0,0,.5)", "font:13px system-ui,Segoe UI,sans-serif", "color:#e5e7eb",
  ].join(";");

  const cab = document.createElement("div");
  cab.style.cssText = "display:flex;align-items:center;gap:6px;padding:8px 10px;border-bottom:1px solid #1e293b;cursor:move;flex-shrink:0;";
  cab.innerHTML = `<b style="flex:1">🤖 Agente IA · Hekatan Struct</b>`;
  const cerrar = document.createElement("button");
  cerrar.textContent = "✕";
  cerrar.title = "Cerrar";
  cerrar.style.cssText = "background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;";
  cerrar.onclick = () => { v.style.display = "none"; sincronizarBotonesFlotantes(); };
  cab.appendChild(cerrar);

  // Proveedor · modelo · clave (compartidos con el panel de IA por localStorage)
  const conf = document.createElement("div");
  conf.style.cssText = "display:flex;flex-wrap:wrap;gap:4px;padding:6px 10px;border-bottom:1px solid #1e293b;flex-shrink:0;";
  const ctrl = "background:#111827;color:#e5e7eb;border:1px solid #334155;border-radius:4px;padding:3px 5px;font-size:12px;";
  const selP = document.createElement("select");
  selP.style.cssText = ctrl + "flex:1 1 120px;";
  for (const p of PROVEEDORES) selP.add(new Option(p.nombre, p.id));
  const inM = document.createElement("input");
  inM.id = "hk-agente-modelo";
  inM.style.cssText = ctrl + "flex:1 1 140px;";
  inM.setAttribute("list", "hk-agente-modelos");
  const dl = document.createElement("datalist");
  dl.id = "hk-agente-modelos";
  const inK = document.createElement("input");
  // ⚠️ Las teclas NO pueden llegar a los atajos del CAD: si el foco se escapa,
  // la clave acaba escrita en la linea de ordenes, a la vista de todos.
  ["keydown", "keyup", "keypress", "paste"].forEach((ev) =>
    inK.addEventListener(ev, (e) => e.stopPropagation()));
  inK.type = "password";
  inK.placeholder = "API key";
  inK.style.cssText = ctrl + "flex:1;";
  const ojo = document.createElement("button");
  ojo.type = "button";
  ojo.textContent = "👁";
  ojo.title = "Ver la clave un momento (se vuelve a ocultar sola a los 8 s)";
  ojo.style.cssText = "background:#1e293b;color:#94a3b8;border:1px solid #334155;" +
                      "border-radius:4px;padding:2px 8px;cursor:pointer;";
  let ocultarLuego: any = null;
  ojo.onclick = () => {
    const ver = inK.type === "password";
    inK.type = ver ? "text" : "password";
    ojo.textContent = ver ? "🙈" : "👁";
    clearTimeout(ocultarLuego);
    // se vuelve a tapar sola: una clave a la vista en una grabacion es un regalo
    if (ver) ocultarLuego = setTimeout(() => { inK.type = "password"; ojo.textContent = "👁"; }, 8000);
  };
  const filaK = document.createElement("div");
  filaK.style.cssText = "display:flex;gap:4px;flex:1 1 100%;";
  filaK.append(inK, ojo);
  const pista = document.createElement("div");
  pista.style.cssText = "flex:1 1 100%;color:#64748b;font-size:11px;";
  const refrescar = () => {
    const p = PROVEEDORES.find((x) => x.id === selP.value) ?? PROVEEDORES[0];
    dl.innerHTML = p.modelos.map((m) => `<option value="${m}">`).join("");
    inM.value = aiStorage.getModel(`agente_${p.id}`) || p.modelos[0];
    inK.style.display = p.clave ? "" : "none";
    ojo.style.display = p.clave ? "" : "none";
    filaK.style.display = p.clave ? "flex" : "none";
    inK.value = aiStorage.getKey(p.id);
    pista.textContent = p.pista;
  };
  const pidGuardado = aiStorage.getProvider();
  // Si el usuario ya eligio, se respeta. Si no, Gemini — y solo se cambia a
  // Ollama cuando se comprueba que esta corriendo en esta misma maquina.
  selP.value = PROVEEDORES.some((p) => p.id === pidGuardado) ? pidGuardado : "gemini";
  if (!PROVEEDORES.some((p) => p.id === pidGuardado)) {
    ollamaEstaAqui().then((hay) => {
      if (hay && selP.value === "gemini") { selP.value = "ollama"; refrescar(); }
    });
  }
  selP.onchange = () => { aiStorage.setProvider(selP.value); refrescar(); };
  inM.onchange = () => aiStorage.setModel(`agente_${selP.value}`, inM.value.trim());
  const guardarClave = () => {
    const v = inK.value.trim();
    aiStorage.setKey(selP.value, v);
    if (!v) { pista.textContent = "Falta la clave."; pista.style.color = "#f59e0b"; return; }
    pista.textContent = "✓ Clave guardada en este navegador (no se envía a ningún sitio).";
    pista.style.color = "#5ecb92";
  };
  inK.onchange = guardarClave;
  inK.oninput = guardarClave;          // al pegar tambien, sin esperar al foco
  inK.addEventListener("paste", () => setTimeout(guardarClave, 0));
  conf.append(selP, inM, dl, filaK, pista);
  refrescar();

  lista = document.createElement("div");
  lista.style.cssText = "flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding:10px;";

  const pie = document.createElement("div");
  pie.style.cssText = "display:flex;gap:6px;padding:8px 10px;border-top:1px solid #1e293b;flex-shrink:0;";
  entrada = document.createElement("textarea");
  entrada.rows = 2;
  entrada.placeholder = "Ej.: edificio de 4 pisos, 3×2 vanos de 5 m; dime la flecha y el periodo";
  entrada.style.cssText = ctrl + "flex:1;resize:none;font-size:13px;";
  // Que las teclas no lleguen a los atajos del CAD (1-4, Supr…)
  ["keydown", "keyup", "keypress"].forEach((ev) => entrada.addEventListener(ev, (e) => e.stopPropagation()));
  entrada.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); }
  });
  const col = document.createElement("div");
  col.style.cssText = "display:flex;flex-direction:column;gap:4px;";
  btnEnviar = document.createElement("button");
  btnEnviar.textContent = "Enviar ▶";
  btnEnviar.style.cssText = "background:#22d3ee;color:#000;border:none;border-radius:4px;padding:6px 10px;font-weight:600;cursor:pointer;";
  btnEnviar.onclick = () => { if (control) control.abort(); else enviar(); };
  const btnDeshacer = document.createElement("button");
  btnDeshacer.textContent = "↶ Deshacer";
  btnDeshacer.title = "Vuelve el modelo al estado anterior al último cambio del agente";
  btnDeshacer.style.cssText = "background:#334155;color:#e5e7eb;border:none;border-radius:4px;padding:4px 8px;cursor:pointer;font-size:12px;";
  btnDeshacer.onclick = async () => {
    if (control) return;
    const r = await ejecutar("deshacer", {});
    burbuja("paso", `↶ deshacer → ${resumenResultado("deshacer", r)}`);
  };
  const btnClip = document.createElement("button");
  btnClip.textContent = "📎";
  btnClip.title = "Adjuntar una imagen, un PDF o un texto: una página del libro, un plano, " +
                  "la formulación. El modelo LEE la imagen (no hace falta pasarla a texto).";
  btnClip.style.cssText = "background:#334155;color:#e5e7eb;border:none;border-radius:4px;" +
                          "padding:4px 8px;cursor:pointer;font-size:13px;";
  btnClip.onclick = async () => {
    const fs = await pedirArchivos();
    if (!fs.length) return;
    const nuevos = await leerArchivos(fs, (m) => burbuja("paso", "📎 " + m));
    bandeja = [...bandeja, ...nuevos];
    pintarBandeja();
  };
  col.append(btnEnviar, btnDeshacer, btnClip);

  // la tira con lo adjuntado, para saber qué va a viajar y poder quitarlo
  const tira = document.createElement("div");
  tira.style.cssText = "display:none;flex-wrap:wrap;gap:4px;padding:4px 10px;" +
                       "border-top:1px solid #1e293b;flex-shrink:0;";
  pintarBandeja = () => {
    tira.innerHTML = "";
    tira.style.display = bandeja.length ? "flex" : "none";
    bandeja.forEach((a, i) => {
      const c = document.createElement("span");
      c.style.cssText = "background:#1e293b;border:1px solid #334155;border-radius:4px;" +
                        "padding:1px 6px;font-size:11px;color:#cbd5e1;cursor:pointer;";
      c.textContent = (a.tipo === "imagen" ? "🖼 " : "📄 ") +
                      a.nombre.slice(0, 26) + " ×";
      c.title = "Quitar";
      c.onclick = () => { bandeja.splice(i, 1); pintarBandeja(); };
      tira.appendChild(c);
    });
  };

  pie.append(entrada, col);

  v.append(cab, conf, lista, tira, pie);
  document.body.appendChild(v);

  // Arrastrar por la cabecera
  let dx = 0, dy = 0, arr = false;
  cab.addEventListener("pointerdown", (e) => {
    if ((e.target as HTMLElement).tagName === "BUTTON") return;
    arr = true;
    const r = v.getBoundingClientRect();
    dx = e.clientX - r.left; dy = e.clientY - r.top;
    cab.setPointerCapture(e.pointerId);
  });
  cab.addEventListener("pointermove", (e) => {
    if (!arr) return;
    v.style.left = Math.max(0, e.clientX - dx) + "px";
    v.style.top = Math.max(0, e.clientY - dy) + "px";
    v.style.right = "auto"; v.style.bottom = "auto";
  });
  cab.addEventListener("pointerup", () => { arr = false; });

  burbuja("ia", "Hola. Pídeme una estructura y la armo en el visor, paso a paso: plantilla o .heks, cálculo, resultados y modal.");
  return v;
}

/** Abre (o trae al frente) la ventana del agente. Idempotente. */
/**
 * Los botones flotantes (🤖 y 📋) viven en la misma esquina que el panel del
 * agente y le caian ENCIMA de «Enviar»: con el panel abierto no se podia
 * enviar nada (Jorge, 21-sep-2026). Mientras el panel este abierto, se esconden.
 */
export function sincronizarBotonesFlotantes() {
  const abierto = !!ventana && ventana.style.display !== "none" &&
                  document.body.contains(ventana);
  for (const id of ["hk-agente-lanzador", "hk-caja-negra-btn"]) {
    const el = document.getElementById(id);
    if (el) (el as HTMLElement).style.display = abierto ? "none" : "block";
  }
  // El de «Explícame» solo se esconde: quien decide si debe verse es `mirar()`,
  // que mira si hay resultados.
  const ex = document.getElementById("hk-agente-explicar") as HTMLElement | null;
  if (ex && abierto) ex.style.display = "none";
}

export function abrirAgenteIA(textoInicial?: string) {
  reenganchar();
  if (!ventana) ventana = crearVentana();
  ventana.style.display = "flex";
  sincronizarBotonesFlotantes();
  setTimeout(() => {
    try {
      const k = ventana!.querySelector('input[type="password"]') as HTMLInputElement | null;
      if (k && !k.value) { k.focus(); return; }
      entrada?.focus();
    } catch { /* el panel aun no esta listo */ }
  }, 60);
  if (textoInicial) entrada.value = textoInicial;
  entrada.focus();
}

/**
 * Sube el botón por encima de la barra inferior del CAD (consola + línea de
 * órdenes + estado). Con `bottom` fijo el icono salía cortado por la mitad:
 * esa barra cambia de alto según las líneas de la consola y según la pantalla.
 *
 * No se busca por id — la barra la montan varios módulos — sino midiendo: se
 * mira qué elementos fijos tocan el fondo de la ventana y se deja el botón
 * encima del más alto de ellos.
 */
function subirSobreLaBarraInferior(b: HTMLElement) {
  const recolocar = () => {
    // No se busca la barra por id ni por `position`: se PREGUNTA al navegador
    // quien esta encima del boton. Buscar elementos fijos fallaba porque la barra
    // del CAD no es `fixed`, y el boton quedaba debajo, cortado por la mitad.
    const alto = window.innerHeight;
    const ex = document.getElementById("hk-agente-explicar") as HTMLElement | null;
    const mio = (el: Element | null) => !!el && (el === b || el === ex || b.contains(el));
    // ⚠️ `elementFromPoint` NO ve los elementos con `pointer-events: none`
    // (la barra «CAD listo» y la leyenda del colormap lo llevan): los atraviesa
    // y devuelve lo de debajo. Con esas hay que cruzar RECTANGULOS.
    const invisiblesAlRaton = ["#hk-cad-status", "#legend", "#hk3-cmdline"];
    const chocaConBarra = (r: DOMRect) => invisiblesAlRaton.some((sel) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) return false;
      const q = el.getBoundingClientRect();
      if (q.width <= 0 || q.height <= 0) return false;
      const m = 6;   // un poco de aire, que no queden pegados
      return !(r.right + m < q.left || q.right < r.left - m ||
               r.bottom + m < q.top || q.bottom < r.top - m);
    });
    for (let px = 18; px < alto * 0.7; px += 12) {
      b.style.bottom = px + "px";
      if (ex) ex.style.bottom = px + "px";
      const r = b.getBoundingClientRect();
      if (chocaConBarra(r)) continue;
      // y los que SI responden al raton, por punto
      const arriba = document.elementFromPoint(r.x + r.width / 2, r.y + 4);
      const medio = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      const abajo = document.elementFromPoint(r.x + r.width / 2, r.bottom - 4);
      if (mio(arriba) && mio(medio) && mio(abajo)) return;   // libre
    }
    b.style.bottom = "120px";   // no se encontro hueco: valor de emergencia
  };
  recolocar();
  // ⚠️ NADA de ResizeObserver sobre el body: `recolocar` mueve el boton, eso
  // cambia el layout, el observer vuelve a disparar y se monta un bucle que come
  // CPU y deja la pagina pegada — con el visor 3D eso es «no se puede girar»
  // (Jorge, 20-sep-2026). Basta con el resize de ventana y unos reintentos.
  window.addEventListener("resize", recolocar);
  setTimeout(recolocar, 400);
  setTimeout(recolocar, 1500);
  setTimeout(recolocar, 4000);
}

/** Botón redondo 🤖 siempre a mano (el panel de IA queda plegado dentro del CAD). Idempotente. */
export function montarLanzadorAgente() {
  reenganchar();
  if (document.getElementById("hk-agente-lanzador")) return;
  const b = document.createElement("button");
  b.id = "hk-agente-lanzador";
  b.textContent = "🤖";
  b.title = "Agente IA: pídele una estructura y la modela";
  b.style.cssText = [
    "position:fixed", "right:16px", "bottom:100px", "z-index:9600", "width:44px", "height:44px",
    "border-radius:50%", "border:1px solid #22d3ee", "background:#0b1220", "font-size:22px",
    "cursor:pointer", "box-shadow:0 4px 14px rgba(0,0,0,.4)",
  ].join(";");
  subirSobreLaBarraInferior(b);
  b.onclick = () => {
    if (ventana && ventana.style.display !== "none" && document.body.contains(ventana)) {
      ventana.style.display = "none";
      sincronizarBotonesFlotantes();
    }
    else abrirAgenteIA();
  };
  document.body.appendChild(b);
  montarBotonExplicar();
}

/**
 * Botón «💬 Explícame» AL LADO del 🤖, y solo cuando el modelo YA ESTÁ CORRIDO
 * (hay `deformOutputs.deformations`). Con el modelo vacío no hay nada que
 * explicar, así que se esconde en vez de dar un error después del clic.
 */
function montarBotonExplicar() {
  if (document.getElementById("hk-agente-explicar")) return;
  const e = document.createElement("button");
  e.id = "hk-agente-explicar";
  e.textContent = "💬 Explícame";
  e.title = "Que el agente lea el modelo y sus resultados y te los explique";
  e.style.cssText = [
    "position:fixed", "left:0", "top:0", "z-index:8999", "height:44px", "padding:0 14px",
    "border-radius:22px", "border:1px solid #22d3ee", "background:#0b1220", "color:#e2e8f0",
    "font:13px system-ui,sans-serif", "cursor:pointer", "box-shadow:0 4px 14px rgba(0,0,0,.4)",
    "display:none",
  ].join(";");
  e.onclick = () => {
    void pedirAlAgente(
      "Explícame este modelo ya calculado. Usa obtener_modelo y resultados, y dime en pocas " +
      "líneas: qué estructura es, qué cargas y apoyos tiene, cuánto se desplaza (dónde y cuánto), " +
      "si las reacciones equilibran la carga y si el resultado es razonable.",
    );
  };
  document.body.appendChild(e);
  // El workspace no avisa cuando termina de resolver: se mira el estado, que es
  // lo mismo que lee `leerResultados()` para el agente.
  const mirar = () => {
    const d = W().__hekatanStates?.deformOutputs?.val;
    const hay = !!d?.deformations?.size;
    e.style.display = hay ? "block" : "none";
    if (!hay) return;
    // Pegado a la IZQUIERDA del 🤖, midiendo su caja: el panel de parámetros de
    // la derecha se mueve (se pliega, cambia de ancho) y con `right:` fijo el
    // botón caía encima de los sliders.
    const b = document.getElementById("hk-agente-lanzador");
    if (!b) return;
    const r = b.getBoundingClientRect();
    // ⚠️ Con el 🤖 oculto (panel del agente abierto) su rect es 0×0 en la esquina:
    // sin esta guarda, «Explícame» saltaba arriba a la izquierda y tapaba la
    // barra de herramientas (Jorge, 21-sep-2026).
    if (r.width <= 0 || r.height <= 0) { e.style.display = "none"; return; }
    e.style.top = `${r.top}px`;
    e.style.left = `${Math.max(8, r.left - e.offsetWidth - 8)}px`;
  };
  mirar();
  setInterval(mirar, 1200);
}

/** Para pruebas y tutoriales: manda un pedido como si lo escribiera el usuario. */
export async function pedirAlAgente(texto: string) {
  abrirAgenteIA();
  entrada.value = texto;
  await enviar();
}

if (typeof window !== "undefined") {
  W().__hekatanAgenteIA = abrirAgenteIA;
  W().__hekatanPedirAgente = pedirAlAgente;
  W().__hekatanAgenteTool = ejecutar;
}
