/**
 * tutorFem.ts — «🎓 Tutor FEM»: una ventana flotante (arrastrable, redimensionable y plegable) dentro
 * de Hekatan Struct con una hoja de Hekatan LISP WEB que explica, como un profesor, el FEM del modelo
 * ABIERTO. Piloto: la zapata con levantamiento (Das ej. 6.10).
 *
 * La hoja NO es una copia fija: se escribe aquí con los números del modelo (B, L, t, ks, Q, e, malla)
 * y con las vueltas REALES del solver (qué muelles se apagan en cada iteración), y viaja a la web por
 * el enlace `#h=<hoja comprimida>` (deflate-raw + base64url), el mismo mecanismo de «🔗 Compartir» de
 * Hekatan LISP web y de tutoriales.ts. Nada pasa por un servidor. Se queda dentro de Struct (iframe).
 */
import { CADENA } from "./tutorCadena";
import { DAS_EJ610, zapataRigidaSinTraccion, areaEfectivaDas, moduloE, TONF, type ParamsZapataExc } from "../zapata-excentrica/zapataExcentrica";

const LISP_WEB = "https://giorgioburbanelli89.github.io/hekatan-lisp/";

async function comprimir(t: string): Promise<string> {
  const s = new Blob([t]).stream().pipeThrough(new (window as any).CompressionStream("deflate-raw"));
  const b = new Uint8Array(await new Response(s).arrayBuffer());
  let bin = ""; for (const x of b) bin += String.fromCharCode(x);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}


