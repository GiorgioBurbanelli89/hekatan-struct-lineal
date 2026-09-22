/**
 * guiaFem.ts — «📘 Guía de elementos finitos»: el tutor GUIADO de Hekatan Struct.
 *
 * Jorge, 22-sep-2026: «quiero que no sea por IA sino instrucciones que le vamos metiendo, o
 * preguntas que pueden surgir». Así que aquí NO hay modelo de lenguaje ni llamada a ningún
 * servidor: es un guion escrito, con sus preguntas y sus respuestas, y cada respuesta ABRE el
 * modelo que la demuestra y, si el ejemplo trae tutor, lo arranca.
 *
 * Tres bloques:
 *   1. El camino: de qué va el método, en el orden en que se estudia.
 *   2. Las preguntas que salen siempre (con su respuesta corta y el ejemplo que la enseña).
 *   3. Los bancos de prueba del paper de Ibrahimbegović, Taylor y Wilson (1990), que es el
 *      elemento de membrana que lleva la cáscara de Hekatan.
 *
 * Se abre desde «📐 Diseño» o con `window.__hekatanGuiaFem()`.
 */
import { registrarDiseno } from "./menuDiseno";

const w = () => window as any;

/** Un punto de la guía: qué se pregunta, qué se responde y qué modelo lo enseña. */
export interface PuntoGuia {
  /** La pregunta tal como la haría alguien que empieza. */
  p: string;
  /** La respuesta, corta y sin adornos. Admite HTML sencillo. */
  r: string;
  /** Ejemplo del workspace que lo demuestra (id del registro). */
  ej?: string;
  /** Arrancar además el tutor del ejemplo (los del paper lo tienen). */
  tutor?: boolean;
}

export interface BloqueGuia {
  titulo: string;
  puntos: PuntoGuia[];
}

export const GUIA: BloqueGuia[] = [
  {
    titulo: "1 · El camino",
    puntos: [
      {
        p: "¿Qué hace un programa de elementos finitos?",
        r: "Parte la estructura en trozos (los <b>elementos</b>), que solo se tocan en unos puntos (los <b>nudos</b>). " +
          "De cada trozo sabe escribir su rigidez: cuánta fuerza hace falta para moverlo. Sumando todas esas rigideces " +
          "en los nudos que comparten, queda un sistema <b>K·u = f</b>: se conocen las fuerzas f, se despejan los " +
          "movimientos u, y de u salen las tensiones.",
        ej: "membrana-pstress",
      },
      {
        p: "¿Qué son los grados de libertad de un nudo?",
        r: "Las maneras que tiene ese nudo de moverse. En un pórtico 3D son seis: tres desplazamientos y tres giros. " +
          "En una membrana plana, dos desplazamientos… y ahí está el problema del que trata el paper: falta el <b>giro</b>.",
        ej: "itw-test-1-flexion-pura",
      },
      {
        p: "¿Por qué la malla cambia el resultado?",
        r: "Porque dentro de cada elemento el movimiento se supone con una forma sencilla (una recta, una parábola). " +
          "Cuanto más pequeño es el elemento, menos se nota esa suposición. Por eso un banco de prueba se mide " +
          "<b>refinando</b>: 4×1, 8×2, 16×4, y se mira si el resultado se acerca al exacto.",
        ej: "itw-test-2-voladizo",
        tutor: true,
      },
      {
        p: "¿Cómo sé que el programa no se está inventando el resultado?",
        r: "Se compara con OTRO programa (SAP2000, ETABS, SAFE) con <b>la misma malla, nudo a nudo</b>, o con una " +
          "solución exacta cuando existe. Hekatan lleva esa comparación de serie: cada banco trae la tabla del paper " +
          "y la columna de Hekatan al lado.",
        ej: "itw-test-2-voladizo",
        tutor: true,
      },
    ],
  },
  {
    titulo: "2 · Preguntas que salen siempre",
    puntos: [
      {
        p: "¿Qué es el «drilling» y para qué sirve?",
        r: "Es el giro del nudo alrededor de la normal a la cáscara. Un Q4 de membrana corriente no lo tiene: si le " +
          "llega una viga que le entrega un momento, ese momento no lo recoge nadie. Con drilling, la membrana " +
          "recibe el momento y el muro trabaja como debe.",
        ej: "itw-test-1-flexion-pura",
        tutor: true,
      },
      {
        p: "¿Qué es el bloqueo (locking)?",
        r: "Un elemento demasiado rígido para lo que se le pide. Aparece cuando su forma de deformarse no admite " +
          "la flexión pura y la única salida que le queda es estirarse. Se ve enseguida: la flecha sale mucho más " +
          "pequeña que la exacta y no mejora al refinar tan deprisa como debería.",
        ej: "itw-test-2-voladizo",
      },
      {
        p: "¿Por qué la penalización vale γ = 0.4·μ y no 1 como en el paper?",
        r: "Porque se midió: reconstruyendo por flexibilidad la matriz de membrana de ETABS y ajustando γ por mínimos " +
          "cuadrados sale <b>0.400</b> en las diez geometrías probadas. Da casi igual, porque la formulación es " +
          "insensible a γ, y eso también lo avisa el paper.",
        ej: "itw-test-4-hemisferio",
      },
      {
        p: "¿Por qué mi periodo no coincide con ETABS?",
        r: "El periodo va con la raíz de la masa, así que antes de comparar modos hay que comparar <b>masa</b>. " +
          "Y ETABS pone brazos rígidos automáticos en las barras y no pesa el tramo que queda dentro: con eso solo, " +
          "salen casi tres por ciento de diferencia.",
        ej: "plantillas",
      },
      {
        p: "¿Placa delgada o gruesa?",
        r: "Delgada (Kirchhoff) cuando el canto es pequeño frente al vano: el cortante no cuenta. Gruesa " +
          "(Mindlin) cuando el canto pesa. En una losa corriente las dos dan casi lo mismo; en una zapata o un " +
          "muro corto, no.",
        ej: "placa-thick-thin-sano",
      },
    ],
  },
  {
    titulo: "3 · Los bancos del paper (Ibrahimbegović, Taylor y Wilson, 1990)",
    puntos: [
      { p: "Test I · Patch test de flexión pura", r: "Si el elemento no reproduce EXACTAMENTE un estado de deformación constante, no vale. Aquí se mide también el giro.", ej: "itw-test-1-flexion-pura", tutor: true },
      { p: "Test II · Voladizo corto (Tabla II)", r: "Relación 4 a 1: el cortante pesa un 4 % de la flecha. Se refina 4×1 → 8×2 → 16×4 y se compara con 0.3553 (Timoshenko).", ej: "itw-test-2-voladizo", tutor: true },
      { p: "Test III · Membrana de Cook", r: "Un cuadrilátero torcido, sin solución cerrada: el valor de referencia es 23.91 y sirve para ver la distorsión.", ej: "itw-test-3-cook" },
      { p: "Test IV · Hemisferio con agujero (Tablas IV y V)", r: "Cáscara curva. Aquí es donde un elemento se retrata: el del paper está convergido ya con 4×4.", ej: "itw-test-4-hemisferio", tutor: true },
    ],
  },
];

