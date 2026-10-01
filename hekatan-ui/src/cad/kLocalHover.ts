/**
 * Al PASAR por una barra: su matriz de rigidez local, en una tarjeta con el aspecto de una hoja de
 * Hekatan LISP (papel claro, letra de libro, la matriz entre corchetes).
 *
 * Jorge, 27-sep-2026: «al pasar por una barra, la matriz local de ese elemento; usa Hekatan LISP,
 * me gusta así». El rótulo de siempre (número, largo, fuerzas) sigue saliendo al instante; la
 * tarjeta aparece si el cursor se QUEDA en la barra medio segundo, para no taparlo todo al cruzar
 * el modelo. «Hoja completa» abre la deducción en el motor de Hekatan LISP.
 *
 * El visor avisa con el evento `hk:hover` (lo lanza `viewer/objects/hover.ts`).
 */
import { hoverPrefs } from "../viewer/hoverPrefs";
import { abrirHoja } from "./hojaLisp";
import { comprobar, comprobarLetras, corto, datosBarra, elementosDelModelo, formulaHtml, GDL, hojaBarraNumerica, hojaBarraSimbolica, kLetras, kLocalBarra } from "./kLocalBarra";
import { comprobarPano, datosPano, formulacionPano, formulaMembrana, formulaPlaca, GDL_FLEXION, GDL_MEMBRANA, hojaPanoNumerica, hojaPanoSimbolica } from "./kLocalPano";

const ESPERA = 450;          // ms quieto sobre la barra antes de abrir
const W = () => window as any;
let tarjeta: HTMLDivElement | null = null;
let reloj = 0, cierre = 0, abierta = "", dentro = false;
let vista: "numeros" | "letras" = "numeros";   // lo que se ve de la barra; se recuerda entre barras
let activo = true;

