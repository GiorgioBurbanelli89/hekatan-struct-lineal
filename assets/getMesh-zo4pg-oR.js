import { _ as Qe } from "./__vite-browser-external-D7Ct-6yo.js";
import { m as j, t as Xe, s as de, d as pe, n as ye, c as J, b as Je } from "./pureFunctionsAny.generated-DeJSBP3k.js";
let Ke, yr, _r, K;
let __tla = (async () => {
  yr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
  Ke = function(n) {
    return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
  };
  function je(n) {
    if (n.__esModule) return n;
    var t = n.default;
    if (typeof t == "function") {
      var o = function s() {
        return this instanceof s ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
      };
      o.prototype = t.prototype;
    } else o = {};
    return Object.defineProperty(o, "__esModule", {
      value: true
    }), Object.keys(n).forEach(function(s) {
      var u = Object.getOwnPropertyDescriptor(n, s);
      Object.defineProperty(o, s, u.get ? u : {
        enumerable: true,
        get: function() {
          return n[s];
        }
      });
    }), o;
  }
  K = je(Qe);
  var _e = {
    exports: {}
  };
  (function(n, t) {
    var o = function() {
      var s = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
      return typeof __filename < "u" && (s = s || __filename), function(r) {
        r = r || {};
        var r = typeof r < "u" ? r : {}, m, E;
        r.ready = new Promise(function(e, i) {
          m = e, E = i;
        });
        var _ = {}, w;
        for (w in r) r.hasOwnProperty(w) && (_[w] = r[w]);
        var P = function(e, i) {
          throw i;
        }, I = false, d = false, x = false, ee = false;
        I = typeof window == "object", d = typeof importScripts == "function", x = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string", ee = !I && !x && !d;
        var v = "";
        function Ae(e) {
          return r.locateFile ? r.locateFile(e, v) : v + e;
        }
        var L, N, G, z;
        x ? (d ? v = K.dirname(v) + "/" : v = __dirname + "/", L = function(i, a) {
          return G || (G = K), z || (z = K), i = z.normalize(i), G.readFileSync(i, a ? null : "utf8");
        }, N = function(i) {
          var a = L(i, true);
          return a.buffer || (a = new Uint8Array(a)), re(a.buffer), a;
        }, process.argv.length > 1 && process.argv[1].replace(/\\/g, "/"), process.argv.slice(2), process.on("uncaughtException", function(e) {
          if (!(e instanceof he)) throw e;
        }), process.on("unhandledRejection", M), P = function(e) {
          process.exit(e);
        }, r.inspect = function() {
          return "[Emscripten Module object]";
        }) : ee ? (typeof read < "u" && (L = function(i) {
          return read(i);
        }), N = function(i) {
          var a;
          return typeof readbuffer == "function" ? new Uint8Array(readbuffer(i)) : (a = read(i, "binary"), re(typeof a == "object"), a);
        }, typeof scriptArgs < "u" && scriptArgs, typeof quit == "function" && (P = function(e) {
          quit(e);
        }), typeof print < "u" && (typeof console > "u" && (console = {}), console.log = print, console.warn = console.error = typeof printErr < "u" ? printErr : print)) : (I || d) && (d ? v = self.location.href : document.currentScript && (v = document.currentScript.src), s && (v = s), v.indexOf("blob:") !== 0 ? v = v.substr(0, v.lastIndexOf("/") + 1) : v = "", L = function(i) {
          var a = new XMLHttpRequest();
          return a.open("GET", i, false), a.send(null), a.responseText;
        }, d && (N = function(i) {
          var a = new XMLHttpRequest();
          return a.open("GET", i, false), a.responseType = "arraybuffer", a.send(null), new Uint8Array(a.response);
        }));
        var Ee = r.print || console.log.bind(console), F = r.printErr || console.warn.bind(console);
        for (w in _) _.hasOwnProperty(w) && (r[w] = _[w]);
        _ = null, r.arguments && r.arguments, r.thisProgram && r.thisProgram, r.quit && (P = r.quit);
        var U;
        r.wasmBinary && (U = r.wasmBinary);
        var Y;
        r.noExitRuntime && (Y = r.noExitRuntime), typeof WebAssembly != "object" && M("no native wasm support detected");
        var B, V, Z = false;
        function re(e, i) {
          e || M("Assertion failed: " + i);
        }
        var te = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0;
        function ne(e, i, a) {
          for (var h = i + a, b = i; e[b] && !(b >= h); ) ++b;
          if (b - i > 16 && e.subarray && te) return te.decode(e.subarray(i, b));
          for (var g = ""; i < b; ) {
            var l = e[i++];
            if (!(l & 128)) {
              g += String.fromCharCode(l);
              continue;
            }
            var f = e[i++] & 63;
            if ((l & 224) == 192) {
              g += String.fromCharCode((l & 31) << 6 | f);
              continue;
            }
            var A = e[i++] & 63;
            if ((l & 240) == 224 ? l = (l & 15) << 12 | f << 6 | A : l = (l & 7) << 18 | f << 12 | A << 6 | e[i++] & 63, l < 65536) g += String.fromCharCode(l);
            else {
              var ge = l - 65536;
              g += String.fromCharCode(55296 | ge >> 10, 56320 | ge & 1023);
            }
          }
          return g;
        }
        function we(e, i) {
          return e ? ne($, e, i) : "";
        }
        function Re(e, i, a, h) {
          if (!(h > 0)) return 0;
          for (var b = a, g = a + h - 1, l = 0; l < e.length; ++l) {
            var f = e.charCodeAt(l);
            if (f >= 55296 && f <= 57343) {
              var A = e.charCodeAt(++l);
              f = 65536 + ((f & 1023) << 10) | A & 1023;
            }
            if (f <= 127) {
              if (a >= g) break;
              i[a++] = f;
            } else if (f <= 2047) {
              if (a + 1 >= g) break;
              i[a++] = 192 | f >> 6, i[a++] = 128 | f & 63;
            } else if (f <= 65535) {
              if (a + 2 >= g) break;
              i[a++] = 224 | f >> 12, i[a++] = 128 | f >> 6 & 63, i[a++] = 128 | f & 63;
            } else {
              if (a + 3 >= g) break;
              i[a++] = 240 | f >> 18, i[a++] = 128 | f >> 12 & 63, i[a++] = 128 | f >> 6 & 63, i[a++] = 128 | f & 63;
            }
          }
          return i[a] = 0, a - b;
        }
        function Te(e, i, a) {
          return Re(e, $, i, a);
        }
        function Se(e) {
          for (var i = 0, a = 0; a < e.length; ++a) {
            var h = e.charCodeAt(a);
            h >= 55296 && h <= 57343 && (h = 65536 + ((h & 1023) << 10) | e.charCodeAt(++a) & 1023), h <= 127 ? ++i : h <= 2047 ? i += 2 : h <= 65535 ? i += 3 : i += 4;
          }
          return i;
        }
        var ie = 65536, q, $, T;
        function Pe(e) {
          q = e, r.HEAP8 = new Int8Array(e), r.HEAP16 = new Int16Array(e), r.HEAP32 = T = new Int32Array(e), r.HEAPU8 = $ = new Uint8Array(e), r.HEAPU16 = new Uint16Array(e), r.HEAPU32 = new Uint32Array(e), r.HEAPF32 = new Float32Array(e), r.HEAPF64 = new Float64Array(e);
        }
        var Q = r.INITIAL_MEMORY || 16777216;
        r.wasmMemory ? B = r.wasmMemory : B = new WebAssembly.Memory({
          initial: Q / ie,
          maximum: Q / ie
        }), B && (q = B.buffer), Q = q.byteLength, Pe(q);
        var se = [], ae = [], Ie = [], oe = [];
        function Fe() {
          if (r.preRun) for (typeof r.preRun == "function" && (r.preRun = [
            r.preRun
          ]); r.preRun.length; ) Ue(r.preRun.shift());
          D(se);
        }
        function Me() {
          D(ae);
        }
        function Oe() {
          D(Ie);
        }
        function Ne() {
          if (r.postRun) for (typeof r.postRun == "function" && (r.postRun = [
            r.postRun
          ]); r.postRun.length; ) Be(r.postRun.shift());
          D(oe);
        }
        function Ue(e) {
          se.unshift(e);
        }
        function Be(e) {
          oe.unshift(e);
        }
        var S = 0, H = null;
        function $e(e) {
          S++, r.monitorRunDependencies && r.monitorRunDependencies(S);
        }
        function He(e) {
          if (S--, r.monitorRunDependencies && r.monitorRunDependencies(S), S == 0 && H) {
            var i = H;
            H = null, i();
          }
        }
        r.preloadedImages = {}, r.preloadedAudios = {};
        function M(e) {
          r.onAbort && r.onAbort(e), e += "", F(e), Z = true, e = "abort(" + e + "). Build with -s ASSERTIONS=1 for more info.";
          var i = new WebAssembly.RuntimeError(e);
          throw E(i), i;
        }
        function fe(e, i) {
          return String.prototype.startsWith ? e.startsWith(i) : e.indexOf(i) === 0;
        }
        var Ce = "data:application/octet-stream;base64,";
        function ue(e) {
          return fe(e, Ce);
        }
        var Le = "file://";
        function le(e) {
          return fe(e, Le);
        }
        var R = "triangle.out.wasm";
        ue(R) || (R = Ae(R));
        function ce() {
          try {
            if (U) return new Uint8Array(U);
            if (N) return N(R);
            throw "both async and sync fetching of the wasm failed";
          } catch (e) {
            M(e);
          }
        }
        function qe() {
          return !U && (I || d) && typeof fetch == "function" && !le(R) ? fetch(R, {
            credentials: "same-origin"
          }).then(function(e) {
            if (!e.ok) throw "failed to load wasm binary file at '" + R + "'";
            return e.arrayBuffer();
          }).catch(function() {
            return ce();
          }) : Promise.resolve().then(ce);
        }
        function De() {
          var e = {
            a: Ve
          };
          function i(l, f) {
            var A = l.exports;
            r.asm = A, V = r.asm.g, He();
          }
          $e();
          function a(l) {
            i(l.instance);
          }
          function h(l) {
            return qe().then(function(f) {
              return WebAssembly.instantiate(f, e);
            }).then(l, function(f) {
              F("failed to asynchronously prepare wasm: " + f), M(f);
            });
          }
          function b() {
            if (!U && typeof WebAssembly.instantiateStreaming == "function" && !ue(R) && !le(R) && typeof fetch == "function") fetch(R, {
              credentials: "same-origin"
            }).then(function(l) {
              var f = WebAssembly.instantiateStreaming(l, e);
              return f.then(a, function(A) {
                return F("wasm streaming compile failed: " + A), F("falling back to ArrayBuffer instantiation"), h(a);
              });
            });
            else return h(a);
          }
          if (r.instantiateWasm) try {
            var g = r.instantiateWasm(e, i);
            return g;
          } catch (l) {
            return F("Module.instantiateWasm callback failed with error: " + l), false;
          }
          return b(), {};
        }
        function D(e) {
          for (; e.length > 0; ) {
            var i = e.shift();
            if (typeof i == "function") {
              i(r);
              continue;
            }
            var a = i.func;
            typeof a == "number" ? i.arg === void 0 ? V.get(a)() : V.get(a)(i.arg) : a(i.arg === void 0 ? null : i.arg);
          }
        }
        function We(e, i, a) {
          $.copyWithin(e, i, i + a);
        }
        function ke(e) {
          M("OOM");
        }
        function xe(e) {
          ke();
        }
        function Ge(e) {
          Ze(e);
        }
        var W = {
          mappings: {},
          buffers: [
            null,
            [],
            []
          ],
          printChar: function(e, i) {
            var a = W.buffers[e];
            i === 0 || i === 10 ? ((e === 1 ? Ee : F)(ne(a, 0)), a.length = 0) : a.push(i);
          },
          varargs: void 0,
          get: function() {
            W.varargs += 4;
            var e = T[W.varargs - 4 >> 2];
            return e;
          },
          getStr: function(e) {
            var i = we(e);
            return i;
          },
          get64: function(e, i) {
            return e;
          }
        };
        function ze(e, i, a, h) {
          for (var b = 0, g = 0; g < a; g++) {
            for (var l = T[i + g * 8 >> 2], f = T[i + (g * 8 + 4) >> 2], A = 0; A < f; A++) W.printChar(e, $[l + A]);
            b += f;
          }
          return T[h >> 2] = b, 0;
        }
        function Ye(e) {
          var i = Date.now();
          return T[e >> 2] = i / 1e3 | 0, T[e + 4 >> 2] = i % 1e3 * 1e3 | 0, 0;
        }
        ae.push({
          func: function() {
            me();
          }
        });
        var Ve = {
          d: We,
          e: xe,
          f: Ge,
          c: ze,
          b: Ye,
          a: B
        };
        De();
        var me = r.___wasm_call_ctors = function() {
          return (me = r.___wasm_call_ctors = r.asm.h).apply(null, arguments);
        };
        r._malloc = function() {
          return (r._malloc = r.asm.i).apply(null, arguments);
        }, r._free = function() {
          return (r._free = r.asm.j).apply(null, arguments);
        }, r._triangulate = function() {
          return (r._triangulate = r.asm.k).apply(null, arguments);
        }, r.stringToUTF8 = Te, r.lengthBytesUTF8 = Se;
        var k;
        function he(e) {
          this.name = "ExitStatus", this.message = "Program terminated with exit(" + e + ")", this.status = e;
        }
        H = function e() {
          k || X(), k || (H = e);
        };
        function X(e) {
          if (S > 0 || (Fe(), S > 0)) return;
          function i() {
            k || (k = true, r.calledRun = true, !Z && (Me(), Oe(), m(r), r.onRuntimeInitialized && r.onRuntimeInitialized(), Ne()));
          }
          r.setStatus ? (r.setStatus("Running..."), setTimeout(function() {
            setTimeout(function() {
              r.setStatus("");
            }, 1), i();
          }, 1)) : i();
        }
        r.run = X;
        function Ze(e, i) {
          Y || (r.onExit && r.onExit(e), Z = true), P(e, new he(e));
        }
        if (r.preInit) for (typeof r.preInit == "function" && (r.preInit = [
          r.preInit
        ]); r.preInit.length > 0; ) r.preInit.pop()();
        return Y = true, X(), r.ready;
      };
    }();
    n.exports = o;
  })(_e);
  var er = _e.exports;
  const rr = er;
  let c = {};
  const tr = (n) => {
    const t = c.lengthBytesUTF8(n) + 1, o = c._malloc(t);
    return c.stringToUTF8(n, o, t), o;
  }, y = (n, t = Int32Array) => {
    if (!n || !n.length) return null;
    const o = nr(n, t), s = c._malloc(o.length * o.BYTES_PER_ELEMENT), u = s / o.BYTES_PER_ELEMENT, r = ve(t);
    return c[r].subarray(u, u + o.length).set(o), s;
  }, p = (n, t, o = Int32Array) => {
    if (!n) return null;
    const s = n / o.BYTES_PER_ELEMENT, u = ve(o);
    return c[u].subarray(s, s + t);
  }, ve = (n) => {
    switch (n) {
      case Float64Array:
        return "HEAPF64";
      case Int32Array:
        return "HEAP32";
      default:
        return "HEAP8";
    }
  }, nr = (n, t) => n.constructor == t ? n : new t(n), be = (n, t, o = null) => {
    if (typeof n == "string") return n;
    (typeof n != "object" || !n) && (n = {});
    let s = "";
    return n.pslg !== false && (s = `${s}p`), s = `${s}z`, o !== null && (s = `${s}v`), n.quiet !== false && (s = `${s}Q`), n.refine === true && (s = `${s}r`), n.regionAttr === true && (s = `${s}A`), n.convexHull === true && (s = `${s}c`), n.ccdt === true && (s = `${s}D`), n.jettison === true && (s = `${s}j`), n.edges === true && (s = `${s}e`), n.neighbors === true && (s = `${s}n`), n.quadratic === true && (s = `${s}o2`), n.bndMarkers === false && (s = `${s}B`), n.holes === false && (s = `${s}O`), typeof n.steiner == "number" && (s = `${s}S${n.steiner}`), typeof n.quality == "number" ? s = `${s}q${n.quality}` : n.quality === true && (s = `${s}q`), typeof n.area == "number" ? s = `${s}a${n.area}` : n.area === true && (s = `${s}a`), n.quiet === false && console.log("Switches:", s), s;
  };
  class C {
    static get LENGTH() {
      return 23;
    }
    constructor(t = {}) {
      this.ptr = c._malloc(C.LENGTH * Int32Array.BYTES_PER_ELEMENT), this.arr = p(this.ptr, C.LENGTH), this.arr.set(new Int32Array(C.LENGTH));
      for (const o in t) o in this && (this[o] = t[o]);
    }
    destroy(t) {
      c._free(this.arr[0]), c._free(this.arr[1]), c._free(this.arr[2]), c._free(this.arr[5]), c._free(this.arr[6]), c._free(this.arr[7]), c._free(this.arr[8]), c._free(this.arr[12]), c._free(this.arr[13]), c._free(this.arr[19]), c._free(this.arr[20]), c._free(this.arr[21]), c._free(this.ptr), t && (c._free(this.arr[15]), c._free(this.arr[17]));
    }
    set pointlist(t) {
      this.arr[0] = y(t, Float64Array), this.arr[3] = t ? ~~(t.length * 0.5) : 0;
    }
    set pointattributelist(t) {
      this.arr[1] = y(t, Float64Array), this.arr[4] = t ? ~~(t.length / this.numberofpoints) : 0;
    }
    set pointmarkerlist(t) {
      this.arr[2] = y(t);
    }
    set numberofpoints(t) {
    }
    set numberofpointattributes(t) {
    }
    set trianglelist(t) {
      this.arr[5] = y(t), this.arr[9] = t ? ~~(t.length / 3) : 0;
    }
    set triangleattributelist(t) {
      this.arr[6] = y(t, Float64Array), this.arr[11] = t ? ~~(t.length / this.numberoftriangles) : 0;
    }
    set trianglearealist(t) {
      this.arr[7] = y(t, Float64Array);
    }
    set neighborlist(t) {
      this.arr[8] = y(t);
    }
    set numberoftriangles(t) {
    }
    set numberofcorners(t) {
    }
    set numberoftriangleattributes(t) {
    }
    set segmentlist(t) {
      this.arr[12] = y(t), this.arr[14] = t ? ~~(t.length * 0.5) : 0;
    }
    set segmentmarkerlist(t) {
      this.arr[13] = y(t);
    }
    set numberofsegments(t) {
    }
    set holelist(t) {
      this.arr[15] = y(t, Float64Array), this.arr[16] = t ? ~~(t.length * 0.5) : 0;
    }
    set numberofholes(t) {
    }
    set regionlist(t) {
      this.arr[17] = y(t, Float64Array), this.arr[18] = t ? ~~(t.length * 0.25) : 0;
    }
    set numberofregions(t) {
    }
    set edgelist(t) {
      this.arr[19] = y(t), this.arr[22] = t ? ~~(t.length * 0.5) : 0;
    }
    set edgemarkerlist(t) {
      this.arr[20] = y(t);
    }
    set normlist(t) {
      this.arr[21] = y(t, Float64Array);
    }
    set numberofedges(t) {
    }
    get pointlist() {
      return p(this.arr[0], this.numberofpoints * 2, Float64Array);
    }
    get pointattributelist() {
      return p(this.arr[1], this.numberofpointattributes * this.numberofpoints, Float64Array);
    }
    get pointmarkerlist() {
      return p(this.arr[2], this.numberofpoints);
    }
    get numberofpoints() {
      return this.arr[3];
    }
    get numberofpointattributes() {
      return this.arr[4];
    }
    get trianglelist() {
      return p(this.arr[5], this.numberoftriangles * this.numberofcorners);
    }
    get triangleattributelist() {
      return p(this.arr[6], this.numberoftriangleattributes * this.numberoftriangles, Float64Array);
    }
    get trianglearealist() {
      return p(this.arr[7], this.numberoftriangles, Float64Array);
    }
    get neighborlist() {
      return p(this.arr[8], this.numberoftriangles * 3);
    }
    get numberoftriangles() {
      return this.arr[9];
    }
    get numberofcorners() {
      return this.arr[10];
    }
    get numberoftriangleattributes() {
      return this.arr[11];
    }
    get segmentlist() {
      return p(this.arr[12], this.numberofsegments * 2);
    }
    get segmentmarkerlist() {
      return p(this.arr[13], this.numberofsegments);
    }
    get numberofsegments() {
      return this.arr[14];
    }
    get holelist() {
      return p(this.arr[15], this.numberofholes * 2, Float64Array);
    }
    get numberofholes() {
      return this.arr[16];
    }
    get regionlist() {
      return p(this.arr[17], this.numberofregions * 4, Float64Array);
    }
    get numberofregions() {
      return this.arr[18];
    }
    get edgelist() {
      return p(this.arr[19], this.numberofedges * 2);
    }
    get edgemarkerlist() {
      return p(this.arr[20], this.numberofedges);
    }
    get normlist() {
      return p(this.arr[21], this.numberofedges * 2, Float64Array);
    }
    get numberofedges() {
      return this.arr[22];
    }
  }
  const ir = (n) => new Promise((t, o) => {
    rr({
      locateFile: (s, u) => n || u + s
    }).then((s) => {
      c = s, t();
    });
  }), sr = (n, t, o, s = null) => {
    const u = be(n, t, s), r = tr(u), m = s ? s.ptr : null;
    c._triangulate(r, t.ptr, o.ptr, m), c._free(r);
  }, ar = (n) => new C(n), or = (n, t) => {
    n.destroy(t);
  };
  var fr = {
    init: ir,
    triangulate: sr,
    makeIO: ar,
    freeIO: or,
    getSwitchesStr: be
  };
  const O = Ke(fr), ur = "" + new URL("triangle-CCJHBrBP.wasm", import.meta.url).href;
  await O.init(ur);
  _r = function({ points: n, polygon: t, maxMeshSize: o = 3 }) {
    if (n.length < 3 || t.length < 3) return {
      nodes: [],
      elements: [],
      boundaryIndices: []
    };
    const s = n.slice(0, 3);
    gr(t, n) > 0 && s.reverse();
    const u = hr(s), r = n.map((d) => j(Xe(u), d)).map((d) => [
      d[0],
      d[1]
    ]), m = O.makeIO({
      pointlist: r.flat(),
      segmentlist: lr(t)
    }), E = O.makeIO();
    O.triangulate(`pzQOq30a${o}`, m, E);
    const { nodes: _, boundaryIndices: w } = mr(E.pointlist, E.pointmarkerlist), P = _.map((d) => j(u, [
      d[0],
      d[1],
      0
    ])), I = cr(E.trianglelist);
    return O.freeIO(m, true), O.freeIO(E), {
      nodes: P,
      elements: I,
      boundaryIndices: w
    };
  };
  function lr(n) {
    const t = [];
    for (let o = 0; o < n.length; o += 1) t.push(n[o], n[(o + 1) % n.length]);
    return t;
  }
  function cr(n) {
    const t = [];
    for (let o = 0; o < n.length; o += 3) t.push([
      n[o],
      n[o + 1],
      n[o + 2]
    ]);
    return t;
  }
  function mr(n, t) {
    const o = [], s = [];
    for (let u = 0; u < n.length; u += 2) o.push([
      n[u],
      n[u + 1]
    ]), t[u / 2] && s.push(u / 2);
    return {
      nodes: o,
      boundaryIndices: s
    };
  }
  function hr([n, t, o]) {
    const s = de(t, n), u = de(o, n), r = pe(s, ye(s));
    let m = pe(J(s, u), ye(J(s, u)));
    Je(m, [
      0,
      0,
      1
    ]) < 0 && (m = j(m, -1));
    const _ = J(m, r);
    return [
      [
        r[0],
        _[0],
        m[0]
      ],
      [
        r[1],
        _[1],
        m[1]
      ],
      [
        r[2],
        _[2],
        m[2]
      ]
    ];
  }
  function gr(n, t) {
    let o = 0;
    const s = n.length;
    for (let u = 0; u < s; u++) {
      const [r, m] = t[n[u]], [E, _] = t[n[(u + 1) % s]];
      o += r * _ - E * m;
    }
    return o / 2;
  }
})();
export {
  __tla,
  Ke as a,
  yr as c,
  _r as g,
  K as r
};
