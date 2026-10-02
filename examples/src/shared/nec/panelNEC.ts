/**
 * Panel «Sismo NEC» del workspace (30-sep-2026): estático + espectral NEC-15 / borrador sobre el modelo EN PANTALLA.
 * Una carpeta con los datos del sitio y un botón; los resultados salen en una ventana flotante con:
 *   - cortante basal estático y dinámico, control Vdin/Vest y factor de escala;
 *   - tabla por piso: W, F, V estático, V dinámico escalado, CM, CR, excentricidad, derivas y relación máx/prom;
 *   - planta con el CM (●) y el CR (✚) de cada piso: al cambiar las secciones y recalcular, el CR se mueve;
 *   - chequeo de modos (1 y 2 traslacionales con RZ < 10 %, 3 rotacional).
 * Fa, Fd y Fs se escriben a mano (Tablas 3-5 de la NEC-15, 3.3-3.5 del borrador): por defecto, Portoviejo suelo D.
 */
import van, { type State } from "vanjs-core";
import { deform } from "hekatan-fem";
import { pisosDeModelo } from "./pisos";
import { centrosDeRigidez } from "./derivas";
import { calcularJueces, type Jueces } from "./jueces";
import { calcularNEC, agrietar, enMasa, type ResultadoNEC } from "./calculo";
import { matrizDePiso, type ResultadoAguiar } from "./aguiar";
import { NOMBRES, type ClaveIrr } from "./irregularidades";
import { jointMass } from "hekatan-fem";
import { PORTOVIEJO_D, type Norma } from "./estatico";

export interface ModeloNEC { nodes: State<any[]>; elements: State<any[]>; nodeInputs: State<any>; elementInputs: State<any> }

let _sitio: any = null;
const _vivo = { on: false, jueces: false };
let _tVivo: any = 0, _historia: [number, number][][] = [], _programar: (ya?: boolean) => void = () => {}, _oyente = false;

/** una línea: qué irregularidades hay y qué hacen (NEC-15 φP·φE; borrador Ax) */
function lineaIrr(r: ResultadoNEC): string {
  const I = r.irregularidades, si = I.lista.filter((q) => q.valor).map((q) => q.clave + (q.manual ? "*" : ""));
  const efecto = r.sitio.norma === "NEC-15" ? `φP ${I.phiP.toFixed(2)} · φE ${I.phiE.toFixed(2)}`
    : I.Ax ? `Ax máx X ${Math.max(...I.Ax.X).toFixed(2)} · Y ${Math.max(...I.Ax.Y).toFixed(2)}` : "Ax = 1";
  return `Irregularidades: ${si.length ? si.join(" ") : "ninguna"} → ${efecto}`;
}

