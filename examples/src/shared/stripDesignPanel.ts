/**
 * Panel «Franjas» del workspace: diseño de losas por franjas como SAFE (Display → Strip Design).
 *
 *  - Franjas capa A / capa B: generarlas sobre los ejes de columnas (franja de columna + central),
 *    dibujarlas con dos clics sobre la losa (ancho izq./der.), o traer las del modelo de SAFE (.$sf/.f2k).
 *  - Integra solas los resultados de las cáscaras por las que pasan (huecos y pedestales recortan el
 *    ancho, como SAFE): stripDesign.ts, validado contra SAFE 20.3 en tests/casos/franjas_vs_safe.mjs.
 *  - Acero requerido arriba/abajo (cm² y cm²/m) en Start/Middle/End de cada tramo, armado
 *    «n Ø d mm @ s cm» con la serie INEN en mm, típico + adicional (regla de SAFE), tabla CSV y el
 *    color de la intensidad de refuerzo sobre la franja en la vista 3D.
 *
 * Usa los resultados que están en pantalla (el caso/combinación activo). Unidades internas kN, m.
 */
import * as THREE from "three";
import { colorMapPalette, isDiscreteCsiPalette, legendGradientCss } from "hekatan-ui/src/color-map/getColorMap";
import {
  StripCutter, summarizeSpans, defaultStations, autoStripsFromGrid, armado, franjasDeSafe, feConMinimo,
  BARRAS_INEN_MM, type DesignStrip, type StripMeshElem, type ShellNodeForces, type StationDesign, type SpanZoneResult,
} from "./stripDesign";

type Resultado = { strip: DesignStrip; spans: { name: string; start: number; end: number }[]; est: StationDesign[]; zonas: SpanZoneResult[] };

const W = window as any;

/** Color de la PALETA ACTIVA del visor (Settings → Paleta colores) para t ∈ [0,1]: se lee del mismo
 *  gradiente que pinta la barra (`legendGradientCss`), así el mapa de acero y su leyenda usan
 *  exactamente la paleta que el usuario eligió (CSI 15 bandas discretas o continua). */
function colorPaleta(t: number): THREE.Color {
  t = Math.max(0, Math.min(1, t));
  const css = legendGradientCss();
  const st = [...css.matchAll(/rgb\((\d+),(\d+),(\d+)\)\s+([\d.]+)%/g)].map(m => ({ c: [+m[1], +m[2], +m[3]], p: +m[4] / 100 }));
  if (!st.length) return new THREE.Color().setHSL(0.66 * (1 - t), 1, 0.5);
  const pos = 1 - t;                                   // el gradiente va de t = 1 (arriba, 0 %) a t = 0 (abajo)
  if (isDiscreteCsiPalette(colorMapPalette.val)) {
    const n = st.length / 2, k = Math.min(n - 1, Math.floor(pos * n));
    const [r, g, b] = st[2 * k].c; return new THREE.Color(r / 255, g / 255, b / 255);
  }
  for (let i = 0; i < st.length - 1; i++) if (pos <= st[i + 1].p) {
    const f = (pos - st[i].p) / Math.max(st[i + 1].p - st[i].p, 1e-9);
    const c = st[i].c.map((v, j) => v + (st[i + 1].c[j] - v) * f);
    return new THREE.Color(c[0] / 255, c[1] / 255, c[2] / 255);
  }
  const [r, g, b] = st[st.length - 1].c; return new THREE.Color(r / 255, g / 255, b / 255);
}

/** Barra de colores del ACERO: sustituye a la del resultado del visor (#legend) mientras el panel
 *  pinta As, en la misma posición, con el título «As [cm²/m]» y el rango 0…máx del mapa. */