const CSS = `
#hk-klocal{position:fixed;z-index:9300;display:none;max-width:min(880px,calc(100vw - 24px));
  background:#fbf7ee;color:#1d1b17;border:1px solid #cdbf9a;border-radius:8px;
  box-shadow:0 12px 40px rgba(0,0,0,.55);font:13px 'Segoe UI',system-ui,sans-serif;padding:10px 14px 10px}
#hk-klocal h4{margin:0 0 2px;font:700 15px 'Segoe UI',system-ui,sans-serif;color:#14120f;text-align:center}
#hk-klocal .sub{color:#5b5446;font-size:12px;text-align:center;margin-bottom:6px}
#hk-klocal .datos{display:grid;grid-template-columns:repeat(4,auto);gap:1px 14px;justify-content:center;
  font:13px Georgia,'Times New Roman',serif;color:#0b3a7a;margin:4px 0 8px}
#hk-klocal .datos i{color:#0b4fa8} #hk-klocal .datos span{white-space:nowrap}
#hk-klocal .datos small{color:#6b6257;font:11px 'Segoe UI',sans-serif;margin-left:3px}
#hk-klocal .mat{display:flex;align-items:center;justify-content:center;gap:6px;overflow:auto}
#hk-klocal .mat b{font:italic 700 15px Georgia,serif;color:#0b4fa8}
#hk-klocal table{border-collapse:collapse;font:12px Georgia,'Times New Roman',serif;color:#12305e;
  border-left:2px solid #1d1b17;border-right:2px solid #1d1b17;border-radius:7px}
#hk-klocal td{padding:1px 6px;text-align:right;white-space:nowrap}
#hk-klocal td.c{color:#b9ae98}
#hk-klocal th{font:italic 11px Georgia,serif;color:#8a7f6a;padding:0 6px 2px;text-align:right;font-weight:400}
#hk-klocal th.f{text-align:left;padding-right:8px}
#hk-klocal tr.s td{border-top:1px dashed #d8cdb0} #hk-klocal td.s,#hk-klocal th.s{border-left:1px dashed #d8cdb0}
#hk-klocal .pie{display:flex;align-items:center;gap:10px;margin-top:8px;font-size:12px;color:#5b5446}
#hk-klocal .ok{color:#1e6b40} #hk-klocal .mal{color:#a32b1e;font-weight:700}
#hk-klocal button{margin-left:auto;cursor:pointer;background:#0b4fa8;color:#fff;border:0;border-radius:5px;
  padding:4px 10px;font:600 12px 'Segoe UI',sans-serif}
#hk-klocal .u{color:#6b6257;font-size:11px}
#hk-klocal .tabs{display:flex;gap:4px;justify-content:center;margin:2px 0 6px}
#hk-klocal .tabs button{margin:0;background:#efe7d4;color:#3d3727;border:1px solid #cdbf9a;font-weight:500}
#hk-klocal .tabs button.on{background:#0b4fa8;color:#fff;border-color:#0b4fa8}
#hk-klocal td.l{font-style:italic;color:#0b4fa8} #hk-klocal td.l.n{color:#a32b1e}
#hk-klocal .ley{font:12px Georgia,serif;color:#12305e;text-align:center;margin-top:6px;line-height:1.55}
#hk-klocal .fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;line-height:1.05}
#hk-klocal .fr>span:first-child{border-bottom:1px solid currentColor;padding:0 2px}
#hk-klocal table.fx td{font-size:10.5px;padding:2px 5px;color:#0b4fa8}
#hk-klocal table.fx td.n{color:#a32b1e} #hk-klocal .itw{color:#8a6d1e;font-style:italic}
#hk-klocal .hojas{display:flex;gap:6px;margin-left:auto}
#hk-klocal .bloques{display:flex;flex-wrap:wrap;gap:10px 22px;justify-content:center;align-items:flex-start}
#hk-klocal table.fx td{white-space:nowrap}
#hk-klocal table.mapa{border:0;font:12px Georgia,serif;color:#12305e;border-collapse:collapse}
#hk-klocal table.mapa td,#hk-klocal table.mapa th{border:1px solid #d8cdb0;padding:3px 7px;text-align:center}
#hk-klocal table.mapa th{font:11px 'Segoe UI',sans-serif;color:#6b6257}
#hk-klocal table.mapa td.d{background:#efe7d4}
#hk-klocal .hojas button{margin:0}
#hk-klocal .hojas button.sim{background:#6b3fa0}
#hk-klocal .bl{font:600 12px 'Segoe UI',sans-serif;color:#3d3727;text-align:center;margin:8px 0 2px}
`;

function crear(): HTMLDivElement {
  const st = document.createElement("style");
  st.textContent = CSS;
  document.head.appendChild(st);
  const t = document.createElement("div");
  t.id = "hk-klocal";
  t.addEventListener("pointerenter", () => { dentro = true; clearTimeout(cierre); });
  t.addEventListener("pointerleave", () => { dentro = false; cerrarLuego(250); });
  document.body.appendChild(t);
  return t;
}

function cerrar(): void {
  if (tarjeta) tarjeta.style.display = "none";
  abierta = "";
}
function cerrarLuego(ms: number): void {
  clearTimeout(cierre);
  cierre = window.setTimeout(() => { if (!dentro) cerrar(); }, ms);
}

const sub = (t: string) => t.replace(/([₀-₉]+)/g, "<sub>$1</sub>").replace(/[₀-₉]/g, (c) => String("₀₁₂₃₄₅₆₇₈₉".indexOf(c)));
const dato = (s: string, v: string, u: string) => `<span><i>${s}</i> = ${v}<small>${u}</small></span>`;
const num = (v: number) => (Math.abs(v) >= 1e6 || (v !== 0 && Math.abs(v) < 1e-3) ? v.toExponential(3).replace("e+", "e") : String(+v.toPrecision(6)));

