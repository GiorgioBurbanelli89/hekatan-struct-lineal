import puppeteer from "puppeteer";
import path from "path";
const arch = path.resolve("presentacion/diapositiva/CONFERENCIA_ELEMENTOS_FINITOS.html");
const out = process.argv[2];
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1600, height: 960 });
const errs = [];
p.on("pageerror", e => errs.push(String(e).slice(0, 120)));
p.on("console", m => { if (m.type() === "error") errs.push(m.text().slice(0, 120)); });
await p.goto("file:///" + arch.split(path.sep).join("/"), { waitUntil: "networkidle0" });
await new Promise(r => setTimeout(r, 3500));
const n = await p.evaluate(() => document.querySelectorAll(".slide").length);
// el slider: se mueve y se comprueba que la grafica cambia
const slider = await p.evaluate(() => {
  const s = document.getElementById("gs");
  if (!s) return "NO HAY SLIDER";
  const antes = document.getElementById("gsvg").innerHTML.length;
  s.value = "4"; s.dispatchEvent(new Event("input"));
  const despues = document.getElementById("gsvg").innerHTML.length;
  const txt = document.getElementById("gcaja").textContent;
  s.value = "2"; s.dispatchEvent(new Event("input"));
  return (antes !== despues ? "responde" : "NO responde") + " | n=4: " + txt.slice(0, 80);
});
for (let i = 1; i <= n; i++) {
  await p.evaluate(k => {
    document.querySelectorAll(".slide").forEach((s, j) => s.classList.toggle("on", j === k - 1));
    document.getElementById("nav").style.display = "none";
    document.getElementById("hoja").style.transform = "none";
  }, i);
  await new Promise(r => setTimeout(r, 350));
  await (await p.$("#hoja")).screenshot({ path: `${out}/d${String(i).padStart(2, "0")}.png` });
}
console.log("pantallas:", n, "| errores:", errs.length, errs[0] || "");
console.log("slider de Gauss:", slider);
await b.close();
