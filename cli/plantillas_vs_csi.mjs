#!/usr/bin/env node
/**
 * El careo: las 8 PLANTILLAS de Hekatan Struct contra ETABS, capa por capa.
 *
 *   node cli/plantillas_vs_csi.mjs [informe.md]
 *
 * Lee `validation/modelos/plantillas/hekatan.json` (lo escribe
 * `plantillas_hekatan.mjs`) y los `P<N>_*.json` de `plantillas/etabs/` (los
 * escribe `plantillas_etabs.py` abriendo cada `.e2k` en ETABS 22 de verdad).
 *
 * ## Las capas, y este orden importa
 *
 * **1 · ¿es el mismo MODELO?** nudos, barras, apoyos, cargas, secciones.
 *      Si esto no cuadra, comparar resultados no dice nada: serian dos
 *      edificios distintos y la diferencia no se podria atribuir al motor.
 * **2 · ¿la misma MASA?** total y nudo a nudo. Antes que los modos: un periodo
 *      va con la raiz de la masa, asi que con masas distintas los periodos
 *      TIENEN que salir distintos y compararlos no informa de nada.
 * **3 · ESTATICO**: reaccion en la base, y los desplazamientos NUDO A NUDO.
 * **4 · MODOS**: emparejados por PARTICIPACION DE MASA, no por numero de orden
 *      — un pórtico plano tiene su primer modo fuera del plano y el «modo 1» de
 *      cada programa puede ser un modo distinto.
 * **5 · FUERZAS**: de barra (P V2 V3 T M2 M3) y de cascara (M11 M22 M12).
 *
 * La tolerancia nodal se mide contra el MAXIMO del modelo, no contra el valor
 * de cada nudo: un nudo que casi no se mueve da un error relativo enorme sin
 * que eso signifique nada.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { compararFuerzas, CAMPOS } from "../tests/lib/comparar.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = join(__dirname, "..", "validation", "modelos", "plantillas");
const INFORME = process.argv[2] || join(BASE, "COMPARACION.md");

const TOL_COORD = 2e-3;   // m
const TOL_REL = 1e-3;     // 0.1 %

const hek = JSON.parse(readFileSync(join(BASE, process.env.HEK_JSON || "hekatan.json"), "utf-8"));
const dirE = join(BASE, process.env.ETABS_DIR || "etabs");   // ETABS_DIR=etabs_offsets: la corrida con brazos automaticos
if (!existsSync(dirE)) { console.error("falta " + dirE + " — corre antes cli/plantillas_etabs.py"); process.exit(2); }

function enSegmento(P, A, B) {
  const d = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
  const v = [P[0] - A[0], P[1] - A[1], P[2] - A[2]];
  const L2 = d[0] ** 2 + d[1] ** 2 + d[2] ** 2;
  if (L2 < 1e-12) return Math.hypot(...v) <= TOL_COORD;
  const t = (v[0] * d[0] + v[1] * d[1] + v[2] * d[2]) / L2;
  if (t < -TOL_COORD || t > 1 + TOL_COORD) return false;
  return Math.hypot(v[0] - t * d[0], v[1] - t * d[1], v[2] - t * d[2]) <= TOL_COORD;
}
const k3 = (x, y, z) => [x, y, z].map((v) => (+v).toFixed(3)).join(",");
const pct = (a, b) => (b ? (100 * a) / b : 100);
const dif = (a, b) => (Math.abs(b) > 1e-12 ? Math.abs(a - b) / Math.abs(b) : (Math.abs(a) < 1e-12 ? 0 : 1));

function peorSeccion(M, J) {
  const uniq = new Map();
  for (const [i, A] of M.areas ?? []) {
    const key = A.toFixed(9);
    if (!uniq.has(key)) uniq.set(key, {
      A, I22: (M.Iy.find(([k]) => k === i) || [])[1],
      I33: (M.Iz.find(([k]) => k === i) || [])[1],
      J: (M.J.find(([k]) => k === i) || [])[1],
    });
  }
  const mias = [...uniq.values()].sort((a, b) => a.A - b.A);
  const suyas = Object.values(J.secciones || {}).sort((a, b) => a.A - b.A);
  if (!mias.length || !suyas.length) return { peor: 0, n: suyas.length, nota: "sin secciones" };
  if (mias.length !== suyas.length)
    return { peor: 1, n: suyas.length, nota: `${suyas.length} en ETABS, ${mias.length} en el modelo` };
  let peor = 0, cual = "";
  for (let i = 0; i < mias.length; i++)
    for (const k of ["A", "I22", "I33", "J"]) {
      const d = dif(suyas[i][k], mias[i][k]);
      if (d > peor) { peor = d; cual = k; }
    }
  return { peor, n: suyas.length, nota: peor > TOL_REL ? cual : "" };
}

/**
 * Empareja los modos de los dos programas por su PARTICIPACION DE MASA.
 * Cada modo es un vector [UX, UY, UZ, RX, RY, RZ]; se cruza cada modo de
 * Hekatan con el de ETABS que mas se le parece (coseno del angulo), y solo
 * cuenta si el parecido es claro. Comparar T1 contra T1 es lo que hacia creer
 * que el portico plano estaba un 11 % mal: su modo 1 va FUERA del plano.
 */