function pintar(idx: number, x: number, y: number): void {
  const st = W().__hekatanStates;
  const d = datosBarra(st, idx);
  let K: number[][] | null = null;
  try { K = d ? kLocalBarra(st, idx) : null; } catch { K = null; }
  if (!d || !K) return;
  if (!tarjeta) tarjeta = crear();
  const c = comprobar(K, d.L);
  const cab = GDL.concat(GDL).map((g, j) => `<th class="${j === 6 ? "s" : ""}">${sub(g)}${j > 5 ? "′" : ""}</th>`).join("");
  const Lt = kLetras();
  // «En letras» = la FÓRMULA de cada término en su casilla (no solo su nombre)
  const LsF = d.brazos ? "Lf" : "L";
  const letra = (t: string) => formulaHtml(t, LsF);
  const filas = K.map((f, i) =>
    `<tr class="${i === 6 ? "s" : ""}"><th class="f">${sub(GDL[i % 6])}${i > 5 ? "′" : ""}</th>` +
    f.map((v, j) => vista === "letras"
      ? `<td class="${Lt[i][j] === "0" ? "c" : "l"}${Lt[i][j].startsWith("-") ? " n" : ""}${j === 6 ? " s" : ""}">${letra(Lt[i][j])}</td>`
      : `<td class="${Math.abs(v) < 1e-9 ? "c" : ""}${j === 6 ? " s" : ""}">${corto(v)}</td>`).join("") + "</tr>").join("");
  const cl = comprobarLetras(d, K);
  const Ls = d.brazos ? "L<sub>f</sub>" : "L";
  const leyenda = vista !== "letras" ? "" :
    `<div class="ley">φ<sub>3</sub> = 12<i>EI</i><sub>33</sub>/(<i>GA</i><sub>s2</sub>${Ls}²) · φ<sub>2</sub> = 12<i>EI</i><sub>22</sub>/(<i>GA</i><sub>s3</sub>${Ls}²) · con φ = 0, Euler-Bernoulli<br>` +
    (cl.aplica ? `<span class="${cl.difRel < 1e-9 ? "ok" : "mal"}">${cl.difRel < 1e-9 ? "✓" : "✕"} con los números de esta barra da la matriz del solver</span>`
      : `<span class="u">esta barra tiene ${d.liberaciones ? "liberaciones" : "brazos rígidos"}: el solver usa la matriz ${d.liberaciones ? "condensada" : "con los brazos"} (pestaña «Con números»)</span>`) + `</div>`;
  tarjeta.innerHTML =
    `<h4>Matriz de rigidez local · barra ${d.idx + 1}</h4>` +
    `<div class="sub">nudo ${d.n1} → nudo ${d.n2} · ${d.formulacion}</div>` +
    (d.brazos ? `<div class="sub">Brazos rígidos: ${num(d.brazos[0])} m y ${num(d.brazos[1])} m · factor ${num(d.brazos[2])} · longitud flexible ${num(d.Lf)} m</div>` : "") +
    `<div class="datos">` +
    dato("L", num(d.L), "m") + dato("E", num(d.E), "kN/m²") + dato("G", num(d.G), "kN/m²") + dato("A", num(d.A), "m²") +
    dato("I<sub>33</sub>", num(d.I33), "m⁴") + dato("I<sub>22</sub>", num(d.I22), "m⁴") +
    dato("A<sub>s2</sub>", num(d.As2), "m²") + dato("A<sub>s3</sub>", num(d.As3), "m²") +
    dato("J", num(d.J), "m⁴") + dato("φ<sub>3</sub>", num(d.phi3), "") + dato("φ<sub>2</sub>", num(d.phi2), "") +
    dato("ángulo", num(d.ang), "°") +
    `</div>` +
    `<div class="tabs"><button data-v="numeros" class="${vista === "numeros" ? "on" : ""}">Con números</button>` +
    `<button data-v="letras" class="${vista === "letras" ? "on" : ""}">En letras</button></div>` +
    `<div class="mat"><b>K</b><span>=</span><table class="${vista === "letras" ? "fx" : ""}"><tr><th></th>${cab}</tr>${filas}</table></div>` + leyenda +
    `<div class="pie"><span class="u">kN y m · ejes de la barra · ′ = nudo final</span>` +
    `<span class="${c.simetrica ? "ok" : "mal"}">${c.simetrica ? "✓" : "✕"} simétrica</span>` +
    `<span class="${c.rigido ? "ok" : "mal"}">${c.rigido ? "✓" : "✕"} sólido rígido sin fuerza</span>` +
    `<span class="hojas"><button class="sim" id="hk-klocal-sim">📐 Formulación simbólica</button>` +
    `<button id="hk-klocal-num">🔢 Formulación numérica</button></span></div>`;
  tarjeta.style.display = "block";
  colocar(x, y);
  abierta = "frame:" + idx;
  // las DOS hojas se generan al abrir la tarjeta; cada botón abre la suya
  const hojas = hojasBarra(idx);
  (tarjeta.querySelector("#hk-klocal-sim") as HTMLButtonElement).onclick = () => mostrar(hojas?.sim);
  (tarjeta.querySelector("#hk-klocal-num") as HTMLButtonElement).onclick = () => mostrar(hojas?.num);
  tarjeta.querySelectorAll<HTMLButtonElement>(".tabs button").forEach((b) => {
    b.onclick = () => { vista = b.dataset.v as any; pintar(idx, x, y); };
  });
}

