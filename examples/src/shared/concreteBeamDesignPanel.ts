import {
  designConcreteBeam,
  ETABS_TORSION_COVER,
  type ConcreteBeamCode,
  type ConcreteBeamDesignResult,
} from "./concreteBeamDesign";
import { registrarDiseno } from "./menuDiseno";
import { abrirHoja } from "hekatan-ui/src/cad/hojaLisp";

type StateBundle = {
  nodes: any;
  elements: any;
  elementInputs: any;
  analyzeOutputs: any;
  activeLoadCase?: any;
};

type DesignContext = { states: StateBundle };

type DesignRow = {
  beam: string;
  element: number;
  station: number;
  Mu: number;
  Vu: number;
  Tu: number;
  result: ConcreteBeamDesignResult;
};

type DesignConfig = {
  code: ConcreteBeamCode;
  fcMPa: number;
  fyMPa: number;
  coverM: number;
  spacingM: number;
};

const stateValue = (state: any): any => state?.val ?? state?.rawVal ?? state;
const endValues = (map: Map<number, number[]> | undefined, index: number): number[] => {
  const value = map?.get?.(index);
  return Array.isArray(value) ? value : [0, 0];
};
const interpolate = (a: number, b: number, t: number): number => a + (b - a) * t;
const maxAbs = (a: number, b: number): number => Math.max(Math.abs(a), Math.abs(b));
const isFiniteNumber = (value: any): value is number => typeof value === "number" && Number.isFinite(value);

function horizontalFrame(nodes: number[][], element: number[]): boolean {
  if (element.length !== 2) return false;
  const a = nodes[element[0]];
  const b = nodes[element[1]];
  if (!a || !b) return false;
  const length = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  return length > 1e-9 && Math.abs(b[2] - a[2]) <= Math.max(0.03, length * 0.02);
}

function readSection(shape: any): { b: number; h: number } | null {
  if (!shape || shape.type !== "rect") return null;
  if (!isFiniteNumber(shape.b) || !isFiniteNumber(shape.h) || shape.b <= 0 || shape.h <= 0) return null;
  return { b: shape.b, h: shape.h };
}

function beamGroupLabels(
  nodes: number[][],
  elements: number[][],
  sections: Map<number, any> | undefined,
): Map<number, string> {
  const candidates = elements.map((element, index) => ({ element, index }))
    .filter(({ element, index }) => horizontalFrame(nodes, element) && readSection(sections?.get?.(index)));
  const parent = new Map<number, number>(candidates.map(({ index }) => [index, index]));
  const find = (index: number): number => {
    const current = parent.get(index);
    if (current === undefined || current === index) return index;
    const root = find(current);
    parent.set(index, root);
    return root;
  };
  const union = (a: number, b: number): void => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(rb, ra);
  };
  const direction = (element: number[]): number[] | null => {
    const a = nodes[element[0]];
    const b = nodes[element[1]];
    if (!a || !b) return null;
    const length = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    return length <= 1e-9 ? null : [(b[0] - a[0]) / length, (b[1] - a[1]) / length, (b[2] - a[2]) / length];
  };
  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const left = candidates[i];
      const right = candidates[j];
      if (left.element[0] !== right.element[0] && left.element[0] !== right.element[1] &&
          left.element[1] !== right.element[0] && left.element[1] !== right.element[1]) continue;
      const dl = direction(left.element);
      const dr = direction(right.element);
      const sl = sections?.get?.(left.index);
      const sr = sections?.get?.(right.index);
      if (!dl || !dr || !sl || !sr || sl.b !== sr.b || sl.h !== sr.h) continue;
      if (Math.abs(dl[0] * dr[0] + dl[1] * dr[1] + dl[2] * dr[2]) > 0.999) union(left.index, right.index);
    }
  }
  const roots = new Map<number, number>();
  let next = 1;
  for (const { index } of candidates) {
    const root = find(index);
    if (!roots.has(root)) roots.set(root, next++);
  }
  return new Map(candidates.map(({ index }) => [index, `B${roots.get(find(index))}`]));
}

