// El grabador de Struct (WebCodecs + mp4-muxer): 4 s de un lienzo animado → descarga → se examina con ffmpeg.
import puppeteer from "puppeteer";
const [BASE, DIR] = process.argv.slice(2);
const nav = await puppeteer.launch({ headless: false, args: ["--no-sandbox", "--window-size=1400,900"] });
const pag = await nav.newPage(); const err = []; pag.on("pageerror", (e) => err.push(String(e))); pag.on("console", (m) => { if (/grabar/.test(m.text())) err.push(m.text()); });
const cdp = await pag.createCDPSession(); await cdp.send("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: DIR });
await pag.goto(`${BASE}/workspace/?t=plantillas`, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 5000));
const ok = await pag.evaluate(async () => {
  // como una pantalla de 2560×1600 con paneles de texto PEQUEÑO (12 px), que es lo que se emborronaba
  const c = document.createElement("canvas"); c.width = 2560; c.height = 1600; const x = c.getContext("2d");
  let t = 0; setInterval(() => { x.fillStyle = "#11161d"; x.fillRect(0, 0, 2560, 1600); x.fillStyle = "#cfd8e3"; x.font = "12px Segoe UI";
    for (let r = 0; r < 60; r++) x.fillText("factor de escala 2.6524 · ξ amortiguamiento (%) 5.0 · N° de modos 12 · fila " + r + " · t " + t, 20, 30 + r * 24);
    x.strokeStyle = "#7f96b3"; x.beginPath(); for (let i = 0; i < 1200; i++) x.lineTo(1300 + i, 800 + 200 * Math.sin((i + t * 8) / 30)); x.stroke(); t++; }, 40);
  const st = c.captureStream(30); window.__st = st; return await window.hkGrabarDesde(st);
});
console.log("WebCodecs:", ok);
await new Promise((r) => setTimeout(r, 4000));
await pag.evaluate(() => window.hkGrabar());
await new Promise((r) => setTimeout(r, 4000));
// el GIF con el MISMO lienzo
await pag.evaluate(() => { const c = document.createElement("canvas"); c.width = 2560; c.height = 1600; const x = c.getContext("2d");
  let t = 0; setInterval(() => { x.fillStyle = "#11161d"; x.fillRect(0, 0, 2560, 1600); x.fillStyle = "#cfd8e3"; x.font = "12px Segoe UI";
    for (let r = 0; r < 60; r++) x.fillText("factor de escala 2.6524 · ξ amortiguamiento (%) 5.0 · N° de modos 12 · fila " + r + " · t " + t, 20, 30 + r * 24);
    x.strokeStyle = "#7f96b3"; x.beginPath(); for (let i = 0; i < 1200; i++) x.lineTo(1300 + i, 800 + 200 * Math.sin((i + t * 8) / 30)); x.stroke(); t++; }, 40);
  window.hkGifDesde(c.captureStream(30)); });
await new Promise((r) => setTimeout(r, 4000));
await pag.evaluate(() => window.hkGifParar());
await new Promise((r) => setTimeout(r, 6000));
console.log("errores", err.length, err.slice(0, 3)); await nav.close();