// ── Idioma de la ventana (ES/EN): el del navegador, o el elegido con el botón ES/EN ──
type Idioma = "es" | "en";
const TXT: Record<Idioma, Record<string, string>> = {
  es: { sub: "Hekatan LISP web · con los números del modelo abierto", calc: "Abre Hekatan LISP con las variables del modelo y la calculadora 🖩",
        plegar: "Plegar / desplegar", cerrar: "Cerrar (Esc)", ley: "lo usa el modelo abierto · 🧮 arriba: calculadora", pronto: "⏳ próximamente",
        lab: "Hekatan Lab (la K numérica ensamblada) solo tiene versión de escritorio: ⏳", boton: "🎓 Tutor FEM",
        botonT: "El FEM de esta zapata, paso a paso, en Hekatan LISP", sinSol: "Primero hay que resolver el modelo.",
        hojaEn: "", idioma: "EN", idiomaT: "English" },
  en: { sub: "Hekatan LISP web · with the numbers of the open model", calc: "Opens Hekatan LISP with the model variables and the calculator 🖩",
        plegar: "Collapse / expand", cerrar: "Close (Esc)", ley: "used by the open model · 🧮 top: calculator", pronto: "⏳ coming soon",
        lab: "Hekatan Lab (the assembled numeric K) is desktop-only: ⏳", boton: "🎓 FEM Tutor",
        botonT: "The FEM of this footing, step by step, in Hekatan LISP", sinSol: "Solve the model first.",
        hojaEn: "(the worksheets are in Spanish for now; English ⏳)", idioma: "ES", idiomaT: "Español" },
};
function idioma(): Idioma {
  try { const g = localStorage.getItem("hk_tutor_lang"); if (g === "es" || g === "en") return g; } catch { /* nada */ }
  return (navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en";
}
const tx = (k: string) => TXT[idioma()][k] ?? k;

const f = (x: number, d = 3) => (Number.isFinite(x) ? +x.toFixed(d) : 0);

export interface DatosTutor {
  p: ParamsZapataExc;
  nodes: number[][];
  vueltas: Array<{ activo: boolean[]; uz: Float64Array }>;
  nodosComp: number[];
}

/** La hoja del tutor con los números del modelo abierto. */
export function hojaTutorZapata(d: DatosTutor): string {
  const { p, nodes, vueltas, nodosComp } = d;
  const L: string[] = [];
  const h = p.Lx / p.n, ksT = p.ks, E = moduloE(p.fc) / 98.0665 * 10;   // E en tonf/m² (de kgf/cm²)
  const ex = p.exL * p.Lx, ey = p.eyB * p.Ly;
  const esDas = Math.abs(p.Lx - DAS_EJ610.Lx) + Math.abs(p.Ly - DAS_EJ610.Ly) + Math.abs(p.exL - DAS_EJ610.exL) + Math.abs(p.eyB - DAS_EJ610.eyB)
    + Math.abs(p.t - DAS_EJ610.t) + Math.abs(p.ks - DAS_EJ610.ks) + Math.abs(p.P - DAS_EJ610.P) + Math.abs(p.n - DAS_EJ610.n) + Math.abs(p.c - DAS_EJ610.c) < 1e-6;
  // ── lo que dio el solver, vuelta a vuelta ──
  const pos = new Map(nodosComp.map((n, i) => [n, i]));
  const fin = vueltas[vueltas.length - 1];
  const tabla = vueltas.map((v, k) => {
    let act = 0, trac = 0, qmax = 0;
    v.activo.forEach((a, i) => { if (!a) return; act++; const w = v.uz[nodosComp[i]]; if (w > 0) trac++; qmax = Math.max(qmax, -w * ksT); });
    const sig = vueltas[k + 1]?.activo;
    const apaga = sig ? v.activo.filter((a, i) => a && !sig[i]).length : 0;
    const enciende = sig ? v.activo.filter((a, i) => !a && sig[i]).length : 0;
    return { k: k + 1, act, trac, apaga, enciende, qmax };
  });
  // perfil de presión por la diagonal: de la esquina cargada a la opuesta, 11 puntos
  const sx = ex >= 0 ? 1 : -1, sy = ey >= 0 ? 1 : -1;
  const x0 = sx > 0 ? p.Lx : 0, y0 = sy > 0 ? p.Ly : 0, x1 = p.Lx - x0, y1 = p.Ly - y0;
  const Dg = Math.hypot(p.Lx, p.Ly), NP = 11;
  const muestra = Array.from({ length: NP }, (_, i) => {
    const s = i / (NP - 1), X = x0 + (x1 - x0) * s, Y = y0 + (y1 - y0) * s;
    let best = 0, dm = Infinity;
    nodes.forEach((q, j) => { const dd = (q[0] - X) ** 2 + (q[1] - Y) ** 2; if (dd < dm) { dm = dd; best = j; } });
    return { dist: s * Dg, nodo: best };
  });
  const perfil = vueltas.map((v) => muestra.map(({ nodo }) => {
    const i = pos.get(nodo); if (i === undefined || !v.activo[i]) return 0;
    return f(-v.uz[nodo] * ksT, 2);
  }));
  const hx = Dg / (NP - 1);
  const hat = (xi: number) => `(1 - abs(x - ${f(xi, 4)})/${f(hx, 4)} + abs(1 - abs(x - ${f(xi, 4)})/${f(hx, 4)}))/2`;
  const expr = perfil.map((ys, k) => `(1 - sign(abs(n - ${k + 1})))*(` +
    ys.map((y, i) => (y === 0 ? "" : `${y}*${hat(muestra[i].dist)}`)).filter(Boolean).join(" + ") + ")").join(" + ");
  let wmin = 0, nC = 0;
  fin.activo.forEach((a, i) => { if (a) nC++; wmin = Math.min(wmin, fin.uz[nodosComp[i]]); });
  const qFem = -wmin * ksT;
  const rig = zapataRigidaSinTraccion(p, 200);
  const das = areaEfectivaDas(p.Lx, p.Ly, ex, ey);

  L.push("# Tutor FEM: la zapata que se levanta, paso a paso");
  L.push(`#: Esta hoja la escribe Hekatan Struct con los números del modelo que tienes abierto: zapata de ${p.Lx} × ${p.Ly} × ${p.t} m, f'c ${p.fc} kgf/cm², suelo con ks = ${p.ks} tonf/m³, carga Q = ${f(p.P, 3)} tonf (${f(p.P * TONF, 1)} kN) con excentricidades e_{x} = ${f(ex, 3)} m y e_{y} = ${f(ey, 3)} m, malla de ${p.n} × ${p.n} elementos. Cambia el modelo y vuelve a abrir el tutor: la hoja cambia con él.`);
  L.push("");
  L.push("## a) El suelo como resortes (Winkler)");
  L.push("#: Winkler: el suelo es una cama de resortes independientes. La presión en un punto es proporcional a lo que se hunde ahí: q = ks·w. En el FEM la cama se concentra en los nudos: cada nudo carga el área que le toca (su «área tributaria»), así que su resorte vale ks por esa área.");
  L.push("k_nudo = ks*A_trib");
  L.push("#: Con celdas cuadradas de lado h, un nudo interior se lleva una celda entera, uno de borde media y una esquina un cuarto:");
  L.push("k_int = ks*h^2");
  L.push("k_borde = ks*h^2/2");
  L.push("k_esq = ks*h^2/4");
  L.push(`#: Con los números del modelo (h = ${f(h, 4)} m, ks = ${p.ks} tonf/m³):`);
  L.push(`k_1 = dec(${p.ks}*${f(h, 6)}^2, 3)`);
  L.push(`k_2 = dec(${p.ks}*${f(h, 6)}^2/2, 3)`);
  L.push(`k_3 = dec(${p.ks}*${f(h, 6)}^2/4, 3)`);
  L.push(`#: En tonf/m. Es exactamente lo que hacen SAP2000, ETABS y SAFE con un «area spring»: lo reparten a los nudos por área tributaria. Hay ${nodosComp.length} resortes, uno por nudo.`);
  L.push("");
  L.push("## b) La zapata como elementos de placa");
  L.push("#: La losa se parte en elementos de 4 nudos. Cada nudo tiene 3 movimientos que importan en una placa horizontal: bajar (w) y girar alrededor de x y de y. Un elemento tiene entonces 12 grados de libertad, y su matriz de rigidez K_{e} (12 × 12) dice qué fuerzas hacen falta para cada movimiento. La rigidez a flexión de la placa por metro es:");
  L.push("D_p = E*t^3/(12*(1 - nu^2))");
  L.push(`#: Con E = 15100·√f'c = ${f(E, 0)} tonf/m², t = ${p.t} m y ν = 0.2:`);
  L.push(`D_1 = dec(${f(E, 1)}*${p.t}^3/(12*(1 - 0.2^2)), 1)`);
  L.push("#: En tonf·m. La placa es «gruesa» (Mindlin, con deformación por cortante): el elemento es el MITC4 de Bathe y Dvorkin (1985), el mismo tipo que usa SAP2000 como Shell-Thick. K_{e} sale de integrar la energía de flexión y de cortante sobre el elemento; en fuerzas y movimientos del elemento:");
  L.push("f_e = K_e*u_e");
  L.push("");
  L.push("## c) El ensamble: una sola ecuación para toda la zapata");
  L.push(`#: Cada elemento aporta su K_{e} a los nudos que comparte con sus vecinos, y cada resorte suma su k en la diagonal del w de su nudo. Todo junto es UNA ecuación: la rigidez de la placa más la del suelo, por los movimientos, igual a las cargas. Aquí son ${nodes.length} nudos × 3 = ${nodes.length * 3} incógnitas.`);
  L.push("F = (K_placa + K_suelo)*u");
  L.push("#: Si el suelo fuera lineal, esto se resuelve UNA vez y se acabó.");
  L.push("");
  L.push("## d) Por qué NO es lineal: el suelo no tira");
  L.push("#: Un resorte de suelo solo empuja. Si el nudo SUBE, el resorte estaría tirando de la zapata hacia abajo: eso el suelo no lo hace. Es la ley «Gap» del manual de CSI (Analysis Reference, p. 286): fuerza = k·w si el resorte se comprime; fuerza = 0 si se estira. Como no se sabe de antemano qué nudos se levantan, se itera:");
  L.push("#: 1) se resuelve con TODOS los resortes; 2) los resortes cuyo nudo subió se APAGAN (k = 0) y los apagados cuyo nudo bajó se vuelven a encender; 3) se resuelve otra vez; se repite hasta que ningún resorte cambia. Al final se cumple la ley en cada nudo, sin tolerancias. SAP2000, SAFE y ETABS llegan a lo mismo con pasos de carga y Newton-Raphson.");
  L.push("#: Las vueltas REALES del solver con este modelo (la presión máxima en tonf/m²; «en tracción» = resortes activos cuyo nudo subió, o sea tirando):");
  L.push(`#tabla("Vuelta:0","Resortes activos:0","En tracción:0","Se apagan:0","Se encienden:0","q_max [tonf/m²]:2")(` +
    `[${tabla.map((t) => t.k).join(", ")}]; [${tabla.map((t) => t.act).join(", ")}]; [${tabla.map((t) => t.trac).join(", ")}]; [${tabla.map((t) => t.apaga).join(", ")}]; [${tabla.map((t) => t.enciende).join(", ")}]; [${tabla.map((t) => f(t.qmax, 2)).join(", ")}])`);
  L.push(`#: La animación: la presión del suelo a lo largo de la DIAGONAL de la zapata, desde la esquina más cargada (x = 0) hasta la opuesta (x = ${f(Dg, 3)} m), en cada vuelta n. Donde la curva baja de cero el resorte está TIRANDO: en la vuelta siguiente se apaga y ahí la presión queda en cero. Pasa el ratón para pausar.`);
  L.push(`#anim fplot(q = ${expr}, [0 ${f(Dg, 4)}]), n = 1:${vueltas.length}`);
  L.push(`#: Resultado: ${nC} de ${nodosComp.length} nudos tocan el suelo; el resto de la zapata se levantó.`);
  L.push("");
  L.push("## e) Comparación: Braja Das (zapata rígida) y SAP2000");
  L.push("#: Das (Principles of Foundation Engineering, 9.ª ed., ec. 6.53, p. 236) supone la zapata RÍGIDA con presión lineal: para excentricidad en una dirección, pasado B/6 la presión es un triángulo de largo 3(B/2 − e) y máximo 4Q/(3L(B − 2e)). Para dos direcciones la zapata rígida se resuelve igual, buscando el plano de asiento que equilibra Q y los dos momentos con el suelo sin tracción.");
  L.push(`#tabla("Cálculo","q_max [tonf/m²]:3","Área en contacto [m²]:3")({"FEM de este modelo (Hekatan)","Zapata rígida"${esDas ? ',"SAP2000 24 (mismo modelo, juez)","SAFE 20","ETABS 22"' : ""}}; [${f(qFem, 3)}, ${f(rig.qmax, 3)}${esDas ? ", 81.914, 81.915, 81.915" : ""}]; [${f(nC / nodosComp.length * p.Lx * p.Ly, 3)}, ${f(rig.contacto * p.Lx * p.Ly, 3)}${esDas ? ", 1.888, 1.888, 1.888" : ""}])`);
  L.push(`#: La zapata rígida da ${f((rig.qmax / qFem - 1) * 100, 2)} % de diferencia en la presión máxima: la placa real se flexa y reparte un poco distinto. ` +
    (esDas ? "Con este modelo (el ejemplo 6.10 de Das) SAP2000, SAFE y ETABS dan lo mismo que Hekatan a 4 cifras, con los mismos nudos en contacto." :
      "Los números de SAP2000, SAFE y ETABS están medidos para el ejemplo 6.10 de Das (el modelo por defecto): vuelve a él para verlos."));
  L.push(`#: Ojo con el «área efectiva» A' de Das (caso ${das.caso}, A' = ${f(das.A, 3)} m²): es para CAPACIDAD DE CARGA (presión última uniforme con su centroide bajo la carga), no el área que toca el suelo en servicio. Por eso no coincide con el contacto del FEM, y no tiene por qué.`);
  return L.join("\n") + "\n";
}


/** Hoja: la K de la PLACA de la zapata (Shell-Thick, MITC4), algebraica y luego con los números. */
export function hojaPlacaZapata(p: ParamsZapataExc): string {
  const E = moduloE(p.fc) / 98.0665 * 10, h = p.Lx / p.n, nu = 0.2;
  return [
    "# La rigidez de la placa de la zapata (Shell-Thick, MITC4)",
    `#: Un elemento de la malla del modelo abierto: cuadrado de lado h = ${f(h, 4)} m, espesor t = ${p.t} m, hormigón f'c ${p.fc} kgf/cm². En el solver: hekatan-fem/src/cpp/utils/shellQ4.cpp, función getBendingK (línea 807): flexión con integración 2×2 y cortante MITC4 de Dvorkin y Bathe (1984) (línea 927). Libro: Bathe, «Finite Element Procedures» (1996), §5.4.2.`,
    "## 1 · Qué se mueve en cada nudo",
    "#: En una placa horizontal cada nudo baja (w) y gira alrededor de x y de y. Los giros de la placa gruesa NO son la pendiente de w: se interpolan aparte (teoría de Mindlin), y la diferencia entre pendiente y giro es la deformación por cortante.",
    "#: Funciones de forma bilineales del cuadrado de referencia (ξ, η entre −1 y 1), las mismas para w y para los dos giros:",
    "N_1 = (1 - xi)*(1 - eta)/4",
    "N_2 = (1 + xi)*(1 - eta)/4",
    "N_3 = (1 + xi)*(1 + eta)/4",
    "N_4 = (1 - xi)*(1 + eta)/4",
    "## 2 · La energía de flexión: la matriz D de la placa",
    "#: Los momentos por metro salen de las curvaturas con la rigidez a flexión D (placa isótropa):",
    "D_b = E*t^3/(12*(1 - nu^2))",
    `D_1 = dec(${f(E, 1)}*${p.t}^3/(12*(1 - ${nu}^2)), 1)`,
    "#: En tonf·m (E = 15100·√f'c en tonf/m²). La matriz constitutiva de flexión:",
    "Db = D_1*[1, 0.2, 0; 0.2, 1, 0; 0, 0, 0.4]",
    "## 3 · La energía de cortante",
    "#: La placa gruesa además se deforma por cortante, con rigidez k·G·t (k = 5/6, getBendingK línea 817):",
    `G_c = dec(${f(E, 1)}/(2*(1 + ${nu})), 1)`,
    `Ds = dec(5/6*G_c*${p.t}, 1)`,
    "#: En tonf/m. Integrado tal cual con 2×2 puntos, el cortante «bloquea» la placa delgada (shear locking). El MITC4 lo evita: evalúa el cortante en los CENTROS DE LOS LADOS del elemento y lo interpola desde ahí (en coordenadas covariantes, línea 934).",
    "## 4 · La K del elemento (12 × 12)",
    "#: Con B_b la matriz que pasa de los 12 movimientos del elemento a las 3 curvaturas y B_s la que los pasa a los 2 cortantes (MITC4), la rigidez es la integral de la energía sobre el elemento:",
    "K_e = transpose(B_b)*Db*B_b*A_e + transpose(B_s)*Ds*B_s*A_e",
    `#: Con 2×2 puntos de Gauss sobre un elemento de área h² = ${f(h * h, 6)} m². Las proporciones que mandan: la de flexión va con D_b/h² y la de cortante con k·G·t; su cociente dice si la placa es gruesa o delgada:`,
    `r_s = dec(Ds*${f(h, 6)}^2/D_1, 3)`,
    "#: Mientras más chico este número, más domina la flexión (placa delgada). Hekatan y SAP2000 (Shell-Thick) usan la misma teoría; con la misma malla dan la misma flecha a 0.0000 % en la zapata lineal (test zapata-winkler-sap2000).",
    "## 5 · El ensamble",
    `#: Cada K_{e} se suma en las filas y columnas de sus 4 nudos. ${(p.n + 1) ** 2} nudos × 3 movimientos = ${3 * (p.n + 1) ** 2} ecuaciones. A esa K se le suman los resortes del suelo (hoja «Resorte Winkler») y se resuelve F = K·u.`,
    "F = K*u",
  ].join("\n") + "\n";
}

/** Hoja: el resorte de Winkler (área → nudos), algebraica y luego con los números. */
export function hojaWinkler(p: ParamsZapataExc): string {
  const h = p.Lx / p.n;
  return [
    "# El resorte de Winkler: del suelo a los nudos",
    `#: Suelo del modelo abierto: ks = ${p.ks} tonf/m³ (módulo de balasto), malla de lado h = ${f(h, 4)} m. En el solver: hekatan-fem/src/cpp/utils/springsExtra.h, addAreaSpringLumped (línea 88), y para el suelo que no tira examples/src/shared/muellesSoloCompresion.ts (pesosAreaNudos + resolverSoloCompresion).`,
    "## 1 · La hipótesis de Winkler (1867)",
    "#: La presión en un punto depende solo del hundimiento en ESE punto: q = ks·w. Es una cama de resortes independientes, sin cortante entre ellos.",
    "q_s = ks*w",
    "## 2 · De la presión a una fuerza por nudo",
    "#: La fuerza que el suelo hace sobre un elemento se reparte a sus nudos con las funciones de forma. Si w varía poco dentro del elemento, a cada nudo le toca la integral de su función de forma: su área tributaria.",
    "#: En una dirección, con s = x/h entre 0 y 1, la función de forma de un nudo es 1 − s y su integral es:",
    "a_1 = Area{1 - s @ s=0:1}",
    "#: O sea medio lado: h/2. En dos direcciones, (h/2)·(h/2) = h²/4 por elemento. Un nudo interior toca 4 elementos: h². Uno de borde, 2: h²/2. Una esquina, 1: h²/4.",
    "k_int = ks*h^2",
    "k_borde = ks*h^2/2",
    "k_esq = ks*h^2/4",
    "## 3 · Con los números del modelo",
    `k_1 = dec(${p.ks}*${f(h, 6)}^2, 3)`,
    `k_2 = dec(${p.ks}*${f(h, 6)}^2/2, 3)`,
    `k_3 = dec(${p.ks}*${f(h, 6)}^2/4, 3)`,
    `#: En tonf/m. La suma de todos los resortes es ks por el área de la zapata:`,
    `k_total = dec(${p.ks}*${p.Lx}*${p.Ly}, 1)`,
    "#: Así lo hacen SAP2000 y ETABS con un «area spring» y también SAFE (medido nudo a nudo el 8-sep-2026). La alternativa «consistente» ks·∫NᵀN acopla los nudos y difiere en las esquinas.",
    "## 4 · El suelo que no tira",
    "#: El resorte solo empuja: si el nudo sube, su fuerza es cero (ley Gap de CSI, Analysis Reference p. 286). Eso vuelve el problema NO lineal: hay que iterar apagando los resortes en tracción. Lo explica la hoja «Levantamiento (no lineal)».",
  ].join("\n") + "\n";
}

/** Hoja corta para la calculadora: las variables del modelo ya definidas, para operar a mano. */
export function hojaCalculadora(p: ParamsZapataExc): string {
  const E = moduloE(p.fc) / 98.0665 * 10;
  return [
    "# Calculadora: corrobora tú mismo",
    "#: Las variables del modelo abierto ya están definidas (tonf, m). Escribe debajo cualquier cuenta; la calculadora 🖩 está a la izquierda.",
    `B_x = ${p.Lx}`, `L_y = ${p.Ly}`, `t_z = ${p.t}`, `E_c = ${f(E, 1)}`, `k_s = ${p.ks}`, `Q = ${f(p.P, 4)}`,
    `e_x = ${f(p.exL * p.Lx, 4)}`, `e_y = ${f(p.eyB * p.Ly, 4)}`, `h = ${f(p.Lx / p.n, 6)}`,
    "q_media = Q/(B_x*L_y)",
    "k_int = k_s*h^2",
  ].join("\n") + "\n";
}

const CSS = `
#hk-tutor{ position:fixed; z-index:2147482000; left:12vw; top:9vh; width:min(900px,80vw); height:min(640px,80vh);
  min-width:360px; min-height:44px; resize:both; overflow:hidden; display:flex; flex-direction:column;
  background:var(--hk-panel,#232936); color:var(--hk-texto,#C8D4E4); border:1px solid var(--hk-borde,#39445A);
  border-radius:8px; box-shadow:0 18px 60px rgba(0,0,0,.55); font:13px/1.4 "Segoe UI",system-ui,sans-serif; }
#hk-tutor.plegado{ height:44px !important; resize:none; }
#hk-tutor header{ display:flex; align-items:center; gap:8px; padding:8px 10px; cursor:move; user-select:none;
  background:var(--hk-chrome,#1B1F26); border-bottom:1px solid var(--hk-borde,#39445A); }
#hk-tutor header b{ font-size:14px; }
#hk-tutor header span{ color:var(--hk-suave,#8C9AAE); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
#hk-tutor header button{ border:0; background:transparent; color:inherit; font-size:15px; cursor:pointer; width:28px; height:28px; border-radius:4px; }
#hk-tutor header button:hover{ background:var(--hk-hover,#2E3646); }
#hk-tutor header .der{ margin-left:auto; display:flex; gap:2px; }
#hk-tutor .cuerpo{ flex:1; min-height:0; display:flex; }
#hk-tutor .migas{ display:none; flex-wrap:wrap; align-items:center; gap:6px; padding:6px 10px; border-bottom:1px solid var(--hk-borde,#39445A);
  background:var(--hk-panel2,#2E3646); }
#hk-tutor .migas .ruta a{ color:var(--hk-foco,#7F96B3); cursor:pointer; text-decoration:underline; }
#hk-tutor .migas .q{ margin-left:10px; color:var(--hk-marca,#D3A53C); font-weight:600; }
#hk-tutor .migas button{ border:1px solid var(--hk-marca,#D3A53C); background:transparent; color:var(--hk-marca,#D3A53C); border-radius:12px;
  padding:3px 10px; cursor:pointer; font:inherit; }
#hk-tutor .migas button:hover{ background:var(--hk-marca,#D3A53C); color:#111; }
#hk-tutor .indice{ width:230px; flex:none; overflow-y:auto; padding:6px; border-right:1px solid var(--hk-borde,#39445A); }
#hk-tutor .indice .ent{ display:block; width:100%; text-align:left; margin:3px 0; padding:6px 8px; border-radius:5px; cursor:pointer;
  border:1px solid transparent; background:transparent; color:inherit; font:inherit; }
#hk-tutor .indice .ent:hover{ background:var(--hk-hover,#2E3646); }
#hk-tutor .indice .ent.usa{ color:var(--hk-marca,#D3A53C); font-weight:600; }
#hk-tutor .indice .ent.on{ border-color:var(--hk-foco,#7F96B3); background:var(--hk-panel2,#2E3646); }
#hk-tutor .indice .ent.pronto{ opacity:.55; cursor:default; }
#hk-tutor .indice small{ display:block; font-weight:400; color:var(--hk-suave,#8C9AAE); }
#hk-tutor .indice .ley{ margin:6px 4px; font-size:11px; color:var(--hk-suave,#8C9AAE); }
#hk-tutor iframe{ flex:1; min-width:0; border:0; background:#fff; }
#hk-tutor-btn{ position:fixed; z-index:2147481000; top:46px; right:330px; padding:6px 12px; border-radius:16px; cursor:pointer;
  border:1px solid var(--hk-marca,#D3A53C); background:var(--hk-chrome,#1B1F26); color:var(--hk-marca,#D3A53C);
  font:600 13px "Segoe UI",system-ui,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,.35); }
#hk-tutor-btn:hover{ background:var(--hk-marca,#D3A53C); color:#111; }
`;

function css() {
  if (document.getElementById("hk-tutor-css")) return;
  const st = document.createElement("style"); st.id = "hk-tutor-css"; st.textContent = CSS; document.head.appendChild(st);
}

export interface EntradaTutor { titulo: string | [string, string]; cadena?: string; usa?: boolean; hoja?: () => string; ej?: string; pronto?: boolean }

/** Abre la ventana del tutor: índice de formulaciones a la izquierda, la hoja LISP a la derecha. */
export async function abrirTutorFem(entradas: EntradaTutor[], calculadora?: () => string, titulo = "🎓 Tutor FEM",
  hojaCadena?: (id: string) => string): Promise<HTMLElement> {
  css();
  document.getElementById("hk-tutor")?.remove();
  const w = document.createElement("div");
  w.id = "hk-tutor";
  w.innerHTML = `<header><b></b><span>${tx("sub")} ${tx("hojaEn")}</span>` +
    `<div class="der"><button data-a="lang" title="${tx("idiomaT")}">${tx("idioma")}</button><button data-a="calc" title="${tx("calc")}">🧮</button>` +
    `<button data-a="plegar" title="${tx("plegar")}">▁</button><button data-a="cerrar" title="${tx("cerrar")}">✕</button></div></header>` +
    `<div class="migas"></div><div class="cuerpo"><nav class="indice"></nav><iframe title="Tutor FEM"></iframe></div>`;
  document.body.appendChild(w);
  (w.querySelector("header b") as HTMLElement).textContent = titulo === "🎓 Tutor FEM" ? tx("boton") : titulo;
  w.querySelector('[data-a="lang"]')!.addEventListener("click", () => {
    try { localStorage.setItem("hk_tutor_lang", idioma() === "es" ? "en" : "es"); } catch { /* nada */ }
    const r = w.getBoundingClientRect();
    abrirTutorFem(entradas, calculadora, titulo, hojaCadena).then((n) => { n.style.left = r.left + "px"; n.style.top = r.top + "px"; });
    const bt = document.getElementById("hk-tutor-btn"); if (bt) { bt.textContent = tx("boton"); bt.title = tx("botonT"); }
  });
  const cab = w.querySelector("header") as HTMLElement;
  let arr: { x: number; y: number; l: number; t: number } | null = null;
  cab.addEventListener("pointerdown", (e) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const r = w.getBoundingClientRect(); arr = { x: e.clientX, y: e.clientY, l: r.left, t: r.top }; cab.setPointerCapture(e.pointerId);
  });
  cab.addEventListener("pointermove", (e) => { if (!arr) return; w.style.left = arr.l + e.clientX - arr.x + "px"; w.style.top = Math.max(0, arr.t + e.clientY - arr.y) + "px"; });
  cab.addEventListener("pointerup", () => { arr = null; });
  w.querySelector('[data-a="plegar"]')!.addEventListener("click", () => w.classList.toggle("plegado"));
  w.querySelector('[data-a="cerrar"]')!.addEventListener("click", () => w.remove());
  const iframe = w.querySelector("iframe") as HTMLIFrameElement;
  const ir = async (hoja: string | null, ej: string | null, solo = true) => {
    const q = new URLSearchParams();
    if (ej) q.set("ej", ej); else if (hoja) q.set("h", await comprimir(hoja));
    if (solo) q.set("solo", "1");
    iframe.src = LISP_WEB + "#" + q.toString();
    (window as any).__hekatanTutorUrl = iframe.src;
  };
  w.querySelector('[data-a="calc"]')!.addEventListener("click", () => {
    nav.querySelectorAll(".ent").forEach((b) => b.classList.remove("on"));
    if (calculadora) ir(calculadora(), null, false);
  });
  const nav = w.querySelector(".indice") as HTMLElement;
  const tit = (e: EntradaTutor) => (Array.isArray(e.titulo) ? e.titulo[idioma() === "es" ? 0 : 1] : e.titulo);
  nav.innerHTML = `<div class="ley"><b style="color:var(--hk-marca,#D3A53C)">●</b> ${tx("ley")}</div>` + entradas.map((e, k) =>
    `<button class="ent${e.usa ? " usa" : ""}${e.pronto ? " pronto" : ""}" data-k="${k}" ${e.pronto ? "disabled" : ""}>` +
    `${e.usa ? "● " : ""}${tit(e)}${e.pronto ? ` <small>${tx("pronto")}</small>` : ""}</button>`).join("") +
    `<div class="ley">${tx("lab")}</div>`;
  // ── la cadena «¿De dónde sale?»: miga de pan + un botón por término que la hoja usa ──
  const migas = w.querySelector(".migas") as HTMLElement;
  const es = idioma() === "es";
  let pila: string[] = [];
  const pintarCadena = () => {
    if (!pila.length) { migas.innerHTML = ""; migas.style.display = "none"; return; }
    migas.style.display = "flex";
    const id = pila[pila.length - 1], nodo = CADENA[id];
    migas.innerHTML =
      (pila.length > 1 ? `<button data-c="up">⬆ ${es ? "volver" : "back"}</button>` : "") +
      `<span class="ruta">${pila.map((x, i) => `<a data-i="${i}">${CADENA[x].titulo[es ? 0 : 1].split(":")[0]}</a>`).join(" → ")}</span>` +
      (nodo.hijos.length ? `<span class="q">${es ? "¿De dónde sale?" : "Where does it come from?"}</span>` +
        nodo.hijos.map((c) => `<button data-c="${c}">${CADENA[c].titulo[es ? 0 : 1]}</button>`).join("") : "");
    migas.querySelectorAll<HTMLButtonElement>("button[data-c]").forEach((b) => (b.onclick = () => {
      if (b.dataset.c === "up") pila.pop(); else pila.push(b.dataset.c!);
      mostrarCadena();
    }));
    migas.querySelectorAll<HTMLAnchorElement>("a[data-i]").forEach((a) => (a.onclick = () => { pila = pila.slice(0, +a.dataset.i! + 1); mostrarCadena(); }));
  };
  const mostrarCadena = () => {
    const id = pila[pila.length - 1];
    (window as any).__hekatanTutorCadena = [...pila];
    const txt = hojaCadena ? hojaCadena(id) : null;
    ir(txt, null);
    pintarCadena();
  };
  const elegir = (k: number) => {
    const e = entradas[k]; if (!e || e.pronto) return;
    nav.querySelectorAll(".ent").forEach((b, i) => b.classList.toggle("on", i === k));
    if (e.cadena && hojaCadena) { pila = [e.cadena]; mostrarCadena(); return; }
    pila = []; pintarCadena();
    ir(e.hoja ? e.hoja() : null, e.ej ?? null);
  };
  nav.querySelectorAll<HTMLButtonElement>(".ent").forEach((b) => (b.onclick = () => elegir(+b.dataset.k!)));
  elegir(entradas.findIndex((e) => !e.pronto));
  window.addEventListener("keydown", function esc(e) {
    if (e.key !== "Escape" || !document.getElementById("hk-tutor")) return;
    e.stopPropagation(); document.getElementById("hk-tutor")?.remove(); window.removeEventListener("keydown", esc, true);
  }, true);
  return w;
}

