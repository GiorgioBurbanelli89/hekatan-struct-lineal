/**
 * Brazos rígidos automáticos en el MODELO NUEVO (lo dibujado): se «dibuja» un pórtico de 6 × 3 m
 * (dos columnas y una viga) escribiendo en `__hekatanDrawingPoints/Polylines`, se abre con el enlace
 * `&p=` (empotrado, cargas auto) y se mira qué brazos quedan, el desplazamiento y el `.heks` guardado.
 * Esperado con las secciones por defecto (columna 0.40 × 0.40, viga 0.30 × 0.50): viga 0.2 / 0.2,
 * columna 0 / 0.5 (canto de la viga arriba); RZ = 1 rigidiza; «Ninguno» no pone brazos.
 *
 *   node cli/ctl_brazos_newblank.mjs [--base URL]      (defecto: el público)
 */
import puppeteer from "puppeteer";

const args = process.argv.slice(2);
const i = args.indexOf("--base");
const BASE = i >= 0 ? args[i + 1] : "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const filas = [];
for (const [nombre, p] of [["Ninguno (SAP2000)", { brazos: 0 }], ["ETABS, RZ = 0", { brazos: 1, rz: 0 }], ["ETABS, RZ = 1", { brazos: 1, rz: 1 }]]) {
  const pag = await nav.newPage();
  const errores = [];
  pag.on("pageerror", (e) => errores.push(String(e)));
  await pag.goto(`${BASE}/workspace/?t=new-blank&p=${b64({ apoyo: 0, aplicarCargas: 1, Fx: 10, ...p })}`, { waitUntil: "networkidle2", timeout: 120000 });
  await espera(3000);
  const r = await pag.evaluate(async () => {
    const W = window;
    W.__hekatanDrawingPoints.val = [[0, 0, 0], [6, 0, 0], [0, 0, 3], [6, 0, 3]];
    W.__hekatanDrawingPolylines.val = [[0, 2], [1, 3], [2, 3]];
    await new Promise((res) => setTimeout(res, 300));
    W.__hekatanRebuild?.();
    await new Promise((res) => setTimeout(res, 1500));
    const st = W.__hekatanStates;
    const eo = st?.elementInputs?.val?.endOffsets;
    const nodes = st?.nodes?.val ?? [], els = st?.elements?.val ?? [];
    let viga = null, col = null;
    eo?.forEach((v, e) => { const [a, b] = els[e]; const vert = Math.abs(nodes[b][2] - nodes[a][2]) > 1e-6;
      if (vert && !col) col = v; if (!vert && !viga) viga = v; });
    let ux = 0;
    st?.deformOutputs?.val?.deformations?.forEach((d) => { if (Math.abs(d[0]) > Math.abs(ux)) ux = d[0]; });
    const heks = W.__hekatanModeloAHeks?.() ?? "";
    return { n: eo ? eo.size : 0, viga, col, ux, nEls: els.length, endoffsetEnHeks: (heks.match(/^endoffset /gm) || []).length };
  });
  filas.push({ nombre, ...r, errores: errores.length });
  await pag.close();
}
await nav.close();
const f = (v) => (v ? v.map((x) => +x.toFixed(3)).join(" / ") : "—");
for (const r of filas)
  console.log(`${r.nombre.padEnd(18)} barras ${r.nEls} · con brazo ${r.n} · viga ${f(r.viga).padEnd(14)} · columna ${f(r.col).padEnd(14)} · ux máx ${(r.ux * 1000).toFixed(4)} mm · endoffset en .heks ${r.endoffsetEnHeks} · errores ${r.errores}`);
const [sin, rz0, rz1] = filas;
const ok = sin.n === 0 && rz0.n === 3 && Math.abs(rz0.viga?.[0] - 0.2) < 1e-9 && Math.abs(rz0.col?.[1] - 0.5) < 1e-9 &&
  Math.abs(rz0.ux - sin.ux) <= 1e-9 * Math.abs(sin.ux) && Math.abs(rz1.ux) < Math.abs(rz0.ux) &&
  rz0.endoffsetEnHeks === 3 && filas.every((r) => r.errores === 0 && r.nEls === 3);
console.log(ok ? "OK: sin brazos en SAP2000; con ETABS viga 0.2/0.2 y columna 0/0.5; RZ 0 no rigidiza, RZ 1 sí; el .heks los guarda" : "FALLA");
process.exit(ok ? 0 : 1);