function emparejarModos(partH, mmE, TH) {
  const vE = (mmE || []).map((m) => [m.UX, m.UY, m.UZ, m.RX, m.RY, m.RZ].map((x) => x || 0));
  const TE = (mmE || []).map((m) => m.T);
  const cos = (a, b) => {
    const na = Math.hypot(...a), nb = Math.hypot(...b);
    if (na < 1e-9 || nb < 1e-9) return 0;
    return a.reduce((s, x, i) => s + x * b[i], 0) / (na * nb);
  };
  const usados = new Set();
  return (partH || []).map((p, i) => {
    // Candidatos: coseno > 0.7. Entre ellos manda el PERIODO mas cercano, y un
    // periodo a mas del doble (o menos de la mitad) no es el mismo modo aunque
    // el vector de participacion se parezca: dos modos con 20 % en RZ y nada
    // mas tienen coseno 1.000 y pueden estar a 300 % de periodo (el dual y el
    // arriostrado, 3-sep-2026).
    let mejor = -1, cual = -1, dT = Infinity, cosMax = -1;
    const th = Array.isArray(TH) ? TH[i] : null;
    vE.forEach((q, j) => {
      if (usados.has(j)) return;
      const c = cos(p, q);
      if (c > cosMax) cosMax = c;
      if (c <= 0.7) return;
      const d = (th && TE[j]) ? Math.abs(Math.log(th / TE[j])) : 0;
      if (d > Math.log(2)) return;
      if (d < dT || (d === dT && c > mejor)) { dT = d; mejor = c; cual = j; }
    });
    if (cual >= 0) usados.add(cual); else mejor = cosMax;   // sin pareja: se muestra el mejor coseno visto
    return { modoH: i + 1, modoE: cual + 1, cos: mejor, TE: cual >= 0 ? TE[cual] : null,
             partE: cual >= 0 ? vE[cual] : null };
  });
}

const filas = hek.map((f) => {
  const jsn = join(dirE, `P${f.tipo}_${f.nombre}.json`);
  const r = { tipo: f.tipo, nombre: f.nombre, hek: f };
  if (!existsSync(jsn)) { r.err = "ETABS no dejo json"; return r; }
  const txt = readFileSync(jsn, "utf-8");
  if (/\bNaN\b/.test(txt)) { r.err = "ETABS leyo coordenadas NaN del e2k"; return r; }
  r.J = JSON.parse(txt.replace(/\bNaN\b/g, "null").replace(/\b-?Infinity\b/g, "null"));
  return r;
});

const { empaquetar, R } = await import("../tests/lib/bundle.mjs");
const mod = await empaquetar(`
const g = globalThis; g.window = g;
const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}),
  createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) },
  { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){},
  addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false},
  getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){},
  cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(),
  documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[],
  addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} };
g.addEventListener = () => {};
g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");
export function modelo(tipo) {
  const ex = examplesRegistry.find(e => e.id === "plantillas");
  const p = {}; for (const [k, d] of Object.entries(ex.params || {})) p[k] = d.default;
  p.tipo = tipo; p.__soloModelo = true;      // sin estatico: aqui solo la geometria
  const estado = (ini) => { let v = ini;
    return { get val(){ return v; }, set val(x){ v = x; },
             get rawVal(){ return v; }, set rawVal(x){ v = x; } }; };
  const st = { nodes: estado([]), elements: estado([]), nodeInputs: estado({}),
               elementInputs: estado({}), deformOutputs: estado({}),
               analyzeOutputs: estado({}), objects3D: estado([]) };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  const ni = st.nodeInputs.val, ei = st.elementInputs.val;
  return { nodes: st.nodes.val, elements: st.elements.val,
    supports: [...(ni.supports ?? [])], loads: [...(ni.loads ?? [])],
    areas: [...(ei.areas ?? [])], Iy: [...(ei.momentsOfInertiaY ?? [])],
    Iz: [...(ei.momentsOfInertiaZ ?? [])], J: [...(ei.torsionalConstants ?? [])] };
}`, "plantillas-vs-csi");