export function montarNEC(folder: any, estado: ModeloNEC) {
  const f = folder.addFolder({ title: "🌎 Sismo NEC (estático + espectral)", expanded: false });
  const d15 = PORTOVIEJO_D["NEC-15"];
  // Los datos del sitio SOBREVIVEN a la regeneración del modelo (1-oct-2026): al cambiar un parámetro con
  // regenOnChange (p. ej. el número de muros) el workspace vuelve a montar este panel, y antes volvía a Portoviejo
  // suelo D sin agrietar — el cálculo siguiente salía con otro sitio sin avisar.
  const p = _sitio ?? {
    norma: 0,                      // 0 NEC-15, 1 borrador 2023
    Z: d15.Z, Fa: d15.Fa, Fd: d15.Fd, Fs: d15.Fs, eta: d15.eta!, r: d15.r,
    I: 1.0, R: 8, sistema: 0, irregular: -1, nModos: 12, agrietadas: 0, Cd: 5.5, limDeriva: 0.015, modal: "CQC", direccional: "independiente",
    P1: -1, P2: -1, P3: -1, P4: -1, P5: -1, E1: -1, E2: -1, E3: -1, E4: -1, E5: -1,
    info: "—",
  };
  _sitio = p;
  f.addBinding(p, "norma", { label: "Norma", options: { "NEC-15 (oficial)": 0, "Borrador NEC-SE-DS 2023": 1 } }).on("change", () => {
    const d = PORTOVIEJO_D[p.norma ? "borrador" : "NEC-15"];
    Object.assign(p, { Z: d.Z, Fa: d.Fa, Fd: d.Fd, Fs: d.Fs, r: d.r }); f.refresh();
  });
  const fs = f.addFolder({ title: "Sitio (Portoviejo, suelo D)", expanded: false });
  fs.addBinding(p, "Z", { label: "Z", min: 0.15, max: 0.6, step: 0.05 });
  fs.addBinding(p, "Fa", { label: "Fa", min: 0.5, max: 2, step: 0.01 });
  fs.addBinding(p, "Fd", { label: "Fd", min: 0.5, max: 3, step: 0.01 });
  fs.addBinding(p, "Fs", { label: "Fs", min: 0.5, max: 3, step: 0.01 });
  fs.addBinding(p, "eta", { label: "η (NEC-15)", options: { "Costa 1.80": 1.8, "Sierra 2.48": 2.48, "Oriente 2.60": 2.6 } });
  fs.addBinding(p, "r", { label: "r", min: 1, max: 1.5, step: 0.1 });
  f.addBinding(p, "I", { label: "I importancia", options: { "1.0 otras": 1.0, "1.3 ocupación especial": 1.3, "1.5 esenciales": 1.5 } });
  f.addBinding(p, "R", { label: "R", min: 1, max: 8, step: 0.5 });
  f.addBinding(p, "sistema", { label: "Ta (Ct, α)", options: { "Pórtico H.A. sin muros": 0, "Pórtico H.A. con muros (dual)": 1 } });
  f.addBinding(p, "irregular", { label: "Irregular (85 %)", options: { "auto (por las irregularidades)": -1, "sí": 1, "no (80 %)": 0 } });
  const fb = f.addFolder({ title: "Borrador 2023: Cd y deriva límite", expanded: false });
  fb.addBinding(p, "Cd", { label: "Cd (Tabla 4.4)", min: 1, max: 8, step: 0.25 });
  fb.addBinding(p, "limDeriva", { label: "Deriva límite (Tabla 4.3)", options: { "0.015 paredes rígidas (cat. I-II)": 0.015, "0.018 paredes livianas (cat. I-II)": 0.018, "0.012 paredes rígidas (cat. III)": 0.012, "0.010 (cat. IV)": 0.010 } });
  const fi = f.addFolder({ title: "Irregularidades (automático · corregir)", expanded: false });
  const OPC = { "auto": -1, "sí": 1, "no": 0 };
  for (const k of ["P1", "P2", "P3", "P4", "P5", "E1", "E2", "E3", "E4", "E5"] as ClaveIrr[])
    fi.addBinding(p as any, k, { label: `${k[0] === "P" ? "Planta" : "Elevación"} ${k.slice(1)} · ${NOMBRES[k]}`, options: OPC });
  f.addBinding(p, "nModos", { label: "N° de modos", min: 3, max: 60, step: 1 });
  // como ETABS: «Modal Combination» y «Directional Combination» del caso espectral (validadas con SAP2000, 0.000 %)
  f.addBinding(p as any, "modal", { label: "Combinación modal", options: { "CQC (ζ 5 %)": "CQC", "SRSS": "SRSS", "ABS (suma absoluta)": "ABS" } });
  f.addBinding(p as any, "direccional", { label: "Combinación direccional", options: { "independiente (NEC-15 §3.5.1)": "independiente",
    "100 % + 30 % (borrador §5.5.1.2a)": "100-30", "SRSS (= CQC3, ETABS)": "SRSS", "ABS (ETABS)": "ABS" } });
  f.addBinding(p, "agrietadas", { label: "Inercias agrietadas §6.1.6", options: { "no (brutas)": 0, "sí: vigas 0.5 · col. 0.8 · muros 0.6": 1 } });
  f.addBinding(p, "info", { label: "", readonly: true, multiline: true, rows: 6 });
  f.addButton({ title: "▶ Calcular NEC" }).on("click", () => correr());
  f.addButton({ title: "📋 Tabla por piso y planta CM/CR" }).on("click", () => { if (ultimo) mostrar(ultimo); });
  f.addButton({ title: "🧮 Matriz de piso (Aguiar) u_x · u_y · θz" }).on("click", () => aguiar());
  // ── PLANTA CM / CR EN VIVO (1-oct-2026): al cambiar muros, secciones o la planta, se recalculan SOLO el CM y el CR
  // (3 cargas unitarias por piso) y se redibuja la planta. Sirve para TANTEAR hasta que el CR se acerque al CM.
  const vivo = _vivo;   // sobrevive a la regeneración del modelo (cambiar el n.º de muros vuelve a montar el panel)
  f.addBinding(vivo, "on", { label: "🎯 Planta CM/CR en vivo" }).on("change", () => { if (vivo.on) programar(true); else ventanaVivo().ocultar(); });
  f.addBinding(vivo, "jueces", { label: "⚖ 4 jueces en vivo" }).on("change", () => { if (vivo.jueces) programar(true); else panelJueces().ocultar(); });
  function programar(ya = false) { if (!vivo.on && !vivo.jueces) return; clearTimeout(_tVivo); _tVivo = setTimeout(cmcr, ya ? 0 : 600); }
  _programar = programar;                        // el oyente (uno solo) llama siempre al panel montado más reciente
  if (!_oyente) { _oyente = true; van.derive(() => { estado.nodes.val; estado.elements.val; estado.elementInputs.val; estado.nodeInputs.val; _programar(); }); }
  if (vivo.on || vivo.jueces) programar(true);
  function cmcr() {
    const nodes = estado.nodes.val, elements = estado.elements.val;
    if (!nodes?.length) return;
    if (vivo.jueces) {
      try {
        const eiM = enMasa(estado.elementInputs.val), ei = p.agrietadas ? agrietar(nodes, elements, eiM) : eiM;
        panelJueces().mostrar(calcularJueces(nodes, elements, estado.nodeInputs.val ?? {}, ei, sitio() as any), nodes, elements);
      } catch (err) { console.warn("[jueces]", err); }
      if (!vivo.on) return;
    }
    const t0 = performance.now();
    try {
      const eiM = enMasa(estado.elementInputs.val), ei = p.agrietadas ? agrietar(nodes, elements, eiM) : eiM;
      const ni0 = estado.nodeInputs.val ?? {};
      const aM = (o: any) => (o instanceof Map ? o : new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v])));
      const ni = { ...ni0, supports: aM(ni0.supports), diaphragms: aM(ni0.diaphragms) };
      const pisos = pisosDeModelo(nodes, elements, ni, ei);
      const resolver = (loads: Map<number, any>) => deform(nodes as any, elements as any, { ...ni, loads } as any, ei).deformations as any;
      const cr = centrosDeRigidez(nodes, pisos, ni.diaphragms, resolver);
      ventanaVivo().mostrar({ pisos, cr } as any, nodes, elements, _historia, performance.now() - t0);
      _historia = [cr.map((c) => [c[0], c[1]] as [number, number]), ..._historia].slice(0, 6);
    } catch (err) { console.warn("[CM/CR en vivo]", err); }
  }

  function aguiar() {
    if (!ultimo) correr();
    if (!ultimo) return;
    const nodes = estado.nodes.val, elements = estado.elements.val, ni = estado.nodeInputs.val;
    const eiM = enMasa(estado.elementInputs.val), ei = p.agrietadas ? agrietar(nodes, elements, eiM) : eiM;
    const t0 = performance.now();
    try {
      const masas = jointMass(nodes as any, elements as any, ei, { incluyeElementos: 1 });
      const a = matrizDePiso(nodes, elements, ni, ei, ultimo.pisos, masas);
      p.info = `Aguiar: K_E ${a.KE.length}×${a.KE.length} por condensación (${((performance.now() - t0) / 1000).toFixed(1)} s)
T reducido ${a.T.slice(0, 3).map((t) => t.toFixed(4)).join(" · ")} s · modal ${ultimo.modos.slice(0, 3).map((m) => m.T.toFixed(4)).join(" · ")} s
ρ máx: X ${Math.max(...a.pisos.map((q) => q.rhoX)).toFixed(3)} · Y ${Math.max(...a.pisos.map((q) => q.rhoY)).toFixed(3)} (0 = sin torsión)`;
      ventana().mostrarAguiar(a, ultimo);
    } catch (err: any) { p.info = "✗ Aguiar: " + (err?.message ?? err); console.error("[Aguiar]", err); }
    f.refresh();
  }

  let ultimo: ResultadoNEC | null = null;
  function sitio() {
    const norma: Norma = p.norma ? "borrador" : "NEC-15";
    // Ct y α: NEC-15 §6.3.3 (0.055/0.9 sin muros, 0.055/0.75 con muros); borrador Tabla 6.2 (0.0466/0.90 pórtico H.A.)
    // borrador Tabla 6.2: 0.0466/0.90 pórtico de hormigón; 0.0488/0.75 «todos los otros sistemas» (dual, muros)
    const [Ct, alfa] = norma === "NEC-15" ? (p.sistema ? [0.055, 0.75] : [0.055, 0.9]) : (p.sistema ? [0.0488, 0.75] : [0.0466, 0.9]);
    return { norma, Z: p.Z, Fa: p.Fa, Fd: p.Fd, Fs: p.Fs, eta: p.eta, r: p.r, I: p.I, R: p.R, phiP: 1, phiE: 1, Ct, alfa, Cd: p.Cd, limDeriva: p.limDeriva };
  }
  function correr() {
    const nodes = estado.nodes.val, elements = estado.elements.val;
    if (!nodes?.length) { p.info = "✗ no hay modelo"; f.refresh(); return; }
    const t0 = performance.now();
    try {
      const r = calcularNEC(nodes, elements, estado.nodeInputs.val, estado.elementInputs.val,
        { sitio: sitio() as any, irregular: p.irregular === -1 ? null : !!p.irregular, nModos: p.nModos, ecc: 0.05, agrietadas: !!p.agrietadas,
          dual: !!p.sistema, modal: (p as any).modal, direccional: (p as any).direccional, forzar: Object.fromEntries((["P1", "P2", "P3", "P4", "P5", "E1", "E2", "E3", "E4", "E5"] as ClaveIrr[]).map((k) => [k, (p as any)[k]])) });
      ultimo = r;
      const e = r.estatico, dx = r.dinamico;
      p.info = `Est: T ${e.T.toFixed(3)} s · Sa ${e.Sa.toFixed(3)} g · V ${e.V.toFixed(1)} ${r.unidad} (${(e.Cs * 100).toFixed(2)} % W)
Din: Vx ${dx.X.V.toFixed(1)} (${(dx.escX.relacion * 100).toFixed(1)} %) · Vy ${dx.Y.V.toFixed(1)} (${(dx.escY.relacion * 100).toFixed(1)} %) · mín ${dx.minimo * 100} %
Escala: X ×${dx.escX.factor.toFixed(3)} · Y ×${dx.escY.factor.toFixed(3)}
Torsión máx/prom: X ${r.torsional.peorX.toFixed(3)} · Y ${r.torsional.peorY.toFixed(3)} ${r.torsional.X || r.torsional.Y ? "✗ IRREGULAR (> 1.2)" : "✓ ≤ 1.2"}
${lineaIrr(r)}
Masa ΣUx ${(r.sumaMasa.ux * 100).toFixed(1)} % · ΣUy ${(r.sumaMasa.uy * 100).toFixed(1)} % ${r.sumaMasa.ux >= 0.9 && r.sumaMasa.uy >= 0.9 ? "✓ ≥ 90 %" : "✗ < 90 %"} · Q máx ${r.estabilidad.max.toFixed(3)} ${r.estabilidad.max <= 0.1 ? "✓ ≤ 0.10" : "✗ P-Δ"}
${r.chequeoModos.map((s) => s.split(" (")[0]).join(" · ")}  (${((performance.now() - t0) / 1000).toFixed(1)} s)`;
      mostrar(r);
    } catch (err: any) { p.info = "✗ " + (err?.message ?? err); console.error("[NEC]", err); }
    f.refresh();
  }
  function mostrar(r: ResultadoNEC) { ventana().mostrar(r, estado.nodes.val, estado.elements.val, p.norma ? "borrador 2023" : "NEC-15"); }
  return { correr, aguiar, cmcr, vivo, resultado: () => ultimo, params: p };
}

