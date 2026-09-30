/**
 * Los MOMENTOS de una placa Q4, no solo su flecha.
 *
 * `safe_ex01_placa` ya validaba la FLECHA contra Navier y contra SAFE, y pasaba.
 * Por eso este fallo llevaba ahi sin verse: la placa se deformaba bien y al
 * preguntarle que momento tenia contestaba cualquier cosa.
 *
 * `computeQ4ShellStresses` calculaba las curvaturas como
 *
 *     kappaXX = -d(theta_x)/dx        kappaYY = -d(theta_y)/dy
 *
 * o sea las derivadas CRUZADAS. Con los giros de verdad —theta_x es el giro
 * ALREDEDOR del eje x, asi que dw/dx = theta_y y dw/dy = -theta_x— eso vale
 * +w,xy y -w,xy: dos numeros IGUALES Y OPUESTOS, y nulos en el centro de una
 * placa por simetria. Se estaba midiendo la torsion y llamandola flexion.
 *
 * Medido antes del arreglo, placa 4x4 apoyada con q = -10:
 *
 *     centro:            M11 = 0.0000   M22 =  0.0000   (Navier: -7.0724)
 *     cascara de esquina: M11 = 4.7608   M22 = -4.7608
 *
 * El arbitro es la serie de NAVIER de la placa cuadrada simplemente apoyada con
 * carga uniforme, que es solucion cerrada. Y se comprueban tres cosas que juntas
 * no dejan pasar el fallo:
 *
 *   1. el valor en el centro contra Navier,
 *   2. que M12 sea CERO en el centro (por simetria) — con el fallo el centro se
 *      llevaba la torsion y salia al reves,
 *   3. que el momento CREZCA del borde apoyado al centro. Con el fallo el perfil
 *      salia plano a cero por dentro y con los picos en las esquinas, que es
 *      justo lo contrario de lo que hace una placa.
 */
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { resolverHeks } from "../lib/heks.mjs";

const A = 4.0;            // m, placa cuadrada
const N = 8;              // malla NxN
const T = 0.2;            // m
const E = 2.2e7;          // kPa
const NU = 0.2;
const Q = -10.0;          // kN/m2

/** Serie de Navier: flecha y momentos en el centro de la placa apoyada. */
function navier() {
  const D = (E * T ** 3) / (12 * (1 - NU * NU));
  let w = 0, mx = 0;
  for (let m = 1; m < 60; m += 2) {
    for (let n = 1; n < 60; n += 2) {
      const k = (m / A) ** 2 + (n / A) ** 2;
      const s = Math.sin((m * Math.PI) / 2) * Math.sin((n * Math.PI) / 2);
      w += s / (m * n * k * k);
      mx += ((m / A) ** 2 + NU * (n / A) ** 2) * s / (m * n * k * k);
    }
  }
  return {
    w: (w * 16 * Q) / (Math.PI ** 6 * D),
    // signo de CSI (8-sep-2026): M11 positivo = traccion abajo, o sea el centro
    // de una placa apoyada bajo carga hacia abajo (Q < 0) sale POSITIVO
    mx: -(mx * 16 * Q) / Math.PI ** 4,
  };
}

export const nombre = "placa-momentos-navier";
export const descripcion =
  "Los MOMENTOS de la placa Q4 contra la serie de Navier, no solo la flecha";

async function resolver(thin) {
  const dir = mkdtempSync(join(tmpdir(), "hkPlaca-"));
  const L = [];
  const id = new Map();
  const k = (i, j) => `${i},${j}`;
  for (let i = 0; i <= N; i++)
    for (let j = 0; j <= N; j++) {
      id.set(k(i, j), id.size + 1);
      L.push(`node ${id.get(k(i, j))} ${(i * A) / N} ${(j * A) / N} 0`);
    }
  let ns = 0;
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      ns++;
      L.push(`shell ${ns} ${id.get(k(i, j))} ${id.get(k(i + 1, j))} ` +
             `${id.get(k(i + 1, j + 1))} ${id.get(k(i, j + 1))} ${T} ${E} ${NU} 0`);
      if (thin) L.push(`shelltype ${ns} thin`);
      L.push(`areaload ${ns} ${Q}`);
    }
  for (let i = 0; i <= N; i++)
    for (let j = 0; j <= N; j++)
      if (i === 0 || i === N || j === 0 || j === N)
        L.push(`support ${id.get(k(i, j))} 0 0 1 0 0 0`);
  // el plano y el giro Rz hay que sujetarlos aparte: una placa apoyada solo en
  // Uz es un mecanismo en membrana
  L.push(`support ${id.get(k(0, 0))} 1 1 1 0 0 1`);
  L.push(`support ${id.get(k(N, 0))} 0 1 1 0 0 1`);
  L.push("solve");

  const ruta = join(dir, "placa.heks");
  writeFileSync(ruta, L.join("\n") + "\n", "utf-8");
  return resolverHeks(ruta);
}

