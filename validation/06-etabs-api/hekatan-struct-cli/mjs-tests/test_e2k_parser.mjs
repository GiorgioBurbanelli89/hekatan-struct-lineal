/**
 * Quick test script for e2k parser — run with: node test_e2k_parser.mjs
 * Verifies story elevations, node/element counts against known values.
 */
import { readFileSync } from "fs";

// Inline a minimal parser (same logic as e2kParser.ts) to test without build
const text = readFileSync((process.env.USERPROFILE ?? "") + "\\Downloads\\CIMENTAC_MODELO COMPLETO_GAD RIOCHICO.e2k", "utf-8");
const lines = text.split(/\r?\n/);

const units = { force: "TONF", length: "M" };
const stories = [];
const materials = new Map();
const frameSections = new Map();
const pointCoords = new Map();
const lineConns = [];
const restraints = new Map();
const lineAssigns = new Map();
let title = "";
let currentSection = "";

for (const rawLine of lines) {
  const line = rawLine.trim();
  if (!line || line.startsWith("$")) {
    if (line.startsWith("$ ")) currentSection = line.substring(2).trim();
    continue;
  }

  if (currentSection === "CONTROLS") {
    const um = line.match(/UNITS\s+"([^"]+)"\s+"([^"]+)"/);
    if (um) { units.force = um[1]; units.length = um[2]; }
    const tm = line.match(/TITLE2\s+"([^"]+)"/);
    if (tm) title = tm[1];
  }

  if (currentSection === "STORIES - IN SEQUENCE FROM TOP") {
    const sm = line.match(/STORY\s+"([^"]+)"\s+(?:HEIGHT\s+([\d.]+)|ELEV\s+([-\d.]+))/);
    if (sm) {
      const name = sm[1];
      const height = sm[2] ? parseFloat(sm[2]) : 0;
      const elev = sm[3] ? parseFloat(sm[3]) : undefined;
      stories.push({ name, height, elev: elev ?? 0 });
    }
  }

  if (currentSection === "POINT COORDINATES") {
    const pm = line.match(/POINT\s+"([^"]+)"\s+([-\d.eE+]+)\s+([-\d.eE+]+)/);
    if (pm) pointCoords.set(pm[1], [parseFloat(pm[2]), parseFloat(pm[3])]);
  }

  if (currentSection === "LINE CONNECTIVITIES") {
    const lm = line.match(/LINE\s+"([^"]+)"\s+(COLUMN|BEAM|BRACE)\s+"([^"]+)"\s+"([^"]+)"\s+(\d+)/);
    if (lm) lineConns.push({ name: lm[1], type: lm[2], pt1: lm[3], pt2: lm[4], nStories: parseInt(lm[5]) });
  }

  if (currentSection === "POINT ASSIGNS") {
    const rm = line.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)".*RESTRAINT\s+"([^"]+)"/);
    if (rm) restraints.set(`${rm[1]}@${rm[2]}`, rm[3].split(/\s+/));
  }

  if (currentSection === "LINE ASSIGNS") {
    const lam = line.match(/LINEASSIGN\s+"([^"]+)"\s+"([^"]+)".*SECTION\s+"([^"]+)"/);
    if (lam) lineAssigns.set(`${lam[1]}@${lam[2]}`, { story: lam[2], section: lam[3] });
  }
}

// ── Compute story elevations (FIXED) ──
const storyElevs = new Map();
if (stories.length > 0) {
  const baseIdx = stories.length - 1;
  storyElevs.set(stories[baseIdx].name, stories[baseIdx].elev);
  for (let i = baseIdx - 1; i >= 0; i--) {
    const belowElev = storyElevs.get(stories[i + 1].name);
    const thisElev = belowElev + stories[i].height;
    stories[i].elev = thisElev;
    storyElevs.set(stories[i].name, thisElev);
  }
}

console.log("=== STORY ELEVATIONS (FIXED) ===");
for (const s of [...stories].reverse()) {
  console.log(`  ${s.name.padEnd(12)} height=${s.height}  elev=${s.elev.toFixed(2)}`);
}

