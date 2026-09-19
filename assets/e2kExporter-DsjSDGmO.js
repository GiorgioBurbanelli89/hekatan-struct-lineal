let it = typeof localStorage < "u" && localStorage.getItem("hk_lang") || "es";
function no() {
  return it;
}
function ao($) {
  it = $, typeof localStorage < "u" && localStorage.setItem("hk_lang", $);
}
const Zt = { Settings: ["Configuraci\xF3n", "Settings"], "Display scale": ["Escala visual", "Display scale"], Nodes: ["Nodos", "Nodes"], Elements: ["Elementos", "Elements"], Columnas: ["Columnas", "Columns"], Vigas: ["Vigas", "Beams"], "Nodes indexes": ["\xCDndices nodos", "Node indexes"], "Elements indexes": ["\xCDndices elem.", "Element indexes"], Grid: ["Grilla", "Grid"], "Mostrar grid": ["Mostrar grilla", "Show grid"], "Mostrar labels": ["Mostrar etiquetas", "Show labels"], Modelo: ["Modelo", "Model"], "FEM Studio": ["FEM Studio", "FEM Studio"], Cercha: ["Cercha", "Truss"], Portico: ["P\xF3rtico", "Portal Frame"], Torre: ["Torre", "Tower"], Galpon: ["Galp\xF3n", "Warehouse"], Edificio: ["Edificio", "Building"], "Edif. Muros": ["Edif. Muros", "Bldg. Walls"], "Edif. Acero": ["Edif. Acero", "Steel Bldg."], "Acero+Diag": ["Acero+Diag", "Steel+Brace"], "Edif. Mixto": ["Edif. Mixto", "Mixed Bldg."], Mezanine: ["Mezanine", "Mezzanine"], Barra: ["Barra", "Bar"], "Placa 3Q": ["Placa 3Q", "Plate 3Q"], "Placa Q4": ["Placa Q4", "Plate Q4"], "Losa Rect": ["Losa Rect", "Rect. Slab"], "Losa Plana": ["Losa Plana", "Flat Slab"], "Viga Alta": ["Viga Alta", "Deep Beam"], "Muro Cont.": ["Muro Cont.", "Ret. Wall"], Zapata: ["Zapata", "Footing"], "Placa Base": ["Placa Base", "Base Plate"], "Col+Placa 3D": ["Col+Placa 3D", "Col+Plate 3D"], Talud: ["Talud", "Slope"], Eiffel: ["Eiffel", "Eiffel"], Arco: ["Arco", "Arch"], Puente: ["Puente", "Bridge"], Twist: ["Twist", "Twist"], Burj: ["Burj", "Burj"], Opera: ["Opera", "Opera"], Diagrid: ["Diagrid", "Diagrid"], "Muro Q4": ["Muro Q4", "Wall Q4"], "Viga Q4": ["Viga Q4", "Beam Q4"], "Placa XZ": ["Placa XZ", "Plate XZ"], P\u00E9rgola: ["P\xE9rgola", "Pergola"], Select: ["Seleccionar", "Select"], Draw: ["Dibujar", "Draw"], Inspect: ["Inspeccionar", "Inspect"], New: ["Nuevo", "New"], Export: ["Exportar", "Export"], "3D": ["3D", "3D"], Plan: ["Planta", "Plan"], EX: ["EX", "EX"], EY: ["EY", "EY"], Modal: ["Modal", "Modal"], Nonlinear: ["No-lineal", "Nonlinear"], Pushover: ["Pushover", "Pushover"], "Report Explained": ["Reporte FEM", "FEM Report"], C\u00E1lculo: ["C\xE1lculo", "Calc"], Log: ["Log", "Log"], CLI: ["CLI", "CLI"], "I/O": ["I/O", "I/O"], Tests: ["Tests", "Tests"], Clear: ["Limpiar", "Clear"], Tutorials: ["Tutoriales", "Tutorials"], "Tutoriales FEM": ["Tutoriales FEM: teor\xEDa + pr\xE1ctica interactiva", "FEM Tutorials: interactive theory + practice"], MKS: ["MKS", "MKS"], SI: ["SI", "SI"], US: ["US", "US"], "Pantalla completa": ["Pantalla completa", "Fullscreen"], "Ayuda interactiva": ["Ayuda interactiva \u2014 Tour guiado", "Interactive help \u2014 Guided tour"], "Nuevo modelo vac\xEDo": ["Nuevo modelo vac\xEDo", "New empty model"], "Exportar coordenadas": ["Exportar coordenadas y datos del modelo", "Export model coordinates and data"], "An\xE1lisis modal": ["An\xE1lisis modal (frecuencias y modos)", "Modal analysis (frequencies and modes)"], "An\xE1lisis no-lineal": ["An\xE1lisis no-lineal din\xE1mico (BRB + sismo)", "Nonlinear dynamic analysis (BRB + earthquake)"], "Pushover c\xEDclico": ["Pushover c\xEDclico con hist\xE9resis", "Cyclic pushover with hysteresis"], "Report derivaci\xF3n": ["Report Explained: derivaci\xF3n FEM paso a paso", "Report Explained: step-by-step FEM derivation"], "Calculadora FEM": ["Calculadora FEM: editor MATLAB + output KaTeX", "FEM Calculator: MATLAB editor + KaTeX output"], "Ver log": ["Ver log del solver", "View solver log"], "CLI toggle": ["Abrir/cerrar consola CLI", "Open/close CLI console"], "Asignar secci\xF3n": ["Asignar secci\xF3n", "Assign section"], "Info del elemento": ["Info del elemento", "Element info"], "Ocultar seleccionados": ["Ocultar seleccionados", "Hide selected"], Aislar: ["Aislar (mostrar solo seleccionados)", "Isolate (show selected only)"], "Mostrar todo": ["Mostrar todo", "Show all"], "Eliminar seleccionados": ["Eliminar seleccionados", "Delete selected"], "Limpiar selecci\xF3n": ["Limpiar selecci\xF3n", "Clear selection"], Luz: ["Luz", "Span"], Altura: ["Altura", "Height"], Divisiones: ["Divisiones", "Divisions"], Discretizaci\u00F3n: ["Discretizaci\xF3n", "Discretization"], Pisos: ["Pisos", "Stories"], "N. Vanos": ["N. Vanos", "N. Spans"], "Luz vano": ["Luz vano", "Span length"], "N. Pisos": ["N. Pisos", "N. Stories"], "h piso": ["h piso", "Story h"], "Vanos X": ["Vanos X", "Spans X"], "Vanos Y": ["Vanos Y", "Spans Y"], "Div. Vigas": ["Div. Vigas", "Beam Div."], "Div. Columnas": ["Div. Columnas", "Col. Div."], Largo: ["Largo", "Length"], "Altura col": ["Altura col", "Col. height"], "Flecha arco": ["Flecha arco", "Arch rise"], "Div. X": ["Div. X", "Div. X"], "Div. Y": ["Div. Y", "Div. Y"], "L total": ["L total", "Total L"], "Num elementos": ["Num elementos", "Num elements"], "Mesh size": ["Mesh", "Mesh size"], "Ancho Lx": ["Ancho Lx", "Width Lx"], "Largo Ly": ["Largo Ly", "Length Ly"], "H bajo": ["H bajo", "H low"], "H alto": ["H alto", "H high"], "Columnas/p\xF3rtico": ["Columnas/p\xF3rtico", "Columns/portal"], Correas: ["Correas", "Purlins"], "E acero": ["E acero", "E steel"], "E concreto": ["E concreto", "E concrete"], "t panel": ["t panel", "Panel t"], "q carga": ["q carga", "q load"], "Espesor t": ["Espesor t", "Thickness t"], "Mesh nx": ["Mesh nx", "Mesh nx"], "Mesh ny": ["Mesh ny", "Mesh ny"], "P lateral": ["P lateral", "Lateral P"], "Ancho W": ["Ancho W", "Width W"], "Alto H": ["Alto H", "Height H"], "Ancho carga": ["Ancho carga", "Load width"], "B base": ["B base", "Base B"], "t muro": ["t muro", "Wall t"], "t base": ["t base", "Base t"], "gamma suelo": ["\u03B3 suelo", "\u03B3 soil"], "q sobrecarga": ["q sobrecarga", "q surcharge"], "E suelo": ["E suelo", "E soil"], "v suelo": ["\u03BD suelo", "\u03BD soil"], "v concreto": ["\u03BD concreto", "\u03BD concrete"], "kn interfaz": ["kn interfaz", "kn interface"], "ks interfaz": ["ks interfaz", "ks interface"], "gamma agua": ["\u03B3 agua", "\u03B3 water"], "H agua": ["H agua", "Water H"], "Lx zapata": ["Lx zapata", "Footing Lx"], "Ly zapata": ["Ly zapata", "Footing Ly"], "t zapata": ["t zapata", "Footing t"], "a columna": ["a columna", "Col. width"], "h pedestal": ["h pedestal", "Pedestal h"], "P axial": ["P axial", "Axial P"], ks: ["ks", "ks"], "N pernos": ["N pernos", "N bolts"], "d perno": ["d perno", "Bolt d"], "Sep. pernos X": ["Sep. pernos X", "Bolt spacing X"], "Sep. pernos Y": ["Sep. pernos Y", "Bolt spacing Y"], "Col a": ["Col a", "Col a"], "Col b": ["Col b", "Col b"], "Col h": ["Col h", "Col h"], "Col t": ["Col t", "Col t"], "Col altura": ["Col altura", "Col height"], "Placa Lx": ["Placa Lx", "Plate Lx"], "Placa Ly": ["Placa Ly", "Plate Ly"], "Placa t": ["Placa t", "Plate t"], "Col subdiv V": ["Col subdiv V", "Col subdiv V"], "Col subdiv H": ["Col subdiv H", "Col subdiv H"], "Placa subdiv": ["Placa subdiv", "Plate subdiv"], "Peralte h": ["Peralte h", "Depth h"], "Luz L": ["Luz L", "Span L"], "Col d": ["Col d", "Col d"], "Col bf": ["Col bf", "Col bf"], "Col tf": ["Col tf", "Col tf"], "Col tw": ["Col tw", "Col tw"], "Vig d": ["Vig d", "Beam d"], "Vig bf": ["Vig bf", "Beam bf"], "Vig tf": ["Vig tf", "Beam tf"], "Vig tw": ["Vig tw", "Beam tw"], "Corr b": ["Corr b", "Purlin b"], "Corr t": ["Corr t", "Purlin t"], "F axial": ["F axial", "Axial F"], "nx elem": ["nx elem", "nx elem"], "ny elem": ["ny elem", "ny elem"], "Mesh nz": ["Mesh nz", "Mesh nz"], "Sep pernos X": ["Sep pernos X", "Bolt spacing X"], "Sep pernos Y": ["Sep pernos Y", "Bolt spacing Y"], Angulo: ["\xC1ngulo", "Angle"], "b top": ["b top", "Top b"], "b base": ["b base", "Base b"], "Cohesion c": ["Cohesi\xF3n c", "Cohesion c"], "Friccion \u03C6": ["Fricci\xF3n \u03C6", "Friction \u03C6"], Sobrecarga: ["Sobrecarga", "Surcharge"], "P puntual": ["P puntual", "Point P"], CM: ["CM", "DL"], CV: ["CV", "LL"], "Ex sismo": ["Ex sismo", "Ex seismic"], "Ey sismo": ["Ey sismo", "Ey seismic"], "P borde": ["P borde", "Edge P"], Empotrado: ["Empotrado", "Fixed"], Articulado: ["Articulado", "Pinned"], "Roller Z": ["Roller Z", "Roller Z"], "Simply Supported": ["Simplemente apoyado", "Simply Supported"], "Winkler (k)": ["Winkler (k)", "Winkler (k)"], "Emp-Libre": ["Emp-Libre", "Fixed-Free"], "Emp-Emp": ["Emp-Emp", "Fixed-Fixed"], "Emp-Art": ["Emp-Art", "Fixed-Pinned"], "Rankine (Ka)": ["Rankine (Ka)", "Rankine (Ka)"], "Suelo continuo": ["Suelo continuo", "Continuous soil"], Interfaz: ["Interfaz", "Interface"], "Presion agua": ["Presi\xF3n agua", "Water pressure"], "Pin (w=0)": ["Pin (w=0)", "Pin (w=0)"], "Simplemente apoyado": ["Simplemente apoyado", "Simply Supported"], "Pernos empotrados": ["Pernos empotrados", "Fixed bolts"], Losas: ["Losas", "Slabs"], Zapatas: ["Zapatas", "Footings"], Diagonales: ["Diagonales", "Braces"], Muros: ["Muros", "Walls"], Aberturas: ["Aberturas", "Openings"], Refuerzo: ["Refuerzo", "Reinforcement"], Placas: ["Placas", "Plates"], Pernos: ["Pernos", "Bolts"], Otros: ["Otros", "Others"], Piso: ["Piso", "Floor"], "Vigas X": ["Vigas X", "Beams X"], "Vigas Y": ["Vigas Y", "Beams Y"], "Vigas Secundarias": ["Vigas Secundarias", "Secondary Beams"], "Losas de Piso": ["Losas de Piso", "Floor Slabs"], "Muros de Corte": ["Muros de Corte", "Shear Walls"], Rangos: ["Rangos", "Ranges"], "Luces X": ["Luces X", "Spans X"], "Luces Y": ["Luces Y", "Spans Y"], "Alturas por Piso": ["Alturas por Piso", "Heights per Floor"], Parameters: ["Par\xE1metros", "Parameters"], Secciones: ["Secciones", "Sections"], "Col Material": ["Col Material", "Col Material"], Hormigon: ["Hormig\xF3n", "Concrete"], Acero: ["Acero", "Steel"], "Col forma": ["Col forma", "Col shape"], Rectangular: ["Rectangular", "Rectangular"], Circular: ["Circular", "Circular"], "Col tipo": ["Col tipo", "Col type"], Tubular: ["Tubular", "Tubular"], "Viga Material": ["Viga Material", "Beam Material"], "Viga tipo": ["Viga tipo", "Beam type"], Columna: ["Columna", "Column"], Activar: ["Activar", "Enable"], "Corren en": ["Corren en", "Run along"], "X (entre ejes Y)": ["X (entre ejes Y)", "X (between Y axes)"], "Y (entre ejes X)": ["Y (entre ejes X)", "Y (between X axes)"], "Cantidad/vano": ["Cantidad/vano", "Qty/span"], "Activar losas": ["Activar losas", "Enable slabs"], Espesor: ["Espesor", "Thickness"], Vano: ["Vano", "Span"], vanos: ["vanos", "spans"], ubicaciones: ["ubicaciones", "locations"], Teor\u00EDa: ["Teor\xEDa", "Theory"], Membrana: ["Membrana", "Membrane"], "Kirchhoff (delgada)": ["Kirchhoff (delgada)", "Kirchhoff (thin)"], "Mindlin (gruesa)": ["Mindlin (gruesa)", "Mindlin (thick)"], "Cargas Est\xE1ticas": ["Cargas Est\xE1ticas", "Static Loads"], Cargas: ["Cargas", "Loads"], Luces: ["Luces", "Spans"], Ejes: ["Ejes", "Axes"], Eje: ["Eje", "Axis"], Planta: ["Planta", "Plan"], "elevaci\xF3n mirando en": ["elevaci\xF3n mirando en", "elevation looking at"], Apoyo: ["Apoyo", "Support"], Apoyos: ["Apoyos", "Supports"], "Apoyos fijos": ["Apoyos fijos", "Fixed supports"], "Escala deformaci\xF3n": ["Escala deformaci\xF3n", "Deform scale"], "Apoyos DOFs": ["Apoyos DOFs", "Support DOFs"], "Apoyo Ux": ["Apoyo Ux", "Support Ux"], "Apoyo Uy": ["Apoyo Uy", "Support Uy"], "Apoyo Uz": ["Apoyo Uz", "Support Uz"], "Apoyo Rx": ["Apoyo Rx", "Support Rx"], "Apoyo Ry": ["Apoyo Ry", "Support Ry"], "Apoyo Rz": ["Apoyo Rz", "Support Rz"], nodos: ["nodos", "nodes"], Ensamblaje: ["Ensamblaje", "Assembly"], Tri\u00E1ngulos: ["Tri\xE1ngulos", "Triangles"], libres: ["libres", "free"], Elemento: ["Elemento", "Element"], Tipo: ["Tipo", "Type"], Viga: ["Viga", "Beam"], Secci\u00F3n: ["Secci\xF3n", "Section"], Eliminar: ["Eliminar", "Delete"], Nodo: ["Nodo", "Node"], fijos: ["fijos", "fixed"], de: ["de", "of"], "Cargas aplicadas": ["Cargas aplicadas", "Applied loads"], Perfil: ["Perfil", "Profile"], Param\u00E9trica: ["Param\xE9trica", "Parametric"], "Tubular Hueca": ["Tubular Hueca", "Hollow Tube"], "Tubo relleno concreto": ["Tubo relleno concreto", "Concrete-filled tube"], "Modelo Anal\xEDtico": ["Modelo Anal\xEDtico", "Analytical Model"] };
function Rt($) {
  const h = Zt[$];
  return h ? it === "es" ? h[0] : h[1] : $;
}
function io() {
  document.querySelectorAll("[data-i18n]").forEach(($) => {
    const h = $.dataset.i18n, D = Rt(h);
    $.tagName === "INPUT" || $.tagName === "SELECT" ? $.placeholder = D : $.textContent = D;
  }), document.querySelectorAll("[data-i18n-title]").forEach(($) => {
    const h = $.dataset.i18nTitle;
    $.title = Rt(h);
  });
}
function Bt($, h, D, R = {}) {
  const T = /* @__PURE__ */ new Map(), H = [];
  let z = 0;
  const re = (I, J, W) => {
    const U = T.get(I) ?? [0, 0, 0, 0, 0, 0];
    U[J] += W, T.set(I, U);
  }, c = 1 / Math.sqrt(3);
  for (const I of D ?? []) {
    if (I.node >= 0) {
      I.dof >= 0 && I.dof <= 5 && I.k > 0 && re(I.node, I.dof, I.k);
      continue;
    }
    const J = -I.node - 1, W = h[J];
    if (!W) continue;
    if (I.dof === -2 || I.dof === -4) {
      H.push([J, Math.round(I.k), I.dof === -4]);
      continue;
    }
    if (I.dof !== -1 && I.dof !== -3 || !(I.k > 0) || W.length !== 3 && W.length !== 4 || R.sinArea) continue;
    z++;
    const U = W.map((s) => $[s]), G = U[0], X = U[1], Z = U[2], ce = W.length === 4 ? U[3] : U[0], Q = [Z[0] - G[0], Z[1] - G[1], Z[2] - G[2]], oe = W.length === 4 ? [ce[0] - X[0], ce[1] - X[1], ce[2] - X[2]] : [X[0] - G[0], X[1] - G[1], X[2] - G[2]];
    let se = [Q[1] * oe[2] - Q[2] * oe[1], Q[2] * oe[0] - Q[0] * oe[2], Q[0] * oe[1] - Q[1] * oe[0]];
    const Se = Math.hypot(se[0], se[1], se[2]);
    se = Se > 1e-30 ? se.map((s) => s / Se) : [0, 0, 1];
    const $e = new Array(W.length).fill(0);
    if (W.length === 3) {
      const s = [(X[1] - G[1]) * (Z[2] - G[2]) - (X[2] - G[2]) * (Z[1] - G[1]), (X[2] - G[2]) * (Z[0] - G[0]) - (X[0] - G[0]) * (Z[2] - G[2]), (X[0] - G[0]) * (Z[1] - G[1]) - (X[1] - G[1]) * (Z[0] - G[0])];
      $e.fill(0.5 * Math.hypot(s[0], s[1], s[2]) / 3);
    } else for (const s of [-c, c]) for (const d of [-c, c]) {
      const F = [0.25 * (1 - s) * (1 - d), 0.25 * (1 + s) * (1 - d), 0.25 * (1 + s) * (1 + d), 0.25 * (1 - s) * (1 + d)], ie = [-0.25 * (1 - d), 0.25 * (1 - d), 0.25 * (1 + d), -0.25 * (1 + d)], ee = [-0.25 * (1 - s), -0.25 * (1 + s), 0.25 * (1 + s), 0.25 * (1 - s)], g = [0, 0, 0], K = [0, 0, 0];
      for (let n = 0; n < 4; n++) for (let E = 0; E < 3; E++) g[E] += ie[n] * U[n][E], K[E] += ee[n] * U[n][E];
      const l = [g[1] * K[2] - g[2] * K[1], g[2] * K[0] - g[0] * K[2], g[0] * K[1] - g[1] * K[0]], i = Math.hypot(l[0], l[1], l[2]);
      for (let n = 0; n < 4; n++) $e[n] += F[n] * i;
    }
    W.forEach((s, d) => {
      for (let F = 0; F < 3; F++) Math.abs(se[F]) > 1e-12 && re(s, F, I.k * $e[d] * se[F] * se[F]);
    });
  }
  return { nodales: T, colgados: H, deArea: z };
}
function ro($) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const { nodes: h, elements: D, nodeInputs: R, elementInputs: T } = $, H = { force: "KN", length: "m" };
  $.units && ($.units.force !== "KN" || $.units.length !== "m") && console.warn(`[s2k] el modelo va en kN\xB7m y el exportador NO convierte: se declara CurrUnits="KN, m, C" y se ignora "${$.units.force}, ${$.units.length}". Etiquetarlo de otra forma hace que SAP2000 lea las fuerzas escaladas.`);
  const z = $.title || "Hekatan Model", re = [], c = (l) => re.push(l), I = () => re.push(" ");
  c(`File ${z}.$2k was saved on m/d/yy at h:mm:ss`), I(), c('TABLE:  "ACTIVE DEGREES OF FREEDOM"'), c("   UX=Yes   UY=Yes   UZ=Yes   RX=Yes   RY=Yes   RZ=Yes"), I();
  const J = [], W = (l) => {
    var _a2, _b2, _c2, _d2, _e2;
    const i = ((_a2 = T.elasticities) == null ? void 0 : _a2.get(l)) || 0, n = (_b2 = T.poissonsRatios) == null ? void 0 : _b2.get(l), E = ((_c2 = T.shearModuli) == null ? void 0 : _c2.get(l)) || 0, M = n !== void 0 ? n : i > 0 && E > 0 ? Math.max(0, Math.min(0.5, i / (2 * E) - 1)) : 0.2, O = E > 0 ? E : i > 0 ? i / (2 * (1 + M)) : 0, x = (_d2 = T.sectionShapes) == null ? void 0 : _d2.get(l), P = (x == null ? void 0 : x.type) === "CFT" && x.steelRho > 0 ? x.steelRho : ((_e2 = T.densities) == null ? void 0 : _e2.get(l)) || 0, V = P > 0 ? `_r${+P.toPrecision(6)}` : "_r0";
    return { E: i, nu: M, G: O, rho: P, key: `MAT_${Math.round(i)}_n${M.toFixed(4)}${V}` };
  }, U = [], G = [];
  if (D.forEach((l, i) => {
    l.length === 2 ? J.push(i) : l.length === 8 ? G.push(i) : U.push(i);
  }), J.length > 0) {
    c('TABLE:  "CONNECTIVITY - FRAME"');
    for (const l of J) {
      const i = D[l];
      c(`   Frame=${l + 1}   JointI=${i[0] + 1}   JointJ=${i[1] + 1}   IsCurved=No`);
    }
    I();
  }
  if (U.length > 0) {
    c('TABLE:  "CONNECTIVITY - AREA"');
    for (const l of U) {
      const i = D[l], n = i.map((E, M) => `Joint${M + 1}=${E + 1}`).join("   ");
      c(`   Area=${l + 1}   NumJoints=${i.length}   ${n}`);
    }
    I();
  }
  if (G.length > 0) {
    c('TABLE:  "CONNECTIVITY - SOLID"');
    for (const l of G) {
      const i = D[l], n = [i[0], i[1], i[3], i[2], i[4], i[5], i[7], i[6]];
      c(`   Solid=${l + 1}   ${n.map((E, M) => `Joint${M + 1}=${E + 1}`).join("   ")}`);
    }
    I();
  }
  c('TABLE:  "COORDINATE SYSTEMS"'), c("   Name=GLOBAL   Type=Cartesian   X=0   Y=0   Z=0   AboutZ=0   AboutY=0   AboutX=0"), I(), c('TABLE:  "DATABASE FORMAT TYPES"'), c("   UnitsCurr=Yes   OverrideE=No"), I();
  const X = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map();
  for (const l of J) {
    const i = ((_a = T.areas) == null ? void 0 : _a.get(l)) || 0, n = ((_b = T.momentsOfInertiaZ) == null ? void 0 : _b.get(l)) || 0, E = ((_c = T.momentsOfInertiaY) == null ? void 0 : _c.get(l)) || 0, M = ((_d = T.torsionalConstants) == null ? void 0 : _d.get(l)) || 0, O = ((_e = T.elasticities) == null ? void 0 : _e.get(l)) || 0, x = W(l).key, P = ((_f = T.shearAreasZ) == null ? void 0 : _f.get(l)) ?? 0, V = ((_g = T.shearAreasY) == null ? void 0 : _g.get(l)) ?? 0, S = (_h = T.sectionShapes) == null ? void 0 : _h.get(l);
    let Y;
    const v = (S == null ? void 0 : S.type) === "CFT" && S.d > 0 && S.tw > 0 && S.tw < S.d / 2 && !(S.b > 0 && S.h > 0);
    if ($.cftAs !== "general" && (S == null ? void 0 : S.type) === "CFT" && O > 0 && (v || S.b > 0 && S.h > 0 && S.tw > 0 && S.tw < Math.min(S.b, S.h) / 2)) {
      const b = v ? S.d - 2 * S.tw : 0, ne = v ? 0 : S.b - 2 * S.tw, he = v ? 0 : S.h - 2 * (S.tf ?? S.tw), Ne = v ? Math.PI * (S.d * S.d - b * b) / 4 : S.b * S.h - ne * he, We = v ? Math.PI * b * b / 4 : ne * he, le = (S.fillE > 0 ? S.fillE / O : Math.max(0.01, Math.min(1, (i - Ne) / We))) * O, Ie = 0.2, Te = S.fillRho ?? 2.4, Ae = `FILL_${Math.round(le)}_r${Te}`;
      Z.has(Ae) || Z.set(Ae, { E: le, nu: Ie, G: le / (2 * (1 + Ie)), rho: Te }), Y = v ? { b: S.d, h: S.d, t: S.tw, Ec: le, nuC: Ie, matFill: Ae, D: S.d } : { b: S.b, h: S.h, t: S.tw, tf: S.tf ?? S.tw, Ec: le, nuC: Ie, matFill: Ae };
    }
    let k;
    !Y && (S == null ? void 0 : S.type) === "I" && S.h > 0 && S.b > 0 && S.tf > 0 && S.tw > 0 ? k = { kind: "I", t3: S.h, t2: S.b, tf: S.tf, tw: S.tw, t2b: S.t2b ?? S.b, tfb: S.tfb ?? S.tf } : !Y && (S == null ? void 0 : S.type) === "HSS" && S.h > 0 && S.b > 0 && S.tf > 0 && S.tw > 0 ? k = { kind: "Box", t3: S.h, t2: S.b, tf: S.tf, tw: S.tw } : !Y && (S == null ? void 0 : S.type) === "C" && S.h > 0 && S.b > 0 && S.tf > 0 && S.tw > 0 ? k = { kind: "C", t3: S.h, t2: S.b, tf: S.tf, tw: S.tw } : !Y && (S == null ? void 0 : S.type) === "2L" && S.h > 0 && S.b > 0 && S.tf > 0 && S.tw > 0 && (k = { kind: "2L", t3: S.h, t2: S.b, tf: S.tf, tw: S.tw, dis: S.dis ?? 0 });
    const te = `A${i.toPrecision(6)}_Iz${n.toPrecision(6)}_s${P.toPrecision(6)}_${V.toPrecision(6)}${Y ? Y.D ? `_SDC${Y.D}x${Y.t}` : `_SD${Y.b}x${Y.h}x${Y.t}` : ""}${k ? `_P${k.kind}${k.t3}x${k.t2}x${k.tf}x${k.tw}x${k.t2b ?? ""}x${k.tfb ?? ""}x${k.dis ?? ""}` : ""}`;
    if (!X.has(te)) {
      let b = 0.3, ne = 0.3;
      i > 0 && n > 0 && (b = Math.sqrt(12 * n / i), ne = i / b), X.set(te, { A: i, Iz: n, Iy: E, J: M, b: ne, h: b, matKey: x, As2: P > 0 ? P : i * 5 / 6, As3: V > 0 ? V : i * 5 / 6, sd: Y, param: k });
    }
    const j = [...X.keys()].indexOf(te) + 1;
    ce.set(l, `SEC${j}`);
  }
  if (J.length > 0) {
    c('TABLE:  "FRAME SECTION ASSIGNMENTS"');
    for (const l of J) {
      const i = ce.get(l) || "SEC1";
      c(`   Frame=${l + 1}   AutoSelect=N.A.   AnalSect=${i}   MatProp=Default`);
    }
    I();
  }
  if (X.size > 0) {
    c('TABLE:  "FRAME SECTION PROPERTIES 01 - GENERAL"');
    let l = 0;
    for (const [, i] of X) {
      if (l++, i.sd) {
        c(`   SectionName=SEC${l}   Material=${i.matKey}   Shape="SD Section"   Area=${p(i.A)}   TorsConst=${p(i.J)}   I33=${p(i.Iz)}   I22=${p(i.Iy)}   I23=0   AS2=${p(i.As2)}   AS3=${p(i.As3)} _`), c("        Color=Cyan   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
        continue;
      }
      if (i.param) {
        const n = i.param, E = n.kind === "I" ? `Shape="I/Wide Flange"   t3=${p(n.t3)}   t2=${p(n.t2)}   tf=${p(n.tf)}   tw=${p(n.tw)}   t2b=${p(n.t2b)}   tfb=${p(n.tfb)}` : n.kind === "C" ? `Shape=Channel   t3=${p(n.t3)}   t2=${p(n.t2)}   tf=${p(n.tf)}   tw=${p(n.tw)}` : n.kind === "2L" ? `Shape="Double Angle"   t3=${p(n.t3)}   t2=${p(n.t2)}   SngAngWid=${p((n.t2 - (n.dis ?? 0)) / 2)}   tf=${p(n.tf)}   tw=${p(n.tw)}   dis=${p(n.dis ?? 0)}` : `Shape=Box/Tube   t3=${p(n.t3)}   t2=${p(n.t2)}   tf=${p(n.tf)}   tw=${p(n.tw)}`;
        c(`   SectionName=SEC${l}   Material=${i.matKey}   ${E}   FilletRadius=0   Area=${p(i.A)}   TorsConst=${p(i.J)}   I33=${p(i.Iz)}   I22=${p(i.Iy)}   I23=0   AS2=${p(i.As2)}   AS3=${p(i.As3)} _`), c("        Color=Red   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
        continue;
      }
      c(`   SectionName=SEC${l}   Material=${i.matKey}   Shape=General   t3=${p(i.h)}   t2=${p(i.b)}   Area=${p(i.A)}   TorsConst=${p(i.J)}   I33=${p(i.Iz)}   I22=${p(i.Iy)}   I23=0   AS2=${p(i.As2)}   AS3=${p(i.As3)} _`), c("        Color=Blue   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
    }
    I();
  }
  const Q = [...X.values()].map((l, i) => ({ sec: l, name: `SEC${i + 1}` })).filter((l) => l.sec.sd);
  if (Q.length > 0) {
    c('TABLE:  "SECTION DESIGNER PROPERTIES 01 - GENERAL"');
    for (const { name: n } of Q) c(`   SectionName=${n}   DesignType="No Check/Design"   DsgnOrChck=Check   IncludeVStr=No   AxisAngle=90   MeshSzAbs=0   MeshSzRel=0.05`);
    I();
    const l = Q.filter((n) => !n.sec.sd.D), i = Q.filter((n) => n.sec.sd.D);
    if (l.length > 0) {
      c('TABLE:  "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE"');
      for (const { sec: n, name: E } of l) {
        const M = n.sd;
        c(`   SectionName=${E}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${n.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   Height=${p(M.h)}   Width=${p(M.b)}   FlngThick=${p(M.tf ?? M.t)}   WebThick=${p(M.t)}   Rotation=0 _`), c('        CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0   DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0');
      }
      I();
    }
    if (i.length > 0) {
      c('TABLE:  "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE"');
      for (const { sec: n, name: E } of i) {
        const M = n.sd;
        c(`   SectionName=${E}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${n.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   OuterDiam=${p(M.D)}   WallThick=${p(M.t)}   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), c("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      I();
    }
    if (l.length > 0) {
      c('TABLE:  "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE"');
      for (const { sec: n, name: E } of l) {
        const M = n.sd;
        c(`   SectionName=${E}   ShapeName=RELLENO   ShapeMat=${M.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Height=${p(M.h - 2 * (M.tf ?? M.t))}   Width=${p(M.b - 2 * M.t)}   Rotation=0   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), c("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      I();
    }
    if (i.length > 0) {
      c('TABLE:  "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE"');
      for (const { sec: n, name: E } of i) {
        const M = n.sd;
        c(`   SectionName=${E}   ShapeName=RELLENO   ShapeMat=${M.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Diameter=${p(M.D - 2 * M.t)}   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   DCoreMajorPositive=0`);
      }
      I();
    }
    c('TABLE:  "SECTION DESIGNER PROPERTIES 30 - FIBER GENERAL"');
    for (const { name: n } of Q) c(`   SectionName=${n}   NumFibersD2=3   NumFibersD3=3   CoordSys=Cartesian   GridAngle=0   LumpRebar=No   FiberPMM=No   FiberMC=No`);
    I();
  }
  {
    const l = J.filter((i) => {
      var _a2;
      const n = (_a2 = T.localAngles) == null ? void 0 : _a2.get(i);
      return n !== void 0 && isFinite(n) && Math.abs(n) > 1e-9;
    });
    if (l.length > 0) {
      c('TABLE:  "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL"');
      for (const i of l) c(`   Frame=${i + 1}   Angle=${p(T.localAngles.get(i))}   AdvanceAxes=No`);
      I();
    }
  }
  {
    const l = T.endOffsets, i = J.filter((n) => {
      const E = l == null ? void 0 : l.get(n);
      return !!E && (Math.abs(E[0]) > 1e-9 || Math.abs(E[1]) > 1e-9);
    });
    if (i.length > 0) {
      c('TABLE:  "FRAME OFFSET ALONG LENGTH ASSIGNMENTS"');
      for (const n of i) {
        const E = l.get(n);
        c(`   Frame=${n + 1}   Type=User   LengthI=${p(E[0])}   LengthJ=${p(E[1])}   RigidFactor=${p(E.length > 2 ? E[2] : 0)}`);
      }
      I();
    }
  }
  const oe = !!$.layeredSection && U.length > 0, se = $.layeredSection, Se = /* @__PURE__ */ new Map(), $e = /* @__PURE__ */ new Map(), s = T.shellModifiers, d = T.membraneModifiers, F = T.bendingModifiers, ie = (l) => !(s == null ? void 0 : s.has(l)) && Math.abs((F == null ? void 0 : F.get(l)) ?? 1) < 1e-9;
  if (!oe) for (const l of U) {
    const i = ((_i = T.thicknesses) == null ? void 0 : _i.get(l)) || 0.1;
    (_j = T.elasticities) == null ? void 0 : _j.get(l);
    const n = W(l).key, E = ie(l) ? 2 : ((_k = T.plateFormulations) == null ? void 0 : _k.get(l)) ?? 0, M = `t${i.toPrecision(6)}_f${E}`;
    Se.has(M) || Se.set(M, { t: i, matKey: n, formulacion: E });
    const O = [...Se.keys()].indexOf(M) + 1;
    $e.set(l, `SSEC${O}`);
  }
  if (U.length > 0) {
    c('TABLE:  "AREA SECTION ASSIGNMENTS"');
    for (const n of U) {
      const E = oe ? se.name : $e.get(n) || "SSEC1";
      c(`   Area=${n + 1}   Section=${E}   MatProp=Default`);
    }
    I();
    const l = (n) => {
      const E = s == null ? void 0 : s.get(n);
      if (E) return E;
      const M = (d == null ? void 0 : d.get(n)) ?? 1, O = ie(n) ? 1 : (F == null ? void 0 : F.get(n)) ?? 1;
      return [M, M, M, O, O, O, O, O];
    }, i = U.filter((n) => {
      const E = l(n);
      return E && E.some((M) => Math.abs(M - 1) > 1e-12);
    });
    if (i.length > 0) {
      c('TABLE:  "AREA STIFFNESS MODIFIERS"');
      for (const n of i) {
        const E = l(n);
        c(`   Area=${n + 1}   f11=${p(E[0])}   f22=${p(E[1])}   f12=${p(E[2])}   m11=${p(E[3])}   m22=${p(E[4])}   m12=${p(E[5])}   v13=${p(E[6])}   v23=${p(E[7])}   MassMod=1   WeightMod=1`);
      }
      I();
    }
    if (c('TABLE:  "AREA SECTION PROPERTIES"'), oe) {
      const n = se, E = ((_l = n.layers[0]) == null ? void 0 : _l.material) || "MAT_DEFAULT";
      c(`   Section=${n.name}   Material=${E}   MatAngle=0   AreaType=Shell   Type=Shell-Layered   Thickness=${p(n.totalThickness)}   BendThick=${p(n.totalThickness)}   Color=Magenta`);
    } else {
      let n = 0;
      for (const [, E] of Se) {
        n++;
        const M = E.formulacion === 2 ? "Membrane" : E.formulacion === 3 ? "Plate-Thin" : E.formulacion === 4 ? "Plate-Thick" : E.formulacion === 1 ? "Shell-Thin" : "Shell-Thick", O = E.formulacion === 3 || E.formulacion === 4 ? "No" : "Yes";
        c(`   Section=SSEC${n}   Material=${E.matKey}   MatAngle=0   AreaType=Shell   Type=${M}   DrillDOF=${O}   Thickness=${p(E.t)}   BendThick=${p(E.t)}   Color=Cyan`);
      }
    }
    if (I(), oe) {
      c('TABLE:  "AREA SECTION PROPERTY LAYERS"');
      const n = se;
      for (const E of n.layers) {
        const M = E.angle ?? 0, O = E.numIntPts ?? 3;
        c(`   Section=${n.name}   LayerName=${E.name}   Distance=${p(E.distance)}   Thickness=${p(E.thickness)}   Type=Shell   NumIntPts=${O}   Material=${E.material}   MatAngle=${p(M * 180 / Math.PI)}   MatBehave=Directional   S11Opt=Linear   S22Opt=Linear   S12Opt=Linear`);
      }
      I();
    }
  }
  c('TABLE:  "JOINT COORDINATES"');
  for (let l = 0; l < h.length; l++) {
    const i = h[l];
    c(`   Joint=${l + 1}   CoordSys=GLOBAL   CoordType=Cartesian   XorR=${p(i[0])}   Y=${p(i[1])}   Z=${p(i[2])}   SpecialJt=No`);
  }
  if (I(), R.supports && R.supports.size > 0) {
    c('TABLE:  "JOINT RESTRAINT ASSIGNMENTS"');
    for (const [l, i] of R.supports) {
      if (!i.some((E) => E)) continue;
      const n = (E) => E ? "Yes" : "No";
      c(`   Joint=${l + 1}   U1=${n(i[0])}   U2=${n(i[1])}   U3=${n(i[2])}   R1=${n(i[3])}   R2=${n(i[4])}   R3=${n(i[5])}`);
    }
    I();
  }
  {
    const l = $.patrones ? T.areaSpringsExport : void 0, i = Bt(h, D, R.springs, { sinArea: !!(l == null ? void 0 : l.size) }).nodales;
    if (l == null ? void 0 : l.size) {
      c('TABLE:  "AREA SPRING ASSIGNMENTS"');
      for (const [n, E] of l) c(`   Area=${n + 1}   Type=Simple   Stiffness=${p(E.ks)}   SimpleType=${E.comp ? '"Compression Only"' : '"Tension and Compression"'}   Face=Bottom   Dir1Type="Object Axes"   Dir=3`);
      I();
    }
    if (i.size > 0) {
      c('TABLE:  "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED"');
      for (const [n, E] of [...i].sort((M, O) => M[0] - O[0])) c(`   Joint=${n + 1}   CoordSys=Global   U1=${p(E[0])}   U2=${p(E[1])}   U3=${p(E[2])}   R1=${p(E[3])}   R2=${p(E[4])}   R3=${p(E[5])}`);
      I();
    }
  }
  const ee = R.diaphragms;
  if (ee && ee.size > 0) {
    const l = /* @__PURE__ */ new Map();
    for (const [n, E] of ee) {
      const M = Math.round(E);
      if (M === 0) continue;
      const O = Math.abs(M);
      l.has(O) || l.set(O, []), l.get(O).push(n);
    }
    const i = [...l].filter(([, n]) => n.length >= 2);
    if (i.length > 0) {
      c('TABLE:  "CONSTRAINT DEFINITIONS - DIAPHRAGM"');
      for (const [n] of i) c(`   Name=DIAPH${n}   CoordSys=GLOBAL   Axis=Z`);
      I(), c('TABLE:  "JOINT CONSTRAINT ASSIGNMENTS"');
      for (const [n, E] of i) for (const M of E) c(`   Joint=${M + 1}   Constraint=DIAPH${n}`);
      I();
    }
  }
  const g = R.cargasPorPatron;
  if ($.patrones && g) {
    const l = T.frameLoadsPorPatron ?? {}, i = [.../* @__PURE__ */ new Set([...Object.keys(g), ...Object.keys(l)])], n = (P) => /^dead$/i.test(P) ? "Dead" : /^(dne|sdead|scm|superdead)$/i.test(P) ? '"Super Dead"' : /^(live|viva|l)$/i.test(P) ? "Live" : "Other", E = T.selfWeight ?? 0;
    c('TABLE:  "LOAD PATTERN DEFINITIONS"');
    for (const P of i) c(`   LoadPat=${P}   DesignType=${n(P)}   SelfWtMult=${/^dead$/i.test(P) ? p(E) : 0}`);
    I(), c('TABLE:  "LOAD CASE DEFINITIONS"');
    for (const P of i) c(`   Case=${P}   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=${n(P)}   DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes`);
    I(), c('TABLE:  "CASE - STATIC 1 - LOAD ASSIGNMENTS"');
    for (const P of i) c(`   Case=${P}   LoadType="Load pattern"   LoadName=${P}   LoadSF=1`);
    I();
    const M = [];
    for (const P of i) for (const [V, S] of g[P] ?? /* @__PURE__ */ new Map()) S.some((Y) => Math.abs(Y) > 1e-12) && M.push(`   Joint=${V + 1}   LoadPat=${P}   CoordSys=GLOBAL   F1=${p(S[0])}   F2=${p(S[1])}   F3=${p(S[2])}   M1=${p(S[3])}   M2=${p(S[4])}   M3=${p(S[5])}`);
    M.length && (c('TABLE:  "JOINT LOADS - FORCE"'), M.forEach(c), I());
    const O = [];
    for (const P of i) for (const [V, S] of l[P] ?? /* @__PURE__ */ new Map()) {
      const Y = D[V];
      if (!Y || Y.length !== 2) continue;
      const v = h[Y[0]], k = h[Y[1]], te = Math.hypot(k[0] - v[0], k[1] - v[1], k[2] - v[2]);
      ["X", "Y", "Z"].forEach((j, b) => {
        Math.abs(S[b]) < 1e-12 || O.push(`   Frame=${V + 1}   LoadPat=${P}   CoordSys=GLOBAL   Type=Force   Dir=${j}   DistType=RelDist   RelDistA=0   RelDistB=1   AbsDistA=0   AbsDistB=${p(te)}   FOverLA=${p(S[b])}   FOverLB=${p(S[b])}`);
      });
    }
    O.length && (c('TABLE:  "FRAME LOADS - DISTRIBUTED"'), O.forEach(c), I());
    const x = T.combos ?? [];
    if (x.length) {
      c('TABLE:  "COMBINATION DEFINITIONS"');
      for (const P of x) P.items.forEach(([V, S], Y) => c(Y === 0 ? `   ComboName=${P.name}   ComboType="Linear Add"   AutoDesign=No   CaseType="Linear Static"   CaseName=${V}   ScaleFactor=${p(S)}   SteelDesign=None   ConcDesign=None   AlumDesign=None   ColdDesign=None` : `   ComboName=${P.name}   CaseType="Linear Static"   CaseName=${V}   ScaleFactor=${p(S)}`));
      I();
    }
  } else {
    const l = $.selfWtMult ?? 1;
    c('TABLE:  "LOAD PATTERN DEFINITIONS"'), c(`   LoadPat=DEAD   DesignType=Dead   SelfWtMult=${l}`), I(), c('TABLE:  "LOAD CASE DEFINITIONS"'), c('   Case=DEAD   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=Dead   DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes'), I(), c('TABLE:  "CASE - STATIC 1 - LOAD ASSIGNMENTS"'), c('   Case=DEAD   LoadType="Load pattern"   LoadName=DEAD   LoadSF=1'), I();
    const i = T.frameLoads, n = /* @__PURE__ */ new Map();
    if ((_m = R.loads) == null ? void 0 : _m.forEach((M, O) => n.set(O, [...M])), i && i.size > 0) {
      const M = (O, x) => {
        const P = n.get(O) ?? [0, 0, 0, 0, 0, 0];
        n.set(O, P.map((V, S) => V - x[S]));
      };
      for (const [O, x] of i) {
        const P = D[O];
        if (!P || P.length !== 2) continue;
        const V = h[P[0]], S = h[P[1]], Y = [S[0] - V[0], S[1] - V[1], S[2] - V[2]], v = Math.hypot(Y[0], Y[1], Y[2]);
        if (v < 1e-9) continue;
        const k = [Y[0] / v, Y[1] / v, Y[2] / v], te = v * v / 12, j = [k[1] * x[2] - k[2] * x[1], k[2] * x[0] - k[0] * x[2], k[0] * x[1] - k[1] * x[0]];
        M(P[0], [x[0] * v / 2, x[1] * v / 2, x[2] * v / 2, te * j[0], te * j[1], te * j[2]]), M(P[1], [x[0] * v / 2, x[1] * v / 2, x[2] * v / 2, -te * j[0], -te * j[1], -te * j[2]]);
      }
    }
    if (n.size > 0) {
      c('TABLE:  "JOINT LOADS - FORCE"');
      for (const [M, O] of n) O.some((x) => Math.abs(x) > 1e-12) && c(`   Joint=${M + 1}   LoadPat=DEAD   CoordSys=GLOBAL   F1=${p(O[0])}   F2=${p(O[1])}   F3=${p(O[2])}   M1=${p(O[3])}   M2=${p(O[4])}   M3=${p(O[5])}`);
      I();
    }
    const E = T.frameLoads;
    if (E && E.size > 0) {
      c('TABLE:  "FRAME LOADS - DISTRIBUTED"');
      for (const [M, O] of E) {
        const x = D[M];
        if (!x || x.length !== 2) continue;
        const P = h[x[0]], V = h[x[1]], S = Math.hypot(V[0] - P[0], V[1] - P[1], V[2] - P[2]);
        ["X", "Y", "Z"].forEach((Y, v) => {
          Math.abs(O[v]) < 1e-12 || c(`   Frame=${M + 1}   LoadPat=DEAD   CoordSys=GLOBAL   Type=Force   Dir=${Y}   DistType=RelDist   RelDistA=0   RelDistB=1   AbsDistA=0   AbsDistB=${p(S)}   FOverLA=${p(O[v])}   FOverLB=${p(O[v])}`);
        });
      }
      I();
    }
  }
  const K = /* @__PURE__ */ new Map();
  for (let l = 0; l < D.length; l++) {
    const { E: i, nu: n, G: E, rho: M, key: O } = W(l);
    K.has(O) || K.set(O, { E: i, nu: n, G: E, rho: M });
  }
  if (G.length > 0) {
    const l = T.solidIncompatible === false ? "No" : "Yes", i = /* @__PURE__ */ new Map();
    for (const n of G) {
      const { E, nu: M, G: O, rho: x, key: P } = W(n);
      K.has(P) || K.set(P, { E, nu: M, G: O, rho: x }), i.has(P) || i.set(P, `SOL${i.size + 1}`);
    }
    c('TABLE:  "SOLID PROPERTY DEFINITIONS"');
    for (const [n, E] of i) c(`   SolidProp=${E}   Material=${n}   MatAngleA=0   MatAngleB=0   MatAngleC=0   InComp=${l}   Color=Yellow`);
    I(), c('TABLE:  "SOLID PROPERTY ASSIGNMENTS"');
    for (const n of G) c(`   Solid=${n + 1}   SolidProp=${i.get(W(n).key)}`);
    I();
  }
  for (const [l, i] of Z) K.has(l) || K.set(l, i);
  c('TABLE:  "MATERIAL PROPERTIES 01 - GENERAL"');
  for (const [l] of K) c(`   Material=${l}   Type=Concrete   SymType=Isotropic   TempDepend=No   Color=Green`);
  I(), c('TABLE:  "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES"');
  for (const [l, i] of K) c(`   Material=${l}   UnitWeight=${p(i.rho * 9.80665)}   UnitMass=${p(i.rho)}   E1=${p(i.E)}   G12=${p(i.G)}   U12=${p(i.nu)}   A1=9.9E-06`);
  I(), c('TABLE:  "MATERIAL PROPERTIES 03B - CONCRETE DATA"');
  for (const [l] of K) c(`   Material=${l}   Fc=${p(T.fcExport ?? 27579)}   eFc=${p(T.fcExport ?? 27579)}   LtWtConc=No   SSCurveOpt=Mander   SSHysType=Takeda   SFc=0.00222   SCap=0.005   FinalSlope=-0.1   FAngle=0   DAngle=0   CoupModType="Modified Darwin-Pecknold"`);
  return I(), c('TABLE:  "PROGRAM CONTROL"'), c(`   ProgramName=SAP2000   Version=24.1.0   CurrUnits="${H.force}, ${H.length}, C"   SteelCode="AISC 360-16"   ConcCode="ACI 318-19"   AlumCode="AA 2015"   ColdCode=AISI-16   RegenHinge=Yes`), I(), c("END TABLE DATA"), c(""), re.join(`\r
`);
}
function p($) {
  return $ === 0 || Math.abs($) < 1e-15 ? "0" : Math.abs($) >= 1e6 || Math.abs($) < 1e-3 && Math.abs($) > 0 ? $.toExponential(8) : parseFloat($.toPrecision(10)).toString();
}
function qt($, h, D = 0.05) {
  const R = h.map(([T, H]) => `${(+T).toFixed(4)} ${(+H).toFixed(5)}`).join("  ");
  return [`  FUNCTION "${$}"  FUNCTYPE "SPECTRUM"  DAMPRATIO ${D}  SPECTYPE "USER"  `, `  FUNCTION "${$}"  TIMEVAL "${R}"  `];
}
function Qt($) {
  const { name: h, func: D, modalCase: R = "Modal", sfX: T = 9.81, sfY: H = 9.81 } = $, z = [`  LOADCASE "${h}"  TYPE  "Response Spectrum"  MODALCASE  "${R}"  `];
  return T && z.push(`  LOADCASE "${h}"  ACCEL  "U1"  FUNC  "${D}"  SF  ${T}  `), H && z.push(`  LOADCASE "${h}"  ACCEL  "U2"  FUNC  "${D}"  SF  ${H}  `), z;
}
function Ft($) {
  const { name: h = "Modal", ritz: D = false, nModes: R = 12 } = $;
  return D ? [`  LOADCASE "${h}"  TYPE  "Modal - Ritz"  INITCOND  "PRESET"  `, `  LOADCASE "${h}"  MAXMODES  ${R} MINMODES  1 `, `  LOADCASE "${h}"  LOADTYPE  "Accel"  LOADNAME  "UX"  RITZMAXCYCLES  0 `, `  LOADCASE "${h}"  LOADTYPE  "Accel"  LOADNAME  "UY"  RITZMAXCYCLES  0 `, `  LOADCASE "${h}"  LOADTYPE  "Accel"  LOADNAME  "UZ"  RITZMAXCYCLES  0 `] : [`  LOADCASE "${h}"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  `, `  LOADCASE "${h}"  MAXMODES  ${R} MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 `];
}
function co($) {
  var _a;
  const h = (_a = $.e2kModel) == null ? void 0 : _a.rawSections;
  let D = h && h.size > 0 ? to(h, $.e2kModel) : oo($);
  return $.seismicNEC && (D = eo(D, $.seismicNEC)), D;
}
function eo($, h) {
  const D = $.includes(`\r
`) ? `\r
` : `
`, R = $.split(/\r?\n/), T = h.name ?? "NEC", H = qt(T, h.points, h.dampRatio ?? 0.05), z = h.modalCase ?? "Modal", re = Qt({ name: h.caseName ?? "Sismo NEC", func: T, modalCase: z, sfX: h.sfX, sfY: h.sfY });
  let c = [];
  const I = (J) => R.some((W) => J.test(W));
  if (h.modal) {
    const J = new RegExp(`^\\s*LOADCASE\\s+"${z}"\\s+(TYPE\\s+"Modal|MAXMODES|MINMODES|EIGEN|LOADTYPE|RITZ)`, "i");
    for (let W = R.length - 1; W >= 0; W--) J.test(R[W]) && R.splice(W, 1);
    c = Ft({ name: z, ritz: !!h.modal.ritz, nModes: h.modal.nModes });
  } else I(new RegExp(`LOADCASE\\s+"${z}"\\s+TYPE\\s+"Modal`)) || (c = Ft({ name: z }));
  return yt(R, "FUNCTIONS", H), yt(R, "LOAD CASES", [...c, ...re]), R.join(D);
}
function yt($, h, D) {
  const R = $.findIndex((z) => z.trim() === `$ ${h}`);
  if (R >= 0) {
    $.splice(R + 1, 0, ...D);
    return;
  }
  const T = $.findIndex((z) => z.trim() === "END"), H = T >= 0 ? T : $.length;
  $.splice(H, 0, `$ ${h}`, ...D, "");
}
function to($, h) {
  const D = [], R = ["PROGRAM INFORMATION", "CONTROLS", "STORIES - IN SEQUENCE FROM TOP", "GRIDS", "DIAPHRAGM NAMES", "MATERIAL PROPERTIES", "REBAR DEFINITIONS", "FRAME SECTIONS", "AUTO SELECT SECTION LISTS", "CONCRETE SECTIONS", "WALL/SLAB/DECK SECTIONS", "POINT COORDINATES", "LINE CONNECTIVITIES", "AREA CONNECTIVITIES", "POINT ASSIGNS", "LINE ASSIGNS", "AREA ASSIGNS", "LOAD PATTERNS", "POINT OBJECT LOADS", "FRAME OBJECT LOADS", "SHELL OBJECT LOADS", "ANALYSIS OPTIONS", "MASS SOURCE", "FUNCTIONS", "LOAD CASES", "LOAD COMBINATIONS"];
  D.push("$ File exported from Hekatan Struct Lineal (round-trip)"), D.push("");
  for (const T of R) {
    const H = $.get(T);
    if (!(!H || H.length === 0)) {
      D.push(`$ ${T}`);
      for (const z of H) D.push(z);
      D.push("");
    }
  }
  for (const [T, H] of $) if (!R.includes(T) && H.length !== 0) {
    D.push(`$ ${T}`);
    for (const z of H) D.push(z);
    D.push("");
  }
  return D.push("  END"), D.push("$ END OF MODEL FILE"), D.join(`\r
`);
}
function oo($) {
  var _a, _b, _c, _d, _e2, _f, _g;
  const { nodes: h, elements: D, nodeInputs: R, elementInputs: T, title: H, units: z } = $, re = $.shellLoads ?? T.shellSurfaceLoads;
  let c;
  re instanceof Map && (c = /* @__PURE__ */ new Map(), re.forEach((e, t) => {
    c.set(t, typeof e == "number" ? { value: e } : e);
  }));
  const I = $.shellAngles ?? T.shellAngles, J = T.cargaDeArea, W = !!(c && c.size > 0), U = T.selfWeight, G = T.frameLoads, X = ($.weightMode ?? "auto") === "auto" && U !== void 0, Z = /* @__PURE__ */ new Map(), ce = (e, t) => {
    const o = Z.get(e) ?? [0, 0, 0, 0, 0, 0];
    Z.set(e, o.map((a, r) => a + t[r]));
  }, Q = /* @__PURE__ */ new Set();
  if (X) {
    if (G) for (const [e, t] of G) {
      const o = D[e];
      if (!o || o.length !== 2) continue;
      const a = h[o[0]], r = h[o[1]], f = [r[0] - a[0], r[1] - a[1], r[2] - a[2]], A = Math.hypot(f[0], f[1], f[2]);
      if (A < 1e-9) continue;
      const u = [f[0] / A, f[1] / A, f[2] / A], L = A * A / 12, y = [u[1] * t[2] - u[2] * t[1], u[2] * t[0] - u[0] * t[2], u[0] * t[1] - u[1] * t[0]];
      ce(o[0], [t[0] * A / 2, t[1] * A / 2, t[2] * A / 2, L * y[0], L * y[1], L * y[2]]), ce(o[1], [t[0] * A / 2, t[1] * A / 2, t[2] * A / 2, -L * y[0], -L * y[1], -L * y[2]]), Q.add(e);
    }
    if (U && U > 0) {
      const t = T.endOffsets;
      D.forEach((o, a) => {
        var _a2, _b2, _c2;
        const r = ((_a2 = T.densities) == null ? void 0 : _a2.get(a)) ?? 0;
        if (r) {
          if (o.length === 2) {
            const f = ((_b2 = T.areas) == null ? void 0 : _b2.get(a)) ?? 0, A = h[o[0]], u = h[o[1]], L = [u[0] - A[0], u[1] - A[1], u[2] - A[2]];
            let y = Math.hypot(L[0], L[1], L[2]);
            const m = t == null ? void 0 : t.get(a);
            if (m) {
              const C = Math.hypot(L[0], L[1]);
              C > 1e-9 && Math.abs(Math.atan2(Math.abs(L[2]), C)) * 180 / Math.PI < 20 && (y = Math.max(y - m[0] - m[1], 0));
            }
            const N = f * y * r * 9.80665 * U;
            ce(o[0], [0, 0, -N / 2, 0, 0, 0]), ce(o[1], [0, 0, -N / 2, 0, 0, 0]);
          } else if (o.length === 4) {
            const f = ((_c2 = T.thicknesses) == null ? void 0 : _c2.get(a)) ?? 0, A = o.map((C) => h[C]);
            let u = 0, L = 0, y = 0;
            for (let C = 0; C < 4; C++) {
              const w = A[C], B = A[(C + 1) % 4];
              u += w[1] * B[2] - w[2] * B[1], L += w[2] * B[0] - w[0] * B[2], y += w[0] * B[1] - w[1] * B[0];
            }
            const m = Math.hypot(u, L, y) / 2, N = f * m * r * 9.80665 * U;
            for (const C of o) ce(C, [0, 0, -N / 4, 0, 0, 0]);
          }
        }
      });
    }
  }
  const oe = (e, t) => {
    const o = Z.get(e);
    return [t[0] - ((o == null ? void 0 : o[0]) ?? 0), t[1] - ((o == null ? void 0 : o[1]) ?? 0), t[2] - (W ? (J == null ? void 0 : J.get(e)) ?? 0 : 0) - ((o == null ? void 0 : o[2]) ?? 0)];
  }, se = (e, t) => {
    const o = Z.get(e);
    return [(t[3] ?? 0) - ((o == null ? void 0 : o[3]) ?? 0), (t[4] ?? 0) - ((o == null ? void 0 : o[4]) ?? 0), (t[5] ?? 0) - ((o == null ? void 0 : o[5]) ?? 0)];
  }, Se = "N", $e = "MM", s = [], d = (e) => Math.round(e * 1e4) / 1e4, F = (e) => !isFinite(e) || e === 0 ? "0" : Number(e.toPrecision(10)).toString(), ie = 1e3, ee = 1e3, g = (e) => e * ee, K = (e) => e * ie, l = (e) => e * ie, i = (e) => e * ie * ee, n = (e) => e * ie / ee ** 2, E = (e) => e * ie / ee ** 3, M = /* @__PURE__ */ new Date(), O = `${M.getMonth() + 1}/${M.getDate()}/${M.getFullYear()}  ${M.getHours()}:${String(M.getMinutes()).padStart(2, "0")}:${String(M.getSeconds()).padStart(2, "0")}`;
  s.push(`$ File   "Hekatan_export.e2k"  saved ${O} in ETABS 22.6.0`), s.push(""), s.push("$ PROGRAM INFORMATION"), s.push('  PROGRAM  "ETABS"  VERSION "22.6.0"  '), s.push(""), s.push("$ CONTROLS"), s.push(`  UNITS  "${Se}"  "${$e}"  "C"  `), s.push('  TITLE1  "Hekatan Struct Lineal export"  '), H && s.push(`  TITLE2  "${H}"  `), s.push("  PREFERENCE  MERGETOL 0.001"), s.push('  RLLF  METHOD "ASCE7-10"  USEDEFAULTMIN "YES"  '), s.push("");
  const x = /* @__PURE__ */ new Set(), P = /* @__PURE__ */ new Set();
  h.forEach((e) => {
    x.add(d(e[0])), P.add(d(e[1]));
  });
  const V = [...x].sort((e, t) => e - t), S = [...P].sort((e, t) => e - t);
  s.push("$ GRIDS"), s.push('  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 '), V.forEach((e, t) => {
    const o = t < 26 ? String.fromCharCode(65 + t) : String.fromCharCode(65 + t % 26).repeat(Math.floor(t / 26) + 1);
    s.push(`  GRID "G1"  LABEL "${o}"  DIR "X"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), S.forEach((e, t) => {
    s.push(`  GRID "G1"  LABEL "${t + 1}"  DIR "Y"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), s.push("");
  const Y = 3, v = 0.5, k = /* @__PURE__ */ new Map();
  h.forEach((e) => {
    const t = d(e[2]);
    k.set(t, (k.get(t) ?? 0) + 1);
  });
  const te = /* @__PURE__ */ new Set();
  h.forEach((e) => te.add(d(e[2])));
  const j = [...te].sort((e, t) => e - t);
  let b = j.filter((e) => (k.get(e) ?? 0) >= Y);
  if (b.length > 1) {
    const e = [b[0]];
    for (const t of b.slice(1)) t - e[e.length - 1] < v ? e[e.length - 1] = t : e.push(t);
    b = e;
  }
  j.length || j.push(0, 3), b.length || (b = [j[0], j[j.length - 1]]), b[0] !== j[0] && b.unshift(j[0]), b[b.length - 1] !== j[j.length - 1] && b.push(j[j.length - 1]);
  const ne = [], he = /* @__PURE__ */ new Map();
  ne.push("Base"), he.set(b[0], "Base");
  for (let e = 1; e < b.length; e++) {
    const t = `Level_${e}`;
    ne.push(t), he.set(b[e], t);
  }
  const Ne = (e) => {
    const t = d(e);
    if (he.has(t)) return { story: he.get(t), dz: 0 };
    for (let a = 0; a < b.length; a++) if (b[a] >= t) return { story: he.get(b[a]), dz: d(b[a] - t) };
    const o = b[b.length - 1];
    return { story: he.get(o), dz: d(o - t) };
  };
  s.push("$ STORIES - IN SEQUENCE FROM TOP");
  for (let e = b.length - 1; e >= 1; e--) s.push(`  STORY "${ne[e]}"  HEIGHT ${d(g(b[e] - b[e - 1]))} MASTERSTORY "Yes"  `);
  b.length > 0 && s.push(`  STORY "Base"  ELEV ${d(g(b[0]))} `), s.push(""), D.some((e) => e.length === 4), s.push("$ DIAPHRAGM NAMES"), s.push('  DIAPHRAGM "D1"    TYPE RIGID'), s.push(""), s.push("$ MATERIAL PROPERTIES");
  const We = 980665e-8, rt = (e) => {
    var _a2, _b2, _c2;
    const t = (_a2 = T.sectionShapes) == null ? void 0 : _a2.get(e);
    if ((t == null ? void 0 : t.type) === "CFT" && t.steelRho > 0) return t.steelRho * 9.80665;
    const o = (_b2 = T.densities) == null ? void 0 : _b2.get(e);
    if (o === void 0) return;
    const a = o > 100 ? o * We : o * 9.80665, r = (_c2 = T.deckSections) == null ? void 0 : _c2.get(e);
    if (r && r.tc > 0) {
      const f = r.tc + (r.sr > 0 ? r.hr * (r.wrt + r.wrb) / 2 / r.sr : 0);
      return (a * r.tc - r.w) / f;
    }
    return a;
  }, le = (e) => {
    var _a2;
    const t = ((_a2 = T.elasticities) == null ? void 0 : _a2.get(e)) ?? 0, o = rt(e);
    return `${t}|${o === void 0 ? "-" : o.toFixed(4)}`;
  }, Ie = /* @__PURE__ */ new Set();
  (_a = T.elasticities) == null ? void 0 : _a.forEach((e, t) => Ie.add(le(t)));
  const Te = /* @__PURE__ */ new Map(), Ae = /* @__PURE__ */ new Map();
  let xt = 0, Yt = 0;
  for (const e of Ie) {
    const t = parseFloat(e.split("|")[0]), o = e.split("|")[1], a = t >= 1e8, r = a ? `Steel_${++xt}` : `Conc_${++Yt}`;
    Te.set(e, r), Ae.set(e, a);
    const f = o !== "-" ? parseFloat(o) : a ? 76.97 : 24, A = n(t), u = E(f), L = (() => {
      const N = $.elementInputs.poissonsRatios;
      if (N) {
        for (const [C, w] of N) if (le(C) === e) return w;
      }
    })(), y = L !== void 0 ? L : a ? 0.3 : 0.2, m = a ? 117e-7 : 1e-5;
    if (a) {
      s.push(`  MATERIAL  "${r}"    TYPE "Steel"    GRADE "Grade 50"    WEIGHTPERVOLUME ${F(u)}`), s.push(`  MATERIAL  "${r}"    SYMTYPE "Isotropic"  E ${d(A)}  U ${y}  A ${m}`);
      const N = 345e3, C = 45e4;
      s.push(`  MATERIAL  "${r}"  FY ${d(n(N))}  FU ${d(n(C))}  FYE ${d(n(N * 1.1))}  FUE ${d(n(C * 1.1))}`);
    } else s.push(`  MATERIAL  "${r}"    TYPE "Concrete"    WEIGHTPERVOLUME ${F(u)}`), s.push(`  MATERIAL  "${r}"    SYMTYPE "Isotropic"  E ${d(A)}  U ${y}  A ${m}`), s.push(`  MATERIAL  "${r}"    FC ${d(n(24e3))}`);
  }
  const ct = /* @__PURE__ */ new Map();
  {
    const e = /* @__PURE__ */ new Map();
    (_b = T.sectionShapes) == null ? void 0 : _b.forEach((o, a) => {
      var _a2;
      if ((o == null ? void 0 : o.type) !== "CFT" || !(o.fillE > 0) || !((((_a2 = T.elasticities) == null ? void 0 : _a2.get(a)) ?? 0) > 0)) return;
      const f = (o.fillRho ?? 2.4) * 9.80665, A = `${o.fillE}|${f.toFixed(4)}`;
      let u = e.get(A);
      u || (u = `ConcFill_${e.size + 1}`, e.set(A, u), s.push(`  MATERIAL  "${u}"    TYPE "Concrete"    WEIGHTPERVOLUME ${F(E(f))}`), s.push(`  MATERIAL  "${u}"    SYMTYPE "Isotropic"  E ${d(n(o.fillE))}  U 0.2  A 1.0e-5`), s.push(`  MATERIAL  "${u}"    FC ${d(n(24e3))}`)), ct.set(a, u);
    });
  }
  s.push(""), s.push("$ FRAME SECTIONS");
  const be = /* @__PURE__ */ new Set(), Ve = /* @__PURE__ */ new Map(), Be = /* @__PURE__ */ new Map(), me = 0.05;
  D.forEach((e, t) => {
    var _a2, _b2, _c2, _d2, _e3, _f2, _g2, _h, _i, _j;
    if (e.length !== 2) return;
    const o = (_a2 = T.sectionShapes) == null ? void 0 : _a2.get(t), a = ((_b2 = T.elasticities) == null ? void 0 : _b2.get(t)) ?? 0, r = Te.get(le(t)) || "Conc_1", f = Ae.get(le(t)) ?? a >= 1e8, A = ((_c2 = T.areas) == null ? void 0 : _c2.get(t)) ?? 0, u = ((_d2 = T.momentsOfInertiaZ) == null ? void 0 : _d2.get(t)) ?? 0, L = ((_e3 = T.momentsOfInertiaY) == null ? void 0 : _e3.get(t)) ?? 0, y = ((_f2 = T.torsionalConstants) == null ? void 0 : _f2.get(t)) ?? 0;
    let m = (o == null ? void 0 : o.type) || "rect", N = (o == null ? void 0 : o.h) ?? 0, C = (o == null ? void 0 : o.b) ?? 0, w = (o == null ? void 0 : o.d) ?? 0;
    const B = (o == null ? void 0 : o.tf) ?? 0, _ = (o == null ? void 0 : o.tw) ?? 0;
    if (!o && N <= 0 && C <= 0 && w <= 0 && A > 0 && u > 0 && L > 0) {
      const fe = (_g2 = T.cantos) == null ? void 0 : _g2.get(t), ye = (_h = T.anchos) == null ? void 0 : _h.get(t);
      N = fe && fe > 0 ? fe : Math.sqrt(12 * u / A), C = ye && ye > 0 ? ye : A / N, (!isFinite(N) || N < me) && (N = me), (!isFinite(C) || C < me) && (C = me), m = "general";
    } else N <= 0 && C <= 0 && w <= 0 && A > 0 && (u > 0 ? (N = Math.sqrt(12 * u / A), C = A / N) : N = C = Math.sqrt(A), (!isFinite(N) || N < me) && (N = me), (!isFinite(C) || C < me) && (C = me), m = "rect");
    N <= 0 && C <= 0 && w <= 0 && (N = 0.3, C = 0.3, m = "rect");
    const He = (o == null ? void 0 : o.name) ? `NAME_${o.name}` : `${m}_${d(N)}_${d(C)}_${d(w)}_${d(B)}_${d(_)}_${r}`;
    (o == null ? void 0 : o.name) && !Be.has(He) && Be.set(He, o.name);
    let q = Be.get(He);
    if (!q) {
      const fe = f ? "S" : "C";
      m === "general" ? q = `${fe}_G${be.size + 1}` : m === "rect" ? q = `${fe}_R${Math.round(C * 100)}x${Math.round(N * 100)}` : m === "circ" ? q = `${fe}_C_D${Math.round(w * 100)}` : m === "I" ? q = `${fe}_I${Math.round(N * 100)}x${Math.round(C * 100)}` : m === "HSS" ? q = `${fe}_HSS${Math.round(C * 100)}x${Math.round(N * 100)}x${Math.round(_ * 1e3)}` : q = `${fe}_Sec${be.size + 1}`, Be.set(He, q);
    }
    if (Ve.set(t, q), be.has(q)) return;
    be.add(q);
    const Ue = ct.get(t);
    if (m === "CFT" && Ue && w > 0 && _ > 0 && !(N > 0 && C > 0)) {
      s.push(`  FRAMESECTION  "${q}"  MATERIAL "${r}"  SHAPE "Filled Steel Pipe"  D ${d(g(w))} T ${d(g(_))} FILLMATERIAL "${Ue}"`);
      return;
    }
    if (m === "CFT" && Ue && N > 0 && C > 0 && _ > 0) {
      s.push(`  FRAMESECTION  "${q}"  MATERIAL "${r}"  SHAPE "Filled Steel Tube"  D ${d(g(N))} B ${d(g(C))} TF ${d(g(B > 0 ? B : _))} TW ${d(g(_))} FILLMATERIAL "${Ue}"`);
      return;
    }
    const ze = o, Kt = !((ze == null ? void 0 : ze.t2b) > 0) || Math.abs(ze.t2b - C) < 1e-9 && Math.abs((ze.tfb ?? B) - B) < 1e-9;
    if (m === "I" && N > 0 && C > 0 && B > 0 && _ > 0 && Kt) {
      s.push(`  FRAMESECTION  "${q}"  MATERIAL "${r}"  SHAPE "Steel I/Wide Flange"  D ${d(g(N))} B ${d(g(C))} TF ${d(g(B))} TW ${d(g(_))} `);
      return;
    }
    if (m === "HSS" && N > 0 && C > 0 && B > 0 && _ > 0) {
      s.push(`  FRAMESECTION  "${q}"  MATERIAL "${r}"  SHAPE "Steel Tube"  D ${d(g(N))} B ${d(g(C))} TF ${d(g(B))} TW ${d(g(_))} `);
      return;
    }
    if (m === "C" && N > 0 && C > 0 && B > 0 && _ > 0) {
      s.push(`  FRAMESECTION  "${q}"  MATERIAL "${r}"  SHAPE "Steel Channel"  D ${d(g(N))} B ${d(g(C))} TF ${d(g(B))} TW ${d(g(_))} `);
      return;
    }
    if (m === "2L" && N > 0 && C > 0 && B > 0 && _ > 0) {
      s.push(`  FRAMESECTION  "${q}"  MATERIAL "${r}"  SHAPE "Steel Double Angle"  D ${d(g(N))} B ${d(g(C))} TF ${d(g(B))} TW ${d(g(_))} DIS ${d(g((ze == null ? void 0 : ze.dis) ?? 0))} `);
      return;
    }
    const Jt = A > 0 && u > 0 && L > 0;
    let pe;
    m === "general" || Jt ? pe = "General" : m === "I" ? pe = "Steel I/Wide Flange" : m === "HSS" ? pe = "Steel Tube" : m === "CFT" ? pe = "Filled Steel Tube" : m === "pipe" ? pe = "Steel Pipe" : m === "L" ? pe = "Steel Angle" : m === "C" ? pe = "Steel Channel" : m === "2C" ? pe = "Steel Double Channel" : m === "circ" ? pe = "Concrete Circle" : pe = "Concrete Rectangular";
    let Me = `  FRAMESECTION  "${q}"  MATERIAL "${r}"  SHAPE "${pe}"`;
    if (pe === "General") {
      const fe = ((_i = T.shearAreasZ) == null ? void 0 : _i.get(t)) || A * 5 / 6, ye = ((_j = T.shearAreasY) == null ? void 0 : _j.get(t)) || A * 5 / 6;
      Me += `  D ${d(g(N))} B ${d(g(C))} AREA ${F(A * 1e6)} AS2 ${F(fe * 1e6)} AS3 ${F(ye * 1e6)} I33 ${F(u * 1e12)} I22 ${F(L * 1e12)} TORSION ${F((y || u + L) * 1e12)} S33POS ${F(2 * u / N * 1e9)} S33NEG ${F(2 * u / N * 1e9)} S22POS ${F(2 * L / C * 1e9)} S22NEG ${F(2 * L / C * 1e9)} Z33 ${F(2 * u / N * 1e9)} Z22 ${F(2 * L / C * 1e9)} R33 ${F(Math.sqrt(u / A) * 1e3)} R22 ${F(Math.sqrt(L / A) * 1e3)} `, s.push(Me);
      return;
    }
    N && (Me += `  D ${d(g(N))}`), C && (Me += `  B ${d(g(C))}`), w && !N && (Me += `  D ${d(g(w))}`), B && (Me += `  TF ${d(g(B))}`), _ && (Me += `  TW ${d(g(_))}`), s.push(Me);
  }), s.push("");
  const xe = /* @__PURE__ */ new Map();
  let wt = 0;
  h.forEach((e) => {
    const { dz: t } = Ne(e[2]), o = `${d(e[0])},${d(e[1])},${t}`;
    xe.has(o) || xe.set(o, `${++wt}`);
  });
  const Ye = /* @__PURE__ */ new Map(), _e = [];
  {
    const e = Bt(h, D, R.springs).nodales, t = /* @__PURE__ */ new Map();
    for (const [o, a] of e) {
      const r = a.map((u, L) => L < 3 ? u * ie / ee : u * ie * ee), f = r.map((u) => +u.toPrecision(12)).join("|");
      let A = t.get(f);
      if (!A) {
        A = `SPR${t.size + 1}`, t.set(f, A);
        const u = ["UX", "UY", "UZ", "RX", "RY", "RZ"], L = r.map((y, m) => `${u[m]}  ${+y.toPrecision(12)}`);
        _e.push(`  POINTSPRING  "${A}"  NONLINEARSPECOPTION  "LINKS"  ${L.join(" ")} `);
      }
      Ye.set(o, A);
    }
    _e.length && (s.push("$ POINT SPRING PROPERTIES"), _e.forEach((o) => s.push(o)), s.push(""));
  }
  s.push("$ POINT COORDINATES");
  for (const [e, t] of xe) {
    const [o, a, r] = e.split(",").map(Number);
    s.push(r ? `  POINT "${t}"  ${d(g(o))} ${d(g(a))} ${d(g(r))} ` : `  POINT "${t}"  ${d(g(o))} ${d(g(a))} `);
  }
  s.push("");
  const Ee = (e) => {
    const t = h[e], { story: o, dz: a } = Ne(t[2]), r = `${d(t[0])},${d(t[1])},${a}`;
    return { pt: xe.get(r) || "1", story: o };
  }, lt = (e) => {
    var _a2, _b2, _c2, _d2, _e3, _f2;
    const t = [], o = (_a2 = $.propertyModifiers) == null ? void 0 : _a2.get(e);
    o && o.some((m) => Math.abs(m - 1) > 1e-9) && t.push(`PROPMODIFIERS "${o.map((m) => d(m)).join(" ")}"`);
    const a = (_b2 = T.localAngles) == null ? void 0 : _b2.get(e);
    a !== void 0 && isFinite(a) && Math.abs(a) > 1e-9 && t.push(`ANG ${d(a)}`);
    const r = (_c2 = T.momentReleases) == null ? void 0 : _c2.get(e);
    if (r && r.some((m) => m)) {
      const m = [];
      r.length === 12 ? (r[0] && m.push("PI"), r[1] && m.push("V2I"), r[2] && m.push("V3I"), r[3] && m.push("TI"), r[4] && m.push("M2I"), r[5] && m.push("M3I"), r[6] && m.push("PJ"), r[7] && m.push("V2J"), r[8] && m.push("V3J"), r[9] && m.push("TJ"), r[10] && m.push("M2J"), r[11] && m.push("M3J")) : r.length === 6 && (r[0] && m.push("TI"), r[1] && m.push("M2I"), r[2] && m.push("M3I"), r[3] && m.push("TJ"), r[4] && m.push("M2J"), r[5] && m.push("M3J")), m.length > 0 && t.push(`RELEASE "${m.join(" ")}"`);
    }
    const f = (_d2 = T.insertionPoints) == null ? void 0 : _d2.get(e);
    f && (Math.abs(f[0]) > 1e-9 || Math.abs(f[1]) > 1e-9) && t.push(`LATEROFFSET ${d(g(f[0]))} TRANSOFFSET ${d(g(f[1]))}`);
    const A = (_e3 = T.rigidOffsets) == null ? void 0 : _e3.get(e), u = (_f2 = T.endOffsets) == null ? void 0 : _f2.get(e), L = u ? [u[0], u[1]] : A, y = u && u.length > 2 ? u[2] : 0;
    return L && (Math.abs(L[0]) > 1e-9 || Math.abs(L[1]) > 1e-9) && t.push(`LENGTHOFFI ${d(g(L[0]))} LENGTHOFFJ ${d(g(L[1]))} RIGIDZONE ${d(y)}`), t.length > 0 ? ` ${t.join(" ")} ` : "";
  }, Xe = [], Et = /* @__PURE__ */ new Set(), we = /* @__PURE__ */ new Map();
  D.forEach((e, t) => {
    if (e.length !== 2) return;
    const o = bt(h, e);
    if (o === "BEAM") return;
    const a = h[e[0]][2] <= h[e[1]][2] ? e[0] : e[1], r = h[e[0]][2] <= h[e[1]][2] ? e[1] : e[0];
    if (Math.abs(h[a][0] - h[r][0]) > 1e-6 || Math.abs(h[a][1] - h[r][1]) > 1e-6) return;
    const f = Ee(a), A = Ve.get(t) || `Sec_${t}`, u = `${f.pt}_${A}_${o}`;
    we.has(u) || we.set(u, []), we.get(u).push({ i: t, bot: a, top: r, zBot: d(h[a][2]), zTop: d(h[r][2]), planPt: f.pt, secName: A, type: o });
  }), we.forEach((e, t) => {
    e.sort((a, r) => a.zBot - r.zBot);
    let o = 0;
    for (let a = 1; a <= e.length; a++) if (a === e.length || Math.abs(e[a].zBot - e[a - 1].zTop) > 1e-6) {
      const f = e.slice(o, a);
      f.length >= 1 && (Xe.push({ elemIndices: f.map((A) => A.i), planPt: f[0].planPt, bottomNodeIdx: f[0].bot, topNodeIdx: f[f.length - 1].top, secName: f[0].secName, type: f[0].type, nSegments: f.length }), f.forEach((A) => Et.add(A.i))), o = a;
    }
  }), s.push("$ LINE CONNECTIVITIES");
  const je = [], ve = (e) => ne.indexOf(e), pt = /* @__PURE__ */ new Map(), ft = (e, t, o, a, r, f, A, u) => {
    const L = Ee(a), y = Ee(o);
    u !== void 0 && pt.set(u, { name: e, story: L.story });
    const m = ve(L.story) - ve(y.story);
    m <= 0 ? s.push(`  LINE  "${e}"  BEAM  "${y.pt}"  "${L.pt}"  0`) : s.push(`  LINE  "${e}"  ${t}  "${y.pt}"  "${L.pt}"  ${m}`);
    const N = T.meshAtIntersections === false;
    je.push(`  LINEASSIGN  "${e}"  "${L.story}"  SECTION "${r}" ${f} MINNUMSTA ${A} AUTOMESH "${N ? "NO" : "YES"}"  MESHATINTERSECTIONS "${N ? "NO" : "YES"}"  `);
  }, St = /* @__PURE__ */ new Map();
  Xe.forEach((e, t) => {
    const o = lt(e.elemIndices[0]), a = [];
    let r = [];
    e.elemIndices.forEach((f, A) => {
      r.push(f);
      const [u, L] = D[f], y = h[u][2] >= h[L][2] ? u : L;
      (Ne(h[y][2]).dz === 0 || A === e.elemIndices.length - 1) && (a.push(r), r = []);
    }), a.forEach((f) => {
      const [A, u] = D[f[0]], L = h[A][2] <= h[u][2] ? A : u, [y, m] = D[f[f.length - 1]], N = h[y][2] >= h[m][2] ? y : m;
      ve(Ee(N).story) - ve(Ee(L).story);
      let C = `C${t + 1}`;
      for (let w = 1; ; w++) {
        const B = s.length;
        ft(C, e.type, L, N, e.secName, o, f.length);
        const _ = s[B], at = St.get(C);
        if (at === void 0) {
          St.set(C, _);
          break;
        }
        if (s.splice(B, s.length - B), at === _) break;
        je.pop(), C = `C${t + 1}_${w}`;
      }
    });
  }), D.forEach((e, t) => {
    if (e.length !== 2 || Et.has(t)) return;
    const o = bt(h, e), a = Ve.get(t) || `Sec_${t}`, r = lt(t), f = h[e[0]][2] <= h[e[1]][2] ? e[0] : e[1], A = h[e[0]][2] <= h[e[1]][2] ? e[1] : e[0];
    ft(`E${t + 1}`, o === "BEAM" ? "BRACE" : o, f, A, a, r, 3, t);
  }), s.push("");
  const De = $.weightMode ?? "auto", de = /* @__PURE__ */ new Set();
  s.push("$ POINT ASSIGNS"), (_c = R.supports) == null ? void 0 : _c.forEach((e, t) => {
    const o = [];
    if (e[0] && o.push("UX"), e[1] && o.push("UY"), e[2] && o.push("UZ"), e[3] && o.push("RX"), e[4] && o.push("RY"), e[5] && o.push("RZ"), o.length > 0) {
      const a = Ee(t), r = a.story === "Base" ? ' DIAPH "DISCONNECTED" ' : "", f = Ye.has(t) ? ` SPRINGPROP "${Ye.get(t)}" ` : "";
      s.push(`  POINTASSIGN  "${a.pt}"  "${a.story}"  RESTRAINT "${o.join(" ")}" ${r}${f} `), de.add(`${a.pt}@${a.story}`);
    }
  });
  for (const [e, t] of Ye) {
    const o = Ee(e);
    de.has(`${o.pt}@${o.story}`) || (s.push(`  POINTASSIGN  "${o.pt}"  "${o.story}"  SPRINGPROP "${t}" `), de.add(`${o.pt}@${o.story}`));
  }
  const vt = !!(R.diaphragms && [...R.diaphragms.values()].some((e) => e !== 0)), ht = $.diaphragm ?? "auto", Ke = ht === "d1" || ht === "auto" && vt, Oe = /* @__PURE__ */ new Set();
  R.diaphragms && R.diaphragms.forEach((e, t) => {
    e !== 0 && Oe.add(t);
  }), Ke && Oe.size ? Oe.forEach((e) => {
    const t = Ee(e), o = `${t.pt}@${t.story}`;
    !de.has(o) && t.story !== "Base" && (s.push(`  POINTASSIGN  "${t.pt}"  "${t.story}"  DIAPH "D1"  `), de.add(o));
  }) : Ke && Xe.forEach((e) => {
    for (const t of e.elemIndices) {
      const [o, a] = D[t], r = h[o][2] >= h[a][2] ? o : a, f = Ee(r), A = `${f.pt}@${f.story}`;
      !de.has(A) && f.story !== "Base" && (s.push(`  POINTASSIGN  "${f.pt}"  "${f.story}"  DIAPH "D1"  `), de.add(A));
    }
  }), De === "manual" && R.loads && R.loads.forEach((e, t) => {
    const [o, a, r] = oe(t, e);
    if (Math.abs(o) < 1e-10 && Math.abs(a) < 1e-10 && Math.abs(r) < 1e-10) return;
    const f = Ee(t), A = `${f.pt}@${f.story}`;
    de.has(A) || (s.push(`  POINTASSIGN  "${f.pt}"  "${f.story}"  DIAPH "DISCONNECTED"  `), de.add(A));
  }), s.push(""), s.push("$ LINE ASSIGNS"), je.forEach((e) => s.push(e)), s.push("");
  const ae = [], At = T.areaObjects, dt = /* @__PURE__ */ new Set(), ut = /* @__PURE__ */ new Map(), $t = /* @__PURE__ */ new Map();
  At == null ? void 0 : At.forEach((e) => e.cells.forEach((t) => dt.add(t))), D.forEach((e, t) => {
    if (e.length === 4 || e.length === 3) {
      const o = h[e[0]], a = h[e[1]], r = h[e[2]], f = [a[0] - o[0], a[1] - o[1], a[2] - o[2]], A = [r[0] - o[0], r[1] - o[1], r[2] - o[2]], u = f[1] * A[2] - f[2] * A[1], L = f[2] * A[0] - f[0] * A[2], y = f[0] * A[1] - f[1] * A[0], m = Math.sqrt(u * u + L * L + y * y), N = m > 1e-10 && Math.abs(y) / m < 0.5;
      ae.push({ idx: t, el: e, isWall: N }), dt.has(t) && ae.pop();
    }
  });
  const ue = (() => {
    for (const [e, t] of Ae) if (!t) return Te.get(e);
    return Te.values().next().value || "Conc_1";
  })();
  At == null ? void 0 : At.forEach((e, t) => {
    ae.push({ idx: e.cells[0], el: e.nodes, isWall: false }), e.q !== void 0 && ut.set(e.cells[0], e.q), e.ang !== void 0 && $t.set(e.cells[0], e.ang);
  });
  const Ce = "DECK";
  let Je = false;
  const Ze = [], Tt = (e) => {
    const t = $.elementInputs.plateFormulations, o = ae.find((r) => r.isWall === e), a = t && o ? t.get(o.idx) : void 0;
    return a === 2 ? "Membrane" : a === 1 ? "ShellThin" : "ShellThick";
  }, mt = (e, t) => {
    const o = $.elementInputs.thicknesses, a = ae.find((r) => r.isWall === e);
    return (a ? o == null ? void 0 : o.get(a.idx) : void 0) ?? (o == null ? void 0 : o.values().next().value) ?? t;
  }, Mt = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"], Ge = (e) => {
    var _a2;
    const o = (_a2 = T.shellModifiers) == null ? void 0 : _a2.get(e);
    if (o && o.length >= 8) return o.slice(0, 8);
    const a = T.membraneModifiers, r = T.bendingModifiers, f = a == null ? void 0 : a.get(e), A = r == null ? void 0 : r.get(e);
    if (f === void 0 && A === void 0) return null;
    const u = f ?? 1, L = A ?? 1;
    return [u, u, u, L, L, L, L, L];
  }, It = (e, t) => {
    const o = ae.filter((A) => A.isWall === t), a = /* @__PURE__ */ new Map();
    for (const A of o) {
      const u = Ge(A.idx) ?? [1, 1, 1, 1, 1, 1, 1, 1];
      a.set(u.map((L) => d(L)).join(","), u);
    }
    if (a.size === 0) return "";
    a.size > 1 && console.warn(`[e2k] "${e}": ${a.size} juegos de modificadores distintos en la misma propiedad. ETABS los guarda POR PROPIEDAD, asi que se exporta el primero y los demas se pierden.`);
    const r = a.values().next().value, f = Mt.map((A, u) => Math.abs(r[u] - 1) > 1e-9 ? `${A} ${d(r[u])}` : "").filter(Boolean);
    return f.length ? `  SHELLPROP  "${e}"  ${f.join(" ")} ` : "";
  }, Lt = $.elementInputs.thicknesses, Ct = $.elementInputs.plateFormulations, Pe = (e) => {
    var _a2;
    const t = Lt == null ? void 0 : Lt.get(e.idx), o = Ct == null ? void 0 : Ct.get(e.idx), a = Ge(e.idx), r = (_a2 = $.elementInputs.deckSections) == null ? void 0 : _a2.get(e.idx), f = r ? [r.tc, r.hr, r.wrt, r.wrb, r.sr, r.w].map((A) => d(A)).join(",") : "-";
    return `${e.isWall ? "W" : "F"}|${t ?? "-"}|${o ?? "-"}|${a ? a.map((A) => d(A)).join(",") : "-"}|${le(e.idx)}|${f}`;
  }, qe = (e) => {
    var _a2;
    if ((_a2 = $.elementInputs.deckSections) == null ? void 0 : _a2.has(e)) return true;
    const t = Ge(e);
    return t ? Math.abs(t[3]) < 1e-9 && Math.abs(t[4]) < 1e-9 : false;
  }, Re = /* @__PURE__ */ new Map();
  let Gt = 0, kt = 0, Ht = 0;
  for (const e of ae) {
    const t = Pe(e);
    if (Re.has(t)) continue;
    const o = e.isWall, a = !o && qe(e.idx), r = o ? ++kt : a ? ++Ht : ++Gt, f = le(e.idx);
    Re.set(t, { nombre: (o ? "Muro" : a ? Ce : "Losa") + (r === 1 ? "" : String(r)), isWall: o, mem: a, t: Lt == null ? void 0 : Lt.get(e.idx), pf: Ct == null ? void 0 : Ct.get(e.idx), idx: e.idx, mat: Te.get(f) ?? ue, acero: Ae.get(f) ?? false });
  }
  const ke = (e) => {
    var _a2;
    return ((_a2 = Re.get(Pe(e))) == null ? void 0 : _a2.nombre) ?? (e.isWall ? "Muro" : "Losa");
  }, gt = (e) => e === 2 ? "Membrane" : e === 1 ? "ShellThin" : "ShellThick", Ut = (e, t) => {
    const o = ae.find((f) => Pe(f) === t), a = o ? Ge(o.idx) ?? null : null;
    if (!a) return "";
    const r = Mt.map((f, A) => Math.abs(a[A] - 1) > 1e-9 ? `${f} ${d(a[A])}` : "").filter(Boolean);
    return r.length ? `  SHELLPROP  "${e}"  ${r.join(" ")} ` : "";
  }, Fe = ae.find((e) => !e.isWall), Nt = ae.find((e) => e.isWall), Qe = /* @__PURE__ */ new Set();
  Fe && Qe.add(Pe(Fe)), Nt && Qe.add(Pe(Nt));
  const Dt = [...Re.entries()].filter(([e]) => !Qe.has(e)), et = (e) => {
    var _a2;
    return e === void 0 ? void 0 : (_a2 = $.elementInputs.deckSections) == null ? void 0 : _a2.get(e);
  }, zt = (e) => e * ie / ee ** 2, Ot = (e, t) => {
    const o = (a) => F(g(a));
    return `  SHELLPROP  "${e}"  PROPTYPE  "Deck"  DECKTYPE "Filled"  CONCMATERIAL "${ue}"  DECKMATERIAL "${ue}"  DECKSLABDEPTH ${o(t.tc)} DECKRIBDEPTH ${o(t.hr)} DECKRIBWIDTHTOP ${o(t.wrt)} DECKRIBWIDTHBOTTOM ${o(t.wrb)} DECKRIBSPACING ${o(t.sr)} DECKSHEARTHICKNESS ${o(76e-5)} DECKUNITWEIGHT ${F(zt(t.w))} SHEARSTUDDIAM ${o(0.019)} SHEARSTUDHEIGHT ${o(0.1)} SHEARSTUDFU 400 `;
  };
  if (ae.some((e) => !e.isWall)) {
    Je = !!Fe && qe(Fe.idx);
    const e = mt(false, 0.15);
    if (Je) {
      s.push("$ DECK PROPERTIES");
      const o = [...Re.values()].find((r) => r.nombre === Ce), a = et(Fe == null ? void 0 : Fe.idx);
      (o == null ? void 0 : o.acero) ? s.push(`  SHELLPROP  "${Ce}"  PROPTYPE  "Slab"  MATERIAL "${o.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${d(g(e))} `) : a ? s.push(Ot(Ce, a)) : s.push(`  SHELLPROP  "${Ce}"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${d(g(e))} `);
    } else s.push("$ SLAB PROPERTIES"), s.push(`  SHELLPROP  "Losa"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "${Tt(false)}"  SLABTYPE "Slab"  SLABTHICKNESS ${d(g(e))} `);
    const t = It(Je ? Ce : "Losa", false);
    t && s.push(t), s.push("");
  }
  if (ae.some((e) => e.isWall)) {
    s.push("$ WALL PROPERTIES");
    const e = mt(true, 0.2), t = Tt(true);
    s.push(`  SHELLPROP  "Muro"  PROPTYPE  "Wall"  MATERIAL "${ue}"  MODELINGTYPE "${t}"  WALLTHICKNESS ${d(g(e))} `);
    const o = It("Muro", true);
    o && s.push(o), s.push("");
  }
  if (Dt.length) {
    s.push("$ OTRAS SECCIONES DE CASCARA");
    for (const [e, t] of Dt) {
      const o = t.t ?? (t.isWall ? 0.2 : 0.15);
      s.push(t.isWall ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Wall"  MATERIAL "${t.mat ?? ue}"  MODELINGTYPE "${gt(t.pf)}"  WALLTHICKNESS ${d(g(o))} ` : t.mem && t.acero ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${t.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${d(g(o))} ` : t.mem && et(t.idx) ? Ot(t.nombre, et(t.idx)) : t.mem ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${d(g(o))} ` : `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "${gt(t.pf)}"  SLABTYPE "Slab"  SLABTHICKNESS ${d(g(o))} `);
      const a = Ut(t.nombre, e);
      a && s.push(a);
    }
    s.push("");
  }
  if (ae.length > 0) {
    s.push("$ AREA CONNECTIVITIES");
    const e = [];
    ae.forEach((t, o) => {
      const { el: a, isWall: r } = t, f = r ? `W${o + 1}` : `F${o + 1}`, A = r ? "PANEL" : "FLOOR", u = a.map((L) => Ee(L));
      if (r) {
        const L = (w) => ne.indexOf(w);
        if (new Set(u.map((w) => w.pt)).size === 4) {
          const w = Math.max(...u.map((_) => L(_.story))), B = u.map((_) => w - L(_.story));
          s.push(`  AREA "${f}"  ${A}  4  "${u[0].pt}"  "${u[1].pt}"  "${u[2].pt}"  "${u[3].pt}"  ${B.join("  ")}  `), e.push(`  AREAASSIGN  "${f}"  "${ne[w]}"  SECTION "${ke(t)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
          return;
        }
        const m = h[a[0]][2] <= h[a[2]][2] ? 0 : 2, N = h[a[1]][2] <= h[a[3]][2] ? 1 : 3;
        s.push(`  AREA "${f}"  ${A}  4  "${u[m].pt}"  "${u[N].pt}"  "${u[N].pt}"  "${u[m].pt}"  1  1  0  0  `);
        const C = u[m === 0 ? 2 : 0].story;
        e.push(`  AREAASSIGN  "${f}"  "${C}"  SECTION "${ke(t)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
      } else {
        const L = u.length, y = (B) => ne.indexOf(B), m = Math.max(...u.map((B) => y(B.story))), N = u.map((B) => m - y(B.story)), C = ne[m] ?? u[0].story;
        s.push(`  AREA "${f}"  ${A}  ${L}  ` + u.map((B) => `"${B.pt}"`).join("  ") + "  " + N.join("  ") + "  ");
        const w = $t.get(t.idx) ?? (I == null ? void 0 : I.get(t.idx));
        e.push(qe(t.idx) ? `  AREAASSIGN  "${f}"  "${C}"  SECTION "${ke(t)}"  ANG ${d(w ?? 0)} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  ` : `  AREAASSIGN  "${f}"  "${C}"  SECTION "${ke(t)}" ${Ke && (!Oe.size || (D[t.idx] ?? []).every((B) => Oe.has(B))) ? ' DIAPH  "D1" ' : ""} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "TOP"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `), Ze.push({ name: f, story: C, idx: t.idx });
      }
    }), s.push(""), s.push("$ AREA ASSIGNS"), e.forEach((t) => s.push(t)), s.push("");
  }
  const Wt = De === "manual" ? 0 : U ?? 1;
  s.push("$ LOAD PATTERNS");
  const Le = ((_d = $.loadPatterns) == null ? void 0 : _d.length) ? $.loadPatterns : [{ name: "Dead", type: "Dead", selfWeightMultiplier: Wt }, { name: "Live", type: "Live", selfWeightMultiplier: 0 }];
  for (const e of Le) {
    const t = e.type && e.type !== "Other" ? e.type : /^(dne|sdead|scm|superdead)$/i.test(e.name) ? "Super Dead" : /^dead$/i.test(e.name) ? "Dead" : /^(live|viva|l)$/i.test(e.name) ? "Live" : "Other";
    let o;
    t === "Dead" ? o = De === "manual" ? 0 : e.selfWeightMultiplier ?? U ?? 1 : (o = 0, (e.selfWeightMultiplier ?? 0) !== 0 && console.warn(`[e2k] El patron "${e.name}" (tipo ${t}) pedia SELFWEIGHT ${e.selfWeightMultiplier}. Se exporta 0: el peso propio va solo en Dead.`)), s.push(`  LOADPATTERN "${e.name}"  TYPE  "${t}"  SELFWEIGHT  ${o}`);
  }
  s.push("");
  const ge = $.loadPatternDestino && Le.some((e) => e.name === $.loadPatternDestino) ? $.loadPatternDestino : ((_e2 = Le.find((e) => e.type === "Dead")) == null ? void 0 : _e2.name) ?? Le[0].name, tt = [], ot = /* @__PURE__ */ new Map(), Pt = (e, t) => {
    const o = ot.get(e) ?? [0, 0, 0, 0, 0, 0];
    for (let a = 0; a < 6; a++) o[a] += t[a] ?? 0;
    ot.set(e, o);
  }, Vt = ge === (((_f = Le.find((e) => e.type === "Dead")) == null ? void 0 : _f.name) ?? Le[0].name), _t = De === "manual" || !Vt || X;
  if (R.loads && R.loads.size > 0 && R.loads.forEach((e, t) => {
    const [o, a, r] = oe(t, e), [f, A, u] = se(t, e);
    Pt(t, [o, a, _t ? r : 0, f, A, u]);
  }), R.moments && R.moments.size > 0 && R.moments.forEach((e, t) => {
    Pt(t, [0, 0, 0, e[0] ?? 0, e[1] ?? 0, e[2] ?? 0]);
  }), ot.forEach((e, t) => {
    if (e.every((a) => Math.abs(a) <= 1e-10)) return;
    const o = Ee(t);
    tt.push(`  POINTLOAD  "${o.pt}"  "${o.story}"  TYPE "FORCE"  LC "${ge}"  FX ${F(l(e[0]))}  FY ${F(l(e[1]))}  FZ ${F(l(e[2]))}  MX ${F(i(e[3]))}  MY ${F(i(e[4]))}  MZ ${F(i(e[5]))}`);
  }), tt.length > 0 && (s.push("$ POINT OBJECT LOADS"), tt.forEach((e) => s.push(e)), s.push("")), X && Q.size > 0) {
    const e = [];
    for (const t of Q) {
      const o = G.get(t), a = pt.get(t);
      if (!a) continue;
      const r = (f) => F(K(f) / ee);
      Math.abs(o[2]) > 1e-12 && e.push(`  LINELOAD  "${a.name}"  "${a.story}"  TYPE "UNIFF"  DIR "${o[2] < 0 ? "GRAV" : "Z"}"  LC "${ge}"  FVAL ${r(Math.abs(o[2]))}`), Math.abs(o[0]) > 1e-12 && e.push(`  LINELOAD  "${a.name}"  "${a.story}"  TYPE "UNIFF"  DIR "X"  LC "${ge}"  FVAL ${r(o[0])}`), Math.abs(o[1]) > 1e-12 && e.push(`  LINELOAD  "${a.name}"  "${a.story}"  TYPE "UNIFF"  DIR "Y"  LC "${ge}"  FVAL ${r(o[1])}`);
    }
    e.length && (s.push("$ FRAME OBJECT LOADS"), e.forEach((t) => s.push(t)), s.push(""));
  }
  if (c && c.size > 0 && Ze.length > 0) {
    const e = [];
    for (const t of Ze) {
      const o = ut.get(t.idx), a = o !== void 0 ? { value: o } : c.get(t.idx);
      if (!a || Math.abs(a.value) < 1e-12) continue;
      const r = a.dir ?? "GRAV", f = r === "GRAV" ? -a.value : a.value;
      e.push(`  AREALOAD  "${t.name}"  "${t.story}"  TYPE "UNIFF"  DIR "${r}"  LC "${a.pattern ?? ge}"  FVAL ${F(K(f) / (ee * ee))}`);
    }
    e.length > 0 && (s.push("$ SHELL OBJECT LOADS"), e.forEach((t) => s.push(t)), s.push(""));
  }
  s.push("$ ANALYSIS OPTIONS"), s.push('  ACTIVEDOF "UX UY UZ RX RY RZ"  '), s.push('  PDELTA  METHOD "NONE"  '), s.push("");
  const st = De === "manual";
  s.push("$ MASS SOURCE"), s.push(`  MASSSOURCE  "MsSrc1"    INCLUDEELEMENTS "${st ? "Yes" : "No"}"    INCLUDEADDEDMASS "No"    INCLUDELOADS "${st ? "No" : "Yes"}"    INCLUDEMOVE "No"    INCLUDELATERALMASS "Yes"    INCLUDEVERTICALMASS "Yes"    LUMPATSTORIES "No"    ISDEFAULT "Yes"  `), st || s.push('  MASSSOURCELOAD  "MsSrc1"  "Dead"  1 '), s.push(""), s.push("$ LOAD CASES");
  const Xt = ((_g = $.loadCases) == null ? void 0 : _g.length) ? $.loadCases : Le.map((e) => ({ name: e.name, type: "Linear Static", patterns: [{ pattern: e.name, scaleFactor: 1 }] }));
  for (const e of Xt) {
    s.push(`  LOADCASE "${e.name}"  TYPE  "${e.type ?? "Linear Static"}"  INITCOND  "PRESET"  `);
    for (const t of e.patterns ?? []) s.push(`  LOADCASE "${e.name}"  LOADPAT  "${t.pattern}"  SF ${t.scaleFactor} `);
  }
  const jt = $.modalModes ?? 12;
  s.push('  LOADCASE "Modal"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  '), s.push(`  LOADCASE "Modal"  MAXMODES ${jt}  MINMODES 1  EIGENSHIFTFREQ 0  EIGENCUTOFFFREQ 0  EIGENTOL 1E-09  ALLOWAUTOFREQSHIFT "Yes"  `), s.push("");
  const nt = $.loadCombinations;
  if (nt && nt.length) {
    s.push("$ LOAD COMBINATIONS");
    for (const e of nt) {
      s.push(`  COMBO "${e.name}"  TYPE "${e.type ?? "Linear Add"}"  `);
      for (const t of e.cases ?? []) s.push(`  COMBO "${e.name}"  LOADCASE  "${t.case}"  SF ${t.scaleFactor} `);
    }
    s.push("");
  }
  return s.push("  END"), s.push("$ END OF MODEL FILE"), s.join(`\r
`);
}
function bt($, h) {
  const D = $[h[0]], R = $[h[1]], T = Math.abs(R[2] - D[2]), H = Math.sqrt((R[0] - D[0]) ** 2 + (R[1] - D[1]) ** 2), z = T > H * 0.5;
  return z && H > 0.01 ? "BRACE" : z ? "COLUMN" : "BEAM";
}
export {
  co as a,
  no as c,
  ro as e,
  Bt as m,
  ao as s,
  io as u
};
