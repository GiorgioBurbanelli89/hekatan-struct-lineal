/**
 * Módulo 1 · Espectro de diseño NEC-SE-DS — página interactiva.
 * Inputs (Tweakpane) → computeEspectro() → gráfica (chartPanel) + panel de
 * transparencia (fórmulas + valores + referencia de norma).
 */
import { Pane } from "tweakpane";
import { createChartPanel } from "../shared/chartPanel";
import {
  computeEspectro, periodoTa, IMPORTANCIA, TIPOS_TA_NEC15,
  type Norma, type Suelo, type Region, type EspectroResult,
} from "./espectroNec";

// ── Layout base ────────────────────────────────────────────────────────────
document.body.style.margin = "0";
document.body.style.background = "#0d1117";
document.body.style.fontFamily = "ui-monospace, Menlo, Consolas, monospace";

const header = document.createElement("div");
header.innerHTML =
  `<div style="padding:10px 16px;color:#e6edf3;font-size:15px;font-weight:600;border-bottom:1px solid #30363d">
     🌐 Espectro de diseño · NEC-SE-DS <span style="color:#8b949e;font-weight:400">— Módulo 1 Peligro Sísmico (Hekatan)</span>
   </div>`;
document.body.appendChild(header);

// Layout flex: columna izquierda (controles + transparencia), derecha (gráfica)
const wrap = document.createElement("div");
Object.assign(wrap.style, { display: "flex", gap: "12px", padding: "12px", alignItems: "flex-start", flexWrap: "wrap" });
document.body.appendChild(wrap);

const leftCol = document.createElement("div");
Object.assign(leftCol.style, { display: "flex", flexDirection: "column", gap: "12px", width: "310px", flex: "0 0 310px" });
wrap.appendChild(leftCol);

const paneHost = document.createElement("div");
leftCol.appendChild(paneHost);

// Panel de transparencia (debajo del pane)
const out = document.createElement("div");
Object.assign(out.style, {
  padding: "12px 14px", color: "#e6edf3", fontSize: "12px", lineHeight: "1.55",
  background: "rgba(22,27,34,0.92)", border: "1px solid #30363d", borderRadius: "8px",
});
leftCol.appendChild(out);

const chartCol = document.createElement("div");
Object.assign(chartCol.style, { flex: "1 1 640px", minWidth: "0" });
wrap.appendChild(chartCol);

// ── Estado ──────────────────────────────────────────────────────────────────
const state = {
  norma: "NEC15" as Norma,
  region: "Costa" as Region,
  suelo: "D" as Suelo,
  Z: 0.4,
  R: 8,
  I: 1.0,
  phiP: 1.0,
  phiE: 1.0,
  hn: 12,
  tipoTa: "Hormigón sin muros",
};

// ── Gráfica ───────────────────────────────────────────────────────────────
const chart = createChartPanel({
  title: "Sa(T) — Espectro elástico vs diseño",
  width: 640, height: 440, initiallyVisible: true,
  parent: chartCol,
});
// El chartPanel es fixed por defecto; lo pasamos a flujo normal dentro de la columna
Object.assign(chart.el.style, { position: "relative", top: "auto", right: "auto", left: "auto", bottom: "auto" });

function fmt(x: number, d = 3) { return Number.isFinite(x) ? x.toFixed(d) : "—"; }

