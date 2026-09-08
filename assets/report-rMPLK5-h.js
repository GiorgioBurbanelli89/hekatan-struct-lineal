import "./modulepreload-polyfill-B5Qt9EMX.js";
import { a as w } from "./analyze-BFwM3Jvn.js";
import { d as $, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
import { v as e } from "./theme-U-6D_qyI.js";
import { g as x } from "./getViewer-uzQ7rr8P.js";
import { g as y } from "./getParameters-CcvO4YbC.js";
import { c as o, g as z } from "./styles-SbI03m7S.js";
import { g as T } from "./getDialog-DfUPuqg5.js";
import { g as S } from "./getReport-B3uuPMpS.js";
import { g as F, __tla as __tla_1 } from "./getCad3d-CKlkM7xp.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_2 } from "./deform-ZnZ8PQ4z.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-CUW6lNkV.js";
import "./tweakpane-BXg6ZhiP.js";
import "./exampleVersion-D1A_5i59.js";
import { __tla as __tla_3 } from "./getMesh-_M9lDnOs.js";
import "./__vite-browser-external-D7Ct-6yo.js";
import "./renderModalTable-BJWFR1R0.js";
import "./e2kParser-UQm6yNuB.js";
import "./cadSections-DVtTZU6U.js";
import "./e2kExporter-xMGubAW8.js";
Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_2;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_3;
    } catch {
    }
  })()
]).then(async () => {
  function C({ nodes: p, nodeInputs: u, elementInputs: b, deformOutputs: g, analyzeOutputs: f }) {
    return o`
    <br />
    <header class="header">
      <div class="header-left">
        <h6>Report</h6>
        <p class="bold">
          <a href="https://awatif.co" target="_blank">Awatif.co</a>
        </p>
        <p class="normal" id="reportDate">
          ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })}
        </p>
      </div>
      <div class="header-right">
        <svg
          class="flex-shrink-0 size-7"
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 -3 35 35"
          fill="#015f73"
        >
          <path
            d="M2,29.14l9.86-16.87c1.86,3.34,4.56,7.62,3.34,11.57a7.61,7.61,0,0,1-2.61,3.68,7.78,7.78,0,0,1-5,1.61c-1.48,0-3,0-4.47,0A4.5,4.5,0,0,0,2,29.14Z"
          ></path>
          <path
            d="M12.86,10.43l5.71-10L35.12,29.14H31a13.92,13.92,0,0,1-8.44-3.54,18.23,18.23,0,0,1-3.44-4.5c-.55-.92-1.08-1.85-1.61-2.79-1.25-2.21-2.56-4.39-3.85-6.58Z"
          ></path>
        </svg>
      </div>
    </header>

    <br />
    <h1>Bars</h1>

    <br />
    <h2>Nodes</h2>
    <p class="text">
      The following table gives an overview of the node coordinates.
    </p>
    <br />

    <!-- Table Section -->
    <table id="data-table">
      <tr>
        <th>Node</th>
        <th>xCoord</th>
        <th>yCoord</th>
        <th>zCoord</th>
      </tr>
      ${p.val.map((a, t) => o`
          <tr>
            <td><div class="custom-cell-content">${t}</div></td>
            <td>
              <div class="custom-cell-content">${a[0]}</div>
            </td>
            <td>
              <div class="custom-cell-content">${a[1]}</div>
            </td>
            <td>
              <div class="custom-cell-content">${a[2]}</div>
            </td>
          </tr>
        `)}
    </table>

    <br />
    <h2>Supports</h2>
    <p class="text">
      The following table gives an overview of the support conditions.
    </p>
    <br />

    <!-- Table Section -->
    <table id="data-table">
      <tr>
        <th>Node</th>
        <th>ux</th>
        <th>uy</th>
        <th>uz</th>
        <th>mx</th>
        <th>my</th>
        <th>mz</th>
      </tr>
      ${[
      ...u.val.supports
    ].map(([a, t]) => o`
          <tr>
            <td><div class="custom-cell-content">${a}</div></td>
            <td>
              <div class="custom-cell-content">${t[0]}</div>
            </td>
            <td>
              <div class="custom-cell-content">${t[1]}</div>
            </td>
            <td>
              <div class="custom-cell-content">${t[2]}</div>
            </td>
            <td>
              <div class="custom-cell-content">${t[3]}</div>
            </td>
            <td>
              <div class="custom-cell-content">${t[4]}</div>
            </td>
            <td>
              <div class="custom-cell-content">${t[5]}</div>
            </td>
          </tr>
        `)}
    </table>

    <br />
    <h2>Reactions</h2>
    <p class="text">
      The following table gives an overview of the reaction forces.
    </p>
    <br />

    <!-- Table Section -->
    <table id="data-table">
      <tr>
        <th>Node</th>
        <th>Fx</th>
        <th>Fy</th>
        <th>Fz</th>
      </tr>
      ${[
      ...g.val.reactions
    ].map(([a, t]) => o`
          <tr>
            <td><div class="custom-cell-content">${a}</div></td>
            <td>
              <div class="custom-cell-content">${t[0].toFixed(0)}</div>
            </td>
            <td>
              <div class="custom-cell-content">${t[1].toFixed(0)}</div>
            </td>
            <td>
              <div class="custom-cell-content">${t[2].toFixed(0)}</div>
            </td>
          </tr>
        `)}
    </table>

    <br />
    <h2>Elements</h2>
    <p class="text">
      The following table gives an overview of the element results.
    </p>
    <br />

    <!-- Table Section -->
    <table id="data-table">
      <tr>
        <th>Bar</th>
        <th>Area</th>
        <th>Normal</th>
      </tr>
      ${[
      ...f.val.normals
    ].map(([a, t]) => o`
          <tr>
            <td><div class="custom-cell-content">${a}</div></td>
            <td>
              <div class="custom-cell-content">
                ${b.val.areas.get(a)}
              </div>
            </td>
            <td>
              <div class="custom-cell-content">${t[0].toFixed(0)}</div>
            </td>
          </tr>
        `)}
    </table>
    <br /><br /><br />
  `;
  }
  const d = {
    xPosition: {
      value: e.state(600),
      min: 0,
      max: 1e3
    },
    zPosition: {
      value: e.state(0),
      min: 0,
      max: 500
    }
  }, s = e.state([]), l = e.state([]), r = e.state({}), i = e.state({}), c = e.state({}), n = e.state({}), v = {
    nodes: s,
    elements: l,
    nodeInputs: r,
    elementInputs: i,
    deformOutputs: c,
    analyzeOutputs: n
  };
  e.derive(() => {
    s.val = [
      [
        250,
        0,
        0
      ],
      [
        d.xPosition.value.val,
        0,
        d.zPosition.value.val
      ],
      [
        250,
        0,
        400
      ]
    ], l.val = [
      [
        0,
        1
      ],
      [
        1,
        2
      ]
    ], r.val = {
      supports: /* @__PURE__ */ new Map([
        [
          0,
          [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        ],
        [
          2,
          [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        ]
      ]),
      loads: /* @__PURE__ */ new Map([
        [
          1,
          [
            0,
            0,
            -1e3,
            0,
            0,
            0
          ]
        ]
      ])
    }, i.val = {
      elasticities: /* @__PURE__ */ new Map([
        [
          0,
          200
        ],
        [
          1,
          200
        ]
      ]),
      areas: /* @__PURE__ */ new Map([
        [
          0,
          100
        ],
        [
          1,
          100
        ]
      ])
    }, c.val = $(s.val, l.val, r.val, i.val), n.val = w(s.val, l.val, i.val, c.val);
  });
  const m = e.state(""), h = e.state(void 0);
  e.derive(() => {
    m.val === "Report" && (h.val = S({
      template: C,
      data: v
    }));
  });
  document.body.append(F({
    nodes: s,
    elements: l,
    nodeInputs: r,
    elementInputs: i
  }), z({
    clickedButton: m,
    buttons: [
      "Report"
    ],
    sourceCode: "https://github.com/madil4/awatif/blob/main/examples/src/report/main.ts",
    author: "https://www.linkedin.com/in/cal-mense/"
  }), T({
    dialogBody: h
  }), y(d), x({
    mesh: v,
    settingsObj: {
      gridSize: 1e3
    }
  }));
});
