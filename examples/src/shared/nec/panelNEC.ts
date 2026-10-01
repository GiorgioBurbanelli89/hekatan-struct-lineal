/**
 * Panel «Sismo NEC» del workspace (30-sep-2026): estático + espectral NEC-15 / borrador sobre el modelo EN PANTALLA.
 * Una carpeta con los datos del sitio y un botón; los resultados salen en una ventana flotante con:
 *   - cortante basal estático y dinámico, control Vdin/Vest y factor de escala;
 *   - tabla por piso: W, F, V estático, V dinámico escalado, CM, CR, excentricidad, derivas y relación máx/prom;
 *   - planta con el CM (●) y el CR (✚) de cada piso: al cambiar las secciones y recalcular, el CR se mueve;
 *   - chequeo de modos (1 y 2 traslacionales con RZ < 10 %, 3 rotacional).
 * Fa, Fd y Fs se escriben a mano (Tablas 3-5 de la NEC-15, 3.3-3.5 del borrador): por defecto, Portoviejo suelo D.
 */
import type { State } from "vanjs-core";
import { calcularNEC, agrietar, enMasa, type ResultadoNEC } from "./calculo";
import { matrizDePiso, type ResultadoAguiar } from "./aguiar";
import { NOMBRES, type ClaveIrr } from "./irregularidades";
import { jointMass } from "hekatan-fem";
import { PORTOVIEJO_D, type Norma } from "./estatico";

export interface ModeloNEC { nodes: State<any[]>; elements: State<any[]>; nodeInputs: State<any>; elementInputs: State<any> }

let _sitio: any = null;

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
    I: 1.0, R: 8, sistema: 0, irregular: -1, nModos: 12, agrietadas: 0, Cd: 5.5, limDeriva: 0.015,
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
  f.addBinding(p, "agrietadas", { label: "Inercias agrietadas §6.1.6", options: { "no (brutas)": 0, "sí: vigas 0.5 · col. 0.8 · muros 0.6": 1 } });
  f.addBinding(p, "info", { label: "", readonly: true, multiline: true, rows: 6 });
  f.addButton({ title: "▶ Calcular NEC" }).on("click", () => correr());
  f.addButton({ title: "📋 Tabla por piso y planta CM/CR" }).on("click", () => { if (ultimo) mostrar(ultimo); });
  f.addButton({ title: "🧮 Matriz de piso (Aguiar) u_x · u_y · θz" }).on("click", () => aguiar());

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
          dual: !!p.sistema, forzar: Object.fromEntries((["P1", "P2", "P3", "P4", "P5", "E1", "E2", "E3", "E4", "E5"] as ClaveIrr[]).map((k) => [k, (p as any)[k]])) });
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
  return { correr, aguiar, resultado: () => ultimo, params: p };
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
        `${td((dX.inelastica * 100).toFixed(2) + " %")}${td(dX.relacion.toFixed(3), mala(dX))}${td((dY.inelastica * 100).toFixed(2) + " %")}${td(dY.relacion.toFixed(3), mala(dY))}${td(r.estabilidad.X[i].toFixed(4))}${td(r.estabilidad.Y[i].toFixed(4))}</tr>`;
    }
    const cab = ["Piso", "z m", `W ${r.unidad}`, `F ${r.unidad}`, "V est", "Vx din", "Vy din", "CM (x, y)", "CR (x, y)", "ΔM X", "máx/prom X", "ΔM Y", "máx/prom Y", "Q X", "Q Y"].map(th).join("");
    cuerpo.innerHTML = `
<div style="line-height:1.5;margin-bottom:6px">
 <b>Estático</b>: Ta ${e.Ta.toFixed(3)} s → T ${e.T.toFixed(3)} s · Sa ${e.Sa.toFixed(3)} g · k ${e.k.toFixed(3)} · W ${e.W.toFixed(1)} ${r.unidad} · <b>V ${e.V.toFixed(1)} ${r.unidad}</b> (Cs ${e.Cs.toFixed(4)})<br>
 <b>Dinámico CQC</b>: Vx ${D.X.V.toFixed(1)} ${r.unidad} = ${(D.escX.relacion * 100).toFixed(1)} % · Vy ${D.Y.V.toFixed(1)} ${r.unidad} = ${(D.escY.relacion * 100).toFixed(1)} % del estático (mínimo ${D.minimo * 100} %)
 → escala X ×${D.escX.factor.toFixed(3)}, Y ×${D.escY.factor.toFixed(3)}<br>
 <b>Derivas</b> inelásticas ≤ ${(r.limiteDeriva * 100).toFixed(1)} % (el peor de sin/±5 % de excentricidad) · <b>Torsión</b> máx/prom > 1.2 = irregular (rojo)<br>
 <b>Modos</b>: ${r.chequeoModos.join(" · ")}<br>
 <b>Irregularidades</b> (${r.sitio.norma === "NEC-15" ? "NEC-15 Tablas 13-14" : "borrador Tablas 5.1-5.2"}; * = corregida a mano): ${r.irregularidades.lista.map((q) => `<span style="color:${q.valor ? "#f87171" : "#94a3b8"}" title="${q.detalle}">${q.clave} ${q.nombre}${q.valor ? " ✗" : " ✓"}${q.manual ? "*" : ""}</span>`).join(" · ")}
 → ${lineaIrr(r).split("→ ")[1]}<br>
 <b>Deriva límite</b> ${(r.limiteDeriva * 100).toFixed(1)} % (${r.sitio.norma === "NEC-15" ? "ΔM = 0.75·R·ΔE" : "δ = Cd·δe/Ie, Cd " + (r.sitio.Cd ?? 5.5)})<br>
 <b>Masa participativa</b> (${r.modos.length} modos): ΣUx ${(r.sumaMasa.ux * 100).toFixed(1)} % · ΣUy ${(r.sumaMasa.uy * 100).toFixed(1)} % (≥ 90 %) · <b>Estabilidad</b> Q = P·Δ/(V·h) máx ${r.estabilidad.max.toFixed(4)} (≤ 0.10: sin P-Δ) · <b>Inercias</b> ${r.agrietadas ? "agrietadas §6.1.6 (vigas 0.5, columnas 0.8, muros 0.6)" : "brutas"}
</div>
<div style="overflow-x:auto"><table style="border-collapse:collapse;font-variant-numeric:tabular-nums;white-space:nowrap"><thead><tr>${cab}</tr></thead><tbody>${filas}</tbody></table></div>
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
