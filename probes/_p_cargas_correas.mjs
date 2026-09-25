// Diagnóstico: ¿las cargas de CORREAS están repartidas en todas las barras del .s2k?
// Una sola pasada por el archivo (Get-Content -Raw es lento con archivos grandes).
import { readFileSync } from "fs";
const f = process.argv[2] ?? "C:\\Users\\j-b-j\\Downloads\\Cancha Parque v24.s2k";
const txt = readFileSync(f, "utf8");
const lineas = txt.split(/\r?\n/);

// 1) todos los frames definidos (CONNECTIVITY - FRAME)
let tabla = "", conectFrames = [], juntas = [];
for (const l of lineas) {
  const m = l.match(/^TABLE:\s*"([^"]+)"/);
  if (m) { tabla = m[1]; continue; }
  if (tabla === "CONNECTIVITY - FRAME" && /^\d/.test(l)) conectFrames.push(l);
  if (tabla === "CONNECTIVITY - JOINT" && /^\d/.test(l)) juntas.push(l);
}

// 2) la tabla de cargas distribuidas por barra
let fl = [], enFL = false;
for (const l of lineas) {
  const m = l.match(/^TABLE:\s*"([^"]+)"/);
  if (m) { enFL = m[1] === "FRAME LOADS - DISTRIBUTED"; continue; }
  if (enFL && /^\d/.test(l)) fl.push(l);
}

// resumen
const nombresFrames = new Set();
for (const l of conectFrames) { const c = l.split(","); nombresFrames.add(c[1]?.trim()); }
const conCarga = new Set();
let conRango = 0, ejemplosRango = [], tiposCarga = {};
for (const l of fl) {
  const c = l.split(",").map((s) => s.trim());
  const nombre = c[1] ?? "";
  if (/\bTO\b/i.test(nombre)) { conRango++; if (ejemplosRango.length < 3) ejemplosRango.push(nombre); }
  conCarga.add(nombre);
  const tipo = c[4] ?? "?";
  tiposCarga[tipo] = (tiposCarga[tipo] ?? 0) + 1;
}
const sinCarga = [...nombresFrames].filter((n) => !conCarga.has(n) && ![...conCarga].some((r) => {
  const m2 = r.match(/^(.*?)\s+TO\s+(.*?)$/i);
  if (!m2) return false;
  const num = (s) => (s.match(/(\d+)$/) ?? [])[1] ?? "";
  const [a, b] = [num(m2[1]), num(m2[2])];
  const n2 = num(n);
  return a && b && n2 && +n2 >= +Math.min(a, b) && +n2 <= +Math.max(a, b);
}));

console.log(JSON.stringify({
  framesDefinidos: nombresFrames.size,
  filasFRAME_LOADS_DISTRIBUTED: fl.length,
  framesConFilaPropia: conCarga.size,
  filasConRangoTO: conRango, ejemplosRango,
  tiposColumna5: tiposCarga,
  framesSinCarga: sinCarga.length,
  ejemplosSinCarga: sinCarga.slice(0, 15),
  muestraFL: fl.slice(0, 4),
}, null, 1));
