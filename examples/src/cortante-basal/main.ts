/**
 * Módulo 3 · Cortante basal y distribución de fuerzas sísmicas (NEC-SE-DS §6.3).
 * Reutiliza el núcleo del Módulo 1 (espectroNec.ts). Inputs → V, tabla por piso
 * (Fx, Vi, Cvx) + gráfica del perfil de fuerzas y cortante de piso.
 */
import { Pane } from "tweakpane";
import { createChartPanel } from "../shared/chartPanel";
import {
  computeCortanteBasal, IMPORTANCIA, TIPOS_TA_NEC15,
  type Norma, type Suelo, type Region, type CortanteResult,
} from "../espectro-nec/espectroNec";

document.body.style.margin = "0";
document.body.style.background = "#0d1117";
document.body.style.fontFamily = "ui-monospace, Menlo, Consolas, monospace";

const header = document.createElement("div");
header.innerHTML =
  `<div style="padding:10px 16px;color:#e6edf3;font-size:15px;font-weight:600;border-bottom:1px solid #30363d">
     🏢 Cortante basal · NEC-SE-DS <span style="color:#8b949e;font-weight:400">— Módulo 3 (Hekatan)</span>
   </div>`;
document.body.appendChild(header);

const wrap = document.createElement("div");
Object.assign(wrap.style, { display: "flex", gap: "12px", padding: "12px", alignItems: "flex-start", flexWrap: "wrap" });
document.body.appendChild(wrap);

const leftCol = document.createElement("div");
Object.assign(leftCol.style, { display: "flex", flexDirection: "column", gap: "12px", width: "310px", flex: "0 0 310px" });
wrap.appendChild(leftCol);
const paneHost = document.createElement("div");
leftCol.appendChild(paneHost);
const out = document.createElement("div");
Object.assign(out.style, {
  padding: "12px 14px", color: "#e6edf3", fontSize: "11.5px", lineHeight: "1.5",
  background: "rgba(22,27,34,0.92)", border: "1px solid #30363d", borderRadius: "8px",
});
leftCol.appendChild(out);
const chartCol = document.createElement("div");
Object.assign(chartCol.style, { flex: "1 1 620px", minWidth: "0" });
wrap.appendChild(chartCol);

const state = {
  norma: "NEC15" as Norma,
  region: "Costa" as Region,
  suelo: "D" as Suelo,
  Z: 0.4,
  R: 8,
  I: 1.0,
  phiP: 1.0,
  phiE: 1.0,
  tipoTa: "Hormigón sin muros",
  N: 5,
  he: 3.0,
  wPiso: 1200, // kN por piso (W = D + 0.25L)
};

const chart = createChartPanel({
  title: "Distribución de fuerzas — Fx y cortante Vi vs altura",
  width: 620, height: 460, initiallyVisible: true, parent: chartCol,
});
Object.assign(chart.el.style, { position: "relative", top: "auto", right: "auto", left: "auto", bottom: "auto" });

const f = (x: number, d = 2) => (Number.isFinite(x) ? x.toFixed(d) : "—");

