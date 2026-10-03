/**
 * TEST MINUCIOSO DE UNIDADES en la interfaz real (puppeteer, 2-oct-2026, pedido de Jorge).
 *
 *   node cli/test_unidades_ui.mjs <base> <carpeta> <id> [id…]
 *   base = http://localhost:4801/hekatan-struct-lineal  (cli/_serve_bundle.mjs)  o el sitio público
 *
 * Tres invariantes, que no dependen de saber de antemano qué unidad «debería» llevar cada número:
 *   I1 FÍSICA   — el modelo resuelto (desplazamientos y reacciones en SI, de __hekatanStates) es EL MISMO
 *                 con cualquier sistema de unidades, cargado de inicio o cambiado en vivo desde «Unidades».
 *   I2 PANTALLA — cada «número unidad» que se ve (tarjetas, paneles, leyenda, campos de Tweakpane con la
 *                 unidad en la etiqueta), pasado a SI con SU PROPIA etiqueta, vale lo mismo en todos los
 *                 sistemas. Si la etiqueta dice kN y el número está en tonf, salta.
 *   I3 COHERENCIA — la etiqueta usa las unidades del sistema elegido (en «Kip, ft» no debe salir «kN»).
 * Más la tarjeta del nudo (hover) contra el desplazamiento del solver, y la leyenda de cada campo de cáscara.
 */
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "fs";

const [BASE, OUT, ...IDS] = process.argv.slice(2);
mkdirSync(OUT, { recursive: true });

// Sistemas a probar. Los tres presets y uno granular «raro» (kN con cm y tonf/m²) que no coincide con ninguno.
const SISTEMAS = {
  SI:  { hk_unitsPreset: "Metric SI" },
  MKS: { hk_unitsPreset: "Metric MKS" },
  IMP: { hk_unitsPreset: "U.S. Imperial" },
  MIX: { hk_unitsPreset: "Custom", hk_forceUnit: "kN", hk_dispUnit: "cm", hk_stressUnit: "tonf/m²",
         hk_lengthStructureUnit: "m", hk_lengthSectionUnit: "cm", hk_subgradeUnit: "kN/m³", hk_stiffTransUnit: "kN/m" },
};
const ESPERA = { SI: { F: "kN", D: "mm", L: "m" }, MKS: { F: "tonf", D: "mm", L: "m" }, IMP: { F: "kip", D: "in", L: "ft" },
                 MIX: { F: "kN", D: "cm", L: "m" } };

// ── Unidad → factor a SI (kN, m) ─────────────────────────────────────────────
const F = { kN: 1, N: 1e-3, MN: 1e3, tonf: 9.80665, Tonf: 9.80665, t: 9.80665, kgf: 0.00980665, kg: 0.00980665, kip: 4.4482216, Kip: 4.4482216, lb: 0.0044482216, lbf: 0.0044482216 };
const L = { m: 1, mm: 1e-3, cm: 1e-2, in: 0.0254, ft: 0.3048 };
const ALIAS = { kPa: "kN/m²", MPa: "1000kN/m²", GPa: "1e6kN/m²", psi: "6.894757kN/m²", ksi: "6894.757kN/m²", pci: "lb/in³" };
function factorUnidad(u) {
  if (!u) return null;
  u = u.replace(/\s+/g, "").replace(/\^2/g, "²").replace(/\^3/g, "³").replace(/2$/, "²").replace(/\*/g, "·");
  if (ALIAS[u]) { const m = ALIAS[u].match(/^([\d.e]+)?(.*)$/); return (m[1] ? +m[1] : 1) * factorUnidad(m[2]); }
  const partes = u.split("/"); let f = 1;
  for (let k = 0; k < partes.length; k++) {
    let g = 1;
    for (let tok of partes[k].split("·")) {
      let ex = 1; if (tok.endsWith("²")) { ex = 2; tok = tok.slice(0, -1); } else if (tok.endsWith("³")) { ex = 3; tok = tok.slice(0, -1); }
      const b = F[tok] ?? L[tok]; if (b === undefined) return null;
      g *= b ** ex;
    }
    f = k === 0 ? g : f / g;
  }
  return f;
}
const TOK = "(?:kN|MN|N|tonf|Tonf|kgf|kip|Kip|lbf|lb|kPa|MPa|GPa|psi|ksi|pci|mm|cm|m|in|ft)(?:[²³]|\\^[23])?";
const UNIDAD = `${TOK}(?:\\s*[·*/]\\s*${TOK})*`;
const RE_PAR = new RegExp(`(-?\\d[\\d,]*\\.?\\d*(?:e[-+]?\\d+)?)\\s*(${UNIDAD})(?![A-Za-z])`, "g");

