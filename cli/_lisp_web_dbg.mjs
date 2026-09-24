import puppeteer from "puppeteer";
const EJ = process.argv[2];
const URL = "https://giorgioburbanelli89.github.io/hekatan-lisp/#ej=" + encodeURIComponent(EJ);
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--disable-setuid-sandbox"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1500, height: 950 });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 180000 });
await new Promise(r => setTimeout(r, 40000));
const o = await pag.evaluate(() => {
  const ed = document.querySelector("textarea");
  return { primeras: (ed ? ed.value : "").split("\n").slice(0, 6),
           resultado: (document.body.innerText || "").split("\n").slice(0, 8) };
});
console.log(JSON.stringify(o, null, 1));
await nav.close();
