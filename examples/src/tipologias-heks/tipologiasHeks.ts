/**
 * Tipologías que faltaban (Jorge, 19-sep-2026: «te falta puentes, galpón curvo, galpón a 1 agua,
 * estribo de puente con elemento área, muro de contención sólido y con elementos área…»).
 *
 * Cada plantilla ESCRIBE un .heks y lo resuelve con `cliModeler` — el mismo lector y el mismo
 * solver de los .heks validados contra SAP2000/ETABS/SAFE. No hay motor nuevo: solo geometría,
 * apoyos y cargas. El .heks generado queda en el cuadro «CLI Comandos» para verlo y exportarlo.
 *
 * Unidades kN, m, t/m³. Z hacia arriba. Hormigón E = 25e6 kN/m², ν 0.2, ρ 2.4.
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import { cliModeler } from "../cli-modeler/cliModeler";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

const EC = 25e6, NU = 0.2, RHO = 2.4;

/** Acumulador de .heks con nudos únicos por coordenada. */
class Heks {
  L: string[] = [];
  private ids = new Map<string, number>();
  n = 0; f = 0; s = 0; h = 0;
  nodo(x: number, y: number, z: number) {
    const k = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
    let id = this.ids.get(k);
    if (!id) { id = ++this.n; this.ids.set(k, id); this.L.push(`node ${id} ${+x.toFixed(6)} ${+y.toFixed(6)} ${+z.toFixed(6)}`); }
    return id;
  }
  barra(a: number, b: number, E: number, A: number, I22: number, I33: number, J: number, nom = "") {
    if (a === b) return 0;
    this.f++;
    this.L.push(`frame ${this.f} ${a} ${b} ${E} ${+A.toPrecision(8)} ${+I22.toPrecision(8)} ${+I33.toPrecision(8)} ${+J.toPrecision(8)} ${NU} ${RHO}${nom ? " # " + nom : ""}`);
    return this.f;
  }
  area(a: number, b: number, c: number, d: number, t: number, E = EC) {
    this.s++; this.L.push(`shell ${this.s} ${a} ${b} ${c} ${d} ${t} ${E} 0 ${RHO}`); return this.s;
  }
  solido(p: number[], E = EC) { this.h++; this.L.push(`hex ${this.h} ${p.join(" ")} ${E} ${NU} ${RHO}`); return this.h; }
  /** Se ACUMULA por nudo y se escribe al final: dos líneas `load` al mismo nudo no se suman, la
   *  segunda REEMPLAZA a la primera (así lo lee cliModeler). Al pie de la pantalla caían el empuje
   *  y el peso de la tierra en el mismo nudo y se perdía el empuje de esa fila (41 kN, 19-sep-2026). */
  private cargas = new Map<number, [number, number, number]>();
  carga(n: number, fx: number, fy: number, fz: number) {
    const c = this.cargas.get(n) ?? [0, 0, 0];
    c[0] += fx; c[1] += fy; c[2] += fz;
    this.cargas.set(n, c);
  }
  texto() {
    const cl = [...this.cargas].filter(([, c]) => Math.abs(c[0]) + Math.abs(c[1]) + Math.abs(c[2]) > 1e-12)
      .map(([n, c]) => `load ${n} ${+c[0].toFixed(4)} ${+c[1].toFixed(4)} ${+c[2].toFixed(4)} 0 0 0`);
    return [...this.L, ...cl, "solve"].join("\n") + "\n";
  }
}

const div = (a: number, b: number, n: number) => Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n);
/** Ancho tributario de cada punto de una lista ordenada (medio tramo a cada lado). */
const trib = (v: number[]) => v.map((_, i) => ((i > 0 ? v[i] - v[i - 1] : 0) + (i < v.length - 1 ? v[i + 1] - v[i] : 0)) / 2);
const uniq = (v: number[]) => [...new Set(v.map((x) => +x.toFixed(6)))].sort((a, b) => a - b);
/** Empuje activo de Rankine: Ka = tan²(45° − φ/2). */
const Ka = (phiDeg: number) => Math.tan((45 - phiDeg / 2) * Math.PI / 180) ** 2;

// ─────────────────────────────────────────────────────────────────────
// 1. GALPÓN CURVO y A UN AGUA — el generador de cli/_gen_galpon_acero.mjs (validado contra
//    SAP2000/ETABS el 14-sep-2026) llevado al navegador, sin el mezanine.
// ─────────────────────────────────────────────────────────────────────
const tuboR = (b: number, h: number, tf: number, tw: number) => { const bi = b - 2 * tw, hi = h - 2 * tf; const Am = (b - tw) * (h - tf); return { A: b * h - bi * hi, I33: (b * h ** 3 - bi * hi ** 3) / 12, I22: (h * b ** 3 - hi * bi ** 3) / 12, J: 4 * Am * Am / (2 * (b - tw) / tf + 2 * (h - tf) / tw), D: h, B: b }; };
const rectI = (d: number, bf: number, tf: number, tw: number) => { const hw = d - 2 * tf; return { A: 2 * bf * tf + hw * tw, I33: (bf * d ** 3 - (bf - tw) * hw ** 3) / 12, I22: (2 * tf * bf ** 3 + hw * tw ** 3) / 12, J: (2 * bf * tf ** 3 + hw * tw ** 3) / 3, D: d, B: bf }; };
const canalR = (d: number, bf: number, tf: number, tw: number) => { const hw = d - 2 * tf; const A = 2 * bf * tf + hw * tw; const xc = (2 * bf * tf * bf / 2 + hw * tw * tw / 2) / A; return { A, I33: (bf * d ** 3 - (bf - tw) * hw ** 3) / 12, I22: 2 * (tf * bf ** 3 / 12 + bf * tf * (bf / 2 - xc) ** 2) + hw * tw ** 3 / 12 + hw * tw * (tw / 2 - xc) ** 2, J: (2 * bf * tf ** 3 + hw * tw ** 3) / 3, D: d, B: bf }; };
const dosLR = (d: number, b: number, tf: number, tw: number, s: number) => { const a1 = b * tf, a2 = (d - tf) * tw, A1 = a1 + a2; const yc = (a1 * tf / 2 + a2 * (tf + (d - tf) / 2)) / A1; const xc = (a1 * b / 2 + a2 * tw / 2) / A1; const I33 = 2 * (b * tf ** 3 / 12 + a1 * (tf / 2 - yc) ** 2 + tw * (d - tf) ** 3 / 12 + a2 * (tf + (d - tf) / 2 - yc) ** 2); const Iy1 = tf * b ** 3 / 12 + a1 * (b / 2 - xc) ** 2 + (d - tf) * tw ** 3 / 12 + a2 * (tw / 2 - xc) ** 2; return { A: 2 * A1, I33, I22: 2 * (Iy1 + A1 * (s / 2 + xc) ** 2), J: 2 * (b * tf ** 3 + (d - tf) * tw ** 3) / 3, D: d, B: 2 * b + s }; };