// ── La ventana ──
let pan: HTMLDivElement | null = null;

function abrirEjemplo(id: string, conTutor: boolean) {
  const u = new URL(location.href);
  u.searchParams.set("t", id);
  if (conTutor) u.searchParams.set("tutor", "1"); else u.searchParams.delete("tutor");
  // Si el workspace puede cambiar de ejemplo en caliente, mejor que recargar: no se pierde nada.
  if (!conTutor && w().__hekatanCargarEjemplo) {
    try { w().__hekatanCargarEjemplo(id); history.replaceState(null, "", u.toString()); return; } catch { /* recarga */ }
  }
  location.href = u.toString();
}

export function abrirGuiaFem() {
  if (pan) { pan.remove(); pan = null; return; }
  pan = document.createElement("div");
  pan.id = "hk-guia-fem";
  pan.style.cssText =
    "position:fixed;left:16px;top:60px;width:min(46vw,640px);max-height:82vh;overflow:auto;z-index:9500;" +
    "background:#0b1020;color:#e2e8f0;border:1px solid #334155;border-radius:12px;box-shadow:0 12px 40px #000a;" +
    "font:14px/1.5 system-ui";
  const cab =
    `<div style="position:sticky;top:0;background:#1e293b;padding:10px 14px;border-radius:12px 12px 0 0;` +
    `display:flex;align-items:center;gap:8px"><b style="color:#7dd3fc">📘 Guía de elementos finitos</b>` +
    `<span style="color:#94a3b8;font-size:12px">preguntas y respuestas, con el modelo que lo enseña</span>` +
    `<button data-cerrar style="margin-left:auto;background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer">✕</button></div>`;
  const cuerpo = GUIA.map((b) =>
    `<div style="padding:10px 14px"><div style="color:#fbbf24;font-weight:700;margin:6px 0">${b.titulo}</div>` +
    b.puntos.map((q, k) =>
      `<details style="border-top:1px solid #1e293b;padding:6px 0" data-b="${b.titulo}" data-k="${k}">` +
      `<summary style="cursor:pointer;color:#e2e8f0">${q.p}</summary>` +
      `<div style="color:#cbd5e1;margin:6px 0 8px">${q.r}</div>` +
      (q.ej ? `<button data-ej="${q.ej}" data-tutor="${q.tutor ? 1 : 0}" style="background:#1d4ed8;color:#fff;border:none;` +
        `border-radius:6px;padding:5px 10px;cursor:pointer">${q.tutor ? "▶ Verlo con el tutor" : "↗ Abrir el modelo"}</button>` : "") +
      `</details>`).join("") + `</div>`).join("");
  pan.innerHTML = cab + cuerpo;
  document.body.appendChild(pan);
  pan.querySelector("[data-cerrar]")?.addEventListener("click", () => { pan?.remove(); pan = null; });
  pan.querySelectorAll<HTMLButtonElement>("[data-ej]").forEach((b) =>
    b.addEventListener("click", () => abrirEjemplo(b.dataset.ej!, b.dataset.tutor === "1")));
}

/** Se registra una sola vez, para todos los ejemplos (la guía no depende del modelo abierto). */
export function registrarGuiaFem() {
  w().__hekatanGuiaFem = abrirGuiaFem;
  registrarDiseno({
    id: "guia-fem", orden: 4, icono: "📘",
    titulo: "Guía de elementos finitos",
    detalle: "Preguntas y respuestas escritas, con el modelo que lo demuestra. Sin IA: es un guion.",
    abrir: abrirGuiaFem,
  });
}