/** El índice del tutor para la zapata: marca lo que usa el modelo (placa gruesa + Winkler + levantamiento). */
export function entradasZapata(d: DatosTutor, hojaDas: string): EntradaTutor[] {
  return [
    { titulo: ["Levantamiento: el suelo que no tira (vueltas reales del solver)", "Uplift: soil that cannot pull (real solver iterations)"], usa: true, cadena: "NL" },
    { titulo: ["¿Cómo se calcula la matriz de rigidez? (placa MITC4)", "How is the stiffness matrix computed? (MITC4 plate)"], usa: true, cadena: "K" },
    { titulo: ["Resorte Winkler: del suelo a los nudos", "Winkler spring: from soil to nodes"], usa: true, cadena: "W" },
    { titulo: ["Placa Shell-Thick: resumen", "Shell-Thick plate: summary"], usa: true, hoja: () => hojaPlacaZapata(d.p) },
    { titulo: ["Braja Das: zapata excéntrica (ej. 6.10)", "Braja Das: eccentric footing (Ex. 6.10)"], usa: true, hoja: () => hojaDas },
    { titulo: ["Barra: de dónde sale la K (EI, L)", "Bar: where K comes from (EI, L)"], ej: "26 De donde sale la rigidez de barra (EI y L, deducida).lisp" },
    { titulo: ["Pórtico plano: ensamble de la K", "Plane frame: assembling K"], ej: "24 El portico - de donde sale la K (ensamblaje).lisp" },
    { titulo: ["Pórtico 3D: K de 12×12", "3D frame: 12×12 K"], pronto: true },
    { titulo: ["Placa Shell-Thin (DKQ)", "Shell-Thin plate (DKQ)"], ej: "40 Shell Thin - placa delgada como ETABS y SAP2000.lisp" },
    { titulo: ["Placa DK: Kirchhoff discreto", "DK plate: discrete Kirchhoff"], ej: "43 Placa DK - teoria del Discrete Kirchhoff y Shell-Thin.lisp" },
    { titulo: ["Placa DKMQ y DSE de Wilson", "DKMQ plate and Wilson DSE"], pronto: true },
    { titulo: ["Membrana con giro (ITW)", "Membrane with drilling (ITW)"], pronto: true },
    { titulo: ["Sólido H8", "H8 solid"], pronto: true },
  ];
}