for (const r of filas) {
  if (r.err) continue;
  const M = mod.modelo(r.tipo), J = r.J, H = r.hek;
  const nudos = new Set(M.nodes.map((n) => k3(...n)));
  const porNombre = new Map(J.puntos.map((p) => [p.n, p]));

  // ── capa 1: el modelo ──
  let sobre = 0, sueltosConectados = 0;
  for (const p of J.puntos) {
    if (nudos.has(k3(p.x, p.y, p.z))) sobre++;
    else if ((p.con ?? -1) > 0) sueltosConectados++;
  }
  const segE = J.barras.map((b) => {
    const pi = porNombre.get(b.i), pj = porNombre.get(b.j);
    return pi && pj ? [[pi.x, pi.y, pi.z], [pj.x, pj.y, pj.z]] : null;
  }).filter(Boolean);
  const barrasM = M.elements.filter((e) => e.length === 2);
  let cubiertas = 0;
  for (const e of barrasM) {
    const P = M.nodes[e[0]], Q = M.nodes[e[1]];
    if (segE.some(([A, B]) => enSegmento(P, A, B) && enSegmento(Q, A, B))) cubiertas++;
  }
  let apOk = 0;
  for (const [idx, bits] of M.supports) {
    const p = J.puntos.find((q) => k3(q.x, q.y, q.z) === k3(...M.nodes[idx]));
    if (p && p.ap && bits.every((b, i) => !!b === !!p.ap[i])) apOk++;
  }
  let fzM = 0; for (const [, v] of M.loads) fzM += v[2] || 0;
  let fzE = 0; for (const c of J.cargas) fzE += c.fz || 0;
  r.geo = {
    nJoints: J.puntos.length, nNodos: M.nodes.length,
    pctNudos: pct(sobre, J.puntos.length), sueltosConectados,
    nBarras: barrasM.length, pctBarras: barrasM.length ? pct(cubiertas, barrasM.length) : 100,
    nApoyos: M.supports.length, apOk, fzM, fzE, difFZ: dif(fzE, fzM),
    nAreasE: (J.areas || []).length,
    nShellsM: M.elements.filter((e) => e.length === 3 || e.length === 4).length,
    sec: peorSeccion(M, J),
  };

  // ── capa 1b: la PROPIEDAD de la cascara ──
  //
  // El tipo (Thin/Thick/Membrane) y los diez modificadores. No es cosmetico: el
  // tipo cambia el ELEMENTO (Kirchhoff contra Mindlin) y un modificador cambia
  // la rigidez. Si esto no viaja, el `.e2k` describe otra losa.
  //   ShellType de ETABS: 1 = ShellThin, 2 = ShellThick, 3 = Membrane
  //   plateFormulations de Hekatan: 1 = Kirchhoff MZC, 0 = Mindlin MITC4
  const pf = new Map(H.params ? [] : []);
  const formEsperada = (esMuro) => {
    const v = esMuro ? H.params?.formMuro : H.params?.formLosa;
    return v === undefined ? null : (v === 1 ? 1 : 2);     // 1=Thin, 0=Thick
  };
  const props = Object.values(J.propsArea || {});
  r.props = props.map((p) => {
    const esMuro = p.clase === "Wall";
    const esp = formEsperada(esMuro);
    const mods = p.mods || [];
    return { n: p.n, clase: p.clase, t: p.t,
             shellType: p.shellType, esperado: esp,
             tipoOk: esp === null || p.shellType === esp,
             // Las plantillas no llevan modificadores: los diez tienen que
             // llegar a ETABS en 1. Si alguno no lo esta, el e2k invento algo.
             modsOk: mods.length === 0 || mods.every((v) => Math.abs(v - 1) < 1e-9),
             mods };
  });

  // ── capa 2: la masa ──
  const masaE = J.masa || {};
  const totE = J.masa_total ? J.masa_total[0] : Object.values(masaE).reduce((s, v) => s + (v[0] || 0), 0);
  // ⚠️ La masa que cuenta para el modal es la que cuelga de nudos LIBRES: la que
  // cae en un apoyo tiene el GDL fijo y no participa. Comparar solo el total
  // esconde justo eso — y aqui lo esconde de verdad: los totales cuadran al
  // 0.4 % mientras la masa PARTICIPANTE difiere un 28 %.
  let libreE = 0, libreH = 0, fijaE = 0, fijaH = 0;
  let peorMasa = 0, peorMasaNudo = null, nMasa = 0, sinPar = 0;
  for (const p of J.puntos) {
    const m = masaE[p.n];
    const mh = (H.masa || {})[k3(p.x, p.y, p.z)];
    if (mh === undefined) { if (m && m[0] > 1e-9) sinPar++; continue; }
    nMasa++;
    const e = m ? (m[0] || 0) : 0;
    if ((p.ap || []).some(Boolean)) { fijaE += e; fijaH += mh; }
    else {
      libreE += e; libreH += mh;
      if (Math.abs(e - mh) > peorMasa) { peorMasa = Math.abs(e - mh); peorMasaNudo = [p.x, p.y, p.z, e, mh]; }
    }
  }
  r.masa = { totE, totH: H.masaTotal, difTot: dif(totE, H.masaTotal),
             libreE, libreH, difLibre: dif(libreE, libreH), fijaE, fijaH,
             peorNudo: peorMasa, peorMasaNudo, nMasa, sinPar,
             err: J.masa_error || H.masaErr };

  // ── capa 3: estatico ──
  const dead = (J.react || []).find((c) => String(c.case).toLowerCase() === "dead");
  const dsp = (J.disp || {})["Dead"] || Object.values(J.disp || {})[0] || {};
  // NUDO A NUDO: tolerancia contra el MAXIMO del modelo, no contra cada nudo.
  const dn = J.disp_nudos || {};
  const maxU = Math.max(1e-12, ...Object.values(H.disp || {}).map((v) => Math.hypot(v[0], v[1], v[2])));
  let peorU = 0, nU = 0, dentro1 = 0, peorNudo = null;
  for (const p of J.puntos) {
    const ue = dn[p.n]; if (!ue) continue;
    const uh = (H.disp || {})[k3(p.x, p.y, p.z)];
    if (!uh) continue;
    nU++;
    const d = Math.hypot(ue[0] - uh[0], ue[1] - uh[1], ue[2] - uh[2]) / maxU;
    if (d <= 0.01) dentro1++;
    if (d > peorU) { peorU = d; peorNudo = [p.x, p.y, p.z]; }
  }
  r.num = {
    RzE: dead ? dead.Fz : null, RzM: H.R6[2],
    uzE: dsp.uzMin ?? null, uzM: H.uzMin,
    difRz: dead ? dif(dead.Fz, H.R6[2]) : null,
    difUz: (dsp.uzMin != null) ? dif(dsp.uzMin, H.uzMin) : null,
    nU, dentro1, pctDentro1: pct(dentro1, nU), peorU, peorNudo, maxU,
    tAnalisis: J.t_analisis,
  };

  // ── capa 4: los modos, emparejados por participacion ──
  r.modos = emparejarModos(H.part, J.modalmass, H.T);
  r.modos.forEach((m, i) => { m.TH = H.T[i]; m.dif = m.TE ? (m.TH - m.TE) / m.TE : null; });

  // ── capa 5: fuerzas ──
  // BARRAS. Se traduce la clave de ETABS (nombres de joint) a coordenadas, que
  // es lo unico que comparten los dos. Del lado de Hekatan van las fuerzas de
  // EXTREMO tal cual: `compararFuerzas` hace la conversion a diagrama y el
  // signo de M2, que es donde estan las dos trampas de la convencion CSI.
  //
  // ⚠️ Una LINE del `.e2k` puede ser una COLUMNA ENTERA de 4 pisos: el
  // exportador junta los tramos y ETABS la vuelve a partir. Sus estaciones van
  // de 0 a la longitud TOTAL, y coger «la primera y la ultima» compararia la
  // columna completa contra un solo tramo del modelo. Los cortes se leen de la
  // propia lista: ETABS REPITE la estacion donde acaba un elemento y empieza el
  // siguiente (…3.5, 3.5…), asi que cada par repetido es una junta.
  const bPorNombre = new Map(J.barras.map((b) => [b.n, b]));
  const etabsFuerzas = [];
  for (const [nm, est] of Object.entries(J.frames || {})) {
    const b = bPorNombre.get(nm); if (!b) continue;
    const pi = porNombre.get(b.i), pj = porNombre.get(b.j);
    if (!pi || !pj) continue;
    const A = [pi.x, pi.y, pi.z], B = [pj.x, pj.y, pj.z];
    const L = Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2]);
    if (L < 1e-9) continue;
    const en = (s) => A.map((a, d) => a + (s / L) * (B[d] - a));
    const ord = est.slice().sort((a, b2) => a[0] - b2[0]);
    // trocear por estaciones repetidas
    let ini = 0;
    for (let k = 1; k < ord.length; k++) {
      const cierra = (k + 1 < ord.length && Math.abs(ord[k][0] - ord[k + 1][0]) < 1e-9)
                     || k === ord.length - 1;
      if (!cierra) continue;
      const P = ord[ini], Q = ord[k];
      if (Math.abs(Q[0] - P[0]) > 1e-9) {
        const reg = { i: en(P[0]), j: en(Q[0]) };
        CAMPOS.forEach((c, m) => { reg[c] = [P[m + 1], Q[m + 1]]; });
        etabsFuerzas.push(reg);
      }
      ini = k + 1;
      k++;                                   // saltar la copia de la junta
    }
  }
  try {
    const cmp = compararFuerzas(H.frames || [], etabsFuerzas);
    r.fuerzas = { emparejadas: cmp.emparejadas, nStruct: cmp.nStruct, nEtabs: cmp.nEtabs,
                  campos: cmp.campos };
  } catch (e) { r.fuerzas = { err: String(e?.message || e).slice(0, 90) }; }

  // CASCARAS. Se empareja por CENTROIDE: ETABS renumera las areas al importar,
  // asi que el nombre no sirve de clave. Tres capas, de menos a mas fina:
  //   · centroide: la media de los 4 joints de ETABS contra bXXc de Hekatan;
  //   · joint a joint: cada joint de AreaForceShell contra bXXj (mismo nudo);
  //   · nudo: la media de los joints de los elementos que tocan el nudo (lo que
  //     pinta el colormap) en los dos programas.
  // Signo: el de CSI en los dos (desde el 8-sep-2026). Sin "invertido".
  const cShell = new Map();
  for (const s of (H.shells || [])) cShell.set(k3(...s.c), s);
  const media = (v) => (Array.isArray(v) && v.length ? v.reduce((a, b) => a + b, 0) / v.length : null);
  let nSh = 0, nJ = 0, sinParSh = 0, peorC = [0, 0, 0], peorJ = [0, 0, 0], maxM = 1e-12, sumEH = 0, sumHH = 0;
  const nudoH = new Map(), nudoE = new Map();
  for (const a of (J.areas || [])) {
    const pts = a.pts.map((n) => porNombre.get(n)).filter(Boolean);
    if (!pts.length) continue;
    const c = [0, 1, 2].map((d) => pts.reduce((s, p) => s + [p.x, p.y, p.z][d], 0) / pts.length);
    const sh = cShell.get(k3(...c));
    const fe = (J.shells || {})[a.n];
    if (!sh || !fe) { if (fe) sinParSh++; continue; }
    nSh++;
    const hc = [sh.bXXc ?? media(sh.bXX), sh.bYYc ?? media(sh.bYY), sh.bXYc ?? media(sh.bXY)];
    const hj = [sh.bXXj, sh.bYYj, sh.bXYj];
    for (const [q, idx] of [[0, 4], [1, 5], [2, 6]]) {
      const ec = fe.reduce((s, v) => s + v[idx], 0) / fe.length;
      maxM = Math.max(maxM, Math.abs(ec));
      peorC[q] = Math.max(peorC[q], Math.abs(ec - (hc[q] ?? 0)));
      sumEH += ec * (hc[q] ?? 0); sumHH += (hc[q] ?? 0) ** 2;
    }
    if (!hj[0] || !sh.pts) continue;
    for (const v of fe) {
      const p = porNombre.get(v[0]); if (!p) continue;
      const pos = sh.pts.findIndex((n) => k3(...n) === k3(p.x, p.y, p.z)); if (pos < 0) continue;
      nJ++;
      for (const [q, idx] of [[0, 4], [1, 5], [2, 6]]) peorJ[q] = Math.max(peorJ[q], Math.abs(v[idx] - hj[q][pos]));
      const kn = k3(...sh.pts[pos]);
      (nudoH.get(kn) ?? nudoH.set(kn, []).get(kn)).push(hj[0][pos]);
      (nudoE.get(kn) ?? nudoE.set(kn, []).get(kn)).push(v[4]);
    }
  }
  let peorN = 0;
  for (const [kn, l] of nudoH) { const e = nudoE.get(kn); if (e) peorN = Math.max(peorN, Math.abs(media(l) - media(e))); }
  // MEMBRANA (F11 F22 F12 = columnas 1,2,3 de AreaForceShell), misma comparacion
  let peorFc = 0, peorFj = 0, maxF = 1e-12, nFj = 0;
  for (const a of (J.areas || [])) {
    const pts = a.pts.map((n) => porNombre.get(n)).filter(Boolean); if (!pts.length) continue;
    const c = [0, 1, 2].map((d) => pts.reduce((s, p) => s + [p.x, p.y, p.z][d], 0) / pts.length);
    const sh = cShell.get(k3(...c)); const fe = (J.shells || {})[a.n]; if (!sh || !fe) continue;
    const hc = [sh.mXXc ?? media(sh.mXX), sh.mYYc ?? media(sh.mYY), sh.mXYc ?? media(sh.mXY)];
    const hj = [sh.mXXj, sh.mYYj, sh.mXYj];
    for (const [q, idx] of [[0, 1], [1, 2], [2, 3]]) {
      const ec = fe.reduce((s, v) => s + v[idx], 0) / fe.length;
      maxF = Math.max(maxF, Math.abs(ec)); peorFc = Math.max(peorFc, Math.abs(ec - (hc[q] ?? 0)));
    }
    if (!hj[0] || !sh.pts) continue;
    for (const v of fe) {
      const p = porNombre.get(v[0]); if (!p) continue;
      const pos = sh.pts.findIndex((n) => k3(...n) === k3(p.x, p.y, p.z)); if (pos < 0) continue;
      nFj++;
      for (const [q, idx] of [[0, 1], [1, 2], [2, 3]]) peorFj = Math.max(peorFj, Math.abs(v[idx] - hj[q][pos]));
    }
  }
  r.shells = { nSh, nJ, sinParSh, nAreasE: (J.areas || []).length,
               nShellsH: (H.shells || []).length,
               peorM11: peorC[0] / maxM, peorM22: peorC[1] / maxM, peorM12: peorC[2] / maxM,
               peorJoint: Math.max(...peorJ) / maxM, peorNudo: peorN / maxM,
               peorFc: peorFc / maxF, peorFj: peorFj / maxF, nFj, maxF,
               invertido: false, pendiente: sumHH > 1e-12 ? sumEH / sumHH : null, maxM };
}