console.log(`\n=== PARSING STATS ===`);
console.log(`  Points:     ${pointCoords.size} (expected 605)`);
console.log(`  Lines:      ${lineConns.size ?? lineConns.length} (expected 636)`);
console.log(`  LineAssigns: ${lineAssigns.size} (expected 746)`);
console.log(`  Restraints: ${restraints.size}`);

// Count by type
const typeCounts = {};
for (const lc of lineConns) typeCounts[lc.type] = (typeCounts[lc.type] || 0) + 1;
console.log(`  Types:`, typeCounts);

// ── Build nodes ──
const nodeKey = (pt, story) => `${pt}@${story}`;
const allNodeKeys = new Set();

for (const lc of lineConns) {
  for (const [key, la] of lineAssigns) {
    if (!key.startsWith(lc.name + "@")) continue;
    const story = la.story;
    const storyIdx = stories.findIndex(s => s.name === story);
    if (storyIdx < 0) continue;

    if (lc.type === "COLUMN" || lc.type === "BRACE") {
      allNodeKeys.add(nodeKey(lc.pt2, story));
      const nSt = Math.max(lc.nStories, 1);
      const bottomIdx = Math.min(storyIdx + nSt, stories.length - 1);
      allNodeKeys.add(nodeKey(lc.pt1, stories[bottomIdx].name));
    } else {
      allNodeKeys.add(nodeKey(lc.pt1, story));
      allNodeKeys.add(nodeKey(lc.pt2, story));
    }
  }
}

for (const [key] of restraints) allNodeKeys.add(key);

const nodeNameToIdx = new Map();
const nodes = [];
for (const nk of allNodeKeys) {
  const [pt, story] = nk.split("@");
  const xy = pointCoords.get(pt);
  const elev = storyElevs.get(story);
  if (xy === undefined || elev === undefined) continue;
  nodes.push([xy[0], xy[1], elev]);
  nodeNameToIdx.set(nk, nodes.length - 1);
}

// ── Build elements ──
const elements = [];
let skipped = 0;
for (const lc of lineConns) {
  for (const [key, la] of lineAssigns) {
    if (!key.startsWith(lc.name + "@")) continue;
    const story = la.story;
    const storyIdx = stories.findIndex(s => s.name === story);
    if (storyIdx < 0) continue;

    let n1key, n2key;
    if (lc.type === "COLUMN" || lc.type === "BRACE") {
      const nSt = Math.max(lc.nStories, 1);
      const bottomIdx = Math.min(storyIdx + nSt, stories.length - 1);
      n1key = nodeKey(lc.pt1, stories[bottomIdx].name);
      n2key = nodeKey(lc.pt2, story);
    } else {
      n1key = nodeKey(lc.pt1, story);
      n2key = nodeKey(lc.pt2, story);
    }

    const i1 = nodeNameToIdx.get(n1key);
    const i2 = nodeNameToIdx.get(n2key);
    if (i1 === undefined || i2 === undefined || i1 === i2) {
      skipped++;
      if (skipped <= 5) console.log(`  SKIP: ${lc.name}@${story} type=${lc.type} n1=${n1key} n2=${n2key} i1=${i1} i2=${i2}`);
      continue;
    }
    elements.push({ name: lc.name, type: lc.type, story, n1: i1, n2: i2 });
  }
}

console.log(`\n=== RESULTS ===`);
console.log(`  Nodes created:    ${nodes.length}`);
console.log(`  Elements created: ${elements.length}`);
console.log(`  Skipped elements: ${skipped}`);

// Show some Z elevations to verify
const zVals = new Set(nodes.map(n => n[2].toFixed(3)));
console.log(`  Unique Z elevations: ${[...zVals].sort((a, b) => a - b).join(", ")}`);

// Show sample elements
console.log(`\n=== SAMPLE ELEMENTS ===`);
for (const e of elements.slice(0, 5)) {
  const n1 = nodes[e.n1], n2 = nodes[e.n2];
  console.log(`  ${e.name} ${e.type} @${e.story}: [${n1[0].toFixed(2)},${n1[1].toFixed(2)},${n1[2].toFixed(2)}] → [${n2[0].toFixed(2)},${n2[1].toFixed(2)},${n2[2].toFixed(2)}]`);
}
