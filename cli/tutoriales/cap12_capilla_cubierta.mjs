/**
 * Capítulo 12 — La CAPILLA importada bien de ETABS, y con su CUBIERTA DE ZINC.
 *
 * El modelo real (Capilla Analítico.EDB) se trae con `etabs-cli geom` (OAPI):
 * 152 nudos / 187 barras / 26 apoyos, exacto y sin nudos sueltos (antes, al
 * reparsear el texto e2k, salían 306 con 116 sueltos). Es el esqueleto de acero.
 * Encima va la cubierta de ZINC como losa MEMBRANA (reparte la carga a las
 * correas), igual que en el galpón. Todo con el cursor, que se pone ROJO al clic.
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAPILLA = JSON.parse(readFileSync(join(__dirname, "capilla_model.json"), "utf8"));

export const titulo = "Hekatan Struct · la capilla y su cubierta de zinc";
export const ruta = "workspace/?t=csi-importer";

const proj = async (a, wx, wy, wz = 0) => a.pag.evaluate(({ wx, wy, wz }) => {
  const host = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera);
  if (!host) return null;
  const cam = host.__ctx.camera; const rect = host.getBoundingClientRect(); cam.updateMatrixWorld();
  const ap = (m, v) => { const e = m.elements; return [
    e[0]*v[0]+e[4]*v[1]+e[8]*v[2]+e[12]*v[3], e[1]*v[0]+e[5]*v[1]+e[9]*v[2]+e[13]*v[3],
    e[2]*v[0]+e[6]*v[1]+e[10]*v[2]+e[14]*v[3], e[3]*v[0]+e[7]*v[1]+e[11]*v[2]+e[15]*v[3] ]; };
  let v = ap(cam.matrixWorldInverse, [wx, wy, wz, 1]); v = ap(cam.projectionMatrix, v);
  return { x: rect.left + (v[0]/v[3]*0.5+0.5)*rect.width, y: rect.top + (-v[1]/v[3]*0.5+0.5)*rect.height };
}, { wx, wy, wz });

const mover = async (a, x, y, steps = 24) => {
  await a.pag.mouse.move(x, y, { steps });
  await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x, y });
};
const setP = async (a, c, v) => { await a.pag.evaluate((q) => { try { window.__hekatanSetParam && window.__hekatanSetParam(q.c, q.v); } catch(e){} }, { c, v }); };

const abrirCarpeta = async (a, titulo) => {
  await a.pag.evaluate((f) => {
    const btn = [...document.querySelectorAll(".tp-fldv_b")].find((x) => (x.textContent || "").includes(f));
    if (!btn) return;
    const cont = btn.closest(".tp-fldv");
    const body = cont && cont.querySelector(".tp-fldv_c");
    const h = body ? body.getBoundingClientRect().height : 0;
    if (h < 5) btn.click();
    btn.scrollIntoView({ block: "center" });
  }, titulo);
};

const filaRect = async (a, texto) => a.pag.evaluate((t) => {
  const lab = [...document.querySelectorAll(".tp-lblv_l, .tp-ckbv_l, label")].find((x) => (x.textContent || "").includes(t));
  const row = lab ? (lab.closest(".tp-lblv, .tp-ckbv") || lab.parentElement) : null;
  if (!row) return null;
  row.scrollIntoView({ block: "center" });
  const rc = row.getBoundingClientRect();
  return { x: rc.left, y: rc.top, w: rc.width, h: rc.height };
}, texto);

// CLIC visible sobre una fila: cursor ROJO + aro, y luego cambia el parámetro.
const clicFila = async (a, texto, clave, valor, nota) => {
  const r = await filaRect(a, texto);
  if (!r || r.w < 5) return false;
  const cx = r.x + r.w - 16, cy = r.y + r.h / 2;
  await mover(a, cx, cy, 22);
  if (nota) { await a.pag.evaluate((q) => window.__tutCaja(q.r, q.n, { x: 0, y: 0, w: 1280, h: 640 }), { r, n: nota }); await a.quieto(4, 320); }
  await a.pag.evaluate((q) => window.__tutClick(q.x, q.y), { x: cx, y: cy });
  await a.quieto(3, 320);
  await setP(a, clave, valor);
  await a.pag.evaluate(() => window.__tutSinCaja());
  await a.quieto(3, 320);
  return true;
};

// Resalta una fila (flecha + recuadro) sin clic: el «dónde se elige».
const resaltarParam = async (a, texto, nota) => {
  const r = await filaRect(a, texto);
  if (!r || r.w < 5) return false;
  await mover(a, r.x + r.w - 22, r.y + r.h / 2, 22);
  await a.pag.evaluate((q) => window.__tutCaja(q.r, q.n, { x: 0, y: 0, w: 1280, h: 640 }), { r, n: nota });
  await a.quieto(6, 340);
  await a.pag.evaluate(() => window.__tutSinCaja());
  return true;
};

const orbitar = async (a, dx, dy, n = 6) => {
  const s = await proj(a, -8, 14, 3);
  const cx = s ? s.x : 900, cy = s ? s.y : 470;
  await a.pag.mouse.move(cx, cy);
  await a.pag.mouse.down();
  await a.pag.mouse.move(cx + dx, cy + dy, { steps: 24 });
  await a.pag.mouse.up();
  await a.quieto(n, 320);
};

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("La capilla y su cubierta de zinc", "Capítulo 12", 16); } },
  {
    rotulo: "1 · La traemos de ETABS con etabs-cli (152 nudos, 187 barras)",
    hacer: async (a) => {
      await a.pag.evaluate((model) => {
        window.__hekatanImportedModel = model;
        try { window.__hekatanRebuild && window.__hekatanRebuild(); } catch (e) {}
        try { window.__hekatanAutoFit && window.__hekatanAutoFit(); } catch (e) {}
      }, CAPILLA);
      await a.general();
      await a.quieto(5, 350);
    },
  },
  {
    rotulo: "2 · El esqueleto de acero: nave, columnas y correas",
    hacer: async (a) => {
      await orbitar(a, 160, 25, 5);
      await orbitar(a, -110, -20, 5);
    },
  },
  {
    rotulo: "3 · Un clic (cursor ROJO): le ponemos la cubierta de zinc",
    hacer: async (a) => {
      await abrirCarpeta(a, "Cubierta");
      await a.quieto(1, 260);
      await clicFila(a, "Poner cubierta", "cubierta", 1,
        "Clic: la cubierta de ZINC como losa membrana (reparte a las correas).");
    },
  },
  {
    rotulo: "4 · El zinc: paños de membrana que cubren el techo",
    hacer: async (a) => {
      await a.general();
      await orbitar(a, 150, -25, 6);
    },
  },
  {
    rotulo: "5 · Membrana: el zinc solo trabaja en su plano (como ETABS)",
    hacer: async (a) => {
      await abrirCarpeta(a, "Cubierta");
      await a.quieto(1, 260);
      await resaltarParam(a, "Formulación de la placa",
        "Membrana = solo su plano. El zinc no da rigidez a flexión, reparte carga.");
      await a.general();
      await orbitar(a, -170, 25, 6);
    },
  },
];
