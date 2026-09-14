import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 950 });
const errs = []; p.on("pageerror", e => errs.push(e.message));
await p.goto("http://localhost:4795/hekatan-struct-lineal/muro-contencion-solido/", { waitUntil: "domcontentloaded", timeout: 120000 });
await new Promise(r => setTimeout(r, 12000));
const leer = () => p.evaluate(() => {
  const val = (re) => { const f = [...document.querySelectorAll(".tp-lblv")].find(e => re.test(e.querySelector(".tp-lblv_l")?.textContent ?? "")); return f?.querySelector("input")?.value; };
  return { tTop: val(/coronaci.*inclinada/), ux: val(/^u_x coronaci/) };
});
console.log("antes", JSON.stringify(await leer()));
// el campo numérico de «t coronación»: clic, seleccionar todo, teclear, Enter (como un usuario)
const box = await p.evaluate(() => {
  const f = [...document.querySelectorAll(".tp-lblv")].find(e => /coronaci.*inclinada/.test(e.querySelector(".tp-lblv_l")?.textContent ?? ""));
  const inp = [...(f?.querySelectorAll("input") ?? [])].pop(); if (!inp) return null;
  const r = inp.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
if (box) {
  await p.mouse.click(box.x, box.y, { clickCount: 3 });
  await p.keyboard.down("Control"); await p.keyboard.press("KeyA"); await p.keyboard.up("Control");
  await p.keyboard.type("0.2"); await p.keyboard.press("Enter");
}
await new Promise(r => setTimeout(r, 7000));
console.log("despues", JSON.stringify(await leer()), "errs", JSON.stringify(errs.slice(0, 3)));
await p.screenshot({ path: "cli/shots/muro_inclinado/pagina_inclinada.png" });
await nav.close();