function recompute() {
  const res: EspectroResult = computeEspectro({
    norma: state.norma, Z: state.Z, suelo: state.suelo, region: state.region,
    R: state.R, I: state.I, phiP: state.phiP, phiE: state.phiE,
  });
  const Ta = periodoTa(state.hn, state.tipoTa);
  // Sa elástico en Ta (interpolando la serie)
  const SaTa = res.elastico.reduce((acc, [T, S]) => (Math.abs(T - Ta) < Math.abs(acc[0] - Ta) ? [T, S] : acc), [0, 0])[1];

  const SaMax = res.SaPlateau * 1.05;
  chart.setSeries([
    { label: "Sa elástico", data: res.elastico, color: "#58a6ff", width: 2 },
    { label: "Sa diseño (reducido)", data: res.diseno, color: "#f0883e", width: 2 },
    { label: `Ta=${fmt(Ta, 2)}s`, data: [[Ta, 0], [Ta, SaMax]], color: "#3fb950", width: 1.5 },
  ]);
  chart.setAxes({ xLabel: "T (s)", yLabel: "Sa (g)", xMin: 0, yMin: 0, grid: true });

  const normaTxt = state.norma === "NEC15" ? "NEC-15 (2014) · vigente" : "Borrador 2023 (no oficial)";
  const tramo = state.norma === "NEC15"
    ? `T≤T0: Sa=Z·Fa·[1+(η−1)·T/T0]<br>T0&lt;T≤Tc: Sa=η·Z·Fa<br>T&gt;Tc: Sa=η·Z·Fa·(Tc/T)^r`
    : `T&lt;T0: Sa=Z·Fa·[1+1.4·T/T0]<br>T0≤T&lt;Tc: Sa=2.4·Z·Fa<br>Tc≤T&lt;TL: Sa=2.4·Z·Fa·(Tc/T)^r<br>T≥TL: Sa=2.4·Z·Fa·(Tc/TL)^r·(TL/T)²`;

  out.innerHTML = `
   <div style="font-weight:600;color:#58a6ff;margin-bottom:6px">📋 ${normaTxt}</div>
   <table style="border-collapse:collapse;width:100%">
     <tr><td>PGA = Z</td><td style="text-align:right">${fmt(res.pga)} g</td></tr>
     <tr><td>Fa</td><td style="text-align:right">${fmt(res.Fa)}</td></tr>
     <tr><td>Fd</td><td style="text-align:right">${fmt(res.Fd)}</td></tr>
     <tr><td>Fs</td><td style="text-align:right">${fmt(res.Fs)}</td></tr>
     <tr><td>${state.norma === "NEC15" ? "η" : "factor meseta"}</td><td style="text-align:right">${fmt(res.eta, 2)}</td></tr>
     <tr><td>r</td><td style="text-align:right">${fmt(res.r, 2)}</td></tr>
     <tr><td>T0</td><td style="text-align:right">${fmt(res.T0)} s</td></tr>
     <tr><td>Tc</td><td style="text-align:right">${fmt(res.Tc)} s</td></tr>
     <tr><td>TL</td><td style="text-align:right">${fmt(res.TL)} s</td></tr>
     <tr><td>Sa meseta (máx)</td><td style="text-align:right;color:#58a6ff">${fmt(res.SaPlateau)} g</td></tr>
     <tr style="border-top:1px solid #30363d"><td>Ta = Ct·hn^α</td><td style="text-align:right;color:#3fb950">${fmt(Ta, 3)} s</td></tr>
     <tr><td>Sa(Ta) elástico</td><td style="text-align:right;color:#3fb950">${fmt(SaTa)} g</td></tr>
   </table>
   <div style="margin-top:10px;color:#8b949e">Tramos del espectro:</div>
   <div style="font-size:11px;color:#c9d1d9;margin:4px 0;padding:6px;background:#161b22;border-radius:6px">${tramo}</div>
   <div style="margin-top:8px;color:#8b949e;font-size:11px">Referencias NEC:</div>
   <ul style="margin:4px 0 0 0;padding-left:16px;font-size:11px;color:#8b949e">
     ${Object.values(res.refs).map((r) => `<li>${r}</li>`).join("")}
   </ul>`;
}

// ── Tweakpane ───────────────────────────────────────────────────────────────
const pane = new Pane({ title: "⚙️ Parámetros NEC-SE-DS", container: paneHost });

pane.addBinding(state, "norma", {
  label: "Norma",
  options: { "NEC-15 (2014)": "NEC15", "Borrador 2023": "BORRADOR2023" },
}).on("change", recompute);

pane.addBinding(state, "region", {
  label: "Región",
  options: { Costa: "Costa", Sierra: "Sierra", Oriente: "Oriente", Esmeraldas: "Esmeraldas", Galápagos: "Galapagos" },
}).on("change", recompute);

pane.addBinding(state, "suelo", {
  label: "Tipo de suelo",
  options: { A: "A", B: "B", C: "C", D: "D", E: "E" },
}).on("change", recompute);

pane.addBinding(state, "Z", { label: "Factor Z (g)", min: 0.1, max: 0.6, step: 0.01 }).on("change", recompute);

const fDis = pane.addFolder({ title: "Reducción / diseño", expanded: true });
fDis.addBinding(state, "R", { label: "R", min: 1, max: 8, step: 0.5 }).on("change", recompute);
fDis.addBinding(state, "I", { label: "Importancia I", options: IMPORTANCIA }).on("change", recompute);
fDis.addBinding(state, "phiP", { label: "ΦP planta", min: 0.9, max: 1.0, step: 0.05 }).on("change", recompute);
fDis.addBinding(state, "phiE", { label: "ΦE elevación", min: 0.9, max: 1.0, step: 0.05 }).on("change", recompute);

const fTa = pane.addFolder({ title: "Período Ta", expanded: true });
fTa.addBinding(state, "hn", { label: "Altura hn (m)", min: 3, max: 80, step: 0.5 }).on("change", recompute);
fTa.addBinding(state, "tipoTa", {
  label: "Tipo",
  options: Object.fromEntries(Object.keys(TIPOS_TA_NEC15).map((k) => [k, k])),
}).on("change", recompute);

recompute();