function galponHeks(p: Record<string, number>, tipo: "curvo" | "agua1") {
  const Es = 200e6, nuS = 0.3, rhoS = 7.85;
  const nPort = Math.round(p.nPort), nPan = 2 * Math.round(p.nPan / 2), nLong = 2 * Math.max(1, Math.round(p.nLong / 2));
  const mm = (x: number) => Math.round(x * 1000);
  const SEC = {
    col: { ...tuboR(0.25, 0.25, 0.008, 0.008), nom: "CFT250x250x8", cmd: `cft %ID 0.25 0.25 0.008 0.008 ${EC} 0.2 ${RHO}` },
    vI: { ...rectI(0.20, 0.10, 0.008, 0.005), nom: "I200x100x8x5", cmd: "isec %ID 0.2 0.1 0.008 0.005" },
    cord: { ...canalR(p.dCh, 0.075, 0.0085, 0.0056), nom: `C${mm(p.dCh)}x75x8.5x5.6`, cmd: `canal %ID ${p.dCh} 0.075 0.0085 0.0056` },
    diag: { ...dosLR(0.05, 0.05, 0.005, 0.005, 0.01), nom: "2L50x50x5s10", cmd: "dosl %ID 0.05 0.11 0.005 0.005 0.01" },
  };
  const H = new Heks();
  const barra = (a: number, b: number, S: any) => {
    if (a === b) return;
    H.f++;
    H.L.push(`frame ${H.f} ${a} ${b} ${Es} ${S.A.toPrecision(8)} ${S.I22.toPrecision(8)} ${S.I33.toPrecision(8)} ${S.J.toPrecision(8)} ${nuS} ${rhoS} ${S.D} ${S.B} # ${S.nom}`);
    H.L.push(S.cmd.replace("%ID", String(H.f)));
  };
  const zinc = (a: number, b: number, c: number, d: number) => {
    H.s++; H.L.push(`shell ${H.s} ${a} ${b} ${c} ${d} 0.0008 200000000 0 7.95379`); H.L.push(`shellmod ${H.s} 1 0`);
    if (p.qCub) H.L.push(`areaload ${H.s} ${-Math.abs(p.qCub)}`);
  };
  const L = p.L, xs = Array.from({ length: nPort }, (_, i) => i * p.sep);
  const zSup = tipo === "curvo"
    ? (y: number) => p.hAlero + p.canto + p.flecha * (1 - (2 * y / L - 1) ** 2)
    : (y: number) => p.hAlero + p.canto + p.pend / 100 * y;
  H.L.push(tipo === "curvo"
    ? `# Galpón curvo · luz ${L} m · ${nPort} pórticos cada ${p.sep} m · alero ${p.hAlero} m · flecha ${p.flecha} m`
    : `# Galpón a un agua · luz ${L} m · ${nPort} pórticos cada ${p.sep} m · alero ${p.hAlero} m · pendiente ${p.pend} %`);
  H.L.push("selfweight 1", "meshcross 0");
  const ysP = div(0, L, nPan);
  for (const x of xs) {
    const sup = ysP.map((y) => H.nodo(x, y, zSup(y)));
    const inf = ysP.map((y) => H.nodo(x, y, zSup(y) - p.canto));
    for (const k of [0, nPan]) {
      const b0 = H.nodo(x, ysP[k], 0); H.L.push(`support ${b0} 1 1 1 1 1 1`);
      barra(b0, inf[k], SEC.col); barra(inf[k], sup[k], SEC.col);
    }
    for (let k = 0; k < nPan; k++) {
      barra(sup[k], sup[k + 1], SEC.cord); barra(inf[k], inf[k + 1], SEC.cord);
      if (k < nPan / 2) barra(inf[k], sup[k + 1], SEC.diag); else barra(sup[k], inf[k + 1], SEC.diag);
    }
    for (let k = 1; k < nPan; k++) barra(inf[k], sup[k], SEC.diag);
  }
  const xsF: number[] = [];
  for (let i = 0; i < xs.length - 1; i++) for (let q = 0; q < nLong; q++) xsF.push(xs[i] + q * (xs[i + 1] - xs[i]) / nLong);
  xsF.push(xs[xs.length - 1]);
  const lineas = new Set([0, nPan / 2, nPan]);
  const esPortico = (x: number) => xs.some((u) => Math.abs(u - x) < 1e-9);
  for (let k = 0; k <= nPan; k++) {
    const y = ysP[k], zs = zSup(y), zi = zs - p.canto, cercha = lineas.has(k);
    for (let q = 0; q < xsF.length - 1; q++) {
      const a = xsF[q], b = xsF[q + 1];
      barra(H.nodo(a, y, zs), H.nodo(b, y, zs), cercha ? SEC.cord : SEC.vI);
      if (!cercha) continue;
      barra(H.nodo(a, y, zi), H.nodo(b, y, zi), SEC.cord);
      if (q % nLong < nLong / 2) barra(H.nodo(a, y, zi), H.nodo(b, y, zs), SEC.diag); else barra(H.nodo(a, y, zs), H.nodo(b, y, zi), SEC.diag);
    }
    if (cercha) for (const x of xsF) if (!esPortico(x)) barra(H.nodo(x, y, zi), H.nodo(x, y, zs), SEC.diag);
  }
  for (let q = 0; q < xsF.length - 1; q++) for (let k = 0; k < nPan; k++)
    zinc(H.nodo(xsF[q], ysP[k], zSup(ysP[k])), H.nodo(xsF[q + 1], ysP[k], zSup(ysP[k])),
      H.nodo(xsF[q + 1], ysP[k + 1], zSup(ysP[k + 1])), H.nodo(xsF[q], ysP[k + 1], zSup(ysP[k + 1])));
  return H.texto();
}

// ─────────────────────────────────────────────────────────────────────
// 2. MURO DE CONTENCIÓN en voladizo, la forma de la figura de Jorge (19-sep-2026): pantalla
//    AHUSADA (corona tC arriba, tB en la base; trasdós vertical, intradós inclinado),
//    cimentación con puntera y talón, y DENTELLÓN bajo la zapata. Con ÁREAS (Q4) o con SÓLIDOS
//    (H8), misma geometría, mismo suelo y mismas cargas.
//    Muro a lo largo de X. Trasdós en y = tB/2; la tierra del lado +y (talón).
//    · Empuje de Rankine p(z) = Ka·(γ·(H − z) + q) en el trasdós (hacia −y).
//    · Relleno trasero (γ·H + q) sobre el talón; relleno delantero (γ·hf) sobre la puntera.
//    · Zapata sobre Winkler nodal (ks·A_trib) y ux restringido (fricción a lo largo del muro).
//    · El DESLIZAMIENTO (uy) lo resiste solo el dentellón: uy restringido en su fondo (pasivo).
// ─────────────────────────────────────────────────────────────────────
function geoMuro(p: Record<string, number>) {
  const tB = p.tB, tC = p.tC, H = p.H;
  const esp = (z: number) => tB + (tC - tB) * Math.max(0, z) / H;      // espesor de pantalla a la cota z
  const yF = (z: number) => tB / 2 - esp(z);                             // intradós (cara delantera)
  const h = H / Math.round(p.nz);                                        // tamaño de celda de referencia
  const nTo = Math.max(1, Math.round(p.puntera / h)), nTa = Math.max(2, Math.round(p.talon / h));
  const yD = p.yD, bD = p.bD;
  const ys = uniq([...div(-tB / 2 - p.puntera, -tB / 2, nTo), -tB / 2, 0, tB / 2, ...div(tB / 2, tB / 2 + p.talon, nTa),
    yD - bD / 2, yD, yD + bD / 2]);
  return { tB, tC, H, esp, yF, ys, yD, bD, ka: Ka(p.phi) };
}