function designRows(context: DesignContext, config: DesignConfig): DesignRow[] {
  const states = context.states;
  const nodes = stateValue(states.nodes) as number[][];
  const elements = stateValue(states.elements) as number[][];
  const inputs = stateValue(states.elementInputs) ?? {};
  const analysis = stateValue(states.analyzeOutputs) ?? {};
  const sections = inputs.sectionShapes as Map<number, any> | undefined;
  const shear = analysis.shearsY as Map<number, number[]> | undefined;
  const torsion = analysis.torsions as Map<number, number[]> | undefined;
  const moments = analysis.bendingsZ as Map<number, number[]> | undefined;
  const momentsMinor = analysis.bendingsY as Map<number, number[]> | undefined;
  const axial = analysis.normals as Map<number, number[]> | undefined;
  const rows: DesignRow[] = [];
  const stations = [0, 0.25, 0.5, 0.75, 1];
  const groups = beamGroupLabels(nodes, elements, sections);
  elements.forEach((element, index) => {
    if (!horizontalFrame(nodes, element)) return;
    const section = readSection(sections?.get?.(index));
    if (!section) return;
    const v = endValues(shear, index);
    const t = endValues(torsion, index);
    const mMajor = endValues(moments, index);
    const mMinor = endValues(momentsMinor, index);
    const p = endValues(axial, index);
    const a = nodes[element[0]];
    const b = nodes[element[1]];
    const length = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    for (const fraction of stations) {
      const Mu = interpolate(mMajor[0] ?? 0, mMajor[1] ?? 0, fraction);
      const MuMinor = interpolate(mMinor[0] ?? 0, mMinor[1] ?? 0, fraction);
      const result = designConcreteBeam({
        code: config.code,
        section: { ...section, coverToBarCenter: config.coverM || ETABS_TORSION_COVER },
        material: {
          fc: config.fcMPa * 1000,
          fy: config.fyMPa * 1000,
          fys: config.fyMPa * 1000,
        },
        demand: {
          Mu: Math.abs(Mu) >= Math.abs(MuMinor) ? Mu : MuMinor,
          Vu: maxAbs(v[0] ?? 0, v[1] ?? 0),
          Tu: maxAbs(t[0] ?? 0, t[1] ?? 0),
          Pu: Math.max(0, -(p[0] ?? 0), -(p[1] ?? 0)),
          station: length * fraction,
        },
        stirrupSpacing: config.spacingM,
      });
      rows.push({ beam: groups.get(index) ?? `F${index + 1}`, element: index, station: length * fraction, Mu: result.flexure.Mu, Vu: result.shear.Vu, Tu: result.torsion.Tu, result });
    }
  });
  return rows;
}

function formatNumber(value: number, digits = 2): string {
  return Number.isFinite(value) ? value.toFixed(digits) : "—";
}

function summaryStatus(result: ConcreteBeamDesignResult): string {
  if (!result.interaction.pass) return "O/S V";
  if (!result.shear.shearPass) return "O/S V";
  if (!result.torsion.criticalPass) return "O/S T";
  if (result.flexure.flexureRatio > 1) return "O/S F";
  return "OK";
}

function controllingRows(rows: DesignRow[]): Map<string, DesignRow> {
  const controlling = new Map<string, DesignRow>();
  for (const row of rows) {
    const current = controlling.get(row.beam);
    if (!current || row.result.interaction.ratio > current.result.interaction.ratio) controlling.set(row.beam, row);
  }
  return controlling;
}