/**
 * Joint a joint contra SAP2000 (AreaForceShell: M11 M22 M12 en los 4 joints de cada cascara, sin
 * promediar) contra bendingXXjoint de analyze(). Devuelve el peor en % del |M| maximo y el M11 medio
 * de SAP en el nudo central.
 */
function vsSap(r, archivo, c) {
  const nodes = r.nodes, a = r.analyzeOutputs ?? {};
  const S = JSON.parse(readFileSync(new URL(`../datos/${archivo}`, import.meta.url), "utf-8").replace(/NaN/g, "null"));
  const porNombre = new Map(S.puntos.map((p) => [p.n, p]));
  const k3 = (x, y, z) => [x, y, z].map((v) => Math.round(v * 1000)).join(",");
  const idx = new Map();
  r.elements.forEach((el, i) => { if (el.length === 4) idx.set(k3(...[0, 1, 2].map((d) => el.reduce((s, n) => s + nodes[n][d], 0) / 4)), i); });
  let nJ = 0, peor = 0, maxM = 1e-12, centroS = null;
  const enNudoS = new Map();
  for (const ar of S.areas || []) {
    const pts = ar.pts.map((p) => porNombre.get(p)).filter(Boolean); if (pts.length !== 4) continue;
    const cc = [0, 1, 2].map((d) => pts.reduce((s, p) => s + [p.x, p.y, p.z][d], 0) / 4);
    const i = idx.get(k3(...cc)), fe = (S.shells || {})[ar.n]; if (i === undefined || !fe) continue;
    const el = r.elements[i];
    const hj = [a.bendingXXjoint?.get(i), a.bendingYYjoint?.get(i), a.bendingXYjoint?.get(i)]; if (!hj[0]) continue;
    for (const v of fe) {
      const p = porNombre.get(v[0]); const pos = el.findIndex((n) => k3(...nodes[n]) === k3(p.x, p.y, p.z)); if (pos < 0) continue;
      nJ++;
      for (const [q, k] of [[0, 4], [1, 5], [2, 6]]) { maxM = Math.max(maxM, Math.abs(v[k])); peor = Math.max(peor, Math.abs(v[k] - hj[q][pos])); }
      const kn = k3(...nodes[el[pos]]); (enNudoS.get(kn) ?? enNudoS.set(kn, []).get(kn)).push(v[4]);
    }
  }
  const l = enNudoS.get(k3(c, c, 0)); if (l) centroS = l.reduce((s, q) => s + q, 0) / l.length;
  return { nJ, peorPct: nJ ? (100 * peor) / maxM : NaN, maxM, centroS };
}

