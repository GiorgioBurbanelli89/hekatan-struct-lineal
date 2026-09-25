var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
let Fr, ht, At, Et, yt, _t, Pt, gt;
let __tla = (async () => {
  let ft, mt, Vr;
  ft = "modulepreload";
  mt = function(f, m) {
    return new URL(f, m).href;
  };
  Vr = {};
  ht = function(m, a, d) {
    let y = Promise.resolve();
    if (a && a.length > 0) {
      const Z = document.getElementsByTagName("link"), z = document.querySelector("meta[property=csp-nonce]"), ne = (z == null ? void 0 : z.nonce) || (z == null ? void 0 : z.getAttribute("nonce"));
      y = Promise.allSettled(a.map((B) => {
        if (B = mt(B, d), B in Vr) return;
        Vr[B] = true;
        const v = B.endsWith(".css"), me = v ? '[rel="stylesheet"]' : "";
        if (!!d) for (let g = Z.length - 1; g >= 0; g--) {
          const A = Z[g];
          if (A.href === B && (!v || A.rel === "stylesheet")) return;
        }
        else if (document.querySelector(`link[href="${B}"]${me}`)) return;
        const L = document.createElement("link");
        if (L.rel = v ? "stylesheet" : ft, v || (L.as = "script"), L.crossOrigin = "", L.href = B, ne && L.setAttribute("nonce", ne), document.head.appendChild(L), v) return new Promise((g, A) => {
          L.addEventListener("load", g), L.addEventListener("error", () => A(new Error(`Unable to preload CSS for ${B}`)));
        });
      }));
    }
    function p(Z) {
      const z = new Event("vite:preloadError", {
        cancelable: true
      });
      if (z.payload = Z, window.dispatchEvent(z), !z.defaultPrevented) throw Z;
    }
    return y.then((Z) => {
      for (const z of Z || []) z.status === "rejected" && p(z.reason);
      return m().catch(p);
    });
  };
  Fr = async function(f = {}) {
    var _a, _b, _c, _d, _e2, _f;
    var m;
    (function() {
      var _a2;
      function e(h) {
        h = h.split("-")[0];
        for (var S = h.split(".").slice(0, 3); S.length < 3; ) S.push("00");
        return S = S.map((x, G, k) => x.padStart(2, "0")), S.join("");
      }
      var r = (h) => [
        h / 1e4 | 0,
        (h / 100 | 0) % 100,
        h % 100
      ].join("."), t = 2147483647, s = typeof process < "u" && ((_a2 = process.versions) == null ? void 0 : _a2.node) ? e(process.versions.node) : t;
      if (s < 16e4) throw new Error(`This emscripten-generated code requires node v${r(16e4)} (detected v${r(s)})`);
      var n = typeof navigator < "u" && navigator.userAgent;
      if (n) {
        var i = n.includes("Safari/") && !n.includes("Chrome/") && n.match(/Version\/(\d+\.?\d*\.?\d*)/) ? e(n.match(/Version\/(\d+\.?\d*\.?\d*)/)[1]) : t;
        if (i < 15e4) throw new Error(`This emscripten-generated code requires Safari v${r(15e4)} (detected v${i})`);
        var l = n.match(/Firefox\/(\d+(?:\.\d+)?)/) ? parseFloat(n.match(/Firefox\/(\d+(?:\.\d+)?)/)[1]) : t;
        if (l < 79) throw new Error(`This emscripten-generated code requires Firefox v79 (detected v${l})`);
        var c = n.match(/Chrome\/(\d+(?:\.\d+)?)/) ? parseFloat(n.match(/Chrome\/(\d+(?:\.\d+)?)/)[1]) : t;
        if (c < 85) throw new Error(`This emscripten-generated code requires Chrome v85 (detected v${c})`);
      }
    })();
    var a = f, d = !!globalThis.window, y = !!globalThis.WorkerGlobalScope, p = ((_b = (_a = globalThis.process) == null ? void 0 : _a.versions) == null ? void 0 : _b.node) && ((_c = globalThis.process) == null ? void 0 : _c.type) != "renderer", Z = !d && !p && !y;
    if (p) {
      const { createRequire: e } = await ht(() => import("./__vite-browser-external-D7Ct-6yo.js").then((r) => r._), [], import.meta.url);
      var z = e(import.meta.url);
    }
    var ne = "./this.program", B = import.meta.url, v = "";
    function me(e) {
      return a.locateFile ? a.locateFile(e, v) : v + e;
    }
    var J, L;
    if (p) {
      if (!(((_e2 = (_d = globalThis.process) == null ? void 0 : _d.versions) == null ? void 0 : _e2.node) && ((_f = globalThis.process) == null ? void 0 : _f.type) != "renderer")) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
      var g = z("fs");
      B.startsWith("file:") && (v = z("path").dirname(z("url").fileURLToPath(B)) + "/"), L = (r) => {
        r = b(r) ? new URL(r) : r;
        var t = g.readFileSync(r);
        return u(Buffer.isBuffer(t)), t;
      }, J = async (r, t = true) => {
        r = b(r) ? new URL(r) : r;
        var s = g.readFileSync(r, t ? void 0 : "utf8");
        return u(t ? Buffer.isBuffer(s) : typeof s == "string"), s;
      }, process.argv.length > 1 && (ne = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2);
    } else if (!Z) if (d || y) {
      try {
        v = new URL(".", B).href;
      } catch {
      }
      if (!(globalThis.window || globalThis.WorkerGlobalScope)) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
      y && (L = (e) => {
        var r = new XMLHttpRequest();
        return r.open("GET", e, false), r.responseType = "arraybuffer", r.send(null), new Uint8Array(r.response);
      }), J = async (e) => {
        if (b(e)) return new Promise((t, s) => {
          var n = new XMLHttpRequest();
          n.open("GET", e, true), n.responseType = "arraybuffer", n.onload = () => {
            if (n.status == 200 || n.status == 0 && n.response) {
              t(n.response);
              return;
            }
            s(n.status);
          }, n.onerror = s, n.send(null);
        });
        var r = await fetch(e, {
          credentials: "same-origin"
        });
        if (r.ok) return r.arrayBuffer();
        throw new Error(r.status + " : " + r.url);
      };
    } else throw new Error("environment detection error");
    var A = console.log.bind(console), F = console.error.bind(console);
    u(!Z, "shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.");
    var P;
    globalThis.WebAssembly || F("no native wasm support detected");
    var I = false;
    function u(e, r) {
      e || w("Assertion failed" + (r ? ": " + r : ""));
    }
    var b = (e) => e.startsWith("file://");
    function Y() {
      var e = Rr();
      u((e & 3) == 0), e == 0 && (e += 4), _[e >> 2] = 34821223, _[e + 4 >> 2] = 2310721022, _[0] = 1668509029;
    }
    function q() {
      if (!I) {
        var e = Rr();
        e == 0 && (e += 4);
        var r = _[e >> 2], t = _[e + 4 >> 2];
        (r != 34821223 || t != 2310721022) && w(`Stack overflow! Stack cookie has been overwritten at ${Oe(e)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${Oe(t)} ${Oe(r)}`), _[0] != 1668509029 && w("Runtime error: The application has corrupted its heap memory area (address zero)!");
      }
    }
    (() => {
      var e = new Int16Array(1), r = new Int8Array(e.buffer);
      e[0] = 25459, (r[0] !== 115 || r[1] !== 99) && w("Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)");
    })();
    function te(e) {
      Object.getOwnPropertyDescriptor(a, e) || Object.defineProperty(a, e, {
        configurable: true,
        set() {
          w(`Attempt to set \`Module.${e}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`);
        }
      });
    }
    function T(e) {
      return () => u(false, `call to '${e}' via reference taken before Wasm module initialization`);
    }
    function ae(e) {
      Object.getOwnPropertyDescriptor(a, e) && w(`\`Module.${e}\` was supplied but \`${e}\` not included in INCOMING_MODULE_JS_API`);
    }
    function N(e) {
      return e === "FS_createPath" || e === "FS_createDataFile" || e === "FS_createPreloadedFile" || e === "FS_preloadFile" || e === "FS_unlink" || e === "addRunDependency" || e === "FS_createLazyFile" || e === "FS_createDevice" || e === "removeRunDependency";
    }
    function he(e) {
      le(e);
    }
    function le(e) {
      Object.getOwnPropertyDescriptor(a, e) || Object.defineProperty(a, e, {
        configurable: true,
        get() {
          var r = `'${e}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
          N(e) && (r += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"), w(r);
        }
      });
    }
    var ce, de, K, ie, ye, _, W, Q = false;
    function _e() {
      var e = Mr.buffer;
      K = new Int8Array(e), a.HEAPU8 = ie = new Uint8Array(e), ye = new Int32Array(e), a.HEAPU32 = _ = new Uint32Array(e), a.HEAPF64 = new Float64Array(e), W = new BigInt64Array(e), new BigUint64Array(e);
    }
    u(globalThis.Int32Array && globalThis.Float64Array && Int32Array.prototype.subarray && Int32Array.prototype.set, "JS engine does not provide full typed array support");
    function Fe() {
      if (a.preRun) for (typeof a.preRun == "function" && (a.preRun = [
        a.preRun
      ]); a.preRun.length; ) Ve(a.preRun.shift());
      te("preRun"), ee(Ze);
    }
    function Ee() {
      u(!Q), Q = true, q(), !a.noFSInit && !o.initialized && o.init(), Pr.__wasm_call_ctors(), o.ignorePermissions = false;
    }
    function ge() {
      if (q(), a.postRun) for (typeof a.postRun == "function" && (a.postRun = [
        a.postRun
      ]); a.postRun.length; ) We(a.postRun.shift());
      te("postRun"), ee(ze);
    }
    function w(e) {
      var _a2;
      (_a2 = a.onAbort) == null ? void 0 : _a2.call(a, e), e = "Aborted(" + e + ")", F(e), I = true;
      var r = new WebAssembly.RuntimeError(e);
      throw de == null ? void 0 : de(r), r;
    }
    function H(e, r) {
      return (...t) => {
        u(Q, `native function \`${e}\` called before runtime initialization`);
        var s = Pr[e];
        return u(s, `exported native function \`${e}\` not found`), u(t.length <= r, `native function \`${e}\` called with ${t.length} args but expects ${r}`), s(...t);
      };
    }
    var Pe;
    function ue() {
      return a.locateFile ? me("deform.wasm") : new URL("" + new URL("deform-BLaVg75W.wasm", import.meta.url).href, import.meta.url).href;
    }
    function Ae(e) {
      if (e == Pe && P) return new Uint8Array(P);
      if (L) return L(e);
      throw "both async and sync fetching of the wasm failed";
    }
    async function Se(e) {
      if (!P) try {
        var r = await J(e);
        return new Uint8Array(r);
      } catch {
      }
      return Ae(e);
    }
    async function j(e, r) {
      try {
        var t = await Se(e), s = await WebAssembly.instantiate(t, r);
        return s;
      } catch (n) {
        F(`failed to asynchronously prepare wasm: ${n}`), b(e) && F(`warning: Loading from a file URI (${e}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`), w(n);
      }
    }
    async function oe(e, r, t) {
      if (!e && !b(r) && !p) try {
        var s = fetch(r, {
          credentials: "same-origin"
        }), n = await WebAssembly.instantiateStreaming(s, t);
        return n;
      } catch (i) {
        F(`wasm streaming compile failed: ${i}`), F("falling back to ArrayBuffer instantiation");
      }
      return j(r, t);
    }
    function U() {
      var e = {
        env: Ir,
        wasi_snapshot_preview1: Ir
      };
      return e;
    }
    async function V() {
      function e(l, c) {
        return Pr = l.exports, dt(Pr), _e(), Pr;
      }
      var r = a;
      function t(l) {
        return u(a === r, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?"), r = null, e(l.instance);
      }
      var s = U();
      if (a.instantiateWasm) return new Promise((l, c) => {
        try {
          a.instantiateWasm(s, (h, S) => {
            l(e(h, S));
          });
        } catch (h) {
          F(`Module.instantiateWasm callback failed with error: ${h}`), c(h);
        }
      });
      Pe ?? (Pe = ue());
      var n = await oe(P, Pe, s), i = t(n);
      return i;
    }
    var ee = (e) => {
      for (; e.length > 0; ) e.shift()(a);
    }, ze = [], We = (e) => ze.push(e), Ze = [], Ve = (e) => Ze.push(e), Oe = (e) => (u(typeof e == "number", `ptrToString expects a number, got ${typeof e}`), e >>>= 0, "0x" + e.toString(16).padStart(8, "0")), $e = (e) => {
      $e.shown || ($e.shown = {}), $e.shown[e] || ($e.shown[e] = 1, p && (e = "warning: " + e), F(e));
    }, tr = globalThis.TextDecoder && new TextDecoder(), or = (e, r, t, s) => {
      for (var n = r + t; e[r] && !(r >= n); ) ++r;
      return r;
    }, be = (e, r = 0, t, s) => {
      var n = or(e, r, t);
      if (n - r > 16 && e.buffer && tr) return tr.decode(e.subarray(r, n));
      for (var i = ""; r < n; ) {
        var l = e[r++];
        if (!(l & 128)) {
          i += String.fromCharCode(l);
          continue;
        }
        var c = e[r++] & 63;
        if ((l & 224) == 192) {
          i += String.fromCharCode((l & 31) << 6 | c);
          continue;
        }
        var h = e[r++] & 63;
        if ((l & 240) == 224 ? l = (l & 15) << 12 | c << 6 | h : ((l & 248) != 240 && $e("Invalid UTF-8 leading byte " + Oe(l) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!"), l = (l & 7) << 18 | c << 12 | h << 6 | e[r++] & 63), l < 65536) i += String.fromCharCode(l);
        else {
          var S = l - 65536;
          i += String.fromCharCode(55296 | S >> 10, 56320 | S & 1023);
        }
      }
      return i;
    }, Me = (e, r, t) => (u(typeof e == "number", `UTF8ToString expects a number (got ${typeof e})`), e ? be(ie, e, r) : ""), sr = (e, r, t, s) => w(`Assertion failed: ${Me(e)}, at: ` + [
      r ? Me(r) : "unknown filename",
      t,
      s ? Me(s) : "unknown function"
    ]);
    class hr {
      constructor(r) {
        this.excPtr = r, this.ptr = r - 24;
      }
      set_type(r) {
        _[this.ptr + 4 >> 2] = r;
      }
      get_type() {
        return _[this.ptr + 4 >> 2];
      }
      set_destructor(r) {
        _[this.ptr + 8 >> 2] = r;
      }
      get_destructor() {
        return _[this.ptr + 8 >> 2];
      }
      set_caught(r) {
        r = r ? 1 : 0, K[this.ptr + 12] = r;
      }
      get_caught() {
        return K[this.ptr + 12] != 0;
      }
      set_rethrown(r) {
        r = r ? 1 : 0, K[this.ptr + 13] = r;
      }
      get_rethrown() {
        return K[this.ptr + 13] != 0;
      }
      init(r, t) {
        this.set_adjusted_ptr(0), this.set_type(r), this.set_destructor(t);
      }
      set_adjusted_ptr(r) {
        _[this.ptr + 16 >> 2] = r;
      }
      get_adjusted_ptr() {
        return _[this.ptr + 16 >> 2];
      }
    }
    var nr = (e, r, t) => {
      var s = new hr(e);
      s.init(r, t), u(false, "Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.");
    }, ar = () => w("native code called abort()"), Je = (e, r, t, s) => {
      if (u(typeof e == "string", `stringToUTF8Array expects a string (got ${typeof e})`), !(s > 0)) return 0;
      for (var n = t, i = t + s - 1, l = 0; l < e.length; ++l) {
        var c = e.codePointAt(l);
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
          c > 1114111 && $e("Invalid Unicode code point " + Oe(c) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF)."), r[t++] = 240 | c >> 18, r[t++] = 128 | c >> 12 & 63, r[t++] = 128 | c >> 6 & 63, r[t++] = 128 | c & 63, l++;
        }
      }
      return r[t] = 0, t - n;
    }, De = (e, r, t) => (u(typeof t == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!"), Je(e, ie, r, t)), He = (e) => {
      for (var r = 0, t = 0; t < e.length; ++t) {
        var s = e.charCodeAt(t);
        s <= 127 ? r++ : s <= 2047 ? r += 2 : s >= 55296 && s <= 57343 ? (r += 4, ++t) : r += 3;
      }
      return r;
    }, Qe = (e, r, t, s) => {
      var n = (/* @__PURE__ */ new Date()).getFullYear(), i = new Date(n, 0, 1), l = new Date(n, 6, 1), c = i.getTimezoneOffset(), h = l.getTimezoneOffset(), S = Math.max(c, h);
      _[e >> 2] = S * 60, ye[r >> 2] = +(c != h);
      var x = (R) => {
        var pe = R >= 0 ? "-" : "+", Re = Math.abs(R), Ne = String(Math.floor(Re / 60)).padStart(2, "0"), Ue = String(Re % 60).padStart(2, "0");
        return `UTC${pe}${Ne}${Ue}`;
      }, G = x(c), k = x(h);
      u(G), u(k), u(He(G) <= 16, `timezone name truncated to fit in TZNAME_MAX (${G})`), u(He(k) <= 16, `timezone name truncated to fit in TZNAME_MAX (${k})`), h < c ? (De(G, t, 17), De(k, s, 17)) : (De(G, s, 17), De(k, t, 17));
    }, Ke = () => performance.now(), je = () => Date.now(), ir = (e) => e >= 0 && e <= 3, lr = 9007199254740992, er = -9007199254740992, Ge = (e) => e < er || e > lr ? NaN : Number(e);
    function xe(e, r, t) {
      if (!ir(e)) return 28;
      var s;
      e === 0 ? s = je() : s = Ke();
      var n = Math.round(s * 1e3 * 1e3);
      return W[t >> 3] = BigInt(n), 0;
    }
    var cr = () => 2147483648, pr = (e, r) => (u(r, "alignment argument is required"), Math.ceil(e / r) * r), vr = (e) => {
      var r = Mr.buffer.byteLength, t = (e - r + 65535) / 65536 | 0;
      try {
        return Mr.grow(t), _e(), 1;
      } catch (s) {
        F(`growMemory: Attempted to grow heap from ${r} bytes to ${e} bytes, but got error: ${s}`);
      }
    }, dr = (e) => {
      var r = ie.length;
      e >>>= 0, u(e > r);
      var t = cr();
      if (e > t) return F(`Cannot enlarge memory, requested ${e} bytes, but the limit is ${t} bytes!`), false;
      for (var s = 1; s <= 4; s *= 2) {
        var n = r * (1 + 0.2 / s);
        n = Math.min(n, e + 100663296);
        var i = Math.min(t, pr(Math.max(e, n), 65536)), l = vr(i);
        if (l) return true;
      }
      return F(`Failed to grow the heap from ${r} bytes to ${i} bytes, not enough memory!`), false;
    }, Ye = {}, yr = () => ne || "./this.program", Ce = () => {
      var _a2;
      if (!Ce.strings) {
        var e = (((_a2 = globalThis.navigator) == null ? void 0 : _a2.language) ?? "C").replace("-", "_") + ".UTF-8", r = {
          USER: "web_user",
          LOGNAME: "web_user",
          PATH: "/",
          PWD: "/",
          HOME: "/home/web_user",
          LANG: e,
          _: yr()
        };
        for (var t in Ye) Ye[t] === void 0 ? delete r[t] : r[t] = Ye[t];
        var s = [];
        for (var t in r) s.push(`${t}=${r[t]}`);
        Ce.strings = s;
      }
      return Ce.strings;
    }, ur = (e, r) => {
      var t = 0, s = 0;
      for (var n of Ce()) {
        var i = r + t;
        _[e + s >> 2] = i, t += De(n, i, 1 / 0) + 1, s += 4;
      }
      return 0;
    }, fr = (e, r) => {
      var t = Ce();
      _[e >> 2] = t.length;
      var s = 0;
      for (var n of t) s += He(n) + 1;
      return _[r >> 2] = s, 0;
    }, C = {
      isAbs: (e) => e.charAt(0) === "/",
      splitPath: (e) => {
        var r = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return r.exec(e).slice(1);
      },
      normalizeArray: (e, r) => {
        for (var t = 0, s = e.length - 1; s >= 0; s--) {
          var n = e[s];
          n === "." ? e.splice(s, 1) : n === ".." ? (e.splice(s, 1), t++) : t && (e.splice(s, 1), t--);
        }
        if (r) for (; t; t--) e.unshift("..");
        return e;
      },
      normalize: (e) => {
        var r = C.isAbs(e), t = e.slice(-1) === "/";
        return e = C.normalizeArray(e.split("/").filter((s) => !!s), !r).join("/"), !e && !r && (e = "."), e && t && (e += "/"), (r ? "/" : "") + e;
      },
      dirname: (e) => {
        var r = C.splitPath(e), t = r[0], s = r[1];
        return !t && !s ? "." : (s && (s = s.slice(0, -1)), t + s);
      },
      basename: (e) => e && e.match(/([^\/]+|\/)\/*$/)[1],
      join: (...e) => C.normalize(e.join("/")),
      join2: (e, r) => C.normalize(e + "/" + r)
    }, se = () => {
      if (p) {
        var e = z("crypto");
        return (r) => e.randomFillSync(r);
      }
      return (r) => crypto.getRandomValues(r);
    }, fe = (e) => {
      (fe = se())(e);
    }, D = {
      resolve: (...e) => {
        for (var r = "", t = false, s = e.length - 1; s >= -1 && !t; s--) {
          var n = s >= 0 ? e[s] : o.cwd();
          if (typeof n != "string") throw new TypeError("Arguments to path.resolve must be strings");
          if (!n) return "";
          r = n + "/" + r, t = C.isAbs(n);
        }
        return r = C.normalizeArray(r.split("/").filter((i) => !!i), !t).join("/"), (t ? "/" : "") + r || ".";
      },
      relative: (e, r) => {
        e = D.resolve(e).slice(1), r = D.resolve(r).slice(1);
        function t(S) {
          for (var x = 0; x < S.length && S[x] === ""; x++) ;
          for (var G = S.length - 1; G >= 0 && S[G] === ""; G--) ;
          return x > G ? [] : S.slice(x, G - x + 1);
        }
        for (var s = t(e.split("/")), n = t(r.split("/")), i = Math.min(s.length, n.length), l = i, c = 0; c < i; c++) if (s[c] !== n[c]) {
          l = c;
          break;
        }
        for (var h = [], c = l; c < s.length; c++) h.push("..");
        return h = h.concat(n.slice(l)), h.join("/");
      }
    }, Te = [], Le = (e, r, t) => {
      var s = He(e) + 1, n = new Array(s), i = Je(e, n, 0, n.length);
      return n.length = i, n;
    }, Tr = () => {
      var _a2;
      if (!Te.length) {
        var e = null;
        if (p) {
          var r = 256, t = Buffer.alloc(r), s = 0, n = process.stdin.fd;
          try {
            s = g.readSync(n, t, 0, r);
          } catch (i) {
            if (i.toString().includes("EOF")) s = 0;
            else throw i;
          }
          s > 0 && (e = t.slice(0, s).toString("utf-8"));
        } else ((_a2 = globalThis.window) == null ? void 0 : _a2.prompt) && (e = window.prompt("Input: "), e !== null && (e += `
`));
        if (!e) return null;
        Te = Le(e);
      }
      return Te.shift();
    }, qe = {
      ttys: [],
      init() {
      },
      shutdown() {
      },
      register(e, r) {
        qe.ttys[e] = {
          input: [],
          output: [],
          ops: r
        }, o.registerDevice(e, qe.stream_ops);
      },
      stream_ops: {
        open(e) {
          var r = qe.ttys[e.node.rdev];
          if (!r) throw new o.ErrnoError(43);
          e.tty = r, e.seekable = false;
        },
        close(e) {
          e.tty.ops.fsync(e.tty);
        },
        fsync(e) {
          e.tty.ops.fsync(e.tty);
        },
        read(e, r, t, s, n) {
          if (!e.tty || !e.tty.ops.get_char) throw new o.ErrnoError(60);
          for (var i = 0, l = 0; l < s; l++) {
            var c;
            try {
              c = e.tty.ops.get_char(e.tty);
            } catch {
              throw new o.ErrnoError(29);
            }
            if (c === void 0 && i === 0) throw new o.ErrnoError(6);
            if (c == null) break;
            i++, r[t + l] = c;
          }
          return i && (e.node.atime = Date.now()), i;
        },
        write(e, r, t, s, n) {
          if (!e.tty || !e.tty.ops.put_char) throw new o.ErrnoError(60);
          try {
            for (var i = 0; i < s; i++) e.tty.ops.put_char(e.tty, r[t + i]);
          } catch {
            throw new o.ErrnoError(29);
          }
          return s && (e.node.mtime = e.node.ctime = Date.now()), i;
        }
      },
      default_tty_ops: {
        get_char(e) {
          return Tr();
        },
        put_char(e, r) {
          r === null || r === 10 ? (A(be(e.output)), e.output = []) : r != 0 && e.output.push(r);
        },
        fsync(e) {
          var _a2;
          ((_a2 = e.output) == null ? void 0 : _a2.length) > 0 && (A(be(e.output)), e.output = []);
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
          r === null || r === 10 ? (F(be(e.output)), e.output = []) : r != 0 && e.output.push(r);
        },
        fsync(e) {
          var _a2;
          ((_a2 = e.output) == null ? void 0 : _a2.length) > 0 && (F(be(e.output)), e.output = []);
        }
      }
    }, Dr = (e) => {
      w("internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported");
    }, O = {
      ops_table: null,
      mount(e) {
        return O.createNode(null, "/", 16895, 0);
      },
      createNode(e, r, t, s) {
        if (o.isBlkdev(t) || o.isFIFO(t)) throw new o.ErrnoError(63);
        O.ops_table || (O.ops_table = {
          dir: {
            node: {
              getattr: O.node_ops.getattr,
              setattr: O.node_ops.setattr,
              lookup: O.node_ops.lookup,
              mknod: O.node_ops.mknod,
              rename: O.node_ops.rename,
              unlink: O.node_ops.unlink,
              rmdir: O.node_ops.rmdir,
              readdir: O.node_ops.readdir,
              symlink: O.node_ops.symlink
            },
            stream: {
              llseek: O.stream_ops.llseek
            }
          },
          file: {
            node: {
              getattr: O.node_ops.getattr,
              setattr: O.node_ops.setattr
            },
            stream: {
              llseek: O.stream_ops.llseek,
              read: O.stream_ops.read,
              write: O.stream_ops.write,
              mmap: O.stream_ops.mmap,
              msync: O.stream_ops.msync
            }
          },
          link: {
            node: {
              getattr: O.node_ops.getattr,
              setattr: O.node_ops.setattr,
              readlink: O.node_ops.readlink
            },
            stream: {}
          },
          chrdev: {
            node: {
              getattr: O.node_ops.getattr,
              setattr: O.node_ops.setattr
            },
            stream: o.chrdev_stream_ops
          }
        });
        var n = o.createNode(e, r, t, s);
        return o.isDir(n.mode) ? (n.node_ops = O.ops_table.dir.node, n.stream_ops = O.ops_table.dir.stream, n.contents = {}) : o.isFile(n.mode) ? (n.node_ops = O.ops_table.file.node, n.stream_ops = O.ops_table.file.stream, n.usedBytes = 0, n.contents = null) : o.isLink(n.mode) ? (n.node_ops = O.ops_table.link.node, n.stream_ops = O.ops_table.link.stream) : o.isChrdev(n.mode) && (n.node_ops = O.ops_table.chrdev.node, n.stream_ops = O.ops_table.chrdev.stream), n.atime = n.mtime = n.ctime = Date.now(), e && (e.contents[r] = n, e.atime = e.mtime = e.ctime = n.atime), n;
      },
      getFileDataAsTypedArray(e) {
        return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0);
      },
      expandFileStorage(e, r) {
        var t = e.contents ? e.contents.length : 0;
        if (!(t >= r)) {
          var s = 1024 * 1024;
          r = Math.max(r, t * (t < s ? 2 : 1.125) >>> 0), t != 0 && (r = Math.max(r, 256));
          var n = e.contents;
          e.contents = new Uint8Array(r), e.usedBytes > 0 && e.contents.set(n.subarray(0, e.usedBytes), 0);
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
          r.size !== void 0 && O.resizeFileStorage(e, r.size);
        },
        lookup(e, r) {
          throw new o.ErrnoError(44);
        },
        mknod(e, r, t, s) {
          return O.createNode(e, r, t, s);
        },
        rename(e, r, t) {
          var s;
          try {
            s = o.lookupNode(r, t);
          } catch {
          }
          if (s) {
            if (o.isDir(e.mode)) for (var n in s.contents) throw new o.ErrnoError(55);
            o.hashRemoveNode(s);
          }
          delete e.parent.contents[e.name], r.contents[t] = e, e.name = t, r.ctime = r.mtime = e.parent.ctime = e.parent.mtime = Date.now();
        },
        unlink(e, r) {
          delete e.contents[r], e.ctime = e.mtime = Date.now();
        },
        rmdir(e, r) {
          var t = o.lookupNode(e, r);
          for (var s in t.contents) throw new o.ErrnoError(55);
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
          var s = O.createNode(e, r, 41471, 0);
          return s.link = t, s;
        },
        readlink(e) {
          if (!o.isLink(e.mode)) throw new o.ErrnoError(28);
          return e.link;
        }
      },
      stream_ops: {
        read(e, r, t, s, n) {
          var i = e.node.contents;
          if (n >= e.node.usedBytes) return 0;
          var l = Math.min(e.node.usedBytes - n, s);
          if (u(l >= 0), l > 8 && i.subarray) r.set(i.subarray(n, n + l), t);
          else for (var c = 0; c < l; c++) r[t + c] = i[n + c];
          return l;
        },
        write(e, r, t, s, n, i) {
          if (u(!(r instanceof ArrayBuffer)), r.buffer === K.buffer && (i = false), !s) return 0;
          var l = e.node;
          if (l.mtime = l.ctime = Date.now(), r.subarray && (!l.contents || l.contents.subarray)) {
            if (i) return u(n === 0, "canOwn must imply no weird position inside the file"), l.contents = r.subarray(t, t + s), l.usedBytes = s, s;
            if (l.usedBytes === 0 && n === 0) return l.contents = r.slice(t, t + s), l.usedBytes = s, s;
            if (n + s <= l.usedBytes) return l.contents.set(r.subarray(t, t + s), n), s;
          }
          if (O.expandFileStorage(l, n + s), l.contents.subarray && r.subarray) l.contents.set(r.subarray(t, t + s), n);
          else for (var c = 0; c < s; c++) l.contents[n + c] = r[t + c];
          return l.usedBytes = Math.max(l.usedBytes, n + s), s;
        },
        llseek(e, r, t) {
          var s = r;
          if (t === 1 ? s += e.position : t === 2 && o.isFile(e.node.mode) && (s += e.node.usedBytes), s < 0) throw new o.ErrnoError(28);
          return s;
        },
        mmap(e, r, t, s, n) {
          if (!o.isFile(e.node.mode)) throw new o.ErrnoError(43);
          var i, l, c = e.node.contents;
          if (!(n & 2) && c && c.buffer === K.buffer) l = false, i = c.byteOffset;
          else {
            if (l = true, i = Dr(), !i) throw new o.ErrnoError(48);
            c && ((t > 0 || t + r < c.length) && (c.subarray ? c = c.subarray(t, t + r) : c = Array.prototype.slice.call(c, t, t + r)), K.set(c, i));
          }
          return {
            ptr: i,
            allocated: l
          };
        },
        msync(e, r, t, s, n) {
          return O.stream_ops.write(e, r, 0, s, t, false), 0;
        }
      }
    }, jr = (e) => {
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
    }, Or = (e, r) => {
      var t = 0;
      return e && (t |= 365), r && (t |= 146), t;
    }, Gr = (e) => Me(xr(e)), Hr = {
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
    }, Yr = async (e) => {
      var r = await J(e);
      return u(r, `Loading data file "${e}" failed (no arrayBuffer).`), new Uint8Array(r);
    }, qr = (...e) => o.createDataFile(...e), Xr = (e) => {
      for (var r = e; ; ) {
        if (!gr[e]) return e;
        e = r + Math.random();
      }
    }, _r = 0, Sr = null, gr = {}, mr = null, Zr = (e) => {
      var _a2;
      if (_r--, (_a2 = a.monitorRunDependencies) == null ? void 0 : _a2.call(a, _r), u(e, "removeRunDependency requires an ID"), u(gr[e]), delete gr[e], _r == 0 && (mr !== null && (clearInterval(mr), mr = null), Sr)) {
        var r = Sr;
        Sr = null, r();
      }
    }, Jr = (e) => {
      var _a2, _b2;
      _r++, (_a2 = a.monitorRunDependencies) == null ? void 0 : _a2.call(a, _r), u(e, "addRunDependency requires an ID"), u(!gr[e]), gr[e] = 1, mr === null && globalThis.setInterval && (mr = setInterval(() => {
        if (I) {
          clearInterval(mr), mr = null;
          return;
        }
        var r = false;
        for (var t in gr) r || (r = true, F("still waiting on run dependencies:")), F(`dependency: ${t}`);
        r && F("(end of list)");
      }, 1e4), (_b2 = mr.unref) == null ? void 0 : _b2.call(mr));
    }, Cr = [], Qr = async (e, r) => {
      typeof Browser < "u" && Browser.init();
      for (var t of Cr) if (t.canHandle(r)) return u(t.handle.constructor.name === "AsyncFunction", "Filesystem plugin handlers must be async functions (See #24914)"), t.handle(e, r);
      return e;
    }, Lr = async (e, r, t, s, n, i, l, c) => {
      var h = r ? D.resolve(C.join2(e, r)) : e, S = Xr(`cp ${h}`);
      Jr(S);
      try {
        var x = t;
        typeof t == "string" && (x = await Yr(t)), x = await Qr(x, h), c == null ? void 0 : c(), i || qr(e, r, x, s, n, l);
      } finally {
        Zr(S);
      }
    }, et = (e, r, t, s, n, i, l, c, h, S) => {
      Lr(e, r, t, s, n, c, h, S).then(i).catch(l);
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
          super(Q ? Gr(e) : "");
          __publicField(this, "name", "ErrnoError");
          this.errno = e;
          for (var r in Hr) if (Hr[r] === e) {
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
        constructor(e, r, t, s) {
          __publicField(this, "node_ops", {});
          __publicField(this, "stream_ops", {});
          __publicField(this, "readMode", 365);
          __publicField(this, "writeMode", 146);
          __publicField(this, "mounted", null);
          e || (e = this), this.parent = e, this.mount = e.mount, this.id = o.nextInode++, this.name = r, this.mode = t, this.rdev = s, this.atime = this.mtime = this.ctime = Date.now();
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
        r.follow_mount ?? (r.follow_mount = true), C.isAbs(e) || (e = o.cwd() + "/" + e);
        e: for (var t = 0; t < 40; t++) {
          for (var s = e.split("/").filter((S) => !!S), n = o.root, i = "/", l = 0; l < s.length; l++) {
            var c = l === s.length - 1;
            if (c && r.parent) break;
            if (s[l] !== ".") {
              if (s[l] === "..") {
                if (i = C.dirname(i), o.isRoot(n)) {
                  e = i + "/" + s.slice(l + 1).join("/"), t--;
                  continue e;
                } else n = n.parent;
                continue;
              }
              i = C.join2(i, s[l]);
              try {
                n = o.lookupNode(n, s[l]);
              } catch (S) {
                if ((S == null ? void 0 : S.errno) === 44 && c && r.noent_okay) return {
                  path: i
                };
                throw S;
              }
              if (o.isMountpoint(n) && (!c || r.follow_mount) && (n = n.mounted.root), o.isLink(n.mode) && (!c || r.follow)) {
                if (!n.node_ops.readlink) throw new o.ErrnoError(52);
                var h = n.node_ops.readlink(n);
                C.isAbs(h) || (h = C.dirname(i) + "/" + h), e = h + "/" + s.slice(l + 1).join("/");
                continue e;
              }
            }
          }
          return {
            path: i,
            node: n
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
        for (var t = 0, s = 0; s < r.length; s++) t = (t << 5) - t + r.charCodeAt(s) | 0;
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
        for (var s = o.hashName(e.id, r), n = o.nameTable[s]; n; n = n.name_next) {
          var i = n.name;
          if (n.parent.id === e.id && i === r) return n;
        }
        return o.lookup(e, r);
      },
      createNode(e, r, t, s) {
        u(typeof e == "object");
        var n = new o.FSNode(e, r, t, s);
        return o.hashAddNode(n), n;
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
        var s;
        try {
          s = o.lookupNode(e, r);
        } catch (i) {
          return i.errno;
        }
        var n = o.nodePermissions(e, "wx");
        if (n) return n;
        if (t) {
          if (!o.isDir(s.mode)) return 54;
          if (o.isRoot(s) || o.getPath(s) === o.cwd()) return 10;
        } else if (o.isDir(s.mode)) return 31;
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
        var s = e == null ? void 0 : e.stream_ops.setattr, n = s ? e : r;
        s ?? (s = r.node_ops.setattr), o.checkOpExists(s, 63), s(n, t);
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
          var s = t.pop();
          r.push(s), t.push(...s.mounts);
        }
        return r;
      },
      syncfs(e, r) {
        typeof e == "function" && (r = e, e = false), o.syncFSRequests++, o.syncFSRequests > 1 && F(`warning: ${o.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
        var t = o.getMounts(o.root.mount), s = 0;
        function n(c) {
          return u(o.syncFSRequests > 0), o.syncFSRequests--, r(c);
        }
        function i(c) {
          if (c) return i.errored ? void 0 : (i.errored = true, n(c));
          ++s >= t.length && n(null);
        }
        for (var l of t) l.type.syncfs ? l.type.syncfs(l, e, i) : i(null);
      },
      mount(e, r, t) {
        if (typeof e == "string") throw e;
        var s = t === "/", n = !t, i;
        if (s && o.root) throw new o.ErrnoError(10);
        if (!s && !n) {
          var l = o.lookupPath(t, {
            follow_mount: false
          });
          if (t = l.path, i = l.node, o.isMountpoint(i)) throw new o.ErrnoError(10);
          if (!o.isDir(i.mode)) throw new o.ErrnoError(54);
        }
        var c = {
          type: e,
          opts: r,
          mountpoint: t,
          mounts: []
        }, h = e.mount(c);
        return h.mount = c, c.root = h, s ? o.root = h : i && (i.mounted = c, i.mount && i.mount.mounts.push(c)), h;
      },
      unmount(e) {
        var r = o.lookupPath(e, {
          follow_mount: false
        });
        if (!o.isMountpoint(r.node)) throw new o.ErrnoError(28);
        var t = r.node, s = t.mounted, n = o.getMounts(s);
        for (var [i, l] of Object.entries(o.nameTable)) for (; l; ) {
          var c = l.name_next;
          n.includes(l.mount) && o.destroyNode(l), l = c;
        }
        t.mounted = null;
        var h = t.mount.mounts.indexOf(s);
        u(h !== -1), t.mount.mounts.splice(h, 1);
      },
      lookup(e, r) {
        return e.node_ops.lookup(e, r);
      },
      mknod(e, r, t) {
        var s = o.lookupPath(e, {
          parent: true
        }), n = s.node, i = C.basename(e);
        if (!i) throw new o.ErrnoError(28);
        if (i === "." || i === "..") throw new o.ErrnoError(20);
        var l = o.mayCreate(n, i);
        if (l) throw new o.ErrnoError(l);
        if (!n.node_ops.mknod) throw new o.ErrnoError(63);
        return n.node_ops.mknod(n, i, r, t);
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
        var t = e.split("/"), s = "";
        for (var n of t) if (n) {
          (s || C.isAbs(e)) && (s += "/"), s += n;
          try {
            o.mkdir(s, r);
          } catch (i) {
            if (i.errno != 20) throw i;
          }
        }
      },
      mkdev(e, r, t) {
        return typeof t > "u" && (t = r, r = 438), r |= 8192, o.mknod(e, r, t);
      },
      symlink(e, r) {
        if (!D.resolve(e)) throw new o.ErrnoError(44);
        var t = o.lookupPath(r, {
          parent: true
        }), s = t.node;
        if (!s) throw new o.ErrnoError(44);
        var n = C.basename(r), i = o.mayCreate(s, n);
        if (i) throw new o.ErrnoError(i);
        if (!s.node_ops.symlink) throw new o.ErrnoError(63);
        return s.node_ops.symlink(s, n, e);
      },
      rename(e, r) {
        var t = C.dirname(e), s = C.dirname(r), n = C.basename(e), i = C.basename(r), l, c, h;
        if (l = o.lookupPath(e, {
          parent: true
        }), c = l.node, l = o.lookupPath(r, {
          parent: true
        }), h = l.node, !c || !h) throw new o.ErrnoError(44);
        if (c.mount !== h.mount) throw new o.ErrnoError(75);
        var S = o.lookupNode(c, n), x = D.relative(e, s);
        if (x.charAt(0) !== ".") throw new o.ErrnoError(28);
        if (x = D.relative(r, t), x.charAt(0) !== ".") throw new o.ErrnoError(55);
        var G;
        try {
          G = o.lookupNode(h, i);
        } catch {
        }
        if (S !== G) {
          var k = o.isDir(S.mode), R = o.mayDelete(c, n, k);
          if (R) throw new o.ErrnoError(R);
          if (R = G ? o.mayDelete(h, i, k) : o.mayCreate(h, i), R) throw new o.ErrnoError(R);
          if (!c.node_ops.rename) throw new o.ErrnoError(63);
          if (o.isMountpoint(S) || G && o.isMountpoint(G)) throw new o.ErrnoError(10);
          if (h !== c && (R = o.nodePermissions(c, "w"), R)) throw new o.ErrnoError(R);
          o.hashRemoveNode(S);
          try {
            c.node_ops.rename(S, h, i), S.parent = h;
          } catch (pe) {
            throw pe;
          } finally {
            o.hashAddNode(S);
          }
        }
      },
      rmdir(e) {
        var r = o.lookupPath(e, {
          parent: true
        }), t = r.node, s = C.basename(e), n = o.lookupNode(t, s), i = o.mayDelete(t, s, true);
        if (i) throw new o.ErrnoError(i);
        if (!t.node_ops.rmdir) throw new o.ErrnoError(63);
        if (o.isMountpoint(n)) throw new o.ErrnoError(10);
        t.node_ops.rmdir(t, s), o.destroyNode(n);
      },
      readdir(e) {
        var r = o.lookupPath(e, {
          follow: true
        }), t = r.node, s = o.checkOpExists(t.node_ops.readdir, 54);
        return s(t);
      },
      unlink(e) {
        var r = o.lookupPath(e, {
          parent: true
        }), t = r.node;
        if (!t) throw new o.ErrnoError(44);
        var s = C.basename(e), n = o.lookupNode(t, s), i = o.mayDelete(t, s, false);
        if (i) throw new o.ErrnoError(i);
        if (!t.node_ops.unlink) throw new o.ErrnoError(63);
        if (o.isMountpoint(n)) throw new o.ErrnoError(10);
        t.node_ops.unlink(t, s), o.destroyNode(n);
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
        }), s = t.node, n = o.checkOpExists(s.node_ops.getattr, 63);
        return n(s);
      },
      fstat(e) {
        var r = o.getStreamChecked(e), t = r.node, s = r.stream_ops.getattr, n = s ? r : t;
        return s ?? (s = t.node_ops.getattr), o.checkOpExists(s, 63), s(n);
      },
      lstat(e) {
        return o.stat(e, true);
      },
      doChmod(e, r, t, s) {
        o.doSetAttr(e, r, {
          mode: t & 4095 | r.mode & -4096,
          ctime: Date.now(),
          dontFollow: s
        });
      },
      chmod(e, r, t) {
        var s;
        if (typeof e == "string") {
          var n = o.lookupPath(e, {
            follow: !t
          });
          s = n.node;
        } else s = e;
        o.doChmod(null, s, r, t);
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
      chown(e, r, t, s) {
        var n;
        if (typeof e == "string") {
          var i = o.lookupPath(e, {
            follow: !s
          });
          n = i.node;
        } else n = e;
        o.doChown(null, n, s);
      },
      lchown(e, r, t) {
        o.chown(e, r, t, true);
      },
      fchown(e, r, t) {
        var s = o.getStreamChecked(e);
        o.doChown(s, s.node, false);
      },
      doTruncate(e, r, t) {
        if (o.isDir(r.mode)) throw new o.ErrnoError(31);
        if (!o.isFile(r.mode)) throw new o.ErrnoError(28);
        var s = o.nodePermissions(r, "w");
        if (s) throw new o.ErrnoError(s);
        o.doSetAttr(e, r, {
          size: t,
          timestamp: Date.now()
        });
      },
      truncate(e, r) {
        if (r < 0) throw new o.ErrnoError(28);
        var t;
        if (typeof e == "string") {
          var s = o.lookupPath(e, {
            follow: true
          });
          t = s.node;
        } else t = e;
        o.doTruncate(null, t, r);
      },
      ftruncate(e, r) {
        var t = o.getStreamChecked(e);
        if (r < 0 || !(t.flags & 2097155)) throw new o.ErrnoError(28);
        o.doTruncate(t, t.node, r);
      },
      utime(e, r, t) {
        var s = o.lookupPath(e, {
          follow: true
        }), n = s.node, i = o.checkOpExists(n.node_ops.setattr, 63);
        i(n, {
          atime: r,
          mtime: t
        });
      },
      open(e, r, t = 438) {
        if (e === "") throw new o.ErrnoError(44);
        r = typeof r == "string" ? jr(r) : r, r & 64 ? t = t & 4095 | 32768 : t = 0;
        var s, n;
        if (typeof e == "object") s = e;
        else {
          n = e.endsWith("/");
          var i = o.lookupPath(e, {
            follow: !(r & 131072),
            noent_okay: true
          });
          s = i.node, e = i.path;
        }
        var l = false;
        if (r & 64) if (s) {
          if (r & 128) throw new o.ErrnoError(20);
        } else {
          if (n) throw new o.ErrnoError(31);
          s = o.mknod(e, t | 511, 0), l = true;
        }
        if (!s) throw new o.ErrnoError(44);
        if (o.isChrdev(s.mode) && (r &= -513), r & 65536 && !o.isDir(s.mode)) throw new o.ErrnoError(54);
        if (!l) {
          var c = o.mayOpen(s, r);
          if (c) throw new o.ErrnoError(c);
        }
        r & 512 && !l && o.truncate(s, 0), r &= -131713;
        var h = o.createStream({
          node: s,
          path: o.getPath(s),
          flags: r,
          seekable: true,
          position: 0,
          stream_ops: s.stream_ops,
          ungotten: [],
          error: false
        });
        return h.stream_ops.open && h.stream_ops.open(h), l && o.chmod(s, t & 511), a.logReadFiles && !(r & 1) && (e in o.readFiles || (o.readFiles[e] = 1)), h;
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
      read(e, r, t, s, n) {
        if (u(t >= 0), s < 0 || n < 0) throw new o.ErrnoError(28);
        if (o.isClosed(e)) throw new o.ErrnoError(8);
        if ((e.flags & 2097155) === 1) throw new o.ErrnoError(8);
        if (o.isDir(e.node.mode)) throw new o.ErrnoError(31);
        if (!e.stream_ops.read) throw new o.ErrnoError(28);
        var i = typeof n < "u";
        if (!i) n = e.position;
        else if (!e.seekable) throw new o.ErrnoError(70);
        var l = e.stream_ops.read(e, r, t, s, n);
        return i || (e.position += l), l;
      },
      write(e, r, t, s, n, i) {
        if (u(t >= 0), s < 0 || n < 0) throw new o.ErrnoError(28);
        if (o.isClosed(e)) throw new o.ErrnoError(8);
        if (!(e.flags & 2097155)) throw new o.ErrnoError(8);
        if (o.isDir(e.node.mode)) throw new o.ErrnoError(31);
        if (!e.stream_ops.write) throw new o.ErrnoError(28);
        e.seekable && e.flags & 1024 && o.llseek(e, 0, 2);
        var l = typeof n < "u";
        if (!l) n = e.position;
        else if (!e.seekable) throw new o.ErrnoError(70);
        var c = e.stream_ops.write(e, r, t, s, n, i);
        return l || (e.position += c), c;
      },
      mmap(e, r, t, s, n) {
        if (s & 2 && !(n & 2) && (e.flags & 2097155) !== 2) throw new o.ErrnoError(2);
        if ((e.flags & 2097155) === 1) throw new o.ErrnoError(2);
        if (!e.stream_ops.mmap) throw new o.ErrnoError(43);
        if (!r) throw new o.ErrnoError(28);
        return e.stream_ops.mmap(e, r, t, s, n);
      },
      msync(e, r, t, s, n) {
        return u(t >= 0), e.stream_ops.msync ? e.stream_ops.msync(e, r, t, s, n) : 0;
      },
      ioctl(e, r, t) {
        if (!e.stream_ops.ioctl) throw new o.ErrnoError(59);
        return e.stream_ops.ioctl(e, r, t);
      },
      readFile(e, r = {}) {
        r.flags = r.flags || 0, r.encoding = r.encoding || "binary", r.encoding !== "utf8" && r.encoding !== "binary" && w(`Invalid encoding type "${r.encoding}"`);
        var t = o.open(e, r.flags), s = o.stat(e), n = s.size, i = new Uint8Array(n);
        return o.read(t, i, 0, n, 0), r.encoding === "utf8" && (i = be(i)), o.close(t), i;
      },
      writeFile(e, r, t = {}) {
        t.flags = t.flags || 577;
        var s = o.open(e, t.flags, t.mode);
        typeof r == "string" && (r = new Uint8Array(Le(r))), ArrayBuffer.isView(r) ? o.write(s, r, 0, r.byteLength, void 0, t.canOwn) : w("Unsupported data type"), o.close(s);
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
          write: (s, n, i, l, c) => l,
          llseek: () => 0
        }), o.mkdev("/dev/null", o.makedev(1, 3)), qe.register(o.makedev(5, 0), qe.default_tty_ops), qe.register(o.makedev(6, 0), qe.default_tty1_ops), o.mkdev("/dev/tty", o.makedev(5, 0)), o.mkdev("/dev/tty1", o.makedev(6, 0));
        var e = new Uint8Array(1024), r = 0, t = () => (r === 0 && (fe(e), r = e.byteLength), e[--r]);
        o.createDevice("/dev", "random", t), o.createDevice("/dev", "urandom", t), o.mkdir("/dev/shm"), o.mkdir("/dev/shm/tmp");
      },
      createSpecialDirectories() {
        o.mkdir("/proc");
        var e = o.mkdir("/proc/self");
        o.mkdir("/proc/self/fd"), o.mount({
          mount() {
            var r = o.createNode(e, "fd", 16895, 73);
            return r.stream_ops = {
              llseek: O.stream_ops.llseek
            }, r.node_ops = {
              lookup(t, s) {
                var n = +s, i = o.getStreamChecked(n), l = {
                  parent: null,
                  mount: {
                    mountpoint: "fake"
                  },
                  node_ops: {
                    readlink: () => i.path
                  },
                  id: n + 1
                };
                return l.parent = l, l;
              },
              readdir() {
                return Array.from(o.streams.entries()).filter(([t, s]) => s).map(([t, s]) => t.toString());
              }
            }, r;
          }
        }, {}, "/proc/self/fd");
      },
      createStandardStreams(e, r, t) {
        e ? o.createDevice("/dev", "stdin", e) : o.symlink("/dev/tty", "/dev/stdin"), r ? o.createDevice("/dev", "stdout", null, r) : o.symlink("/dev/tty", "/dev/stdout"), t ? o.createDevice("/dev", "stderr", null, t) : o.symlink("/dev/tty1", "/dev/stderr");
        var s = o.open("/dev/stdin", 0), n = o.open("/dev/stdout", 1), i = o.open("/dev/stderr", 1);
        u(s.fd === 0, `invalid handle for stdin (${s.fd})`), u(n.fd === 1, `invalid handle for stdout (${n.fd})`), u(i.fd === 2, `invalid handle for stderr (${i.fd})`);
      },
      staticInit() {
        o.nameTable = new Array(4096), o.mount(O, {}, "/"), o.createDefaultDirectories(), o.createDefaultDevices(), o.createSpecialDirectories(), o.filesystems = {
          MEMFS: O
        };
      },
      init(e, r, t) {
        u(!o.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"), o.initialized = true, e ?? (e = a.stdin), r ?? (r = a.stdout), t ?? (t = a.stderr), o.createStandardStreams(e, r, t);
      },
      quit() {
        o.initialized = false, zr(0);
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
        var s = {
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
          s.parentExists = true, s.parentPath = t.path, s.parentObject = t.node, s.name = C.basename(e), t = o.lookupPath(e, {
            follow: !r
          }), s.exists = true, s.path = t.path, s.object = t.node, s.name = t.node.name, s.isRoot = t.path === "/";
        } catch (n) {
          s.error = n.errno;
        }
        return s;
      },
      createPath(e, r, t, s) {
        e = typeof e == "string" ? e : o.getPath(e);
        for (var n = r.split("/").reverse(); n.length; ) {
          var i = n.pop();
          if (i) {
            var l = C.join2(e, i);
            try {
              o.mkdir(l);
            } catch (c) {
              if (c.errno != 20) throw c;
            }
            e = l;
          }
        }
        return l;
      },
      createFile(e, r, t, s, n) {
        var i = C.join2(typeof e == "string" ? e : o.getPath(e), r), l = Or(s, n);
        return o.create(i, l);
      },
      createDataFile(e, r, t, s, n, i) {
        var l = r;
        e && (e = typeof e == "string" ? e : o.getPath(e), l = r ? C.join2(e, r) : e);
        var c = Or(s, n), h = o.create(l, c);
        if (t) {
          if (typeof t == "string") {
            for (var S = new Array(t.length), x = 0, G = t.length; x < G; ++x) S[x] = t.charCodeAt(x);
            t = S;
          }
          o.chmod(h, c | 146);
          var k = o.open(h, 577);
          o.write(k, t, 0, t.length, 0, i), o.close(k), o.chmod(h, c);
        }
      },
      createDevice(e, r, t, s) {
        var _a2;
        var n = C.join2(typeof e == "string" ? e : o.getPath(e), r), i = Or(!!t, !!s);
        (_a2 = o.createDevice).major ?? (_a2.major = 64);
        var l = o.makedev(o.createDevice.major++, 0);
        return o.registerDevice(l, {
          open(c) {
            c.seekable = false;
          },
          close(c) {
            var _a3;
            ((_a3 = s == null ? void 0 : s.buffer) == null ? void 0 : _a3.length) && s(10);
          },
          read(c, h, S, x, G) {
            for (var k = 0, R = 0; R < x; R++) {
              var pe;
              try {
                pe = t();
              } catch {
                throw new o.ErrnoError(29);
              }
              if (pe === void 0 && k === 0) throw new o.ErrnoError(6);
              if (pe == null) break;
              k++, h[S + R] = pe;
            }
            return k && (c.node.atime = Date.now()), k;
          },
          write(c, h, S, x, G) {
            for (var k = 0; k < x; k++) try {
              s(h[S + k]);
            } catch {
              throw new o.ErrnoError(29);
            }
            return x && (c.node.mtime = c.node.ctime = Date.now()), k;
          }
        }), o.mkdev(n, i, l);
      },
      forceLoadFile(e) {
        if (e.isDevice || e.isFolder || e.link || e.contents) return true;
        if (globalThis.XMLHttpRequest) w("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        else try {
          e.contents = L(e.url);
        } catch {
          throw new o.ErrnoError(29);
        }
      },
      createLazyFile(e, r, t, s, n) {
        class i {
          constructor() {
            __publicField(this, "lengthKnown", false);
            __publicField(this, "chunks", []);
          }
          get(k) {
            if (!(k > this.length - 1 || k < 0)) {
              var R = k % this.chunkSize, pe = k / this.chunkSize | 0;
              return this.getter(pe)[R];
            }
          }
          setDataGetter(k) {
            this.getter = k;
          }
          cacheLength() {
            var k = new XMLHttpRequest();
            k.open("HEAD", t, false), k.send(null), k.status >= 200 && k.status < 300 || k.status === 304 || w("Couldn't load " + t + ". Status: " + k.status);
            var R = Number(k.getResponseHeader("Content-length")), pe, Re = (pe = k.getResponseHeader("Accept-Ranges")) && pe === "bytes", Ne = (pe = k.getResponseHeader("Content-Encoding")) && pe === "gzip", Ue = 1024 * 1024;
            Re || (Ue = R);
            var Be = (Xe, Ar) => {
              Xe > Ar && w("invalid range (" + Xe + ", " + Ar + ") or no bytes requested!"), Ar > R - 1 && w("only " + R + " bytes available! programmer error!");
              var we = new XMLHttpRequest();
              return we.open("GET", t, false), R !== Ue && we.setRequestHeader("Range", "bytes=" + Xe + "-" + Ar), we.responseType = "arraybuffer", we.overrideMimeType && we.overrideMimeType("text/plain; charset=x-user-defined"), we.send(null), we.status >= 200 && we.status < 300 || we.status === 304 || w("Couldn't load " + t + ". Status: " + we.status), we.response !== void 0 ? new Uint8Array(we.response || []) : Le(we.responseText || "");
            }, br = this;
            br.setDataGetter((Xe) => {
              var Ar = Xe * Ue, we = (Xe + 1) * Ue - 1;
              return we = Math.min(we, R - 1), typeof br.chunks[Xe] > "u" && (br.chunks[Xe] = Be(Ar, we)), typeof br.chunks[Xe] > "u" && w("doXHR failed!"), br.chunks[Xe];
            }), (Ne || !R) && (Ue = R = 1, R = this.getter(0).length, Ue = R, A("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = R, this._chunkSize = Ue, this.lengthKnown = true;
          }
          get length() {
            return this.lengthKnown || this.cacheLength(), this._length;
          }
          get chunkSize() {
            return this.lengthKnown || this.cacheLength(), this._chunkSize;
          }
        }
        if (globalThis.XMLHttpRequest) {
          y || w("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
          var l = new i(), c = {
            isDevice: false,
            contents: l
          };
        } else var c = {
          isDevice: false,
          url: t
        };
        var h = o.createFile(e, r, c, s, n);
        c.contents ? h.contents = c.contents : c.url && (h.contents = null, h.url = c.url), Object.defineProperties(h, {
          usedBytes: {
            get: function() {
              return this.contents.length;
            }
          }
        });
        var S = {};
        for (const [G, k] of Object.entries(h.stream_ops)) S[G] = (...R) => (o.forceLoadFile(h), k(...R));
        function x(G, k, R, pe, Re) {
          var Ne = G.node.contents;
          if (Re >= Ne.length) return 0;
          var Ue = Math.min(Ne.length - Re, pe);
          if (u(Ue >= 0), Ne.slice) for (var Be = 0; Be < Ue; Be++) k[R + Be] = Ne[Re + Be];
          else for (var Be = 0; Be < Ue; Be++) k[R + Be] = Ne.get(Re + Be);
          return Ue;
        }
        return S.read = (G, k, R, pe, Re) => (o.forceLoadFile(h), x(G, k, R, pe, Re)), S.mmap = (G, k, R, pe, Re) => {
          o.forceLoadFile(h);
          var Ne = Dr();
          if (!Ne) throw new o.ErrnoError(48);
          return x(G, K, Ne, k, R), {
            ptr: Ne,
            allocated: true
          };
        }, h.stream_ops = S, h;
      },
      absolutePath() {
        w("FS.absolutePath has been removed; use PATH_FS.resolve instead");
      },
      createFolder() {
        w("FS.createFolder has been removed; use FS.mkdir instead");
      },
      createLink() {
        w("FS.createLink has been removed; use FS.symlink instead");
      },
      joinPath() {
        w("FS.joinPath has been removed; use PATH.join instead");
      },
      mmapAlloc() {
        w("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
      },
      standardizePath() {
        w("FS.standardizePath has been removed; use PATH.normalize instead");
      }
    }, kr = {
      calculateAt(e, r, t) {
        if (C.isAbs(r)) return r;
        var s;
        if (e === -100) s = o.cwd();
        else {
          var n = kr.getStreamFromFD(e);
          s = n.path;
        }
        if (r.length == 0) {
          if (!t) throw new o.ErrnoError(44);
          return s;
        }
        return s + "/" + r;
      },
      writeStat(e, r) {
        _[e >> 2] = r.dev, _[e + 4 >> 2] = r.mode, _[e + 8 >> 2] = r.nlink, _[e + 12 >> 2] = r.uid, _[e + 16 >> 2] = r.gid, _[e + 20 >> 2] = r.rdev, W[e + 24 >> 3] = BigInt(r.size), ye[e + 32 >> 2] = 4096, ye[e + 36 >> 2] = r.blocks;
        var t = r.atime.getTime(), s = r.mtime.getTime(), n = r.ctime.getTime();
        return W[e + 40 >> 3] = BigInt(Math.floor(t / 1e3)), _[e + 48 >> 2] = t % 1e3 * 1e3 * 1e3, W[e + 56 >> 3] = BigInt(Math.floor(s / 1e3)), _[e + 64 >> 2] = s % 1e3 * 1e3 * 1e3, W[e + 72 >> 3] = BigInt(Math.floor(n / 1e3)), _[e + 80 >> 2] = n % 1e3 * 1e3 * 1e3, W[e + 88 >> 3] = BigInt(r.ino), 0;
      },
      writeStatFs(e, r) {
        _[e + 4 >> 2] = r.bsize, _[e + 60 >> 2] = r.bsize, W[e + 8 >> 3] = BigInt(r.blocks), W[e + 16 >> 3] = BigInt(r.bfree), W[e + 24 >> 3] = BigInt(r.bavail), W[e + 32 >> 3] = BigInt(r.files), W[e + 40 >> 3] = BigInt(r.ffree), _[e + 48 >> 2] = r.fsid, _[e + 64 >> 2] = r.flags, _[e + 56 >> 2] = r.namelen;
      },
      doMsync(e, r, t, s, n) {
        if (!o.isFile(r.node.mode)) throw new o.ErrnoError(43);
        if (s & 2) return 0;
        var i = ie.slice(e, e + t);
        o.msync(r, i, n, t, s);
      },
      getStreamFromFD(e) {
        var r = o.getStreamChecked(e);
        return r;
      },
      varargs: void 0,
      getStr(e) {
        var r = Me(e);
        return r;
      }
    };
    function rt(e) {
      try {
        var r = kr.getStreamFromFD(e);
        return o.close(r), 0;
      } catch (t) {
        if (typeof o > "u" || t.name !== "ErrnoError") throw t;
        return t.errno;
      }
    }
    var tt = (e, r, t, s) => {
      for (var n = 0, i = 0; i < t; i++) {
        var l = _[r >> 2], c = _[r + 4 >> 2];
        r += 8;
        var h = o.read(e, K, l, c, s);
        if (h < 0) return -1;
        if (n += h, h < c) break;
      }
      return n;
    };
    function ot(e, r, t, s) {
      try {
        var n = kr.getStreamFromFD(e), i = tt(n, r, t);
        return _[s >> 2] = i, 0;
      } catch (l) {
        if (typeof o > "u" || l.name !== "ErrnoError") throw l;
        return l.errno;
      }
    }
    function st(e, r, t, s) {
      r = Ge(r);
      try {
        if (isNaN(r)) return 61;
        var n = kr.getStreamFromFD(e);
        return o.llseek(n, r, t), W[s >> 3] = BigInt(n.position), n.getdents && r === 0 && t === 0 && (n.getdents = null), 0;
      } catch (i) {
        if (typeof o > "u" || i.name !== "ErrnoError") throw i;
        return i.errno;
      }
    }
    var nt = (e, r, t, s) => {
      for (var n = 0, i = 0; i < t; i++) {
        var l = _[r >> 2], c = _[r + 4 >> 2];
        r += 8;
        var h = o.write(e, K, l, c, s);
        if (h < 0) return -1;
        if (n += h, h < c) break;
      }
      return n;
    };
    function at(e, r, t, s) {
      try {
        var n = kr.getStreamFromFD(e), i = nt(n, r, t);
        return _[s >> 2] = i, 0;
      } catch (l) {
        if (typeof o > "u" || l.name !== "ErrnoError") throw l;
        return l.errno;
      }
    }
    o.createPreloadedFile = et, o.preloadFile = Lr, o.staticInit();
    {
      if (a.noExitRuntime && a.noExitRuntime, a.preloadPlugins && (Cr = a.preloadPlugins), a.print && (A = a.print), a.printErr && (F = a.printErr), a.wasmBinary && (P = a.wasmBinary), ct(), a.arguments && a.arguments, a.thisProgram && (ne = a.thisProgram), u(typeof a.memoryInitializerPrefixURL > "u", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead"), u(typeof a.pthreadMainPrefixURL > "u", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead"), u(typeof a.cdInitializerPrefixURL > "u", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead"), u(typeof a.filePackagePrefixURL > "u", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead"), u(typeof a.read > "u", "Module.read option was removed"), u(typeof a.readAsync > "u", "Module.readAsync option was removed (modify readAsync in JS)"), u(typeof a.readBinary > "u", "Module.readBinary option was removed (modify readBinary in JS)"), u(typeof a.setWindowTitle > "u", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)"), u(typeof a.TOTAL_MEMORY > "u", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY"), u(typeof a.ENVIRONMENT > "u", "Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)"), u(typeof a.STACK_SIZE > "u", "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time"), u(typeof a.wasmMemory > "u", "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally"), u(typeof a.INITIAL_MEMORY > "u", "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically"), a.preInit) for (typeof a.preInit == "function" && (a.preInit = [
        a.preInit
      ]); a.preInit.length > 0; ) a.preInit.shift()();
      te("preInit");
    }
    var it = [
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
    it.forEach(he);
    var lt = [
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
    lt.forEach(le);
    function ct() {
      ae("fetchSettings");
    }
    a._deform = T("_deform"), a._malloc = T("_malloc"), a._free = T("_free"), a._assembled_joint_mass = T("_assembled_joint_mass"), a._modal = T("_modal"), a._modal_paz = T("_modal_paz"), a._didactic_solve = T("_didactic_solve"), a._plate_q4_solve = T("_plate_q4_solve"), a._slopeAllocDouble = T("_slopeAllocDouble"), a._slopeStabilitySolver = T("_slopeStabilitySolver"), a._nonlinear_dynamic = T("_nonlinear_dynamic"), a._steel02_test = T("_steel02_test"), a._cyclic_pushover = T("_cyclic_pushover"), a._concrete02_test = T("_concrete02_test"), a._hex8_solve = T("_hex8_solve"), a._hex8_stress = T("_hex8_stress");
    var zr = T("_fflush"), xr = T("_strerror"), Rr = T("_emscripten_stack_get_end"), Br = T("_emscripten_stack_init"), Mr = T("wasmMemory");
    function dt(e) {
      u(typeof e.deform < "u", "missing Wasm export: deform"), u(typeof e.malloc < "u", "missing Wasm export: malloc"), u(typeof e.free < "u", "missing Wasm export: free"), u(typeof e.assembled_joint_mass < "u", "missing Wasm export: assembled_joint_mass"), u(typeof e.modal < "u", "missing Wasm export: modal"), u(typeof e.modal_paz < "u", "missing Wasm export: modal_paz"), u(typeof e.didactic_solve < "u", "missing Wasm export: didactic_solve"), u(typeof e.plate_q4_solve < "u", "missing Wasm export: plate_q4_solve"), u(typeof e.slopeAllocDouble < "u", "missing Wasm export: slopeAllocDouble"), u(typeof e.slopeStabilitySolver < "u", "missing Wasm export: slopeStabilitySolver"), u(typeof e.nonlinear_dynamic < "u", "missing Wasm export: nonlinear_dynamic"), u(typeof e.steel02_test < "u", "missing Wasm export: steel02_test"), u(typeof e.cyclic_pushover < "u", "missing Wasm export: cyclic_pushover"), u(typeof e.concrete02_test < "u", "missing Wasm export: concrete02_test"), u(typeof e.hex8_solve < "u", "missing Wasm export: hex8_solve"), u(typeof e.hex8_stress < "u", "missing Wasm export: hex8_stress"), u(typeof e.fflush < "u", "missing Wasm export: fflush"), u(typeof e.strerror < "u", "missing Wasm export: strerror"), u(typeof e.emscripten_stack_get_end < "u", "missing Wasm export: emscripten_stack_get_end"), u(typeof e.emscripten_stack_get_base < "u", "missing Wasm export: emscripten_stack_get_base"), u(typeof e.emscripten_stack_init < "u", "missing Wasm export: emscripten_stack_init"), u(typeof e.emscripten_stack_get_free < "u", "missing Wasm export: emscripten_stack_get_free"), u(typeof e._emscripten_stack_restore < "u", "missing Wasm export: _emscripten_stack_restore"), u(typeof e._emscripten_stack_alloc < "u", "missing Wasm export: _emscripten_stack_alloc"), u(typeof e.emscripten_stack_get_current < "u", "missing Wasm export: emscripten_stack_get_current"), u(typeof e.memory < "u", "missing Wasm export: memory"), u(typeof e.__indirect_function_table < "u", "missing Wasm export: __indirect_function_table"), a._deform = H("deform", 80), a._malloc = H("malloc", 1), a._free = H("free", 1), a._assembled_joint_mass = H("assembled_joint_mass", 22), a._modal = H("modal", 87), a._modal_paz = H("modal_paz", 54), a._didactic_solve = H("didactic_solve", 48), a._plate_q4_solve = H("plate_q4_solve", 26), a._slopeAllocDouble = H("slopeAllocDouble", 1), a._slopeStabilitySolver = H("slopeStabilitySolver", 16), a._nonlinear_dynamic = H("nonlinear_dynamic", 20), a._steel02_test = H("steel02_test", 8), a._cyclic_pushover = H("cyclic_pushover", 40), a._concrete02_test = H("concrete02_test", 10), a._hex8_solve = H("hex8_solve", 18), a._hex8_stress = H("hex8_stress", 7), zr = H("fflush", 1), xr = H("strerror", 1), Rr = e.emscripten_stack_get_end, e.emscripten_stack_get_base, Br = e.emscripten_stack_init, e.emscripten_stack_get_free, e._emscripten_stack_restore, e._emscripten_stack_alloc, e.emscripten_stack_get_current, Mr = e.memory, e.__indirect_function_table;
    }
    var Ir = {
      __assert_fail: sr,
      __cxa_throw: nr,
      _abort_js: ar,
      _tzset_js: Qe,
      clock_time_get: xe,
      emscripten_resize_heap: dr,
      environ_get: ur,
      environ_sizes_get: fr,
      fd_close: rt,
      fd_read: ot,
      fd_seek: st,
      fd_write: at
    }, Wr;
    function ut() {
      Br(), Y();
    }
    function Nr() {
      if (_r > 0) {
        Sr = Nr;
        return;
      }
      if (ut(), Fe(), _r > 0) {
        Sr = Nr;
        return;
      }
      function e() {
        var _a2;
        u(!Wr), Wr = true, a.calledRun = true, !I && (Ee(), ce == null ? void 0 : ce(a), (_a2 = a.onRuntimeInitialized) == null ? void 0 : _a2.call(a), te("onRuntimeInitialized"), u(!a._main, 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]'), ge());
      }
      a.setStatus ? (a.setStatus("Running..."), setTimeout(() => {
        setTimeout(() => a.setStatus(""), 1), e();
      }, 1)) : e(), q();
    }
    var Pr;
    Pr = await V(), Nr(), Q ? m = a : m = new Promise((e, r) => {
      ce = e, de = r;
    });
    for (const e of Object.keys(a)) e in f || Object.defineProperty(f, e, {
      configurable: true,
      get() {
        w(`Access to module property ('${e}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`);
      }
    });
    return m;
  };
  function Kr(f) {
    const m = new Array(12).fill(0);
    if (!f) return m;
    if (f.length >= 12) {
      for (let d = 0; d < 12; d++) m[d] = f[d] ? 1 : 0;
      return m;
    }
    const a = [
      3,
      4,
      5,
      9,
      10,
      11
    ];
    for (let d = 0; d < 6 && d < f.length; d++) f[d] && (m[a[d]] = 1);
    return m;
  }
  const M = await Fr();
  yt = function(f, m, a, d, y) {
    if (f.length === 0) return;
    const p = [], Z = re(f.flat(), Float64Array, M.HEAPF64);
    p.push(Z);
    const z = m.flat(), ne = re(z, Uint32Array, M.HEAPU32);
    p.push(ne);
    const B = m.map((D) => D.length), v = re(B, Uint32Array, M.HEAPU32);
    p.push(v);
    const me = a.supports ? Array.from(a.supports.keys()) : [], J = a.supports ? Array.from(a.supports.values()).flat().map((D) => D ? 1 : 0) : [], L = re(me, Uint32Array, M.HEAPU32);
    p.push(L);
    const g = re(J, Uint8Array, M.HEAPU8);
    p.push(g);
    const A = a.loads ? Array.from(a.loads.keys()) : [], F = a.loads ? Array.from(a.loads.values()).flat() : [], P = re(A, Uint32Array, M.HEAPU32);
    p.push(P);
    const I = re(F, Float64Array, M.HEAPF64);
    p.push(I);
    const u = (D) => {
      const Te = D ? Array.from(D.keys()) : [], Le = D ? Array.from(D.values()) : [], Tr = re(Te, Uint32Array, M.HEAPU32);
      p.push(Tr);
      const qe = re(Le, Float64Array, M.HEAPF64);
      return p.push(qe), {
        keysPtr: Tr,
        valuesPtr: qe,
        size: Te.length
      };
    }, b = u(d.elasticities), Y = u(d.elasticitiesOrthogonal), q = u(d.areas), te = u(d.momentsOfInertiaZ), T = u(d.momentsOfInertiaY), ae = u(d.shearModuli), N = u(d.torsionalConstants), he = u(d.thicknesses), le = u(d.poissonsRatios), ce = u(d.shearAreasY), de = u(d.shearAreasZ), K = d.rigidOffsets ? Array.from(d.rigidOffsets.keys()) : [], ie = d.rigidOffsets ? Array.from(d.rigidOffsets.values()).flat() : [], ye = re(K, Uint32Array, M.HEAPU32);
    p.push(ye);
    const _ = re(ie, Float64Array, M.HEAPF64);
    p.push(_);
    const W = d.momentReleases ? Array.from(d.momentReleases.keys()) : [], Q = d.momentReleases ? Array.from(d.momentReleases.values()).flatMap(Kr) : [], _e = re(W, Uint32Array, M.HEAPU32);
    p.push(_e);
    const Fe = re(Q, Uint8Array, M.HEAPU8);
    p.push(Fe);
    const Ee = M._malloc(4);
    p.push(Ee);
    const ge = M._malloc(4);
    p.push(ge);
    const w = M._malloc(4);
    p.push(w);
    const H = M._malloc(4);
    p.push(H);
    const Pe = y ? y.flatMap((D) => [
      D.node,
      D.dof,
      D.k
    ]) : [], ue = re(Pe.length > 0 ? Pe : [
      0
    ], Float64Array, M.HEAPF64);
    p.push(ue);
    const Ae = d.plateFormulations, Se = Ae ? Array.from(Ae.keys()) : [], j = Ae ? Array.from(Ae.values()) : [], oe = re(Se, Uint32Array, M.HEAPU32);
    p.push(oe);
    const U = re(j, Uint32Array, M.HEAPU32);
    p.push(U);
    const V = d.drillingTypes, ee = V ? Array.from(V.keys()) : [], ze = V ? Array.from(V.values()) : [], We = re(ee, Uint32Array, M.HEAPU32);
    p.push(We);
    const Ze = re(ze, Uint32Array, M.HEAPU32);
    p.push(Ze);
    const Ve = d.drillingPenaltyScales, Oe = Ve ? Array.from(Ve.keys()) : [], $e = Ve ? Array.from(Ve.values()) : [], tr = re(Oe, Uint32Array, M.HEAPU32);
    p.push(tr);
    const or = re($e, Float64Array, M.HEAPF64);
    p.push(or);
    const be = d.membraneModifiers, Me = d.bendingModifiers, sr = be ? Array.from(be.keys()) : [], hr = be ? Array.from(be.values()) : [], nr = re(sr, Uint32Array, M.HEAPU32);
    p.push(nr);
    const ar = re(hr, Float64Array, M.HEAPF64);
    p.push(ar);
    const Je = Me ? Array.from(Me.keys()) : [], De = Me ? Array.from(Me.values()) : [], He = re(Je, Uint32Array, M.HEAPU32);
    p.push(He);
    const Qe = re(De, Float64Array, M.HEAPF64);
    p.push(Qe);
    const Ke = d.shellModifiers, je = Ke ? Array.from(Ke.keys()) : [], ir = [];
    if (Ke) for (const D of je) {
      const Te = Ke.get(D);
      for (let Le = 0; Le < 8; Le++) ir.push(Te[Le] ?? 1);
    }
    const lr = re(je, Uint32Array, M.HEAPU32);
    p.push(lr);
    const er = re(ir, Float64Array, M.HEAPF64);
    p.push(er);
    const Ge = d.localAngles, xe = Ge ? Array.from(Ge.keys()) : [], cr = Ge ? Array.from(Ge.values()) : [], pr = re(xe, Uint32Array, M.HEAPU32);
    p.push(pr);
    const vr = re(cr, Float64Array, M.HEAPF64);
    p.push(vr);
    const dr = u(a.diaphragms);
    M._deform(Z, f.length, ne, z.length, v, m.length, L, g, me.length, P, I, A.length, b.keysPtr, b.valuesPtr, b.size, q.keysPtr, q.valuesPtr, q.size, te.keysPtr, te.valuesPtr, te.size, T.keysPtr, T.valuesPtr, T.size, ae.keysPtr, ae.valuesPtr, ae.size, N.keysPtr, N.valuesPtr, N.size, he.keysPtr, he.valuesPtr, he.size, le.keysPtr, le.valuesPtr, le.size, Y.keysPtr, Y.valuesPtr, Y.size, ce.keysPtr, ce.valuesPtr, ce.size, de.keysPtr, de.valuesPtr, de.size, ue, y ? y.length : 0, oe, U, Se.length, We, Ze, ee.length, tr, or, Oe.length, nr, ar, sr.length, He, Qe, Je.length, lr, er, je.length, pr, vr, xe.length, _e, Fe, W.length, d.etabsWallJoint === false ? 0 : 1, dr.keysPtr, dr.valuesPtr, dr.size, d.solidIncompatible === false ? 0 : 1, Ee, ge, w, H);
    const Ye = M.HEAPU32[Ee / 4], yr = M.HEAPU32[ge / 4], Ce = M.HEAPU32[w / 4], ur = M.HEAPU32[H / 4], fr = new Float64Array(M.HEAPF64.buffer, Ye, yr), C = new Float64Array(M.HEAPF64.buffer, Ce, ur), se = /* @__PURE__ */ new Map();
    for (let D = 0; D < yr; D += 7) {
      const Te = fr[D];
      se.set(Te, Array.from(fr.slice(D + 1, D + 7)));
    }
    const fe = /* @__PURE__ */ new Map();
    for (let D = 0; D < ur; D += 7) {
      const Te = C[D];
      fe.set(Te, Array.from(C.slice(D + 1, D + 7)));
    }
    return Ye && p.push(Ye), Ce && p.push(Ce), p.forEach((D) => M._free(D)), {
      deformations: se,
      reactions: fe
    };
  };
  function re(f, m, a) {
    const d = new m(f), y = M._malloc(d.length * d.BYTES_PER_ELEMENT);
    return (m === Float64Array ? M.HEAPF64 : m === Uint32Array ? M.HEAPU32 : m === Uint8Array ? M.HEAPU8 : a).set(d, y / d.BYTES_PER_ELEMENT), y;
  }
  const E = await Fr();
  _t = function(f, m, a, d, y = 10, p = 0, Z = 0, z = 1, ne, B) {
    if (f.length === 0) return {
      frequencies: [],
      modeShapes: [],
      massParticipation: []
    };
    const v = [], me = ke(f.flat(), Float64Array, E.HEAPF64);
    v.push(me);
    const J = m.flat(), L = ke(J, Uint32Array, E.HEAPU32);
    v.push(L);
    const g = m.map((se) => se.length), A = ke(g, Uint32Array, E.HEAPU32);
    v.push(A);
    const F = a.supports ? Array.from(a.supports.keys()) : [], P = a.supports ? Array.from(a.supports.values()).flat().map((se) => se ? 1 : 0) : [], I = ke(F, Uint32Array, E.HEAPU32);
    v.push(I);
    const u = ke(P, Uint8Array, E.HEAPU8);
    v.push(u);
    const b = (se) => {
      const fe = se ? Array.from(se.keys()) : [], D = se ? Array.from(se.values()) : [], Te = ke(fe, Uint32Array, E.HEAPU32);
      v.push(Te);
      const Le = ke(D, Float64Array, E.HEAPF64);
      return v.push(Le), {
        keysPtr: Te,
        valuesPtr: Le,
        size: fe.length
      };
    }, Y = b(d.elasticities), q = b(d.areas), te = b(d.momentsOfInertiaZ), T = b(d.momentsOfInertiaY), ae = b(d.shearModuli), N = b(d.torsionalConstants), he = b(d.densities), le = b(d.thicknesses), ce = b(d.poissonsRatios), de = b(d.membraneModifiers), K = b(d.bendingModifiers), ie = d.plateFormulations, ye = ie ? Array.from(ie.keys()) : [], _ = ie ? Array.from(ie.values()) : [], W = ke(ye, Uint32Array, E.HEAPU32);
    v.push(W);
    const Q = ke(_, Uint32Array, E.HEAPU32);
    v.push(Q);
    const _e = d.drillingTypes, Fe = _e ? Array.from(_e.keys()) : [], Ee = _e ? Array.from(_e.values()) : [], ge = ke(Fe, Uint32Array, E.HEAPU32);
    v.push(ge);
    const w = ke(Ee, Uint32Array, E.HEAPU32);
    v.push(w);
    const H = d.drillingPenaltyScales, Pe = H ? Array.from(H.keys()) : [], ue = H ? Array.from(H.values()) : [], Ae = ke(Pe, Uint32Array, E.HEAPU32);
    v.push(Ae);
    const Se = ke(ue, Float64Array, E.HEAPF64);
    v.push(Se);
    const j = b(d.shearAreasY), oe = b(d.shearAreasZ), U = b(d.localAngles), V = d.momentReleases ? Array.from(d.momentReleases.keys()) : [], ee = d.momentReleases ? Array.from(d.momentReleases.values()).flatMap(Kr) : [], ze = ke(V, Uint32Array, E.HEAPU32);
    v.push(ze);
    const We = ke(ee, Uint8Array, E.HEAPU8);
    v.push(We);
    const Ze = b(a.masses), Ve = b(ne ?? a.diaphragms), Oe = B ?? a.springs, $e = Oe ? Oe.flatMap((se) => [
      se.node,
      se.dof,
      se.k
    ]) : [], tr = ke($e.length > 0 ? $e : [
      0
    ], Float64Array, E.HEAPF64);
    v.push(tr);
    const or = E._malloc(4);
    v.push(or);
    const be = E._malloc(4);
    v.push(be);
    const Me = E._malloc(4);
    v.push(Me);
    const sr = E._malloc(4);
    v.push(sr);
    const hr = E._malloc(4);
    v.push(hr);
    const nr = E._malloc(4);
    v.push(nr);
    const ar = E._malloc(4);
    v.push(ar);
    const Je = E._malloc(4);
    v.push(Je);
    const De = E._malloc(4);
    v.push(De);
    const He = E._malloc(4);
    v.push(He);
    const Qe = E._malloc(4);
    v.push(Qe), E.HEAPU32[De / 4] = 0, E.HEAPU32[He / 4] = 0, E.HEAPU32[Qe / 4] = 0, E._modal(me, f.length, L, J.length, A, m.length, I, u, F.length, Y.keysPtr, Y.valuesPtr, Y.size, q.keysPtr, q.valuesPtr, q.size, te.keysPtr, te.valuesPtr, te.size, T.keysPtr, T.valuesPtr, T.size, ae.keysPtr, ae.valuesPtr, ae.size, N.keysPtr, N.valuesPtr, N.size, he.keysPtr, he.valuesPtr, he.size, le.keysPtr, le.valuesPtr, le.size, ce.keysPtr, ce.valuesPtr, ce.size, de.keysPtr, de.valuesPtr, de.size, K.keysPtr, K.valuesPtr, K.size, W, Q, ye.length, ge, w, Fe.length, Ae, Se, Pe.length, j.keysPtr, j.valuesPtr, j.size, oe.keysPtr, oe.valuesPtr, oe.size, U.keysPtr, U.valuesPtr, U.size, ze, We, V.length, Ze.keysPtr, Ze.valuesPtr, Ze.size, z, Ve.keysPtr, Ve.valuesPtr, Ve.size, tr, Oe ? Oe.length : 0, d.etabsWallJoint === false ? 0 : 1, y, p, Z, or, be, Me, sr, hr, nr, ar, Je, De, He, Qe);
    const Ke = E.HEAPU32[or / 4], je = E.HEAPU32[be / 4], ir = E.HEAPU32[Me / 4], lr = E.HEAPU32[sr / 4], er = E.HEAPU32[hr / 4], Ge = E.HEAPU32[nr / 4], xe = E.HEAPU32[ar / 4], cr = E.HEAPU32[Je / 4];
    let pr = [], vr = [], dr = [];
    if (je > 0 && Ke) {
      const se = new Float64Array(E.HEAPF64.buffer, Ke, je);
      pr = Array.from(se), v.push(Ke);
    }
    if (lr > 0 && er > 0 && ir) {
      const se = new Float64Array(E.HEAPF64.buffer, ir, lr * er);
      for (let fe = 0; fe < lr; fe++) vr.push(Array.from(se.slice(fe * er, (fe + 1) * er)));
      v.push(ir);
    }
    if (xe > 0 && cr > 0 && Ge) {
      const se = new Float64Array(E.HEAPF64.buffer, Ge, xe * cr);
      for (let fe = 0; fe < xe; fe++) dr.push(Array.from(se.slice(fe * cr, (fe + 1) * cr)));
      v.push(Ge);
    }
    let Ye = [], yr = [], Ce = [];
    const ur = E.HEAPU32[De / 4];
    if (ur && xe > 0) {
      const se = new Float64Array(E.HEAPF64.buffer, ur, xe * 6);
      for (let fe = 0; fe < xe; fe++) Ye.push(Array.from(se.slice(fe * 6, (fe + 1) * 6)));
      v.push(ur);
    }
    const fr = E.HEAPU32[He / 4];
    fr && (yr = Array.from(new Float64Array(E.HEAPF64.buffer, fr, 6)), v.push(fr));
    const C = E.HEAPU32[Qe / 4];
    return C && je > 0 && (Ce = Array.from(new Float64Array(E.HEAPF64.buffer, C, je)), v.push(C)), v.forEach((se) => E._free(se)), {
      frequencies: pr,
      modeShapes: vr,
      massParticipation: dr,
      participationFactors: Ye,
      totalMass: yr,
      modeScales: Ce
    };
  };
  function ke(f, m, a) {
    const d = new m(f), y = E._malloc(d.length * d.BYTES_PER_ELEMENT);
    return (m === Float64Array ? E.HEAPF64 : m === Uint32Array ? E.HEAPU32 : m === Uint8Array ? E.HEAPU8 : a).set(d, y / d.BYTES_PER_ELEMENT), y;
  }
  const $ = await Fr();
  Et = function(f, m, a, d, y = 10) {
    if (f.length === 0) return {
      frequencies: [],
      modeShapes: [],
      massParticipation: []
    };
    const p = [], Z = Er(f.flat(), Float64Array, $.HEAPF64);
    p.push(Z);
    const z = m.flat(), ne = Er(z, Uint32Array, $.HEAPU32);
    p.push(ne);
    const B = m.map((j) => j.length), v = Er(B, Uint32Array, $.HEAPU32);
    p.push(v);
    const me = a.supports ? Array.from(a.supports.keys()) : [], J = a.supports ? Array.from(a.supports.values()).flat().map((j) => j ? 1 : 0) : [], L = Er(me, Uint32Array, $.HEAPU32);
    p.push(L);
    const g = Er(J, Uint8Array, $.HEAPU8);
    p.push(g);
    const A = (j) => {
      const oe = j ? Array.from(j.keys()) : [], U = j ? Array.from(j.values()) : [], V = Er(oe, Uint32Array, $.HEAPU32);
      p.push(V);
      const ee = Er(U, Float64Array, $.HEAPF64);
      return p.push(ee), {
        keysPtr: V,
        valuesPtr: ee,
        size: oe.length
      };
    }, F = A(d.elasticities), P = A(d.areas), I = A(d.momentsOfInertiaZ), u = A(d.momentsOfInertiaY), b = A(d.shearModuli), Y = A(d.torsionalConstants), q = A(d.densities), te = A(d.thicknesses), T = A(d.poissonsRatios), ae = A(d.membraneModifiers), N = A(d.bendingModifiers), he = A(d.polarMomentsOfInertia), le = $._malloc(4);
    p.push(le);
    const ce = $._malloc(4);
    p.push(ce);
    const de = $._malloc(4);
    p.push(de);
    const K = $._malloc(4);
    p.push(K);
    const ie = $._malloc(4);
    p.push(ie);
    const ye = $._malloc(4);
    p.push(ye);
    const _ = $._malloc(4);
    p.push(_);
    const W = $._malloc(4);
    p.push(W), $._modal_paz(Z, f.length, ne, z.length, v, m.length, L, g, me.length, F.keysPtr, F.valuesPtr, F.size, P.keysPtr, P.valuesPtr, P.size, I.keysPtr, I.valuesPtr, I.size, u.keysPtr, u.valuesPtr, u.size, b.keysPtr, b.valuesPtr, b.size, Y.keysPtr, Y.valuesPtr, Y.size, q.keysPtr, q.valuesPtr, q.size, te.keysPtr, te.valuesPtr, te.size, T.keysPtr, T.valuesPtr, T.size, ae.keysPtr, ae.valuesPtr, ae.size, N.keysPtr, N.valuesPtr, N.size, he.keysPtr, he.valuesPtr, he.size, y, le, ce, de, K, ie, ye, _, W);
    const Q = $.HEAPU32[le / 4], _e = $.HEAPU32[ce / 4], Fe = $.HEAPU32[de / 4], Ee = $.HEAPU32[K / 4], ge = $.HEAPU32[ie / 4], w = $.HEAPU32[ye / 4], H = $.HEAPU32[_ / 4], Pe = $.HEAPU32[W / 4];
    let ue = [], Ae = [], Se = [];
    if (_e > 0 && Q) {
      const j = new Float64Array($.HEAPF64.buffer, Q, _e);
      ue = Array.from(j), p.push(Q);
    }
    if (Ee > 0 && ge > 0 && Fe) {
      const j = new Float64Array($.HEAPF64.buffer, Fe, Ee * ge);
      for (let oe = 0; oe < Ee; oe++) Ae.push(Array.from(j.slice(oe * ge, (oe + 1) * ge)));
      p.push(Fe);
    }
    if (H > 0 && Pe > 0 && w) {
      const j = new Float64Array($.HEAPF64.buffer, w, H * Pe);
      for (let oe = 0; oe < H; oe++) Se.push(Array.from(j.slice(oe * Pe, (oe + 1) * Pe)));
      p.push(w);
    }
    return p.forEach((j) => $._free(j)), {
      frequencies: ue,
      modeShapes: Ae,
      massParticipation: Se
    };
  };
  function Er(f, m, a) {
    const d = new m(f), y = $._malloc(d.length * d.BYTES_PER_ELEMENT);
    return (m === Float64Array ? $.HEAPF64 : m === Uint32Array ? $.HEAPU32 : m === Uint8Array ? $.HEAPU8 : a).set(d, y / d.BYTES_PER_ELEMENT), y;
  }
  const Ie = await Fr();
  gt = function(f) {
    const { nodes: m, elements: a, E: d, nu: y, gamma: p, c: Z, phi: z, thickness: ne = 1, supports: B, surcharge: v = 0, surfaceYThreshold: me = -1e10 } = f, J = [], L = m.flat(), g = pt(L);
    J.push(g);
    const A = a.flat(), F = $r(A);
    J.push(F);
    const P = [];
    for (const N of B) P.push(N.node, N.fixX ? 1 : 0, N.fixY ? 1 : 0);
    const I = $r(P);
    J.push(I);
    const u = a.length, b = m.length, Y = Ie._slopeAllocDouble(u);
    J.push(Y);
    const q = Ie._slopeAllocDouble(b * 2);
    J.push(q);
    const te = Ie._slopeStabilitySolver(g, b, F, u, d, y, p, Z, z, ne, I, B.length, v, me, Y, q), T = [];
    for (let N = 0; N < u; N++) T.push(Ie.HEAPF64[Y / 8 + N]);
    const ae = [];
    for (let N = 0; N < b; N++) ae.push([
      Ie.HEAPF64[q / 8 + 2 * N],
      Ie.HEAPF64[q / 8 + 2 * N + 1]
    ]);
    return J.forEach((N) => Ie._free(N)), {
      fos: te,
      plasticStrain: T,
      displacements: ae
    };
  };
  function pt(f) {
    const m = new Float64Array(f), a = Ie._malloc(m.length * m.BYTES_PER_ELEMENT);
    return Ie.HEAPF64.set(m, a / 8), a;
  }
  function $r(f) {
    const m = new Uint32Array(f), a = Ie._malloc(m.length * m.BYTES_PER_ELEMENT);
    return Ie.HEAPU32.set(m, a / 4), a;
  }
  const ve = await Fr();
  function wr(f, m, a) {
    const d = new m(f), y = ve._malloc(d.length * d.BYTES_PER_ELEMENT);
    return (m === Float64Array ? ve.HEAPF64 : m === Uint32Array ? ve.HEAPU32 : m === Uint8Array ? ve.HEAPU8 : a).set(d, y / d.BYTES_PER_ELEMENT), y;
  }
  Pt = function(f) {
    const m = [];
    let a = [], d = 0;
    f.nodes && f.nodes.length > 0 && (d = f.nodes.length, a = f.nodes.flat());
    const y = wr(a.length > 0 ? a : [
      0
    ], Float64Array, ve.HEAPF64);
    m.push(y);
    let p = [], Z = 0;
    f.elements && f.elements.length > 0 && (Z = f.elements.length, p = f.elements.flat());
    const z = wr(p.length > 0 ? p : [
      0
    ], Int32Array, ve.HEAPU32);
    m.push(z);
    const ne = (U) => U === 1 ? 2 : U === 2 ? 1 : U;
    let B = [], v = 0;
    f.bcs && f.bcs.length > 0 && (v = f.bcs.length, B = f.bcs.flatMap((U) => [
      U.node,
      ne(U.dof),
      U.dof === 2 ? -U.value : U.value
    ]));
    const me = wr(B.length > 0 ? B : [
      0
    ], Float64Array, ve.HEAPF64);
    m.push(me);
    let J = [], L = 0;
    f.pointLoads && f.pointLoads.length > 0 && (L = f.pointLoads.length, J = f.pointLoads.flatMap((U) => [
      U.node,
      ne(U.dof),
      U.dof === 2 ? -U.value : U.value
    ]));
    const g = wr(J.length > 0 ? J : [
      0
    ], Float64Array, ve.HEAPF64);
    m.push(g);
    const A = f.meshLx ?? 0, F = f.meshLy ?? 0, P = f.meshNx ?? 0, I = f.meshNy ?? 0, b = {
      none: 0,
      "simply-supported": 1,
      clamped: 2
    }[f.bcType ?? "none"] ?? 0, Y = f.theoryType ?? 0;
    let q = [], te = 0;
    f.springs && f.springs.length > 0 && (te = f.springs.length, q = f.springs.flatMap((U) => [
      U.node,
      ne(U.dof),
      U.k
    ]));
    const T = wr(q.length > 0 ? q : [
      0
    ], Float64Array, ve.HEAPF64);
    m.push(T);
    let ae = [], N = 0;
    f.thicknesses && f.thicknesses.length > 0 && (N = f.thicknesses.length, ae = f.thicknesses.slice());
    const he = wr(ae.length > 0 ? ae : [
      0
    ], Float64Array, ve.HEAPF64);
    m.push(he);
    const le = ve._malloc(4);
    m.push(le);
    const ce = ve._malloc(4);
    m.push(ce);
    const de = ve._malloc(4);
    m.push(de);
    const K = ve._malloc(4);
    m.push(K), ve._plate_q4_solve(y, d, z, Z, f.E, f.nu, f.thickness, me, v, f.pressure ?? 0, g, L, A, F, P, I, b, Y, T, te, he, N, le, ce, de, K);
    const ie = ve.HEAPU32[le / 4], ye = ve.HEAPU32[ce / 4], _ = ve.HEAPU32[de / 4], W = ve.HEAPU32[K / 4], Q = new Float64Array(ve.HEAPF64.buffer, ie, ye), _e = Q[0], Fe = Q[1], Ee = [];
    let ge = 0;
    for (let U = 0; U < _e; U++) {
      const V = 2 + U * 5, ee = {
        x: Q[V],
        y: Q[V + 1],
        w: Q[V + 2],
        bx: Q[V + 3],
        by: Q[V + 4],
        rx: Q[V + 4],
        ry: -Q[V + 3]
      };
      Ee.push(ee), Math.abs(ee.w) > Math.abs(ge) && (ge = ee.w);
    }
    const w = new Float64Array(ve.HEAPF64.buffer, _, W), H = [];
    let Pe = 0, ue = 0, Ae = 0, Se = 0, j = 0;
    for (let U = 0; U < Fe; U++) {
      const V = U * 9, ee = {
        nodes: [
          w[V],
          w[V + 1],
          w[V + 2],
          w[V + 3]
        ],
        Mxx: w[V + 4],
        Myy: w[V + 5],
        Mxy: w[V + 6],
        Qx: w[V + 7],
        Qy: w[V + 8]
      };
      H.push(ee), Math.abs(ee.Mxx) > Math.abs(Pe) && (Pe = ee.Mxx), Math.abs(ee.Myy) > Math.abs(ue) && (ue = ee.Myy), Math.abs(ee.Mxy) > Math.abs(Ae) && (Ae = ee.Mxy), Math.abs(ee.Qx) > Math.abs(Se) && (Se = ee.Qx), Math.abs(ee.Qy) > Math.abs(j) && (j = ee.Qy);
    }
    let oe;
    if (A > 0 && F > 0) {
      const U = A / 2, V = F / 2;
      let ee = 1 / 0;
      for (const ze of Ee) {
        const We = Math.hypot(ze.x - U, ze.y - V);
        We < ee && (ee = We, oe = ze.w);
      }
    }
    return ie && m.push(ie), _ && m.push(_), m.forEach((U) => ve._free(U)), {
      nodeResults: Ee,
      elementResults: H,
      maxW: ge,
      maxMxx: Pe,
      maxMyy: ue,
      maxMxy: Ae,
      maxQx: Se,
      maxQy: j,
      centerW: oe
    };
  };
  const X = await Fr();
  At = function(f, m, a, d) {
    if (f.length === 0) return {
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
    const y = [], p = rr(f.flat(), Float64Array, X.HEAPF64);
    y.push(p);
    const Z = m.flat(), z = rr(Z, Uint32Array, X.HEAPU32);
    y.push(z);
    const ne = m.map((ue) => ue.length), B = rr(ne, Uint32Array, X.HEAPU32);
    y.push(B);
    const v = a.supports ? Array.from(a.supports.keys()) : [], me = a.supports ? Array.from(a.supports.values()).flat().map((ue) => ue ? 1 : 0) : [], J = rr(v, Uint32Array, X.HEAPU32);
    y.push(J);
    const L = rr(me, Uint8Array, X.HEAPU8);
    y.push(L);
    const g = a.loads ? Array.from(a.loads.keys()) : [], A = a.loads ? Array.from(a.loads.values()).flat() : [], F = rr(g, Uint32Array, X.HEAPU32);
    y.push(F);
    const P = rr(A, Float64Array, X.HEAPF64);
    y.push(P);
    const I = (ue) => {
      const Ae = ue ? Array.from(ue.keys()) : [], Se = ue ? Array.from(ue.values()) : [], j = rr(Ae, Uint32Array, X.HEAPU32);
      y.push(j);
      const oe = rr(Se, Float64Array, X.HEAPF64);
      return y.push(oe), {
        keysPtr: j,
        valuesPtr: oe,
        size: Ae.length
      };
    }, u = I(d.elasticities), b = I(d.areas), Y = I(d.momentsOfInertiaZ), q = I(d.momentsOfInertiaY), te = I(d.shearModuli), T = I(d.torsionalConstants), ae = I(d.thicknesses), N = I(d.poissonsRatios), he = I(d.shearAreasY), le = I(d.shearAreasZ), ce = X._malloc(4);
    y.push(ce);
    const de = X._malloc(4);
    y.push(de);
    const K = X._malloc(4);
    y.push(K);
    const ie = X._malloc(4);
    y.push(ie);
    const ye = X._malloc(4);
    y.push(ye);
    const _ = X._malloc(4);
    y.push(_), X._didactic_solve(p, f.length, z, Z.length, B, m.length, J, L, v.length, F, P, g.length, u.keysPtr, u.valuesPtr, u.size, b.keysPtr, b.valuesPtr, b.size, Y.keysPtr, Y.valuesPtr, Y.size, q.keysPtr, q.valuesPtr, q.size, te.keysPtr, te.valuesPtr, te.size, T.keysPtr, T.valuesPtr, T.size, ae.keysPtr, ae.valuesPtr, ae.size, N.keysPtr, N.valuesPtr, N.size, he.keysPtr, he.valuesPtr, he.size, le.keysPtr, le.valuesPtr, le.size, ce, de, K, ie, ye, _);
    const W = X.HEAPU32[ce / 4], Q = X.HEAPU32[de / 4], _e = X.HEAPU32[K / 4], Fe = X.HEAPU32[ie / 4], Ee = X.HEAPU32[ye / 4], ge = X.HEAPU32[_ / 4], w = W && Q > 0 ? Array.from(new Float64Array(X.HEAPF64.buffer, W, Q)) : [], H = _e && Fe > 0 ? Array.from(new Float64Array(X.HEAPF64.buffer, _e, Fe)) : [], Pe = Ee && ge > 0 ? Array.from(new Float64Array(X.HEAPF64.buffer, Ee, ge)) : [];
    return W && y.push(W), _e && y.push(_e), Ee && y.push(Ee), y.forEach((ue) => X._free(ue)), vt(w, H, Pe, f.length, m.length);
  };
  function vt(f, m, a, d, y) {
    const p = d * 6, Z = [];
    if (f.length > 0) {
      const g = f[0], A = [];
      for (let F = 0; F < g; F++) A.push(f[1 + F]);
      for (let F = 0; F < g; F++) {
        let P = A[F];
        const I = f[P++], u = f[P++], b = f[P++], Y = b * b, q = Ur(f.slice(P, P + Y), b);
        P += Y;
        const te = Ur(f.slice(P, P + Y), b);
        P += Y;
        const T = Ur(f.slice(P, P + Y), b);
        P += Y;
        const ae = Ur(f.slice(P, P + 9), 3);
        P += 9;
        const N = f[P++], he = f[P++], le = f[P++], ce = f[P++], de = f[P++], K = f[P++], ie = f[P++], ye = f[P++], _ = f[P++], W = f[P++], Q = f[P++];
        Z.push({
          index: I,
          type: u === 0 ? "frame" : "shell-Q4",
          nDOF: b,
          K_local: q,
          T: te,
          K_global: T,
          lambda: ae,
          L: N,
          E: he,
          A: le,
          Iz: ce,
          Iy: de,
          G: K,
          J: ie,
          t: ye,
          nu: _,
          phiZ: W,
          phiY: Q
        });
      }
    }
    const z = [];
    let ne = 0;
    if (m.length > 0) {
      ne = m[0];
      for (let g = 0; g < ne; g++) {
        const A = 1 + g * 3;
        z.push({
          row: m[A],
          col: m[A + 1],
          value: m[A + 2]
        });
      }
    }
    let B = [], v = [], me = [], J = [], L = [];
    if (a.length > 0) {
      let g = 0;
      const A = a[g++];
      B = a.slice(g, g + A), g += A, v = a.slice(g, g + A), g += A, me = a.slice(g, g + A), g += A;
      const F = a[g++];
      J = a.slice(g, g + F).map(Math.round), g += F;
      const P = a[g++];
      L = a.slice(g, g + P).map(Math.round);
    }
    return {
      nNodes: d,
      nElements: y,
      nDOF: p,
      elements: Z,
      K_assembled_sparse: z,
      K_assembled_nnz: ne,
      F_applied: B,
      U_full: v,
      R_full: me,
      freeDOFs: J,
      fixedDOFs: L
    };
  }
  function Ur(f, m) {
    const a = [];
    for (let d = 0; d < m; d++) a.push(f.slice(d * m, (d + 1) * m));
    return a;
  }
  function rr(f, m, a) {
    const d = new m(f), y = X._malloc(d.length * d.BYTES_PER_ELEMENT);
    return (m === Float64Array ? X.HEAPF64 : m === Uint32Array ? X.HEAPU32 : m === Uint8Array ? X.HEAPU8 : a).set(d, y / d.BYTES_PER_ELEMENT), y;
  }
})();
export {
  Fr as M,
  ht as _,
  __tla,
  At as a,
  Et as b,
  yt as d,
  _t as m,
  Pt as p,
  gt as s
};