function reportForBeam(beam: string, rows: DesignRow[], config: DesignConfig): string {
  const beamRows = rows.filter((row) => row.beam === beam);
  const control = controllingRows(rows).get(beam) ?? beamRows[0];
  if (!control) return `# Reporte RC · ${beam}\n\nNo hay datos para esta viga.`;
  const r = control.result;
  const status = r.interaction.pass ? summaryStatus(r) : "O/S #45";
  const stationIndexes = [...new Set([0, Math.floor((beamRows.length - 1) / 2), beamRows.length - 1, beamRows.indexOf(control)])].sort((a, b) => a - b);
  const stationRows = stationIndexes.map((index) => {
    const row = beamRows[index];
    const x = row.result;
    return `#| ${formatNumber(row.station, 3)} m | ${formatNumber(x.flexure.Mu)} kN*m | ${formatNumber(x.shear.Vu)} kN | ${formatNumber(x.torsion.Tu)} kN*m | ${formatNumber(x.interaction.ratio, 4)} | ${x.interaction.pass ? "OK" : "O/S #45"} |`;
  }).join("\n");
  const report = [
    `# Reporte de diseño RC · ${beam}`,
    `#: Estación control: ${formatNumber(control.station, 3)} m · Norma: ${config.code} · Estado: ${status}`,
    "",
    "#: 1 · Datos y resultados de la estación control",
    "#| Dato | Valor | Dato | Valor |",
    "#|---|---:|---|---:|",
    `#| b | ${formatNumber(r.section.b, 4)} m | h | ${formatNumber(r.section.h, 4)} m |`,
    `#| d | ${formatNumber(r.section.d, 4)} m | c | ${formatNumber(config.coverM, 5)} m |`,
    `#| f'c | ${formatNumber(config.fcMPa, 2)} MPa | fy | ${formatNumber(config.fyMPa, 0)} MPa |`,
    `#| Mu | ${formatNumber(r.flexure.Mu)} kN*m | Vu | ${formatNumber(r.shear.Vu)} kN |`,
    `#| Tu | ${formatNumber(r.torsion.Tu)} kN*m | φVc | ${formatNumber(r.shear.phiVc)} kN |`,
    `#| Aoh | ${formatNumber(r.section.Aoh, 6)} m^2 | ph | ${formatNumber(r.section.ph, 4)} m |`,
    `#| Vc | ${formatNumber(r.shear.Vc)} kN | Vmax | ${formatNumber(r.shear.Vmax)} kN |`,
    `#| Tth | ${formatNumber(r.torsion.Tth)} kN*m | Tcr | ${formatNumber(r.torsion.Tcr)} kN*m |`,
    `#| AsTop | ${formatNumber(r.flexure.AsTop * 10000, 4)} cm^2 | AsBot | ${formatNumber(r.flexure.AsBottom * 10000, 4)} cm^2 |`,
    `#| Av/s | ${formatNumber(r.shear.Avs * 10000, 4)} cm^2/m | Al | ${formatNumber(r.torsion.Al * 10000, 4)} cm^2 |`,
    `#| Int. | ${formatNumber(r.interaction.ratio, 4)} | φTcr/Tu | ${formatNumber(r.torsion.criticalRatio, 4)} |`,
    `#| Error | ${r.error ?? "—"} |  |  |`,
    "",
    `#: 2 · Estaciones de la viga (inicio, mitad, final y control; total ${beamRows.length})`,
    "#| x | Mu | Vu | Tu | Int. | Estado |",
    "#|---:|---:|---:|---:|---:|---|",
    stationRows,
    "",
    "#: 3 · Fórmulas de control",
    "#: A_{oh} = (b - 2*c)*(h - 2*c)",
    "#: p_h = 2*((b - 2*c) + (h - 2*c))",
    "#: A_s = Mu/(phi*fy*(d - a/2))",
    "#: Av/s = (Vu - phi*Vc)/(phi*fys*d*s)",
    "#: A_l = Tu*p_h/(2*phi*A_0*fy)",
    "#: f_int = sqrt((Vu/(b*d))^2 + (Tu*p_h/(1.7*A_{oh}^2))^2)",
    "#: f_cap = phi*(Vc/(b*d) + 2*sqrt(f'c))",
    "#: O/S #45 cuando f_int > f_cap",
  ].join("\n");
  return ["```lisp", report, "```"].join("\n");
}

function renderRows(rows: DesignRow[]): string {
  if (!rows.length) return "<div style='padding:10px;color:#aaa'>No hay barras horizontales rectangulares con resultados.</div>";
  const controlling = controllingRows(rows);
  const body = rows.map((row, index) => {
    const r = row.result;
    const status = controlling.get(row.beam) === row ? summaryStatus(r) : "";
    const summaryStatusText = !r.interaction.pass ? "See ErrMsg" : status;
    const err = r.interaction.error ?? "";
    return `<tr data-beam="${row.beam}" data-row="${index}" style="cursor:pointer" title="Abrir reporte de ${row.beam}">
      <td>${row.beam}</td>
      <td>${formatNumber(row.station)}</td>
      <td>${formatNumber(row.Mu)}</td>
      <td>${formatNumber(row.Vu)}</td>
      <td>${formatNumber(row.Tu)}</td>
      <td>${formatNumber(r.flexure.AsTop * 10000)}</td>
      <td>${formatNumber(r.flexure.AsBottom * 10000)}</td>
      <td>${formatNumber(r.shear.Avs * 10000)}</td>
      <td>${formatNumber(r.torsion.Al * 10000)}</td>
      <td>${formatNumber(r.torsion.criticalRatio, 4)}</td>
      <td>${formatNumber(r.interaction.ratio, 4)}</td>
      <td>${status}</td>
      <td>${summaryStatusText}</td>
      <td>${err}</td>
    </tr>`;
  }).join("");
  return `<table style="border-collapse:collapse;width:100%;font-size:11px">
    <thead><tr>${["Barra", "x(m)", "Mu", "Vu", "Tu", "AsTop", "AsBot", "Av/s", "Al", "φTcr/Tu", "Int.", "Envelope", "Resumen", "Error"].map((h) => `<th style="padding:3px;border-bottom:1px solid #587;white-space:nowrap;color:#9cc">${h}</th>`).join("")}</tr></thead>
    <tbody>${body}</tbody>
  </table>`;
}