export async function correr() {
  const r = await resolver(false);

  // momento medio en cada nudo, de las cascaras que lo tocan
  const nodes = r.nodes;
  const a = r.analyzeOutputs ?? {};
  const enNudo = new Map();
  r.elements.forEach((el, i) => {
    if (el.length !== 4) return;
    for (const campo of ["bendingXX", "bendingYY", "bendingXY"]) {
      const v = a[campo]?.get?.(i);
      if (!v) continue;
      el.forEach((n, p) => {
        const c = nodes[n];
        const cl = `${campo}|${c[0].toFixed(3)},${c[1].toFixed(3)}`;
        if (!enNudo.has(cl)) enNudo.set(cl, []);
        enNudo.get(cl).push(v[p]);
      });
    }
  });
  const val = (campo, x, y) => {
    const v = enNudo.get(`${campo}|${x.toFixed(3)},${y.toFixed(3)}`);
    return v && v.length ? v.reduce((s, q) => s + q, 0) / v.length : NaN;
  };

  const teo = navier();
  const filas = [];
  const c = A / 2;

  // 1) el valor en el centro contra Navier. Con malla 8x8 el valor en el NUDO
  //    central (media de los joints de las 4 cascaras que lo tocan, como lo lista
  //    CSI) se pasa un 4.9 % de la serie: SAP2000 24 da exactamente lo mismo
  //    (7.4169 contra 7.4170, ver la fila 5), asi que es la malla, no el motor.
  //    Hasta el 8-sep-2026 aqui se comparaba el centroide repartido a nudos
  //    (2 % corto) y con el signo de la curvatura del solver, al reves que CSI.
  const mx = val("bendingXX", c, c);
  const d1 = (100 * (mx - teo.mx)) / teo.mx;
  filas.push({
    que: "M11 en el centro vs Navier",
    medido: d1, limite: 6.0,
    ok: Number.isFinite(d1) && Math.abs(d1) <= 6.0,
    detalle: `${mx.toFixed(4)} vs ${teo.mx.toFixed(4)} kN.m/m (con el fallo: 0.0000; SAP2000 8x8: 7.4169)`,
  });

  // 2) M12 tiene que ser CERO en el centro, por simetria. Con el fallo el centro
  //    se llevaba justo la torsion.
  const mxy = val("bendingXY", c, c);
  const ref = Math.abs(teo.mx);
  const d2 = (100 * mxy) / ref;
  filas.push({
    que: "M12 en el centro = 0 (simetria)",
    medido: d2, limite: 1.0,
    ok: Number.isFinite(d2) && Math.abs(d2) <= 1.0,
    detalle: `${mxy.toFixed(4)} kN.m/m, en %% de ${ref.toFixed(3)}`,
  });

  // 3) LA QUE DECIDE la FORMA: el momento crece del borde apoyado al centro.
  //    Con el fallo el perfil salia plano a cero por dentro y con los picos en
  //    las esquinas — lo contrario de lo que hace una placa.
  // un nudo hacia dentro del borde apoyado: ahi el momento tiene que ser
  // claramente menor que en el centro. (El propio borde no vale de referencia:
  // el valor recuperado ahi es el del centroide de la cascara de borde.)
  const borde = Math.abs(val("bendingXX", A / N, c) || 0);
  const centro = Math.abs(mx);
  const razon = borde > 1e-12 ? centro / borde : Infinity;
  filas.push({
    que: "el momento crece del borde al centro",
    medido: razon, limite: 1.5,
    ok: Number.isFinite(razon) && razon >= 1.5,
    detalle: `centro ${centro.toFixed(3)} contra borde ${borde.toFixed(3)} (razon ${razon.toFixed(2)}, hace falta > 1.5)`,
  });

  // 5) SAP2000 (el JUEZ), la misma placa por .s2k, joint a joint.
  //    · Shell-THIN: la DKQ de Hekatan es la de CSI (Batoz & Tahar) -> tiene que dar 0.000 %.
  //    · Shell-THICK: hasta el 15-sep-2026 daba 0.026 % con una placa gruesa AJUSTADA a CSI; se retiro
  //      (decision de Jorge: solo formulaciones publicadas, cecc37905). Con la MITC4 + modos de Wilson
  //      publicada queda 2.9 % en el nudo central y 43 % en el peor joint: INCONCLUSO y escrito, no
  //      tapado. El tope es lo medido el 29-sep-2026, para que avise si EMPEORA.
  {
    const rt = await resolver(true);
    const mxT = (() => {
      const e = new Map();
      rt.elements.forEach((el, i) => { const v = rt.analyzeOutputs?.bendingXX?.get?.(i); if (!v) return;
        el.forEach((n, p) => { const q = rt.nodes[n]; if (Math.abs(q[0] - c) < 1e-6 && Math.abs(q[1] - c) < 1e-6) e.set(i, v[p]); }); });
      const v = [...e.values()]; return v.reduce((s, q) => s + q, 0) / v.length;
    })();
    const t = vsSap(rt, "placa_navier_thin_sap2000.json", c);
    filas.push({
      que: "Shell-THIN: joints M11/M22/M12 vs SAP2000",
      medido: t.peorPct, limite: 0.1,
      ok: Number.isFinite(t.peorPct) && t.peorPct <= 0.1 && t.nJ >= 256,
      detalle: `${t.nJ} joints, peor ${t.peorPct.toFixed(4)} % del |M| max ${t.maxM.toFixed(3)}`,
    });
    const dT = t.centroS != null ? (100 * (mxT - t.centroS)) / t.centroS : NaN;
    filas.push({
      que: "Shell-THIN: M11 en el nudo central vs SAP2000",
      medido: dT, limite: 0.1,
      ok: Number.isFinite(dT) && Math.abs(dT) <= 0.1,
      detalle: `${mxT.toFixed(4)} vs ${t.centroS != null ? t.centroS.toFixed(4) : "?"}`,
    });
    const g = vsSap(r, "placa_navier_sap2000.json", c);
    // flecha nudo a nudo de la gruesa contra SAP2000. La referencia se rehizo el 29-sep-2026: la del 8-sep
    // era de un .s2k con E = 25e6 (el test usa 2.2e7) y salía 12 % «más rígida que la delgada».
    {
      const S = JSON.parse(readFileSync(new URL("../datos/placa_navier_sap2000.json", import.meta.url), "utf-8").replace(/NaN/g, "null"));
      const k2 = (x, y) => `${Math.round(x * 1000)},${Math.round(y * 1000)}`;
      const iN = new Map(r.nodes.map((q, i) => [k2(q[0], q[1]), i]));
      let peor = 0, mw = 0;
      for (const q of S.puntos) { const i = iN.get(k2(q.x, q.y)), d = S.disp_nudos[q.n]; if (i === undefined || !d) continue;
        mw = Math.max(mw, Math.abs(d[2])); peor = Math.max(peor, Math.abs(r.deformOutputs.deformations.get(i)[2] - d[2])); }
      const dw = (100 * peor) / mw;
      filas.push({ que: "Shell-THICK vs SAP2000, flecha nudo a nudo (formulacion publicada != CSI; tope = medido)",
                   medido: dw, limite: 1.5, ok: Number.isFinite(dw) && dw <= 1.5, detalle: `81 nudos, peor ${dw.toFixed(4)} % de ${(mw * 1000).toFixed(4)} mm` });
    }
    filas.push({
      que: "Shell-THICK vs SAP2000, joints (INCONCLUSO: formulacion publicada != CSI; tope = medido)",
      medido: g.peorPct, limite: 45,
      ok: Number.isFinite(g.peorPct) && g.peorPct <= 45 && g.nJ >= 256,
      detalle: `${g.nJ} joints, peor ${g.peorPct.toFixed(4)} % del |M| max ${g.maxM.toFixed(3)}`,
    });
    const d6 = g.centroS != null ? (100 * (mx - g.centroS)) / g.centroS : NaN;
    filas.push({
      que: "Shell-THICK vs SAP2000, M11 nudo central (INCONCLUSO; tope = medido)",
      medido: d6, limite: 3.5,
      ok: Number.isFinite(d6) && Math.abs(d6) <= 3.5,
      detalle: `${mx.toFixed(4)} vs ${g.centroS != null ? g.centroS.toFixed(4) : "?"} (media de los 4 joints de SAP)`,
    });
  }

  // 4) y la FLECHA, que siempre estuvo bien: es el control de que el solver no
  //    se ha movido al arreglar la recuperacion
  let wmin = 0;
  r.deformOutputs?.deformations?.forEach((d) => { wmin = Math.min(wmin, d[2]); });
  const d4 = (100 * (wmin - teo.w)) / teo.w;
  filas.push({
    que: "flecha en el centro vs Navier",
    medido: d4, limite: 4.0,
    ok: Number.isFinite(d4) && Math.abs(d4) <= 4.0,
    detalle: `${(wmin * 1000).toFixed(4)} mm vs ${(teo.w * 1000).toFixed(4)}`,
  });

  return filas;
}
