const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/calcPanel-M0C15Osu.js","assets/getMesh-_M9lDnOs.js","assets/__vite-browser-external-D7Ct-6yo.js","assets/pureFunctionsAny.generated-DeJSBP3k.js","assets/analyze-BXBBJMWG.js","assets/aiAgent-mACrT-SP.js","assets/Text-CU8HL4cE.js","assets/tweakpane-BXg6ZhiP.js","assets/didacticCpp-Czy7NlhT.js","assets/aiAgent-BiikUYAV.css","assets/cyclicPushoverCpp-BLH7oKjQ.js"])))=>i.map(i=>d[i]);
import { d as pt, _ as na, p as Zn, m as Za, s as Qa, __tla as __tla_0 } from "./didacticCpp-Czy7NlhT.js";
import { G as nn, y as el, e as sa, D as aa, B as Dt, q as yn, u as tl, l as ol, M as ba, v as jo, V as Me, z as ho, n as la, m as ra, H as Ho, L as Bo, c as nl, S as sl, f as al, F as ko, b as Do, d as Eo, o as ll, I as rl, J as il, w as fn, K as Qn, j as un, i as mn, g as cl, h as dl, N as pl, O as fl } from "./Text-CU8HL4cE.js";
import { P as tn } from "./tweakpane-BXg6ZhiP.js";
import { a as ia } from "./exampleVersion-D1A_5i59.js";
import { g as $n, b as wn, a as so, __tla as __tla_1 } from "./analyze-BXBBJMWG.js";
import { g as lo, __tla as __tla_2 } from "./getMesh-_M9lDnOs.js";
import { c as ul, m as ml, M as ca } from "./modeScale-DSJIAfp5.js";
import { n as Lo, s as ro, m as Jt, t as ps } from "./pureFunctionsAny.generated-DeJSBP3k.js";
import { a as bl, e as gl, c as es, s as hl, u as xl } from "./e2kExporter-DsjSDGmO.js";
import { p as vl } from "./e2kParser-O2HZvDsX.js";
import { p as yl } from "./s2kParser-B01mTLdJ.js";
import { c as da, r as ts, j as $l, i as os, h as ns } from "./cadSections-CEHEfdGW.js";
import { e as ss } from "./materials-VwssM8Vw.js";
let ma, dr;
let __tla = Promise.all([
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
  })()
]).then(async () => {
  const ds = [
    {
      id: "kN",
      label: "kN",
      toKN: 1
    },
    {
      id: "tonf",
      label: "tonf",
      toKN: 9.80665
    },
    {
      id: "kgf",
      label: "kgf",
      toKN: 980665e-8
    },
    {
      id: "kip",
      label: "kip",
      toKN: 4.44822
    },
    {
      id: "lb",
      label: "lb",
      toKN: 444822e-8
    },
    {
      id: "N",
      label: "N",
      toKN: 1e-3
    }
  ], Wo = [
    {
      id: "m",
      label: "m",
      toM: 1,
      spanRange: [
        2,
        15,
        0.5
      ],
      heightRange: [
        2,
        6,
        0.5
      ],
      defaultSpan: 5,
      defaultHeight: 3,
      galponSpan: 12,
      galponLength: 20,
      galponHeight: 6,
      galponRise: 3
    },
    {
      id: "cm",
      label: "cm",
      toM: 0.01,
      spanRange: [
        200,
        1500,
        50
      ],
      heightRange: [
        200,
        600,
        50
      ],
      defaultSpan: 500,
      defaultHeight: 300,
      galponSpan: 1200,
      galponLength: 2e3,
      galponHeight: 600,
      galponRise: 300
    },
    {
      id: "mm",
      label: "mm",
      toM: 1e-3,
      spanRange: [
        2e3,
        15e3,
        500
      ],
      heightRange: [
        2e3,
        6e3,
        500
      ],
      defaultSpan: 5e3,
      defaultHeight: 3e3,
      galponSpan: 12e3,
      galponLength: 2e4,
      galponHeight: 6e3,
      galponRise: 3e3
    },
    {
      id: "in",
      label: "in",
      toM: 0.0254,
      spanRange: [
        60,
        480,
        12
      ],
      heightRange: [
        96,
        240,
        12
      ],
      defaultSpan: 240,
      defaultHeight: 144,
      galponSpan: 480,
      galponLength: 720,
      galponHeight: 240,
      galponRise: 120
    },
    {
      id: "ft",
      label: "ft",
      toM: 0.3048,
      spanRange: [
        5,
        40,
        1
      ],
      heightRange: [
        8,
        20,
        1
      ],
      defaultSpan: 20,
      defaultHeight: 12,
      galponSpan: 40,
      galponLength: 60,
      galponHeight: 20,
      galponRise: 10
    }
  ];
  function wl(e, y) {
    return e === "kN" && y === "m" ? "kPa" : e === "kN" && y === "mm" || e === "N" && y === "mm" ? "MPa" : e === "N" && y === "m" ? "Pa" : e === "kip" && y === "in" ? "ksi" : e === "kip" && y === "ft" ? "ksf" : `${e}/${y}\xB2`;
  }
  const Io = {
    E: 2e8,
    G: 77e6,
    A: 0.01,
    Iz: 833e-7,
    Iy: 833e-7,
    J: 141e-6,
    rho: 7.85
  };
  function zo(e, y) {
    const N = ds.find((ge) => ge.id === e), L = Wo.find((ge) => ge.id === y), oe = N.toKN, V = L.toM, Q = (ge, Ee, A) => A / (Math.pow(oe, ge) * Math.pow(V, Ee));
    let K, ne;
    switch (e) {
      case "kN":
        K = 10, ne = [
          -100,
          100,
          1
        ];
        break;
      case "tonf":
        K = 1, ne = [
          -20,
          20,
          0.5
        ];
        break;
      case "kgf":
        K = 1e3, ne = [
          -1e4,
          1e4,
          100
        ];
        break;
      case "kip":
        K = 10, ne = [
          -200,
          200,
          5
        ];
        break;
      case "lb":
        K = 5e3, ne = [
          -5e4,
          5e4,
          500
        ];
        break;
      case "N":
        K = 1e4, ne = [
          -1e5,
          1e5,
          1e3
        ];
        break;
    }
    return {
      id: `${e}-${y}`,
      label: `${N.label}, ${L.label}`,
      force: N.label,
      length: L.label,
      stress: wl(e, y),
      moment: `${N.label}\xB7${L.label}`,
      E: Q(1, -2, Io.E),
      G: Q(1, -2, Io.G),
      A: Q(0, 2, Io.A),
      Iz: Q(0, 4, Io.Iz),
      Iy: Q(0, 4, Io.Iy),
      J: Q(0, 4, Io.J),
      rho: Q(1, -4, Io.rho),
      spanRange: L.spanRange,
      heightRange: L.heightRange,
      defaultSpan: L.defaultSpan,
      defaultHeight: L.defaultHeight,
      defaultForce: K,
      forceRange: ne,
      galponSpan: L.galponSpan,
      galponLength: L.galponLength,
      galponHeight: L.galponHeight,
      galponRise: L.galponRise
    };
  }
  zo("kN", "m"), zo("kip", "in");
  function bn() {
    return {
      truss: [
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        },
        {
          label: "Articulado",
          dofs: [
            true,
            true,
            true,
            false,
            false,
            false
          ]
        },
        {
          label: "Roller Z",
          dofs: [
            false,
            false,
            true,
            false,
            false,
            false
          ]
        }
      ],
      beams: [
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        },
        {
          label: "Articulado",
          dofs: [
            true,
            true,
            true,
            false,
            false,
            false
          ]
        }
      ],
      "3d": [
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        },
        {
          label: "Articulado",
          dofs: [
            true,
            true,
            true,
            false,
            false,
            false
          ]
        }
      ],
      frame: [
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        },
        {
          label: "Articulado",
          dofs: [
            true,
            true,
            true,
            false,
            false,
            false
          ]
        }
      ],
      edificio: [
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        },
        {
          label: "Articulado",
          dofs: [
            true,
            true,
            true,
            false,
            false,
            false
          ]
        }
      ],
      galpon: [
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        },
        {
          label: "Articulado",
          dofs: [
            true,
            true,
            true,
            false,
            false,
            false
          ]
        }
      ],
      barra: [
        {
          label: "Emp-Libre",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        },
        {
          label: "Emp-Emp",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        },
        {
          label: "Emp-Art",
          dofs: [
            true,
            true,
            true,
            false,
            false,
            false
          ]
        }
      ],
      "placa-3q": [
        {
          label: "Simply Supported",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        },
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      ],
      "placa-q4": [
        {
          label: "Simply Supported",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        },
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      ],
      "losa-rect": [
        {
          label: "Simply Supported",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        },
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      ],
      "losa-plana": [
        {
          label: "Pin (w=0)",
          dofs: [
            false,
            false,
            true,
            false,
            false,
            false
          ]
        },
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      ],
      "viga-alta": [
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        },
        {
          label: "Articulado",
          dofs: [
            true,
            true,
            true,
            false,
            false,
            false
          ]
        }
      ],
      "muro-contencion": [
        {
          label: "Rankine (Ka)",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        },
        {
          label: "Suelo continuo",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        },
        {
          label: "Interfaz",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        },
        {
          label: "Presion agua",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      ],
      zapata: [
        {
          label: "Winkler (k)",
          dofs: [
            false,
            false,
            true,
            false,
            false,
            false
          ]
        }
      ],
      "placa-orificios": [
        {
          label: "Simplemente apoyado",
          dofs: [
            true,
            true,
            true,
            false,
            false,
            false
          ]
        },
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      ],
      "col-placa": [
        {
          label: "Pernos empotrados",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      ],
      eiffel: [
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      ],
      arco: [
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      ],
      puente: [
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      ],
      twisted: [
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      ],
      burj: [
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      ],
      opera: [
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      ],
      diagrid: [
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      ],
      talud: [
        {
          label: "Empotrado",
          dofs: [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      ]
    };
  }
  function Ml(e) {
    return {
      truss: [
        {
          key: "span",
          val: e.defaultSpan,
          min: e.spanRange[0],
          max: e.spanRange[1],
          step: e.spanRange[2],
          label: `Luz (${e.length})`
        },
        {
          key: "divisions",
          val: 5,
          min: 2,
          max: 20,
          step: 1,
          label: "Divisiones"
        },
        {
          key: "height",
          val: e.defaultHeight * 0.5,
          min: e.heightRange[0] * 0.3,
          max: e.heightRange[1],
          step: e.heightRange[2],
          label: `Altura (${e.length})`
        }
      ],
      beams: [
        {
          key: "width",
          val: e.defaultSpan,
          min: e.spanRange[0],
          max: e.spanRange[1],
          step: e.spanRange[2],
          label: `Luz (${e.length})`
        },
        {
          key: "height",
          val: e.defaultHeight,
          min: e.heightRange[0],
          max: e.heightRange[1],
          step: e.heightRange[2],
          label: `Altura (${e.length})`
        },
        {
          key: "nSub",
          val: 4,
          min: 1,
          max: 10,
          step: 1,
          label: "Discretizaci\xF3n"
        }
      ],
      "3d": [
        {
          key: "dx",
          val: e.defaultSpan,
          min: e.spanRange[0],
          max: e.spanRange[1],
          step: e.spanRange[2],
          label: `Dx (${e.length})`
        },
        {
          key: "dy",
          val: e.defaultSpan * 0.8,
          min: e.spanRange[0],
          max: e.spanRange[1],
          step: e.spanRange[2],
          label: `Dy (${e.length})`
        },
        {
          key: "dz",
          val: e.defaultHeight,
          min: e.heightRange[0],
          max: e.heightRange[1],
          step: e.heightRange[2],
          label: `Dz (${e.length})`
        },
        {
          key: "stories",
          val: 2,
          min: 1,
          max: 10,
          step: 1,
          label: "Pisos"
        },
        {
          key: "nSub",
          val: 3,
          min: 1,
          max: 8,
          step: 1,
          label: "Discretizaci\xF3n"
        }
      ],
      frame: [
        {
          key: "nVanos",
          val: 3,
          min: 1,
          max: 10,
          step: 1,
          label: "N. Vanos"
        },
        {
          key: "spanV",
          val: e.defaultSpan,
          min: e.spanRange[0],
          max: e.spanRange[1],
          step: e.spanRange[2],
          label: `Luz vano (${e.length})`
        },
        {
          key: "nPisos",
          val: 3,
          min: 1,
          max: 20,
          step: 1,
          label: "N. Pisos"
        },
        {
          key: "hPiso",
          val: e.defaultHeight,
          min: e.heightRange[0],
          max: e.heightRange[1],
          step: e.heightRange[2],
          label: `h piso (${e.length})`
        }
      ],
      edificio: [
        {
          key: "nVanosX",
          val: 2,
          min: 1,
          max: 8,
          step: 1,
          label: "Vanos X"
        },
        {
          key: "nVanosY",
          val: 2,
          min: 1,
          max: 8,
          step: 1,
          label: "Vanos Y"
        },
        {
          key: "nPisos",
          val: 3,
          min: 1,
          max: 20,
          step: 1,
          label: "N. Pisos"
        },
        {
          key: "hPiso",
          val: e.defaultHeight,
          min: e.heightRange[0],
          max: e.heightRange[1],
          step: e.heightRange[2],
          label: `h piso (${e.length})`
        },
        {
          key: "nSubViga",
          val: 1,
          min: 1,
          max: 8,
          step: 1,
          label: "Div. Vigas"
        },
        {
          key: "nSubCol",
          val: 1,
          min: 1,
          max: 8,
          step: 1,
          label: "Div. Columnas"
        },
        {
          key: "Lvix",
          val: 0,
          min: 0,
          max: e.spanRange[1] * 0.5,
          step: e.spanRange[2],
          label: `Lvix (${e.length})`
        },
        {
          key: "Lvdx",
          val: 0,
          min: 0,
          max: e.spanRange[1] * 0.5,
          step: e.spanRange[2],
          label: `Lvdx (${e.length})`
        },
        {
          key: "Lviy",
          val: 0,
          min: 0,
          max: e.spanRange[1] * 0.5,
          step: e.spanRange[2],
          label: `Lviy (${e.length})`
        },
        {
          key: "Lvdy",
          val: 0,
          min: 0,
          max: e.spanRange[1] * 0.5,
          step: e.spanRange[2],
          label: `Lvdy (${e.length})`
        }
      ],
      galpon: [
        {
          key: "span",
          val: e.galponSpan,
          min: e.spanRange[0],
          max: e.spanRange[1] * 3,
          step: e.spanRange[2],
          label: `Luz (${e.length})`
        },
        {
          key: "length",
          val: e.galponLength,
          min: e.spanRange[0],
          max: e.spanRange[1] * 4,
          step: e.spanRange[2],
          label: `Largo (${e.length})`
        },
        {
          key: "height",
          val: e.galponHeight,
          min: e.heightRange[0],
          max: e.heightRange[1],
          step: e.heightRange[2],
          label: `Altura col (${e.length})`
        },
        {
          key: "archRise",
          val: e.galponRise,
          min: e.heightRange[2],
          max: e.heightRange[1],
          step: e.heightRange[2],
          label: `Flecha arco (${e.length})`
        },
        {
          key: "xDiv",
          val: 8,
          min: 4,
          max: 20,
          step: 1,
          label: "Div. X"
        },
        {
          key: "yDiv",
          val: 4,
          min: 2,
          max: 12,
          step: 1,
          label: "Div. Y"
        }
      ],
      barra: [
        {
          key: "L",
          val: e.defaultSpan,
          min: e.spanRange[0],
          max: e.spanRange[1],
          step: e.spanRange[2],
          label: `L total (${e.length})`
        },
        {
          key: "nElem",
          val: 3,
          min: 1,
          max: 10,
          step: 1,
          label: "Num elementos"
        },
        {
          key: "F",
          val: e.defaultForce * 10,
          min: e.forceRange[0],
          max: e.forceRange[1] * 10,
          step: Math.abs(e.forceRange[2]) * 10,
          label: `F axial (${e.force})`
        }
      ],
      "placa-3q": [
        {
          key: "Lx",
          val: 15,
          min: 2,
          max: 30,
          step: 1,
          label: `Lx (${e.length})`
        },
        {
          key: "Ly",
          val: 10,
          min: 2,
          max: 30,
          step: 1,
          label: `Ly (${e.length})`
        },
        {
          key: "meshSize",
          val: 0.5,
          min: 0.1,
          max: 3,
          step: 0.1,
          label: `Mesh size (${e.length})`
        },
        {
          key: "t",
          val: 1,
          min: 0.05,
          max: 5,
          step: 0.05,
          label: `t (${e.length})`
        },
        {
          key: "E",
          val: e.E * 3e7 / 2e8,
          min: 10,
          max: 1e12,
          step: 1e3,
          label: `E (${e.stress})`
        },
        {
          key: "nu",
          val: 0.3,
          min: 0,
          max: 0.49,
          step: 0.01,
          label: "v"
        },
        {
          key: "q",
          val: -3,
          min: -50,
          max: 0,
          step: 1,
          label: `q (${e.force}/${e.length}\xB2)`
        }
      ],
      "placa-q4": [
        {
          key: "Lx",
          val: 10,
          min: 1,
          max: 30,
          step: 1,
          label: `Lx (${e.length})`
        },
        {
          key: "Ly",
          val: 10,
          min: 1,
          max: 30,
          step: 1,
          label: `Ly (${e.length})`
        },
        {
          key: "nx",
          val: 16,
          min: 2,
          max: 64,
          step: 2,
          label: "nx elem"
        },
        {
          key: "ny",
          val: 16,
          min: 2,
          max: 64,
          step: 2,
          label: "ny elem"
        },
        {
          key: "t",
          val: 0.2,
          min: 0.05,
          max: 2,
          step: 0.05,
          label: `t (${e.length})`
        },
        {
          key: "E",
          val: e.E * 3e7 / 2e8,
          min: 10,
          max: 1e12,
          step: 1e3,
          label: `E (${e.stress})`
        },
        {
          key: "nu",
          val: 0.3,
          min: 0,
          max: 0.49,
          step: 0.01,
          label: "v"
        },
        {
          key: "q",
          val: -10,
          min: -50,
          max: 0,
          step: 1,
          label: `q (${e.force}/${e.length}\xB2)`
        }
      ],
      "losa-rect": [
        {
          key: "a",
          val: 6,
          min: 1,
          max: 20,
          step: 0.5,
          label: `a (${e.length})`
        },
        {
          key: "b",
          val: 4,
          min: 1,
          max: 20,
          step: 0.5,
          label: `b (${e.length})`
        },
        {
          key: "nx",
          val: 12,
          min: 4,
          max: 40,
          step: 2,
          label: "nx elem"
        },
        {
          key: "ny",
          val: 8,
          min: 4,
          max: 40,
          step: 2,
          label: "ny elem"
        },
        {
          key: "t",
          val: 0.1,
          min: 0.05,
          max: 1,
          step: 0.01,
          label: `t (${e.length})`
        },
        {
          key: "E",
          val: e.E * 35e6 / 2e8,
          min: 10,
          max: 1e12,
          step: 1e3,
          label: `E (${e.stress})`
        },
        {
          key: "nu",
          val: 0.15,
          min: 0,
          max: 0.49,
          step: 0.01,
          label: "v"
        },
        {
          key: "q",
          val: -10,
          min: -50,
          max: 0,
          step: 1,
          label: `q (${e.force}/${e.length}\xB2)`
        }
      ],
      "losa-plana": [
        {
          key: "t",
          val: 0.2,
          min: 0.05,
          max: 1,
          step: 0.01,
          label: `t (${e.length})`
        },
        {
          key: "meshSize",
          val: 0.6,
          min: 0.3,
          max: 2,
          step: 0.1,
          label: `Mesh (${e.length})`
        },
        {
          key: "E",
          val: e.E * 35e6 / 2e8,
          min: 10,
          max: 1e12,
          step: 1e3,
          label: `E (${e.stress})`
        },
        {
          key: "nu",
          val: 0.2,
          min: 0,
          max: 0.49,
          step: 0.01,
          label: "v"
        },
        {
          key: "q",
          val: -10,
          min: -50,
          max: 0,
          step: 1,
          label: `q (${e.force}/${e.length}\xB2)`
        }
      ],
      "viga-alta": [
        {
          key: "L",
          val: 4,
          min: 1,
          max: 20,
          step: 0.5,
          label: `L (${e.length})`
        },
        {
          key: "H",
          val: 2,
          min: 0.5,
          max: 10,
          step: 0.5,
          label: `H (${e.length})`
        },
        {
          key: "meshSize",
          val: 0.2,
          min: 0.05,
          max: 1,
          step: 0.05,
          label: `Mesh (${e.length})`
        },
        {
          key: "t",
          val: 0.1,
          min: 0.05,
          max: 1,
          step: 0.01,
          label: `t (${e.length})`
        },
        {
          key: "E",
          val: e.E * 2e7 / 2e8,
          min: 10,
          max: 1e12,
          step: 1e3,
          label: `E (${e.stress})`
        },
        {
          key: "nu",
          val: 0.2,
          min: 0,
          max: 0.49,
          step: 0.01,
          label: "v"
        },
        {
          key: "q",
          val: -100,
          min: -500,
          max: 0,
          step: 10,
          label: `q (${e.force}/${e.length})`
        },
        {
          key: "b",
          val: 0.8,
          min: 0.2,
          max: 4,
          step: 0.1,
          label: `Ancho carga (${e.length})`
        }
      ],
      "muro-contencion": [
        {
          key: "H",
          val: 4,
          min: 1,
          max: 10,
          step: 0.5,
          label: `H (${e.length})`
        },
        {
          key: "B",
          val: 3,
          min: 1,
          max: 8,
          step: 0.5,
          label: `B base (${e.length})`
        },
        {
          key: "tw",
          val: 0.3,
          min: 0.1,
          max: 1,
          step: 0.05,
          label: `t muro (${e.length})`
        },
        {
          key: "tb",
          val: 0.4,
          min: 0.1,
          max: 1,
          step: 0.05,
          label: `t base (${e.length})`
        },
        {
          key: "meshSize",
          val: 0.2,
          min: 0.05,
          max: 1,
          step: 0.05,
          label: `Mesh (${e.length})`
        },
        {
          key: "E",
          val: e.E * 25e6 / 2e8,
          min: 10,
          max: 1e12,
          step: 1e3,
          label: `E concreto (${e.stress})`
        },
        {
          key: "nu",
          val: 0.2,
          min: 0,
          max: 0.49,
          step: 0.01,
          label: "v concreto"
        },
        {
          key: "gamma",
          val: 18,
          min: 5,
          max: 30,
          step: 1,
          label: `gamma suelo (${e.force}/${e.length}\xB3)`
        },
        {
          key: "Ka",
          val: 0.33,
          min: 0.1,
          max: 0.6,
          step: 0.01,
          label: "Ka"
        },
        {
          key: "qs",
          val: 0,
          min: 0,
          max: 100,
          step: 5,
          label: `q sobrecarga (${e.stress})`
        },
        {
          key: "Es",
          val: 5e4,
          min: 100,
          max: 1e6,
          step: 1e3,
          label: `E suelo (${e.stress})`
        },
        {
          key: "nus",
          val: 0.3,
          min: 0.1,
          max: 0.49,
          step: 0.01,
          label: "v suelo"
        },
        {
          key: "kn",
          val: 1e6,
          min: 1e3,
          max: 1e9,
          step: 1e4,
          label: `kn interfaz (${e.force}/${e.length}\xB3)`
        },
        {
          key: "ks",
          val: 1e4,
          min: 100,
          max: 1e7,
          step: 1e3,
          label: `ks interfaz (${e.force}/${e.length}\xB3)`
        },
        {
          key: "gammaW",
          val: 9.81,
          min: 5,
          max: 15,
          step: 0.1,
          label: `gamma agua (${e.force}/${e.length}\xB3)`
        },
        {
          key: "Hw",
          val: 3.5,
          min: 0.5,
          max: 10,
          step: 0.5,
          label: `H agua (${e.length})`
        }
      ],
      zapata: [
        {
          key: "Lx",
          val: 2,
          min: 0.5,
          max: 6,
          step: 0.1,
          label: `Lx zapata (${e.length})`
        },
        {
          key: "Ly",
          val: 2,
          min: 0.5,
          max: 6,
          step: 0.1,
          label: `Ly zapata (${e.length})`
        },
        {
          key: "t",
          val: 0.5,
          min: 0.1,
          max: 2,
          step: 0.05,
          label: `t zapata (${e.length})`
        },
        {
          key: "colA",
          val: 0.4,
          min: 0.15,
          max: 1.5,
          step: 0.05,
          label: `a columna (${e.length})`
        },
        {
          key: "colH",
          val: 1.5,
          min: 0.5,
          max: 5,
          step: 0.5,
          label: `h pedestal (${e.length})`
        },
        {
          key: "nx",
          val: 8,
          min: 4,
          max: 20,
          step: 2,
          label: "nx elem"
        },
        {
          key: "ny",
          val: 8,
          min: 4,
          max: 20,
          step: 2,
          label: "ny elem"
        },
        {
          key: "E",
          val: e.E * 25e6 / 2e8,
          min: 10,
          max: 1e12,
          step: 1e3,
          label: `E (${e.stress})`
        },
        {
          key: "nu",
          val: 0.2,
          min: 0,
          max: 0.49,
          step: 0.01,
          label: "v"
        },
        {
          key: "P",
          val: -500,
          min: -5e3,
          max: 0,
          step: 50,
          label: `P axial (${e.force})`
        },
        {
          key: "Mx",
          val: 0,
          min: -500,
          max: 500,
          step: 10,
          label: `Mx (${e.force}\xB7${e.length})`
        },
        {
          key: "My",
          val: 0,
          min: -500,
          max: 500,
          step: 10,
          label: `My (${e.force}\xB7${e.length})`
        },
        {
          key: "ks",
          val: 2e4,
          min: 1e3,
          max: 2e5,
          step: 1e3,
          label: `ks (${e.force}/${e.length}\xB3)`
        }
      ],
      "placa-orificios": [
        {
          key: "Lx",
          val: 0.4,
          min: 0.15,
          max: 1,
          step: 0.05,
          label: `Placa Lx (${e.length})`
        },
        {
          key: "Ly",
          val: 0.4,
          min: 0.15,
          max: 1,
          step: 0.05,
          label: `Placa Ly (${e.length})`
        },
        {
          key: "t",
          val: 0.025,
          min: 0.01,
          max: 0.1,
          step: 5e-3,
          label: `Espesor t (${e.length})`
        },
        {
          key: "dBolt",
          val: 0.022,
          min: 0.01,
          max: 0.05,
          step: 2e-3,
          label: `d perno (${e.length})`
        },
        {
          key: "sx",
          val: 0.28,
          min: 0.08,
          max: 0.8,
          step: 0.02,
          label: `Sep. pernos X (${e.length})`
        },
        {
          key: "sy",
          val: 0.28,
          min: 0.08,
          max: 0.8,
          step: 0.02,
          label: `Sep. pernos Y (${e.length})`
        },
        {
          key: "colA",
          val: 0.2,
          min: 0.1,
          max: 0.5,
          step: 0.02,
          label: `Col a (${e.length})`
        },
        {
          key: "meshSize",
          val: 8e-3,
          min: 3e-3,
          max: 0.03,
          step: 1e-3,
          label: `Mesh (${e.length})`
        },
        {
          key: "E",
          val: e.E,
          min: 10,
          max: 1e12,
          step: 1e3,
          label: `E acero (${e.stress})`
        },
        {
          key: "nu",
          val: 0.3,
          min: 0,
          max: 0.49,
          step: 0.01,
          label: "v"
        },
        {
          key: "P",
          val: -200,
          min: -2e3,
          max: 0,
          step: 10,
          label: `P axial (${e.force})`
        },
        {
          key: "nBolts",
          val: 4,
          min: 2,
          max: 8,
          step: 2,
          label: "N pernos"
        }
      ],
      "col-placa": [
        {
          key: "colB",
          val: 0.3,
          min: 0.1,
          max: 0.6,
          step: 0.02,
          label: `Col b (${e.length})`
        },
        {
          key: "colH",
          val: 0.3,
          min: 0.1,
          max: 0.6,
          step: 0.02,
          label: `Col h (${e.length})`
        },
        {
          key: "colT",
          val: 8e-3,
          min: 4e-3,
          max: 0.025,
          step: 2e-3,
          label: `Col t (${e.length})`
        },
        {
          key: "colLen",
          val: 1.5,
          min: 0.5,
          max: 4,
          step: 0.25,
          label: `Col altura (${e.length})`
        },
        {
          key: "Lx",
          val: 0.45,
          min: 0.2,
          max: 1,
          step: 0.05,
          label: `Placa Lx (${e.length})`
        },
        {
          key: "Ly",
          val: 0.45,
          min: 0.2,
          max: 1,
          step: 0.05,
          label: `Placa Ly (${e.length})`
        },
        {
          key: "tPlaca",
          val: 0.025,
          min: 0.01,
          max: 0.06,
          step: 5e-3,
          label: `Placa t (${e.length})`
        },
        {
          key: "dBolt",
          val: 0.022,
          min: 0.012,
          max: 0.04,
          step: 2e-3,
          label: `d perno (${e.length})`
        },
        {
          key: "sx",
          val: 0.32,
          min: 0.1,
          max: 0.8,
          step: 0.02,
          label: `Sep pernos X (${e.length})`
        },
        {
          key: "sy",
          val: 0.32,
          min: 0.1,
          max: 0.8,
          step: 0.02,
          label: `Sep pernos Y (${e.length})`
        },
        {
          key: "nSubColV",
          val: 6,
          min: 2,
          max: 12,
          step: 1,
          label: "Col subdiv V"
        },
        {
          key: "nSubColH",
          val: 4,
          min: 2,
          max: 8,
          step: 1,
          label: "Col subdiv H"
        },
        {
          key: "nSubPlaca",
          val: 10,
          min: 4,
          max: 20,
          step: 2,
          label: "Placa subdiv"
        },
        {
          key: "E",
          val: e.E,
          min: 10,
          max: 1e12,
          step: 1e3,
          label: `E acero (${e.stress})`
        },
        {
          key: "nu",
          val: 0.3,
          min: 0,
          max: 0.49,
          step: 0.01,
          label: "v"
        },
        {
          key: "P",
          val: -300,
          min: -3e3,
          max: 0,
          step: 25,
          label: `P axial (${e.force})`
        }
      ],
      "muro-q4": [
        {
          key: "W",
          val: 5,
          min: 1,
          max: 20,
          step: 0.5,
          label: `Ancho W (${e.length})`
        },
        {
          key: "H",
          val: 3,
          min: 1,
          max: 15,
          step: 0.5,
          label: `Alto H (${e.length})`
        },
        {
          key: "t",
          val: 0.2,
          min: 0.05,
          max: 1,
          step: 0.05,
          label: `Espesor t (${e.length})`
        },
        {
          key: "nx",
          val: 8,
          min: 2,
          max: 20,
          step: 1,
          label: "Mesh nx"
        },
        {
          key: "ny",
          val: 6,
          min: 2,
          max: 20,
          step: 1,
          label: "Mesh ny"
        },
        {
          key: "E",
          val: e.E * 25e6 / 2e8,
          min: 1e4,
          max: 1e9,
          step: 1e5,
          label: `E concreto (${e.stress})`
        },
        {
          key: "nu",
          val: 0.2,
          min: 0,
          max: 0.49,
          step: 0.01,
          label: "v"
        },
        {
          key: "P",
          val: e.defaultForce * 10,
          min: 1,
          max: e.forceRange[1] * 50,
          step: e.forceRange[2] * 5,
          label: `P lateral (${e.force})`
        }
      ],
      "viga-q4": [
        {
          key: "L",
          val: 6,
          min: 1,
          max: 20,
          step: 0.5,
          label: `Luz L (${e.length})`
        },
        {
          key: "h",
          val: 0.5,
          min: 0.1,
          max: 3,
          step: 0.1,
          label: `Peralte h (${e.length})`
        },
        {
          key: "t",
          val: 0.2,
          min: 0.05,
          max: 1,
          step: 0.05,
          label: `Espesor t (${e.length})`
        },
        {
          key: "nx",
          val: 12,
          min: 2,
          max: 30,
          step: 1,
          label: "Mesh nx"
        },
        {
          key: "ny",
          val: 4,
          min: 2,
          max: 15,
          step: 1,
          label: "Mesh ny"
        },
        {
          key: "E",
          val: e.E * 25e6 / 2e8,
          min: 1e4,
          max: 1e9,
          step: 1e5,
          label: `E concreto (${e.stress})`
        },
        {
          key: "nu",
          val: 0.2,
          min: 0,
          max: 0.49,
          step: 0.01,
          label: "v"
        },
        {
          key: "P",
          val: e.defaultForce * 5,
          min: 1,
          max: e.forceRange[1] * 50,
          step: e.forceRange[2] * 2,
          label: `P puntual (${e.force})`
        }
      ],
      "placa-xy": [
        {
          key: "Lx",
          val: 4,
          min: 1,
          max: 15,
          step: 0.5,
          label: `Lx (${e.length})`
        },
        {
          key: "Ly",
          val: 2,
          min: 0.5,
          max: 10,
          step: 0.5,
          label: `Ly (${e.length})`
        },
        {
          key: "t",
          val: 0.15,
          min: 0.05,
          max: 0.5,
          step: 0.05,
          label: `Espesor t (${e.length})`
        },
        {
          key: "nx",
          val: 8,
          min: 2,
          max: 20,
          step: 1,
          label: "Mesh nx"
        },
        {
          key: "ny",
          val: 4,
          min: 2,
          max: 15,
          step: 1,
          label: "Mesh ny"
        },
        {
          key: "E",
          val: e.E * 25e6 / 2e8,
          min: 1e4,
          max: 1e9,
          step: 1e5,
          label: `E concreto (${e.stress})`
        },
        {
          key: "nu",
          val: 0.2,
          min: 0,
          max: 0.49,
          step: 0.01,
          label: "v"
        },
        {
          key: "P",
          val: e.defaultForce * 2,
          min: 1,
          max: e.forceRange[1] * 20,
          step: e.forceRange[2],
          label: `P borde (${e.force})`
        }
      ],
      eiffel: [],
      arco: [],
      puente: [],
      twisted: [],
      burj: [],
      opera: [],
      diagrid: [],
      talud: [
        {
          key: "H",
          val: 6,
          min: 2,
          max: 15,
          step: 0.5,
          label: `H (${e.length})`
        },
        {
          key: "angle",
          val: 45,
          min: 20,
          max: 70,
          step: 5,
          label: "Angulo (deg)"
        },
        {
          key: "bTop",
          val: 3,
          min: 1,
          max: 10,
          step: 0.5,
          label: `b top (${e.length})`
        },
        {
          key: "bBot",
          val: 3,
          min: 1,
          max: 10,
          step: 0.5,
          label: `b base (${e.length})`
        },
        {
          key: "meshSize",
          val: 0.8,
          min: 0.3,
          max: 3,
          step: 0.1,
          label: `Mesh (${e.length})`
        },
        {
          key: "E",
          val: e.E * 5e4 / 2e8,
          min: 100,
          max: 1e12,
          step: 1e3,
          label: `E (${e.stress})`
        },
        {
          key: "nu",
          val: 0.3,
          min: 0,
          max: 0.49,
          step: 0.01,
          label: "v"
        },
        {
          key: "gamma",
          val: 18,
          min: 5,
          max: 30,
          step: 1,
          label: `gamma (${e.force}/${e.length}\xB3)`
        },
        {
          key: "c",
          val: 15,
          min: 0,
          max: 100,
          step: 1,
          label: `Cohesion c (${e.stress})`
        },
        {
          key: "phi",
          val: 30,
          min: 0,
          max: 45,
          step: 1,
          label: "Friccion \u03C6 (deg)"
        },
        {
          key: "qs",
          val: 0,
          min: 0,
          max: 100,
          step: 5,
          label: `Sobrecarga (${e.stress})`
        }
      ]
    };
  }
  function Sl(e) {
    const y = e.force, [N, L, oe] = e.forceRange;
    return {
      truss: [
        {
          key: "CM",
          val: -e.defaultForce,
          min: N,
          max: 0,
          step: oe,
          label: `CM (${y})`
        },
        {
          key: "CV",
          val: 0,
          min: N,
          max: 0,
          step: oe,
          label: `CV (${y})`
        }
      ],
      beams: [
        {
          key: "CM",
          val: 0,
          min: N,
          max: 0,
          step: oe,
          label: `CM (${y})`
        },
        {
          key: "CV",
          val: 0,
          min: N,
          max: 0,
          step: oe,
          label: `CV (${y})`
        },
        {
          key: "Ex",
          val: e.defaultForce,
          min: N,
          max: L,
          step: oe,
          label: `Ex sismo (${y})`
        }
      ],
      "3d": [
        {
          key: "CM",
          val: 0,
          min: N,
          max: 0,
          step: oe,
          label: `CM (${y})`
        },
        {
          key: "CV",
          val: 0,
          min: N,
          max: 0,
          step: oe,
          label: `CV (${y})`
        },
        {
          key: "Ex",
          val: e.defaultForce * 3,
          min: N,
          max: L,
          step: oe,
          label: `Ex sismo (${y})`
        }
      ],
      frame: [
        {
          key: "CM",
          val: -e.defaultForce,
          min: N,
          max: 0,
          step: oe,
          label: `CM (${y})`
        },
        {
          key: "CV",
          val: 0,
          min: N,
          max: 0,
          step: oe,
          label: `CV (${y})`
        },
        {
          key: "Ex",
          val: 0,
          min: N,
          max: L,
          step: oe,
          label: `Ex sismo (${y})`
        }
      ],
      edificio: [
        {
          key: "CM",
          val: -e.defaultForce,
          min: N,
          max: 0,
          step: oe,
          label: `CM (${y})`
        },
        {
          key: "CV",
          val: 0,
          min: N,
          max: 0,
          step: oe,
          label: `CV (${y})`
        },
        {
          key: "Ex",
          val: 0,
          min: N,
          max: L,
          step: oe,
          label: `Ex sismo (${y})`
        },
        {
          key: "Ey",
          val: 0,
          min: N,
          max: L,
          step: oe,
          label: `Ey sismo (${y})`
        }
      ],
      galpon: [
        {
          key: "CM",
          val: -e.defaultForce,
          min: N,
          max: 0,
          step: oe,
          label: `CM (${y})`
        },
        {
          key: "CV",
          val: 0,
          min: N,
          max: 0,
          step: oe,
          label: `CV (${y})`
        }
      ],
      barra: [
        {
          key: "F",
          val: e.defaultForce * 10,
          min: e.forceRange[0] * 10,
          max: e.forceRange[1] * 10,
          step: Math.abs(e.forceRange[2]) * 5,
          label: `F axial (${y})`
        }
      ],
      "placa-3q": [
        {
          key: "CM",
          val: 0,
          min: N,
          max: 0,
          step: oe,
          label: `CM (${y})`
        }
      ],
      "placa-q4": [
        {
          key: "CM",
          val: 0,
          min: N,
          max: 0,
          step: oe,
          label: `CM (${y})`
        }
      ],
      "losa-rect": [],
      "losa-plana": [],
      "viga-alta": [],
      "muro-contencion": [],
      zapata: [],
      "placa-orificios": [],
      "col-placa": [],
      talud: [],
      "muro-q4": [],
      "viga-q4": [],
      "placa-xy": [],
      pergola: [
        {
          key: "Lx",
          val: 5.5,
          min: 2,
          max: 20,
          step: 0.5,
          label: `Lx ancho (${e.length})`
        },
        {
          key: "Ly",
          val: 8,
          min: 2,
          max: 30,
          step: 0.5,
          label: `Ly largo (${e.length})`
        },
        {
          key: "H1",
          val: 3,
          min: 1,
          max: 8,
          step: 0.25,
          label: `H1 izq (${e.length})`
        },
        {
          key: "H2",
          val: 4,
          min: 1,
          max: 8,
          step: 0.25,
          label: `H2 der (${e.length})`
        },
        {
          key: "nCol",
          val: 4,
          min: 2,
          max: 8,
          step: 1,
          label: "N columnas"
        },
        {
          key: "nCorr",
          val: 8,
          min: 3,
          max: 16,
          step: 1,
          label: "N correas"
        },
        {
          key: "E",
          val: e.E,
          min: 1e6,
          max: 1e12,
          step: 1e6,
          label: `E (${e.stress})`
        },
        {
          key: "t",
          val: 5e-4,
          min: 1e-4,
          max: 0.01,
          step: 1e-4,
          label: `t panel (${e.length})`
        },
        {
          key: "q",
          val: 1,
          min: 0.1,
          max: 20,
          step: 0.1,
          label: `q carga (${e.force}/${e.length}\xB2)`
        },
        {
          key: "colD",
          val: 0.16,
          min: 0.05,
          max: 0.5,
          step: 0.01,
          label: `Col d (${e.length})`
        },
        {
          key: "colBf",
          val: 0.16,
          min: 0.05,
          max: 0.5,
          step: 0.01,
          label: `Col bf (${e.length})`
        },
        {
          key: "colTf",
          val: 0.013,
          min: 3e-3,
          max: 0.05,
          step: 1e-3,
          label: `Col tf (${e.length})`
        },
        {
          key: "colTw",
          val: 8e-3,
          min: 3e-3,
          max: 0.05,
          step: 1e-3,
          label: `Col tw (${e.length})`
        },
        {
          key: "vigD",
          val: 0.2,
          min: 0.05,
          max: 0.5,
          step: 0.01,
          label: `Vig d (${e.length})`
        },
        {
          key: "vigBf",
          val: 0.1,
          min: 0.05,
          max: 0.5,
          step: 0.01,
          label: `Vig bf (${e.length})`
        },
        {
          key: "vigTf",
          val: 85e-4,
          min: 3e-3,
          max: 0.05,
          step: 1e-3,
          label: `Vig tf (${e.length})`
        },
        {
          key: "vigTw",
          val: 56e-4,
          min: 3e-3,
          max: 0.05,
          step: 1e-3,
          label: `Vig tw (${e.length})`
        },
        {
          key: "corrB",
          val: 0.06,
          min: 0.02,
          max: 0.2,
          step: 0.01,
          label: `Corr b (${e.length})`
        },
        {
          key: "corrT",
          val: 4e-3,
          min: 1e-3,
          max: 0.02,
          step: 1e-3,
          label: `Corr t (${e.length})`
        },
        {
          key: "supUx",
          val: 1,
          min: 0,
          max: 1,
          step: 1,
          label: "Apoyo Ux"
        },
        {
          key: "supUy",
          val: 1,
          min: 0,
          max: 1,
          step: 1,
          label: "Apoyo Uy"
        },
        {
          key: "supUz",
          val: 1,
          min: 0,
          max: 1,
          step: 1,
          label: "Apoyo Uz"
        },
        {
          key: "supRx",
          val: 1,
          min: 0,
          max: 1,
          step: 1,
          label: "Apoyo Rx"
        },
        {
          key: "supRy",
          val: 1,
          min: 0,
          max: 1,
          step: 1,
          label: "Apoyo Ry"
        },
        {
          key: "supRz",
          val: 1,
          min: 0,
          max: 1,
          step: 1,
          label: "Apoyo Rz"
        }
      ],
      eiffel: [],
      arco: [],
      puente: [],
      twisted: [],
      burj: [],
      opera: [],
      diagrid: []
    };
  }
  const $e = 64516e-8, P = 416231e-12, Z = 0.0254, xo = [
    {
      name: "W6x9",
      type: "W",
      A: 2.68 * $e,
      Iz: 16.4 * P,
      Iy: 2.2 * P,
      J: 0.0405 * P,
      d: 5.9 * Z,
      bf: 3.94 * Z
    },
    {
      name: "W6x15",
      type: "W",
      A: 4.43 * $e,
      Iz: 29.1 * P,
      Iy: 9.32 * P,
      J: 0.103 * P,
      d: 5.99 * Z,
      bf: 5.99 * Z
    },
    {
      name: "W6x20",
      type: "W",
      A: 5.87 * $e,
      Iz: 41.4 * P,
      Iy: 13.3 * P,
      J: 0.204 * P,
      d: 6.2 * Z,
      bf: 6.02 * Z
    },
    {
      name: "W8x10",
      type: "W",
      A: 2.96 * $e,
      Iz: 30.8 * P,
      Iy: 2.09 * P,
      J: 0.0426 * P,
      d: 7.89 * Z,
      bf: 3.94 * Z
    },
    {
      name: "W8x18",
      type: "W",
      A: 5.26 * $e,
      Iz: 61.9 * P,
      Iy: 7.97 * P,
      J: 0.172 * P,
      d: 8.14 * Z,
      bf: 5.25 * Z
    },
    {
      name: "W8x24",
      type: "W",
      A: 7.08 * $e,
      Iz: 82.7 * P,
      Iy: 18.3 * P,
      J: 0.346 * P,
      d: 7.93 * Z,
      bf: 6.5 * Z
    },
    {
      name: "W8x31",
      type: "W",
      A: 9.13 * $e,
      Iz: 110 * P,
      Iy: 37.1 * P,
      J: 0.536 * P,
      d: 8 * Z,
      bf: 7.995 * Z
    },
    {
      name: "W8x40",
      type: "W",
      A: 11.7 * $e,
      Iz: 146 * P,
      Iy: 49.1 * P,
      J: 0.871 * P,
      d: 8.25 * Z,
      bf: 8.07 * Z
    },
    {
      name: "W8x48",
      type: "W",
      A: 14.1 * $e,
      Iz: 184 * P,
      Iy: 60.9 * P,
      J: 1.45 * P,
      d: 8.5 * Z,
      bf: 8.11 * Z
    },
    {
      name: "W8x67",
      type: "W",
      A: 19.7 * $e,
      Iz: 272 * P,
      Iy: 88.6 * P,
      J: 3.54 * P,
      d: 9 * Z,
      bf: 8.28 * Z
    },
    {
      name: "W10x12",
      type: "W",
      A: 3.54 * $e,
      Iz: 53.8 * P,
      Iy: 2.18 * P,
      J: 0.0547 * P,
      d: 9.87 * Z,
      bf: 3.96 * Z
    },
    {
      name: "W10x22",
      type: "W",
      A: 6.49 * $e,
      Iz: 118 * P,
      Iy: 11.4 * P,
      J: 0.239 * P,
      d: 10.17 * Z,
      bf: 5.75 * Z
    },
    {
      name: "W10x33",
      type: "W",
      A: 9.71 * $e,
      Iz: 171 * P,
      Iy: 36.6 * P,
      J: 0.583 * P,
      d: 9.73 * Z,
      bf: 7.96 * Z
    },
    {
      name: "W10x49",
      type: "W",
      A: 14.4 * $e,
      Iz: 272 * P,
      Iy: 93.4 * P,
      J: 1.39 * P,
      d: 9.98 * Z,
      bf: 10 * Z
    },
    {
      name: "W10x68",
      type: "W",
      A: 20 * $e,
      Iz: 394 * P,
      Iy: 134 * P,
      J: 3.56 * P,
      d: 10.4 * Z,
      bf: 10.13 * Z
    },
    {
      name: "W10x100",
      type: "W",
      A: 29.4 * $e,
      Iz: 623 * P,
      Iy: 207 * P,
      J: 10.9 * P,
      d: 11.1 * Z,
      bf: 10.34 * Z
    },
    {
      name: "W12x14",
      type: "W",
      A: 4.16 * $e,
      Iz: 88.6 * P,
      Iy: 2.36 * P,
      J: 0.0704 * P,
      d: 11.91 * Z,
      bf: 3.97 * Z
    },
    {
      name: "W12x22",
      type: "W",
      A: 6.48 * $e,
      Iz: 156 * P,
      Iy: 4.66 * P,
      J: 0.293 * P,
      d: 12.31 * Z,
      bf: 4.03 * Z
    },
    {
      name: "W12x26",
      type: "W",
      A: 7.65 * $e,
      Iz: 204 * P,
      Iy: 17.3 * P,
      J: 0.3 * P,
      d: 12.22 * Z,
      bf: 6.49 * Z
    },
    {
      name: "W12x40",
      type: "W",
      A: 11.7 * $e,
      Iz: 310 * P,
      Iy: 44.1 * P,
      J: 0.906 * P,
      d: 11.94 * Z,
      bf: 8.01 * Z
    },
    {
      name: "W12x53",
      type: "W",
      A: 15.6 * $e,
      Iz: 425 * P,
      Iy: 95.8 * P,
      J: 1.58 * P,
      d: 12.06 * Z,
      bf: 9.99 * Z
    },
    {
      name: "W12x72",
      type: "W",
      A: 21.1 * $e,
      Iz: 597 * P,
      Iy: 195 * P,
      J: 4.05 * P,
      d: 12.25 * Z,
      bf: 12.04 * Z
    },
    {
      name: "W12x96",
      type: "W",
      A: 28.2 * $e,
      Iz: 833 * P,
      Iy: 270 * P,
      J: 8.44 * P,
      d: 12.71 * Z,
      bf: 12.16 * Z
    },
    {
      name: "W12x120",
      type: "W",
      A: 35.3 * $e,
      Iz: 1070 * P,
      Iy: 345 * P,
      J: 16 * P,
      d: 13.12 * Z,
      bf: 12.32 * Z
    },
    {
      name: "W14x22",
      type: "W",
      A: 6.49 * $e,
      Iz: 199 * P,
      Iy: 7 * P,
      J: 0.208 * P,
      d: 13.74 * Z,
      bf: 5 * Z
    },
    {
      name: "W14x30",
      type: "W",
      A: 8.85 * $e,
      Iz: 291 * P,
      Iy: 19.6 * P,
      J: 0.38 * P,
      d: 13.84 * Z,
      bf: 6.73 * Z
    },
    {
      name: "W14x38",
      type: "W",
      A: 11.2 * $e,
      Iz: 385 * P,
      Iy: 26.7 * P,
      J: 0.798 * P,
      d: 14.1 * Z,
      bf: 6.77 * Z
    },
    {
      name: "W14x48",
      type: "W",
      A: 14.1 * $e,
      Iz: 485 * P,
      Iy: 51.4 * P,
      J: 1.45 * P,
      d: 13.79 * Z,
      bf: 8.03 * Z
    },
    {
      name: "W14x61",
      type: "W",
      A: 17.9 * $e,
      Iz: 640 * P,
      Iy: 107 * P,
      J: 2.19 * P,
      d: 13.89 * Z,
      bf: 9.99 * Z
    },
    {
      name: "W14x82",
      type: "W",
      A: 24 * $e,
      Iz: 882 * P,
      Iy: 148 * P,
      J: 5.07 * P,
      d: 14.31 * Z,
      bf: 10.13 * Z
    },
    {
      name: "W14x109",
      type: "W",
      A: 32 * $e,
      Iz: 1240 * P,
      Iy: 447 * P,
      J: 7.12 * P,
      d: 14.32 * Z,
      bf: 14.61 * Z
    },
    {
      name: "W14x132",
      type: "W",
      A: 38.8 * $e,
      Iz: 1530 * P,
      Iy: 548 * P,
      J: 12.3 * P,
      d: 14.66 * Z,
      bf: 14.73 * Z
    },
    {
      name: "W14x176",
      type: "W",
      A: 51.8 * $e,
      Iz: 2140 * P,
      Iy: 838 * P,
      J: 23.7 * P,
      d: 15.22 * Z,
      bf: 15.65 * Z
    },
    {
      name: "W16x26",
      type: "W",
      A: 7.68 * $e,
      Iz: 301 * P,
      Iy: 9.59 * P,
      J: 0.262 * P,
      d: 15.69 * Z,
      bf: 5.5 * Z
    },
    {
      name: "W16x36",
      type: "W",
      A: 10.6 * $e,
      Iz: 448 * P,
      Iy: 24.5 * P,
      J: 0.545 * P,
      d: 15.86 * Z,
      bf: 6.99 * Z
    },
    {
      name: "W16x50",
      type: "W",
      A: 14.7 * $e,
      Iz: 659 * P,
      Iy: 37.2 * P,
      J: 1.52 * P,
      d: 16.26 * Z,
      bf: 7.07 * Z
    },
    {
      name: "W16x67",
      type: "W",
      A: 19.7 * $e,
      Iz: 954 * P,
      Iy: 119 * P,
      J: 2.39 * P,
      d: 16.33 * Z,
      bf: 10.24 * Z
    },
    {
      name: "W16x89",
      type: "W",
      A: 26.2 * $e,
      Iz: 1300 * P,
      Iy: 163 * P,
      J: 5.45 * P,
      d: 16.75 * Z,
      bf: 10.37 * Z
    },
    {
      name: "W18x35",
      type: "W",
      A: 10.3 * $e,
      Iz: 510 * P,
      Iy: 15.3 * P,
      J: 0.506 * P,
      d: 17.7 * Z,
      bf: 6 * Z
    },
    {
      name: "W18x50",
      type: "W",
      A: 14.7 * $e,
      Iz: 800 * P,
      Iy: 40.1 * P,
      J: 1.24 * P,
      d: 17.99 * Z,
      bf: 7.5 * Z
    },
    {
      name: "W18x71",
      type: "W",
      A: 20.8 * $e,
      Iz: 1170 * P,
      Iy: 60.3 * P,
      J: 3.49 * P,
      d: 18.47 * Z,
      bf: 7.64 * Z
    },
    {
      name: "W18x97",
      type: "W",
      A: 28.5 * $e,
      Iz: 1750 * P,
      Iy: 201 * P,
      J: 5.86 * P,
      d: 18.59 * Z,
      bf: 11.15 * Z
    },
    {
      name: "W21x44",
      type: "W",
      A: 13 * $e,
      Iz: 843 * P,
      Iy: 20.7 * P,
      J: 0.77 * P,
      d: 20.66 * Z,
      bf: 6.5 * Z
    },
    {
      name: "W21x62",
      type: "W",
      A: 18.3 * $e,
      Iz: 1330 * P,
      Iy: 57.5 * P,
      J: 1.83 * P,
      d: 20.99 * Z,
      bf: 8.24 * Z
    },
    {
      name: "W21x83",
      type: "W",
      A: 24.3 * $e,
      Iz: 1830 * P,
      Iy: 81.4 * P,
      J: 4.34 * P,
      d: 21.43 * Z,
      bf: 8.36 * Z
    },
    {
      name: "W21x111",
      type: "W",
      A: 32.7 * $e,
      Iz: 2670 * P,
      Iy: 274 * P,
      J: 6.83 * P,
      d: 21.51 * Z,
      bf: 12.34 * Z
    },
    {
      name: "W24x55",
      type: "W",
      A: 16.2 * $e,
      Iz: 1350 * P,
      Iy: 29.1 * P,
      J: 1.18 * P,
      d: 23.57 * Z,
      bf: 7.01 * Z
    },
    {
      name: "W24x76",
      type: "W",
      A: 22.4 * $e,
      Iz: 2100 * P,
      Iy: 82.5 * P,
      J: 2.68 * P,
      d: 23.92 * Z,
      bf: 8.99 * Z
    },
    {
      name: "W24x104",
      type: "W",
      A: 30.6 * $e,
      Iz: 3100 * P,
      Iy: 259 * P,
      J: 4.72 * P,
      d: 24.06 * Z,
      bf: 12.75 * Z
    },
    {
      name: "W24x131",
      type: "W",
      A: 38.5 * $e,
      Iz: 4020 * P,
      Iy: 340 * P,
      J: 9.5 * P,
      d: 24.48 * Z,
      bf: 12.86 * Z
    },
    {
      name: "W24x146",
      type: "W",
      A: 43 * $e,
      Iz: 4580 * P,
      Iy: 391 * P,
      J: 12.6 * P,
      d: 24.74 * Z,
      bf: 12.9 * Z
    },
    {
      name: "W24x176",
      type: "W",
      A: 51.7 * $e,
      Iz: 5680 * P,
      Iy: 479 * P,
      J: 21.2 * P,
      d: 25.24 * Z,
      bf: 12.9 * Z
    },
    {
      name: "W27x84",
      type: "W",
      A: 24.8 * $e,
      Iz: 2850 * P,
      Iy: 106 * P,
      J: 2.81 * P,
      d: 26.71 * Z,
      bf: 9.96 * Z
    },
    {
      name: "W27x114",
      type: "W",
      A: 33.5 * $e,
      Iz: 4090 * P,
      Iy: 159 * P,
      J: 6.77 * P,
      d: 27.29 * Z,
      bf: 10.07 * Z
    },
    {
      name: "W30x90",
      type: "W",
      A: 26.4 * $e,
      Iz: 3610 * P,
      Iy: 115 * P,
      J: 3.06 * P,
      d: 29.53 * Z,
      bf: 10.4 * Z
    },
    {
      name: "W30x116",
      type: "W",
      A: 34.2 * $e,
      Iz: 4930 * P,
      Iy: 164 * P,
      J: 6.43 * P,
      d: 30.01 * Z,
      bf: 10.5 * Z
    },
    {
      name: "W33x118",
      type: "W",
      A: 34.7 * $e,
      Iz: 5900 * P,
      Iy: 187 * P,
      J: 5.3 * P,
      d: 32.86 * Z,
      bf: 11.48 * Z
    },
    {
      name: "W36x135",
      type: "W",
      A: 39.7 * $e,
      Iz: 7800 * P,
      Iy: 225 * P,
      J: 7 * P,
      d: 35.55 * Z,
      bf: 11.95 * Z
    },
    {
      name: "HSS4x4x1/4",
      type: "HSS",
      A: 3.37 * $e,
      Iz: 8.22 * P,
      Iy: 8.22 * P,
      J: 13.4 * P,
      d: 4 * Z,
      bf: 4 * Z
    },
    {
      name: "HSS4x4x3/8",
      type: "HSS",
      A: 4.78 * $e,
      Iz: 10.7 * P,
      Iy: 10.7 * P,
      J: 17.9 * P,
      d: 4 * Z,
      bf: 4 * Z
    },
    {
      name: "HSS4x4x1/2",
      type: "HSS",
      A: 6.02 * $e,
      Iz: 12.3 * P,
      Iy: 12.3 * P,
      J: 21 * P,
      d: 4 * Z,
      bf: 4 * Z
    },
    {
      name: "HSS6x6x1/4",
      type: "HSS",
      A: 5.24 * $e,
      Iz: 30.3 * P,
      Iy: 30.3 * P,
      J: 48.3 * P,
      d: 6 * Z,
      bf: 6 * Z
    },
    {
      name: "HSS6x6x3/8",
      type: "HSS",
      A: 7.58 * $e,
      Iz: 41.1 * P,
      Iy: 41.1 * P,
      J: 66.9 * P,
      d: 6 * Z,
      bf: 6 * Z
    },
    {
      name: "HSS6x6x1/2",
      type: "HSS",
      A: 9.74 * $e,
      Iz: 49.6 * P,
      Iy: 49.6 * P,
      J: 82.2 * P,
      d: 6 * Z,
      bf: 6 * Z
    },
    {
      name: "HSS8x8x1/4",
      type: "HSS",
      A: 7.1 * $e,
      Iz: 70.7 * P,
      Iy: 70.7 * P,
      J: 112 * P,
      d: 8 * Z,
      bf: 8 * Z
    },
    {
      name: "HSS8x8x3/8",
      type: "HSS",
      A: 10.4 * $e,
      Iz: 98 * P,
      Iy: 98 * P,
      J: 158 * P,
      d: 8 * Z,
      bf: 8 * Z
    },
    {
      name: "HSS8x8x1/2",
      type: "HSS",
      A: 13.5 * $e,
      Iz: 122 * P,
      Iy: 122 * P,
      J: 199 * P,
      d: 8 * Z,
      bf: 8 * Z
    },
    {
      name: "HSS10x10x3/8",
      type: "HSS",
      A: 13.2 * $e,
      Iz: 202 * P,
      Iy: 202 * P,
      J: 323 * P,
      d: 10 * Z,
      bf: 10 * Z
    },
    {
      name: "HSS10x10x1/2",
      type: "HSS",
      A: 17.2 * $e,
      Iz: 254 * P,
      Iy: 254 * P,
      J: 412 * P,
      d: 10 * Z,
      bf: 10 * Z
    },
    {
      name: "HSS12x12x3/8",
      type: "HSS",
      A: 16 * $e,
      Iz: 355 * P,
      Iy: 355 * P,
      J: 564 * P,
      d: 12 * Z,
      bf: 12 * Z
    },
    {
      name: "HSS12x12x1/2",
      type: "HSS",
      A: 21 * $e,
      Iz: 452 * P,
      Iy: 452 * P,
      J: 724 * P,
      d: 12 * Z,
      bf: 12 * Z
    },
    {
      name: "HSS6x4x1/4",
      type: "HSS",
      A: 4.3 * $e,
      Iz: 18 * P,
      Iy: 9.58 * P,
      J: 22.6 * P,
      d: 6 * Z,
      bf: 4 * Z
    },
    {
      name: "HSS6x4x3/8",
      type: "HSS",
      A: 6.18 * $e,
      Iz: 23.8 * P,
      Iy: 12.3 * P,
      J: 30.3 * P,
      d: 6 * Z,
      bf: 4 * Z
    },
    {
      name: "HSS8x4x1/4",
      type: "HSS",
      A: 5.24 * $e,
      Iz: 33.6 * P,
      Iy: 11.8 * P,
      J: 33 * P,
      d: 8 * Z,
      bf: 4 * Z
    },
    {
      name: "HSS8x4x3/8",
      type: "HSS",
      A: 7.58 * $e,
      Iz: 45.1 * P,
      Iy: 15 * P,
      J: 44.5 * P,
      d: 8 * Z,
      bf: 4 * Z
    },
    {
      name: "HSS8x6x1/4",
      type: "HSS",
      A: 6.17 * $e,
      Iz: 46.1 * P,
      Iy: 28.2 * P,
      J: 61.3 * P,
      d: 8 * Z,
      bf: 6 * Z
    },
    {
      name: "HSS8x6x3/8",
      type: "HSS",
      A: 8.97 * $e,
      Iz: 63 * P,
      Iy: 37.5 * P,
      J: 84.6 * P,
      d: 8 * Z,
      bf: 6 * Z
    },
    {
      name: "HSS10x6x3/8",
      type: "HSS",
      A: 10.4 * $e,
      Iz: 103 * P,
      Iy: 47.1 * P,
      J: 115 * P,
      d: 10 * Z,
      bf: 6 * Z
    },
    {
      name: "HSS12x8x3/8",
      type: "HSS",
      A: 13.2 * $e,
      Iz: 196 * P,
      Iy: 102 * P,
      J: 249 * P,
      d: 12 * Z,
      bf: 8 * Z
    }
  ];
  function gn() {
    const e = {};
    return xo.forEach((y, N) => {
      y.type === "W" && (e[y.name] = N);
    }), e;
  }
  function hn() {
    const e = {};
    return xo.forEach((y, N) => {
      y.type === "HSS" && (e[y.name] = N);
    }), e;
  }
  function kl(e) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { nodes: y, elements: N, elementInputs: L, nodeInputs: oe, deformOutputs: V } = e, Q = y.length * 6, K = N.length, ne = N.filter((ce) => ce.length === 2).length, ge = N.filter((ce) => ce.length >= 3).length, Ee = document.createElement("div");
    Ee.className = "rpt-overlay";
    let A = "";
    A += '<button class="rpt-close" id="rpt-close">\u2715 Close</button>', A += "<h1>Finite Element Analysis \u2014 Step-by-Step Report</h1>", A += '<div class="rpt-subtitle">Complete FEM derivation from element formulation to final results</div>', A += '<hr class="rpt-sep"/>', A += "<h2>1. Input Data</h2>", A += '<table class="rpt-info"><tbody>', A += `<tr><td>Number of nodes</td><td class="val">${y.length}</td></tr>`, A += `<tr><td>Number of elements</td><td class="val">${K} (${ne} frames, ${ge} shells)</td></tr>`, A += '<tr><td>DOFs per node</td><td class="val">6 (u<sub>x</sub>, u<sub>y</sub>, u<sub>z</sub>, \u03B8<sub>x</sub>, \u03B8<sub>y</sub>, \u03B8<sub>z</sub>)</td></tr>', A += `<tr><td>Total DOFs</td><td class="val">${Q}</td></tr>`, A += "</tbody></table>", A += "<h3>1.1 Node Coordinates</h3>", A += '<table class="rpt-data"><thead><tr><th>Node</th><th>x</th><th>y</th><th>z</th></tr></thead><tbody>', y.forEach((ce, re) => {
      A += `<tr><td>${re}</td><td>${We(ce[0])}</td><td>${We(ce[1])}</td><td>${We(ce[2])}</td></tr>`;
    }), A += "</tbody></table>", A += "<h3>1.2 Element Connectivity</h3>", A += '<table class="rpt-data"><thead><tr><th>Elem</th><th>Type</th><th>Nodes</th><th>L</th><th>E</th><th>A</th><th>I<sub>z</sub></th><th>I<sub>y</sub></th></tr></thead><tbody>', N.forEach((ce, re) => {
      var _a2, _b2, _c2, _d2;
      const ie = ce.length === 2, he = ce.map((qe) => y[qe]), xe = ie ? Lo(ro(he[1], he[0])) : 0, Te = ((_a2 = L.elasticities) == null ? void 0 : _a2.get(re)) ?? 0, Ce = ((_b2 = L.areas) == null ? void 0 : _b2.get(re)) ?? 0, Pe = ((_c2 = L.momentsOfInertiaZ) == null ? void 0 : _c2.get(re)) ?? 0, Ue = ((_d2 = L.momentsOfInertiaY) == null ? void 0 : _d2.get(re)) ?? 0;
      A += `<tr><td>${re}</td><td>${ie ? "Frame" : "Shell"}</td><td>${ce.join(" \u2192 ")}</td>`, A += `<td>${We(xe)}</td><td>${We(Te)}</td><td>${We(Ce)}</td><td>${We(Pe)}</td><td>${We(Ue)}</td></tr>`;
    }), A += "</tbody></table>", A += "<h2>2. Element Formulation</h2>", ne > 0 && (A += "<h3>2.1 Frame Element (Euler-Bernoulli Beam)</h3>", A += "<p>Each frame element has 2 nodes and 12 DOFs: [u<sub>x</sub>, u<sub>y</sub>, u<sub>z</sub>, \u03B8<sub>x</sub>, \u03B8<sub>y</sub>, \u03B8<sub>z</sub>] per node.</p>", A += "<h4>2.1.1 Shape Functions</h4>", A += "<p><b>Axial</b> (linear interpolation):</p>", A += '<div class="rpt-eq">N\u2081(\u03BE) = 1 \u2212 \u03BE &nbsp;&nbsp;&nbsp; N\u2082(\u03BE) = \u03BE &nbsp;&nbsp;&nbsp; where \u03BE = x/L \u2208 [0, 1]</div>', A += "<p><b>Bending</b> (Hermite cubic polynomials):</p>", A += '<table class="rpt-eq-table"><tbody>', A += '<tr><td class="eq-name">H\u2081(\u03BE)</td><td>= 1 \u2212 3\u03BE\xB2 + 2\u03BE\xB3</td><td class="eq-desc">displacement at node i</td></tr>', A += '<tr><td class="eq-name">H\u2082(\u03BE)</td><td>= L\u03BE(1 \u2212 \u03BE)\xB2</td><td class="eq-desc">rotation at node i</td></tr>', A += '<tr><td class="eq-name">H\u2083(\u03BE)</td><td>= 3\u03BE\xB2 \u2212 2\u03BE\xB3</td><td class="eq-desc">displacement at node j</td></tr>', A += '<tr><td class="eq-name">H\u2084(\u03BE)</td><td>= L\u03BE\xB2(\u03BE \u2212 1)</td><td class="eq-desc">rotation at node j</td></tr>', A += "</tbody></table>", A += Il(), A += "<p><b>Torsion</b> (linear): same as axial.</p>", A += "<h4>2.1.2 Strain-Displacement Matrix B</h4>", A += "<p>The B matrix relates nodal displacements to internal strains:</p>", A += '<div class="rpt-eq">\u03B5<sub>axial</sub> = du/dx = (1/L)\xB7[\u22121, 1]\xB7{u<sub>i</sub>, u<sub>j</sub>}</div>', A += '<div class="rpt-eq">\u03BA<sub>bending</sub> = d\xB2v/dx\xB2 = B<sub>b</sub>\xB7{v<sub>i</sub>, \u03B8<sub>i</sub>, v<sub>j</sub>, \u03B8<sub>j</sub>}</div>', A += '<div class="rpt-eq">B<sub>b</sub>(\u03BE) = (1/L\xB2)\xB7[\u22126+12\u03BE, L(\u22124+6\u03BE), 6\u221212\u03BE, L(\u22122+6\u03BE)]</div>', A += '<div class="rpt-eq">\u03C6\u2032<sub>torsion</sub> = d\u03B8<sub>x</sub>/dx = (1/L)\xB7[\u22121, 1]\xB7{\u03B8<sub>xi</sub>, \u03B8<sub>xj</sub>}</div>', A += "<h4>2.1.3 Constitutive Relations D</h4>", A += '<table class="rpt-eq-table"><tbody>', A += '<tr><td class="eq-name">Axial:</td><td>\u03C3 = E\xB7\u03B5</td><td>\u2192 D<sub>axial</sub> = E\xB7A</td></tr>', A += '<tr><td class="eq-name">Bending Z:</td><td>M<sub>z</sub> = EI<sub>z</sub>\xB7\u03BA</td><td>\u2192 D<sub>bz</sub> = E\xB7I<sub>z</sub></td></tr>', A += '<tr><td class="eq-name">Bending Y:</td><td>M<sub>y</sub> = EI<sub>y</sub>\xB7\u03BA</td><td>\u2192 D<sub>by</sub> = E\xB7I<sub>y</sub></td></tr>', A += '<tr><td class="eq-name">Torsion:</td><td>T = GJ\xB7\u03C6\u2032</td><td>\u2192 D<sub>torsion</sub> = G\xB7J</td></tr>', A += "</tbody></table>", A += "<h4>2.1.4 Local Stiffness Matrix K<sub>local</sub></h4>", A += "<p>Obtained by analytical integration:</p>", A += '<div class="rpt-eq rpt-eq-highlight">K<sub>local</sub> = \u222B\u2080\u1D38 B\u1D40\xB7D\xB7B dx</div>', A += "<p>Result for Euler-Bernoulli beam (12\xD712 symmetric):</p>", A += '<div class="rpt-eq-small">', A += "K[0,0] = EA/L &nbsp;&nbsp; K[1,1] = 12EI<sub>z</sub>/L\xB3 &nbsp;&nbsp; K[2,2] = 12EI<sub>y</sub>/L\xB3 &nbsp;&nbsp; K[3,3] = GJ/L<br/>", A += "K[4,4] = 4EI<sub>y</sub>/L &nbsp;&nbsp; K[5,5] = 4EI<sub>z</sub>/L &nbsp;&nbsp; K[1,5] = 6EI<sub>z</sub>/L\xB2 &nbsp;&nbsp; K[2,4] = \u22126EI<sub>y</sub>/L\xB2", A += "</div>", A += "<h4>2.1.5 Transformation Matrix T</h4>", A += "<p>Direction cosines of element axis:</p>", A += '<div class="rpt-eq">l = (x<sub>j</sub>\u2212x<sub>i</sub>)/L &nbsp;&nbsp; m = (y<sub>j</sub>\u2212y<sub>i</sub>)/L &nbsp;&nbsp; n = (z<sub>j</sub>\u2212z<sub>i</sub>)/L &nbsp;&nbsp; D = \u221A(l\xB2+m\xB2)</div>', A += '<div class="rpt-eq">\u03BB = [l, m, n; \u2212m/D, l/D, 0; \u2212ln/D, \u2212mn/D, D] &nbsp;&nbsp; (3\xD73)</div>', A += '<div class="rpt-eq rpt-eq-highlight">T = I\u2084 \u2297 \u03BB &nbsp;&nbsp; (12\xD712 block-diagonal, Kronecker product)</div>', A += "<p>Special case for vertical elements (n = \xB11): \u03BB uses fixed axes.</p>", A += "<h4>2.1.6 Global Stiffness Matrix</h4>", A += '<div class="rpt-eq rpt-eq-highlight">K<sub>global</sub> = T\u1D40 \xB7 K<sub>local</sub> \xB7 T</div>'), A += "<h2>3. Numerical Results per Element</h2>", A += "<p>For each element, we compute K<sub>local</sub>, T, and K<sub>global</sub> = T\u1D40\xB7K\xB7T with the actual properties:</p>";
    for (let ce = 0; ce < K; ce++) {
      const re = N[ce], ie = re.map((Nt) => y[Nt]);
      if (!(re.length === 2)) continue;
      const xe = Lo(ro(ie[1], ie[0])), Te = ((_a = L.elasticities) == null ? void 0 : _a.get(ce)) ?? 0, Ce = ((_b = L.areas) == null ? void 0 : _b.get(ce)) ?? 0, Pe = ((_c = L.momentsOfInertiaZ) == null ? void 0 : _c.get(ce)) ?? 0, Ue = ((_d = L.momentsOfInertiaY) == null ? void 0 : _d.get(ce)) ?? 0, qe = ((_e = L.shearModuli) == null ? void 0 : _e.get(ce)) ?? 0, Ge = ((_f = L.torsionalConstants) == null ? void 0 : _f.get(ce)) ?? 0;
      let nt = null, Xe = null, Ze = null;
      try {
        nt = $n(ie, L, ce), Xe = wn(ie), Ze = Jt(ps(Xe), Jt(nt, Xe));
      } catch {
        continue;
      }
      const Ye = ro(ie[1], ie[0]), xt = Ye[0] / xe, io = Ye[1] / xe, qt = Ye[2] / xe;
      A += '<div class="rpt-elem-block">', A += `<h3 class="rpt-elem-title" data-toggle="elem${ce}">\u25B6 Element ${ce} \u2014 Nodes ${re[0]} \u2192 ${re[1]}, L = ${We(xe)}</h3>`, A += `<div id="rpt-elem${ce}" class="rpt-elem-body" style="display:none">`, A += "<h4>Properties (numerical substitution)</h4>", A += '<div class="rpt-eq-small">', A += `E = ${We(Te)} &nbsp;&nbsp; A = ${We(Ce)} &nbsp;&nbsp; I<sub>z</sub> = ${We(Pe)} &nbsp;&nbsp; I<sub>y</sub> = ${We(Ue)} &nbsp;&nbsp; G = ${We(qe)} &nbsp;&nbsp; J = ${We(Ge)}<br/>`, A += `EA/L = ${We(Te)}\xB7${We(Ce)}/${We(xe)} = <b>${We(Te * Ce / xe)}</b><br/>`, A += `12EI<sub>z</sub>/L\xB3 = 12\xB7${We(Te)}\xB7${We(Pe)}/${We(xe)}\xB3 = <b>${We(12 * Te * Pe / xe ** 3)}</b><br/>`, A += `12EI<sub>y</sub>/L\xB3 = 12\xB7${We(Te)}\xB7${We(Ue)}/${We(xe)}\xB3 = <b>${We(12 * Te * Ue / xe ** 3)}</b><br/>`, A += `GJ/L = ${We(qe)}\xB7${We(Ge)}/${We(xe)} = <b>${We(qe * Ge / xe)}</b>`, A += "</div>", A += "<h4>Direction cosines</h4>", A += `<div class="rpt-eq-small">l = ${xn(xt)}, m = ${xn(io)}, n = ${xn(qt)}, D = ${xn(Math.sqrt(xt ** 2 + io ** 2))}</div>`, A += "<h4>K<sub>local</sub> (12\xD712)</h4>", A += as(nt, 12), A += "<h4>T \u2014 Transformation (12\xD712)</h4>", A += as(Xe, 12), A += "<h4>K<sub>global</sub> = T\u1D40 \xB7 K<sub>local</sub> \xB7 T</h4>", A += as(Ze, 12), A += "<h4>Assembly</h4>", A += `<div class="rpt-eq-small">Global DOFs: node ${re[0]} \u2192 [${re[0] * 6}..${re[0] * 6 + 5}], node ${re[1]} \u2192 [${re[1] * 6}..${re[1] * 6 + 5}]</div>`, A += "</div></div>";
    }
    A += "<h2>4. Global Assembly</h2>", A += `<div class="rpt-eq rpt-eq-highlight">K<sub>total</sub> = \u03A3<sub>e=0</sub><sup>${K - 1}</sup> (T<sub>e</sub>\u1D40 \xB7 k<sub>e</sub> \xB7 T<sub>e</sub>)</div>`, A += "<p>Each element contributes its K<sub>global</sub> to the positions determined by its node DOF indices.</p>", A += zl(N, y.length), A += "<h2>5. Boundary Conditions</h2>";
    const J = [
      "u<sub>x</sub>",
      "u<sub>y</sub>",
      "u<sub>z</sub>",
      "\u03B8<sub>x</sub>",
      "\u03B8<sub>y</sub>",
      "\u03B8<sub>z</sub>"
    ], Se = [];
    if (A += "<h3>5.1 Supports (fixed DOFs)</h3>", oe.supports && oe.supports.size > 0) {
      A += '<table class="rpt-data"><thead><tr><th>Node</th>';
      for (const ce of J) A += `<th>${ce}</th>`;
      A += "</tr></thead><tbody>", oe.supports.forEach((ce, re) => {
        A += `<tr><td>${re}</td>`, ce.forEach((ie, he) => {
          ie && Se.push(re * 6 + he), A += `<td class="${ie ? "fixed" : ""}">${ie ? "Fixed" : "Free"}</td>`;
        }), A += "</tr>";
      }), A += "</tbody></table>";
    }
    if (A += `<div class="rpt-eq-small">Fixed DOFs: [${Se.join(", ")}] \u2192 ${Se.length} constraints<br/>`, A += `Free DOFs: ${Q} \u2212 ${Se.length} = <b>${Q - Se.length}</b></div>`, A += "<h3>5.2 Applied Loads</h3>", oe.loads && oe.loads.size > 0) {
      A += '<table class="rpt-data"><thead><tr><th>Node</th>';
      const ce = [
        "F<sub>x</sub>",
        "F<sub>y</sub>",
        "F<sub>z</sub>",
        "M<sub>x</sub>",
        "M<sub>y</sub>",
        "M<sub>z</sub>"
      ];
      for (const re of ce) A += `<th>${re}</th>`;
      A += "</tr></thead><tbody>", oe.loads.forEach((re, ie) => {
        A += `<tr><td>${ie}</td>`, re.forEach((he) => {
          const xe = Math.abs(he) > 1e-10;
          A += `<td class="${xe ? "nz" : ""}">${xe ? We(he) : "0"}</td>`;
        }), A += "</tr>";
      }), A += "</tbody></table>";
    }
    if (A += "<h2>6. Solution</h2>", A += "<p>After removing fixed DOFs, the reduced system is:</p>", A += '<div class="rpt-eq rpt-eq-highlight">K<sub>free</sub> \xB7 u<sub>free</sub> = F<sub>free</sub></div>', A += "<p>Solved using LU decomposition with partial pivoting (sparse matrix).</p>", A += "<h3>6.1 Nodal Displacements</h3>", V == null ? void 0 : V.deformations) {
      A += '<table class="rpt-data"><thead><tr><th>Node</th>';
      for (const ce of J) A += `<th>${ce}</th>`;
      A += "</tr></thead><tbody>", V.deformations.forEach((ce, re) => {
        A += `<tr><td>${re}</td>`, ce.forEach((ie) => {
          const he = Math.abs(ie) > 1e-10;
          A += `<td class="${he ? "nz" : ""}">${We(ie, 6)}</td>`;
        }), A += "</tr>";
      }), A += "</tbody></table>";
    }
    if (A += "<h3>6.2 Reactions</h3>", A += '<div class="rpt-eq">R = K<sub>total</sub> \xB7 u (extract at fixed DOFs)</div>', V == null ? void 0 : V.reactions) {
      A += '<table class="rpt-data"><thead><tr><th>Node</th>';
      for (const ce of J) A += `<th>${ce}</th>`;
      A += "</tr></thead><tbody>", V.reactions.forEach((ce, re) => {
        A += `<tr><td>${re}</td>`, ce.forEach((ie) => {
          const he = Math.abs(ie) > 1e-10;
          A += `<td class="${he ? "nz-react" : ""}">${he ? We(ie, 4) : "0"}</td>`;
        }), A += "</tr>";
      }), A += "</tbody></table>";
    }
    if (A += "<h2>7. Internal Forces</h2>", A += "<p>For each element, transform global displacements to local and multiply by K<sub>local</sub>:</p>", A += '<div class="rpt-eq">u<sub>local</sub> = T \xB7 u<sub>global</sub></div>', A += '<div class="rpt-eq rpt-eq-highlight">f<sub>local</sub> = K<sub>local</sub> \xB7 u<sub>local</sub></div>', V == null ? void 0 : V.deformations) {
      const ce = [
        "N",
        "V<sub>y</sub>",
        "V<sub>z</sub>",
        "M<sub>x</sub>",
        "M<sub>y</sub>",
        "M<sub>z</sub>"
      ];
      A += '<table class="rpt-data"><thead><tr><th>Elem</th><th>Nodes</th>';
      for (const re of ce) A += `<th>${re}<sub>i</sub></th>`;
      for (const re of ce) A += `<th>${re}<sub>j</sub></th>`;
      A += "</tr></thead><tbody>";
      for (let re = 0; re < K; re++) {
        const ie = N[re];
        if (ie.length !== 2) continue;
        const he = ie.map((xe) => y[xe]);
        try {
          const xe = $n(he, L, re), Te = wn(he), Ce = [];
          for (const qe of ie) {
            const Ge = ((_g = V.deformations) == null ? void 0 : _g.get(qe)) || [
              0,
              0,
              0,
              0,
              0,
              0
            ];
            Ce.push(...Ge);
          }
          const Pe = Jt(Te, Ce), Ue = Jt(xe, Pe);
          A += `<tr><td>${re}</td><td>${ie.join("\u2192")}</td>`;
          for (let qe = 0; qe < 12; qe++) {
            const Ge = Math.abs(Ue[qe]) > 1e-10;
            A += `<td class="${Ge ? "nz" : ""}">${We(Ue[qe], 2)}</td>`;
          }
          A += "</tr>";
        } catch {
        }
      }
      A += "</tbody></table>";
    }
    const be = `
    <style>
      .rpt-overlay {
        position: fixed; inset: 0; z-index: 9999999;
        background: #fff; color: #222;
        overflow-y: auto; padding: 30px 50px;
        font-family: 'Georgia Pro', 'Century Schoolbook', 'Times New Roman', serif;
        font-size: 12pt; line-height: 160%;
        max-width: 1000px; margin: 0 auto;
      }
      .rpt-overlay h1 { font-family: 'Arial Nova', Helvetica, sans-serif; font-size: 22pt; color: #003366; margin: 0 0 4px 0; }
      .rpt-overlay h2 { font-family: 'Arial Nova', Helvetica, sans-serif; font-size: 16pt; color: #003366; margin: 28px 0 12px 0; border-bottom: 2px solid #003366; padding-bottom: 4px; }
      .rpt-overlay h3 { font-family: 'Arial Nova', Helvetica, sans-serif; font-size: 13pt; color: #005599; margin: 20px 0 8px 0; }
      .rpt-overlay h4 { font-family: 'Arial Nova', Helvetica, sans-serif; font-size: 11pt; color: #666; margin: 14px 0 6px 0; }
      .rpt-overlay p { margin: 6px 0; }
      .rpt-subtitle { color: #666; font-style: italic; margin-bottom: 8px; }
      .rpt-sep { border: none; border-top: 1px solid #ccc; margin: 16px 0; }

      .rpt-close { position: fixed; top: 12px; right: 20px; background: #003366; color: #fff; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer; font-size: 13px; z-index: 10000000; }
      .rpt-close:hover { background: #005599; }

      .rpt-info { border-collapse: collapse; margin: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 11pt; }
      .rpt-info td { padding: 3px 16px 3px 0; }
      .rpt-info .val { color: #06d; font-weight: bold; }

      .rpt-data { border-collapse: collapse; margin: 8px 0; font-family: 'Consolas', monospace; font-size: 10pt; width: 100%; }
      .rpt-data th { background: #f0f4f8; color: #003366; padding: 4px 8px; border: 1px solid #ccc; text-align: center; font-size: 9pt; }
      .rpt-data td { padding: 3px 8px; border: 1px solid #ddd; text-align: right; }
      .rpt-data td.nz { color: #06d; font-weight: bold; }
      .rpt-data td.nz-react { color: #c44; font-weight: bold; }
      .rpt-data td.fixed { color: #c44; font-weight: bold; background: #fff0f0; }

      .rpt-eq { background: #f8f9fb; border-left: 3px solid #06d; padding: 8px 14px; margin: 8px 0; font-family: 'Georgia Pro', serif; font-size: 12pt; color: #06d; }
      .rpt-eq-highlight { background: #eef6ff; border-left: 4px solid #003366; font-weight: bold; }
      .rpt-eq-small { background: #fafafa; border-left: 2px solid #ccc; padding: 6px 12px; margin: 6px 0; font-family: 'Consolas', monospace; font-size: 10pt; color: #333; line-height: 180%; }

      .rpt-eq-table { border-collapse: collapse; margin: 6px 0; }
      .rpt-eq-table td { padding: 3px 12px; vertical-align: top; }
      .rpt-eq-table .eq-name { color: #06d; font-weight: bold; font-family: serif; }
      .rpt-eq-table .eq-desc { color: #888; font-style: italic; font-size: 10pt; }

      .rpt-mtx { border-collapse: collapse; font-family: 'Consolas', monospace; font-size: 9pt; margin: 6px 0; }
      .rpt-mtx td { padding: 2px 6px; text-align: right; border: 1px solid #e0e0e0; min-width: 55px; }
      .rpt-mtx td.z { color: #ccc; }
      .rpt-mtx td.diag { background: #eef6ff; color: #06d; font-weight: bold; }

      .rpt-elem-block { margin: 4px 0; border-left: 3px solid #e0e0e0; padding-left: 12px; }
      .rpt-elem-title { cursor: pointer; color: #005599; }
      .rpt-elem-title:hover { color: #08d; }
      .rpt-elem-body { margin: 4px 0 16px 0; }

      .rpt-assembly-map { border-collapse: collapse; margin: 8px 0; }
      .rpt-assembly-map td { width: 16px; height: 16px; text-align: center; font-size: 8px; padding: 0; border: 1px solid #eee; }

      @media print {
        .rpt-close { display: none; }
        .rpt-overlay { position: static; padding: 10mm; }
      }
    </style>
  `;
    return Ee.innerHTML = be + A, (_h = Ee.querySelector("#rpt-close")) == null ? void 0 : _h.addEventListener("click", () => Ee.remove()), Ee.querySelectorAll("[data-toggle]").forEach((ce) => {
      ce.addEventListener("click", () => {
        const re = ce.dataset.toggle, ie = Ee.querySelector(`#rpt-${re}`);
        if (ie) {
          const he = ie.style.display !== "none";
          ie.style.display = he ? "none" : "", ce.textContent = ce.textContent.replace(/^[▼▶]/, he ? "\u25B6" : "\u25BC");
        }
      });
    }), Ee;
  }
  function We(e, y = 2) {
    return Math.abs(e) < 1e-10 ? "0" : Math.abs(e) >= 1e7 || Math.abs(e) < 0.01 && e !== 0 ? e.toExponential(y) : e.toFixed(y);
  }
  function xn(e) {
    return Math.abs(e) < 1e-10 ? "0" : e.toFixed(4);
  }
  function as(e, y) {
    var _a;
    const N = Math.min(y, 12);
    let L = '<div style="overflow-x:auto"><table class="rpt-mtx">';
    for (let oe = 0; oe < N; oe++) {
      L += "<tr>";
      for (let V = 0; V < N; V++) {
        const Q = ((_a = e[oe]) == null ? void 0 : _a[V]) ?? 0, K = Math.abs(Q) < 1e-10;
        L += `<td class="${K ? "z" : ""} ${oe === V && !K ? "diag" : ""}">${K ? "0" : El(Q)}</td>`;
      }
      L += "</tr>";
    }
    return L += "</table>", y > N && (L += `<div style="color:#888;font-size:9pt">(showing ${N}\xD7${N} of ${y}\xD7${y})</div>`), L += "</div>", L;
  }
  function El(e) {
    return Math.abs(e) >= 1e6 || Math.abs(e) < 0.01 && e !== 0 ? e.toExponential(1) : Math.abs(e) >= 100 ? e.toFixed(0) : e.toFixed(2);
  }
  function Il() {
    const Q = [
      {
        name: "H\u2081",
        color: "#c44",
        fn: (ne) => 1 - 3 * ne ** 2 + 2 * ne ** 3
      },
      {
        name: "H\u2082/L",
        color: "#2a9d8f",
        fn: (ne) => ne * (1 - ne) ** 2
      },
      {
        name: "H\u2083",
        color: "#264653",
        fn: (ne) => 3 * ne ** 2 - 2 * ne ** 3
      },
      {
        name: "H\u2084/L",
        color: "#e9c46a",
        fn: (ne) => ne ** 2 * (ne - 1)
      }
    ];
    let K = '<svg viewBox="0 0 600 180" style="width:100%;max-width:600px;border:1px solid #ddd;border-radius:4px;margin:8px 0;background:#fafafa">';
    K += `<line x1="30" y1="${180 / 2}" x2="570" y2="${180 / 2}" stroke="#ccc" stroke-width="1"/>`, K += '<line x1="30" y1="20" x2="30" y2="160" stroke="#ccc" stroke-width="1"/>', K += `<text x="${600 / 2}" y="175" fill="#888" font-size="10" text-anchor="middle" font-family="sans-serif">\u03BE (0 \u2192 1)</text>`, K += `<text x="25" y="${180 / 2 - 60 - 5}" fill="#888" font-size="9" text-anchor="end" font-family="sans-serif">1</text>`, K += `<text x="25" y="${180 / 2 + 4}" fill="#888" font-size="9" text-anchor="end" font-family="sans-serif">0</text>`;
    for (const ne of Q) {
      let ge = "";
      for (let Se = 0; Se <= 80; Se++) {
        const be = Se / 80, ce = 30 + be * 540, re = 180 / 2 - ne.fn(be) * 60;
        ge += (Se === 0 ? "M" : "L") + `${ce.toFixed(1)},${re.toFixed(1)}`;
      }
      K += `<path d="${ge}" fill="none" stroke="${ne.color}" stroke-width="2.5"/>`;
      const Ee = 0.75, A = 30 + Ee * 540 + 8, J = 180 / 2 - ne.fn(Ee) * 60 - 6;
      K += `<text x="${A}" y="${J}" fill="${ne.color}" font-size="11" font-weight="bold" font-family="sans-serif">${ne.name}</text>`;
    }
    return K += "</svg>", K;
  }
  function zl(e, y) {
    const N = y * 6, L = Math.min(N, 30);
    let oe = "<p>Assembly contribution map (number = how many elements contribute to each K<sub>total</sub> entry):</p>";
    oe += '<div style="overflow-x:auto"><table class="rpt-assembly-map">', oe += "<tr><td></td>";
    for (let Q = 0; Q < L; Q++) oe += `<td style="color:#003366;font-weight:bold;font-size:7px">${Q}</td>`;
    oe += "</tr>";
    const V = Array.from({
      length: L
    }, () => Array(L).fill(0));
    for (let Q = 0; Q < e.length; Q++) {
      const K = e[Q].map((ne) => ne * 6);
      for (const ne of K) for (const ge of K) for (let Ee = 0; Ee < 6; Ee++) for (let A = 0; A < 6; A++) {
        const J = ne + Ee, Se = ge + A;
        J < L && Se < L && V[J][Se]++;
      }
    }
    for (let Q = 0; Q < L; Q++) {
      oe += `<tr><td style="color:#003366;font-weight:bold;font-size:7px">${Q}</td>`;
      for (let K = 0; K < L; K++) {
        const ne = V[Q][K], ge = ne === 0 ? "#fff" : ne === 1 ? "#e8f0fe" : ne === 2 ? "#c6dcf5" : "#a0c4e8", Ee = ne === 0 ? "" : ne.toString();
        oe += `<td style="background:${ge};color:#003366">${Ee}</td>`;
      }
      oe += "</tr>";
    }
    return oe += "</table></div>", N > L && (oe += `<div style="color:#888;font-size:9pt">(showing ${L}\xD7${L} of ${N}\xD7${N})</div>`), oe;
  }
  let ls = false;
  function Ll(e) {
    if (ls || window.katex) {
      ls = true, e();
      return;
    }
    const y = document.createElement("link");
    y.rel = "stylesheet", y.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css", document.head.appendChild(y);
    const N = document.createElement("script");
    N.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js", N.onload = () => {
      ls = true, e();
    }, document.head.appendChild(N);
  }
  function pa(e, y = false) {
    try {
      if (window.katex) return window.katex.renderToString(e, {
        displayMode: y,
        throwOnError: false
      });
    } catch {
    }
    return `<code class="er-tex-fallback">${e}</code>`;
  }
  function Tl(e, y, N, L, oe, V) {
    var _a, _b, _c, _d, _e, _f;
    const Q = N[e], K = Q.map((Xe) => y[Xe]), ne = Q.length === 2, ge = ne ? Lo(ro(K[1], K[0])) : 0, Ee = ((_a = L.elasticities) == null ? void 0 : _a.get(e)) ?? 0, A = ((_b = L.areas) == null ? void 0 : _b.get(e)) ?? 0, J = ((_c = L.momentsOfInertiaZ) == null ? void 0 : _c.get(e)) ?? 0, Se = ((_d = L.momentsOfInertiaY) == null ? void 0 : _d.get(e)) ?? 0, be = ((_e = L.shearModuli) == null ? void 0 : _e.get(e)) ?? 0, ce = ((_f = L.torsionalConstants) == null ? void 0 : _f.get(e)) ?? 0;
    let re = null, ie = null, he = null;
    try {
      re = $n(K, L, e), ie = wn(K), he = Jt(ps(ie), Jt(re, ie));
    } catch {
    }
    const xe = ne ? ro(K[1], K[0]) : [
      0,
      0,
      0
    ], Te = ge > 0 ? xe[0] / ge : 0, Ce = ge > 0 ? xe[1] / ge : 0, Pe = ge > 0 ? xe[2] / ge : 0, Ue = Math.sqrt(Te ** 2 + Ce ** 2), qe = [];
    if ((oe == null ? void 0 : oe.deformations) && ne) for (const Xe of Q) {
      const Ze = oe.deformations.get(Xe) || [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      qe.push(...Ze);
    }
    let Ge = [], nt = [];
    if (qe.length === 12 && ie && re) {
      try {
        Ge = Jt(ie, qe);
      } catch {
        Ge = Array(12).fill(0);
      }
      try {
        nt = Jt(re, Ge);
      } catch {
        nt = Array(12).fill(0);
      }
    }
    return {
      elemIdx: e,
      elem: Q,
      elmNodes: K,
      isFrame: ne,
      L: ge,
      E: Ee,
      A,
      Iz: J,
      Iy: Se,
      G: be,
      J: ce,
      kLocal: re,
      T: ie,
      kGlobal: he,
      l: Te,
      m: Ce,
      n: Pe,
      D: Ue,
      uGlobal: qe,
      uLocal: Ge,
      fLocal: nt,
      dOut: oe,
      aOut: V,
      totalNodes: y.length
    };
  }
  function Cl(e, y, N, L, oe, V) {
    var _a, _b;
    const Q = Tl(e, y, N, L, oe, V), K = document.createElement("div");
    return K.className = "er-panel", K.innerHTML = ql + `
    <div class="er-header">
      <span class="er-badge">Element ${e}</span>
      <span class="er-type">${Q.isFrame ? "Frame" : "Shell"} \u2014 Nodes ${Q.elem.join(" \u2192 ")} \u2014 L = ${Ae(Q.L)}</span>
      <button class="er-fullscreen" id="er-fullscreen" title="Pantalla completa">\u26F6</button>
      <button class="er-close" id="er-close">\u2715</button>
    </div>
    <div class="er-tabs">
      <button class="er-tab active" data-tab="tabla">Tabla</button>
      <button class="er-tab" data-tab="math">Matematica Explicada</button>
      <button class="er-tab" data-tab="resumen">Resumen</button>
    </div>
    <div class="er-body" id="er-body-tabla">${Al(Q)}</div>
    <div class="er-body" id="er-body-math" style="display:none">${fa(Q)}</div>
    <div class="er-body" id="er-body-resumen" style="display:none">${Fl(Q)}</div>
  `, K.querySelectorAll(".er-tab").forEach((ne) => {
      ne.addEventListener("click", () => {
        K.querySelectorAll(".er-tab").forEach((Ee) => Ee.classList.remove("active")), ne.classList.add("active");
        const ge = ne.dataset.tab;
        K.querySelectorAll(".er-body").forEach((Ee) => Ee.style.display = "none"), K.querySelector(`#er-body-${ge}`).style.display = "";
      });
    }), (_a = K.querySelector("#er-close")) == null ? void 0 : _a.addEventListener("click", () => K.remove()), (_b = K.querySelector("#er-fullscreen")) == null ? void 0 : _b.addEventListener("click", () => {
      const ne = K.classList.toggle("er-fullscreen-mode"), ge = K.querySelector("#er-fullscreen");
      ge && (ge.textContent = ne ? "\u22A1" : "\u26F6");
    }), setTimeout(() => {
      const ne = K.querySelector("#er-sf-canvas");
      ne && rs(ne);
      const ge = K.querySelector("#er-sf-canvas-math");
      ge && rs(ge);
    }, 50), Ll(() => {
      const ne = K.querySelector("#er-body-math");
      ne && (ne.innerHTML = fa(Q)), setTimeout(() => {
        const ge = K.querySelector("#er-sf-canvas-math");
        ge && rs(ge);
      }, 50), K.querySelectorAll(".er-deriv-header").forEach((ge) => {
        ge.addEventListener("click", () => {
          const Ee = ge.dataset.toggle, A = K.querySelector(`#er-${Ee}`);
          A && (A.style.display = A.style.display === "none" ? "" : "none");
        });
      });
    }), K;
  }
  function Al(e) {
    let y = "";
    if (y += '<div class="er-section-title">1. Propiedades</div>', y += '<table class="er-props">', y += `<tr><td>E</td><td>${Ae(e.E)}</td><td>A</td><td>${Ae(e.A)}</td></tr>`, y += `<tr><td>I<sub>z</sub></td><td>${Ae(e.Iz)}</td><td>I<sub>y</sub></td><td>${Ae(e.Iy)}</td></tr>`, y += `<tr><td>G</td><td>${Ae(e.G)}</td><td>J</td><td>${Ae(e.J)}</td></tr>`, y += "</table>", e.kLocal && (y += `<div class="er-section-title">2. K<sub>local</sub> (${e.kLocal.length}\xD7${e.kLocal.length})</div>`, y += sn(e.kLocal)), e.T && (y += '<div class="er-section-title">3. T \u2014 Transformaci\xF3n</div>', y += sn(e.T)), e.kGlobal && (y += '<div class="er-section-title">4. K<sub>global</sub> = T<sup>T</sup>\xB7K\xB7T</div>', y += sn(e.kGlobal)), y += '<div class="er-section-title">5. Desplazamientos</div>', e.uGlobal.length > 0) {
      const N = [
        "u<sub>x</sub>",
        "u<sub>y</sub>",
        "u<sub>z</sub>",
        "\u03B8<sub>x</sub>",
        "\u03B8<sub>y</sub>",
        "\u03B8<sub>z</sub>"
      ];
      for (let L = 0; L < e.elem.length; L++) {
        y += `<div class="er-sub">Nodo ${e.elem[L]}: `;
        for (let oe = 0; oe < 6; oe++) {
          const V = e.uGlobal[L * 6 + oe];
          y += `${N[oe]}=<span class="${Math.abs(V) > 1e-10 ? "nz" : ""}">${Ae(V, 6)}</span> `;
        }
        y += "</div>";
      }
    } else y += '<div class="er-sub">Sin an\xE1lisis</div>';
    if (y += '<div class="er-section-title">6. Fuerzas internas</div>', e.fLocal.length > 0 && e.fLocal.some((N) => N !== 0)) {
      const N = [
        "N",
        "V<sub>y</sub>",
        "V<sub>z</sub>",
        "M<sub>x</sub>",
        "M<sub>y</sub>",
        "M<sub>z</sub>"
      ];
      y += '<table class="er-forces"><tr><th></th>';
      for (const L of N) y += `<th>${L}</th>`;
      y += "</tr>", y += "<tr><td>Nodo i</td>";
      for (let L = 0; L < 6; L++) y += `<td class="${Math.abs(e.fLocal[L]) > 1e-10 ? "nz" : ""}">${Ae(e.fLocal[L], 3)}</td>`;
      y += "</tr><tr><td>Nodo j</td>";
      for (let L = 6; L < 12; L++) y += `<td class="${Math.abs(e.fLocal[L]) > 1e-10 ? "nz" : ""}">${Ae(e.fLocal[L], 3)}</td>`;
      y += "</tr></table>";
    } else y += '<div class="er-sub">Sin an\xE1lisis</div>';
    return y;
  }
  function fa(e) {
    if (!e.isFrame) return '<div class="er-sub">Shell element math: coming soon</div>';
    let y = "";
    const N = (Ee) => pa(Ee), L = (Ee) => pa(Ee, true);
    y += '<div class="er-section-title">1. Geometria del elemento</div>', y += "<p>Viga Euler-Bernoulli con 2 nodos y 6 GDL por nodo:</p>", y += `<div class="er-eq">${L("\\text{DOFs} = [u_x,\\, u_y,\\, u_z,\\, \\theta_x,\\, \\theta_y,\\, \\theta_z] \\quad \\Rightarrow \\quad 12 \\text{ GDL totales}")}</div>`, y += '<div class="er-eq-num">', y += `${N("\\text{Nodo } i")} = (${e.elmNodes[0].map((Ee) => Ae(Ee)).join(", ")})<br/>`, y += `${N("\\text{Nodo } j")} = (${e.elmNodes[1].map((Ee) => Ae(Ee)).join(", ")})<br/>`, y += `${L(`L = \\sqrt{(x_j - x_i)^2 + (y_j - y_i)^2 + (z_j - z_i)^2} = \\mathbf{${Ae(e.L)}}`)}`, y += "</div>", y += '<div class="er-section-title">2. Funciones de forma</div>', y += "<p>La viga usa <b>interpolacion lineal</b> para axial/torsion y <b>polinomios cubicos de Hermite</b> para flexion.</p>", y += '<div class="er-subsec">2.1 Axial y Torsion (lineal)</div>', y += `<div class="er-eq">${L("N_1(\\xi) = 1 - \\xi \\qquad N_2(\\xi) = \\xi \\qquad \\text{donde } \\xi = \\frac{x}{L} \\in [0,1]")}</div>`, y += "<p>Primera derivada:</p>", y += `<div class="er-eq">${L("\\frac{dN_1}{d\\xi} = -1 \\qquad \\frac{dN_2}{d\\xi} = 1")}</div>`, y += '<div class="er-subsec">2.2 Flexion (Hermite cubicos)</div>', y += `<p>Las funciones de Hermite garantizan continuidad ${N("C^1")} (desplazamiento y pendiente continuos):</p>`, y += `<div class="er-eq">${L("H_1(\\xi) = 1 - 3\\xi^2 + 2\\xi^3 \\qquad \\text{(desplazamiento nodo } i\\text{)}")}</div>`, y += `<div class="er-eq">${L("H_2(\\xi) = L\\,\\xi\\,(1-\\xi)^2 \\qquad \\text{(rotacion nodo } i\\text{)}")}</div>`, y += `<div class="er-eq">${L("H_3(\\xi) = 3\\xi^2 - 2\\xi^3 \\qquad \\text{(desplazamiento nodo } j\\text{)}")}</div>`, y += `<div class="er-eq">${L("H_4(\\xi) = L\\,\\xi^2(\\xi - 1) \\qquad \\text{(rotacion nodo } j\\text{)}")}</div>`, y += `<div class="er-subsec">Derivadas segunda (curvatura ${N("\\kappa = \\frac{d^2v}{dx^2}")}):</div>`, y += `<div class="er-eq">${L("H_1'' = \\frac{-6}{L^2}(1-2\\xi) \\qquad H_2'' = \\frac{-2}{L}(2-3\\xi)")}</div>`, y += `<div class="er-eq">${L("H_3'' = \\frac{6}{L^2}(1-2\\xi) \\qquad H_4'' = \\frac{-2}{L}(1-3\\xi)")}</div>`, y += '<canvas id="er-sf-canvas-math" width="500" height="250" style="width:100%;border:1px solid var(--fem-border);border-radius:4px;margin:8px 0;"></canvas>', y += '<div class="er-section-title">3. Matriz B (strain-displacement)</div>', y += "<p>La matriz B relaciona desplazamientos nodales con deformaciones internas:</p>", y += `<div class="er-eq">${L("\\boldsymbol{\\varepsilon} = \\mathbf{B} \\cdot \\mathbf{u}")}</div>`, y += '<div class="er-subsec">3.1 Deformacion axial</div>', y += `<div class="er-eq">${L("\\varepsilon_{axial} = \\frac{du}{dx} = \\frac{1}{L} \\begin{bmatrix} -1 & 1 \\end{bmatrix} \\begin{Bmatrix} u_i \\\\ u_j \\end{Bmatrix}")}</div>`, y += `<div class="er-subsec">3.2 Curvatura por flexion (plano XY \u2192 ${N("I_z")})</div>`, y += `<div class="er-eq">${L("\\kappa_z = \\frac{d^2 v}{dx^2} = \\mathbf{B}_{bz} \\cdot \\begin{Bmatrix} v_i \\\\ \\theta_{zi} \\\\ v_j \\\\ \\theta_{zj} \\end{Bmatrix}")}</div>`, y += `<div class="er-eq">${L("\\mathbf{B}_{bz}(\\xi) = \\frac{1}{L^2} \\begin{bmatrix} H_1'' & H_2'' & H_3'' & H_4'' \\end{bmatrix}")}</div>`, y += `<div class="er-subsec">3.3 Curvatura (plano XZ \u2192 ${N("I_y")})</div>`, y += `<div class="er-eq">${L("\\kappa_y = \\frac{d^2 w}{dx^2} = \\mathbf{B}_{by} \\cdot \\begin{Bmatrix} w_i \\\\ \\theta_{yi} \\\\ w_j \\\\ \\theta_{yj} \\end{Bmatrix}")}</div>`, y += '<div class="er-subsec">3.4 Torsion</div>', y += `<div class="er-eq">${L("\\phi' = \\frac{d\\theta_x}{dx} = \\frac{1}{L} \\begin{bmatrix} -1 & 1 \\end{bmatrix} \\begin{Bmatrix} \\theta_{xi} \\\\ \\theta_{xj} \\end{Bmatrix}")}</div>`, y += '<div class="er-section-title">4. Relaciones constitutivas D</div>', y += "<p>Cada modo de deformacion tiene su rigidez material:</p>", y += `<div class="er-eq">${L(`\\text{Axial: } \\sigma = E \\cdot \\varepsilon \\;\\Rightarrow\\; D_{ax} = EA = ${Ae(e.E)} \\times ${Ae(e.A)} = \\mathbf{${Ae(e.E * e.A)}}`)}</div>`, y += `<div class="er-eq">${L(`\\text{Flex Z: } M_z = EI_z \\cdot \\kappa \\;\\Rightarrow\\; D_{bz} = EI_z = ${Ae(e.E)} \\times ${Ae(e.Iz)} = \\mathbf{${Ae(e.E * e.Iz)}}`)}</div>`, y += `<div class="er-eq">${L(`\\text{Flex Y: } M_y = EI_y \\cdot \\kappa \\;\\Rightarrow\\; D_{by} = EI_y = ${Ae(e.E)} \\times ${Ae(e.Iy)} = \\mathbf{${Ae(e.E * e.Iy)}}`)}</div>`, y += `<div class="er-eq">${L(`\\text{Torsion: } T = GJ \\cdot \\phi' \\;\\Rightarrow\\; D_t = GJ = ${Ae(e.G)} \\times ${Ae(e.J)} = \\mathbf{${Ae(e.G * e.J)}}`)}</div>`, y += `<div class="er-section-title">5. Integracion \u2192 ${N("\\mathbf{K}_{local}")}</div>`, y += "<p>La matriz de rigidez local se obtiene integrando analiticamente:</p>", y += `<div class="er-eq er-eq-main">${L("\\mathbf{K}_{local} = \\int_0^L \\mathbf{B}^T \\cdot \\mathbf{D} \\cdot \\mathbf{B} \\; dx")}</div>`;
    const oe = e.E * e.A / e.L, V = e.E * e.Iz / e.L ** 3, Q = e.E * e.Iy / e.L ** 3, K = e.G * e.J / e.L;
    if (y += '<div class="er-deriv-block">', y += '<div class="er-deriv-header" data-toggle="deriv-axial">\u{1F4D6} K[0,0] = EA/L \u2014 <i>click para ver derivacion completa</i></div>', y += '<div id="er-deriv-axial" class="er-deriv-body" style="display:none">', y += "<p><b>Paso 1:</b> Funcion de forma axial</p>", y += `<div class="er-eq">${L("u(\\xi) = N_1 \\cdot u_i + N_2 \\cdot u_j = (1-\\xi)\\,u_i + \\xi\\,u_j")}</div>`, y += "<p><b>Paso 2:</b> Derivada (deformacion)</p>", y += `<div class="er-eq">${L("\\varepsilon = \\frac{du}{dx} = \\frac{1}{L}\\frac{du}{d\\xi} = \\frac{1}{L}(-u_i + u_j)")}</div>`, y += `<div class="er-eq">${L("\\mathbf{B}_{ax} = \\frac{1}{L}\\begin{bmatrix} -1 & 1 \\end{bmatrix}")}</div>`, y += `<p><b>Paso 3:</b> Integracion ${N("K = \\int_0^L B^T \\cdot EA \\cdot B \\; dx")}</p>`, y += `<div class="er-eq">${L("K_{ax} = \\int_0^L \\frac{1}{L}\\begin{bmatrix}-1\\\\1\\end{bmatrix} \\cdot EA \\cdot \\frac{1}{L}\\begin{bmatrix}-1 & 1\\end{bmatrix} dx")}</div>`, y += `<div class="er-eq">${L("= \\frac{EA}{L^2} \\begin{bmatrix}1 & -1\\\\-1 & 1\\end{bmatrix} \\int_0^L dx = \\frac{EA}{L^2} \\cdot L \\begin{bmatrix}1 & -1\\\\-1 & 1\\end{bmatrix}")}</div>`, y += `<div class="er-eq er-eq-main">${L(`K_{ax} = \\frac{EA}{L}\\begin{bmatrix}1 & -1\\\\-1 & 1\\end{bmatrix} = \\frac{${Ae(e.E)}\\times${Ae(e.A)}}{${Ae(e.L)}}\\begin{bmatrix}1 & -1\\\\-1 & 1\\end{bmatrix}`)}</div>`, y += `<div class="er-eq">${L(`K[0,0] = K[6,6] = \\frac{EA}{L} = \\mathbf{${Ae(oe)}}`)}</div>`, y += "</div></div>", y += '<div class="er-deriv-block">', y += '<div class="er-deriv-header" data-toggle="deriv-bend">\u{1F4D6} K[1,1] = 12EI<sub>z</sub>/L\xB3 \u2014 <i>click para ver derivacion completa</i></div>', y += '<div id="er-deriv-bend" class="er-deriv-body" style="display:none">', y += `<p><b>Paso 1:</b> Funcion de forma Hermite para ${N("v(\\xi)")}</p>`, y += `<div class="er-eq">${L("v(\\xi) = H_1 v_i + H_2 \\theta_i + H_3 v_j + H_4 \\theta_j")}</div>`, y += "<p><b>Paso 2:</b> Segunda derivada (curvatura)</p>", y += `<div class="er-eq">${L("\\kappa = \\frac{d^2v}{dx^2} = \\frac{1}{L^2}\\frac{d^2v}{d\\xi^2}")}</div>`, y += `<div class="er-eq">${L("H_1'' = -6+12\\xi, \\quad H_2'' = L(-4+6\\xi), \\quad H_3'' = 6-12\\xi, \\quad H_4'' = L(-2+6\\xi)")}</div>`, y += `<div class="er-eq">${L("\\mathbf{B}_b = \\frac{1}{L^2}\\begin{bmatrix} H_1'' & H_2'' & H_3'' & H_4'' \\end{bmatrix}")}</div>`, y += `<p><b>Paso 3:</b> Integracion para K[1,1] (termino ${N("v_i \\cdot v_i")})</p>`, y += `<div class="er-eq">${L("K[1,1] = \\int_0^L \\frac{(H_1'')^2}{L^4} \\cdot EI_z \\; dx = \\frac{EI_z}{L^4} \\int_0^L (-6+12\\xi)^2 \\; dx")}</div>`, y += `<p>Expandimos: ${N("(-6+12\\xi)^2 = 36 - 144\\xi + 144\\xi^2")}</p>`, y += `<div class="er-eq">${L("\\int_0^L (36-144\\xi+144\\xi^2)\\,dx = 36L - 72L + 48L = 12L")}</div>`, y += `<div class="er-eq er-eq-main">${L(`K[1,1] = \\frac{EI_z}{L^4} \\cdot 12L = \\frac{12EI_z}{L^3} = \\frac{12 \\times ${Ae(e.E)} \\times ${Ae(e.Iz)}}{${Ae(e.L)}^3} = \\mathbf{${Ae(12 * V)}}`)}</div>`, y += "</div></div>", y += '<div class="er-deriv-block">', y += '<div class="er-deriv-header" data-toggle="deriv-tors">\u{1F4D6} K[3,3] = GJ/L \u2014 <i>click para ver derivacion</i></div>', y += '<div id="er-deriv-tors" class="er-deriv-body" style="display:none">', y += `<p>Mismo proceso que axial pero con ${N("\\theta_x")} y ${N("GJ")}:</p>`, y += `<div class="er-eq">${L(`K_{torsion} = \\frac{GJ}{L}\\begin{bmatrix}1 & -1\\\\-1 & 1\\end{bmatrix} = \\frac{${Ae(e.G)}\\times${Ae(e.J)}}{${Ae(e.L)}} = \\mathbf{${Ae(K)}}`)}</div>`, y += "</div></div>", y += '<div class="er-deriv-block">', y += '<div class="er-deriv-header" data-toggle="deriv-coup">\u{1F4D6} K[1,5] = 6EI<sub>z</sub>/L\xB2 \u2014 <i>acoplamiento corte-momento</i></div>', y += '<div id="er-deriv-coup" class="er-deriv-body" style="display:none">', y += `<p>Termino cruzado ${N("v_i \\cdot \\theta_{zi}")} (acoplamiento corte-momento):</p>`, y += `<div class="er-eq">${L("K[1,5] = \\frac{EI_z}{L^4} \\int_0^L H_1'' \\cdot H_2'' \\; dx")}</div>`, y += `<div class="er-eq">${L("= \\frac{EI_z}{L^4} \\int_0^L (-6+12\\xi) \\cdot L(-4+6\\xi) \\; dx")}</div>`, y += `<div class="er-eq">${L("= \\frac{EI_z}{L^3} \\int_0^L (24-36\\xi-48\\xi+72\\xi^2) \\; dx = \\frac{EI_z}{L^3} \\cdot 6L")}</div>`, y += `<div class="er-eq er-eq-main">${L(`K[1,5] = \\frac{6EI_z}{L^2} = \\mathbf{${Ae(6 * e.E * e.Iz / e.L ** 2)}}`)}</div>`, y += "</div></div>", y += '<div class="er-subsec">Resumen de coeficientes:</div>', y += `<div class="er-eq">${L(`\\frac{EA}{L} = \\mathbf{${Ae(oe)}} \\qquad \\frac{12EI_z}{L^3} = \\mathbf{${Ae(12 * V)}} \\qquad \\frac{12EI_y}{L^3} = \\mathbf{${Ae(12 * Q)}}`)}</div>`, y += `<div class="er-eq">${L(`\\frac{GJ}{L} = \\mathbf{${Ae(K)}} \\qquad \\frac{4EI_y}{L} = \\mathbf{${Ae(4 * e.E * e.Iy / e.L)}} \\qquad \\frac{4EI_z}{L} = \\mathbf{${Ae(4 * e.E * e.Iz / e.L)}}`)}</div>`, y += `<div class="er-eq">${L(`\\frac{6EI_z}{L^2} = \\mathbf{${Ae(6 * e.E * e.Iz / e.L ** 2)}} \\qquad \\frac{6EI_y}{L^2} = \\mathbf{${Ae(6 * e.E * e.Iy / e.L ** 2)}}`)}</div>`, e.kLocal && (y += `<div class="er-subsec">Resultado: ${N("\\mathbf{K}_{local}")} (12x12)</div>`, y += sn(e.kLocal)), y += '<div class="er-section-title">6. Transformacion de coordenadas</div>', y += "<p>Los cosenos directores del eje del elemento:</p>", y += `<div class="er-eq">${L(`l = \\frac{x_j - x_i}{L} = ${vn(e.l)} \\qquad m = \\frac{y_j - y_i}{L} = ${vn(e.m)} \\qquad n = \\frac{z_j - z_i}{L} = ${vn(e.n)}`)}</div>`, y += `<div class="er-eq">${L(`D = \\sqrt{l^2 + m^2} = ${vn(e.D)}`)}</div>`, Math.abs(e.n) > 0.999) {
      y += `<p>Caso especial: elemento vertical (${N(`n \\approx ${e.n > 0 ? "+1" : "-1"}`)}), el eje 2 se fija en el +X global:</p>`;
      const Ee = e.n > 0 ? "\\boldsymbol{\\lambda} = \\begin{bmatrix} 0 & 0 & 1 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0 \\end{bmatrix}" : "\\boldsymbol{\\lambda} = \\begin{bmatrix} 0 & 0 & -1 \\\\ 1 & 0 & 0 \\\\ 0 & -1 & 0 \\end{bmatrix}";
      y += `<div class="er-eq">${L(Ee)}</div>`;
    } else y += `<div class="er-eq">${L("\\boldsymbol{\\lambda} = \\begin{bmatrix} l & m & n \\\\ -ln/D & -mn/D & D \\\\ m/D & -l/D & 0 \\end{bmatrix}")}</div>`;
    y += `<div class="er-eq er-eq-main">${L("\\mathbf{T} = \\mathbf{I}_4 \\otimes \\boldsymbol{\\lambda} \\quad \\text{(Kronecker product} \\rightarrow 12 \\times 12 \\text{ bloque-diagonal)}")}</div>`, y += `<div class="er-section-title">7. ${N("\\mathbf{K}_{global}")} = ${N("\\mathbf{T}^T \\cdot \\mathbf{K}_{local} \\cdot \\mathbf{T}")}</div>`, y += "<p>Transformar la rigidez local al sistema global de coordenadas:</p>", y += `<div class="er-eq er-eq-main">${L("\\mathbf{K}_{global} = \\mathbf{T}^T \\cdot \\mathbf{K}_{local} \\cdot \\mathbf{T}")}</div>`, e.kGlobal && (y += sn(e.kGlobal)), y += '<div class="er-section-title">8. Ensamblaje</div>';
    const ne = e.elem[0] * 6, ge = e.elem[1] * 6;
    if (y += `<div class="er-eq">${L(`\\text{Nodo } ${e.elem[0]} \\rightarrow \\text{DOFs } [${ne} \\ldots ${ne + 5}]`)}</div>`, y += `<div class="er-eq">${L(`\\text{Nodo } ${e.elem[1]} \\rightarrow \\text{DOFs } [${ge} \\ldots ${ge + 5}]`)}</div>`, y += `<div class="er-eq">${L("\\mathbf{K}_{total}[\\text{DOFs}_i, \\text{DOFs}_j] \\mathrel{+}= \\mathbf{K}_{global}[i, j]")}</div>`, y += '<div class="er-section-title">9. Recuperacion de fuerzas internas</div>', y += `<div class="er-eq">${L("\\mathbf{u}_{local} = \\mathbf{T} \\cdot \\mathbf{u}_{global}")}</div>`, y += `<div class="er-eq er-eq-main">${L("\\mathbf{f}_{local} = \\mathbf{K}_{local} \\cdot \\mathbf{u}_{local}")}</div>`, e.fLocal.length > 0 && e.fLocal.some((Ee) => Ee !== 0)) {
      const Ee = [
        "N",
        "V<sub>y</sub>",
        "V<sub>z</sub>",
        "M<sub>x</sub>",
        "M<sub>y</sub>",
        "M<sub>z</sub>"
      ];
      y += '<table class="er-forces"><tr><th></th>';
      for (const A of Ee) y += `<th>${A}</th>`;
      y += `</tr><tr><td>i (${e.elem[0]})</td>`;
      for (let A = 0; A < 6; A++) y += `<td class="${Math.abs(e.fLocal[A]) > 1e-10 ? "nz" : ""}">${Ae(e.fLocal[A], 3)}</td>`;
      y += `</tr><tr><td>j (${e.elem[1]})</td>`;
      for (let A = 6; A < 12; A++) y += `<td class="${Math.abs(e.fLocal[A]) > 1e-10 ? "nz" : ""}">${Ae(e.fLocal[A], 3)}</td>`;
      y += "</tr></table>";
    }
    return y;
  }
  function Fl(e) {
    let y = "";
    if (y += `<div class="er-section-title">Resumen \u2014 Elemento ${e.elemIdx}</div>`, y += '<table class="er-props">', y += `<tr><td>Tipo</td><td>${e.isFrame ? "Frame (Euler-Bernoulli)" : "Shell"}</td></tr>`, y += `<tr><td>Nodos</td><td>${e.elem.join(" \u2192 ")}</td></tr>`, y += `<tr><td>Longitud</td><td><b>${Ae(e.L)}</b></td></tr>`, y += `<tr><td>E</td><td>${Ae(e.E)}</td></tr>`, y += `<tr><td>A</td><td>${Ae(e.A)}</td></tr>`, y += "</table>", e.uGlobal.length > 0) {
      y += '<div class="er-section-title">Desplazamientos</div>';
      const N = [
        "u<sub>x</sub>",
        "u<sub>y</sub>",
        "u<sub>z</sub>",
        "\u03B8<sub>x</sub>",
        "\u03B8<sub>y</sub>",
        "\u03B8<sub>z</sub>"
      ];
      y += '<table class="er-forces"><tr><th>Nodo</th>';
      for (const L of N) y += `<th>${L}</th>`;
      y += "</tr>";
      for (let L = 0; L < e.elem.length; L++) {
        y += `<tr><td>${e.elem[L]}</td>`;
        for (let oe = 0; oe < 6; oe++) {
          const V = e.uGlobal[L * 6 + oe];
          y += `<td class="${Math.abs(V) > 1e-10 ? "nz" : ""}">${Ae(V, 6)}</td>`;
        }
        y += "</tr>";
      }
      y += "</table>";
    }
    if (e.fLocal.length > 0 && e.fLocal.some((N) => N !== 0)) {
      y += '<div class="er-section-title">Fuerzas internas</div>';
      const N = [
        "N",
        "V<sub>y</sub>",
        "V<sub>z</sub>",
        "M<sub>x</sub>",
        "M<sub>y</sub>",
        "M<sub>z</sub>"
      ];
      y += '<table class="er-forces"><tr><th></th>';
      for (const L of N) y += `<th>${L}</th>`;
      y += "</tr><tr><td>Nodo i</td>";
      for (let L = 0; L < 6; L++) y += `<td class="${Math.abs(e.fLocal[L]) > 1e-10 ? "nz" : ""}">${Ae(e.fLocal[L], 3)}</td>`;
      y += "</tr><tr><td>Nodo j</td>";
      for (let L = 6; L < 12; L++) y += `<td class="${Math.abs(e.fLocal[L]) > 1e-10 ? "nz" : ""}">${Ae(e.fLocal[L], 3)}</td>`;
      y += "</tr></table>";
    }
    return y;
  }
  function Ae(e, y = 2) {
    return Math.abs(e) < 1e-10 ? "0" : Math.abs(e) >= 1e7 || Math.abs(e) < 0.01 && e !== 0 ? e.toExponential(y) : e.toFixed(y);
  }
  function vn(e) {
    return Math.abs(e) < 1e-10 ? "0" : e.toFixed(4);
  }
  function sn(e) {
    var _a;
    const y = e.length, N = Math.min(y, 12);
    let L = '<div style="overflow-x:auto"><table class="er-matrix">';
    for (let oe = 0; oe < N; oe++) {
      L += "<tr>";
      for (let V = 0; V < N; V++) {
        const Q = ((_a = e[oe]) == null ? void 0 : _a[V]) ?? 0, K = Math.abs(Q) < 1e-10;
        L += `<td class="${K ? "z" : ""} ${oe === V && !K ? "diag" : ""}">${K ? "0" : Pl(Q)}</td>`;
      }
      L += "</tr>";
    }
    return L += "</table>", y > N && (L += `<div style="color:var(--fem-label);font-size:9px">(${N}\xD7${N} de ${y}\xD7${y})</div>`), L += "</div>", L;
  }
  function Pl(e) {
    return Math.abs(e) >= 1e6 || Math.abs(e) < 0.01 && e !== 0 ? e.toExponential(1) : Math.abs(e) >= 100 ? e.toFixed(0) : e.toFixed(2);
  }
  function rs(e) {
    const y = e.getContext("2d");
    if (!y) return;
    const N = e.width, L = e.height, oe = 30, V = N - 2 * oe, Q = (L - 3 * oe) / 2;
    y.fillStyle = getComputedStyle(document.body).getPropertyValue("--fem-bg").trim() || "#111", y.fillRect(0, 0, N, L);
    const K = (ne, ge, Ee) => {
      y.strokeStyle = "#333", y.lineWidth = 1, y.strokeRect(oe, ne, V, Q), y.strokeStyle = "#444", y.beginPath(), y.moveTo(oe, ne + Q / 2), y.lineTo(oe + V, ne + Q / 2), y.stroke(), y.fillStyle = "#888", y.font = "11px sans-serif", y.fillText(ge, oe + 4, ne + 14);
      for (const J of Ee) {
        y.strokeStyle = J.color, y.lineWidth = 2.5, y.beginPath();
        for (let Se = 0; Se <= 100; Se++) {
          const be = Se / 100, ce = oe + be * V, re = ne + Q / 2 - J.fn(be) * (Q / 2 * 0.85);
          Se === 0 ? y.moveTo(ce, re) : y.lineTo(ce, re);
        }
        y.stroke();
      }
      let A = oe + V - 90;
      for (const J of Ee) y.fillStyle = J.color, y.font = "bold 10px sans-serif", y.fillText(J.label, A, ne + Q - 6), A += 36;
      y.fillStyle = "#666", y.font = "9px monospace", y.fillText("0", oe, ne + Q + 12), y.fillText("1", oe + V - 6, ne + Q + 12), y.fillText("\u03BE", oe + V / 2, ne + Q + 12);
    };
    K(oe, "Axial (lineal)", [
      {
        fn: (ne) => 1 - ne,
        color: "#ff6600",
        label: "N\u2081"
      },
      {
        fn: (ne) => ne,
        color: "#00ccff",
        label: "N\u2082"
      }
    ]), K(oe + Q + oe, "Flexi\xF3n (Hermite c\xFAbicos)", [
      {
        fn: (ne) => 1 - 3 * ne * ne + 2 * ne * ne * ne,
        color: "#ff6600",
        label: "H\u2081"
      },
      {
        fn: (ne) => ne * (1 - ne) * (1 - ne),
        color: "#ffcc00",
        label: "H\u2082"
      },
      {
        fn: (ne) => 3 * ne * ne - 2 * ne * ne * ne,
        color: "#00ccff",
        label: "H\u2083"
      },
      {
        fn: (ne) => ne * ne * (ne - 1),
        color: "#00ff66",
        label: "H\u2084"
      }
    ]);
  }
  const ql = `<style>
  .er-panel {
    position: fixed; right: 0; top: 0; width: 560px; height: 100vh;
    background: var(--fem-bg, #111); color: var(--fem-text, #ddd);
    overflow-y: auto; z-index: 9999990; padding: 12px 16px;
    box-sizing: border-box; border-left: 3px solid var(--fem-accent, #0f3460);
    font-family: 'Segoe UI', sans-serif; font-size: 12px; line-height: 1.5;
    box-shadow: -4px 0 20px rgba(0,0,0,0.5);
  }
  .er-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
  .er-badge { background: var(--fem-section-title, #e94560); color: #fff; padding: 2px 10px; border-radius: 12px; font-weight: bold; font-size: 13px; }
  .er-type { color: var(--fem-label, #888); font-size: 12px; }
  .er-fullscreen { background: transparent; border: 1px solid var(--fem-border, #333); color: var(--fem-text, #ddd); padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 16px; margin-left: auto; }
  .er-fullscreen:hover { background: var(--fem-btn-hover, #222); }
  .er-close { background: transparent; border: 1px solid var(--fem-border, #333); color: var(--fem-text, #ddd); padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 14px; }
  .er-close:hover { background: var(--fem-btn-hover, #222); }

  /* Fullscreen mode */
  .er-panel.er-fullscreen-mode {
    width: 100vw !important; left: 0 !important; right: 0 !important;
    max-width: none !important; border-left: none !important;
    padding: 20px 40px !important;
  }
  .er-panel.er-fullscreen-mode .er-matrix td { min-width: 65px; font-size: 10px; }
  .er-panel.er-fullscreen-mode .er-eq { font-size: 14px; }
  .er-panel.er-fullscreen-mode .katex { font-size: 1.1em; }

  .er-tabs { display: flex; gap: 0; margin-bottom: 10px; border-bottom: 2px solid var(--fem-border, #333); }
  .er-tab { background: transparent; border: none; color: var(--fem-label, #888); padding: 6px 16px; cursor: pointer; font-size: 12px; font-weight: bold; border-bottom: 2px solid transparent; margin-bottom: -2px; }
  .er-tab.active { color: var(--fem-section-title, #e94560); border-bottom-color: var(--fem-section-title, #e94560); }
  .er-tab:hover { color: var(--fem-text, #ddd); }

  .er-body { padding: 4px 0; }
  .er-section-title { color: var(--fem-section-title, #e94560); font-weight: bold; font-size: 13px; margin: 14px 0 6px 0; border-bottom: 1px solid var(--fem-border, #333); padding-bottom: 3px; }
  .er-subsec { color: var(--fem-label, #aaa); font-weight: bold; font-size: 11px; margin: 10px 0 4px 0; }
  .er-sub { color: var(--fem-label, #888); font-size: 11px; margin: 2px 0; }
  .er-sub .nz { color: var(--fem-nonzero, #7bed9f); font-weight: bold; }

  .er-eq { background: var(--fem-section-bg, #1a1a2e); border-left: 3px solid var(--fem-accent, #0f3460); padding: 6px 12px; margin: 6px 0; font-family: serif; font-size: 13px; color: var(--fem-eq-var, #58a6ff); }
  .er-eq-main { border-left: 4px solid var(--fem-section-title, #e94560); font-weight: bold; font-size: 14px; }
  .er-eq-num { background: var(--fem-section-bg, #16213e); border-left: 2px solid var(--fem-border, #444); padding: 6px 12px; margin: 4px 0; font-family: monospace; font-size: 11px; color: var(--fem-text, #ccc); line-height: 180%; }
  .er-eq-table { border-collapse: collapse; margin: 4px 0; font-size: 12px; }
  .er-eq-table td { padding: 2px 10px; vertical-align: top; }
  .er-eq-table .fn-name { color: var(--fem-eq-var, #58a6ff); font-weight: bold; font-family: serif; }
  .er-eq-table .fn-desc { color: var(--fem-label, #888); font-style: italic; font-size: 10px; }

  .er-coeff { border-collapse: collapse; margin: 6px 0; font-family: monospace; font-size: 11px; }
  .er-coeff td { padding: 3px 8px; border-bottom: 1px solid var(--fem-border, #222); }
  .er-coeff b { color: var(--fem-nonzero, #7bed9f); }

  .er-props { border-collapse: collapse; margin: 4px 0; font-size: 12px; }
  .er-props td { padding: 2px 12px 2px 0; }
  .er-props td:nth-child(even) { color: var(--fem-eq-var, #58a6ff); font-weight: bold; }

  .er-forces { border-collapse: collapse; margin: 4px 0; font-family: monospace; font-size: 11px; }
  .er-forces th { background: var(--fem-header-bg, #1a1a2e); color: var(--fem-section-title, #e94560); padding: 3px 8px; border: 1px solid var(--fem-border, #333); text-align: center; font-size: 10px; }
  .er-forces td { padding: 3px 8px; border: 1px solid var(--fem-border, #333); text-align: right; }
  .er-forces .nz { color: var(--fem-nonzero, #7bed9f); font-weight: bold; }

  .er-matrix { border-collapse: collapse; font-family: monospace; font-size: 9px; margin: 4px 0; }
  .er-matrix td { padding: 2px 5px; text-align: right; border: 1px solid var(--fem-border-cell, #222); min-width: 50px; white-space: nowrap; }
  .er-matrix td.z { color: var(--fem-eq-dots, #444); }
  .er-matrix td.diag { background: var(--fem-diag-bg, #0a1a30); color: var(--fem-eq-var, #58a6ff); font-weight: bold; }

  .er-panel p { margin: 4px 0; color: var(--fem-text, #bbb); font-size: 11px; }

  /* Derivation blocks (expandible) */
  .er-deriv-block { margin: 6px 0; border: 1px solid var(--fem-border, #333); border-radius: 4px; overflow: hidden; }
  .er-deriv-header { padding: 6px 10px; cursor: pointer; color: var(--fem-eq-var, #58a6ff); font-size: 12px; background: var(--fem-section-bg, #161b22); }
  .er-deriv-header:hover { background: var(--fem-diag-bg, #0a2a4a); }
  .er-deriv-header i { color: var(--fem-label, #666); font-size: 10px; }
  .er-deriv-body { padding: 8px 12px; background: var(--fem-bg, #0d1117); border-top: 1px solid var(--fem-border, #333); }

  .er-panel::-webkit-scrollbar { width: 6px; }
  .er-panel::-webkit-scrollbar-track { background: var(--fem-bg, #111); }
  .er-panel::-webkit-scrollbar-thumb { background: var(--fem-accent, #0f3460); border-radius: 3px; }
</style>`, on = [
    {
      selector: "#cad3d-panel",
      title: "FEM Studio",
      description: "Panel principal. Aqui controlas todo: ejemplos, vistas, herramientas de analisis.",
      position: "right"
    },
    {
      selector: '[data-ex="edificio"]',
      title: "Ejemplos Predefinidos",
      description: "Haz click en cualquier boton para cargar una estructura: Cercha, Portico, Torre, Edificio, etc.",
      position: "right"
    },
    {
      selector: '[data-view="3d"]',
      title: "Vistas",
      description: "Cambia entre vista 3D, Planta (Plan), Elevacion X (EX), Elevacion Y (EY).",
      position: "bottom"
    },
    {
      selector: "#cad3d-select",
      title: "Select (Seleccionar)",
      description: "Activa el modo seleccion. Haz click en elementos del modelo 3D para seleccionarlos. Ctrl+click para seleccion multiple.",
      position: "bottom"
    },
    {
      selector: "#cad3d-draw",
      title: "Draw (Dibujar)",
      description: "Dibuja nuevos elementos: lineas, arcos, nodos. Usa snap a grilla, nodos y puntos medios.",
      position: "bottom"
    },
    {
      selector: "#cad3d-inspect",
      title: "Inspect (Inspeccionar)",
      description: "Haz click en un elemento para ver su reporte FEM completo: 3 pestanas (Tabla, Matematica Explicada, Resumen) con funciones de forma, K local, transformacion T, fuerzas internas.",
      position: "bottom"
    },
    {
      selector: "#cad3d-export",
      title: "Export",
      description: "Exporta coordenadas, propiedades y resultados del modelo en formato texto/JSON.",
      position: "bottom"
    },
    {
      selector: '[data-preset="MKS"]',
      title: "Sistema de Unidades",
      description: "MKS (tonf, m), SI (kN, m), US (kip, in). Cambia las unidades de todo el modelo.",
      position: "bottom"
    },
    {
      selector: "#cad3d-modal",
      title: "Modal (Analisis Modal)",
      description: "Calcula frecuencias naturales, modos de vibracion y participacion de masa. Anima los modos con flechas de navegacion.",
      position: "bottom"
    },
    {
      selector: "#cad3d-fem-solver",
      title: "Report Explained",
      description: "Genera un reporte academico completo tipo libro de texto: funciones de forma, matrices B, D, K, transformacion, ensamblaje y solucion paso a paso.",
      position: "bottom"
    },
    {
      selector: "#cad3d-pushover",
      title: "Pushover",
      description: "Analisis pushover ciclico con histeresis. Visualiza curvas fuerza-desplazamiento.",
      position: "bottom"
    },
    {
      selector: "#cad3d-nonlinear",
      title: "Nonlinear",
      description: "Analisis no-lineal dinamico con material Steel02 (Menegotto-Pinto). Para BRBs y elementos con comportamiento histeretico.",
      position: "bottom"
    },
    {
      selector: "#cad3d-cmd",
      title: "Linea de Comandos",
      description: "Escribe comandos directamente: cad.galpon(12,20,6,3), cad.edificio(3,3,3,3), cad.help() para ver todos los comandos.",
      position: "top"
    },
    {
      selector: ".tp-dfwv",
      title: "Settings (Configuracion)",
      description: "Controla la visualizacion: nodos, elementos, secciones, resultados de analisis, forma deformada, colores de esfuerzos.",
      position: "left"
    }
  ];
  let Sn = false, To = null, Ut = null, wt = null, mt = null;
  function _l() {
    mt = document.createElement("button"), mt.id = "help-tour-btn", mt.innerHTML = "?", mt.title = "Ayuda interactiva \u2014 Tour guiado";
    let e = false;
    const y = (L) => {
      mt.style.cssText = L ? "position:fixed;bottom:5px;right:5px;z-index:9999999;width:20px;height:20px;border-radius:50%;background:#555;color:#aaa;border:1px solid #777;font-size:10px;cursor:pointer;opacity:0.5;transition:all 0.2s;" : "position:fixed;bottom:20px;right:20px;z-index:9999999;width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#0066cc,#0099ff);color:white;border:2px solid rgba(255,255,255,0.3);font-size:18px;font-weight:bold;cursor:pointer;box-shadow:0 2px 10px rgba(0,102,204,0.3);transition:all 0.2s;font-family:'Arial Nova',sans-serif;";
    };
    y(false), mt.addEventListener("contextmenu", (L) => {
      L.preventDefault(), e = !e, y(e), mt.innerHTML = "?";
    }), mt.addEventListener("mouseenter", () => {
      mt.style.transform = "scale(1.15)", mt.style.boxShadow = "0 6px 20px rgba(0,102,204,0.6)";
    }), mt.addEventListener("mouseleave", () => {
      mt.style.transform = "scale(1)", mt.style.boxShadow = "0 4px 15px rgba(0,102,204,0.4)";
    }), mt.addEventListener("click", () => {
      Sn ? fs() : Rl();
    });
    const N = document.createElement("style");
    return N.textContent = `
    @keyframes helpPulse {
      0%, 100% { box-shadow: 0 4px 15px rgba(0,102,204,0.4); }
      50% { box-shadow: 0 4px 25px rgba(0,102,204,0.7), 0 0 0 8px rgba(0,102,204,0.1); }
    }
    @keyframes spotlightPulse {
      0%, 100% { box-shadow: 0 0 0 4px rgba(0,153,255,0.6), 0 0 0 9999px rgba(0,0,0,0.65); }
      50% { box-shadow: 0 0 0 8px rgba(0,153,255,0.3), 0 0 0 9999px rgba(0,0,0,0.65); }
    }
    @keyframes tooltipSlideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes handPoint {
      0%, 100% { transform: translate(0, 0) rotate(-15deg); }
      50% { transform: translate(-5px, -8px) rotate(-15deg); }
    }
    .tour-hand {
      display: inline-block;
      font-size: 28px;
      animation: handPoint 1s ease-in-out infinite;
      margin-right: 6px;
    }
  `, document.head.appendChild(N), mt;
  }
  function Rl() {
    Sn = true, mt && (mt.innerHTML = "\u2715", mt.style.background = "linear-gradient(135deg, #cc3333, #ff4444)", mt.style.animation = "none"), To = document.createElement("div"), To.id = "tour-overlay", To.style.cssText = `
    position: fixed; inset: 0; z-index: 9999990;
    pointer-events: none;
  `, document.body.appendChild(To), Go(0);
  }
  function fs() {
    Sn = false, mt && (mt.innerHTML = "?", mt.style.background = "linear-gradient(135deg, #0066cc, #0099ff)", mt.style.animation = "helpPulse 2s infinite"), Ut && (Ut.remove(), Ut = null), wt && (wt.remove(), wt = null), To && (To.remove(), To = null);
  }
  function Go(e) {
    var _a, _b;
    if (e >= on.length) {
      Ol();
      return;
    }
    const y = on[e], N = document.querySelector(y.selector);
    if (!N) {
      Go(e + 1);
      return;
    }
    N.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    }), Ut && Ut.remove(), wt && wt.remove();
    const L = N.getBoundingClientRect(), oe = window.innerWidth, V = window.innerHeight, Q = 320, K = 180;
    Ut = document.createElement("div"), Ut.style.cssText = `
    position: fixed;
    left: ${L.left - 6}px; top: ${L.top - 6}px;
    width: ${L.width + 12}px; height: ${L.height + 12}px;
    border-radius: 8px;
    z-index: 9999991;
    pointer-events: none;
    animation: spotlightPulse 1.5s ease-in-out infinite;
    transition: all 0.3s ease;
  `, document.body.appendChild(Ut);
    const ne = oe - L.right, ge = L.left, Ee = V - L.bottom, A = L.top;
    let J = y.position || "bottom";
    J === "bottom" && Ee < K + 20 && (J = "top"), J === "top" && A < K + 20 && (J = "right"), J === "right" && ne < Q + 20 && (J = "left"), J === "left" && ge < Q + 20 && (J = "bottom");
    let Se, be, ce = "";
    switch (J) {
      case "bottom":
        Se = L.left + L.width / 2 - Q / 2, be = L.bottom + 14, ce = "position:absolute;top:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:8px solid #0099ff;";
        break;
      case "top":
        Se = L.left + L.width / 2 - Q / 2, be = L.top - K - 14, ce = "position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid #0099ff;";
        break;
      case "right":
        Se = L.right + 14, be = L.top + L.height / 2 - K / 2, ce = "position:absolute;left:-8px;top:50%;transform:translateY(-50%);width:0;height:0;border-top:8px solid transparent;border-bottom:8px solid transparent;border-right:8px solid #0099ff;";
        break;
      case "left":
        Se = L.left - Q - 14, be = L.top + L.height / 2 - K / 2, ce = "position:absolute;right:-8px;top:50%;transform:translateY(-50%);width:0;height:0;border-top:8px solid transparent;border-bottom:8px solid transparent;border-left:8px solid #0099ff;";
        break;
    }
    Se = Math.max(10, Math.min(Se, oe - Q - 10)), be = Math.max(10, Math.min(be, V - K - 10)), wt = document.createElement("div"), wt.style.cssText = `
    position: fixed;
    left: ${Se}px; top: ${be}px;
    width: ${Q}px;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    color: #e0e0e0;
    border: 2px solid #0099ff;
    border-radius: 12px;
    padding: 16px 18px;
    z-index: 9999992;
    pointer-events: auto;
    animation: tooltipSlideIn 0.3s ease-out;
    box-shadow: 0 8px 30px rgba(0,0,0,0.5);
    font-family: 'Segoe UI', sans-serif;
  `, wt.innerHTML = `
    <div style="${ce}"></div>
    <div style="display:flex;align-items:center;margin-bottom:8px;">
      <span class="tour-hand">\u{1F446}</span>
      <span style="color:#0099ff;font-weight:bold;font-size:15px;">${y.title}</span>
      <span style="margin-left:auto;color:#666;font-size:11px;">${e + 1}/${on.length}</span>
    </div>
    <p style="margin:0 0 12px 0;font-size:12px;line-height:1.6;color:#bbb;">${y.description}</p>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      ${e > 0 ? '<button id="tour-prev" style="padding:5px 14px;background:transparent;color:#888;border:1px solid #444;border-radius:6px;cursor:pointer;font-size:11px;">\u25C0 Anterior</button>' : ""}
      <button id="tour-next" style="padding:5px 18px;background:linear-gradient(135deg,#0066cc,#0099ff);color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">
        ${e < on.length - 1 ? "Siguiente \u25B6" : "Finalizar \u2713"}
      </button>
    </div>
    <div style="margin-top:8px;display:flex;gap:3px;justify-content:center;">
      ${on.map((ie, he) => `<div style="width:${he === e ? "16px" : "6px"};height:6px;border-radius:3px;background:${he === e ? "#0099ff" : he < e ? "#004488" : "#333"};transition:all 0.3s;"></div>`).join("")}
    </div>
  `, document.body.appendChild(wt), (_a = wt.querySelector("#tour-next")) == null ? void 0 : _a.addEventListener("click", () => {
      Go(e + 1);
    }), (_b = wt.querySelector("#tour-prev")) == null ? void 0 : _b.addEventListener("click", () => {
      Go(e - 1);
    });
    const re = (ie) => {
      if (!Sn) {
        document.removeEventListener("keydown", re);
        return;
      }
      (ie.key === "ArrowRight" || ie.key === "Enter") && (Go(e + 1), document.removeEventListener("keydown", re)), ie.key === "ArrowLeft" && (Go(Math.max(0, e - 1)), document.removeEventListener("keydown", re)), ie.key === "Escape" && (fs(), document.removeEventListener("keydown", re));
    };
    document.addEventListener("keydown", re);
  }
  function Ol() {
    var _a;
    Ut && (Ut.remove(), Ut = null), wt && (wt.remove(), wt = null), wt = document.createElement("div"), wt.style.cssText = `
    position: fixed;
    left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 400px;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    color: #e0e0e0;
    border: 2px solid #00cc66;
    border-radius: 16px;
    padding: 30px;
    z-index: 9999992;
    pointer-events: auto;
    animation: tooltipSlideIn 0.3s ease-out;
    box-shadow: 0 8px 40px rgba(0,0,0,0.6);
    font-family: 'Segoe UI', sans-serif;
    text-align: center;
  `, wt.innerHTML = `
    <div style="font-size:48px;margin-bottom:12px;">\u{1F393}</div>
    <h3 style="color:#00cc66;margin:0 0 8px 0;font-size:18px;">Tour Completado</h3>
    <p style="color:#888;font-size:12px;line-height:1.6;margin:0 0 16px 0;">
      Ya conoces las herramientas principales.<br>
      Presiona <b style="color:#0099ff">?</b> en cualquier momento para repetir el tour.<br>
      Usa <b style="color:#0099ff">Inspect</b> en un elemento para ver el analisis FEM completo.
    </p>
    <button id="tour-done" style="padding:8px 24px;background:linear-gradient(135deg,#00aa55,#00cc66);color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:bold;">Entendido</button>
  `, document.body.appendChild(wt), (_a = wt.querySelector("#tour-done")) == null ? void 0 : _a.addEventListener("click", () => fs());
  }
  function Nl(e) {
    var _a, _b;
    const { nodes: y, elements: N, nodeInputs: L, elementInputs: oe } = e, V = [];
    return V.push("# OpenSeesPy model exported from Hekatan Struct"), V.push(`# ${y.length} nodes, ${N.length} elements`), V.push(""), V.push("import openseespy.opensees as ops"), V.push(""), V.push("ops.wipe()"), V.push("ops.model('basic', '-ndm', 3, '-ndf', 6)"), V.push(""), V.push("# --- Nodes ---"), y.forEach((Q, K) => {
      V.push(`ops.node(${K + 1}, ${Q[0]}, ${Q[1]}, ${Q[2]})`);
    }), V.push(""), V.push("# --- Boundary Conditions ---"), (_a = L.supports) == null ? void 0 : _a.forEach((Q, K) => {
      const ne = Q.map((ge) => ge ? 1 : 0).join(", ");
      V.push(`ops.fix(${K + 1}, ${ne})`);
    }), V.push(""), V.push("# --- Geometric Transformations ---"), V.push("ops.geomTransf('Linear', 1, 0.0, 0.0, 1.0)  # beams (vecxz = Z)"), V.push("ops.geomTransf('Linear', 2, -1.0, 0.0, 0.0)  # columns (vecxz = -X)"), V.push(""), V.push("# --- Elements (elasticBeamColumn) ---"), N.forEach((Q, K) => {
      var _a2, _b2, _c, _d, _e, _f;
      if (Q.length !== 2) return;
      const ne = y[Q[0]], ge = y[Q[1]], A = Math.abs(ge[2] - ne[2]) > Math.max(Math.abs(ge[0] - ne[0]), Math.abs(ge[1] - ne[1])) ? 2 : 1, J = ((_a2 = oe.areas) == null ? void 0 : _a2.get(K)) ?? 1, Se = ((_b2 = oe.elasticities) == null ? void 0 : _b2.get(K)) ?? 2e5, be = ((_c = oe.shearModuli) == null ? void 0 : _c.get(K)) ?? 8e4, ce = ((_d = oe.torsionalConstants) == null ? void 0 : _d.get(K)) ?? 1, re = ((_e = oe.momentsOfInertiaZ) == null ? void 0 : _e.get(K)) ?? 1, ie = ((_f = oe.momentsOfInertiaY) == null ? void 0 : _f.get(K)) ?? 1;
      V.push(`ops.element('elasticBeamColumn', ${K + 1}, ${Q[0] + 1}, ${Q[1] + 1}, ${J}, ${Se}, ${be}, ${ce}, ${re}, ${ie}, ${A})`);
    }), V.push(""), L.loads && L.loads.size > 0 && (V.push("# --- Loads ---"), V.push("ops.timeSeries('Linear', 1)"), V.push("ops.pattern('Plain', 1, 1)"), L.loads.forEach((Q, K) => {
      const ne = Q.map((ge) => ge).join(", ");
      V.push(`ops.load(${K + 1}, ${ne})`);
    }), V.push("")), V.push("# --- Analysis ---"), V.push("ops.system('BandGeneral')"), V.push("ops.numberer('RCM')"), V.push("ops.constraints('Plain')"), V.push("ops.integrator('LoadControl', 1.0)"), V.push("ops.algorithm('Linear')"), V.push("ops.analysis('Static')"), V.push("ops.analyze(1)"), V.push(""), V.push("# --- Results ---"), V.push('print("\\n=== Displacements ===")'), y.forEach((Q, K) => {
      V.push(`print(f"Node {${K + 1}}: {ops.nodeDisp(${K + 1})}")`);
    }), V.push(""), V.push('print("\\n=== Reactions ===")'), V.push("ops.reactions()"), (_b = L.supports) == null ? void 0 : _b.forEach((Q, K) => {
      V.push(`print(f"Node {${K + 1}}: {ops.nodeReaction(${K + 1})}")`);
    }), V.join(`
`);
  }
  function Hl(e) {
    var _a, _b;
    const { nodes: y, elements: N, nodeInputs: L, elementInputs: oe } = e, V = [];
    return V.push("# OpenSees Tcl model exported from Hekatan Struct"), V.push(`# ${y.length} nodes, ${N.length} elements`), V.push(""), V.push("wipe"), V.push("model basic -ndm 3 -ndf 6"), V.push(""), V.push("# --- Nodes ---"), y.forEach((Q, K) => {
      V.push(`node ${K + 1} ${Q[0]} ${Q[1]} ${Q[2]}`);
    }), V.push(""), V.push("# --- Boundary Conditions ---"), (_a = L.supports) == null ? void 0 : _a.forEach((Q, K) => {
      const ne = Q.map((ge) => ge ? 1 : 0).join(" ");
      V.push(`fix ${K + 1} ${ne}`);
    }), V.push(""), V.push("# --- Geometric Transformations ---"), V.push("geomTransf Linear 1 0.0 0.0 1.0"), V.push("geomTransf Linear 2 -1.0 0.0 0.0"), V.push(""), V.push("# --- Elements ---"), N.forEach((Q, K) => {
      var _a2, _b2, _c, _d, _e, _f;
      if (Q.length !== 2) return;
      const ne = y[Q[0]], ge = y[Q[1]], A = Math.abs(ge[2] - ne[2]) > Math.max(Math.abs(ge[0] - ne[0]), Math.abs(ge[1] - ne[1])) ? 2 : 1, J = ((_a2 = oe.areas) == null ? void 0 : _a2.get(K)) ?? 1, Se = ((_b2 = oe.elasticities) == null ? void 0 : _b2.get(K)) ?? 2e5, be = ((_c = oe.shearModuli) == null ? void 0 : _c.get(K)) ?? 8e4, ce = ((_d = oe.torsionalConstants) == null ? void 0 : _d.get(K)) ?? 1, re = ((_e = oe.momentsOfInertiaZ) == null ? void 0 : _e.get(K)) ?? 1, ie = ((_f = oe.momentsOfInertiaY) == null ? void 0 : _f.get(K)) ?? 1;
      V.push(`element elasticBeamColumn ${K + 1} ${Q[0] + 1} ${Q[1] + 1} ${J} ${Se} ${be} ${ce} ${re} ${ie} ${A}`);
    }), V.push(""), L.loads && L.loads.size > 0 && (V.push("# --- Loads ---"), V.push("timeSeries Linear 1"), V.push("pattern Plain 1 1 {"), L.loads.forEach((Q, K) => {
      const ne = Q.map((ge) => ge).join(" ");
      V.push(`  load ${K + 1} ${ne}`);
    }), V.push("}"), V.push("")), V.push("# --- Analysis ---"), V.push("system BandGeneral"), V.push("numberer RCM"), V.push("constraints Plain"), V.push("integrator LoadControl 1.0"), V.push("algorithm Linear"), V.push("analysis Static"), V.push("analyze 1"), V.push(""), V.push("# --- Results ---"), V.push('puts "\\n=== Displacements ==="'), y.forEach((Q, K) => {
      V.push(`puts "Node ${K + 1}: [nodeDisp ${K + 1}]"`);
    }), V.push('puts "\\n=== Reactions ==="'), V.push("reactions"), (_b = L.supports) == null ? void 0 : _b.forEach((Q, K) => {
      V.push(`puts "Node ${K + 1}: [nodeReaction ${K + 1}]"`);
    }), V.join(`
`);
  }
  function Bl(e) {
    const y = [], N = [], L = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), ge = /* @__PURE__ */ new Map(), Ee = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map();
    for (const Se of e.split(/\r?\n/)) {
      const be = Se.trim(), ce = be.match(/ops\.node\(\s*(\d+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)/);
      if (ce) {
        const xe = parseInt(ce[1]), Te = y.length;
        y.push([
          parseFloat(ce[2]),
          parseFloat(ce[3]),
          parseFloat(ce[4])
        ]), A.set(xe, Te);
        continue;
      }
      const re = be.match(/ops\.fix\(\s*(\d+)\s*,\s*(\d)\s*,\s*(\d)\s*,\s*(\d)\s*,\s*(\d)\s*,\s*(\d)\s*,\s*(\d)/);
      if (re) {
        const xe = parseInt(re[1]), Te = A.get(xe);
        Te !== void 0 && L.set(Te, [
          re[2] === "1",
          re[3] === "1",
          re[4] === "1",
          re[5] === "1",
          re[6] === "1",
          re[7] === "1"
        ]);
        continue;
      }
      const ie = be.match(/ops\.element\(\s*'elasticBeamColumn'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)/);
      if (ie) {
        const xe = parseInt(ie[1]), Te = A.get(parseInt(ie[2])), Ce = A.get(parseInt(ie[3]));
        if (Te !== void 0 && Ce !== void 0) {
          const Pe = N.length;
          N.push([
            Te,
            Ce
          ]), J.set(xe, Pe), K.set(Pe, parseFloat(ie[4])), V.set(Pe, parseFloat(ie[5])), Q.set(Pe, parseFloat(ie[6])), Ee.set(Pe, parseFloat(ie[7])), ge.set(Pe, parseFloat(ie[8])), ne.set(Pe, parseFloat(ie[9]));
        }
        continue;
      }
      const he = be.match(/ops\.load\(\s*(\d+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)/);
      if (he) {
        const xe = A.get(parseInt(he[1]));
        xe !== void 0 && oe.set(xe, [
          parseFloat(he[2]),
          parseFloat(he[3]),
          parseFloat(he[4]),
          parseFloat(he[5]),
          parseFloat(he[6]),
          parseFloat(he[7])
        ]);
      }
    }
    return {
      nodes: y,
      elements: N,
      nodeInputs: {
        supports: L,
        loads: oe
      },
      elementInputs: {
        elasticities: V,
        shearModuli: Q,
        areas: K,
        momentsOfInertiaY: ne,
        momentsOfInertiaZ: ge,
        torsionalConstants: Ee
      }
    };
  }
  function Dl(e) {
    const y = [], N = [], L = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), ge = /* @__PURE__ */ new Map(), Ee = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map();
    for (const J of e.split(/\r?\n/)) {
      const Se = J.trim();
      if (Se.startsWith("#") || Se.startsWith("//")) continue;
      const be = Se.split(/\s+/);
      if (be[0] === "node" && be.length >= 5) {
        const ce = parseInt(be[1]), re = y.length;
        y.push([
          parseFloat(be[2]),
          parseFloat(be[3]),
          parseFloat(be[4])
        ]), A.set(ce, re);
        continue;
      }
      if (be[0] === "fix" && be.length >= 8) {
        const ce = A.get(parseInt(be[1]));
        ce !== void 0 && L.set(ce, [
          be[2] === "1",
          be[3] === "1",
          be[4] === "1",
          be[5] === "1",
          be[6] === "1",
          be[7] === "1"
        ]);
        continue;
      }
      if (be[0] === "element" && be[1] === "elasticBeamColumn" && be.length >= 12) {
        const ce = A.get(parseInt(be[3])), re = A.get(parseInt(be[4]));
        if (ce !== void 0 && re !== void 0) {
          const ie = N.length;
          N.push([
            ce,
            re
          ]), K.set(ie, parseFloat(be[5])), V.set(ie, parseFloat(be[6])), Q.set(ie, parseFloat(be[7])), Ee.set(ie, parseFloat(be[8])), ne.set(ie, parseFloat(be[9])), ge.set(ie, parseFloat(be[10]));
        }
        continue;
      }
      if (be[0] === "load" && be.length >= 8) {
        const ce = A.get(parseInt(be[1]));
        ce !== void 0 && oe.set(ce, [
          parseFloat(be[2]),
          parseFloat(be[3]),
          parseFloat(be[4]),
          parseFloat(be[5]),
          parseFloat(be[6]),
          parseFloat(be[7])
        ]);
      }
    }
    return {
      nodes: y,
      elements: N,
      nodeInputs: {
        supports: L,
        loads: oe
      },
      elementInputs: {
        elasticities: V,
        shearModuli: Q,
        areas: K,
        momentsOfInertiaY: ne,
        momentsOfInertiaZ: ge,
        torsionalConstants: Ee
      }
    };
  }
  function Pt(e) {
    const y = [];
    let N = 0, L = false, oe = "";
    for (let V = 0; V < e.length; V++) {
      const Q = e[V];
      if (Q === "'" && (V === 0 || e[V - 1] !== "\\")) {
        L = !L, oe += Q;
        continue;
      }
      if (L) {
        oe += Q;
        continue;
      }
      if (Q === "(") {
        N++, oe += Q;
        continue;
      }
      if (Q === ")") {
        N--, oe += Q;
        continue;
      }
      if (Q === "," && N === 0) {
        y.push(oe.trim()), oe = "";
        continue;
      }
      oe += Q;
    }
    return oe.trim() && y.push(oe.trim()), y;
  }
  function ga(e, y) {
    const N = Pt(e);
    if (y < N.length) {
      let L = N[y].trim();
      return L.startsWith("'") && L.endsWith("'") && (L = L.slice(1, -1)), L === "$" ? null : L;
    }
    return null;
  }
  function jl(e) {
    const y = {
      schema: "",
      project: "",
      app: ""
    }, N = {}, L = {}, oe = e.match(/FILE_SCHEMA\s*\(\s*\(\s*'([^']*)'/i);
    oe && (y.schema = oe[1]);
    const V = /^#(\d+)\s*=\s*([A-Z][A-Z0-9_]*)\s*\(([\s\S]*?)\)\s*;\s*$/gm;
    let Q;
    for (; (Q = V.exec(e)) !== null; ) {
      const K = parseInt(Q[1]), ne = Q[2].toUpperCase();
      N[K] = {
        id: K,
        type: ne,
        args: Q[3]
      }, L[ne] || (L[ne] = []), L[ne].push(K);
    }
    if (L.IFCPROJECT) {
      const K = N[L.IFCPROJECT[0]];
      if (K) {
        const ne = ga(K.args, 2);
        ne && (y.project = ne);
      }
    }
    return {
      meta: y,
      entities: N,
      typeIndex: L
    };
  }
  function zt(e, y) {
    const N = y.match(/#(\d+)/);
    return N && e[parseInt(N[1])] || null;
  }
  function ha(e, y) {
    const N = Pt(y.args), L = zt(e, N[0]), oe = L ? Wl(e, L) : [
      0,
      0,
      0
    ];
    let V = [
      0,
      0,
      1
    ], Q = [
      1,
      0,
      0
    ];
    if (N[1] && N[1] !== "$") {
      const K = zt(e, N[1]);
      K && (V = ua(e, K));
    }
    if (N[2] && N[2] !== "$") {
      const K = zt(e, N[2]);
      K && (Q = ua(e, K));
    }
    return {
      origin: oe,
      dirZ: V,
      dirX: Q
    };
  }
  function Wl(e, y) {
    return y.args.replace(/[()]/g, "").split(",").map((L) => parseFloat(L.trim())).filter((L) => !isNaN(L));
  }
  function ua(e, y) {
    return y.args.replace(/[()]/g, "").split(",").map((L) => parseFloat(L.trim())).filter((L) => !isNaN(L));
  }
  function xa(e, y) {
    const N = Pt(y.args), L = zt(e, N[1]);
    let oe = {
      origin: [
        0,
        0,
        0
      ],
      dirZ: [
        0,
        0,
        1
      ],
      dirX: [
        1,
        0,
        0
      ]
    };
    if (L && (oe = ha(e, L)), N[0] && N[0] !== "$") {
      const V = zt(e, N[0]);
      if (V && V.type === "IFCLOCALPLACEMENT") {
        const Q = xa(e, V), K = cs(oe.origin, Q.dirX, is(Q.dirZ, Q.dirX), Q.dirZ);
        oe.origin = [
          Q.origin[0] + K[0],
          Q.origin[1] + K[1],
          Q.origin[2] + K[2]
        ], oe.dirZ = cs(oe.dirZ, Q.dirX, is(Q.dirZ, Q.dirX), Q.dirZ), oe.dirX = cs(oe.dirX, Q.dirX, is(Q.dirZ, Q.dirX), Q.dirZ);
      }
    }
    return oe;
  }
  function is(e, y) {
    return [
      e[1] * y[2] - e[2] * y[1],
      e[2] * y[0] - e[0] * y[2],
      e[0] * y[1] - e[1] * y[0]
    ];
  }
  function cs(e, y, N, L) {
    return [
      e[0] * y[0] + e[1] * N[0] + e[2] * L[0],
      e[0] * y[1] + e[1] * N[1] + e[2] * L[1],
      e[0] * y[2] + e[1] * N[2] + e[2] * L[2]
    ];
  }
  const Gl = 0.01;
  function Yl(e) {
    const y = jl(e), { entities: N, typeIndex: L } = y, oe = [], V = [], Q = /* @__PURE__ */ new Map();
    Q.set("Hormigon", {
      E: 2132888792e-2,
      nu: 0.2,
      rho: 2.4
    }), Q.set("Acero", {
      E: 2e8,
      nu: 0.3,
      rho: 7.85
    });
    let K = 0, ne = 0;
    function ge(re, ie, he) {
      for (const xe of oe) {
        const Te = xe.x - re, Ce = xe.y - ie, Pe = xe.z - he;
        if (Math.sqrt(Te * Te + Ce * Ce + Pe * Pe) < Gl) return xe.id;
      }
      return oe.push({
        id: K,
        x: re,
        y: ie,
        z: he
      }), K++;
    }
    function Ee(re) {
      const ie = ga(re.args, 2) || "", he = L.IFCRELASSOCIATESMATERIAL || [];
      for (const Te of he) {
        const Ce = N[Te];
        if (!Ce) continue;
        const Pe = Pt(Ce.args);
        if ((Pe[4] || Pe[3] || "").includes(`#${re.id}`)) {
          const qe = Pe[5] || Pe[4] || "", Ge = zt(N, qe);
          if (Ge) return A(Ge);
        }
      }
      const xe = ie.match(/(\d+)\s*[xX×]\s*(\d+)/);
      return xe ? {
        b: parseFloat(xe[1]) / 100,
        h: parseFloat(xe[2]) / 100,
        name: ie
      } : {
        b: 0.3,
        h: 0.3,
        name: ie || "Default"
      };
    }
    function A(re) {
      const ie = re.type;
      if (ie === "IFCRECTANGLEPROFILEDEF") {
        const he = Pt(re.args), xe = (he[1] || "").replace(/'/g, ""), Te = parseFloat(he[3]) || 0.3, Ce = parseFloat(he[4]) || 0.3;
        return {
          b: Te,
          h: Ce,
          name: xe
        };
      }
      if (ie === "IFCMATERIALPROFILE") {
        const he = Pt(re.args), xe = he[2] || he[1] || "", Te = zt(N, xe);
        if (Te) return A(Te);
      }
      if (ie === "IFCMATERIALPROFILESET") {
        const he = Pt(re.args), Te = (he[2] || he[1] || "").match(/#(\d+)/);
        if (Te) {
          const Ce = N[parseInt(Te[1])];
          if (Ce) return A(Ce);
        }
      }
      if (ie === "IFCMATERIALPROFILESETUSAGE") {
        const xe = Pt(re.args)[0], Te = zt(N, xe);
        if (Te) return A(Te);
      }
      return {
        b: 0.3,
        h: 0.3,
        name: "Unknown"
      };
    }
    function J(re, ie, he, xe) {
      const Te = L[re] || [];
      for (const Ce of Te) {
        const Pe = N[Ce];
        if (!Pe) continue;
        const Ue = Pt(Pe.args), qe = Ue[5] || Ue[4] || "", Ge = zt(N, qe);
        if (!Ge) continue;
        const nt = xa(N, Ge), Xe = Ee(Pe);
        let Ze = xe, Ye = null, xt = null;
        const io = Ue[6] || Ue[5] || "", qt = zt(N, io);
        if (qt) {
          const Xt = Mn(N, qt);
          Xt && (Ze = Xt.depth || xe, Ye = Xt.origin, xt = Xt.direction);
        }
        const Nt = Ye ? Ye[0] : nt.origin[0], Co = Ye ? Ye[1] : nt.origin[1], Ao = Ye ? Ye[2] : nt.origin[2], vo = xt || (he === "Z" ? nt.dirZ : nt.dirX), Fo = ge(Nt, Co, Ao), _t = ge(Nt + vo[0] * Ze, Co + vo[1] * Ze, Ao + vo[2] * Ze);
        V.push({
          id: ne++,
          type: "frame",
          nodeIds: [
            Fo,
            _t
          ],
          category: ie,
          sectionName: Xe.name,
          b: Xe.b,
          h: Xe.h,
          material: "Hormigon",
          expressID: Ce
        });
      }
    }
    J("IFCCOLUMN", "column", "Z", 3), J("IFCBEAM", "beam", "X", 5), J("IFCMEMBER", "diagonal", "X", 4), J("IFCPILE", "pile", "Z", 10), J("IFCSTAIRFLIGHT", "stair", "X", 3), J("IFCRAMPFLIGHT", "ramp", "X", 4);
    function Se(re, ie, he) {
      const xe = L[re] || [];
      for (const Te of xe) {
        const Ce = N[Te];
        if (!Ce) continue;
        const Pe = Pt(Ce.args), Ue = Pe[5] || Pe[4] || "";
        if (!zt(N, Ue)) continue;
        let Ge = he;
        const nt = Pe[6] || Pe[5] || "", Xe = zt(N, nt);
        Xe && (Ge = Vl(N, Xe) || he);
        const Ze = ie === "slab" ? `Losa e=${(Ge * 100).toFixed(0)}cm` : ie === "wall" ? `Muro e=${(Ge * 100).toFixed(0)}cm` : ie === "footing" ? `Zapata e=${(Ge * 100).toFixed(0)}cm` : `${ie} e=${(Ge * 100).toFixed(0)}cm`;
        V.push({
          id: ne++,
          type: "shell",
          nodeIds: [],
          category: ie,
          sectionName: Ze,
          b: Ge,
          h: Ge,
          material: "Hormigon",
          expressID: Te
        });
      }
    }
    Se("IFCSLAB", "slab", 0.15), Se("IFCWALL", "wall", 0.2), Se("IFCWALLSTANDARDCASE", "wall", 0.2), Se("IFCFOOTING", "footing", 0.5), Se("IFCROOF", "slab", 0.12);
    const be = [], ce = L.IFCBUILDINGSTOREY || [];
    for (const re of ce) {
      const ie = N[re];
      if (!ie) continue;
      const he = Pt(ie.args), xe = (he[2] || "").replace(/'/g, ""), Te = parseFloat(he[9]) || 0;
      be.push({
        name: xe,
        elevation: Te
      });
    }
    return be.sort((re, ie) => re.elevation - ie.elevation), {
      nodes: oe,
      elements: V,
      materials: Q,
      levels: be,
      projectName: y.meta.project,
      schema: y.meta.schema
    };
  }
  function Mn(e, y) {
    const N = Pt(y.args);
    for (const L of N) {
      const oe = L.match(/#(\d+)/g) || [];
      for (const V of oe) {
        const Q = parseInt(V.replace("#", "")), K = e[Q];
        if (K) {
          if (K.type === "IFCEXTRUDEDAREASOLID") {
            const ne = Pt(K.args), ge = parseFloat(ne[3]) || 0, Ee = zt(e, ne[1]);
            let A = [
              0,
              0,
              0
            ];
            Ee && (A = ha(e, Ee).origin);
            const J = zt(e, ne[2]);
            let Se = [
              0,
              0,
              1
            ];
            if (J && J.type === "IFCDIRECTION") {
              const be = J.args.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g);
              be && be.length >= 3 && (Se = be.map(Number));
            }
            return {
              depth: ge,
              origin: A,
              direction: Se
            };
          }
          if (K.type === "IFCSHAPEREPRESENTATION") {
            const ne = Mn(e, K);
            if (ne) return ne;
          }
          if (K.type === "IFCMAPPEDITEM") {
            const ne = Pt(K.args), ge = zt(e, ne[0]);
            if (ge && ge.type === "IFCREPRESENTATIONMAP") {
              const Ee = Pt(ge.args), A = zt(e, Ee[1]);
              if (A) {
                const J = Mn(e, A);
                if (J) return J;
              }
            }
          }
        }
      }
    }
    return null;
  }
  function Vl(e, y) {
    const N = Mn(e, y);
    return N ? N.depth : null;
  }
  const va = [
    [
      843113511,
      "column"
    ],
    [
      753842376,
      "beam"
    ],
    [
      1529196076,
      "slab"
    ],
    [
      900683007,
      "footing"
    ],
    [
      1687234759,
      "footing"
    ],
    [
      979691226,
      "rebar"
    ],
    [
      2320036040,
      "rebar"
    ],
    [
      3171933400,
      "plate"
    ],
    [
      1073191201,
      "member"
    ],
    [
      377706215,
      "fastener"
    ],
    [
      2391406946,
      "wall"
    ],
    [
      3512223829,
      "wall"
    ],
    [
      3304561284,
      "opening"
    ],
    [
      395920057,
      "opening"
    ]
  ], ya = [
    "column",
    "beam",
    "slab",
    "footing",
    "rebar",
    "plate",
    "member",
    "fastener",
    "wall",
    "opening",
    "other"
  ], $a = /* @__PURE__ */ new Map();
  for (const [e, y] of va) $a.set(e, y);
  function Jl(e) {
    return $a.get(e) ?? "other";
  }
  new Set(ya);
  async function Xl(e, y) {
    var _a, _b;
    const N = window.WebIFC;
    if (!N) throw new Error("web-ifc no disponible. Verifica que web-ifc-api-iife.js se carg\xF3.");
    const L = new N.IfcAPI(), oe = window.location.pathname.replace(/\/[^/]*$/, "/");
    L.SetWasmPath(oe), await L.Init();
    const V = L.OpenModel(new Uint8Array(y)), Q = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), ne = {
      843113511: "Columna",
      753842376: "Viga",
      1529196076: "Losa",
      900683007: "Zapata",
      1687234759: "Pilote",
      979691226: "Barra Refuerzo",
      2320036040: "Malla Refuerzo",
      3171933400: "Placa",
      1073191201: "Miembro",
      377706215: "Perno/Anclaje",
      2391406946: "Muro",
      3512223829: "Muro",
      3304561284: "Ventana",
      395920057: "Puerta"
    };
    for (const [Se] of va) {
      const be = Jl(Se);
      try {
        const ce = L.GetLineIDsWithType(V, Se);
        for (let re = 0; re < ce.size(); re++) {
          const ie = ce.get(re);
          Q.set(ie, be);
          let he = "";
          try {
            const xe = L.GetLine(V, ie);
            he = ((_a = xe == null ? void 0 : xe.Name) == null ? void 0 : _a.value) || ((_b = xe == null ? void 0 : xe.Description) == null ? void 0 : _b.value) || "";
          } catch {
          }
          K.set(ie, {
            expressID: ie,
            category: be,
            name: he,
            typeName: ne[Se] || "Otro"
          });
        }
      } catch {
      }
    }
    const ge = /* @__PURE__ */ new Map();
    for (const Se of ya) {
      const be = new nn();
      be.name = `ifc-${Se}`, e.add(be), ge.set(Se, be);
    }
    const Ee = new el();
    let A = 0;
    const J = new sa({
      color: 13421772,
      transparent: true,
      opacity: 0.9,
      side: aa
    });
    return L.StreamAllMeshes(V, (Se) => {
      const be = Q.get(Se.expressID) ?? "other", ce = ge.get(be), re = Se.geometries;
      for (let ie = 0; ie < re.size(); ie++) {
        const he = re.get(ie), xe = L.GetGeometry(V, he.geometryExpressID), Te = L.GetVertexArray(xe.GetVertexData(), xe.GetVertexDataSize()), Ce = L.GetIndexArray(xe.GetIndexData(), xe.GetIndexDataSize()), Pe = new Dt(), Ue = new Float32Array(Te.length / 2), qe = new Float32Array(Te.length / 2);
        for (let Ye = 0; Ye < Te.length; Ye += 6) {
          const xt = Ye / 2;
          Ue[xt] = Te[Ye], Ue[xt + 1] = Te[Ye + 1], Ue[xt + 2] = Te[Ye + 2], qe[xt] = Te[Ye + 3], qe[xt + 1] = Te[Ye + 4], qe[xt + 2] = Te[Ye + 5];
        }
        Pe.setAttribute("position", new yn(Ue, 3)), Pe.setAttribute("normal", new yn(qe, 3)), Pe.setIndex(new yn(new Uint32Array(Ce), 1));
        const Ge = new tl();
        Ge.fromArray(he.flatTransformation);
        let nt;
        const Xe = he.color;
        Xe && (Xe.x !== 1 || Xe.y !== 1 || Xe.z !== 1) ? nt = new sa({
          color: new ol(Xe.x, Xe.y, Xe.z),
          transparent: Xe.w < 1,
          opacity: Xe.w,
          side: aa
        }) : nt = J, nt._origOpacity = nt.opacity;
        const Ze = new ba(Pe, nt);
        Ze.applyMatrix4(Ge), Ze.userData.expressID = Se.expressID, Ze.userData.category = be, ce.add(Ze), Ee.expandByObject(Ze), A++, xe.delete();
      }
    }), L.CloseModel(V), {
      meshCount: A,
      bbox: Ee,
      detailCategories: ge,
      elementInfo: K
    };
  }
  ma = jo.state(false);
  dr = function(e) {
    e.nodeInputs || (e.nodeInputs = jo.state({})), e.elementInputs || (e.elementInputs = jo.state({})), e.deformOutputs || (e.deformOutputs = jo.state({})), e.analyzeOutputs || (e.analyzeOutputs = jo.state({}));
    let y = "tonf", N = "m", L = zo(y, N), oe = {
      forceId: "kgf",
      lengthId: "cm",
      label: "kgf/cm\xB2"
    };
    const V = {
      MKS: {
        force: "tonf",
        length: "m",
        stress: {
          forceId: "kgf",
          lengthId: "cm",
          label: "kgf/cm\xB2"
        }
      },
      SI: {
        force: "kN",
        length: "m",
        stress: {
          forceId: "kN",
          lengthId: "m",
          label: "kPa"
        }
      },
      US: {
        force: "kip",
        length: "in",
        stress: {
          forceId: "kip",
          lengthId: "in",
          label: "ksi"
        }
      }
    }, Q = /* @__PURE__ */ new Set(), K = /* @__PURE__ */ new Set();
    let ne = false;
    const ge = /* @__PURE__ */ new Set(), Ee = /* @__PURE__ */ new Map();
    let A = "", J = {}, Se = null, be = "", ce = [], re = [], ie = [], he = /* @__PURE__ */ new Set(), xe = /* @__PURE__ */ new Set(), Te = /* @__PURE__ */ new Set(), Ce = /* @__PURE__ */ new Map(), Pe = /* @__PURE__ */ new Map(), Ue = null, qe = [], Ge = 0.2, nt = 2, Xe = 2, Ze = false, Ye = 2, xt = "x", io = /* @__PURE__ */ new Set(), qt = true, Nt = 0.15, Co = 2, Ao = 2, vo = /* @__PURE__ */ new Set(), Fo = false, _t = "perimeter";
    const Xt = () => ({
      b: 0.3,
      h: 0.4,
      profileIdx: 0,
      secType: 0,
      bf: 0.2,
      hf: 0.4,
      tf: 0.015,
      tw: 0.01,
      hc: 0.3,
      bc: 0.2,
      t: 8e-3
    }), wa = (t, o) => ({
      bCol: 0.4,
      hCol: 0.4,
      dCol: 0.4,
      colProfileIdx: 0,
      colSecType: 0,
      colBf: 0.3,
      colHf: 0.3,
      colTf: 0.02,
      colTw: 0.012,
      colHc: 0.3,
      colBc: 0.3,
      colT: 0.01,
      colFc: 20594,
      colEs: 2e8,
      colNuS: 0.3,
      colNuC: 0.2,
      vigasX: Array.from({
        length: t
      }, Xt),
      vigasY: Array.from({
        length: o
      }, Xt)
    }), ke = {
      colMat: 0,
      vigaMat: 0,
      colShape: 0,
      fc: 20594,
      steelColType: 0,
      steelVigaType: 0,
      perFloor: []
    };
    let Lt = 0, jt = 3, Wt = false, Mt = 0, ft = null, co = 0, ao = [], an = 1, ln = true;
    const Yo = ul();
    Yo.div.style.display = "none";
    function kn() {
      const t = bn()[A];
      return t && t[Lt] ? t[Lt].dofs : [
        true,
        true,
        true,
        true,
        true,
        true
      ];
    }
    let Ve = [], Ke = [], po = 0, Et = [], Gt = null;
    function En() {
      if (!Gt) return;
      const t = De();
      t && t.scene.remove(Gt), Gt.traverse((o) => {
        if (o.geometry && o.geometry.dispose(), o.material) {
          const n = o.material;
          n.map && n.map.dispose(), n.dispose();
        }
      }), Gt = null;
    }
    function us(t, o, n, l, s) {
      En();
      const u = De();
      if (!u) return;
      Gt = new nn(), Gt.name = "refGrid";
      const a = Math.min(...t), i = Math.max(...t), d = Math.min(...o), r = Math.max(...o), c = Math.max(...n), m = i - a || 1, w = r - d || 1, M = 3359829, v = 2241348;
      for (const b of n) {
        for (const I of o) {
          const E = new Dt().setFromPoints([
            new Me(a, b, I),
            new Me(i, b, I)
          ]), $ = new Ho({
            color: M,
            dashSize: m * 0.015,
            gapSize: m * 0.01,
            transparent: true,
            opacity: 0.25
          }), C = new Eo(E, $);
          C.computeLineDistances(), C.renderOrder = -10, Gt.add(C);
        }
        for (const I of t) {
          const E = new Dt().setFromPoints([
            new Me(I, b, d),
            new Me(I, b, r)
          ]), $ = new Ho({
            color: M,
            dashSize: w * 0.015,
            gapSize: w * 0.01,
            transparent: true,
            opacity: 0.25
          }), C = new Eo(E, $);
          C.computeLineDistances(), C.renderOrder = -10, Gt.add(C);
        }
      }
      for (const b of t) for (const I of o) {
        const E = new Dt().setFromPoints([
          new Me(b, 0, I),
          new Me(b, c, I)
        ]), $ = new Ho({
          color: v,
          dashSize: c * 0.01,
          gapSize: c * 8e-3,
          transparent: true,
          opacity: 0.15
        }), C = new Eo(E, $);
        C.computeLineDistances(), C.renderOrder = -10, Gt.add(C);
      }
      const p = Math.min(m, w) * 0.015;
      for (const b of n) for (const I of t) for (const E of o) {
        const $ = [
          new Me(I - p, b, E),
          new Me(I + p, b, E),
          new Me(I, b, E - p),
          new Me(I, b, E + p)
        ], C = new Dt().setFromPoints($), R = new Do({
          color: 5596791,
          transparent: true,
          opacity: 0.4
        }), g = new Bo(C, R);
        g.renderOrder = -5, Gt.add(g);
      }
      Gt.traverse((b) => {
        b.material && (Array.isArray(b.material) ? b.material.forEach((I) => {
          I.clippingPlanes = [];
        }) : b.material.clippingPlanes = []);
      }), u.scene.add(Gt), u.render();
    }
    let ht = null;
    function ms() {
      if (!ht) return;
      const t = De();
      t && t.scene.remove(ht), ht.traverse((o) => {
        if (o.geometry && o.geometry.dispose(), o.material) {
          const n = o.material;
          n.map && n.map.dispose(), n.dispose();
        }
      }), ht = null;
    }
    function Vo(t, o, n, l, s) {
      ms();
      const u = De();
      if (!u) return;
      ht = new nn(), ht.name = "gridAxes";
      const a = Math.min(...t), i = Math.max(...t), d = Math.min(...o), r = Math.max(...o), c = i - a || 1, m = r - d || 1, w = Math.max(c, m), M = w * 0.08, v = l || t.map((g, f) => String.fromCharCode(65 + f)), p = s || o.map((g, f) => String(f + 1)), b = w * 0.018, I = o.length <= 1, E = 8947848;
      for (let g = 0; g < t.length; g++) {
        const f = t[g];
        if (I) {
          const k = -M - b * 1.5;
          Tn(f, 0, 0, f, 0, k + b, E, ht), Cn(v[g] || `${g}`, f, 0, k, b, ht);
        } else {
          const k = d - M - b * 1.5;
          Tn(f, d, 0, f, k + b, 0, E, ht), Cn(v[g] || `${g}`, f, k, 0, b, ht);
        }
      }
      if (!I) for (let g = 0; g < o.length; g++) {
        const f = o[g], k = a - M - b * 1.5;
        Tn(a, f, 0, k + b, f, 0, E, ht), Cn(p[g] || `${g}`, k, f, 0, b, ht);
      }
      const $ = b * 1.8, C = M * 1.2, R = M * 1.2;
      for (let g = 0; g < t.length - 1; g++) {
        const f = t[g], k = t[g + 1], F = Math.abs(k - f), q = (f + k) / 2, H = `${F.toFixed(2)} m`;
        I ? (zn(H, q, 0, -C, $, ht), Ln(f, 0, -C * 0.7, k, 0, -C * 0.7, 16763904, ht)) : (zn(H, q, d - R, 0, $, ht), Ln(f, d - R * 0.7, 0, k, d - R * 0.7, 0, 16763904, ht));
      }
      if (!I) for (let g = 0; g < o.length - 1; g++) {
        const f = o[g], k = o[g + 1], F = Math.abs(k - f), q = (f + k) / 2, H = `${F.toFixed(2)} m`;
        zn(H, a - C, q, 0, $, ht), Ln(a - C * 0.7, f, 0, a - C * 0.7, k, 0, 16763904, ht);
      }
      ht.traverse((g) => {
        g.material && (Array.isArray(g.material) ? g.material.forEach((f) => {
          f.clippingPlanes = [];
        }) : g.material.clippingPlanes = []);
      }), u.scene.add(ht), u.render();
    }
    let Tt = null;
    function bs() {
      if (!Tt) return;
      const t = De();
      t && t.scene.remove(Tt), Tt.traverse((o) => {
        if (o.geometry && o.geometry.dispose(), o.material) {
          const n = o.material;
          n.map && n.map.dispose(), n.dispose();
        }
      }), Tt = null;
    }
    function In(t, o, n) {
      if (bs(), t.length === 0) return;
      const l = De();
      if (!l) return;
      Tt = new nn(), Tt.name = "storyLevels";
      const s = Math.min(...o), u = Math.max(...o), a = Math.min(...n), i = Math.max(...n), d = u - s || 1, r = i - a || 1, c = Math.max(d, r), m = c * 0.06, w = n.length <= 1, M = 4491519, v = c * 0.015;
      for (const p of t) {
        const b = p.elev;
        w ? (Jo(s - m, 0, b, u + m, 0, b, M, Tt), gs(p.name, u + m * 1.5, 0, b, v, Tt)) : (Jo(s, a, b, u, a, b, M, Tt), Jo(u, a, b, u, i, b, M, Tt), Jo(u, i, b, s, i, b, M, Tt), Jo(s, i, b, s, a, b, M, Tt), gs(p.name, s - m * 1.5, a, b, v, Tt));
      }
      Tt.traverse((p) => {
        p.material && (Array.isArray(p.material) ? p.material.forEach((b) => {
          b.clippingPlanes = [];
        }) : p.material.clippingPlanes = []);
      }), l.scene.add(Tt), l.render();
    }
    function Jo(t, o, n, l, s, u, a, i) {
      const d = Math.sqrt((l - t) ** 2 + (s - o) ** 2 + (u - n) ** 2) || 1, r = new Dt().setFromPoints([
        new Me(t, o, n),
        new Me(l, s, u)
      ]), c = new Ho({
        color: a,
        dashSize: d * 0.02,
        gapSize: d * 0.01,
        transparent: true,
        opacity: 0.5
      }), m = new Eo(r, c);
      m.computeLineDistances(), m.renderOrder = 50, i.add(m);
    }
    function gs(t, o, n, l, s, u) {
      const a = document.createElement("canvas"), i = 512, d = 64;
      a.width = i, a.height = d;
      const r = a.getContext("2d");
      r.fillStyle = "rgba(30,60,120,0.8)";
      const c = 8;
      r.beginPath(), r.moveTo(c, 0), r.lineTo(i - c, 0), r.quadraticCurveTo(i, 0, i, c), r.lineTo(i, d - c), r.quadraticCurveTo(i, d, i - c, d), r.lineTo(c, d), r.quadraticCurveTo(0, d, 0, d - c), r.lineTo(0, c), r.quadraticCurveTo(0, 0, c, 0), r.closePath(), r.fill(), r.fillStyle = "#88bbff", r.font = "bold 38px monospace", r.textAlign = "center", r.textBaseline = "middle", r.fillText(t, i / 2, d / 2);
      const m = new Qn(a);
      m.needsUpdate = true;
      const w = new mn({
        map: m,
        depthTest: false,
        transparent: true
      }), M = new un(w);
      M.position.set(o, n, l), M.scale.set(s * 8, s, 1), M.renderOrder = 101, u.add(M);
    }
    function zn(t, o, n, l, s, u) {
      const a = document.createElement("canvas"), i = 256, d = 64;
      a.width = i, a.height = d;
      const r = a.getContext("2d");
      r.fillStyle = "rgba(0,0,0,0.75)";
      const c = 8;
      r.beginPath(), r.moveTo(c, 0), r.lineTo(i - c, 0), r.quadraticCurveTo(i, 0, i, c), r.lineTo(i, d - c), r.quadraticCurveTo(i, d, i - c, d), r.lineTo(c, d), r.quadraticCurveTo(0, d, 0, d - c), r.lineTo(0, c), r.quadraticCurveTo(0, 0, c, 0), r.closePath(), r.fill(), r.fillStyle = "#ffcc00", r.font = "bold 36px monospace", r.textAlign = "center", r.textBaseline = "middle", r.fillText(t, i / 2, d / 2);
      const m = new cl(a);
      m.minFilter = dl;
      const w = new mn({
        map: m,
        transparent: true,
        depthTest: false
      }), M = new un(w);
      M.position.set(o, n, l);
      const v = i / d;
      M.scale.set(s * v, s, 1), M.renderOrder = 999, u.add(M);
    }
    function Ln(t, o, n, l, s, u, a, i) {
      const d = [
        new Me(t, o, n),
        new Me(l, s, u)
      ], r = new Dt().setFromPoints(d), c = new Do({
        color: a,
        transparent: true,
        opacity: 0.6,
        depthTest: false
      }), m = new Eo(r, c);
      m.renderOrder = 998, i.add(m);
    }
    function Tn(t, o, n, l, s, u, a, i) {
      const d = new Dt().setFromPoints([
        new Me(t, o, n),
        new Me(l, s, u)
      ]), r = new Ho({
        color: a,
        dashSize: 0.15 * Math.max(Math.abs(l - t), Math.abs(s - o), Math.abs(u - n), 0.1),
        gapSize: 0.1 * Math.max(Math.abs(l - t), Math.abs(s - o), Math.abs(u - n), 0.1),
        transparent: true,
        opacity: 0.6
      }), c = new Eo(d, r);
      c.computeLineDistances(), i.add(c);
    }
    function Cn(t, o, n, l, s, u) {
      const a = document.createElement("canvas"), i = 128;
      a.width = i, a.height = i;
      const d = a.getContext("2d");
      d.beginPath(), d.arc(i / 2, i / 2, i * 0.42, 0, Math.PI * 2), d.fillStyle = "rgba(255,255,255,0.9)", d.fill(), d.lineWidth = i * 0.04, d.strokeStyle = "#555", d.stroke(), d.fillStyle = "#222", d.font = `bold ${i * 0.45}px Arial`, d.textAlign = "center", d.textBaseline = "middle", d.fillText(t, i / 2, i / 2 + i * 0.02);
      const r = new Qn(a);
      r.needsUpdate = true;
      const c = new mn({
        map: r,
        depthTest: false,
        transparent: true
      }), m = new un(c);
      m.position.set(o, n, l);
      const w = s * 2;
      m.scale.set(w, w, 1), m.renderOrder = 100, u.add(m);
    }
    const Re = {
      addNode(t, o, n) {
        const l = [
          ...e.nodes.val
        ], s = l.length;
        return l.push([
          t,
          o,
          n
        ]), e.nodes.val = l, console.log(`Node ${s} at (${t}, ${o}, ${n})`), Ne(), s;
      },
      removeNode(t) {
        const o = [
          ...e.nodes.val
        ];
        if (t < 0 || t >= o.length) {
          console.error(`Node ${t} not found`);
          return;
        }
        o.splice(t, 1);
        const n = e.elements.val.map(([l, s]) => {
          const u = l > t ? l - 1 : l, a = s > t ? s - 1 : s;
          return l === t || s === t ? null : [
            u,
            a
          ];
        }).filter((l) => l !== null);
        e.nodes.val = o, e.elements.val = n, console.log(`Node ${t} removed`), Ne();
      },
      listNodes() {
        const t = e.nodes.val;
        return console.table(t.map((o, n) => ({
          id: n,
          x: o[0],
          y: o[1],
          z: o[2]
        }))), t;
      },
      addFrame(t, o) {
        const n = [
          ...e.elements.val
        ], l = n.length;
        return n.push([
          t,
          o
        ]), e.elements.val = n, console.log(`Element ${l}: node ${t} -> node ${o}`), Ne(), l;
      },
      removeFrame(t) {
        const o = [
          ...e.elements.val
        ];
        if (t < 0 || t >= o.length) {
          console.error(`Element ${t} not found`);
          return;
        }
        o.splice(t, 1), e.elements.val = o, console.log(`Element ${t} removed`), Ne();
      },
      listFrames() {
        const t = e.elements.val;
        return console.table(t.map((o, n) => ({
          id: n,
          nodeI: o[0],
          nodeJ: o[1]
        }))), t;
      },
      addSupport(t, o) {
        if (!e.nodeInputs) return;
        const n = {
          ...e.nodeInputs.val
        }, l = new Map(n.supports || []);
        l.set(t, o || [
          true,
          true,
          true,
          true,
          true,
          true
        ]), n.supports = l, e.nodeInputs.val = n, console.log(`Support added at node ${t}`), Ne();
      },
      removeSupport(t) {
        if (!e.nodeInputs) return;
        const o = {
          ...e.nodeInputs.val
        }, n = new Map(o.supports || []);
        n.delete(t), o.supports = n, e.nodeInputs.val = o, console.log(`Support removed from node ${t}`), Ne();
      },
      addLoad(t, o) {
        if (!e.nodeInputs) return;
        const n = {
          ...e.nodeInputs.val
        }, l = new Map(n.loads || []);
        l.set(t, o), n.loads = l, e.nodeInputs.val = n, console.log(`Load added at node ${t}: [${o.join(", ")}]`), Ne();
      },
      removeLoad(t) {
        if (!e.nodeInputs) return;
        const o = {
          ...e.nodeInputs.val
        }, n = new Map(o.loads || []);
        n.delete(t), o.loads = n, e.nodeInputs.val = o, console.log(`Load removed from node ${t}`), Ne();
      },
      listSupports() {
        if (!e.nodeInputs) return;
        const t = e.nodeInputs.val.supports;
        if (!t || t.size === 0) {
          console.log("No supports");
          return;
        }
        const o = [];
        return t.forEach((n, l) => o.push({
          node: l,
          dof: n.map((s) => s ? 1 : 0).join("")
        })), console.table(o), t;
      },
      listLoads() {
        if (!e.nodeInputs) return;
        const t = e.nodeInputs.val.loads;
        if (!t || t.size === 0) {
          console.log("No loads");
          return;
        }
        const o = [];
        return t.forEach((n, l) => o.push({
          node: l,
          Fx: n[0],
          Fy: n[1],
          Fz: n[2]
        })), console.table(o), t;
      },
      info() {
        var _a2, _b, _c, _d, _e, _f;
        const t = e.nodes.val.length, o = e.elements.val.length, n = ((_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.supports) == null ? void 0 : _c.size) || 0, l = ((_f = (_e = (_d = e.nodeInputs) == null ? void 0 : _d.val) == null ? void 0 : _e.loads) == null ? void 0 : _f.size) || 0;
        return console.log(`Model: ${t} nodes, ${o} elements, ${n} supports, ${l} loads`), {
          nodes: t,
          elements: o,
          supports: n,
          loads: l
        };
      },
      set(t, o) {
        var _a2, _b, _c, _d;
        const n = ve.querySelectorAll("input[type=checkbox]");
        for (const l of n) {
          const s = ((_b = (_a2 = l.closest("label")) == null ? void 0 : _a2.textContent) == null ? void 0 : _b.trim()) || ((_d = (_c = l.parentElement) == null ? void 0 : _c.textContent) == null ? void 0 : _d.trim()) || "", u = l.id || "";
          if (s.toLowerCase().includes(t.toLowerCase()) || u.toLowerCase().includes(t.toLowerCase())) {
            const a = l;
            return a.checked = o !== void 0 ? o : !a.checked, a.dispatchEvent(new Event("change", {
              bubbles: true
            })), console.log(`${s || u}: ${a.checked}`), a.checked;
          }
        }
        console.log(`Setting "${t}" not found. Use cad.settings() to list.`);
      },
      settings() {
        const t = ve.querySelectorAll("input[type=checkbox]"), o = {};
        return t.forEach((n) => {
          var _a2, _b, _c, _d;
          const l = n, s = ((_b = (_a2 = l.closest("label")) == null ? void 0 : _a2.textContent) == null ? void 0 : _b.trim()) || ((_d = (_c = l.parentElement) == null ? void 0 : _c.textContent) == null ? void 0 : _d.trim()) || l.id || "?";
          o[s] = l.checked;
        }), console.table(o), o;
      },
      param(t, o) {
        const n = window.__cad;
        if (n == null ? void 0 : n.setParam) return n.setParam(t, o), console.log(`${t} = ${o}`), o;
        console.log("Parameters not available");
      },
      params() {
        const t = window.__cad;
        if (t == null ? void 0 : t.getParams) {
          const o = t.getParams();
          return console.table(o), o;
        }
        console.log("Parameters not available");
      },
      use(t) {
        const o = window.__cad;
        if (o == null ? void 0 : o.setGenerator) return o.setGenerator(t), console.log(`Generator: ${t}`), t;
      },
      panel(t, o, n) {
        const l = window.__cad;
        if (l == null ? void 0 : l.createCustomPanel) return l.createCustomPanel(t, o, n);
        console.log("Custom panels not available");
      },
      removePanel(t) {
        const o = window.__cad;
        (o == null ? void 0 : o.removeCustomPanel) && (o.removeCustomPanel(t), console.log(`Panel "${t}" removed`));
      },
      refgrid(t, o, n) {
        if (!t) {
          En(), console.log("Reference grid cleared");
          return;
        }
        const l = [
          0
        ];
        for (const a of t) l.push(l[l.length - 1] + a);
        const s = [
          0
        ];
        for (const a of o || [
          0
        ]) s.push(s[s.length - 1] + a);
        const u = [
          0
        ];
        for (const a of n || [
          3
        ]) u.push(u[u.length - 1] + a);
        us(l, s, u), Ve = l.map((a, i) => ({
          label: String.fromCharCode(65 + i),
          coord: a
        })), Ke = s.map((a, i) => ({
          label: `${i + 1}`,
          coord: a
        })), po = u[u.length - 1], Et = u.map((a, i) => ({
          label: i === 0 ? "Base" : `P${i}`,
          elev: a
        })), Vo(Ve.map((a) => a.coord), Ke.map((a) => a.coord), po, Ve.map((a) => a.label), Ke.map((a) => a.label));
        {
          const a = u.map((i, d) => ({
            name: d === 0 ? "Base" : `P${d}`,
            height: d > 0 ? i - u[d - 1] : 0,
            elev: i
          }));
          In(a, Ve.map((i) => i.coord), Ke.map((i) => i.coord));
        }
        return console.log(`RefGrid: X=[${l}] Z=[${s}] Y=[${u}]`), {
          xCoords: l,
          zCoords: s,
          yLevels: u
        };
      },
      build(t) {
        var _a2;
        if (Ve.length === 0 || Et.length < 2) {
          console.log("Error: call cad.refgrid() first to define axes and levels");
          return;
        }
        const o = (t == null ? void 0 : t.col) || "40x40", n = (t == null ? void 0 : t.viga) || "30x40", l = (t == null ? void 0 : t.fc) || 210, [s, u] = o.split("x").map((_) => parseFloat(_) / 100), [a, i] = n.split("x").map((_) => parseFloat(_) / 100), d = Ve.map((_) => _.coord), r = Ke.map((_) => _.coord), c = Et.map((_) => _.elev), m = d.length, w = r.length, M = c.length, v = M - 1, p = [], b = {};
        for (let _ = 0; _ < M; _++) for (let se = 0; se < w; se++) for (let Y = 0; Y < m; Y++) b[`${Y},${se},${_}`] = p.length, p.push([
          d[Y],
          r[se],
          c[_]
        ]);
        const I = [], E = /* @__PURE__ */ new Set(), $ = /* @__PURE__ */ new Set(), C = /* @__PURE__ */ new Map();
        for (let _ = 0; _ < v; _++) for (let se = 0; se < w; se++) for (let Y = 0; Y < m; Y++) {
          const ae = I.length;
          I.push([
            b[`${Y},${se},${_}`],
            b[`${Y},${se},${_ + 1}`]
          ]), E.add(ae), C.set(ae, _);
        }
        for (let _ = 1; _ < M; _++) for (let se = 0; se < w; se++) for (let Y = 0; Y < m - 1; Y++) {
          const ae = I.length;
          I.push([
            b[`${Y},${se},${_}`],
            b[`${Y + 1},${se},${_}`]
          ]), $.add(ae), C.set(ae, _ - 1);
        }
        for (let _ = 1; _ < M; _++) for (let se = 0; se < m; se++) for (let Y = 0; Y < w - 1; Y++) {
          const ae = I.length;
          I.push([
            b[`${se},${Y},${_}`],
            b[`${se},${Y + 1},${_}`]
          ]), $.add(ae), C.set(ae, _ - 1);
        }
        const R = ((_a2 = t == null ? void 0 : t.braces) == null ? void 0 : _a2.toLowerCase()) || "", g = /* @__PURE__ */ new Set();
        if (R) {
          const _ = R === "all" || R === "x" || R === "perimeter", se = R === "all" || R === "y" || R === "perimeter";
          for (let Y = 0; Y < v; Y++) {
            if (_) for (let ae = 0; ae < w; ae++) {
              if (R === "perimeter" && ae !== 0 && ae !== w - 1) continue;
              const W = Math.floor((m - 1) / 2);
              for (let le = 0; le < m - 1; le++) {
                if (R === "perimeter" && le !== W) continue;
                const fe = I.length;
                I.push([
                  b[`${le},${ae},${Y}`],
                  b[`${le + 1},${ae},${Y + 1}`]
                ]), g.add(fe), C.set(fe, Y);
                const U = I.length;
                I.push([
                  b[`${le + 1},${ae},${Y}`],
                  b[`${le},${ae},${Y + 1}`]
                ]), g.add(U), C.set(U, Y);
              }
            }
            if (se) for (let ae = 0; ae < m; ae++) {
              if (R === "perimeter" && ae !== 0 && ae !== m - 1) continue;
              const W = Math.floor((w - 1) / 2);
              for (let le = 0; le < w - 1; le++) {
                if (R === "perimeter" && le !== W) continue;
                const fe = I.length;
                I.push([
                  b[`${ae},${le},${Y}`],
                  b[`${ae},${le + 1},${Y + 1}`]
                ]), g.add(fe), C.set(fe, Y);
                const U = I.length;
                I.push([
                  b[`${ae},${le + 1},${Y}`],
                  b[`${ae},${le},${Y + 1}`]
                ]), g.add(U), C.set(U, Y);
              }
            }
          }
        }
        const f = 15100 * Math.sqrt(l) * 10, k = f / (2 * (1 + 0.2)), F = s * u, q = s * u ** 3 / 12, H = u * s ** 3 / 12, h = s * u * (s ** 2 + u ** 2) / 12, S = a * i, x = a * i ** 3 / 12, z = i * a ** 3 / 12, O = a * i * (a ** 2 + i ** 2) / 12, B = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map();
        for (let _ = 0; _ < I.length; _++) B.set(_, f), G.set(_, k), E.has(_) ? (j.set(_, F), D.set(_, q), X.set(_, H), ee.set(_, h), de.set(_, {
          type: "rect",
          b: s,
          h: u,
          name: `COL${o}`
        })) : g.has(_) ? (j.set(_, F), D.set(_, q), X.set(_, H), ee.set(_, h), de.set(_, {
          type: "rect",
          b: s,
          h: u,
          name: `BR${o}`
        })) : (j.set(_, S), D.set(_, z), X.set(_, x), ee.set(_, O), de.set(_, {
          type: "rect",
          b: a,
          h: i,
          name: `V${n}`
        }));
        const me = /* @__PURE__ */ new Map();
        for (let _ = 0; _ < w; _++) for (let se = 0; se < m; se++) me.set(b[`${se},${_},0`], [
          true,
          true,
          true,
          true,
          true,
          true
        ]);
        return e.nodes.val = p, e.elements.val = I, e.nodeInputs.val = {
          supports: me,
          loads: /* @__PURE__ */ new Map()
        }, e.elementInputs.val = {
          elasticities: B,
          shearModuli: G,
          areas: j,
          momentsOfInertiaY: D,
          momentsOfInertiaZ: X,
          torsionalConstants: ee,
          sectionShapes: de
        }, he = E, xe = $, Ce = C, console.log(`Built: ${p.length} nodes, ${I.length} elements (${E.size} cols, ${$.size} beams, ${g.size} braces)`), console.log(`  Col: ${o}, Viga: ${n}, f'c=${l}${R ? `, braces=${R}` : ""}`), {
          nodes: p.length,
          elements: I.length
        };
      },
      addCol(t, o, n) {
        var _a2, _b, _c, _d, _e, _f;
        const l = Ve.findIndex((v) => v.label === t), s = Ke.findIndex((v) => v.label === o);
        if (l < 0) {
          console.log(`Axis "${t}" not found. Available: ${Ve.map((v) => v.label)}`);
          return;
        }
        if (s < 0) {
          console.log(`Axis "${o}" not found. Available: ${Ke.map((v) => v.label)}`);
          return;
        }
        const u = Ve[l].coord, a = Ke[s].coord, i = [
          ...e.nodes.val
        ], d = [
          ...((_a2 = e.elements) == null ? void 0 : _a2.val) || []
        ];
        (_b = e.elementInputs) == null ? void 0 : _b.val;
        const r = (v) => {
          const p = i.findIndex((b) => Math.abs(b[0] - u) < 1e-3 && Math.abs(b[1] - a) < 1e-3 && Math.abs(b[2] - v) < 1e-3);
          return p >= 0 ? p : (i.push([
            u,
            a,
            v
          ]), i.length - 1);
        }, c = n ? [
          Et.findIndex((v) => v.label === n)
        ] : Array.from({
          length: Et.length - 1
        }, (v, p) => p + 1), m = new Map(((_d = (_c = e.nodeInputs) == null ? void 0 : _c.val) == null ? void 0 : _d.supports) || []), w = r(Et[0].elev);
        m.has(w) || m.set(w, [
          true,
          true,
          true,
          true,
          true,
          true
        ]);
        let M = 0;
        for (const v of c) {
          if (v < 1 || v >= Et.length) continue;
          const p = r(Et[v - 1].elev), b = r(Et[v].elev);
          d.push([
            p,
            b
          ]), he.add(d.length - 1), Ce.set(d.length - 1, v - 1), M++;
        }
        return e.nodes.val = i, e.elements.val = d, e.nodeInputs.val = {
          ...e.nodeInputs.val,
          supports: m,
          loads: ((_f = (_e = e.nodeInputs) == null ? void 0 : _e.val) == null ? void 0 : _f.loads) || /* @__PURE__ */ new Map()
        }, console.log(`Added ${M} column(s) at ${t}-${o}${n ? ` story ${n}` : ""}`), M;
      },
      addBeam(t, o, n, l, s) {
        var _a2;
        const u = Ve.findIndex((C) => C.label === t), a = Ke.findIndex((C) => C.label === o), i = Ve.findIndex((C) => C.label === n), d = Ke.findIndex((C) => C.label === l), r = Et.findIndex((C) => C.label === s);
        if (u < 0 || a < 0 || i < 0 || d < 0) {
          console.log("Axis not found");
          return;
        }
        if (r < 1) {
          console.log(`Story "${s}" not found. Available: ${Et.filter((C) => C.label !== "Base").map((C) => C.label)}`);
          return;
        }
        const c = Ve[u].coord, m = Ke[a].coord, w = Ve[i].coord, M = Ke[d].coord, v = Et[r].elev, p = [
          ...e.nodes.val
        ], b = [
          ...((_a2 = e.elements) == null ? void 0 : _a2.val) || []
        ], I = (C, R, g) => {
          const f = p.findIndex((k) => Math.abs(k[0] - C) < 1e-3 && Math.abs(k[1] - R) < 1e-3 && Math.abs(k[2] - g) < 1e-3);
          return f >= 0 ? f : (p.push([
            C,
            R,
            g
          ]), p.length - 1);
        }, E = I(c, m, v), $ = I(w, M, v);
        return b.push([
          E,
          $
        ]), xe.add(b.length - 1), Ce.set(b.length - 1, r - 1), e.nodes.val = p, e.elements.val = b, console.log(`Added beam ${t}-${o} \u2192 ${n}-${l} at ${s}`), b.length - 1;
      },
      addBrace(t, o, n, l, s, u) {
        var _a2;
        const a = Ve.findIndex((f) => f.label === t), i = Ke.findIndex((f) => f.label === o), d = Et.findIndex((f) => f.label === n), r = Ve.findIndex((f) => f.label === l), c = Ke.findIndex((f) => f.label === s), m = Et.findIndex((f) => f.label === u);
        if (a < 0 || i < 0 || d < 0) {
          console.log(`Point 1 not found: ${t}-${o}@${n}`);
          return;
        }
        if (r < 0 || c < 0 || m < 0) {
          console.log(`Point 2 not found: ${l}-${s}@${u}`);
          return;
        }
        const w = Ve[a].coord, M = Ke[i].coord, v = Et[d].elev, p = Ve[r].coord, b = Ke[c].coord, I = Et[m].elev, E = [
          ...e.nodes.val
        ], $ = [
          ...((_a2 = e.elements) == null ? void 0 : _a2.val) || []
        ], C = (f, k, F) => {
          const q = E.findIndex((H) => Math.abs(H[0] - f) < 1e-3 && Math.abs(H[1] - k) < 1e-3 && Math.abs(H[2] - F) < 1e-3);
          return q >= 0 ? q : (E.push([
            f,
            k,
            F
          ]), E.length - 1);
        }, R = C(w, M, v), g = C(p, b, I);
        return $.push([
          R,
          g
        ]), Ce.set($.length - 1, Math.min(d, m)), e.nodes.val = E, e.elements.val = $, console.log(`Added brace ${t}-${o}@${n} \u2192 ${l}-${s}@${u}`), $.length - 1;
      },
      help() {
        return `=== CLI Commands ===
MODEL:
  cad.clear()                    New empty model
  cad.info()                     Model summary
  cad.addNode(x, y, z)          Add node (Y-up)
  cad.addFrame(i, j)            Add frame element
  cad.removeNode(i)             Remove node
  cad.removeFrame(i)            Remove element
  cad.listNodes()               List all nodes
  cad.listFrames()              List all elements

BOUNDARY:
  cad.addSupport(n)             Fixed support at node n
  cad.addSupport(n, [1,1,1,0,0,0])  Custom DOFs
  cad.removeSupport(n)          Remove support
  cad.addLoad(n, [fx,fy,fz,mx,my,mz])
  cad.removeLoad(n)
  cad.listSupports()            List supports
  cad.listLoads()               List loads

GENERATORS:
  cad.model3d()                 3D building (default 2x2, 3 floors)
  cad.model3d({bx:[5,6], bz:[4], h:[3.5,3], col:"40x40", viga:"25x30", fc:210})
  cad.use("Edificio")           Switch to parametric generator
  cad.frame([5,5], [3,3])       2D portal frame
  cad.building([5,5],[4],[3])   3D building (parametric)
  cad.galpon(12, 20, 6, 3)     Galpon/warehouse

REFERENCE GRID:
  cad.refgrid([5,5],[4,4],[3.5,3])  Construction grid lines
  cad.refgrid()                     Clear reference grid

SETTINGS & PARAMS:
  cad.settings()                List all settings
  cad.set("nodes", true)        Toggle setting on/off
  cad.set("deform")             Toggle setting
  cad.params()                  List all parameters
  cad.param("Vanos X", 3)       Set parameter value

CUSTOM PANELS (create your own Tweakpane):
  cad.panel("Grilla", {
    svx: { value: [2,3,4], label: "Vanos X" },
    svy: { value: [3.44,4,5], label: "Vanos Y" },
    sp:  { value: [3.5,3,3], label: "Alturas" },
    fc:  { value: 210, min:100, max:500, label: "f'c" },
    col: { value: "40x40", options:["30x30","40x40"], label: "Col" },
  }, (p) => { cad.refgrid(p.svx, p.svy, p.sp); })
  cad.removePanel("Grilla")     Remove custom panel

VIEW:
  cad.view("3d")                3D view
  cad.view("plan")              Plan view
  cad.view("ex")                X elevation
  cad.view("ey")                Y elevation
`;
      },
      model3d(t) {
        Re.clear();
        const o = (t == null ? void 0 : t.bx) || [
          5,
          5
        ], n = (t == null ? void 0 : t.bz) || [
          4,
          4
        ], l = (t == null ? void 0 : t.h) || [
          3.5,
          3,
          3
        ], s = (t == null ? void 0 : t.col) || "40x40", u = (t == null ? void 0 : t.viga) || "30x40", a = (t == null ? void 0 : t.fc) || 210, [i, d] = s.split("x").map((W) => parseFloat(W) / 100), [r, c] = u.split("x").map((W) => parseFloat(W) / 100), m = [
          0
        ];
        for (const W of o) m.push(m[m.length - 1] + W);
        const w = [
          0
        ];
        for (const W of n) w.push(w[w.length - 1] + W);
        const M = [
          0
        ];
        for (const W of l) M.push(M[M.length - 1] + W);
        const v = m.length, p = w.length, b = M.length, I = l.length, E = [], $ = {};
        for (let W = 0; W < b; W++) for (let le = 0; le < p; le++) for (let fe = 0; fe < v; fe++) $[`${fe},${W},${le}`] = E.length, E.push([
          m[fe],
          M[W],
          w[le]
        ]);
        const C = [], R = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Map();
        for (let W = 0; W < I; W++) for (let le = 0; le < p; le++) for (let fe = 0; fe < v; fe++) {
          const U = C.length;
          C.push([
            $[`${fe},${W},${le}`],
            $[`${fe},${W + 1},${le}`]
          ]), R.add(U), f.set(U, W);
        }
        for (let W = 1; W < b; W++) for (let le = 0; le < p; le++) for (let fe = 0; fe < v - 1; fe++) {
          const U = C.length;
          C.push([
            $[`${fe},${W},${le}`],
            $[`${fe + 1},${W},${le}`]
          ]), g.add(U), f.set(U, W - 1);
        }
        for (let W = 1; W < b; W++) for (let le = 0; le < v; le++) for (let fe = 0; fe < p - 1; fe++) {
          const U = C.length;
          C.push([
            $[`${le},${W},${fe}`],
            $[`${le},${W},${fe + 1}`]
          ]), g.add(U), f.set(U, W - 1);
        }
        const F = 15100 * Math.sqrt(a) * 10, q = F / (2 * (1 + 0.2)), H = i * d, h = i * d ** 3 / 12, S = d * i ** 3 / 12, x = i * d * (i ** 2 + d ** 2) / 12, z = r * c, O = r * c ** 3 / 12, B = c * r ** 3 / 12, G = r * c * (r ** 2 + c ** 2) / 12, j = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map();
        for (let W = 0; W < C.length; W++) j.set(W, F), D.set(W, q), R.has(W) ? (X.set(W, H), ee.set(W, h), de.set(W, S), me.set(W, x), _.set(W, {
          type: "rect",
          b: i,
          h: d,
          name: `COL${s}`
        })) : (X.set(W, z), ee.set(W, B), de.set(W, O), me.set(W, G), _.set(W, {
          type: "rect",
          b: r,
          h: c,
          name: `V${u}`
        }));
        const se = /* @__PURE__ */ new Map();
        for (let W = 0; W < p; W++) for (let le = 0; le < v; le++) se.set($[`${le},0,${W}`], [
          true,
          true,
          true,
          true,
          true,
          true
        ]);
        e.nodes.val = E, e.elements.val = C, e.nodeInputs.val = {
          supports: se,
          loads: /* @__PURE__ */ new Map()
        }, e.elementInputs.val = {
          elasticities: j,
          shearModuli: D,
          areas: X,
          momentsOfInertiaY: ee,
          momentsOfInertiaZ: de,
          torsionalConstants: me,
          sectionShapes: _
        }, he = R, xe = g, Ce = f, Ve = m.map((W, le) => ({
          label: String.fromCharCode(65 + le),
          coord: W
        })), Ke = w.map((W, le) => ({
          label: `${le + 1}`,
          coord: W
        })), po = M[M.length - 1], Vo(Ve.map((W) => W.coord), Ke.map((W) => W.coord), po, Ve.map((W) => W.label), Ke.map((W) => W.label));
        {
          const W = M.map((le, fe) => ({
            name: fe === 0 ? "Base" : `P${fe}`,
            height: fe > 0 ? le - M[fe - 1] : 0,
            elev: le
          }));
          In(W, m, w);
        }
        const Y = ve.querySelector("#cad3d-axis-buttons");
        if (Y) {
          Y.style.display = "flex";
          const W = Ve.map((fe) => fe.label), le = Ke.map((fe) => fe.label);
          Y.innerHTML = '<span style="font-size:10px;color:var(--cad-heading);margin-right:4px">Ejes:</span>';
          for (const fe of W) Y.innerHTML += `<button class="axis-btn" data-axis="x" data-label="${fe}">${fe}</button>`;
          Y.innerHTML += '<span style="margin:0 2px">|</span>';
          for (const fe of le) Y.innerHTML += `<button class="axis-btn" data-axis="y" data-label="${fe}">${fe}</button>`;
        }
        const ae = ve.querySelector("#cad3d-floor-buttons");
        if (ae) {
          ae.style.display = "flex", ae.innerHTML = '<span style="font-size:10px;color:var(--cad-heading);margin-right:4px">Planta:</span>';
          for (let W = 0; W < I; W++) ae.innerHTML += `<button class="floor-btn" data-floor="${W}">P${W + 1}</button>`;
        }
        return us(m, w, M), Ne(), console.log(`Model3D: ${E.length}n ${C.length}e | ${v}x${p} grid, ${I} floors | COL${s} V${u} f'c=${a}`), {
          nodes: E.length,
          elements: C.length,
          columns: R.size,
          beams: g.size
        };
      },
      clear() {
        e.nodes.val = [], e.elements.val = [], e.nodeInputs && (e.nodeInputs.val = {}), e.elementInputs && (e.elementInputs.val = {}), he = /* @__PURE__ */ new Set(), xe = /* @__PURE__ */ new Set(), Ce = /* @__PURE__ */ new Map(), Pe = /* @__PURE__ */ new Map(), Ve = [], Ke = [], po = 0, ms(), bs(), En();
        const t = ve.querySelector("#cad3d-axis-buttons");
        t && (t.style.display = "none", t.innerHTML = ""), console.log("Model cleared"), Ne();
      },
      frame(t, o, n = 0, l = 0) {
        Re.clear();
        const s = [];
        n > 0 && s.push(-n);
        let u = 0;
        s.push(u);
        for (const v of t) u += v, s.push(u);
        l > 0 && s.push(u + l);
        const a = [
          0
        ];
        let i = 0;
        for (const v of o) i += v, a.push(i);
        const d = (v) => n > 0 && v === 0 || l > 0 && v === s.length - 1, r = {}, c = [];
        for (let v = 0; v < a.length; v++) for (let p = 0; p < s.length; p++) v === 0 && d(p) || (r[`${p},${v}`] = c.length, c.push([
          s[p],
          0,
          a[v]
        ]));
        const m = [];
        he = /* @__PURE__ */ new Set(), xe = /* @__PURE__ */ new Set();
        for (let v = 0; v < a.length - 1; v++) for (let p = 0; p < s.length; p++) d(p) || (he.add(m.length), m.push([
          r[`${p},${v}`],
          r[`${p},${v + 1}`]
        ]));
        for (let v = 1; v < a.length; v++) for (let p = 0; p < s.length - 1; p++) xe.add(m.length), m.push([
          r[`${p},${v}`],
          r[`${p + 1},${v}`]
        ]);
        const w = /* @__PURE__ */ new Map(), M = kn();
        for (let v = 0; v < s.length; v++) {
          if (d(v)) continue;
          const p = `${v},0`;
          r[p] !== void 0 && w.set(r[p], [
            ...M
          ]);
        }
        return e.nodes.val = c, e.elements.val = m, e.nodeInputs && (e.nodeInputs.val = {
          supports: w
        }), Ve = [
          ...s
        ], Ke = [
          0
        ], po = a[a.length - 1] || 0, setTimeout(() => {
          st(), Vo(s, [
            0
          ]), Nn(), Hn();
        }, 50), Ne(), {
          nodes: c.length,
          elements: m.length
        };
      },
      building(t, o, n, l = 3, s = 0, u = 0, a = 0, i = 0, d = 1) {
        Re.clear();
        const r = [];
        s > 0 && r.push(-s), r.push(0);
        for (const f of t) r.push(r[r.length - 1] + f);
        u > 0 && r.push(r[r.length - 1] + u);
        const c = [];
        a > 0 && c.push(-a), c.push(0);
        for (const f of o) c.push(c[c.length - 1] + f);
        i > 0 && c.push(c[c.length - 1] + i);
        const m = [
          0
        ];
        for (const f of n) m.push(m[m.length - 1] + f);
        const w = (f) => s > 0 && f === 0 || u > 0 && f === r.length - 1, M = (f) => a > 0 && f === 0 || i > 0 && f === c.length - 1, v = (f, k) => w(f) || M(k), p = [], b = {};
        for (let f = 0; f < m.length; f++) for (let k = 0; k < c.length; k++) for (let F = 0; F < r.length; F++) f === 0 && v(F, k) || (b[`${F},${k},${f}`] = p.length, p.push([
          r[F],
          c[k],
          m[f]
        ]));
        const I = p.length, E = [];
        he = /* @__PURE__ */ new Set(), xe = /* @__PURE__ */ new Set(), Ce = /* @__PURE__ */ new Map();
        const $ = [];
        for (let f = 0; f < m.length - 1; f++) for (let k = 0; k < c.length; k++) for (let F = 0; F < r.length; F++) v(F, k) || $.push({
          el: [
            b[`${F},${k},${f}`],
            b[`${F},${k},${f + 1}`]
          ],
          floor: f
        });
        for (const { el: [f, k], floor: F } of $) {
          if (d <= 1) {
            he.add(E.length), Ce.set(E.length, F), E.push([
              f,
              k
            ]);
            continue;
          }
          const q = p[f], H = p[k];
          let h = f;
          for (let S = 1; S < d; S++) {
            const x = S / d, z = p.length;
            p.push([
              q[0] + (H[0] - q[0]) * x,
              q[1] + (H[1] - q[1]) * x,
              q[2] + (H[2] - q[2]) * x
            ]), he.add(E.length), Ce.set(E.length, F), E.push([
              h,
              z
            ]), h = z;
          }
          he.add(E.length), Ce.set(E.length, F), E.push([
            h,
            k
          ]);
        }
        Pe = /* @__PURE__ */ new Map();
        const C = [];
        for (let f = 1; f < m.length; f++) for (let k = 0; k < c.length; k++) for (let F = 0; F < r.length - 1; F++) C.push({
          el: [
            b[`${F},${k},${f}`],
            b[`${F + 1},${k},${f}`]
          ],
          floor: f - 1,
          dir: "x",
          bay: F
        });
        for (let f = 1; f < m.length; f++) for (let k = 0; k < r.length; k++) for (let F = 0; F < c.length - 1; F++) C.push({
          el: [
            b[`${k},${F},${f}`],
            b[`${k},${F + 1},${f}`]
          ],
          floor: f - 1,
          dir: "y",
          bay: F
        });
        for (const { el: [f, k], floor: F, dir: q, bay: H } of C) {
          const h = p[f], S = p[k];
          let x = f;
          for (let O = 1; O < l; O++) {
            const B = O / l, G = p.length;
            p.push([
              h[0] + (S[0] - h[0]) * B,
              h[1] + (S[1] - h[1]) * B,
              h[2] + (S[2] - h[2]) * B
            ]);
            const j = E.length;
            xe.add(j), Ce.set(j, F), Pe.set(j, {
              dir: q,
              bay: H
            }), E.push([
              x,
              G
            ]), x = G;
          }
          const z = E.length;
          xe.add(z), Ce.set(z, F), Pe.set(z, {
            dir: q,
            bay: H
          }), E.push([
            x,
            k
          ]);
        }
        if (io = /* @__PURE__ */ new Set(), Ze && Ye > 0) {
          const f = (k, F, q) => {
            for (let h = 0; h < p.length; h++) if (Math.abs(p[h][0] - k) < 1e-6 && Math.abs(p[h][1] - F) < 1e-6 && Math.abs(p[h][2] - q) < 1e-6) return h;
            const H = p.length;
            return p.push([
              k,
              F,
              q
            ]), H;
          };
          for (let k = 1; k < m.length; k++) if (xt === "x") for (let F = 0; F < c.length - 1; F++) {
            const q = c[F], H = c[F + 1];
            for (let h = 1; h <= Ye; h++) {
              const S = q + h / (Ye + 1) * (H - q), x = [];
              for (let z = 0; z < r.length; z++) x.push(f(r[z], S, m[k]));
              for (let z = 0; z < r.length - 1; z++) {
                const O = E.length;
                io.add(O), xe.add(O), Ce.set(O, k - 1), Pe.set(O, {
                  dir: "x",
                  bay: z
                }), E.push([
                  x[z],
                  x[z + 1]
                ]);
              }
            }
          }
          else for (let F = 0; F < r.length - 1; F++) {
            const q = r[F], H = r[F + 1];
            for (let h = 1; h <= Ye; h++) {
              const S = q + h / (Ye + 1) * (H - q), x = [];
              for (let z = 0; z < c.length; z++) x.push(f(S, c[z], m[k]));
              for (let z = 0; z < c.length - 1; z++) {
                const O = E.length;
                io.add(O), xe.add(O), Ce.set(O, k - 1), Pe.set(O, {
                  dir: "y",
                  bay: z
                }), E.push([
                  x[z],
                  x[z + 1]
                ]);
              }
            }
          }
        }
        const R = /* @__PURE__ */ new Map(), g = kn();
        for (let f = 0; f < c.length; f++) for (let k = 0; k < r.length; k++) v(k, f) || R.set(b[`${k},${f},0`], [
          ...g
        ]);
        Te = /* @__PURE__ */ new Set();
        for (const f of qe) {
          const k = m.length - 1, F = f.floors.includes(-1) ? Array.from({
            length: k
          }, (q, H) => H) : f.floors.filter((q) => q < k);
          for (const q of F) {
            let H, h, S, x;
            f.dir === "x" ? (H = f.bay, S = f.bay + 1, h = f.axisIdx, x = f.axisIdx) : (H = f.axisIdx, S = f.axisIdx, h = f.bay, x = f.bay + 1);
            const z = b[`${H},${h},${q}`], O = b[`${H},${h},${q + 1}`];
            let B, G;
            if (f.dir === "x" ? (B = b[`${S},${x},${q}`], G = b[`${S},${x},${q + 1}`]) : (B = b[`${S},${x},${q}`], G = b[`${S},${x},${q + 1}`]), z === void 0 || B === void 0 || O === void 0 || G === void 0) continue;
            const j = Xe, D = nt, X = p[z], ee = p[B], de = p[O], me = p[G], _ = [];
            for (let se = 0; se <= D; se++) {
              const Y = [], ae = se / D;
              for (let W = 0; W <= j; W++) {
                const le = W / j, fe = (1 - ae) * ((1 - le) * X[0] + le * ee[0]) + ae * ((1 - le) * de[0] + le * me[0]), U = (1 - ae) * ((1 - le) * X[1] + le * ee[1]) + ae * ((1 - le) * de[1] + le * me[1]), ue = (1 - ae) * ((1 - le) * X[2] + le * ee[2]) + ae * ((1 - le) * de[2] + le * me[2]);
                se === 0 && W === 0 ? Y.push(z) : se === 0 && W === j ? Y.push(B) : se === D && W === 0 ? Y.push(O) : se === D && W === j ? Y.push(G) : (Y.push(p.length), p.push([
                  fe,
                  U,
                  ue
                ]));
              }
              _.push(Y);
            }
            for (let se = 0; se < D; se++) for (let Y = 0; Y < j; Y++) {
              const ae = _[se][Y], W = _[se][Y + 1], le = _[se + 1][Y + 1], fe = _[se + 1][Y], U = E.length;
              Te.add(U), Ce.set(U, q), E.push([
                ae,
                W,
                le,
                fe
              ]);
            }
            if (q === 0) for (let se = 0; se <= j; se++) {
              const Y = _[0][se];
              Y >= I && R.set(Y, [
                ...g
              ]);
            }
          }
        }
        if (vo = /* @__PURE__ */ new Set(), qt) {
          const f = l, k = l, F = /* @__PURE__ */ new Map(), q = (H, h, S) => `${Math.round(H * 1e4)},${Math.round(h * 1e4)},${Math.round(S * 1e4)}`;
          for (let H = 0; H < p.length; H++) F.set(q(p[H][0], p[H][1], p[H][2]), H);
          for (let H = 1; H < m.length; H++) {
            const h = m[H];
            for (let S = 0; S < r.length - 1; S++) for (let x = 0; x < c.length - 1; x++) {
              const z = r[S], O = r[S + 1], B = c[x], G = c[x + 1], j = [];
              for (let D = 0; D <= k; D++) {
                const X = [];
                for (let ee = 0; ee <= f; ee++) {
                  const de = z + ee / f * (O - z), me = B + D / k * (G - B);
                  if (D === 0 && ee === 0) X.push(b[`${S},${x},${H}`]);
                  else if (D === 0 && ee === f) X.push(b[`${S + 1},${x},${H}`]);
                  else if (D === k && ee === 0) X.push(b[`${S},${x + 1},${H}`]);
                  else if (D === k && ee === f) X.push(b[`${S + 1},${x + 1},${H}`]);
                  else {
                    const _ = q(de, me, h), se = F.get(_);
                    if (se !== void 0) X.push(se);
                    else {
                      const Y = p.length;
                      p.push([
                        de,
                        me,
                        h
                      ]), F.set(_, Y), X.push(Y);
                    }
                  }
                }
                j.push(X);
              }
              for (let D = 0; D < k; D++) for (let X = 0; X < f; X++) {
                const ee = j[D][X], de = j[D][X + 1], me = j[D + 1][X + 1], _ = j[D + 1][X], se = E.length;
                vo.add(se), Ce.set(se, H - 1), E.push([
                  ee,
                  de,
                  me,
                  _
                ]);
              }
            }
          }
        }
        if (Fo && _t) {
          const f = _t === "all" || _t === "x" || _t === "perimeter", k = _t === "all" || _t === "y" || _t === "perimeter", F = m.length - 1;
          for (let q = 0; q < F; q++) {
            if (f) for (let H = 0; H < c.length; H++) {
              if (_t === "perimeter" && H !== 0 && H !== c.length - 1) continue;
              const h = Math.floor((r.length - 1) / 2);
              for (let S = 0; S < r.length - 1; S++) {
                if (_t === "perimeter" && S !== h || v(S, H) || v(S + 1, H)) continue;
                const x = b[`${S},${H},${q}`], z = b[`${S + 1},${H},${q + 1}`], O = b[`${S + 1},${H},${q}`], B = b[`${S},${H},${q + 1}`];
                x !== void 0 && z !== void 0 && (E.push([
                  x,
                  z
                ]), Ce.set(E.length - 1, q)), O !== void 0 && B !== void 0 && (E.push([
                  O,
                  B
                ]), Ce.set(E.length - 1, q));
              }
            }
            if (k) for (let H = 0; H < r.length; H++) {
              if (_t === "perimeter" && H !== 0 && H !== r.length - 1) continue;
              const h = Math.floor((c.length - 1) / 2);
              for (let S = 0; S < c.length - 1; S++) {
                if (_t === "perimeter" && S !== h || v(H, S) || v(H, S + 1)) continue;
                const x = b[`${H},${S},${q}`], z = b[`${H},${S + 1},${q + 1}`], O = b[`${H},${S + 1},${q}`], B = b[`${H},${S},${q + 1}`];
                x !== void 0 && z !== void 0 && (E.push([
                  x,
                  z
                ]), Ce.set(E.length - 1, q)), O !== void 0 && B !== void 0 && (E.push([
                  O,
                  B
                ]), Ce.set(E.length - 1, q));
              }
            }
          }
        }
        return e.nodes.val = p, e.elements.val = E, e.nodeInputs && (e.nodeInputs.val = {
          supports: R
        }), Ve = [
          ...r
        ], Ke = [
          ...c
        ], po = m[m.length - 1] || 0, setTimeout(() => {
          st(), Vo(r, c), Nn(), Hn();
        }, 50), Ne(), {
          nodes: p.length,
          elements: E.length,
          nJointNodes: I
        };
      },
      galpon(t = 12, o = 20, n = 6, l = 3, s = 8, u = 4) {
        Re.clear();
        const a = [], i = [], d = (M) => n + l * (1 - Math.pow(2 * M / t - 1, 2)), r = [], c = u + 1;
        for (let M = 0; M < c; M++) {
          const v = [], p = o / u * M;
          v.push(a.length), a.push([
            0,
            p,
            0
          ]), v.push(a.length), a.push([
            t,
            p,
            0
          ]), v.push(a.length), a.push([
            0,
            p,
            n
          ]);
          for (let b = 1; b < s; b++) {
            const I = t / s * b;
            v.push(a.length), a.push([
              I,
              p,
              d(I)
            ]);
          }
          v.push(a.length), a.push([
            t,
            p,
            n
          ]), r.push(v);
        }
        for (let M = 0; M < c; M++) {
          const v = r[M];
          i.push([
            v[0],
            v[2]
          ]), i.push([
            v[1],
            v[v.length - 1]
          ]);
          for (let p = 2; p < v.length - 1; p++) i.push([
            v[p],
            v[p + 1]
          ]);
        }
        for (let M = 0; M < u; M++) for (let v = 2; v < r[0].length; v++) i.push([
          r[M][v],
          r[M + 1][v]
        ]);
        for (let M = 0; M < u; M++) for (let v = 2; v < r[0].length - 1; v += 2) i.push([
          r[M][v],
          r[M + 1][v + 1]
        ]);
        const m = /* @__PURE__ */ new Map(), w = kn();
        for (let M = 0; M < c; M++) m.set(r[M][0], [
          ...w
        ]), m.set(r[M][1], [
          ...w
        ]);
        return e.nodes.val = a, e.elements.val = i, e.nodeInputs && (e.nodeInputs.val = {
          supports: m
        }), Ne(), {
          nodes: a.length,
          elements: i.length
        };
      },
      example(t) {
        var _a2, _b, _c, _d;
        if (!t) {
          console.log("Ejemplos: truss, beams, 3d, portico, edificio, galpon");
          return;
        }
        switch (t) {
          case "truss": {
            ke.colMat = 1, ke.vigaMat = 1, Re.clear(), He("truss"), vs();
            break;
          }
          case "beams": {
            ke.colMat = 0, ke.vigaMat = 0, ke.colShape = 0, Re.clear(), He("beams"), ys();
            break;
          }
          case "3d":
          case "3d-structure":
          case "torre": {
            ke.colMat = 1, ke.vigaMat = 1, Re.clear(), He("3d"), $s();
            break;
          }
          case "portico": {
            ke.colMat = 0, ke.vigaMat = 0, ke.colShape = 0, He("frame"), we();
            break;
          }
          case "edificio": {
            He("edificio"), ke.colMat = 0, ke.vigaMat = 0, ke.colShape = 0, qe = [], qt = false, Ze = false, Fo = false, we();
            break;
          }
          case "edif-acero":
          case "edificio-acero": {
            He("edificio"), ke.colMat = 1, ke.vigaMat = 1, ke.steelColType = 0, ke.steelVigaType = 0, qe = [], Ze = true, Ye = 2;
            const o = ce.reduce((l, s) => l + s, 0) / ce.length, n = re.reduce((l, s) => l + s, 0) / re.length;
            xt = o >= n ? "y" : "x", qt = true, Nt = 0.08, Fo = false, we();
            break;
          }
          case "edif-acero-diag":
          case "edificio-acero-diag": {
            He("edificio"), ke.colMat = 1, ke.vigaMat = 1, ke.steelColType = 0, ke.steelVigaType = 0, qe = [], Ze = true, Ye = 2;
            const o = ce.reduce((l, s) => l + s, 0) / ce.length, n = re.reduce((l, s) => l + s, 0) / re.length;
            xt = o >= n ? "y" : "x", qt = true, Nt = 0.08, Fo = true, _t = "perimeter", we();
            break;
          }
          case "edif-muros":
          case "edificio-muros": {
            He("edificio"), ke.colMat = 0, ke.vigaMat = 0, ke.colShape = 0, Ze = false;
            const o = Math.round(((_a2 = J.nVanosX) == null ? void 0 : _a2.val) ?? 2), n = Math.round(((_b = J.nVanosY) == null ? void 0 : _b.val) ?? 2);
            qe = [
              {
                dir: "x",
                bay: 0,
                axisIdx: 0,
                floors: [
                  -1
                ]
              },
              {
                dir: "x",
                bay: o - 1,
                axisIdx: n,
                floors: [
                  -1
                ]
              },
              {
                dir: "y",
                bay: 0,
                axisIdx: 0,
                floors: [
                  -1
                ]
              },
              {
                dir: "y",
                bay: n - 1,
                axisIdx: o,
                floors: [
                  -1
                ]
              }
            ], qt = true, Nt = 0.15, we();
            break;
          }
          case "edif-mixto":
          case "edificio-mixto": {
            He("edificio"), ke.colMat = 2, ke.vigaMat = 0, Ze = false;
            const o = Math.round(((_c = J.nVanosX) == null ? void 0 : _c.val) ?? 2), n = Math.round(((_d = J.nVanosY) == null ? void 0 : _d.val) ?? 2);
            qe = [
              {
                dir: "x",
                bay: 0,
                axisIdx: 0,
                floors: [
                  -1
                ]
              },
              {
                dir: "x",
                bay: o - 1,
                axisIdx: n,
                floors: [
                  -1
                ]
              }
            ], qt = true, Nt = 0.12, we();
            break;
          }
          case "mezanine":
          case "mezzanine": {
            He("edificio"), J.nPisos && (J.nPisos.val = 1), J.hPiso && (J.hPiso.val = 4.5), J.nVanosX && (J.nVanosX.val = 3), J.nVanosY && (J.nVanosY.val = 2), J.nSubViga && (J.nSubViga.val = 3), ce = [
              6,
              6,
              6
            ], re = [
              5,
              5
            ], ke.colMat = 1, ke.vigaMat = 1, ke.steelColType = 0, ke.steelVigaType = 0, qe = [], Ze = true, Ye = 2, xt = ce[0] >= re[0] ? "y" : "x", qt = true, Nt = 0.08, Co = 3, Ao = 3, we();
            break;
          }
          case "galpon": {
            He("galpon"), ke.colMat = 1, ke.vigaMat = 1, we();
            break;
          }
          case "barra": {
            He("barra"), we();
            break;
          }
          case "placa3q":
          case "plate3q":
          case "placa-3q": {
            Re.clear(), He("placa-3q"), ws();
            break;
          }
          case "placa":
          case "plate":
          case "plate-q4":
          case "placa-q4": {
            Re.clear(), He("placa-q4"), Ms();
            break;
          }
          case "losa-rect":
          case "rectangular-slab": {
            Re.clear(), He("losa-rect"), Ss();
            break;
          }
          case "losa-plana":
          case "flat-slab": {
            Re.clear(), He("losa-plana"), ks();
            break;
          }
          case "viga-alta":
          case "deep-beam": {
            Re.clear(), He("viga-alta"), Es();
            break;
          }
          case "muro-contencion":
          case "retaining-wall": {
            Re.clear(), He("muro-contencion"), Is();
            break;
          }
          case "zapata":
          case "footing": {
            Re.clear(), He("zapata"), zs();
            break;
          }
          case "placa-orificios":
          case "plate-holes":
          case "placa-base": {
            Re.clear(), He("placa-orificios"), Ls();
            break;
          }
          case "col-placa":
          case "columna-placa": {
            Re.clear(), He("col-placa"), Ts();
            break;
          }
          case "talud":
          case "slope": {
            Re.clear(), He("talud"), Cs();
            break;
          }
          case "eiffel":
          case "torre-eiffel": {
            Re.clear(), He("eiffel"), Gs();
            break;
          }
          case "arco":
          case "arco-gateway": {
            Re.clear(), He("arco"), Ys();
            break;
          }
          case "puente":
          case "puente-colgante": {
            Re.clear(), He("puente"), Vs();
            break;
          }
          case "twisted":
          case "torre-twisted":
          case "turning-torso": {
            Re.clear(), He("twisted"), Js();
            break;
          }
          case "burj":
          case "burj-khalifa": {
            Re.clear(), He("burj"), Xs();
            break;
          }
          case "opera":
          case "sydney-opera": {
            Re.clear(), He("opera"), Ks();
            break;
          }
          case "diagrid":
          case "gherkin": {
            Re.clear(), He("diagrid"), Us();
            break;
          }
          case "muro-q4":
          case "shear-wall":
          case "muro-cantilever": {
            Re.clear(), He("muro-q4"), Kn();
            break;
          }
          case "viga-q4":
          case "cantilever-beam":
          case "viga-cantilever": {
            Re.clear(), He("viga-q4"), Zs();
            break;
          }
          case "placa-xy":
          case "placa-cantilever":
          case "losa-cantilever": {
            Re.clear(), He("placa-xy"), Qs();
            break;
          }
          case "pergola": {
            Re.clear(), He("pergola"), ea();
            break;
          }
          default:
            console.error(`Ejemplo desconocido: "${t}".`);
        }
      },
      plateQ4(t = 10, o = 10, n = 16, l = 16, s = "simply-supported", u = -10, a = 0.2, i = 3e7, d = 0.3, r = 0) {
        console.log(`Plate Q4 [${[
          "Mindlin (gruesa)",
          "Kirchhoff (delgada)",
          "Membrane"
        ][r]}]: ${t}\xD7${o}, ${n}\xD7${l} elem, BC=${s}, q=${u}, t=${a}`);
        const m = performance.now(), w = Zn({
          E: i,
          nu: d,
          thickness: a,
          meshLx: t,
          meshLy: o,
          meshNx: n,
          meshNy: l,
          bcType: s,
          pressure: u,
          theoryType: r
        }), M = performance.now() - m;
        console.log(`Solved in ${M.toFixed(1)} ms`), console.log(`w_max = ${w.maxW.toExponential(6)}`), console.log(`w_center = ${(w.centerW ?? 0).toExponential(6)}`), console.log(`Mxx_max = ${w.maxMxx.toExponential(4)}, Myy_max = ${w.maxMyy.toExponential(4)}`), console.log(`Mxy_max = ${w.maxMxy.toExponential(4)}`), console.log(`Qx_max = ${w.maxQx.toExponential(4)}, Qy_max = ${w.maxQy.toExponential(4)}`);
        const v = w.nodeResults.map(($) => [
          $.x,
          $.y,
          0
        ]), p = w.elementResults.map(($) => [
          ...$.nodes
        ]);
        e.nodes.val = v, e.elements.val = p;
        const b = /* @__PURE__ */ new Map();
        w.nodeResults.forEach(($, C) => {
          b.set(C, [
            0,
            0,
            $.w,
            $.bx,
            $.by,
            0
          ]);
        }), e.deformOutputs && (e.deformOutputs.val = {
          deformations: b
        });
        const I = /* @__PURE__ */ new Map();
        w.nodeResults.forEach(($, C) => {
          ($.x < 1e-10 || $.x > t - 1e-10 || $.y < 1e-10 || $.y > o - 1e-10) && I.set(C, [
            true,
            true,
            true,
            true,
            true,
            true
          ]);
        });
        const E = /* @__PURE__ */ new Map();
        if (Math.abs(u) > 1e-30) {
          const $ = u * t * o / v.length;
          v.forEach((C, R) => {
            I.has(R) || E.set(R, [
              0,
              0,
              $,
              0,
              0,
              0
            ]);
          });
        }
        if (e.nodeInputs && (e.nodeInputs.val = {
          supports: I,
          loads: E
        }), e.elementInputs && (e.elementInputs.val = {}), e.analyzeOutputs) {
          const $ = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map();
          w.elementResults.forEach((g, f) => {
            $.set(f, [
              g.Mxx,
              g.Mxx,
              g.Mxx
            ]), C.set(f, [
              g.Myy,
              g.Myy,
              g.Myy
            ]), R.set(f, [
              g.Mxy,
              g.Mxy,
              g.Mxy
            ]);
          }), e.analyzeOutputs.val = {
            bendingXX: $,
            bendingYY: C,
            bendingXY: R
          };
        }
        return setTimeout(() => st(), 50), Ne(), w;
      },
      setParam(t, o) {
        J[t] ? (J[t].val = o, console.log(`${t} = ${o}`), Kt(), we()) : Je[t] ? (Je[t].val = o, console.log(`${t} = ${o}`), Kt(), we()) : console.error(`Par\xE1metro "${t}" no encontrado. Disponibles: ${Object.keys({
          ...J,
          ...Je
        }).join(", ")}`);
      },
      get(t) {
        if (!t) {
          const o = {};
          for (const l in J) o[l] = J[l].val;
          for (const l in Je) o[l] = Je[l].val;
          o.plateTheory = jt, o.supportType = Lt;
          const n = bn()[A];
          return n && n[Lt] && (o.supportLabel = n[Lt].label), console.table(o), o;
        }
        if (J[t]) return J[t].val;
        if (Je[t]) return Je[t].val;
        console.error(`Par\xE1metro "${t}" no encontrado.`);
      },
      setTheory(t) {
        typeof t == "string" && (t = {
          membrana: 1,
          membrane: 1,
          kirchhoff: 2,
          delgada: 2,
          thin: 2,
          mindlin: 3,
          gruesa: 3,
          thick: 3
        }[t.toLowerCase()] || 3), jt = t, console.log(`Teor\xEDa de placa: ${{
          1: "Membrana",
          2: "Kirchhoff (delgada)",
          3: "Mindlin (gruesa)"
        }[jt] || jt}`), A.includes("placa") && (Kt(), we());
      },
      setBc(t) {
        const o = bn()[A];
        if (!o || o.length === 0) {
          console.error("No support options for current generator");
          return;
        }
        if (typeof t == "string") {
          const n = o.findIndex((l) => l.label.toLowerCase().includes(t.toLowerCase()));
          t = n >= 0 ? n : 0;
        }
        Lt = t, Lt >= o.length && (Lt = 0), console.log(`Apoyo: ${o[Lt].label} \u2192 DOFs: [${o[Lt].dofs.map((n) => n ? "1" : "0").join(",")}]`), Kt(), we();
      },
      helpFull() {
        console.log(`
=== FEM Studio CLI ===
Nodos:    cad.addNode(x,y,z)  cad.removeNode(i)  cad.listNodes()
Elem:     cad.addFrame(n1,n2) cad.removeFrame(i)  cad.listFrames()
BC:       cad.addSupport(n)   cad.addLoad(n,[Fx,Fy,Fz,Mx,My,Mz])
Genera:   cad.frame(sv,sp)    cad.building(svX,svY,sp)
          cad.galpon(span,length,height,archRise,xDiv,yDiv)
Ejemplos: cad.example('truss') | 'beams' | '3d' | 'portico' | 'edificio' | 'galpon' | 'barra' | 'placa'
Placa Q4: cad.plateQ4(Lx, Ly, nx, ny, bcType, pressure, thickness, E, nu)
Params:   cad.setParam('Lx', 15)  cad.get()  cad.get('Lx')
Placa:    cad.setTheory('mindlin'|'kirchhoff'|'membrana')  cad.setBc('ss'|'empotrado')
Modal:    cad.modal()  cad.modal(true/false)  cad.setMode(0)  \u2014 an\xE1lisis modal + animaci\xF3n
Unidades: cad.units('SI'|'US')  \u2014 cambia sistema de unidades
Util:     cad.info()  cad.clear()  cad.help()  cad.helpFull()
      `);
      },
      units(t, o) {
        t && (y = t), o && (N = o), L = zo(y, N);
        const n = ve.querySelector("#cad3d-force-unit"), l = ve.querySelector("#cad3d-length-unit");
        return n && (n.textContent = y), l && (l.textContent = N), A && He(A), console.log(`Unidades: ${L.label} | E=${L.E.toExponential(3)} ${L.stress}`), L.id;
      },
      view(t) {
      },
      get mesh() {
        return e;
      }
    };
    function hs() {
      return Ml(L);
    }
    function xs() {
      return Sl(L);
    }
    let Je = {};
    function He(t) {
      var _a2, _b, _c, _d;
      A = t, ma.val = true, Lt = 0, co && _n(), J = {};
      const o = hs()[t];
      if (o) for (const l of o) J[l.key] = {
        val: l.val,
        min: l.min,
        max: l.max,
        step: l.step,
        label: l.label
      };
      Je = {};
      const n = xs()[t];
      if (n) for (const l of n) Je[l.key] = {
        val: l.val,
        min: l.min,
        max: l.max,
        step: l.step,
        label: l.label
      };
      if (t === "edificio") {
        const l = Math.round(((_a2 = J.nVanosX) == null ? void 0 : _a2.val) ?? 2), s = Math.round(((_b = J.nVanosY) == null ? void 0 : _b.val) ?? 2);
        ce = Array(l).fill(L.defaultSpan), re = Array(s).fill(L.defaultSpan * 0.8);
        const u = Math.round(((_c = J.nPisos) == null ? void 0 : _c.val) ?? 3), a = ((_d = J.hPiso) == null ? void 0 : _d.val) ?? 3;
        ie = Array(u).fill(a);
      }
      Kt(), setTimeout(() => {
        Ca(), we();
      }, 50);
    }
    function te(t) {
      var _a2, _b;
      return ((_a2 = J[t]) == null ? void 0 : _a2.val) ?? ((_b = Je[t]) == null ? void 0 : _b.val) ?? 0;
    }
    function we() {
      switch (A) {
        case "truss":
          vs();
          break;
        case "beams":
          ys();
          break;
        case "3d":
          $s();
          break;
        case "frame": {
          const o = Math.round(te("nVanos")), n = te("spanV"), l = Math.round(te("nPisos")), s = te("hPiso");
          Re.frame(Array(o).fill(n), Array(l).fill(s));
          break;
        }
        case "edificio": {
          const o = te("Lvix") || 0, n = te("Lvdx") || 0, l = te("Lviy") || 0, s = te("Lvdy") || 0, u = Math.max(1, Math.round(te("nSubViga") || 3)), a = Math.max(1, Math.round(te("nSubCol") || 1)), i = te("hPiso"), d = ie.length > 0 ? [
            ...ie
          ] : Array(Math.round(te("nPisos"))).fill(i);
          Re.building([
            ...ce
          ], [
            ...re
          ], d, u, o, n, l, s, a);
          break;
        }
        case "galpon":
          Re.galpon(te("span"), te("length"), te("height"), te("archRise"), Math.round(te("xDiv")), Math.round(te("yDiv")));
          break;
        case "barra":
          Ma();
          break;
        case "placa-3q":
          ws();
          break;
        case "placa-q4":
          Ms();
          break;
        case "losa-rect":
          Ss();
          break;
        case "losa-plana":
          ks();
          break;
        case "viga-alta":
          Es();
          break;
        case "muro-contencion":
          Is();
          break;
        case "zapata":
          zs();
          break;
        case "placa-orificios":
          Ls();
          break;
        case "col-placa":
          Ts();
          break;
        case "talud":
          Cs();
          break;
        case "eiffel":
          Gs();
          break;
        case "arco":
          Ys();
          break;
        case "puente":
          Vs();
          break;
        case "twisted":
          Js();
          break;
        case "burj":
          Xs();
          break;
        case "opera":
          Ks();
          break;
        case "diagrid":
          Us();
          break;
        case "muro-q4":
          Kn();
          break;
        case "viga-q4":
          Zs();
          break;
        case "placa-xy":
          Qs();
          break;
        case "pergola":
          ea();
          break;
      }
      if ((A === "frame" || A === "edificio" || A === "galpon") && e.nodeInputs) {
        const o = e.nodeInputs.val;
        o.supports && (e.nodeInputs.val = {
          supports: o.supports
        });
      }
      if (![
        "placa-q4",
        "placa-3q",
        "losa-rect",
        "losa-plana",
        "viga-alta",
        "muro-contencion",
        "zapata",
        "placa-orificios",
        "col-placa",
        "talud",
        "eiffel",
        "arco",
        "puente",
        "twisted",
        "burj",
        "opera",
        "diagrid",
        "muro-q4",
        "viga-q4",
        "placa-xy"
      ].includes(A)) {
        if (Q.size > 0 || K.size > 0 || ne) {
          const o = e.elements.val, n = o.filter((l, s) => !(Q.has(s) || K.has(s) || ne && !ge.has(s)));
          n.length !== o.length && (e.elements.val = n);
        }
        setTimeout(() => {
          fo(), Rn();
        }, 30);
      }
    }
    function vs() {
      const t = te("span"), o = Math.round(te("divisions")), n = te("height"), l = t / o, s = [], u = [];
      for (let c = 0; c <= o; c++) s.push([
        l * c,
        0,
        0
      ]);
      for (let c = 0; c <= o; c++) s.push([
        l * c,
        0,
        n
      ]);
      const a = o + 1;
      for (let c = 0; c < o; c++) u.push([
        c,
        c + 1
      ]);
      for (let c = 0; c < o; c++) u.push([
        a + c,
        a + c + 1
      ]);
      for (let c = 0; c <= o; c++) u.push([
        c,
        a + c
      ]);
      for (let c = 0; c < o; c++) c < o / 2 ? u.push([
        c,
        a + c + 1
      ]) : u.push([
        a + c,
        c + 1
      ]);
      const i = /* @__PURE__ */ new Map([
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
          Math.round(o),
          [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        ]
      ]), d = (te("CM") ?? 0) + (te("CV") ?? 0), r = /* @__PURE__ */ new Map();
      if (d !== 0) for (let c = 0; c <= o; c++) r.set(c, [
        0,
        0,
        d,
        0,
        0,
        0
      ]);
      e.nodes.val = s, e.elements.val = u, e.nodeInputs && (e.nodeInputs.val = {
        supports: i,
        loads: r
      }), Ne();
    }
    function ys() {
      const t = te("width"), o = te("height"), n = te("Ex") ?? 0, l = (te("CM") ?? 0) + (te("CV") ?? 0), s = Math.max(1, Math.round(te("nSub") || 4)), u = [
        [
          0,
          0,
          0
        ],
        [
          0,
          0,
          o
        ],
        [
          t,
          0,
          o
        ],
        [
          t,
          0,
          0
        ]
      ], a = [];
      a.push([
        0,
        1
      ], [
        2,
        3
      ]);
      const i = [
        0,
        0,
        o
      ], d = [
        t,
        0,
        o
      ];
      let r = 1;
      for (let m = 1; m < s; m++) {
        const w = m / s, M = u.length;
        u.push([
          i[0] + (d[0] - i[0]) * w,
          i[1] + (d[1] - i[1]) * w,
          i[2] + (d[2] - i[2]) * w
        ]), a.push([
          r,
          M
        ]), r = M;
      }
      a.push([
        r,
        2
      ]);
      const c = /* @__PURE__ */ new Map();
      if (n !== 0 && l === 0) c.set(2, [
        n,
        0,
        0,
        0,
        0,
        0
      ]);
      else if (l !== 0 && n === 0) for (let m = 1; m < u.length; m++) m === 0 || m === 3 || c.set(m, [
        0,
        0,
        l,
        0,
        0,
        0
      ]);
      else if (n !== 0 && l !== 0) for (let m = 1; m < u.length; m++) m === 0 || m === 3 || c.set(m, [
        m === 2 ? n : 0,
        0,
        l,
        0,
        0,
        0
      ]);
      e.nodes.val = u, e.elements.val = a, e.nodeInputs && (e.nodeInputs.val = {
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
            3,
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
        loads: c
      }), Ne();
    }
    function $s() {
      const t = te("dx"), o = te("dy"), n = te("dz"), l = Math.round(te("stories")), s = Math.max(1, Math.round(te("nSub") || 3)), u = [];
      for (let p = 0; p <= l; p++) u.push([
        0,
        0,
        n * p
      ], [
        t,
        0,
        n * p
      ], [
        t,
        o,
        n * p
      ], [
        0,
        o,
        n * p
      ]);
      const a = u.length, i = [
        ...u
      ], d = [];
      for (let p = 0; p < l; p++) for (let b = 0; b < 4; b++) d.push([
        p * 4 + b,
        (p + 1) * 4 + b
      ]);
      for (let p = 0; p < l; p++) {
        const b = p * 4;
        d.push([
          b,
          b + 5
        ], [
          b + 3,
          b + 6
        ], [
          b,
          b + 7
        ], [
          b + 1,
          b + 6
        ]);
      }
      const r = [];
      for (let p = 1; p <= l; p++) {
        const b = p * 4;
        r.push([
          b,
          b + 1
        ], [
          b + 1,
          b + 2
        ], [
          b + 2,
          b + 3
        ], [
          b + 3,
          b
        ], [
          b,
          b + 2
        ]);
      }
      for (const [p, b] of r) {
        const I = u[p], E = u[b];
        let $ = p;
        for (let C = 1; C < s; C++) {
          const R = C / s, g = i.length;
          i.push([
            I[0] + (E[0] - I[0]) * R,
            I[1] + (E[1] - I[1]) * R,
            I[2] + (E[2] - I[2]) * R
          ]), d.push([
            $,
            g
          ]), $ = g;
        }
        d.push([
          $,
          b
        ]);
      }
      const c = /* @__PURE__ */ new Map();
      for (let p = 0; p < 4; p++) c.set(p, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const m = te("Ex") ?? 0, w = (te("CM") ?? 0) + (te("CV") ?? 0), M = a - 2, v = /* @__PURE__ */ new Map();
      if (m !== 0 && w === 0) v.set(M, [
        m,
        0,
        0,
        0,
        0,
        0
      ]);
      else if (w !== 0 && m === 0) for (let p = 0; p < i.length; p++) c.has(p) || v.set(p, [
        0,
        0,
        w,
        0,
        0,
        0
      ]);
      else if (m !== 0 && w !== 0) for (let p = 0; p < i.length; p++) c.has(p) || v.set(p, [
        p === M ? m : 0,
        0,
        w,
        0,
        0,
        0
      ]);
      e.nodes.val = i, e.elements.val = d, e.nodeInputs && (e.nodeInputs.val = {
        supports: c,
        loads: v
      }), Ne();
    }
    function Ma() {
      const t = te("L"), o = Math.round(te("nElem")), n = te("F"), l = t / o, s = [], u = [];
      for (let d = 0; d <= o; d++) s.push([
        l * d,
        0,
        0
      ]);
      for (let d = 0; d < o; d++) u.push([
        d,
        d + 1
      ]);
      const a = /* @__PURE__ */ new Map([
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
        ]
      ]), i = /* @__PURE__ */ new Map([
        [
          o,
          [
            n,
            0,
            0,
            0,
            0,
            0
          ]
        ]
      ]);
      e.nodes.val = s, e.elements.val = u, e.nodeInputs && (e.nodeInputs.val = {
        supports: a,
        loads: i
      }), Ne();
    }
    function ws() {
      const t = te("Lx") || 15, o = te("Ly") || 10, n = te("meshSize") || 0.5, l = te("q") || -3, s = te("t") || 1, u = te("E") || 3e7, a = te("nu") || 0.3, i = u / (2 * (1 + a)), d = jt === 1 ? "Membrana" : jt === 2 ? "Kirchhoff" : "Mindlin", { nodes: r, elements: c, boundaryIndices: m } = lo({
        points: [
          [
            0,
            0,
            0
          ],
          [
            t,
            0,
            0
          ],
          [
            t,
            o,
            0
          ],
          [
            0,
            o,
            0
          ]
        ],
        polygon: [
          0,
          1,
          2,
          3
        ],
        maxMeshSize: n
      }), w = t * o, M = l * w / r.length, v = new Map(m.map((b) => [
        b,
        [
          true,
          true,
          true,
          true,
          true,
          true
        ]
      ])), p = new Map(r.map((b, I) => [
        I,
        [
          0,
          0,
          M,
          0,
          0,
          0
        ]
      ]));
      e.nodes.val = r, e.elements.val = c, e.nodeInputs && (e.nodeInputs.val = {
        supports: v,
        loads: p
      }), e.elementInputs && (e.elementInputs.val = {
        elasticities: new Map(c.map((b, I) => [
          I,
          u
        ])),
        elasticitiesOrthogonal: new Map(c.map((b, I) => [
          I,
          u
        ])),
        thicknesses: new Map(c.map((b, I) => [
          I,
          s
        ])),
        poissonsRatios: new Map(c.map((b, I) => [
          I,
          a
        ])),
        shearModuli: new Map(c.map((b, I) => [
          I,
          i
        ]))
      });
      try {
        const b = pt(r, c, e.nodeInputs.val, e.elementInputs.val);
        b && e.deformOutputs && (e.deformOutputs.val = b);
        const I = so(r, c, e.elementInputs.val, b);
        I && e.analyzeOutputs && (e.analyzeOutputs.val = I), console.log(`Plate 3Q [${d}]: ${r.length} nodes, ${c.length} triangles, t=${s}, E=${u}, \u03BD=${a}`);
      } catch (b) {
        console.warn("Plate 3Q analysis failed:", b.message);
      }
      setTimeout(() => st(), 50), Ne();
    }
    function Ms() {
      const t = te("Lx") || 10, o = te("Ly") || 10, n = Math.round(te("nx") || 16), l = Math.round(te("ny") || 16), s = te("t") || 0.2, u = te("q") || -10, a = te("E") || 3e7, i = te("nu") || 0.3, d = Lt === 1 ? "clamped" : "simply-supported", c = {
        1: 2,
        2: 1,
        3: 0
      }[jt] ?? 0;
      return Re.plateQ4(t, o, n, l, d, u, s, a, i, c);
    }
    function Ss() {
      const t = te("a") || 6, o = te("b") || 4, n = Math.round(te("nx") || 12), l = Math.round(te("ny") || 8), s = te("t") || 0.1, u = te("q") || -10, a = te("E") || 35e6, i = te("nu") || 0.15, r = {
        1: 2,
        2: 1,
        3: 0
      }[jt] ?? 0, c = Re.plateQ4(t, o, n, l, "simply-supported", u, s, a, i, r), m = a * s * s * s / (12 * (1 - i * i));
      let w = 0;
      for (let M = 1; M <= 19; M += 2) for (let v = 1; v <= 19; v += 2) {
        const p = M * M / (t * t) + v * v / (o * o);
        w += 1 / (M * v * p * p);
      }
      if (w *= 16 * Math.abs(u) / (Math.PI ** 6 * m), console.log(`\u{1F4D0} Navier anal\xEDtico w_center = ${w.toExponential(6)}`), c) {
        const M = Math.abs((Math.abs(c.centerW || 0) - w) / w * 100);
        console.log(`   WASM w_center = ${(c.centerW || 0).toExponential(6)}, error = ${M.toFixed(2)}%`);
      }
      return c;
    }
    function ks() {
      const t = te("t") || 0.2, o = te("q") || -10, n = te("E") || 35e6, l = te("nu") || 0.2, s = te("meshSize") || 0.6, u = [
        3.6,
        4.2,
        4.2,
        3.6
      ], a = [
        3,
        3.6,
        3
      ], i = u.reduce((h, S) => h + S, 0), d = a.reduce((h, S) => h + S, 0), r = [
        0
      ];
      for (const h of u) r.push(r[r.length - 1] + h);
      const c = [
        0
      ];
      for (const h of a) c.push(c[c.length - 1] + h);
      const m = Math.max(2, Math.round(i / s)), w = Math.max(2, Math.round(d / s)), M = i / m, v = d / w, p = [];
      for (let h = 0; h <= w; h++) for (let S = 0; S <= m; S++) p.push([
        S * M,
        h * v
      ]);
      const b = [], I = /* @__PURE__ */ new Set();
      for (const h of r) for (const S of c) {
        let x = 1 / 0, z = 0;
        for (let O = 0; O < p.length; O++) {
          const B = Math.hypot(p[O][0] - h, p[O][1] - S);
          B < x && (x = B, z = O);
        }
        I.has(z) || (I.add(z), b.push({
          node: z,
          dof: 0,
          k: 1e15
        }));
      }
      const $ = {
        1: 2,
        2: 1,
        3: 0
      }[jt] ?? 1;
      console.log(`Losa Plana Q4 [${[
        "Mindlin",
        "Kirchhoff",
        "Membrane"
      ][$]}]: ${i}\xD7${d}m, ${m}\xD7${w} elem, ${I.size} columnas`);
      const C = performance.now(), R = Zn({
        E: n,
        nu: l,
        thickness: t,
        meshLx: i,
        meshLy: d,
        meshNx: m,
        meshNy: w,
        bcType: "none",
        pressure: o,
        theoryType: $,
        springs: b
      }), g = performance.now() - C;
      console.log(`Solved in ${g.toFixed(1)} ms, w_max = ${R.maxW.toExponential(4)}`);
      const f = R.nodeResults.map((h) => [
        h.x,
        h.y,
        0
      ]), k = R.elementResults.map((h) => [
        ...h.nodes
      ]);
      e.nodes.val = f, e.elements.val = k;
      const F = /* @__PURE__ */ new Map();
      R.nodeResults.forEach((h, S) => {
        F.set(S, [
          0,
          0,
          h.w,
          h.bx,
          h.by,
          0
        ]);
      }), e.deformOutputs && (e.deformOutputs.val = {
        deformations: F
      });
      const q = /* @__PURE__ */ new Map();
      for (const h of I) q.set(h, [
        true,
        true,
        true,
        false,
        false,
        false
      ]);
      const H = /* @__PURE__ */ new Map();
      if (Math.abs(o) > 1e-30) {
        const h = o * i * d / f.length;
        f.forEach((S, x) => {
          q.has(x) || H.set(x, [
            0,
            0,
            h,
            0,
            0,
            0
          ]);
        });
      }
      if (e.nodeInputs && (e.nodeInputs.val = {
        supports: q,
        loads: H
      }), e.elementInputs && (e.elementInputs.val = {}), e.analyzeOutputs) {
        const h = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map();
        R.elementResults.forEach((z, O) => {
          h.set(O, [
            z.Mxx,
            z.Mxx,
            z.Mxx
          ]), S.set(O, [
            z.Myy,
            z.Myy,
            z.Myy
          ]), x.set(O, [
            z.Mxy,
            z.Mxy,
            z.Mxy
          ]);
        }), e.analyzeOutputs.val = {
          bendingXX: h,
          bendingYY: S,
          bendingXY: x
        };
      }
      setTimeout(() => st(), 50), Ne();
    }
    function Es() {
      const t = te("L") || 4, o = te("H") || 2, n = te("t") || 0.1, l = te("E") || 2e7, s = te("nu") || 0.2, u = l / (2 * (1 + s)), a = te("q") || -100, i = te("b") || 0.8, d = te("meshSize") || 0.2, { nodes: r, elements: c, boundaryIndices: m } = lo({
        points: [
          [
            0,
            0,
            0
          ],
          [
            t,
            0,
            0
          ],
          [
            t,
            o,
            0
          ],
          [
            0,
            o,
            0
          ]
        ],
        polygon: [
          0,
          1,
          2,
          3
        ],
        maxMeshSize: d
      }), w = r, M = 0.4, v = /* @__PURE__ */ new Map();
      for (let g = 0; g < w.length; g++) {
        const f = w[g][0], k = w[g][1];
        Math.abs(k) < 1e-6 && (f <= M + 1e-6 || f >= t - M - 1e-6) && v.set(g, [
          true,
          true,
          true,
          true,
          true,
          true
        ]);
      }
      const p = (t - i) / 2, b = p + i, I = [];
      for (let g = 0; g < w.length; g++) if (Math.abs(w[g][1] - o) < 1e-6) {
        const f = w[g][0];
        f >= p - 1e-6 && f <= b + 1e-6 && I.push(g);
      }
      const E = a * i / Math.max(I.length, 1), $ = /* @__PURE__ */ new Map();
      for (const g of I) $.set(g, [
        0,
        E,
        0,
        0,
        0,
        0
      ]);
      const C = {
        elasticities: new Map(c.map((g, f) => [
          f,
          l
        ])),
        elasticitiesOrthogonal: new Map(c.map((g, f) => [
          f,
          l
        ])),
        thicknesses: new Map(c.map((g, f) => [
          f,
          n
        ])),
        poissonsRatios: new Map(c.map((g, f) => [
          f,
          s
        ])),
        shearModuli: new Map(c.map((g, f) => [
          f,
          u
        ]))
      }, R = {
        supports: v,
        loads: $
      };
      try {
        const g = pt(w, c, R, C), f = so(w, c, C, g), k = w.map((q) => [
          q[0],
          0,
          q[1]
        ]);
        if (e.nodes.val = k, e.elements.val = c, g && g.deformations) {
          const q = /* @__PURE__ */ new Map();
          g.deformations.forEach((H, h) => {
            q.set(h, [
              H[0],
              H[2],
              H[1],
              H[3],
              H[5],
              H[4]
            ]);
          }), e.deformOutputs && (e.deformOutputs.val = {
            deformations: q
          });
        }
        if (e.nodeInputs) {
          const q = /* @__PURE__ */ new Map();
          v.forEach((h, S) => q.set(S, h));
          const H = /* @__PURE__ */ new Map();
          $.forEach((h, S) => H.set(S, [
            h[0],
            h[2],
            h[1],
            h[3],
            h[5],
            h[4]
          ])), e.nodeInputs && (e.nodeInputs.val = {
            supports: q,
            loads: H
          });
        }
        e.elementInputs && (e.elementInputs.val = {}), e.analyzeOutputs && (e.analyzeOutputs.val = {});
        let F = 0;
        g && g.deformations && g.deformations.forEach((q) => {
          const H = Math.sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2]);
          F = Math.max(F, H);
        }), console.log(`Viga Alta: ${w.length} nodos, ${c.length} triangulos`), console.log(`  L=${t}, H=${o}, t=${n}, E=${l}, nu=${s}`), console.log(`  Carga: q=${a} kN/m sobre ${i}m central`), console.log(`  max|u| = ${F.toExponential(4)}`);
      } catch (g) {
        console.warn("Viga Alta analysis failed:", g.message);
      }
      setTimeout(() => st(), 50), Ne();
    }
    function Is() {
      const t = te("H") || 4, o = te("B") || 3, n = te("tw") || 0.3, l = te("tb") || 0.4, s = te("meshSize") || 0.2, u = te("E") || 25e6, a = te("nu") || 0.2, i = u / (2 * (1 + a)), d = te("gamma") || 18, r = te("Ka") || 0.33, c = te("Es") || 5e4, m = te("nus") || 0.3, w = c / (2 * (1 + m)), M = te("kn") || 1e6, v = te("ks") || 1e4, p = te("gammaW") || 9.81, b = te("Hw") || 3.5, I = te("qs") || 0, E = Lt, $ = o * 0.3, C = o * 0.7, R = [
        [
          -$,
          0,
          0
        ],
        [
          C,
          0,
          0
        ],
        [
          C,
          l,
          0
        ],
        [
          n,
          l,
          0
        ],
        [
          n,
          l + t,
          0
        ],
        [
          0,
          l + t,
          0
        ],
        [
          0,
          l,
          0
        ],
        [
          -$,
          l,
          0
        ]
      ];
      let g = [], f = [], k = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), q;
      if (E === 0) {
        const S = lo({
          points: R,
          polygon: [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7
          ],
          maxMeshSize: s
        });
        g = S.nodes, f = S.elements;
        for (let z = 0; z < g.length; z++) Math.abs(g[z][1]) < 1e-6 && k.set(z, [
          true,
          true,
          true,
          true,
          true,
          true
        ]);
        const x = [];
        for (let z = 0; z < g.length; z++) {
          const O = g[z][0], B = g[z][1];
          Math.abs(O - n) < s * 0.6 && B >= l - 1e-6 && x.push({
            idx: z,
            y: B
          });
        }
        x.sort((z, O) => z.y - O.y);
        for (let z = 0; z < x.length; z++) {
          const { idx: O, y: B } = x[z], G = l + t - B, j = r * d * G + r * I;
          let D = s;
          z > 0 && z < x.length - 1 ? D = (x[z + 1].y - x[z - 1].y) / 2 : z === 0 && x.length > 1 ? D = (x[1].y - x[0].y) / 2 : z === x.length - 1 && x.length > 1 && (D = (x[z].y - x[z - 1].y) / 2);
          const X = j * D;
          Math.abs(X) > 1e-10 && F.set(O, [
            X,
            0,
            0,
            0,
            0,
            0
          ]);
        }
        q = {
          elasticities: new Map(f.map((z, O) => [
            O,
            u
          ])),
          elasticitiesOrthogonal: new Map(f.map((z, O) => [
            O,
            u
          ])),
          thicknesses: new Map(f.map((z, O) => [
            O,
            n
          ])),
          poissonsRatios: new Map(f.map((z, O) => [
            O,
            a
          ])),
          shearModuli: new Map(f.map((z, O) => [
            O,
            i
          ]))
        };
      } else if (E === 1 || E === 2) {
        const S = C, x = l + t;
        if (E === 2) {
          const z = [
            [
              -$,
              0,
              0
            ],
            [
              S,
              0,
              0
            ],
            [
              S,
              x,
              0
            ],
            [
              n,
              x,
              0
            ],
            [
              0,
              x,
              0
            ],
            [
              0,
              l,
              0
            ],
            [
              -$,
              l,
              0
            ]
          ], O = Math.max(3, Math.ceil((x - l) / s)), B = [];
          for (let U = 0; U <= O; U++) B.push([
            n,
            l + U * (x - l) / O,
            0
          ]);
          const G = lo({
            points: [
              ...z,
              ...B
            ],
            polygon: [
              0,
              1,
              2,
              3,
              4,
              5,
              6
            ],
            maxMeshSize: s
          });
          g = G.nodes, f = G.elements;
          const j = s * 0.4, D = [];
          for (let U = 0; U < g.length; U++) {
            const ue = g[U][0], ze = g[U][1];
            Math.abs(ue - n) < j && ze >= l - j && D.push(U);
          }
          D.sort((U, ue) => g[U][1] - g[ue][1]);
          const X = [
            D[0]
          ];
          for (let U = 1; U < D.length; U++) {
            const ue = g[D[U]][1] - g[X[X.length - 1]][1];
            Math.abs(ue) > s * 0.05 && X.push(D[U]);
          }
          D.length = 0, D.push(...X);
          const ee = /* @__PURE__ */ new Map();
          for (const U of D) {
            const ue = g.length;
            g.push([
              g[U][0],
              g[U][1],
              g[U][2]
            ]), ee.set(U, ue);
          }
          const de = f.length, me = [];
          for (let U = 0; U < de; U++) {
            const ue = f[U], ze = (g[ue[0]][0] + g[ue[1]][0] + g[ue[2]][0]) / 3, Be = (g[ue[0]][1] + g[ue[1]][1] + g[ue[2]][1]) / 3, je = ze >= -$ && ze <= C && Be >= 0 && Be <= l, tt = ze >= 0 && ze <= n && Be >= l && Be <= l + t, lt = je || tt;
            if (me.push(!lt), !lt) for (let ot = 0; ot < ue.length; ot++) {
              const ut = ee.get(ue[ot]);
              ut !== void 0 && (ue[ot] = ut);
            }
          }
          const _ = f.length;
          for (let U = 0; U < D.length - 1; U++) {
            const ue = D[U], ze = D[U + 1], Be = ee.get(ue), je = ee.get(ze);
            f.push([
              ze,
              ue,
              Be,
              je
            ]);
          }
          const se = f.length - _, Y = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), fe = /* @__PURE__ */ new Map();
          for (let U = 0; U < de; U++) me[U] ? (Y.set(U, c), ae.set(U, c), le.set(U, m), fe.set(U, w), W.set(U, 1)) : (Y.set(U, u), ae.set(U, u), le.set(U, a), fe.set(U, i), W.set(U, 1));
          for (let U = _; U < f.length; U++) Y.set(U, M), ae.set(U, 0), le.set(U, 0), fe.set(U, v), W.set(U, 0);
          q = {
            elasticities: Y,
            elasticitiesOrthogonal: ae,
            thicknesses: W,
            poissonsRatios: le,
            shearModuli: fe
          };
          for (let U = 0; U < g.length; U++) {
            const ue = g[U][0], ze = g[U][1];
            Math.abs(ze) < 1e-6 ? k.set(U, [
              true,
              true,
              true,
              true,
              true,
              true
            ]) : Math.abs(ue - S) < s * 0.1 && k.set(U, [
              true,
              false,
              true,
              true,
              true,
              true
            ]);
          }
          for (let U = 0; U < de; U++) {
            if (!me[U]) continue;
            const ue = f[U], ze = g[ue[0]], Be = g[ue[1]], je = g[ue[2]], tt = Math.abs((Be[0] - ze[0]) * (je[1] - ze[1]) - (je[0] - ze[0]) * (Be[1] - ze[1])) / 2, lt = -d * tt / 3;
            for (const ot of ue) {
              const ut = F.get(ot) || [
                0,
                0,
                0,
                0,
                0,
                0
              ];
              ut[1] += lt, F.set(ot, ut);
            }
          }
          if (I > 0) {
            const U = [];
            for (let ue = 0; ue < g.length; ue++) {
              const ze = g[ue][0], Be = g[ue][1];
              Math.abs(Be - x) < s * 0.1 && ze > n - 1e-6 && U.push({
                idx: ue,
                x: ze
              });
            }
            U.sort((ue, ze) => ue.x - ze.x);
            for (let ue = 0; ue < U.length; ue++) {
              let ze = s;
              ue > 0 && ue < U.length - 1 ? ze = (U[ue + 1].x - U[ue - 1].x) / 2 : ue === 0 && U.length > 1 ? ze = (U[1].x - U[0].x) / 2 : ue === U.length - 1 && U.length > 1 && (ze = (U[ue].x - U[ue - 1].x) / 2);
              const Be = -I * ze, je = F.get(U[ue].idx) || [
                0,
                0,
                0,
                0,
                0,
                0
              ];
              je[1] += Be, F.set(U[ue].idx, je);
            }
          }
          console.log(`  Interfaz Goodman: ${D.length} nodos interfaz, ${se} elem interfaz, kn=${M}, ks=${v}`);
        } else {
          const z = [
            [
              -$,
              0,
              0
            ],
            [
              S,
              0,
              0
            ],
            [
              S,
              x,
              0
            ],
            [
              n,
              x,
              0
            ],
            [
              0,
              x,
              0
            ],
            [
              0,
              l,
              0
            ],
            [
              -$,
              l,
              0
            ]
          ], O = [
            [
              n,
              l,
              0
            ]
          ], B = lo({
            points: [
              ...z,
              ...O
            ],
            polygon: [
              0,
              1,
              2,
              3,
              4,
              5,
              6
            ],
            maxMeshSize: s
          });
          g = B.nodes, f = B.elements;
          const G = (_) => {
            const se = (g[_[0]][0] + g[_[1]][0] + g[_[2]][0]) / 3, Y = (g[_[0]][1] + g[_[1]][1] + g[_[2]][1]) / 3, ae = se >= -$ && se <= C && Y >= 0 && Y <= l, W = se >= 0 && se <= n && Y >= l && Y <= l + t;
            return ae || W;
          }, j = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map(), me = [];
          for (let _ = 0; _ < f.length; _++) {
            const se = G(f[_]);
            me.push(!se), se ? (j.set(_, u), D.set(_, u), ee.set(_, a), de.set(_, i), X.set(_, 1)) : (j.set(_, c), D.set(_, c), ee.set(_, m), de.set(_, w), X.set(_, 1));
          }
          q = {
            elasticities: j,
            elasticitiesOrthogonal: D,
            thicknesses: X,
            poissonsRatios: ee,
            shearModuli: de
          };
          for (let _ = 0; _ < g.length; _++) {
            const se = g[_][0], Y = g[_][1];
            Math.abs(Y) < 1e-6 ? k.set(_, [
              true,
              true,
              true,
              true,
              true,
              true
            ]) : Math.abs(se - S) < s * 0.1 && k.set(_, [
              true,
              false,
              true,
              true,
              true,
              true
            ]);
          }
          for (let _ = 0; _ < f.length; _++) {
            if (!me[_]) continue;
            const se = f[_], Y = g[se[0]], ae = g[se[1]], W = g[se[2]], le = Math.abs((ae[0] - Y[0]) * (W[1] - Y[1]) - (W[0] - Y[0]) * (ae[1] - Y[1])) / 2, fe = -d * le / 3;
            for (const U of se) {
              const ue = F.get(U) || [
                0,
                0,
                0,
                0,
                0,
                0
              ];
              ue[1] += fe, F.set(U, ue);
            }
          }
          if (I > 0) {
            const _ = [];
            for (let se = 0; se < g.length; se++) {
              const Y = g[se][0], ae = g[se][1];
              Math.abs(ae - x) < s * 0.1 && Y > n - 1e-6 && _.push({
                idx: se,
                x: Y
              });
            }
            _.sort((se, Y) => se.x - Y.x);
            for (let se = 0; se < _.length; se++) {
              let Y = s;
              se > 0 && se < _.length - 1 ? Y = (_[se + 1].x - _[se - 1].x) / 2 : se === 0 && _.length > 1 ? Y = (_[1].x - _[0].x) / 2 : se === _.length - 1 && _.length > 1 && (Y = (_[se].x - _[se - 1].x) / 2);
              const ae = -I * Y, W = F.get(_[se].idx) || [
                0,
                0,
                0,
                0,
                0,
                0
              ];
              W[1] += ae, F.set(_[se].idx, W);
            }
          }
        }
      }
      if (E === 3) {
        const S = lo({
          points: R,
          polygon: [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7
          ],
          maxMeshSize: s
        });
        g = S.nodes, f = S.elements;
        for (let G = 0; G < g.length; G++) Math.abs(g[G][1]) < 1e-6 && k.set(G, [
          true,
          true,
          true,
          true,
          true,
          true
        ]);
        const x = l + t, z = Math.min(b, t), O = x - z, B = [];
        for (let G = 0; G < g.length; G++) {
          const j = g[G][0], D = g[G][1];
          Math.abs(j - n) < s * 0.6 && D >= l - 1e-6 && B.push({
            idx: G,
            y: D
          });
        }
        B.sort((G, j) => G.y - j.y);
        for (let G = 0; G < B.length; G++) {
          const { idx: j, y: D } = B[G], X = Math.max(0, x - D);
          if (X <= 0 || D < O - 1e-6) continue;
          const ee = Math.min(X, z), de = p * ee;
          let me = s;
          G > 0 && G < B.length - 1 ? me = (B[G + 1].y - B[G - 1].y) / 2 : G === 0 && B.length > 1 ? me = (B[1].y - B[0].y) / 2 : G === B.length - 1 && B.length > 1 && (me = (B[G].y - B[G - 1].y) / 2);
          const _ = de * me;
          Math.abs(_) > 1e-10 && F.set(j, [
            _,
            0,
            0,
            0,
            0,
            0
          ]);
        }
        q = {
          elasticities: new Map(f.map((G, j) => [
            j,
            u
          ])),
          elasticitiesOrthogonal: new Map(f.map((G, j) => [
            j,
            u
          ])),
          thicknesses: new Map(f.map((G, j) => [
            j,
            n
          ])),
          poissonsRatios: new Map(f.map((G, j) => [
            j,
            a
          ])),
          shearModuli: new Map(f.map((G, j) => [
            j,
            i
          ]))
        };
      }
      const H = {
        supports: k,
        loads: F
      }, h = [
        "Rankine (Ka)",
        "Suelo continuo",
        "Interfaz",
        "Presion agua"
      ];
      try {
        const S = pt(g, f, H, q), x = f.filter((X) => X.length === 3), z = {};
        for (const X of Object.keys(q)) {
          const ee = q[X];
          if (ee && ee instanceof Map) {
            const de = /* @__PURE__ */ new Map();
            let me = 0;
            for (let _ = 0; _ < f.length; _++) f[_].length === 3 && (ee.has(_) && de.set(me, ee.get(_)), me++);
            z[X] = de;
          }
        }
        const O = so(g, x, z, S), B = g.map((X) => [
          X[0],
          0,
          X[1]
        ]);
        if (e.nodes.val = B, e.elements.val = x, S && S.deformations) {
          const X = /* @__PURE__ */ new Map();
          S.deformations.forEach((ee, de) => {
            X.set(de, [
              ee[0],
              ee[2],
              ee[1],
              ee[3],
              ee[5],
              ee[4]
            ]);
          }), e.deformOutputs && (e.deformOutputs.val = {
            deformations: X
          });
        }
        const G = /* @__PURE__ */ new Map();
        k.forEach((X, ee) => G.set(ee, X));
        const j = /* @__PURE__ */ new Map();
        F.forEach((X, ee) => j.set(ee, [
          X[0],
          X[2],
          X[1],
          X[3],
          X[5],
          X[4]
        ])), e.nodeInputs && (e.nodeInputs.val = {
          supports: G,
          loads: j
        }), e.elementInputs && (e.elementInputs.val = {}), e.analyzeOutputs && (e.analyzeOutputs.val = {});
        let D = 0;
        S && S.deformations && S.deformations.forEach((X) => {
          const ee = Math.sqrt(X[0] * X[0] + X[1] * X[1] + X[2] * X[2]);
          D = Math.max(D, ee);
        }), console.log(`Muro Contencion [${h[E]}]: ${g.length} nodos, ${f.length} triangulos`), console.log(`  H=${t}, B=${o}, tw=${n}, tb=${l}, Ka=${r}, gamma=${d}, qs=${I}`), E === 1 && console.log(`  Es=${c}, nus=${m}`), E === 2 && console.log(`  Es=${c}, nus=${m}, kn=${M}, ks=${v}`), E === 3 && console.log(`  gammaW=${p}, Hw=${b}`), console.log(`  max|u| = ${D.toExponential(4)}`);
      } catch (S) {
        console.warn("Muro Contencion failed:", S.message);
      }
      setTimeout(() => st(), 50), Ne();
    }
    function zs() {
      const t = te("Lx") || 2, o = te("Ly") || 2, n = te("t") || 0.5, l = te("colA") || 0.4, s = te("colH") || 1.5, u = Math.round(te("nx") || 8), a = Math.round(te("ny") || 8), i = te("E") || 25e6, d = te("nu") || 0.2, r = te("P") || -500, c = te("Mx") || 0, m = te("My") || 0, w = te("ks") || 2e4, M = t / u, v = o / a, p = t / 2, b = o / 2, I = l / 2, E = [];
      for (let k = 0; k <= a; k++) for (let F = 0; F <= u; F++) {
        const q = k * (u + 1) + F;
        let H = M, h = v;
        (F === 0 || F === u) && (H = M / 2), (k === 0 || k === a) && (h = v / 2), E.push({
          node: q,
          dof: 0,
          k: w * H * h
        });
      }
      let $ = 0;
      for (let k = 0; k <= a; k++) for (let F = 0; F <= u; F++) Math.abs(F * M - p) <= I + 1e-6 && Math.abs(k * v - b) <= I + 1e-6 && $++;
      const C = r / Math.max($, 1), R = [];
      for (let k = 0; k <= a; k++) for (let F = 0; F <= u; F++) {
        const q = F * M, H = k * v;
        Math.abs(q - p) <= I + 1e-6 && Math.abs(H - b) <= I + 1e-6 && R.push({
          node: k * (u + 1) + F,
          dof: 0,
          value: C
        });
      }
      if (Math.abs(c) > 1e-6) {
        const k = I > 1e-6 ? I : v, F = c / k;
        for (let q = 0; q <= a; q++) for (let H = 0; H <= u; H++) {
          const h = H * M, S = q * v;
          if (Math.abs(h - p) <= I + 1e-6 && Math.abs(S - b) <= I + 1e-6) {
            const x = S - b;
            if (Math.abs(x) > 1e-6) {
              const z = x > 0 ? 1 : -1;
              R.push({
                node: q * (u + 1) + H,
                dof: 0,
                value: z * F / $ * 2
              });
            }
          }
        }
      }
      if (Math.abs(m) > 1e-6) {
        const k = I > 1e-6 ? I : M, F = m / k;
        for (let q = 0; q <= a; q++) for (let H = 0; H <= u; H++) {
          const h = H * M, S = q * v;
          if (Math.abs(h - p) <= I + 1e-6 && Math.abs(S - b) <= I + 1e-6) {
            const x = h - p;
            if (Math.abs(x) > 1e-6) {
              const z = x > 0 ? 1 : -1;
              R.push({
                node: q * (u + 1) + H,
                dof: 0,
                value: z * F / $ * 2
              });
            }
          }
        }
      }
      const f = {
        1: 2,
        2: 1,
        3: 0
      }[jt] ?? 1;
      console.log(`Zapata: ${t}x${o}m, t=${n}m, ${u}x${a} elem`), console.log(`  col=${l}m, P=${r}, Mx=${c}, My=${m}, ks=${w}`);
      try {
        const k = Zn({
          E: i,
          nu: d,
          thickness: n,
          meshLx: t,
          meshLy: o,
          meshNx: u,
          meshNy: a,
          bcType: "none",
          pressure: 0,
          theoryType: f,
          springs: E,
          pointLoads: R
        });
        console.log(`  Solved: w_max = ${k.maxW.toExponential(4)}`);
        const F = k.nodeResults.map((O) => [
          O.x,
          O.y,
          0
        ]), q = F.length;
        F.push([
          p - I,
          b - I,
          0
        ]), F.push([
          p + I,
          b - I,
          0
        ]), F.push([
          p + I,
          b + I,
          0
        ]), F.push([
          p - I,
          b + I,
          0
        ]), F.push([
          p - I,
          b - I,
          s
        ]), F.push([
          p + I,
          b - I,
          s
        ]), F.push([
          p + I,
          b + I,
          s
        ]), F.push([
          p - I,
          b + I,
          s
        ]);
        const H = k.elementResults.map((O) => [
          ...O.nodes
        ]);
        H.push([
          q,
          q + 4
        ]), H.push([
          q + 1,
          q + 5
        ]), H.push([
          q + 2,
          q + 6
        ]), H.push([
          q + 3,
          q + 7
        ]), H.push([
          q + 4,
          q + 5
        ]), H.push([
          q + 5,
          q + 6
        ]), H.push([
          q + 6,
          q + 7
        ]), H.push([
          q + 7,
          q + 4
        ]), H.push([
          q,
          q + 1
        ]), H.push([
          q + 1,
          q + 2
        ]), H.push([
          q + 2,
          q + 3
        ]), H.push([
          q + 3,
          q
        ]), e.nodes.val = F, e.elements.val = H;
        const h = /* @__PURE__ */ new Map();
        k.nodeResults.forEach((O, B) => {
          h.set(B, [
            0,
            0,
            O.w,
            O.bx,
            O.by,
            0
          ]);
        }), e.deformOutputs && (e.deformOutputs.val = {
          deformations: h
        });
        const S = /* @__PURE__ */ new Map();
        k.nodeResults.forEach((O, B) => {
          const G = O.x, j = O.y;
          (G < 1e-6 || G > t - 1e-6 || j < 1e-6 || j > o - 1e-6) && S.set(B, [
            false,
            false,
            true,
            false,
            false,
            false
          ]);
        });
        const x = /* @__PURE__ */ new Map();
        if (x.set(q + 4, [
          0,
          0,
          r / 4,
          0,
          0,
          0
        ]), x.set(q + 5, [
          0,
          0,
          r / 4,
          0,
          0,
          0
        ]), x.set(q + 6, [
          0,
          0,
          r / 4,
          0,
          0,
          0
        ]), x.set(q + 7, [
          0,
          0,
          r / 4,
          0,
          0,
          0
        ]), e.nodeInputs && (e.nodeInputs.val = {
          supports: S,
          loads: x
        }), e.elementInputs && (e.elementInputs.val = {}), e.analyzeOutputs) {
          const O = k.elementResults.length, B = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map();
          k.elementResults.forEach((D, X) => {
            B.set(X, [
              D.Mxx,
              D.Mxx,
              D.Mxx
            ]), G.set(X, [
              D.Myy,
              D.Myy,
              D.Myy
            ]), j.set(X, [
              D.Mxy,
              D.Mxy,
              D.Mxy
            ]);
          }), e.analyzeOutputs.val = {
            bendingXX: B,
            bendingYY: G,
            bendingXY: j
          };
        }
        const z = De();
        z && (z.settings.shellResults.val = "bendingXX");
      } catch (k) {
        console.warn("Zapata solver failed:", k.message);
      }
      setTimeout(() => st(), 50), Ne();
    }
    function Ls() {
      const t = te("Lx") || 0.4, o = te("Ly") || 0.4, n = te("t") || 0.025, l = te("dBolt") || 0.022, s = te("sx") || 0.28, u = te("sy") || 0.28, a = te("colA") || 0.2, i = te("meshSize") || 8e-3, d = te("E") || 2e8, r = te("nu") || 0.3, c = d / (2 * (1 + r)), m = te("P") || -200, w = Math.round(te("nBolts") || 4), M = t / 2, v = o / 2, p = l / 2, b = a / 2, I = [];
      w >= 4 && (I.push([
        M - s / 2,
        v - u / 2
      ]), I.push([
        M + s / 2,
        v - u / 2
      ]), I.push([
        M + s / 2,
        v + u / 2
      ]), I.push([
        M - s / 2,
        v + u / 2
      ])), w >= 6 && (I.push([
        M,
        v - u / 2
      ]), I.push([
        M,
        v + u / 2
      ])), w >= 8 && (I.push([
        M - s / 2,
        v
      ]), I.push([
        M + s / 2,
        v
      ]));
      const { nodes: E, elements: $ } = lo({
        points: [
          [
            0,
            0,
            0
          ],
          [
            t,
            0,
            0
          ],
          [
            t,
            o,
            0
          ],
          [
            0,
            o,
            0
          ]
        ],
        polygon: [
          0,
          1,
          2,
          3
        ],
        maxMeshSize: i
      }), C = (h, S) => {
        for (const [x, z] of I) if ((h - x) * (h - x) + (S - z) * (S - z) < p * p) return true;
        return false;
      }, R = $.filter((h) => {
        const S = (E[h[0]][0] + E[h[1]][0] + E[h[2]][0]) / 3, x = (E[h[0]][1] + E[h[1]][1] + E[h[2]][1]) / 3;
        return !C(S, x);
      }), g = E, f = /* @__PURE__ */ new Map();
      for (let h = 0; h < g.length; h++) {
        const S = g[h][0], x = g[h][1];
        for (const [z, O] of I) {
          const B = Math.sqrt((S - z) * (S - z) + (x - O) * (x - O));
          B >= p * 0.7 && B <= p * 1.5 && f.set(h, [
            true,
            true,
            true,
            false,
            false,
            false
          ]);
        }
      }
      const k = /* @__PURE__ */ new Map();
      let F = 0;
      for (let h = 0; h < g.length; h++) {
        const S = g[h][0], x = g[h][1];
        Math.abs(S - M) <= b && Math.abs(x - v) <= b && F++;
      }
      const q = m / Math.max(F, 1);
      for (let h = 0; h < g.length; h++) {
        const S = g[h][0], x = g[h][1];
        if (Math.abs(S - M) <= b && Math.abs(x - v) <= b) {
          const z = k.get(h) || [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          z[2] += q, k.set(h, z);
        }
      }
      const H = {
        elasticities: new Map(R.map((h, S) => [
          S,
          d
        ])),
        elasticitiesOrthogonal: new Map(R.map((h, S) => [
          S,
          d
        ])),
        thicknesses: new Map(R.map((h, S) => [
          S,
          n
        ])),
        poissonsRatios: new Map(R.map((h, S) => [
          S,
          r
        ])),
        shearModuli: new Map(R.map((h, S) => [
          S,
          c
        ]))
      };
      console.log(`Placa Base: ${t * 1e3}x${o * 1e3}mm, t=${n * 1e3}mm, ${w} pernos d=${l * 1e3}mm`), console.log(`  P=${m} kN, col=${a * 1e3}mm, mesh=${i * 1e3}mm`), console.log(`  ${R.length} triangulos, ${g.length} nodos`);
      try {
        const h = pt(g, R, {
          supports: f,
          loads: k
        }, H), S = so(g, R, H, h);
        e.nodes.val = g, e.elements.val = R, h && e.deformOutputs && (e.deformOutputs.val = h), e.nodeInputs && (e.nodeInputs.val = {
          supports: f,
          loads: k
        }), e.elementInputs && (e.elementInputs.val = {}), S && e.analyzeOutputs && (e.analyzeOutputs.val = S);
        let x = 0;
        h && h.deformations && h.deformations.forEach((z) => {
          const O = Math.sqrt(z[0] * z[0] + z[1] * z[1] + z[2] * z[2]);
          x = Math.max(x, O);
        }), console.log(`  max|u| = ${x.toExponential(4)}`);
      } catch (h) {
        console.warn("Placa Base failed:", h.message);
      }
      setTimeout(() => st(), 50), Ne();
    }
    function Ts() {
      const t = te("colB") || 0.3, o = te("colH") || 0.3, n = te("colT") || 8e-3, l = te("colLen") || 1.5, s = te("Lx") || 0.45, u = te("Ly") || 0.45, a = te("tPlaca") || 0.025, i = te("dBolt") || 0.022, d = te("sx") || 0.32, r = te("sy") || 0.32, c = Math.round(te("nSubColV") || 6), m = Math.round(te("nSubColH") || 4), w = Math.round(te("nSubPlaca") || 10), M = te("E") || 2e8, v = te("nu") || 0.3, p = M / (2 * (1 + v)), b = te("P") || -300, I = s / 2, E = u / 2, $ = i / 2, C = t / 2, R = o / 2, g = [], f = [], k = w, F = s / k, q = u / k, H = (ae, W) => W * (k + 1) + ae;
      for (let ae = 0; ae <= k; ae++) for (let W = 0; W <= k; W++) g.push([
        W * F,
        ae * q,
        0
      ]);
      const h = [
        [
          I - d / 2,
          E - r / 2
        ],
        [
          I + d / 2,
          E - r / 2
        ],
        [
          I + d / 2,
          E + r / 2
        ],
        [
          I - d / 2,
          E + r / 2
        ]
      ], S = (ae, W) => {
        for (const [le, fe] of h) if ((ae - le) * (ae - le) + (W - fe) * (W - fe) < $ * $) return true;
        return false;
      }, x = f.length;
      for (let ae = 0; ae < k; ae++) for (let W = 0; W < k; W++) {
        const le = (W + 0.5) * F, fe = (ae + 0.5) * q;
        S(le, fe) || f.push([
          H(W, ae),
          H(W + 1, ae),
          H(W + 1, ae + 1),
          H(W, ae + 1)
        ]);
      }
      const z = f.length - x, O = c, B = m, G = [
        [
          I - C,
          E - R
        ],
        [
          I + C,
          E - R
        ],
        [
          I + C,
          E + R
        ],
        [
          I - C,
          E + R
        ]
      ], j = f.length, D = [
        [
          0,
          1
        ],
        [
          1,
          2
        ],
        [
          2,
          3
        ],
        [
          3,
          0
        ]
      ], X = (ae, W) => {
        for (let le = 0; le < (k + 1) * (k + 1); le++) if (Math.abs(g[le][0] - ae) < F * 0.3 && Math.abs(g[le][1] - W) < q * 0.3 && Math.abs(g[le][2]) < 1e-6) return le;
        return -1;
      };
      for (const [ae, W] of D) {
        const [le, fe] = G[ae], [U, ue] = G[W], ze = [];
        for (let Be = 0; Be <= O; Be++) {
          const je = [], tt = Be / O * l;
          for (let lt = 0; lt <= B; lt++) {
            const ot = lt / B, ut = le + ot * (U - le), no = fe + ot * (ue - fe);
            if (Be === 0) {
              const kt = X(ut, no);
              if (kt >= 0) {
                je.push(kt);
                continue;
              }
            }
            let Ft = -1;
            for (let kt = 0; kt < g.length; kt++) if (Math.abs(g[kt][0] - ut) < 1e-6 && Math.abs(g[kt][1] - no) < 1e-6 && Math.abs(g[kt][2] - tt) < 1e-6) {
              Ft = kt;
              break;
            }
            Ft >= 0 ? je.push(Ft) : (je.push(g.length), g.push([
              ut,
              no,
              tt
            ]));
          }
          ze.push(je);
        }
        for (let Be = 0; Be < O; Be++) for (let je = 0; je < B; je++) f.push([
          ze[Be][je],
          ze[Be][je + 1],
          ze[Be + 1][je + 1],
          ze[Be + 1][je]
        ]);
      }
      const ee = f.length - j, de = /* @__PURE__ */ new Map();
      for (let ae = 0; ae < (k + 1) * (k + 1); ae++) {
        const W = g[ae][0], le = g[ae][1];
        for (const [fe, U] of h) {
          const ue = Math.sqrt((W - fe) * (W - fe) + (le - U) * (le - U));
          ue >= $ * 0.5 && ue <= $ * 2 && de.set(ae, [
            true,
            true,
            true,
            true,
            true,
            true
          ]);
        }
      }
      const me = /* @__PURE__ */ new Map(), _ = [];
      for (let ae = 0; ae < g.length; ae++) Math.abs(g[ae][2] - l) < 1e-6 && _.push(ae);
      const se = b / Math.max(_.length, 1);
      for (const ae of _) me.set(ae, [
        0,
        0,
        se,
        0,
        0,
        0
      ]);
      const Y = {
        elasticities: /* @__PURE__ */ new Map(),
        poissonsRatios: /* @__PURE__ */ new Map(),
        thicknesses: /* @__PURE__ */ new Map(),
        shearModuli: /* @__PURE__ */ new Map()
      };
      for (let ae = x; ae < x + z; ae++) Y.elasticities.set(ae, M), Y.poissonsRatios.set(ae, v), Y.thicknesses.set(ae, a), Y.shearModuli.set(ae, p);
      for (let ae = j; ae < j + ee; ae++) Y.elasticities.set(ae, M), Y.poissonsRatios.set(ae, v), Y.thicknesses.set(ae, n), Y.shearModuli.set(ae, p);
      console.log(`Col+Placa 3D: col ${t * 1e3}x${o * 1e3}x${n * 1e3}mm, h=${l}m`), console.log(`  Placa ${s * 1e3}x${u * 1e3}mm, t=${a * 1e3}mm, 4 pernos d=${i * 1e3}mm`), console.log(`  ${z} Q4 placa + ${ee} Q4 columna = ${f.length} total`), console.log(`  ${g.length} nodos, P=${b} kN`);
      try {
        const ae = pt(g, f, {
          supports: de,
          loads: me
        }, Y), W = so(g, f, Y, ae);
        e.nodes.val = g, e.elements.val = f, ae && e.deformOutputs && (e.deformOutputs.val = ae), e.nodeInputs && (e.nodeInputs.val = {
          supports: de,
          loads: me
        }), e.elementInputs && (e.elementInputs.val = Y), W && e.analyzeOutputs && (e.analyzeOutputs.val = W);
        let le = 0;
        (ae == null ? void 0 : ae.deformations) && ae.deformations.forEach((fe) => {
          const U = Math.sqrt(fe[0] * fe[0] + fe[1] * fe[1] + fe[2] * fe[2]);
          le = Math.max(le, U);
        }), console.log(`  max|u| = ${le.toExponential(4)}`);
      } catch (ae) {
        console.warn("Col+Placa failed:", ae.message), e.nodes.val = g, e.elements.val = f, e.nodeInputs && (e.nodeInputs.val = {
          supports: de,
          loads: me
        });
      }
      setTimeout(() => st(), 50), Ne();
    }
    function Cs() {
      const t = te("H") || 6, o = te("angle") || 45, n = te("bTop") || 3, l = te("bBot") || 3, s = te("meshSize") || 2, u = te("E") || 5e4, a = te("nu") || 0.3, i = te("gamma") || 18, d = te("c") || 15, r = te("phi") || 30, c = te("qs") || 0, m = t / Math.tan(o * Math.PI / 180), w = l + m + n, M = t, v = [
        [
          0,
          -M,
          0
        ],
        [
          w,
          -M,
          0
        ],
        [
          w,
          t,
          0
        ],
        [
          l + m,
          t,
          0
        ],
        [
          l,
          0,
          0
        ],
        [
          0,
          0,
          0
        ]
      ], { nodes: p, elements: b } = lo({
        points: v,
        polygon: [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        maxMeshSize: s
      }), I = p, E = [], $ = /* @__PURE__ */ new Map();
      for (let R = 0; R < I.length; R++) {
        const g = I[R][0], f = I[R][1];
        Math.abs(f + M) < 1e-6 ? (E.push({
          node: R,
          fixX: true,
          fixY: true
        }), $.set(R, [
          true,
          true,
          true,
          true,
          true,
          true
        ])) : (Math.abs(g) < 1e-6 || Math.abs(g - w) < 1e-6) && (E.push({
          node: R,
          fixX: true,
          fixY: false
        }), $.set(R, [
          true,
          false,
          true,
          true,
          true,
          true
        ]));
      }
      const C = t - s * 0.3;
      try {
        const R = I.map((S) => [
          S[0],
          S[1]
        ]), g = b.map((S) => [
          S[0],
          S[1],
          S[2]
        ]), f = Qa({
          nodes: R,
          elements: g,
          E: u,
          nu: a,
          gamma: i,
          c: d,
          phi: r,
          thickness: 1,
          supports: E,
          surcharge: c,
          surfaceYThreshold: C
        }), k = I.map((S) => [
          S[0],
          0,
          S[1]
        ]);
        e.nodes.val = k, e.elements.val = b;
        const F = /* @__PURE__ */ new Map();
        for (let S = 0; S < f.displacements.length; S++) {
          const [x, z] = f.displacements[S];
          F.set(S, [
            x,
            0,
            z,
            0,
            0,
            0
          ]);
        }
        e.deformOutputs && (e.deformOutputs.val = {
          deformations: F
        }), e.nodeInputs && (e.nodeInputs.val = {
          supports: $
        }), e.elementInputs && (e.elementInputs.val = {});
        const q = /* @__PURE__ */ new Map();
        for (let S = 0; S < f.plasticStrain.length; S++) {
          const x = f.plasticStrain[S];
          q.set(S, [
            x,
            x,
            x
          ]);
        }
        e.analyzeOutputs && (e.analyzeOutputs.val = {
          membraneXX: q
        });
        let H = 0;
        for (const [S, x] of f.displacements) {
          const z = Math.sqrt(S * S + x * x);
          H = Math.max(H, z);
        }
        let h = 0;
        for (const S of f.plasticStrain) h = Math.max(h, S);
        console.log(`Talud SRM: ${I.length} nodos, ${b.length} triangulos`), console.log(`  H=${t}, angulo=${o}\xB0, c=${d} kPa, \u03C6=${r}\xB0, \u03B3=${i}`), console.log("  \u2550\u2550\u2550 Strength Reduction Method (Mohr-Coulomb) \u2550\u2550\u2550"), console.log(`  FOS = ${f.fos.toFixed(3)}`), console.log(`  max|u| = ${H.toExponential(4)}`), console.log(`  max \u03B5_pl = ${h.toExponential(4)}`), f.fos < 1 ? console.warn("  \u26A0 TALUD INESTABLE (FOS < 1.0)") : f.fos < 1.5 && console.warn("  \u26A0 FOS < 1.5 \u2014 revisar estabilidad");
      } catch (R) {
        console.warn("Talud SRM failed:", R.message);
      }
      setTimeout(() => st(), 50), Ne();
    }
    let Zt = null, bt = null, Qt = null;
    function Sa() {
      let t = document.getElementById("sections");
      if (!t) {
        t = document.createElement("div"), t.id = "sections";
        const o = document.getElementById("parameters");
        let n = document.getElementById("right-panels-wrapper");
        if (!n && o) {
          n = document.createElement("div"), n.id = "right-panels-wrapper", n.style.cssText = "position:absolute;bottom:0;right:0;z-index:3;max-height:95vh;display:flex;flex-direction:row;gap:0;align-items:flex-end;pointer-events:none;";
          let l = document.getElementById("luces-panel");
          l || (l = document.createElement("div"), l.id = "luces-panel", l.style.cssText = "width:180px;max-height:90vh;overflow-y:auto;pointer-events:auto;"), o.style.cssText = "width:240px;position:static;max-height:90vh;overflow-y:auto;pointer-events:auto;";
          const s = o.parentElement;
          s.removeChild(o), n.appendChild(t), n.appendChild(l), n.appendChild(o), s.appendChild(n);
        }
        n ? t.style.cssText = "width:200px;max-height:90vh;overflow-y:auto;pointer-events:auto;" : (t.style.cssText = "position:absolute;bottom:0;right:316px;width:250px;z-index:3;max-height:80vh;overflow-y:auto;", document.body.appendChild(t));
      }
      return t;
    }
    function rt(t) {
      const o = Wo.find((n) => n.id === N);
      return t / o.toM;
    }
    function it(t) {
      const o = Wo.find((n) => n.id === N);
      return t * o.toM;
    }
    function yo(t) {
      const o = ds.find((l) => l.id === oe.forceId), n = Wo.find((l) => l.id === oe.lengthId);
      return t / (o.toKN / (n.toM * n.toM));
    }
    function An(t) {
      const o = ds.find((l) => l.id === oe.forceId), n = Wo.find((l) => l.id === oe.lengthId);
      return t * (o.toKN / (n.toM * n.toM));
    }
    function Fn() {
      return oe.label;
    }
    function ka() {
      switch (Wo.find((o) => o.id === N).id) {
        case "m":
          return [
            0.1,
            2,
            0.05
          ];
        case "cm":
          return [
            10,
            200,
            5
          ];
        case "mm":
          return [
            100,
            2e3,
            50
          ];
        case "in":
          return [
            4,
            80,
            1
          ];
        case "ft":
          return [
            0.3,
            6,
            0.1
          ];
      }
    }
    function Ea() {
      const t = yo(20594), o = yo(58840), n = Math.max(1, Math.round((o - t) / 40));
      return [
        Math.round(t),
        Math.round(o),
        n
      ];
    }
    function As(t, o, n, l, s) {
      const u = ke.steelVigaType, a = u === 0 ? gn() : hn();
      if (ke.vigaMat === 0) {
        for (let i = 0; i < o.length; i++) {
          const d = o[i], r = `b${n}${i}`, c = `h${n}${i}`, m = {};
          m[r] = +rt(d.b).toFixed(2), m[c] = +rt(d.h).toFixed(2), t.addBinding(m, r, {
            min: l[0],
            max: l[1],
            step: l[2],
            label: `b sv${n}${i + 1}`
          }), t.addBinding(m, c, {
            min: l[0],
            max: l[1],
            step: l[2],
            label: `h sv${n}${i + 1}`
          });
        }
        t.on("change", (i) => {
          var _a2;
          const d = (_a2 = i.target) == null ? void 0 : _a2.key, r = d == null ? void 0 : d.match(new RegExp(`^b${n}(\\d+)$`)), c = d == null ? void 0 : d.match(new RegExp(`^h${n}(\\d+)$`));
          r && (o[parseInt(r[1])].b = it(i.value), we()), c && (o[parseInt(c[1])].h = it(i.value), we());
        });
      } else if (u <= 1) {
        for (let i = 0; i < o.length; i++) {
          const d = {};
          d[`p${n}${i}`] = o[i].profileIdx ?? 0, t.addBinding(d, `p${n}${i}`, {
            label: `sv${n}${i + 1}`,
            options: a
          });
        }
        t.on("change", (i) => {
          var _a2, _b;
          const r = (_b = (_a2 = i.target) == null ? void 0 : _a2.key) == null ? void 0 : _b.match(new RegExp(`^p${n}(\\d+)$`));
          r && (o[parseInt(r[1])].profileIdx = i.value, we());
        });
      } else if (u === 2) {
        for (let i = 0; i < o.length; i++) {
          const d = o[i], r = {}, c = `${n}${i}`;
          r[`bf${c}`] = +rt(d.bf ?? 0.2).toFixed(3), r[`h${c}`] = +rt(d.hf ?? 0.4).toFixed(3), r[`tf${c}`] = +rt(d.tf ?? 0.015).toFixed(3), r[`tw${c}`] = +rt(d.tw ?? 0.01).toFixed(3), t.addBinding(r, `bf${c}`, {
            min: l[0],
            max: l[1],
            step: l[2],
            label: `bf sv${n}${i + 1}`
          }), t.addBinding(r, `h${c}`, {
            min: l[0],
            max: l[1],
            step: l[2],
            label: `h sv${n}${i + 1}`
          }), t.addBinding(r, `tf${c}`, {
            min: s[0],
            max: s[1],
            step: s[2],
            label: `tf sv${n}${i + 1}`
          }), t.addBinding(r, `tw${c}`, {
            min: s[0],
            max: s[1],
            step: s[2],
            label: `tw sv${n}${i + 1}`
          });
        }
        t.on("change", (i) => {
          var _a2;
          const d = (_a2 = i.target) == null ? void 0 : _a2.key;
          for (let r = 0; r < o.length; r++) {
            const c = `${n}${r}`;
            d === `bf${c}` && (o[r].bf = it(i.value), we()), d === `h${c}` && (o[r].hf = it(i.value), we()), d === `tf${c}` && (o[r].tf = it(i.value), we()), d === `tw${c}` && (o[r].tw = it(i.value), we());
          }
        });
      } else {
        for (let i = 0; i < o.length; i++) {
          const d = o[i], r = {}, c = `${n}${i}`;
          r[`bc${c}`] = +rt(d.bc ?? 0.2).toFixed(3), r[`hc${c}`] = +rt(d.hc ?? 0.3).toFixed(3), r[`t${c}`] = +rt(d.t ?? 8e-3).toFixed(3), t.addBinding(r, `bc${c}`, {
            min: l[0],
            max: l[1],
            step: l[2],
            label: `b sv${n}${i + 1}`
          }), t.addBinding(r, `hc${c}`, {
            min: l[0],
            max: l[1],
            step: l[2],
            label: `h sv${n}${i + 1}`
          }), t.addBinding(r, `t${c}`, {
            min: s[0],
            max: s[1],
            step: s[2],
            label: `t sv${n}${i + 1}`
          });
        }
        t.on("change", (i) => {
          var _a2;
          const d = (_a2 = i.target) == null ? void 0 : _a2.key;
          for (let r = 0; r < o.length; r++) {
            const c = `${n}${r}`;
            d === `bc${c}` && (o[r].bc = it(i.value), we()), d === `hc${c}` && (o[r].hc = it(i.value), we()), d === `t${c}` && (o[r].t = it(i.value), we());
          }
        });
      }
    }
    function Po() {
      var _a2;
      if (bt) {
        try {
          bt.dispose();
        } catch {
        }
        bt = null;
      }
      const t = document.getElementById("sections");
      if (t && (t.innerHTML = ""), A !== "edificio" && A !== "frame") {
        t && (t.style.display = "none");
        return;
      }
      const o = Sa();
      if (!o) return;
      o.style.display = "";
      const n = L, l = Math.round(((_a2 = J.nPisos) == null ? void 0 : _a2.val) ?? 3), s = ka(), u = Ea(), a = ce.length || 1, i = re.length || 1;
      for (; ke.perFloor.length < l; ) {
        const g = ke.perFloor.length > 0 ? JSON.parse(JSON.stringify(ke.perFloor[ke.perFloor.length - 1])) : wa(a, i);
        ke.perFloor.push(g);
      }
      ke.perFloor.length > l && (ke.perFloor.length = l);
      for (const g of ke.perFloor) {
        for (; g.vigasX.length < a; ) g.vigasX.push(g.vigasX.length > 0 ? {
          ...g.vigasX[g.vigasX.length - 1]
        } : Xt());
        for (g.vigasX.length > a && (g.vigasX.length = a); g.vigasY.length < i; ) g.vigasY.push(g.vigasY.length > 0 ? {
          ...g.vigasY[g.vigasY.length - 1]
        } : Xt());
        g.vigasY.length > i && (g.vigasY.length = i);
      }
      bt = new tn({
        title: `Sections (${n.label})`,
        container: o
      });
      const d = {
        colMat: ke.colMat
      };
      if (bt.addBinding(d, "colMat", {
        label: "Col Material",
        options: {
          Hormigon: 0,
          Acero: 1,
          CFT: 2
        }
      }).on("change", (g) => {
        ke.colMat = g.value, Po(), we();
      }), ke.colMat === 0) {
        const g = {
          forma: ke.colShape
        };
        bt.addBinding(g, "forma", {
          label: "Col forma",
          options: {
            Rectangular: 0,
            Circular: 1
          }
        }).on("change", (k) => {
          ke.colShape = k.value, Po(), we();
        });
        const f = {
          fc: +yo(ke.fc).toFixed(1)
        };
        bt.addBinding(f, "fc", {
          min: u[0],
          max: u[1],
          step: u[2],
          label: `f'c col (${Fn()})`
        }), bt.on("change", (k) => {
          var _a3;
          ((_a3 = k.target) == null ? void 0 : _a3.key) === "fc" && (ke.fc = An(k.value), we());
        });
      } else if (ke.colMat === 1) {
        const g = {
          colType: ke.steelColType
        };
        bt.addBinding(g, "colType", {
          label: "Col tipo",
          options: {
            "W profile": 0,
            "HSS profile": 1,
            "I param": 2,
            Tubular: 3
          }
        }).on("change", (f) => {
          ke.steelColType = f.value, Po(), we();
        });
      }
      bt.addBlade({
        view: "separator"
      });
      const r = {
        vigaMat: ke.vigaMat
      };
      if (bt.addBinding(r, "vigaMat", {
        label: "Viga Material",
        options: {
          Hormigon: 0,
          Acero: 1
        }
      }).on("change", (g) => {
        ke.vigaMat = g.value, Po(), we();
      }), ke.vigaMat === 1) {
        const g = {
          vigaType: ke.steelVigaType
        };
        bt.addBinding(g, "vigaType", {
          label: "Viga tipo",
          options: {
            "W profile": 0,
            "HSS profile": 1,
            "I param": 2,
            Tubular: 3
          }
        }).on("change", (f) => {
          ke.steelVigaType = f.value, Po(), we();
        });
      }
      const c = ke.steelColType === 0 ? gn() : hn();
      ke.steelVigaType === 0 ? gn() : hn();
      const m = N === "m" ? [
        5e-3,
        0.1,
        1e-3
      ] : N === "cm" ? [
        0.5,
        10,
        0.1
      ] : N === "mm" ? [
        5,
        100,
        1
      ] : N === "in" ? [
        0.2,
        4,
        0.05
      ] : [
        0.01,
        0.5,
        5e-3
      ];
      for (let g = 0; g < l; g++) {
        const f = ke.perFloor[g], k = bt.addFolder({
          title: `Piso ${g + 1}`,
          expanded: g < 2
        });
        if (ke.colMat === 0) if (ke.colShape === 1) {
          const F = {
            dCol: +rt(f.dCol).toFixed(2)
          };
          k.addBinding(F, "dCol", {
            min: s[0],
            max: s[1],
            step: s[2],
            label: "d col"
          }), k.on("change", (q) => {
            var _a3;
            ((_a3 = q.target) == null ? void 0 : _a3.key) === "dCol" && (f.dCol = it(q.value), we());
          });
        } else {
          const F = {
            bCol: +rt(f.bCol).toFixed(2),
            hCol: +rt(f.hCol).toFixed(2)
          };
          k.addBinding(F, "bCol", {
            min: s[0],
            max: s[1],
            step: s[2],
            label: "b col"
          }), k.addBinding(F, "hCol", {
            min: s[0],
            max: s[1],
            step: s[2],
            label: "h col"
          }), k.on("change", (q) => {
            var _a3, _b;
            ((_a3 = q.target) == null ? void 0 : _a3.key) === "bCol" && (f.bCol = it(q.value), we()), ((_b = q.target) == null ? void 0 : _b.key) === "hCol" && (f.hCol = it(q.value), we());
          });
        }
        else if (ke.colMat === 1) if (ke.steelColType <= 1) {
          const F = {
            col: f.colProfileIdx
          };
          k.addBinding(F, "col", {
            label: "Columna",
            options: c
          }).on("change", (q) => {
            f.colProfileIdx = q.value, we();
          });
        } else if (ke.steelColType === 2) {
          const F = {
            bf: +rt(f.colBf ?? 0.3).toFixed(3),
            h: +rt(f.colHf ?? 0.3).toFixed(3),
            tf: +rt(f.colTf ?? 0.02).toFixed(3),
            tw: +rt(f.colTw ?? 0.012).toFixed(3)
          };
          k.addBinding(F, "bf", {
            min: s[0],
            max: s[1],
            step: s[2],
            label: "Col bf"
          }), k.addBinding(F, "h", {
            min: s[0],
            max: s[1],
            step: s[2],
            label: "Col h"
          }), k.addBinding(F, "tf", {
            min: m[0],
            max: m[1],
            step: m[2],
            label: "Col tf"
          }), k.addBinding(F, "tw", {
            min: m[0],
            max: m[1],
            step: m[2],
            label: "Col tw"
          }), k.on("change", (q) => {
            var _a3, _b, _c, _d;
            ((_a3 = q.target) == null ? void 0 : _a3.key) === "bf" && (f.colBf = it(q.value), we()), ((_b = q.target) == null ? void 0 : _b.key) === "h" && (f.colHf = it(q.value), we()), ((_c = q.target) == null ? void 0 : _c.key) === "tf" && (f.colTf = it(q.value), we()), ((_d = q.target) == null ? void 0 : _d.key) === "tw" && (f.colTw = it(q.value), we());
          });
        } else {
          const F = {
            bc: +rt(f.colBc ?? 0.3).toFixed(3),
            hc: +rt(f.colHc ?? 0.3).toFixed(3),
            t: +rt(f.colT ?? 0.01).toFixed(3)
          };
          k.addBinding(F, "bc", {
            min: s[0],
            max: s[1],
            step: s[2],
            label: "Col b"
          }), k.addBinding(F, "hc", {
            min: s[0],
            max: s[1],
            step: s[2],
            label: "Col h"
          }), k.addBinding(F, "t", {
            min: m[0],
            max: m[1],
            step: m[2],
            label: "Col t"
          }), k.on("change", (q) => {
            var _a3, _b, _c;
            ((_a3 = q.target) == null ? void 0 : _a3.key) === "bc" && (f.colBc = it(q.value), we()), ((_b = q.target) == null ? void 0 : _b.key) === "hc" && (f.colHc = it(q.value), we()), ((_c = q.target) == null ? void 0 : _c.key) === "t" && (f.colT = it(q.value), we());
          });
        }
        else {
          const F = {
            bc: +rt(f.colBc ?? 0.3).toFixed(3),
            hc: +rt(f.colHc ?? 0.3).toFixed(3),
            t: +rt(f.colT ?? 0.01).toFixed(3),
            Es: +yo(f.colEs ?? 2e8).toFixed(0),
            nuS: f.colNuS ?? 0.3,
            fc: +yo(f.colFc ?? 28e3).toFixed(1),
            nuC: f.colNuC ?? 0.2
          };
          k.addBinding(F, "bc", {
            min: s[0],
            max: s[1],
            step: s[2],
            label: "Col b"
          }), k.addBinding(F, "hc", {
            min: s[0],
            max: s[1],
            step: s[2],
            label: "Col h"
          }), k.addBinding(F, "t", {
            min: m[0],
            max: m[1],
            step: m[2],
            label: "Col t"
          }), k.addBlade({
            view: "separator"
          });
          const q = +yo(1e8).toFixed(0), H = +yo(3e8).toFixed(0), h = Math.max(1, Math.round((H - q) / 200));
          k.addBinding(F, "Es", {
            min: q,
            max: H,
            step: h,
            label: `Es (${Fn()})`
          }), k.addBinding(F, "nuS", {
            min: 0.15,
            max: 0.45,
            step: 0.01,
            label: "\u03BDs"
          }), k.addBinding(F, "fc", {
            min: u[0],
            max: u[1],
            step: u[2],
            label: `f'c (${Fn()})`
          }), k.addBinding(F, "nuC", {
            min: 0.1,
            max: 0.35,
            step: 0.01,
            label: "\u03BDc"
          }), k.on("change", (S) => {
            var _a3, _b, _c, _d, _e, _f, _g;
            ((_a3 = S.target) == null ? void 0 : _a3.key) === "bc" && (f.colBc = it(S.value), we()), ((_b = S.target) == null ? void 0 : _b.key) === "hc" && (f.colHc = it(S.value), we()), ((_c = S.target) == null ? void 0 : _c.key) === "t" && (f.colT = it(S.value), we()), ((_d = S.target) == null ? void 0 : _d.key) === "Es" && (f.colEs = An(S.value), we()), ((_e = S.target) == null ? void 0 : _e.key) === "nuS" && (f.colNuS = S.value, we()), ((_f = S.target) == null ? void 0 : _f.key) === "fc" && (f.colFc = An(S.value), we()), ((_g = S.target) == null ? void 0 : _g.key) === "nuC" && (f.colNuC = S.value, we());
          });
        }
        if (f.vigasX.length > 0) {
          const F = k.addFolder({
            title: `Vigas X (${f.vigasX.length})`,
            expanded: false
          });
          As(F, f.vigasX, "x", s, m);
        }
        if (f.vigasY.length > 0) {
          const F = k.addFolder({
            title: `Vigas Y (${f.vigasY.length})`,
            expanded: false
          });
          As(F, f.vigasY, "y", s, m);
        }
      }
      bt.addBlade({
        view: "separator"
      });
      const w = bt.addFolder({
        title: "Vigas Secundarias",
        expanded: false
      }), M = {
        activar: Ze,
        direccion: xt === "x" ? 0 : 1,
        cantidad: Ye
      };
      w.addBinding(M, "activar", {
        label: "Activar"
      }), w.addBinding(M, "direccion", {
        label: "Corren en",
        options: {
          "X (entre ejes Y)": 0,
          "Y (entre ejes X)": 1
        }
      }), w.addBinding(M, "cantidad", {
        min: 1,
        max: 5,
        step: 1,
        label: "Cantidad/vano"
      }), w.on("change", (g) => {
        var _a3, _b, _c;
        ((_a3 = g.target) == null ? void 0 : _a3.key) === "activar" && (Ze = g.value, we()), ((_b = g.target) == null ? void 0 : _b.key) === "direccion" && (xt = g.value === 0 ? "x" : "y", we()), ((_c = g.target) == null ? void 0 : _c.key) === "cantidad" && (Ye = Math.round(g.value), we());
      }), bt.addBlade({
        view: "separator"
      });
      const v = bt.addFolder({
        title: "Losas de Piso",
        expanded: true
      }), p = {
        activar: qt,
        espesor: +rt(Nt).toFixed(3),
        subdivX: Co,
        subdivY: Ao
      };
      v.addBinding(p, "activar", {
        label: "Activar losas"
      }), v.addBinding(p, "espesor", {
        min: s[0],
        max: s[1] * 0.3,
        step: s[2],
        label: `Espesor (${n.length})`
      }), v.addBinding(p, "subdivX", {
        min: 1,
        max: 6,
        step: 1,
        label: "Subdiv. X"
      }), v.addBinding(p, "subdivY", {
        min: 1,
        max: 6,
        step: 1,
        label: "Subdiv. Y"
      }), v.on("change", (g) => {
        var _a3, _b, _c, _d;
        ((_a3 = g.target) == null ? void 0 : _a3.key) === "activar" && (qt = g.value, we()), ((_b = g.target) == null ? void 0 : _b.key) === "espesor" && (Nt = it(g.value), we()), ((_c = g.target) == null ? void 0 : _c.key) === "subdivX" && (Co = Math.round(g.value), we()), ((_d = g.target) == null ? void 0 : _d.key) === "subdivY" && (Ao = Math.round(g.value), we());
      }), bt.addBlade({
        view: "separator"
      });
      const b = bt.addFolder({
        title: "Muros de Corte",
        expanded: true
      }), I = {
        espesor: +rt(Ge).toFixed(3),
        subdivH: nt,
        subdivW: Xe
      };
      b.addBinding(I, "espesor", {
        min: s[0],
        max: s[1],
        step: s[2],
        label: `Espesor (${n.length})`
      }), b.addBinding(I, "subdivH", {
        min: 1,
        max: 6,
        step: 1,
        label: "Subdiv. V"
      }), b.addBinding(I, "subdivW", {
        min: 1,
        max: 6,
        step: 1,
        label: "Subdiv. H"
      }), b.on("change", (g) => {
        var _a3, _b, _c;
        ((_a3 = g.target) == null ? void 0 : _a3.key) === "espesor" && (Ge = it(g.value), we()), ((_b = g.target) == null ? void 0 : _b.key) === "subdivH" && (nt = Math.round(g.value), we()), ((_c = g.target) == null ? void 0 : _c.key) === "subdivW" && (Xe = Math.round(g.value), we());
      });
      const E = ce.length || 1, $ = re.length || 1, C = E + 1, R = $ + 1;
      if (E > 0) {
        const g = b.addFolder({
          title: `Muros dir X (${E} vanos)`,
          expanded: false
        });
        for (let f = 0; f < E; f++) for (let k = 0; k < R; k++) {
          const F = `wx_${f}_${k}`, q = qe.some((S) => S.dir === "x" && S.bay === f && S.axisIdx === k), H = {};
          H[F] = q;
          const h = `Vano X${f + 1} / Eje Y${String.fromCharCode(65 + k)}`;
          g.addBinding(H, F, {
            label: h
          }).on("change", (S) => {
            S.value ? qe.push({
              dir: "x",
              bay: f,
              axisIdx: k,
              floors: [
                -1
              ]
            }) : qe = qe.filter((x) => !(x.dir === "x" && x.bay === f && x.axisIdx === k)), we();
          });
        }
      }
      if ($ > 0) {
        const g = b.addFolder({
          title: `Muros dir Y (${$} vanos)`,
          expanded: false
        });
        for (let f = 0; f < $; f++) for (let k = 0; k < C; k++) {
          const F = `wy_${f}_${k}`, q = qe.some((S) => S.dir === "y" && S.bay === f && S.axisIdx === k), H = {};
          H[F] = q;
          const h = `Vano Y${f + 1} / Eje X${k + 1}`;
          g.addBinding(H, F, {
            label: h
          }).on("change", (S) => {
            S.value ? qe.push({
              dir: "y",
              bay: f,
              axisIdx: k,
              floors: [
                -1
              ]
            }) : qe = qe.filter((x) => !(x.dir === "y" && x.bay === f && x.axisIdx === k)), we();
          });
        }
      }
      if (qe.length > 0) {
        b.addBlade({
          view: "separator"
        });
        const g = {
          muros: `${qe.length} ubicaciones`
        };
        b.addBinding(g, "muros", {
          label: "Total",
          readonly: true
        });
      }
    }
    function Kt() {
      const t = document.getElementById("parameters");
      if (!t) return;
      if (be || (be = t.innerHTML), Se) {
        try {
          Se.dispose();
        } catch {
        }
        Se = null;
      }
      if (Zt) {
        try {
          Zt.dispose();
        } catch {
        }
        Zt = null;
      }
      t.innerHTML = "";
      const o = A.charAt(0).toUpperCase() + A.slice(1);
      Se = new tn({
        title: `Parameters \u2014 ${o}`,
        container: t
      });
      const n = hs()[A];
      if (n) {
        const s = {};
        for (const d of n) {
          const r = J[d.key], c = r.min === 0 && r.max === 1 && r.step === 1;
          s[d.key] = c ? r.val >= 0.5 : r.val;
        }
        const u = n.filter((d) => {
          const r = J[d.key];
          return r.min === 0 && r.max === 1 && r.step === 1;
        }), a = n.filter((d) => {
          const r = J[d.key];
          return !(r.min === 0 && r.max === 1 && r.step === 1);
        });
        for (const d of a) {
          const r = J[d.key];
          Se.addBinding(s, d.key, {
            min: r.min,
            max: r.max,
            step: r.step,
            label: r.label
          });
        }
        if (u.length > 0) {
          const d = Se.addFolder({
            title: tr("Apoyos DOFs"),
            expanded: false
          });
          for (const r of u) d.addBinding(s, r.key, {
            label: J[r.key].label
          });
        }
        const i = Se.addFolder({
          title: "Rangos",
          expanded: false
        });
        for (const d of a) {
          const r = {
            min: J[d.key].min,
            max: J[d.key].max
          };
          i.addBinding(r, "min", {
            label: `${d.key} min`,
            step: d.step
          }), i.addBinding(r, "max", {
            label: `${d.key} max`,
            step: d.step
          }), i.on("change", () => {
            J[d.key] && (J[d.key].min = r.min, J[d.key].max = r.max, J[d.key].val < r.min && (J[d.key].val = r.min), J[d.key].val > r.max && (J[d.key].val = r.max)), Kt(), we();
          });
        }
        Se.on("change", (d) => {
          var _a2, _b;
          const r = (_a2 = d.target) == null ? void 0 : _a2.key;
          if (r && J[r]) {
            if (J[r].val = typeof d.value == "boolean" ? d.value ? 1 : 0 : d.value, A === "edificio" && (r === "nVanosX" || r === "nVanosY" || r === "nPisos")) {
              if (r === "nVanosX" || r === "nVanosY") {
                const c = Math.round(J.nVanosX.val), m = Math.round(J.nVanosY.val);
                for (; ce.length < c; ) ce.push(ce[ce.length - 1] ?? L.defaultSpan);
                for (ce.length > c && (ce.length = c); re.length < m; ) re.push(re[re.length - 1] ?? L.defaultSpan * 0.8);
                re.length > m && (re.length = m);
              }
              if (r === "nPisos" || r === "hPiso") {
                const c = Math.round(J.nPisos.val), m = ((_b = J.hPiso) == null ? void 0 : _b.val) ?? 3;
                for (; ie.length < c; ) ie.push(ie[ie.length - 1] ?? m);
                ie.length > c && (ie.length = c);
              }
              Kt();
            }
            we();
          }
        });
      }
      if (A === "edificio") {
        if (Qt) {
          try {
            Qt.dispose();
          } catch {
          }
          Qt = null;
        }
        const s = document.getElementById("luces-panel");
        if (s) {
          let u = function() {
            var _a2, _b, _c, _d;
            const d = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", r = ((_a2 = J.Lvix) == null ? void 0 : _a2.val) || 0, c = ((_b = J.Lvdx) == null ? void 0 : _b.val) || 0, m = ((_c = J.Lviy) == null ? void 0 : _c.val) || 0, w = ((_d = J.Lvdy) == null ? void 0 : _d.val) || 0;
            let M = "X: ";
            r > 0 && (M += `\u251C${r.toFixed(1)}\u2524`);
            for (let b = 0; b < ce.length; b++) M += `[${d[b + (r > 0 ? 1 : 0)]}]\u2500\u2500${ce[b].toFixed(1)}\u2500\u2500`;
            M += `[${d[ce.length + (r > 0 ? 1 : 0)]}]`, c > 0 && (M += `\u251C${c.toFixed(1)}\u2524`);
            let v = "Y: ";
            m > 0 && (v += `\u251C${m.toFixed(1)}\u2524`);
            for (let b = 0; b < re.length; b++) v += `[${b + 1 + (m > 0 ? 1 : 0)}]\u2500\u2500${re[b].toFixed(1)}\u2500\u2500`;
            v += `[${re.length + 1 + (m > 0 ? 1 : 0)}]`, w > 0 && (v += `\u251C${w.toFixed(1)}\u2524`);
            let p = "Z: ";
            for (let b = 0; b < ie.length; b++) p += `P${b + 1}=${ie[b].toFixed(1)} `;
            i.textContent = M + `
` + v + `
` + p;
          };
          s.innerHTML = "";
          const a = L;
          try {
            Qt = new tn({
              title: `Luces (${a.length})`,
              container: s
            });
            const d = Qt.addFolder({
              title: "Luces X",
              expanded: true
            });
            for (let c = 0; c < ce.length; c++) {
              const m = c, w = {
                v: ce[c]
              };
              d.addBinding(w, "v", {
                min: a.spanRange[0],
                max: a.spanRange[1],
                step: a.spanRange[2],
                label: `svx${c + 1}`
              }).on("change", (M) => {
                ce[m] = M.value, we();
              });
            }
            const r = Qt.addFolder({
              title: "Luces Y",
              expanded: true
            });
            for (let c = 0; c < re.length; c++) {
              const m = c, w = {
                v: re[c]
              };
              r.addBinding(w, "v", {
                min: a.spanRange[0],
                max: a.spanRange[1],
                step: a.spanRange[2],
                label: `svy${c + 1}`
              }).on("change", (M) => {
                re[m] = M.value, we();
              });
            }
            if (ie.length > 0) {
              const c = Qt.addFolder({
                title: "Alturas por Piso",
                expanded: true
              });
              for (let m = 0; m < ie.length; m++) {
                const w = m, M = {
                  v: ie[m]
                };
                c.addBinding(M, "v", {
                  min: a.heightRange[0],
                  max: a.heightRange[1],
                  step: a.heightRange[2],
                  label: `Piso ${m + 1}`
                }).on("change", (v) => {
                  ie[w] = v.value, we();
                });
              }
            }
          } catch (d) {
            console.error("Luces Tweakpane error:", d);
          }
          const i = document.createElement("div");
          i.style.cssText = "font-family:monospace;font-size:10px;color:#aaa;padding:6px;background:#1a1a2e;border-radius:4px;margin-top:6px;line-height:1.6;white-space:pre;overflow-x:auto;", u(), s.appendChild(i);
        }
      }
      if (Po(), Se) {
        Se.addBlade({
          view: "separator"
        });
        const s = bn()[A];
        if (s && s.length > 0) {
          const u = {};
          s.forEach((i, d) => {
            u[i.label] = d;
          });
          const a = {
            apoyo: Lt
          };
          Se.addBinding(a, "apoyo", {
            label: "Apoyo",
            options: u
          }).on("change", (i) => {
            Lt = i.value, we();
          });
        }
        if (A === "placa-3q" || A === "placa-q4") {
          const u = {
            teoria: jt
          };
          Se.addBinding(u, "teoria", {
            label: "Teor\xEDa",
            options: {
              Membrana: 1,
              "Kirchhoff (delgada)": 2,
              "Mindlin (gruesa)": 3
            }
          }).on("change", (a) => {
            jt = a.value, we();
          });
        }
      }
      const l = xs()[A];
      if (l && l.length > 0) {
        Zt = new tn({
          title: `Cargas Est\xE1ticas \u2014 ${o}`,
          container: t
        });
        const s = {};
        for (const a of l) s[a.key] = Je[a.key].val;
        for (const a of l) Zt.addBinding(s, a.key, {
          min: Je[a.key].min,
          max: Je[a.key].max,
          step: Je[a.key].step,
          label: Je[a.key].label
        });
        const u = Zt.addFolder({
          title: "Rangos",
          expanded: false
        });
        for (const a of l) {
          const i = {
            min: Je[a.key].min,
            max: Je[a.key].max
          };
          u.addBinding(i, "min", {
            label: `${a.key} min`,
            step: a.step
          }), u.addBinding(i, "max", {
            label: `${a.key} max`,
            step: a.step
          }), u.on("change", () => {
            Je[a.key] && (Je[a.key].min = i.min, Je[a.key].max = i.max, Je[a.key].val < i.min && (Je[a.key].val = i.min), Je[a.key].val > i.max && (Je[a.key].val = i.max)), Kt(), we();
          });
        }
        Zt.on("change", (a) => {
          var _a2;
          const i = (_a2 = a.target) == null ? void 0 : _a2.key;
          if (i && Je[i]) {
            if (Je[i].val = a.value, e.nodeInputs) {
              const d = e.nodeInputs.val;
              d.supports && (e.nodeInputs.val = {
                supports: d.supports
              });
            }
            setTimeout(() => Rn(), 30);
          }
        });
      }
      window.__cad = {
        setParam: (s, u) => {
          if (J[s]) J[s].val = u, we(), Kt();
          else if (Je[s]) {
            if (Je[s].val = u, e.nodeInputs) {
              const a = e.nodeInputs.val;
              a.supports && (e.nodeInputs.val = {
                supports: a.supports
              });
            }
            setTimeout(() => {
              Rn(), Kt();
            }, 30);
          }
        },
        getParams: () => {
          const s = {};
          for (const u in J) s[u] = J[u].val;
          for (const u in Je) s[u] = Je[u].val;
          return s;
        },
        setGenerator: He,
        createCustomPanel: (s, u, a) => Ia(s, u, a),
        removeCustomPanel: (s) => {
          Fs(s);
        }
      };
    }
    const Pn = /* @__PURE__ */ new Map();
    function Ia(t, o, n) {
      var _a2;
      Fs(t);
      let l = document.querySelector("#cad3d-custom-panels");
      if (!l) {
        l = document.createElement("div"), l.id = "cad3d-custom-panels";
        const i = document.querySelector("#parameters");
        i ? (_a2 = i.parentElement) == null ? void 0 : _a2.insertBefore(l, i.nextSibling) : document.body.appendChild(l);
      }
      const s = document.createElement("div");
      s.className = "cad3d-custom-panel", s.style.marginBottom = "4px", l.appendChild(s);
      const u = new tn({
        title: t,
        container: s
      }), a = {};
      for (const [i, d] of Object.entries(o)) {
        const r = d.label || i;
        if (Array.isArray(d.value)) {
          a[i] = d.value;
          const c = {
            [i]: d.value.join(", ")
          };
          u.addBinding(c, i, {
            label: r
          }).on("change", (m) => {
            a[i] = m.value.split(",").map((w) => parseFloat(w.trim())).filter((w) => !isNaN(w)), n && n({
              ...a
            });
          });
        } else if (d.options) {
          a[i] = d.value;
          const c = {
            [i]: d.value
          }, m = {};
          for (const w of d.options) m[w] = w;
          u.addBinding(c, i, {
            label: r,
            options: m
          }).on("change", (w) => {
            a[i] = w.value, n && n({
              ...a
            });
          });
        } else if (typeof d.value == "boolean") {
          a[i] = d.value;
          const c = {
            [i]: d.value
          };
          u.addBinding(c, i, {
            label: r
          }).on("change", (m) => {
            a[i] = m.value, n && n({
              ...a
            });
          });
        } else if (typeof d.value == "string") {
          a[i] = d.value;
          const c = {
            [i]: d.value
          };
          u.addBinding(c, i, {
            label: r
          }).on("change", (m) => {
            a[i] = m.value, n && n({
              ...a
            });
          });
        } else {
          a[i] = d.value;
          const c = {
            [i]: d.value
          }, m = {
            label: r
          };
          d.min !== void 0 && (m.min = d.min), d.max !== void 0 && (m.max = d.max), d.step !== void 0 && (m.step = d.step), u.addBinding(c, i, m).on("change", (w) => {
            a[i] = w.value, n && n({
              ...a
            });
          });
        }
      }
      return n && u.addButton({
        title: "Aplicar"
      }).on("click", () => {
        n({
          ...a
        });
      }), Pn.set(t, {
        pane: u,
        values: a
      }), console.log(`Panel "${t}" created with ${Object.keys(o).length} params`), a;
    }
    function Fs(t) {
      const o = Pn.get(t);
      if (o) {
        try {
          o.pane.dispose();
        } catch {
        }
        Pn.delete(t);
      }
    }
    function za() {
      if (Se) {
        try {
          Se.dispose();
        } catch {
        }
        Se = null;
      }
      if (Zt) {
        try {
          Zt.dispose();
        } catch {
        }
        Zt = null;
      }
      if (bt) {
        try {
          bt.dispose();
        } catch {
        }
        bt = null;
      }
      if (Qt) {
        try {
          Qt.dispose();
        } catch {
        }
        Qt = null;
      }
      const t = document.getElementById("sections");
      t && t.remove();
      const o = document.getElementById("right-panels-wrapper"), n = document.getElementById("parameters");
      o && n && (n.style.cssText = "", document.body.appendChild(n), o.remove()), n && be && (n.innerHTML = be);
    }
    const ve = document.createElement("div");
    ve.id = "cad3d-panel";
    const Ps = document.createElement("style");
    Ps.textContent = `
    /* \u2500\u2500 CSS Custom Properties (Dark = default) \u2500\u2500 */
    :root {
      --fem-bg: rgba(20,20,28,0.97);
      --fem-text: #ccc;
      --fem-border: #555;
      --fem-border-light: #444;
      --fem-border-cell: #333;
      --fem-shadow: rgba(0,0,0,0.6);
      --fem-heading: #0a84ff;
      --fem-section-title: #ee9b00;
      --fem-close: #888;
      --fem-close-hover: #fff;
      --fem-key: #aaa;
      --fem-val: #fff;
      --fem-label: #888;
      --fem-cell-text: #ddd;
      --fem-nonzero: #0f0;
      --fem-header-bg: #222;
      --fem-eq-text: #e8e8ff;
      --fem-eq-var: #7cb3ff;
      --fem-eq-op: #ccc;
      --fem-eq-sub: #aaa;
      --fem-eq-border: #888;
      --fem-eq-dots: #666;
      --fem-eq-box-bg: rgba(255,255,255,0.05);
      --fem-eq-box-border: #444;
      --fem-overlay-bg: rgba(10,10,15,0.97);
      --fem-section-bg: rgba(30,30,50,0.8);
      --fem-coeff-bg: rgba(40,35,20,0.8);
      --fem-numeric-bg: rgba(30,40,30,0.8);
      --fem-step-bg: rgba(255,255,255,0.03);
      --fem-coeff-item-bg: rgba(255,255,255,0.04);
      --fem-btn-bg: #333;
      --fem-btn-hover: #444;
      --fem-btn-text: #0a84ff;
      --fem-btn-hover-text: #fff;
      --fem-frac-border: #999;
      --fem-sym-cell: #aad;
      --fem-sym-nz: #7cb3ff;
      --fem-diag-bg: rgba(255,255,0,0.06);
      --fem-vec-inline: #ccc;
      --fem-full-close-bg: #444;
      --fem-full-close-border: #666;
      /* FEM Studio panel */
      --cad-bg: rgba(30,30,36,0.95);
      --cad-text: #ccc;
      --cad-border: #555;
      --cad-shadow: rgba(0,0,0,0.5);
      --cad-heading: #ee9b00;
      --cad-info: #888;
      --cad-btn-bg: #444;
      --cad-btn-text: #ddd;
      --cad-btn-border: #666;
      --cad-btn-hover-bg: #555;
      --cad-btn-hover-text: #fff;
      --cad-input-bg: #222;
      --cad-input-text: #0f0;
      --cad-input-border: #555;
      --cad-input-placeholder: #666;
      --cad-toggle-text: #888;
      --cad-toggle-hover: #fff;
    }
    /* \u2500\u2500 Light theme overrides \u2500\u2500 */
    :root.hk-light {
      --fem-bg: rgba(250,250,252,0.97);
      --fem-text: #333;
      --fem-border: #bbb;
      --fem-border-light: #ccc;
      --fem-border-cell: #ccc;
      --fem-shadow: rgba(0,0,0,0.15);
      --fem-heading: #0066cc;
      --fem-section-title: #b87800;
      --fem-close: #888;
      --fem-close-hover: #000;
      --fem-key: #666;
      --fem-val: #111;
      --fem-label: #888;
      --fem-cell-text: #333;
      --fem-nonzero: #006600;
      --fem-header-bg: #e8e8e8;
      --fem-eq-text: #222;
      --fem-eq-var: #0055aa;
      --fem-eq-op: #555;
      --fem-eq-sub: #777;
      --fem-eq-border: #999;
      --fem-eq-dots: #aaa;
      --fem-eq-box-bg: rgba(0,0,0,0.03);
      --fem-eq-box-border: #ccc;
      --fem-overlay-bg: rgba(245,245,248,0.97);
      --fem-section-bg: rgba(240,240,250,0.9);
      --fem-coeff-bg: rgba(255,248,230,0.9);
      --fem-numeric-bg: rgba(240,250,240,0.9);
      --fem-step-bg: rgba(0,0,0,0.02);
      --fem-coeff-item-bg: rgba(0,0,0,0.03);
      --fem-btn-bg: #e0e0e0;
      --fem-btn-hover: #ccc;
      --fem-btn-text: #0066cc;
      --fem-btn-hover-text: #000;
      --fem-frac-border: #888;
      --fem-sym-cell: #336;
      --fem-sym-nz: #0055aa;
      --fem-diag-bg: rgba(255,255,0,0.08);
      --fem-vec-inline: #444;
      --fem-full-close-bg: #ddd;
      --fem-full-close-border: #aaa;
      /* FEM Studio panel light */
      --cad-bg: rgba(248,248,250,0.95);
      --cad-text: #333;
      --cad-border: #bbb;
      --cad-shadow: rgba(0,0,0,0.15);
      --cad-heading: #b87800;
      --cad-info: #888;
      --cad-btn-bg: #e0e0e0;
      --cad-btn-text: #333;
      --cad-btn-border: #bbb;
      --cad-btn-hover-bg: #ccc;
      --cad-btn-hover-text: #000;
      --cad-input-bg: #f0f0f0;
      --cad-input-text: #006600;
      --cad-input-border: #bbb;
      --cad-input-placeholder: #aaa;
      --cad-toggle-text: #888;
      --cad-toggle-hover: #000;
    }
    #cad3d-panel {
      position: fixed; bottom: 10px; left: 10px;
      background: var(--cad-bg); color: var(--cad-text);
      border: 1px solid var(--cad-border); border-radius: 6px;
      padding: 12px 14px; font-family: monospace; font-size: 12px;
      z-index: 999999; width: 200px; box-sizing: border-box;
      max-height: calc(100vh - 20px); overflow-y: auto; overflow-x: hidden;
      user-select: none; cursor: move;
      box-shadow: 0 4px 16px var(--cad-shadow); pointer-events: auto;
      height: auto;
    }
    #cad3d-panel::-webkit-scrollbar { width: 6px; }
    #cad3d-panel::-webkit-scrollbar-track { background: transparent; }
    #cad3d-panel::-webkit-scrollbar-thumb { background: var(--cad-border); border-radius: 3px; }
    #cad3d-panel::-webkit-scrollbar-thumb:hover { background: var(--cad-heading); }
    #cad3d-panel h3 { margin: 0 0 6px 0; color: var(--cad-heading); font-size: 13px; cursor: move; display: flex; justify-content: space-between; align-items: center; }
    #cad3d-panel .info-row { display: flex; justify-content: space-between; padding: 2px 0; }
    #cad3d-panel .info-val { color: var(--fem-val); font-weight: bold; }
    #cad3d-panel .btn-row { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
    #cad3d-panel button { background: var(--cad-btn-bg); color: var(--cad-btn-text); border: 1px solid var(--cad-btn-border); border-radius: 3px; padding: 3px 8px; font-family: monospace; font-size: 11px; cursor: pointer; }
    #cad3d-panel button:hover { background: var(--cad-btn-hover-bg); color: var(--cad-btn-hover-text); }
    #cad3d-panel button.active { background: var(--cad-heading); color: #000; border-color: var(--cad-heading); }
    #cad3d-panel button.view-active { background: var(--fem-heading); color: #fff; border-color: var(--fem-heading); }
    #cad3d-panel .cmd-input { width: 100%; box-sizing: border-box; margin-top: 8px; background: var(--cad-input-bg); color: var(--cad-input-text); border: 1px solid var(--cad-input-border); border-radius: 3px; padding: 4px 6px; font-family: monospace; font-size: 11px; cursor: text; }
    #cad3d-panel .cmd-input::placeholder { color: var(--cad-input-placeholder); }
    #cad3d-panel .section-label { color: var(--cad-info); font-size: 10px; margin-top: 8px; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 1px; }
    /* Collapsed: hide everything except the toggle button */
    #cad3d-panel.collapsed { width: auto; padding: 4px 6px; border-radius: 4px; overflow: hidden; }
    #cad3d-panel.collapsed h3 { display: none; }
    #cad3d-panel.collapsed .panel-body { display: none; }
    #cad3d-panel.collapsed .toggle-btn-collapsed { display: inline-block; }
    #cad3d-panel .toggle-btn-collapsed { display: none; background: var(--cad-heading); color: #000; border: none; border-radius: 3px; padding: 3px 8px; font-family: monospace; font-size: 11px; cursor: pointer; font-weight: bold; }
    #cad3d-panel .toggle-btn-collapsed:hover { background: #ffb300; }
    #cad3d-panel .toggle-btn { background: none; border: none; color: var(--cad-toggle-text); cursor: pointer; font-size: 14px; padding: 0; line-height: 1; }
    #cad3d-panel .toggle-btn:hover { color: var(--cad-toggle-hover); }
    /* \u2500\u2500 Mobile: hamburger toggle \u2500\u2500 */
    #mobile-menu-btn {
      display: none;
      position: fixed; top: 10px; left: 10px; z-index: 1000001;
      width: 40px; height: 40px; border-radius: 8px;
      background: rgba(30,30,30,0.9); color: #fff; border: 1px solid #555;
      font-size: 22px; cursor: pointer;
      align-items: center; justify-content: center;
      backdrop-filter: blur(4px);
    }
    /* \u2500\u2500 Mobile portrait: FEM Studio panel \u2500\u2500 */
    @media (max-width: 600px) {
      #mobile-menu-btn { display: flex; }
      #cad3d-panel {
        width: 170px; padding: 8px 10px; font-size: 11px;
        max-height: calc(100vh - 20px); top: 10px; bottom: auto; left: 5px;
        overflow-y: auto;
        display: none;
      }
      #cad3d-panel.mobile-open { display: block; }
      #cad3d-panel button { padding: 2px 5px; font-size: 10px; }
      #cad3d-panel .btn-row { gap: 2px; margin-top: 2px; }
      #cad3d-panel h3 { font-size: 11px; margin-bottom: 4px; }
      #cad3d-panel .cmd-input { font-size: 10px; padding: 3px 4px; margin-top: 4px; }
      #cad3d-panel .section-label { font-size: 9px; margin-top: 4px; }
      #fem-inspect-panel { width: calc(100% - 10px) !important; right: 5px !important; left: 5px !important; top: auto !important; bottom: 5px !important; max-height: 50vh; }
    }
    /* \u2500\u2500 Mobile landscape: short height \u2500\u2500 */
    @media (max-height: 500px) and (orientation: landscape) {
      #cad3d-panel {
        width: 140px; padding: 4px 6px; font-size: 10px;
        max-height: calc(100vh - 10px); bottom: 5px; left: 5px;
        top: 5px; overflow-y: auto;
      }
      #cad3d-panel h3 { font-size: 10px; margin-bottom: 2px; }
      #cad3d-panel button { padding: 1px 4px; font-size: 9px; }
      #cad3d-panel .btn-row { gap: 1px; margin-top: 1px; }
      #cad3d-panel .section-label { font-size: 8px; margin-top: 2px; }
      #cad3d-panel .cmd-input { font-size: 9px; padding: 2px 3px; margin-top: 2px; }
      /* Collapse sections panel on landscape mobile */
      .cad3d-sections-panel { display: none !important; }
      .cad3d-params-panel { display: none !important; }
      /* Make 3D viewer use full width minus CLI panel */
      canvas { position: fixed !important; top: 0 !important; left: 150px !important; width: calc(100vw - 150px) !important; height: 100vh !important; }
    }
    /* \u2500\u2500 Small mobile (< 400px width) \u2500\u2500 */
    @media (max-width: 400px) {
      #cad3d-panel {
        width: 130px; padding: 4px 6px; font-size: 9px;
        max-height: 50vh;
      }
      #cad3d-panel button { padding: 1px 3px; font-size: 8px; min-width: 0; }
    }
    #fem-inspect-panel {
      position: fixed; top: 10px; right: 10px;
      background: var(--fem-bg); color: var(--fem-text);
      border: 1px solid var(--fem-border); border-radius: 8px;
      padding: 14px 16px; font-family: monospace; font-size: 11px;
      z-index: 999999; width: 420px; max-height: calc(100vh - 20px);
      overflow-y: auto; box-shadow: 0 4px 20px var(--fem-shadow);
      pointer-events: auto;
    }
    #fem-inspect-panel h3 { margin: 0 0 8px 0; color: var(--fem-heading); font-size: 14px; display: flex; justify-content: space-between; }
    #fem-inspect-panel .close-btn { background: none; border: none; color: var(--fem-close); cursor: pointer; font-size: 16px; }
    #fem-inspect-panel .close-btn:hover { color: var(--fem-close-hover); }
    #fem-inspect-panel .section { margin-top: 10px; border-top: 1px solid var(--fem-border-light); padding-top: 8px; }
    #fem-inspect-panel .section-title { color: var(--fem-section-title); font-size: 12px; font-weight: bold; margin-bottom: 4px; }
    #fem-inspect-panel .prop-row { display: flex; justify-content: space-between; padding: 1px 0; }
    #fem-inspect-panel .prop-key { color: var(--fem-key); }
    #fem-inspect-panel .prop-val { color: var(--fem-val); font-weight: bold; }
    #fem-inspect-panel .matrix-label { color: var(--fem-label); font-size: 10px; margin-top: 6px; }
    #fem-inspect-panel table { border-collapse: collapse; width: 100%; margin-top: 4px; font-size: 10px; }
    #fem-inspect-panel td { border: 1px solid var(--fem-border-cell); padding: 2px 4px; text-align: right; color: var(--fem-cell-text); white-space: nowrap; }
    #fem-inspect-panel td.nonzero { color: var(--fem-nonzero); }
    #fem-inspect-panel td.header { color: var(--fem-section-title); font-weight: bold; background: var(--fem-header-bg); text-align: center; }
    #fem-inspect-panel .result-val { font-size: 13px; color: var(--fem-nonzero); font-weight: bold; }
    #fem-inspect-panel .dof-labels { color: var(--fem-label); font-size: 9px; }
    button.inspect-active { background: #ff4444 !important; color: #fff !important; border-color: #ff4444 !important; }
    /* Math formula rendering */
    .fem-eq { font-family: 'STIX Two Math','Cambria Math','Times New Roman',serif; font-size: 13px; color: var(--fem-eq-text); line-height: 1.6; margin: 6px 0 8px 0; text-align: center; }
    .fem-eq .var { color: var(--fem-eq-var); font-style: italic; }
    .fem-eq .op { color: var(--fem-eq-op); padding: 0 2px; }
    .fem-eq .frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; margin: 0 2px; }
    .fem-eq .frac-num { border-bottom: 1px solid var(--fem-frac-border); padding: 0 4px 1px; font-size: 11px; }
    .fem-eq .frac-den { padding: 1px 4px 0; font-size: 11px; }
    .fem-eq sub { font-size: 0.75em; vertical-align: sub; color: var(--fem-eq-sub); }
    .fem-eq sup { font-size: 0.75em; vertical-align: super; }
    .fem-eq .mat-sym { display: inline-grid; border-left: 2px solid var(--fem-eq-border); border-right: 2px solid var(--fem-eq-border); padding: 2px 6px; margin: 0 4px; vertical-align: middle; gap: 1px 8px; font-size: 11px; }
    .fem-eq .mat-sym .cell { text-align: center; }
    .fem-eq .mat-sym .dots { color: var(--fem-eq-dots); }
    .fem-eq .highlight { color: var(--fem-nonzero); font-weight: bold; }
    .fem-eq .eq-box { background: var(--fem-eq-box-bg); border: 1px solid var(--fem-eq-box-border); border-radius: 4px; padding: 6px 10px; margin: 4px 0; }
    /* Full matrix overlay */
    .fem-full-overlay { position: fixed; inset: 0; background: var(--fem-overlay-bg); z-index: 9999999; overflow: auto; padding: 20px; }
    .fem-full-overlay .close-full { position: fixed; top: 12px; right: 16px; background: var(--fem-full-close-bg); color: var(--fem-val); border: 1px solid var(--fem-full-close-border); border-radius: 4px; padding: 6px 14px; cursor: pointer; font-size: 13px; z-index: 10000000; }
    .fem-full-overlay .close-full:hover { background: var(--fem-btn-hover); }
    .fem-full-overlay h2 { color: var(--fem-section-title); margin: 0 0 16px 0; font-size: 18px; font-family: monospace; }
    .fem-full-sections { display: flex; flex-direction: column; gap: 20px; }
    .fem-full-sections .full-section { background: var(--fem-section-bg); border: 1px solid var(--fem-border); border-radius: 6px; padding: 16px; overflow-x: auto; }
    .fem-full-sections .full-section.coeff { background: var(--fem-coeff-bg); }
    .fem-full-sections .full-section.numeric { background: var(--fem-numeric-bg); }
    .fem-full-sections .side-title { font-size: 13px; color: var(--fem-label); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    .fem-full-sections table { border-collapse: collapse; font-family: monospace; font-size: 11px; }
    .fem-full-sections td { border: 1px solid var(--fem-border-cell); padding: 3px 6px; text-align: right; color: var(--fem-cell-text); white-space: nowrap; }
    .fem-full-sections td.nz { color: var(--fem-nonzero); }
    .fem-full-sections td.hdr { color: var(--fem-section-title); font-weight: bold; background: var(--fem-header-bg); text-align: center; }
    .fem-full-sections td.diag { background: var(--fem-diag-bg); }
    .fem-full-sections .coeff-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px; }

    /* Report Explained (FEM Solver) overlay */
    .fem-solver-overlay { position: fixed; inset: 0; background: #0d1117; z-index: 9999999; overflow: auto; padding: 20px 30px; color: #c9d1d9; font-family: 'Segoe UI', monospace, sans-serif; font-size: 13px; }
    .fem-solver-overlay h2 { color: #58a6ff; margin: 0 0 12px 0; font-size: 20px; }
    .fem-solver-overlay h3 { color: #f0883e; margin: 16px 0 6px 0; font-size: 15px; cursor: pointer; border-bottom: 1px solid #30363d; padding-bottom: 4px; }
    .fem-solver-overlay h3:hover { color: #ffa657; }
    .fem-solver-overlay h4 { color: #7ee787; margin: 8px 0 4px 0; font-size: 13px; cursor: pointer; }
    .fem-solver-overlay h4:hover { color: #a5f3c0; }
    .fem-rpt-close { position: fixed; top: 12px; right: 20px; background: #21262d; color: #c9d1d9; border: 1px solid #30363d; border-radius: 4px; padding: 6px 14px; cursor: pointer; font-size: 14px; z-index: 10000000; }
    .fem-rpt-close:hover { background: #30363d; }
    .fem-rpt-summary { display: flex; gap: 20px; margin-bottom: 12px; color: #8b949e; font-size: 13px; }
    .fem-rpt-summary b { color: #58a6ff; }
    .fem-rpt-body { margin-left: 8px; }
    .fem-rpt-elem { margin: 4px 0; border-left: 2px solid #21262d; padding-left: 8px; }
    .fem-rpt-elem-body { margin: 4px 0 8px 0; }
    .fem-rpt-props { color: #8b949e; font-size: 11px; margin: 2px 0; }
    .fem-rpt-mtx-title { color: #f78166; font-size: 11px; font-weight: bold; margin: 6px 0 2px 0; }
    .fem-rpt-matrix { border-collapse: collapse; font-family: 'Consolas', monospace; font-size: 10px; }
    .fem-rpt-matrix td { padding: 1px 5px; text-align: right; border: 1px solid #21262d; white-space: nowrap; }
    .fem-rpt-matrix .fem-hdr { color: #58a6ff; font-weight: bold; text-align: center; background: #161b22; font-size: 9px; }
    .fem-full-sections .coeff-item { background: var(--fem-coeff-item-bg); border: 1px solid var(--fem-eq-box-border); border-radius: 4px; padding: 8px 12px; font-family: 'STIX Two Math','Cambria Math','Times New Roman',serif; font-size: 13px; color: var(--fem-eq-text); line-height: 1.6; }
    .fem-full-sections .coeff-item .var { color: var(--fem-eq-var); font-style: italic; }
    .fem-full-sections .coeff-item .frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; margin: 0 2px; }
    .fem-full-sections .coeff-item .frac-num { border-bottom: 1px solid var(--fem-frac-border); padding: 0 4px 1px; font-size: 11px; }
    .fem-full-sections .coeff-item .frac-den { padding: 1px 4px 0; font-size: 11px; }
    .fem-full-sections .coeff-item .highlight { color: var(--fem-nonzero); font-weight: bold; }
    .fem-full-sections .coeff-item sub { font-size: 0.75em; vertical-align: sub; color: var(--fem-eq-sub); }
    .fem-full-sections .coeff-item sup { font-size: 0.75em; vertical-align: super; }
    /* Step-by-step force recovery */
    .fem-step { background: var(--fem-step-bg); border: 1px solid var(--fem-eq-box-border); border-radius: 4px; padding: 8px 12px; margin: 6px 0; font-family: 'STIX Two Math','Cambria Math','Times New Roman',serif; font-size: 12px; color: var(--fem-eq-text); overflow-x: auto; }
    .fem-step .step-title { color: var(--fem-section-title); font-weight: bold; font-size: 11px; margin-bottom: 4px; font-family: monospace; }
    .fem-step .step-eq { margin: 4px 0; }
    .fem-step .var { color: var(--fem-eq-var); font-style: italic; }
    .fem-step .highlight { color: var(--fem-nonzero); font-weight: bold; }
    .fem-step .vec-inline { color: var(--fem-vec-inline); font-family: monospace; font-size: 11px; }
    .fem-step sub { font-size: 0.75em; vertical-align: sub; color: var(--fem-eq-sub); }
    .fem-step .frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; margin: 0 2px; }
    .fem-step .frac-num { border-bottom: 1px solid var(--fem-frac-border); padding: 0 4px 1px; font-size: 10px; }
    .fem-step .frac-den { padding: 1px 4px 0; font-size: 10px; }
    .fem-full-sym { font-family: 'STIX Two Math','Cambria Math','Times New Roman',serif; }
    .fem-full-sym table { font-family: 'STIX Two Math','Cambria Math',serif; font-size: 13px; }
    .fem-full-sym td { border: 1px solid var(--fem-eq-box-border); padding: 4px 8px; text-align: center; color: var(--fem-sym-cell); vertical-align: middle; }
    .fem-full-sym td.nz { color: var(--fem-sym-nz); }
    .fem-full-sym .frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; margin: 0 1px; line-height: 1.2; }
    .fem-full-sym .frac-num { border-bottom: 1px solid var(--fem-eq-border); padding: 0 3px 1px; font-size: 11px; white-space: nowrap; }
    .fem-full-sym .frac-den { padding: 1px 3px 0; font-size: 11px; white-space: nowrap; }
    .fem-full-sym .var { color: var(--fem-sym-nz); font-style: italic; }
    .fem-full-sym sub { font-size: 0.7em; vertical-align: sub; color: var(--fem-eq-sub); }
    .fem-expand-btn { background: var(--fem-btn-bg); color: var(--fem-btn-text); border: 1px solid var(--fem-border); border-radius: 3px; padding: 2px 8px; cursor: pointer; font-size: 10px; margin-left: 8px; }
    .fem-expand-btn:hover { background: var(--fem-btn-hover); color: var(--fem-btn-hover-text); }
  `, document.head.appendChild(Ps), pl() === "light" && document.documentElement.classList.add("hk-light"), fl((t) => {
      t === "light" ? document.documentElement.classList.add("hk-light") : document.documentElement.classList.remove("hk-light"), A && st(true);
    }), ve.innerHTML = `
    <button class="toggle-btn-collapsed" id="cad3d-expand">FEM Studio</button>
    <h3>FEM Studio <span style="font-size:10px;color:var(--cad-info);margin-left:6px" id="cad3d-info">0n 0e</span><button class="toggle-btn" id="cad3d-toggle">_</button></h3>
    <div class="panel-body">
      <div class="btn-row">
        <button data-ex="truss">Cercha</button>
        <button data-ex="beams">Portico</button>
        <button data-ex="3d">Torre</button>
        <button data-ex="galpon">Galpon</button>
        <button data-ex="edificio">Edificio</button>
        <button data-ex="edif-muros">Edif. Muros</button>
        <button data-ex="edif-acero">Edif. Acero</button>
        <button data-ex="edif-acero-diag">Acero+Diag</button>
        <button data-ex="edif-mixto">Edif. Mixto</button>
        <button data-ex="mezanine">Mezanine</button>
        <button data-ex="barra">Barra</button>
        <button data-ex="placa3q">Placa 3Q</button>
        <button data-ex="placa">Placa Q4</button>
      </div>
      <div class="btn-row" style="margin-top:2px">
        <button data-ex="losa-rect">Losa Rect</button>
        <button data-ex="losa-plana">Losa Plana</button>
        <button data-ex="viga-alta">Viga Alta</button>
      </div>
      <div class="btn-row" style="margin-top:2px">
        <button data-ex="muro-contencion">Muro Cont.</button>
        <button data-ex="zapata">Zapata</button>
        <button data-ex="placa-orificios">Placa Base</button>
        <button data-ex="col-placa">Col+Placa 3D</button>
        <button data-ex="talud">Talud</button>
      </div>
      <div class="btn-row" style="margin-top:2px">
        <button data-ex="eiffel">Eiffel</button>
        <button data-ex="arco">Arco</button>
        <button data-ex="puente">Puente</button>
        <button data-ex="twisted">Twist</button>
        <button data-ex="burj">Burj</button>
        <button data-ex="opera">Opera</button>
        <button data-ex="diagrid">Diagrid</button>
        <button data-ex="muro-q4">Muro Q4</button>
        <button data-ex="viga-q4">Viga Q4</button>
        <button data-ex="placa-xy">Placa XY</button>
        <button data-ex="pergola" data-i18n="P\xE9rgola">P\xE9rgola</button>
      </div>
      <div class="btn-row" style="margin-top:4px">
        <button data-view="3d" class="view-active">3D</button>
        <button data-view="plan">Plan</button>
        <button data-view="elevX">EX</button>
        <button data-view="elevY">EY</button>
        <button id="cad3d-select">Select</button>
        <button id="cad3d-draw">Draw</button>
        <button id="cad3d-inspect">Inspect</button>
      </div>
      <div class="btn-row" id="cad3d-axis-buttons" style="margin-top:2px;display:none"></div>
      <div class="btn-row" id="cad3d-floor-buttons" style="margin-top:2px;display:none"></div>
      <div class="btn-row" style="margin-top:2px">
        <button id="cad3d-new-model" title="Nuevo modelo vac\xEDo">\u{1F195} New</button>
        <button id="cad3d-export" title="Exportar coordenadas y datos del modelo">\u{1F4CB} Export</button>
        <select id="cad3d-io-menu" title="Import/Export modelos" style="background:var(--cad-btn-bg);color:var(--cad-btn-text);border:1px solid var(--cad-btn-border);padding:2px 4px;font-size:11px;cursor:pointer;">
          <option value="">\u{1F4C2} I/O</option>
          <option value="import-e2k">\u{1F4E5} Import E2K (ETABS)</option>
          <option value="import-s2k">\u{1F4E5} Import S2K (SAP2000)</option>
          <option value="import-ifc">\u{1F4E5} Import IFC (Revit/ArchiCAD)</option>
          <option value="export-e2k">\u{1F4E4} Export E2K (ETABS)</option>
          <option value="export-s2k">\u{1F4E4} Export S2K (SAP2000)</option>
          <option value="import-py">\u{1F4E5} Import OpenSeesPy</option>
          <option value="export-py">\u{1F4E4} Export OpenSeesPy</option>
          <option value="import-tcl">\u{1F4E5} Import OpenSees Tcl</option>
          <option value="export-tcl">\u{1F4E4} Export OpenSees Tcl</option>
        </select>
        <input type="file" id="cad3d-io-file" accept=".e2k,.E2K,.s2k,.S2K,.py,.tcl,.ifc,.IFC" style="display:none">
        <select id="cad3d-tests-menu" title="Validation tests vs ETABS" style="background:var(--cad-btn-bg);color:var(--cad-btn-text);border:1px solid var(--cad-btn-border);padding:2px 4px;font-size:11px;cursor:pointer;">
          <option value="">\u{1F9EA} Tests</option>
          <option value="test-cantilever">1. Cantilever (Exact)</option>
          <option value="test-portal-1p">2. Portal 1-Story (ETABS)</option>
          <option value="test-portal-2p">3. Portal 2-Story (ETABS)</option>
          <option value="test-wall-only">4. Wall Q4 Only (ETABS)</option>
          <option value="test-portal-wall">5. Portal + Wall (ETABS)</option>
          <option value="test-wilson-beam">6. Wilson Cantilever Q4 (incomp.)</option>
          <!-- Scordelis-Lo requires MITC4 for curved shells - not yet implemented -->
          <option value="test-all">\u25B6 Run All Tests</option>
        </select>
        <select id="cad3d-force-unit" title="Unidad de fuerza" style="background:var(--cad-btn-bg);color:var(--cad-btn-text);border:1px solid var(--cad-btn-border);padding:2px 4px;font-size:11px;cursor:pointer;">
          <option value="tonf">tonf</option><option value="kN">kN</option><option value="kgf">kgf</option>
          <option value="kip">kip</option><option value="lb">lb</option><option value="N">N</option>
        </select>
        <select id="cad3d-length-unit" title="Unidad de longitud" style="background:var(--cad-btn-bg);color:var(--cad-btn-text);border:1px solid var(--cad-btn-border);padding:2px 4px;font-size:11px;cursor:pointer;">
          <option value="m">m</option><option value="cm">cm</option><option value="mm">mm</option>
          <option value="ft">ft</option><option value="in">in</option>
        </select>
        <button id="cad3d-btn-clear" style="margin-left:auto">Clear</button>
      </div>
      <div class="btn-row" style="margin-top:2px">
        <button data-preset="MKS" class="active" title="tonf+m, esfuerzos kgf/cm\xB2">MKS</button>
        <button data-preset="SI" title="kN+m, esfuerzos kPa">SI</button>
        <button data-preset="US" title="kip+in, esfuerzos ksi">US</button>
      </div>
      <div class="btn-row" style="margin-top:4px">
        <button id="cad3d-modal" title="An\xE1lisis modal (frecuencias y modos)">\u26A1 Modal</button>
        <button id="cad3d-mode-prev" style="display:none" title="Modo anterior">\u25C0</button>
        <button id="cad3d-mode-next" style="display:none" title="Modo siguiente">\u25B6</button>
        <input id="cad3d-modal-scale" type="number" min="0.1" max="100" step="0.5" value="3.7" style="display:none;width:40px;font-size:10px;padding:1px 3px;background:var(--cad-bg);color:var(--cad-heading);border:1px solid var(--cad-border);border-radius:3px;text-align:center" title="Escala de animacion (% de la diagonal; 3.7 = SAP2000 Automatic)" />
      </div>
      <div id="cad3d-mode-label" style="display:none;color:var(--cad-heading);font-size:10px;line-height:16px;padding:2px 4px;white-space:nowrap;overflow-x:auto">Modo 1</div>
      <div class="btn-row" style="margin-top:2px">
        <button id="cad3d-nonlinear" title="An\xE1lisis no-lineal din\xE1mico (BRB + sismo)">\u{1F525} Nonlinear</button>
        <button id="cad3d-pushover" title="Pushover c\xEDclico con hist\xE9resis">\u{1F4CA} Pushover</button>
        <button id="cad3d-fem-solver" title="Report Explained: derivaci\xF3n FEM paso a paso de todos los elementos">\u{1F4D0} Report Explained</button>
        <button id="cad3d-calc" title="Calculadora FEM: editor MATLAB + output KaTeX">\u{1F9EE} C\xE1lculo</button>
        <button id="cad3d-log" title="Ver log del solver">\u{1F4CB} Log</button>
      </div>
      <div class="btn-row" style="margin-top:2px">
        <button id="cad3d-cli-toggle" title="Abrir/cerrar consola CLI">\u2328 CLI</button>
      </div>
      <div id="cad3d-cli-panel" style="display:none;margin-top:2px;background:rgba(0,0,0,0.8);border:1px solid #444;border-radius:4px;padding:4px;max-height:200px;overflow-y:auto">
        <div id="cad3d-cli-output" style="font-family:monospace;font-size:10px;color:#0f0;white-space:pre-wrap;max-height:140px;overflow-y:auto;margin-bottom:4px"></div>
        <input class="cmd-input" id="cad3d-cmd" placeholder="cad.addNode(0,0,0) | cad.building([5,5],[4],3) | cad.info()" style="width:100%;font-family:monospace" />
      </div>
    </div>
  `;
    let gt = null;
    function La() {
      var _a2, _b, _c, _d, _e, _f;
      const t = e.nodes.val, o = e.elements.val, n = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val, l = (_b = e.elementInputs) == null ? void 0 : _b.val, s = N, u = y, a = [];
      if (a.push("# Hekatan Struct \u2014 Model Export"), a.push(`# Generator: ${A || "custom"}`), a.push(`# Units: ${u}, ${s}`), a.push(`# ${(/* @__PURE__ */ new Date()).toISOString()}`), a.push(""), a.push(`## NODES (${t.length})`), a.push("# idx     X          Y          Z"), t.forEach((r, c) => {
        a.push(`  ${String(c).padStart(4)}  ${r[0].toFixed(4).padStart(10)}  ${r[1].toFixed(4).padStart(10)}  ${r[2].toFixed(4).padStart(10)}`);
      }), a.push(""), a.push(`## ELEMENTS (${o.length})`), a.push("# idx    nodeI  nodeJ"), o.forEach((r, c) => {
        const m = r.map((w) => String(w).padStart(6)).join("");
        a.push(`  ${String(c).padStart(4)}  ${m}`);
      }), a.push(""), (n == null ? void 0 : n.supports) && n.supports.size > 0 && (a.push(`## SUPPORTS (${n.supports.size})`), a.push("# node   Ux  Uy  Uz  Rx  Ry  Rz"), n.supports.forEach((r, c) => {
        const m = r.map((w) => w ? "  1" : "  0").join("");
        a.push(`  ${String(c).padStart(4)} ${m}`);
      }), a.push("")), (n == null ? void 0 : n.loads) && n.loads.size > 0 && (a.push(`## LOADS (${n.loads.size})`), a.push("# node         Fx          Fy          Fz          Mx          My          Mz"), n.loads.forEach((r, c) => {
        const m = r.map((w) => w.toFixed(3).padStart(11)).join(" ");
        a.push(`  ${String(c).padStart(4)}  ${m}`);
      }), a.push("")), l) {
        a.push("## ELEMENT PROPERTIES");
        const r = [
          {
            name: "E",
            map: l.elasticities
          },
          {
            name: "A",
            map: l.areas
          },
          {
            name: "Iz",
            map: l.momentsOfInertiaZ
          },
          {
            name: "Iy",
            map: l.momentsOfInertiaY
          },
          {
            name: "G",
            map: l.shearModuli
          },
          {
            name: "J",
            map: l.torsionalConstants
          },
          {
            name: "rho",
            map: l.densities
          }
        ], c = "# elem  " + r.map((m) => m.name.padStart(12)).join(" ");
        a.push(c);
        for (let m = 0; m < o.length; m++) {
          const w = r.map((M) => {
            var _a3;
            const v = (_a3 = M.map) == null ? void 0 : _a3.get(m);
            return v !== void 0 ? v.toExponential(4).padStart(12) : "           -";
          }).join(" ");
          a.push(`  ${String(m).padStart(4)}  ${w}`);
        }
        a.push("");
      }
      const i = (_d = (_c = e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
      i && i.size > 0 && (a.push(`## DISPLACEMENTS (${i.size} nodes)`), a.push("# node          Ux           Uy           Uz           Rx           Ry           Rz"), i.forEach((r, c) => {
        const m = r.map((w) => w.toExponential(4).padStart(12)).join(" ");
        a.push(`  ${String(c).padStart(4)}  ${m}`);
      }), a.push(""));
      const d = (_f = (_e = e.deformOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.reactions;
      if (d && d.size > 0 && (a.push(`## REACTIONS (${d.size} supports)`), a.push("# node          Rx           Ry           Rz           Mx           My           Mz"), d.forEach((r, c) => {
        const m = r.map((w) => w.toFixed(4).padStart(12)).join(" ");
        a.push(`  ${String(c).padStart(4)}  ${m}`);
      }), a.push("")), A) {
        a.push("## CLI COMMAND");
        const r = Object.entries(J).map(([c, m]) => `${c}=${m.val}`).join(" ");
        a.push(`cad.${A === "edificio" ? "building" : A}(${r})`);
      }
      return a.join(`
`);
    }
    let Xo = false;
    function Ta() {
      var _a2, _b, _c, _d;
      if (gt) {
        gt.remove(), gt = null, Xo = false;
        return;
      }
      const t = La();
      gt = document.createElement("div"), gt.id = "export-overlay", gt.style.cssText = `
      position:fixed; bottom:10px; right:10px; z-index:10000;
      width:720px; max-width:90vw;
      display:flex; flex-direction:column;
      font-family:monospace; color:var(--cad-text,#ccc);
      background:var(--cad-bg,#1a1a2e); border:1px solid var(--cad-border,#333);
      border-radius:8px; box-shadow:0 4px 20px rgba(0,0,0,0.5);
      transition: height 0.2s ease;
    `, gt.innerHTML = `
      <div id="export-header" style="display:flex; align-items:center; justify-content:space-between;
        padding:8px 12px; border-bottom:1px solid var(--cad-border,#333); cursor:default;
        border-radius:8px 8px 0 0; background:var(--cad-bg,#1a1a2e);">
        <span style="font-size:12px; font-weight:bold; color:var(--cad-heading,#e0e0e0);">
          \u{1F4CB} Export \u2014 ${e.nodes.val.length}n ${e.elements.val.length}e
        </span>
        <div style="display:flex; gap:4px;">
          <button id="export-copy" style="padding:3px 8px; font-size:11px; cursor:pointer;
            background:#2d6a4f; color:#fff; border:1px solid #40916c; border-radius:3px;" title="Copiar al clipboard">
            \u{1F4CB} Copy
          </button>
          <button id="export-json" style="padding:3px 8px; font-size:11px; cursor:pointer;
            background:#1d3557; color:#fff; border:1px solid #457b9d; border-radius:3px;" title="Formato JSON">
            {} JSON
          </button>
          <button id="export-minimize" style="padding:3px 8px; font-size:11px; cursor:pointer;
            background:#555; color:#fff; border:1px solid #777; border-radius:3px;" title="Minimizar / Restaurar">
            \u25AC
          </button>
          <button id="export-close" style="padding:3px 8px; font-size:11px; cursor:pointer;
            background:#6c757d; color:#fff; border:1px solid #888; border-radius:3px;" title="Cerrar">
            \u2715
          </button>
        </div>
      </div>
      <div id="export-body" style="display:flex; flex-direction:column; padding:8px 12px;">
        <textarea id="export-text" readonly style="height:350px; resize:vertical;
          font-family:'Cascadia Code','Fira Code',monospace; font-size:11px; line-height:1.4;
          background:#0d1117; color:#c9d1d9; border:1px solid #30363d; border-radius:4px;
          padding:10px; white-space:pre; overflow:auto; tab-size:8;"
        >${t.replace(/</g, "&lt;")}</textarea>
        <div id="export-status" style="font-size:11px; color:#40916c; margin-top:4px; height:14px;"></div>
      </div>
    `, document.body.appendChild(gt), (_a2 = gt.querySelector("#export-close")) == null ? void 0 : _a2.addEventListener("click", () => {
        gt == null ? void 0 : gt.remove(), gt = null, Xo = false;
      }), (_b = gt.querySelector("#export-minimize")) == null ? void 0 : _b.addEventListener("click", () => {
        const o = gt.querySelector("#export-body"), n = gt.querySelector("#export-minimize");
        Xo = !Xo, Xo ? (o.style.display = "none", n.textContent = "\u25A2", n.title = "Restaurar", gt.style.width = "auto") : (o.style.display = "flex", n.textContent = "\u25AC", n.title = "Minimizar", gt.style.width = "720px");
      }), (_c = gt.querySelector("#export-copy")) == null ? void 0 : _c.addEventListener("click", () => {
        const o = gt.querySelector("#export-text");
        navigator.clipboard.writeText(o.value).then(() => {
          const n = gt.querySelector("#export-status");
          n.textContent = "\u2713 Copiado al clipboard", setTimeout(() => n.textContent = "", 2e3);
        });
      }), (_d = gt.querySelector("#export-json")) == null ? void 0 : _d.addEventListener("click", () => {
        var _a3, _b2, _c2, _d2, _e, _f;
        const o = e.nodes.val, n = e.elements.val, l = (_a3 = e.nodeInputs) == null ? void 0 : _a3.val, s = (_b2 = e.elementInputs) == null ? void 0 : _b2.val, u = {
          generator: A || "custom",
          units: {
            force: y,
            length: N
          },
          nodes: o.map((c, m) => ({
            id: m,
            x: c[0],
            y: c[1],
            z: c[2]
          })),
          elements: n.map((c, m) => ({
            id: m,
            nodes: c
          }))
        };
        (l == null ? void 0 : l.supports) && (u.supports = [], l.supports.forEach((c, m) => u.supports.push({
          node: m,
          dofs: c
        }))), (l == null ? void 0 : l.loads) && (u.loads = [], l.loads.forEach((c, m) => u.loads.push({
          node: m,
          forces: c
        }))), s && (u.properties = {}, s.elasticities && (u.properties.E = Object.fromEntries(s.elasticities)), s.areas && (u.properties.A = Object.fromEntries(s.areas)), s.momentsOfInertiaZ && (u.properties.Iz = Object.fromEntries(s.momentsOfInertiaZ)), s.momentsOfInertiaY && (u.properties.Iy = Object.fromEntries(s.momentsOfInertiaY)), s.shearModuli && (u.properties.G = Object.fromEntries(s.shearModuli)), s.torsionalConstants && (u.properties.J = Object.fromEntries(s.torsionalConstants)));
        const a = (_d2 = (_c2 = e.deformOutputs) == null ? void 0 : _c2.val) == null ? void 0 : _d2.deformations;
        a && a.size > 0 && (u.displacements = {}, a.forEach((c, m) => u.displacements[m] = c));
        const i = (_f = (_e = e.deformOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.reactions;
        i && i.size > 0 && (u.reactions = {}, i.forEach((c, m) => u.reactions[m] = c));
        const d = gt.querySelector("#export-text");
        d.value = JSON.stringify(u, null, 2);
        const r = gt.querySelector("#export-status");
        r.textContent = "Formato JSON activo \u2014 presiona Copy para copiar";
      });
    }
    function Ne() {
      var _a2, _b, _c;
      const t = ve.querySelector("#cad3d-info");
      if (t) {
        const o = e.nodes.val.length, n = e.elements.val, l = n.length, s = ((_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.supports) == null ? void 0 : _c.size) || 0;
        let u = 0, a = 0, i = 0;
        for (const r of n) r.length === 2 ? u++ : r.length === 3 ? a++ : r.length === 4 && i++;
        let d = `${o}n ${l}e ${s}s`;
        (i > 0 || a > 0) && (d += ` | ${u}fr`, i > 0 && (d += ` ${i}q4`), a > 0 && (d += ` ${a}tri`)), t.textContent = d;
      }
    }
    function qn() {
      var _a2;
      if (!Wt || !e.nodeInputs || !e.elementInputs) return;
      const t = e.nodes.val, o = e.elements.val, n = e.nodeInputs.val, l = e.elementInputs.val;
      if (!(t.length === 0 || o.length === 0) && !(!n.supports || n.supports.size === 0) && !(!l.densities || l.densities.size === 0)) try {
        const s = Math.min(12, t.length * 6 - n.supports.size * 6);
        if (s <= 0) return;
        const u = Za(t, o, n, l, Math.min(s, 12));
        if (u.frequencies && u.frequencies.length > 0) {
          ft = u, ao = t.map((r) => [
            ...r
          ]), Mt = 0;
          const { extent: a } = $o(), i = (_a2 = u.modeShapes) == null ? void 0 : _a2[0];
          if (i) {
            let r = 0;
            for (let c = 0; c < t.length; c++) {
              const m = i[c * 6] || 0, w = i[c * 6 + 1] || 0, M = i[c * 6 + 2] || 0;
              r = Math.max(r, Math.sqrt(m * m + w * w + M * M));
            }
            an = r > 1e-12 ? a * 0.05 / r : 1;
          }
          const d = `${A} \u2014 ${t.length}n ${o.length}e`;
          Yo.render(u, {
            title: d
          }), Yo.div.style.display = "", Ko(), console.log(`Modal: ${u.frequencies.length} modos. f\u2081 = ${u.frequencies[0].toFixed(4)} Hz`);
        }
      } catch (s) {
        console.warn("Modal analysis failed:", s.message), ft = null;
      }
    }
    function _n() {
      co && (cancelAnimationFrame(co), co = 0), ao.length > 0 && (e.nodes.val = ao.map((t) => [
        ...t
      ])), Yo.div.style.display = "none", ft = null;
    }
    function Ko() {
      var _a2;
      if (co && cancelAnimationFrame(co), !(ft == null ? void 0 : ft.modeShapes) || !ao.length) return;
      const t = ft.modeShapes[Mt];
      if (!t) return;
      const o = ((_a2 = ft.frequencies) == null ? void 0 : _a2[Mt]) || 1, n = Math.max(0.5, Math.min(3, o * 0.1)), l = performance.now(), s = ao.length, u = e.elements.rawVal, a = ml(e.nodes.val), i = ve.querySelector("#cad3d-modal-scale"), d = i ? parseFloat(i.value) || ca : ca;
      let r = 0;
      for (let $ = 0; $ < s; $++) {
        const C = t[$ * 6] || 0, R = t[$ * 6 + 1] || 0, g = t[$ * 6 + 2] || 0;
        r = Math.max(r, Math.sqrt(C * C + R * R + g * g));
      }
      const c = r > 1e-12 ? a * d / 100 / r : 1, m = De();
      if (!m) return;
      let w = null, M = null, v = null;
      m.scene.traverse(($) => {
        var _a3, _b;
        !w && $.isPoints && $.geometry && (w = $), !M && $.isLineSegments && $.geometry && !$.name && (M = $), !v && $.isMesh && ((_a3 = $.material) == null ? void 0 : _a3.transparent) && ((_b = $.material) == null ? void 0 : _b.opacity) < 0.5 && $.geometry && (v = $);
      });
      const p = new Float32Array(s * 3), b = [];
      for (const $ of u) if ($.length === 2) b.push([
        $[0],
        $[1]
      ]);
      else for (let C = 0; C < $.length; C++) b.push([
        $[C],
        $[(C + 1) % $.length]
      ]);
      const I = new Float32Array(b.length * 6);
      function E() {
        const $ = (performance.now() - l) / 1e3, C = Math.sin(2 * Math.PI * n * $) * c;
        for (let R = 0; R < s; R++) {
          const g = ao[R];
          p[R * 3] = g[0] + (t[R * 6] || 0) * C, p[R * 3 + 1] = g[1] + (t[R * 6 + 1] || 0) * C, p[R * 3 + 2] = g[2] + (t[R * 6 + 2] || 0) * C;
        }
        if (w) {
          const R = w.geometry, g = R.getAttribute("position");
          g && g.array.length === p.length ? (g.array.set(p), g.needsUpdate = true) : R.setAttribute("position", new ko(p.slice(), 3));
        }
        if (M) {
          for (let f = 0; f < b.length; f++) {
            const [k, F] = b[f];
            I[f * 6] = p[k * 3], I[f * 6 + 1] = p[k * 3 + 1], I[f * 6 + 2] = p[k * 3 + 2], I[f * 6 + 3] = p[F * 3], I[f * 6 + 4] = p[F * 3 + 1], I[f * 6 + 5] = p[F * 3 + 2];
          }
          const R = M.geometry, g = R.getAttribute("position");
          g && g.array.length === I.length ? (g.array.set(I), g.needsUpdate = true) : R.setAttribute("position", new ko(I.slice(), 3));
        }
        if (v) {
          const R = [];
          for (const g of u) if (g.length === 3) {
            const [f, k, F] = g;
            R.push(p[f * 3], p[f * 3 + 1], p[f * 3 + 2]), R.push(p[k * 3], p[k * 3 + 1], p[k * 3 + 2]), R.push(p[F * 3], p[F * 3 + 1], p[F * 3 + 2]);
          } else if (g.length === 4) {
            const [f, k, F, q] = g;
            R.push(p[f * 3], p[f * 3 + 1], p[f * 3 + 2]), R.push(p[k * 3], p[k * 3 + 1], p[k * 3 + 2]), R.push(p[F * 3], p[F * 3 + 1], p[F * 3 + 2]), R.push(p[f * 3], p[f * 3 + 1], p[f * 3 + 2]), R.push(p[F * 3], p[F * 3 + 1], p[F * 3 + 2]), R.push(p[q * 3], p[q * 3 + 1], p[q * 3 + 2]);
          }
          if (R.length > 0) {
            const g = v.geometry, f = new Float32Array(R), k = g.getAttribute("position");
            k && k.array.length === f.length ? (k.array.set(f), k.needsUpdate = true) : g.setAttribute("position", new ko(f, 3));
          }
        }
        m.render(), co = requestAnimationFrame(E);
      }
      co = requestAnimationFrame(E);
    }
    function Rn() {
      var _a2, _b, _c, _d, _e;
      if (!e.deformOutputs || !e.analyzeOutputs || !e.nodeInputs || !e.elementInputs) return;
      const t = e.nodes.val, o = e.elements.val;
      let n = e.nodeInputs.val;
      const l = e.elementInputs.val;
      if (t.length === 0 || o.length === 0 || !n.supports || n.supports.size === 0) return;
      if (!n.loads || n.loads.size === 0) {
        const v = te("CM") ?? 0, p = te("CV") ?? 0, b = v + p, I = te("Ex") ?? 0, E = te("Ey") ?? 0;
        if (b === 0 && I === 0 && E === 0) return;
        const $ = /* @__PURE__ */ new Map(), C = [];
        for (let S = 0; S < t.length; S++) n.supports.has(S) || C.push(S);
        const R = (S) => Math.round(S * 1e3) / 1e3, g = /* @__PURE__ */ new Set();
        n.supports.forEach((S, x) => {
          g.add(`${R(t[x][0])},${R(t[x][1])}`);
        });
        const f = /* @__PURE__ */ new Set();
        for (const S of C) g.has(`${R(t[S][0])},${R(t[S][1])}`) && f.add(S);
        const k = /* @__PURE__ */ new Set(), F = /* @__PURE__ */ new Set();
        if (I !== 0 || E !== 0) {
          let S = -1 / 0, x = -1 / 0;
          for (const O of f) S = Math.max(S, R(t[O][0])), x = Math.max(x, R(t[O][1]));
          const z = /* @__PURE__ */ new Map();
          for (const O of f) {
            const B = R(t[O][2]);
            z.has(B) || z.set(B, []), z.get(B).push(O);
          }
          z.forEach((O) => {
            if (I !== 0) {
              const B = /* @__PURE__ */ new Set();
              for (const G of O) if (R(t[G][0]) === S) {
                const j = R(t[G][1]);
                B.has(j) || (B.add(j), k.add(G));
              }
            }
            if (E !== 0) {
              const B = /* @__PURE__ */ new Set();
              for (const G of O) if (R(t[G][1]) === x) {
                const j = R(t[G][0]);
                B.has(j) || (B.add(j), F.add(G));
              }
            }
          });
        }
        const q = 9.81, H = /* @__PURE__ */ new Map();
        for (let S = 0; S < o.length; S++) {
          const x = o[S], z = ((_a2 = l.densities) == null ? void 0 : _a2.get(S)) ?? 0;
          if (!(Math.abs(z) < 1e-15)) {
            if (x.length === 2) {
              const O = ((_b = l.areas) == null ? void 0 : _b.get(S)) ?? 0, B = t[x[0]], G = t[x[1]], j = Math.sqrt((G[0] - B[0]) ** 2 + (G[1] - B[1]) ** 2 + (G[2] - B[2]) ** 2), X = -(z * O * j * q) / 2;
              H.set(x[0], (H.get(x[0]) ?? 0) + X), H.set(x[1], (H.get(x[1]) ?? 0) + X);
            } else if (x.length >= 3) {
              const O = ((_c = l.thicknesses) == null ? void 0 : _c.get(S)) ?? 0;
              let B = 0;
              if (x.length === 3) {
                const [D, X, ee] = x.map((de) => t[de]);
                B = 0.5 * Math.abs((X[0] - D[0]) * (ee[1] - D[1]) - (ee[0] - D[0]) * (X[1] - D[1]));
              } else if (x.length === 4) {
                const [D, X, ee, de] = x.map((me) => t[me]);
                if (B = 0.5 * Math.abs((X[0] - D[0]) * (ee[1] - D[1]) - (ee[0] - D[0]) * (X[1] - D[1])) + 0.5 * Math.abs((ee[0] - D[0]) * (de[1] - D[1]) - (de[0] - D[0]) * (ee[1] - D[1])), B < 1e-10) {
                  const me = [
                    X[0] - D[0],
                    X[1] - D[1],
                    X[2] - D[2]
                  ], _ = [
                    de[0] - D[0],
                    de[1] - D[1],
                    de[2] - D[2]
                  ], se = [
                    me[1] * _[2] - me[2] * _[1],
                    me[2] * _[0] - me[0] * _[2],
                    me[0] * _[1] - me[1] * _[0]
                  ];
                  B = Math.sqrt(se[0] ** 2 + se[1] ** 2 + se[2] ** 2);
                }
              }
              const j = -(z * O * B * q) / x.length;
              for (const D of x) H.set(D, (H.get(D) ?? 0) + j);
            }
          }
        }
        const h = /* @__PURE__ */ new Set();
        for (const S of o) S.length === 2 && (h.add(S[0]), h.add(S[1]));
        for (const S of C) {
          const x = k.has(S) ? I : 0, z = F.has(S) ? E : 0, O = H.get(S) ?? 0, B = h.has(S) ? b : 0, G = O + B;
          (x !== 0 || z !== 0 || Math.abs(G) > 1e-10) && $.set(S, [
            x,
            z,
            G,
            0,
            0,
            0
          ]);
        }
        n = {
          ...n,
          loads: $
        }, e.nodeInputs.val = n;
      }
      const s = performance.now();
      let u = 0, a = 0, i = 0;
      for (const v of o) v.length === 2 ? u++ : v.length === 3 ? i++ : v.length === 4 && a++;
      const d = ((_d = n.supports) == null ? void 0 : _d.size) || 0, r = ((_e = n.loads) == null ? void 0 : _e.size) || 0, c = t.length * 6, m = c - d * 6, w = [], M = (v) => w.push(v);
      M('<b style="color:var(--cad-heading)">FEM Solver</b>'), M(`<span style="color:var(--cad-info)">Modelo:</span> ${t.length} nodos, ${o.length} elem`), u && M(`&nbsp;&nbsp;Frames: <b>${u}</b>`), a && M(`&nbsp;&nbsp;Shell Q4: <b>${a}</b>`), i && M(`&nbsp;&nbsp;Triangulos: <b>${i}</b>`), M(`&nbsp;&nbsp;Apoyos: ${d} &nbsp;|&nbsp; Cargas: ${r}`), M(`<span style="color:var(--cad-info)">DOFs:</span> ${c} total, ~${m} libres`), M('<hr style="border-color:var(--cad-border);margin:4px 0">'), M(`<span style="color:#888">1.</span> Ensamblaje <b>K</b> global (${c}&times;${c})`), M("&nbsp;&nbsp;&nbsp;<i>K<sub>global</sub> = &Sigma; T<sup>T</sup> &middot; K<sub>local</sub> &middot; T</i>");
      try {
        const v = pt(t, o, n, l), p = performance.now() - s;
        if (v) {
          e.deformOutputs.val = v, M(`<span style="color:#888">2.</span> <b>K &middot; u = F</b> &rarr; SparseLU &rarr; <span style="color:#00cc88">${p.toFixed(0)} ms</span>`);
          let b = 0, I = -1, E = 0, $ = 0;
          v.deformations && v.deformations.forEach((k, F) => {
            const q = Math.sqrt(k[0] * k[0] + k[1] * k[1] + k[2] * k[2]);
            q > b && (b = q, I = F, E = k[0], $ = k[2]);
          }), M('<span style="color:#888">3.</span> Desplazamientos:'), M(`&nbsp;&nbsp;&nbsp;max|<b>u</b>| = <b style="color:var(--cad-heading)">${b.toExponential(3)}</b> m <span style="color:#666">(nodo ${I})</span>`), M(`&nbsp;&nbsp;&nbsp;u<sub>x</sub> = ${(E * 1e3).toFixed(4)} mm &nbsp;|&nbsp; u<sub>z</sub> = ${($ * 1e3).toFixed(4)} mm`);
          const C = performance.now(), R = so(t, o, l, v), g = performance.now() - C;
          R && (e.analyzeOutputs.val = R, M(`<span style="color:#888">4.</span> Fuerzas internas: <span style="color:#00cc88">${g.toFixed(0)} ms</span>`), M("&nbsp;&nbsp;&nbsp;<i>F<sub>int</sub> = K<sub>local</sub> &middot; T &middot; u</i>"));
          const f = performance.now() - s;
          M('<hr style="border-color:var(--cad-border);margin:4px 0">'), M(`<b style="color:#00cc88">&#10004; Completado: ${f.toFixed(0)} ms</b>`);
        }
      } catch (v) {
        const p = performance.now() - s;
        M(`<b style="color:#ff4444">&#10008; Error (${p.toFixed(0)} ms): ${v.message}</b>`);
      }
      window.__femLog = w, console.log(`FEM Solver: ${t.length}n ${o.length}e \u2192 ${(performance.now() - s).toFixed(0)}ms`), Wt && setTimeout(() => qn(), 50);
    }
    function fo() {
      if (!e.elementInputs) return;
      const t = e.elements.val, o = L, n = {
        elasticities: /* @__PURE__ */ new Map(),
        shearModuli: /* @__PURE__ */ new Map(),
        areas: /* @__PURE__ */ new Map(),
        momentsOfInertiaY: /* @__PURE__ */ new Map(),
        momentsOfInertiaZ: /* @__PURE__ */ new Map(),
        torsionalConstants: /* @__PURE__ */ new Map(),
        densities: /* @__PURE__ */ new Map(),
        sectionShapes: /* @__PURE__ */ new Map(),
        thicknesses: /* @__PURE__ */ new Map(),
        poissonsRatios: /* @__PURE__ */ new Map()
      };
      if ((A === "edificio" || A === "frame") && he.size > 0) {
        const { colMat: s, vigaMat: u, colShape: a, fc: i, perFloor: d } = ke, r = ss(i / 1e3), c = r / (2 * 1.2), m = 24 / 9.80665, w = o.E, M = o.G, v = o.rho;
        for (let p = 0; p < t.length; p++) {
          if (Te.has(p)) {
            const x = ss(i / 1e3), z = 0.2;
            n.elasticities.set(p, x), n.poissonsRatios.set(p, z), n.thicknesses.set(p, Ge), n.shearModuli.set(p, x / (2 * (1 + z))), n.densities.set(p, 24 / 9.80665);
            continue;
          }
          if (vo.has(p)) {
            const x = ss(i / 1e3), z = 0.2;
            n.elasticities.set(p, x), n.poissonsRatios.set(p, z), n.thicknesses.set(p, Nt), n.shearModuli.set(p, x / (2 * (1 + z))), n.densities.set(p, 24 / 9.80665);
            continue;
          }
          const b = he.has(p), I = Ce.get(p) ?? 0, E = d[I] ?? d[0] ?? {
            bCol: 0.4,
            hCol: 0.4,
            dCol: 0.4
          };
          let $, C, R, g;
          if (b) if (s === 0) C = r, R = c, g = m, $ = a === 1 ? da(E.dCol) : ts(E.bCol, E.hCol), n.sectionShapes.set(p, a === 1 ? {
            type: "circ",
            d: E.dCol
          } : {
            type: "rect",
            b: E.bCol,
            h: E.hCol
          });
          else if (s === 1) {
            C = w, R = M, g = v;
            const x = ke.steelColType;
            if (x <= 1) {
              const z = xo[E.colProfileIdx] ?? xo[0];
              $ = {
                A: z.A,
                Iz: z.Iz,
                Iy: z.Iy,
                J: z.J
              }, n.sectionShapes.set(p, {
                type: "I",
                b: z.bf,
                h: z.d,
                name: z.name
              });
            } else if (x === 2) {
              const z = E.colBf ?? 0.3, O = E.colHf ?? 0.3, B = E.colTf ?? 0.02, G = E.colTw ?? 0.012;
              $ = os(z, O, B, G);
              const j = `I${(O * 100).toFixed(0)}x${(z * 100).toFixed(0)}`;
              n.sectionShapes.set(p, {
                type: "I",
                b: z,
                h: O,
                tf: B,
                tw: G,
                name: j
              });
            } else {
              const z = E.colBc ?? 0.3, O = E.colHc ?? 0.3, B = E.colT ?? 0.01;
              $ = ns(z, O, B);
              const G = `\u25A1${(O * 100).toFixed(0)}x${(z * 100).toFixed(0)}x${(B * 1e3).toFixed(0)}`;
              n.sectionShapes.set(p, {
                type: "HSS",
                b: z,
                h: O,
                tw: B,
                name: G
              });
            }
          } else {
            const x = E.colBc ?? 0.3, z = E.colHc ?? 0.3, O = E.colT ?? 0.01, B = E.colFc ?? 28e3, G = E.colEs ?? 2e8, j = E.colNuS ?? 0.3, D = E.colNuC ?? 0.2, X = $l(x, z, O, G, j, B, D);
            $ = {
              A: X.A,
              Iz: X.Iz,
              Iy: X.Iy,
              J: X.J
            }, C = X.Es, R = X.Gs;
            const ee = 7.85, de = 24 / 9.80665;
            g = (ee * X.A_steel + de * X.A_conc) / (X.A_steel + X.A_conc);
            const me = `CFT ${(z * 1e3).toFixed(0)}X${(x * 1e3).toFixed(0)}X${(O * 1e3).toFixed(0)}`;
            n.sectionShapes.set(p, {
              type: "CFT",
              b: x,
              h: z,
              tw: O,
              name: me
            });
          }
          else {
            const x = Pe.get(p), z = x ? x.dir === "x" ? E.vigasX : E.vigasY : [], O = x ? z[x.bay] ?? z[0] ?? Xt() : Xt();
            if (u === 0) C = r, R = c, g = m, $ = ts(O.b, O.h), n.sectionShapes.set(p, {
              type: "rect",
              b: O.b,
              h: O.h
            });
            else {
              C = w, R = M, g = v;
              const B = ke.steelVigaType;
              if (B <= 1) {
                const G = xo[O.profileIdx ?? 0] ?? xo[0];
                $ = {
                  A: G.A,
                  Iz: G.Iz,
                  Iy: G.Iy,
                  J: G.J
                }, n.sectionShapes.set(p, {
                  type: "I",
                  b: G.bf,
                  h: G.d,
                  name: G.name
                });
              } else if (B === 2) {
                const G = O.bf ?? 0.2, j = O.hf ?? 0.4, D = O.tf ?? 0.015, X = O.tw ?? 0.01;
                $ = os(G, j, D, X);
                const ee = `I${(j * 100).toFixed(0)}x${(G * 100).toFixed(0)}`;
                n.sectionShapes.set(p, {
                  type: "I",
                  b: G,
                  h: j,
                  tf: D,
                  tw: X,
                  name: ee
                });
              } else {
                const G = O.bc ?? 0.2, j = O.hc ?? 0.3, D = O.t ?? 8e-3;
                $ = ns(G, j, D);
                const X = `\u25A1${(j * 100).toFixed(0)}x${(G * 100).toFixed(0)}x${(D * 1e3).toFixed(0)}`;
                n.sectionShapes.set(p, {
                  type: "HSS",
                  b: G,
                  h: j,
                  tw: D,
                  name: X
                });
              }
            }
          }
          const f = Ee.get(p);
          if (f) {
            if ((f.material ?? 1) === 0 ? (C = r, R = c, g = m) : (C = w, R = M, g = v), f.secType === "rect" && f.b && f.h) $ = ts(f.b, f.h), n.sectionShapes.set(p, {
              type: "rect",
              b: f.b,
              h: f.h
            });
            else if (f.secType === "circ" && f.b) $ = da(f.b), n.sectionShapes.set(p, {
              type: "circ",
              d: f.b
            });
            else if ((f.secType === "W" || f.secType === "HSS") && f.profileIdx !== void 0) {
              const z = xo[f.profileIdx] ?? xo[0];
              $ = {
                A: z.A,
                Iz: z.Iz,
                Iy: z.Iy,
                J: z.J
              }, n.sectionShapes.set(p, {
                type: "I",
                b: z.bf,
                h: z.d,
                name: z.name
              });
            } else if (f.secType === "I-param" && f.bf && f.hf && f.tf && f.tw) {
              $ = os(f.bf, f.hf, f.tf, f.tw);
              const z = `I${(f.hf * 100).toFixed(0)}x${(f.bf * 100).toFixed(0)}`;
              n.sectionShapes.set(p, {
                type: "I",
                b: f.bf,
                h: f.hf,
                tf: f.tf,
                tw: f.tw,
                name: z
              });
            } else if (f.secType === "tubular" && f.bc && f.hc && f.t) {
              $ = ns(f.bc, f.hc, f.t);
              const z = `\u25A1${(f.hc * 100).toFixed(0)}x${(f.bc * 100).toFixed(0)}x${(f.t * 1e3).toFixed(0)}`;
              n.sectionShapes.set(p, {
                type: "HSS",
                b: f.bc,
                h: f.hc,
                tw: f.t,
                name: z
              });
            }
          }
          let k = $.A, F = $.Iy, q = $.Iz, H = $.J, h, S;
          f && (f.modA != null && f.modA !== 1 && (k *= f.modA), f.modI != null && f.modI !== 1 && (F *= f.modI), f.modI3 != null && f.modI3 !== 1 && (q *= f.modI3), f.modJ != null && f.modJ !== 1 && (H *= f.modJ), f.modAs2 != null && (f.modAs2 === 0 ? h = -1 : f.modAs2 !== 1 && (h = f.modAs2 * (5 / 6) * k)), f.modAs3 != null && (f.modAs3 === 0 ? S = -1 : f.modAs3 !== 1 && (S = f.modAs3 * (5 / 6) * k))), n.elasticities.set(p, C), n.shearModuli.set(p, R), n.areas.set(p, k), n.momentsOfInertiaZ.set(p, F), n.momentsOfInertiaY.set(p, q), n.torsionalConstants.set(p, H), n.densities.set(p, g * ((f == null ? void 0 : f.modMass) ?? 1)), h !== void 0 && (n.shearAreasY || (n.shearAreasY = /* @__PURE__ */ new Map()), n.shearAreasY.set(p, h)), S !== void 0 && (n.shearAreasZ || (n.shearAreasZ = /* @__PURE__ */ new Map()), n.shearAreasZ.set(p, S)), f && f.releases12 && f.releases12.some((x) => x) && (n.momentReleases || (n.momentReleases = /* @__PURE__ */ new Map()), n.momentReleases.set(p, f.releases12)), f && f.springs12 && f.springs12.some((x) => x > 0) && (n.partialFixitySprings || (n.partialFixitySprings = /* @__PURE__ */ new Map()), n.partialFixitySprings.set(p, f.springs12));
        }
      } else for (let s = 0; s < t.length; s++) n.elasticities.set(s, o.E), n.shearModuli.set(s, o.G), n.areas.set(s, o.A), n.momentsOfInertiaZ.set(s, o.Iy), n.momentsOfInertiaY.set(s, o.Iz), n.torsionalConstants.set(s, o.J), n.densities.set(s, o.rho);
      e.elementInputs.val = n;
    }
    function On(t) {
      ve.querySelectorAll("[data-ex]").forEach((o) => {
        o.classList.toggle("active", o.dataset.ex === t);
      });
    }
    window.innerWidth <= 600 && ve.classList.add("collapsed"), setTimeout(() => {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l2, _m, _n2, _o2, _p;
      (_a2 = ve.querySelector("#cad3d-toggle")) == null ? void 0 : _a2.addEventListener("click", (h) => {
        h.stopPropagation(), ve.classList.add("collapsed");
      }), (_b = ve.querySelector("#cad3d-expand")) == null ? void 0 : _b.addEventListener("click", (h) => {
        h.stopPropagation(), ve.classList.remove("collapsed");
      }), ve.querySelectorAll("[data-ex]").forEach((h) => {
        h.addEventListener("click", (S) => {
          S.stopPropagation();
          const x = h.dataset.ex;
          On(x), Re.example(x);
        });
      }), ve.querySelectorAll("[data-view]").forEach((h) => {
        h.addEventListener("click", (S) => {
          S.stopPropagation();
          const x = h.dataset.view;
          uo(x), ve.querySelectorAll("[data-view]").forEach((z) => z.classList.remove("view-active")), h.classList.add("view-active");
        });
      }), (_c = ve.querySelector("#cad3d-btn-clear")) == null ? void 0 : _c.addEventListener("click", (h) => {
        h.stopPropagation(), A = "", ma.val = false, za(), Re.clear();
      }), (_d = ve.querySelector("#cad3d-select")) == null ? void 0 : _d.addEventListener("click", (h) => {
        var _a3;
        h.stopPropagation(), Yt && (Yt = false, Mo()), eo && dn(), Ct = !Ct, (_a3 = ve.querySelector("#cad3d-select")) == null ? void 0 : _a3.classList.toggle("inspect-active", Ct);
        const x = De();
        x && (x.controls.enabled = !Ct), Ct || cn();
      }), (_e = ve.querySelector("#cad3d-draw")) == null ? void 0 : _e.addEventListener("click", (h) => {
        var _a3;
        h.stopPropagation(), Yt && (Yt = false, Mo()), Ct && cn(), eo = !eo, (_a3 = ve.querySelector("#cad3d-draw")) == null ? void 0 : _a3.classList.toggle("inspect-active", eo), eo ? qa() : dn();
      }), (_f = ve.querySelector("#cad3d-inspect")) == null ? void 0 : _f.addEventListener("click", (h) => {
        var _a3;
        h.stopPropagation(), Ct && cn(), eo && dn(), Yt = !Yt, (_a3 = ve.querySelector("#cad3d-inspect")) == null ? void 0 : _a3.classList.toggle("inspect-active", Yt), Yt || Mo();
      }), (_g = ve.querySelector("#cad3d-new-model")) == null ? void 0 : _g.addEventListener("click", (h) => {
        h.stopPropagation(), Re.clear(), Ue = null;
      });
      const t = ve.querySelector("#cad3d-tests-menu");
      t && t.addEventListener("change", () => {
        const h = t.value;
        t.value = "", h && o(h);
      });
      function o(h) {
        var _a3, _b2, _c2, _d2, _e2, _f2;
        const z = 15e3 * Math.sqrt(210) * 10, O = 0.2, B = z / (2 * (1 + O)), G = 0.09, j = 0.3 ** 4 / 12, D = 0.141 * 0.3 ** 4, X = 0.25 * 0.4, ee = 0.25 * 0.4 ** 3 / 12, de = 0.4 * 0.25 ** 3 / 12, me = 1e-3, _ = 5 / 6 * G, se = 5 / 6 * X, Y = [];
        function ae(W, le, fe) {
          const U = {
            elasticities: /* @__PURE__ */ new Map(),
            shearModuli: /* @__PURE__ */ new Map(),
            areas: /* @__PURE__ */ new Map(),
            momentsOfInertiaY: /* @__PURE__ */ new Map(),
            momentsOfInertiaZ: /* @__PURE__ */ new Map(),
            torsionalConstants: /* @__PURE__ */ new Map(),
            shearAreasY: /* @__PURE__ */ new Map(),
            shearAreasZ: /* @__PURE__ */ new Map()
          };
          for (const ue of le) U.elasticities.set(ue, z), U.shearModuli.set(ue, B), U.areas.set(ue, G), U.momentsOfInertiaY.set(ue, j), U.momentsOfInertiaZ.set(ue, j), U.torsionalConstants.set(ue, D), U.shearAreasY.set(ue, _), U.shearAreasZ.set(ue, _);
          for (const ue of fe) U.elasticities.set(ue, z), U.shearModuli.set(ue, B), U.areas.set(ue, X), U.momentsOfInertiaY.set(ue, de), U.momentsOfInertiaZ.set(ue, ee), U.torsionalConstants.set(ue, me), U.shearAreasY.set(ue, se), U.shearAreasZ.set(ue, se);
          return U;
        }
        if (h === "test-cantilever" || h === "test-all") {
          const fe = 270 / (3 * z * j), U = [
            [
              0,
              0,
              0
            ],
            [
              3,
              0,
              0
            ]
          ], ue = [
            [
              0,
              1
            ]
          ], ze = ae(1, [], []);
          ze.elasticities.set(0, z), ze.shearModuli.set(0, B), ze.areas.set(0, G), ze.momentsOfInertiaY.set(0, j), ze.momentsOfInertiaZ.set(0, j), ze.torsionalConstants.set(0, D);
          const Be = pt(U, ue, {
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
              ]
            ]),
            loads: /* @__PURE__ */ new Map([
              [
                1,
                [
                  0,
                  0,
                  10,
                  0,
                  0,
                  0
                ]
              ]
            ])
          }, ze);
          Y.push({
            name: "Cantilever Beam",
            formulation: "Euler-Bernoulli (PL\xB3/3EI)",
            nodes: U,
            elements: ue,
            results: [
              {
                label: "Uz tip (cm)",
                hekatan: Be.deformations.get(1)[2] * 100,
                reference: fe * 100,
                refSource: "Analytical"
              }
            ]
          });
        }
        if (h === "test-portal-1p" || h === "test-all") {
          const W = [
            [
              0,
              0,
              0
            ],
            [
              4,
              0,
              0
            ],
            [
              0,
              0,
              3
            ],
            [
              4,
              0,
              3
            ]
          ], le = [
            [
              0,
              2
            ],
            [
              1,
              3
            ],
            [
              2,
              3
            ]
          ], fe = ae(3, [
            0,
            1
          ], [
            2
          ]), U = pt(W, le, {
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
                1,
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
                2,
                [
                  10,
                  0,
                  0,
                  0,
                  0,
                  0
                ]
              ],
              [
                3,
                [
                  10,
                  0,
                  0,
                  0,
                  0,
                  0
                ]
              ]
            ])
          }, fe);
          Y.push({
            name: "Portal 1-Story (Timoshenko)",
            formulation: "Frame Timoshenko (As=5/6\xB7A)",
            nodes: W,
            elements: le,
            results: [
              {
                label: "Ux top (cm)",
                hekatan: U.deformations.get(2)[0] * 100,
                reference: 2.0618,
                refSource: "ETABS 22.6"
              }
            ]
          });
        }
        if (h === "test-portal-2p" || h === "test-all") {
          const W = [
            [
              0,
              0,
              0
            ],
            [
              4,
              0,
              0
            ],
            [
              0,
              0,
              3
            ],
            [
              4,
              0,
              3
            ],
            [
              0,
              0,
              6
            ],
            [
              4,
              0,
              6
            ]
          ], le = [
            [
              0,
              2
            ],
            [
              1,
              3
            ],
            [
              2,
              4
            ],
            [
              3,
              5
            ],
            [
              2,
              3
            ],
            [
              4,
              5
            ]
          ], fe = ae(6, [
            0,
            1,
            2,
            3
          ], [
            4,
            5
          ]), U = pt(W, le, {
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
                1,
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
                4,
                [
                  10,
                  0,
                  0,
                  0,
                  0,
                  0
                ]
              ],
              [
                5,
                [
                  10,
                  0,
                  0,
                  0,
                  0,
                  0
                ]
              ]
            ])
          }, fe);
          Y.push({
            name: "Portal 2-Story",
            formulation: "Frame Timoshenko",
            nodes: W,
            elements: le,
            results: [
              {
                label: "Ux Z=3m (cm)",
                hekatan: U.deformations.get(2)[0] * 100,
                reference: 2.5188,
                refSource: "ETABS 22.6"
              },
              {
                label: "Ux Z=6m (cm)",
                hekatan: U.deformations.get(4)[0] * 100,
                reference: 5.6424,
                refSource: "ETABS 22.6"
              }
            ]
          });
        }
        if (h === "test-wall-only" || h === "test-all") {
          const W = [
            [
              0,
              0,
              0
            ],
            [
              4,
              0,
              0
            ],
            [
              4,
              0,
              3
            ],
            [
              0,
              0,
              3
            ]
          ], le = [
            [
              0,
              1,
              2,
              3
            ]
          ], U = pt(W, le, {
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
                1,
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
                2,
                [
                  10,
                  0,
                  0,
                  0,
                  0,
                  0
                ]
              ],
              [
                3,
                [
                  10,
                  0,
                  0,
                  0,
                  0,
                  0
                ]
              ]
            ])
          }, {
            elasticities: /* @__PURE__ */ new Map([
              [
                0,
                z
              ]
            ]),
            shearModuli: /* @__PURE__ */ new Map([
              [
                0,
                B
              ]
            ]),
            thicknesses: /* @__PURE__ */ new Map([
              [
                0,
                0.2
              ]
            ]),
            poissonsRatios: /* @__PURE__ */ new Map([
              [
                0,
                O
              ]
            ])
          });
          Y.push({
            name: "Wall Q4 Only",
            formulation: "Membrane (incompatible modes) + Mindlin-Reissner + Hughes-Brezzi drilling",
            nodes: W,
            elements: le,
            results: [
              {
                label: "Ux top (cm)",
                hekatan: U.deformations.get(2)[0] * 100,
                reference: 0.013519,
                refSource: "ETABS 22.6"
              }
            ]
          });
        }
        if (h === "test-portal-wall" || h === "test-all") {
          const W = [
            [
              0,
              0,
              0
            ],
            [
              4,
              0,
              0
            ],
            [
              0,
              0,
              3
            ],
            [
              4,
              0,
              3
            ],
            [
              0,
              0,
              6
            ],
            [
              4,
              0,
              6
            ]
          ], le = [
            [
              0,
              2
            ],
            [
              1,
              3
            ],
            [
              2,
              4
            ],
            [
              3,
              5
            ],
            [
              2,
              3
            ],
            [
              4,
              5
            ],
            [
              0,
              1,
              3,
              2
            ]
          ], fe = ae(6, [
            0,
            1,
            2,
            3
          ], [
            4,
            5
          ]);
          fe.elasticities.set(6, z), fe.shearModuli.set(6, B), fe.thicknesses = /* @__PURE__ */ new Map([
            [
              6,
              0.2
            ]
          ]), fe.poissonsRatios = /* @__PURE__ */ new Map([
            [
              6,
              O
            ]
          ]);
          const U = pt(W, le, {
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
                1,
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
                4,
                [
                  10,
                  0,
                  0,
                  0,
                  0,
                  0
                ]
              ],
              [
                5,
                [
                  10,
                  0,
                  0,
                  0,
                  0,
                  0
                ]
              ]
            ])
          }, fe);
          Y.push({
            name: "Portal 2-Story + Wall Q4",
            formulation: "Frame Timoshenko + Shell Q4 (Hughes-Brezzi drilling)",
            nodes: W,
            elements: le,
            results: [
              {
                label: "Ux h=3m (cm)",
                hekatan: U.deformations.get(2)[0] * 100,
                reference: 0.0195,
                refSource: "ETABS 22.6"
              },
              {
                label: "Ux h=6m (cm)",
                hekatan: U.deformations.get(4)[0] * 100,
                reference: 2.1133,
                refSource: "ETABS 22.6"
              }
            ]
          });
        }
        if (h === "test-wilson-beam" || h === "test-all") {
          const Be = 0.6666666666666666, je = [
            [
              0,
              -1,
              0
            ],
            [
              2.5,
              -1,
              0
            ],
            [
              5,
              -1,
              0
            ],
            [
              5,
              1,
              0
            ],
            [
              2.5,
              1,
              0
            ],
            [
              0,
              1,
              0
            ]
          ], tt = [
            [
              0,
              1,
              4,
              5
            ],
            [
              1,
              2,
              3,
              4
            ]
          ], lt = {
            elasticities: /* @__PURE__ */ new Map([
              [
                0,
                1500
              ],
              [
                1,
                1500
              ]
            ]),
            shearModuli: /* @__PURE__ */ new Map([
              [
                0,
                600
              ],
              [
                1,
                600
              ]
            ]),
            thicknesses: /* @__PURE__ */ new Map([
              [
                0,
                1
              ],
              [
                1,
                1
              ]
            ]),
            poissonsRatios: /* @__PURE__ */ new Map([
              [
                0,
                0.25
              ],
              [
                1,
                0.25
              ]
            ])
          }, ot = /* @__PURE__ */ new Map();
          ot.set(0, [
            true,
            true,
            true,
            true,
            true,
            true
          ]), ot.set(5, [
            true,
            true,
            true,
            true,
            true,
            true
          ]);
          const ut = /* @__PURE__ */ new Map();
          ut.set(2, [
            0,
            0.5,
            0,
            0,
            0,
            0
          ]), ut.set(3, [
            0,
            0.5,
            0,
            0,
            0,
            0
          ]);
          const no = 5 ** 3 / (3 * 1500 * Be);
          try {
            const Ft = pt(je, tt, {
              supports: ot,
              loads: ut
            }, lt), kt = Math.abs(((_b2 = (_a3 = Ft.deformations) == null ? void 0 : _a3.get(2)) == null ? void 0 : _b2[1]) ?? 0), Oe = Math.abs(((_d2 = (_c2 = Ft.deformations) == null ? void 0 : _c2.get(3)) == null ? void 0 : _d2[1]) ?? 0), Qe = (kt + Oe) / 2, It = Qe / no;
            Y.push({
              name: "Wilson Fig 6.2 \u2014 Cantilever Q4",
              formulation: "2 Q4 elements + incompatible modes (Wilson 1971, Table 6.1)",
              nodes: je,
              elements: tt,
              results: [
                {
                  label: "Uy/Uy_exact (cortante)",
                  hekatan: It,
                  reference: 0.932,
                  refSource: "Wilson Table 6.1"
                },
                {
                  label: "Uy free end",
                  hekatan: Qe,
                  reference: no * 0.932,
                  refSource: "Wilson"
                }
              ]
            });
          } catch (Ft) {
            Y.push({
              name: "Wilson Fig 6.2 \u2014 Cantilever Q4",
              formulation: "ERROR: " + Ft.message,
              nodes: je,
              elements: tt,
              results: [
                {
                  label: "Error",
                  hekatan: 0,
                  reference: 0.932,
                  refSource: "Wilson"
                }
              ]
            });
          }
        }
        if (h === "test-scordelis" || h === "test-all") {
          const Be = 40 * Math.PI / 180, je = 8, tt = 8, lt = [];
          for (let Oe = 0; Oe <= je; Oe++) for (let Qe = 0; Qe <= tt; Qe++) {
            const It = 25 * Oe / je, dt = Be * Qe / tt, ye = 25 * Math.sin(dt), Le = 25 * Math.cos(dt) - 25 * Math.cos(Be);
            lt.push([
              It,
              ye,
              Le
            ]);
          }
          const ot = [];
          for (let Oe = 0; Oe < je; Oe++) for (let Qe = 0; Qe < tt; Qe++) {
            const It = Oe * (tt + 1) + Qe, dt = (Oe + 1) * (tt + 1) + Qe, ye = (Oe + 1) * (tt + 1) + (Qe + 1), Le = Oe * (tt + 1) + (Qe + 1);
            ot.push([
              It,
              dt,
              ye,
              Le
            ]);
          }
          const ut = {
            elasticities: /* @__PURE__ */ new Map(),
            shearModuli: /* @__PURE__ */ new Map(),
            thicknesses: /* @__PURE__ */ new Map(),
            poissonsRatios: /* @__PURE__ */ new Map()
          }, no = 432e6 / (2 * 1);
          for (let Oe = 0; Oe < ot.length; Oe++) ut.elasticities.set(Oe, 432e6), ut.shearModuli.set(Oe, no), ut.thicknesses.set(Oe, 0.25), ut.poissonsRatios.set(Oe, 0);
          const Ft = /* @__PURE__ */ new Map();
          for (let Oe = 0; Oe <= je; Oe++) for (let Qe = 0; Qe <= tt; Qe++) {
            const It = Oe * (tt + 1) + Qe, dt = [
              false,
              false,
              false,
              false,
              false,
              false
            ];
            Oe === 0 && (dt[0] = true, dt[4] = true, dt[5] = true), Oe === je && (dt[1] = true, dt[2] = true, dt[3] = true), Qe === 0 && (dt[1] = true, dt[3] = true, dt[5] = true), dt.some((ye) => ye) && Ft.set(It, dt);
          }
          const kt = /* @__PURE__ */ new Map();
          for (const Oe of ot) {
            const Qe = lt[Oe[0]], It = lt[Oe[1]], dt = lt[Oe[2]], ye = lt[Oe[3]], Le = [
              dt[0] - Qe[0],
              dt[1] - Qe[1],
              dt[2] - Qe[2]
            ], Fe = [
              ye[0] - It[0],
              ye[1] - It[1],
              ye[2] - It[2]
            ], _e3 = Le[1] * Fe[2] - Le[2] * Fe[1], $t = Le[2] * Fe[0] - Le[0] * Fe[2], So = Le[0] * Fe[1] - Le[1] * Fe[0], en = -90 * (0.5 * Math.sqrt(_e3 * _e3 + $t * $t + So * So)) / 4;
            for (const pn of Oe) {
              const oa = kt.get(pn) || [
                0,
                0,
                0,
                0,
                0,
                0
              ];
              oa[2] += en, kt.set(pn, oa);
            }
          }
          try {
            const Oe = pt(lt, ot, {
              supports: Ft,
              loads: kt
            }, ut), Qe = tt, It = ((_f2 = (_e2 = Oe.deformations) == null ? void 0 : _e2.get(Qe)) == null ? void 0 : _f2[2]) ?? 0;
            Y.push({
              name: "Scordelis-Lo Barrel Vault",
              formulation: `Shell Q4 (${je}x${tt} mesh), Mindlin-Reissner + incompatible modes`,
              nodes: lt,
              elements: ot,
              results: [
                {
                  label: "Uz midspan free edge (ft)",
                  hekatan: Math.abs(It),
                  reference: 0.3086,
                  refSource: "Wilson (2004) / MacNeal-Harder"
                }
              ]
            });
          } catch (Oe) {
            Y.push({
              name: "Scordelis-Lo Barrel Vault",
              formulation: "ERROR: " + Oe.message,
              nodes: lt,
              elements: ot,
              results: [
                {
                  label: "Error",
                  hekatan: 0,
                  reference: 0.3086,
                  refSource: "Wilson"
                }
              ]
            });
          }
        }
        if (u(Y), Y.length > 0) {
          const W = Y[Y.length - 1];
          e.nodes.val = W.nodes, e.elements.val = W.elements;
          const le = /* @__PURE__ */ new Map(), fe = /* @__PURE__ */ new Map(), U = Math.max(...W.nodes.map((ue) => ue[2]));
          W.nodes.forEach((ue, ze) => {
            Math.abs(ue[2]) < 0.01 && le.set(ze, [
              true,
              true,
              true,
              true,
              true,
              true
            ]), Math.abs(ue[2] - U) < 0.01 && fe.set(ze, [
              10,
              0,
              0,
              0,
              0,
              0
            ]);
          }), e.nodeInputs.val = {
            supports: le,
            loads: fe
          }, e.elementInputs.val = {}, e.deformOutputs.val = {}, e.analyzeOutputs.val = {};
        }
      }
      function n(h) {
        const S = 15e3 * Math.sqrt(210) * 10, x = [];
        x.push(`$ File exported from Hekatan Struct \u2014 validacion FEM: ${h.name}`), x.push(" "), x.push("$ PROGRAM INFORMATION"), x.push('  PROGRAM  "ETABS"  VERSION "22.6.0"  '), x.push(""), x.push("$ CONTROLS"), x.push('  UNITS  "TONF"  "M"  "C"  '), x.push("");
        const z = /* @__PURE__ */ new Set();
        h.nodes.forEach((_) => z.add(Math.round(_[1] * 1e4) / 1e4));
        const O = [
          ...z
        ].sort((_, se) => _ - se), B = O.map((_, se) => se === 0 ? "Base" : `Level_${se}`), G = /* @__PURE__ */ new Map();
        O.forEach((_, se) => G.set(_, B[se])), x.push("$ STORIES - IN SEQUENCE FROM TOP");
        for (let _ = O.length - 1; _ >= 1; _--) x.push(`  STORY "${B[_]}"  HEIGHT ${O[_] - O[_ - 1]} MASTERSTORY "Yes"  `);
        x.push(`  STORY "Base"  ELEV ${O[0]} `), x.push(""), x.push("$ MATERIAL PROPERTIES"), x.push('  MATERIAL  "CONC"    TYPE "Concrete"    WEIGHTPERVOLUME 2.4'), x.push(`  MATERIAL  "CONC"    SYMTYPE "Isotropic"  E ${S}  U 0.2  A 1E-05`), x.push(""), x.push("$ FRAME SECTIONS"), x.push('  FRAMESECTION  "COL30"  MATERIAL "CONC"  SHAPE "Concrete Rectangular"  D 0.3 B 0.3 '), x.push('  FRAMESECTION  "VIGA"  MATERIAL "CONC"  SHAPE "Concrete Rectangular"  D 0.4 B 0.25 '), x.push("");
        const j = h.elements.some((_) => _.length === 4);
        j && (x.push("$ WALL/SLAB/DECK SECTIONS"), x.push('  SHELLPROP  "Muro20"  PROPTYPE  "Wall"  MATERIAL "CONC"  MODELINGTYPE "ShellThick"  WALLTHICKNESS 0.2 '), x.push(""));
        const D = /* @__PURE__ */ new Map();
        let X = 0;
        h.nodes.forEach((_) => {
          const se = `${_[0]},${_[2]}`;
          D.has(se) || D.set(se, `${++X}`);
        }), x.push("$ POINT COORDINATES");
        for (const [_, se] of D) {
          const [Y, ae] = _.split(",").map(Number);
          x.push(`  POINT "${se}"  ${Y} ${ae} `);
        }
        x.push("");
        const ee = (_) => {
          const se = h.nodes[_], Y = `${se[0]},${se[2]}`;
          return {
            pt: D.get(Y) || "1",
            story: G.get(Math.round(se[1] * 1e4) / 1e4) || "Base"
          };
        };
        x.push("$ LINE CONNECTIVITIES");
        const de = [];
        if (h.elements.forEach((_, se) => {
          if (_.length !== 2) return;
          const Y = h.nodes[_[0]], ae = h.nodes[_[1]], W = Math.abs(ae[1] - Y[1]), le = Math.sqrt((ae[0] - Y[0]) ** 2 + (ae[2] - Y[2]) ** 2), fe = W > le * 0.5, U = ee(_[0]), ue = ee(_[1]), ze = fe ? "COL30" : "VIGA";
          fe ? (x.push(`  LINE  "E${se + 1}"  COLUMN  "${U.pt}"  "${U.pt}"  1`), de.push(`  LINEASSIGN  "E${se + 1}"  "${ue.story}"  SECTION "${ze}"  `)) : (x.push(`  LINE  "E${se + 1}"  BEAM  "${U.pt}"  "${ue.pt}"  0`), de.push(`  LINEASSIGN  "E${se + 1}"  "${U.story}"  SECTION "${ze}"  `));
        }), x.push(""), j) {
          x.push("$ AREA CONNECTIVITIES");
          const _ = [];
          h.elements.forEach((se, Y) => {
            if (se.length !== 4) return;
            const ae = se.map((W) => ee(W));
            x.push(`  AREA "W${Y + 1}"  PANEL  4  "${ae[0].pt}"  "${ae[1].pt}"  "${ae[2].pt}"  "${ae[3].pt}"  1  1  0  0  `), _.push(`  AREAASSIGN  "W${Y + 1}"  "${ae[2].story}"  SECTION "Muro20"  `);
          }), x.push(""), x.push("$ AREA ASSIGNS"), _.forEach((se) => x.push(se)), x.push("");
        }
        x.push("$ POINT ASSIGNS"), h.nodes.forEach((_, se) => {
          if (Math.abs(_[1]) < 0.01) {
            const Y = ee(se);
            x.push(`  POINTASSIGN  "${Y.pt}"  "${Y.story}"  RESTRAINT "UX UY UZ RX RY RZ"  `);
          }
        }), x.push(""), x.push("$ LINE ASSIGNS"), de.forEach((_) => x.push(_)), x.push(""), x.push("$ LOAD PATTERNS"), x.push('  LOADPATTERN "Lat"  TYPE  "Other"  SELFWEIGHT  0'), x.push(""), x.push("$ POINT OBJECT LOADS");
        const me = Math.max(...h.nodes.map((_) => _[1]));
        return h.nodes.forEach((_, se) => {
          if (Math.abs(_[1] - me) < 0.01) {
            const Y = ee(se);
            x.push(`  POINTLOAD  "${Y.pt}"  "${Y.story}"  "Lat"  TYPE "FORCE"  FX 10`);
          }
        }), x.push(""), x.push("  END"), x.push("$ END OF MODEL FILE"), x.join(`\r
`);
      }
      function l(h) {
        const S = 15e3 * Math.sqrt(210) * 10, x = [];
        x.push(`"""ETABS API Validation: ${h.name}`), x.push('Generated by Hekatan Struct"""'), x.push("import comtypes.client, time, math"), x.push(""), x.push("helper = comtypes.client.CreateObject('ETABSv1.Helper')"), x.push("helper = helper.QueryInterface(comtypes.gen.ETABSv1.cHelper)"), x.push('myETABS = helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")'), x.push("myETABS.ApplicationStart()"), x.push("time.sleep(10)"), x.push("SapModel = myETABS.SapModel"), x.push("SapModel.InitializeNewModel()"), x.push("SapModel.File.NewBlank()"), x.push("SapModel.SetPresentUnits(12)  # tonf_m_C"), x.push(""), x.push(`E = ${S}`), x.push('SapModel.PropMaterial.SetMaterial("CONC", 2)'), x.push('SapModel.PropMaterial.SetMPIsotropic("CONC", E, 0.2, 5.5e-6)'), x.push('SapModel.PropFrame.SetRectangle("COL30", "CONC", 0.30, 0.30)'), x.push('SapModel.PropFrame.SetRectangle("VIGA", "CONC", 0.40, 0.25)'), h.elements.some((B) => B.length === 4) && x.push('SapModel.PropArea.SetWall("Muro20", 6, False, "CONC", 0.20)'), x.push(""), x.push("# Add elements"), x.push("FN = ' '"), h.elements.forEach((B, G) => {
          if (B.length === 2) {
            const j = h.nodes[B[0]], D = h.nodes[B[1]], X = Math.abs(D[1] - j[1]), ee = Math.sqrt((D[0] - j[0]) ** 2 + (D[2] - j[2]) ** 2), de = X > ee * 0.5 ? "COL30" : "VIGA";
            x.push(`[FN,r]=SapModel.FrameObj.AddByCoord(${j[0]},${j[2]},${j[1]}, ${D[0]},${D[2]},${D[1]}, FN,"${de}","E${G + 1}","Global")`);
          } else if (B.length === 4) {
            const j = B.map((D) => h.nodes[D]);
            x.push(`SapModel.AreaObj.AddByCoord(4, [${j.map((D) => D[0]).join(",")}], [${j.map((D) => D[2]).join(",")}], [${j.map((D) => D[1]).join(",")}], "", "Muro20")`);
          }
        }), x.push(""), x.push("# Supports at Z=0"), x.push("names = SapModel.PointObj.GetNameList()"), x.push("for i in range(int(names[0])):"), x.push("    c = SapModel.PointObj.GetCoordCartesian(names[1][i])"), x.push("    if abs(float(c[2])) < 0.01:"), x.push("        SapModel.PointObj.SetRestraint(names[1][i], [True]*6)"), x.push(""), x.push("# Load at top"), x.push('SapModel.LoadPatterns.Add("Lat", 8, 0, True)');
        const O = Math.max(...h.nodes.map((B) => B[1]));
        x.push("names = SapModel.PointObj.GetNameList()"), x.push("for i in range(int(names[0])):"), x.push("    c = SapModel.PointObj.GetCoordCartesian(names[1][i])"), x.push(`    if abs(float(c[2]) - ${O}) < 0.01:`), x.push('        SapModel.PointObj.SetLoadForce(names[1][i], "Lat", [10,0,0,0,0,0])'), x.push(""), x.push(`SapModel.File.Save(r"C:\\Users\\j-b-j\\Downloads\\validation_${h.name.replace(/[^a-zA-Z0-9]/g, "_")}.EDB")`), x.push("time.sleep(1)"), x.push("SapModel.Analyze.RunAnalysis()"), x.push("time.sleep(5)"), x.push(""), x.push("# Results"), x.push("SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()"), x.push('SapModel.Results.Setup.SetCaseSelectedForOutput("Lat")'), x.push(`print(f"\\n=== ETABS: ${h.name} ===")`), x.push("names = SapModel.PointObj.GetNameList()"), x.push("for i in range(int(names[0])):"), x.push("    name = names[1][i]"), x.push("    c = SapModel.PointObj.GetCoordCartesian(name)"), x.push("    NR=0;Obj=[];Elm=[];AC=[];ST=[];SN=[];U1=[];U2=[];U3=[];R1=[];R2=[];R3=[]"), x.push("    [NR,Obj,Elm,AC,ST,SN,U1,U2,U3,R1,R2,R3,ret]=SapModel.Results.JointDispl(name,0,NR,Obj,Elm,AC,ST,SN,U1,U2,U3,R1,R2,R3)"), x.push("    if NR > 0:"), x.push('        print(f"  {name} Z={float(c[2]):.1f}: Ux={U1[0]*100:.4f} cm")'), x.push(""), x.push('print("\\nHekatan results:")');
        for (const B of h.results) x.push(`print(f"  ${B.label}: Hekatan=${B.hekatan.toFixed(4)}, ETABS=${B.reference.toFixed(4)}, Ratio={${B.hekatan.toFixed(4)}/${B.reference.toFixed(4)}:.4f}")`);
        return x.push("SapModel.View.RefreshView(0, False)"), x.join(`
`);
      }
      function s(h, S) {
        const x = new Blob([
          h
        ], {
          type: "text/plain"
        }), z = URL.createObjectURL(x), O = document.createElement("a");
        O.href = z, O.download = S, O.click(), URL.revokeObjectURL(z);
      }
      function u(h) {
        let S = document.getElementById("test-results-overlay");
        S && S.remove(), S = document.createElement("div"), S.id = "test-results-overlay", S.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
        background:#1a1a2e;color:#eee;border:2px solid #16213e;border-radius:8px;padding:20px;
        z-index:10000;max-width:750px;width:90%;max-height:80vh;overflow-y:auto;font-family:monospace;font-size:13px;
        box-shadow:0 10px 40px rgba(0,0,0,0.5);`;
        let x = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h3 style="margin:0;color:#00d4ff">Hekatan Struct \u2014 validacion FEM</h3>
        <button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:#888;font-size:18px;cursor:pointer">X</button>
      </div>`, z = true;
        window.__hekatanTests = h;
        for (let B = 0; B < h.length; B++) {
          const G = h[B];
          x += '<div style="margin-bottom:16px;border:1px solid #333;border-radius:6px;padding:10px">', x += '<div style="display:flex;justify-content:space-between;align-items:center">', x += `<div style="font-weight:bold;color:#00d4ff">${G.name}</div>`, x += "<div>", x += `<button onclick="window.__hekatanDownloadE2k(${B})" style="background:#1e3a5f;color:#aaa;border:1px solid #444;padding:2px 6px;font-size:10px;cursor:pointer;margin-right:4px;border-radius:3px">e2k</button>`, x += `<button onclick="window.__hekatanDownloadPy(${B})" style="background:#2a1e3a;color:#aaa;border:1px solid #444;padding:2px 6px;font-size:10px;cursor:pointer;border-radius:3px">py</button>`, x += "</div></div>", x += `<div style="color:#888;font-size:11px;margin-bottom:8px">${G.formulation}</div>`, x += `<table style="width:100%;border-collapse:collapse;font-size:12px">
          <tr style="color:#888"><td style="padding:3px 6px">Measure</td><td style="text-align:right">Hekatan</td><td style="text-align:right">Reference</td><td style="text-align:right">Ratio</td><td style="text-align:right">Source</td><td style="text-align:center"></td></tr>`;
          for (const j of G.results) {
            const D = j.reference !== 0 ? j.hekatan / j.reference : 1, X = Math.abs(D - 1) < 0.05;
            X || (z = false);
            const ee = X ? "#4caf50" : "#f44336", de = X ? "PASS" : "FAIL";
            x += `<tr style="border-top:1px solid #333">
            <td style="padding:3px 6px">${j.label}</td>
            <td style="text-align:right;color:#fff">${j.hekatan.toFixed(4)}</td>
            <td style="text-align:right;color:#aaa">${j.reference.toFixed(4)}</td>
            <td style="text-align:right;color:${ee};font-weight:bold">${D.toFixed(4)}</td>
            <td style="text-align:right;color:#888;font-size:11px">${j.refSource}</td>
            <td style="text-align:center;color:${ee};font-size:10px;font-weight:bold">${de}</td></tr>`;
          }
          x += "</table></div>";
        }
        x += z ? '<div style="color:#4caf50;font-weight:bold;text-align:center;margin-top:8px">ALL TESTS PASSED (< 5% error vs ETABS)</div>' : '<div style="color:#f44336;font-weight:bold;text-align:center;margin-top:8px">Some tests exceeded 5% tolerance</div>', S.innerHTML = x, document.body.appendChild(S), window.__hekatanDownloadE2k = (B) => {
          const G = window.__hekatanTests[B], j = G.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
          s(n(G), `${j}.e2k`);
        }, window.__hekatanDownloadPy = (B) => {
          const G = window.__hekatanTests[B], j = G.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
          s(l(G), `${j}_etabs.py`);
        };
      }
      (_h = ve.querySelector("#cad3d-export")) == null ? void 0 : _h.addEventListener("click", (h) => {
        h.stopPropagation(), Ta();
      });
      let a = "";
      const i = ve.querySelector("#cad3d-io-menu"), d = ve.querySelector("#cad3d-io-file");
      function r(h, S) {
        e.nodes.val = h.nodes, e.elements.val = h.elements, e.nodeInputs.val = h.nodeInputs, e.elementInputs.val = h.elementInputs, h.sectionShapes && h.elementInputs && (h.elementInputs.sectionShapes = h.sectionShapes), e.deformOutputs.val = {}, e.analyzeOutputs.val = {};
        const x = h.elements.filter((O) => O.length === 2).length, z = h.elements.filter((O) => O.length >= 3).length;
        console.log(`${S} (${h.nodes.length} nodos, ${x} frames, ${z} shells): ${h.nodes.length} nodes, ${h.elements.length} elements`), setTimeout(() => st(), 50);
      }
      function c(h, S) {
        var _a3, _b2, _c2;
        const x = {};
        h.elementInfo.forEach((D) => x[D.category] = (x[D.category] || 0) + 1), (_a3 = document.getElementById("ifc-filter-panel")) == null ? void 0 : _a3.remove();
        const z = document.createElement("div");
        z.id = "ifc-filter-panel", z.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
        background:#1e1e2e;border:2px solid #00ccff;border-radius:12px;padding:20px;
        z-index:1000010;color:#eee;font-family:monospace;font-size:12px;min-width:320px;
        box-shadow:0 8px 32px rgba(0,0,0,0.6);`;
        const O = [
          "column",
          "beam",
          "slab",
          "footing",
          "member",
          "wall"
        ], B = [
          "opening",
          "rebar",
          "plate",
          "fastener",
          "other"
        ], G = {
          column: "Columnas",
          beam: "Vigas",
          slab: "Losas",
          footing: "Zapatas",
          member: "Diagonales",
          wall: "Muros",
          opening: "Aberturas",
          rebar: "Refuerzo",
          plate: "Placas",
          fastener: "Pernos",
          other: "Otros"
        };
        let j = `<h3 style="color:#00ccff;margin:0 0 12px">IFC \u2192 Modelo Anal\xEDtico</h3>
        <div style="color:#888;margin-bottom:10px">Selecciona qu\xE9 convertir a FEM:</div>
        <div style="border:1px solid #444;border-radius:6px;padding:8px;margin-bottom:8px">
          <div style="color:#33ff33;font-weight:bold;margin-bottom:4px">Estructural</div>`;
        for (const D of O) {
          const X = x[D] || 0;
          if (X === 0) continue;
          const ee = [
            "column",
            "beam",
            "slab"
          ].includes(D) ? "checked" : "";
          j += `<label style="display:flex;align-items:center;gap:6px;padding:2px 0">
          <input type="checkbox" data-ifc-cat="${D}" ${ee}>
          <span>${G[D] || D}</span>
          <span style="color:#888;margin-left:auto">(${X})</span>
        </label>`;
        }
        j += `</div><div style="border:1px solid #333;border-radius:6px;padding:8px;margin-bottom:12px">
        <div style="color:#ff6666;font-weight:bold;margin-bottom:4px">No estructural (solo visual)</div>`;
        for (const D of B) {
          const X = x[D] || 0;
          X !== 0 && (j += `<label style="display:flex;align-items:center;gap:6px;padding:2px 0;color:#888">
          <input type="checkbox" data-ifc-cat="${D}" disabled>
          <span>${G[D] || D}</span>
          <span style="margin-left:auto">(${X})</span>
        </label>`);
        }
        j += `</div>
        <div style="display:flex;gap:8px">
          <button id="ifc-gen-analytical" style="flex:1;padding:8px;background:#0f3460;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:bold">
            \u{1F527} Generar Modelo Anal\xEDtico
          </button>
          <button id="ifc-cancel" style="padding:8px 12px;background:#333;color:#aaa;border:1px solid #555;border-radius:6px;cursor:pointer">\u2715</button>
        </div>`, z.innerHTML = j, document.body.appendChild(z), z.querySelectorAll("input[data-ifc-cat]").forEach((D) => {
          D.addEventListener("change", () => {
            const X = D.dataset.ifcCat, ee = h.detailCategories.get(X);
            if (ee) {
              ee.visible = D.checked;
              const de = De();
              de && de.render();
            }
          });
        }), (_b2 = z.querySelector("#ifc-gen-analytical")) == null ? void 0 : _b2.addEventListener("click", () => {
          var _a4;
          const D = /* @__PURE__ */ new Set();
          z.querySelectorAll("input[data-ifc-cat]:checked").forEach((Y) => {
            D.add(Y.dataset.ifcCat);
          });
          const X = S.nodes.map((Y) => [
            Y.x,
            Y.y,
            Y.z
          ]), ee = [], de = {
            elasticities: /* @__PURE__ */ new Map(),
            shearModuli: /* @__PURE__ */ new Map(),
            areas: /* @__PURE__ */ new Map(),
            momentsOfInertiaY: /* @__PURE__ */ new Map(),
            momentsOfInertiaZ: /* @__PURE__ */ new Map(),
            torsionalConstants: /* @__PURE__ */ new Map(),
            densities: /* @__PURE__ */ new Map(),
            sectionShapes: /* @__PURE__ */ new Map()
          }, me = {
            supports: /* @__PURE__ */ new Map(),
            loads: /* @__PURE__ */ new Map()
          };
          let _ = 0;
          for (const Y of S.elements) if (D.has(Y.category) && Y.type === "frame" && Y.nodeIds.length >= 2) {
            ee.push(Y.nodeIds);
            const ae = ((_a4 = S.materials) == null ? void 0 : _a4.get(Y.material)) || {
              E: 2132888792e-2,
              nu: 0.2,
              rho: 2.4
            }, W = Y.b || 0.3, le = Y.h || 0.3, fe = W * le, U = W * le * le * le / 12, ue = le * W * W * W / 12, ze = W * le * (W * W + le * le) / 12, Be = ae.E / (2 * (1 + ae.nu));
            de.elasticities.set(_, ae.E), de.shearModuli.set(_, Be), de.areas.set(_, fe), de.momentsOfInertiaY.set(_, ue), de.momentsOfInertiaZ.set(_, U), de.torsionalConstants.set(_, ze), de.densities.set(_, ae.rho), de.sectionShapes.set(_, {
              type: "rect",
              b: W,
              h: le,
              name: Y.sectionName
            }), _++;
          }
          const se = Math.min(...X.map((Y) => Y[2]));
          X.forEach((Y, ae) => {
            Math.abs(Y[2] - se) < 0.05 && me.supports.set(ae, [
              true,
              true,
              true,
              true,
              true,
              true
            ]);
          });
          for (const [, Y] of h.detailCategories) {
            const ae = De();
            ae && ae.scene.remove(Y);
          }
          r({
            nodes: X,
            elements: ee,
            nodeInputs: me,
            elementInputs: de,
            sectionShapes: de.sectionShapes,
            info: {
              nNodes: X.length,
              nFrames: ee.length
            }
          }, "IFC analytical"), z.remove();
        }), (_c2 = z.querySelector("#ifc-cancel")) == null ? void 0 : _c2.addEventListener("click", () => {
          for (const [, X] of h.detailCategories) {
            const ee = De();
            ee && ee.scene.remove(X);
          }
          const D = De();
          D && D.render(), z.remove();
        });
      }
      function m(h) {
        he = /* @__PURE__ */ new Set(), xe = /* @__PURE__ */ new Set(), Ce = /* @__PURE__ */ new Map(), Pe = /* @__PURE__ */ new Map();
        const S = /* @__PURE__ */ new Map();
        for (let ee = 0; ee < h.stories.length; ee++) S.set(h.stories[ee].name, ee);
        for (let ee = 0; ee < h.elementTypes.length; ee++) {
          const de = h.elementTypes[ee], me = h.elementStories[ee], _ = S.get(me) ?? 0;
          Ce.set(ee, _), de === "COLUMN" || de === "BRACE" ? he.add(ee) : xe.add(ee);
        }
        A = "edificio";
        const x = h.grids.filter((ee) => ee.dir === "X").sort((ee, de) => ee.coord - de.coord), z = h.grids.filter((ee) => ee.dir === "Y").sort((ee, de) => ee.coord - de.coord);
        let O, B, G, j;
        if (x.length > 0 || z.length > 0) O = x.map((ee) => ee.coord), B = z.map((ee) => ee.coord), G = x.map((ee) => ee.label), j = z.map((ee) => ee.label);
        else {
          const ee = new Set(h.nodes.map((me) => me[0])), de = new Set(h.nodes.map((me) => me[1]));
          O = [
            ...ee
          ].sort((me, _) => me - _), B = [
            ...de
          ].sort((me, _) => me - _), G = O.map((me, _) => String(_ + 1)), j = B.map((me, _) => String.fromCharCode(65 + _));
        }
        const D = h.stories.length > 0 ? Math.max(...h.stories.map((ee) => ee.elev)) : Math.max(...h.nodes.map((ee) => ee[2]));
        Ve = O, Ke = B, po = D, setTimeout(() => {
          st(), Vo(O, B, D, G, j), In(h.stories, O, B), Nn(), Hn();
        }, 100);
        const X = {
          COLUMN: 0,
          BEAM: 0,
          BRACE: 0
        };
        for (const ee of h.elementTypes) X[ee]++;
        console.log(`E2K grids: X=[${G.join(",")}] Y=[${j.join(",")}]`), console.log(`E2K stories: ${h.stories.map((ee) => `${ee.name}@${ee.elev.toFixed(2)}`).join(", ")}`), console.log(`E2K elements: ${X.COLUMN} columns, ${X.BEAM} beams, ${X.BRACE} braces`), Ne();
      }
      function w(h, S) {
        const x = new Blob([
          h
        ], {
          type: "text/plain"
        }), z = URL.createObjectURL(x), O = document.createElement("a");
        O.href = z, O.download = S, O.click(), URL.revokeObjectURL(z);
      }
      i && i.addEventListener("change", () => {
        if (a = i.value, i.value = "", a.startsWith("import")) a === "import-e2k" ? d.accept = ".e2k,.E2K" : a === "import-s2k" ? d.accept = ".s2k,.S2K,.$2k" : a === "import-ifc" ? d.accept = ".ifc,.IFC" : a === "import-py" ? d.accept = ".py" : a === "import-tcl" && (d.accept = ".tcl"), d.click();
        else if (a.startsWith("export")) {
          const h = {
            nodes: e.nodes.val,
            elements: e.elements.val,
            nodeInputs: e.nodeInputs.val,
            elementInputs: e.elementInputs.val
          };
          try {
            a === "export-e2k" ? w(bl({
              ...h,
              title: "Hekatan Model",
              e2kModel: Ue ?? void 0
            }), "model.e2k") : a === "export-s2k" ? w(gl({
              ...h,
              title: "Hekatan Model"
            }), "model.s2k") : a === "export-py" ? w(Nl(h), "model_opensees.py") : a === "export-tcl" && w(Hl(h), "model_opensees.tcl");
          } catch (S) {
            alert("Export error: " + S.message);
          }
        }
      }), d && d.addEventListener("change", () => {
        var _a3;
        const h = (_a3 = d.files) == null ? void 0 : _a3[0];
        if (!h) return;
        if (a === "import-ifc") {
          const x = new FileReader();
          x.onload = async () => {
            const z = x.result;
            try {
              const O = De();
              if (!O) {
                alert("Viewer not ready");
                return;
              }
              console.log("IFC: Loading 3D geometry...");
              const B = await Xl(O.scene, z);
              console.log(`IFC: ${B.meshCount} meshes loaded, bbox:`, B.bbox);
              const G = new Me();
              B.bbox.getCenter(G);
              const j = new Me();
              B.bbox.getSize(j);
              const D = Math.max(j.x, j.y, j.z);
              O.controls.target.copy(G), O.camera.position.set(G.x + D, G.y + D * 0.5, G.z + D), O.camera.lookAt(G), O.controls.maxDistance = D * 5, O.controls.update(), O.render(), window.__ifcLoadResult = B, window.__ifcArrayBuffer = z;
              const X = new FileReader();
              X.onload = () => {
                const ee = X.result, de = Yl(ee);
                window.__ifcAnalytical = de;
                const me = {};
                B.elementInfo.forEach((_) => me[_.category] = (me[_.category] || 0) + 1), console.log("IFC categories:", me), console.log(`IFC: ${B.elementInfo.size} geometric elements, ${de.elements.length} analytical elements`), c(B, de);
              }, X.readAsText(h);
            } catch (O) {
              alert("IFC error: " + O.message), console.error(O);
            }
          }, x.readAsArrayBuffer(h), d.value = "";
          return;
        }
        const S = new FileReader();
        S.onload = () => {
          const x = S.result;
          try {
            if (a === "import-e2k") {
              const z = vl(x);
              Ue = z, r(z, "E2K imported"), m(z);
            } else if (a === "import-s2k") {
              const z = yl(x);
              r({
                nodes: z.nodes,
                elements: z.elements,
                nodeInputs: z.nodeInputs,
                elementInputs: z.elementInputs,
                sectionShapes: z.sectionShapes,
                info: z.info
              }, "S2K imported");
            } else if (a === "import-py") {
              const z = Bl(x);
              r(z, "OpenSeesPy imported");
            } else if (a === "import-tcl") {
              const z = Dl(x);
              r(z, "OpenSees Tcl imported");
            }
          } catch (z) {
            alert("Import error: " + z.message), console.error(z);
          }
        }, S.readAsText(h), d.value = "";
      });
      const M = ve.querySelector("#cad3d-force-unit");
      M && (M.value = y, M.addEventListener("change", (h) => {
        h.stopPropagation(), y = M.value, L = zo(y, N), A && He(A);
      }));
      const v = ve.querySelector("#cad3d-length-unit");
      v && (v.value = N, v.addEventListener("change", (h) => {
        h.stopPropagation(), N = v.value, L = zo(y, N), A && He(A);
      })), ve.querySelectorAll("[data-preset]").forEach((h) => {
        h.addEventListener("click", (S) => {
          S.stopPropagation();
          const x = h.dataset.preset, z = V[x];
          z && (y = z.force, N = z.length, oe = z.stress, L = zo(y, N), M && (M.value = y), v && (v.value = N), ve.querySelectorAll("[data-preset]").forEach((O) => {
            O.classList.toggle("active", O.dataset.preset === x);
          }), A && He(A), console.log(`Preset: ${x} \u2192 ${y}+${N}, stress: ${oe.label}`));
        });
      }), (_i = ve.querySelector("#cad3d-log")) == null ? void 0 : _i.addEventListener("click", (h) => {
        h.stopPropagation(), ja();
      }), (_j = ve.querySelector("#cad3d-pushover")) == null ? void 0 : _j.addEventListener("click", (h) => {
        h.stopPropagation(), Wa();
      }), (_k = ve.querySelector("#cad3d-nonlinear")) == null ? void 0 : _k.addEventListener("click", (h) => {
        h.stopPropagation(), Ya();
      }), (_l2 = ve.querySelector("#cad3d-fem-solver")) == null ? void 0 : _l2.addEventListener("click", (h) => {
        h.stopPropagation(), Ja();
      }), (_m = ve.querySelector("#cad3d-calc")) == null ? void 0 : _m.addEventListener("click", (h) => {
        h.stopPropagation(), na(async () => {
          const { openCalcPanel: S } = await import("./calcPanel-M0C15Osu.js").then(async (m2) => {
            await m2.__tla;
            return m2;
          });
          return {
            openCalcPanel: S
          };
        }, __vite__mapDeps([0,1,2,3,4,5,6,7,8,9])).then(({ openCalcPanel: S }) => {
          var _a3, _b2;
          const x = {
            nodes: e.nodes.val,
            elements: e.elements.val,
            nodeInputs: ((_a3 = e.nodeInputs) == null ? void 0 : _a3.val) ?? {},
            elementInputs: ((_b2 = e.elementInputs) == null ? void 0 : _b2.val) ?? {},
            modelName: A ? A.charAt(0).toUpperCase() + A.slice(1) : "Modelo"
          };
          S(x);
        });
      }), (_n2 = ve.querySelector("#cad3d-modal")) == null ? void 0 : _n2.addEventListener("click", (h) => {
        var _a3, _b2;
        h.stopPropagation(), Wt = !Wt, (_a3 = ve.querySelector("#cad3d-modal")) == null ? void 0 : _a3.classList.toggle("active", Wt);
        const x = ve.querySelector("#cad3d-mode-prev"), z = ve.querySelector("#cad3d-mode-next"), O = ve.querySelector("#cad3d-mode-label"), B = ve.querySelector("#cad3d-modal-scale");
        if (Wt) {
          const G = De();
          ((_b2 = G == null ? void 0 : G.settings) == null ? void 0 : _b2.loads) && (ln = G.settings.loads.rawVal, G.settings.loads.val = false), qn(), x.style.display = "", z.style.display = "", O.style.display = "", B && (B.style.display = ""), p();
        } else _n(), x.style.display = "none", z.style.display = "none", O.style.display = "none", B && (B.style.display = "none"), A && A !== "placa-q4" && A !== "placa-3q" && we(), setTimeout(() => {
          var _a4;
          const G = De();
          ((_a4 = G == null ? void 0 : G.settings) == null ? void 0 : _a4.loads) && ln && (G.settings.loads.val = true);
        }, 600);
      });
      function p() {
        var _a3;
        const h = ve.querySelector("#cad3d-mode-label");
        if (!h || !(ft == null ? void 0 : ft.frequencies)) return;
        const S = ft.frequencies[Mt], x = S > 0 ? 1 / S : 0, z = [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        for (let O = 0; O <= Mt; O++) {
          const B = (_a3 = ft.massParticipation) == null ? void 0 : _a3[O];
          if (B) for (let G = 0; G < 6; G++) z[G] += B[G];
        }
        h.textContent = `Modo ${Mt + 1} \u2014 ${S.toFixed(2)} Hz \u2014 T=${x.toFixed(3)}s \u2014 \u03A3Ux=${(z[0] * 100).toFixed(1)}% \u03A3Uy=${(z[1] * 100).toFixed(1)}% \u03A3Rz=${(z[5] * 100).toFixed(1)}%`;
      }
      (_o2 = ve.querySelector("#cad3d-mode-prev")) == null ? void 0 : _o2.addEventListener("click", (h) => {
        if (h.stopPropagation(), !(ft == null ? void 0 : ft.modeShapes)) return;
        Mt = (Mt - 1 + ft.modeShapes.length) % ft.modeShapes.length;
        const S = ft.modeShapes[Mt], { extent: x } = $o();
        let z = 0;
        for (let O = 0; O < ao.length; O++) {
          const B = S[O * 6] || 0, G = S[O * 6 + 1] || 0, j = S[O * 6 + 2] || 0;
          z = Math.max(z, Math.sqrt(B * B + G * G + j * j));
        }
        an = z > 1e-12 ? x * 0.05 / z : 1, Ko(), p();
      }), (_p = ve.querySelector("#cad3d-mode-next")) == null ? void 0 : _p.addEventListener("click", (h) => {
        if (h.stopPropagation(), !(ft == null ? void 0 : ft.modeShapes)) return;
        Mt = (Mt + 1) % ft.modeShapes.length;
        const S = ft.modeShapes[Mt], { extent: x } = $o();
        let z = 0;
        for (let O = 0; O < ao.length; O++) {
          const B = S[O * 6] || 0, G = S[O * 6 + 1] || 0, j = S[O * 6 + 2] || 0;
          z = Math.max(z, Math.sqrt(B * B + G * G + j * j));
        }
        an = z > 1e-12 ? x * 0.05 / z : 1, Ko(), p();
      });
      const b = ve.querySelector("#cad3d-modal-scale");
      b == null ? void 0 : b.addEventListener("mousedown", (h) => h.stopPropagation()), b == null ? void 0 : b.addEventListener("change", () => {
        Wt && (ft == null ? void 0 : ft.modeShapes) && Ko();
      });
      const I = ve.querySelector("#cad3d-cli-toggle"), E = ve.querySelector("#cad3d-cli-panel"), $ = ve.querySelector("#cad3d-cli-output"), C = ve.querySelector("#cad3d-cmd"), R = [];
      let g = -1;
      I == null ? void 0 : I.addEventListener("click", (h) => {
        if (h.stopPropagation(), E) {
          const S = E.style.display !== "none";
          E.style.display = S ? "none" : "block", S || (C == null ? void 0 : C.focus(), $ && !$.textContent && ($.textContent = `CLI ready. Commands:
  cad.addNode(x, y, z)     cad.addFrame(i, j)
  cad.addSupport(n)        cad.addLoad(n, [fx,fy,fz,0,0,0])
  cad.frame([5,5],[3,3])   cad.building([5],[4],[3])
  cad.galpon(12,20,6,3)    cad.clear()
  cad.info()               cad.listNodes()
`));
        }
      }), C == null ? void 0 : C.addEventListener("mousedown", (h) => h.stopPropagation()), document.addEventListener("keydown", (h) => {
        var _a3;
        if ((h.ctrlKey || h.metaKey) && h.key === "z" && !h.shiftKey) {
          h.preventDefault(), _s();
          return;
        }
        if ((h.ctrlKey || h.metaKey) && (h.key === "y" || h.key === "z" && h.shiftKey)) {
          h.preventDefault(), Rs();
          return;
        }
        if ((h.key === "Delete" || h.key === "Backspace") && et.size > 0) {
          h.preventDefault(), et.forEach((S) => Q.add(S)), et.clear(), to && (to.remove(), to = null), we();
          return;
        }
        if (h.key === "Escape") {
          if (eo) if (at !== null) {
            at = null;
            const S = De();
            vt && S && (S.scene.remove(vt), vt.geometry.dispose(), vt.material.dispose(), vt = null), yt && S && (S.scene.remove(yt), yt.geometry.dispose(), yt.material.dispose(), yt = null), S == null ? void 0 : S.render();
          } else dn();
          Ct && cn(), Yt && (Yt = false, Mo(), (_a3 = ve.querySelector("#cad3d-inspect")) == null ? void 0 : _a3.classList.remove("inspect-active"));
        }
      }), C == null ? void 0 : C.addEventListener("keydown", (h) => {
        if (h.stopPropagation(), h.key === "Enter") {
          const S = C.value.trim();
          if (S) {
            R.unshift(S), g = -1, $ && ($.textContent += `> ${S}
`);
            try {
              const x = new Function("cad", `return ${S}`)(Re);
              if (x !== void 0 && $) {
                const z = typeof x == "object" ? JSON.stringify(x, null, 2) : String(x);
                $.textContent += `${z}
`;
              }
            } catch (x) {
              $ && ($.textContent += `ERROR: ${x.message}
`);
            }
            $ && ($.scrollTop = $.scrollHeight), C.value = "";
          }
        } else h.key === "ArrowUp" ? (h.preventDefault(), R.length > 0 && g < R.length - 1 && (g++, C.value = R[g])) : h.key === "ArrowDown" && (h.preventDefault(), g > 0 ? (g--, C.value = R[g]) : (g = -1, C.value = ""));
      });
      let f = false, k = 0, F = 0, q = 0, H = 0;
      ve.addEventListener("mousedown", (h) => {
        const S = h.target.tagName;
        if (S === "BUTTON" || S === "INPUT" || S === "SELECT") return;
        f = true;
        const x = ve.getBoundingClientRect();
        ve.style.bottom = "unset", k = h.clientX, F = h.clientY, q = x.left, H = x.top, h.preventDefault();
      }), window.addEventListener("mousemove", (h) => {
        f && (h.preventDefault(), ve.style.left = q + (h.clientX - k) + "px", ve.style.top = H + (h.clientY - F) + "px");
      }), window.addEventListener("mouseup", () => {
        f = false;
      }), Ne();
    }, 10);
    function De() {
      const t = document.getElementById("viewer");
      return t ? t.__ctx : null;
    }
    function $o() {
      const t = e.nodes.val;
      if (t.length === 0) return {
        center: new Me(),
        extent: 10
      };
      let o = 1 / 0, n = 1 / 0, l = 1 / 0, s = -1 / 0, u = -1 / 0, a = -1 / 0;
      for (const [r, c, m] of t) r < o && (o = r), r > s && (s = r), c < n && (n = c), c > u && (u = c), m < l && (l = m), m > a && (a = m);
      const i = new Me((o + s) / 2, (n + u) / 2, (l + a) / 2), d = Math.max(s - o, u - n, a - l, 1);
      return {
        center: i,
        extent: d
      };
    }
    function st(t = false) {
      const o = De();
      if (!o) return;
      const { extent: n } = $o();
      let l;
      n <= 5 ? l = Math.max(1, Math.ceil(n * 1.5)) : n <= 50 ? l = Math.max(5, Math.ceil(n * 1.3 / 5) * 5) : l = Math.max(20, Math.ceil(n * 1.3 / 10) * 10), o.settings.gridSize.val = l, o.scene.children.filter((m) => m.type === "GridHelper").forEach((m) => {
        var _a2, _b;
        (_a2 = m.geometry) == null ? void 0 : _a2.dispose(), (_b = m.material) == null ? void 0 : _b.dispose(), o.scene.remove(m);
      });
      const u = rl(), a = new il(l, 20, u.grid, u.grid);
      a.rotation.x = Math.PI / 2, a.position.set(0.5 * l, 0.5 * l, 0), o.scene.add(a), o.scene.children.filter((m) => m.type === "Group" && m.name !== "gridAxes" && m.name !== "loadsGroup" && (m.name === "viewerAxes" || m.children.some((w) => w instanceof fn))).forEach((m) => {
        m.traverse((w) => {
          w.geometry && w.geometry.dispose(), w.material && (w.material.map && w.material.map.dispose(), w.material.dispose());
        }), o.scene.remove(m);
      });
      const d = 0.05 * l, r = new nn();
      r.name = "viewerAxes";
      const c = u.axisArrow;
      r.add(new fn(new Me(1, 0, 0), new Me(), 1, c, 0.2, 0.2)), r.add(new fn(new Me(0, 1, 0), new Me(), 1, c, 0.2, 0.2)), r.add(new fn(new Me(0, 0, 1), new Me(), 1, c, 0.2, 0.2)), r.children.forEach((m) => m.scale.set(d, d, d));
      for (const [m, w, M] of [
        [
          "X",
          "red",
          [
            1.3 * d,
            0,
            0
          ]
        ],
        [
          "Y",
          "green",
          [
            0,
            1.3 * d,
            0
          ]
        ],
        [
          "Z",
          "blue",
          [
            0,
            0,
            1.3 * d
          ]
        ]
      ]) {
        const v = document.createElement("canvas");
        v.width = 64, v.height = 64;
        const p = v.getContext("2d");
        p.fillStyle = w, p.font = "bold 50px Arial", p.textAlign = "center", p.textBaseline = "middle", p.fillText(m, 32, 34);
        const b = new Qn(v);
        b.needsUpdate = true;
        const I = new un(new mn({
          map: b,
          depthTest: false,
          transparent: true
        }));
        I.position.set(M[0], M[1], M[2]), I.scale.set(0.4 * d, 0.4 * d, 1), I.renderOrder = 99, r.add(I);
      }
      o.scene.add(r), t ? o.render() : uo("3d");
    }
    function qs(t, o, n) {
      if (t.length < 2) return n * 10;
      let l = 1 / 0;
      return o > 0 && (l = Math.min(l, Math.abs(t[o] - t[o - 1]))), o < t.length - 1 && (l = Math.min(l, Math.abs(t[o + 1] - t[o]))), l * 0.45 || n * 0.1;
    }
    function uo(t) {
      var _a2;
      const o = De();
      if (!o) return;
      const { center: n, extent: l } = $o(), s = o.renderer.domElement.clientWidth / (o.renderer.domElement.clientHeight || 1), u = l * 0.7;
      o.controls.maxDistance = l * 5, o.controls.minDistance = l * 0.05, o.renderer.clippingPlanes = [];
      const a = () => {
        o.scene.traverse((i) => {
          var _a3;
          if (!i.material) return;
          const d = i.type === "GridHelper" || i.type === "AxesHelper", r = i.isSprite, c = ((_a3 = i.userData) == null ? void 0 : _a3.noClip) === true;
          (d || r || c) && (Array.isArray(i.material) ? i.material.forEach((m) => {
            m.clippingPlanes = [];
          }) : i.material.clippingPlanes = []);
        });
      };
      if (t === "3d") {
        const i = o.perspCamera.fov, d = l / (2 * Math.tan(i * Math.PI / 360)) * 2.2;
        o.perspCamera.position.set(n.x + d * 0.5, n.y - d * 0.8, n.z + d * 0.5), o.controls.target.copy(n), o.setActiveCamera(o.perspCamera);
      } else {
        const i = o.orthoCamera;
        i.left = -u * s, i.right = u * s, i.top = u, i.bottom = -u, i.near = -l * 10, i.far = l * 10, i.updateProjectionMatrix();
        const d = (r, c, m) => {
          i.position.copy(r), i.up.copy(m), o.controls.target.copy(c), i.lookAt(c), o.controls.update();
        };
        if (t === "plan") o.renderer.clippingPlanes = [], d(new Me(n.x, n.y, n.z + l * 2), new Me(n.x, n.y, n.z), new Me(0, 1, 0));
        else if (t.startsWith("plan:")) {
          const r = parseInt(t.split(":")[1]), c = ((_a2 = J.hPiso) == null ? void 0 : _a2.val) ?? 3, m = (r + 1) * c, w = c * 0.45;
          o.renderer.clippingPlanes = [
            new ho(new Me(0, 0, -1), m + w),
            new ho(new Me(0, 0, 1), -m + w)
          ], a(), d(new Me(n.x, n.y, m + l * 2), new Me(n.x, n.y, m), new Me(0, 1, 0));
        } else if (t === "elevX") i.position.set(n.x + l * 2, n.y, n.z), i.up.set(0, 0, 1);
        else if (t === "elevY") i.position.set(n.x, n.y - l * 2, n.z), i.up.set(0, 0, 1);
        else if (t.startsWith("axisX:")) {
          const r = parseInt(t.split(":")[1]), c = Ve[r] ?? n.x;
          if (Ke.length > 1) {
            const w = qs(Ve, r, l);
            o.renderer.clippingPlanes = [
              new ho(new Me(-1, 0, 0), c + w),
              new ho(new Me(1, 0, 0), -c + w)
            ], a(), i.position.set(n.x + l * 2, n.y, n.z), o.controls.target.set(n.x, n.y, n.z);
          } else i.position.set(n.x, n.y - l * 2, n.z), o.controls.target.copy(n);
          i.up.set(0, 0, 1);
        } else if (t.startsWith("axisY:")) {
          const r = parseInt(t.split(":")[1]), c = Ke[r] ?? n.y;
          if (Ve.length > 1) {
            const w = qs(Ke, r, l);
            o.renderer.clippingPlanes = [
              new ho(new Me(0, -1, 0), c + w),
              new ho(new Me(0, 1, 0), -c + w)
            ], a(), i.position.set(n.x, n.y - l * 2, n.z), o.controls.target.set(n.x, n.y, n.z);
          } else i.position.set(n.x + l * 2, n.y, n.z), o.controls.target.copy(n);
          i.up.set(0, 0, 1);
        }
        !t.startsWith("axisX:") && !t.startsWith("axisY:") && o.controls.target.copy(n), o.setActiveCamera(i);
      }
    }
    function Nn() {
      const t = ve.querySelector("#cad3d-axis-buttons");
      if (!t) return;
      if (Ve.length < 2 && Ke.length < 2) {
        t.style.display = "none";
        return;
      }
      t.style.display = "", t.innerHTML = "";
      const o = (u, a, i) => {
        const d = document.createElement("button");
        return d.textContent = u, d.dataset.view = a, d.title = i, d.style.cssText = "min-width:22px;padding:1px 5px;font-weight:bold", d.addEventListener("click", (r) => {
          var _a2;
          r.stopPropagation();
          const c = d.classList.contains("view-active");
          ve.querySelectorAll("[data-view]").forEach((m) => m.classList.remove("view-active")), c ? (uo("3d"), (_a2 = ve.querySelector('[data-view="3d"]')) == null ? void 0 : _a2.classList.add("view-active")) : (uo(a), d.classList.add("view-active"));
        }), d;
      }, n = document.createElement("span");
      n.textContent = "Ejes:", n.style.cssText = "color:#888;font-size:10px;margin-right:2px;align-self:center", t.appendChild(n);
      const l = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      Ve.forEach((u, a) => {
        const i = a < l.length ? l[a] : `X${a}`;
        t.appendChild(o(i, `axisX:${a}`, `Eje ${i} \u2014 elevaci\xF3n mirando en Y`));
      });
      const s = document.createElement("span");
      s.textContent = "|", s.style.cssText = "color:#555;margin:0 3px;align-self:center;font-weight:bold", t.appendChild(s), Ke.forEach((u, a) => {
        const i = `${a + 1}`;
        t.appendChild(o(i, `axisY:${a}`, `Eje ${i} \u2014 elevaci\xF3n mirando en X`));
      });
    }
    function Hn() {
      var _a2;
      const t = ve.querySelector("#cad3d-floor-buttons");
      if (!t) return;
      const o = Math.round(((_a2 = J.nPisos) == null ? void 0 : _a2.val) ?? 0);
      if (o < 1) {
        t.style.display = "none";
        return;
      }
      t.style.display = "", t.innerHTML = "";
      const n = (s, u, a) => {
        const i = document.createElement("button");
        return i.textContent = s, i.dataset.view = u, i.title = a, i.style.cssText = "min-width:22px;padding:1px 5px;font-weight:bold", i.addEventListener("click", (d) => {
          var _a3;
          d.stopPropagation();
          const r = i.classList.contains("view-active");
          ve.querySelectorAll("[data-view]").forEach((c) => c.classList.remove("view-active")), r ? (uo("3d"), (_a3 = ve.querySelector('[data-view="3d"]')) == null ? void 0 : _a3.classList.add("view-active")) : (uo(u), i.classList.add("view-active"));
        }), i;
      }, l = document.createElement("span");
      l.textContent = "Planta:", l.style.cssText = "color:#888;font-size:10px;margin-right:2px;align-self:center", t.appendChild(l);
      for (let s = 0; s < o; s++) t.appendChild(n(`P${s + 1}`, `plan:${s}`, `Planta Piso ${s + 1}`));
    }
    function Ca() {
      uo("3d"), ve.querySelectorAll("[data-view]").forEach((t) => t.classList.toggle("view-active", t.dataset.view === "3d"));
    }
    Re.view = (t) => {
      t = {
        planta: "plan",
        elevationX: "elevX",
        elevationY: "elevY",
        corte: "section"
      }[t] || t, uo(t), ve.querySelectorAll("[data-view]").forEach((n) => n.classList.toggle("view-active", n.dataset.view === t));
    };
    let Yt = false, Ct = false, eo = false, St = "line", Rt = [], at = null, vt = null, yt = null, qo = null, Ht = null;
    const ct = {
      node: true,
      grid: true,
      midpoint: true,
      track: true
    }, Bn = 0.5;
    let Dn = [], Bt = null, wo = null;
    const _o = [], rn = [], Aa = 50;
    function Ro() {
      _o.push({
        nodes: JSON.parse(JSON.stringify(e.nodes.val)),
        elements: JSON.parse(JSON.stringify(e.elements.val))
      }), _o.length > Aa && _o.shift(), rn.length = 0;
    }
    function _s() {
      if (_o.length === 0) return;
      rn.push({
        nodes: JSON.parse(JSON.stringify(e.nodes.val)),
        elements: JSON.parse(JSON.stringify(e.elements.val))
      });
      const t = _o.pop();
      e.nodes.val = t.nodes, e.elements.val = t.elements, fo(), e.elementInputs.val = {
        ...e.elementInputs.val
      };
    }
    function Rs() {
      if (rn.length === 0) return;
      _o.push({
        nodes: JSON.parse(JSON.stringify(e.nodes.val)),
        elements: JSON.parse(JSON.stringify(e.elements.val))
      });
      const t = rn.pop();
      e.nodes.val = t.nodes, e.elements.val = t.elements, fo(), e.elementInputs.val = {
        ...e.elementInputs.val
      };
    }
    const et = /* @__PURE__ */ new Set();
    let At = null, mo = [], Ot = null, to = null;
    function jn(t) {
      const o = De();
      if (!o) return;
      const n = e.nodes.val, l = e.elements.val[t];
      if (!l) return;
      const s = [];
      for (let i = 0; i < l.length; i++) {
        const d = n[l[i]], r = n[l[(i + 1) % l.length]];
        s.push(d[0], d[1], d[2], r[0], r[1], r[2]);
      }
      const u = new Dt();
      u.setAttribute("position", new ko(s, 3));
      const a = new Bo(u, new Do({
        color: 16711935,
        linewidth: 3,
        depthTest: false
      }));
      a.renderOrder = 9998, a.__elemIdx = t, o.scene.add(a), mo.push(a), o.render();
    }
    function bo() {
      const t = De();
      mo.forEach((o) => {
        t == null ? void 0 : t.scene.remove(o), o.geometry.dispose(), o.material.dispose();
      }), mo = [], t == null ? void 0 : t.render();
    }
    function go() {
      to && to.remove();
      const t = K.size > 0 || ne;
      if (et.size === 0 && !t) {
        to = null;
        return;
      }
      const o = document.createElement("div");
      o.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--cad-bg);color:var(--cad-text);border:2px solid var(--cad-heading);border-radius:8px;padding:10px 16px;z-index:10000;font-family:monospace;font-size:13px;display:flex;gap:12px;align-items:center;box-shadow:0 4px 20px var(--cad-shadow);", o.innerHTML = `
      <span style="color:var(--cad-heading);font-weight:bold;">${et.size} elem.</span>
      <button id="sel-assign" style="padding:5px 8px;background:#336699;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Asignar secci\xF3n">\u{1F4D0}</button>
      <button id="sel-info" style="padding:5px 8px;background:#225588;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Info del elemento">\u{1F50D}</button>
      <button id="sel-hide" style="padding:5px 8px;background:#665500;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Ocultar seleccionados">\u{1F441}\u200D\u{1F5E8}</button>
      <button id="sel-isolate" style="padding:5px 8px;background:#006633;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Aislar (mostrar solo seleccionados)">\u25CE</button>
      <button id="sel-showall" style="padding:5px 8px;background:#444;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Mostrar todo">\u21BA</button>
      <button id="sel-delete" style="padding:5px 8px;background:#cc3333;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Eliminar seleccionados">\u{1F5D1}</button>
      <button id="sel-clear" style="padding:5px 8px;background:#555;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Limpiar selecci\xF3n">\u2715</button>
    `, document.body.appendChild(o), to = o, o.querySelector("#sel-assign").addEventListener("click", () => {
        Xa([
          ...et
        ]);
      }), o.querySelector("#sel-info").addEventListener("click", () => {
        if (et.size === 1) {
          const n = [
            ...et
          ][0];
          Ws(n);
        } else {
          const n = [
            ...et
          ], l = e.nodes.val, s = e.elements.val;
          let u = 0, a = 0, i = 0, d = 0;
          n.forEach((c) => {
            const m = s[c];
            if (m) if (m.length === 2) {
              const w = l[m[0]], M = l[m[1]], v = Math.abs(M[0] - w[0]), p = Math.abs(M[1] - w[1]), b = Math.abs(M[2] - w[2]);
              b > v && b > p ? u++ : a++;
            } else m.length === 3 ? i++ : m.length === 4 && d++;
          });
          const r = [];
          u && r.push(`${u} columnas`), a && r.push(`${a} vigas`), d && r.push(`${d} shells Q4`), i && r.push(`${i} triangulos`), alert(`${n.length} elementos seleccionados:
${r.join(", ")}`);
        }
      }), o.querySelector("#sel-hide").addEventListener("click", () => {
        et.forEach((n) => K.add(n)), et.clear(), bo(), go(), we();
      }), o.querySelector("#sel-isolate").addEventListener("click", () => {
        ne = true, ge.clear(), et.forEach((n) => ge.add(n)), et.clear(), bo(), go(), we();
      }), o.querySelector("#sel-showall").addEventListener("click", () => {
        K.clear(), ne = false, ge.clear(), go(), we();
      }), o.querySelector("#sel-delete").addEventListener("click", () => {
        Ro(), et.forEach((n) => Q.add(n)), et.clear(), bo(), go(), we();
      }), o.querySelector("#sel-clear").addEventListener("click", () => {
        et.clear(), bo(), go();
      });
    }
    function cn() {
      var _a2;
      Ct = false, et.clear(), bo(), to && (to.remove(), to = null), (_a2 = ve.querySelector("#cad3d-select")) == null ? void 0 : _a2.classList.remove("inspect-active");
      const o = De();
      o && (o.controls.enabled = true);
    }
    function Mo() {
      if (At) {
        const t = De();
        t == null ? void 0 : t.scene.remove(At), At.geometry.dispose(), At.material.dispose(), At = null, t == null ? void 0 : t.render();
      }
      Ot && (Ot.remove(), Ot = null);
    }
    function Fa(t) {
      Wn();
      const o = De();
      if (!o) return;
      const n = e.nodes.val[t];
      if (!n) return;
      wo = t;
      const l = 200, s = [
        [
          [
            1,
            0,
            0
          ],
          16724787,
          "X"
        ],
        [
          [
            0,
            1,
            0
          ],
          3407667,
          "Y"
        ],
        [
          [
            0,
            0,
            1
          ],
          3355647,
          "Z"
        ]
      ];
      for (const [u, a] of s) {
        const i = new Float32Array([
          n[0] - u[0] * l,
          n[1] - u[1] * l,
          n[2] - u[2] * l,
          n[0] + u[0] * l,
          n[1] + u[1] * l,
          n[2] + u[2] * l
        ]), d = new Dt();
        d.setAttribute("position", new yn(i, 3));
        const r = new Ho({
          color: a,
          dashSize: 0.3,
          gapSize: 0.15,
          transparent: true,
          opacity: 0.4,
          depthTest: false
        }), c = new Bo(d, r);
        c.computeLineDistances(), c.renderOrder = 9990, o.scene.add(c), Dn.push(c);
      }
      o.render();
    }
    function Wn() {
      const t = De();
      for (const o of Dn) t == null ? void 0 : t.scene.remove(o), o.geometry.dispose(), o.material.dispose();
      Dn = [], wo = null, Bt && (Bt.remove(), Bt = null);
    }
    function Os(t, o, n, l) {
      Bt || (Bt = document.createElement("div"), Bt.style.cssText = "position:fixed;pointer-events:none;z-index:10002;background:var(--cad-bg);color:var(--cad-heading);font-family:monospace;font-size:11px;padding:2px 6px;border-radius:3px;white-space:nowrap;border:1px solid var(--cad-border);", document.body.appendChild(Bt));
      const s = l.x - n.x, u = l.y - n.y, a = l.z - n.z, i = Math.sqrt(s * s + u * u + a * a), d = Math.abs(s), r = Math.abs(u), c = Math.abs(a);
      let m = "";
      d > r && d > c ? m = `\u0394X=${s.toFixed(2)}` : r > d && r > c ? m = `\u0394Y=${u.toFixed(2)}` : c > 0.01 && (m = `\u0394Z=${a.toFixed(2)}`), Bt.textContent = `${i.toFixed(3)} m  ${m}`, Bt.style.left = t + 20 + "px", Bt.style.top = o - 10 + "px";
    }
    function Pa(t, o) {
      const l = e.nodes.val[o];
      if (!l) return null;
      const s = new Me(l[0], l[1], l[2]), u = t.clone(), a = u.clone().sub(s), i = 0.3, d = Math.abs(a.x), r = Math.abs(a.y), c = Math.abs(a.z);
      return r < i && c < i && d > 0.01 ? new Me(u.x, s.y, s.z) : d < i && c < i && r > 0.01 ? new Me(s.x, u.y, s.z) : d < i && r < i && c > 0.01 ? new Me(s.x, s.y, u.z) : null;
    }
    function dn() {
      var _a2;
      const t = De();
      vt && t && (t.scene.remove(vt), vt.geometry.dispose(), vt.material.dispose(), vt = null), yt && t && (t.scene.remove(yt), yt.geometry.dispose(), yt.material.dispose(), yt = null), Wn(), at = null, Ht = null, eo = false, qo && (qo.remove(), qo = null), (_a2 = ve.querySelector("#cad3d-draw")) == null ? void 0 : _a2.classList.remove("inspect-active"), t == null ? void 0 : t.render();
    }
    function qa() {
      qo && qo.remove();
      const t = document.createElement("div");
      t.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);background:var(--cad-bg);border:1px solid var(--cad-border);border-radius:6px;padding:6px 10px;z-index:10000;display:flex;gap:6px;align-items:center;font-family:monospace;font-size:11px;box-shadow:0 2px 10px var(--cad-shadow);";
      const o = (s) => `padding:4px 10px;border:1px solid ${s ? "#00ccff" : "#555"};background:${s ? "#003355" : "#333"};color:${s ? "#00ccff" : "#ccc"};border-radius:3px;cursor:pointer;font-size:11px;font-family:monospace;`, n = (s) => `padding:3px 6px;border:1px solid ${s ? "#33ff33" : "#444"};background:${s ? "#113311" : "#222"};color:${s ? "#33ff33" : "#888"};border-radius:3px;cursor:pointer;font-size:10px;`;
      t.innerHTML = `
      <span style="color:#00ccff;font-weight:bold;margin-right:4px;">Draw:</span>
      <button id="dt-line" style="${o(St === "line")}">\u{1F4CF} Line</button>
      <button id="dt-arc" style="${o(St === "arc")}">\u2312 Arc</button>
      <button id="dt-node" style="${o(St === "node")}">\u2295 Node</button>
      <button id="dt-area" style="${o(St === "area")}">\u25A2 Area</button>
      <span style="color:#666;margin:0 4px;">|</span>
      <span style="color:#888;font-size:10px;">Snap:</span>
      <button id="ds-node" style="${n(ct.node)}">Node</button>
      <button id="ds-grid" style="${n(ct.grid)}">Grid</button>
      <button id="ds-mid" style="${n(ct.midpoint)}">Mid</button>
      <button id="ds-track" style="${n(ct.track)}">Prolong</button>
      <span style="color:#666;margin:0 4px;">|</span>
      <span style="color:#888;font-size:10px;">Grid:</span>
      <input id="ds-gridsize" type="number" value="${Bn}" step="0.1" min="0.1" max="10" style="width:45px;background:#333;color:#fff;border:1px solid #555;padding:2px;font-size:10px;">
      <span style="color:#888;font-size:10px;">m</span>
      <span style="color:#666;margin:0 4px;">|</span>
      <button id="dt-undo" style="padding:3px 6px;background:#444;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:10px;" title="Ctrl+Z">\u21A9 Undo</button>
      <button id="dt-redo" style="padding:3px 6px;background:#444;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:10px;" title="Ctrl+Y">\u21AA Redo</button>
    `, document.body.appendChild(t), qo = t;
      const l = () => {
        const s = t.querySelector("#dt-line"), u = t.querySelector("#dt-arc"), a = t.querySelector("#dt-node"), i = t.querySelector("#dt-area");
        s && (s.style.cssText = o(St === "line")), u && (u.style.cssText = o(St === "arc")), a && (a.style.cssText = o(St === "node")), i && (i.style.cssText = o(St === "area"));
        const d = t.querySelector("#ds-node"), r = t.querySelector("#ds-grid"), c = t.querySelector("#ds-mid"), m = t.querySelector("#ds-track");
        d && (d.style.cssText = n(ct.node)), r && (r.style.cssText = n(ct.grid)), c && (c.style.cssText = n(ct.midpoint)), m && (m.style.cssText = n(ct.track));
      };
      t.querySelector("#dt-line").addEventListener("click", () => {
        St = "line", at = null, Ht = null, Rt = [], l();
      }), t.querySelector("#dt-arc").addEventListener("click", () => {
        St = "arc", at = null, Ht = null, Rt = [], l();
      }), t.querySelector("#dt-node").addEventListener("click", () => {
        St = "node", at = null, Ht = null, Rt = [], l();
      }), t.querySelector("#dt-area").addEventListener("click", () => {
        St = "area", at = null, Ht = null, Rt = [], console.log("Area mode: click vertices del poligono. Doble-click o click cerca del 1er punto para cerrar."), l();
      }), t.querySelector("#ds-node").addEventListener("click", () => {
        ct.node = !ct.node, l();
      }), t.querySelector("#ds-grid").addEventListener("click", () => {
        ct.grid = !ct.grid, l();
      }), t.querySelector("#ds-mid").addEventListener("click", () => {
        ct.midpoint = !ct.midpoint, l();
      }), t.querySelector("#ds-track").addEventListener("click", () => {
        ct.track = !ct.track, ct.track || Wn(), l();
      }), t.querySelector("#ds-gridsize").addEventListener("change", (s) => {
        ct.gridSize = parseFloat(s.target.value) || 0.5;
      }), t.querySelector("#dt-undo").addEventListener("click", () => _s()), t.querySelector("#dt-redo").addEventListener("click", () => Rs());
    }
    function Ns(t, o, n, l) {
      const s = l.getBoundingClientRect(), u = (t - s.left) / s.width * 2 - 1, a = -((o - s.top) / s.height) * 2 + 1, i = new la();
      i.setFromCamera(new ra(u, a), n);
      const d = e.nodes.val, r = e.elements.val, c = 0.12;
      if (ct.node) {
        let M = -1, v = 1 / 0;
        for (let p = 0; p < d.length; p++) {
          const b = d[p], I = new Me(b[0], b[1], b[2]).project(n), E = Math.sqrt((I.x - u) ** 2 + (I.y - a) ** 2);
          E < c && E < v && (v = E, M = p);
        }
        if (M >= 0) return {
          nodeIdx: M,
          worldPos: new Me(...d[M]),
          snapType: "node"
        };
      }
      if (ct.midpoint) {
        let M = 1 / 0, v = null;
        for (const p of r) {
          if (p.length !== 2) continue;
          const b = d[p[0]], I = d[p[1]], E = new Me((b[0] + I[0]) / 2, (b[1] + I[1]) / 2, (b[2] + I[2]) / 2), $ = E.clone().project(n), C = Math.sqrt(($.x - u) ** 2 + ($.y - a) ** 2);
          C < c * 0.8 && C < M && (M = C, v = E);
        }
        if (v) return {
          nodeIdx: null,
          worldPos: v,
          snapType: "mid"
        };
      }
      if (ct.grid) {
        const M = new ho(new Me(0, 0, 1), 0), v = new Me();
        if (i.ray.intersectPlane(M, v)) {
          const p = ct.gridSize || Bn;
          return v.x = Math.round(v.x / p) * p, v.y = Math.round(v.y / p) * p, v.z = Math.round(v.z / p) * p, {
            nodeIdx: null,
            worldPos: v,
            snapType: "grid"
          };
        }
      }
      const m = new ho(new Me(0, 0, 1), 0), w = new Me();
      return i.ray.intersectPlane(m, w), {
        nodeIdx: null,
        worldPos: w,
        snapType: "free"
      };
    }
    function Hs(t) {
      const o = De();
      if (!o) return;
      const n = e.nodes.val;
      if (yt && (o.scene.remove(yt), yt.geometry.dispose(), yt.material.dispose(), yt = null), t.worldPos) {
        const l = t.snapType === "node" ? 16776960 : t.snapType === "mid" ? 16711935 : t.snapType === "grid" ? 65535 : 8947848, s = t.snapType === "node" ? 0.08 : 0.06, u = t.snapType === "mid" ? new nl(s * 2, s * 2, s * 2) : new sl(s, 12, 12), a = new al({
          color: l,
          transparent: true,
          opacity: 0.8,
          depthTest: false
        });
        yt = new ba(u, a), yt.position.copy(t.worldPos), yt.renderOrder = 9999, o.scene.add(yt);
      }
      if (vt && (o.scene.remove(vt), vt.geometry.dispose(), vt.material.dispose(), vt = null), at !== null && t.worldPos) {
        const l = n[at], s = new Dt();
        if (St === "arc" && Ht !== null) {
          const a = n[Ht], i = Bs(new Me(l[0], l[1], l[2]), new Me(a[0], a[1], a[2]), t.worldPos, 16), d = [];
          for (let r = 0; r < i.length - 1; r++) d.push(i[r].x, i[r].y, i[r].z, i[r + 1].x, i[r + 1].y, i[r + 1].z);
          s.setAttribute("position", new ko(d, 3));
        } else s.setAttribute("position", new ko([
          l[0],
          l[1],
          l[2],
          t.worldPos.x,
          t.worldPos.y,
          t.worldPos.z
        ], 3));
        const u = new Do({
          color: 65280,
          linewidth: 2,
          depthTest: false
        });
        vt = new Eo(s, u), St === "arc" && Ht !== null && (vt = new Bo(s, u)), vt.renderOrder = 9999, o.scene.add(vt);
      }
      o.render();
    }
    function Bs(t, o, n, l) {
      const s = [];
      for (let u = 0; u <= l; u++) {
        const a = u / l, i = o.clone().multiplyScalar(2).sub(t.clone().multiplyScalar(0.5)).sub(n.clone().multiplyScalar(0.5)), d = (1 - a) * (1 - a), r = 2 * (1 - a) * a, c = a * a;
        s.push(new Me(d * t.x + r * i.x + c * n.x, d * t.y + r * i.y + c * n.y, d * t.z + r * i.z + c * n.z));
      }
      return s;
    }
    function Gn(t) {
      if (t.nodeIdx !== null) return t.nodeIdx;
      if (!t.worldPos) return -1;
      const o = e.nodes.val, n = 1e-3;
      for (let s = 0; s < o.length; s++) if (Math.abs(o[s][0] - t.worldPos.x) < n && Math.abs(o[s][1] - t.worldPos.y) < n && Math.abs(o[s][2] - t.worldPos.z) < n) return s;
      Ro();
      const l = [
        ...o,
        [
          t.worldPos.x,
          t.worldPos.y,
          t.worldPos.z
        ]
      ];
      return e.nodes.val = l, l.length - 1;
    }
    function _a(t) {
      var _a2;
      if (St === "node") {
        if (!t.worldPos) return;
        Ro();
        const o = [
          ...e.nodes.val
        ];
        o.push([
          t.worldPos.x,
          t.worldPos.y,
          t.worldPos.z
        ]), e.nodes.val = o;
        return;
      }
      if (St === "line") {
        const o = Gn(t);
        if (o < 0) return;
        if (at === null) {
          at = o;
          return;
        }
        if (o === at) return;
        Ro();
        const n = [
          ...e.elements.val
        ];
        n.some((s) => s.length === 2 && (s[0] === at && s[1] === o || s[1] === at && s[0] === o)) || (n.push([
          at,
          o
        ]), e.elements.val = n, fo(), e.elementInputs.val = {
          ...e.elementInputs.val
        }), at = o;
        return;
      }
      if (St === "arc") {
        const o = Gn(t);
        if (o < 0) return;
        if (at === null) {
          at = o;
          return;
        }
        if (Ht === null) {
          if (o === at) return;
          Ht = o;
          return;
        }
        if (o === at || o === Ht) return;
        const n = e.nodes.val, l = new Me(...n[at]), s = new Me(...n[Ht]), u = new Me(...n[o]), a = Math.max(4, Math.round(((_a2 = J.nSubViga) == null ? void 0 : _a2.val) ?? 8)), i = Bs(l, s, u, a);
        Ro();
        const d = [
          ...e.nodes.val
        ], r = [
          ...e.elements.val
        ];
        let c = at;
        for (let m = 1; m < i.length; m++) {
          let w;
          if (m === i.length - 1) w = o;
          else {
            const M = i[m];
            w = d.length, d.push([
              M.x,
              M.y,
              M.z
            ]);
          }
          r.push([
            c,
            w
          ]), c = w;
        }
        e.nodes.val = d, e.elements.val = r, fo(), e.elementInputs.val = {
          ...e.elementInputs.val
        }, at = o, Ht = null;
        return;
      }
      if (St === "area") {
        const o = Gn(t);
        if (o < 0) return;
        if (Rt.length >= 3 && o === Rt[0]) {
          Ro();
          const n = [
            ...e.nodes.val
          ], l = [
            ...e.elements.val
          ], s = Rt.map((u) => n[u]);
          try {
            const u = lo({
              points: s,
              polygon: Array.from({
                length: s.length
              }, (i, d) => d),
              maxMeshSize: Bn || 0.5
            }), a = [];
            for (const i of u.nodes) {
              let d = -1;
              for (let r = 0; r < n.length; r++) {
                const c = Math.abs(n[r][0] - i[0]), m = Math.abs(n[r][1] - i[1]), w = Math.abs(n[r][2] - i[2]);
                if (c < 0.01 && m < 0.01 && w < 0.01) {
                  d = r;
                  break;
                }
              }
              d >= 0 ? a.push(d) : (a.push(n.length), n.push([
                i[0],
                i[1],
                i[2]
              ]));
            }
            for (const i of u.elements) l.push([
              a[i[0]],
              a[i[1]],
              a[i[2]]
            ]);
            e.nodes.val = n, e.elements.val = l, fo(), console.log(`Area: ${u.elements.length} triangulos creados desde ${Rt.length} vertices`);
          } catch (u) {
            console.error("Area mesh failed:", u.message);
          }
          Rt = [];
          return;
        }
        if (Rt.push(o), console.log(`Area vertex ${Rt.length}: node ${o}`), Rt.length >= 2) {
          const n = Rt[Rt.length - 2], l = e.nodes.val, s = De();
          if (s) {
            const u = new Dt().setFromPoints([
              new Me(...l[n]),
              new Me(...l[o])
            ]), a = new Bo(u, new Do({
              color: 65280,
              linewidth: 2
            }));
            a.name = "area-preview", s.scene.add(a), s.render();
          }
        }
        return;
      }
    }
    function Ds(t) {
      const o = De();
      if (!o) return;
      At && (o.scene.remove(At), At.geometry.dispose(), At.material.dispose());
      const n = e.nodes.val, l = e.elements.val[t];
      if (!l) return;
      const s = [];
      for (let a = 0; a < l.length; a++) {
        const i = n[l[a]], d = n[l[(a + 1) % l.length]];
        s.push(i[0], i[1], i[2], d[0], d[1], d[2]);
      }
      const u = new Dt();
      u.setAttribute("position", new ko(s, 3)), At = new Bo(u, new Do({
        color: 16776960,
        linewidth: 3,
        depthTest: false
      })), At.renderOrder = 9999, o.scene.add(At), o.render();
    }
    function Yn(t) {
      const o = De();
      if (!o) return -1;
      const n = o.renderer.domElement.getBoundingClientRect(), l = new ra((t.clientX - n.left) / n.width * 2 - 1, -((t.clientY - n.top) / n.height) * 2 + 1), s = new la();
      s.setFromCamera(l, o.controls.object), s.params.Line = {
        threshold: 0.5
      };
      const u = e.nodes.val, a = e.elements.val;
      if (u.length === 0 || a.length === 0) return -1;
      let i = 1 / 0, d = -1;
      const r = s.ray;
      for (let m = 0; m < a.length; m++) {
        const w = a[m];
        if (w.length === 2) {
          const M = new Me(...u[w[0]]), v = new Me(...u[w[1]]), p = new ll(M, v), b = new Me(), I = new Me();
          r.closestPointToPoint(p.getCenter(new Me()), b), p.closestPointToPoint(b, true, I);
          const E = b.distanceTo(I);
          E < i && (i = E, d = m);
        } else if (w.length === 3) {
          const M = new Me(...u[w[0]]), v = new Me(...u[w[1]]), p = new Me(...u[w[2]]), b = new Me();
          if (r.intersectTriangle(M, v, p, false, b)) {
            const E = r.origin.distanceTo(b);
            E < i && (i = E, d = m);
          } else {
            const E = M.add(v).add(p).divideScalar(3), $ = new Me();
            r.closestPointToPoint(E, $);
            const C = $.distanceTo(E);
            C < i && (i = C, d = m);
          }
        } else if (w.length === 4) {
          const M = new Me(...u[w[0]]), v = new Me(...u[w[1]]), p = new Me(...u[w[2]]), b = new Me(...u[w[3]]), I = new Me();
          let E = r.intersectTriangle(M, v, p, false, I);
          if (E) {
            const $ = r.origin.distanceTo(I);
            $ < i && (i = $, d = m);
          }
          if (E = r.intersectTriangle(M, p, b, false, I), E) {
            const $ = r.origin.distanceTo(I);
            $ < i && (i = $, d = m);
          }
        }
      }
      const { extent: c } = $o();
      return i < c * 0.1 ? d : -1;
    }
    function pe(t, o = 4) {
      return Math.abs(t) < 1e-10 ? "0" : Math.abs(t) >= 1e6 ? t.toExponential(2) : Math.abs(t) >= 100 ? t.toFixed(1) : t.toFixed(o);
    }
    function Vn(t, o, n = 12) {
      var _a2;
      const l = Math.min(t.length, n), s = Math.min(((_a2 = t[0]) == null ? void 0 : _a2.length) || 0, n);
      let u = "<table>";
      if (o) {
        u += '<tr><td class="header"></td>';
        for (let a = 0; a < s; a++) u += `<td class="header">${o[a] || a}</td>`;
        u += "</tr>";
      }
      for (let a = 0; a < l; a++) {
        u += "<tr>", o && (u += `<td class="header">${o[a] || a}</td>`);
        for (let i = 0; i < s; i++) {
          const d = t[a][i], r = Math.abs(d) > 1e-10 ? "nonzero" : "";
          u += `<td class="${r}">${pe(d, 2)}</td>`;
        }
        u += "</tr>";
      }
      return u += "</table>", u;
    }
    function Ie(t, o) {
      return `<span class="frac"><span class="frac-num">${t}</span><span class="frac-den">${o}</span></span>`;
    }
    function T(t, o, n) {
      let l = `<span class="var">${t}</span>`;
      return o && (l += `<sub>${o}</sub>`), l;
    }
    function Ra(t, o, n, l, s, u, a) {
      const i = 0.8333333333333334 * o, d = 5 / 6 * o, r = d > 0 && s > 0 ? 12 * t * n / (s * d * a ** 2) : 0, c = i > 0 && s > 0 ? 12 * t * l / (s * i * a ** 2) : 0, m = t * o / a, w = s * u / a, M = 12 * t * n / a ** 3 / (1 + r), v = 6 * t * n / a ** 2 / (1 + r), p = 4 * t * n / a * (1 + r / 4) / (1 + r), b = 2 * t * n / a * (1 - r / 2) / (1 + r), I = r > 1e-10 || c > 1e-10;
      return `<div class="fem-eq eq-box">
      <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">Formulaci\xF3n: ${I ? "Timoshenko (con deformaci\xF3n por cortante)" : "Euler-Bernoulli"}</strong></div>
      ${I ? `
      <div style="text-align:left;margin-bottom:6px;color:var(--fem-eq-sub)">
        ${T("A", "s")} = ${Ie("5", "6")} \xB7 ${T("A")} = <span class="highlight">${pe(i)}</span>
        &nbsp;&nbsp; \u03C6<sub>z</sub> = ${Ie("12\xB7" + T("E") + "\xB7" + T("I", "z"), T("G") + "\xB7" + T("A", "s") + "\xB7" + T("L") + "\xB2")} = <span class="highlight">${pe(r)}</span>
        &nbsp;&nbsp; \u03C6<sub>y</sub> = <span class="highlight">${pe(c)}</span>
      </div>
      <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">Coeficientes Timoshenko (Dr. Aguiar):</strong></div>
      <div>${T("t", "z")} = ${Ie("12\xB7" + T("E") + "\xB7" + T("I", "z"), T("L") + "\xB3\xB7(1+\u03C6<sub>z</sub>)")} = <span class="highlight">${pe(M)}</span> &nbsp;(cortante)</div>
      <div>${T("b", "z")} = ${Ie("6\xB7" + T("E") + "\xB7" + T("I", "z"), T("L") + "\xB2\xB7(1+\u03C6<sub>z</sub>)")} = <span class="highlight">${pe(v)}</span> &nbsp;(acoplamiento)</div>
      <div>${T("k", "z")} = ${Ie("4\xB7" + T("E") + "\xB7" + T("I", "z") + "\xB7(1+\u03C6/4)", T("L") + "\xB7(1+\u03C6<sub>z</sub>)")} = <span class="highlight">${pe(p)}</span> &nbsp;(flexi\xF3n diagonal)</div>
      <div>${T("a", "z")} = ${Ie("2\xB7" + T("E") + "\xB7" + T("I", "z") + "\xB7(1\u2212\u03C6/2)", T("L") + "\xB7(1+\u03C6<sub>z</sub>)")} = <span class="highlight">${pe(b)}</span> &nbsp;(flexi\xF3n off-diag)</div>
      ` : `
      <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">Coeficientes de rigidez:</strong></div>
      `}
      <div>${Ie(T("E") + "\xB7" + T("A"), T("L"))} = <span class="highlight">${pe(m)}</span> &nbsp;(axial)</div>
      <div>${Ie(T("G") + "\xB7" + T("J"), T("L"))} = <span class="highlight">${pe(w)}</span> &nbsp;(torsi\xF3n)</div>
      ${I ? "" : `
      <div>${Ie("12\xB7" + T("E") + "\xB7" + T("I", "z"), T("L") + "\xB3")} = <span class="highlight">${pe(M)}</span></div>
      <div>${Ie("4\xB7" + T("E") + "\xB7" + T("I", "z"), T("L"))} = <span class="highlight">${pe(p)}</span></div>
      `}
    </div>
    <div class="fem-eq">
      ${T("k", "local")} = <span class="mat-sym" style="grid-template-columns:repeat(4,auto)">
        <span class="cell">${Ie(T("EA"), T("L"))}</span><span class="cell">0</span><span class="cell dots">\u22EF</span><span class="cell">${Ie("\u2212" + T("EA"), T("L"))}</span>
        <span class="cell">0</span><span class="cell">${T("t", "z")}</span><span class="cell dots">\u22EF</span><span class="cell">${T("b", "z")}</span>
        <span class="cell dots">\u22EE</span><span class="cell dots">\u22EE</span><span class="cell dots">\u22F1</span><span class="cell dots">\u22EE</span>
        <span class="cell">0</span><span class="cell">${T("b", "z")}</span><span class="cell dots">\u22EF</span><span class="cell">${T("k", "z")}</span>
      </span>
      <sub style="color:var(--fem-label)">12\xD712 ${I ? "(Timoshenko)" : "(Euler-Bernoulli)"}</sub>
    </div>
    ${I ? `<div class="fem-eq eq-box" style="margin-top:6px">
      <div style="text-align:left"><strong style="color:var(--fem-section-title)">Matrices de rigidez (Dr. Aguiar, Fig 7.9):</strong></div>
      <div style="margin-top:4px">${T("K", "f")} = ${T("B", "f")}<sup>T</sup> \xB7 ${T("E")}\xB7${T("I")} \xB7 ${T("B", "f")} \xB7 ${T("J")} &nbsp;<sub style="color:var(--fem-label)">(flexi\xF3n, 1 pt Gauss)</sub></div>
      <div>${T("K", "c")} = ${T("B", "c")}<sup>T</sup> \xB7 ${T("G")}\xB7${T("A'")} \xB7 ${T("B", "c")} \xB7 ${T("J")} &nbsp;<sub style="color:var(--fem-label)">(cortante, 2 pts Gauss)</sub></div>
      <div>${T("K", "total")} = ${T("K", "f")} + ${T("K", "c")}</div>
    </div>` : ""}`;
    }
    function Oa(t) {
      if (t.length === 2) {
        const n = ro(t[1], t[0]), l = Lo(n), s = n[0] / l, u = n[1] / l, a = n[2] / l;
        return `<div class="fem-eq eq-box">
        <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">Cosenos directores:</strong></div>
        <div>${T("l")} = cos(\u03B1) = ${Ie("\u0394x", T("L"))} = ${Ie(pe(n[0]), pe(l))} = <span class="highlight">${pe(s)}</span></div>
        <div>${T("m")} = cos(\u03B2) = ${Ie("\u0394y", T("L"))} = ${Ie(pe(n[1]), pe(l))} = <span class="highlight">${pe(u)}</span></div>
        <div>${T("n")} = cos(\u03B3) = ${Ie("\u0394z", T("L"))} = ${Ie(pe(n[2]), pe(l))} = <span class="highlight">${pe(a)}</span></div>
      </div>
      <div class="fem-eq">
        \u03BB = <span class="mat-sym" style="grid-template-columns:repeat(3,auto)">
          <span class="cell">${T("l")}</span><span class="cell">${T("m")}</span><span class="cell">${T("n")}</span>
          <span class="cell">${Ie("\u2212" + T("m"), T("D"))}</span><span class="cell">${Ie(T("l"), T("D"))}</span><span class="cell">0</span>
          <span class="cell">${Ie("\u2212" + T("l") + "\xB7" + T("n"), T("D"))}</span><span class="cell">${Ie("\u2212" + T("m") + "\xB7" + T("n"), T("D"))}</span><span class="cell">${T("D")}</span>
        </span>
        &nbsp; donde ${T("D")} = \u221A(${T("l")}\xB2 + ${T("m")}\xB2)
      </div>
      <div class="fem-eq">
        ${T("T")} = ${T("I", "4")} \u2297 \u03BB &nbsp; <sub style="color:var(--fem-label)">(Kronecker, 12\xD712)</sub>
      </div>`;
      }
      return `<div class="fem-eq">${T("T")} \u2014 sistema local del tri\xE1ngulo (normal \xD7 lados) <sub>18\xD718</sub></div>`;
    }
    function Na() {
      return `<div class="fem-eq">
      ${T("K", "global")} = ${T("T")}<sup>T</sup> \xB7 ${T("k", "local")} \xB7 ${T("T")}
    </div>`;
    }
    function Ha(t) {
      const o = t.map((n) => `6\xB7${n} = ${6 * n}`).join(", ");
      return `<div class="fem-eq eq-box">
      <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">Ensamblaje en K global:</strong></div>
      <div>${T("K", "global")}[${T("i")}, ${T("j")}] += ${T("K", "elem")}[${T("i")}, ${T("j")}]</div>
      <div style="margin-top:4px">donde ${T("i")}, ${T("j")} \u2208 {${o}} + (0..5)</div>
    </div>`;
    }
    function Ba(t) {
      return t ? `<div class="fem-eq eq-box">
        <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">Recuperaci\xF3n de fuerzas:</strong></div>
        <div>${T("u", "local")} = ${T("T")} \xB7 ${T("u", "global")}</div>
        <div>${T("f", "local")} = ${T("k", "local")} \xB7 ${T("u", "local")}</div>
        <div style="margin-top:4px;color:var(--fem-eq-sub)">
          ${T("f")} = [${T("N", "i")}, ${T("V", "y,i")}, ${T("V", "z,i")}, ${T("M", "x,i")}, ${T("M", "y,i")}, ${T("M", "z,i")}, ${T("N", "j")}, \u2026]
        </div>
      </div>` : `<div class="fem-eq eq-box">
      <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">Esfuerzos en placa:</strong></div>
      <div>\u03C3 = ${Ie("1", "2" + T("A"))} \xB7 ${T("D")} \xB7 ${T("B")} \xB7 ${T("u")}</div>
      <div>${T("N", "xx")} = \u03C3<sub>xx</sub> \xB7 ${T("t")} &nbsp;&nbsp; ${T("M", "xx")} = \u03C3<sub>xx</sub> \xB7 ${Ie(T("t") + "\xB3", "12")}</div>
    </div>`;
    }
    function Jn(t, o) {
      const n = t.length;
      let l = '<table><tr><td class="hdr"></td>';
      for (let s = 0; s < n; s++) l += `<td class="hdr">${o[s] || s}</td>`;
      l += "</tr>";
      for (let s = 0; s < n; s++) {
        l += `<tr><td class="hdr">${o[s] || s}</td>`;
        for (let u = 0; u < n; u++) {
          const a = t[s][u], i = (s === u ? "diag " : "") + (Math.abs(a) > 1e-10 ? "nz" : "");
          l += `<td class="${i}">${pe(a, 2)}</td>`;
        }
        l += "</tr>";
      }
      return l += "</table>", l;
    }
    function js() {
      const t = "0", o = Ie(T("EA"), T("L")), n = Ie("\u2212" + T("EA"), T("L")), l = Ie("12" + T("EI", "z"), T("L") + "\xB3"), s = Ie("\u221212" + T("EI", "z"), T("L") + "\xB3"), u = Ie("12" + T("EI", "y"), T("L") + "\xB3"), a = Ie("\u221212" + T("EI", "y"), T("L") + "\xB3"), i = Ie("6" + T("EI", "z"), T("L") + "\xB2"), d = Ie("\u22126" + T("EI", "z"), T("L") + "\xB2"), r = Ie("6" + T("EI", "y"), T("L") + "\xB2"), c = Ie("\u22126" + T("EI", "y"), T("L") + "\xB2"), m = Ie(T("GJ"), T("L")), w = Ie("\u2212" + T("GJ"), T("L")), M = Ie("4" + T("EI", "z"), T("L")), v = Ie("2" + T("EI", "z"), T("L")), p = Ie("4" + T("EI", "y"), T("L")), b = Ie("2" + T("EI", "y"), T("L")), I = '<span style="color:var(--fem-eq-dots);font-style:italic">sym</span>', E = [
        "P\u2081",
        "P\u2082",
        "P\u2083",
        "P\u2084",
        "P\u2085",
        "P\u2086",
        "P\u2087",
        "P\u2088",
        "P\u2089",
        "P\u2081\u2080",
        "P\u2081\u2081",
        "P\u2081\u2082"
      ], $ = [
        "\u03B4\u2081",
        "\u03B4\u2082",
        "\u03B4\u2083",
        "\u03B4\u2084",
        "\u03B4\u2085",
        "\u03B4\u2086",
        "\u03B4\u2087",
        "\u03B4\u2088",
        "\u03B4\u2089",
        "\u03B4\u2081\u2080",
        "\u03B4\u2081\u2081",
        "\u03B4\u2081\u2082"
      ], C = [
        [
          o,
          t,
          t,
          t,
          t,
          t,
          n,
          t,
          t,
          t,
          t,
          t
        ],
        [
          t,
          l,
          t,
          t,
          t,
          i,
          t,
          s,
          t,
          t,
          t,
          i
        ],
        [
          t,
          t,
          u,
          t,
          c,
          t,
          t,
          t,
          a,
          t,
          c,
          t
        ],
        [
          t,
          t,
          t,
          m,
          t,
          t,
          t,
          t,
          t,
          w,
          t,
          t
        ],
        [
          t,
          t,
          c,
          t,
          p,
          t,
          t,
          t,
          r,
          t,
          b,
          t
        ],
        [
          t,
          i,
          t,
          t,
          t,
          M,
          t,
          d,
          t,
          t,
          t,
          v
        ],
        [
          n,
          t,
          t,
          t,
          t,
          t,
          o,
          t,
          t,
          t,
          t,
          t
        ],
        [
          t,
          s,
          t,
          t,
          t,
          d,
          t,
          l,
          t,
          t,
          t,
          d
        ],
        [
          t,
          t,
          a,
          t,
          r,
          t,
          t,
          t,
          u,
          t,
          r,
          t
        ],
        [
          t,
          t,
          t,
          w,
          t,
          t,
          t,
          t,
          t,
          m,
          t,
          t
        ],
        [
          t,
          t,
          c,
          t,
          b,
          t,
          t,
          t,
          r,
          t,
          p,
          t
        ],
        [
          t,
          i,
          t,
          t,
          t,
          v,
          t,
          d,
          t,
          t,
          t,
          M
        ]
      ];
      let R = '<div style="margin-bottom:8px;color:var(--fem-eq-sub);font-size:11px;font-family:monospace">Eq. 6.1 \u2014 Matriz de rigidez de elemento de p\xF3rtico espacial</div>';
      R += '<table><tr><td class="hdr"></td>';
      for (const g of $) R += `<td class="hdr">${g}</td>`;
      R += "</tr>";
      for (let g = 0; g < 12; g++) {
        R += `<tr><td class="hdr">${E[g]}</td>`;
        for (let f = 0; f < 12; f++) if (f < g) R += `<td style="color:var(--fem-border-cell)">${f === 0 && g > 0 ? I : ""}</td>`;
        else {
          const k = C[g][f], F = (g === f ? "diag " : "") + (k !== "0" ? "nz" : "");
          R += `<td class="${F}">${k}</td>`;
        }
        R += "</tr>";
      }
      return R += "</table>", R;
    }
    function Da(t, o, n, l, s, u, a) {
      return `<div class="coeff-grid">${[
        {
          name: `${Ie(T("E") + "\xB7" + T("A"), T("L"))}`,
          calc: `${Ie(pe(t) + "\xD7" + pe(o), pe(a))}`,
          val: t * o / a,
          label: "Axial"
        },
        {
          name: `${Ie("12\xB7" + T("E") + "\xB7" + T("I", "z"), T("L") + "\xB3")}`,
          calc: `${Ie("12\xD7" + pe(t) + "\xD7" + pe(n), pe(a) + "\xB3")}`,
          val: 12 * t * n / a ** 3,
          label: "Corte Y"
        },
        {
          name: `${Ie("6\xB7" + T("E") + "\xB7" + T("I", "z"), T("L") + "\xB2")}`,
          calc: `${Ie("6\xD7" + pe(t) + "\xD7" + pe(n), pe(a) + "\xB2")}`,
          val: 6 * t * n / a ** 2,
          label: "Corte-Momento Z"
        },
        {
          name: `${Ie("12\xB7" + T("E") + "\xB7" + T("I", "y"), T("L") + "\xB3")}`,
          calc: `${Ie("12\xD7" + pe(t) + "\xD7" + pe(l), pe(a) + "\xB3")}`,
          val: 12 * t * l / a ** 3,
          label: "Corte Z"
        },
        {
          name: `${Ie("6\xB7" + T("E") + "\xB7" + T("I", "y"), T("L") + "\xB2")}`,
          calc: `${Ie("6\xD7" + pe(t) + "\xD7" + pe(l), pe(a) + "\xB2")}`,
          val: 6 * t * l / a ** 2,
          label: "Corte-Momento Y"
        },
        {
          name: `${Ie(T("G") + "\xB7" + T("J"), T("L"))}`,
          calc: `${Ie(pe(s) + "\xD7" + pe(u), pe(a))}`,
          val: s * u / a,
          label: "Torsi\xF3n"
        },
        {
          name: `${Ie("4\xB7" + T("E") + "\xB7" + T("I", "z"), T("L"))}`,
          calc: `${Ie("4\xD7" + pe(t) + "\xD7" + pe(n), pe(a))}`,
          val: 4 * t * n / a,
          label: "Flexi\xF3n Z (4EI/L)"
        },
        {
          name: `${Ie("2\xB7" + T("E") + "\xB7" + T("I", "z"), T("L"))}`,
          calc: `${Ie("2\xD7" + pe(t) + "\xD7" + pe(n), pe(a))}`,
          val: 2 * t * n / a,
          label: "Flexi\xF3n Z (2EI/L)"
        },
        {
          name: `${Ie("4\xB7" + T("E") + "\xB7" + T("I", "y"), T("L"))}`,
          calc: `${Ie("4\xD7" + pe(t) + "\xD7" + pe(l), pe(a))}`,
          val: 4 * t * l / a,
          label: "Flexi\xF3n Y (4EI/L)"
        },
        {
          name: `${Ie("2\xB7" + T("E") + "\xB7" + T("I", "y"), T("L"))}`,
          calc: `${Ie("2\xD7" + pe(t) + "\xD7" + pe(l), pe(a))}`,
          val: 2 * t * l / a,
          label: "Flexi\xF3n Y (2EI/L)"
        }
      ].map((d) => `<div class="coeff-item"><div style="color:var(--fem-eq-sub);font-size:10px;font-family:monospace;margin-bottom:2px">${d.label}</div>${d.name} = ${d.calc} = <span class="highlight">${pe(d.val)}</span></div>`).join("")}</div>`;
    }
    function Xn(t, o, n, l) {
      var _a2;
      const s = document.querySelector(".fem-full-overlay");
      s && s.remove();
      const u = document.createElement("div");
      u.className = "fem-full-overlay", u.innerHTML = `
      <button class="close-full" id="fem-full-close">\u2715 Cerrar</button>
      <h2>${t}</h2>
      <div class="fem-full-sections">
        <div class="full-section">
          <div class="side-title">\u2460 F\xF3rmula General (simb\xF3lica)</div>
          <div class="fem-full-sym">${o}</div>
        </div>
        ${l ? `<div class="full-section coeff">
          <div class="side-title">\u2461 C\xE1lculo de Coeficientes (sustituci\xF3n num\xE9rica)</div>
          ${l}
        </div>` : ""}
        <div class="full-section numeric">
          <div class="side-title">${l ? "\u2462" : "\u2461"} Matriz Num\xE9rica Resultante</div>
          ${n}
        </div>
      </div>
    `, document.body.appendChild(u), (_a2 = u.querySelector("#fem-full-close")) == null ? void 0 : _a2.addEventListener("click", () => u.remove()), u.addEventListener("click", (a) => {
        a.target === u && u.remove();
      });
    }
    function Ws(t) {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O;
      Ot && Ot.remove();
      const o = e.nodes.val, n = e.elements.val, l = n[t], s = l.map((g) => o[g]), u = l.length === 2, a = ((_a2 = e.elementInputs) == null ? void 0 : _a2.val) || {}, i = (_b = e.deformOutputs) == null ? void 0 : _b.val, d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val;
      if (u) {
        const g = Lo(ro(s[1], s[0])), f = ((_d = a.elasticities) == null ? void 0 : _d.get(t)) ?? 0, k = ((_e = a.areas) == null ? void 0 : _e.get(t)) ?? 0, F = ((_f = a.momentsOfInertiaZ) == null ? void 0 : _f.get(t)) ?? 0, q = ((_g = a.momentsOfInertiaY) == null ? void 0 : _g.get(t)) ?? 0, H = ((_h = a.shearModuli) == null ? void 0 : _h.get(t)) ?? 0, h = ((_i = a.torsionalConstants) == null ? void 0 : _i.get(t)) ?? 0, S = ((_j = a.momentReleases) == null ? void 0 : _j.get(t)) || [], x = ((_k = a.partialFixitySprings) == null ? void 0 : _k.get(t)) || [], z = [
          "P (Axial)",
          "V2 (Corte)",
          "V3 (Corte)",
          "T (Torsi\xF3n)",
          "M22 (Momento)",
          "M33 (Momento)"
        ];
        let O = "";
        for (let B = 0; B < 6; B++) {
          const G = B, j = B + 6, D = (S.length >= 12 ? S[G] : B >= 3 && S.length >= 6 && S[B - 3]) ? "checked" : "", X = (S.length >= 12 ? S[j] : B >= 3 && S.length >= 6 && S[B]) ? "checked" : "", ee = x.length >= 12 && x[G] > 0 ? x[G].toFixed(1) : "", de = x.length >= 12 && x[j] > 0 ? x[j].toFixed(1) : "";
          O += `<tr>
          <td style="text-align:left;color:var(--fem-key)">${z[B]}</td>
          <td style="text-align:center"><input type="checkbox" data-rel="${G}" ${D}></td>
          <td style="text-align:center"><input type="checkbox" data-rel="${j}" ${X}></td>
          <td><input type="number" data-spr="${G}" value="${ee}" placeholder="0" style="width:50px;background:var(--fem-bg);color:var(--fem-val);border:1px solid var(--fem-border);font-size:10px;text-align:right"></td>
          <td><input type="number" data-spr="${j}" value="${de}" placeholder="0" style="width:50px;background:var(--fem-bg);color:var(--fem-val);border:1px solid var(--fem-border);font-size:10px;text-align:right"></td>
        </tr>`;
        }
        `${l[0]}${l[1]}${pe(g)}${pe(f)}${pe(k)}${pe(F)}${pe(q)}${pe(H)}${pe(h)}${O}`;
      } else {
        const g = ((_l2 = a.elasticities) == null ? void 0 : _l2.get(t)) ?? 0, f = ((_m = a.thicknesses) == null ? void 0 : _m.get(t)) ?? 0, k = ((_n2 = a.poissonsRatios) == null ? void 0 : _n2.get(t)) ?? 0, F = g / (2 * (1 + k)), q = l.length === 4, H = g / (1 - k * k);
        `${l.length}${l.join(", ")}${pe(g)}${pe(F)}${pe(f)}${pe(k)}`, q && (w = `<div class="fem-eq eq-box">
          <div style="text-align:left;margin-bottom:6px"><strong style="color:var(--fem-section-title)">Formulaci\xF3n Q4: Membrana + Mindlin-Reissner + Drilling</strong></div>

          <div style="text-align:left;margin-bottom:4px"><strong style="color:var(--fem-section-title)">1. Matriz constitutiva (esfuerzo plano):</strong></div>
          <div>${T("D")} = ${Ie(T("E"), "1\u2212\u03BD\xB2")} \xB7 <span class="mat-sym" style="grid-template-columns:repeat(3,auto)">
            <span class="cell">1</span><span class="cell">\u03BD</span><span class="cell">0</span>
            <span class="cell">\u03BD</span><span class="cell">1</span><span class="cell">0</span>
            <span class="cell">0</span><span class="cell">0</span><span class="cell">${Ie("1\u2212\u03BD", "2")}</span>
          </span> = ${Ie(pe(g), "1\u2212" + pe(k) + "\xB2")} = <span class="highlight">${pe(H)}</span></div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">2. Funciones de forma (Ec. 6.2, Wilson):</strong></div>
          <div>${T("N", "i")} = \xBC\xB7(1\xB1\u03BE)\xB7(1\xB1\u03B7) &nbsp;&nbsp; <sub style="color:var(--fem-label)">i = 1..4 (bilineal)</sub></div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">3. Modos incompatibles (Ec. 6.13, Wilson 1971):</strong></div>
          <div>${T("N", "5")} = 1 \u2212 \u03BE\xB2 &nbsp;&nbsp; ${T("N", "6")} = 1 \u2212 \u03B7\xB2</div>
          <div style="margin-top:4px">${T("u", "x")} = \u03A3${T("N", "i")}\xB7${T("u", "xi")} + \u03B1\u2081\xB7${T("N", "5")} + \u03B1\u2082\xB7${T("N", "6")} &nbsp;<sub style="color:var(--fem-label)">(Ec. 6.12)</sub></div>
          <div>${T("u", "y")} = \u03A3${T("N", "i")}\xB7${T("u", "yi")} + \u03B1\u2083\xB7${T("N", "5")} + \u03B1\u2084\xB7${T("N", "6")}</div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">4. Deformaci\xF3n-desplazamiento (Ec. 6.3):</strong></div>
          <div>${T("d")} = [${T("B", "C")} &nbsp; ${T("B", "I")}] \xB7 [${T("u")} &nbsp; \u03B1]<sup>T</sup></div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">5. Submatrices de rigidez (Ec. 6.9):</strong></div>
          <div>${T("k", "CC")} = \u222B${T("B", "C")}<sup>T</sup>\xB7${T("E")}\xB7${T("B", "C")} dV &nbsp;<sub style="color:var(--fem-label)">(8\xD78 est\xE1ndar)</sub></div>
          <div>${T("k", "CI")} = \u222B${T("B", "C")}<sup>T</sup>\xB7${T("E")}\xB7${T("B\u0304", "I")} dV &nbsp;<sub style="color:var(--fem-label)">(8\xD74 acoplamiento)</sub></div>
          <div>${T("k", "II")} = \u222B${T("B\u0304", "I")}<sup>T</sup>\xB7${T("E")}\xB7${T("B\u0304", "I")} dV &nbsp;<sub style="color:var(--fem-label)">(4\xD74 modos internos)</sub></div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">6. Condensaci\xF3n est\xE1tica (Ec. 6.11):</strong></div>
          <div style="font-size:13px"><span class="highlight">${T("k", "C")} = ${T("k", "CC")} \u2212 ${T("k", "CI")} \xB7 ${T("k", "II")}\u207B\xB9 \xB7 ${T("k", "IC")}</span></div>
          <div style="margin-top:4px;color:var(--fem-eq-sub)">Los 4 modos incompatibles \u03B1 se eliminan antes del ensamblaje global</div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">7. Correcci\xF3n de Taylor (Ec. 6.7):</strong></div>
          <div>${T("B\u0304", "I")} = ${T("B", "I")} + ${T("B", "IC")} &nbsp; donde &nbsp; ${T("B", "IC")} = \u2212${Ie("1", "V")}\u222B${T("B", "I")} dV</div>
          <div style="color:var(--fem-eq-sub)">Jacobiano del centro para modos incompatibles \u2192 pasa patch test</div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">8. Drilling DOF (Hughes-Brezzi 1989):</strong></div>
          <div>${T("K", "drill")} = \u03B1\xB7${T("G")}\xB7${T("t")} \xB7 \u222B${T("B", "d")}<sup>T</sup>\xB7${T("B", "d")} dA &nbsp; donde \u03B1 = 0.5</div>
          <div>${T("B", "d")}[i] = \u03B8<sub>z,i</sub> \u2212 \xBD\xB7(\u2202v/\u2202x \u2212 \u2202u/\u2202y) &nbsp;<sub style="color:var(--fem-label)">(rotaci\xF3n antisim\xE9trica)</sub></div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">9. Placa Mindlin-Reissner + MITC4:</strong></div>
          <div>${T("D", "b")} = ${Ie(T("E") + "\xB7" + T("t") + "\xB3", "12\xB7(1\u2212\u03BD\xB2)")} = <span class="highlight">${pe(g * f ** 3 / (12 * (1 - k ** 2)))}</span></div>
          <div>${T("D", "s")} = \u03BA\xB7${T("G")}\xB7${T("t")} = <span class="highlight">${pe(5 / 6 * F * f)}</span> &nbsp; <sub style="color:var(--fem-label)">\u03BA = 5/6</sub></div>
          <div style="color:var(--fem-eq-sub)">MITC4: interpolaci\xF3n de cortante en puntos de atado (tying points)</div>

          <div style="text-align:left;margin-top:8px;margin-bottom:4px"><strong style="color:var(--fem-section-title)">10. Ensamblaje final:</strong></div>
          <div>${T("K", "24\xD724")} = ${T("K", "membrana")}(8\xD78) + ${T("K", "flexi\xF3n")}(12\xD712) + ${T("K", "drilling")}(12\xD712)</div>
          <div style="color:var(--fem-eq-sub)">DOFs por nodo: [u, v, w, \u03B8x, \u03B8y, \u03B8z]</div>
        </div>`);
      }
      let r = "", c = "", m = "", w = "", M = "", v = "", p = "", b = "", I = null, E = null, $ = null, C = [];
      try {
        if (I = $n(s, a, t), E = wn(s), $ = Jt(ps(E), Jt(I, E)), C = u ? [
          "ux\u2080",
          "uy\u2080",
          "uz\u2080",
          "\u03B8x\u2080",
          "\u03B8y\u2080",
          "\u03B8z\u2080",
          "ux\u2081",
          "uy\u2081",
          "uz\u2081",
          "\u03B8x\u2081",
          "\u03B8y\u2081",
          "\u03B8z\u2081"
        ] : [
          "ux\u2080",
          "uy\u2080",
          "uz\u2080",
          "\u03B8x\u2080",
          "\u03B8y\u2080",
          "\u03B8z\u2080",
          "ux\u2081",
          "uy\u2081",
          "uz\u2081",
          "\u03B8x\u2081",
          "\u03B8y\u2081",
          "\u03B8z\u2081",
          "ux\u2082",
          "uy\u2082",
          "uz\u2082",
          "\u03B8x\u2082",
          "\u03B8y\u2081",
          "\u03B8z\u2082"
        ], u) {
          const F = Lo(ro(s[1], s[0])), q = ((_o2 = a.elasticities) == null ? void 0 : _o2.get(t)) ?? 0, H = ((_p = a.areas) == null ? void 0 : _p.get(t)) ?? 0, h = ((_q = a.momentsOfInertiaZ) == null ? void 0 : _q.get(t)) ?? 0, S = ((_r = a.momentsOfInertiaY) == null ? void 0 : _r.get(t)) ?? 0, x = ((_s2 = a.shearModuli) == null ? void 0 : _s2.get(t)) ?? 0, z = ((_t2 = a.torsionalConstants) == null ? void 0 : _t2.get(t)) ?? 0;
          w = Ra(q, H, h, S, x, z, F);
        }
        M = Oa(s), v = Na(), p = Ha(l), b = Ba(u);
        const g = '<button class="fem-expand-btn" data-full="kLocal">\u26F6 Ver completa</button>', f = '<button class="fem-expand-btn" data-full="T">\u26F6 Ver completa</button>', k = '<button class="fem-expand-btn" data-full="kGlobal">\u26F6 Ver completa</button>';
        r = `<div class="matrix-label">k_local (${I.length}\xD7${I.length}) ${g}</div>${Vn(I, C)}`, c = `<div class="matrix-label">T \u2014 Transformaci\xF3n (${E.length}\xD7${E.length}) ${f}</div>${Vn(E, C)}`, m = `<div class="matrix-label">K_global = T^T \xB7 k \xB7 T ${k}</div>${Vn($, C)}`;
      } catch (g) {
        r = `<div style="color:red">Error: ${g.message}</div>`;
      }
      if (i == null ? void 0 : i.deformations) {
        const g = [
          "ux",
          "uy",
          "uz",
          "\u03B8x",
          "\u03B8y",
          "\u03B8z"
        ];
        l.map((f, k) => {
          var _a3;
          const F = ((_a3 = i.deformations) == null ? void 0 : _a3.get(f)) || [
            0,
            0,
            0,
            0,
            0,
            0
          ], q = g.map((H, h) => `<span class="prop-key">${H}</span>: <span class="${Math.abs(F[h]) > 1e-10 ? "result-val" : ""}">${pe(F[h])}</span>`).join(" &nbsp;");
          return `<div style="margin-bottom:2px"><strong>Nodo ${f}:</strong> ${q}</div>`;
        }).join("");
      }
      if (d && u && (i == null ? void 0 : i.deformations) && I && E) {
        const g = (_u = d.normals) == null ? void 0 : _u.get(t), f = (_v = d.shearsY) == null ? void 0 : _v.get(t), k = (_w = d.shearsZ) == null ? void 0 : _w.get(t), F = (_x = d.torsions) == null ? void 0 : _x.get(t), q = (_y = d.bendingsY) == null ? void 0 : _y.get(t), H = (_z = d.bendingsZ) == null ? void 0 : _z.get(t), h = [
          "ux",
          "uy",
          "uz",
          "\u03B8x",
          "\u03B8y",
          "\u03B8z"
        ], S = [];
        for (const j of l) {
          const D = ((_A = i.deformations) == null ? void 0 : _A.get(j)) || [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          S.push(...D);
        }
        let x = [];
        try {
          x = Jt(E, S);
        } catch {
          x = new Array(12).fill(0);
        }
        let z = [];
        try {
          z = Jt(I, x);
        } catch {
          z = new Array(12).fill(0);
        }
        const O = (j, D) => j.map((X, ee) => `<span style="color:${Math.abs(X) > 1e-10 ? "var(--fem-nonzero)" : "var(--fem-eq-dots)"}">${D[ee % 6]}=${pe(X)}</span>`).join(", "), G = [
          "N",
          "Vy",
          "Vz",
          "Mx",
          "My",
          "Mz",
          "N",
          "Vy",
          "Vz",
          "Mx",
          "My",
          "Mz"
        ].map((j, D) => `${j}${D < 6 ? "\u1D62" : "\u2C7C"}`);
        `${T("u", "global")}${l.map((j, D) => `<span style="color:var(--fem-label)">nodo ${j}:</span> ${h.map((X, ee) => `<span style="color:${Math.abs(S[D * 6 + ee]) > 1e-10 ? "var(--fem-eq-var)" : "var(--fem-eq-dots)"}">${pe(S[D * 6 + ee])}</span>`).join(", ")}`).join(" | ")}${T("u", "local")}${T("T")}${T("u", "global")}${T("u", "local")}${O(x, [
          ...h,
          ...h
        ])}${T("f", "local")}${T("k", "local")}${T("u", "local")}${T("f", "local")}${z.map((j, D) => `<span style="color:${Math.abs(j) > 1e-10 ? "var(--fem-nonzero)" : "var(--fem-eq-dots)"}">${G[D]}=${pe(j)}</span>`).join(", ")}${T("P", "1")}${T("N", "i")}${pe(z[0])}${T("P", "7")}${T("N", "j")}${pe(z[6])}${T("P", "2")}${T("V", "y,i")}${pe(z[1])}${T("P", "8")}${T("V", "y,j")}${pe(z[7])}${T("P", "3")}${T("V", "z,i")}${pe(z[2])}${T("P", "9")}${T("V", "z,j")}${pe(z[8])}${T("P", "4")}${T("M", "x,i")}${pe(z[3])}${T("P", "10")}${T("M", "x,j")}${pe(z[9])}${T("P", "5")}${T("M", "y,i")}${pe(z[4])}${T("P", "11")}${T("M", "y,j")}${pe(z[10])}${T("P", "6")}${T("M", "z,i")}${pe(z[5])}${T("P", "12")}${T("M", "z,j")}${pe(z[11])}${g ? g.map((j) => pe(j)).join(", ") : "\u2014"}${f ? f.map((j) => pe(j)).join(", ") : "\u2014"}${k ? k.map((j) => pe(j)).join(", ") : "\u2014"}${F ? F.map((j) => pe(j)).join(", ") : "\u2014"}${q ? q.map((j) => pe(j)).join(", ") : "\u2014"}${H ? H.map((j) => pe(j)).join(", ") : "\u2014"}`;
      } else if (d && u) {
        const g = (_B = d.normals) == null ? void 0 : _B.get(t), f = (_C = d.shearsY) == null ? void 0 : _C.get(t), k = (_D = d.shearsZ) == null ? void 0 : _D.get(t), F = (_E = d.torsions) == null ? void 0 : _E.get(t), q = (_F = d.bendingsY) == null ? void 0 : _F.get(t), H = (_G = d.bendingsZ) == null ? void 0 : _G.get(t);
        `${g ? g.map((h) => pe(h)).join(", ") : "\u2014"}${f ? f.map((h) => pe(h)).join(", ") : "\u2014"}${k ? k.map((h) => pe(h)).join(", ") : "\u2014"}${F ? F.map((h) => pe(h)).join(", ") : "\u2014"}${q ? q.map((h) => pe(h)).join(", ") : "\u2014"}${H ? H.map((h) => pe(h)).join(", ") : "\u2014"}`;
      } else if (d && !u) {
        const g = (_H = d.bendingXX) == null ? void 0 : _H.get(t), f = (_I = d.bendingYY) == null ? void 0 : _I.get(t), k = (_J = d.bendingXY) == null ? void 0 : _J.get(t), F = (_K = d.membraneXX) == null ? void 0 : _K.get(t), q = (_L = d.membraneYY) == null ? void 0 : _L.get(t), H = (_M = d.membraneXY) == null ? void 0 : _M.get(t);
        `${g ? g.map((h) => pe(h)).join(", ") : "\u2014"}${f ? f.map((h) => pe(h)).join(", ") : "\u2014"}${k ? k.map((h) => pe(h)).join(", ") : "\u2014"}${F ? F.map((h) => pe(h)).join(", ") : "\u2014"}${q ? q.map((h) => pe(h)).join(", ") : "\u2014"}${H ? H.map((h) => pe(h)).join(", ") : "\u2014"}`;
      }
      `${l[0]}`, 6 * l[0], 6 * l[0] + 5, `${l[1]}`, 6 * l[1], 6 * l[1] + 5, l.length === 3 && (`${l[2]}`, 6 * l[2], 6 * l[2] + 5), o.length * 6, o.length * 6, Ot = Cl(t, o, n, a, i, d), Ot.id = "fem-inspect-panel", document.body.appendChild(Ot), (_N = Ot.querySelector("#er-close")) == null ? void 0 : _N.addEventListener("click", () => Mo()), (_O = Ot.querySelector("#rel-apply")) == null ? void 0 : _O.addEventListener("click", () => {
        const g = Ot.querySelectorAll("input[data-rel]"), f = Ot.querySelectorAll("input[data-spr]"), k = new Array(12).fill(false), F = new Array(12).fill(0);
        g.forEach((H) => {
          k[parseInt(H.dataset.rel)] = H.checked;
        }), f.forEach((H) => {
          const h = parseFloat(H.value);
          h > 0 && (F[parseInt(H.dataset.spr)] = h);
        }), a.momentReleases || (a.momentReleases = /* @__PURE__ */ new Map()), a.partialFixitySprings || (a.partialFixitySprings = /* @__PURE__ */ new Map()), k.some((H) => H) ? a.momentReleases.set(t, k) : a.momentReleases.delete(t), F.some((H) => H > 0) ? a.partialFixitySprings.set(t, F) : a.partialFixitySprings.delete(t), console.log(`Releases elem ${t}:`, k.map((H, h) => H ? relIds[h] : "").filter(Boolean).join(" ") || "none"), console.log(`Springs elem ${t}:`, F);
        const q = Ot.querySelector("#rel-apply");
        q.textContent = "\u2713 Aplicado", q.style.background = "#4caf50", setTimeout(() => {
          q.textContent = "Aplicar", q.style.background = "var(--fem-heading)";
        }, 1500);
      });
      const R = u ? (() => {
        var _a3, _b2, _c2, _d2, _e2, _f2;
        const g = Lo(ro(s[1], s[0])), f = ((_a3 = a.elasticities) == null ? void 0 : _a3.get(t)) ?? 0, k = ((_b2 = a.areas) == null ? void 0 : _b2.get(t)) ?? 0, F = ((_c2 = a.momentsOfInertiaZ) == null ? void 0 : _c2.get(t)) ?? 0, q = ((_d2 = a.momentsOfInertiaY) == null ? void 0 : _d2.get(t)) ?? 0, H = ((_e2 = a.shearModuli) == null ? void 0 : _e2.get(t)) ?? 0, h = ((_f2 = a.torsionalConstants) == null ? void 0 : _f2.get(t)) ?? 0;
        return Da(f, k, F, q, H, h, g);
      })() : void 0;
      Ot.querySelectorAll("[data-full]").forEach((g) => {
        g.addEventListener("click", (f) => {
          f.stopPropagation();
          const k = g.dataset.full;
          if (k === "kLocal" && I) {
            const F = u ? js() : "<em>Shell 18\xD718 \u2014 ver tabla num\xE9rica</em>";
            Xn(`Elemento ${t} \u2014 Rigidez Local k_local`, F, Jn(I, C), R);
          } else if (k === "T" && E) Xn(`Elemento ${t} \u2014 Transformaci\xF3n T`, M, Jn(E, C));
          else if (k === "kGlobal" && $) {
            const F = u ? js() : "<em>Shell 18\xD718</em>";
            Xn(`Elemento ${t} \u2014 Rigidez Global K = T^T \xB7 k \xB7 T`, F, Jn($, C), R);
          }
        });
      });
    }
    function Gs() {
      const l = [], s = [];
      for (let v = 0; v <= 8; v++) {
        const p = v / 8, b = 30 * p, E = 12 * (1 - p) * (1 - p * 0.3) / 2, $ = l.length;
        if (l.push([
          -E,
          -E,
          b
        ]), l.push([
          E,
          -E,
          b
        ]), l.push([
          E,
          E,
          b
        ]), l.push([
          -E,
          E,
          b
        ]), s.push([
          $,
          $ + 1
        ]), s.push([
          $ + 1,
          $ + 2
        ]), s.push([
          $ + 2,
          $ + 3
        ]), s.push([
          $ + 3,
          $
        ]), v > 0 && v < 8 && (s.push([
          $,
          $ + 2
        ]), s.push([
          $ + 1,
          $ + 3
        ])), v > 0) {
          const C = $ - 4;
          for (let R = 0; R < 4; R++) s.push([
            C + R,
            $ + R
          ]);
          s.push([
            C,
            $ + 1
          ]), s.push([
            C + 1,
            $ + 2
          ]), s.push([
            C + 2,
            $ + 3
          ]), s.push([
            C + 3,
            $
          ]);
        }
      }
      const u = /* @__PURE__ */ new Map();
      for (let v = 0; v < 4; v++) u.set(v, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const a = l.length - 4, i = /* @__PURE__ */ new Map();
      for (let v = 0; v < 4; v++) i.set(a + v, [
        0,
        0,
        -50,
        0,
        0,
        0
      ]);
      e.nodes.val = l, e.elements.val = s, e.nodeInputs && (e.nodeInputs.val = {
        supports: u,
        loads: i
      });
      const d = 2e8, r = 77e6, c = 5e-3, m = 2e-6, w = 1e-6, M = {
        elasticities: new Map(s.map((v, p) => [
          p,
          d
        ])),
        shearModuli: new Map(s.map((v, p) => [
          p,
          r
        ])),
        areas: new Map(s.map((v, p) => [
          p,
          c
        ])),
        momentsOfInertiaY: new Map(s.map((v, p) => [
          p,
          m
        ])),
        momentsOfInertiaZ: new Map(s.map((v, p) => [
          p,
          m
        ])),
        torsionalConstants: new Map(s.map((v, p) => [
          p,
          w
        ]))
      };
      e.elementInputs && (e.elementInputs.val = M);
      try {
        const v = pt(l, s, {
          supports: u,
          loads: i
        }, M);
        v && e.deformOutputs && (e.deformOutputs.val = v);
      } catch (v) {
        console.warn("Eiffel deform:", v.message);
      }
      setTimeout(() => st(), 50), Ne(), console.log(`Torre Eiffel: ${l.length} nodos, ${s.length} elementos, H=30m`);
    }
    function Ys() {
      const l = [], s = [];
      for (let M = 0; M <= 20; M++) {
        const v = M / 20, p = 20 * v, b = 20 * (1 - Math.pow(2 * v - 1, 2)), I = 2;
        l.push([
          p,
          -I / 2,
          b
        ]), l.push([
          p,
          I / 2,
          b
        ]);
      }
      for (let M = 0; M < 20; M++) s.push([
        M * 2,
        (M + 1) * 2
      ]), s.push([
        M * 2 + 1,
        (M + 1) * 2 + 1
      ]), s.push([
        M * 2,
        M * 2 + 1
      ]), s.push([
        M * 2,
        (M + 1) * 2 + 1
      ]), s.push([
        M * 2 + 1,
        (M + 1) * 2
      ]);
      s.push([
        20 * 2,
        20 * 2 + 1
      ]);
      const u = /* @__PURE__ */ new Map();
      u.set(0, [
        true,
        true,
        true,
        true,
        true,
        true
      ]), u.set(1, [
        true,
        true,
        true,
        true,
        true,
        true
      ]), u.set(20 * 2, [
        true,
        true,
        true,
        true,
        true,
        true
      ]), u.set(20 * 2 + 1, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const a = /* @__PURE__ */ new Map();
      for (let M = 0; M <= 20; M++) a.set(M * 2, [
        0,
        0,
        -20,
        0,
        0,
        0
      ]), a.set(M * 2 + 1, [
        0,
        0,
        -20,
        0,
        0,
        0
      ]);
      e.nodes.val = l, e.elements.val = s, e.nodeInputs && (e.nodeInputs.val = {
        supports: u,
        loads: a
      });
      const i = 2e8, d = 77e6, r = 0.01, c = 5e-6, m = 2e-6, w = {
        elasticities: new Map(s.map((M, v) => [
          v,
          i
        ])),
        shearModuli: new Map(s.map((M, v) => [
          v,
          d
        ])),
        areas: new Map(s.map((M, v) => [
          v,
          r
        ])),
        momentsOfInertiaY: new Map(s.map((M, v) => [
          v,
          c
        ])),
        momentsOfInertiaZ: new Map(s.map((M, v) => [
          v,
          c
        ])),
        torsionalConstants: new Map(s.map((M, v) => [
          v,
          m
        ]))
      };
      e.elementInputs && (e.elementInputs.val = w);
      try {
        const M = pt(l, s, {
          supports: u,
          loads: a
        }, w);
        M && e.deformOutputs && (e.deformOutputs.val = M);
      } catch (M) {
        console.warn("Arco:", M.message);
      }
      setTimeout(() => st(), 50), Ne(), console.log(`Arco Gateway: ${l.length} nodos, ${s.length} elem, span=20m, H=20m`);
    }
    function Vs() {
      const u = [], a = [];
      for (let p = 0; p <= 16; p++) {
        const b = 60 * p / 16;
        u.push([
          b,
          -6 / 2,
          8
        ]), u.push([
          b,
          6 / 2,
          8
        ]);
      }
      const i = u.length;
      for (let p = 0; p < 16; p++) a.push([
        p * 2,
        (p + 1) * 2
      ]), a.push([
        p * 2 + 1,
        (p + 1) * 2 + 1
      ]), a.push([
        p * 2,
        p * 2 + 1
      ]);
      a.push([
        16 * 2,
        16 * 2 + 1
      ]);
      const d = [
        Math.round(16 / 3),
        Math.round(2 * 16 / 3)
      ], r = [];
      for (const p of d) {
        const b = 60 * p / 16, I = u.length;
        u.push([
          b,
          -6 / 2,
          0
        ]);
        const E = u.length;
        u.push([
          b,
          6 / 2,
          0
        ]);
        const $ = u.length;
        u.push([
          b,
          -6 / 2,
          28
        ]);
        const C = u.length;
        u.push([
          b,
          6 / 2,
          28
        ]), r.push($, C), a.push([
          I,
          p * 2
        ]), a.push([
          p * 2,
          $
        ]), a.push([
          E,
          p * 2 + 1
        ]), a.push([
          p * 2 + 1,
          C
        ]), a.push([
          $,
          C
        ]);
      }
      for (const p of r) {
        const b = u[p][0];
        for (let I = 0; I <= 16; I++) {
          const E = 60 * I / 16;
          if (Math.abs(E - b) > 60 * 0.05 && Math.abs(E - b) < 60 * 0.45) {
            const $ = u[p][1] < 0 ? I * 2 : I * 2 + 1;
            I % 2 === 0 && a.push([
              p,
              $
            ]);
          }
        }
      }
      const c = /* @__PURE__ */ new Map();
      c.set(0, [
        true,
        true,
        true,
        false,
        false,
        false
      ]), c.set(1, [
        true,
        true,
        true,
        false,
        false,
        false
      ]), c.set(16 * 2, [
        false,
        true,
        true,
        false,
        false,
        false
      ]), c.set(16 * 2 + 1, [
        false,
        true,
        true,
        false,
        false,
        false
      ]);
      for (let p = i; p < i + d.length * 4; p += 4) c.set(p, [
        true,
        true,
        true,
        true,
        true,
        true
      ]), c.set(p + 1, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const m = /* @__PURE__ */ new Map();
      for (let p = 0; p <= 16; p++) m.set(p * 2, [
        0,
        0,
        -30,
        0,
        0,
        0
      ]), m.set(p * 2 + 1, [
        0,
        0,
        -30,
        0,
        0,
        0
      ]);
      e.nodes.val = u, e.elements.val = a, e.nodeInputs && (e.nodeInputs.val = {
        supports: c,
        loads: m
      });
      const w = 2e8, M = 77e6, v = {
        elasticities: new Map(a.map((p, b) => [
          b,
          w
        ])),
        shearModuli: new Map(a.map((p, b) => [
          b,
          M
        ])),
        areas: new Map(a.map((p, b) => [
          b,
          b < 16 * 3 + 1 ? 0.02 : 1e-3
        ])),
        momentsOfInertiaY: new Map(a.map((p, b) => [
          b,
          5e-5
        ])),
        momentsOfInertiaZ: new Map(a.map((p, b) => [
          b,
          2e-5
        ])),
        torsionalConstants: new Map(a.map((p, b) => [
          b,
          1e-5
        ]))
      };
      e.elementInputs && (e.elementInputs.val = v);
      try {
        const p = pt(u, a, {
          supports: c,
          loads: m
        }, v);
        p && e.deformOutputs && (e.deformOutputs.val = p);
      } catch (p) {
        console.warn("Puente:", p.message);
      }
      setTimeout(() => st(), 50), Ne(), console.log(`Puente atirantado: ${u.length} nodos, ${a.length} elem, span=60m`);
    }
    function Js() {
      const u = [], a = [];
      for (let b = 0; b <= 12; b++) {
        const I = b * 3.5, E = b * 5 * Math.PI / 180;
        for (let $ = 0; $ < 6; $++) {
          const C = E + 2 * Math.PI * $ / 6, R = 5 * Math.cos(C), g = 5 * Math.sin(C);
          u.push([
            R,
            g,
            I
          ]);
        }
      }
      for (let b = 0; b <= 12; b++) {
        const I = b * 6;
        for (let E = 0; E < 6; E++) a.push([
          I + E,
          I + (E + 1) % 6
        ]);
        if (b < 12) {
          const E = (b + 1) * 6;
          for (let $ = 0; $ < 6; $++) a.push([
            I + $,
            E + $
          ]), a.push([
            I + $,
            E + ($ + 1) % 6
          ]);
        }
      }
      for (let b = 0; b <= 12; b++) {
        const I = u.length;
        u.push([
          0,
          0,
          b * 3.5
        ]);
        const E = b * 6;
        for (let $ = 0; $ < 6; $++) a.push([
          I,
          E + $
        ]);
      }
      const i = 13 * 6;
      for (let b = 0; b < 12; b++) a.push([
        i + b,
        i + b + 1
      ]);
      const d = /* @__PURE__ */ new Map();
      for (let b = 0; b < 6; b++) d.set(b, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      d.set(i, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const r = /* @__PURE__ */ new Map();
      for (let b = 1; b <= 12; b++) {
        const I = 10 * b / 12, E = b * 6;
        for (let $ = 0; $ < 6; $++) r.set(E + $, [
          I,
          0,
          -5,
          0,
          0,
          0
        ]);
      }
      e.nodes.val = u, e.elements.val = a, e.nodeInputs && (e.nodeInputs.val = {
        supports: d,
        loads: r
      });
      const c = 2e8, m = 77e6, w = 8e-3, M = 1e-5, v = 5e-6, p = {
        elasticities: new Map(a.map((b, I) => [
          I,
          c
        ])),
        shearModuli: new Map(a.map((b, I) => [
          I,
          m
        ])),
        areas: new Map(a.map((b, I) => [
          I,
          w
        ])),
        momentsOfInertiaY: new Map(a.map((b, I) => [
          I,
          M
        ])),
        momentsOfInertiaZ: new Map(a.map((b, I) => [
          I,
          M
        ])),
        torsionalConstants: new Map(a.map((b, I) => [
          I,
          v
        ]))
      };
      e.elementInputs && (e.elementInputs.val = p);
      try {
        const b = pt(u, a, {
          supports: d,
          loads: r
        }, p);
        b && e.deformOutputs && (e.deformOutputs.val = b);
      } catch (b) {
        console.warn("Twisted:", b.message);
      }
      setTimeout(() => st(), 50), Ne(), console.log(`Torre Twist: ${u.length} nodos, ${a.length} elem, 12 pisos, twist=5deg/piso`);
    }
    function Xs() {
      const s = [], u = [];
      for (let p = 0; p <= 20; p++) {
        const b = p / 20, I = p * 3;
        let E = 8 * (1 - b * 0.7);
        b > 0.4 && (E *= 0.85), b > 0.7 && (E *= 0.7);
        const $ = s.length;
        s.push([
          0,
          0,
          I
        ]);
        for (let C = 0; C < 3; C++) {
          const R = C * 2 * Math.PI / 3 - Math.PI / 2, g = E * Math.cos(R), f = E * Math.sin(R), k = s.length;
          s.push([
            g,
            f,
            I
          ]), u.push([
            $,
            k
          ]);
          const F = s.length;
          s.push([
            g * 0.5,
            f * 0.5,
            I
          ]), u.push([
            $,
            F
          ]), u.push([
            F,
            k
          ]);
        }
        for (let C = 0; C < 3; C++) {
          const R = $ + 1 + C * 2, g = $ + 1 + (C + 1) % 3 * 2;
          u.push([
            R,
            g
          ]);
        }
        if (p < 20) {
          const R = $ + 7;
          u.push([
            $,
            R
          ]);
          for (let g = 0; g < 3; g++) u.push([
            $ + 1 + g * 2,
            R + 1 + g * 2
          ]), u.push([
            $ + 2 + g * 2,
            R + 2 + g * 2
          ]), u.push([
            $ + 1 + g * 2,
            R + 2 + g * 2
          ]);
        }
      }
      const a = /* @__PURE__ */ new Map(), i = 1 + 3 * 2;
      for (let p = 0; p < i; p++) a.set(p, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const d = /* @__PURE__ */ new Map();
      for (let p = 1; p <= 20; p++) {
        const b = p * i, I = 5 * p / 20;
        d.set(b, [
          I,
          0,
          -10,
          0,
          0,
          0
        ]);
      }
      e.nodes.val = s, e.elements.val = u, e.nodeInputs && (e.nodeInputs.val = {
        supports: a,
        loads: d
      });
      const r = 35e6, c = 14e6, m = 0.02, w = 5e-5, M = 2e-5, v = {
        elasticities: new Map(u.map((p, b) => [
          b,
          r
        ])),
        shearModuli: new Map(u.map((p, b) => [
          b,
          c
        ])),
        areas: new Map(u.map((p, b) => [
          b,
          m
        ])),
        momentsOfInertiaY: new Map(u.map((p, b) => [
          b,
          w
        ])),
        momentsOfInertiaZ: new Map(u.map((p, b) => [
          b,
          w
        ])),
        torsionalConstants: new Map(u.map((p, b) => [
          b,
          M
        ]))
      };
      e.elementInputs && (e.elementInputs.val = v);
      try {
        const p = pt(s, u, {
          supports: a,
          loads: d
        }, v);
        p && e.deformOutputs && (e.deformOutputs.val = p);
      } catch (p) {
        console.warn("Burj:", p.message);
      }
      setTimeout(() => st(), 50), Ne(), console.log(`Burj Khalifa: ${s.length} nodos, ${u.length} elem, 20 pisos, H=${20 * 3}m`);
    }
    function Ks() {
      const t = [], o = [];
      for (let m = 0; m < 3; m++) {
        const w = m * 12, M = 15 - m * 2, v = 20 - m * 3, p = 8 - m, b = t.length;
        for (let E = 0; E <= 4; E++) {
          const $ = E / 4, C = -p / 2 + p * $, R = v * (1 - $ * $ * 0.3);
          for (let g = 0; g <= 12; g++) {
            const f = g / 12, k = w + R * f, F = M * Math.sin(Math.PI * f) * (1 - $ * $ * 0.5), q = C;
            t.push([
              k,
              q,
              F
            ]);
          }
        }
        const I = 13;
        for (let E = 0; E < 4; E++) for (let $ = 0; $ < 12; $++) {
          const C = b + E * I + $, R = b + E * I + $ + 1, g = b + (E + 1) * I + $ + 1, f = b + (E + 1) * I + $;
          o.push([
            C,
            R,
            g,
            f
          ]);
        }
      }
      const s = /* @__PURE__ */ new Map();
      for (let m = 0; m < t.length; m++) t[m][2] < 0.5 && s.set(m, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const u = /* @__PURE__ */ new Map();
      for (let m = 0; m < t.length; m++) t[m][2] > 2 && u.set(m, [
        0,
        0,
        -5,
        0,
        0,
        0
      ]);
      e.nodes.val = t, e.elements.val = o, e.nodeInputs && (e.nodeInputs.val = {
        supports: s,
        loads: u
      });
      const a = 35e6, i = 0.2, d = 0.15, r = a / (2 * (1 + i)), c = {
        elasticities: new Map(o.map((m, w) => [
          w,
          a
        ])),
        poissonsRatios: new Map(o.map((m, w) => [
          w,
          i
        ])),
        thicknesses: new Map(o.map((m, w) => [
          w,
          d
        ])),
        shearModuli: new Map(o.map((m, w) => [
          w,
          r
        ]))
      };
      e.elementInputs && (e.elementInputs.val = c);
      try {
        const m = pt(t, o, {
          supports: s,
          loads: u
        }, c);
        m && e.deformOutputs && (e.deformOutputs.val = m);
      } catch (m) {
        console.warn("Opera:", m.message);
      }
      setTimeout(() => st(), 50), Ne(), console.log(`Sydney Opera: ${t.length} nodos, ${o.length} shells Q4, 3 velas`);
    }
    function Us() {
      const l = [], s = [];
      for (let v = 0; v <= 15; v++) {
        const p = v / 15, b = v * 3.5, I = 5 * (0.6 + 0.4 * Math.sin(Math.PI * p));
        if (p > 0.9) {
          const E = 5 * (0.6 + 0.4 * Math.sin(Math.PI * 0.9)) * (1 - (p - 0.9) * 8);
          for (let $ = 0; $ < 12; $++) {
            const C = 2 * Math.PI * $ / 12;
            l.push([
              Math.max(E, 1) * Math.cos(C),
              Math.max(E, 1) * Math.sin(C),
              b
            ]);
          }
        } else for (let E = 0; E < 12; E++) {
          const $ = 2 * Math.PI * E / 12;
          l.push([
            I * Math.cos($),
            I * Math.sin($),
            b
          ]);
        }
      }
      for (let v = 0; v < 15; v++) {
        const p = v * 12, b = (v + 1) * 12;
        for (let E = 0; E < 12; E++) s.push([
          p + E,
          p + (E + 1) % 12
        ]);
        const I = v % 2 === 0 ? 1 : -1;
        for (let E = 0; E < 12; E++) {
          const $ = (E + I + 12) % 12;
          s.push([
            p + E,
            b + $
          ]), s.push([
            p + E,
            b + E
          ]);
        }
      }
      const u = 15 * 12;
      for (let v = 0; v < 12; v++) s.push([
        u + v,
        u + (v + 1) % 12
      ]);
      const a = /* @__PURE__ */ new Map();
      for (let v = 0; v < 12; v++) a.set(v, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const i = /* @__PURE__ */ new Map();
      for (let v = 1; v <= 15; v++) {
        const p = v * 12, b = 3 * v / 15;
        for (let I = 0; I < 12; I += 3) i.set(p + I, [
          b,
          0,
          -8,
          0,
          0,
          0
        ]);
      }
      e.nodes.val = l, e.elements.val = s, e.nodeInputs && (e.nodeInputs.val = {
        supports: a,
        loads: i
      });
      const d = 2e8, r = 77e6, c = 6e-3, m = 8e-6, w = 4e-6, M = {
        elasticities: new Map(s.map((v, p) => [
          p,
          d
        ])),
        shearModuli: new Map(s.map((v, p) => [
          p,
          r
        ])),
        areas: new Map(s.map((v, p) => [
          p,
          c
        ])),
        momentsOfInertiaY: new Map(s.map((v, p) => [
          p,
          m
        ])),
        momentsOfInertiaZ: new Map(s.map((v, p) => [
          p,
          m
        ])),
        torsionalConstants: new Map(s.map((v, p) => [
          p,
          w
        ]))
      };
      e.elementInputs && (e.elementInputs.val = M);
      try {
        const v = pt(l, s, {
          supports: a,
          loads: i
        }, M);
        v && e.deformOutputs && (e.deformOutputs.val = v);
      } catch (v) {
        console.warn("Diagrid:", v.message);
      }
      setTimeout(() => st(), 50), Ne(), console.log(`Diagrid Tower: ${l.length} nodos, ${s.length} elem, 15 pisos, H=${15 * 3.5}m`);
    }
    function Kn() {
      var _a2, _b, _c, _d, _e, _f, _g, _h;
      const t = ((_a2 = J.W) == null ? void 0 : _a2.val) ?? 5, o = ((_b = J.H) == null ? void 0 : _b.val) ?? 3, n = ((_c = J.t) == null ? void 0 : _c.val) ?? 0.2, l = Math.round(((_d = J.nx) == null ? void 0 : _d.val) ?? 8), s = Math.round(((_e = J.ny) == null ? void 0 : _e.val) ?? 6), u = ((_f = J.E) == null ? void 0 : _f.val) ?? 25e6, a = ((_g = J.nu) == null ? void 0 : _g.val) ?? 0.2, i = ((_h = J.P) == null ? void 0 : _h.val) ?? 100, d = u / (2 * (1 + a)), r = t / l, c = o / s, m = [], w = [], M = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
      for (let $ = 0; $ <= s; $++) for (let C = 0; C <= l; C++) m.push([
        C * r,
        0,
        $ * c
      ]);
      const p = l + 1;
      for (let $ = 0; $ < s; $++) for (let C = 0; C < l; C++) w.push([
        $ * p + C,
        $ * p + C + 1,
        ($ + 1) * p + C + 1,
        ($ + 1) * p + C
      ]);
      for (let $ = 0; $ <= l; $++) M.set($, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const b = [];
      for (let $ = 0; $ <= l; $++) b.push(s * p + $);
      const I = i / b.length;
      for (const $ of b) v.set($, [
        I,
        0,
        0,
        0,
        0,
        0
      ]);
      e.nodes.val = m, e.elements.val = w, e.nodeInputs && (e.nodeInputs.val = {
        supports: M,
        loads: v
      });
      const E = {
        elasticities: new Map(w.map(($, C) => [
          C,
          u
        ])),
        poissonsRatios: new Map(w.map(($, C) => [
          C,
          a
        ])),
        thicknesses: new Map(w.map(($, C) => [
          C,
          n
        ])),
        shearModuli: new Map(w.map(($, C) => [
          C,
          d
        ])),
        densities: new Map(w.map(($, C) => [
          C,
          24 / 9.80665
        ]))
      };
      e.elementInputs && (e.elementInputs.val = E);
      try {
        const $ = pt(m, w, {
          supports: M,
          loads: v
        }, E);
        if ($ && e.deformOutputs) {
          e.deformOutputs.val = $;
          const C = so(m, w, E, $);
          e.analyzeOutputs && (e.analyzeOutputs.val = C);
          const R = s * p + Math.floor(l / 2), g = $.deformations.get(R), f = g ? g[0] : 0;
          console.log(`Muro Q4: Ux=${f.toExponential(4)} m | OS:4.602e-5 | SAP:4.629e-5 | ETABS:4.582e-5`);
        }
      } catch ($) {
        console.warn("MuroQ4:", $.message);
      }
      setTimeout(() => st(), 50), Ne();
    }
    function Zs() {
      var _a2, _b, _c, _d, _e, _f, _g, _h;
      const t = ((_a2 = J.L) == null ? void 0 : _a2.val) ?? 6, o = ((_b = J.h) == null ? void 0 : _b.val) ?? 0.5, n = ((_c = J.t) == null ? void 0 : _c.val) ?? 0.2, l = Math.round(((_d = J.nx) == null ? void 0 : _d.val) ?? 12), s = Math.round(((_e = J.ny) == null ? void 0 : _e.val) ?? 4), u = ((_f = J.E) == null ? void 0 : _f.val) ?? 25e6, a = ((_g = J.nu) == null ? void 0 : _g.val) ?? 0.2, i = ((_h = J.P) == null ? void 0 : _h.val) ?? 50, d = u / (2 * (1 + a)), r = t / l, c = o / s, m = [], w = [], M = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
      for (let E = 0; E <= s; E++) for (let $ = 0; $ <= l; $++) m.push([
        $ * r,
        0,
        E * c
      ]);
      const p = l + 1;
      for (let E = 0; E < s; E++) for (let $ = 0; $ < l; $++) w.push([
        E * p + $,
        E * p + $ + 1,
        (E + 1) * p + $ + 1,
        (E + 1) * p + $
      ]);
      for (let E = 0; E <= s; E++) M.set(E * p, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const b = Math.floor(s / 2) * p + l;
      v.set(b, [
        0,
        0,
        -i,
        0,
        0,
        0
      ]), e.nodes.val = m, e.elements.val = w, e.nodeInputs && (e.nodeInputs.val = {
        supports: M,
        loads: v
      });
      const I = {
        elasticities: new Map(w.map((E, $) => [
          $,
          u
        ])),
        poissonsRatios: new Map(w.map((E, $) => [
          $,
          a
        ])),
        thicknesses: new Map(w.map((E, $) => [
          $,
          n
        ])),
        shearModuli: new Map(w.map((E, $) => [
          $,
          d
        ])),
        densities: new Map(w.map((E, $) => [
          $,
          24 / 9.80665
        ]))
      };
      e.elementInputs && (e.elementInputs.val = I);
      try {
        const E = pt(m, w, {
          supports: M,
          loads: v
        }, I);
        if (E && e.deformOutputs) {
          e.deformOutputs.val = E;
          const $ = so(m, w, I, E);
          e.analyzeOutputs && (e.analyzeOutputs.val = $);
          const C = E.deformations.get(b), R = C ? C[2] : 0, g = n * o * o * o / 12, f = i * t * t * t / (3 * u * g);
          console.log(`Viga Q4: Uz_tip=${R.toExponential(4)} | Analitico=${f.toExponential(4)} | ratio=${(Math.abs(R) / f).toFixed(4)}`);
        }
      } catch (E) {
        console.warn("VigaQ4:", E.message);
      }
      setTimeout(() => st(), 50), Ne();
    }
    function Qs() {
      var _a2, _b, _c, _d, _e, _f, _g, _h;
      const t = ((_a2 = J.Lx) == null ? void 0 : _a2.val) ?? 4, o = ((_b = J.Ly) == null ? void 0 : _b.val) ?? 2, n = ((_c = J.t) == null ? void 0 : _c.val) ?? 0.15, l = Math.round(((_d = J.nx) == null ? void 0 : _d.val) ?? 8), s = Math.round(((_e = J.ny) == null ? void 0 : _e.val) ?? 4), u = ((_f = J.E) == null ? void 0 : _f.val) ?? 25e6, a = ((_g = J.nu) == null ? void 0 : _g.val) ?? 0.2, i = ((_h = J.P) == null ? void 0 : _h.val) ?? 20, d = u / (2 * (1 + a)), r = t / l, c = o / s, m = [], w = [], M = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
      for (let $ = 0; $ <= s; $++) for (let C = 0; C <= l; C++) m.push([
        C * r,
        0,
        $ * c
      ]);
      const p = l + 1;
      for (let $ = 0; $ < s; $++) for (let C = 0; C < l; C++) w.push([
        $ * p + C,
        $ * p + C + 1,
        ($ + 1) * p + C + 1,
        ($ + 1) * p + C
      ]);
      for (let $ = 0; $ <= s; $++) M.set($ * p, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const b = [];
      for (let $ = 0; $ <= s; $++) b.push($ * p + l);
      const I = i / b.length;
      for (const $ of b) v.set($, [
        0,
        -I,
        0,
        0,
        0,
        0
      ]);
      e.nodes.val = m, e.elements.val = w, e.nodeInputs && (e.nodeInputs.val = {
        supports: M,
        loads: v
      });
      const E = {
        elasticities: new Map(w.map(($, C) => [
          C,
          u
        ])),
        poissonsRatios: new Map(w.map(($, C) => [
          C,
          a
        ])),
        thicknesses: new Map(w.map(($, C) => [
          C,
          n
        ])),
        shearModuli: new Map(w.map(($, C) => [
          C,
          d
        ])),
        densities: new Map(w.map(($, C) => [
          C,
          24 / 9.80665
        ]))
      };
      e.elementInputs && (e.elementInputs.val = E);
      try {
        const $ = pt(m, w, {
          supports: M,
          loads: v
        }, E);
        if ($ && e.deformOutputs) {
          e.deformOutputs.val = $;
          const C = so(m, w, E, $);
          e.analyzeOutputs && (e.analyzeOutputs.val = C);
          const R = (s / 2 | 0) * p + l, g = $.deformations.get(R), f = g ? g[1] : 0;
          console.log(`Placa XY Q4: Uy_tip=${f.toExponential(4)} m`);
        }
      } catch ($) {
        console.warn("PlacaXY:", $.message);
      }
      setTimeout(() => st(), 50), Ne();
    }
    function ea() {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y;
      const t = L, o = ((_a2 = J.Lx) == null ? void 0 : _a2.val) ?? 5.5, n = ((_b = J.Ly) == null ? void 0 : _b.val) ?? 8, l = ((_c = J.H1) == null ? void 0 : _c.val) ?? 3, s = ((_d = J.H2) == null ? void 0 : _d.val) ?? 4, u = Math.round(((_e = J.nCol) == null ? void 0 : _e.val) ?? 4), a = Math.round(((_f = J.nCorr) == null ? void 0 : _f.val) ?? 8), i = ((_g = J.E) == null ? void 0 : _g.val) ?? t.E, d = ((_h = J.t) == null ? void 0 : _h.val) ?? 5e-4, r = ((_i = J.q) == null ? void 0 : _i.val) ?? 1, c = (((_j = J.supUx) == null ? void 0 : _j.val) ?? 1) >= 0.5, m = (((_k = J.supUy) == null ? void 0 : _k.val) ?? 1) >= 0.5, w = (((_l2 = J.supUz) == null ? void 0 : _l2.val) ?? 1) >= 0.5, M = (((_m = J.supRx) == null ? void 0 : _m.val) ?? 1) >= 0.5, v = (((_n2 = J.supRy) == null ? void 0 : _n2.val) ?? 1) >= 0.5, p = (((_o2 = J.supRz) == null ? void 0 : _o2.val) ?? 1) >= 0.5, b = ((_p = J.colD) == null ? void 0 : _p.val) ?? 0.16, I = ((_q = J.colBf) == null ? void 0 : _q.val) ?? 0.16, E = ((_r = J.colTf) == null ? void 0 : _r.val) ?? 0.013, $ = ((_s2 = J.colTw) == null ? void 0 : _s2.val) ?? 8e-3, C = ((_t2 = J.vigD) == null ? void 0 : _t2.val) ?? 0.2, R = ((_u = J.vigBf) == null ? void 0 : _u.val) ?? 0.1, g = ((_v = J.vigTf) == null ? void 0 : _v.val) ?? 85e-4, f = ((_w = J.vigTw) == null ? void 0 : _w.val) ?? 56e-4, k = ((_x = J.corrB) == null ? void 0 : _x.val) ?? 0.06, F = ((_y = J.corrT) == null ? void 0 : _y.val) ?? 4e-3, q = 0.3, H = i / (2 * (1 + q));
      function h(ye, Le, Fe, _e2) {
        const $t = ye - 2 * Fe, So = 2 * Le * Fe + $t * _e2, Qo = (Le * ye * ye * ye - (Le - _e2) * $t * $t * $t) / 12, en = (2 * Fe * Le * Le * Le + $t * _e2 * _e2 * _e2) / 12, pn = (2 * Le * Fe * Fe * Fe + $t * _e2 * _e2 * _e2) / 3;
        return {
          A: So,
          Iz: Qo,
          Iy: en,
          J: pn
        };
      }
      const S = h(b, I, E, $), x = h(C, R, g, f), z = k * k - (k - 2 * F) * (k - 2 * F), O = (k ** 4 - (k - 2 * F) ** 4) / 12, B = O, G = 2 * F * (k - F) ** 2 * (k - F) ** 2 / (2 * (k - F) + 2 * (k - F)), j = 3, D = [
        0,
        o / 2,
        o
      ], X = [];
      for (let ye = 0; ye < u; ye++) X.push(ye * n / (u - 1));
      const ee = /* @__PURE__ */ new Set();
      for (const ye of X) ee.add(ye);
      for (let ye = 0; ye < a; ye++) ee.add(ye * n / (a - 1));
      const de = Array.from(ee).sort((ye, Le) => ye - Le), me = de.length;
      function _(ye) {
        return l + (s - l) * ye / n;
      }
      const se = [], Y = [], ae = [], W = [];
      for (let ye = 0; ye < j; ye++) {
        const Le = [];
        for (let _e2 = 0; _e2 < u; _e2++) Le.push(se.length), se.push([
          D[ye],
          X[_e2],
          0
        ]);
        ae.push(Le);
        const Fe = [];
        for (let _e2 = 0; _e2 < me; _e2++) Fe.push(se.length), se.push([
          D[ye],
          de[_e2],
          _(de[_e2])
        ]);
        W.push(Fe);
      }
      const le = /* @__PURE__ */ new Map(), fe = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), ze = /* @__PURE__ */ new Map(), Be = /* @__PURE__ */ new Map(), je = /* @__PURE__ */ new Map(), tt = /* @__PURE__ */ new Map(), lt = /* @__PURE__ */ new Map(), ot = t.rho ?? 7850;
      for (let ye = 0; ye < j; ye++) for (let Le = 0; Le < u; Le++) {
        const Fe = de.indexOf(X[Le]);
        if (Fe < 0) continue;
        const _e2 = Y.length;
        Y.push([
          ae[ye][Le],
          W[ye][Fe]
        ]), le.set(_e2, i), fe.set(_e2, H), U.set(_e2, S.A), ue.set(_e2, S.Iy), ze.set(_e2, S.Iz), Be.set(_e2, S.J), lt.set(_e2, ot), je.set(_e2, {
          type: "I",
          d: b,
          bf: I,
          tf: E,
          tw: $,
          name: "Col"
        });
        const $t = new Array(12).fill(false);
        $t[10] = true, $t[11] = true, tt.set(_e2, $t);
      }
      for (let ye = 0; ye < j; ye++) for (let Le = 0; Le < me - 1; Le++) {
        const Fe = Y.length;
        Y.push([
          W[ye][Le],
          W[ye][Le + 1]
        ]), le.set(Fe, i), fe.set(Fe, H), U.set(Fe, x.A), ue.set(Fe, x.Iy), ze.set(Fe, x.Iz), Be.set(Fe, x.J), lt.set(Fe, ot), je.set(Fe, {
          type: "I",
          d: C,
          bf: R,
          tf: g,
          tw: f,
          name: "Vig"
        });
      }
      Y.length;
      for (let ye = 0; ye < me; ye++) for (let Le = 0; Le < j - 1; Le++) {
        const Fe = Y.length;
        Y.push([
          W[Le][ye],
          W[Le + 1][ye]
        ]), le.set(Fe, i), fe.set(Fe, H), U.set(Fe, z), ue.set(Fe, B), ze.set(Fe, O), Be.set(Fe, G), lt.set(Fe, ot), je.set(Fe, {
          type: "rect",
          b: k,
          h: k,
          name: "Corr"
        });
        const _e2 = new Array(12).fill(false);
        _e2[4] = true, _e2[5] = true, _e2[10] = true, _e2[11] = true, tt.set(Fe, _e2);
      }
      for (let ye = 0; ye < j - 1; ye++) for (let Le = 0; Le < me - 1; Le++) {
        const Fe = Y.length;
        Y.push([
          W[ye][Le],
          W[ye + 1][Le],
          W[ye + 1][Le + 1],
          W[ye][Le + 1]
        ]), le.set(Fe, i), fe.set(Fe, H), lt.set(Fe, ot), le.set(Fe, i);
      }
      const ut = /* @__PURE__ */ new Map(), no = [
        c,
        m,
        w,
        M,
        v,
        p
      ];
      for (let ye = 0; ye < j; ye++) for (let Le = 0; Le < u; Le++) ut.set(ae[ye][Le], no);
      const Ft = /* @__PURE__ */ new Map();
      for (let ye = 0; ye < j; ye++) for (let Le = 0; Le < me; Le++) {
        let Fe;
        ye === 0 ? Fe = (D[1] - D[0]) / 2 : ye === j - 1 ? Fe = (D[j - 1] - D[j - 2]) / 2 : Fe = (D[ye + 1] - D[ye - 1]) / 2;
        let _e2;
        Le === 0 ? _e2 = (de[1] - de[0]) / 2 : Le === me - 1 ? _e2 = (de[me - 1] - de[me - 2]) / 2 : _e2 = (de[Le + 1] - de[Le - 1]) / 2;
        const $t = -r * Fe * _e2;
        Ft.set(W[ye][Le], [
          0,
          0,
          $t,
          0,
          0,
          0
        ]);
      }
      e.nodes.val = se, e.elements.val = Y, e.nodeInputs && (e.nodeInputs.val = {
        supports: ut,
        loads: Ft
      });
      const kt = Y.filter((ye) => ye.length === 2).length, Oe = {
        elasticities: le,
        shearModuli: fe,
        areas: U,
        momentsOfInertiaY: ue,
        momentsOfInertiaZ: ze,
        torsionalConstants: Be,
        sectionShapes: je,
        momentReleases: tt,
        densities: lt
      }, Qe = /* @__PURE__ */ new Map(), It = /* @__PURE__ */ new Map();
      for (let ye = 0; ye < Y.length; ye++) Y[ye].length === 4 && (Qe.set(ye, d), It.set(ye, q));
      Oe.thicknesses = Qe, Oe.poissonsRatios = It, e.elementInputs && (e.elementInputs.val = Oe);
      try {
        const ye = performance.now(), Le = pt(se, Y, {
          supports: ut,
          loads: Ft
        }, Oe), Fe = performance.now() - ye;
        if (Le && e.deformOutputs) {
          e.deformOutputs.val = Le;
          const _e2 = so(se, Y, Oe, Le);
          e.analyzeOutputs && (e.analyzeOutputs.val = _e2);
          let $t = 0, So = -1;
          Le.deformations.forEach((Qo, en) => {
            Math.abs(Qo[2]) > Math.abs($t) && ($t = Qo[2], So = en);
          }), console.log(`P\xE9rgola: Uz_max=${$t.toExponential(4)} m en nodo ${So} | ${kt} frames + ${Y.length - kt} shells | ${Fe.toFixed(0)} ms`);
        }
      } catch (ye) {
        console.warn("Pergola:", ye.message);
      }
      const dt = De();
      dt && (dt.settings.shellResults.val = "displacementZ", dt.settings.deformedShape.val = true), setTimeout(() => st(), 50), Ne();
    }
    function ja() {
      var _a2, _b;
      (_a2 = document.getElementById("fem-log-panel")) == null ? void 0 : _a2.remove();
      const t = window.__femLog || [
        "<i>No hay log. Ejecuta un analisis primero.</i>"
      ], o = document.createElement("div");
      o.id = "fem-log-panel", o.style.cssText = "position:fixed;top:60px;right:10px;width:360px;max-height:500px;overflow-y:auto;background:var(--cad-bg);color:var(--cad-text);border:1px solid var(--cad-border);border-radius:8px;padding:10px;z-index:10001;font-family:'Segoe UI',system-ui,sans-serif;font-size:12px;line-height:1.6;box-shadow:0 4px 20px var(--cad-shadow);", o.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span style="font-size:14px;font-weight:bold;color:var(--cad-heading)">\u{1F4CB} Solver Log</span>
        <button id="fem-log-close" style="background:var(--cad-btn-bg);color:var(--cad-btn-text);border:1px solid var(--cad-btn-border);border-radius:3px;padding:2px 8px;cursor:pointer;font-size:11px;">\u2715</button>
      </div>
      <div style="font-family:'Segoe UI',system-ui,sans-serif;font-size:12px;line-height:1.7;">
        ${t.join("<br>")}
      </div>
    `, document.body.appendChild(o), (_b = o.querySelector("#fem-log-close")) == null ? void 0 : _b.addEventListener("click", () => o.remove());
    }
    function Wa() {
      var _a2, _b, _c;
      (_a2 = document.getElementById("pushover-panel")) == null ? void 0 : _a2.remove();
      const t = document.createElement("div");
      t.id = "pushover-panel", t.style.cssText = "position:fixed;top:60px;right:10px;width:420px;background:var(--cad-bg);color:var(--cad-text);border:1px solid var(--cad-border);border-radius:8px;padding:12px;z-index:10000;font-family:monospace;font-size:12px;box-shadow:0 4px 20px var(--cad-shadow);", t.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <b style="color:var(--cad-heading);font-size:14px;">Pushover Ciclico</b>
        <button id="pushover-close" style="background:var(--cad-btn-bg);color:var(--cad-btn-text);border:1px solid var(--cad-btn-border);border-radius:3px;padding:2px 8px;cursor:pointer;">X</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px;">
        <label>Col b (m): <input id="po-colB" type="number" value="0.30" step="0.05" min="0.15" max="0.60" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>Col h (m): <input id="po-colH" type="number" value="0.30" step="0.05" min="0.15" max="0.60" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>f'c (MPa): <input id="po-fc" type="number" value="30" step="5" min="15" max="60" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>Fy (MPa): <input id="po-fy" type="number" value="420" step="10" min="250" max="700" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>H col (m): <input id="po-H" type="number" value="1.30" step="0.1" min="0.5" max="4" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>L viga (m): <input id="po-L" type="number" value="2.00" step="0.1" min="1" max="6" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>As bar (cm2): <input id="po-As" type="number" value="2.0" step="0.5" min="0.5" max="8" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>N barras: <input id="po-nbar" type="number" value="3" step="1" min="2" max="8" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>Drift max (%): <input id="po-drift" type="number" value="5" step="0.5" min="1" max="10" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
        <label>N ciclos: <input id="po-ncycles" type="number" value="3" step="1" min="1" max="6" style="width:60px;background:var(--cad-input-bg);color:var(--cad-input-text);border:1px solid var(--cad-input-border);"></label>
      </div>
      <button id="pushover-run" style="width:100%;padding:6px;background:var(--cad-heading);color:#000;border:none;border-radius:4px;cursor:pointer;font-weight:bold;font-size:13px;">RUN PUSHOVER</button>
      <div id="pushover-status" style="margin-top:6px;height:16px;font-size:11px;color:var(--cad-info);"></div>
      <canvas id="pushover-canvas" width="400" height="280" style="width:100%;margin-top:6px;background:#111;border:1px solid var(--cad-border);border-radius:4px;"></canvas>
    `, document.body.appendChild(t), (_b = t.querySelector("#pushover-close")) == null ? void 0 : _b.addEventListener("click", () => t.remove()), (_c = t.querySelector("#pushover-run")) == null ? void 0 : _c.addEventListener("click", async () => {
        const o = (b) => {
          var _a3;
          return parseFloat(((_a3 = t.querySelector(`#${b}`)) == null ? void 0 : _a3.value) || "0");
        }, n = o("po-colB"), l = o("po-colH"), s = o("po-fc") * 1e3, u = o("po-fy") * 1e3, a = o("po-H"), i = o("po-L"), d = o("po-As") * 1e-4, r = o("po-nbar"), c = o("po-drift") / 100, m = o("po-ncycles"), w = t.querySelector("#pushover-status");
        w.textContent = "Generando historia de desplazamientos...";
        const M = [], v = c * a, p = 40;
        for (let b = 1; b <= m; b++) {
          const I = v * b / m;
          for (let E = 0; E <= p; E++) M.push(I * Math.sin(2 * Math.PI * E / p));
        }
        w.textContent = `Resolviendo pushover (${M.length} pasos)...`;
        try {
          const { cyclicPushover: b } = await na(async () => {
            const { cyclicPushover: E } = await import("./cyclicPushoverCpp-BLH7oKjQ.js").then(async (m2) => {
              await m2.__tla;
              return m2;
            });
            return {
              cyclicPushover: E
            };
          }, __vite__mapDeps([10,8])), I = await b({
            colHeight: a,
            beamLength: i,
            col: {
              b: n,
              h: l,
              fpc: -s,
              Fy_rebar: u,
              E_rebar: 2e8,
              rebar_area: d,
              cover: 0.04,
              n_rebar: r
            },
            beam: {
              b: 0.25,
              h: 0.3,
              fpc: -s,
              Fy_rebar: u,
              E_rebar: 2e8,
              rebar_area: d * 0.7,
              cover: 0.03,
              n_rebar: r
            },
            dispHistory: M
          });
          w.textContent = `Completado: ${I.nSteps} pasos`, Ga(t.querySelector("#pushover-canvas"), I.displacements, I.forces, `Pushover: ${n * 100}x${l * 100}cm, f'c=${s / 1e3}MPa, Fy=${u / 1e3}MPa`);
        } catch (b) {
          w.textContent = `Error: ${b.message}`, console.error("Pushover failed:", b);
        }
      });
    }
    function Ga(t, o, n, l) {
      const s = t.getContext("2d");
      if (!s || o.length === 0) return;
      const u = t.width, a = t.height, i = {
        left: 55,
        right: 15,
        top: 30,
        bottom: 35
      }, d = u - i.left - i.right, r = a - i.top - i.bottom;
      s.fillStyle = "#111118", s.fillRect(0, 0, u, a);
      let c = Math.min(...o), m = Math.max(...o), w = Math.min(...n), M = Math.max(...n);
      c === m && (c -= 0.01, m += 0.01), w === M && (w -= 1, M += 1);
      const v = m - c, p = M - w, b = (C) => i.left + (C - c) / v * d, I = (C) => i.top + r - (C - w) / p * r;
      s.strokeStyle = "#333", s.lineWidth = 0.5, c < 0 && m > 0 && (s.strokeStyle = "#555", s.beginPath(), s.moveTo(b(0), i.top), s.lineTo(b(0), i.top + r), s.stroke()), w < 0 && M > 0 && (s.beginPath(), s.moveTo(i.left, I(0)), s.lineTo(i.left + d, I(0)), s.stroke()), s.strokeStyle = "#ff4444", s.lineWidth = 1.5, s.beginPath(), s.moveTo(b(o[0]), I(n[0]));
      for (let C = 1; C < o.length; C++) s.lineTo(b(o[C]), I(n[C]));
      s.stroke(), s.fillStyle = "#aaa", s.font = "11px monospace", s.textAlign = "center", s.fillText("Desplazamiento (m)", i.left + d / 2, a - 5), s.save(), s.translate(12, i.top + r / 2), s.rotate(-Math.PI / 2), s.fillText("Fuerza (kN)", 0, 0), s.restore(), s.fillStyle = "#ee9b00", s.font = "bold 11px monospace", s.textAlign = "center", s.fillText(l, u / 2, 15), s.fillStyle = "#888", s.font = "9px monospace", s.textAlign = "center";
      const E = v / 5;
      for (let C = 0; C <= 5; C++) {
        const R = c + E * C;
        s.fillText((R * 1e3).toFixed(1), b(R), a - i.bottom + 15);
      }
      s.textAlign = "right";
      const $ = p / 5;
      for (let C = 0; C <= 5; C++) {
        const R = w + $ * C;
        s.fillText(R.toFixed(0), i.left - 5, I(R) + 3);
      }
    }
    let Uo = null;
    function Ya() {
      if (Uo) {
        Uo.remove(), Uo = null;
        return;
      }
      const t = document.createElement("div");
      t.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a1a2e;color:#eee;border:2px solid #ff6600;border-radius:8px;padding:16px;z-index:10001;width:400px;font-family:monospace;font-size:12px;box-shadow:0 4px 20px rgba(0,0,0,0.5);max-height:80vh;overflow-y:auto;", t.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <b style="color:#ff6600;font-size:14px;">\u{1F525} Nonlinear Analysis</b>
        <button id="nl-close" style="background:none;border:none;color:#888;cursor:pointer;font-size:18px;">\u2715</button>
      </div>
      <div style="margin-bottom:12px;">
        <b style="color:#ffcc00;">Steel02 Material Test</b>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:6px;">
          <label>Fy (kN/m\xB2):<input id="nl-fy" type="number" value="250000" style="width:80px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>E\u2080 (kN/m\xB2):<input id="nl-e0" type="number" value="200000000" style="width:80px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>b (ratio):<input id="nl-b" type="number" value="0.01" step="0.005" style="width:80px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>R\u2080:<input id="nl-r0" type="number" value="15" style="width:80px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>Amp (strain):<input id="nl-amp" type="number" value="0.02" step="0.005" style="width:80px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>Ciclos:<input id="nl-cycles" type="number" value="3" min="1" max="10" style="width:80px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
        </div>
        <button id="nl-test" style="margin-top:8px;padding:6px 16px;background:#ff6600;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;width:100%;">\u25B6 Run Steel02 Test</button>
      </div>
      <canvas id="nl-canvas" width="370" height="250" style="background:#0a0a1a;border:1px solid #333;border-radius:4px;width:100%;"></canvas>
      <div id="nl-info" style="margin-top:6px;color:#888;font-size:10px;"></div>
    `, document.body.appendChild(t), Uo = t, t.querySelector("#nl-close").addEventListener("click", () => {
        t.remove(), Uo = null;
      }), t.querySelector("#nl-test").addEventListener("click", () => Va(t));
    }
    function Va(t) {
      const o = parseFloat(t.querySelector("#nl-fy").value), n = parseFloat(t.querySelector("#nl-e0").value), l = parseFloat(t.querySelector("#nl-b").value), s = parseFloat(t.querySelector("#nl-r0").value), u = parseFloat(t.querySelector("#nl-amp").value), a = parseInt(t.querySelector("#nl-cycles").value), i = 100, d = [];
      for (let B = 0; B < a; B++) {
        const G = u * (1 + B * 0.5);
        for (let j = 0; j < i; j++) {
          const D = j / i * 2 * Math.PI;
          d.push(G * Math.sin(D));
        }
      }
      const r = o / n, c = l * n;
      let m = 0, w = 0, M = -r, v = r, p = 0, b = 0, I = 0, E = 0, $ = 0, C = 0;
      const R = [];
      for (const B of d) {
        let G = M, j = v, D = p, X = b, ee = I, de = E, me = $, _ = C, se;
        const Y = B - m;
        if (Math.abs(Y) < 1e-20) {
          R.push(w);
          continue;
        }
        if ((_ === 0 || _ === 3) && (Y < 0 ? (_ = 2, X = -r, ee = -o, D = X, de = 0, me = 0) : (_ = 1, X = r, ee = o, D = X, de = 0, me = 0)), _ === 2 && Y > 0) {
          _ = 1, de = m, me = w, m < G && (G = m);
          const ue = (j - G) / (2 * 1 * r), ze = 1 + 0 * Math.pow(ue, 0.8);
          X = (o * ze - c * r * ze - me + n * de) / (n - c), ee = o * ze + c * (X - r * ze), D = j;
        } else if (_ === 1 && Y < 0) {
          _ = 2, de = m, me = w, m > j && (j = m);
          const ue = (j - G) / (2 * 1 * r), ze = 1 + 0 * Math.pow(ue, 0.8);
          X = (-o * ze + c * r * ze - me + n * de) / (n - c), ee = -o * ze + c * (X + r * ze), D = G;
        }
        const ae = Math.abs((D - X) / r);
        let W = s - 0.925 * ae / (0.15 + ae);
        W < 0.1 && (W = 0.1);
        const le = (B - de) / (X - de), fe = 1 + Math.pow(Math.abs(le), W), U = Math.pow(fe, 1 / W);
        se = l * le + (1 - l) * le / U, se = se * (ee - me) + me, R.push(se), m = B, w = se, M = G, v = j, p = D, b = X, I = ee, E = de, $ = me, C = _;
      }
      const g = t.querySelector("#nl-canvas"), f = g.getContext("2d"), k = g.width, F = g.height;
      f.clearRect(0, 0, k, F);
      const q = Math.max(...d.map(Math.abs)), H = Math.max(...R.map(Math.abs)), h = (k - 40) / (2 * q), S = (F - 40) / (2 * H), x = k / 2, z = F / 2;
      f.strokeStyle = "#444", f.lineWidth = 1, f.beginPath(), f.moveTo(20, z), f.lineTo(k - 20, z), f.stroke(), f.beginPath(), f.moveTo(x, 20), f.lineTo(x, F - 20), f.stroke(), f.fillStyle = "#888", f.font = "10px monospace", f.textAlign = "center", f.fillText("\u03B5 (strain)", k - 40, z - 5), f.fillText("\u03C3 (stress)", x + 30, 15), f.fillText(`\xB1${(q * 100).toFixed(1)}%`, k - 30, z + 12), f.fillText(`\xB1${(H / 1e3).toFixed(0)} MPa`, x + 40, 30), f.strokeStyle = "#00ccff", f.lineWidth = 1.5, f.beginPath();
      for (let B = 0; B < d.length; B++) {
        const G = x + d[B] * h, j = z - R[B] * S;
        B === 0 ? f.moveTo(G, j) : f.lineTo(G, j);
      }
      f.stroke(), f.strokeStyle = "#ff333366", f.lineWidth = 1, f.setLineDash([
        4,
        4
      ]), f.beginPath(), f.moveTo(20, z - o * S), f.lineTo(k - 20, z - o * S), f.stroke(), f.beginPath(), f.moveTo(20, z + o * S), f.lineTo(k - 20, z + o * S), f.stroke(), f.setLineDash([]), f.fillStyle = "#ff6666", f.font = "9px monospace", f.fillText(`Fy = ${(o / 1e3).toFixed(0)} MPa`, k - 50, z - o * S - 5);
      const O = t.querySelector("#nl-info");
      O.textContent = `Steel02: Fy=${(o / 1e3).toFixed(0)} MPa, E\u2080=${(n / 1e6).toFixed(0)} GPa, b=${l}, R\u2080=${s} \u2014 ${a} ciclos, amp=${(u * 100).toFixed(1)}%`;
    }
    function Ja() {
      var _a2, _b, _c, _d;
      const t = document.querySelector(".rpt-overlay");
      if (t) {
        t.remove();
        return;
      }
      const o = e.nodes.val, n = e.elements.val, l = ((_a2 = e.elementInputs) == null ? void 0 : _a2.val) || {}, s = ((_b = e.nodeInputs) == null ? void 0 : _b.val) || {}, u = (_c = e.deformOutputs) == null ? void 0 : _c.val;
      if ((_d = e.analyzeOutputs) == null ? void 0 : _d.val, !o.length || !n.length) {
        alert("No hay modelo cargado");
        return;
      }
      const a = kl({
        nodes: o,
        elements: n,
        nodeInputs: s,
        elementInputs: l,
        deformOutputs: u
      });
      document.body.appendChild(a);
    }
    let Oo = null;
    function Xa(t) {
      Oo && Oo.remove();
      const o = document.createElement("div");
      o.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a1a2e;color:#eee;border:2px solid #00ccff;border-radius:8px;padding:16px;z-index:10001;width:320px;font-family:monospace;font-size:12px;box-shadow:0 4px 20px rgba(0,0,0,0.5);";
      const n = gn(), l = hn(), s = Object.entries(n).map(([r, c]) => `<option value="${c}">${r}</option>`).join(""), u = Object.entries(l).map(([r, c]) => `<option value="${c}">${r}</option>`).join("");
      o.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <b style="color:#00ccff;">Asignar Secci\xF3n (${t.length} elem.)</b>
        <button id="asgn-close" style="background:none;border:none;color:#888;cursor:pointer;font-size:18px;">\u2715</button>
      </div>
      <div style="margin-bottom:8px;">
        <label>Tipo:</label>
        <select id="asgn-type" style="background:#333;color:#fff;border:1px solid #555;padding:3px;width:100%;margin-top:2px;">
          <option value="rect">Rectangular (b\xD7h)</option>
          <option value="circ">Circular (d)</option>
          <option value="W">Perfil W</option>
          <option value="HSS">Perfil HSS</option>
          <option value="I-param">I Param\xE9trica</option>
          <option value="tubular">Tubular Hueca</option>
          <option value="CFT">CFT (Tubo relleno concreto)</option>
        </select>
      </div>
      <div id="asgn-params" style="margin-bottom:10px;"></div>

      <div style="border-top:1px solid #444;padding-top:8px;margin-bottom:8px;">
        <b style="color:#ff6666;font-size:11px;">Frame Releases</b>
        <table style="width:100%;border-collapse:collapse;font-size:10px;margin-top:4px;">
          <tr>
            <td style="color:#888"></td>
            <td colspan="2" style="text-align:center;color:#ff6666;font-weight:bold;font-size:9px">Release</td>
            <td colspan="2" style="text-align:center;color:#00ccff;font-weight:bold;font-size:9px">Partial Fixity Springs</td>
          </tr>
          <tr>
            <td style="color:#888"></td>
            <td style="text-align:center;color:#aaa;font-size:9px">Start</td>
            <td style="text-align:center;color:#aaa;font-size:9px">End</td>
            <td style="text-align:center;color:#aaa;font-size:9px">Start</td>
            <td style="text-align:center;color:#aaa;font-size:9px">End</td>
          </tr>
          <tr><td style="color:#ccc">Axial Load</td><td style="text-align:center"><input type="checkbox" data-asgn-rel="0"></td><td style="text-align:center"><input type="checkbox" data-asgn-rel="6"></td><td><input type="number" data-asgn-spr="0" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td><td><input type="number" data-asgn-spr="6" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td></tr>
          <tr><td style="color:#ccc">Shear V2</td><td style="text-align:center"><input type="checkbox" data-asgn-rel="1"></td><td style="text-align:center"><input type="checkbox" data-asgn-rel="7"></td><td><input type="number" data-asgn-spr="1" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td><td><input type="number" data-asgn-spr="7" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td></tr>
          <tr><td style="color:#ccc">Shear V3</td><td style="text-align:center"><input type="checkbox" data-asgn-rel="2"></td><td style="text-align:center"><input type="checkbox" data-asgn-rel="8"></td><td><input type="number" data-asgn-spr="2" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td><td><input type="number" data-asgn-spr="8" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td></tr>
          <tr><td style="color:#ccc">Torsion</td><td style="text-align:center"><input type="checkbox" data-asgn-rel="3"></td><td style="text-align:center"><input type="checkbox" data-asgn-rel="9"></td><td><input type="number" data-asgn-spr="3" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td><td><input type="number" data-asgn-spr="9" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td></tr>
          <tr><td style="color:#ccc">Moment 22</td><td style="text-align:center"><input type="checkbox" data-asgn-rel="4"></td><td style="text-align:center"><input type="checkbox" data-asgn-rel="10"></td><td><input type="number" data-asgn-spr="4" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td><td><input type="number" data-asgn-spr="10" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td></tr>
          <tr><td style="color:#ccc">Moment 33</td><td style="text-align:center"><input type="checkbox" data-asgn-rel="5"></td><td style="text-align:center"><input type="checkbox" data-asgn-rel="11"></td><td><input type="number" data-asgn-spr="5" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td><td><input type="number" data-asgn-spr="11" placeholder="0" style="width:45px;background:#333;color:#fff;border:1px solid #555;font-size:9px;text-align:right"></td></tr>
        </table>
        <div style="color:#888;font-size:9px;margin-top:2px;">Release = condensaci\xF3n est\xE1tica (DOF libre). Spring = conexi\xF3n semi-r\xEDgida.</div>
      </div>

      <div style="border-top:1px solid #444;padding-top:8px;margin-bottom:10px;">
        <b style="color:#33ff33;font-size:11px;">Property/Stiffness Modification Factors</b>
        <div style="margin-top:6px;font-size:11px;">
          <div style="display:grid;grid-template-columns:160px 60px;gap:2px 8px;align-items:center;">
            <span style="color:#aaa">Cross-section (axial) Area</span>
            <input id="asgn-mod-a" type="number" value="1.0" step="0.1" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
            <span style="color:#aaa">Shear Area dir 2 <span style="color:#666;font-size:9px">(Vy)</span></span>
            <input id="asgn-mod-as2" type="number" value="1.0" step="0.1" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
            <span style="color:#aaa">Shear Area dir 3 <span style="color:#666;font-size:9px">(Vz)</span></span>
            <input id="asgn-mod-as3" type="number" value="1.0" step="0.1" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
            <span style="color:#aaa">Torsional Constant</span>
            <input id="asgn-mod-j" type="number" value="1.0" step="0.1" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
            <span style="color:#aaa">Moment of Inertia 2</span>
            <input id="asgn-mod-i" type="number" value="1.0" step="0.05" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
            <span style="color:#aaa">Moment of Inertia 3</span>
            <input id="asgn-mod-i3" type="number" value="1.0" step="0.05" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
            <span style="color:#aaa">Mass</span>
            <input id="asgn-mod-mass" type="number" value="1.0" step="0.1" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
            <span style="color:#aaa">Weight</span>
            <input id="asgn-mod-weight" type="number" value="1.0" step="0.1" min="0" max="2" style="width:55px;background:#333;color:#fff;border:1px solid #555;padding:2px;text-align:center;">
          </div>
        </div>
        <div style="color:#888;font-size:9px;margin-top:4px;line-height:1.4;">
          1.0 = sin cambio &nbsp;|&nbsp; 0.35 = seccion agrietada (ACI 318)<br>
          <span style="color:#ffaa00">Shear Area:</span> 1 = <b>Timoshenko</b> (incluye corte) &nbsp;|&nbsp; 0 = <b>Euler-Bernoulli</b> (ignora corte)
        </div>
      </div>

      <div style="display:flex;gap:8px;">
        <button id="asgn-apply" style="flex:1;padding:8px;background:#00aa66;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">\u2713 Aplicar</button>
        <button id="asgn-remove" style="flex:1;padding:8px;background:#996600;color:#fff;border:none;border-radius:4px;cursor:pointer;">\u21BA Quitar Override</button>
      </div>
    `, document.body.appendChild(o), Oo = o;
      const a = o.querySelector("#asgn-type"), i = o.querySelector("#asgn-params");
      function d() {
        const r = a.value;
        let c = "";
        r === "rect" ? c = `<div style="display:flex;gap:6px;"><label>b(m):<input id="ap-b" type="number" value="0.30" step="0.05" min="0.1" max="2" style="width:70px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
                <label>h(m):<input id="ap-h" type="number" value="0.50" step="0.05" min="0.1" max="2" style="width:70px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label></div>` : r === "circ" ? c = '<label>d(m):<input id="ap-d" type="number" value="0.40" step="0.05" min="0.1" max="2" style="width:70px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>' : r === "W" ? c = `<select id="ap-profile" style="background:#333;color:#fff;border:1px solid #555;padding:3px;width:100%;">${s}</select>` : r === "HSS" ? c = `<select id="ap-profile" style="background:#333;color:#fff;border:1px solid #555;padding:3px;width:100%;">${u}</select>` : r === "I-param" ? c = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
          <label>bf(m):<input id="ap-bf" type="number" value="0.20" step="0.01" style="width:65px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>h(m):<input id="ap-hf" type="number" value="0.40" step="0.01" style="width:65px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>tf(m):<input id="ap-tf" type="number" value="0.015" step="0.001" style="width:65px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>tw(m):<input id="ap-tw" type="number" value="0.010" step="0.001" style="width:65px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
        </div>` : r === "tubular" && (c = `<div style="display:flex;gap:6px;">
          <label>b(m):<input id="ap-bc" type="number" value="0.20" step="0.01" style="width:60px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>h(m):<input id="ap-hc" type="number" value="0.30" step="0.01" style="width:60px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
          <label>t(m):<input id="ap-t" type="number" value="0.008" step="0.001" style="width:60px;background:#333;color:#fff;border:1px solid #555;padding:2px;"></label>
        </div>`), i.innerHTML = c;
      }
      a.addEventListener("change", d), d(), o.querySelector("#asgn-close").addEventListener("click", () => {
        o.remove(), Oo = null;
      }), o.querySelector("#asgn-apply").addEventListener("click", () => {
        var _a2, _b, _c, _d, _e, _f, _g, _h;
        const r = a.value, c = {
          secType: r
        };
        r === "rect" ? (c.b = parseFloat(o.querySelector("#ap-b").value), c.h = parseFloat(o.querySelector("#ap-h").value), c.material = 0) : r === "circ" ? (c.b = parseFloat(o.querySelector("#ap-d").value), c.material = 0) : r === "W" || r === "HSS" ? (c.profileIdx = parseInt(o.querySelector("#ap-profile").value), c.material = 1) : r === "I-param" ? (c.bf = parseFloat(o.querySelector("#ap-bf").value), c.hf = parseFloat(o.querySelector("#ap-hf").value), c.tf = parseFloat(o.querySelector("#ap-tf").value), c.tw = parseFloat(o.querySelector("#ap-tw").value), c.material = 1) : r === "tubular" && (c.bc = parseFloat(o.querySelector("#ap-bc").value), c.hc = parseFloat(o.querySelector("#ap-hc").value), c.t = parseFloat(o.querySelector("#ap-t").value), c.material = 1);
        const m = new Array(12).fill(false), w = new Array(12).fill(0);
        o.querySelectorAll("input[data-asgn-rel]").forEach((M) => {
          m[parseInt(M.dataset.asgnRel)] = M.checked;
        }), o.querySelectorAll("input[data-asgn-spr]").forEach((M) => {
          const v = parseFloat(M.value);
          v > 0 && (w[parseInt(M.dataset.asgnSpr)] = v);
        }), c.releases12 = m, c.springs12 = w, c.releaseRotStart = m[4] || m[5], c.releaseRotEnd = m[10] || m[11], c.releaseAxial = m[0], c.releaseTorsion = m[3], c.modI = parseFloat((_a2 = o.querySelector("#asgn-mod-i")) == null ? void 0 : _a2.value) || 1, c.modA = parseFloat((_b = o.querySelector("#asgn-mod-a")) == null ? void 0 : _b.value) || 1, c.modJ = parseFloat((_c = o.querySelector("#asgn-mod-j")) == null ? void 0 : _c.value) || 1, c.modAs2 = parseFloat((_d = o.querySelector("#asgn-mod-as2")) == null ? void 0 : _d.value) ?? 1, c.modAs3 = parseFloat((_e = o.querySelector("#asgn-mod-as3")) == null ? void 0 : _e.value) ?? 1, c.modI3 = parseFloat((_f = o.querySelector("#asgn-mod-i3")) == null ? void 0 : _f.value) || 1, c.modMass = parseFloat((_g = o.querySelector("#asgn-mod-mass")) == null ? void 0 : _g.value) || 1, c.modWeight = parseFloat((_h = o.querySelector("#asgn-mod-weight")) == null ? void 0 : _h.value) || 1, t.forEach((M) => Ee.set(M, {
          ...c
        })), o.remove(), Oo = null, fo(), e.elementInputs.val = {
          ...e.elementInputs.val
        };
      }), o.querySelector("#asgn-remove").addEventListener("click", () => {
        t.forEach((r) => Ee.delete(r)), o.remove(), Oo = null, fo(), e.elementInputs.val = {
          ...e.elementInputs.val
        };
      });
    }
    let No = null;
    function Ka(t) {
      var _a2, _b, _c;
      No && No.remove();
      const o = e.nodes.val, n = e.elements.val[t];
      if (!n || n.length !== 2) return;
      const l = o[n[0]], s = o[n[1]], u = Math.abs(s[0] - l[0]), a = Math.abs(s[1] - l[1]), i = Math.abs(s[2] - l[2]), d = a > u && a > i, r = Math.sqrt(u * u + a * a + i * i), c = Ce.get(t) ?? 0, m = (_c = (_b = (_a2 = e.elementInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.sectionShapes) == null ? void 0 : _c.get(t), w = (m == null ? void 0 : m.name) || (m ? `${m.type} ${((m.b ?? 0) * 100).toFixed(0)}x${((m.h ?? 0) * 100).toFixed(0)}` : "\u2014"), M = document.createElement("div");
      M.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a1a2e;color:#eee;border:2px solid #ff9900;border-radius:8px;padding:16px;z-index:10000;min-width:280px;font-family:monospace;font-size:13px;box-shadow:0 4px 20px rgba(0,0,0,0.5);", M.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <b style="color:#ff9900;">Elemento ${t}</b>
        <button id="ep-close" style="background:none;border:none;color:#888;cursor:pointer;font-size:18px;">\u2715</button>
      </div>
      <div style="margin-bottom:8px;">
        <span style="color:#888;">Tipo:</span> ${d ? "Columna" : "Viga"} &nbsp;
        <span style="color:#888;">Piso:</span> ${c + 1} &nbsp;
        <span style="color:#888;">L:</span> ${r.toFixed(3)} m
      </div>
      <div style="margin-bottom:8px;">
        <span style="color:#888;">Secci\xF3n:</span> <span style="color:#00ccff;">${w}</span>
      </div>
      <div style="margin-bottom:8px;">
        <span style="color:#888;">Nodos:</span> ${n[0]} \u2192 ${n[1]}
      </div>
      <hr style="border-color:#333;margin:12px 0;">
      <div style="display:flex;gap:8px;">
        <button id="ep-delete" style="flex:1;padding:8px;background:#cc3333;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">\u{1F5D1} Eliminar</button>
        <button id="ep-inspect" style="flex:1;padding:8px;background:#336699;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">\u{1F50D} Inspect</button>
      </div>
    `, document.body.appendChild(M), No = M, M.querySelector("#ep-close").addEventListener("click", () => {
        M.remove(), No = null, Mo();
      }), M.querySelector("#ep-delete").addEventListener("click", () => {
        Q.add(t), M.remove(), No = null, Mo(), we();
      }), M.querySelector("#ep-inspect").addEventListener("click", () => {
        M.remove(), No = null, Ws(t);
      });
    }
    setTimeout(() => {
      const t = document.getElementById("viewer");
      if (!t) return;
      const o = t.querySelector("canvas");
      if (!o) return;
      let n = null, l = null;
      const s = 5;
      function u(d) {
        const r = De();
        if (!r) return null;
        const c = r.controls.object, m = new Me(d[0], d[1], d[2]);
        m.project(c);
        const w = o.getBoundingClientRect();
        return {
          x: (m.x + 1) / 2 * w.width,
          y: (-m.y + 1) / 2 * w.height
        };
      }
      function a(d, r, c, m, w) {
        const M = Math.min(d, c), v = Math.max(d, c), p = Math.min(r, m), b = Math.max(r, m), I = e.nodes.val, E = e.elements.val, $ = [];
        for (let C = 0; C < E.length; C++) {
          const R = E[C], g = R.map((f) => u(I[f])).filter(Boolean);
          if (g.length !== 0) if (w) g.every((k) => k.x >= M && k.x <= v && k.y >= p && k.y <= b) && $.push(C);
          else {
            if (g.some((k) => k.x >= M && k.x <= v && k.y >= p && k.y <= b)) {
              $.push(C);
              continue;
            }
            if (R.length === 2) {
              const k = g[0], F = g[1];
              i(k.x, k.y, F.x, F.y, M, p, v, b) && $.push(C);
            }
          }
        }
        return $;
      }
      function i(d, r, c, m, w, M, v, p) {
        const b = (E, $) => E >= w && E <= v && $ >= M && $ <= p;
        if (b(d, r) || b(c, m)) return true;
        const I = (E, $, C, R, g, f, k, F) => {
          const q = (C - E) * (F - f) - (R - $) * (k - g);
          if (Math.abs(q) < 1e-10) return false;
          const H = ((g - E) * (F - f) - (f - $) * (k - g)) / q, h = ((g - E) * (R - $) - (f - $) * (C - E)) / q;
          return H >= 0 && H <= 1 && h >= 0 && h <= 1;
        };
        return I(d, r, c, m, w, M, v, M) || I(d, r, c, m, v, M, v, p) || I(d, r, c, m, w, p, v, p) || I(d, r, c, m, w, M, w, p);
      }
      o.addEventListener("mousedown", (d) => {
        Ct && (n = {
          x: d.offsetX,
          y: d.offsetY
        });
      }), o.addEventListener("mousemove", (d) => {
        if (eo) {
          const c = De();
          if (!c) return;
          const m = Ns(d.clientX, d.clientY, c.camera, c.rendererElm);
          if (ct.track && m.snapType === "node" && m.nodeIdx !== null && m.nodeIdx !== wo && Fa(m.nodeIdx), ct.track && wo !== null && m.worldPos && m.snapType !== "node") {
            const w = Pa(m.worldPos, wo);
            w && (m.worldPos = w, m.snapType = "grid");
          }
          if (wo !== null && m.worldPos) {
            const w = e.nodes.val[wo];
            w && Os(d.clientX, d.clientY, new Me(...w), m.worldPos);
          } else if (at !== null && m.worldPos) {
            const w = e.nodes.val[at];
            w && Os(d.clientX, d.clientY, new Me(...w), m.worldPos);
          } else Bt && (Bt.remove(), Bt = null);
          m.nodeIdx, Hs(m), o.style.cursor = m.snapType !== "free" ? "pointer" : "crosshair";
          return;
        }
        if (!Yt && !Ct) return;
        if (Ct && n) {
          const c = d.offsetX - n.x, m = d.offsetY - n.y;
          if (Math.abs(c) > s || Math.abs(m) > s) {
            l || (l = document.createElement("div"), l.style.cssText = "position:absolute;pointer-events:none;z-index:9999;", o.parentElement.style.position = "relative", o.parentElement.appendChild(l));
            const w = c > 0, M = Math.min(n.x, d.offsetX), v = Math.min(n.y, d.offsetY), p = Math.abs(c), b = Math.abs(m);
            l.style.left = M + "px", l.style.top = v + "px", l.style.width = p + "px", l.style.height = b + "px", l.style.border = w ? "2px solid #3399ff" : "2px dashed #33ff33", l.style.background = w ? "rgba(51,153,255,0.1)" : "rgba(51,255,51,0.1)", o.style.cursor = "crosshair";
            return;
          }
        }
        const r = Yn(d);
        if (r >= 0) Ds(r), o.style.cursor = "pointer";
        else {
          if (At) {
            const c = De();
            c == null ? void 0 : c.scene.remove(At), At = null, c == null ? void 0 : c.render();
          }
          o.style.cursor = Ct ? "crosshair" : "";
        }
      }), o.addEventListener("mouseup", (d) => {
        if (Ct && n) {
          const r = d.offsetX - n.x, c = d.offsetY - n.y;
          if (Math.abs(r) > s || Math.abs(c) > s) {
            const m = r > 0, w = a(n.x, n.y, d.offsetX, d.offsetY, m);
            d.ctrlKey || d.metaKey || (et.clear(), bo()), w.forEach((v) => {
              et.has(v) || (et.add(v), jn(v));
            }), go();
          }
          l && (l.remove(), l = null), n = null, o.style.cursor = "crosshair";
          return;
        }
        n = null;
      }), o.addEventListener("click", (d) => {
        if (eo) {
          const r = De();
          if (!r) return;
          const c = Ns(d.clientX, d.clientY, r.camera, r.rendererElm);
          (c.worldPos || c.nodeIdx !== null) && (_a(c), Hs(c));
          return;
        }
        if (Ct) {
          if (l) return;
          const r = Yn(d), c = d.ctrlKey || d.metaKey;
          if (r >= 0) {
            if (c) if (et.has(r)) {
              et.delete(r);
              const m = mo.findIndex((w) => w.__elemIdx === r);
              if (m >= 0) {
                const w = De();
                w == null ? void 0 : w.scene.remove(mo[m]), mo[m].geometry.dispose(), mo[m].material.dispose(), mo.splice(m, 1), w == null ? void 0 : w.render();
              }
            } else et.add(r), jn(r);
            else et.clear(), bo(), et.add(r), jn(r);
            go();
          } else c || (et.clear(), bo(), go());
          return;
        }
        if (Yt) {
          const r = Yn(d);
          r >= 0 && (Ds(r), Ka(r));
        }
      });
    }, 500);
    const Ua = ia.v;
    jo.derive(() => {
      var _a2;
      ia.v === Ua && (e.nodes.val, e.elements.val, (_a2 = e.nodeInputs) == null ? void 0 : _a2.val, Ne());
    }), Re.modal = (t) => {
      var _a2, _b;
      if (t === void 0 && (t = !Wt), Wt = t, (_a2 = ve.querySelector("#cad3d-modal")) == null ? void 0 : _a2.classList.toggle("active", Wt), Wt) {
        const n = De();
        ((_b = n == null ? void 0 : n.settings) == null ? void 0 : _b.loads) && (ln = n.settings.loads.rawVal, n.settings.loads.val = false), qn(), ve.querySelector("#cad3d-mode-prev").style.display = "", ve.querySelector("#cad3d-mode-next").style.display = "", ve.querySelector("#cad3d-mode-label").style.display = "";
      } else _n(), ve.querySelector("#cad3d-mode-prev").style.display = "none", ve.querySelector("#cad3d-mode-next").style.display = "none", ve.querySelector("#cad3d-mode-label").style.display = "none", A && A !== "placa-q4" && A !== "placa-3q" && we(), setTimeout(() => {
        var _a3;
        const n = De();
        ((_a3 = n == null ? void 0 : n.settings) == null ? void 0 : _a3.loads) && ln && (n.settings.loads.val = true);
      }, 600);
      console.log(`Modal analysis: ${Wt ? "ON" : "OFF"}`);
    }, Re.setMode = (t) => {
      var _a2;
      if (!(ft == null ? void 0 : ft.modeShapes)) {
        console.error("No modal results");
        return;
      }
      Mt = Math.max(0, Math.min(t, ft.modeShapes.length - 1));
      const o = ft.modeShapes[Mt], { extent: n } = $o();
      let l = 0;
      for (let u = 0; u < ao.length; u++) {
        const a = o[u * 6] || 0, i = o[u * 6 + 1] || 0, d = o[u * 6 + 2] || 0;
        l = Math.max(l, Math.sqrt(a * a + i * i + d * d));
      }
      an = l > 1e-12 ? n * 0.05 / l : 1, Ko();
      const s = ve.querySelector("#cad3d-mode-label");
      s && ft.frequencies && (s.textContent = `Modo ${Mt + 1} \u2014 ${ft.frequencies[Mt].toFixed(2)} Hz`), console.log(`Modo ${Mt + 1}: f = ${(_a2 = ft.frequencies) == null ? void 0 : _a2[Mt].toFixed(4)} Hz`);
    }, window.cad = Re, console.log("FEM Studio CLI ready. Type cad.help() for commands."), setTimeout(() => {
      document.body.appendChild(ve), document.body.appendChild(Yo.div);
    }, 0), setTimeout(() => {
      e.nodes.val.length === 0 && (He("muro-q4"), Kn(), On("muro-q4"), setTimeout(() => {
        A === "muro-q4" && Kt();
      }, 200));
    }, 100);
    const Zo = document.createElement("button");
    Zo.id = "mobile-menu-btn", Zo.innerHTML = "\u2630", Zo.addEventListener("click", () => {
      const t = document.getElementById("cad3d-panel");
      t && (t.classList.toggle("mobile-open"), Zo.innerHTML = t.classList.contains("mobile-open") ? "\u2715" : "\u2630");
    }), document.body.appendChild(Zo);
    const oo = document.createElement("button");
    oo.id = "fullscreen-btn", oo.innerHTML = "\u26F6", oo.title = "Pantalla completa", oo.style.cssText = `
    position: fixed; bottom: 20px; right: 78px; z-index: 9999999;
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, #333, #555);
    color: white; border: 3px solid rgba(255,255,255,0.2);
    font-size: 22px; cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex; align-items: center; justify-content: center;
  `, oo.addEventListener("mouseenter", () => {
      oo.style.transform = "scale(1.15)";
    }), oo.addEventListener("mouseleave", () => {
      oo.style.transform = "scale(1)";
    }), oo.addEventListener("click", () => {
      document.fullscreenElement ? document.exitFullscreen().catch(() => {
      }) : document.documentElement.requestFullscreen().catch(() => {
      });
    }), document.body.appendChild(oo), document.body.appendChild(_l());
    const Vt = document.createElement("button");
    Vt.id = "lang-toggle-btn", Vt.textContent = es() === "es" ? "EN" : "ES", Vt.title = es() === "es" ? "Switch to English" : "Cambiar a Espa\xF1ol", Vt.style.cssText = `
    position: fixed; bottom: 20px; right: 136px; z-index: 9999999;
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, #1a4a7a, #2a6ab0);
    color: white; border: 3px solid rgba(255,255,255,0.2);
    font-size: 14px; font-weight: bold; cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex; align-items: center; justify-content: center;
  `, Vt.addEventListener("mouseenter", () => {
      Vt.style.transform = "scale(1.15)";
    }), Vt.addEventListener("mouseleave", () => {
      Vt.style.transform = "scale(1)";
    }), Vt.addEventListener("click", () => {
      const t = es() === "es" ? "en" : "es";
      hl(t), Vt.textContent = t === "es" ? "EN" : "ES", Vt.title = t === "es" ? "Switch to English" : "Cambiar a Espa\xF1ol", xl();
    }), document.body.appendChild(Vt);
    const Un = new URLSearchParams(window.location.search).get("t");
    Un && setTimeout(() => {
      On(Un), Re.example(Un);
    }, 300);
    const ta = document.createElement("span");
    return ta.style.display = "none", ta;
  };
});
export {
  __tla,
  ma as c,
  dr as g
};
