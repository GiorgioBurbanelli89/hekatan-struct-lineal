// Derivas por PISO (estático y dinámico) del edificio del curso, con NEC-15 y con el borrador, del sitio público.
import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const P = Buffer.from(JSON.stringify({ tipo: 2, ejesX: "0,5,11,15", ejesY: "0,4.5,9.5", pisos: 4, h: 3, h1: 3.6, volXp: 1.2, volYm: 1.5, volXm: 0, volYp: 0, formLosa: 51, tlosa: 0.25, offsets: 0 })).toString("base64");
await pag.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=plantillas&p=${P}&v=${Date.now()}`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(9000);
const q = async (o) => pag.evaluate((o) => { const n = window.__hekatanNEC; Object.assign(n.params, o); n.correr(); const r = n.resultado();
  const peor = (ks, f) => r.pisos.map((_, i) => Math.max(...ks.map((k) => f(r.derivasEst[k][i]))));
  const f3 = (a) => a.map((x) => +(x * 100).toFixed(3));
  return { norma: r.sitio.norma, lim: r.limiteDeriva, amp: r.derivasEst.Ex[0].inelastica / r.derivasEst.Ex[0].max, Cd: r.sitio.Cd, R: r.sitio.R,
    V: +r.estatico.V.toFixed(1), T: +r.estatico.T.toFixed(3), Ax: r.irregularidades.Ax,
    estX_E: f3(peor(["Ex","Ex+e","Ex−e"], (d) => d.max)), estX_M: f3(peor(["Ex","Ex+e","Ex−e"], (d) => d.inelastica)),
    estY_E: f3(peor(["Ey","Ey+e","Ey−e"], (d) => d.max)), estY_M: f3(peor(["Ey","Ey+e","Ey−e"], (d) => d.inelastica)),
    dinX_M: f3(r.dirDerivas.X), dinY_M: f3(r.dirDerivas.Y), metodo: r.dirDerivas.metodo, modal: r.dinamico.X.modal,
    relX: +r.dinamico.escX.relacion.toFixed(3), relY: +r.dinamico.escY.relacion.toFixed(3) }; }, o);
console.log("NEC15", JSON.stringify(await q({ norma: 0, Z: 0.5, Fa: 1.12, Fd: 1.11, Fs: 1.4, eta: 1.8, r: 1, agrietadas: 0 })));
console.log("BORR ", JSON.stringify(await q({ norma: 1, Z: 0.5, Fa: 1.0, Fd: 1.0, Fs: 1.44, r: 1.2, Cd: 5.5, limDeriva: 0.015, agrietadas: 0 })));
await nav.close();
