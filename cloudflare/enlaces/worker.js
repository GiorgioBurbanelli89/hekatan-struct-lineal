// Enlaces CORTOS de «Compartir» de Hekatan Struct (1-oct-2026).
// POST /      cuerpo = el modelo ya comprimido (deflate-raw + base64url, el mismo del enlace #h=) → {"id": "..."}
// GET  /<id>  → ese texto. El id es aleatorio (10 caracteres, ~59 bits): solo quien tiene el enlace abre el modelo.
// Nada de esto se lee en el servidor: guarda y devuelve el texto comprimido tal cual.
const ORIGENES = ["https://giorgioburbanelli89.github.io", "http://localhost:4600", "http://127.0.0.1:4600"];
const MAX = 5 * 1024 * 1024;                       // 5 MB de texto comprimido
const ABC = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

function cors(req) {
  const o = req.headers.get("Origin") || "";
  return {
    "Access-Control-Allow-Origin": ORIGENES.includes(o) ? o : ORIGENES[0],
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}
const nuevoId = () => { const b = crypto.getRandomValues(new Uint8Array(10)); return [...b].map((x) => ABC[x % ABC.length]).join(""); };

export default {
  async fetch(req, env) {
    const h = cors(req), url = new URL(req.url);
    if (req.method === "OPTIONS") return new Response(null, { headers: h });
    if (req.method === "POST" && url.pathname === "/") {
      const txt = await req.text();
      if (!txt || txt.length > MAX || !/^[A-Za-z0-9_-]+$/.test(txt))
        return new Response(JSON.stringify({ error: "modelo vacío, demasiado grande o con formato inválido" }), { status: 400, headers: { ...h, "Content-Type": "application/json" } });
      let id = nuevoId();
      for (let i = 0; i < 3 && (await env.ENLACES.get(id)) !== null; i++) id = nuevoId();
      await env.ENLACES.put(id, txt, { metadata: { t: Date.now(), n: txt.length } });
      return new Response(JSON.stringify({ id }), { headers: { ...h, "Content-Type": "application/json" } });
    }
    const id = url.pathname.slice(1);
    if (req.method === "GET" && /^[A-Za-z0-9]{6,16}$/.test(id)) {
      const txt = await env.ENLACES.get(id);
      if (txt === null) return new Response("no existe", { status: 404, headers: h });
      return new Response(txt, { headers: { ...h, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
    }
    return new Response("Hekatan Struct · enlaces", { status: 404, headers: h });
  },
};
