/**
 * Capítulo 12 — El reto de la CAPILLA. Se importa el modelo real de ETABS
 * (Capilla Analítico.EDB → e2k). Llega como PÓRTICOS: la cubierta de ETABS es
 * una losa `MODELINGTYPE "Membrane"` que el export OAPI no trajo como área, así
 * que los nudos altos del techo quedan SUELTOS. Se demuestra DÓNDE, en Hekatan
 * Struct, se le pone la cubierta como slab membrana y se elige su formulación,
 * y cómo esa membrana ATA el techo. Todo con el cursor + flecha.
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAPILLA = JSON.parse(readFileSync(join(__dirname, "capilla_model.json"), "utf8"));

export const titulo = "Hekatan Struct · el reto de la capilla";
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

const mover = async (a, x, y, steps = 26) => {
  await a.pag.mouse.move(x, y, { steps });
  await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x, y });
};
const setP = async (a, c, v) => { await a.pag.evaluate((q) => { try { window.__hekatanSetParam && window.__hekatanSetParam(q.c, q.v); } catch(e){} }, { c, v }); };

// Abre una carpeta del panel (Tweakpane) si está plegada. Sin abrirla, sus
// filas miden 0×0 y no se puede apuntar a ellas.
const abrirCarpeta = async (a, titulo) => {
  await a.pag.evaluate((f) => {
    const btn = [...document.querySelectorAll(".tp-fldv_b")].find((x) => (x.textContent || "").includes(f));
    if (!btn) return;
    const cont = btn.closest(".tp-fldv");
    const body = cont && cont.querySelector(".tp-fldv_c");
    const h = body ? body.getBoundingClientRect().height : 0;
    if (h < 5) btn.click();          // solo si está plegada (no la volvemos a cerrar)
    btn.scrollIntoView({ block: "center" });
  }, titulo);
};

// Resalta con cursor + flecha + recuadro una FILA del panel de parámetros
// buscándola por su etiqueta. Es el «dónde se cambia» del vídeo.
const resaltarParam = async (a, texto, nota) => {
  const r = await a.pag.evaluate((t) => {
    const lab = [...document.querySelectorAll(".tp-lblv_l, .tp-ckbv_l, .tp-rotv_t, label")]
      .find((x) => (x.textContent || "").includes(t));
    const row = lab ? (lab.closest(".tp-lblv, .tp-ckbv, .tp-rotv") || lab.parentElement) : null;
    if (!row) return null;
    row.scrollIntoView({ block: "center" });
    const rc = row.getBoundingClientRect();
    return { x: rc.left, y: rc.top, w: rc.width, h: rc.height };
  }, texto);
  if (!r || r.w < 5) return false;
  await mover(a, r.x + r.w - 22, r.y + r.h / 2, 24);
  await a.pag.evaluate((q) => window.__tutCaja(q.r, q.n, { x: 0, y: 0, w: 1280, h: 640 }), { r, n: nota });
  await a.quieto(7, 340);
  await a.pag.evaluate(() => window.__tutSinCaja());
  return true;
};

// Da una vuelta suave a la cámara para leer el modelo en 3D.
const orbitar = async (a, dx, dy, n = 6) => {
  const s = await proj(a, 0, 0, 0);
  const cx = s ? s.x : 640, cy = s ? s.y : 360;
  await a.pag.mouse.move(cx, cy);
  await a.pag.mouse.down();
  await a.pag.mouse.move(cx + dx, cy + dy, { steps: 24 });
  await a.pag.mouse.up();
  await a.quieto(n, 320);
};

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("El reto de la capilla", "Capítulo 12", 16); } },
  {
    rotulo: "1 · Importamos la capilla real de ETABS",
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
    rotulo: "2 · Llega como pórticos: la cubierta no viajó",
    hacer: async (a) => {
      await orbitar(a, 180, 40, 4);
      await orbitar(a, -120, -30, 4);
    },
  },
  {
    rotulo: "3 · Aquí se pone la cubierta: slab membrana",
    hacer: async (a) => {
      await abrirCarpeta(a, "Cubierta");
      await a.quieto(1, 260);
      await resaltarParam(a, "Poner cubierta",
        "Aquí: «Poner cubierta (slab membrana)». La losa que ata el techo.");
      await setP(a, "cubierta", 1);
      await a.quieto(5, 350);
    },
  },
  {
    rotulo: "4 · La membrana ata los nudos altos del techo",
    hacer: async (a) => {
      await a.general();
      await orbitar(a, 150, -20, 6);
    },
  },
  {
    rotulo: "5 · Y aquí eliges la formulación: Membrana",
    hacer: async (a) => {
      await abrirCarpeta(a, "Cubierta");
      await a.quieto(1, 260);
      await resaltarParam(a, "Formulación de la placa",
        "Membrana = solo trabaja en su plano (como la cubierta de ETABS).");
      await a.quieto(4, 340);
    },
  },
  {
    rotulo: "6 · La capilla con su cubierta acoplada",
    hacer: async (a) => {
      await a.general();
      await orbitar(a, -200, 30, 8);
    },
  },
];