// ── ventana flotante ──────────────────────────────────────────────────────────────────────────────
let _v: { el: HTMLDivElement; mostrar: (r: ResultadoNEC, nodes: number[][], elements: number[][], norma: string) => void; mostrarAguiar: (a: ResultadoAguiar, r: ResultadoNEC) => void } | null = null;
const COL = ["#60a5fa", "#34d399", "#f472b6", "#a78bfa", "#fb923c", "#22d3ee", "#e879f9", "#4ade80"];

function ventana() {
  if (_v) return _v;
  const el = document.createElement("div");
  el.id = "hk-nec-panel";
  Object.assign(el.style, {
    position: "fixed", right: "16px", top: "56px", width: "min(760px, calc(100vw - 32px))", maxHeight: "calc(100vh - 220px)", overflow: "auto",
    background: "rgba(20, 24, 30, 0.95)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px",
    boxShadow: "0 6px 24px rgba(0,0,0,0.5)", padding: "8px 10px", fontFamily: "ui-monospace, Consolas, monospace",
    fontSize: "11px", color: "#e2e8f0", zIndex: "101", display: "none",
  } as CSSStyleDeclaration);
  const cab = document.createElement("div");
  Object.assign(cab.style, { display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "move", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "4px", marginBottom: "6px" });
  const tit = document.createElement("span"); Object.assign(tit.style, { fontWeight: "600", fontSize: "12px", color: "#a5b4fc" });
  const x = document.createElement("button"); x.textContent = "×";
  Object.assign(x.style, { background: "transparent", border: "none", color: "#e2e8f0", fontSize: "18px", cursor: "pointer" });
  x.onclick = () => { el.style.display = "none"; };
  cab.append(tit, x);
  const cuerpo = document.createElement("div");
  el.append(cab, cuerpo);
  let arr: { x: number; y: number } | null = null;
  cab.onmousedown = (e) => { const r = el.getBoundingClientRect(); arr = { x: e.clientX - r.left, y: e.clientY - r.top }; };
  window.addEventListener("mousemove", (e) => { if (!arr) return; Object.assign(el.style, { left: `${e.clientX - arr.x}px`, top: `${e.clientY - arr.y}px`, right: "auto" }); });
  window.addEventListener("mouseup", () => { arr = null; });
  document.body.appendChild(el);

  function mostrar(r: ResultadoNEC, nodes: number[][], elements: number[][], norma: string) {
    tit.textContent = `Sismo ${norma} — ${r.pisos.length} pisos`;
    const e = r.estatico, D = r.dinamico, n = r.pisos.length;
    const peorDer = (ks: string[], i: number) => ks.reduce((a, k) => (r.derivasEst[k][i].max > a.max ? r.derivasEst[k][i] : a), r.derivasEst[ks[0]][i]);
    const th = (s: string) => `<th style="padding:2px 6px;text-align:right;color:#a5b4fc;font-weight:600">${s}</th>`;
    const td = (s: string, c = "") => `<td style="padding:2px 6px;text-align:right;${c}">${s}</td>`;
    let filas = "";
    for (let i = n - 1; i >= 0; i--) {
      const q = r.pisos[i], pe = e.pisos[i], cr = r.cr[i], dX = peorDer(["Ex", "Ex+e", "Ex−e"], i), dY = peorDer(["Ey", "Ey+e", "Ey−e"], i);
      const mala = (d: any) => (d.torsional ? "color:#f87171;font-weight:600" : "");
      filas += `<tr>${td("P" + q.k)}${td(q.z.toFixed(2))}${td(q.peso.toFixed(1))}${td(pe.F.toFixed(1))}${td(pe.Vpiso.toFixed(1))}` +
        `${td((D.X.pisos[i].V * D.escX.factor).toFixed(1))}${td((D.Y.pisos[i].V * D.escY.factor).toFixed(1))}` +
        `${td(`${q.cm[0].toFixed(3)}, ${q.cm[1].toFixed(3)}`)}${td(`${cr[0].toFixed(3)}, ${cr[1].toFixed(3)}`)}` +
        `${td((dX.max * 100).toFixed(3) + " %", "color:#94a3b8")}${td((dX.inelastica * 100).toFixed(2) + " %")}${td(dX.relacion.toFixed(3), mala(dX))}${td((dY.max * 100).toFixed(3) + " %", "color:#94a3b8")}${td((dY.inelastica * 100).toFixed(2) + " %")}${td(dY.relacion.toFixed(3), mala(dY))}${td(r.estabilidad.X[i].toFixed(4))}${td(r.estabilidad.Y[i].toFixed(4))}</tr>`;
    }
    const cab = ["Piso", "z m", `W ${r.unidad}`, `F ${r.unidad}`, "V est", "Vx din", "Vy din", "CM (x, y)", "CR (x, y)", "ΔE X", "ΔM X", "máx/prom X", "ΔE Y", "ΔM Y", "máx/prom Y", "Q X", "Q Y"].map(th).join("");
    cuerpo.innerHTML = `
<div style="line-height:1.5;margin-bottom:6px">
 <b>Estático</b>: Ta ${e.Ta.toFixed(3)} s → T ${e.T.toFixed(3)} s · Sa ${e.Sa.toFixed(3)} g · k ${e.k.toFixed(3)} · W ${e.W.toFixed(1)} ${r.unidad} · <b>V ${e.V.toFixed(1)} ${r.unidad}</b> (Cs ${e.Cs.toFixed(4)})<br>
 <b>Dinámico ${D.X.modal}</b>: Vx ${D.X.V.toFixed(1)} ${r.unidad} = ${(D.escX.relacion * 100).toFixed(1)} % · Vy ${D.Y.V.toFixed(1)} ${r.unidad} = ${(D.escY.relacion * 100).toFixed(1)} % del estático (mínimo ${D.minimo * 100} %)
 → escala X ×${D.escX.factor.toFixed(3)}, Y ×${D.escY.factor.toFixed(3)}<br>
 <b>Derivas</b> inelásticas ≤ ${(r.limiteDeriva * 100).toFixed(1)} % (el peor de sin/±5 % de excentricidad) · <b>Torsión</b> máx/prom > 1.2 = irregular (rojo)<br>
 <b>Modos</b>: ${r.chequeoModos.join(" · ")}<br>
 <b>Irregularidades</b> (${r.sitio.norma === "NEC-15" ? "NEC-15 Tablas 13-14" : "borrador Tablas 5.1-5.2"}; * = corregida a mano): ${r.irregularidades.lista.map((q) => `<span style="color:${q.valor ? "#f87171" : "#94a3b8"}" title="${q.detalle}">${q.clave} ${q.nombre}${q.valor ? " ✗" : " ✓"}${q.manual ? "*" : ""}</span>`).join(" · ")}
 → ${lineaIrr(r).split("→ ")[1]}<br>
 <b>Combinación</b>: modal ${D.X.modal} · direccional ${r.dirDerivas.metodo} → deriva dinámica máx X ${(Math.max(...r.dirDerivas.X) * 100).toFixed(2)} % · Y ${(Math.max(...r.dirDerivas.Y) * 100).toFixed(2)} %<br>
 <b>Sismo vertical</b> en voladizos (${r.sitio.norma === "NEC-15" ? "NEC-15 §3.4.4: F_rev = ⅔·I·η·Z·Fa·Wp" : "borrador ec. 3.9: F_rev = ⅔·Ie·2.4·Z·Fa·W_vol"}) = ${r.vertical.coef.toFixed(3)}·Wp: ${r.vertical.pisos.some((q) => q.nudos) ? r.vertical.pisos.filter((q) => q.nudos).map((q) => `P${q.k} Wp ${q.Wp.toFixed(1)} → F_rev ±${q.Frev.toFixed(1)} ${r.unidad}`).join(" · ") : "no hay voladizos (todo dentro de las columnas y muros)"} · Ev ≥ ⅔·Eh<br>
 <b>Deriva límite</b> ${(r.limiteDeriva * 100).toFixed(1)} % (${r.sitio.norma === "NEC-15" ? "ΔM = 0.75·R·ΔE" : "δ = Cd·δe/Ie, Cd " + (r.sitio.Cd ?? 5.5)})<br>
 <b>Masa participativa</b> (${r.modos.length} modos): ΣUx ${(r.sumaMasa.ux * 100).toFixed(1)} % · ΣUy ${(r.sumaMasa.uy * 100).toFixed(1)} % (≥ 90 %) · <b>Estabilidad</b> Q = P·Δ/(V·h) máx ${r.estabilidad.max.toFixed(4)} (≤ 0.10: sin P-Δ) · <b>Inercias</b> ${r.agrietadas ? "agrietadas §6.1.6 (vigas 0.5, columnas 0.8, muros 0.6)" : "brutas"}
</div>
<div style="overflow-x:auto"><table style="border-collapse:collapse;font-variant-numeric:tabular-nums;white-space:nowrap"><thead><tr>${cab}</tr></thead><tbody>${filas}</tbody></table></div>
<div style="margin-top:8px">${graficaDerivas(r)}</div>
<div style="margin-top:8px">${planta(r, nodes, elements)}</div>`;
    el.style.display = "block";
  }
  function mostrarAguiar(a: ResultadoAguiar, r: ResultadoNEC) {
    tit.textContent = `Matriz de rigidez en coordenadas de piso (Aguiar) — ${r.pisos.length} pisos`;
    const n = r.pisos.length, g = ["u_x", "u_y", "θz"];
    const num = (v: number) => (Math.abs(v) < 1e-9 * Math.max(1, Math.abs(a.KE[0][0])) ? "0" : v.toFixed(Math.abs(v) >= 100 ? 0 : 3));
    const th = (s: string) => `<th style="padding:2px 6px;text-align:right;color:#a5b4fc;font-weight:600">${s}</th>`;
    const td = (s: string, c = "") => `<td style="padding:2px 6px;text-align:right;${c}">${s}</td>`;
    const etq = Array.from({ length: 3 * n }, (_, i) => `${g[i % 3]} P${Math.floor(i / 3) + 1}`);
    const acop = (i: number, j: number) => (i % 3 === 2) !== (j % 3 === 2) && Math.floor(i / 3) === Math.floor(j / 3);
    let ke = `<tr>${th("")}${etq.map(th).join("")}</tr>`;
    a.KE.forEach((fila, i) => {
      ke += `<tr>${th(etq[i])}${fila.map((v, j) => td(num(v), Math.floor(i / 3) === Math.floor(j / 3) ? (acop(i, j) ? "color:#f87171;font-weight:600" : "background:#1e293b") : "color:#94a3b8")).join("")}</tr>`;
    });
    let pp = "";
    for (const q of [...a.pisos].reverse())
      pp += `<tr>${td("P" + q.k)}${td(num(q.Kxx))}${td(num(q.Kyy))}${td(num(q.Ktt))}${td(num(q.Kxt), "color:#f87171")}${td(num(q.Kyt), "color:#f87171")}` +
        `${td(q.ex.toFixed(3))}${td(q.ey.toFixed(3))}${td(q.rhoX.toFixed(3), q.rhoX > 0.3 ? "color:#f87171;font-weight:600" : "")}${td(q.rhoY.toFixed(3), q.rhoY > 0.3 ? "color:#f87171;font-weight:600" : "")}</tr>`;
    const modos = a.T.slice(0, Math.min(6, a.T.length)).map((t, k) =>
      `${td(String(k + 1))}${td(t.toFixed(4))}${td(r.modos[k] ? r.modos[k].T.toFixed(4) : "—")}${td((a.part[k][0] * 100).toFixed(0) + " %")}${td((a.part[k][1] * 100).toFixed(0) + " %")}${td((a.part[k][2] * 100).toFixed(0) + " %")}`).map((s) => `<tr>${s}</tr>`).join("");
    cuerpo.innerHTML = `
<div style="line-height:1.5;margin-bottom:6px">
 3 GDL por piso en el CM: <b>u_x, u_y, θz</b>. Con pórticos planos K_E = Σ Aᵀ·K_L·A (A = [cos α  sen α  r]); con losas y muros de
 cáscara, por <b>condensación</b>: Fx = 1, Fy = 1, Mz = 1 en el CM de cada piso → flexibilidad F → <b>K_E = F⁻¹</b>.<br>
 <b>Torsión</b>: K_xθ, K_yθ (rojo) acoplan traslación y giro · e_x = −K_xθ/K_xx, e_y = K_yθ/K_yy (CM → CR, m) ·
 ρ = |K_yθ|/√(K_yy·K_θθ): 0 sin acoplamiento, cerca de 1 torsión fuerte.
</div>
<table style="border-collapse:collapse;font-variant-numeric:tabular-nums;white-space:nowrap;margin-bottom:8px">
<tr>${["Piso", "K_xx", "K_yy", "K_θθ", "K_xθ", "K_yθ", "e_x m", "e_y m", "ρ_x", "ρ_y"].map(th).join("")}</tr>${pp}</table>
<table style="border-collapse:collapse;font-variant-numeric:tabular-nums;white-space:nowrap;margin-bottom:8px">
<tr>${["Modo", "T reducido s", "T modal s", "u_x", "u_y", "θz"].map(th).join("")}</tr>${modos}</table>
<div style="overflow-x:auto"><table style="border-collapse:collapse;font-variant-numeric:tabular-nums;white-space:nowrap;font-size:10px">${ke}</table></div>`;
    el.style.display = "block";
  }
  _v = { el, mostrar, mostrarAguiar };
  return _v;
}

/** Planta: losas del piso más bajo de fondo, y el CM (●) y el CR (✚) de cada piso unidos por su excentricidad. */
function planta(r: ResultadoNEC, nodes: number[][], elements: number[][]): string {
  const z1 = r.pisos[0].z;
  const losas = elements.filter((e) => e.length >= 3 && e.every((k) => Math.abs(nodes[k][2] - z1) < 1e-3));
  const pts = losas.length ? losas.flatMap((e) => e.map((k) => nodes[k])) : r.pisos[0].nudos.map((k) => nodes[k]);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const W = 620, m = 20, esc = Math.min((W - 2 * m - 170) / Math.max(x1 - x0, 1e-6), 260 / Math.max(y1 - y0, 1e-6));
  const hP = (y1 - y0) * esc, H = Math.max(hP + 2 * m, 166) + 13 * r.pisos.length + 22;
  const X = (x: number) => m + (x - x0) * esc, Y = (y: number) => m + (y1 - y) * esc;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;background:#11151b;border-radius:6px">`;
  for (const e of losas) s += `<polygon points="${e.map((k) => `${X(nodes[k][0]).toFixed(1)},${Y(nodes[k][1]).toFixed(1)}`).join(" ")}" fill="#2b3a52" stroke="#475569" stroke-width="0.6"/>`;
  // columnas: nudos del piso 1 con otro debajo en la base
  const base = new Set(nodes.filter((p) => Math.abs(p[2]) < 1e-3).map((p) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`));
  for (const k of r.pisos[0].nudos) { const p = nodes[k]; if (Math.abs(p[2] - z1) < 1e-3 && base.has(`${p[0].toFixed(3)},${p[1].toFixed(3)}`)) s += `<rect x="${X(p[0]) - 3}" y="${Y(p[1]) - 3}" width="6" height="6" fill="#94a3b8"/>`; }
  r.pisos.forEach((q, i) => {
    const c = COL[i % COL.length], cm = q.cm, cr = r.cr[i];
    s += `<line x1="${X(cm[0])}" y1="${Y(cm[1])}" x2="${X(cr[0])}" y2="${Y(cr[1])}" stroke="${c}" stroke-width="1" stroke-dasharray="3 2"/>`;
    s += `<circle cx="${X(cm[0])}" cy="${Y(cm[1])}" r="4" fill="${c}"/>`;
    s += `<path d="M${X(cr[0]) - 5},${Y(cr[1])}h10M${X(cr[0])},${Y(cr[1]) - 5}v10" stroke="${c}" stroke-width="2"/>`;
  });
  // recuadro AMPLIADO alrededor de los CM y CR: a escala real la excentricidad (decímetros) no se ve
  const qx = r.pisos.flatMap((q, i) => [q.cm[0], r.cr[i][0]]), qy = r.pisos.flatMap((q, i) => [q.cm[1], r.cr[i][1]]);
  const cx = (Math.min(...qx) + Math.max(...qx)) / 2, cy = (Math.min(...qy) + Math.max(...qy)) / 2;
  const semi = Math.max(Math.max(...qx) - Math.min(...qx), Math.max(...qy) - Math.min(...qy), 0.2) * 0.65;
  const L = 150, ix = W - L - 8, iy = 8, e2 = L / (2 * semi);
  const IX = (x: number) => ix + L / 2 + (x - cx) * e2, IY = (y: number) => iy + L / 2 - (y - cy) * e2;
  s += `<rect x="${X(cx - semi)}" y="${Y(cy + semi)}" width="${2 * semi * esc}" height="${2 * semi * esc}" fill="none" stroke="#e2e8f0" stroke-width="0.8" stroke-dasharray="2 2"/>`;
  s += `<rect x="${ix}" y="${iy}" width="${L}" height="${L}" fill="#0b0f14" stroke="#e2e8f0" stroke-width="0.8"/>`;
  r.pisos.forEach((q, i) => {
    const c = COL[i % COL.length], cm = q.cm, cr = r.cr[i];
    s += `<line x1="${IX(cm[0])}" y1="${IY(cm[1])}" x2="${IX(cr[0])}" y2="${IY(cr[1])}" stroke="${c}" stroke-width="1" stroke-dasharray="3 2"/>`;
    s += `<circle cx="${IX(cm[0])}" cy="${IY(cm[1])}" r="4" fill="${c}"/>`;
    s += `<path d="M${IX(cr[0]) - 5},${IY(cr[1])}h10M${IX(cr[0])},${IY(cr[1]) - 5}v10" stroke="${c}" stroke-width="2"/>`;
  });
  s += `<text x="${ix + 4}" y="${iy + L - 5}" fill="#94a3b8" font-size="10">ampliado ×${(e2 / esc).toFixed(0)} · lado ${(2 * semi).toFixed(2)} m</text>`;
  r.pisos.forEach((q, i) => { s += `<text x="${m}" y="${Math.max(hP + 2 * m, 166) + 10 + 13 * i}" fill="${COL[i % COL.length]}" font-size="11">P${q.k}  ● CM  ✚ CR  e = (${(r.cr[i][0] - q.cm[0]).toFixed(2)}, ${(r.cr[i][1] - q.cm[1]).toFixed(2)}) m</text>`; });
  s += `<text x="${m}" y="${H - 4}" fill="#94a3b8" font-size="10">x ${x0.toFixed(1)} … ${x1.toFixed(1)} m · y ${y0.toFixed(1)} … ${y1.toFixed(1)} m</text></svg>`;
  return s;
}


// ── ventana «Planta CM / CR en vivo» ─────────────────────────────────────────────────────────────────
let _vv: { mostrar: (r: any, nodes: number[][], elements: number[][], hist: [number, number][][], ms: number) => void; ocultar: () => void } | null = null;
function ventanaVivo() {
  if (_vv) return _vv;
  const el = document.createElement("div");
  el.id = "hk-cmcr-vivo";
  // abajo a la IZQUIERDA, sobre la vista 3D: a la derecha tapaba el panel de muros y el clic caía en la ventana
  Object.assign(el.style, { position: "fixed", left: "330px", bottom: "90px", width: "min(470px, calc(100vw - 32px))", background: "rgba(20, 24, 30, 0.95)",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", boxShadow: "0 6px 24px rgba(0,0,0,0.5)", padding: "6px 8px",
    fontFamily: "ui-monospace, Consolas, monospace", fontSize: "11px", color: "#e2e8f0", zIndex: "102", display: "none" } as CSSStyleDeclaration);
  const cab = document.createElement("div"); cab.style.cssText = "display:flex;justify-content:space-between;align-items:center;cursor:move;margin-bottom:4px";
  const tit = document.createElement("span"); tit.style.cssText = "font-weight:600;font-size:12px;color:#a5b4fc"; tit.textContent = "🎯 Planta CM / CR en vivo";
  const x = document.createElement("button"); x.textContent = "×"; x.style.cssText = "background:transparent;border:none;color:#e2e8f0;font-size:18px;cursor:pointer";
  x.onclick = () => { el.style.display = "none"; };
  cab.append(tit, x); const cuerpo = document.createElement("div"); el.append(cab, cuerpo); document.body.appendChild(el);
  let arr: { x: number; y: number } | null = null;
  cab.onmousedown = (e) => { const r = el.getBoundingClientRect(); arr = { x: e.clientX - r.left, y: e.clientY - r.top }; };
  window.addEventListener("mousemove", (e) => { if (!arr) return; Object.assign(el.style, { left: `${e.clientX - arr.x}px`, top: `${e.clientY - arr.y}px`, right: "auto", bottom: "auto" }); });
  window.addEventListener("mouseup", () => { arr = null; });
  function mostrar(r: any, nodes: number[][], elements: number[][], hist: [number, number][][], ms: number) {
    let svg = planta(r, nodes, elements);
    // rastro: dónde estaba el CR en los cálculos anteriores (gris, cada vez más tenue)
    const z1 = r.pisos[0].z, losas = elements.filter((e) => e.length >= 3 && e.every((k) => Math.abs(nodes[k][2] - z1) < 1e-3));
    const pts = losas.length ? losas.flatMap((e) => e.map((k) => nodes[k])) : r.pisos[0].nudos.map((k: number) => nodes[k]);
    const xs = pts.map((q: number[]) => q[0]), ys = pts.map((q: number[]) => q[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const Wd = 620, m = 20, esc = Math.min((Wd - 2 * m - 170) / Math.max(x1 - x0, 1e-6), 260 / Math.max(y1 - y0, 1e-6));
    const X = (v: number) => m + (v - x0) * esc, Y = (v: number) => m + (y1 - v) * esc;
    let rastro = "";
    hist.forEach((cr, h) => cr.forEach((c) => { rastro += `<path d="M${X(c[0]) - 4},${Y(c[1])}h8M${X(c[0])},${Y(c[1]) - 4}v8" stroke="#94a3b8" stroke-opacity="${(0.5 - h * 0.07).toFixed(2)}" stroke-width="1.5"/>`; }));
    svg = svg.replace("</svg>", rastro + "</svg>");
    const e = r.pisos.map((q: any, i: number) => Math.hypot(r.cr[i][0] - q.cm[0], r.cr[i][1] - q.cm[1]));
    const emax = Math.max(...e), Lx = x1 - x0, Ly = y1 - y0;
    const pct = Math.max(...r.pisos.map((q: any, i: number) => Math.max(Math.abs(r.cr[i][0] - q.cm[0]) / Lx, Math.abs(r.cr[i][1] - q.cm[1]) / Ly))) * 100;
    cuerpo.innerHTML = `<div style="margin-bottom:4px">|CR − CM| máx <b style="color:${pct < 5 ? "#4ade80" : pct < 15 ? "#fbbf24" : "#f87171"}">${emax.toFixed(2)} m = ${pct.toFixed(1)} % de la planta</b>
      · ${(ms / 1000).toFixed(1)} s · gris = CR anteriores</div>${svg}`;
    el.style.display = "block";
  }
  _vv = { mostrar, ocultar: () => { el.style.display = "none"; } };
  return _vv;
}


// ── panel «⚖ 4 jueces en vivo»: a la izquierda, el modelo sigue a la derecha ──────────────────────────────
let _pj: { mostrar: (j: Jueces, nodes: number[][], elements: number[][]) => void; ocultar: () => void } | null = null;
const _histRho: number[] = [];
function panelJueces() {
  if (_pj) return _pj;
  const el = document.createElement("div");
  el.id = "hk-jueces";
  Object.assign(el.style, { position: "fixed", left: "310px", top: "50px", bottom: "64px", width: "520px", overflow: "auto",
    background: "rgba(14, 18, 24, 0.96)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
    padding: "8px", fontFamily: "ui-monospace, Consolas, monospace", fontSize: "11px", color: "#e2e8f0", zIndex: "101", display: "none" } as CSSStyleDeclaration);
  const cab = document.createElement("div"); cab.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:6px";
  const tit = document.createElement("span"); tit.style.cssText = "font-weight:600;font-size:13px;color:#a5b4fc"; tit.textContent = "⚖ Los 4 jueces de la torsión — en vivo";
  const x = document.createElement("button"); x.textContent = "×"; x.style.cssText = "background:transparent;border:none;color:#e2e8f0;font-size:18px;cursor:pointer";
  x.onclick = () => ocultar();
  cab.append(tit, x); const cuerpo = document.createElement("div"); el.append(cab, cuerpo); document.body.appendChild(el);
  // pantalla DIVIDIDA: los jueces a la izquierda y la vista 3D corrida a la derecha (el visor escucha su tamaño)
  const dividir = (si: boolean) => {
    const v = document.querySelector("#viewer") as HTMLElement | null; if (!v) return;
    if (si) { v.style.left = "838px"; v.style.width = "calc(100vw - 838px)"; } else { v.style.left = ""; v.style.width = ""; }
    setTimeout(() => { try { (window as any).__hekatanAutoFit?.(); } catch {} }, 250);
  };
  function ocultar() { if (el.style.display !== "none") dividir(false); el.style.display = "none"; }
  const caja = (t: string, h: string) => `<div style="border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:6px;min-width:0;overflow:hidden"><div style="font-weight:600;color:#a5b4fc;margin-bottom:4px">${t}</div>${h}</div>`;
  const rojo = "#f87171", verde = "#4ade80", ambar = "#fbbf24";
  const sem = (v: number, bien: number, mal: number) => (v <= bien ? verde : v <= mal ? ambar : rojo);
  function mostrar(j: Jueces, nodes: number[][], elements: number[][]) {
    const A = j.aguiar, th = (s: string) => `<th style="padding:1px 5px;text-align:right;color:#94a3b8;font-weight:500">${s}</th>`;
    const td = (s: string, c = "") => `<td style="padding:1px 5px;text-align:right;${c}">${s}</td>`;
    const k = (v: number) => (Math.abs(v) >= 1e5 ? v.toExponential(2) : v.toFixed(0));
    const rhoMax = Math.max(...A.pisos.map((q) => Math.max(q.rhoX, q.rhoY)));
    _histRho.unshift(rhoMax); _histRho.length = Math.min(_histRho.length, 8);
    // 1. Aguiar
    let t1 = `<table style="border-collapse:collapse;font-variant-numeric:tabular-nums;white-space:nowrap"><tr>${["", "K_xx", "K_yy", "K_θθ", "K_xθ", "K_yθ", "ρ_x", "ρ_y"].map(th).join("")}</tr>`;
    for (const q of [...A.pisos].reverse()) t1 += `<tr>${td("P" + q.k)}${td(k(q.Kxx))}${td(k(q.Kyy))}${td(k(q.Ktt))}${td(k(q.Kxt), "color:" + rojo)}${td(k(q.Kyt), "color:" + rojo)}` +
      `${td(q.rhoX.toFixed(3), "font-weight:700;color:" + sem(q.rhoX, 0.1, 0.3))}${td(q.rhoY.toFixed(3), "font-weight:700;color:" + sem(q.rhoY, 0.1, 0.3))}</tr>`;
    t1 += `</table><div style="margin-top:4px">ρ = |K_yθ|/√(K_yy·K_θθ): <b style="color:${sem(rhoMax, 0.1, 0.3)}">máx ${rhoMax.toFixed(3)}</b> · antes: ${_histRho.slice(1, 5).map((v) => v.toFixed(2)).join(" → ") || "—"}</div>`;
    // 2. planta CM / CR (el CR del bloque diagonal de la misma flexibilidad de Aguiar)
    const r = { pisos: j.pisos, cr: A.cr } as any;
    const xs = nodes.map((q) => q[0]), ys = nodes.map((q) => q[1]), Lx = Math.max(...xs) - Math.min(...xs), Ly = Math.max(...ys) - Math.min(...ys);
    const pct = Math.max(...j.pisos.map((q, i) => Math.max(Math.abs(A.cr[i][0] - q.cm[0]) / Lx, Math.abs(A.cr[i][1] - q.cm[1]) / Ly))) * 100;
    const t2 = `<div>|CR − CM| máx <b style="color:${sem(pct, 5, 15)}">${pct.toFixed(1)} % de la planta</b></div>${planta(r, nodes, elements)}`;
    // 3. torsión
    let t3 = `<table style="border-collapse:collapse;font-variant-numeric:tabular-nums"><tr>${["", "X", "", "Y", ""].map(th).join("")}</tr>`;
    const barra = (v: number) => `<span style="display:inline-block;height:8px;width:${Math.max(2, Math.min(120, (v - 1) * 120)).toFixed(0)}px;background:${v > 1.2 ? rojo : verde};border-radius:2px"></span>`;
    for (const t of [...j.torsion].reverse()) t3 += `<tr>${td("P" + t.k)}${td(t.X.toFixed(3), "font-weight:700;color:" + (t.X > 1.2 ? rojo : verde))}<td>${barra(t.X)}</td>${td(t.Y.toFixed(3), "font-weight:700;color:" + (t.Y > 1.2 ? rojo : verde))}<td>${barra(t.Y)}</td></tr>`;
    t3 += `</table><div style="margin-top:4px">Δmax/Δprom con ±5 % · límite 1.2 · ${j.torsionMax.X > 1.2 || j.torsionMax.Y > 1.2 ? `<b style="color:${rojo}">IRREGULAR</b>` : `<b style="color:${verde}">regular</b>`}</div>`;
    // 4. modos
    let t4 = `<table style="border-collapse:collapse;font-variant-numeric:tabular-nums"><tr>${["modo", "T (s)", "UX", "UY", "RZ", ""].map(th).join("")}</tr>`;
    j.modos.forEach((m, i) => { t4 += `<tr>${td(String(i + 1))}${td(m.T.toFixed(4))}${td((m.ux * 100).toFixed(1) + " %")}${td((m.uy * 100).toFixed(1) + " %")}${td((m.rz * 100).toFixed(1) + " %", "font-weight:700")}${td(j.chequeo[i] ? "✓" : "✗", "font-weight:700;color:" + (j.chequeo[i] ? verde : rojo))}</tr>`; });
    t4 += `</table><div style="margin-top:4px">1 y 2 traslación (RZ &lt; 10 %), 3 giro</div>`;
    cuerpo.innerHTML = `<div style="display:grid;grid-template-columns:1fr;gap:8px">${caja("1 · Matriz de piso (Aguiar)", t1)}${caja("2 · Centro de masas ● y de rigidez ✚", t2)}${caja("3 · Irregularidad torsional (NEC)", t3)}${caja("4 · Tres primeros modos", t4)}</div>
      <div style="margin-top:6px;color:#94a3b8">recalculado en ${(j.ms / 1000).toFixed(1)} s · cambie muros, secciones, pisos o vanos y mire los cuatro cuadros</div>`;
    if (el.style.display === "none") { el.style.display = "block"; dividir(true); }
  }
  _pj = { mostrar, ocultar };
  return _pj;
}


/** Gráfica de DERIVA INELÁSTICA por piso (1-oct-2026): estático (el peor de sin/±5 %) en trazo lleno y dinámico CQC
 *  escalado en trazo discontinuo, X azul e Y naranja, con la línea del límite (NEC-15 2 %, borrador la Tabla 4.3). */
function graficaDerivas(r: ResultadoNEC): string {
  const n = r.pisos.length, D = r.dinamico;
  const est = (ks: string[]) => r.pisos.map((_, i) => Math.max(...ks.map((k) => r.derivasEst[k][i].inelastica)));
  const sx = est(["Ex", "Ex+e", "Ex−e"]), sy = est(["Ey", "Ey+e", "Ey−e"]);
  const dx = r.dirDerivas.X, dy = r.dirDerivas.Y;   // dinámico escalado, con la combinación modal y direccional elegidas
  const lim = r.limiteDeriva, vmax = Math.max(lim * 1.15, ...sx, ...sy, ...dx, ...dy);
  const W = 680, H = 80 + 46 * n, m = { l: 46, r: 230, t: 22, b: 30 };
  const X = (v: number) => m.l + (v / vmax) * (W - m.l - m.r), Y = (i: number) => H - m.b - ((i + 1) / n) * (H - m.t - m.b);
  const linea = (v: number[], col: string, dash = "") => `<polyline fill="none" stroke="${col}" stroke-width="2.5" ${dash ? `stroke-dasharray="${dash}"` : ""} points="${[`${X(0)},${H - m.b}`, ...v.map((d, i) => `${X(d).toFixed(1)},${Y(i).toFixed(1)}`)].join(" ")}"/>` +
    v.map((d, i) => `<circle cx="${X(d).toFixed(1)}" cy="${Y(i).toFixed(1)}" r="3.5" fill="${col}"/>`).join("");
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;background:#11151b;border-radius:6px">`;
  s += `<text x="${m.l}" y="14" fill="#a5b4fc" font-size="12" font-weight="600">Deriva inelástica por piso (%)</text>`;
  for (let i = 0; i < n; i++) s += `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(i)}" y2="${Y(i)}" stroke="#334155" stroke-width="0.6"/><text x="${m.l - 8}" y="${Y(i) + 4}" fill="#94a3b8" font-size="11" text-anchor="end">P${i + 1}</text>`;
  for (const t of [0, vmax / 4, vmax / 2, (3 * vmax) / 4, vmax]) s += `<text x="${X(t)}" y="${H - 10}" fill="#94a3b8" font-size="10" text-anchor="middle">${(t * 100).toFixed(2)}</text>`;
  s += `<line x1="${X(0)}" x2="${X(0)}" y1="${m.t}" y2="${H - m.b}" stroke="#64748b"/><line x1="${X(0)}" x2="${W - m.r}" y1="${H - m.b}" y2="${H - m.b}" stroke="#64748b"/>`;
  s += `<line x1="${X(lim)}" x2="${X(lim)}" y1="${m.t}" y2="${H - m.b}" stroke="#f87171" stroke-width="2"/><text x="${X(lim) + 4}" y="${m.t + 10}" fill="#f87171" font-size="11">límite ${(lim * 100).toFixed(1)} %</text>`;
  s += linea(sx, "#60a5fa") + linea(sy, "#fb923c") + linea(dx, "#60a5fa", "5 4") + linea(dy, "#fb923c", "5 4");
  const lx = W - m.r + 14;
  s += `<text x="${lx}" y="${m.t + 30}" fill="#60a5fa" font-size="11">— X estático máx ${(Math.max(...sx) * 100).toFixed(2)} %</text>`;
  s += `<text x="${lx}" y="${m.t + 46}" fill="#fb923c" font-size="11">— Y estático máx ${(Math.max(...sy) * 100).toFixed(2)} %</text>`;
  s += `<text x="${lx}" y="${m.t + 66}" fill="#94a3b8" font-size="11">- - dinámico ${D.X.modal} · ${r.dirDerivas.metodo}</text>`;
  s += `<text x="${lx}" y="${m.t + 82}" fill="#94a3b8" font-size="10">X ${(Math.max(...dx) * 100).toFixed(2)} % · Y ${(Math.max(...dy) * 100).toFixed(2)} %</text>`;
  const nec15 = r.sitio.norma === "NEC-15", amp = nec15 ? 0.75 * r.sitio.R : (r.sitio.Cd ?? 5.5) / r.sitio.I;
  s += `<text x="${lx}" y="${m.t + 130}" fill="#e2e8f0" font-size="11">${nec15 ? "NEC-15 §6.3.9: ΔM = 0.75·R·ΔE" : "borrador ec. 6.8: δ = Cd·δe/Ie"}</text>`;
  s += `<text x="${lx}" y="${m.t + 146}" fill="#94a3b8" font-size="11">${nec15 ? `0.75 × ${r.sitio.R} = ${amp.toFixed(2)}` : `${r.sitio.Cd ?? 5.5} / ${r.sitio.I} = ${amp.toFixed(2)}`} × la elástica</text>`;
  s += `<text x="${lx}" y="${m.t + 162}" fill="#94a3b8" font-size="11">elástica máx X ${(Math.max(...sx) / amp * 100).toFixed(3)} % · Y ${(Math.max(...sy) / amp * 100).toFixed(3)} %</text>`;
  const ok = Math.max(...sx, ...sy, ...dx, ...dy) <= lim;
  s += `<text x="${lx}" y="${m.t + 106}" fill="${ok ? "#4ade80" : "#f87171"}" font-size="12" font-weight="700">${ok ? "cumple" : "NO cumple"} el límite</text></svg>`;
  return s;
}
