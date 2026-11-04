/**
 * E2K: PORTICO SIMPLE DE 1 VANO ESPACIAL (6 x 6 m) con correas conformadas en frio y cubierta metalica: PLANA vs PENDIENTE (3 % y 10 %),
 * Hekatan vs ETABS 22 (OAPI). Una sola estructura, tres alturas de cubierta:
 *   4 columnas tubo CC 1 200x6 (A572Gr50) · vigas VP I530X15+I150X6 en y=0 e y=6 (A36) · 7 correas 1G 160x60x15x3 «Cold Formed C» con labios (A36,
 *   MIRROR2, articuladas, tramos de 1 m, en x=0..6) · cubierta «Cubierta metalica» = membrana A36 de 4 mm, ONEWAYLOADDIST, 6 panos 1x6 ·
 *   LINECONSTRAINT «No» · base y=0 empotrada, base y=6 «UZ RX RY» (desliza; giro impedido: sin mecanismo, ver registro 4-nov 5).
 *   Casos: Dead 0.392 kN/m2, Live 0.686 kN/m2 (sobre la superficie inclinada), LATX/LATY 1 kN en cada nudo de correa de y=6 (7 kN).
 * Pendiente: z de la cubierta sube con y (plana 6.00 / 3 %: 6.18 / 10 %: 6.60 m en y=6).
 * Datos `tests/datos/e2k_portico1vano_{plana,P3,P10}.e2k` + `_ref.json` (plana y P3 = Epl y Ep3 del vano con cortante; P10 es la corrida nueva).
 * HALLAZGO CORREGIDO: la carga de losa en UNA direccion se repartia con el area PROYECTADA en planta; ETABS carga la superficie inclinada
 * (Live Fz 24.836 kN a 10 %, Hek daba 24.713 = -0.5 %). Ahora `repartirLosasUnaDireccion` usa el area 3D (Fz 24.836 exacto).
 * Tabla comparativa: `PORTICO_TABLA=1 node tests/run.mjs e2k_portico1vano` (se escribe por stderr).
 */
import { cargarMod, medirPortico, medirBarras, resumenFuerzas, picos, leerRef, VARIANTES, PREF } from "../lib/portico_cmp.mjs";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "e2k-portico1vano";
export const descripcion = "e2k: portico simple de 1 vano espacial (columnas, VP, correas Cold Formed C, membrana 4 mm): cubierta plana vs pendiente 3 % y 10 % contra ETABS";

export async function correr() {
  try { return await correrInterno(); } finally { delete globalThis.__hekatanFactoresPatron; }   // no contaminar a los demas casos del runner
}