function downloadCsv(rows: DesignRow[]): void {
  const header = "Barra,Estacion_m,Mu_kNm,Vu_kN,Tu_kNm,AsTop_cm2,AsBot_cm2,Avs_cm2_m,Al_cm2,phiTcr_Tu,Interaction,Envelope,Resumen,Error";
  const controlling = controllingRows(rows);
  const lines = rows.map((row) => {
    const r = row.result;
    return [
      row.beam,
      row.station.toFixed(4),
      row.Mu.toFixed(4),
      row.Vu.toFixed(4),
      row.Tu.toFixed(4),
      (r.flexure.AsTop * 10000).toFixed(4),
      (r.flexure.AsBottom * 10000).toFixed(4),
      (r.shear.Avs * 10000).toFixed(4),
      (r.torsion.Al * 10000).toFixed(4),
      r.torsion.criticalRatio.toFixed(4),
      r.interaction.ratio.toFixed(4),
      controlling.get(row.beam) === row ? summaryStatus(r) : "",
      !r.interaction.pass ? "See ErrMsg" : "",
      r.interaction.error ?? "",
    ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",");
  });
  const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "diseno-vigas-hormigon.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function montarPanelDisenoVigas(context?: DesignContext): void {
  if (document.getElementById("hk-diseno-vigas")) return;
  const panel = document.createElement("div");
  panel.id = "hk-diseno-vigas";
  panel.style.cssText = "position:fixed;top:90px;right:12px;z-index:950;width:min(1100px,calc(100vw - 24px));max-height:78vh;overflow:auto;background:rgba(24,28,34,.97);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:12px sans-serif;padding:8px;display:none";
  panel.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><b>Diseño de vigas RC · ACI 318-14/19</b><span id="hkdv-x" style="cursor:pointer">✕</span></div>
    <div style="margin:6px 0;color:#9cc">Los resultados usan el caso/combinación visible. Las unidades de entrada son MPa, cm y m.</div>
    <fieldset style="border:1px solid #445;padding:5px"><legend>Material y Norma</legend>
      <label>Norma <select id="hkdv-code"><option>ACI 318-19</option><option>ACI 318-14</option></select></label>
      <label>f'c <input id="hkdv-fc" type="number" value="27.58" step="0.01" style="width:58px"> MPa</label>
      <label>fy <input id="hkdv-fy" type="number" value="420" step="1" style="width:58px"> MPa</label>
      <label>c <input id="hkdv-cover" type="number" value="4.445" step="0.05" style="width:58px"> cm</label>
      <label>s <input id="hkdv-space" type="number" value="30" step="1" style="width:58px"> cm</label>
      <button id="hkdv-run" style="background:#2d6a2d;color:#fff">Calcular</button>
      <button id="hkdv-csv">CSV</button>
    </fieldset>
    <div id="hkdv-info" style="margin:5px 0;color:#ffb"></div>
    <div id="hkdv-res"></div>`;
  document.body.append(panel);
  const $ = (id: string) => panel.querySelector("#" + id) as HTMLElement;
  const readConfig = () => ({
    code: ($("hkdv-code") as HTMLSelectElement).value as ConcreteBeamCode,
    fcMPa: Number(($("hkdv-fc") as HTMLInputElement).value),
    fyMPa: Number(($("hkdv-fy") as HTMLInputElement).value),
    coverM: Number(($("hkdv-cover") as HTMLInputElement).value) / 100,
    spacingM: Number(($("hkdv-space") as HTMLInputElement).value) / 100,
  });
  $("hkdv-res").onclick = (event) => {
    const target = (event.target as HTMLElement).closest("tr[data-beam]") as HTMLTableRowElement | null;
    const beam = target?.dataset.beam;
    if (beam) abrirHoja(`Reporte RC · ${beam}`, reportForBeam(beam, rows, readConfig()));
  };
  let rows: DesignRow[] = [];
  const run = () => {
    const ctx = context ?? { states: (window as any).__hekatanStates };
    if (!ctx?.states) {
      $("hkdv-info").textContent = "No hay estados del modelo.";
      return;
    }
    try {
      rows = designRows(ctx, readConfig());
      const errors = rows.filter((row) => !row.result.interaction.pass).length;
      const critical = rows.filter((row) => !row.result.torsion.criticalPass).length;
      const beams = new Set(rows.map((row) => row.beam)).size;
      $("hkdv-info").textContent = `${beams} barras · ${errors} estaciones O/S #45 · ${critical} estaciones fuera de φTcr`;
      $("hkdv-res").innerHTML = renderRows(rows);
    } catch (error: any) {
      $("hkdv-info").textContent = `Error: ${error?.message ?? error}`;
    }
  };
  const abrirPanel = () => {
    panel.style.display = "block";
    run();
  };
  registrarDiseno({ id: "diseno-vigas-rc", orden: 4, icono: "▣", titulo: "Vigas de hormigón RC", detalle: "Flexión, cortante, torsión y chequeo O/S #45.", abrir: abrirPanel });
  $("hkdv-x").onclick = () => { panel.style.display = "none"; };
  $("hkdv-run").onclick = run;
  $("hkdv-csv").onclick = () => downloadCsv(rows);
}