/** El botón «🎓 Tutor FEM» del ejemplo de la zapata: solo visible mientras ese ejemplo está abierto. */
export function botonTutorZapata(leerDatos: () => DatosTutor | null, hojaDas: string, ids: string[] = ["zapata-excentrica"]) {
  css();
  (window as any).__hekatanTutorDatos = leerDatos;
  if (document.getElementById("hk-tutor-btn")) return;
  const b = document.createElement("button");
  b.id = "hk-tutor-btn"; b.textContent = tx("boton"); b.title = tx("botonT");
  b.onclick = async () => {
    const d = ((window as any).__hekatanTutorDatos ?? leerDatos)();
    if (!d) { alert(tx("sinSol")); return; }
    await abrirTutorFem(entradasZapata(d, hojaDas), () => hojaCalculadora(d.p), "🎓 Tutor FEM", (id) =>
      id === "W" ? hojaWinkler(d.p) : id === "NL" ? hojaTutorZapata(d) : (CADENA[id]?.hoja?.(d.p) ?? "# ⏳"));
  };
  document.body.appendChild(b);
  const vigila = setInterval(() => {
    const id = (window as any).__hekatanExample?.();
    if (id !== undefined && id !== null && !ids.includes(id)) {
      b.remove(); document.getElementById("hk-tutor")?.remove(); clearInterval(vigila);
    }
  }, 800);
}

(window as any).__hekatanTutorFem = { abrirTutorFem, hojaTutorZapata, hojaPlacaZapata, hojaWinkler };