/** Coloca la tarjeta al lado del cursor, siempre ENTERA dentro de la ventana. */
function colocar(x: number, y: number): void {
  if (!tarjeta) return;
  const r = tarjeta.getBoundingClientRect();
  let px = x + 18, py = y + 18;
  if (px + r.width > window.innerWidth - 8) px = Math.max(8, x - r.width - 18);
  if (px + r.width > window.innerWidth - 8) px = Math.max(8, window.innerWidth - r.width - 8);
  if (py + r.height > window.innerHeight - 8) py = Math.max(8, y - r.height - 18);
  if (py + r.height > window.innerHeight - 8) py = Math.max(8, window.innerHeight - r.height - 8);
  tarjeta.style.left = px + "px";
  tarjeta.style.top = py + "px";
}

/** Tabla de un bloque del paño (flexión o membrana), 3n × 3n. */
function tablaPano(K: number[][], gdl: string[], nudos: number[]): string {
  const et = nudos.flatMap((n) => gdl.map((g) => `${g}<sub>${n}</sub>`));
  const nn = gdl.length;
  const cab = et.map((g, j) => `<th class="${j > 0 && j % nn === 0 ? "s" : ""}">${g}</th>`).join("");
  const filas = K.map((f, i) =>
    `<tr class="${i > 0 && i % nn === 0 ? "s" : ""}"><th class="f">${et[i]}</th>` +
    f.map((v, j) => `<td class="${Math.abs(v) < 1e-9 ? "c" : ""}${j > 0 && j % nn === 0 ? " s" : ""}">${corto(v)}</td>`).join("") + "</tr>").join("");
  return `<table><tr><th></th>${cab}</tr>${filas}</table>`;
}

