(async ()=>{
    var et = Object.freeze({
        __proto__: null
    });
    async function Ce(N = {}) {
        var O;
        (function() {
            function e(u) {
                u = u.split("-")[0];
                for(var m = u.split(".").slice(0, 3); m.length < 3;)m.push("00");
                return m = m.map((y, S, v)=>y.padStart(2, "0")), m.join("");
            }
            var r = (u)=>[
                    u / 1e4 | 0,
                    (u / 100 | 0) % 100,
                    u % 100
                ].join("."), t = 2147483647, o = typeof process < "u" && process.versions?.node ? e(process.versions.node) : t;
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
        var d = N, h = !!globalThis.window, x = !!globalThis.WorkerGlobalScope, H = globalThis.process?.versions?.node && globalThis.process?.type != "renderer", j = !h && !H && !x;
        if (H) {
            const { createRequire: e } = await Promise.resolve().then(function() {
                return et;
            });
            var Y = e(import.meta.url);
        }
        var Z = "./this.program", _e = import.meta.url, p = "";
        function Q(e) {
            return d.locateFile ? d.locateFile(e, p) : p + e;
        }
        var le, ee;
        if (H) {
            if (!(globalThis.process?.versions?.node && globalThis.process?.type != "renderer")) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
            var Ue = Y("fs");
            _e.startsWith("file:") && (p = Y("path").dirname(Y("url").fileURLToPath(_e)) + "/"), ee = (r)=>{
                r = b(r) ? new URL(r) : r;
                var t = Ue.readFileSync(r);
                return c(Buffer.isBuffer(t)), t;
            }, le = async (r, t = !0)=>{
                r = b(r) ? new URL(r) : r;
                var o = Ue.readFileSync(r, t ? void 0 : "utf8");
                return c(t ? Buffer.isBuffer(o) : typeof o == "string"), o;
            }, process.argv.length > 1 && (Z = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2);
        } else if (!j) if (h || x) {
            try {
                p = new URL(".", _e).href;
            } catch  {}
            if (!(globalThis.window || globalThis.WorkerGlobalScope)) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
            x && (ee = (e)=>{
                var r = new XMLHttpRequest;
                return r.open("GET", e, !1), r.responseType = "arraybuffer", r.send(null), new Uint8Array(r.response);
            }), le = async (e)=>{
                if (b(e)) return new Promise((t, o)=>{
                    var i = new XMLHttpRequest;
                    i.open("GET", e, !0), i.responseType = "arraybuffer", i.onload = ()=>{
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
        var de = console.log.bind(console), R = console.error.bind(console);
        c(!j, "shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.");
        var ce;
        globalThis.WebAssembly || R("no native wasm support detected");
        var ue = !1;
        function c(e, r) {
            e || F("Assertion failed" + (r ? ": " + r : ""));
        }
        var b = (e)=>e.startsWith("file://");
        function Ie() {
            var e = wr();
            c((e & 3) == 0), e == 0 && (e += 4), E[e >> 2] = 34821223, E[e + 4 >> 2] = 2310721022, E[0] = 1668509029;
        }
        function fe() {
            if (!ue) {
                var e = wr();
                e == 0 && (e += 4);
                var r = E[e >> 2], t = E[e + 4 >> 2];
                (r != 34821223 || t != 2310721022) && F(`Stack overflow! Stack cookie has been overwritten at ${$(e)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${$(t)} ${$(r)}`), E[0] != 1668509029 && F("Runtime error: The application has corrupted its heap memory area (address zero)!");
            }
        }
        (()=>{
            var e = new Int16Array(1), r = new Int8Array(e.buffer);
            e[0] = 25459, (r[0] !== 115 || r[1] !== 99) && F("Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)");
        })();
        function re(e) {
            Object.getOwnPropertyDescriptor(d, e) || Object.defineProperty(d, e, {
                configurable: !0,
                set () {
                    F(`Attempt to set \`Module.${e}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`);
                }
            });
        }
        function k(e) {
            return ()=>c(!1, `call to '${e}' via reference taken before Wasm module initialization`);
        }
        function Le(e) {
            Object.getOwnPropertyDescriptor(d, e) && F(`\`Module.${e}\` was supplied but \`${e}\` not included in INCOMING_MODULE_JS_API`);
        }
        function Be(e) {
            return e === "FS_createPath" || e === "FS_createDataFile" || e === "FS_createPreloadedFile" || e === "FS_preloadFile" || e === "FS_unlink" || e === "addRunDependency" || e === "FS_createLazyFile" || e === "FS_createDevice" || e === "removeRunDependency";
        }
        function ze(e) {
            Ee(e);
        }
        function Ee(e) {
            Object.getOwnPropertyDescriptor(d, e) || Object.defineProperty(d, e, {
                configurable: !0,
                get () {
                    var r = `'${e}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
                    Be(e) && (r += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"), F(r);
                }
            });
        }
        var ge, ye, I, G, me, E, C, te = !1;
        function ve() {
            var e = _r.buffer;
            I = new Int8Array(e), d.HEAPU8 = G = new Uint8Array(e), me = new Int32Array(e), d.HEAPU32 = E = new Uint32Array(e), d.HEAPF64 = new Float64Array(e), C = new BigInt64Array(e), new BigUint64Array(e);
        }
        c(globalThis.Int32Array && globalThis.Float64Array && Int32Array.prototype.subarray && Int32Array.prototype.set, "JS engine does not provide full typed array support");
        function ar() {
            if (d.preRun) for(typeof d.preRun == "function" && (d.preRun = [
                d.preRun
            ]); d.preRun.length;)Ge(d.preRun.shift());
            re("preRun"), ur(Se);
        }
        function Er() {
            c(!te), te = !0, fe(), !d.noFSInit && !n.initialized && n.init(), Me.__wasm_call_ctors(), n.ignorePermissions = !1;
        }
        function sr() {
            if (fe(), d.postRun) for(typeof d.postRun == "function" && (d.postRun = [
                d.postRun
            ]); d.postRun.length;)fr(d.postRun.shift());
            re("postRun"), ur(je);
        }
        function F(e) {
            d.onAbort?.(e), e = "Aborted(" + e + ")", R(e), ue = !0;
            var r = new WebAssembly.RuntimeError(e);
            throw ye?.(r), r;
        }
        function A(e, r) {
            return (...t)=>{
                c(te, `native function \`${e}\` called before runtime initialization`);
                var o = Me[e];
                return c(o, `exported native function \`${e}\` not found`), c(t.length <= r, `native function \`${e}\` called with ${t.length} args but expects ${r}`), o(...t);
            };
        }
        var we;
        function gr() {
            return d.locateFile ? Q("deform.wasm") : new URL("" + new URL("deform-BLaVg75W.wasm", import.meta.url).href, import.meta.url).href;
        }
        function lr(e) {
            if (e == we && ce) return new Uint8Array(ce);
            if (ee) return ee(e);
            throw "both async and sync fetching of the wasm failed";
        }
        async function dr(e) {
            if (!ce) try {
                var r = await le(e);
                return new Uint8Array(r);
            } catch  {}
            return lr(e);
        }
        async function He(e, r) {
            try {
                var t = await dr(e), o = await WebAssembly.instantiate(t, r);
                return o;
            } catch (i) {
                R(`failed to asynchronously prepare wasm: ${i}`), b(e) && R(`warning: Loading from a file URI (${e}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`), F(i);
            }
        }
        async function xe(e, r, t) {
            if (!e && !b(r) && !H) try {
                var o = fetch(r, {
                    credentials: "same-origin"
                }), i = await WebAssembly.instantiateStreaming(o, t);
                return i;
            } catch (a) {
                R(`wasm streaming compile failed: ${a}`), R("falling back to ArrayBuffer instantiation");
            }
            return He(r, t);
        }
        function We() {
            var e = {
                env: Nr,
                wasi_snapshot_preview1: Nr
            };
            return e;
        }
        async function cr() {
            function e(s, l) {
                return Me = s.exports, Zr(Me), ve(), Me;
            }
            var r = d;
            function t(s) {
                return c(d === r, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?"), r = null, e(s.instance);
            }
            var o = We();
            if (d.instantiateWasm) return new Promise((s, l)=>{
                try {
                    d.instantiateWasm(o, (u, m)=>{
                        s(e(u, m));
                    });
                } catch (u) {
                    R(`Module.instantiateWasm callback failed with error: ${u}`), l(u);
                }
            });
            we ??= gr();
            var i = await xe(ce, we, o), a = t(i);
            return a;
        }
        var ur = (e)=>{
            for(; e.length > 0;)e.shift()(d);
        }, je = [], fr = (e)=>je.push(e), Se = [], Ge = (e)=>Se.push(e), $ = (e)=>(c(typeof e == "number", `ptrToString expects a number, got ${typeof e}`), e >>>= 0, "0x" + e.toString(16).padStart(8, "0")), ne = (e)=>{
            ne.shown ||= {}, ne.shown[e] || (ne.shown[e] = 1, H && (e = "warning: " + e), R(e));
        }, $e = globalThis.TextDecoder && new TextDecoder, Ve = (e, r, t, o)=>{
            for(var i = r + t; e[r] && !(r >= i);)++r;
            return r;
        }, V = (e, r = 0, t, o)=>{
            var i = Ve(e, r, t);
            if (i - r > 16 && e.buffer && $e) return $e.decode(e.subarray(r, i));
            for(var a = ""; r < i;){
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
                var u = e[r++] & 63;
                if ((s & 240) == 224 ? s = (s & 15) << 12 | l << 6 | u : ((s & 248) != 240 && ne("Invalid UTF-8 leading byte " + $(s) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!"), s = (s & 7) << 18 | l << 12 | u << 6 | e[r++] & 63), s < 65536) a += String.fromCharCode(s);
                else {
                    var m = s - 65536;
                    a += String.fromCharCode(55296 | m >> 10, 56320 | m & 1023);
                }
            }
            return a;
        }, X = (e, r, t)=>(c(typeof e == "number", `UTF8ToString expects a number (got ${typeof e})`), e ? V(G, e, r) : ""), qe = (e, r, t, o)=>F(`Assertion failed: ${X(e)}, at: ` + [
                r ? X(r) : "unknown filename",
                t,
                o ? X(o) : "unknown function"
            ]);
        class Ke {
            constructor(r){
                this.excPtr = r, this.ptr = r - 24;
            }
            set_type(r) {
                E[this.ptr + 4 >> 2] = r;
            }
            get_type() {
                return E[this.ptr + 4 >> 2];
            }
            set_destructor(r) {
                E[this.ptr + 8 >> 2] = r;
            }
            get_destructor() {
                return E[this.ptr + 8 >> 2];
            }
            set_caught(r) {
                r = r ? 1 : 0, I[this.ptr + 12] = r;
            }
            get_caught() {
                return I[this.ptr + 12] != 0;
            }
            set_rethrown(r) {
                r = r ? 1 : 0, I[this.ptr + 13] = r;
            }
            get_rethrown() {
                return I[this.ptr + 13] != 0;
            }
            init(r, t) {
                this.set_adjusted_ptr(0), this.set_type(r), this.set_destructor(t);
            }
            set_adjusted_ptr(r) {
                E[this.ptr + 16 >> 2] = r;
            }
            get_adjusted_ptr() {
                return E[this.ptr + 16 >> 2];
            }
        }
        var Ye = (e, r, t)=>{
            var o = new Ke(e);
            o.init(r, t), c(!1, "Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.");
        }, Xe = ()=>F("native code called abort()"), Fe = (e, r, t, o)=>{
            if (c(typeof e == "string", `stringToUTF8Array expects a string (got ${typeof e})`), !(o > 0)) return 0;
            for(var i = t, a = t + o - 1, s = 0; s < e.length; ++s){
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
                    l > 1114111 && ne("Invalid Unicode code point " + $(l) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF)."), r[t++] = 240 | l >> 18, r[t++] = 128 | l >> 12 & 63, r[t++] = 128 | l >> 6 & 63, r[t++] = 128 | l & 63, s++;
                }
            }
            return r[t] = 0, t - i;
        }, q = (e, r, t)=>(c(typeof t == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!"), Fe(e, G, r, t)), J = (e)=>{
            for(var r = 0, t = 0; t < e.length; ++t){
                var o = e.charCodeAt(t);
                o <= 127 ? r++ : o <= 2047 ? r += 2 : o >= 55296 && o <= 57343 ? (r += 4, ++t) : r += 3;
            }
            return r;
        }, ke = (e, r, t, o)=>{
            var i = new Date().getFullYear(), a = new Date(i, 0, 1), s = new Date(i, 6, 1), l = a.getTimezoneOffset(), u = s.getTimezoneOffset(), m = Math.max(l, u);
            E[e >> 2] = m * 60, me[r >> 2] = +(l != u);
            var y = (g)=>{
                var T = g >= 0 ? "-" : "+", B = Math.abs(g), z = String(Math.floor(B / 60)).padStart(2, "0"), L = String(B % 60).padStart(2, "0");
                return `UTC${T}${z}${L}`;
            }, S = y(l), v = y(u);
            c(S), c(v), c(J(S) <= 16, `timezone name truncated to fit in TZNAME_MAX (${S})`), c(J(v) <= 16, `timezone name truncated to fit in TZNAME_MAX (${v})`), u < l ? (q(S, t, 17), q(v, o, 17)) : (q(S, o, 17), q(v, t, 17));
        }, Je = ()=>performance.now(), Pe = ()=>Date.now(), Ze = (e)=>e >= 0 && e <= 3, Qe = 9007199254740992, Ae = -9007199254740992, er = (e)=>e < Ae || e > Qe ? NaN : Number(e);
        function oe(e, r, t) {
            if (!Ze(e)) return 28;
            var o;
            e === 0 ? o = Pe() : o = Je();
            var i = Math.round(o * 1e3 * 1e3);
            return C[t >> 3] = BigInt(i), 0;
        }
        var be = ()=>2147483648, mr = (e, r)=>(c(r, "alignment argument is required"), Math.ceil(e / r) * r), vr = (e)=>{
            var r = _r.buffer.byteLength, t = (e - r + 65535) / 65536 | 0;
            try {
                return _r.grow(t), ve(), 1;
            } catch (o) {
                R(`growMemory: Attempted to grow heap from ${r} bytes to ${e} bytes, but got error: ${o}`);
            }
        }, hr = (e)=>{
            var r = G.length;
            e >>>= 0, c(e > r);
            var t = be();
            if (e > t) return R(`Cannot enlarge memory, requested ${e} bytes, but the limit is ${t} bytes!`), !1;
            for(var o = 1; o <= 4; o *= 2){
                var i = r * (1 + .2 / o);
                i = Math.min(i, e + 100663296);
                var a = Math.min(t, mr(Math.max(e, i), 65536)), s = vr(a);
                if (s) return !0;
            }
            return R(`Failed to grow the heap from ${r} bytes to ${a} bytes, not enough memory!`), !1;
        }, Te = {}, pr = ()=>Z || "./this.program", ie = ()=>{
            if (!ie.strings) {
                var e = (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8", r = {
                    USER: "web_user",
                    LOGNAME: "web_user",
                    PATH: "/",
                    PWD: "/",
                    HOME: "/home/web_user",
                    LANG: e,
                    _: pr()
                };
                for(var t in Te)Te[t] === void 0 ? delete r[t] : r[t] = Te[t];
                var o = [];
                for(var t in r)o.push(`${t}=${r[t]}`);
                ie.strings = o;
            }
            return ie.strings;
        }, rr = (e, r)=>{
            var t = 0, o = 0;
            for (var i of ie()){
                var a = r + t;
                E[e + o >> 2] = a, t += q(i, a, 1 / 0) + 1, o += 4;
            }
            return 0;
        }, tr = (e, r)=>{
            var t = ie();
            E[e >> 2] = t.length;
            var o = 0;
            for (var i of t)o += J(i) + 1;
            return E[r >> 2] = o, 0;
        }, w = {
            isAbs: (e)=>e.charAt(0) === "/",
            splitPath: (e)=>{
                var r = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                return r.exec(e).slice(1);
            },
            normalizeArray: (e, r)=>{
                for(var t = 0, o = e.length - 1; o >= 0; o--){
                    var i = e[o];
                    i === "." ? e.splice(o, 1) : i === ".." ? (e.splice(o, 1), t++) : t && (e.splice(o, 1), t--);
                }
                if (r) for(; t; t--)e.unshift("..");
                return e;
            },
            normalize: (e)=>{
                var r = w.isAbs(e), t = e.slice(-1) === "/";
                return e = w.normalizeArray(e.split("/").filter((o)=>!!o), !r).join("/"), !e && !r && (e = "."), e && t && (e += "/"), (r ? "/" : "") + e;
            },
            dirname: (e)=>{
                var r = w.splitPath(e), t = r[0], o = r[1];
                return !t && !o ? "." : (o && (o = o.slice(0, -1)), t + o);
            },
            basename: (e)=>e && e.match(/([^\/]+|\/)\/*$/)[1],
            join: (...e)=>w.normalize(e.join("/")),
            join2: (e, r)=>w.normalize(e + "/" + r)
        }, P = ()=>{
            if (H) {
                var e = Y("crypto");
                return (r)=>e.randomFillSync(r);
            }
            return (r)=>crypto.getRandomValues(r);
        }, M = (e)=>{
            (M = P())(e);
        }, ae = {
            resolve: (...e)=>{
                for(var r = "", t = !1, o = e.length - 1; o >= -1 && !t; o--){
                    var i = o >= 0 ? e[o] : n.cwd();
                    if (typeof i != "string") throw new TypeError("Arguments to path.resolve must be strings");
                    if (!i) return "";
                    r = i + "/" + r, t = w.isAbs(i);
                }
                return r = w.normalizeArray(r.split("/").filter((a)=>!!a), !t).join("/"), (t ? "/" : "") + r || ".";
            },
            relative: (e, r)=>{
                e = ae.resolve(e).slice(1), r = ae.resolve(r).slice(1);
                function t(m) {
                    for(var y = 0; y < m.length && m[y] === ""; y++);
                    for(var S = m.length - 1; S >= 0 && m[S] === ""; S--);
                    return y > S ? [] : m.slice(y, S - y + 1);
                }
                for(var o = t(e.split("/")), i = t(r.split("/")), a = Math.min(o.length, i.length), s = a, l = 0; l < a; l++)if (o[l] !== i[l]) {
                    s = l;
                    break;
                }
                for(var u = [], l = s; l < o.length; l++)u.push("..");
                return u = u.concat(i.slice(s)), u.join("/");
            }
        }, Re = [], Ne = (e, r, t)=>{
            var o = J(e) + 1, i = new Array(o), a = Fe(e, i, 0, i.length);
            return i.length = a, i;
        }, Dr = ()=>{
            if (!Re.length) {
                var e = null;
                if (H) {
                    var r = 256, t = Buffer.alloc(r), o = 0, i = process.stdin.fd;
                    try {
                        o = Ue.readSync(i, t, 0, r);
                    } catch (a) {
                        if (a.toString().includes("EOF")) o = 0;
                        else throw a;
                    }
                    o > 0 && (e = t.slice(0, o).toString("utf-8"));
                } else globalThis.window?.prompt && (e = window.prompt("Input: "), e !== null && (e += `
`));
                if (!e) return null;
                Re = Ne(e);
            }
            return Re.shift();
        }, he = {
            ttys: [],
            init () {},
            shutdown () {},
            register (e, r) {
                he.ttys[e] = {
                    input: [],
                    output: [],
                    ops: r
                }, n.registerDevice(e, he.stream_ops);
            },
            stream_ops: {
                open (e) {
                    var r = he.ttys[e.node.rdev];
                    if (!r) throw new n.ErrnoError(43);
                    e.tty = r, e.seekable = !1;
                },
                close (e) {
                    e.tty.ops.fsync(e.tty);
                },
                fsync (e) {
                    e.tty.ops.fsync(e.tty);
                },
                read (e, r, t, o, i) {
                    if (!e.tty || !e.tty.ops.get_char) throw new n.ErrnoError(60);
                    for(var a = 0, s = 0; s < o; s++){
                        var l;
                        try {
                            l = e.tty.ops.get_char(e.tty);
                        } catch  {
                            throw new n.ErrnoError(29);
                        }
                        if (l === void 0 && a === 0) throw new n.ErrnoError(6);
                        if (l == null) break;
                        a++, r[t + s] = l;
                    }
                    return a && (e.node.atime = Date.now()), a;
                },
                write (e, r, t, o, i) {
                    if (!e.tty || !e.tty.ops.put_char) throw new n.ErrnoError(60);
                    try {
                        for(var a = 0; a < o; a++)e.tty.ops.put_char(e.tty, r[t + a]);
                    } catch  {
                        throw new n.ErrnoError(29);
                    }
                    return o && (e.node.mtime = e.node.ctime = Date.now()), a;
                }
            },
            default_tty_ops: {
                get_char (e) {
                    return Dr();
                },
                put_char (e, r) {
                    r === null || r === 10 ? (de(V(e.output)), e.output = []) : r != 0 && e.output.push(r);
                },
                fsync (e) {
                    e.output?.length > 0 && (de(V(e.output)), e.output = []);
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
                    r === null || r === 10 ? (R(V(e.output)), e.output = []) : r != 0 && e.output.push(r);
                },
                fsync (e) {
                    e.output?.length > 0 && (R(V(e.output)), e.output = []);
                }
            }
        }, Fr = (e)=>{
            F("internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported");
        }, _ = {
            ops_table: null,
            mount (e) {
                return _.createNode(null, "/", 16895, 0);
            },
            createNode (e, r, t, o) {
                if (n.isBlkdev(t) || n.isFIFO(t)) throw new n.ErrnoError(63);
                _.ops_table ||= {
                    dir: {
                        node: {
                            getattr: _.node_ops.getattr,
                            setattr: _.node_ops.setattr,
                            lookup: _.node_ops.lookup,
                            mknod: _.node_ops.mknod,
                            rename: _.node_ops.rename,
                            unlink: _.node_ops.unlink,
                            rmdir: _.node_ops.rmdir,
                            readdir: _.node_ops.readdir,
                            symlink: _.node_ops.symlink
                        },
                        stream: {
                            llseek: _.stream_ops.llseek
                        }
                    },
                    file: {
                        node: {
                            getattr: _.node_ops.getattr,
                            setattr: _.node_ops.setattr
                        },
                        stream: {
                            llseek: _.stream_ops.llseek,
                            read: _.stream_ops.read,
                            write: _.stream_ops.write,
                            mmap: _.stream_ops.mmap,
                            msync: _.stream_ops.msync
                        }
                    },
                    link: {
                        node: {
                            getattr: _.node_ops.getattr,
                            setattr: _.node_ops.setattr,
                            readlink: _.node_ops.readlink
                        },
                        stream: {}
                    },
                    chrdev: {
                        node: {
                            getattr: _.node_ops.getattr,
                            setattr: _.node_ops.setattr
                        },
                        stream: n.chrdev_stream_ops
                    }
                };
                var i = n.createNode(e, r, t, o);
                return n.isDir(i.mode) ? (i.node_ops = _.ops_table.dir.node, i.stream_ops = _.ops_table.dir.stream, i.contents = {}) : n.isFile(i.mode) ? (i.node_ops = _.ops_table.file.node, i.stream_ops = _.ops_table.file.stream, i.usedBytes = 0, i.contents = null) : n.isLink(i.mode) ? (i.node_ops = _.ops_table.link.node, i.stream_ops = _.ops_table.link.stream) : n.isChrdev(i.mode) && (i.node_ops = _.ops_table.chrdev.node, i.stream_ops = _.ops_table.chrdev.stream), i.atime = i.mtime = i.ctime = Date.now(), e && (e.contents[r] = i, e.atime = e.mtime = e.ctime = i.atime), i;
            },
            getFileDataAsTypedArray (e) {
                return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0);
            },
            expandFileStorage (e, r) {
                var t = e.contents ? e.contents.length : 0;
                if (!(t >= r)) {
                    var o = 1024 * 1024;
                    r = Math.max(r, t * (t < o ? 2 : 1.125) >>> 0), t != 0 && (r = Math.max(r, 256));
                    var i = e.contents;
                    e.contents = new Uint8Array(r), e.usedBytes > 0 && e.contents.set(i.subarray(0, e.usedBytes), 0);
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
                    return r.dev = n.isChrdev(e.mode) ? e.id : 1, r.ino = e.id, r.mode = e.mode, r.nlink = 1, r.uid = 0, r.gid = 0, r.rdev = e.rdev, n.isDir(e.mode) ? r.size = 4096 : n.isFile(e.mode) ? r.size = e.usedBytes : n.isLink(e.mode) ? r.size = e.link.length : r.size = 0, r.atime = new Date(e.atime), r.mtime = new Date(e.mtime), r.ctime = new Date(e.ctime), r.blksize = 4096, r.blocks = Math.ceil(r.size / r.blksize), r;
                },
                setattr (e, r) {
                    for (const t of [
                        "mode",
                        "atime",
                        "mtime",
                        "ctime"
                    ])r[t] != null && (e[t] = r[t]);
                    r.size !== void 0 && _.resizeFileStorage(e, r.size);
                },
                lookup (e, r) {
                    throw new n.ErrnoError(44);
                },
                mknod (e, r, t, o) {
                    return _.createNode(e, r, t, o);
                },
                rename (e, r, t) {
                    var o;
                    try {
                        o = n.lookupNode(r, t);
                    } catch  {}
                    if (o) {
                        if (n.isDir(e.mode)) for(var i in o.contents)throw new n.ErrnoError(55);
                        n.hashRemoveNode(o);
                    }
                    delete e.parent.contents[e.name], r.contents[t] = e, e.name = t, r.ctime = r.mtime = e.parent.ctime = e.parent.mtime = Date.now();
                },
                unlink (e, r) {
                    delete e.contents[r], e.ctime = e.mtime = Date.now();
                },
                rmdir (e, r) {
                    var t = n.lookupNode(e, r);
                    for(var o in t.contents)throw new n.ErrnoError(55);
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
                    var o = _.createNode(e, r, 41471, 0);
                    return o.link = t, o;
                },
                readlink (e) {
                    if (!n.isLink(e.mode)) throw new n.ErrnoError(28);
                    return e.link;
                }
            },
            stream_ops: {
                read (e, r, t, o, i) {
                    var a = e.node.contents;
                    if (i >= e.node.usedBytes) return 0;
                    var s = Math.min(e.node.usedBytes - i, o);
                    if (c(s >= 0), s > 8 && a.subarray) r.set(a.subarray(i, i + s), t);
                    else for(var l = 0; l < s; l++)r[t + l] = a[i + l];
                    return s;
                },
                write (e, r, t, o, i, a) {
                    if (c(!(r instanceof ArrayBuffer)), r.buffer === I.buffer && (a = !1), !o) return 0;
                    var s = e.node;
                    if (s.mtime = s.ctime = Date.now(), r.subarray && (!s.contents || s.contents.subarray)) {
                        if (a) return c(i === 0, "canOwn must imply no weird position inside the file"), s.contents = r.subarray(t, t + o), s.usedBytes = o, o;
                        if (s.usedBytes === 0 && i === 0) return s.contents = r.slice(t, t + o), s.usedBytes = o, o;
                        if (i + o <= s.usedBytes) return s.contents.set(r.subarray(t, t + o), i), o;
                    }
                    if (_.expandFileStorage(s, i + o), s.contents.subarray && r.subarray) s.contents.set(r.subarray(t, t + o), i);
                    else for(var l = 0; l < o; l++)s.contents[i + l] = r[t + l];
                    return s.usedBytes = Math.max(s.usedBytes, i + o), o;
                },
                llseek (e, r, t) {
                    var o = r;
                    if (t === 1 ? o += e.position : t === 2 && n.isFile(e.node.mode) && (o += e.node.usedBytes), o < 0) throw new n.ErrnoError(28);
                    return o;
                },
                mmap (e, r, t, o, i) {
                    if (!n.isFile(e.node.mode)) throw new n.ErrnoError(43);
                    var a, s, l = e.node.contents;
                    if (!(i & 2) && l && l.buffer === I.buffer) s = !1, a = l.byteOffset;
                    else {
                        if (s = !0, a = Fr(), !a) throw new n.ErrnoError(48);
                        l && ((t > 0 || t + r < l.length) && (l.subarray ? l = l.subarray(t, t + r) : l = Array.prototype.slice.call(l, t, t + r)), I.set(l, a));
                    }
                    return {
                        ptr: a,
                        allocated: s
                    };
                },
                msync (e, r, t, o, i) {
                    return _.stream_ops.write(e, r, 0, o, t, !1), 0;
                }
            }
        }, Cr = (e)=>{
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
        }, yr = (e, r)=>{
            var t = 0;
            return e && (t |= 365), r && (t |= 146), t;
        }, Ur = (e)=>X(Tr(e)), kr = {
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
        }, Ir = async (e)=>{
            var r = await le(e);
            return c(r, `Loading data file "${e}" failed (no arrayBuffer).`), new Uint8Array(r);
        }, Lr = (...e)=>n.createDataFile(...e), Br = (e)=>{
            for(var r = e;;){
                if (!Oe[e]) return e;
                e = r + Math.random();
            }
        }, pe = 0, nr = null, Oe = {}, se = null, zr = (e)=>{
            if (pe--, d.monitorRunDependencies?.(pe), c(e, "removeRunDependency requires an ID"), c(Oe[e]), delete Oe[e], pe == 0 && (se !== null && (clearInterval(se), se = null), nr)) {
                var r = nr;
                nr = null, r();
            }
        }, Hr = (e)=>{
            pe++, d.monitorRunDependencies?.(pe), c(e, "addRunDependency requires an ID"), c(!Oe[e]), Oe[e] = 1, se === null && globalThis.setInterval && (se = setInterval(()=>{
                if (ue) {
                    clearInterval(se), se = null;
                    return;
                }
                var r = !1;
                for(var t in Oe)r || (r = !0, R("still waiting on run dependencies:")), R(`dependency: ${t}`);
                r && R("(end of list)");
            }, 1e4), se.unref?.());
        }, Pr = [], xr = async (e, r)=>{
            typeof Browser < "u" && Browser.init();
            for (var t of Pr)if (t.canHandle(r)) return c(t.handle.constructor.name === "AsyncFunction", "Filesystem plugin handlers must be async functions (See #24914)"), t.handle(e, r);
            return e;
        }, Ar = async (e, r, t, o, i, a, s, l)=>{
            var u = r ? ae.resolve(w.join2(e, r)) : e, m = Br(`cp ${u}`);
            Hr(m);
            try {
                var y = t;
                typeof t == "string" && (y = await Ir(t)), y = await xr(y, u), l?.(), a || Lr(e, r, y, o, i, s);
            } finally{
                zr(m);
            }
        }, Wr = (e, r, t, o, i, a, s, l, u, m)=>{
            Ar(e, r, t, o, i, l, u, m).then(a).catch(s);
        }, n = {
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
                    super(te ? Ur(e) : ""), this.errno = e;
                    for(var r in kr)if (kr[r] === e) {
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
                constructor(e, r, t, o){
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
            lookupPath (e, r = {}) {
                if (!e) throw new n.ErrnoError(44);
                r.follow_mount ??= !0, w.isAbs(e) || (e = n.cwd() + "/" + e);
                e: for(var t = 0; t < 40; t++){
                    for(var o = e.split("/").filter((m)=>!!m), i = n.root, a = "/", s = 0; s < o.length; s++){
                        var l = s === o.length - 1;
                        if (l && r.parent) break;
                        if (o[s] !== ".") {
                            if (o[s] === "..") {
                                if (a = w.dirname(a), n.isRoot(i)) {
                                    e = a + "/" + o.slice(s + 1).join("/"), t--;
                                    continue e;
                                } else i = i.parent;
                                continue;
                            }
                            a = w.join2(a, o[s]);
                            try {
                                i = n.lookupNode(i, o[s]);
                            } catch (m) {
                                if (m?.errno === 44 && l && r.noent_okay) return {
                                    path: a
                                };
                                throw m;
                            }
                            if (n.isMountpoint(i) && (!l || r.follow_mount) && (i = i.mounted.root), n.isLink(i.mode) && (!l || r.follow)) {
                                if (!i.node_ops.readlink) throw new n.ErrnoError(52);
                                var u = i.node_ops.readlink(i);
                                w.isAbs(u) || (u = w.dirname(a) + "/" + u), e = u + "/" + o.slice(s + 1).join("/");
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
            getPath (e) {
                for(var r;;){
                    if (n.isRoot(e)) {
                        var t = e.mount.mountpoint;
                        return r ? t[t.length - 1] !== "/" ? `${t}/${r}` : t + r : t;
                    }
                    r = r ? `${e.name}/${r}` : e.name, e = e.parent;
                }
            },
            hashName (e, r) {
                for(var t = 0, o = 0; o < r.length; o++)t = (t << 5) - t + r.charCodeAt(o) | 0;
                return (e + t >>> 0) % n.nameTable.length;
            },
            hashAddNode (e) {
                var r = n.hashName(e.parent.id, e.name);
                e.name_next = n.nameTable[r], n.nameTable[r] = e;
            },
            hashRemoveNode (e) {
                var r = n.hashName(e.parent.id, e.name);
                if (n.nameTable[r] === e) n.nameTable[r] = e.name_next;
                else for(var t = n.nameTable[r]; t;){
                    if (t.name_next === e) {
                        t.name_next = e.name_next;
                        break;
                    }
                    t = t.name_next;
                }
            },
            lookupNode (e, r) {
                var t = n.mayLookup(e);
                if (t) throw new n.ErrnoError(t);
                for(var o = n.hashName(e.id, r), i = n.nameTable[o]; i; i = i.name_next){
                    var a = i.name;
                    if (i.parent.id === e.id && a === r) return i;
                }
                return n.lookup(e, r);
            },
            createNode (e, r, t, o) {
                c(typeof e == "object");
                var i = new n.FSNode(e, r, t, o);
                return n.hashAddNode(i), i;
            },
            destroyNode (e) {
                n.hashRemoveNode(e);
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
                return n.ignorePermissions ? 0 : r.includes("r") && !(e.mode & 292) || r.includes("w") && !(e.mode & 146) || r.includes("x") && !(e.mode & 73) ? 2 : 0;
            },
            mayLookup (e) {
                if (!n.isDir(e.mode)) return 54;
                var r = n.nodePermissions(e, "x");
                return r || (e.node_ops.lookup ? 0 : 2);
            },
            mayCreate (e, r) {
                if (!n.isDir(e.mode)) return 54;
                try {
                    var t = n.lookupNode(e, r);
                    return 20;
                } catch  {}
                return n.nodePermissions(e, "wx");
            },
            mayDelete (e, r, t) {
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
            mayOpen (e, r) {
                return e ? n.isLink(e.mode) ? 32 : n.isDir(e.mode) && (n.flagsToPermissionString(r) !== "r" || r & 576) ? 31 : n.nodePermissions(e, n.flagsToPermissionString(r)) : 44;
            },
            checkOpExists (e, r) {
                if (!e) throw new n.ErrnoError(r);
                return e;
            },
            MAX_OPEN_FDS: 4096,
            nextfd () {
                for(var e = 0; e <= n.MAX_OPEN_FDS; e++)if (!n.streams[e]) return e;
                throw new n.ErrnoError(33);
            },
            getStreamChecked (e) {
                var r = n.getStream(e);
                if (!r) throw new n.ErrnoError(8);
                return r;
            },
            getStream: (e)=>n.streams[e],
            createStream (e, r = -1) {
                return c(r >= -1), e = Object.assign(new n.FSStream, e), r == -1 && (r = n.nextfd()), e.fd = r, n.streams[r] = e, e;
            },
            closeStream (e) {
                n.streams[e] = null;
            },
            dupStream (e, r = -1) {
                var t = n.createStream(e, r);
                return t.stream_ops?.dup?.(t), t;
            },
            doSetAttr (e, r, t) {
                var o = e?.stream_ops.setattr, i = o ? e : r;
                o ??= r.node_ops.setattr, n.checkOpExists(o, 63), o(i, t);
            },
            chrdev_stream_ops: {
                open (e) {
                    var r = n.getDevice(e.node.rdev);
                    e.stream_ops = r.stream_ops, e.stream_ops.open?.(e);
                },
                llseek () {
                    throw new n.ErrnoError(70);
                }
            },
            major: (e)=>e >> 8,
            minor: (e)=>e & 255,
            makedev: (e, r)=>e << 8 | r,
            registerDevice (e, r) {
                n.devices[e] = {
                    stream_ops: r
                };
            },
            getDevice: (e)=>n.devices[e],
            getMounts (e) {
                for(var r = [], t = [
                    e
                ]; t.length;){
                    var o = t.pop();
                    r.push(o), t.push(...o.mounts);
                }
                return r;
            },
            syncfs (e, r) {
                typeof e == "function" && (r = e, e = !1), n.syncFSRequests++, n.syncFSRequests > 1 && R(`warning: ${n.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
                var t = n.getMounts(n.root.mount), o = 0;
                function i(l) {
                    return c(n.syncFSRequests > 0), n.syncFSRequests--, r(l);
                }
                function a(l) {
                    if (l) return a.errored ? void 0 : (a.errored = !0, i(l));
                    ++o >= t.length && i(null);
                }
                for (var s of t)s.type.syncfs ? s.type.syncfs(s, e, a) : a(null);
            },
            mount (e, r, t) {
                if (typeof e == "string") throw e;
                var o = t === "/", i = !t, a;
                if (o && n.root) throw new n.ErrnoError(10);
                if (!o && !i) {
                    var s = n.lookupPath(t, {
                        follow_mount: !1
                    });
                    if (t = s.path, a = s.node, n.isMountpoint(a)) throw new n.ErrnoError(10);
                    if (!n.isDir(a.mode)) throw new n.ErrnoError(54);
                }
                var l = {
                    type: e,
                    opts: r,
                    mountpoint: t,
                    mounts: []
                }, u = e.mount(l);
                return u.mount = l, l.root = u, o ? n.root = u : a && (a.mounted = l, a.mount && a.mount.mounts.push(l)), u;
            },
            unmount (e) {
                var r = n.lookupPath(e, {
                    follow_mount: !1
                });
                if (!n.isMountpoint(r.node)) throw new n.ErrnoError(28);
                var t = r.node, o = t.mounted, i = n.getMounts(o);
                for (var [a, s] of Object.entries(n.nameTable))for(; s;){
                    var l = s.name_next;
                    i.includes(s.mount) && n.destroyNode(s), s = l;
                }
                t.mounted = null;
                var u = t.mount.mounts.indexOf(o);
                c(u !== -1), t.mount.mounts.splice(u, 1);
            },
            lookup (e, r) {
                return e.node_ops.lookup(e, r);
            },
            mknod (e, r, t) {
                var o = n.lookupPath(e, {
                    parent: !0
                }), i = o.node, a = w.basename(e);
                if (!a) throw new n.ErrnoError(28);
                if (a === "." || a === "..") throw new n.ErrnoError(20);
                var s = n.mayCreate(i, a);
                if (s) throw new n.ErrnoError(s);
                if (!i.node_ops.mknod) throw new n.ErrnoError(63);
                return i.node_ops.mknod(i, a, r, t);
            },
            statfs (e) {
                return n.statfsNode(n.lookupPath(e, {
                    follow: !0
                }).node);
            },
            statfsStream (e) {
                return n.statfsNode(e.node);
            },
            statfsNode (e) {
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
            create (e, r = 438) {
                return r &= 4095, r |= 32768, n.mknod(e, r, 0);
            },
            mkdir (e, r = 511) {
                return r &= 1023, r |= 16384, n.mknod(e, r, 0);
            },
            mkdirTree (e, r) {
                var t = e.split("/"), o = "";
                for (var i of t)if (i) {
                    (o || w.isAbs(e)) && (o += "/"), o += i;
                    try {
                        n.mkdir(o, r);
                    } catch (a) {
                        if (a.errno != 20) throw a;
                    }
                }
            },
            mkdev (e, r, t) {
                return typeof t > "u" && (t = r, r = 438), r |= 8192, n.mknod(e, r, t);
            },
            symlink (e, r) {
                if (!ae.resolve(e)) throw new n.ErrnoError(44);
                var t = n.lookupPath(r, {
                    parent: !0
                }), o = t.node;
                if (!o) throw new n.ErrnoError(44);
                var i = w.basename(r), a = n.mayCreate(o, i);
                if (a) throw new n.ErrnoError(a);
                if (!o.node_ops.symlink) throw new n.ErrnoError(63);
                return o.node_ops.symlink(o, i, e);
            },
            rename (e, r) {
                var t = w.dirname(e), o = w.dirname(r), i = w.basename(e), a = w.basename(r), s, l, u;
                if (s = n.lookupPath(e, {
                    parent: !0
                }), l = s.node, s = n.lookupPath(r, {
                    parent: !0
                }), u = s.node, !l || !u) throw new n.ErrnoError(44);
                if (l.mount !== u.mount) throw new n.ErrnoError(75);
                var m = n.lookupNode(l, i), y = ae.relative(e, o);
                if (y.charAt(0) !== ".") throw new n.ErrnoError(28);
                if (y = ae.relative(r, t), y.charAt(0) !== ".") throw new n.ErrnoError(55);
                var S;
                try {
                    S = n.lookupNode(u, a);
                } catch  {}
                if (m !== S) {
                    var v = n.isDir(m.mode), g = n.mayDelete(l, i, v);
                    if (g) throw new n.ErrnoError(g);
                    if (g = S ? n.mayDelete(u, a, v) : n.mayCreate(u, a), g) throw new n.ErrnoError(g);
                    if (!l.node_ops.rename) throw new n.ErrnoError(63);
                    if (n.isMountpoint(m) || S && n.isMountpoint(S)) throw new n.ErrnoError(10);
                    if (u !== l && (g = n.nodePermissions(l, "w"), g)) throw new n.ErrnoError(g);
                    n.hashRemoveNode(m);
                    try {
                        l.node_ops.rename(m, u, a), m.parent = u;
                    } catch (T) {
                        throw T;
                    } finally{
                        n.hashAddNode(m);
                    }
                }
            },
            rmdir (e) {
                var r = n.lookupPath(e, {
                    parent: !0
                }), t = r.node, o = w.basename(e), i = n.lookupNode(t, o), a = n.mayDelete(t, o, !0);
                if (a) throw new n.ErrnoError(a);
                if (!t.node_ops.rmdir) throw new n.ErrnoError(63);
                if (n.isMountpoint(i)) throw new n.ErrnoError(10);
                t.node_ops.rmdir(t, o), n.destroyNode(i);
            },
            readdir (e) {
                var r = n.lookupPath(e, {
                    follow: !0
                }), t = r.node, o = n.checkOpExists(t.node_ops.readdir, 54);
                return o(t);
            },
            unlink (e) {
                var r = n.lookupPath(e, {
                    parent: !0
                }), t = r.node;
                if (!t) throw new n.ErrnoError(44);
                var o = w.basename(e), i = n.lookupNode(t, o), a = n.mayDelete(t, o, !1);
                if (a) throw new n.ErrnoError(a);
                if (!t.node_ops.unlink) throw new n.ErrnoError(63);
                if (n.isMountpoint(i)) throw new n.ErrnoError(10);
                t.node_ops.unlink(t, o), n.destroyNode(i);
            },
            readlink (e) {
                var r = n.lookupPath(e), t = r.node;
                if (!t) throw new n.ErrnoError(44);
                if (!t.node_ops.readlink) throw new n.ErrnoError(28);
                return t.node_ops.readlink(t);
            },
            stat (e, r) {
                var t = n.lookupPath(e, {
                    follow: !r
                }), o = t.node, i = n.checkOpExists(o.node_ops.getattr, 63);
                return i(o);
            },
            fstat (e) {
                var r = n.getStreamChecked(e), t = r.node, o = r.stream_ops.getattr, i = o ? r : t;
                return o ??= t.node_ops.getattr, n.checkOpExists(o, 63), o(i);
            },
            lstat (e) {
                return n.stat(e, !0);
            },
            doChmod (e, r, t, o) {
                n.doSetAttr(e, r, {
                    mode: t & 4095 | r.mode & -4096,
                    ctime: Date.now(),
                    dontFollow: o
                });
            },
            chmod (e, r, t) {
                var o;
                if (typeof e == "string") {
                    var i = n.lookupPath(e, {
                        follow: !t
                    });
                    o = i.node;
                } else o = e;
                n.doChmod(null, o, r, t);
            },
            lchmod (e, r) {
                n.chmod(e, r, !0);
            },
            fchmod (e, r) {
                var t = n.getStreamChecked(e);
                n.doChmod(t, t.node, r, !1);
            },
            doChown (e, r, t) {
                n.doSetAttr(e, r, {
                    timestamp: Date.now(),
                    dontFollow: t
                });
            },
            chown (e, r, t, o) {
                var i;
                if (typeof e == "string") {
                    var a = n.lookupPath(e, {
                        follow: !o
                    });
                    i = a.node;
                } else i = e;
                n.doChown(null, i, o);
            },
            lchown (e, r, t) {
                n.chown(e, r, t, !0);
            },
            fchown (e, r, t) {
                var o = n.getStreamChecked(e);
                n.doChown(o, o.node, !1);
            },
            doTruncate (e, r, t) {
                if (n.isDir(r.mode)) throw new n.ErrnoError(31);
                if (!n.isFile(r.mode)) throw new n.ErrnoError(28);
                var o = n.nodePermissions(r, "w");
                if (o) throw new n.ErrnoError(o);
                n.doSetAttr(e, r, {
                    size: t,
                    timestamp: Date.now()
                });
            },
            truncate (e, r) {
                if (r < 0) throw new n.ErrnoError(28);
                var t;
                if (typeof e == "string") {
                    var o = n.lookupPath(e, {
                        follow: !0
                    });
                    t = o.node;
                } else t = e;
                n.doTruncate(null, t, r);
            },
            ftruncate (e, r) {
                var t = n.getStreamChecked(e);
                if (r < 0 || !(t.flags & 2097155)) throw new n.ErrnoError(28);
                n.doTruncate(t, t.node, r);
            },
            utime (e, r, t) {
                var o = n.lookupPath(e, {
                    follow: !0
                }), i = o.node, a = n.checkOpExists(i.node_ops.setattr, 63);
                a(i, {
                    atime: r,
                    mtime: t
                });
            },
            open (e, r, t = 438) {
                if (e === "") throw new n.ErrnoError(44);
                r = typeof r == "string" ? Cr(r) : r, r & 64 ? t = t & 4095 | 32768 : t = 0;
                var o, i;
                if (typeof e == "object") o = e;
                else {
                    i = e.endsWith("/");
                    var a = n.lookupPath(e, {
                        follow: !(r & 131072),
                        noent_okay: !0
                    });
                    o = a.node, e = a.path;
                }
                var s = !1;
                if (r & 64) if (o) {
                    if (r & 128) throw new n.ErrnoError(20);
                } else {
                    if (i) throw new n.ErrnoError(31);
                    o = n.mknod(e, t | 511, 0), s = !0;
                }
                if (!o) throw new n.ErrnoError(44);
                if (n.isChrdev(o.mode) && (r &= -513), r & 65536 && !n.isDir(o.mode)) throw new n.ErrnoError(54);
                if (!s) {
                    var l = n.mayOpen(o, r);
                    if (l) throw new n.ErrnoError(l);
                }
                r & 512 && !s && n.truncate(o, 0), r &= -131713;
                var u = n.createStream({
                    node: o,
                    path: n.getPath(o),
                    flags: r,
                    seekable: !0,
                    position: 0,
                    stream_ops: o.stream_ops,
                    ungotten: [],
                    error: !1
                });
                return u.stream_ops.open && u.stream_ops.open(u), s && n.chmod(o, t & 511), d.logReadFiles && !(r & 1) && (e in n.readFiles || (n.readFiles[e] = 1)), u;
            },
            close (e) {
                if (n.isClosed(e)) throw new n.ErrnoError(8);
                e.getdents && (e.getdents = null);
                try {
                    e.stream_ops.close && e.stream_ops.close(e);
                } catch (r) {
                    throw r;
                } finally{
                    n.closeStream(e.fd);
                }
                e.fd = null;
            },
            isClosed (e) {
                return e.fd === null;
            },
            llseek (e, r, t) {
                if (n.isClosed(e)) throw new n.ErrnoError(8);
                if (!e.seekable || !e.stream_ops.llseek) throw new n.ErrnoError(70);
                if (t != 0 && t != 1 && t != 2) throw new n.ErrnoError(28);
                return e.position = e.stream_ops.llseek(e, r, t), e.ungotten = [], e.position;
            },
            read (e, r, t, o, i) {
                if (c(t >= 0), o < 0 || i < 0) throw new n.ErrnoError(28);
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
            write (e, r, t, o, i, a) {
                if (c(t >= 0), o < 0 || i < 0) throw new n.ErrnoError(28);
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
            mmap (e, r, t, o, i) {
                if (o & 2 && !(i & 2) && (e.flags & 2097155) !== 2) throw new n.ErrnoError(2);
                if ((e.flags & 2097155) === 1) throw new n.ErrnoError(2);
                if (!e.stream_ops.mmap) throw new n.ErrnoError(43);
                if (!r) throw new n.ErrnoError(28);
                return e.stream_ops.mmap(e, r, t, o, i);
            },
            msync (e, r, t, o, i) {
                return c(t >= 0), e.stream_ops.msync ? e.stream_ops.msync(e, r, t, o, i) : 0;
            },
            ioctl (e, r, t) {
                if (!e.stream_ops.ioctl) throw new n.ErrnoError(59);
                return e.stream_ops.ioctl(e, r, t);
            },
            readFile (e, r = {}) {
                r.flags = r.flags || 0, r.encoding = r.encoding || "binary", r.encoding !== "utf8" && r.encoding !== "binary" && F(`Invalid encoding type "${r.encoding}"`);
                var t = n.open(e, r.flags), o = n.stat(e), i = o.size, a = new Uint8Array(i);
                return n.read(t, a, 0, i, 0), r.encoding === "utf8" && (a = V(a)), n.close(t), a;
            },
            writeFile (e, r, t = {}) {
                t.flags = t.flags || 577;
                var o = n.open(e, t.flags, t.mode);
                typeof r == "string" && (r = new Uint8Array(Ne(r))), ArrayBuffer.isView(r) ? n.write(o, r, 0, r.byteLength, void 0, t.canOwn) : F("Unsupported data type"), n.close(o);
            },
            cwd: ()=>n.currentPath,
            chdir (e) {
                var r = n.lookupPath(e, {
                    follow: !0
                });
                if (r.node === null) throw new n.ErrnoError(44);
                if (!n.isDir(r.node.mode)) throw new n.ErrnoError(54);
                var t = n.nodePermissions(r.node, "x");
                if (t) throw new n.ErrnoError(t);
                n.currentPath = r.path;
            },
            createDefaultDirectories () {
                n.mkdir("/tmp"), n.mkdir("/home"), n.mkdir("/home/web_user");
            },
            createDefaultDevices () {
                n.mkdir("/dev"), n.registerDevice(n.makedev(1, 3), {
                    read: ()=>0,
                    write: (o, i, a, s, l)=>s,
                    llseek: ()=>0
                }), n.mkdev("/dev/null", n.makedev(1, 3)), he.register(n.makedev(5, 0), he.default_tty_ops), he.register(n.makedev(6, 0), he.default_tty1_ops), n.mkdev("/dev/tty", n.makedev(5, 0)), n.mkdev("/dev/tty1", n.makedev(6, 0));
                var e = new Uint8Array(1024), r = 0, t = ()=>(r === 0 && (M(e), r = e.byteLength), e[--r]);
                n.createDevice("/dev", "random", t), n.createDevice("/dev", "urandom", t), n.mkdir("/dev/shm"), n.mkdir("/dev/shm/tmp");
            },
            createSpecialDirectories () {
                n.mkdir("/proc");
                var e = n.mkdir("/proc/self");
                n.mkdir("/proc/self/fd"), n.mount({
                    mount () {
                        var r = n.createNode(e, "fd", 16895, 73);
                        return r.stream_ops = {
                            llseek: _.stream_ops.llseek
                        }, r.node_ops = {
                            lookup (t, o) {
                                var i = +o, a = n.getStreamChecked(i), s = {
                                    parent: null,
                                    mount: {
                                        mountpoint: "fake"
                                    },
                                    node_ops: {
                                        readlink: ()=>a.path
                                    },
                                    id: i + 1
                                };
                                return s.parent = s, s;
                            },
                            readdir () {
                                return Array.from(n.streams.entries()).filter(([t, o])=>o).map(([t, o])=>t.toString());
                            }
                        }, r;
                    }
                }, {}, "/proc/self/fd");
            },
            createStandardStreams (e, r, t) {
                e ? n.createDevice("/dev", "stdin", e) : n.symlink("/dev/tty", "/dev/stdin"), r ? n.createDevice("/dev", "stdout", null, r) : n.symlink("/dev/tty", "/dev/stdout"), t ? n.createDevice("/dev", "stderr", null, t) : n.symlink("/dev/tty1", "/dev/stderr");
                var o = n.open("/dev/stdin", 0), i = n.open("/dev/stdout", 1), a = n.open("/dev/stderr", 1);
                c(o.fd === 0, `invalid handle for stdin (${o.fd})`), c(i.fd === 1, `invalid handle for stdout (${i.fd})`), c(a.fd === 2, `invalid handle for stderr (${a.fd})`);
            },
            staticInit () {
                n.nameTable = new Array(4096), n.mount(_, {}, "/"), n.createDefaultDirectories(), n.createDefaultDevices(), n.createSpecialDirectories(), n.filesystems = {
                    MEMFS: _
                };
            },
            init (e, r, t) {
                c(!n.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"), n.initialized = !0, e ??= d.stdin, r ??= d.stdout, t ??= d.stderr, n.createStandardStreams(e, r, t);
            },
            quit () {
                n.initialized = !1, br(0);
                for (var e of n.streams)e && n.close(e);
            },
            findObject (e, r) {
                var t = n.analyzePath(e, r);
                return t.exists ? t.object : null;
            },
            analyzePath (e, r) {
                try {
                    var t = n.lookupPath(e, {
                        follow: !r
                    });
                    e = t.path;
                } catch  {}
                var o = {
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
                    var t = n.lookupPath(e, {
                        parent: !0
                    });
                    o.parentExists = !0, o.parentPath = t.path, o.parentObject = t.node, o.name = w.basename(e), t = n.lookupPath(e, {
                        follow: !r
                    }), o.exists = !0, o.path = t.path, o.object = t.node, o.name = t.node.name, o.isRoot = t.path === "/";
                } catch (i) {
                    o.error = i.errno;
                }
                return o;
            },
            createPath (e, r, t, o) {
                e = typeof e == "string" ? e : n.getPath(e);
                for(var i = r.split("/").reverse(); i.length;){
                    var a = i.pop();
                    if (a) {
                        var s = w.join2(e, a);
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
            createFile (e, r, t, o, i) {
                var a = w.join2(typeof e == "string" ? e : n.getPath(e), r), s = yr(o, i);
                return n.create(a, s);
            },
            createDataFile (e, r, t, o, i, a) {
                var s = r;
                e && (e = typeof e == "string" ? e : n.getPath(e), s = r ? w.join2(e, r) : e);
                var l = yr(o, i), u = n.create(s, l);
                if (t) {
                    if (typeof t == "string") {
                        for(var m = new Array(t.length), y = 0, S = t.length; y < S; ++y)m[y] = t.charCodeAt(y);
                        t = m;
                    }
                    n.chmod(u, l | 146);
                    var v = n.open(u, 577);
                    n.write(v, t, 0, t.length, 0, a), n.close(v), n.chmod(u, l);
                }
            },
            createDevice (e, r, t, o) {
                var i = w.join2(typeof e == "string" ? e : n.getPath(e), r), a = yr(!!t, !!o);
                n.createDevice.major ??= 64;
                var s = n.makedev(n.createDevice.major++, 0);
                return n.registerDevice(s, {
                    open (l) {
                        l.seekable = !1;
                    },
                    close (l) {
                        o?.buffer?.length && o(10);
                    },
                    read (l, u, m, y, S) {
                        for(var v = 0, g = 0; g < y; g++){
                            var T;
                            try {
                                T = t();
                            } catch  {
                                throw new n.ErrnoError(29);
                            }
                            if (T === void 0 && v === 0) throw new n.ErrnoError(6);
                            if (T == null) break;
                            v++, u[m + g] = T;
                        }
                        return v && (l.node.atime = Date.now()), v;
                    },
                    write (l, u, m, y, S) {
                        for(var v = 0; v < y; v++)try {
                            o(u[m + v]);
                        } catch  {
                            throw new n.ErrnoError(29);
                        }
                        return y && (l.node.mtime = l.node.ctime = Date.now()), v;
                    }
                }), n.mkdev(i, a, s);
            },
            forceLoadFile (e) {
                if (e.isDevice || e.isFolder || e.link || e.contents) return !0;
                if (globalThis.XMLHttpRequest) F("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
                else try {
                    e.contents = ee(e.url);
                } catch  {
                    throw new n.ErrnoError(29);
                }
            },
            createLazyFile (e, r, t, o, i) {
                class a {
                    lengthKnown = !1;
                    chunks = [];
                    get(v) {
                        if (!(v > this.length - 1 || v < 0)) {
                            var g = v % this.chunkSize, T = v / this.chunkSize | 0;
                            return this.getter(T)[g];
                        }
                    }
                    setDataGetter(v) {
                        this.getter = v;
                    }
                    cacheLength() {
                        var v = new XMLHttpRequest;
                        v.open("HEAD", t, !1), v.send(null), v.status >= 200 && v.status < 300 || v.status === 304 || F("Couldn't load " + t + ". Status: " + v.status);
                        var g = Number(v.getResponseHeader("Content-length")), T, B = (T = v.getResponseHeader("Accept-Ranges")) && T === "bytes", z = (T = v.getResponseHeader("Content-Encoding")) && T === "gzip", L = 1024 * 1024;
                        B || (L = g);
                        var W = (K, De)=>{
                            K > De && F("invalid range (" + K + ", " + De + ") or no bytes requested!"), De > g - 1 && F("only " + g + " bytes available! programmer error!");
                            var D = new XMLHttpRequest;
                            return D.open("GET", t, !1), g !== L && D.setRequestHeader("Range", "bytes=" + K + "-" + De), D.responseType = "arraybuffer", D.overrideMimeType && D.overrideMimeType("text/plain; charset=x-user-defined"), D.send(null), D.status >= 200 && D.status < 300 || D.status === 304 || F("Couldn't load " + t + ". Status: " + D.status), D.response !== void 0 ? new Uint8Array(D.response || []) : Ne(D.responseText || "");
                        }, ir = this;
                        ir.setDataGetter((K)=>{
                            var De = K * L, D = (K + 1) * L - 1;
                            return D = Math.min(D, g - 1), typeof ir.chunks[K] > "u" && (ir.chunks[K] = W(De, D)), typeof ir.chunks[K] > "u" && F("doXHR failed!"), ir.chunks[K];
                        }), (z || !g) && (L = g = 1, g = this.getter(0).length, L = g, de("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = g, this._chunkSize = L, this.lengthKnown = !0;
                    }
                    get length() {
                        return this.lengthKnown || this.cacheLength(), this._length;
                    }
                    get chunkSize() {
                        return this.lengthKnown || this.cacheLength(), this._chunkSize;
                    }
                }
                if (globalThis.XMLHttpRequest) {
                    x || F("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
                    var s = new a, l = {
                        isDevice: !1,
                        contents: s
                    };
                } else var l = {
                    isDevice: !1,
                    url: t
                };
                var u = n.createFile(e, r, l, o, i);
                l.contents ? u.contents = l.contents : l.url && (u.contents = null, u.url = l.url), Object.defineProperties(u, {
                    usedBytes: {
                        get: function() {
                            return this.contents.length;
                        }
                    }
                });
                var m = {};
                for (const [S, v] of Object.entries(u.stream_ops))m[S] = (...g)=>(n.forceLoadFile(u), v(...g));
                function y(S, v, g, T, B) {
                    var z = S.node.contents;
                    if (B >= z.length) return 0;
                    var L = Math.min(z.length - B, T);
                    if (c(L >= 0), z.slice) for(var W = 0; W < L; W++)v[g + W] = z[B + W];
                    else for(var W = 0; W < L; W++)v[g + W] = z.get(B + W);
                    return L;
                }
                return m.read = (S, v, g, T, B)=>(n.forceLoadFile(u), y(S, v, g, T, B)), m.mmap = (S, v, g, T, B)=>{
                    n.forceLoadFile(u);
                    var z = Fr();
                    if (!z) throw new n.ErrnoError(48);
                    return y(S, I, z, v, g), {
                        ptr: z,
                        allocated: !0
                    };
                }, u.stream_ops = m, u;
            },
            absolutePath () {
                F("FS.absolutePath has been removed; use PATH_FS.resolve instead");
            },
            createFolder () {
                F("FS.createFolder has been removed; use FS.mkdir instead");
            },
            createLink () {
                F("FS.createLink has been removed; use FS.symlink instead");
            },
            joinPath () {
                F("FS.joinPath has been removed; use PATH.join instead");
            },
            mmapAlloc () {
                F("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
            },
            standardizePath () {
                F("FS.standardizePath has been removed; use PATH.normalize instead");
            }
        }, or = {
            calculateAt (e, r, t) {
                if (w.isAbs(r)) return r;
                var o;
                if (e === -100) o = n.cwd();
                else {
                    var i = or.getStreamFromFD(e);
                    o = i.path;
                }
                if (r.length == 0) {
                    if (!t) throw new n.ErrnoError(44);
                    return o;
                }
                return o + "/" + r;
            },
            writeStat (e, r) {
                E[e >> 2] = r.dev, E[e + 4 >> 2] = r.mode, E[e + 8 >> 2] = r.nlink, E[e + 12 >> 2] = r.uid, E[e + 16 >> 2] = r.gid, E[e + 20 >> 2] = r.rdev, C[e + 24 >> 3] = BigInt(r.size), me[e + 32 >> 2] = 4096, me[e + 36 >> 2] = r.blocks;
                var t = r.atime.getTime(), o = r.mtime.getTime(), i = r.ctime.getTime();
                return C[e + 40 >> 3] = BigInt(Math.floor(t / 1e3)), E[e + 48 >> 2] = t % 1e3 * 1e3 * 1e3, C[e + 56 >> 3] = BigInt(Math.floor(o / 1e3)), E[e + 64 >> 2] = o % 1e3 * 1e3 * 1e3, C[e + 72 >> 3] = BigInt(Math.floor(i / 1e3)), E[e + 80 >> 2] = i % 1e3 * 1e3 * 1e3, C[e + 88 >> 3] = BigInt(r.ino), 0;
            },
            writeStatFs (e, r) {
                E[e + 4 >> 2] = r.bsize, E[e + 60 >> 2] = r.bsize, C[e + 8 >> 3] = BigInt(r.blocks), C[e + 16 >> 3] = BigInt(r.bfree), C[e + 24 >> 3] = BigInt(r.bavail), C[e + 32 >> 3] = BigInt(r.files), C[e + 40 >> 3] = BigInt(r.ffree), E[e + 48 >> 2] = r.fsid, E[e + 64 >> 2] = r.flags, E[e + 56 >> 2] = r.namelen;
            },
            doMsync (e, r, t, o, i) {
                if (!n.isFile(r.node.mode)) throw new n.ErrnoError(43);
                if (o & 2) return 0;
                var a = G.slice(e, e + t);
                n.msync(r, a, i, t, o);
            },
            getStreamFromFD (e) {
                var r = n.getStreamChecked(e);
                return r;
            },
            varargs: void 0,
            getStr (e) {
                var r = X(e);
                return r;
            }
        };
        function jr(e) {
            try {
                var r = or.getStreamFromFD(e);
                return n.close(r), 0;
            } catch (t) {
                if (typeof n > "u" || t.name !== "ErrnoError") throw t;
                return t.errno;
            }
        }
        var Gr = (e, r, t, o)=>{
            for(var i = 0, a = 0; a < t; a++){
                var s = E[r >> 2], l = E[r + 4 >> 2];
                r += 8;
                var u = n.read(e, I, s, l, o);
                if (u < 0) return -1;
                if (i += u, u < l) break;
            }
            return i;
        };
        function $r(e, r, t, o) {
            try {
                var i = or.getStreamFromFD(e), a = Gr(i, r, t);
                return E[o >> 2] = a, 0;
            } catch (s) {
                if (typeof n > "u" || s.name !== "ErrnoError") throw s;
                return s.errno;
            }
        }
        function Vr(e, r, t, o) {
            r = er(r);
            try {
                if (isNaN(r)) return 61;
                var i = or.getStreamFromFD(e);
                return n.llseek(i, r, t), C[o >> 3] = BigInt(i.position), i.getdents && r === 0 && t === 0 && (i.getdents = null), 0;
            } catch (a) {
                if (typeof n > "u" || a.name !== "ErrnoError") throw a;
                return a.errno;
            }
        }
        var qr = (e, r, t, o)=>{
            for(var i = 0, a = 0; a < t; a++){
                var s = E[r >> 2], l = E[r + 4 >> 2];
                r += 8;
                var u = n.write(e, I, s, l, o);
                if (u < 0) return -1;
                if (i += u, u < l) break;
            }
            return i;
        };
        function Kr(e, r, t, o) {
            try {
                var i = or.getStreamFromFD(e), a = qr(i, r, t);
                return E[o >> 2] = a, 0;
            } catch (s) {
                if (typeof n > "u" || s.name !== "ErrnoError") throw s;
                return s.errno;
            }
        }
        n.createPreloadedFile = Wr, n.preloadFile = Ar, n.staticInit();
        {
            if (d.noExitRuntime && d.noExitRuntime, d.preloadPlugins && (Pr = d.preloadPlugins), d.print && (de = d.print), d.printErr && (R = d.printErr), d.wasmBinary && (ce = d.wasmBinary), Jr(), d.arguments && d.arguments, d.thisProgram && (Z = d.thisProgram), c(typeof d.memoryInitializerPrefixURL > "u", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead"), c(typeof d.pthreadMainPrefixURL > "u", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead"), c(typeof d.cdInitializerPrefixURL > "u", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead"), c(typeof d.filePackagePrefixURL > "u", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead"), c(typeof d.read > "u", "Module.read option was removed"), c(typeof d.readAsync > "u", "Module.readAsync option was removed (modify readAsync in JS)"), c(typeof d.readBinary > "u", "Module.readBinary option was removed (modify readBinary in JS)"), c(typeof d.setWindowTitle > "u", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)"), c(typeof d.TOTAL_MEMORY > "u", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY"), c(typeof d.ENVIRONMENT > "u", "Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)"), c(typeof d.STACK_SIZE > "u", "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time"), c(typeof d.wasmMemory > "u", "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally"), c(typeof d.INITIAL_MEMORY > "u", "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically"), d.preInit) for(typeof d.preInit == "function" && (d.preInit = [
                d.preInit
            ]); d.preInit.length > 0;)d.preInit.shift()();
            re("preInit");
        }
        var Yr = [
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
        Yr.forEach(ze);
        var Xr = [
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
        Xr.forEach(Ee);
        function Jr() {
            Le("fetchSettings");
        }
        d._deform = k("_deform"), d._malloc = k("_malloc"), d._free = k("_free"), d._assembled_joint_mass = k("_assembled_joint_mass"), d._modal = k("_modal"), d._modal_paz = k("_modal_paz"), d._didactic_solve = k("_didactic_solve"), d._plate_q4_solve = k("_plate_q4_solve"), d._slopeAllocDouble = k("_slopeAllocDouble"), d._slopeStabilitySolver = k("_slopeStabilitySolver"), d._nonlinear_dynamic = k("_nonlinear_dynamic"), d._steel02_test = k("_steel02_test"), d._cyclic_pushover = k("_cyclic_pushover"), d._concrete02_test = k("_concrete02_test"), d._hex8_solve = k("_hex8_solve"), d._hex8_stress = k("_hex8_stress");
        var br = k("_fflush"), Tr = k("_strerror"), wr = k("_emscripten_stack_get_end"), Rr = k("_emscripten_stack_init"), _r = k("wasmMemory");
        function Zr(e) {
            c(typeof e.deform < "u", "missing Wasm export: deform"), c(typeof e.malloc < "u", "missing Wasm export: malloc"), c(typeof e.free < "u", "missing Wasm export: free"), c(typeof e.assembled_joint_mass < "u", "missing Wasm export: assembled_joint_mass"), c(typeof e.modal < "u", "missing Wasm export: modal"), c(typeof e.modal_paz < "u", "missing Wasm export: modal_paz"), c(typeof e.didactic_solve < "u", "missing Wasm export: didactic_solve"), c(typeof e.plate_q4_solve < "u", "missing Wasm export: plate_q4_solve"), c(typeof e.slopeAllocDouble < "u", "missing Wasm export: slopeAllocDouble"), c(typeof e.slopeStabilitySolver < "u", "missing Wasm export: slopeStabilitySolver"), c(typeof e.nonlinear_dynamic < "u", "missing Wasm export: nonlinear_dynamic"), c(typeof e.steel02_test < "u", "missing Wasm export: steel02_test"), c(typeof e.cyclic_pushover < "u", "missing Wasm export: cyclic_pushover"), c(typeof e.concrete02_test < "u", "missing Wasm export: concrete02_test"), c(typeof e.hex8_solve < "u", "missing Wasm export: hex8_solve"), c(typeof e.hex8_stress < "u", "missing Wasm export: hex8_stress"), c(typeof e.fflush < "u", "missing Wasm export: fflush"), c(typeof e.strerror < "u", "missing Wasm export: strerror"), c(typeof e.emscripten_stack_get_end < "u", "missing Wasm export: emscripten_stack_get_end"), c(typeof e.emscripten_stack_get_base < "u", "missing Wasm export: emscripten_stack_get_base"), c(typeof e.emscripten_stack_init < "u", "missing Wasm export: emscripten_stack_init"), c(typeof e.emscripten_stack_get_free < "u", "missing Wasm export: emscripten_stack_get_free"), c(typeof e._emscripten_stack_restore < "u", "missing Wasm export: _emscripten_stack_restore"), c(typeof e._emscripten_stack_alloc < "u", "missing Wasm export: _emscripten_stack_alloc"), c(typeof e.emscripten_stack_get_current < "u", "missing Wasm export: emscripten_stack_get_current"), c(typeof e.memory < "u", "missing Wasm export: memory"), c(typeof e.__indirect_function_table < "u", "missing Wasm export: __indirect_function_table"), d._deform = A("deform", 80), d._malloc = A("malloc", 1), d._free = A("free", 1), d._assembled_joint_mass = A("assembled_joint_mass", 22), d._modal = A("modal", 87), d._modal_paz = A("modal_paz", 54), d._didactic_solve = A("didactic_solve", 48), d._plate_q4_solve = A("plate_q4_solve", 26), d._slopeAllocDouble = A("slopeAllocDouble", 1), d._slopeStabilitySolver = A("slopeStabilitySolver", 16), d._nonlinear_dynamic = A("nonlinear_dynamic", 20), d._steel02_test = A("steel02_test", 8), d._cyclic_pushover = A("cyclic_pushover", 40), d._concrete02_test = A("concrete02_test", 10), d._hex8_solve = A("hex8_solve", 18), d._hex8_stress = A("hex8_stress", 7), br = A("fflush", 1), Tr = A("strerror", 1), wr = e.emscripten_stack_get_end, e.emscripten_stack_get_base, Rr = e.emscripten_stack_init, e.emscripten_stack_get_free, e._emscripten_stack_restore, e._emscripten_stack_alloc, e.emscripten_stack_get_current, _r = e.memory, e.__indirect_function_table;
        }
        var Nr = {
            __assert_fail: qe,
            __cxa_throw: Ye,
            _abort_js: Xe,
            _tzset_js: ke,
            clock_time_get: oe,
            emscripten_resize_heap: hr,
            environ_get: rr,
            environ_sizes_get: tr,
            fd_close: jr,
            fd_read: $r,
            fd_seek: Vr,
            fd_write: Kr
        }, Or;
        function Qr() {
            Rr(), Ie();
        }
        function Sr() {
            if (pe > 0) {
                nr = Sr;
                return;
            }
            if (Qr(), ar(), pe > 0) {
                nr = Sr;
                return;
            }
            function e() {
                c(!Or), Or = !0, d.calledRun = !0, !ue && (Er(), ge?.(d), d.onRuntimeInitialized?.(), re("onRuntimeInitialized"), c(!d._main, 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]'), sr());
            }
            d.setStatus ? (d.setStatus("Running..."), setTimeout(()=>{
                setTimeout(()=>d.setStatus(""), 1), e();
            }, 1)) : e(), fe();
        }
        var Me;
        Me = await cr(), Sr(), te ? O = d : O = new Promise((e, r)=>{
            ge = e, ye = r;
        });
        for (const e of Object.keys(d))e in N || Object.defineProperty(N, e, {
            configurable: !0,
            get () {
                F(`Access to module property ('${e}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`);
            }
        });
        return O;
    }
    function rt(N) {
        const O = new Array(12).fill(0);
        if (!N) return O;
        if (N.length >= 12) {
            for(let h = 0; h < 12; h++)O[h] = N[h] ? 1 : 0;
            return O;
        }
        const d = [
            3,
            4,
            5,
            9,
            10,
            11
        ];
        for(let h = 0; h < 6 && h < N.length; h++)N[h] && (O[d[h]] = 1);
        return O;
    }
    await Ce();
    const f = await Ce();
    function tt(N, O, d, h, x = 10, H = 0, j = 0, Y = 1, Z, _e) {
        if (N.length === 0) return {
            frequencies: [],
            modeShapes: [],
            massParticipation: []
        };
        const p = [], Q = U(N.flat(), Float64Array, f.HEAPF64);
        p.push(Q);
        const le = O.flat(), ee = U(le, Uint32Array, f.HEAPU32);
        p.push(ee);
        const Ue = O.map((P)=>P.length), de = U(Ue, Uint32Array, f.HEAPU32);
        p.push(de);
        const R = d.supports ? Array.from(d.supports.keys()) : [], ce = d.supports ? Array.from(d.supports.values()).flat().map((P)=>P ? 1 : 0) : [], ue = U(R, Uint32Array, f.HEAPU32);
        p.push(ue);
        const c = U(ce, Uint8Array, f.HEAPU8);
        p.push(c);
        const b = (P)=>{
            const M = P ? Array.from(P.keys()) : [], ae = P ? Array.from(P.values()) : [], Re = U(M, Uint32Array, f.HEAPU32);
            p.push(Re);
            const Ne = U(ae, Float64Array, f.HEAPF64);
            return p.push(Ne), {
                keysPtr: Re,
                valuesPtr: Ne,
                size: M.length
            };
        }, Ie = b(h.elasticities), fe = b(h.areas), re = b(h.momentsOfInertiaZ), k = b(h.momentsOfInertiaY), Le = b(h.shearModuli), Be = b(h.torsionalConstants), ze = b(h.densities), Ee = b(h.thicknesses), ge = b(h.poissonsRatios), ye = b(h.membraneModifiers), I = b(h.bendingModifiers), G = h.plateFormulations, me = G ? Array.from(G.keys()) : [], E = G ? Array.from(G.values()) : [], C = U(me, Uint32Array, f.HEAPU32);
        p.push(C);
        const te = U(E, Uint32Array, f.HEAPU32);
        p.push(te);
        const ve = h.drillingTypes, ar = ve ? Array.from(ve.keys()) : [], Er = ve ? Array.from(ve.values()) : [], sr = U(ar, Uint32Array, f.HEAPU32);
        p.push(sr);
        const F = U(Er, Uint32Array, f.HEAPU32);
        p.push(F);
        const A = h.drillingPenaltyScales, we = A ? Array.from(A.keys()) : [], gr = A ? Array.from(A.values()) : [], lr = U(we, Uint32Array, f.HEAPU32);
        p.push(lr);
        const dr = U(gr, Float64Array, f.HEAPF64);
        p.push(dr);
        const He = b(h.shearAreasY), xe = b(h.shearAreasZ), We = b(h.localAngles), cr = h.momentReleases ? Array.from(h.momentReleases.keys()) : [], ur = h.momentReleases ? Array.from(h.momentReleases.values()).flatMap(rt) : [], je = U(cr, Uint32Array, f.HEAPU32);
        p.push(je);
        const fr = U(ur, Uint8Array, f.HEAPU8);
        p.push(fr);
        const Se = b(d.masses), Ge = b(d.diaphragms), $ = d.springs, ne = $ ? $.flatMap((P)=>[
                P.node,
                P.dof,
                P.k
            ]) : [], $e = U(ne.length > 0 ? ne : [
            0
        ], Float64Array, f.HEAPF64);
        p.push($e);
        const Ve = f._malloc(4);
        p.push(Ve);
        const V = f._malloc(4);
        p.push(V);
        const X = f._malloc(4);
        p.push(X);
        const qe = f._malloc(4);
        p.push(qe);
        const Ke = f._malloc(4);
        p.push(Ke);
        const Ye = f._malloc(4);
        p.push(Ye);
        const Xe = f._malloc(4);
        p.push(Xe);
        const Fe = f._malloc(4);
        p.push(Fe);
        const q = f._malloc(4);
        p.push(q);
        const J = f._malloc(4);
        p.push(J);
        const ke = f._malloc(4);
        p.push(ke), f.HEAPU32[q / 4] = 0, f.HEAPU32[J / 4] = 0, f.HEAPU32[ke / 4] = 0, f._modal(Q, N.length, ee, le.length, de, O.length, ue, c, R.length, Ie.keysPtr, Ie.valuesPtr, Ie.size, fe.keysPtr, fe.valuesPtr, fe.size, re.keysPtr, re.valuesPtr, re.size, k.keysPtr, k.valuesPtr, k.size, Le.keysPtr, Le.valuesPtr, Le.size, Be.keysPtr, Be.valuesPtr, Be.size, ze.keysPtr, ze.valuesPtr, ze.size, Ee.keysPtr, Ee.valuesPtr, Ee.size, ge.keysPtr, ge.valuesPtr, ge.size, ye.keysPtr, ye.valuesPtr, ye.size, I.keysPtr, I.valuesPtr, I.size, C, te, me.length, sr, F, ar.length, lr, dr, we.length, He.keysPtr, He.valuesPtr, He.size, xe.keysPtr, xe.valuesPtr, xe.size, We.keysPtr, We.valuesPtr, We.size, je, fr, cr.length, Se.keysPtr, Se.valuesPtr, Se.size, Y, Ge.keysPtr, Ge.valuesPtr, Ge.size, $e, $ ? $.length : 0, h.etabsWallJoint === !1 ? 0 : 1, x, H, j, Ve, V, X, qe, Ke, Ye, Xe, Fe, q, J, ke);
        const Je = f.HEAPU32[Ve / 4], Pe = f.HEAPU32[V / 4], Ze = f.HEAPU32[X / 4], Qe = f.HEAPU32[qe / 4], Ae = f.HEAPU32[Ke / 4], er = f.HEAPU32[Ye / 4], oe = f.HEAPU32[Xe / 4], be = f.HEAPU32[Fe / 4];
        let mr = [], vr = [], hr = [];
        if (Pe > 0 && Je) {
            const P = new Float64Array(f.HEAPF64.buffer, Je, Pe);
            mr = Array.from(P), p.push(Je);
        }
        if (Qe > 0 && Ae > 0 && Ze) {
            const P = new Float64Array(f.HEAPF64.buffer, Ze, Qe * Ae);
            for(let M = 0; M < Qe; M++)vr.push(Array.from(P.slice(M * Ae, (M + 1) * Ae)));
            p.push(Ze);
        }
        if (oe > 0 && be > 0 && er) {
            const P = new Float64Array(f.HEAPF64.buffer, er, oe * be);
            for(let M = 0; M < oe; M++)hr.push(Array.from(P.slice(M * be, (M + 1) * be)));
            p.push(er);
        }
        let Te = [], pr = [], ie = [];
        const rr = f.HEAPU32[q / 4];
        if (rr && oe > 0) {
            const P = new Float64Array(f.HEAPF64.buffer, rr, oe * 6);
            for(let M = 0; M < oe; M++)Te.push(Array.from(P.slice(M * 6, (M + 1) * 6)));
            p.push(rr);
        }
        const tr = f.HEAPU32[J / 4];
        tr && (pr = Array.from(new Float64Array(f.HEAPF64.buffer, tr, 6)), p.push(tr));
        const w = f.HEAPU32[ke / 4];
        return w && Pe > 0 && (ie = Array.from(new Float64Array(f.HEAPF64.buffer, w, Pe)), p.push(w)), p.forEach((P)=>f._free(P)), {
            frequencies: mr,
            modeShapes: vr,
            massParticipation: hr,
            participationFactors: Te,
            totalMass: pr,
            modeScales: ie
        };
    }
    function U(N, O, d) {
        const h = new O(N), x = f._malloc(h.length * h.BYTES_PER_ELEMENT);
        return (O === Float64Array ? f.HEAPF64 : O === Uint32Array ? f.HEAPU32 : O === Uint8Array ? f.HEAPU8 : d).set(h, x / h.BYTES_PER_ELEMENT), x;
    }
    await Ce();
    await Ce();
    await Ce();
    await Ce();
    function Mr(N) {
        return N ? new Map(N) : void 0;
    }
    self.postMessage({
        vivo: !0
    });
    self.onmessage = async (N)=>{
        const { nodes: O, elements: d, nodeInputs: h, elementInputs: x, nModes: H } = N.data ?? {};
        try {
            const j = {};
            for (const [p, Q] of Object.entries(h ?? {}))j[p] = Mr(Q);
            const Y = {};
            for (const [p, Q] of Object.entries(x ?? {}))Y[p] = Mr(Q);
            const Z = tt(O, d, j, Y, H), _e = {
                frequencies: Z?.frequencies ?? [],
                massParticipation: Z?.massParticipation ?? [],
                modeShapes: Z?.modeShapes ?? []
            };
            self.postMessage({
                ok: !0,
                m: _e
            });
        } catch (j) {
            self.postMessage({
                ok: !1,
                error: j?.message ?? String(j)
            });
        }
    };
})();
