var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { _ as Kr } from "./preload-helper-V2P8TQsQ.js";
let Zr;
let __tla = (async () => {
  Zr = async function(ue = {}) {
    var _a, _b, _c, _d, _e2, _f;
    var fe;
    (function() {
      var _a2;
      function e(c) {
        c = c.split("-")[0];
        for (var f = c.split(".").slice(0, 3); f.length < 3; ) f.push("00");
        return f = f.map((p, g, m) => p.padStart(2, "0")), f.join("");
      }
      var r = (c) => [
        c / 1e4 | 0,
        (c / 100 | 0) % 100,
        c % 100
      ].join("."), t = 2147483647, o = typeof process < "u" && ((_a2 = process.versions) == null ? void 0 : _a2.node) ? e(process.versions.node) : t;
      if (o < 16e4) throw new Error(`This emscripten-generated code requires node v${r(16e4)} (detected v${r(o)})`);
      var i = typeof navigator < "u" && navigator.userAgent;
      if (i) {
        var a = i.includes("Safari/") && !i.includes("Chrome/") && i.match(/Version\/(\d+\.?\d*\.?\d*)/) ? e(i.match(/Version\/(\d+\.?\d*\.?\d*)/)[1]) : t;
        if (a < 15e4) throw new Error(`This emscripten-generated code requires Safari v${r(15e4)} (detected v${a})`);
        var s = i.match(/Firefox\/(\d+(?:\.\d+)?)/) ? parseFloat(i.match(/Firefox\/(\d+(?:\.\d+)?)/)[1]) : t;
        if (s < 79) throw new Error(`This emscripten-generated code requires Firefox v79 (detected v${s})`);
        var l = i.match(/Chrome\/(\d+(?:\.\d+)?)/) ? parseFloat(i.match(/Chrome\/(\d+(?:\.\d+)?)/)[1]) : t;
        if (l < 85) throw new Error(`This emscripten-generated code requires Chrome v85 (detected v${l})`);
      }
    })();
    var d = ue, ke = !!globalThis.window, re = !!globalThis.WorkerGlobalScope, C = ((_b = (_a = globalThis.process) == null ? void 0 : _a.versions) == null ? void 0 : _b.node) && ((_c = globalThis.process) == null ? void 0 : _c.type) != "renderer", be = !ke && !C && !re;
    if (C) {
      const { createRequire: e } = await Kr(() => import("./__vite-browser-external-D7Ct-6yo.js").then((r) => r._), []);
      var te = e(import.meta.url);
    }
    var me = "./this.program", ve = import.meta.url, ne = "";
    function $e(e) {
      return d.locateFile ? d.locateFile(e, ne) : ne + e;
    }
    var oe, H;
    if (C) {
      if (!(((_e2 = (_d = globalThis.process) == null ? void 0 : _d.versions) == null ? void 0 : _e2.node) && ((_f = globalThis.process) == null ? void 0 : _f.type) != "renderer")) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
      var _e = te("fs");
      ve.startsWith("file:") && (ne = te("path").dirname(te("url").fileURLToPath(ve)) + "/"), H = (r) => {
        r = G(r) ? new URL(r) : r;
        var t = _e.readFileSync(r);
        return u(Buffer.isBuffer(t)), t;
      }, oe = async (r, t = true) => {
        r = G(r) ? new URL(r) : r;
        var o = _e.readFileSync(r, t ? void 0 : "utf8");
        return u(t ? Buffer.isBuffer(o) : typeof o == "string"), o;
      }, process.argv.length > 1 && (me = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2);
    } else if (!be) if (ke || re) {
      try {
        ne = new URL(".", ve).href;
      } catch {
      }
      if (!(globalThis.window || globalThis.WorkerGlobalScope)) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
      re && (H = (e) => {
        var r = new XMLHttpRequest();
        return r.open("GET", e, false), r.responseType = "arraybuffer", r.send(null), new Uint8Array(r.response);
      }), oe = async (e) => {
        if (G(e)) return new Promise((t, o) => {
          var i = new XMLHttpRequest();
          i.open("GET", e, true), i.responseType = "arraybuffer", i.onload = () => {
            if (i.status == 200 || i.status == 0 && i.response) {
              t(i.response);
              return;
            }
            o(i.status);
          }, i.onerror = o, i.send(null);
        });
        var r = await fetch(e, {
          credentials: "same-origin"
        });
        if (r.ok) return r.arrayBuffer();
        throw new Error(r.status + " : " + r.url);
      };
    } else throw new Error("environment detection error");
    var ie = console.log.bind(console), F = console.error.bind(console);
    u(!be, "shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.");
    var j;
    globalThis.WebAssembly || F("no native wasm support detected");
    var ae = false;
    function u(e, r) {
      e || y("Assertion failed" + (r ? ": " + r : ""));
    }
    var G = (e) => e.startsWith("file://");
    function Ve() {
      var e = Se();
      u((e & 3) == 0), e == 0 && (e += 4), h[e >> 2] = 34821223, h[e + 4 >> 2] = 2310721022, h[0] = 1668509029;
    }
    function he() {
      if (!ae) {
        var e = Se();
        e == 0 && (e += 4);
        var r = h[e >> 2], t = h[e + 4 >> 2];
        (r != 34821223 || t != 2310721022) && y(`Stack overflow! Stack cookie has been overwritten at ${q(e)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${q(t)} ${q(r)}`), h[0] != 1668509029 && y("Runtime error: The application has corrupted its heap memory area (address zero)!");
      }
    }
    (() => {
      var e = new Int16Array(1), r = new Int8Array(e.buffer);
      e[0] = 25459, (r[0] !== 115 || r[1] !== 99) && y("Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)");
    })();
    function se(e) {
      Object.getOwnPropertyDescriptor(d, e) || Object.defineProperty(d, e, {
        configurable: true,
        set() {
          y(`Attempt to set \`Module.${e}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`);
        }
      });
    }
    function S(e) {
      return () => u(false, `call to '${e}' via reference taken before Wasm module initialization`);
    }
    function qe(e) {
      Object.getOwnPropertyDescriptor(d, e) && y(`\`Module.${e}\` was supplied but \`${e}\` not included in INCOMING_MODULE_JS_API`);
    }
    function Xe(e) {
      return e === "FS_createPath" || e === "FS_createDataFile" || e === "FS_createPreloadedFile" || e === "FS_preloadFile" || e === "FS_unlink" || e === "addRunDependency" || e === "FS_createLazyFile" || e === "FS_createDevice" || e === "removeRunDependency";
    }
    function Ye(e) {
      Te(e);
    }
    function Te(e) {
      Object.getOwnPropertyDescriptor(d, e) || Object.defineProperty(d, e, {
        configurable: true,
        get() {
          var r = `'${e}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
          Xe(e) && (r += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"), y(r);
        }
      });
    }
    var Ae, Pe, D, $, le, h, A, V = false;
    function Ne() {
      var e = ce.buffer;
      D = new Int8Array(e), d.HEAPU8 = $ = new Uint8Array(e), le = new Int32Array(e), d.HEAPU32 = h = new Uint32Array(e), d.HEAPF64 = new Float64Array(e), A = new BigInt64Array(e), new BigUint64Array(e);
    }
    u(globalThis.Int32Array && globalThis.Float64Array && Int32Array.prototype.subarray && Int32Array.prototype.set, "JS engine does not provide full typed array support");
    function Ke() {
      if (d.preRun) for (typeof d.preRun == "function" && (d.preRun = [
        d.preRun
      ]); d.preRun.length; ) sr(d.preRun.shift());
      se("preRun"), De(Oe);
    }
    function Je() {
      u(!V), V = true, he(), !d.noFSInit && !n.initialized && n.init(), z.__wasm_call_ctors(), n.ignorePermissions = false;
    }
    function Ze() {
      if (he(), d.postRun) for (typeof d.postRun == "function" && (d.postRun = [
        d.postRun
      ]); d.postRun.length; ) ar(d.postRun.shift());
      se("postRun"), De(Re);
    }
    function y(e) {
      var _a2;
      (_a2 = d.onAbort) == null ? void 0 : _a2.call(d, e), e = "Aborted(" + e + ")", F(e), ae = true;
      var r = new WebAssembly.RuntimeError(e);
      throw Pe == null ? void 0 : Pe(r), r;
    }
    function k(e, r) {
      return (...t) => {
        u(V, `native function \`${e}\` called before runtime initialization`);
        var o = z[e];
        return u(o, `exported native function \`${e}\` not found`), u(t.length <= r, `native function \`${e}\` called with ${t.length} args but expects ${r}`), o(...t);
      };
    }
    var pe;
    function Qe() {
      return d.locateFile ? $e("deform.wasm") : new URL("/hekatan-struct-lineal/assets/deform-BLaVg75W.wasm", import.meta.url).href;
    }
    function er(e) {
      if (e == pe && j) return new Uint8Array(j);
      if (H) return H(e);
      throw "both async and sync fetching of the wasm failed";
    }
    async function rr(e) {
      if (!j) try {
        var r = await oe(e);
        return new Uint8Array(r);
      } catch {
      }
      return er(e);
    }
    async function tr(e, r) {
      try {
        var t = await rr(e), o = await WebAssembly.instantiate(t, r);
        return o;
      } catch (i) {
        F(`failed to asynchronously prepare wasm: ${i}`), G(e) && F(`warning: Loading from a file URI (${e}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`), y(i);
      }
    }
    async function nr(e, r, t) {
      if (!e && !G(r) && !C) try {
        var o = fetch(r, {
          credentials: "same-origin"
        }), i = await WebAssembly.instantiateStreaming(o, t);
        return i;
      } catch (a) {
        F(`wasm streaming compile failed: ${a}`), F("falling back to ArrayBuffer instantiation");
      }
      return tr(r, t);
    }
    function or() {
      var e = {
        env: je,
        wasi_snapshot_preview1: je
      };
      return e;
    }
    async function ir() {
      function e(s, l) {
        return z = s.exports, Xr(z), Ne(), z;
      }
      var r = d;
      function t(s) {
        return u(d === r, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?"), r = null, e(s.instance);
      }
      var o = or();
      if (d.instantiateWasm) return new Promise((s, l) => {
        try {
          d.instantiateWasm(o, (c, f) => {
            s(e(c, f));
          });
        } catch (c) {
          F(`Module.instantiateWasm callback failed with error: ${c}`), l(c);
        }
      });
      pe ?? (pe = Qe());
      var i = await nr(j, pe, o), a = t(i);
      return a;
    }
    var De = (e) => {
      for (; e.length > 0; ) e.shift()(d);
    }, Re = [], ar = (e) => Re.push(e), Oe = [], sr = (e) => Oe.push(e), q = (e) => (u(typeof e == "number", `ptrToString expects a number, got ${typeof e}`), e >>>= 0, "0x" + e.toString(16).padStart(8, "0")), X = (e) => {
      X.shown || (X.shown = {}), X.shown[e] || (X.shown[e] = 1, C && (e = "warning: " + e), F(e));
    }, Me = globalThis.TextDecoder && new TextDecoder(), lr = (e, r, t, o) => {
      for (var i = r + t; e[r] && !(r >= i); ) ++r;
      return r;
    }, U = (e, r = 0, t, o) => {
      var i = lr(e, r, t);
      if (i - r > 16 && e.buffer && Me) return Me.decode(e.subarray(r, i));
      for (var a = ""; r < i; ) {
        var s = e[r++];
        if (!(s & 128)) {
          a += String.fromCharCode(s);
          continue;
        }
        var l = e[r++] & 63;
        if ((s & 224) == 192) {
          a += String.fromCharCode((s & 31) << 6 | l);
          continue;
        }
        var c = e[r++] & 63;
        if ((s & 240) == 224 ? s = (s & 15) << 12 | l << 6 | c : ((s & 248) != 240 && X("Invalid UTF-8 leading byte " + q(s) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!"), s = (s & 7) << 18 | l << 12 | c << 6 | e[r++] & 63), s < 65536) a += String.fromCharCode(s);
        else {
          var f = s - 65536;
          a += String.fromCharCode(55296 | f >> 10, 56320 | f & 1023);
        }
      }
      return a;
    }, Y = (e, r, t) => (u(typeof e == "number", `UTF8ToString expects a number (got ${typeof e})`), e ? U($, e, r) : ""), dr = (e, r, t, o) => y(`Assertion failed: ${Y(e)}, at: ` + [
      r ? Y(r) : "unknown filename",
      t,
      o ? Y(o) : "unknown function"
    ]);
    class cr {
      constructor(r) {
        this.excPtr = r, this.ptr = r - 24;
      }
      set_type(r) {
        h[this.ptr + 4 >> 2] = r;
      }
      get_type() {
        return h[this.ptr + 4 >> 2];
      }
      set_destructor(r) {
        h[this.ptr + 8 >> 2] = r;
      }
      get_destructor() {
        return h[this.ptr + 8 >> 2];
      }
      set_caught(r) {
        r = r ? 1 : 0, D[this.ptr + 12] = r;
      }
      get_caught() {
        return D[this.ptr + 12] != 0;
      }
      set_rethrown(r) {
        r = r ? 1 : 0, D[this.ptr + 13] = r;
      }
      get_rethrown() {
        return D[this.ptr + 13] != 0;
      }
      init(r, t) {
        this.set_adjusted_ptr(0), this.set_type(r), this.set_destructor(t);
      }
      set_adjusted_ptr(r) {
        h[this.ptr + 16 >> 2] = r;
      }
      get_adjusted_ptr() {
        return h[this.ptr + 16 >> 2];
      }
    }
    var ur = (e, r, t) => {
      var o = new cr(e);
      o.init(r, t), u(false, "Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.");
    }, fr = () => y("native code called abort()"), Ce = (e, r, t, o) => {
      if (u(typeof e == "string", `stringToUTF8Array expects a string (got ${typeof e})`), !(o > 0)) return 0;
      for (var i = t, a = t + o - 1, s = 0; s < e.length; ++s) {
        var l = e.codePointAt(s);
        if (l <= 127) {
          if (t >= a) break;
          r[t++] = l;
        } else if (l <= 2047) {
          if (t + 1 >= a) break;
          r[t++] = 192 | l >> 6, r[t++] = 128 | l & 63;
        } else if (l <= 65535) {
          if (t + 2 >= a) break;
          r[t++] = 224 | l >> 12, r[t++] = 128 | l >> 6 & 63, r[t++] = 128 | l & 63;
        } else {
          if (t + 3 >= a) break;
          l > 1114111 && X("Invalid Unicode code point " + q(l) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF)."), r[t++] = 240 | l >> 18, r[t++] = 128 | l >> 12 & 63, r[t++] = 128 | l >> 6 & 63, r[t++] = 128 | l & 63, s++;
        }
      }
      return r[t] = 0, t - i;
    }, K = (e, r, t) => (u(typeof t == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!"), Ce(e, $, r, t)), de = (e) => {
      for (var r = 0, t = 0; t < e.length; ++t) {
        var o = e.charCodeAt(t);
        o <= 127 ? r++ : o <= 2047 ? r += 2 : o >= 55296 && o <= 57343 ? (r += 4, ++t) : r += 3;
      }
      return r;
    }, mr = (e, r, t, o) => {
      var i = (/* @__PURE__ */ new Date()).getFullYear(), a = new Date(i, 0, 1), s = new Date(i, 6, 1), l = a.getTimezoneOffset(), c = s.getTimezoneOffset(), f = Math.max(l, c);
      h[e >> 2] = f * 60, le[r >> 2] = +(l != c);
      var p = (_) => {
        var w = _ >= 0 ? "-" : "+", P = Math.abs(_), N = String(Math.floor(P / 60)).padStart(2, "0"), T = String(P % 60).padStart(2, "0");
        return `UTC${w}${N}${T}`;
      }, g = p(l), m = p(c);
      u(g), u(m), u(de(g) <= 16, `timezone name truncated to fit in TZNAME_MAX (${g})`), u(de(m) <= 16, `timezone name truncated to fit in TZNAME_MAX (${m})`), c < l ? (K(g, t, 17), K(m, o, 17)) : (K(g, o, 17), K(m, t, 17));
    }, vr = () => performance.now(), _r = () => Date.now(), hr = (e) => e >= 0 && e <= 3, pr = 9007199254740992, gr = -9007199254740992, Er = (e) => e < gr || e > pr ? NaN : Number(e);
    function yr(e, r, t) {
      if (!hr(e)) return 28;
      var o;
      e === 0 ? o = _r() : o = vr();
      var i = Math.round(o * 1e3 * 1e3);
      return A[t >> 3] = BigInt(i), 0;
    }
    var wr = () => 2147483648, Sr = (e, r) => (u(r, "alignment argument is required"), Math.ceil(e / r) * r), Fr = (e) => {
      var r = ce.buffer.byteLength, t = (e - r + 65535) / 65536 | 0;
      try {
        return ce.grow(t), Ne(), 1;
      } catch (o) {
        F(`growMemory: Attempted to grow heap from ${r} bytes to ${e} bytes, but got error: ${o}`);
      }
    }, kr = (e) => {
      var r = $.length;
      e >>>= 0, u(e > r);
      var t = wr();
      if (e > t) return F(`Cannot enlarge memory, requested ${e} bytes, but the limit is ${t} bytes!`), false;
      for (var o = 1; o <= 4; o *= 2) {
        var i = r * (1 + 0.2 / o);
        i = Math.min(i, e + 100663296);
        var a = Math.min(t, Sr(Math.max(e, i), 65536)), s = Fr(a);
        if (s) return true;
      }
      return F(`Failed to grow the heap from ${r} bytes to ${a} bytes, not enough memory!`), false;
    }, ge = {}, br = () => me || "./this.program", J = () => {
      var _a2;
      if (!J.strings) {
        var e = (((_a2 = globalThis.navigator) == null ? void 0 : _a2.language) ?? "C").replace("-", "_") + ".UTF-8", r = {
          USER: "web_user",
          LOGNAME: "web_user",
          PATH: "/",
          PWD: "/",
          HOME: "/home/web_user",
          LANG: e,
          _: br()
        };
        for (var t in ge) ge[t] === void 0 ? delete r[t] : r[t] = ge[t];
        var o = [];
        for (var t in r) o.push(`${t}=${r[t]}`);
        J.strings = o;
      }
      return J.strings;
    }, Tr = (e, r) => {
      var t = 0, o = 0;
      for (var i of J()) {
        var a = r + t;
        h[e + o >> 2] = a, t += K(i, a, 1 / 0) + 1, o += 4;
      }
      return 0;
    }, Ar = (e, r) => {
      var t = J();
      h[e >> 2] = t.length;
      var o = 0;
      for (var i of t) o += de(i) + 1;
      return h[r >> 2] = o, 0;
    }, E = {
      isAbs: (e) => e.charAt(0) === "/",
      splitPath: (e) => {
        var r = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return r.exec(e).slice(1);
      },
      normalizeArray: (e, r) => {
        for (var t = 0, o = e.length - 1; o >= 0; o--) {
          var i = e[o];
          i === "." ? e.splice(o, 1) : i === ".." ? (e.splice(o, 1), t++) : t && (e.splice(o, 1), t--);
        }
        if (r) for (; t; t--) e.unshift("..");
        return e;
      },
      normalize: (e) => {
        var r = E.isAbs(e), t = e.slice(-1) === "/";
        return e = E.normalizeArray(e.split("/").filter((o) => !!o), !r).join("/"), !e && !r && (e = "."), e && t && (e += "/"), (r ? "/" : "") + e;
      },
      dirname: (e) => {
        var r = E.splitPath(e), t = r[0], o = r[1];
        return !t && !o ? "." : (o && (o = o.slice(0, -1)), t + o);
      },
      basename: (e) => e && e.match(/([^\/]+|\/)\/*$/)[1],
      join: (...e) => E.normalize(e.join("/")),
      join2: (e, r) => E.normalize(e + "/" + r)
    }, Pr = () => {
      if (C) {
        var e = te("crypto");
        return (r) => e.randomFillSync(r);
      }
      return (r) => crypto.getRandomValues(r);
    }, Ie = (e) => {
      (Ie = Pr())(e);
    }, B = {
      resolve: (...e) => {
        for (var r = "", t = false, o = e.length - 1; o >= -1 && !t; o--) {
          var i = o >= 0 ? e[o] : n.cwd();
          if (typeof i != "string") throw new TypeError("Arguments to path.resolve must be strings");
          if (!i) return "";
          r = i + "/" + r, t = E.isAbs(i);
        }
        return r = E.normalizeArray(r.split("/").filter((a) => !!a), !t).join("/"), (t ? "/" : "") + r || ".";
      },
      relative: (e, r) => {
        e = B.resolve(e).slice(1), r = B.resolve(r).slice(1);
        function t(f) {
          for (var p = 0; p < f.length && f[p] === ""; p++) ;
          for (var g = f.length - 1; g >= 0 && f[g] === ""; g--) ;
          return p > g ? [] : f.slice(p, g - p + 1);
        }
        for (var o = t(e.split("/")), i = t(r.split("/")), a = Math.min(o.length, i.length), s = a, l = 0; l < a; l++) if (o[l] !== i[l]) {
          s = l;
          break;
        }
        for (var c = [], l = s; l < o.length; l++) c.push("..");
        return c = c.concat(i.slice(s)), c.join("/");
      }
    }, Ee = [], ye = (e, r, t) => {
      var o = de(e) + 1, i = new Array(o), a = Ce(e, i, 0, i.length);
      return i.length = a, i;
    }, Nr = () => {
      var _a2;
      if (!Ee.length) {
        var e = null;
        if (C) {
          var r = 256, t = Buffer.alloc(r), o = 0, i = process.stdin.fd;
          try {
            o = _e.readSync(i, t, 0, r);
          } catch (a) {
            if (a.toString().includes("EOF")) o = 0;
            else throw a;
          }
          o > 0 && (e = t.slice(0, o).toString("utf-8"));
        } else ((_a2 = globalThis.window) == null ? void 0 : _a2.prompt) && (e = window.prompt("Input: "), e !== null && (e += `
`));
        if (!e) return null;
        Ee = ye(e);
      }
      return Ee.shift();
    }, I = {
      ttys: [],
      init() {
      },
      shutdown() {
      },
      register(e, r) {
        I.ttys[e] = {
          input: [],
          output: [],
          ops: r
        }, n.registerDevice(e, I.stream_ops);
      },
      stream_ops: {
        open(e) {
          var r = I.ttys[e.node.rdev];
          if (!r) throw new n.ErrnoError(43);
          e.tty = r, e.seekable = false;
        },
        close(e) {
          e.tty.ops.fsync(e.tty);
        },
        fsync(e) {
          e.tty.ops.fsync(e.tty);
        },
        read(e, r, t, o, i) {
          if (!e.tty || !e.tty.ops.get_char) throw new n.ErrnoError(60);
          for (var a = 0, s = 0; s < o; s++) {
            var l;
            try {
              l = e.tty.ops.get_char(e.tty);
            } catch {
              throw new n.ErrnoError(29);
            }
            if (l === void 0 && a === 0) throw new n.ErrnoError(6);
            if (l == null) break;
            a++, r[t + s] = l;
          }
          return a && (e.node.atime = Date.now()), a;
        },
        write(e, r, t, o, i) {
          if (!e.tty || !e.tty.ops.put_char) throw new n.ErrnoError(60);
          try {
            for (var a = 0; a < o; a++) e.tty.ops.put_char(e.tty, r[t + a]);
          } catch {
            throw new n.ErrnoError(29);
          }
          return o && (e.node.mtime = e.node.ctime = Date.now()), a;
        }
      },
      default_tty_ops: {
        get_char(e) {
          return Nr();
        },
        put_char(e, r) {
          r === null || r === 10 ? (ie(U(e.output)), e.output = []) : r != 0 && e.output.push(r);
        },
        fsync(e) {
          var _a2;
          ((_a2 = e.output) == null ? void 0 : _a2.length) > 0 && (ie(U(e.output)), e.output = []);
        },
        ioctl_tcgets(e) {
          return {
            c_iflag: 25856,
            c_oflag: 5,
            c_cflag: 191,
            c_lflag: 35387,
            c_cc: [
              3,
              28,
              127,
              21,
              4,
              0,
              1,
              0,
              17,
              19,
              26,
              0,
              18,
              15,
              23,
              22,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ]
          };
        },
        ioctl_tcsets(e, r, t) {
          return 0;
        },
        ioctl_tiocgwinsz(e) {
          return [
            24,
            80
          ];
        }
      },
      default_tty1_ops: {
        put_char(e, r) {
          r === null || r === 10 ? (F(U(e.output)), e.output = []) : r != 0 && e.output.push(r);
        },
        fsync(e) {
          var _a2;
          ((_a2 = e.output) == null ? void 0 : _a2.length) > 0 && (F(U(e.output)), e.output = []);
        }
      }
    }, Le = (e) => {
      y("internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported");
    }, v = {
      ops_table: null,
      mount(e) {
        return v.createNode(null, "/", 16895, 0);
      },
      createNode(e, r, t, o) {
        if (n.isBlkdev(t) || n.isFIFO(t)) throw new n.ErrnoError(63);
        v.ops_table || (v.ops_table = {
          dir: {
            node: {
              getattr: v.node_ops.getattr,
              setattr: v.node_ops.setattr,
              lookup: v.node_ops.lookup,
              mknod: v.node_ops.mknod,
              rename: v.node_ops.rename,
              unlink: v.node_ops.unlink,
              rmdir: v.node_ops.rmdir,
              readdir: v.node_ops.readdir,
              symlink: v.node_ops.symlink
            },
            stream: {
              llseek: v.stream_ops.llseek
            }
          },
          file: {
            node: {
              getattr: v.node_ops.getattr,
              setattr: v.node_ops.setattr
            },
            stream: {
              llseek: v.stream_ops.llseek,
              read: v.stream_ops.read,
              write: v.stream_ops.write,
              mmap: v.stream_ops.mmap,
              msync: v.stream_ops.msync
            }
          },
          link: {
            node: {
              getattr: v.node_ops.getattr,
              setattr: v.node_ops.setattr,
              readlink: v.node_ops.readlink
            },
            stream: {}
          },
          chrdev: {
            node: {
              getattr: v.node_ops.getattr,
              setattr: v.node_ops.setattr
            },
            stream: n.chrdev_stream_ops
          }
        });
        var i = n.createNode(e, r, t, o);
        return n.isDir(i.mode) ? (i.node_ops = v.ops_table.dir.node, i.stream_ops = v.ops_table.dir.stream, i.contents = {}) : n.isFile(i.mode) ? (i.node_ops = v.ops_table.file.node, i.stream_ops = v.ops_table.file.stream, i.usedBytes = 0, i.contents = null) : n.isLink(i.mode) ? (i.node_ops = v.ops_table.link.node, i.stream_ops = v.ops_table.link.stream) : n.isChrdev(i.mode) && (i.node_ops = v.ops_table.chrdev.node, i.stream_ops = v.ops_table.chrdev.stream), i.atime = i.mtime = i.ctime = Date.now(), e && (e.contents[r] = i, e.atime = e.mtime = e.ctime = i.atime), i;
      },
      getFileDataAsTypedArray(e) {
        return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0);
      },
      expandFileStorage(e, r) {
        var t = e.contents ? e.contents.length : 0;
        if (!(t >= r)) {
          var o = 1024 * 1024;
          r = Math.max(r, t * (t < o ? 2 : 1.125) >>> 0), t != 0 && (r = Math.max(r, 256));
          var i = e.contents;
          e.contents = new Uint8Array(r), e.usedBytes > 0 && e.contents.set(i.subarray(0, e.usedBytes), 0);
        }
      },
      resizeFileStorage(e, r) {
        if (e.usedBytes != r) if (r == 0) e.contents = null, e.usedBytes = 0;
        else {
          var t = e.contents;
          e.contents = new Uint8Array(r), t && e.contents.set(t.subarray(0, Math.min(r, e.usedBytes))), e.usedBytes = r;
        }
      },
      node_ops: {
        getattr(e) {
          var r = {};
          return r.dev = n.isChrdev(e.mode) ? e.id : 1, r.ino = e.id, r.mode = e.mode, r.nlink = 1, r.uid = 0, r.gid = 0, r.rdev = e.rdev, n.isDir(e.mode) ? r.size = 4096 : n.isFile(e.mode) ? r.size = e.usedBytes : n.isLink(e.mode) ? r.size = e.link.length : r.size = 0, r.atime = new Date(e.atime), r.mtime = new Date(e.mtime), r.ctime = new Date(e.ctime), r.blksize = 4096, r.blocks = Math.ceil(r.size / r.blksize), r;
        },
        setattr(e, r) {
          for (const t of [
            "mode",
            "atime",
            "mtime",
            "ctime"
          ]) r[t] != null && (e[t] = r[t]);
          r.size !== void 0 && v.resizeFileStorage(e, r.size);
        },
        lookup(e, r) {
          throw new n.ErrnoError(44);
        },
        mknod(e, r, t, o) {
          return v.createNode(e, r, t, o);
        },
        rename(e, r, t) {
          var o;
          try {
            o = n.lookupNode(r, t);
          } catch {
          }
          if (o) {
            if (n.isDir(e.mode)) for (var i in o.contents) throw new n.ErrnoError(55);
            n.hashRemoveNode(o);
          }
          delete e.parent.contents[e.name], r.contents[t] = e, e.name = t, r.ctime = r.mtime = e.parent.ctime = e.parent.mtime = Date.now();
        },
        unlink(e, r) {
          delete e.contents[r], e.ctime = e.mtime = Date.now();
        },
        rmdir(e, r) {
          var t = n.lookupNode(e, r);
          for (var o in t.contents) throw new n.ErrnoError(55);
          delete e.contents[r], e.ctime = e.mtime = Date.now();
        },
        readdir(e) {
          return [
            ".",
            "..",
            ...Object.keys(e.contents)
          ];
        },
        symlink(e, r, t) {
          var o = v.createNode(e, r, 41471, 0);
          return o.link = t, o;
        },
        readlink(e) {
          if (!n.isLink(e.mode)) throw new n.ErrnoError(28);
          return e.link;
        }
      },
      stream_ops: {
        read(e, r, t, o, i) {
          var a = e.node.contents;
          if (i >= e.node.usedBytes) return 0;
          var s = Math.min(e.node.usedBytes - i, o);
          if (u(s >= 0), s > 8 && a.subarray) r.set(a.subarray(i, i + s), t);
          else for (var l = 0; l < s; l++) r[t + l] = a[i + l];
          return s;
        },
        write(e, r, t, o, i, a) {
          if (u(!(r instanceof ArrayBuffer)), r.buffer === D.buffer && (a = false), !o) return 0;
          var s = e.node;
          if (s.mtime = s.ctime = Date.now(), r.subarray && (!s.contents || s.contents.subarray)) {
            if (a) return u(i === 0, "canOwn must imply no weird position inside the file"), s.contents = r.subarray(t, t + o), s.usedBytes = o, o;
            if (s.usedBytes === 0 && i === 0) return s.contents = r.slice(t, t + o), s.usedBytes = o, o;
            if (i + o <= s.usedBytes) return s.contents.set(r.subarray(t, t + o), i), o;
          }
          if (v.expandFileStorage(s, i + o), s.contents.subarray && r.subarray) s.contents.set(r.subarray(t, t + o), i);
          else for (var l = 0; l < o; l++) s.contents[i + l] = r[t + l];
          return s.usedBytes = Math.max(s.usedBytes, i + o), o;
        },
        llseek(e, r, t) {
          var o = r;
          if (t === 1 ? o += e.position : t === 2 && n.isFile(e.node.mode) && (o += e.node.usedBytes), o < 0) throw new n.ErrnoError(28);
          return o;
        },
        mmap(e, r, t, o, i) {
          if (!n.isFile(e.node.mode)) throw new n.ErrnoError(43);
          var a, s, l = e.node.contents;
          if (!(i & 2) && l && l.buffer === D.buffer) s = false, a = l.byteOffset;
          else {
            if (s = true, a = Le(), !a) throw new n.ErrnoError(48);
            l && ((t > 0 || t + r < l.length) && (l.subarray ? l = l.subarray(t, t + r) : l = Array.prototype.slice.call(l, t, t + r)), D.set(l, a));
          }
          return {
            ptr: a,
            allocated: s
          };
        },
        msync(e, r, t, o, i) {
          return v.stream_ops.write(e, r, 0, o, t, false), 0;
        }
      }
    }, Dr = (e) => {
      var r = {
        r: 0,
        "r+": 2,
        w: 577,
        "w+": 578,
        a: 1089,
        "a+": 1090
      }, t = r[e];
      if (typeof t > "u") throw new Error(`Unknown file open mode: ${e}`);
      return t;
    }, we = (e, r) => {
      var t = 0;
      return e && (t |= 365), r && (t |= 146), t;
    }, Rr = (e) => Y(We(e)), Ue = {
      EPERM: 63,
      ENOENT: 44,
      ESRCH: 71,
      EINTR: 27,
      EIO: 29,
      ENXIO: 60,
      E2BIG: 1,
      ENOEXEC: 45,
      EBADF: 8,
      ECHILD: 12,
      EAGAIN: 6,
      EWOULDBLOCK: 6,
      ENOMEM: 48,
      EACCES: 2,
      EFAULT: 21,
      ENOTBLK: 105,
      EBUSY: 10,
      EEXIST: 20,
      EXDEV: 75,
      ENODEV: 43,
      ENOTDIR: 54,
      EISDIR: 31,
      EINVAL: 28,
      ENFILE: 41,
      EMFILE: 33,
      ENOTTY: 59,
      ETXTBSY: 74,
      EFBIG: 22,
      ENOSPC: 51,
      ESPIPE: 70,
      EROFS: 69,
      EMLINK: 34,
      EPIPE: 64,
      EDOM: 18,
      ERANGE: 68,
      ENOMSG: 49,
      EIDRM: 24,
      ECHRNG: 106,
      EL2NSYNC: 156,
      EL3HLT: 107,
      EL3RST: 108,
      ELNRNG: 109,
      EUNATCH: 110,
      ENOCSI: 111,
      EL2HLT: 112,
      EDEADLK: 16,
      ENOLCK: 46,
      EBADE: 113,
      EBADR: 114,
      EXFULL: 115,
      ENOANO: 104,
      EBADRQC: 103,
      EBADSLT: 102,
      EDEADLOCK: 16,
      EBFONT: 101,
      ENOSTR: 100,
      ENODATA: 116,
      ETIME: 117,
      ENOSR: 118,
      ENONET: 119,
      ENOPKG: 120,
      EREMOTE: 121,
      ENOLINK: 47,
      EADV: 122,
      ESRMNT: 123,
      ECOMM: 124,
      EPROTO: 65,
      EMULTIHOP: 36,
      EDOTDOT: 125,
      EBADMSG: 9,
      ENOTUNIQ: 126,
      EBADFD: 127,
      EREMCHG: 128,
      ELIBACC: 129,
      ELIBBAD: 130,
      ELIBSCN: 131,
      ELIBMAX: 132,
      ELIBEXEC: 133,
      ENOSYS: 52,
      ENOTEMPTY: 55,
      ENAMETOOLONG: 37,
      ELOOP: 32,
      EOPNOTSUPP: 138,
      EPFNOSUPPORT: 139,
      ECONNRESET: 15,
      ENOBUFS: 42,
      EAFNOSUPPORT: 5,
      EPROTOTYPE: 67,
      ENOTSOCK: 57,
      ENOPROTOOPT: 50,
      ESHUTDOWN: 140,
      ECONNREFUSED: 14,
      EADDRINUSE: 3,
      ECONNABORTED: 13,
      ENETUNREACH: 40,
      ENETDOWN: 38,
      ETIMEDOUT: 73,
      EHOSTDOWN: 142,
      EHOSTUNREACH: 23,
      EINPROGRESS: 26,
      EALREADY: 7,
      EDESTADDRREQ: 17,
      EMSGSIZE: 35,
      EPROTONOSUPPORT: 66,
      ESOCKTNOSUPPORT: 137,
      EADDRNOTAVAIL: 4,
      ENETRESET: 39,
      EISCONN: 30,
      ENOTCONN: 53,
      ETOOMANYREFS: 141,
      EUSERS: 136,
      EDQUOT: 19,
      ESTALE: 72,
      ENOTSUP: 138,
      ENOMEDIUM: 148,
      EILSEQ: 25,
      EOVERFLOW: 61,
      ECANCELED: 11,
      ENOTRECOVERABLE: 56,
      EOWNERDEAD: 62,
      ESTRPIPE: 135
    }, Or = async (e) => {
      var r = await oe(e);
      return u(r, `Loading data file "${e}" failed (no arrayBuffer).`), new Uint8Array(r);
    }, Mr = (...e) => n.createDataFile(...e), Cr = (e) => {
      for (var r = e; ; ) {
        if (!x[e]) return e;
        e = r + Math.random();
      }
    }, L = 0, Z = null, x = {}, M = null, Ir = (e) => {
      var _a2;
      if (L--, (_a2 = d.monitorRunDependencies) == null ? void 0 : _a2.call(d, L), u(e, "removeRunDependency requires an ID"), u(x[e]), delete x[e], L == 0 && (M !== null && (clearInterval(M), M = null), Z)) {
        var r = Z;
        Z = null, r();
      }
    }, Lr = (e) => {
      var _a2, _b2;
      L++, (_a2 = d.monitorRunDependencies) == null ? void 0 : _a2.call(d, L), u(e, "addRunDependency requires an ID"), u(!x[e]), x[e] = 1, M === null && globalThis.setInterval && (M = setInterval(() => {
        if (ae) {
          clearInterval(M), M = null;
          return;
        }
        var r = false;
        for (var t in x) r || (r = true, F("still waiting on run dependencies:")), F(`dependency: ${t}`);
        r && F("(end of list)");
      }, 1e4), (_b2 = M.unref) == null ? void 0 : _b2.call(M));
    }, Be = [], Ur = async (e, r) => {
      typeof Browser < "u" && Browser.init();
      for (var t of Be) if (t.canHandle(r)) return u(t.handle.constructor.name === "AsyncFunction", "Filesystem plugin handlers must be async functions (See #24914)"), t.handle(e, r);
      return e;
    }, xe = async (e, r, t, o, i, a, s, l) => {
      var c = r ? B.resolve(E.join2(e, r)) : e, f = Cr(`cp ${c}`);
      Lr(f);
      try {
        var p = t;
        typeof t == "string" && (p = await Or(t)), p = await Ur(p, c), l == null ? void 0 : l(), a || Mr(e, r, p, o, i, s);
      } finally {
        Ir(f);
      }
    }, Br = (e, r, t, o, i, a, s, l, c, f) => {
      xe(e, r, t, o, i, l, c, f).then(a).catch(s);
    }, n = {
      root: null,
      mounts: [],
      devices: {},
      streams: [],
      nextInode: 1,
      nameTable: null,
      currentPath: "/",
      initialized: false,
      ignorePermissions: true,
      filesystems: null,
      syncFSRequests: 0,
      readFiles: {},
      ErrnoError: class extends Error {
        constructor(e) {
          super(V ? Rr(e) : "");
          __publicField(this, "name", "ErrnoError");
          this.errno = e;
          for (var r in Ue) if (Ue[r] === e) {
            this.code = r;
            break;
          }
        }
      },
      FSStream: class {
        constructor() {
          __publicField(this, "shared", {});
        }
        get object() {
          return this.node;
        }
        set object(e) {
          this.node = e;
        }
        get isRead() {
          return (this.flags & 2097155) !== 1;
        }
        get isWrite() {
          return (this.flags & 2097155) !== 0;
        }
        get isAppend() {
          return this.flags & 1024;
        }
        get flags() {
          return this.shared.flags;
        }
        set flags(e) {
          this.shared.flags = e;
        }
        get position() {
          return this.shared.position;
        }
        set position(e) {
          this.shared.position = e;
        }
      },
      FSNode: class {
        constructor(e, r, t, o) {
          __publicField(this, "node_ops", {});
          __publicField(this, "stream_ops", {});
          __publicField(this, "readMode", 365);
          __publicField(this, "writeMode", 146);
          __publicField(this, "mounted", null);
          e || (e = this), this.parent = e, this.mount = e.mount, this.id = n.nextInode++, this.name = r, this.mode = t, this.rdev = o, this.atime = this.mtime = this.ctime = Date.now();
        }
        get read() {
          return (this.mode & this.readMode) === this.readMode;
        }
        set read(e) {
          e ? this.mode |= this.readMode : this.mode &= ~this.readMode;
        }
        get write() {
          return (this.mode & this.writeMode) === this.writeMode;
        }
        set write(e) {
          e ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
        }
        get isFolder() {
          return n.isDir(this.mode);
        }
        get isDevice() {
          return n.isChrdev(this.mode);
        }
      },
      lookupPath(e, r = {}) {
        if (!e) throw new n.ErrnoError(44);
        r.follow_mount ?? (r.follow_mount = true), E.isAbs(e) || (e = n.cwd() + "/" + e);
        e: for (var t = 0; t < 40; t++) {
          for (var o = e.split("/").filter((f) => !!f), i = n.root, a = "/", s = 0; s < o.length; s++) {
            var l = s === o.length - 1;
            if (l && r.parent) break;
            if (o[s] !== ".") {
              if (o[s] === "..") {
                if (a = E.dirname(a), n.isRoot(i)) {
                  e = a + "/" + o.slice(s + 1).join("/"), t--;
                  continue e;
                } else i = i.parent;
                continue;
              }
              a = E.join2(a, o[s]);
              try {
                i = n.lookupNode(i, o[s]);
              } catch (f) {
                if ((f == null ? void 0 : f.errno) === 44 && l && r.noent_okay) return {
                  path: a
                };
                throw f;
              }
              if (n.isMountpoint(i) && (!l || r.follow_mount) && (i = i.mounted.root), n.isLink(i.mode) && (!l || r.follow)) {
                if (!i.node_ops.readlink) throw new n.ErrnoError(52);
                var c = i.node_ops.readlink(i);
                E.isAbs(c) || (c = E.dirname(a) + "/" + c), e = c + "/" + o.slice(s + 1).join("/");
                continue e;
              }
            }
          }
          return {
            path: a,
            node: i
          };
        }
        throw new n.ErrnoError(32);
      },
      getPath(e) {
        for (var r; ; ) {
          if (n.isRoot(e)) {
            var t = e.mount.mountpoint;
            return r ? t[t.length - 1] !== "/" ? `${t}/${r}` : t + r : t;
          }
          r = r ? `${e.name}/${r}` : e.name, e = e.parent;
        }
      },
      hashName(e, r) {
        for (var t = 0, o = 0; o < r.length; o++) t = (t << 5) - t + r.charCodeAt(o) | 0;
        return (e + t >>> 0) % n.nameTable.length;
      },
      hashAddNode(e) {
        var r = n.hashName(e.parent.id, e.name);
        e.name_next = n.nameTable[r], n.nameTable[r] = e;
      },
      hashRemoveNode(e) {
        var r = n.hashName(e.parent.id, e.name);
        if (n.nameTable[r] === e) n.nameTable[r] = e.name_next;
        else for (var t = n.nameTable[r]; t; ) {
          if (t.name_next === e) {
            t.name_next = e.name_next;
            break;
          }
          t = t.name_next;
        }
      },
      lookupNode(e, r) {
        var t = n.mayLookup(e);
        if (t) throw new n.ErrnoError(t);
        for (var o = n.hashName(e.id, r), i = n.nameTable[o]; i; i = i.name_next) {
          var a = i.name;
          if (i.parent.id === e.id && a === r) return i;
        }
        return n.lookup(e, r);
      },
      createNode(e, r, t, o) {
        u(typeof e == "object");
        var i = new n.FSNode(e, r, t, o);
        return n.hashAddNode(i), i;
      },
      destroyNode(e) {
        n.hashRemoveNode(e);
      },
      isRoot(e) {
        return e === e.parent;
      },
      isMountpoint(e) {
        return !!e.mounted;
      },
      isFile(e) {
        return (e & 61440) === 32768;
      },
      isDir(e) {
        return (e & 61440) === 16384;
      },
      isLink(e) {
        return (e & 61440) === 40960;
      },
      isChrdev(e) {
        return (e & 61440) === 8192;
      },
      isBlkdev(e) {
        return (e & 61440) === 24576;
      },
      isFIFO(e) {
        return (e & 61440) === 4096;
      },
      isSocket(e) {
        return (e & 49152) === 49152;
      },
      flagsToPermissionString(e) {
        var r = [
          "r",
          "w",
          "rw"
        ][e & 3];
        return e & 512 && (r += "w"), r;
      },
      nodePermissions(e, r) {
        return n.ignorePermissions ? 0 : r.includes("r") && !(e.mode & 292) || r.includes("w") && !(e.mode & 146) || r.includes("x") && !(e.mode & 73) ? 2 : 0;
      },
      mayLookup(e) {
        if (!n.isDir(e.mode)) return 54;
        var r = n.nodePermissions(e, "x");
        return r || (e.node_ops.lookup ? 0 : 2);
      },
      mayCreate(e, r) {
        if (!n.isDir(e.mode)) return 54;
        try {
          var t = n.lookupNode(e, r);
          return 20;
        } catch {
        }
        return n.nodePermissions(e, "wx");
      },
      mayDelete(e, r, t) {
        var o;
        try {
          o = n.lookupNode(e, r);
        } catch (a) {
          return a.errno;
        }
        var i = n.nodePermissions(e, "wx");
        if (i) return i;
        if (t) {
          if (!n.isDir(o.mode)) return 54;
          if (n.isRoot(o) || n.getPath(o) === n.cwd()) return 10;
        } else if (n.isDir(o.mode)) return 31;
        return 0;
      },
      mayOpen(e, r) {
        return e ? n.isLink(e.mode) ? 32 : n.isDir(e.mode) && (n.flagsToPermissionString(r) !== "r" || r & 576) ? 31 : n.nodePermissions(e, n.flagsToPermissionString(r)) : 44;
      },
      checkOpExists(e, r) {
        if (!e) throw new n.ErrnoError(r);
        return e;
      },
      MAX_OPEN_FDS: 4096,
      nextfd() {
        for (var e = 0; e <= n.MAX_OPEN_FDS; e++) if (!n.streams[e]) return e;
        throw new n.ErrnoError(33);
      },
      getStreamChecked(e) {
        var r = n.getStream(e);
        if (!r) throw new n.ErrnoError(8);
        return r;
      },
      getStream: (e) => n.streams[e],
      createStream(e, r = -1) {
        return u(r >= -1), e = Object.assign(new n.FSStream(), e), r == -1 && (r = n.nextfd()), e.fd = r, n.streams[r] = e, e;
      },
      closeStream(e) {
        n.streams[e] = null;
      },
      dupStream(e, r = -1) {
        var _a2, _b2;
        var t = n.createStream(e, r);
        return (_b2 = (_a2 = t.stream_ops) == null ? void 0 : _a2.dup) == null ? void 0 : _b2.call(_a2, t), t;
      },
      doSetAttr(e, r, t) {
        var o = e == null ? void 0 : e.stream_ops.setattr, i = o ? e : r;
        o ?? (o = r.node_ops.setattr), n.checkOpExists(o, 63), o(i, t);
      },
      chrdev_stream_ops: {
        open(e) {
          var _a2, _b2;
          var r = n.getDevice(e.node.rdev);
          e.stream_ops = r.stream_ops, (_b2 = (_a2 = e.stream_ops).open) == null ? void 0 : _b2.call(_a2, e);
        },
        llseek() {
          throw new n.ErrnoError(70);
        }
      },
      major: (e) => e >> 8,
      minor: (e) => e & 255,
      makedev: (e, r) => e << 8 | r,
      registerDevice(e, r) {
        n.devices[e] = {
          stream_ops: r
        };
      },
      getDevice: (e) => n.devices[e],
      getMounts(e) {
        for (var r = [], t = [
          e
        ]; t.length; ) {
          var o = t.pop();
          r.push(o), t.push(...o.mounts);
        }
        return r;
      },
      syncfs(e, r) {
        typeof e == "function" && (r = e, e = false), n.syncFSRequests++, n.syncFSRequests > 1 && F(`warning: ${n.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
        var t = n.getMounts(n.root.mount), o = 0;
        function i(l) {
          return u(n.syncFSRequests > 0), n.syncFSRequests--, r(l);
        }
        function a(l) {
          if (l) return a.errored ? void 0 : (a.errored = true, i(l));
          ++o >= t.length && i(null);
        }
        for (var s of t) s.type.syncfs ? s.type.syncfs(s, e, a) : a(null);
      },
      mount(e, r, t) {
        if (typeof e == "string") throw e;
        var o = t === "/", i = !t, a;
        if (o && n.root) throw new n.ErrnoError(10);
        if (!o && !i) {
          var s = n.lookupPath(t, {
            follow_mount: false
          });
          if (t = s.path, a = s.node, n.isMountpoint(a)) throw new n.ErrnoError(10);
          if (!n.isDir(a.mode)) throw new n.ErrnoError(54);
        }
        var l = {
          type: e,
          opts: r,
          mountpoint: t,
          mounts: []
        }, c = e.mount(l);
        return c.mount = l, l.root = c, o ? n.root = c : a && (a.mounted = l, a.mount && a.mount.mounts.push(l)), c;
      },
      unmount(e) {
        var r = n.lookupPath(e, {
          follow_mount: false
        });
        if (!n.isMountpoint(r.node)) throw new n.ErrnoError(28);
        var t = r.node, o = t.mounted, i = n.getMounts(o);
        for (var [a, s] of Object.entries(n.nameTable)) for (; s; ) {
          var l = s.name_next;
          i.includes(s.mount) && n.destroyNode(s), s = l;
        }
        t.mounted = null;
        var c = t.mount.mounts.indexOf(o);
        u(c !== -1), t.mount.mounts.splice(c, 1);
      },
      lookup(e, r) {
        return e.node_ops.lookup(e, r);
      },
      mknod(e, r, t) {
        var o = n.lookupPath(e, {
          parent: true
        }), i = o.node, a = E.basename(e);
        if (!a) throw new n.ErrnoError(28);
        if (a === "." || a === "..") throw new n.ErrnoError(20);
        var s = n.mayCreate(i, a);
        if (s) throw new n.ErrnoError(s);
        if (!i.node_ops.mknod) throw new n.ErrnoError(63);
        return i.node_ops.mknod(i, a, r, t);
      },
      statfs(e) {
        return n.statfsNode(n.lookupPath(e, {
          follow: true
        }).node);
      },
      statfsStream(e) {
        return n.statfsNode(e.node);
      },
      statfsNode(e) {
        var r = {
          bsize: 4096,
          frsize: 4096,
          blocks: 1e6,
          bfree: 5e5,
          bavail: 5e5,
          files: n.nextInode,
          ffree: n.nextInode - 1,
          fsid: 42,
          flags: 2,
          namelen: 255
        };
        return e.node_ops.statfs && Object.assign(r, e.node_ops.statfs(e.mount.opts.root)), r;
      },
      create(e, r = 438) {
        return r &= 4095, r |= 32768, n.mknod(e, r, 0);
      },
      mkdir(e, r = 511) {
        return r &= 1023, r |= 16384, n.mknod(e, r, 0);
      },
      mkdirTree(e, r) {
        var t = e.split("/"), o = "";
        for (var i of t) if (i) {
          (o || E.isAbs(e)) && (o += "/"), o += i;
          try {
            n.mkdir(o, r);
          } catch (a) {
            if (a.errno != 20) throw a;
          }
        }
      },
      mkdev(e, r, t) {
        return typeof t > "u" && (t = r, r = 438), r |= 8192, n.mknod(e, r, t);
      },
      symlink(e, r) {
        if (!B.resolve(e)) throw new n.ErrnoError(44);
        var t = n.lookupPath(r, {
          parent: true
        }), o = t.node;
        if (!o) throw new n.ErrnoError(44);
        var i = E.basename(r), a = n.mayCreate(o, i);
        if (a) throw new n.ErrnoError(a);
        if (!o.node_ops.symlink) throw new n.ErrnoError(63);
        return o.node_ops.symlink(o, i, e);
      },
      rename(e, r) {
        var t = E.dirname(e), o = E.dirname(r), i = E.basename(e), a = E.basename(r), s, l, c;
        if (s = n.lookupPath(e, {
          parent: true
        }), l = s.node, s = n.lookupPath(r, {
          parent: true
        }), c = s.node, !l || !c) throw new n.ErrnoError(44);
        if (l.mount !== c.mount) throw new n.ErrnoError(75);
        var f = n.lookupNode(l, i), p = B.relative(e, o);
        if (p.charAt(0) !== ".") throw new n.ErrnoError(28);
        if (p = B.relative(r, t), p.charAt(0) !== ".") throw new n.ErrnoError(55);
        var g;
        try {
          g = n.lookupNode(c, a);
        } catch {
        }
        if (f !== g) {
          var m = n.isDir(f.mode), _ = n.mayDelete(l, i, m);
          if (_) throw new n.ErrnoError(_);
          if (_ = g ? n.mayDelete(c, a, m) : n.mayCreate(c, a), _) throw new n.ErrnoError(_);
          if (!l.node_ops.rename) throw new n.ErrnoError(63);
          if (n.isMountpoint(f) || g && n.isMountpoint(g)) throw new n.ErrnoError(10);
          if (c !== l && (_ = n.nodePermissions(l, "w"), _)) throw new n.ErrnoError(_);
          n.hashRemoveNode(f);
          try {
            l.node_ops.rename(f, c, a), f.parent = c;
          } catch (w) {
            throw w;
          } finally {
            n.hashAddNode(f);
          }
        }
      },
      rmdir(e) {
        var r = n.lookupPath(e, {
          parent: true
        }), t = r.node, o = E.basename(e), i = n.lookupNode(t, o), a = n.mayDelete(t, o, true);
        if (a) throw new n.ErrnoError(a);
        if (!t.node_ops.rmdir) throw new n.ErrnoError(63);
        if (n.isMountpoint(i)) throw new n.ErrnoError(10);
        t.node_ops.rmdir(t, o), n.destroyNode(i);
      },
      readdir(e) {
        var r = n.lookupPath(e, {
          follow: true
        }), t = r.node, o = n.checkOpExists(t.node_ops.readdir, 54);
        return o(t);
      },
      unlink(e) {
        var r = n.lookupPath(e, {
          parent: true
        }), t = r.node;
        if (!t) throw new n.ErrnoError(44);
        var o = E.basename(e), i = n.lookupNode(t, o), a = n.mayDelete(t, o, false);
        if (a) throw new n.ErrnoError(a);
        if (!t.node_ops.unlink) throw new n.ErrnoError(63);
        if (n.isMountpoint(i)) throw new n.ErrnoError(10);
        t.node_ops.unlink(t, o), n.destroyNode(i);
      },
      readlink(e) {
        var r = n.lookupPath(e), t = r.node;
        if (!t) throw new n.ErrnoError(44);
        if (!t.node_ops.readlink) throw new n.ErrnoError(28);
        return t.node_ops.readlink(t);
      },
      stat(e, r) {
        var t = n.lookupPath(e, {
          follow: !r
        }), o = t.node, i = n.checkOpExists(o.node_ops.getattr, 63);
        return i(o);
      },
      fstat(e) {
        var r = n.getStreamChecked(e), t = r.node, o = r.stream_ops.getattr, i = o ? r : t;
        return o ?? (o = t.node_ops.getattr), n.checkOpExists(o, 63), o(i);
      },
      lstat(e) {
        return n.stat(e, true);
      },
      doChmod(e, r, t, o) {
        n.doSetAttr(e, r, {
          mode: t & 4095 | r.mode & -4096,
          ctime: Date.now(),
          dontFollow: o
        });
      },
      chmod(e, r, t) {
        var o;
        if (typeof e == "string") {
          var i = n.lookupPath(e, {
            follow: !t
          });
          o = i.node;
        } else o = e;
        n.doChmod(null, o, r, t);
      },
      lchmod(e, r) {
        n.chmod(e, r, true);
      },
      fchmod(e, r) {
        var t = n.getStreamChecked(e);
        n.doChmod(t, t.node, r, false);
      },
      doChown(e, r, t) {
        n.doSetAttr(e, r, {
          timestamp: Date.now(),
          dontFollow: t
        });
      },
      chown(e, r, t, o) {
        var i;
        if (typeof e == "string") {
          var a = n.lookupPath(e, {
            follow: !o
          });
          i = a.node;
        } else i = e;
        n.doChown(null, i, o);
      },
      lchown(e, r, t) {
        n.chown(e, r, t, true);
      },
      fchown(e, r, t) {
        var o = n.getStreamChecked(e);
        n.doChown(o, o.node, false);
      },
      doTruncate(e, r, t) {
        if (n.isDir(r.mode)) throw new n.ErrnoError(31);
        if (!n.isFile(r.mode)) throw new n.ErrnoError(28);
        var o = n.nodePermissions(r, "w");
        if (o) throw new n.ErrnoError(o);
        n.doSetAttr(e, r, {
          size: t,
          timestamp: Date.now()
        });
      },
      truncate(e, r) {
        if (r < 0) throw new n.ErrnoError(28);
        var t;
        if (typeof e == "string") {
          var o = n.lookupPath(e, {
            follow: true
          });
          t = o.node;
        } else t = e;
        n.doTruncate(null, t, r);
      },
      ftruncate(e, r) {
        var t = n.getStreamChecked(e);
        if (r < 0 || !(t.flags & 2097155)) throw new n.ErrnoError(28);
        n.doTruncate(t, t.node, r);
      },
      utime(e, r, t) {
        var o = n.lookupPath(e, {
          follow: true
        }), i = o.node, a = n.checkOpExists(i.node_ops.setattr, 63);
        a(i, {
          atime: r,
          mtime: t
        });
      },
      open(e, r, t = 438) {
        if (e === "") throw new n.ErrnoError(44);
        r = typeof r == "string" ? Dr(r) : r, r & 64 ? t = t & 4095 | 32768 : t = 0;
        var o, i;
        if (typeof e == "object") o = e;
        else {
          i = e.endsWith("/");
          var a = n.lookupPath(e, {
            follow: !(r & 131072),
            noent_okay: true
          });
          o = a.node, e = a.path;
        }
        var s = false;
        if (r & 64) if (o) {
          if (r & 128) throw new n.ErrnoError(20);
        } else {
          if (i) throw new n.ErrnoError(31);
          o = n.mknod(e, t | 511, 0), s = true;
        }
        if (!o) throw new n.ErrnoError(44);
        if (n.isChrdev(o.mode) && (r &= -513), r & 65536 && !n.isDir(o.mode)) throw new n.ErrnoError(54);
        if (!s) {
          var l = n.mayOpen(o, r);
          if (l) throw new n.ErrnoError(l);
        }
        r & 512 && !s && n.truncate(o, 0), r &= -131713;
        var c = n.createStream({
          node: o,
          path: n.getPath(o),
          flags: r,
          seekable: true,
          position: 0,
          stream_ops: o.stream_ops,
          ungotten: [],
          error: false
        });
        return c.stream_ops.open && c.stream_ops.open(c), s && n.chmod(o, t & 511), d.logReadFiles && !(r & 1) && (e in n.readFiles || (n.readFiles[e] = 1)), c;
      },
      close(e) {
        if (n.isClosed(e)) throw new n.ErrnoError(8);
        e.getdents && (e.getdents = null);
        try {
          e.stream_ops.close && e.stream_ops.close(e);
        } catch (r) {
          throw r;
        } finally {
          n.closeStream(e.fd);
        }
        e.fd = null;
      },
      isClosed(e) {
        return e.fd === null;
      },
      llseek(e, r, t) {
        if (n.isClosed(e)) throw new n.ErrnoError(8);
        if (!e.seekable || !e.stream_ops.llseek) throw new n.ErrnoError(70);
        if (t != 0 && t != 1 && t != 2) throw new n.ErrnoError(28);
        return e.position = e.stream_ops.llseek(e, r, t), e.ungotten = [], e.position;
      },
      read(e, r, t, o, i) {
        if (u(t >= 0), o < 0 || i < 0) throw new n.ErrnoError(28);
        if (n.isClosed(e)) throw new n.ErrnoError(8);
        if ((e.flags & 2097155) === 1) throw new n.ErrnoError(8);
        if (n.isDir(e.node.mode)) throw new n.ErrnoError(31);
        if (!e.stream_ops.read) throw new n.ErrnoError(28);
        var a = typeof i < "u";
        if (!a) i = e.position;
        else if (!e.seekable) throw new n.ErrnoError(70);
        var s = e.stream_ops.read(e, r, t, o, i);
        return a || (e.position += s), s;
      },
      write(e, r, t, o, i, a) {
        if (u(t >= 0), o < 0 || i < 0) throw new n.ErrnoError(28);
        if (n.isClosed(e)) throw new n.ErrnoError(8);
        if (!(e.flags & 2097155)) throw new n.ErrnoError(8);
        if (n.isDir(e.node.mode)) throw new n.ErrnoError(31);
        if (!e.stream_ops.write) throw new n.ErrnoError(28);
        e.seekable && e.flags & 1024 && n.llseek(e, 0, 2);
        var s = typeof i < "u";
        if (!s) i = e.position;
        else if (!e.seekable) throw new n.ErrnoError(70);
        var l = e.stream_ops.write(e, r, t, o, i, a);
        return s || (e.position += l), l;
      },
      mmap(e, r, t, o, i) {
        if (o & 2 && !(i & 2) && (e.flags & 2097155) !== 2) throw new n.ErrnoError(2);
        if ((e.flags & 2097155) === 1) throw new n.ErrnoError(2);
        if (!e.stream_ops.mmap) throw new n.ErrnoError(43);
        if (!r) throw new n.ErrnoError(28);
        return e.stream_ops.mmap(e, r, t, o, i);
      },
      msync(e, r, t, o, i) {
        return u(t >= 0), e.stream_ops.msync ? e.stream_ops.msync(e, r, t, o, i) : 0;
      },
      ioctl(e, r, t) {
        if (!e.stream_ops.ioctl) throw new n.ErrnoError(59);
        return e.stream_ops.ioctl(e, r, t);
      },
      readFile(e, r = {}) {
        r.flags = r.flags || 0, r.encoding = r.encoding || "binary", r.encoding !== "utf8" && r.encoding !== "binary" && y(`Invalid encoding type "${r.encoding}"`);
        var t = n.open(e, r.flags), o = n.stat(e), i = o.size, a = new Uint8Array(i);
        return n.read(t, a, 0, i, 0), r.encoding === "utf8" && (a = U(a)), n.close(t), a;
      },
      writeFile(e, r, t = {}) {
        t.flags = t.flags || 577;
        var o = n.open(e, t.flags, t.mode);
        typeof r == "string" && (r = new Uint8Array(ye(r))), ArrayBuffer.isView(r) ? n.write(o, r, 0, r.byteLength, void 0, t.canOwn) : y("Unsupported data type"), n.close(o);
      },
      cwd: () => n.currentPath,
      chdir(e) {
        var r = n.lookupPath(e, {
          follow: true
        });
        if (r.node === null) throw new n.ErrnoError(44);
        if (!n.isDir(r.node.mode)) throw new n.ErrnoError(54);
        var t = n.nodePermissions(r.node, "x");
        if (t) throw new n.ErrnoError(t);
        n.currentPath = r.path;
      },
      createDefaultDirectories() {
        n.mkdir("/tmp"), n.mkdir("/home"), n.mkdir("/home/web_user");
      },
      createDefaultDevices() {
        n.mkdir("/dev"), n.registerDevice(n.makedev(1, 3), {
          read: () => 0,
          write: (o, i, a, s, l) => s,
          llseek: () => 0
        }), n.mkdev("/dev/null", n.makedev(1, 3)), I.register(n.makedev(5, 0), I.default_tty_ops), I.register(n.makedev(6, 0), I.default_tty1_ops), n.mkdev("/dev/tty", n.makedev(5, 0)), n.mkdev("/dev/tty1", n.makedev(6, 0));
        var e = new Uint8Array(1024), r = 0, t = () => (r === 0 && (Ie(e), r = e.byteLength), e[--r]);
        n.createDevice("/dev", "random", t), n.createDevice("/dev", "urandom", t), n.mkdir("/dev/shm"), n.mkdir("/dev/shm/tmp");
      },
      createSpecialDirectories() {
        n.mkdir("/proc");
        var e = n.mkdir("/proc/self");
        n.mkdir("/proc/self/fd"), n.mount({
          mount() {
            var r = n.createNode(e, "fd", 16895, 73);
            return r.stream_ops = {
              llseek: v.stream_ops.llseek
            }, r.node_ops = {
              lookup(t, o) {
                var i = +o, a = n.getStreamChecked(i), s = {
                  parent: null,
                  mount: {
                    mountpoint: "fake"
                  },
                  node_ops: {
                    readlink: () => a.path
                  },
                  id: i + 1
                };
                return s.parent = s, s;
              },
              readdir() {
                return Array.from(n.streams.entries()).filter(([t, o]) => o).map(([t, o]) => t.toString());
              }
            }, r;
          }
        }, {}, "/proc/self/fd");
      },
      createStandardStreams(e, r, t) {
        e ? n.createDevice("/dev", "stdin", e) : n.symlink("/dev/tty", "/dev/stdin"), r ? n.createDevice("/dev", "stdout", null, r) : n.symlink("/dev/tty", "/dev/stdout"), t ? n.createDevice("/dev", "stderr", null, t) : n.symlink("/dev/tty1", "/dev/stderr");
        var o = n.open("/dev/stdin", 0), i = n.open("/dev/stdout", 1), a = n.open("/dev/stderr", 1);
        u(o.fd === 0, `invalid handle for stdin (${o.fd})`), u(i.fd === 1, `invalid handle for stdout (${i.fd})`), u(a.fd === 2, `invalid handle for stderr (${a.fd})`);
      },
      staticInit() {
        n.nameTable = new Array(4096), n.mount(v, {}, "/"), n.createDefaultDirectories(), n.createDefaultDevices(), n.createSpecialDirectories(), n.filesystems = {
          MEMFS: v
        };
      },
      init(e, r, t) {
        u(!n.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"), n.initialized = true, e ?? (e = d.stdin), r ?? (r = d.stdout), t ?? (t = d.stderr), n.createStandardStreams(e, r, t);
      },
      quit() {
        n.initialized = false, ze(0);
        for (var e of n.streams) e && n.close(e);
      },
      findObject(e, r) {
        var t = n.analyzePath(e, r);
        return t.exists ? t.object : null;
      },
      analyzePath(e, r) {
        try {
          var t = n.lookupPath(e, {
            follow: !r
          });
          e = t.path;
        } catch {
        }
        var o = {
          isRoot: false,
          exists: false,
          error: 0,
          name: null,
          path: null,
          object: null,
          parentExists: false,
          parentPath: null,
          parentObject: null
        };
        try {
          var t = n.lookupPath(e, {
            parent: true
          });
          o.parentExists = true, o.parentPath = t.path, o.parentObject = t.node, o.name = E.basename(e), t = n.lookupPath(e, {
            follow: !r
          }), o.exists = true, o.path = t.path, o.object = t.node, o.name = t.node.name, o.isRoot = t.path === "/";
        } catch (i) {
          o.error = i.errno;
        }
        return o;
      },
      createPath(e, r, t, o) {
        e = typeof e == "string" ? e : n.getPath(e);
        for (var i = r.split("/").reverse(); i.length; ) {
          var a = i.pop();
          if (a) {
            var s = E.join2(e, a);
            try {
              n.mkdir(s);
            } catch (l) {
              if (l.errno != 20) throw l;
            }
            e = s;
          }
        }
        return s;
      },
      createFile(e, r, t, o, i) {
        var a = E.join2(typeof e == "string" ? e : n.getPath(e), r), s = we(o, i);
        return n.create(a, s);
      },
      createDataFile(e, r, t, o, i, a) {
        var s = r;
        e && (e = typeof e == "string" ? e : n.getPath(e), s = r ? E.join2(e, r) : e);
        var l = we(o, i), c = n.create(s, l);
        if (t) {
          if (typeof t == "string") {
            for (var f = new Array(t.length), p = 0, g = t.length; p < g; ++p) f[p] = t.charCodeAt(p);
            t = f;
          }
          n.chmod(c, l | 146);
          var m = n.open(c, 577);
          n.write(m, t, 0, t.length, 0, a), n.close(m), n.chmod(c, l);
        }
      },
      createDevice(e, r, t, o) {
        var _a2;
        var i = E.join2(typeof e == "string" ? e : n.getPath(e), r), a = we(!!t, !!o);
        (_a2 = n.createDevice).major ?? (_a2.major = 64);
        var s = n.makedev(n.createDevice.major++, 0);
        return n.registerDevice(s, {
          open(l) {
            l.seekable = false;
          },
          close(l) {
            var _a3;
            ((_a3 = o == null ? void 0 : o.buffer) == null ? void 0 : _a3.length) && o(10);
          },
          read(l, c, f, p, g) {
            for (var m = 0, _ = 0; _ < p; _++) {
              var w;
              try {
                w = t();
              } catch {
                throw new n.ErrnoError(29);
              }
              if (w === void 0 && m === 0) throw new n.ErrnoError(6);
              if (w == null) break;
              m++, c[f + _] = w;
            }
            return m && (l.node.atime = Date.now()), m;
          },
          write(l, c, f, p, g) {
            for (var m = 0; m < p; m++) try {
              o(c[f + m]);
            } catch {
              throw new n.ErrnoError(29);
            }
            return p && (l.node.mtime = l.node.ctime = Date.now()), m;
          }
        }), n.mkdev(i, a, s);
      },
      forceLoadFile(e) {
        if (e.isDevice || e.isFolder || e.link || e.contents) return true;
        if (globalThis.XMLHttpRequest) y("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        else try {
          e.contents = H(e.url);
        } catch {
          throw new n.ErrnoError(29);
        }
      },
      createLazyFile(e, r, t, o, i) {
        class a {
          constructor() {
            __publicField(this, "lengthKnown", false);
            __publicField(this, "chunks", []);
          }
          get(m) {
            if (!(m > this.length - 1 || m < 0)) {
              var _ = m % this.chunkSize, w = m / this.chunkSize | 0;
              return this.getter(w)[_];
            }
          }
          setDataGetter(m) {
            this.getter = m;
          }
          cacheLength() {
            var m = new XMLHttpRequest();
            m.open("HEAD", t, false), m.send(null), m.status >= 200 && m.status < 300 || m.status === 304 || y("Couldn't load " + t + ". Status: " + m.status);
            var _ = Number(m.getResponseHeader("Content-length")), w, P = (w = m.getResponseHeader("Accept-Ranges")) && w === "bytes", N = (w = m.getResponseHeader("Content-Encoding")) && w === "gzip", T = 1024 * 1024;
            P || (T = _);
            var R = (O, W) => {
              O > W && y("invalid range (" + O + ", " + W + ") or no bytes requested!"), W > _ - 1 && y("only " + _ + " bytes available! programmer error!");
              var b = new XMLHttpRequest();
              return b.open("GET", t, false), _ !== T && b.setRequestHeader("Range", "bytes=" + O + "-" + W), b.responseType = "arraybuffer", b.overrideMimeType && b.overrideMimeType("text/plain; charset=x-user-defined"), b.send(null), b.status >= 200 && b.status < 300 || b.status === 304 || y("Couldn't load " + t + ". Status: " + b.status), b.response !== void 0 ? new Uint8Array(b.response || []) : ye(b.responseText || "");
            }, ee = this;
            ee.setDataGetter((O) => {
              var W = O * T, b = (O + 1) * T - 1;
              return b = Math.min(b, _ - 1), typeof ee.chunks[O] > "u" && (ee.chunks[O] = R(W, b)), typeof ee.chunks[O] > "u" && y("doXHR failed!"), ee.chunks[O];
            }), (N || !_) && (T = _ = 1, _ = this.getter(0).length, T = _, ie("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = _, this._chunkSize = T, this.lengthKnown = true;
          }
          get length() {
            return this.lengthKnown || this.cacheLength(), this._length;
          }
          get chunkSize() {
            return this.lengthKnown || this.cacheLength(), this._chunkSize;
          }
        }
        if (globalThis.XMLHttpRequest) {
          re || y("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
          var s = new a(), l = {
            isDevice: false,
            contents: s
          };
        } else var l = {
          isDevice: false,
          url: t
        };
        var c = n.createFile(e, r, l, o, i);
        l.contents ? c.contents = l.contents : l.url && (c.contents = null, c.url = l.url), Object.defineProperties(c, {
          usedBytes: {
            get: function() {
              return this.contents.length;
            }
          }
        });
        var f = {};
        for (const [g, m] of Object.entries(c.stream_ops)) f[g] = (..._) => (n.forceLoadFile(c), m(..._));
        function p(g, m, _, w, P) {
          var N = g.node.contents;
          if (P >= N.length) return 0;
          var T = Math.min(N.length - P, w);
          if (u(T >= 0), N.slice) for (var R = 0; R < T; R++) m[_ + R] = N[P + R];
          else for (var R = 0; R < T; R++) m[_ + R] = N.get(P + R);
          return T;
        }
        return f.read = (g, m, _, w, P) => (n.forceLoadFile(c), p(g, m, _, w, P)), f.mmap = (g, m, _, w, P) => {
          n.forceLoadFile(c);
          var N = Le();
          if (!N) throw new n.ErrnoError(48);
          return p(g, D, N, m, _), {
            ptr: N,
            allocated: true
          };
        }, c.stream_ops = f, c;
      },
      absolutePath() {
        y("FS.absolutePath has been removed; use PATH_FS.resolve instead");
      },
      createFolder() {
        y("FS.createFolder has been removed; use FS.mkdir instead");
      },
      createLink() {
        y("FS.createLink has been removed; use FS.symlink instead");
      },
      joinPath() {
        y("FS.joinPath has been removed; use PATH.join instead");
      },
      mmapAlloc() {
        y("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
      },
      standardizePath() {
        y("FS.standardizePath has been removed; use PATH.normalize instead");
      }
    }, Q = {
      calculateAt(e, r, t) {
        if (E.isAbs(r)) return r;
        var o;
        if (e === -100) o = n.cwd();
        else {
          var i = Q.getStreamFromFD(e);
          o = i.path;
        }
        if (r.length == 0) {
          if (!t) throw new n.ErrnoError(44);
          return o;
        }
        return o + "/" + r;
      },
      writeStat(e, r) {
        h[e >> 2] = r.dev, h[e + 4 >> 2] = r.mode, h[e + 8 >> 2] = r.nlink, h[e + 12 >> 2] = r.uid, h[e + 16 >> 2] = r.gid, h[e + 20 >> 2] = r.rdev, A[e + 24 >> 3] = BigInt(r.size), le[e + 32 >> 2] = 4096, le[e + 36 >> 2] = r.blocks;
        var t = r.atime.getTime(), o = r.mtime.getTime(), i = r.ctime.getTime();
        return A[e + 40 >> 3] = BigInt(Math.floor(t / 1e3)), h[e + 48 >> 2] = t % 1e3 * 1e3 * 1e3, A[e + 56 >> 3] = BigInt(Math.floor(o / 1e3)), h[e + 64 >> 2] = o % 1e3 * 1e3 * 1e3, A[e + 72 >> 3] = BigInt(Math.floor(i / 1e3)), h[e + 80 >> 2] = i % 1e3 * 1e3 * 1e3, A[e + 88 >> 3] = BigInt(r.ino), 0;
      },
      writeStatFs(e, r) {
        h[e + 4 >> 2] = r.bsize, h[e + 60 >> 2] = r.bsize, A[e + 8 >> 3] = BigInt(r.blocks), A[e + 16 >> 3] = BigInt(r.bfree), A[e + 24 >> 3] = BigInt(r.bavail), A[e + 32 >> 3] = BigInt(r.files), A[e + 40 >> 3] = BigInt(r.ffree), h[e + 48 >> 2] = r.fsid, h[e + 64 >> 2] = r.flags, h[e + 56 >> 2] = r.namelen;
      },
      doMsync(e, r, t, o, i) {
        if (!n.isFile(r.node.mode)) throw new n.ErrnoError(43);
        if (o & 2) return 0;
        var a = $.slice(e, e + t);
        n.msync(r, a, i, t, o);
      },
      getStreamFromFD(e) {
        var r = n.getStreamChecked(e);
        return r;
      },
      varargs: void 0,
      getStr(e) {
        var r = Y(e);
        return r;
      }
    };
    function xr(e) {
      try {
        var r = Q.getStreamFromFD(e);
        return n.close(r), 0;
      } catch (t) {
        if (typeof n > "u" || t.name !== "ErrnoError") throw t;
        return t.errno;
      }
    }
    var zr = (e, r, t, o) => {
      for (var i = 0, a = 0; a < t; a++) {
        var s = h[r >> 2], l = h[r + 4 >> 2];
        r += 8;
        var c = n.read(e, D, s, l, o);
        if (c < 0) return -1;
        if (i += c, c < l) break;
      }
      return i;
    };
    function Wr(e, r, t, o) {
      try {
        var i = Q.getStreamFromFD(e), a = zr(i, r, t);
        return h[o >> 2] = a, 0;
      } catch (s) {
        if (typeof n > "u" || s.name !== "ErrnoError") throw s;
        return s.errno;
      }
    }
    function Hr(e, r, t, o) {
      r = Er(r);
      try {
        if (isNaN(r)) return 61;
        var i = Q.getStreamFromFD(e);
        return n.llseek(i, r, t), A[o >> 3] = BigInt(i.position), i.getdents && r === 0 && t === 0 && (i.getdents = null), 0;
      } catch (a) {
        if (typeof n > "u" || a.name !== "ErrnoError") throw a;
        return a.errno;
      }
    }
    var jr = (e, r, t, o) => {
      for (var i = 0, a = 0; a < t; a++) {
        var s = h[r >> 2], l = h[r + 4 >> 2];
        r += 8;
        var c = n.write(e, D, s, l, o);
        if (c < 0) return -1;
        if (i += c, c < l) break;
      }
      return i;
    };
    function Gr(e, r, t, o) {
      try {
        var i = Q.getStreamFromFD(e), a = jr(i, r, t);
        return h[o >> 2] = a, 0;
      } catch (s) {
        if (typeof n > "u" || s.name !== "ErrnoError") throw s;
        return s.errno;
      }
    }
    n.createPreloadedFile = Br, n.preloadFile = xe, n.staticInit();
    {
      if (d.noExitRuntime && d.noExitRuntime, d.preloadPlugins && (Be = d.preloadPlugins), d.print && (ie = d.print), d.printErr && (F = d.printErr), d.wasmBinary && (j = d.wasmBinary), qr(), d.arguments && d.arguments, d.thisProgram && (me = d.thisProgram), u(typeof d.memoryInitializerPrefixURL > "u", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead"), u(typeof d.pthreadMainPrefixURL > "u", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead"), u(typeof d.cdInitializerPrefixURL > "u", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead"), u(typeof d.filePackagePrefixURL > "u", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead"), u(typeof d.read > "u", "Module.read option was removed"), u(typeof d.readAsync > "u", "Module.readAsync option was removed (modify readAsync in JS)"), u(typeof d.readBinary > "u", "Module.readBinary option was removed (modify readBinary in JS)"), u(typeof d.setWindowTitle > "u", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)"), u(typeof d.TOTAL_MEMORY > "u", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY"), u(typeof d.ENVIRONMENT > "u", "Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)"), u(typeof d.STACK_SIZE > "u", "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time"), u(typeof d.wasmMemory > "u", "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally"), u(typeof d.INITIAL_MEMORY > "u", "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically"), d.preInit) for (typeof d.preInit == "function" && (d.preInit = [
        d.preInit
      ]); d.preInit.length > 0; ) d.preInit.shift()();
      se("preInit");
    }
    var $r = [
      "writeI53ToI64",
      "writeI53ToI64Clamped",
      "writeI53ToI64Signaling",
      "writeI53ToU64Clamped",
      "writeI53ToU64Signaling",
      "readI53FromI64",
      "readI53FromU64",
      "convertI32PairToI53",
      "convertI32PairToI53Checked",
      "convertU32PairToI53",
      "stackAlloc",
      "getTempRet0",
      "setTempRet0",
      "createNamedFunction",
      "zeroMemory",
      "exitJS",
      "withStackSave",
      "inetPton4",
      "inetNtop4",
      "inetPton6",
      "inetNtop6",
      "readSockaddr",
      "writeSockaddr",
      "readEmAsmArgs",
      "jstoi_q",
      "autoResumeAudioContext",
      "getDynCaller",
      "dynCall",
      "handleException",
      "keepRuntimeAlive",
      "runtimeKeepalivePush",
      "runtimeKeepalivePop",
      "callUserCallback",
      "maybeExit",
      "asmjsMangle",
      "HandleAllocator",
      "addOnInit",
      "addOnPostCtor",
      "addOnPreMain",
      "addOnExit",
      "STACK_SIZE",
      "STACK_ALIGN",
      "POINTER_SIZE",
      "ASSERTIONS",
      "ccall",
      "cwrap",
      "convertJsFunctionToWasm",
      "getEmptyTableSlot",
      "updateTableMap",
      "getFunctionAddress",
      "addFunction",
      "removeFunction",
      "intArrayToString",
      "AsciiToString",
      "stringToAscii",
      "UTF16ToString",
      "stringToUTF16",
      "lengthBytesUTF16",
      "UTF32ToString",
      "stringToUTF32",
      "lengthBytesUTF32",
      "stringToNewUTF8",
      "stringToUTF8OnStack",
      "writeArrayToMemory",
      "registerKeyEventCallback",
      "maybeCStringToJsString",
      "findEventTarget",
      "getBoundingClientRect",
      "fillMouseEventData",
      "registerMouseEventCallback",
      "registerWheelEventCallback",
      "registerUiEventCallback",
      "registerFocusEventCallback",
      "fillDeviceOrientationEventData",
      "registerDeviceOrientationEventCallback",
      "fillDeviceMotionEventData",
      "registerDeviceMotionEventCallback",
      "screenOrientation",
      "fillOrientationChangeEventData",
      "registerOrientationChangeEventCallback",
      "fillFullscreenChangeEventData",
      "registerFullscreenChangeEventCallback",
      "JSEvents_requestFullscreen",
      "JSEvents_resizeCanvasForFullscreen",
      "registerRestoreOldStyle",
      "hideEverythingExceptGivenElement",
      "restoreHiddenElements",
      "setLetterbox",
      "softFullscreenResizeWebGLRenderTarget",
      "doRequestFullscreen",
      "fillPointerlockChangeEventData",
      "registerPointerlockChangeEventCallback",
      "registerPointerlockErrorEventCallback",
      "requestPointerLock",
      "fillVisibilityChangeEventData",
      "registerVisibilityChangeEventCallback",
      "registerTouchEventCallback",
      "fillGamepadEventData",
      "registerGamepadEventCallback",
      "registerBeforeUnloadEventCallback",
      "fillBatteryEventData",
      "registerBatteryEventCallback",
      "setCanvasElementSize",
      "getCanvasElementSize",
      "jsStackTrace",
      "getCallstack",
      "convertPCtoSourceLocation",
      "wasiRightsToMuslOFlags",
      "wasiOFlagsToMuslOFlags",
      "safeSetTimeout",
      "setImmediateWrapped",
      "safeRequestAnimationFrame",
      "clearImmediateWrapped",
      "registerPostMainLoop",
      "registerPreMainLoop",
      "getPromise",
      "makePromise",
      "idsToPromises",
      "makePromiseCallback",
      "findMatchingCatch",
      "Browser_asyncPrepareDataCounter",
      "isLeapYear",
      "ydayFromDate",
      "arraySum",
      "addDays",
      "getSocketFromFD",
      "getSocketAddress",
      "FS_mkdirTree",
      "_setNetworkCallback",
      "heapObjectForWebGLType",
      "toTypedArrayIndex",
      "webgl_enable_ANGLE_instanced_arrays",
      "webgl_enable_OES_vertex_array_object",
      "webgl_enable_WEBGL_draw_buffers",
      "webgl_enable_WEBGL_multi_draw",
      "webgl_enable_EXT_polygon_offset_clamp",
      "webgl_enable_EXT_clip_control",
      "webgl_enable_WEBGL_polygon_mode",
      "emscriptenWebGLGet",
      "computeUnpackAlignedImageSize",
      "colorChannelsInGlTextureFormat",
      "emscriptenWebGLGetTexPixelData",
      "emscriptenWebGLGetUniform",
      "webglGetUniformLocation",
      "webglPrepareUniformLocationsBeforeFirstUse",
      "webglGetLeftBracePos",
      "emscriptenWebGLGetVertexAttrib",
      "__glGetActiveAttribOrUniform",
      "writeGLArray",
      "registerWebGlEventCallback",
      "runAndAbortIfError",
      "ALLOC_NORMAL",
      "ALLOC_STACK",
      "allocate",
      "writeStringToMemory",
      "writeAsciiToMemory",
      "allocateUTF8",
      "allocateUTF8OnStack",
      "demangle",
      "stackTrace",
      "getNativeTypeSize"
    ];
    $r.forEach(Ye);
    var Vr = [
      "run",
      "out",
      "err",
      "callMain",
      "abort",
      "wasmExports",
      "HEAPF32",
      "HEAP8",
      "HEAP16",
      "HEAPU16",
      "HEAP32",
      "HEAP64",
      "HEAPU64",
      "writeStackCookie",
      "checkStackCookie",
      "INT53_MAX",
      "INT53_MIN",
      "bigintToI53Checked",
      "stackSave",
      "stackRestore",
      "ptrToString",
      "getHeapMax",
      "growMemory",
      "ENV",
      "ERRNO_CODES",
      "strError",
      "DNS",
      "Protocols",
      "Sockets",
      "timers",
      "warnOnce",
      "readEmAsmArgsArray",
      "getExecutableName",
      "asyncLoad",
      "alignMemory",
      "mmapAlloc",
      "wasmTable",
      "wasmMemory",
      "getUniqueRunDependency",
      "noExitRuntime",
      "addRunDependency",
      "removeRunDependency",
      "addOnPreRun",
      "addOnPostRun",
      "freeTableIndexes",
      "functionsInTableMap",
      "setValue",
      "getValue",
      "PATH",
      "PATH_FS",
      "UTF8Decoder",
      "UTF8ArrayToString",
      "UTF8ToString",
      "stringToUTF8Array",
      "stringToUTF8",
      "lengthBytesUTF8",
      "intArrayFromString",
      "UTF16Decoder",
      "JSEvents",
      "specialHTMLTargets",
      "findCanvasEventTarget",
      "currentFullscreenStrategy",
      "restoreOldWindowedStyle",
      "UNWIND_CACHE",
      "ExitStatus",
      "getEnvStrings",
      "checkWasiClock",
      "doReadv",
      "doWritev",
      "initRandomFill",
      "randomFill",
      "emSetImmediate",
      "emClearImmediate_deps",
      "emClearImmediate",
      "promiseMap",
      "uncaughtExceptionCount",
      "exceptionLast",
      "exceptionCaught",
      "ExceptionInfo",
      "Browser",
      "requestFullscreen",
      "requestFullScreen",
      "setCanvasSize",
      "getUserMedia",
      "createContext",
      "getPreloadedImageData__data",
      "wget",
      "MONTH_DAYS_REGULAR",
      "MONTH_DAYS_LEAP",
      "MONTH_DAYS_REGULAR_CUMULATIVE",
      "MONTH_DAYS_LEAP_CUMULATIVE",
      "SYSCALLS",
      "preloadPlugins",
      "FS_createPreloadedFile",
      "FS_preloadFile",
      "FS_modeStringToFlags",
      "FS_getMode",
      "FS_stdin_getChar_buffer",
      "FS_stdin_getChar",
      "FS_unlink",
      "FS_createPath",
      "FS_createDevice",
      "FS_readFile",
      "FS",
      "FS_root",
      "FS_mounts",
      "FS_devices",
      "FS_streams",
      "FS_nextInode",
      "FS_nameTable",
      "FS_currentPath",
      "FS_initialized",
      "FS_ignorePermissions",
      "FS_filesystems",
      "FS_syncFSRequests",
      "FS_readFiles",
      "FS_lookupPath",
      "FS_getPath",
      "FS_hashName",
      "FS_hashAddNode",
      "FS_hashRemoveNode",
      "FS_lookupNode",
      "FS_createNode",
      "FS_destroyNode",
      "FS_isRoot",
      "FS_isMountpoint",
      "FS_isFile",
      "FS_isDir",
      "FS_isLink",
      "FS_isChrdev",
      "FS_isBlkdev",
      "FS_isFIFO",
      "FS_isSocket",
      "FS_flagsToPermissionString",
      "FS_nodePermissions",
      "FS_mayLookup",
      "FS_mayCreate",
      "FS_mayDelete",
      "FS_mayOpen",
      "FS_checkOpExists",
      "FS_nextfd",
      "FS_getStreamChecked",
      "FS_getStream",
      "FS_createStream",
      "FS_closeStream",
      "FS_dupStream",
      "FS_doSetAttr",
      "FS_chrdev_stream_ops",
      "FS_major",
      "FS_minor",
      "FS_makedev",
      "FS_registerDevice",
      "FS_getDevice",
      "FS_getMounts",
      "FS_syncfs",
      "FS_mount",
      "FS_unmount",
      "FS_lookup",
      "FS_mknod",
      "FS_statfs",
      "FS_statfsStream",
      "FS_statfsNode",
      "FS_create",
      "FS_mkdir",
      "FS_mkdev",
      "FS_symlink",
      "FS_rename",
      "FS_rmdir",
      "FS_readdir",
      "FS_readlink",
      "FS_stat",
      "FS_fstat",
      "FS_lstat",
      "FS_doChmod",
      "FS_chmod",
      "FS_lchmod",
      "FS_fchmod",
      "FS_doChown",
      "FS_chown",
      "FS_lchown",
      "FS_fchown",
      "FS_doTruncate",
      "FS_truncate",
      "FS_ftruncate",
      "FS_utime",
      "FS_open",
      "FS_close",
      "FS_isClosed",
      "FS_llseek",
      "FS_read",
      "FS_write",
      "FS_mmap",
      "FS_msync",
      "FS_ioctl",
      "FS_writeFile",
      "FS_cwd",
      "FS_chdir",
      "FS_createDefaultDirectories",
      "FS_createDefaultDevices",
      "FS_createSpecialDirectories",
      "FS_createStandardStreams",
      "FS_staticInit",
      "FS_init",
      "FS_quit",
      "FS_findObject",
      "FS_analyzePath",
      "FS_createFile",
      "FS_createDataFile",
      "FS_forceLoadFile",
      "FS_createLazyFile",
      "FS_absolutePath",
      "FS_createFolder",
      "FS_createLink",
      "FS_joinPath",
      "FS_mmapAlloc",
      "FS_standardizePath",
      "MEMFS",
      "TTY",
      "PIPEFS",
      "SOCKFS",
      "tempFixedLengthArray",
      "miniTempWebGLFloatBuffers",
      "miniTempWebGLIntBuffers",
      "GL",
      "AL",
      "GLUT",
      "EGL",
      "GLEW",
      "IDBStore",
      "SDL",
      "SDL_gfx",
      "print",
      "printErr",
      "jstoi_s"
    ];
    Vr.forEach(Te);
    function qr() {
      qe("fetchSettings");
    }
    d._deform = S("_deform"), d._malloc = S("_malloc"), d._free = S("_free"), d._assembled_joint_mass = S("_assembled_joint_mass"), d._modal = S("_modal"), d._modal_paz = S("_modal_paz"), d._didactic_solve = S("_didactic_solve"), d._plate_q4_solve = S("_plate_q4_solve"), d._slopeAllocDouble = S("_slopeAllocDouble"), d._slopeStabilitySolver = S("_slopeStabilitySolver"), d._nonlinear_dynamic = S("_nonlinear_dynamic"), d._steel02_test = S("_steel02_test"), d._cyclic_pushover = S("_cyclic_pushover"), d._concrete02_test = S("_concrete02_test"), d._hex8_solve = S("_hex8_solve"), d._hex8_stress = S("_hex8_stress");
    var ze = S("_fflush"), We = S("_strerror"), Se = S("_emscripten_stack_get_end"), He = S("_emscripten_stack_init"), ce = S("wasmMemory");
    function Xr(e) {
      u(typeof e.deform < "u", "missing Wasm export: deform"), u(typeof e.malloc < "u", "missing Wasm export: malloc"), u(typeof e.free < "u", "missing Wasm export: free"), u(typeof e.assembled_joint_mass < "u", "missing Wasm export: assembled_joint_mass"), u(typeof e.modal < "u", "missing Wasm export: modal"), u(typeof e.modal_paz < "u", "missing Wasm export: modal_paz"), u(typeof e.didactic_solve < "u", "missing Wasm export: didactic_solve"), u(typeof e.plate_q4_solve < "u", "missing Wasm export: plate_q4_solve"), u(typeof e.slopeAllocDouble < "u", "missing Wasm export: slopeAllocDouble"), u(typeof e.slopeStabilitySolver < "u", "missing Wasm export: slopeStabilitySolver"), u(typeof e.nonlinear_dynamic < "u", "missing Wasm export: nonlinear_dynamic"), u(typeof e.steel02_test < "u", "missing Wasm export: steel02_test"), u(typeof e.cyclic_pushover < "u", "missing Wasm export: cyclic_pushover"), u(typeof e.concrete02_test < "u", "missing Wasm export: concrete02_test"), u(typeof e.hex8_solve < "u", "missing Wasm export: hex8_solve"), u(typeof e.hex8_stress < "u", "missing Wasm export: hex8_stress"), u(typeof e.fflush < "u", "missing Wasm export: fflush"), u(typeof e.strerror < "u", "missing Wasm export: strerror"), u(typeof e.emscripten_stack_get_end < "u", "missing Wasm export: emscripten_stack_get_end"), u(typeof e.emscripten_stack_get_base < "u", "missing Wasm export: emscripten_stack_get_base"), u(typeof e.emscripten_stack_init < "u", "missing Wasm export: emscripten_stack_init"), u(typeof e.emscripten_stack_get_free < "u", "missing Wasm export: emscripten_stack_get_free"), u(typeof e._emscripten_stack_restore < "u", "missing Wasm export: _emscripten_stack_restore"), u(typeof e._emscripten_stack_alloc < "u", "missing Wasm export: _emscripten_stack_alloc"), u(typeof e.emscripten_stack_get_current < "u", "missing Wasm export: emscripten_stack_get_current"), u(typeof e.memory < "u", "missing Wasm export: memory"), u(typeof e.__indirect_function_table < "u", "missing Wasm export: __indirect_function_table"), d._deform = k("deform", 80), d._malloc = k("malloc", 1), d._free = k("free", 1), d._assembled_joint_mass = k("assembled_joint_mass", 22), d._modal = k("modal", 87), d._modal_paz = k("modal_paz", 54), d._didactic_solve = k("didactic_solve", 48), d._plate_q4_solve = k("plate_q4_solve", 26), d._slopeAllocDouble = k("slopeAllocDouble", 1), d._slopeStabilitySolver = k("slopeStabilitySolver", 16), d._nonlinear_dynamic = k("nonlinear_dynamic", 20), d._steel02_test = k("steel02_test", 8), d._cyclic_pushover = k("cyclic_pushover", 40), d._concrete02_test = k("concrete02_test", 10), d._hex8_solve = k("hex8_solve", 18), d._hex8_stress = k("hex8_stress", 7), ze = k("fflush", 1), We = k("strerror", 1), Se = e.emscripten_stack_get_end, e.emscripten_stack_get_base, He = e.emscripten_stack_init, e.emscripten_stack_get_free, e._emscripten_stack_restore, e._emscripten_stack_alloc, e.emscripten_stack_get_current, ce = e.memory, e.__indirect_function_table;
    }
    var je = {
      __assert_fail: dr,
      __cxa_throw: ur,
      _abort_js: fr,
      _tzset_js: mr,
      clock_time_get: yr,
      emscripten_resize_heap: kr,
      environ_get: Tr,
      environ_sizes_get: Ar,
      fd_close: xr,
      fd_read: Wr,
      fd_seek: Hr,
      fd_write: Gr
    }, Ge;
    function Yr() {
      He(), Ve();
    }
    function Fe() {
      if (L > 0) {
        Z = Fe;
        return;
      }
      if (Yr(), Ke(), L > 0) {
        Z = Fe;
        return;
      }
      function e() {
        var _a2;
        u(!Ge), Ge = true, d.calledRun = true, !ae && (Je(), Ae == null ? void 0 : Ae(d), (_a2 = d.onRuntimeInitialized) == null ? void 0 : _a2.call(d), se("onRuntimeInitialized"), u(!d._main, 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]'), Ze());
      }
      d.setStatus ? (d.setStatus("Running..."), setTimeout(() => {
        setTimeout(() => d.setStatus(""), 1), e();
      }, 1)) : e(), he();
    }
    var z;
    z = await ir(), Fe(), V ? fe = d : fe = new Promise((e, r) => {
      Ae = e, Pe = r;
    });
    for (const e of Object.keys(d)) e in ue || Object.defineProperty(ue, e, {
      configurable: true,
      get() {
        y(`Access to module property ('${e}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`);
      }
    });
    return fe;
  };
})();
export {
  Zr as M,
  __tla
};
