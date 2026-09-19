/**
 * Vuelca la alcantarilla del ejemplo (o la plantilla) para validarla en SAP2000 y OpenSeesPy:
 *   modelo.json  — nudos, barras (E, G, A, I33, As2), muelles, apoyos, y las cargas de CADA posición
 *   hekatan.json — U (ux, uz, ry por nudo) y el diagrama de barra (P, V2, M3 en i y j) por posición
 * Mismo camino que la app: .heks → cliModeler → lineasDeInfluencia → estadoEnPosicion.
 * uso: node validation/carga-movil/dump_alcantarilla.mjs [plantilla]
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../../tests/lib/bundle.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const m = await empaquetar(`
export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";
export * from "${R}/examples/src/shared/cargaMovil";
export * from "${R}/examples/src/alcantarilla-carga-movil/modeloAlcantarilla";
export { alcantarillaCargaMovil, plantillaAlcantarilla } from "${R}/examples/src/alcantarilla-carga-movil/alcantarillaCargaMovil";
`, "cm-dump");

export async function armar(cual = "ejemplo") {
  const ex = cual === "plantilla" ? m.plantillaAlcantarilla : m.alcantarillaCargaMovil;
  const p = Object.fromEntries(Object.entries(ex.params).map(([k, v]) => [k, v.default]));
  const pm = { nCeldas: p.nCeldas, L: p.L, H: p.H, tSup: p.tSup, tInf: p.tInf, tMuro: p.tMuro,
    E: p.Ekg * 98.0665, nu: p.nu, ks: p.kskg * 9806.65, dx: p.paso, dxInf: p.dxInf, hRelleno: 0, gRelleno: 19 };
  const g = m.modeloAlcantarilla(pm);
  globalThis.window = Object.assign(globalThis.window ?? {}, { __hekatanCliScript: g.heks });
  const st = (v) => ({ val: v, rawVal: v });
  const S = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
  const log = console.log; console.log = () => {};
  m.cliModeler.build({}, S);
  console.log = log;
  const modelo = { nodes: S.nodes.val, elements: S.elements.val, nodeInputs: S.nodeInputs.val, elementInputs: S.elementInputs.val, springs: globalThis.window.__hekatanCliSprings };
  const cam = m.caminoPorCoordenada(modelo.nodes, (n) => Math.abs(n[2] - pm.H) < 1e-6);
  const veh = m.camionHL93({ sepTrasera: p.sep2, IM: p.IM, ancho: p.ancho, conCarril: !!p.carril });
  const xs = m.posiciones(cam, veh, pm.dx);
  const IL = await m.lineasDeInfluencia(modelo, cam);
  return { m, p, pm, g, modelo, cam, veh, xs, IL };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const cual = process.argv[2] ?? "ejemplo";
  const { m: M, p, pm, modelo, cam, veh, xs, IL } = await armar(cual);
  const ei = modelo.elementInputs;
  const casos = M.casosPorPosicion(cam, veh, xs);
  const out = {
    descripcion: `Alcantarilla (${cual}) ${pm.nCeldas}x${pm.L}x${pm.H} m, HL-93 ${veh.nombre}. kN, m.`,
    E: pm.E, nu: pm.nu,
    nudos: modelo.nodes.map((n) => [n[0], n[2]]),
    barras: modelo.elements.map((el, e) => ({ i: el[0], j: el[1], A: ei.areas.get(e), I: ei.momentsOfInertiaZ.get(e),
      t: ei.cantos?.get?.(e) ?? null })),
    muelles: modelo.springs.map((s) => ({ nudo: s.node, k: s.k })),
    apoyoUx: [...modelo.nodeInputs.supports].filter(([, s]) => s[0]).map(([n]) => n),
    casos: casos.map((c) => ({ nombre: c.nombre, xF: c.xF, cargas: c.cargas })),
    // casos UNITARIOS (1 kN hacia abajo en cada nudo del tablero): con ellos otro programa rehace la
    // envolvente que enseña la app sin usar el código de Hekatan (comparar.mjs, `envolventeIndependiente`)
    casosIL: cam.nudos.map((n, k) => ({ nombre: `IL${String(k).padStart(3, "0")}`, xF: cam.s[k], cargas: [[n, 1]] })),
    camino: { nudos: cam.nudos, s: cam.s },
    vehiculo: { ejesKN: [35, 145, 145], sepDelantera: 4.3, sepTraseras: M.separacionesHL93(0.1), ancho: p.ancho, IM: p.IM,
      carril: p.carril ? 9.3 : 0, paso: pm.dx },
  };
  writeFileSync(join(AQUI, `modelo_${cual}.json`), JSON.stringify(out));
  const hk = {};
  for (const c of casos) {
    const s = M.estadoEnPosicion(IL, veh, c.xF);
    hk[c.nombre] = {
      U: modelo.nodes.map((_, n) => [s.U[n * 6], s.U[n * 6 + 2], s.U[n * 6 + 4]]),
      F: modelo.elements.map((_, e) => [0, 1, 2, 3, 4, 5].map((k) => s.F[e * 6 + k])),   // Pi Pj V2i V2j M3i M3j (diagrama CSI)
      sumaP: s.sumaCargas, sumaR: s.sumaReacciones,
    };
  }
  writeFileSync(join(AQUI, `hekatan_${cual}.json`), JSON.stringify(hk));
  // la envolvente EXACTAMENTE como la calcula la app (mismas opciones que el ejemplo)
  const env = M.envolvente(IL, veh, xs, { carril: !!p.carril,
    separacionesTraseras: p.varSep ? M.separacionesHL93(0.1) : undefined,
    vehiculoCon: (sp) => M.camionHL93({ sepTrasera: sp, IM: p.IM, ancho: p.ancho, conCarril: !!p.carril }) });
  const arr = (a) => Array.from(a);
  writeFileSync(join(AQUI, `hekatan_${cual}_env.json`), JSON.stringify({ nPosiciones: env.nPosiciones,
    total: { Fmax: arr(env.Fmax), Fmin: arr(env.Fmin), Umin: arr(env.Umin), Umax: arr(env.Umax) },
    camion: { Fmax: arr(env.soloCamion.Fmax), Fmin: arr(env.soloCamion.Fmin), Umin: arr(env.soloCamion.Umin), Umax: arr(env.soloCamion.Umax) } }));
  console.log(`${cual}: ${out.nudos.length} nudos, ${out.barras.length} barras, ${out.muelles.length} muelles, ${casos.length} posiciones`);
}