function muroAreasHeks(p: Record<string, number>) {
  const Hk = new Heks();
  const g = geoMuro(p), nx = Math.round(p.nx), nz = Math.round(p.nz);
  Hk.L.push(`# Muro de contención (áreas Q4) · H ${p.H} m · largo ${p.Lm} m · corona ${p.tC} / base ${p.tB} m · zapata ${p.tz} m · dentellón ${p.bD}×${p.hD} m · Ka ${g.ka.toFixed(3)}`);
  Hk.L.push("selfweight 1");
  const xs = div(0, p.Lm, nx), tx = trib(xs);
  const z0 = -p.tz / 2;                                                  // plano medio de la zapata
  const zsP = uniq([z0, ...div(0, p.H, nz)]);                            // la pantalla nace en el plano medio de la zapata
  const yM = (z: number) => (g.yF(z) + g.tB / 2) / 2;                    // superficie media de la pantalla (inclinada)
  // pantalla: espesor de la fila = el del centro de la fila
  for (let i = 0; i < nx; i++) for (let k = 0; k < zsP.length - 1; k++) {
    const za = zsP[k], zb = zsP[k + 1];
    Hk.area(Hk.nodo(xs[i], yM(za), za), Hk.nodo(xs[i + 1], yM(za), za), Hk.nodo(xs[i + 1], yM(zb), zb), Hk.nodo(xs[i], yM(zb), zb), +g.esp((za + zb) / 2).toFixed(4));
  }
  // zapata (plano medio z0) — la pantalla llega a ella en y = yM(z0) = 0
  const ys = uniq([...g.ys, yM(z0)]);
  for (let i = 0; i < nx; i++) for (let j = 0; j < ys.length - 1; j++)
    Hk.area(Hk.nodo(xs[i], ys[j], z0), Hk.nodo(xs[i + 1], ys[j], z0), Hk.nodo(xs[i + 1], ys[j + 1], z0), Hk.nodo(xs[i], ys[j + 1], z0), p.tz);
  // dentellón: tabique vertical en y = yD, del plano medio de la zapata al fondo del dentellón
  const zD = div(z0, -p.tz - p.hD, 2);
  for (let i = 0; i < nx; i++) for (let k = 0; k < zD.length - 1; k++)
    Hk.area(Hk.nodo(xs[i], g.yD, zD[k]), Hk.nodo(xs[i + 1], g.yD, zD[k]), Hk.nodo(xs[i + 1], g.yD, zD[k + 1]), Hk.nodo(xs[i], g.yD, zD[k + 1]), g.bD);
  const ty = trib(ys);
  xs.forEach((x, i) => ys.forEach((y, j) => {
    const n = Hk.nodo(x, y, z0);
    Hk.L.push(`spring ${n} uz ${+(p.ks * tx[i] * ty[j]).toFixed(4)}`);
    Hk.L.push(`support ${n} 1 0 0 0 0 0`);
  }));
  xs.forEach((x) => Hk.L.push(`support ${Hk.nodo(x, g.yD, -p.tz - p.hD)} 1 1 0 0 0 0`));
  // empuje en el trasdós, de la cara superior de la zapata (z = 0) a la corona
  const zE = div(0, p.H, nz), tzE = trib(zE);
  xs.forEach((x, i) => zE.forEach((z, k) => Hk.carga(Hk.nodo(x, yM(z), z), 0, -g.ka * (p.gamma * (p.H - z) + p.q) * tx[i] * tzE[k], 0)));
  // rellenos: trasero sobre el talón (y ≥ tB/2), delantero sobre la puntera (y ≤ −tB/2)
  const yT = ys.filter((y) => y >= g.tB / 2 - 1e-9), tyT = trib(yT);
  xs.forEach((x, i) => yT.forEach((y, j) => Hk.carga(Hk.nodo(x, y, z0), 0, 0, -(p.gamma * p.H + p.q) * tx[i] * tyT[j])));
  const yP = ys.filter((y) => y <= -g.tB / 2 + 1e-9), tyP = trib(yP);
  if (p.hf > 0) xs.forEach((x, i) => yP.forEach((y, j) => Hk.carga(Hk.nodo(x, y, z0), 0, 0, -p.gamma * p.hf * tx[i] * tyP[j])));
  return Hk.texto();
}