// ── consola ──
// Lo que hace que un modelo CUADRE. Los joints que ETABS anade de mas y que no
// tocan nada NO cuentan: no aportan rigidez ni masa y no cambian el analisis —
// por eso se mira `sueltosConectados` y no `pctNudos === 100`. Lo que si tiene
// que estar al 100 % es que cada NUDO DEL MODELO tenga su joint en ETABS, y eso
// lo cubre `pctBarras` (una barra no puede estar dentro de una LINE si le falta
// un extremo) mas los apoyos.
const okGeo = (r) => !r.err && r.geo && r.geo.pctBarras === 100 &&
  r.geo.sueltosConectados === 0 && r.geo.apOk === r.geo.nApoyos &&
  r.geo.difFZ <= TOL_REL && r.geo.sec.peor <= TOL_REL;
const f = (v, n = 4) => (v === undefined || v === null || Number.isNaN(v)) ? "-" : (+v).toFixed(n);
const p2 = (v) => (v === undefined || v === null) ? "-" : (100 * v).toFixed(3) + " %";
const et = (r) => (r.tipo + " " + r.nombre).padEnd(20);

console.log("\n== CAPA 1 · el .e2k leido por ETABS: ¿el mismo modelo? ==");
console.log("plantilla            joints  sobre  sueltos  barras  apoyos     SFz    seccion");
console.log("-".repeat(88));
for (const r of filas) {
  if (r.err) { console.log(`${et(r)} ${r.err}`); continue; }
  const g = r.geo;
  console.log(`${et(r)} ${String(g.nJoints).padStart(6)} ${(g.pctNudos.toFixed(1) + "%").padStart(6)} ` +
    `${String(g.sueltosConectados).padStart(8)} ${(g.pctBarras.toFixed(1) + "%").padStart(7)} ` +
    `${(g.apOk + "/" + g.nApoyos).padStart(7)} ${p2(g.difFZ).padStart(9)} ${p2(g.sec.peor).padStart(9)} ${okGeo(r) ? "OK" : "<-"}`);
}