/** La tarjeta de un PAÑO: sus dos matrices (placa y membrana), la formulación y las D en letras. */
function pintarPano(idx: number, x: number, y: number): void {
  const d = datosPano(W().__hekatanStates, idx);
  if (!d) return;
  if (!tarjeta) tarjeta = crear();
  const f = formulacionPano(d);
  const c = comprobarPano(d.k);
  const thin = d.tipoPlaca === 1;
  // El triángulo grueso (CS-DSG3) suelto tiene 4: su cortante se suaviza en todo el triángulo. En malla
  // no aparece (losa 16×16 a 1 % de OpenSees ASDShellT3), pero se dice, no se esconde.
  const t3 = d.p.length === 3 && d.tipoPlaca !== 1;
  const nulos = (v: number | null) => v === null ? "" : v === 3
    ? `<span class="ok">✓ 3 modos de energía nula</span>`
    : t3 && v === 4
      ? `<span class="u">4 modos de energía nula: el CS-DSG3 suelto tiene uno de más; en malla no aparece</span>`
      : `<span class="mal">✕ ${v} modos de energía nula (deberían ser 3)</span>`;
  tarjeta.innerHTML =
    `<h4>Matriz de rigidez local · paño ${d.idx + 1}</h4>` +
    `<div class="sub">nudos ${d.nudos.join(" · ")} · ${f.placa}</div>` +
    `<div class="sub">${f.membrana}</div>` +
    `<div class="datos">` +
    dato("E", num(d.E), "kN/m²") + dato("ν", num(d.nu), "") + dato("t", num(d.t), "m") + dato("G", num(d.G), "kN/m²") +
    dato("área", num(d.k.area), "m²") + `</div>` +
    `<div class="ley"><i>D</i><sub>b</sub> = <i>Et</i>³/(12(1−ν²))·[1 ν 0; ν 1 0; 0 0 (1−ν)/2]` +
    (thin ? "" : ` · <i>D</i><sub>s</sub> = ⁵⁄₆·<i>Gt</i>·[1 0; 0 1]`) +
    ` · <i>D</i><sub>m</sub> = <i>Et</i>/(1−ν²)·[1 ν 0; ν 1 0; 0 0 (1−ν)/2]<br>` +
    `<i>K</i> = ∫ <i>B</i>ᵀ<i>DB</i> d<i>A</i> ≈ Σ <i>B</i>ᵀ<i>DB</i>·det<i>J</i>·peso, en puntos de Gauss` +
    (d.modificadores ? `<br><span class="mal">modificadores ${d.modificadores.join("/")}: esta matriz es la SIN modificar</span>` : "") + `</div>` +
    (d.k.aviso ? `<div class="sub mal">${d.k.aviso}</div>` : "") +
    `<div class="tabs"><button data-v="numeros" class="${vista === "numeros" ? "on" : ""}">Con números</button>` +
    `<button data-v="letras" class="${vista === "letras" ? "on" : ""}">En letras</button></div>` +
    (vista === "letras"
      ? `<div class="ley">En cada casilla, su integrando: <i>K</i> = ∫ (casilla) d<i>A</i> · <i>a</i><sub>i</sub> = ∂<i>N</i><sub>i</sub>/∂<i>x</i>, <i>b</i><sub>i</sub> = ∂<i>N</i><sub>i</sub>/∂<i>y</i> · ` +
        `<i>c</i> = (1−ν)/2 · <i>D</i>₀ = <i>Et</i>³/(12(1−ν²))` + (thin ? "" : ` · <i>S</i> = ⁵⁄₆<i>Gt</i>`) + ` · <i>M</i> = <i>Et</i>/(1−ν²)<br>` +
        `<span class="u">Placa de Mindlin y membrana de libro; ${thin ? "la DKQ no tiene cortante y su flexión es Kirchhoff discreto" : "el MITC4 cambia el cortante y suma modos incompatibles"}: los números exactos, en «Con números».</span></div>` +
        `<div class="bloques">` +
        `<div><div class="bl">Placa (flexión${thin ? "" : " + cortante"}) · bloque nudo <i>i</i> – nudo <i>j</i></div>` +
        `<div class="mat"><b>K<sub>b,ij</sub></b><span>=</span>${bloqueGenerico((r, q) => formulaPlaca(r, 3 + q, !thin).html, GDL_FLEXION)}</div></div>` +
        `<div><div class="bl">Membrana · bloque nudo <i>i</i> – nudo <i>j</i></div>` +
        `<div class="mat"><b>K<sub>m,ij</sub></b><span>=</span>${bloqueGenerico((r, q) => formulaMembrana(r, 3 + q).html, GDL_MEMBRANA)}</div></div>` +
        `<div><div class="bl">Dónde va cada bloque en la ${3 * d.p.length} × ${3 * d.p.length}</div>${mapaBloques(d.p.length)}</div>` +
        `</div>`
      : (d.k.flexion ? `<div class="bl">Placa (flexión)</div><div class="mat"><b>K<sub>b</sub></b><span>=</span>${tablaPano(d.k.flexion, GDL_FLEXION, d.nudos)}</div>` : "") +
        (d.k.membrana ? `<div class="bl">Membrana (en su plano)</div><div class="mat"><b>K<sub>m</sub></b><span>=</span>${tablaPano(d.k.membrana, GDL_MEMBRANA, d.nudos)}</div>` : "")) +
    `<div class="pie"><span class="u">kN y m · ejes del elemento</span>` +
    `<span class="${c.simetrica ? "ok" : "mal"}">${c.simetrica ? "✓" : "✕"} simétrica</span>` +
    nulos(c.nulosFlexion) +
    `<span class="hojas"><button class="sim" id="hk-klocal-sim">📐 Formulación simbólica</button>` +
    `<button id="hk-klocal-num">🔢 Formulación numérica</button></span></div>`;
  tarjeta.style.display = "block";
  colocar(x, y);
  abierta = "shell:" + idx;
  const hojas = hojasPano(idx);
  (tarjeta.querySelector("#hk-klocal-sim") as HTMLButtonElement).onclick = () => mostrar(hojas?.sim);
  (tarjeta.querySelector("#hk-klocal-num") as HTMLButtonElement).onclick = () => mostrar(hojas?.num);
  tarjeta.querySelectorAll<HTMLButtonElement>(".tabs button").forEach((b) => {
    b.onclick = () => { vista = b.dataset.v as any; pintarPano(idx, x, y); };
  });
}

