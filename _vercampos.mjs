import puppeteer from "puppeteer";
const id = process.argv[2] || "plantillas";
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1400, height: 900 });
await p.goto("https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=" + id + "&cb=" + Date.now(), { waitUntil: "networkidle0", timeout: 90000 });
await p.waitForFunction(() => window.__hekatanStates?.nodes?.val?.length > 0, { timeout: 60000 }).catch(() => {});
await new Promise(r => setTimeout(r, 2500));
const r = await p.evaluate(() => {
  const s = [...document.querySelectorAll("select")].find(x => [...x.options].some(o => o.value === "M11"));
  const vis = s ? [...s.options].filter(o => o.style.display !== "none" && !o.hidden).map(o => o.value) : [];
  return { n: vis.length, campos: vis.join(" "), tieneM12: vis.includes("M12"), nudos: window.__hekatanStates?.nodes?.val?.length };
});
console.log(id, "->", r.n, "campos | M12:", r.tieneM12 ? "SI" : "NO", "| nudos:", r.nudos);
console.log("  ", r.campos);
await b.close();
