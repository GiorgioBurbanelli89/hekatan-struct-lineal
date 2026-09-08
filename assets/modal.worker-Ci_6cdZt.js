(async ()=>{
    var Wn = Object.freeze({
        __proto__: null
    });
    async function Le(L = {}) {
        var B;
        (function() {
            function e(l) {
                l = l.split("-")[0];
                for(var f = l.split(".").slice(0, 3); f.length < 3;)f.push("00");
                return f = f.map((m, v, _)=>m.padStart(2, "0")), f.join("");
            }
            var r = (l)=>[
                    l / 1e4 | 0,
                    (l / 100 | 0) % 100,
                    l % 100
                ].join("."), t = 2147483647, n = typeof process < "u" && process.versions?.node ? e(process.versions.node) : t;
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
        var d = L, k = !!globalThis.window, K = !!globalThis.WorkerGlobalScope, q = globalThis.process?.versions?.node && globalThis.process?.type != "renderer", X = !k && !q && !K;
        if (q) {
            const { createRequire: e } = await Promise.resolve().then(function() {
                return Wn;
            });
            var Q = e(import.meta.url);
        }
        var te = "./this.program", Pe = import.meta.url, A = "";
        function ne(e) {
            return d.locateFile ? d.locateFile(e, A) : A + e;
        }
        var fe, ie;
        if (q) {
            if (!(globalThis.process?.versions?.node && globalThis.process?.type != "renderer")) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
            var Be = Q("fs");
            Pe.startsWith("file:") && (A = Q("path").dirname(Q("url").fileURLToPath(Pe)) + "/"), ie = (r)=>{
                r = x(r) ? new URL(r) : r;
                var t = Be.readFileSync(r);
                return u(Buffer.isBuffer(t)), t;
            }, fe = async (r, t = !0)=>{
                r = x(r) ? new URL(r) : r;
                var n = Be.readFileSync(r, t ? void 0 : "utf8");
                return u(t ? Buffer.isBuffer(n) : typeof n == "string"), n;
            }, process.argv.length > 1 && (te = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2);
        } else if (!X) if (k || K) {
            try {
                A = new URL(".", Pe).href;
            } catch  {}
            if (!(globalThis.window || globalThis.WorkerGlobalScope)) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
            K && (ie = (e)=>{
                var r = new XMLHttpRequest;
                return r.open("GET", e, !1), r.responseType = "arraybuffer", r.send(null), new Uint8Array(r.response);
            }), fe = async (e)=>{
                if (x(e)) return new Promise((t, n)=>{
                    var o = new XMLHttpRequest;
                    o.open("GET", e, !0), o.responseType = "arraybuffer", o.onload = ()=>{
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
        var ue = console.log.bind(console), I = console.error.bind(console);
        u(!X, "shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.");
        var _e;
        globalThis.WebAssembly || I("no native wasm support detected");
        var me = !1;
        function u(e, r) {
            e || R("Assertion failed" + (r ? ": " + r : ""));
        }
        var x = (e)=>e.startsWith("file://");
        function ze() {
            var e = Fr();
            u((e & 3) == 0), e == 0 && (e += 4), F[e >> 2] = 34821223, F[e + 4 >> 2] = 2310721022, F[0] = 1668509029;
        }
        function ve() {
            if (!me) {
                var e = Fr();
                e == 0 && (e += 4);
                var r = F[e >> 2], t = F[e + 4 >> 2];
                (r != 34821223 || t != 2310721022) && R(`Stack overflow! Stack cookie has been overwritten at ${se(e)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${se(t)} ${se(r)}`), F[0] != 1668509029 && R("Runtime error: The application has corrupted its heap memory area (address zero)!");
            }
        }
        class h extends Error {
        }
        class he extends h {
            constructor(r){
                super(r), this.excPtr = r;
                const t = xr(r);
                this.name = t[0], this.message = t[1];
            }
        }
        (()=>{
            var e = new Int16Array(1), r = new Int8Array(e.buffer);
            e[0] = 25459, (r[0] !== 115 || r[1] !== 99) && R("Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)");
        })();
        function oe(e) {
            Object.getOwnPropertyDescriptor(d, e) || Object.defineProperty(d, e, {
                configurable: !0,
                set () {
                    R(`Attempt to set \`Module.${e}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`);
                }
            });
        }
        function T(e) {
            return ()=>u(!1, `call to '${e}' via reference taken before Wasm module initialization`);
        }
        function He(e) {
            Object.getOwnPropertyDescriptor(d, e) && R(`\`Module.${e}\` was supplied but \`${e}\` not included in INCOMING_MODULE_JS_API`);
        }
        function We(e) {
            return e === "FS_createPath" || e === "FS_createDataFile" || e === "FS_createPreloadedFile" || e === "FS_preloadFile" || e === "FS_unlink" || e === "addRunDependency" || e === "FS_createLazyFile" || e === "FS_createDevice" || e === "removeRunDependency";
        }
        function je(e) {
            Ae(e);
        }
        function Ae(e) {
            Object.getOwnPropertyDescriptor(d, e) || Object.defineProperty(d, e, {
                configurable: !0,
                get () {
                    var r = `'${e}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
                    We(e) && (r += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"), R(r);
                }
            });
        }
        var Te, pe, $, ye, ge, F, z, ae = !1;
        function nr() {
            var e = hr.buffer;
            $ = new Int8Array(e), d.HEAPU8 = ye = new Uint8Array(e), ge = new Int32Array(e), d.HEAPU32 = F = new Uint32Array(e), d.HEAPF64 = new Float64Array(e), z = new BigInt64Array(e), new BigUint64Array(e);
        }
        u(globalThis.Int32Array && globalThis.Float64Array && Int32Array.prototype.subarray && Int32Array.prototype.set, "JS engine does not provide full typed array support");
        function ir() {
            if (d.preRun) for(typeof d.preRun == "function" && (d.preRun = [
                d.preRun
            ]); d.preRun.length;)lr(d.preRun.shift());
            oe("preRun"), qe(Ee);
        }
        function or() {
            u(!ae), ae = !0, ve(), !d.noFSInit && !i.initialized && i.init(), Ue.__wasm_call_ctors(), i.ignorePermissions = !1;
        }
        function Re() {
            if (ve(), d.postRun) for(typeof d.postRun == "function" && (d.postRun = [
                d.postRun
            ]); d.postRun.length;)Ke(d.postRun.shift());
            oe("postRun"), qe(Ne);
        }
        function R(e) {
            d.onAbort?.(e), e = "Aborted(" + e + ")", I(e), me = !0;
            var r = new WebAssembly.RuntimeError(e);
            throw pe?.(r), r;
        }
        function O(e, r) {
            return (...t)=>{
                u(ae, `native function \`${e}\` called before runtime initialization`);
                var n = Ue[e];
                return u(n, `exported native function \`${e}\` not found`), u(t.length <= r, `native function \`${e}\` called with ${t.length} args but expects ${r}`), n(...t);
            };
        }
        var Me;
        function ar() {
            return d.locateFile ? ne("deform.wasm") : new URL("/hekatan-struct-lineal/assets/deform-CEFQQr_7.wasm", import.meta.url).href;
        }
        function $e(e) {
            if (e == Me && _e) return new Uint8Array(_e);
            if (ie) return ie(e);
            throw "both async and sync fetching of the wasm failed";
        }
        async function Ge(e) {
            if (!_e) try {
                var r = await fe(e);
                return new Uint8Array(r);
            } catch  {}
            return $e(e);
        }
        async function Ve(e, r) {
            try {
                var t = await Ge(e), n = await WebAssembly.instantiate(t, r);
                return n;
            } catch (o) {
                I(`failed to asynchronously prepare wasm: ${o}`), x(e) && I(`warning: Loading from a file URI (${e}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`), R(o);
            }
        }
        async function sr(e, r, t) {
            if (!e && !x(r) && !q) try {
                var n = fetch(r, {
                    credentials: "same-origin"
                }), o = await WebAssembly.instantiateStreaming(n, t);
                return o;
            } catch (a) {
                I(`wasm streaming compile failed: ${a}`), I("falling back to ArrayBuffer instantiation");
            }
            return Ve(r, t);
        }
        function pr() {
            var e = {
                env: Vr,
                wasi_snapshot_preview1: Vr
            };
            return e;
        }
        async function cr() {
            function e(s, c) {
                return Ue = s.exports, Ct(Ue), nr(), Ue;
            }
            var r = d;
            function t(s) {
                return u(d === r, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?"), r = null, e(s.instance);
            }
            var n = pr();
            if (d.instantiateWasm) return new Promise((s, c)=>{
                try {
                    d.instantiateWasm(n, (l, f)=>{
                        s(e(l, f));
                    });
                } catch (l) {
                    I(`Module.instantiateWasm callback failed with error: ${l}`), c(l);
                }
            });
            Me ??= ar();
            var o = await sr(_e, Me, n), a = t(o);
            return a;
        }
        var qe = (e)=>{
            for(; e.length > 0;)e.shift()(d);
        }, Ne = [], Ke = (e)=>Ne.push(e), Ee = [], lr = (e)=>Ee.push(e), se = (e)=>(u(typeof e == "number", `ptrToString expects a number, got ${typeof e}`), e >>>= 0, "0x" + e.toString(16).padStart(8, "0")), p = (e)=>zr(e), y = ()=>Wr(), ee = (e)=>{
            ee.shown ||= {}, ee.shown[e] || (ee.shown[e] = 1, q && (e = "warning: " + e), I(e));
        }, Oe = globalThis.TextDecoder && new TextDecoder, Ye = (e, r, t, n)=>{
            for(var o = r + t; e[r] && !(r >= o);)++r;
            return r;
        }, J = (e, r = 0, t, n)=>{
            var o = Ye(e, r, t);
            if (o - r > 16 && e.buffer && Oe) return Oe.decode(e.subarray(r, o));
            for(var a = ""; r < o;){
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
                if ((s & 240) == 224 ? s = (s & 15) << 12 | c << 6 | l : ((s & 248) != 240 && ee("Invalid UTF-8 leading byte " + se(s) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!"), s = (s & 7) << 18 | c << 12 | l << 6 | e[r++] & 63), s < 65536) a += String.fromCharCode(s);
                else {
                    var f = s - 65536;
                    a += String.fromCharCode(55296 | f >> 10, 56320 | f & 1023);
                }
            }
            return a;
        }, Y = (e, r, t)=>(u(typeof e == "number", `UTF8ToString expects a number (got ${typeof e})`), e ? J(ye, e, r) : ""), Xe = (e, r, t, n)=>R(`Assertion failed: ${Y(e)}, at: ` + [
                r ? Y(r) : "unknown filename",
                t,
                n ? Y(n) : "unknown function"
            ]), re = [], we = 0, Je = (e)=>{
            var r = new Se(e);
            return r.get_caught() || (r.set_caught(!0), we--), r.set_rethrown(!1), re.push(r), Gr(e);
        }, V = 0, De = ()=>{
            E(0, 0), u(re.length > 0);
            var e = re.pop();
            br(e.excPtr), V = 0;
        };
        class Se {
            constructor(r){
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
                r = r ? 1 : 0, $[this.ptr + 12] = r;
            }
            get_caught() {
                return $[this.ptr + 12] != 0;
            }
            set_rethrown(r) {
                r = r ? 1 : 0, $[this.ptr + 13] = r;
            }
            get_rethrown() {
                return $[this.ptr + 13] != 0;
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
        var ce = (e)=>Lr(e), ke = (e)=>{
            var r = V?.excPtr;
            if (!r) return ce(0), 0;
            var t = new Se(r);
            t.set_adjusted_ptr(r);
            var n = t.get_type();
            if (!n) return ce(0), r;
            for (var o of e){
                if (o === 0 || o === n) break;
                var a = t.ptr + 16;
                if ($r(o, n, a)) return ce(o), r;
            }
            return ce(n), r;
        }, dr = ()=>ke([]), fr = (e)=>ke([
                e
            ]), ur = ()=>{
            var e = re.pop();
            e || R("no exception to throw");
            var r = e.excPtr;
            throw e.get_rethrown() || (re.push(e), e.set_rethrown(!0), e.set_caught(!1), we++), vr(r), V = new he(r), V;
        }, U = (e, r, t)=>{
            var n = new Se(e);
            throw n.init(r, t), vr(e), V = new he(e), we++, V;
        }, G = ()=>we, yr = (e)=>{
            throw V || (V = new he(e)), V;
        }, _r = ()=>R("native code called abort()"), Ze = (e, r, t, n)=>{
            if (u(typeof e == "string", `stringToUTF8Array expects a string (got ${typeof e})`), !(n > 0)) return 0;
            for(var o = t, a = t + n - 1, s = 0; s < e.length; ++s){
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
                    c > 1114111 && ee("Invalid Unicode code point " + se(c) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF)."), r[t++] = 240 | c >> 18, r[t++] = 128 | c >> 12 & 63, r[t++] = 128 | c >> 6 & 63, r[t++] = 128 | c & 63, s++;
                }
            }
            return r[t] = 0, t - o;
        }, Qe = (e, r, t)=>(u(typeof t == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!"), Ze(e, ye, r, t)), mr = (e)=>{
            for(var r = 0, t = 0; t < e.length; ++t){
                var n = e.charCodeAt(t);
                n <= 127 ? r++ : n <= 2047 ? r += 2 : n >= 55296 && n <= 57343 ? (r += 4, ++t) : r += 3;
            }
            return r;
        }, Yr = (e, r, t, n)=>{
            var o = new Date().getFullYear(), a = new Date(o, 0, 1), s = new Date(o, 6, 1), c = a.getTimezoneOffset(), l = s.getTimezoneOffset(), f = Math.max(c, l);
            F[e >> 2] = f * 60, ge[r >> 2] = +(c != l);
            var m = (g)=>{
                var S = g >= 0 ? "-" : "+", N = Math.abs(g), C = String(Math.floor(N / 60)).padStart(2, "0"), D = String(N % 60).padStart(2, "0");
                return `UTC${S}${C}${D}`;
            }, v = m(c), _ = m(l);
            u(v), u(_), u(mr(v) <= 16, `timezone name truncated to fit in TZNAME_MAX (${v})`), u(mr(_) <= 16, `timezone name truncated to fit in TZNAME_MAX (${_})`), l < c ? (Qe(v, t, 17), Qe(_, n, 17)) : (Qe(v, n, 17), Qe(_, t, 17));
        }, Xr = ()=>performance.now(), Jr = ()=>Date.now(), Zr = (e)=>e >= 0 && e <= 3, Qr = 9007199254740992, et = -9007199254740992, rt = (e)=>e < et || e > Qr ? NaN : Number(e);
        function tt(e, r, t) {
            if (!Zr(e)) return 28;
            var n;
            e === 0 ? n = Jr() : n = Xr();
            var o = Math.round(n * 1e3 * 1e3);
            return z[t >> 3] = BigInt(o), 0;
        }
        var nt = ()=>2147483648, it = (e, r)=>(u(r, "alignment argument is required"), Math.ceil(e / r) * r), ot = (e)=>{
            var r = hr.buffer.byteLength, t = (e - r + 65535) / 65536 | 0;
            try {
                return hr.grow(t), nr(), 1;
            } catch (n) {
                I(`growMemory: Attempted to grow heap from ${r} bytes to ${e} bytes, but got error: ${n}`);
            }
        }, at = (e)=>{
            var r = ye.length;
            e >>>= 0, u(e > r);
            var t = nt();
            if (e > t) return I(`Cannot enlarge memory, requested ${e} bytes, but the limit is ${t} bytes!`), !1;
            for(var n = 1; n <= 4; n *= 2){
                var o = r * (1 + .2 / n);
                o = Math.min(o, e + 100663296);
                var a = Math.min(t, it(Math.max(e, o), 65536)), s = ot(a);
                if (s) return !0;
            }
            return I(`Failed to grow the heap from ${r} bytes to ${a} bytes, not enough memory!`), !1;
        }, gr = {}, st = ()=>te || "./this.program", er = ()=>{
            if (!er.strings) {
                var e = (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8", r = {
                    USER: "web_user",
                    LOGNAME: "web_user",
                    PATH: "/",
                    PWD: "/",
                    HOME: "/home/web_user",
                    LANG: e,
                    _: st()
                };
                for(var t in gr)gr[t] === void 0 ? delete r[t] : r[t] = gr[t];
                var n = [];
                for(var t in r)n.push(`${t}=${r[t]}`);
                er.strings = n;
            }
            return er.strings;
        }, ct = (e, r)=>{
            var t = 0, n = 0;
            for (var o of er()){
                var a = r + t;
                F[e + n >> 2] = a, t += Qe(o, a, 1 / 0) + 1, n += 4;
            }
            return 0;
        }, lt = (e, r)=>{
            var t = er();
            F[e >> 2] = t.length;
            var n = 0;
            for (var o of t)n += mr(o) + 1;
            return F[r >> 2] = n, 0;
        }, M = {
            isAbs: (e)=>e.charAt(0) === "/",
            splitPath: (e)=>{
                var r = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                return r.exec(e).slice(1);
            },
            normalizeArray: (e, r)=>{
                for(var t = 0, n = e.length - 1; n >= 0; n--){
                    var o = e[n];
                    o === "." ? e.splice(n, 1) : o === ".." ? (e.splice(n, 1), t++) : t && (e.splice(n, 1), t--);
                }
                if (r) for(; t; t--)e.unshift("..");
                return e;
            },
            normalize: (e)=>{
                var r = M.isAbs(e), t = e.slice(-1) === "/";
                return e = M.normalizeArray(e.split("/").filter((n)=>!!n), !r).join("/"), !e && !r && (e = "."), e && t && (e += "/"), (r ? "/" : "") + e;
            },
            dirname: (e)=>{
                var r = M.splitPath(e), t = r[0], n = r[1];
                return !t && !n ? "." : (n && (n = n.slice(0, -1)), t + n);
            },
            basename: (e)=>e && e.match(/([^\/]+|\/)\/*$/)[1],
            join: (...e)=>M.normalize(e.join("/")),
            join2: (e, r)=>M.normalize(e + "/" + r)
        }, dt = ()=>{
            if (q) {
                var e = Q("crypto");
                return (r)=>e.randomFillSync(r);
            }
            return (r)=>crypto.getRandomValues(r);
        }, Tr = (e)=>{
            (Tr = dt())(e);
        }, Ce = {
            resolve: (...e)=>{
                for(var r = "", t = !1, n = e.length - 1; n >= -1 && !t; n--){
                    var o = n >= 0 ? e[n] : i.cwd();
                    if (typeof o != "string") throw new TypeError("Arguments to path.resolve must be strings");
                    if (!o) return "";
                    r = o + "/" + r, t = M.isAbs(o);
                }
                return r = M.normalizeArray(r.split("/").filter((a)=>!!a), !t).join("/"), (t ? "/" : "") + r || ".";
            },
            relative: (e, r)=>{
                e = Ce.resolve(e).slice(1), r = Ce.resolve(r).slice(1);
                function t(f) {
                    for(var m = 0; m < f.length && f[m] === ""; m++);
                    for(var v = f.length - 1; v >= 0 && f[v] === ""; v--);
                    return m > v ? [] : f.slice(m, v - m + 1);
                }
                for(var n = t(e.split("/")), o = t(r.split("/")), a = Math.min(n.length, o.length), s = a, c = 0; c < a; c++)if (n[c] !== o[c]) {
                    s = c;
                    break;
                }
                for(var l = [], c = s; c < n.length; c++)l.push("..");
                return l = l.concat(o.slice(s)), l.join("/");
            }
        }, Er = [], wr = (e, r, t)=>{
            var n = mr(e) + 1, o = new Array(n), a = Ze(e, o, 0, o.length);
            return o.length = a, o;
        }, ft = ()=>{
            if (!Er.length) {
                var e = null;
                if (q) {
                    var r = 256, t = Buffer.alloc(r), n = 0, o = process.stdin.fd;
                    try {
                        n = Be.readSync(o, t, 0, r);
                    } catch (a) {
                        if (a.toString().includes("EOF")) n = 0;
                        else throw a;
                    }
                    n > 0 && (e = t.slice(0, n).toString("utf-8"));
                } else globalThis.window?.prompt && (e = window.prompt("Input: "), e !== null && (e += `
`));
                if (!e) return null;
                Er = wr(e);
            }
            return Er.shift();
        }, Fe = {
            ttys: [],
            init () {},
            shutdown () {},
            register (e, r) {
                Fe.ttys[e] = {
                    input: [],
                    output: [],
                    ops: r
                }, i.registerDevice(e, Fe.stream_ops);
            },
            stream_ops: {
                open (e) {
                    var r = Fe.ttys[e.node.rdev];
                    if (!r) throw new i.ErrnoError(43);
                    e.tty = r, e.seekable = !1;
                },
                close (e) {
                    e.tty.ops.fsync(e.tty);
                },
                fsync (e) {
                    e.tty.ops.fsync(e.tty);
                },
                read (e, r, t, n, o) {
                    if (!e.tty || !e.tty.ops.get_char) throw new i.ErrnoError(60);
                    for(var a = 0, s = 0; s < n; s++){
                        var c;
                        try {
                            c = e.tty.ops.get_char(e.tty);
                        } catch  {
                            throw new i.ErrnoError(29);
                        }
                        if (c === void 0 && a === 0) throw new i.ErrnoError(6);
                        if (c == null) break;
                        a++, r[t + s] = c;
                    }
                    return a && (e.node.atime = Date.now()), a;
                },
                write (e, r, t, n, o) {
                    if (!e.tty || !e.tty.ops.put_char) throw new i.ErrnoError(60);
                    try {
                        for(var a = 0; a < n; a++)e.tty.ops.put_char(e.tty, r[t + a]);
                    } catch  {
                        throw new i.ErrnoError(29);
                    }
                    return n && (e.node.mtime = e.node.ctime = Date.now()), a;
                }
            },
            default_tty_ops: {
                get_char (e) {
                    return ft();
                },
                put_char (e, r) {
                    r === null || r === 10 ? (ue(J(e.output)), e.output = []) : r != 0 && e.output.push(r);
                },
                fsync (e) {
                    e.output?.length > 0 && (ue(J(e.output)), e.output = []);
                },
                ioctl_tcgets (e) {
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
                ioctl_tcsets (e, r, t) {
                    return 0;
                },
                ioctl_tiocgwinsz (e) {
                    return [
                        24,
                        80
                    ];
                }
            },
            default_tty1_ops: {
                put_char (e, r) {
                    r === null || r === 10 ? (I(J(e.output)), e.output = []) : r != 0 && e.output.push(r);
                },
                fsync (e) {
                    e.output?.length > 0 && (I(J(e.output)), e.output = []);
                }
            }
        }, Rr = (e)=>{
            R("internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported");
        }, P = {
            ops_table: null,
            mount (e) {
                return P.createNode(null, "/", 16895, 0);
            },
            createNode (e, r, t, n) {
                if (i.isBlkdev(t) || i.isFIFO(t)) throw new i.ErrnoError(63);
                P.ops_table ||= {
                    dir: {
                        node: {
                            getattr: P.node_ops.getattr,
                            setattr: P.node_ops.setattr,
                            lookup: P.node_ops.lookup,
                            mknod: P.node_ops.mknod,
                            rename: P.node_ops.rename,
                            unlink: P.node_ops.unlink,
                            rmdir: P.node_ops.rmdir,
                            readdir: P.node_ops.readdir,
                            symlink: P.node_ops.symlink
                        },
                        stream: {
                            llseek: P.stream_ops.llseek
                        }
                    },
                    file: {
                        node: {
                            getattr: P.node_ops.getattr,
                            setattr: P.node_ops.setattr
                        },
                        stream: {
                            llseek: P.stream_ops.llseek,
                            read: P.stream_ops.read,
                            write: P.stream_ops.write,
                            mmap: P.stream_ops.mmap,
                            msync: P.stream_ops.msync
                        }
                    },
                    link: {
                        node: {
                            getattr: P.node_ops.getattr,
                            setattr: P.node_ops.setattr,
                            readlink: P.node_ops.readlink
                        },
                        stream: {}
                    },
                    chrdev: {
                        node: {
                            getattr: P.node_ops.getattr,
                            setattr: P.node_ops.setattr
                        },
                        stream: i.chrdev_stream_ops
                    }
                };
                var o = i.createNode(e, r, t, n);
                return i.isDir(o.mode) ? (o.node_ops = P.ops_table.dir.node, o.stream_ops = P.ops_table.dir.stream, o.contents = {}) : i.isFile(o.mode) ? (o.node_ops = P.ops_table.file.node, o.stream_ops = P.ops_table.file.stream, o.usedBytes = 0, o.contents = null) : i.isLink(o.mode) ? (o.node_ops = P.ops_table.link.node, o.stream_ops = P.ops_table.link.stream) : i.isChrdev(o.mode) && (o.node_ops = P.ops_table.chrdev.node, o.stream_ops = P.ops_table.chrdev.stream), o.atime = o.mtime = o.ctime = Date.now(), e && (e.contents[r] = o, e.atime = e.mtime = e.ctime = o.atime), o;
            },
            getFileDataAsTypedArray (e) {
                return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0);
            },
            expandFileStorage (e, r) {
                var t = e.contents ? e.contents.length : 0;
                if (!(t >= r)) {
                    var n = 1024 * 1024;
                    r = Math.max(r, t * (t < n ? 2 : 1.125) >>> 0), t != 0 && (r = Math.max(r, 256));
                    var o = e.contents;
                    e.contents = new Uint8Array(r), e.usedBytes > 0 && e.contents.set(o.subarray(0, e.usedBytes), 0);
                }
            },
            resizeFileStorage (e, r) {
                if (e.usedBytes != r) if (r == 0) e.contents = null, e.usedBytes = 0;
                else {
                    var t = e.contents;
                    e.contents = new Uint8Array(r), t && e.contents.set(t.subarray(0, Math.min(r, e.usedBytes))), e.usedBytes = r;
                }
            },
            node_ops: {
                getattr (e) {
                    var r = {};
                    return r.dev = i.isChrdev(e.mode) ? e.id : 1, r.ino = e.id, r.mode = e.mode, r.nlink = 1, r.uid = 0, r.gid = 0, r.rdev = e.rdev, i.isDir(e.mode) ? r.size = 4096 : i.isFile(e.mode) ? r.size = e.usedBytes : i.isLink(e.mode) ? r.size = e.link.length : r.size = 0, r.atime = new Date(e.atime), r.mtime = new Date(e.mtime), r.ctime = new Date(e.ctime), r.blksize = 4096, r.blocks = Math.ceil(r.size / r.blksize), r;
                },
                setattr (e, r) {
                    for (const t of [
                        "mode",
                        "atime",
                        "mtime",
                        "ctime"
                    ])r[t] != null && (e[t] = r[t]);
                    r.size !== void 0 && P.resizeFileStorage(e, r.size);
                },
                lookup (e, r) {
                    throw new i.ErrnoError(44);
                },
                mknod (e, r, t, n) {
                    return P.createNode(e, r, t, n);
                },
                rename (e, r, t) {
                    var n;
                    try {
                        n = i.lookupNode(r, t);
                    } catch  {}
                    if (n) {
                        if (i.isDir(e.mode)) for(var o in n.contents)throw new i.ErrnoError(55);
                        i.hashRemoveNode(n);
                    }
                    delete e.parent.contents[e.name], r.contents[t] = e, e.name = t, r.ctime = r.mtime = e.parent.ctime = e.parent.mtime = Date.now();
                },
                unlink (e, r) {
                    delete e.contents[r], e.ctime = e.mtime = Date.now();
                },
                rmdir (e, r) {
                    var t = i.lookupNode(e, r);
                    for(var n in t.contents)throw new i.ErrnoError(55);
                    delete e.contents[r], e.ctime = e.mtime = Date.now();
                },
                readdir (e) {
                    return [
                        ".",
                        "..",
                        ...Object.keys(e.contents)
                    ];
                },
                symlink (e, r, t) {
                    var n = P.createNode(e, r, 41471, 0);
                    return n.link = t, n;
                },
                readlink (e) {
                    if (!i.isLink(e.mode)) throw new i.ErrnoError(28);
                    return e.link;
                }
            },
            stream_ops: {
                read (e, r, t, n, o) {
                    var a = e.node.contents;
                    if (o >= e.node.usedBytes) return 0;
                    var s = Math.min(e.node.usedBytes - o, n);
                    if (u(s >= 0), s > 8 && a.subarray) r.set(a.subarray(o, o + s), t);
                    else for(var c = 0; c < s; c++)r[t + c] = a[o + c];
                    return s;
                },
                write (e, r, t, n, o, a) {
                    if (u(!(r instanceof ArrayBuffer)), r.buffer === $.buffer && (a = !1), !n) return 0;
                    var s = e.node;
                    if (s.mtime = s.ctime = Date.now(), r.subarray && (!s.contents || s.contents.subarray)) {
                        if (a) return u(o === 0, "canOwn must imply no weird position inside the file"), s.contents = r.subarray(t, t + n), s.usedBytes = n, n;
                        if (s.usedBytes === 0 && o === 0) return s.contents = r.slice(t, t + n), s.usedBytes = n, n;
                        if (o + n <= s.usedBytes) return s.contents.set(r.subarray(t, t + n), o), n;
                    }
                    if (P.expandFileStorage(s, o + n), s.contents.subarray && r.subarray) s.contents.set(r.subarray(t, t + n), o);
                    else for(var c = 0; c < n; c++)s.contents[o + c] = r[t + c];
                    return s.usedBytes = Math.max(s.usedBytes, o + n), n;
                },
                llseek (e, r, t) {
                    var n = r;
                    if (t === 1 ? n += e.position : t === 2 && i.isFile(e.node.mode) && (n += e.node.usedBytes), n < 0) throw new i.ErrnoError(28);
                    return n;
                },
                mmap (e, r, t, n, o) {
                    if (!i.isFile(e.node.mode)) throw new i.ErrnoError(43);
                    var a, s, c = e.node.contents;
                    if (!(o & 2) && c && c.buffer === $.buffer) s = !1, a = c.byteOffset;
                    else {
                        if (s = !0, a = Rr(), !a) throw new i.ErrnoError(48);
                        c && ((t > 0 || t + r < c.length) && (c.subarray ? c = c.subarray(t, t + r) : c = Array.prototype.slice.call(c, t, t + r)), $.set(c, a));
                    }
                    return {
                        ptr: a,
                        allocated: s
                    };
                },
                msync (e, r, t, n, o) {
                    return P.stream_ops.write(e, r, 0, n, t, !1), 0;
                }
            }
        }, ut = (e)=>{
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
        }, Sr = (e, r)=>{
            var t = 0;
            return e && (t |= 365), r && (t |= 146), t;
        }, _t = (e)=>Y(Ir(e)), Mr = {
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
        }, mt = async (e)=>{
            var r = await fe(e);
            return u(r, `Loading data file "${e}" failed (no arrayBuffer).`), new Uint8Array(r);
        }, vt = (...e)=>i.createDataFile(...e), ht = (e)=>{
            for(var r = e;;){
                if (!xe[e]) return e;
                e = r + Math.random();
            }
        }, be = 0, rr = null, xe = {}, le = null, pt = (e)=>{
            if (be--, d.monitorRunDependencies?.(be), u(e, "removeRunDependency requires an ID"), u(xe[e]), delete xe[e], be == 0 && (le !== null && (clearInterval(le), le = null), rr)) {
                var r = rr;
                rr = null, r();
            }
        }, yt = (e)=>{
            be++, d.monitorRunDependencies?.(be), u(e, "addRunDependency requires an ID"), u(!xe[e]), xe[e] = 1, le === null && globalThis.setInterval && (le = setInterval(()=>{
                if (me) {
                    clearInterval(le), le = null;
                    return;
                }
                var r = !1;
                for(var t in xe)r || (r = !0, I("still waiting on run dependencies:")), I(`dependency: ${t}`);
                r && I("(end of list)");
            }, 1e4), le.unref?.());
        }, Nr = [], gt = async (e, r)=>{
            typeof Browser < "u" && Browser.init();
            for (var t of Nr)if (t.canHandle(r)) return u(t.handle.constructor.name === "AsyncFunction", "Filesystem plugin handlers must be async functions (See #24914)"), t.handle(e, r);
            return e;
        }, Or = async (e, r, t, n, o, a, s, c)=>{
            var l = r ? Ce.resolve(M.join2(e, r)) : e, f = ht(`cp ${l}`);
            yt(f);
            try {
                var m = t;
                typeof t == "string" && (m = await mt(t)), m = await gt(m, l), c?.(), a || vt(e, r, m, n, o, s);
            } finally{
                pt(f);
            }
        }, Et = (e, r, t, n, o, a, s, c, l, f)=>{
            Or(e, r, t, n, o, c, l, f).then(a).catch(s);
        }, i = {
            root: null,
            mounts: [],
            devices: {},
            streams: [],
            nextInode: 1,
            nameTable: null,
            currentPath: "/",
            initialized: !1,
            ignorePermissions: !0,
            filesystems: null,
            syncFSRequests: 0,
            readFiles: {},
            ErrnoError: class extends Error {
                name = "ErrnoError";
                constructor(e){
                    super(ae ? _t(e) : ""), this.errno = e;
                    for(var r in Mr)if (Mr[r] === e) {
                        this.code = r;
                        break;
                    }
                }
            },
            FSStream: class {
                shared = {};
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
                node_ops = {};
                stream_ops = {};
                readMode = 365;
                writeMode = 146;
                mounted = null;
                constructor(e, r, t, n){
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
            lookupPath (e, r = {}) {
                if (!e) throw new i.ErrnoError(44);
                r.follow_mount ??= !0, M.isAbs(e) || (e = i.cwd() + "/" + e);
                e: for(var t = 0; t < 40; t++){
                    for(var n = e.split("/").filter((f)=>!!f), o = i.root, a = "/", s = 0; s < n.length; s++){
                        var c = s === n.length - 1;
                        if (c && r.parent) break;
                        if (n[s] !== ".") {
                            if (n[s] === "..") {
                                if (a = M.dirname(a), i.isRoot(o)) {
                                    e = a + "/" + n.slice(s + 1).join("/"), t--;
                                    continue e;
                                } else o = o.parent;
                                continue;
                            }
                            a = M.join2(a, n[s]);
                            try {
                                o = i.lookupNode(o, n[s]);
                            } catch (f) {
                                if (f?.errno === 44 && c && r.noent_okay) return {
                                    path: a
                                };
                                throw f;
                            }
                            if (i.isMountpoint(o) && (!c || r.follow_mount) && (o = o.mounted.root), i.isLink(o.mode) && (!c || r.follow)) {
                                if (!o.node_ops.readlink) throw new i.ErrnoError(52);
                                var l = o.node_ops.readlink(o);
                                M.isAbs(l) || (l = M.dirname(a) + "/" + l), e = l + "/" + n.slice(s + 1).join("/");
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
            getPath (e) {
                for(var r;;){
                    if (i.isRoot(e)) {
                        var t = e.mount.mountpoint;
                        return r ? t[t.length - 1] !== "/" ? `${t}/${r}` : t + r : t;
                    }
                    r = r ? `${e.name}/${r}` : e.name, e = e.parent;
                }
            },
            hashName (e, r) {
                for(var t = 0, n = 0; n < r.length; n++)t = (t << 5) - t + r.charCodeAt(n) | 0;
                return (e + t >>> 0) % i.nameTable.length;
            },
            hashAddNode (e) {
                var r = i.hashName(e.parent.id, e.name);
                e.name_next = i.nameTable[r], i.nameTable[r] = e;
            },
            hashRemoveNode (e) {
                var r = i.hashName(e.parent.id, e.name);
                if (i.nameTable[r] === e) i.nameTable[r] = e.name_next;
                else for(var t = i.nameTable[r]; t;){
                    if (t.name_next === e) {
                        t.name_next = e.name_next;
                        break;
                    }
                    t = t.name_next;
                }
            },
            lookupNode (e, r) {
                var t = i.mayLookup(e);
                if (t) throw new i.ErrnoError(t);
                for(var n = i.hashName(e.id, r), o = i.nameTable[n]; o; o = o.name_next){
                    var a = o.name;
                    if (o.parent.id === e.id && a === r) return o;
                }
                return i.lookup(e, r);
            },
            createNode (e, r, t, n) {
                u(typeof e == "object");
                var o = new i.FSNode(e, r, t, n);
                return i.hashAddNode(o), o;
            },
            destroyNode (e) {
                i.hashRemoveNode(e);
            },
            isRoot (e) {
                return e === e.parent;
            },
            isMountpoint (e) {
                return !!e.mounted;
            },
            isFile (e) {
                return (e & 61440) === 32768;
            },
            isDir (e) {
                return (e & 61440) === 16384;
            },
            isLink (e) {
                return (e & 61440) === 40960;
            },
            isChrdev (e) {
                return (e & 61440) === 8192;
            },
            isBlkdev (e) {
                return (e & 61440) === 24576;
            },
            isFIFO (e) {
                return (e & 61440) === 4096;
            },
            isSocket (e) {
                return (e & 49152) === 49152;
            },
            flagsToPermissionString (e) {
                var r = [
                    "r",
                    "w",
                    "rw"
                ][e & 3];
                return e & 512 && (r += "w"), r;
            },
            nodePermissions (e, r) {
                return i.ignorePermissions ? 0 : r.includes("r") && !(e.mode & 292) || r.includes("w") && !(e.mode & 146) || r.includes("x") && !(e.mode & 73) ? 2 : 0;
            },
            mayLookup (e) {
                if (!i.isDir(e.mode)) return 54;
                var r = i.nodePermissions(e, "x");
                return r || (e.node_ops.lookup ? 0 : 2);
            },
            mayCreate (e, r) {
                if (!i.isDir(e.mode)) return 54;
                try {
                    var t = i.lookupNode(e, r);
                    return 20;
                } catch  {}
                return i.nodePermissions(e, "wx");
            },
            mayDelete (e, r, t) {
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
            mayOpen (e, r) {
                return e ? i.isLink(e.mode) ? 32 : i.isDir(e.mode) && (i.flagsToPermissionString(r) !== "r" || r & 576) ? 31 : i.nodePermissions(e, i.flagsToPermissionString(r)) : 44;
            },
            checkOpExists (e, r) {
                if (!e) throw new i.ErrnoError(r);
                return e;
            },
            MAX_OPEN_FDS: 4096,
            nextfd () {
                for(var e = 0; e <= i.MAX_OPEN_FDS; e++)if (!i.streams[e]) return e;
                throw new i.ErrnoError(33);
            },
            getStreamChecked (e) {
                var r = i.getStream(e);
                if (!r) throw new i.ErrnoError(8);
                return r;
            },
            getStream: (e)=>i.streams[e],
            createStream (e, r = -1) {
                return u(r >= -1), e = Object.assign(new i.FSStream, e), r == -1 && (r = i.nextfd()), e.fd = r, i.streams[r] = e, e;
            },
            closeStream (e) {
                i.streams[e] = null;
            },
            dupStream (e, r = -1) {
                var t = i.createStream(e, r);
                return t.stream_ops?.dup?.(t), t;
            },
            doSetAttr (e, r, t) {
                var n = e?.stream_ops.setattr, o = n ? e : r;
                n ??= r.node_ops.setattr, i.checkOpExists(n, 63), n(o, t);
            },
            chrdev_stream_ops: {
                open (e) {
                    var r = i.getDevice(e.node.rdev);
                    e.stream_ops = r.stream_ops, e.stream_ops.open?.(e);
                },
                llseek () {
                    throw new i.ErrnoError(70);
                }
            },
            major: (e)=>e >> 8,
            minor: (e)=>e & 255,
            makedev: (e, r)=>e << 8 | r,
            registerDevice (e, r) {
                i.devices[e] = {
                    stream_ops: r
                };
            },
            getDevice: (e)=>i.devices[e],
            getMounts (e) {
                for(var r = [], t = [
                    e
                ]; t.length;){
                    var n = t.pop();
                    r.push(n), t.push(...n.mounts);
                }
                return r;
            },
            syncfs (e, r) {
                typeof e == "function" && (r = e, e = !1), i.syncFSRequests++, i.syncFSRequests > 1 && I(`warning: ${i.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
                var t = i.getMounts(i.root.mount), n = 0;
                function o(c) {
                    return u(i.syncFSRequests > 0), i.syncFSRequests--, r(c);
                }
                function a(c) {
                    if (c) return a.errored ? void 0 : (a.errored = !0, o(c));
                    ++n >= t.length && o(null);
                }
                for (var s of t)s.type.syncfs ? s.type.syncfs(s, e, a) : a(null);
            },
            mount (e, r, t) {
                if (typeof e == "string") throw e;
                var n = t === "/", o = !t, a;
                if (n && i.root) throw new i.ErrnoError(10);
                if (!n && !o) {
                    var s = i.lookupPath(t, {
                        follow_mount: !1
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
            unmount (e) {
                var r = i.lookupPath(e, {
                    follow_mount: !1
                });
                if (!i.isMountpoint(r.node)) throw new i.ErrnoError(28);
                var t = r.node, n = t.mounted, o = i.getMounts(n);
                for (var [a, s] of Object.entries(i.nameTable))for(; s;){
                    var c = s.name_next;
                    o.includes(s.mount) && i.destroyNode(s), s = c;
                }
                t.mounted = null;
                var l = t.mount.mounts.indexOf(n);
                u(l !== -1), t.mount.mounts.splice(l, 1);
            },
            lookup (e, r) {
                return e.node_ops.lookup(e, r);
            },
            mknod (e, r, t) {
                var n = i.lookupPath(e, {
                    parent: !0
                }), o = n.node, a = M.basename(e);
                if (!a) throw new i.ErrnoError(28);
                if (a === "." || a === "..") throw new i.ErrnoError(20);
                var s = i.mayCreate(o, a);
                if (s) throw new i.ErrnoError(s);
                if (!o.node_ops.mknod) throw new i.ErrnoError(63);
                return o.node_ops.mknod(o, a, r, t);
            },
            statfs (e) {
                return i.statfsNode(i.lookupPath(e, {
                    follow: !0
                }).node);
            },
            statfsStream (e) {
                return i.statfsNode(e.node);
            },
            statfsNode (e) {
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
            create (e, r = 438) {
                return r &= 4095, r |= 32768, i.mknod(e, r, 0);
            },
            mkdir (e, r = 511) {
                return r &= 1023, r |= 16384, i.mknod(e, r, 0);
            },
            mkdirTree (e, r) {
                var t = e.split("/"), n = "";
                for (var o of t)if (o) {
                    (n || M.isAbs(e)) && (n += "/"), n += o;
                    try {
                        i.mkdir(n, r);
                    } catch (a) {
                        if (a.errno != 20) throw a;
                    }
                }
            },
            mkdev (e, r, t) {
                return typeof t > "u" && (t = r, r = 438), r |= 8192, i.mknod(e, r, t);
            },
            symlink (e, r) {
                if (!Ce.resolve(e)) throw new i.ErrnoError(44);
                var t = i.lookupPath(r, {
                    parent: !0
                }), n = t.node;
                if (!n) throw new i.ErrnoError(44);
                var o = M.basename(r), a = i.mayCreate(n, o);
                if (a) throw new i.ErrnoError(a);
                if (!n.node_ops.symlink) throw new i.ErrnoError(63);
                return n.node_ops.symlink(n, o, e);
            },
            rename (e, r) {
                var t = M.dirname(e), n = M.dirname(r), o = M.basename(e), a = M.basename(r), s, c, l;
                if (s = i.lookupPath(e, {
                    parent: !0
                }), c = s.node, s = i.lookupPath(r, {
                    parent: !0
                }), l = s.node, !c || !l) throw new i.ErrnoError(44);
                if (c.mount !== l.mount) throw new i.ErrnoError(75);
                var f = i.lookupNode(c, o), m = Ce.relative(e, n);
                if (m.charAt(0) !== ".") throw new i.ErrnoError(28);
                if (m = Ce.relative(r, t), m.charAt(0) !== ".") throw new i.ErrnoError(55);
                var v;
                try {
                    v = i.lookupNode(l, a);
                } catch  {}
                if (f !== v) {
                    var _ = i.isDir(f.mode), g = i.mayDelete(c, o, _);
                    if (g) throw new i.ErrnoError(g);
                    if (g = v ? i.mayDelete(l, a, _) : i.mayCreate(l, a), g) throw new i.ErrnoError(g);
                    if (!c.node_ops.rename) throw new i.ErrnoError(63);
                    if (i.isMountpoint(f) || v && i.isMountpoint(v)) throw new i.ErrnoError(10);
                    if (l !== c && (g = i.nodePermissions(c, "w"), g)) throw new i.ErrnoError(g);
                    i.hashRemoveNode(f);
                    try {
                        c.node_ops.rename(f, l, a), f.parent = l;
                    } catch (S) {
                        throw S;
                    } finally{
                        i.hashAddNode(f);
                    }
                }
            },
            rmdir (e) {
                var r = i.lookupPath(e, {
                    parent: !0
                }), t = r.node, n = M.basename(e), o = i.lookupNode(t, n), a = i.mayDelete(t, n, !0);
                if (a) throw new i.ErrnoError(a);
                if (!t.node_ops.rmdir) throw new i.ErrnoError(63);
                if (i.isMountpoint(o)) throw new i.ErrnoError(10);
                t.node_ops.rmdir(t, n), i.destroyNode(o);
            },
            readdir (e) {
                var r = i.lookupPath(e, {
                    follow: !0
                }), t = r.node, n = i.checkOpExists(t.node_ops.readdir, 54);
                return n(t);
            },
            unlink (e) {
                var r = i.lookupPath(e, {
                    parent: !0
                }), t = r.node;
                if (!t) throw new i.ErrnoError(44);
                var n = M.basename(e), o = i.lookupNode(t, n), a = i.mayDelete(t, n, !1);
                if (a) throw new i.ErrnoError(a);
                if (!t.node_ops.unlink) throw new i.ErrnoError(63);
                if (i.isMountpoint(o)) throw new i.ErrnoError(10);
                t.node_ops.unlink(t, n), i.destroyNode(o);
            },
            readlink (e) {
                var r = i.lookupPath(e), t = r.node;
                if (!t) throw new i.ErrnoError(44);
                if (!t.node_ops.readlink) throw new i.ErrnoError(28);
                return t.node_ops.readlink(t);
            },
            stat (e, r) {
                var t = i.lookupPath(e, {
                    follow: !r
                }), n = t.node, o = i.checkOpExists(n.node_ops.getattr, 63);
                return o(n);
            },
            fstat (e) {
                var r = i.getStreamChecked(e), t = r.node, n = r.stream_ops.getattr, o = n ? r : t;
                return n ??= t.node_ops.getattr, i.checkOpExists(n, 63), n(o);
            },
            lstat (e) {
                return i.stat(e, !0);
            },
            doChmod (e, r, t, n) {
                i.doSetAttr(e, r, {
                    mode: t & 4095 | r.mode & -4096,
                    ctime: Date.now(),
                    dontFollow: n
                });
            },
            chmod (e, r, t) {
                var n;
                if (typeof e == "string") {
                    var o = i.lookupPath(e, {
                        follow: !t
                    });
                    n = o.node;
                } else n = e;
                i.doChmod(null, n, r, t);
            },
            lchmod (e, r) {
                i.chmod(e, r, !0);
            },
            fchmod (e, r) {
                var t = i.getStreamChecked(e);
                i.doChmod(t, t.node, r, !1);
            },
            doChown (e, r, t) {
                i.doSetAttr(e, r, {
                    timestamp: Date.now(),
                    dontFollow: t
                });
            },
            chown (e, r, t, n) {
                var o;
                if (typeof e == "string") {
                    var a = i.lookupPath(e, {
                        follow: !n
                    });
                    o = a.node;
                } else o = e;
                i.doChown(null, o, n);
            },
            lchown (e, r, t) {
                i.chown(e, r, t, !0);
            },
            fchown (e, r, t) {
                var n = i.getStreamChecked(e);
                i.doChown(n, n.node, !1);
            },
            doTruncate (e, r, t) {
                if (i.isDir(r.mode)) throw new i.ErrnoError(31);
                if (!i.isFile(r.mode)) throw new i.ErrnoError(28);
                var n = i.nodePermissions(r, "w");
                if (n) throw new i.ErrnoError(n);
                i.doSetAttr(e, r, {
                    size: t,
                    timestamp: Date.now()
                });
            },
            truncate (e, r) {
                if (r < 0) throw new i.ErrnoError(28);
                var t;
                if (typeof e == "string") {
                    var n = i.lookupPath(e, {
                        follow: !0
                    });
                    t = n.node;
                } else t = e;
                i.doTruncate(null, t, r);
            },
            ftruncate (e, r) {
                var t = i.getStreamChecked(e);
                if (r < 0 || !(t.flags & 2097155)) throw new i.ErrnoError(28);
                i.doTruncate(t, t.node, r);
            },
            utime (e, r, t) {
                var n = i.lookupPath(e, {
                    follow: !0
                }), o = n.node, a = i.checkOpExists(o.node_ops.setattr, 63);
                a(o, {
                    atime: r,
                    mtime: t
                });
            },
            open (e, r, t = 438) {
                if (e === "") throw new i.ErrnoError(44);
                r = typeof r == "string" ? ut(r) : r, r & 64 ? t = t & 4095 | 32768 : t = 0;
                var n, o;
                if (typeof e == "object") n = e;
                else {
                    o = e.endsWith("/");
                    var a = i.lookupPath(e, {
                        follow: !(r & 131072),
                        noent_okay: !0
                    });
                    n = a.node, e = a.path;
                }
                var s = !1;
                if (r & 64) if (n) {
                    if (r & 128) throw new i.ErrnoError(20);
                } else {
                    if (o) throw new i.ErrnoError(31);
                    n = i.mknod(e, t | 511, 0), s = !0;
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
                    seekable: !0,
                    position: 0,
                    stream_ops: n.stream_ops,
                    ungotten: [],
                    error: !1
                });
                return l.stream_ops.open && l.stream_ops.open(l), s && i.chmod(n, t & 511), d.logReadFiles && !(r & 1) && (e in i.readFiles || (i.readFiles[e] = 1)), l;
            },
            close (e) {
                if (i.isClosed(e)) throw new i.ErrnoError(8);
                e.getdents && (e.getdents = null);
                try {
                    e.stream_ops.close && e.stream_ops.close(e);
                } catch (r) {
                    throw r;
                } finally{
                    i.closeStream(e.fd);
                }
                e.fd = null;
            },
            isClosed (e) {
                return e.fd === null;
            },
            llseek (e, r, t) {
                if (i.isClosed(e)) throw new i.ErrnoError(8);
                if (!e.seekable || !e.stream_ops.llseek) throw new i.ErrnoError(70);
                if (t != 0 && t != 1 && t != 2) throw new i.ErrnoError(28);
                return e.position = e.stream_ops.llseek(e, r, t), e.ungotten = [], e.position;
            },
            read (e, r, t, n, o) {
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
            write (e, r, t, n, o, a) {
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
            mmap (e, r, t, n, o) {
                if (n & 2 && !(o & 2) && (e.flags & 2097155) !== 2) throw new i.ErrnoError(2);
                if ((e.flags & 2097155) === 1) throw new i.ErrnoError(2);
                if (!e.stream_ops.mmap) throw new i.ErrnoError(43);
                if (!r) throw new i.ErrnoError(28);
                return e.stream_ops.mmap(e, r, t, n, o);
            },
            msync (e, r, t, n, o) {
                return u(t >= 0), e.stream_ops.msync ? e.stream_ops.msync(e, r, t, n, o) : 0;
            },
            ioctl (e, r, t) {
                if (!e.stream_ops.ioctl) throw new i.ErrnoError(59);
                return e.stream_ops.ioctl(e, r, t);
            },
            readFile (e, r = {}) {
                r.flags = r.flags || 0, r.encoding = r.encoding || "binary", r.encoding !== "utf8" && r.encoding !== "binary" && R(`Invalid encoding type "${r.encoding}"`);
                var t = i.open(e, r.flags), n = i.stat(e), o = n.size, a = new Uint8Array(o);
                return i.read(t, a, 0, o, 0), r.encoding === "utf8" && (a = J(a)), i.close(t), a;
            },
            writeFile (e, r, t = {}) {
                t.flags = t.flags || 577;
                var n = i.open(e, t.flags, t.mode);
                typeof r == "string" && (r = new Uint8Array(wr(r))), ArrayBuffer.isView(r) ? i.write(n, r, 0, r.byteLength, void 0, t.canOwn) : R("Unsupported data type"), i.close(n);
            },
            cwd: ()=>i.currentPath,
            chdir (e) {
                var r = i.lookupPath(e, {
                    follow: !0
                });
                if (r.node === null) throw new i.ErrnoError(44);
                if (!i.isDir(r.node.mode)) throw new i.ErrnoError(54);
                var t = i.nodePermissions(r.node, "x");
                if (t) throw new i.ErrnoError(t);
                i.currentPath = r.path;
            },
            createDefaultDirectories () {
                i.mkdir("/tmp"), i.mkdir("/home"), i.mkdir("/home/web_user");
            },
            createDefaultDevices () {
                i.mkdir("/dev"), i.registerDevice(i.makedev(1, 3), {
                    read: ()=>0,
                    write: (n, o, a, s, c)=>s,
                    llseek: ()=>0
                }), i.mkdev("/dev/null", i.makedev(1, 3)), Fe.register(i.makedev(5, 0), Fe.default_tty_ops), Fe.register(i.makedev(6, 0), Fe.default_tty1_ops), i.mkdev("/dev/tty", i.makedev(5, 0)), i.mkdev("/dev/tty1", i.makedev(6, 0));
                var e = new Uint8Array(1024), r = 0, t = ()=>(r === 0 && (Tr(e), r = e.byteLength), e[--r]);
                i.createDevice("/dev", "random", t), i.createDevice("/dev", "urandom", t), i.mkdir("/dev/shm"), i.mkdir("/dev/shm/tmp");
            },
            createSpecialDirectories () {
                i.mkdir("/proc");
                var e = i.mkdir("/proc/self");
                i.mkdir("/proc/self/fd"), i.mount({
                    mount () {
                        var r = i.createNode(e, "fd", 16895, 73);
                        return r.stream_ops = {
                            llseek: P.stream_ops.llseek
                        }, r.node_ops = {
                            lookup (t, n) {
                                var o = +n, a = i.getStreamChecked(o), s = {
                                    parent: null,
                                    mount: {
                                        mountpoint: "fake"
                                    },
                                    node_ops: {
                                        readlink: ()=>a.path
                                    },
                                    id: o + 1
                                };
                                return s.parent = s, s;
                            },
                            readdir () {
                                return Array.from(i.streams.entries()).filter(([t, n])=>n).map(([t, n])=>t.toString());
                            }
                        }, r;
                    }
                }, {}, "/proc/self/fd");
            },
            createStandardStreams (e, r, t) {
                e ? i.createDevice("/dev", "stdin", e) : i.symlink("/dev/tty", "/dev/stdin"), r ? i.createDevice("/dev", "stdout", null, r) : i.symlink("/dev/tty", "/dev/stdout"), t ? i.createDevice("/dev", "stderr", null, t) : i.symlink("/dev/tty1", "/dev/stderr");
                var n = i.open("/dev/stdin", 0), o = i.open("/dev/stdout", 1), a = i.open("/dev/stderr", 1);
                u(n.fd === 0, `invalid handle for stdin (${n.fd})`), u(o.fd === 1, `invalid handle for stdout (${o.fd})`), u(a.fd === 2, `invalid handle for stderr (${a.fd})`);
            },
            staticInit () {
                i.nameTable = new Array(4096), i.mount(P, {}, "/"), i.createDefaultDirectories(), i.createDefaultDevices(), i.createSpecialDirectories(), i.filesystems = {
                    MEMFS: P
                };
            },
            init (e, r, t) {
                u(!i.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"), i.initialized = !0, e ??= d.stdin, r ??= d.stdout, t ??= d.stderr, i.createStandardStreams(e, r, t);
            },
            quit () {
                i.initialized = !1, Ur(0);
                for (var e of i.streams)e && i.close(e);
            },
            findObject (e, r) {
                var t = i.analyzePath(e, r);
                return t.exists ? t.object : null;
            },
            analyzePath (e, r) {
                try {
                    var t = i.lookupPath(e, {
                        follow: !r
                    });
                    e = t.path;
                } catch  {}
                var n = {
                    isRoot: !1,
                    exists: !1,
                    error: 0,
                    name: null,
                    path: null,
                    object: null,
                    parentExists: !1,
                    parentPath: null,
                    parentObject: null
                };
                try {
                    var t = i.lookupPath(e, {
                        parent: !0
                    });
                    n.parentExists = !0, n.parentPath = t.path, n.parentObject = t.node, n.name = M.basename(e), t = i.lookupPath(e, {
                        follow: !r
                    }), n.exists = !0, n.path = t.path, n.object = t.node, n.name = t.node.name, n.isRoot = t.path === "/";
                } catch (o) {
                    n.error = o.errno;
                }
                return n;
            },
            createPath (e, r, t, n) {
                e = typeof e == "string" ? e : i.getPath(e);
                for(var o = r.split("/").reverse(); o.length;){
                    var a = o.pop();
                    if (a) {
                        var s = M.join2(e, a);
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
            createFile (e, r, t, n, o) {
                var a = M.join2(typeof e == "string" ? e : i.getPath(e), r), s = Sr(n, o);
                return i.create(a, s);
            },
            createDataFile (e, r, t, n, o, a) {
                var s = r;
                e && (e = typeof e == "string" ? e : i.getPath(e), s = r ? M.join2(e, r) : e);
                var c = Sr(n, o), l = i.create(s, c);
                if (t) {
                    if (typeof t == "string") {
                        for(var f = new Array(t.length), m = 0, v = t.length; m < v; ++m)f[m] = t.charCodeAt(m);
                        t = f;
                    }
                    i.chmod(l, c | 146);
                    var _ = i.open(l, 577);
                    i.write(_, t, 0, t.length, 0, a), i.close(_), i.chmod(l, c);
                }
            },
            createDevice (e, r, t, n) {
                var o = M.join2(typeof e == "string" ? e : i.getPath(e), r), a = Sr(!!t, !!n);
                i.createDevice.major ??= 64;
                var s = i.makedev(i.createDevice.major++, 0);
                return i.registerDevice(s, {
                    open (c) {
                        c.seekable = !1;
                    },
                    close (c) {
                        n?.buffer?.length && n(10);
                    },
                    read (c, l, f, m, v) {
                        for(var _ = 0, g = 0; g < m; g++){
                            var S;
                            try {
                                S = t();
                            } catch  {
                                throw new i.ErrnoError(29);
                            }
                            if (S === void 0 && _ === 0) throw new i.ErrnoError(6);
                            if (S == null) break;
                            _++, l[f + g] = S;
                        }
                        return _ && (c.node.atime = Date.now()), _;
                    },
                    write (c, l, f, m, v) {
                        for(var _ = 0; _ < m; _++)try {
                            n(l[f + _]);
                        } catch  {
                            throw new i.ErrnoError(29);
                        }
                        return m && (c.node.mtime = c.node.ctime = Date.now()), _;
                    }
                }), i.mkdev(o, a, s);
            },
            forceLoadFile (e) {
                if (e.isDevice || e.isFolder || e.link || e.contents) return !0;
                if (globalThis.XMLHttpRequest) R("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
                else try {
                    e.contents = ie(e.url);
                } catch  {
                    throw new i.ErrnoError(29);
                }
            },
            createLazyFile (e, r, t, n, o) {
                class a {
                    lengthKnown = !1;
                    chunks = [];
                    get(_) {
                        if (!(_ > this.length - 1 || _ < 0)) {
                            var g = _ % this.chunkSize, S = _ / this.chunkSize | 0;
                            return this.getter(S)[g];
                        }
                    }
                    setDataGetter(_) {
                        this.getter = _;
                    }
                    cacheLength() {
                        var _ = new XMLHttpRequest;
                        _.open("HEAD", t, !1), _.send(null), _.status >= 200 && _.status < 300 || _.status === 304 || R("Couldn't load " + t + ". Status: " + _.status);
                        var g = Number(_.getResponseHeader("Content-length")), S, N = (S = _.getResponseHeader("Accept-Ranges")) && S === "bytes", C = (S = _.getResponseHeader("Content-Encoding")) && S === "gzip", D = 1024 * 1024;
                        N || (D = g);
                        var W = (Z, Ie)=>{
                            Z > Ie && R("invalid range (" + Z + ", " + Ie + ") or no bytes requested!"), Ie > g - 1 && R("only " + g + " bytes available! programmer error!");
                            var H = new XMLHttpRequest;
                            return H.open("GET", t, !1), g !== D && H.setRequestHeader("Range", "bytes=" + Z + "-" + Ie), H.responseType = "arraybuffer", H.overrideMimeType && H.overrideMimeType("text/plain; charset=x-user-defined"), H.send(null), H.status >= 200 && H.status < 300 || H.status === 304 || R("Couldn't load " + t + ". Status: " + H.status), H.response !== void 0 ? new Uint8Array(H.response || []) : wr(H.responseText || "");
                        }, de = this;
                        de.setDataGetter((Z)=>{
                            var Ie = Z * D, H = (Z + 1) * D - 1;
                            return H = Math.min(H, g - 1), typeof de.chunks[Z] > "u" && (de.chunks[Z] = W(Ie, H)), typeof de.chunks[Z] > "u" && R("doXHR failed!"), de.chunks[Z];
                        }), (C || !g) && (D = g = 1, g = this.getter(0).length, D = g, ue("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = g, this._chunkSize = D, this.lengthKnown = !0;
                    }
                    get length() {
                        return this.lengthKnown || this.cacheLength(), this._length;
                    }
                    get chunkSize() {
                        return this.lengthKnown || this.cacheLength(), this._chunkSize;
                    }
                }
                if (globalThis.XMLHttpRequest) {
                    K || R("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
                    var s = new a, c = {
                        isDevice: !1,
                        contents: s
                    };
                } else var c = {
                    isDevice: !1,
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
                for (const [v, _] of Object.entries(l.stream_ops))f[v] = (...g)=>(i.forceLoadFile(l), _(...g));
                function m(v, _, g, S, N) {
                    var C = v.node.contents;
                    if (N >= C.length) return 0;
                    var D = Math.min(C.length - N, S);
                    if (u(D >= 0), C.slice) for(var W = 0; W < D; W++)_[g + W] = C[N + W];
                    else for(var W = 0; W < D; W++)_[g + W] = C.get(N + W);
                    return D;
                }
                return f.read = (v, _, g, S, N)=>(i.forceLoadFile(l), m(v, _, g, S, N)), f.mmap = (v, _, g, S, N)=>{
                    i.forceLoadFile(l);
                    var C = Rr();
                    if (!C) throw new i.ErrnoError(48);
                    return m(v, $, C, _, g), {
                        ptr: C,
                        allocated: !0
                    };
                }, l.stream_ops = f, l;
            },
            absolutePath () {
                R("FS.absolutePath has been removed; use PATH_FS.resolve instead");
            },
            createFolder () {
                R("FS.createFolder has been removed; use FS.mkdir instead");
            },
            createLink () {
                R("FS.createLink has been removed; use FS.symlink instead");
            },
            joinPath () {
                R("FS.joinPath has been removed; use PATH.join instead");
            },
            mmapAlloc () {
                R("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
            },
            standardizePath () {
                R("FS.standardizePath has been removed; use PATH.normalize instead");
            }
        }, tr = {
            calculateAt (e, r, t) {
                if (M.isAbs(r)) return r;
                var n;
                if (e === -100) n = i.cwd();
                else {
                    var o = tr.getStreamFromFD(e);
                    n = o.path;
                }
                if (r.length == 0) {
                    if (!t) throw new i.ErrnoError(44);
                    return n;
                }
                return n + "/" + r;
            },
            writeStat (e, r) {
                F[e >> 2] = r.dev, F[e + 4 >> 2] = r.mode, F[e + 8 >> 2] = r.nlink, F[e + 12 >> 2] = r.uid, F[e + 16 >> 2] = r.gid, F[e + 20 >> 2] = r.rdev, z[e + 24 >> 3] = BigInt(r.size), ge[e + 32 >> 2] = 4096, ge[e + 36 >> 2] = r.blocks;
                var t = r.atime.getTime(), n = r.mtime.getTime(), o = r.ctime.getTime();
                return z[e + 40 >> 3] = BigInt(Math.floor(t / 1e3)), F[e + 48 >> 2] = t % 1e3 * 1e3 * 1e3, z[e + 56 >> 3] = BigInt(Math.floor(n / 1e3)), F[e + 64 >> 2] = n % 1e3 * 1e3 * 1e3, z[e + 72 >> 3] = BigInt(Math.floor(o / 1e3)), F[e + 80 >> 2] = o % 1e3 * 1e3 * 1e3, z[e + 88 >> 3] = BigInt(r.ino), 0;
            },
            writeStatFs (e, r) {
                F[e + 4 >> 2] = r.bsize, F[e + 60 >> 2] = r.bsize, z[e + 8 >> 3] = BigInt(r.blocks), z[e + 16 >> 3] = BigInt(r.bfree), z[e + 24 >> 3] = BigInt(r.bavail), z[e + 32 >> 3] = BigInt(r.files), z[e + 40 >> 3] = BigInt(r.ffree), F[e + 48 >> 2] = r.fsid, F[e + 64 >> 2] = r.flags, F[e + 56 >> 2] = r.namelen;
            },
            doMsync (e, r, t, n, o) {
                if (!i.isFile(r.node.mode)) throw new i.ErrnoError(43);
                if (n & 2) return 0;
                var a = ye.slice(e, e + t);
                i.msync(r, a, o, t, n);
            },
            getStreamFromFD (e) {
                var r = i.getStreamChecked(e);
                return r;
            },
            varargs: void 0,
            getStr (e) {
                var r = Y(e);
                return r;
            }
        };
        function wt(e) {
            try {
                var r = tr.getStreamFromFD(e);
                return i.close(r), 0;
            } catch (t) {
                if (typeof i > "u" || t.name !== "ErrnoError") throw t;
                return t.errno;
            }
        }
        var St = (e, r, t, n)=>{
            for(var o = 0, a = 0; a < t; a++){
                var s = F[r >> 2], c = F[r + 4 >> 2];
                r += 8;
                var l = i.read(e, $, s, c, n);
                if (l < 0) return -1;
                if (o += l, l < c) break;
            }
            return o;
        };
        function kt(e, r, t, n) {
            try {
                var o = tr.getStreamFromFD(e), a = St(o, r, t);
                return F[n >> 2] = a, 0;
            } catch (s) {
                if (typeof i > "u" || s.name !== "ErrnoError") throw s;
                return s.errno;
            }
        }
        function Ft(e, r, t, n) {
            r = rt(r);
            try {
                if (isNaN(r)) return 61;
                var o = tr.getStreamFromFD(e);
                return i.llseek(o, r, t), z[n >> 3] = BigInt(o.position), o.getdents && r === 0 && t === 0 && (o.getdents = null), 0;
            } catch (a) {
                if (typeof i > "u" || a.name !== "ErrnoError") throw a;
                return a.errno;
            }
        }
        var bt = (e, r, t, n)=>{
            for(var o = 0, a = 0; a < t; a++){
                var s = F[r >> 2], c = F[r + 4 >> 2];
                r += 8;
                var l = i.write(e, $, s, c, n);
                if (l < 0) return -1;
                if (o += l, l < c) break;
            }
            return o;
        };
        function Pt(e, r, t, n) {
            try {
                var o = tr.getStreamFromFD(e), a = bt(o, r, t);
                return F[n >> 2] = a, 0;
            } catch (s) {
                if (typeof i > "u" || s.name !== "ErrnoError") throw s;
                return s.errno;
            }
        }
        var At = (e)=>e, Dr = [], w = (e)=>{
            var r = Dr[e];
            return r || (Dr[e] = r = Pr.get(e)), u(Pr.get(e) == r, "JavaScript-side Wasm function table mirror is out of date!"), r;
        }, Tt = (e)=>vr(e), Rt = (e)=>br(e), Cr = (e)=>Hr(e), Mt = (e)=>{
            var r = y(), t = Cr(4), n = Cr(4);
            jr(e, t, n);
            var o = F[t >> 2], a = F[n >> 2], s = Y(o);
            kr(o);
            var c;
            return a && (c = Y(a), kr(a)), p(r), [
                s,
                c
            ];
        }, xr = (e)=>Mt(e);
        i.createPreloadedFile = Et, i.preloadFile = Or, i.staticInit();
        {
            if (d.noExitRuntime && d.noExitRuntime, d.preloadPlugins && (Nr = d.preloadPlugins), d.print && (ue = d.print), d.printErr && (I = d.printErr), d.wasmBinary && (_e = d.wasmBinary), Dt(), d.arguments && d.arguments, d.thisProgram && (te = d.thisProgram), u(typeof d.memoryInitializerPrefixURL > "u", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead"), u(typeof d.pthreadMainPrefixURL > "u", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead"), u(typeof d.cdInitializerPrefixURL > "u", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead"), u(typeof d.filePackagePrefixURL > "u", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead"), u(typeof d.read > "u", "Module.read option was removed"), u(typeof d.readAsync > "u", "Module.readAsync option was removed (modify readAsync in JS)"), u(typeof d.readBinary > "u", "Module.readBinary option was removed (modify readBinary in JS)"), u(typeof d.setWindowTitle > "u", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)"), u(typeof d.TOTAL_MEMORY > "u", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY"), u(typeof d.ENVIRONMENT > "u", "Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)"), u(typeof d.STACK_SIZE > "u", "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time"), u(typeof d.wasmMemory > "u", "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally"), u(typeof d.INITIAL_MEMORY > "u", "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically"), d.preInit) for(typeof d.preInit == "function" && (d.preInit = [
                d.preInit
            ]); d.preInit.length > 0;)d.preInit.shift()();
            oe("preInit");
        }
        var Nt = [
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
        Nt.forEach(je);
        var Ot = [
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
        Ot.forEach(Ae), d.incrementExceptionRefcount = Tt, d.decrementExceptionRefcount = Rt, d.getExceptionMessage = xr;
        function Dt() {
            He("fetchSettings");
        }
        d._deform = T("_deform"), d._malloc = T("_malloc");
        var kr = d._free = T("_free");
        d._assembled_joint_mass = T("_assembled_joint_mass"), d._modal = T("_modal"), d._modal_paz = T("_modal_paz"), d._didactic_solve = T("_didactic_solve"), d._plate_q4_solve = T("_plate_q4_solve"), d._slopeAllocDouble = T("_slopeAllocDouble"), d._slopeStabilitySolver = T("_slopeStabilitySolver"), d._nonlinear_dynamic = T("_nonlinear_dynamic"), d._steel02_test = T("_steel02_test"), d._cyclic_pushover = T("_cyclic_pushover"), d._concrete02_test = T("_concrete02_test"), d._hex8_solve = T("_hex8_solve"), d._hex8_stress = T("_hex8_stress");
        var Ur = T("_fflush"), Ir = T("_strerror"), Fr = T("_emscripten_stack_get_end"), E = T("_setThrew"), Lr = T("__emscripten_tempret_set"), Br = T("_emscripten_stack_init"), zr = T("__emscripten_stack_restore"), Hr = T("__emscripten_stack_alloc"), Wr = T("_emscripten_stack_get_current"), br = T("___cxa_decrement_exception_refcount"), vr = T("___cxa_increment_exception_refcount"), jr = T("___get_exception_message"), $r = T("___cxa_can_catch"), Gr = T("___cxa_get_exception_ptr"), hr = T("wasmMemory"), Pr = T("wasmTable");
        function Ct(e) {
            u(typeof e.deform < "u", "missing Wasm export: deform"), u(typeof e.malloc < "u", "missing Wasm export: malloc"), u(typeof e.free < "u", "missing Wasm export: free"), u(typeof e.__cxa_free_exception < "u", "missing Wasm export: __cxa_free_exception"), u(typeof e.assembled_joint_mass < "u", "missing Wasm export: assembled_joint_mass"), u(typeof e.modal < "u", "missing Wasm export: modal"), u(typeof e.modal_paz < "u", "missing Wasm export: modal_paz"), u(typeof e.didactic_solve < "u", "missing Wasm export: didactic_solve"), u(typeof e.plate_q4_solve < "u", "missing Wasm export: plate_q4_solve"), u(typeof e.slopeAllocDouble < "u", "missing Wasm export: slopeAllocDouble"), u(typeof e.slopeStabilitySolver < "u", "missing Wasm export: slopeStabilitySolver"), u(typeof e.nonlinear_dynamic < "u", "missing Wasm export: nonlinear_dynamic"), u(typeof e.steel02_test < "u", "missing Wasm export: steel02_test"), u(typeof e.cyclic_pushover < "u", "missing Wasm export: cyclic_pushover"), u(typeof e.concrete02_test < "u", "missing Wasm export: concrete02_test"), u(typeof e.hex8_solve < "u", "missing Wasm export: hex8_solve"), u(typeof e.hex8_stress < "u", "missing Wasm export: hex8_stress"), u(typeof e.fflush < "u", "missing Wasm export: fflush"), u(typeof e.strerror < "u", "missing Wasm export: strerror"), u(typeof e.emscripten_stack_get_end < "u", "missing Wasm export: emscripten_stack_get_end"), u(typeof e.emscripten_stack_get_base < "u", "missing Wasm export: emscripten_stack_get_base"), u(typeof e.setThrew < "u", "missing Wasm export: setThrew"), u(typeof e._emscripten_tempret_set < "u", "missing Wasm export: _emscripten_tempret_set"), u(typeof e.emscripten_stack_init < "u", "missing Wasm export: emscripten_stack_init"), u(typeof e.emscripten_stack_get_free < "u", "missing Wasm export: emscripten_stack_get_free"), u(typeof e._emscripten_stack_restore < "u", "missing Wasm export: _emscripten_stack_restore"), u(typeof e._emscripten_stack_alloc < "u", "missing Wasm export: _emscripten_stack_alloc"), u(typeof e.emscripten_stack_get_current < "u", "missing Wasm export: emscripten_stack_get_current"), u(typeof e.__cxa_decrement_exception_refcount < "u", "missing Wasm export: __cxa_decrement_exception_refcount"), u(typeof e.__cxa_increment_exception_refcount < "u", "missing Wasm export: __cxa_increment_exception_refcount"), u(typeof e.__get_exception_message < "u", "missing Wasm export: __get_exception_message"), u(typeof e.__cxa_can_catch < "u", "missing Wasm export: __cxa_can_catch"), u(typeof e.__cxa_get_exception_ptr < "u", "missing Wasm export: __cxa_get_exception_ptr"), u(typeof e.memory < "u", "missing Wasm export: memory"), u(typeof e.__indirect_function_table < "u", "missing Wasm export: __indirect_function_table"), d._deform = O("deform", 80), d._malloc = O("malloc", 1), kr = d._free = O("free", 1), d._assembled_joint_mass = O("assembled_joint_mass", 22), d._modal = O("modal", 84), d._modal_paz = O("modal_paz", 54), d._didactic_solve = O("didactic_solve", 48), d._plate_q4_solve = O("plate_q4_solve", 26), d._slopeAllocDouble = O("slopeAllocDouble", 1), d._slopeStabilitySolver = O("slopeStabilitySolver", 16), d._nonlinear_dynamic = O("nonlinear_dynamic", 20), d._steel02_test = O("steel02_test", 8), d._cyclic_pushover = O("cyclic_pushover", 40), d._concrete02_test = O("concrete02_test", 10), d._hex8_solve = O("hex8_solve", 18), d._hex8_stress = O("hex8_stress", 7), Ur = O("fflush", 1), Ir = O("strerror", 1), Fr = e.emscripten_stack_get_end, e.emscripten_stack_get_base, E = O("setThrew", 2), Lr = O("_emscripten_tempret_set", 1), Br = e.emscripten_stack_init, e.emscripten_stack_get_free, zr = e._emscripten_stack_restore, Hr = e._emscripten_stack_alloc, Wr = e.emscripten_stack_get_current, br = O("__cxa_decrement_exception_refcount", 1), vr = O("__cxa_increment_exception_refcount", 1), jr = O("__get_exception_message", 3), $r = O("__cxa_can_catch", 3), Gr = O("__cxa_get_exception_ptr", 1), hr = e.memory, Pr = e.__indirect_function_table;
        }
        var Vr = {
            __assert_fail: Xe,
            __cxa_begin_catch: Je,
            __cxa_end_catch: De,
            __cxa_find_matching_catch_2: dr,
            __cxa_find_matching_catch_3: fr,
            __cxa_rethrow: ur,
            __cxa_throw: U,
            __cxa_uncaught_exceptions: G,
            __resumeException: yr,
            _abort_js: _r,
            _tzset_js: Yr,
            clock_time_get: tt,
            emscripten_resize_heap: at,
            environ_get: ct,
            environ_sizes_get: lt,
            fd_close: wt,
            fd_read: kt,
            fd_seek: Ft,
            fd_write: Pt,
            invoke_di: bn,
            invoke_dii: fn,
            invoke_diii: In,
            invoke_fiii: Un,
            invoke_i: Ln,
            invoke_ii: It,
            invoke_iid: Gt,
            invoke_iii: jt,
            invoke_iiii: xt,
            invoke_iiiii: Qt,
            invoke_iiiiid: On,
            invoke_iiiiii: qt,
            invoke_iiiiiii: Jt,
            invoke_iiiiiiid: Wt,
            invoke_iiiiiiii: an,
            invoke_iiiiiiiii: on,
            invoke_iiiiiiiiii: nn,
            invoke_iiiiiiiiiii: Dn,
            invoke_iiiiiiiiiiii: Bn,
            invoke_iiiiiiiiiiiii: xn,
            invoke_iiiiiiiiiiiiiii: tn,
            invoke_j: Nn,
            invoke_jiiii: Cn,
            invoke_v: Ut,
            invoke_vddiiii: hn,
            invoke_vi: Zt,
            invoke_vid: Kt,
            invoke_vidddddddddddddi: Sn,
            invoke_viddii: kn,
            invoke_vii: $t,
            invoke_viid: Yt,
            invoke_viidd: En,
            invoke_viiddd: pn,
            invoke_viiddi: Fn,
            invoke_viii: zt,
            invoke_viiid: Vt,
            invoke_viiidd: Rn,
            invoke_viiiddd: gn,
            invoke_viiidddd: Tn,
            invoke_viiidddddd: Mn,
            invoke_viiidddi: An,
            invoke_viiidddidiiddiii: Pn,
            invoke_viiii: Bt,
            invoke_viiiii: Lt,
            invoke_viiiiid: mn,
            invoke_viiiiidiii: yn,
            invoke_viiiiii: Ht,
            invoke_viiiiiid: _n,
            invoke_viiiiiii: cn,
            invoke_viiiiiiidiiii: ln,
            invoke_viiiiiiii: Xt,
            invoke_viiiiiiiii: sn,
            invoke_viiiiiiiiii: rn,
            invoke_viiiiiiiiiidii: un,
            invoke_viiiiiiiiiii: dn,
            invoke_viiiiiiiiiiiddddii: wn,
            invoke_viiiiiiiiiiii: vn,
            invoke_viiiiiiiiiiiiiii: zn,
            invoke_viiiiiiiiiiiiiiii: en,
            llvm_eh_typeid_for: At
        };
        function xt(e, r, t, n) {
            var o = y();
            try {
                return w(e)(r, t, n);
            } catch (a) {
                if (p(o), !(a instanceof h)) throw a;
                E(1, 0);
            }
        }
        function Ut(e) {
            var r = y();
            try {
                w(e)();
            } catch (t) {
                if (p(r), !(t instanceof h)) throw t;
                E(1, 0);
            }
        }
        function It(e, r) {
            var t = y();
            try {
                return w(e)(r);
            } catch (n) {
                if (p(t), !(n instanceof h)) throw n;
                E(1, 0);
            }
        }
        function Lt(e, r, t, n, o, a) {
            var s = y();
            try {
                w(e)(r, t, n, o, a);
            } catch (c) {
                if (p(s), !(c instanceof h)) throw c;
                E(1, 0);
            }
        }
        function Bt(e, r, t, n, o) {
            var a = y();
            try {
                w(e)(r, t, n, o);
            } catch (s) {
                if (p(a), !(s instanceof h)) throw s;
                E(1, 0);
            }
        }
        function zt(e, r, t, n) {
            var o = y();
            try {
                w(e)(r, t, n);
            } catch (a) {
                if (p(o), !(a instanceof h)) throw a;
                E(1, 0);
            }
        }
        function Ht(e, r, t, n, o, a, s) {
            var c = y();
            try {
                w(e)(r, t, n, o, a, s);
            } catch (l) {
                if (p(c), !(l instanceof h)) throw l;
                E(1, 0);
            }
        }
        function Wt(e, r, t, n, o, a, s, c) {
            var l = y();
            try {
                return w(e)(r, t, n, o, a, s, c);
            } catch (f) {
                if (p(l), !(f instanceof h)) throw f;
                E(1, 0);
            }
        }
        function jt(e, r, t) {
            var n = y();
            try {
                return w(e)(r, t);
            } catch (o) {
                if (p(n), !(o instanceof h)) throw o;
                E(1, 0);
            }
        }
        function $t(e, r, t) {
            var n = y();
            try {
                w(e)(r, t);
            } catch (o) {
                if (p(n), !(o instanceof h)) throw o;
                E(1, 0);
            }
        }
        function Gt(e, r, t) {
            var n = y();
            try {
                return w(e)(r, t);
            } catch (o) {
                if (p(n), !(o instanceof h)) throw o;
                E(1, 0);
            }
        }
        function Vt(e, r, t, n, o) {
            var a = y();
            try {
                w(e)(r, t, n, o);
            } catch (s) {
                if (p(a), !(s instanceof h)) throw s;
                E(1, 0);
            }
        }
        function qt(e, r, t, n, o, a) {
            var s = y();
            try {
                return w(e)(r, t, n, o, a);
            } catch (c) {
                if (p(s), !(c instanceof h)) throw c;
                E(1, 0);
            }
        }
        function Kt(e, r, t) {
            var n = y();
            try {
                w(e)(r, t);
            } catch (o) {
                if (p(n), !(o instanceof h)) throw o;
                E(1, 0);
            }
        }
        function Yt(e, r, t, n) {
            var o = y();
            try {
                w(e)(r, t, n);
            } catch (a) {
                if (p(o), !(a instanceof h)) throw a;
                E(1, 0);
            }
        }
        function Xt(e, r, t, n, o, a, s, c, l) {
            var f = y();
            try {
                w(e)(r, t, n, o, a, s, c, l);
            } catch (m) {
                if (p(f), !(m instanceof h)) throw m;
                E(1, 0);
            }
        }
        function Jt(e, r, t, n, o, a, s) {
            var c = y();
            try {
                return w(e)(r, t, n, o, a, s);
            } catch (l) {
                if (p(c), !(l instanceof h)) throw l;
                E(1, 0);
            }
        }
        function Zt(e, r) {
            var t = y();
            try {
                w(e)(r);
            } catch (n) {
                if (p(t), !(n instanceof h)) throw n;
                E(1, 0);
            }
        }
        function Qt(e, r, t, n, o) {
            var a = y();
            try {
                return w(e)(r, t, n, o);
            } catch (s) {
                if (p(a), !(s instanceof h)) throw s;
                E(1, 0);
            }
        }
        function en(e, r, t, n, o, a, s, c, l, f, m, v, _, g, S, N, C) {
            var D = y();
            try {
                w(e)(r, t, n, o, a, s, c, l, f, m, v, _, g, S, N, C);
            } catch (W) {
                if (p(D), !(W instanceof h)) throw W;
                E(1, 0);
            }
        }
        function rn(e, r, t, n, o, a, s, c, l, f, m) {
            var v = y();
            try {
                w(e)(r, t, n, o, a, s, c, l, f, m);
            } catch (_) {
                if (p(v), !(_ instanceof h)) throw _;
                E(1, 0);
            }
        }
        function tn(e, r, t, n, o, a, s, c, l, f, m, v, _, g, S) {
            var N = y();
            try {
                return w(e)(r, t, n, o, a, s, c, l, f, m, v, _, g, S);
            } catch (C) {
                if (p(N), !(C instanceof h)) throw C;
                E(1, 0);
            }
        }
        function nn(e, r, t, n, o, a, s, c, l, f) {
            var m = y();
            try {
                return w(e)(r, t, n, o, a, s, c, l, f);
            } catch (v) {
                if (p(m), !(v instanceof h)) throw v;
                E(1, 0);
            }
        }
        function on(e, r, t, n, o, a, s, c, l) {
            var f = y();
            try {
                return w(e)(r, t, n, o, a, s, c, l);
            } catch (m) {
                if (p(f), !(m instanceof h)) throw m;
                E(1, 0);
            }
        }
        function an(e, r, t, n, o, a, s, c) {
            var l = y();
            try {
                return w(e)(r, t, n, o, a, s, c);
            } catch (f) {
                if (p(l), !(f instanceof h)) throw f;
                E(1, 0);
            }
        }
        function sn(e, r, t, n, o, a, s, c, l, f) {
            var m = y();
            try {
                w(e)(r, t, n, o, a, s, c, l, f);
            } catch (v) {
                if (p(m), !(v instanceof h)) throw v;
                E(1, 0);
            }
        }
        function cn(e, r, t, n, o, a, s, c) {
            var l = y();
            try {
                w(e)(r, t, n, o, a, s, c);
            } catch (f) {
                if (p(l), !(f instanceof h)) throw f;
                E(1, 0);
            }
        }
        function ln(e, r, t, n, o, a, s, c, l, f, m, v, _) {
            var g = y();
            try {
                w(e)(r, t, n, o, a, s, c, l, f, m, v, _);
            } catch (S) {
                if (p(g), !(S instanceof h)) throw S;
                E(1, 0);
            }
        }
        function dn(e, r, t, n, o, a, s, c, l, f, m, v) {
            var _ = y();
            try {
                w(e)(r, t, n, o, a, s, c, l, f, m, v);
            } catch (g) {
                if (p(_), !(g instanceof h)) throw g;
                E(1, 0);
            }
        }
        function fn(e, r, t) {
            var n = y();
            try {
                return w(e)(r, t);
            } catch (o) {
                if (p(n), !(o instanceof h)) throw o;
                E(1, 0);
            }
        }
        function un(e, r, t, n, o, a, s, c, l, f, m, v, _, g) {
            var S = y();
            try {
                w(e)(r, t, n, o, a, s, c, l, f, m, v, _, g);
            } catch (N) {
                if (p(S), !(N instanceof h)) throw N;
                E(1, 0);
            }
        }
        function _n(e, r, t, n, o, a, s, c) {
            var l = y();
            try {
                w(e)(r, t, n, o, a, s, c);
            } catch (f) {
                if (p(l), !(f instanceof h)) throw f;
                E(1, 0);
            }
        }
        function mn(e, r, t, n, o, a, s) {
            var c = y();
            try {
                w(e)(r, t, n, o, a, s);
            } catch (l) {
                if (p(c), !(l instanceof h)) throw l;
                E(1, 0);
            }
        }
        function vn(e, r, t, n, o, a, s, c, l, f, m, v, _) {
            var g = y();
            try {
                w(e)(r, t, n, o, a, s, c, l, f, m, v, _);
            } catch (S) {
                if (p(g), !(S instanceof h)) throw S;
                E(1, 0);
            }
        }
        function hn(e, r, t, n, o, a, s) {
            var c = y();
            try {
                w(e)(r, t, n, o, a, s);
            } catch (l) {
                if (p(c), !(l instanceof h)) throw l;
                E(1, 0);
            }
        }
        function pn(e, r, t, n, o, a) {
            var s = y();
            try {
                w(e)(r, t, n, o, a);
            } catch (c) {
                if (p(s), !(c instanceof h)) throw c;
                E(1, 0);
            }
        }
        function yn(e, r, t, n, o, a, s, c, l, f) {
            var m = y();
            try {
                w(e)(r, t, n, o, a, s, c, l, f);
            } catch (v) {
                if (p(m), !(v instanceof h)) throw v;
                E(1, 0);
            }
        }
        function gn(e, r, t, n, o, a, s) {
            var c = y();
            try {
                w(e)(r, t, n, o, a, s);
            } catch (l) {
                if (p(c), !(l instanceof h)) throw l;
                E(1, 0);
            }
        }
        function En(e, r, t, n, o) {
            var a = y();
            try {
                w(e)(r, t, n, o);
            } catch (s) {
                if (p(a), !(s instanceof h)) throw s;
                E(1, 0);
            }
        }
        function wn(e, r, t, n, o, a, s, c, l, f, m, v, _, g, S, N, C, D) {
            var W = y();
            try {
                w(e)(r, t, n, o, a, s, c, l, f, m, v, _, g, S, N, C, D);
            } catch (de) {
                if (p(W), !(de instanceof h)) throw de;
                E(1, 0);
            }
        }
        function Sn(e, r, t, n, o, a, s, c, l, f, m, v, _, g, S, N) {
            var C = y();
            try {
                w(e)(r, t, n, o, a, s, c, l, f, m, v, _, g, S, N);
            } catch (D) {
                if (p(C), !(D instanceof h)) throw D;
                E(1, 0);
            }
        }
        function kn(e, r, t, n, o, a) {
            var s = y();
            try {
                w(e)(r, t, n, o, a);
            } catch (c) {
                if (p(s), !(c instanceof h)) throw c;
                E(1, 0);
            }
        }
        function Fn(e, r, t, n, o, a) {
            var s = y();
            try {
                w(e)(r, t, n, o, a);
            } catch (c) {
                if (p(s), !(c instanceof h)) throw c;
                E(1, 0);
            }
        }
        function bn(e, r) {
            var t = y();
            try {
                return w(e)(r);
            } catch (n) {
                if (p(t), !(n instanceof h)) throw n;
                E(1, 0);
            }
        }
        function Pn(e, r, t, n, o, a, s, c, l, f, m, v, _, g, S, N) {
            var C = y();
            try {
                w(e)(r, t, n, o, a, s, c, l, f, m, v, _, g, S, N);
            } catch (D) {
                if (p(C), !(D instanceof h)) throw D;
                E(1, 0);
            }
        }
        function An(e, r, t, n, o, a, s, c) {
            var l = y();
            try {
                w(e)(r, t, n, o, a, s, c);
            } catch (f) {
                if (p(l), !(f instanceof h)) throw f;
                E(1, 0);
            }
        }
        function Tn(e, r, t, n, o, a, s, c) {
            var l = y();
            try {
                w(e)(r, t, n, o, a, s, c);
            } catch (f) {
                if (p(l), !(f instanceof h)) throw f;
                E(1, 0);
            }
        }
        function Rn(e, r, t, n, o, a) {
            var s = y();
            try {
                w(e)(r, t, n, o, a);
            } catch (c) {
                if (p(s), !(c instanceof h)) throw c;
                E(1, 0);
            }
        }
        function Mn(e, r, t, n, o, a, s, c, l, f) {
            var m = y();
            try {
                w(e)(r, t, n, o, a, s, c, l, f);
            } catch (v) {
                if (p(m), !(v instanceof h)) throw v;
                E(1, 0);
            }
        }
        function Nn(e) {
            var r = y();
            try {
                return w(e)();
            } catch (t) {
                if (p(r), !(t instanceof h)) throw t;
                return E(1, 0), 0n;
            }
        }
        function On(e, r, t, n, o, a) {
            var s = y();
            try {
                return w(e)(r, t, n, o, a);
            } catch (c) {
                if (p(s), !(c instanceof h)) throw c;
                E(1, 0);
            }
        }
        function Dn(e, r, t, n, o, a, s, c, l, f, m) {
            var v = y();
            try {
                return w(e)(r, t, n, o, a, s, c, l, f, m);
            } catch (_) {
                if (p(v), !(_ instanceof h)) throw _;
                E(1, 0);
            }
        }
        function Cn(e, r, t, n, o) {
            var a = y();
            try {
                return w(e)(r, t, n, o);
            } catch (s) {
                if (p(a), !(s instanceof h)) throw s;
                return E(1, 0), 0n;
            }
        }
        function xn(e, r, t, n, o, a, s, c, l, f, m, v, _) {
            var g = y();
            try {
                return w(e)(r, t, n, o, a, s, c, l, f, m, v, _);
            } catch (S) {
                if (p(g), !(S instanceof h)) throw S;
                E(1, 0);
            }
        }
        function Un(e, r, t, n) {
            var o = y();
            try {
                return w(e)(r, t, n);
            } catch (a) {
                if (p(o), !(a instanceof h)) throw a;
                E(1, 0);
            }
        }
        function In(e, r, t, n) {
            var o = y();
            try {
                return w(e)(r, t, n);
            } catch (a) {
                if (p(o), !(a instanceof h)) throw a;
                E(1, 0);
            }
        }
        function Ln(e) {
            var r = y();
            try {
                return w(e)();
            } catch (t) {
                if (p(r), !(t instanceof h)) throw t;
                E(1, 0);
            }
        }
        function Bn(e, r, t, n, o, a, s, c, l, f, m, v) {
            var _ = y();
            try {
                return w(e)(r, t, n, o, a, s, c, l, f, m, v);
            } catch (g) {
                if (p(_), !(g instanceof h)) throw g;
                E(1, 0);
            }
        }
        function zn(e, r, t, n, o, a, s, c, l, f, m, v, _, g, S, N) {
            var C = y();
            try {
                w(e)(r, t, n, o, a, s, c, l, f, m, v, _, g, S, N);
            } catch (D) {
                if (p(C), !(D instanceof h)) throw D;
                E(1, 0);
            }
        }
        var qr;
        function Hn() {
            Br(), ze();
        }
        function Ar() {
            if (be > 0) {
                rr = Ar;
                return;
            }
            if (Hn(), ir(), be > 0) {
                rr = Ar;
                return;
            }
            function e() {
                u(!qr), qr = !0, d.calledRun = !0, !me && (or(), Te?.(d), d.onRuntimeInitialized?.(), oe("onRuntimeInitialized"), u(!d._main, 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]'), Re());
            }
            d.setStatus ? (d.setStatus("Running..."), setTimeout(()=>{
                setTimeout(()=>d.setStatus(""), 1), e();
            }, 1)) : e(), ve();
        }
        var Ue;
        Ue = await cr(), Ar(), ae ? B = d : B = new Promise((e, r)=>{
            Te = e, pe = r;
        });
        for (const e of Object.keys(d))e in L || Object.defineProperty(L, e, {
            configurable: !0,
            get () {
                R(`Access to module property ('${e}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`);
            }
        });
        return B;
    }
    function jn(L) {
        const B = new Array(12).fill(0);
        if (!L) return B;
        if (L.length >= 12) {
            for(let k = 0; k < 12; k++)B[k] = L[k] ? 1 : 0;
            return B;
        }
        const d = [
            3,
            4,
            5,
            9,
            10,
            11
        ];
        for(let k = 0; k < 6 && k < L.length; k++)L[k] && (B[d[k]] = 1);
        return B;
    }
    await Le();
    const b = await Le();
    function $n(L, B, d, k, K = 10, q = 0, X = 0, Q = 1, te, Pe) {
        if (L.length === 0) return {
            frequencies: [],
            modeShapes: [],
            massParticipation: []
        };
        const A = [], ne = j(L.flat(), Float64Array, b.HEAPF64);
        A.push(ne);
        const fe = B.flat(), ie = j(fe, Uint32Array, b.HEAPU32);
        A.push(ie);
        const Be = B.map((U)=>U.length), ue = j(Be, Uint32Array, b.HEAPU32);
        A.push(ue);
        const I = d.supports ? Array.from(d.supports.keys()) : [], _e = d.supports ? Array.from(d.supports.values()).flat().map((U)=>U ? 1 : 0) : [], me = j(I, Uint32Array, b.HEAPU32);
        A.push(me);
        const u = j(_e, Uint8Array, b.HEAPU8);
        A.push(u);
        const x = (U)=>{
            const G = U ? Array.from(U.keys()) : [], yr = U ? Array.from(U.values()) : [], _r = j(G, Uint32Array, b.HEAPU32);
            A.push(_r);
            const Ze = j(yr, Float64Array, b.HEAPF64);
            return A.push(Ze), {
                keysPtr: _r,
                valuesPtr: Ze,
                size: G.length
            };
        }, ze = x(k.elasticities), ve = x(k.areas), h = x(k.momentsOfInertiaZ), he = x(k.momentsOfInertiaY), oe = x(k.shearModuli), T = x(k.torsionalConstants), He = x(k.densities), We = x(k.thicknesses), je = x(k.poissonsRatios), Ae = x(k.membraneModifiers), Te = x(k.bendingModifiers), pe = k.plateFormulations, $ = pe ? Array.from(pe.keys()) : [], ye = pe ? Array.from(pe.values()) : [], ge = j($, Uint32Array, b.HEAPU32);
        A.push(ge);
        const F = j(ye, Uint32Array, b.HEAPU32);
        A.push(F);
        const z = k.drillingTypes, ae = z ? Array.from(z.keys()) : [], nr = z ? Array.from(z.values()) : [], ir = j(ae, Uint32Array, b.HEAPU32);
        A.push(ir);
        const or = j(nr, Uint32Array, b.HEAPU32);
        A.push(or);
        const Re = k.drillingPenaltyScales, R = Re ? Array.from(Re.keys()) : [], O = Re ? Array.from(Re.values()) : [], Me = j(R, Uint32Array, b.HEAPU32);
        A.push(Me);
        const ar = j(O, Float64Array, b.HEAPF64);
        A.push(ar);
        const $e = x(k.shearAreasY), Ge = x(k.shearAreasZ), Ve = x(k.localAngles), sr = k.momentReleases ? Array.from(k.momentReleases.keys()) : [], pr = k.momentReleases ? Array.from(k.momentReleases.values()).flatMap(jn) : [], cr = j(sr, Uint32Array, b.HEAPU32);
        A.push(cr);
        const qe = j(pr, Uint8Array, b.HEAPU8);
        A.push(qe);
        const Ne = x(d.masses), Ke = x(d.diaphragms), Ee = d.springs, lr = Ee ? Ee.flatMap((U)=>[
                U.node,
                U.dof,
                U.k
            ]) : [], se = j(lr.length > 0 ? lr : [
            0
        ], Float64Array, b.HEAPF64);
        A.push(se);
        const p = b._malloc(4);
        A.push(p);
        const y = b._malloc(4);
        A.push(y);
        const ee = b._malloc(4);
        A.push(ee);
        const Oe = b._malloc(4);
        A.push(Oe);
        const Ye = b._malloc(4);
        A.push(Ye);
        const J = b._malloc(4);
        A.push(J);
        const Y = b._malloc(4);
        A.push(Y);
        const Xe = b._malloc(4);
        A.push(Xe), b._modal(ne, L.length, ie, fe.length, ue, B.length, me, u, I.length, ze.keysPtr, ze.valuesPtr, ze.size, ve.keysPtr, ve.valuesPtr, ve.size, h.keysPtr, h.valuesPtr, h.size, he.keysPtr, he.valuesPtr, he.size, oe.keysPtr, oe.valuesPtr, oe.size, T.keysPtr, T.valuesPtr, T.size, He.keysPtr, He.valuesPtr, He.size, We.keysPtr, We.valuesPtr, We.size, je.keysPtr, je.valuesPtr, je.size, Ae.keysPtr, Ae.valuesPtr, Ae.size, Te.keysPtr, Te.valuesPtr, Te.size, ge, F, $.length, ir, or, ae.length, Me, ar, R.length, $e.keysPtr, $e.valuesPtr, $e.size, Ge.keysPtr, Ge.valuesPtr, Ge.size, Ve.keysPtr, Ve.valuesPtr, Ve.size, cr, qe, sr.length, Ne.keysPtr, Ne.valuesPtr, Ne.size, Q, Ke.keysPtr, Ke.valuesPtr, Ke.size, se, Ee ? Ee.length : 0, k.etabsWallJoint === !1 ? 0 : 1, K, q, X, p, y, ee, Oe, Ye, J, Y, Xe);
        const re = b.HEAPU32[p / 4], we = b.HEAPU32[y / 4], Je = b.HEAPU32[ee / 4], V = b.HEAPU32[Oe / 4], De = b.HEAPU32[Ye / 4], Se = b.HEAPU32[J / 4], ce = b.HEAPU32[Y / 4], ke = b.HEAPU32[Xe / 4];
        let dr = [], fr = [], ur = [];
        if (we > 0 && re) {
            const U = new Float64Array(b.HEAPF64.buffer, re, we);
            dr = Array.from(U), A.push(re);
        }
        if (V > 0 && De > 0 && Je) {
            const U = new Float64Array(b.HEAPF64.buffer, Je, V * De);
            for(let G = 0; G < V; G++)fr.push(Array.from(U.slice(G * De, (G + 1) * De)));
            A.push(Je);
        }
        if (ce > 0 && ke > 0 && Se) {
            const U = new Float64Array(b.HEAPF64.buffer, Se, ce * ke);
            for(let G = 0; G < ce; G++)ur.push(Array.from(U.slice(G * ke, (G + 1) * ke)));
            A.push(Se);
        }
        return A.forEach((U)=>b._free(U)), {
            frequencies: dr,
            modeShapes: fr,
            massParticipation: ur
        };
    }
    function j(L, B, d) {
        const k = new B(L), K = b._malloc(k.length * k.BYTES_PER_ELEMENT);
        return (B === Float64Array ? b.HEAPF64 : B === Uint32Array ? b.HEAPU32 : B === Uint8Array ? b.HEAPU8 : d).set(k, K / k.BYTES_PER_ELEMENT), K;
    }
    await Le();
    await Le();
    await Le();
    await Le();
    function Kr(L) {
        return L ? new Map(L) : void 0;
    }
    self.postMessage({
        vivo: !0
    });
    self.onmessage = async (L)=>{
        const { nodes: B, elements: d, nodeInputs: k, elementInputs: K, nModes: q } = L.data ?? {};
        try {
            const X = {};
            for (const [A, ne] of Object.entries(k ?? {}))X[A] = Kr(ne);
            const Q = {};
            for (const [A, ne] of Object.entries(K ?? {}))Q[A] = Kr(ne);
            const te = $n(B, d, X, Q, q), Pe = {
                frequencies: te?.frequencies ?? [],
                massParticipation: te?.massParticipation ?? [],
                modeShapes: te?.modeShapes ?? []
            };
            self.postMessage({
                ok: !0,
                m: Pe
            });
        } catch (X) {
            self.postMessage({
                ok: !1,
                error: X?.message ?? String(X)
            });
        }
    };
})();