/**
 * El bloque 3 × 3 nudo i – nudo j, con subíndices i y j (el mismo para los 16 pares de nudos). Se arma con
 * la fórmula del par (1, 2) y se cambian ₁ → ᵢ y ₂ → ⱼ: así es LA MISMA fórmula que prueba el test.
 */
function bloqueGenerico(f: (r: number, c: number) => string, gdl: string[]): string {
  const ij = (h: string) => h.replace(/₁/g, "ᵢ").replace(/₂/g, "ⱼ");
  const cab = gdl.map((g) => `<th>${g}<sub>j</sub></th>`).join("");
  let filas = "";
  for (let r = 0; r < 3; r++) {
    filas += `<tr><th class="f">${gdl[r]}<sub>i</sub></th>`;
    for (let q = 0; q < 3; q++) {
      const h = ij(f(r, q));
      filas += `<td class="${h === "0" ? "c" : h.startsWith("−") ? "n" : ""}">${h}</td>`;
    }
    filas += "</tr>";
  }
  return `<table class="fx"><tr><th></th>${cab}</tr>${filas}</table>`;
}

/** Mapa de bloques: la matriz del paño son n × n bloques K_ij de 3 × 3. */
function mapaBloques(n: number): string {
  const SUB = "₀₁₂₃₄₅₆₇₈₉";
  let h = `<table class="mapa"><tr><th></th>${Array.from({ length: n }, (_, j) => `<th>nudo ${j + 1}</th>`).join("")}</tr>`;
  for (let i = 0; i < n; i++) {
    h += `<tr><th>nudo ${i + 1}</th>`;
    for (let j = 0; j < n; j++) h += `<td class="${i === j ? "d" : ""}"><i>K</i>${SUB[i + 1]}${SUB[j + 1]}</td>`;
    h += "</tr>";
  }
  return h + `</table><div class="u" style="margin-top:4px">cada casilla es un bloque 3 × 3 con i = fila, j = columna</div>`;
}

/** 3n × 3n con la FÓRMULA de cada casilla (HTML), con las mismas cabeceras que la de números. */
function tablaFormulas(f: (r: number, c: number) => string, gdl: string[], nudos: number[]): string {
  const nn = gdl.length, N = nn * nudos.length;
  const et = nudos.flatMap((_, k) => gdl.map((g) => `${g}<sub>${k + 1}</sub>`));
  const cab = et.map((g, j) => `<th class="${j > 0 && j % nn === 0 ? "s" : ""}">${g}</th>`).join("");
  let filas = "";
  for (let r = 0; r < N; r++) {
    filas += `<tr class="${r > 0 && r % nn === 0 ? "s" : ""}"><th class="f">${et[r]}</th>`;
    for (let q = 0; q < N; q++) {
      const h = f(r, q);
      filas += `<td class="${h === "0" ? "c" : h.startsWith("−") ? "n" : ""}${q > 0 && q % nn === 0 ? " s" : ""}">${h}</td>`;
    }
    filas += "</tr>";
  }
  return `<table class="fx"><tr><th></th>${cab}</tr>${filas}</table>`;
}

