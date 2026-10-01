// Irregularidades automáticas (capa NEC) en el dual del artículo, 1 muro y molinete, NEC-15 y borrador 2023.
//   node validation/articulo-revista/irregularidades_articulo.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const AQUI = dirname(fileURLToPath(import.meta.url)), HS = join(AQUI, "..", "..");
const TMP = join(process.env.TEMP || "/tmp", "hk_art_sismo"); mkdirSync(TMP, { recursive: true });
const src = readFileSync(join(HS, "cli", "sweep_case.mjs"), "utf8").replace(/\r\n/g, "\n");
const a = src.indexOf("// ────────── buildEdificio"), b = src.indexOf("// ────────── caso ──────────");
writeFileSync(join(TMP, "_build_irr.mjs"), src.slice(a, b).replace("for (const w of dynWallDefaults(p))", "for (const w of (p.walls ?? dynWallDefaults(p)))") + "\nexport { buildEdificio, GRAV };\n");
const { buildEdificio, GRAV } = await import(pathToFileURL(join(TMP, "_build_irr.mjs")).href);
const { empaquetar, R } = await import(pathToFileURL(join(HS, "tests", "lib", "bundle.mjs")).href);
const m = await empaquetar(`export * from "${R}/examples/src/shared/nec/calculo";\n`, "irrArt" + Date.now());
const MOL = [{ dir: 0, line: 0, start: 0, span: 1, off: 0, extra: 0 }, { dir: 0, line: 2, start: 1, span: 1, off: 0, extra: 0 },
  { dir: 1, line: 0, start: 1, span: 1, off: 0, extra: 0 }, { dir: 1, line: 2, start: 0, span: 1, off: 0, extra: 0 }];
const SIT = { "NEC-15": { norma: "NEC-15", Z: 0.4, Fa: 1, Fd: 1.6, Fs: 1.9, eta: 1.8, r: 1.5, I: 1, R: 8, Ct: 0.055, alfa: 0.75 },
  borrador: { norma: "borrador", Z: 0.4, Fa: 1, Fd: 1.6, Fs: 1.9, r: 1.2, I: 1, R: 7, Ct: 0.0488, alfa: 0.75, Cd: 5.5, limDeriva: 0.015 } };
const OUT = {};
for (const [nom, walls] of [["1 muro", undefined], ["molinete", MOL]]) for (const [nn, sitio] of Object.entries(SIT)) {
  const d = buildEdificio({ nbx: 2, nby: 2, nFloors: 4, ms: 1.0, nWalls: 1, tWall: 0.25, tSlab: 0.20, bCol: 0.40, bBeam: 0.30, hBeam: 0.50, q: 1.0, walls }, { slab: true, walls: true });
  d.kinds.forEach((k, e) => { if (k !== "beam") return; const y = d.ei.momentsOfInertiaY.get(e), z = d.ei.momentsOfInertiaZ.get(e);
    d.ei.momentsOfInertiaY.set(e, Math.min(y, z)); d.ei.momentsOfInertiaZ.set(e, Math.max(y, z)); });
  const ei = { ...d.ei, plateFormulations: new Map(), drillingTypes: new Map(), unidades: "tonf-m" };
  const r = m.calcularNEC(d.nodes, d.elements, { supports: d.ni.supports }, ei, { sitio, nModos: 24, ecc: 0.05, agrietadas: true, dual: true });
  const der = (ks) => Math.max(...ks.flatMap((k) => r.derivasEst[k].map((q) => q.inelastica)));
  const o = { V: r.estatico.V, minimo: r.dinamico.minimo, escX: r.dinamico.escX.factor, escY: r.dinamico.escY.factor, phiP: r.irregularidades.phiP, phiE: r.irregularidades.phiE,
    Ax: r.irregularidades.Ax, torsion: [r.torsional.peorX, r.torsional.peorY], derX: der(["Ex", "Ex+e", "Ex−e"]), derY: der(["Ey", "Ey+e", "Ey−e"]), lim: r.limiteDeriva,
    irr: r.irregularidades.lista.map((q) => `${q.clave}${q.valor ? "✗" : "✓"} ${q.detalle}`) };
  OUT[`${nom} · ${nn}`] = o;
  console.log(`\n== ${nom} · ${nn}: V ${o.V.toFixed(2)} tonf · mín ${o.minimo * 100} % · esc ${o.escX.toFixed(3)}/${o.escY.toFixed(3)} · φP ${o.phiP} φE ${o.phiE}` +
    (o.Ax ? ` · Ax máx ${Math.max(...o.Ax.X).toFixed(2)}/${Math.max(...o.Ax.Y).toFixed(2)}` : "") +
    ` · torsión ${o.torsion.map((t) => t.toFixed(3)).join("/")} · deriva X ${(o.derX * 100).toFixed(3)} % Y ${(o.derY * 100).toFixed(3)} % (≤ ${o.lim * 100} %)`);
  o.irr.forEach((t) => console.log("   " + t));
}
writeFileSync(join(AQUI, "irregularidades_articulo.json"), JSON.stringify(OUT, null, 1));