const TIPO_SHELL = { 1: "ShellThin", 2: "ShellThick", 3: "Membrane" };
console.log("\n== CAPA 1b · la PROPIEDAD de la cascara (tipo y modificadores) ==");
console.log("plantilla            propiedad  clase   t[m]   tipo en ETABS   pedido        modificadores");
console.log("-".repeat(100));
for (const r of filas) {
  if (r.err || !r.props) { console.log(`${et(r)} ${r.err || "-"}`); continue; }
  if (!r.props.length) { console.log(`${et(r)} (sin cascaras)`); continue; }
  r.props.forEach((p, k) => {
    console.log(`${k === 0 ? et(r) : " ".repeat(20)} ${String(p.n).padEnd(10)} ${String(p.clase).padEnd(6)} ` +
      `${f(p.t, 3).padStart(6)}  ${(TIPO_SHELL[p.shellType] || p.shellType).padEnd(12)} ` +
      `${(TIPO_SHELL[p.esperado] || "-").padEnd(12)} ` +
      `${p.modsOk ? "todos 1" : p.mods.map((v) => (+v).toFixed(2)).join(" ")}` +
      `${p.tipoOk && p.modsOk ? "  OK" : "  <-"}`);
  });
}

console.log("\n== CAPA 2 · la MASA (la bascula, antes que los modos) ==");
console.log("plantilla            total_Hek  total_ETABS    dif  |  LIBRE_Hek  LIBRE_ETABS     dif  |  en apoyos E/H");
console.log("-".repeat(88));
for (const r of filas) {
  if (r.err || !r.masa) { console.log(`${et(r)} ${r.err || "-"}`); continue; }
  const m = r.masa;
  console.log(`${et(r)} ${f(m.totH, 2).padStart(9)} ${f(m.totE, 2).padStart(12)} ` +
    `${p2(m.difTot).padStart(7)}  | ${f(m.libreH, 2).padStart(10)} ${f(m.libreE, 2).padStart(12)} ` +
    `${p2(m.difLibre).padStart(8)}  | ${f(m.fijaE, 1)} / ${f(m.fijaH, 1)}` +
    (m.err ? "  " + m.err : ""));
}