/** Las dos hojas de una barra (se generan al abrir la tarjeta). */
function hojasBarra(idx: number): { sim: [string, string]; num: [string, string] } | null {
  const st = W().__hekatanStates;
  const d = datosBarra(st, idx);
  const K = d ? kLocalBarra(st, idx) : null;
  if (!d || !K) return null;
  return {
    sim: [`K local · barra ${d.idx + 1} · simbólica`, hojaBarraSimbolica(d, K)],
    num: [`K local · barra ${d.idx + 1} · numérica`, hojaBarraNumerica(d, K, elementosDelModelo(st))],
  };
}
/** Las dos hojas de un paño (se generan al abrir la tarjeta). */
function hojasPano(idx: number): { sim: [string, string]; num: [string, string] } | null {
  const d = datosPano(W().__hekatanStates, idx);
  if (!d) return null;
  return {
    sim: [`K local · paño ${d.idx + 1} · simbólica`, hojaPanoSimbolica(d)],
    num: [`K local · paño ${d.idx + 1} · numérica`, hojaPanoNumerica(d)],
  };
}
function mostrar(h?: [string, string]): string {
  if (!h) return "No pude armar la hoja.";
  abrirHoja(h[0], "```hoja\n" + h[1] + "\n```", 1100);
  cerrar();
  return h[0] + ": hoja abierta.";
}

/** La deducción del paño, en el motor de Hekatan LISP. */
export function abrirHojaPano(idx: number, cual: "sim" | "num" = "num"): string {
  const h = hojasPano(idx);
  return h ? mostrar(h[cual]) : "No pude leer ese paño.";
}

/** La deducción entera, en el motor de Hekatan LISP. */
export function abrirHojaBarra(idx: number, cual: "sim" | "num" = "num"): string {
  const h = hojasBarra(idx);
  return h ? mostrar(h[cual]) : "No pude leer esa barra.";
}

/** Arranca la escucha. Se llama una vez desde el workspace. */
export function arrancarKLocalHover(): void {
  if (W().__hkKLocalHover) return;
  W().__hkKLocalHover = {
    activar: (v: boolean) => { activo = v; if (!v) cerrar(); },
    hoja: abrirHojaBarra,
    abierta: () => abierta,
    // para pruebas y para el agente: la tarjeta sin tener que poner el cursor
    ver: (idx: number, x = 300, y = 200) => pintar(idx, x, y),
    verPano: (idx: number, x = 300, y = 200) => pintarPano(idx, x, y),
    hojaPano: abrirHojaPano,
    hojasBarra, hojasPano,
    vista: (v: "numeros" | "letras") => { vista = v; },
    datos: (idx: number) => datosBarra(W().__hekatanStates, idx),
    matriz: (idx: number) => kLocalBarra(W().__hekatanStates, idx),
  };
  window.addEventListener("hk:hover", (ev: any) => {
    const h = ev.detail;
    clearTimeout(reloj);
    const permitida = h && ((h.type === "frame" && hoverPrefs.kBarras.val) || (h.type === "shell" && hoverPrefs.kAreas.val));
    if (!activo || !h || !permitida) { if (!dentro) cerrarLuego(300); return; }
    if (h.type + ":" + h.idx === abierta) { clearTimeout(cierre); return; }
    clearTimeout(cierre);
    reloj = window.setTimeout(() => (h.type === "frame" ? pintar : pintarPano)(h.idx, h.x, h.y), ESPERA);
  });
}