let leyendaAs: HTMLDivElement | null = null;
let leyendaAsVigilancia: any = null;
function ponerLeyendaAs(qmaxCm2m: number, titulo: string, alQuitar: () => void) {
  const orig = document.getElementById("legend") as HTMLElement | null;
  const r = orig?.getBoundingClientRect();
  if (!leyendaAs) {
    leyendaAs = document.createElement("div"); leyendaAs.id = "hk-legend-as";
    document.body.appendChild(leyendaAs);
  }
  let alto = r && r.height > 50 ? r.height : window.innerHeight * 0.5;
  let top = r && r.height > 50 ? r.top : window.innerHeight * 0.25;
  let left = r && r.height > 50 ? r.left : window.innerWidth - 420;
  // el panel de franjas tapa la barra: se baja por debajo del panel si cabe (≥ 200 px);
  // si el panel es alto (tabla de franjas), se pone a su izquierda
  const pr = document.getElementById("hk-franjas")?.getBoundingClientRect();
  if (pr && pr.height > 0 && pr.left < left + 90 && pr.bottom + 45 > top) {
    const abajo = Math.min(Math.max(top + alto, pr.bottom + 45 + 220), window.innerHeight - 110) - (pr.bottom + 45);
    if (abajo >= 200) { top = pr.bottom + 45; alto = abajo; } else left = pr.left - 95;
  }
  const discreta = isDiscreteCsiPalette(colorMapPalette.val), n = discreta ? 15 : 8;
  Object.assign(leyendaAs.style, { position: "fixed", left: `${left}px`, top: `${top}px`, width: "20px", height: `${alto}px`,
    background: legendGradientCss(), zIndex: "901", pointerEvents: "none", fontFamily: "monospace" } as any);
  let html = `<div style="position:absolute;top:-34px;left:-30px;width:110px;text-align:center;font-size:11px;color:#ddd;white-space:nowrap;background:rgba(20,22,30,.78);border-radius:2px">${titulo}</div>`;
  for (let i = 0; i <= n; i++) {
    const v = qmaxCm2m * (1 - i / n);
    html += `<div style="position:absolute;left:24px;top:${(i / n) * alto - 7}px;font-size:12px;color:#eee;white-space:nowrap;background:rgba(20,22,30,.78);padding:0 3px;border-radius:2px">— ${v.toFixed(2)}</div>`;
  }
  leyendaAs.innerHTML = html;
  leyendaAs.style.display = "block";
  if (orig) orig.style.visibility = "hidden";
  // volver a la leyenda del resultado si el usuario cambia de resultado de cáscara en el visor
  clearInterval(leyendaAsVigilancia);
  const s0 = W.__hekatanSettings?.()?.shellResults?.rawVal;
  leyendaAsVigilancia = setInterval(() => {
    if (W.__hekatanSettings?.()?.shellResults?.rawVal !== s0) { quitarLeyendaAs(); alQuitar(); }
  }, 400);
}
function quitarLeyendaAs() {
  clearInterval(leyendaAsVigilancia); leyendaAsVigilancia = null;
  if (leyendaAs) leyendaAs.style.display = "none";
  const orig = document.getElementById("legend") as HTMLElement | null;
  if (orig) orig.style.visibility = "";
}
const KGFCM2 = 98.0665; // kN/m² por kgf/cm²

function viewerCtx(): any {
  for (const el of Array.from(document.querySelectorAll("div"))) if ((el as any).__ctx?.scene) return (el as any).__ctx;
  return null;
}

/** Elementos de losa del modelo en pantalla, con sus fuerzas por nudo DEL ELEMENTO (joints, signo CSI). */
export function mallaDeLosa(): { elems: StripMeshElem[]; columnas: [number, number][]; bbox: [number, number, number, number] } | null {
  const s = W.__hekatanStates; if (!s) return null;
  const nodes: number[][] = s.nodes.val, els: number[][] = s.elements.val, ei = s.elementInputs.val ?? {}, a = s.analyzeOutputs.val ?? {};
  if (!a.bendingXXjoint) return null;
  const elems: StripMeshElem[] = [];
  const rig: number[] = [];
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  els.forEach((e, i) => {
    if (e.length !== 4 || !a.bendingXXjoint.get(i)) return;
    const xy = e.map(n => [nodes[n][0], nodes[n][1]] as [number, number]);
    const g = (k: string, j: number) => a[k]?.get(i)?.[j] ?? 0;
    const forces: ShellNodeForces[] = e.map((_, j) => ({
      M11: g("bendingXXjoint", j), M22: g("bendingYYjoint", j), M12: g("bendingXYjoint", j),
      F11: g("membraneXXjoint", j), F22: g("membraneYYjoint", j), F12: g("membraneXYjoint", j),
      V13: g("tranverseShearX", j), V23: g("tranverseShearY", j),
    }));
    const bm = ei.bendingModifiers?.get?.(i) ?? 1;
    const stiff = bm >= 10;     // «Stiff» de SAFE (pedestal): fuera del diseño, como SAFE
    if (stiff) rig.push(i);
    elems.push({ id: String(i), xy, h: ei.thicknesses?.get?.(i) ?? 0.2, design: !stiff, footing: true, forces });
    for (const [x, y] of xy) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  });
  // columnas: centro de cada grupo de elementos rígidos conexos; si no hay, nudos con carga puntual
  const columnas: [number, number][] = [];
  const hecho = new Set<number>();
  for (const i of rig) {
    if (hecho.has(i)) continue;
    const grupo = [i]; hecho.add(i);
    for (let k = 0; k < grupo.length; k++) for (const j of rig) {
      if (hecho.has(j)) continue;
      if (els[j].some(n => els[grupo[k]].includes(n))) { hecho.add(j); grupo.push(j); }
    }
    const ns = [...new Set(grupo.flatMap(g => els[g]))];
    columnas.push([ns.reduce((t, n) => t + nodes[n][0], 0) / ns.length, ns.reduce((t, n) => t + nodes[n][1], 0) / ns.length]);
  }
  if (!columnas.length) {
    const ld: Map<number, number[]> | undefined = s.nodeInputs.val?.loads;
    ld?.forEach((v, n) => { if (Math.abs(v[2]) > 1e-9) columnas.push([nodes[n][0], nodes[n][1]]); });
  }
  return { elems, columnas, bbox: [x0, x1, y0, y1] };
}