function recompute() {
  const r: CortanteResult = computeCortanteBasal({
    norma: state.norma, Z: state.Z, suelo: state.suelo, region: state.region,
    R: state.R, I: state.I, phiP: state.phiP, phiE: state.phiE,
    N: state.N, he: state.he, wPiso: state.wPiso, tipoTa: state.tipoTa,
  });

  // Perfil de fuerzas Fx vs altura (escalón) y cortante de piso Vi vs altura
  const fxData: [number, number][] = [[0, 0]];
  r.pisos.forEach((p) => fxData.push([p.Fx, p.hi]));
  const viData: [number, number][] = [];
  r.pisos.forEach((p) => viData.push([p.Vi, p.hi]));
  viData.push([0, r.pisos[r.pisos.length - 1].hi + state.he]); // remate arriba

  chart.setSeries([
    { label: "Fx (kN)", data: fxData, color: "#f0883e", type: "scatter", width: 6 },
    { label: "Vi cortante (kN)", data: viData, color: "#58a6ff", width: 2 },
  ]);
  chart.setAxes({ xLabel: "Fuerza / Cortante (kN)", yLabel: "Altura (m)", xMin: 0, yMin: 0, grid: true });

  const normaTxt = state.norma === "NEC15" ? "NEC-15 (2014) · vigente" : "Borrador 2023";
  const rows = r.pisos.slice().reverse().map((p) => `
    <tr>
      <td style="text-align:center">${p.piso}</td>
      <td style="text-align:right">${f(p.hi, 1)}</td>
      <td style="text-align:right">${f(p.Cvx, 3)}</td>
      <td style="text-align:right;color:#f0883e">${f(p.Fx, 1)}</td>
      <td style="text-align:right;color:#58a6ff">${f(p.Vi, 1)}</td>
    </tr>`).join("");

  out.innerHTML = `
   <div style="font-weight:600;color:#58a6ff;margin-bottom:6px">📋 ${normaTxt} — Cortante basal</div>
   <table style="border-collapse:collapse;width:100%;margin-bottom:8px">
     <tr><td>Ta</td><td style="text-align:right">${f(r.Ta, 3)} s</td></tr>
     <tr><td>Sa(Ta) elástico</td><td style="text-align:right">${f(r.SaTa, 3)} g</td></tr>
     <tr><td>W (peso reactivo)</td><td style="text-align:right">${f(r.W, 0)} kN</td></tr>
     <tr><td>V / W (coef. sísmico)</td><td style="text-align:right">${f(r.coefV, 3)}</td></tr>
     <tr><td>k (exponente)</td><td style="text-align:right">${f(r.k, 2)}</td></tr>
     <tr style="border-top:1px solid #30363d"><td><b>V cortante basal</b></td><td style="text-align:right;color:#3fb950"><b>${f(r.V, 1)} kN</b></td></tr>
   </table>
   <table style="border-collapse:collapse;width:100%;font-size:11px">
     <tr style="color:#8b949e;border-bottom:1px solid #30363d">
       <th>Piso</th><th style="text-align:right">h (m)</th><th style="text-align:right">Cvx</th>
       <th style="text-align:right">Fx (kN)</th><th style="text-align:right">Vi (kN)</th>
     </tr>
     ${rows}
   </table>
   <div style="margin-top:8px;color:#8b949e;font-size:10.5px">Referencias NEC:</div>
   <ul style="margin:4px 0 0 0;padding-left:15px;font-size:10.5px;color:#8b949e">
     ${[r.refs.V, r.refs.W, r.refs.dist, r.refs.k].map((x) => `<li>${x}</li>`).join("")}
   </ul>`;
}

const pane = new Pane({ title: "⚙️ Cortante basal NEC-SE-DS", container: paneHost });
pane.addBinding(state, "norma", { label: "Norma", options: { "NEC-15 (2014)": "NEC15", "Borrador 2023": "BORRADOR2023" } }).on("change", recompute);
pane.addBinding(state, "region", { label: "Región", options: { Costa: "Costa", Sierra: "Sierra", Oriente: "Oriente", Esmeraldas: "Esmeraldas", Galápagos: "Galapagos" } }).on("change", recompute);
pane.addBinding(state, "suelo", { label: "Suelo", options: { A: "A", B: "B", C: "C", D: "D", E: "E" } }).on("change", recompute);
pane.addBinding(state, "Z", { label: "Factor Z (g)", min: 0.1, max: 0.6, step: 0.01 }).on("change", recompute);

const fR = pane.addFolder({ title: "Reducción", expanded: true });
fR.addBinding(state, "R", { label: "R", min: 1, max: 8, step: 0.5 }).on("change", recompute);
fR.addBinding(state, "I", { label: "Importancia I", options: IMPORTANCIA }).on("change", recompute);
fR.addBinding(state, "phiP", { label: "ΦP", min: 0.9, max: 1.0, step: 0.05 }).on("change", recompute);
fR.addBinding(state, "phiE", { label: "ΦE", min: 0.9, max: 1.0, step: 0.05 }).on("change", recompute);

const fB = pane.addFolder({ title: "Edificio", expanded: true });
fB.addBinding(state, "N", { label: "N° pisos", min: 1, max: 40, step: 1 }).on("change", recompute);
fB.addBinding(state, "he", { label: "Altura entrepiso (m)", min: 2.4, max: 5, step: 0.1 }).on("change", recompute);
fB.addBinding(state, "wPiso", { label: "Peso/piso W (kN)", min: 100, max: 10000, step: 50 }).on("change", recompute);
fB.addBinding(state, "tipoTa", { label: "Tipo (Ta)", options: Object.fromEntries(Object.keys(TIPOS_TA_NEC15).map((k) => [k, k])) }).on("change", recompute);

recompute();