function paresDeTexto(t) {
  const out = []; let m; RE_PAR.lastIndex = 0;
  while ((m = RE_PAR.exec(t))) {
    const num = m[1].replace(/,/g, ""); const v = +num; const fu = factorUnidad(m[2]);
    if (!Number.isFinite(v) || fu === null) continue;
    const dec = (num.split(".")[1] ?? "").replace(/e.*/, "").length;
    out.push({ v, u: m[2].replace(/\s+/g, ""), si: v * fu, tol: 0.5 * 10 ** -dec * Math.abs(fu) * (num.includes("e") ? Math.abs(v) : 1) });
  }
  return out;
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function abrir(nav, id, sistema) {
  const pag = await nav.newPage(); await pag.setViewport({ width: 1500, height: 950 });
  const errores = []; pag.on("pageerror", (e) => errores.push(String(e).slice(0, 200)));
  await pag.evaluateOnNewDocument((ls) => { try { localStorage.clear(); for (const [k, v] of Object.entries(ls)) localStorage.setItem(k, v); } catch {} }, SISTEMAS[sistema]);
  await pag.goto(`${BASE}/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 180000 });
  await espera(6000);
  return { pag, errores };
}

// Todo lo que se puede leer de la pantalla y del modelo
async function leer(pag) {
  return await pag.evaluate(() => {
    const st = window.__hekatanStates;
    const def = st?.deformOutputs?.val?.deformations, rea = st?.deformOutputs?.val?.reactions;
    const fis = { max: [0, 0, 0, 0, 0, 0], sumR: [0, 0, 0, 0, 0, 0], n: 0 };
    def?.forEach((d) => { fis.n++; d.forEach((x, k) => { if (Math.abs(x) > Math.abs(fis.max[k])) fis.max[k] = x; }); });
    rea?.forEach((r) => r.forEach((x, k) => (fis.sumR[k] += x)));
    // texto visible con su ruta estable
    const ruta = (el) => { const p = []; while (el && el !== document.body) { const i = el.parentNode ? [...el.parentNode.children].indexOf(el) : 0; p.unshift(`${el.tagName}${el.id ? "#" + el.id : ""}:${i}`); el = el.parentElement; } return p.join(">"); };
    const textos = [];
    for (const el of document.querySelectorAll("body *")) {
      if (["SCRIPT", "STYLE", "SVG", "PATH", "CANVAS"].includes(el.tagName)) continue;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none") continue;
      let own = ""; for (const n of el.childNodes) if (n.nodeType === 3) own += n.textContent;
      own = own.trim(); if (own) textos.push({ k: ruta(el), t: own.slice(0, 400) });
    }
    // Tweakpane: etiqueta con la unidad + valor en el campo
    const tp = []; const vistos = {};
    document.querySelectorAll(".tp-lblv").forEach((b) => {
      const lab = b.querySelector(".tp-lblv_l")?.textContent?.trim() ?? "";
      const inp = b.querySelector("input.tp-txtv_i, .tp-txtv input, input");
      if (inp && lab) { const carpeta = b.closest(".tp-fldv")?.querySelector(".tp-fldv_t")?.textContent?.trim() ?? ""; const base = carpeta + "›" + lab.replace(/\s*\([^()]*\)\s*$/, ""); vistos[base] = (vistos[base] ?? 0) + 1; tp.push({ k: `TP:${base}#${vistos[base]}`, lab, val: inp.value }); }
    });
    const leg = document.querySelector("#legend");
    const leyenda = leg && !leg.hidden ? { unidad: leg.firstChild?.textContent ?? "", marcas: [...leg.querySelectorAll(".marker p")].map((p) => p.textContent) } : null;
    const ls = (k) => localStorage.getItem(k);
    return { fis, textos, tp, leyenda, unidades: { F: window.__hekatanForceUnit, D: window.__hekatanDispUnit, S: window.__hekatanStressUnit, L: ls('hk_lengthStructureUnit'), LS: ls('hk_lengthSectionUnit'), SG: ls('hk_subgradeUnit'), K: ls('hk_stiffTransUnit') } };
  });
}