console.log("\n== CAPA 3 · ESTATICO (caso Dead) ==");
console.log("plantilla              Rz_Hek   Rz_ETABS    dif     Uz_Hek  Uz_ETABS    dif    nudos  <1%max  peor");
console.log("-".repeat(104));
for (const r of filas) {
  if (r.err || !r.num) { console.log(`${et(r)} ${r.err || "sin resultados"}`); continue; }
  const n = r.num;
  console.log(`${et(r)} ${f(n.RzM, 1).padStart(9)} ${f(n.RzE, 1).padStart(10)} ${p2(n.difRz).padStart(8)} ` +
    `${f(n.uzM * 1000, 3).padStart(9)} ${f(n.uzE * 1000, 3).padStart(9)} ${p2(n.difUz).padStart(8)} ` +
    `${String(n.nU).padStart(7)} ${(n.pctDentro1.toFixed(1) + "%").padStart(7)} ${p2(n.peorU).padStart(9)}`);
}

console.log("\n== CAPA 4 · MODOS, emparejados por PARTICIPACION de masa ==");
console.log("plantilla            modo_H -> modo_E   cos    T_Hek    T_ETABS     dif      UX/UY/RZ de ETABS");
console.log("-".repeat(108));
for (const r of filas) {
  if (r.err || !r.modos) { console.log(`${et(r)} ${r.err || "-"}`); continue; }
  r.modos.slice(0, 3).forEach((m, k) => {
    const pe = m.partE ? `${(m.partE[0] * 100).toFixed(0)}/${(m.partE[1] * 100).toFixed(0)}/${(m.partE[5] * 100).toFixed(0)}` : "-";
    console.log(`${k === 0 ? et(r) : " ".repeat(20)} ${String(m.modoH).padStart(6)} -> ${String(m.modoE || "-").padStart(6)} ` +
      `${f(m.cos, 3).padStart(7)} ${f(m.TH).padStart(8)} ${f(m.TE).padStart(10)} ` +
      `${(m.dif != null ? (100 * m.dif).toFixed(2) + " %" : "-").padStart(9)}   ${pe}`);
  });
}

console.log("\n== CAPA 5 · FUERZAS de barra (Dead) y de cascara ==");
console.log("plantilla            barras    peor P     peor V2    peor M3   |  shells  peor M11   peor M22   peor M12 (centroide) | joint a joint | nudo (colormap)  M_E/M_H | F centroide | F joints");
console.log("-".repeat(104));
for (const r of filas) {
  if (r.err) { console.log(`${et(r)} ${r.err}`); continue; }
  const F = r.fuerzas || {}, S = r.shells || {};
  // ⚠️ `campos[c].max` YA viene en % (compararFuerzas divide por el PICO del
  // campo y multiplica por 100) y `campos[c].peor` es un OBJETO con la barra y
  // el extremo, no un numero: pasarlo por el formateador daba `NaN %` en los 8.
  const peor = (c) => (F.campos && F.campos[c]) ? f(F.campos[c].max, 3) + " %" : "-";
  console.log(`${et(r)} ${String(F.emparejadas ?? 0).padStart(6)} ${String(peor("P")).padStart(10)} ` +
    `${String(peor("V2")).padStart(11)} ${String(peor("M3")).padStart(10)}   | ` +
    `${String(S.nSh ?? 0).padStart(7)} ${p2(S.peorM11).padStart(9)} ${p2(S.peorM22).padStart(10)} ${p2(S.peorM12).padStart(10)}` +
    `  ${S.nSh ? p2(S.peorJoint).padStart(10) : "".padStart(10)}  ${S.nSh ? p2(S.peorNudo).padStart(10) : "".padStart(10)}` +
    `${S.pendiente != null ? f(S.pendiente, 4).padStart(9) : ""}` +
    `${S.nSh ? "  " + p2(S.peorFc).padStart(10) + "  " + p2(S.peorFj).padStart(10) : ""}` +
    (F.err ? "  " + F.err : ""));
}