function muroSolidoHeks(p: Record<string, number>) {
  const Hk = new Heks();
  const g = geoMuro(p), nx = Math.round(p.nx), nz = Math.round(p.nz);
  Hk.L.push(`# Muro de contención (sólidos H8) · H ${p.H} m · largo ${p.Lm} m · corona ${p.tC} / base ${p.tB} m · zapata ${p.tz} m · dentellón ${p.bD}×${p.hD} m · Ka ${g.ka.toFixed(3)}`);
  Hk.L.push("selfweight 1");
  const xs = div(0, p.Lm, nx), tx = trib(xs);
  const zsP = div(0, p.H, nz), zsZ = div(-p.tz, 0, 2), zsD = div(-p.tz - p.hD, -p.tz, 2);
  const ys = g.ys;
  // hexaedro con las caras y = constante por fila de z (la pantalla es ahusada)
  const hex = (x0: number, x1: number, ya0: number, ya1: number, yb0: number, yb1: number, z0: number, z1: number) => Hk.solido([
    Hk.nodo(x0, ya0, z0), Hk.nodo(x1, ya0, z0), Hk.nodo(x1, ya1, z0), Hk.nodo(x0, ya1, z0),
    Hk.nodo(x0, yb0, z1), Hk.nodo(x1, yb0, z1), Hk.nodo(x1, yb1, z1), Hk.nodo(x0, yb1, z1)]);
  const yS = (z: number, j: number) => g.yF(z) + j / 2 * g.esp(z);      // 2 hexaedros en el espesor
  const yDent = [g.yD - g.bD / 2, g.yD, g.yD + g.bD / 2];
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ys.length - 1; j++) for (let k = 0; k < 2; k++) hex(xs[i], xs[i + 1], ys[j], ys[j + 1], ys[j], ys[j + 1], zsZ[k], zsZ[k + 1]);
    for (let j = 0; j < 2; j++) for (let k = 0; k < nz; k++)
      hex(xs[i], xs[i + 1], yS(zsP[k], j), yS(zsP[k], j + 1), yS(zsP[k + 1], j), yS(zsP[k + 1], j + 1), zsP[k], zsP[k + 1]);
    for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++)
      hex(xs[i], xs[i + 1], yDent[j], yDent[j + 1], yDent[j], yDent[j + 1], zsD[k], zsD[k + 1]);
  }
  const ty = trib(ys);
  xs.forEach((x, i) => ys.forEach((y, j) => {
    const n = Hk.nodo(x, y, -p.tz);
    Hk.L.push(`spring ${n} uz ${+(p.ks * tx[i] * ty[j]).toFixed(4)}`);
    Hk.L.push(`support ${n} 1 0 0 0 0 0`);
  }));
  xs.forEach((x) => yDent.forEach((y) => Hk.L.push(`support ${Hk.nodo(x, y, -p.tz - p.hD)} 1 1 0 0 0 0`)));
  // empuje en el trasdós (cara vertical y = tB/2)
  const tzP = trib(zsP);
  xs.forEach((x, i) => zsP.forEach((z, k) => Hk.carga(Hk.nodo(x, g.tB / 2, z), 0, -g.ka * (p.gamma * (p.H - z) + p.q) * tx[i] * tzP[k], 0)));
  const yT = ys.filter((y) => y >= g.tB / 2 - 1e-9), tyT = trib(yT);
  xs.forEach((x, i) => yT.forEach((y, j) => Hk.carga(Hk.nodo(x, y, 0), 0, 0, -(p.gamma * p.H + p.q) * tx[i] * tyT[j])));
  const yP = ys.filter((y) => y <= -g.tB / 2 + 1e-9), tyP = trib(yP);
  if (p.hf > 0) xs.forEach((x, i) => yP.forEach((y, j) => Hk.carga(Hk.nodo(x, y, 0), 0, 0, -p.gamma * p.hf * tx[i] * tyP[j])));
  return Hk.texto();
}

// ─────────────────────────────────────────────────────────────────────
// 3. ESTRIBO DE PUENTE con áreas: pantalla (y = 0), dos aletas (x = 0 y x = B) hacia la
//    tierra (+y), zapata sobre Winkler. Empuje de Rankine en pantalla y aletas; reacción
//    del tablero y frenado en la corona de la pantalla.
// ─────────────────────────────────────────────────────────────────────
function estriboHeks(p: Record<string, number>) {
  const H = new Heks();
  const nx = Math.round(p.nx), nz = Math.round(p.nz), ka = Ka(p.phi);
  H.L.push(`# Estribo de puente (áreas Q4) · ancho ${p.B} m · alto ${p.H} m · aletas ${p.La} m · Rv ${p.Rv} kN · frenado ${p.Fh} kN`);
  H.L.push("selfweight 1");
  const xs = div(0, p.B, nx), zs = div(0, p.H, nz);
  const nyA = Math.max(2, Math.round(p.La / p.B * nx));
  const yA = div(0, p.La, nyA);
  const ys = uniq([...div(-p.puntera, 0, Math.max(1, Math.round(p.puntera / p.B * nx))), ...yA]);
  // pantalla
  for (let i = 0; i < nx; i++) for (let k = 0; k < nz; k++)
    H.area(H.nodo(xs[i], 0, zs[k]), H.nodo(xs[i + 1], 0, zs[k]), H.nodo(xs[i + 1], 0, zs[k + 1]), H.nodo(xs[i], 0, zs[k + 1]), p.t);
  // aletas
  for (const x of [0, p.B]) for (let j = 0; j < nyA; j++) for (let k = 0; k < nz; k++)
    H.area(H.nodo(x, yA[j], zs[k]), H.nodo(x, yA[j + 1], zs[k]), H.nodo(x, yA[j + 1], zs[k + 1]), H.nodo(x, yA[j], zs[k + 1]), p.tAleta);
  // zapata
  for (let i = 0; i < nx; i++) for (let j = 0; j < ys.length - 1; j++) {
    const s = H.area(H.nodo(xs[i], ys[j], 0), H.nodo(xs[i + 1], ys[j], 0), H.nodo(xs[i + 1], ys[j + 1], 0), H.nodo(xs[i], ys[j + 1], 0), p.tz);
  }
  // Winkler NODAL ks·A_tributaria, que es como SAP2000, ETABS y SAFE reparten el muelle de área
  // (∫Nᵢ dA; medido) y lo único que viaja en el .s2k/.e2k/.f2k. Restricción horizontal = fricción.
  { const tX = trib(xs), tY = trib(ys);
    xs.forEach((x, i) => ys.forEach((y, j) => {
      const n = H.nodo(x, y, 0);
      H.L.push(`spring ${n} uz ${+(p.ks * tX[i] * tY[j]).toFixed(4)}`);
      H.L.push(`support ${n} 1 1 0 0 0 1`);
    })); }
  const tx = trib(xs), tzv = trib(zs), tyA = trib(yA);
  const pz = (z: number) => ka * (p.gamma * (p.H - z) + p.q);
  // empuje: pantalla hacia −y; aletas hacia afuera (−x en x = 0, +x en x = B)
  xs.forEach((x, i) => zs.forEach((z, k) => { H.carga(H.nodo(x, 0, z), 0, -pz(z) * tx[i] * tzv[k], 0); }));
  for (const [x, sg] of [[0, -1], [p.B, 1]] as const)
    yA.forEach((y, j) => zs.forEach((z, k) => { H.carga(H.nodo(x, y, z), sg * pz(z) * tyA[j] * tzv[k], 0, 0); }));
  // tierra sobre la zapata entre aletas (y > 0)
  const tyZ = trib(ys);
  xs.forEach((x, i) => ys.forEach((y, j) => { if (y > 1e-9) H.carga(H.nodo(x, y, 0), 0, 0, -(p.gamma * p.H + p.q) * tx[i] * tyZ[j]); }));
  // tablero: reacción vertical y frenado, repartidos en la corona de la pantalla
  const txs = trib(xs);
  xs.forEach((x, i) => H.carga(H.nodo(x, 0, p.H), 0, -p.Fh * txs[i] / p.B, -p.Rv * txs[i] / p.B));
  return H.texto();
}

