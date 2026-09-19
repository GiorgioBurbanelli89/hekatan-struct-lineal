/**
 * Capítulo 22 — Una cimentación completa pedida al AGENTE de IA de Hekatan Struct.
 * Jorge (19-sep-2026): «haz una cimentación completa, pídesela al agente dentro de Hekatan
 * Struct, que recorra desde 0 y haga un vídeo; la voz la pones tú».
 * El agente corre LOCAL (Ollama, qwen2.5:7b): sin clave, sin nube. Los números finales los
 * pone el programa en la burbuja «📊 Datos del programa», no el modelo de IA.
 * Todo con el cursor: 🤖 del lienzo, escribir el pedido, Enviar, barra «📐 Diseño».
 */
export const titulo = "Hekatan Struct · cimentación completa con el agente de IA";
export const ruta = "workspace/?sinBienvenida=1";

const PEDIDO = "Haz una cimentación completa: rejilla de zapatas aisladas con vigas de amarre para 3 por 3 columnas. Calcula y dime la presión máxima del suelo y el asentamiento.";

/** Punto de pantalla (CSS) de un nudo del modelo: el de mayor asentamiento, o el centroide. */
const puntoNudo = (a, cual = "uz") => a.pag.evaluate((c) => {
  const host = [...document.querySelectorAll("div")].find((e) => e.__ctx?.scene);
  const ctx = host.__ctx, s = window.__hekatanStates, n = s.nodes.val;
  let k = 0;
  if (c === "uz") { let m = 0; for (const [i, v] of s.deformOutputs.val?.deformations ?? []) if (Math.abs(v[2]) > m) { m = Math.abs(v[2]); k = i; } }
  const p = n[k]; const v = { x: p[0], y: p[1], z: p[2] };
  const cam = ctx.camera; const V = new cam.position.constructor(v.x, v.y, v.z).project(cam);
  const r = host.querySelector("canvas").getBoundingClientRect();
  return { x: r.left + (V.x + 1) / 2 * r.width, y: r.top + (1 - V.y) / 2 * r.height };
}, cual);

const hover = async (a, x, y, n = 8) => {
  await a.pag.mouse.move(x, y, { steps: 16 });
  await a.pag.evaluate((q) => { window.__tutCursor?.(q.x, q.y); window.__tutXY = q; }, { x, y });
  await a.quieto(n, 320);
};

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("Cimentación completa con el agente de IA", "Capítulo 22", 16); } },
  {
    rotulo: "1 · El agente de IA, desde el menú de inicio",
    hacer: async (a) => {
      await a.general(); await a.quieto(2, 300);
      await a.marcar("boton", "Agente IA", "El agente de IA de Hekatan Struct: corre en tu PC (Ollama), sin clave.");
      await a.quieto(2, 300);
      await a.pulsar("Agente IA", 1800);
      await a.pulsar("✕", 500);   // la ayuda del lienzo en blanco, si sale
    },
  },
  {
    rotulo: "2 · Escribir el pedido",
    hacer: async (a) => {
      const r = await a.pag.evaluate(() => { const t = document.querySelector("#hk-agente-ia textarea").getBoundingClientRect(); return { x: t.left, y: t.top, w: t.width, h: t.height }; });
      await a.pulsarR(r, 300);
      for (let i = 0; i < PEDIDO.length; i += 6) {
        await a.pag.keyboard.type(PEDIDO.slice(i, i + 6), { delay: 5 });
        if (i % 18 === 0) await a.foto();
      }
      await a.quieto(3, 300);
    },
  },
  {
    rotulo: "3 · Enviar: el agente trabaja con las herramientas del programa",
    hacer: async (a) => {
      await a.pulsar("Enviar", 500);
      const t0 = Date.now();
      for (;;) {
        await a.quieto(1, 1500);
        const fin = await a.pag.evaluate(() => [...document.querySelectorAll("#hk-agente-ia button")].some((b) => b.textContent.includes("Enviar ▶")));
        if (fin || Date.now() - t0 > 480000) break;
      }
      await a.quieto(4, 300);
      const txt = await a.pag.evaluate(() => document.querySelector("#hk-agente-ia > div:nth-child(3)").innerText);
      console.log("  AGENTE:\n" + txt.split("\n").map((l) => "    " + l).join("\n"));
      if (!/presión máx del suelo/.test(txt)) console.log("  x EL AGENTE NO TERMINÓ BIEN (sin presión del programa)");
    },
  },
  {
    rotulo: "4 · Los números los pone el programa",
    hacer: async (a) => {
      const r = await a.pag.evaluate(() => { const b = [...document.querySelectorAll("#hk-agente-ia div")].reverse().find((d) => d.textContent.startsWith("📊")); if (!b) return null; b.scrollIntoView({ block: "center" }); const q = b.getBoundingClientRect(); return { x: q.left, y: q.top, w: q.width, h: q.height }; });
      if (r) await a.marcarR(r, "Presión y asentamiento leídos del cálculo, no escritos por la IA.");
      await a.quieto(6, 320); await a.sinCuadro();
    },
  },
  {
    rotulo: "5 · Cerrar el chat y mirar el modelo",
    hacer: async (a) => {
      const r = await a.pag.evaluate(() => { const b = [...document.querySelectorAll("#hk-agente-ia button")].find((x) => x.textContent.trim() === "✕"); const q = b.getBoundingClientRect(); return { x: q.left, y: q.top, w: q.width, h: q.height }; });
      await a.pulsarR(r, 800);
      await a.general(); await a.quieto(5, 320);
    },
  },
  {
    rotulo: "6 · La presión del suelo en el cursor",
    hacer: async (a) => {
      const p = await puntoNudo(a, "uz");
      await hover(a, p.x, p.y, 9);
      await hover(a, p.x + 60, p.y + 25, 7);
    },
  },
  {
    rotulo: "7 · Diseño: el acero de las zapatas",
    hacer: async (a) => {
      await a.pulsar("Diseño ▾", 600);
      await a.pulsarR(await a.pag.evaluate(() => { const q = document.querySelector('#hk-diseno-menu [data-id="franjas"]').getBoundingClientRect(); return { x: q.left, y: q.top, w: q.width, h: q.height }; }), 4000);
      await a.quieto(6, 320);
    },
  },
  {
    rotulo: "8 · El acero en el cursor, como SAFE",
    hacer: async (a) => {
      // plegar la ventana con su ▁ para ver la zapata entera
      const r = await a.pag.evaluate(() => { const q = document.querySelector("#hk-franjas [data-plegar]").getBoundingClientRect(); return { x: q.left - 4, y: q.top - 4, w: q.width + 8, h: q.height + 8 }; });
      await a.pulsarR(r, 600);
      const p = await puntoNudo(a, "uz");
      await hover(a, p.x, p.y, 10);
      await hover(a, p.x - 50, p.y + 20, 8);
    },
  },
  { rotulo: "Cierre", hacer: async (a) => { await a.general(); await a.quieto(8, 320); } },
];