// ── informe ──
const md = [
  "# Las 8 plantillas: el `.e2k` en ETABS, y los numeros de Hekatan lineal",
  "",
  "Generado con `node cli/plantillas_vs_csi.mjs`. Los datos de ETABS salen de",
  "abrir cada `.e2k` en **ETABS 22 de verdad** (`cli/plantillas_etabs.py`),",
  "guardarlo como `.EDB`, correr `RunAnalysis` y leer por la OAPI.",
  "",
  "Cinco capas, y el orden importa: modelo -> masa -> estatico -> modos ->",
  "fuerzas. Cada una solo tiene sentido si la anterior cuadra.",
  "",
  "## Capa 1 · el modelo",
  "",
  "«Barras» no exige igualdad una a una: el exportador junta una columna de",
  "varios tramos en una sola LINE y ETABS la vuelve a partir. Se pide que cada",
  "barra del modelo este DENTRO de alguna de ETABS. «Sueltos» son los joints que",
  "ETABS crea de mas **y que ademas tocan algo**.",
  "",
  "| ✓ | plantilla | joints ETABS | sobre nudo | sueltos | barras | apoyos | ΣFz | seccion | areas E/M |",
  "|---|---|---|---|---|---|---|---|---|---|",
  ...filas.map((r) => {
    if (r.err) return `| ✗ | \`${r.nombre}\` | ${r.err} | | | | | | | |`;
    const g = r.geo;
    return `| ${okGeo(r) ? "✓" : "✗"} | \`${r.nombre}\` | ${g.nJoints} | ${g.pctNudos.toFixed(1)} % | ` +
      `${g.sueltosConectados} | ${g.pctBarras.toFixed(1)} % de ${g.nBarras} | ${g.apOk}/${g.nApoyos} | ` +
      `${p2(g.difFZ)} | ${p2(g.sec.peor)}${g.sec.nota ? " (" + g.sec.nota + ")" : ""} | ${g.nAreasE}/${g.nShellsM} |`;
  }),
  "",
  "## Capa 1b \u00b7 la propiedad de la cascara",
  "",
  "El tipo (`Thin`/`Thick`/`Membrane`) y los diez modificadores. No es",
  "cosmetico: el tipo cambia el ELEMENTO (Kirchhoff contra Mindlin) y un",
  "modificador cambia la rigidez. `ShellType` de ETABS: 1 = ShellThin,",
  "2 = ShellThick, 3 = Membrane.",
  "",
  "| \u2713 | plantilla | propiedad | clase | t [m] | tipo en ETABS | pedido | modificadores |",
  "|---|---|---|---|---|---|---|---|",
  ...filas.flatMap((r) => (r.err || !r.props?.length)
    ? [`| \u2014 | \x60${r.nombre}\x60 | ${r.err || "sin cascaras"} | | | | | |`]
    : r.props.map((p) => `| ${p.tipoOk && p.modsOk ? "\u2713" : "\u2717"} | \x60${r.nombre}\x60 | ${p.n} | ${p.clase} | ` +
        `${f(p.t, 3)} | ${TIPO_SHELL[p.shellType] || p.shellType} | ${TIPO_SHELL[p.esperado] || "-"} | ` +
        `${p.modsOk ? "todos 1" : p.mods.map((v) => (+v).toFixed(2)).join(" ")} |`)),
  "",
  "## Capa 2 · la masa",
  "",
  "La bascula va ANTES que los modos: el periodo va con la raiz de la masa, asi",
  "que con masas distintas los periodos tienen que salir distintos y compararlos",
  "no informa de nada. Hekatan la saca de `assembled_joint_mass()` (la misma",
  "`ensamblarMasa()` de `modal.cpp`), ETABS de `AssembledJointMass`.",
  "",
  "**La masa que cuenta es la de los nudos LIBRES**: la que cae en un apoyo tiene",
  "el GDL fijo y no participa. Comparar solo el total lo esconde.",
  "",
  "| plantilla | total Hek [t] | total ETABS | dif | **libre** Hek | **libre** ETABS | dif | en apoyos E/H |",
  "|---|---|---|---|---|---|---|---|",
  ...filas.map((r) => r.err || !r.masa ? `| \`${r.nombre}\` | ${r.err || "-"} | | | | | | |`
    : `| \`${r.nombre}\` | ${f(r.masa.totH, 2)} | ${f(r.masa.totE, 2)} | ${p2(r.masa.difTot)} | ` +
      `${f(r.masa.libreH, 2)} | ${f(r.masa.libreE, 2)} | ${p2(r.masa.difLibre)} | ` +
      `${f(r.masa.fijaE, 1)} / ${f(r.masa.fijaH, 1)} |`),
  "",
  "## Capa 3 · estatico (caso `Dead`)",
  "",
  "El nudo a nudo se mide contra el **maximo del modelo**, no contra el valor de",
  "cada nudo: un nudo que casi no se mueve da un error relativo enorme sin que",
  "eso signifique nada.",
  "",
  "| plantilla | ΣRz Hek [kN] | ΣRz ETABS | dif | Uz Hek [mm] | Uz ETABS | dif | nudos | dentro del 1 % | peor nudo |",
  "|---|---|---|---|---|---|---|---|---|---|",
  ...filas.map((r) => r.err || !r.num ? `| \`${r.nombre}\` | ${r.err || "-"} | | | | | | | | |`
    : `| \`${r.nombre}\` | ${f(r.num.RzM, 1)} | ${f(r.num.RzE, 1)} | ${p2(r.num.difRz)} | ` +
      `${f(r.num.uzM * 1000, 3)} | ${f(r.num.uzE * 1000, 3)} | ${p2(r.num.difUz)} | ` +
      `${r.num.nU} | ${r.num.pctDentro1.toFixed(1)} % | ${p2(r.num.peorU)} |`),
  "",
  "## Capa 4 · los modos, emparejados por participacion de masa",
  "",
  "**No por numero de orden.** Un portico plano tiene su primer modo FUERA del",
  "plano, y el «modo 1» de un programa puede ser un modo distinto del otro. Cada",
  "modo se cruza con el de ETABS cuyo vector de participacion",
  "`[UX UY UZ RX RY RZ]` mas se le parece (coseno > 0.7).",
  "",
  "| plantilla | modo Hek | modo ETABS | cos | T Hek [s] | T ETABS [s] | dif | UX/UY/RZ ETABS |",
  "|---|---|---|---|---|---|---|---|",
  ...filas.flatMap((r) => r.err || !r.modos ? [`| \`${r.nombre}\` | ${r.err || "-"} | | | | | | |`]
    : r.modos.slice(0, 4).map((m, k) => {
        const pe = m.partE ? `${(m.partE[0] * 100).toFixed(0)}/${(m.partE[1] * 100).toFixed(0)}/${(m.partE[5] * 100).toFixed(0)}` : "-";
        return `| ${k === 0 ? "`" + r.nombre + "`" : ""} | ${m.modoH} | ${m.modoE || "-"} | ${f(m.cos, 3)} | ` +
          `${f(m.TH)} | ${f(m.TE)} | ${m.dif != null ? (100 * m.dif).toFixed(2) + " %" : "-"} | ${pe} |`;
      })),
  "",
  "## Capa 5 · fuerzas",
  "",
  "Las de barra pasan por `tests/lib/comparar.mjs`, que hace las dos",
  "conversiones de la convencion CSI: fuerza de EXTREMO -> DIAGRAMA (en el nudo",
  "i cambia de signo) y el signo de `M2`. Las de cascara se emparejan por",
  "CENTROIDE, porque ETABS renumera las areas al importar, y se comparan en",
  "tres capas contra `AreaForceShell`: el CENTROIDE (media de los 4 joints de",
  "ETABS contra el de Hekatan), JOINT A JOINT (cada joint del elemento, sin",
  "promediar, 3600 por plantilla: M11, M22 y M12) y por NUDO (la media de los",
  "joints de los elementos que tocan el nudo, que es lo que pinta el colormap).",
  "Lo mismo para la MEMBRANA (F11 F22 F12, en % del |F| maximo): centroide y joint a joint.",
  "Signo de CSI en los dos (desde el 8-sep-2026). Todo en % del |M| maximo.",
  "",
  "| plantilla | barras emparejadas | peor P | peor V2 | peor M3 | shells | M11 centroide | M22 centroide | M12 centroide | M joint a joint | M nudo (colormap) | F11/F22/F12 centroide | F joint a joint |",
  "|---|---|---|---|---|---|---|---|---|---|---|---|---|",
  ...filas.map((r) => {
    if (r.err) return `| \`${r.nombre}\` | ${r.err} | | | | | | | | | | | |`;
    const F = r.fuerzas || {}, S = r.shells || {};
    // ⚠️ `campos[c].max` YA viene en % (compararFuerzas divide por el PICO del
    // campo y multiplica por 100) y `campos[c].peor` es un OBJETO con la barra y
    // el extremo, no un numero: pasarlo por el formateador daba `NaN %` en los 8.
    const peor = (c) => (F.campos && F.campos[c]) ? f(F.campos[c].max, 3) + " %" : "-";
    return `| \`${r.nombre}\` | ${F.emparejadas ?? 0} de ${F.nStruct ?? 0} | ${peor("P")} | ${peor("V2")} | ` +
      `${peor("M3")} | ${S.nSh ?? 0} de ${S.nShellsH ?? 0} | ${p2(S.peorM11)} | ${p2(S.peorM22)} | ${p2(S.peorM12)} | ` +
      `${S.nSh ? p2(S.peorJoint) + " (" + S.nJ + ")" : "-"} | ${S.nSh ? p2(S.peorNudo) : "-"} | ` +
      `${S.nSh ? p2(S.peorFc) : "-"} | ${S.nSh ? p2(S.peorFj) + " (" + S.nFj + ")" : "-"} |`;
  }),
  "",
];
writeFileSync(INFORME, md.join("\n"), "utf-8");
console.log("\n-> " + INFORME);
