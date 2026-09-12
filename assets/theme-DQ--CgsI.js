let qn = Object.getPrototypeOf, Ps, Ll, ns, Ts, bu = { isConnected: 1 }, zf = 1e3, yr, kf = {}, Vf = qn(bu), wu = qn(qn), vi, Eu = (s, t, e, n) => (s ?? (n ? setTimeout(e, n) : queueMicrotask(e), /* @__PURE__ */ new Set())).add(t), Au = (s, t, e) => {
  let n = ns;
  ns = t;
  try {
    return s(e);
  } catch (i) {
    return console.error(i), e;
  } finally {
    ns = n;
  }
}, ga = (s) => s.filter((t) => {
  var _a2;
  return (_a2 = t._dom) == null ? void 0 : _a2.isConnected;
}), Tu = (s) => yr = Eu(yr, s, () => {
  for (let t of yr) t._bindings = ga(t._bindings), t._listeners = ga(t._listeners);
  yr = vi;
}, zf), _a = { get val() {
  var _a2;
  return (_a2 = ns == null ? void 0 : ns._getters) == null ? void 0 : _a2.add(this), this.rawVal;
}, get oldVal() {
  var _a2;
  return (_a2 = ns == null ? void 0 : ns._getters) == null ? void 0 : _a2.add(this), this._oldVal;
}, set val(s) {
  var _a2;
  (_a2 = ns == null ? void 0 : ns._setters) == null ? void 0 : _a2.add(this), s !== this.rawVal && (this.rawVal = s, this._bindings.length + this._listeners.length ? (Ll == null ? void 0 : Ll.add(this), Ps = Eu(Ps, this, Hf)) : this._oldVal = s);
} }, Cu = (s) => ({ __proto__: _a, rawVal: s, _oldVal: s, _bindings: [], _listeners: [] }), ks = (s, t) => {
  let e = { _getters: /* @__PURE__ */ new Set(), _setters: /* @__PURE__ */ new Set() }, n = { f: s }, i = Ts;
  Ts = [];
  let r = Au(s, e, t);
  r = (r ?? document).nodeType ? r : new Text(r);
  for (let a of e._getters) e._setters.has(a) || (Tu(a), a._bindings.push(n));
  for (let a of Ts) a._dom = r;
  return Ts = i, n._dom = r;
}, Jl = (s, t = Cu(), e) => {
  let n = { _getters: /* @__PURE__ */ new Set(), _setters: /* @__PURE__ */ new Set() }, i = { f: s, s: t };
  i._dom = e ?? (Ts == null ? void 0 : Ts.push(i)) ?? bu, t.val = Au(s, n, t.rawVal);
  for (let r of n._getters) n._setters.has(r) || (Tu(r), r._listeners.push(i));
  return t;
}, Ru = (s, ...t) => {
  for (let e of t.flat(1 / 0)) {
    let n = qn(e ?? 0), i = n === _a ? ks(() => e.val) : n === wu ? ks(e) : e;
    i != vi && s.append(i);
  }
  return s;
}, Pu = (s, t, ...e) => {
  var _a2;
  let [{ is: n, ...i }, ...r] = qn(e[0] ?? 0) === Vf ? e : [{}, ...e], a = s ? document.createElementNS(s, t, { is: n }) : document.createElement(t, { is: n });
  for (let [o, l] of Object.entries(i)) {
    let c = (m) => m ? Object.getOwnPropertyDescriptor(m, o) ?? c(qn(m)) : vi, h = t + "," + o, u = kf[h] ?? (kf[h] = ((_a2 = c(qn(a))) == null ? void 0 : _a2.set) ?? 0), d = o.startsWith("on") ? (m, _) => {
      let g = o.slice(2);
      a.removeEventListener(g, _), a.addEventListener(g, m);
    } : u ? u.bind(a) : a.setAttribute.bind(a, o), f = qn(l ?? 0);
    o.startsWith("on") || f === wu && (l = Jl(l), f = _a), f === _a ? ks(() => (d(l.val, l._oldVal), a)) : d(l);
  }
  return Ru(a, r);
}, Xc = (s) => ({ get: (t, e) => Pu.bind(vi, s, e) }), Iu = (s, t) => t ? t !== s && s.replaceWith(t) : s.remove(), Hf = () => {
  let s = 0, t = [...Ps].filter((n) => n.rawVal !== n._oldVal);
  do {
    Ll = /* @__PURE__ */ new Set();
    for (let n of new Set(t.flatMap((i) => i._listeners = ga(i._listeners)))) Jl(n.f, n.s, n._dom), n._dom = vi;
  } while (++s < 100 && (t = [...Ll]).length);
  let e = [...Ps].filter((n) => n.rawVal !== n._oldVal);
  Ps = vi;
  for (let n of new Set(e.flatMap((i) => i._bindings = ga(i._bindings)))) Iu(n._dom, ks(n.f, n._dom)), n._dom = vi;
  for (let n of e) n._oldVal = n.rawVal;
};
const aM = { tags: new Proxy((s) => new Proxy(Pu, Xc(s)), Xc()), hydrate: (s, t) => Iu(s, ks(t, s)), add: Ru, state: Cu, derive: Jl };
/**
* @license
* Copyright 2010-2024 Three.js Authors
* SPDX-License-Identifier: MIT
*/
const io = "169", Gf = { LEFT: 0, MIDDLE: 1, RIGHT: 2, ROTATE: 0, DOLLY: 1, PAN: 2 }, Wf = { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 }, Lu = 0, Dl = 1, Du = 2, Xf = 3, qf = 0, $l = 1, Uu = 2, cn = 3, Pn = 0, De = 1, hn = 2, Cn = 0, yi = 1, Ul = 2, Nl = 3, Fl = 4, Nu = 5, Xn = 100, Fu = 101, Ou = 102, Bu = 103, zu = 104, ku = 200, Vu = 201, Hu = 202, Gu = 203, xa = 204, va = 205, Wu = 206, Xu = 207, qu = 208, Yu = 209, Zu = 210, Ju = 211, $u = 212, Ku = 213, Qu = 214, ya = 0, Ma = 1, Sa = 2, wi = 3, ba = 4, wa = 5, Ea = 6, Aa = 7, lr = 0, ju = 1, td = 2, Rn = 0, ed = 1, nd = 2, id = 3, sd = 4, rd = 5, ad = 6, od = 7, Ol = "attached", ld = "detached", so = 300, In = 301, Yn = 302, Vs = 303, Hs = 304, ls = 306, Gs = 1e3, Qe = 1001, Ws = 1002, Me = 1003, Kl = 1004, Yf = 1004, Ki = 1005, Zf = 1005, ge = 1006, Is = 1007, Jf = 1007, un = 1008, $f = 1008, mn = 1009, Ql = 1010, jl = 1011, ss = 1012, ro = 1013, Ln = 1014, ke = 1015, cs = 1016, ao = 1017, oo = 1018, Ei = 1020, tc = 35902, ec = 1021, nc = 1022, Le = 1023, ic = 1024, sc = 1025, Mi = 1026, Ai = 1027, lo = 1028, cr = 1029, rc = 1030, co = 1031, Kf = 1032, ho = 1033, Ls = 33776, Ds = 33777, Us = 33778, Ns = 33779, Ta = 35840, Ca = 35841, Ra = 35842, Pa = 35843, Ia = 36196, La = 37492, Da = 37496, Ua = 37808, Na = 37809, Fa = 37810, Oa = 37811, Ba = 37812, za = 37813, ka = 37814, Va = 37815, Ha = 37816, Ga = 37817, Wa = 37818, Xa = 37819, qa = 37820, Ya = 37821, Fs = 36492, Za = 36494, Ja = 36495, ac = 36283, $a = 36284, Ka = 36285, Qa = 36286, cd = 2200, hd = 2201, ud = 2202, Xs = 2300, ja = 2301, da = 2302, mi = 2400, gi = 2401, qs = 2402, uo = 2500, oc = 2501, Qf = 0, jf = 1, tp = 2, dd = 3200, fd = 3201, ep = 3202, np = 3203, Jn = 0, pd = 1, En = "", Ke = "srgb", Un = "srgb-linear", fo = "display-p3", hr = "display-p3-linear", Ys = "linear", re = "srgb", Zs = "rec709", Js = "p3", ip = 0, di = 7680, sp = 7681, rp = 7682, ap = 7683, op = 34055, lp = 34056, cp = 5386, hp = 512, up = 513, dp = 514, fp = 515, pp = 516, mp = 517, gp = 518, Bl = 519, md = 512, gd = 513, _d = 514, lc = 515, xd = 516, vd = 517, yd = 518, Md = 519, $s = 35044, _p = 35048, xp = 35040, vp = 35045, yp = 35049, Mp = 35041, Sp = 35046, bp = 35050, wp = 35042, Ep = "100", zl = "300 es", dn = 2e3, Ks = 2001;
class gn {
  addEventListener(t, e) {
    this._listeners === void 0 && (this._listeners = {});
    const n = this._listeners;
    n[t] === void 0 && (n[t] = []), n[t].indexOf(e) === -1 && n[t].push(e);
  }
  hasEventListener(t, e) {
    if (this._listeners === void 0) return false;
    const n = this._listeners;
    return n[t] !== void 0 && n[t].indexOf(e) !== -1;
  }
  removeEventListener(t, e) {
    if (this._listeners === void 0) return;
    const i = this._listeners[t];
    if (i !== void 0) {
      const r = i.indexOf(e);
      r !== -1 && i.splice(r, 1);
    }
  }
  dispatchEvent(t) {
    if (this._listeners === void 0) return;
    const n = this._listeners[t.type];
    if (n !== void 0) {
      t.target = this;
      const i = n.slice(0);
      for (let r = 0, a = i.length; r < a; r++) i[r].call(this, t);
      t.target = null;
    }
  }
}
const we = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
let qc = 1234567;
const Si = Math.PI / 180, rs = 180 / Math.PI;
function Ye() {
  const s = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0;
  return (we[s & 255] + we[s >> 8 & 255] + we[s >> 16 & 255] + we[s >> 24 & 255] + "-" + we[t & 255] + we[t >> 8 & 255] + "-" + we[t >> 16 & 15 | 64] + we[t >> 24 & 255] + "-" + we[e & 63 | 128] + we[e >> 8 & 255] + "-" + we[e >> 16 & 255] + we[e >> 24 & 255] + we[n & 255] + we[n >> 8 & 255] + we[n >> 16 & 255] + we[n >> 24 & 255]).toLowerCase();
}
function he(s, t, e) {
  return Math.max(t, Math.min(e, s));
}
function cc(s, t) {
  return (s % t + t) % t;
}
function Ap(s, t, e, n, i) {
  return n + (s - t) * (i - n) / (e - t);
}
function Tp(s, t, e) {
  return s !== t ? (e - s) / (t - s) : 0;
}
function Os(s, t, e) {
  return (1 - e) * s + e * t;
}
function Cp(s, t, e, n) {
  return Os(s, t, 1 - Math.exp(-e * n));
}
function Rp(s, t = 1) {
  return t - Math.abs(cc(s, t * 2) - t);
}
function Pp(s, t, e) {
  return s <= t ? 0 : s >= e ? 1 : (s = (s - t) / (e - t), s * s * (3 - 2 * s));
}
function Ip(s, t, e) {
  return s <= t ? 0 : s >= e ? 1 : (s = (s - t) / (e - t), s * s * s * (s * (s * 6 - 15) + 10));
}
function Lp(s, t) {
  return s + Math.floor(Math.random() * (t - s + 1));
}
function Dp(s, t) {
  return s + Math.random() * (t - s);
}
function Up(s) {
  return s * (0.5 - Math.random());
}
function Np(s) {
  s !== void 0 && (qc = s);
  let t = qc += 1831565813;
  return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function Fp(s) {
  return s * Si;
}
function Op(s) {
  return s * rs;
}
function Bp(s) {
  return (s & s - 1) === 0 && s !== 0;
}
function zp(s) {
  return Math.pow(2, Math.ceil(Math.log(s) / Math.LN2));
}
function kp(s) {
  return Math.pow(2, Math.floor(Math.log(s) / Math.LN2));
}
function Vp(s, t, e, n, i) {
  const r = Math.cos, a = Math.sin, o = r(e / 2), l = a(e / 2), c = r((t + n) / 2), h = a((t + n) / 2), u = r((t - n) / 2), d = a((t - n) / 2), f = r((n - t) / 2), m = a((n - t) / 2);
  switch (i) {
    case "XYX":
      s.set(o * h, l * u, l * d, o * c);
      break;
    case "YZY":
      s.set(l * d, o * h, l * u, o * c);
      break;
    case "ZXZ":
      s.set(l * u, l * d, o * h, o * c);
      break;
    case "XZX":
      s.set(o * h, l * m, l * f, o * c);
      break;
    case "YXY":
      s.set(l * f, o * h, l * m, o * c);
      break;
    case "ZYZ":
      s.set(l * m, l * f, o * h, o * c);
      break;
    default:
      console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + i);
  }
}
function Ie(s, t) {
  switch (t.constructor) {
    case Float32Array:
      return s;
    case Uint32Array:
      return s / 4294967295;
    case Uint16Array:
      return s / 65535;
    case Uint8Array:
      return s / 255;
    case Int32Array:
      return Math.max(s / 2147483647, -1);
    case Int16Array:
      return Math.max(s / 32767, -1);
    case Int8Array:
      return Math.max(s / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function kt(s, t) {
  switch (t.constructor) {
    case Float32Array:
      return s;
    case Uint32Array:
      return Math.round(s * 4294967295);
    case Uint16Array:
      return Math.round(s * 65535);
    case Uint8Array:
      return Math.round(s * 255);
    case Int32Array:
      return Math.round(s * 2147483647);
    case Int16Array:
      return Math.round(s * 32767);
    case Int8Array:
      return Math.round(s * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
const Hp = { DEG2RAD: Si, RAD2DEG: rs, generateUUID: Ye, clamp: he, euclideanModulo: cc, mapLinear: Ap, inverseLerp: Tp, lerp: Os, damp: Cp, pingpong: Rp, smoothstep: Pp, smootherstep: Ip, randInt: Lp, randFloat: Dp, randFloatSpread: Up, seededRandom: Np, degToRad: Fp, radToDeg: Op, isPowerOfTwo: Bp, ceilPowerOfTwo: zp, floorPowerOfTwo: kp, setQuaternionFromProperEuler: Vp, normalize: kt, denormalize: Ie };
class Z {
  constructor(t = 0, e = 0) {
    Z.prototype.isVector2 = true, this.x = t, this.y = e;
  }
  get width() {
    return this.x;
  }
  set width(t) {
    this.x = t;
  }
  get height() {
    return this.y;
  }
  set height(t) {
    this.y = t;
  }
  set(t, e) {
    return this.x = t, this.y = e, this;
  }
  setScalar(t) {
    return this.x = t, this.y = t, this;
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this;
  }
  addScalar(t) {
    return this.x += t, this.y += t, this;
  }
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this;
  }
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this;
  }
  subScalar(t) {
    return this.x -= t, this.y -= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this;
  }
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this;
  }
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  applyMatrix3(t) {
    const e = this.x, n = this.y, i = t.elements;
    return this.x = i[0] * e + i[3] * n + i[6], this.y = i[1] * e + i[4] * n + i[7], this;
  }
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this;
  }
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this;
  }
  clamp(t, e) {
    return this.x = Math.max(t.x, Math.min(e.x, this.x)), this.y = Math.max(t.y, Math.min(e.y, this.y)), this;
  }
  clampScalar(t, e) {
    return this.x = Math.max(t, Math.min(e, this.x)), this.y = Math.max(t, Math.min(e, this.y)), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Math.max(t, Math.min(e, n)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  cross(t) {
    return this.x * t.y - this.y * t.x;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(he(n, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x, n = this.y - t.y;
    return e * e + n * n;
  }
  manhattanDistanceTo(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this;
  }
  lerpVectors(t, e, n) {
    return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t;
  }
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this;
  }
  rotateAround(t, e) {
    const n = Math.cos(e), i = Math.sin(e), r = this.x - t.x, a = this.y - t.y;
    return this.x = r * n - a * i + t.x, this.y = r * i + a * n + t.y, this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
class zt {
  constructor(t, e, n, i, r, a, o, l, c) {
    zt.prototype.isMatrix3 = true, this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1], t !== void 0 && this.set(t, e, n, i, r, a, o, l, c);
  }
  set(t, e, n, i, r, a, o, l, c) {
    const h = this.elements;
    return h[0] = t, h[1] = i, h[2] = o, h[3] = e, h[4] = r, h[5] = l, h[6] = n, h[7] = a, h[8] = c, this;
  }
  identity() {
    return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
  }
  copy(t) {
    const e = this.elements, n = t.elements;
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], this;
  }
  extractBasis(t, e, n) {
    return t.setFromMatrix3Column(this, 0), e.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this;
  }
  setFromMatrix4(t) {
    const e = t.elements;
    return this.set(e[0], e[4], e[8], e[1], e[5], e[9], e[2], e[6], e[10]), this;
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const n = t.elements, i = e.elements, r = this.elements, a = n[0], o = n[3], l = n[6], c = n[1], h = n[4], u = n[7], d = n[2], f = n[5], m = n[8], _ = i[0], g = i[3], p = i[6], y = i[1], x = i[4], M = i[7], I = i[2], E = i[5], A = i[8];
    return r[0] = a * _ + o * y + l * I, r[3] = a * g + o * x + l * E, r[6] = a * p + o * M + l * A, r[1] = c * _ + h * y + u * I, r[4] = c * g + h * x + u * E, r[7] = c * p + h * M + u * A, r[2] = d * _ + f * y + m * I, r[5] = d * g + f * x + m * E, r[8] = d * p + f * M + m * A, this;
  }
  multiplyScalar(t) {
    const e = this.elements;
    return e[0] *= t, e[3] *= t, e[6] *= t, e[1] *= t, e[4] *= t, e[7] *= t, e[2] *= t, e[5] *= t, e[8] *= t, this;
  }
  determinant() {
    const t = this.elements, e = t[0], n = t[1], i = t[2], r = t[3], a = t[4], o = t[5], l = t[6], c = t[7], h = t[8];
    return e * a * h - e * o * c - n * r * h + n * o * l + i * r * c - i * a * l;
  }
  invert() {
    const t = this.elements, e = t[0], n = t[1], i = t[2], r = t[3], a = t[4], o = t[5], l = t[6], c = t[7], h = t[8], u = h * a - o * c, d = o * l - h * r, f = c * r - a * l, m = e * u + n * d + i * f;
    if (m === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const _ = 1 / m;
    return t[0] = u * _, t[1] = (i * c - h * n) * _, t[2] = (o * n - i * a) * _, t[3] = d * _, t[4] = (h * e - i * l) * _, t[5] = (i * r - o * e) * _, t[6] = f * _, t[7] = (n * l - c * e) * _, t[8] = (a * e - n * r) * _, this;
  }
  transpose() {
    let t;
    const e = this.elements;
    return t = e[1], e[1] = e[3], e[3] = t, t = e[2], e[2] = e[6], e[6] = t, t = e[5], e[5] = e[7], e[7] = t, this;
  }
  getNormalMatrix(t) {
    return this.setFromMatrix4(t).invert().transpose();
  }
  transposeIntoArray(t) {
    const e = this.elements;
    return t[0] = e[0], t[1] = e[3], t[2] = e[6], t[3] = e[1], t[4] = e[4], t[5] = e[7], t[6] = e[2], t[7] = e[5], t[8] = e[8], this;
  }
  setUvTransform(t, e, n, i, r, a, o) {
    const l = Math.cos(r), c = Math.sin(r);
    return this.set(n * l, n * c, -n * (l * a + c * o) + a + t, -i * c, i * l, -i * (-c * a + l * o) + o + e, 0, 0, 1), this;
  }
  scale(t, e) {
    return this.premultiply(Go.makeScale(t, e)), this;
  }
  rotate(t) {
    return this.premultiply(Go.makeRotation(-t)), this;
  }
  translate(t, e) {
    return this.premultiply(Go.makeTranslation(t, e)), this;
  }
  makeTranslation(t, e) {
    return t.isVector2 ? this.set(1, 0, t.x, 0, 1, t.y, 0, 0, 1) : this.set(1, 0, t, 0, 1, e, 0, 0, 1), this;
  }
  makeRotation(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(e, -n, 0, n, e, 0, 0, 0, 1), this;
  }
  makeScale(t, e) {
    return this.set(t, 0, 0, 0, e, 0, 0, 0, 1), this;
  }
  equals(t) {
    const e = this.elements, n = t.elements;
    for (let i = 0; i < 9; i++) if (e[i] !== n[i]) return false;
    return true;
  }
  fromArray(t, e = 0) {
    for (let n = 0; n < 9; n++) this.elements[n] = t[n + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const n = this.elements;
    return t[e] = n[0], t[e + 1] = n[1], t[e + 2] = n[2], t[e + 3] = n[3], t[e + 4] = n[4], t[e + 5] = n[5], t[e + 6] = n[6], t[e + 7] = n[7], t[e + 8] = n[8], t;
  }
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
}
const Go = new zt();
function Sd(s) {
  for (let t = s.length - 1; t >= 0; --t) if (s[t] >= 65535) return true;
  return false;
}
const Gp = { Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array };
function Qi(s, t) {
  return new Gp[s](t);
}
function Qs(s) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", s);
}
function bd() {
  const s = Qs("canvas");
  return s.style.display = "block", s;
}
const Yc = {};
function fa(s) {
  s in Yc || (Yc[s] = true, console.warn(s));
}
function Wp(s, t, e) {
  return new Promise(function(n, i) {
    function r() {
      switch (s.clientWaitSync(t, s.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case s.WAIT_FAILED:
          i();
          break;
        case s.TIMEOUT_EXPIRED:
          setTimeout(r, e);
          break;
        default:
          n();
      }
    }
    setTimeout(r, e);
  });
}
function Xp(s) {
  const t = s.elements;
  t[2] = 0.5 * t[2] + 0.5 * t[3], t[6] = 0.5 * t[6] + 0.5 * t[7], t[10] = 0.5 * t[10] + 0.5 * t[11], t[14] = 0.5 * t[14] + 0.5 * t[15];
}
function qp(s) {
  const t = s.elements;
  t[11] === -1 ? (t[10] = -t[10] - 1, t[14] = -t[14]) : (t[10] = -t[10], t[14] = -t[14] + 1);
}
const Zc = new zt().set(0.8224621, 0.177538, 0, 0.0331941, 0.9668058, 0, 0.0170827, 0.0723974, 0.9105199), Jc = new zt().set(1.2249401, -0.2249404, 0, -0.0420569, 1.0420571, 0, -0.0196376, -0.0786361, 1.0982735), ps = { [Un]: { transfer: Ys, primaries: Zs, luminanceCoefficients: [0.2126, 0.7152, 0.0722], toReference: (s) => s, fromReference: (s) => s }, [Ke]: { transfer: re, primaries: Zs, luminanceCoefficients: [0.2126, 0.7152, 0.0722], toReference: (s) => s.convertSRGBToLinear(), fromReference: (s) => s.convertLinearToSRGB() }, [hr]: { transfer: Ys, primaries: Js, luminanceCoefficients: [0.2289, 0.6917, 0.0793], toReference: (s) => s.applyMatrix3(Jc), fromReference: (s) => s.applyMatrix3(Zc) }, [fo]: { transfer: re, primaries: Js, luminanceCoefficients: [0.2289, 0.6917, 0.0793], toReference: (s) => s.convertSRGBToLinear().applyMatrix3(Jc), fromReference: (s) => s.applyMatrix3(Zc).convertLinearToSRGB() } }, Yp = /* @__PURE__ */ new Set([Un, hr]), Qt = { enabled: true, _workingColorSpace: Un, get workingColorSpace() {
  return this._workingColorSpace;
}, set workingColorSpace(s) {
  if (!Yp.has(s)) throw new Error(`Unsupported working color space, "${s}".`);
  this._workingColorSpace = s;
}, convert: function(s, t, e) {
  if (this.enabled === false || t === e || !t || !e) return s;
  const n = ps[t].toReference, i = ps[e].fromReference;
  return i(n(s));
}, fromWorkingColorSpace: function(s, t) {
  return this.convert(s, this._workingColorSpace, t);
}, toWorkingColorSpace: function(s, t) {
  return this.convert(s, t, this._workingColorSpace);
}, getPrimaries: function(s) {
  return ps[s].primaries;
}, getTransfer: function(s) {
  return s === En ? Ys : ps[s].transfer;
}, getLuminanceCoefficients: function(s, t = this._workingColorSpace) {
  return s.fromArray(ps[t].luminanceCoefficients);
} };
function is(s) {
  return s < 0.04045 ? s * 0.0773993808 : Math.pow(s * 0.9478672986 + 0.0521327014, 2.4);
}
function Wo(s) {
  return s < 31308e-7 ? s * 12.92 : 1.055 * Math.pow(s, 0.41666) - 0.055;
}
let Di;
class wd {
  static getDataURL(t) {
    if (/^data:/i.test(t.src) || typeof HTMLCanvasElement > "u") return t.src;
    let e;
    if (t instanceof HTMLCanvasElement) e = t;
    else {
      Di === void 0 && (Di = Qs("canvas")), Di.width = t.width, Di.height = t.height;
      const n = Di.getContext("2d");
      t instanceof ImageData ? n.putImageData(t, 0, 0) : n.drawImage(t, 0, 0, t.width, t.height), e = Di;
    }
    return e.width > 2048 || e.height > 2048 ? (console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", t), e.toDataURL("image/jpeg", 0.6)) : e.toDataURL("image/png");
  }
  static sRGBToLinear(t) {
    if (typeof HTMLImageElement < "u" && t instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && t instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
      const e = Qs("canvas");
      e.width = t.width, e.height = t.height;
      const n = e.getContext("2d");
      n.drawImage(t, 0, 0, t.width, t.height);
      const i = n.getImageData(0, 0, t.width, t.height), r = i.data;
      for (let a = 0; a < r.length; a++) r[a] = is(r[a] / 255) * 255;
      return n.putImageData(i, 0, 0), e;
    } else if (t.data) {
      const e = t.data.slice(0);
      for (let n = 0; n < e.length; n++) e instanceof Uint8Array || e instanceof Uint8ClampedArray ? e[n] = Math.floor(is(e[n] / 255) * 255) : e[n] = is(e[n]);
      return { data: e, width: t.width, height: t.height };
    } else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), t;
  }
}
let Zp = 0;
class _i {
  constructor(t = null) {
    this.isSource = true, Object.defineProperty(this, "id", { value: Zp++ }), this.uuid = Ye(), this.data = t, this.dataReady = true, this.version = 0;
  }
  set needsUpdate(t) {
    t === true && this.version++;
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.images[this.uuid] !== void 0) return t.images[this.uuid];
    const n = { uuid: this.uuid, url: "" }, i = this.data;
    if (i !== null) {
      let r;
      if (Array.isArray(i)) {
        r = [];
        for (let a = 0, o = i.length; a < o; a++) i[a].isDataTexture ? r.push(Xo(i[a].image)) : r.push(Xo(i[a]));
      } else r = Xo(i);
      n.url = r;
    }
    return e || (t.images[this.uuid] = n), n;
  }
}
function Xo(s) {
  return typeof HTMLImageElement < "u" && s instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && s instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && s instanceof ImageBitmap ? wd.getDataURL(s) : s.data ? { data: Array.from(s.data), width: s.width, height: s.height, type: s.data.constructor.name } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let Jp = 0;
class ue extends gn {
  constructor(t = ue.DEFAULT_IMAGE, e = ue.DEFAULT_MAPPING, n = Qe, i = Qe, r = ge, a = un, o = Le, l = mn, c = ue.DEFAULT_ANISOTROPY, h = En) {
    super(), this.isTexture = true, Object.defineProperty(this, "id", { value: Jp++ }), this.uuid = Ye(), this.name = "", this.source = new _i(t), this.mipmaps = [], this.mapping = e, this.channel = 0, this.wrapS = n, this.wrapT = i, this.magFilter = r, this.minFilter = a, this.anisotropy = c, this.format = o, this.internalFormat = null, this.type = l, this.offset = new Z(0, 0), this.repeat = new Z(1, 1), this.center = new Z(0, 0), this.rotation = 0, this.matrixAutoUpdate = true, this.matrix = new zt(), this.generateMipmaps = true, this.premultiplyAlpha = false, this.flipY = true, this.unpackAlignment = 4, this.colorSpace = h, this.userData = {}, this.version = 0, this.onUpdate = null, this.isRenderTargetTexture = false, this.pmremVersion = 0;
  }
  get image() {
    return this.source.data;
  }
  set image(t = null) {
    this.source.data = t;
  }
  updateMatrix() {
    this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.name = t.name, this.source = t.source, this.mipmaps = t.mipmaps.slice(0), this.mapping = t.mapping, this.channel = t.channel, this.wrapS = t.wrapS, this.wrapT = t.wrapT, this.magFilter = t.magFilter, this.minFilter = t.minFilter, this.anisotropy = t.anisotropy, this.format = t.format, this.internalFormat = t.internalFormat, this.type = t.type, this.offset.copy(t.offset), this.repeat.copy(t.repeat), this.center.copy(t.center), this.rotation = t.rotation, this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrix.copy(t.matrix), this.generateMipmaps = t.generateMipmaps, this.premultiplyAlpha = t.premultiplyAlpha, this.flipY = t.flipY, this.unpackAlignment = t.unpackAlignment, this.colorSpace = t.colorSpace, this.userData = JSON.parse(JSON.stringify(t.userData)), this.needsUpdate = true, this;
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.textures[this.uuid] !== void 0) return t.textures[this.uuid];
    const n = { metadata: { version: 4.6, type: "Texture", generator: "Texture.toJSON" }, uuid: this.uuid, name: this.name, image: this.source.toJSON(t).uuid, mapping: this.mapping, channel: this.channel, repeat: [this.repeat.x, this.repeat.y], offset: [this.offset.x, this.offset.y], center: [this.center.x, this.center.y], rotation: this.rotation, wrap: [this.wrapS, this.wrapT], format: this.format, internalFormat: this.internalFormat, type: this.type, colorSpace: this.colorSpace, minFilter: this.minFilter, magFilter: this.magFilter, anisotropy: this.anisotropy, flipY: this.flipY, generateMipmaps: this.generateMipmaps, premultiplyAlpha: this.premultiplyAlpha, unpackAlignment: this.unpackAlignment };
    return Object.keys(this.userData).length > 0 && (n.userData = this.userData), e || (t.textures[this.uuid] = n), n;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  transformUv(t) {
    if (this.mapping !== so) return t;
    if (t.applyMatrix3(this.matrix), t.x < 0 || t.x > 1) switch (this.wrapS) {
      case Gs:
        t.x = t.x - Math.floor(t.x);
        break;
      case Qe:
        t.x = t.x < 0 ? 0 : 1;
        break;
      case Ws:
        Math.abs(Math.floor(t.x) % 2) === 1 ? t.x = Math.ceil(t.x) - t.x : t.x = t.x - Math.floor(t.x);
        break;
    }
    if (t.y < 0 || t.y > 1) switch (this.wrapT) {
      case Gs:
        t.y = t.y - Math.floor(t.y);
        break;
      case Qe:
        t.y = t.y < 0 ? 0 : 1;
        break;
      case Ws:
        Math.abs(Math.floor(t.y) % 2) === 1 ? t.y = Math.ceil(t.y) - t.y : t.y = t.y - Math.floor(t.y);
        break;
    }
    return this.flipY && (t.y = 1 - t.y), t;
  }
  set needsUpdate(t) {
    t === true && (this.version++, this.source.needsUpdate = true);
  }
  set needsPMREMUpdate(t) {
    t === true && this.pmremVersion++;
  }
}
ue.DEFAULT_IMAGE = null;
ue.DEFAULT_MAPPING = so;
ue.DEFAULT_ANISOTROPY = 1;
class Jt {
  constructor(t = 0, e = 0, n = 0, i = 1) {
    Jt.prototype.isVector4 = true, this.x = t, this.y = e, this.z = n, this.w = i;
  }
  get width() {
    return this.z;
  }
  set width(t) {
    this.z = t;
  }
  get height() {
    return this.w;
  }
  set height(t) {
    this.w = t;
  }
  set(t, e, n, i) {
    return this.x = t, this.y = e, this.z = n, this.w = i, this;
  }
  setScalar(t) {
    return this.x = t, this.y = t, this.z = t, this.w = t, this;
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setZ(t) {
    return this.z = t, this;
  }
  setW(t) {
    return this.w = t, this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      case 3:
        this.w = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w !== void 0 ? t.w : 1, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this.z += t.z, this.w += t.w, this;
  }
  addScalar(t) {
    return this.x += t, this.y += t, this.z += t, this.w += t, this;
  }
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this.w = t.w + e.w, this;
  }
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this.w += t.w * e, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this.z -= t.z, this.w -= t.w, this;
  }
  subScalar(t) {
    return this.x -= t, this.y -= t, this.z -= t, this.w -= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this.w = t.w - e.w, this;
  }
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this.z *= t.z, this.w *= t.w, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this.z *= t, this.w *= t, this;
  }
  applyMatrix4(t) {
    const e = this.x, n = this.y, i = this.z, r = this.w, a = t.elements;
    return this.x = a[0] * e + a[4] * n + a[8] * i + a[12] * r, this.y = a[1] * e + a[5] * n + a[9] * i + a[13] * r, this.z = a[2] * e + a[6] * n + a[10] * i + a[14] * r, this.w = a[3] * e + a[7] * n + a[11] * i + a[15] * r, this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  setAxisAngleFromQuaternion(t) {
    this.w = 2 * Math.acos(t.w);
    const e = Math.sqrt(1 - t.w * t.w);
    return e < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = t.x / e, this.y = t.y / e, this.z = t.z / e), this;
  }
  setAxisAngleFromRotationMatrix(t) {
    let e, n, i, r;
    const l = t.elements, c = l[0], h = l[4], u = l[8], d = l[1], f = l[5], m = l[9], _ = l[2], g = l[6], p = l[10];
    if (Math.abs(h - d) < 0.01 && Math.abs(u - _) < 0.01 && Math.abs(m - g) < 0.01) {
      if (Math.abs(h + d) < 0.1 && Math.abs(u + _) < 0.1 && Math.abs(m + g) < 0.1 && Math.abs(c + f + p - 3) < 0.1) return this.set(1, 0, 0, 0), this;
      e = Math.PI;
      const x = (c + 1) / 2, M = (f + 1) / 2, I = (p + 1) / 2, E = (h + d) / 4, A = (u + _) / 4, P = (m + g) / 4;
      return x > M && x > I ? x < 0.01 ? (n = 0, i = 0.707106781, r = 0.707106781) : (n = Math.sqrt(x), i = E / n, r = A / n) : M > I ? M < 0.01 ? (n = 0.707106781, i = 0, r = 0.707106781) : (i = Math.sqrt(M), n = E / i, r = P / i) : I < 0.01 ? (n = 0.707106781, i = 0.707106781, r = 0) : (r = Math.sqrt(I), n = A / r, i = P / r), this.set(n, i, r, e), this;
    }
    let y = Math.sqrt((g - m) * (g - m) + (u - _) * (u - _) + (d - h) * (d - h));
    return Math.abs(y) < 1e-3 && (y = 1), this.x = (g - m) / y, this.y = (u - _) / y, this.z = (d - h) / y, this.w = Math.acos((c + f + p - 1) / 2), this;
  }
  setFromMatrixPosition(t) {
    const e = t.elements;
    return this.x = e[12], this.y = e[13], this.z = e[14], this.w = e[15], this;
  }
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this.w = Math.min(this.w, t.w), this;
  }
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this.w = Math.max(this.w, t.w), this;
  }
  clamp(t, e) {
    return this.x = Math.max(t.x, Math.min(e.x, this.x)), this.y = Math.max(t.y, Math.min(e.y, this.y)), this.z = Math.max(t.z, Math.min(e.z, this.z)), this.w = Math.max(t.w, Math.min(e.w, this.w)), this;
  }
  clampScalar(t, e) {
    return this.x = Math.max(t, Math.min(e, this.x)), this.y = Math.max(t, Math.min(e, this.y)), this.z = Math.max(t, Math.min(e, this.z)), this.w = Math.max(t, Math.min(e, this.w)), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Math.max(t, Math.min(e, n)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this.w += (t.w - this.w) * e, this;
  }
  lerpVectors(t, e, n) {
    return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this.z = t.z + (e.z - t.z) * n, this.w = t.w + (e.w - t.w) * n, this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z && t.w === this.w;
  }
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this.w = t[e + 3], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t[e + 3] = this.w, t;
  }
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this.w = t.getW(e), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
}
class Ed extends gn {
  constructor(t = 1, e = 1, n = {}) {
    super(), this.isRenderTarget = true, this.width = t, this.height = e, this.depth = 1, this.scissor = new Jt(0, 0, t, e), this.scissorTest = false, this.viewport = new Jt(0, 0, t, e);
    const i = { width: t, height: e, depth: 1 };
    n = Object.assign({ generateMipmaps: false, internalFormat: null, minFilter: ge, depthBuffer: true, stencilBuffer: false, resolveDepthBuffer: true, resolveStencilBuffer: true, depthTexture: null, samples: 0, count: 1 }, n);
    const r = new ue(i, n.mapping, n.wrapS, n.wrapT, n.magFilter, n.minFilter, n.format, n.type, n.anisotropy, n.colorSpace);
    r.flipY = false, r.generateMipmaps = n.generateMipmaps, r.internalFormat = n.internalFormat, this.textures = [];
    const a = n.count;
    for (let o = 0; o < a; o++) this.textures[o] = r.clone(), this.textures[o].isRenderTargetTexture = true;
    this.depthBuffer = n.depthBuffer, this.stencilBuffer = n.stencilBuffer, this.resolveDepthBuffer = n.resolveDepthBuffer, this.resolveStencilBuffer = n.resolveStencilBuffer, this.depthTexture = n.depthTexture, this.samples = n.samples;
  }
  get texture() {
    return this.textures[0];
  }
  set texture(t) {
    this.textures[0] = t;
  }
  setSize(t, e, n = 1) {
    if (this.width !== t || this.height !== e || this.depth !== n) {
      this.width = t, this.height = e, this.depth = n;
      for (let i = 0, r = this.textures.length; i < r; i++) this.textures[i].image.width = t, this.textures[i].image.height = e, this.textures[i].image.depth = n;
      this.dispose();
    }
    this.viewport.set(0, 0, t, e), this.scissor.set(0, 0, t, e);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    this.width = t.width, this.height = t.height, this.depth = t.depth, this.scissor.copy(t.scissor), this.scissorTest = t.scissorTest, this.viewport.copy(t.viewport), this.textures.length = 0;
    for (let n = 0, i = t.textures.length; n < i; n++) this.textures[n] = t.textures[n].clone(), this.textures[n].isRenderTargetTexture = true;
    const e = Object.assign({}, t.texture.image);
    return this.texture.source = new _i(e), this.depthBuffer = t.depthBuffer, this.stencilBuffer = t.stencilBuffer, this.resolveDepthBuffer = t.resolveDepthBuffer, this.resolveStencilBuffer = t.resolveStencilBuffer, t.depthTexture !== null && (this.depthTexture = t.depthTexture.clone()), this.samples = t.samples, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class rn extends Ed {
  constructor(t = 1, e = 1, n = {}) {
    super(t, e, n), this.isWebGLRenderTarget = true;
  }
}
class po extends ue {
  constructor(t = null, e = 1, n = 1, i = 1) {
    super(null), this.isDataArrayTexture = true, this.image = { data: t, width: e, height: n, depth: i }, this.magFilter = Me, this.minFilter = Me, this.wrapR = Qe, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
  }
  addLayerUpdate(t) {
    this.layerUpdates.add(t);
  }
  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}
class $p extends rn {
  constructor(t = 1, e = 1, n = 1, i = {}) {
    super(t, e, i), this.isWebGLArrayRenderTarget = true, this.depth = n, this.texture = new po(null, t, e, n), this.texture.isRenderTargetTexture = true;
  }
}
class hc extends ue {
  constructor(t = null, e = 1, n = 1, i = 1) {
    super(null), this.isData3DTexture = true, this.image = { data: t, width: e, height: n, depth: i }, this.magFilter = Me, this.minFilter = Me, this.wrapR = Qe, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
  }
}
class Kp extends rn {
  constructor(t = 1, e = 1, n = 1, i = {}) {
    super(t, e, i), this.isWebGL3DRenderTarget = true, this.depth = n, this.texture = new hc(null, t, e, n), this.texture.isRenderTargetTexture = true;
  }
}
class Ve {
  constructor(t = 0, e = 0, n = 0, i = 1) {
    this.isQuaternion = true, this._x = t, this._y = e, this._z = n, this._w = i;
  }
  static slerpFlat(t, e, n, i, r, a, o) {
    let l = n[i + 0], c = n[i + 1], h = n[i + 2], u = n[i + 3];
    const d = r[a + 0], f = r[a + 1], m = r[a + 2], _ = r[a + 3];
    if (o === 0) {
      t[e + 0] = l, t[e + 1] = c, t[e + 2] = h, t[e + 3] = u;
      return;
    }
    if (o === 1) {
      t[e + 0] = d, t[e + 1] = f, t[e + 2] = m, t[e + 3] = _;
      return;
    }
    if (u !== _ || l !== d || c !== f || h !== m) {
      let g = 1 - o;
      const p = l * d + c * f + h * m + u * _, y = p >= 0 ? 1 : -1, x = 1 - p * p;
      if (x > Number.EPSILON) {
        const I = Math.sqrt(x), E = Math.atan2(I, p * y);
        g = Math.sin(g * E) / I, o = Math.sin(o * E) / I;
      }
      const M = o * y;
      if (l = l * g + d * M, c = c * g + f * M, h = h * g + m * M, u = u * g + _ * M, g === 1 - o) {
        const I = 1 / Math.sqrt(l * l + c * c + h * h + u * u);
        l *= I, c *= I, h *= I, u *= I;
      }
    }
    t[e] = l, t[e + 1] = c, t[e + 2] = h, t[e + 3] = u;
  }
  static multiplyQuaternionsFlat(t, e, n, i, r, a) {
    const o = n[i], l = n[i + 1], c = n[i + 2], h = n[i + 3], u = r[a], d = r[a + 1], f = r[a + 2], m = r[a + 3];
    return t[e] = o * m + h * u + l * f - c * d, t[e + 1] = l * m + h * d + c * u - o * f, t[e + 2] = c * m + h * f + o * d - l * u, t[e + 3] = h * m - o * u - l * d - c * f, t;
  }
  get x() {
    return this._x;
  }
  set x(t) {
    this._x = t, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(t) {
    this._y = t, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(t) {
    this._z = t, this._onChangeCallback();
  }
  get w() {
    return this._w;
  }
  set w(t) {
    this._w = t, this._onChangeCallback();
  }
  set(t, e, n, i) {
    return this._x = t, this._y = e, this._z = n, this._w = i, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(t) {
    return this._x = t.x, this._y = t.y, this._z = t.z, this._w = t.w, this._onChangeCallback(), this;
  }
  setFromEuler(t, e = true) {
    const n = t._x, i = t._y, r = t._z, a = t._order, o = Math.cos, l = Math.sin, c = o(n / 2), h = o(i / 2), u = o(r / 2), d = l(n / 2), f = l(i / 2), m = l(r / 2);
    switch (a) {
      case "XYZ":
        this._x = d * h * u + c * f * m, this._y = c * f * u - d * h * m, this._z = c * h * m + d * f * u, this._w = c * h * u - d * f * m;
        break;
      case "YXZ":
        this._x = d * h * u + c * f * m, this._y = c * f * u - d * h * m, this._z = c * h * m - d * f * u, this._w = c * h * u + d * f * m;
        break;
      case "ZXY":
        this._x = d * h * u - c * f * m, this._y = c * f * u + d * h * m, this._z = c * h * m + d * f * u, this._w = c * h * u - d * f * m;
        break;
      case "ZYX":
        this._x = d * h * u - c * f * m, this._y = c * f * u + d * h * m, this._z = c * h * m - d * f * u, this._w = c * h * u + d * f * m;
        break;
      case "YZX":
        this._x = d * h * u + c * f * m, this._y = c * f * u + d * h * m, this._z = c * h * m - d * f * u, this._w = c * h * u - d * f * m;
        break;
      case "XZY":
        this._x = d * h * u - c * f * m, this._y = c * f * u - d * h * m, this._z = c * h * m + d * f * u, this._w = c * h * u + d * f * m;
        break;
      default:
        console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + a);
    }
    return e === true && this._onChangeCallback(), this;
  }
  setFromAxisAngle(t, e) {
    const n = e / 2, i = Math.sin(n);
    return this._x = t.x * i, this._y = t.y * i, this._z = t.z * i, this._w = Math.cos(n), this._onChangeCallback(), this;
  }
  setFromRotationMatrix(t) {
    const e = t.elements, n = e[0], i = e[4], r = e[8], a = e[1], o = e[5], l = e[9], c = e[2], h = e[6], u = e[10], d = n + o + u;
    if (d > 0) {
      const f = 0.5 / Math.sqrt(d + 1);
      this._w = 0.25 / f, this._x = (h - l) * f, this._y = (r - c) * f, this._z = (a - i) * f;
    } else if (n > o && n > u) {
      const f = 2 * Math.sqrt(1 + n - o - u);
      this._w = (h - l) / f, this._x = 0.25 * f, this._y = (i + a) / f, this._z = (r + c) / f;
    } else if (o > u) {
      const f = 2 * Math.sqrt(1 + o - n - u);
      this._w = (r - c) / f, this._x = (i + a) / f, this._y = 0.25 * f, this._z = (l + h) / f;
    } else {
      const f = 2 * Math.sqrt(1 + u - n - o);
      this._w = (a - i) / f, this._x = (r + c) / f, this._y = (l + h) / f, this._z = 0.25 * f;
    }
    return this._onChangeCallback(), this;
  }
  setFromUnitVectors(t, e) {
    let n = t.dot(e) + 1;
    return n < Number.EPSILON ? (n = 0, Math.abs(t.x) > Math.abs(t.z) ? (this._x = -t.y, this._y = t.x, this._z = 0, this._w = n) : (this._x = 0, this._y = -t.z, this._z = t.y, this._w = n)) : (this._x = t.y * e.z - t.z * e.y, this._y = t.z * e.x - t.x * e.z, this._z = t.x * e.y - t.y * e.x, this._w = n), this.normalize();
  }
  angleTo(t) {
    return 2 * Math.acos(Math.abs(he(this.dot(t), -1, 1)));
  }
  rotateTowards(t, e) {
    const n = this.angleTo(t);
    if (n === 0) return this;
    const i = Math.min(1, e / n);
    return this.slerp(t, i), this;
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  invert() {
    return this.conjugate();
  }
  conjugate() {
    return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
  }
  dot(t) {
    return this._x * t._x + this._y * t._y + this._z * t._z + this._w * t._w;
  }
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  normalize() {
    let t = this.length();
    return t === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (t = 1 / t, this._x = this._x * t, this._y = this._y * t, this._z = this._z * t, this._w = this._w * t), this._onChangeCallback(), this;
  }
  multiply(t) {
    return this.multiplyQuaternions(this, t);
  }
  premultiply(t) {
    return this.multiplyQuaternions(t, this);
  }
  multiplyQuaternions(t, e) {
    const n = t._x, i = t._y, r = t._z, a = t._w, o = e._x, l = e._y, c = e._z, h = e._w;
    return this._x = n * h + a * o + i * c - r * l, this._y = i * h + a * l + r * o - n * c, this._z = r * h + a * c + n * l - i * o, this._w = a * h - n * o - i * l - r * c, this._onChangeCallback(), this;
  }
  slerp(t, e) {
    if (e === 0) return this;
    if (e === 1) return this.copy(t);
    const n = this._x, i = this._y, r = this._z, a = this._w;
    let o = a * t._w + n * t._x + i * t._y + r * t._z;
    if (o < 0 ? (this._w = -t._w, this._x = -t._x, this._y = -t._y, this._z = -t._z, o = -o) : this.copy(t), o >= 1) return this._w = a, this._x = n, this._y = i, this._z = r, this;
    const l = 1 - o * o;
    if (l <= Number.EPSILON) {
      const f = 1 - e;
      return this._w = f * a + e * this._w, this._x = f * n + e * this._x, this._y = f * i + e * this._y, this._z = f * r + e * this._z, this.normalize(), this;
    }
    const c = Math.sqrt(l), h = Math.atan2(c, o), u = Math.sin((1 - e) * h) / c, d = Math.sin(e * h) / c;
    return this._w = a * u + this._w * d, this._x = n * u + this._x * d, this._y = i * u + this._y * d, this._z = r * u + this._z * d, this._onChangeCallback(), this;
  }
  slerpQuaternions(t, e, n) {
    return this.copy(t).slerp(e, n);
  }
  random() {
    const t = 2 * Math.PI * Math.random(), e = 2 * Math.PI * Math.random(), n = Math.random(), i = Math.sqrt(1 - n), r = Math.sqrt(n);
    return this.set(i * Math.sin(t), i * Math.cos(t), r * Math.sin(e), r * Math.cos(e));
  }
  equals(t) {
    return t._x === this._x && t._y === this._y && t._z === this._z && t._w === this._w;
  }
  fromArray(t, e = 0) {
    return this._x = t[e], this._y = t[e + 1], this._z = t[e + 2], this._w = t[e + 3], this._onChangeCallback(), this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._w, t;
  }
  fromBufferAttribute(t, e) {
    return this._x = t.getX(e), this._y = t.getY(e), this._z = t.getZ(e), this._w = t.getW(e), this._onChangeCallback(), this;
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(t) {
    return this._onChangeCallback = t, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
}
class C {
  constructor(t = 0, e = 0, n = 0) {
    C.prototype.isVector3 = true, this.x = t, this.y = e, this.z = n;
  }
  set(t, e, n) {
    return n === void 0 && (n = this.z), this.x = t, this.y = e, this.z = n, this;
  }
  setScalar(t) {
    return this.x = t, this.y = t, this.z = t, this;
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setZ(t) {
    return this.z = t, this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this.z += t.z, this;
  }
  addScalar(t) {
    return this.x += t, this.y += t, this.z += t, this;
  }
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this;
  }
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
  }
  subScalar(t) {
    return this.x -= t, this.y -= t, this.z -= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this;
  }
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this.z *= t.z, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this.z *= t, this;
  }
  multiplyVectors(t, e) {
    return this.x = t.x * e.x, this.y = t.y * e.y, this.z = t.z * e.z, this;
  }
  applyEuler(t) {
    return this.applyQuaternion($c.setFromEuler(t));
  }
  applyAxisAngle(t, e) {
    return this.applyQuaternion($c.setFromAxisAngle(t, e));
  }
  applyMatrix3(t) {
    const e = this.x, n = this.y, i = this.z, r = t.elements;
    return this.x = r[0] * e + r[3] * n + r[6] * i, this.y = r[1] * e + r[4] * n + r[7] * i, this.z = r[2] * e + r[5] * n + r[8] * i, this;
  }
  applyNormalMatrix(t) {
    return this.applyMatrix3(t).normalize();
  }
  applyMatrix4(t) {
    const e = this.x, n = this.y, i = this.z, r = t.elements, a = 1 / (r[3] * e + r[7] * n + r[11] * i + r[15]);
    return this.x = (r[0] * e + r[4] * n + r[8] * i + r[12]) * a, this.y = (r[1] * e + r[5] * n + r[9] * i + r[13]) * a, this.z = (r[2] * e + r[6] * n + r[10] * i + r[14]) * a, this;
  }
  applyQuaternion(t) {
    const e = this.x, n = this.y, i = this.z, r = t.x, a = t.y, o = t.z, l = t.w, c = 2 * (a * i - o * n), h = 2 * (o * e - r * i), u = 2 * (r * n - a * e);
    return this.x = e + l * c + a * u - o * h, this.y = n + l * h + o * c - r * u, this.z = i + l * u + r * h - a * c, this;
  }
  project(t) {
    return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix);
  }
  unproject(t) {
    return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld);
  }
  transformDirection(t) {
    const e = this.x, n = this.y, i = this.z, r = t.elements;
    return this.x = r[0] * e + r[4] * n + r[8] * i, this.y = r[1] * e + r[5] * n + r[9] * i, this.z = r[2] * e + r[6] * n + r[10] * i, this.normalize();
  }
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this.z /= t.z, this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this;
  }
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this;
  }
  clamp(t, e) {
    return this.x = Math.max(t.x, Math.min(e.x, this.x)), this.y = Math.max(t.y, Math.min(e.y, this.y)), this.z = Math.max(t.z, Math.min(e.z, this.z)), this;
  }
  clampScalar(t, e) {
    return this.x = Math.max(t, Math.min(e, this.x)), this.y = Math.max(t, Math.min(e, this.y)), this.z = Math.max(t, Math.min(e, this.z)), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Math.max(t, Math.min(e, n)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this;
  }
  lerpVectors(t, e, n) {
    return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this.z = t.z + (e.z - t.z) * n, this;
  }
  cross(t) {
    return this.crossVectors(this, t);
  }
  crossVectors(t, e) {
    const n = t.x, i = t.y, r = t.z, a = e.x, o = e.y, l = e.z;
    return this.x = i * l - r * o, this.y = r * a - n * l, this.z = n * o - i * a, this;
  }
  projectOnVector(t) {
    const e = t.lengthSq();
    if (e === 0) return this.set(0, 0, 0);
    const n = t.dot(this) / e;
    return this.copy(t).multiplyScalar(n);
  }
  projectOnPlane(t) {
    return qo.copy(this).projectOnVector(t), this.sub(qo);
  }
  reflect(t) {
    return this.sub(qo.copy(t).multiplyScalar(2 * this.dot(t)));
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(he(n, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x, n = this.y - t.y, i = this.z - t.z;
    return e * e + n * n + i * i;
  }
  manhattanDistanceTo(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y) + Math.abs(this.z - t.z);
  }
  setFromSpherical(t) {
    return this.setFromSphericalCoords(t.radius, t.phi, t.theta);
  }
  setFromSphericalCoords(t, e, n) {
    const i = Math.sin(e) * t;
    return this.x = i * Math.sin(n), this.y = Math.cos(e) * t, this.z = i * Math.cos(n), this;
  }
  setFromCylindrical(t) {
    return this.setFromCylindricalCoords(t.radius, t.theta, t.y);
  }
  setFromCylindricalCoords(t, e, n) {
    return this.x = t * Math.sin(e), this.y = n, this.z = t * Math.cos(e), this;
  }
  setFromMatrixPosition(t) {
    const e = t.elements;
    return this.x = e[12], this.y = e[13], this.z = e[14], this;
  }
  setFromMatrixScale(t) {
    const e = this.setFromMatrixColumn(t, 0).length(), n = this.setFromMatrixColumn(t, 1).length(), i = this.setFromMatrixColumn(t, 2).length();
    return this.x = e, this.y = n, this.z = i, this;
  }
  setFromMatrixColumn(t, e) {
    return this.fromArray(t.elements, e * 4);
  }
  setFromMatrix3Column(t, e) {
    return this.fromArray(t.elements, e * 3);
  }
  setFromEuler(t) {
    return this.x = t._x, this.y = t._y, this.z = t._z, this;
  }
  setFromColor(t) {
    return this.x = t.r, this.y = t.g, this.z = t.b, this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z;
  }
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t;
  }
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
  }
  randomDirection() {
    const t = Math.random() * Math.PI * 2, e = Math.random() * 2 - 1, n = Math.sqrt(1 - e * e);
    return this.x = n * Math.cos(t), this.y = e, this.z = n * Math.sin(t), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z;
  }
}
const qo = new C(), $c = new Ve();
class Ue {
  constructor(t = new C(1 / 0, 1 / 0, 1 / 0), e = new C(-1 / 0, -1 / 0, -1 / 0)) {
    this.isBox3 = true, this.min = t, this.max = e;
  }
  set(t, e) {
    return this.min.copy(t), this.max.copy(e), this;
  }
  setFromArray(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e += 3) this.expandByPoint(tn.fromArray(t, e));
    return this;
  }
  setFromBufferAttribute(t) {
    this.makeEmpty();
    for (let e = 0, n = t.count; e < n; e++) this.expandByPoint(tn.fromBufferAttribute(t, e));
    return this;
  }
  setFromPoints(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e++) this.expandByPoint(t[e]);
    return this;
  }
  setFromCenterAndSize(t, e) {
    const n = tn.copy(e).multiplyScalar(0.5);
    return this.min.copy(t).sub(n), this.max.copy(t).add(n), this;
  }
  setFromObject(t, e = false) {
    return this.makeEmpty(), this.expandByObject(t, e);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.min.copy(t.min), this.max.copy(t.max), this;
  }
  makeEmpty() {
    return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }
  getCenter(t) {
    return this.isEmpty() ? t.set(0, 0, 0) : t.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(t) {
    return this.isEmpty() ? t.set(0, 0, 0) : t.subVectors(this.max, this.min);
  }
  expandByPoint(t) {
    return this.min.min(t), this.max.max(t), this;
  }
  expandByVector(t) {
    return this.min.sub(t), this.max.add(t), this;
  }
  expandByScalar(t) {
    return this.min.addScalar(-t), this.max.addScalar(t), this;
  }
  expandByObject(t, e = false) {
    t.updateWorldMatrix(false, false);
    const n = t.geometry;
    if (n !== void 0) {
      const r = n.getAttribute("position");
      if (e === true && r !== void 0 && t.isInstancedMesh !== true) for (let a = 0, o = r.count; a < o; a++) t.isMesh === true ? t.getVertexPosition(a, tn) : tn.fromBufferAttribute(r, a), tn.applyMatrix4(t.matrixWorld), this.expandByPoint(tn);
      else t.boundingBox !== void 0 ? (t.boundingBox === null && t.computeBoundingBox(), Mr.copy(t.boundingBox)) : (n.boundingBox === null && n.computeBoundingBox(), Mr.copy(n.boundingBox)), Mr.applyMatrix4(t.matrixWorld), this.union(Mr);
    }
    const i = t.children;
    for (let r = 0, a = i.length; r < a; r++) this.expandByObject(i[r], e);
    return this;
  }
  containsPoint(t) {
    return t.x >= this.min.x && t.x <= this.max.x && t.y >= this.min.y && t.y <= this.max.y && t.z >= this.min.z && t.z <= this.max.z;
  }
  containsBox(t) {
    return this.min.x <= t.min.x && t.max.x <= this.max.x && this.min.y <= t.min.y && t.max.y <= this.max.y && this.min.z <= t.min.z && t.max.z <= this.max.z;
  }
  getParameter(t, e) {
    return e.set((t.x - this.min.x) / (this.max.x - this.min.x), (t.y - this.min.y) / (this.max.y - this.min.y), (t.z - this.min.z) / (this.max.z - this.min.z));
  }
  intersectsBox(t) {
    return t.max.x >= this.min.x && t.min.x <= this.max.x && t.max.y >= this.min.y && t.min.y <= this.max.y && t.max.z >= this.min.z && t.min.z <= this.max.z;
  }
  intersectsSphere(t) {
    return this.clampPoint(t.center, tn), tn.distanceToSquared(t.center) <= t.radius * t.radius;
  }
  intersectsPlane(t) {
    let e, n;
    return t.normal.x > 0 ? (e = t.normal.x * this.min.x, n = t.normal.x * this.max.x) : (e = t.normal.x * this.max.x, n = t.normal.x * this.min.x), t.normal.y > 0 ? (e += t.normal.y * this.min.y, n += t.normal.y * this.max.y) : (e += t.normal.y * this.max.y, n += t.normal.y * this.min.y), t.normal.z > 0 ? (e += t.normal.z * this.min.z, n += t.normal.z * this.max.z) : (e += t.normal.z * this.max.z, n += t.normal.z * this.min.z), e <= -t.constant && n >= -t.constant;
  }
  intersectsTriangle(t) {
    if (this.isEmpty()) return false;
    this.getCenter(ms), Sr.subVectors(this.max, ms), Ui.subVectors(t.a, ms), Ni.subVectors(t.b, ms), Fi.subVectors(t.c, ms), Fn.subVectors(Ni, Ui), On.subVectors(Fi, Ni), ti.subVectors(Ui, Fi);
    let e = [0, -Fn.z, Fn.y, 0, -On.z, On.y, 0, -ti.z, ti.y, Fn.z, 0, -Fn.x, On.z, 0, -On.x, ti.z, 0, -ti.x, -Fn.y, Fn.x, 0, -On.y, On.x, 0, -ti.y, ti.x, 0];
    return !Yo(e, Ui, Ni, Fi, Sr) || (e = [1, 0, 0, 0, 1, 0, 0, 0, 1], !Yo(e, Ui, Ni, Fi, Sr)) ? false : (br.crossVectors(Fn, On), e = [br.x, br.y, br.z], Yo(e, Ui, Ni, Fi, Sr));
  }
  clampPoint(t, e) {
    return e.copy(t).clamp(this.min, this.max);
  }
  distanceToPoint(t) {
    return this.clampPoint(t, tn).distanceTo(t);
  }
  getBoundingSphere(t) {
    return this.isEmpty() ? t.makeEmpty() : (this.getCenter(t.center), t.radius = this.getSize(tn).length() * 0.5), t;
  }
  intersect(t) {
    return this.min.max(t.min), this.max.min(t.max), this.isEmpty() && this.makeEmpty(), this;
  }
  union(t) {
    return this.min.min(t.min), this.max.max(t.max), this;
  }
  applyMatrix4(t) {
    return this.isEmpty() ? this : (vn[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(t), vn[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(t), vn[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(t), vn[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(t), vn[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(t), vn[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(t), vn[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(t), vn[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(t), this.setFromPoints(vn), this);
  }
  translate(t) {
    return this.min.add(t), this.max.add(t), this;
  }
  equals(t) {
    return t.min.equals(this.min) && t.max.equals(this.max);
  }
}
const vn = [new C(), new C(), new C(), new C(), new C(), new C(), new C(), new C()], tn = new C(), Mr = new Ue(), Ui = new C(), Ni = new C(), Fi = new C(), Fn = new C(), On = new C(), ti = new C(), ms = new C(), Sr = new C(), br = new C(), ei = new C();
function Yo(s, t, e, n, i) {
  for (let r = 0, a = s.length - 3; r <= a; r += 3) {
    ei.fromArray(s, r);
    const o = i.x * Math.abs(ei.x) + i.y * Math.abs(ei.y) + i.z * Math.abs(ei.z), l = t.dot(ei), c = e.dot(ei), h = n.dot(ei);
    if (Math.max(-Math.max(l, c, h), Math.min(l, c, h)) > o) return false;
  }
  return true;
}
const Qp = new Ue(), gs = new C(), Zo = new C();
class Te {
  constructor(t = new C(), e = -1) {
    this.isSphere = true, this.center = t, this.radius = e;
  }
  set(t, e) {
    return this.center.copy(t), this.radius = e, this;
  }
  setFromPoints(t, e) {
    const n = this.center;
    e !== void 0 ? n.copy(e) : Qp.setFromPoints(t).getCenter(n);
    let i = 0;
    for (let r = 0, a = t.length; r < a; r++) i = Math.max(i, n.distanceToSquared(t[r]));
    return this.radius = Math.sqrt(i), this;
  }
  copy(t) {
    return this.center.copy(t.center), this.radius = t.radius, this;
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    return this.center.set(0, 0, 0), this.radius = -1, this;
  }
  containsPoint(t) {
    return t.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(t) {
    return t.distanceTo(this.center) - this.radius;
  }
  intersectsSphere(t) {
    const e = this.radius + t.radius;
    return t.center.distanceToSquared(this.center) <= e * e;
  }
  intersectsBox(t) {
    return t.intersectsSphere(this);
  }
  intersectsPlane(t) {
    return Math.abs(t.distanceToPoint(this.center)) <= this.radius;
  }
  clampPoint(t, e) {
    const n = this.center.distanceToSquared(t);
    return e.copy(t), n > this.radius * this.radius && (e.sub(this.center).normalize(), e.multiplyScalar(this.radius).add(this.center)), e;
  }
  getBoundingBox(t) {
    return this.isEmpty() ? (t.makeEmpty(), t) : (t.set(this.center, this.center), t.expandByScalar(this.radius), t);
  }
  applyMatrix4(t) {
    return this.center.applyMatrix4(t), this.radius = this.radius * t.getMaxScaleOnAxis(), this;
  }
  translate(t) {
    return this.center.add(t), this;
  }
  expandByPoint(t) {
    if (this.isEmpty()) return this.center.copy(t), this.radius = 0, this;
    gs.subVectors(t, this.center);
    const e = gs.lengthSq();
    if (e > this.radius * this.radius) {
      const n = Math.sqrt(e), i = (n - this.radius) * 0.5;
      this.center.addScaledVector(gs, i / n), this.radius += i;
    }
    return this;
  }
  union(t) {
    return t.isEmpty() ? this : this.isEmpty() ? (this.copy(t), this) : (this.center.equals(t.center) === true ? this.radius = Math.max(this.radius, t.radius) : (Zo.subVectors(t.center, this.center).setLength(t.radius), this.expandByPoint(gs.copy(t.center).add(Zo)), this.expandByPoint(gs.copy(t.center).sub(Zo))), this);
  }
  equals(t) {
    return t.center.equals(this.center) && t.radius === this.radius;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const yn = new C(), Jo = new C(), wr = new C(), Bn = new C(), $o = new C(), Er = new C(), Ko = new C();
class hs {
  constructor(t = new C(), e = new C(0, 0, -1)) {
    this.origin = t, this.direction = e;
  }
  set(t, e) {
    return this.origin.copy(t), this.direction.copy(e), this;
  }
  copy(t) {
    return this.origin.copy(t.origin), this.direction.copy(t.direction), this;
  }
  at(t, e) {
    return e.copy(this.origin).addScaledVector(this.direction, t);
  }
  lookAt(t) {
    return this.direction.copy(t).sub(this.origin).normalize(), this;
  }
  recast(t) {
    return this.origin.copy(this.at(t, yn)), this;
  }
  closestPointToPoint(t, e) {
    e.subVectors(t, this.origin);
    const n = e.dot(this.direction);
    return n < 0 ? e.copy(this.origin) : e.copy(this.origin).addScaledVector(this.direction, n);
  }
  distanceToPoint(t) {
    return Math.sqrt(this.distanceSqToPoint(t));
  }
  distanceSqToPoint(t) {
    const e = yn.subVectors(t, this.origin).dot(this.direction);
    return e < 0 ? this.origin.distanceToSquared(t) : (yn.copy(this.origin).addScaledVector(this.direction, e), yn.distanceToSquared(t));
  }
  distanceSqToSegment(t, e, n, i) {
    Jo.copy(t).add(e).multiplyScalar(0.5), wr.copy(e).sub(t).normalize(), Bn.copy(this.origin).sub(Jo);
    const r = t.distanceTo(e) * 0.5, a = -this.direction.dot(wr), o = Bn.dot(this.direction), l = -Bn.dot(wr), c = Bn.lengthSq(), h = Math.abs(1 - a * a);
    let u, d, f, m;
    if (h > 0) if (u = a * l - o, d = a * o - l, m = r * h, u >= 0) if (d >= -m) if (d <= m) {
      const _ = 1 / h;
      u *= _, d *= _, f = u * (u + a * d + 2 * o) + d * (a * u + d + 2 * l) + c;
    } else d = r, u = Math.max(0, -(a * d + o)), f = -u * u + d * (d + 2 * l) + c;
    else d = -r, u = Math.max(0, -(a * d + o)), f = -u * u + d * (d + 2 * l) + c;
    else d <= -m ? (u = Math.max(0, -(-a * r + o)), d = u > 0 ? -r : Math.min(Math.max(-r, -l), r), f = -u * u + d * (d + 2 * l) + c) : d <= m ? (u = 0, d = Math.min(Math.max(-r, -l), r), f = d * (d + 2 * l) + c) : (u = Math.max(0, -(a * r + o)), d = u > 0 ? r : Math.min(Math.max(-r, -l), r), f = -u * u + d * (d + 2 * l) + c);
    else d = a > 0 ? -r : r, u = Math.max(0, -(a * d + o)), f = -u * u + d * (d + 2 * l) + c;
    return n && n.copy(this.origin).addScaledVector(this.direction, u), i && i.copy(Jo).addScaledVector(wr, d), f;
  }
  intersectSphere(t, e) {
    yn.subVectors(t.center, this.origin);
    const n = yn.dot(this.direction), i = yn.dot(yn) - n * n, r = t.radius * t.radius;
    if (i > r) return null;
    const a = Math.sqrt(r - i), o = n - a, l = n + a;
    return l < 0 ? null : o < 0 ? this.at(l, e) : this.at(o, e);
  }
  intersectsSphere(t) {
    return this.distanceSqToPoint(t.center) <= t.radius * t.radius;
  }
  distanceToPlane(t) {
    const e = t.normal.dot(this.direction);
    if (e === 0) return t.distanceToPoint(this.origin) === 0 ? 0 : null;
    const n = -(this.origin.dot(t.normal) + t.constant) / e;
    return n >= 0 ? n : null;
  }
  intersectPlane(t, e) {
    const n = this.distanceToPlane(t);
    return n === null ? null : this.at(n, e);
  }
  intersectsPlane(t) {
    const e = t.distanceToPoint(this.origin);
    return e === 0 || t.normal.dot(this.direction) * e < 0;
  }
  intersectBox(t, e) {
    let n, i, r, a, o, l;
    const c = 1 / this.direction.x, h = 1 / this.direction.y, u = 1 / this.direction.z, d = this.origin;
    return c >= 0 ? (n = (t.min.x - d.x) * c, i = (t.max.x - d.x) * c) : (n = (t.max.x - d.x) * c, i = (t.min.x - d.x) * c), h >= 0 ? (r = (t.min.y - d.y) * h, a = (t.max.y - d.y) * h) : (r = (t.max.y - d.y) * h, a = (t.min.y - d.y) * h), n > a || r > i || ((r > n || isNaN(n)) && (n = r), (a < i || isNaN(i)) && (i = a), u >= 0 ? (o = (t.min.z - d.z) * u, l = (t.max.z - d.z) * u) : (o = (t.max.z - d.z) * u, l = (t.min.z - d.z) * u), n > l || o > i) || ((o > n || n !== n) && (n = o), (l < i || i !== i) && (i = l), i < 0) ? null : this.at(n >= 0 ? n : i, e);
  }
  intersectsBox(t) {
    return this.intersectBox(t, yn) !== null;
  }
  intersectTriangle(t, e, n, i, r) {
    $o.subVectors(e, t), Er.subVectors(n, t), Ko.crossVectors($o, Er);
    let a = this.direction.dot(Ko), o;
    if (a > 0) {
      if (i) return null;
      o = 1;
    } else if (a < 0) o = -1, a = -a;
    else return null;
    Bn.subVectors(this.origin, t);
    const l = o * this.direction.dot(Er.crossVectors(Bn, Er));
    if (l < 0) return null;
    const c = o * this.direction.dot($o.cross(Bn));
    if (c < 0 || l + c > a) return null;
    const h = -o * Bn.dot(Ko);
    return h < 0 ? null : this.at(h / a, r);
  }
  applyMatrix4(t) {
    return this.origin.applyMatrix4(t), this.direction.transformDirection(t), this;
  }
  equals(t) {
    return t.origin.equals(this.origin) && t.direction.equals(this.direction);
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class Pt {
  constructor(t, e, n, i, r, a, o, l, c, h, u, d, f, m, _, g) {
    Pt.prototype.isMatrix4 = true, this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], t !== void 0 && this.set(t, e, n, i, r, a, o, l, c, h, u, d, f, m, _, g);
  }
  set(t, e, n, i, r, a, o, l, c, h, u, d, f, m, _, g) {
    const p = this.elements;
    return p[0] = t, p[4] = e, p[8] = n, p[12] = i, p[1] = r, p[5] = a, p[9] = o, p[13] = l, p[2] = c, p[6] = h, p[10] = u, p[14] = d, p[3] = f, p[7] = m, p[11] = _, p[15] = g, this;
  }
  identity() {
    return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
  }
  clone() {
    return new Pt().fromArray(this.elements);
  }
  copy(t) {
    const e = this.elements, n = t.elements;
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], e[9] = n[9], e[10] = n[10], e[11] = n[11], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15], this;
  }
  copyPosition(t) {
    const e = this.elements, n = t.elements;
    return e[12] = n[12], e[13] = n[13], e[14] = n[14], this;
  }
  setFromMatrix3(t) {
    const e = t.elements;
    return this.set(e[0], e[3], e[6], 0, e[1], e[4], e[7], 0, e[2], e[5], e[8], 0, 0, 0, 0, 1), this;
  }
  extractBasis(t, e, n) {
    return t.setFromMatrixColumn(this, 0), e.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this;
  }
  makeBasis(t, e, n) {
    return this.set(t.x, e.x, n.x, 0, t.y, e.y, n.y, 0, t.z, e.z, n.z, 0, 0, 0, 0, 1), this;
  }
  extractRotation(t) {
    const e = this.elements, n = t.elements, i = 1 / Oi.setFromMatrixColumn(t, 0).length(), r = 1 / Oi.setFromMatrixColumn(t, 1).length(), a = 1 / Oi.setFromMatrixColumn(t, 2).length();
    return e[0] = n[0] * i, e[1] = n[1] * i, e[2] = n[2] * i, e[3] = 0, e[4] = n[4] * r, e[5] = n[5] * r, e[6] = n[6] * r, e[7] = 0, e[8] = n[8] * a, e[9] = n[9] * a, e[10] = n[10] * a, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
  }
  makeRotationFromEuler(t) {
    const e = this.elements, n = t.x, i = t.y, r = t.z, a = Math.cos(n), o = Math.sin(n), l = Math.cos(i), c = Math.sin(i), h = Math.cos(r), u = Math.sin(r);
    if (t.order === "XYZ") {
      const d = a * h, f = a * u, m = o * h, _ = o * u;
      e[0] = l * h, e[4] = -l * u, e[8] = c, e[1] = f + m * c, e[5] = d - _ * c, e[9] = -o * l, e[2] = _ - d * c, e[6] = m + f * c, e[10] = a * l;
    } else if (t.order === "YXZ") {
      const d = l * h, f = l * u, m = c * h, _ = c * u;
      e[0] = d + _ * o, e[4] = m * o - f, e[8] = a * c, e[1] = a * u, e[5] = a * h, e[9] = -o, e[2] = f * o - m, e[6] = _ + d * o, e[10] = a * l;
    } else if (t.order === "ZXY") {
      const d = l * h, f = l * u, m = c * h, _ = c * u;
      e[0] = d - _ * o, e[4] = -a * u, e[8] = m + f * o, e[1] = f + m * o, e[5] = a * h, e[9] = _ - d * o, e[2] = -a * c, e[6] = o, e[10] = a * l;
    } else if (t.order === "ZYX") {
      const d = a * h, f = a * u, m = o * h, _ = o * u;
      e[0] = l * h, e[4] = m * c - f, e[8] = d * c + _, e[1] = l * u, e[5] = _ * c + d, e[9] = f * c - m, e[2] = -c, e[6] = o * l, e[10] = a * l;
    } else if (t.order === "YZX") {
      const d = a * l, f = a * c, m = o * l, _ = o * c;
      e[0] = l * h, e[4] = _ - d * u, e[8] = m * u + f, e[1] = u, e[5] = a * h, e[9] = -o * h, e[2] = -c * h, e[6] = f * u + m, e[10] = d - _ * u;
    } else if (t.order === "XZY") {
      const d = a * l, f = a * c, m = o * l, _ = o * c;
      e[0] = l * h, e[4] = -u, e[8] = c * h, e[1] = d * u + _, e[5] = a * h, e[9] = f * u - m, e[2] = m * u - f, e[6] = o * h, e[10] = _ * u + d;
    }
    return e[3] = 0, e[7] = 0, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
  }
  makeRotationFromQuaternion(t) {
    return this.compose(jp, t, tm);
  }
  lookAt(t, e, n) {
    const i = this.elements;
    return Xe.subVectors(t, e), Xe.lengthSq() === 0 && (Xe.z = 1), Xe.normalize(), zn.crossVectors(n, Xe), zn.lengthSq() === 0 && (Math.abs(n.z) === 1 ? Xe.x += 1e-4 : Xe.z += 1e-4, Xe.normalize(), zn.crossVectors(n, Xe)), zn.normalize(), Ar.crossVectors(Xe, zn), i[0] = zn.x, i[4] = Ar.x, i[8] = Xe.x, i[1] = zn.y, i[5] = Ar.y, i[9] = Xe.y, i[2] = zn.z, i[6] = Ar.z, i[10] = Xe.z, this;
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const n = t.elements, i = e.elements, r = this.elements, a = n[0], o = n[4], l = n[8], c = n[12], h = n[1], u = n[5], d = n[9], f = n[13], m = n[2], _ = n[6], g = n[10], p = n[14], y = n[3], x = n[7], M = n[11], I = n[15], E = i[0], A = i[4], P = i[8], V = i[12], v = i[1], b = i[5], k = i[9], B = i[13], H = i[2], Q = i[6], O = i[10], tt = i[14], W = i[3], ht = i[7], pt = i[11], mt = i[15];
    return r[0] = a * E + o * v + l * H + c * W, r[4] = a * A + o * b + l * Q + c * ht, r[8] = a * P + o * k + l * O + c * pt, r[12] = a * V + o * B + l * tt + c * mt, r[1] = h * E + u * v + d * H + f * W, r[5] = h * A + u * b + d * Q + f * ht, r[9] = h * P + u * k + d * O + f * pt, r[13] = h * V + u * B + d * tt + f * mt, r[2] = m * E + _ * v + g * H + p * W, r[6] = m * A + _ * b + g * Q + p * ht, r[10] = m * P + _ * k + g * O + p * pt, r[14] = m * V + _ * B + g * tt + p * mt, r[3] = y * E + x * v + M * H + I * W, r[7] = y * A + x * b + M * Q + I * ht, r[11] = y * P + x * k + M * O + I * pt, r[15] = y * V + x * B + M * tt + I * mt, this;
  }
  multiplyScalar(t) {
    const e = this.elements;
    return e[0] *= t, e[4] *= t, e[8] *= t, e[12] *= t, e[1] *= t, e[5] *= t, e[9] *= t, e[13] *= t, e[2] *= t, e[6] *= t, e[10] *= t, e[14] *= t, e[3] *= t, e[7] *= t, e[11] *= t, e[15] *= t, this;
  }
  determinant() {
    const t = this.elements, e = t[0], n = t[4], i = t[8], r = t[12], a = t[1], o = t[5], l = t[9], c = t[13], h = t[2], u = t[6], d = t[10], f = t[14], m = t[3], _ = t[7], g = t[11], p = t[15];
    return m * (+r * l * u - i * c * u - r * o * d + n * c * d + i * o * f - n * l * f) + _ * (+e * l * f - e * c * d + r * a * d - i * a * f + i * c * h - r * l * h) + g * (+e * c * u - e * o * f - r * a * u + n * a * f + r * o * h - n * c * h) + p * (-i * o * h - e * l * u + e * o * d + i * a * u - n * a * d + n * l * h);
  }
  transpose() {
    const t = this.elements;
    let e;
    return e = t[1], t[1] = t[4], t[4] = e, e = t[2], t[2] = t[8], t[8] = e, e = t[6], t[6] = t[9], t[9] = e, e = t[3], t[3] = t[12], t[12] = e, e = t[7], t[7] = t[13], t[13] = e, e = t[11], t[11] = t[14], t[14] = e, this;
  }
  setPosition(t, e, n) {
    const i = this.elements;
    return t.isVector3 ? (i[12] = t.x, i[13] = t.y, i[14] = t.z) : (i[12] = t, i[13] = e, i[14] = n), this;
  }
  invert() {
    const t = this.elements, e = t[0], n = t[1], i = t[2], r = t[3], a = t[4], o = t[5], l = t[6], c = t[7], h = t[8], u = t[9], d = t[10], f = t[11], m = t[12], _ = t[13], g = t[14], p = t[15], y = u * g * c - _ * d * c + _ * l * f - o * g * f - u * l * p + o * d * p, x = m * d * c - h * g * c - m * l * f + a * g * f + h * l * p - a * d * p, M = h * _ * c - m * u * c + m * o * f - a * _ * f - h * o * p + a * u * p, I = m * u * l - h * _ * l - m * o * d + a * _ * d + h * o * g - a * u * g, E = e * y + n * x + i * M + r * I;
    if (E === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const A = 1 / E;
    return t[0] = y * A, t[1] = (_ * d * r - u * g * r - _ * i * f + n * g * f + u * i * p - n * d * p) * A, t[2] = (o * g * r - _ * l * r + _ * i * c - n * g * c - o * i * p + n * l * p) * A, t[3] = (u * l * r - o * d * r - u * i * c + n * d * c + o * i * f - n * l * f) * A, t[4] = x * A, t[5] = (h * g * r - m * d * r + m * i * f - e * g * f - h * i * p + e * d * p) * A, t[6] = (m * l * r - a * g * r - m * i * c + e * g * c + a * i * p - e * l * p) * A, t[7] = (a * d * r - h * l * r + h * i * c - e * d * c - a * i * f + e * l * f) * A, t[8] = M * A, t[9] = (m * u * r - h * _ * r - m * n * f + e * _ * f + h * n * p - e * u * p) * A, t[10] = (a * _ * r - m * o * r + m * n * c - e * _ * c - a * n * p + e * o * p) * A, t[11] = (h * o * r - a * u * r - h * n * c + e * u * c + a * n * f - e * o * f) * A, t[12] = I * A, t[13] = (h * _ * i - m * u * i + m * n * d - e * _ * d - h * n * g + e * u * g) * A, t[14] = (m * o * i - a * _ * i - m * n * l + e * _ * l + a * n * g - e * o * g) * A, t[15] = (a * u * i - h * o * i + h * n * l - e * u * l - a * n * d + e * o * d) * A, this;
  }
  scale(t) {
    const e = this.elements, n = t.x, i = t.y, r = t.z;
    return e[0] *= n, e[4] *= i, e[8] *= r, e[1] *= n, e[5] *= i, e[9] *= r, e[2] *= n, e[6] *= i, e[10] *= r, e[3] *= n, e[7] *= i, e[11] *= r, this;
  }
  getMaxScaleOnAxis() {
    const t = this.elements, e = t[0] * t[0] + t[1] * t[1] + t[2] * t[2], n = t[4] * t[4] + t[5] * t[5] + t[6] * t[6], i = t[8] * t[8] + t[9] * t[9] + t[10] * t[10];
    return Math.sqrt(Math.max(e, n, i));
  }
  makeTranslation(t, e, n) {
    return t.isVector3 ? this.set(1, 0, 0, t.x, 0, 1, 0, t.y, 0, 0, 1, t.z, 0, 0, 0, 1) : this.set(1, 0, 0, t, 0, 1, 0, e, 0, 0, 1, n, 0, 0, 0, 1), this;
  }
  makeRotationX(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(1, 0, 0, 0, 0, e, -n, 0, 0, n, e, 0, 0, 0, 0, 1), this;
  }
  makeRotationY(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(e, 0, n, 0, 0, 1, 0, 0, -n, 0, e, 0, 0, 0, 0, 1), this;
  }
  makeRotationZ(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(e, -n, 0, 0, n, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
  }
  makeRotationAxis(t, e) {
    const n = Math.cos(e), i = Math.sin(e), r = 1 - n, a = t.x, o = t.y, l = t.z, c = r * a, h = r * o;
    return this.set(c * a + n, c * o - i * l, c * l + i * o, 0, c * o + i * l, h * o + n, h * l - i * a, 0, c * l - i * o, h * l + i * a, r * l * l + n, 0, 0, 0, 0, 1), this;
  }
  makeScale(t, e, n) {
    return this.set(t, 0, 0, 0, 0, e, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this;
  }
  makeShear(t, e, n, i, r, a) {
    return this.set(1, n, r, 0, t, 1, a, 0, e, i, 1, 0, 0, 0, 0, 1), this;
  }
  compose(t, e, n) {
    const i = this.elements, r = e._x, a = e._y, o = e._z, l = e._w, c = r + r, h = a + a, u = o + o, d = r * c, f = r * h, m = r * u, _ = a * h, g = a * u, p = o * u, y = l * c, x = l * h, M = l * u, I = n.x, E = n.y, A = n.z;
    return i[0] = (1 - (_ + p)) * I, i[1] = (f + M) * I, i[2] = (m - x) * I, i[3] = 0, i[4] = (f - M) * E, i[5] = (1 - (d + p)) * E, i[6] = (g + y) * E, i[7] = 0, i[8] = (m + x) * A, i[9] = (g - y) * A, i[10] = (1 - (d + _)) * A, i[11] = 0, i[12] = t.x, i[13] = t.y, i[14] = t.z, i[15] = 1, this;
  }
  decompose(t, e, n) {
    const i = this.elements;
    let r = Oi.set(i[0], i[1], i[2]).length();
    const a = Oi.set(i[4], i[5], i[6]).length(), o = Oi.set(i[8], i[9], i[10]).length();
    this.determinant() < 0 && (r = -r), t.x = i[12], t.y = i[13], t.z = i[14], en.copy(this);
    const c = 1 / r, h = 1 / a, u = 1 / o;
    return en.elements[0] *= c, en.elements[1] *= c, en.elements[2] *= c, en.elements[4] *= h, en.elements[5] *= h, en.elements[6] *= h, en.elements[8] *= u, en.elements[9] *= u, en.elements[10] *= u, e.setFromRotationMatrix(en), n.x = r, n.y = a, n.z = o, this;
  }
  makePerspective(t, e, n, i, r, a, o = dn) {
    const l = this.elements, c = 2 * r / (e - t), h = 2 * r / (n - i), u = (e + t) / (e - t), d = (n + i) / (n - i);
    let f, m;
    if (o === dn) f = -(a + r) / (a - r), m = -2 * a * r / (a - r);
    else if (o === Ks) f = -a / (a - r), m = -a * r / (a - r);
    else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
    return l[0] = c, l[4] = 0, l[8] = u, l[12] = 0, l[1] = 0, l[5] = h, l[9] = d, l[13] = 0, l[2] = 0, l[6] = 0, l[10] = f, l[14] = m, l[3] = 0, l[7] = 0, l[11] = -1, l[15] = 0, this;
  }
  makeOrthographic(t, e, n, i, r, a, o = dn) {
    const l = this.elements, c = 1 / (e - t), h = 1 / (n - i), u = 1 / (a - r), d = (e + t) * c, f = (n + i) * h;
    let m, _;
    if (o === dn) m = (a + r) * u, _ = -2 * u;
    else if (o === Ks) m = r * u, _ = -1 * u;
    else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
    return l[0] = 2 * c, l[4] = 0, l[8] = 0, l[12] = -d, l[1] = 0, l[5] = 2 * h, l[9] = 0, l[13] = -f, l[2] = 0, l[6] = 0, l[10] = _, l[14] = -m, l[3] = 0, l[7] = 0, l[11] = 0, l[15] = 1, this;
  }
  equals(t) {
    const e = this.elements, n = t.elements;
    for (let i = 0; i < 16; i++) if (e[i] !== n[i]) return false;
    return true;
  }
  fromArray(t, e = 0) {
    for (let n = 0; n < 16; n++) this.elements[n] = t[n + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const n = this.elements;
    return t[e] = n[0], t[e + 1] = n[1], t[e + 2] = n[2], t[e + 3] = n[3], t[e + 4] = n[4], t[e + 5] = n[5], t[e + 6] = n[6], t[e + 7] = n[7], t[e + 8] = n[8], t[e + 9] = n[9], t[e + 10] = n[10], t[e + 11] = n[11], t[e + 12] = n[12], t[e + 13] = n[13], t[e + 14] = n[14], t[e + 15] = n[15], t;
  }
}
const Oi = new C(), en = new Pt(), jp = new C(0, 0, 0), tm = new C(1, 1, 1), zn = new C(), Ar = new C(), Xe = new C(), Kc = new Pt(), Qc = new Ve();
class Ze {
  constructor(t = 0, e = 0, n = 0, i = Ze.DEFAULT_ORDER) {
    this.isEuler = true, this._x = t, this._y = e, this._z = n, this._order = i;
  }
  get x() {
    return this._x;
  }
  set x(t) {
    this._x = t, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(t) {
    this._y = t, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(t) {
    this._z = t, this._onChangeCallback();
  }
  get order() {
    return this._order;
  }
  set order(t) {
    this._order = t, this._onChangeCallback();
  }
  set(t, e, n, i = this._order) {
    return this._x = t, this._y = e, this._z = n, this._order = i, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(t) {
    return this._x = t._x, this._y = t._y, this._z = t._z, this._order = t._order, this._onChangeCallback(), this;
  }
  setFromRotationMatrix(t, e = this._order, n = true) {
    const i = t.elements, r = i[0], a = i[4], o = i[8], l = i[1], c = i[5], h = i[9], u = i[2], d = i[6], f = i[10];
    switch (e) {
      case "XYZ":
        this._y = Math.asin(he(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(-h, f), this._z = Math.atan2(-a, r)) : (this._x = Math.atan2(d, c), this._z = 0);
        break;
      case "YXZ":
        this._x = Math.asin(-he(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._y = Math.atan2(o, f), this._z = Math.atan2(l, c)) : (this._y = Math.atan2(-u, r), this._z = 0);
        break;
      case "ZXY":
        this._x = Math.asin(he(d, -1, 1)), Math.abs(d) < 0.9999999 ? (this._y = Math.atan2(-u, f), this._z = Math.atan2(-a, c)) : (this._y = 0, this._z = Math.atan2(l, r));
        break;
      case "ZYX":
        this._y = Math.asin(-he(u, -1, 1)), Math.abs(u) < 0.9999999 ? (this._x = Math.atan2(d, f), this._z = Math.atan2(l, r)) : (this._x = 0, this._z = Math.atan2(-a, c));
        break;
      case "YZX":
        this._z = Math.asin(he(l, -1, 1)), Math.abs(l) < 0.9999999 ? (this._x = Math.atan2(-h, c), this._y = Math.atan2(-u, r)) : (this._x = 0, this._y = Math.atan2(o, f));
        break;
      case "XZY":
        this._z = Math.asin(-he(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(d, c), this._y = Math.atan2(o, r)) : (this._x = Math.atan2(-h, f), this._y = 0);
        break;
      default:
        console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + e);
    }
    return this._order = e, n === true && this._onChangeCallback(), this;
  }
  setFromQuaternion(t, e, n) {
    return Kc.makeRotationFromQuaternion(t), this.setFromRotationMatrix(Kc, e, n);
  }
  setFromVector3(t, e = this._order) {
    return this.set(t.x, t.y, t.z, e);
  }
  reorder(t) {
    return Qc.setFromEuler(this), this.setFromQuaternion(Qc, t);
  }
  equals(t) {
    return t._x === this._x && t._y === this._y && t._z === this._z && t._order === this._order;
  }
  fromArray(t) {
    return this._x = t[0], this._y = t[1], this._z = t[2], t[3] !== void 0 && (this._order = t[3]), this._onChangeCallback(), this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._order, t;
  }
  _onChange(t) {
    return this._onChangeCallback = t, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
}
Ze.DEFAULT_ORDER = "XYZ";
class mo {
  constructor() {
    this.mask = 1;
  }
  set(t) {
    this.mask = (1 << t | 0) >>> 0;
  }
  enable(t) {
    this.mask |= 1 << t | 0;
  }
  enableAll() {
    this.mask = -1;
  }
  toggle(t) {
    this.mask ^= 1 << t | 0;
  }
  disable(t) {
    this.mask &= ~(1 << t | 0);
  }
  disableAll() {
    this.mask = 0;
  }
  test(t) {
    return (this.mask & t.mask) !== 0;
  }
  isEnabled(t) {
    return (this.mask & (1 << t | 0)) !== 0;
  }
}
let em = 0;
const jc = new C(), Bi = new Ve(), Mn = new Pt(), Tr = new C(), _s = new C(), nm = new C(), im = new Ve(), th = new C(1, 0, 0), eh = new C(0, 1, 0), nh = new C(0, 0, 1), ih = { type: "added" }, sm = { type: "removed" }, zi = { type: "childadded", child: null }, Qo = { type: "childremoved", child: null };
class $t extends gn {
  constructor() {
    super(), this.isObject3D = true, Object.defineProperty(this, "id", { value: em++ }), this.uuid = Ye(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = $t.DEFAULT_UP.clone();
    const t = new C(), e = new Ze(), n = new Ve(), i = new C(1, 1, 1);
    function r() {
      n.setFromEuler(e, false);
    }
    function a() {
      e.setFromQuaternion(n, void 0, false);
    }
    e._onChange(r), n._onChange(a), Object.defineProperties(this, { position: { configurable: true, enumerable: true, value: t }, rotation: { configurable: true, enumerable: true, value: e }, quaternion: { configurable: true, enumerable: true, value: n }, scale: { configurable: true, enumerable: true, value: i }, modelViewMatrix: { value: new Pt() }, normalMatrix: { value: new zt() } }), this.matrix = new Pt(), this.matrixWorld = new Pt(), this.matrixAutoUpdate = $t.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = $t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = false, this.layers = new mo(), this.visible = true, this.castShadow = false, this.receiveShadow = false, this.frustumCulled = true, this.renderOrder = 0, this.animations = [], this.userData = {};
  }
  onBeforeShadow() {
  }
  onAfterShadow() {
  }
  onBeforeRender() {
  }
  onAfterRender() {
  }
  applyMatrix4(t) {
    this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(t), this.matrix.decompose(this.position, this.quaternion, this.scale);
  }
  applyQuaternion(t) {
    return this.quaternion.premultiply(t), this;
  }
  setRotationFromAxisAngle(t, e) {
    this.quaternion.setFromAxisAngle(t, e);
  }
  setRotationFromEuler(t) {
    this.quaternion.setFromEuler(t, true);
  }
  setRotationFromMatrix(t) {
    this.quaternion.setFromRotationMatrix(t);
  }
  setRotationFromQuaternion(t) {
    this.quaternion.copy(t);
  }
  rotateOnAxis(t, e) {
    return Bi.setFromAxisAngle(t, e), this.quaternion.multiply(Bi), this;
  }
  rotateOnWorldAxis(t, e) {
    return Bi.setFromAxisAngle(t, e), this.quaternion.premultiply(Bi), this;
  }
  rotateX(t) {
    return this.rotateOnAxis(th, t);
  }
  rotateY(t) {
    return this.rotateOnAxis(eh, t);
  }
  rotateZ(t) {
    return this.rotateOnAxis(nh, t);
  }
  translateOnAxis(t, e) {
    return jc.copy(t).applyQuaternion(this.quaternion), this.position.add(jc.multiplyScalar(e)), this;
  }
  translateX(t) {
    return this.translateOnAxis(th, t);
  }
  translateY(t) {
    return this.translateOnAxis(eh, t);
  }
  translateZ(t) {
    return this.translateOnAxis(nh, t);
  }
  localToWorld(t) {
    return this.updateWorldMatrix(true, false), t.applyMatrix4(this.matrixWorld);
  }
  worldToLocal(t) {
    return this.updateWorldMatrix(true, false), t.applyMatrix4(Mn.copy(this.matrixWorld).invert());
  }
  lookAt(t, e, n) {
    t.isVector3 ? Tr.copy(t) : Tr.set(t, e, n);
    const i = this.parent;
    this.updateWorldMatrix(true, false), _s.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? Mn.lookAt(_s, Tr, this.up) : Mn.lookAt(Tr, _s, this.up), this.quaternion.setFromRotationMatrix(Mn), i && (Mn.extractRotation(i.matrixWorld), Bi.setFromRotationMatrix(Mn), this.quaternion.premultiply(Bi.invert()));
  }
  add(t) {
    if (arguments.length > 1) {
      for (let e = 0; e < arguments.length; e++) this.add(arguments[e]);
      return this;
    }
    return t === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", t), this) : (t && t.isObject3D ? (t.removeFromParent(), t.parent = this, this.children.push(t), t.dispatchEvent(ih), zi.child = t, this.dispatchEvent(zi), zi.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", t), this);
  }
  remove(t) {
    if (arguments.length > 1) {
      for (let n = 0; n < arguments.length; n++) this.remove(arguments[n]);
      return this;
    }
    const e = this.children.indexOf(t);
    return e !== -1 && (t.parent = null, this.children.splice(e, 1), t.dispatchEvent(sm), Qo.child = t, this.dispatchEvent(Qo), Qo.child = null), this;
  }
  removeFromParent() {
    const t = this.parent;
    return t !== null && t.remove(this), this;
  }
  clear() {
    return this.remove(...this.children);
  }
  attach(t) {
    return this.updateWorldMatrix(true, false), Mn.copy(this.matrixWorld).invert(), t.parent !== null && (t.parent.updateWorldMatrix(true, false), Mn.multiply(t.parent.matrixWorld)), t.applyMatrix4(Mn), t.removeFromParent(), t.parent = this, this.children.push(t), t.updateWorldMatrix(false, true), t.dispatchEvent(ih), zi.child = t, this.dispatchEvent(zi), zi.child = null, this;
  }
  getObjectById(t) {
    return this.getObjectByProperty("id", t);
  }
  getObjectByName(t) {
    return this.getObjectByProperty("name", t);
  }
  getObjectByProperty(t, e) {
    if (this[t] === e) return this;
    for (let n = 0, i = this.children.length; n < i; n++) {
      const a = this.children[n].getObjectByProperty(t, e);
      if (a !== void 0) return a;
    }
  }
  getObjectsByProperty(t, e, n = []) {
    this[t] === e && n.push(this);
    const i = this.children;
    for (let r = 0, a = i.length; r < a; r++) i[r].getObjectsByProperty(t, e, n);
    return n;
  }
  getWorldPosition(t) {
    return this.updateWorldMatrix(true, false), t.setFromMatrixPosition(this.matrixWorld);
  }
  getWorldQuaternion(t) {
    return this.updateWorldMatrix(true, false), this.matrixWorld.decompose(_s, t, nm), t;
  }
  getWorldScale(t) {
    return this.updateWorldMatrix(true, false), this.matrixWorld.decompose(_s, im, t), t;
  }
  getWorldDirection(t) {
    this.updateWorldMatrix(true, false);
    const e = this.matrixWorld.elements;
    return t.set(e[8], e[9], e[10]).normalize();
  }
  raycast() {
  }
  traverse(t) {
    t(this);
    const e = this.children;
    for (let n = 0, i = e.length; n < i; n++) e[n].traverse(t);
  }
  traverseVisible(t) {
    if (this.visible === false) return;
    t(this);
    const e = this.children;
    for (let n = 0, i = e.length; n < i; n++) e[n].traverseVisible(t);
  }
  traverseAncestors(t) {
    const e = this.parent;
    e !== null && (t(e), e.traverseAncestors(t));
  }
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = true;
  }
  updateMatrixWorld(t) {
    this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || t) && (this.matrixWorldAutoUpdate === true && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = false, t = true);
    const e = this.children;
    for (let n = 0, i = e.length; n < i; n++) e[n].updateMatrixWorld(t);
  }
  updateWorldMatrix(t, e) {
    const n = this.parent;
    if (t === true && n !== null && n.updateWorldMatrix(true, false), this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldAutoUpdate === true && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), e === true) {
      const i = this.children;
      for (let r = 0, a = i.length; r < a; r++) i[r].updateWorldMatrix(false, true);
    }
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string", n = {};
    e && (t = { geometries: {}, materials: {}, textures: {}, images: {}, shapes: {}, skeletons: {}, animations: {}, nodes: {} }, n.metadata = { version: 4.6, type: "Object", generator: "Object3D.toJSON" });
    const i = {};
    i.uuid = this.uuid, i.type = this.type, this.name !== "" && (i.name = this.name), this.castShadow === true && (i.castShadow = true), this.receiveShadow === true && (i.receiveShadow = true), this.visible === false && (i.visible = false), this.frustumCulled === false && (i.frustumCulled = false), this.renderOrder !== 0 && (i.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (i.userData = this.userData), i.layers = this.layers.mask, i.matrix = this.matrix.toArray(), i.up = this.up.toArray(), this.matrixAutoUpdate === false && (i.matrixAutoUpdate = false), this.isInstancedMesh && (i.type = "InstancedMesh", i.count = this.count, i.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (i.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (i.type = "BatchedMesh", i.perObjectFrustumCulled = this.perObjectFrustumCulled, i.sortObjects = this.sortObjects, i.drawRanges = this._drawRanges, i.reservedRanges = this._reservedRanges, i.visibility = this._visibility, i.active = this._active, i.bounds = this._bounds.map((o) => ({ boxInitialized: o.boxInitialized, boxMin: o.box.min.toArray(), boxMax: o.box.max.toArray(), sphereInitialized: o.sphereInitialized, sphereRadius: o.sphere.radius, sphereCenter: o.sphere.center.toArray() })), i.maxInstanceCount = this._maxInstanceCount, i.maxVertexCount = this._maxVertexCount, i.maxIndexCount = this._maxIndexCount, i.geometryInitialized = this._geometryInitialized, i.geometryCount = this._geometryCount, i.matricesTexture = this._matricesTexture.toJSON(t), this._colorsTexture !== null && (i.colorsTexture = this._colorsTexture.toJSON(t)), this.boundingSphere !== null && (i.boundingSphere = { center: i.boundingSphere.center.toArray(), radius: i.boundingSphere.radius }), this.boundingBox !== null && (i.boundingBox = { min: i.boundingBox.min.toArray(), max: i.boundingBox.max.toArray() }));
    function r(o, l) {
      return o[l.uuid] === void 0 && (o[l.uuid] = l.toJSON(t)), l.uuid;
    }
    if (this.isScene) this.background && (this.background.isColor ? i.background = this.background.toJSON() : this.background.isTexture && (i.background = this.background.toJSON(t).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== true && (i.environment = this.environment.toJSON(t).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      i.geometry = r(t.geometries, this.geometry);
      const o = this.geometry.parameters;
      if (o !== void 0 && o.shapes !== void 0) {
        const l = o.shapes;
        if (Array.isArray(l)) for (let c = 0, h = l.length; c < h; c++) {
          const u = l[c];
          r(t.shapes, u);
        }
        else r(t.shapes, l);
      }
    }
    if (this.isSkinnedMesh && (i.bindMode = this.bindMode, i.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (r(t.skeletons, this.skeleton), i.skeleton = this.skeleton.uuid)), this.material !== void 0) if (Array.isArray(this.material)) {
      const o = [];
      for (let l = 0, c = this.material.length; l < c; l++) o.push(r(t.materials, this.material[l]));
      i.material = o;
    } else i.material = r(t.materials, this.material);
    if (this.children.length > 0) {
      i.children = [];
      for (let o = 0; o < this.children.length; o++) i.children.push(this.children[o].toJSON(t).object);
    }
    if (this.animations.length > 0) {
      i.animations = [];
      for (let o = 0; o < this.animations.length; o++) {
        const l = this.animations[o];
        i.animations.push(r(t.animations, l));
      }
    }
    if (e) {
      const o = a(t.geometries), l = a(t.materials), c = a(t.textures), h = a(t.images), u = a(t.shapes), d = a(t.skeletons), f = a(t.animations), m = a(t.nodes);
      o.length > 0 && (n.geometries = o), l.length > 0 && (n.materials = l), c.length > 0 && (n.textures = c), h.length > 0 && (n.images = h), u.length > 0 && (n.shapes = u), d.length > 0 && (n.skeletons = d), f.length > 0 && (n.animations = f), m.length > 0 && (n.nodes = m);
    }
    return n.object = i, n;
    function a(o) {
      const l = [];
      for (const c in o) {
        const h = o[c];
        delete h.metadata, l.push(h);
      }
      return l;
    }
  }
  clone(t) {
    return new this.constructor().copy(this, t);
  }
  copy(t, e = true) {
    if (this.name = t.name, this.up.copy(t.up), this.position.copy(t.position), this.rotation.order = t.rotation.order, this.quaternion.copy(t.quaternion), this.scale.copy(t.scale), this.matrix.copy(t.matrix), this.matrixWorld.copy(t.matrixWorld), this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrixWorldAutoUpdate = t.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = t.matrixWorldNeedsUpdate, this.layers.mask = t.layers.mask, this.visible = t.visible, this.castShadow = t.castShadow, this.receiveShadow = t.receiveShadow, this.frustumCulled = t.frustumCulled, this.renderOrder = t.renderOrder, this.animations = t.animations.slice(), this.userData = JSON.parse(JSON.stringify(t.userData)), e === true) for (let n = 0; n < t.children.length; n++) {
      const i = t.children[n];
      this.add(i.clone());
    }
    return this;
  }
}
$t.DEFAULT_UP = new C(0, 1, 0);
$t.DEFAULT_MATRIX_AUTO_UPDATE = true;
$t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;
const nn = new C(), Sn = new C(), jo = new C(), bn = new C(), ki = new C(), Vi = new C(), sh = new C(), tl = new C(), el = new C(), nl = new C(), il = new Jt(), sl = new Jt(), rl = new Jt();
class ze {
  constructor(t = new C(), e = new C(), n = new C()) {
    this.a = t, this.b = e, this.c = n;
  }
  static getNormal(t, e, n, i) {
    i.subVectors(n, e), nn.subVectors(t, e), i.cross(nn);
    const r = i.lengthSq();
    return r > 0 ? i.multiplyScalar(1 / Math.sqrt(r)) : i.set(0, 0, 0);
  }
  static getBarycoord(t, e, n, i, r) {
    nn.subVectors(i, e), Sn.subVectors(n, e), jo.subVectors(t, e);
    const a = nn.dot(nn), o = nn.dot(Sn), l = nn.dot(jo), c = Sn.dot(Sn), h = Sn.dot(jo), u = a * c - o * o;
    if (u === 0) return r.set(0, 0, 0), null;
    const d = 1 / u, f = (c * l - o * h) * d, m = (a * h - o * l) * d;
    return r.set(1 - f - m, m, f);
  }
  static containsPoint(t, e, n, i) {
    return this.getBarycoord(t, e, n, i, bn) === null ? false : bn.x >= 0 && bn.y >= 0 && bn.x + bn.y <= 1;
  }
  static getInterpolation(t, e, n, i, r, a, o, l) {
    return this.getBarycoord(t, e, n, i, bn) === null ? (l.x = 0, l.y = 0, "z" in l && (l.z = 0), "w" in l && (l.w = 0), null) : (l.setScalar(0), l.addScaledVector(r, bn.x), l.addScaledVector(a, bn.y), l.addScaledVector(o, bn.z), l);
  }
  static getInterpolatedAttribute(t, e, n, i, r, a) {
    return il.setScalar(0), sl.setScalar(0), rl.setScalar(0), il.fromBufferAttribute(t, e), sl.fromBufferAttribute(t, n), rl.fromBufferAttribute(t, i), a.setScalar(0), a.addScaledVector(il, r.x), a.addScaledVector(sl, r.y), a.addScaledVector(rl, r.z), a;
  }
  static isFrontFacing(t, e, n, i) {
    return nn.subVectors(n, e), Sn.subVectors(t, e), nn.cross(Sn).dot(i) < 0;
  }
  set(t, e, n) {
    return this.a.copy(t), this.b.copy(e), this.c.copy(n), this;
  }
  setFromPointsAndIndices(t, e, n, i) {
    return this.a.copy(t[e]), this.b.copy(t[n]), this.c.copy(t[i]), this;
  }
  setFromAttributeAndIndices(t, e, n, i) {
    return this.a.fromBufferAttribute(t, e), this.b.fromBufferAttribute(t, n), this.c.fromBufferAttribute(t, i), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.a.copy(t.a), this.b.copy(t.b), this.c.copy(t.c), this;
  }
  getArea() {
    return nn.subVectors(this.c, this.b), Sn.subVectors(this.a, this.b), nn.cross(Sn).length() * 0.5;
  }
  getMidpoint(t) {
    return t.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }
  getNormal(t) {
    return ze.getNormal(this.a, this.b, this.c, t);
  }
  getPlane(t) {
    return t.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  getBarycoord(t, e) {
    return ze.getBarycoord(t, this.a, this.b, this.c, e);
  }
  getInterpolation(t, e, n, i, r) {
    return ze.getInterpolation(t, this.a, this.b, this.c, e, n, i, r);
  }
  containsPoint(t) {
    return ze.containsPoint(t, this.a, this.b, this.c);
  }
  isFrontFacing(t) {
    return ze.isFrontFacing(this.a, this.b, this.c, t);
  }
  intersectsBox(t) {
    return t.intersectsTriangle(this);
  }
  closestPointToPoint(t, e) {
    const n = this.a, i = this.b, r = this.c;
    let a, o;
    ki.subVectors(i, n), Vi.subVectors(r, n), tl.subVectors(t, n);
    const l = ki.dot(tl), c = Vi.dot(tl);
    if (l <= 0 && c <= 0) return e.copy(n);
    el.subVectors(t, i);
    const h = ki.dot(el), u = Vi.dot(el);
    if (h >= 0 && u <= h) return e.copy(i);
    const d = l * u - h * c;
    if (d <= 0 && l >= 0 && h <= 0) return a = l / (l - h), e.copy(n).addScaledVector(ki, a);
    nl.subVectors(t, r);
    const f = ki.dot(nl), m = Vi.dot(nl);
    if (m >= 0 && f <= m) return e.copy(r);
    const _ = f * c - l * m;
    if (_ <= 0 && c >= 0 && m <= 0) return o = c / (c - m), e.copy(n).addScaledVector(Vi, o);
    const g = h * m - f * u;
    if (g <= 0 && u - h >= 0 && f - m >= 0) return sh.subVectors(r, i), o = (u - h) / (u - h + (f - m)), e.copy(i).addScaledVector(sh, o);
    const p = 1 / (g + _ + d);
    return a = _ * p, o = d * p, e.copy(n).addScaledVector(ki, a).addScaledVector(Vi, o);
  }
  equals(t) {
    return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
  }
}
const Ad = { aliceblue: 15792383, antiquewhite: 16444375, aqua: 65535, aquamarine: 8388564, azure: 15794175, beige: 16119260, bisque: 16770244, black: 0, blanchedalmond: 16772045, blue: 255, blueviolet: 9055202, brown: 10824234, burlywood: 14596231, cadetblue: 6266528, chartreuse: 8388352, chocolate: 13789470, coral: 16744272, cornflowerblue: 6591981, cornsilk: 16775388, crimson: 14423100, cyan: 65535, darkblue: 139, darkcyan: 35723, darkgoldenrod: 12092939, darkgray: 11119017, darkgreen: 25600, darkgrey: 11119017, darkkhaki: 12433259, darkmagenta: 9109643, darkolivegreen: 5597999, darkorange: 16747520, darkorchid: 10040012, darkred: 9109504, darksalmon: 15308410, darkseagreen: 9419919, darkslateblue: 4734347, darkslategray: 3100495, darkslategrey: 3100495, darkturquoise: 52945, darkviolet: 9699539, deeppink: 16716947, deepskyblue: 49151, dimgray: 6908265, dimgrey: 6908265, dodgerblue: 2003199, firebrick: 11674146, floralwhite: 16775920, forestgreen: 2263842, fuchsia: 16711935, gainsboro: 14474460, ghostwhite: 16316671, gold: 16766720, goldenrod: 14329120, gray: 8421504, green: 32768, greenyellow: 11403055, grey: 8421504, honeydew: 15794160, hotpink: 16738740, indianred: 13458524, indigo: 4915330, ivory: 16777200, khaki: 15787660, lavender: 15132410, lavenderblush: 16773365, lawngreen: 8190976, lemonchiffon: 16775885, lightblue: 11393254, lightcoral: 15761536, lightcyan: 14745599, lightgoldenrodyellow: 16448210, lightgray: 13882323, lightgreen: 9498256, lightgrey: 13882323, lightpink: 16758465, lightsalmon: 16752762, lightseagreen: 2142890, lightskyblue: 8900346, lightslategray: 7833753, lightslategrey: 7833753, lightsteelblue: 11584734, lightyellow: 16777184, lime: 65280, limegreen: 3329330, linen: 16445670, magenta: 16711935, maroon: 8388608, mediumaquamarine: 6737322, mediumblue: 205, mediumorchid: 12211667, mediumpurple: 9662683, mediumseagreen: 3978097, mediumslateblue: 8087790, mediumspringgreen: 64154, mediumturquoise: 4772300, mediumvioletred: 13047173, midnightblue: 1644912, mintcream: 16121850, mistyrose: 16770273, moccasin: 16770229, navajowhite: 16768685, navy: 128, oldlace: 16643558, olive: 8421376, olivedrab: 7048739, orange: 16753920, orangered: 16729344, orchid: 14315734, palegoldenrod: 15657130, palegreen: 10025880, paleturquoise: 11529966, palevioletred: 14381203, papayawhip: 16773077, peachpuff: 16767673, peru: 13468991, pink: 16761035, plum: 14524637, powderblue: 11591910, purple: 8388736, rebeccapurple: 6697881, red: 16711680, rosybrown: 12357519, royalblue: 4286945, saddlebrown: 9127187, salmon: 16416882, sandybrown: 16032864, seagreen: 3050327, seashell: 16774638, sienna: 10506797, silver: 12632256, skyblue: 8900331, slateblue: 6970061, slategray: 7372944, slategrey: 7372944, snow: 16775930, springgreen: 65407, steelblue: 4620980, tan: 13808780, teal: 32896, thistle: 14204888, tomato: 16737095, turquoise: 4251856, violet: 15631086, wheat: 16113331, white: 16777215, whitesmoke: 16119285, yellow: 16776960, yellowgreen: 10145074 }, kn = { h: 0, s: 0, l: 0 }, Cr = { h: 0, s: 0, l: 0 };
function al(s, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? s + (t - s) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? s + (t - s) * 6 * (2 / 3 - e) : s;
}
class ft {
  constructor(t, e, n) {
    return this.isColor = true, this.r = 1, this.g = 1, this.b = 1, this.set(t, e, n);
  }
  set(t, e, n) {
    if (e === void 0 && n === void 0) {
      const i = t;
      i && i.isColor ? this.copy(i) : typeof i == "number" ? this.setHex(i) : typeof i == "string" && this.setStyle(i);
    } else this.setRGB(t, e, n);
    return this;
  }
  setScalar(t) {
    return this.r = t, this.g = t, this.b = t, this;
  }
  setHex(t, e = Ke) {
    return t = Math.floor(t), this.r = (t >> 16 & 255) / 255, this.g = (t >> 8 & 255) / 255, this.b = (t & 255) / 255, Qt.toWorkingColorSpace(this, e), this;
  }
  setRGB(t, e, n, i = Qt.workingColorSpace) {
    return this.r = t, this.g = e, this.b = n, Qt.toWorkingColorSpace(this, i), this;
  }
  setHSL(t, e, n, i = Qt.workingColorSpace) {
    if (t = cc(t, 1), e = he(e, 0, 1), n = he(n, 0, 1), e === 0) this.r = this.g = this.b = n;
    else {
      const r = n <= 0.5 ? n * (1 + e) : n + e - n * e, a = 2 * n - r;
      this.r = al(a, r, t + 1 / 3), this.g = al(a, r, t), this.b = al(a, r, t - 1 / 3);
    }
    return Qt.toWorkingColorSpace(this, i), this;
  }
  setStyle(t, e = Ke) {
    function n(r) {
      r !== void 0 && parseFloat(r) < 1 && console.warn("THREE.Color: Alpha component of " + t + " will be ignored.");
    }
    let i;
    if (i = /^(\w+)\(([^\)]*)\)/.exec(t)) {
      let r;
      const a = i[1], o = i[2];
      switch (a) {
        case "rgb":
        case "rgba":
          if (r = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return n(r[4]), this.setRGB(Math.min(255, parseInt(r[1], 10)) / 255, Math.min(255, parseInt(r[2], 10)) / 255, Math.min(255, parseInt(r[3], 10)) / 255, e);
          if (r = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return n(r[4]), this.setRGB(Math.min(100, parseInt(r[1], 10)) / 100, Math.min(100, parseInt(r[2], 10)) / 100, Math.min(100, parseInt(r[3], 10)) / 100, e);
          break;
        case "hsl":
        case "hsla":
          if (r = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return n(r[4]), this.setHSL(parseFloat(r[1]) / 360, parseFloat(r[2]) / 100, parseFloat(r[3]) / 100, e);
          break;
        default:
          console.warn("THREE.Color: Unknown color model " + t);
      }
    } else if (i = /^\#([A-Fa-f\d]+)$/.exec(t)) {
      const r = i[1], a = r.length;
      if (a === 3) return this.setRGB(parseInt(r.charAt(0), 16) / 15, parseInt(r.charAt(1), 16) / 15, parseInt(r.charAt(2), 16) / 15, e);
      if (a === 6) return this.setHex(parseInt(r, 16), e);
      console.warn("THREE.Color: Invalid hex color " + t);
    } else if (t && t.length > 0) return this.setColorName(t, e);
    return this;
  }
  setColorName(t, e = Ke) {
    const n = Ad[t.toLowerCase()];
    return n !== void 0 ? this.setHex(n, e) : console.warn("THREE.Color: Unknown color " + t), this;
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(t) {
    return this.r = t.r, this.g = t.g, this.b = t.b, this;
  }
  copySRGBToLinear(t) {
    return this.r = is(t.r), this.g = is(t.g), this.b = is(t.b), this;
  }
  copyLinearToSRGB(t) {
    return this.r = Wo(t.r), this.g = Wo(t.g), this.b = Wo(t.b), this;
  }
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  getHex(t = Ke) {
    return Qt.fromWorkingColorSpace(Ee.copy(this), t), Math.round(he(Ee.r * 255, 0, 255)) * 65536 + Math.round(he(Ee.g * 255, 0, 255)) * 256 + Math.round(he(Ee.b * 255, 0, 255));
  }
  getHexString(t = Ke) {
    return ("000000" + this.getHex(t).toString(16)).slice(-6);
  }
  getHSL(t, e = Qt.workingColorSpace) {
    Qt.fromWorkingColorSpace(Ee.copy(this), e);
    const n = Ee.r, i = Ee.g, r = Ee.b, a = Math.max(n, i, r), o = Math.min(n, i, r);
    let l, c;
    const h = (o + a) / 2;
    if (o === a) l = 0, c = 0;
    else {
      const u = a - o;
      switch (c = h <= 0.5 ? u / (a + o) : u / (2 - a - o), a) {
        case n:
          l = (i - r) / u + (i < r ? 6 : 0);
          break;
        case i:
          l = (r - n) / u + 2;
          break;
        case r:
          l = (n - i) / u + 4;
          break;
      }
      l /= 6;
    }
    return t.h = l, t.s = c, t.l = h, t;
  }
  getRGB(t, e = Qt.workingColorSpace) {
    return Qt.fromWorkingColorSpace(Ee.copy(this), e), t.r = Ee.r, t.g = Ee.g, t.b = Ee.b, t;
  }
  getStyle(t = Ke) {
    Qt.fromWorkingColorSpace(Ee.copy(this), t);
    const e = Ee.r, n = Ee.g, i = Ee.b;
    return t !== Ke ? `color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})` : `rgb(${Math.round(e * 255)},${Math.round(n * 255)},${Math.round(i * 255)})`;
  }
  offsetHSL(t, e, n) {
    return this.getHSL(kn), this.setHSL(kn.h + t, kn.s + e, kn.l + n);
  }
  add(t) {
    return this.r += t.r, this.g += t.g, this.b += t.b, this;
  }
  addColors(t, e) {
    return this.r = t.r + e.r, this.g = t.g + e.g, this.b = t.b + e.b, this;
  }
  addScalar(t) {
    return this.r += t, this.g += t, this.b += t, this;
  }
  sub(t) {
    return this.r = Math.max(0, this.r - t.r), this.g = Math.max(0, this.g - t.g), this.b = Math.max(0, this.b - t.b), this;
  }
  multiply(t) {
    return this.r *= t.r, this.g *= t.g, this.b *= t.b, this;
  }
  multiplyScalar(t) {
    return this.r *= t, this.g *= t, this.b *= t, this;
  }
  lerp(t, e) {
    return this.r += (t.r - this.r) * e, this.g += (t.g - this.g) * e, this.b += (t.b - this.b) * e, this;
  }
  lerpColors(t, e, n) {
    return this.r = t.r + (e.r - t.r) * n, this.g = t.g + (e.g - t.g) * n, this.b = t.b + (e.b - t.b) * n, this;
  }
  lerpHSL(t, e) {
    this.getHSL(kn), t.getHSL(Cr);
    const n = Os(kn.h, Cr.h, e), i = Os(kn.s, Cr.s, e), r = Os(kn.l, Cr.l, e);
    return this.setHSL(n, i, r), this;
  }
  setFromVector3(t) {
    return this.r = t.x, this.g = t.y, this.b = t.z, this;
  }
  applyMatrix3(t) {
    const e = this.r, n = this.g, i = this.b, r = t.elements;
    return this.r = r[0] * e + r[3] * n + r[6] * i, this.g = r[1] * e + r[4] * n + r[7] * i, this.b = r[2] * e + r[5] * n + r[8] * i, this;
  }
  equals(t) {
    return t.r === this.r && t.g === this.g && t.b === this.b;
  }
  fromArray(t, e = 0) {
    return this.r = t[e], this.g = t[e + 1], this.b = t[e + 2], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.r, t[e + 1] = this.g, t[e + 2] = this.b, t;
  }
  fromBufferAttribute(t, e) {
    return this.r = t.getX(e), this.g = t.getY(e), this.b = t.getZ(e), this;
  }
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}
const Ee = new ft();
ft.NAMES = Ad;
let rm = 0;
class Ce extends gn {
  constructor() {
    super(), this.isMaterial = true, Object.defineProperty(this, "id", { value: rm++ }), this.uuid = Ye(), this.name = "", this.type = "Material", this.blending = yi, this.side = Pn, this.vertexColors = false, this.opacity = 1, this.transparent = false, this.alphaHash = false, this.blendSrc = xa, this.blendDst = va, this.blendEquation = Xn, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new ft(0, 0, 0), this.blendAlpha = 0, this.depthFunc = wi, this.depthTest = true, this.depthWrite = true, this.stencilWriteMask = 255, this.stencilFunc = Bl, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = di, this.stencilZFail = di, this.stencilZPass = di, this.stencilWrite = false, this.clippingPlanes = null, this.clipIntersection = false, this.clipShadows = false, this.shadowSide = null, this.colorWrite = true, this.precision = null, this.polygonOffset = false, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = false, this.alphaToCoverage = false, this.premultipliedAlpha = false, this.forceSinglePass = false, this.visible = true, this.toneMapped = true, this.userData = {}, this.version = 0, this._alphaTest = 0;
  }
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(t) {
    this._alphaTest > 0 != t > 0 && this.version++, this._alphaTest = t;
  }
  onBeforeRender() {
  }
  onBeforeCompile() {
  }
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  setValues(t) {
    if (t !== void 0) for (const e in t) {
      const n = t[e];
      if (n === void 0) {
        console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);
        continue;
      }
      const i = this[e];
      if (i === void 0) {
        console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);
        continue;
      }
      i && i.isColor ? i.set(n) : i && i.isVector3 && n && n.isVector3 ? i.copy(n) : this[e] = n;
    }
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    e && (t = { textures: {}, images: {} });
    const n = { metadata: { version: 4.6, type: "Material", generator: "Material.toJSON" } };
    n.uuid = this.uuid, n.type = this.type, this.name !== "" && (n.name = this.name), this.color && this.color.isColor && (n.color = this.color.getHex()), this.roughness !== void 0 && (n.roughness = this.roughness), this.metalness !== void 0 && (n.metalness = this.metalness), this.sheen !== void 0 && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n.shininess = this.shininess), this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(t).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(t).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(t).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.dispersion !== void 0 && (n.dispersion = this.dispersion), this.iridescence !== void 0 && (n.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(t).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(t).uuid), this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(t).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(t).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(t).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(t).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(t).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(t).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(t).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(t).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(t).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(t).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(t).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(t).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(t).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(t).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(t).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(t).uuid, this.combine !== void 0 && (n.combine = this.combine)), this.envMapRotation !== void 0 && (n.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(t).uuid), this.transmission !== void 0 && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(t).uuid), this.thickness !== void 0 && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(t).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (n.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n.size = this.size), this.shadowSide !== null && (n.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation), this.blending !== yi && (n.blending = this.blending), this.side !== Pn && (n.side = this.side), this.vertexColors === true && (n.vertexColors = true), this.opacity < 1 && (n.opacity = this.opacity), this.transparent === true && (n.transparent = true), this.blendSrc !== xa && (n.blendSrc = this.blendSrc), this.blendDst !== va && (n.blendDst = this.blendDst), this.blendEquation !== Xn && (n.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (n.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (n.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha), this.depthFunc !== wi && (n.depthFunc = this.depthFunc), this.depthTest === false && (n.depthTest = this.depthTest), this.depthWrite === false && (n.depthWrite = this.depthWrite), this.colorWrite === false && (n.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (n.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== Bl && (n.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (n.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (n.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== di && (n.stencilFail = this.stencilFail), this.stencilZFail !== di && (n.stencilZFail = this.stencilZFail), this.stencilZPass !== di && (n.stencilZPass = this.stencilZPass), this.stencilWrite === true && (n.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (n.rotation = this.rotation), this.polygonOffset === true && (n.polygonOffset = true), this.polygonOffsetFactor !== 0 && (n.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (n.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (n.linewidth = this.linewidth), this.dashSize !== void 0 && (n.dashSize = this.dashSize), this.gapSize !== void 0 && (n.gapSize = this.gapSize), this.scale !== void 0 && (n.scale = this.scale), this.dithering === true && (n.dithering = true), this.alphaTest > 0 && (n.alphaTest = this.alphaTest), this.alphaHash === true && (n.alphaHash = true), this.alphaToCoverage === true && (n.alphaToCoverage = true), this.premultipliedAlpha === true && (n.premultipliedAlpha = true), this.forceSinglePass === true && (n.forceSinglePass = true), this.wireframe === true && (n.wireframe = true), this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (n.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (n.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === true && (n.flatShading = true), this.visible === false && (n.visible = false), this.toneMapped === false && (n.toneMapped = false), this.fog === false && (n.fog = false), Object.keys(this.userData).length > 0 && (n.userData = this.userData);
    function i(r) {
      const a = [];
      for (const o in r) {
        const l = r[o];
        delete l.metadata, a.push(l);
      }
      return a;
    }
    if (e) {
      const r = i(t.textures), a = i(t.images);
      r.length > 0 && (n.textures = r), a.length > 0 && (n.images = a);
    }
    return n;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    this.name = t.name, this.blending = t.blending, this.side = t.side, this.vertexColors = t.vertexColors, this.opacity = t.opacity, this.transparent = t.transparent, this.blendSrc = t.blendSrc, this.blendDst = t.blendDst, this.blendEquation = t.blendEquation, this.blendSrcAlpha = t.blendSrcAlpha, this.blendDstAlpha = t.blendDstAlpha, this.blendEquationAlpha = t.blendEquationAlpha, this.blendColor.copy(t.blendColor), this.blendAlpha = t.blendAlpha, this.depthFunc = t.depthFunc, this.depthTest = t.depthTest, this.depthWrite = t.depthWrite, this.stencilWriteMask = t.stencilWriteMask, this.stencilFunc = t.stencilFunc, this.stencilRef = t.stencilRef, this.stencilFuncMask = t.stencilFuncMask, this.stencilFail = t.stencilFail, this.stencilZFail = t.stencilZFail, this.stencilZPass = t.stencilZPass, this.stencilWrite = t.stencilWrite;
    const e = t.clippingPlanes;
    let n = null;
    if (e !== null) {
      const i = e.length;
      n = new Array(i);
      for (let r = 0; r !== i; ++r) n[r] = e[r].clone();
    }
    return this.clippingPlanes = n, this.clipIntersection = t.clipIntersection, this.clipShadows = t.clipShadows, this.shadowSide = t.shadowSide, this.colorWrite = t.colorWrite, this.precision = t.precision, this.polygonOffset = t.polygonOffset, this.polygonOffsetFactor = t.polygonOffsetFactor, this.polygonOffsetUnits = t.polygonOffsetUnits, this.dithering = t.dithering, this.alphaTest = t.alphaTest, this.alphaHash = t.alphaHash, this.alphaToCoverage = t.alphaToCoverage, this.premultipliedAlpha = t.premultipliedAlpha, this.forceSinglePass = t.forceSinglePass, this.visible = t.visible, this.toneMapped = t.toneMapped, this.userData = JSON.parse(JSON.stringify(t.userData)), this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  set needsUpdate(t) {
    t === true && this.version++;
  }
  onBuild() {
    console.warn("Material: onBuild() has been removed.");
  }
}
class $n extends Ce {
  constructor(t) {
    super(), this.isMeshBasicMaterial = true, this.type = "MeshBasicMaterial", this.color = new ft(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new Ze(), this.combine = lr, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = true, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.specularMap = t.specularMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.combine = t.combine, this.reflectivity = t.reflectivity, this.refractionRatio = t.refractionRatio, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.fog = t.fog, this;
  }
}
const An = am();
function am() {
  const s = new ArrayBuffer(4), t = new Float32Array(s), e = new Uint32Array(s), n = new Uint32Array(512), i = new Uint32Array(512);
  for (let l = 0; l < 256; ++l) {
    const c = l - 127;
    c < -27 ? (n[l] = 0, n[l | 256] = 32768, i[l] = 24, i[l | 256] = 24) : c < -14 ? (n[l] = 1024 >> -c - 14, n[l | 256] = 1024 >> -c - 14 | 32768, i[l] = -c - 1, i[l | 256] = -c - 1) : c <= 15 ? (n[l] = c + 15 << 10, n[l | 256] = c + 15 << 10 | 32768, i[l] = 13, i[l | 256] = 13) : c < 128 ? (n[l] = 31744, n[l | 256] = 64512, i[l] = 24, i[l | 256] = 24) : (n[l] = 31744, n[l | 256] = 64512, i[l] = 13, i[l | 256] = 13);
  }
  const r = new Uint32Array(2048), a = new Uint32Array(64), o = new Uint32Array(64);
  for (let l = 1; l < 1024; ++l) {
    let c = l << 13, h = 0;
    for (; !(c & 8388608); ) c <<= 1, h -= 8388608;
    c &= -8388609, h += 947912704, r[l] = c | h;
  }
  for (let l = 1024; l < 2048; ++l) r[l] = 939524096 + (l - 1024 << 13);
  for (let l = 1; l < 31; ++l) a[l] = l << 23;
  a[31] = 1199570944, a[32] = 2147483648;
  for (let l = 33; l < 63; ++l) a[l] = 2147483648 + (l - 32 << 23);
  a[63] = 3347054592;
  for (let l = 1; l < 64; ++l) l !== 32 && (o[l] = 1024);
  return { floatView: t, uint32View: e, baseTable: n, shiftTable: i, mantissaTable: r, exponentTable: a, offsetTable: o };
}
function Be(s) {
  Math.abs(s) > 65504 && console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."), s = he(s, -65504, 65504), An.floatView[0] = s;
  const t = An.uint32View[0], e = t >> 23 & 511;
  return An.baseTable[e] + ((t & 8388607) >> An.shiftTable[e]);
}
function Cs(s) {
  const t = s >> 10;
  return An.uint32View[0] = An.mantissaTable[An.offsetTable[t] + (s & 1023)] + An.exponentTable[t], An.floatView[0];
}
const om = { toHalfFloat: Be, fromHalfFloat: Cs }, me = new C(), Rr = new Z();
class ie {
  constructor(t, e, n = false) {
    if (Array.isArray(t)) throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    this.isBufferAttribute = true, this.name = "", this.array = t, this.itemSize = e, this.count = t !== void 0 ? t.length / e : 0, this.normalized = n, this.usage = $s, this.updateRanges = [], this.gpuType = ke, this.version = 0;
  }
  onUploadCallback() {
  }
  set needsUpdate(t) {
    t === true && this.version++;
  }
  setUsage(t) {
    return this.usage = t, this;
  }
  addUpdateRange(t, e) {
    this.updateRanges.push({ start: t, count: e });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(t) {
    return this.name = t.name, this.array = new t.array.constructor(t.array), this.itemSize = t.itemSize, this.count = t.count, this.normalized = t.normalized, this.usage = t.usage, this.gpuType = t.gpuType, this;
  }
  copyAt(t, e, n) {
    t *= this.itemSize, n *= e.itemSize;
    for (let i = 0, r = this.itemSize; i < r; i++) this.array[t + i] = e.array[n + i];
    return this;
  }
  copyArray(t) {
    return this.array.set(t), this;
  }
  applyMatrix3(t) {
    if (this.itemSize === 2) for (let e = 0, n = this.count; e < n; e++) Rr.fromBufferAttribute(this, e), Rr.applyMatrix3(t), this.setXY(e, Rr.x, Rr.y);
    else if (this.itemSize === 3) for (let e = 0, n = this.count; e < n; e++) me.fromBufferAttribute(this, e), me.applyMatrix3(t), this.setXYZ(e, me.x, me.y, me.z);
    return this;
  }
  applyMatrix4(t) {
    for (let e = 0, n = this.count; e < n; e++) me.fromBufferAttribute(this, e), me.applyMatrix4(t), this.setXYZ(e, me.x, me.y, me.z);
    return this;
  }
  applyNormalMatrix(t) {
    for (let e = 0, n = this.count; e < n; e++) me.fromBufferAttribute(this, e), me.applyNormalMatrix(t), this.setXYZ(e, me.x, me.y, me.z);
    return this;
  }
  transformDirection(t) {
    for (let e = 0, n = this.count; e < n; e++) me.fromBufferAttribute(this, e), me.transformDirection(t), this.setXYZ(e, me.x, me.y, me.z);
    return this;
  }
  set(t, e = 0) {
    return this.array.set(t, e), this;
  }
  getComponent(t, e) {
    let n = this.array[t * this.itemSize + e];
    return this.normalized && (n = Ie(n, this.array)), n;
  }
  setComponent(t, e, n) {
    return this.normalized && (n = kt(n, this.array)), this.array[t * this.itemSize + e] = n, this;
  }
  getX(t) {
    let e = this.array[t * this.itemSize];
    return this.normalized && (e = Ie(e, this.array)), e;
  }
  setX(t, e) {
    return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize] = e, this;
  }
  getY(t) {
    let e = this.array[t * this.itemSize + 1];
    return this.normalized && (e = Ie(e, this.array)), e;
  }
  setY(t, e) {
    return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize + 1] = e, this;
  }
  getZ(t) {
    let e = this.array[t * this.itemSize + 2];
    return this.normalized && (e = Ie(e, this.array)), e;
  }
  setZ(t, e) {
    return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize + 2] = e, this;
  }
  getW(t) {
    let e = this.array[t * this.itemSize + 3];
    return this.normalized && (e = Ie(e, this.array)), e;
  }
  setW(t, e) {
    return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize + 3] = e, this;
  }
  setXY(t, e, n) {
    return t *= this.itemSize, this.normalized && (e = kt(e, this.array), n = kt(n, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this;
  }
  setXYZ(t, e, n, i) {
    return t *= this.itemSize, this.normalized && (e = kt(e, this.array), n = kt(n, this.array), i = kt(i, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = i, this;
  }
  setXYZW(t, e, n, i, r) {
    return t *= this.itemSize, this.normalized && (e = kt(e, this.array), n = kt(n, this.array), i = kt(i, this.array), r = kt(r, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = i, this.array[t + 3] = r, this;
  }
  onUpload(t) {
    return this.onUploadCallback = t, this;
  }
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  toJSON() {
    const t = { itemSize: this.itemSize, type: this.array.constructor.name, array: Array.from(this.array), normalized: this.normalized };
    return this.name !== "" && (t.name = this.name), this.usage !== $s && (t.usage = this.usage), t;
  }
}
class lm extends ie {
  constructor(t, e, n) {
    super(new Int8Array(t), e, n);
  }
}
class cm extends ie {
  constructor(t, e, n) {
    super(new Uint8Array(t), e, n);
  }
}
class hm extends ie {
  constructor(t, e, n) {
    super(new Uint8ClampedArray(t), e, n);
  }
}
class um extends ie {
  constructor(t, e, n) {
    super(new Int16Array(t), e, n);
  }
}
class uc extends ie {
  constructor(t, e, n) {
    super(new Uint16Array(t), e, n);
  }
}
class dm extends ie {
  constructor(t, e, n) {
    super(new Int32Array(t), e, n);
  }
}
class dc extends ie {
  constructor(t, e, n) {
    super(new Uint32Array(t), e, n);
  }
}
class fm extends ie {
  constructor(t, e, n) {
    super(new Uint16Array(t), e, n), this.isFloat16BufferAttribute = true;
  }
  getX(t) {
    let e = Cs(this.array[t * this.itemSize]);
    return this.normalized && (e = Ie(e, this.array)), e;
  }
  setX(t, e) {
    return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize] = Be(e), this;
  }
  getY(t) {
    let e = Cs(this.array[t * this.itemSize + 1]);
    return this.normalized && (e = Ie(e, this.array)), e;
  }
  setY(t, e) {
    return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize + 1] = Be(e), this;
  }
  getZ(t) {
    let e = Cs(this.array[t * this.itemSize + 2]);
    return this.normalized && (e = Ie(e, this.array)), e;
  }
  setZ(t, e) {
    return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize + 2] = Be(e), this;
  }
  getW(t) {
    let e = Cs(this.array[t * this.itemSize + 3]);
    return this.normalized && (e = Ie(e, this.array)), e;
  }
  setW(t, e) {
    return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize + 3] = Be(e), this;
  }
  setXY(t, e, n) {
    return t *= this.itemSize, this.normalized && (e = kt(e, this.array), n = kt(n, this.array)), this.array[t + 0] = Be(e), this.array[t + 1] = Be(n), this;
  }
  setXYZ(t, e, n, i) {
    return t *= this.itemSize, this.normalized && (e = kt(e, this.array), n = kt(n, this.array), i = kt(i, this.array)), this.array[t + 0] = Be(e), this.array[t + 1] = Be(n), this.array[t + 2] = Be(i), this;
  }
  setXYZW(t, e, n, i, r) {
    return t *= this.itemSize, this.normalized && (e = kt(e, this.array), n = kt(n, this.array), i = kt(i, this.array), r = kt(r, this.array)), this.array[t + 0] = Be(e), this.array[t + 1] = Be(n), this.array[t + 2] = Be(i), this.array[t + 3] = Be(r), this;
  }
}
class wt extends ie {
  constructor(t, e, n) {
    super(new Float32Array(t), e, n);
  }
}
let pm = 0;
const $e = new Pt(), ol = new $t(), Hi = new C(), qe = new Ue(), xs = new Ue(), ye = new C();
class Ht extends gn {
  constructor() {
    super(), this.isBufferGeometry = true, Object.defineProperty(this, "id", { value: pm++ }), this.uuid = Ye(), this.name = "", this.type = "BufferGeometry", this.index = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = false, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
  }
  getIndex() {
    return this.index;
  }
  setIndex(t) {
    return Array.isArray(t) ? this.index = new (Sd(t) ? dc : uc)(t, 1) : this.index = t, this;
  }
  getAttribute(t) {
    return this.attributes[t];
  }
  setAttribute(t, e) {
    return this.attributes[t] = e, this;
  }
  deleteAttribute(t) {
    return delete this.attributes[t], this;
  }
  hasAttribute(t) {
    return this.attributes[t] !== void 0;
  }
  addGroup(t, e, n = 0) {
    this.groups.push({ start: t, count: e, materialIndex: n });
  }
  clearGroups() {
    this.groups = [];
  }
  setDrawRange(t, e) {
    this.drawRange.start = t, this.drawRange.count = e;
  }
  applyMatrix4(t) {
    const e = this.attributes.position;
    e !== void 0 && (e.applyMatrix4(t), e.needsUpdate = true);
    const n = this.attributes.normal;
    if (n !== void 0) {
      const r = new zt().getNormalMatrix(t);
      n.applyNormalMatrix(r), n.needsUpdate = true;
    }
    const i = this.attributes.tangent;
    return i !== void 0 && (i.transformDirection(t), i.needsUpdate = true), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
  }
  applyQuaternion(t) {
    return $e.makeRotationFromQuaternion(t), this.applyMatrix4($e), this;
  }
  rotateX(t) {
    return $e.makeRotationX(t), this.applyMatrix4($e), this;
  }
  rotateY(t) {
    return $e.makeRotationY(t), this.applyMatrix4($e), this;
  }
  rotateZ(t) {
    return $e.makeRotationZ(t), this.applyMatrix4($e), this;
  }
  translate(t, e, n) {
    return $e.makeTranslation(t, e, n), this.applyMatrix4($e), this;
  }
  scale(t, e, n) {
    return $e.makeScale(t, e, n), this.applyMatrix4($e), this;
  }
  lookAt(t) {
    return ol.lookAt(t), ol.updateMatrix(), this.applyMatrix4(ol.matrix), this;
  }
  center() {
    return this.computeBoundingBox(), this.boundingBox.getCenter(Hi).negate(), this.translate(Hi.x, Hi.y, Hi.z), this;
  }
  setFromPoints(t) {
    const e = [];
    for (let n = 0, i = t.length; n < i; n++) {
      const r = t[n];
      e.push(r.x, r.y, r.z || 0);
    }
    return this.setAttribute("position", new wt(e, 3)), this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new Ue());
    const t = this.attributes.position, e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(new C(-1 / 0, -1 / 0, -1 / 0), new C(1 / 0, 1 / 0, 1 / 0));
      return;
    }
    if (t !== void 0) {
      if (this.boundingBox.setFromBufferAttribute(t), e) for (let n = 0, i = e.length; n < i; n++) {
        const r = e[n];
        qe.setFromBufferAttribute(r), this.morphTargetsRelative ? (ye.addVectors(this.boundingBox.min, qe.min), this.boundingBox.expandByPoint(ye), ye.addVectors(this.boundingBox.max, qe.max), this.boundingBox.expandByPoint(ye)) : (this.boundingBox.expandByPoint(qe.min), this.boundingBox.expandByPoint(qe.max));
      }
    } else this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new Te());
    const t = this.attributes.position, e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new C(), 1 / 0);
      return;
    }
    if (t) {
      const n = this.boundingSphere.center;
      if (qe.setFromBufferAttribute(t), e) for (let r = 0, a = e.length; r < a; r++) {
        const o = e[r];
        xs.setFromBufferAttribute(o), this.morphTargetsRelative ? (ye.addVectors(qe.min, xs.min), qe.expandByPoint(ye), ye.addVectors(qe.max, xs.max), qe.expandByPoint(ye)) : (qe.expandByPoint(xs.min), qe.expandByPoint(xs.max));
      }
      qe.getCenter(n);
      let i = 0;
      for (let r = 0, a = t.count; r < a; r++) ye.fromBufferAttribute(t, r), i = Math.max(i, n.distanceToSquared(ye));
      if (e) for (let r = 0, a = e.length; r < a; r++) {
        const o = e[r], l = this.morphTargetsRelative;
        for (let c = 0, h = o.count; c < h; c++) ye.fromBufferAttribute(o, c), l && (Hi.fromBufferAttribute(t, c), ye.add(Hi)), i = Math.max(i, n.distanceToSquared(ye));
      }
      this.boundingSphere.radius = Math.sqrt(i), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
    }
  }
  computeTangents() {
    const t = this.index, e = this.attributes;
    if (t === null || e.position === void 0 || e.normal === void 0 || e.uv === void 0) {
      console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
      return;
    }
    const n = e.position, i = e.normal, r = e.uv;
    this.hasAttribute("tangent") === false && this.setAttribute("tangent", new ie(new Float32Array(4 * n.count), 4));
    const a = this.getAttribute("tangent"), o = [], l = [];
    for (let P = 0; P < n.count; P++) o[P] = new C(), l[P] = new C();
    const c = new C(), h = new C(), u = new C(), d = new Z(), f = new Z(), m = new Z(), _ = new C(), g = new C();
    function p(P, V, v) {
      c.fromBufferAttribute(n, P), h.fromBufferAttribute(n, V), u.fromBufferAttribute(n, v), d.fromBufferAttribute(r, P), f.fromBufferAttribute(r, V), m.fromBufferAttribute(r, v), h.sub(c), u.sub(c), f.sub(d), m.sub(d);
      const b = 1 / (f.x * m.y - m.x * f.y);
      isFinite(b) && (_.copy(h).multiplyScalar(m.y).addScaledVector(u, -f.y).multiplyScalar(b), g.copy(u).multiplyScalar(f.x).addScaledVector(h, -m.x).multiplyScalar(b), o[P].add(_), o[V].add(_), o[v].add(_), l[P].add(g), l[V].add(g), l[v].add(g));
    }
    let y = this.groups;
    y.length === 0 && (y = [{ start: 0, count: t.count }]);
    for (let P = 0, V = y.length; P < V; ++P) {
      const v = y[P], b = v.start, k = v.count;
      for (let B = b, H = b + k; B < H; B += 3) p(t.getX(B + 0), t.getX(B + 1), t.getX(B + 2));
    }
    const x = new C(), M = new C(), I = new C(), E = new C();
    function A(P) {
      I.fromBufferAttribute(i, P), E.copy(I);
      const V = o[P];
      x.copy(V), x.sub(I.multiplyScalar(I.dot(V))).normalize(), M.crossVectors(E, V);
      const b = M.dot(l[P]) < 0 ? -1 : 1;
      a.setXYZW(P, x.x, x.y, x.z, b);
    }
    for (let P = 0, V = y.length; P < V; ++P) {
      const v = y[P], b = v.start, k = v.count;
      for (let B = b, H = b + k; B < H; B += 3) A(t.getX(B + 0)), A(t.getX(B + 1)), A(t.getX(B + 2));
    }
  }
  computeVertexNormals() {
    const t = this.index, e = this.getAttribute("position");
    if (e !== void 0) {
      let n = this.getAttribute("normal");
      if (n === void 0) n = new ie(new Float32Array(e.count * 3), 3), this.setAttribute("normal", n);
      else for (let d = 0, f = n.count; d < f; d++) n.setXYZ(d, 0, 0, 0);
      const i = new C(), r = new C(), a = new C(), o = new C(), l = new C(), c = new C(), h = new C(), u = new C();
      if (t) for (let d = 0, f = t.count; d < f; d += 3) {
        const m = t.getX(d + 0), _ = t.getX(d + 1), g = t.getX(d + 2);
        i.fromBufferAttribute(e, m), r.fromBufferAttribute(e, _), a.fromBufferAttribute(e, g), h.subVectors(a, r), u.subVectors(i, r), h.cross(u), o.fromBufferAttribute(n, m), l.fromBufferAttribute(n, _), c.fromBufferAttribute(n, g), o.add(h), l.add(h), c.add(h), n.setXYZ(m, o.x, o.y, o.z), n.setXYZ(_, l.x, l.y, l.z), n.setXYZ(g, c.x, c.y, c.z);
      }
      else for (let d = 0, f = e.count; d < f; d += 3) i.fromBufferAttribute(e, d + 0), r.fromBufferAttribute(e, d + 1), a.fromBufferAttribute(e, d + 2), h.subVectors(a, r), u.subVectors(i, r), h.cross(u), n.setXYZ(d + 0, h.x, h.y, h.z), n.setXYZ(d + 1, h.x, h.y, h.z), n.setXYZ(d + 2, h.x, h.y, h.z);
      this.normalizeNormals(), n.needsUpdate = true;
    }
  }
  normalizeNormals() {
    const t = this.attributes.normal;
    for (let e = 0, n = t.count; e < n; e++) ye.fromBufferAttribute(t, e), ye.normalize(), t.setXYZ(e, ye.x, ye.y, ye.z);
  }
  toNonIndexed() {
    function t(o, l) {
      const c = o.array, h = o.itemSize, u = o.normalized, d = new c.constructor(l.length * h);
      let f = 0, m = 0;
      for (let _ = 0, g = l.length; _ < g; _++) {
        o.isInterleavedBufferAttribute ? f = l[_] * o.data.stride + o.offset : f = l[_] * h;
        for (let p = 0; p < h; p++) d[m++] = c[f++];
      }
      return new ie(d, h, u);
    }
    if (this.index === null) return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
    const e = new Ht(), n = this.index.array, i = this.attributes;
    for (const o in i) {
      const l = i[o], c = t(l, n);
      e.setAttribute(o, c);
    }
    const r = this.morphAttributes;
    for (const o in r) {
      const l = [], c = r[o];
      for (let h = 0, u = c.length; h < u; h++) {
        const d = c[h], f = t(d, n);
        l.push(f);
      }
      e.morphAttributes[o] = l;
    }
    e.morphTargetsRelative = this.morphTargetsRelative;
    const a = this.groups;
    for (let o = 0, l = a.length; o < l; o++) {
      const c = a[o];
      e.addGroup(c.start, c.count, c.materialIndex);
    }
    return e;
  }
  toJSON() {
    const t = { metadata: { version: 4.6, type: "BufferGeometry", generator: "BufferGeometry.toJSON" } };
    if (t.uuid = this.uuid, t.type = this.type, this.name !== "" && (t.name = this.name), Object.keys(this.userData).length > 0 && (t.userData = this.userData), this.parameters !== void 0) {
      const l = this.parameters;
      for (const c in l) l[c] !== void 0 && (t[c] = l[c]);
      return t;
    }
    t.data = { attributes: {} };
    const e = this.index;
    e !== null && (t.data.index = { type: e.array.constructor.name, array: Array.prototype.slice.call(e.array) });
    const n = this.attributes;
    for (const l in n) {
      const c = n[l];
      t.data.attributes[l] = c.toJSON(t.data);
    }
    const i = {};
    let r = false;
    for (const l in this.morphAttributes) {
      const c = this.morphAttributes[l], h = [];
      for (let u = 0, d = c.length; u < d; u++) {
        const f = c[u];
        h.push(f.toJSON(t.data));
      }
      h.length > 0 && (i[l] = h, r = true);
    }
    r && (t.data.morphAttributes = i, t.data.morphTargetsRelative = this.morphTargetsRelative);
    const a = this.groups;
    a.length > 0 && (t.data.groups = JSON.parse(JSON.stringify(a)));
    const o = this.boundingSphere;
    return o !== null && (t.data.boundingSphere = { center: o.center.toArray(), radius: o.radius }), t;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
    const e = {};
    this.name = t.name;
    const n = t.index;
    n !== null && this.setIndex(n.clone(e));
    const i = t.attributes;
    for (const c in i) {
      const h = i[c];
      this.setAttribute(c, h.clone(e));
    }
    const r = t.morphAttributes;
    for (const c in r) {
      const h = [], u = r[c];
      for (let d = 0, f = u.length; d < f; d++) h.push(u[d].clone(e));
      this.morphAttributes[c] = h;
    }
    this.morphTargetsRelative = t.morphTargetsRelative;
    const a = t.groups;
    for (let c = 0, h = a.length; c < h; c++) {
      const u = a[c];
      this.addGroup(u.start, u.count, u.materialIndex);
    }
    const o = t.boundingBox;
    o !== null && (this.boundingBox = o.clone());
    const l = t.boundingSphere;
    return l !== null && (this.boundingSphere = l.clone()), this.drawRange.start = t.drawRange.start, this.drawRange.count = t.drawRange.count, this.userData = t.userData, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
const rh = new Pt(), ni = new hs(), Pr = new Te(), ah = new C(), Ir = new C(), Lr = new C(), Dr = new C(), ll = new C(), Ur = new C(), oh = new C(), Nr = new C();
class _e extends $t {
  constructor(t = new Ht(), e = new $n()) {
    super(), this.isMesh = true, this.type = "Mesh", this.geometry = t, this.material = e, this.updateMorphTargets();
  }
  copy(t, e) {
    return super.copy(t, e), t.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = t.morphTargetInfluences.slice()), t.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, t.morphTargetDictionary)), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, n = Object.keys(e);
    if (n.length > 0) {
      const i = e[n[0]];
      if (i !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let r = 0, a = i.length; r < a; r++) {
          const o = i[r].name || String(r);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = r;
        }
      }
    }
  }
  getVertexPosition(t, e) {
    const n = this.geometry, i = n.attributes.position, r = n.morphAttributes.position, a = n.morphTargetsRelative;
    e.fromBufferAttribute(i, t);
    const o = this.morphTargetInfluences;
    if (r && o) {
      Ur.set(0, 0, 0);
      for (let l = 0, c = r.length; l < c; l++) {
        const h = o[l], u = r[l];
        h !== 0 && (ll.fromBufferAttribute(u, t), a ? Ur.addScaledVector(ll, h) : Ur.addScaledVector(ll.sub(e), h));
      }
      e.add(Ur);
    }
    return e;
  }
  raycast(t, e) {
    const n = this.geometry, i = this.material, r = this.matrixWorld;
    i !== void 0 && (n.boundingSphere === null && n.computeBoundingSphere(), Pr.copy(n.boundingSphere), Pr.applyMatrix4(r), ni.copy(t.ray).recast(t.near), !(Pr.containsPoint(ni.origin) === false && (ni.intersectSphere(Pr, ah) === null || ni.origin.distanceToSquared(ah) > (t.far - t.near) ** 2)) && (rh.copy(r).invert(), ni.copy(t.ray).applyMatrix4(rh), !(n.boundingBox !== null && ni.intersectsBox(n.boundingBox) === false) && this._computeIntersections(t, e, ni)));
  }
  _computeIntersections(t, e, n) {
    let i;
    const r = this.geometry, a = this.material, o = r.index, l = r.attributes.position, c = r.attributes.uv, h = r.attributes.uv1, u = r.attributes.normal, d = r.groups, f = r.drawRange;
    if (o !== null) if (Array.isArray(a)) for (let m = 0, _ = d.length; m < _; m++) {
      const g = d[m], p = a[g.materialIndex], y = Math.max(g.start, f.start), x = Math.min(o.count, Math.min(g.start + g.count, f.start + f.count));
      for (let M = y, I = x; M < I; M += 3) {
        const E = o.getX(M), A = o.getX(M + 1), P = o.getX(M + 2);
        i = Fr(this, p, t, n, c, h, u, E, A, P), i && (i.faceIndex = Math.floor(M / 3), i.face.materialIndex = g.materialIndex, e.push(i));
      }
    }
    else {
      const m = Math.max(0, f.start), _ = Math.min(o.count, f.start + f.count);
      for (let g = m, p = _; g < p; g += 3) {
        const y = o.getX(g), x = o.getX(g + 1), M = o.getX(g + 2);
        i = Fr(this, a, t, n, c, h, u, y, x, M), i && (i.faceIndex = Math.floor(g / 3), e.push(i));
      }
    }
    else if (l !== void 0) if (Array.isArray(a)) for (let m = 0, _ = d.length; m < _; m++) {
      const g = d[m], p = a[g.materialIndex], y = Math.max(g.start, f.start), x = Math.min(l.count, Math.min(g.start + g.count, f.start + f.count));
      for (let M = y, I = x; M < I; M += 3) {
        const E = M, A = M + 1, P = M + 2;
        i = Fr(this, p, t, n, c, h, u, E, A, P), i && (i.faceIndex = Math.floor(M / 3), i.face.materialIndex = g.materialIndex, e.push(i));
      }
    }
    else {
      const m = Math.max(0, f.start), _ = Math.min(l.count, f.start + f.count);
      for (let g = m, p = _; g < p; g += 3) {
        const y = g, x = g + 1, M = g + 2;
        i = Fr(this, a, t, n, c, h, u, y, x, M), i && (i.faceIndex = Math.floor(g / 3), e.push(i));
      }
    }
  }
}
function mm(s, t, e, n, i, r, a, o) {
  let l;
  if (t.side === De ? l = n.intersectTriangle(a, r, i, true, o) : l = n.intersectTriangle(i, r, a, t.side === Pn, o), l === null) return null;
  Nr.copy(o), Nr.applyMatrix4(s.matrixWorld);
  const c = e.ray.origin.distanceTo(Nr);
  return c < e.near || c > e.far ? null : { distance: c, point: Nr.clone(), object: s };
}
function Fr(s, t, e, n, i, r, a, o, l, c) {
  s.getVertexPosition(o, Ir), s.getVertexPosition(l, Lr), s.getVertexPosition(c, Dr);
  const h = mm(s, t, e, n, Ir, Lr, Dr, oh);
  if (h) {
    const u = new C();
    ze.getBarycoord(oh, Ir, Lr, Dr, u), i && (h.uv = ze.getInterpolatedAttribute(i, o, l, c, u, new Z())), r && (h.uv1 = ze.getInterpolatedAttribute(r, o, l, c, u, new Z())), a && (h.normal = ze.getInterpolatedAttribute(a, o, l, c, u, new C()), h.normal.dot(n.direction) > 0 && h.normal.multiplyScalar(-1));
    const d = { a: o, b: l, c, normal: new C(), materialIndex: 0 };
    ze.getNormal(Ir, Lr, Dr, d.normal), h.face = d, h.barycoord = u;
  }
  return h;
}
class Ri extends Ht {
  constructor(t = 1, e = 1, n = 1, i = 1, r = 1, a = 1) {
    super(), this.type = "BoxGeometry", this.parameters = { width: t, height: e, depth: n, widthSegments: i, heightSegments: r, depthSegments: a };
    const o = this;
    i = Math.floor(i), r = Math.floor(r), a = Math.floor(a);
    const l = [], c = [], h = [], u = [];
    let d = 0, f = 0;
    m("z", "y", "x", -1, -1, n, e, t, a, r, 0), m("z", "y", "x", 1, -1, n, e, -t, a, r, 1), m("x", "z", "y", 1, 1, t, n, e, i, a, 2), m("x", "z", "y", 1, -1, t, n, -e, i, a, 3), m("x", "y", "z", 1, -1, t, e, n, i, r, 4), m("x", "y", "z", -1, -1, t, e, -n, i, r, 5), this.setIndex(l), this.setAttribute("position", new wt(c, 3)), this.setAttribute("normal", new wt(h, 3)), this.setAttribute("uv", new wt(u, 2));
    function m(_, g, p, y, x, M, I, E, A, P, V) {
      const v = M / A, b = I / P, k = M / 2, B = I / 2, H = E / 2, Q = A + 1, O = P + 1;
      let tt = 0, W = 0;
      const ht = new C();
      for (let pt = 0; pt < O; pt++) {
        const mt = pt * b - B;
        for (let Wt = 0; Wt < Q; Wt++) {
          const Kt = Wt * v - k;
          ht[_] = Kt * y, ht[g] = mt * x, ht[p] = H, c.push(ht.x, ht.y, ht.z), ht[_] = 0, ht[g] = 0, ht[p] = E > 0 ? 1 : -1, h.push(ht.x, ht.y, ht.z), u.push(Wt / A), u.push(1 - pt / P), tt += 1;
        }
      }
      for (let pt = 0; pt < P; pt++) for (let mt = 0; mt < A; mt++) {
        const Wt = d + mt + Q * pt, Kt = d + mt + Q * (pt + 1), X = d + (mt + 1) + Q * (pt + 1), et = d + (mt + 1) + Q * pt;
        l.push(Wt, Kt, et), l.push(Kt, X, et), W += 6;
      }
      o.addGroup(f, W, V), f += W, d += tt;
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new Ri(t.width, t.height, t.depth, t.widthSegments, t.heightSegments, t.depthSegments);
  }
}
function as(s) {
  const t = {};
  for (const e in s) {
    t[e] = {};
    for (const n in s[e]) {
      const i = s[e][n];
      i && (i.isColor || i.isMatrix3 || i.isMatrix4 || i.isVector2 || i.isVector3 || i.isVector4 || i.isTexture || i.isQuaternion) ? i.isRenderTargetTexture ? (console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), t[e][n] = null) : t[e][n] = i.clone() : Array.isArray(i) ? t[e][n] = i.slice() : t[e][n] = i;
    }
  }
  return t;
}
function Pe(s) {
  const t = {};
  for (let e = 0; e < s.length; e++) {
    const n = as(s[e]);
    for (const i in n) t[i] = n[i];
  }
  return t;
}
function gm(s) {
  const t = [];
  for (let e = 0; e < s.length; e++) t.push(s[e].clone());
  return t;
}
function Td(s) {
  const t = s.getRenderTarget();
  return t === null ? s.outputColorSpace : t.isXRRenderTarget === true ? t.texture.colorSpace : Qt.workingColorSpace;
}
const Cd = { clone: as, merge: Pe };
var _m = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`, xm = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
class an extends Ce {
  constructor(t) {
    super(), this.isShaderMaterial = true, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = _m, this.fragmentShader = xm, this.linewidth = 1, this.wireframe = false, this.wireframeLinewidth = 1, this.fog = false, this.lights = false, this.clipping = false, this.forceSinglePass = true, this.extensions = { clipCullDistance: false, multiDraw: false }, this.defaultAttributeValues = { color: [1, 1, 1], uv: [0, 0], uv1: [0, 0] }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = false, this.glslVersion = null, t !== void 0 && this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.fragmentShader = t.fragmentShader, this.vertexShader = t.vertexShader, this.uniforms = as(t.uniforms), this.uniformsGroups = gm(t.uniformsGroups), this.defines = Object.assign({}, t.defines), this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.fog = t.fog, this.lights = t.lights, this.clipping = t.clipping, this.extensions = Object.assign({}, t.extensions), this.glslVersion = t.glslVersion, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    e.glslVersion = this.glslVersion, e.uniforms = {};
    for (const i in this.uniforms) {
      const a = this.uniforms[i].value;
      a && a.isTexture ? e.uniforms[i] = { type: "t", value: a.toJSON(t).uuid } : a && a.isColor ? e.uniforms[i] = { type: "c", value: a.getHex() } : a && a.isVector2 ? e.uniforms[i] = { type: "v2", value: a.toArray() } : a && a.isVector3 ? e.uniforms[i] = { type: "v3", value: a.toArray() } : a && a.isVector4 ? e.uniforms[i] = { type: "v4", value: a.toArray() } : a && a.isMatrix3 ? e.uniforms[i] = { type: "m3", value: a.toArray() } : a && a.isMatrix4 ? e.uniforms[i] = { type: "m4", value: a.toArray() } : e.uniforms[i] = { value: a };
    }
    Object.keys(this.defines).length > 0 && (e.defines = this.defines), e.vertexShader = this.vertexShader, e.fragmentShader = this.fragmentShader, e.lights = this.lights, e.clipping = this.clipping;
    const n = {};
    for (const i in this.extensions) this.extensions[i] === true && (n[i] = true);
    return Object.keys(n).length > 0 && (e.extensions = n), e;
  }
}
class go extends $t {
  constructor() {
    super(), this.isCamera = true, this.type = "Camera", this.matrixWorldInverse = new Pt(), this.projectionMatrix = new Pt(), this.projectionMatrixInverse = new Pt(), this.coordinateSystem = dn;
  }
  copy(t, e) {
    return super.copy(t, e), this.matrixWorldInverse.copy(t.matrixWorldInverse), this.projectionMatrix.copy(t.projectionMatrix), this.projectionMatrixInverse.copy(t.projectionMatrixInverse), this.coordinateSystem = t.coordinateSystem, this;
  }
  getWorldDirection(t) {
    return super.getWorldDirection(t).negate();
  }
  updateMatrixWorld(t) {
    super.updateMatrixWorld(t), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  updateWorldMatrix(t, e) {
    super.updateWorldMatrix(t, e), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const Vn = new C(), lh = new Z(), ch = new Z();
class be extends go {
  constructor(t = 50, e = 1, n = 0.1, i = 2e3) {
    super(), this.isPerspectiveCamera = true, this.type = "PerspectiveCamera", this.fov = t, this.zoom = 1, this.near = n, this.far = i, this.focus = 10, this.aspect = e, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
  }
  copy(t, e) {
    return super.copy(t, e), this.fov = t.fov, this.zoom = t.zoom, this.near = t.near, this.far = t.far, this.focus = t.focus, this.aspect = t.aspect, this.view = t.view === null ? null : Object.assign({}, t.view), this.filmGauge = t.filmGauge, this.filmOffset = t.filmOffset, this;
  }
  setFocalLength(t) {
    const e = 0.5 * this.getFilmHeight() / t;
    this.fov = rs * 2 * Math.atan(e), this.updateProjectionMatrix();
  }
  getFocalLength() {
    const t = Math.tan(Si * 0.5 * this.fov);
    return 0.5 * this.getFilmHeight() / t;
  }
  getEffectiveFOV() {
    return rs * 2 * Math.atan(Math.tan(Si * 0.5 * this.fov) / this.zoom);
  }
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  getViewBounds(t, e, n) {
    Vn.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), e.set(Vn.x, Vn.y).multiplyScalar(-t / Vn.z), Vn.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), n.set(Vn.x, Vn.y).multiplyScalar(-t / Vn.z);
  }
  getViewSize(t, e) {
    return this.getViewBounds(t, lh, ch), e.subVectors(ch, lh);
  }
  setViewOffset(t, e, n, i, r, a) {
    this.aspect = t / e, this.view === null && (this.view = { enabled: true, fullWidth: 1, fullHeight: 1, offsetX: 0, offsetY: 0, width: 1, height: 1 }), this.view.enabled = true, this.view.fullWidth = t, this.view.fullHeight = e, this.view.offsetX = n, this.view.offsetY = i, this.view.width = r, this.view.height = a, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = false), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const t = this.near;
    let e = t * Math.tan(Si * 0.5 * this.fov) / this.zoom, n = 2 * e, i = this.aspect * n, r = -0.5 * i;
    const a = this.view;
    if (this.view !== null && this.view.enabled) {
      const l = a.fullWidth, c = a.fullHeight;
      r += a.offsetX * i / l, e -= a.offsetY * n / c, i *= a.width / l, n *= a.height / c;
    }
    const o = this.filmOffset;
    o !== 0 && (r += t * o / this.getFilmWidth()), this.projectionMatrix.makePerspective(r, r + i, e, e - n, t, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.fov = this.fov, e.object.zoom = this.zoom, e.object.near = this.near, e.object.far = this.far, e.object.focus = this.focus, e.object.aspect = this.aspect, this.view !== null && (e.object.view = Object.assign({}, this.view)), e.object.filmGauge = this.filmGauge, e.object.filmOffset = this.filmOffset, e;
  }
}
const Gi = -90, Wi = 1;
class Rd extends $t {
  constructor(t, e, n) {
    super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null, this.activeMipmapLevel = 0;
    const i = new be(Gi, Wi, t, e);
    i.layers = this.layers, this.add(i);
    const r = new be(Gi, Wi, t, e);
    r.layers = this.layers, this.add(r);
    const a = new be(Gi, Wi, t, e);
    a.layers = this.layers, this.add(a);
    const o = new be(Gi, Wi, t, e);
    o.layers = this.layers, this.add(o);
    const l = new be(Gi, Wi, t, e);
    l.layers = this.layers, this.add(l);
    const c = new be(Gi, Wi, t, e);
    c.layers = this.layers, this.add(c);
  }
  updateCoordinateSystem() {
    const t = this.coordinateSystem, e = this.children.concat(), [n, i, r, a, o, l] = e;
    for (const c of e) this.remove(c);
    if (t === dn) n.up.set(0, 1, 0), n.lookAt(1, 0, 0), i.up.set(0, 1, 0), i.lookAt(-1, 0, 0), r.up.set(0, 0, -1), r.lookAt(0, 1, 0), a.up.set(0, 0, 1), a.lookAt(0, -1, 0), o.up.set(0, 1, 0), o.lookAt(0, 0, 1), l.up.set(0, 1, 0), l.lookAt(0, 0, -1);
    else if (t === Ks) n.up.set(0, -1, 0), n.lookAt(-1, 0, 0), i.up.set(0, -1, 0), i.lookAt(1, 0, 0), r.up.set(0, 0, 1), r.lookAt(0, 1, 0), a.up.set(0, 0, -1), a.lookAt(0, -1, 0), o.up.set(0, -1, 0), o.lookAt(0, 0, 1), l.up.set(0, -1, 0), l.lookAt(0, 0, -1);
    else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + t);
    for (const c of e) this.add(c), c.updateMatrixWorld();
  }
  update(t, e) {
    this.parent === null && this.updateMatrixWorld();
    const { renderTarget: n, activeMipmapLevel: i } = this;
    this.coordinateSystem !== t.coordinateSystem && (this.coordinateSystem = t.coordinateSystem, this.updateCoordinateSystem());
    const [r, a, o, l, c, h] = this.children, u = t.getRenderTarget(), d = t.getActiveCubeFace(), f = t.getActiveMipmapLevel(), m = t.xr.enabled;
    t.xr.enabled = false;
    const _ = n.texture.generateMipmaps;
    n.texture.generateMipmaps = false, t.setRenderTarget(n, 0, i), t.render(e, r), t.setRenderTarget(n, 1, i), t.render(e, a), t.setRenderTarget(n, 2, i), t.render(e, o), t.setRenderTarget(n, 3, i), t.render(e, l), t.setRenderTarget(n, 4, i), t.render(e, c), n.texture.generateMipmaps = _, t.setRenderTarget(n, 5, i), t.render(e, h), t.setRenderTarget(u, d, f), t.xr.enabled = m, n.texture.needsPMREMUpdate = true;
  }
}
class ur extends ue {
  constructor(t, e, n, i, r, a, o, l, c, h) {
    t = t !== void 0 ? t : [], e = e !== void 0 ? e : In, super(t, e, n, i, r, a, o, l, c, h), this.isCubeTexture = true, this.flipY = false;
  }
  get images() {
    return this.image;
  }
  set images(t) {
    this.image = t;
  }
}
class Pd extends rn {
  constructor(t = 1, e = {}) {
    super(t, t, e), this.isWebGLCubeRenderTarget = true;
    const n = { width: t, height: t, depth: 1 }, i = [n, n, n, n, n, n];
    this.texture = new ur(i, e.mapping, e.wrapS, e.wrapT, e.magFilter, e.minFilter, e.format, e.type, e.anisotropy, e.colorSpace), this.texture.isRenderTargetTexture = true, this.texture.generateMipmaps = e.generateMipmaps !== void 0 ? e.generateMipmaps : false, this.texture.minFilter = e.minFilter !== void 0 ? e.minFilter : ge;
  }
  fromEquirectangularTexture(t, e) {
    this.texture.type = e.type, this.texture.colorSpace = e.colorSpace, this.texture.generateMipmaps = e.generateMipmaps, this.texture.minFilter = e.minFilter, this.texture.magFilter = e.magFilter;
    const n = { uniforms: { tEquirect: { value: null } }, vertexShader: `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`, fragmentShader: `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			` }, i = new Ri(5, 5, 5), r = new an({ name: "CubemapFromEquirect", uniforms: as(n.uniforms), vertexShader: n.vertexShader, fragmentShader: n.fragmentShader, side: De, blending: Cn });
    r.uniforms.tEquirect.value = e;
    const a = new _e(i, r), o = e.minFilter;
    return e.minFilter === un && (e.minFilter = ge), new Rd(1, 10, this).update(t, a), e.minFilter = o, a.geometry.dispose(), a.material.dispose(), this;
  }
  clear(t, e, n, i) {
    const r = t.getRenderTarget();
    for (let a = 0; a < 6; a++) t.setRenderTarget(this, a), t.clear(e, n, i);
    t.setRenderTarget(r);
  }
}
const cl = new C(), vm = new C(), ym = new zt();
class Wn {
  constructor(t = new C(1, 0, 0), e = 0) {
    this.isPlane = true, this.normal = t, this.constant = e;
  }
  set(t, e) {
    return this.normal.copy(t), this.constant = e, this;
  }
  setComponents(t, e, n, i) {
    return this.normal.set(t, e, n), this.constant = i, this;
  }
  setFromNormalAndCoplanarPoint(t, e) {
    return this.normal.copy(t), this.constant = -e.dot(this.normal), this;
  }
  setFromCoplanarPoints(t, e, n) {
    const i = cl.subVectors(n, e).cross(vm.subVectors(t, e)).normalize();
    return this.setFromNormalAndCoplanarPoint(i, t), this;
  }
  copy(t) {
    return this.normal.copy(t.normal), this.constant = t.constant, this;
  }
  normalize() {
    const t = 1 / this.normal.length();
    return this.normal.multiplyScalar(t), this.constant *= t, this;
  }
  negate() {
    return this.constant *= -1, this.normal.negate(), this;
  }
  distanceToPoint(t) {
    return this.normal.dot(t) + this.constant;
  }
  distanceToSphere(t) {
    return this.distanceToPoint(t.center) - t.radius;
  }
  projectPoint(t, e) {
    return e.copy(t).addScaledVector(this.normal, -this.distanceToPoint(t));
  }
  intersectLine(t, e) {
    const n = t.delta(cl), i = this.normal.dot(n);
    if (i === 0) return this.distanceToPoint(t.start) === 0 ? e.copy(t.start) : null;
    const r = -(t.start.dot(this.normal) + this.constant) / i;
    return r < 0 || r > 1 ? null : e.copy(t.start).addScaledVector(n, r);
  }
  intersectsLine(t) {
    const e = this.distanceToPoint(t.start), n = this.distanceToPoint(t.end);
    return e < 0 && n > 0 || n < 0 && e > 0;
  }
  intersectsBox(t) {
    return t.intersectsPlane(this);
  }
  intersectsSphere(t) {
    return t.intersectsPlane(this);
  }
  coplanarPoint(t) {
    return t.copy(this.normal).multiplyScalar(-this.constant);
  }
  applyMatrix4(t, e) {
    const n = e || ym.getNormalMatrix(t), i = this.coplanarPoint(cl).applyMatrix4(t), r = this.normal.applyMatrix3(n).normalize();
    return this.constant = -i.dot(r), this;
  }
  translate(t) {
    return this.constant -= t.dot(this.normal), this;
  }
  equals(t) {
    return t.normal.equals(this.normal) && t.constant === this.constant;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const ii = new Te(), Or = new C();
class dr {
  constructor(t = new Wn(), e = new Wn(), n = new Wn(), i = new Wn(), r = new Wn(), a = new Wn()) {
    this.planes = [t, e, n, i, r, a];
  }
  set(t, e, n, i, r, a) {
    const o = this.planes;
    return o[0].copy(t), o[1].copy(e), o[2].copy(n), o[3].copy(i), o[4].copy(r), o[5].copy(a), this;
  }
  copy(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) e[n].copy(t.planes[n]);
    return this;
  }
  setFromProjectionMatrix(t, e = dn) {
    const n = this.planes, i = t.elements, r = i[0], a = i[1], o = i[2], l = i[3], c = i[4], h = i[5], u = i[6], d = i[7], f = i[8], m = i[9], _ = i[10], g = i[11], p = i[12], y = i[13], x = i[14], M = i[15];
    if (n[0].setComponents(l - r, d - c, g - f, M - p).normalize(), n[1].setComponents(l + r, d + c, g + f, M + p).normalize(), n[2].setComponents(l + a, d + h, g + m, M + y).normalize(), n[3].setComponents(l - a, d - h, g - m, M - y).normalize(), n[4].setComponents(l - o, d - u, g - _, M - x).normalize(), e === dn) n[5].setComponents(l + o, d + u, g + _, M + x).normalize();
    else if (e === Ks) n[5].setComponents(o, u, _, x).normalize();
    else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + e);
    return this;
  }
  intersectsObject(t) {
    if (t.boundingSphere !== void 0) t.boundingSphere === null && t.computeBoundingSphere(), ii.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);
    else {
      const e = t.geometry;
      e.boundingSphere === null && e.computeBoundingSphere(), ii.copy(e.boundingSphere).applyMatrix4(t.matrixWorld);
    }
    return this.intersectsSphere(ii);
  }
  intersectsSprite(t) {
    return ii.center.set(0, 0, 0), ii.radius = 0.7071067811865476, ii.applyMatrix4(t.matrixWorld), this.intersectsSphere(ii);
  }
  intersectsSphere(t) {
    const e = this.planes, n = t.center, i = -t.radius;
    for (let r = 0; r < 6; r++) if (e[r].distanceToPoint(n) < i) return false;
    return true;
  }
  intersectsBox(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) {
      const i = e[n];
      if (Or.x = i.normal.x > 0 ? t.max.x : t.min.x, Or.y = i.normal.y > 0 ? t.max.y : t.min.y, Or.z = i.normal.z > 0 ? t.max.z : t.min.z, i.distanceToPoint(Or) < 0) return false;
    }
    return true;
  }
  containsPoint(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) if (e[n].distanceToPoint(t) < 0) return false;
    return true;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
function Id() {
  let s = null, t = false, e = null, n = null;
  function i(r, a) {
    e(r, a), n = s.requestAnimationFrame(i);
  }
  return { start: function() {
    t !== true && e !== null && (n = s.requestAnimationFrame(i), t = true);
  }, stop: function() {
    s.cancelAnimationFrame(n), t = false;
  }, setAnimationLoop: function(r) {
    e = r;
  }, setContext: function(r) {
    s = r;
  } };
}
function Mm(s) {
  const t = /* @__PURE__ */ new WeakMap();
  function e(o, l) {
    const c = o.array, h = o.usage, u = c.byteLength, d = s.createBuffer();
    s.bindBuffer(l, d), s.bufferData(l, c, h), o.onUploadCallback();
    let f;
    if (c instanceof Float32Array) f = s.FLOAT;
    else if (c instanceof Uint16Array) o.isFloat16BufferAttribute ? f = s.HALF_FLOAT : f = s.UNSIGNED_SHORT;
    else if (c instanceof Int16Array) f = s.SHORT;
    else if (c instanceof Uint32Array) f = s.UNSIGNED_INT;
    else if (c instanceof Int32Array) f = s.INT;
    else if (c instanceof Int8Array) f = s.BYTE;
    else if (c instanceof Uint8Array) f = s.UNSIGNED_BYTE;
    else if (c instanceof Uint8ClampedArray) f = s.UNSIGNED_BYTE;
    else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + c);
    return { buffer: d, type: f, bytesPerElement: c.BYTES_PER_ELEMENT, version: o.version, size: u };
  }
  function n(o, l, c) {
    const h = l.array, u = l.updateRanges;
    if (s.bindBuffer(c, o), u.length === 0) s.bufferSubData(c, 0, h);
    else {
      u.sort((f, m) => f.start - m.start);
      let d = 0;
      for (let f = 1; f < u.length; f++) {
        const m = u[d], _ = u[f];
        _.start <= m.start + m.count + 1 ? m.count = Math.max(m.count, _.start + _.count - m.start) : (++d, u[d] = _);
      }
      u.length = d + 1;
      for (let f = 0, m = u.length; f < m; f++) {
        const _ = u[f];
        s.bufferSubData(c, _.start * h.BYTES_PER_ELEMENT, h, _.start, _.count);
      }
      l.clearUpdateRanges();
    }
    l.onUploadCallback();
  }
  function i(o) {
    return o.isInterleavedBufferAttribute && (o = o.data), t.get(o);
  }
  function r(o) {
    o.isInterleavedBufferAttribute && (o = o.data);
    const l = t.get(o);
    l && (s.deleteBuffer(l.buffer), t.delete(o));
  }
  function a(o, l) {
    if (o.isInterleavedBufferAttribute && (o = o.data), o.isGLBufferAttribute) {
      const h = t.get(o);
      (!h || h.version < o.version) && t.set(o, { buffer: o.buffer, type: o.type, bytesPerElement: o.elementSize, version: o.version });
      return;
    }
    const c = t.get(o);
    if (c === void 0) t.set(o, e(o, l));
    else if (c.version < o.version) {
      if (c.size !== o.array.byteLength) throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
      n(c.buffer, o, l), c.version = o.version;
    }
  }
  return { get: i, remove: r, update: a };
}
class us extends Ht {
  constructor(t = 1, e = 1, n = 1, i = 1) {
    super(), this.type = "PlaneGeometry", this.parameters = { width: t, height: e, widthSegments: n, heightSegments: i };
    const r = t / 2, a = e / 2, o = Math.floor(n), l = Math.floor(i), c = o + 1, h = l + 1, u = t / o, d = e / l, f = [], m = [], _ = [], g = [];
    for (let p = 0; p < h; p++) {
      const y = p * d - a;
      for (let x = 0; x < c; x++) {
        const M = x * u - r;
        m.push(M, -y, 0), _.push(0, 0, 1), g.push(x / o), g.push(1 - p / l);
      }
    }
    for (let p = 0; p < l; p++) for (let y = 0; y < o; y++) {
      const x = y + c * p, M = y + c * (p + 1), I = y + 1 + c * (p + 1), E = y + 1 + c * p;
      f.push(x, M, E), f.push(M, I, E);
    }
    this.setIndex(f), this.setAttribute("position", new wt(m, 3)), this.setAttribute("normal", new wt(_, 3)), this.setAttribute("uv", new wt(g, 2));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new us(t.width, t.height, t.widthSegments, t.heightSegments);
  }
}
var Sm = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`, bm = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`, wm = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`, Em = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, Am = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`, Tm = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`, Cm = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`, Rm = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`, Pm = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`, Im = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`, Lm = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`, Dm = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`, Um = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`, Nm = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`, Fm = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`, Om = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`, Bm = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`, zm = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`, km = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`, Vm = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`, Hm = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`, Gm = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`, Wm = `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`, Xm = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`, qm = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`, Ym = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`, Zm = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`, Jm = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`, $m = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`, Km = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`, Qm = "gl_FragColor = linearToOutputTexel( gl_FragColor );", jm = `
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`, tg = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`, eg = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`, ng = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`, ig = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`, sg = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`, rg = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`, ag = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`, og = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`, lg = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`, cg = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`, hg = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`, ug = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`, dg = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`, fg = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`, pg = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`, mg = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`, gg = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`, _g = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`, xg = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`, vg = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`, yg = `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`, Mg = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`, Sg = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`, bg = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`, wg = `#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`, Eg = `#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Ag = `#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Tg = `#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`, Cg = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`, Rg = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`, Pg = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`, Ig = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, Lg = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`, Dg = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`, Ug = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`, Ng = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`, Fg = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, Og = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`, Bg = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, zg = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`, kg = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`, Vg = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, Hg = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, Gg = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`, Wg = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`, Xg = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`, qg = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`, Yg = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`, Zg = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`, Jg = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`, $g = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`, Kg = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`, Qg = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`, jg = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`, t_ = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`, e_ = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`, n_ = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`, i_ = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`, s_ = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`, r_ = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`, a_ = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`, o_ = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`, l_ = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, c_ = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`, h_ = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`, u_ = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`, d_ = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`, f_ = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`, p_ = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`, m_ = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`, g_ = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`, __ = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, x_ = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, v_ = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`, y_ = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
const M_ = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`, S_ = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, b_ = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, w_ = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, E_ = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, A_ = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, T_ = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`, C_ = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`, R_ = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`, P_ = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`, I_ = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`, L_ = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, D_ = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, U_ = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, N_ = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`, F_ = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, O_ = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, B_ = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, z_ = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`, k_ = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, V_ = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`, H_ = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`, G_ = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, W_ = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, X_ = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`, q_ = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Y_ = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Z_ = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, J_ = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`, $_ = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, K_ = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Q_ = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, j_ = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, t0 = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, Vt = { alphahash_fragment: Sm, alphahash_pars_fragment: bm, alphamap_fragment: wm, alphamap_pars_fragment: Em, alphatest_fragment: Am, alphatest_pars_fragment: Tm, aomap_fragment: Cm, aomap_pars_fragment: Rm, batching_pars_vertex: Pm, batching_vertex: Im, begin_vertex: Lm, beginnormal_vertex: Dm, bsdfs: Um, iridescence_fragment: Nm, bumpmap_pars_fragment: Fm, clipping_planes_fragment: Om, clipping_planes_pars_fragment: Bm, clipping_planes_pars_vertex: zm, clipping_planes_vertex: km, color_fragment: Vm, color_pars_fragment: Hm, color_pars_vertex: Gm, color_vertex: Wm, common: Xm, cube_uv_reflection_fragment: qm, defaultnormal_vertex: Ym, displacementmap_pars_vertex: Zm, displacementmap_vertex: Jm, emissivemap_fragment: $m, emissivemap_pars_fragment: Km, colorspace_fragment: Qm, colorspace_pars_fragment: jm, envmap_fragment: tg, envmap_common_pars_fragment: eg, envmap_pars_fragment: ng, envmap_pars_vertex: ig, envmap_physical_pars_fragment: pg, envmap_vertex: sg, fog_vertex: rg, fog_pars_vertex: ag, fog_fragment: og, fog_pars_fragment: lg, gradientmap_pars_fragment: cg, lightmap_pars_fragment: hg, lights_lambert_fragment: ug, lights_lambert_pars_fragment: dg, lights_pars_begin: fg, lights_toon_fragment: mg, lights_toon_pars_fragment: gg, lights_phong_fragment: _g, lights_phong_pars_fragment: xg, lights_physical_fragment: vg, lights_physical_pars_fragment: yg, lights_fragment_begin: Mg, lights_fragment_maps: Sg, lights_fragment_end: bg, logdepthbuf_fragment: wg, logdepthbuf_pars_fragment: Eg, logdepthbuf_pars_vertex: Ag, logdepthbuf_vertex: Tg, map_fragment: Cg, map_pars_fragment: Rg, map_particle_fragment: Pg, map_particle_pars_fragment: Ig, metalnessmap_fragment: Lg, metalnessmap_pars_fragment: Dg, morphinstance_vertex: Ug, morphcolor_vertex: Ng, morphnormal_vertex: Fg, morphtarget_pars_vertex: Og, morphtarget_vertex: Bg, normal_fragment_begin: zg, normal_fragment_maps: kg, normal_pars_fragment: Vg, normal_pars_vertex: Hg, normal_vertex: Gg, normalmap_pars_fragment: Wg, clearcoat_normal_fragment_begin: Xg, clearcoat_normal_fragment_maps: qg, clearcoat_pars_fragment: Yg, iridescence_pars_fragment: Zg, opaque_fragment: Jg, packing: $g, premultiplied_alpha_fragment: Kg, project_vertex: Qg, dithering_fragment: jg, dithering_pars_fragment: t_, roughnessmap_fragment: e_, roughnessmap_pars_fragment: n_, shadowmap_pars_fragment: i_, shadowmap_pars_vertex: s_, shadowmap_vertex: r_, shadowmask_pars_fragment: a_, skinbase_vertex: o_, skinning_pars_vertex: l_, skinning_vertex: c_, skinnormal_vertex: h_, specularmap_fragment: u_, specularmap_pars_fragment: d_, tonemapping_fragment: f_, tonemapping_pars_fragment: p_, transmission_fragment: m_, transmission_pars_fragment: g_, uv_pars_fragment: __, uv_pars_vertex: x_, uv_vertex: v_, worldpos_vertex: y_, background_vert: M_, background_frag: S_, backgroundCube_vert: b_, backgroundCube_frag: w_, cube_vert: E_, cube_frag: A_, depth_vert: T_, depth_frag: C_, distanceRGBA_vert: R_, distanceRGBA_frag: P_, equirect_vert: I_, equirect_frag: L_, linedashed_vert: D_, linedashed_frag: U_, meshbasic_vert: N_, meshbasic_frag: F_, meshlambert_vert: O_, meshlambert_frag: B_, meshmatcap_vert: z_, meshmatcap_frag: k_, meshnormal_vert: V_, meshnormal_frag: H_, meshphong_vert: G_, meshphong_frag: W_, meshphysical_vert: X_, meshphysical_frag: q_, meshtoon_vert: Y_, meshtoon_frag: Z_, points_vert: J_, points_frag: $_, shadow_vert: K_, shadow_frag: Q_, sprite_vert: j_, sprite_frag: t0 }, ot = { common: { diffuse: { value: new ft(16777215) }, opacity: { value: 1 }, map: { value: null }, mapTransform: { value: new zt() }, alphaMap: { value: null }, alphaMapTransform: { value: new zt() }, alphaTest: { value: 0 } }, specularmap: { specularMap: { value: null }, specularMapTransform: { value: new zt() } }, envmap: { envMap: { value: null }, envMapRotation: { value: new zt() }, flipEnvMap: { value: -1 }, reflectivity: { value: 1 }, ior: { value: 1.5 }, refractionRatio: { value: 0.98 } }, aomap: { aoMap: { value: null }, aoMapIntensity: { value: 1 }, aoMapTransform: { value: new zt() } }, lightmap: { lightMap: { value: null }, lightMapIntensity: { value: 1 }, lightMapTransform: { value: new zt() } }, bumpmap: { bumpMap: { value: null }, bumpMapTransform: { value: new zt() }, bumpScale: { value: 1 } }, normalmap: { normalMap: { value: null }, normalMapTransform: { value: new zt() }, normalScale: { value: new Z(1, 1) } }, displacementmap: { displacementMap: { value: null }, displacementMapTransform: { value: new zt() }, displacementScale: { value: 1 }, displacementBias: { value: 0 } }, emissivemap: { emissiveMap: { value: null }, emissiveMapTransform: { value: new zt() } }, metalnessmap: { metalnessMap: { value: null }, metalnessMapTransform: { value: new zt() } }, roughnessmap: { roughnessMap: { value: null }, roughnessMapTransform: { value: new zt() } }, gradientmap: { gradientMap: { value: null } }, fog: { fogDensity: { value: 25e-5 }, fogNear: { value: 1 }, fogFar: { value: 2e3 }, fogColor: { value: new ft(16777215) } }, lights: { ambientLightColor: { value: [] }, lightProbe: { value: [] }, directionalLights: { value: [], properties: { direction: {}, color: {} } }, directionalLightShadows: { value: [], properties: { shadowIntensity: 1, shadowBias: {}, shadowNormalBias: {}, shadowRadius: {}, shadowMapSize: {} } }, directionalShadowMap: { value: [] }, directionalShadowMatrix: { value: [] }, spotLights: { value: [], properties: { color: {}, position: {}, direction: {}, distance: {}, coneCos: {}, penumbraCos: {}, decay: {} } }, spotLightShadows: { value: [], properties: { shadowIntensity: 1, shadowBias: {}, shadowNormalBias: {}, shadowRadius: {}, shadowMapSize: {} } }, spotLightMap: { value: [] }, spotShadowMap: { value: [] }, spotLightMatrix: { value: [] }, pointLights: { value: [], properties: { color: {}, position: {}, decay: {}, distance: {} } }, pointLightShadows: { value: [], properties: { shadowIntensity: 1, shadowBias: {}, shadowNormalBias: {}, shadowRadius: {}, shadowMapSize: {}, shadowCameraNear: {}, shadowCameraFar: {} } }, pointShadowMap: { value: [] }, pointShadowMatrix: { value: [] }, hemisphereLights: { value: [], properties: { direction: {}, skyColor: {}, groundColor: {} } }, rectAreaLights: { value: [], properties: { color: {}, position: {}, width: {}, height: {} } }, ltc_1: { value: null }, ltc_2: { value: null } }, points: { diffuse: { value: new ft(16777215) }, opacity: { value: 1 }, size: { value: 1 }, scale: { value: 1 }, map: { value: null }, alphaMap: { value: null }, alphaMapTransform: { value: new zt() }, alphaTest: { value: 0 }, uvTransform: { value: new zt() } }, sprite: { diffuse: { value: new ft(16777215) }, opacity: { value: 1 }, center: { value: new Z(0.5, 0.5) }, rotation: { value: 0 }, map: { value: null }, mapTransform: { value: new zt() }, alphaMap: { value: null }, alphaMapTransform: { value: new zt() }, alphaTest: { value: 0 } } }, sn = { basic: { uniforms: Pe([ot.common, ot.specularmap, ot.envmap, ot.aomap, ot.lightmap, ot.fog]), vertexShader: Vt.meshbasic_vert, fragmentShader: Vt.meshbasic_frag }, lambert: { uniforms: Pe([ot.common, ot.specularmap, ot.envmap, ot.aomap, ot.lightmap, ot.emissivemap, ot.bumpmap, ot.normalmap, ot.displacementmap, ot.fog, ot.lights, { emissive: { value: new ft(0) } }]), vertexShader: Vt.meshlambert_vert, fragmentShader: Vt.meshlambert_frag }, phong: { uniforms: Pe([ot.common, ot.specularmap, ot.envmap, ot.aomap, ot.lightmap, ot.emissivemap, ot.bumpmap, ot.normalmap, ot.displacementmap, ot.fog, ot.lights, { emissive: { value: new ft(0) }, specular: { value: new ft(1118481) }, shininess: { value: 30 } }]), vertexShader: Vt.meshphong_vert, fragmentShader: Vt.meshphong_frag }, standard: { uniforms: Pe([ot.common, ot.envmap, ot.aomap, ot.lightmap, ot.emissivemap, ot.bumpmap, ot.normalmap, ot.displacementmap, ot.roughnessmap, ot.metalnessmap, ot.fog, ot.lights, { emissive: { value: new ft(0) }, roughness: { value: 1 }, metalness: { value: 0 }, envMapIntensity: { value: 1 } }]), vertexShader: Vt.meshphysical_vert, fragmentShader: Vt.meshphysical_frag }, toon: { uniforms: Pe([ot.common, ot.aomap, ot.lightmap, ot.emissivemap, ot.bumpmap, ot.normalmap, ot.displacementmap, ot.gradientmap, ot.fog, ot.lights, { emissive: { value: new ft(0) } }]), vertexShader: Vt.meshtoon_vert, fragmentShader: Vt.meshtoon_frag }, matcap: { uniforms: Pe([ot.common, ot.bumpmap, ot.normalmap, ot.displacementmap, ot.fog, { matcap: { value: null } }]), vertexShader: Vt.meshmatcap_vert, fragmentShader: Vt.meshmatcap_frag }, points: { uniforms: Pe([ot.points, ot.fog]), vertexShader: Vt.points_vert, fragmentShader: Vt.points_frag }, dashed: { uniforms: Pe([ot.common, ot.fog, { scale: { value: 1 }, dashSize: { value: 1 }, totalSize: { value: 2 } }]), vertexShader: Vt.linedashed_vert, fragmentShader: Vt.linedashed_frag }, depth: { uniforms: Pe([ot.common, ot.displacementmap]), vertexShader: Vt.depth_vert, fragmentShader: Vt.depth_frag }, normal: { uniforms: Pe([ot.common, ot.bumpmap, ot.normalmap, ot.displacementmap, { opacity: { value: 1 } }]), vertexShader: Vt.meshnormal_vert, fragmentShader: Vt.meshnormal_frag }, sprite: { uniforms: Pe([ot.sprite, ot.fog]), vertexShader: Vt.sprite_vert, fragmentShader: Vt.sprite_frag }, background: { uniforms: { uvTransform: { value: new zt() }, t2D: { value: null }, backgroundIntensity: { value: 1 } }, vertexShader: Vt.background_vert, fragmentShader: Vt.background_frag }, backgroundCube: { uniforms: { envMap: { value: null }, flipEnvMap: { value: -1 }, backgroundBlurriness: { value: 0 }, backgroundIntensity: { value: 1 }, backgroundRotation: { value: new zt() } }, vertexShader: Vt.backgroundCube_vert, fragmentShader: Vt.backgroundCube_frag }, cube: { uniforms: { tCube: { value: null }, tFlip: { value: -1 }, opacity: { value: 1 } }, vertexShader: Vt.cube_vert, fragmentShader: Vt.cube_frag }, equirect: { uniforms: { tEquirect: { value: null } }, vertexShader: Vt.equirect_vert, fragmentShader: Vt.equirect_frag }, distanceRGBA: { uniforms: Pe([ot.common, ot.displacementmap, { referencePosition: { value: new C() }, nearDistance: { value: 1 }, farDistance: { value: 1e3 } }]), vertexShader: Vt.distanceRGBA_vert, fragmentShader: Vt.distanceRGBA_frag }, shadow: { uniforms: Pe([ot.lights, ot.fog, { color: { value: new ft(0) }, opacity: { value: 1 } }]), vertexShader: Vt.shadow_vert, fragmentShader: Vt.shadow_frag } };
sn.physical = { uniforms: Pe([sn.standard.uniforms, { clearcoat: { value: 0 }, clearcoatMap: { value: null }, clearcoatMapTransform: { value: new zt() }, clearcoatNormalMap: { value: null }, clearcoatNormalMapTransform: { value: new zt() }, clearcoatNormalScale: { value: new Z(1, 1) }, clearcoatRoughness: { value: 0 }, clearcoatRoughnessMap: { value: null }, clearcoatRoughnessMapTransform: { value: new zt() }, dispersion: { value: 0 }, iridescence: { value: 0 }, iridescenceMap: { value: null }, iridescenceMapTransform: { value: new zt() }, iridescenceIOR: { value: 1.3 }, iridescenceThicknessMinimum: { value: 100 }, iridescenceThicknessMaximum: { value: 400 }, iridescenceThicknessMap: { value: null }, iridescenceThicknessMapTransform: { value: new zt() }, sheen: { value: 0 }, sheenColor: { value: new ft(0) }, sheenColorMap: { value: null }, sheenColorMapTransform: { value: new zt() }, sheenRoughness: { value: 1 }, sheenRoughnessMap: { value: null }, sheenRoughnessMapTransform: { value: new zt() }, transmission: { value: 0 }, transmissionMap: { value: null }, transmissionMapTransform: { value: new zt() }, transmissionSamplerSize: { value: new Z() }, transmissionSamplerMap: { value: null }, thickness: { value: 0 }, thicknessMap: { value: null }, thicknessMapTransform: { value: new zt() }, attenuationDistance: { value: 0 }, attenuationColor: { value: new ft(0) }, specularColor: { value: new ft(1, 1, 1) }, specularColorMap: { value: null }, specularColorMapTransform: { value: new zt() }, specularIntensity: { value: 1 }, specularIntensityMap: { value: null }, specularIntensityMapTransform: { value: new zt() }, anisotropyVector: { value: new Z() }, anisotropyMap: { value: null }, anisotropyMapTransform: { value: new zt() } }]), vertexShader: Vt.meshphysical_vert, fragmentShader: Vt.meshphysical_frag };
const Br = { r: 0, b: 0, g: 0 }, si = new Ze(), e0 = new Pt();
function n0(s, t, e, n, i, r, a) {
  const o = new ft(0);
  let l = r === true ? 0 : 1, c, h, u = null, d = 0, f = null;
  function m(y) {
    let x = y.isScene === true ? y.background : null;
    return x && x.isTexture && (x = (y.backgroundBlurriness > 0 ? e : t).get(x)), x;
  }
  function _(y) {
    let x = false;
    const M = m(y);
    M === null ? p(o, l) : M && M.isColor && (p(M, 1), x = true);
    const I = s.xr.getEnvironmentBlendMode();
    I === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, a) : I === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, a), (s.autoClear || x) && (n.buffers.depth.setTest(true), n.buffers.depth.setMask(true), n.buffers.color.setMask(true), s.clear(s.autoClearColor, s.autoClearDepth, s.autoClearStencil));
  }
  function g(y, x) {
    const M = m(x);
    M && (M.isCubeTexture || M.mapping === ls) ? (h === void 0 && (h = new _e(new Ri(1, 1, 1), new an({ name: "BackgroundCubeMaterial", uniforms: as(sn.backgroundCube.uniforms), vertexShader: sn.backgroundCube.vertexShader, fragmentShader: sn.backgroundCube.fragmentShader, side: De, depthTest: false, depthWrite: false, fog: false })), h.geometry.deleteAttribute("normal"), h.geometry.deleteAttribute("uv"), h.onBeforeRender = function(I, E, A) {
      this.matrixWorld.copyPosition(A.matrixWorld);
    }, Object.defineProperty(h.material, "envMap", { get: function() {
      return this.uniforms.envMap.value;
    } }), i.update(h)), si.copy(x.backgroundRotation), si.x *= -1, si.y *= -1, si.z *= -1, M.isCubeTexture && M.isRenderTargetTexture === false && (si.y *= -1, si.z *= -1), h.material.uniforms.envMap.value = M, h.material.uniforms.flipEnvMap.value = M.isCubeTexture && M.isRenderTargetTexture === false ? -1 : 1, h.material.uniforms.backgroundBlurriness.value = x.backgroundBlurriness, h.material.uniforms.backgroundIntensity.value = x.backgroundIntensity, h.material.uniforms.backgroundRotation.value.setFromMatrix4(e0.makeRotationFromEuler(si)), h.material.toneMapped = Qt.getTransfer(M.colorSpace) !== re, (u !== M || d !== M.version || f !== s.toneMapping) && (h.material.needsUpdate = true, u = M, d = M.version, f = s.toneMapping), h.layers.enableAll(), y.unshift(h, h.geometry, h.material, 0, 0, null)) : M && M.isTexture && (c === void 0 && (c = new _e(new us(2, 2), new an({ name: "BackgroundMaterial", uniforms: as(sn.background.uniforms), vertexShader: sn.background.vertexShader, fragmentShader: sn.background.fragmentShader, side: Pn, depthTest: false, depthWrite: false, fog: false })), c.geometry.deleteAttribute("normal"), Object.defineProperty(c.material, "map", { get: function() {
      return this.uniforms.t2D.value;
    } }), i.update(c)), c.material.uniforms.t2D.value = M, c.material.uniforms.backgroundIntensity.value = x.backgroundIntensity, c.material.toneMapped = Qt.getTransfer(M.colorSpace) !== re, M.matrixAutoUpdate === true && M.updateMatrix(), c.material.uniforms.uvTransform.value.copy(M.matrix), (u !== M || d !== M.version || f !== s.toneMapping) && (c.material.needsUpdate = true, u = M, d = M.version, f = s.toneMapping), c.layers.enableAll(), y.unshift(c, c.geometry, c.material, 0, 0, null));
  }
  function p(y, x) {
    y.getRGB(Br, Td(s)), n.buffers.color.setClear(Br.r, Br.g, Br.b, x, a);
  }
  return { getClearColor: function() {
    return o;
  }, setClearColor: function(y, x = 1) {
    o.set(y), l = x, p(o, l);
  }, getClearAlpha: function() {
    return l;
  }, setClearAlpha: function(y) {
    l = y, p(o, l);
  }, render: _, addToRenderList: g };
}
function i0(s, t) {
  const e = s.getParameter(s.MAX_VERTEX_ATTRIBS), n = {}, i = d(null);
  let r = i, a = false;
  function o(v, b, k, B, H) {
    let Q = false;
    const O = u(B, k, b);
    r !== O && (r = O, c(r.object)), Q = f(v, B, k, H), Q && m(v, B, k, H), H !== null && t.update(H, s.ELEMENT_ARRAY_BUFFER), (Q || a) && (a = false, M(v, b, k, B), H !== null && s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, t.get(H).buffer));
  }
  function l() {
    return s.createVertexArray();
  }
  function c(v) {
    return s.bindVertexArray(v);
  }
  function h(v) {
    return s.deleteVertexArray(v);
  }
  function u(v, b, k) {
    const B = k.wireframe === true;
    let H = n[v.id];
    H === void 0 && (H = {}, n[v.id] = H);
    let Q = H[b.id];
    Q === void 0 && (Q = {}, H[b.id] = Q);
    let O = Q[B];
    return O === void 0 && (O = d(l()), Q[B] = O), O;
  }
  function d(v) {
    const b = [], k = [], B = [];
    for (let H = 0; H < e; H++) b[H] = 0, k[H] = 0, B[H] = 0;
    return { geometry: null, program: null, wireframe: false, newAttributes: b, enabledAttributes: k, attributeDivisors: B, object: v, attributes: {}, index: null };
  }
  function f(v, b, k, B) {
    const H = r.attributes, Q = b.attributes;
    let O = 0;
    const tt = k.getAttributes();
    for (const W in tt) if (tt[W].location >= 0) {
      const pt = H[W];
      let mt = Q[W];
      if (mt === void 0 && (W === "instanceMatrix" && v.instanceMatrix && (mt = v.instanceMatrix), W === "instanceColor" && v.instanceColor && (mt = v.instanceColor)), pt === void 0 || pt.attribute !== mt || mt && pt.data !== mt.data) return true;
      O++;
    }
    return r.attributesNum !== O || r.index !== B;
  }
  function m(v, b, k, B) {
    const H = {}, Q = b.attributes;
    let O = 0;
    const tt = k.getAttributes();
    for (const W in tt) if (tt[W].location >= 0) {
      let pt = Q[W];
      pt === void 0 && (W === "instanceMatrix" && v.instanceMatrix && (pt = v.instanceMatrix), W === "instanceColor" && v.instanceColor && (pt = v.instanceColor));
      const mt = {};
      mt.attribute = pt, pt && pt.data && (mt.data = pt.data), H[W] = mt, O++;
    }
    r.attributes = H, r.attributesNum = O, r.index = B;
  }
  function _() {
    const v = r.newAttributes;
    for (let b = 0, k = v.length; b < k; b++) v[b] = 0;
  }
  function g(v) {
    p(v, 0);
  }
  function p(v, b) {
    const k = r.newAttributes, B = r.enabledAttributes, H = r.attributeDivisors;
    k[v] = 1, B[v] === 0 && (s.enableVertexAttribArray(v), B[v] = 1), H[v] !== b && (s.vertexAttribDivisor(v, b), H[v] = b);
  }
  function y() {
    const v = r.newAttributes, b = r.enabledAttributes;
    for (let k = 0, B = b.length; k < B; k++) b[k] !== v[k] && (s.disableVertexAttribArray(k), b[k] = 0);
  }
  function x(v, b, k, B, H, Q, O) {
    O === true ? s.vertexAttribIPointer(v, b, k, H, Q) : s.vertexAttribPointer(v, b, k, B, H, Q);
  }
  function M(v, b, k, B) {
    _();
    const H = B.attributes, Q = k.getAttributes(), O = b.defaultAttributeValues;
    for (const tt in Q) {
      const W = Q[tt];
      if (W.location >= 0) {
        let ht = H[tt];
        if (ht === void 0 && (tt === "instanceMatrix" && v.instanceMatrix && (ht = v.instanceMatrix), tt === "instanceColor" && v.instanceColor && (ht = v.instanceColor)), ht !== void 0) {
          const pt = ht.normalized, mt = ht.itemSize, Wt = t.get(ht);
          if (Wt === void 0) continue;
          const Kt = Wt.buffer, X = Wt.type, et = Wt.bytesPerElement, Mt = X === s.INT || X === s.UNSIGNED_INT || ht.gpuType === ro;
          if (ht.isInterleavedBufferAttribute) {
            const ct = ht.data, Lt = ct.stride, It = ht.offset;
            if (ct.isInstancedInterleavedBuffer) {
              for (let Ot = 0; Ot < W.locationSize; Ot++) p(W.location + Ot, ct.meshPerAttribute);
              v.isInstancedMesh !== true && B._maxInstanceCount === void 0 && (B._maxInstanceCount = ct.meshPerAttribute * ct.count);
            } else for (let Ot = 0; Ot < W.locationSize; Ot++) g(W.location + Ot);
            s.bindBuffer(s.ARRAY_BUFFER, Kt);
            for (let Ot = 0; Ot < W.locationSize; Ot++) x(W.location + Ot, mt / W.locationSize, X, pt, Lt * et, (It + mt / W.locationSize * Ot) * et, Mt);
          } else {
            if (ht.isInstancedBufferAttribute) {
              for (let ct = 0; ct < W.locationSize; ct++) p(W.location + ct, ht.meshPerAttribute);
              v.isInstancedMesh !== true && B._maxInstanceCount === void 0 && (B._maxInstanceCount = ht.meshPerAttribute * ht.count);
            } else for (let ct = 0; ct < W.locationSize; ct++) g(W.location + ct);
            s.bindBuffer(s.ARRAY_BUFFER, Kt);
            for (let ct = 0; ct < W.locationSize; ct++) x(W.location + ct, mt / W.locationSize, X, pt, mt * et, mt / W.locationSize * ct * et, Mt);
          }
        } else if (O !== void 0) {
          const pt = O[tt];
          if (pt !== void 0) switch (pt.length) {
            case 2:
              s.vertexAttrib2fv(W.location, pt);
              break;
            case 3:
              s.vertexAttrib3fv(W.location, pt);
              break;
            case 4:
              s.vertexAttrib4fv(W.location, pt);
              break;
            default:
              s.vertexAttrib1fv(W.location, pt);
          }
        }
      }
    }
    y();
  }
  function I() {
    P();
    for (const v in n) {
      const b = n[v];
      for (const k in b) {
        const B = b[k];
        for (const H in B) h(B[H].object), delete B[H];
        delete b[k];
      }
      delete n[v];
    }
  }
  function E(v) {
    if (n[v.id] === void 0) return;
    const b = n[v.id];
    for (const k in b) {
      const B = b[k];
      for (const H in B) h(B[H].object), delete B[H];
      delete b[k];
    }
    delete n[v.id];
  }
  function A(v) {
    for (const b in n) {
      const k = n[b];
      if (k[v.id] === void 0) continue;
      const B = k[v.id];
      for (const H in B) h(B[H].object), delete B[H];
      delete k[v.id];
    }
  }
  function P() {
    V(), a = true, r !== i && (r = i, c(r.object));
  }
  function V() {
    i.geometry = null, i.program = null, i.wireframe = false;
  }
  return { setup: o, reset: P, resetDefaultState: V, dispose: I, releaseStatesOfGeometry: E, releaseStatesOfProgram: A, initAttributes: _, enableAttribute: g, disableUnusedAttributes: y };
}
function s0(s, t, e) {
  let n;
  function i(c) {
    n = c;
  }
  function r(c, h) {
    s.drawArrays(n, c, h), e.update(h, n, 1);
  }
  function a(c, h, u) {
    u !== 0 && (s.drawArraysInstanced(n, c, h, u), e.update(h, n, u));
  }
  function o(c, h, u) {
    if (u === 0) return;
    t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n, c, 0, h, 0, u);
    let f = 0;
    for (let m = 0; m < u; m++) f += h[m];
    e.update(f, n, 1);
  }
  function l(c, h, u, d) {
    if (u === 0) return;
    const f = t.get("WEBGL_multi_draw");
    if (f === null) for (let m = 0; m < c.length; m++) a(c[m], h[m], d[m]);
    else {
      f.multiDrawArraysInstancedWEBGL(n, c, 0, h, 0, d, 0, u);
      let m = 0;
      for (let _ = 0; _ < u; _++) m += h[_];
      for (let _ = 0; _ < d.length; _++) e.update(m, n, d[_]);
    }
  }
  this.setMode = i, this.render = r, this.renderInstances = a, this.renderMultiDraw = o, this.renderMultiDrawInstances = l;
}
function r0(s, t, e, n) {
  let i;
  function r() {
    if (i !== void 0) return i;
    if (t.has("EXT_texture_filter_anisotropic") === true) {
      const A = t.get("EXT_texture_filter_anisotropic");
      i = s.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else i = 0;
    return i;
  }
  function a(A) {
    return !(A !== Le && n.convert(A) !== s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT));
  }
  function o(A) {
    const P = A === cs && (t.has("EXT_color_buffer_half_float") || t.has("EXT_color_buffer_float"));
    return !(A !== mn && n.convert(A) !== s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE) && A !== ke && !P);
  }
  function l(A) {
    if (A === "highp") {
      if (s.getShaderPrecisionFormat(s.VERTEX_SHADER, s.HIGH_FLOAT).precision > 0 && s.getShaderPrecisionFormat(s.FRAGMENT_SHADER, s.HIGH_FLOAT).precision > 0) return "highp";
      A = "mediump";
    }
    return A === "mediump" && s.getShaderPrecisionFormat(s.VERTEX_SHADER, s.MEDIUM_FLOAT).precision > 0 && s.getShaderPrecisionFormat(s.FRAGMENT_SHADER, s.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
  }
  let c = e.precision !== void 0 ? e.precision : "highp";
  const h = l(c);
  h !== c && (console.warn("THREE.WebGLRenderer:", c, "not supported, using", h, "instead."), c = h);
  const u = e.logarithmicDepthBuffer === true, d = e.reverseDepthBuffer === true && t.has("EXT_clip_control");
  if (d === true) {
    const A = t.get("EXT_clip_control");
    A.clipControlEXT(A.LOWER_LEFT_EXT, A.ZERO_TO_ONE_EXT);
  }
  const f = s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS), m = s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS), _ = s.getParameter(s.MAX_TEXTURE_SIZE), g = s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE), p = s.getParameter(s.MAX_VERTEX_ATTRIBS), y = s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS), x = s.getParameter(s.MAX_VARYING_VECTORS), M = s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS), I = m > 0, E = s.getParameter(s.MAX_SAMPLES);
  return { isWebGL2: true, getMaxAnisotropy: r, getMaxPrecision: l, textureFormatReadable: a, textureTypeReadable: o, precision: c, logarithmicDepthBuffer: u, reverseDepthBuffer: d, maxTextures: f, maxVertexTextures: m, maxTextureSize: _, maxCubemapSize: g, maxAttributes: p, maxVertexUniforms: y, maxVaryings: x, maxFragmentUniforms: M, vertexTextures: I, maxSamples: E };
}
function a0(s) {
  const t = this;
  let e = null, n = 0, i = false, r = false;
  const a = new Wn(), o = new zt(), l = { value: null, needsUpdate: false };
  this.uniform = l, this.numPlanes = 0, this.numIntersection = 0, this.init = function(u, d) {
    const f = u.length !== 0 || d || n !== 0 || i;
    return i = d, n = u.length, f;
  }, this.beginShadows = function() {
    r = true, h(null);
  }, this.endShadows = function() {
    r = false;
  }, this.setGlobalState = function(u, d) {
    e = h(u, d, 0);
  }, this.setState = function(u, d, f) {
    const m = u.clippingPlanes, _ = u.clipIntersection, g = u.clipShadows, p = s.get(u);
    if (!i || m === null || m.length === 0 || r && !g) r ? h(null) : c();
    else {
      const y = r ? 0 : n, x = y * 4;
      let M = p.clippingState || null;
      l.value = M, M = h(m, d, x, f);
      for (let I = 0; I !== x; ++I) M[I] = e[I];
      p.clippingState = M, this.numIntersection = _ ? this.numPlanes : 0, this.numPlanes += y;
    }
  };
  function c() {
    l.value !== e && (l.value = e, l.needsUpdate = n > 0), t.numPlanes = n, t.numIntersection = 0;
  }
  function h(u, d, f, m) {
    const _ = u !== null ? u.length : 0;
    let g = null;
    if (_ !== 0) {
      if (g = l.value, m !== true || g === null) {
        const p = f + _ * 4, y = d.matrixWorldInverse;
        o.getNormalMatrix(y), (g === null || g.length < p) && (g = new Float32Array(p));
        for (let x = 0, M = f; x !== _; ++x, M += 4) a.copy(u[x]).applyMatrix4(y, o), a.normal.toArray(g, M), g[M + 3] = a.constant;
      }
      l.value = g, l.needsUpdate = true;
    }
    return t.numPlanes = _, t.numIntersection = 0, g;
  }
}
function o0(s) {
  let t = /* @__PURE__ */ new WeakMap();
  function e(a, o) {
    return o === Vs ? a.mapping = In : o === Hs && (a.mapping = Yn), a;
  }
  function n(a) {
    if (a && a.isTexture) {
      const o = a.mapping;
      if (o === Vs || o === Hs) if (t.has(a)) {
        const l = t.get(a).texture;
        return e(l, a.mapping);
      } else {
        const l = a.image;
        if (l && l.height > 0) {
          const c = new Pd(l.height);
          return c.fromEquirectangularTexture(s, a), t.set(a, c), a.addEventListener("dispose", i), e(c.texture, a.mapping);
        } else return null;
      }
    }
    return a;
  }
  function i(a) {
    const o = a.target;
    o.removeEventListener("dispose", i);
    const l = t.get(o);
    l !== void 0 && (t.delete(o), l.dispose());
  }
  function r() {
    t = /* @__PURE__ */ new WeakMap();
  }
  return { get: n, dispose: r };
}
class _o extends go {
  constructor(t = -1, e = 1, n = 1, i = -1, r = 0.1, a = 2e3) {
    super(), this.isOrthographicCamera = true, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = t, this.right = e, this.top = n, this.bottom = i, this.near = r, this.far = a, this.updateProjectionMatrix();
  }
  copy(t, e) {
    return super.copy(t, e), this.left = t.left, this.right = t.right, this.top = t.top, this.bottom = t.bottom, this.near = t.near, this.far = t.far, this.zoom = t.zoom, this.view = t.view === null ? null : Object.assign({}, t.view), this;
  }
  setViewOffset(t, e, n, i, r, a) {
    this.view === null && (this.view = { enabled: true, fullWidth: 1, fullHeight: 1, offsetX: 0, offsetY: 0, width: 1, height: 1 }), this.view.enabled = true, this.view.fullWidth = t, this.view.fullHeight = e, this.view.offsetX = n, this.view.offsetY = i, this.view.width = r, this.view.height = a, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = false), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const t = (this.right - this.left) / (2 * this.zoom), e = (this.top - this.bottom) / (2 * this.zoom), n = (this.right + this.left) / 2, i = (this.top + this.bottom) / 2;
    let r = n - t, a = n + t, o = i + e, l = i - e;
    if (this.view !== null && this.view.enabled) {
      const c = (this.right - this.left) / this.view.fullWidth / this.zoom, h = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      r += c * this.view.offsetX, a = r + c * this.view.width, o -= h * this.view.offsetY, l = o - h * this.view.height;
    }
    this.projectionMatrix.makeOrthographic(r, a, o, l, this.near, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.zoom = this.zoom, e.object.left = this.left, e.object.right = this.right, e.object.top = this.top, e.object.bottom = this.bottom, e.object.near = this.near, e.object.far = this.far, this.view !== null && (e.object.view = Object.assign({}, this.view)), e;
  }
}
const ji = 4, hh = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582], pi = 20, hl = new _o(), uh = new ft();
let ul = null, dl = 0, fl = 0, pl = false;
const fi = (1 + Math.sqrt(5)) / 2, Xi = 1 / fi, dh = [new C(-fi, Xi, 0), new C(fi, Xi, 0), new C(-Xi, 0, fi), new C(Xi, 0, fi), new C(0, fi, -Xi), new C(0, fi, Xi), new C(-1, 1, -1), new C(1, 1, -1), new C(-1, 1, 1), new C(1, 1, 1)];
class kl {
  constructor(t) {
    this._renderer = t, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial);
  }
  fromScene(t, e = 0, n = 0.1, i = 100) {
    ul = this._renderer.getRenderTarget(), dl = this._renderer.getActiveCubeFace(), fl = this._renderer.getActiveMipmapLevel(), pl = this._renderer.xr.enabled, this._renderer.xr.enabled = false, this._setSize(256);
    const r = this._allocateTargets();
    return r.depthBuffer = true, this._sceneToCubeUV(t, n, i, r), e > 0 && this._blur(r, 0, 0, e), this._applyPMREM(r), this._cleanup(r), r;
  }
  fromEquirectangular(t, e = null) {
    return this._fromTexture(t, e);
  }
  fromCubemap(t, e = null) {
    return this._fromTexture(t, e);
  }
  compileCubemapShader() {
    this._cubemapMaterial === null && (this._cubemapMaterial = mh(), this._compileMaterial(this._cubemapMaterial));
  }
  compileEquirectangularShader() {
    this._equirectMaterial === null && (this._equirectMaterial = ph(), this._compileMaterial(this._equirectMaterial));
  }
  dispose() {
    this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose();
  }
  _setSize(t) {
    this._lodMax = Math.floor(Math.log2(t)), this._cubeSize = Math.pow(2, this._lodMax);
  }
  _dispose() {
    this._blurMaterial !== null && this._blurMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
    for (let t = 0; t < this._lodPlanes.length; t++) this._lodPlanes[t].dispose();
  }
  _cleanup(t) {
    this._renderer.setRenderTarget(ul, dl, fl), this._renderer.xr.enabled = pl, t.scissorTest = false, zr(t, 0, 0, t.width, t.height);
  }
  _fromTexture(t, e) {
    t.mapping === In || t.mapping === Yn ? this._setSize(t.image.length === 0 ? 16 : t.image[0].width || t.image[0].image.width) : this._setSize(t.image.width / 4), ul = this._renderer.getRenderTarget(), dl = this._renderer.getActiveCubeFace(), fl = this._renderer.getActiveMipmapLevel(), pl = this._renderer.xr.enabled, this._renderer.xr.enabled = false;
    const n = e || this._allocateTargets();
    return this._textureToCubeUV(t, n), this._applyPMREM(n), this._cleanup(n), n;
  }
  _allocateTargets() {
    const t = 3 * Math.max(this._cubeSize, 112), e = 4 * this._cubeSize, n = { magFilter: ge, minFilter: ge, generateMipmaps: false, type: cs, format: Le, colorSpace: Un, depthBuffer: false }, i = fh(t, e, n);
    if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== t || this._pingPongRenderTarget.height !== e) {
      this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = fh(t, e, n);
      const { _lodMax: r } = this;
      ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = l0(r)), this._blurMaterial = c0(r, t, e);
    }
    return i;
  }
  _compileMaterial(t) {
    const e = new _e(this._lodPlanes[0], t);
    this._renderer.compile(e, hl);
  }
  _sceneToCubeUV(t, e, n, i) {
    const o = new be(90, 1, e, n), l = [1, -1, 1, 1, 1, 1], c = [1, 1, 1, -1, -1, -1], h = this._renderer, u = h.autoClear, d = h.toneMapping;
    h.getClearColor(uh), h.toneMapping = Rn, h.autoClear = false;
    const f = new $n({ name: "PMREM.Background", side: De, depthWrite: false, depthTest: false }), m = new _e(new Ri(), f);
    let _ = false;
    const g = t.background;
    g ? g.isColor && (f.color.copy(g), t.background = null, _ = true) : (f.color.copy(uh), _ = true);
    for (let p = 0; p < 6; p++) {
      const y = p % 3;
      y === 0 ? (o.up.set(0, l[p], 0), o.lookAt(c[p], 0, 0)) : y === 1 ? (o.up.set(0, 0, l[p]), o.lookAt(0, c[p], 0)) : (o.up.set(0, l[p], 0), o.lookAt(0, 0, c[p]));
      const x = this._cubeSize;
      zr(i, y * x, p > 2 ? x : 0, x, x), h.setRenderTarget(i), _ && h.render(m, o), h.render(t, o);
    }
    m.geometry.dispose(), m.material.dispose(), h.toneMapping = d, h.autoClear = u, t.background = g;
  }
  _textureToCubeUV(t, e) {
    const n = this._renderer, i = t.mapping === In || t.mapping === Yn;
    i ? (this._cubemapMaterial === null && (this._cubemapMaterial = mh()), this._cubemapMaterial.uniforms.flipEnvMap.value = t.isRenderTargetTexture === false ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = ph());
    const r = i ? this._cubemapMaterial : this._equirectMaterial, a = new _e(this._lodPlanes[0], r), o = r.uniforms;
    o.envMap.value = t;
    const l = this._cubeSize;
    zr(e, 0, 0, 3 * l, 2 * l), n.setRenderTarget(e), n.render(a, hl);
  }
  _applyPMREM(t) {
    const e = this._renderer, n = e.autoClear;
    e.autoClear = false;
    const i = this._lodPlanes.length;
    for (let r = 1; r < i; r++) {
      const a = Math.sqrt(this._sigmas[r] * this._sigmas[r] - this._sigmas[r - 1] * this._sigmas[r - 1]), o = dh[(i - r - 1) % dh.length];
      this._blur(t, r - 1, r, a, o);
    }
    e.autoClear = n;
  }
  _blur(t, e, n, i, r) {
    const a = this._pingPongRenderTarget;
    this._halfBlur(t, a, e, n, i, "latitudinal", r), this._halfBlur(a, t, n, n, i, "longitudinal", r);
  }
  _halfBlur(t, e, n, i, r, a, o) {
    const l = this._renderer, c = this._blurMaterial;
    a !== "latitudinal" && a !== "longitudinal" && console.error("blur direction must be either latitudinal or longitudinal!");
    const h = 3, u = new _e(this._lodPlanes[i], c), d = c.uniforms, f = this._sizeLods[n] - 1, m = isFinite(r) ? Math.PI / (2 * f) : 2 * Math.PI / (2 * pi - 1), _ = r / m, g = isFinite(r) ? 1 + Math.floor(h * _) : pi;
    g > pi && console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${pi}`);
    const p = [];
    let y = 0;
    for (let A = 0; A < pi; ++A) {
      const P = A / _, V = Math.exp(-P * P / 2);
      p.push(V), A === 0 ? y += V : A < g && (y += 2 * V);
    }
    for (let A = 0; A < p.length; A++) p[A] = p[A] / y;
    d.envMap.value = t.texture, d.samples.value = g, d.weights.value = p, d.latitudinal.value = a === "latitudinal", o && (d.poleAxis.value = o);
    const { _lodMax: x } = this;
    d.dTheta.value = m, d.mipInt.value = x - n;
    const M = this._sizeLods[i], I = 3 * M * (i > x - ji ? i - x + ji : 0), E = 4 * (this._cubeSize - M);
    zr(e, I, E, 3 * M, 2 * M), l.setRenderTarget(e), l.render(u, hl);
  }
}
function l0(s) {
  const t = [], e = [], n = [];
  let i = s;
  const r = s - ji + 1 + hh.length;
  for (let a = 0; a < r; a++) {
    const o = Math.pow(2, i);
    e.push(o);
    let l = 1 / o;
    a > s - ji ? l = hh[a - s + ji - 1] : a === 0 && (l = 0), n.push(l);
    const c = 1 / (o - 2), h = -c, u = 1 + c, d = [h, h, u, h, u, u, h, h, u, u, h, u], f = 6, m = 6, _ = 3, g = 2, p = 1, y = new Float32Array(_ * m * f), x = new Float32Array(g * m * f), M = new Float32Array(p * m * f);
    for (let E = 0; E < f; E++) {
      const A = E % 3 * 2 / 3 - 1, P = E > 2 ? 0 : -1, V = [A, P, 0, A + 2 / 3, P, 0, A + 2 / 3, P + 1, 0, A, P, 0, A + 2 / 3, P + 1, 0, A, P + 1, 0];
      y.set(V, _ * m * E), x.set(d, g * m * E);
      const v = [E, E, E, E, E, E];
      M.set(v, p * m * E);
    }
    const I = new Ht();
    I.setAttribute("position", new ie(y, _)), I.setAttribute("uv", new ie(x, g)), I.setAttribute("faceIndex", new ie(M, p)), t.push(I), i > ji && i--;
  }
  return { lodPlanes: t, sizeLods: e, sigmas: n };
}
function fh(s, t, e) {
  const n = new rn(s, t, e);
  return n.texture.mapping = ls, n.texture.name = "PMREM.cubeUv", n.scissorTest = true, n;
}
function zr(s, t, e, n, i) {
  s.viewport.set(t, e, n, i), s.scissor.set(t, e, n, i);
}
function c0(s, t, e) {
  const n = new Float32Array(pi), i = new C(0, 1, 0);
  return new an({ name: "SphericalGaussianBlur", defines: { n: pi, CUBEUV_TEXEL_WIDTH: 1 / t, CUBEUV_TEXEL_HEIGHT: 1 / e, CUBEUV_MAX_MIP: `${s}.0` }, uniforms: { envMap: { value: null }, samples: { value: 1 }, weights: { value: n }, latitudinal: { value: false }, dTheta: { value: 0 }, mipInt: { value: 0 }, poleAxis: { value: i } }, vertexShader: fc(), fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`, blending: Cn, depthTest: false, depthWrite: false });
}
function ph() {
  return new an({ name: "EquirectangularToCubeUV", uniforms: { envMap: { value: null } }, vertexShader: fc(), fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`, blending: Cn, depthTest: false, depthWrite: false });
}
function mh() {
  return new an({ name: "CubemapToCubeUV", uniforms: { envMap: { value: null }, flipEnvMap: { value: -1 } }, vertexShader: fc(), fragmentShader: `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`, blending: Cn, depthTest: false, depthWrite: false });
}
function fc() {
  return `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`;
}
function h0(s) {
  let t = /* @__PURE__ */ new WeakMap(), e = null;
  function n(o) {
    if (o && o.isTexture) {
      const l = o.mapping, c = l === Vs || l === Hs, h = l === In || l === Yn;
      if (c || h) {
        let u = t.get(o);
        const d = u !== void 0 ? u.texture.pmremVersion : 0;
        if (o.isRenderTargetTexture && o.pmremVersion !== d) return e === null && (e = new kl(s)), u = c ? e.fromEquirectangular(o, u) : e.fromCubemap(o, u), u.texture.pmremVersion = o.pmremVersion, t.set(o, u), u.texture;
        if (u !== void 0) return u.texture;
        {
          const f = o.image;
          return c && f && f.height > 0 || h && f && i(f) ? (e === null && (e = new kl(s)), u = c ? e.fromEquirectangular(o) : e.fromCubemap(o), u.texture.pmremVersion = o.pmremVersion, t.set(o, u), o.addEventListener("dispose", r), u.texture) : null;
        }
      }
    }
    return o;
  }
  function i(o) {
    let l = 0;
    const c = 6;
    for (let h = 0; h < c; h++) o[h] !== void 0 && l++;
    return l === c;
  }
  function r(o) {
    const l = o.target;
    l.removeEventListener("dispose", r);
    const c = t.get(l);
    c !== void 0 && (t.delete(l), c.dispose());
  }
  function a() {
    t = /* @__PURE__ */ new WeakMap(), e !== null && (e.dispose(), e = null);
  }
  return { get: n, dispose: a };
}
function u0(s) {
  const t = {};
  function e(n) {
    if (t[n] !== void 0) return t[n];
    let i;
    switch (n) {
      case "WEBGL_depth_texture":
        i = s.getExtension("WEBGL_depth_texture") || s.getExtension("MOZ_WEBGL_depth_texture") || s.getExtension("WEBKIT_WEBGL_depth_texture");
        break;
      case "EXT_texture_filter_anisotropic":
        i = s.getExtension("EXT_texture_filter_anisotropic") || s.getExtension("MOZ_EXT_texture_filter_anisotropic") || s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        break;
      case "WEBGL_compressed_texture_s3tc":
        i = s.getExtension("WEBGL_compressed_texture_s3tc") || s.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
        break;
      case "WEBGL_compressed_texture_pvrtc":
        i = s.getExtension("WEBGL_compressed_texture_pvrtc") || s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
        break;
      default:
        i = s.getExtension(n);
    }
    return t[n] = i, i;
  }
  return { has: function(n) {
    return e(n) !== null;
  }, init: function() {
    e("EXT_color_buffer_float"), e("WEBGL_clip_cull_distance"), e("OES_texture_float_linear"), e("EXT_color_buffer_half_float"), e("WEBGL_multisampled_render_to_texture"), e("WEBGL_render_shared_exponent");
  }, get: function(n) {
    const i = e(n);
    return i === null && fa("THREE.WebGLRenderer: " + n + " extension not supported."), i;
  } };
}
function d0(s, t, e, n) {
  const i = {}, r = /* @__PURE__ */ new WeakMap();
  function a(u) {
    const d = u.target;
    d.index !== null && t.remove(d.index);
    for (const m in d.attributes) t.remove(d.attributes[m]);
    for (const m in d.morphAttributes) {
      const _ = d.morphAttributes[m];
      for (let g = 0, p = _.length; g < p; g++) t.remove(_[g]);
    }
    d.removeEventListener("dispose", a), delete i[d.id];
    const f = r.get(d);
    f && (t.remove(f), r.delete(d)), n.releaseStatesOfGeometry(d), d.isInstancedBufferGeometry === true && delete d._maxInstanceCount, e.memory.geometries--;
  }
  function o(u, d) {
    return i[d.id] === true || (d.addEventListener("dispose", a), i[d.id] = true, e.memory.geometries++), d;
  }
  function l(u) {
    const d = u.attributes;
    for (const m in d) t.update(d[m], s.ARRAY_BUFFER);
    const f = u.morphAttributes;
    for (const m in f) {
      const _ = f[m];
      for (let g = 0, p = _.length; g < p; g++) t.update(_[g], s.ARRAY_BUFFER);
    }
  }
  function c(u) {
    const d = [], f = u.index, m = u.attributes.position;
    let _ = 0;
    if (f !== null) {
      const y = f.array;
      _ = f.version;
      for (let x = 0, M = y.length; x < M; x += 3) {
        const I = y[x + 0], E = y[x + 1], A = y[x + 2];
        d.push(I, E, E, A, A, I);
      }
    } else if (m !== void 0) {
      const y = m.array;
      _ = m.version;
      for (let x = 0, M = y.length / 3 - 1; x < M; x += 3) {
        const I = x + 0, E = x + 1, A = x + 2;
        d.push(I, E, E, A, A, I);
      }
    } else return;
    const g = new (Sd(d) ? dc : uc)(d, 1);
    g.version = _;
    const p = r.get(u);
    p && t.remove(p), r.set(u, g);
  }
  function h(u) {
    const d = r.get(u);
    if (d) {
      const f = u.index;
      f !== null && d.version < f.version && c(u);
    } else c(u);
    return r.get(u);
  }
  return { get: o, update: l, getWireframeAttribute: h };
}
function f0(s, t, e) {
  let n;
  function i(d) {
    n = d;
  }
  let r, a;
  function o(d) {
    r = d.type, a = d.bytesPerElement;
  }
  function l(d, f) {
    s.drawElements(n, f, r, d * a), e.update(f, n, 1);
  }
  function c(d, f, m) {
    m !== 0 && (s.drawElementsInstanced(n, f, r, d * a, m), e.update(f, n, m));
  }
  function h(d, f, m) {
    if (m === 0) return;
    t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, f, 0, r, d, 0, m);
    let g = 0;
    for (let p = 0; p < m; p++) g += f[p];
    e.update(g, n, 1);
  }
  function u(d, f, m, _) {
    if (m === 0) return;
    const g = t.get("WEBGL_multi_draw");
    if (g === null) for (let p = 0; p < d.length; p++) c(d[p] / a, f[p], _[p]);
    else {
      g.multiDrawElementsInstancedWEBGL(n, f, 0, r, d, 0, _, 0, m);
      let p = 0;
      for (let y = 0; y < m; y++) p += f[y];
      for (let y = 0; y < _.length; y++) e.update(p, n, _[y]);
    }
  }
  this.setMode = i, this.setIndex = o, this.render = l, this.renderInstances = c, this.renderMultiDraw = h, this.renderMultiDrawInstances = u;
}
function p0(s) {
  const t = { geometries: 0, textures: 0 }, e = { frame: 0, calls: 0, triangles: 0, points: 0, lines: 0 };
  function n(r, a, o) {
    switch (e.calls++, a) {
      case s.TRIANGLES:
        e.triangles += o * (r / 3);
        break;
      case s.LINES:
        e.lines += o * (r / 2);
        break;
      case s.LINE_STRIP:
        e.lines += o * (r - 1);
        break;
      case s.LINE_LOOP:
        e.lines += o * r;
        break;
      case s.POINTS:
        e.points += o * r;
        break;
      default:
        console.error("THREE.WebGLInfo: Unknown draw mode:", a);
        break;
    }
  }
  function i() {
    e.calls = 0, e.triangles = 0, e.points = 0, e.lines = 0;
  }
  return { memory: t, render: e, programs: null, autoReset: true, reset: i, update: n };
}
function m0(s, t, e) {
  const n = /* @__PURE__ */ new WeakMap(), i = new Jt();
  function r(a, o, l) {
    const c = a.morphTargetInfluences, h = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color, u = h !== void 0 ? h.length : 0;
    let d = n.get(o);
    if (d === void 0 || d.count !== u) {
      let V = function() {
        A.dispose(), n.delete(o), o.removeEventListener("dispose", V);
      };
      d !== void 0 && d.texture.dispose();
      const f = o.morphAttributes.position !== void 0, m = o.morphAttributes.normal !== void 0, _ = o.morphAttributes.color !== void 0, g = o.morphAttributes.position || [], p = o.morphAttributes.normal || [], y = o.morphAttributes.color || [];
      let x = 0;
      f === true && (x = 1), m === true && (x = 2), _ === true && (x = 3);
      let M = o.attributes.position.count * x, I = 1;
      M > t.maxTextureSize && (I = Math.ceil(M / t.maxTextureSize), M = t.maxTextureSize);
      const E = new Float32Array(M * I * 4 * u), A = new po(E, M, I, u);
      A.type = ke, A.needsUpdate = true;
      const P = x * 4;
      for (let v = 0; v < u; v++) {
        const b = g[v], k = p[v], B = y[v], H = M * I * 4 * v;
        for (let Q = 0; Q < b.count; Q++) {
          const O = Q * P;
          f === true && (i.fromBufferAttribute(b, Q), E[H + O + 0] = i.x, E[H + O + 1] = i.y, E[H + O + 2] = i.z, E[H + O + 3] = 0), m === true && (i.fromBufferAttribute(k, Q), E[H + O + 4] = i.x, E[H + O + 5] = i.y, E[H + O + 6] = i.z, E[H + O + 7] = 0), _ === true && (i.fromBufferAttribute(B, Q), E[H + O + 8] = i.x, E[H + O + 9] = i.y, E[H + O + 10] = i.z, E[H + O + 11] = B.itemSize === 4 ? i.w : 1);
        }
      }
      d = { count: u, texture: A, size: new Z(M, I) }, n.set(o, d), o.addEventListener("dispose", V);
    }
    if (a.isInstancedMesh === true && a.morphTexture !== null) l.getUniforms().setValue(s, "morphTexture", a.morphTexture, e);
    else {
      let f = 0;
      for (let _ = 0; _ < c.length; _++) f += c[_];
      const m = o.morphTargetsRelative ? 1 : 1 - f;
      l.getUniforms().setValue(s, "morphTargetBaseInfluence", m), l.getUniforms().setValue(s, "morphTargetInfluences", c);
    }
    l.getUniforms().setValue(s, "morphTargetsTexture", d.texture, e), l.getUniforms().setValue(s, "morphTargetsTextureSize", d.size);
  }
  return { update: r };
}
function g0(s, t, e, n) {
  let i = /* @__PURE__ */ new WeakMap();
  function r(l) {
    const c = n.render.frame, h = l.geometry, u = t.get(l, h);
    if (i.get(u) !== c && (t.update(u), i.set(u, c)), l.isInstancedMesh && (l.hasEventListener("dispose", o) === false && l.addEventListener("dispose", o), i.get(l) !== c && (e.update(l.instanceMatrix, s.ARRAY_BUFFER), l.instanceColor !== null && e.update(l.instanceColor, s.ARRAY_BUFFER), i.set(l, c))), l.isSkinnedMesh) {
      const d = l.skeleton;
      i.get(d) !== c && (d.update(), i.set(d, c));
    }
    return u;
  }
  function a() {
    i = /* @__PURE__ */ new WeakMap();
  }
  function o(l) {
    const c = l.target;
    c.removeEventListener("dispose", o), e.remove(c.instanceMatrix), c.instanceColor !== null && e.remove(c.instanceColor);
  }
  return { update: r, dispose: a };
}
class pc extends ue {
  constructor(t, e, n, i, r, a, o, l, c, h = Mi) {
    if (h !== Mi && h !== Ai) throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
    n === void 0 && h === Mi && (n = Ln), n === void 0 && h === Ai && (n = Ei), super(null, i, r, a, o, l, h, n, c), this.isDepthTexture = true, this.image = { width: t, height: e }, this.magFilter = o !== void 0 ? o : Me, this.minFilter = l !== void 0 ? l : Me, this.flipY = false, this.generateMipmaps = false, this.compareFunction = null;
  }
  copy(t) {
    return super.copy(t), this.compareFunction = t.compareFunction, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return this.compareFunction !== null && (e.compareFunction = this.compareFunction), e;
  }
}
const Ld = new ue(), gh = new pc(1, 1), Dd = new po(), Ud = new hc(), Nd = new ur(), _h = [], xh = [], vh = new Float32Array(16), yh = new Float32Array(9), Mh = new Float32Array(4);
function ds(s, t, e) {
  const n = s[0];
  if (n <= 0 || n > 0) return s;
  const i = t * e;
  let r = _h[i];
  if (r === void 0 && (r = new Float32Array(i), _h[i] = r), t !== 0) {
    n.toArray(r, 0);
    for (let a = 1, o = 0; a !== t; ++a) o += e, s[a].toArray(r, o);
  }
  return r;
}
function xe(s, t) {
  if (s.length !== t.length) return false;
  for (let e = 0, n = s.length; e < n; e++) if (s[e] !== t[e]) return false;
  return true;
}
function ve(s, t) {
  for (let e = 0, n = t.length; e < n; e++) s[e] = t[e];
}
function xo(s, t) {
  let e = xh[t];
  e === void 0 && (e = new Int32Array(t), xh[t] = e);
  for (let n = 0; n !== t; ++n) e[n] = s.allocateTextureUnit();
  return e;
}
function _0(s, t) {
  const e = this.cache;
  e[0] !== t && (s.uniform1f(this.addr, t), e[0] = t);
}
function x0(s, t) {
  const e = this.cache;
  if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y) && (s.uniform2f(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (xe(e, t)) return;
    s.uniform2fv(this.addr, t), ve(e, t);
  }
}
function v0(s, t) {
  const e = this.cache;
  if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (s.uniform3f(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else if (t.r !== void 0) (e[0] !== t.r || e[1] !== t.g || e[2] !== t.b) && (s.uniform3f(this.addr, t.r, t.g, t.b), e[0] = t.r, e[1] = t.g, e[2] = t.b);
  else {
    if (xe(e, t)) return;
    s.uniform3fv(this.addr, t), ve(e, t);
  }
}
function y0(s, t) {
  const e = this.cache;
  if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (s.uniform4f(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (xe(e, t)) return;
    s.uniform4fv(this.addr, t), ve(e, t);
  }
}
function M0(s, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (xe(e, t)) return;
    s.uniformMatrix2fv(this.addr, false, t), ve(e, t);
  } else {
    if (xe(e, n)) return;
    Mh.set(n), s.uniformMatrix2fv(this.addr, false, Mh), ve(e, n);
  }
}
function S0(s, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (xe(e, t)) return;
    s.uniformMatrix3fv(this.addr, false, t), ve(e, t);
  } else {
    if (xe(e, n)) return;
    yh.set(n), s.uniformMatrix3fv(this.addr, false, yh), ve(e, n);
  }
}
function b0(s, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (xe(e, t)) return;
    s.uniformMatrix4fv(this.addr, false, t), ve(e, t);
  } else {
    if (xe(e, n)) return;
    vh.set(n), s.uniformMatrix4fv(this.addr, false, vh), ve(e, n);
  }
}
function w0(s, t) {
  const e = this.cache;
  e[0] !== t && (s.uniform1i(this.addr, t), e[0] = t);
}
function E0(s, t) {
  const e = this.cache;
  if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y) && (s.uniform2i(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (xe(e, t)) return;
    s.uniform2iv(this.addr, t), ve(e, t);
  }
}
function A0(s, t) {
  const e = this.cache;
  if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (s.uniform3i(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else {
    if (xe(e, t)) return;
    s.uniform3iv(this.addr, t), ve(e, t);
  }
}
function T0(s, t) {
  const e = this.cache;
  if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (s.uniform4i(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (xe(e, t)) return;
    s.uniform4iv(this.addr, t), ve(e, t);
  }
}
function C0(s, t) {
  const e = this.cache;
  e[0] !== t && (s.uniform1ui(this.addr, t), e[0] = t);
}
function R0(s, t) {
  const e = this.cache;
  if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y) && (s.uniform2ui(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (xe(e, t)) return;
    s.uniform2uiv(this.addr, t), ve(e, t);
  }
}
function P0(s, t) {
  const e = this.cache;
  if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (s.uniform3ui(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else {
    if (xe(e, t)) return;
    s.uniform3uiv(this.addr, t), ve(e, t);
  }
}
function I0(s, t) {
  const e = this.cache;
  if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (s.uniform4ui(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (xe(e, t)) return;
    s.uniform4uiv(this.addr, t), ve(e, t);
  }
}
function L0(s, t, e) {
  const n = this.cache, i = e.allocateTextureUnit();
  n[0] !== i && (s.uniform1i(this.addr, i), n[0] = i);
  let r;
  this.type === s.SAMPLER_2D_SHADOW ? (gh.compareFunction = lc, r = gh) : r = Ld, e.setTexture2D(t || r, i);
}
function D0(s, t, e) {
  const n = this.cache, i = e.allocateTextureUnit();
  n[0] !== i && (s.uniform1i(this.addr, i), n[0] = i), e.setTexture3D(t || Ud, i);
}
function U0(s, t, e) {
  const n = this.cache, i = e.allocateTextureUnit();
  n[0] !== i && (s.uniform1i(this.addr, i), n[0] = i), e.setTextureCube(t || Nd, i);
}
function N0(s, t, e) {
  const n = this.cache, i = e.allocateTextureUnit();
  n[0] !== i && (s.uniform1i(this.addr, i), n[0] = i), e.setTexture2DArray(t || Dd, i);
}
function F0(s) {
  switch (s) {
    case 5126:
      return _0;
    case 35664:
      return x0;
    case 35665:
      return v0;
    case 35666:
      return y0;
    case 35674:
      return M0;
    case 35675:
      return S0;
    case 35676:
      return b0;
    case 5124:
    case 35670:
      return w0;
    case 35667:
    case 35671:
      return E0;
    case 35668:
    case 35672:
      return A0;
    case 35669:
    case 35673:
      return T0;
    case 5125:
      return C0;
    case 36294:
      return R0;
    case 36295:
      return P0;
    case 36296:
      return I0;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return L0;
    case 35679:
    case 36299:
    case 36307:
      return D0;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return U0;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return N0;
  }
}
function O0(s, t) {
  s.uniform1fv(this.addr, t);
}
function B0(s, t) {
  const e = ds(t, this.size, 2);
  s.uniform2fv(this.addr, e);
}
function z0(s, t) {
  const e = ds(t, this.size, 3);
  s.uniform3fv(this.addr, e);
}
function k0(s, t) {
  const e = ds(t, this.size, 4);
  s.uniform4fv(this.addr, e);
}
function V0(s, t) {
  const e = ds(t, this.size, 4);
  s.uniformMatrix2fv(this.addr, false, e);
}
function H0(s, t) {
  const e = ds(t, this.size, 9);
  s.uniformMatrix3fv(this.addr, false, e);
}
function G0(s, t) {
  const e = ds(t, this.size, 16);
  s.uniformMatrix4fv(this.addr, false, e);
}
function W0(s, t) {
  s.uniform1iv(this.addr, t);
}
function X0(s, t) {
  s.uniform2iv(this.addr, t);
}
function q0(s, t) {
  s.uniform3iv(this.addr, t);
}
function Y0(s, t) {
  s.uniform4iv(this.addr, t);
}
function Z0(s, t) {
  s.uniform1uiv(this.addr, t);
}
function J0(s, t) {
  s.uniform2uiv(this.addr, t);
}
function $0(s, t) {
  s.uniform3uiv(this.addr, t);
}
function K0(s, t) {
  s.uniform4uiv(this.addr, t);
}
function Q0(s, t, e) {
  const n = this.cache, i = t.length, r = xo(e, i);
  xe(n, r) || (s.uniform1iv(this.addr, r), ve(n, r));
  for (let a = 0; a !== i; ++a) e.setTexture2D(t[a] || Ld, r[a]);
}
function j0(s, t, e) {
  const n = this.cache, i = t.length, r = xo(e, i);
  xe(n, r) || (s.uniform1iv(this.addr, r), ve(n, r));
  for (let a = 0; a !== i; ++a) e.setTexture3D(t[a] || Ud, r[a]);
}
function tx(s, t, e) {
  const n = this.cache, i = t.length, r = xo(e, i);
  xe(n, r) || (s.uniform1iv(this.addr, r), ve(n, r));
  for (let a = 0; a !== i; ++a) e.setTextureCube(t[a] || Nd, r[a]);
}
function ex(s, t, e) {
  const n = this.cache, i = t.length, r = xo(e, i);
  xe(n, r) || (s.uniform1iv(this.addr, r), ve(n, r));
  for (let a = 0; a !== i; ++a) e.setTexture2DArray(t[a] || Dd, r[a]);
}
function nx(s) {
  switch (s) {
    case 5126:
      return O0;
    case 35664:
      return B0;
    case 35665:
      return z0;
    case 35666:
      return k0;
    case 35674:
      return V0;
    case 35675:
      return H0;
    case 35676:
      return G0;
    case 5124:
    case 35670:
      return W0;
    case 35667:
    case 35671:
      return X0;
    case 35668:
    case 35672:
      return q0;
    case 35669:
    case 35673:
      return Y0;
    case 5125:
      return Z0;
    case 36294:
      return J0;
    case 36295:
      return $0;
    case 36296:
      return K0;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return Q0;
    case 35679:
    case 36299:
    case 36307:
      return j0;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return tx;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return ex;
  }
}
class ix {
  constructor(t, e, n) {
    this.id = t, this.addr = n, this.cache = [], this.type = e.type, this.setValue = F0(e.type);
  }
}
class sx {
  constructor(t, e, n) {
    this.id = t, this.addr = n, this.cache = [], this.type = e.type, this.size = e.size, this.setValue = nx(e.type);
  }
}
class rx {
  constructor(t) {
    this.id = t, this.seq = [], this.map = {};
  }
  setValue(t, e, n) {
    const i = this.seq;
    for (let r = 0, a = i.length; r !== a; ++r) {
      const o = i[r];
      o.setValue(t, e[o.id], n);
    }
  }
}
const ml = /(\w+)(\])?(\[|\.)?/g;
function Sh(s, t) {
  s.seq.push(t), s.map[t.id] = t;
}
function ax(s, t, e) {
  const n = s.name, i = n.length;
  for (ml.lastIndex = 0; ; ) {
    const r = ml.exec(n), a = ml.lastIndex;
    let o = r[1];
    const l = r[2] === "]", c = r[3];
    if (l && (o = o | 0), c === void 0 || c === "[" && a + 2 === i) {
      Sh(e, c === void 0 ? new ix(o, s, t) : new sx(o, s, t));
      break;
    } else {
      let u = e.map[o];
      u === void 0 && (u = new rx(o), Sh(e, u)), e = u;
    }
  }
}
class pa {
  constructor(t, e) {
    this.seq = [], this.map = {};
    const n = t.getProgramParameter(e, t.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; ++i) {
      const r = t.getActiveUniform(e, i), a = t.getUniformLocation(e, r.name);
      ax(r, a, this);
    }
  }
  setValue(t, e, n, i) {
    const r = this.map[e];
    r !== void 0 && r.setValue(t, n, i);
  }
  setOptional(t, e, n) {
    const i = e[n];
    i !== void 0 && this.setValue(t, n, i);
  }
  static upload(t, e, n, i) {
    for (let r = 0, a = e.length; r !== a; ++r) {
      const o = e[r], l = n[o.id];
      l.needsUpdate !== false && o.setValue(t, l.value, i);
    }
  }
  static seqWithValue(t, e) {
    const n = [];
    for (let i = 0, r = t.length; i !== r; ++i) {
      const a = t[i];
      a.id in e && n.push(a);
    }
    return n;
  }
}
function bh(s, t, e) {
  const n = s.createShader(t);
  return s.shaderSource(n, e), s.compileShader(n), n;
}
const ox = 37297;
let lx = 0;
function cx(s, t) {
  const e = s.split(`
`), n = [], i = Math.max(t - 6, 0), r = Math.min(t + 6, e.length);
  for (let a = i; a < r; a++) {
    const o = a + 1;
    n.push(`${o === t ? ">" : " "} ${o}: ${e[a]}`);
  }
  return n.join(`
`);
}
function hx(s) {
  const t = Qt.getPrimaries(Qt.workingColorSpace), e = Qt.getPrimaries(s);
  let n;
  switch (t === e ? n = "" : t === Js && e === Zs ? n = "LinearDisplayP3ToLinearSRGB" : t === Zs && e === Js && (n = "LinearSRGBToLinearDisplayP3"), s) {
    case Un:
    case hr:
      return [n, "LinearTransferOETF"];
    case Ke:
    case fo:
      return [n, "sRGBTransferOETF"];
    default:
      return console.warn("THREE.WebGLProgram: Unsupported color space:", s), [n, "LinearTransferOETF"];
  }
}
function wh(s, t, e) {
  const n = s.getShaderParameter(t, s.COMPILE_STATUS), i = s.getShaderInfoLog(t).trim();
  if (n && i === "") return "";
  const r = /ERROR: 0:(\d+)/.exec(i);
  if (r) {
    const a = parseInt(r[1]);
    return e.toUpperCase() + `

` + i + `

` + cx(s.getShaderSource(t), a);
  } else return i;
}
function ux(s, t) {
  const e = hx(t);
  return `vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`;
}
function dx(s, t) {
  let e;
  switch (t) {
    case ed:
      e = "Linear";
      break;
    case nd:
      e = "Reinhard";
      break;
    case id:
      e = "Cineon";
      break;
    case sd:
      e = "ACESFilmic";
      break;
    case ad:
      e = "AgX";
      break;
    case od:
      e = "Neutral";
      break;
    case rd:
      e = "Custom";
      break;
    default:
      console.warn("THREE.WebGLProgram: Unsupported toneMapping:", t), e = "Linear";
  }
  return "vec3 " + s + "( vec3 color ) { return " + e + "ToneMapping( color ); }";
}
const kr = new C();
function fx() {
  Qt.getLuminanceCoefficients(kr);
  const s = kr.x.toFixed(4), t = kr.y.toFixed(4), e = kr.z.toFixed(4);
  return ["float luminance( const in vec3 rgb ) {", `	const vec3 weights = vec3( ${s}, ${t}, ${e} );`, "	return dot( weights, rgb );", "}"].join(`
`);
}
function px(s) {
  return [s.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "", s.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""].filter(Rs).join(`
`);
}
function mx(s) {
  const t = [];
  for (const e in s) {
    const n = s[e];
    n !== false && t.push("#define " + e + " " + n);
  }
  return t.join(`
`);
}
function gx(s, t) {
  const e = {}, n = s.getProgramParameter(t, s.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < n; i++) {
    const r = s.getActiveAttrib(t, i), a = r.name;
    let o = 1;
    r.type === s.FLOAT_MAT2 && (o = 2), r.type === s.FLOAT_MAT3 && (o = 3), r.type === s.FLOAT_MAT4 && (o = 4), e[a] = { type: r.type, location: s.getAttribLocation(t, a), locationSize: o };
  }
  return e;
}
function Rs(s) {
  return s !== "";
}
function Eh(s, t) {
  const e = t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps;
  return s.replace(/NUM_DIR_LIGHTS/g, t.numDirLights).replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, e).replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, t.numPointLights).replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function Ah(s, t) {
  return s.replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, t.numClippingPlanes - t.numClipIntersection);
}
const _x = /^[ \t]*#include +<([\w\d./]+)>/gm;
function Vl(s) {
  return s.replace(_x, vx);
}
const xx = /* @__PURE__ */ new Map();
function vx(s, t) {
  let e = Vt[t];
  if (e === void 0) {
    const n = xx.get(t);
    if (n !== void 0) e = Vt[n], console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', t, n);
    else throw new Error("Can not resolve #include <" + t + ">");
  }
  return Vl(e);
}
const yx = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function Th(s) {
  return s.replace(yx, Mx);
}
function Mx(s, t, e, n) {
  let i = "";
  for (let r = parseInt(t); r < parseInt(e); r++) i += n.replace(/\[\s*i\s*\]/g, "[ " + r + " ]").replace(/UNROLLED_LOOP_INDEX/g, r);
  return i;
}
function Ch(s) {
  let t = `precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;
  return s.precision === "highp" ? t += `
#define HIGH_PRECISION` : s.precision === "mediump" ? t += `
#define MEDIUM_PRECISION` : s.precision === "lowp" && (t += `
#define LOW_PRECISION`), t;
}
function Sx(s) {
  let t = "SHADOWMAP_TYPE_BASIC";
  return s.shadowMapType === $l ? t = "SHADOWMAP_TYPE_PCF" : s.shadowMapType === Uu ? t = "SHADOWMAP_TYPE_PCF_SOFT" : s.shadowMapType === cn && (t = "SHADOWMAP_TYPE_VSM"), t;
}
function bx(s) {
  let t = "ENVMAP_TYPE_CUBE";
  if (s.envMap) switch (s.envMapMode) {
    case In:
    case Yn:
      t = "ENVMAP_TYPE_CUBE";
      break;
    case ls:
      t = "ENVMAP_TYPE_CUBE_UV";
      break;
  }
  return t;
}
function wx(s) {
  let t = "ENVMAP_MODE_REFLECTION";
  if (s.envMap) switch (s.envMapMode) {
    case Yn:
      t = "ENVMAP_MODE_REFRACTION";
      break;
  }
  return t;
}
function Ex(s) {
  let t = "ENVMAP_BLENDING_NONE";
  if (s.envMap) switch (s.combine) {
    case lr:
      t = "ENVMAP_BLENDING_MULTIPLY";
      break;
    case ju:
      t = "ENVMAP_BLENDING_MIX";
      break;
    case td:
      t = "ENVMAP_BLENDING_ADD";
      break;
  }
  return t;
}
function Ax(s) {
  const t = s.envMapCubeUVHeight;
  if (t === null) return null;
  const e = Math.log2(t) - 2, n = 1 / t;
  return { texelWidth: 1 / (3 * Math.max(Math.pow(2, e), 7 * 16)), texelHeight: n, maxMip: e };
}
function Tx(s, t, e, n) {
  const i = s.getContext(), r = e.defines;
  let a = e.vertexShader, o = e.fragmentShader;
  const l = Sx(e), c = bx(e), h = wx(e), u = Ex(e), d = Ax(e), f = px(e), m = mx(r), _ = i.createProgram();
  let g, p, y = e.glslVersion ? "#version " + e.glslVersion + `
` : "";
  e.isRawShaderMaterial ? (g = ["#define SHADER_TYPE " + e.shaderType, "#define SHADER_NAME " + e.shaderName, m].filter(Rs).join(`
`), g.length > 0 && (g += `
`), p = ["#define SHADER_TYPE " + e.shaderType, "#define SHADER_NAME " + e.shaderName, m].filter(Rs).join(`
`), p.length > 0 && (p += `
`)) : (g = [Ch(e), "#define SHADER_TYPE " + e.shaderType, "#define SHADER_NAME " + e.shaderName, m, e.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "", e.batching ? "#define USE_BATCHING" : "", e.batchingColor ? "#define USE_BATCHING_COLOR" : "", e.instancing ? "#define USE_INSTANCING" : "", e.instancingColor ? "#define USE_INSTANCING_COLOR" : "", e.instancingMorph ? "#define USE_INSTANCING_MORPH" : "", e.useFog && e.fog ? "#define USE_FOG" : "", e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "", e.map ? "#define USE_MAP" : "", e.envMap ? "#define USE_ENVMAP" : "", e.envMap ? "#define " + h : "", e.lightMap ? "#define USE_LIGHTMAP" : "", e.aoMap ? "#define USE_AOMAP" : "", e.bumpMap ? "#define USE_BUMPMAP" : "", e.normalMap ? "#define USE_NORMALMAP" : "", e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "", e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "", e.displacementMap ? "#define USE_DISPLACEMENTMAP" : "", e.emissiveMap ? "#define USE_EMISSIVEMAP" : "", e.anisotropy ? "#define USE_ANISOTROPY" : "", e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "", e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "", e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "", e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "", e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "", e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "", e.specularMap ? "#define USE_SPECULARMAP" : "", e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "", e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "", e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "", e.metalnessMap ? "#define USE_METALNESSMAP" : "", e.alphaMap ? "#define USE_ALPHAMAP" : "", e.alphaHash ? "#define USE_ALPHAHASH" : "", e.transmission ? "#define USE_TRANSMISSION" : "", e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "", e.thicknessMap ? "#define USE_THICKNESSMAP" : "", e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "", e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "", e.mapUv ? "#define MAP_UV " + e.mapUv : "", e.alphaMapUv ? "#define ALPHAMAP_UV " + e.alphaMapUv : "", e.lightMapUv ? "#define LIGHTMAP_UV " + e.lightMapUv : "", e.aoMapUv ? "#define AOMAP_UV " + e.aoMapUv : "", e.emissiveMapUv ? "#define EMISSIVEMAP_UV " + e.emissiveMapUv : "", e.bumpMapUv ? "#define BUMPMAP_UV " + e.bumpMapUv : "", e.normalMapUv ? "#define NORMALMAP_UV " + e.normalMapUv : "", e.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + e.displacementMapUv : "", e.metalnessMapUv ? "#define METALNESSMAP_UV " + e.metalnessMapUv : "", e.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + e.roughnessMapUv : "", e.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + e.anisotropyMapUv : "", e.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + e.clearcoatMapUv : "", e.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + e.clearcoatNormalMapUv : "", e.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + e.clearcoatRoughnessMapUv : "", e.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + e.iridescenceMapUv : "", e.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + e.iridescenceThicknessMapUv : "", e.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + e.sheenColorMapUv : "", e.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + e.sheenRoughnessMapUv : "", e.specularMapUv ? "#define SPECULARMAP_UV " + e.specularMapUv : "", e.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + e.specularColorMapUv : "", e.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + e.specularIntensityMapUv : "", e.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + e.transmissionMapUv : "", e.thicknessMapUv ? "#define THICKNESSMAP_UV " + e.thicknessMapUv : "", e.vertexTangents && e.flatShading === false ? "#define USE_TANGENT" : "", e.vertexColors ? "#define USE_COLOR" : "", e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "", e.vertexUv1s ? "#define USE_UV1" : "", e.vertexUv2s ? "#define USE_UV2" : "", e.vertexUv3s ? "#define USE_UV3" : "", e.pointsUvs ? "#define USE_POINTS_UV" : "", e.flatShading ? "#define FLAT_SHADED" : "", e.skinning ? "#define USE_SKINNING" : "", e.morphTargets ? "#define USE_MORPHTARGETS" : "", e.morphNormals && e.flatShading === false ? "#define USE_MORPHNORMALS" : "", e.morphColors ? "#define USE_MORPHCOLORS" : "", e.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + e.morphTextureStride : "", e.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + e.morphTargetsCount : "", e.doubleSided ? "#define DOUBLE_SIDED" : "", e.flipSided ? "#define FLIP_SIDED" : "", e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", e.shadowMapEnabled ? "#define " + l : "", e.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "", e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "", e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", e.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "", "uniform mat4 modelMatrix;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat3 normalMatrix;", "uniform vec3 cameraPosition;", "uniform bool isOrthographic;", "#ifdef USE_INSTANCING", "	attribute mat4 instanceMatrix;", "#endif", "#ifdef USE_INSTANCING_COLOR", "	attribute vec3 instanceColor;", "#endif", "#ifdef USE_INSTANCING_MORPH", "	uniform sampler2D morphTexture;", "#endif", "attribute vec3 position;", "attribute vec3 normal;", "attribute vec2 uv;", "#ifdef USE_UV1", "	attribute vec2 uv1;", "#endif", "#ifdef USE_UV2", "	attribute vec2 uv2;", "#endif", "#ifdef USE_UV3", "	attribute vec2 uv3;", "#endif", "#ifdef USE_TANGENT", "	attribute vec4 tangent;", "#endif", "#if defined( USE_COLOR_ALPHA )", "	attribute vec4 color;", "#elif defined( USE_COLOR )", "	attribute vec3 color;", "#endif", "#ifdef USE_SKINNING", "	attribute vec4 skinIndex;", "	attribute vec4 skinWeight;", "#endif", `
`].filter(Rs).join(`
`), p = [Ch(e), "#define SHADER_TYPE " + e.shaderType, "#define SHADER_NAME " + e.shaderName, m, e.useFog && e.fog ? "#define USE_FOG" : "", e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "", e.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "", e.map ? "#define USE_MAP" : "", e.matcap ? "#define USE_MATCAP" : "", e.envMap ? "#define USE_ENVMAP" : "", e.envMap ? "#define " + c : "", e.envMap ? "#define " + h : "", e.envMap ? "#define " + u : "", d ? "#define CUBEUV_TEXEL_WIDTH " + d.texelWidth : "", d ? "#define CUBEUV_TEXEL_HEIGHT " + d.texelHeight : "", d ? "#define CUBEUV_MAX_MIP " + d.maxMip + ".0" : "", e.lightMap ? "#define USE_LIGHTMAP" : "", e.aoMap ? "#define USE_AOMAP" : "", e.bumpMap ? "#define USE_BUMPMAP" : "", e.normalMap ? "#define USE_NORMALMAP" : "", e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "", e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "", e.emissiveMap ? "#define USE_EMISSIVEMAP" : "", e.anisotropy ? "#define USE_ANISOTROPY" : "", e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "", e.clearcoat ? "#define USE_CLEARCOAT" : "", e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "", e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "", e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "", e.dispersion ? "#define USE_DISPERSION" : "", e.iridescence ? "#define USE_IRIDESCENCE" : "", e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "", e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "", e.specularMap ? "#define USE_SPECULARMAP" : "", e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "", e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "", e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "", e.metalnessMap ? "#define USE_METALNESSMAP" : "", e.alphaMap ? "#define USE_ALPHAMAP" : "", e.alphaTest ? "#define USE_ALPHATEST" : "", e.alphaHash ? "#define USE_ALPHAHASH" : "", e.sheen ? "#define USE_SHEEN" : "", e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "", e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "", e.transmission ? "#define USE_TRANSMISSION" : "", e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "", e.thicknessMap ? "#define USE_THICKNESSMAP" : "", e.vertexTangents && e.flatShading === false ? "#define USE_TANGENT" : "", e.vertexColors || e.instancingColor || e.batchingColor ? "#define USE_COLOR" : "", e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "", e.vertexUv1s ? "#define USE_UV1" : "", e.vertexUv2s ? "#define USE_UV2" : "", e.vertexUv3s ? "#define USE_UV3" : "", e.pointsUvs ? "#define USE_POINTS_UV" : "", e.gradientMap ? "#define USE_GRADIENTMAP" : "", e.flatShading ? "#define FLAT_SHADED" : "", e.doubleSided ? "#define DOUBLE_SIDED" : "", e.flipSided ? "#define FLIP_SIDED" : "", e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", e.shadowMapEnabled ? "#define " + l : "", e.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "", e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "", e.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "", e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", e.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "", "uniform mat4 viewMatrix;", "uniform vec3 cameraPosition;", "uniform bool isOrthographic;", e.toneMapping !== Rn ? "#define TONE_MAPPING" : "", e.toneMapping !== Rn ? Vt.tonemapping_pars_fragment : "", e.toneMapping !== Rn ? dx("toneMapping", e.toneMapping) : "", e.dithering ? "#define DITHERING" : "", e.opaque ? "#define OPAQUE" : "", Vt.colorspace_pars_fragment, ux("linearToOutputTexel", e.outputColorSpace), fx(), e.useDepthPacking ? "#define DEPTH_PACKING " + e.depthPacking : "", `
`].filter(Rs).join(`
`)), a = Vl(a), a = Eh(a, e), a = Ah(a, e), o = Vl(o), o = Eh(o, e), o = Ah(o, e), a = Th(a), o = Th(o), e.isRawShaderMaterial !== true && (y = `#version 300 es
`, g = [f, "#define attribute in", "#define varying out", "#define texture2D texture"].join(`
`) + `
` + g, p = ["#define varying in", e.glslVersion === zl ? "" : "layout(location = 0) out highp vec4 pc_fragColor;", e.glslVersion === zl ? "" : "#define gl_FragColor pc_fragColor", "#define gl_FragDepthEXT gl_FragDepth", "#define texture2D texture", "#define textureCube texture", "#define texture2DProj textureProj", "#define texture2DLodEXT textureLod", "#define texture2DProjLodEXT textureProjLod", "#define textureCubeLodEXT textureLod", "#define texture2DGradEXT textureGrad", "#define texture2DProjGradEXT textureProjGrad", "#define textureCubeGradEXT textureGrad"].join(`
`) + `
` + p);
  const x = y + g + a, M = y + p + o, I = bh(i, i.VERTEX_SHADER, x), E = bh(i, i.FRAGMENT_SHADER, M);
  i.attachShader(_, I), i.attachShader(_, E), e.index0AttributeName !== void 0 ? i.bindAttribLocation(_, 0, e.index0AttributeName) : e.morphTargets === true && i.bindAttribLocation(_, 0, "position"), i.linkProgram(_);
  function A(b) {
    if (s.debug.checkShaderErrors) {
      const k = i.getProgramInfoLog(_).trim(), B = i.getShaderInfoLog(I).trim(), H = i.getShaderInfoLog(E).trim();
      let Q = true, O = true;
      if (i.getProgramParameter(_, i.LINK_STATUS) === false) if (Q = false, typeof s.debug.onShaderError == "function") s.debug.onShaderError(i, _, I, E);
      else {
        const tt = wh(i, I, "vertex"), W = wh(i, E, "fragment");
        console.error("THREE.WebGLProgram: Shader Error " + i.getError() + " - VALIDATE_STATUS " + i.getProgramParameter(_, i.VALIDATE_STATUS) + `

Material Name: ` + b.name + `
Material Type: ` + b.type + `

Program Info Log: ` + k + `
` + tt + `
` + W);
      }
      else k !== "" ? console.warn("THREE.WebGLProgram: Program Info Log:", k) : (B === "" || H === "") && (O = false);
      O && (b.diagnostics = { runnable: Q, programLog: k, vertexShader: { log: B, prefix: g }, fragmentShader: { log: H, prefix: p } });
    }
    i.deleteShader(I), i.deleteShader(E), P = new pa(i, _), V = gx(i, _);
  }
  let P;
  this.getUniforms = function() {
    return P === void 0 && A(this), P;
  };
  let V;
  this.getAttributes = function() {
    return V === void 0 && A(this), V;
  };
  let v = e.rendererExtensionParallelShaderCompile === false;
  return this.isReady = function() {
    return v === false && (v = i.getProgramParameter(_, ox)), v;
  }, this.destroy = function() {
    n.releaseStatesOfProgram(this), i.deleteProgram(_), this.program = void 0;
  }, this.type = e.shaderType, this.name = e.shaderName, this.id = lx++, this.cacheKey = t, this.usedTimes = 1, this.program = _, this.vertexShader = I, this.fragmentShader = E, this;
}
let Cx = 0;
class Rx {
  constructor() {
    this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
  }
  update(t) {
    const e = t.vertexShader, n = t.fragmentShader, i = this._getShaderStage(e), r = this._getShaderStage(n), a = this._getShaderCacheForMaterial(t);
    return a.has(i) === false && (a.add(i), i.usedTimes++), a.has(r) === false && (a.add(r), r.usedTimes++), this;
  }
  remove(t) {
    const e = this.materialCache.get(t);
    for (const n of e) n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code);
    return this.materialCache.delete(t), this;
  }
  getVertexShaderID(t) {
    return this._getShaderStage(t.vertexShader).id;
  }
  getFragmentShaderID(t) {
    return this._getShaderStage(t.fragmentShader).id;
  }
  dispose() {
    this.shaderCache.clear(), this.materialCache.clear();
  }
  _getShaderCacheForMaterial(t) {
    const e = this.materialCache;
    let n = e.get(t);
    return n === void 0 && (n = /* @__PURE__ */ new Set(), e.set(t, n)), n;
  }
  _getShaderStage(t) {
    const e = this.shaderCache;
    let n = e.get(t);
    return n === void 0 && (n = new Px(t), e.set(t, n)), n;
  }
}
class Px {
  constructor(t) {
    this.id = Cx++, this.code = t, this.usedTimes = 0;
  }
}
function Ix(s, t, e, n, i, r, a) {
  const o = new mo(), l = new Rx(), c = /* @__PURE__ */ new Set(), h = [], u = i.logarithmicDepthBuffer, d = i.reverseDepthBuffer, f = i.vertexTextures;
  let m = i.precision;
  const _ = { MeshDepthMaterial: "depth", MeshDistanceMaterial: "distanceRGBA", MeshNormalMaterial: "normal", MeshBasicMaterial: "basic", MeshLambertMaterial: "lambert", MeshPhongMaterial: "phong", MeshToonMaterial: "toon", MeshStandardMaterial: "physical", MeshPhysicalMaterial: "physical", MeshMatcapMaterial: "matcap", LineBasicMaterial: "basic", LineDashedMaterial: "dashed", PointsMaterial: "points", ShadowMaterial: "shadow", SpriteMaterial: "sprite" };
  function g(v) {
    return c.add(v), v === 0 ? "uv" : `uv${v}`;
  }
  function p(v, b, k, B, H) {
    const Q = B.fog, O = H.geometry, tt = v.isMeshStandardMaterial ? B.environment : null, W = (v.isMeshStandardMaterial ? e : t).get(v.envMap || tt), ht = W && W.mapping === ls ? W.image.height : null, pt = _[v.type];
    v.precision !== null && (m = i.getMaxPrecision(v.precision), m !== v.precision && console.warn("THREE.WebGLProgram.getParameters:", v.precision, "not supported, using", m, "instead."));
    const mt = O.morphAttributes.position || O.morphAttributes.normal || O.morphAttributes.color, Wt = mt !== void 0 ? mt.length : 0;
    let Kt = 0;
    O.morphAttributes.position !== void 0 && (Kt = 1), O.morphAttributes.normal !== void 0 && (Kt = 2), O.morphAttributes.color !== void 0 && (Kt = 3);
    let X, et, Mt, ct;
    if (pt) {
      const Oe = sn[pt];
      X = Oe.vertexShader, et = Oe.fragmentShader;
    } else X = v.vertexShader, et = v.fragmentShader, l.update(v), Mt = l.getVertexShaderID(v), ct = l.getFragmentShaderID(v);
    const Lt = s.getRenderTarget(), It = H.isInstancedMesh === true, Ot = H.isBatchedMesh === true, Gt = !!v.map, J = !!v.matcap, R = !!W, rt = !!v.aoMap, st = !!v.lightMap, j = !!v.bumpMap, at = !!v.normalMap, Ct = !!v.displacementMap, gt = !!v.emissiveMap, T = !!v.metalnessMap, S = !!v.roughnessMap, N = v.anisotropy > 0, q = v.clearcoat > 0, $ = v.dispersion > 0, Y = v.iridescence > 0, Et = v.sheen > 0, lt = v.transmission > 0, vt = N && !!v.anisotropyMap, Xt = q && !!v.clearcoatMap, nt = q && !!v.clearcoatNormalMap, yt = q && !!v.clearcoatRoughnessMap, Nt = Y && !!v.iridescenceMap, Ft = Y && !!v.iridescenceThicknessMap, St = Et && !!v.sheenColorMap, qt = Et && !!v.sheenRoughnessMap, Bt = !!v.specularMap, se = !!v.specularColorMap, L = !!v.specularIntensityMap, _t = lt && !!v.transmissionMap, G = lt && !!v.thicknessMap, K = !!v.gradientMap, ut = !!v.alphaMap, xt = v.alphaTest > 0, Yt = !!v.alphaHash, pe = !!v.extensions;
    let Fe = Rn;
    v.toneMapped && (Lt === null || Lt.isXRRenderTarget === true) && (Fe = s.toneMapping);
    const jt = { shaderID: pt, shaderType: v.type, shaderName: v.name, vertexShader: X, fragmentShader: et, defines: v.defines, customVertexShaderID: Mt, customFragmentShaderID: ct, isRawShaderMaterial: v.isRawShaderMaterial === true, glslVersion: v.glslVersion, precision: m, batching: Ot, batchingColor: Ot && H._colorsTexture !== null, instancing: It, instancingColor: It && H.instanceColor !== null, instancingMorph: It && H.morphTexture !== null, supportsVertexTextures: f, outputColorSpace: Lt === null ? s.outputColorSpace : Lt.isXRRenderTarget === true ? Lt.texture.colorSpace : Un, alphaToCoverage: !!v.alphaToCoverage, map: Gt, matcap: J, envMap: R, envMapMode: R && W.mapping, envMapCubeUVHeight: ht, aoMap: rt, lightMap: st, bumpMap: j, normalMap: at, displacementMap: f && Ct, emissiveMap: gt, normalMapObjectSpace: at && v.normalMapType === pd, normalMapTangentSpace: at && v.normalMapType === Jn, metalnessMap: T, roughnessMap: S, anisotropy: N, anisotropyMap: vt, clearcoat: q, clearcoatMap: Xt, clearcoatNormalMap: nt, clearcoatRoughnessMap: yt, dispersion: $, iridescence: Y, iridescenceMap: Nt, iridescenceThicknessMap: Ft, sheen: Et, sheenColorMap: St, sheenRoughnessMap: qt, specularMap: Bt, specularColorMap: se, specularIntensityMap: L, transmission: lt, transmissionMap: _t, thicknessMap: G, gradientMap: K, opaque: v.transparent === false && v.blending === yi && v.alphaToCoverage === false, alphaMap: ut, alphaTest: xt, alphaHash: Yt, combine: v.combine, mapUv: Gt && g(v.map.channel), aoMapUv: rt && g(v.aoMap.channel), lightMapUv: st && g(v.lightMap.channel), bumpMapUv: j && g(v.bumpMap.channel), normalMapUv: at && g(v.normalMap.channel), displacementMapUv: Ct && g(v.displacementMap.channel), emissiveMapUv: gt && g(v.emissiveMap.channel), metalnessMapUv: T && g(v.metalnessMap.channel), roughnessMapUv: S && g(v.roughnessMap.channel), anisotropyMapUv: vt && g(v.anisotropyMap.channel), clearcoatMapUv: Xt && g(v.clearcoatMap.channel), clearcoatNormalMapUv: nt && g(v.clearcoatNormalMap.channel), clearcoatRoughnessMapUv: yt && g(v.clearcoatRoughnessMap.channel), iridescenceMapUv: Nt && g(v.iridescenceMap.channel), iridescenceThicknessMapUv: Ft && g(v.iridescenceThicknessMap.channel), sheenColorMapUv: St && g(v.sheenColorMap.channel), sheenRoughnessMapUv: qt && g(v.sheenRoughnessMap.channel), specularMapUv: Bt && g(v.specularMap.channel), specularColorMapUv: se && g(v.specularColorMap.channel), specularIntensityMapUv: L && g(v.specularIntensityMap.channel), transmissionMapUv: _t && g(v.transmissionMap.channel), thicknessMapUv: G && g(v.thicknessMap.channel), alphaMapUv: ut && g(v.alphaMap.channel), vertexTangents: !!O.attributes.tangent && (at || N), vertexColors: v.vertexColors, vertexAlphas: v.vertexColors === true && !!O.attributes.color && O.attributes.color.itemSize === 4, pointsUvs: H.isPoints === true && !!O.attributes.uv && (Gt || ut), fog: !!Q, useFog: v.fog === true, fogExp2: !!Q && Q.isFogExp2, flatShading: v.flatShading === true, sizeAttenuation: v.sizeAttenuation === true, logarithmicDepthBuffer: u, reverseDepthBuffer: d, skinning: H.isSkinnedMesh === true, morphTargets: O.morphAttributes.position !== void 0, morphNormals: O.morphAttributes.normal !== void 0, morphColors: O.morphAttributes.color !== void 0, morphTargetsCount: Wt, morphTextureStride: Kt, numDirLights: b.directional.length, numPointLights: b.point.length, numSpotLights: b.spot.length, numSpotLightMaps: b.spotLightMap.length, numRectAreaLights: b.rectArea.length, numHemiLights: b.hemi.length, numDirLightShadows: b.directionalShadowMap.length, numPointLightShadows: b.pointShadowMap.length, numSpotLightShadows: b.spotShadowMap.length, numSpotLightShadowsWithMaps: b.numSpotLightShadowsWithMaps, numLightProbes: b.numLightProbes, numClippingPlanes: a.numPlanes, numClipIntersection: a.numIntersection, dithering: v.dithering, shadowMapEnabled: s.shadowMap.enabled && k.length > 0, shadowMapType: s.shadowMap.type, toneMapping: Fe, decodeVideoTexture: Gt && v.map.isVideoTexture === true && Qt.getTransfer(v.map.colorSpace) === re, premultipliedAlpha: v.premultipliedAlpha, doubleSided: v.side === hn, flipSided: v.side === De, useDepthPacking: v.depthPacking >= 0, depthPacking: v.depthPacking || 0, index0AttributeName: v.index0AttributeName, extensionClipCullDistance: pe && v.extensions.clipCullDistance === true && n.has("WEBGL_clip_cull_distance"), extensionMultiDraw: (pe && v.extensions.multiDraw === true || Ot) && n.has("WEBGL_multi_draw"), rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"), customProgramCacheKey: v.customProgramCacheKey() };
    return jt.vertexUv1s = c.has(1), jt.vertexUv2s = c.has(2), jt.vertexUv3s = c.has(3), c.clear(), jt;
  }
  function y(v) {
    const b = [];
    if (v.shaderID ? b.push(v.shaderID) : (b.push(v.customVertexShaderID), b.push(v.customFragmentShaderID)), v.defines !== void 0) for (const k in v.defines) b.push(k), b.push(v.defines[k]);
    return v.isRawShaderMaterial === false && (x(b, v), M(b, v), b.push(s.outputColorSpace)), b.push(v.customProgramCacheKey), b.join();
  }
  function x(v, b) {
    v.push(b.precision), v.push(b.outputColorSpace), v.push(b.envMapMode), v.push(b.envMapCubeUVHeight), v.push(b.mapUv), v.push(b.alphaMapUv), v.push(b.lightMapUv), v.push(b.aoMapUv), v.push(b.bumpMapUv), v.push(b.normalMapUv), v.push(b.displacementMapUv), v.push(b.emissiveMapUv), v.push(b.metalnessMapUv), v.push(b.roughnessMapUv), v.push(b.anisotropyMapUv), v.push(b.clearcoatMapUv), v.push(b.clearcoatNormalMapUv), v.push(b.clearcoatRoughnessMapUv), v.push(b.iridescenceMapUv), v.push(b.iridescenceThicknessMapUv), v.push(b.sheenColorMapUv), v.push(b.sheenRoughnessMapUv), v.push(b.specularMapUv), v.push(b.specularColorMapUv), v.push(b.specularIntensityMapUv), v.push(b.transmissionMapUv), v.push(b.thicknessMapUv), v.push(b.combine), v.push(b.fogExp2), v.push(b.sizeAttenuation), v.push(b.morphTargetsCount), v.push(b.morphAttributeCount), v.push(b.numDirLights), v.push(b.numPointLights), v.push(b.numSpotLights), v.push(b.numSpotLightMaps), v.push(b.numHemiLights), v.push(b.numRectAreaLights), v.push(b.numDirLightShadows), v.push(b.numPointLightShadows), v.push(b.numSpotLightShadows), v.push(b.numSpotLightShadowsWithMaps), v.push(b.numLightProbes), v.push(b.shadowMapType), v.push(b.toneMapping), v.push(b.numClippingPlanes), v.push(b.numClipIntersection), v.push(b.depthPacking);
  }
  function M(v, b) {
    o.disableAll(), b.supportsVertexTextures && o.enable(0), b.instancing && o.enable(1), b.instancingColor && o.enable(2), b.instancingMorph && o.enable(3), b.matcap && o.enable(4), b.envMap && o.enable(5), b.normalMapObjectSpace && o.enable(6), b.normalMapTangentSpace && o.enable(7), b.clearcoat && o.enable(8), b.iridescence && o.enable(9), b.alphaTest && o.enable(10), b.vertexColors && o.enable(11), b.vertexAlphas && o.enable(12), b.vertexUv1s && o.enable(13), b.vertexUv2s && o.enable(14), b.vertexUv3s && o.enable(15), b.vertexTangents && o.enable(16), b.anisotropy && o.enable(17), b.alphaHash && o.enable(18), b.batching && o.enable(19), b.dispersion && o.enable(20), b.batchingColor && o.enable(21), v.push(o.mask), o.disableAll(), b.fog && o.enable(0), b.useFog && o.enable(1), b.flatShading && o.enable(2), b.logarithmicDepthBuffer && o.enable(3), b.reverseDepthBuffer && o.enable(4), b.skinning && o.enable(5), b.morphTargets && o.enable(6), b.morphNormals && o.enable(7), b.morphColors && o.enable(8), b.premultipliedAlpha && o.enable(9), b.shadowMapEnabled && o.enable(10), b.doubleSided && o.enable(11), b.flipSided && o.enable(12), b.useDepthPacking && o.enable(13), b.dithering && o.enable(14), b.transmission && o.enable(15), b.sheen && o.enable(16), b.opaque && o.enable(17), b.pointsUvs && o.enable(18), b.decodeVideoTexture && o.enable(19), b.alphaToCoverage && o.enable(20), v.push(o.mask);
  }
  function I(v) {
    const b = _[v.type];
    let k;
    if (b) {
      const B = sn[b];
      k = Cd.clone(B.uniforms);
    } else k = v.uniforms;
    return k;
  }
  function E(v, b) {
    let k;
    for (let B = 0, H = h.length; B < H; B++) {
      const Q = h[B];
      if (Q.cacheKey === b) {
        k = Q, ++k.usedTimes;
        break;
      }
    }
    return k === void 0 && (k = new Tx(s, b, v, r), h.push(k)), k;
  }
  function A(v) {
    if (--v.usedTimes === 0) {
      const b = h.indexOf(v);
      h[b] = h[h.length - 1], h.pop(), v.destroy();
    }
  }
  function P(v) {
    l.remove(v);
  }
  function V() {
    l.dispose();
  }
  return { getParameters: p, getProgramCacheKey: y, getUniforms: I, acquireProgram: E, releaseProgram: A, releaseShaderCache: P, programs: h, dispose: V };
}
function Lx() {
  let s = /* @__PURE__ */ new WeakMap();
  function t(a) {
    return s.has(a);
  }
  function e(a) {
    let o = s.get(a);
    return o === void 0 && (o = {}, s.set(a, o)), o;
  }
  function n(a) {
    s.delete(a);
  }
  function i(a, o, l) {
    s.get(a)[o] = l;
  }
  function r() {
    s = /* @__PURE__ */ new WeakMap();
  }
  return { has: t, get: e, remove: n, update: i, dispose: r };
}
function Dx(s, t) {
  return s.groupOrder !== t.groupOrder ? s.groupOrder - t.groupOrder : s.renderOrder !== t.renderOrder ? s.renderOrder - t.renderOrder : s.material.id !== t.material.id ? s.material.id - t.material.id : s.z !== t.z ? s.z - t.z : s.id - t.id;
}
function Rh(s, t) {
  return s.groupOrder !== t.groupOrder ? s.groupOrder - t.groupOrder : s.renderOrder !== t.renderOrder ? s.renderOrder - t.renderOrder : s.z !== t.z ? t.z - s.z : s.id - t.id;
}
function Ph() {
  const s = [];
  let t = 0;
  const e = [], n = [], i = [];
  function r() {
    t = 0, e.length = 0, n.length = 0, i.length = 0;
  }
  function a(u, d, f, m, _, g) {
    let p = s[t];
    return p === void 0 ? (p = { id: u.id, object: u, geometry: d, material: f, groupOrder: m, renderOrder: u.renderOrder, z: _, group: g }, s[t] = p) : (p.id = u.id, p.object = u, p.geometry = d, p.material = f, p.groupOrder = m, p.renderOrder = u.renderOrder, p.z = _, p.group = g), t++, p;
  }
  function o(u, d, f, m, _, g) {
    const p = a(u, d, f, m, _, g);
    f.transmission > 0 ? n.push(p) : f.transparent === true ? i.push(p) : e.push(p);
  }
  function l(u, d, f, m, _, g) {
    const p = a(u, d, f, m, _, g);
    f.transmission > 0 ? n.unshift(p) : f.transparent === true ? i.unshift(p) : e.unshift(p);
  }
  function c(u, d) {
    e.length > 1 && e.sort(u || Dx), n.length > 1 && n.sort(d || Rh), i.length > 1 && i.sort(d || Rh);
  }
  function h() {
    for (let u = t, d = s.length; u < d; u++) {
      const f = s[u];
      if (f.id === null) break;
      f.id = null, f.object = null, f.geometry = null, f.material = null, f.group = null;
    }
  }
  return { opaque: e, transmissive: n, transparent: i, init: r, push: o, unshift: l, finish: h, sort: c };
}
function Ux() {
  let s = /* @__PURE__ */ new WeakMap();
  function t(n, i) {
    const r = s.get(n);
    let a;
    return r === void 0 ? (a = new Ph(), s.set(n, [a])) : i >= r.length ? (a = new Ph(), r.push(a)) : a = r[i], a;
  }
  function e() {
    s = /* @__PURE__ */ new WeakMap();
  }
  return { get: t, dispose: e };
}
function Nx() {
  const s = {};
  return { get: function(t) {
    if (s[t.id] !== void 0) return s[t.id];
    let e;
    switch (t.type) {
      case "DirectionalLight":
        e = { direction: new C(), color: new ft() };
        break;
      case "SpotLight":
        e = { position: new C(), direction: new C(), color: new ft(), distance: 0, coneCos: 0, penumbraCos: 0, decay: 0 };
        break;
      case "PointLight":
        e = { position: new C(), color: new ft(), distance: 0, decay: 0 };
        break;
      case "HemisphereLight":
        e = { direction: new C(), skyColor: new ft(), groundColor: new ft() };
        break;
      case "RectAreaLight":
        e = { color: new ft(), position: new C(), halfWidth: new C(), halfHeight: new C() };
        break;
    }
    return s[t.id] = e, e;
  } };
}
function Fx() {
  const s = {};
  return { get: function(t) {
    if (s[t.id] !== void 0) return s[t.id];
    let e;
    switch (t.type) {
      case "DirectionalLight":
        e = { shadowIntensity: 1, shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new Z() };
        break;
      case "SpotLight":
        e = { shadowIntensity: 1, shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new Z() };
        break;
      case "PointLight":
        e = { shadowIntensity: 1, shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new Z(), shadowCameraNear: 1, shadowCameraFar: 1e3 };
        break;
    }
    return s[t.id] = e, e;
  } };
}
let Ox = 0;
function Bx(s, t) {
  return (t.castShadow ? 2 : 0) - (s.castShadow ? 2 : 0) + (t.map ? 1 : 0) - (s.map ? 1 : 0);
}
function zx(s) {
  const t = new Nx(), e = Fx(), n = { version: 0, hash: { directionalLength: -1, pointLength: -1, spotLength: -1, rectAreaLength: -1, hemiLength: -1, numDirectionalShadows: -1, numPointShadows: -1, numSpotShadows: -1, numSpotMaps: -1, numLightProbes: -1 }, ambient: [0, 0, 0], probe: [], directional: [], directionalShadow: [], directionalShadowMap: [], directionalShadowMatrix: [], spot: [], spotLightMap: [], spotShadow: [], spotShadowMap: [], spotLightMatrix: [], rectArea: [], rectAreaLTC1: null, rectAreaLTC2: null, point: [], pointShadow: [], pointShadowMap: [], pointShadowMatrix: [], hemi: [], numSpotLightShadowsWithMaps: 0, numLightProbes: 0 };
  for (let c = 0; c < 9; c++) n.probe.push(new C());
  const i = new C(), r = new Pt(), a = new Pt();
  function o(c) {
    let h = 0, u = 0, d = 0;
    for (let V = 0; V < 9; V++) n.probe[V].set(0, 0, 0);
    let f = 0, m = 0, _ = 0, g = 0, p = 0, y = 0, x = 0, M = 0, I = 0, E = 0, A = 0;
    c.sort(Bx);
    for (let V = 0, v = c.length; V < v; V++) {
      const b = c[V], k = b.color, B = b.intensity, H = b.distance, Q = b.shadow && b.shadow.map ? b.shadow.map.texture : null;
      if (b.isAmbientLight) h += k.r * B, u += k.g * B, d += k.b * B;
      else if (b.isLightProbe) {
        for (let O = 0; O < 9; O++) n.probe[O].addScaledVector(b.sh.coefficients[O], B);
        A++;
      } else if (b.isDirectionalLight) {
        const O = t.get(b);
        if (O.color.copy(b.color).multiplyScalar(b.intensity), b.castShadow) {
          const tt = b.shadow, W = e.get(b);
          W.shadowIntensity = tt.intensity, W.shadowBias = tt.bias, W.shadowNormalBias = tt.normalBias, W.shadowRadius = tt.radius, W.shadowMapSize = tt.mapSize, n.directionalShadow[f] = W, n.directionalShadowMap[f] = Q, n.directionalShadowMatrix[f] = b.shadow.matrix, y++;
        }
        n.directional[f] = O, f++;
      } else if (b.isSpotLight) {
        const O = t.get(b);
        O.position.setFromMatrixPosition(b.matrixWorld), O.color.copy(k).multiplyScalar(B), O.distance = H, O.coneCos = Math.cos(b.angle), O.penumbraCos = Math.cos(b.angle * (1 - b.penumbra)), O.decay = b.decay, n.spot[_] = O;
        const tt = b.shadow;
        if (b.map && (n.spotLightMap[I] = b.map, I++, tt.updateMatrices(b), b.castShadow && E++), n.spotLightMatrix[_] = tt.matrix, b.castShadow) {
          const W = e.get(b);
          W.shadowIntensity = tt.intensity, W.shadowBias = tt.bias, W.shadowNormalBias = tt.normalBias, W.shadowRadius = tt.radius, W.shadowMapSize = tt.mapSize, n.spotShadow[_] = W, n.spotShadowMap[_] = Q, M++;
        }
        _++;
      } else if (b.isRectAreaLight) {
        const O = t.get(b);
        O.color.copy(k).multiplyScalar(B), O.halfWidth.set(b.width * 0.5, 0, 0), O.halfHeight.set(0, b.height * 0.5, 0), n.rectArea[g] = O, g++;
      } else if (b.isPointLight) {
        const O = t.get(b);
        if (O.color.copy(b.color).multiplyScalar(b.intensity), O.distance = b.distance, O.decay = b.decay, b.castShadow) {
          const tt = b.shadow, W = e.get(b);
          W.shadowIntensity = tt.intensity, W.shadowBias = tt.bias, W.shadowNormalBias = tt.normalBias, W.shadowRadius = tt.radius, W.shadowMapSize = tt.mapSize, W.shadowCameraNear = tt.camera.near, W.shadowCameraFar = tt.camera.far, n.pointShadow[m] = W, n.pointShadowMap[m] = Q, n.pointShadowMatrix[m] = b.shadow.matrix, x++;
        }
        n.point[m] = O, m++;
      } else if (b.isHemisphereLight) {
        const O = t.get(b);
        O.skyColor.copy(b.color).multiplyScalar(B), O.groundColor.copy(b.groundColor).multiplyScalar(B), n.hemi[p] = O, p++;
      }
    }
    g > 0 && (s.has("OES_texture_float_linear") === true ? (n.rectAreaLTC1 = ot.LTC_FLOAT_1, n.rectAreaLTC2 = ot.LTC_FLOAT_2) : (n.rectAreaLTC1 = ot.LTC_HALF_1, n.rectAreaLTC2 = ot.LTC_HALF_2)), n.ambient[0] = h, n.ambient[1] = u, n.ambient[2] = d;
    const P = n.hash;
    (P.directionalLength !== f || P.pointLength !== m || P.spotLength !== _ || P.rectAreaLength !== g || P.hemiLength !== p || P.numDirectionalShadows !== y || P.numPointShadows !== x || P.numSpotShadows !== M || P.numSpotMaps !== I || P.numLightProbes !== A) && (n.directional.length = f, n.spot.length = _, n.rectArea.length = g, n.point.length = m, n.hemi.length = p, n.directionalShadow.length = y, n.directionalShadowMap.length = y, n.pointShadow.length = x, n.pointShadowMap.length = x, n.spotShadow.length = M, n.spotShadowMap.length = M, n.directionalShadowMatrix.length = y, n.pointShadowMatrix.length = x, n.spotLightMatrix.length = M + I - E, n.spotLightMap.length = I, n.numSpotLightShadowsWithMaps = E, n.numLightProbes = A, P.directionalLength = f, P.pointLength = m, P.spotLength = _, P.rectAreaLength = g, P.hemiLength = p, P.numDirectionalShadows = y, P.numPointShadows = x, P.numSpotShadows = M, P.numSpotMaps = I, P.numLightProbes = A, n.version = Ox++);
  }
  function l(c, h) {
    let u = 0, d = 0, f = 0, m = 0, _ = 0;
    const g = h.matrixWorldInverse;
    for (let p = 0, y = c.length; p < y; p++) {
      const x = c[p];
      if (x.isDirectionalLight) {
        const M = n.directional[u];
        M.direction.setFromMatrixPosition(x.matrixWorld), i.setFromMatrixPosition(x.target.matrixWorld), M.direction.sub(i), M.direction.transformDirection(g), u++;
      } else if (x.isSpotLight) {
        const M = n.spot[f];
        M.position.setFromMatrixPosition(x.matrixWorld), M.position.applyMatrix4(g), M.direction.setFromMatrixPosition(x.matrixWorld), i.setFromMatrixPosition(x.target.matrixWorld), M.direction.sub(i), M.direction.transformDirection(g), f++;
      } else if (x.isRectAreaLight) {
        const M = n.rectArea[m];
        M.position.setFromMatrixPosition(x.matrixWorld), M.position.applyMatrix4(g), a.identity(), r.copy(x.matrixWorld), r.premultiply(g), a.extractRotation(r), M.halfWidth.set(x.width * 0.5, 0, 0), M.halfHeight.set(0, x.height * 0.5, 0), M.halfWidth.applyMatrix4(a), M.halfHeight.applyMatrix4(a), m++;
      } else if (x.isPointLight) {
        const M = n.point[d];
        M.position.setFromMatrixPosition(x.matrixWorld), M.position.applyMatrix4(g), d++;
      } else if (x.isHemisphereLight) {
        const M = n.hemi[_];
        M.direction.setFromMatrixPosition(x.matrixWorld), M.direction.transformDirection(g), _++;
      }
    }
  }
  return { setup: o, setupView: l, state: n };
}
function Ih(s) {
  const t = new zx(s), e = [], n = [];
  function i(h) {
    c.camera = h, e.length = 0, n.length = 0;
  }
  function r(h) {
    e.push(h);
  }
  function a(h) {
    n.push(h);
  }
  function o() {
    t.setup(e);
  }
  function l(h) {
    t.setupView(e, h);
  }
  const c = { lightsArray: e, shadowsArray: n, camera: null, lights: t, transmissionRenderTarget: {} };
  return { init: i, state: c, setupLights: o, setupLightsView: l, pushLight: r, pushShadow: a };
}
function kx(s) {
  let t = /* @__PURE__ */ new WeakMap();
  function e(i, r = 0) {
    const a = t.get(i);
    let o;
    return a === void 0 ? (o = new Ih(s), t.set(i, [o])) : r >= a.length ? (o = new Ih(s), a.push(o)) : o = a[r], o;
  }
  function n() {
    t = /* @__PURE__ */ new WeakMap();
  }
  return { get: e, dispose: n };
}
class mc extends Ce {
  constructor(t) {
    super(), this.isMeshDepthMaterial = true, this.type = "MeshDepthMaterial", this.depthPacking = dd, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = false, this.wireframeLinewidth = 1, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.depthPacking = t.depthPacking, this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this;
  }
}
class gc extends Ce {
  constructor(t) {
    super(), this.isMeshDistanceMaterial = true, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this;
  }
}
const Vx = `void main() {
	gl_Position = vec4( position, 1.0 );
}`, Hx = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;
function Gx(s, t, e) {
  let n = new dr();
  const i = new Z(), r = new Z(), a = new Jt(), o = new mc({ depthPacking: fd }), l = new gc(), c = {}, h = e.maxTextureSize, u = { [Pn]: De, [De]: Pn, [hn]: hn }, d = new an({ defines: { VSM_SAMPLES: 8 }, uniforms: { shadow_pass: { value: null }, resolution: { value: new Z() }, radius: { value: 4 } }, vertexShader: Vx, fragmentShader: Hx }), f = d.clone();
  f.defines.HORIZONTAL_PASS = 1;
  const m = new Ht();
  m.setAttribute("position", new ie(new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]), 3));
  const _ = new _e(m, d), g = this;
  this.enabled = false, this.autoUpdate = true, this.needsUpdate = false, this.type = $l;
  let p = this.type;
  this.render = function(E, A, P) {
    if (g.enabled === false || g.autoUpdate === false && g.needsUpdate === false || E.length === 0) return;
    const V = s.getRenderTarget(), v = s.getActiveCubeFace(), b = s.getActiveMipmapLevel(), k = s.state;
    k.setBlending(Cn), k.buffers.color.setClear(1, 1, 1, 1), k.buffers.depth.setTest(true), k.setScissorTest(false);
    const B = p !== cn && this.type === cn, H = p === cn && this.type !== cn;
    for (let Q = 0, O = E.length; Q < O; Q++) {
      const tt = E[Q], W = tt.shadow;
      if (W === void 0) {
        console.warn("THREE.WebGLShadowMap:", tt, "has no shadow.");
        continue;
      }
      if (W.autoUpdate === false && W.needsUpdate === false) continue;
      i.copy(W.mapSize);
      const ht = W.getFrameExtents();
      if (i.multiply(ht), r.copy(W.mapSize), (i.x > h || i.y > h) && (i.x > h && (r.x = Math.floor(h / ht.x), i.x = r.x * ht.x, W.mapSize.x = r.x), i.y > h && (r.y = Math.floor(h / ht.y), i.y = r.y * ht.y, W.mapSize.y = r.y)), W.map === null || B === true || H === true) {
        const mt = this.type !== cn ? { minFilter: Me, magFilter: Me } : {};
        W.map !== null && W.map.dispose(), W.map = new rn(i.x, i.y, mt), W.map.texture.name = tt.name + ".shadowMap", W.camera.updateProjectionMatrix();
      }
      s.setRenderTarget(W.map), s.clear();
      const pt = W.getViewportCount();
      for (let mt = 0; mt < pt; mt++) {
        const Wt = W.getViewport(mt);
        a.set(r.x * Wt.x, r.y * Wt.y, r.x * Wt.z, r.y * Wt.w), k.viewport(a), W.updateMatrices(tt, mt), n = W.getFrustum(), M(A, P, W.camera, tt, this.type);
      }
      W.isPointLightShadow !== true && this.type === cn && y(W, P), W.needsUpdate = false;
    }
    p = this.type, g.needsUpdate = false, s.setRenderTarget(V, v, b);
  };
  function y(E, A) {
    const P = t.update(_);
    d.defines.VSM_SAMPLES !== E.blurSamples && (d.defines.VSM_SAMPLES = E.blurSamples, f.defines.VSM_SAMPLES = E.blurSamples, d.needsUpdate = true, f.needsUpdate = true), E.mapPass === null && (E.mapPass = new rn(i.x, i.y)), d.uniforms.shadow_pass.value = E.map.texture, d.uniforms.resolution.value = E.mapSize, d.uniforms.radius.value = E.radius, s.setRenderTarget(E.mapPass), s.clear(), s.renderBufferDirect(A, null, P, d, _, null), f.uniforms.shadow_pass.value = E.mapPass.texture, f.uniforms.resolution.value = E.mapSize, f.uniforms.radius.value = E.radius, s.setRenderTarget(E.map), s.clear(), s.renderBufferDirect(A, null, P, f, _, null);
  }
  function x(E, A, P, V) {
    let v = null;
    const b = P.isPointLight === true ? E.customDistanceMaterial : E.customDepthMaterial;
    if (b !== void 0) v = b;
    else if (v = P.isPointLight === true ? l : o, s.localClippingEnabled && A.clipShadows === true && Array.isArray(A.clippingPlanes) && A.clippingPlanes.length !== 0 || A.displacementMap && A.displacementScale !== 0 || A.alphaMap && A.alphaTest > 0 || A.map && A.alphaTest > 0) {
      const k = v.uuid, B = A.uuid;
      let H = c[k];
      H === void 0 && (H = {}, c[k] = H);
      let Q = H[B];
      Q === void 0 && (Q = v.clone(), H[B] = Q, A.addEventListener("dispose", I)), v = Q;
    }
    if (v.visible = A.visible, v.wireframe = A.wireframe, V === cn ? v.side = A.shadowSide !== null ? A.shadowSide : A.side : v.side = A.shadowSide !== null ? A.shadowSide : u[A.side], v.alphaMap = A.alphaMap, v.alphaTest = A.alphaTest, v.map = A.map, v.clipShadows = A.clipShadows, v.clippingPlanes = A.clippingPlanes, v.clipIntersection = A.clipIntersection, v.displacementMap = A.displacementMap, v.displacementScale = A.displacementScale, v.displacementBias = A.displacementBias, v.wireframeLinewidth = A.wireframeLinewidth, v.linewidth = A.linewidth, P.isPointLight === true && v.isMeshDistanceMaterial === true) {
      const k = s.properties.get(v);
      k.light = P;
    }
    return v;
  }
  function M(E, A, P, V, v) {
    if (E.visible === false) return;
    if (E.layers.test(A.layers) && (E.isMesh || E.isLine || E.isPoints) && (E.castShadow || E.receiveShadow && v === cn) && (!E.frustumCulled || n.intersectsObject(E))) {
      E.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse, E.matrixWorld);
      const B = t.update(E), H = E.material;
      if (Array.isArray(H)) {
        const Q = B.groups;
        for (let O = 0, tt = Q.length; O < tt; O++) {
          const W = Q[O], ht = H[W.materialIndex];
          if (ht && ht.visible) {
            const pt = x(E, ht, V, v);
            E.onBeforeShadow(s, E, A, P, B, pt, W), s.renderBufferDirect(P, null, B, pt, E, W), E.onAfterShadow(s, E, A, P, B, pt, W);
          }
        }
      } else if (H.visible) {
        const Q = x(E, H, V, v);
        E.onBeforeShadow(s, E, A, P, B, Q, null), s.renderBufferDirect(P, null, B, Q, E, null), E.onAfterShadow(s, E, A, P, B, Q, null);
      }
    }
    const k = E.children;
    for (let B = 0, H = k.length; B < H; B++) M(k[B], A, P, V, v);
  }
  function I(E) {
    E.target.removeEventListener("dispose", I);
    for (const P in c) {
      const V = c[P], v = E.target.uuid;
      v in V && (V[v].dispose(), delete V[v]);
    }
  }
}
const Wx = { [ya]: Ma, [Sa]: Ea, [ba]: Aa, [wi]: wa, [Ma]: ya, [Ea]: Sa, [Aa]: ba, [wa]: wi };
function Xx(s) {
  function t() {
    let L = false;
    const _t = new Jt();
    let G = null;
    const K = new Jt(0, 0, 0, 0);
    return { setMask: function(ut) {
      G !== ut && !L && (s.colorMask(ut, ut, ut, ut), G = ut);
    }, setLocked: function(ut) {
      L = ut;
    }, setClear: function(ut, xt, Yt, pe, Fe) {
      Fe === true && (ut *= pe, xt *= pe, Yt *= pe), _t.set(ut, xt, Yt, pe), K.equals(_t) === false && (s.clearColor(ut, xt, Yt, pe), K.copy(_t));
    }, reset: function() {
      L = false, G = null, K.set(-1, 0, 0, 0);
    } };
  }
  function e() {
    let L = false, _t = false, G = null, K = null, ut = null;
    return { setReversed: function(xt) {
      _t = xt;
    }, setTest: function(xt) {
      xt ? Mt(s.DEPTH_TEST) : ct(s.DEPTH_TEST);
    }, setMask: function(xt) {
      G !== xt && !L && (s.depthMask(xt), G = xt);
    }, setFunc: function(xt) {
      if (_t && (xt = Wx[xt]), K !== xt) {
        switch (xt) {
          case ya:
            s.depthFunc(s.NEVER);
            break;
          case Ma:
            s.depthFunc(s.ALWAYS);
            break;
          case Sa:
            s.depthFunc(s.LESS);
            break;
          case wi:
            s.depthFunc(s.LEQUAL);
            break;
          case ba:
            s.depthFunc(s.EQUAL);
            break;
          case wa:
            s.depthFunc(s.GEQUAL);
            break;
          case Ea:
            s.depthFunc(s.GREATER);
            break;
          case Aa:
            s.depthFunc(s.NOTEQUAL);
            break;
          default:
            s.depthFunc(s.LEQUAL);
        }
        K = xt;
      }
    }, setLocked: function(xt) {
      L = xt;
    }, setClear: function(xt) {
      ut !== xt && (s.clearDepth(xt), ut = xt);
    }, reset: function() {
      L = false, G = null, K = null, ut = null;
    } };
  }
  function n() {
    let L = false, _t = null, G = null, K = null, ut = null, xt = null, Yt = null, pe = null, Fe = null;
    return { setTest: function(jt) {
      L || (jt ? Mt(s.STENCIL_TEST) : ct(s.STENCIL_TEST));
    }, setMask: function(jt) {
      _t !== jt && !L && (s.stencilMask(jt), _t = jt);
    }, setFunc: function(jt, Oe, xn) {
      (G !== jt || K !== Oe || ut !== xn) && (s.stencilFunc(jt, Oe, xn), G = jt, K = Oe, ut = xn);
    }, setOp: function(jt, Oe, xn) {
      (xt !== jt || Yt !== Oe || pe !== xn) && (s.stencilOp(jt, Oe, xn), xt = jt, Yt = Oe, pe = xn);
    }, setLocked: function(jt) {
      L = jt;
    }, setClear: function(jt) {
      Fe !== jt && (s.clearStencil(jt), Fe = jt);
    }, reset: function() {
      L = false, _t = null, G = null, K = null, ut = null, xt = null, Yt = null, pe = null, Fe = null;
    } };
  }
  const i = new t(), r = new e(), a = new n(), o = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap();
  let c = {}, h = {}, u = /* @__PURE__ */ new WeakMap(), d = [], f = null, m = false, _ = null, g = null, p = null, y = null, x = null, M = null, I = null, E = new ft(0, 0, 0), A = 0, P = false, V = null, v = null, b = null, k = null, B = null;
  const H = s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let Q = false, O = 0;
  const tt = s.getParameter(s.VERSION);
  tt.indexOf("WebGL") !== -1 ? (O = parseFloat(/^WebGL (\d)/.exec(tt)[1]), Q = O >= 1) : tt.indexOf("OpenGL ES") !== -1 && (O = parseFloat(/^OpenGL ES (\d)/.exec(tt)[1]), Q = O >= 2);
  let W = null, ht = {};
  const pt = s.getParameter(s.SCISSOR_BOX), mt = s.getParameter(s.VIEWPORT), Wt = new Jt().fromArray(pt), Kt = new Jt().fromArray(mt);
  function X(L, _t, G, K) {
    const ut = new Uint8Array(4), xt = s.createTexture();
    s.bindTexture(L, xt), s.texParameteri(L, s.TEXTURE_MIN_FILTER, s.NEAREST), s.texParameteri(L, s.TEXTURE_MAG_FILTER, s.NEAREST);
    for (let Yt = 0; Yt < G; Yt++) L === s.TEXTURE_3D || L === s.TEXTURE_2D_ARRAY ? s.texImage3D(_t, 0, s.RGBA, 1, 1, K, 0, s.RGBA, s.UNSIGNED_BYTE, ut) : s.texImage2D(_t + Yt, 0, s.RGBA, 1, 1, 0, s.RGBA, s.UNSIGNED_BYTE, ut);
    return xt;
  }
  const et = {};
  et[s.TEXTURE_2D] = X(s.TEXTURE_2D, s.TEXTURE_2D, 1), et[s.TEXTURE_CUBE_MAP] = X(s.TEXTURE_CUBE_MAP, s.TEXTURE_CUBE_MAP_POSITIVE_X, 6), et[s.TEXTURE_2D_ARRAY] = X(s.TEXTURE_2D_ARRAY, s.TEXTURE_2D_ARRAY, 1, 1), et[s.TEXTURE_3D] = X(s.TEXTURE_3D, s.TEXTURE_3D, 1, 1), i.setClear(0, 0, 0, 1), r.setClear(1), a.setClear(0), Mt(s.DEPTH_TEST), r.setFunc(wi), st(false), j(Dl), Mt(s.CULL_FACE), R(Cn);
  function Mt(L) {
    c[L] !== true && (s.enable(L), c[L] = true);
  }
  function ct(L) {
    c[L] !== false && (s.disable(L), c[L] = false);
  }
  function Lt(L, _t) {
    return h[L] !== _t ? (s.bindFramebuffer(L, _t), h[L] = _t, L === s.DRAW_FRAMEBUFFER && (h[s.FRAMEBUFFER] = _t), L === s.FRAMEBUFFER && (h[s.DRAW_FRAMEBUFFER] = _t), true) : false;
  }
  function It(L, _t) {
    let G = d, K = false;
    if (L) {
      G = u.get(_t), G === void 0 && (G = [], u.set(_t, G));
      const ut = L.textures;
      if (G.length !== ut.length || G[0] !== s.COLOR_ATTACHMENT0) {
        for (let xt = 0, Yt = ut.length; xt < Yt; xt++) G[xt] = s.COLOR_ATTACHMENT0 + xt;
        G.length = ut.length, K = true;
      }
    } else G[0] !== s.BACK && (G[0] = s.BACK, K = true);
    K && s.drawBuffers(G);
  }
  function Ot(L) {
    return f !== L ? (s.useProgram(L), f = L, true) : false;
  }
  const Gt = { [Xn]: s.FUNC_ADD, [Fu]: s.FUNC_SUBTRACT, [Ou]: s.FUNC_REVERSE_SUBTRACT };
  Gt[Bu] = s.MIN, Gt[zu] = s.MAX;
  const J = { [ku]: s.ZERO, [Vu]: s.ONE, [Hu]: s.SRC_COLOR, [xa]: s.SRC_ALPHA, [Zu]: s.SRC_ALPHA_SATURATE, [qu]: s.DST_COLOR, [Wu]: s.DST_ALPHA, [Gu]: s.ONE_MINUS_SRC_COLOR, [va]: s.ONE_MINUS_SRC_ALPHA, [Yu]: s.ONE_MINUS_DST_COLOR, [Xu]: s.ONE_MINUS_DST_ALPHA, [Ju]: s.CONSTANT_COLOR, [$u]: s.ONE_MINUS_CONSTANT_COLOR, [Ku]: s.CONSTANT_ALPHA, [Qu]: s.ONE_MINUS_CONSTANT_ALPHA };
  function R(L, _t, G, K, ut, xt, Yt, pe, Fe, jt) {
    if (L === Cn) {
      m === true && (ct(s.BLEND), m = false);
      return;
    }
    if (m === false && (Mt(s.BLEND), m = true), L !== Nu) {
      if (L !== _ || jt !== P) {
        if ((g !== Xn || x !== Xn) && (s.blendEquation(s.FUNC_ADD), g = Xn, x = Xn), jt) switch (L) {
          case yi:
            s.blendFuncSeparate(s.ONE, s.ONE_MINUS_SRC_ALPHA, s.ONE, s.ONE_MINUS_SRC_ALPHA);
            break;
          case Ul:
            s.blendFunc(s.ONE, s.ONE);
            break;
          case Nl:
            s.blendFuncSeparate(s.ZERO, s.ONE_MINUS_SRC_COLOR, s.ZERO, s.ONE);
            break;
          case Fl:
            s.blendFuncSeparate(s.ZERO, s.SRC_COLOR, s.ZERO, s.SRC_ALPHA);
            break;
          default:
            console.error("THREE.WebGLState: Invalid blending: ", L);
            break;
        }
        else switch (L) {
          case yi:
            s.blendFuncSeparate(s.SRC_ALPHA, s.ONE_MINUS_SRC_ALPHA, s.ONE, s.ONE_MINUS_SRC_ALPHA);
            break;
          case Ul:
            s.blendFunc(s.SRC_ALPHA, s.ONE);
            break;
          case Nl:
            s.blendFuncSeparate(s.ZERO, s.ONE_MINUS_SRC_COLOR, s.ZERO, s.ONE);
            break;
          case Fl:
            s.blendFunc(s.ZERO, s.SRC_COLOR);
            break;
          default:
            console.error("THREE.WebGLState: Invalid blending: ", L);
            break;
        }
        p = null, y = null, M = null, I = null, E.set(0, 0, 0), A = 0, _ = L, P = jt;
      }
      return;
    }
    ut = ut || _t, xt = xt || G, Yt = Yt || K, (_t !== g || ut !== x) && (s.blendEquationSeparate(Gt[_t], Gt[ut]), g = _t, x = ut), (G !== p || K !== y || xt !== M || Yt !== I) && (s.blendFuncSeparate(J[G], J[K], J[xt], J[Yt]), p = G, y = K, M = xt, I = Yt), (pe.equals(E) === false || Fe !== A) && (s.blendColor(pe.r, pe.g, pe.b, Fe), E.copy(pe), A = Fe), _ = L, P = false;
  }
  function rt(L, _t) {
    L.side === hn ? ct(s.CULL_FACE) : Mt(s.CULL_FACE);
    let G = L.side === De;
    _t && (G = !G), st(G), L.blending === yi && L.transparent === false ? R(Cn) : R(L.blending, L.blendEquation, L.blendSrc, L.blendDst, L.blendEquationAlpha, L.blendSrcAlpha, L.blendDstAlpha, L.blendColor, L.blendAlpha, L.premultipliedAlpha), r.setFunc(L.depthFunc), r.setTest(L.depthTest), r.setMask(L.depthWrite), i.setMask(L.colorWrite);
    const K = L.stencilWrite;
    a.setTest(K), K && (a.setMask(L.stencilWriteMask), a.setFunc(L.stencilFunc, L.stencilRef, L.stencilFuncMask), a.setOp(L.stencilFail, L.stencilZFail, L.stencilZPass)), Ct(L.polygonOffset, L.polygonOffsetFactor, L.polygonOffsetUnits), L.alphaToCoverage === true ? Mt(s.SAMPLE_ALPHA_TO_COVERAGE) : ct(s.SAMPLE_ALPHA_TO_COVERAGE);
  }
  function st(L) {
    V !== L && (L ? s.frontFace(s.CW) : s.frontFace(s.CCW), V = L);
  }
  function j(L) {
    L !== Lu ? (Mt(s.CULL_FACE), L !== v && (L === Dl ? s.cullFace(s.BACK) : L === Du ? s.cullFace(s.FRONT) : s.cullFace(s.FRONT_AND_BACK))) : ct(s.CULL_FACE), v = L;
  }
  function at(L) {
    L !== b && (Q && s.lineWidth(L), b = L);
  }
  function Ct(L, _t, G) {
    L ? (Mt(s.POLYGON_OFFSET_FILL), (k !== _t || B !== G) && (s.polygonOffset(_t, G), k = _t, B = G)) : ct(s.POLYGON_OFFSET_FILL);
  }
  function gt(L) {
    L ? Mt(s.SCISSOR_TEST) : ct(s.SCISSOR_TEST);
  }
  function T(L) {
    L === void 0 && (L = s.TEXTURE0 + H - 1), W !== L && (s.activeTexture(L), W = L);
  }
  function S(L, _t, G) {
    G === void 0 && (W === null ? G = s.TEXTURE0 + H - 1 : G = W);
    let K = ht[G];
    K === void 0 && (K = { type: void 0, texture: void 0 }, ht[G] = K), (K.type !== L || K.texture !== _t) && (W !== G && (s.activeTexture(G), W = G), s.bindTexture(L, _t || et[L]), K.type = L, K.texture = _t);
  }
  function N() {
    const L = ht[W];
    L !== void 0 && L.type !== void 0 && (s.bindTexture(L.type, null), L.type = void 0, L.texture = void 0);
  }
  function q() {
    try {
      s.compressedTexImage2D.apply(s, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function $() {
    try {
      s.compressedTexImage3D.apply(s, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function Y() {
    try {
      s.texSubImage2D.apply(s, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function Et() {
    try {
      s.texSubImage3D.apply(s, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function lt() {
    try {
      s.compressedTexSubImage2D.apply(s, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function vt() {
    try {
      s.compressedTexSubImage3D.apply(s, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function Xt() {
    try {
      s.texStorage2D.apply(s, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function nt() {
    try {
      s.texStorage3D.apply(s, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function yt() {
    try {
      s.texImage2D.apply(s, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function Nt() {
    try {
      s.texImage3D.apply(s, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function Ft(L) {
    Wt.equals(L) === false && (s.scissor(L.x, L.y, L.z, L.w), Wt.copy(L));
  }
  function St(L) {
    Kt.equals(L) === false && (s.viewport(L.x, L.y, L.z, L.w), Kt.copy(L));
  }
  function qt(L, _t) {
    let G = l.get(_t);
    G === void 0 && (G = /* @__PURE__ */ new WeakMap(), l.set(_t, G));
    let K = G.get(L);
    K === void 0 && (K = s.getUniformBlockIndex(_t, L.name), G.set(L, K));
  }
  function Bt(L, _t) {
    const K = l.get(_t).get(L);
    o.get(_t) !== K && (s.uniformBlockBinding(_t, K, L.__bindingPointIndex), o.set(_t, K));
  }
  function se() {
    s.disable(s.BLEND), s.disable(s.CULL_FACE), s.disable(s.DEPTH_TEST), s.disable(s.POLYGON_OFFSET_FILL), s.disable(s.SCISSOR_TEST), s.disable(s.STENCIL_TEST), s.disable(s.SAMPLE_ALPHA_TO_COVERAGE), s.blendEquation(s.FUNC_ADD), s.blendFunc(s.ONE, s.ZERO), s.blendFuncSeparate(s.ONE, s.ZERO, s.ONE, s.ZERO), s.blendColor(0, 0, 0, 0), s.colorMask(true, true, true, true), s.clearColor(0, 0, 0, 0), s.depthMask(true), s.depthFunc(s.LESS), s.clearDepth(1), s.stencilMask(4294967295), s.stencilFunc(s.ALWAYS, 0, 4294967295), s.stencilOp(s.KEEP, s.KEEP, s.KEEP), s.clearStencil(0), s.cullFace(s.BACK), s.frontFace(s.CCW), s.polygonOffset(0, 0), s.activeTexture(s.TEXTURE0), s.bindFramebuffer(s.FRAMEBUFFER, null), s.bindFramebuffer(s.DRAW_FRAMEBUFFER, null), s.bindFramebuffer(s.READ_FRAMEBUFFER, null), s.useProgram(null), s.lineWidth(1), s.scissor(0, 0, s.canvas.width, s.canvas.height), s.viewport(0, 0, s.canvas.width, s.canvas.height), c = {}, W = null, ht = {}, h = {}, u = /* @__PURE__ */ new WeakMap(), d = [], f = null, m = false, _ = null, g = null, p = null, y = null, x = null, M = null, I = null, E = new ft(0, 0, 0), A = 0, P = false, V = null, v = null, b = null, k = null, B = null, Wt.set(0, 0, s.canvas.width, s.canvas.height), Kt.set(0, 0, s.canvas.width, s.canvas.height), i.reset(), r.reset(), a.reset();
  }
  return { buffers: { color: i, depth: r, stencil: a }, enable: Mt, disable: ct, bindFramebuffer: Lt, drawBuffers: It, useProgram: Ot, setBlending: R, setMaterial: rt, setFlipSided: st, setCullFace: j, setLineWidth: at, setPolygonOffset: Ct, setScissorTest: gt, activeTexture: T, bindTexture: S, unbindTexture: N, compressedTexImage2D: q, compressedTexImage3D: $, texImage2D: yt, texImage3D: Nt, updateUBOMapping: qt, uniformBlockBinding: Bt, texStorage2D: Xt, texStorage3D: nt, texSubImage2D: Y, texSubImage3D: Et, compressedTexSubImage2D: lt, compressedTexSubImage3D: vt, scissor: Ft, viewport: St, reset: se };
}
function qx(s, t) {
  const e = s.image && s.image.width ? s.image.width / s.image.height : 1;
  return e > t ? (s.repeat.x = 1, s.repeat.y = e / t, s.offset.x = 0, s.offset.y = (1 - s.repeat.y) / 2) : (s.repeat.x = t / e, s.repeat.y = 1, s.offset.x = (1 - s.repeat.x) / 2, s.offset.y = 0), s;
}
function Yx(s, t) {
  const e = s.image && s.image.width ? s.image.width / s.image.height : 1;
  return e > t ? (s.repeat.x = t / e, s.repeat.y = 1, s.offset.x = (1 - s.repeat.x) / 2, s.offset.y = 0) : (s.repeat.x = 1, s.repeat.y = e / t, s.offset.x = 0, s.offset.y = (1 - s.repeat.y) / 2), s;
}
function Zx(s) {
  return s.repeat.x = 1, s.repeat.y = 1, s.offset.x = 0, s.offset.y = 0, s;
}
function Hl(s, t, e, n) {
  const i = Jx(n);
  switch (e) {
    case ec:
      return s * t;
    case ic:
      return s * t;
    case sc:
      return s * t * 2;
    case lo:
      return s * t / i.components * i.byteLength;
    case cr:
      return s * t / i.components * i.byteLength;
    case rc:
      return s * t * 2 / i.components * i.byteLength;
    case co:
      return s * t * 2 / i.components * i.byteLength;
    case nc:
      return s * t * 3 / i.components * i.byteLength;
    case Le:
      return s * t * 4 / i.components * i.byteLength;
    case ho:
      return s * t * 4 / i.components * i.byteLength;
    case Ls:
    case Ds:
      return Math.floor((s + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case Us:
    case Ns:
      return Math.floor((s + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case Ca:
    case Pa:
      return Math.max(s, 16) * Math.max(t, 8) / 4;
    case Ta:
    case Ra:
      return Math.max(s, 8) * Math.max(t, 8) / 2;
    case Ia:
    case La:
      return Math.floor((s + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case Da:
      return Math.floor((s + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case Ua:
      return Math.floor((s + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case Na:
      return Math.floor((s + 4) / 5) * Math.floor((t + 3) / 4) * 16;
    case Fa:
      return Math.floor((s + 4) / 5) * Math.floor((t + 4) / 5) * 16;
    case Oa:
      return Math.floor((s + 5) / 6) * Math.floor((t + 4) / 5) * 16;
    case Ba:
      return Math.floor((s + 5) / 6) * Math.floor((t + 5) / 6) * 16;
    case za:
      return Math.floor((s + 7) / 8) * Math.floor((t + 4) / 5) * 16;
    case ka:
      return Math.floor((s + 7) / 8) * Math.floor((t + 5) / 6) * 16;
    case Va:
      return Math.floor((s + 7) / 8) * Math.floor((t + 7) / 8) * 16;
    case Ha:
      return Math.floor((s + 9) / 10) * Math.floor((t + 4) / 5) * 16;
    case Ga:
      return Math.floor((s + 9) / 10) * Math.floor((t + 5) / 6) * 16;
    case Wa:
      return Math.floor((s + 9) / 10) * Math.floor((t + 7) / 8) * 16;
    case Xa:
      return Math.floor((s + 9) / 10) * Math.floor((t + 9) / 10) * 16;
    case qa:
      return Math.floor((s + 11) / 12) * Math.floor((t + 9) / 10) * 16;
    case Ya:
      return Math.floor((s + 11) / 12) * Math.floor((t + 11) / 12) * 16;
    case Fs:
    case Za:
    case Ja:
      return Math.ceil(s / 4) * Math.ceil(t / 4) * 16;
    case ac:
    case $a:
      return Math.ceil(s / 4) * Math.ceil(t / 4) * 8;
    case Ka:
    case Qa:
      return Math.ceil(s / 4) * Math.ceil(t / 4) * 16;
  }
  throw new Error(`Unable to determine texture byte length for ${e} format.`);
}
function Jx(s) {
  switch (s) {
    case mn:
    case Ql:
      return { byteLength: 1, components: 1 };
    case ss:
    case jl:
    case cs:
      return { byteLength: 2, components: 1 };
    case ao:
    case oo:
      return { byteLength: 2, components: 4 };
    case Ln:
    case ro:
    case ke:
      return { byteLength: 4, components: 1 };
    case tc:
      return { byteLength: 4, components: 3 };
  }
  throw new Error(`Unknown texture type ${s}.`);
}
const $x = { contain: qx, cover: Yx, fill: Zx, getByteLength: Hl };
function Kx(s, t, e, n, i, r, a) {
  const o = t.has("WEBGL_multisampled_render_to_texture") ? t.get("WEBGL_multisampled_render_to_texture") : null, l = typeof navigator > "u" ? false : /OculusBrowser/g.test(navigator.userAgent), c = new Z(), h = /* @__PURE__ */ new WeakMap();
  let u;
  const d = /* @__PURE__ */ new WeakMap();
  let f = false;
  try {
    f = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {
  }
  function m(T, S) {
    return f ? new OffscreenCanvas(T, S) : Qs("canvas");
  }
  function _(T, S, N) {
    let q = 1;
    const $ = gt(T);
    if (($.width > N || $.height > N) && (q = N / Math.max($.width, $.height)), q < 1) if (typeof HTMLImageElement < "u" && T instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && T instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && T instanceof ImageBitmap || typeof VideoFrame < "u" && T instanceof VideoFrame) {
      const Y = Math.floor(q * $.width), Et = Math.floor(q * $.height);
      u === void 0 && (u = m(Y, Et));
      const lt = S ? m(Y, Et) : u;
      return lt.width = Y, lt.height = Et, lt.getContext("2d").drawImage(T, 0, 0, Y, Et), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + $.width + "x" + $.height + ") to (" + Y + "x" + Et + ")."), lt;
    } else return "data" in T && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + $.width + "x" + $.height + ")."), T;
    return T;
  }
  function g(T) {
    return T.generateMipmaps && T.minFilter !== Me && T.minFilter !== ge;
  }
  function p(T) {
    s.generateMipmap(T);
  }
  function y(T, S, N, q, $ = false) {
    if (T !== null) {
      if (s[T] !== void 0) return s[T];
      console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + T + "'");
    }
    let Y = S;
    if (S === s.RED && (N === s.FLOAT && (Y = s.R32F), N === s.HALF_FLOAT && (Y = s.R16F), N === s.UNSIGNED_BYTE && (Y = s.R8)), S === s.RED_INTEGER && (N === s.UNSIGNED_BYTE && (Y = s.R8UI), N === s.UNSIGNED_SHORT && (Y = s.R16UI), N === s.UNSIGNED_INT && (Y = s.R32UI), N === s.BYTE && (Y = s.R8I), N === s.SHORT && (Y = s.R16I), N === s.INT && (Y = s.R32I)), S === s.RG && (N === s.FLOAT && (Y = s.RG32F), N === s.HALF_FLOAT && (Y = s.RG16F), N === s.UNSIGNED_BYTE && (Y = s.RG8)), S === s.RG_INTEGER && (N === s.UNSIGNED_BYTE && (Y = s.RG8UI), N === s.UNSIGNED_SHORT && (Y = s.RG16UI), N === s.UNSIGNED_INT && (Y = s.RG32UI), N === s.BYTE && (Y = s.RG8I), N === s.SHORT && (Y = s.RG16I), N === s.INT && (Y = s.RG32I)), S === s.RGB_INTEGER && (N === s.UNSIGNED_BYTE && (Y = s.RGB8UI), N === s.UNSIGNED_SHORT && (Y = s.RGB16UI), N === s.UNSIGNED_INT && (Y = s.RGB32UI), N === s.BYTE && (Y = s.RGB8I), N === s.SHORT && (Y = s.RGB16I), N === s.INT && (Y = s.RGB32I)), S === s.RGBA_INTEGER && (N === s.UNSIGNED_BYTE && (Y = s.RGBA8UI), N === s.UNSIGNED_SHORT && (Y = s.RGBA16UI), N === s.UNSIGNED_INT && (Y = s.RGBA32UI), N === s.BYTE && (Y = s.RGBA8I), N === s.SHORT && (Y = s.RGBA16I), N === s.INT && (Y = s.RGBA32I)), S === s.RGB && N === s.UNSIGNED_INT_5_9_9_9_REV && (Y = s.RGB9_E5), S === s.RGBA) {
      const Et = $ ? Ys : Qt.getTransfer(q);
      N === s.FLOAT && (Y = s.RGBA32F), N === s.HALF_FLOAT && (Y = s.RGBA16F), N === s.UNSIGNED_BYTE && (Y = Et === re ? s.SRGB8_ALPHA8 : s.RGBA8), N === s.UNSIGNED_SHORT_4_4_4_4 && (Y = s.RGBA4), N === s.UNSIGNED_SHORT_5_5_5_1 && (Y = s.RGB5_A1);
    }
    return (Y === s.R16F || Y === s.R32F || Y === s.RG16F || Y === s.RG32F || Y === s.RGBA16F || Y === s.RGBA32F) && t.get("EXT_color_buffer_float"), Y;
  }
  function x(T, S) {
    let N;
    return T ? S === null || S === Ln || S === Ei ? N = s.DEPTH24_STENCIL8 : S === ke ? N = s.DEPTH32F_STENCIL8 : S === ss && (N = s.DEPTH24_STENCIL8, console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : S === null || S === Ln || S === Ei ? N = s.DEPTH_COMPONENT24 : S === ke ? N = s.DEPTH_COMPONENT32F : S === ss && (N = s.DEPTH_COMPONENT16), N;
  }
  function M(T, S) {
    return g(T) === true || T.isFramebufferTexture && T.minFilter !== Me && T.minFilter !== ge ? Math.log2(Math.max(S.width, S.height)) + 1 : T.mipmaps !== void 0 && T.mipmaps.length > 0 ? T.mipmaps.length : T.isCompressedTexture && Array.isArray(T.image) ? S.mipmaps.length : 1;
  }
  function I(T) {
    const S = T.target;
    S.removeEventListener("dispose", I), A(S), S.isVideoTexture && h.delete(S);
  }
  function E(T) {
    const S = T.target;
    S.removeEventListener("dispose", E), V(S);
  }
  function A(T) {
    const S = n.get(T);
    if (S.__webglInit === void 0) return;
    const N = T.source, q = d.get(N);
    if (q) {
      const $ = q[S.__cacheKey];
      $.usedTimes--, $.usedTimes === 0 && P(T), Object.keys(q).length === 0 && d.delete(N);
    }
    n.remove(T);
  }
  function P(T) {
    const S = n.get(T);
    s.deleteTexture(S.__webglTexture);
    const N = T.source, q = d.get(N);
    delete q[S.__cacheKey], a.memory.textures--;
  }
  function V(T) {
    const S = n.get(T);
    if (T.depthTexture && T.depthTexture.dispose(), T.isWebGLCubeRenderTarget) for (let q = 0; q < 6; q++) {
      if (Array.isArray(S.__webglFramebuffer[q])) for (let $ = 0; $ < S.__webglFramebuffer[q].length; $++) s.deleteFramebuffer(S.__webglFramebuffer[q][$]);
      else s.deleteFramebuffer(S.__webglFramebuffer[q]);
      S.__webglDepthbuffer && s.deleteRenderbuffer(S.__webglDepthbuffer[q]);
    }
    else {
      if (Array.isArray(S.__webglFramebuffer)) for (let q = 0; q < S.__webglFramebuffer.length; q++) s.deleteFramebuffer(S.__webglFramebuffer[q]);
      else s.deleteFramebuffer(S.__webglFramebuffer);
      if (S.__webglDepthbuffer && s.deleteRenderbuffer(S.__webglDepthbuffer), S.__webglMultisampledFramebuffer && s.deleteFramebuffer(S.__webglMultisampledFramebuffer), S.__webglColorRenderbuffer) for (let q = 0; q < S.__webglColorRenderbuffer.length; q++) S.__webglColorRenderbuffer[q] && s.deleteRenderbuffer(S.__webglColorRenderbuffer[q]);
      S.__webglDepthRenderbuffer && s.deleteRenderbuffer(S.__webglDepthRenderbuffer);
    }
    const N = T.textures;
    for (let q = 0, $ = N.length; q < $; q++) {
      const Y = n.get(N[q]);
      Y.__webglTexture && (s.deleteTexture(Y.__webglTexture), a.memory.textures--), n.remove(N[q]);
    }
    n.remove(T);
  }
  let v = 0;
  function b() {
    v = 0;
  }
  function k() {
    const T = v;
    return T >= i.maxTextures && console.warn("THREE.WebGLTextures: Trying to use " + T + " texture units while this GPU supports only " + i.maxTextures), v += 1, T;
  }
  function B(T) {
    const S = [];
    return S.push(T.wrapS), S.push(T.wrapT), S.push(T.wrapR || 0), S.push(T.magFilter), S.push(T.minFilter), S.push(T.anisotropy), S.push(T.internalFormat), S.push(T.format), S.push(T.type), S.push(T.generateMipmaps), S.push(T.premultiplyAlpha), S.push(T.flipY), S.push(T.unpackAlignment), S.push(T.colorSpace), S.join();
  }
  function H(T, S) {
    const N = n.get(T);
    if (T.isVideoTexture && at(T), T.isRenderTargetTexture === false && T.version > 0 && N.__version !== T.version) {
      const q = T.image;
      if (q === null) console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
      else if (q.complete === false) console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");
      else {
        Kt(N, T, S);
        return;
      }
    }
    e.bindTexture(s.TEXTURE_2D, N.__webglTexture, s.TEXTURE0 + S);
  }
  function Q(T, S) {
    const N = n.get(T);
    if (T.version > 0 && N.__version !== T.version) {
      Kt(N, T, S);
      return;
    }
    e.bindTexture(s.TEXTURE_2D_ARRAY, N.__webglTexture, s.TEXTURE0 + S);
  }
  function O(T, S) {
    const N = n.get(T);
    if (T.version > 0 && N.__version !== T.version) {
      Kt(N, T, S);
      return;
    }
    e.bindTexture(s.TEXTURE_3D, N.__webglTexture, s.TEXTURE0 + S);
  }
  function tt(T, S) {
    const N = n.get(T);
    if (T.version > 0 && N.__version !== T.version) {
      X(N, T, S);
      return;
    }
    e.bindTexture(s.TEXTURE_CUBE_MAP, N.__webglTexture, s.TEXTURE0 + S);
  }
  const W = { [Gs]: s.REPEAT, [Qe]: s.CLAMP_TO_EDGE, [Ws]: s.MIRRORED_REPEAT }, ht = { [Me]: s.NEAREST, [Kl]: s.NEAREST_MIPMAP_NEAREST, [Ki]: s.NEAREST_MIPMAP_LINEAR, [ge]: s.LINEAR, [Is]: s.LINEAR_MIPMAP_NEAREST, [un]: s.LINEAR_MIPMAP_LINEAR }, pt = { [md]: s.NEVER, [Md]: s.ALWAYS, [gd]: s.LESS, [lc]: s.LEQUAL, [_d]: s.EQUAL, [yd]: s.GEQUAL, [xd]: s.GREATER, [vd]: s.NOTEQUAL };
  function mt(T, S) {
    if (S.type === ke && t.has("OES_texture_float_linear") === false && (S.magFilter === ge || S.magFilter === Is || S.magFilter === Ki || S.magFilter === un || S.minFilter === ge || S.minFilter === Is || S.minFilter === Ki || S.minFilter === un) && console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), s.texParameteri(T, s.TEXTURE_WRAP_S, W[S.wrapS]), s.texParameteri(T, s.TEXTURE_WRAP_T, W[S.wrapT]), (T === s.TEXTURE_3D || T === s.TEXTURE_2D_ARRAY) && s.texParameteri(T, s.TEXTURE_WRAP_R, W[S.wrapR]), s.texParameteri(T, s.TEXTURE_MAG_FILTER, ht[S.magFilter]), s.texParameteri(T, s.TEXTURE_MIN_FILTER, ht[S.minFilter]), S.compareFunction && (s.texParameteri(T, s.TEXTURE_COMPARE_MODE, s.COMPARE_REF_TO_TEXTURE), s.texParameteri(T, s.TEXTURE_COMPARE_FUNC, pt[S.compareFunction])), t.has("EXT_texture_filter_anisotropic") === true) {
      if (S.magFilter === Me || S.minFilter !== Ki && S.minFilter !== un || S.type === ke && t.has("OES_texture_float_linear") === false) return;
      if (S.anisotropy > 1 || n.get(S).__currentAnisotropy) {
        const N = t.get("EXT_texture_filter_anisotropic");
        s.texParameterf(T, N.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(S.anisotropy, i.getMaxAnisotropy())), n.get(S).__currentAnisotropy = S.anisotropy;
      }
    }
  }
  function Wt(T, S) {
    let N = false;
    T.__webglInit === void 0 && (T.__webglInit = true, S.addEventListener("dispose", I));
    const q = S.source;
    let $ = d.get(q);
    $ === void 0 && ($ = {}, d.set(q, $));
    const Y = B(S);
    if (Y !== T.__cacheKey) {
      $[Y] === void 0 && ($[Y] = { texture: s.createTexture(), usedTimes: 0 }, a.memory.textures++, N = true), $[Y].usedTimes++;
      const Et = $[T.__cacheKey];
      Et !== void 0 && ($[T.__cacheKey].usedTimes--, Et.usedTimes === 0 && P(S)), T.__cacheKey = Y, T.__webglTexture = $[Y].texture;
    }
    return N;
  }
  function Kt(T, S, N) {
    let q = s.TEXTURE_2D;
    (S.isDataArrayTexture || S.isCompressedArrayTexture) && (q = s.TEXTURE_2D_ARRAY), S.isData3DTexture && (q = s.TEXTURE_3D);
    const $ = Wt(T, S), Y = S.source;
    e.bindTexture(q, T.__webglTexture, s.TEXTURE0 + N);
    const Et = n.get(Y);
    if (Y.version !== Et.__version || $ === true) {
      e.activeTexture(s.TEXTURE0 + N);
      const lt = Qt.getPrimaries(Qt.workingColorSpace), vt = S.colorSpace === En ? null : Qt.getPrimaries(S.colorSpace), Xt = S.colorSpace === En || lt === vt ? s.NONE : s.BROWSER_DEFAULT_WEBGL;
      s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, S.flipY), s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, S.premultiplyAlpha), s.pixelStorei(s.UNPACK_ALIGNMENT, S.unpackAlignment), s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL, Xt);
      let nt = _(S.image, false, i.maxTextureSize);
      nt = Ct(S, nt);
      const yt = r.convert(S.format, S.colorSpace), Nt = r.convert(S.type);
      let Ft = y(S.internalFormat, yt, Nt, S.colorSpace, S.isVideoTexture);
      mt(q, S);
      let St;
      const qt = S.mipmaps, Bt = S.isVideoTexture !== true, se = Et.__version === void 0 || $ === true, L = Y.dataReady, _t = M(S, nt);
      if (S.isDepthTexture) Ft = x(S.format === Ai, S.type), se && (Bt ? e.texStorage2D(s.TEXTURE_2D, 1, Ft, nt.width, nt.height) : e.texImage2D(s.TEXTURE_2D, 0, Ft, nt.width, nt.height, 0, yt, Nt, null));
      else if (S.isDataTexture) if (qt.length > 0) {
        Bt && se && e.texStorage2D(s.TEXTURE_2D, _t, Ft, qt[0].width, qt[0].height);
        for (let G = 0, K = qt.length; G < K; G++) St = qt[G], Bt ? L && e.texSubImage2D(s.TEXTURE_2D, G, 0, 0, St.width, St.height, yt, Nt, St.data) : e.texImage2D(s.TEXTURE_2D, G, Ft, St.width, St.height, 0, yt, Nt, St.data);
        S.generateMipmaps = false;
      } else Bt ? (se && e.texStorage2D(s.TEXTURE_2D, _t, Ft, nt.width, nt.height), L && e.texSubImage2D(s.TEXTURE_2D, 0, 0, 0, nt.width, nt.height, yt, Nt, nt.data)) : e.texImage2D(s.TEXTURE_2D, 0, Ft, nt.width, nt.height, 0, yt, Nt, nt.data);
      else if (S.isCompressedTexture) if (S.isCompressedArrayTexture) {
        Bt && se && e.texStorage3D(s.TEXTURE_2D_ARRAY, _t, Ft, qt[0].width, qt[0].height, nt.depth);
        for (let G = 0, K = qt.length; G < K; G++) if (St = qt[G], S.format !== Le) if (yt !== null) if (Bt) {
          if (L) if (S.layerUpdates.size > 0) {
            const ut = Hl(St.width, St.height, S.format, S.type);
            for (const xt of S.layerUpdates) {
              const Yt = St.data.subarray(xt * ut / St.data.BYTES_PER_ELEMENT, (xt + 1) * ut / St.data.BYTES_PER_ELEMENT);
              e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY, G, 0, 0, xt, St.width, St.height, 1, yt, Yt, 0, 0);
            }
            S.clearLayerUpdates();
          } else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY, G, 0, 0, 0, St.width, St.height, nt.depth, yt, St.data, 0, 0);
        } else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY, G, Ft, St.width, St.height, nt.depth, 0, St.data, 0, 0);
        else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
        else Bt ? L && e.texSubImage3D(s.TEXTURE_2D_ARRAY, G, 0, 0, 0, St.width, St.height, nt.depth, yt, Nt, St.data) : e.texImage3D(s.TEXTURE_2D_ARRAY, G, Ft, St.width, St.height, nt.depth, 0, yt, Nt, St.data);
      } else {
        Bt && se && e.texStorage2D(s.TEXTURE_2D, _t, Ft, qt[0].width, qt[0].height);
        for (let G = 0, K = qt.length; G < K; G++) St = qt[G], S.format !== Le ? yt !== null ? Bt ? L && e.compressedTexSubImage2D(s.TEXTURE_2D, G, 0, 0, St.width, St.height, yt, St.data) : e.compressedTexImage2D(s.TEXTURE_2D, G, Ft, St.width, St.height, 0, St.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : Bt ? L && e.texSubImage2D(s.TEXTURE_2D, G, 0, 0, St.width, St.height, yt, Nt, St.data) : e.texImage2D(s.TEXTURE_2D, G, Ft, St.width, St.height, 0, yt, Nt, St.data);
      }
      else if (S.isDataArrayTexture) if (Bt) {
        if (se && e.texStorage3D(s.TEXTURE_2D_ARRAY, _t, Ft, nt.width, nt.height, nt.depth), L) if (S.layerUpdates.size > 0) {
          const G = Hl(nt.width, nt.height, S.format, S.type);
          for (const K of S.layerUpdates) {
            const ut = nt.data.subarray(K * G / nt.data.BYTES_PER_ELEMENT, (K + 1) * G / nt.data.BYTES_PER_ELEMENT);
            e.texSubImage3D(s.TEXTURE_2D_ARRAY, 0, 0, 0, K, nt.width, nt.height, 1, yt, Nt, ut);
          }
          S.clearLayerUpdates();
        } else e.texSubImage3D(s.TEXTURE_2D_ARRAY, 0, 0, 0, 0, nt.width, nt.height, nt.depth, yt, Nt, nt.data);
      } else e.texImage3D(s.TEXTURE_2D_ARRAY, 0, Ft, nt.width, nt.height, nt.depth, 0, yt, Nt, nt.data);
      else if (S.isData3DTexture) Bt ? (se && e.texStorage3D(s.TEXTURE_3D, _t, Ft, nt.width, nt.height, nt.depth), L && e.texSubImage3D(s.TEXTURE_3D, 0, 0, 0, 0, nt.width, nt.height, nt.depth, yt, Nt, nt.data)) : e.texImage3D(s.TEXTURE_3D, 0, Ft, nt.width, nt.height, nt.depth, 0, yt, Nt, nt.data);
      else if (S.isFramebufferTexture) {
        if (se) if (Bt) e.texStorage2D(s.TEXTURE_2D, _t, Ft, nt.width, nt.height);
        else {
          let G = nt.width, K = nt.height;
          for (let ut = 0; ut < _t; ut++) e.texImage2D(s.TEXTURE_2D, ut, Ft, G, K, 0, yt, Nt, null), G >>= 1, K >>= 1;
        }
      } else if (qt.length > 0) {
        if (Bt && se) {
          const G = gt(qt[0]);
          e.texStorage2D(s.TEXTURE_2D, _t, Ft, G.width, G.height);
        }
        for (let G = 0, K = qt.length; G < K; G++) St = qt[G], Bt ? L && e.texSubImage2D(s.TEXTURE_2D, G, 0, 0, yt, Nt, St) : e.texImage2D(s.TEXTURE_2D, G, Ft, yt, Nt, St);
        S.generateMipmaps = false;
      } else if (Bt) {
        if (se) {
          const G = gt(nt);
          e.texStorage2D(s.TEXTURE_2D, _t, Ft, G.width, G.height);
        }
        L && e.texSubImage2D(s.TEXTURE_2D, 0, 0, 0, yt, Nt, nt);
      } else e.texImage2D(s.TEXTURE_2D, 0, Ft, yt, Nt, nt);
      g(S) && p(q), Et.__version = Y.version, S.onUpdate && S.onUpdate(S);
    }
    T.__version = S.version;
  }
  function X(T, S, N) {
    if (S.image.length !== 6) return;
    const q = Wt(T, S), $ = S.source;
    e.bindTexture(s.TEXTURE_CUBE_MAP, T.__webglTexture, s.TEXTURE0 + N);
    const Y = n.get($);
    if ($.version !== Y.__version || q === true) {
      e.activeTexture(s.TEXTURE0 + N);
      const Et = Qt.getPrimaries(Qt.workingColorSpace), lt = S.colorSpace === En ? null : Qt.getPrimaries(S.colorSpace), vt = S.colorSpace === En || Et === lt ? s.NONE : s.BROWSER_DEFAULT_WEBGL;
      s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, S.flipY), s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, S.premultiplyAlpha), s.pixelStorei(s.UNPACK_ALIGNMENT, S.unpackAlignment), s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL, vt);
      const Xt = S.isCompressedTexture || S.image[0].isCompressedTexture, nt = S.image[0] && S.image[0].isDataTexture, yt = [];
      for (let K = 0; K < 6; K++) !Xt && !nt ? yt[K] = _(S.image[K], true, i.maxCubemapSize) : yt[K] = nt ? S.image[K].image : S.image[K], yt[K] = Ct(S, yt[K]);
      const Nt = yt[0], Ft = r.convert(S.format, S.colorSpace), St = r.convert(S.type), qt = y(S.internalFormat, Ft, St, S.colorSpace), Bt = S.isVideoTexture !== true, se = Y.__version === void 0 || q === true, L = $.dataReady;
      let _t = M(S, Nt);
      mt(s.TEXTURE_CUBE_MAP, S);
      let G;
      if (Xt) {
        Bt && se && e.texStorage2D(s.TEXTURE_CUBE_MAP, _t, qt, Nt.width, Nt.height);
        for (let K = 0; K < 6; K++) {
          G = yt[K].mipmaps;
          for (let ut = 0; ut < G.length; ut++) {
            const xt = G[ut];
            S.format !== Le ? Ft !== null ? Bt ? L && e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + K, ut, 0, 0, xt.width, xt.height, Ft, xt.data) : e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + K, ut, qt, xt.width, xt.height, 0, xt.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : Bt ? L && e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + K, ut, 0, 0, xt.width, xt.height, Ft, St, xt.data) : e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + K, ut, qt, xt.width, xt.height, 0, Ft, St, xt.data);
          }
        }
      } else {
        if (G = S.mipmaps, Bt && se) {
          G.length > 0 && _t++;
          const K = gt(yt[0]);
          e.texStorage2D(s.TEXTURE_CUBE_MAP, _t, qt, K.width, K.height);
        }
        for (let K = 0; K < 6; K++) if (nt) {
          Bt ? L && e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + K, 0, 0, 0, yt[K].width, yt[K].height, Ft, St, yt[K].data) : e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + K, 0, qt, yt[K].width, yt[K].height, 0, Ft, St, yt[K].data);
          for (let ut = 0; ut < G.length; ut++) {
            const Yt = G[ut].image[K].image;
            Bt ? L && e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + K, ut + 1, 0, 0, Yt.width, Yt.height, Ft, St, Yt.data) : e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + K, ut + 1, qt, Yt.width, Yt.height, 0, Ft, St, Yt.data);
          }
        } else {
          Bt ? L && e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + K, 0, 0, 0, Ft, St, yt[K]) : e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + K, 0, qt, Ft, St, yt[K]);
          for (let ut = 0; ut < G.length; ut++) {
            const xt = G[ut];
            Bt ? L && e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + K, ut + 1, 0, 0, Ft, St, xt.image[K]) : e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + K, ut + 1, qt, Ft, St, xt.image[K]);
          }
        }
      }
      g(S) && p(s.TEXTURE_CUBE_MAP), Y.__version = $.version, S.onUpdate && S.onUpdate(S);
    }
    T.__version = S.version;
  }
  function et(T, S, N, q, $, Y) {
    const Et = r.convert(N.format, N.colorSpace), lt = r.convert(N.type), vt = y(N.internalFormat, Et, lt, N.colorSpace);
    if (!n.get(S).__hasExternalTextures) {
      const nt = Math.max(1, S.width >> Y), yt = Math.max(1, S.height >> Y);
      $ === s.TEXTURE_3D || $ === s.TEXTURE_2D_ARRAY ? e.texImage3D($, Y, vt, nt, yt, S.depth, 0, Et, lt, null) : e.texImage2D($, Y, vt, nt, yt, 0, Et, lt, null);
    }
    e.bindFramebuffer(s.FRAMEBUFFER, T), j(S) ? o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER, q, $, n.get(N).__webglTexture, 0, st(S)) : ($ === s.TEXTURE_2D || $ >= s.TEXTURE_CUBE_MAP_POSITIVE_X && $ <= s.TEXTURE_CUBE_MAP_NEGATIVE_Z) && s.framebufferTexture2D(s.FRAMEBUFFER, q, $, n.get(N).__webglTexture, Y), e.bindFramebuffer(s.FRAMEBUFFER, null);
  }
  function Mt(T, S, N) {
    if (s.bindRenderbuffer(s.RENDERBUFFER, T), S.depthBuffer) {
      const q = S.depthTexture, $ = q && q.isDepthTexture ? q.type : null, Y = x(S.stencilBuffer, $), Et = S.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT, lt = st(S);
      j(S) ? o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER, lt, Y, S.width, S.height) : N ? s.renderbufferStorageMultisample(s.RENDERBUFFER, lt, Y, S.width, S.height) : s.renderbufferStorage(s.RENDERBUFFER, Y, S.width, S.height), s.framebufferRenderbuffer(s.FRAMEBUFFER, Et, s.RENDERBUFFER, T);
    } else {
      const q = S.textures;
      for (let $ = 0; $ < q.length; $++) {
        const Y = q[$], Et = r.convert(Y.format, Y.colorSpace), lt = r.convert(Y.type), vt = y(Y.internalFormat, Et, lt, Y.colorSpace), Xt = st(S);
        N && j(S) === false ? s.renderbufferStorageMultisample(s.RENDERBUFFER, Xt, vt, S.width, S.height) : j(S) ? o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER, Xt, vt, S.width, S.height) : s.renderbufferStorage(s.RENDERBUFFER, vt, S.width, S.height);
      }
    }
    s.bindRenderbuffer(s.RENDERBUFFER, null);
  }
  function ct(T, S) {
    if (S && S.isWebGLCubeRenderTarget) throw new Error("Depth Texture with cube render targets is not supported");
    if (e.bindFramebuffer(s.FRAMEBUFFER, T), !(S.depthTexture && S.depthTexture.isDepthTexture)) throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
    (!n.get(S.depthTexture).__webglTexture || S.depthTexture.image.width !== S.width || S.depthTexture.image.height !== S.height) && (S.depthTexture.image.width = S.width, S.depthTexture.image.height = S.height, S.depthTexture.needsUpdate = true), H(S.depthTexture, 0);
    const q = n.get(S.depthTexture).__webglTexture, $ = st(S);
    if (S.depthTexture.format === Mi) j(S) ? o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER, s.DEPTH_ATTACHMENT, s.TEXTURE_2D, q, 0, $) : s.framebufferTexture2D(s.FRAMEBUFFER, s.DEPTH_ATTACHMENT, s.TEXTURE_2D, q, 0);
    else if (S.depthTexture.format === Ai) j(S) ? o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER, s.DEPTH_STENCIL_ATTACHMENT, s.TEXTURE_2D, q, 0, $) : s.framebufferTexture2D(s.FRAMEBUFFER, s.DEPTH_STENCIL_ATTACHMENT, s.TEXTURE_2D, q, 0);
    else throw new Error("Unknown depthTexture format");
  }
  function Lt(T) {
    const S = n.get(T), N = T.isWebGLCubeRenderTarget === true;
    if (S.__boundDepthTexture !== T.depthTexture) {
      const q = T.depthTexture;
      if (S.__depthDisposeCallback && S.__depthDisposeCallback(), q) {
        const $ = () => {
          delete S.__boundDepthTexture, delete S.__depthDisposeCallback, q.removeEventListener("dispose", $);
        };
        q.addEventListener("dispose", $), S.__depthDisposeCallback = $;
      }
      S.__boundDepthTexture = q;
    }
    if (T.depthTexture && !S.__autoAllocateDepthBuffer) {
      if (N) throw new Error("target.depthTexture not supported in Cube render targets");
      ct(S.__webglFramebuffer, T);
    } else if (N) {
      S.__webglDepthbuffer = [];
      for (let q = 0; q < 6; q++) if (e.bindFramebuffer(s.FRAMEBUFFER, S.__webglFramebuffer[q]), S.__webglDepthbuffer[q] === void 0) S.__webglDepthbuffer[q] = s.createRenderbuffer(), Mt(S.__webglDepthbuffer[q], T, false);
      else {
        const $ = T.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT, Y = S.__webglDepthbuffer[q];
        s.bindRenderbuffer(s.RENDERBUFFER, Y), s.framebufferRenderbuffer(s.FRAMEBUFFER, $, s.RENDERBUFFER, Y);
      }
    } else if (e.bindFramebuffer(s.FRAMEBUFFER, S.__webglFramebuffer), S.__webglDepthbuffer === void 0) S.__webglDepthbuffer = s.createRenderbuffer(), Mt(S.__webglDepthbuffer, T, false);
    else {
      const q = T.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT, $ = S.__webglDepthbuffer;
      s.bindRenderbuffer(s.RENDERBUFFER, $), s.framebufferRenderbuffer(s.FRAMEBUFFER, q, s.RENDERBUFFER, $);
    }
    e.bindFramebuffer(s.FRAMEBUFFER, null);
  }
  function It(T, S, N) {
    const q = n.get(T);
    S !== void 0 && et(q.__webglFramebuffer, T, T.texture, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, 0), N !== void 0 && Lt(T);
  }
  function Ot(T) {
    const S = T.texture, N = n.get(T), q = n.get(S);
    T.addEventListener("dispose", E);
    const $ = T.textures, Y = T.isWebGLCubeRenderTarget === true, Et = $.length > 1;
    if (Et || (q.__webglTexture === void 0 && (q.__webglTexture = s.createTexture()), q.__version = S.version, a.memory.textures++), Y) {
      N.__webglFramebuffer = [];
      for (let lt = 0; lt < 6; lt++) if (S.mipmaps && S.mipmaps.length > 0) {
        N.__webglFramebuffer[lt] = [];
        for (let vt = 0; vt < S.mipmaps.length; vt++) N.__webglFramebuffer[lt][vt] = s.createFramebuffer();
      } else N.__webglFramebuffer[lt] = s.createFramebuffer();
    } else {
      if (S.mipmaps && S.mipmaps.length > 0) {
        N.__webglFramebuffer = [];
        for (let lt = 0; lt < S.mipmaps.length; lt++) N.__webglFramebuffer[lt] = s.createFramebuffer();
      } else N.__webglFramebuffer = s.createFramebuffer();
      if (Et) for (let lt = 0, vt = $.length; lt < vt; lt++) {
        const Xt = n.get($[lt]);
        Xt.__webglTexture === void 0 && (Xt.__webglTexture = s.createTexture(), a.memory.textures++);
      }
      if (T.samples > 0 && j(T) === false) {
        N.__webglMultisampledFramebuffer = s.createFramebuffer(), N.__webglColorRenderbuffer = [], e.bindFramebuffer(s.FRAMEBUFFER, N.__webglMultisampledFramebuffer);
        for (let lt = 0; lt < $.length; lt++) {
          const vt = $[lt];
          N.__webglColorRenderbuffer[lt] = s.createRenderbuffer(), s.bindRenderbuffer(s.RENDERBUFFER, N.__webglColorRenderbuffer[lt]);
          const Xt = r.convert(vt.format, vt.colorSpace), nt = r.convert(vt.type), yt = y(vt.internalFormat, Xt, nt, vt.colorSpace, T.isXRRenderTarget === true), Nt = st(T);
          s.renderbufferStorageMultisample(s.RENDERBUFFER, Nt, yt, T.width, T.height), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0 + lt, s.RENDERBUFFER, N.__webglColorRenderbuffer[lt]);
        }
        s.bindRenderbuffer(s.RENDERBUFFER, null), T.depthBuffer && (N.__webglDepthRenderbuffer = s.createRenderbuffer(), Mt(N.__webglDepthRenderbuffer, T, true)), e.bindFramebuffer(s.FRAMEBUFFER, null);
      }
    }
    if (Y) {
      e.bindTexture(s.TEXTURE_CUBE_MAP, q.__webglTexture), mt(s.TEXTURE_CUBE_MAP, S);
      for (let lt = 0; lt < 6; lt++) if (S.mipmaps && S.mipmaps.length > 0) for (let vt = 0; vt < S.mipmaps.length; vt++) et(N.__webglFramebuffer[lt][vt], T, S, s.COLOR_ATTACHMENT0, s.TEXTURE_CUBE_MAP_POSITIVE_X + lt, vt);
      else et(N.__webglFramebuffer[lt], T, S, s.COLOR_ATTACHMENT0, s.TEXTURE_CUBE_MAP_POSITIVE_X + lt, 0);
      g(S) && p(s.TEXTURE_CUBE_MAP), e.unbindTexture();
    } else if (Et) {
      for (let lt = 0, vt = $.length; lt < vt; lt++) {
        const Xt = $[lt], nt = n.get(Xt);
        e.bindTexture(s.TEXTURE_2D, nt.__webglTexture), mt(s.TEXTURE_2D, Xt), et(N.__webglFramebuffer, T, Xt, s.COLOR_ATTACHMENT0 + lt, s.TEXTURE_2D, 0), g(Xt) && p(s.TEXTURE_2D);
      }
      e.unbindTexture();
    } else {
      let lt = s.TEXTURE_2D;
      if ((T.isWebGL3DRenderTarget || T.isWebGLArrayRenderTarget) && (lt = T.isWebGL3DRenderTarget ? s.TEXTURE_3D : s.TEXTURE_2D_ARRAY), e.bindTexture(lt, q.__webglTexture), mt(lt, S), S.mipmaps && S.mipmaps.length > 0) for (let vt = 0; vt < S.mipmaps.length; vt++) et(N.__webglFramebuffer[vt], T, S, s.COLOR_ATTACHMENT0, lt, vt);
      else et(N.__webglFramebuffer, T, S, s.COLOR_ATTACHMENT0, lt, 0);
      g(S) && p(lt), e.unbindTexture();
    }
    T.depthBuffer && Lt(T);
  }
  function Gt(T) {
    const S = T.textures;
    for (let N = 0, q = S.length; N < q; N++) {
      const $ = S[N];
      if (g($)) {
        const Y = T.isWebGLCubeRenderTarget ? s.TEXTURE_CUBE_MAP : s.TEXTURE_2D, Et = n.get($).__webglTexture;
        e.bindTexture(Y, Et), p(Y), e.unbindTexture();
      }
    }
  }
  const J = [], R = [];
  function rt(T) {
    if (T.samples > 0) {
      if (j(T) === false) {
        const S = T.textures, N = T.width, q = T.height;
        let $ = s.COLOR_BUFFER_BIT;
        const Y = T.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT, Et = n.get(T), lt = S.length > 1;
        if (lt) for (let vt = 0; vt < S.length; vt++) e.bindFramebuffer(s.FRAMEBUFFER, Et.__webglMultisampledFramebuffer), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0 + vt, s.RENDERBUFFER, null), e.bindFramebuffer(s.FRAMEBUFFER, Et.__webglFramebuffer), s.framebufferTexture2D(s.DRAW_FRAMEBUFFER, s.COLOR_ATTACHMENT0 + vt, s.TEXTURE_2D, null, 0);
        e.bindFramebuffer(s.READ_FRAMEBUFFER, Et.__webglMultisampledFramebuffer), e.bindFramebuffer(s.DRAW_FRAMEBUFFER, Et.__webglFramebuffer);
        for (let vt = 0; vt < S.length; vt++) {
          if (T.resolveDepthBuffer && (T.depthBuffer && ($ |= s.DEPTH_BUFFER_BIT), T.stencilBuffer && T.resolveStencilBuffer && ($ |= s.STENCIL_BUFFER_BIT)), lt) {
            s.framebufferRenderbuffer(s.READ_FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.RENDERBUFFER, Et.__webglColorRenderbuffer[vt]);
            const Xt = n.get(S[vt]).__webglTexture;
            s.framebufferTexture2D(s.DRAW_FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, Xt, 0);
          }
          s.blitFramebuffer(0, 0, N, q, 0, 0, N, q, $, s.NEAREST), l === true && (J.length = 0, R.length = 0, J.push(s.COLOR_ATTACHMENT0 + vt), T.depthBuffer && T.resolveDepthBuffer === false && (J.push(Y), R.push(Y), s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER, R)), s.invalidateFramebuffer(s.READ_FRAMEBUFFER, J));
        }
        if (e.bindFramebuffer(s.READ_FRAMEBUFFER, null), e.bindFramebuffer(s.DRAW_FRAMEBUFFER, null), lt) for (let vt = 0; vt < S.length; vt++) {
          e.bindFramebuffer(s.FRAMEBUFFER, Et.__webglMultisampledFramebuffer), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0 + vt, s.RENDERBUFFER, Et.__webglColorRenderbuffer[vt]);
          const Xt = n.get(S[vt]).__webglTexture;
          e.bindFramebuffer(s.FRAMEBUFFER, Et.__webglFramebuffer), s.framebufferTexture2D(s.DRAW_FRAMEBUFFER, s.COLOR_ATTACHMENT0 + vt, s.TEXTURE_2D, Xt, 0);
        }
        e.bindFramebuffer(s.DRAW_FRAMEBUFFER, Et.__webglMultisampledFramebuffer);
      } else if (T.depthBuffer && T.resolveDepthBuffer === false && l) {
        const S = T.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT;
        s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER, [S]);
      }
    }
  }
  function st(T) {
    return Math.min(i.maxSamples, T.samples);
  }
  function j(T) {
    const S = n.get(T);
    return T.samples > 0 && t.has("WEBGL_multisampled_render_to_texture") === true && S.__useRenderToTexture !== false;
  }
  function at(T) {
    const S = a.render.frame;
    h.get(T) !== S && (h.set(T, S), T.update());
  }
  function Ct(T, S) {
    const N = T.colorSpace, q = T.format, $ = T.type;
    return T.isCompressedTexture === true || T.isVideoTexture === true || N !== Un && N !== En && (Qt.getTransfer(N) === re ? (q !== Le || $ !== mn) && console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", N)), S;
  }
  function gt(T) {
    return typeof HTMLImageElement < "u" && T instanceof HTMLImageElement ? (c.width = T.naturalWidth || T.width, c.height = T.naturalHeight || T.height) : typeof VideoFrame < "u" && T instanceof VideoFrame ? (c.width = T.displayWidth, c.height = T.displayHeight) : (c.width = T.width, c.height = T.height), c;
  }
  this.allocateTextureUnit = k, this.resetTextureUnits = b, this.setTexture2D = H, this.setTexture2DArray = Q, this.setTexture3D = O, this.setTextureCube = tt, this.rebindTextures = It, this.setupRenderTarget = Ot, this.updateRenderTargetMipmap = Gt, this.updateMultisampleRenderTarget = rt, this.setupDepthRenderbuffer = Lt, this.setupFrameBufferTexture = et, this.useMultisampledRTT = j;
}
function Fd(s, t) {
  function e(n, i = En) {
    let r;
    const a = Qt.getTransfer(i);
    if (n === mn) return s.UNSIGNED_BYTE;
    if (n === ao) return s.UNSIGNED_SHORT_4_4_4_4;
    if (n === oo) return s.UNSIGNED_SHORT_5_5_5_1;
    if (n === tc) return s.UNSIGNED_INT_5_9_9_9_REV;
    if (n === Ql) return s.BYTE;
    if (n === jl) return s.SHORT;
    if (n === ss) return s.UNSIGNED_SHORT;
    if (n === ro) return s.INT;
    if (n === Ln) return s.UNSIGNED_INT;
    if (n === ke) return s.FLOAT;
    if (n === cs) return s.HALF_FLOAT;
    if (n === ec) return s.ALPHA;
    if (n === nc) return s.RGB;
    if (n === Le) return s.RGBA;
    if (n === ic) return s.LUMINANCE;
    if (n === sc) return s.LUMINANCE_ALPHA;
    if (n === Mi) return s.DEPTH_COMPONENT;
    if (n === Ai) return s.DEPTH_STENCIL;
    if (n === lo) return s.RED;
    if (n === cr) return s.RED_INTEGER;
    if (n === rc) return s.RG;
    if (n === co) return s.RG_INTEGER;
    if (n === ho) return s.RGBA_INTEGER;
    if (n === Ls || n === Ds || n === Us || n === Ns) if (a === re) if (r = t.get("WEBGL_compressed_texture_s3tc_srgb"), r !== null) {
      if (n === Ls) return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;
      if (n === Ds) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
      if (n === Us) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
      if (n === Ns) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
    } else return null;
    else if (r = t.get("WEBGL_compressed_texture_s3tc"), r !== null) {
      if (n === Ls) return r.COMPRESSED_RGB_S3TC_DXT1_EXT;
      if (n === Ds) return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;
      if (n === Us) return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;
      if (n === Ns) return r.COMPRESSED_RGBA_S3TC_DXT5_EXT;
    } else return null;
    if (n === Ta || n === Ca || n === Ra || n === Pa) if (r = t.get("WEBGL_compressed_texture_pvrtc"), r !== null) {
      if (n === Ta) return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
      if (n === Ca) return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
      if (n === Ra) return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
      if (n === Pa) return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
    } else return null;
    if (n === Ia || n === La || n === Da) if (r = t.get("WEBGL_compressed_texture_etc"), r !== null) {
      if (n === Ia || n === La) return a === re ? r.COMPRESSED_SRGB8_ETC2 : r.COMPRESSED_RGB8_ETC2;
      if (n === Da) return a === re ? r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : r.COMPRESSED_RGBA8_ETC2_EAC;
    } else return null;
    if (n === Ua || n === Na || n === Fa || n === Oa || n === Ba || n === za || n === ka || n === Va || n === Ha || n === Ga || n === Wa || n === Xa || n === qa || n === Ya) if (r = t.get("WEBGL_compressed_texture_astc"), r !== null) {
      if (n === Ua) return a === re ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : r.COMPRESSED_RGBA_ASTC_4x4_KHR;
      if (n === Na) return a === re ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : r.COMPRESSED_RGBA_ASTC_5x4_KHR;
      if (n === Fa) return a === re ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : r.COMPRESSED_RGBA_ASTC_5x5_KHR;
      if (n === Oa) return a === re ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : r.COMPRESSED_RGBA_ASTC_6x5_KHR;
      if (n === Ba) return a === re ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : r.COMPRESSED_RGBA_ASTC_6x6_KHR;
      if (n === za) return a === re ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : r.COMPRESSED_RGBA_ASTC_8x5_KHR;
      if (n === ka) return a === re ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : r.COMPRESSED_RGBA_ASTC_8x6_KHR;
      if (n === Va) return a === re ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : r.COMPRESSED_RGBA_ASTC_8x8_KHR;
      if (n === Ha) return a === re ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : r.COMPRESSED_RGBA_ASTC_10x5_KHR;
      if (n === Ga) return a === re ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : r.COMPRESSED_RGBA_ASTC_10x6_KHR;
      if (n === Wa) return a === re ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : r.COMPRESSED_RGBA_ASTC_10x8_KHR;
      if (n === Xa) return a === re ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : r.COMPRESSED_RGBA_ASTC_10x10_KHR;
      if (n === qa) return a === re ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : r.COMPRESSED_RGBA_ASTC_12x10_KHR;
      if (n === Ya) return a === re ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : r.COMPRESSED_RGBA_ASTC_12x12_KHR;
    } else return null;
    if (n === Fs || n === Za || n === Ja) if (r = t.get("EXT_texture_compression_bptc"), r !== null) {
      if (n === Fs) return a === re ? r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : r.COMPRESSED_RGBA_BPTC_UNORM_EXT;
      if (n === Za) return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
      if (n === Ja) return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
    } else return null;
    if (n === ac || n === $a || n === Ka || n === Qa) if (r = t.get("EXT_texture_compression_rgtc"), r !== null) {
      if (n === Fs) return r.COMPRESSED_RED_RGTC1_EXT;
      if (n === $a) return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;
      if (n === Ka) return r.COMPRESSED_RED_GREEN_RGTC2_EXT;
      if (n === Qa) return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
    } else return null;
    return n === Ei ? s.UNSIGNED_INT_24_8 : s[n] !== void 0 ? s[n] : null;
  }
  return { convert: e };
}
class Od extends be {
  constructor(t = []) {
    super(), this.isArrayCamera = true, this.cameras = t;
  }
}
class ts extends $t {
  constructor() {
    super(), this.isGroup = true, this.type = "Group";
  }
}
const Qx = { type: "move" };
class gl {
  constructor() {
    this._targetRay = null, this._grip = null, this._hand = null;
  }
  getHandSpace() {
    return this._hand === null && (this._hand = new ts(), this._hand.matrixAutoUpdate = false, this._hand.visible = false, this._hand.joints = {}, this._hand.inputState = { pinching: false }), this._hand;
  }
  getTargetRaySpace() {
    return this._targetRay === null && (this._targetRay = new ts(), this._targetRay.matrixAutoUpdate = false, this._targetRay.visible = false, this._targetRay.hasLinearVelocity = false, this._targetRay.linearVelocity = new C(), this._targetRay.hasAngularVelocity = false, this._targetRay.angularVelocity = new C()), this._targetRay;
  }
  getGripSpace() {
    return this._grip === null && (this._grip = new ts(), this._grip.matrixAutoUpdate = false, this._grip.visible = false, this._grip.hasLinearVelocity = false, this._grip.linearVelocity = new C(), this._grip.hasAngularVelocity = false, this._grip.angularVelocity = new C()), this._grip;
  }
  dispatchEvent(t) {
    return this._targetRay !== null && this._targetRay.dispatchEvent(t), this._grip !== null && this._grip.dispatchEvent(t), this._hand !== null && this._hand.dispatchEvent(t), this;
  }
  connect(t) {
    if (t && t.hand) {
      const e = this._hand;
      if (e) for (const n of t.hand.values()) this._getHandJoint(e, n);
    }
    return this.dispatchEvent({ type: "connected", data: t }), this;
  }
  disconnect(t) {
    return this.dispatchEvent({ type: "disconnected", data: t }), this._targetRay !== null && (this._targetRay.visible = false), this._grip !== null && (this._grip.visible = false), this._hand !== null && (this._hand.visible = false), this;
  }
  update(t, e, n) {
    let i = null, r = null, a = null;
    const o = this._targetRay, l = this._grip, c = this._hand;
    if (t && e.session.visibilityState !== "visible-blurred") {
      if (c && t.hand) {
        a = true;
        for (const _ of t.hand.values()) {
          const g = e.getJointPose(_, n), p = this._getHandJoint(c, _);
          g !== null && (p.matrix.fromArray(g.transform.matrix), p.matrix.decompose(p.position, p.rotation, p.scale), p.matrixWorldNeedsUpdate = true, p.jointRadius = g.radius), p.visible = g !== null;
        }
        const h = c.joints["index-finger-tip"], u = c.joints["thumb-tip"], d = h.position.distanceTo(u.position), f = 0.02, m = 5e-3;
        c.inputState.pinching && d > f + m ? (c.inputState.pinching = false, this.dispatchEvent({ type: "pinchend", handedness: t.handedness, target: this })) : !c.inputState.pinching && d <= f - m && (c.inputState.pinching = true, this.dispatchEvent({ type: "pinchstart", handedness: t.handedness, target: this }));
      } else l !== null && t.gripSpace && (r = e.getPose(t.gripSpace, n), r !== null && (l.matrix.fromArray(r.transform.matrix), l.matrix.decompose(l.position, l.rotation, l.scale), l.matrixWorldNeedsUpdate = true, r.linearVelocity ? (l.hasLinearVelocity = true, l.linearVelocity.copy(r.linearVelocity)) : l.hasLinearVelocity = false, r.angularVelocity ? (l.hasAngularVelocity = true, l.angularVelocity.copy(r.angularVelocity)) : l.hasAngularVelocity = false));
      o !== null && (i = e.getPose(t.targetRaySpace, n), i === null && r !== null && (i = r), i !== null && (o.matrix.fromArray(i.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = true, i.linearVelocity ? (o.hasLinearVelocity = true, o.linearVelocity.copy(i.linearVelocity)) : o.hasLinearVelocity = false, i.angularVelocity ? (o.hasAngularVelocity = true, o.angularVelocity.copy(i.angularVelocity)) : o.hasAngularVelocity = false, this.dispatchEvent(Qx)));
    }
    return o !== null && (o.visible = i !== null), l !== null && (l.visible = r !== null), c !== null && (c.visible = a !== null), this;
  }
  _getHandJoint(t, e) {
    if (t.joints[e.jointName] === void 0) {
      const n = new ts();
      n.matrixAutoUpdate = false, n.visible = false, t.joints[e.jointName] = n, t.add(n);
    }
    return t.joints[e.jointName];
  }
}
const jx = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`, tv = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
class ev {
  constructor() {
    this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
  }
  init(t, e, n) {
    if (this.texture === null) {
      const i = new ue(), r = t.properties.get(i);
      r.__webglTexture = e.texture, (e.depthNear != n.depthNear || e.depthFar != n.depthFar) && (this.depthNear = e.depthNear, this.depthFar = e.depthFar), this.texture = i;
    }
  }
  getMesh(t) {
    if (this.texture !== null && this.mesh === null) {
      const e = t.cameras[0].viewport, n = new an({ vertexShader: jx, fragmentShader: tv, uniforms: { depthColor: { value: this.texture }, depthWidth: { value: e.z }, depthHeight: { value: e.w } } });
      this.mesh = new _e(new us(20, 20), n);
    }
    return this.mesh;
  }
  reset() {
    this.texture = null, this.mesh = null;
  }
  getDepthTexture() {
    return this.texture;
  }
}
class nv extends gn {
  constructor(t, e) {
    super();
    const n = this;
    let i = null, r = 1, a = null, o = "local-floor", l = 1, c = null, h = null, u = null, d = null, f = null, m = null;
    const _ = new ev(), g = e.getContextAttributes();
    let p = null, y = null;
    const x = [], M = [], I = new Z();
    let E = null;
    const A = new be();
    A.layers.enable(1), A.viewport = new Jt();
    const P = new be();
    P.layers.enable(2), P.viewport = new Jt();
    const V = [A, P], v = new Od();
    v.layers.enable(1), v.layers.enable(2);
    let b = null, k = null;
    this.cameraAutoUpdate = true, this.enabled = false, this.isPresenting = false, this.getController = function(X) {
      let et = x[X];
      return et === void 0 && (et = new gl(), x[X] = et), et.getTargetRaySpace();
    }, this.getControllerGrip = function(X) {
      let et = x[X];
      return et === void 0 && (et = new gl(), x[X] = et), et.getGripSpace();
    }, this.getHand = function(X) {
      let et = x[X];
      return et === void 0 && (et = new gl(), x[X] = et), et.getHandSpace();
    };
    function B(X) {
      const et = M.indexOf(X.inputSource);
      if (et === -1) return;
      const Mt = x[et];
      Mt !== void 0 && (Mt.update(X.inputSource, X.frame, c || a), Mt.dispatchEvent({ type: X.type, data: X.inputSource }));
    }
    function H() {
      i.removeEventListener("select", B), i.removeEventListener("selectstart", B), i.removeEventListener("selectend", B), i.removeEventListener("squeeze", B), i.removeEventListener("squeezestart", B), i.removeEventListener("squeezeend", B), i.removeEventListener("end", H), i.removeEventListener("inputsourceschange", Q);
      for (let X = 0; X < x.length; X++) {
        const et = M[X];
        et !== null && (M[X] = null, x[X].disconnect(et));
      }
      b = null, k = null, _.reset(), t.setRenderTarget(p), f = null, d = null, u = null, i = null, y = null, Kt.stop(), n.isPresenting = false, t.setPixelRatio(E), t.setSize(I.width, I.height, false), n.dispatchEvent({ type: "sessionend" });
    }
    this.setFramebufferScaleFactor = function(X) {
      r = X, n.isPresenting === true && console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.");
    }, this.setReferenceSpaceType = function(X) {
      o = X, n.isPresenting === true && console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.");
    }, this.getReferenceSpace = function() {
      return c || a;
    }, this.setReferenceSpace = function(X) {
      c = X;
    }, this.getBaseLayer = function() {
      return d !== null ? d : f;
    }, this.getBinding = function() {
      return u;
    }, this.getFrame = function() {
      return m;
    }, this.getSession = function() {
      return i;
    }, this.setSession = async function(X) {
      if (i = X, i !== null) {
        if (p = t.getRenderTarget(), i.addEventListener("select", B), i.addEventListener("selectstart", B), i.addEventListener("selectend", B), i.addEventListener("squeeze", B), i.addEventListener("squeezestart", B), i.addEventListener("squeezeend", B), i.addEventListener("end", H), i.addEventListener("inputsourceschange", Q), g.xrCompatible !== true && await e.makeXRCompatible(), E = t.getPixelRatio(), t.getSize(I), i.renderState.layers === void 0) {
          const et = { antialias: g.antialias, alpha: true, depth: g.depth, stencil: g.stencil, framebufferScaleFactor: r };
          f = new XRWebGLLayer(i, e, et), i.updateRenderState({ baseLayer: f }), t.setPixelRatio(1), t.setSize(f.framebufferWidth, f.framebufferHeight, false), y = new rn(f.framebufferWidth, f.framebufferHeight, { format: Le, type: mn, colorSpace: t.outputColorSpace, stencilBuffer: g.stencil });
        } else {
          let et = null, Mt = null, ct = null;
          g.depth && (ct = g.stencil ? e.DEPTH24_STENCIL8 : e.DEPTH_COMPONENT24, et = g.stencil ? Ai : Mi, Mt = g.stencil ? Ei : Ln);
          const Lt = { colorFormat: e.RGBA8, depthFormat: ct, scaleFactor: r };
          u = new XRWebGLBinding(i, e), d = u.createProjectionLayer(Lt), i.updateRenderState({ layers: [d] }), t.setPixelRatio(1), t.setSize(d.textureWidth, d.textureHeight, false), y = new rn(d.textureWidth, d.textureHeight, { format: Le, type: mn, depthTexture: new pc(d.textureWidth, d.textureHeight, Mt, void 0, void 0, void 0, void 0, void 0, void 0, et), stencilBuffer: g.stencil, colorSpace: t.outputColorSpace, samples: g.antialias ? 4 : 0, resolveDepthBuffer: d.ignoreDepthValues === false });
        }
        y.isXRRenderTarget = true, this.setFoveation(l), c = null, a = await i.requestReferenceSpace(o), Kt.setContext(i), Kt.start(), n.isPresenting = true, n.dispatchEvent({ type: "sessionstart" });
      }
    }, this.getEnvironmentBlendMode = function() {
      if (i !== null) return i.environmentBlendMode;
    }, this.getDepthTexture = function() {
      return _.getDepthTexture();
    };
    function Q(X) {
      for (let et = 0; et < X.removed.length; et++) {
        const Mt = X.removed[et], ct = M.indexOf(Mt);
        ct >= 0 && (M[ct] = null, x[ct].disconnect(Mt));
      }
      for (let et = 0; et < X.added.length; et++) {
        const Mt = X.added[et];
        let ct = M.indexOf(Mt);
        if (ct === -1) {
          for (let It = 0; It < x.length; It++) if (It >= M.length) {
            M.push(Mt), ct = It;
            break;
          } else if (M[It] === null) {
            M[It] = Mt, ct = It;
            break;
          }
          if (ct === -1) break;
        }
        const Lt = x[ct];
        Lt && Lt.connect(Mt);
      }
    }
    const O = new C(), tt = new C();
    function W(X, et, Mt) {
      O.setFromMatrixPosition(et.matrixWorld), tt.setFromMatrixPosition(Mt.matrixWorld);
      const ct = O.distanceTo(tt), Lt = et.projectionMatrix.elements, It = Mt.projectionMatrix.elements, Ot = Lt[14] / (Lt[10] - 1), Gt = Lt[14] / (Lt[10] + 1), J = (Lt[9] + 1) / Lt[5], R = (Lt[9] - 1) / Lt[5], rt = (Lt[8] - 1) / Lt[0], st = (It[8] + 1) / It[0], j = Ot * rt, at = Ot * st, Ct = ct / (-rt + st), gt = Ct * -rt;
      if (et.matrixWorld.decompose(X.position, X.quaternion, X.scale), X.translateX(gt), X.translateZ(Ct), X.matrixWorld.compose(X.position, X.quaternion, X.scale), X.matrixWorldInverse.copy(X.matrixWorld).invert(), Lt[10] === -1) X.projectionMatrix.copy(et.projectionMatrix), X.projectionMatrixInverse.copy(et.projectionMatrixInverse);
      else {
        const T = Ot + Ct, S = Gt + Ct, N = j - gt, q = at + (ct - gt), $ = J * Gt / S * T, Y = R * Gt / S * T;
        X.projectionMatrix.makePerspective(N, q, $, Y, T, S), X.projectionMatrixInverse.copy(X.projectionMatrix).invert();
      }
    }
    function ht(X, et) {
      et === null ? X.matrixWorld.copy(X.matrix) : X.matrixWorld.multiplyMatrices(et.matrixWorld, X.matrix), X.matrixWorldInverse.copy(X.matrixWorld).invert();
    }
    this.updateCamera = function(X) {
      if (i === null) return;
      let et = X.near, Mt = X.far;
      _.texture !== null && (_.depthNear > 0 && (et = _.depthNear), _.depthFar > 0 && (Mt = _.depthFar)), v.near = P.near = A.near = et, v.far = P.far = A.far = Mt, (b !== v.near || k !== v.far) && (i.updateRenderState({ depthNear: v.near, depthFar: v.far }), b = v.near, k = v.far);
      const ct = X.parent, Lt = v.cameras;
      ht(v, ct);
      for (let It = 0; It < Lt.length; It++) ht(Lt[It], ct);
      Lt.length === 2 ? W(v, A, P) : v.projectionMatrix.copy(A.projectionMatrix), pt(X, v, ct);
    };
    function pt(X, et, Mt) {
      Mt === null ? X.matrix.copy(et.matrixWorld) : (X.matrix.copy(Mt.matrixWorld), X.matrix.invert(), X.matrix.multiply(et.matrixWorld)), X.matrix.decompose(X.position, X.quaternion, X.scale), X.updateMatrixWorld(true), X.projectionMatrix.copy(et.projectionMatrix), X.projectionMatrixInverse.copy(et.projectionMatrixInverse), X.isPerspectiveCamera && (X.fov = rs * 2 * Math.atan(1 / X.projectionMatrix.elements[5]), X.zoom = 1);
    }
    this.getCamera = function() {
      return v;
    }, this.getFoveation = function() {
      if (!(d === null && f === null)) return l;
    }, this.setFoveation = function(X) {
      l = X, d !== null && (d.fixedFoveation = X), f !== null && f.fixedFoveation !== void 0 && (f.fixedFoveation = X);
    }, this.hasDepthSensing = function() {
      return _.texture !== null;
    }, this.getDepthSensingMesh = function() {
      return _.getMesh(v);
    };
    let mt = null;
    function Wt(X, et) {
      if (h = et.getViewerPose(c || a), m = et, h !== null) {
        const Mt = h.views;
        f !== null && (t.setRenderTargetFramebuffer(y, f.framebuffer), t.setRenderTarget(y));
        let ct = false;
        Mt.length !== v.cameras.length && (v.cameras.length = 0, ct = true);
        for (let It = 0; It < Mt.length; It++) {
          const Ot = Mt[It];
          let Gt = null;
          if (f !== null) Gt = f.getViewport(Ot);
          else {
            const R = u.getViewSubImage(d, Ot);
            Gt = R.viewport, It === 0 && (t.setRenderTargetTextures(y, R.colorTexture, d.ignoreDepthValues ? void 0 : R.depthStencilTexture), t.setRenderTarget(y));
          }
          let J = V[It];
          J === void 0 && (J = new be(), J.layers.enable(It), J.viewport = new Jt(), V[It] = J), J.matrix.fromArray(Ot.transform.matrix), J.matrix.decompose(J.position, J.quaternion, J.scale), J.projectionMatrix.fromArray(Ot.projectionMatrix), J.projectionMatrixInverse.copy(J.projectionMatrix).invert(), J.viewport.set(Gt.x, Gt.y, Gt.width, Gt.height), It === 0 && (v.matrix.copy(J.matrix), v.matrix.decompose(v.position, v.quaternion, v.scale)), ct === true && v.cameras.push(J);
        }
        const Lt = i.enabledFeatures;
        if (Lt && Lt.includes("depth-sensing")) {
          const It = u.getDepthInformation(Mt[0]);
          It && It.isValid && It.texture && _.init(t, It, i.renderState);
        }
      }
      for (let Mt = 0; Mt < x.length; Mt++) {
        const ct = M[Mt], Lt = x[Mt];
        ct !== null && Lt !== void 0 && Lt.update(ct, et, c || a);
      }
      mt && mt(X, et), et.detectedPlanes && n.dispatchEvent({ type: "planesdetected", data: et }), m = null;
    }
    const Kt = new Id();
    Kt.setAnimationLoop(Wt), this.setAnimationLoop = function(X) {
      mt = X;
    }, this.dispose = function() {
    };
  }
}
const ri = new Ze(), iv = new Pt();
function sv(s, t) {
  function e(g, p) {
    g.matrixAutoUpdate === true && g.updateMatrix(), p.value.copy(g.matrix);
  }
  function n(g, p) {
    p.color.getRGB(g.fogColor.value, Td(s)), p.isFog ? (g.fogNear.value = p.near, g.fogFar.value = p.far) : p.isFogExp2 && (g.fogDensity.value = p.density);
  }
  function i(g, p, y, x, M) {
    p.isMeshBasicMaterial || p.isMeshLambertMaterial ? r(g, p) : p.isMeshToonMaterial ? (r(g, p), u(g, p)) : p.isMeshPhongMaterial ? (r(g, p), h(g, p)) : p.isMeshStandardMaterial ? (r(g, p), d(g, p), p.isMeshPhysicalMaterial && f(g, p, M)) : p.isMeshMatcapMaterial ? (r(g, p), m(g, p)) : p.isMeshDepthMaterial ? r(g, p) : p.isMeshDistanceMaterial ? (r(g, p), _(g, p)) : p.isMeshNormalMaterial ? r(g, p) : p.isLineBasicMaterial ? (a(g, p), p.isLineDashedMaterial && o(g, p)) : p.isPointsMaterial ? l(g, p, y, x) : p.isSpriteMaterial ? c(g, p) : p.isShadowMaterial ? (g.color.value.copy(p.color), g.opacity.value = p.opacity) : p.isShaderMaterial && (p.uniformsNeedUpdate = false);
  }
  function r(g, p) {
    g.opacity.value = p.opacity, p.color && g.diffuse.value.copy(p.color), p.emissive && g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity), p.map && (g.map.value = p.map, e(p.map, g.mapTransform)), p.alphaMap && (g.alphaMap.value = p.alphaMap, e(p.alphaMap, g.alphaMapTransform)), p.bumpMap && (g.bumpMap.value = p.bumpMap, e(p.bumpMap, g.bumpMapTransform), g.bumpScale.value = p.bumpScale, p.side === De && (g.bumpScale.value *= -1)), p.normalMap && (g.normalMap.value = p.normalMap, e(p.normalMap, g.normalMapTransform), g.normalScale.value.copy(p.normalScale), p.side === De && g.normalScale.value.negate()), p.displacementMap && (g.displacementMap.value = p.displacementMap, e(p.displacementMap, g.displacementMapTransform), g.displacementScale.value = p.displacementScale, g.displacementBias.value = p.displacementBias), p.emissiveMap && (g.emissiveMap.value = p.emissiveMap, e(p.emissiveMap, g.emissiveMapTransform)), p.specularMap && (g.specularMap.value = p.specularMap, e(p.specularMap, g.specularMapTransform)), p.alphaTest > 0 && (g.alphaTest.value = p.alphaTest);
    const y = t.get(p), x = y.envMap, M = y.envMapRotation;
    x && (g.envMap.value = x, ri.copy(M), ri.x *= -1, ri.y *= -1, ri.z *= -1, x.isCubeTexture && x.isRenderTargetTexture === false && (ri.y *= -1, ri.z *= -1), g.envMapRotation.value.setFromMatrix4(iv.makeRotationFromEuler(ri)), g.flipEnvMap.value = x.isCubeTexture && x.isRenderTargetTexture === false ? -1 : 1, g.reflectivity.value = p.reflectivity, g.ior.value = p.ior, g.refractionRatio.value = p.refractionRatio), p.lightMap && (g.lightMap.value = p.lightMap, g.lightMapIntensity.value = p.lightMapIntensity, e(p.lightMap, g.lightMapTransform)), p.aoMap && (g.aoMap.value = p.aoMap, g.aoMapIntensity.value = p.aoMapIntensity, e(p.aoMap, g.aoMapTransform));
  }
  function a(g, p) {
    g.diffuse.value.copy(p.color), g.opacity.value = p.opacity, p.map && (g.map.value = p.map, e(p.map, g.mapTransform));
  }
  function o(g, p) {
    g.dashSize.value = p.dashSize, g.totalSize.value = p.dashSize + p.gapSize, g.scale.value = p.scale;
  }
  function l(g, p, y, x) {
    g.diffuse.value.copy(p.color), g.opacity.value = p.opacity, g.size.value = p.size * y, g.scale.value = x * 0.5, p.map && (g.map.value = p.map, e(p.map, g.uvTransform)), p.alphaMap && (g.alphaMap.value = p.alphaMap, e(p.alphaMap, g.alphaMapTransform)), p.alphaTest > 0 && (g.alphaTest.value = p.alphaTest);
  }
  function c(g, p) {
    g.diffuse.value.copy(p.color), g.opacity.value = p.opacity, g.rotation.value = p.rotation, p.map && (g.map.value = p.map, e(p.map, g.mapTransform)), p.alphaMap && (g.alphaMap.value = p.alphaMap, e(p.alphaMap, g.alphaMapTransform)), p.alphaTest > 0 && (g.alphaTest.value = p.alphaTest);
  }
  function h(g, p) {
    g.specular.value.copy(p.specular), g.shininess.value = Math.max(p.shininess, 1e-4);
  }
  function u(g, p) {
    p.gradientMap && (g.gradientMap.value = p.gradientMap);
  }
  function d(g, p) {
    g.metalness.value = p.metalness, p.metalnessMap && (g.metalnessMap.value = p.metalnessMap, e(p.metalnessMap, g.metalnessMapTransform)), g.roughness.value = p.roughness, p.roughnessMap && (g.roughnessMap.value = p.roughnessMap, e(p.roughnessMap, g.roughnessMapTransform)), p.envMap && (g.envMapIntensity.value = p.envMapIntensity);
  }
  function f(g, p, y) {
    g.ior.value = p.ior, p.sheen > 0 && (g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen), g.sheenRoughness.value = p.sheenRoughness, p.sheenColorMap && (g.sheenColorMap.value = p.sheenColorMap, e(p.sheenColorMap, g.sheenColorMapTransform)), p.sheenRoughnessMap && (g.sheenRoughnessMap.value = p.sheenRoughnessMap, e(p.sheenRoughnessMap, g.sheenRoughnessMapTransform))), p.clearcoat > 0 && (g.clearcoat.value = p.clearcoat, g.clearcoatRoughness.value = p.clearcoatRoughness, p.clearcoatMap && (g.clearcoatMap.value = p.clearcoatMap, e(p.clearcoatMap, g.clearcoatMapTransform)), p.clearcoatRoughnessMap && (g.clearcoatRoughnessMap.value = p.clearcoatRoughnessMap, e(p.clearcoatRoughnessMap, g.clearcoatRoughnessMapTransform)), p.clearcoatNormalMap && (g.clearcoatNormalMap.value = p.clearcoatNormalMap, e(p.clearcoatNormalMap, g.clearcoatNormalMapTransform), g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale), p.side === De && g.clearcoatNormalScale.value.negate())), p.dispersion > 0 && (g.dispersion.value = p.dispersion), p.iridescence > 0 && (g.iridescence.value = p.iridescence, g.iridescenceIOR.value = p.iridescenceIOR, g.iridescenceThicknessMinimum.value = p.iridescenceThicknessRange[0], g.iridescenceThicknessMaximum.value = p.iridescenceThicknessRange[1], p.iridescenceMap && (g.iridescenceMap.value = p.iridescenceMap, e(p.iridescenceMap, g.iridescenceMapTransform)), p.iridescenceThicknessMap && (g.iridescenceThicknessMap.value = p.iridescenceThicknessMap, e(p.iridescenceThicknessMap, g.iridescenceThicknessMapTransform))), p.transmission > 0 && (g.transmission.value = p.transmission, g.transmissionSamplerMap.value = y.texture, g.transmissionSamplerSize.value.set(y.width, y.height), p.transmissionMap && (g.transmissionMap.value = p.transmissionMap, e(p.transmissionMap, g.transmissionMapTransform)), g.thickness.value = p.thickness, p.thicknessMap && (g.thicknessMap.value = p.thicknessMap, e(p.thicknessMap, g.thicknessMapTransform)), g.attenuationDistance.value = p.attenuationDistance, g.attenuationColor.value.copy(p.attenuationColor)), p.anisotropy > 0 && (g.anisotropyVector.value.set(p.anisotropy * Math.cos(p.anisotropyRotation), p.anisotropy * Math.sin(p.anisotropyRotation)), p.anisotropyMap && (g.anisotropyMap.value = p.anisotropyMap, e(p.anisotropyMap, g.anisotropyMapTransform))), g.specularIntensity.value = p.specularIntensity, g.specularColor.value.copy(p.specularColor), p.specularColorMap && (g.specularColorMap.value = p.specularColorMap, e(p.specularColorMap, g.specularColorMapTransform)), p.specularIntensityMap && (g.specularIntensityMap.value = p.specularIntensityMap, e(p.specularIntensityMap, g.specularIntensityMapTransform));
  }
  function m(g, p) {
    p.matcap && (g.matcap.value = p.matcap);
  }
  function _(g, p) {
    const y = t.get(p).light;
    g.referencePosition.value.setFromMatrixPosition(y.matrixWorld), g.nearDistance.value = y.shadow.camera.near, g.farDistance.value = y.shadow.camera.far;
  }
  return { refreshFogUniforms: n, refreshMaterialUniforms: i };
}
function rv(s, t, e, n) {
  let i = {}, r = {}, a = [];
  const o = s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);
  function l(y, x) {
    const M = x.program;
    n.uniformBlockBinding(y, M);
  }
  function c(y, x) {
    let M = i[y.id];
    M === void 0 && (m(y), M = h(y), i[y.id] = M, y.addEventListener("dispose", g));
    const I = x.program;
    n.updateUBOMapping(y, I);
    const E = t.render.frame;
    r[y.id] !== E && (d(y), r[y.id] = E);
  }
  function h(y) {
    const x = u();
    y.__bindingPointIndex = x;
    const M = s.createBuffer(), I = y.__size, E = y.usage;
    return s.bindBuffer(s.UNIFORM_BUFFER, M), s.bufferData(s.UNIFORM_BUFFER, I, E), s.bindBuffer(s.UNIFORM_BUFFER, null), s.bindBufferBase(s.UNIFORM_BUFFER, x, M), M;
  }
  function u() {
    for (let y = 0; y < o; y++) if (a.indexOf(y) === -1) return a.push(y), y;
    return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
  }
  function d(y) {
    const x = i[y.id], M = y.uniforms, I = y.__cache;
    s.bindBuffer(s.UNIFORM_BUFFER, x);
    for (let E = 0, A = M.length; E < A; E++) {
      const P = Array.isArray(M[E]) ? M[E] : [M[E]];
      for (let V = 0, v = P.length; V < v; V++) {
        const b = P[V];
        if (f(b, E, V, I) === true) {
          const k = b.__offset, B = Array.isArray(b.value) ? b.value : [b.value];
          let H = 0;
          for (let Q = 0; Q < B.length; Q++) {
            const O = B[Q], tt = _(O);
            typeof O == "number" || typeof O == "boolean" ? (b.__data[0] = O, s.bufferSubData(s.UNIFORM_BUFFER, k + H, b.__data)) : O.isMatrix3 ? (b.__data[0] = O.elements[0], b.__data[1] = O.elements[1], b.__data[2] = O.elements[2], b.__data[3] = 0, b.__data[4] = O.elements[3], b.__data[5] = O.elements[4], b.__data[6] = O.elements[5], b.__data[7] = 0, b.__data[8] = O.elements[6], b.__data[9] = O.elements[7], b.__data[10] = O.elements[8], b.__data[11] = 0) : (O.toArray(b.__data, H), H += tt.storage / Float32Array.BYTES_PER_ELEMENT);
          }
          s.bufferSubData(s.UNIFORM_BUFFER, k, b.__data);
        }
      }
    }
    s.bindBuffer(s.UNIFORM_BUFFER, null);
  }
  function f(y, x, M, I) {
    const E = y.value, A = x + "_" + M;
    if (I[A] === void 0) return typeof E == "number" || typeof E == "boolean" ? I[A] = E : I[A] = E.clone(), true;
    {
      const P = I[A];
      if (typeof E == "number" || typeof E == "boolean") {
        if (P !== E) return I[A] = E, true;
      } else if (P.equals(E) === false) return P.copy(E), true;
    }
    return false;
  }
  function m(y) {
    const x = y.uniforms;
    let M = 0;
    const I = 16;
    for (let A = 0, P = x.length; A < P; A++) {
      const V = Array.isArray(x[A]) ? x[A] : [x[A]];
      for (let v = 0, b = V.length; v < b; v++) {
        const k = V[v], B = Array.isArray(k.value) ? k.value : [k.value];
        for (let H = 0, Q = B.length; H < Q; H++) {
          const O = B[H], tt = _(O), W = M % I, ht = W % tt.boundary, pt = W + ht;
          M += ht, pt !== 0 && I - pt < tt.storage && (M += I - pt), k.__data = new Float32Array(tt.storage / Float32Array.BYTES_PER_ELEMENT), k.__offset = M, M += tt.storage;
        }
      }
    }
    const E = M % I;
    return E > 0 && (M += I - E), y.__size = M, y.__cache = {}, this;
  }
  function _(y) {
    const x = { boundary: 0, storage: 0 };
    return typeof y == "number" || typeof y == "boolean" ? (x.boundary = 4, x.storage = 4) : y.isVector2 ? (x.boundary = 8, x.storage = 8) : y.isVector3 || y.isColor ? (x.boundary = 16, x.storage = 12) : y.isVector4 ? (x.boundary = 16, x.storage = 16) : y.isMatrix3 ? (x.boundary = 48, x.storage = 48) : y.isMatrix4 ? (x.boundary = 64, x.storage = 64) : y.isTexture ? console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.") : console.warn("THREE.WebGLRenderer: Unsupported uniform value type.", y), x;
  }
  function g(y) {
    const x = y.target;
    x.removeEventListener("dispose", g);
    const M = a.indexOf(x.__bindingPointIndex);
    a.splice(M, 1), s.deleteBuffer(i[x.id]), delete i[x.id], delete r[x.id];
  }
  function p() {
    for (const y in i) s.deleteBuffer(i[y]);
    a = [], i = {}, r = {};
  }
  return { bind: l, update: c, dispose: p };
}
class av {
  constructor(t = {}) {
    const { canvas: e = bd(), context: n = null, depth: i = true, stencil: r = false, alpha: a = false, antialias: o = false, premultipliedAlpha: l = true, preserveDrawingBuffer: c = false, powerPreference: h = "default", failIfMajorPerformanceCaveat: u = false } = t;
    this.isWebGLRenderer = true;
    let d;
    if (n !== null) {
      if (typeof WebGLRenderingContext < "u" && n instanceof WebGLRenderingContext) throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
      d = n.getContextAttributes().alpha;
    } else d = a;
    const f = new Uint32Array(4), m = new Int32Array(4);
    let _ = null, g = null;
    const p = [], y = [];
    this.domElement = e, this.debug = { checkShaderErrors: true, onShaderError: null }, this.autoClear = true, this.autoClearColor = true, this.autoClearDepth = true, this.autoClearStencil = true, this.sortObjects = true, this.clippingPlanes = [], this.localClippingEnabled = false, this._outputColorSpace = Ke, this.toneMapping = Rn, this.toneMappingExposure = 1;
    const x = this;
    let M = false, I = 0, E = 0, A = null, P = -1, V = null;
    const v = new Jt(), b = new Jt();
    let k = null;
    const B = new ft(0);
    let H = 0, Q = e.width, O = e.height, tt = 1, W = null, ht = null;
    const pt = new Jt(0, 0, Q, O), mt = new Jt(0, 0, Q, O);
    let Wt = false;
    const Kt = new dr();
    let X = false, et = false;
    const Mt = new Pt(), ct = new Pt(), Lt = new C(), It = new Jt(), Ot = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: true };
    let Gt = false;
    function J() {
      return A === null ? tt : 1;
    }
    let R = n;
    function rt(w, D) {
      return e.getContext(w, D);
    }
    try {
      const w = { alpha: true, depth: i, stencil: r, antialias: o, premultipliedAlpha: l, preserveDrawingBuffer: c, powerPreference: h, failIfMajorPerformanceCaveat: u };
      if ("setAttribute" in e && e.setAttribute("data-engine", `three.js r${io}`), e.addEventListener("webglcontextlost", K, false), e.addEventListener("webglcontextrestored", ut, false), e.addEventListener("webglcontextcreationerror", xt, false), R === null) {
        const D = "webgl2";
        if (R = rt(D, w), R === null) throw rt(D) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.");
      }
    } catch (w) {
      throw console.error("THREE.WebGLRenderer: " + w.message), w;
    }
    let st, j, at, Ct, gt, T, S, N, q, $, Y, Et, lt, vt, Xt, nt, yt, Nt, Ft, St, qt, Bt, se, L;
    function _t() {
      st = new u0(R), st.init(), Bt = new Fd(R, st), j = new r0(R, st, t, Bt), at = new Xx(R), j.reverseDepthBuffer && at.buffers.depth.setReversed(true), Ct = new p0(R), gt = new Lx(), T = new Kx(R, st, at, gt, j, Bt, Ct), S = new o0(x), N = new h0(x), q = new Mm(R), se = new i0(R, q), $ = new d0(R, q, Ct, se), Y = new g0(R, $, q, Ct), Ft = new m0(R, j, T), nt = new a0(gt), Et = new Ix(x, S, N, st, j, se, nt), lt = new sv(x, gt), vt = new Ux(), Xt = new kx(st), Nt = new n0(x, S, N, at, Y, d, l), yt = new Gx(x, Y, j), L = new rv(R, Ct, j, at), St = new s0(R, st, Ct), qt = new f0(R, st, Ct), Ct.programs = Et.programs, x.capabilities = j, x.extensions = st, x.properties = gt, x.renderLists = vt, x.shadowMap = yt, x.state = at, x.info = Ct;
    }
    _t();
    const G = new nv(x, R);
    this.xr = G, this.getContext = function() {
      return R;
    }, this.getContextAttributes = function() {
      return R.getContextAttributes();
    }, this.forceContextLoss = function() {
      const w = st.get("WEBGL_lose_context");
      w && w.loseContext();
    }, this.forceContextRestore = function() {
      const w = st.get("WEBGL_lose_context");
      w && w.restoreContext();
    }, this.getPixelRatio = function() {
      return tt;
    }, this.setPixelRatio = function(w) {
      w !== void 0 && (tt = w, this.setSize(Q, O, false));
    }, this.getSize = function(w) {
      return w.set(Q, O);
    }, this.setSize = function(w, D, F = true) {
      if (G.isPresenting) {
        console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");
        return;
      }
      Q = w, O = D, e.width = Math.floor(w * tt), e.height = Math.floor(D * tt), F === true && (e.style.width = w + "px", e.style.height = D + "px"), this.setViewport(0, 0, w, D);
    }, this.getDrawingBufferSize = function(w) {
      return w.set(Q * tt, O * tt).floor();
    }, this.setDrawingBufferSize = function(w, D, F) {
      Q = w, O = D, tt = F, e.width = Math.floor(w * F), e.height = Math.floor(D * F), this.setViewport(0, 0, w, D);
    }, this.getCurrentViewport = function(w) {
      return w.copy(v);
    }, this.getViewport = function(w) {
      return w.copy(pt);
    }, this.setViewport = function(w, D, F, z) {
      w.isVector4 ? pt.set(w.x, w.y, w.z, w.w) : pt.set(w, D, F, z), at.viewport(v.copy(pt).multiplyScalar(tt).round());
    }, this.getScissor = function(w) {
      return w.copy(mt);
    }, this.setScissor = function(w, D, F, z) {
      w.isVector4 ? mt.set(w.x, w.y, w.z, w.w) : mt.set(w, D, F, z), at.scissor(b.copy(mt).multiplyScalar(tt).round());
    }, this.getScissorTest = function() {
      return Wt;
    }, this.setScissorTest = function(w) {
      at.setScissorTest(Wt = w);
    }, this.setOpaqueSort = function(w) {
      W = w;
    }, this.setTransparentSort = function(w) {
      ht = w;
    }, this.getClearColor = function(w) {
      return w.copy(Nt.getClearColor());
    }, this.setClearColor = function() {
      Nt.setClearColor.apply(Nt, arguments);
    }, this.getClearAlpha = function() {
      return Nt.getClearAlpha();
    }, this.setClearAlpha = function() {
      Nt.setClearAlpha.apply(Nt, arguments);
    }, this.clear = function(w = true, D = true, F = true) {
      let z = 0;
      if (w) {
        let U = false;
        if (A !== null) {
          const it = A.texture.format;
          U = it === ho || it === co || it === cr;
        }
        if (U) {
          const it = A.texture.type, dt = it === mn || it === Ln || it === ss || it === Ei || it === ao || it === oo, bt = Nt.getClearColor(), At = Nt.getClearAlpha(), Dt = bt.r, Ut = bt.g, Tt = bt.b;
          dt ? (f[0] = Dt, f[1] = Ut, f[2] = Tt, f[3] = At, R.clearBufferuiv(R.COLOR, 0, f)) : (m[0] = Dt, m[1] = Ut, m[2] = Tt, m[3] = At, R.clearBufferiv(R.COLOR, 0, m));
        } else z |= R.COLOR_BUFFER_BIT;
      }
      D && (z |= R.DEPTH_BUFFER_BIT, R.clearDepth(this.capabilities.reverseDepthBuffer ? 0 : 1)), F && (z |= R.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), R.clear(z);
    }, this.clearColor = function() {
      this.clear(true, false, false);
    }, this.clearDepth = function() {
      this.clear(false, true, false);
    }, this.clearStencil = function() {
      this.clear(false, false, true);
    }, this.dispose = function() {
      e.removeEventListener("webglcontextlost", K, false), e.removeEventListener("webglcontextrestored", ut, false), e.removeEventListener("webglcontextcreationerror", xt, false), vt.dispose(), Xt.dispose(), gt.dispose(), S.dispose(), N.dispose(), Y.dispose(), se.dispose(), L.dispose(), Et.dispose(), G.dispose(), G.removeEventListener("sessionstart", Oc), G.removeEventListener("sessionend", Bc), jn.stop();
    };
    function K(w) {
      w.preventDefault(), console.log("THREE.WebGLRenderer: Context Lost."), M = true;
    }
    function ut() {
      console.log("THREE.WebGLRenderer: Context Restored."), M = false;
      const w = Ct.autoReset, D = yt.enabled, F = yt.autoUpdate, z = yt.needsUpdate, U = yt.type;
      _t(), Ct.autoReset = w, yt.enabled = D, yt.autoUpdate = F, yt.needsUpdate = z, yt.type = U;
    }
    function xt(w) {
      console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", w.statusMessage);
    }
    function Yt(w) {
      const D = w.target;
      D.removeEventListener("dispose", Yt), pe(D);
    }
    function pe(w) {
      Fe(w), gt.remove(w);
    }
    function Fe(w) {
      const D = gt.get(w).programs;
      D !== void 0 && (D.forEach(function(F) {
        Et.releaseProgram(F);
      }), w.isShaderMaterial && Et.releaseShaderCache(w));
    }
    this.renderBufferDirect = function(w, D, F, z, U, it) {
      D === null && (D = Ot);
      const dt = U.isMesh && U.matrixWorld.determinant() < 0, bt = Nf(w, D, F, z, U);
      at.setMaterial(z, dt);
      let At = F.index, Dt = 1;
      if (z.wireframe === true) {
        if (At = $.getWireframeAttribute(F), At === void 0) return;
        Dt = 2;
      }
      const Ut = F.drawRange, Tt = F.attributes.position;
      let ne = Ut.start * Dt, ae = (Ut.start + Ut.count) * Dt;
      it !== null && (ne = Math.max(ne, it.start * Dt), ae = Math.min(ae, (it.start + it.count) * Dt)), At !== null ? (ne = Math.max(ne, 0), ae = Math.min(ae, At.count)) : Tt != null && (ne = Math.max(ne, 0), ae = Math.min(ae, Tt.count));
      const le = ae - ne;
      if (le < 0 || le === 1 / 0) return;
      se.setup(U, z, bt, F, At);
      let Ge, te = St;
      if (At !== null && (Ge = q.get(At), te = qt, te.setIndex(Ge)), U.isMesh) z.wireframe === true ? (at.setLineWidth(z.wireframeLinewidth * J()), te.setMode(R.LINES)) : te.setMode(R.TRIANGLES);
      else if (U.isLine) {
        let Rt = z.linewidth;
        Rt === void 0 && (Rt = 1), at.setLineWidth(Rt * J()), U.isLineSegments ? te.setMode(R.LINES) : U.isLineLoop ? te.setMode(R.LINE_LOOP) : te.setMode(R.LINE_STRIP);
      } else U.isPoints ? te.setMode(R.POINTS) : U.isSprite && te.setMode(R.TRIANGLES);
      if (U.isBatchedMesh) if (U._multiDrawInstances !== null) te.renderMultiDrawInstances(U._multiDrawStarts, U._multiDrawCounts, U._multiDrawCount, U._multiDrawInstances);
      else if (st.get("WEBGL_multi_draw")) te.renderMultiDraw(U._multiDrawStarts, U._multiDrawCounts, U._multiDrawCount);
      else {
        const Rt = U._multiDrawStarts, Se = U._multiDrawCounts, ee = U._multiDrawCount, je = At ? q.get(At).bytesPerElement : 1, Li = gt.get(z).currentProgram.getUniforms();
        for (let We = 0; We < ee; We++) Li.setValue(R, "_gl_DrawID", We), te.render(Rt[We] / je, Se[We]);
      }
      else if (U.isInstancedMesh) te.renderInstances(ne, le, U.count);
      else if (F.isInstancedBufferGeometry) {
        const Rt = F._maxInstanceCount !== void 0 ? F._maxInstanceCount : 1 / 0, Se = Math.min(F.instanceCount, Rt);
        te.renderInstances(ne, le, Se);
      } else te.render(ne, le);
    };
    function jt(w, D, F) {
      w.transparent === true && w.side === hn && w.forceSinglePass === false ? (w.side = De, w.needsUpdate = true, vr(w, D, F), w.side = Pn, w.needsUpdate = true, vr(w, D, F), w.side = hn) : vr(w, D, F);
    }
    this.compile = function(w, D, F = null) {
      F === null && (F = w), g = Xt.get(F), g.init(D), y.push(g), F.traverseVisible(function(U) {
        U.isLight && U.layers.test(D.layers) && (g.pushLight(U), U.castShadow && g.pushShadow(U));
      }), w !== F && w.traverseVisible(function(U) {
        U.isLight && U.layers.test(D.layers) && (g.pushLight(U), U.castShadow && g.pushShadow(U));
      }), g.setupLights();
      const z = /* @__PURE__ */ new Set();
      return w.traverse(function(U) {
        if (!(U.isMesh || U.isPoints || U.isLine || U.isSprite)) return;
        const it = U.material;
        if (it) if (Array.isArray(it)) for (let dt = 0; dt < it.length; dt++) {
          const bt = it[dt];
          jt(bt, F, U), z.add(bt);
        }
        else jt(it, F, U), z.add(it);
      }), y.pop(), g = null, z;
    }, this.compileAsync = function(w, D, F = null) {
      const z = this.compile(w, D, F);
      return new Promise((U) => {
        function it() {
          if (z.forEach(function(dt) {
            gt.get(dt).currentProgram.isReady() && z.delete(dt);
          }), z.size === 0) {
            U(w);
            return;
          }
          setTimeout(it, 10);
        }
        st.get("KHR_parallel_shader_compile") !== null ? it() : setTimeout(it, 10);
      });
    };
    let Oe = null;
    function xn(w) {
      Oe && Oe(w);
    }
    function Oc() {
      jn.stop();
    }
    function Bc() {
      jn.start();
    }
    const jn = new Id();
    jn.setAnimationLoop(xn), typeof self < "u" && jn.setContext(self), this.setAnimationLoop = function(w) {
      Oe = w, G.setAnimationLoop(w), w === null ? jn.stop() : jn.start();
    }, G.addEventListener("sessionstart", Oc), G.addEventListener("sessionend", Bc), this.render = function(w, D) {
      if (D !== void 0 && D.isCamera !== true) {
        console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        return;
      }
      if (M === true) return;
      if (w.matrixWorldAutoUpdate === true && w.updateMatrixWorld(), D.parent === null && D.matrixWorldAutoUpdate === true && D.updateMatrixWorld(), G.enabled === true && G.isPresenting === true && (G.cameraAutoUpdate === true && G.updateCamera(D), D = G.getCamera()), w.isScene === true && w.onBeforeRender(x, w, D, A), g = Xt.get(w, y.length), g.init(D), y.push(g), ct.multiplyMatrices(D.projectionMatrix, D.matrixWorldInverse), Kt.setFromProjectionMatrix(ct), et = this.localClippingEnabled, X = nt.init(this.clippingPlanes, et), _ = vt.get(w, p.length), _.init(), p.push(_), G.enabled === true && G.isPresenting === true) {
        const it = x.xr.getDepthSensingMesh();
        it !== null && zo(it, D, -1 / 0, x.sortObjects);
      }
      zo(w, D, 0, x.sortObjects), _.finish(), x.sortObjects === true && _.sort(W, ht), Gt = G.enabled === false || G.isPresenting === false || G.hasDepthSensing() === false, Gt && Nt.addToRenderList(_, w), this.info.render.frame++, X === true && nt.beginShadows();
      const F = g.state.shadowsArray;
      yt.render(F, w, D), X === true && nt.endShadows(), this.info.autoReset === true && this.info.reset();
      const z = _.opaque, U = _.transmissive;
      if (g.setupLights(), D.isArrayCamera) {
        const it = D.cameras;
        if (U.length > 0) for (let dt = 0, bt = it.length; dt < bt; dt++) {
          const At = it[dt];
          kc(z, U, w, At);
        }
        Gt && Nt.render(w);
        for (let dt = 0, bt = it.length; dt < bt; dt++) {
          const At = it[dt];
          zc(_, w, At, At.viewport);
        }
      } else U.length > 0 && kc(z, U, w, D), Gt && Nt.render(w), zc(_, w, D);
      A !== null && (T.updateMultisampleRenderTarget(A), T.updateRenderTargetMipmap(A)), w.isScene === true && w.onAfterRender(x, w, D), se.resetDefaultState(), P = -1, V = null, y.pop(), y.length > 0 ? (g = y[y.length - 1], X === true && nt.setGlobalState(x.clippingPlanes, g.state.camera)) : g = null, p.pop(), p.length > 0 ? _ = p[p.length - 1] : _ = null;
    };
    function zo(w, D, F, z) {
      if (w.visible === false) return;
      if (w.layers.test(D.layers)) {
        if (w.isGroup) F = w.renderOrder;
        else if (w.isLOD) w.autoUpdate === true && w.update(D);
        else if (w.isLight) g.pushLight(w), w.castShadow && g.pushShadow(w);
        else if (w.isSprite) {
          if (!w.frustumCulled || Kt.intersectsSprite(w)) {
            z && It.setFromMatrixPosition(w.matrixWorld).applyMatrix4(ct);
            const dt = Y.update(w), bt = w.material;
            bt.visible && _.push(w, dt, bt, F, It.z, null);
          }
        } else if ((w.isMesh || w.isLine || w.isPoints) && (!w.frustumCulled || Kt.intersectsObject(w))) {
          const dt = Y.update(w), bt = w.material;
          if (z && (w.boundingSphere !== void 0 ? (w.boundingSphere === null && w.computeBoundingSphere(), It.copy(w.boundingSphere.center)) : (dt.boundingSphere === null && dt.computeBoundingSphere(), It.copy(dt.boundingSphere.center)), It.applyMatrix4(w.matrixWorld).applyMatrix4(ct)), Array.isArray(bt)) {
            const At = dt.groups;
            for (let Dt = 0, Ut = At.length; Dt < Ut; Dt++) {
              const Tt = At[Dt], ne = bt[Tt.materialIndex];
              ne && ne.visible && _.push(w, dt, ne, F, It.z, Tt);
            }
          } else bt.visible && _.push(w, dt, bt, F, It.z, null);
        }
      }
      const it = w.children;
      for (let dt = 0, bt = it.length; dt < bt; dt++) zo(it[dt], D, F, z);
    }
    function zc(w, D, F, z) {
      const U = w.opaque, it = w.transmissive, dt = w.transparent;
      g.setupLightsView(F), X === true && nt.setGlobalState(x.clippingPlanes, F), z && at.viewport(v.copy(z)), U.length > 0 && xr(U, D, F), it.length > 0 && xr(it, D, F), dt.length > 0 && xr(dt, D, F), at.buffers.depth.setTest(true), at.buffers.depth.setMask(true), at.buffers.color.setMask(true), at.setPolygonOffset(false);
    }
    function kc(w, D, F, z) {
      if ((F.isScene === true ? F.overrideMaterial : null) !== null) return;
      g.state.transmissionRenderTarget[z.id] === void 0 && (g.state.transmissionRenderTarget[z.id] = new rn(1, 1, { generateMipmaps: true, type: st.has("EXT_color_buffer_half_float") || st.has("EXT_color_buffer_float") ? cs : mn, minFilter: un, samples: 4, stencilBuffer: r, resolveDepthBuffer: false, resolveStencilBuffer: false, colorSpace: Qt.workingColorSpace }));
      const it = g.state.transmissionRenderTarget[z.id], dt = z.viewport || v;
      it.setSize(dt.z, dt.w);
      const bt = x.getRenderTarget();
      x.setRenderTarget(it), x.getClearColor(B), H = x.getClearAlpha(), H < 1 && x.setClearColor(16777215, 0.5), x.clear(), Gt && Nt.render(F);
      const At = x.toneMapping;
      x.toneMapping = Rn;
      const Dt = z.viewport;
      if (z.viewport !== void 0 && (z.viewport = void 0), g.setupLightsView(z), X === true && nt.setGlobalState(x.clippingPlanes, z), xr(w, F, z), T.updateMultisampleRenderTarget(it), T.updateRenderTargetMipmap(it), st.has("WEBGL_multisampled_render_to_texture") === false) {
        let Ut = false;
        for (let Tt = 0, ne = D.length; Tt < ne; Tt++) {
          const ae = D[Tt], le = ae.object, Ge = ae.geometry, te = ae.material, Rt = ae.group;
          if (te.side === hn && le.layers.test(z.layers)) {
            const Se = te.side;
            te.side = De, te.needsUpdate = true, Vc(le, F, z, Ge, te, Rt), te.side = Se, te.needsUpdate = true, Ut = true;
          }
        }
        Ut === true && (T.updateMultisampleRenderTarget(it), T.updateRenderTargetMipmap(it));
      }
      x.setRenderTarget(bt), x.setClearColor(B, H), Dt !== void 0 && (z.viewport = Dt), x.toneMapping = At;
    }
    function xr(w, D, F) {
      const z = D.isScene === true ? D.overrideMaterial : null;
      for (let U = 0, it = w.length; U < it; U++) {
        const dt = w[U], bt = dt.object, At = dt.geometry, Dt = z === null ? dt.material : z, Ut = dt.group;
        bt.layers.test(F.layers) && Vc(bt, D, F, At, Dt, Ut);
      }
    }
    function Vc(w, D, F, z, U, it) {
      w.onBeforeRender(x, D, F, z, U, it), w.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse, w.matrixWorld), w.normalMatrix.getNormalMatrix(w.modelViewMatrix), U.onBeforeRender(x, D, F, z, w, it), U.transparent === true && U.side === hn && U.forceSinglePass === false ? (U.side = De, U.needsUpdate = true, x.renderBufferDirect(F, D, z, U, w, it), U.side = Pn, U.needsUpdate = true, x.renderBufferDirect(F, D, z, U, w, it), U.side = hn) : x.renderBufferDirect(F, D, z, U, w, it), w.onAfterRender(x, D, F, z, U, it);
    }
    function vr(w, D, F) {
      D.isScene !== true && (D = Ot);
      const z = gt.get(w), U = g.state.lights, it = g.state.shadowsArray, dt = U.state.version, bt = Et.getParameters(w, U.state, it, D, F), At = Et.getProgramCacheKey(bt);
      let Dt = z.programs;
      z.environment = w.isMeshStandardMaterial ? D.environment : null, z.fog = D.fog, z.envMap = (w.isMeshStandardMaterial ? N : S).get(w.envMap || z.environment), z.envMapRotation = z.environment !== null && w.envMap === null ? D.environmentRotation : w.envMapRotation, Dt === void 0 && (w.addEventListener("dispose", Yt), Dt = /* @__PURE__ */ new Map(), z.programs = Dt);
      let Ut = Dt.get(At);
      if (Ut !== void 0) {
        if (z.currentProgram === Ut && z.lightsStateVersion === dt) return Gc(w, bt), Ut;
      } else bt.uniforms = Et.getUniforms(w), w.onBeforeCompile(bt, x), Ut = Et.acquireProgram(bt, At), Dt.set(At, Ut), z.uniforms = bt.uniforms;
      const Tt = z.uniforms;
      return (!w.isShaderMaterial && !w.isRawShaderMaterial || w.clipping === true) && (Tt.clippingPlanes = nt.uniform), Gc(w, bt), z.needsLights = Of(w), z.lightsStateVersion = dt, z.needsLights && (Tt.ambientLightColor.value = U.state.ambient, Tt.lightProbe.value = U.state.probe, Tt.directionalLights.value = U.state.directional, Tt.directionalLightShadows.value = U.state.directionalShadow, Tt.spotLights.value = U.state.spot, Tt.spotLightShadows.value = U.state.spotShadow, Tt.rectAreaLights.value = U.state.rectArea, Tt.ltc_1.value = U.state.rectAreaLTC1, Tt.ltc_2.value = U.state.rectAreaLTC2, Tt.pointLights.value = U.state.point, Tt.pointLightShadows.value = U.state.pointShadow, Tt.hemisphereLights.value = U.state.hemi, Tt.directionalShadowMap.value = U.state.directionalShadowMap, Tt.directionalShadowMatrix.value = U.state.directionalShadowMatrix, Tt.spotShadowMap.value = U.state.spotShadowMap, Tt.spotLightMatrix.value = U.state.spotLightMatrix, Tt.spotLightMap.value = U.state.spotLightMap, Tt.pointShadowMap.value = U.state.pointShadowMap, Tt.pointShadowMatrix.value = U.state.pointShadowMatrix), z.currentProgram = Ut, z.uniformsList = null, Ut;
    }
    function Hc(w) {
      if (w.uniformsList === null) {
        const D = w.currentProgram.getUniforms();
        w.uniformsList = pa.seqWithValue(D.seq, w.uniforms);
      }
      return w.uniformsList;
    }
    function Gc(w, D) {
      const F = gt.get(w);
      F.outputColorSpace = D.outputColorSpace, F.batching = D.batching, F.batchingColor = D.batchingColor, F.instancing = D.instancing, F.instancingColor = D.instancingColor, F.instancingMorph = D.instancingMorph, F.skinning = D.skinning, F.morphTargets = D.morphTargets, F.morphNormals = D.morphNormals, F.morphColors = D.morphColors, F.morphTargetsCount = D.morphTargetsCount, F.numClippingPlanes = D.numClippingPlanes, F.numIntersection = D.numClipIntersection, F.vertexAlphas = D.vertexAlphas, F.vertexTangents = D.vertexTangents, F.toneMapping = D.toneMapping;
    }
    function Nf(w, D, F, z, U) {
      D.isScene !== true && (D = Ot), T.resetTextureUnits();
      const it = D.fog, dt = z.isMeshStandardMaterial ? D.environment : null, bt = A === null ? x.outputColorSpace : A.isXRRenderTarget === true ? A.texture.colorSpace : Un, At = (z.isMeshStandardMaterial ? N : S).get(z.envMap || dt), Dt = z.vertexColors === true && !!F.attributes.color && F.attributes.color.itemSize === 4, Ut = !!F.attributes.tangent && (!!z.normalMap || z.anisotropy > 0), Tt = !!F.morphAttributes.position, ne = !!F.morphAttributes.normal, ae = !!F.morphAttributes.color;
      let le = Rn;
      z.toneMapped && (A === null || A.isXRRenderTarget === true) && (le = x.toneMapping);
      const Ge = F.morphAttributes.position || F.morphAttributes.normal || F.morphAttributes.color, te = Ge !== void 0 ? Ge.length : 0, Rt = gt.get(z), Se = g.state.lights;
      if (X === true && (et === true || w !== V)) {
        const Je = w === V && z.id === P;
        nt.setState(z, w, Je);
      }
      let ee = false;
      z.version === Rt.__version ? (Rt.needsLights && Rt.lightsStateVersion !== Se.state.version || Rt.outputColorSpace !== bt || U.isBatchedMesh && Rt.batching === false || !U.isBatchedMesh && Rt.batching === true || U.isBatchedMesh && Rt.batchingColor === true && U.colorTexture === null || U.isBatchedMesh && Rt.batchingColor === false && U.colorTexture !== null || U.isInstancedMesh && Rt.instancing === false || !U.isInstancedMesh && Rt.instancing === true || U.isSkinnedMesh && Rt.skinning === false || !U.isSkinnedMesh && Rt.skinning === true || U.isInstancedMesh && Rt.instancingColor === true && U.instanceColor === null || U.isInstancedMesh && Rt.instancingColor === false && U.instanceColor !== null || U.isInstancedMesh && Rt.instancingMorph === true && U.morphTexture === null || U.isInstancedMesh && Rt.instancingMorph === false && U.morphTexture !== null || Rt.envMap !== At || z.fog === true && Rt.fog !== it || Rt.numClippingPlanes !== void 0 && (Rt.numClippingPlanes !== nt.numPlanes || Rt.numIntersection !== nt.numIntersection) || Rt.vertexAlphas !== Dt || Rt.vertexTangents !== Ut || Rt.morphTargets !== Tt || Rt.morphNormals !== ne || Rt.morphColors !== ae || Rt.toneMapping !== le || Rt.morphTargetsCount !== te) && (ee = true) : (ee = true, Rt.__version = z.version);
      let je = Rt.currentProgram;
      ee === true && (je = vr(z, D, U));
      let Li = false, We = false, ko = false;
      const de = je.getUniforms(), Nn = Rt.uniforms;
      if (at.useProgram(je.program) && (Li = true, We = true, ko = true), z.id !== P && (P = z.id, We = true), Li || V !== w) {
        j.reverseDepthBuffer ? (Mt.copy(w.projectionMatrix), Xp(Mt), qp(Mt), de.setValue(R, "projectionMatrix", Mt)) : de.setValue(R, "projectionMatrix", w.projectionMatrix), de.setValue(R, "viewMatrix", w.matrixWorldInverse);
        const Je = de.map.cameraPosition;
        Je !== void 0 && Je.setValue(R, Lt.setFromMatrixPosition(w.matrixWorld)), j.logarithmicDepthBuffer && de.setValue(R, "logDepthBufFC", 2 / (Math.log(w.far + 1) / Math.LN2)), (z.isMeshPhongMaterial || z.isMeshToonMaterial || z.isMeshLambertMaterial || z.isMeshBasicMaterial || z.isMeshStandardMaterial || z.isShaderMaterial) && de.setValue(R, "isOrthographic", w.isOrthographicCamera === true), V !== w && (V = w, We = true, ko = true);
      }
      if (U.isSkinnedMesh) {
        de.setOptional(R, U, "bindMatrix"), de.setOptional(R, U, "bindMatrixInverse");
        const Je = U.skeleton;
        Je && (Je.boneTexture === null && Je.computeBoneTexture(), de.setValue(R, "boneTexture", Je.boneTexture, T));
      }
      U.isBatchedMesh && (de.setOptional(R, U, "batchingTexture"), de.setValue(R, "batchingTexture", U._matricesTexture, T), de.setOptional(R, U, "batchingIdTexture"), de.setValue(R, "batchingIdTexture", U._indirectTexture, T), de.setOptional(R, U, "batchingColorTexture"), U._colorsTexture !== null && de.setValue(R, "batchingColorTexture", U._colorsTexture, T));
      const Vo = F.morphAttributes;
      if ((Vo.position !== void 0 || Vo.normal !== void 0 || Vo.color !== void 0) && Ft.update(U, F, je), (We || Rt.receiveShadow !== U.receiveShadow) && (Rt.receiveShadow = U.receiveShadow, de.setValue(R, "receiveShadow", U.receiveShadow)), z.isMeshGouraudMaterial && z.envMap !== null && (Nn.envMap.value = At, Nn.flipEnvMap.value = At.isCubeTexture && At.isRenderTargetTexture === false ? -1 : 1), z.isMeshStandardMaterial && z.envMap === null && D.environment !== null && (Nn.envMapIntensity.value = D.environmentIntensity), We && (de.setValue(R, "toneMappingExposure", x.toneMappingExposure), Rt.needsLights && Ff(Nn, ko), it && z.fog === true && lt.refreshFogUniforms(Nn, it), lt.refreshMaterialUniforms(Nn, z, tt, O, g.state.transmissionRenderTarget[w.id]), pa.upload(R, Hc(Rt), Nn, T)), z.isShaderMaterial && z.uniformsNeedUpdate === true && (pa.upload(R, Hc(Rt), Nn, T), z.uniformsNeedUpdate = false), z.isSpriteMaterial && de.setValue(R, "center", U.center), de.setValue(R, "modelViewMatrix", U.modelViewMatrix), de.setValue(R, "normalMatrix", U.normalMatrix), de.setValue(R, "modelMatrix", U.matrixWorld), z.isShaderMaterial || z.isRawShaderMaterial) {
        const Je = z.uniformsGroups;
        for (let Ho = 0, Bf = Je.length; Ho < Bf; Ho++) {
          const Wc = Je[Ho];
          L.update(Wc, je), L.bind(Wc, je);
        }
      }
      return je;
    }
    function Ff(w, D) {
      w.ambientLightColor.needsUpdate = D, w.lightProbe.needsUpdate = D, w.directionalLights.needsUpdate = D, w.directionalLightShadows.needsUpdate = D, w.pointLights.needsUpdate = D, w.pointLightShadows.needsUpdate = D, w.spotLights.needsUpdate = D, w.spotLightShadows.needsUpdate = D, w.rectAreaLights.needsUpdate = D, w.hemisphereLights.needsUpdate = D;
    }
    function Of(w) {
      return w.isMeshLambertMaterial || w.isMeshToonMaterial || w.isMeshPhongMaterial || w.isMeshStandardMaterial || w.isShadowMaterial || w.isShaderMaterial && w.lights === true;
    }
    this.getActiveCubeFace = function() {
      return I;
    }, this.getActiveMipmapLevel = function() {
      return E;
    }, this.getRenderTarget = function() {
      return A;
    }, this.setRenderTargetTextures = function(w, D, F) {
      gt.get(w.texture).__webglTexture = D, gt.get(w.depthTexture).__webglTexture = F;
      const z = gt.get(w);
      z.__hasExternalTextures = true, z.__autoAllocateDepthBuffer = F === void 0, z.__autoAllocateDepthBuffer || st.has("WEBGL_multisampled_render_to_texture") === true && (console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"), z.__useRenderToTexture = false);
    }, this.setRenderTargetFramebuffer = function(w, D) {
      const F = gt.get(w);
      F.__webglFramebuffer = D, F.__useDefaultFramebuffer = D === void 0;
    }, this.setRenderTarget = function(w, D = 0, F = 0) {
      A = w, I = D, E = F;
      let z = true, U = null, it = false, dt = false;
      if (w) {
        const At = gt.get(w);
        if (At.__useDefaultFramebuffer !== void 0) at.bindFramebuffer(R.FRAMEBUFFER, null), z = false;
        else if (At.__webglFramebuffer === void 0) T.setupRenderTarget(w);
        else if (At.__hasExternalTextures) T.rebindTextures(w, gt.get(w.texture).__webglTexture, gt.get(w.depthTexture).__webglTexture);
        else if (w.depthBuffer) {
          const Tt = w.depthTexture;
          if (At.__boundDepthTexture !== Tt) {
            if (Tt !== null && gt.has(Tt) && (w.width !== Tt.image.width || w.height !== Tt.image.height)) throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");
            T.setupDepthRenderbuffer(w);
          }
        }
        const Dt = w.texture;
        (Dt.isData3DTexture || Dt.isDataArrayTexture || Dt.isCompressedArrayTexture) && (dt = true);
        const Ut = gt.get(w).__webglFramebuffer;
        w.isWebGLCubeRenderTarget ? (Array.isArray(Ut[D]) ? U = Ut[D][F] : U = Ut[D], it = true) : w.samples > 0 && T.useMultisampledRTT(w) === false ? U = gt.get(w).__webglMultisampledFramebuffer : Array.isArray(Ut) ? U = Ut[F] : U = Ut, v.copy(w.viewport), b.copy(w.scissor), k = w.scissorTest;
      } else v.copy(pt).multiplyScalar(tt).floor(), b.copy(mt).multiplyScalar(tt).floor(), k = Wt;
      if (at.bindFramebuffer(R.FRAMEBUFFER, U) && z && at.drawBuffers(w, U), at.viewport(v), at.scissor(b), at.setScissorTest(k), it) {
        const At = gt.get(w.texture);
        R.framebufferTexture2D(R.FRAMEBUFFER, R.COLOR_ATTACHMENT0, R.TEXTURE_CUBE_MAP_POSITIVE_X + D, At.__webglTexture, F);
      } else if (dt) {
        const At = gt.get(w.texture), Dt = D || 0;
        R.framebufferTextureLayer(R.FRAMEBUFFER, R.COLOR_ATTACHMENT0, At.__webglTexture, F || 0, Dt);
      }
      P = -1;
    }, this.readRenderTargetPixels = function(w, D, F, z, U, it, dt) {
      if (!(w && w.isWebGLRenderTarget)) {
        console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        return;
      }
      let bt = gt.get(w).__webglFramebuffer;
      if (w.isWebGLCubeRenderTarget && dt !== void 0 && (bt = bt[dt]), bt) {
        at.bindFramebuffer(R.FRAMEBUFFER, bt);
        try {
          const At = w.texture, Dt = At.format, Ut = At.type;
          if (!j.textureFormatReadable(Dt)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
            return;
          }
          if (!j.textureTypeReadable(Ut)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
            return;
          }
          D >= 0 && D <= w.width - z && F >= 0 && F <= w.height - U && R.readPixels(D, F, z, U, Bt.convert(Dt), Bt.convert(Ut), it);
        } finally {
          const At = A !== null ? gt.get(A).__webglFramebuffer : null;
          at.bindFramebuffer(R.FRAMEBUFFER, At);
        }
      }
    }, this.readRenderTargetPixelsAsync = async function(w, D, F, z, U, it, dt) {
      if (!(w && w.isWebGLRenderTarget)) throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
      let bt = gt.get(w).__webglFramebuffer;
      if (w.isWebGLCubeRenderTarget && dt !== void 0 && (bt = bt[dt]), bt) {
        const At = w.texture, Dt = At.format, Ut = At.type;
        if (!j.textureFormatReadable(Dt)) throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
        if (!j.textureTypeReadable(Ut)) throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
        if (D >= 0 && D <= w.width - z && F >= 0 && F <= w.height - U) {
          at.bindFramebuffer(R.FRAMEBUFFER, bt);
          const Tt = R.createBuffer();
          R.bindBuffer(R.PIXEL_PACK_BUFFER, Tt), R.bufferData(R.PIXEL_PACK_BUFFER, it.byteLength, R.STREAM_READ), R.readPixels(D, F, z, U, Bt.convert(Dt), Bt.convert(Ut), 0);
          const ne = A !== null ? gt.get(A).__webglFramebuffer : null;
          at.bindFramebuffer(R.FRAMEBUFFER, ne);
          const ae = R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE, 0);
          return R.flush(), await Wp(R, ae, 4), R.bindBuffer(R.PIXEL_PACK_BUFFER, Tt), R.getBufferSubData(R.PIXEL_PACK_BUFFER, 0, it), R.deleteBuffer(Tt), R.deleteSync(ae), it;
        } else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
      }
    }, this.copyFramebufferToTexture = function(w, D = null, F = 0) {
      w.isTexture !== true && (fa("WebGLRenderer: copyFramebufferToTexture function signature has changed."), D = arguments[0] || null, w = arguments[1]);
      const z = Math.pow(2, -F), U = Math.floor(w.image.width * z), it = Math.floor(w.image.height * z), dt = D !== null ? D.x : 0, bt = D !== null ? D.y : 0;
      T.setTexture2D(w, 0), R.copyTexSubImage2D(R.TEXTURE_2D, F, 0, 0, dt, bt, U, it), at.unbindTexture();
    }, this.copyTextureToTexture = function(w, D, F = null, z = null, U = 0) {
      w.isTexture !== true && (fa("WebGLRenderer: copyTextureToTexture function signature has changed."), z = arguments[0] || null, w = arguments[1], D = arguments[2], U = arguments[3] || 0, F = null);
      let it, dt, bt, At, Dt, Ut;
      F !== null ? (it = F.max.x - F.min.x, dt = F.max.y - F.min.y, bt = F.min.x, At = F.min.y) : (it = w.image.width, dt = w.image.height, bt = 0, At = 0), z !== null ? (Dt = z.x, Ut = z.y) : (Dt = 0, Ut = 0);
      const Tt = Bt.convert(D.format), ne = Bt.convert(D.type);
      T.setTexture2D(D, 0), R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL, D.flipY), R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL, D.premultiplyAlpha), R.pixelStorei(R.UNPACK_ALIGNMENT, D.unpackAlignment);
      const ae = R.getParameter(R.UNPACK_ROW_LENGTH), le = R.getParameter(R.UNPACK_IMAGE_HEIGHT), Ge = R.getParameter(R.UNPACK_SKIP_PIXELS), te = R.getParameter(R.UNPACK_SKIP_ROWS), Rt = R.getParameter(R.UNPACK_SKIP_IMAGES), Se = w.isCompressedTexture ? w.mipmaps[U] : w.image;
      R.pixelStorei(R.UNPACK_ROW_LENGTH, Se.width), R.pixelStorei(R.UNPACK_IMAGE_HEIGHT, Se.height), R.pixelStorei(R.UNPACK_SKIP_PIXELS, bt), R.pixelStorei(R.UNPACK_SKIP_ROWS, At), w.isDataTexture ? R.texSubImage2D(R.TEXTURE_2D, U, Dt, Ut, it, dt, Tt, ne, Se.data) : w.isCompressedTexture ? R.compressedTexSubImage2D(R.TEXTURE_2D, U, Dt, Ut, Se.width, Se.height, Tt, Se.data) : R.texSubImage2D(R.TEXTURE_2D, U, Dt, Ut, it, dt, Tt, ne, Se), R.pixelStorei(R.UNPACK_ROW_LENGTH, ae), R.pixelStorei(R.UNPACK_IMAGE_HEIGHT, le), R.pixelStorei(R.UNPACK_SKIP_PIXELS, Ge), R.pixelStorei(R.UNPACK_SKIP_ROWS, te), R.pixelStorei(R.UNPACK_SKIP_IMAGES, Rt), U === 0 && D.generateMipmaps && R.generateMipmap(R.TEXTURE_2D), at.unbindTexture();
    }, this.copyTextureToTexture3D = function(w, D, F = null, z = null, U = 0) {
      w.isTexture !== true && (fa("WebGLRenderer: copyTextureToTexture3D function signature has changed."), F = arguments[0] || null, z = arguments[1] || null, w = arguments[2], D = arguments[3], U = arguments[4] || 0);
      let it, dt, bt, At, Dt, Ut, Tt, ne, ae;
      const le = w.isCompressedTexture ? w.mipmaps[U] : w.image;
      F !== null ? (it = F.max.x - F.min.x, dt = F.max.y - F.min.y, bt = F.max.z - F.min.z, At = F.min.x, Dt = F.min.y, Ut = F.min.z) : (it = le.width, dt = le.height, bt = le.depth, At = 0, Dt = 0, Ut = 0), z !== null ? (Tt = z.x, ne = z.y, ae = z.z) : (Tt = 0, ne = 0, ae = 0);
      const Ge = Bt.convert(D.format), te = Bt.convert(D.type);
      let Rt;
      if (D.isData3DTexture) T.setTexture3D(D, 0), Rt = R.TEXTURE_3D;
      else if (D.isDataArrayTexture || D.isCompressedArrayTexture) T.setTexture2DArray(D, 0), Rt = R.TEXTURE_2D_ARRAY;
      else {
        console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");
        return;
      }
      R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL, D.flipY), R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL, D.premultiplyAlpha), R.pixelStorei(R.UNPACK_ALIGNMENT, D.unpackAlignment);
      const Se = R.getParameter(R.UNPACK_ROW_LENGTH), ee = R.getParameter(R.UNPACK_IMAGE_HEIGHT), je = R.getParameter(R.UNPACK_SKIP_PIXELS), Li = R.getParameter(R.UNPACK_SKIP_ROWS), We = R.getParameter(R.UNPACK_SKIP_IMAGES);
      R.pixelStorei(R.UNPACK_ROW_LENGTH, le.width), R.pixelStorei(R.UNPACK_IMAGE_HEIGHT, le.height), R.pixelStorei(R.UNPACK_SKIP_PIXELS, At), R.pixelStorei(R.UNPACK_SKIP_ROWS, Dt), R.pixelStorei(R.UNPACK_SKIP_IMAGES, Ut), w.isDataTexture || w.isData3DTexture ? R.texSubImage3D(Rt, U, Tt, ne, ae, it, dt, bt, Ge, te, le.data) : D.isCompressedArrayTexture ? R.compressedTexSubImage3D(Rt, U, Tt, ne, ae, it, dt, bt, Ge, le.data) : R.texSubImage3D(Rt, U, Tt, ne, ae, it, dt, bt, Ge, te, le), R.pixelStorei(R.UNPACK_ROW_LENGTH, Se), R.pixelStorei(R.UNPACK_IMAGE_HEIGHT, ee), R.pixelStorei(R.UNPACK_SKIP_PIXELS, je), R.pixelStorei(R.UNPACK_SKIP_ROWS, Li), R.pixelStorei(R.UNPACK_SKIP_IMAGES, We), U === 0 && D.generateMipmaps && R.generateMipmap(Rt), at.unbindTexture();
    }, this.initRenderTarget = function(w) {
      gt.get(w).__webglFramebuffer === void 0 && T.setupRenderTarget(w);
    }, this.initTexture = function(w) {
      w.isCubeTexture ? T.setTextureCube(w, 0) : w.isData3DTexture ? T.setTexture3D(w, 0) : w.isDataArrayTexture || w.isCompressedArrayTexture ? T.setTexture2DArray(w, 0) : T.setTexture2D(w, 0), at.unbindTexture();
    }, this.resetState = function() {
      I = 0, E = 0, A = null, at.reset(), se.reset();
    }, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  get coordinateSystem() {
    return dn;
  }
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(t) {
    this._outputColorSpace = t;
    const e = this.getContext();
    e.drawingBufferColorSpace = t === fo ? "display-p3" : "srgb", e.unpackColorSpace = Qt.workingColorSpace === hr ? "display-p3" : "srgb";
  }
}
class vo {
  constructor(t, e = 25e-5) {
    this.isFogExp2 = true, this.name = "", this.color = new ft(t), this.density = e;
  }
  clone() {
    return new vo(this.color, this.density);
  }
  toJSON() {
    return { type: "FogExp2", name: this.name, color: this.color.getHex(), density: this.density };
  }
}
class yo {
  constructor(t, e = 1, n = 1e3) {
    this.isFog = true, this.name = "", this.color = new ft(t), this.near = e, this.far = n;
  }
  clone() {
    return new yo(this.color, this.near, this.far);
  }
  toJSON() {
    return { type: "Fog", name: this.name, color: this.color.getHex(), near: this.near, far: this.far };
  }
}
class Bd extends $t {
  constructor() {
    super(), this.isScene = true, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new Ze(), this.environmentIntensity = 1, this.environmentRotation = new Ze(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  copy(t, e) {
    return super.copy(t, e), t.background !== null && (this.background = t.background.clone()), t.environment !== null && (this.environment = t.environment.clone()), t.fog !== null && (this.fog = t.fog.clone()), this.backgroundBlurriness = t.backgroundBlurriness, this.backgroundIntensity = t.backgroundIntensity, this.backgroundRotation.copy(t.backgroundRotation), this.environmentIntensity = t.environmentIntensity, this.environmentRotation.copy(t.environmentRotation), t.overrideMaterial !== null && (this.overrideMaterial = t.overrideMaterial.clone()), this.matrixAutoUpdate = t.matrixAutoUpdate, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return this.fog !== null && (e.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (e.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (e.object.backgroundIntensity = this.backgroundIntensity), e.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (e.object.environmentIntensity = this.environmentIntensity), e.object.environmentRotation = this.environmentRotation.toArray(), e;
  }
}
class Mo {
  constructor(t, e) {
    this.isInterleavedBuffer = true, this.array = t, this.stride = e, this.count = t !== void 0 ? t.length / e : 0, this.usage = $s, this.updateRanges = [], this.version = 0, this.uuid = Ye();
  }
  onUploadCallback() {
  }
  set needsUpdate(t) {
    t === true && this.version++;
  }
  setUsage(t) {
    return this.usage = t, this;
  }
  addUpdateRange(t, e) {
    this.updateRanges.push({ start: t, count: e });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(t) {
    return this.array = new t.array.constructor(t.array), this.count = t.count, this.stride = t.stride, this.usage = t.usage, this;
  }
  copyAt(t, e, n) {
    t *= this.stride, n *= e.stride;
    for (let i = 0, r = this.stride; i < r; i++) this.array[t + i] = e.array[n + i];
    return this;
  }
  set(t, e = 0) {
    return this.array.set(t, e), this;
  }
  clone(t) {
    t.arrayBuffers === void 0 && (t.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = Ye()), t.arrayBuffers[this.array.buffer._uuid] === void 0 && (t.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer);
    const e = new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]), n = new this.constructor(e, this.stride);
    return n.setUsage(this.usage), n;
  }
  onUpload(t) {
    return this.onUploadCallback = t, this;
  }
  toJSON(t) {
    return t.arrayBuffers === void 0 && (t.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = Ye()), t.arrayBuffers[this.array.buffer._uuid] === void 0 && (t.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer))), { uuid: this.uuid, buffer: this.array.buffer._uuid, type: this.array.constructor.name, stride: this.stride };
  }
}
const Re = new C();
class Ti {
  constructor(t, e, n, i = false) {
    this.isInterleavedBufferAttribute = true, this.name = "", this.data = t, this.itemSize = e, this.offset = n, this.normalized = i;
  }
  get count() {
    return this.data.count;
  }
  get array() {
    return this.data.array;
  }
  set needsUpdate(t) {
    this.data.needsUpdate = t;
  }
  applyMatrix4(t) {
    for (let e = 0, n = this.data.count; e < n; e++) Re.fromBufferAttribute(this, e), Re.applyMatrix4(t), this.setXYZ(e, Re.x, Re.y, Re.z);
    return this;
  }
  applyNormalMatrix(t) {
    for (let e = 0, n = this.count; e < n; e++) Re.fromBufferAttribute(this, e), Re.applyNormalMatrix(t), this.setXYZ(e, Re.x, Re.y, Re.z);
    return this;
  }
  transformDirection(t) {
    for (let e = 0, n = this.count; e < n; e++) Re.fromBufferAttribute(this, e), Re.transformDirection(t), this.setXYZ(e, Re.x, Re.y, Re.z);
    return this;
  }
  getComponent(t, e) {
    let n = this.array[t * this.data.stride + this.offset + e];
    return this.normalized && (n = Ie(n, this.array)), n;
  }
  setComponent(t, e, n) {
    return this.normalized && (n = kt(n, this.array)), this.data.array[t * this.data.stride + this.offset + e] = n, this;
  }
  setX(t, e) {
    return this.normalized && (e = kt(e, this.array)), this.data.array[t * this.data.stride + this.offset] = e, this;
  }
  setY(t, e) {
    return this.normalized && (e = kt(e, this.array)), this.data.array[t * this.data.stride + this.offset + 1] = e, this;
  }
  setZ(t, e) {
    return this.normalized && (e = kt(e, this.array)), this.data.array[t * this.data.stride + this.offset + 2] = e, this;
  }
  setW(t, e) {
    return this.normalized && (e = kt(e, this.array)), this.data.array[t * this.data.stride + this.offset + 3] = e, this;
  }
  getX(t) {
    let e = this.data.array[t * this.data.stride + this.offset];
    return this.normalized && (e = Ie(e, this.array)), e;
  }
  getY(t) {
    let e = this.data.array[t * this.data.stride + this.offset + 1];
    return this.normalized && (e = Ie(e, this.array)), e;
  }
  getZ(t) {
    let e = this.data.array[t * this.data.stride + this.offset + 2];
    return this.normalized && (e = Ie(e, this.array)), e;
  }
  getW(t) {
    let e = this.data.array[t * this.data.stride + this.offset + 3];
    return this.normalized && (e = Ie(e, this.array)), e;
  }
  setXY(t, e, n) {
    return t = t * this.data.stride + this.offset, this.normalized && (e = kt(e, this.array), n = kt(n, this.array)), this.data.array[t + 0] = e, this.data.array[t + 1] = n, this;
  }
  setXYZ(t, e, n, i) {
    return t = t * this.data.stride + this.offset, this.normalized && (e = kt(e, this.array), n = kt(n, this.array), i = kt(i, this.array)), this.data.array[t + 0] = e, this.data.array[t + 1] = n, this.data.array[t + 2] = i, this;
  }
  setXYZW(t, e, n, i, r) {
    return t = t * this.data.stride + this.offset, this.normalized && (e = kt(e, this.array), n = kt(n, this.array), i = kt(i, this.array), r = kt(r, this.array)), this.data.array[t + 0] = e, this.data.array[t + 1] = n, this.data.array[t + 2] = i, this.data.array[t + 3] = r, this;
  }
  clone(t) {
    if (t === void 0) {
      console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
      const e = [];
      for (let n = 0; n < this.count; n++) {
        const i = n * this.data.stride + this.offset;
        for (let r = 0; r < this.itemSize; r++) e.push(this.data.array[i + r]);
      }
      return new ie(new this.array.constructor(e), this.itemSize, this.normalized);
    } else return t.interleavedBuffers === void 0 && (t.interleavedBuffers = {}), t.interleavedBuffers[this.data.uuid] === void 0 && (t.interleavedBuffers[this.data.uuid] = this.data.clone(t)), new Ti(t.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized);
  }
  toJSON(t) {
    if (t === void 0) {
      console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");
      const e = [];
      for (let n = 0; n < this.count; n++) {
        const i = n * this.data.stride + this.offset;
        for (let r = 0; r < this.itemSize; r++) e.push(this.data.array[i + r]);
      }
      return { itemSize: this.itemSize, type: this.array.constructor.name, array: e, normalized: this.normalized };
    } else return t.interleavedBuffers === void 0 && (t.interleavedBuffers = {}), t.interleavedBuffers[this.data.uuid] === void 0 && (t.interleavedBuffers[this.data.uuid] = this.data.toJSON(t)), { isInterleavedBufferAttribute: true, itemSize: this.itemSize, data: this.data.uuid, offset: this.offset, normalized: this.normalized };
  }
}
class _c extends Ce {
  constructor(t) {
    super(), this.isSpriteMaterial = true, this.type = "SpriteMaterial", this.color = new ft(16777215), this.map = null, this.alphaMap = null, this.rotation = 0, this.sizeAttenuation = true, this.transparent = true, this.fog = true, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.alphaMap = t.alphaMap, this.rotation = t.rotation, this.sizeAttenuation = t.sizeAttenuation, this.fog = t.fog, this;
  }
}
let qi;
const vs = new C(), Yi = new C(), Zi = new C(), Ji = new Z(), ys = new Z(), zd = new Pt(), Vr = new C(), Ms = new C(), Hr = new C(), Lh = new Z(), _l = new Z(), Dh = new Z();
class kd extends $t {
  constructor(t = new _c()) {
    if (super(), this.isSprite = true, this.type = "Sprite", qi === void 0) {
      qi = new Ht();
      const e = new Float32Array([-0.5, -0.5, 0, 0, 0, 0.5, -0.5, 0, 1, 0, 0.5, 0.5, 0, 1, 1, -0.5, 0.5, 0, 0, 1]), n = new Mo(e, 5);
      qi.setIndex([0, 1, 2, 0, 2, 3]), qi.setAttribute("position", new Ti(n, 3, 0, false)), qi.setAttribute("uv", new Ti(n, 2, 3, false));
    }
    this.geometry = qi, this.material = t, this.center = new Z(0.5, 0.5);
  }
  raycast(t, e) {
    t.camera === null && console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'), Yi.setFromMatrixScale(this.matrixWorld), zd.copy(t.camera.matrixWorld), this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse, this.matrixWorld), Zi.setFromMatrixPosition(this.modelViewMatrix), t.camera.isPerspectiveCamera && this.material.sizeAttenuation === false && Yi.multiplyScalar(-Zi.z);
    const n = this.material.rotation;
    let i, r;
    n !== 0 && (r = Math.cos(n), i = Math.sin(n));
    const a = this.center;
    Gr(Vr.set(-0.5, -0.5, 0), Zi, a, Yi, i, r), Gr(Ms.set(0.5, -0.5, 0), Zi, a, Yi, i, r), Gr(Hr.set(0.5, 0.5, 0), Zi, a, Yi, i, r), Lh.set(0, 0), _l.set(1, 0), Dh.set(1, 1);
    let o = t.ray.intersectTriangle(Vr, Ms, Hr, false, vs);
    if (o === null && (Gr(Ms.set(-0.5, 0.5, 0), Zi, a, Yi, i, r), _l.set(0, 1), o = t.ray.intersectTriangle(Vr, Hr, Ms, false, vs), o === null)) return;
    const l = t.ray.origin.distanceTo(vs);
    l < t.near || l > t.far || e.push({ distance: l, point: vs.clone(), uv: ze.getInterpolation(vs, Vr, Ms, Hr, Lh, _l, Dh, new Z()), face: null, object: this });
  }
  copy(t, e) {
    return super.copy(t, e), t.center !== void 0 && this.center.copy(t.center), this.material = t.material, this;
  }
}
function Gr(s, t, e, n, i, r) {
  Ji.subVectors(s, e).addScalar(0.5).multiply(n), i !== void 0 ? (ys.x = r * Ji.x - i * Ji.y, ys.y = i * Ji.x + r * Ji.y) : ys.copy(Ji), s.copy(t), s.x += ys.x, s.y += ys.y, s.applyMatrix4(zd);
}
const Wr = new C(), Uh = new C();
class Vd extends $t {
  constructor() {
    super(), this._currentLevel = 0, this.type = "LOD", Object.defineProperties(this, { levels: { enumerable: true, value: [] }, isLOD: { value: true } }), this.autoUpdate = true;
  }
  copy(t) {
    super.copy(t, false);
    const e = t.levels;
    for (let n = 0, i = e.length; n < i; n++) {
      const r = e[n];
      this.addLevel(r.object.clone(), r.distance, r.hysteresis);
    }
    return this.autoUpdate = t.autoUpdate, this;
  }
  addLevel(t, e = 0, n = 0) {
    e = Math.abs(e);
    const i = this.levels;
    let r;
    for (r = 0; r < i.length && !(e < i[r].distance); r++) ;
    return i.splice(r, 0, { distance: e, hysteresis: n, object: t }), this.add(t), this;
  }
  removeLevel(t) {
    const e = this.levels;
    for (let n = 0; n < e.length; n++) if (e[n].distance === t) {
      const i = e.splice(n, 1);
      return this.remove(i[0].object), true;
    }
    return false;
  }
  getCurrentLevel() {
    return this._currentLevel;
  }
  getObjectForDistance(t) {
    const e = this.levels;
    if (e.length > 0) {
      let n, i;
      for (n = 1, i = e.length; n < i; n++) {
        let r = e[n].distance;
        if (e[n].object.visible && (r -= r * e[n].hysteresis), t < r) break;
      }
      return e[n - 1].object;
    }
    return null;
  }
  raycast(t, e) {
    if (this.levels.length > 0) {
      Wr.setFromMatrixPosition(this.matrixWorld);
      const i = t.ray.origin.distanceTo(Wr);
      this.getObjectForDistance(i).raycast(t, e);
    }
  }
  update(t) {
    const e = this.levels;
    if (e.length > 1) {
      Wr.setFromMatrixPosition(t.matrixWorld), Uh.setFromMatrixPosition(this.matrixWorld);
      const n = Wr.distanceTo(Uh) / t.zoom;
      e[0].object.visible = true;
      let i, r;
      for (i = 1, r = e.length; i < r; i++) {
        let a = e[i].distance;
        if (e[i].object.visible && (a -= a * e[i].hysteresis), n >= a) e[i - 1].object.visible = false, e[i].object.visible = true;
        else break;
      }
      for (this._currentLevel = i - 1; i < r; i++) e[i].object.visible = false;
    }
  }
  toJSON(t) {
    const e = super.toJSON(t);
    this.autoUpdate === false && (e.object.autoUpdate = false), e.object.levels = [];
    const n = this.levels;
    for (let i = 0, r = n.length; i < r; i++) {
      const a = n[i];
      e.object.levels.push({ object: a.object.uuid, distance: a.distance, hysteresis: a.hysteresis });
    }
    return e;
  }
}
const Nh = new C(), Fh = new Jt(), Oh = new Jt(), ov = new C(), Bh = new Pt(), Xr = new C(), xl = new Te(), zh = new Pt(), vl = new hs();
class Hd extends _e {
  constructor(t, e) {
    super(t, e), this.isSkinnedMesh = true, this.type = "SkinnedMesh", this.bindMode = Ol, this.bindMatrix = new Pt(), this.bindMatrixInverse = new Pt(), this.boundingBox = null, this.boundingSphere = null;
  }
  computeBoundingBox() {
    const t = this.geometry;
    this.boundingBox === null && (this.boundingBox = new Ue()), this.boundingBox.makeEmpty();
    const e = t.getAttribute("position");
    for (let n = 0; n < e.count; n++) this.getVertexPosition(n, Xr), this.boundingBox.expandByPoint(Xr);
  }
  computeBoundingSphere() {
    const t = this.geometry;
    this.boundingSphere === null && (this.boundingSphere = new Te()), this.boundingSphere.makeEmpty();
    const e = t.getAttribute("position");
    for (let n = 0; n < e.count; n++) this.getVertexPosition(n, Xr), this.boundingSphere.expandByPoint(Xr);
  }
  copy(t, e) {
    return super.copy(t, e), this.bindMode = t.bindMode, this.bindMatrix.copy(t.bindMatrix), this.bindMatrixInverse.copy(t.bindMatrixInverse), this.skeleton = t.skeleton, t.boundingBox !== null && (this.boundingBox = t.boundingBox.clone()), t.boundingSphere !== null && (this.boundingSphere = t.boundingSphere.clone()), this;
  }
  raycast(t, e) {
    const n = this.material, i = this.matrixWorld;
    n !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), xl.copy(this.boundingSphere), xl.applyMatrix4(i), t.ray.intersectsSphere(xl) !== false && (zh.copy(i).invert(), vl.copy(t.ray).applyMatrix4(zh), !(this.boundingBox !== null && vl.intersectsBox(this.boundingBox) === false) && this._computeIntersections(t, e, vl)));
  }
  getVertexPosition(t, e) {
    return super.getVertexPosition(t, e), this.applyBoneTransform(t, e), e;
  }
  bind(t, e) {
    this.skeleton = t, e === void 0 && (this.updateMatrixWorld(true), this.skeleton.calculateInverses(), e = this.matrixWorld), this.bindMatrix.copy(e), this.bindMatrixInverse.copy(e).invert();
  }
  pose() {
    this.skeleton.pose();
  }
  normalizeSkinWeights() {
    const t = new Jt(), e = this.geometry.attributes.skinWeight;
    for (let n = 0, i = e.count; n < i; n++) {
      t.fromBufferAttribute(e, n);
      const r = 1 / t.manhattanLength();
      r !== 1 / 0 ? t.multiplyScalar(r) : t.set(1, 0, 0, 0), e.setXYZW(n, t.x, t.y, t.z, t.w);
    }
  }
  updateMatrixWorld(t) {
    super.updateMatrixWorld(t), this.bindMode === Ol ? this.bindMatrixInverse.copy(this.matrixWorld).invert() : this.bindMode === ld ? this.bindMatrixInverse.copy(this.bindMatrix).invert() : console.warn("THREE.SkinnedMesh: Unrecognized bindMode: " + this.bindMode);
  }
  applyBoneTransform(t, e) {
    const n = this.skeleton, i = this.geometry;
    Fh.fromBufferAttribute(i.attributes.skinIndex, t), Oh.fromBufferAttribute(i.attributes.skinWeight, t), Nh.copy(e).applyMatrix4(this.bindMatrix), e.set(0, 0, 0);
    for (let r = 0; r < 4; r++) {
      const a = Oh.getComponent(r);
      if (a !== 0) {
        const o = Fh.getComponent(r);
        Bh.multiplyMatrices(n.bones[o].matrixWorld, n.boneInverses[o]), e.addScaledVector(ov.copy(Nh).applyMatrix4(Bh), a);
      }
    }
    return e.applyMatrix4(this.bindMatrixInverse);
  }
}
class xc extends $t {
  constructor() {
    super(), this.isBone = true, this.type = "Bone";
  }
}
class fn extends ue {
  constructor(t = null, e = 1, n = 1, i, r, a, o, l, c = Me, h = Me, u, d) {
    super(null, a, o, l, c, h, i, r, u, d), this.isDataTexture = true, this.image = { data: t, width: e, height: n }, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
  }
}
const kh = new Pt(), lv = new Pt();
class So {
  constructor(t = [], e = []) {
    this.uuid = Ye(), this.bones = t.slice(0), this.boneInverses = e, this.boneMatrices = null, this.boneTexture = null, this.init();
  }
  init() {
    const t = this.bones, e = this.boneInverses;
    if (this.boneMatrices = new Float32Array(t.length * 16), e.length === 0) this.calculateInverses();
    else if (t.length !== e.length) {
      console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."), this.boneInverses = [];
      for (let n = 0, i = this.bones.length; n < i; n++) this.boneInverses.push(new Pt());
    }
  }
  calculateInverses() {
    this.boneInverses.length = 0;
    for (let t = 0, e = this.bones.length; t < e; t++) {
      const n = new Pt();
      this.bones[t] && n.copy(this.bones[t].matrixWorld).invert(), this.boneInverses.push(n);
    }
  }
  pose() {
    for (let t = 0, e = this.bones.length; t < e; t++) {
      const n = this.bones[t];
      n && n.matrixWorld.copy(this.boneInverses[t]).invert();
    }
    for (let t = 0, e = this.bones.length; t < e; t++) {
      const n = this.bones[t];
      n && (n.parent && n.parent.isBone ? (n.matrix.copy(n.parent.matrixWorld).invert(), n.matrix.multiply(n.matrixWorld)) : n.matrix.copy(n.matrixWorld), n.matrix.decompose(n.position, n.quaternion, n.scale));
    }
  }
  update() {
    const t = this.bones, e = this.boneInverses, n = this.boneMatrices, i = this.boneTexture;
    for (let r = 0, a = t.length; r < a; r++) {
      const o = t[r] ? t[r].matrixWorld : lv;
      kh.multiplyMatrices(o, e[r]), kh.toArray(n, r * 16);
    }
    i !== null && (i.needsUpdate = true);
  }
  clone() {
    return new So(this.bones, this.boneInverses);
  }
  computeBoneTexture() {
    let t = Math.sqrt(this.bones.length * 4);
    t = Math.ceil(t / 4) * 4, t = Math.max(t, 4);
    const e = new Float32Array(t * t * 4);
    e.set(this.boneMatrices);
    const n = new fn(e, t, t, Le, ke);
    return n.needsUpdate = true, this.boneMatrices = e, this.boneTexture = n, this;
  }
  getBoneByName(t) {
    for (let e = 0, n = this.bones.length; e < n; e++) {
      const i = this.bones[e];
      if (i.name === t) return i;
    }
  }
  dispose() {
    this.boneTexture !== null && (this.boneTexture.dispose(), this.boneTexture = null);
  }
  fromJSON(t, e) {
    this.uuid = t.uuid;
    for (let n = 0, i = t.bones.length; n < i; n++) {
      const r = t.bones[n];
      let a = e[r];
      a === void 0 && (console.warn("THREE.Skeleton: No bone found with UUID:", r), a = new xc()), this.bones.push(a), this.boneInverses.push(new Pt().fromArray(t.boneInverses[n]));
    }
    return this.init(), this;
  }
  toJSON() {
    const t = { metadata: { version: 4.6, type: "Skeleton", generator: "Skeleton.toJSON" }, bones: [], boneInverses: [] };
    t.uuid = this.uuid;
    const e = this.bones, n = this.boneInverses;
    for (let i = 0, r = e.length; i < r; i++) {
      const a = e[i];
      t.bones.push(a.uuid);
      const o = n[i];
      t.boneInverses.push(o.toArray());
    }
    return t;
  }
}
class os extends ie {
  constructor(t, e, n, i = 1) {
    super(t, e, n), this.isInstancedBufferAttribute = true, this.meshPerAttribute = i;
  }
  copy(t) {
    return super.copy(t), this.meshPerAttribute = t.meshPerAttribute, this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.meshPerAttribute = this.meshPerAttribute, t.isInstancedBufferAttribute = true, t;
  }
}
const $i = new Pt(), Vh = new Pt(), qr = [], Hh = new Ue(), cv = new Pt(), Ss = new _e(), bs = new Te();
class Gd extends _e {
  constructor(t, e, n) {
    super(t, e), this.isInstancedMesh = true, this.instanceMatrix = new os(new Float32Array(n * 16), 16), this.instanceColor = null, this.morphTexture = null, this.count = n, this.boundingBox = null, this.boundingSphere = null;
    for (let i = 0; i < n; i++) this.setMatrixAt(i, cv);
  }
  computeBoundingBox() {
    const t = this.geometry, e = this.count;
    this.boundingBox === null && (this.boundingBox = new Ue()), t.boundingBox === null && t.computeBoundingBox(), this.boundingBox.makeEmpty();
    for (let n = 0; n < e; n++) this.getMatrixAt(n, $i), Hh.copy(t.boundingBox).applyMatrix4($i), this.boundingBox.union(Hh);
  }
  computeBoundingSphere() {
    const t = this.geometry, e = this.count;
    this.boundingSphere === null && (this.boundingSphere = new Te()), t.boundingSphere === null && t.computeBoundingSphere(), this.boundingSphere.makeEmpty();
    for (let n = 0; n < e; n++) this.getMatrixAt(n, $i), bs.copy(t.boundingSphere).applyMatrix4($i), this.boundingSphere.union(bs);
  }
  copy(t, e) {
    return super.copy(t, e), this.instanceMatrix.copy(t.instanceMatrix), t.morphTexture !== null && (this.morphTexture = t.morphTexture.clone()), t.instanceColor !== null && (this.instanceColor = t.instanceColor.clone()), this.count = t.count, t.boundingBox !== null && (this.boundingBox = t.boundingBox.clone()), t.boundingSphere !== null && (this.boundingSphere = t.boundingSphere.clone()), this;
  }
  getColorAt(t, e) {
    e.fromArray(this.instanceColor.array, t * 3);
  }
  getMatrixAt(t, e) {
    e.fromArray(this.instanceMatrix.array, t * 16);
  }
  getMorphAt(t, e) {
    const n = e.morphTargetInfluences, i = this.morphTexture.source.data.data, r = n.length + 1, a = t * r + 1;
    for (let o = 0; o < n.length; o++) n[o] = i[a + o];
  }
  raycast(t, e) {
    const n = this.matrixWorld, i = this.count;
    if (Ss.geometry = this.geometry, Ss.material = this.material, Ss.material !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), bs.copy(this.boundingSphere), bs.applyMatrix4(n), t.ray.intersectsSphere(bs) !== false)) for (let r = 0; r < i; r++) {
      this.getMatrixAt(r, $i), Vh.multiplyMatrices(n, $i), Ss.matrixWorld = Vh, Ss.raycast(t, qr);
      for (let a = 0, o = qr.length; a < o; a++) {
        const l = qr[a];
        l.instanceId = r, l.object = this, e.push(l);
      }
      qr.length = 0;
    }
  }
  setColorAt(t, e) {
    this.instanceColor === null && (this.instanceColor = new os(new Float32Array(this.instanceMatrix.count * 3).fill(1), 3)), e.toArray(this.instanceColor.array, t * 3);
  }
  setMatrixAt(t, e) {
    e.toArray(this.instanceMatrix.array, t * 16);
  }
  setMorphAt(t, e) {
    const n = e.morphTargetInfluences, i = n.length + 1;
    this.morphTexture === null && (this.morphTexture = new fn(new Float32Array(i * this.count), i, this.count, lo, ke));
    const r = this.morphTexture.source.data.data;
    let a = 0;
    for (let c = 0; c < n.length; c++) a += n[c];
    const o = this.geometry.morphTargetsRelative ? 1 : 1 - a, l = i * t;
    r[l] = o, r.set(n, l + 1);
  }
  updateMorphTargets() {
  }
  dispose() {
    return this.dispatchEvent({ type: "dispose" }), this.morphTexture !== null && (this.morphTexture.dispose(), this.morphTexture = null), this;
  }
}
function hv(s, t) {
  return s.z - t.z;
}
function uv(s, t) {
  return t.z - s.z;
}
class dv {
  constructor() {
    this.index = 0, this.pool = [], this.list = [];
  }
  push(t, e, n) {
    const i = this.pool, r = this.list;
    this.index >= i.length && i.push({ start: -1, count: -1, z: -1, index: -1 });
    const a = i[this.index];
    r.push(a), this.index++, a.start = t.start, a.count = t.count, a.z = e, a.index = n;
  }
  reset() {
    this.list.length = 0, this.index = 0;
  }
}
const Hn = new Pt(), yl = new Pt(), fv = new Pt(), pv = new ft(1, 1, 1), Gh = new Pt(), Ml = new dr(), Yr = new Ue(), ai = new Te(), ws = new C(), Wh = new C(), mv = new C(), Sl = new dv(), Ae = new _e(), Zr = [];
function gv(s, t, e = 0) {
  const n = t.itemSize;
  if (s.isInterleavedBufferAttribute || s.array.constructor !== t.array.constructor) {
    const i = s.count;
    for (let r = 0; r < i; r++) for (let a = 0; a < n; a++) t.setComponent(r + e, a, s.getComponent(r, a));
  } else t.array.set(s.array, e * n);
  t.needsUpdate = true;
}
class Wd extends _e {
  get maxInstanceCount() {
    return this._maxInstanceCount;
  }
  constructor(t, e, n = e * 2, i) {
    super(new Ht(), i), this.isBatchedMesh = true, this.perObjectFrustumCulled = true, this.sortObjects = true, this.boundingBox = null, this.boundingSphere = null, this.customSort = null, this._drawInfo = [], this._availableInstanceIds = [], this._drawRanges = [], this._reservedRanges = [], this._bounds = [], this._maxInstanceCount = t, this._maxVertexCount = e, this._maxIndexCount = n, this._geometryInitialized = false, this._geometryCount = 0, this._multiDrawCounts = new Int32Array(t), this._multiDrawStarts = new Int32Array(t), this._multiDrawCount = 0, this._multiDrawInstances = null, this._visibilityChanged = true, this._matricesTexture = null, this._indirectTexture = null, this._colorsTexture = null, this._initMatricesTexture(), this._initIndirectTexture();
  }
  _initMatricesTexture() {
    let t = Math.sqrt(this._maxInstanceCount * 4);
    t = Math.ceil(t / 4) * 4, t = Math.max(t, 4);
    const e = new Float32Array(t * t * 4), n = new fn(e, t, t, Le, ke);
    this._matricesTexture = n;
  }
  _initIndirectTexture() {
    let t = Math.sqrt(this._maxInstanceCount);
    t = Math.ceil(t);
    const e = new Uint32Array(t * t), n = new fn(e, t, t, cr, Ln);
    this._indirectTexture = n;
  }
  _initColorsTexture() {
    let t = Math.sqrt(this._maxInstanceCount);
    t = Math.ceil(t);
    const e = new Float32Array(t * t * 4).fill(1), n = new fn(e, t, t, Le, ke);
    n.colorSpace = Qt.workingColorSpace, this._colorsTexture = n;
  }
  _initializeGeometry(t) {
    const e = this.geometry, n = this._maxVertexCount, i = this._maxIndexCount;
    if (this._geometryInitialized === false) {
      for (const r in t.attributes) {
        const a = t.getAttribute(r), { array: o, itemSize: l, normalized: c } = a, h = new o.constructor(n * l), u = new ie(h, l, c);
        e.setAttribute(r, u);
      }
      if (t.getIndex() !== null) {
        const r = n > 65535 ? new Uint32Array(i) : new Uint16Array(i);
        e.setIndex(new ie(r, 1));
      }
      this._geometryInitialized = true;
    }
  }
  _validateGeometry(t) {
    const e = this.geometry;
    if (!!t.getIndex() != !!e.getIndex()) throw new Error('BatchedMesh: All geometries must consistently have "index".');
    for (const n in e.attributes) {
      if (!t.hasAttribute(n)) throw new Error(`BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);
      const i = t.getAttribute(n), r = e.getAttribute(n);
      if (i.itemSize !== r.itemSize || i.normalized !== r.normalized) throw new Error("BatchedMesh: All attributes must have a consistent itemSize and normalized value.");
    }
  }
  setCustomSort(t) {
    return this.customSort = t, this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new Ue());
    const t = this.boundingBox, e = this._drawInfo;
    t.makeEmpty();
    for (let n = 0, i = e.length; n < i; n++) {
      if (e[n].active === false) continue;
      const r = e[n].geometryIndex;
      this.getMatrixAt(n, Hn), this.getBoundingBoxAt(r, Yr).applyMatrix4(Hn), t.union(Yr);
    }
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new Te());
    const t = this.boundingSphere, e = this._drawInfo;
    t.makeEmpty();
    for (let n = 0, i = e.length; n < i; n++) {
      if (e[n].active === false) continue;
      const r = e[n].geometryIndex;
      this.getMatrixAt(n, Hn), this.getBoundingSphereAt(r, ai).applyMatrix4(Hn), t.union(ai);
    }
  }
  addInstance(t) {
    if (this._drawInfo.length >= this.maxInstanceCount && this._availableInstanceIds.length === 0) throw new Error("BatchedMesh: Maximum item count reached.");
    const n = { visible: true, active: true, geometryIndex: t };
    let i = null;
    this._availableInstanceIds.length > 0 ? (i = this._availableInstanceIds.pop(), this._drawInfo[i] = n) : (i = this._drawInfo.length, this._drawInfo.push(n));
    const r = this._matricesTexture, a = r.image.data;
    fv.toArray(a, i * 16), r.needsUpdate = true;
    const o = this._colorsTexture;
    return o && (pv.toArray(o.image.data, i * 4), o.needsUpdate = true), i;
  }
  addGeometry(t, e = -1, n = -1) {
    if (this._initializeGeometry(t), this._validateGeometry(t), this._drawInfo.length >= this._maxInstanceCount) throw new Error("BatchedMesh: Maximum item count reached.");
    const i = { vertexStart: -1, vertexCount: -1, indexStart: -1, indexCount: -1 };
    let r = null;
    const a = this._reservedRanges, o = this._drawRanges, l = this._bounds;
    this._geometryCount !== 0 && (r = a[a.length - 1]), e === -1 ? i.vertexCount = t.getAttribute("position").count : i.vertexCount = e, r === null ? i.vertexStart = 0 : i.vertexStart = r.vertexStart + r.vertexCount;
    const c = t.getIndex(), h = c !== null;
    if (h && (n === -1 ? i.indexCount = c.count : i.indexCount = n, r === null ? i.indexStart = 0 : i.indexStart = r.indexStart + r.indexCount), i.indexStart !== -1 && i.indexStart + i.indexCount > this._maxIndexCount || i.vertexStart + i.vertexCount > this._maxVertexCount) throw new Error("BatchedMesh: Reserved space request exceeds the maximum buffer size.");
    const u = this._geometryCount;
    return this._geometryCount++, a.push(i), o.push({ start: h ? i.indexStart : i.vertexStart, count: -1 }), l.push({ boxInitialized: false, box: new Ue(), sphereInitialized: false, sphere: new Te() }), this.setGeometryAt(u, t), u;
  }
  setGeometryAt(t, e) {
    if (t >= this._geometryCount) throw new Error("BatchedMesh: Maximum geometry count reached.");
    this._validateGeometry(e);
    const n = this.geometry, i = n.getIndex() !== null, r = n.getIndex(), a = e.getIndex(), o = this._reservedRanges[t];
    if (i && a.count > o.indexCount || e.attributes.position.count > o.vertexCount) throw new Error("BatchedMesh: Reserved space not large enough for provided geometry.");
    const l = o.vertexStart, c = o.vertexCount;
    for (const f in n.attributes) {
      const m = e.getAttribute(f), _ = n.getAttribute(f);
      gv(m, _, l);
      const g = m.itemSize;
      for (let p = m.count, y = c; p < y; p++) {
        const x = l + p;
        for (let M = 0; M < g; M++) _.setComponent(x, M, 0);
      }
      _.needsUpdate = true, _.addUpdateRange(l * g, c * g);
    }
    if (i) {
      const f = o.indexStart;
      for (let m = 0; m < a.count; m++) r.setX(f + m, l + a.getX(m));
      for (let m = a.count, _ = o.indexCount; m < _; m++) r.setX(f + m, l);
      r.needsUpdate = true, r.addUpdateRange(f, o.indexCount);
    }
    const h = this._bounds[t];
    e.boundingBox !== null ? (h.box.copy(e.boundingBox), h.boxInitialized = true) : h.boxInitialized = false, e.boundingSphere !== null ? (h.sphere.copy(e.boundingSphere), h.sphereInitialized = true) : h.sphereInitialized = false;
    const u = this._drawRanges[t], d = e.getAttribute("position");
    return u.count = i ? a.count : d.count, this._visibilityChanged = true, t;
  }
  deleteInstance(t) {
    const e = this._drawInfo;
    return t >= e.length || e[t].active === false ? this : (e[t].active = false, this._availableInstanceIds.push(t), this._visibilityChanged = true, this);
  }
  getBoundingBoxAt(t, e) {
    if (t >= this._geometryCount) return null;
    const n = this._bounds[t], i = n.box, r = this.geometry;
    if (n.boxInitialized === false) {
      i.makeEmpty();
      const a = r.index, o = r.attributes.position, l = this._drawRanges[t];
      for (let c = l.start, h = l.start + l.count; c < h; c++) {
        let u = c;
        a && (u = a.getX(u)), i.expandByPoint(ws.fromBufferAttribute(o, u));
      }
      n.boxInitialized = true;
    }
    return e.copy(i), e;
  }
  getBoundingSphereAt(t, e) {
    if (t >= this._geometryCount) return null;
    const n = this._bounds[t], i = n.sphere, r = this.geometry;
    if (n.sphereInitialized === false) {
      i.makeEmpty(), this.getBoundingBoxAt(t, Yr), Yr.getCenter(i.center);
      const a = r.index, o = r.attributes.position, l = this._drawRanges[t];
      let c = 0;
      for (let h = l.start, u = l.start + l.count; h < u; h++) {
        let d = h;
        a && (d = a.getX(d)), ws.fromBufferAttribute(o, d), c = Math.max(c, i.center.distanceToSquared(ws));
      }
      i.radius = Math.sqrt(c), n.sphereInitialized = true;
    }
    return e.copy(i), e;
  }
  setMatrixAt(t, e) {
    const n = this._drawInfo, i = this._matricesTexture, r = this._matricesTexture.image.data;
    return t >= n.length || n[t].active === false ? this : (e.toArray(r, t * 16), i.needsUpdate = true, this);
  }
  getMatrixAt(t, e) {
    const n = this._drawInfo, i = this._matricesTexture.image.data;
    return t >= n.length || n[t].active === false ? null : e.fromArray(i, t * 16);
  }
  setColorAt(t, e) {
    this._colorsTexture === null && this._initColorsTexture();
    const n = this._colorsTexture, i = this._colorsTexture.image.data, r = this._drawInfo;
    return t >= r.length || r[t].active === false ? this : (e.toArray(i, t * 4), n.needsUpdate = true, this);
  }
  getColorAt(t, e) {
    const n = this._colorsTexture.image.data, i = this._drawInfo;
    return t >= i.length || i[t].active === false ? null : e.fromArray(n, t * 4);
  }
  setVisibleAt(t, e) {
    const n = this._drawInfo;
    return t >= n.length || n[t].active === false || n[t].visible === e ? this : (n[t].visible = e, this._visibilityChanged = true, this);
  }
  getVisibleAt(t) {
    const e = this._drawInfo;
    return t >= e.length || e[t].active === false ? false : e[t].visible;
  }
  setGeometryIdAt(t, e) {
    const n = this._drawInfo;
    return t >= n.length || n[t].active === false || e < 0 || e >= this._geometryCount ? null : (n[t].geometryIndex = e, this);
  }
  getGeometryIdAt(t) {
    const e = this._drawInfo;
    return t >= e.length || e[t].active === false ? -1 : e[t].geometryIndex;
  }
  getGeometryRangeAt(t, e = {}) {
    if (t < 0 || t >= this._geometryCount) return null;
    const n = this._drawRanges[t];
    return e.start = n.start, e.count = n.count, e;
  }
  raycast(t, e) {
    const n = this._drawInfo, i = this._drawRanges, r = this.matrixWorld, a = this.geometry;
    Ae.material = this.material, Ae.geometry.index = a.index, Ae.geometry.attributes = a.attributes, Ae.geometry.boundingBox === null && (Ae.geometry.boundingBox = new Ue()), Ae.geometry.boundingSphere === null && (Ae.geometry.boundingSphere = new Te());
    for (let o = 0, l = n.length; o < l; o++) {
      if (!n[o].visible || !n[o].active) continue;
      const c = n[o].geometryIndex, h = i[c];
      Ae.geometry.setDrawRange(h.start, h.count), this.getMatrixAt(o, Ae.matrixWorld).premultiply(r), this.getBoundingBoxAt(c, Ae.geometry.boundingBox), this.getBoundingSphereAt(c, Ae.geometry.boundingSphere), Ae.raycast(t, Zr);
      for (let u = 0, d = Zr.length; u < d; u++) {
        const f = Zr[u];
        f.object = this, f.batchId = o, e.push(f);
      }
      Zr.length = 0;
    }
    Ae.material = null, Ae.geometry.index = null, Ae.geometry.attributes = {}, Ae.geometry.setDrawRange(0, 1 / 0);
  }
  copy(t) {
    return super.copy(t), this.geometry = t.geometry.clone(), this.perObjectFrustumCulled = t.perObjectFrustumCulled, this.sortObjects = t.sortObjects, this.boundingBox = t.boundingBox !== null ? t.boundingBox.clone() : null, this.boundingSphere = t.boundingSphere !== null ? t.boundingSphere.clone() : null, this._drawRanges = t._drawRanges.map((e) => ({ ...e })), this._reservedRanges = t._reservedRanges.map((e) => ({ ...e })), this._drawInfo = t._drawInfo.map((e) => ({ ...e })), this._bounds = t._bounds.map((e) => ({ boxInitialized: e.boxInitialized, box: e.box.clone(), sphereInitialized: e.sphereInitialized, sphere: e.sphere.clone() })), this._maxInstanceCount = t._maxInstanceCount, this._maxVertexCount = t._maxVertexCount, this._maxIndexCount = t._maxIndexCount, this._geometryInitialized = t._geometryInitialized, this._geometryCount = t._geometryCount, this._multiDrawCounts = t._multiDrawCounts.slice(), this._multiDrawStarts = t._multiDrawStarts.slice(), this._matricesTexture = t._matricesTexture.clone(), this._matricesTexture.image.data = this._matricesTexture.image.data.slice(), this._colorsTexture !== null && (this._colorsTexture = t._colorsTexture.clone(), this._colorsTexture.image.data = this._colorsTexture.image.data.slice()), this;
  }
  dispose() {
    return this.geometry.dispose(), this._matricesTexture.dispose(), this._matricesTexture = null, this._indirectTexture.dispose(), this._indirectTexture = null, this._colorsTexture !== null && (this._colorsTexture.dispose(), this._colorsTexture = null), this;
  }
  onBeforeRender(t, e, n, i, r) {
    if (!this._visibilityChanged && !this.perObjectFrustumCulled && !this.sortObjects) return;
    const a = i.getIndex(), o = a === null ? 1 : a.array.BYTES_PER_ELEMENT, l = this._drawInfo, c = this._multiDrawStarts, h = this._multiDrawCounts, u = this._drawRanges, d = this.perObjectFrustumCulled, f = this._indirectTexture, m = f.image.data;
    d && (Gh.multiplyMatrices(n.projectionMatrix, n.matrixWorldInverse).multiply(this.matrixWorld), Ml.setFromProjectionMatrix(Gh, t.coordinateSystem));
    let _ = 0;
    if (this.sortObjects) {
      yl.copy(this.matrixWorld).invert(), ws.setFromMatrixPosition(n.matrixWorld).applyMatrix4(yl), Wh.set(0, 0, -1).transformDirection(n.matrixWorld).transformDirection(yl);
      for (let y = 0, x = l.length; y < x; y++) if (l[y].visible && l[y].active) {
        const M = l[y].geometryIndex;
        this.getMatrixAt(y, Hn), this.getBoundingSphereAt(M, ai).applyMatrix4(Hn);
        let I = false;
        if (d && (I = !Ml.intersectsSphere(ai)), !I) {
          const E = mv.subVectors(ai.center, ws).dot(Wh);
          Sl.push(u[M], E, y);
        }
      }
      const g = Sl.list, p = this.customSort;
      p === null ? g.sort(r.transparent ? uv : hv) : p.call(this, g, n);
      for (let y = 0, x = g.length; y < x; y++) {
        const M = g[y];
        c[_] = M.start * o, h[_] = M.count, m[_] = M.index, _++;
      }
      Sl.reset();
    } else for (let g = 0, p = l.length; g < p; g++) if (l[g].visible && l[g].active) {
      const y = l[g].geometryIndex;
      let x = false;
      if (d && (this.getMatrixAt(g, Hn), this.getBoundingSphereAt(y, ai).applyMatrix4(Hn), x = !Ml.intersectsSphere(ai)), !x) {
        const M = u[y];
        c[_] = M.start * o, h[_] = M.count, m[_] = g, _++;
      }
    }
    f.needsUpdate = true, this._multiDrawCount = _, this._visibilityChanged = false;
  }
  onBeforeShadow(t, e, n, i, r, a) {
    this.onBeforeRender(t, null, i, r, a);
  }
}
class Ne extends Ce {
  constructor(t) {
    super(), this.isLineBasicMaterial = true, this.type = "LineBasicMaterial", this.color = new ft(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = true, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.linewidth = t.linewidth, this.linecap = t.linecap, this.linejoin = t.linejoin, this.fog = t.fog, this;
  }
}
const to = new C(), eo = new C(), Xh = new Pt(), Es = new hs(), Jr = new Te(), bl = new C(), qh = new C();
class Zn extends $t {
  constructor(t = new Ht(), e = new Ne()) {
    super(), this.isLine = true, this.type = "Line", this.geometry = t, this.material = e, this.updateMorphTargets();
  }
  copy(t, e) {
    return super.copy(t, e), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
  }
  computeLineDistances() {
    const t = this.geometry;
    if (t.index === null) {
      const e = t.attributes.position, n = [0];
      for (let i = 1, r = e.count; i < r; i++) to.fromBufferAttribute(e, i - 1), eo.fromBufferAttribute(e, i), n[i] = n[i - 1], n[i] += to.distanceTo(eo);
      t.setAttribute("lineDistance", new wt(n, 1));
    } else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
  raycast(t, e) {
    const n = this.geometry, i = this.matrixWorld, r = t.params.Line.threshold, a = n.drawRange;
    if (n.boundingSphere === null && n.computeBoundingSphere(), Jr.copy(n.boundingSphere), Jr.applyMatrix4(i), Jr.radius += r, t.ray.intersectsSphere(Jr) === false) return;
    Xh.copy(i).invert(), Es.copy(t.ray).applyMatrix4(Xh);
    const o = r / ((this.scale.x + this.scale.y + this.scale.z) / 3), l = o * o, c = this.isLineSegments ? 2 : 1, h = n.index, d = n.attributes.position;
    if (h !== null) {
      const f = Math.max(0, a.start), m = Math.min(h.count, a.start + a.count);
      for (let _ = f, g = m - 1; _ < g; _ += c) {
        const p = h.getX(_), y = h.getX(_ + 1), x = $r(this, t, Es, l, p, y);
        x && e.push(x);
      }
      if (this.isLineLoop) {
        const _ = h.getX(m - 1), g = h.getX(f), p = $r(this, t, Es, l, _, g);
        p && e.push(p);
      }
    } else {
      const f = Math.max(0, a.start), m = Math.min(d.count, a.start + a.count);
      for (let _ = f, g = m - 1; _ < g; _ += c) {
        const p = $r(this, t, Es, l, _, _ + 1);
        p && e.push(p);
      }
      if (this.isLineLoop) {
        const _ = $r(this, t, Es, l, m - 1, f);
        _ && e.push(_);
      }
    }
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, n = Object.keys(e);
    if (n.length > 0) {
      const i = e[n[0]];
      if (i !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let r = 0, a = i.length; r < a; r++) {
          const o = i[r].name || String(r);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = r;
        }
      }
    }
  }
}
function $r(s, t, e, n, i, r) {
  const a = s.geometry.attributes.position;
  if (to.fromBufferAttribute(a, i), eo.fromBufferAttribute(a, r), e.distanceSqToSegment(to, eo, bl, qh) > n) return;
  bl.applyMatrix4(s.matrixWorld);
  const l = t.ray.origin.distanceTo(bl);
  if (!(l < t.near || l > t.far)) return { distance: l, point: qh.clone().applyMatrix4(s.matrixWorld), index: i, face: null, faceIndex: null, barycoord: null, object: s };
}
const Yh = new C(), Zh = new C();
class _n extends Zn {
  constructor(t, e) {
    super(t, e), this.isLineSegments = true, this.type = "LineSegments";
  }
  computeLineDistances() {
    const t = this.geometry;
    if (t.index === null) {
      const e = t.attributes.position, n = [];
      for (let i = 0, r = e.count; i < r; i += 2) Yh.fromBufferAttribute(e, i), Zh.fromBufferAttribute(e, i + 1), n[i] = i === 0 ? 0 : n[i - 1], n[i + 1] = n[i] + Yh.distanceTo(Zh);
      t.setAttribute("lineDistance", new wt(n, 1));
    } else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
}
class Xd extends Zn {
  constructor(t, e) {
    super(t, e), this.isLineLoop = true, this.type = "LineLoop";
  }
}
class vc extends Ce {
  constructor(t) {
    super(), this.isPointsMaterial = true, this.type = "PointsMaterial", this.color = new ft(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = true, this.fog = true, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.alphaMap = t.alphaMap, this.size = t.size, this.sizeAttenuation = t.sizeAttenuation, this.fog = t.fog, this;
  }
}
const Jh = new Pt(), Gl = new hs(), Kr = new Te(), Qr = new C();
class qd extends $t {
  constructor(t = new Ht(), e = new vc()) {
    super(), this.isPoints = true, this.type = "Points", this.geometry = t, this.material = e, this.updateMorphTargets();
  }
  copy(t, e) {
    return super.copy(t, e), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
  }
  raycast(t, e) {
    const n = this.geometry, i = this.matrixWorld, r = t.params.Points.threshold, a = n.drawRange;
    if (n.boundingSphere === null && n.computeBoundingSphere(), Kr.copy(n.boundingSphere), Kr.applyMatrix4(i), Kr.radius += r, t.ray.intersectsSphere(Kr) === false) return;
    Jh.copy(i).invert(), Gl.copy(t.ray).applyMatrix4(Jh);
    const o = r / ((this.scale.x + this.scale.y + this.scale.z) / 3), l = o * o, c = n.index, u = n.attributes.position;
    if (c !== null) {
      const d = Math.max(0, a.start), f = Math.min(c.count, a.start + a.count);
      for (let m = d, _ = f; m < _; m++) {
        const g = c.getX(m);
        Qr.fromBufferAttribute(u, g), $h(Qr, g, l, i, t, e, this);
      }
    } else {
      const d = Math.max(0, a.start), f = Math.min(u.count, a.start + a.count);
      for (let m = d, _ = f; m < _; m++) Qr.fromBufferAttribute(u, m), $h(Qr, m, l, i, t, e, this);
    }
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, n = Object.keys(e);
    if (n.length > 0) {
      const i = e[n[0]];
      if (i !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let r = 0, a = i.length; r < a; r++) {
          const o = i[r].name || String(r);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = r;
        }
      }
    }
  }
}
function $h(s, t, e, n, i, r, a) {
  const o = Gl.distanceSqToPoint(s);
  if (o < e) {
    const l = new C();
    Gl.closestPointToPoint(s, l), l.applyMatrix4(n);
    const c = i.ray.origin.distanceTo(l);
    if (c < i.near || c > i.far) return;
    r.push({ distance: c, distanceToRay: Math.sqrt(o), point: l, index: t, face: null, faceIndex: null, barycoord: null, object: a });
  }
}
class _v extends ue {
  constructor(t, e, n, i, r, a, o, l, c) {
    super(t, e, n, i, r, a, o, l, c), this.isVideoTexture = true, this.minFilter = a !== void 0 ? a : ge, this.magFilter = r !== void 0 ? r : ge, this.generateMipmaps = false;
    const h = this;
    function u() {
      h.needsUpdate = true, t.requestVideoFrameCallback(u);
    }
    "requestVideoFrameCallback" in t && t.requestVideoFrameCallback(u);
  }
  clone() {
    return new this.constructor(this.image).copy(this);
  }
  update() {
    const t = this.image;
    "requestVideoFrameCallback" in t === false && t.readyState >= t.HAVE_CURRENT_DATA && (this.needsUpdate = true);
  }
}
class xv extends ue {
  constructor(t, e) {
    super({ width: t, height: e }), this.isFramebufferTexture = true, this.magFilter = Me, this.minFilter = Me, this.generateMipmaps = false, this.needsUpdate = true;
  }
}
class bo extends ue {
  constructor(t, e, n, i, r, a, o, l, c, h, u, d) {
    super(null, a, o, l, c, h, i, r, u, d), this.isCompressedTexture = true, this.image = { width: e, height: n }, this.mipmaps = t, this.flipY = false, this.generateMipmaps = false;
  }
}
class vv extends bo {
  constructor(t, e, n, i, r, a) {
    super(t, e, n, r, a), this.isCompressedArrayTexture = true, this.image.depth = i, this.wrapR = Qe, this.layerUpdates = /* @__PURE__ */ new Set();
  }
  addLayerUpdate(t) {
    this.layerUpdates.add(t);
  }
  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}
class yv extends bo {
  constructor(t, e, n) {
    super(void 0, t[0].width, t[0].height, e, n, In), this.isCompressedCubeTexture = true, this.isCubeTexture = true, this.image = t;
  }
}
class Mv extends ue {
  constructor(t, e, n, i, r, a, o, l, c) {
    super(t, e, n, i, r, a, o, l, c), this.isCanvasTexture = true, this.needsUpdate = true;
  }
}
class on {
  constructor() {
    this.type = "Curve", this.arcLengthDivisions = 200;
  }
  getPoint() {
    return console.warn("THREE.Curve: .getPoint() not implemented."), null;
  }
  getPointAt(t, e) {
    const n = this.getUtoTmapping(t);
    return this.getPoint(n, e);
  }
  getPoints(t = 5) {
    const e = [];
    for (let n = 0; n <= t; n++) e.push(this.getPoint(n / t));
    return e;
  }
  getSpacedPoints(t = 5) {
    const e = [];
    for (let n = 0; n <= t; n++) e.push(this.getPointAt(n / t));
    return e;
  }
  getLength() {
    const t = this.getLengths();
    return t[t.length - 1];
  }
  getLengths(t = this.arcLengthDivisions) {
    if (this.cacheArcLengths && this.cacheArcLengths.length === t + 1 && !this.needsUpdate) return this.cacheArcLengths;
    this.needsUpdate = false;
    const e = [];
    let n, i = this.getPoint(0), r = 0;
    e.push(0);
    for (let a = 1; a <= t; a++) n = this.getPoint(a / t), r += n.distanceTo(i), e.push(r), i = n;
    return this.cacheArcLengths = e, e;
  }
  updateArcLengths() {
    this.needsUpdate = true, this.getLengths();
  }
  getUtoTmapping(t, e) {
    const n = this.getLengths();
    let i = 0;
    const r = n.length;
    let a;
    e ? a = e : a = t * n[r - 1];
    let o = 0, l = r - 1, c;
    for (; o <= l; ) if (i = Math.floor(o + (l - o) / 2), c = n[i] - a, c < 0) o = i + 1;
    else if (c > 0) l = i - 1;
    else {
      l = i;
      break;
    }
    if (i = l, n[i] === a) return i / (r - 1);
    const h = n[i], d = n[i + 1] - h, f = (a - h) / d;
    return (i + f) / (r - 1);
  }
  getTangent(t, e) {
    let i = t - 1e-4, r = t + 1e-4;
    i < 0 && (i = 0), r > 1 && (r = 1);
    const a = this.getPoint(i), o = this.getPoint(r), l = e || (a.isVector2 ? new Z() : new C());
    return l.copy(o).sub(a).normalize(), l;
  }
  getTangentAt(t, e) {
    const n = this.getUtoTmapping(t);
    return this.getTangent(n, e);
  }
  computeFrenetFrames(t, e) {
    const n = new C(), i = [], r = [], a = [], o = new C(), l = new Pt();
    for (let f = 0; f <= t; f++) {
      const m = f / t;
      i[f] = this.getTangentAt(m, new C());
    }
    r[0] = new C(), a[0] = new C();
    let c = Number.MAX_VALUE;
    const h = Math.abs(i[0].x), u = Math.abs(i[0].y), d = Math.abs(i[0].z);
    h <= c && (c = h, n.set(1, 0, 0)), u <= c && (c = u, n.set(0, 1, 0)), d <= c && n.set(0, 0, 1), o.crossVectors(i[0], n).normalize(), r[0].crossVectors(i[0], o), a[0].crossVectors(i[0], r[0]);
    for (let f = 1; f <= t; f++) {
      if (r[f] = r[f - 1].clone(), a[f] = a[f - 1].clone(), o.crossVectors(i[f - 1], i[f]), o.length() > Number.EPSILON) {
        o.normalize();
        const m = Math.acos(he(i[f - 1].dot(i[f]), -1, 1));
        r[f].applyMatrix4(l.makeRotationAxis(o, m));
      }
      a[f].crossVectors(i[f], r[f]);
    }
    if (e === true) {
      let f = Math.acos(he(r[0].dot(r[t]), -1, 1));
      f /= t, i[0].dot(o.crossVectors(r[0], r[t])) > 0 && (f = -f);
      for (let m = 1; m <= t; m++) r[m].applyMatrix4(l.makeRotationAxis(i[m], f * m)), a[m].crossVectors(i[m], r[m]);
    }
    return { tangents: i, normals: r, binormals: a };
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.arcLengthDivisions = t.arcLengthDivisions, this;
  }
  toJSON() {
    const t = { metadata: { version: 4.6, type: "Curve", generator: "Curve.toJSON" } };
    return t.arcLengthDivisions = this.arcLengthDivisions, t.type = this.type, t;
  }
  fromJSON(t) {
    return this.arcLengthDivisions = t.arcLengthDivisions, this;
  }
}
class wo extends on {
  constructor(t = 0, e = 0, n = 1, i = 1, r = 0, a = Math.PI * 2, o = false, l = 0) {
    super(), this.isEllipseCurve = true, this.type = "EllipseCurve", this.aX = t, this.aY = e, this.xRadius = n, this.yRadius = i, this.aStartAngle = r, this.aEndAngle = a, this.aClockwise = o, this.aRotation = l;
  }
  getPoint(t, e = new Z()) {
    const n = e, i = Math.PI * 2;
    let r = this.aEndAngle - this.aStartAngle;
    const a = Math.abs(r) < Number.EPSILON;
    for (; r < 0; ) r += i;
    for (; r > i; ) r -= i;
    r < Number.EPSILON && (a ? r = 0 : r = i), this.aClockwise === true && !a && (r === i ? r = -i : r = r - i);
    const o = this.aStartAngle + t * r;
    let l = this.aX + this.xRadius * Math.cos(o), c = this.aY + this.yRadius * Math.sin(o);
    if (this.aRotation !== 0) {
      const h = Math.cos(this.aRotation), u = Math.sin(this.aRotation), d = l - this.aX, f = c - this.aY;
      l = d * h - f * u + this.aX, c = d * u + f * h + this.aY;
    }
    return n.set(l, c);
  }
  copy(t) {
    return super.copy(t), this.aX = t.aX, this.aY = t.aY, this.xRadius = t.xRadius, this.yRadius = t.yRadius, this.aStartAngle = t.aStartAngle, this.aEndAngle = t.aEndAngle, this.aClockwise = t.aClockwise, this.aRotation = t.aRotation, this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.aX = this.aX, t.aY = this.aY, t.xRadius = this.xRadius, t.yRadius = this.yRadius, t.aStartAngle = this.aStartAngle, t.aEndAngle = this.aEndAngle, t.aClockwise = this.aClockwise, t.aRotation = this.aRotation, t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.aX = t.aX, this.aY = t.aY, this.xRadius = t.xRadius, this.yRadius = t.yRadius, this.aStartAngle = t.aStartAngle, this.aEndAngle = t.aEndAngle, this.aClockwise = t.aClockwise, this.aRotation = t.aRotation, this;
  }
}
class Yd extends wo {
  constructor(t, e, n, i, r, a) {
    super(t, e, n, n, i, r, a), this.isArcCurve = true, this.type = "ArcCurve";
  }
}
function yc() {
  let s = 0, t = 0, e = 0, n = 0;
  function i(r, a, o, l) {
    s = r, t = o, e = -3 * r + 3 * a - 2 * o - l, n = 2 * r - 2 * a + o + l;
  }
  return { initCatmullRom: function(r, a, o, l, c) {
    i(a, o, c * (o - r), c * (l - a));
  }, initNonuniformCatmullRom: function(r, a, o, l, c, h, u) {
    let d = (a - r) / c - (o - r) / (c + h) + (o - a) / h, f = (o - a) / h - (l - a) / (h + u) + (l - o) / u;
    d *= h, f *= h, i(a, o, d, f);
  }, calc: function(r) {
    const a = r * r, o = a * r;
    return s + t * r + e * a + n * o;
  } };
}
const jr = new C(), wl = new yc(), El = new yc(), Al = new yc();
class Zd extends on {
  constructor(t = [], e = false, n = "centripetal", i = 0.5) {
    super(), this.isCatmullRomCurve3 = true, this.type = "CatmullRomCurve3", this.points = t, this.closed = e, this.curveType = n, this.tension = i;
  }
  getPoint(t, e = new C()) {
    const n = e, i = this.points, r = i.length, a = (r - (this.closed ? 0 : 1)) * t;
    let o = Math.floor(a), l = a - o;
    this.closed ? o += o > 0 ? 0 : (Math.floor(Math.abs(o) / r) + 1) * r : l === 0 && o === r - 1 && (o = r - 2, l = 1);
    let c, h;
    this.closed || o > 0 ? c = i[(o - 1) % r] : (jr.subVectors(i[0], i[1]).add(i[0]), c = jr);
    const u = i[o % r], d = i[(o + 1) % r];
    if (this.closed || o + 2 < r ? h = i[(o + 2) % r] : (jr.subVectors(i[r - 1], i[r - 2]).add(i[r - 1]), h = jr), this.curveType === "centripetal" || this.curveType === "chordal") {
      const f = this.curveType === "chordal" ? 0.5 : 0.25;
      let m = Math.pow(c.distanceToSquared(u), f), _ = Math.pow(u.distanceToSquared(d), f), g = Math.pow(d.distanceToSquared(h), f);
      _ < 1e-4 && (_ = 1), m < 1e-4 && (m = _), g < 1e-4 && (g = _), wl.initNonuniformCatmullRom(c.x, u.x, d.x, h.x, m, _, g), El.initNonuniformCatmullRom(c.y, u.y, d.y, h.y, m, _, g), Al.initNonuniformCatmullRom(c.z, u.z, d.z, h.z, m, _, g);
    } else this.curveType === "catmullrom" && (wl.initCatmullRom(c.x, u.x, d.x, h.x, this.tension), El.initCatmullRom(c.y, u.y, d.y, h.y, this.tension), Al.initCatmullRom(c.z, u.z, d.z, h.z, this.tension));
    return n.set(wl.calc(l), El.calc(l), Al.calc(l)), n;
  }
  copy(t) {
    super.copy(t), this.points = [];
    for (let e = 0, n = t.points.length; e < n; e++) {
      const i = t.points[e];
      this.points.push(i.clone());
    }
    return this.closed = t.closed, this.curveType = t.curveType, this.tension = t.tension, this;
  }
  toJSON() {
    const t = super.toJSON();
    t.points = [];
    for (let e = 0, n = this.points.length; e < n; e++) {
      const i = this.points[e];
      t.points.push(i.toArray());
    }
    return t.closed = this.closed, t.curveType = this.curveType, t.tension = this.tension, t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.points = [];
    for (let e = 0, n = t.points.length; e < n; e++) {
      const i = t.points[e];
      this.points.push(new C().fromArray(i));
    }
    return this.closed = t.closed, this.curveType = t.curveType, this.tension = t.tension, this;
  }
}
function Kh(s, t, e, n, i) {
  const r = (n - t) * 0.5, a = (i - e) * 0.5, o = s * s, l = s * o;
  return (2 * e - 2 * n + r + a) * l + (-3 * e + 3 * n - 2 * r - a) * o + r * s + e;
}
function Sv(s, t) {
  const e = 1 - s;
  return e * e * t;
}
function bv(s, t) {
  return 2 * (1 - s) * s * t;
}
function wv(s, t) {
  return s * s * t;
}
function Bs(s, t, e, n) {
  return Sv(s, t) + bv(s, e) + wv(s, n);
}
function Ev(s, t) {
  const e = 1 - s;
  return e * e * e * t;
}
function Av(s, t) {
  const e = 1 - s;
  return 3 * e * e * s * t;
}
function Tv(s, t) {
  return 3 * (1 - s) * s * s * t;
}
function Cv(s, t) {
  return s * s * s * t;
}
function zs(s, t, e, n, i) {
  return Ev(s, t) + Av(s, e) + Tv(s, n) + Cv(s, i);
}
class Mc extends on {
  constructor(t = new Z(), e = new Z(), n = new Z(), i = new Z()) {
    super(), this.isCubicBezierCurve = true, this.type = "CubicBezierCurve", this.v0 = t, this.v1 = e, this.v2 = n, this.v3 = i;
  }
  getPoint(t, e = new Z()) {
    const n = e, i = this.v0, r = this.v1, a = this.v2, o = this.v3;
    return n.set(zs(t, i.x, r.x, a.x, o.x), zs(t, i.y, r.y, a.y, o.y)), n;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this.v3.copy(t.v3), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t.v3 = this.v3.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this.v3.fromArray(t.v3), this;
  }
}
class Jd extends on {
  constructor(t = new C(), e = new C(), n = new C(), i = new C()) {
    super(), this.isCubicBezierCurve3 = true, this.type = "CubicBezierCurve3", this.v0 = t, this.v1 = e, this.v2 = n, this.v3 = i;
  }
  getPoint(t, e = new C()) {
    const n = e, i = this.v0, r = this.v1, a = this.v2, o = this.v3;
    return n.set(zs(t, i.x, r.x, a.x, o.x), zs(t, i.y, r.y, a.y, o.y), zs(t, i.z, r.z, a.z, o.z)), n;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this.v3.copy(t.v3), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t.v3 = this.v3.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this.v3.fromArray(t.v3), this;
  }
}
class Sc extends on {
  constructor(t = new Z(), e = new Z()) {
    super(), this.isLineCurve = true, this.type = "LineCurve", this.v1 = t, this.v2 = e;
  }
  getPoint(t, e = new Z()) {
    const n = e;
    return t === 1 ? n.copy(this.v2) : (n.copy(this.v2).sub(this.v1), n.multiplyScalar(t).add(this.v1)), n;
  }
  getPointAt(t, e) {
    return this.getPoint(t, e);
  }
  getTangent(t, e = new Z()) {
    return e.subVectors(this.v2, this.v1).normalize();
  }
  getTangentAt(t, e) {
    return this.getTangent(t, e);
  }
  copy(t) {
    return super.copy(t), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class $d extends on {
  constructor(t = new C(), e = new C()) {
    super(), this.isLineCurve3 = true, this.type = "LineCurve3", this.v1 = t, this.v2 = e;
  }
  getPoint(t, e = new C()) {
    const n = e;
    return t === 1 ? n.copy(this.v2) : (n.copy(this.v2).sub(this.v1), n.multiplyScalar(t).add(this.v1)), n;
  }
  getPointAt(t, e) {
    return this.getPoint(t, e);
  }
  getTangent(t, e = new C()) {
    return e.subVectors(this.v2, this.v1).normalize();
  }
  getTangentAt(t, e) {
    return this.getTangent(t, e);
  }
  copy(t) {
    return super.copy(t), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class bc extends on {
  constructor(t = new Z(), e = new Z(), n = new Z()) {
    super(), this.isQuadraticBezierCurve = true, this.type = "QuadraticBezierCurve", this.v0 = t, this.v1 = e, this.v2 = n;
  }
  getPoint(t, e = new Z()) {
    const n = e, i = this.v0, r = this.v1, a = this.v2;
    return n.set(Bs(t, i.x, r.x, a.x), Bs(t, i.y, r.y, a.y)), n;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class wc extends on {
  constructor(t = new C(), e = new C(), n = new C()) {
    super(), this.isQuadraticBezierCurve3 = true, this.type = "QuadraticBezierCurve3", this.v0 = t, this.v1 = e, this.v2 = n;
  }
  getPoint(t, e = new C()) {
    const n = e, i = this.v0, r = this.v1, a = this.v2;
    return n.set(Bs(t, i.x, r.x, a.x), Bs(t, i.y, r.y, a.y), Bs(t, i.z, r.z, a.z)), n;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class Ec extends on {
  constructor(t = []) {
    super(), this.isSplineCurve = true, this.type = "SplineCurve", this.points = t;
  }
  getPoint(t, e = new Z()) {
    const n = e, i = this.points, r = (i.length - 1) * t, a = Math.floor(r), o = r - a, l = i[a === 0 ? a : a - 1], c = i[a], h = i[a > i.length - 2 ? i.length - 1 : a + 1], u = i[a > i.length - 3 ? i.length - 1 : a + 2];
    return n.set(Kh(o, l.x, c.x, h.x, u.x), Kh(o, l.y, c.y, h.y, u.y)), n;
  }
  copy(t) {
    super.copy(t), this.points = [];
    for (let e = 0, n = t.points.length; e < n; e++) {
      const i = t.points[e];
      this.points.push(i.clone());
    }
    return this;
  }
  toJSON() {
    const t = super.toJSON();
    t.points = [];
    for (let e = 0, n = this.points.length; e < n; e++) {
      const i = this.points[e];
      t.points.push(i.toArray());
    }
    return t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.points = [];
    for (let e = 0, n = t.points.length; e < n; e++) {
      const i = t.points[e];
      this.points.push(new Z().fromArray(i));
    }
    return this;
  }
}
var no = Object.freeze({ __proto__: null, ArcCurve: Yd, CatmullRomCurve3: Zd, CubicBezierCurve: Mc, CubicBezierCurve3: Jd, EllipseCurve: wo, LineCurve: Sc, LineCurve3: $d, QuadraticBezierCurve: bc, QuadraticBezierCurve3: wc, SplineCurve: Ec });
class Kd extends on {
  constructor() {
    super(), this.type = "CurvePath", this.curves = [], this.autoClose = false;
  }
  add(t) {
    this.curves.push(t);
  }
  closePath() {
    const t = this.curves[0].getPoint(0), e = this.curves[this.curves.length - 1].getPoint(1);
    if (!t.equals(e)) {
      const n = t.isVector2 === true ? "LineCurve" : "LineCurve3";
      this.curves.push(new no[n](e, t));
    }
    return this;
  }
  getPoint(t, e) {
    const n = t * this.getLength(), i = this.getCurveLengths();
    let r = 0;
    for (; r < i.length; ) {
      if (i[r] >= n) {
        const a = i[r] - n, o = this.curves[r], l = o.getLength(), c = l === 0 ? 0 : 1 - a / l;
        return o.getPointAt(c, e);
      }
      r++;
    }
    return null;
  }
  getLength() {
    const t = this.getCurveLengths();
    return t[t.length - 1];
  }
  updateArcLengths() {
    this.needsUpdate = true, this.cacheLengths = null, this.getCurveLengths();
  }
  getCurveLengths() {
    if (this.cacheLengths && this.cacheLengths.length === this.curves.length) return this.cacheLengths;
    const t = [];
    let e = 0;
    for (let n = 0, i = this.curves.length; n < i; n++) e += this.curves[n].getLength(), t.push(e);
    return this.cacheLengths = t, t;
  }
  getSpacedPoints(t = 40) {
    const e = [];
    for (let n = 0; n <= t; n++) e.push(this.getPoint(n / t));
    return this.autoClose && e.push(e[0]), e;
  }
  getPoints(t = 12) {
    const e = [];
    let n;
    for (let i = 0, r = this.curves; i < r.length; i++) {
      const a = r[i], o = a.isEllipseCurve ? t * 2 : a.isLineCurve || a.isLineCurve3 ? 1 : a.isSplineCurve ? t * a.points.length : t, l = a.getPoints(o);
      for (let c = 0; c < l.length; c++) {
        const h = l[c];
        n && n.equals(h) || (e.push(h), n = h);
      }
    }
    return this.autoClose && e.length > 1 && !e[e.length - 1].equals(e[0]) && e.push(e[0]), e;
  }
  copy(t) {
    super.copy(t), this.curves = [];
    for (let e = 0, n = t.curves.length; e < n; e++) {
      const i = t.curves[e];
      this.curves.push(i.clone());
    }
    return this.autoClose = t.autoClose, this;
  }
  toJSON() {
    const t = super.toJSON();
    t.autoClose = this.autoClose, t.curves = [];
    for (let e = 0, n = this.curves.length; e < n; e++) {
      const i = this.curves[e];
      t.curves.push(i.toJSON());
    }
    return t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.autoClose = t.autoClose, this.curves = [];
    for (let e = 0, n = t.curves.length; e < n; e++) {
      const i = t.curves[e];
      this.curves.push(new no[i.type]().fromJSON(i));
    }
    return this;
  }
}
class js extends Kd {
  constructor(t) {
    super(), this.type = "Path", this.currentPoint = new Z(), t && this.setFromPoints(t);
  }
  setFromPoints(t) {
    this.moveTo(t[0].x, t[0].y);
    for (let e = 1, n = t.length; e < n; e++) this.lineTo(t[e].x, t[e].y);
    return this;
  }
  moveTo(t, e) {
    return this.currentPoint.set(t, e), this;
  }
  lineTo(t, e) {
    const n = new Sc(this.currentPoint.clone(), new Z(t, e));
    return this.curves.push(n), this.currentPoint.set(t, e), this;
  }
  quadraticCurveTo(t, e, n, i) {
    const r = new bc(this.currentPoint.clone(), new Z(t, e), new Z(n, i));
    return this.curves.push(r), this.currentPoint.set(n, i), this;
  }
  bezierCurveTo(t, e, n, i, r, a) {
    const o = new Mc(this.currentPoint.clone(), new Z(t, e), new Z(n, i), new Z(r, a));
    return this.curves.push(o), this.currentPoint.set(r, a), this;
  }
  splineThru(t) {
    const e = [this.currentPoint.clone()].concat(t), n = new Ec(e);
    return this.curves.push(n), this.currentPoint.copy(t[t.length - 1]), this;
  }
  arc(t, e, n, i, r, a) {
    const o = this.currentPoint.x, l = this.currentPoint.y;
    return this.absarc(t + o, e + l, n, i, r, a), this;
  }
  absarc(t, e, n, i, r, a) {
    return this.absellipse(t, e, n, n, i, r, a), this;
  }
  ellipse(t, e, n, i, r, a, o, l) {
    const c = this.currentPoint.x, h = this.currentPoint.y;
    return this.absellipse(t + c, e + h, n, i, r, a, o, l), this;
  }
  absellipse(t, e, n, i, r, a, o, l) {
    const c = new wo(t, e, n, i, r, a, o, l);
    if (this.curves.length > 0) {
      const u = c.getPoint(0);
      u.equals(this.currentPoint) || this.lineTo(u.x, u.y);
    }
    this.curves.push(c);
    const h = c.getPoint(1);
    return this.currentPoint.copy(h), this;
  }
  copy(t) {
    return super.copy(t), this.currentPoint.copy(t.currentPoint), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.currentPoint = this.currentPoint.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.currentPoint.fromArray(t.currentPoint), this;
  }
}
class fr extends Ht {
  constructor(t = [new Z(0, -0.5), new Z(0.5, 0), new Z(0, 0.5)], e = 12, n = 0, i = Math.PI * 2) {
    super(), this.type = "LatheGeometry", this.parameters = { points: t, segments: e, phiStart: n, phiLength: i }, e = Math.floor(e), i = he(i, 0, Math.PI * 2);
    const r = [], a = [], o = [], l = [], c = [], h = 1 / e, u = new C(), d = new Z(), f = new C(), m = new C(), _ = new C();
    let g = 0, p = 0;
    for (let y = 0; y <= t.length - 1; y++) switch (y) {
      case 0:
        g = t[y + 1].x - t[y].x, p = t[y + 1].y - t[y].y, f.x = p * 1, f.y = -g, f.z = p * 0, _.copy(f), f.normalize(), l.push(f.x, f.y, f.z);
        break;
      case t.length - 1:
        l.push(_.x, _.y, _.z);
        break;
      default:
        g = t[y + 1].x - t[y].x, p = t[y + 1].y - t[y].y, f.x = p * 1, f.y = -g, f.z = p * 0, m.copy(f), f.x += _.x, f.y += _.y, f.z += _.z, f.normalize(), l.push(f.x, f.y, f.z), _.copy(m);
    }
    for (let y = 0; y <= e; y++) {
      const x = n + y * h * i, M = Math.sin(x), I = Math.cos(x);
      for (let E = 0; E <= t.length - 1; E++) {
        u.x = t[E].x * M, u.y = t[E].y, u.z = t[E].x * I, a.push(u.x, u.y, u.z), d.x = y / e, d.y = E / (t.length - 1), o.push(d.x, d.y);
        const A = l[3 * E + 0] * M, P = l[3 * E + 1], V = l[3 * E + 0] * I;
        c.push(A, P, V);
      }
    }
    for (let y = 0; y < e; y++) for (let x = 0; x < t.length - 1; x++) {
      const M = x + y * t.length, I = M, E = M + t.length, A = M + t.length + 1, P = M + 1;
      r.push(I, E, P), r.push(A, P, E);
    }
    this.setIndex(r), this.setAttribute("position", new wt(a, 3)), this.setAttribute("uv", new wt(o, 2)), this.setAttribute("normal", new wt(c, 3));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new fr(t.points, t.segments, t.phiStart, t.phiLength);
  }
}
class Eo extends fr {
  constructor(t = 1, e = 1, n = 4, i = 8) {
    const r = new js();
    r.absarc(0, -e / 2, t, Math.PI * 1.5, 0), r.absarc(0, e / 2, t, 0, Math.PI * 0.5), super(r.getPoints(n), i), this.type = "CapsuleGeometry", this.parameters = { radius: t, length: e, capSegments: n, radialSegments: i };
  }
  static fromJSON(t) {
    return new Eo(t.radius, t.length, t.capSegments, t.radialSegments);
  }
}
class Ao extends Ht {
  constructor(t = 1, e = 32, n = 0, i = Math.PI * 2) {
    super(), this.type = "CircleGeometry", this.parameters = { radius: t, segments: e, thetaStart: n, thetaLength: i }, e = Math.max(3, e);
    const r = [], a = [], o = [], l = [], c = new C(), h = new Z();
    a.push(0, 0, 0), o.push(0, 0, 1), l.push(0.5, 0.5);
    for (let u = 0, d = 3; u <= e; u++, d += 3) {
      const f = n + u / e * i;
      c.x = t * Math.cos(f), c.y = t * Math.sin(f), a.push(c.x, c.y, c.z), o.push(0, 0, 1), h.x = (a[d] / t + 1) / 2, h.y = (a[d + 1] / t + 1) / 2, l.push(h.x, h.y);
    }
    for (let u = 1; u <= e; u++) r.push(u, u + 1, 0);
    this.setIndex(r), this.setAttribute("position", new wt(a, 3)), this.setAttribute("normal", new wt(o, 3)), this.setAttribute("uv", new wt(l, 2));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new Ao(t.radius, t.segments, t.thetaStart, t.thetaLength);
  }
}
class fs extends Ht {
  constructor(t = 1, e = 1, n = 1, i = 32, r = 1, a = false, o = 0, l = Math.PI * 2) {
    super(), this.type = "CylinderGeometry", this.parameters = { radiusTop: t, radiusBottom: e, height: n, radialSegments: i, heightSegments: r, openEnded: a, thetaStart: o, thetaLength: l };
    const c = this;
    i = Math.floor(i), r = Math.floor(r);
    const h = [], u = [], d = [], f = [];
    let m = 0;
    const _ = [], g = n / 2;
    let p = 0;
    y(), a === false && (t > 0 && x(true), e > 0 && x(false)), this.setIndex(h), this.setAttribute("position", new wt(u, 3)), this.setAttribute("normal", new wt(d, 3)), this.setAttribute("uv", new wt(f, 2));
    function y() {
      const M = new C(), I = new C();
      let E = 0;
      const A = (e - t) / n;
      for (let P = 0; P <= r; P++) {
        const V = [], v = P / r, b = v * (e - t) + t;
        for (let k = 0; k <= i; k++) {
          const B = k / i, H = B * l + o, Q = Math.sin(H), O = Math.cos(H);
          I.x = b * Q, I.y = -v * n + g, I.z = b * O, u.push(I.x, I.y, I.z), M.set(Q, A, O).normalize(), d.push(M.x, M.y, M.z), f.push(B, 1 - v), V.push(m++);
        }
        _.push(V);
      }
      for (let P = 0; P < i; P++) for (let V = 0; V < r; V++) {
        const v = _[V][P], b = _[V + 1][P], k = _[V + 1][P + 1], B = _[V][P + 1];
        t > 0 && (h.push(v, b, B), E += 3), e > 0 && (h.push(b, k, B), E += 3);
      }
      c.addGroup(p, E, 0), p += E;
    }
    function x(M) {
      const I = m, E = new Z(), A = new C();
      let P = 0;
      const V = M === true ? t : e, v = M === true ? 1 : -1;
      for (let k = 1; k <= i; k++) u.push(0, g * v, 0), d.push(0, v, 0), f.push(0.5, 0.5), m++;
      const b = m;
      for (let k = 0; k <= i; k++) {
        const H = k / i * l + o, Q = Math.cos(H), O = Math.sin(H);
        A.x = V * O, A.y = g * v, A.z = V * Q, u.push(A.x, A.y, A.z), d.push(0, v, 0), E.x = Q * 0.5 + 0.5, E.y = O * 0.5 * v + 0.5, f.push(E.x, E.y), m++;
      }
      for (let k = 0; k < i; k++) {
        const B = I + k, H = b + k;
        M === true ? h.push(H, H + 1, B) : h.push(H + 1, H, B), P += 3;
      }
      c.addGroup(p, P, M === true ? 1 : 2), p += P;
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new fs(t.radiusTop, t.radiusBottom, t.height, t.radialSegments, t.heightSegments, t.openEnded, t.thetaStart, t.thetaLength);
  }
}
class To extends fs {
  constructor(t = 1, e = 1, n = 32, i = 1, r = false, a = 0, o = Math.PI * 2) {
    super(0, t, e, n, i, r, a, o), this.type = "ConeGeometry", this.parameters = { radius: t, height: e, radialSegments: n, heightSegments: i, openEnded: r, thetaStart: a, thetaLength: o };
  }
  static fromJSON(t) {
    return new To(t.radius, t.height, t.radialSegments, t.heightSegments, t.openEnded, t.thetaStart, t.thetaLength);
  }
}
class Kn extends Ht {
  constructor(t = [], e = [], n = 1, i = 0) {
    super(), this.type = "PolyhedronGeometry", this.parameters = { vertices: t, indices: e, radius: n, detail: i };
    const r = [], a = [];
    o(i), c(n), h(), this.setAttribute("position", new wt(r, 3)), this.setAttribute("normal", new wt(r.slice(), 3)), this.setAttribute("uv", new wt(a, 2)), i === 0 ? this.computeVertexNormals() : this.normalizeNormals();
    function o(y) {
      const x = new C(), M = new C(), I = new C();
      for (let E = 0; E < e.length; E += 3) f(e[E + 0], x), f(e[E + 1], M), f(e[E + 2], I), l(x, M, I, y);
    }
    function l(y, x, M, I) {
      const E = I + 1, A = [];
      for (let P = 0; P <= E; P++) {
        A[P] = [];
        const V = y.clone().lerp(M, P / E), v = x.clone().lerp(M, P / E), b = E - P;
        for (let k = 0; k <= b; k++) k === 0 && P === E ? A[P][k] = V : A[P][k] = V.clone().lerp(v, k / b);
      }
      for (let P = 0; P < E; P++) for (let V = 0; V < 2 * (E - P) - 1; V++) {
        const v = Math.floor(V / 2);
        V % 2 === 0 ? (d(A[P][v + 1]), d(A[P + 1][v]), d(A[P][v])) : (d(A[P][v + 1]), d(A[P + 1][v + 1]), d(A[P + 1][v]));
      }
    }
    function c(y) {
      const x = new C();
      for (let M = 0; M < r.length; M += 3) x.x = r[M + 0], x.y = r[M + 1], x.z = r[M + 2], x.normalize().multiplyScalar(y), r[M + 0] = x.x, r[M + 1] = x.y, r[M + 2] = x.z;
    }
    function h() {
      const y = new C();
      for (let x = 0; x < r.length; x += 3) {
        y.x = r[x + 0], y.y = r[x + 1], y.z = r[x + 2];
        const M = g(y) / 2 / Math.PI + 0.5, I = p(y) / Math.PI + 0.5;
        a.push(M, 1 - I);
      }
      m(), u();
    }
    function u() {
      for (let y = 0; y < a.length; y += 6) {
        const x = a[y + 0], M = a[y + 2], I = a[y + 4], E = Math.max(x, M, I), A = Math.min(x, M, I);
        E > 0.9 && A < 0.1 && (x < 0.2 && (a[y + 0] += 1), M < 0.2 && (a[y + 2] += 1), I < 0.2 && (a[y + 4] += 1));
      }
    }
    function d(y) {
      r.push(y.x, y.y, y.z);
    }
    function f(y, x) {
      const M = y * 3;
      x.x = t[M + 0], x.y = t[M + 1], x.z = t[M + 2];
    }
    function m() {
      const y = new C(), x = new C(), M = new C(), I = new C(), E = new Z(), A = new Z(), P = new Z();
      for (let V = 0, v = 0; V < r.length; V += 9, v += 6) {
        y.set(r[V + 0], r[V + 1], r[V + 2]), x.set(r[V + 3], r[V + 4], r[V + 5]), M.set(r[V + 6], r[V + 7], r[V + 8]), E.set(a[v + 0], a[v + 1]), A.set(a[v + 2], a[v + 3]), P.set(a[v + 4], a[v + 5]), I.copy(y).add(x).add(M).divideScalar(3);
        const b = g(I);
        _(E, v + 0, y, b), _(A, v + 2, x, b), _(P, v + 4, M, b);
      }
    }
    function _(y, x, M, I) {
      I < 0 && y.x === 1 && (a[x] = y.x - 1), M.x === 0 && M.z === 0 && (a[x] = I / 2 / Math.PI + 0.5);
    }
    function g(y) {
      return Math.atan2(y.z, -y.x);
    }
    function p(y) {
      return Math.atan2(-y.y, Math.sqrt(y.x * y.x + y.z * y.z));
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new Kn(t.vertices, t.indices, t.radius, t.details);
  }
}
class Co extends Kn {
  constructor(t = 1, e = 0) {
    const n = (1 + Math.sqrt(5)) / 2, i = 1 / n, r = [-1, -1, -1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0, -i, -n, 0, -i, n, 0, i, -n, 0, i, n, -i, -n, 0, -i, n, 0, i, -n, 0, i, n, 0, -n, 0, -i, n, 0, -i, -n, 0, i, n, 0, i], a = [3, 11, 7, 3, 7, 15, 3, 15, 13, 7, 19, 17, 7, 17, 6, 7, 6, 15, 17, 4, 8, 17, 8, 10, 17, 10, 6, 8, 0, 16, 8, 16, 2, 8, 2, 10, 0, 12, 1, 0, 1, 18, 0, 18, 16, 6, 10, 2, 6, 2, 13, 6, 13, 15, 2, 16, 18, 2, 18, 3, 2, 3, 13, 18, 1, 9, 18, 9, 11, 18, 11, 3, 4, 14, 12, 4, 12, 0, 4, 0, 8, 11, 9, 5, 11, 5, 19, 11, 19, 7, 19, 5, 14, 19, 14, 4, 19, 4, 17, 1, 12, 14, 1, 14, 5, 1, 5, 9];
    super(r, a, t, e), this.type = "DodecahedronGeometry", this.parameters = { radius: t, detail: e };
  }
  static fromJSON(t) {
    return new Co(t.radius, t.detail);
  }
}
const ta = new C(), ea = new C(), Tl = new C(), na = new ze();
class Qd extends Ht {
  constructor(t = null, e = 1) {
    if (super(), this.type = "EdgesGeometry", this.parameters = { geometry: t, thresholdAngle: e }, t !== null) {
      const i = Math.pow(10, 4), r = Math.cos(Si * e), a = t.getIndex(), o = t.getAttribute("position"), l = a ? a.count : o.count, c = [0, 0, 0], h = ["a", "b", "c"], u = new Array(3), d = {}, f = [];
      for (let m = 0; m < l; m += 3) {
        a ? (c[0] = a.getX(m), c[1] = a.getX(m + 1), c[2] = a.getX(m + 2)) : (c[0] = m, c[1] = m + 1, c[2] = m + 2);
        const { a: _, b: g, c: p } = na;
        if (_.fromBufferAttribute(o, c[0]), g.fromBufferAttribute(o, c[1]), p.fromBufferAttribute(o, c[2]), na.getNormal(Tl), u[0] = `${Math.round(_.x * i)},${Math.round(_.y * i)},${Math.round(_.z * i)}`, u[1] = `${Math.round(g.x * i)},${Math.round(g.y * i)},${Math.round(g.z * i)}`, u[2] = `${Math.round(p.x * i)},${Math.round(p.y * i)},${Math.round(p.z * i)}`, !(u[0] === u[1] || u[1] === u[2] || u[2] === u[0])) for (let y = 0; y < 3; y++) {
          const x = (y + 1) % 3, M = u[y], I = u[x], E = na[h[y]], A = na[h[x]], P = `${M}_${I}`, V = `${I}_${M}`;
          V in d && d[V] ? (Tl.dot(d[V].normal) <= r && (f.push(E.x, E.y, E.z), f.push(A.x, A.y, A.z)), d[V] = null) : P in d || (d[P] = { index0: c[y], index1: c[x], normal: Tl.clone() });
        }
      }
      for (const m in d) if (d[m]) {
        const { index0: _, index1: g } = d[m];
        ta.fromBufferAttribute(o, _), ea.fromBufferAttribute(o, g), f.push(ta.x, ta.y, ta.z), f.push(ea.x, ea.y, ea.z);
      }
      this.setAttribute("position", new wt(f, 3));
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
}
class bi extends js {
  constructor(t) {
    super(t), this.uuid = Ye(), this.type = "Shape", this.holes = [];
  }
  getPointsHoles(t) {
    const e = [];
    for (let n = 0, i = this.holes.length; n < i; n++) e[n] = this.holes[n].getPoints(t);
    return e;
  }
  extractPoints(t) {
    return { shape: this.getPoints(t), holes: this.getPointsHoles(t) };
  }
  copy(t) {
    super.copy(t), this.holes = [];
    for (let e = 0, n = t.holes.length; e < n; e++) {
      const i = t.holes[e];
      this.holes.push(i.clone());
    }
    return this;
  }
  toJSON() {
    const t = super.toJSON();
    t.uuid = this.uuid, t.holes = [];
    for (let e = 0, n = this.holes.length; e < n; e++) {
      const i = this.holes[e];
      t.holes.push(i.toJSON());
    }
    return t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.uuid = t.uuid, this.holes = [];
    for (let e = 0, n = t.holes.length; e < n; e++) {
      const i = t.holes[e];
      this.holes.push(new js().fromJSON(i));
    }
    return this;
  }
}
const Rv = { triangulate: function(s, t, e = 2) {
  const n = t && t.length, i = n ? t[0] * e : s.length;
  let r = jd(s, 0, i, e, true);
  const a = [];
  if (!r || r.next === r.prev) return a;
  let o, l, c, h, u, d, f;
  if (n && (r = Uv(s, t, r, e)), s.length > 80 * e) {
    o = c = s[0], l = h = s[1];
    for (let m = e; m < i; m += e) u = s[m], d = s[m + 1], u < o && (o = u), d < l && (l = d), u > c && (c = u), d > h && (h = d);
    f = Math.max(c - o, h - l), f = f !== 0 ? 32767 / f : 0;
  }
  return tr(r, a, e, o, l, f, 0), a;
} };
function jd(s, t, e, n, i) {
  let r, a;
  if (i === Xv(s, t, e, n) > 0) for (r = t; r < e; r += n) a = Qh(r, s[r], s[r + 1], a);
  else for (r = e - n; r >= t; r -= n) a = Qh(r, s[r], s[r + 1], a);
  return a && Ro(a, a.next) && (nr(a), a = a.next), a;
}
function Ci(s, t) {
  if (!s) return s;
  t || (t = s);
  let e = s, n;
  do
    if (n = false, !e.steiner && (Ro(e, e.next) || oe(e.prev, e, e.next) === 0)) {
      if (nr(e), e = t = e.prev, e === e.next) break;
      n = true;
    } else e = e.next;
  while (n || e !== t);
  return t;
}
function tr(s, t, e, n, i, r, a) {
  if (!s) return;
  !a && r && zv(s, n, i, r);
  let o = s, l, c;
  for (; s.prev !== s.next; ) {
    if (l = s.prev, c = s.next, r ? Iv(s, n, i, r) : Pv(s)) {
      t.push(l.i / e | 0), t.push(s.i / e | 0), t.push(c.i / e | 0), nr(s), s = c.next, o = c.next;
      continue;
    }
    if (s = c, s === o) {
      a ? a === 1 ? (s = Lv(Ci(s), t, e), tr(s, t, e, n, i, r, 2)) : a === 2 && Dv(s, t, e, n, i, r) : tr(Ci(s), t, e, n, i, r, 1);
      break;
    }
  }
}
function Pv(s) {
  const t = s.prev, e = s, n = s.next;
  if (oe(t, e, n) >= 0) return false;
  const i = t.x, r = e.x, a = n.x, o = t.y, l = e.y, c = n.y, h = i < r ? i < a ? i : a : r < a ? r : a, u = o < l ? o < c ? o : c : l < c ? l : c, d = i > r ? i > a ? i : a : r > a ? r : a, f = o > l ? o > c ? o : c : l > c ? l : c;
  let m = n.next;
  for (; m !== t; ) {
    if (m.x >= h && m.x <= d && m.y >= u && m.y <= f && es(i, o, r, l, a, c, m.x, m.y) && oe(m.prev, m, m.next) >= 0) return false;
    m = m.next;
  }
  return true;
}
function Iv(s, t, e, n) {
  const i = s.prev, r = s, a = s.next;
  if (oe(i, r, a) >= 0) return false;
  const o = i.x, l = r.x, c = a.x, h = i.y, u = r.y, d = a.y, f = o < l ? o < c ? o : c : l < c ? l : c, m = h < u ? h < d ? h : d : u < d ? u : d, _ = o > l ? o > c ? o : c : l > c ? l : c, g = h > u ? h > d ? h : d : u > d ? u : d, p = Wl(f, m, t, e, n), y = Wl(_, g, t, e, n);
  let x = s.prevZ, M = s.nextZ;
  for (; x && x.z >= p && M && M.z <= y; ) {
    if (x.x >= f && x.x <= _ && x.y >= m && x.y <= g && x !== i && x !== a && es(o, h, l, u, c, d, x.x, x.y) && oe(x.prev, x, x.next) >= 0 || (x = x.prevZ, M.x >= f && M.x <= _ && M.y >= m && M.y <= g && M !== i && M !== a && es(o, h, l, u, c, d, M.x, M.y) && oe(M.prev, M, M.next) >= 0)) return false;
    M = M.nextZ;
  }
  for (; x && x.z >= p; ) {
    if (x.x >= f && x.x <= _ && x.y >= m && x.y <= g && x !== i && x !== a && es(o, h, l, u, c, d, x.x, x.y) && oe(x.prev, x, x.next) >= 0) return false;
    x = x.prevZ;
  }
  for (; M && M.z <= y; ) {
    if (M.x >= f && M.x <= _ && M.y >= m && M.y <= g && M !== i && M !== a && es(o, h, l, u, c, d, M.x, M.y) && oe(M.prev, M, M.next) >= 0) return false;
    M = M.nextZ;
  }
  return true;
}
function Lv(s, t, e) {
  let n = s;
  do {
    const i = n.prev, r = n.next.next;
    !Ro(i, r) && tf(i, n, n.next, r) && er(i, r) && er(r, i) && (t.push(i.i / e | 0), t.push(n.i / e | 0), t.push(r.i / e | 0), nr(n), nr(n.next), n = s = r), n = n.next;
  } while (n !== s);
  return Ci(n);
}
function Dv(s, t, e, n, i, r) {
  let a = s;
  do {
    let o = a.next.next;
    for (; o !== a.prev; ) {
      if (a.i !== o.i && Hv(a, o)) {
        let l = ef(a, o);
        a = Ci(a, a.next), l = Ci(l, l.next), tr(a, t, e, n, i, r, 0), tr(l, t, e, n, i, r, 0);
        return;
      }
      o = o.next;
    }
    a = a.next;
  } while (a !== s);
}
function Uv(s, t, e, n) {
  const i = [];
  let r, a, o, l, c;
  for (r = 0, a = t.length; r < a; r++) o = t[r] * n, l = r < a - 1 ? t[r + 1] * n : s.length, c = jd(s, o, l, n, false), c === c.next && (c.steiner = true), i.push(Vv(c));
  for (i.sort(Nv), r = 0; r < i.length; r++) e = Fv(i[r], e);
  return e;
}
function Nv(s, t) {
  return s.x - t.x;
}
function Fv(s, t) {
  const e = Ov(s, t);
  if (!e) return t;
  const n = ef(e, s);
  return Ci(n, n.next), Ci(e, e.next);
}
function Ov(s, t) {
  let e = t, n = -1 / 0, i;
  const r = s.x, a = s.y;
  do {
    if (a <= e.y && a >= e.next.y && e.next.y !== e.y) {
      const d = e.x + (a - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (d <= r && d > n && (n = d, i = e.x < e.next.x ? e : e.next, d === r)) return i;
    }
    e = e.next;
  } while (e !== t);
  if (!i) return null;
  const o = i, l = i.x, c = i.y;
  let h = 1 / 0, u;
  e = i;
  do
    r >= e.x && e.x >= l && r !== e.x && es(a < c ? r : n, a, l, c, a < c ? n : r, a, e.x, e.y) && (u = Math.abs(a - e.y) / (r - e.x), er(e, s) && (u < h || u === h && (e.x > i.x || e.x === i.x && Bv(i, e))) && (i = e, h = u)), e = e.next;
  while (e !== o);
  return i;
}
function Bv(s, t) {
  return oe(s.prev, s, t.prev) < 0 && oe(t.next, s, s.next) < 0;
}
function zv(s, t, e, n) {
  let i = s;
  do
    i.z === 0 && (i.z = Wl(i.x, i.y, t, e, n)), i.prevZ = i.prev, i.nextZ = i.next, i = i.next;
  while (i !== s);
  i.prevZ.nextZ = null, i.prevZ = null, kv(i);
}
function kv(s) {
  let t, e, n, i, r, a, o, l, c = 1;
  do {
    for (e = s, s = null, r = null, a = 0; e; ) {
      for (a++, n = e, o = 0, t = 0; t < c && (o++, n = n.nextZ, !!n); t++) ;
      for (l = c; o > 0 || l > 0 && n; ) o !== 0 && (l === 0 || !n || e.z <= n.z) ? (i = e, e = e.nextZ, o--) : (i = n, n = n.nextZ, l--), r ? r.nextZ = i : s = i, i.prevZ = r, r = i;
      e = n;
    }
    r.nextZ = null, c *= 2;
  } while (a > 1);
  return s;
}
function Wl(s, t, e, n, i) {
  return s = (s - e) * i | 0, t = (t - n) * i | 0, s = (s | s << 8) & 16711935, s = (s | s << 4) & 252645135, s = (s | s << 2) & 858993459, s = (s | s << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, s | t << 1;
}
function Vv(s) {
  let t = s, e = s;
  do
    (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
  while (t !== s);
  return e;
}
function es(s, t, e, n, i, r, a, o) {
  return (i - a) * (t - o) >= (s - a) * (r - o) && (s - a) * (n - o) >= (e - a) * (t - o) && (e - a) * (r - o) >= (i - a) * (n - o);
}
function Hv(s, t) {
  return s.next.i !== t.i && s.prev.i !== t.i && !Gv(s, t) && (er(s, t) && er(t, s) && Wv(s, t) && (oe(s.prev, s, t.prev) || oe(s, t.prev, t)) || Ro(s, t) && oe(s.prev, s, s.next) > 0 && oe(t.prev, t, t.next) > 0);
}
function oe(s, t, e) {
  return (t.y - s.y) * (e.x - t.x) - (t.x - s.x) * (e.y - t.y);
}
function Ro(s, t) {
  return s.x === t.x && s.y === t.y;
}
function tf(s, t, e, n) {
  const i = sa(oe(s, t, e)), r = sa(oe(s, t, n)), a = sa(oe(e, n, s)), o = sa(oe(e, n, t));
  return !!(i !== r && a !== o || i === 0 && ia(s, e, t) || r === 0 && ia(s, n, t) || a === 0 && ia(e, s, n) || o === 0 && ia(e, t, n));
}
function ia(s, t, e) {
  return t.x <= Math.max(s.x, e.x) && t.x >= Math.min(s.x, e.x) && t.y <= Math.max(s.y, e.y) && t.y >= Math.min(s.y, e.y);
}
function sa(s) {
  return s > 0 ? 1 : s < 0 ? -1 : 0;
}
function Gv(s, t) {
  let e = s;
  do {
    if (e.i !== s.i && e.next.i !== s.i && e.i !== t.i && e.next.i !== t.i && tf(e, e.next, s, t)) return true;
    e = e.next;
  } while (e !== s);
  return false;
}
function er(s, t) {
  return oe(s.prev, s, s.next) < 0 ? oe(s, t, s.next) >= 0 && oe(s, s.prev, t) >= 0 : oe(s, t, s.prev) < 0 || oe(s, s.next, t) < 0;
}
function Wv(s, t) {
  let e = s, n = false;
  const i = (s.x + t.x) / 2, r = (s.y + t.y) / 2;
  do
    e.y > r != e.next.y > r && e.next.y !== e.y && i < (e.next.x - e.x) * (r - e.y) / (e.next.y - e.y) + e.x && (n = !n), e = e.next;
  while (e !== s);
  return n;
}
function ef(s, t) {
  const e = new Xl(s.i, s.x, s.y), n = new Xl(t.i, t.x, t.y), i = s.next, r = t.prev;
  return s.next = t, t.prev = s, e.next = i, i.prev = e, n.next = e, e.prev = n, r.next = n, n.prev = r, n;
}
function Qh(s, t, e, n) {
  const i = new Xl(s, t, e);
  return n ? (i.next = n.next, i.prev = n, n.next.prev = i, n.next = i) : (i.prev = i, i.next = i), i;
}
function nr(s) {
  s.next.prev = s.prev, s.prev.next = s.next, s.prevZ && (s.prevZ.nextZ = s.nextZ), s.nextZ && (s.nextZ.prevZ = s.prevZ);
}
function Xl(s, t, e) {
  this.i = s, this.x = t, this.y = e, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = false;
}
function Xv(s, t, e, n) {
  let i = 0;
  for (let r = t, a = e - n; r < e; r += n) i += (s[a] - s[r]) * (s[r + 1] + s[a + 1]), a = r;
  return i;
}
class pn {
  static area(t) {
    const e = t.length;
    let n = 0;
    for (let i = e - 1, r = 0; r < e; i = r++) n += t[i].x * t[r].y - t[r].x * t[i].y;
    return n * 0.5;
  }
  static isClockWise(t) {
    return pn.area(t) < 0;
  }
  static triangulateShape(t, e) {
    const n = [], i = [], r = [];
    jh(t), tu(n, t);
    let a = t.length;
    e.forEach(jh);
    for (let l = 0; l < e.length; l++) i.push(a), a += e[l].length, tu(n, e[l]);
    const o = Rv.triangulate(n, i);
    for (let l = 0; l < o.length; l += 3) r.push(o.slice(l, l + 3));
    return r;
  }
}
function jh(s) {
  const t = s.length;
  t > 2 && s[t - 1].equals(s[0]) && s.pop();
}
function tu(s, t) {
  for (let e = 0; e < t.length; e++) s.push(t[e].x), s.push(t[e].y);
}
class Po extends Ht {
  constructor(t = new bi([new Z(0.5, 0.5), new Z(-0.5, 0.5), new Z(-0.5, -0.5), new Z(0.5, -0.5)]), e = {}) {
    super(), this.type = "ExtrudeGeometry", this.parameters = { shapes: t, options: e }, t = Array.isArray(t) ? t : [t];
    const n = this, i = [], r = [];
    for (let o = 0, l = t.length; o < l; o++) {
      const c = t[o];
      a(c);
    }
    this.setAttribute("position", new wt(i, 3)), this.setAttribute("uv", new wt(r, 2)), this.computeVertexNormals();
    function a(o) {
      const l = [], c = e.curveSegments !== void 0 ? e.curveSegments : 12, h = e.steps !== void 0 ? e.steps : 1, u = e.depth !== void 0 ? e.depth : 1;
      let d = e.bevelEnabled !== void 0 ? e.bevelEnabled : true, f = e.bevelThickness !== void 0 ? e.bevelThickness : 0.2, m = e.bevelSize !== void 0 ? e.bevelSize : f - 0.1, _ = e.bevelOffset !== void 0 ? e.bevelOffset : 0, g = e.bevelSegments !== void 0 ? e.bevelSegments : 3;
      const p = e.extrudePath, y = e.UVGenerator !== void 0 ? e.UVGenerator : qv;
      let x, M = false, I, E, A, P;
      p && (x = p.getSpacedPoints(h), M = true, d = false, I = p.computeFrenetFrames(h, false), E = new C(), A = new C(), P = new C()), d || (g = 0, f = 0, m = 0, _ = 0);
      const V = o.extractPoints(c);
      let v = V.shape;
      const b = V.holes;
      if (!pn.isClockWise(v)) {
        v = v.reverse();
        for (let J = 0, R = b.length; J < R; J++) {
          const rt = b[J];
          pn.isClockWise(rt) && (b[J] = rt.reverse());
        }
      }
      const B = pn.triangulateShape(v, b), H = v;
      for (let J = 0, R = b.length; J < R; J++) {
        const rt = b[J];
        v = v.concat(rt);
      }
      function Q(J, R, rt) {
        return R || console.error("THREE.ExtrudeGeometry: vec does not exist"), J.clone().addScaledVector(R, rt);
      }
      const O = v.length, tt = B.length;
      function W(J, R, rt) {
        let st, j, at;
        const Ct = J.x - R.x, gt = J.y - R.y, T = rt.x - J.x, S = rt.y - J.y, N = Ct * Ct + gt * gt, q = Ct * S - gt * T;
        if (Math.abs(q) > Number.EPSILON) {
          const $ = Math.sqrt(N), Y = Math.sqrt(T * T + S * S), Et = R.x - gt / $, lt = R.y + Ct / $, vt = rt.x - S / Y, Xt = rt.y + T / Y, nt = ((vt - Et) * S - (Xt - lt) * T) / (Ct * S - gt * T);
          st = Et + Ct * nt - J.x, j = lt + gt * nt - J.y;
          const yt = st * st + j * j;
          if (yt <= 2) return new Z(st, j);
          at = Math.sqrt(yt / 2);
        } else {
          let $ = false;
          Ct > Number.EPSILON ? T > Number.EPSILON && ($ = true) : Ct < -Number.EPSILON ? T < -Number.EPSILON && ($ = true) : Math.sign(gt) === Math.sign(S) && ($ = true), $ ? (st = -gt, j = Ct, at = Math.sqrt(N)) : (st = Ct, j = gt, at = Math.sqrt(N / 2));
        }
        return new Z(st / at, j / at);
      }
      const ht = [];
      for (let J = 0, R = H.length, rt = R - 1, st = J + 1; J < R; J++, rt++, st++) rt === R && (rt = 0), st === R && (st = 0), ht[J] = W(H[J], H[rt], H[st]);
      const pt = [];
      let mt, Wt = ht.concat();
      for (let J = 0, R = b.length; J < R; J++) {
        const rt = b[J];
        mt = [];
        for (let st = 0, j = rt.length, at = j - 1, Ct = st + 1; st < j; st++, at++, Ct++) at === j && (at = 0), Ct === j && (Ct = 0), mt[st] = W(rt[st], rt[at], rt[Ct]);
        pt.push(mt), Wt = Wt.concat(mt);
      }
      for (let J = 0; J < g; J++) {
        const R = J / g, rt = f * Math.cos(R * Math.PI / 2), st = m * Math.sin(R * Math.PI / 2) + _;
        for (let j = 0, at = H.length; j < at; j++) {
          const Ct = Q(H[j], ht[j], st);
          ct(Ct.x, Ct.y, -rt);
        }
        for (let j = 0, at = b.length; j < at; j++) {
          const Ct = b[j];
          mt = pt[j];
          for (let gt = 0, T = Ct.length; gt < T; gt++) {
            const S = Q(Ct[gt], mt[gt], st);
            ct(S.x, S.y, -rt);
          }
        }
      }
      const Kt = m + _;
      for (let J = 0; J < O; J++) {
        const R = d ? Q(v[J], Wt[J], Kt) : v[J];
        M ? (A.copy(I.normals[0]).multiplyScalar(R.x), E.copy(I.binormals[0]).multiplyScalar(R.y), P.copy(x[0]).add(A).add(E), ct(P.x, P.y, P.z)) : ct(R.x, R.y, 0);
      }
      for (let J = 1; J <= h; J++) for (let R = 0; R < O; R++) {
        const rt = d ? Q(v[R], Wt[R], Kt) : v[R];
        M ? (A.copy(I.normals[J]).multiplyScalar(rt.x), E.copy(I.binormals[J]).multiplyScalar(rt.y), P.copy(x[J]).add(A).add(E), ct(P.x, P.y, P.z)) : ct(rt.x, rt.y, u / h * J);
      }
      for (let J = g - 1; J >= 0; J--) {
        const R = J / g, rt = f * Math.cos(R * Math.PI / 2), st = m * Math.sin(R * Math.PI / 2) + _;
        for (let j = 0, at = H.length; j < at; j++) {
          const Ct = Q(H[j], ht[j], st);
          ct(Ct.x, Ct.y, u + rt);
        }
        for (let j = 0, at = b.length; j < at; j++) {
          const Ct = b[j];
          mt = pt[j];
          for (let gt = 0, T = Ct.length; gt < T; gt++) {
            const S = Q(Ct[gt], mt[gt], st);
            M ? ct(S.x, S.y + x[h - 1].y, x[h - 1].x + rt) : ct(S.x, S.y, u + rt);
          }
        }
      }
      X(), et();
      function X() {
        const J = i.length / 3;
        if (d) {
          let R = 0, rt = O * R;
          for (let st = 0; st < tt; st++) {
            const j = B[st];
            Lt(j[2] + rt, j[1] + rt, j[0] + rt);
          }
          R = h + g * 2, rt = O * R;
          for (let st = 0; st < tt; st++) {
            const j = B[st];
            Lt(j[0] + rt, j[1] + rt, j[2] + rt);
          }
        } else {
          for (let R = 0; R < tt; R++) {
            const rt = B[R];
            Lt(rt[2], rt[1], rt[0]);
          }
          for (let R = 0; R < tt; R++) {
            const rt = B[R];
            Lt(rt[0] + O * h, rt[1] + O * h, rt[2] + O * h);
          }
        }
        n.addGroup(J, i.length / 3 - J, 0);
      }
      function et() {
        const J = i.length / 3;
        let R = 0;
        Mt(H, R), R += H.length;
        for (let rt = 0, st = b.length; rt < st; rt++) {
          const j = b[rt];
          Mt(j, R), R += j.length;
        }
        n.addGroup(J, i.length / 3 - J, 1);
      }
      function Mt(J, R) {
        let rt = J.length;
        for (; --rt >= 0; ) {
          const st = rt;
          let j = rt - 1;
          j < 0 && (j = J.length - 1);
          for (let at = 0, Ct = h + g * 2; at < Ct; at++) {
            const gt = O * at, T = O * (at + 1), S = R + st + gt, N = R + j + gt, q = R + j + T, $ = R + st + T;
            It(S, N, q, $);
          }
        }
      }
      function ct(J, R, rt) {
        l.push(J), l.push(R), l.push(rt);
      }
      function Lt(J, R, rt) {
        Ot(J), Ot(R), Ot(rt);
        const st = i.length / 3, j = y.generateTopUV(n, i, st - 3, st - 2, st - 1);
        Gt(j[0]), Gt(j[1]), Gt(j[2]);
      }
      function It(J, R, rt, st) {
        Ot(J), Ot(R), Ot(st), Ot(R), Ot(rt), Ot(st);
        const j = i.length / 3, at = y.generateSideWallUV(n, i, j - 6, j - 3, j - 2, j - 1);
        Gt(at[0]), Gt(at[1]), Gt(at[3]), Gt(at[1]), Gt(at[2]), Gt(at[3]);
      }
      function Ot(J) {
        i.push(l[J * 3 + 0]), i.push(l[J * 3 + 1]), i.push(l[J * 3 + 2]);
      }
      function Gt(J) {
        r.push(J.x), r.push(J.y);
      }
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  toJSON() {
    const t = super.toJSON(), e = this.parameters.shapes, n = this.parameters.options;
    return Yv(e, n, t);
  }
  static fromJSON(t, e) {
    const n = [];
    for (let r = 0, a = t.shapes.length; r < a; r++) {
      const o = e[t.shapes[r]];
      n.push(o);
    }
    const i = t.options.extrudePath;
    return i !== void 0 && (t.options.extrudePath = new no[i.type]().fromJSON(i)), new Po(n, t.options);
  }
}
const qv = { generateTopUV: function(s, t, e, n, i) {
  const r = t[e * 3], a = t[e * 3 + 1], o = t[n * 3], l = t[n * 3 + 1], c = t[i * 3], h = t[i * 3 + 1];
  return [new Z(r, a), new Z(o, l), new Z(c, h)];
}, generateSideWallUV: function(s, t, e, n, i, r) {
  const a = t[e * 3], o = t[e * 3 + 1], l = t[e * 3 + 2], c = t[n * 3], h = t[n * 3 + 1], u = t[n * 3 + 2], d = t[i * 3], f = t[i * 3 + 1], m = t[i * 3 + 2], _ = t[r * 3], g = t[r * 3 + 1], p = t[r * 3 + 2];
  return Math.abs(o - h) < Math.abs(a - c) ? [new Z(a, 1 - l), new Z(c, 1 - u), new Z(d, 1 - m), new Z(_, 1 - p)] : [new Z(o, 1 - l), new Z(h, 1 - u), new Z(f, 1 - m), new Z(g, 1 - p)];
} };
function Yv(s, t, e) {
  if (e.shapes = [], Array.isArray(s)) for (let n = 0, i = s.length; n < i; n++) {
    const r = s[n];
    e.shapes.push(r.uuid);
  }
  else e.shapes.push(s.uuid);
  return e.options = Object.assign({}, t), t.extrudePath !== void 0 && (e.options.extrudePath = t.extrudePath.toJSON()), e;
}
class Io extends Kn {
  constructor(t = 1, e = 0) {
    const n = (1 + Math.sqrt(5)) / 2, i = [-1, n, 0, 1, n, 0, -1, -n, 0, 1, -n, 0, 0, -1, n, 0, 1, n, 0, -1, -n, 0, 1, -n, n, 0, -1, n, 0, 1, -n, 0, -1, -n, 0, 1], r = [0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1];
    super(i, r, t, e), this.type = "IcosahedronGeometry", this.parameters = { radius: t, detail: e };
  }
  static fromJSON(t) {
    return new Io(t.radius, t.detail);
  }
}
class pr extends Kn {
  constructor(t = 1, e = 0) {
    const n = [1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1], i = [0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2];
    super(n, i, t, e), this.type = "OctahedronGeometry", this.parameters = { radius: t, detail: e };
  }
  static fromJSON(t) {
    return new pr(t.radius, t.detail);
  }
}
class Lo extends Ht {
  constructor(t = 0.5, e = 1, n = 32, i = 1, r = 0, a = Math.PI * 2) {
    super(), this.type = "RingGeometry", this.parameters = { innerRadius: t, outerRadius: e, thetaSegments: n, phiSegments: i, thetaStart: r, thetaLength: a }, n = Math.max(3, n), i = Math.max(1, i);
    const o = [], l = [], c = [], h = [];
    let u = t;
    const d = (e - t) / i, f = new C(), m = new Z();
    for (let _ = 0; _ <= i; _++) {
      for (let g = 0; g <= n; g++) {
        const p = r + g / n * a;
        f.x = u * Math.cos(p), f.y = u * Math.sin(p), l.push(f.x, f.y, f.z), c.push(0, 0, 1), m.x = (f.x / e + 1) / 2, m.y = (f.y / e + 1) / 2, h.push(m.x, m.y);
      }
      u += d;
    }
    for (let _ = 0; _ < i; _++) {
      const g = _ * (n + 1);
      for (let p = 0; p < n; p++) {
        const y = p + g, x = y, M = y + n + 1, I = y + n + 2, E = y + 1;
        o.push(x, M, E), o.push(M, I, E);
      }
    }
    this.setIndex(o), this.setAttribute("position", new wt(l, 3)), this.setAttribute("normal", new wt(c, 3)), this.setAttribute("uv", new wt(h, 2));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new Lo(t.innerRadius, t.outerRadius, t.thetaSegments, t.phiSegments, t.thetaStart, t.thetaLength);
  }
}
class Do extends Ht {
  constructor(t = new bi([new Z(0, 0.5), new Z(-0.5, -0.5), new Z(0.5, -0.5)]), e = 12) {
    super(), this.type = "ShapeGeometry", this.parameters = { shapes: t, curveSegments: e };
    const n = [], i = [], r = [], a = [];
    let o = 0, l = 0;
    if (Array.isArray(t) === false) c(t);
    else for (let h = 0; h < t.length; h++) c(t[h]), this.addGroup(o, l, h), o += l, l = 0;
    this.setIndex(n), this.setAttribute("position", new wt(i, 3)), this.setAttribute("normal", new wt(r, 3)), this.setAttribute("uv", new wt(a, 2));
    function c(h) {
      const u = i.length / 3, d = h.extractPoints(e);
      let f = d.shape;
      const m = d.holes;
      pn.isClockWise(f) === false && (f = f.reverse());
      for (let g = 0, p = m.length; g < p; g++) {
        const y = m[g];
        pn.isClockWise(y) === true && (m[g] = y.reverse());
      }
      const _ = pn.triangulateShape(f, m);
      for (let g = 0, p = m.length; g < p; g++) {
        const y = m[g];
        f = f.concat(y);
      }
      for (let g = 0, p = f.length; g < p; g++) {
        const y = f[g];
        i.push(y.x, y.y, 0), r.push(0, 0, 1), a.push(y.x, y.y);
      }
      for (let g = 0, p = _.length; g < p; g++) {
        const y = _[g], x = y[0] + u, M = y[1] + u, I = y[2] + u;
        n.push(x, M, I), l += 3;
      }
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  toJSON() {
    const t = super.toJSON(), e = this.parameters.shapes;
    return Zv(e, t);
  }
  static fromJSON(t, e) {
    const n = [];
    for (let i = 0, r = t.shapes.length; i < r; i++) {
      const a = e[t.shapes[i]];
      n.push(a);
    }
    return new Do(n, t.curveSegments);
  }
}
function Zv(s, t) {
  if (t.shapes = [], Array.isArray(s)) for (let e = 0, n = s.length; e < n; e++) {
    const i = s[e];
    t.shapes.push(i.uuid);
  }
  else t.shapes.push(s.uuid);
  return t;
}
class mr extends Ht {
  constructor(t = 1, e = 32, n = 16, i = 0, r = Math.PI * 2, a = 0, o = Math.PI) {
    super(), this.type = "SphereGeometry", this.parameters = { radius: t, widthSegments: e, heightSegments: n, phiStart: i, phiLength: r, thetaStart: a, thetaLength: o }, e = Math.max(3, Math.floor(e)), n = Math.max(2, Math.floor(n));
    const l = Math.min(a + o, Math.PI);
    let c = 0;
    const h = [], u = new C(), d = new C(), f = [], m = [], _ = [], g = [];
    for (let p = 0; p <= n; p++) {
      const y = [], x = p / n;
      let M = 0;
      p === 0 && a === 0 ? M = 0.5 / e : p === n && l === Math.PI && (M = -0.5 / e);
      for (let I = 0; I <= e; I++) {
        const E = I / e;
        u.x = -t * Math.cos(i + E * r) * Math.sin(a + x * o), u.y = t * Math.cos(a + x * o), u.z = t * Math.sin(i + E * r) * Math.sin(a + x * o), m.push(u.x, u.y, u.z), d.copy(u).normalize(), _.push(d.x, d.y, d.z), g.push(E + M, 1 - x), y.push(c++);
      }
      h.push(y);
    }
    for (let p = 0; p < n; p++) for (let y = 0; y < e; y++) {
      const x = h[p][y + 1], M = h[p][y], I = h[p + 1][y], E = h[p + 1][y + 1];
      (p !== 0 || a > 0) && f.push(x, M, E), (p !== n - 1 || l < Math.PI) && f.push(M, I, E);
    }
    this.setIndex(f), this.setAttribute("position", new wt(m, 3)), this.setAttribute("normal", new wt(_, 3)), this.setAttribute("uv", new wt(g, 2));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new mr(t.radius, t.widthSegments, t.heightSegments, t.phiStart, t.phiLength, t.thetaStart, t.thetaLength);
  }
}
class Uo extends Kn {
  constructor(t = 1, e = 0) {
    const n = [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1], i = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1];
    super(n, i, t, e), this.type = "TetrahedronGeometry", this.parameters = { radius: t, detail: e };
  }
  static fromJSON(t) {
    return new Uo(t.radius, t.detail);
  }
}
class No extends Ht {
  constructor(t = 1, e = 0.4, n = 12, i = 48, r = Math.PI * 2) {
    super(), this.type = "TorusGeometry", this.parameters = { radius: t, tube: e, radialSegments: n, tubularSegments: i, arc: r }, n = Math.floor(n), i = Math.floor(i);
    const a = [], o = [], l = [], c = [], h = new C(), u = new C(), d = new C();
    for (let f = 0; f <= n; f++) for (let m = 0; m <= i; m++) {
      const _ = m / i * r, g = f / n * Math.PI * 2;
      u.x = (t + e * Math.cos(g)) * Math.cos(_), u.y = (t + e * Math.cos(g)) * Math.sin(_), u.z = e * Math.sin(g), o.push(u.x, u.y, u.z), h.x = t * Math.cos(_), h.y = t * Math.sin(_), d.subVectors(u, h).normalize(), l.push(d.x, d.y, d.z), c.push(m / i), c.push(f / n);
    }
    for (let f = 1; f <= n; f++) for (let m = 1; m <= i; m++) {
      const _ = (i + 1) * f + m - 1, g = (i + 1) * (f - 1) + m - 1, p = (i + 1) * (f - 1) + m, y = (i + 1) * f + m;
      a.push(_, g, y), a.push(g, p, y);
    }
    this.setIndex(a), this.setAttribute("position", new wt(o, 3)), this.setAttribute("normal", new wt(l, 3)), this.setAttribute("uv", new wt(c, 2));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new No(t.radius, t.tube, t.radialSegments, t.tubularSegments, t.arc);
  }
}
class Fo extends Ht {
  constructor(t = 1, e = 0.4, n = 64, i = 8, r = 2, a = 3) {
    super(), this.type = "TorusKnotGeometry", this.parameters = { radius: t, tube: e, tubularSegments: n, radialSegments: i, p: r, q: a }, n = Math.floor(n), i = Math.floor(i);
    const o = [], l = [], c = [], h = [], u = new C(), d = new C(), f = new C(), m = new C(), _ = new C(), g = new C(), p = new C();
    for (let x = 0; x <= n; ++x) {
      const M = x / n * r * Math.PI * 2;
      y(M, r, a, t, f), y(M + 0.01, r, a, t, m), g.subVectors(m, f), p.addVectors(m, f), _.crossVectors(g, p), p.crossVectors(_, g), _.normalize(), p.normalize();
      for (let I = 0; I <= i; ++I) {
        const E = I / i * Math.PI * 2, A = -e * Math.cos(E), P = e * Math.sin(E);
        u.x = f.x + (A * p.x + P * _.x), u.y = f.y + (A * p.y + P * _.y), u.z = f.z + (A * p.z + P * _.z), l.push(u.x, u.y, u.z), d.subVectors(u, f).normalize(), c.push(d.x, d.y, d.z), h.push(x / n), h.push(I / i);
      }
    }
    for (let x = 1; x <= n; x++) for (let M = 1; M <= i; M++) {
      const I = (i + 1) * (x - 1) + (M - 1), E = (i + 1) * x + (M - 1), A = (i + 1) * x + M, P = (i + 1) * (x - 1) + M;
      o.push(I, E, P), o.push(E, A, P);
    }
    this.setIndex(o), this.setAttribute("position", new wt(l, 3)), this.setAttribute("normal", new wt(c, 3)), this.setAttribute("uv", new wt(h, 2));
    function y(x, M, I, E, A) {
      const P = Math.cos(x), V = Math.sin(x), v = I / M * x, b = Math.cos(v);
      A.x = E * (2 + b) * 0.5 * P, A.y = E * (2 + b) * V * 0.5, A.z = E * Math.sin(v) * 0.5;
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new Fo(t.radius, t.tube, t.tubularSegments, t.radialSegments, t.p, t.q);
  }
}
class Oo extends Ht {
  constructor(t = new wc(new C(-1, -1, 0), new C(-1, 1, 0), new C(1, 1, 0)), e = 64, n = 1, i = 8, r = false) {
    super(), this.type = "TubeGeometry", this.parameters = { path: t, tubularSegments: e, radius: n, radialSegments: i, closed: r };
    const a = t.computeFrenetFrames(e, r);
    this.tangents = a.tangents, this.normals = a.normals, this.binormals = a.binormals;
    const o = new C(), l = new C(), c = new Z();
    let h = new C();
    const u = [], d = [], f = [], m = [];
    _(), this.setIndex(m), this.setAttribute("position", new wt(u, 3)), this.setAttribute("normal", new wt(d, 3)), this.setAttribute("uv", new wt(f, 2));
    function _() {
      for (let x = 0; x < e; x++) g(x);
      g(r === false ? e : 0), y(), p();
    }
    function g(x) {
      h = t.getPointAt(x / e, h);
      const M = a.normals[x], I = a.binormals[x];
      for (let E = 0; E <= i; E++) {
        const A = E / i * Math.PI * 2, P = Math.sin(A), V = -Math.cos(A);
        l.x = V * M.x + P * I.x, l.y = V * M.y + P * I.y, l.z = V * M.z + P * I.z, l.normalize(), d.push(l.x, l.y, l.z), o.x = h.x + n * l.x, o.y = h.y + n * l.y, o.z = h.z + n * l.z, u.push(o.x, o.y, o.z);
      }
    }
    function p() {
      for (let x = 1; x <= e; x++) for (let M = 1; M <= i; M++) {
        const I = (i + 1) * (x - 1) + (M - 1), E = (i + 1) * x + (M - 1), A = (i + 1) * x + M, P = (i + 1) * (x - 1) + M;
        m.push(I, E, P), m.push(E, A, P);
      }
    }
    function y() {
      for (let x = 0; x <= e; x++) for (let M = 0; M <= i; M++) c.x = x / e, c.y = M / i, f.push(c.x, c.y);
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.path = this.parameters.path.toJSON(), t;
  }
  static fromJSON(t) {
    return new Oo(new no[t.path.type]().fromJSON(t.path), t.tubularSegments, t.radius, t.radialSegments, t.closed);
  }
}
class nf extends Ht {
  constructor(t = null) {
    if (super(), this.type = "WireframeGeometry", this.parameters = { geometry: t }, t !== null) {
      const e = [], n = /* @__PURE__ */ new Set(), i = new C(), r = new C();
      if (t.index !== null) {
        const a = t.attributes.position, o = t.index;
        let l = t.groups;
        l.length === 0 && (l = [{ start: 0, count: o.count, materialIndex: 0 }]);
        for (let c = 0, h = l.length; c < h; ++c) {
          const u = l[c], d = u.start, f = u.count;
          for (let m = d, _ = d + f; m < _; m += 3) for (let g = 0; g < 3; g++) {
            const p = o.getX(m + g), y = o.getX(m + (g + 1) % 3);
            i.fromBufferAttribute(a, p), r.fromBufferAttribute(a, y), eu(i, r, n) === true && (e.push(i.x, i.y, i.z), e.push(r.x, r.y, r.z));
          }
        }
      } else {
        const a = t.attributes.position;
        for (let o = 0, l = a.count / 3; o < l; o++) for (let c = 0; c < 3; c++) {
          const h = 3 * o + c, u = 3 * o + (c + 1) % 3;
          i.fromBufferAttribute(a, h), r.fromBufferAttribute(a, u), eu(i, r, n) === true && (e.push(i.x, i.y, i.z), e.push(r.x, r.y, r.z));
        }
      }
      this.setAttribute("position", new wt(e, 3));
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
}
function eu(s, t, e) {
  const n = `${s.x},${s.y},${s.z}-${t.x},${t.y},${t.z}`, i = `${t.x},${t.y},${t.z}-${s.x},${s.y},${s.z}`;
  return e.has(n) === true || e.has(i) === true ? false : (e.add(n), e.add(i), true);
}
var nu = Object.freeze({ __proto__: null, BoxGeometry: Ri, CapsuleGeometry: Eo, CircleGeometry: Ao, ConeGeometry: To, CylinderGeometry: fs, DodecahedronGeometry: Co, EdgesGeometry: Qd, ExtrudeGeometry: Po, IcosahedronGeometry: Io, LatheGeometry: fr, OctahedronGeometry: pr, PlaneGeometry: us, PolyhedronGeometry: Kn, RingGeometry: Lo, ShapeGeometry: Do, SphereGeometry: mr, TetrahedronGeometry: Uo, TorusGeometry: No, TorusKnotGeometry: Fo, TubeGeometry: Oo, WireframeGeometry: nf });
class sf extends Ce {
  constructor(t) {
    super(), this.isShadowMaterial = true, this.type = "ShadowMaterial", this.color = new ft(0), this.transparent = true, this.fog = true, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.fog = t.fog, this;
  }
}
class rf extends an {
  constructor(t) {
    super(t), this.isRawShaderMaterial = true, this.type = "RawShaderMaterial";
  }
}
class Ac extends Ce {
  constructor(t) {
    super(), this.isMeshStandardMaterial = true, this.defines = { STANDARD: "" }, this.type = "MeshStandardMaterial", this.color = new ft(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new ft(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = Jn, this.normalScale = new Z(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new Ze(), this.envMapIntensity = 1, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = false, this.fog = true, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.defines = { STANDARD: "" }, this.color.copy(t.color), this.roughness = t.roughness, this.metalness = t.metalness, this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.emissive.copy(t.emissive), this.emissiveMap = t.emissiveMap, this.emissiveIntensity = t.emissiveIntensity, this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.roughnessMap = t.roughnessMap, this.metalnessMap = t.metalnessMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.envMapIntensity = t.envMapIntensity, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.flatShading = t.flatShading, this.fog = t.fog, this;
  }
}
class af extends Ac {
  constructor(t) {
    super(), this.isMeshPhysicalMaterial = true, this.defines = { STANDARD: "", PHYSICAL: "" }, this.type = "MeshPhysicalMaterial", this.anisotropyRotation = 0, this.anisotropyMap = null, this.clearcoatMap = null, this.clearcoatRoughness = 0, this.clearcoatRoughnessMap = null, this.clearcoatNormalScale = new Z(1, 1), this.clearcoatNormalMap = null, this.ior = 1.5, Object.defineProperty(this, "reflectivity", { get: function() {
      return he(2.5 * (this.ior - 1) / (this.ior + 1), 0, 1);
    }, set: function(e) {
      this.ior = (1 + 0.4 * e) / (1 - 0.4 * e);
    } }), this.iridescenceMap = null, this.iridescenceIOR = 1.3, this.iridescenceThicknessRange = [100, 400], this.iridescenceThicknessMap = null, this.sheenColor = new ft(0), this.sheenColorMap = null, this.sheenRoughness = 1, this.sheenRoughnessMap = null, this.transmissionMap = null, this.thickness = 0, this.thicknessMap = null, this.attenuationDistance = 1 / 0, this.attenuationColor = new ft(1, 1, 1), this.specularIntensity = 1, this.specularIntensityMap = null, this.specularColor = new ft(1, 1, 1), this.specularColorMap = null, this._anisotropy = 0, this._clearcoat = 0, this._dispersion = 0, this._iridescence = 0, this._sheen = 0, this._transmission = 0, this.setValues(t);
  }
  get anisotropy() {
    return this._anisotropy;
  }
  set anisotropy(t) {
    this._anisotropy > 0 != t > 0 && this.version++, this._anisotropy = t;
  }
  get clearcoat() {
    return this._clearcoat;
  }
  set clearcoat(t) {
    this._clearcoat > 0 != t > 0 && this.version++, this._clearcoat = t;
  }
  get iridescence() {
    return this._iridescence;
  }
  set iridescence(t) {
    this._iridescence > 0 != t > 0 && this.version++, this._iridescence = t;
  }
  get dispersion() {
    return this._dispersion;
  }
  set dispersion(t) {
    this._dispersion > 0 != t > 0 && this.version++, this._dispersion = t;
  }
  get sheen() {
    return this._sheen;
  }
  set sheen(t) {
    this._sheen > 0 != t > 0 && this.version++, this._sheen = t;
  }
  get transmission() {
    return this._transmission;
  }
  set transmission(t) {
    this._transmission > 0 != t > 0 && this.version++, this._transmission = t;
  }
  copy(t) {
    return super.copy(t), this.defines = { STANDARD: "", PHYSICAL: "" }, this.anisotropy = t.anisotropy, this.anisotropyRotation = t.anisotropyRotation, this.anisotropyMap = t.anisotropyMap, this.clearcoat = t.clearcoat, this.clearcoatMap = t.clearcoatMap, this.clearcoatRoughness = t.clearcoatRoughness, this.clearcoatRoughnessMap = t.clearcoatRoughnessMap, this.clearcoatNormalMap = t.clearcoatNormalMap, this.clearcoatNormalScale.copy(t.clearcoatNormalScale), this.dispersion = t.dispersion, this.ior = t.ior, this.iridescence = t.iridescence, this.iridescenceMap = t.iridescenceMap, this.iridescenceIOR = t.iridescenceIOR, this.iridescenceThicknessRange = [...t.iridescenceThicknessRange], this.iridescenceThicknessMap = t.iridescenceThicknessMap, this.sheen = t.sheen, this.sheenColor.copy(t.sheenColor), this.sheenColorMap = t.sheenColorMap, this.sheenRoughness = t.sheenRoughness, this.sheenRoughnessMap = t.sheenRoughnessMap, this.transmission = t.transmission, this.transmissionMap = t.transmissionMap, this.thickness = t.thickness, this.thicknessMap = t.thicknessMap, this.attenuationDistance = t.attenuationDistance, this.attenuationColor.copy(t.attenuationColor), this.specularIntensity = t.specularIntensity, this.specularIntensityMap = t.specularIntensityMap, this.specularColor.copy(t.specularColor), this.specularColorMap = t.specularColorMap, this;
  }
}
class of extends Ce {
  constructor(t) {
    super(), this.isMeshPhongMaterial = true, this.type = "MeshPhongMaterial", this.color = new ft(16777215), this.specular = new ft(1118481), this.shininess = 30, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new ft(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = Jn, this.normalScale = new Z(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new Ze(), this.combine = lr, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = false, this.fog = true, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.specular.copy(t.specular), this.shininess = t.shininess, this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.emissive.copy(t.emissive), this.emissiveMap = t.emissiveMap, this.emissiveIntensity = t.emissiveIntensity, this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.specularMap = t.specularMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.combine = t.combine, this.reflectivity = t.reflectivity, this.refractionRatio = t.refractionRatio, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.flatShading = t.flatShading, this.fog = t.fog, this;
  }
}
class lf extends Ce {
  constructor(t) {
    super(), this.isMeshToonMaterial = true, this.defines = { TOON: "" }, this.type = "MeshToonMaterial", this.color = new ft(16777215), this.map = null, this.gradientMap = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new ft(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = Jn, this.normalScale = new Z(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.alphaMap = null, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = true, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.gradientMap = t.gradientMap, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.emissive.copy(t.emissive), this.emissiveMap = t.emissiveMap, this.emissiveIntensity = t.emissiveIntensity, this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.alphaMap = t.alphaMap, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.fog = t.fog, this;
  }
}
class cf extends Ce {
  constructor(t) {
    super(), this.isMeshNormalMaterial = true, this.type = "MeshNormalMaterial", this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = Jn, this.normalScale = new Z(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = false, this.wireframeLinewidth = 1, this.flatShading = false, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.flatShading = t.flatShading, this;
  }
}
class hf extends Ce {
  constructor(t) {
    super(), this.isMeshLambertMaterial = true, this.type = "MeshLambertMaterial", this.color = new ft(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new ft(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = Jn, this.normalScale = new Z(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new Ze(), this.combine = lr, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = false, this.fog = true, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.emissive.copy(t.emissive), this.emissiveMap = t.emissiveMap, this.emissiveIntensity = t.emissiveIntensity, this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.specularMap = t.specularMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.combine = t.combine, this.reflectivity = t.reflectivity, this.refractionRatio = t.refractionRatio, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.flatShading = t.flatShading, this.fog = t.fog, this;
  }
}
class uf extends Ce {
  constructor(t) {
    super(), this.isMeshMatcapMaterial = true, this.defines = { MATCAP: "" }, this.type = "MeshMatcapMaterial", this.color = new ft(16777215), this.matcap = null, this.map = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = Jn, this.normalScale = new Z(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.alphaMap = null, this.flatShading = false, this.fog = true, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.defines = { MATCAP: "" }, this.color.copy(t.color), this.matcap = t.matcap, this.map = t.map, this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.alphaMap = t.alphaMap, this.flatShading = t.flatShading, this.fog = t.fog, this;
  }
}
class df extends Ne {
  constructor(t) {
    super(), this.isLineDashedMaterial = true, this.type = "LineDashedMaterial", this.scale = 1, this.dashSize = 3, this.gapSize = 1, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.scale = t.scale, this.dashSize = t.dashSize, this.gapSize = t.gapSize, this;
  }
}
function xi(s, t, e) {
  return !s || !e && s.constructor === t ? s : typeof t.BYTES_PER_ELEMENT == "number" ? new t(s) : Array.prototype.slice.call(s);
}
function ff(s) {
  return ArrayBuffer.isView(s) && !(s instanceof DataView);
}
function pf(s) {
  function t(i, r) {
    return s[i] - s[r];
  }
  const e = s.length, n = new Array(e);
  for (let i = 0; i !== e; ++i) n[i] = i;
  return n.sort(t), n;
}
function ql(s, t, e) {
  const n = s.length, i = new s.constructor(n);
  for (let r = 0, a = 0; a !== n; ++r) {
    const o = e[r] * t;
    for (let l = 0; l !== t; ++l) i[a++] = s[o + l];
  }
  return i;
}
function Tc(s, t, e, n) {
  let i = 1, r = s[0];
  for (; r !== void 0 && r[n] === void 0; ) r = s[i++];
  if (r === void 0) return;
  let a = r[n];
  if (a !== void 0) if (Array.isArray(a)) do
    a = r[n], a !== void 0 && (t.push(r.time), e.push.apply(e, a)), r = s[i++];
  while (r !== void 0);
  else if (a.toArray !== void 0) do
    a = r[n], a !== void 0 && (t.push(r.time), a.toArray(e, e.length)), r = s[i++];
  while (r !== void 0);
  else do
    a = r[n], a !== void 0 && (t.push(r.time), e.push(a)), r = s[i++];
  while (r !== void 0);
}
function Jv(s, t, e, n, i = 30) {
  const r = s.clone();
  r.name = t;
  const a = [];
  for (let l = 0; l < r.tracks.length; ++l) {
    const c = r.tracks[l], h = c.getValueSize(), u = [], d = [];
    for (let f = 0; f < c.times.length; ++f) {
      const m = c.times[f] * i;
      if (!(m < e || m >= n)) {
        u.push(c.times[f]);
        for (let _ = 0; _ < h; ++_) d.push(c.values[f * h + _]);
      }
    }
    u.length !== 0 && (c.times = xi(u, c.times.constructor), c.values = xi(d, c.values.constructor), a.push(c));
  }
  r.tracks = a;
  let o = 1 / 0;
  for (let l = 0; l < r.tracks.length; ++l) o > r.tracks[l].times[0] && (o = r.tracks[l].times[0]);
  for (let l = 0; l < r.tracks.length; ++l) r.tracks[l].shift(-1 * o);
  return r.resetDuration(), r;
}
function $v(s, t = 0, e = s, n = 30) {
  n <= 0 && (n = 30);
  const i = e.tracks.length, r = t / n;
  for (let a = 0; a < i; ++a) {
    const o = e.tracks[a], l = o.ValueTypeName;
    if (l === "bool" || l === "string") continue;
    const c = s.tracks.find(function(p) {
      return p.name === o.name && p.ValueTypeName === l;
    });
    if (c === void 0) continue;
    let h = 0;
    const u = o.getValueSize();
    o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline && (h = u / 3);
    let d = 0;
    const f = c.getValueSize();
    c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline && (d = f / 3);
    const m = o.times.length - 1;
    let _;
    if (r <= o.times[0]) {
      const p = h, y = u - h;
      _ = o.values.slice(p, y);
    } else if (r >= o.times[m]) {
      const p = m * u + h, y = p + u - h;
      _ = o.values.slice(p, y);
    } else {
      const p = o.createInterpolant(), y = h, x = u - h;
      p.evaluate(r), _ = p.resultBuffer.slice(y, x);
    }
    l === "quaternion" && new Ve().fromArray(_).normalize().conjugate().toArray(_);
    const g = c.times.length;
    for (let p = 0; p < g; ++p) {
      const y = p * f + d;
      if (l === "quaternion") Ve.multiplyQuaternionsFlat(c.values, y, _, 0, c.values, y);
      else {
        const x = f - d * 2;
        for (let M = 0; M < x; ++M) c.values[y + M] -= _[M];
      }
    }
  }
  return s.blendMode = oc, s;
}
const Kv = { convertArray: xi, isTypedArray: ff, getKeyframeOrder: pf, sortedArray: ql, flattenJSON: Tc, subclip: Jv, makeClipAdditive: $v };
class gr {
  constructor(t, e, n, i) {
    this.parameterPositions = t, this._cachedIndex = 0, this.resultBuffer = i !== void 0 ? i : new e.constructor(n), this.sampleValues = e, this.valueSize = n, this.settings = null, this.DefaultSettings_ = {};
  }
  evaluate(t) {
    const e = this.parameterPositions;
    let n = this._cachedIndex, i = e[n], r = e[n - 1];
    t: {
      e: {
        let a;
        n: {
          i: if (!(t < i)) {
            for (let o = n + 2; ; ) {
              if (i === void 0) {
                if (t < r) break i;
                return n = e.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
              }
              if (n === o) break;
              if (r = i, i = e[++n], t < i) break e;
            }
            a = e.length;
            break n;
          }
          if (!(t >= r)) {
            const o = e[1];
            t < o && (n = 2, r = o);
            for (let l = n - 2; ; ) {
              if (r === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
              if (n === l) break;
              if (i = r, r = e[--n - 1], t >= r) break e;
            }
            a = n, n = 0;
            break n;
          }
          break t;
        }
        for (; n < a; ) {
          const o = n + a >>> 1;
          t < e[o] ? a = o : n = o + 1;
        }
        if (i = e[n], r = e[n - 1], r === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
        if (i === void 0) return n = e.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
      }
      this._cachedIndex = n, this.intervalChanged_(n, r, i);
    }
    return this.interpolate_(n, r, t, i);
  }
  getSettings_() {
    return this.settings || this.DefaultSettings_;
  }
  copySampleValue_(t) {
    const e = this.resultBuffer, n = this.sampleValues, i = this.valueSize, r = t * i;
    for (let a = 0; a !== i; ++a) e[a] = n[r + a];
    return e;
  }
  interpolate_() {
    throw new Error("call to abstract method");
  }
  intervalChanged_() {
  }
}
class mf extends gr {
  constructor(t, e, n, i) {
    super(t, e, n, i), this._weightPrev = -0, this._offsetPrev = -0, this._weightNext = -0, this._offsetNext = -0, this.DefaultSettings_ = { endingStart: mi, endingEnd: mi };
  }
  intervalChanged_(t, e, n) {
    const i = this.parameterPositions;
    let r = t - 2, a = t + 1, o = i[r], l = i[a];
    if (o === void 0) switch (this.getSettings_().endingStart) {
      case gi:
        r = t, o = 2 * e - n;
        break;
      case qs:
        r = i.length - 2, o = e + i[r] - i[r + 1];
        break;
      default:
        r = t, o = n;
    }
    if (l === void 0) switch (this.getSettings_().endingEnd) {
      case gi:
        a = t, l = 2 * n - e;
        break;
      case qs:
        a = 1, l = n + i[1] - i[0];
        break;
      default:
        a = t - 1, l = e;
    }
    const c = (n - e) * 0.5, h = this.valueSize;
    this._weightPrev = c / (e - o), this._weightNext = c / (l - n), this._offsetPrev = r * h, this._offsetNext = a * h;
  }
  interpolate_(t, e, n, i) {
    const r = this.resultBuffer, a = this.sampleValues, o = this.valueSize, l = t * o, c = l - o, h = this._offsetPrev, u = this._offsetNext, d = this._weightPrev, f = this._weightNext, m = (n - e) / (i - e), _ = m * m, g = _ * m, p = -d * g + 2 * d * _ - d * m, y = (1 + d) * g + (-1.5 - 2 * d) * _ + (-0.5 + d) * m + 1, x = (-1 - f) * g + (1.5 + f) * _ + 0.5 * m, M = f * g - f * _;
    for (let I = 0; I !== o; ++I) r[I] = p * a[h + I] + y * a[c + I] + x * a[l + I] + M * a[u + I];
    return r;
  }
}
class Cc extends gr {
  constructor(t, e, n, i) {
    super(t, e, n, i);
  }
  interpolate_(t, e, n, i) {
    const r = this.resultBuffer, a = this.sampleValues, o = this.valueSize, l = t * o, c = l - o, h = (n - e) / (i - e), u = 1 - h;
    for (let d = 0; d !== o; ++d) r[d] = a[c + d] * u + a[l + d] * h;
    return r;
  }
}
class gf extends gr {
  constructor(t, e, n, i) {
    super(t, e, n, i);
  }
  interpolate_(t) {
    return this.copySampleValue_(t - 1);
  }
}
class ln {
  constructor(t, e, n, i) {
    if (t === void 0) throw new Error("THREE.KeyframeTrack: track name is undefined");
    if (e === void 0 || e.length === 0) throw new Error("THREE.KeyframeTrack: no keyframes in track named " + t);
    this.name = t, this.times = xi(e, this.TimeBufferType), this.values = xi(n, this.ValueBufferType), this.setInterpolation(i || this.DefaultInterpolation);
  }
  static toJSON(t) {
    const e = t.constructor;
    let n;
    if (e.toJSON !== this.toJSON) n = e.toJSON(t);
    else {
      n = { name: t.name, times: xi(t.times, Array), values: xi(t.values, Array) };
      const i = t.getInterpolation();
      i !== t.DefaultInterpolation && (n.interpolation = i);
    }
    return n.type = t.ValueTypeName, n;
  }
  InterpolantFactoryMethodDiscrete(t) {
    return new gf(this.times, this.values, this.getValueSize(), t);
  }
  InterpolantFactoryMethodLinear(t) {
    return new Cc(this.times, this.values, this.getValueSize(), t);
  }
  InterpolantFactoryMethodSmooth(t) {
    return new mf(this.times, this.values, this.getValueSize(), t);
  }
  setInterpolation(t) {
    let e;
    switch (t) {
      case Xs:
        e = this.InterpolantFactoryMethodDiscrete;
        break;
      case ja:
        e = this.InterpolantFactoryMethodLinear;
        break;
      case da:
        e = this.InterpolantFactoryMethodSmooth;
        break;
    }
    if (e === void 0) {
      const n = "unsupported interpolation for " + this.ValueTypeName + " keyframe track named " + this.name;
      if (this.createInterpolant === void 0) if (t !== this.DefaultInterpolation) this.setInterpolation(this.DefaultInterpolation);
      else throw new Error(n);
      return console.warn("THREE.KeyframeTrack:", n), this;
    }
    return this.createInterpolant = e, this;
  }
  getInterpolation() {
    switch (this.createInterpolant) {
      case this.InterpolantFactoryMethodDiscrete:
        return Xs;
      case this.InterpolantFactoryMethodLinear:
        return ja;
      case this.InterpolantFactoryMethodSmooth:
        return da;
    }
  }
  getValueSize() {
    return this.values.length / this.times.length;
  }
  shift(t) {
    if (t !== 0) {
      const e = this.times;
      for (let n = 0, i = e.length; n !== i; ++n) e[n] += t;
    }
    return this;
  }
  scale(t) {
    if (t !== 1) {
      const e = this.times;
      for (let n = 0, i = e.length; n !== i; ++n) e[n] *= t;
    }
    return this;
  }
  trim(t, e) {
    const n = this.times, i = n.length;
    let r = 0, a = i - 1;
    for (; r !== i && n[r] < t; ) ++r;
    for (; a !== -1 && n[a] > e; ) --a;
    if (++a, r !== 0 || a !== i) {
      r >= a && (a = Math.max(a, 1), r = a - 1);
      const o = this.getValueSize();
      this.times = n.slice(r, a), this.values = this.values.slice(r * o, a * o);
    }
    return this;
  }
  validate() {
    let t = true;
    const e = this.getValueSize();
    e - Math.floor(e) !== 0 && (console.error("THREE.KeyframeTrack: Invalid value size in track.", this), t = false);
    const n = this.times, i = this.values, r = n.length;
    r === 0 && (console.error("THREE.KeyframeTrack: Track is empty.", this), t = false);
    let a = null;
    for (let o = 0; o !== r; o++) {
      const l = n[o];
      if (typeof l == "number" && isNaN(l)) {
        console.error("THREE.KeyframeTrack: Time is not a valid number.", this, o, l), t = false;
        break;
      }
      if (a !== null && a > l) {
        console.error("THREE.KeyframeTrack: Out of order keys.", this, o, l, a), t = false;
        break;
      }
      a = l;
    }
    if (i !== void 0 && ff(i)) for (let o = 0, l = i.length; o !== l; ++o) {
      const c = i[o];
      if (isNaN(c)) {
        console.error("THREE.KeyframeTrack: Value is not a valid number.", this, o, c), t = false;
        break;
      }
    }
    return t;
  }
  optimize() {
    const t = this.times.slice(), e = this.values.slice(), n = this.getValueSize(), i = this.getInterpolation() === da, r = t.length - 1;
    let a = 1;
    for (let o = 1; o < r; ++o) {
      let l = false;
      const c = t[o], h = t[o + 1];
      if (c !== h && (o !== 1 || c !== t[0])) if (i) l = true;
      else {
        const u = o * n, d = u - n, f = u + n;
        for (let m = 0; m !== n; ++m) {
          const _ = e[u + m];
          if (_ !== e[d + m] || _ !== e[f + m]) {
            l = true;
            break;
          }
        }
      }
      if (l) {
        if (o !== a) {
          t[a] = t[o];
          const u = o * n, d = a * n;
          for (let f = 0; f !== n; ++f) e[d + f] = e[u + f];
        }
        ++a;
      }
    }
    if (r > 0) {
      t[a] = t[r];
      for (let o = r * n, l = a * n, c = 0; c !== n; ++c) e[l + c] = e[o + c];
      ++a;
    }
    return a !== t.length ? (this.times = t.slice(0, a), this.values = e.slice(0, a * n)) : (this.times = t, this.values = e), this;
  }
  clone() {
    const t = this.times.slice(), e = this.values.slice(), n = this.constructor, i = new n(this.name, t, e);
    return i.createInterpolant = this.createInterpolant, i;
  }
}
ln.prototype.TimeBufferType = Float32Array;
ln.prototype.ValueBufferType = Float32Array;
ln.prototype.DefaultInterpolation = ja;
class Pi extends ln {
  constructor(t, e, n) {
    super(t, e, n);
  }
}
Pi.prototype.ValueTypeName = "bool";
Pi.prototype.ValueBufferType = Array;
Pi.prototype.DefaultInterpolation = Xs;
Pi.prototype.InterpolantFactoryMethodLinear = void 0;
Pi.prototype.InterpolantFactoryMethodSmooth = void 0;
class Rc extends ln {
}
Rc.prototype.ValueTypeName = "color";
class ir extends ln {
}
ir.prototype.ValueTypeName = "number";
class _f extends gr {
  constructor(t, e, n, i) {
    super(t, e, n, i);
  }
  interpolate_(t, e, n, i) {
    const r = this.resultBuffer, a = this.sampleValues, o = this.valueSize, l = (n - e) / (i - e);
    let c = t * o;
    for (let h = c + o; c !== h; c += 4) Ve.slerpFlat(r, 0, a, c - o, a, c, l);
    return r;
  }
}
class _r extends ln {
  InterpolantFactoryMethodLinear(t) {
    return new _f(this.times, this.values, this.getValueSize(), t);
  }
}
_r.prototype.ValueTypeName = "quaternion";
_r.prototype.InterpolantFactoryMethodSmooth = void 0;
class Ii extends ln {
  constructor(t, e, n) {
    super(t, e, n);
  }
}
Ii.prototype.ValueTypeName = "string";
Ii.prototype.ValueBufferType = Array;
Ii.prototype.DefaultInterpolation = Xs;
Ii.prototype.InterpolantFactoryMethodLinear = void 0;
Ii.prototype.InterpolantFactoryMethodSmooth = void 0;
class sr extends ln {
}
sr.prototype.ValueTypeName = "vector";
class rr {
  constructor(t = "", e = -1, n = [], i = uo) {
    this.name = t, this.tracks = n, this.duration = e, this.blendMode = i, this.uuid = Ye(), this.duration < 0 && this.resetDuration();
  }
  static parse(t) {
    const e = [], n = t.tracks, i = 1 / (t.fps || 1);
    for (let a = 0, o = n.length; a !== o; ++a) e.push(jv(n[a]).scale(i));
    const r = new this(t.name, t.duration, e, t.blendMode);
    return r.uuid = t.uuid, r;
  }
  static toJSON(t) {
    const e = [], n = t.tracks, i = { name: t.name, duration: t.duration, tracks: e, uuid: t.uuid, blendMode: t.blendMode };
    for (let r = 0, a = n.length; r !== a; ++r) e.push(ln.toJSON(n[r]));
    return i;
  }
  static CreateFromMorphTargetSequence(t, e, n, i) {
    const r = e.length, a = [];
    for (let o = 0; o < r; o++) {
      let l = [], c = [];
      l.push((o + r - 1) % r, o, (o + 1) % r), c.push(0, 1, 0);
      const h = pf(l);
      l = ql(l, 1, h), c = ql(c, 1, h), !i && l[0] === 0 && (l.push(r), c.push(c[0])), a.push(new ir(".morphTargetInfluences[" + e[o].name + "]", l, c).scale(1 / n));
    }
    return new this(t, -1, a);
  }
  static findByName(t, e) {
    let n = t;
    if (!Array.isArray(t)) {
      const i = t;
      n = i.geometry && i.geometry.animations || i.animations;
    }
    for (let i = 0; i < n.length; i++) if (n[i].name === e) return n[i];
    return null;
  }
  static CreateClipsFromMorphTargetSequences(t, e, n) {
    const i = {}, r = /^([\w-]*?)([\d]+)$/;
    for (let o = 0, l = t.length; o < l; o++) {
      const c = t[o], h = c.name.match(r);
      if (h && h.length > 1) {
        const u = h[1];
        let d = i[u];
        d || (i[u] = d = []), d.push(c);
      }
    }
    const a = [];
    for (const o in i) a.push(this.CreateFromMorphTargetSequence(o, i[o], e, n));
    return a;
  }
  static parseAnimation(t, e) {
    if (!t) return console.error("THREE.AnimationClip: No animation in JSONLoader data."), null;
    const n = function(u, d, f, m, _) {
      if (f.length !== 0) {
        const g = [], p = [];
        Tc(f, g, p, m), g.length !== 0 && _.push(new u(d, g, p));
      }
    }, i = [], r = t.name || "default", a = t.fps || 30, o = t.blendMode;
    let l = t.length || -1;
    const c = t.hierarchy || [];
    for (let u = 0; u < c.length; u++) {
      const d = c[u].keys;
      if (!(!d || d.length === 0)) if (d[0].morphTargets) {
        const f = {};
        let m;
        for (m = 0; m < d.length; m++) if (d[m].morphTargets) for (let _ = 0; _ < d[m].morphTargets.length; _++) f[d[m].morphTargets[_]] = -1;
        for (const _ in f) {
          const g = [], p = [];
          for (let y = 0; y !== d[m].morphTargets.length; ++y) {
            const x = d[m];
            g.push(x.time), p.push(x.morphTarget === _ ? 1 : 0);
          }
          i.push(new ir(".morphTargetInfluence[" + _ + "]", g, p));
        }
        l = f.length * a;
      } else {
        const f = ".bones[" + e[u].name + "]";
        n(sr, f + ".position", d, "pos", i), n(_r, f + ".quaternion", d, "rot", i), n(sr, f + ".scale", d, "scl", i);
      }
    }
    return i.length === 0 ? null : new this(r, l, i, o);
  }
  resetDuration() {
    const t = this.tracks;
    let e = 0;
    for (let n = 0, i = t.length; n !== i; ++n) {
      const r = this.tracks[n];
      e = Math.max(e, r.times[r.times.length - 1]);
    }
    return this.duration = e, this;
  }
  trim() {
    for (let t = 0; t < this.tracks.length; t++) this.tracks[t].trim(0, this.duration);
    return this;
  }
  validate() {
    let t = true;
    for (let e = 0; e < this.tracks.length; e++) t = t && this.tracks[e].validate();
    return t;
  }
  optimize() {
    for (let t = 0; t < this.tracks.length; t++) this.tracks[t].optimize();
    return this;
  }
  clone() {
    const t = [];
    for (let e = 0; e < this.tracks.length; e++) t.push(this.tracks[e].clone());
    return new this.constructor(this.name, this.duration, t, this.blendMode);
  }
  toJSON() {
    return this.constructor.toJSON(this);
  }
}
function Qv(s) {
  switch (s.toLowerCase()) {
    case "scalar":
    case "double":
    case "float":
    case "number":
    case "integer":
      return ir;
    case "vector":
    case "vector2":
    case "vector3":
    case "vector4":
      return sr;
    case "color":
      return Rc;
    case "quaternion":
      return _r;
    case "bool":
    case "boolean":
      return Pi;
    case "string":
      return Ii;
  }
  throw new Error("THREE.KeyframeTrack: Unsupported typeName: " + s);
}
function jv(s) {
  if (s.type === void 0) throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");
  const t = Qv(s.type);
  if (s.times === void 0) {
    const e = [], n = [];
    Tc(s.keys, e, n, "value"), s.times = e, s.values = n;
  }
  return t.parse !== void 0 ? t.parse(s) : new t(s.name, s.times, s.values, s.interpolation);
}
const Tn = { enabled: false, files: {}, add: function(s, t) {
  this.enabled !== false && (this.files[s] = t);
}, get: function(s) {
  if (this.enabled !== false) return this.files[s];
}, remove: function(s) {
  delete this.files[s];
}, clear: function() {
  this.files = {};
} };
class Pc {
  constructor(t, e, n) {
    const i = this;
    let r = false, a = 0, o = 0, l;
    const c = [];
    this.onStart = void 0, this.onLoad = t, this.onProgress = e, this.onError = n, this.itemStart = function(h) {
      o++, r === false && i.onStart !== void 0 && i.onStart(h, a, o), r = true;
    }, this.itemEnd = function(h) {
      a++, i.onProgress !== void 0 && i.onProgress(h, a, o), a === o && (r = false, i.onLoad !== void 0 && i.onLoad());
    }, this.itemError = function(h) {
      i.onError !== void 0 && i.onError(h);
    }, this.resolveURL = function(h) {
      return l ? l(h) : h;
    }, this.setURLModifier = function(h) {
      return l = h, this;
    }, this.addHandler = function(h, u) {
      return c.push(h, u), this;
    }, this.removeHandler = function(h) {
      const u = c.indexOf(h);
      return u !== -1 && c.splice(u, 2), this;
    }, this.getHandler = function(h) {
      for (let u = 0, d = c.length; u < d; u += 2) {
        const f = c[u], m = c[u + 1];
        if (f.global && (f.lastIndex = 0), f.test(h)) return m;
      }
      return null;
    };
  }
}
const xf = new Pc();
class He {
  constructor(t) {
    this.manager = t !== void 0 ? t : xf, this.crossOrigin = "anonymous", this.withCredentials = false, this.path = "", this.resourcePath = "", this.requestHeader = {};
  }
  load() {
  }
  loadAsync(t, e) {
    const n = this;
    return new Promise(function(i, r) {
      n.load(t, i, e, r);
    });
  }
  parse() {
  }
  setCrossOrigin(t) {
    return this.crossOrigin = t, this;
  }
  setWithCredentials(t) {
    return this.withCredentials = t, this;
  }
  setPath(t) {
    return this.path = t, this;
  }
  setResourcePath(t) {
    return this.resourcePath = t, this;
  }
  setRequestHeader(t) {
    return this.requestHeader = t, this;
  }
}
He.DEFAULT_MATERIAL_NAME = "__DEFAULT";
const wn = {};
class ty extends Error {
  constructor(t, e) {
    super(t), this.response = e;
  }
}
class Dn extends He {
  constructor(t) {
    super(t);
  }
  load(t, e, n, i) {
    t === void 0 && (t = ""), this.path !== void 0 && (t = this.path + t), t = this.manager.resolveURL(t);
    const r = Tn.get(t);
    if (r !== void 0) return this.manager.itemStart(t), setTimeout(() => {
      e && e(r), this.manager.itemEnd(t);
    }, 0), r;
    if (wn[t] !== void 0) {
      wn[t].push({ onLoad: e, onProgress: n, onError: i });
      return;
    }
    wn[t] = [], wn[t].push({ onLoad: e, onProgress: n, onError: i });
    const a = new Request(t, { headers: new Headers(this.requestHeader), credentials: this.withCredentials ? "include" : "same-origin" }), o = this.mimeType, l = this.responseType;
    fetch(a).then((c) => {
      if (c.status === 200 || c.status === 0) {
        if (c.status === 0 && console.warn("THREE.FileLoader: HTTP Status 0 received."), typeof ReadableStream > "u" || c.body === void 0 || c.body.getReader === void 0) return c;
        const h = wn[t], u = c.body.getReader(), d = c.headers.get("X-File-Size") || c.headers.get("Content-Length"), f = d ? parseInt(d) : 0, m = f !== 0;
        let _ = 0;
        const g = new ReadableStream({ start(p) {
          y();
          function y() {
            u.read().then(({ done: x, value: M }) => {
              if (x) p.close();
              else {
                _ += M.byteLength;
                const I = new ProgressEvent("progress", { lengthComputable: m, loaded: _, total: f });
                for (let E = 0, A = h.length; E < A; E++) {
                  const P = h[E];
                  P.onProgress && P.onProgress(I);
                }
                p.enqueue(M), y();
              }
            }, (x) => {
              p.error(x);
            });
          }
        } });
        return new Response(g);
      } else throw new ty(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`, c);
    }).then((c) => {
      switch (l) {
        case "arraybuffer":
          return c.arrayBuffer();
        case "blob":
          return c.blob();
        case "document":
          return c.text().then((h) => new DOMParser().parseFromString(h, o));
        case "json":
          return c.json();
        default:
          if (o === void 0) return c.text();
          {
            const u = /charset="?([^;"\s]*)"?/i.exec(o), d = u && u[1] ? u[1].toLowerCase() : void 0, f = new TextDecoder(d);
            return c.arrayBuffer().then((m) => f.decode(m));
          }
      }
    }).then((c) => {
      Tn.add(t, c);
      const h = wn[t];
      delete wn[t];
      for (let u = 0, d = h.length; u < d; u++) {
        const f = h[u];
        f.onLoad && f.onLoad(c);
      }
    }).catch((c) => {
      const h = wn[t];
      if (h === void 0) throw this.manager.itemError(t), c;
      delete wn[t];
      for (let u = 0, d = h.length; u < d; u++) {
        const f = h[u];
        f.onError && f.onError(c);
      }
      this.manager.itemError(t);
    }).finally(() => {
      this.manager.itemEnd(t);
    }), this.manager.itemStart(t);
  }
  setResponseType(t) {
    return this.responseType = t, this;
  }
  setMimeType(t) {
    return this.mimeType = t, this;
  }
}
class ey extends He {
  constructor(t) {
    super(t);
  }
  load(t, e, n, i) {
    const r = this, a = new Dn(this.manager);
    a.setPath(this.path), a.setRequestHeader(this.requestHeader), a.setWithCredentials(this.withCredentials), a.load(t, function(o) {
      try {
        e(r.parse(JSON.parse(o)));
      } catch (l) {
        i ? i(l) : console.error(l), r.manager.itemError(t);
      }
    }, n, i);
  }
  parse(t) {
    const e = [];
    for (let n = 0; n < t.length; n++) {
      const i = rr.parse(t[n]);
      e.push(i);
    }
    return e;
  }
}
class ny extends He {
  constructor(t) {
    super(t);
  }
  load(t, e, n, i) {
    const r = this, a = [], o = new bo(), l = new Dn(this.manager);
    l.setPath(this.path), l.setResponseType("arraybuffer"), l.setRequestHeader(this.requestHeader), l.setWithCredentials(r.withCredentials);
    let c = 0;
    function h(u) {
      l.load(t[u], function(d) {
        const f = r.parse(d, true);
        a[u] = { width: f.width, height: f.height, format: f.format, mipmaps: f.mipmaps }, c += 1, c === 6 && (f.mipmapCount === 1 && (o.minFilter = ge), o.image = a, o.format = f.format, o.needsUpdate = true, e && e(o));
      }, n, i);
    }
    if (Array.isArray(t)) for (let u = 0, d = t.length; u < d; ++u) h(u);
    else l.load(t, function(u) {
      const d = r.parse(u, true);
      if (d.isCubemap) {
        const f = d.mipmaps.length / d.mipmapCount;
        for (let m = 0; m < f; m++) {
          a[m] = { mipmaps: [] };
          for (let _ = 0; _ < d.mipmapCount; _++) a[m].mipmaps.push(d.mipmaps[m * d.mipmapCount + _]), a[m].format = d.format, a[m].width = d.width, a[m].height = d.height;
        }
        o.image = a;
      } else o.image.width = d.width, o.image.height = d.height, o.mipmaps = d.mipmaps;
      d.mipmapCount === 1 && (o.minFilter = ge), o.format = d.format, o.needsUpdate = true, e && e(o);
    }, n, i);
    return o;
  }
}
class ar extends He {
  constructor(t) {
    super(t);
  }
  load(t, e, n, i) {
    this.path !== void 0 && (t = this.path + t), t = this.manager.resolveURL(t);
    const r = this, a = Tn.get(t);
    if (a !== void 0) return r.manager.itemStart(t), setTimeout(function() {
      e && e(a), r.manager.itemEnd(t);
    }, 0), a;
    const o = Qs("img");
    function l() {
      h(), Tn.add(t, this), e && e(this), r.manager.itemEnd(t);
    }
    function c(u) {
      h(), i && i(u), r.manager.itemError(t), r.manager.itemEnd(t);
    }
    function h() {
      o.removeEventListener("load", l, false), o.removeEventListener("error", c, false);
    }
    return o.addEventListener("load", l, false), o.addEventListener("error", c, false), t.slice(0, 5) !== "data:" && this.crossOrigin !== void 0 && (o.crossOrigin = this.crossOrigin), r.manager.itemStart(t), o.src = t, o;
  }
}
class iy extends He {
  constructor(t) {
    super(t);
  }
  load(t, e, n, i) {
    const r = new ur();
    r.colorSpace = Ke;
    const a = new ar(this.manager);
    a.setCrossOrigin(this.crossOrigin), a.setPath(this.path);
    let o = 0;
    function l(c) {
      a.load(t[c], function(h) {
        r.images[c] = h, o++, o === 6 && (r.needsUpdate = true, e && e(r));
      }, void 0, i);
    }
    for (let c = 0; c < t.length; ++c) l(c);
    return r;
  }
}
class sy extends He {
  constructor(t) {
    super(t);
  }
  load(t, e, n, i) {
    const r = this, a = new fn(), o = new Dn(this.manager);
    return o.setResponseType("arraybuffer"), o.setRequestHeader(this.requestHeader), o.setPath(this.path), o.setWithCredentials(r.withCredentials), o.load(t, function(l) {
      let c;
      try {
        c = r.parse(l);
      } catch (h) {
        if (i !== void 0) i(h);
        else {
          console.error(h);
          return;
        }
      }
      c.image !== void 0 ? a.image = c.image : c.data !== void 0 && (a.image.width = c.width, a.image.height = c.height, a.image.data = c.data), a.wrapS = c.wrapS !== void 0 ? c.wrapS : Qe, a.wrapT = c.wrapT !== void 0 ? c.wrapT : Qe, a.magFilter = c.magFilter !== void 0 ? c.magFilter : ge, a.minFilter = c.minFilter !== void 0 ? c.minFilter : ge, a.anisotropy = c.anisotropy !== void 0 ? c.anisotropy : 1, c.colorSpace !== void 0 && (a.colorSpace = c.colorSpace), c.flipY !== void 0 && (a.flipY = c.flipY), c.format !== void 0 && (a.format = c.format), c.type !== void 0 && (a.type = c.type), c.mipmaps !== void 0 && (a.mipmaps = c.mipmaps, a.minFilter = un), c.mipmapCount === 1 && (a.minFilter = ge), c.generateMipmaps !== void 0 && (a.generateMipmaps = c.generateMipmaps), a.needsUpdate = true, e && e(a, c);
    }, n, i), a;
  }
}
class ry extends He {
  constructor(t) {
    super(t);
  }
  load(t, e, n, i) {
    const r = new ue(), a = new ar(this.manager);
    return a.setCrossOrigin(this.crossOrigin), a.setPath(this.path), a.load(t, function(o) {
      r.image = o, r.needsUpdate = true, e !== void 0 && e(r);
    }, n, i), r;
  }
}
class Qn extends $t {
  constructor(t, e = 1) {
    super(), this.isLight = true, this.type = "Light", this.color = new ft(t), this.intensity = e;
  }
  dispose() {
  }
  copy(t, e) {
    return super.copy(t, e), this.color.copy(t.color), this.intensity = t.intensity, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.color = this.color.getHex(), e.object.intensity = this.intensity, this.groundColor !== void 0 && (e.object.groundColor = this.groundColor.getHex()), this.distance !== void 0 && (e.object.distance = this.distance), this.angle !== void 0 && (e.object.angle = this.angle), this.decay !== void 0 && (e.object.decay = this.decay), this.penumbra !== void 0 && (e.object.penumbra = this.penumbra), this.shadow !== void 0 && (e.object.shadow = this.shadow.toJSON()), this.target !== void 0 && (e.object.target = this.target.uuid), e;
  }
}
class vf extends Qn {
  constructor(t, e, n) {
    super(t, n), this.isHemisphereLight = true, this.type = "HemisphereLight", this.position.copy($t.DEFAULT_UP), this.updateMatrix(), this.groundColor = new ft(e);
  }
  copy(t, e) {
    return super.copy(t, e), this.groundColor.copy(t.groundColor), this;
  }
}
const Cl = new Pt(), iu = new C(), su = new C();
class Ic {
  constructor(t) {
    this.camera = t, this.intensity = 1, this.bias = 0, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new Z(512, 512), this.map = null, this.mapPass = null, this.matrix = new Pt(), this.autoUpdate = true, this.needsUpdate = false, this._frustum = new dr(), this._frameExtents = new Z(1, 1), this._viewportCount = 1, this._viewports = [new Jt(0, 0, 1, 1)];
  }
  getViewportCount() {
    return this._viewportCount;
  }
  getFrustum() {
    return this._frustum;
  }
  updateMatrices(t) {
    const e = this.camera, n = this.matrix;
    iu.setFromMatrixPosition(t.matrixWorld), e.position.copy(iu), su.setFromMatrixPosition(t.target.matrixWorld), e.lookAt(su), e.updateMatrixWorld(), Cl.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), this._frustum.setFromProjectionMatrix(Cl), n.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1), n.multiply(Cl);
  }
  getViewport(t) {
    return this._viewports[t];
  }
  getFrameExtents() {
    return this._frameExtents;
  }
  dispose() {
    this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
  }
  copy(t) {
    return this.camera = t.camera.clone(), this.intensity = t.intensity, this.bias = t.bias, this.radius = t.radius, this.mapSize.copy(t.mapSize), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  toJSON() {
    const t = {};
    return this.intensity !== 1 && (t.intensity = this.intensity), this.bias !== 0 && (t.bias = this.bias), this.normalBias !== 0 && (t.normalBias = this.normalBias), this.radius !== 1 && (t.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (t.mapSize = this.mapSize.toArray()), t.camera = this.camera.toJSON(false).object, delete t.camera.matrix, t;
  }
}
class ay extends Ic {
  constructor() {
    super(new be(50, 1, 0.5, 500)), this.isSpotLightShadow = true, this.focus = 1;
  }
  updateMatrices(t) {
    const e = this.camera, n = rs * 2 * t.angle * this.focus, i = this.mapSize.width / this.mapSize.height, r = t.distance || e.far;
    (n !== e.fov || i !== e.aspect || r !== e.far) && (e.fov = n, e.aspect = i, e.far = r, e.updateProjectionMatrix()), super.updateMatrices(t);
  }
  copy(t) {
    return super.copy(t), this.focus = t.focus, this;
  }
}
class yf extends Qn {
  constructor(t, e, n = 0, i = Math.PI / 3, r = 0, a = 2) {
    super(t, e), this.isSpotLight = true, this.type = "SpotLight", this.position.copy($t.DEFAULT_UP), this.updateMatrix(), this.target = new $t(), this.distance = n, this.angle = i, this.penumbra = r, this.decay = a, this.map = null, this.shadow = new ay();
  }
  get power() {
    return this.intensity * Math.PI;
  }
  set power(t) {
    this.intensity = t / Math.PI;
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(t, e) {
    return super.copy(t, e), this.distance = t.distance, this.angle = t.angle, this.penumbra = t.penumbra, this.decay = t.decay, this.target = t.target.clone(), this.shadow = t.shadow.clone(), this;
  }
}
const ru = new Pt(), As = new C(), Rl = new C();
class oy extends Ic {
  constructor() {
    super(new be(90, 1, 0.5, 500)), this.isPointLightShadow = true, this._frameExtents = new Z(4, 2), this._viewportCount = 6, this._viewports = [new Jt(2, 1, 1, 1), new Jt(0, 1, 1, 1), new Jt(3, 1, 1, 1), new Jt(1, 1, 1, 1), new Jt(3, 0, 1, 1), new Jt(1, 0, 1, 1)], this._cubeDirections = [new C(1, 0, 0), new C(-1, 0, 0), new C(0, 0, 1), new C(0, 0, -1), new C(0, 1, 0), new C(0, -1, 0)], this._cubeUps = [new C(0, 1, 0), new C(0, 1, 0), new C(0, 1, 0), new C(0, 1, 0), new C(0, 0, 1), new C(0, 0, -1)];
  }
  updateMatrices(t, e = 0) {
    const n = this.camera, i = this.matrix, r = t.distance || n.far;
    r !== n.far && (n.far = r, n.updateProjectionMatrix()), As.setFromMatrixPosition(t.matrixWorld), n.position.copy(As), Rl.copy(n.position), Rl.add(this._cubeDirections[e]), n.up.copy(this._cubeUps[e]), n.lookAt(Rl), n.updateMatrixWorld(), i.makeTranslation(-As.x, -As.y, -As.z), ru.multiplyMatrices(n.projectionMatrix, n.matrixWorldInverse), this._frustum.setFromProjectionMatrix(ru);
  }
}
class Mf extends Qn {
  constructor(t, e, n = 0, i = 2) {
    super(t, e), this.isPointLight = true, this.type = "PointLight", this.distance = n, this.decay = i, this.shadow = new oy();
  }
  get power() {
    return this.intensity * 4 * Math.PI;
  }
  set power(t) {
    this.intensity = t / (4 * Math.PI);
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(t, e) {
    return super.copy(t, e), this.distance = t.distance, this.decay = t.decay, this.shadow = t.shadow.clone(), this;
  }
}
class ly extends Ic {
  constructor() {
    super(new _o(-5, 5, 5, -5, 0.5, 500)), this.isDirectionalLightShadow = true;
  }
}
class Sf extends Qn {
  constructor(t, e) {
    super(t, e), this.isDirectionalLight = true, this.type = "DirectionalLight", this.position.copy($t.DEFAULT_UP), this.updateMatrix(), this.target = new $t(), this.shadow = new ly();
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(t) {
    return super.copy(t), this.target = t.target.clone(), this.shadow = t.shadow.clone(), this;
  }
}
class bf extends Qn {
  constructor(t, e) {
    super(t, e), this.isAmbientLight = true, this.type = "AmbientLight";
  }
}
class wf extends Qn {
  constructor(t, e, n = 10, i = 10) {
    super(t, e), this.isRectAreaLight = true, this.type = "RectAreaLight", this.width = n, this.height = i;
  }
  get power() {
    return this.intensity * this.width * this.height * Math.PI;
  }
  set power(t) {
    this.intensity = t / (this.width * this.height * Math.PI);
  }
  copy(t) {
    return super.copy(t), this.width = t.width, this.height = t.height, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.width = this.width, e.object.height = this.height, e;
  }
}
class Ef {
  constructor() {
    this.isSphericalHarmonics3 = true, this.coefficients = [];
    for (let t = 0; t < 9; t++) this.coefficients.push(new C());
  }
  set(t) {
    for (let e = 0; e < 9; e++) this.coefficients[e].copy(t[e]);
    return this;
  }
  zero() {
    for (let t = 0; t < 9; t++) this.coefficients[t].set(0, 0, 0);
    return this;
  }
  getAt(t, e) {
    const n = t.x, i = t.y, r = t.z, a = this.coefficients;
    return e.copy(a[0]).multiplyScalar(0.282095), e.addScaledVector(a[1], 0.488603 * i), e.addScaledVector(a[2], 0.488603 * r), e.addScaledVector(a[3], 0.488603 * n), e.addScaledVector(a[4], 1.092548 * (n * i)), e.addScaledVector(a[5], 1.092548 * (i * r)), e.addScaledVector(a[6], 0.315392 * (3 * r * r - 1)), e.addScaledVector(a[7], 1.092548 * (n * r)), e.addScaledVector(a[8], 0.546274 * (n * n - i * i)), e;
  }
  getIrradianceAt(t, e) {
    const n = t.x, i = t.y, r = t.z, a = this.coefficients;
    return e.copy(a[0]).multiplyScalar(0.886227), e.addScaledVector(a[1], 2 * 0.511664 * i), e.addScaledVector(a[2], 2 * 0.511664 * r), e.addScaledVector(a[3], 2 * 0.511664 * n), e.addScaledVector(a[4], 2 * 0.429043 * n * i), e.addScaledVector(a[5], 2 * 0.429043 * i * r), e.addScaledVector(a[6], 0.743125 * r * r - 0.247708), e.addScaledVector(a[7], 2 * 0.429043 * n * r), e.addScaledVector(a[8], 0.429043 * (n * n - i * i)), e;
  }
  add(t) {
    for (let e = 0; e < 9; e++) this.coefficients[e].add(t.coefficients[e]);
    return this;
  }
  addScaledSH(t, e) {
    for (let n = 0; n < 9; n++) this.coefficients[n].addScaledVector(t.coefficients[n], e);
    return this;
  }
  scale(t) {
    for (let e = 0; e < 9; e++) this.coefficients[e].multiplyScalar(t);
    return this;
  }
  lerp(t, e) {
    for (let n = 0; n < 9; n++) this.coefficients[n].lerp(t.coefficients[n], e);
    return this;
  }
  equals(t) {
    for (let e = 0; e < 9; e++) if (!this.coefficients[e].equals(t.coefficients[e])) return false;
    return true;
  }
  copy(t) {
    return this.set(t.coefficients);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  fromArray(t, e = 0) {
    const n = this.coefficients;
    for (let i = 0; i < 9; i++) n[i].fromArray(t, e + i * 3);
    return this;
  }
  toArray(t = [], e = 0) {
    const n = this.coefficients;
    for (let i = 0; i < 9; i++) n[i].toArray(t, e + i * 3);
    return t;
  }
  static getBasisAt(t, e) {
    const n = t.x, i = t.y, r = t.z;
    e[0] = 0.282095, e[1] = 0.488603 * i, e[2] = 0.488603 * r, e[3] = 0.488603 * n, e[4] = 1.092548 * n * i, e[5] = 1.092548 * i * r, e[6] = 0.315392 * (3 * r * r - 1), e[7] = 1.092548 * n * r, e[8] = 0.546274 * (n * n - i * i);
  }
}
class Af extends Qn {
  constructor(t = new Ef(), e = 1) {
    super(void 0, e), this.isLightProbe = true, this.sh = t;
  }
  copy(t) {
    return super.copy(t), this.sh.copy(t.sh), this;
  }
  fromJSON(t) {
    return this.intensity = t.intensity, this.sh.fromArray(t.sh), this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.sh = this.sh.toArray(), e;
  }
}
class Bo extends He {
  constructor(t) {
    super(t), this.textures = {};
  }
  load(t, e, n, i) {
    const r = this, a = new Dn(r.manager);
    a.setPath(r.path), a.setRequestHeader(r.requestHeader), a.setWithCredentials(r.withCredentials), a.load(t, function(o) {
      try {
        e(r.parse(JSON.parse(o)));
      } catch (l) {
        i ? i(l) : console.error(l), r.manager.itemError(t);
      }
    }, n, i);
  }
  parse(t) {
    const e = this.textures;
    function n(r) {
      return e[r] === void 0 && console.warn("THREE.MaterialLoader: Undefined texture", r), e[r];
    }
    const i = this.createMaterialFromType(t.type);
    if (t.uuid !== void 0 && (i.uuid = t.uuid), t.name !== void 0 && (i.name = t.name), t.color !== void 0 && i.color !== void 0 && i.color.setHex(t.color), t.roughness !== void 0 && (i.roughness = t.roughness), t.metalness !== void 0 && (i.metalness = t.metalness), t.sheen !== void 0 && (i.sheen = t.sheen), t.sheenColor !== void 0 && (i.sheenColor = new ft().setHex(t.sheenColor)), t.sheenRoughness !== void 0 && (i.sheenRoughness = t.sheenRoughness), t.emissive !== void 0 && i.emissive !== void 0 && i.emissive.setHex(t.emissive), t.specular !== void 0 && i.specular !== void 0 && i.specular.setHex(t.specular), t.specularIntensity !== void 0 && (i.specularIntensity = t.specularIntensity), t.specularColor !== void 0 && i.specularColor !== void 0 && i.specularColor.setHex(t.specularColor), t.shininess !== void 0 && (i.shininess = t.shininess), t.clearcoat !== void 0 && (i.clearcoat = t.clearcoat), t.clearcoatRoughness !== void 0 && (i.clearcoatRoughness = t.clearcoatRoughness), t.dispersion !== void 0 && (i.dispersion = t.dispersion), t.iridescence !== void 0 && (i.iridescence = t.iridescence), t.iridescenceIOR !== void 0 && (i.iridescenceIOR = t.iridescenceIOR), t.iridescenceThicknessRange !== void 0 && (i.iridescenceThicknessRange = t.iridescenceThicknessRange), t.transmission !== void 0 && (i.transmission = t.transmission), t.thickness !== void 0 && (i.thickness = t.thickness), t.attenuationDistance !== void 0 && (i.attenuationDistance = t.attenuationDistance), t.attenuationColor !== void 0 && i.attenuationColor !== void 0 && i.attenuationColor.setHex(t.attenuationColor), t.anisotropy !== void 0 && (i.anisotropy = t.anisotropy), t.anisotropyRotation !== void 0 && (i.anisotropyRotation = t.anisotropyRotation), t.fog !== void 0 && (i.fog = t.fog), t.flatShading !== void 0 && (i.flatShading = t.flatShading), t.blending !== void 0 && (i.blending = t.blending), t.combine !== void 0 && (i.combine = t.combine), t.side !== void 0 && (i.side = t.side), t.shadowSide !== void 0 && (i.shadowSide = t.shadowSide), t.opacity !== void 0 && (i.opacity = t.opacity), t.transparent !== void 0 && (i.transparent = t.transparent), t.alphaTest !== void 0 && (i.alphaTest = t.alphaTest), t.alphaHash !== void 0 && (i.alphaHash = t.alphaHash), t.depthFunc !== void 0 && (i.depthFunc = t.depthFunc), t.depthTest !== void 0 && (i.depthTest = t.depthTest), t.depthWrite !== void 0 && (i.depthWrite = t.depthWrite), t.colorWrite !== void 0 && (i.colorWrite = t.colorWrite), t.blendSrc !== void 0 && (i.blendSrc = t.blendSrc), t.blendDst !== void 0 && (i.blendDst = t.blendDst), t.blendEquation !== void 0 && (i.blendEquation = t.blendEquation), t.blendSrcAlpha !== void 0 && (i.blendSrcAlpha = t.blendSrcAlpha), t.blendDstAlpha !== void 0 && (i.blendDstAlpha = t.blendDstAlpha), t.blendEquationAlpha !== void 0 && (i.blendEquationAlpha = t.blendEquationAlpha), t.blendColor !== void 0 && i.blendColor !== void 0 && i.blendColor.setHex(t.blendColor), t.blendAlpha !== void 0 && (i.blendAlpha = t.blendAlpha), t.stencilWriteMask !== void 0 && (i.stencilWriteMask = t.stencilWriteMask), t.stencilFunc !== void 0 && (i.stencilFunc = t.stencilFunc), t.stencilRef !== void 0 && (i.stencilRef = t.stencilRef), t.stencilFuncMask !== void 0 && (i.stencilFuncMask = t.stencilFuncMask), t.stencilFail !== void 0 && (i.stencilFail = t.stencilFail), t.stencilZFail !== void 0 && (i.stencilZFail = t.stencilZFail), t.stencilZPass !== void 0 && (i.stencilZPass = t.stencilZPass), t.stencilWrite !== void 0 && (i.stencilWrite = t.stencilWrite), t.wireframe !== void 0 && (i.wireframe = t.wireframe), t.wireframeLinewidth !== void 0 && (i.wireframeLinewidth = t.wireframeLinewidth), t.wireframeLinecap !== void 0 && (i.wireframeLinecap = t.wireframeLinecap), t.wireframeLinejoin !== void 0 && (i.wireframeLinejoin = t.wireframeLinejoin), t.rotation !== void 0 && (i.rotation = t.rotation), t.linewidth !== void 0 && (i.linewidth = t.linewidth), t.dashSize !== void 0 && (i.dashSize = t.dashSize), t.gapSize !== void 0 && (i.gapSize = t.gapSize), t.scale !== void 0 && (i.scale = t.scale), t.polygonOffset !== void 0 && (i.polygonOffset = t.polygonOffset), t.polygonOffsetFactor !== void 0 && (i.polygonOffsetFactor = t.polygonOffsetFactor), t.polygonOffsetUnits !== void 0 && (i.polygonOffsetUnits = t.polygonOffsetUnits), t.dithering !== void 0 && (i.dithering = t.dithering), t.alphaToCoverage !== void 0 && (i.alphaToCoverage = t.alphaToCoverage), t.premultipliedAlpha !== void 0 && (i.premultipliedAlpha = t.premultipliedAlpha), t.forceSinglePass !== void 0 && (i.forceSinglePass = t.forceSinglePass), t.visible !== void 0 && (i.visible = t.visible), t.toneMapped !== void 0 && (i.toneMapped = t.toneMapped), t.userData !== void 0 && (i.userData = t.userData), t.vertexColors !== void 0 && (typeof t.vertexColors == "number" ? i.vertexColors = t.vertexColors > 0 : i.vertexColors = t.vertexColors), t.uniforms !== void 0) for (const r in t.uniforms) {
      const a = t.uniforms[r];
      switch (i.uniforms[r] = {}, a.type) {
        case "t":
          i.uniforms[r].value = n(a.value);
          break;
        case "c":
          i.uniforms[r].value = new ft().setHex(a.value);
          break;
        case "v2":
          i.uniforms[r].value = new Z().fromArray(a.value);
          break;
        case "v3":
          i.uniforms[r].value = new C().fromArray(a.value);
          break;
        case "v4":
          i.uniforms[r].value = new Jt().fromArray(a.value);
          break;
        case "m3":
          i.uniforms[r].value = new zt().fromArray(a.value);
          break;
        case "m4":
          i.uniforms[r].value = new Pt().fromArray(a.value);
          break;
        default:
          i.uniforms[r].value = a.value;
      }
    }
    if (t.defines !== void 0 && (i.defines = t.defines), t.vertexShader !== void 0 && (i.vertexShader = t.vertexShader), t.fragmentShader !== void 0 && (i.fragmentShader = t.fragmentShader), t.glslVersion !== void 0 && (i.glslVersion = t.glslVersion), t.extensions !== void 0) for (const r in t.extensions) i.extensions[r] = t.extensions[r];
    if (t.lights !== void 0 && (i.lights = t.lights), t.clipping !== void 0 && (i.clipping = t.clipping), t.size !== void 0 && (i.size = t.size), t.sizeAttenuation !== void 0 && (i.sizeAttenuation = t.sizeAttenuation), t.map !== void 0 && (i.map = n(t.map)), t.matcap !== void 0 && (i.matcap = n(t.matcap)), t.alphaMap !== void 0 && (i.alphaMap = n(t.alphaMap)), t.bumpMap !== void 0 && (i.bumpMap = n(t.bumpMap)), t.bumpScale !== void 0 && (i.bumpScale = t.bumpScale), t.normalMap !== void 0 && (i.normalMap = n(t.normalMap)), t.normalMapType !== void 0 && (i.normalMapType = t.normalMapType), t.normalScale !== void 0) {
      let r = t.normalScale;
      Array.isArray(r) === false && (r = [r, r]), i.normalScale = new Z().fromArray(r);
    }
    return t.displacementMap !== void 0 && (i.displacementMap = n(t.displacementMap)), t.displacementScale !== void 0 && (i.displacementScale = t.displacementScale), t.displacementBias !== void 0 && (i.displacementBias = t.displacementBias), t.roughnessMap !== void 0 && (i.roughnessMap = n(t.roughnessMap)), t.metalnessMap !== void 0 && (i.metalnessMap = n(t.metalnessMap)), t.emissiveMap !== void 0 && (i.emissiveMap = n(t.emissiveMap)), t.emissiveIntensity !== void 0 && (i.emissiveIntensity = t.emissiveIntensity), t.specularMap !== void 0 && (i.specularMap = n(t.specularMap)), t.specularIntensityMap !== void 0 && (i.specularIntensityMap = n(t.specularIntensityMap)), t.specularColorMap !== void 0 && (i.specularColorMap = n(t.specularColorMap)), t.envMap !== void 0 && (i.envMap = n(t.envMap)), t.envMapRotation !== void 0 && i.envMapRotation.fromArray(t.envMapRotation), t.envMapIntensity !== void 0 && (i.envMapIntensity = t.envMapIntensity), t.reflectivity !== void 0 && (i.reflectivity = t.reflectivity), t.refractionRatio !== void 0 && (i.refractionRatio = t.refractionRatio), t.lightMap !== void 0 && (i.lightMap = n(t.lightMap)), t.lightMapIntensity !== void 0 && (i.lightMapIntensity = t.lightMapIntensity), t.aoMap !== void 0 && (i.aoMap = n(t.aoMap)), t.aoMapIntensity !== void 0 && (i.aoMapIntensity = t.aoMapIntensity), t.gradientMap !== void 0 && (i.gradientMap = n(t.gradientMap)), t.clearcoatMap !== void 0 && (i.clearcoatMap = n(t.clearcoatMap)), t.clearcoatRoughnessMap !== void 0 && (i.clearcoatRoughnessMap = n(t.clearcoatRoughnessMap)), t.clearcoatNormalMap !== void 0 && (i.clearcoatNormalMap = n(t.clearcoatNormalMap)), t.clearcoatNormalScale !== void 0 && (i.clearcoatNormalScale = new Z().fromArray(t.clearcoatNormalScale)), t.iridescenceMap !== void 0 && (i.iridescenceMap = n(t.iridescenceMap)), t.iridescenceThicknessMap !== void 0 && (i.iridescenceThicknessMap = n(t.iridescenceThicknessMap)), t.transmissionMap !== void 0 && (i.transmissionMap = n(t.transmissionMap)), t.thicknessMap !== void 0 && (i.thicknessMap = n(t.thicknessMap)), t.anisotropyMap !== void 0 && (i.anisotropyMap = n(t.anisotropyMap)), t.sheenColorMap !== void 0 && (i.sheenColorMap = n(t.sheenColorMap)), t.sheenRoughnessMap !== void 0 && (i.sheenRoughnessMap = n(t.sheenRoughnessMap)), i;
  }
  setTextures(t) {
    return this.textures = t, this;
  }
  createMaterialFromType(t) {
    return Bo.createMaterialFromType(t);
  }
  static createMaterialFromType(t) {
    const e = { ShadowMaterial: sf, SpriteMaterial: _c, RawShaderMaterial: rf, ShaderMaterial: an, PointsMaterial: vc, MeshPhysicalMaterial: af, MeshStandardMaterial: Ac, MeshPhongMaterial: of, MeshToonMaterial: lf, MeshNormalMaterial: cf, MeshLambertMaterial: hf, MeshDepthMaterial: mc, MeshDistanceMaterial: gc, MeshBasicMaterial: $n, MeshMatcapMaterial: uf, LineDashedMaterial: df, LineBasicMaterial: Ne, Material: Ce };
    return new e[t]();
  }
}
class Yl {
  static decodeText(t) {
    if (console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."), typeof TextDecoder < "u") return new TextDecoder().decode(t);
    let e = "";
    for (let n = 0, i = t.length; n < i; n++) e += String.fromCharCode(t[n]);
    try {
      return decodeURIComponent(escape(e));
    } catch {
      return e;
    }
  }
  static extractUrlBase(t) {
    const e = t.lastIndexOf("/");
    return e === -1 ? "./" : t.slice(0, e + 1);
  }
  static resolveURL(t, e) {
    return typeof t != "string" || t === "" ? "" : (/^https?:\/\//i.test(e) && /^\//.test(t) && (e = e.replace(/(^https?:\/\/[^\/]+).*/i, "$1")), /^(https?:)?\/\//i.test(t) || /^data:.*,.*$/i.test(t) || /^blob:.*$/i.test(t) ? t : e + t);
  }
}
class Tf extends Ht {
  constructor() {
    super(), this.isInstancedBufferGeometry = true, this.type = "InstancedBufferGeometry", this.instanceCount = 1 / 0;
  }
  copy(t) {
    return super.copy(t), this.instanceCount = t.instanceCount, this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.instanceCount = this.instanceCount, t.isInstancedBufferGeometry = true, t;
  }
}
class Cf extends He {
  constructor(t) {
    super(t);
  }
  load(t, e, n, i) {
    const r = this, a = new Dn(r.manager);
    a.setPath(r.path), a.setRequestHeader(r.requestHeader), a.setWithCredentials(r.withCredentials), a.load(t, function(o) {
      try {
        e(r.parse(JSON.parse(o)));
      } catch (l) {
        i ? i(l) : console.error(l), r.manager.itemError(t);
      }
    }, n, i);
  }
  parse(t) {
    const e = {}, n = {};
    function i(f, m) {
      if (e[m] !== void 0) return e[m];
      const g = f.interleavedBuffers[m], p = r(f, g.buffer), y = Qi(g.type, p), x = new Mo(y, g.stride);
      return x.uuid = g.uuid, e[m] = x, x;
    }
    function r(f, m) {
      if (n[m] !== void 0) return n[m];
      const g = f.arrayBuffers[m], p = new Uint32Array(g).buffer;
      return n[m] = p, p;
    }
    const a = t.isInstancedBufferGeometry ? new Tf() : new Ht(), o = t.data.index;
    if (o !== void 0) {
      const f = Qi(o.type, o.array);
      a.setIndex(new ie(f, 1));
    }
    const l = t.data.attributes;
    for (const f in l) {
      const m = l[f];
      let _;
      if (m.isInterleavedBufferAttribute) {
        const g = i(t.data, m.data);
        _ = new Ti(g, m.itemSize, m.offset, m.normalized);
      } else {
        const g = Qi(m.type, m.array), p = m.isInstancedBufferAttribute ? os : ie;
        _ = new p(g, m.itemSize, m.normalized);
      }
      m.name !== void 0 && (_.name = m.name), m.usage !== void 0 && _.setUsage(m.usage), a.setAttribute(f, _);
    }
    const c = t.data.morphAttributes;
    if (c) for (const f in c) {
      const m = c[f], _ = [];
      for (let g = 0, p = m.length; g < p; g++) {
        const y = m[g];
        let x;
        if (y.isInterleavedBufferAttribute) {
          const M = i(t.data, y.data);
          x = new Ti(M, y.itemSize, y.offset, y.normalized);
        } else {
          const M = Qi(y.type, y.array);
          x = new ie(M, y.itemSize, y.normalized);
        }
        y.name !== void 0 && (x.name = y.name), _.push(x);
      }
      a.morphAttributes[f] = _;
    }
    t.data.morphTargetsRelative && (a.morphTargetsRelative = true);
    const u = t.data.groups || t.data.drawcalls || t.data.offsets;
    if (u !== void 0) for (let f = 0, m = u.length; f !== m; ++f) {
      const _ = u[f];
      a.addGroup(_.start, _.count, _.materialIndex);
    }
    const d = t.data.boundingSphere;
    if (d !== void 0) {
      const f = new C();
      d.center !== void 0 && f.fromArray(d.center), a.boundingSphere = new Te(f, d.radius);
    }
    return t.name && (a.name = t.name), t.userData && (a.userData = t.userData), a;
  }
}
class cy extends He {
  constructor(t) {
    super(t);
  }
  load(t, e, n, i) {
    const r = this, a = this.path === "" ? Yl.extractUrlBase(t) : this.path;
    this.resourcePath = this.resourcePath || a;
    const o = new Dn(this.manager);
    o.setPath(this.path), o.setRequestHeader(this.requestHeader), o.setWithCredentials(this.withCredentials), o.load(t, function(l) {
      let c = null;
      try {
        c = JSON.parse(l);
      } catch (u) {
        i !== void 0 && i(u), console.error("THREE:ObjectLoader: Can't parse " + t + ".", u.message);
        return;
      }
      const h = c.metadata;
      if (h === void 0 || h.type === void 0 || h.type.toLowerCase() === "geometry") {
        i !== void 0 && i(new Error("THREE.ObjectLoader: Can't load " + t)), console.error("THREE.ObjectLoader: Can't load " + t);
        return;
      }
      r.parse(c, e);
    }, n, i);
  }
  async loadAsync(t, e) {
    const n = this, i = this.path === "" ? Yl.extractUrlBase(t) : this.path;
    this.resourcePath = this.resourcePath || i;
    const r = new Dn(this.manager);
    r.setPath(this.path), r.setRequestHeader(this.requestHeader), r.setWithCredentials(this.withCredentials);
    const a = await r.loadAsync(t, e), o = JSON.parse(a), l = o.metadata;
    if (l === void 0 || l.type === void 0 || l.type.toLowerCase() === "geometry") throw new Error("THREE.ObjectLoader: Can't load " + t);
    return await n.parseAsync(o);
  }
  parse(t, e) {
    const n = this.parseAnimations(t.animations), i = this.parseShapes(t.shapes), r = this.parseGeometries(t.geometries, i), a = this.parseImages(t.images, function() {
      e !== void 0 && e(c);
    }), o = this.parseTextures(t.textures, a), l = this.parseMaterials(t.materials, o), c = this.parseObject(t.object, r, l, o, n), h = this.parseSkeletons(t.skeletons, c);
    if (this.bindSkeletons(c, h), this.bindLightTargets(c), e !== void 0) {
      let u = false;
      for (const d in a) if (a[d].data instanceof HTMLImageElement) {
        u = true;
        break;
      }
      u === false && e(c);
    }
    return c;
  }
  async parseAsync(t) {
    const e = this.parseAnimations(t.animations), n = this.parseShapes(t.shapes), i = this.parseGeometries(t.geometries, n), r = await this.parseImagesAsync(t.images), a = this.parseTextures(t.textures, r), o = this.parseMaterials(t.materials, a), l = this.parseObject(t.object, i, o, a, e), c = this.parseSkeletons(t.skeletons, l);
    return this.bindSkeletons(l, c), this.bindLightTargets(l), l;
  }
  parseShapes(t) {
    const e = {};
    if (t !== void 0) for (let n = 0, i = t.length; n < i; n++) {
      const r = new bi().fromJSON(t[n]);
      e[r.uuid] = r;
    }
    return e;
  }
  parseSkeletons(t, e) {
    const n = {}, i = {};
    if (e.traverse(function(r) {
      r.isBone && (i[r.uuid] = r);
    }), t !== void 0) for (let r = 0, a = t.length; r < a; r++) {
      const o = new So().fromJSON(t[r], i);
      n[o.uuid] = o;
    }
    return n;
  }
  parseGeometries(t, e) {
    const n = {};
    if (t !== void 0) {
      const i = new Cf();
      for (let r = 0, a = t.length; r < a; r++) {
        let o;
        const l = t[r];
        switch (l.type) {
          case "BufferGeometry":
          case "InstancedBufferGeometry":
            o = i.parse(l);
            break;
          default:
            l.type in nu ? o = nu[l.type].fromJSON(l, e) : console.warn(`THREE.ObjectLoader: Unsupported geometry type "${l.type}"`);
        }
        o.uuid = l.uuid, l.name !== void 0 && (o.name = l.name), l.userData !== void 0 && (o.userData = l.userData), n[l.uuid] = o;
      }
    }
    return n;
  }
  parseMaterials(t, e) {
    const n = {}, i = {};
    if (t !== void 0) {
      const r = new Bo();
      r.setTextures(e);
      for (let a = 0, o = t.length; a < o; a++) {
        const l = t[a];
        n[l.uuid] === void 0 && (n[l.uuid] = r.parse(l)), i[l.uuid] = n[l.uuid];
      }
    }
    return i;
  }
  parseAnimations(t) {
    const e = {};
    if (t !== void 0) for (let n = 0; n < t.length; n++) {
      const i = t[n], r = rr.parse(i);
      e[r.uuid] = r;
    }
    return e;
  }
  parseImages(t, e) {
    const n = this, i = {};
    let r;
    function a(l) {
      return n.manager.itemStart(l), r.load(l, function() {
        n.manager.itemEnd(l);
      }, void 0, function() {
        n.manager.itemError(l), n.manager.itemEnd(l);
      });
    }
    function o(l) {
      if (typeof l == "string") {
        const c = l, h = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(c) ? c : n.resourcePath + c;
        return a(h);
      } else return l.data ? { data: Qi(l.type, l.data), width: l.width, height: l.height } : null;
    }
    if (t !== void 0 && t.length > 0) {
      const l = new Pc(e);
      r = new ar(l), r.setCrossOrigin(this.crossOrigin);
      for (let c = 0, h = t.length; c < h; c++) {
        const u = t[c], d = u.url;
        if (Array.isArray(d)) {
          const f = [];
          for (let m = 0, _ = d.length; m < _; m++) {
            const g = d[m], p = o(g);
            p !== null && (p instanceof HTMLImageElement ? f.push(p) : f.push(new fn(p.data, p.width, p.height)));
          }
          i[u.uuid] = new _i(f);
        } else {
          const f = o(u.url);
          i[u.uuid] = new _i(f);
        }
      }
    }
    return i;
  }
  async parseImagesAsync(t) {
    const e = this, n = {};
    let i;
    async function r(a) {
      if (typeof a == "string") {
        const o = a, l = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(o) ? o : e.resourcePath + o;
        return await i.loadAsync(l);
      } else return a.data ? { data: Qi(a.type, a.data), width: a.width, height: a.height } : null;
    }
    if (t !== void 0 && t.length > 0) {
      i = new ar(this.manager), i.setCrossOrigin(this.crossOrigin);
      for (let a = 0, o = t.length; a < o; a++) {
        const l = t[a], c = l.url;
        if (Array.isArray(c)) {
          const h = [];
          for (let u = 0, d = c.length; u < d; u++) {
            const f = c[u], m = await r(f);
            m !== null && (m instanceof HTMLImageElement ? h.push(m) : h.push(new fn(m.data, m.width, m.height)));
          }
          n[l.uuid] = new _i(h);
        } else {
          const h = await r(l.url);
          n[l.uuid] = new _i(h);
        }
      }
    }
    return n;
  }
  parseTextures(t, e) {
    function n(r, a) {
      return typeof r == "number" ? r : (console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.", r), a[r]);
    }
    const i = {};
    if (t !== void 0) for (let r = 0, a = t.length; r < a; r++) {
      const o = t[r];
      o.image === void 0 && console.warn('THREE.ObjectLoader: No "image" specified for', o.uuid), e[o.image] === void 0 && console.warn("THREE.ObjectLoader: Undefined image", o.image);
      const l = e[o.image], c = l.data;
      let h;
      Array.isArray(c) ? (h = new ur(), c.length === 6 && (h.needsUpdate = true)) : (c && c.data ? h = new fn() : h = new ue(), c && (h.needsUpdate = true)), h.source = l, h.uuid = o.uuid, o.name !== void 0 && (h.name = o.name), o.mapping !== void 0 && (h.mapping = n(o.mapping, hy)), o.channel !== void 0 && (h.channel = o.channel), o.offset !== void 0 && h.offset.fromArray(o.offset), o.repeat !== void 0 && h.repeat.fromArray(o.repeat), o.center !== void 0 && h.center.fromArray(o.center), o.rotation !== void 0 && (h.rotation = o.rotation), o.wrap !== void 0 && (h.wrapS = n(o.wrap[0], au), h.wrapT = n(o.wrap[1], au)), o.format !== void 0 && (h.format = o.format), o.internalFormat !== void 0 && (h.internalFormat = o.internalFormat), o.type !== void 0 && (h.type = o.type), o.colorSpace !== void 0 && (h.colorSpace = o.colorSpace), o.minFilter !== void 0 && (h.minFilter = n(o.minFilter, ou)), o.magFilter !== void 0 && (h.magFilter = n(o.magFilter, ou)), o.anisotropy !== void 0 && (h.anisotropy = o.anisotropy), o.flipY !== void 0 && (h.flipY = o.flipY), o.generateMipmaps !== void 0 && (h.generateMipmaps = o.generateMipmaps), o.premultiplyAlpha !== void 0 && (h.premultiplyAlpha = o.premultiplyAlpha), o.unpackAlignment !== void 0 && (h.unpackAlignment = o.unpackAlignment), o.compareFunction !== void 0 && (h.compareFunction = o.compareFunction), o.userData !== void 0 && (h.userData = o.userData), i[o.uuid] = h;
    }
    return i;
  }
  parseObject(t, e, n, i, r) {
    let a;
    function o(d) {
      return e[d] === void 0 && console.warn("THREE.ObjectLoader: Undefined geometry", d), e[d];
    }
    function l(d) {
      if (d !== void 0) {
        if (Array.isArray(d)) {
          const f = [];
          for (let m = 0, _ = d.length; m < _; m++) {
            const g = d[m];
            n[g] === void 0 && console.warn("THREE.ObjectLoader: Undefined material", g), f.push(n[g]);
          }
          return f;
        }
        return n[d] === void 0 && console.warn("THREE.ObjectLoader: Undefined material", d), n[d];
      }
    }
    function c(d) {
      return i[d] === void 0 && console.warn("THREE.ObjectLoader: Undefined texture", d), i[d];
    }
    let h, u;
    switch (t.type) {
      case "Scene":
        a = new Bd(), t.background !== void 0 && (Number.isInteger(t.background) ? a.background = new ft(t.background) : a.background = c(t.background)), t.environment !== void 0 && (a.environment = c(t.environment)), t.fog !== void 0 && (t.fog.type === "Fog" ? a.fog = new yo(t.fog.color, t.fog.near, t.fog.far) : t.fog.type === "FogExp2" && (a.fog = new vo(t.fog.color, t.fog.density)), t.fog.name !== "" && (a.fog.name = t.fog.name)), t.backgroundBlurriness !== void 0 && (a.backgroundBlurriness = t.backgroundBlurriness), t.backgroundIntensity !== void 0 && (a.backgroundIntensity = t.backgroundIntensity), t.backgroundRotation !== void 0 && a.backgroundRotation.fromArray(t.backgroundRotation), t.environmentIntensity !== void 0 && (a.environmentIntensity = t.environmentIntensity), t.environmentRotation !== void 0 && a.environmentRotation.fromArray(t.environmentRotation);
        break;
      case "PerspectiveCamera":
        a = new be(t.fov, t.aspect, t.near, t.far), t.focus !== void 0 && (a.focus = t.focus), t.zoom !== void 0 && (a.zoom = t.zoom), t.filmGauge !== void 0 && (a.filmGauge = t.filmGauge), t.filmOffset !== void 0 && (a.filmOffset = t.filmOffset), t.view !== void 0 && (a.view = Object.assign({}, t.view));
        break;
      case "OrthographicCamera":
        a = new _o(t.left, t.right, t.top, t.bottom, t.near, t.far), t.zoom !== void 0 && (a.zoom = t.zoom), t.view !== void 0 && (a.view = Object.assign({}, t.view));
        break;
      case "AmbientLight":
        a = new bf(t.color, t.intensity);
        break;
      case "DirectionalLight":
        a = new Sf(t.color, t.intensity), a.target = t.target || "";
        break;
      case "PointLight":
        a = new Mf(t.color, t.intensity, t.distance, t.decay);
        break;
      case "RectAreaLight":
        a = new wf(t.color, t.intensity, t.width, t.height);
        break;
      case "SpotLight":
        a = new yf(t.color, t.intensity, t.distance, t.angle, t.penumbra, t.decay), a.target = t.target || "";
        break;
      case "HemisphereLight":
        a = new vf(t.color, t.groundColor, t.intensity);
        break;
      case "LightProbe":
        a = new Af().fromJSON(t);
        break;
      case "SkinnedMesh":
        h = o(t.geometry), u = l(t.material), a = new Hd(h, u), t.bindMode !== void 0 && (a.bindMode = t.bindMode), t.bindMatrix !== void 0 && a.bindMatrix.fromArray(t.bindMatrix), t.skeleton !== void 0 && (a.skeleton = t.skeleton);
        break;
      case "Mesh":
        h = o(t.geometry), u = l(t.material), a = new _e(h, u);
        break;
      case "InstancedMesh":
        h = o(t.geometry), u = l(t.material);
        const d = t.count, f = t.instanceMatrix, m = t.instanceColor;
        a = new Gd(h, u, d), a.instanceMatrix = new os(new Float32Array(f.array), 16), m !== void 0 && (a.instanceColor = new os(new Float32Array(m.array), m.itemSize));
        break;
      case "BatchedMesh":
        h = o(t.geometry), u = l(t.material), a = new Wd(t.maxInstanceCount, t.maxVertexCount, t.maxIndexCount, u), a.geometry = h, a.perObjectFrustumCulled = t.perObjectFrustumCulled, a.sortObjects = t.sortObjects, a._drawRanges = t.drawRanges, a._reservedRanges = t.reservedRanges, a._visibility = t.visibility, a._active = t.active, a._bounds = t.bounds.map((_) => {
          const g = new Ue();
          g.min.fromArray(_.boxMin), g.max.fromArray(_.boxMax);
          const p = new Te();
          return p.radius = _.sphereRadius, p.center.fromArray(_.sphereCenter), { boxInitialized: _.boxInitialized, box: g, sphereInitialized: _.sphereInitialized, sphere: p };
        }), a._maxInstanceCount = t.maxInstanceCount, a._maxVertexCount = t.maxVertexCount, a._maxIndexCount = t.maxIndexCount, a._geometryInitialized = t.geometryInitialized, a._geometryCount = t.geometryCount, a._matricesTexture = c(t.matricesTexture.uuid), t.colorsTexture !== void 0 && (a._colorsTexture = c(t.colorsTexture.uuid));
        break;
      case "LOD":
        a = new Vd();
        break;
      case "Line":
        a = new Zn(o(t.geometry), l(t.material));
        break;
      case "LineLoop":
        a = new Xd(o(t.geometry), l(t.material));
        break;
      case "LineSegments":
        a = new _n(o(t.geometry), l(t.material));
        break;
      case "PointCloud":
      case "Points":
        a = new qd(o(t.geometry), l(t.material));
        break;
      case "Sprite":
        a = new kd(l(t.material));
        break;
      case "Group":
        a = new ts();
        break;
      case "Bone":
        a = new xc();
        break;
      default:
        a = new $t();
    }
    if (a.uuid = t.uuid, t.name !== void 0 && (a.name = t.name), t.matrix !== void 0 ? (a.matrix.fromArray(t.matrix), t.matrixAutoUpdate !== void 0 && (a.matrixAutoUpdate = t.matrixAutoUpdate), a.matrixAutoUpdate && a.matrix.decompose(a.position, a.quaternion, a.scale)) : (t.position !== void 0 && a.position.fromArray(t.position), t.rotation !== void 0 && a.rotation.fromArray(t.rotation), t.quaternion !== void 0 && a.quaternion.fromArray(t.quaternion), t.scale !== void 0 && a.scale.fromArray(t.scale)), t.up !== void 0 && a.up.fromArray(t.up), t.castShadow !== void 0 && (a.castShadow = t.castShadow), t.receiveShadow !== void 0 && (a.receiveShadow = t.receiveShadow), t.shadow && (t.shadow.intensity !== void 0 && (a.shadow.intensity = t.shadow.intensity), t.shadow.bias !== void 0 && (a.shadow.bias = t.shadow.bias), t.shadow.normalBias !== void 0 && (a.shadow.normalBias = t.shadow.normalBias), t.shadow.radius !== void 0 && (a.shadow.radius = t.shadow.radius), t.shadow.mapSize !== void 0 && a.shadow.mapSize.fromArray(t.shadow.mapSize), t.shadow.camera !== void 0 && (a.shadow.camera = this.parseObject(t.shadow.camera))), t.visible !== void 0 && (a.visible = t.visible), t.frustumCulled !== void 0 && (a.frustumCulled = t.frustumCulled), t.renderOrder !== void 0 && (a.renderOrder = t.renderOrder), t.userData !== void 0 && (a.userData = t.userData), t.layers !== void 0 && (a.layers.mask = t.layers), t.children !== void 0) {
      const d = t.children;
      for (let f = 0; f < d.length; f++) a.add(this.parseObject(d[f], e, n, i, r));
    }
    if (t.animations !== void 0) {
      const d = t.animations;
      for (let f = 0; f < d.length; f++) {
        const m = d[f];
        a.animations.push(r[m]);
      }
    }
    if (t.type === "LOD") {
      t.autoUpdate !== void 0 && (a.autoUpdate = t.autoUpdate);
      const d = t.levels;
      for (let f = 0; f < d.length; f++) {
        const m = d[f], _ = a.getObjectByProperty("uuid", m.object);
        _ !== void 0 && a.addLevel(_, m.distance, m.hysteresis);
      }
    }
    return a;
  }
  bindSkeletons(t, e) {
    Object.keys(e).length !== 0 && t.traverse(function(n) {
      if (n.isSkinnedMesh === true && n.skeleton !== void 0) {
        const i = e[n.skeleton];
        i === void 0 ? console.warn("THREE.ObjectLoader: No skeleton found with UUID:", n.skeleton) : n.bind(i, n.bindMatrix);
      }
    });
  }
  bindLightTargets(t) {
    t.traverse(function(e) {
      if (e.isDirectionalLight || e.isSpotLight) {
        const n = e.target, i = t.getObjectByProperty("uuid", n);
        i !== void 0 ? e.target = i : e.target = new $t();
      }
    });
  }
}
const hy = { UVMapping: so, CubeReflectionMapping: In, CubeRefractionMapping: Yn, EquirectangularReflectionMapping: Vs, EquirectangularRefractionMapping: Hs, CubeUVReflectionMapping: ls }, au = { RepeatWrapping: Gs, ClampToEdgeWrapping: Qe, MirroredRepeatWrapping: Ws }, ou = { NearestFilter: Me, NearestMipmapNearestFilter: Kl, NearestMipmapLinearFilter: Ki, LinearFilter: ge, LinearMipmapNearestFilter: Is, LinearMipmapLinearFilter: un };
class uy extends He {
  constructor(t) {
    super(t), this.isImageBitmapLoader = true, typeof createImageBitmap > "u" && console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."), typeof fetch > "u" && console.warn("THREE.ImageBitmapLoader: fetch() not supported."), this.options = { premultiplyAlpha: "none" };
  }
  setOptions(t) {
    return this.options = t, this;
  }
  load(t, e, n, i) {
    t === void 0 && (t = ""), this.path !== void 0 && (t = this.path + t), t = this.manager.resolveURL(t);
    const r = this, a = Tn.get(t);
    if (a !== void 0) {
      if (r.manager.itemStart(t), a.then) {
        a.then((c) => {
          e && e(c), r.manager.itemEnd(t);
        }).catch((c) => {
          i && i(c);
        });
        return;
      }
      return setTimeout(function() {
        e && e(a), r.manager.itemEnd(t);
      }, 0), a;
    }
    const o = {};
    o.credentials = this.crossOrigin === "anonymous" ? "same-origin" : "include", o.headers = this.requestHeader;
    const l = fetch(t, o).then(function(c) {
      return c.blob();
    }).then(function(c) {
      return createImageBitmap(c, Object.assign(r.options, { colorSpaceConversion: "none" }));
    }).then(function(c) {
      return Tn.add(t, c), e && e(c), r.manager.itemEnd(t), c;
    }).catch(function(c) {
      i && i(c), Tn.remove(t), r.manager.itemError(t), r.manager.itemEnd(t);
    });
    Tn.add(t, l), r.manager.itemStart(t);
  }
}
let ra;
class Lc {
  static getContext() {
    return ra === void 0 && (ra = new (window.AudioContext || window.webkitAudioContext)()), ra;
  }
  static setContext(t) {
    ra = t;
  }
}
class dy extends He {
  constructor(t) {
    super(t);
  }
  load(t, e, n, i) {
    const r = this, a = new Dn(this.manager);
    a.setResponseType("arraybuffer"), a.setPath(this.path), a.setRequestHeader(this.requestHeader), a.setWithCredentials(this.withCredentials), a.load(t, function(l) {
      try {
        const c = l.slice(0);
        Lc.getContext().decodeAudioData(c, function(u) {
          e(u);
        }).catch(o);
      } catch (c) {
        o(c);
      }
    }, n, i);
    function o(l) {
      i ? i(l) : console.error(l), r.manager.itemError(t);
    }
  }
}
const lu = new Pt(), cu = new Pt(), oi = new Pt();
class fy {
  constructor() {
    this.type = "StereoCamera", this.aspect = 1, this.eyeSep = 0.064, this.cameraL = new be(), this.cameraL.layers.enable(1), this.cameraL.matrixAutoUpdate = false, this.cameraR = new be(), this.cameraR.layers.enable(2), this.cameraR.matrixAutoUpdate = false, this._cache = { focus: null, fov: null, aspect: null, near: null, far: null, zoom: null, eyeSep: null };
  }
  update(t) {
    const e = this._cache;
    if (e.focus !== t.focus || e.fov !== t.fov || e.aspect !== t.aspect * this.aspect || e.near !== t.near || e.far !== t.far || e.zoom !== t.zoom || e.eyeSep !== this.eyeSep) {
      e.focus = t.focus, e.fov = t.fov, e.aspect = t.aspect * this.aspect, e.near = t.near, e.far = t.far, e.zoom = t.zoom, e.eyeSep = this.eyeSep, oi.copy(t.projectionMatrix);
      const i = e.eyeSep / 2, r = i * e.near / e.focus, a = e.near * Math.tan(Si * e.fov * 0.5) / e.zoom;
      let o, l;
      cu.elements[12] = -i, lu.elements[12] = i, o = -a * e.aspect + r, l = a * e.aspect + r, oi.elements[0] = 2 * e.near / (l - o), oi.elements[8] = (l + o) / (l - o), this.cameraL.projectionMatrix.copy(oi), o = -a * e.aspect - r, l = a * e.aspect - r, oi.elements[0] = 2 * e.near / (l - o), oi.elements[8] = (l + o) / (l - o), this.cameraR.projectionMatrix.copy(oi);
    }
    this.cameraL.matrixWorld.copy(t.matrixWorld).multiply(cu), this.cameraR.matrixWorld.copy(t.matrixWorld).multiply(lu);
  }
}
class Rf {
  constructor(t = true) {
    this.autoStart = t, this.startTime = 0, this.oldTime = 0, this.elapsedTime = 0, this.running = false;
  }
  start() {
    this.startTime = hu(), this.oldTime = this.startTime, this.elapsedTime = 0, this.running = true;
  }
  stop() {
    this.getElapsedTime(), this.running = false, this.autoStart = false;
  }
  getElapsedTime() {
    return this.getDelta(), this.elapsedTime;
  }
  getDelta() {
    let t = 0;
    if (this.autoStart && !this.running) return this.start(), 0;
    if (this.running) {
      const e = hu();
      t = (e - this.oldTime) / 1e3, this.oldTime = e, this.elapsedTime += t;
    }
    return t;
  }
}
function hu() {
  return performance.now();
}
const li = new C(), uu = new Ve(), py = new C(), ci = new C();
class my extends $t {
  constructor() {
    super(), this.type = "AudioListener", this.context = Lc.getContext(), this.gain = this.context.createGain(), this.gain.connect(this.context.destination), this.filter = null, this.timeDelta = 0, this._clock = new Rf();
  }
  getInput() {
    return this.gain;
  }
  removeFilter() {
    return this.filter !== null && (this.gain.disconnect(this.filter), this.filter.disconnect(this.context.destination), this.gain.connect(this.context.destination), this.filter = null), this;
  }
  getFilter() {
    return this.filter;
  }
  setFilter(t) {
    return this.filter !== null ? (this.gain.disconnect(this.filter), this.filter.disconnect(this.context.destination)) : this.gain.disconnect(this.context.destination), this.filter = t, this.gain.connect(this.filter), this.filter.connect(this.context.destination), this;
  }
  getMasterVolume() {
    return this.gain.gain.value;
  }
  setMasterVolume(t) {
    return this.gain.gain.setTargetAtTime(t, this.context.currentTime, 0.01), this;
  }
  updateMatrixWorld(t) {
    super.updateMatrixWorld(t);
    const e = this.context.listener, n = this.up;
    if (this.timeDelta = this._clock.getDelta(), this.matrixWorld.decompose(li, uu, py), ci.set(0, 0, -1).applyQuaternion(uu), e.positionX) {
      const i = this.context.currentTime + this.timeDelta;
      e.positionX.linearRampToValueAtTime(li.x, i), e.positionY.linearRampToValueAtTime(li.y, i), e.positionZ.linearRampToValueAtTime(li.z, i), e.forwardX.linearRampToValueAtTime(ci.x, i), e.forwardY.linearRampToValueAtTime(ci.y, i), e.forwardZ.linearRampToValueAtTime(ci.z, i), e.upX.linearRampToValueAtTime(n.x, i), e.upY.linearRampToValueAtTime(n.y, i), e.upZ.linearRampToValueAtTime(n.z, i);
    } else e.setPosition(li.x, li.y, li.z), e.setOrientation(ci.x, ci.y, ci.z, n.x, n.y, n.z);
  }
}
class Pf extends $t {
  constructor(t) {
    super(), this.type = "Audio", this.listener = t, this.context = t.context, this.gain = this.context.createGain(), this.gain.connect(t.getInput()), this.autoplay = false, this.buffer = null, this.detune = 0, this.loop = false, this.loopStart = 0, this.loopEnd = 0, this.offset = 0, this.duration = void 0, this.playbackRate = 1, this.isPlaying = false, this.hasPlaybackControl = true, this.source = null, this.sourceType = "empty", this._startedAt = 0, this._progress = 0, this._connected = false, this.filters = [];
  }
  getOutput() {
    return this.gain;
  }
  setNodeSource(t) {
    return this.hasPlaybackControl = false, this.sourceType = "audioNode", this.source = t, this.connect(), this;
  }
  setMediaElementSource(t) {
    return this.hasPlaybackControl = false, this.sourceType = "mediaNode", this.source = this.context.createMediaElementSource(t), this.connect(), this;
  }
  setMediaStreamSource(t) {
    return this.hasPlaybackControl = false, this.sourceType = "mediaStreamNode", this.source = this.context.createMediaStreamSource(t), this.connect(), this;
  }
  setBuffer(t) {
    return this.buffer = t, this.sourceType = "buffer", this.autoplay && this.play(), this;
  }
  play(t = 0) {
    if (this.isPlaying === true) {
      console.warn("THREE.Audio: Audio is already playing.");
      return;
    }
    if (this.hasPlaybackControl === false) {
      console.warn("THREE.Audio: this Audio has no playback control.");
      return;
    }
    this._startedAt = this.context.currentTime + t;
    const e = this.context.createBufferSource();
    return e.buffer = this.buffer, e.loop = this.loop, e.loopStart = this.loopStart, e.loopEnd = this.loopEnd, e.onended = this.onEnded.bind(this), e.start(this._startedAt, this._progress + this.offset, this.duration), this.isPlaying = true, this.source = e, this.setDetune(this.detune), this.setPlaybackRate(this.playbackRate), this.connect();
  }
  pause() {
    if (this.hasPlaybackControl === false) {
      console.warn("THREE.Audio: this Audio has no playback control.");
      return;
    }
    return this.isPlaying === true && (this._progress += Math.max(this.context.currentTime - this._startedAt, 0) * this.playbackRate, this.loop === true && (this._progress = this._progress % (this.duration || this.buffer.duration)), this.source.stop(), this.source.onended = null, this.isPlaying = false), this;
  }
  stop(t = 0) {
    if (this.hasPlaybackControl === false) {
      console.warn("THREE.Audio: this Audio has no playback control.");
      return;
    }
    return this._progress = 0, this.source !== null && (this.source.stop(this.context.currentTime + t), this.source.onended = null), this.isPlaying = false, this;
  }
  connect() {
    if (this.filters.length > 0) {
      this.source.connect(this.filters[0]);
      for (let t = 1, e = this.filters.length; t < e; t++) this.filters[t - 1].connect(this.filters[t]);
      this.filters[this.filters.length - 1].connect(this.getOutput());
    } else this.source.connect(this.getOutput());
    return this._connected = true, this;
  }
  disconnect() {
    if (this._connected !== false) {
      if (this.filters.length > 0) {
        this.source.disconnect(this.filters[0]);
        for (let t = 1, e = this.filters.length; t < e; t++) this.filters[t - 1].disconnect(this.filters[t]);
        this.filters[this.filters.length - 1].disconnect(this.getOutput());
      } else this.source.disconnect(this.getOutput());
      return this._connected = false, this;
    }
  }
  getFilters() {
    return this.filters;
  }
  setFilters(t) {
    return t || (t = []), this._connected === true ? (this.disconnect(), this.filters = t.slice(), this.connect()) : this.filters = t.slice(), this;
  }
  setDetune(t) {
    return this.detune = t, this.isPlaying === true && this.source.detune !== void 0 && this.source.detune.setTargetAtTime(this.detune, this.context.currentTime, 0.01), this;
  }
  getDetune() {
    return this.detune;
  }
  getFilter() {
    return this.getFilters()[0];
  }
  setFilter(t) {
    return this.setFilters(t ? [t] : []);
  }
  setPlaybackRate(t) {
    if (this.hasPlaybackControl === false) {
      console.warn("THREE.Audio: this Audio has no playback control.");
      return;
    }
    return this.playbackRate = t, this.isPlaying === true && this.source.playbackRate.setTargetAtTime(this.playbackRate, this.context.currentTime, 0.01), this;
  }
  getPlaybackRate() {
    return this.playbackRate;
  }
  onEnded() {
    this.isPlaying = false;
  }
  getLoop() {
    return this.hasPlaybackControl === false ? (console.warn("THREE.Audio: this Audio has no playback control."), false) : this.loop;
  }
  setLoop(t) {
    if (this.hasPlaybackControl === false) {
      console.warn("THREE.Audio: this Audio has no playback control.");
      return;
    }
    return this.loop = t, this.isPlaying === true && (this.source.loop = this.loop), this;
  }
  setLoopStart(t) {
    return this.loopStart = t, this;
  }
  setLoopEnd(t) {
    return this.loopEnd = t, this;
  }
  getVolume() {
    return this.gain.gain.value;
  }
  setVolume(t) {
    return this.gain.gain.setTargetAtTime(t, this.context.currentTime, 0.01), this;
  }
}
const hi = new C(), du = new Ve(), gy = new C(), ui = new C();
class _y extends Pf {
  constructor(t) {
    super(t), this.panner = this.context.createPanner(), this.panner.panningModel = "HRTF", this.panner.connect(this.gain);
  }
  connect() {
    super.connect(), this.panner.connect(this.gain);
  }
  disconnect() {
    super.disconnect(), this.panner.disconnect(this.gain);
  }
  getOutput() {
    return this.panner;
  }
  getRefDistance() {
    return this.panner.refDistance;
  }
  setRefDistance(t) {
    return this.panner.refDistance = t, this;
  }
  getRolloffFactor() {
    return this.panner.rolloffFactor;
  }
  setRolloffFactor(t) {
    return this.panner.rolloffFactor = t, this;
  }
  getDistanceModel() {
    return this.panner.distanceModel;
  }
  setDistanceModel(t) {
    return this.panner.distanceModel = t, this;
  }
  getMaxDistance() {
    return this.panner.maxDistance;
  }
  setMaxDistance(t) {
    return this.panner.maxDistance = t, this;
  }
  setDirectionalCone(t, e, n) {
    return this.panner.coneInnerAngle = t, this.panner.coneOuterAngle = e, this.panner.coneOuterGain = n, this;
  }
  updateMatrixWorld(t) {
    if (super.updateMatrixWorld(t), this.hasPlaybackControl === true && this.isPlaying === false) return;
    this.matrixWorld.decompose(hi, du, gy), ui.set(0, 0, 1).applyQuaternion(du);
    const e = this.panner;
    if (e.positionX) {
      const n = this.context.currentTime + this.listener.timeDelta;
      e.positionX.linearRampToValueAtTime(hi.x, n), e.positionY.linearRampToValueAtTime(hi.y, n), e.positionZ.linearRampToValueAtTime(hi.z, n), e.orientationX.linearRampToValueAtTime(ui.x, n), e.orientationY.linearRampToValueAtTime(ui.y, n), e.orientationZ.linearRampToValueAtTime(ui.z, n);
    } else e.setPosition(hi.x, hi.y, hi.z), e.setOrientation(ui.x, ui.y, ui.z);
  }
}
class xy {
  constructor(t, e = 2048) {
    this.analyser = t.context.createAnalyser(), this.analyser.fftSize = e, this.data = new Uint8Array(this.analyser.frequencyBinCount), t.getOutput().connect(this.analyser);
  }
  getFrequencyData() {
    return this.analyser.getByteFrequencyData(this.data), this.data;
  }
  getAverageFrequency() {
    let t = 0;
    const e = this.getFrequencyData();
    for (let n = 0; n < e.length; n++) t += e[n];
    return t / e.length;
  }
}
class If {
  constructor(t, e, n) {
    this.binding = t, this.valueSize = n;
    let i, r, a;
    switch (e) {
      case "quaternion":
        i = this._slerp, r = this._slerpAdditive, a = this._setAdditiveIdentityQuaternion, this.buffer = new Float64Array(n * 6), this._workIndex = 5;
        break;
      case "string":
      case "bool":
        i = this._select, r = this._select, a = this._setAdditiveIdentityOther, this.buffer = new Array(n * 5);
        break;
      default:
        i = this._lerp, r = this._lerpAdditive, a = this._setAdditiveIdentityNumeric, this.buffer = new Float64Array(n * 5);
    }
    this._mixBufferRegion = i, this._mixBufferRegionAdditive = r, this._setIdentity = a, this._origIndex = 3, this._addIndex = 4, this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0, this.useCount = 0, this.referenceCount = 0;
  }
  accumulate(t, e) {
    const n = this.buffer, i = this.valueSize, r = t * i + i;
    let a = this.cumulativeWeight;
    if (a === 0) {
      for (let o = 0; o !== i; ++o) n[r + o] = n[o];
      a = e;
    } else {
      a += e;
      const o = e / a;
      this._mixBufferRegion(n, r, 0, o, i);
    }
    this.cumulativeWeight = a;
  }
  accumulateAdditive(t) {
    const e = this.buffer, n = this.valueSize, i = n * this._addIndex;
    this.cumulativeWeightAdditive === 0 && this._setIdentity(), this._mixBufferRegionAdditive(e, i, 0, t, n), this.cumulativeWeightAdditive += t;
  }
  apply(t) {
    const e = this.valueSize, n = this.buffer, i = t * e + e, r = this.cumulativeWeight, a = this.cumulativeWeightAdditive, o = this.binding;
    if (this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0, r < 1) {
      const l = e * this._origIndex;
      this._mixBufferRegion(n, i, l, 1 - r, e);
    }
    a > 0 && this._mixBufferRegionAdditive(n, i, this._addIndex * e, 1, e);
    for (let l = e, c = e + e; l !== c; ++l) if (n[l] !== n[l + e]) {
      o.setValue(n, i);
      break;
    }
  }
  saveOriginalState() {
    const t = this.binding, e = this.buffer, n = this.valueSize, i = n * this._origIndex;
    t.getValue(e, i);
    for (let r = n, a = i; r !== a; ++r) e[r] = e[i + r % n];
    this._setIdentity(), this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0;
  }
  restoreOriginalState() {
    const t = this.valueSize * 3;
    this.binding.setValue(this.buffer, t);
  }
  _setAdditiveIdentityNumeric() {
    const t = this._addIndex * this.valueSize, e = t + this.valueSize;
    for (let n = t; n < e; n++) this.buffer[n] = 0;
  }
  _setAdditiveIdentityQuaternion() {
    this._setAdditiveIdentityNumeric(), this.buffer[this._addIndex * this.valueSize + 3] = 1;
  }
  _setAdditiveIdentityOther() {
    const t = this._origIndex * this.valueSize, e = this._addIndex * this.valueSize;
    for (let n = 0; n < this.valueSize; n++) this.buffer[e + n] = this.buffer[t + n];
  }
  _select(t, e, n, i, r) {
    if (i >= 0.5) for (let a = 0; a !== r; ++a) t[e + a] = t[n + a];
  }
  _slerp(t, e, n, i) {
    Ve.slerpFlat(t, e, t, e, t, n, i);
  }
  _slerpAdditive(t, e, n, i, r) {
    const a = this._workIndex * r;
    Ve.multiplyQuaternionsFlat(t, a, t, e, t, n), Ve.slerpFlat(t, e, t, e, t, a, i);
  }
  _lerp(t, e, n, i, r) {
    const a = 1 - i;
    for (let o = 0; o !== r; ++o) {
      const l = e + o;
      t[l] = t[l] * a + t[n + o] * i;
    }
  }
  _lerpAdditive(t, e, n, i, r) {
    for (let a = 0; a !== r; ++a) {
      const o = e + a;
      t[o] = t[o] + t[n + a] * i;
    }
  }
}
const Dc = "\\[\\]\\.:\\/", vy = new RegExp("[" + Dc + "]", "g"), Uc = "[^" + Dc + "]", yy = "[^" + Dc.replace("\\.", "") + "]", My = /((?:WC+[\/:])*)/.source.replace("WC", Uc), Sy = /(WCOD+)?/.source.replace("WCOD", yy), by = /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC", Uc), wy = /\.(WC+)(?:\[(.+)\])?/.source.replace("WC", Uc), Ey = new RegExp("^" + My + Sy + by + wy + "$"), Ay = ["material", "materials", "bones", "map"];
class Ty {
  constructor(t, e, n) {
    const i = n || Zt.parseTrackName(e);
    this._targetGroup = t, this._bindings = t.subscribe_(e, i);
  }
  getValue(t, e) {
    this.bind();
    const n = this._targetGroup.nCachedObjects_, i = this._bindings[n];
    i !== void 0 && i.getValue(t, e);
  }
  setValue(t, e) {
    const n = this._bindings;
    for (let i = this._targetGroup.nCachedObjects_, r = n.length; i !== r; ++i) n[i].setValue(t, e);
  }
  bind() {
    const t = this._bindings;
    for (let e = this._targetGroup.nCachedObjects_, n = t.length; e !== n; ++e) t[e].bind();
  }
  unbind() {
    const t = this._bindings;
    for (let e = this._targetGroup.nCachedObjects_, n = t.length; e !== n; ++e) t[e].unbind();
  }
}
class Zt {
  constructor(t, e, n) {
    this.path = e, this.parsedPath = n || Zt.parseTrackName(e), this.node = Zt.findNode(t, this.parsedPath.nodeName), this.rootNode = t, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
  }
  static create(t, e, n) {
    return t && t.isAnimationObjectGroup ? new Zt.Composite(t, e, n) : new Zt(t, e, n);
  }
  static sanitizeNodeName(t) {
    return t.replace(/\s/g, "_").replace(vy, "");
  }
  static parseTrackName(t) {
    const e = Ey.exec(t);
    if (e === null) throw new Error("PropertyBinding: Cannot parse trackName: " + t);
    const n = { nodeName: e[2], objectName: e[3], objectIndex: e[4], propertyName: e[5], propertyIndex: e[6] }, i = n.nodeName && n.nodeName.lastIndexOf(".");
    if (i !== void 0 && i !== -1) {
      const r = n.nodeName.substring(i + 1);
      Ay.indexOf(r) !== -1 && (n.nodeName = n.nodeName.substring(0, i), n.objectName = r);
    }
    if (n.propertyName === null || n.propertyName.length === 0) throw new Error("PropertyBinding: can not parse propertyName from trackName: " + t);
    return n;
  }
  static findNode(t, e) {
    if (e === void 0 || e === "" || e === "." || e === -1 || e === t.name || e === t.uuid) return t;
    if (t.skeleton) {
      const n = t.skeleton.getBoneByName(e);
      if (n !== void 0) return n;
    }
    if (t.children) {
      const n = function(r) {
        for (let a = 0; a < r.length; a++) {
          const o = r[a];
          if (o.name === e || o.uuid === e) return o;
          const l = n(o.children);
          if (l) return l;
        }
        return null;
      }, i = n(t.children);
      if (i) return i;
    }
    return null;
  }
  _getValue_unavailable() {
  }
  _setValue_unavailable() {
  }
  _getValue_direct(t, e) {
    t[e] = this.targetObject[this.propertyName];
  }
  _getValue_array(t, e) {
    const n = this.resolvedProperty;
    for (let i = 0, r = n.length; i !== r; ++i) t[e++] = n[i];
  }
  _getValue_arrayElement(t, e) {
    t[e] = this.resolvedProperty[this.propertyIndex];
  }
  _getValue_toArray(t, e) {
    this.resolvedProperty.toArray(t, e);
  }
  _setValue_direct(t, e) {
    this.targetObject[this.propertyName] = t[e];
  }
  _setValue_direct_setNeedsUpdate(t, e) {
    this.targetObject[this.propertyName] = t[e], this.targetObject.needsUpdate = true;
  }
  _setValue_direct_setMatrixWorldNeedsUpdate(t, e) {
    this.targetObject[this.propertyName] = t[e], this.targetObject.matrixWorldNeedsUpdate = true;
  }
  _setValue_array(t, e) {
    const n = this.resolvedProperty;
    for (let i = 0, r = n.length; i !== r; ++i) n[i] = t[e++];
  }
  _setValue_array_setNeedsUpdate(t, e) {
    const n = this.resolvedProperty;
    for (let i = 0, r = n.length; i !== r; ++i) n[i] = t[e++];
    this.targetObject.needsUpdate = true;
  }
  _setValue_array_setMatrixWorldNeedsUpdate(t, e) {
    const n = this.resolvedProperty;
    for (let i = 0, r = n.length; i !== r; ++i) n[i] = t[e++];
    this.targetObject.matrixWorldNeedsUpdate = true;
  }
  _setValue_arrayElement(t, e) {
    this.resolvedProperty[this.propertyIndex] = t[e];
  }
  _setValue_arrayElement_setNeedsUpdate(t, e) {
    this.resolvedProperty[this.propertyIndex] = t[e], this.targetObject.needsUpdate = true;
  }
  _setValue_arrayElement_setMatrixWorldNeedsUpdate(t, e) {
    this.resolvedProperty[this.propertyIndex] = t[e], this.targetObject.matrixWorldNeedsUpdate = true;
  }
  _setValue_fromArray(t, e) {
    this.resolvedProperty.fromArray(t, e);
  }
  _setValue_fromArray_setNeedsUpdate(t, e) {
    this.resolvedProperty.fromArray(t, e), this.targetObject.needsUpdate = true;
  }
  _setValue_fromArray_setMatrixWorldNeedsUpdate(t, e) {
    this.resolvedProperty.fromArray(t, e), this.targetObject.matrixWorldNeedsUpdate = true;
  }
  _getValue_unbound(t, e) {
    this.bind(), this.getValue(t, e);
  }
  _setValue_unbound(t, e) {
    this.bind(), this.setValue(t, e);
  }
  bind() {
    let t = this.node;
    const e = this.parsedPath, n = e.objectName, i = e.propertyName;
    let r = e.propertyIndex;
    if (t || (t = Zt.findNode(this.rootNode, e.nodeName), this.node = t), this.getValue = this._getValue_unavailable, this.setValue = this._setValue_unavailable, !t) {
      console.warn("THREE.PropertyBinding: No target node found for track: " + this.path + ".");
      return;
    }
    if (n) {
      let c = e.objectIndex;
      switch (n) {
        case "materials":
          if (!t.material) {
            console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.", this);
            return;
          }
          if (!t.material.materials) {
            console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.", this);
            return;
          }
          t = t.material.materials;
          break;
        case "bones":
          if (!t.skeleton) {
            console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.", this);
            return;
          }
          t = t.skeleton.bones;
          for (let h = 0; h < t.length; h++) if (t[h].name === c) {
            c = h;
            break;
          }
          break;
        case "map":
          if ("map" in t) {
            t = t.map;
            break;
          }
          if (!t.material) {
            console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.", this);
            return;
          }
          if (!t.material.map) {
            console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.", this);
            return;
          }
          t = t.material.map;
          break;
        default:
          if (t[n] === void 0) {
            console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.", this);
            return;
          }
          t = t[n];
      }
      if (c !== void 0) {
        if (t[c] === void 0) {
          console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.", this, t);
          return;
        }
        t = t[c];
      }
    }
    const a = t[i];
    if (a === void 0) {
      const c = e.nodeName;
      console.error("THREE.PropertyBinding: Trying to update property for track: " + c + "." + i + " but it wasn't found.", t);
      return;
    }
    let o = this.Versioning.None;
    this.targetObject = t, t.needsUpdate !== void 0 ? o = this.Versioning.NeedsUpdate : t.matrixWorldNeedsUpdate !== void 0 && (o = this.Versioning.MatrixWorldNeedsUpdate);
    let l = this.BindingType.Direct;
    if (r !== void 0) {
      if (i === "morphTargetInfluences") {
        if (!t.geometry) {
          console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.", this);
          return;
        }
        if (!t.geometry.morphAttributes) {
          console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.", this);
          return;
        }
        t.morphTargetDictionary[r] !== void 0 && (r = t.morphTargetDictionary[r]);
      }
      l = this.BindingType.ArrayElement, this.resolvedProperty = a, this.propertyIndex = r;
    } else a.fromArray !== void 0 && a.toArray !== void 0 ? (l = this.BindingType.HasFromToArray, this.resolvedProperty = a) : Array.isArray(a) ? (l = this.BindingType.EntireArray, this.resolvedProperty = a) : this.propertyName = i;
    this.getValue = this.GetterByBindingType[l], this.setValue = this.SetterByBindingTypeAndVersioning[l][o];
  }
  unbind() {
    this.node = null, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
  }
}
Zt.Composite = Ty;
Zt.prototype.BindingType = { Direct: 0, EntireArray: 1, ArrayElement: 2, HasFromToArray: 3 };
Zt.prototype.Versioning = { None: 0, NeedsUpdate: 1, MatrixWorldNeedsUpdate: 2 };
Zt.prototype.GetterByBindingType = [Zt.prototype._getValue_direct, Zt.prototype._getValue_array, Zt.prototype._getValue_arrayElement, Zt.prototype._getValue_toArray];
Zt.prototype.SetterByBindingTypeAndVersioning = [[Zt.prototype._setValue_direct, Zt.prototype._setValue_direct_setNeedsUpdate, Zt.prototype._setValue_direct_setMatrixWorldNeedsUpdate], [Zt.prototype._setValue_array, Zt.prototype._setValue_array_setNeedsUpdate, Zt.prototype._setValue_array_setMatrixWorldNeedsUpdate], [Zt.prototype._setValue_arrayElement, Zt.prototype._setValue_arrayElement_setNeedsUpdate, Zt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate], [Zt.prototype._setValue_fromArray, Zt.prototype._setValue_fromArray_setNeedsUpdate, Zt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];
class Cy {
  constructor() {
    this.isAnimationObjectGroup = true, this.uuid = Ye(), this._objects = Array.prototype.slice.call(arguments), this.nCachedObjects_ = 0;
    const t = {};
    this._indicesByUUID = t;
    for (let n = 0, i = arguments.length; n !== i; ++n) t[arguments[n].uuid] = n;
    this._paths = [], this._parsedPaths = [], this._bindings = [], this._bindingsIndicesByPath = {};
    const e = this;
    this.stats = { objects: { get total() {
      return e._objects.length;
    }, get inUse() {
      return this.total - e.nCachedObjects_;
    } }, get bindingsPerObject() {
      return e._bindings.length;
    } };
  }
  add() {
    const t = this._objects, e = this._indicesByUUID, n = this._paths, i = this._parsedPaths, r = this._bindings, a = r.length;
    let o, l = t.length, c = this.nCachedObjects_;
    for (let h = 0, u = arguments.length; h !== u; ++h) {
      const d = arguments[h], f = d.uuid;
      let m = e[f];
      if (m === void 0) {
        m = l++, e[f] = m, t.push(d);
        for (let _ = 0, g = a; _ !== g; ++_) r[_].push(new Zt(d, n[_], i[_]));
      } else if (m < c) {
        o = t[m];
        const _ = --c, g = t[_];
        e[g.uuid] = m, t[m] = g, e[f] = _, t[_] = d;
        for (let p = 0, y = a; p !== y; ++p) {
          const x = r[p], M = x[_];
          let I = x[m];
          x[m] = M, I === void 0 && (I = new Zt(d, n[p], i[p])), x[_] = I;
        }
      } else t[m] !== o && console.error("THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.");
    }
    this.nCachedObjects_ = c;
  }
  remove() {
    const t = this._objects, e = this._indicesByUUID, n = this._bindings, i = n.length;
    let r = this.nCachedObjects_;
    for (let a = 0, o = arguments.length; a !== o; ++a) {
      const l = arguments[a], c = l.uuid, h = e[c];
      if (h !== void 0 && h >= r) {
        const u = r++, d = t[u];
        e[d.uuid] = h, t[h] = d, e[c] = u, t[u] = l;
        for (let f = 0, m = i; f !== m; ++f) {
          const _ = n[f], g = _[u], p = _[h];
          _[h] = g, _[u] = p;
        }
      }
    }
    this.nCachedObjects_ = r;
  }
  uncache() {
    const t = this._objects, e = this._indicesByUUID, n = this._bindings, i = n.length;
    let r = this.nCachedObjects_, a = t.length;
    for (let o = 0, l = arguments.length; o !== l; ++o) {
      const c = arguments[o], h = c.uuid, u = e[h];
      if (u !== void 0) if (delete e[h], u < r) {
        const d = --r, f = t[d], m = --a, _ = t[m];
        e[f.uuid] = u, t[u] = f, e[_.uuid] = d, t[d] = _, t.pop();
        for (let g = 0, p = i; g !== p; ++g) {
          const y = n[g], x = y[d], M = y[m];
          y[u] = x, y[d] = M, y.pop();
        }
      } else {
        const d = --a, f = t[d];
        d > 0 && (e[f.uuid] = u), t[u] = f, t.pop();
        for (let m = 0, _ = i; m !== _; ++m) {
          const g = n[m];
          g[u] = g[d], g.pop();
        }
      }
    }
    this.nCachedObjects_ = r;
  }
  subscribe_(t, e) {
    const n = this._bindingsIndicesByPath;
    let i = n[t];
    const r = this._bindings;
    if (i !== void 0) return r[i];
    const a = this._paths, o = this._parsedPaths, l = this._objects, c = l.length, h = this.nCachedObjects_, u = new Array(c);
    i = r.length, n[t] = i, a.push(t), o.push(e), r.push(u);
    for (let d = h, f = l.length; d !== f; ++d) {
      const m = l[d];
      u[d] = new Zt(m, t, e);
    }
    return u;
  }
  unsubscribe_(t) {
    const e = this._bindingsIndicesByPath, n = e[t];
    if (n !== void 0) {
      const i = this._paths, r = this._parsedPaths, a = this._bindings, o = a.length - 1, l = a[o], c = t[o];
      e[c] = n, a[n] = l, a.pop(), r[n] = r[o], r.pop(), i[n] = i[o], i.pop();
    }
  }
}
class Lf {
  constructor(t, e, n = null, i = e.blendMode) {
    this._mixer = t, this._clip = e, this._localRoot = n, this.blendMode = i;
    const r = e.tracks, a = r.length, o = new Array(a), l = { endingStart: mi, endingEnd: mi };
    for (let c = 0; c !== a; ++c) {
      const h = r[c].createInterpolant(null);
      o[c] = h, h.settings = l;
    }
    this._interpolantSettings = l, this._interpolants = o, this._propertyBindings = new Array(a), this._cacheIndex = null, this._byClipCacheIndex = null, this._timeScaleInterpolant = null, this._weightInterpolant = null, this.loop = hd, this._loopCount = -1, this._startTime = null, this.time = 0, this.timeScale = 1, this._effectiveTimeScale = 1, this.weight = 1, this._effectiveWeight = 1, this.repetitions = 1 / 0, this.paused = false, this.enabled = true, this.clampWhenFinished = false, this.zeroSlopeAtStart = true, this.zeroSlopeAtEnd = true;
  }
  play() {
    return this._mixer._activateAction(this), this;
  }
  stop() {
    return this._mixer._deactivateAction(this), this.reset();
  }
  reset() {
    return this.paused = false, this.enabled = true, this.time = 0, this._loopCount = -1, this._startTime = null, this.stopFading().stopWarping();
  }
  isRunning() {
    return this.enabled && !this.paused && this.timeScale !== 0 && this._startTime === null && this._mixer._isActiveAction(this);
  }
  isScheduled() {
    return this._mixer._isActiveAction(this);
  }
  startAt(t) {
    return this._startTime = t, this;
  }
  setLoop(t, e) {
    return this.loop = t, this.repetitions = e, this;
  }
  setEffectiveWeight(t) {
    return this.weight = t, this._effectiveWeight = this.enabled ? t : 0, this.stopFading();
  }
  getEffectiveWeight() {
    return this._effectiveWeight;
  }
  fadeIn(t) {
    return this._scheduleFading(t, 0, 1);
  }
  fadeOut(t) {
    return this._scheduleFading(t, 1, 0);
  }
  crossFadeFrom(t, e, n) {
    if (t.fadeOut(e), this.fadeIn(e), n) {
      const i = this._clip.duration, r = t._clip.duration, a = r / i, o = i / r;
      t.warp(1, a, e), this.warp(o, 1, e);
    }
    return this;
  }
  crossFadeTo(t, e, n) {
    return t.crossFadeFrom(this, e, n);
  }
  stopFading() {
    const t = this._weightInterpolant;
    return t !== null && (this._weightInterpolant = null, this._mixer._takeBackControlInterpolant(t)), this;
  }
  setEffectiveTimeScale(t) {
    return this.timeScale = t, this._effectiveTimeScale = this.paused ? 0 : t, this.stopWarping();
  }
  getEffectiveTimeScale() {
    return this._effectiveTimeScale;
  }
  setDuration(t) {
    return this.timeScale = this._clip.duration / t, this.stopWarping();
  }
  syncWith(t) {
    return this.time = t.time, this.timeScale = t.timeScale, this.stopWarping();
  }
  halt(t) {
    return this.warp(this._effectiveTimeScale, 0, t);
  }
  warp(t, e, n) {
    const i = this._mixer, r = i.time, a = this.timeScale;
    let o = this._timeScaleInterpolant;
    o === null && (o = i._lendControlInterpolant(), this._timeScaleInterpolant = o);
    const l = o.parameterPositions, c = o.sampleValues;
    return l[0] = r, l[1] = r + n, c[0] = t / a, c[1] = e / a, this;
  }
  stopWarping() {
    const t = this._timeScaleInterpolant;
    return t !== null && (this._timeScaleInterpolant = null, this._mixer._takeBackControlInterpolant(t)), this;
  }
  getMixer() {
    return this._mixer;
  }
  getClip() {
    return this._clip;
  }
  getRoot() {
    return this._localRoot || this._mixer._root;
  }
  _update(t, e, n, i) {
    if (!this.enabled) {
      this._updateWeight(t);
      return;
    }
    const r = this._startTime;
    if (r !== null) {
      const l = (t - r) * n;
      l < 0 || n === 0 ? e = 0 : (this._startTime = null, e = n * l);
    }
    e *= this._updateTimeScale(t);
    const a = this._updateTime(e), o = this._updateWeight(t);
    if (o > 0) {
      const l = this._interpolants, c = this._propertyBindings;
      switch (this.blendMode) {
        case oc:
          for (let h = 0, u = l.length; h !== u; ++h) l[h].evaluate(a), c[h].accumulateAdditive(o);
          break;
        case uo:
        default:
          for (let h = 0, u = l.length; h !== u; ++h) l[h].evaluate(a), c[h].accumulate(i, o);
      }
    }
  }
  _updateWeight(t) {
    let e = 0;
    if (this.enabled) {
      e = this.weight;
      const n = this._weightInterpolant;
      if (n !== null) {
        const i = n.evaluate(t)[0];
        e *= i, t > n.parameterPositions[1] && (this.stopFading(), i === 0 && (this.enabled = false));
      }
    }
    return this._effectiveWeight = e, e;
  }
  _updateTimeScale(t) {
    let e = 0;
    if (!this.paused) {
      e = this.timeScale;
      const n = this._timeScaleInterpolant;
      if (n !== null) {
        const i = n.evaluate(t)[0];
        e *= i, t > n.parameterPositions[1] && (this.stopWarping(), e === 0 ? this.paused = true : this.timeScale = e);
      }
    }
    return this._effectiveTimeScale = e, e;
  }
  _updateTime(t) {
    const e = this._clip.duration, n = this.loop;
    let i = this.time + t, r = this._loopCount;
    const a = n === ud;
    if (t === 0) return r === -1 ? i : a && (r & 1) === 1 ? e - i : i;
    if (n === cd) {
      r === -1 && (this._loopCount = 0, this._setEndings(true, true, false));
      t: {
        if (i >= e) i = e;
        else if (i < 0) i = 0;
        else {
          this.time = i;
          break t;
        }
        this.clampWhenFinished ? this.paused = true : this.enabled = false, this.time = i, this._mixer.dispatchEvent({ type: "finished", action: this, direction: t < 0 ? -1 : 1 });
      }
    } else {
      if (r === -1 && (t >= 0 ? (r = 0, this._setEndings(true, this.repetitions === 0, a)) : this._setEndings(this.repetitions === 0, true, a)), i >= e || i < 0) {
        const o = Math.floor(i / e);
        i -= e * o, r += Math.abs(o);
        const l = this.repetitions - r;
        if (l <= 0) this.clampWhenFinished ? this.paused = true : this.enabled = false, i = t > 0 ? e : 0, this.time = i, this._mixer.dispatchEvent({ type: "finished", action: this, direction: t > 0 ? 1 : -1 });
        else {
          if (l === 1) {
            const c = t < 0;
            this._setEndings(c, !c, a);
          } else this._setEndings(false, false, a);
          this._loopCount = r, this.time = i, this._mixer.dispatchEvent({ type: "loop", action: this, loopDelta: o });
        }
      } else this.time = i;
      if (a && (r & 1) === 1) return e - i;
    }
    return i;
  }
  _setEndings(t, e, n) {
    const i = this._interpolantSettings;
    n ? (i.endingStart = gi, i.endingEnd = gi) : (t ? i.endingStart = this.zeroSlopeAtStart ? gi : mi : i.endingStart = qs, e ? i.endingEnd = this.zeroSlopeAtEnd ? gi : mi : i.endingEnd = qs);
  }
  _scheduleFading(t, e, n) {
    const i = this._mixer, r = i.time;
    let a = this._weightInterpolant;
    a === null && (a = i._lendControlInterpolant(), this._weightInterpolant = a);
    const o = a.parameterPositions, l = a.sampleValues;
    return o[0] = r, l[0] = e, o[1] = r + t, l[1] = n, this;
  }
}
const Ry = new Float32Array(1);
class Py extends gn {
  constructor(t) {
    super(), this._root = t, this._initMemoryManager(), this._accuIndex = 0, this.time = 0, this.timeScale = 1;
  }
  _bindAction(t, e) {
    const n = t._localRoot || this._root, i = t._clip.tracks, r = i.length, a = t._propertyBindings, o = t._interpolants, l = n.uuid, c = this._bindingsByRootAndName;
    let h = c[l];
    h === void 0 && (h = {}, c[l] = h);
    for (let u = 0; u !== r; ++u) {
      const d = i[u], f = d.name;
      let m = h[f];
      if (m !== void 0) ++m.referenceCount, a[u] = m;
      else {
        if (m = a[u], m !== void 0) {
          m._cacheIndex === null && (++m.referenceCount, this._addInactiveBinding(m, l, f));
          continue;
        }
        const _ = e && e._propertyBindings[u].binding.parsedPath;
        m = new If(Zt.create(n, f, _), d.ValueTypeName, d.getValueSize()), ++m.referenceCount, this._addInactiveBinding(m, l, f), a[u] = m;
      }
      o[u].resultBuffer = m.buffer;
    }
  }
  _activateAction(t) {
    if (!this._isActiveAction(t)) {
      if (t._cacheIndex === null) {
        const n = (t._localRoot || this._root).uuid, i = t._clip.uuid, r = this._actionsByClip[i];
        this._bindAction(t, r && r.knownActions[0]), this._addInactiveAction(t, i, n);
      }
      const e = t._propertyBindings;
      for (let n = 0, i = e.length; n !== i; ++n) {
        const r = e[n];
        r.useCount++ === 0 && (this._lendBinding(r), r.saveOriginalState());
      }
      this._lendAction(t);
    }
  }
  _deactivateAction(t) {
    if (this._isActiveAction(t)) {
      const e = t._propertyBindings;
      for (let n = 0, i = e.length; n !== i; ++n) {
        const r = e[n];
        --r.useCount === 0 && (r.restoreOriginalState(), this._takeBackBinding(r));
      }
      this._takeBackAction(t);
    }
  }
  _initMemoryManager() {
    this._actions = [], this._nActiveActions = 0, this._actionsByClip = {}, this._bindings = [], this._nActiveBindings = 0, this._bindingsByRootAndName = {}, this._controlInterpolants = [], this._nActiveControlInterpolants = 0;
    const t = this;
    this.stats = { actions: { get total() {
      return t._actions.length;
    }, get inUse() {
      return t._nActiveActions;
    } }, bindings: { get total() {
      return t._bindings.length;
    }, get inUse() {
      return t._nActiveBindings;
    } }, controlInterpolants: { get total() {
      return t._controlInterpolants.length;
    }, get inUse() {
      return t._nActiveControlInterpolants;
    } } };
  }
  _isActiveAction(t) {
    const e = t._cacheIndex;
    return e !== null && e < this._nActiveActions;
  }
  _addInactiveAction(t, e, n) {
    const i = this._actions, r = this._actionsByClip;
    let a = r[e];
    if (a === void 0) a = { knownActions: [t], actionByRoot: {} }, t._byClipCacheIndex = 0, r[e] = a;
    else {
      const o = a.knownActions;
      t._byClipCacheIndex = o.length, o.push(t);
    }
    t._cacheIndex = i.length, i.push(t), a.actionByRoot[n] = t;
  }
  _removeInactiveAction(t) {
    const e = this._actions, n = e[e.length - 1], i = t._cacheIndex;
    n._cacheIndex = i, e[i] = n, e.pop(), t._cacheIndex = null;
    const r = t._clip.uuid, a = this._actionsByClip, o = a[r], l = o.knownActions, c = l[l.length - 1], h = t._byClipCacheIndex;
    c._byClipCacheIndex = h, l[h] = c, l.pop(), t._byClipCacheIndex = null;
    const u = o.actionByRoot, d = (t._localRoot || this._root).uuid;
    delete u[d], l.length === 0 && delete a[r], this._removeInactiveBindingsForAction(t);
  }
  _removeInactiveBindingsForAction(t) {
    const e = t._propertyBindings;
    for (let n = 0, i = e.length; n !== i; ++n) {
      const r = e[n];
      --r.referenceCount === 0 && this._removeInactiveBinding(r);
    }
  }
  _lendAction(t) {
    const e = this._actions, n = t._cacheIndex, i = this._nActiveActions++, r = e[i];
    t._cacheIndex = i, e[i] = t, r._cacheIndex = n, e[n] = r;
  }
  _takeBackAction(t) {
    const e = this._actions, n = t._cacheIndex, i = --this._nActiveActions, r = e[i];
    t._cacheIndex = i, e[i] = t, r._cacheIndex = n, e[n] = r;
  }
  _addInactiveBinding(t, e, n) {
    const i = this._bindingsByRootAndName, r = this._bindings;
    let a = i[e];
    a === void 0 && (a = {}, i[e] = a), a[n] = t, t._cacheIndex = r.length, r.push(t);
  }
  _removeInactiveBinding(t) {
    const e = this._bindings, n = t.binding, i = n.rootNode.uuid, r = n.path, a = this._bindingsByRootAndName, o = a[i], l = e[e.length - 1], c = t._cacheIndex;
    l._cacheIndex = c, e[c] = l, e.pop(), delete o[r], Object.keys(o).length === 0 && delete a[i];
  }
  _lendBinding(t) {
    const e = this._bindings, n = t._cacheIndex, i = this._nActiveBindings++, r = e[i];
    t._cacheIndex = i, e[i] = t, r._cacheIndex = n, e[n] = r;
  }
  _takeBackBinding(t) {
    const e = this._bindings, n = t._cacheIndex, i = --this._nActiveBindings, r = e[i];
    t._cacheIndex = i, e[i] = t, r._cacheIndex = n, e[n] = r;
  }
  _lendControlInterpolant() {
    const t = this._controlInterpolants, e = this._nActiveControlInterpolants++;
    let n = t[e];
    return n === void 0 && (n = new Cc(new Float32Array(2), new Float32Array(2), 1, Ry), n.__cacheIndex = e, t[e] = n), n;
  }
  _takeBackControlInterpolant(t) {
    const e = this._controlInterpolants, n = t.__cacheIndex, i = --this._nActiveControlInterpolants, r = e[i];
    t.__cacheIndex = i, e[i] = t, r.__cacheIndex = n, e[n] = r;
  }
  clipAction(t, e, n) {
    const i = e || this._root, r = i.uuid;
    let a = typeof t == "string" ? rr.findByName(i, t) : t;
    const o = a !== null ? a.uuid : t, l = this._actionsByClip[o];
    let c = null;
    if (n === void 0 && (a !== null ? n = a.blendMode : n = uo), l !== void 0) {
      const u = l.actionByRoot[r];
      if (u !== void 0 && u.blendMode === n) return u;
      c = l.knownActions[0], a === null && (a = c._clip);
    }
    if (a === null) return null;
    const h = new Lf(this, a, e, n);
    return this._bindAction(h, c), this._addInactiveAction(h, o, r), h;
  }
  existingAction(t, e) {
    const n = e || this._root, i = n.uuid, r = typeof t == "string" ? rr.findByName(n, t) : t, a = r ? r.uuid : t, o = this._actionsByClip[a];
    return o !== void 0 && o.actionByRoot[i] || null;
  }
  stopAllAction() {
    const t = this._actions, e = this._nActiveActions;
    for (let n = e - 1; n >= 0; --n) t[n].stop();
    return this;
  }
  update(t) {
    t *= this.timeScale;
    const e = this._actions, n = this._nActiveActions, i = this.time += t, r = Math.sign(t), a = this._accuIndex ^= 1;
    for (let c = 0; c !== n; ++c) e[c]._update(i, t, r, a);
    const o = this._bindings, l = this._nActiveBindings;
    for (let c = 0; c !== l; ++c) o[c].apply(a);
    return this;
  }
  setTime(t) {
    this.time = 0;
    for (let e = 0; e < this._actions.length; e++) this._actions[e].time = 0;
    return this.update(t);
  }
  getRoot() {
    return this._root;
  }
  uncacheClip(t) {
    const e = this._actions, n = t.uuid, i = this._actionsByClip, r = i[n];
    if (r !== void 0) {
      const a = r.knownActions;
      for (let o = 0, l = a.length; o !== l; ++o) {
        const c = a[o];
        this._deactivateAction(c);
        const h = c._cacheIndex, u = e[e.length - 1];
        c._cacheIndex = null, c._byClipCacheIndex = null, u._cacheIndex = h, e[h] = u, e.pop(), this._removeInactiveBindingsForAction(c);
      }
      delete i[n];
    }
  }
  uncacheRoot(t) {
    const e = t.uuid, n = this._actionsByClip;
    for (const a in n) {
      const o = n[a].actionByRoot, l = o[e];
      l !== void 0 && (this._deactivateAction(l), this._removeInactiveAction(l));
    }
    const i = this._bindingsByRootAndName, r = i[e];
    if (r !== void 0) for (const a in r) {
      const o = r[a];
      o.restoreOriginalState(), this._removeInactiveBinding(o);
    }
  }
  uncacheAction(t, e) {
    const n = this.existingAction(t, e);
    n !== null && (this._deactivateAction(n), this._removeInactiveAction(n));
  }
}
class Nc {
  constructor(t) {
    this.value = t;
  }
  clone() {
    return new Nc(this.value.clone === void 0 ? this.value : this.value.clone());
  }
}
let Iy = 0;
class Ly extends gn {
  constructor() {
    super(), this.isUniformsGroup = true, Object.defineProperty(this, "id", { value: Iy++ }), this.name = "", this.usage = $s, this.uniforms = [];
  }
  add(t) {
    return this.uniforms.push(t), this;
  }
  remove(t) {
    const e = this.uniforms.indexOf(t);
    return e !== -1 && this.uniforms.splice(e, 1), this;
  }
  setName(t) {
    return this.name = t, this;
  }
  setUsage(t) {
    return this.usage = t, this;
  }
  dispose() {
    return this.dispatchEvent({ type: "dispose" }), this;
  }
  copy(t) {
    this.name = t.name, this.usage = t.usage;
    const e = t.uniforms;
    this.uniforms.length = 0;
    for (let n = 0, i = e.length; n < i; n++) {
      const r = Array.isArray(e[n]) ? e[n] : [e[n]];
      for (let a = 0; a < r.length; a++) this.uniforms.push(r[a].clone());
    }
    return this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class Dy extends Mo {
  constructor(t, e, n = 1) {
    super(t, e), this.isInstancedInterleavedBuffer = true, this.meshPerAttribute = n;
  }
  copy(t) {
    return super.copy(t), this.meshPerAttribute = t.meshPerAttribute, this;
  }
  clone(t) {
    const e = super.clone(t);
    return e.meshPerAttribute = this.meshPerAttribute, e;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.isInstancedInterleavedBuffer = true, e.meshPerAttribute = this.meshPerAttribute, e;
  }
}
class Uy {
  constructor(t, e, n, i, r) {
    this.isGLBufferAttribute = true, this.name = "", this.buffer = t, this.type = e, this.itemSize = n, this.elementSize = i, this.count = r, this.version = 0;
  }
  set needsUpdate(t) {
    t === true && this.version++;
  }
  setBuffer(t) {
    return this.buffer = t, this;
  }
  setType(t, e) {
    return this.type = t, this.elementSize = e, this;
  }
  setItemSize(t) {
    return this.itemSize = t, this;
  }
  setCount(t) {
    return this.count = t, this;
  }
}
const fu = new Pt();
class Ny {
  constructor(t, e, n = 0, i = 1 / 0) {
    this.ray = new hs(t, e), this.near = n, this.far = i, this.camera = null, this.layers = new mo(), this.params = { Mesh: {}, Line: { threshold: 1 }, LOD: {}, Points: { threshold: 1 }, Sprite: {} };
  }
  set(t, e) {
    this.ray.set(t, e);
  }
  setFromCamera(t, e) {
    e.isPerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(e.matrixWorld), this.ray.direction.set(t.x, t.y, 0.5).unproject(e).sub(this.ray.origin).normalize(), this.camera = e) : e.isOrthographicCamera ? (this.ray.origin.set(t.x, t.y, (e.near + e.far) / (e.near - e.far)).unproject(e), this.ray.direction.set(0, 0, -1).transformDirection(e.matrixWorld), this.camera = e) : console.error("THREE.Raycaster: Unsupported camera type: " + e.type);
  }
  setFromXRController(t) {
    return fu.identity().extractRotation(t.matrixWorld), this.ray.origin.setFromMatrixPosition(t.matrixWorld), this.ray.direction.set(0, 0, -1).applyMatrix4(fu), this;
  }
  intersectObject(t, e = true, n = []) {
    return Zl(t, this, n, e), n.sort(pu), n;
  }
  intersectObjects(t, e = true, n = []) {
    for (let i = 0, r = t.length; i < r; i++) Zl(t[i], this, n, e);
    return n.sort(pu), n;
  }
}
function pu(s, t) {
  return s.distance - t.distance;
}
function Zl(s, t, e, n) {
  let i = true;
  if (s.layers.test(t.layers) && s.raycast(t, e) === false && (i = false), i === true && n === true) {
    const r = s.children;
    for (let a = 0, o = r.length; a < o; a++) Zl(r[a], t, e, true);
  }
}
class Fy {
  constructor(t = 1, e = 0, n = 0) {
    return this.radius = t, this.phi = e, this.theta = n, this;
  }
  set(t, e, n) {
    return this.radius = t, this.phi = e, this.theta = n, this;
  }
  copy(t) {
    return this.radius = t.radius, this.phi = t.phi, this.theta = t.theta, this;
  }
  makeSafe() {
    return this.phi = Math.max(1e-6, Math.min(Math.PI - 1e-6, this.phi)), this;
  }
  setFromVector3(t) {
    return this.setFromCartesianCoords(t.x, t.y, t.z);
  }
  setFromCartesianCoords(t, e, n) {
    return this.radius = Math.sqrt(t * t + e * e + n * n), this.radius === 0 ? (this.theta = 0, this.phi = 0) : (this.theta = Math.atan2(t, n), this.phi = Math.acos(he(e / this.radius, -1, 1))), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class Oy {
  constructor(t = 1, e = 0, n = 0) {
    return this.radius = t, this.theta = e, this.y = n, this;
  }
  set(t, e, n) {
    return this.radius = t, this.theta = e, this.y = n, this;
  }
  copy(t) {
    return this.radius = t.radius, this.theta = t.theta, this.y = t.y, this;
  }
  setFromVector3(t) {
    return this.setFromCartesianCoords(t.x, t.y, t.z);
  }
  setFromCartesianCoords(t, e, n) {
    return this.radius = Math.sqrt(t * t + n * n), this.theta = Math.atan2(t, n), this.y = e, this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class Fc {
  constructor(t, e, n, i) {
    Fc.prototype.isMatrix2 = true, this.elements = [1, 0, 0, 1], t !== void 0 && this.set(t, e, n, i);
  }
  identity() {
    return this.set(1, 0, 0, 1), this;
  }
  fromArray(t, e = 0) {
    for (let n = 0; n < 4; n++) this.elements[n] = t[n + e];
    return this;
  }
  set(t, e, n, i) {
    const r = this.elements;
    return r[0] = t, r[2] = e, r[1] = n, r[3] = i, this;
  }
}
const mu = new Z();
class By {
  constructor(t = new Z(1 / 0, 1 / 0), e = new Z(-1 / 0, -1 / 0)) {
    this.isBox2 = true, this.min = t, this.max = e;
  }
  set(t, e) {
    return this.min.copy(t), this.max.copy(e), this;
  }
  setFromPoints(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e++) this.expandByPoint(t[e]);
    return this;
  }
  setFromCenterAndSize(t, e) {
    const n = mu.copy(e).multiplyScalar(0.5);
    return this.min.copy(t).sub(n), this.max.copy(t).add(n), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.min.copy(t.min), this.max.copy(t.max), this;
  }
  makeEmpty() {
    return this.min.x = this.min.y = 1 / 0, this.max.x = this.max.y = -1 / 0, this;
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y;
  }
  getCenter(t) {
    return this.isEmpty() ? t.set(0, 0) : t.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(t) {
    return this.isEmpty() ? t.set(0, 0) : t.subVectors(this.max, this.min);
  }
  expandByPoint(t) {
    return this.min.min(t), this.max.max(t), this;
  }
  expandByVector(t) {
    return this.min.sub(t), this.max.add(t), this;
  }
  expandByScalar(t) {
    return this.min.addScalar(-t), this.max.addScalar(t), this;
  }
  containsPoint(t) {
    return t.x >= this.min.x && t.x <= this.max.x && t.y >= this.min.y && t.y <= this.max.y;
  }
  containsBox(t) {
    return this.min.x <= t.min.x && t.max.x <= this.max.x && this.min.y <= t.min.y && t.max.y <= this.max.y;
  }
  getParameter(t, e) {
    return e.set((t.x - this.min.x) / (this.max.x - this.min.x), (t.y - this.min.y) / (this.max.y - this.min.y));
  }
  intersectsBox(t) {
    return t.max.x >= this.min.x && t.min.x <= this.max.x && t.max.y >= this.min.y && t.min.y <= this.max.y;
  }
  clampPoint(t, e) {
    return e.copy(t).clamp(this.min, this.max);
  }
  distanceToPoint(t) {
    return this.clampPoint(t, mu).distanceTo(t);
  }
  intersect(t) {
    return this.min.max(t.min), this.max.min(t.max), this.isEmpty() && this.makeEmpty(), this;
  }
  union(t) {
    return this.min.min(t.min), this.max.max(t.max), this;
  }
  translate(t) {
    return this.min.add(t), this.max.add(t), this;
  }
  equals(t) {
    return t.min.equals(this.min) && t.max.equals(this.max);
  }
}
const gu = new C(), aa = new C();
class zy {
  constructor(t = new C(), e = new C()) {
    this.start = t, this.end = e;
  }
  set(t, e) {
    return this.start.copy(t), this.end.copy(e), this;
  }
  copy(t) {
    return this.start.copy(t.start), this.end.copy(t.end), this;
  }
  getCenter(t) {
    return t.addVectors(this.start, this.end).multiplyScalar(0.5);
  }
  delta(t) {
    return t.subVectors(this.end, this.start);
  }
  distanceSq() {
    return this.start.distanceToSquared(this.end);
  }
  distance() {
    return this.start.distanceTo(this.end);
  }
  at(t, e) {
    return this.delta(e).multiplyScalar(t).add(this.start);
  }
  closestPointToPointParameter(t, e) {
    gu.subVectors(t, this.start), aa.subVectors(this.end, this.start);
    const n = aa.dot(aa);
    let r = aa.dot(gu) / n;
    return e && (r = he(r, 0, 1)), r;
  }
  closestPointToPoint(t, e, n) {
    const i = this.closestPointToPointParameter(t, e);
    return this.delta(n).multiplyScalar(i).add(this.start);
  }
  applyMatrix4(t) {
    return this.start.applyMatrix4(t), this.end.applyMatrix4(t), this;
  }
  equals(t) {
    return t.start.equals(this.start) && t.end.equals(this.end);
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const _u = new C();
class ky extends $t {
  constructor(t, e) {
    super(), this.light = t, this.matrixAutoUpdate = false, this.color = e, this.type = "SpotLightHelper";
    const n = new Ht(), i = [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, -1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, -1, 1];
    for (let a = 0, o = 1, l = 32; a < l; a++, o++) {
      const c = a / l * Math.PI * 2, h = o / l * Math.PI * 2;
      i.push(Math.cos(c), Math.sin(c), 1, Math.cos(h), Math.sin(h), 1);
    }
    n.setAttribute("position", new wt(i, 3));
    const r = new Ne({ fog: false, toneMapped: false });
    this.cone = new _n(n, r), this.add(this.cone), this.update();
  }
  dispose() {
    this.cone.geometry.dispose(), this.cone.material.dispose();
  }
  update() {
    this.light.updateWorldMatrix(true, false), this.light.target.updateWorldMatrix(true, false), this.parent ? (this.parent.updateWorldMatrix(true), this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)) : this.matrix.copy(this.light.matrixWorld), this.matrixWorld.copy(this.light.matrixWorld);
    const t = this.light.distance ? this.light.distance : 1e3, e = t * Math.tan(this.light.angle);
    this.cone.scale.set(e, e, t), _u.setFromMatrixPosition(this.light.target.matrixWorld), this.cone.lookAt(_u), this.color !== void 0 ? this.cone.material.color.set(this.color) : this.cone.material.color.copy(this.light.color);
  }
}
const Gn = new C(), oa = new Pt(), Pl = new Pt();
class Vy extends _n {
  constructor(t) {
    const e = Df(t), n = new Ht(), i = [], r = [], a = new ft(0, 0, 1), o = new ft(0, 1, 0);
    for (let c = 0; c < e.length; c++) {
      const h = e[c];
      h.parent && h.parent.isBone && (i.push(0, 0, 0), i.push(0, 0, 0), r.push(a.r, a.g, a.b), r.push(o.r, o.g, o.b));
    }
    n.setAttribute("position", new wt(i, 3)), n.setAttribute("color", new wt(r, 3));
    const l = new Ne({ vertexColors: true, depthTest: false, depthWrite: false, toneMapped: false, transparent: true });
    super(n, l), this.isSkeletonHelper = true, this.type = "SkeletonHelper", this.root = t, this.bones = e, this.matrix = t.matrixWorld, this.matrixAutoUpdate = false;
  }
  updateMatrixWorld(t) {
    const e = this.bones, n = this.geometry, i = n.getAttribute("position");
    Pl.copy(this.root.matrixWorld).invert();
    for (let r = 0, a = 0; r < e.length; r++) {
      const o = e[r];
      o.parent && o.parent.isBone && (oa.multiplyMatrices(Pl, o.matrixWorld), Gn.setFromMatrixPosition(oa), i.setXYZ(a, Gn.x, Gn.y, Gn.z), oa.multiplyMatrices(Pl, o.parent.matrixWorld), Gn.setFromMatrixPosition(oa), i.setXYZ(a + 1, Gn.x, Gn.y, Gn.z), a += 2);
    }
    n.getAttribute("position").needsUpdate = true, super.updateMatrixWorld(t);
  }
  dispose() {
    this.geometry.dispose(), this.material.dispose();
  }
}
function Df(s) {
  const t = [];
  s.isBone === true && t.push(s);
  for (let e = 0; e < s.children.length; e++) t.push.apply(t, Df(s.children[e]));
  return t;
}
class Hy extends _e {
  constructor(t, e, n) {
    const i = new mr(e, 4, 2), r = new $n({ wireframe: true, fog: false, toneMapped: false });
    super(i, r), this.light = t, this.color = n, this.type = "PointLightHelper", this.matrix = this.light.matrixWorld, this.matrixAutoUpdate = false, this.update();
  }
  dispose() {
    this.geometry.dispose(), this.material.dispose();
  }
  update() {
    this.light.updateWorldMatrix(true, false), this.color !== void 0 ? this.material.color.set(this.color) : this.material.color.copy(this.light.color);
  }
}
const Gy = new C(), xu = new ft(), vu = new ft();
class Wy extends $t {
  constructor(t, e, n) {
    super(), this.light = t, this.matrix = t.matrixWorld, this.matrixAutoUpdate = false, this.color = n, this.type = "HemisphereLightHelper";
    const i = new pr(e);
    i.rotateY(Math.PI * 0.5), this.material = new $n({ wireframe: true, fog: false, toneMapped: false }), this.color === void 0 && (this.material.vertexColors = true);
    const r = i.getAttribute("position"), a = new Float32Array(r.count * 3);
    i.setAttribute("color", new ie(a, 3)), this.add(new _e(i, this.material)), this.update();
  }
  dispose() {
    this.children[0].geometry.dispose(), this.children[0].material.dispose();
  }
  update() {
    const t = this.children[0];
    if (this.color !== void 0) this.material.color.set(this.color);
    else {
      const e = t.geometry.getAttribute("color");
      xu.copy(this.light.color), vu.copy(this.light.groundColor);
      for (let n = 0, i = e.count; n < i; n++) {
        const r = n < i / 2 ? xu : vu;
        e.setXYZ(n, r.r, r.g, r.b);
      }
      e.needsUpdate = true;
    }
    this.light.updateWorldMatrix(true, false), t.lookAt(Gy.setFromMatrixPosition(this.light.matrixWorld).negate());
  }
}
class Xy extends _n {
  constructor(t = 10, e = 10, n = 4473924, i = 8947848) {
    n = new ft(n), i = new ft(i);
    const r = e / 2, a = t / e, o = t / 2, l = [], c = [];
    for (let d = 0, f = 0, m = -o; d <= e; d++, m += a) {
      l.push(-o, 0, m, o, 0, m), l.push(m, 0, -o, m, 0, o);
      const _ = d === r ? n : i;
      _.toArray(c, f), f += 3, _.toArray(c, f), f += 3, _.toArray(c, f), f += 3, _.toArray(c, f), f += 3;
    }
    const h = new Ht();
    h.setAttribute("position", new wt(l, 3)), h.setAttribute("color", new wt(c, 3));
    const u = new Ne({ vertexColors: true, toneMapped: false });
    super(h, u), this.type = "GridHelper";
  }
  dispose() {
    this.geometry.dispose(), this.material.dispose();
  }
}
class qy extends _n {
  constructor(t = 10, e = 16, n = 8, i = 64, r = 4473924, a = 8947848) {
    r = new ft(r), a = new ft(a);
    const o = [], l = [];
    if (e > 1) for (let u = 0; u < e; u++) {
      const d = u / e * (Math.PI * 2), f = Math.sin(d) * t, m = Math.cos(d) * t;
      o.push(0, 0, 0), o.push(f, 0, m);
      const _ = u & 1 ? r : a;
      l.push(_.r, _.g, _.b), l.push(_.r, _.g, _.b);
    }
    for (let u = 0; u < n; u++) {
      const d = u & 1 ? r : a, f = t - t / n * u;
      for (let m = 0; m < i; m++) {
        let _ = m / i * (Math.PI * 2), g = Math.sin(_) * f, p = Math.cos(_) * f;
        o.push(g, 0, p), l.push(d.r, d.g, d.b), _ = (m + 1) / i * (Math.PI * 2), g = Math.sin(_) * f, p = Math.cos(_) * f, o.push(g, 0, p), l.push(d.r, d.g, d.b);
      }
    }
    const c = new Ht();
    c.setAttribute("position", new wt(o, 3)), c.setAttribute("color", new wt(l, 3));
    const h = new Ne({ vertexColors: true, toneMapped: false });
    super(c, h), this.type = "PolarGridHelper";
  }
  dispose() {
    this.geometry.dispose(), this.material.dispose();
  }
}
const yu = new C(), la = new C(), Mu = new C();
class Yy extends $t {
  constructor(t, e, n) {
    super(), this.light = t, this.matrix = t.matrixWorld, this.matrixAutoUpdate = false, this.color = n, this.type = "DirectionalLightHelper", e === void 0 && (e = 1);
    let i = new Ht();
    i.setAttribute("position", new wt([-e, e, 0, e, e, 0, e, -e, 0, -e, -e, 0, -e, e, 0], 3));
    const r = new Ne({ fog: false, toneMapped: false });
    this.lightPlane = new Zn(i, r), this.add(this.lightPlane), i = new Ht(), i.setAttribute("position", new wt([0, 0, 0, 0, 0, 1], 3)), this.targetLine = new Zn(i, r), this.add(this.targetLine), this.update();
  }
  dispose() {
    this.lightPlane.geometry.dispose(), this.lightPlane.material.dispose(), this.targetLine.geometry.dispose(), this.targetLine.material.dispose();
  }
  update() {
    this.light.updateWorldMatrix(true, false), this.light.target.updateWorldMatrix(true, false), yu.setFromMatrixPosition(this.light.matrixWorld), la.setFromMatrixPosition(this.light.target.matrixWorld), Mu.subVectors(la, yu), this.lightPlane.lookAt(la), this.color !== void 0 ? (this.lightPlane.material.color.set(this.color), this.targetLine.material.color.set(this.color)) : (this.lightPlane.material.color.copy(this.light.color), this.targetLine.material.color.copy(this.light.color)), this.targetLine.lookAt(la), this.targetLine.scale.z = Mu.length();
  }
}
const ca = new C(), ce = new go();
class Zy extends _n {
  constructor(t) {
    const e = new Ht(), n = new Ne({ color: 16777215, vertexColors: true, toneMapped: false }), i = [], r = [], a = {};
    o("n1", "n2"), o("n2", "n4"), o("n4", "n3"), o("n3", "n1"), o("f1", "f2"), o("f2", "f4"), o("f4", "f3"), o("f3", "f1"), o("n1", "f1"), o("n2", "f2"), o("n3", "f3"), o("n4", "f4"), o("p", "n1"), o("p", "n2"), o("p", "n3"), o("p", "n4"), o("u1", "u2"), o("u2", "u3"), o("u3", "u1"), o("c", "t"), o("p", "c"), o("cn1", "cn2"), o("cn3", "cn4"), o("cf1", "cf2"), o("cf3", "cf4");
    function o(m, _) {
      l(m), l(_);
    }
    function l(m) {
      i.push(0, 0, 0), r.push(0, 0, 0), a[m] === void 0 && (a[m] = []), a[m].push(i.length / 3 - 1);
    }
    e.setAttribute("position", new wt(i, 3)), e.setAttribute("color", new wt(r, 3)), super(e, n), this.type = "CameraHelper", this.camera = t, this.camera.updateProjectionMatrix && this.camera.updateProjectionMatrix(), this.matrix = t.matrixWorld, this.matrixAutoUpdate = false, this.pointMap = a, this.update();
    const c = new ft(16755200), h = new ft(16711680), u = new ft(43775), d = new ft(16777215), f = new ft(3355443);
    this.setColors(c, h, u, d, f);
  }
  setColors(t, e, n, i, r) {
    const o = this.geometry.getAttribute("color");
    o.setXYZ(0, t.r, t.g, t.b), o.setXYZ(1, t.r, t.g, t.b), o.setXYZ(2, t.r, t.g, t.b), o.setXYZ(3, t.r, t.g, t.b), o.setXYZ(4, t.r, t.g, t.b), o.setXYZ(5, t.r, t.g, t.b), o.setXYZ(6, t.r, t.g, t.b), o.setXYZ(7, t.r, t.g, t.b), o.setXYZ(8, t.r, t.g, t.b), o.setXYZ(9, t.r, t.g, t.b), o.setXYZ(10, t.r, t.g, t.b), o.setXYZ(11, t.r, t.g, t.b), o.setXYZ(12, t.r, t.g, t.b), o.setXYZ(13, t.r, t.g, t.b), o.setXYZ(14, t.r, t.g, t.b), o.setXYZ(15, t.r, t.g, t.b), o.setXYZ(16, t.r, t.g, t.b), o.setXYZ(17, t.r, t.g, t.b), o.setXYZ(18, t.r, t.g, t.b), o.setXYZ(19, t.r, t.g, t.b), o.setXYZ(20, t.r, t.g, t.b), o.setXYZ(21, t.r, t.g, t.b), o.setXYZ(22, t.r, t.g, t.b), o.setXYZ(23, t.r, t.g, t.b), o.setXYZ(24, e.r, e.g, e.b), o.setXYZ(25, e.r, e.g, e.b), o.setXYZ(26, e.r, e.g, e.b), o.setXYZ(27, e.r, e.g, e.b), o.setXYZ(28, e.r, e.g, e.b), o.setXYZ(29, e.r, e.g, e.b), o.setXYZ(30, e.r, e.g, e.b), o.setXYZ(31, e.r, e.g, e.b), o.setXYZ(32, n.r, n.g, n.b), o.setXYZ(33, n.r, n.g, n.b), o.setXYZ(34, n.r, n.g, n.b), o.setXYZ(35, n.r, n.g, n.b), o.setXYZ(36, n.r, n.g, n.b), o.setXYZ(37, n.r, n.g, n.b), o.setXYZ(38, i.r, i.g, i.b), o.setXYZ(39, i.r, i.g, i.b), o.setXYZ(40, r.r, r.g, r.b), o.setXYZ(41, r.r, r.g, r.b), o.setXYZ(42, r.r, r.g, r.b), o.setXYZ(43, r.r, r.g, r.b), o.setXYZ(44, r.r, r.g, r.b), o.setXYZ(45, r.r, r.g, r.b), o.setXYZ(46, r.r, r.g, r.b), o.setXYZ(47, r.r, r.g, r.b), o.setXYZ(48, r.r, r.g, r.b), o.setXYZ(49, r.r, r.g, r.b), o.needsUpdate = true;
  }
  update() {
    const t = this.geometry, e = this.pointMap, n = 1, i = 1;
    ce.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse), fe("c", e, t, ce, 0, 0, -1), fe("t", e, t, ce, 0, 0, 1), fe("n1", e, t, ce, -n, -i, -1), fe("n2", e, t, ce, n, -i, -1), fe("n3", e, t, ce, -n, i, -1), fe("n4", e, t, ce, n, i, -1), fe("f1", e, t, ce, -n, -i, 1), fe("f2", e, t, ce, n, -i, 1), fe("f3", e, t, ce, -n, i, 1), fe("f4", e, t, ce, n, i, 1), fe("u1", e, t, ce, n * 0.7, i * 1.1, -1), fe("u2", e, t, ce, -n * 0.7, i * 1.1, -1), fe("u3", e, t, ce, 0, i * 2, -1), fe("cf1", e, t, ce, -n, 0, 1), fe("cf2", e, t, ce, n, 0, 1), fe("cf3", e, t, ce, 0, -i, 1), fe("cf4", e, t, ce, 0, i, 1), fe("cn1", e, t, ce, -n, 0, -1), fe("cn2", e, t, ce, n, 0, -1), fe("cn3", e, t, ce, 0, -i, -1), fe("cn4", e, t, ce, 0, i, -1), t.getAttribute("position").needsUpdate = true;
  }
  dispose() {
    this.geometry.dispose(), this.material.dispose();
  }
}
function fe(s, t, e, n, i, r, a) {
  ca.set(i, r, a).unproject(n);
  const o = t[s];
  if (o !== void 0) {
    const l = e.getAttribute("position");
    for (let c = 0, h = o.length; c < h; c++) l.setXYZ(o[c], ca.x, ca.y, ca.z);
  }
}
const ha = new Ue();
class Jy extends _n {
  constructor(t, e = 16776960) {
    const n = new Uint16Array([0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7]), i = new Float32Array(8 * 3), r = new Ht();
    r.setIndex(new ie(n, 1)), r.setAttribute("position", new ie(i, 3)), super(r, new Ne({ color: e, toneMapped: false })), this.object = t, this.type = "BoxHelper", this.matrixAutoUpdate = false, this.update();
  }
  update(t) {
    if (t !== void 0 && console.warn("THREE.BoxHelper: .update() has no longer arguments."), this.object !== void 0 && ha.setFromObject(this.object), ha.isEmpty()) return;
    const e = ha.min, n = ha.max, i = this.geometry.attributes.position, r = i.array;
    r[0] = n.x, r[1] = n.y, r[2] = n.z, r[3] = e.x, r[4] = n.y, r[5] = n.z, r[6] = e.x, r[7] = e.y, r[8] = n.z, r[9] = n.x, r[10] = e.y, r[11] = n.z, r[12] = n.x, r[13] = n.y, r[14] = e.z, r[15] = e.x, r[16] = n.y, r[17] = e.z, r[18] = e.x, r[19] = e.y, r[20] = e.z, r[21] = n.x, r[22] = e.y, r[23] = e.z, i.needsUpdate = true, this.geometry.computeBoundingSphere();
  }
  setFromObject(t) {
    return this.object = t, this.update(), this;
  }
  copy(t, e) {
    return super.copy(t, e), this.object = t.object, this;
  }
  dispose() {
    this.geometry.dispose(), this.material.dispose();
  }
}
class $y extends _n {
  constructor(t, e = 16776960) {
    const n = new Uint16Array([0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7]), i = [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1], r = new Ht();
    r.setIndex(new ie(n, 1)), r.setAttribute("position", new wt(i, 3)), super(r, new Ne({ color: e, toneMapped: false })), this.box = t, this.type = "Box3Helper", this.geometry.computeBoundingSphere();
  }
  updateMatrixWorld(t) {
    const e = this.box;
    e.isEmpty() || (e.getCenter(this.position), e.getSize(this.scale), this.scale.multiplyScalar(0.5), super.updateMatrixWorld(t));
  }
  dispose() {
    this.geometry.dispose(), this.material.dispose();
  }
}
class Ky extends Zn {
  constructor(t, e = 1, n = 16776960) {
    const i = n, r = [1, -1, 0, -1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0], a = new Ht();
    a.setAttribute("position", new wt(r, 3)), a.computeBoundingSphere(), super(a, new Ne({ color: i, toneMapped: false })), this.type = "PlaneHelper", this.plane = t, this.size = e;
    const o = [1, 1, 0, -1, 1, 0, -1, -1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0], l = new Ht();
    l.setAttribute("position", new wt(o, 3)), l.computeBoundingSphere(), this.add(new _e(l, new $n({ color: i, opacity: 0.2, transparent: true, depthWrite: false, toneMapped: false })));
  }
  updateMatrixWorld(t) {
    this.position.set(0, 0, 0), this.scale.set(0.5 * this.size, 0.5 * this.size, 1), this.lookAt(this.plane.normal), this.translateZ(-this.plane.constant), super.updateMatrixWorld(t);
  }
  dispose() {
    this.geometry.dispose(), this.material.dispose(), this.children[0].geometry.dispose(), this.children[0].material.dispose();
  }
}
const Su = new C();
let ua, Il;
class Qy extends $t {
  constructor(t = new C(0, 0, 1), e = new C(0, 0, 0), n = 1, i = 16776960, r = n * 0.2, a = r * 0.2) {
    super(), this.type = "ArrowHelper", ua === void 0 && (ua = new Ht(), ua.setAttribute("position", new wt([0, 0, 0, 0, 1, 0], 3)), Il = new fs(0, 0.5, 1, 5, 1), Il.translate(0, -0.5, 0)), this.position.copy(e), this.line = new Zn(ua, new Ne({ color: i, toneMapped: false })), this.line.matrixAutoUpdate = false, this.add(this.line), this.cone = new _e(Il, new $n({ color: i, toneMapped: false })), this.cone.matrixAutoUpdate = false, this.add(this.cone), this.setDirection(t), this.setLength(n, r, a);
  }
  setDirection(t) {
    if (t.y > 0.99999) this.quaternion.set(0, 0, 0, 1);
    else if (t.y < -0.99999) this.quaternion.set(1, 0, 0, 0);
    else {
      Su.set(t.z, 0, -t.x).normalize();
      const e = Math.acos(t.y);
      this.quaternion.setFromAxisAngle(Su, e);
    }
  }
  setLength(t, e = t * 0.2, n = e * 0.2) {
    this.line.scale.set(1, Math.max(1e-4, t - e), 1), this.line.updateMatrix(), this.cone.scale.set(n, e, n), this.cone.position.y = t, this.cone.updateMatrix();
  }
  setColor(t) {
    this.line.material.color.set(t), this.cone.material.color.set(t);
  }
  copy(t) {
    return super.copy(t, false), this.line.copy(t.line), this.cone.copy(t.cone), this;
  }
  dispose() {
    this.line.geometry.dispose(), this.line.material.dispose(), this.cone.geometry.dispose(), this.cone.material.dispose();
  }
}
class jy extends _n {
  constructor(t = 1) {
    const e = [0, 0, 0, t, 0, 0, 0, 0, 0, 0, t, 0, 0, 0, 0, 0, 0, t], n = [1, 0, 0, 1, 0.6, 0, 0, 1, 0, 0.6, 1, 0, 0, 0, 1, 0, 0.6, 1], i = new Ht();
    i.setAttribute("position", new wt(e, 3)), i.setAttribute("color", new wt(n, 3));
    const r = new Ne({ vertexColors: true, toneMapped: false });
    super(i, r), this.type = "AxesHelper";
  }
  setColors(t, e, n) {
    const i = new ft(), r = this.geometry.attributes.color.array;
    return i.set(t), i.toArray(r, 0), i.toArray(r, 3), i.set(e), i.toArray(r, 6), i.toArray(r, 9), i.set(n), i.toArray(r, 12), i.toArray(r, 15), this.geometry.attributes.color.needsUpdate = true, this;
  }
  dispose() {
    this.geometry.dispose(), this.material.dispose();
  }
}
class tM {
  constructor() {
    this.type = "ShapePath", this.color = new ft(), this.subPaths = [], this.currentPath = null;
  }
  moveTo(t, e) {
    return this.currentPath = new js(), this.subPaths.push(this.currentPath), this.currentPath.moveTo(t, e), this;
  }
  lineTo(t, e) {
    return this.currentPath.lineTo(t, e), this;
  }
  quadraticCurveTo(t, e, n, i) {
    return this.currentPath.quadraticCurveTo(t, e, n, i), this;
  }
  bezierCurveTo(t, e, n, i, r, a) {
    return this.currentPath.bezierCurveTo(t, e, n, i, r, a), this;
  }
  splineThru(t) {
    return this.currentPath.splineThru(t), this;
  }
  toShapes(t) {
    function e(p) {
      const y = [];
      for (let x = 0, M = p.length; x < M; x++) {
        const I = p[x], E = new bi();
        E.curves = I.curves, y.push(E);
      }
      return y;
    }
    function n(p, y) {
      const x = y.length;
      let M = false;
      for (let I = x - 1, E = 0; E < x; I = E++) {
        let A = y[I], P = y[E], V = P.x - A.x, v = P.y - A.y;
        if (Math.abs(v) > Number.EPSILON) {
          if (v < 0 && (A = y[E], V = -V, P = y[I], v = -v), p.y < A.y || p.y > P.y) continue;
          if (p.y === A.y) {
            if (p.x === A.x) return true;
          } else {
            const b = v * (p.x - A.x) - V * (p.y - A.y);
            if (b === 0) return true;
            if (b < 0) continue;
            M = !M;
          }
        } else {
          if (p.y !== A.y) continue;
          if (P.x <= p.x && p.x <= A.x || A.x <= p.x && p.x <= P.x) return true;
        }
      }
      return M;
    }
    const i = pn.isClockWise, r = this.subPaths;
    if (r.length === 0) return [];
    let a, o, l;
    const c = [];
    if (r.length === 1) return o = r[0], l = new bi(), l.curves = o.curves, c.push(l), c;
    let h = !i(r[0].getPoints());
    h = t ? !h : h;
    const u = [], d = [];
    let f = [], m = 0, _;
    d[m] = void 0, f[m] = [];
    for (let p = 0, y = r.length; p < y; p++) o = r[p], _ = o.getPoints(), a = i(_), a = t ? !a : a, a ? (!h && d[m] && m++, d[m] = { s: new bi(), p: _ }, d[m].s.curves = o.curves, h && m++, f[m] = []) : f[m].push({ h: o, p: _[0] });
    if (!d[0]) return e(r);
    if (d.length > 1) {
      let p = false, y = 0;
      for (let x = 0, M = d.length; x < M; x++) u[x] = [];
      for (let x = 0, M = d.length; x < M; x++) {
        const I = f[x];
        for (let E = 0; E < I.length; E++) {
          const A = I[E];
          let P = true;
          for (let V = 0; V < d.length; V++) n(A.p, d[V].p) && (x !== V && y++, P ? (P = false, u[V].push(A)) : p = true);
          P && u[x].push(A);
        }
      }
      y > 0 && p === false && (f = u);
    }
    let g;
    for (let p = 0, y = d.length; p < y; p++) {
      l = d[p].s, c.push(l), g = f[p];
      for (let x = 0, M = g.length; x < M; x++) l.holes.push(g[x].h);
    }
    return c;
  }
}
class eM extends gn {
  constructor(t, e = null) {
    super(), this.object = t, this.domElement = e, this.enabled = true, this.state = -1, this.keys = {}, this.mouseButtons = { LEFT: null, MIDDLE: null, RIGHT: null }, this.touches = { ONE: null, TWO: null };
  }
  connect() {
  }
  disconnect() {
  }
  dispose() {
  }
  update() {
  }
}
class nM extends rn {
  constructor(t = 1, e = 1, n = 1, i = {}) {
    console.warn('THREE.WebGLMultipleRenderTargets has been deprecated and will be removed in r172. Use THREE.WebGLRenderTarget and set the "count" parameter to enable MRT.'), super(t, e, { ...i, count: n }), this.isWebGLMultipleRenderTargets = true;
  }
  get texture() {
    return this.textures;
  }
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: { revision: io } }));
typeof window < "u" && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = io);
const oM = Object.freeze(Object.defineProperty({ __proto__: null, ACESFilmicToneMapping: sd, AddEquation: Xn, AddOperation: td, AdditiveAnimationBlendMode: oc, AdditiveBlending: Ul, AgXToneMapping: ad, AlphaFormat: ec, AlwaysCompare: Md, AlwaysDepth: Ma, AlwaysStencilFunc: Bl, AmbientLight: bf, AnimationAction: Lf, AnimationClip: rr, AnimationLoader: ey, AnimationMixer: Py, AnimationObjectGroup: Cy, AnimationUtils: Kv, ArcCurve: Yd, ArrayCamera: Od, ArrowHelper: Qy, AttachedBindMode: Ol, Audio: Pf, AudioAnalyser: xy, AudioContext: Lc, AudioListener: my, AudioLoader: dy, AxesHelper: jy, BackSide: De, BasicDepthPacking: dd, BasicShadowMap: qf, BatchedMesh: Wd, Bone: xc, BooleanKeyframeTrack: Pi, Box2: By, Box3: Ue, Box3Helper: $y, BoxGeometry: Ri, BoxHelper: Jy, BufferAttribute: ie, BufferGeometry: Ht, BufferGeometryLoader: Cf, ByteType: Ql, Cache: Tn, Camera: go, CameraHelper: Zy, CanvasTexture: Mv, CapsuleGeometry: Eo, CatmullRomCurve3: Zd, CineonToneMapping: id, CircleGeometry: Ao, ClampToEdgeWrapping: Qe, Clock: Rf, Color: ft, ColorKeyframeTrack: Rc, ColorManagement: Qt, CompressedArrayTexture: vv, CompressedCubeTexture: yv, CompressedTexture: bo, CompressedTextureLoader: ny, ConeGeometry: To, ConstantAlphaFactor: Ku, ConstantColorFactor: Ju, Controls: eM, CubeCamera: Rd, CubeReflectionMapping: In, CubeRefractionMapping: Yn, CubeTexture: ur, CubeTextureLoader: iy, CubeUVReflectionMapping: ls, CubicBezierCurve: Mc, CubicBezierCurve3: Jd, CubicInterpolant: mf, CullFaceBack: Dl, CullFaceFront: Du, CullFaceFrontBack: Xf, CullFaceNone: Lu, Curve: on, CurvePath: Kd, CustomBlending: Nu, CustomToneMapping: rd, CylinderGeometry: fs, Cylindrical: Oy, Data3DTexture: hc, DataArrayTexture: po, DataTexture: fn, DataTextureLoader: sy, DataUtils: om, DecrementStencilOp: ap, DecrementWrapStencilOp: lp, DefaultLoadingManager: xf, DepthFormat: Mi, DepthStencilFormat: Ai, DepthTexture: pc, DetachedBindMode: ld, DirectionalLight: Sf, DirectionalLightHelper: Yy, DiscreteInterpolant: gf, DisplayP3ColorSpace: fo, DodecahedronGeometry: Co, DoubleSide: hn, DstAlphaFactor: Wu, DstColorFactor: qu, DynamicCopyUsage: bp, DynamicDrawUsage: _p, DynamicReadUsage: yp, EdgesGeometry: Qd, EllipseCurve: wo, EqualCompare: _d, EqualDepth: ba, EqualStencilFunc: dp, EquirectangularReflectionMapping: Vs, EquirectangularRefractionMapping: Hs, Euler: Ze, EventDispatcher: gn, ExtrudeGeometry: Po, FileLoader: Dn, Float16BufferAttribute: fm, Float32BufferAttribute: wt, FloatType: ke, Fog: yo, FogExp2: vo, FramebufferTexture: xv, FrontSide: Pn, Frustum: dr, GLBufferAttribute: Uy, GLSL1: Ep, GLSL3: zl, GreaterCompare: xd, GreaterDepth: Ea, GreaterEqualCompare: yd, GreaterEqualDepth: wa, GreaterEqualStencilFunc: gp, GreaterStencilFunc: pp, GridHelper: Xy, Group: ts, HalfFloatType: cs, HemisphereLight: vf, HemisphereLightHelper: Wy, IcosahedronGeometry: Io, ImageBitmapLoader: uy, ImageLoader: ar, ImageUtils: wd, IncrementStencilOp: rp, IncrementWrapStencilOp: op, InstancedBufferAttribute: os, InstancedBufferGeometry: Tf, InstancedInterleavedBuffer: Dy, InstancedMesh: Gd, Int16BufferAttribute: um, Int32BufferAttribute: dm, Int8BufferAttribute: lm, IntType: ro, InterleavedBuffer: Mo, InterleavedBufferAttribute: Ti, Interpolant: gr, InterpolateDiscrete: Xs, InterpolateLinear: ja, InterpolateSmooth: da, InvertStencilOp: cp, KeepStencilOp: di, KeyframeTrack: ln, LOD: Vd, LatheGeometry: fr, Layers: mo, LessCompare: gd, LessDepth: Sa, LessEqualCompare: lc, LessEqualDepth: wi, LessEqualStencilFunc: fp, LessStencilFunc: up, Light: Qn, LightProbe: Af, Line: Zn, Line3: zy, LineBasicMaterial: Ne, LineCurve: Sc, LineCurve3: $d, LineDashedMaterial: df, LineLoop: Xd, LineSegments: _n, LinearDisplayP3ColorSpace: hr, LinearFilter: ge, LinearInterpolant: Cc, LinearMipMapLinearFilter: $f, LinearMipMapNearestFilter: Jf, LinearMipmapLinearFilter: un, LinearMipmapNearestFilter: Is, LinearSRGBColorSpace: Un, LinearToneMapping: ed, LinearTransfer: Ys, Loader: He, LoaderUtils: Yl, LoadingManager: Pc, LoopOnce: cd, LoopPingPong: ud, LoopRepeat: hd, LuminanceAlphaFormat: sc, LuminanceFormat: ic, MOUSE: Gf, Material: Ce, MaterialLoader: Bo, MathUtils: Hp, Matrix2: Fc, Matrix3: zt, Matrix4: Pt, MaxEquation: zu, Mesh: _e, MeshBasicMaterial: $n, MeshDepthMaterial: mc, MeshDistanceMaterial: gc, MeshLambertMaterial: hf, MeshMatcapMaterial: uf, MeshNormalMaterial: cf, MeshPhongMaterial: of, MeshPhysicalMaterial: af, MeshStandardMaterial: Ac, MeshToonMaterial: lf, MinEquation: Bu, MirroredRepeatWrapping: Ws, MixOperation: ju, MultiplyBlending: Fl, MultiplyOperation: lr, NearestFilter: Me, NearestMipMapLinearFilter: Zf, NearestMipMapNearestFilter: Yf, NearestMipmapLinearFilter: Ki, NearestMipmapNearestFilter: Kl, NeutralToneMapping: od, NeverCompare: md, NeverDepth: ya, NeverStencilFunc: hp, NoBlending: Cn, NoColorSpace: En, NoToneMapping: Rn, NormalAnimationBlendMode: uo, NormalBlending: yi, NotEqualCompare: vd, NotEqualDepth: Aa, NotEqualStencilFunc: mp, NumberKeyframeTrack: ir, Object3D: $t, ObjectLoader: cy, ObjectSpaceNormalMap: pd, OctahedronGeometry: pr, OneFactor: Vu, OneMinusConstantAlphaFactor: Qu, OneMinusConstantColorFactor: $u, OneMinusDstAlphaFactor: Xu, OneMinusDstColorFactor: Yu, OneMinusSrcAlphaFactor: va, OneMinusSrcColorFactor: Gu, OrthographicCamera: _o, P3Primaries: Js, PCFShadowMap: $l, PCFSoftShadowMap: Uu, PMREMGenerator: kl, Path: js, PerspectiveCamera: be, Plane: Wn, PlaneGeometry: us, PlaneHelper: Ky, PointLight: Mf, PointLightHelper: Hy, Points: qd, PointsMaterial: vc, PolarGridHelper: qy, PolyhedronGeometry: Kn, PositionalAudio: _y, PropertyBinding: Zt, PropertyMixer: If, QuadraticBezierCurve: bc, QuadraticBezierCurve3: wc, Quaternion: Ve, QuaternionKeyframeTrack: _r, QuaternionLinearInterpolant: _f, RED_GREEN_RGTC2_Format: Ka, RED_RGTC1_Format: ac, REVISION: io, RGBADepthPacking: fd, RGBAFormat: Le, RGBAIntegerFormat: ho, RGBA_ASTC_10x10_Format: Xa, RGBA_ASTC_10x5_Format: Ha, RGBA_ASTC_10x6_Format: Ga, RGBA_ASTC_10x8_Format: Wa, RGBA_ASTC_12x10_Format: qa, RGBA_ASTC_12x12_Format: Ya, RGBA_ASTC_4x4_Format: Ua, RGBA_ASTC_5x4_Format: Na, RGBA_ASTC_5x5_Format: Fa, RGBA_ASTC_6x5_Format: Oa, RGBA_ASTC_6x6_Format: Ba, RGBA_ASTC_8x5_Format: za, RGBA_ASTC_8x6_Format: ka, RGBA_ASTC_8x8_Format: Va, RGBA_BPTC_Format: Fs, RGBA_ETC2_EAC_Format: Da, RGBA_PVRTC_2BPPV1_Format: Pa, RGBA_PVRTC_4BPPV1_Format: Ra, RGBA_S3TC_DXT1_Format: Ds, RGBA_S3TC_DXT3_Format: Us, RGBA_S3TC_DXT5_Format: Ns, RGBDepthPacking: ep, RGBFormat: nc, RGBIntegerFormat: Kf, RGB_BPTC_SIGNED_Format: Za, RGB_BPTC_UNSIGNED_Format: Ja, RGB_ETC1_Format: Ia, RGB_ETC2_Format: La, RGB_PVRTC_2BPPV1_Format: Ca, RGB_PVRTC_4BPPV1_Format: Ta, RGB_S3TC_DXT1_Format: Ls, RGDepthPacking: np, RGFormat: rc, RGIntegerFormat: co, RawShaderMaterial: rf, Ray: hs, Raycaster: Ny, Rec709Primaries: Zs, RectAreaLight: wf, RedFormat: lo, RedIntegerFormat: cr, ReinhardToneMapping: nd, RenderTarget: Ed, RepeatWrapping: Gs, ReplaceStencilOp: sp, ReverseSubtractEquation: Ou, RingGeometry: Lo, SIGNED_RED_GREEN_RGTC2_Format: Qa, SIGNED_RED_RGTC1_Format: $a, SRGBColorSpace: Ke, SRGBTransfer: re, Scene: Bd, ShaderChunk: Vt, ShaderLib: sn, ShaderMaterial: an, ShadowMaterial: sf, Shape: bi, ShapeGeometry: Do, ShapePath: tM, ShapeUtils: pn, ShortType: jl, Skeleton: So, SkeletonHelper: Vy, SkinnedMesh: Hd, Source: _i, Sphere: Te, SphereGeometry: mr, Spherical: Fy, SphericalHarmonics3: Ef, SplineCurve: Ec, SpotLight: yf, SpotLightHelper: ky, Sprite: kd, SpriteMaterial: _c, SrcAlphaFactor: xa, SrcAlphaSaturateFactor: Zu, SrcColorFactor: Hu, StaticCopyUsage: Sp, StaticDrawUsage: $s, StaticReadUsage: vp, StereoCamera: fy, StreamCopyUsage: wp, StreamDrawUsage: xp, StreamReadUsage: Mp, StringKeyframeTrack: Ii, SubtractEquation: Fu, SubtractiveBlending: Nl, TOUCH: Wf, TangentSpaceNormalMap: Jn, TetrahedronGeometry: Uo, Texture: ue, TextureLoader: ry, TextureUtils: $x, TorusGeometry: No, TorusKnotGeometry: Fo, Triangle: ze, TriangleFanDrawMode: tp, TriangleStripDrawMode: jf, TrianglesDrawMode: Qf, TubeGeometry: Oo, UVMapping: so, Uint16BufferAttribute: uc, Uint32BufferAttribute: dc, Uint8BufferAttribute: cm, Uint8ClampedBufferAttribute: hm, Uniform: Nc, UniformsGroup: Ly, UniformsLib: ot, UniformsUtils: Cd, UnsignedByteType: mn, UnsignedInt248Type: Ei, UnsignedInt5999Type: tc, UnsignedIntType: Ln, UnsignedShort4444Type: ao, UnsignedShort5551Type: oo, UnsignedShortType: ss, VSMShadowMap: cn, Vector2: Z, Vector3: C, Vector4: Jt, VectorKeyframeTrack: sr, VideoTexture: _v, WebGL3DRenderTarget: Kp, WebGLArrayRenderTarget: $p, WebGLCoordinateSystem: dn, WebGLCubeRenderTarget: Pd, WebGLMultipleRenderTargets: nM, WebGLRenderTarget: rn, WebGLRenderer: av, WebGLUtils: Fd, WebGPUCoordinateSystem: Ks, WireframeGeometry: nf, WrapAroundEnding: qs, ZeroCurvatureEnding: mi, ZeroFactor: ku, ZeroSlopeEnding: gi, ZeroStencilOp: ip, createCanvasElement: bd }, Symbol.toStringTag, { value: "Module" })), iM = { background: 921878, grid: 4478062, axisArrow: 8947848, elementLine: 16777215, nodePoint: 16777215, resultOutline: "white", shellWall: 13395490, shellSlab: 4491468, shellTri: 6728294, shellOpacity: 0.35, textColor: "#bbbcc4", textBackground: "#0d0d0d", legendMarker: "white" }, sM = { background: 16054009, grid: 12173520, axisArrow: 4473924, elementLine: 1118481, nodePoint: 1118481, resultOutline: "#222", shellWall: 10044433, shellSlab: 2254506, shellTri: 4491332, shellOpacity: 0.3, textColor: "#111111", textBackground: "#e8e8e8", legendMarker: "#222" }, Uf = { dark: iM, light: sM };
let or = "dark";
const ma = [];
function lM() {
  return or;
}
function cM() {
  return Uf[or];
}
function rM(s) {
  if (s === or) return;
  or = s;
  const t = Uf[s];
  for (const e of ma) e(s, t);
}
function hM() {
  const s = or === "dark" ? "light" : "dark";
  return rM(s), s;
}
function uM(s) {
  return ma.push(s), () => {
    const t = ma.indexOf(s);
    t >= 0 && ma.splice(t, 1);
  };
}
export {
  Qy as $,
  js as A,
  Ht as B,
  fs as C,
  hn as D,
  Qd as E,
  wt as F,
  Po as G,
  Pt as H,
  us as I,
  No as J,
  Bd as K,
  _n as L,
  _e as M,
  ft as N,
  $t as O,
  Wn as P,
  wc as Q,
  Lo as R,
  mr as S,
  Wf as T,
  be as U,
  C as V,
  _o as W,
  av as X,
  bf as Y,
  Sf as Z,
  ts as _,
  hf as a,
  Xy as a0,
  Ue as a1,
  df as a2,
  lM as a3,
  uM as a4,
  hM as a5,
  Un as a6,
  an as a7,
  dc as a8,
  fn as a9,
  Le as aa,
  Qe as ab,
  qd as ac,
  vc as ad,
  To as ae,
  zt as af,
  Do as ag,
  Ze as ah,
  rM as ai,
  oM as aj,
  Ne as b,
  Ri as c,
  Zn as d,
  Ac as e,
  $n as f,
  Mv as g,
  ge as h,
  _c as i,
  kd as j,
  eM as k,
  Gf as l,
  Ve as m,
  Fy as n,
  Z as o,
  hs as p,
  Hp as q,
  cM as r,
  ue as s,
  Ny as t,
  zy as u,
  aM as v,
  Xd as w,
  ie as x,
  of as y,
  bi as z
};