const agrupar = (v: number[], tol: number) => {
  const s = [...v].sort((a, b) => a - b); const out: number[][] = [];
  for (const x of s) { const g = out[out.length - 1]; if (g && x - g[g.length - 1] <= tol) g.push(x); else out.push([x]); }
  return out.map(g => g.reduce((a, b) => a + b, 0) / g.length);
};

/** tramos: se parte la franja donde cruza una línea de columnas perpendicular (columna dentro del ancho). */
function tramos(st: DesignStrip, columnas: [number, number][]) {
  const [ax, ay] = st.start, [bx, by] = st.end, L = Math.hypot(bx - ax, by - ay);
  const tx = (bx - ax) / L, ty = (by - ay) / L;
  const cortes = columnas.map(([x, y]) => {
    const s = (x - ax) * tx + (y - ay) * ty, w = -(x - ax) * ty + (y - ay) * tx;
    return w <= st.wStartLeft + 1e-6 && w >= -st.wStartRight - 1e-6 && s > 1e-3 && s < L - 1e-3 ? s : null;
  }).filter((s): s is number => s !== null);
  const pts = [0, ...agrupar(cortes, 0.05), L];
  const out: { name: string; start: number; end: number }[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const volado = (i === 0 && pts.length > 2 && cortes.length > 0 && pts[1] - pts[0] < 0.25 * (pts[2] - pts[1])) ||
                   (i === pts.length - 2 && pts.length > 2 && cortes.length > 0 && pts[i + 1] - pts[i] < 0.25 * (pts[i] - pts[i - 1]));
    out.push({ name: volado ? `Volado ${i === 0 ? "inicial" : "final"}` : `Tramo ${i + 1}`, start: pts[i], end: pts[i + 1] });
  }
  return out;
}