// ─────────────────────────────────────────────────────────────────────
// 4. PUENTE de LOSA sobre VIGAS, simplemente apoyado. Vigas longitudinales (X) bajo la losa,
//    diafragmas en los apoyos, losa Q4 cosida a las vigas. Un apoyo fijo y otro deslizante.
// ─────────────────────────────────────────────────────────────────────
function puenteHeks(p: Record<string, number>) {
  const H = new Heks();
  const nV = Math.round(p.nVigas), W = (nV - 1) * p.sep + 2 * p.volado;
  H.L.push(`# Puente losa-vigas · luz ${p.L} m · ${nV} vigas ${p.bV}×${p.hV} m cada ${p.sep} m · losa ${p.tL} m · ancho ${W.toFixed(2)} m`);
  H.L.push("selfweight 1");
  const xs = div(0, p.L, Math.round(p.nx));
  const T = tablero(H, p, xs);
  diafragma(H, T, 0, p.hV); diafragma(H, T, p.L, p.hV);
  apoyosLinea(H, T, 0, true); apoyosLinea(H, T, p.L, false);
  return H.texto();
}

// ─────────────────────────────────────────────────────────────────────
// 5. FAMILIA DE PUENTES con un TABLERO común: losa maciza (nVigas = 0) o losa sobre vigas.
//    El tablero va en z = 0, a lo largo de X; ancho en Y. Las pilas y estribos se cuelgan de
//    los mismos nudos del tablero (monolítico, sin aparatos de apoyo).
// ─────────────────────────────────────────────────────────────────────
const rect = (b: number, h: number) => {
  const a = Math.max(b, h), c = Math.min(b, h);
  return { A: b * h, I33: b * h ** 3 / 12, I22: h * b ** 3 / 12, J: a * c ** 3 * (1 / 3 - 0.21 * c / a * (1 - c ** 4 / (12 * a ** 4))) };
};

type Tablero = { W: number; yV: number[]; ys: number[] };
/** Losa (Q4) + vigas longitudinales opcionales + carga CM+CV en la losa. */
function tablero(H: Heks, p: Record<string, number>, xs: number[], ysExtra: number[] = []): Tablero {
  const nV = Math.round(p.nVigas ?? 0);
  const W = nV > 0 ? (nV - 1) * p.sep + 2 * p.volado : p.B;
  const yV = Array.from({ length: nV }, (_, i) => p.volado + i * p.sep);
  const nyL = Math.max(2, Math.round(p.ny ?? 4));
  const ys = uniq(nV > 0 ? [0, ...yV, W, ...yV.slice(0, -1).map((y) => y + p.sep / 2), ...ysExtra] : [...div(0, W, nyL), ...ysExtra]);
  if (nV > 0) {
    const S = rect(p.bV, p.hV);
    for (const y of yV) for (let i = 0; i < xs.length - 1; i++)
      H.barra(H.nodo(xs[i], y, 0), H.nodo(xs[i + 1], y, 0), EC, S.A, S.I22, S.I33, S.J, `VIGA${Math.round(p.bV * 100)}x${Math.round(p.hV * 100)}`);
  }
  const q = Math.abs(p.qCM ?? 0) + Math.abs(p.qCV ?? 0);
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
    const s = H.area(H.nodo(xs[i], ys[j], 0), H.nodo(xs[i + 1], ys[j], 0), H.nodo(xs[i + 1], ys[j + 1], 0), H.nodo(xs[i], ys[j + 1], 0), p.tL);
    if (q) H.L.push(`areaload ${s} ${-q}`);
  }
  return { W, yV, ys };
}
/** Barra transversal (diafragma, viga cabezal) en la sección x, PARTIDA en cada nudo de la losa que
 *  cruza: es monolítica con el tablero. Sin partirla pasaba por encima de los nudos intermedios sin
 *  tocarlos, y SAP2000 (que sí la conecta) daba 0.2–0.5 % distinto justo ahí (19-sep-2026). */
function transversal(H: Heks, T: Tablero, x: number, y0: number, y1: number, S: ReturnType<typeof rect>, nom: string) {
  const ys = T.ys.filter((y) => y >= y0 - 1e-9 && y <= y1 + 1e-9);
  for (let j = 0; j < ys.length - 1; j++) H.barra(H.nodo(x, ys[j], 0), H.nodo(x, ys[j + 1], 0), EC, S.A, S.I22, S.I33, S.J, nom);
}
/** Diafragma transversal entre la primera y la última viga en la sección x. */
function diafragma(H: Heks, T: Tablero, x: number, hV: number) {
  if (T.yV.length > 1) transversal(H, T, x, T.yV[0], T.yV[T.yV.length - 1], rect(0.25, hV * 0.8), "DIAF");
}
/** Apoyos del tablero en una sección: sobre las vigas, o sobre toda la línea si es losa maciza. */
function apoyosLinea(H: Heks, T: Tablero, x: number, fijo: boolean) {
  for (const y of T.yV.length ? T.yV : T.ys) H.L.push(`support ${H.nodo(x, y, 0)} ${fijo ? 1 : 0} 1 1 0 0 0`);
}

function puenteLosaHeks(p: Record<string, number>) {
  const H = new Heks();
  H.L.push(`# Puente losa maciza · luz ${p.L} m · ancho ${p.B} m · losa ${p.tL} m · simplemente apoyada`);
  H.L.push("selfweight 1");
  const xs = div(0, p.L, Math.round(p.nx));
  const T = tablero(H, { ...p, nVigas: 0 }, xs);
  apoyosLinea(H, T, 0, true); apoyosLinea(H, T, p.L, false);
  return H.texto();
}

/** Alcantarilla de cajón: losa superior e inferior y dos muros, a lo largo de X (largo Lb).
 *  Relleno hr sobre la losa superior + sobrecarga; empuje en reposo K0 en los muros; losa
 *  inferior sobre Winkler nodal. */
function alcantarillaHeks(p: Record<string, number>) {
  const H = new Heks();
  H.L.push(`# Alcantarilla de cajón · luz libre ${p.B} m · alto ${p.H} m · largo ${p.Lb} m · relleno ${p.hr} m · K0 ${p.K0}`);
  H.L.push("selfweight 1");
  const xs = div(0, p.Lb, Math.round(p.nx)), ys = div(0, p.B, Math.round(p.ny)), zs = div(0, p.H, Math.round(p.nz));
  const tx = trib(xs), ty = trib(ys), tz = trib(zs);
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      H.area(H.nodo(xs[i], ys[j], 0), H.nodo(xs[i + 1], ys[j], 0), H.nodo(xs[i + 1], ys[j + 1], 0), H.nodo(xs[i], ys[j + 1], 0), p.tInf);
      const s = H.area(H.nodo(xs[i], ys[j], p.H), H.nodo(xs[i + 1], ys[j], p.H), H.nodo(xs[i + 1], ys[j + 1], p.H), H.nodo(xs[i], ys[j + 1], p.H), p.tSup);
      H.L.push(`areaload ${s} ${-(p.gamma * p.hr + p.qCV)}`);
    }
    for (const y of [0, p.B]) for (let k = 0; k < zs.length - 1; k++)
      H.area(H.nodo(xs[i], y, zs[k]), H.nodo(xs[i + 1], y, zs[k]), H.nodo(xs[i + 1], y, zs[k + 1]), H.nodo(xs[i], y, zs[k + 1]), p.tMuro);
  }
  // empuje en reposo p(z) = K0·(γ·(hr + H − z) + q): el muro y = 0 empujado hacia +y, el y = B hacia −y
  xs.forEach((x, i) => zs.forEach((z, k) => {
    const f = p.K0 * (p.gamma * (p.hr + p.H - z) + p.qCV) * tx[i] * tz[k];
    H.carga(H.nodo(x, 0, z), 0, f, 0); H.carga(H.nodo(x, p.B, z), 0, -f, 0);
  }));
  xs.forEach((x, i) => ys.forEach((y, j) => {
    const n = H.nodo(x, y, 0);
    H.L.push(`spring ${n} uz ${+(p.ks * tx[i] * ty[j]).toFixed(4)}`);
    H.L.push(`support ${n} 1 1 0 0 0 1`);
  }));
  return H.texto();
}