// La tarjeta del nudo con mayor desplazamiento: se apaga la deformada para que el nudo esté donde dice el modelo
async function hoverNudo(pag) {
  return await pag.evaluate(async () => {
    const st = window.__hekatanStates, s = window.__hekatanSettings?.();
    if (!st?.deformOutputs?.val?.deformations || !s) return null;
    try { s.deformedShape.val = false; } catch {}
    await new Promise((r) => setTimeout(r, 600));
    let best = -1, bm = -1;
    st.deformOutputs.val.deformations.forEach((d, i) => { const m = Math.hypot(d[0], d[1], d[2]); if (m > bm) { bm = m; best = i; } });
    const v = document.querySelector("#viewer"), ctx = v?.__ctx; if (!ctx || best < 0) return null;
    const p = st.nodes.val[best]; const THREE = ctx.scene.constructor; void THREE;
    const cam = typeof ctx.getActiveCamera === "function" ? ctx.getActiveCamera() : ctx.camera;
    const vec = cam.position.clone(); vec.set(p[0], p[1], p[2]); vec.project(cam);
    const cv = v.querySelector("canvas"), r = cv.getBoundingClientRect();
    const x = r.left + (vec.x + 1) / 2 * r.width, y = r.top + (1 - vec.y) / 2 * r.height;
    cv.dispatchEvent(new PointerEvent("pointermove", { clientX: x, clientY: y, bubbles: true }));
    await new Promise((r) => setTimeout(r, 400));
    const tt = document.querySelector(".hekatan-hover-tooltip");
    return { nudo: best, d: st.deformOutputs.val.deformations.get(best), texto: tt && tt.style.display !== "none" ? tt.textContent : null };
  });
}

// Cada campo de cáscara disponible: unidad y marcas de la leyenda
async function leyendas(pag) {
  const campos = ["bendingXX", "membraneXX", "tranverseShearX", "vonMises", "pressure", "displacementZ"];
  const out = {};
  for (const c of campos) {
    const r = await pag.evaluate(async (c) => {
      const s = window.__hekatanSettings?.(); if (!s) return null;
      try { s.shellResults.val = c; } catch { return null; }
      await new Promise((r) => setTimeout(r, 700));
      const leg = document.querySelector("#legend");
      if (!leg || leg.hidden) return null;
      return { unidad: leg.firstChild?.textContent ?? "", marcas: [...leg.querySelectorAll(".marker p")].map((p) => p.textContent) };
    }, c);
    if (r && r.marcas.some((m) => +m !== 0)) out[c] = r;
  }
  return out;
}

// Los números dibujados en 3D (cargas, reacciones, desplazamientos, diagramas de barra): Text guarda su texto
async function etiquetas3D(pag) {
  const modos = [["cargas", null, null], ["reacciones", "nodeResults", "reactions"], ["desplazamientos", "nodeResults", "deformations"],
                 ["axial", "frameResults", "normals"], ["momento", "frameResults", "bendingsZ"]];
  const out = {};
  for (const [nombre, ajuste, valor] of modos) {
    out[nombre] = await pag.evaluate(async (ajuste, valor) => {
      const s = window.__hekatanSettings?.(); const ctx = document.querySelector("#viewer")?.__ctx;
      if (!s || !ctx) return [];
      try { s.nodeResults.val = "none"; s.frameResults.val = "none"; } catch {}
      if (ajuste) { try { s[ajuste].val = valor; } catch { return []; } }
      await new Promise((r) => setTimeout(r, 900));
      const vis = (o) => { for (let x = o; x; x = x.parent) if (x.visible === false) return false; return true; };
      const t = []; ctx.scene.traverse((o) => { if (typeof o.textoEtiqueta === "string" && vis(o)) t.push(o.textoEtiqueta); });
      try { s.nodeResults.val = "none"; s.frameResults.val = "none"; } catch {}
      return t.slice(0, 400);
    }, ajuste, valor);
  }
  return out;
}