async function correrInterno() {
  const mod = await cargarMod();
  const filas = [], tabla = [];
  const fila = (que, medido, limite, ok, detalle = "") => filas.push({ que, crudo: true, medido, limite, ok, detalle });
  const f = (x, n = 3) => x.toFixed(n);
  const ZY = { plana: [6, 6], P3: [6, 6.18], P10: [6, 6.6] };   // z de la cubierta en y=0 / y=6
  const pats = ["Dead", "Live", "LATX", "LATY"];

  // ---- 0) el modelo ES lo que se pidio: Cold Formed C con labios y membrana de 4 mm A36 (e2k de ETABS y .heks de Hekatan) ----
  {
    const txt = readFileSync(join(AQUI, "..", "datos", `${PREF}P3.e2k`), "latin1");
    const sec = txt.match(/FRAMESECTION\s+"1G 160x60x15x3IZQ"\s+MATERIAL "A36"\s+SHAPE "Cold Formed C"\s+D 160 B 60 T 3 LIP 15 MIRROR2 "Yes"/);
    fila("e2k: correa = FRAMESECTION «Cold Formed C» D160 B60 T3 LIP15 MIRROR2 Yes, A36", sec ? "si" : "NO", "si", !!sec);
    const sh = txt.match(/SHELLPROP\s+"Cubierta metalica"\s+PROPTYPE\s+"Slab"\s+MATERIAL "A36"\s+MODELINGTYPE "Membrane"\s+ONEWAYLOADDIST "Yes"\s+SLABTYPE "Slab"\s+SLABTHICKNESS 4\b/);
    fila("e2k: cubierta = SHELLPROP «Cubierta metalica» Membrane A36 de 4 mm, ONEWAYLOADDIST Yes", sh ? "si" : "NO", "si", !!sh);
    const usa = [...txt.matchAll(/LINEASSIGN\s+"B\d+"\s+"[^"]+"\s+SECTION\s+"([^"]+)"/g)].reduce((o, m) => (o[m[1]] = (o[m[1]] ?? 0) + 1, o), {});
    fila("e2k: barras por seccion (42 correas 1G + 12 VP en LINEASSIGN B; + 4 columnas)", JSON.stringify(usa), "1G 42, VP 12", usa["1G 160x60x15x3IZQ"] === 42 && usa["VP I530X15+I150X6"] === 12);
    const nlc = (txt.match(/LINECONSTRAINT\s+"No"/g) ?? []).length;
    fila("e2k: LINECONSTRAINT «No» en los 6 panos (membrana sin atar a los nudos de la correa)", String(nlc), "6", nlc === 6);
    const M = await medirPortico(mod, "P3", ["Dead"]);
    const heks = readFileSync(M.heks, "utf-8").split("\n");
    const cor = heks.find((l) => l.includes("# 1G 160x60x15x3IZQ")).split(/\s+/);
    const A = +cor[5], J = +cor[8], t = 0.003;
    fila("Hek: correa 1G tiene area de perfil C con labios (A/t = longitud de la linea media 290..300 mm) y J = A·t²/3", `A=${(A * 1e6).toFixed(1)} mm2, A/t=${(A / t * 1e3).toFixed(1)} mm, J=${(J * 1e12).toFixed(0)} mm4 (A·t²/3=${(A * t * t / 3 * 1e12).toFixed(0)})`, "290 <= A/t <= 300, J=A·t²/3 (1 %)",
      A / t * 1e3 > 290 && A / t * 1e3 < 300 && Math.abs(J - A * t * t / 3) / J < 0.01, "perfil de pared delgada (no una caja ni una barra generica)");
    const sh1 = heks.find((l) => /^shell 59 /.test(l)).split(/\s+/), mod1 = heks.find((l) => /^shellmod 59 /.test(l)).split(/\s+/).slice(2).map(Number);
    fila("Hek: membrana = shell de 4 mm con E de A36 (199948 MPa) y rigidez de flexion 0", `t=${sh1[6] * 1e3} mm, E=${sh1[7] / 1e3} MPa, shellmod ${mod1.join(" ")}`, "t 4, E 199948, f11=f22=f12=1, flexion 0",
      Math.abs(sh1[6] - 0.004) < 1e-9 && Math.abs(sh1[7] - 199948000) < 1 && mod1.slice(0, 3).every((v) => v === 1) && mod1[3] === 0 && mod1[4] === 0 && mod1[5] === 0, "membrana pura (ETABS «Membrane»)");
    fila("Hek: `deck sinpartir` (LINECONSTRAINT No)", heks.some((l) => l.startsWith("deck sinpartir")) ? "si" : "NO", "si", heks.some((l) => l.startsWith("deck sinpartir")));
  }

  // ---- 1) variantes: geometria, desplazamientos, reacciones, fuerzas de barra ----
  const R = {};
  for (const [nom, titulo] of VARIANTES) {
    const ref = leerRef(nom), M = await medirPortico(mod, nom, pats), B = await medirBarras(mod, nom, ["Dead", "Live", "LATX", "LATY"]);
    R[nom] = { M, B, ref };
    const P = (n) => Object.values(ref.pts).find((p) => Math.abs(p[0] - n[0]) < 1e-6 && Math.abs(p[1] - n[1]) < 1e-6 && Math.abs(p[2] - n[2]) < 1e-6);
    const esq = [[0, 0], [6, 0], [0, 6], [6, 6]].map(([x, y]) => [x, y, y === 0 ? ZY[nom][0] : ZY[nom][1]]);
    fila(`${titulo}: nudos de esquina de la cubierta (0,0)(6,0) a z=${ZY[nom][0]} · (0,6)(6,6) a z=${ZY[nom][1]} m existen en ETABS`, esq.map((p) => p.join(",")).join(" | "), "los 4 existen",
      esq.every((p) => !!P(p)), "bases en z=0");
    fila(`${titulo}: todos los nudos de ETABS (${Object.keys(ref.pts).length}) existen en Hekatan (${M.nNodes}) en la misma coordenada`, `${Math.max(...pats.map((p) => M.pat[p].sinNodo))} sin nudo`, "0", pats.every((p) => M.pat[p].sinNodo === 0));
    for (const pat of pats) {
      const d = M.pat[pat], lim = { Dead: [0.01, 0.03, 0.06], Live: [0.01, 0.03, 0.06], LATX: [1.7, 0.9, 0.03], LATY: [0.01, 0.01, 0.04] }[pat];
      const ux = d.eMax.map((e, k) => `${f(e, 2)}/${f(d.hAt[k], 2)}`).join("  ");
      fila(`${titulo} ${pat}: |U| max (mm) ETABS/Hek en el nudo del maximo, Ux  Uy  Uz`, ux, "dif del maximo <= 2.5 % (+0.01 mm)", d.eMax.every((e, k) => Math.abs(d.hAt[k] - e) <= 0.025 * Math.abs(e) + 0.01), "ver tabla");
      fila(`${titulo} ${pat}: peor nudo |dUx|/|dUy|/|dUz| (mm)`, d.peor.map((x) => f(x, 4)).join(" / "), `<= ${lim.join(" / ")}`, d.peor.every((x, k) => x <= lim[k]));
      fila(`${titulo} ${pat}: suma de reacciones Fx/Fy/Fz (kN) Hek vs ETABS`, `${d.Rtot.map((x) => f(x, 3)).join(" / ")} vs ${d.Etot.map((x) => f(x, 3)).join(" / ")}`, "|dif| <= 0.005 kN", d.Rtot.every((x, k) => Math.abs(x - d.Etot[k]) <= 0.005), pat === "Dead" || pat === "Live" ? "Fx=Fy=0: la pendiente no mete empuje horizontal neto" : "");
      const eAp = d.apoyos.map((a) => Math.max(...a.h.map((x, k) => Math.abs(x - a.e[k]))));
      const lAp = pat === "LATX" || pat === "LATY" ? 0.045 : 0.01;
      fila(`${titulo} ${pat}: reacciones por apoyo (4), error maximo de Fx/Fy/Fz (kN)`, f(Math.max(...eAp), 4), `<= ${lAp}`, Math.max(...eAp) <= lAp);
    }
    const resum = (pat) => resumenFuerzas(B[pat]);
    for (const pat of ["Dead", "Live"]) {
      const rs = resum(pat), c = rs.correa, v = rs.VP;
      fila(`${titulo} ${pat}: correa M3 / V2 (extremo cara / media luz), % del pico`, `${f(c.M3.pctExt, 2)} / ${f(c.M3.pctMid, 2)} · ${f(c.V2.pctExt, 2)} / ${f(c.V2.pctMid, 2)} (pico ${f(c.M3.pico, 3)} kN·m, ${f(c.V2.pico, 3)} kN)`, "M3 <= 0.3 %, V2 <= 0.3 %",
        c.M3.pctExt <= 0.3 && c.M3.pctMid <= 0.3 && c.V2.pctExt <= 0.3 && c.V2.pctMid <= 0.3);
      fila(`${titulo} ${pat}: VP M3 / V2, % del pico`, `${f(v.M3.pctExt, 2)} / ${f(v.M3.pctMid, 2)} · ${f(v.V2.pctExt, 2)} / ${f(v.V2.pctMid, 2)} (pico ${f(v.M3.pico, 3)} kN·m, ${f(v.V2.pico, 3)} kN)`, "M3 <= 0.3 %, V2 <= 1.0 %",
        v.M3.pctExt <= 0.3 && v.M3.pctMid <= 0.3 && v.V2.pctExt <= 1.0 && v.V2.pctMid <= 1.0, pat === "Dead" ? "V2 de la VP: peso propio 0.7 %" : "");
      fila(`${titulo} ${pat}: axil de la correa (Q/2·sen θ), error absoluto (kN, pico ETABS ${f(c.P.pico, 3)})`, f(Math.max(c.P.errExt, c.P.errMid), 4), "<= 0.003 kN", Math.max(c.P.errExt, c.P.errMid) <= 0.003);
    }
    { const rs = resum("LATX"), c = rs.correa, v = rs.VP;
      fila(`${titulo} LATX: correa axil (kN) pico ETABS ${f(c.P.pico, 2)}, error`, f(Math.max(c.P.errExt, c.P.errMid), 3), "<= 0.07 kN (1.3 %)", Math.max(c.P.errExt, c.P.errMid) <= 0.07);
      fila(`${titulo} LATX: VP M3 / V2 % del pico (VP y=0 flexion en el plano)`, `${f(v.M3.pctExt, 2)} / ${f(v.M3.pctMid, 2)} · ${f(v.V2.pctExt, 2)} / ${f(v.V2.pctMid, 2)}`, "<= 0.3 %", v.M3.pctExt <= 0.3 && v.M3.pctMid <= 0.3 && v.V2.pctExt <= 0.3 && v.V2.pctMid <= 0.3);
      fila(`${titulo} LATX: ABIERTO axil de la VP de y=6 (cortante de membrana al borde cargado): pico ETABS ${f(v.P.pico, 2)} kN`, `Hek ${f(picos(B.LATX, "VP", "P").hExt, 2)} (error ${f(v.P.errExt, 2)} kN)`, "<= 1.1 kN (no empeora)", v.P.errExt <= 1.1, "la membrana reparte el cortante a los nudos del borde con otro patron que ETABS; desplazamientos y reacciones si casan");
    }
    tabla.push({ nom: titulo, zy: ZY[nom], dd: M.pat, B });
  }

  // ---- 2) plana vs pendiente: lo que cambia con la pendiente, igual en ETABS y en Hek ----
  const nn = ["plana", "P3", "P10"];
  { const z = nn.map((n) => R[n].M.pat.Dead);
    fila("Dead: Uz max (mm) plana/3 %/10 %, ETABS", z.map((d) => f(d.eMax[2], 2)).join(" / "), "ref", true);
    fila("Dead: Uz max (mm) plana/3 %/10 %, Hek (mismo nudo)", z.map((d) => f(d.hAt[2], 2)).join(" / "), "dif <= 0.1 mm con ETABS", z.every((d) => Math.abs(d.hAt[2] - d.eMax[2]) <= 0.1)); }
  { const e = nn.map((n) => R[n].M.pat.Dead.Etot[2]), h = nn.map((n) => R[n].M.pat.Dead.Rtot[2]);
    fila("Dead: Fz total (kN) plana/3 %/10 %, ETABS vs Hek (la superficie inclinada pesa mas)", `${e.map((x) => f(x, 3)).join("/")} vs ${h.map((x) => f(x, 3)).join("/")}`, "|dif| <= 0.005 kN", e.every((x, i) => Math.abs(x - h[i]) <= 0.005), "area 3D en el reparto de la losa (antes -0.30 % a 10 %)");
    const l = nn.map((n) => [R[n].M.pat.Live.Etot[2], R[n].M.pat.Live.Rtot[2]]);
    fila("Live: Fz total (kN) = q·A3D (0.68647·36·√(1+s²)) plana/3 %/10 %, ETABS vs Hek", `${l.map((x) => f(x[0], 3)).join("/")} vs ${l.map((x) => f(x[1], 3)).join("/")}`, "|dif| <= 0.002 kN", l.every((x) => Math.abs(x[0] - x[1]) <= 0.002), "antes Hek 24.713 en las tres (area proyectada): 10 % -0.5 %"); }
  { const px = nn.map((n) => { const a = R[n].M.pat.LATX.apoyos[0]; return [a.e, a.h]; });
    fila("LATX: reaccion Fz de los apoyos de y=0 (par de vuelco, kN) ETABS vs Hek: crece con la pendiente (columna mas larga)", `${px.map((x) => f(Math.abs(x[0][2]), 3)).join("/")} vs ${px.map((x) => f(Math.abs(x[1][2]), 3)).join("/")}`, "|dif| <= 0.005", px.every((x) => Math.abs(x[0][2] - x[1][2]) <= 0.005)); }

  if (process.env.PORTICO_TABLA) imprimirTabla(tabla, f);
  return filas;
}

function imprimirTabla(tabla, f) {
  const o = (s) => process.stderr.write(s + "\n");
  o("\n| Magnitud | " + tabla.map((t) => `${t.nom} ETABS | ${t.nom} Hek`).join(" | ") + " |");
  o("|---|" + tabla.map(() => "---|---").join("|") + "|");
  const row = (n, g) => o(`| ${n} | ${tabla.map((t) => g(t)).join(" | ")} |`);
  for (const pat of ["Dead", "Live"]) {
    row(`${pat} Uz max mm (nudo)`, (t) => { const d = t.dd[pat]; return `${f(d.eMax[2], 2)} (${d.nodo[2].map((x) => +x.toFixed(2)).join(",")}) | ${f(d.hAt[2], 2)}`; });
    row(`${pat} Ux / Uy max mm`, (t) => { const d = t.dd[pat]; return `${f(d.eMax[0], 2)} / ${f(d.eMax[1], 2)} | ${f(d.hAt[0], 2)} / ${f(d.hAt[1], 2)}`; });
    row(`${pat} peor nudo dUz mm`, (t) => `- | ${f(t.dd[pat].peor[2], 3)}`);
    row(`${pat} Fz total kN`, (t) => `${f(t.dd[pat].Etot[2], 3)} | ${f(t.dd[pat].Rtot[2], 3)}`);
    row(`${pat} apoyo (0,0,0): Fx / Fz ; apoyo (0,6,0): Fz kN`, (t) => { const a = t.dd[pat].apoyos; return `${f(a[0].e[0], 3)} / ${f(a[0].e[2], 3)} ; ${f(a[1].e[2], 3)} | ${f(a[0].h[0], 3)} / ${f(a[0].h[2], 3)} ; ${f(a[1].h[2], 3)}`; });
  }
  for (const pat of ["LATX", "LATY"]) {
    row(`${pat} Ux / Uy max mm`, (t) => { const d = t.dd[pat]; return `${f(d.eMax[0], 2)} / ${f(d.eMax[1], 2)} | ${f(d.hAt[0], 2)} / ${f(d.hAt[1], 2)}`; });
    row(`${pat} peor nudo dUx / dUy mm`, (t) => `- | ${f(t.dd[pat].peor[0], 3)} / ${f(t.dd[pat].peor[1], 3)}`);
    row(`${pat} Fx / Fy / Fz suma kN`, (t) => { const d = t.dd[pat]; return `${d.Etot.map((x) => f(x, 2)).join("/")} | ${d.Rtot.map((x) => f(x, 2)).join("/")}`; });
    row(`${pat} apoyo (0,0,0) Fx / Fy / Fz kN`, (t) => { const a = t.dd[pat].apoyos[0]; return `${a.e.map((x) => f(x, 3)).join("/")} | ${a.h.map((x) => f(x, 3)).join("/")}`; });
  }
  for (const [pat, cls, c, nm] of [["Dead", "correa", "M3", "Dead correa M3 kN·m ext/media"], ["Dead", "correa", "V2", "Dead correa V2 kN ext/media"], ["Dead", "correa", "P", "Dead correa P kN ext/media"],
    ["Live", "correa", "M3", "Live correa M3 ext/media"], ["Live", "correa", "V2", "Live correa V2 ext/media"], ["Live", "correa", "P", "Live correa P ext/media"],
    ["Dead", "VP", "M3", "Dead VP M3 ext/media"], ["Dead", "VP", "V2", "Dead VP V2 ext/media"], ["Live", "VP", "M3", "Live VP M3 ext/media"], ["Live", "VP", "V2", "Live VP V2 ext/media"],
    ["LATX", "correa", "P", "LATX correa P ext/media"], ["LATX", "VP", "M3", "LATX VP M3 ext/media"], ["LATX", "VP", "V2", "LATX VP V2 ext/media"], ["LATX", "VP", "P", "LATX VP P ext/media"]])
    row(nm, (t) => { const p = picos(t.B[pat], cls, c); return `${f(p.eExt, 3)} / ${f(p.eMid, 3)} | ${f(p.hExt, 3)} / ${f(p.hMid, 3)}`; });
}
