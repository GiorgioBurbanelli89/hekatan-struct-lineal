var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
let Sr, to, fo, ao, so, io, lo, co;
let __tla = (async () => {
  let eo, ro, mt;
  eo = "modulepreload";
  ro = function(h) {
    return "/hekatan-struct-lineal/" + h;
  };
  mt = {};
  to = function(_, l, f) {
    let T = Promise.resolve();
    if (l && l.length > 0) {
      document.getElementsByTagName("link");
      const ee = document.querySelector("meta[property=csp-nonce]"), W = (ee == null ? void 0 : ee.nonce) || (ee == null ? void 0 : ee.getAttribute("nonce"));
      T = Promise.allSettled(l.map((V) => {
        if (V = ro(V), V in mt) return;
        mt[V] = true;
        const ce = V.endsWith(".css"), M = ce ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${V}"]${M}`)) return;
        const re = document.createElement("link");
        if (re.rel = ce ? "stylesheet" : eo, ce || (re.as = "script"), re.crossOrigin = "", re.href = V, W && re.setAttribute("nonce", W), document.head.appendChild(re), ce) return new Promise((q, le) => {
          re.addEventListener("load", q), re.addEventListener("error", () => le(new Error(`Unable to preload CSS for ${V}`)));
        });
      }));
    }
    function v(ee) {
      const W = new Event("vite:preloadError", {
        cancelable: true
      });
      if (W.payload = ee, window.dispatchEvent(W), !W.defaultPrevented) throw ee;
    }
    return T.then((ee) => {
      for (const W of ee || []) W.status === "rejected" && v(W.reason);
      return _().catch(v);
    });
  };
  Sr = async function(h = {}) {
    var _a, _b, _c, _d, _e2, _f;
    var _;
    (function() {
      var _a2;
      function e(d) {
        d = d.split("-")[0];
        for (var m = d.split(".").slice(0, 3); m.length < 3; ) m.push("00");
        return m = m.map((E, g, y) => E.padStart(2, "0")), m.join("");
      }
      var r = (d) => [
        d / 1e4 | 0,
        (d / 100 | 0) % 100,
        d % 100
      ].join("."), t = 2147483647, n = typeof process < "u" && ((_a2 = process.versions) == null ? void 0 : _a2.node) ? e(process.versions.node) : t;
      if (n < 16e4) throw new Error(`This emscripten-generated code requires node v${r(16e4)} (detected v${r(n)})`);
      var s = typeof navigator < "u" && navigator.userAgent;
      if (s) {
        var i = s.includes("Safari/") && !s.includes("Chrome/") && s.match(/Version\/(\d+\.?\d*\.?\d*)/) ? e(s.match(/Version\/(\d+\.?\d*\.?\d*)/)[1]) : t;
        if (i < 15e4) throw new Error(`This emscripten-generated code requires Safari v${r(15e4)} (detected v${i})`);
        var a = s.match(/Firefox\/(\d+(?:\.\d+)?)/) ? parseFloat(s.match(/Firefox\/(\d+(?:\.\d+)?)/)[1]) : t;
        if (a < 79) throw new Error(`This emscripten-generated code requires Firefox v79 (detected v${a})`);
        var c = s.match(/Chrome\/(\d+(?:\.\d+)?)/) ? parseFloat(s.match(/Chrome\/(\d+(?:\.\d+)?)/)[1]) : t;
        if (c < 85) throw new Error(`This emscripten-generated code requires Chrome v85 (detected v${c})`);
      }
    })();
    var l = h, f = !!globalThis.window, T = !!globalThis.WorkerGlobalScope, v = ((_b = (_a = globalThis.process) == null ? void 0 : _a.versions) == null ? void 0 : _b.node) && ((_c = globalThis.process) == null ? void 0 : _c.type) != "renderer", ee = !f && !v && !T;
    if (v) {
      const { createRequire: e } = await to(() => import("./__vite-browser-external-D7Ct-6yo.js").then((r) => r._), []);
      var W = e(import.meta.url);
    }
    var V = "./this.program", ce = import.meta.url, M = "";
    function re(e) {
      return l.locateFile ? l.locateFile(e, M) : M + e;
    }
    var q, le;
    if (v) {
      if (!(((_e2 = (_d = globalThis.process) == null ? void 0 : _d.versions) == null ? void 0 : _e2.node) && ((_f = globalThis.process) == null ? void 0 : _f.type) != "renderer")) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
      var D = W("fs");
      ce.startsWith("file:") && (M = W("path").dirname(W("url").fileURLToPath(ce)) + "/"), le = (r) => {
        r = N(r) ? new URL(r) : r;
        var t = D.readFileSync(r);
        return u(Buffer.isBuffer(t)), t;
      }, q = async (r, t = true) => {
        r = N(r) ? new URL(r) : r;
        var n = D.readFileSync(r, t ? void 0 : "utf8");
        return u(t ? Buffer.isBuffer(n) : typeof n == "string"), n;
      }, process.argv.length > 1 && (V = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2);
    } else if (!ee) if (f || T) {
      try {
        M = new URL(".", ce).href;
      } catch {
      }
      if (!(globalThis.window || globalThis.WorkerGlobalScope)) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
      T && (le = (e) => {
        var r = new XMLHttpRequest();
        return r.open("GET", e, false), r.responseType = "arraybuffer", r.send(null), new Uint8Array(r.response);
      }), q = async (e) => {
        if (N(e)) return new Promise((t, n) => {
          var s = new XMLHttpRequest();
          s.open("GET", e, true), s.responseType = "arraybuffer", s.onload = () => {
            if (s.status == 200 || s.status == 0 && s.response) {
              t(s.response);
              return;
            }
            n(s.status);
          }, s.onerror = n, s.send(null);
        });
        var r = await fetch(e, {
          credentials: "same-origin"
        });
        if (r.ok) return r.arrayBuffer();
        throw new Error(r.status + " : " + r.url);
      };
    } else throw new Error("environment detection error");
    var x = console.log.bind(console), O = console.error.bind(console);
    u(!ee, "shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.");
    var U;
    globalThis.WebAssembly || O("no native wasm support detected");
    var j = false;
    function u(e, r) {
      e || H("Assertion failed" + (r ? ": " + r : ""));
    }
    var N = (e) => e.startsWith("file://");
    function X() {
      var e = Vr();
      u((e & 3) == 0), e == 0 && (e += 4), S[e >> 2] = 34821223, S[e + 4 >> 2] = 2310721022, S[0] = 1668509029;
    }
    function Z() {
      if (!j) {
        var e = Vr();
        e == 0 && (e += 4);
        var r = S[e >> 2], t = S[e + 4 >> 2];
        (r != 34821223 || t != 2310721022) && H(`Stack overflow! Stack cookie has been overwritten at ${Be(e)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${Be(t)} ${Be(r)}`), S[0] != 1668509029 && H("Runtime error: The application has corrupted its heap memory area (address zero)!");
      }
    }
    class p extends Error {
    }
    class de extends p {
      constructor(r) {
        super(r), this.excPtr = r;
        const t = et(r);
        this.name = t[0], this.message = t[1];
      }
    }
    (() => {
      var e = new Int16Array(1), r = new Int8Array(e.buffer);
      e[0] = 25459, (r[0] !== 115 || r[1] !== 99) && H("Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)");
    })();
    function te(e) {
      Object.getOwnPropertyDescriptor(l, e) || Object.defineProperty(l, e, {
        configurable: true,
        set() {
          H(`Attempt to set \`Module.${e}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`);
        }
      });
    }
    function P(e) {
      return () => u(false, `call to '${e}' via reference taken before Wasm module initialization`);
    }
    function Pe(e) {
      Object.getOwnPropertyDescriptor(l, e) && H(`\`Module.${e}\` was supplied but \`${e}\` not included in INCOMING_MODULE_JS_API`);
    }
    function pe(e) {
      return e === "FS_createPath" || e === "FS_createDataFile" || e === "FS_createPreloadedFile" || e === "FS_preloadFile" || e === "FS_unlink" || e === "addRunDependency" || e === "FS_createLazyFile" || e === "FS_createDevice" || e === "removeRunDependency";
    }
    function ye(e) {
      _e(e);
    }
    function _e(e) {
      Object.getOwnPropertyDescriptor(l, e) || Object.defineProperty(l, e, {
        configurable: true,
        get() {
          var r = `'${e}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
          pe(e) && (r += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"), H(r);
        }
      });
    }
    var Ae, Ee, ne, ge, we, S, G, be = false;
    function Se() {
      var e = Hr.buffer;
      ne = new Int8Array(e), l.HEAPU8 = ge = new Uint8Array(e), we = new Int32Array(e), l.HEAPU32 = S = new Uint32Array(e), l.HEAPF64 = new Float64Array(e), G = new BigInt64Array(e), new BigUint64Array(e);
    }
    u(globalThis.Int32Array && globalThis.Float64Array && Int32Array.prototype.subarray && Int32Array.prototype.set, "JS engine does not provide full typed array support");
    function Te() {
      if (l.preRun) for (typeof l.preRun == "function" && (l.preRun = [
        l.preRun
      ]); l.preRun.length; ) yr(l.preRun.shift());
      te("preRun"), ze($e);
    }
    function ve() {
      u(!be), be = true, Z(), !l.noFSInit && !o.initialized && o.init(), Pr.__wasm_call_ctors(), o.ignorePermissions = false;
    }
    function Me() {
      if (Z(), l.postRun) for (typeof l.postRun == "function" && (l.postRun = [
        l.postRun
      ]); l.postRun.length; ) Ke(l.postRun.shift());
      te("postRun"), ze(Qe);
    }
    function H(e) {
      var _a2;
      (_a2 = l.onAbort) == null ? void 0 : _a2.call(l, e), e = "Aborted(" + e + ")", O(e), j = true;
      var r = new WebAssembly.RuntimeError(e);
      throw Ee == null ? void 0 : Ee(r), r;
    }
    function R(e, r) {
      return (...t) => {
        u(be, `native function \`${e}\` called before runtime initialization`);
        var n = Pr[e];
        return u(n, `exported native function \`${e}\` not found`), u(t.length <= r, `native function \`${e}\` called with ${t.length} args but expects ${r}`), n(...t);
      };
    }
    var Fe;
    function Ne() {
      return l.locateFile ? re("deform.wasm") : new URL("/hekatan-struct-lineal/assets/deform-CLV4yhVK.wasm", import.meta.url).href;
    }
    function Y(e) {
      if (e == Fe && U) return new Uint8Array(U);
      if (le) return le(e);
      throw "both async and sync fetching of the wasm failed";
    }
    async function fe(e) {
      if (!U) try {
        var r = await q(e);
        return new Uint8Array(r);
      } catch {
      }
      return Y(e);
    }
    async function z(e, r) {
      try {
        var t = await fe(e), n = await WebAssembly.instantiate(t, r);
        return n;
      } catch (s) {
        O(`failed to asynchronously prepare wasm: ${s}`), N(e) && O(`warning: Loading from a file URI (${e}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`), H(s);
      }
    }
    async function K(e, r, t) {
      if (!e && !N(r) && !v) try {
        var n = fetch(r, {
          credentials: "same-origin"
        }), s = await WebAssembly.instantiateStreaming(n, t);
        return s;
      } catch (i) {
        O(`wasm streaming compile failed: ${i}`), O("falling back to ArrayBuffer instantiation");
      }
      return z(r, t);
    }
    function oe() {
      var e = {
        env: ft,
        wasi_snapshot_preview1: ft
      };
      return e;
    }
    async function je() {
      function e(a, c) {
        return Pr = a.exports, $t(Pr), Se(), Pr;
      }
      var r = l;
      function t(a) {
        return u(l === r, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?"), r = null, e(a.instance);
      }
      var n = oe();
      if (l.instantiateWasm) return new Promise((a, c) => {
        try {
          l.instantiateWasm(n, (d, m) => {
            a(e(d, m));
          });
        } catch (d) {
          O(`Module.instantiateWasm callback failed with error: ${d}`), c(d);
        }
      });
      Fe ?? (Fe = Ne());
      var s = await K(U, Fe, n), i = t(s);
      return i;
    }
    var ze = (e) => {
      for (; e.length > 0; ) e.shift()(l);
    }, Qe = [], Ke = (e) => Qe.push(e), $e = [], yr = (e) => $e.push(e), Be = (e) => (u(typeof e == "number", `ptrToString expects a number, got ${typeof e}`), e >>>= 0, "0x" + e.toString(16).padStart(8, "0")), A = (e) => st(e), w = () => at(), He = (e) => {
      He.shown || (He.shown = {}), He.shown[e] || (He.shown[e] = 1, v && (e = "warning: " + e), O(e));
    }, er = globalThis.TextDecoder && new TextDecoder(), dr = (e, r, t, n) => {
      for (var s = r + t; e[r] && !(r >= s); ) ++r;
      return r;
    }, Le = (e, r = 0, t, n) => {
      var s = dr(e, r, t);
      if (s - r > 16 && e.buffer && er) return er.decode(e.subarray(r, s));
      for (var i = ""; r < s; ) {
        var a = e[r++];
        if (!(a & 128)) {
          i += String.fromCharCode(a);
          continue;
        }
        var c = e[r++] & 63;
        if ((a & 224) == 192) {
          i += String.fromCharCode((a & 31) << 6 | c);
          continue;
        }
        var d = e[r++] & 63;
        if ((a & 240) == 224 ? a = (a & 15) << 12 | c << 6 | d : ((a & 248) != 240 && He("Invalid UTF-8 leading byte " + Be(a) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!"), a = (a & 7) << 18 | c << 12 | d << 6 | e[r++] & 63), a < 65536) i += String.fromCharCode(a);
        else {
          var m = a - 65536;
          i += String.fromCharCode(55296 | m >> 10, 56320 | m & 1023);
        }
      }
      return i;
    }, Ce = (e, r, t) => (u(typeof e == "number", `UTF8ToString expects a number (got ${typeof e})`), e ? Le(ge, e, r) : ""), or = (e, r, t, n) => H(`Assertion failed: ${Ce(e)}, at: ` + [
      r ? Ce(r) : "unknown filename",
      t,
      n ? Ce(n) : "unknown function"
    ]), Ie = [], Ge = 0, sr = (e) => {
      var r = new qe(e);
      return r.get_caught() || (r.set_caught(true), Ge--), r.set_rethrown(false), Ie.push(r), dt(e);
    }, Ue = 0, Ye = () => {
      F(0, 0), u(Ie.length > 0);
      var e = Ie.pop();
      jr(e.excPtr), Ue = 0;
    };
    class qe {
      constructor(r) {
        this.excPtr = r, this.ptr = r - 24;
      }
      set_type(r) {
        S[this.ptr + 4 >> 2] = r;
      }
      get_type() {
        return S[this.ptr + 4 >> 2];
      }
      set_destructor(r) {
        S[this.ptr + 8 >> 2] = r;
      }
      get_destructor() {
        return S[this.ptr + 8 >> 2];
      }
      set_caught(r) {
        r = r ? 1 : 0, ne[this.ptr + 12] = r;
      }
      get_caught() {
        return ne[this.ptr + 12] != 0;
      }
      set_rethrown(r) {
        r = r ? 1 : 0, ne[this.ptr + 13] = r;
      }
      get_rethrown() {
        return ne[this.ptr + 13] != 0;
      }
      init(r, t) {
        this.set_adjusted_ptr(0), this.set_type(r), this.set_destructor(t);
      }
      set_adjusted_ptr(r) {
        S[this.ptr + 16 >> 2] = r;
      }
      get_adjusted_ptr() {
        return S[this.ptr + 16 >> 2];
      }
    }
    var We = (e) => nt(e), Xe = (e) => {
      var r = Ue == null ? void 0 : Ue.excPtr;
      if (!r) return We(0), 0;
      var t = new qe(r);
      t.set_adjusted_ptr(r);
      var n = t.get_type();
      if (!n) return We(0), r;
      for (var s of e) {
        if (s === 0 || s === n) break;
        var i = t.ptr + 16;
        if (lt(s, n, i)) return We(s), r;
      }
      return We(n), r;
    }, rr = () => Xe([]), fr = (e) => Xe([
      e
    ]), Er = () => {
      var e = Ie.pop();
      e || H("no exception to throw");
      var r = e.excPtr;
      throw e.get_rethrown() || (Ie.push(e), e.set_rethrown(true), e.set_caught(false), Ge++), xr(r), Ue = new de(r), Ue;
    }, he = (e, r, t) => {
      var n = new qe(e);
      throw n.init(r, t), xr(e), Ue = new de(e), Ge++, Ue;
    }, Oe = () => Ge, ur = (e) => {
      throw Ue || (Ue = new de(e)), Ue;
    }, ir = () => H("native code called abort()"), ar = (e, r, t, n) => {
      if (u(typeof e == "string", `stringToUTF8Array expects a string (got ${typeof e})`), !(n > 0)) return 0;
      for (var s = t, i = t + n - 1, a = 0; a < e.length; ++a) {
        var c = e.codePointAt(a);
        if (c <= 127) {
          if (t >= i) break;
          r[t++] = c;
        } else if (c <= 2047) {
          if (t + 1 >= i) break;
          r[t++] = 192 | c >> 6, r[t++] = 128 | c & 63;
        } else if (c <= 65535) {
          if (t + 2 >= i) break;
          r[t++] = 224 | c >> 12, r[t++] = 128 | c >> 6 & 63, r[t++] = 128 | c & 63;
        } else {
          if (t + 3 >= i) break;
          c > 1114111 && He("Invalid Unicode code point " + Be(c) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF)."), r[t++] = 240 | c >> 18, r[t++] = 128 | c >> 12 & 63, r[t++] = 128 | c >> 6 & 63, r[t++] = 128 | c & 63, a++;
        }
      }
      return r[t] = 0, t - s;
    }, tr = (e, r, t) => (u(typeof t == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!"), ar(e, ge, r, t)), mr = (e) => {
      for (var r = 0, t = 0; t < e.length; ++t) {
        var n = e.charCodeAt(t);
        n <= 127 ? r++ : n <= 2047 ? r += 2 : n >= 55296 && n <= 57343 ? (r += 4, ++t) : r += 3;
      }
      return r;
    }, Mr = (e, r, t, n) => {
      var s = (/* @__PURE__ */ new Date()).getFullYear(), i = new Date(s, 0, 1), a = new Date(s, 6, 1), c = i.getTimezoneOffset(), d = a.getTimezoneOffset(), m = Math.max(c, d);
      S[e >> 2] = m * 60, we[r >> 2] = +(c != d);
      var E = (k) => {
        var C = k >= 0 ? "-" : "+", ie = Math.abs(k), me = String(Math.floor(ie / 60)).padStart(2, "0"), ue = String(ie % 60).padStart(2, "0");
        return `UTC${C}${me}${ue}`;
      }, g = E(c), y = E(d);
      u(g), u(y), u(mr(g) <= 16, `timezone name truncated to fit in TZNAME_MAX (${g})`), u(mr(y) <= 16, `timezone name truncated to fit in TZNAME_MAX (${y})`), d < c ? (tr(g, t, 17), tr(y, n, 17)) : (tr(g, n, 17), tr(y, t, 17));
    }, Ur = () => performance.now(), Or = () => Date.now(), Rr = (e) => e >= 0 && e <= 3, J = 9007199254740992, Ze = -9007199254740992, hr = (e) => e < Ze || e > J ? NaN : Number(e);
    function Nr(e, r, t) {
      if (!Rr(e)) return 28;
      var n;
      e === 0 ? n = Or() : n = Ur();
      var s = Math.round(n * 1e3 * 1e3);
      return G[t >> 3] = BigInt(s), 0;
    }
    var Dr = () => 2147483648, vt = (e, r) => (u(r, "alignment argument is required"), Math.ceil(e / r) * r), pt = (e) => {
      var r = Hr.buffer.byteLength, t = (e - r + 65535) / 65536 | 0;
      try {
        return Hr.grow(t), Se(), 1;
      } catch (n) {
        O(`growMemory: Attempted to grow heap from ${r} bytes to ${e} bytes, but got error: ${n}`);
      }
    }, yt = (e) => {
      var r = ge.length;
      e >>>= 0, u(e > r);
      var t = Dr();
      if (e > t) return O(`Cannot enlarge memory, requested ${e} bytes, but the limit is ${t} bytes!`), false;
      for (var n = 1; n <= 4; n *= 2) {
        var s = r * (1 + 0.2 / n);
        s = Math.min(s, e + 100663296);
        var i = Math.min(t, vt(Math.max(e, s), 65536)), a = pt(i);
        if (a) return true;
      }
      return O(`Failed to grow the heap from ${r} bytes to ${i} bytes, not enough memory!`), false;
    }, Lr = {}, Et = () => V || "./this.program", Fr = () => {
      var _a2;
      if (!Fr.strings) {
        var e = (((_a2 = globalThis.navigator) == null ? void 0 : _a2.language) ?? "C").replace("-", "_") + ".UTF-8", r = {
          USER: "web_user",
          LOGNAME: "web_user",
          PATH: "/",
          PWD: "/",
          HOME: "/home/web_user",
          LANG: e,
          _: Et()
        };
        for (var t in Lr) Lr[t] === void 0 ? delete r[t] : r[t] = Lr[t];
        var n = [];
        for (var t in r) n.push(`${t}=${r[t]}`);
        Fr.strings = n;
      }
      return Fr.strings;
    }, gt = (e, r) => {
      var t = 0, n = 0;
      for (var s of Fr()) {
        var i = r + t;
        S[e + n >> 2] = i, t += tr(s, i, 1 / 0) + 1, n += 4;
      }
      return 0;
    }, wt = (e, r) => {
      var t = Fr();
      S[e >> 2] = t.length;
      var n = 0;
      for (var s of t) n += mr(s) + 1;
      return S[r >> 2] = n, 0;
    }, se = {
      isAbs: (e) => e.charAt(0) === "/",
      splitPath: (e) => {
        var r = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return r.exec(e).slice(1);
      },
      normalizeArray: (e, r) => {
        for (var t = 0, n = e.length - 1; n >= 0; n--) {
          var s = e[n];
          s === "." ? e.splice(n, 1) : s === ".." ? (e.splice(n, 1), t++) : t && (e.splice(n, 1), t--);
        }
        if (r) for (; t; t--) e.unshift("..");
        return e;
      },
      normalize: (e) => {
        var r = se.isAbs(e), t = e.slice(-1) === "/";
        return e = se.normalizeArray(e.split("/").filter((n) => !!n), !r).join("/"), !e && !r && (e = "."), e && t && (e += "/"), (r ? "/" : "") + e;
      },
      dirname: (e) => {
        var r = se.splitPath(e), t = r[0], n = r[1];
        return !t && !n ? "." : (n && (n = n.slice(0, -1)), t + n);
      },
      basename: (e) => e && e.match(/([^\/]+|\/)\/*$/)[1],
      join: (...e) => se.normalize(e.join("/")),
      join2: (e, r) => se.normalize(e + "/" + r)
    }, Pt = () => {
      if (v) {
        var e = W("crypto");
        return (r) => e.randomFillSync(r);
      }
      return (r) => crypto.getRandomValues(r);
    }, Gr = (e) => {
      (Gr = Pt())(e);
    }, gr = {
      resolve: (...e) => {
        for (var r = "", t = false, n = e.length - 1; n >= -1 && !t; n--) {
          var s = n >= 0 ? e[n] : o.cwd();
          if (typeof s != "string") throw new TypeError("Arguments to path.resolve must be strings");
          if (!s) return "";
          r = s + "/" + r, t = se.isAbs(s);
        }
        return r = se.normalizeArray(r.split("/").filter((i) => !!i), !t).join("/"), (t ? "/" : "") + r || ".";
      },
      relative: (e, r) => {
        e = gr.resolve(e).slice(1), r = gr.resolve(r).slice(1);
        function t(m) {
          for (var E = 0; E < m.length && m[E] === ""; E++) ;
          for (var g = m.length - 1; g >= 0 && m[g] === ""; g--) ;
          return E > g ? [] : m.slice(E, g - E + 1);
        }
        for (var n = t(e.split("/")), s = t(r.split("/")), i = Math.min(n.length, s.length), a = i, c = 0; c < i; c++) if (n[c] !== s[c]) {
          a = c;
          break;
        }
        for (var d = [], c = a; c < n.length; c++) d.push("..");
        return d = d.concat(s.slice(a)), d.join("/");
      }
    }, zr = [], Br = (e, r, t) => {
      var n = mr(e) + 1, s = new Array(n), i = ar(e, s, 0, s.length);
      return s.length = i, s;
    }, At = () => {
      var _a2;
      if (!zr.length) {
        var e = null;
        if (v) {
          var r = 256, t = Buffer.alloc(r), n = 0, s = process.stdin.fd;
          try {
            n = D.readSync(s, t, 0, r);
          } catch (i) {
            if (i.toString().includes("EOF")) n = 0;
            else throw i;
          }
          n > 0 && (e = t.slice(0, n).toString("utf-8"));
        } else ((_a2 = globalThis.window) == null ? void 0 : _a2.prompt) && (e = window.prompt("Input: "), e !== null && (e += `
`));
        if (!e) return null;
        zr = Br(e);
      }
      return zr.shift();
    }, _r = {
      ttys: [],
      init() {
      },
      shutdown() {
      },
      register(e, r) {
        _r.ttys[e] = {
          input: [],
          output: [],
          ops: r
        }, o.registerDevice(e, _r.stream_ops);
      },
      stream_ops: {
        open(e) {
          var r = _r.ttys[e.node.rdev];
          if (!r) throw new o.ErrnoError(43);
          e.tty = r, e.seekable = false;
        },
        close(e) {
          e.tty.ops.fsync(e.tty);
        },
        fsync(e) {
          e.tty.ops.fsync(e.tty);
        },
        read(e, r, t, n, s) {
          if (!e.tty || !e.tty.ops.get_char) throw new o.ErrnoError(60);
          for (var i = 0, a = 0; a < n; a++) {
            var c;
            try {
              c = e.tty.ops.get_char(e.tty);
            } catch {
              throw new o.ErrnoError(29);
            }
            if (c === void 0 && i === 0) throw new o.ErrnoError(6);
            if (c == null) break;
            i++, r[t + a] = c;
          }
          return i && (e.node.atime = Date.now()), i;
        },
        write(e, r, t, n, s) {
          if (!e.tty || !e.tty.ops.put_char) throw new o.ErrnoError(60);
          try {
            for (var i = 0; i < n; i++) e.tty.ops.put_char(e.tty, r[t + i]);
          } catch {
            throw new o.ErrnoError(29);
          }
          return n && (e.node.mtime = e.node.ctime = Date.now()), i;
        }
      },
      default_tty_ops: {
        get_char(e) {
          return At();
        },
        put_char(e, r) {
          r === null || r === 10 ? (x(Le(e.output)), e.output = []) : r != 0 && e.output.push(r);
        },
        fsync(e) {
          var _a2;
          ((_a2 = e.output) == null ? void 0 : _a2.length) > 0 && (x(Le(e.output)), e.output = []);
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
          r === null || r === 10 ? (O(Le(e.output)), e.output = []) : r != 0 && e.output.push(r);
        },
        fsync(e) {
          var _a2;
          ((_a2 = e.output) == null ? void 0 : _a2.length) > 0 && (O(Le(e.output)), e.output = []);
        }
      }
    }, Yr = (e) => {
      H("internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported");
    }, I = {
      ops_table: null,
      mount(e) {
        return I.createNode(null, "/", 16895, 0);
      },
      createNode(e, r, t, n) {
        if (o.isBlkdev(t) || o.isFIFO(t)) throw new o.ErrnoError(63);
        I.ops_table || (I.ops_table = {
          dir: {
            node: {
              getattr: I.node_ops.getattr,
              setattr: I.node_ops.setattr,
              lookup: I.node_ops.lookup,
              mknod: I.node_ops.mknod,
              rename: I.node_ops.rename,
              unlink: I.node_ops.unlink,
              rmdir: I.node_ops.rmdir,
              readdir: I.node_ops.readdir,
              symlink: I.node_ops.symlink
            },
            stream: {
              llseek: I.stream_ops.llseek
            }
          },
          file: {
            node: {
              getattr: I.node_ops.getattr,
              setattr: I.node_ops.setattr
            },
            stream: {
              llseek: I.stream_ops.llseek,
              read: I.stream_ops.read,
              write: I.stream_ops.write,
              mmap: I.stream_ops.mmap,
              msync: I.stream_ops.msync
            }
          },
          link: {
            node: {
              getattr: I.node_ops.getattr,
              setattr: I.node_ops.setattr,
              readlink: I.node_ops.readlink
            },
            stream: {}
          },
          chrdev: {
            node: {
              getattr: I.node_ops.getattr,
              setattr: I.node_ops.setattr
            },
            stream: o.chrdev_stream_ops
          }
        });
        var s = o.createNode(e, r, t, n);
        return o.isDir(s.mode) ? (s.node_ops = I.ops_table.dir.node, s.stream_ops = I.ops_table.dir.stream, s.contents = {}) : o.isFile(s.mode) ? (s.node_ops = I.ops_table.file.node, s.stream_ops = I.ops_table.file.stream, s.usedBytes = 0, s.contents = null) : o.isLink(s.mode) ? (s.node_ops = I.ops_table.link.node, s.stream_ops = I.ops_table.link.stream) : o.isChrdev(s.mode) && (s.node_ops = I.ops_table.chrdev.node, s.stream_ops = I.ops_table.chrdev.stream), s.atime = s.mtime = s.ctime = Date.now(), e && (e.contents[r] = s, e.atime = e.mtime = e.ctime = s.atime), s;
      },
      getFileDataAsTypedArray(e) {
        return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0);
      },
      expandFileStorage(e, r) {
        var t = e.contents ? e.contents.length : 0;
        if (!(t >= r)) {
          var n = 1024 * 1024;
          r = Math.max(r, t * (t < n ? 2 : 1.125) >>> 0), t != 0 && (r = Math.max(r, 256));
          var s = e.contents;
          e.contents = new Uint8Array(r), e.usedBytes > 0 && e.contents.set(s.subarray(0, e.usedBytes), 0);
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
          return r.dev = o.isChrdev(e.mode) ? e.id : 1, r.ino = e.id, r.mode = e.mode, r.nlink = 1, r.uid = 0, r.gid = 0, r.rdev = e.rdev, o.isDir(e.mode) ? r.size = 4096 : o.isFile(e.mode) ? r.size = e.usedBytes : o.isLink(e.mode) ? r.size = e.link.length : r.size = 0, r.atime = new Date(e.atime), r.mtime = new Date(e.mtime), r.ctime = new Date(e.ctime), r.blksize = 4096, r.blocks = Math.ceil(r.size / r.blksize), r;
        },
        setattr(e, r) {
          for (const t of [
            "mode",
            "atime",
            "mtime",
            "ctime"
          ]) r[t] != null && (e[t] = r[t]);
          r.size !== void 0 && I.resizeFileStorage(e, r.size);
        },
        lookup(e, r) {
          throw new o.ErrnoError(44);
        },
        mknod(e, r, t, n) {
          return I.createNode(e, r, t, n);
        },
        rename(e, r, t) {
          var n;
          try {
            n = o.lookupNode(r, t);
          } catch {
          }
          if (n) {
            if (o.isDir(e.mode)) for (var s in n.contents) throw new o.ErrnoError(55);
            o.hashRemoveNode(n);
          }
          delete e.parent.contents[e.name], r.contents[t] = e, e.name = t, r.ctime = r.mtime = e.parent.ctime = e.parent.mtime = Date.now();
        },
        unlink(e, r) {
          delete e.contents[r], e.ctime = e.mtime = Date.now();
        },
        rmdir(e, r) {
          var t = o.lookupNode(e, r);
          for (var n in t.contents) throw new o.ErrnoError(55);
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
          var n = I.createNode(e, r, 41471, 0);
          return n.link = t, n;
        },
        readlink(e) {
          if (!o.isLink(e.mode)) throw new o.ErrnoError(28);
          return e.link;
        }
      },
      stream_ops: {
        read(e, r, t, n, s) {
          var i = e.node.contents;
          if (s >= e.node.usedBytes) return 0;
          var a = Math.min(e.node.usedBytes - s, n);
          if (u(a >= 0), a > 8 && i.subarray) r.set(i.subarray(s, s + a), t);
          else for (var c = 0; c < a; c++) r[t + c] = i[s + c];
          return a;
        },
        write(e, r, t, n, s, i) {
          if (u(!(r instanceof ArrayBuffer)), r.buffer === ne.buffer && (i = false), !n) return 0;
          var a = e.node;
          if (a.mtime = a.ctime = Date.now(), r.subarray && (!a.contents || a.contents.subarray)) {
            if (i) return u(s === 0, "canOwn must imply no weird position inside the file"), a.contents = r.subarray(t, t + n), a.usedBytes = n, n;
            if (a.usedBytes === 0 && s === 0) return a.contents = r.slice(t, t + n), a.usedBytes = n, n;
            if (s + n <= a.usedBytes) return a.contents.set(r.subarray(t, t + n), s), n;
          }
          if (I.expandFileStorage(a, s + n), a.contents.subarray && r.subarray) a.contents.set(r.subarray(t, t + n), s);
          else for (var c = 0; c < n; c++) a.contents[s + c] = r[t + c];
          return a.usedBytes = Math.max(a.usedBytes, s + n), n;
        },
        llseek(e, r, t) {
          var n = r;
          if (t === 1 ? n += e.position : t === 2 && o.isFile(e.node.mode) && (n += e.node.usedBytes), n < 0) throw new o.ErrnoError(28);
          return n;
        },
        mmap(e, r, t, n, s) {
          if (!o.isFile(e.node.mode)) throw new o.ErrnoError(43);
          var i, a, c = e.node.contents;
          if (!(s & 2) && c && c.buffer === ne.buffer) a = false, i = c.byteOffset;
          else {
            if (a = true, i = Yr(), !i) throw new o.ErrnoError(48);
            c && ((t > 0 || t + r < c.length) && (c.subarray ? c = c.subarray(t, t + r) : c = Array.prototype.slice.call(c, t, t + r)), ne.set(c, i));
          }
          return {
            ptr: i,
            allocated: a
          };
        },
        msync(e, r, t, n, s) {
          return I.stream_ops.write(e, r, 0, n, t, false), 0;
        }
      }
    }, kt = (e) => {
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
    }, Ir = (e, r) => {
      var t = 0;
      return e && (t |= 365), r && (t |= 146), t;
    }, St = (e) => Ce(tt(e)), qr = {
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
    }, Ft = async (e) => {
      var r = await q(e);
      return u(r, `Loading data file "${e}" failed (no arrayBuffer).`), new Uint8Array(r);
    }, bt = (...e) => o.createDataFile(...e), Tt = (e) => {
      for (var r = e; ; ) {
        if (!wr[e]) return e;
        e = r + Math.random();
      }
    }, vr = 0, br = null, wr = {}, cr = null, Mt = (e) => {
      var _a2;
      if (vr--, (_a2 = l.monitorRunDependencies) == null ? void 0 : _a2.call(l, vr), u(e, "removeRunDependency requires an ID"), u(wr[e]), delete wr[e], vr == 0 && (cr !== null && (clearInterval(cr), cr = null), br)) {
        var r = br;
        br = null, r();
      }
    }, Ut = (e) => {
      var _a2, _b2;
      vr++, (_a2 = l.monitorRunDependencies) == null ? void 0 : _a2.call(l, vr), u(e, "addRunDependency requires an ID"), u(!wr[e]), wr[e] = 1, cr === null && globalThis.setInterval && (cr = setInterval(() => {
        if (j) {
          clearInterval(cr), cr = null;
          return;
        }
        var r = false;
        for (var t in wr) r || (r = true, O("still waiting on run dependencies:")), O(`dependency: ${t}`);
        r && O("(end of list)");
      }, 1e4), (_b2 = cr.unref) == null ? void 0 : _b2.call(cr));
    }, Xr = [], Ot = async (e, r) => {
      typeof Browser < "u" && Browser.init();
      for (var t of Xr) if (t.canHandle(r)) return u(t.handle.constructor.name === "AsyncFunction", "Filesystem plugin handlers must be async functions (See #24914)"), t.handle(e, r);
      return e;
    }, Zr = async (e, r, t, n, s, i, a, c) => {
      var d = r ? gr.resolve(se.join2(e, r)) : e, m = Tt(`cp ${d}`);
      Ut(m);
      try {
        var E = t;
        typeof t == "string" && (E = await Ft(t)), E = await Ot(E, d), c == null ? void 0 : c(), i || bt(e, r, E, n, s, a);
      } finally {
        Mt(m);
      }
    }, Rt = (e, r, t, n, s, i, a, c, d, m) => {
      Zr(e, r, t, n, s, c, d, m).then(i).catch(a);
    }, o = {
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
          super(be ? St(e) : "");
          __publicField(this, "name", "ErrnoError");
          this.errno = e;
          for (var r in qr) if (qr[r] === e) {
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
          e || (e = this), this.parent = e, this.mount = e.mount, this.id = o.nextInode++, this.name = r, this.mode = t, this.rdev = n, this.atime = this.mtime = this.ctime = Date.now();
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
          return o.isDir(this.mode);
        }
        get isDevice() {
          return o.isChrdev(this.mode);
        }
      },
      lookupPath(e, r = {}) {
        if (!e) throw new o.ErrnoError(44);
        r.follow_mount ?? (r.follow_mount = true), se.isAbs(e) || (e = o.cwd() + "/" + e);
        e: for (var t = 0; t < 40; t++) {
          for (var n = e.split("/").filter((m) => !!m), s = o.root, i = "/", a = 0; a < n.length; a++) {
            var c = a === n.length - 1;
            if (c && r.parent) break;
            if (n[a] !== ".") {
              if (n[a] === "..") {
                if (i = se.dirname(i), o.isRoot(s)) {
                  e = i + "/" + n.slice(a + 1).join("/"), t--;
                  continue e;
                } else s = s.parent;
                continue;
              }
              i = se.join2(i, n[a]);
              try {
                s = o.lookupNode(s, n[a]);
              } catch (m) {
                if ((m == null ? void 0 : m.errno) === 44 && c && r.noent_okay) return {
                  path: i
                };
                throw m;
              }
              if (o.isMountpoint(s) && (!c || r.follow_mount) && (s = s.mounted.root), o.isLink(s.mode) && (!c || r.follow)) {
                if (!s.node_ops.readlink) throw new o.ErrnoError(52);
                var d = s.node_ops.readlink(s);
                se.isAbs(d) || (d = se.dirname(i) + "/" + d), e = d + "/" + n.slice(a + 1).join("/");
                continue e;
              }
            }
          }
          return {
            path: i,
            node: s
          };
        }
        throw new o.ErrnoError(32);
      },
      getPath(e) {
        for (var r; ; ) {
          if (o.isRoot(e)) {
            var t = e.mount.mountpoint;
            return r ? t[t.length - 1] !== "/" ? `${t}/${r}` : t + r : t;
          }
          r = r ? `${e.name}/${r}` : e.name, e = e.parent;
        }
      },
      hashName(e, r) {
        for (var t = 0, n = 0; n < r.length; n++) t = (t << 5) - t + r.charCodeAt(n) | 0;
        return (e + t >>> 0) % o.nameTable.length;
      },
      hashAddNode(e) {
        var r = o.hashName(e.parent.id, e.name);
        e.name_next = o.nameTable[r], o.nameTable[r] = e;
      },
      hashRemoveNode(e) {
        var r = o.hashName(e.parent.id, e.name);
        if (o.nameTable[r] === e) o.nameTable[r] = e.name_next;
        else for (var t = o.nameTable[r]; t; ) {
          if (t.name_next === e) {
            t.name_next = e.name_next;
            break;
          }
          t = t.name_next;
        }
      },
      lookupNode(e, r) {
        var t = o.mayLookup(e);
        if (t) throw new o.ErrnoError(t);
        for (var n = o.hashName(e.id, r), s = o.nameTable[n]; s; s = s.name_next) {
          var i = s.name;
          if (s.parent.id === e.id && i === r) return s;
        }
        return o.lookup(e, r);
      },
      createNode(e, r, t, n) {
        u(typeof e == "object");
        var s = new o.FSNode(e, r, t, n);
        return o.hashAddNode(s), s;
      },
      destroyNode(e) {
        o.hashRemoveNode(e);
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
        return o.ignorePermissions ? 0 : r.includes("r") && !(e.mode & 292) || r.includes("w") && !(e.mode & 146) || r.includes("x") && !(e.mode & 73) ? 2 : 0;
      },
      mayLookup(e) {
        if (!o.isDir(e.mode)) return 54;
        var r = o.nodePermissions(e, "x");
        return r || (e.node_ops.lookup ? 0 : 2);
      },
      mayCreate(e, r) {
        if (!o.isDir(e.mode)) return 54;
        try {
          var t = o.lookupNode(e, r);
          return 20;
        } catch {
        }
        return o.nodePermissions(e, "wx");
      },
      mayDelete(e, r, t) {
        var n;
        try {
          n = o.lookupNode(e, r);
        } catch (i) {
          return i.errno;
        }
        var s = o.nodePermissions(e, "wx");
        if (s) return s;
        if (t) {
          if (!o.isDir(n.mode)) return 54;
          if (o.isRoot(n) || o.getPath(n) === o.cwd()) return 10;
        } else if (o.isDir(n.mode)) return 31;
        return 0;
      },
      mayOpen(e, r) {
        return e ? o.isLink(e.mode) ? 32 : o.isDir(e.mode) && (o.flagsToPermissionString(r) !== "r" || r & 576) ? 31 : o.nodePermissions(e, o.flagsToPermissionString(r)) : 44;
      },
      checkOpExists(e, r) {
        if (!e) throw new o.ErrnoError(r);
        return e;
      },
      MAX_OPEN_FDS: 4096,
      nextfd() {
        for (var e = 0; e <= o.MAX_OPEN_FDS; e++) if (!o.streams[e]) return e;
        throw new o.ErrnoError(33);
      },
      getStreamChecked(e) {
        var r = o.getStream(e);
        if (!r) throw new o.ErrnoError(8);
        return r;
      },
      getStream: (e) => o.streams[e],
      createStream(e, r = -1) {
        return u(r >= -1), e = Object.assign(new o.FSStream(), e), r == -1 && (r = o.nextfd()), e.fd = r, o.streams[r] = e, e;
      },
      closeStream(e) {
        o.streams[e] = null;
      },
      dupStream(e, r = -1) {
        var _a2, _b2;
        var t = o.createStream(e, r);
        return (_b2 = (_a2 = t.stream_ops) == null ? void 0 : _a2.dup) == null ? void 0 : _b2.call(_a2, t), t;
      },
      doSetAttr(e, r, t) {
        var n = e == null ? void 0 : e.stream_ops.setattr, s = n ? e : r;
        n ?? (n = r.node_ops.setattr), o.checkOpExists(n, 63), n(s, t);
      },
      chrdev_stream_ops: {
        open(e) {
          var _a2, _b2;
          var r = o.getDevice(e.node.rdev);
          e.stream_ops = r.stream_ops, (_b2 = (_a2 = e.stream_ops).open) == null ? void 0 : _b2.call(_a2, e);
        },
        llseek() {
          throw new o.ErrnoError(70);
        }
      },
      major: (e) => e >> 8,
      minor: (e) => e & 255,
      makedev: (e, r) => e << 8 | r,
      registerDevice(e, r) {
        o.devices[e] = {
          stream_ops: r
        };
      },
      getDevice: (e) => o.devices[e],
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
        typeof e == "function" && (r = e, e = false), o.syncFSRequests++, o.syncFSRequests > 1 && O(`warning: ${o.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
        var t = o.getMounts(o.root.mount), n = 0;
        function s(c) {
          return u(o.syncFSRequests > 0), o.syncFSRequests--, r(c);
        }
        function i(c) {
          if (c) return i.errored ? void 0 : (i.errored = true, s(c));
          ++n >= t.length && s(null);
        }
        for (var a of t) a.type.syncfs ? a.type.syncfs(a, e, i) : i(null);
      },
      mount(e, r, t) {
        if (typeof e == "string") throw e;
        var n = t === "/", s = !t, i;
        if (n && o.root) throw new o.ErrnoError(10);
        if (!n && !s) {
          var a = o.lookupPath(t, {
            follow_mount: false
          });
          if (t = a.path, i = a.node, o.isMountpoint(i)) throw new o.ErrnoError(10);
          if (!o.isDir(i.mode)) throw new o.ErrnoError(54);
        }
        var c = {
          type: e,
          opts: r,
          mountpoint: t,
          mounts: []
        }, d = e.mount(c);
        return d.mount = c, c.root = d, n ? o.root = d : i && (i.mounted = c, i.mount && i.mount.mounts.push(c)), d;
      },
      unmount(e) {
        var r = o.lookupPath(e, {
          follow_mount: false
        });
        if (!o.isMountpoint(r.node)) throw new o.ErrnoError(28);
        var t = r.node, n = t.mounted, s = o.getMounts(n);
        for (var [i, a] of Object.entries(o.nameTable)) for (; a; ) {
          var c = a.name_next;
          s.includes(a.mount) && o.destroyNode(a), a = c;
        }
        t.mounted = null;
        var d = t.mount.mounts.indexOf(n);
        u(d !== -1), t.mount.mounts.splice(d, 1);
      },
      lookup(e, r) {
        return e.node_ops.lookup(e, r);
      },
      mknod(e, r, t) {
        var n = o.lookupPath(e, {
          parent: true
        }), s = n.node, i = se.basename(e);
        if (!i) throw new o.ErrnoError(28);
        if (i === "." || i === "..") throw new o.ErrnoError(20);
        var a = o.mayCreate(s, i);
        if (a) throw new o.ErrnoError(a);
        if (!s.node_ops.mknod) throw new o.ErrnoError(63);
        return s.node_ops.mknod(s, i, r, t);
      },
      statfs(e) {
        return o.statfsNode(o.lookupPath(e, {
          follow: true
        }).node);
      },
      statfsStream(e) {
        return o.statfsNode(e.node);
      },
      statfsNode(e) {
        var r = {
          bsize: 4096,
          frsize: 4096,
          blocks: 1e6,
          bfree: 5e5,
          bavail: 5e5,
          files: o.nextInode,
          ffree: o.nextInode - 1,
          fsid: 42,
          flags: 2,
          namelen: 255
        };
        return e.node_ops.statfs && Object.assign(r, e.node_ops.statfs(e.mount.opts.root)), r;
      },
      create(e, r = 438) {
        return r &= 4095, r |= 32768, o.mknod(e, r, 0);
      },
      mkdir(e, r = 511) {
        return r &= 1023, r |= 16384, o.mknod(e, r, 0);
      },
      mkdirTree(e, r) {
        var t = e.split("/"), n = "";
        for (var s of t) if (s) {
          (n || se.isAbs(e)) && (n += "/"), n += s;
          try {
            o.mkdir(n, r);
          } catch (i) {
            if (i.errno != 20) throw i;
          }
        }
      },
      mkdev(e, r, t) {
        return typeof t > "u" && (t = r, r = 438), r |= 8192, o.mknod(e, r, t);
      },
      symlink(e, r) {
        if (!gr.resolve(e)) throw new o.ErrnoError(44);
        var t = o.lookupPath(r, {
          parent: true
        }), n = t.node;
        if (!n) throw new o.ErrnoError(44);
        var s = se.basename(r), i = o.mayCreate(n, s);
        if (i) throw new o.ErrnoError(i);
        if (!n.node_ops.symlink) throw new o.ErrnoError(63);
        return n.node_ops.symlink(n, s, e);
      },
      rename(e, r) {
        var t = se.dirname(e), n = se.dirname(r), s = se.basename(e), i = se.basename(r), a, c, d;
        if (a = o.lookupPath(e, {
          parent: true
        }), c = a.node, a = o.lookupPath(r, {
          parent: true
        }), d = a.node, !c || !d) throw new o.ErrnoError(44);
        if (c.mount !== d.mount) throw new o.ErrnoError(75);
        var m = o.lookupNode(c, s), E = gr.relative(e, n);
        if (E.charAt(0) !== ".") throw new o.ErrnoError(28);
        if (E = gr.relative(r, t), E.charAt(0) !== ".") throw new o.ErrnoError(55);
        var g;
        try {
          g = o.lookupNode(d, i);
        } catch {
        }
        if (m !== g) {
          var y = o.isDir(m.mode), k = o.mayDelete(c, s, y);
          if (k) throw new o.ErrnoError(k);
          if (k = g ? o.mayDelete(d, i, y) : o.mayCreate(d, i), k) throw new o.ErrnoError(k);
          if (!c.node_ops.rename) throw new o.ErrnoError(63);
          if (o.isMountpoint(m) || g && o.isMountpoint(g)) throw new o.ErrnoError(10);
          if (d !== c && (k = o.nodePermissions(c, "w"), k)) throw new o.ErrnoError(k);
          o.hashRemoveNode(m);
          try {
            c.node_ops.rename(m, d, i), m.parent = d;
          } catch (C) {
            throw C;
          } finally {
            o.hashAddNode(m);
          }
        }
      },
      rmdir(e) {
        var r = o.lookupPath(e, {
          parent: true
        }), t = r.node, n = se.basename(e), s = o.lookupNode(t, n), i = o.mayDelete(t, n, true);
        if (i) throw new o.ErrnoError(i);
        if (!t.node_ops.rmdir) throw new o.ErrnoError(63);
        if (o.isMountpoint(s)) throw new o.ErrnoError(10);
        t.node_ops.rmdir(t, n), o.destroyNode(s);
      },
      readdir(e) {
        var r = o.lookupPath(e, {
          follow: true
        }), t = r.node, n = o.checkOpExists(t.node_ops.readdir, 54);
        return n(t);
      },
      unlink(e) {
        var r = o.lookupPath(e, {
          parent: true
        }), t = r.node;
        if (!t) throw new o.ErrnoError(44);
        var n = se.basename(e), s = o.lookupNode(t, n), i = o.mayDelete(t, n, false);
        if (i) throw new o.ErrnoError(i);
        if (!t.node_ops.unlink) throw new o.ErrnoError(63);
        if (o.isMountpoint(s)) throw new o.ErrnoError(10);
        t.node_ops.unlink(t, n), o.destroyNode(s);
      },
      readlink(e) {
        var r = o.lookupPath(e), t = r.node;
        if (!t) throw new o.ErrnoError(44);
        if (!t.node_ops.readlink) throw new o.ErrnoError(28);
        return t.node_ops.readlink(t);
      },
      stat(e, r) {
        var t = o.lookupPath(e, {
          follow: !r
        }), n = t.node, s = o.checkOpExists(n.node_ops.getattr, 63);
        return s(n);
      },
      fstat(e) {
        var r = o.getStreamChecked(e), t = r.node, n = r.stream_ops.getattr, s = n ? r : t;
        return n ?? (n = t.node_ops.getattr), o.checkOpExists(n, 63), n(s);
      },
      lstat(e) {
        return o.stat(e, true);
      },
      doChmod(e, r, t, n) {
        o.doSetAttr(e, r, {
          mode: t & 4095 | r.mode & -4096,
          ctime: Date.now(),
          dontFollow: n
        });
      },
      chmod(e, r, t) {
        var n;
        if (typeof e == "string") {
          var s = o.lookupPath(e, {
            follow: !t
          });
          n = s.node;
        } else n = e;
        o.doChmod(null, n, r, t);
      },
      lchmod(e, r) {
        o.chmod(e, r, true);
      },
      fchmod(e, r) {
        var t = o.getStreamChecked(e);
        o.doChmod(t, t.node, r, false);
      },
      doChown(e, r, t) {
        o.doSetAttr(e, r, {
          timestamp: Date.now(),
          dontFollow: t
        });
      },
      chown(e, r, t, n) {
        var s;
        if (typeof e == "string") {
          var i = o.lookupPath(e, {
            follow: !n
          });
          s = i.node;
        } else s = e;
        o.doChown(null, s, n);
      },
      lchown(e, r, t) {
        o.chown(e, r, t, true);
      },
      fchown(e, r, t) {
        var n = o.getStreamChecked(e);
        o.doChown(n, n.node, false);
      },
      doTruncate(e, r, t) {
        if (o.isDir(r.mode)) throw new o.ErrnoError(31);
        if (!o.isFile(r.mode)) throw new o.ErrnoError(28);
        var n = o.nodePermissions(r, "w");
        if (n) throw new o.ErrnoError(n);
        o.doSetAttr(e, r, {
          size: t,
          timestamp: Date.now()
        });
      },
      truncate(e, r) {
        if (r < 0) throw new o.ErrnoError(28);
        var t;
        if (typeof e == "string") {
          var n = o.lookupPath(e, {
            follow: true
          });
          t = n.node;
        } else t = e;
        o.doTruncate(null, t, r);
      },
      ftruncate(e, r) {
        var t = o.getStreamChecked(e);
        if (r < 0 || !(t.flags & 2097155)) throw new o.ErrnoError(28);
        o.doTruncate(t, t.node, r);
      },
      utime(e, r, t) {
        var n = o.lookupPath(e, {
          follow: true
        }), s = n.node, i = o.checkOpExists(s.node_ops.setattr, 63);
        i(s, {
          atime: r,
          mtime: t
        });
      },
      open(e, r, t = 438) {
        if (e === "") throw new o.ErrnoError(44);
        r = typeof r == "string" ? kt(r) : r, r & 64 ? t = t & 4095 | 32768 : t = 0;
        var n, s;
        if (typeof e == "object") n = e;
        else {
          s = e.endsWith("/");
          var i = o.lookupPath(e, {
            follow: !(r & 131072),
            noent_okay: true
          });
          n = i.node, e = i.path;
        }
        var a = false;
        if (r & 64) if (n) {
          if (r & 128) throw new o.ErrnoError(20);
        } else {
          if (s) throw new o.ErrnoError(31);
          n = o.mknod(e, t | 511, 0), a = true;
        }
        if (!n) throw new o.ErrnoError(44);
        if (o.isChrdev(n.mode) && (r &= -513), r & 65536 && !o.isDir(n.mode)) throw new o.ErrnoError(54);
        if (!a) {
          var c = o.mayOpen(n, r);
          if (c) throw new o.ErrnoError(c);
        }
        r & 512 && !a && o.truncate(n, 0), r &= -131713;
        var d = o.createStream({
          node: n,
          path: o.getPath(n),
          flags: r,
          seekable: true,
          position: 0,
          stream_ops: n.stream_ops,
          ungotten: [],
          error: false
        });
        return d.stream_ops.open && d.stream_ops.open(d), a && o.chmod(n, t & 511), l.logReadFiles && !(r & 1) && (e in o.readFiles || (o.readFiles[e] = 1)), d;
      },
      close(e) {
        if (o.isClosed(e)) throw new o.ErrnoError(8);
        e.getdents && (e.getdents = null);
        try {
          e.stream_ops.close && e.stream_ops.close(e);
        } catch (r) {
          throw r;
        } finally {
          o.closeStream(e.fd);
        }
        e.fd = null;
      },
      isClosed(e) {
        return e.fd === null;
      },
      llseek(e, r, t) {
        if (o.isClosed(e)) throw new o.ErrnoError(8);
        if (!e.seekable || !e.stream_ops.llseek) throw new o.ErrnoError(70);
        if (t != 0 && t != 1 && t != 2) throw new o.ErrnoError(28);
        return e.position = e.stream_ops.llseek(e, r, t), e.ungotten = [], e.position;
      },
      read(e, r, t, n, s) {
        if (u(t >= 0), n < 0 || s < 0) throw new o.ErrnoError(28);
        if (o.isClosed(e)) throw new o.ErrnoError(8);
        if ((e.flags & 2097155) === 1) throw new o.ErrnoError(8);
        if (o.isDir(e.node.mode)) throw new o.ErrnoError(31);
        if (!e.stream_ops.read) throw new o.ErrnoError(28);
        var i = typeof s < "u";
        if (!i) s = e.position;
        else if (!e.seekable) throw new o.ErrnoError(70);
        var a = e.stream_ops.read(e, r, t, n, s);
        return i || (e.position += a), a;
      },
      write(e, r, t, n, s, i) {
        if (u(t >= 0), n < 0 || s < 0) throw new o.ErrnoError(28);
        if (o.isClosed(e)) throw new o.ErrnoError(8);
        if (!(e.flags & 2097155)) throw new o.ErrnoError(8);
        if (o.isDir(e.node.mode)) throw new o.ErrnoError(31);
        if (!e.stream_ops.write) throw new o.ErrnoError(28);
        e.seekable && e.flags & 1024 && o.llseek(e, 0, 2);
        var a = typeof s < "u";
        if (!a) s = e.position;
        else if (!e.seekable) throw new o.ErrnoError(70);
        var c = e.stream_ops.write(e, r, t, n, s, i);
        return a || (e.position += c), c;
      },
      mmap(e, r, t, n, s) {
        if (n & 2 && !(s & 2) && (e.flags & 2097155) !== 2) throw new o.ErrnoError(2);
        if ((e.flags & 2097155) === 1) throw new o.ErrnoError(2);
        if (!e.stream_ops.mmap) throw new o.ErrnoError(43);
        if (!r) throw new o.ErrnoError(28);
        return e.stream_ops.mmap(e, r, t, n, s);
      },
      msync(e, r, t, n, s) {
        return u(t >= 0), e.stream_ops.msync ? e.stream_ops.msync(e, r, t, n, s) : 0;
      },
      ioctl(e, r, t) {
        if (!e.stream_ops.ioctl) throw new o.ErrnoError(59);
        return e.stream_ops.ioctl(e, r, t);
      },
      readFile(e, r = {}) {
        r.flags = r.flags || 0, r.encoding = r.encoding || "binary", r.encoding !== "utf8" && r.encoding !== "binary" && H(`Invalid encoding type "${r.encoding}"`);
        var t = o.open(e, r.flags), n = o.stat(e), s = n.size, i = new Uint8Array(s);
        return o.read(t, i, 0, s, 0), r.encoding === "utf8" && (i = Le(i)), o.close(t), i;
      },
      writeFile(e, r, t = {}) {
        t.flags = t.flags || 577;
        var n = o.open(e, t.flags, t.mode);
        typeof r == "string" && (r = new Uint8Array(Br(r))), ArrayBuffer.isView(r) ? o.write(n, r, 0, r.byteLength, void 0, t.canOwn) : H("Unsupported data type"), o.close(n);
      },
      cwd: () => o.currentPath,
      chdir(e) {
        var r = o.lookupPath(e, {
          follow: true
        });
        if (r.node === null) throw new o.ErrnoError(44);
        if (!o.isDir(r.node.mode)) throw new o.ErrnoError(54);
        var t = o.nodePermissions(r.node, "x");
        if (t) throw new o.ErrnoError(t);
        o.currentPath = r.path;
      },
      createDefaultDirectories() {
        o.mkdir("/tmp"), o.mkdir("/home"), o.mkdir("/home/web_user");
      },
      createDefaultDevices() {
        o.mkdir("/dev"), o.registerDevice(o.makedev(1, 3), {
          read: () => 0,
          write: (n, s, i, a, c) => a,
          llseek: () => 0
        }), o.mkdev("/dev/null", o.makedev(1, 3)), _r.register(o.makedev(5, 0), _r.default_tty_ops), _r.register(o.makedev(6, 0), _r.default_tty1_ops), o.mkdev("/dev/tty", o.makedev(5, 0)), o.mkdev("/dev/tty1", o.makedev(6, 0));
        var e = new Uint8Array(1024), r = 0, t = () => (r === 0 && (Gr(e), r = e.byteLength), e[--r]);
        o.createDevice("/dev", "random", t), o.createDevice("/dev", "urandom", t), o.mkdir("/dev/shm"), o.mkdir("/dev/shm/tmp");
      },
      createSpecialDirectories() {
        o.mkdir("/proc");
        var e = o.mkdir("/proc/self");
        o.mkdir("/proc/self/fd"), o.mount({
          mount() {
            var r = o.createNode(e, "fd", 16895, 73);
            return r.stream_ops = {
              llseek: I.stream_ops.llseek
            }, r.node_ops = {
              lookup(t, n) {
                var s = +n, i = o.getStreamChecked(s), a = {
                  parent: null,
                  mount: {
                    mountpoint: "fake"
                  },
                  node_ops: {
                    readlink: () => i.path
                  },
                  id: s + 1
                };
                return a.parent = a, a;
              },
              readdir() {
                return Array.from(o.streams.entries()).filter(([t, n]) => n).map(([t, n]) => t.toString());
              }
            }, r;
          }
        }, {}, "/proc/self/fd");
      },
      createStandardStreams(e, r, t) {
        e ? o.createDevice("/dev", "stdin", e) : o.symlink("/dev/tty", "/dev/stdin"), r ? o.createDevice("/dev", "stdout", null, r) : o.symlink("/dev/tty", "/dev/stdout"), t ? o.createDevice("/dev", "stderr", null, t) : o.symlink("/dev/tty1", "/dev/stderr");
        var n = o.open("/dev/stdin", 0), s = o.open("/dev/stdout", 1), i = o.open("/dev/stderr", 1);
        u(n.fd === 0, `invalid handle for stdin (${n.fd})`), u(s.fd === 1, `invalid handle for stdout (${s.fd})`), u(i.fd === 2, `invalid handle for stderr (${i.fd})`);
      },
      staticInit() {
        o.nameTable = new Array(4096), o.mount(I, {}, "/"), o.createDefaultDirectories(), o.createDefaultDevices(), o.createSpecialDirectories(), o.filesystems = {
          MEMFS: I
        };
      },
      init(e, r, t) {
        u(!o.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"), o.initialized = true, e ?? (e = l.stdin), r ?? (r = l.stdout), t ?? (t = l.stderr), o.createStandardStreams(e, r, t);
      },
      quit() {
        o.initialized = false, rt(0);
        for (var e of o.streams) e && o.close(e);
      },
      findObject(e, r) {
        var t = o.analyzePath(e, r);
        return t.exists ? t.object : null;
      },
      analyzePath(e, r) {
        try {
          var t = o.lookupPath(e, {
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
          var t = o.lookupPath(e, {
            parent: true
          });
          n.parentExists = true, n.parentPath = t.path, n.parentObject = t.node, n.name = se.basename(e), t = o.lookupPath(e, {
            follow: !r
          }), n.exists = true, n.path = t.path, n.object = t.node, n.name = t.node.name, n.isRoot = t.path === "/";
        } catch (s) {
          n.error = s.errno;
        }
        return n;
      },
      createPath(e, r, t, n) {
        e = typeof e == "string" ? e : o.getPath(e);
        for (var s = r.split("/").reverse(); s.length; ) {
          var i = s.pop();
          if (i) {
            var a = se.join2(e, i);
            try {
              o.mkdir(a);
            } catch (c) {
              if (c.errno != 20) throw c;
            }
            e = a;
          }
        }
        return a;
      },
      createFile(e, r, t, n, s) {
        var i = se.join2(typeof e == "string" ? e : o.getPath(e), r), a = Ir(n, s);
        return o.create(i, a);
      },
      createDataFile(e, r, t, n, s, i) {
        var a = r;
        e && (e = typeof e == "string" ? e : o.getPath(e), a = r ? se.join2(e, r) : e);
        var c = Ir(n, s), d = o.create(a, c);
        if (t) {
          if (typeof t == "string") {
            for (var m = new Array(t.length), E = 0, g = t.length; E < g; ++E) m[E] = t.charCodeAt(E);
            t = m;
          }
          o.chmod(d, c | 146);
          var y = o.open(d, 577);
          o.write(y, t, 0, t.length, 0, i), o.close(y), o.chmod(d, c);
        }
      },
      createDevice(e, r, t, n) {
        var _a2;
        var s = se.join2(typeof e == "string" ? e : o.getPath(e), r), i = Ir(!!t, !!n);
        (_a2 = o.createDevice).major ?? (_a2.major = 64);
        var a = o.makedev(o.createDevice.major++, 0);
        return o.registerDevice(a, {
          open(c) {
            c.seekable = false;
          },
          close(c) {
            var _a3;
            ((_a3 = n == null ? void 0 : n.buffer) == null ? void 0 : _a3.length) && n(10);
          },
          read(c, d, m, E, g) {
            for (var y = 0, k = 0; k < E; k++) {
              var C;
              try {
                C = t();
              } catch {
                throw new o.ErrnoError(29);
              }
              if (C === void 0 && y === 0) throw new o.ErrnoError(6);
              if (C == null) break;
              y++, d[m + k] = C;
            }
            return y && (c.node.atime = Date.now()), y;
          },
          write(c, d, m, E, g) {
            for (var y = 0; y < E; y++) try {
              n(d[m + y]);
            } catch {
              throw new o.ErrnoError(29);
            }
            return E && (c.node.mtime = c.node.ctime = Date.now()), y;
          }
        }), o.mkdev(s, i, a);
      },
      forceLoadFile(e) {
        if (e.isDevice || e.isFolder || e.link || e.contents) return true;
        if (globalThis.XMLHttpRequest) H("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        else try {
          e.contents = le(e.url);
        } catch {
          throw new o.ErrnoError(29);
        }
      },
      createLazyFile(e, r, t, n, s) {
        class i {
          constructor() {
            __publicField(this, "lengthKnown", false);
            __publicField(this, "chunks", []);
          }
          get(y) {
            if (!(y > this.length - 1 || y < 0)) {
              var k = y % this.chunkSize, C = y / this.chunkSize | 0;
              return this.getter(C)[k];
            }
          }
          setDataGetter(y) {
            this.getter = y;
          }
          cacheLength() {
            var y = new XMLHttpRequest();
            y.open("HEAD", t, false), y.send(null), y.status >= 200 && y.status < 300 || y.status === 304 || H("Couldn't load " + t + ". Status: " + y.status);
            var k = Number(y.getResponseHeader("Content-length")), C, ie = (C = y.getResponseHeader("Accept-Ranges")) && C === "bytes", me = (C = y.getResponseHeader("Content-Encoding")) && C === "gzip", ue = 1024 * 1024;
            ie || (ue = k);
            var De = (Je, Ar) => {
              Je > Ar && H("invalid range (" + Je + ", " + Ar + ") or no bytes requested!"), Ar > k - 1 && H("only " + k + " bytes available! programmer error!");
              var Re = new XMLHttpRequest();
              return Re.open("GET", t, false), k !== ue && Re.setRequestHeader("Range", "bytes=" + Je + "-" + Ar), Re.responseType = "arraybuffer", Re.overrideMimeType && Re.overrideMimeType("text/plain; charset=x-user-defined"), Re.send(null), Re.status >= 200 && Re.status < 300 || Re.status === 304 || H("Couldn't load " + t + ". Status: " + Re.status), Re.response !== void 0 ? new Uint8Array(Re.response || []) : Br(Re.responseText || "");
            }, lr = this;
            lr.setDataGetter((Je) => {
              var Ar = Je * ue, Re = (Je + 1) * ue - 1;
              return Re = Math.min(Re, k - 1), typeof lr.chunks[Je] > "u" && (lr.chunks[Je] = De(Ar, Re)), typeof lr.chunks[Je] > "u" && H("doXHR failed!"), lr.chunks[Je];
            }), (me || !k) && (ue = k = 1, k = this.getter(0).length, ue = k, x("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = k, this._chunkSize = ue, this.lengthKnown = true;
          }
          get length() {
            return this.lengthKnown || this.cacheLength(), this._length;
          }
          get chunkSize() {
            return this.lengthKnown || this.cacheLength(), this._chunkSize;
          }
        }
        if (globalThis.XMLHttpRequest) {
          T || H("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
          var a = new i(), c = {
            isDevice: false,
            contents: a
          };
        } else var c = {
          isDevice: false,
          url: t
        };
        var d = o.createFile(e, r, c, n, s);
        c.contents ? d.contents = c.contents : c.url && (d.contents = null, d.url = c.url), Object.defineProperties(d, {
          usedBytes: {
            get: function() {
              return this.contents.length;
            }
          }
        });
        var m = {};
        for (const [g, y] of Object.entries(d.stream_ops)) m[g] = (...k) => (o.forceLoadFile(d), y(...k));
        function E(g, y, k, C, ie) {
          var me = g.node.contents;
          if (ie >= me.length) return 0;
          var ue = Math.min(me.length - ie, C);
          if (u(ue >= 0), me.slice) for (var De = 0; De < ue; De++) y[k + De] = me[ie + De];
          else for (var De = 0; De < ue; De++) y[k + De] = me.get(ie + De);
          return ue;
        }
        return m.read = (g, y, k, C, ie) => (o.forceLoadFile(d), E(g, y, k, C, ie)), m.mmap = (g, y, k, C, ie) => {
          o.forceLoadFile(d);
          var me = Yr();
          if (!me) throw new o.ErrnoError(48);
          return E(g, ne, me, y, k), {
            ptr: me,
            allocated: true
          };
        }, d.stream_ops = m, d;
      },
      absolutePath() {
        H("FS.absolutePath has been removed; use PATH_FS.resolve instead");
      },
      createFolder() {
        H("FS.createFolder has been removed; use FS.mkdir instead");
      },
      createLink() {
        H("FS.createLink has been removed; use FS.symlink instead");
      },
      joinPath() {
        H("FS.joinPath has been removed; use PATH.join instead");
      },
      mmapAlloc() {
        H("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
      },
      standardizePath() {
        H("FS.standardizePath has been removed; use PATH.normalize instead");
      }
    }, Tr = {
      calculateAt(e, r, t) {
        if (se.isAbs(r)) return r;
        var n;
        if (e === -100) n = o.cwd();
        else {
          var s = Tr.getStreamFromFD(e);
          n = s.path;
        }
        if (r.length == 0) {
          if (!t) throw new o.ErrnoError(44);
          return n;
        }
        return n + "/" + r;
      },
      writeStat(e, r) {
        S[e >> 2] = r.dev, S[e + 4 >> 2] = r.mode, S[e + 8 >> 2] = r.nlink, S[e + 12 >> 2] = r.uid, S[e + 16 >> 2] = r.gid, S[e + 20 >> 2] = r.rdev, G[e + 24 >> 3] = BigInt(r.size), we[e + 32 >> 2] = 4096, we[e + 36 >> 2] = r.blocks;
        var t = r.atime.getTime(), n = r.mtime.getTime(), s = r.ctime.getTime();
        return G[e + 40 >> 3] = BigInt(Math.floor(t / 1e3)), S[e + 48 >> 2] = t % 1e3 * 1e3 * 1e3, G[e + 56 >> 3] = BigInt(Math.floor(n / 1e3)), S[e + 64 >> 2] = n % 1e3 * 1e3 * 1e3, G[e + 72 >> 3] = BigInt(Math.floor(s / 1e3)), S[e + 80 >> 2] = s % 1e3 * 1e3 * 1e3, G[e + 88 >> 3] = BigInt(r.ino), 0;
      },
      writeStatFs(e, r) {
        S[e + 4 >> 2] = r.bsize, S[e + 60 >> 2] = r.bsize, G[e + 8 >> 3] = BigInt(r.blocks), G[e + 16 >> 3] = BigInt(r.bfree), G[e + 24 >> 3] = BigInt(r.bavail), G[e + 32 >> 3] = BigInt(r.files), G[e + 40 >> 3] = BigInt(r.ffree), S[e + 48 >> 2] = r.fsid, S[e + 64 >> 2] = r.flags, S[e + 56 >> 2] = r.namelen;
      },
      doMsync(e, r, t, n, s) {
        if (!o.isFile(r.node.mode)) throw new o.ErrnoError(43);
        if (n & 2) return 0;
        var i = ge.slice(e, e + t);
        o.msync(r, i, s, t, n);
      },
      getStreamFromFD(e) {
        var r = o.getStreamChecked(e);
        return r;
      },
      varargs: void 0,
      getStr(e) {
        var r = Ce(e);
        return r;
      }
    };
    function Nt(e) {
      try {
        var r = Tr.getStreamFromFD(e);
        return o.close(r), 0;
      } catch (t) {
        if (typeof o > "u" || t.name !== "ErrnoError") throw t;
        return t.errno;
      }
    }
    var Dt = (e, r, t, n) => {
      for (var s = 0, i = 0; i < t; i++) {
        var a = S[r >> 2], c = S[r + 4 >> 2];
        r += 8;
        var d = o.read(e, ne, a, c, n);
        if (d < 0) return -1;
        if (s += d, d < c) break;
      }
      return s;
    };
    function xt(e, r, t, n) {
      try {
        var s = Tr.getStreamFromFD(e), i = Dt(s, r, t);
        return S[n >> 2] = i, 0;
      } catch (a) {
        if (typeof o > "u" || a.name !== "ErrnoError") throw a;
        return a.errno;
      }
    }
    function Ht(e, r, t, n) {
      r = hr(r);
      try {
        if (isNaN(r)) return 61;
        var s = Tr.getStreamFromFD(e);
        return o.llseek(s, r, t), G[n >> 3] = BigInt(s.position), s.getdents && r === 0 && t === 0 && (s.getdents = null), 0;
      } catch (i) {
        if (typeof o > "u" || i.name !== "ErrnoError") throw i;
        return i.errno;
      }
    }
    var Ct = (e, r, t, n) => {
      for (var s = 0, i = 0; i < t; i++) {
        var a = S[r >> 2], c = S[r + 4 >> 2];
        r += 8;
        var d = o.write(e, ne, a, c, n);
        if (d < 0) return -1;
        if (s += d, d < c) break;
      }
      return s;
    };
    function Lt(e, r, t, n) {
      try {
        var s = Tr.getStreamFromFD(e), i = Ct(s, r, t);
        return S[n >> 2] = i, 0;
      } catch (a) {
        if (typeof o > "u" || a.name !== "ErrnoError") throw a;
        return a.errno;
      }
    }
    var zt = (e) => e, Jr = [], b = (e) => {
      var r = Jr[e];
      return r || (Jr[e] = r = Kr.get(e)), u(Kr.get(e) == r, "JavaScript-side Wasm function table mirror is out of date!"), r;
    }, Bt = (e) => xr(e), It = (e) => jr(e), Qr = (e) => it(e), Wt = (e) => {
      var r = w(), t = Qr(4), n = Qr(4);
      ct(e, t, n);
      var s = S[t >> 2], i = S[n >> 2], a = Ce(s);
      Wr(s);
      var c;
      return i && (c = Ce(i), Wr(i)), A(r), [
        a,
        c
      ];
    }, et = (e) => Wt(e);
    o.createPreloadedFile = Rt, o.preloadFile = Zr, o.staticInit();
    {
      if (l.noExitRuntime && l.noExitRuntime, l.preloadPlugins && (Xr = l.preloadPlugins), l.print && (x = l.print), l.printErr && (O = l.printErr), l.wasmBinary && (U = l.wasmBinary), Kt(), l.arguments && l.arguments, l.thisProgram && (V = l.thisProgram), u(typeof l.memoryInitializerPrefixURL > "u", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead"), u(typeof l.pthreadMainPrefixURL > "u", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead"), u(typeof l.cdInitializerPrefixURL > "u", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead"), u(typeof l.filePackagePrefixURL > "u", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead"), u(typeof l.read > "u", "Module.read option was removed"), u(typeof l.readAsync > "u", "Module.readAsync option was removed (modify readAsync in JS)"), u(typeof l.readBinary > "u", "Module.readBinary option was removed (modify readBinary in JS)"), u(typeof l.setWindowTitle > "u", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)"), u(typeof l.TOTAL_MEMORY > "u", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY"), u(typeof l.ENVIRONMENT > "u", "Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)"), u(typeof l.STACK_SIZE > "u", "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time"), u(typeof l.wasmMemory > "u", "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally"), u(typeof l.INITIAL_MEMORY > "u", "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically"), l.preInit) for (typeof l.preInit == "function" && (l.preInit = [
        l.preInit
      ]); l.preInit.length > 0; ) l.preInit.shift()();
      te("preInit");
    }
    var Vt = [
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
    Vt.forEach(ye);
    var jt = [
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
    jt.forEach(_e), l.incrementExceptionRefcount = Bt, l.decrementExceptionRefcount = It, l.getExceptionMessage = et;
    function Kt() {
      Pe("fetchSettings");
    }
    l._deform = P("_deform"), l._malloc = P("_malloc");
    var Wr = l._free = P("_free");
    l._assembled_joint_mass = P("_assembled_joint_mass"), l._modal = P("_modal"), l._modal_paz = P("_modal_paz"), l._didactic_solve = P("_didactic_solve"), l._plate_q4_solve = P("_plate_q4_solve"), l._slopeAllocDouble = P("_slopeAllocDouble"), l._slopeStabilitySolver = P("_slopeStabilitySolver"), l._nonlinear_dynamic = P("_nonlinear_dynamic"), l._steel02_test = P("_steel02_test"), l._cyclic_pushover = P("_cyclic_pushover"), l._concrete02_test = P("_concrete02_test"), l._hex8_solve = P("_hex8_solve"), l._hex8_stress = P("_hex8_stress");
    var rt = P("_fflush"), tt = P("_strerror"), Vr = P("_emscripten_stack_get_end"), F = P("_setThrew"), nt = P("__emscripten_tempret_set"), ot = P("_emscripten_stack_init"), st = P("__emscripten_stack_restore"), it = P("__emscripten_stack_alloc"), at = P("_emscripten_stack_get_current"), jr = P("___cxa_decrement_exception_refcount"), xr = P("___cxa_increment_exception_refcount"), ct = P("___get_exception_message"), lt = P("___cxa_can_catch"), dt = P("___cxa_get_exception_ptr"), Hr = P("wasmMemory"), Kr = P("wasmTable");
    function $t(e) {
      u(typeof e.deform < "u", "missing Wasm export: deform"), u(typeof e.malloc < "u", "missing Wasm export: malloc"), u(typeof e.free < "u", "missing Wasm export: free"), u(typeof e.__cxa_free_exception < "u", "missing Wasm export: __cxa_free_exception"), u(typeof e.assembled_joint_mass < "u", "missing Wasm export: assembled_joint_mass"), u(typeof e.modal < "u", "missing Wasm export: modal"), u(typeof e.modal_paz < "u", "missing Wasm export: modal_paz"), u(typeof e.didactic_solve < "u", "missing Wasm export: didactic_solve"), u(typeof e.plate_q4_solve < "u", "missing Wasm export: plate_q4_solve"), u(typeof e.slopeAllocDouble < "u", "missing Wasm export: slopeAllocDouble"), u(typeof e.slopeStabilitySolver < "u", "missing Wasm export: slopeStabilitySolver"), u(typeof e.nonlinear_dynamic < "u", "missing Wasm export: nonlinear_dynamic"), u(typeof e.steel02_test < "u", "missing Wasm export: steel02_test"), u(typeof e.cyclic_pushover < "u", "missing Wasm export: cyclic_pushover"), u(typeof e.concrete02_test < "u", "missing Wasm export: concrete02_test"), u(typeof e.hex8_solve < "u", "missing Wasm export: hex8_solve"), u(typeof e.hex8_stress < "u", "missing Wasm export: hex8_stress"), u(typeof e.fflush < "u", "missing Wasm export: fflush"), u(typeof e.strerror < "u", "missing Wasm export: strerror"), u(typeof e.emscripten_stack_get_end < "u", "missing Wasm export: emscripten_stack_get_end"), u(typeof e.emscripten_stack_get_base < "u", "missing Wasm export: emscripten_stack_get_base"), u(typeof e.setThrew < "u", "missing Wasm export: setThrew"), u(typeof e._emscripten_tempret_set < "u", "missing Wasm export: _emscripten_tempret_set"), u(typeof e.emscripten_stack_init < "u", "missing Wasm export: emscripten_stack_init"), u(typeof e.emscripten_stack_get_free < "u", "missing Wasm export: emscripten_stack_get_free"), u(typeof e._emscripten_stack_restore < "u", "missing Wasm export: _emscripten_stack_restore"), u(typeof e._emscripten_stack_alloc < "u", "missing Wasm export: _emscripten_stack_alloc"), u(typeof e.emscripten_stack_get_current < "u", "missing Wasm export: emscripten_stack_get_current"), u(typeof e.__cxa_decrement_exception_refcount < "u", "missing Wasm export: __cxa_decrement_exception_refcount"), u(typeof e.__cxa_increment_exception_refcount < "u", "missing Wasm export: __cxa_increment_exception_refcount"), u(typeof e.__get_exception_message < "u", "missing Wasm export: __get_exception_message"), u(typeof e.__cxa_can_catch < "u", "missing Wasm export: __cxa_can_catch"), u(typeof e.__cxa_get_exception_ptr < "u", "missing Wasm export: __cxa_get_exception_ptr"), u(typeof e.memory < "u", "missing Wasm export: memory"), u(typeof e.__indirect_function_table < "u", "missing Wasm export: __indirect_function_table"), l._deform = R("deform", 80), l._malloc = R("malloc", 1), Wr = l._free = R("free", 1), l._assembled_joint_mass = R("assembled_joint_mass", 22), l._modal = R("modal", 84), l._modal_paz = R("modal_paz", 54), l._didactic_solve = R("didactic_solve", 48), l._plate_q4_solve = R("plate_q4_solve", 26), l._slopeAllocDouble = R("slopeAllocDouble", 1), l._slopeStabilitySolver = R("slopeStabilitySolver", 16), l._nonlinear_dynamic = R("nonlinear_dynamic", 20), l._steel02_test = R("steel02_test", 8), l._cyclic_pushover = R("cyclic_pushover", 40), l._concrete02_test = R("concrete02_test", 10), l._hex8_solve = R("hex8_solve", 18), l._hex8_stress = R("hex8_stress", 7), rt = R("fflush", 1), tt = R("strerror", 1), Vr = e.emscripten_stack_get_end, e.emscripten_stack_get_base, F = R("setThrew", 2), nt = R("_emscripten_tempret_set", 1), ot = e.emscripten_stack_init, e.emscripten_stack_get_free, st = e._emscripten_stack_restore, it = e._emscripten_stack_alloc, at = e.emscripten_stack_get_current, jr = R("__cxa_decrement_exception_refcount", 1), xr = R("__cxa_increment_exception_refcount", 1), ct = R("__get_exception_message", 3), lt = R("__cxa_can_catch", 3), dt = R("__cxa_get_exception_ptr", 1), Hr = e.memory, Kr = e.__indirect_function_table;
    }
    var ft = {
      __assert_fail: or,
      __cxa_begin_catch: sr,
      __cxa_end_catch: Ye,
      __cxa_find_matching_catch_2: rr,
      __cxa_find_matching_catch_3: fr,
      __cxa_rethrow: Er,
      __cxa_throw: he,
      __cxa_uncaught_exceptions: Oe,
      __resumeException: ur,
      _abort_js: ir,
      _tzset_js: Mr,
      clock_time_get: Nr,
      emscripten_resize_heap: yt,
      environ_get: gt,
      environ_sizes_get: wt,
      fd_close: Nt,
      fd_read: xt,
      fd_seek: Ht,
      fd_write: Lt,
      invoke_di: Cn,
      invoke_dii: An,
      invoke_diii: qn,
      invoke_fiii: Yn,
      invoke_i: Xn,
      invoke_ii: qt,
      invoke_iid: nn,
      invoke_iii: rn,
      invoke_iiii: Gt,
      invoke_iiiii: un,
      invoke_iiiiid: jn,
      invoke_iiiiii: sn,
      invoke_iiiiiii: dn,
      invoke_iiiiiiid: en,
      invoke_iiiiiiii: yn,
      invoke_iiiiiiiii: pn,
      invoke_iiiiiiiiii: vn,
      invoke_iiiiiiiiiii: Kn,
      invoke_iiiiiiiiiiii: Zn,
      invoke_iiiiiiiiiiiii: Gn,
      invoke_iiiiiiiiiiiiiii: _n,
      invoke_j: Vn,
      invoke_jiiii: $n,
      invoke_v: Yt,
      invoke_vddiiii: Tn,
      invoke_vi: fn,
      invoke_vid: an,
      invoke_vidddddddddddddi: Dn,
      invoke_viddii: xn,
      invoke_vii: tn,
      invoke_viid: cn,
      invoke_viidd: Rn,
      invoke_viiddd: Mn,
      invoke_viiddi: Hn,
      invoke_viii: Jt,
      invoke_viiid: on,
      invoke_viiidd: In,
      invoke_viiiddd: On,
      invoke_viiidddd: Bn,
      invoke_viiidddddd: Wn,
      invoke_viiidddi: zn,
      invoke_viiidddidiiddiii: Ln,
      invoke_viiii: Zt,
      invoke_viiiii: Xt,
      invoke_viiiiid: Fn,
      invoke_viiiiidiii: Un,
      invoke_viiiiii: Qt,
      invoke_viiiiiid: Sn,
      invoke_viiiiiii: gn,
      invoke_viiiiiiidiiii: wn,
      invoke_viiiiiiii: ln,
      invoke_viiiiiiiii: En,
      invoke_viiiiiiiiii: hn,
      invoke_viiiiiiiiiidii: kn,
      invoke_viiiiiiiiiii: Pn,
      invoke_viiiiiiiiiiiddddii: Nn,
      invoke_viiiiiiiiiiii: bn,
      invoke_viiiiiiiiiiiiiii: Jn,
      invoke_viiiiiiiiiiiiiiii: mn,
      llvm_eh_typeid_for: zt
    };
    function Gt(e, r, t, n) {
      var s = w();
      try {
        return b(e)(r, t, n);
      } catch (i) {
        if (A(s), !(i instanceof p)) throw i;
        F(1, 0);
      }
    }
    function Yt(e) {
      var r = w();
      try {
        b(e)();
      } catch (t) {
        if (A(r), !(t instanceof p)) throw t;
        F(1, 0);
      }
    }
    function qt(e, r) {
      var t = w();
      try {
        return b(e)(r);
      } catch (n) {
        if (A(t), !(n instanceof p)) throw n;
        F(1, 0);
      }
    }
    function Xt(e, r, t, n, s, i) {
      var a = w();
      try {
        b(e)(r, t, n, s, i);
      } catch (c) {
        if (A(a), !(c instanceof p)) throw c;
        F(1, 0);
      }
    }
    function Zt(e, r, t, n, s) {
      var i = w();
      try {
        b(e)(r, t, n, s);
      } catch (a) {
        if (A(i), !(a instanceof p)) throw a;
        F(1, 0);
      }
    }
    function Jt(e, r, t, n) {
      var s = w();
      try {
        b(e)(r, t, n);
      } catch (i) {
        if (A(s), !(i instanceof p)) throw i;
        F(1, 0);
      }
    }
    function Qt(e, r, t, n, s, i, a) {
      var c = w();
      try {
        b(e)(r, t, n, s, i, a);
      } catch (d) {
        if (A(c), !(d instanceof p)) throw d;
        F(1, 0);
      }
    }
    function en(e, r, t, n, s, i, a, c) {
      var d = w();
      try {
        return b(e)(r, t, n, s, i, a, c);
      } catch (m) {
        if (A(d), !(m instanceof p)) throw m;
        F(1, 0);
      }
    }
    function rn(e, r, t) {
      var n = w();
      try {
        return b(e)(r, t);
      } catch (s) {
        if (A(n), !(s instanceof p)) throw s;
        F(1, 0);
      }
    }
    function tn(e, r, t) {
      var n = w();
      try {
        b(e)(r, t);
      } catch (s) {
        if (A(n), !(s instanceof p)) throw s;
        F(1, 0);
      }
    }
    function nn(e, r, t) {
      var n = w();
      try {
        return b(e)(r, t);
      } catch (s) {
        if (A(n), !(s instanceof p)) throw s;
        F(1, 0);
      }
    }
    function on(e, r, t, n, s) {
      var i = w();
      try {
        b(e)(r, t, n, s);
      } catch (a) {
        if (A(i), !(a instanceof p)) throw a;
        F(1, 0);
      }
    }
    function sn(e, r, t, n, s, i) {
      var a = w();
      try {
        return b(e)(r, t, n, s, i);
      } catch (c) {
        if (A(a), !(c instanceof p)) throw c;
        F(1, 0);
      }
    }
    function an(e, r, t) {
      var n = w();
      try {
        b(e)(r, t);
      } catch (s) {
        if (A(n), !(s instanceof p)) throw s;
        F(1, 0);
      }
    }
    function cn(e, r, t, n) {
      var s = w();
      try {
        b(e)(r, t, n);
      } catch (i) {
        if (A(s), !(i instanceof p)) throw i;
        F(1, 0);
      }
    }
    function ln(e, r, t, n, s, i, a, c, d) {
      var m = w();
      try {
        b(e)(r, t, n, s, i, a, c, d);
      } catch (E) {
        if (A(m), !(E instanceof p)) throw E;
        F(1, 0);
      }
    }
    function dn(e, r, t, n, s, i, a) {
      var c = w();
      try {
        return b(e)(r, t, n, s, i, a);
      } catch (d) {
        if (A(c), !(d instanceof p)) throw d;
        F(1, 0);
      }
    }
    function fn(e, r) {
      var t = w();
      try {
        b(e)(r);
      } catch (n) {
        if (A(t), !(n instanceof p)) throw n;
        F(1, 0);
      }
    }
    function un(e, r, t, n, s) {
      var i = w();
      try {
        return b(e)(r, t, n, s);
      } catch (a) {
        if (A(i), !(a instanceof p)) throw a;
        F(1, 0);
      }
    }
    function mn(e, r, t, n, s, i, a, c, d, m, E, g, y, k, C, ie, me) {
      var ue = w();
      try {
        b(e)(r, t, n, s, i, a, c, d, m, E, g, y, k, C, ie, me);
      } catch (De) {
        if (A(ue), !(De instanceof p)) throw De;
        F(1, 0);
      }
    }
    function hn(e, r, t, n, s, i, a, c, d, m, E) {
      var g = w();
      try {
        b(e)(r, t, n, s, i, a, c, d, m, E);
      } catch (y) {
        if (A(g), !(y instanceof p)) throw y;
        F(1, 0);
      }
    }
    function _n(e, r, t, n, s, i, a, c, d, m, E, g, y, k, C) {
      var ie = w();
      try {
        return b(e)(r, t, n, s, i, a, c, d, m, E, g, y, k, C);
      } catch (me) {
        if (A(ie), !(me instanceof p)) throw me;
        F(1, 0);
      }
    }
    function vn(e, r, t, n, s, i, a, c, d, m) {
      var E = w();
      try {
        return b(e)(r, t, n, s, i, a, c, d, m);
      } catch (g) {
        if (A(E), !(g instanceof p)) throw g;
        F(1, 0);
      }
    }
    function pn(e, r, t, n, s, i, a, c, d) {
      var m = w();
      try {
        return b(e)(r, t, n, s, i, a, c, d);
      } catch (E) {
        if (A(m), !(E instanceof p)) throw E;
        F(1, 0);
      }
    }
    function yn(e, r, t, n, s, i, a, c) {
      var d = w();
      try {
        return b(e)(r, t, n, s, i, a, c);
      } catch (m) {
        if (A(d), !(m instanceof p)) throw m;
        F(1, 0);
      }
    }
    function En(e, r, t, n, s, i, a, c, d, m) {
      var E = w();
      try {
        b(e)(r, t, n, s, i, a, c, d, m);
      } catch (g) {
        if (A(E), !(g instanceof p)) throw g;
        F(1, 0);
      }
    }
    function gn(e, r, t, n, s, i, a, c) {
      var d = w();
      try {
        b(e)(r, t, n, s, i, a, c);
      } catch (m) {
        if (A(d), !(m instanceof p)) throw m;
        F(1, 0);
      }
    }
    function wn(e, r, t, n, s, i, a, c, d, m, E, g, y) {
      var k = w();
      try {
        b(e)(r, t, n, s, i, a, c, d, m, E, g, y);
      } catch (C) {
        if (A(k), !(C instanceof p)) throw C;
        F(1, 0);
      }
    }
    function Pn(e, r, t, n, s, i, a, c, d, m, E, g) {
      var y = w();
      try {
        b(e)(r, t, n, s, i, a, c, d, m, E, g);
      } catch (k) {
        if (A(y), !(k instanceof p)) throw k;
        F(1, 0);
      }
    }
    function An(e, r, t) {
      var n = w();
      try {
        return b(e)(r, t);
      } catch (s) {
        if (A(n), !(s instanceof p)) throw s;
        F(1, 0);
      }
    }
    function kn(e, r, t, n, s, i, a, c, d, m, E, g, y, k) {
      var C = w();
      try {
        b(e)(r, t, n, s, i, a, c, d, m, E, g, y, k);
      } catch (ie) {
        if (A(C), !(ie instanceof p)) throw ie;
        F(1, 0);
      }
    }
    function Sn(e, r, t, n, s, i, a, c) {
      var d = w();
      try {
        b(e)(r, t, n, s, i, a, c);
      } catch (m) {
        if (A(d), !(m instanceof p)) throw m;
        F(1, 0);
      }
    }
    function Fn(e, r, t, n, s, i, a) {
      var c = w();
      try {
        b(e)(r, t, n, s, i, a);
      } catch (d) {
        if (A(c), !(d instanceof p)) throw d;
        F(1, 0);
      }
    }
    function bn(e, r, t, n, s, i, a, c, d, m, E, g, y) {
      var k = w();
      try {
        b(e)(r, t, n, s, i, a, c, d, m, E, g, y);
      } catch (C) {
        if (A(k), !(C instanceof p)) throw C;
        F(1, 0);
      }
    }
    function Tn(e, r, t, n, s, i, a) {
      var c = w();
      try {
        b(e)(r, t, n, s, i, a);
      } catch (d) {
        if (A(c), !(d instanceof p)) throw d;
        F(1, 0);
      }
    }
    function Mn(e, r, t, n, s, i) {
      var a = w();
      try {
        b(e)(r, t, n, s, i);
      } catch (c) {
        if (A(a), !(c instanceof p)) throw c;
        F(1, 0);
      }
    }
    function Un(e, r, t, n, s, i, a, c, d, m) {
      var E = w();
      try {
        b(e)(r, t, n, s, i, a, c, d, m);
      } catch (g) {
        if (A(E), !(g instanceof p)) throw g;
        F(1, 0);
      }
    }
    function On(e, r, t, n, s, i, a) {
      var c = w();
      try {
        b(e)(r, t, n, s, i, a);
      } catch (d) {
        if (A(c), !(d instanceof p)) throw d;
        F(1, 0);
      }
    }
    function Rn(e, r, t, n, s) {
      var i = w();
      try {
        b(e)(r, t, n, s);
      } catch (a) {
        if (A(i), !(a instanceof p)) throw a;
        F(1, 0);
      }
    }
    function Nn(e, r, t, n, s, i, a, c, d, m, E, g, y, k, C, ie, me, ue) {
      var De = w();
      try {
        b(e)(r, t, n, s, i, a, c, d, m, E, g, y, k, C, ie, me, ue);
      } catch (lr) {
        if (A(De), !(lr instanceof p)) throw lr;
        F(1, 0);
      }
    }
    function Dn(e, r, t, n, s, i, a, c, d, m, E, g, y, k, C, ie) {
      var me = w();
      try {
        b(e)(r, t, n, s, i, a, c, d, m, E, g, y, k, C, ie);
      } catch (ue) {
        if (A(me), !(ue instanceof p)) throw ue;
        F(1, 0);
      }
    }
    function xn(e, r, t, n, s, i) {
      var a = w();
      try {
        b(e)(r, t, n, s, i);
      } catch (c) {
        if (A(a), !(c instanceof p)) throw c;
        F(1, 0);
      }
    }
    function Hn(e, r, t, n, s, i) {
      var a = w();
      try {
        b(e)(r, t, n, s, i);
      } catch (c) {
        if (A(a), !(c instanceof p)) throw c;
        F(1, 0);
      }
    }
    function Cn(e, r) {
      var t = w();
      try {
        return b(e)(r);
      } catch (n) {
        if (A(t), !(n instanceof p)) throw n;
        F(1, 0);
      }
    }
    function Ln(e, r, t, n, s, i, a, c, d, m, E, g, y, k, C, ie) {
      var me = w();
      try {
        b(e)(r, t, n, s, i, a, c, d, m, E, g, y, k, C, ie);
      } catch (ue) {
        if (A(me), !(ue instanceof p)) throw ue;
        F(1, 0);
      }
    }
    function zn(e, r, t, n, s, i, a, c) {
      var d = w();
      try {
        b(e)(r, t, n, s, i, a, c);
      } catch (m) {
        if (A(d), !(m instanceof p)) throw m;
        F(1, 0);
      }
    }
    function Bn(e, r, t, n, s, i, a, c) {
      var d = w();
      try {
        b(e)(r, t, n, s, i, a, c);
      } catch (m) {
        if (A(d), !(m instanceof p)) throw m;
        F(1, 0);
      }
    }
    function In(e, r, t, n, s, i) {
      var a = w();
      try {
        b(e)(r, t, n, s, i);
      } catch (c) {
        if (A(a), !(c instanceof p)) throw c;
        F(1, 0);
      }
    }
    function Wn(e, r, t, n, s, i, a, c, d, m) {
      var E = w();
      try {
        b(e)(r, t, n, s, i, a, c, d, m);
      } catch (g) {
        if (A(E), !(g instanceof p)) throw g;
        F(1, 0);
      }
    }
    function Vn(e) {
      var r = w();
      try {
        return b(e)();
      } catch (t) {
        if (A(r), !(t instanceof p)) throw t;
        return F(1, 0), 0n;
      }
    }
    function jn(e, r, t, n, s, i) {
      var a = w();
      try {
        return b(e)(r, t, n, s, i);
      } catch (c) {
        if (A(a), !(c instanceof p)) throw c;
        F(1, 0);
      }
    }
    function Kn(e, r, t, n, s, i, a, c, d, m, E) {
      var g = w();
      try {
        return b(e)(r, t, n, s, i, a, c, d, m, E);
      } catch (y) {
        if (A(g), !(y instanceof p)) throw y;
        F(1, 0);
      }
    }
    function $n(e, r, t, n, s) {
      var i = w();
      try {
        return b(e)(r, t, n, s);
      } catch (a) {
        if (A(i), !(a instanceof p)) throw a;
        return F(1, 0), 0n;
      }
    }
    function Gn(e, r, t, n, s, i, a, c, d, m, E, g, y) {
      var k = w();
      try {
        return b(e)(r, t, n, s, i, a, c, d, m, E, g, y);
      } catch (C) {
        if (A(k), !(C instanceof p)) throw C;
        F(1, 0);
      }
    }
    function Yn(e, r, t, n) {
      var s = w();
      try {
        return b(e)(r, t, n);
      } catch (i) {
        if (A(s), !(i instanceof p)) throw i;
        F(1, 0);
      }
    }
    function qn(e, r, t, n) {
      var s = w();
      try {
        return b(e)(r, t, n);
      } catch (i) {
        if (A(s), !(i instanceof p)) throw i;
        F(1, 0);
      }
    }
    function Xn(e) {
      var r = w();
      try {
        return b(e)();
      } catch (t) {
        if (A(r), !(t instanceof p)) throw t;
        F(1, 0);
      }
    }
    function Zn(e, r, t, n, s, i, a, c, d, m, E, g) {
      var y = w();
      try {
        return b(e)(r, t, n, s, i, a, c, d, m, E, g);
      } catch (k) {
        if (A(y), !(k instanceof p)) throw k;
        F(1, 0);
      }
    }
    function Jn(e, r, t, n, s, i, a, c, d, m, E, g, y, k, C, ie) {
      var me = w();
      try {
        b(e)(r, t, n, s, i, a, c, d, m, E, g, y, k, C, ie);
      } catch (ue) {
        if (A(me), !(ue instanceof p)) throw ue;
        F(1, 0);
      }
    }
    var ut;
    function Qn() {
      ot(), X();
    }
    function $r() {
      if (vr > 0) {
        br = $r;
        return;
      }
      if (Qn(), Te(), vr > 0) {
        br = $r;
        return;
      }
      function e() {
        var _a2;
        u(!ut), ut = true, l.calledRun = true, !j && (ve(), Ae == null ? void 0 : Ae(l), (_a2 = l.onRuntimeInitialized) == null ? void 0 : _a2.call(l), te("onRuntimeInitialized"), u(!l._main, 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]'), Me());
      }
      l.setStatus ? (l.setStatus("Running..."), setTimeout(() => {
        setTimeout(() => l.setStatus(""), 1), e();
      }, 1)) : e(), Z();
    }
    var Pr;
    Pr = await je(), $r(), be ? _ = l : _ = new Promise((e, r) => {
      Ae = e, Ee = r;
    });
    for (const e of Object.keys(l)) e in h || Object.defineProperty(h, e, {
      configurable: true,
      get() {
        H(`Access to module property ('${e}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`);
      }
    });
    return _;
  };
  function _t(h) {
    const _ = new Array(12).fill(0);
    if (!h) return _;
    if (h.length >= 12) {
      for (let f = 0; f < 12; f++) _[f] = h[f] ? 1 : 0;
      return _;
    }
    const l = [
      3,
      4,
      5,
      9,
      10,
      11
    ];
    for (let f = 0; f < 6 && f < h.length; f++) h[f] && (_[l[f]] = 1);
    return _;
  }
  const L = await Sr();
  so = function(h, _, l, f, T) {
    if (h.length === 0) return;
    const v = [], ee = ae(h.flat(), Float64Array, L.HEAPF64);
    v.push(ee);
    const W = _.flat(), V = ae(W, Uint32Array, L.HEAPU32);
    v.push(V);
    const ce = _.map((J) => J.length), M = ae(ce, Uint32Array, L.HEAPU32);
    v.push(M);
    const re = l.supports ? Array.from(l.supports.keys()) : [], q = l.supports ? Array.from(l.supports.values()).flat().map((J) => J ? 1 : 0) : [], le = ae(re, Uint32Array, L.HEAPU32);
    v.push(le);
    const D = ae(q, Uint8Array, L.HEAPU8);
    v.push(D);
    const x = l.loads ? Array.from(l.loads.keys()) : [], O = l.loads ? Array.from(l.loads.values()).flat() : [], U = ae(x, Uint32Array, L.HEAPU32);
    v.push(U);
    const j = ae(O, Float64Array, L.HEAPF64);
    v.push(j);
    const u = (J) => {
      const Ze = J ? Array.from(J.keys()) : [], hr = J ? Array.from(J.values()) : [], Nr = ae(Ze, Uint32Array, L.HEAPU32);
      v.push(Nr);
      const Dr = ae(hr, Float64Array, L.HEAPF64);
      return v.push(Dr), {
        keysPtr: Nr,
        valuesPtr: Dr,
        size: Ze.length
      };
    }, N = u(f.elasticities), X = u(f.elasticitiesOrthogonal), Z = u(f.areas), p = u(f.momentsOfInertiaZ), de = u(f.momentsOfInertiaY), te = u(f.shearModuli), P = u(f.torsionalConstants), Pe = u(f.thicknesses), pe = u(f.poissonsRatios), ye = u(f.shearAreasY), _e = u(f.shearAreasZ), Ae = f.rigidOffsets ? Array.from(f.rigidOffsets.keys()) : [], Ee = f.rigidOffsets ? Array.from(f.rigidOffsets.values()).flat() : [], ne = ae(Ae, Uint32Array, L.HEAPU32);
    v.push(ne);
    const ge = ae(Ee, Float64Array, L.HEAPF64);
    v.push(ge);
    const we = f.momentReleases ? Array.from(f.momentReleases.keys()) : [], S = f.momentReleases ? Array.from(f.momentReleases.values()).flatMap(_t) : [], G = ae(we, Uint32Array, L.HEAPU32);
    v.push(G);
    const be = ae(S, Uint8Array, L.HEAPU8);
    v.push(be);
    const Se = L._malloc(4);
    v.push(Se);
    const Te = L._malloc(4);
    v.push(Te);
    const ve = L._malloc(4);
    v.push(ve);
    const Me = L._malloc(4);
    v.push(Me);
    const H = T ? T.flatMap((J) => [
      J.node,
      J.dof,
      J.k
    ]) : [], R = ae(H.length > 0 ? H : [
      0
    ], Float64Array, L.HEAPF64);
    v.push(R);
    const Fe = f.plateFormulations, Ne = Fe ? Array.from(Fe.keys()) : [], Y = Fe ? Array.from(Fe.values()) : [], fe = ae(Ne, Uint32Array, L.HEAPU32);
    v.push(fe);
    const z = ae(Y, Uint32Array, L.HEAPU32);
    v.push(z);
    const K = f.drillingTypes, oe = K ? Array.from(K.keys()) : [], je = K ? Array.from(K.values()) : [], ze = ae(oe, Uint32Array, L.HEAPU32);
    v.push(ze);
    const Qe = ae(je, Uint32Array, L.HEAPU32);
    v.push(Qe);
    const Ke = f.drillingPenaltyScales, $e = Ke ? Array.from(Ke.keys()) : [], yr = Ke ? Array.from(Ke.values()) : [], Be = ae($e, Uint32Array, L.HEAPU32);
    v.push(Be);
    const A = ae(yr, Float64Array, L.HEAPF64);
    v.push(A);
    const w = f.membraneModifiers, He = f.bendingModifiers, er = w ? Array.from(w.keys()) : [], dr = w ? Array.from(w.values()) : [], Le = ae(er, Uint32Array, L.HEAPU32);
    v.push(Le);
    const Ce = ae(dr, Float64Array, L.HEAPF64);
    v.push(Ce);
    const or = He ? Array.from(He.keys()) : [], Ie = He ? Array.from(He.values()) : [], Ge = ae(or, Uint32Array, L.HEAPU32);
    v.push(Ge);
    const sr = ae(Ie, Float64Array, L.HEAPF64);
    v.push(sr);
    const Ue = f.shellModifiers, Ye = Ue ? Array.from(Ue.keys()) : [], qe = [];
    if (Ue) for (const J of Ye) {
      const Ze = Ue.get(J);
      for (let hr = 0; hr < 8; hr++) qe.push(Ze[hr] ?? 1);
    }
    const We = ae(Ye, Uint32Array, L.HEAPU32);
    v.push(We);
    const Xe = ae(qe, Float64Array, L.HEAPF64);
    v.push(Xe);
    const rr = f.localAngles, fr = rr ? Array.from(rr.keys()) : [], Er = rr ? Array.from(rr.values()) : [], he = ae(fr, Uint32Array, L.HEAPU32);
    v.push(he);
    const Oe = ae(Er, Float64Array, L.HEAPF64);
    v.push(Oe);
    const ur = u(l.diaphragms);
    L._deform(ee, h.length, V, W.length, M, _.length, le, D, re.length, U, j, x.length, N.keysPtr, N.valuesPtr, N.size, Z.keysPtr, Z.valuesPtr, Z.size, p.keysPtr, p.valuesPtr, p.size, de.keysPtr, de.valuesPtr, de.size, te.keysPtr, te.valuesPtr, te.size, P.keysPtr, P.valuesPtr, P.size, Pe.keysPtr, Pe.valuesPtr, Pe.size, pe.keysPtr, pe.valuesPtr, pe.size, X.keysPtr, X.valuesPtr, X.size, ye.keysPtr, ye.valuesPtr, ye.size, _e.keysPtr, _e.valuesPtr, _e.size, R, T ? T.length : 0, fe, z, Ne.length, ze, Qe, oe.length, Be, A, $e.length, Le, Ce, er.length, Ge, sr, or.length, We, Xe, Ye.length, he, Oe, fr.length, G, be, we.length, f.etabsWallJoint === false ? 0 : 1, ur.keysPtr, ur.valuesPtr, ur.size, f.solidIncompatible === false ? 0 : 1, Se, Te, ve, Me);
    const ir = L.HEAPU32[Se / 4], ar = L.HEAPU32[Te / 4], tr = L.HEAPU32[ve / 4], mr = L.HEAPU32[Me / 4], Mr = new Float64Array(L.HEAPF64.buffer, ir, ar), Ur = new Float64Array(L.HEAPF64.buffer, tr, mr), Or = /* @__PURE__ */ new Map();
    for (let J = 0; J < ar; J += 7) {
      const Ze = Mr[J];
      Or.set(Ze, Array.from(Mr.slice(J + 1, J + 7)));
    }
    const Rr = /* @__PURE__ */ new Map();
    for (let J = 0; J < mr; J += 7) {
      const Ze = Ur[J];
      Rr.set(Ze, Array.from(Ur.slice(J + 1, J + 7)));
    }
    return ir && v.push(ir), tr && v.push(tr), v.forEach((J) => L._free(J)), {
      deformations: Or,
      reactions: Rr
    };
  };
  function ae(h, _, l) {
    const f = new _(h), T = L._malloc(f.length * f.BYTES_PER_ELEMENT);
    return (_ === Float64Array ? L.HEAPF64 : _ === Uint32Array ? L.HEAPU32 : _ === Uint8Array ? L.HEAPU8 : l).set(f, T / f.BYTES_PER_ELEMENT), T;
  }
  const B = await Sr();
  io = function(h, _, l, f, T = 10, v = 0, ee = 0, W = 1, V, ce) {
    if (h.length === 0) return {
      frequencies: [],
      modeShapes: [],
      massParticipation: []
    };
    const M = [], re = xe(h.flat(), Float64Array, B.HEAPF64);
    M.push(re);
    const q = _.flat(), le = xe(q, Uint32Array, B.HEAPU32);
    M.push(le);
    const D = _.map((he) => he.length), x = xe(D, Uint32Array, B.HEAPU32);
    M.push(x);
    const O = l.supports ? Array.from(l.supports.keys()) : [], U = l.supports ? Array.from(l.supports.values()).flat().map((he) => he ? 1 : 0) : [], j = xe(O, Uint32Array, B.HEAPU32);
    M.push(j);
    const u = xe(U, Uint8Array, B.HEAPU8);
    M.push(u);
    const N = (he) => {
      const Oe = he ? Array.from(he.keys()) : [], ur = he ? Array.from(he.values()) : [], ir = xe(Oe, Uint32Array, B.HEAPU32);
      M.push(ir);
      const ar = xe(ur, Float64Array, B.HEAPF64);
      return M.push(ar), {
        keysPtr: ir,
        valuesPtr: ar,
        size: Oe.length
      };
    }, X = N(f.elasticities), Z = N(f.areas), p = N(f.momentsOfInertiaZ), de = N(f.momentsOfInertiaY), te = N(f.shearModuli), P = N(f.torsionalConstants), Pe = N(f.densities), pe = N(f.thicknesses), ye = N(f.poissonsRatios), _e = N(f.membraneModifiers), Ae = N(f.bendingModifiers), Ee = f.plateFormulations, ne = Ee ? Array.from(Ee.keys()) : [], ge = Ee ? Array.from(Ee.values()) : [], we = xe(ne, Uint32Array, B.HEAPU32);
    M.push(we);
    const S = xe(ge, Uint32Array, B.HEAPU32);
    M.push(S);
    const G = f.drillingTypes, be = G ? Array.from(G.keys()) : [], Se = G ? Array.from(G.values()) : [], Te = xe(be, Uint32Array, B.HEAPU32);
    M.push(Te);
    const ve = xe(Se, Uint32Array, B.HEAPU32);
    M.push(ve);
    const Me = f.drillingPenaltyScales, H = Me ? Array.from(Me.keys()) : [], R = Me ? Array.from(Me.values()) : [], Fe = xe(H, Uint32Array, B.HEAPU32);
    M.push(Fe);
    const Ne = xe(R, Float64Array, B.HEAPF64);
    M.push(Ne);
    const Y = N(f.shearAreasY), fe = N(f.shearAreasZ), z = N(f.localAngles), K = f.momentReleases ? Array.from(f.momentReleases.keys()) : [], oe = f.momentReleases ? Array.from(f.momentReleases.values()).flatMap(_t) : [], je = xe(K, Uint32Array, B.HEAPU32);
    M.push(je);
    const ze = xe(oe, Uint8Array, B.HEAPU8);
    M.push(ze);
    const Qe = N(l.masses), Ke = N(V ?? l.diaphragms), $e = ce ?? l.springs, yr = $e ? $e.flatMap((he) => [
      he.node,
      he.dof,
      he.k
    ]) : [], Be = xe(yr.length > 0 ? yr : [
      0
    ], Float64Array, B.HEAPF64);
    M.push(Be);
    const A = B._malloc(4);
    M.push(A);
    const w = B._malloc(4);
    M.push(w);
    const He = B._malloc(4);
    M.push(He);
    const er = B._malloc(4);
    M.push(er);
    const dr = B._malloc(4);
    M.push(dr);
    const Le = B._malloc(4);
    M.push(Le);
    const Ce = B._malloc(4);
    M.push(Ce);
    const or = B._malloc(4);
    M.push(or), B._modal(re, h.length, le, q.length, x, _.length, j, u, O.length, X.keysPtr, X.valuesPtr, X.size, Z.keysPtr, Z.valuesPtr, Z.size, p.keysPtr, p.valuesPtr, p.size, de.keysPtr, de.valuesPtr, de.size, te.keysPtr, te.valuesPtr, te.size, P.keysPtr, P.valuesPtr, P.size, Pe.keysPtr, Pe.valuesPtr, Pe.size, pe.keysPtr, pe.valuesPtr, pe.size, ye.keysPtr, ye.valuesPtr, ye.size, _e.keysPtr, _e.valuesPtr, _e.size, Ae.keysPtr, Ae.valuesPtr, Ae.size, we, S, ne.length, Te, ve, be.length, Fe, Ne, H.length, Y.keysPtr, Y.valuesPtr, Y.size, fe.keysPtr, fe.valuesPtr, fe.size, z.keysPtr, z.valuesPtr, z.size, je, ze, K.length, Qe.keysPtr, Qe.valuesPtr, Qe.size, W, Ke.keysPtr, Ke.valuesPtr, Ke.size, Be, $e ? $e.length : 0, f.etabsWallJoint === false ? 0 : 1, T, v, ee, A, w, He, er, dr, Le, Ce, or);
    const Ie = B.HEAPU32[A / 4], Ge = B.HEAPU32[w / 4], sr = B.HEAPU32[He / 4], Ue = B.HEAPU32[er / 4], Ye = B.HEAPU32[dr / 4], qe = B.HEAPU32[Le / 4], We = B.HEAPU32[Ce / 4], Xe = B.HEAPU32[or / 4];
    let rr = [], fr = [], Er = [];
    if (Ge > 0 && Ie) {
      const he = new Float64Array(B.HEAPF64.buffer, Ie, Ge);
      rr = Array.from(he), M.push(Ie);
    }
    if (Ue > 0 && Ye > 0 && sr) {
      const he = new Float64Array(B.HEAPF64.buffer, sr, Ue * Ye);
      for (let Oe = 0; Oe < Ue; Oe++) fr.push(Array.from(he.slice(Oe * Ye, (Oe + 1) * Ye)));
      M.push(sr);
    }
    if (We > 0 && Xe > 0 && qe) {
      const he = new Float64Array(B.HEAPF64.buffer, qe, We * Xe);
      for (let Oe = 0; Oe < We; Oe++) Er.push(Array.from(he.slice(Oe * Xe, (Oe + 1) * Xe)));
      M.push(qe);
    }
    return M.forEach((he) => B._free(he)), {
      frequencies: rr,
      modeShapes: fr,
      massParticipation: Er
    };
  };
  function xe(h, _, l) {
    const f = new _(h), T = B._malloc(f.length * f.BYTES_PER_ELEMENT);
    return (_ === Float64Array ? B.HEAPF64 : _ === Uint32Array ? B.HEAPU32 : _ === Uint8Array ? B.HEAPU8 : l).set(f, T / f.BYTES_PER_ELEMENT), T;
  }
  const $ = await Sr();
  ao = function(h, _, l, f, T = 10) {
    if (h.length === 0) return {
      frequencies: [],
      modeShapes: [],
      massParticipation: []
    };
    const v = [], ee = pr(h.flat(), Float64Array, $.HEAPF64);
    v.push(ee);
    const W = _.flat(), V = pr(W, Uint32Array, $.HEAPU32);
    v.push(V);
    const ce = _.map((Y) => Y.length), M = pr(ce, Uint32Array, $.HEAPU32);
    v.push(M);
    const re = l.supports ? Array.from(l.supports.keys()) : [], q = l.supports ? Array.from(l.supports.values()).flat().map((Y) => Y ? 1 : 0) : [], le = pr(re, Uint32Array, $.HEAPU32);
    v.push(le);
    const D = pr(q, Uint8Array, $.HEAPU8);
    v.push(D);
    const x = (Y) => {
      const fe = Y ? Array.from(Y.keys()) : [], z = Y ? Array.from(Y.values()) : [], K = pr(fe, Uint32Array, $.HEAPU32);
      v.push(K);
      const oe = pr(z, Float64Array, $.HEAPF64);
      return v.push(oe), {
        keysPtr: K,
        valuesPtr: oe,
        size: fe.length
      };
    }, O = x(f.elasticities), U = x(f.areas), j = x(f.momentsOfInertiaZ), u = x(f.momentsOfInertiaY), N = x(f.shearModuli), X = x(f.torsionalConstants), Z = x(f.densities), p = x(f.thicknesses), de = x(f.poissonsRatios), te = x(f.membraneModifiers), P = x(f.bendingModifiers), Pe = x(f.polarMomentsOfInertia), pe = $._malloc(4);
    v.push(pe);
    const ye = $._malloc(4);
    v.push(ye);
    const _e = $._malloc(4);
    v.push(_e);
    const Ae = $._malloc(4);
    v.push(Ae);
    const Ee = $._malloc(4);
    v.push(Ee);
    const ne = $._malloc(4);
    v.push(ne);
    const ge = $._malloc(4);
    v.push(ge);
    const we = $._malloc(4);
    v.push(we), $._modal_paz(ee, h.length, V, W.length, M, _.length, le, D, re.length, O.keysPtr, O.valuesPtr, O.size, U.keysPtr, U.valuesPtr, U.size, j.keysPtr, j.valuesPtr, j.size, u.keysPtr, u.valuesPtr, u.size, N.keysPtr, N.valuesPtr, N.size, X.keysPtr, X.valuesPtr, X.size, Z.keysPtr, Z.valuesPtr, Z.size, p.keysPtr, p.valuesPtr, p.size, de.keysPtr, de.valuesPtr, de.size, te.keysPtr, te.valuesPtr, te.size, P.keysPtr, P.valuesPtr, P.size, Pe.keysPtr, Pe.valuesPtr, Pe.size, T, pe, ye, _e, Ae, Ee, ne, ge, we);
    const S = $.HEAPU32[pe / 4], G = $.HEAPU32[ye / 4], be = $.HEAPU32[_e / 4], Se = $.HEAPU32[Ae / 4], Te = $.HEAPU32[Ee / 4], ve = $.HEAPU32[ne / 4], Me = $.HEAPU32[ge / 4], H = $.HEAPU32[we / 4];
    let R = [], Fe = [], Ne = [];
    if (G > 0 && S) {
      const Y = new Float64Array($.HEAPF64.buffer, S, G);
      R = Array.from(Y), v.push(S);
    }
    if (Se > 0 && Te > 0 && be) {
      const Y = new Float64Array($.HEAPF64.buffer, be, Se * Te);
      for (let fe = 0; fe < Se; fe++) Fe.push(Array.from(Y.slice(fe * Te, (fe + 1) * Te)));
      v.push(be);
    }
    if (Me > 0 && H > 0 && ve) {
      const Y = new Float64Array($.HEAPF64.buffer, ve, Me * H);
      for (let fe = 0; fe < Me; fe++) Ne.push(Array.from(Y.slice(fe * H, (fe + 1) * H)));
      v.push(ve);
    }
    return v.forEach((Y) => $._free(Y)), {
      frequencies: R,
      modeShapes: Fe,
      massParticipation: Ne
    };
  };
  function pr(h, _, l) {
    const f = new _(h), T = $._malloc(f.length * f.BYTES_PER_ELEMENT);
    return (_ === Float64Array ? $.HEAPF64 : _ === Uint32Array ? $.HEAPU32 : _ === Uint8Array ? $.HEAPU8 : l).set(f, T / f.BYTES_PER_ELEMENT), T;
  }
  const Ve = await Sr();
  co = function(h) {
    const { nodes: _, elements: l, E: f, nu: T, gamma: v, c: ee, phi: W, thickness: V = 1, supports: ce, surcharge: M = 0, surfaceYThreshold: re = -1e10 } = h, q = [], le = _.flat(), D = no(le);
    q.push(D);
    const x = l.flat(), O = ht(x);
    q.push(O);
    const U = [];
    for (const P of ce) U.push(P.node, P.fixX ? 1 : 0, P.fixY ? 1 : 0);
    const j = ht(U);
    q.push(j);
    const u = l.length, N = _.length, X = Ve._slopeAllocDouble(u);
    q.push(X);
    const Z = Ve._slopeAllocDouble(N * 2);
    q.push(Z);
    const p = Ve._slopeStabilitySolver(D, N, O, u, f, T, v, ee, W, V, j, ce.length, M, re, X, Z), de = [];
    for (let P = 0; P < u; P++) de.push(Ve.HEAPF64[X / 8 + P]);
    const te = [];
    for (let P = 0; P < N; P++) te.push([
      Ve.HEAPF64[Z / 8 + 2 * P],
      Ve.HEAPF64[Z / 8 + 2 * P + 1]
    ]);
    return q.forEach((P) => Ve._free(P)), {
      fos: p,
      plasticStrain: de,
      displacements: te
    };
  };
  function no(h) {
    const _ = new Float64Array(h), l = Ve._malloc(_.length * _.BYTES_PER_ELEMENT);
    return Ve.HEAPF64.set(_, l / 8), l;
  }
  function ht(h) {
    const _ = new Uint32Array(h), l = Ve._malloc(_.length * _.BYTES_PER_ELEMENT);
    return Ve.HEAPU32.set(_, l / 4), l;
  }
  const ke = await Sr();
  function kr(h, _, l) {
    const f = new _(h), T = ke._malloc(f.length * f.BYTES_PER_ELEMENT);
    return (_ === Float64Array ? ke.HEAPF64 : _ === Uint32Array ? ke.HEAPU32 : _ === Uint8Array ? ke.HEAPU8 : l).set(f, T / f.BYTES_PER_ELEMENT), T;
  }
  lo = function(h) {
    const _ = [];
    let l = [], f = 0;
    h.nodes && h.nodes.length > 0 && (f = h.nodes.length, l = h.nodes.flat());
    const T = kr(l.length > 0 ? l : [
      0
    ], Float64Array, ke.HEAPF64);
    _.push(T);
    let v = [], ee = 0;
    h.elements && h.elements.length > 0 && (ee = h.elements.length, v = h.elements.flat());
    const W = kr(v.length > 0 ? v : [
      0
    ], Int32Array, ke.HEAPU32);
    _.push(W);
    const V = (z) => z === 1 ? 2 : z === 2 ? 1 : z;
    let ce = [], M = 0;
    h.bcs && h.bcs.length > 0 && (M = h.bcs.length, ce = h.bcs.flatMap((z) => [
      z.node,
      V(z.dof),
      z.dof === 2 ? -z.value : z.value
    ]));
    const re = kr(ce.length > 0 ? ce : [
      0
    ], Float64Array, ke.HEAPF64);
    _.push(re);
    let q = [], le = 0;
    h.pointLoads && h.pointLoads.length > 0 && (le = h.pointLoads.length, q = h.pointLoads.flatMap((z) => [
      z.node,
      V(z.dof),
      z.dof === 2 ? -z.value : z.value
    ]));
    const D = kr(q.length > 0 ? q : [
      0
    ], Float64Array, ke.HEAPF64);
    _.push(D);
    const x = h.meshLx ?? 0, O = h.meshLy ?? 0, U = h.meshNx ?? 0, j = h.meshNy ?? 0, N = {
      none: 0,
      "simply-supported": 1,
      clamped: 2
    }[h.bcType ?? "none"] ?? 0, X = h.theoryType ?? 0;
    let Z = [], p = 0;
    h.springs && h.springs.length > 0 && (p = h.springs.length, Z = h.springs.flatMap((z) => [
      z.node,
      V(z.dof),
      z.k
    ]));
    const de = kr(Z.length > 0 ? Z : [
      0
    ], Float64Array, ke.HEAPF64);
    _.push(de);
    let te = [], P = 0;
    h.thicknesses && h.thicknesses.length > 0 && (P = h.thicknesses.length, te = h.thicknesses.slice());
    const Pe = kr(te.length > 0 ? te : [
      0
    ], Float64Array, ke.HEAPF64);
    _.push(Pe);
    const pe = ke._malloc(4);
    _.push(pe);
    const ye = ke._malloc(4);
    _.push(ye);
    const _e = ke._malloc(4);
    _.push(_e);
    const Ae = ke._malloc(4);
    _.push(Ae), ke._plate_q4_solve(T, f, W, ee, h.E, h.nu, h.thickness, re, M, h.pressure ?? 0, D, le, x, O, U, j, N, X, de, p, Pe, P, pe, ye, _e, Ae);
    const Ee = ke.HEAPU32[pe / 4], ne = ke.HEAPU32[ye / 4], ge = ke.HEAPU32[_e / 4], we = ke.HEAPU32[Ae / 4], S = new Float64Array(ke.HEAPF64.buffer, Ee, ne), G = S[0], be = S[1], Se = [];
    let Te = 0;
    for (let z = 0; z < G; z++) {
      const K = 2 + z * 5, oe = {
        x: S[K],
        y: S[K + 1],
        w: S[K + 2],
        bx: S[K + 3],
        by: S[K + 4],
        rx: S[K + 4],
        ry: -S[K + 3]
      };
      Se.push(oe), Math.abs(oe.w) > Math.abs(Te) && (Te = oe.w);
    }
    const ve = new Float64Array(ke.HEAPF64.buffer, ge, we), Me = [];
    let H = 0, R = 0, Fe = 0, Ne = 0, Y = 0;
    for (let z = 0; z < be; z++) {
      const K = z * 9, oe = {
        nodes: [
          ve[K],
          ve[K + 1],
          ve[K + 2],
          ve[K + 3]
        ],
        Mxx: ve[K + 4],
        Myy: ve[K + 5],
        Mxy: ve[K + 6],
        Qx: ve[K + 7],
        Qy: ve[K + 8]
      };
      Me.push(oe), Math.abs(oe.Mxx) > Math.abs(H) && (H = oe.Mxx), Math.abs(oe.Myy) > Math.abs(R) && (R = oe.Myy), Math.abs(oe.Mxy) > Math.abs(Fe) && (Fe = oe.Mxy), Math.abs(oe.Qx) > Math.abs(Ne) && (Ne = oe.Qx), Math.abs(oe.Qy) > Math.abs(Y) && (Y = oe.Qy);
    }
    let fe;
    if (x > 0 && O > 0) {
      const z = x / 2, K = O / 2;
      let oe = 1 / 0;
      for (const je of Se) {
        const ze = Math.hypot(je.x - z, je.y - K);
        ze < oe && (oe = ze, fe = je.w);
      }
    }
    return Ee && _.push(Ee), ge && _.push(ge), _.forEach((z) => ke._free(z)), {
      nodeResults: Se,
      elementResults: Me,
      maxW: Te,
      maxMxx: H,
      maxMyy: R,
      maxMxy: Fe,
      maxQx: Ne,
      maxQy: Y,
      centerW: fe
    };
  };
  const Q = await Sr();
  fo = function(h, _, l, f) {
    if (h.length === 0) return {
      nNodes: 0,
      nElements: 0,
      nDOF: 0,
      elements: [],
      K_assembled_sparse: [],
      K_assembled_nnz: 0,
      F_applied: [],
      U_full: [],
      R_full: [],
      freeDOFs: [],
      fixedDOFs: []
    };
    const T = [], v = nr(h.flat(), Float64Array, Q.HEAPF64);
    T.push(v);
    const ee = _.flat(), W = nr(ee, Uint32Array, Q.HEAPU32);
    T.push(W);
    const V = _.map((R) => R.length), ce = nr(V, Uint32Array, Q.HEAPU32);
    T.push(ce);
    const M = l.supports ? Array.from(l.supports.keys()) : [], re = l.supports ? Array.from(l.supports.values()).flat().map((R) => R ? 1 : 0) : [], q = nr(M, Uint32Array, Q.HEAPU32);
    T.push(q);
    const le = nr(re, Uint8Array, Q.HEAPU8);
    T.push(le);
    const D = l.loads ? Array.from(l.loads.keys()) : [], x = l.loads ? Array.from(l.loads.values()).flat() : [], O = nr(D, Uint32Array, Q.HEAPU32);
    T.push(O);
    const U = nr(x, Float64Array, Q.HEAPF64);
    T.push(U);
    const j = (R) => {
      const Fe = R ? Array.from(R.keys()) : [], Ne = R ? Array.from(R.values()) : [], Y = nr(Fe, Uint32Array, Q.HEAPU32);
      T.push(Y);
      const fe = nr(Ne, Float64Array, Q.HEAPF64);
      return T.push(fe), {
        keysPtr: Y,
        valuesPtr: fe,
        size: Fe.length
      };
    }, u = j(f.elasticities), N = j(f.areas), X = j(f.momentsOfInertiaZ), Z = j(f.momentsOfInertiaY), p = j(f.shearModuli), de = j(f.torsionalConstants), te = j(f.thicknesses), P = j(f.poissonsRatios), Pe = j(f.shearAreasY), pe = j(f.shearAreasZ), ye = Q._malloc(4);
    T.push(ye);
    const _e = Q._malloc(4);
    T.push(_e);
    const Ae = Q._malloc(4);
    T.push(Ae);
    const Ee = Q._malloc(4);
    T.push(Ee);
    const ne = Q._malloc(4);
    T.push(ne);
    const ge = Q._malloc(4);
    T.push(ge), Q._didactic_solve(v, h.length, W, ee.length, ce, _.length, q, le, M.length, O, U, D.length, u.keysPtr, u.valuesPtr, u.size, N.keysPtr, N.valuesPtr, N.size, X.keysPtr, X.valuesPtr, X.size, Z.keysPtr, Z.valuesPtr, Z.size, p.keysPtr, p.valuesPtr, p.size, de.keysPtr, de.valuesPtr, de.size, te.keysPtr, te.valuesPtr, te.size, P.keysPtr, P.valuesPtr, P.size, Pe.keysPtr, Pe.valuesPtr, Pe.size, pe.keysPtr, pe.valuesPtr, pe.size, ye, _e, Ae, Ee, ne, ge);
    const we = Q.HEAPU32[ye / 4], S = Q.HEAPU32[_e / 4], G = Q.HEAPU32[Ae / 4], be = Q.HEAPU32[Ee / 4], Se = Q.HEAPU32[ne / 4], Te = Q.HEAPU32[ge / 4], ve = we && S > 0 ? Array.from(new Float64Array(Q.HEAPF64.buffer, we, S)) : [], Me = G && be > 0 ? Array.from(new Float64Array(Q.HEAPF64.buffer, G, be)) : [], H = Se && Te > 0 ? Array.from(new Float64Array(Q.HEAPF64.buffer, Se, Te)) : [];
    return we && T.push(we), G && T.push(G), Se && T.push(Se), T.forEach((R) => Q._free(R)), oo(ve, Me, H, h.length, _.length);
  };
  function oo(h, _, l, f, T) {
    const v = f * 6, ee = [];
    if (h.length > 0) {
      const D = h[0], x = [];
      for (let O = 0; O < D; O++) x.push(h[1 + O]);
      for (let O = 0; O < D; O++) {
        let U = x[O];
        const j = h[U++], u = h[U++], N = h[U++], X = N * N, Z = Cr(h.slice(U, U + X), N);
        U += X;
        const p = Cr(h.slice(U, U + X), N);
        U += X;
        const de = Cr(h.slice(U, U + X), N);
        U += X;
        const te = Cr(h.slice(U, U + 9), 3);
        U += 9;
        const P = h[U++], Pe = h[U++], pe = h[U++], ye = h[U++], _e = h[U++], Ae = h[U++], Ee = h[U++], ne = h[U++], ge = h[U++], we = h[U++], S = h[U++];
        ee.push({
          index: j,
          type: u === 0 ? "frame" : "shell-Q4",
          nDOF: N,
          K_local: Z,
          T: p,
          K_global: de,
          lambda: te,
          L: P,
          E: Pe,
          A: pe,
          Iz: ye,
          Iy: _e,
          G: Ae,
          J: Ee,
          t: ne,
          nu: ge,
          phiZ: we,
          phiY: S
        });
      }
    }
    const W = [];
    let V = 0;
    if (_.length > 0) {
      V = _[0];
      for (let D = 0; D < V; D++) {
        const x = 1 + D * 3;
        W.push({
          row: _[x],
          col: _[x + 1],
          value: _[x + 2]
        });
      }
    }
    let ce = [], M = [], re = [], q = [], le = [];
    if (l.length > 0) {
      let D = 0;
      const x = l[D++];
      ce = l.slice(D, D + x), D += x, M = l.slice(D, D + x), D += x, re = l.slice(D, D + x), D += x;
      const O = l[D++];
      q = l.slice(D, D + O).map(Math.round), D += O;
      const U = l[D++];
      le = l.slice(D, D + U).map(Math.round);
    }
    return {
      nNodes: f,
      nElements: T,
      nDOF: v,
      elements: ee,
      K_assembled_sparse: W,
      K_assembled_nnz: V,
      F_applied: ce,
      U_full: M,
      R_full: re,
      freeDOFs: q,
      fixedDOFs: le
    };
  }
  function Cr(h, _) {
    const l = [];
    for (let f = 0; f < _; f++) l.push(h.slice(f * _, (f + 1) * _));
    return l;
  }
  function nr(h, _, l) {
    const f = new _(h), T = Q._malloc(f.length * f.BYTES_PER_ELEMENT);
    return (_ === Float64Array ? Q.HEAPF64 : _ === Uint32Array ? Q.HEAPU32 : _ === Uint8Array ? Q.HEAPU8 : l).set(f, T / f.BYTES_PER_ELEMENT), T;
  }
})();
export {
  Sr as M,
  to as _,
  __tla,
  fo as a,
  ao as b,
  so as d,
  io as m,
  lo as p,
  co as s
};