export function montarPanelFranjas() {
  if (document.getElementById("hk-franjas-btn")) return;
  const btn = document.createElement("button");
  btn.id = "hk-franjas-btn"; btn.textContent = "▦ Franjas";
  btn.title = "Diseño de losas por franjas (como SAFE: franjas A/B, acero arriba/abajo, armado)";
  btn.style.cssText = "position:fixed;top:60px;right:12px;z-index:950;padding:4px 10px;background:#1f3b5a;color:#fff;border:1px solid #4a7fb0;border-radius:4px;font:12px sans-serif;cursor:pointer";
  document.body.appendChild(btn);

  const pan = document.createElement("div");
  pan.id = "hk-franjas";
  pan.style.cssText = "position:fixed;top:90px;right:12px;z-index:950;width:500px;max-height:78vh;overflow:auto;background:rgba(24,28,34,.96);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:12px sans-serif;padding:8px;display:none";
  const opt = (v: number[], sel: number) => v.map(d => `<option value="${d}"${d === sel ? " selected" : ""}>Ø${d} mm</option>`).join("");
  pan.innerHTML = `
  <div style="display:flex;justify-content:space-between;align-items:center"><b>Diseño de losa (como SAFE)</b><span id="hkf-x" style="cursor:pointer">✕</span></div>
  <div style="margin:6px 0;color:#9cc">Resultados: <span id="hkf-caso"></span></div>
  <div style="margin:4px 0">Método <select id="hkf-met"><option value="franjas">Franjas (strip based)</option><option value="fe">Elementos finitos (FE based)</option></select>
    <label><input id="hkf-min" type="checkbox"> imponer mínimo</label></div>
  <fieldset id="hkf-fs-franjas" style="border:1px solid #445;padding:4px"><legend>Franjas</legend>
    <button id="hkf-auto">Generar sobre ejes de columnas</button>
    <button id="hkf-dib">Dibujar franja</button>
    <label>capa <select id="hkf-capa"><option>A</option><option>B</option></select></label>
    <label>izq <input id="hkf-wl" type="number" value="0.75" step="0.05" style="width:48px"></label>
    <label>der <input id="hkf-wr" type="number" value="0.75" step="0.05" style="width:48px"></label> m
    <div style="margin-top:4px"><label>Traer de SAFE (.$sf/.f2k) <input id="hkf-safe" type="file" accept=".$sf,.f2k,.txt,.F2K"></label>
    <button id="hkf-borrar">Borrar</button></div>
    <div id="hkf-lista" style="color:#aaa;margin-top:3px"></div>
  </fieldset>
  <fieldset style="border:1px solid #445;padding:4px"><legend>Diseño</legend>
    <label>Norma <select id="hkf-norma"><option>ACI 318-19</option><option>ACI 318-14</option></select></label>
    <label>f'c <input id="hkf-fc" type="number" value="210" style="width:50px"></label>
    <label>fy <input id="hkf-fy" type="number" value="4200" style="width:56px"></label> kgf/cm²<br>
    <label>recubr. sup <input id="hkf-rt" type="number" value="1.5" step="0.5" style="width:40px"></label>
    <label>inf <input id="hkf-rb" type="number" value="1.5" step="0.5" style="width:40px"></label> cm
    <label>Ø cálculo d <select id="hkf-dbd">${opt(BARRAS_INEN_MM, 18)}</select></label>
    <label>capa interior <select id="hkf-inner"><option>B</option><option>A</option></select></label>
  </fieldset>
  <fieldset style="border:1px solid #445;padding:4px"><legend>Armado</legend>
    <label>Varilla <select id="hkf-db">${opt(BARRAS_INEN_MM, 12)}</select></label>
    <label><input id="hkf-tip" type="checkbox"> típico (malla base)</label>
    <select id="hkf-tipd">${opt(BARRAS_INEN_MM, 12)}</select> @ <input id="hkf-tips" type="number" value="20" style="width:40px"> cm
    <div>Ver en 3D: <select id="hkf-cara"><option value="top">superior</option><option value="bot">inferior</option></select>
    <select id="hkf-verCapa"><option value="A">A (dir 1 = X)</option><option value="B">B (dir 2 = Y)</option><option value="AB">A y B</option></select></div>
    <div style="color:#999;font-size:11px">FE: acero por unidad de ancho en cada nudo de cada elemento (Wood-Armer, sin promediar), como SAFE «Finite Element Based»; el armado se da por metro.<br>n = ⌈As adicional / Ab⌉ (regla de SAFE). La separación «@ s» = ancho/n redondeada hacia abajo a 2.5 cm es convención de Hekatan (SAFE solo da n).</div>
  </fieldset>
  <div style="margin:6px 0"><button id="hkf-calc" style="background:#2d6a2d;color:#fff">Calcular acero</button>
  <button id="hkf-csv">Tabla CSV</button></div>
  <div id="hkf-res"></div>`;
  document.body.appendChild(pan);
  const $ = (id: string) => pan.querySelector("#" + id) as any;
  btn.onclick = () => {
    const abrir = pan.style.display === "none";
    pan.style.display = abrir ? "block" : "none"; refrescarCaso();
    if (abrir) { if (esFE() ? fe.length : res.length) dibujar(); } else limpiar();
  };
  $("hkf-x").onclick = () => { pan.style.display = "none"; limpiar(); };

  let franjas: DesignStrip[] = [];
  let res: Resultado[] = [];
  let fe: { xy: [number, number][]; v: { top1: number; bot1: number; top2: number; bot2: number; amin: number }[] }[] = [];
  const esFE = () => $("hkf-met").value === "fe";
  const feVal = (v: any, cara: string, dir: number) => {
    let t = v["top" + dir], b = v["bot" + dir];
    if ($("hkf-min").checked) [t, b] = feConMinimo(t, b, v.amin);
    return cara === "top" ? t : b;
  };
  const tipico = () => $("hkf-tip").checked ? { dmm: +$("hkf-tipd").value, s: +$("hkf-tips").value / 100 } : null;
  const dibujarFE = () => {
    const ctx = viewerCtx(); if (!ctx) return;
    if (!grupo.parent) ctx.scene.add(grupo);
    grupo.clear();
    const cara = $("hkf-cara").value, dir = $("hkf-verCapa").value === "B" ? 2 : 1, tip = tipico();
    const asTip = tip ? Math.PI * (tip.dmm / 1000) ** 2 / 4 / tip.s : 0;
    let qmax = 1e-9;
    for (const e of fe) for (const v of e.v) qmax = Math.max(qmax, feVal(v, cara, dir) - asTip);
    ponerLeyendaAs(qmax * 1e4, tip ? "As adicional [cm²/m]" : "As [cm²/m]", limpiar);
    // Contorno por TEXTURA 1D de la paleta (no por color de vértice): se interpola el VALOR y el color
    // se busca por píxel, así las 15 bandas de CSI salen como bandas (con color de vértice se
    // mezclaban). Texel 0 = gris (≤ típico), 1…256 = paleta.
    const NT = 257, px = new Uint8Array(NT * 4);
    for (let i = 0; i < NT; i++) {
      const c = i === 0 ? { r: 0x9a / 255, g: 0x9a / 255, b: 0x9a / 255 } : colorPaleta((i - 1) / 255);
      px.set([Math.round(c.r * 255), Math.round(c.g * 255), Math.round(c.b * 255), 255], 4 * i);
    }
    const tex = new THREE.DataTexture(px, NT, 1, THREE.RGBAFormat);
    tex.magFilter = tex.minFilter = THREE.NearestFilter; (tex as any).colorSpace = (THREE as any).SRGBColorSpace; tex.needsUpdate = true;
    const u = (q: number) => q <= 0 ? 0.5 / NT : (1 + Math.min(q / qmax, 1) * 254.999 + 0.5) / NT;
    const pos: number[] = [], uv: number[] = [];
    for (const e of fe) {
      const P = e.xy.map(([x, y]) => [x, y, 0.02]);
      const U = e.v.map(v => u(feVal(v, cara, dir) - asTip));
      for (const tri of [[0, 1, 2], [0, 2, 3]]) for (const n of tri) { pos.push(...P[n]); uv.push(U[n], 0.5); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    grupo.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true, opacity: 0.9, depthTest: false })));
    let best: any = null;
    for (const e of fe) e.v.forEach((v, k) => { const q = feVal(v, cara, dir); if (!best || q > best.q) best = { q, p: e.xy[k] }; });
    if (best && best.q > asTip) {
      const a = armado(best.q, 1.0, +$("hkf-db").value, tip).texto;
      grupo.add(etiqueta(`máx ${(best.q * 1e4).toFixed(2)} cm²/m: ${a} por metro`, new THREE.Vector3(best.p[0], best.p[1], 0.02)));
    }
    ctx.render?.();
  };
  const grupo = new THREE.Group(); grupo.name = "hk-franjas";

  const limpiar = () => { grupo.clear(); quitarLeyendaAs(); viewerCtx()?.render?.(); };
  const refrescarCaso = () => { $("hkf-caso").textContent = `${W.__hekatanStates?.activeLoadCase?.val ?? "?"} (caso/combinación en pantalla)`; };
  const lista = () => {
    const nA = franjas.filter(f => f.layer === "A").length, nB = franjas.length - nA;
    $("hkf-lista").textContent = franjas.length ? `${franjas.length} franjas (capa A ${nA}, capa B ${nB}): ${franjas.map(f => f.name).join(" ")}` : "sin franjas";
  };

  const dibujar = () => {
    if (esFE()) return dibujarFE();
    const ctx = viewerCtx(); if (!ctx) return;
    if (!grupo.parent) ctx.scene.add(grupo);
    grupo.clear();
    const cara = $("hkf-cara").value as "top" | "bot", ver = $("hkf-verCapa").value as string;
    let qmax = 1e-9;
    for (const r of res) for (const e of r.est) qmax = Math.max(qmax, (cara === "top" ? e.AsTop : e.AsBot) / (e.width || 1));
    if (res.length) ponerLeyendaAs(qmax * 1e4, "As [cm²/m]", limpiar); else quitarLeyendaAs();
    const z = 0.02;
    for (const f of franjas) {
      if (ver !== "AB" && f.layer !== ver) continue;
      const [ax, ay] = f.start, [bx, by] = f.end, L = Math.hypot(bx - ax, by - ay), tx = (bx - ax) / L, ty = (by - ay) / L;
      const P = (s: number, w: number) => new THREE.Vector3(ax + s * tx - w * ty, ay + s * ty + w * tx, z);
      // contorno
      const cont = [P(0, -f.wStartRight), P(L, -f.wEndRight), P(L, f.wEndLeft), P(0, f.wStartLeft), P(0, -f.wStartRight)];
      grupo.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(cont), new THREE.LineBasicMaterial({ color: f.layer === "A" ? 0xff8800 : 0x00c0ff })));
      const r = res.find(x => x.strip === f);
      if (!r) continue;
      for (let i = 0; i < r.est.length - 1; i++) {
        const a = r.est[i], b = r.est[i + 1];
        const q = Math.max((cara === "top" ? a.AsTop : a.AsBot) / (a.width || 1), (cara === "top" ? b.AsTop : b.AsBot) / (b.width || 1));
        const c = colorPaleta(q / qmax);
        const g = new THREE.BufferGeometry().setFromPoints([P(a.station, -f.wStartRight), P(b.station, -f.wStartRight), P(b.station, f.wStartLeft), P(a.station, -f.wStartRight), P(b.station, f.wStartLeft), P(a.station, f.wStartLeft)]);
        grupo.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthTest: false })));
      }
      // etiqueta por tramo: el armado que gobierna
      const db = +$("hkf-db").value, tip = $("hkf-tip").checked ? { dmm: +$("hkf-tipd").value, s: +$("hkf-tips").value / 100 } : null;
      for (const sp of r.spans) {
        const zs = r.zonas.filter(zz => zz.span === sp.name);
        const zmax = zs.reduce((m, zz) => ((cara === "top" ? zz.AsTop : zz.AsBot) > (cara === "top" ? m.AsTop : m.AsBot) ? zz : m), zs[0]);
        if (!zmax) continue;
        const As = cara === "top" ? zmax.AsTop : zmax.AsBot;
        const anch = (cara === "top" ? zmax.widthTop : zmax.widthBot) || anchoEn(r, sp, zmax.location);
        const t = armado(As, anch, db, tip).texto;
        grupo.add(etiqueta(t, P((sp.start + sp.end) / 2, 0)));
      }
    }
    ctx.render?.();
  };

  const anchoEn = (r: Resultado, sp: { start: number; end: number }, loc: string) => {
    const L = sp.end - sp.start;
    const cand = r.est.filter(e => {
      const rel = (e.station - sp.start) / L;
      return rel >= -1e-6 && rel <= 1 + 1e-6 && (loc === "Start" ? rel <= 0.25 : loc === "End" ? rel >= 0.75 : rel > 0.25 && rel < 0.75);
    });
    const ws = cand.map(e => e.width).filter(w => w > 0);
    return ws.length ? Math.min(...ws) : (r.strip.wStartLeft + r.strip.wStartRight);
  };

  const etiqueta = (txt: string, p: THREE.Vector3) => {
    const W0 = Math.max(512, Math.ceil(txt.length * 19 / 64) * 64);
    const cv = document.createElement("canvas"); cv.width = W0; cv.height = 64;
    const g = cv.getContext("2d")!; g.fillStyle = "rgba(0,0,0,.65)"; g.fillRect(0, 0, W0, 64);
    g.fillStyle = "#fff"; g.font = "bold 34px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, W0 / 2, 34);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), depthTest: false }));
    sp.scale.set(3.0 * W0 / 512, 0.38, 1); sp.position.copy(p); sp.position.z += 0.05; sp.renderOrder = 999;
    return sp;
  };

  $("hkf-auto").onclick = () => {
    const m = mallaDeLosa(); if (!m) return alert("Calcula el modelo primero (hacen falta los momentos de las cáscaras).");
    const xs = agrupar(m.columnas.map(c => c[0]), 0.3), ys = agrupar(m.columnas.map(c => c[1]), 0.3);
    if (xs.length < 2 || ys.length < 2) return alert("No encontré ejes de columnas (pedestales rígidos o cargas puntuales).");
    const [x0, x1, y0, y1] = m.bbox;
    franjas = autoStripsFromGrid(xs, ys, x0, x1, y0, y1); res = []; lista(); dibujar();
  };
  $("hkf-borrar").onclick = () => { franjas = []; res = []; lista(); limpiar(); dibujar(); $("hkf-res").innerHTML = ""; };
  $("hkf-safe").onchange = async (ev: any) => {
    const f = ev.target.files?.[0]; if (!f) return;
    franjas = franjasDeSafe(await f.text()); res = []; lista(); dibujar();
  };

  // dibujar con dos clics sobre el plano de la losa (z = 0)
  $("hkf-dib").onclick = () => {
    const ctx = viewerCtx(); if (!ctx) return;
    const cv: HTMLCanvasElement = ctx.rendererElm; const pts: THREE.Vector3[] = [];
    W.__hekatanBloquearVentana = true;
    const alClic = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      const nd = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      const ray = new THREE.Raycaster(); ray.setFromCamera(nd, ctx.camera);
      const p = new THREE.Vector3(); if (!ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), p)) return;
      e.stopPropagation(); pts.push(p);
      if (pts.length === 2) {
        cv.removeEventListener("click", alClic, true); W.__hekatanBloquearVentana = false;
        const capa = $("hkf-capa").value as "A" | "B", wl = +$("hkf-wl").value, wr = +$("hkf-wr").value;
        const n = franjas.filter(f => f.layer === capa).length + 1;
        franjas.push({ name: `S${capa}${n}`, layer: capa, start: [pts[0].x, pts[0].y], end: [pts[1].x, pts[1].y], wStartLeft: wl, wStartRight: wr, wEndLeft: wl, wEndRight: wr });
        lista(); dibujar();
      }
    };
    cv.addEventListener("click", alClic, true);
  };

  const calcular = () => {
    const m = mallaDeLosa(); if (!m) return alert("Calcula el modelo primero.");
    refrescarCaso();
    const cutter = new StripCutter(m.elems, {
      code: $("hkf-norma").value, fc: +$("hkf-fc").value * KGFCM2, fy: +$("hkf-fy").value * KGFCM2,
      coverTop: +$("hkf-rt").value / 100, coverBot: +$("hkf-rb").value / 100, barSize: +$("hkf-dbd").value / 1000,
      innerLayer: $("hkf-inner").value, N: 1000, M: 1, mergeTol: 0.001,
    });
    if (esFE()) {
      fe = m.elems.filter(e => e.design).map(e => ({ xy: e.xy, v: e.forces.map(f => cutter.feNode(f, e.h)) }));
      tabla(); dibujar(); return;
    }
    res = franjas.map(strip => {
      const spans = tramos(strip, m.columnas);
      const cortes = new Set(spans.flatMap(s => [s.start, s.end]).map(x => +x.toFixed(6)));
      const stn = [...new Set([...defaultStations(strip, m.elems), ...cortes].map(x => +x.toFixed(6)))].sort((a, b) => a - b);
      const est = stn.map(s => cutter.designStation(strip, s));
      return { strip, spans, est, zonas: summarizeSpans(est, spans, 1e-4) };
    });
    tabla(); dibujar();
  };
  $("hkf-calc").onclick = calcular;
  $("hkf-met").onchange = () => { $("hkf-fs-franjas").style.display = esFE() ? "none" : ""; limpiar(); $("hkf-res").innerHTML = ""; if (esFE() ? fe.length : res.length) { tabla(); dibujar(); } };
  for (const id of ["hkf-cara", "hkf-verCapa", "hkf-db", "hkf-tip", "hkf-tipd", "hkf-tips", "hkf-min"]) $(id).onchange = () => { tabla(); dibujar(); };

  const filasFE = () => {
    const db = +$("hkf-db").value, tip = tipico(); const out: string[][] = [];
    for (const [dir, nom] of [[1, "X (dir 1, capa A)"], [2, "Y (dir 2, capa B)"]] as [number, string][]) for (const cara of ["top", "bot"]) {
      let best: any = null;
      for (const e of fe) e.v.forEach((v, k) => { const q = feVal(v, cara, dir); if (!best || q > best.q) best = { q, p: e.xy[k] }; });
      if (!best) continue;
      const a = armado(best.q, 1.0, db, tip);
      out.push([nom, cara === "top" ? "superior" : "inferior", (best.q * 1e4).toFixed(2), `(${best.p[0].toFixed(2)}, ${best.p[1].toFixed(2)})`, a.texto]);
    }
    return out;
  };
  const filas = () => {
    if (esFE()) return filasFE();
    const db = +$("hkf-db").value, tip = $("hkf-tip").checked ? { dmm: +$("hkf-tipd").value, s: +$("hkf-tips").value / 100 } : null;
    const out: string[][] = [];
    for (const r of res) for (const z of r.zonas) {
      const sp = r.spans.find(s => s.name === z.span)!;
      const wt = z.widthTop || anchoEn(r, sp, z.location), wb = z.widthBot || wt;
      const at = armado(z.AsTop, wt, db, tip), ab = armado(z.AsBot, wb, db, tip);
      out.push([r.strip.name, r.strip.layer, z.span, z.location, wt.toFixed(2),
        (z.AsTop * 1e4).toFixed(2), (z.AsTop * 1e4 / wt).toFixed(2), at.texto,
        (z.AsBot * 1e4).toFixed(2), (z.AsBot * 1e4 / wb).toFixed(2), ab.texto]);
    }
    return out;
  };
  const CAB = ["Franja", "Capa", "Tramo", "Zona", "Ancho m", "As sup cm²", "cm²/m", "Armado sup" + ($("hkf-tip").checked ? " (adicional)" : ""), "As inf cm²", "cm²/m", "Armado inf" + ($("hkf-tip").checked ? " (adicional)" : "")];
  const CAB_FE = ["Dirección", "Cara", "As máx cm²/m", "Nudo (x, y) m", "Armado por metro"];
  const tabla = () => {
    const f = filas(); if (!f.length) { $("hkf-res").innerHTML = ""; return; }
    if (esFE()) {
      const tip = $("hkf-tip").checked ? `Típico: Ø${$("hkf-tipd").value} mm @ ${$("hkf-tips").value} cm; armado = ADICIONAL. ` : "";
      $("hkf-res").innerHTML = `<div style="color:#9c9">${tip}Máximos del mapa (cada nudo de cada elemento).</div><table style="border-collapse:collapse;font-size:11px;width:100%">
        <tr>${CAB_FE.map(c => `<th style="border-bottom:1px solid #556;text-align:left;padding:1px 3px">${c}</th>`).join("")}</tr>
        ${f.map(r => `<tr>${r.map((c, i) => `<td style="padding:1px 3px;${i === 4 ? "color:#ffd27a" : ""}">${c}</td>`).join("")}</tr>`).join("")}</table>`;
      return;
    }
    const tip = $("hkf-tip").checked ? `Típico: Ø${$("hkf-tipd").value} mm @ ${$("hkf-tips").value} cm arriba y abajo; se muestra el ADICIONAL.` : "";
    $("hkf-res").innerHTML = `<div style="color:#9c9">${tip}</div><table style="border-collapse:collapse;font-size:11px;width:100%">
      <tr>${CAB.map(c => `<th style="border-bottom:1px solid #556;text-align:left;padding:1px 3px">${c}</th>`).join("")}</tr>
      ${f.map(r => `<tr>${r.map((c, i) => `<td style="padding:1px 3px;${i === 7 || i === 10 ? "color:#ffd27a" : ""}">${c}</td>`).join("")}</tr>`).join("")}</table>`;
  };
  $("hkf-csv").onclick = () => {
    let csv: string;
    if (esFE()) {
      const rows = [["x m", "y m", "As sup X cm²/m", "As inf X cm²/m", "As sup Y cm²/m", "As inf Y cm²/m"]];
      for (const e of fe) e.v.forEach((v, k) => rows.push([e.xy[k][0].toFixed(3), e.xy[k][1].toFixed(3),
        ...([["top", 1], ["bot", 1], ["top", 2], ["bot", 2]] as [string, number][]).map(([c, d]) => (feVal(v, c, d) * 1e4).toFixed(3))]));
      csv = rows.map(r => r.join(";")).join("\n");
    } else {
      const f = filas(); if (!f.length) return;
      csv = [CAB, ...f].map(r => r.join(";")).join("\n");
    }
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
    a.download = esFE() ? "acero_fe_nudos.csv" : "armado_franjas.csv"; a.click();
  };
  lista();
  let palPrev = colorMapPalette.val;
  setInterval(() => { if (colorMapPalette.val !== palPrev) { palPrev = colorMapPalette.val; if (leyendaAs?.style.display === "block") dibujar(); } }, 500);
  // para pruebas y para el ribbon
  W.__hekatanFranjas = { abrir: () => { pan.style.display = "block"; refrescarCaso(); }, get franjas() { return franjas; }, set franjas(v: DesignStrip[]) { franjas = v; res = []; lista(); dibujar(); },
    calcular, dibujar, resultados: () => res, generar: () => $("hkf-auto").click(), filas,
    metodo: (m: "franjas" | "fe") => { $("hkf-met").value = m; $("hkf-met").onchange(); }, fe: () => fe, cerrar: () => $("hkf-x").onclick() };
}
