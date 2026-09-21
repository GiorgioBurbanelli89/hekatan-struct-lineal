/**
 * Adjuntar al agente una imagen, un PDF o un texto.
 *
 * Jorge, 21-sep-2026: «si le pregunto algo y no sabe, que me diga: súbeme una
 * imagen, o la formulación, o un PDF… y que lo lea».
 *
 * Cómo se lee cada cosa, que no es lo mismo:
 *   · IMAGEN (foto de una página, un plano, una fórmula a mano): va tal cual al
 *     modelo. Gemini es multimodal y LEE la imagen — el OCR lo hace él, no hace
 *     falta un OCR aparte ni subir nada a ningún servicio.
 *   · PDF con texto (el 90 %: normas, artículos, memorias): se saca el texto
 *     aquí mismo con pdf.js, en el navegador. Es lo barato y lo exacto.
 *   · PDF ESCANEADO (no tiene texto, son fotos de las hojas): se convierte cada
 *     página a imagen y se manda como imagen, para que el modelo la lea.
 *   · .txt .csv .lisp .heks .e2k: texto plano, directo.
 *
 * Nada de esto sale del ordenador salvo dentro de la misma petición al modelo
 * que el usuario ya está usando.
 */

const PDFJS = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.6.82/build/pdf.min.mjs";
const PDFJS_WORKER = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.6.82/build/pdf.worker.min.mjs";

const MAX_IMG = 6;              // imágenes por mensaje
const MAX_LADO = 1600;          // px del lado mayor: más no mejora la lectura y sí pesa
const MAX_TEXTO = 60000;        // caracteres de texto extraído

export type Adjunto = {
  nombre: string;
  tipo: "imagen" | "texto";
  dato: string;                 // data URI si es imagen; el texto si es texto
  paginas?: number;
};

/** Encoge y recomprime: una foto de móvil son 8 MB y no hace falta ninguno. */
async function encoger(f: File): Promise<string> {
  const bm = await createImageBitmap(f);
  const k = Math.min(1, MAX_LADO / Math.max(bm.width, bm.height));
  const w = Math.round(bm.width * k), h = Math.round(bm.height * k);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d")!;
  g.drawImage(bm, 0, 0, w, h);
  bm.close?.();
  // PNG para capturas de pantalla (texto nítido), JPEG para fotos (pesa 5 veces menos)
  const esFoto = /jpe?g/i.test(f.type) || f.size > 900_000;
  return c.toDataURL(esFoto ? "image/jpeg" : "image/png", 0.85);
}

let pdfjs: any = null;
async function cargarPdfjs() {
  if (pdfjs) return pdfjs;
  pdfjs = await import(/* @vite-ignore */ PDFJS);
  pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  return pdfjs;
}

async function leerPdf(f: File, aviso: (s: string) => void): Promise<Adjunto[]> {
  const lib = await cargarPdfjs();
  const doc = await lib.getDocument({ data: await f.arrayBuffer() }).promise;
  const n = doc.numPages;
  let texto = "";
  for (let i = 1; i <= n; i++) {
    const pag = await doc.getPage(i);
    const c = await pag.getTextContent();
    const t = c.items.map((x: any) => x.str).join(" ").replace(/\s+/g, " ").trim();
    if (t) texto += `\n\n--- página ${i} ---\n${t}`;
    if (texto.length > MAX_TEXTO) { texto += "\n\n(… recortado)"; break; }
  }

  // ¿tiene texto de verdad? menos de 40 caracteres por página = está escaneado
  if (texto.replace(/\s/g, "").length > n * 40) {
    aviso(`${f.name}: ${n} pág., texto extraído (${texto.length} caracteres).`);
    return [{ nombre: f.name, tipo: "texto", dato: texto.trim(), paginas: n }];
  }

  // escaneado: las páginas se mandan como imágenes y las lee el modelo
  const cuantas = Math.min(n, MAX_IMG);
  aviso(`${f.name}: escaneado (sin texto). Mando ${cuantas} de ${n} páginas como imagen.`);
  const out: Adjunto[] = [];
  for (let i = 1; i <= cuantas; i++) {
    const pag = await doc.getPage(i);
    const v0 = pag.getViewport({ scale: 1 });
    const esc = Math.min(2.2, MAX_LADO / Math.max(v0.width, v0.height));
    const vp = pag.getViewport({ scale: esc });
    const c = document.createElement("canvas");
    c.width = Math.round(vp.width); c.height = Math.round(vp.height);
    await pag.render({ canvasContext: c.getContext("2d")!, viewport: vp }).promise;
    out.push({ nombre: `${f.name} · pág. ${i}`, tipo: "imagen", dato: c.toDataURL("image/jpeg", 0.82) });
  }
  return out;
}

/** Lee lo que el usuario eligió y lo deja listo para el modelo. */
export async function leerArchivos(files: File[], aviso: (s: string) => void): Promise<Adjunto[]> {
  const out: Adjunto[] = [];
  for (const f of files) {
    try {
      if (/^image\//.test(f.type)) {
        out.push({ nombre: f.name, tipo: "imagen", dato: await encoger(f) });
        aviso(`${f.name}: imagen lista (la lee el modelo).`);
      } else if (/pdf$/i.test(f.type) || /\.pdf$/i.test(f.name)) {
        out.push(...await leerPdf(f, aviso));
      } else {
        const t = (await f.text()).slice(0, MAX_TEXTO);
        out.push({ nombre: f.name, tipo: "texto", dato: t });
        aviso(`${f.name}: texto (${t.length} caracteres).`);
      }
    } catch (e: any) {
      aviso(`${f.name}: no se pudo leer — ${e?.message ?? e}`);
    }
  }
  const imgs = out.filter((a) => a.tipo === "imagen");
  if (imgs.length > MAX_IMG) {
    aviso(`Solo mando las ${MAX_IMG} primeras imágenes.`);
    return [...out.filter((a) => a.tipo === "texto"), ...imgs.slice(0, MAX_IMG)];
  }
  return out;
}

/**
 * Monta el mensaje del usuario con lo adjunto. Las imágenes van como
 * `image_url` con data URI, que es lo que entienden Gemini (por su endpoint
 * compatible con OpenAI), OpenRouter y Ollama con un modelo de visión.
 */
export function mensajeCon(texto: string, adj: Adjunto[]): any {
  if (!adj.length) return { role: "user", content: texto };
  const partes: any[] = [];
  const textos = adj.filter((a) => a.tipo === "texto");
  let cab = texto;
  for (const t of textos) cab += `\n\n===== ${t.nombre} =====\n${t.dato}`;
  partes.push({ type: "text", text: cab });
  for (const im of adj.filter((a) => a.tipo === "imagen"))
    partes.push({ type: "image_url", image_url: { url: im.dato } });
  return { role: "user", content: partes };
}

/** El botón 📎: abre el selector y devuelve lo que se eligió. */
export function pedirArchivos(): Promise<File[]> {
  return new Promise((ok) => {
    const i = document.createElement("input");
    i.type = "file";
    i.multiple = true;
    i.accept = "image/*,.pdf,.txt,.csv,.md,.lisp,.heks,.e2k,.s2k,.f2k";
    i.style.display = "none";
    document.body.appendChild(i);
    i.onchange = () => { ok(Array.from(i.files ?? [])); i.remove(); };
    // si se cancela, el `change` no llega nunca: se limpia al volver el foco
    window.addEventListener("focus", () => setTimeout(() => {
      if (document.body.contains(i) && !(i.files?.length)) { ok([]); i.remove(); }
    }, 500), { once: true });
    i.click();
  });
}
