import puppeteer from "puppeteer";
const URLB = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?m=7nF68EUiy5UVJuli&t=new-blank";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const [tag, vp, mobile] of [["escritorio", { width: 1500, height: 950 }, false], ["movil", { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, true]]) {
  const p = await nav.newPage(); await p.setViewport(vp);
  if (mobile) await p.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148");
  const errs = []; p.on("pageerror", e => errs.push(e.message));
  await p.goto(URLB, { waitUntil: "domcontentloaded", timeout: 120000 });
  await new Promise(r => setTimeout(r, 20000));
  const r = await p.evaluate(() => document.querySelector("#viewer")?.getBoundingClientRect()?.toJSON());
  const clip = { clip: { x: r.x + 10, y: r.y + 10, width: Math.min(800, r.width - 20), height: Math.min(500, r.height - 20) } };
  const anima = async () => { const a = await p.screenshot(clip); await new Promise(r => setTimeout(r, 400)); const b = await p.screenshot(clip); return Buffer.compare(a, b) !== 0; };
  const estado = () => p.evaluate(() => [...document.querySelectorAll("#settings .tp-lblv")].filter(e => /Resultado|^Case|Combo|Caso modal|Modo|Animar/.test(e.querySelector(".tp-lblv_l")?.textContent ?? "")).map(e => { const vis = e.getBoundingClientRect().height > 0 && getComputedStyle(e).display !== "none"; return e.querySelector(".tp-lblv_l").textContent.trim() + "=" + (e.querySelector("select")?.selectedOptions[0]?.textContent ?? e.querySelector("input")?.checked) + (vis ? "" : " (OCULTO)"); }));
  console.log(tag, "antes:", await anima(), JSON.stringify(await estado()));
  const clk = await p.evaluate(() => { const l = [...document.querySelectorAll("#settings .tp-lblv")].find(e => /Animar/.test(e.textContent)); const cb = l?.querySelector("input[type=checkbox]"); if (!cb) return "no hay casilla"; cb.click(); return cb.checked; });
  await new Promise(r => setTimeout(r, 2500));
  console.log(tag, "Animar click ->", clk, "anima:", await anima(), JSON.stringify(await estado()), "err", JSON.stringify(errs.slice(0, 3)));
  await p.screenshot({ path: `cli/shots/movil/chk_anim_manual_${tag}.png` });
  await p.close();
}
await nav.close();