/** Puente continuo de varios vanos: tablero losa-vigas sobre pilas (viga cabezal + columnas
 *  empotradas en la base) y apoyos simples en los extremos. */
function puentePilasHeks(p: Record<string, number>) {
  const H = new Heks();
  const nV = Math.round(p.nVanos), nC = Math.round(p.nCol);
  const L = nV * p.Lv;
  const nVig = Math.round(p.nVigas), W = (nVig - 1) * p.sep + 2 * p.volado;
  // columnas repartidas en el ancho, bajo el tablero
  const yC = nC === 1 ? [W / 2] : Array.from({ length: nC }, (_, i) => p.volado + i * (W - 2 * p.volado) / (nC - 1));
  H.L.push(`# Puente continuo · ${nV} vanos de ${p.Lv} m · ${nVig} vigas · pilas de ${nC} columnas ${p.bC}×${p.bC} m, altura ${p.Hp} m`);
  H.L.push("selfweight 1");
  const xs = div(0, L, Math.round(p.nx) * nV);
  const T = tablero(H, p, xs, yC);
  const Sc = rect(p.bC, p.bC), Sk = rect(p.bCab, p.hCab);
  for (let k = 1; k < nV; k++) {
    const x = k * p.Lv;
    // viga cabezal bajo el tablero, en todos los nudos de la línea (vigas y columnas)
    const yCab = uniq([...T.yV, ...yC]);
    transversal(H, T, x, yCab[0], yCab[yCab.length - 1], Sk, "CABEZAL");
    for (const y of yC) {
      const base = H.nodo(x, y, -p.Hp);
      H.barra(base, H.nodo(x, y, 0), EC, Sc.A, Sc.I22, Sc.I33, Sc.J, `COL${Math.round(p.bC * 100)}`);
      H.L.push(`support ${base} 1 1 1 1 1 1`);
    }
  }
  diafragma(H, T, 0, p.hV); diafragma(H, T, L, p.hV);
  apoyosLinea(H, T, 0, true); apoyosLinea(H, T, L, false);
  return H.texto();
}

/** Estribo en el plano x = x0: pantalla (y 0..W, z −He..0), aletas hacia la tierra, zapata a
 *  z = −He sobre Winkler nodal. `s` = +1 si el vano está hacia +x (la tierra hacia −x). */
function estriboEn(H: Heks, p: Record<string, number>, T: Tablero, x0: number, s: 1 | -1) {
  const ka = Ka(p.phi), He = p.He;
  const zs = div(-He, 0, Math.round(p.nzE));
  const nxA = Math.max(2, Math.round(p.La / (p.He / p.nzE)));
  const xA = div(x0, x0 - s * p.La, nxA).sort((a, b) => a - b);
  const xZ = uniq([...div(x0 - s * p.talon, x0, Math.max(2, Math.round(p.talon / (He / p.nzE)))), ...div(x0, x0 + s * p.puntera, Math.max(1, Math.round(p.puntera / (He / p.nzE))))]);
  const ys = T.ys;
  // pantalla
  for (let j = 0; j < ys.length - 1; j++) for (let k = 0; k < zs.length - 1; k++)
    H.area(H.nodo(x0, ys[j], zs[k]), H.nodo(x0, ys[j + 1], zs[k]), H.nodo(x0, ys[j + 1], zs[k + 1]), H.nodo(x0, ys[j], zs[k + 1]), p.tE);
  // aletas (y = 0 y y = W), del lado de la tierra
  for (const y of [0, T.W]) for (let i = 0; i < xA.length - 1; i++) for (let k = 0; k < zs.length - 1; k++)
    H.area(H.nodo(xA[i], y, zs[k]), H.nodo(xA[i + 1], y, zs[k]), H.nodo(xA[i + 1], y, zs[k + 1]), H.nodo(xA[i], y, zs[k + 1]), p.tA);
  // zapata
  for (let i = 0; i < xZ.length - 1; i++) for (let j = 0; j < ys.length - 1; j++)
    H.area(H.nodo(xZ[i], ys[j], -He), H.nodo(xZ[i + 1], ys[j], -He), H.nodo(xZ[i + 1], ys[j + 1], -He), H.nodo(xZ[i], ys[j + 1], -He), p.tz);
  const txZ = trib(xZ), tyZ = trib(ys), tzP = trib(zs), txA = trib(xA);
  xZ.forEach((x, i) => ys.forEach((y, j) => {
    const n = H.nodo(x, y, -He);
    H.L.push(`spring ${n} uz ${+(p.ks * txZ[i] * tyZ[j]).toFixed(4)}`);
    H.L.push(`support ${n} 1 1 0 0 0 1`);
  }));
  // empuje de Rankine: p(z) = Ka·(γ·(0 − z) + q), la tierra llega hasta el nivel del tablero
  const pz = (z: number) => ka * (p.gamma * (-z) + p.q);
  ys.forEach((y, j) => zs.forEach((z, k) => H.carga(H.nodo(x0, y, z), s * pz(z) * tyZ[j] * tzP[k], 0, 0)));
  xA.forEach((x, i) => zs.forEach((z, k) => {
    const f = pz(z) * txA[i] * tzP[k];
    H.carga(H.nodo(x, 0, z), 0, -f, 0); H.carga(H.nodo(x, T.W, z), 0, f, 0);
  }));
  // tierra sobre el talón
  const xT = xZ.filter((x) => s * (x - x0) <= 1e-9), txT = trib(xT);   // talón: del lado de la tierra, x0 incluido
  xT.forEach((x, i) => ys.forEach((y, j) => H.carga(H.nodo(x, y, -He), 0, 0, -(p.gamma * He + p.q) * txT[i] * tyZ[j])));
}

function puenteEstribosHeks(p: Record<string, number>) {
  const H = new Heks();
  const W = (Math.round(p.nVigas) - 1) * p.sep + 2 * p.volado;
  H.L.push(`# Puente integral con estribos · luz ${p.L} m · ${Math.round(p.nVigas)} vigas · ancho ${W.toFixed(2)} m · estribos de ${p.He} m sobre Winkler`);
  H.L.push("selfweight 1");
  const xs = div(0, p.L, Math.round(p.nx));
  const T = tablero(H, p, xs, div(0, W, Math.round(p.ny ?? 4)));
  estriboEn(H, p, T, 0, 1);
  estriboEn(H, p, T, p.L, -1);
  return H.texto();
}

