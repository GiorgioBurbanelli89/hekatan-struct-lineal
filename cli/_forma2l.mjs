import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.goto(process.argv[2], { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 18000));
const r = await p.evaluate(() => {
  const m = window.__hekatanStates?.elementInputs?.val?.sectionShapes;
  const out = {};
  m?.forEach((v, k) => { if (!out[v.type]) out[v.type] = { idx: k, ...v }; });
  return out;
});
console.log(JSON.stringify(r, null, 1));
await b.close();
