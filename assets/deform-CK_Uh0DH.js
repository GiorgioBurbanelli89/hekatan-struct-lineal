var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { _ as Un } from "./preload-helper-V2P8TQsQ.js";
let Wn;
let __tla = (async () => {
  Wn = async function(we = {}) {
    var _a, _b, _c, _d, _e2, _f;
    var Se;
    (function() {
      var _a2;
      function e(l) {
        l = l.split("-")[0];
        for (var f = l.split(".").slice(0, 3); f.length < 3; ) f.push("00");
        return f = f.map((m, v, _) => m.padStart(2, "0")), f.join("");
      }
      var r = (l) => [
        l / 1e4 | 0,
        (l / 100 | 0) % 100,
        l % 100
      ].join("."), t = 2147483647, n = typeof process < "u" && ((_a2 = process.versions) == null ? void 0 : _a2.node) ? e(process.versions.node) : t;
      if (n < 16e4) throw new Error(`This emscripten-generated code requires node v${r(16e4)} (detected v${r(n)})`);
      var o = typeof navigator < "u" && navigator.userAgent;
      if (o) {
        var a = o.includes("Safari/") && !o.includes("Chrome/") && o.match(/Version\/(\d+\.?\d*\.?\d*)/) ? e(o.match(/Version\/(\d+\.?\d*\.?\d*)/)[1]) : t;
        if (a < 15e4) throw new Error(`This emscripten-generated code requires Safari v${r(15e4)} (detected v${a})`);
        var s = o.match(/Firefox\/(\d+(?:\.\d+)?)/) ? parseFloat(o.match(/Firefox\/(\d+(?:\.\d+)?)/)[1]) : t;
        if (s < 79) throw new Error(`This emscripten-generated code requires Firefox v79 (detected v${s})`);
        var c = o.match(/Chrome\/(\d+(?:\.\d+)?)/) ? parseFloat(o.match(/Chrome\/(\d+(?:\.\d+)?)/)[1]) : t;
        if (c < 85) throw new Error(`This emscripten-generated code requires Chrome v85 (detected v${c})`);
      }
    })();
    var d = we, Be = !!globalThis.window, ce = !!globalThis.WorkerGlobalScope, z = ((_b = (_a = globalThis.process) == null ? void 0 : _a.versions) == null ? void 0 : _b.node) && ((_c = globalThis.process) == null ? void 0 : _c.type) != "renderer", We = !Be && !z && !ce;
    if (z) {
      const { createRequire: e } = await Un(() => import("./__vite-browser-external-D7Ct-6yo.js").then((r) => r._), []);
      var le = e(import.meta.url);
    }
    var ke = "./this.program", Fe = import.meta.url, de = "";
    function pr(e) {
      return d.locateFile ? d.locateFile(e, de) : de + e;
    }
    var fe, K;
    if (z) {
      if (!(((_e2 = (_d = globalThis.process) == null ? void 0 : _d.versions) == null ? void 0 : _e2.node) && ((_f = globalThis.process) == null ? void 0 : _f.type) != "renderer")) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
      var be = le("fs");
      Fe.startsWith("file:") && (de = le("path").dirname(le("url").fileURLToPath(Fe)) + "/"), K = (r) => {
        r = Q(r) ? new URL(r) : r;
        var t = be.readFileSync(r);
        return u(Buffer.isBuffer(t)), t;
      }, fe = async (r, t = true) => {
        r = Q(r) ? new URL(r) : r;
        var n = be.readFileSync(r, t ? void 0 : "utf8");
        return u(t ? Buffer.isBuffer(n) : typeof n == "string"), n;
      }, process.argv.length > 1 && (ke = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2);
    } else if (!We) if (Be || ce) {
      try {
        de = new URL(".", Fe).href;
      } catch {
      }
      if (!(globalThis.window || globalThis.WorkerGlobalScope)) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
      ce && (K = (e) => {
        var r = new XMLHttpRequest();
        return r.open("GET", e, false), r.responseType = "arraybuffer", r.send(null), new Uint8Array(r.response);
      }), fe = async (e) => {
        if (Q(e)) return new Promise((t, n) => {
          var o = new XMLHttpRequest();
          o.open("GET", e, true), o.responseType = "arraybuffer", o.onload = () => {
            if (o.status == 200 || o.status == 0 && o.response) {
              t(o.response);
              return;
            }
            n(o.status);
          }, o.onerror = n, o.send(null);
        });
        var r = await fetch(e, {
          credentials: "same-origin"
        });
        if (r.ok) return r.arrayBuffer();
        throw new Error(r.status + " : " + r.url);
      };
    } else throw new Error("environment detection error");
    var ue = console.log.bind(console), M = console.error.bind(console);
    u(!We, "shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.");
    var J;
    globalThis.WebAssembly || M("no native wasm support detected");
    var _e = false;
    function u(e, r) {
      e || T("Assertion failed" + (r ? ": " + r : ""));
    }
    var Q = (e) => e.startsWith("file://");
    function gr() {
      var e = Ie();
      u((e & 3) == 0), e == 0 && (e += 4), F[e >> 2] = 34821223, F[e + 4 >> 2] = 2310721022, F[0] = 1668509029;
    }
    function Te() {
      if (!_e) {
        var e = Ie();
        e == 0 && (e += 4);
        var r = F[e >> 2], t = F[e + 4 >> 2];
        (r != 34821223 || t != 2310721022) && T(`Stack overflow! Stack cookie has been overwritten at ${re(e)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${re(t)} ${re(r)}`), F[0] != 1668509029 && T("Runtime error: The application has corrupted its heap memory area (address zero)!");
      }
    }
    class g extends Error {
    }
    class Ae extends g {
      constructor(r) {
        super(r), this.excPtr = r;
        const t = ir(r);
        this.name = t[0], this.message = t[1];
      }
    }
    (() => {
      var e = new Int16Array(1), r = new Int8Array(e.buffer);
      e[0] = 25459, (r[0] !== 115 || r[1] !== 99) && T("Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)");
    })();
    function me(e) {
      Object.getOwnPropertyDescriptor(d, e) || Object.defineProperty(d, e, {
        configurable: true,
        set() {
          T(`Attempt to set \`Module.${e}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`);
        }
      });
    }
    function b(e) {
      return () => u(false, `call to '${e}' via reference taken before Wasm module initialization`);
    }
    function yr(e) {
      Object.getOwnPropertyDescriptor(d, e) && T(`\`Module.${e}\` was supplied but \`${e}\` not included in INCOMING_MODULE_JS_API`);
    }
    function Er(e) {
      return e === "FS_createPath" || e === "FS_createDataFile" || e === "FS_createPreloadedFile" || e === "FS_preloadFile" || e === "FS_unlink" || e === "addRunDependency" || e === "FS_createLazyFile" || e === "FS_createDevice" || e === "removeRunDependency";
    }
    function wr(e) {
      ze(e);
    }
    function ze(e) {
      Object.getOwnPropertyDescriptor(d, e) || Object.defineProperty(d, e, {
        configurable: true,
        get() {
          var r = `'${e}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
          Er(e) && (r += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"), T(r);
        }
      });
    }
    var je, He, x, Z, ve, F, I, ee = false;
    function $e() {
      var e = Ee.buffer;
      x = new Int8Array(e), d.HEAPU8 = Z = new Uint8Array(e), ve = new Int32Array(e), d.HEAPU32 = F = new Uint32Array(e), d.HEAPF64 = new Float64Array(e), I = new BigInt64Array(e), new BigUint64Array(e);
    }
    u(globalThis.Int32Array && globalThis.Float64Array && Int32Array.prototype.subarray && Int32Array.prototype.set, "JS engine does not provide full typed array support");
    function Sr() {
      if (d.preRun) for (typeof d.preRun == "function" && (d.preRun = [
        d.preRun
      ]); d.preRun.length; ) Or(d.preRun.shift());
      me("preRun"), Ge(qe);
    }
    function kr() {
      u(!ee), ee = true, Te(), !d.noFSInit && !i.initialized && i.init(), Y.__wasm_call_ctors(), i.ignorePermissions = false;
    }
    function Fr() {
      if (Te(), d.postRun) for (typeof d.postRun == "function" && (d.postRun = [
        d.postRun
      ]); d.postRun.length; ) Mr(d.postRun.shift());
      me("postRun"), Ge(Ve);
    }
    function T(e) {
      var _a2;
      (_a2 = d.onAbort) == null ? void 0 : _a2.call(d, e), e = "Aborted(" + e + ")", M(e), _e = true;
      var r = new WebAssembly.RuntimeError(e);
      throw He == null ? void 0 : He(r), r;
    }
    function D(e, r) {
      return (...t) => {
        u(ee, `native function \`${e}\` called before runtime initialization`);
        var n = Y[e];
        return u(n, `exported native function \`${e}\` not found`), u(t.length <= r, `native function \`${e}\` called with ${t.length} args but expects ${r}`), n(...t);
      };
    }
    var Pe;
    function br() {
      return d.locateFile ? pr("deform.wasm") : new URL("/hekatan-struct-lineal/assets/deform-CEFQQr_7.wasm", import.meta.url).href;
    }
    function Tr(e) {
      if (e == Pe && J) return new Uint8Array(J);
      if (K) return K(e);
      throw "both async and sync fetching of the wasm failed";
    }
    async function Ar(e) {
      if (!J) try {
        var r = await fe(e);
        return new Uint8Array(r);
      } catch {
      }
      return Tr(e);
    }
    async function Pr(e, r) {
      try {
        var t = await Ar(e), n = await WebAssembly.instantiate(t, r);
        return n;
      } catch (o) {
        M(`failed to asynchronously prepare wasm: ${o}`), Q(e) && M(`warning: Loading from a file URI (${e}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`), T(o);
      }
    }
    async function Rr(e, r, t) {
      if (!e && !Q(r) && !z) try {
        var n = fetch(r, {
          credentials: "same-origin"
        }), o = await WebAssembly.instantiateStreaming(n, t);
        return o;
      } catch (a) {
        M(`wasm streaming compile failed: ${a}`), M("falling back to ArrayBuffer instantiation");
      }
      return Pr(r, t);
    }
    function Nr() {
      var e = {
        env: vr,
        wasi_snapshot_preview1: vr
      };
      return e;
    }
    async function Dr() {
      function e(s, c) {
        return Y = s.exports, Nt(Y), $e(), Y;
      }
      var r = d;
      function t(s) {
        return u(d === r, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?"), r = null, e(s.instance);
      }
      var n = Nr();
      if (d.instantiateWasm) return new Promise((s, c) => {
        try {
          d.instantiateWasm(n, (l, f) => {
            s(e(l, f));
          });
        } catch (l) {
          M(`Module.instantiateWasm callback failed with error: ${l}`), c(l);
        }
      });
      Pe ?? (Pe = br());
      var o = await Rr(J, Pe, n), a = t(o);
      return a;
    }
    var Ge = (e) => {
      for (; e.length > 0; ) e.shift()(d);
    }, Ve = [], Mr = (e) => Ve.push(e), qe = [], Or = (e) => qe.push(e), re = (e) => (u(typeof e == "number", `ptrToString expects a number, got ${typeof e}`), e >>>= 0, "0x" + e.toString(16).padStart(8, "0")), y = (e) => lr(e), E = () => fr(), te = (e) => {
      te.shown || (te.shown = {}), te.shown[e] || (te.shown[e] = 1, z && (e = "warning: " + e), M(e));
    }, Ye = globalThis.TextDecoder && new TextDecoder(), Cr = (e, r, t, n) => {
      for (var o = r + t; e[r] && !(r >= o); ) ++r;
      return r;
    }, G = (e, r = 0, t, n) => {
      var o = Cr(e, r, t);
      if (o - r > 16 && e.buffer && Ye) return Ye.decode(e.subarray(r, o));
      for (var a = ""; r < o; ) {
        var s = e[r++];
        if (!(s & 128)) {
          a += String.fromCharCode(s);
          continue;
        }
        var c = e[r++] & 63;
        if ((s & 224) == 192) {
          a += String.fromCharCode((s & 31) << 6 | c);
          continue;
        }
        var l = e[r++] & 63;
        if ((s & 240) == 224 ? s = (s & 15) << 12 | c << 6 | l : ((s & 248) != 240 && te("Invalid UTF-8 leading byte " + re(s) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!"), s = (s & 7) << 18 | c << 12 | l << 6 | e[r++] & 63), s < 65536) a += String.fromCharCode(s);
        else {
          var f = s - 65536;
          a += String.fromCharCode(55296 | f >> 10, 56320 | f & 1023);
        }
      }
      return a;
    }, j = (e, r, t) => (u(typeof e == "number", `UTF8ToString expects a number (got ${typeof e})`), e ? G(Z, e, r) : ""), Ir = (e, r, t, n) => T(`Assertion failed: ${j(e)}, at: ` + [
      r ? j(r) : "unknown filename",
      t,
      n ? j(n) : "unknown function"
    ]), ne = [], he = 0, xr = (e) => {
      var r = new Re(e);
      return r.get_caught() || (r.set_caught(true), he--), r.set_rethrown(false), ne.push(r), mr(e);
    }, U = 0, Lr = () => {
      p(0, 0), u(ne.length > 0);
      var e = ne.pop();
      xe(e.excPtr), U = 0;
    };
    class Re {
      constructor(r) {
        this.excPtr = r, this.ptr = r - 24;
      }
      set_type(r) {
        F[this.ptr + 4 >> 2] = r;
      }
      get_type() {
        return F[this.ptr + 4 >> 2];
      }
      set_destructor(r) {
        F[this.ptr + 8 >> 2] = r;
      }
      get_destructor() {
        return F[this.ptr + 8 >> 2];
      }
      set_caught(r) {
        r = r ? 1 : 0, x[this.ptr + 12] = r;
      }
      get_caught() {
        return x[this.ptr + 12] != 0;
      }
      set_rethrown(r) {
        r = r ? 1 : 0, x[this.ptr + 13] = r;
      }
      get_rethrown() {
        return x[this.ptr + 13] != 0;
      }
      init(r, t) {
        this.set_adjusted_ptr(0), this.set_type(r), this.set_destructor(t);
      }
      set_adjusted_ptr(r) {
        F[this.ptr + 16 >> 2] = r;
      }
      get_adjusted_ptr() {
        return F[this.ptr + 16 >> 2];
      }
    }
    var pe = (e) => sr(e), Xe = (e) => {
      var r = U == null ? void 0 : U.excPtr;
      if (!r) return pe(0), 0;
      var t = new Re(r);
      t.set_adjusted_ptr(r);
      var n = t.get_type();
      if (!n) return pe(0), r;
      for (var o of e) {
        if (o === 0 || o === n) break;
        var a = t.ptr + 16;
        if (_r(o, n, a)) return pe(o), r;
      }
      return pe(n), r;
    }, Ur = () => Xe([]), Br = (e) => Xe([
      e
    ]), Wr = () => {
      var e = ne.pop();
      e || T("no exception to throw");
      var r = e.excPtr;
      throw e.get_rethrown() || (ne.push(e), e.set_rethrown(true), e.set_caught(false), he++), ye(r), U = new Ae(r), U;
    }, zr = (e, r, t) => {
      var n = new Re(e);
      throw n.init(r, t), ye(e), U = new Ae(e), he++, U;
    }, jr = () => he, Hr = (e) => {
      throw U || (U = new Ae(e)), U;
    }, $r = () => T("native code called abort()"), Ke = (e, r, t, n) => {
      if (u(typeof e == "string", `stringToUTF8Array expects a string (got ${typeof e})`), !(n > 0)) return 0;
      for (var o = t, a = t + n - 1, s = 0; s < e.length; ++s) {
        var c = e.codePointAt(s);
        if (c <= 127) {
          if (t >= a) break;
          r[t++] = c;
        } else if (c <= 2047) {
          if (t + 1 >= a) break;
          r[t++] = 192 | c >> 6, r[t++] = 128 | c & 63;
        } else if (c <= 65535) {
          if (t + 2 >= a) break;
          r[t++] = 224 | c >> 12, r[t++] = 128 | c >> 6 & 63, r[t++] = 128 | c & 63;
        } else {
          if (t + 3 >= a) break;
          c > 1114111 && te("Invalid Unicode code point " + re(c) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF)."), r[t++] = 240 | c >> 18, r[t++] = 128 | c >> 12 & 63, r[t++] = 128 | c >> 6 & 63, r[t++] = 128 | c & 63, s++;
        }
      }
      return r[t] = 0, t - o;
    }, ie = (e, r, t) => (u(typeof t == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!"), Ke(e, Z, r, t)), ge = (e) => {
      for (var r = 0, t = 0; t < e.length; ++t) {
        var n = e.charCodeAt(t);
        n <= 127 ? r++ : n <= 2047 ? r += 2 : n >= 55296 && n <= 57343 ? (r += 4, ++t) : r += 3;
      }
      return r;
    }, Gr = (e, r, t, n) => {
      var o = (/* @__PURE__ */ new Date()).getFullYear(), a = new Date(o, 0, 1), s = new Date(o, 6, 1), c = a.getTimezoneOffset(), l = s.getTimezoneOffset(), f = Math.max(c, l);
      F[e >> 2] = f * 60, ve[r >> 2] = +(c != l);
      var m = (h) => {
        var S = h >= 0 ? "-" : "+", P = Math.abs(h), N = String(Math.floor(P / 60)).padStart(2, "0"), R = String(P % 60).padStart(2, "0");
        return `UTC${S}${N}${R}`;
      }, v = m(c), _ = m(l);
      u(v), u(_), u(ge(v) <= 16, `timezone name truncated to fit in TZNAME_MAX (${v})`), u(ge(_) <= 16, `timezone name truncated to fit in TZNAME_MAX (${_})`), l < c ? (ie(v, t, 17), ie(_, n, 17)) : (ie(v, n, 17), ie(_, t, 17));
    }, Vr = () => performance.now(), qr = () => Date.now(), Yr = (e) => e >= 0 && e <= 3, Xr = 9007199254740992, Kr = -9007199254740992, Jr = (e) => e < Kr || e > Xr ? NaN : Number(e);
    function Qr(e, r, t) {
      if (!Yr(e)) return 28;
      var n;
      e === 0 ? n = qr() : n = Vr();
      var o = Math.round(n * 1e3 * 1e3);
      return I[t >> 3] = BigInt(o), 0;
    }
    var Zr = () => 2147483648, et = (e, r) => (u(r, "alignment argument is required"), Math.ceil(e / r) * r), rt = (e) => {
      var r = Ee.buffer.byteLength, t = (e - r + 65535) / 65536 | 0;
      try {
        return Ee.grow(t), $e(), 1;
      } catch (n) {
        M(`growMemory: Attempted to grow heap from ${r} bytes to ${e} bytes, but got error: ${n}`);
      }
    }, tt = (e) => {
      var r = Z.length;
      e >>>= 0, u(e > r);
      var t = Zr();
      if (e > t) return M(`Cannot enlarge memory, requested ${e} bytes, but the limit is ${t} bytes!`), false;
      for (var n = 1; n <= 4; n *= 2) {
        var o = r * (1 + 0.2 / n);
        o = Math.min(o, e + 100663296);
        var a = Math.min(t, et(Math.max(e, o), 65536)), s = rt(a);
        if (s) return true;
      }
      return M(`Failed to grow the heap from ${r} bytes to ${a} bytes, not enough memory!`), false;
    }, Ne = {}, nt = () => ke || "./this.program", oe = () => {
      var _a2;
      if (!oe.strings) {
        var e = (((_a2 = globalThis.navigator) == null ? void 0 : _a2.language) ?? "C").replace("-", "_") + ".UTF-8", r = {
          USER: "web_user",
          LOGNAME: "web_user",
          PATH: "/",
          PWD: "/",
          HOME: "/home/web_user",
          LANG: e,
          _: nt()
        };
        for (var t in Ne) Ne[t] === void 0 ? delete r[t] : r[t] = Ne[t];
        var n = [];
        for (var t in r) n.push(`${t}=${r[t]}`);
        oe.strings = n;
      }
      return oe.strings;
    }, it = (e, r) => {
      var t = 0, n = 0;
      for (var o of oe()) {
        var a = r + t;
        F[e + n >> 2] = a, t += ie(o, a, 1 / 0) + 1, n += 4;
      }
      return 0;
    }, ot = (e, r) => {
      var t = oe();
      F[e >> 2] = t.length;
      var n = 0;
      for (var o of t) n += ge(o) + 1;
      return F[r >> 2] = n, 0;
    }, A = {
      isAbs: (e) => e.charAt(0) === "/",
      splitPath: (e) => {
        var r = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return r.exec(e).slice(1);
      },
      normalizeArray: (e, r) => {
        for (var t = 0, n = e.length - 1; n >= 0; n--) {
          var o = e[n];
          o === "." ? e.splice(n, 1) : o === ".." ? (e.splice(n, 1), t++) : t && (e.splice(n, 1), t--);
        }
        if (r) for (; t; t--) e.unshift("..");
        return e;
      },
      normalize: (e) => {
        var r = A.isAbs(e), t = e.slice(-1) === "/";
        return e = A.normalizeArray(e.split("/").filter((n) => !!n), !r).join("/"), !e && !r && (e = "."), e && t && (e += "/"), (r ? "/" : "") + e;
      },
      dirname: (e) => {
        var r = A.splitPath(e), t = r[0], n = r[1];
        return !t && !n ? "." : (n && (n = n.slice(0, -1)), t + n);
      },
      basename: (e) => e && e.match(/([^\/]+|\/)\/*$/)[1],
      join: (...e) => A.normalize(e.join("/")),
      join2: (e, r) => A.normalize(e + "/" + r)
    }, at = () => {
      if (z) {
        var e = le("crypto");
        return (r) => e.randomFillSync(r);
      }
      return (r) => crypto.getRandomValues(r);
    }, Je = (e) => {
      (Je = at())(e);
    }, V = {
      resolve: (...e) => {
        for (var r = "", t = false, n = e.length - 1; n >= -1 && !t; n--) {
          var o = n >= 0 ? e[n] : i.cwd();
          if (typeof o != "string") throw new TypeError("Arguments to path.resolve must be strings");
          if (!o) return "";
          r = o + "/" + r, t = A.isAbs(o);
        }
        return r = A.normalizeArray(r.split("/").filter((a) => !!a), !t).join("/"), (t ? "/" : "") + r || ".";
      },
      relative: (e, r) => {
        e = V.resolve(e).slice(1), r = V.resolve(r).slice(1);
        function t(f) {
          for (var m = 0; m < f.length && f[m] === ""; m++) ;
          for (var v = f.length - 1; v >= 0 && f[v] === ""; v--) ;
          return m > v ? [] : f.slice(m, v - m + 1);
        }
        for (var n = t(e.split("/")), o = t(r.split("/")), a = Math.min(n.length, o.length), s = a, c = 0; c < a; c++) if (n[c] !== o[c]) {
          s = c;
          break;
        }
        for (var l = [], c = s; c < n.length; c++) l.push("..");
        return l = l.concat(o.slice(s)), l.join("/");
      }
    }, De = [], Me = (e, r, t) => {
      var n = ge(e) + 1, o = new Array(n), a = Ke(e, o, 0, o.length);
      return o.length = a, o;
    }, st = () => {
      var _a2;
      if (!De.length) {
        var e = null;
        if (z) {
          var r = 256, t = Buffer.alloc(r), n = 0, o = process.stdin.fd;
          try {
            n = be.readSync(o, t, 0, r);
          } catch (a) {
            if (a.toString().includes("EOF")) n = 0;
            else throw a;
          }
          n > 0 && (e = t.slice(0, n).toString("utf-8"));
        } else ((_a2 = globalThis.window) == null ? void 0 : _a2.prompt) && (e = window.prompt("Input: "), e !== null && (e += `
`));
        if (!e) return null;
        De = Me(e);
      }
      return De.shift();
    }, H = {
      ttys: [],
      init() {
      },
      shutdown() {
      },
      register(e, r) {
        H.ttys[e] = {
          input: [],
          output: [],
          ops: r
        }, i.registerDevice(e, H.stream_ops);
      },
      stream_ops: {
        open(e) {
          var r = H.ttys[e.node.rdev];
          if (!r) throw new i.ErrnoError(43);
          e.tty = r, e.seekable = false;
        },
        close(e) {
          e.tty.ops.fsync(e.tty);
        },
        fsync(e) {
          e.tty.ops.fsync(e.tty);
        },
        read(e, r, t, n, o) {
          if (!e.tty || !e.tty.ops.get_char) throw new i.ErrnoError(60);
          for (var a = 0, s = 0; s < n; s++) {
            var c;
            try {
              c = e.tty.ops.get_char(e.tty);
            } catch {
              throw new i.ErrnoError(29);
            }
            if (c === void 0 && a === 0) throw new i.ErrnoError(6);
            if (c == null) break;
            a++, r[t + s] = c;
          }
          return a && (e.node.atime = Date.now()), a;
        },
        write(e, r, t, n, o) {
          if (!e.tty || !e.tty.ops.put_char) throw new i.ErrnoError(60);
          try {
            for (var a = 0; a < n; a++) e.tty.ops.put_char(e.tty, r[t + a]);
          } catch {
            throw new i.ErrnoError(29);
          }
          return n && (e.node.mtime = e.node.ctime = Date.now()), a;
        }
      },
      default_tty_ops: {
        get_char(e) {
          return st();
        },
        put_char(e, r) {
          r === null || r === 10 ? (ue(G(e.output)), e.output = []) : r != 0 && e.output.push(r);
        },
        fsync(e) {
          var _a2;
          ((_a2 = e.output) == null ? void 0 : _a2.length) > 0 && (ue(G(e.output)), e.output = []);
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
          r === null || r === 10 ? (M(G(e.output)), e.output = []) : r != 0 && e.output.push(r);
        },
        fsync(e) {
          var _a2;
          ((_a2 = e.output) == null ? void 0 : _a2.length) > 0 && (M(G(e.output)), e.output = []);
        }
      }
    }, Qe = (e) => {
      T("internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported");
    }, k = {
      ops_table: null,
      mount(e) {
        return k.createNode(null, "/", 16895, 0);
      },
      createNode(e, r, t, n) {
        if (i.isBlkdev(t) || i.isFIFO(t)) throw new i.ErrnoError(63);
        k.ops_table || (k.ops_table = {
          dir: {
            node: {
              getattr: k.node_ops.getattr,
              setattr: k.node_ops.setattr,
              lookup: k.node_ops.lookup,
              mknod: k.node_ops.mknod,
              rename: k.node_ops.rename,
              unlink: k.node_ops.unlink,
              rmdir: k.node_ops.rmdir,
              readdir: k.node_ops.readdir,
              symlink: k.node_ops.symlink
            },
            stream: {
              llseek: k.stream_ops.llseek
            }
          },
          file: {
            node: {
              getattr: k.node_ops.getattr,
              setattr: k.node_ops.setattr
            },
            stream: {
              llseek: k.stream_ops.llseek,
              read: k.stream_ops.read,
              write: k.stream_ops.write,
              mmap: k.stream_ops.mmap,
              msync: k.stream_ops.msync
            }
          },
          link: {
            node: {
              getattr: k.node_ops.getattr,
              setattr: k.node_ops.setattr,
              readlink: k.node_ops.readlink
            },
            stream: {}
          },
          chrdev: {
            node: {
              getattr: k.node_ops.getattr,
              setattr: k.node_ops.setattr
            },
            stream: i.chrdev_stream_ops
          }
        });
        var o = i.createNode(e, r, t, n);
        return i.isDir(o.mode) ? (o.node_ops = k.ops_table.dir.node, o.stream_ops = k.ops_table.dir.stream, o.contents = {}) : i.isFile(o.mode) ? (o.node_ops = k.ops_table.file.node, o.stream_ops = k.ops_table.file.stream, o.usedBytes = 0, o.contents = null) : i.isLink(o.mode) ? (o.node_ops = k.ops_table.link.node, o.stream_ops = k.ops_table.link.stream) : i.isChrdev(o.mode) && (o.node_ops = k.ops_table.chrdev.node, o.stream_ops = k.ops_table.chrdev.stream), o.atime = o.mtime = o.ctime = Date.now(), e && (e.contents[r] = o, e.atime = e.mtime = e.ctime = o.atime), o;
      },
      getFileDataAsTypedArray(e) {
        return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0);
      },
      expandFileStorage(e, r) {
        var t = e.contents ? e.contents.length : 0;
        if (!(t >= r)) {
          var n = 1024 * 1024;
          r = Math.max(r, t * (t < n ? 2 : 1.125) >>> 0), t != 0 && (r = Math.max(r, 256));
          var o = e.contents;
          e.contents = new Uint8Array(r), e.usedBytes > 0 && e.contents.set(o.subarray(0, e.usedBytes), 0);
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
          return r.dev = i.isChrdev(e.mode) ? e.id : 1, r.ino = e.id, r.mode = e.mode, r.nlink = 1, r.uid = 0, r.gid = 0, r.rdev = e.rdev, i.isDir(e.mode) ? r.size = 4096 : i.isFile(e.mode) ? r.size = e.usedBytes : i.isLink(e.mode) ? r.size = e.link.length : r.size = 0, r.atime = new Date(e.atime), r.mtime = new Date(e.mtime), r.ctime = new Date(e.ctime), r.blksize = 4096, r.blocks = Math.ceil(r.size / r.blksize), r;
        },
        setattr(e, r) {
          for (const t of [
            "mode",
            "atime",
            "mtime",
            "ctime"
          ]) r[t] != null && (e[t] = r[t]);
          r.size !== void 0 && k.resizeFileStorage(e, r.size);
        },
        lookup(e, r) {
          throw new i.ErrnoError(44);
        },
        mknod(e, r, t, n) {
          return k.createNode(e, r, t, n);
        },
        rename(e, r, t) {
          var n;
          try {
            n = i.lookupNode(r, t);
          } catch {
          }
          if (n) {
            if (i.isDir(e.mode)) for (var o in n.contents) throw new i.ErrnoError(55);
            i.hashRemoveNode(n);
          }
          delete e.parent.contents[e.name], r.contents[t] = e, e.name = t, r.ctime = r.mtime = e.parent.ctime = e.parent.mtime = Date.now();
        },
        unlink(e, r) {
          delete e.contents[r], e.ctime = e.mtime = Date.now();
        },
        rmdir(e, r) {
          var t = i.lookupNode(e, r);
          for (var n in t.contents) throw new i.ErrnoError(55);
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
          var n = k.createNode(e, r, 41471, 0);
          return n.link = t, n;
        },
        readlink(e) {
          if (!i.isLink(e.mode)) throw new i.ErrnoError(28);
          return e.link;
        }
      },
      stream_ops: {
        read(e, r, t, n, o) {
          var a = e.node.contents;
          if (o >= e.node.usedBytes) return 0;
          var s = Math.min(e.node.usedBytes - o, n);
          if (u(s >= 0), s > 8 && a.subarray) r.set(a.subarray(o, o + s), t);
          else for (var c = 0; c < s; c++) r[t + c] = a[o + c];
          return s;
        },
        write(e, r, t, n, o, a) {
          if (u(!(r instanceof ArrayBuffer)), r.buffer === x.buffer && (a = false), !n) return 0;
          var s = e.node;
          if (s.mtime = s.ctime = Date.now(), r.subarray && (!s.contents || s.contents.subarray)) {
            if (a) return u(o === 0, "canOwn must imply no weird position inside the file"), s.contents = r.subarray(t, t + n), s.usedBytes = n, n;
            if (s.usedBytes === 0 && o === 0) return s.contents = r.slice(t, t + n), s.usedBytes = n, n;
            if (o + n <= s.usedBytes) return s.contents.set(r.subarray(t, t + n), o), n;
          }
          if (k.expandFileStorage(s, o + n), s.contents.subarray && r.subarray) s.contents.set(r.subarray(t, t + n), o);
          else for (var c = 0; c < n; c++) s.contents[o + c] = r[t + c];
          return s.usedBytes = Math.max(s.usedBytes, o + n), n;
        },
        llseek(e, r, t) {
          var n = r;
          if (t === 1 ? n += e.position : t === 2 && i.isFile(e.node.mode) && (n += e.node.usedBytes), n < 0) throw new i.ErrnoError(28);
          return n;
        },
        mmap(e, r, t, n, o) {
          if (!i.isFile(e.node.mode)) throw new i.ErrnoError(43);
          var a, s, c = e.node.contents;
          if (!(o & 2) && c && c.buffer === x.buffer) s = false, a = c.byteOffset;
          else {
            if (s = true, a = Qe(), !a) throw new i.ErrnoError(48);
            c && ((t > 0 || t + r < c.length) && (c.subarray ? c = c.subarray(t, t + r) : c = Array.prototype.slice.call(c, t, t + r)), x.set(c, a));
          }
          return {
            ptr: a,
            allocated: s
          };
        },
        msync(e, r, t, n, o) {
          return k.stream_ops.write(e, r, 0, n, t, false), 0;
        }
      }
    }, ct = (e) => {
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
    }, Oe = (e, r) => {
      var t = 0;
      return e && (t |= 365), r && (t |= 146), t;
    }, lt = (e) => j(ar(e)), Ze = {
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
    }, dt = async (e) => {
      var r = await fe(e);
      return u(r, `Loading data file "${e}" failed (no arrayBuffer).`), new Uint8Array(r);
    }, ft = (...e) => i.createDataFile(...e), ut = (e) => {
      for (var r = e; ; ) {
        if (!q[e]) return e;
        e = r + Math.random();
      }
    }, $ = 0, ae = null, q = {}, B = null, _t = (e) => {
      var _a2;
      if ($--, (_a2 = d.monitorRunDependencies) == null ? void 0 : _a2.call(d, $), u(e, "removeRunDependency requires an ID"), u(q[e]), delete q[e], $ == 0 && (B !== null && (clearInterval(B), B = null), ae)) {
        var r = ae;
        ae = null, r();
      }
    }, mt = (e) => {
      var _a2, _b2;
      $++, (_a2 = d.monitorRunDependencies) == null ? void 0 : _a2.call(d, $), u(e, "addRunDependency requires an ID"), u(!q[e]), q[e] = 1, B === null && globalThis.setInterval && (B = setInterval(() => {
        if (_e) {
          clearInterval(B), B = null;
          return;
        }
        var r = false;
        for (var t in q) r || (r = true, M("still waiting on run dependencies:")), M(`dependency: ${t}`);
        r && M("(end of list)");
      }, 1e4), (_b2 = B.unref) == null ? void 0 : _b2.call(B));
    }, er = [], vt = async (e, r) => {
      typeof Browser < "u" && Browser.init();
      for (var t of er) if (t.canHandle(r)) return u(t.handle.constructor.name === "AsyncFunction", "Filesystem plugin handlers must be async functions (See #24914)"), t.handle(e, r);
      return e;
    }, rr = async (e, r, t, n, o, a, s, c) => {
      var l = r ? V.resolve(A.join2(e, r)) : e, f = ut(`cp ${l}`);
      mt(f);
      try {
        var m = t;
        typeof t == "string" && (m = await dt(t)), m = await vt(m, l), c == null ? void 0 : c(), a || ft(e, r, m, n, o, s);
      } finally {
        _t(f);
      }
    }, ht = (e, r, t, n, o, a, s, c, l, f) => {
      rr(e, r, t, n, o, c, l, f).then(a).catch(s);
    }, i = {
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
          super(ee ? lt(e) : "");
          __publicField(this, "name", "ErrnoError");
          this.errno = e;
          for (var r in Ze) if (Ze[r] === e) {
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
        constructor(e, r, t, n) {
          __publicField(this, "node_ops", {});
          __publicField(this, "stream_ops", {});
          __publicField(this, "readMode", 365);
          __publicField(this, "writeMode", 146);
          __publicField(this, "mounted", null);
          e || (e = this), this.parent = e, this.mount = e.mount, this.id = i.nextInode++, this.name = r, this.mode = t, this.rdev = n, this.atime = this.mtime = this.ctime = Date.now();
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
          return i.isDir(this.mode);
        }
        get isDevice() {
          return i.isChrdev(this.mode);
        }
      },
      lookupPath(e, r = {}) {
        if (!e) throw new i.ErrnoError(44);
        r.follow_mount ?? (r.follow_mount = true), A.isAbs(e) || (e = i.cwd() + "/" + e);
        e: for (var t = 0; t < 40; t++) {
          for (var n = e.split("/").filter((f) => !!f), o = i.root, a = "/", s = 0; s < n.length; s++) {
            var c = s === n.length - 1;
            if (c && r.parent) break;
            if (n[s] !== ".") {
              if (n[s] === "..") {
                if (a = A.dirname(a), i.isRoot(o)) {
                  e = a + "/" + n.slice(s + 1).join("/"), t--;
                  continue e;
                } else o = o.parent;
                continue;
              }
              a = A.join2(a, n[s]);
              try {
                o = i.lookupNode(o, n[s]);
              } catch (f) {
                if ((f == null ? void 0 : f.errno) === 44 && c && r.noent_okay) return {
                  path: a
                };
                throw f;
              }
              if (i.isMountpoint(o) && (!c || r.follow_mount) && (o = o.mounted.root), i.isLink(o.mode) && (!c || r.follow)) {
                if (!o.node_ops.readlink) throw new i.ErrnoError(52);
                var l = o.node_ops.readlink(o);
                A.isAbs(l) || (l = A.dirname(a) + "/" + l), e = l + "/" + n.slice(s + 1).join("/");
                continue e;
              }
            }
          }
          return {
            path: a,
            node: o
          };
        }
        throw new i.ErrnoError(32);
      },
      getPath(e) {
        for (var r; ; ) {
          if (i.isRoot(e)) {
            var t = e.mount.mountpoint;
            return r ? t[t.length - 1] !== "/" ? `${t}/${r}` : t + r : t;
          }
          r = r ? `${e.name}/${r}` : e.name, e = e.parent;
        }
      },
      hashName(e, r) {
        for (var t = 0, n = 0; n < r.length; n++) t = (t << 5) - t + r.charCodeAt(n) | 0;
        return (e + t >>> 0) % i.nameTable.length;
      },
      hashAddNode(e) {
        var r = i.hashName(e.parent.id, e.name);
        e.name_next = i.nameTable[r], i.nameTable[r] = e;
      },
      hashRemoveNode(e) {
        var r = i.hashName(e.parent.id, e.name);
        if (i.nameTable[r] === e) i.nameTable[r] = e.name_next;
        else for (var t = i.nameTable[r]; t; ) {
          if (t.name_next === e) {
            t.name_next = e.name_next;
            break;
          }
          t = t.name_next;
        }
      },
      lookupNode(e, r) {
        var t = i.mayLookup(e);
        if (t) throw new i.ErrnoError(t);
        for (var n = i.hashName(e.id, r), o = i.nameTable[n]; o; o = o.name_next) {
          var a = o.name;
          if (o.parent.id === e.id && a === r) return o;
        }
        return i.lookup(e, r);
      },
      createNode(e, r, t, n) {
        u(typeof e == "object");
        var o = new i.FSNode(e, r, t, n);
        return i.hashAddNode(o), o;
      },
      destroyNode(e) {
        i.hashRemoveNode(e);
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
        return i.ignorePermissions ? 0 : r.includes("r") && !(e.mode & 292) || r.includes("w") && !(e.mode & 146) || r.includes("x") && !(e.mode & 73) ? 2 : 0;
      },
      mayLookup(e) {
        if (!i.isDir(e.mode)) return 54;
        var r = i.nodePermissions(e, "x");
        return r || (e.node_ops.lookup ? 0 : 2);
      },
      mayCreate(e, r) {
        if (!i.isDir(e.mode)) return 54;
        try {
          var t = i.lookupNode(e, r);
          return 20;
        } catch {
        }
        return i.nodePermissions(e, "wx");
      },
      mayDelete(e, r, t) {
        var n;
        try {
          n = i.lookupNode(e, r);
        } catch (a) {
          return a.errno;
        }
        var o = i.nodePermissions(e, "wx");
        if (o) return o;
        if (t) {
          if (!i.isDir(n.mode)) return 54;
          if (i.isRoot(n) || i.getPath(n) === i.cwd()) return 10;
        } else if (i.isDir(n.mode)) return 31;
        return 0;
      },
      mayOpen(e, r) {
        return e ? i.isLink(e.mode) ? 32 : i.isDir(e.mode) && (i.flagsToPermissionString(r) !== "r" || r & 576) ? 31 : i.nodePermissions(e, i.flagsToPermissionString(r)) : 44;
      },
      checkOpExists(e, r) {
        if (!e) throw new i.ErrnoError(r);
        return e;
      },
      MAX_OPEN_FDS: 4096,
      nextfd() {
        for (var e = 0; e <= i.MAX_OPEN_FDS; e++) if (!i.streams[e]) return e;
        throw new i.ErrnoError(33);
      },
      getStreamChecked(e) {
        var r = i.getStream(e);
        if (!r) throw new i.ErrnoError(8);
        return r;
      },
      getStream: (e) => i.streams[e],
      createStream(e, r = -1) {
        return u(r >= -1), e = Object.assign(new i.FSStream(), e), r == -1 && (r = i.nextfd()), e.fd = r, i.streams[r] = e, e;
      },
      closeStream(e) {
        i.streams[e] = null;
      },
      dupStream(e, r = -1) {
        var _a2, _b2;
        var t = i.createStream(e, r);
        return (_b2 = (_a2 = t.stream_ops) == null ? void 0 : _a2.dup) == null ? void 0 : _b2.call(_a2, t), t;
      },
      doSetAttr(e, r, t) {
        var n = e == null ? void 0 : e.stream_ops.setattr, o = n ? e : r;
        n ?? (n = r.node_ops.setattr), i.checkOpExists(n, 63), n(o, t);
      },
      chrdev_stream_ops: {
        open(e) {
          var _a2, _b2;
          var r = i.getDevice(e.node.rdev);
          e.stream_ops = r.stream_ops, (_b2 = (_a2 = e.stream_ops).open) == null ? void 0 : _b2.call(_a2, e);
        },
        llseek() {
          throw new i.ErrnoError(70);
        }
      },
      major: (e) => e >> 8,
      minor: (e) => e & 255,
      makedev: (e, r) => e << 8 | r,
      registerDevice(e, r) {
        i.devices[e] = {
          stream_ops: r
        };
      },
      getDevice: (e) => i.devices[e],
      getMounts(e) {
        for (var r = [], t = [
          e
        ]; t.length; ) {
          var n = t.pop();
          r.push(n), t.push(...n.mounts);
        }
        return r;
      },
      syncfs(e, r) {
        typeof e == "function" && (r = e, e = false), i.syncFSRequests++, i.syncFSRequests > 1 && M(`warning: ${i.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
        var t = i.getMounts(i.root.mount), n = 0;
        function o(c) {
          return u(i.syncFSRequests > 0), i.syncFSRequests--, r(c);
        }
        function a(c) {
          if (c) return a.errored ? void 0 : (a.errored = true, o(c));
          ++n >= t.length && o(null);
        }
        for (var s of t) s.type.syncfs ? s.type.syncfs(s, e, a) : a(null);
      },
      mount(e, r, t) {
        if (typeof e == "string") throw e;
        var n = t === "/", o = !t, a;
        if (n && i.root) throw new i.ErrnoError(10);
        if (!n && !o) {
          var s = i.lookupPath(t, {
            follow_mount: false
          });
          if (t = s.path, a = s.node, i.isMountpoint(a)) throw new i.ErrnoError(10);
          if (!i.isDir(a.mode)) throw new i.ErrnoError(54);
        }
        var c = {
          type: e,
          opts: r,
          mountpoint: t,
          mounts: []
        }, l = e.mount(c);
        return l.mount = c, c.root = l, n ? i.root = l : a && (a.mounted = c, a.mount && a.mount.mounts.push(c)), l;
      },
      unmount(e) {
        var r = i.lookupPath(e, {
          follow_mount: false
        });
        if (!i.isMountpoint(r.node)) throw new i.ErrnoError(28);
        var t = r.node, n = t.mounted, o = i.getMounts(n);
        for (var [a, s] of Object.entries(i.nameTable)) for (; s; ) {
          var c = s.name_next;
          o.includes(s.mount) && i.destroyNode(s), s = c;
        }
        t.mounted = null;
        var l = t.mount.mounts.indexOf(n);
        u(l !== -1), t.mount.mounts.splice(l, 1);
      },
      lookup(e, r) {
        return e.node_ops.lookup(e, r);
      },
      mknod(e, r, t) {
        var n = i.lookupPath(e, {
          parent: true
        }), o = n.node, a = A.basename(e);
        if (!a) throw new i.ErrnoError(28);
        if (a === "." || a === "..") throw new i.ErrnoError(20);
        var s = i.mayCreate(o, a);
        if (s) throw new i.ErrnoError(s);
        if (!o.node_ops.mknod) throw new i.ErrnoError(63);
        return o.node_ops.mknod(o, a, r, t);
      },
      statfs(e) {
        return i.statfsNode(i.lookupPath(e, {
          follow: true
        }).node);
      },
      statfsStream(e) {
        return i.statfsNode(e.node);
      },
      statfsNode(e) {
        var r = {
          bsize: 4096,
          frsize: 4096,
          blocks: 1e6,
          bfree: 5e5,
          bavail: 5e5,
          files: i.nextInode,
          ffree: i.nextInode - 1,
          fsid: 42,
          flags: 2,
          namelen: 255
        };
        return e.node_ops.statfs && Object.assign(r, e.node_ops.statfs(e.mount.opts.root)), r;
      },
      create(e, r = 438) {
        return r &= 4095, r |= 32768, i.mknod(e, r, 0);
      },
      mkdir(e, r = 511) {
        return r &= 1023, r |= 16384, i.mknod(e, r, 0);
      },
      mkdirTree(e, r) {
        var t = e.split("/"), n = "";
        for (var o of t) if (o) {
          (n || A.isAbs(e)) && (n += "/"), n += o;
          try {
            i.mkdir(n, r);
          } catch (a) {
            if (a.errno != 20) throw a;
          }
        }
      },
      mkdev(e, r, t) {
        return typeof t > "u" && (t = r, r = 438), r |= 8192, i.mknod(e, r, t);
      },
      symlink(e, r) {
        if (!V.resolve(e)) throw new i.ErrnoError(44);
        var t = i.lookupPath(r, {
          parent: true
        }), n = t.node;
        if (!n) throw new i.ErrnoError(44);
        var o = A.basename(r), a = i.mayCreate(n, o);
        if (a) throw new i.ErrnoError(a);
        if (!n.node_ops.symlink) throw new i.ErrnoError(63);
        return n.node_ops.symlink(n, o, e);
      },
      rename(e, r) {
        var t = A.dirname(e), n = A.dirname(r), o = A.basename(e), a = A.basename(r), s, c, l;
        if (s = i.lookupPath(e, {
          parent: true
        }), c = s.node, s = i.lookupPath(r, {
          parent: true
        }), l = s.node, !c || !l) throw new i.ErrnoError(44);
        if (c.mount !== l.mount) throw new i.ErrnoError(75);
        var f = i.lookupNode(c, o), m = V.relative(e, n);
        if (m.charAt(0) !== ".") throw new i.ErrnoError(28);
        if (m = V.relative(r, t), m.charAt(0) !== ".") throw new i.ErrnoError(55);
        var v;
        try {
          v = i.lookupNode(l, a);
        } catch {
        }
        if (f !== v) {
          var _ = i.isDir(f.mode), h = i.mayDelete(c, o, _);
          if (h) throw new i.ErrnoError(h);
          if (h = v ? i.mayDelete(l, a, _) : i.mayCreate(l, a), h) throw new i.ErrnoError(h);
          if (!c.node_ops.rename) throw new i.ErrnoError(63);
          if (i.isMountpoint(f) || v && i.isMountpoint(v)) throw new i.ErrnoError(10);
          if (l !== c && (h = i.nodePermissions(c, "w"), h)) throw new i.ErrnoError(h);
          i.hashRemoveNode(f);
          try {
            c.node_ops.rename(f, l, a), f.parent = l;
          } catch (S) {
            throw S;
          } finally {
            i.hashAddNode(f);
          }
        }
      },
      rmdir(e) {
        var r = i.lookupPath(e, {
          parent: true
        }), t = r.node, n = A.basename(e), o = i.lookupNode(t, n), a = i.mayDelete(t, n, true);
        if (a) throw new i.ErrnoError(a);
        if (!t.node_ops.rmdir) throw new i.ErrnoError(63);
        if (i.isMountpoint(o)) throw new i.ErrnoError(10);
        t.node_ops.rmdir(t, n), i.destroyNode(o);
      },
      readdir(e) {
        var r = i.lookupPath(e, {
          follow: true
        }), t = r.node, n = i.checkOpExists(t.node_ops.readdir, 54);
        return n(t);
      },
      unlink(e) {
        var r = i.lookupPath(e, {
          parent: true
        }), t = r.node;
        if (!t) throw new i.ErrnoError(44);
        var n = A.basename(e), o = i.lookupNode(t, n), a = i.mayDelete(t, n, false);
        if (a) throw new i.ErrnoError(a);
        if (!t.node_ops.unlink) throw new i.ErrnoError(63);
        if (i.isMountpoint(o)) throw new i.ErrnoError(10);
        t.node_ops.unlink(t, n), i.destroyNode(o);
      },
      readlink(e) {
        var r = i.lookupPath(e), t = r.node;
        if (!t) throw new i.ErrnoError(44);
        if (!t.node_ops.readlink) throw new i.ErrnoError(28);
        return t.node_ops.readlink(t);
      },
      stat(e, r) {
        var t = i.lookupPath(e, {
          follow: !r
        }), n = t.node, o = i.checkOpExists(n.node_ops.getattr, 63);
        return o(n);
      },
      fstat(e) {
        var r = i.getStreamChecked(e), t = r.node, n = r.stream_ops.getattr, o = n ? r : t;
        return n ?? (n = t.node_ops.getattr), i.checkOpExists(n, 63), n(o);
      },
      lstat(e) {
        return i.stat(e, true);
      },
      doChmod(e, r, t, n) {
        i.doSetAttr(e, r, {
          mode: t & 4095 | r.mode & -4096,
          ctime: Date.now(),
          dontFollow: n
        });
      },
      chmod(e, r, t) {
        var n;
        if (typeof e == "string") {
          var o = i.lookupPath(e, {
            follow: !t
          });
          n = o.node;
        } else n = e;
        i.doChmod(null, n, r, t);
      },
      lchmod(e, r) {
        i.chmod(e, r, true);
      },
      fchmod(e, r) {
        var t = i.getStreamChecked(e);
        i.doChmod(t, t.node, r, false);
      },
      doChown(e, r, t) {
        i.doSetAttr(e, r, {
          timestamp: Date.now(),
          dontFollow: t
        });
      },
      chown(e, r, t, n) {
        var o;
        if (typeof e == "string") {
          var a = i.lookupPath(e, {
            follow: !n
          });
          o = a.node;
        } else o = e;
        i.doChown(null, o, n);
      },
      lchown(e, r, t) {
        i.chown(e, r, t, true);
      },
      fchown(e, r, t) {
        var n = i.getStreamChecked(e);
        i.doChown(n, n.node, false);
      },
      doTruncate(e, r, t) {
        if (i.isDir(r.mode)) throw new i.ErrnoError(31);
        if (!i.isFile(r.mode)) throw new i.ErrnoError(28);
        var n = i.nodePermissions(r, "w");
        if (n) throw new i.ErrnoError(n);
        i.doSetAttr(e, r, {
          size: t,
          timestamp: Date.now()
        });
      },
      truncate(e, r) {
        if (r < 0) throw new i.ErrnoError(28);
        var t;
        if (typeof e == "string") {
          var n = i.lookupPath(e, {
            follow: true
          });
          t = n.node;
        } else t = e;
        i.doTruncate(null, t, r);
      },
      ftruncate(e, r) {
        var t = i.getStreamChecked(e);
        if (r < 0 || !(t.flags & 2097155)) throw new i.ErrnoError(28);
        i.doTruncate(t, t.node, r);
      },
      utime(e, r, t) {
        var n = i.lookupPath(e, {
          follow: true
        }), o = n.node, a = i.checkOpExists(o.node_ops.setattr, 63);
        a(o, {
          atime: r,
          mtime: t
        });
      },
      open(e, r, t = 438) {
        if (e === "") throw new i.ErrnoError(44);
        r = typeof r == "string" ? ct(r) : r, r & 64 ? t = t & 4095 | 32768 : t = 0;
        var n, o;
        if (typeof e == "object") n = e;
        else {
          o = e.endsWith("/");
          var a = i.lookupPath(e, {
            follow: !(r & 131072),
            noent_okay: true
          });
          n = a.node, e = a.path;
        }
        var s = false;
        if (r & 64) if (n) {
          if (r & 128) throw new i.ErrnoError(20);
        } else {
          if (o) throw new i.ErrnoError(31);
          n = i.mknod(e, t | 511, 0), s = true;
        }
        if (!n) throw new i.ErrnoError(44);
        if (i.isChrdev(n.mode) && (r &= -513), r & 65536 && !i.isDir(n.mode)) throw new i.ErrnoError(54);
        if (!s) {
          var c = i.mayOpen(n, r);
          if (c) throw new i.ErrnoError(c);
        }
        r & 512 && !s && i.truncate(n, 0), r &= -131713;
        var l = i.createStream({
          node: n,
          path: i.getPath(n),
          flags: r,
          seekable: true,
          position: 0,
          stream_ops: n.stream_ops,
          ungotten: [],
          error: false
        });
        return l.stream_ops.open && l.stream_ops.open(l), s && i.chmod(n, t & 511), d.logReadFiles && !(r & 1) && (e in i.readFiles || (i.readFiles[e] = 1)), l;
      },
      close(e) {
        if (i.isClosed(e)) throw new i.ErrnoError(8);
        e.getdents && (e.getdents = null);
        try {
          e.stream_ops.close && e.stream_ops.close(e);
        } catch (r) {
          throw r;
        } finally {
          i.closeStream(e.fd);
        }
        e.fd = null;
      },
      isClosed(e) {
        return e.fd === null;
      },
      llseek(e, r, t) {
        if (i.isClosed(e)) throw new i.ErrnoError(8);
        if (!e.seekable || !e.stream_ops.llseek) throw new i.ErrnoError(70);
        if (t != 0 && t != 1 && t != 2) throw new i.ErrnoError(28);
        return e.position = e.stream_ops.llseek(e, r, t), e.ungotten = [], e.position;
      },
      read(e, r, t, n, o) {
        if (u(t >= 0), n < 0 || o < 0) throw new i.ErrnoError(28);
        if (i.isClosed(e)) throw new i.ErrnoError(8);
        if ((e.flags & 2097155) === 1) throw new i.ErrnoError(8);
        if (i.isDir(e.node.mode)) throw new i.ErrnoError(31);
        if (!e.stream_ops.read) throw new i.ErrnoError(28);
        var a = typeof o < "u";
        if (!a) o = e.position;
        else if (!e.seekable) throw new i.ErrnoError(70);
        var s = e.stream_ops.read(e, r, t, n, o);
        return a || (e.position += s), s;
      },
      write(e, r, t, n, o, a) {
        if (u(t >= 0), n < 0 || o < 0) throw new i.ErrnoError(28);
        if (i.isClosed(e)) throw new i.ErrnoError(8);
        if (!(e.flags & 2097155)) throw new i.ErrnoError(8);
        if (i.isDir(e.node.mode)) throw new i.ErrnoError(31);
        if (!e.stream_ops.write) throw new i.ErrnoError(28);
        e.seekable && e.flags & 1024 && i.llseek(e, 0, 2);
        var s = typeof o < "u";
        if (!s) o = e.position;
        else if (!e.seekable) throw new i.ErrnoError(70);
        var c = e.stream_ops.write(e, r, t, n, o, a);
        return s || (e.position += c), c;
      },
      mmap(e, r, t, n, o) {
        if (n & 2 && !(o & 2) && (e.flags & 2097155) !== 2) throw new i.ErrnoError(2);
        if ((e.flags & 2097155) === 1) throw new i.ErrnoError(2);
        if (!e.stream_ops.mmap) throw new i.ErrnoError(43);
        if (!r) throw new i.ErrnoError(28);
        return e.stream_ops.mmap(e, r, t, n, o);
      },
      msync(e, r, t, n, o) {
        return u(t >= 0), e.stream_ops.msync ? e.stream_ops.msync(e, r, t, n, o) : 0;
      },
      ioctl(e, r, t) {
        if (!e.stream_ops.ioctl) throw new i.ErrnoError(59);
        return e.stream_ops.ioctl(e, r, t);
      },
      readFile(e, r = {}) {
        r.flags = r.flags || 0, r.encoding = r.encoding || "binary", r.encoding !== "utf8" && r.encoding !== "binary" && T(`Invalid encoding type "${r.encoding}"`);
        var t = i.open(e, r.flags), n = i.stat(e), o = n.size, a = new Uint8Array(o);
        return i.read(t, a, 0, o, 0), r.encoding === "utf8" && (a = G(a)), i.close(t), a;
      },
      writeFile(e, r, t = {}) {
        t.flags = t.flags || 577;
        var n = i.open(e, t.flags, t.mode);
        typeof r == "string" && (r = new Uint8Array(Me(r))), ArrayBuffer.isView(r) ? i.write(n, r, 0, r.byteLength, void 0, t.canOwn) : T("Unsupported data type"), i.close(n);
      },
      cwd: () => i.currentPath,
      chdir(e) {
        var r = i.lookupPath(e, {
          follow: true
        });
        if (r.node === null) throw new i.ErrnoError(44);
        if (!i.isDir(r.node.mode)) throw new i.ErrnoError(54);
        var t = i.nodePermissions(r.node, "x");
        if (t) throw new i.ErrnoError(t);
        i.currentPath = r.path;
      },
      createDefaultDirectories() {
        i.mkdir("/tmp"), i.mkdir("/home"), i.mkdir("/home/web_user");
      },
      createDefaultDevices() {
        i.mkdir("/dev"), i.registerDevice(i.makedev(1, 3), {
          read: () => 0,
          write: (n, o, a, s, c) => s,
          llseek: () => 0
        }), i.mkdev("/dev/null", i.makedev(1, 3)), H.register(i.makedev(5, 0), H.default_tty_ops), H.register(i.makedev(6, 0), H.default_tty1_ops), i.mkdev("/dev/tty", i.makedev(5, 0)), i.mkdev("/dev/tty1", i.makedev(6, 0));
        var e = new Uint8Array(1024), r = 0, t = () => (r === 0 && (Je(e), r = e.byteLength), e[--r]);
        i.createDevice("/dev", "random", t), i.createDevice("/dev", "urandom", t), i.mkdir("/dev/shm"), i.mkdir("/dev/shm/tmp");
      },
      createSpecialDirectories() {
        i.mkdir("/proc");
        var e = i.mkdir("/proc/self");
        i.mkdir("/proc/self/fd"), i.mount({
          mount() {
            var r = i.createNode(e, "fd", 16895, 73);
            return r.stream_ops = {
              llseek: k.stream_ops.llseek
            }, r.node_ops = {
              lookup(t, n) {
                var o = +n, a = i.getStreamChecked(o), s = {
                  parent: null,
                  mount: {
                    mountpoint: "fake"
                  },
                  node_ops: {
                    readlink: () => a.path
                  },
                  id: o + 1
                };
                return s.parent = s, s;
              },
              readdir() {
                return Array.from(i.streams.entries()).filter(([t, n]) => n).map(([t, n]) => t.toString());
              }
            }, r;
          }
        }, {}, "/proc/self/fd");
      },
      createStandardStreams(e, r, t) {
        e ? i.createDevice("/dev", "stdin", e) : i.symlink("/dev/tty", "/dev/stdin"), r ? i.createDevice("/dev", "stdout", null, r) : i.symlink("/dev/tty", "/dev/stdout"), t ? i.createDevice("/dev", "stderr", null, t) : i.symlink("/dev/tty1", "/dev/stderr");
        var n = i.open("/dev/stdin", 0), o = i.open("/dev/stdout", 1), a = i.open("/dev/stderr", 1);
        u(n.fd === 0, `invalid handle for stdin (${n.fd})`), u(o.fd === 1, `invalid handle for stdout (${o.fd})`), u(a.fd === 2, `invalid handle for stderr (${a.fd})`);
      },
      staticInit() {
        i.nameTable = new Array(4096), i.mount(k, {}, "/"), i.createDefaultDirectories(), i.createDefaultDevices(), i.createSpecialDirectories(), i.filesystems = {
          MEMFS: k
        };
      },
      init(e, r, t) {
        u(!i.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"), i.initialized = true, e ?? (e = d.stdin), r ?? (r = d.stdout), t ?? (t = d.stderr), i.createStandardStreams(e, r, t);
      },
      quit() {
        i.initialized = false, or(0);
        for (var e of i.streams) e && i.close(e);
      },
      findObject(e, r) {
        var t = i.analyzePath(e, r);
        return t.exists ? t.object : null;
      },
      analyzePath(e, r) {
        try {
          var t = i.lookupPath(e, {
            follow: !r
          });
          e = t.path;
        } catch {
        }
        var n = {
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
          var t = i.lookupPath(e, {
            parent: true
          });
          n.parentExists = true, n.parentPath = t.path, n.parentObject = t.node, n.name = A.basename(e), t = i.lookupPath(e, {
            follow: !r
          }), n.exists = true, n.path = t.path, n.object = t.node, n.name = t.node.name, n.isRoot = t.path === "/";
        } catch (o) {
          n.error = o.errno;
        }
        return n;
      },
      createPath(e, r, t, n) {
        e = typeof e == "string" ? e : i.getPath(e);
        for (var o = r.split("/").reverse(); o.length; ) {
          var a = o.pop();
          if (a) {
            var s = A.join2(e, a);
            try {
              i.mkdir(s);
            } catch (c) {
              if (c.errno != 20) throw c;
            }
            e = s;
          }
        }
        return s;
      },
      createFile(e, r, t, n, o) {
        var a = A.join2(typeof e == "string" ? e : i.getPath(e), r), s = Oe(n, o);
        return i.create(a, s);
      },
      createDataFile(e, r, t, n, o, a) {
        var s = r;
        e && (e = typeof e == "string" ? e : i.getPath(e), s = r ? A.join2(e, r) : e);
        var c = Oe(n, o), l = i.create(s, c);
        if (t) {
          if (typeof t == "string") {
            for (var f = new Array(t.length), m = 0, v = t.length; m < v; ++m) f[m] = t.charCodeAt(m);
            t = f;
          }
          i.chmod(l, c | 146);
          var _ = i.open(l, 577);
          i.write(_, t, 0, t.length, 0, a), i.close(_), i.chmod(l, c);
        }
      },
      createDevice(e, r, t, n) {
        var _a2;
        var o = A.join2(typeof e == "string" ? e : i.getPath(e), r), a = Oe(!!t, !!n);
        (_a2 = i.createDevice).major ?? (_a2.major = 64);
        var s = i.makedev(i.createDevice.major++, 0);
        return i.registerDevice(s, {
          open(c) {
            c.seekable = false;
          },
          close(c) {
            var _a3;
            ((_a3 = n == null ? void 0 : n.buffer) == null ? void 0 : _a3.length) && n(10);
          },
          read(c, l, f, m, v) {
            for (var _ = 0, h = 0; h < m; h++) {
              var S;
              try {
                S = t();
              } catch {
                throw new i.ErrnoError(29);
              }
              if (S === void 0 && _ === 0) throw new i.ErrnoError(6);
              if (S == null) break;
              _++, l[f + h] = S;
            }
            return _ && (c.node.atime = Date.now()), _;
          },
          write(c, l, f, m, v) {
            for (var _ = 0; _ < m; _++) try {
              n(l[f + _]);
            } catch {
              throw new i.ErrnoError(29);
            }
            return m && (c.node.mtime = c.node.ctime = Date.now()), _;
          }
        }), i.mkdev(o, a, s);
      },
      forceLoadFile(e) {
        if (e.isDevice || e.isFolder || e.link || e.contents) return true;
        if (globalThis.XMLHttpRequest) T("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        else try {
          e.contents = K(e.url);
        } catch {
          throw new i.ErrnoError(29);
        }
      },
      createLazyFile(e, r, t, n, o) {
        class a {
          constructor() {
            __publicField(this, "lengthKnown", false);
            __publicField(this, "chunks", []);
          }
          get(_) {
            if (!(_ > this.length - 1 || _ < 0)) {
              var h = _ % this.chunkSize, S = _ / this.chunkSize | 0;
              return this.getter(S)[h];
            }
          }
          setDataGetter(_) {
            this.getter = _;
          }
          cacheLength() {
            var _ = new XMLHttpRequest();
            _.open("HEAD", t, false), _.send(null), _.status >= 200 && _.status < 300 || _.status === 304 || T("Couldn't load " + t + ". Status: " + _.status);
            var h = Number(_.getResponseHeader("Content-length")), S, P = (S = _.getResponseHeader("Accept-Ranges")) && S === "bytes", N = (S = _.getResponseHeader("Content-Encoding")) && S === "gzip", R = 1024 * 1024;
            P || (R = h);
            var C = (L, X) => {
              L > X && T("invalid range (" + L + ", " + X + ") or no bytes requested!"), X > h - 1 && T("only " + h + " bytes available! programmer error!");
              var O = new XMLHttpRequest();
              return O.open("GET", t, false), h !== R && O.setRequestHeader("Range", "bytes=" + L + "-" + X), O.responseType = "arraybuffer", O.overrideMimeType && O.overrideMimeType("text/plain; charset=x-user-defined"), O.send(null), O.status >= 200 && O.status < 300 || O.status === 304 || T("Couldn't load " + t + ". Status: " + O.status), O.response !== void 0 ? new Uint8Array(O.response || []) : Me(O.responseText || "");
            }, W = this;
            W.setDataGetter((L) => {
              var X = L * R, O = (L + 1) * R - 1;
              return O = Math.min(O, h - 1), typeof W.chunks[L] > "u" && (W.chunks[L] = C(X, O)), typeof W.chunks[L] > "u" && T("doXHR failed!"), W.chunks[L];
            }), (N || !h) && (R = h = 1, h = this.getter(0).length, R = h, ue("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = h, this._chunkSize = R, this.lengthKnown = true;
          }
          get length() {
            return this.lengthKnown || this.cacheLength(), this._length;
          }
          get chunkSize() {
            return this.lengthKnown || this.cacheLength(), this._chunkSize;
          }
        }
        if (globalThis.XMLHttpRequest) {
          ce || T("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
          var s = new a(), c = {
            isDevice: false,
            contents: s
          };
        } else var c = {
          isDevice: false,
          url: t
        };
        var l = i.createFile(e, r, c, n, o);
        c.contents ? l.contents = c.contents : c.url && (l.contents = null, l.url = c.url), Object.defineProperties(l, {
          usedBytes: {
            get: function() {
              return this.contents.length;
            }
          }
        });
        var f = {};
        for (const [v, _] of Object.entries(l.stream_ops)) f[v] = (...h) => (i.forceLoadFile(l), _(...h));
        function m(v, _, h, S, P) {
          var N = v.node.contents;
          if (P >= N.length) return 0;
          var R = Math.min(N.length - P, S);
          if (u(R >= 0), N.slice) for (var C = 0; C < R; C++) _[h + C] = N[P + C];
          else for (var C = 0; C < R; C++) _[h + C] = N.get(P + C);
          return R;
        }
        return f.read = (v, _, h, S, P) => (i.forceLoadFile(l), m(v, _, h, S, P)), f.mmap = (v, _, h, S, P) => {
          i.forceLoadFile(l);
          var N = Qe();
          if (!N) throw new i.ErrnoError(48);
          return m(v, x, N, _, h), {
            ptr: N,
            allocated: true
          };
        }, l.stream_ops = f, l;
      },
      absolutePath() {
        T("FS.absolutePath has been removed; use PATH_FS.resolve instead");
      },
      createFolder() {
        T("FS.createFolder has been removed; use FS.mkdir instead");
      },
      createLink() {
        T("FS.createLink has been removed; use FS.symlink instead");
      },
      joinPath() {
        T("FS.joinPath has been removed; use PATH.join instead");
      },
      mmapAlloc() {
        T("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
      },
      standardizePath() {
        T("FS.standardizePath has been removed; use PATH.normalize instead");
      }
    }, se = {
      calculateAt(e, r, t) {
        if (A.isAbs(r)) return r;
        var n;
        if (e === -100) n = i.cwd();
        else {
          var o = se.getStreamFromFD(e);
          n = o.path;
        }
        if (r.length == 0) {
          if (!t) throw new i.ErrnoError(44);
          return n;
        }
        return n + "/" + r;
      },
      writeStat(e, r) {
        F[e >> 2] = r.dev, F[e + 4 >> 2] = r.mode, F[e + 8 >> 2] = r.nlink, F[e + 12 >> 2] = r.uid, F[e + 16 >> 2] = r.gid, F[e + 20 >> 2] = r.rdev, I[e + 24 >> 3] = BigInt(r.size), ve[e + 32 >> 2] = 4096, ve[e + 36 >> 2] = r.blocks;
        var t = r.atime.getTime(), n = r.mtime.getTime(), o = r.ctime.getTime();
        return I[e + 40 >> 3] = BigInt(Math.floor(t / 1e3)), F[e + 48 >> 2] = t % 1e3 * 1e3 * 1e3, I[e + 56 >> 3] = BigInt(Math.floor(n / 1e3)), F[e + 64 >> 2] = n % 1e3 * 1e3 * 1e3, I[e + 72 >> 3] = BigInt(Math.floor(o / 1e3)), F[e + 80 >> 2] = o % 1e3 * 1e3 * 1e3, I[e + 88 >> 3] = BigInt(r.ino), 0;
      },
      writeStatFs(e, r) {
        F[e + 4 >> 2] = r.bsize, F[e + 60 >> 2] = r.bsize, I[e + 8 >> 3] = BigInt(r.blocks), I[e + 16 >> 3] = BigInt(r.bfree), I[e + 24 >> 3] = BigInt(r.bavail), I[e + 32 >> 3] = BigInt(r.files), I[e + 40 >> 3] = BigInt(r.ffree), F[e + 48 >> 2] = r.fsid, F[e + 64 >> 2] = r.flags, F[e + 56 >> 2] = r.namelen;
      },
      doMsync(e, r, t, n, o) {
        if (!i.isFile(r.node.mode)) throw new i.ErrnoError(43);
        if (n & 2) return 0;
        var a = Z.slice(e, e + t);
        i.msync(r, a, o, t, n);
      },
      getStreamFromFD(e) {
        var r = i.getStreamChecked(e);
        return r;
      },
      varargs: void 0,
      getStr(e) {
        var r = j(e);
        return r;
      }
    };
    function pt(e) {
      try {
        var r = se.getStreamFromFD(e);
        return i.close(r), 0;
      } catch (t) {
        if (typeof i > "u" || t.name !== "ErrnoError") throw t;
        return t.errno;
      }
    }
    var gt = (e, r, t, n) => {
      for (var o = 0, a = 0; a < t; a++) {
        var s = F[r >> 2], c = F[r + 4 >> 2];
        r += 8;
        var l = i.read(e, x, s, c, n);
        if (l < 0) return -1;
        if (o += l, l < c) break;
      }
      return o;
    };
    function yt(e, r, t, n) {
      try {
        var o = se.getStreamFromFD(e), a = gt(o, r, t);
        return F[n >> 2] = a, 0;
      } catch (s) {
        if (typeof i > "u" || s.name !== "ErrnoError") throw s;
        return s.errno;
      }
    }
    function Et(e, r, t, n) {
      r = Jr(r);
      try {
        if (isNaN(r)) return 61;
        var o = se.getStreamFromFD(e);
        return i.llseek(o, r, t), I[n >> 3] = BigInt(o.position), o.getdents && r === 0 && t === 0 && (o.getdents = null), 0;
      } catch (a) {
        if (typeof i > "u" || a.name !== "ErrnoError") throw a;
        return a.errno;
      }
    }
    var wt = (e, r, t, n) => {
      for (var o = 0, a = 0; a < t; a++) {
        var s = F[r >> 2], c = F[r + 4 >> 2];
        r += 8;
        var l = i.write(e, x, s, c, n);
        if (l < 0) return -1;
        if (o += l, l < c) break;
      }
      return o;
    };
    function St(e, r, t, n) {
      try {
        var o = se.getStreamFromFD(e), a = wt(o, r, t);
        return F[n >> 2] = a, 0;
      } catch (s) {
        if (typeof i > "u" || s.name !== "ErrnoError") throw s;
        return s.errno;
      }
    }
    var kt = (e) => e, tr = [], w = (e) => {
      var r = tr[e];
      return r || (tr[e] = r = Le.get(e)), u(Le.get(e) == r, "JavaScript-side Wasm function table mirror is out of date!"), r;
    }, Ft = (e) => ye(e), bt = (e) => xe(e), nr = (e) => dr(e), Tt = (e) => {
      var r = E(), t = nr(4), n = nr(4);
      ur(e, t, n);
      var o = F[t >> 2], a = F[n >> 2], s = j(o);
      Ce(o);
      var c;
      return a && (c = j(a), Ce(a)), y(r), [
        s,
        c
      ];
    }, ir = (e) => Tt(e);
    i.createPreloadedFile = ht, i.preloadFile = rr, i.staticInit();
    {
      if (d.noExitRuntime && d.noExitRuntime, d.preloadPlugins && (er = d.preloadPlugins), d.print && (ue = d.print), d.printErr && (M = d.printErr), d.wasmBinary && (J = d.wasmBinary), Rt(), d.arguments && d.arguments, d.thisProgram && (ke = d.thisProgram), u(typeof d.memoryInitializerPrefixURL > "u", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead"), u(typeof d.pthreadMainPrefixURL > "u", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead"), u(typeof d.cdInitializerPrefixURL > "u", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead"), u(typeof d.filePackagePrefixURL > "u", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead"), u(typeof d.read > "u", "Module.read option was removed"), u(typeof d.readAsync > "u", "Module.readAsync option was removed (modify readAsync in JS)"), u(typeof d.readBinary > "u", "Module.readBinary option was removed (modify readBinary in JS)"), u(typeof d.setWindowTitle > "u", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)"), u(typeof d.TOTAL_MEMORY > "u", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY"), u(typeof d.ENVIRONMENT > "u", "Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)"), u(typeof d.STACK_SIZE > "u", "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time"), u(typeof d.wasmMemory > "u", "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally"), u(typeof d.INITIAL_MEMORY > "u", "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically"), d.preInit) for (typeof d.preInit == "function" && (d.preInit = [
        d.preInit
      ]); d.preInit.length > 0; ) d.preInit.shift()();
      me("preInit");
    }
    var At = [
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
      "getTempRet0",
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
    At.forEach(wr);
    var Pt = [
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
      "stackAlloc",
      "setTempRet0",
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
      "findMatchingCatch",
      "getExceptionMessageCommon",
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
    Pt.forEach(ze), d.incrementExceptionRefcount = Ft, d.decrementExceptionRefcount = bt, d.getExceptionMessage = ir;
    function Rt() {
      yr("fetchSettings");
    }
    d._deform = b("_deform"), d._malloc = b("_malloc");
    var Ce = d._free = b("_free");
    d._assembled_joint_mass = b("_assembled_joint_mass"), d._modal = b("_modal"), d._modal_paz = b("_modal_paz"), d._didactic_solve = b("_didactic_solve"), d._plate_q4_solve = b("_plate_q4_solve"), d._slopeAllocDouble = b("_slopeAllocDouble"), d._slopeStabilitySolver = b("_slopeStabilitySolver"), d._nonlinear_dynamic = b("_nonlinear_dynamic"), d._steel02_test = b("_steel02_test"), d._cyclic_pushover = b("_cyclic_pushover"), d._concrete02_test = b("_concrete02_test"), d._hex8_solve = b("_hex8_solve"), d._hex8_stress = b("_hex8_stress");
    var or = b("_fflush"), ar = b("_strerror"), Ie = b("_emscripten_stack_get_end"), p = b("_setThrew"), sr = b("__emscripten_tempret_set"), cr = b("_emscripten_stack_init"), lr = b("__emscripten_stack_restore"), dr = b("__emscripten_stack_alloc"), fr = b("_emscripten_stack_get_current"), xe = b("___cxa_decrement_exception_refcount"), ye = b("___cxa_increment_exception_refcount"), ur = b("___get_exception_message"), _r = b("___cxa_can_catch"), mr = b("___cxa_get_exception_ptr"), Ee = b("wasmMemory"), Le = b("wasmTable");
    function Nt(e) {
      u(typeof e.deform < "u", "missing Wasm export: deform"), u(typeof e.malloc < "u", "missing Wasm export: malloc"), u(typeof e.free < "u", "missing Wasm export: free"), u(typeof e.__cxa_free_exception < "u", "missing Wasm export: __cxa_free_exception"), u(typeof e.assembled_joint_mass < "u", "missing Wasm export: assembled_joint_mass"), u(typeof e.modal < "u", "missing Wasm export: modal"), u(typeof e.modal_paz < "u", "missing Wasm export: modal_paz"), u(typeof e.didactic_solve < "u", "missing Wasm export: didactic_solve"), u(typeof e.plate_q4_solve < "u", "missing Wasm export: plate_q4_solve"), u(typeof e.slopeAllocDouble < "u", "missing Wasm export: slopeAllocDouble"), u(typeof e.slopeStabilitySolver < "u", "missing Wasm export: slopeStabilitySolver"), u(typeof e.nonlinear_dynamic < "u", "missing Wasm export: nonlinear_dynamic"), u(typeof e.steel02_test < "u", "missing Wasm export: steel02_test"), u(typeof e.cyclic_pushover < "u", "missing Wasm export: cyclic_pushover"), u(typeof e.concrete02_test < "u", "missing Wasm export: concrete02_test"), u(typeof e.hex8_solve < "u", "missing Wasm export: hex8_solve"), u(typeof e.hex8_stress < "u", "missing Wasm export: hex8_stress"), u(typeof e.fflush < "u", "missing Wasm export: fflush"), u(typeof e.strerror < "u", "missing Wasm export: strerror"), u(typeof e.emscripten_stack_get_end < "u", "missing Wasm export: emscripten_stack_get_end"), u(typeof e.emscripten_stack_get_base < "u", "missing Wasm export: emscripten_stack_get_base"), u(typeof e.setThrew < "u", "missing Wasm export: setThrew"), u(typeof e._emscripten_tempret_set < "u", "missing Wasm export: _emscripten_tempret_set"), u(typeof e.emscripten_stack_init < "u", "missing Wasm export: emscripten_stack_init"), u(typeof e.emscripten_stack_get_free < "u", "missing Wasm export: emscripten_stack_get_free"), u(typeof e._emscripten_stack_restore < "u", "missing Wasm export: _emscripten_stack_restore"), u(typeof e._emscripten_stack_alloc < "u", "missing Wasm export: _emscripten_stack_alloc"), u(typeof e.emscripten_stack_get_current < "u", "missing Wasm export: emscripten_stack_get_current"), u(typeof e.__cxa_decrement_exception_refcount < "u", "missing Wasm export: __cxa_decrement_exception_refcount"), u(typeof e.__cxa_increment_exception_refcount < "u", "missing Wasm export: __cxa_increment_exception_refcount"), u(typeof e.__get_exception_message < "u", "missing Wasm export: __get_exception_message"), u(typeof e.__cxa_can_catch < "u", "missing Wasm export: __cxa_can_catch"), u(typeof e.__cxa_get_exception_ptr < "u", "missing Wasm export: __cxa_get_exception_ptr"), u(typeof e.memory < "u", "missing Wasm export: memory"), u(typeof e.__indirect_function_table < "u", "missing Wasm export: __indirect_function_table"), d._deform = D("deform", 80), d._malloc = D("malloc", 1), Ce = d._free = D("free", 1), d._assembled_joint_mass = D("assembled_joint_mass", 22), d._modal = D("modal", 84), d._modal_paz = D("modal_paz", 54), d._didactic_solve = D("didactic_solve", 48), d._plate_q4_solve = D("plate_q4_solve", 26), d._slopeAllocDouble = D("slopeAllocDouble", 1), d._slopeStabilitySolver = D("slopeStabilitySolver", 16), d._nonlinear_dynamic = D("nonlinear_dynamic", 20), d._steel02_test = D("steel02_test", 8), d._cyclic_pushover = D("cyclic_pushover", 40), d._concrete02_test = D("concrete02_test", 10), d._hex8_solve = D("hex8_solve", 18), d._hex8_stress = D("hex8_stress", 7), or = D("fflush", 1), ar = D("strerror", 1), Ie = e.emscripten_stack_get_end, e.emscripten_stack_get_base, p = D("setThrew", 2), sr = D("_emscripten_tempret_set", 1), cr = e.emscripten_stack_init, e.emscripten_stack_get_free, lr = e._emscripten_stack_restore, dr = e._emscripten_stack_alloc, fr = e.emscripten_stack_get_current, xe = D("__cxa_decrement_exception_refcount", 1), ye = D("__cxa_increment_exception_refcount", 1), ur = D("__get_exception_message", 3), _r = D("__cxa_can_catch", 3), mr = D("__cxa_get_exception_ptr", 1), Ee = e.memory, Le = e.__indirect_function_table;
    }
    var vr = {
      __assert_fail: Ir,
      __cxa_begin_catch: xr,
      __cxa_end_catch: Lr,
      __cxa_find_matching_catch_2: Ur,
      __cxa_find_matching_catch_3: Br,
      __cxa_rethrow: Wr,
      __cxa_throw: zr,
      __cxa_uncaught_exceptions: jr,
      __resumeException: Hr,
      _abort_js: $r,
      _tzset_js: Gr,
      clock_time_get: Qr,
      emscripten_resize_heap: tt,
      environ_get: it,
      environ_sizes_get: ot,
      fd_close: pt,
      fd_read: yt,
      fd_seek: Et,
      fd_write: St,
      invoke_di: wn,
      invoke_dii: sn,
      invoke_diii: On,
      invoke_fiii: Mn,
      invoke_i: Cn,
      invoke_ii: Ot,
      invoke_iid: zt,
      invoke_iii: Bt,
      invoke_iiii: Dt,
      invoke_iiiii: Xt,
      invoke_iiiiid: Pn,
      invoke_iiiiii: Ht,
      invoke_iiiiiii: qt,
      invoke_iiiiiiid: Ut,
      invoke_iiiiiiii: rn,
      invoke_iiiiiiiii: en,
      invoke_iiiiiiiiii: Zt,
      invoke_iiiiiiiiiii: Rn,
      invoke_iiiiiiiiiiii: In,
      invoke_iiiiiiiiiiiii: Dn,
      invoke_iiiiiiiiiiiiiii: Qt,
      invoke_j: An,
      invoke_jiiii: Nn,
      invoke_v: Mt,
      invoke_vddiiii: un,
      invoke_vi: Yt,
      invoke_vid: $t,
      invoke_vidddddddddddddi: gn,
      invoke_viddii: yn,
      invoke_vii: Wt,
      invoke_viid: Gt,
      invoke_viidd: hn,
      invoke_viiddd: _n,
      invoke_viiddi: En,
      invoke_viii: xt,
      invoke_viiid: jt,
      invoke_viiidd: bn,
      invoke_viiiddd: vn,
      invoke_viiidddd: Fn,
      invoke_viiidddddd: Tn,
      invoke_viiidddi: kn,
      invoke_viiidddidiiddiii: Sn,
      invoke_viiii: It,
      invoke_viiiii: Ct,
      invoke_viiiiid: dn,
      invoke_viiiiidiii: mn,
      invoke_viiiiii: Lt,
      invoke_viiiiiid: ln,
      invoke_viiiiiii: nn,
      invoke_viiiiiiidiiii: on,
      invoke_viiiiiiii: Vt,
      invoke_viiiiiiiii: tn,
      invoke_viiiiiiiiii: Jt,
      invoke_viiiiiiiiiidii: cn,
      invoke_viiiiiiiiiii: an,
      invoke_viiiiiiiiiiiddddii: pn,
      invoke_viiiiiiiiiiii: fn,
      invoke_viiiiiiiiiiiiiii: xn,
      invoke_viiiiiiiiiiiiiiii: Kt,
      llvm_eh_typeid_for: kt
    };
    function Dt(e, r, t, n) {
      var o = E();
      try {
        return w(e)(r, t, n);
      } catch (a) {
        if (y(o), !(a instanceof g)) throw a;
        p(1, 0);
      }
    }
    function Mt(e) {
      var r = E();
      try {
        w(e)();
      } catch (t) {
        if (y(r), !(t instanceof g)) throw t;
        p(1, 0);
      }
    }
    function Ot(e, r) {
      var t = E();
      try {
        return w(e)(r);
      } catch (n) {
        if (y(t), !(n instanceof g)) throw n;
        p(1, 0);
      }
    }
    function Ct(e, r, t, n, o, a) {
      var s = E();
      try {
        w(e)(r, t, n, o, a);
      } catch (c) {
        if (y(s), !(c instanceof g)) throw c;
        p(1, 0);
      }
    }
    function It(e, r, t, n, o) {
      var a = E();
      try {
        w(e)(r, t, n, o);
      } catch (s) {
        if (y(a), !(s instanceof g)) throw s;
        p(1, 0);
      }
    }
    function xt(e, r, t, n) {
      var o = E();
      try {
        w(e)(r, t, n);
      } catch (a) {
        if (y(o), !(a instanceof g)) throw a;
        p(1, 0);
      }
    }
    function Lt(e, r, t, n, o, a, s) {
      var c = E();
      try {
        w(e)(r, t, n, o, a, s);
      } catch (l) {
        if (y(c), !(l instanceof g)) throw l;
        p(1, 0);
      }
    }
    function Ut(e, r, t, n, o, a, s, c) {
      var l = E();
      try {
        return w(e)(r, t, n, o, a, s, c);
      } catch (f) {
        if (y(l), !(f instanceof g)) throw f;
        p(1, 0);
      }
    }
    function Bt(e, r, t) {
      var n = E();
      try {
        return w(e)(r, t);
      } catch (o) {
        if (y(n), !(o instanceof g)) throw o;
        p(1, 0);
      }
    }
    function Wt(e, r, t) {
      var n = E();
      try {
        w(e)(r, t);
      } catch (o) {
        if (y(n), !(o instanceof g)) throw o;
        p(1, 0);
      }
    }
    function zt(e, r, t) {
      var n = E();
      try {
        return w(e)(r, t);
      } catch (o) {
        if (y(n), !(o instanceof g)) throw o;
        p(1, 0);
      }
    }
    function jt(e, r, t, n, o) {
      var a = E();
      try {
        w(e)(r, t, n, o);
      } catch (s) {
        if (y(a), !(s instanceof g)) throw s;
        p(1, 0);
      }
    }
    function Ht(e, r, t, n, o, a) {
      var s = E();
      try {
        return w(e)(r, t, n, o, a);
      } catch (c) {
        if (y(s), !(c instanceof g)) throw c;
        p(1, 0);
      }
    }
    function $t(e, r, t) {
      var n = E();
      try {
        w(e)(r, t);
      } catch (o) {
        if (y(n), !(o instanceof g)) throw o;
        p(1, 0);
      }
    }
    function Gt(e, r, t, n) {
      var o = E();
      try {
        w(e)(r, t, n);
      } catch (a) {
        if (y(o), !(a instanceof g)) throw a;
        p(1, 0);
      }
    }
    function Vt(e, r, t, n, o, a, s, c, l) {
      var f = E();
      try {
        w(e)(r, t, n, o, a, s, c, l);
      } catch (m) {
        if (y(f), !(m instanceof g)) throw m;
        p(1, 0);
      }
    }
    function qt(e, r, t, n, o, a, s) {
      var c = E();
      try {
        return w(e)(r, t, n, o, a, s);
      } catch (l) {
        if (y(c), !(l instanceof g)) throw l;
        p(1, 0);
      }
    }
    function Yt(e, r) {
      var t = E();
      try {
        w(e)(r);
      } catch (n) {
        if (y(t), !(n instanceof g)) throw n;
        p(1, 0);
      }
    }
    function Xt(e, r, t, n, o) {
      var a = E();
      try {
        return w(e)(r, t, n, o);
      } catch (s) {
        if (y(a), !(s instanceof g)) throw s;
        p(1, 0);
      }
    }
    function Kt(e, r, t, n, o, a, s, c, l, f, m, v, _, h, S, P, N) {
      var R = E();
      try {
        w(e)(r, t, n, o, a, s, c, l, f, m, v, _, h, S, P, N);
      } catch (C) {
        if (y(R), !(C instanceof g)) throw C;
        p(1, 0);
      }
    }
    function Jt(e, r, t, n, o, a, s, c, l, f, m) {
      var v = E();
      try {
        w(e)(r, t, n, o, a, s, c, l, f, m);
      } catch (_) {
        if (y(v), !(_ instanceof g)) throw _;
        p(1, 0);
      }
    }
    function Qt(e, r, t, n, o, a, s, c, l, f, m, v, _, h, S) {
      var P = E();
      try {
        return w(e)(r, t, n, o, a, s, c, l, f, m, v, _, h, S);
      } catch (N) {
        if (y(P), !(N instanceof g)) throw N;
        p(1, 0);
      }
    }
    function Zt(e, r, t, n, o, a, s, c, l, f) {
      var m = E();
      try {
        return w(e)(r, t, n, o, a, s, c, l, f);
      } catch (v) {
        if (y(m), !(v instanceof g)) throw v;
        p(1, 0);
      }
    }
    function en(e, r, t, n, o, a, s, c, l) {
      var f = E();
      try {
        return w(e)(r, t, n, o, a, s, c, l);
      } catch (m) {
        if (y(f), !(m instanceof g)) throw m;
        p(1, 0);
      }
    }
    function rn(e, r, t, n, o, a, s, c) {
      var l = E();
      try {
        return w(e)(r, t, n, o, a, s, c);
      } catch (f) {
        if (y(l), !(f instanceof g)) throw f;
        p(1, 0);
      }
    }
    function tn(e, r, t, n, o, a, s, c, l, f) {
      var m = E();
      try {
        w(e)(r, t, n, o, a, s, c, l, f);
      } catch (v) {
        if (y(m), !(v instanceof g)) throw v;
        p(1, 0);
      }
    }
    function nn(e, r, t, n, o, a, s, c) {
      var l = E();
      try {
        w(e)(r, t, n, o, a, s, c);
      } catch (f) {
        if (y(l), !(f instanceof g)) throw f;
        p(1, 0);
      }
    }
    function on(e, r, t, n, o, a, s, c, l, f, m, v, _) {
      var h = E();
      try {
        w(e)(r, t, n, o, a, s, c, l, f, m, v, _);
      } catch (S) {
        if (y(h), !(S instanceof g)) throw S;
        p(1, 0);
      }
    }
    function an(e, r, t, n, o, a, s, c, l, f, m, v) {
      var _ = E();
      try {
        w(e)(r, t, n, o, a, s, c, l, f, m, v);
      } catch (h) {
        if (y(_), !(h instanceof g)) throw h;
        p(1, 0);
      }
    }
    function sn(e, r, t) {
      var n = E();
      try {
        return w(e)(r, t);
      } catch (o) {
        if (y(n), !(o instanceof g)) throw o;
        p(1, 0);
      }
    }
    function cn(e, r, t, n, o, a, s, c, l, f, m, v, _, h) {
      var S = E();
      try {
        w(e)(r, t, n, o, a, s, c, l, f, m, v, _, h);
      } catch (P) {
        if (y(S), !(P instanceof g)) throw P;
        p(1, 0);
      }
    }
    function ln(e, r, t, n, o, a, s, c) {
      var l = E();
      try {
        w(e)(r, t, n, o, a, s, c);
      } catch (f) {
        if (y(l), !(f instanceof g)) throw f;
        p(1, 0);
      }
    }
    function dn(e, r, t, n, o, a, s) {
      var c = E();
      try {
        w(e)(r, t, n, o, a, s);
      } catch (l) {
        if (y(c), !(l instanceof g)) throw l;
        p(1, 0);
      }
    }
    function fn(e, r, t, n, o, a, s, c, l, f, m, v, _) {
      var h = E();
      try {
        w(e)(r, t, n, o, a, s, c, l, f, m, v, _);
      } catch (S) {
        if (y(h), !(S instanceof g)) throw S;
        p(1, 0);
      }
    }
    function un(e, r, t, n, o, a, s) {
      var c = E();
      try {
        w(e)(r, t, n, o, a, s);
      } catch (l) {
        if (y(c), !(l instanceof g)) throw l;
        p(1, 0);
      }
    }
    function _n(e, r, t, n, o, a) {
      var s = E();
      try {
        w(e)(r, t, n, o, a);
      } catch (c) {
        if (y(s), !(c instanceof g)) throw c;
        p(1, 0);
      }
    }
    function mn(e, r, t, n, o, a, s, c, l, f) {
      var m = E();
      try {
        w(e)(r, t, n, o, a, s, c, l, f);
      } catch (v) {
        if (y(m), !(v instanceof g)) throw v;
        p(1, 0);
      }
    }
    function vn(e, r, t, n, o, a, s) {
      var c = E();
      try {
        w(e)(r, t, n, o, a, s);
      } catch (l) {
        if (y(c), !(l instanceof g)) throw l;
        p(1, 0);
      }
    }
    function hn(e, r, t, n, o) {
      var a = E();
      try {
        w(e)(r, t, n, o);
      } catch (s) {
        if (y(a), !(s instanceof g)) throw s;
        p(1, 0);
      }
    }
    function pn(e, r, t, n, o, a, s, c, l, f, m, v, _, h, S, P, N, R) {
      var C = E();
      try {
        w(e)(r, t, n, o, a, s, c, l, f, m, v, _, h, S, P, N, R);
      } catch (W) {
        if (y(C), !(W instanceof g)) throw W;
        p(1, 0);
      }
    }
    function gn(e, r, t, n, o, a, s, c, l, f, m, v, _, h, S, P) {
      var N = E();
      try {
        w(e)(r, t, n, o, a, s, c, l, f, m, v, _, h, S, P);
      } catch (R) {
        if (y(N), !(R instanceof g)) throw R;
        p(1, 0);
      }
    }
    function yn(e, r, t, n, o, a) {
      var s = E();
      try {
        w(e)(r, t, n, o, a);
      } catch (c) {
        if (y(s), !(c instanceof g)) throw c;
        p(1, 0);
      }
    }
    function En(e, r, t, n, o, a) {
      var s = E();
      try {
        w(e)(r, t, n, o, a);
      } catch (c) {
        if (y(s), !(c instanceof g)) throw c;
        p(1, 0);
      }
    }
    function wn(e, r) {
      var t = E();
      try {
        return w(e)(r);
      } catch (n) {
        if (y(t), !(n instanceof g)) throw n;
        p(1, 0);
      }
    }
    function Sn(e, r, t, n, o, a, s, c, l, f, m, v, _, h, S, P) {
      var N = E();
      try {
        w(e)(r, t, n, o, a, s, c, l, f, m, v, _, h, S, P);
      } catch (R) {
        if (y(N), !(R instanceof g)) throw R;
        p(1, 0);
      }
    }
    function kn(e, r, t, n, o, a, s, c) {
      var l = E();
      try {
        w(e)(r, t, n, o, a, s, c);
      } catch (f) {
        if (y(l), !(f instanceof g)) throw f;
        p(1, 0);
      }
    }
    function Fn(e, r, t, n, o, a, s, c) {
      var l = E();
      try {
        w(e)(r, t, n, o, a, s, c);
      } catch (f) {
        if (y(l), !(f instanceof g)) throw f;
        p(1, 0);
      }
    }
    function bn(e, r, t, n, o, a) {
      var s = E();
      try {
        w(e)(r, t, n, o, a);
      } catch (c) {
        if (y(s), !(c instanceof g)) throw c;
        p(1, 0);
      }
    }
    function Tn(e, r, t, n, o, a, s, c, l, f) {
      var m = E();
      try {
        w(e)(r, t, n, o, a, s, c, l, f);
      } catch (v) {
        if (y(m), !(v instanceof g)) throw v;
        p(1, 0);
      }
    }
    function An(e) {
      var r = E();
      try {
        return w(e)();
      } catch (t) {
        if (y(r), !(t instanceof g)) throw t;
        return p(1, 0), 0n;
      }
    }
    function Pn(e, r, t, n, o, a) {
      var s = E();
      try {
        return w(e)(r, t, n, o, a);
      } catch (c) {
        if (y(s), !(c instanceof g)) throw c;
        p(1, 0);
      }
    }
    function Rn(e, r, t, n, o, a, s, c, l, f, m) {
      var v = E();
      try {
        return w(e)(r, t, n, o, a, s, c, l, f, m);
      } catch (_) {
        if (y(v), !(_ instanceof g)) throw _;
        p(1, 0);
      }
    }
    function Nn(e, r, t, n, o) {
      var a = E();
      try {
        return w(e)(r, t, n, o);
      } catch (s) {
        if (y(a), !(s instanceof g)) throw s;
        return p(1, 0), 0n;
      }
    }
    function Dn(e, r, t, n, o, a, s, c, l, f, m, v, _) {
      var h = E();
      try {
        return w(e)(r, t, n, o, a, s, c, l, f, m, v, _);
      } catch (S) {
        if (y(h), !(S instanceof g)) throw S;
        p(1, 0);
      }
    }
    function Mn(e, r, t, n) {
      var o = E();
      try {
        return w(e)(r, t, n);
      } catch (a) {
        if (y(o), !(a instanceof g)) throw a;
        p(1, 0);
      }
    }
    function On(e, r, t, n) {
      var o = E();
      try {
        return w(e)(r, t, n);
      } catch (a) {
        if (y(o), !(a instanceof g)) throw a;
        p(1, 0);
      }
    }
    function Cn(e) {
      var r = E();
      try {
        return w(e)();
      } catch (t) {
        if (y(r), !(t instanceof g)) throw t;
        p(1, 0);
      }
    }
    function In(e, r, t, n, o, a, s, c, l, f, m, v) {
      var _ = E();
      try {
        return w(e)(r, t, n, o, a, s, c, l, f, m, v);
      } catch (h) {
        if (y(_), !(h instanceof g)) throw h;
        p(1, 0);
      }
    }
    function xn(e, r, t, n, o, a, s, c, l, f, m, v, _, h, S, P) {
      var N = E();
      try {
        w(e)(r, t, n, o, a, s, c, l, f, m, v, _, h, S, P);
      } catch (R) {
        if (y(N), !(R instanceof g)) throw R;
        p(1, 0);
      }
    }
    var hr;
    function Ln() {
      cr(), gr();
    }
    function Ue() {
      if ($ > 0) {
        ae = Ue;
        return;
      }
      if (Ln(), Sr(), $ > 0) {
        ae = Ue;
        return;
      }
      function e() {
        var _a2;
        u(!hr), hr = true, d.calledRun = true, !_e && (kr(), je == null ? void 0 : je(d), (_a2 = d.onRuntimeInitialized) == null ? void 0 : _a2.call(d), me("onRuntimeInitialized"), u(!d._main, 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]'), Fr());
      }
      d.setStatus ? (d.setStatus("Running..."), setTimeout(() => {
        setTimeout(() => d.setStatus(""), 1), e();
      }, 1)) : e(), Te();
    }
    var Y;
    Y = await Dr(), Ue(), ee ? Se = d : Se = new Promise((e, r) => {
      je = e, He = r;
    });
    for (const e of Object.keys(d)) e in we || Object.defineProperty(we, e, {
      configurable: true,
      get() {
        T(`Access to module property ('${e}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`);
      }
    });
    return Se;
  };
})();
export {
  Wn as M,
  __tla
};