// ─────────────────────────────────────────────────────────────────────
// ExampleDefs: escriben el .heks y delegan en cliModeler (mismo lector y solver)
// ─────────────────────────────────────────────────────────────────────
function def(id: string, name: string, category: string, params: Record<string, any>,
  gen: (p: Record<string, number>) => string, shell = "displacementZ"): ExampleDef {
  return {
    id, name, category, params, gen,
    defaultShellResult: shell,
    availableShellResults: cliModeler.availableShellResults,
    hasModal: true,
    runModal: cliModeler.runModal,
    build(p: any, states: any, mp: any) {
      (window as any).__hekatanCliScript = gen(p);
      cliModeler.build({}, states, mp);
    },
  } as ExampleDef;
}

const CAT_GALPON = "4️⃣ Mixtos · 🏢 Edificios";
const CAT_PUENTE = "4️⃣ Mixtos · 🌉 Puentes e icónicos";
const CAT_MURO = "🧱 Losas y cáscaras";

const paramsGalpon = (tipo: "curvo" | "agua1") => ({
  L: P("Geometría", "Luz (m)", 20, 8, 40, 1),
  nPort: P("Geometría", "N.º de pórticos", 6, 2, 15, 1),
  sep: P("Geometría", "Separación pórticos (m)", 6, 3, 10, 0.5),
  hAlero: P("Geometría", "Altura alero (m)", 6, 3, 12, 0.5),
  ...(tipo === "curvo" ? { flecha: P("Geometría", "Flecha del arco (m)", 2.5, 0.5, 6, 0.25) }
    : { pend: P("Geometría", "Pendiente (%)", 10, 3, 30, 1) }),
  canto: P("Cercha", "Canto cercha (m)", 1.0, 0.4, 2.5, 0.1),
  nPan: P("Cercha", "Paneles (par)", 10, 4, 20, 2),
  nLong: P("Cercha", "Paneles por vano (par)", 2, 2, 6, 2),
  dCh: P("Secciones", "Canal cordón d (m)", 0.2, 0.1, 0.35, 0.025),
  qCub: P("Cargas", "Carga cubierta (kN/m²)", 0.3, 0, 2, 0.05),
});

const paramsTablero = (L: number) => ({
  L: P("Geometría", "Luz (m)", L, 8, 60, 1),
  nVigas: P("Tablero", "N.º de vigas", 4, 2, 8, 1),
  sep: P("Tablero", "Separación vigas (m)", 2.5, 1.5, 4, 0.1),
  volado: P("Tablero", "Volado de losa (m)", 1.0, 0.3, 2, 0.1),
  tL: P("Tablero", "Espesor losa (m)", 0.2, 0.15, 0.35, 0.01),
  bV: P("Tablero", "Ancho viga (m)", 0.4, 0.25, 0.8, 0.05),
  hV: P("Tablero", "Alto viga (m)", 1.3, 0.6, 2.5, 0.05),
  qCM: P("Cargas", "Carga muerta extra (kN/m²)", 2.0, 0, 6, 0.1),
  qCV: P("Cargas", "Carga viva (kN/m²)", 4.8, 0, 12, 0.1),
  nx: P("Malla", "Divisiones por vano", 16, 4, 40, 1),
});

const paramsMuro = {
  H: P("Geometría", "Alto pantalla H (m)", 4, 1.5, 10, 0.25),
  Lm: P("Geometría", "Largo del tramo (m)", 6, 2, 20, 0.5),
  tC: P("Geometría", "Espesor corona (m)", 0.25, 0.15, 0.6, 0.05),
  tB: P("Geometría", "Espesor base pantalla (m)", 0.45, 0.2, 1.2, 0.05),
  tz: P("Geometría", "Espesor zapata (m)", 0.5, 0.25, 1.5, 0.05),
  puntera: P("Geometría", "Puntera (m)", 0.8, 0.2, 3, 0.1),
  talon: P("Geometría", "Talón (m)", 2.0, 0.5, 6, 0.1),
  bD: P("Dentellón", "Ancho dentellón (m)", 0.4, 0.2, 1, 0.05),
  hD: P("Dentellón", "Profundidad dentellón (m)", 0.5, 0.2, 1.5, 0.05),
  yD: P("Dentellón", "Posición (m desde el eje de la pantalla, + hacia el talón)", 0, -1, 2, 0.05),
  gamma: P("Suelo", "γ relleno (kN/m³)", 18, 14, 22, 0.5),
  phi: P("Suelo", "φ (°)", 30, 20, 45, 1),
  q: P("Suelo", "Sobrecarga q (kN/m²)", 10, 0, 50, 1),
  hf: P("Suelo", "Relleno delantero sobre la puntera (m)", 0.6, 0, 2, 0.1),
  ks: P("Suelo", "ks Winkler (kN/m³)", 30000, 5000, 200000, 1000),
  nx: P("Malla", "Divisiones en largo", 6, 2, 20, 1),
  nz: P("Malla", "Divisiones en alto", 8, 2, 20, 1),
};

