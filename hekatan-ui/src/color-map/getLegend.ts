import van, { State } from "vanjs-core";
import { fixedColorMapRange, colorMapUnit } from "../viewer/getViewer";
import { colorMapPalette, legendGradientCss, robustRange, isDiscreteCsiPalette } from "./getColorMap";

import "./styles.css";

export function getLegend(
  values: State<number[]>,
  numMarkerIntervals: number = 8
): HTMLDivElement {
  const legendElm = document.createElement("div");
  legendElm.id = "legend";

  // Etiqueta de unidad arriba del legend (mm, kN/m², etc.).
  const unitLabel = document.createElement("div");
  unitLabel.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace";
  legendElm.appendChild(unitLabel);
  // setTimeout evita TDZ por import circular con getViewer (colorMapUnit aún no inicializado).
  setTimeout(() => {
    van.derive(() => { unitLabel.textContent = colorMapUnit.val ? `[${colorMapUnit.val}]` : ""; });
  });

  // Host de los markers: se RECONSTRUYE cuando cambia el nº de bandas — las paletas CSI
  // (safe/etabs/sap2000) usan 15 bandas discretas (16 valores, en los BORDES de cada banda,
  // como la barra real de SAFE/ETABS/SAP2000); las demás (jet/jet_r/viridis) mantienen el
  // nº de intervalos que pida el llamador (8 por defecto).
  const markersHost = document.createElement("div");
  legendElm.appendChild(markersHost);

  let textElements: HTMLElement[] = [];
  let currentN = -1;
  function rebuildMarkers(n: number) {
    if (n === currentN) return;
    currentN = n;
    legendElm.style.setProperty("--legend-n", String(n));
    markersHost.innerHTML = "";
    textElements = [];
    for (let i = 0; i <= n; i++) {
      const markerElem = document.createElement("div");
      markerElem.className = "marker";
      markerElem.style.marginTop = i === 0 ? `0px` : `calc(var(--legend-h) / var(--legend-n) - 1px)`;
      const markerText = document.createElement("p");
      markerElem.append(markerText);
      markersHost.append(markerElem);
      textElements.push(markerText);
    }
  }

  // La barra de color usa la PALETA ACTIVA (no el gradiente hardcodeado del CSS), reconstruye
  // los markers si hace falta (discreta ↔ continua) y recalcula sus valores — todo junto para
  // que quede sincronizado al cambiar de paleta desde Settings.
  setTimeout(() => {
    van.derive(() => {
      const discrete = isDiscreteCsiPalette(colorMapPalette.val);
      rebuildMarkers(discrete ? 15 : numMarkerIntervals);
      legendElm.style.background = legendGradientCss();
      legendElm.classList.toggle("legend-discrete", discrete);
      const ratios = Array.from({ length: currentN + 1 }, (_, i) => i / currentN).reverse();
      ratios.forEach((ratio, i) => {
        const el = textElements[i];
        if (el) el.innerText = getMarkerValue(values.val, ratio).toString();
      });
    });
  });

  return legendElm;
}

// Utils
function getMarkerValue(values: number[], ratio: number) {
  // Si hay override fijo (ej. zapata: [0, -q_adm]), usarlo para el legend también
  const rng = fixedColorMapRange.val;
  if (rng) {
    // Paletas CSI: el ORDEN de rng (puede venir invertido, p.ej. [0, -q_adm]) fija los
    // EXTREMOS del rango, no qué extremo es magenta y cuál azul — eso lo decide SIEMPRE
    // el signo algebraico (mín → magenta, máx → azul), igual que getColorMap.ts. Sin este
    // ordenamiento el marcador de arriba (banda azul) mostraba el valor más NEGATIVO.
    if (isDiscreteCsiPalette(colorMapPalette.val)) {
      const lo = Math.min(rng[0], rng[1]);
      const hi = Math.max(rng[0], rng[1]);
      return fmtLegend(lo + ratio * (hi - lo));
    }
    return fmtLegend(rng[0] + ratio * (rng[1] - rng[0]));
  }
  const valid = values.filter((v) => Number.isFinite(v));
  if (valid.length === 0) return "0";
  const [vMin, vMax] = robustRange(valid);   // el MISMO rango que pinta la malla (getColorMap)
  return fmtLegend(vMin + ratio * (vMax - vMin));
}

/** 3 cifras, pero CORTO: `-0.000123` (9 caracteres) se salía de la columna y en pantalla se leía
 *  `-0.000` en todos los marcadores (muros en tonf·m/m, 6-sep-2026). Fuera de [1e-3, 1e5) va en
 *  notación científica: `-1.23e-4`. */
function fmtLegend(v: number): string {
  if (!Number.isFinite(v)) return "—";
  if (v === 0) return "0";
  const a = Math.abs(v);
  return (a < 1e-3 || a >= 1e5) ? v.toExponential(2) : v.toPrecision(3);
}