// Cambio EN VIVO del preset desde la carpeta «Unidades» (el select de Tweakpane)
async function cambiarPresetEnVivo(pag, preset) {
  return await pag.evaluate(async (preset) => {
    const sel = [...document.querySelectorAll(".tp-lblv")].find((b) => b.querySelector(".tp-lblv_l")?.textContent?.trim() === "Preset")?.querySelector("select");
    if (!sel) return false;
    const opt = [...sel.options].find((o) => o.textContent.startsWith(preset)); if (!opt) return false;
    sel.value = opt.value; sel.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 4000));
    return true;
  }, preset);
}

// ── Comparaciones ───────────────────────────────────────────────────────────
function compararFisica(a, b) {
  let peor = 0;
  for (let k = 0; k < 6; k++) for (const [x, y] of [[a.max[k], b.max[k]], [a.sumR[k], b.sumR[k]]]) {
    const ref = Math.max(Math.abs(x), Math.abs(y), 1e-12); peor = Math.max(peor, Math.abs(x - y) / ref);
  }
  return peor;
}
function mapaPantalla(l) {
  const m = new Map();
  for (const { k, t } of l.textos) paresDeTexto(t).forEach((p, i) => m.set(`${k}#${i}`, { ...p, texto: t }));
  for (const { k, lab, val } of l.tp) {
    const u = lab.match(/\(([^()]+)\)\s*$/)?.[1]; const fu = factorUnidad(u);
    const v = +String(val).replace(/,/g, ""); if (fu === null || !Number.isFinite(v)) continue;
    const dec = (String(val).split(".")[1] ?? "").length;
    m.set(`${k}#tp`, { v, u, si: v * fu, tol: 0.5 * 10 ** -dec * fu, texto: `${lab} = ${val}` });
  }
  return m;
}
function compararPantalla(base, otra, nomB, nomO, fallos) {
  for (const [k, a] of base) {
    const b = otra.get(k); if (!b) continue;
    // «📊 Calculados»: el ejemplo ya entrega el número redondeado (4 cifras) y convertirlo suma otro redondeo
    const rel = k.includes("Calculados") ? 6e-4 : 1e-9;
    const tol = a.tol + b.tol + rel * Math.max(Math.abs(a.si), Math.abs(b.si));
    if (Math.abs(a.si - b.si) > tol * 1.0001)
      fallos.push({ donde: k.split(">").slice(-3).join(">"), [nomB]: a.texto, [nomO]: b.texto, siB: a.si, siO: b.si, razon: (b.si / a.si) });
  }
}
function coherencia(l, sis, fallos, extra = []) {
  const u = l.unidades; const elegidas = new Set([u.S, u.SG, u.K].filter(Boolean).map((x) => x.replace(/\s+/g, "")));
  const base = new Set([u.F, u.L, u.D, u.LS].filter(Boolean));
  const ok = (un) => { const n = un.replace(/\^2/g, "²").replace(/\^3/g, "³"); if (elegidas.has(n)) return true;
    return n.split(/[·/*]/).every((t) => base.has(t.replace(/[²³]/, ""))); };
  for (const { k, t } of [...l.textos, ...l.tp.map((x) => ({ k: x.k, t: x.lab })), ...extra])
    for (const p of paresDeTexto(t.includes("(") && !/\d\s*\(/.test(t) ? t.replace(/.*\(([^()]+)\)\s*$/, "1 $1") : t))
      if (!ok(p.u)) fallos.push({ sistema: sis, donde: k.split(">").slice(-2).join(">"), texto: t.slice(0, 160), unidad: p.u, elegido: `${u.F}, ${u.L}, ${u.D}, ${u.S}` });
}

// ── Corrida ─────────────────────────────────────────────────────────────────
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const informe = {};
for (const id of IDS) {
  const r = { fisica: {}, pantalla: [], coherencia: [], hover: {}, leyendas: {}, enVivo: {}, errores: [] };
  const lect = {};
  for (const sis of Object.keys(SISTEMAS)) {
    const { pag, errores } = await abrir(nav, id, sis);
    lect[sis] = await leer(pag);
    r.leyendas[sis] = await leyendas(pag);
    r.hover[sis] = await hoverNudo(pag);
    r.e3d = r.e3d ?? {}; r.e3d[sis] = await etiquetas3D(pag);
    await pag.screenshot({ path: `${OUT}/${id}_${sis}.png` });
    r.errores.push(...errores.map((e) => `${sis}: ${e}`));
    coherencia(lect[sis], sis, r.coherencia, Object.entries(r.leyendas[sis] ?? {}).map(([c, v]) => ({ k: `LEYENDA ${c}`, t: `1 ${v.unidad.replace(/[\[\]]/g, '')}` })));
    // en vivo: desde este sistema a los demás presets, sin recargar
    if (sis === "MKS") for (const destino of ["Metric SI", "U.S. Imperial"]) {
      const ok = await cambiarPresetEnVivo(pag, destino);
      const l2 = await leer(pag);
      const nom = destino === "Metric SI" ? "SI" : "IMP";
      r.enVivo[`MKS→${nom}`] = { ok, fisica: compararFisica(lect.MKS.fis, l2.fis), unidades: l2.unidades };
      const fv = []; compararPantalla(mapaPantalla(lect.MKS), mapaPantalla(l2), "MKS", `${nom}(vivo)`, fv);
      r.enVivo[`MKS→${nom}`].pantalla = fv.slice(0, 40);
      // lo que se queda del sistema ANTERIOR tras cambiar en vivo (panel sin repintar, tarjeta abierta…)
      const cv = []; coherencia(l2, nom, cv); r.enVivo[`MKS→${nom}`].coh = cv;
      await pag.screenshot({ path: `${OUT}/${id}_MKS_a_${nom}_envivo.png` });
    }
    await pag.close();
  }
  for (const sis of Object.keys(SISTEMAS)) if (sis !== "SI") {
    r.fisica[sis] = compararFisica(lect.SI.fis, lect[sis].fis);
    compararPantalla(mapaPantalla(lect.SI), mapaPantalla(lect[sis]), "SI", sis, r.pantalla);
  }
  // leyendas: cada marca pasada a SI con la etiqueta de su sistema
  r.leyendaFallos = [];
  for (const campo of Object.keys(r.leyendas.SI ?? {})) {
    const base = r.leyendas.SI[campo]; const fb = factorUnidad(base.unidad.replace(/[\[\]]/g, ""));
    for (const sis of ["MKS", "IMP", "MIX"]) {
      const o = r.leyendas[sis]?.[campo]; if (!o) { r.leyendaFallos.push({ campo, sis, falta: true }); continue; }
      const fo = factorUnidad(o.unidad.replace(/[\[\]]/g, ""));
      const e = ESPERA[sis];
      const ok = fb !== null && fo !== null && base.marcas.every((m, i) => {
        const a = +m * fb, b = +o.marcas[i] * fo, ref = Math.max(Math.abs(a), Math.abs(b), 1e-12);
        return Math.abs(a - b) / ref < 0.02 || Math.abs(a - b) < 1e-9;
      });
      if (!ok) r.leyendaFallos.push({ campo, sis, SI: `${base.unidad} ${base.marcas[0]}…${base.marcas.at(-1)}`, otro: `${o.unidad} ${o.marcas[0]}…${o.marcas.at(-1)}`, esperaba: e });
    }
  }
  // hover: el texto de la tarjeta trae el desplazamiento convertido; se compara con el del solver
  r.hoverFallos = [];
  for (const [sis, h] of Object.entries(r.hover)) {
    if (!h) { r.hoverFallos.push({ sis, sinTarjeta: "no se pudo leer" }); continue; }
    if (!h.texto) { r.hoverFallos.push({ sis, nudo: h.nudo, sinTarjeta: true }); continue; }
    const pares = paresDeTexto(h.texto);
    const desp = pares.filter((p) => L[p.u] !== undefined);
    const umax = Math.max(Math.abs(h.d[0]), Math.abs(h.d[1]), Math.abs(h.d[2]));
    const hay = desp.some((p) => Math.abs(Math.abs(p.si) - umax) <= Math.max(p.tol * 1.01, 1e-6 * umax));
    const comp = [0, 1, 2].every((k) => Math.abs(h.d[k]) < 1e-12 || desp.some((p) => Math.abs(p.si - h.d[k]) <= Math.max(p.tol * 1.01, 1e-6 * Math.abs(h.d[k]))));
    if (!hay && !comp) r.hoverFallos.push({ sis, nudo: h.nudo, d_m: h.d.slice(0, 3), tarjeta: h.texto.slice(0, 300) });
    if (h.texto && /NaN|undefined/.test(h.texto)) r.hoverFallos.push({ sis, nudo: h.nudo, NaN: h.texto.slice(0, 200) });
  }
  // 3D: misma etiqueta (por orden) en SI con su propia unidad; y número sin unidad = no se sabe en qué está
  r.e3dFallos = [];
  for (const [modo, base] of Object.entries(r.e3d?.SI ?? {})) {
    base.forEach((t, i) => { if (/^-?[\d.]+(e[-+]?\d+)?$/.test(t.trim())) r.e3dFallos.push({ modo, sinUnidad: t }); });
    for (const sis of ["MKS", "IMP", "MIX"]) {
      const otra = r.e3d?.[sis]?.[modo] ?? [];
      base.forEach((t, i) => {
        const a = paresDeTexto(t), b = paresDeTexto(otra[i] ?? "");
        a.forEach((pa, j) => { const pb = b[j]; if (!pb) return;
          const tol = pa.tol + pb.tol + 1e-9 * Math.max(Math.abs(pa.si), Math.abs(pb.si));
          if (Math.abs(pa.si - pb.si) > tol * 1.0001) r.e3dFallos.push({ modo, sis, SI: t, otro: otra[i] }); });
        // un giro en rad o un número adimensional no cambia con el sistema: no es fallo
        if (a.length === 0 && t.trim() === (otra[i] ?? "").trim() && /\d/.test(t) && !/\brad\b|%|°/.test(t) && sis === "IMP") r.e3dFallos.push({ modo, sis, igualEnTodos: t });
      });
    }
  }
  r.e3dFallos = r.e3dFallos.slice(0, 60);
  // en vivo: textos incoherentes que NO salen al abrir directamente en ese sistema = se quedaron del anterior
  for (const [k, v] of Object.entries(r.enVivo)) {
    const sis = k.endsWith("IMP") ? "IMP" : "SI";
    const base = new Set(r.coherencia.filter((x) => x.sistema === sis).map((x) => x.texto));
    v.rancios = (v.coh ?? []).filter((x) => !base.has(x.texto)).map((x) => x.texto).slice(0, 20); delete v.coh;
  }
  informe[id] = r;
  const nF = Math.max(...Object.values(r.fisica));
  console.log(`${id}: física peor ${(nF * 100).toExponential(2)} % | pantalla ${r.pantalla.length} | coherencia ${r.coherencia.length} | leyenda ${r.leyendaFallos.length} | hover ${r.hoverFallos.length} | 3D ${r.e3dFallos.length} (${Object.values(r.e3d?.SI ?? {}).reduce((a, x) => a + x.length, 0)} etiquetas) | en vivo ${Object.entries(r.enVivo).map(([k, v]) => `${k}:${v.ok ? "" : "SIN-SELECT "}${(v.fisica * 100).toExponential(1)}%/${v.pantalla.length}/rancios ${v.rancios?.length}`).join(" ")} | errores ${r.errores.length}`);
  writeFileSync(`${OUT}/informe.json`, JSON.stringify(informe, null, 1));
}
await nav.close();