export const tipologiasHeks: ExampleDef[] = [
  def("galpon-curvo", "Galpón curvo (acero, cercha en arco)", CAT_GALPON, paramsGalpon("curvo"), (p) => galponHeks(p, "curvo")),
  def("galpon-agua1", "Galpón a un agua (acero)", CAT_GALPON, paramsGalpon("agua1"), (p) => galponHeks(p, "agua1")),
  def("puente-losa-vigas", "Puente de losa sobre vigas (áreas + barras)", CAT_PUENTE, {
    L: P("Geometría", "Luz (m)", 20, 8, 40, 1),
    nVigas: P("Geometría", "N.º de vigas", 4, 2, 8, 1),
    sep: P("Geometría", "Separación vigas (m)", 2.5, 1.5, 4, 0.1),
    volado: P("Geometría", "Volado de losa (m)", 1.0, 0.3, 2, 0.1),
    tL: P("Sección", "Espesor losa (m)", 0.2, 0.15, 0.35, 0.01),
    bV: P("Sección", "Ancho viga (m)", 0.4, 0.25, 0.8, 0.05),
    hV: P("Sección", "Alto viga (m)", 1.3, 0.6, 2.5, 0.05),
    qCM: P("Cargas", "Carga muerta extra (kN/m²)", 2.0, 0, 6, 0.1),
    qCV: P("Cargas", "Carga viva (kN/m²)", 4.8, 0, 12, 0.1),
    nx: P("Malla", "Divisiones en luz", 16, 4, 40, 1),
  }, puenteHeks),
  def("puente-losa", "Puente losa maciza (áreas)", CAT_PUENTE, {
    L: P("Geometría", "Luz (m)", 10, 4, 20, 0.5),
    B: P("Geometría", "Ancho (m)", 9, 4, 16, 0.5),
    tL: P("Sección", "Espesor losa (m)", 0.55, 0.3, 1.0, 0.05),
    qCM: P("Cargas", "Carga muerta extra (kN/m²)", 2.0, 0, 6, 0.1),
    qCV: P("Cargas", "Carga viva (kN/m²)", 4.8, 0, 12, 0.1),
    nx: P("Malla", "Divisiones en luz", 12, 4, 40, 1),
    ny: P("Malla", "Divisiones en ancho", 8, 2, 30, 1),
  }, puenteLosaHeks),
  def("puente-alcantarilla", "Puente alcantarilla de cajón (áreas, Winkler)", CAT_PUENTE, {
    B: P("Geometría", "Luz libre (m)", 3, 1, 8, 0.25),
    H: P("Geometría", "Alto libre (m)", 2.5, 1, 6, 0.25),
    Lb: P("Geometría", "Largo del cajón (m)", 10, 3, 30, 0.5),
    tSup: P("Sección", "Losa superior (m)", 0.3, 0.2, 0.8, 0.05),
    tInf: P("Sección", "Losa inferior (m)", 0.35, 0.2, 0.8, 0.05),
    tMuro: P("Sección", "Muros (m)", 0.3, 0.2, 0.8, 0.05),
    hr: P("Suelo", "Relleno encima (m)", 2, 0, 10, 0.25),
    gamma: P("Suelo", "γ relleno (kN/m³)", 19, 14, 22, 0.5),
    K0: P("Suelo", "K0 empuje en reposo", 0.5, 0.3, 1, 0.05),
    qCV: P("Cargas", "Sobrecarga vehicular (kN/m²)", 10, 0, 50, 1),
    ks: P("Suelo", "ks Winkler (kN/m³)", 20000, 5000, 200000, 1000),
    nx: P("Malla", "Divisiones en largo", 10, 2, 30, 1),
    ny: P("Malla", "Divisiones en luz", 6, 2, 20, 1),
    nz: P("Malla", "Divisiones en alto", 5, 2, 20, 1),
  }, alcantarillaHeks),
  def("puente-pilas", "Puente continuo sobre pilas (losa-vigas, cabezal y columnas)", CAT_PUENTE, {
    ...(({ L, ...resto }) => resto)(paramsTablero(20)),   // la luz total = vanos × luz de vano
    nVanos: P("Geometría", "N.º de vanos", 3, 2, 6, 1),
    Lv: P("Geometría", "Luz de cada vano (m)", 20, 8, 40, 1),
    Hp: P("Pilas", "Altura de pila (m)", 8, 3, 25, 0.5),
    nCol: P("Pilas", "Columnas por pila", 2, 1, 4, 1),
    bC: P("Pilas", "Lado columna (m)", 1.0, 0.5, 2.5, 0.05),
    bCab: P("Pilas", "Ancho cabezal (m)", 1.2, 0.6, 2.5, 0.05),
    hCab: P("Pilas", "Alto cabezal (m)", 1.2, 0.6, 2.5, 0.05),
  }, puentePilasHeks),
  def("puente-estribos", "Puente integral con estribos (tablero + pantallas, aletas y zapatas)", CAT_PUENTE, {
    ...paramsTablero(20),
    ny: P("Malla", "Divisiones en ancho", 4, 2, 20, 1),
    He: P("Estribos", "Alto estribo (m)", 6, 2, 12, 0.25),
    La: P("Estribos", "Largo aletas (m)", 4, 1, 10, 0.25),
    tE: P("Estribos", "Espesor pantalla (m)", 0.8, 0.3, 1.5, 0.05),
    tA: P("Estribos", "Espesor aletas (m)", 0.4, 0.2, 1, 0.05),
    tz: P("Estribos", "Espesor zapata (m)", 1.0, 0.5, 2, 0.05),
    talon: P("Estribos", "Talón (m)", 3, 1, 8, 0.25),
    puntera: P("Estribos", "Puntera (m)", 1.5, 0.5, 4, 0.25),
    nzE: P("Malla", "Divisiones en alto estribo", 6, 2, 20, 1),
    gamma: P("Suelo", "γ relleno (kN/m³)", 19, 14, 22, 0.5),
    phi: P("Suelo", "φ (°)", 32, 20, 45, 1),
    q: P("Suelo", "Sobrecarga q (kN/m²)", 12, 0, 50, 1),
    ks: P("Suelo", "ks Winkler (kN/m³)", 40000, 5000, 200000, 1000),
  }, puenteEstribosHeks),
  def("estribo-puente", "Estribo de puente (áreas: pantalla, aletas, zapata)", CAT_PUENTE, {
    B: P("Geometría", "Ancho (m)", 10, 4, 20, 0.5),
    H: P("Geometría", "Alto pantalla (m)", 6, 2, 12, 0.25),
    La: P("Geometría", "Largo aletas (m)", 4, 1, 10, 0.25),
    t: P("Geometría", "Espesor pantalla (m)", 0.6, 0.3, 1.5, 0.05),
    tAleta: P("Geometría", "Espesor aletas (m)", 0.4, 0.2, 1, 0.05),
    tz: P("Geometría", "Espesor zapata (m)", 1.0, 0.5, 2, 0.05),
    puntera: P("Geometría", "Puntera (m)", 1.5, 0.5, 4, 0.1),
    Rv: P("Tablero", "Reacción vertical (kN)", 3000, 0, 20000, 100),
    Fh: P("Tablero", "Frenado (kN)", 300, 0, 3000, 10),
    gamma: P("Suelo", "γ relleno (kN/m³)", 19, 14, 22, 0.5),
    phi: P("Suelo", "φ (°)", 32, 20, 45, 1),
    q: P("Suelo", "Sobrecarga q (kN/m²)", 12, 0, 50, 1),
    ks: P("Suelo", "ks Winkler (kN/m³)", 40000, 5000, 200000, 1000),
    nx: P("Malla", "Divisiones en ancho", 10, 4, 24, 1),
    nz: P("Malla", "Divisiones en alto", 8, 3, 20, 1),
  }, estriboHeks),
  def("muro-contencion-areas", "Muro de contención en voladizo (áreas Q4)", CAT_MURO, paramsMuro, muroAreasHeks),
  def("muro-contencion-solido-winkler", "Muro de contención en voladizo sobre Winkler (sólidos H8)", CAT_MURO, paramsMuro, muroSolidoHeks, "none"),
];

// Para pruebas desde la consola / el agente: el .heks de una tipología con sus defectos.
export function heksDeTipologia(id: string, params: Record<string, number> = {}) {
  const d = tipologiasHeks.find((t) => t.id === id);
  if (!d) return null;
  const p: Record<string, number> = {};
  for (const [k, v] of Object.entries(d.params)) p[k] = (params[k] ?? (v as any).default);
  return (d as any).gen(p) as string;
}
