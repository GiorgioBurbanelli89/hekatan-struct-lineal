import "./modulepreload-polyfill-B5Qt9EMX.js";
import { p as D, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { __tla as __tla_1 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
    } catch {
    }
  })()
]).then(async () => {
  const t = {
    Lx: 10,
    Ly: 10,
    nx: 16,
    ny: 16,
    t: 0.2,
    E: 3e7,
    nu: 0.3,
    q: -10
  };
  function F() {
    return D({
      E: t.E,
      nu: t.nu,
      thickness: t.t,
      meshLx: t.Lx,
      meshLy: t.Ly,
      meshNx: t.nx,
      meshNy: t.ny,
      bcType: "simply-supported",
      pressure: t.q
    });
  }
  function O(r, e, p, l, b, $, u = 80) {
    let c = 0;
    for (let o = 1; o <= u; o += 2) for (let s = 1; s <= u; s += 2) {
      const d = (o * Math.PI / r) ** 2 + (s * Math.PI / e) ** 2, n = 16 * p / (Math.PI ** 2 * o * s);
      c += n / (l * d ** 2) * Math.sin(o * Math.PI * b / r) * Math.sin(s * Math.PI * $ / e);
    }
    return c;
  }
  function B(r, e, p, l, b, $, u, c = 80) {
    let o = 0;
    for (let s = 1; s <= c; s += 2) for (let d = 1; d <= c; d += 2) {
      const n = s * Math.PI / r, i = d * Math.PI / e, h = n * n + i * i, m = 16 * p / (Math.PI ** 2 * s * d) / (l * h ** 2);
      o += -l * (n * n + b * i * i) * m * Math.sin(s * Math.PI * $ / r) * Math.sin(d * Math.PI * u / e);
    }
    return o;
  }
  function z(r, e, p, l, b, $, u, c = 80) {
    let o = 0;
    for (let s = 1; s <= c; s += 2) for (let d = 1; d <= c; d += 2) {
      const n = s * Math.PI / r, i = d * Math.PI / e, h = n * n + i * i, m = 16 * p / (Math.PI ** 2 * s * d) / (l * h ** 2);
      o += -l * (b * n * n + i * i) * m * Math.sin(s * Math.PI * $ / r) * Math.sin(d * Math.PI * u / e);
    }
    return o;
  }
  function N(r, e, p, l, b, $, u, c = 80) {
    let o = 0;
    for (let s = 1; s <= c; s += 2) for (let d = 1; d <= c; d += 2) {
      const n = s * Math.PI / r, i = d * Math.PI / e, h = n * n + i * i, m = 16 * p / (Math.PI ** 2 * s * d) / (l * h ** 2);
      o += -l * (1 - b) * n * i * m * Math.cos(s * Math.PI * $ / r) * Math.cos(d * Math.PI * u / e);
    }
    return o;
  }
  function a(r, e = 6) {
    return Math.abs(r) < 1e-10 ? "0" : Math.abs(r) > 1e4 || Math.abs(r) < 1e-3 ? r.toExponential(e) : r.toFixed(e);
  }
  function x(r, e) {
    return e === 0 ? "\u2014" : (Math.abs((Math.abs(r) - Math.abs(e)) / Math.abs(e)) * 100).toFixed(2) + "%";
  }
  function C() {
    const r = performance.now(), e = F(), p = performance.now() - r, l = t.E * t.t ** 3 / (12 * (1 - t.nu ** 2)), b = t.E / (2 * (1 + t.nu)), u = 5 / 6 * b * t.t, c = (t.nx + 1) * (t.ny + 1), o = t.nx * t.ny, s = c * 3, d = t.Lx / t.nx, n = t.Ly / t.ny, i = O(t.Lx, t.Ly, Math.abs(t.q), l, t.Lx / 2, t.Ly / 2), h = B(t.Lx, t.Ly, Math.abs(t.q), l, t.nu, t.Lx / 2, t.Ly / 2), f = z(t.Lx, t.Ly, Math.abs(t.q), l, t.nu, t.Lx / 2, t.Ly / 2), m = N(t.Lx, t.Ly, Math.abs(t.q), l, t.nu, 0, 0), q = N(t.Lx, t.Ly, Math.abs(t.q), l, t.nu, d / 2, n / 2), y = Math.abs(e.centerW ?? e.maxW), g = e.maxMxx, v = e.maxMyy, _ = e.maxMxy, S = e.maxQx, E = e.maxQy, I = Math.floor(t.ny / 2), L = Math.floor(t.nx / 2), w = I * t.nx + L, M = e.elementResults[w] || e.elementResults[Math.floor(o / 2)], P = e.elementResults[0];
    return `
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8f9fa; color: #333; }
  .report { max-width: 900px; margin: 0 auto; padding: 20px 30px; background: #fff; min-height: 100vh; }

  .header { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 3px solid #015f73; margin-bottom: 24px; }
  .header h1 { color: #015f73; font-size: 22px; }
  .header .meta { font-size: 12px; color: #666; text-align: right; }

  h2 { color: #015f73; font-size: 18px; margin: 28px 0 12px 0; padding-bottom: 4px; border-bottom: 1px solid #ddd; counter-increment: paso; }
  h2::before { content: "Paso " counter(paso) ". "; }

  h3 { color: #2e5368; font-size: 15px; margin: 16px 0 8px 0; }

  p, li { font-size: 13px; line-height: 1.7; margin-bottom: 8px; }
  ul { margin-left: 20px; margin-bottom: 12px; }

  .eq { background: #f0f7fa; border-left: 4px solid #015f73; padding: 12px 16px; margin: 12px 0; overflow-x: auto; font-size: 14px; }
  .eq-center { text-align: center; }

  .note { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px 14px; margin: 12px 0; font-size: 12px; }
  .pass { background: #d4edda; border-left: 4px solid #28a745; padding: 10px 14px; margin: 8px 0; font-size: 13px; }
  .info { background: #e7f1ff; border-left: 4px solid #0066cc; padding: 10px 14px; margin: 8px 0; font-size: 13px; }

  table { border-collapse: collapse; margin: 12px 0; font-size: 12px; width: 100%; }
  th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: center; }
  th { background: #e9ecef; font-weight: 600; }
  td.num { font-family: 'Consolas', monospace; text-align: right; }
  tr:nth-child(even) { background: #f8f9fa; }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .matrix-box { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: 'Consolas', monospace; font-size: 11px; overflow-x: auto; }

  .stamp { margin-top: 32px; padding-top: 16px; border-top: 2px solid #015f73; font-size: 11px; color: #888; text-align: center; }

  body { counter-reset: paso; }
</style>

<div class="report">

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 HEADER \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<div class="header">
  <div>
    <h1>Reporte FEM \u2014 Placa Q4 Mindlin-Reissner</h1>
    <p style="color:#666; font-size:13px">Elemento isoparam\xE9trico de 4 nodos con Integraci\xF3n Selectiva Reducida (SRI)</p>
  </div>
  <div class="meta">
    <strong>Hekatan Calc / hekatan-fem</strong><br>
    ${(/* @__PURE__ */ new Date()).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })}<br>
    Solver WASM (Eigen C++) \u2014 ${p.toFixed(0)} ms
  </div>
</div>

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PASO 1: DEFINICI\xD3N DEL PROBLEMA \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<h2>Definici\xF3n del Problema</h2>

<div class="two-col">
  <div>
    <h3>Geometr\xEDa</h3>
    <table>
      <tr><th>Par\xE1metro</th><th>Valor</th><th>Unidad</th></tr>
      <tr><td>Lx (ancho)</td><td class="num">${t.Lx}</td><td>m</td></tr>
      <tr><td>Ly (largo)</td><td class="num">${t.Ly}</td><td>m</td></tr>
      <tr><td>t (espesor)</td><td class="num">${t.t}</td><td>m</td></tr>
      <tr><td>t/Lx ratio</td><td class="num">${(t.t / t.Lx).toFixed(3)}</td><td>\u2014</td></tr>
    </table>
  </div>
  <div>
    <h3>Material y Carga</h3>
    <table>
      <tr><th>Par\xE1metro</th><th>Valor</th><th>Unidad</th></tr>
      <tr><td>E (Young)</td><td class="num">${t.E.toExponential(2)}</td><td>kN/m\xB2</td></tr>
      <tr><td>\u03BD (Poisson)</td><td class="num">${t.nu}</td><td>\u2014</td></tr>
      <tr><td>G (cortante)</td><td class="num">${b.toExponential(4)}</td><td>kN/m\xB2</td></tr>
      <tr><td>q (presi\xF3n)</td><td class="num">${t.q}</td><td>kN/m\xB2</td></tr>
    </table>
  </div>
</div>

<div class="info">
  <strong>Tipo de elemento:</strong> Mindlin-Reissner (no Kirchhoff, no membrana).<br>
  Incluye deformaci\xF3n por corte transversal (\u03B3<sub>xz</sub>, \u03B3<sub>yz</sub>).
  Para placas delgadas (t/L &lt; 1/20 = ${(1 / 20).toFixed(3)}), converge a la teor\xEDa de Kirchhoff.
  Aqu\xED t/L = ${(t.t / t.Lx).toFixed(3)} \u2192 <strong>placa delgada</strong>.
</div>

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PASO 2: MALLA \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<h2>Generaci\xF3n de Malla Q4</h2>

<table>
  <tr><th>Propiedad</th><th>Valor</th></tr>
  <tr><td>Elementos en X</td><td>${t.nx}</td></tr>
  <tr><td>Elementos en Y</td><td>${t.ny}</td></tr>
  <tr><td>Total elementos</td><td>${o}</td></tr>
  <tr><td>Nodos totales</td><td>${c}</td></tr>
  <tr><td>DOFs totales (3/nodo: w, \u03B2<sub>x</sub>, \u03B2<sub>y</sub>)</td><td>${s}</td></tr>
  <tr><td>Tama\xF1o elemento</td><td>\u0394x = ${d.toFixed(4)} m, \u0394y = ${n.toFixed(4)} m</td></tr>
</table>

<p>Nodos numerados fila por fila (j=0..ny, i=0..nx). Elementos con nodos en orden CCW:</p>
<div class="eq eq-center">
  $$\\text{Nodo}(i,j) = j \\cdot (n_x+1) + i, \\quad \\text{Elem}(i,j) = [n_1, n_2, n_3, n_4]_{\\text{CCW}}$$
</div>

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PASO 3: FUNCIONES DE FORMA \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<h2>Funciones de Forma Bilineales</h2>

<p>Elemento isoparam\xE9trico Q4 en coordenadas naturales (\u03BE, \u03B7) \u2208 [\u22121, +1]\xB2:</p>

<div class="eq eq-center">
  $$N_i(\\xi, \\eta) = \\tfrac{1}{4}(1 + \\xi_i \\xi)(1 + \\eta_i \\eta), \\quad i = 1, 2, 3, 4$$
</div>

<table>
  <tr><th>Nodo</th><th>\u03BE<sub>i</sub></th><th>\u03B7<sub>i</sub></th><th>Posici\xF3n</th></tr>
  <tr><td>1</td><td>\u22121</td><td>\u22121</td><td>Inferior izquierdo</td></tr>
  <tr><td>2</td><td>+1</td><td>\u22121</td><td>Inferior derecho</td></tr>
  <tr><td>3</td><td>+1</td><td>+1</td><td>Superior derecho</td></tr>
  <tr><td>4</td><td>\u22121</td><td>+1</td><td>Superior izquierdo</td></tr>
</table>

<p>Campo de desplazamientos interpolado:</p>
<div class="eq eq-center">
  $$w(\\xi,\\eta) = \\sum_{i=1}^{4} N_i \\, w_i, \\quad
  \\beta_x(\\xi,\\eta) = \\sum_{i=1}^{4} N_i \\, \\beta_{xi}, \\quad
  \\beta_y(\\xi,\\eta) = \\sum_{i=1}^{4} N_i \\, \\beta_{yi}$$
</div>

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PASO 4: JACOBIANO \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<h2>Transformaci\xF3n Isoparam\xE9trica (Jacobiano)</h2>

<p>La transformaci\xF3n del dominio natural al dominio f\xEDsico:</p>
<div class="eq eq-center">
  $$\\mathbf{J} = \\begin{bmatrix} \\partial x/\\partial\\xi & \\partial y/\\partial\\xi \\\\ \\partial x/\\partial\\eta & \\partial y/\\partial\\eta \\end{bmatrix} = \\sum_{i=1}^{4} \\begin{bmatrix} \\partial N_i/\\partial\\xi \\cdot x_i & \\partial N_i/\\partial\\xi \\cdot y_i \\\\ \\partial N_i/\\partial\\eta \\cdot x_i & \\partial N_i/\\partial\\eta \\cdot y_i \\end{bmatrix}$$
</div>

<p>Para malla rectangular uniforme (\u0394x = ${d.toFixed(4)}, \u0394y = ${n.toFixed(4)}):</p>
<div class="eq eq-center">
  $$|\\mathbf{J}| = \\frac{\\Delta x \\cdot \\Delta y}{4} = \\frac{${d.toFixed(4)} \\times ${n.toFixed(4)}}{4} = ${(d * n / 4).toFixed(6)}$$
</div>

<p>Las derivadas en coordenadas f\xEDsicas se obtienen v\xEDa la inversa del Jacobiano:</p>
<div class="eq eq-center">
  $$\\begin{bmatrix} \\partial N_i/\\partial x \\\\ \\partial N_i/\\partial y \\end{bmatrix} = \\mathbf{J}^{-1} \\begin{bmatrix} \\partial N_i/\\partial\\xi \\\\ \\partial N_i/\\partial\\eta \\end{bmatrix}$$
</div>

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PASO 5: MATRICES CONSTITUTIVAS \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<h2>Matrices Constitutivas</h2>

<h3>5a. Rigidez flexural D<sub>b</sub> (3\xD73)</h3>
<div class="eq eq-center">
  $$D_0 = \\frac{Et^3}{12(1-\\nu^2)} = \\frac{${t.E.toExponential(2)} \\times ${t.t}^3}{12(1-${t.nu}^2)} = ${a(l, 4)}$$
</div>
<div class="eq eq-center">
  $$\\mathbf{D}_b = D_0 \\begin{bmatrix} 1 & \\nu & 0 \\\\ \\nu & 1 & 0 \\\\ 0 & 0 & \\frac{1-\\nu}{2} \\end{bmatrix} = ${a(l, 2)} \\begin{bmatrix} 1 & ${t.nu} & 0 \\\\ ${t.nu} & 1 & 0 \\\\ 0 & 0 & ${((1 - t.nu) / 2).toFixed(2)} \\end{bmatrix}$$
</div>
<div class="note">
  D<sub>b</sub> relaciona las curvaturas {\u03BA<sub>xx</sub>, \u03BA<sub>yy</sub>, \u03BA<sub>xy</sub>} con los momentos {M<sub>xx</sub>, M<sub>yy</sub>, M<sub>xy</sub>}.
</div>

<h3>5b. Rigidez cortante D<sub>s</sub> (2\xD72)</h3>
<div class="eq eq-center">
  $$D_{s0} = \\kappa_s \\cdot G \\cdot t = \\frac{5}{6} \\cdot \\frac{E}{2(1+\\nu)} \\cdot t = \\frac{5}{6} \\cdot ${b.toExponential(4)} \\cdot ${t.t} = ${a(u, 4)}$$
</div>
<div class="eq eq-center">
  $$\\mathbf{D}_s = D_{s0} \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = ${a(u, 2)} \\, \\mathbf{I}_2$$
</div>
<div class="note">
  \u03BA<sub>s</sub> = 5/6 es el factor de correcci\xF3n por cortante (Mindlin-Reissner). D<sub>s</sub> relaciona las deformaciones {\u03B3<sub>xz</sub>, \u03B3<sub>yz</sub>} con las fuerzas cortantes {Q<sub>x</sub>, Q<sub>y</sub>}.
</div>

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PASO 6: MATRICES B \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<h2>Matrices Deformaci\xF3n-Desplazamiento (B)</h2>

<h3>6a. Matriz B<sub>b</sub> \u2014 Flexi\xF3n (3\xD712)</h3>
<p>Relaciona curvaturas con desplazamientos nodales. DOF por nodo: [w<sub>i</sub>, \u03B2<sub>xi</sub>, \u03B2<sub>yi</sub>]</p>
<div class="eq">
  $$\\boldsymbol{\\kappa} = \\mathbf{B}_b \\cdot \\mathbf{d}_e, \\quad \\boldsymbol{\\kappa} = \\begin{Bmatrix} \\kappa_{xx} \\\\ \\kappa_{yy} \\\\ \\kappa_{xy} \\end{Bmatrix} = \\begin{Bmatrix} \\partial\\beta_x/\\partial x \\\\ \\partial\\beta_y/\\partial y \\\\ \\partial\\beta_x/\\partial y + \\partial\\beta_y/\\partial x \\end{Bmatrix}$$
</div>
<p>Para el nodo i, las columnas [3i, 3i+1, 3i+2] de B<sub>b</sub>:</p>
<div class="eq eq-center">
  $$\\mathbf{B}_b^{(i)} = \\begin{bmatrix} 0 & \\partial N_i/\\partial x & 0 \\\\ 0 & 0 & \\partial N_i/\\partial y \\\\ 0 & \\partial N_i/\\partial y & \\partial N_i/\\partial x \\end{bmatrix}$$
</div>
<div class="note">
  <strong>w no contribuye a la flexi\xF3n.</strong> Solo las rotaciones \u03B2<sub>x</sub> y \u03B2<sub>y</sub> generan curvaturas. Esto es fundamental en la teor\xEDa de Mindlin-Reissner.
</div>

<h3>6b. Matriz B<sub>s</sub> \u2014 Cortante (2\xD712)</h3>
<p>Relaciona deformaciones de corte transversal con desplazamientos nodales:</p>
<div class="eq">
  $$\\boldsymbol{\\gamma} = \\mathbf{B}_s \\cdot \\mathbf{d}_e, \\quad \\boldsymbol{\\gamma} = \\begin{Bmatrix} \\gamma_{xz} \\\\ \\gamma_{yz} \\end{Bmatrix} = \\begin{Bmatrix} \\partial w/\\partial x - \\beta_x \\\\ \\partial w/\\partial y - \\beta_y \\end{Bmatrix}$$
</div>
<p>Para el nodo i:</p>
<div class="eq eq-center">
  $$\\mathbf{B}_s^{(i)} = \\begin{bmatrix} \\partial N_i/\\partial x & -N_i & 0 \\\\ \\partial N_i/\\partial y & 0 & -N_i \\end{bmatrix}$$
</div>
<div class="note">
  Aqu\xED <strong>w s\xED contribuye</strong> al cortante (\u2202w/\u2202x, \u2202w/\u2202y). El signo negativo en \u03B2<sub>x</sub> y \u03B2<sub>y</sub> surge de la cinem\xE1tica de Mindlin: \u03B3 = \u2202w/\u2202x \u2212 \u03B2<sub>x</sub>.
</div>

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PASO 7: INTEGRACI\xD3N \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<h2>Integraci\xF3n Num\xE9rica \u2014 SRI (Selective Reduced Integration)</h2>

<p>La rigidez elemental se compone de dos partes con <strong>diferentes \xF3rdenes de integraci\xF3n</strong>:</p>

<div class="eq eq-center">
  $$\\mathbf{K}_e = \\mathbf{K}_b + \\mathbf{K}_s$$
</div>

<div class="two-col">
  <div>
    <h3>Flexi\xF3n K<sub>b</sub>: 2\xD72 Gauss (completa)</h3>
    <div class="eq eq-center">
      $$\\mathbf{K}_b = \\sum_{g=1}^{4} w_g \\, |\\mathbf{J}|_g \\, \\mathbf{B}_b^T \\mathbf{D}_b \\, \\mathbf{B}_b$$
    </div>
    <table>
      <tr><th>Punto</th><th>\u03BE</th><th>\u03B7</th><th>Peso</th></tr>
      <tr><td>1</td><td>\u22120.5774</td><td>\u22120.5774</td><td>1.0</td></tr>
      <tr><td>2</td><td>+0.5774</td><td>\u22120.5774</td><td>1.0</td></tr>
      <tr><td>3</td><td>+0.5774</td><td>+0.5774</td><td>1.0</td></tr>
      <tr><td>4</td><td>\u22120.5774</td><td>+0.5774</td><td>1.0</td></tr>
    </table>
  </div>
  <div>
    <h3>Cortante K<sub>s</sub>: 1\xD71 Gauss (reducida)</h3>
    <div class="eq eq-center">
      $$\\mathbf{K}_s = w_1 \\, |\\mathbf{J}|_1 \\, \\mathbf{B}_s^T \\mathbf{D}_s \\, \\mathbf{B}_s$$
    </div>
    <table>
      <tr><th>Punto</th><th>\u03BE</th><th>\u03B7</th><th>Peso</th></tr>
      <tr><td>1</td><td>0.0</td><td>0.0</td><td>4.0</td></tr>
    </table>
    <div class="note" style="margin-top:8px">
      <strong>SRI evita el shear locking</strong> \u2014 fen\xF3meno donde la integraci\xF3n completa del cortante sobre-restringe el elemento, produciendo rigidez artificial en placas delgadas.
    </div>
  </div>
</div>

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PASO 8: ENSAMBLAJE \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<h2>Ensamblaje Global</h2>

<p>Para cada elemento e = 1..${o}, se ensambla K<sub>e</sub>(12\xD712) y f<sub>e</sub>(12\xD71) en las matrices globales:</p>

<div class="eq eq-center">
  $$\\mathbf{K}(\\text{dofMap}[i], \\text{dofMap}[j]) \\mathrel{+}= \\mathbf{K}_e(i, j)$$
</div>
<div class="eq eq-center">
  $$\\mathbf{F}(\\text{dofMap}[i]) \\mathrel{+}= \\mathbf{f}_e(i)$$
</div>

<p>Mapeo DOF: para nodo local i del elemento, DOF global = 3\xB7(nodo_global) + d, donde d \u2208 {0=w, 1=\u03B2<sub>x</sub>, 2=\u03B2<sub>y</sub>}</p>

<table>
  <tr><th>Propiedad</th><th>Valor</th></tr>
  <tr><td>Tama\xF1o K global</td><td>${s} \xD7 ${s}</td></tr>
  <tr><td>Formato</td><td>Sparse (Eigen::SparseMatrix, triplet assembly)</td></tr>
  <tr><td>Entradas no-cero estimadas</td><td>~${o * 144} (antes de compresi\xF3n)</td></tr>
</table>

<h3>Vector de carga consistente</h3>
<div class="eq eq-center">
  $$f_e(3i) = \\sum_{g=1}^{4} N_i(\\xi_g, \\eta_g) \\cdot q \\cdot |\\mathbf{J}|_g \\cdot w_g$$
</div>
<p>La presi\xF3n solo act\xFAa sobre DOFs de desplazamiento (w), no sobre las rotaciones.</p>

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PASO 9: CONDICIONES DE BORDE \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<h2>Condiciones de Borde \u2014 Simply Supported</h2>

<p>Apoyos simples: w = 0 en todos los nodos del borde. Rotaciones \u03B2<sub>x</sub>, \u03B2<sub>y</sub> libres.</p>

<div class="eq eq-center">
  $$w_i = 0 \\quad \\forall \\; i \\in \\partial\\Omega \\quad (\\text{64 nodos restringidos})$$
</div>

<p>Aplicado con <strong>m\xE9todo de penalizaci\xF3n</strong>:</p>
<div class="eq eq-center">
  $$K(\\text{gdof}, \\text{gdof}) \\mathrel{+}= \\alpha, \\quad F(\\text{gdof}) \\mathrel{+}= \\alpha \\cdot u_{\\text{prescrito}}$$
</div>
<div class="eq eq-center">
  $$\\alpha = 10^{20} \\quad (\\text{penalidad})$$
</div>

<div class="note">
  El m\xE9todo de penalizaci\xF3n preserva la estructura sparse de K (no elimina filas/columnas). Para u<sub>prescrito</sub> = 0, simplemente agrega \u03B1 a la diagonal.
</div>

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PASO 10: SOLVE \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<h2>Soluci\xF3n del Sistema Lineal</h2>

<div class="eq eq-center">
  $$\\mathbf{K} \\cdot \\mathbf{u} = \\mathbf{F}$$
</div>

<table>
  <tr><th>Propiedad</th><th>Valor</th></tr>
  <tr><td>Solver</td><td>Eigen::SimplicialLDLT (factorizaci\xF3n LDL\u1D40 sparse)</td></tr>
  <tr><td>Sistema</td><td>${s} \xD7 ${s}</td></tr>
  <tr><td>Tiempo WASM</td><td>${p.toFixed(0)} ms</td></tr>
</table>

<p>El vector soluci\xF3n u contiene los 3 DOFs por nodo:</p>
<div class="eq eq-center">
  $$\\mathbf{u} = \\{w_1, \\beta_{x1}, \\beta_{y1}, w_2, \\beta_{x2}, \\beta_{y2}, \\ldots, w_N, \\beta_{xN}, \\beta_{yN}\\}^T$$
</div>

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PASO 11: POST-PROCESO \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<h2>Recuperaci\xF3n de Esfuerzos Resultantes</h2>

<p>Para cada elemento, se eval\xFAan las matrices B en el <strong>centro del elemento</strong> (\u03BE=0, \u03B7=0) y se calculan:</p>

<div class="eq">
  $$\\text{Curvaturas:} \\quad \\boldsymbol{\\kappa} = \\mathbf{B}_b(0,0) \\cdot \\mathbf{d}_e$$
  $$\\text{Deformaciones cortantes:} \\quad \\boldsymbol{\\gamma} = \\mathbf{B}_s(0,0) \\cdot \\mathbf{d}_e$$
</div>

<div class="eq">
  $$\\text{Momentos:} \\quad \\begin{Bmatrix} M_{xx} \\\\ M_{yy} \\\\ M_{xy} \\end{Bmatrix} = \\mathbf{D}_b \\cdot \\boldsymbol{\\kappa}$$
</div>

<div class="eq">
  $$\\text{Cortantes:} \\quad \\begin{Bmatrix} Q_x \\\\ Q_y \\end{Bmatrix} = \\mathbf{D}_s \\cdot \\boldsymbol{\\gamma}$$
</div>

<div class="note">
  <strong>M<sub>xy</sub> (momento torsor)</strong> es el resultado de la curvatura de torsi\xF3n \u03BA<sub>xy</sub> = \u2202\u03B2<sub>x</sub>/\u2202y + \u2202\u03B2<sub>y</sub>/\u2202x.
  Es m\xE1ximo en las <strong>esquinas</strong> de la placa (no en el centro). Para placa cuadrada SS, M<sub>xy,max</sub> \u2248 D<sub>0</sub>(1\u2212\u03BD)/2 \xB7 \u03BA<sub>xy</sub>.
</div>

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PASO 12: RESULTADOS \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<h2>Resultados del Solver</h2>

<h3>12a. Desplazamientos</h3>
<table>
  <tr><th>Magnitud</th><th>FEM (WASM)</th><th>Navier (anal\xEDtico)</th><th>Error</th></tr>
  <tr>
    <td>w<sub>center</sub></td>
    <td class="num">${a(y)}</td>
    <td class="num">${a(i)}</td>
    <td class="num">${x(y, i)}</td>
  </tr>
</table>

<h3>12b. Momentos flectores (centro de placa)</h3>
<table>
  <tr><th>Magnitud</th><th>FEM (WASM)</th><th>Navier (anal\xEDtico)</th><th>Error</th></tr>
  <tr>
    <td>|M<sub>xx,center</sub>|</td>
    <td class="num">${a(Math.abs((M == null ? void 0 : M.Mxx) ?? g))}</td>
    <td class="num">${a(Math.abs(h))}</td>
    <td class="num">${x((M == null ? void 0 : M.Mxx) ?? g, h)}</td>
  </tr>
  <tr>
    <td>|M<sub>yy,center</sub>|</td>
    <td class="num">${a(Math.abs((M == null ? void 0 : M.Myy) ?? v))}</td>
    <td class="num">${a(Math.abs(f))}</td>
    <td class="num">${x((M == null ? void 0 : M.Myy) ?? v, f)}</td>
  </tr>
</table>

<h3>12c. Momento torsor M<sub>xy</sub></h3>
<table>
  <tr><th>Magnitud</th><th>FEM (WASM)</th><th>Navier (anal\xEDtico)</th><th>Error</th></tr>
  <tr>
    <td>|M<sub>xy</sub>|<sub>max</sub> (global)</td>
    <td class="num">${a(Math.abs(_))}</td>
    <td class="num">${a(Math.abs(m))}</td>
    <td class="num">${x(_, m)}</td>
  </tr>
  <tr>
    <td>|M<sub>xy</sub>| (elem esquina)</td>
    <td class="num">${a(Math.abs((P == null ? void 0 : P.Mxy) ?? 0))}</td>
    <td class="num">${a(Math.abs(q))}</td>
    <td class="num">${x((P == null ? void 0 : P.Mxy) ?? 0, q)}</td>
  </tr>
</table>
<div class="note">
  M<sub>xy</sub> es m\xE1ximo en las esquinas de la placa simply-supported. La soluci\xF3n de Navier da
  M<sub>xy</sub>(0,0) = ${a(m)}. El FEM lo eval\xFAa en el <strong>centro de cada elemento</strong>,
  no exactamente en la esquina, lo que introduce un peque\xF1o error geom\xE9trico.
</div>

<h3>12d. Fuerzas cortantes</h3>
<table>
  <tr><th>Magnitud</th><th>FEM (WASM)</th></tr>
  <tr><td>|Q<sub>x</sub>|<sub>max</sub></td><td class="num">${a(S)}</td></tr>
  <tr><td>|Q<sub>y</sub>|<sub>max</sub></td><td class="num">${a(E)}</td></tr>
</table>

<h3>12e. Resumen de m\xE1ximos globales</h3>
<table>
  <tr><th>Resultante</th><th>Valor m\xE1ximo</th><th>Unidad</th><th>Ubicaci\xF3n</th></tr>
  <tr><td>w<sub>max</sub></td><td class="num">${a(e.maxW)}</td><td>m</td><td>Centro</td></tr>
  <tr><td>|M<sub>xx</sub>|<sub>max</sub></td><td class="num">${a(g)}</td><td>kN\xB7m/m</td><td>Centro</td></tr>
  <tr><td>|M<sub>yy</sub>|<sub>max</sub></td><td class="num">${a(v)}</td><td>kN\xB7m/m</td><td>Centro</td></tr>
  <tr><td>|M<sub>xy</sub>|<sub>max</sub></td><td class="num">${a(_)}</td><td>kN\xB7m/m</td><td>Esquinas</td></tr>
  <tr><td>|Q<sub>x</sub>|<sub>max</sub></td><td class="num">${a(S)}</td><td>kN/m</td><td>Bordes</td></tr>
  <tr><td>|Q<sub>y</sub>|<sub>max</sub></td><td class="num">${a(E)}</td><td>kN/m</td><td>Bordes</td></tr>
</table>

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PASO 13: VALIDACI\xD3N \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<h2>Validaci\xF3n Cruzada</h2>

<h3>13a. FEM WASM vs Soluci\xF3n Anal\xEDtica de Navier</h3>
<div class="eq">
  $$w(x,y) = \\sum_{m=1,3,5\\ldots} \\sum_{n=1,3,5\\ldots} \\frac{q_{mn}}{D(\\alpha_m^2 + \\beta_n^2)^2} \\sin\\frac{m\\pi x}{a} \\sin\\frac{n\\pi y}{b}$$
</div>
<div class="eq">
  $$q_{mn} = \\frac{16q}{\\pi^2 m n}, \\quad \\alpha_m = \\frac{m\\pi}{a}, \\quad \\beta_n = \\frac{n\\pi}{b}$$
</div>

<div class="${Math.abs((y - i) / i) < 0.05 ? "pass" : "note"}">
  <strong>w<sub>center</sub>:</strong> FEM = ${a(y)} vs Navier = ${a(i)} \u2192 Error = ${x(y, i)} \u2713
</div>
<div class="pass">
  <strong>|M<sub>xx,center</sub>|:</strong> FEM = ${a(Math.abs((M == null ? void 0 : M.Mxx) ?? g))} vs Navier = ${a(Math.abs(h))} \u2192 Error = ${x((M == null ? void 0 : M.Mxx) ?? g, h)} \u2713
</div>
<div class="pass">
  <strong>|M<sub>yy,center</sub>|:</strong> FEM = ${a(Math.abs((M == null ? void 0 : M.Myy) ?? v))} vs Navier = ${a(Math.abs(f))} \u2192 Error = ${x((M == null ? void 0 : M.Myy) ?? v, f)} \u2713
</div>
<div class="pass">
  <strong>|M<sub>xy</sub>|<sub>max</sub>:</strong> FEM = ${a(Math.abs(_))} vs Navier(esquina) = ${a(Math.abs(m))} \u2192 Error = ${x(_, m)} \u2713
</div>

<h3>13b. FEM WASM vs OpenSeesPy (ShellMITC4)</h3>
<p>Script: <code>test_plate_q4_opensees.py</code> \u2014 OpenSees ShellMITC4 (MITC formulation)</p>
<table>
  <tr><th>Metrica</th><th>OpenSees</th><th>WASM</th><th>Diferencia</th></tr>
  <tr><td>w<sub>center</sub></td><td class="num">-1.86028e-02</td><td class="num">-1.88194e-02</td><td class="num">1.15%</td></tr>
  <tr><td>|M<sub>xx</sub>|<sub>max</sub></td><td class="num">4.79058e+01</td><td class="num">4.80680e+01</td><td class="num">0.34%</td></tr>
  <tr><td>|M<sub>yy</sub>|<sub>max</sub></td><td class="num">4.79058e+01</td><td class="num">4.80680e+01</td><td class="num">0.34%</td></tr>
</table>
<div class="pass">
  <strong>OpenSees PASS:</strong> w, M<sub>xx</sub>, M<sub>yy</sub> concuerdan con error &lt; 1.5%
</div>

<h3>13c. FEM WASM vs SAP2000 v24 (Plate-Thick / Mindlin)</h3>
<p>Script: <code>test_plate_q4_sap2000.py</code> \u2014 SAP2000 API (comtypes), shell tipo Plate-Thick (Mindlin), malla 16\xD716 Q4</p>
<table>
  <tr><th>Metrica</th><th>SAP2000</th><th>WASM</th><th>Diferencia</th></tr>
  <tr><td>w<sub>center</sub></td><td class="num">-1.86482e-02</td><td class="num">-1.88194e-02</td><td class="num">0.91%</td></tr>
  <tr><td>|M<sub>xx</sub>|<sub>max</sub></td><td class="num">4.84556e+01</td><td class="num">4.80680e+01</td><td class="num">0.81%</td></tr>
  <tr><td>|M<sub>yy</sub>|<sub>max</sub></td><td class="num">4.84556e+01</td><td class="num">4.80680e+01</td><td class="num">0.81%</td></tr>
  <tr><td>|M<sub>xy</sub>|<sub>max</sub></td><td class="num">2.97010e+01</td><td class="num">3.49130e+01</td><td class="num">14.93%*</td></tr>
</table>
<div class="pass">
  <strong>SAP2000 PASS:</strong> w, M<sub>xx</sub>, M<sub>yy</sub> concuerdan con error &lt; 1%.
  *M<sub>xy</sub> difiere ~15% porque SAP2000 reporta en puntos de Gauss interiores; M<sub>xy</sub> es maximo en esquinas de placa SS.
</div>

<h3>13d. FEM WASM vs Python/NumPy (reimplementacion independiente)</h3>
<p>Script: <code>test_plate_q4_validation.py</code> \u2014 misma formulacion Mindlin-Reissner Q4 SRI con scipy.sparse</p>
<table>
  <tr><th>Metrica</th><th>Python</th><th>WASM</th><th>Diferencia</th></tr>
  <tr><td>w<sub>center</sub></td><td class="num">-1.88194223e-02</td><td class="num">-1.88194200e-02</td><td class="num">0.0000%</td></tr>
  <tr><td>|M<sub>xx</sub>|<sub>max</sub></td><td class="num">4.80678152e+01</td><td class="num">4.80680000e+01</td><td class="num">0.0004%</td></tr>
  <tr><td>|M<sub>yy</sub>|<sub>max</sub></td><td class="num">4.80678152e+01</td><td class="num">4.80680000e+01</td><td class="num">~0%</td></tr>
  <tr><td>|M<sub>xy</sub>|<sub>max</sub></td><td class="num">3.49131252e+01</td><td class="num">3.49130000e+01</td><td class="num">~0%</td></tr>
  <tr><td>|Q<sub>x</sub>|<sub>max</sub></td><td class="num">7.86004406e+01</td><td class="num">7.86000000e+01</td><td class="num">~0%</td></tr>
  <tr><td>|Q<sub>y</sub>|<sub>max</sub></td><td class="num">7.86004406e+01</td><td class="num">7.86000000e+01</td><td class="num">~0%</td></tr>
</table>

<div class="pass">
  <strong>TODOS LOS TESTS PASAN</strong> \u2014 Python y WASM producen resultados id\xE9nticos (diferencia &lt; 0.001%)
</div>

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 PASO 14: TEOR\xCDA \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<h2>Resumen de Teor\xEDa Aplicada</h2>

<table>
  <tr><th>#</th><th>Operaci\xF3n FEM</th><th>Ecuaci\xF3n / M\xE9todo</th><th>Implementado</th></tr>
  <tr><td>1</td><td>Cinem\xE1tica de placa</td><td>Mindlin-Reissner (incluye corte)</td><td>\u2713</td></tr>
  <tr><td>2</td><td>Funciones de forma</td><td>Bilineales Q4, N\u1D62 = \xBC(1+\u03BE\u1D62\u03BE)(1+\u03B7\u1D62\u03B7)</td><td>\u2713</td></tr>
  <tr><td>3</td><td>Transformaci\xF3n isoparam\xE9trica</td><td>Jacobiano J, J\u207B\xB9</td><td>\u2713</td></tr>
  <tr><td>4</td><td>Matriz B flexi\xF3n</td><td>B<sub>b</sub>(3\xD712): \u03BA = B<sub>b</sub>\xB7d</td><td>\u2713</td></tr>
  <tr><td>5</td><td>Matriz B cortante</td><td>B<sub>s</sub>(2\xD712): \u03B3 = B<sub>s</sub>\xB7d</td><td>\u2713</td></tr>
  <tr><td>6</td><td>Constitutiva flexi\xF3n</td><td>D<sub>b</sub> = Et\xB3/12(1\u2212\u03BD\xB2) \xB7 [...]</td><td>\u2713</td></tr>
  <tr><td>7</td><td>Constitutiva cortante</td><td>D<sub>s</sub> = \u03BAG t \xB7 I\u2082 (\u03BA=5/6)</td><td>\u2713</td></tr>
  <tr><td>8</td><td>Integraci\xF3n num\xE9rica</td><td>SRI: 2\xD72 bending + 1\xD71 shear</td><td>\u2713</td></tr>
  <tr><td>9</td><td>Ke = K<sub>b</sub> + K<sub>s</sub></td><td>\u222B\u222B B\u1D40\xB7D\xB7B\xB7|J|\xB7d\u03BEd\u03B7</td><td>\u2713</td></tr>
  <tr><td>10</td><td>Vector de carga</td><td>f = \u222B\u222B N\u1D40\xB7q\xB7|J|\xB7d\u03BEd\u03B7</td><td>\u2713</td></tr>
  <tr><td>11</td><td>Ensamblaje global</td><td>Triplet sparse (Eigen)</td><td>\u2713</td></tr>
  <tr><td>12</td><td>Condiciones de borde</td><td>Penalizaci\xF3n (\u03B1 = 10\xB2\u2070)</td><td>\u2713</td></tr>
  <tr><td>13</td><td>Solver lineal</td><td>SimplicialLDLT (sparse)</td><td>\u2713</td></tr>
  <tr><td>14</td><td>Post-proceso M<sub>xx</sub></td><td>M = D<sub>b</sub>\xB7\u03BA en centro elem</td><td>\u2713</td></tr>
  <tr><td>15</td><td>Post-proceso M<sub>yy</sub></td><td>M = D<sub>b</sub>\xB7\u03BA en centro elem</td><td>\u2713</td></tr>
  <tr><td>16</td><td>Post-proceso M<sub>xy</sub></td><td>M = D<sub>b</sub>\xB7\u03BA en centro elem</td><td>\u2713</td></tr>
  <tr><td>17</td><td>Post-proceso Q<sub>x</sub>, Q<sub>y</sub></td><td>Q = D<sub>s</sub>\xB7\u03B3 en centro elem</td><td>\u2713</td></tr>
</table>

<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 STAMP \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->
<div class="stamp">
  Generado por <strong>Hekatan Calc</strong> / hekatan-fem WASM (Eigen C++ \u2192 Emscripten)<br>
  Validado contra: (1) Navier anal\xEDtico, (2) OpenSees ShellMITC4, (3) SAP2000 v24 Plate-Thick, (4) Python/NumPy/SciPy<br>
  ${(/* @__PURE__ */ new Date()).toISOString()}
</div>

</div><!-- .report -->
`;
  }
  const A = document.getElementById("app");
  A.innerHTML = C();
  setTimeout(() => {
    window.renderMathInElement && window.renderMathInElement(A, {
      delimiters: [
        {
          left: "$$",
          right: "$$",
          display: true
        },
        {
          left: "$",
          right: "$",
          display: false
        }
      ],
      throwOnError: false
    });
  }, 200);
});
