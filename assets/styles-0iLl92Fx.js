var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { N as G, r as Be, _ as We, L as Ue, B as ve, b as Ye, f as Xe, D as Ve, M as Ke, v as ue, F as pe, a4 as _e, a5 as Ge, a3 as qe } from "./theme-DQ--CgsI.js";
const Je = new G(16746496), Ze = new G(52428), $e = new G(52292), Se = new G(3377407), Te = new G(16763904);
function Ae(D, e) {
  const t = Math.abs(e[0] - D[0]), i = Math.abs(e[1] - D[1]), s = Math.abs(e[2] - D[2]);
  return s > t && s > i || i > t && i > s;
}
function Qe(D, e, t, i) {
  const s = [e[0] - D[0], e[1] - D[1], e[2] - D[2]], l = [i[0] - D[0], i[1] - D[1], i[2] - D[2]], r = s[1] * l[2] - s[2] * l[1], a = s[2] * l[0] - s[0] * l[2], h = s[0] * l[1] - s[1] * l[0], o = Math.sqrt(r * r + a * a + h * h);
  return o < 1e-12 ? false : Math.abs(h / o) < 0.5;
}
function fe(D) {
  return D <= 1e-3;
}
function et(D, e, t, i, s, l, r = 8) {
  const a = (A, O) => {
    const z = O ?? [0, 0, 0];
    return [A[0] + (z[0] || 0) * s, A[1] + (z[1] || 0) * s, A[2] + (z[2] || 0) * l];
  }, h = a(D, t), o = a(e, i), d = t && t.length >= 6 ? [t[3], t[4], t[5]] : null, u = i && i.length >= 6 ? [i[3], i[4], i[5]] : null;
  if (!d && !u) return [h, o];
  const p = [e[0] - D[0], e[1] - D[1], e[2] - D[2]], m = Math.hypot(p[0], p[1], p[2]);
  if (m < 1e-9) return [h, o];
  p[0] /= m, p[1] /= m, p[2] /= m;
  const f = Math.abs(p[2]) > 0.98 ? [0, 1, 0] : [0, 0, 1], w = (A, O) => [A[1] * O[2] - A[2] * O[1], A[2] * O[0] - A[0] * O[2], A[0] * O[1] - A[1] * O[0]];
  let b = w(f, p);
  const g = Math.hypot(b[0], b[1], b[2]) || 1;
  b = [b[0] / g, b[1] / g, b[2] / g];
  const y = w(p, b), v = (A, O) => A[0] * O[0] + A[1] * O[1] + A[2] * O[2], _ = (A) => {
    const O = A ?? [0, 0, 0];
    return [(O[0] || 0) * s, (O[1] || 0) * s, (O[2] || 0) * l];
  }, k = _(t), E = _(i), T = v(k, b), S = v(E, b), R = v(k, y), C = v(E, y), x = d ? v(d, y) * s : 0, $ = u ? v(u, y) * s : 0, I = d ? v(d, b) * s : 0, N = u ? v(u, b) * s : 0, H = v(k, p), B = v(E, p), j = [];
  for (let A = 0; A <= r; A++) {
    const O = A / r, z = 1 - 3 * O * O + 2 * O * O * O, M = m * (O - 2 * O * O + O * O * O), K = 3 * O * O - 2 * O * O * O, W = m * (-O * O + O * O * O), V = z * T + M * x + K * S + W * $, X = z * R - M * I + K * C - W * N, q = H + (B - H) * O, le = [D[0] + p[0] * (O * m + q), D[1] + p[1] * (O * m + q), D[2] + p[2] * (O * m + q)];
    j.push([le[0] + b[0] * V + y[0] * X, le[1] + b[1] * V + y[1] * X, le[2] + b[2] * V + y[2] * X]);
  }
  return j;
}
function xt(D, e, t) {
  const i = Be(), s = new We(), l = new Ue(new ve(), new Ye({ color: i.elementLine, vertexColors: false }));
  _e((u, p) => {
    l.material.color.setHex(p.elementLine);
  }), l.frustumCulled = false, l.renderOrder = 2, s.add(l);
  const r = new Xe({ vertexColors: true, transparent: true, opacity: i.shellOpacity, side: Ve, depthWrite: false, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }), a = new Ke(new ve(), r);
  a.frustumCulled = false, a.userData.isShellArea = true, a.name = "__hekatan_shell_area", s.add(a);
  let h = new G(i.shellWall), o = new G(i.shellSlab), d = new G(i.shellTri);
  return _e((u, p) => {
    h = new G(p.shellWall), o = new G(p.shellSlab), d = new G(p.shellTri), r.opacity = p.shellOpacity, r.needsUpdate = true;
  }), ue.derive(() => {
    var _a, _b, _c, _d, _e2, _f, _g, _h;
    if (e.deformedShape.val, e.elemColumns.val, e.elemBeams.val, (_a = e.elemFrames) == null ? void 0 : _a.val, (_b = e.elemZapatas) == null ? void 0 : _b.val, (_c = e.elemLosas) == null ? void 0 : _c.val, (_d = e.colorByType) == null ? void 0 : _d.val, !e.elements.val) return;
    const u = e.elemFrames ? e.elemFrames.rawVal : true, p = e.elemColumns.rawVal, m = e.elemBeams.rawVal, f = e.elemZapatas ? e.elemZapatas.rawVal : true, w = e.elemLosas ? e.elemLosas.rawVal : true, b = e.colorByType ? e.colorByType.rawVal : false, g = t.val, y = ((_e2 = D.elements) == null ? void 0 : _e2.val) || [], v = (C) => {
      if (C.length === 2) {
        if (!u) return false;
        const x = g[C[0]], $ = g[C[1]];
        return !x || !$ ? true : Ae(x, $) ? p : m;
      }
      if (C.length === 4) {
        const x = C.map((I) => g[I]).filter(Boolean);
        if (x.length < 4) return true;
        const $ = (x[0][2] + x[1][2] + x[2][2] + x[3][2]) / 4;
        return fe($) ? f : w;
      }
      if (C.length === 3) {
        const x = C.map((I) => g[I]).filter(Boolean);
        if (x.length < 3) return true;
        const $ = (x[0][2] + x[1][2] + x[2][2]) / 3;
        return fe($) ? f : w;
      }
      return true;
    }, _ = [], k = [];
    for (const C of y) {
      if (!v(C)) continue;
      let x = null;
      if (b) if (C.length === 2) {
        const $ = g[C[0]], I = g[C[1]];
        $ && I && (x = Ae($, I) ? Je : Ze);
      } else if (C.length === 4) {
        const $ = C.map((I) => g[I]).filter(Boolean);
        if ($.length === 4) {
          const I = ($[0][2] + $[1][2] + $[2][2] + $[3][2]) / 4;
          x = fe(I) ? $e : Se;
        }
      } else C.length === 3 && (x = Te);
      if (C.length === 2 && e.deformedShape.val) {
        const $ = ((_f = D.nodes) == null ? void 0 : _f.val) ?? [], I = (_h = (_g = D.deformOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.deformations, N = $[C[0]], H = $[C[1]];
        if (N && H && I) {
          const B = Number.isFinite(e.deformScale.val) ? e.deformScale.val : 1, j = B * (Number.isFinite(e.deformScaleZ.val) ? e.deformScaleZ.val : 1), A = et(N, H, I.get(C[0]), I.get(C[1]), B, j);
          for (let O = 0; O < A.length - 1; O++) _.push(...A[O], ...A[O + 1]), b && x && (k.push(x.r, x.g, x.b), k.push(x.r, x.g, x.b));
          continue;
        }
      }
      for (const $ of tt(C)) {
        const I = g[$[0]], N = g[$[1]];
        !I || !N || (_.push(...I, ...N), b && x && (k.push(x.r, x.g, x.b), k.push(x.r, x.g, x.b)));
      }
    }
    l.geometry.setAttribute("position", new pe(_, 3)), b && k.length === _.length ? (l.geometry.setAttribute("color", new pe(k, 3)), l.material.vertexColors = true, l.material.needsUpdate = true) : (l.geometry.deleteAttribute("color"), l.material.vertexColors = false, l.material.needsUpdate = true);
    const E = [], T = [], S = [], R = [];
    for (let C = 0; C < y.length; C++) {
      const x = y[C];
      if (v(x)) {
        if (x.length === 3) {
          const [$, I, N] = x;
          if (g[$] && g[I] && g[N]) {
            S.push(C), R.push(0), E.push(...g[$], ...g[I], ...g[N]);
            const H = b ? Te : d;
            for (let B = 0; B < 3; B++) T.push(H.r, H.g, H.b);
          }
        } else if (x.length === 4) {
          const [$, I, N, H] = x;
          if (g[$] && g[I] && g[N] && g[H]) {
            let B;
            if (b) {
              const j = (g[$][2] + g[I][2] + g[N][2] + g[H][2]) / 4;
              B = fe(j) ? $e : Se;
            } else B = Qe(g[$], g[I], g[N], g[H]) ? h : o;
            E.push(...g[$], ...g[I], ...g[N]), E.push(...g[$], ...g[N], ...g[H]), S.push(C, C), R.push(0, 1);
            for (let j = 0; j < 6; j++) T.push(B.r, B.g, B.b);
          }
        }
      }
    }
    a.userData.faceToElem = S, a.userData.faceLocal = R, E.length > 0 ? (a.geometry.dispose(), a.geometry = new ve(), a.geometry.setAttribute("position", new pe(E, 3)), a.geometry.setAttribute("color", new pe(T, 3)), a.geometry.computeVertexNormals(), a.visible = e.faces ? e.faces.rawVal : true) : a.visible = false;
  }), ue.derive(() => {
    s.visible = e.elements.val;
  }), ue.derive(() => {
    e.edges && (l.visible = e.edges.val);
  }), ue.derive(() => {
    var _a, _b;
    if (!e.faces) return;
    const u = e.faces.val, p = (((_a = e.shellResults) == null ? void 0 : _a.val) ?? "none") !== "none", m = (((_b = e.solidResults) == null ? void 0 : _b.val) ?? "none") !== "none", f = p || m;
    a.geometry.attributes.position ? a.visible = u && !f : u || (a.visible = false);
  }), s;
}
function tt(D) {
  if (D.length === 2) return [D];
  if (D.length === 8) {
    const t = D;
    return [[t[0], t[1]], [t[1], t[2]], [t[2], t[3]], [t[3], t[0]], [t[4], t[5]], [t[5], t[6]], [t[6], t[7]], [t[7], t[4]], [t[0], t[4]], [t[1], t[5]], [t[2], t[6]], [t[3], t[7]]];
  }
  const e = [];
  for (let t = 0; t < D.length; t++) e.push([D[t], D[(t + 1) % D.length]]);
  return e;
}
class Ee {
  constructor(e, t) {
    Object.assign(this, { type: t.type ?? null, detail: t, owner: e, target: t.target ?? null, phase: t.phase ?? "before", object: t.object ?? null, execute: null, isStopped: false, isCancelled: false, onComplete: null, listeners: [] }), delete t.type, delete t.target, delete t.object, this.complete = new Promise((i, s) => {
      this._resolve = i, this._reject = s;
    }), this.complete.catch(() => {
    });
  }
  finish(e) {
    e && c.extend(this.detail, e), this.phase = "after", this.owner.trigger.call(this.owner, this);
  }
  done(e) {
    this.listeners.push(e);
  }
  preventDefault() {
    this._reject(), this.isCancelled = true;
  }
  stopPropagation() {
    this.isStopped = true;
  }
}
class ie {
  constructor(e) {
    if (this.activeEvents = [], this.listeners = [], e !== void 0) {
      if (!c.checkName(e)) return;
      Z[e] = this;
    }
    this.debug = false;
  }
  on(e, t) {
    return (e = typeof e == "string" ? e.split(/[,\s]+/) : [e]).forEach((i) => {
      var s, l, r, a = typeof i == "string" ? i : i.type + ":" + i.execute + "." + i.scope;
      typeof i == "string" && ([l, s] = i.split("."), [l, r] = l.replace(":complete", ":after").replace(":done", ":after").split(":"), i = { type: l, execute: r ?? "before", scope: s }), (i = c.extend({ type: null, execute: "before", onComplete: null }, i)).type ? t ? (Array.isArray(this.listeners) || (this.listeners = []), this.listeners.push({ name: a, edata: i, handler: t }), this.debug && console.log("w2base: add event", { name: a, edata: i, handler: t })) : console.log("ERROR: You must specify event handler function when calling .on() method of " + this.name) : console.log("ERROR: You must specify event type when calling .on() method of " + this.name);
    }), this;
  }
  off(e, t) {
    return (e = typeof e == "string" ? e.split(/[,\s]+/) : [e]).forEach((i) => {
      var s, l, r, a = typeof i == "string" ? i : i.type + ":" + i.execute + "." + i.scope;
      if (typeof i == "string" && ([l, s] = i.split("."), [l, r] = l.replace(":complete", ":after").replace(":done", ":after").split(":"), i = { type: l || "*", execute: r || "", scope: s || "" }), (i = c.extend({ type: null, execute: null, onComplete: null }, i)).type || i.scope) {
        t = t || null;
        let h = 0;
        this.listeners = this.listeners.filter((o) => i.type !== "*" && i.type !== o.edata.type || i.execute !== "" && i.execute !== o.edata.execute || i.scope !== "" && i.scope !== o.edata.scope || i.handler != null && i.handler !== o.edata.handler || (h++, false)), this.debug && console.log(`w2base: remove event (${h})`, { name: a, edata: i, handler: t });
      } else console.log("ERROR: You must specify event type when calling .off() method of " + this.name);
    }), this;
  }
  trigger(e, t) {
    if (arguments.length == 1 ? t = e : (t.type = e, t.target = t.target ?? this), c.isPlainObject(t) && t.phase == "after") {
      if (!(t = this.activeEvents.find((r) => r.type == t.type && r.target == t.target))) return void console.log(`ERROR: Cannot find even handler for "${t.type}" on "${t.target}".`);
      console.log(`NOTICE: This syntax "edata.trigger({ phase: 'after' })" is outdated. Use edata.finish() instead.`);
    } else t instanceof Ee || (t = new Ee(this, t), this.activeEvents.push(t));
    let i, s, l;
    Array.isArray(this.listeners) || (this.listeners = []), this.debug && console.log(`w2base: trigger "${t.type}:${t.phase}"`, t);
    for (let r = this.listeners.length - 1; 0 <= r; r--) {
      let a = this.listeners[r];
      if (!(a == null || a.edata.type !== t.type && a.edata.type !== "*" || a.edata.target !== t.target && a.edata.target != null || a.edata.execute !== t.phase && a.edata.execute !== "*" && a.edata.phase !== "*") && (Object.keys(a.edata).forEach((h) => {
        t[h] == null && a.edata[h] != null && (t[h] = a.edata[h]);
      }), i = [], l = new RegExp(/\((.*?)\)/).exec(String(a.handler).split("=>")[0]), (i = l ? l[1].split(/\s*,\s*/) : i).length === 2 ? (a.handler.call(this, t.target, t), this.debug && console.log(" - call (old)", a.handler)) : (a.handler.call(this, t), this.debug && console.log(" - call", a.handler)), t.isStopped === true || t.stop === true)) return t;
    }
    if (e = "on" + t.type.substr(0, 1).toUpperCase() + t.type.substr(1), !(t.phase === "before" && typeof this[e] == "function" && (s = this[e], i = [], l = new RegExp(/\((.*?)\)/).exec(String(s).split("=>")[0]), (i = l ? l[1].split(/\s*,\s*/) : i).length === 2 ? (s.call(this, t.target, t), this.debug && console.log(" - call: on[Event] (old)", s)) : (s.call(this, t), this.debug && console.log(" - call: on[Event]", s)), t.isStopped === true || t.stop === true) || t.object != null && t.phase === "before" && typeof t.object[e] == "function" && (s = t.object[e], i = [], l = new RegExp(/\((.*?)\)/).exec(String(s).split("=>")[0]), (i = l ? l[1].split(/\s*,\s*/) : i).length === 2 ? (s.call(this, t.target, t), this.debug && console.log(" - call: edata.object (old)", s)) : (s.call(this, t), this.debug && console.log(" - call: edata.object", s)), t.isStopped === true || t.stop === true) || t.phase !== "after")) {
      typeof t.onComplete == "function" && t.onComplete.call(this, t);
      for (let r = 0; r < t.listeners.length; r++) typeof t.listeners[r] == "function" && (t.listeners[r].call(this, t), this.debug) && console.log(" - call: done", s);
      t._resolve(t), this.debug && console.log(`w2base: trigger "${t.type}:${t.phase}"`, t);
    }
    return t;
  }
}
const ye = { locale: "en-US", dateFormat: "m/d/yyyy", timeFormat: "hh:mi pm", datetimeFormat: "m/d/yyyy|hh:mi pm", currencyPrefix: "$", currencySuffix: "", currencyPrecision: 2, groupSymbol: ",", decimalSymbol: ".", shortmonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], fullmonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], shortdays: ["M", "T", "W", "T", "F", "S", "S"], fulldays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], weekStarts: "S", phrases: { "${count} letters or more...": "---", "Add new record": "---", "Add New": "---", "Advanced Search": "---", after: "---", "AJAX error. See console for more details.": "---", "All Fields": "---", All: "---", Any: "---", "Are you sure you want to delete ${count} ${records}?": "---", "Attach files by dragging and dropping or Click to Select": "---", before: "---", "begins with": "---", begins: "---", between: "---", buffered: "---", Cancel: "---", Close: "---", Column: "---", Confirmation: "---", contains: "---", Copied: "---", "Copy to clipboard": "---", "Current Date & Time": "---", "Delete selected records": "---", Delete: "---", 'Do you want to delete search item "${item}"?': "---", "Edit selected record": "---", Edit: "---", "Empty list": "---", "ends with": "---", ends: "---", "Field should be at least ${count} characters.": "---", Hide: "---", in: "---", "is not": "---", is: "---", "less than": "---", "Line #": "---", "Load ${count} more...": "---", "Loading...": "---", "Maximum number of files is ${count}": "---", "Maximum total size is ${count}": "---", Modified: "---", "more than": "---", "Multiple Fields": "---", Name: "---", "No items found": "---", "No matches": "---", No: "---", none: "---", "Not a float": "---", "Not a hex number": "---", "Not a valid date": "---", "Not a valid email": "---", "Not alpha-numeric": "---", "Not an integer": "---", "Not in money format": "---", "not in": "---", Notification: "---", of: "---", Ok: "---", Opacity: "---", "Record ID": "---", record: "---", records: "---", "Refreshing...": "---", "Reload data in the list": "---", Remove: "---", "Remove This Field": "---", "Request aborted.": "---", "Required field": "---", Reset: "---", "Restore Default State": "---", "Returned data is not in valid JSON format.": "---", "Save changed records": "---", "Save Grid State": "---", Save: "---", "Saved Searches": "---", "Saving...": "---", "Search took ${count} seconds": "---", Search: "---", "Select Hour": "---", "Select Minute": "---", selected: "---", "Server Response ${count} seconds": "---", "Show/hide columns": "---", Show: "---", Size: "---", Skip: "---", "Sorting took ${count} seconds": "---", "Type to search...": "---", Type: "---", Yes: "---", Yesterday: "---", "Your remote data source record count has changed, reloading from the first record.": "---" } };
const _P = class _P {
  constructor(e, t, i) {
    this.context = t ?? document, this.previous = i ?? null;
    let s = [];
    if (Array.isArray(e)) s = e;
    else if (e instanceof Node || e instanceof Window) s = [e];
    else if (e instanceof _P) s = e.nodes;
    else if (typeof e == "string") {
      if (typeof this.context.querySelector != "function") throw new Error("Invalid context");
      s = Array.from(this.context.querySelectorAll(e));
    } else if (e == null) s = [];
    else {
      if (t = Array.from(e ?? []), typeof e != "object" || !Array.isArray(t)) throw new Error(`Invalid selector "${e}"`);
      s = t;
    }
    this.nodes = s, this.length = s.length, this.each((l, r) => {
      this[r] = l;
    });
  }
  static _fragment(e) {
    let t = document.createElement("template");
    return t.innerHTML = e, t.content.childNodes.forEach((i) => {
      var s = _P._scriptConvert(i);
      s != i && t.content.replaceChild(s, i);
    }), t.content;
  }
  static _scriptConvert(e) {
    let t = (i) => {
      var s = i.ownerDocument.createElement("script"), l = (s.text = i.text, i.attributes);
      for (let r = 0; r < l.length; r++) s.setAttribute(l[r].name, l[r].value);
      return s;
    };
    return (e = e.tagName == "SCRIPT" ? t(e) : e).querySelectorAll && e.querySelectorAll("script").forEach((i) => {
      i.parentNode.replaceChild(t(i), i);
    }), e;
  }
  static _fixProp(e) {
    var t = { cellpadding: "cellPadding", cellspacing: "cellSpacing", class: "className", colspan: "colSpan", contenteditable: "contentEditable", for: "htmlFor", frameborder: "frameBorder", maxlength: "maxLength", readonly: "readOnly", rowspan: "rowSpan", tabindex: "tabIndex", usemap: "useMap" };
    return t[e] || e;
  }
  _insert(e, t) {
    let i = [], s = this.length;
    if (!(s < 1)) {
      let l = this;
      if (typeof t == "string") this.each((r) => {
        var a = _P._fragment(t);
        i.push(...a.childNodes), r[e](a);
      });
      else if (t instanceof _P) {
        let r = s == 1;
        t.each((a) => {
          this.each((h) => {
            var o = r ? a : a.cloneNode(true);
            i.push(o), h[e](o), _P._scriptConvert(o);
          });
        }), r || t.remove();
      } else {
        if (!(t instanceof Node)) throw new Error(`Incorrect argument for "${e}(html)". It expects one string argument.`);
        this.each((r) => {
          var a = s === 1 ? t : _P._fragment(t.outerHTML);
          i.push(...s === 1 ? [t] : a.childNodes), r[e](a);
        }), 1 < s && t.remove();
      }
      return l = e == "replaceWith" ? new _P(i, this.context, this) : l;
    }
  }
  _save(e, t, i) {
    e._mQuery = e._mQuery ?? {}, Array.isArray(i) ? (e._mQuery[t] = e._mQuery[t] ?? [], e._mQuery[t].push(...i)) : i != null ? e._mQuery[t] = i : delete e._mQuery[t];
  }
  get(e) {
    var t = this[e = e < 0 ? this.length + e : e];
    return t || (e != null ? null : this.nodes);
  }
  eq(e) {
    let t = [this[e = e < 0 ? this.length + e : e]];
    return t[0] == null && (t = []), new _P(t, this.context, this);
  }
  then(e) {
    return e = e(this), e ?? this;
  }
  find(e) {
    let t = [];
    return this.each((i) => {
      i = Array.from(i.querySelectorAll(e)), 0 < i.length && t.push(...i);
    }), new _P(t, this.context, this);
  }
  filter(e) {
    let t = [];
    return this.each((i) => {
      (i === e || typeof e == "string" && i.matches && i.matches(e) || typeof e == "function" && e(i)) && t.push(i);
    }), new _P(t, this.context, this);
  }
  next() {
    let e = [];
    return this.each((t) => {
      t = t.nextElementSibling, t && e.push(t);
    }), new _P(e, this.context, this);
  }
  prev() {
    let e = [];
    return this.each((t) => {
      t = t.previousElementSibling, t && e.push(t);
    }), new _P(e, this.context, this);
  }
  shadow(e) {
    let t = [];
    this.each((s) => {
      s.shadowRoot && t.push(s.shadowRoot);
    });
    var i = new _P(t, this.context, this);
    return e ? i.find(e) : i;
  }
  closest(e) {
    let t = [];
    return this.each((i) => {
      i = i.closest(e), i && t.push(i);
    }), new _P(t, this.context, this);
  }
  host(e) {
    let t = [], i = (l) => l.parentNode ? i(l.parentNode) : l, s = (l) => {
      l = i(l), t.push(l.host || l), l.host && e && s(l.host);
    };
    return this.each((l) => {
      s(l);
    }), new _P(t, this.context, this);
  }
  parent(e) {
    return this.parents(e, true);
  }
  parents(e, t) {
    let i = [], s = (r) => {
      if (i.indexOf(r) == -1 && i.push(r), !t && r.parentNode) return s(r.parentNode);
    };
    this.each((r) => {
      r.parentNode && s(r.parentNode);
    });
    var l = new _P(i, this.context, this);
    return e ? l.filter(e) : l;
  }
  add(e) {
    return e = e instanceof _P ? e.nodes : Array.isArray(e) ? e : [e], new _P(this.nodes.concat(e), this.context, this);
  }
  each(e) {
    return this.nodes.forEach((t, i) => {
      e(t, i, this);
    }), this;
  }
  append(e) {
    return this._insert("append", e);
  }
  prepend(e) {
    return this._insert("prepend", e);
  }
  after(e) {
    return this._insert("after", e);
  }
  before(e) {
    return this._insert("before", e);
  }
  replace(e) {
    return this._insert("replaceWith", e);
  }
  remove() {
    return this.each((e) => {
      e.remove();
    }), this;
  }
  css(e, t) {
    let i = e;
    var s, l = arguments.length;
    return l === 0 || l === 1 && typeof e == "string" ? this[0] ? (l = this[0].style, typeof e == "string" ? (s = l.getPropertyPriority(e), l.getPropertyValue(e) + (s ? "!" + s : "")) : Object.fromEntries(this[0].style.cssText.split(";").filter((r) => !!r).map((r) => r.split(":").map((a) => a.trim())))) : void 0 : (typeof e != "object" && ((i = {})[e] = t), this.each((r, a) => {
      Object.keys(i).forEach((h) => {
        var o = String(i[h]).toLowerCase().includes("!important") ? "important" : "";
        r.style.setProperty(h, String(i[h]).replace(/\!important/i, ""), o);
      });
    }), this);
  }
  addClass(e) {
    return this.toggleClass(e, true), this;
  }
  removeClass(e) {
    return this.toggleClass(e, false), this;
  }
  toggleClass(e, t) {
    return typeof e == "string" && (e = e.split(/[,\s]+/)), this.each((i) => {
      let s = e;
      (s = s == null && t === false ? Array.from(i.classList) : s).forEach((l) => {
        if (l !== "") {
          let r = t != null ? t ? "add" : "remove" : "toggle";
          i.classList[r](l);
        }
      });
    }), this;
  }
  hasClass(e) {
    if ((e = typeof e == "string" ? e.split(/[,\s]+/) : e) == null && 0 < this.length) return Array.from(this[0].classList);
    let t = false;
    return this.each((i) => {
      t = t || e.every((s) => Array.from(i.classList ?? []).includes(s));
    }), t;
  }
  on(e, t, i) {
    typeof t == "function" && (i = t, t = void 0);
    let s;
    return (t == null ? void 0 : t.delegate) && (s = t.delegate, delete t.delegate), (e = e.split(/[,\s]+/)).forEach((l) => {
      let [r, a] = String(l).toLowerCase().split(".");
      if (s) {
        let h = i;
        i = (o) => {
          var d = n(o.target).parents(s);
          0 < d.length ? o.delegate = d[0] : o.delegate = o.target, (o.target.matches(s) || 0 < d.length) && h(o);
        };
      }
      this.each((h) => {
        this._save(h, "events", [{ event: r, scope: a, callback: i, options: t }]), h.addEventListener(r, i, t);
      });
    }), this;
  }
  off(e, t, i) {
    return typeof t == "function" && (i = t, t = void 0), (e = (e ?? "").split(/[,\s]+/)).forEach((s) => {
      let [l, r] = String(s).toLowerCase().split(".");
      this.each((a) => {
        var _a;
        if (Array.isArray((_a = a._mQuery) == null ? void 0 : _a.events)) for (let o = a._mQuery.events.length - 1; 0 <= o; o--) {
          var h = a._mQuery.events[o];
          r == null || r === "" ? h.event != l && l !== "" || h.callback != i && i != null || (a.removeEventListener(h.event, h.callback, h.options), a._mQuery.events.splice(o, 1)) : h.event != l && l !== "" || h.scope != r || (a.removeEventListener(h.event, h.callback, h.options), a._mQuery.events.splice(o, 1));
        }
      });
    }), this;
  }
  trigger(e, t) {
    let i;
    return i = e instanceof Event || e instanceof CustomEvent ? e : new (["click", "dblclick", "mousedown", "mouseup", "mousemove"].includes(e) ? MouseEvent : ["keydown", "keyup", "keypress"].includes(e) ? KeyboardEvent : Event)(e, t), this.each((s) => {
      s.dispatchEvent(i);
    }), this;
  }
  attr(e, t) {
    if (t === void 0 && typeof e == "string") return this[0] ? this[0].getAttribute(e) : void 0;
    {
      let i = {};
      return typeof e == "object" ? i = e : i[e] = t, this.each((s) => {
        Object.entries(i).forEach(([l, r]) => {
          s.setAttribute(l, r);
        });
      }), this;
    }
  }
  removeAttr() {
    return this.each((e) => {
      Array.from(arguments).forEach((t) => {
        e.removeAttribute(t);
      });
    }), this;
  }
  prop(e, t) {
    if (t === void 0 && typeof e == "string") return this[0] ? this[0][e] : void 0;
    {
      let i = {};
      return typeof e == "object" ? i = e : i[e] = t, this.each((s) => {
        Object.entries(i).forEach(([l, r]) => {
          l = _P._fixProp(l), s[l] = r, l == "innerHTML" && _P._scriptConvert(s);
        });
      }), this;
    }
  }
  removeProp() {
    return this.each((e) => {
      Array.from(arguments).forEach((t) => {
        delete e[_P._fixProp(t)];
      });
    }), this;
  }
  data(e, t) {
    if (e instanceof Object) Object.entries(e).forEach((i) => {
      this.data(i[0], i[1]);
    });
    else {
      if (e && e.indexOf("-") != -1 && console.error(`Key "${e}" contains "-" (dash). Dashes are not allowed in property names. Use camelCase instead.`), !(arguments.length < 2)) return this.each((i) => {
        t != null ? i.dataset[e] = t instanceof Object ? JSON.stringify(t) : t : delete i.dataset[e];
      }), this;
      if (this[0]) {
        let i = Object.assign({}, this[0].dataset);
        return Object.keys(i).forEach((s) => {
          if (i[s].startsWith("[") || i[s].startsWith("{")) try {
            i[s] = JSON.parse(i[s]);
          } catch {
          }
        }), e ? i[e] : i;
      }
    }
  }
  removeData(e) {
    return typeof e == "string" && (e = e.split(/[,\s]+/)), this.each((t) => {
      e.forEach((i) => {
        delete t.dataset[i];
      });
    }), this;
  }
  show() {
    return this.toggle(true);
  }
  hide() {
    return this.toggle(false);
  }
  toggle(e) {
    return this.each((t) => {
      var _a;
      var i, s = t.style.display, l = getComputedStyle(t).display, r = s == "none" || l == "none";
      !r || e != null && e !== true || (i = t instanceof HTMLTableRowElement ? "table-row" : t instanceof HTMLTableCellElement ? "table-cell" : "block", t.style.display = ((_a = t._mQuery) == null ? void 0 : _a.prevDisplay) ?? (s == l && l != "none" ? "" : i), this._save(t, "prevDisplay", null)), r || e != null && e !== false || (l != "none" && this._save(t, "prevDisplay", l), t.style.setProperty("display", "none"));
    });
  }
  empty() {
    return this.html("");
  }
  html(e) {
    return this.prop("innerHTML", e);
  }
  text(e) {
    return this.prop("textContent", e);
  }
  val(e) {
    return this.prop("value", e);
  }
  change() {
    return this.trigger("change");
  }
  click() {
    return this.trigger("click");
  }
};
__publicField(_P, "version", 0.7);
let P = _P;
let n = function(D, e) {
  if (typeof D != "function") return new P(D, e);
  document.readyState == "complete" ? D() : window.addEventListener("load", D);
}, Z = (n.html = (D) => (D = P._fragment(D), n(D.children, D)), n.version = P.version, {});
class it {
  constructor() {
    this.version = "2.0.x", this.tmp = {}, this.settings = this.extend({}, { dataType: "HTTPJSON", dateStartYear: 1950, dateEndYear: 2030, macButtonOrder: false, warnNoPhrase: false }, ye, { phrases: null }), this.i18nCompare = Intl.Collator().compare, this.hasLocalStorage = function() {
      var e = "w2ui_test";
      try {
        return localStorage.setItem(e, e), localStorage.removeItem(e), true;
      } catch {
        return false;
      }
    }(), this.isMac = /Mac/i.test(navigator.platform), this.isMobile = /(iphone|ipod|ipad|mobile|android)/i.test(navigator.userAgent), this.isIOS = /(iphone|ipod|ipad)/i.test(navigator.platform), this.isAndroid = /(android)/i.test(navigator.userAgent), this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent), this.formatters = { number(e, t) {
      return 20 < parseInt(t) && (t = 20), parseInt(t) < 0 && (t = 0), e == null || e === "" ? "" : c.formatNumber(parseFloat(e), t, true);
    }, float(e, t) {
      return c.formatters.number(e, t);
    }, int(e, t) {
      return c.formatters.number(e, 0);
    }, money(e, t) {
      return e == null || e === "" ? "" : (e = c.formatNumber(Number(e), c.settings.currencyPrecision), (c.settings.currencyPrefix || "") + e + (c.settings.currencySuffix || ""));
    }, currency(e, t) {
      return c.formatters.money(e, t);
    }, percent(e, t) {
      return e == null || e === "" ? "" : c.formatNumber(e, t || 1) + "%";
    }, size(e, t) {
      return e == null || e === "" ? "" : c.formatSize(parseInt(e));
    }, date(e, t) {
      if (t === "" && (t = c.settings.dateFormat), e == null || e === 0 || e === "") return "";
      let i = c.isDateTime(e, t, true);
      return '<span title="' + (i = i === false ? c.isDate(e, t, true) : i) + '">' + c.formatDate(i, t) + "</span>";
    }, datetime(e, t) {
      if (t === "" && (t = c.settings.datetimeFormat), e == null || e === 0 || e === "") return "";
      let i = c.isDateTime(e, t, true);
      return '<span title="' + (i = i === false ? c.isDate(e, t, true) : i) + '">' + c.formatDateTime(i, t) + "</span>";
    }, time(e, t) {
      if (t === "" && (t = c.settings.timeFormat), e == null || e === 0 || e === "") return "";
      let i = c.isDateTime(e, t = (t = t === "h12" ? "hh:mi pm" : t) === "h24" ? "h24:mi" : t, true);
      return '<span title="' + (i = i === false ? c.isDate(e, t, true) : i) + '">' + c.formatTime(e, t) + "</span>";
    }, timestamp(e, t) {
      if (t === "" && (t = c.settings.datetimeFormat), e == null || e === 0 || e === "") return "";
      let i = c.isDateTime(e, t, true);
      return (i = i === false ? c.isDate(e, t, true) : i).toString ? i.toString() : "";
    }, gmt(e, t) {
      if (t === "" && (t = c.settings.datetimeFormat), e == null || e === 0 || e === "") return "";
      let i = c.isDateTime(e, t, true);
      return (i = i === false ? c.isDate(e, t, true) : i).toUTCString ? i.toUTCString() : "";
    }, age(e, t) {
      if (e == null || e === 0 || e === "") return "";
      let i = c.isDateTime(e, null, true);
      return '<span title="' + (i = i === false ? c.isDate(e, null, true) : i) + '">' + c.age(e) + (t ? " " + t : "") + "</span>";
    }, interval(e, t) {
      return e == null || e === 0 || e === "" ? "" : c.interval(e) + (t ? " " + t : "");
    }, toggle(e, t) {
      return e ? "Yes" : "";
    }, password(e, t) {
      let i = "";
      for (let s = 0; s < e.length; s++) i += "*";
      return i;
    } };
  }
  isBin(e) {
    return /^[0-1]+$/.test(e);
  }
  isInt(e) {
    return /^[-+]?[0-9]+$/.test(e);
  }
  isFloat(e) {
    return (typeof (e = typeof e == "string" ? e.replace(this.settings.groupSymbol, "").replace(this.settings.decimalSymbol, ".") : e) == "number" || typeof e == "string" && e !== "") && !isNaN(Number(e));
  }
  isMoney(e) {
    var t, i;
    return typeof e != "object" && e !== "" && (!!this.isFloat(e) || (t = this.settings, i = new RegExp("^" + (t.currencyPrefix ? "\\" + t.currencyPrefix + "?" : "") + "[-+]?" + (t.currencyPrefix ? "\\" + t.currencyPrefix + "?" : "") + "[0-9]*[\\" + t.decimalSymbol + "]?[0-9]+" + (t.currencySuffix ? "\\" + t.currencySuffix + "?" : "") + "$", "i"), typeof e == "string" && (e = e.replace(new RegExp(t.groupSymbol, "g"), "")), i.test(e)));
  }
  isHex(e) {
    return /^(0x)?[0-9a-fA-F]+$/.test(e);
  }
  isAlphaNumeric(e) {
    return /^[a-zA-Z0-9_-]+$/.test(e);
  }
  isEmail(e) {
    return /^[a-zA-Z0-9._%\-+]+@[а-яА-Яa-zA-Z0-9.-]+\.[а-яА-Яa-zA-Z]+$/.test(e);
  }
  isIpAddress(e) {
    return new RegExp("^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$").test(e);
  }
  isDate(e, t, i) {
    if (!e) return false;
    var s = "Invalid Date";
    let l, r, a;
    if (t == null && (t = this.settings.dateFormat), typeof e.getFullYear == "function") a = e.getFullYear(), l = e.getMonth() + 1, r = e.getDate();
    else if (parseInt(e) == e && 0 < parseInt(e)) e = new Date(parseInt(e)), a = e.getFullYear(), l = e.getMonth() + 1, r = e.getDate();
    else {
      if (e = String(e), new RegExp("mon", "ig").test(t)) {
        t = t.replace(/month/gi, "m").replace(/mon/gi, "m").replace(/dd/gi, "d").replace(/[, ]/gi, "/").replace(/\/\//g, "/").toLowerCase(), e = e.replace(/[, ]/gi, "/").replace(/\/\//g, "/").toLowerCase();
        for (let u = 0, p = this.settings.fullmonths.length; u < p; u++) {
          var h = this.settings.fullmonths[u];
          e = e.replace(new RegExp(h, "ig"), parseInt(u) + 1).replace(new RegExp(h.substr(0, 3), "ig"), parseInt(u) + 1);
        }
      }
      var o = e.replace(/-/g, "/").replace(/\./g, "/").toLowerCase().split("/"), t = t.replace(/-/g, "/").replace(/\./g, "/").toLowerCase();
      t === "mm/dd/yyyy" && (l = o[0], r = o[1], a = o[2]), t === "m/d/yyyy" && (l = o[0], r = o[1], a = o[2]), t === "dd/mm/yyyy" && (l = o[1], r = o[0], a = o[2]), t === "d/m/yyyy" && (l = o[1], r = o[0], a = o[2]), t === "yyyy/dd/mm" && (l = o[2], r = o[1], a = o[0]), t === "yyyy/d/m" && (l = o[2], r = o[1], a = o[0]), t === "yyyy/mm/dd" && (l = o[1], r = o[2], a = o[0]), t === "yyyy/m/d" && (l = o[1], r = o[2], a = o[0]), t === "mm/dd/yy" && (l = o[0], r = o[1], a = o[2]), t === "m/d/yy" && (l = o[0], r = o[1], a = parseInt(o[2]) + 1900), t === "dd/mm/yy" && (l = o[1], r = o[0], a = parseInt(o[2]) + 1900), t === "d/m/yy" && (l = o[1], r = o[0], a = parseInt(o[2]) + 1900), t === "yy/dd/mm" && (l = o[2], r = o[1], a = parseInt(o[0]) + 1900), t === "yy/d/m" && (l = o[2], r = o[1], a = parseInt(o[0]) + 1900), t === "yy/mm/dd" && (l = o[1], r = o[2], a = parseInt(o[0]) + 1900), t === "yy/m/d" && (l = o[1], r = o[2], a = parseInt(o[0]) + 1900);
    }
    return !!this.isInt(a) && !!this.isInt(l) && !!this.isInt(r) && (a = +a, l = +l, r = +r, (s = new Date(a, l - 1, r)).setFullYear(a), l != null) && String(s) !== "Invalid Date" && s.getMonth() + 1 === l && s.getDate() === r && s.getFullYear() === a && (i !== true || s);
  }
  isTime(a, t) {
    if (a == null) return false;
    let i, s, l;
    s = 0 <= (a = (a = String(a)).toUpperCase()).indexOf("AM");
    var r = (l = 0 <= a.indexOf("PM")) || s, a = (i = r ? 12 : 24, (a = a.replace("AM", "").replace("PM", "").trim()).split(":"));
    let h = parseInt(a[0] || 0), o = parseInt(a[1] || 0), d = parseInt(a[2] || 0);
    return (r && a.length === 1 || a.length === 2 || a.length === 3) && !(a[0] === "" || h < 0 || h > i || !this.isInt(a[0]) || 2 < a[0].length || 1 < a.length && (a[1] === "" || o < 0 || 59 < o || !this.isInt(a[1]) || a[1].length !== 2) || 2 < a.length && (a[2] === "" || d < 0 || 59 < d || !this.isInt(a[2]) || a[2].length !== 2) || !(r || i !== h || o === 0 && d === 0) || r && a.length === 1 && h === 0) && (t !== true || (l && h !== 12 && (h += 12), s && h === 12 && (h += 12), { hours: h, minutes: o, seconds: d }));
  }
  isDateTime(e, t, i) {
    var s;
    return typeof e.getFullYear == "function" ? i !== true || e : (s = parseInt(e)) === e ? !(s < 0) && (i !== true || new Date(s)) : (s = String(e).indexOf(" ")) < 0 ? !(String(e).indexOf("T") < 0 || String(new Date(e)) == "Invalid Date") && (i !== true || new Date(e)) : (t = (t = t ?? this.settings.datetimeFormat).split("|"), e = [e.substr(0, s), e.substr(s).trim()], t[0] = t[0].trim(), t[1] && (t[1] = t[1].trim()), s = this.isDate(e[0], t[0], true), t = this.isTime(e[1], true), s !== false && t !== false && (i !== true || (s.setHours(t.hours), s.setMinutes(t.minutes), s.setSeconds(t.seconds), s)));
  }
  age(e) {
    let t;
    if (e === "" || e == null || (t = typeof e.getFullYear == "function" ? e : parseInt(e) == e && 0 < parseInt(e) ? new Date(parseInt(e)) : new Date(e), String(t) === "Invalid Date")) return "";
    e = ((/* @__PURE__ */ new Date()).getTime() - t.getTime()) / 1e3;
    let i = "", s = "";
    return e < 0 ? (i = 0, s = "sec") : e < 60 ? (i = Math.floor(e), s = "sec", e < 0 && (i = 0, s = "sec")) : e < 3600 ? (i = Math.floor(e / 60), s = "min") : e < 86400 ? (i = Math.floor(e / 60 / 60), s = "hour") : e < 2592e3 ? (i = Math.floor(e / 24 / 60 / 60), s = "day") : e < 31536e3 ? (i = Math.floor(e / 30 / 24 / 60 / 60 * 10) / 10, s = "month") : e < 126144e3 ? (i = Math.floor(e / 365 / 24 / 60 / 60 * 10) / 10, s = "year") : 126144e3 <= e && (i = Math.floor(e / 365.25 / 24 / 60 / 60 * 10) / 10, s = "year"), i + " " + s + (1 < i ? "s" : "");
  }
  interval(e) {
    return e < 100 ? "< 0.01 sec" : e < 1e3 ? Math.floor(e / 10) / 100 + " sec" : e < 1e4 ? Math.floor(e / 100) / 10 + " sec" : e < 6e4 ? Math.floor(e / 1e3) + " secs" : e < 36e5 ? Math.floor(e / 6e4) + " mins" : e < 864e5 ? Math.floor(e / 36e5 * 10) / 10 + " hours" : e < 2628e6 ? Math.floor(e / 864e5 * 10) / 10 + " days" : e < 31536e6 ? Math.floor(e / 2628e6 * 10) / 10 + " months" : Math.floor(e / 31536e5) / 10 + " years";
  }
  date(l) {
    if (l === "" || l == null || typeof l == "object" && !l.getMonth) return "";
    let t = new Date(l);
    if (this.isInt(l) && (t = new Date(Number(l))), String(t) === "Invalid Date") return "";
    var l = this.settings.shortmonths, s = /* @__PURE__ */ new Date(), r = /* @__PURE__ */ new Date(), i = (r.setTime(r.getTime() - 864e5), l[t.getMonth()] + " " + t.getDate() + ", " + t.getFullYear()), s = l[s.getMonth()] + " " + s.getDate() + ", " + s.getFullYear(), l = l[r.getMonth()] + " " + r.getDate() + ", " + r.getFullYear(), r = t.getHours() - (12 < t.getHours() ? 12 : 0) + ":" + (t.getMinutes() < 10 ? "0" : "") + t.getMinutes() + " " + (12 <= t.getHours() ? "pm" : "am");
    let a = i == s ? r : i;
    return '<span title="' + i + " " + (t.getHours() - (12 < t.getHours() ? 12 : 0) + ":" + (t.getMinutes() < 10 ? "0" : "") + t.getMinutes() + ":" + (t.getSeconds() < 10 ? "0" : "") + t.getSeconds() + " " + (12 <= t.getHours() ? "pm" : "am")) + '">' + (a = i == l ? this.lang("Yesterday") : a) + "</span>";
  }
  formatSize(e) {
    var t;
    return this.isFloat(e) && e !== "" ? (e = parseFloat(e)) === 0 ? 0 : (t = parseInt(Math.floor(Math.log(e) / Math.log(1024))), (Math.floor(e / Math.pow(1024, t) * 10) / 10).toFixed(t === 0 ? 0 : 1) + " " + (["Bt", "KB", "MB", "GB", "TB", "PB", "EB", "ZB"][t] || "??")) : "";
  }
  formatNumber(e, t, i) {
    return e == null || e === "" || typeof e == "object" ? "" : (i = { minimumFractionDigits: parseInt(t), maximumFractionDigits: parseInt(t), useGrouping: !!i }, (t == null || t < 0) && (i.minimumFractionDigits = 0, i.maximumFractionDigits = 20), parseFloat(e).toLocaleString(this.settings.locale, i));
  }
  formatDate(e, t) {
    if (t = t || this.settings.dateFormat, e === "" || e == null || typeof e == "object" && !e.getMonth) return "";
    let i = new Date(e);
    var s, l;
    return this.isInt(e) && (i = new Date(Number(e))), String(i) === "Invalid Date" ? "" : (e = i.getFullYear(), s = i.getMonth(), l = i.getDate(), t.toLowerCase().replace("month", this.settings.fullmonths[s]).replace("mon", this.settings.shortmonths[s]).replace(/yyyy/g, ("000" + e).slice(-4)).replace(/yyy/g, ("000" + e).slice(-4)).replace(/yy/g, ("0" + e).slice(-2)).replace(/(^|[^a-z$])y/g, "$1" + e).replace(/mm/g, ("0" + (s + 1)).slice(-2)).replace(/dd/g, ("0" + l).slice(-2)).replace(/th/g, l == 1 ? "st" : "th").replace(/th/g, l == 2 ? "nd" : "th").replace(/th/g, l == 3 ? "rd" : "th").replace(/(^|[^a-z$])m/g, "$1" + (s + 1)).replace(/(^|[^a-z$])d/g, "$1" + l));
  }
  formatTime(e, t) {
    if (t = t || this.settings.timeFormat, e === "" || e == null || typeof e == "object" && !e.getMonth) return "";
    let i = new Date(e);
    if (this.isInt(e) && (i = new Date(Number(e))), this.isTime(e) && (e = this.isTime(e, true), (i = /* @__PURE__ */ new Date()).setHours(e.hours), i.setMinutes(e.minutes)), String(i) === "Invalid Date") return "";
    let s = "am", l = i.getHours();
    e = i.getHours();
    let r = i.getMinutes(), a = i.getSeconds();
    return r < 10 && (r = "0" + r), a < 10 && (a = "0" + a), t.indexOf("am") === -1 && t.indexOf("pm") === -1 || (12 <= l && (s = "pm"), 12 < l && (l -= 12), l === 0 && (l = 12)), t.toLowerCase().replace("am", s).replace("pm", s).replace("hhh", l < 10 ? "0" + l : l).replace("hh24", e < 10 ? "0" + e : e).replace("h24", e).replace("hh", l).replace("mm", r).replace("mi", r).replace("ss", a).replace(/(^|[^a-z$])h/g, "$1" + l).replace(/(^|[^a-z$])m/g, "$1" + r).replace(/(^|[^a-z$])s/g, "$1" + a);
  }
  formatDateTime(e, t) {
    let i;
    return e === "" || e == null || typeof e == "object" && !e.getMonth ? "" : (typeof t != "string" ? i = [this.settings.dateFormat, this.settings.timeFormat] : ((i = t.split("|"))[0] = i[0].trim(), i[1] = 1 < i.length ? i[1].trim() : this.settings.timeFormat), i[1] === "h12" && (i[1] = "h:m pm"), i[1] === "h24" && (i[1] = "h24:m"), this.formatDate(e, i[0]) + " " + this.formatTime(e, i[1]));
  }
  stripSpaces(e) {
    if (e != null) switch (typeof e) {
      case "number":
        break;
      case "string":
        e = String(e).replace(/(?:\r\n|\r|\n)/g, " ").replace(/\s\s+/g, " ").trim();
        break;
      case "object":
        Array.isArray(e) ? (e = this.extend([], e)).forEach((t, i) => {
          e[i] = this.stripSpaces(t);
        }) : (e = this.extend({}, e), Object.keys(e).forEach((t) => {
          e[t] = this.stripSpaces(e[t]);
        }));
    }
    return e;
  }
  stripTags(e) {
    if (e != null) switch (typeof e) {
      case "number":
        break;
      case "string":
        e = String(e).replace(/<(?:[^>=]|='[^']*'|="[^"]*"|=[^'"][^\s>]*)*>/gi, "");
        break;
      case "object":
        Array.isArray(e) ? (e = this.extend([], e)).forEach((t, i) => {
          e[i] = this.stripTags(t);
        }) : (e = this.extend({}, e), Object.keys(e).forEach((t) => {
          e[t] = this.stripTags(e[t]);
        }));
    }
    return e;
  }
  encodeTags(e) {
    if (e != null) switch (typeof e) {
      case "number":
        break;
      case "string":
        e = String(e).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
        break;
      case "object":
        Array.isArray(e) ? (e = this.extend([], e)).forEach((t, i) => {
          e[i] = this.encodeTags(t);
        }) : (e = this.extend({}, e), Object.keys(e).forEach((t) => {
          e[t] = this.encodeTags(e[t]);
        }));
    }
    return e;
  }
  decodeTags(e) {
    if (e != null) switch (typeof e) {
      case "number":
        break;
      case "string":
        e = String(e).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
        break;
      case "object":
        Array.isArray(e) ? (e = this.extend([], e)).forEach((t, i) => {
          e[i] = this.decodeTags(t);
        }) : (e = this.extend({}, e), Object.keys(e).forEach((t) => {
          e[t] = this.decodeTags(e[t]);
        }));
    }
    return e;
  }
  escapeId(e) {
    return e === "" || e == null ? "" : (e + "").replace(/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, (t, i) => i ? t === "\0" ? "\uFFFD" : t.slice(0, -1) + "\\" + t.charCodeAt(t.length - 1).toString(16) + " " : "\\" + t);
  }
  unescapeId(e) {
    return e === "" || e == null ? "" : e.replace(/\\[\da-fA-F]{1,6}[\x20\t\r\n\f]?|\\([^\r\n\f])/g, (t, i) => (t = "0x" + t.slice(1) - 65536, i || (t < 0 ? String.fromCharCode(65536 + t) : String.fromCharCode(t >> 10 | 55296, 1023 & t | 56320))));
  }
  base64encode(e) {
    return btoa(e);
  }
  base64decode(e) {
    return atob(e);
  }
  async sha256(e) {
    return e = new TextEncoder().encode(e), crypto.subtle.digest("SHA-256", e).then((t) => Array.from(new Uint8Array(t)).map((i) => i.toString(16).padStart(2, "0")).join(""));
  }
  transition(e, t, i, s) {
    return new Promise((l, r) => {
      var a = getComputedStyle(e);
      let h = parseInt(a.width), o = parseInt(a.height);
      if (e && t) {
        switch (e.parentNode.style.cssText += "perspective: 900px; overflow: hidden;", e.style.cssText += "; position: absolute; z-index: 1019; backface-visibility: hidden", t.style.cssText += "; position: absolute; z-index: 1020; backface-visibility: hidden", i) {
          case "slide-left":
            e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; transform: translate3d(" + h + "px, 0, 0)", n(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: translate3d(0, 0, 0)", e.style.cssText += "transition: 0.5s; transform: translate3d(-" + h + "px, 0, 0)";
            }, 1);
            break;
          case "slide-right":
            e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; transform: translate3d(-" + h + "px, 0, 0)", n(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: translate3d(0px, 0, 0)", e.style.cssText += "transition: 0.5s; transform: translate3d(" + h + "px, 0, 0)";
            }, 1);
            break;
          case "slide-down":
            e.style.cssText += "overflow: hidden; z-index: 1; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; z-index: 0; transform: translate3d(0, 0, 0)", n(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: translate3d(0, 0, 0)", e.style.cssText += "transition: 0.5s; transform: translate3d(0, " + o + "px, 0)";
            }, 1);
            break;
          case "slide-up":
            e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; transform: translate3d(0, " + o + "px, 0)", n(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: translate3d(0, 0, 0)", e.style.cssText += "transition: 0.5s; transform: translate3d(0, 0, 0)";
            }, 1);
            break;
          case "flip-left":
            e.style.cssText += "overflow: hidden; transform: rotateY(0deg)", t.style.cssText += "overflow: hidden; transform: rotateY(-180deg)", n(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: rotateY(0deg)", e.style.cssText += "transition: 0.5s; transform: rotateY(180deg)";
            }, 1);
            break;
          case "flip-right":
            e.style.cssText += "overflow: hidden; transform: rotateY(0deg)", t.style.cssText += "overflow: hidden; transform: rotateY(180deg)", n(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: rotateY(0deg)", e.style.cssText += "transition: 0.5s; transform: rotateY(-180deg)";
            }, 1);
            break;
          case "flip-down":
            e.style.cssText += "overflow: hidden; transform: rotateX(0deg)", t.style.cssText += "overflow: hidden; transform: rotateX(180deg)", n(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: rotateX(0deg)", e.style.cssText += "transition: 0.5s; transform: rotateX(-180deg)";
            }, 1);
            break;
          case "flip-up":
            e.style.cssText += "overflow: hidden; transform: rotateX(0deg)", t.style.cssText += "overflow: hidden; transform: rotateX(-180deg)", n(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: rotateX(0deg)", e.style.cssText += "transition: 0.5s; transform: rotateX(180deg)";
            }, 1);
            break;
          case "pop-in":
            e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(.8); opacity: 0;", n(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: scale(1); opacity: 1;", e.style.cssText += "transition: 0.5s;";
            }, 1);
            break;
          case "pop-out":
            e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(1); opacity: 1;", t.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); opacity: 0;", n(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; opacity: 1;", e.style.cssText += "transition: 0.5s; transform: scale(1.7); opacity: 0;";
            }, 1);
            break;
          default:
            e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; translate3d(0, 0, 0); opacity: 0;", n(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; opacity: 1;", e.style.cssText += "transition: 0.5s";
            }, 1);
        }
        setTimeout(() => {
          i === "slide-down" && (n(e).css("z-index", "1019"), n(t).css("z-index", "1020")), t && n(t).css({ opacity: "1" }).css({ transition: "", transform: "" }), e && n(e).css({ opacity: "1" }).css({ transition: "", transform: "" }), typeof s == "function" && s(), l();
        }, 500);
      } else console.log("ERROR: Cannot do transition when one of the divs is null");
    });
  }
  lock(e, t = {}) {
    if (e != null) {
      typeof t == "string" && (t = { msg: t }), arguments[2] && (t.spinner = arguments[2]), t = this.extend({ spinner: false }, t), (e == null ? void 0 : e[0]) instanceof Node && (e = Array.isArray(e) ? e : e.get()), t.msg || t.msg === 0 || (t.msg = ""), this.unlock(e);
      var i = n(e).get(0);
      let s = i.scrollWidth, l = i.scrollHeight, r = (i.tagName == "BODY" && (s < innerWidth && (s = innerWidth), l < innerHeight) && (l = innerHeight), n(e).prepend(`<div class="w2ui-lock" style="height: ${l}px; width: ${s}px"></div><div class="w2ui-lock-msg"></div>`), n(e).find(".w2ui-lock"));
      i = n(e).find(".w2ui-lock-msg"), e = (t.msg || i.css({ "background-color": "transparent", "background-image": "none", border: "0px", "box-shadow": "none" }), t.spinner === true && (t.msg = `<div class="w2ui-spinner" ${t.msg ? "" : 'style="width: 35px; height: 35px"'}></div>` + t.msg), t.msg ? i.html(t.msg).css("display", "block") : i.remove(), t.opacity != null && r.css("opacity", t.opacity), r.css({ display: "block" }), t.bgColor && r.css({ "background-color": t.bgColor }), getComputedStyle(r.get(0)));
      let a = e.opacity ?? 0.15;
      r.on("mousedown", function() {
        typeof t.onClick == "function" ? t.onClick() : r.css({ transition: ".2s", opacity: 1.5 * a });
      }).on("mouseup", function() {
        typeof t.onClick != "function" && r.css({ transition: ".2s", opacity: a });
      }).on("mousewheel", function(h) {
        h && (h.stopPropagation(), h.preventDefault());
      });
    }
  }
  unlock(e, t) {
    var i;
    e != null && (clearTimeout(e._prevUnlock), (e == null ? void 0 : e[0]) instanceof Node && (e = Array.isArray(e) ? e : e.get()), this.isInt(t) && 0 < t ? (n(e).find(".w2ui-lock").css({ transition: t / 1e3 + "s", opacity: 0 }), i = n(e).get(0), clearTimeout(i._prevUnlock), i._prevUnlock = setTimeout(() => {
      n(e).find(".w2ui-lock").remove();
    }, t)) : n(e).find(".w2ui-lock").remove(), n(e).find(".w2ui-lock-msg").remove());
  }
  message(e, t) {
    var _a, _b;
    let i, s, l;
    var r = () => {
      var _a2;
      var f = n(e == null ? void 0 : e.box).find(".w2ui-message");
      f.length != 0 && typeof ((_a2 = t = f.get(0)._msg_options || {}) == null ? void 0 : _a2.close) == "function" && t.close();
    };
    let a = (f) => {
      var _a2, _b2;
      var w, b = f.box._msg_prevFocus;
      n(e.box).find(".w2ui-message").length <= 1 ? e.owner ? e.owner.unlock(e.param, 150) : this.unlock(e.box, 150) : n(e.box).find(`#w2ui-message-${(_a2 = e.owner) == null ? void 0 : _a2.name}-` + (f.msgIndex - 1)).css("z-index", 1500), b ? 0 < (w = n(b).closest(".w2ui-message")).length ? w.get(0)._msg_options.setFocus(b) : b.focus() : typeof ((_b2 = e.owner) == null ? void 0 : _b2.focus) == "function" && e.owner.focus(), n(f.box).remove(), f.msgIndex === 0 && (m.css("z-index", f.tmp.zIndex), n(e.box).css("overflow", f.tmp.overflow)), f.trigger && l.finish();
    };
    if (typeof (t = typeof t != "string" && typeof t != "number" ? t : { width: String(t).length < 300 ? 350 : 550, height: String(t).length < 300 ? 170 : 250, text: String(t) }) != "object") return void r();
    t.text != null && (t.body = `<div class="w2ui-centered w2ui-msg-text">${t.text}</div>`), t.width == null && (t.width = 350), t.height == null && (t.height = 170), t.hideOn == null && (t.hideOn = ["esc"]), t.on == null && (d = t, t = new ie(), c.extend(t, d)), t.on("open", (f) => {
      c.bindEvents(n(t.box).find(".w2ui-eaction"), t), n(f.detail.box).find("button, input, textarea, [name=hidden-first]").off(".message").on("keydown.message", function(w) {
        w.keyCode == 27 && t.hideOn.includes("esc") && (t.cancelAction ? t.action(t.cancelAction) : t.close());
      }), setTimeout(() => t.setFocus(t.focus), 300);
    }), t.off(".prom");
    let h = { self: t, action(f) {
      return t.on("action.prom", f), h;
    }, close(f) {
      return t.on("close.prom", f), h;
    }, open(f) {
      return t.on("open.prom", f), h;
    }, then(f) {
      return t.on("open:after.prom", f), h;
    } }, o = (t.actions == null && t.buttons == null && t.html == null && (t.actions = { Ok(f) {
      f.detail.self.close();
    } }), t.off(".buttons"), t.actions != null && (t.buttons = "", Object.keys(t.actions).forEach((f) => {
      var w = t.actions[f];
      let b = f;
      typeof w == "function" && (t.buttons += `<button class="w2ui-btn w2ui-eaction" data-click='["action","${f}","event"]' name="${f}">${f}</button>`), typeof w == "object" && (t.buttons += `<button class="w2ui-btn w2ui-eaction ${w.class || ""}" name="${f}" data-click='["action","${f}","event"]'
                        style="${w.style ?? ""}" ${w.attrs ?? ""}>${w.text || f}</button>`, b = Array.isArray(t.actions) ? w.text : f), typeof w == "string" && (t.buttons += `<button class="w2ui-btn w2ui-eaction" name="${w}" data-click='["action","${w}","event"]'>${w}</button>`, b = w), typeof b == "string" && (b = b[0].toLowerCase() + b.substr(1).replace(/\s+/g, "")), h[b] = function(g) {
        return t.on("action.buttons", (y) => {
          y.detail.action[0].toLowerCase() + y.detail.action.substr(1).replace(/\s+/g, "") == b && g(y);
        }), h;
      };
    })), Array("html", "body", "buttons").forEach((f) => {
      t[f] = String(t[f] ?? "").trim();
    }), t.body === "" && t.buttons === "" || (t.html = `
                <div class="w2ui-message-body">${t.body || ""}</div>
                <div class="w2ui-message-buttons">${t.buttons || ""}</div>
            `), getComputedStyle(n(e.box).get(0)));
    var d = parseFloat(o.width), u = parseFloat(o.height);
    let p = 0, m = (0 < n(e.after).length && (o = getComputedStyle(n(e.after).get(0)), p = parseInt(o.display != "none" ? parseInt(o.height) : 0)), t.width > d && (t.width = d - 10), t.height > u - p && (t.height = u - 10 - p), t.originalWidth = t.width, t.originalHeight = t.height, parseInt(t.width) < 0 && (t.width = d + t.width), parseInt(t.width) < 10 && (t.width = 10), parseInt(t.height) < 0 && (t.height = u + t.height - p), parseInt(t.height) < 10 && (t.height = 10), t.originalHeight < 0 && (t.height = u + t.originalHeight - p), t.originalWidth < 0 && (t.width = d + 2 * t.originalWidth), n(e.box).find(e.after));
    return t.tmp || (t.tmp = { zIndex: m.css("z-index"), overflow: o.overflow }), t.html === "" && t.body === "" && t.buttons === "" ? r() : (t.msgIndex = n(e.box).find(".w2ui-message").length, t.msgIndex === 0 && typeof this.lock == "function" && (n(e.box).css("overflow", "hidden"), e.owner ? e.owner.lock(e.param) : this.lock(e.box)), n(e.box).find(".w2ui-message").css("z-index", 1390), m.css("z-index", 1501), u = `
                <div id="w2ui-message-${(_a = e.owner) == null ? void 0 : _a.name}-${t.msgIndex}" class="w2ui-message" data-mousedown="stop"
                    style="z-index: 1500; left: ${(d - t.width) / 2}px; top: ${p}px;
                        width: ${t.width}px; height: ${t.height}px; transform: translateY(-${t.height}px)"
                    ${t.hideOn.includes("click") ? e.param ? `data-click='["message", "${e.param}"]` : 'data-click="message"' : ""}>
                    <span name="hidden-first" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
                    ${t.html}
                    <span name="hidden-last" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
                </div>`, 0 < n(e.after).length ? n(e.box).find(e.after).after(u) : n(e.box).prepend(u), t.box = n(e.box).find(`#w2ui-message-${(_b = e.owner) == null ? void 0 : _b.name}-` + t.msgIndex)[0], c.bindEvents(t.box, this), n(t.box).addClass("animating"), (t.box._msg_options = t).box._msg_prevFocus = document.activeElement, setTimeout(() => {
      var _a2;
      (l = t.trigger("open", { target: this.name, box: t.box, self: t })).isCancelled === true ? (n(e.box).find(`#w2ui-message-${(_a2 = e.owner) == null ? void 0 : _a2.name}-` + t.msgIndex).remove(), t.msgIndex === 0 && (m.css("z-index", t.tmp.zIndex), n(e.box).css("overflow", t.tmp.overflow))) : n(t.box).css({ transition: "0.3s", transform: "translateY(0px)" });
    }, 0), s = setTimeout(() => {
      var _a2;
      n(e.box).find(`#w2ui-message-${(_a2 = e.owner) == null ? void 0 : _a2.name}-` + t.msgIndex).removeClass("animating").css({ transition: "0s" }), l.finish();
    }, 300)), t.action = (f, w) => {
      let b = t.actions[f];
      b instanceof Object && b.onClick && (b = b.onClick), f = t.trigger("action", { target: this.name, action: f, self: t, originalEvent: w, value: t.input ? t.input.value : null }), f.isCancelled !== true && (typeof b == "function" && b(f), f.finish());
    }, t.close = () => {
      var _a2;
      (l = t.trigger("close", { target: "self", box: t.box, self: t })).isCancelled !== true && (clearTimeout(s), n(t.box).hasClass("animating") ? (clearTimeout(i), a(t)) : (n(t.box).addClass("w2ui-closing animating").css({ transition: "0.15s", transform: "translateY(-" + t.height + "px)" }), t.msgIndex !== 0 && n(e.box).find(`#w2ui-message-${(_a2 = e.owner) == null ? void 0 : _a2.name}-` + (t.msgIndex - 1)).css("z-index", 1499), i = setTimeout(() => {
        a(t);
      }, 150)));
    }, t.setFocus = (f) => {
      var _a2, _b2;
      var w = n(e.box).find(".w2ui-message").length - 1;
      let b = n(e.box).find(`#w2ui-message-${(_a2 = e.owner) == null ? void 0 : _a2.name}-` + w), g = "input, button, select, textarea, [contentEditable], .w2ui-input";
      (_b2 = f != null ? isNaN(f) ? b.find(g).filter(f).get(0) : b.find(g).get(f) : b.find("[name=hidden-first]").get(0)) == null ? void 0 : _b2.focus(), n(e.box).find(".w2ui-message").find(g + ",[name=hidden-first],[name=hidden-last]").off(".keep-focus"), n(b).find(g + ",[name=hidden-first],[name=hidden-last]").on("blur.keep-focus", function(y) {
        setTimeout(() => {
          var _a3, _b3, _c;
          var v = document.activeElement, _ = 0 < n(b).find(g).filter(v).length, k = n(v).attr("name");
          !_ && v && v !== document.body && ((_a3 = n(b).find(g).get(0)) == null ? void 0 : _a3.focus()), k == "hidden-last" && ((_b3 = n(b).find(g).get(0)) == null ? void 0 : _b3.focus()), k == "hidden-first" && ((_c = n(b).find(g).get(-1)) == null ? void 0 : _c.focus());
        }, 1);
      });
    }, h;
  }
  notify(e, t) {
    return new Promise((i) => {
      if (typeof e == "object" && (e = (t = e).text), (t = t || {}).where = t.where ?? document.body, t.timeout = t.timeout ?? 15e3, typeof this.tmp.notify_resolve == "function" && (this.tmp.notify_resolve(), n(this.tmp.notify_where).find("#w2ui-notify").remove()), this.tmp.notify_resolve = i, this.tmp.notify_where = t.where, clearTimeout(this.tmp.notify_timer), e) {
        if (typeof t.actions == "object") {
          let l = {};
          Object.keys(t.actions).forEach((r) => {
            l[r] = `<a class="w2ui-notify-link" value="${r}">${r}</a>`;
          }), e = this.execTemplate(e, l);
        }
        var s = `
                    <div id="w2ui-notify">
                        <div class="${t.class} ${t.error ? "w2ui-notify-error" : ""}">
                            ${e}
                            <span class="w2ui-notify-close w2ui-icon-cross"></span>
                        </div>
                    </div>`;
        n(t.where).append(s), n(t.where).find("#w2ui-notify").find(".w2ui-notify-close").on("click", (l) => {
          n(t.where).find("#w2ui-notify").remove(), i();
        }), t.actions && n(t.where).find("#w2ui-notify .w2ui-notify-link").on("click", (l) => {
          l = n(l.target).attr("value"), t.actions[l](), n(t.where).find("#w2ui-notify").remove(), i();
        }), 0 < t.timeout && (this.tmp.notify_timer = setTimeout(() => {
          n(t.where).find("#w2ui-notify").remove(), i();
        }, t.timeout));
      }
    });
  }
  confirm(e, t) {
    return c.normButtons(t = typeof t == "string" ? { text: t } : t, { yes: "Yes", no: "No" }), e = c.message(e, t), e && e.action((i) => {
      i.detail.self.close();
    }), e;
  }
  normButtons(e, t) {
    e.actions = e.actions ?? {};
    var i = Object.keys(t);
    return i.forEach((s) => {
      var l = e["btn_" + s];
      l && (t[s] = { text: c.lang(l.text ?? ""), class: l.class ?? "", style: l.style ?? "", attrs: l.attrs ?? "" }, delete e["btn_" + s]), Array("text", "class", "style", "attrs").forEach((r) => {
        e[s + "_" + r] && (typeof t[s] == "string" && (t[s] = { text: t[s] }), t[s][r] = e[s + "_" + r], delete e[s + "_" + r]);
      });
    }), i.includes("yes") && i.includes("no") && (c.settings.macButtonOrder ? c.extend(e.actions, { no: t.no, yes: t.yes }) : c.extend(e.actions, { yes: t.yes, no: t.no })), i.includes("ok") && i.includes("cancel") && (c.settings.macButtonOrder ? c.extend(e.actions, { cancel: t.cancel, ok: t.ok }) : c.extend(e.actions, { ok: t.ok, cancel: t.cancel })), e;
  }
  getSize(e, t) {
    let i = 0;
    if (0 < (e = n(e)).length) {
      e = e[0];
      var s = getComputedStyle(e);
      switch (t) {
        case "width":
          i = parseFloat(s.width), s.width === "auto" && (i = 0);
          break;
        case "height":
          i = parseFloat(s.height), s.height === "auto" && (i = 0);
          break;
        default:
          i = parseFloat(s[t] ?? 0) || 0;
      }
    }
    return i;
  }
  getStrWidth(e, t) {
    return n("body").append(`
            <div id="_tmp_width" style="position: absolute; top: -9000px; ${t || ""}">
                ${this.encodeTags(e)}
            </div>`), t = n("#_tmp_width")[0].clientWidth, n("#_tmp_width").remove(), t;
  }
  execTemplate(e, t) {
    return typeof e == "string" && t && typeof t == "object" ? e.replace(/\${([^}]+)?}/g, function(i, s) {
      return t[s] || s;
    }) : e;
  }
  marker(e, t, i = { onlyFirst: false, wholeWord: false }) {
    Array.isArray(t) || (t = t != null && t !== "" ? [t] : []);
    let s = i.wholeWord;
    n(e).each((l) => {
      for (var r = l, a = /\<span class=\"w2ui\-marker\"\>((.|\n|\r)*)\<\/span\>/gi; r.innerHTML.indexOf('<span class="w2ui-marker"') !== -1; ) r.innerHTML = r.innerHTML.replace(a, "$1");
      t.forEach((h) => {
        h = (h = typeof h != "string" ? String(h) : h).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").replace(/&/g, "&amp;").replace(/</g, "&gt;").replace(/>/g, "&lt;"), h = new RegExp((s ? "\\b" : "") + h + (s ? "\\b" : "") + "(?!([^<]+)?>)", "i" + (i.onlyFirst ? "" : "g")), l.innerHTML = l.innerHTML.replace(h, (o) => '<span class="w2ui-marker">' + o + "</span>");
      });
    });
  }
  lang(e, t) {
    if (!e || this.settings.phrases == null || typeof e != "string" || "<=>=".includes(e)) return this.execTemplate(e, t);
    let i = this.settings.phrases[e];
    return i == null ? (i = e, this.settings.warnNoPhrase && (this.settings.missing || (this.settings.missing = {}), this.settings.missing[e] = "---", this.settings.phrases[e] = "---", console.log(`Missing translation for "%c${e}%c", see %c w2utils.settings.phrases %c with value "---"`, "color: orange", "", "color: #999", ""))) : i !== "---" || this.settings.warnNoPhrase || (i = e), i === "---" && (i = `<span ${this.tooltip(e)}>---</span>`), this.execTemplate(i, t);
  }
  locale(e, t, i) {
    return new Promise((s, l) => {
      if (Array.isArray(e)) {
        this.settings.phrases = {};
        let r = [], a = {};
        e.forEach((h, o) => {
          h.length === 5 && (h = "locale/" + h.toLowerCase() + ".json", e[o] = h), r.push(this.locale(h, true, false));
        }), Promise.allSettled(r).then((h) => {
          h.forEach((o) => {
            o.value && (a[o.value.file] = o.value.data);
          }), e.forEach((o) => {
            this.settings = this.extend({}, this.settings, a[o]);
          }), s();
        });
      } else (e = e || "en-us") instanceof Object ? this.settings = this.extend({}, this.settings, ye, e) : (e.length === 5 && (e = "locale/" + e.toLowerCase() + ".json"), fetch(e, { method: "GET" }).then((r) => r.json()).then((r) => {
        i !== true && (this.settings = t ? this.extend({}, this.settings, r) : this.extend({}, this.settings, ye, { phrases: {} }, r)), s({ file: e, data: r });
      }).catch((r) => {
        console.log("ERROR: Cannot load locale " + e), l(r);
      }));
    });
  }
  scrollBarSize() {
    return this.tmp.scrollBarSize || (n("body").append(`
            <div id="_scrollbar_width" style="position: absolute; top: -300px; width: 100px; height: 100px; overflow-y: scroll;">
                <div style="height: 120px">1</div>
            </div>
        `), this.tmp.scrollBarSize = 100 - n("#_scrollbar_width > div")[0].clientWidth, n("#_scrollbar_width").remove()), this.tmp.scrollBarSize;
  }
  checkName(e) {
    return e == null ? (console.log('ERROR: Property "name" is required but not supplied.'), false) : Z[e] != null ? (console.log(`ERROR: Object named "${e}" is already registered as w2ui.${e}.`), false) : !!this.isAlphaNumeric(e) || (console.log('ERROR: Property "name" has to be alpha-numeric (a-z, 0-9, dash and underscore).'), false);
  }
  checkUniqueId(e, t, i, s) {
    Array.isArray(t) || (t = [t]);
    let l = true;
    return t.forEach((r) => {
      r.id === e && (console.log(`ERROR: The item id="${e}" is not unique within the ${i} "${s}".`, t), l = false);
    }), l;
  }
  encodeParams(e, t = "") {
    let i = "";
    return Object.keys(e).forEach((s) => {
      i != "" && (i += "&"), typeof e[s] == "object" ? i += this.encodeParams(e[s], t + s + (t ? "]" : "") + "[") : i += "" + t + s + (t ? "]" : "") + "=" + e[s];
    }), i;
  }
  parseRoute(e) {
    let t = [];
    return e = e.replace(/\/\(/g, "(?:/").replace(/\+/g, "__plus__").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, (i, s, l, r, a, h) => (t.push({ name: r, optional: !!h }), s = s || "", (h ? "" : s) + "(?:" + (h ? s : "") + (l || "") + (a || (l ? "([^/.]+?)" : "([^/]+?)")) + ")" + (h || ""))).replace(/([\/.])/g, "\\$1").replace(/__plus__/g, "(.+)").replace(/\*/g, "(.*)"), { path: new RegExp("^" + e + "$", "i"), keys: t };
  }
  getCursorPosition(e) {
    if (e == null) return null;
    let t = 0;
    var i, s = e.ownerDocument || e.document, l = s.defaultView || s.parentWindow;
    let r;
    return ["INPUT", "TEXTAREA"].includes(e.tagName) ? t = e.selectionStart : l.getSelection ? 0 < (r = l.getSelection()).rangeCount && ((i = (l = r.getRangeAt(0)).cloneRange()).selectNodeContents(e), i.setEnd(l.endContainer, l.endOffset), t = i.toString().length) : (r = s.selection) && r.type !== "Control" && (l = r.createRange(), (i = s.body.createTextRange()).moveToElementText(e), i.setEndPoint("EndToEnd", l), t = i.text.length), t;
  }
  setCursorPosition(e, t, i) {
    if (e != null) {
      var s = document.createRange();
      let l, r = window.getSelection();
      if (["INPUT", "TEXTAREA"].includes(e.tagName)) e.setSelectionRange(t, i ?? t);
      else {
        for (let a = 0; a < e.childNodes.length; a++) {
          let h = n(e.childNodes[a]).text();
          if (t <= (h = e.childNodes[a].tagName ? (h = n(e.childNodes[a]).html()).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ") : h).length) {
            (l = (l = e.childNodes[a]).childNodes && 0 < l.childNodes.length ? l.childNodes[0] : l).childNodes && 0 < l.childNodes.length && (l = l.childNodes[0]);
            break;
          }
          t -= h.length;
        }
        l != null && (t > l.length && (t = l.length), s.setStart(l, t), i ? s.setEnd(l, i) : s.collapse(true), r.removeAllRanges(), r.addRange(s));
      }
    }
  }
  parseColor(e) {
    if (typeof e != "string") return null;
    let t = {};
    if ((e = (e = e.trim().toUpperCase())[0] === "#" ? e.substr(1) : e).length === 3) t = { r: parseInt(e[0] + e[0], 16), g: parseInt(e[1] + e[1], 16), b: parseInt(e[2] + e[2], 16), a: 1 };
    else if (e.length === 6) t = { r: parseInt(e.substr(0, 2), 16), g: parseInt(e.substr(2, 2), 16), b: parseInt(e.substr(4, 2), 16), a: 1 };
    else if (e.length === 8) t = { r: parseInt(e.substr(0, 2), 16), g: parseInt(e.substr(2, 2), 16), b: parseInt(e.substr(4, 2), 16), a: Math.round(parseInt(e.substr(6, 2), 16) / 255 * 100) / 100 };
    else if (4 < e.length && e.substr(0, 4) === "RGB(") {
      var i = e.replace("RGB", "").replace(/\(/g, "").replace(/\)/g, "").split(",");
      t = { r: parseInt(i[0], 10), g: parseInt(i[1], 10), b: parseInt(i[2], 10), a: 1 };
    } else {
      if (!(5 < e.length && e.substr(0, 5) === "RGBA(")) return null;
      i = e.replace("RGBA", "").replace(/\(/g, "").replace(/\)/g, "").split(","), t = { r: parseInt(i[0], 10), g: parseInt(i[1], 10), b: parseInt(i[2], 10), a: parseFloat(i[3]) };
    }
    return t;
  }
  hsv2rgb(e, t, i, s) {
    let l, r, a, h, o, d, u, p;
    switch (arguments.length === 1 && (t = e.s, i = e.v, s = e.a, e = e.h), d = (i /= 100) * (1 - (t /= 100)), u = i * (1 - (o = 6 * (e /= 360) - (h = Math.floor(6 * e))) * t), p = i * (1 - (1 - o) * t), h % 6) {
      case 0:
        l = i, r = p, a = d;
        break;
      case 1:
        l = u, r = i, a = d;
        break;
      case 2:
        l = d, r = i, a = p;
        break;
      case 3:
        l = d, r = u, a = i;
        break;
      case 4:
        l = p, r = d, a = i;
        break;
      case 5:
        l = i, r = d, a = u;
    }
    return { r: Math.round(255 * l), g: Math.round(255 * r), b: Math.round(255 * a), a: s ?? 1 };
  }
  rgb2hsv(e, t, i, s) {
    arguments.length === 1 && (t = e.g, i = e.b, s = e.a, e = e.r);
    let l = Math.max(e, t, i), r = Math.min(e, t, i), a = l - r, h, o = l === 0 ? 0 : a / l, d = l / 255;
    switch (l) {
      case r:
        h = 0;
        break;
      case e:
        h = t - i + a * (t < i ? 6 : 0), h /= 6 * a;
        break;
      case t:
        h = i - e + 2 * a, h /= 6 * a;
        break;
      case i:
        h = e - t + 4 * a, h /= 6 * a;
    }
    return { h: Math.round(360 * h), s: Math.round(100 * o), v: Math.round(100 * d), a: s ?? 1 };
  }
  tooltip(e, t) {
    let i = "mouseenter", s = "mouseleave";
    return t = (t = typeof e == "object" ? e : t) || {}, typeof e == "string" && (t.html = e), t.showOn && (i = t.showOn, delete t.showOn), t.hideOn && (s = t.hideOn, delete t.hideOn), t.name || (t.name = "no-name"), ` on${i}="w2tooltip.show(this, JSON.parse(w2utils.base64decode('${this.base64encode(JSON.stringify(t))}')))" on${s}="w2tooltip.hide('${t.name}')"`;
  }
  isPlainObject(e) {
    return e != null && Object.prototype.toString.call(e) === "[object Object]" && (e.constructor === void 0 || (e = Object.getPrototypeOf(e)) === null || e === Object.prototype);
  }
  clone(e, t) {
    let i;
    return t = Object.assign({ functions: true, elements: true, events: true, exclude: [] }, t ?? {}), Array.isArray(e) ? (i = Array.from(e)).forEach((s, l) => {
      i[l] = this.clone(s, t);
    }) : this.isPlainObject(e) ? (i = {}, Object.assign(i, e), t.exclude && t.exclude.forEach((s) => {
      delete i[s];
    }), Object.keys(i).forEach((s) => {
      i[s] = this.clone(i[s], t), i[s] === void 0 && delete i[s];
    })) : e instanceof Function && !t.functions || e instanceof Node && !t.elements || e instanceof Event && !t.events || (i = e), i;
  }
  extend(e, t) {
    if (Array.isArray(e)) {
      if (!Array.isArray(t)) throw new Error("Arrays can be extended with arrays only");
      e.splice(0, e.length), t.forEach((i) => {
        e.push(this.clone(i));
      });
    } else {
      if (e instanceof Node || e instanceof Event) throw new Error("HTML elmenents and events cannot be extended");
      if (e && typeof e == "object" && t != null) {
        if (typeof t != "object") throw new Error("Object can be extended with other objects only.");
        Object.keys(t).forEach((i) => {
          var s;
          e[i] != null && typeof e[i] == "object" && t[i] != null && typeof t[i] == "object" ? (s = this.clone(t[i]), e[i] instanceof Node || e[i] instanceof Event ? e[i] = s : (Array.isArray(e[i]) && this.isPlainObject(s) && (e[i] = {}), this.extend(e[i], s))) : e[i] = this.clone(t[i]);
        });
      } else if (t != null) throw new Error("Object is not extendable, only {} or [] can be extended.");
    }
    if (2 < arguments.length) for (let i = 2; i < arguments.length; i++) this.extend(e, arguments[i]);
    return e;
  }
  naturalCompare(e, t) {
    let i, s, l = 1, r = 0, a = 0, h = String.alphabet;
    function o(d, u, p) {
      if (p) {
        for (i = u; (p = o(d, i)) < 76 && 65 < p; ) ++i;
        return +d.slice(u - 1, i);
      }
      return -1 < (p = h && h.indexOf(d.charAt(u))) ? p + 76 : (p = d.charCodeAt(u) || 0) < 45 || 127 < p ? p : p < 46 ? 65 : p < 48 ? p - 1 : p < 58 ? p + 18 : p < 65 ? p - 11 : p < 91 ? p + 11 : p < 97 ? p - 37 : p < 123 ? p + 5 : p - 63;
    }
    if ((e += "") != (t += "")) {
      for (; l; ) if (s = o(e, r++), l = o(t, a++), s < 76 && l < 76 && 66 < s && 66 < l && (s = o(e, r, r), l = o(t, a, r = i), a = i), s != l) return s < l ? -1 : 1;
    }
    return 0;
  }
  normMenu(e, t) {
    return Array.isArray(e) ? (e.forEach((i, s) => {
      typeof i == "string" || typeof i == "number" ? e[s] = { id: i, text: String(i) } : i != null ? (i.caption != null && i.text == null && (i.text = i.caption), i.text != null && i.id == null && (i.id = i.text), i.text == null && i.id != null && (i.text = i.id)) : e[s] = { id: null, text: "null" };
    }), e) : typeof e == "function" ? (t = e.call(this, e, t), c.normMenu.call(this, t)) : typeof e == "object" ? Object.keys(e).map((i) => ({ id: i, text: e[i] })) : void 0;
  }
  prepareParams(e, t, i) {
    i = i ?? c.settings.dataType;
    let s = t.body;
    switch (i) {
      case "HTTPJSON":
        s = { request: s }, ["PUT", "DELETE"].includes(t.method) && (t.method = "POST"), l();
        break;
      case "HTTP":
        ["PUT", "DELETE"].includes(t.method) && (t.method = "POST"), l();
        break;
      case "RESTFULL":
        ["PUT", "DELETE"].includes(t.method) ? t.headers["Content-Type"] = "application/json" : l();
        break;
      case "JSON":
        t.method == "GET" ? (s = { request: s }, l()) : (t.headers["Content-Type"] = "application/json", t.method = "POST");
    }
    return t.body = typeof t.body == "string" ? t.body : JSON.stringify(t.body), t;
    function l() {
      Object.keys(s).forEach((r) => {
        let a = s[r];
        typeof a == "object" && (a = JSON.stringify(a)), e.searchParams.append(r, a);
      }), delete t.body;
    }
  }
  bindEvents(e, t) {
    e.length != 0 && ((e == null ? void 0 : e[0]) instanceof Node && (e = Array.isArray(e) ? e : e.get()), n(e).each((i) => {
      let s = n(i).data();
      Object.keys(s).forEach((l) => {
        if (["click", "dblclick", "mouseenter", "mouseleave", "mouseover", "mouseout", "mousedown", "mousemove", "mouseup", "contextmenu", "focus", "focusin", "focusout", "blur", "input", "change", "keydown", "keyup", "keypress"].indexOf(String(l).toLowerCase()) != -1) {
          let r = s[l], a = (r = typeof r == "string" ? r.split("|").map((h) => {
            (h = (h = (h = h === "true" ? true : h) === "false" ? false : h) === "undefined" ? void 0 : h) === "null" && (h = null);
            var o = ["'", '"', "`"];
            return h = typeof (h = parseFloat(h) == h ? parseFloat(h) : h) == "string" && o.includes(h[0]) && o.includes(h[h.length - 1]) ? h.substring(1, h.length - 1) : h;
          }) : r)[0];
          r = r.slice(1), n(i).off(l + ".w2utils-bind").on(l + ".w2utils-bind", function(h) {
            switch (a) {
              case "alert":
                alert(r[0]);
                break;
              case "stop":
                h.stopPropagation();
                break;
              case "prevent":
                h.preventDefault();
                break;
              case "stopPrevent":
                return h.stopPropagation(), h.preventDefault(), false;
              default:
                if (t[a] == null) throw new Error(`Cannot dispatch event as the method "${a}" does not exist.`);
                t[a].apply(t, r.map((o, d) => {
                  switch (String(o).toLowerCase()) {
                    case "event":
                      return h;
                    case "this":
                      return this;
                    default:
                      return o;
                  }
                }));
            }
          });
        }
      });
    }));
  }
  debounce(e, t = 250) {
    let i;
    return (...s) => {
      clearTimeout(i), i = setTimeout(() => {
        e(...s);
      }, t);
    };
  }
}
var c = new it();
class st extends ie {
  constructor() {
    super(), this.defaults = { title: "", text: "", body: "", buttons: "", width: 450, height: 250, focus: null, actions: null, style: "", speed: 0.3, modal: false, maximized: false, keyboard: true, showClose: true, showMax: false, transition: null, openMaximized: false, moved: false }, this.name = "popup", this.status = "closed", this.onOpen = null, this.onClose = null, this.onMax = null, this.onMin = null, this.onToggle = null, this.onKeydown = null, this.onAction = null, this.onMove = null, this.tmp = {}, this.handleResize = (e) => {
      this.options.moved || this.center(void 0, void 0, true);
    };
  }
  open(e) {
    let t = this;
    this.status != "closing" && !n("#w2ui-popup").hasClass("animating") || this.close(true);
    var i = this.options;
    (e = ["string", "number"].includes(typeof e) ? c.extend({ title: "Notification", body: `<div class="w2ui-centered">${e}</div>`, actions: { Ok() {
      t.close();
    } }, cancelAction: "ok" }, arguments[1] ?? {}) : e).text != null && (e.body = `<div class="w2ui-centered w2ui-msg-text">${e.text}</div>`), e = Object.assign({}, this.defaults, i, { title: "", body: "" }, e, { maximized: false }), this.options = e, n("#w2ui-popup").length === 0 && (this.off("*"), Object.keys(this).forEach((d) => {
      d.startsWith("on") && d != "on" && (this[d] = null);
    })), Object.keys(e).forEach((d) => {
      d.startsWith("on") && d != "on" && e[d] && (this[d] = e[d]);
    }), e.width = parseInt(e.width), e.height = parseInt(e.height);
    let s, l, r;
    var { top: a, left: h } = this.center();
    let o = { self: this, action(d) {
      return t.on("action.prom", d), o;
    }, close(d) {
      return t.on("close.prom", d), o;
    }, then(d) {
      return t.on("open:after.prom", d), o;
    } };
    if (e.actions == null || e.buttons || (e.buttons = "", Object.keys(e.actions).forEach((d) => {
      var u = e.actions[d];
      let p = d;
      typeof u == "function" && (e.buttons += `<button class="w2ui-btn w2ui-eaction" data-click='["action","${d}","event"]'>${d}</button>`), typeof u == "object" && (e.buttons += `<button class="w2ui-btn w2ui-eaction ${u.class || ""}" name="${d}" data-click='["action","${d}","event"]'
                        style="${u.style}" ${u.attrs}>${u.text || d}</button>`, p = Array.isArray(e.actions) ? u.text : d), typeof u == "string" && (e.buttons += `<button class="w2ui-btn w2ui-eaction" data-click='["action","${u}","event"]'>${u}</button>`, p = u), typeof p == "string" && (p = p[0].toLowerCase() + p.substr(1).replace(/\s+/g, "")), o[p] = function(m) {
        return t.on("action.buttons", (f) => {
          f.detail.action[0].toLowerCase() + f.detail.action.substr(1).replace(/\s+/g, "") == p && m(f);
        }), o;
      };
    })), n("#w2ui-popup").length === 0) {
      if ((s = this.trigger("open", { target: "popup", present: false })).isCancelled === true) return;
      this.status = "opening", c.lock(document.body, { opacity: 0.3, onClick: e.modal ? null : () => {
        this.close();
      } });
      let d = "";
      e.showClose && (d += `<div class="w2ui-popup-button w2ui-popup-close">
                            <span class="w2ui-icon w2ui-icon-cross w2ui-eaction" data-mousedown="stop" data-click="close"></span>
                        </div>`), e.showMax && (d += `<div class="w2ui-popup-button w2ui-popup-max">
                            <span class="w2ui-icon w2ui-icon-box w2ui-eaction" data-mousedown="stop" data-click="toggle"></span>
                        </div>`), h = `
                left: ${h}px;
                top: ${a}px;
                width: ${parseInt(e.width)}px;
                height: ${parseInt(e.height)}px;
                transition: ${e.speed}s
            `, l = `<div id="w2ui-popup" class="w2ui-popup w2ui-anim-open animating" style="${c.stripSpaces(h)}"></div>`, n("body").append(l), n("#w2ui-popup")[0]._w2popup = { self: this, created: new Promise((u) => {
        this._promCreated = u;
      }), opened: new Promise((u) => {
        this._promOpened = u;
      }), closing: new Promise((u) => {
        this._promClosing = u;
      }), closed: new Promise((u) => {
        this._promClosed = u;
      }) }, h = `${e.title ? "" : "top: 0px !important;"} ` + (e.buttons ? "" : "bottom: 0px !important;"), l = `
                <span name="hidden-first" tabindex="0" style="position: absolute; top: -100px"></span>
                <div class="w2ui-popup-title-btns">${d}</div>
                <div class="w2ui-popup-title" style="${e.title ? "" : "display: none"}"></div>
                <div class="w2ui-box" style="${h}">
                    <div class="w2ui-popup-body ${!e.title || " w2ui-popup-no-title"}
                        ${!e.buttons || " w2ui-popup-no-buttons"}" style="${e.style}">
                    </div>
                </div>
                <div class="w2ui-popup-buttons" style="${e.buttons ? "" : "display: none"}"></div>
                <span name="hidden-last" tabindex="0" style="position: absolute; top: -100px"></span>
            `, n("#w2ui-popup").html(l), e.title && n("#w2ui-popup .w2ui-popup-title").append(c.lang(e.title)), e.buttons && n("#w2ui-popup .w2ui-popup-buttons").append(e.buttons), e.body && n("#w2ui-popup .w2ui-popup-body").append(e.body), setTimeout(() => {
        n("#w2ui-popup").css("transition", e.speed + "s").removeClass("w2ui-anim-open"), c.bindEvents("#w2ui-popup .w2ui-eaction", this), n("#w2ui-popup").find(".w2ui-popup-body").show(), this._promCreated();
      }, 1), clearTimeout(this._timer), this._timer = setTimeout(() => {
        this.status = "open", t.setFocus(e.focus), s.finish(), this._promOpened(), n("#w2ui-popup").removeClass("animating");
      }, 1e3 * e.speed);
    } else {
      if ((s = this.trigger("open", { target: "popup", present: true })).isCancelled === true) return;
      this.status = "opening", i != null && (i.maximized || i.width == e.width && i.height == e.height || this.resize(e.width, e.height), e.prevSize = e.width + "px:" + e.height + "px", e.maximized = i.maximized), a = n("#w2ui-popup .w2ui-box").get(0).cloneNode(true), n(a).removeClass("w2ui-box").addClass("w2ui-box-temp").find(".w2ui-popup-body").empty().append(e.body), n("#w2ui-popup .w2ui-box").after(a), e.buttons ? (n("#w2ui-popup .w2ui-popup-buttons").show().html("").append(e.buttons), n("#w2ui-popup .w2ui-popup-body").removeClass("w2ui-popup-no-buttons"), n("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("bottom", "")) : (n("#w2ui-popup .w2ui-popup-buttons").hide().html(""), n("#w2ui-popup .w2ui-popup-body").addClass("w2ui-popup-no-buttons"), n("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("bottom", "0px")), e.title ? (n("#w2ui-popup .w2ui-popup-title").show().html((e.showClose ? `<div class="w2ui-popup-button w2ui-popup-close">
                                <span class="w2ui-icon w2ui-icon-cross w2ui-eaction" data-mousedown="stop" data-click="close"></span>
                            </div>` : "") + (e.showMax ? `<div class="w2ui-popup-button w2ui-popup-max">
                                <span class="w2ui-icon w2ui-icon-box w2ui-eaction" data-mousedown="stop" data-click="toggle"></span>
                            </div>` : "")).append(e.title), n("#w2ui-popup .w2ui-popup-body").removeClass("w2ui-popup-no-title"), n("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("top", "")) : (n("#w2ui-popup .w2ui-popup-title").hide().html(""), n("#w2ui-popup .w2ui-popup-body").addClass("w2ui-popup-no-title"), n("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("top", "0px"));
      let d = n("#w2ui-popup .w2ui-box")[0], u = n("#w2ui-popup .w2ui-box-temp")[0];
      n("#w2ui-popup").addClass("animating"), c.transition(d, u, e.transition, () => {
        n(d).remove(), n(u).removeClass("w2ui-box-temp").addClass("w2ui-box");
        var p = n(u).find(".w2ui-popup-body");
        p.length == 1 && (p[0].style.cssText = e.style, p.show()), t.setFocus(e.focus), n("#w2ui-popup").removeClass("animating");
      }), this.status = "open", s.finish(), c.bindEvents("#w2ui-popup .w2ui-eaction", this), n("#w2ui-popup").find(".w2ui-popup-body").show();
    }
    return e.openMaximized && this.max(), e._last_focus = document.activeElement, e.keyboard && n(document.body).on("keydown", (d) => {
      this.keydown(d);
    }), n(window).on("resize", this.handleResize), r = { resizing: false, mvMove: function(d) {
      r.resizing == 1 && (d = d || window.event, r.div_x = d.screenX - r.x, r.div_y = d.screenY - r.y, (d = t.trigger("move", { target: "popup", div_x: r.div_x, div_y: r.div_y, originalEvent: d })).isCancelled !== true) && (n("#w2ui-popup").css({ transition: "none", transform: "translate3d(" + r.div_x + "px, " + r.div_y + "px, 0px)" }), t.options.moved = true, d.finish());
    }, mvStop: function(d) {
      r.resizing != 1 || (d = d || window.event, t.status = "open", r.div_x = d.screenX - r.x, r.div_y = d.screenY - r.y, n("#w2ui-popup").css({ left: r.pos_x + r.div_x + "px", top: r.pos_y + r.div_y + "px" }).css({ transition: "none", transform: "translate3d(0px, 0px, 0px)" }), r.resizing = false, n(document.body).off(".w2ui-popup"), r.isLocked) || t.unlock();
    } }, n("#w2ui-popup .w2ui-popup-title").on("mousedown", function(d) {
      var u;
      t.options.maximized || (d = (d = d) || window.event, t.status = "moving", u = n("#w2ui-popup").get(0).getBoundingClientRect(), Object.assign(r, { resizing: true, isLocked: n("#w2ui-popup > .w2ui-lock").length == 1, x: d.screenX, y: d.screenY, pos_x: u.x, pos_y: u.y }), r.isLocked || t.lock({ opacity: 0 }), n(document.body).on("mousemove.w2ui-popup", r.mvMove).on("mouseup.w2ui-popup", r.mvStop), d.stopPropagation ? d.stopPropagation() : d.cancelBubble = true, d.preventDefault && d.preventDefault());
    }), o;
  }
  load(e) {
    return new Promise((t, i) => {
      if ((e = typeof e == "string" ? { url: e } : e).url == null) console.log("ERROR: The url is not defined."), i("The url is not defined");
      else {
        this.status = "loading";
        let [s, l] = String(e.url).split("#");
        s && fetch(s).then((r) => r.text()).then((r) => {
          t(this.template(r, l, e));
        });
      }
    });
  }
  template(e, t, i = {}) {
    let s;
    try {
      s = n(e);
    } catch {
      s = n.html(e);
    }
    return t && (s = s.filter("#" + t)), Object.assign(i, { width: parseInt(n(s).css("width")), height: parseInt(n(s).css("height")), title: n(s).find("[rel=title]").html(), body: n(s).find("[rel=body]").html(), buttons: n(s).find("[rel=buttons]").html(), style: n(s).find("[rel=body]").get(0).style.cssText }), this.open(i);
  }
  action(e, t) {
    let i = this.options.actions[e];
    i instanceof Object && i.onClick && (i = i.onClick), e = this.trigger("action", { action: e, target: "popup", self: this, originalEvent: t, value: this.input ? this.input.value : null }), e.isCancelled !== true && (typeof i == "function" && i.call(this, t), e.finish());
  }
  keydown(e) {
    var t;
    this.options && !this.options.keyboard || (t = this.trigger("keydown", { target: "popup", originalEvent: e })).isCancelled !== true && (e.keyCode === 27 && (e.preventDefault(), n("#w2ui-popup .w2ui-message").length == 0) && (this.options.cancelAction ? this.action(this.options.cancelAction) : this.close()), t.finish());
  }
  close(e) {
    let t = this.trigger("close", { target: "popup" });
    var i;
    t.isCancelled !== true && (i = () => {
      n("#w2ui-popup").remove(), this.options._last_focus && 0 < this.options._last_focus.length && this.options._last_focus.focus(), this.status = "closed", this.options = {}, t.finish(), this._promClosed();
    }, n("#w2ui-popup").length !== 0) && this.status != "closed" && (this.status == "opening" && (e = true), this.status == "closing" && e === true ? (i(), clearTimeout(this.tmp.closingTimer), c.unlock(document.body, 0)) : (this.status = "closing", n("#w2ui-popup").css("transition", this.options.speed + "s").addClass("w2ui-anim-close animating"), c.unlock(document.body, 300), this._promClosing(), e ? i() : this.tmp.closingTimer = setTimeout(i, 1e3 * this.options.speed), this.options.keyboard && n(document.body).off("keydown", this.keydown), n(window).off("resize", this.handleResize)));
  }
  toggle() {
    let e = this.trigger("toggle", { target: "popup" });
    e.isCancelled !== true && (this.options.maximized === true ? this.min() : this.max(), setTimeout(() => {
      e.finish();
    }, 1e3 * this.options.speed + 50));
  }
  max() {
    if (this.options.maximized !== true) {
      let t = this.trigger("max", { target: "popup" });
      var e;
      t.isCancelled !== true && (this.status = "resizing", e = n("#w2ui-popup").get(0).getBoundingClientRect(), this.options.prevSize = e.width + ":" + e.height, this.resize(1e4, 1e4, () => {
        this.status = "open", this.options.maximized = true, t.finish();
      }));
    }
  }
  min() {
    if (this.options.maximized === true) {
      var e = this.options.prevSize.split(":");
      let t = this.trigger("min", { target: "popup" });
      t.isCancelled !== true && (this.status = "resizing", this.options.maximized = false, this.resize(parseInt(e[0]), parseInt(e[1]), () => {
        this.status = "open", this.options.prevSize = null, t.finish();
      }));
    }
  }
  clear() {
    n("#w2ui-popup .w2ui-popup-title").html(""), n("#w2ui-popup .w2ui-popup-body").html(""), n("#w2ui-popup .w2ui-popup-buttons").html("");
  }
  reset() {
    this.open(this.defaults);
  }
  message(e) {
    return c.message({ owner: this, box: n("#w2ui-popup").get(0), after: ".w2ui-popup-title" }, e);
  }
  confirm(e) {
    return c.confirm({ owner: this, box: n("#w2ui-popup"), after: ".w2ui-popup-title" }, e);
  }
  setFocus(e) {
    var _a;
    let t = n("#w2ui-popup"), i = "input, button, select, textarea, [contentEditable], .w2ui-input";
    e != null ? (_a = isNaN(e) ? t.find(i).filter(e).get(0) : t.find(i).get(e)) == null ? void 0 : _a.focus() : (e = t.find("[name=hidden-first]").get(0)) && e.focus(), n(t).find(i + ",[name=hidden-first],[name=hidden-last]").off(".keep-focus").on("blur.keep-focus", function(s) {
      setTimeout(() => {
        var _a2, _b, _c;
        var l = document.activeElement, r = 0 < n(t).find(i).filter(l).length, a = n(l).attr("name");
        !r && l && l !== document.body && ((_a2 = n(t).find(i).get(0)) == null ? void 0 : _a2.focus()), a == "hidden-last" && ((_b = n(t).find(i).get(0)) == null ? void 0 : _b.focus()), a == "hidden-first" && ((_c = n(t).find(i).get(-1)) == null ? void 0 : _c.focus());
      }, 1);
    });
  }
  lock(e, t) {
    var i = Array.from(arguments);
    i.unshift(n("#w2ui-popup")), c.lock(...i);
  }
  unlock(e) {
    c.unlock(n("#w2ui-popup"), e);
  }
  center(e, t, i) {
    let s, l;
    l = window.innerHeight == null ? (s = parseInt(document.documentElement.offsetWidth), parseInt(document.documentElement.offsetHeight)) : (s = parseInt(window.innerWidth), parseInt(window.innerHeight)), e = parseInt(e ?? this.options.width), t = parseInt(t ?? this.options.height), this.options.maximized === true && (e = s, t = l), s - 10 < e && (e = s - 10), l - 10 < t && (t = l - 10);
    var r = (l - t) / 2, a = (s - e) / 2;
    return i && (n("#w2ui-popup").css({ transition: "none", top: r + "px", left: a + "px", width: e + "px", height: t + "px" }), this.resizeMessages()), { top: r, left: a, width: e, height: t };
  }
  resize(l, r, i) {
    let s = this;
    this.options.speed == null && (this.options.speed = 0);
    var { top: l, left: r, width: a, height: h } = this.center(l, r), o = this.options.speed;
    n("#w2ui-popup").css({ transition: o + `s width, ${o}s height, ${o}s left, ${o}s top`, top: l + "px", left: r + "px", width: a + "px", height: h + "px" });
    let d = setInterval(() => {
      s.resizeMessages();
    }, 10);
    setTimeout(() => {
      clearInterval(d), s.resizeMessages(), typeof i == "function" && i();
    }, 1e3 * this.options.speed + 50);
  }
  resizeMessages() {
    n("#w2ui-popup .w2ui-message").each((e) => {
      var t = e._msg_options, i = n("#w2ui-popup"), l = (parseInt(t.width) < 10 && (t.width = 10), parseInt(t.height) < 10 && (t.height = 10), i[0].getBoundingClientRect()), i = parseInt(i.find(".w2ui-popup-title")[0].clientHeight), s = parseInt(l.width), l = parseInt(l.height);
      t.width = t.originalWidth, t.width > s - 10 && (t.width = s - 10), t.height = t.originalHeight, t.height > l - i - 5 && (t.height = l - i - 5), t.originalHeight < 0 && (t.height = l + t.originalHeight - i), t.originalWidth < 0 && (t.width = s + 2 * t.originalWidth), n(e).css({ left: (s - t.width) / 2 + "px", width: t.width + "px", height: t.height + "px" });
    });
  }
}
new st();
const _L = class _L {
  constructor() {
    this.defaults = { name: null, html: "", style: "", class: "", position: "top|bottom", align: "", anchor: null, anchorClass: "", anchorStyle: "", autoShow: false, autoShowOn: null, autoHideOn: null, arrowSize: 8, margin: 0, margin: 1, screenMargin: 2, autoResize: true, offsetX: 0, offsetY: 0, maxWidth: null, maxHeight: null, watchScroll: null, watchResize: null, hideOn: null, onThen: null, onShow: null, onHide: null, onUpdate: null, onMove: null };
  }
  trigger(e, t) {
    var i;
    if (arguments.length == 2 && (i = e, (e = t).type = i), e.overlay) return e.overlay.trigger(e);
    console.log("ERROR: cannot find overlay where to trigger events");
  }
  get(e) {
    return arguments.length == 0 ? Object.keys(_L.active) : e === true ? _L.active : _L.active[e.replace(/[\s\.#]/g, "_")];
  }
  attach(e, t) {
    let i, s, l = this;
    if (arguments.length != 0) {
      arguments.length == 1 && e.anchor ? e = (i = e).anchor : arguments.length === 2 && typeof t == "string" ? t = (i = { anchor: e, html: t }).html : arguments.length === 2 && t != null && typeof t == "object" && (t = (i = t).html), i = c.extend({}, this.defaults, i || {}), !(t = !t && i.text ? i.text : t) && i.html && (t = i.html), delete i.anchor;
      let r = i.name || e.id;
      e != document && e != document.body || (e = document.body, r = "context-menu"), r || (r = "noname-" + Object.keys(_L.active).length, console.log("NOTICE: name property is not defined for tooltip, could lead to too many instances")), r = r.replace(/[\s\.#]/g, "_"), _L.active[r] ? ((s = _L.active[r]).prevOptions = s.options, s.options = i, s.anchor = e, s.prevOptions.html == s.options.html && s.prevOptions.class == s.options.class && s.prevOptions.style == s.options.style || (s.needsUpdate = true), i = s.options) : (s = new ie(), Object.assign(s, { id: "w2overlay-" + r, name: r, options: i, anchor: e, displayed: false, tmp: { observeResize: new ResizeObserver(() => {
        this.resize(s.name);
      }) }, hide() {
        l.hide(r);
      } }), _L.active[r] = s), Object.keys(s.options).forEach((h) => {
        var o = s.options[h];
        h.startsWith("on") && typeof o == "function" && (s[h] = o, delete s.options[h]);
      }), i.autoShow === true && (i.autoShowOn = i.autoShowOn ?? "mouseenter", i.autoHideOn = i.autoHideOn ?? "mouseleave", i.autoShow = false), i.autoShowOn && (t = "autoShow-" + s.name, n(e).off("." + t).on(i.autoShowOn + "." + t, (h) => {
        l.show(s.name), h.stopPropagation();
      }), delete i.autoShowOn), i.autoHideOn && (t = "autoHide-" + s.name, n(e).off("." + t).on(i.autoHideOn + "." + t, (h) => {
        l.hide(s.name), h.stopPropagation();
      }), delete i.autoHideOn), s.off(".attach");
      let a = { overlay: s, then: (h) => (s.on("show:after.attach", (o) => {
        h(o);
      }), a), show: (h) => (s.on("show.attach", (o) => {
        h(o);
      }), a), hide: (h) => (s.on("hide.attach", (o) => {
        h(o);
      }), a), update: (h) => (s.on("update.attach", (o) => {
        h(o);
      }), a), move: (h) => (s.on("move.attach", (o) => {
        h(o);
      }), a) };
      return a;
    }
  }
  update(e, t) {
    var i = _L.active[e];
    i ? (i.needsUpdate = true, i.options.html = t, this.show(e)) : console.log(`Tooltip "${e}" is not displayed. Cannot update it.`);
  }
  show(e) {
    if (e instanceof HTMLElement || e instanceof Object) {
      let a = e, h = (e instanceof HTMLElement && ((a = arguments[1] || {}).anchor = e), this.attach(a));
      return n(h.overlay.anchor).off(".autoShow-" + h.overlay.name).off(".autoHide-" + h.overlay.name), setTimeout(() => {
        this.show(h.overlay.name), this.initControls && this.initControls(h.overlay);
      }, 1), h;
    }
    let t, i = this, s = _L.active[e.replace(/[\s\.#]/g, "_")];
    if (s) {
      let a = s.options;
      if (!s || s.displayed && !s.needsUpdate) this.resize(s == null ? void 0 : s.name);
      else {
        var l = a.position.split("|"), l = ["top", "bottom"].includes(l[0]);
        let h = a.align == "both" && l ? "" : "white-space: nowrap;";
        if (a.maxWidth && c.getStrWidth(a.html, "") > a.maxWidth && (h = "width: " + a.maxWidth + "px; white-space: inherit; overflow: auto;"), h += " max-height: " + (a.maxHeight || window.innerHeight - 40) + "px;", a.html !== "" && a.html != null) {
          if (s.box) {
            if ((t = this.trigger("update", { target: e, overlay: s })).isCancelled === true) return void (s.prevOptions && (s.options = s.prevOptions, delete s.prevOptions));
            n(s.box).find(".w2ui-overlay-body").attr("style", (a.style || "") + "; " + h).removeClass().addClass("w2ui-overlay-body " + a.class).html(a.html);
          } else {
            if ((t = this.trigger("show", { target: e, overlay: s })).isCancelled === true) return;
            n("body").append(`<div id="${s.id}" name="${e}" style="display: none; pointer-events: none" class="w2ui-overlay"
                        data-click="stop" data-focusin="stop">
                    <style></style>
                    <div class="w2ui-overlay-body ${a.class}" style="${a.style || ""}; ${h}">
                        ${a.html}
                    </div>
                </div>`), s.box = n("#" + c.escapeId(s.id))[0], s.displayed = true, l = n(s.anchor).data("tooltipName") ?? [], l.push(e), n(s.anchor).data("tooltipName", l), c.bindEvents(s.box, {}), s.tmp.originalCSS = "", 0 < n(s.anchor).length && (s.tmp.originalCSS = n(s.anchor)[0].style.cssText);
          }
          this.resize(s.name), a.anchorStyle && (s.anchor.style.cssText += ";" + a.anchorStyle), !a.anchorClass || a.anchorClass == "w2ui-focus" && s.anchor == document.body || n(s.anchor).addClass(a.anchorClass), typeof a.hideOn == "string" && (a.hideOn = [a.hideOn]), Array.isArray(a.hideOn) || (a.hideOn = []), Object.assign(s.tmp, { scrollLeft: document.body.scrollLeft, scrollTop: document.body.scrollTop });
          {
            let o = (p) => {
              i.hide(s.name);
            }, d = n(s.anchor), u = "tooltip-" + s.name;
            n("body").off("." + u), a.hideOn.includes("doc-click") && (["INPUT", "TEXTAREA"].includes(s.anchor.tagName) && d.off(`.${u}-doc`).on(`click.${u}-doc`, (p) => {
              p.stopPropagation();
            }), n("body").on("click." + u, o)), a.hideOn.includes("focus-change") && n("body").on("focusin." + u, (p) => {
              document.activeElement != s.anchor && i.hide(s.name);
            }), ["INPUT", "TEXTAREA"].includes(s.anchor.tagName) && (d.off("." + u), a.hideOn.forEach((p) => {
              ["doc-click", "focus-change"].indexOf(p) == -1 && d.on(p + "." + u, { once: true }, o);
            }));
          }
          {
            var r = document.body;
            let o = "tooltip-" + s.name, d = r;
            r.tagName == "BODY" && (d = r.ownerDocument), n(d).off("." + o).on("scroll." + o, (u) => {
              Object.assign(s.tmp, { scrollLeft: r.scrollLeft, scrollTop: r.scrollTop }), i.resize(s.name);
            });
          }
          return n(s.box).show(), s.tmp.observeResize.observe(s.box), _L.observeRemove.observe(document.body, { subtree: true, childList: true }), n(s.box).css("opacity", 1).find(".w2ui-overlay-body").html(a.html), setTimeout(() => {
            n(s.box).css({ "pointer-events": "auto" }).data("ready", "yes");
          }, 100), delete s.needsUpdate, s.box.overlay = s, t && t.finish(), { overlay: s };
        }
        i.hide(e);
      }
    }
  }
  hide(e) {
    var _a;
    let t;
    if (arguments.length == 0) Object.keys(_L.active).forEach((l) => {
      this.hide(l);
    });
    else if (e instanceof HTMLElement) (n(e).data("tooltipName") ?? []).forEach((l) => {
      this.hide(l);
    });
    else if (typeof e == "string" && (e = e.replace(/[\s\.#]/g, "_"), t = _L.active[e]), t && t.box && (delete _L.active[e], e = this.trigger("hide", { target: e, overlay: t }), e.isCancelled !== true)) {
      var i = "tooltip-" + t.name;
      (_a = t.tmp.observeResize) == null ? void 0 : _a.disconnect(), t.options.watchScroll && n(t.options.watchScroll).off(".w2scroll-" + t.name);
      let l = 0;
      Object.keys(_L.active).forEach((r) => {
        _L.active[r].displayed && l++;
      }), l == 0 && _L.observeRemove.disconnect(), n("body").off("." + i), n(document).off("." + i), t.box.remove(), t.box = null, t.displayed = false;
      var s = n(t.anchor).data("tooltipName") ?? [];
      s.indexOf(t.name) != -1 && s.splice(s.indexOf(t.name), 1), s.length == 0 ? n(t.anchor).removeData("tooltipName") : n(t.anchor).data("tooltipName", s), t.anchor.style.cssText = t.tmp.originalCSS, n(t.anchor).off("." + i).removeClass(t.options.anchorClass), e.finish();
    }
  }
  resize(e) {
    if (arguments.length == 0) Object.keys(_L.active).forEach((s) => {
      s = _L.active[s], s.displayed && this.resize(s.name);
    });
    else {
      var t = _L.active[e.replace(/[\s\.#]/g, "_")];
      let s = this.getPosition(t.name);
      var i = s.left + "x" + s.top;
      let l;
      t.tmp.lastPos != i && (l = this.trigger("move", { target: e, overlay: t, pos: s })), n(t.box).css({ left: s.left + "px", top: s.top + "px" }).then((r) => {
        s.width != null && r.css("width", s.width + "px").find(".w2ui-overlay-body").css("width", "100%"), s.height != null && r.css("height", s.height + "px").find(".w2ui-overlay-body").css("height", "100%");
      }).find(".w2ui-overlay-body").removeClass("w2ui-arrow-right w2ui-arrow-left w2ui-arrow-top w2ui-arrow-bottom").addClass(s.arrow.class).closest(".w2ui-overlay").find("style").text(s.arrow.style), t.tmp.lastPos != i && l && (t.tmp.lastPos = i, l.finish());
    }
  }
  getPosition(e) {
    let t = _L.active[e.replace(/[\s\.#]/g, "_")];
    if (t && t.box) {
      let u = t.options;
      (t.tmp.resizedY || t.tmp.resizedX) && n(t.box).css({ width: "", height: "", scroll: "auto" });
      var e = c.scrollBarSize(), i = document.body.scrollWidth != document.body.clientWidth, s = document.body.scrollHeight != document.body.clientHeight;
      let m = { width: window.innerWidth - (s ? e : 0), height: window.innerHeight - (i ? e : 0) };
      var l, r = (u.position == "auto" ? "top|bottom|right|left" : u.position).split("|");
      let f = ["top", "bottom"].includes(r[0]), w = t.box.getBoundingClientRect(), b = t.anchor.getBoundingClientRect(), g = (t.anchor == document.body && ({ x: a, y: h, width: o, height: d } = u.originalEvent, b = { left: a - 2, top: h - 4, width: o, height: d, arrow: "none" }), u.arrowSize), y = (b.arrow == "none" && (g = 0), { top: b.top, bottom: m.height - (b.top + b.height) - +(i ? e : 0), left: b.left, right: m.width - (b.left + b.width) + (s ? e : 0) });
      w.width < 22 && (w.width = 22), w.height < 14 && (w.height = 14);
      let v, _, k, E, T = "", S = { offset: 0, class: "", style: `#${t.id} { --tip-size: ${g}px; }` }, R = { left: 0, top: 0 }, C = { posX: "", x: 0, posY: "", y: 0 };
      r.forEach((x) => {
        ["top", "bottom"].includes(x) && (!T && w.height + g / 1.893 < y[x] && (T = x), y[x] > C.y) && Object.assign(C, { posY: x, y: y[x] }), ["left", "right"].includes(x) && (!T && w.width + g / 1.893 < y[x] && (T = x), y[x] > C.x) && Object.assign(C, { posX: x, x: y[x] });
      }), T = T || (f ? C.posY : C.posX), u.autoResize && (["top", "bottom"].includes(T) && (w.height > y[T] ? (E = y[T], t.tmp.resizedY = true) : t.tmp.resizedY = false), ["left", "right"].includes(T)) && (w.width > y[T] ? (k = y[T], t.tmp.resizedX = true) : t.tmp.resizedX = false);
      var a = T;
      switch (S.class = b.arrow || "w2ui-arrow-" + a, a) {
        case "top":
          v = b.left + (b.width - (k ?? w.width)) / 2, _ = b.top - (E ?? w.height) - g / 1.5 + 1;
          break;
        case "bottom":
          v = b.left + (b.width - (k ?? w.width)) / 2, _ = b.top + b.height + g / 1.25 + 1;
          break;
        case "left":
          v = b.left - (k ?? w.width) - g / 1.2 - 1, _ = b.top + (b.height - (E ?? w.height)) / 2;
          break;
        case "right":
          v = b.left + b.width + g / 1.2 + 1, _ = b.top + (b.height - (E ?? w.height)) / 2;
      }
      f && (u.align == "left" && (R.left = b.left - v, v = b.left), u.align == "right" && (R.left = b.left + b.width - (k ?? w.width) - v, v = b.left + b.width - (k ?? w.width)), ["top", "bottom"].includes(T) && u.align.startsWith("both") && (l = u.align.split(":")[1] ?? 50, b.width >= l) && (v = b.left, k = b.width), u.align == "top" && (R.top = b.top - _, _ = b.top), u.align == "bottom" && (R.top = b.top + b.height - (E ?? w.height) - _, _ = b.top + b.height - (E ?? w.height)), ["left", "right"].includes(T) && u.align.startsWith("both") && (l = u.align.split(":")[1] ?? 50, b.height >= l) && (_ = b.top, E = b.height));
      {
        let x;
        (["left", "right"].includes(u.align) && b.width < (k ?? w.width) || ["top", "bottom"].includes(u.align) && b.height < (E ?? w.height)) && (x = true);
        var h = T == "right" ? g : u.screenMargin, o = T == "bottom" ? g : u.screenMargin, d = m.width - (k ?? w.width) - (T == "left" ? g : u.screenMargin), i = m.height - (E ?? w.height) - (T == "top" ? g : u.screenMargin) + 3;
        (["top", "bottom"].includes(T) || u.autoResize) && (v < h && (x = true, R.left -= v, v = h), v > d) && (x = true, R.left -= v - d, v += d - v), (["left", "right"].includes(T) || u.autoResize) && (_ < o && (x = true, R.top -= _, _ = o), _ > i) && (x = true, R.top -= _ - i, _ += i - _), x && (h = f ? "left" : "top", d = f ? "width" : "height", S.offset = -R[h], o = w[d] / 2 - g, Math.abs(S.offset) > o + g && (S.class = ""), Math.abs(S.offset) > o && (S.offset = S.offset < 0 ? -o : o), S.style = c.stripSpaces(`#${t.id} .w2ui-overlay-body:after,
                            #${t.id} .w2ui-overlay-body:before {
                                --tip-size: ${g}px;
                                margin-${h}: ${S.offset}px;
                            }`));
      }
      return s = T == "top" ? -u.margin : T == "bottom" ? u.margin : 0, e = T == "left" ? -u.margin : T == "right" ? u.margin : 0, _ = Math.floor(100 * (_ + parseFloat(u.offsetY) + parseFloat(s))) / 100, { left: v = Math.floor(100 * (v + parseFloat(u.offsetX) + parseFloat(e))) / 100, top: _, arrow: S, adjust: R, width: k, height: E, pos: T };
    }
  }
};
__publicField(_L, "active", {});
__publicField(_L, "observeRemove", new MutationObserver((e) => {
  let t = 0;
  Object.keys(_L.active).forEach((i) => {
    i = _L.active[i], i.displayed && (i.anchor && i.anchor.isConnected ? t++ : i.hide());
  }), t === 0 && _L.observeRemove.disconnect();
}));
let L = _L;
class lt extends L {
  constructor() {
    super(), this.palette = [["000000", "333333", "555555", "777777", "888888", "999999", "AAAAAA", "CCCCCC", "DDDDDD", "EEEEEE", "F7F7F7", "FFFFFF"], ["FF011B", "FF9838", "FFC300", "FFFD59", "86FF14", "14FF7A", "2EFFFC", "2693FF", "006CE7", "9B24F4", "FF21F5", "FF0099"], ["FFEAEA", "FCEFE1", "FCF4DC", "FFFECF", "EBFFD9", "D9FFE9", "E0FFFF", "E8F4FF", "ECF4FC", "EAE6F4", "FFF5FE", "FCF0F7"], ["F4CCCC", "FCE5CD", "FFF1C2", "FFFDA1", "D5FCB1", "B5F7D0", "BFFFFF", "D6ECFF", "CFE2F3", "D9D1E9", "FFE3FD", "FFD9F0"], ["EA9899", "F9CB9C", "FFE48C", "F7F56F", "B9F77E", "84F0B1", "83F7F7", "B5DAFF", "9FC5E8", "B4A7D6", "FAB9F6", "FFADDE"], ["E06666", "F6B26B", "DEB737", "E0DE51", "8FDB48", "52D189", "4EDEDB", "76ACE3", "6FA8DC", "8E7CC3", "E07EDA", "F26DBD"], ["CC0814", "E69138", "AB8816", "B5B20E", "6BAB30", "27A85F", "1BA8A6", "3C81C7", "3D85C6", "674EA7", "A14F9D", "BF4990"], ["99050C", "B45F17", "80650E", "737103", "395E14", "10783D", "13615E", "094785", "0A5394", "351C75", "780172", "782C5A"]], this.defaults = c.extend({}, this.defaults, { advanced: false, transparent: true, position: "top|bottom", class: "w2ui-white", color: "", liveUpdate: true, arrowSize: 12, autoResize: false, anchorClass: "w2ui-focus", autoShowOn: "focus", hideOn: ["doc-click", "focus-change"], onSelect: null, onLiveUpdate: null });
  }
  attach(e, t) {
    let i;
    arguments.length == 1 && e.anchor ? e = (i = e).anchor : arguments.length === 2 && t != null && typeof t == "object" && ((i = t).anchor = e), t = i.hideOn, i = c.extend({}, this.defaults, i || {}), t && (i.hideOn = t), i.style += "; padding: 0;", i.transparent && this.palette[0][1] == "333333" && (this.palette[0].splice(1, 1), this.palette[0].push("")), i.transparent || this.palette[0][1] == "333333" || (this.palette[0].splice(1, 0, "333333"), this.palette[0].pop()), i.color && (i.color = String(i.color).toUpperCase()), typeof i.color == "string" && i.color.substr(0, 1) === "#" && (i.color = i.color.substr(1)), this.index = [-1, -1];
    let s = super.attach(i), l = s.overlay;
    return l.options.html = this.getColorHTML(l.name, i), l.on("show.attach", (a) => {
      var a = a.detail.overlay, h = a.anchor, o = a.options;
      ["INPUT", "TEXTAREA"].includes(h.tagName) && !o.color && h.value && (a.tmp.initColor = h.value), delete a.newColor;
    }), l.on("show:after.attach", (r) => {
      var _a;
      var a;
      ((_a = s.overlay) == null ? void 0 : _a.box) && (a = n(s.overlay.box).find(".w2ui-eaction"), c.bindEvents(a, this), this.initControls(s.overlay));
    }), l.on("update:after.attach", (r) => {
      var _a;
      var a;
      ((_a = s.overlay) == null ? void 0 : _a.box) && (a = n(s.overlay.box).find(".w2ui-eaction"), c.bindEvents(a, this), this.initControls(s.overlay));
    }), l.on("hide.attach", (a) => {
      var a = a.detail.overlay, o = a.anchor, h = a.newColor ?? a.options.color ?? "", o = (["INPUT", "TEXTAREA"].includes(o.tagName) && o.value != h && (o.value = h), this.trigger("select", { color: h, target: a.name, overlay: a }));
      o.isCancelled !== true && o.finish();
    }), s.liveUpdate = (r) => (l.on("liveUpdate.attach", (a) => {
      r(a);
    }), s), s.select = (r) => (l.on("select.attach", (a) => {
      r(a);
    }), s), s;
  }
  select(e, l) {
    let i;
    this.index = [-1, -1], typeof l != "string" && (i = l.target, this.index = n(i).attr("index").split(":"), l = n(i).closest(".w2ui-overlay").attr("name"));
    var s = this.get(l), l = this.trigger("liveUpdate", { color: e, target: l, overlay: s, param: arguments[1] });
    l.isCancelled !== true && (["INPUT", "TEXTAREA"].includes(s.anchor.tagName) && s.options.liveUpdate && n(s.anchor).val(e), s.newColor = e, n(s.box).find(".w2ui-selected").removeClass("w2ui-selected"), i && n(i).addClass("w2ui-selected"), l.finish());
  }
  nextColor(e) {
    var t = this.palette;
    switch (e) {
      case "up":
        this.index[0]--;
        break;
      case "down":
        this.index[0]++;
        break;
      case "right":
        this.index[1]++;
        break;
      case "left":
        this.index[1]--;
    }
    return this.index[0] < 0 && (this.index[0] = 0), this.index[0] > t.length - 2 && (this.index[0] = t.length - 2), this.index[1] < 0 && (this.index[1] = 0), this.index[1] > t[0].length - 1 && (this.index[1] = t[0].length - 1), t[this.index[0]][this.index[1]];
  }
  tabClick(e, i) {
    typeof i != "string" && (i = n(i.target).closest(".w2ui-overlay").attr("name"));
    var i = this.get(i), s = n(i.box).find(`.w2ui-color-tab:nth-child(${e})`);
    n(i.box).find(".w2ui-color-tab").removeClass("w2ui-selected"), n(s).addClass("w2ui-selected"), n(i.box).find(".w2ui-tab-content").hide().closest(".w2ui-colors").find(".tab-" + e).show();
  }
  getColorHTML(e, t) {
    let i = `
            <div class="w2ui-colors">
                <div class="w2ui-tab-content tab-1">`;
    for (let l = 0; l < this.palette.length; l++) {
      i += '<div class="w2ui-color-row">';
      for (let r = 0; r < this.palette[l].length; r++) {
        var s = this.palette[l][r];
        let a = s === "FFFFFF" ? "; border: 1px solid #efefef" : "";
        i += `
                    <div class="w2ui-color w2ui-eaction ${s === "" ? "w2ui-no-color" : ""} ${t.color == s ? "w2ui-selected" : ""}"
                        style="background-color: #${s + a};" name="${s}" index="${l}:${r}"
                        data-mousedown="select|'${s}'|event" data-mouseup="hide|${e}">&nbsp;
                    </div>`;
      }
      i += "</div>", l < 2 && (i += '<div style="height: 8px"></div>');
    }
    return i = (i = (i += "</div>") + `
            <div class="w2ui-tab-content tab-2" style="display: none">
                <div class="color-info">
                    <div class="color-preview-bg"><div class="color-preview"></div><div class="color-original"></div></div>
                    <div class="color-part">
                        <span>H</span> <input class="w2ui-input" name="h" maxlength="3" max="360" tabindex="101">
                        <span>R</span> <input class="w2ui-input" name="r" maxlength="3" max="255" tabindex="104">
                    </div>
                    <div class="color-part">
                        <span>S</span> <input class="w2ui-input" name="s" maxlength="3" max="100" tabindex="102">
                        <span>G</span> <input class="w2ui-input" name="g" maxlength="3" max="255" tabindex="105">
                    </div>
                    <div class="color-part">
                        <span>V</span> <input class="w2ui-input" name="v" maxlength="3" max="100" tabindex="103">
                        <span>B</span> <input class="w2ui-input" name="b" maxlength="3" max="255" tabindex="106">
                    </div>
                    <div class="color-part opacity">
                        <span>${c.lang("Opacity")}</span>
                        <input class="w2ui-input" name="a" maxlength="5" max="1" tabindex="107">
                    </div>
                </div>
                <div class="palette" name="palette">
                    <div class="palette-bg"></div>
                    <div class="value1 move-x move-y"></div>
                </div>
                <div class="rainbow" name="rainbow">
                    <div class="value2 move-x"></div>
                </div>
                <div class="alpha" name="alpha">
                    <div class="alpha-bg"></div>
                    <div class="value2 move-x"></div>
                </div>
            </div>`) + `
            <div class="w2ui-color-tabs">
                <div class="w2ui-color-tab selected w2ui-eaction" data-click="tabClick|1|event|this"><span class="w2ui-icon w2ui-icon-colors"></span></div>
                <div class="w2ui-color-tab w2ui-eaction" data-click="tabClick|2|event|this"><span class="w2ui-icon w2ui-icon-settings"></span></div>
                <div style="padding: 5px; width: 100%; text-align: right;">
                    ${typeof t.html == "string" ? t.html : ""}
                </div>
            </div>`;
  }
  initControls(e) {
    let t, i = this;
    var s = e.options;
    let l = c.parseColor(s.color || e.tmp.initColor), r = (l == null && (l = { r: 140, g: 150, b: 160, a: 1 }), c.rgb2hsv(l));
    s.advanced === true && this.tabClick(2, e.name), o(r, true, true), n(e.box).find("input").off(".w2color").on("change.w2color", (b) => {
      b = n(b.target);
      let f = parseFloat(b.val());
      var w = parseFloat(b.attr("max")), w = (isNaN(f) && (f = 0, b.val(0)), 1 < w && (f = parseInt(f)), 0 < w && f > w && (b.val(w), f = w), f < 0 && (b.val(0), f = 0), b.attr("name")), b = {};
      ["r", "g", "b", "a"].indexOf(w) !== -1 ? (l[w] = f, r = c.rgb2hsv(l)) : ["h", "s", "v"].indexOf(w) !== -1 && (b[w] = f), o(b, true);
    }), n(e.box).find(".color-original").off(".w2color").on("click.w2color", (m) => {
      m = c.parseColor(n(m.target).css("background-color")), m != null && (l = m, o(r = c.rgb2hsv(l), true));
    }), s = `${c.isIOS ? "touchstart" : "mousedown"}.w2color`;
    let a = `${c.isIOS ? "touchend" : "mouseup"}.w2color`, h = `${c.isIOS ? "touchmove" : "mousemove"}.w2color`;
    function o(m, f, w) {
      var _a;
      m.h != null && (r.h = m.h), m.s != null && (r.s = m.s), m.v != null && (r.v = m.v), m.a != null && (l.a = m.a, r.a = m.a);
      let b = "rgba(" + (l = c.hsv2rgb(r)).r + "," + l.g + "," + l.b + "," + l.a + ")", g = [Number(l.r).toString(16).toUpperCase(), Number(l.g).toString(16).toUpperCase(), Number(l.b).toString(16).toUpperCase(), Math.round(255 * Number(l.a)).toString(16).toUpperCase()];
      var y, v;
      g.forEach((_, k) => {
        _.length === 1 && (g[k] = "0" + _);
      }), b = g[0] + g[1] + g[2] + g[3], l.a === 1 && (b = g[0] + g[1] + g[2]), n(e.box).find(".color-preview").css("background-color", "#" + b), n(e.box).find("input").each((_) => {
        _.name && (l[_.name] != null && (_.value = l[_.name]), r[_.name] != null && (_.value = r[_.name]), _.name === "a") && (_.value = l.a);
      }), w ? (m = ((_a = e.tmp) == null ? void 0 : _a.initColor) || b, n(e.box).find(".color-original").css("background-color", "#" + m), n(e.box).find(".w2ui-colors .w2ui-selected").removeClass("w2ui-selected"), n(e.box).find(`.w2ui-colors [name="${m}"]`).addClass("w2ui-selected"), b.length == 8 && i.tabClick(2, e.name)) : i.select(b, e.name), f && (w = n(e.box).find(".palette .value1"), m = n(e.box).find(".rainbow .value2"), f = n(e.box).find(".alpha .value2"), y = parseInt(w[0].clientWidth) / 2, v = parseInt(m[0].clientWidth) / 2, w.css({ left: 150 * r.s / 100 - y + "px", top: 125 * (100 - r.v) / 100 - y + "px" }), m.css("left", r.h / 2.4 - v + "px"), f.css("left", 150 * l.a - v + "px"), d());
    }
    function d() {
      var m = c.hsv2rgb(r.h, 100, 100), m = `${m.r},${m.g},` + m.b;
      n(e.box).find(".palette").css("background-image", `linear-gradient(90deg, rgba(${m},0) 0%, rgba(${m},1) 100%)`);
    }
    function u(m) {
      n("body").off(".w2color");
    }
    function p(g) {
      var v = t.el, b = g.pageX - t.x, g = g.pageY - t.y;
      let f = t.left + b, w = t.top + g;
      var b = parseInt(v.prop("clientWidth")) / 2, g = (f < -b && (f = -b), w < -b && (w = -b), f > t.width - b && (f = t.width - b), w > t.height - b && (w = t.height - b), v.hasClass("move-x") && v.css({ left: f + "px" }), v.hasClass("move-y") && v.css({ top: w + "px" }), n(v.get(0).parentNode).attr("name")), y = parseInt(v.css("left")) + b, v = parseInt(v.css("top")) + b;
      g === "palette" && o({ s: Math.round(y / t.width * 100), v: Math.round(100 - v / t.height * 100) }), g === "rainbow" && (o({ h: Math.round(2.4 * y) }), d()), g === "alpha" && o({ a: parseFloat(Number(y / 150).toFixed(2)) });
    }
    n(e.box).find(".palette, .rainbow, .alpha").off(".w2color").on(s + ".w2color", function(m) {
      var f = n(this).find(".value1, .value2"), w = parseInt(f.prop("clientWidth")) / 2;
      f.hasClass("move-x") && f.css({ left: m.offsetX - w + "px" }), f.hasClass("move-y") && f.css({ top: m.offsetY - w + "px" }), t = { el: f, x: m.pageX, y: m.pageY, width: f.prop("parentNode").clientWidth, height: f.prop("parentNode").clientHeight, left: parseInt(f.css("left")), top: parseInt(f.css("top")) }, p(m), n("body").off(".w2color").on(h, p).on(a, u);
    });
  }
}
class rt extends L {
  constructor() {
    super(), this.defaults = c.extend({}, this.defaults, { type: "normal", items: [], index: null, render: null, spinner: false, msgNoItems: c.lang("No items found"), topHTML: "", menuStyle: "", filter: false, markSearch: false, match: "contains", search: false, altRows: false, arrowSize: 10, align: "left", position: "bottom|top", class: "w2ui-white", anchorClass: "w2ui-focus", autoShowOn: "focus", hideOn: ["doc-click", "focus-change", "select"], onSelect: null, onSubMenu: null, onRemove: null });
  }
  attach(e, t) {
    let i;
    arguments.length == 1 && e.anchor ? e = (i = e).anchor : arguments.length === 2 && t != null && typeof t == "object" && ((i = t).anchor = e), t = i.hideOn, i = c.extend({}, this.defaults, i || {}), t && (i.hideOn = t), i.style += "; padding: 0;", i.items == null && (i.items = []), i.html = this.getMenuHTML(i);
    let s = super.attach(i), l = s.overlay;
    return l.on("show:after.attach, update:after.attach", (r) => {
      var _a;
      if ((_a = s.overlay) == null ? void 0 : _a.box) {
        let h = "";
        l.selected = null, l.options.items = c.normMenu(l.options.items), ["INPUT", "TEXTAREA"].includes(l.anchor.tagName) && (h = l.anchor.value, l.selected = l.anchor.dataset.selectedIndex);
        var a = n(s.overlay.box).find(".w2ui-eaction");
        c.bindEvents(a, this), this.applyFilter(l.name, null, h).then((o) => {
          l.tmp.searchCount = o.count, l.tmp.search = o.search, this.refreshSearch(l.name), this.initControls(s.overlay), this.refreshIndex(l.name);
        });
      }
    }), l.on("hide:after.attach", (r) => {
      F.hide(l.name + "-tooltip");
    }), s.select = (r) => (l.on("select.attach", (a) => {
      r(a);
    }), s), s.remove = (r) => (l.on("remove.attach", (a) => {
      r(a);
    }), s), s.subMenu = (r) => (l.on("subMenu.attach", (a) => {
      r(a);
    }), s), s;
  }
  update(e, t) {
    var i, s = L.active[e];
    s ? ((i = s.options).items != t && (i.items = t), t = this.getMenuHTML(i), i.html != t && (i.html = t, s.needsUpdate = true, this.show(e))) : console.log(`Tooltip "${e}" is not displayed. Cannot update it.`);
  }
  initControls(e) {
    n(e.box).find(".w2ui-menu:not(.w2ui-sub-menu)").off(".w2menu").on("mouseDown.w2menu", { delegate: ".w2ui-menu-item" }, (t) => {
      var i = t.delegate.dataset;
      this.menuDown(e, t, i.index, i.parents);
    }).on((c.isIOS ? "touchStart" : "click") + ".w2menu", { delegate: ".w2ui-menu-item" }, (t) => {
      var i = t.delegate.dataset;
      this.menuClick(e, t, parseInt(i.index), i.parents);
    }).find(".w2ui-menu-item").off(".w2menu").on("mouseEnter.w2menu", (t) => {
      var _a;
      var i = t.target.dataset, i = (_a = e.options.items[i.index]) == null ? void 0 : _a.tooltip;
      i && F.show({ name: e.name + "-tooltip", anchor: t.target, html: i, position: "right|left", hideOn: ["doc-click"] });
    }).on("mouseLeave.w2menu", (t) => {
      F.hide(e.name + "-tooltip");
    }), ["INPUT", "TEXTAREA"].includes(e.anchor.tagName) && n(e.anchor).off(".w2menu").on("input.w2menu", (t) => {
    }).on("keyup.w2menu", (t) => {
      t._searchType = "filter", this.keyUp(e, t);
    }), e.options.search && n(e.box).find("#menu-search").off(".w2menu").on("keyup.w2menu", (t) => {
      t._searchType = "search", this.keyUp(e, t);
    });
  }
  getCurrent(a, l) {
    var a = L.active[a.replace(/[\s\.#]/g, "_")], i = a.options;
    let s = (l || (a.selected ?? "")).split("-");
    var l = s.length - 1, a = s[l], r = s.slice(0, s.length - 1).join("-"), a = c.isInt(a) ? parseInt(a) : 0;
    let h = i.items;
    return s.forEach((o, d) => {
      d < s.length - 1 && (h = h[o].items);
    }), { last: l, index: a, items: h, item: h[a], parents: r };
  }
  getMenuHTML(e, t, i, s) {
    if (e.spinner) return `
            <div class="w2ui-menu">
                <div class="w2ui-no-items">
                    <div class="w2ui-spinner"></div>
                    ${c.lang("Loading...")}
                </div>
            </div>`;
    s = s || [], t == null && (t = e.items), Array.isArray(t) || (t = []);
    let l = 0, r = null, a = "", h = (!i && e.search && (a += `
                <div class="w2ui-menu-search">
                    <span class="w2ui-icon w2ui-icon-search"></span>
                    <input id="menu-search" class="w2ui-input" type="text"/>
                </div>`, t.forEach((o) => o.hidden = false)), !i && e.topHTML && (a += `<div class="w2ui-menu-top">${e.topHTML}</div>`), `
            ${a}
            <div class="w2ui-menu ${i ? "w2ui-sub-menu" : ""}" ${i ? "" : `style="${e.menuStyle}"`}
                data-parent="${s}">
        `);
    return t.forEach((o, d) => {
      r = o.icon;
      var u = (0 < s.length ? s.join("-") + "-" : "") + d;
      if (r == null && (r = null), ["radio", "check"].indexOf(e.type) == -1 || Array.isArray(o.items) || o.group === false || (r = o.checked === true ? "w2ui-icon-check" : "w2ui-icon-empty"), o.hidden !== true) {
        let m = o.text, f = "", w = "";
        if (typeof (m = typeof e.render == "function" ? e.render(o, e) : m) == "function" && (m = m(o, e)), r && (String(r).slice(0, 1) !== "<" && (r = `<span class="w2ui-icon ${r}"></span>`), f = `<div class="menu-icon">${r}</span></div>`), o.type !== "break" && m != null && m !== "" && String(m).substr(0, 2) != "--") {
          var p = ["w2ui-menu-item"];
          e.altRows == 1 && p.push(l % 2 == 0 ? "w2ui-even" : "w2ui-odd");
          let b = 1, g = (f === "" && b++, o.count == null && o.hotkey == null && o.remove !== true && o.items == null && b++, o.tooltip == null && o.hint != null && (o.tooltip = o.hint), "");
          if (o.remove === true) g = '<span class="remove">x</span>';
          else if (o.items != null) {
            let y = [];
            typeof o.items == "function" ? y = o.items(o) : Array.isArray(o.items) && (y = o.items), g = "<span></span>", w = `
                            <div class="w2ui-sub-menu-box" style="${o.expanded ? "" : "display: none"}">
                                ${this.getMenuHTML(e, y, true, s.concat(d))}
                            </div>`;
          } else o.count != null && (g += "<span>" + o.count + "</span>"), o.hotkey != null && (g += '<span class="hotkey">' + o.hotkey + "</span>");
          o.disabled === true && p.push("w2ui-disabled"), o._noSearchInside === true && p.push("w2ui-no-search-inside"), w !== "" && (p.push("has-sub-menu"), o.expanded ? p.push("expanded") : p.push("collapsed")), h += `
                        <div index="${u}" class="${p.join(" ")}" style="${o.style || ""}"
                            data-index="${d}" data-parents="${s.join("-")}">
                                <div style="width: ${(i ? 20 : 0) + parseInt(o.indent ?? 0)}px"></div>
                                ${f}
                                <div class="menu-text" colspan="${b}">${c.lang(m)}</div>
                                <div class="menu-extra">${g}</div>
                        </div>
                        ` + w, l++;
        } else p = (m ?? "").replace(/^-+/g, ""), h += `
                        <div index="${u}" class="w2ui-menu-divider ${p != "" ? "has-text" : ""}">
                            <div class="line"></div>
                            ${p ? `<div class="text">${p}</div>` : ""}
                        </div>`;
      }
      t[d] = o;
    }), l === 0 && e.msgNoItems && (h += `
                <div class="w2ui-no-items">
                    ${c.lang(e.msgNoItems)}
                </div>`), h += "</div>";
  }
  refreshIndex(s) {
    var t, i, s = L.active[s.replace(/[\s\.#]/g, "_")];
    s && (s.displayed || this.show(s.name), t = n(s.box).find(".w2ui-overlay-body").get(0), i = n(s.box).find(".w2ui-menu-search, .w2ui-menu-top").get(0), n(s.box).find(".w2ui-menu-item.w2ui-selected").removeClass("w2ui-selected"), s = n(s.box).find(`.w2ui-menu-item[index="${s.selected}"]`).addClass("w2ui-selected").get(0)) && (s.offsetTop + s.clientHeight > t.clientHeight + t.scrollTop && s.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" }), s.offsetTop < t.scrollTop + (i ? i.clientHeight : 0)) && s.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
  }
  refreshSearch(e) {
    var _a, _b;
    let t = L.active[e.replace(/[\s\.#]/g, "_")];
    t && (t.displayed || this.show(t.name), n(t.box).find(".w2ui-no-items").hide(), n(t.box).find(".w2ui-menu-item, .w2ui-menu-divider").each((i) => {
      var _a2, _b2;
      var s;
      ((_a2 = this.getCurrent(e, i.getAttribute("index")).item) == null ? void 0 : _a2.hidden) ? n(i).hide() : ((s = (_b2 = t.tmp) == null ? void 0 : _b2.search) && t.options.markSearch && c.marker(i, s, { onlyFirst: t.options.match == "begins" }), n(i).show());
    }), n(t.box).find(".w2ui-sub-menu").each((i) => {
      var s = n(i).find(".w2ui-menu-item").get().some((l) => l.style.display != "none");
      this.getCurrent(e, i.dataset.parent).item.expanded && (s ? n(i).parent().show() : n(i).parent().hide());
    }), t.tmp.searchCount != 0 && ((_b = (_a = t.options) == null ? void 0 : _a.items) == null ? void 0 : _b.length) != 0 || (n(t.box).find(".w2ui-no-items").length == 0 && n(t.box).find(".w2ui-menu:not(.w2ui-sub-menu)").append(`
                    <div class="w2ui-no-items">
                        ${c.lang(t.options.msgNoItems)}
                    </div>`), n(t.box).find(".w2ui-no-items").show()));
  }
  applyFilter(e, t, i, s) {
    var _a;
    let l = 0;
    var r = L.active[e.replace(/[\s\.#]/g, "_")];
    let a = r.options, h, o;
    var d = new Promise((m, f) => {
      h = m, o = f;
    });
    i == null && (i = ["INPUT", "TEXTAREA"].includes(r.anchor.tagName) ? r.anchor.value : "");
    let u = [];
    a.selected && (Array.isArray(a.selected) ? u = a.selected.map((m) => (m == null ? void 0 : m.id) ?? m) : ((_a = a.selected) == null ? void 0 : _a.id) && (u = [a.selected.id])), r.tmp.activeChain = null;
    var p = r.tmp.remote ?? { hasMore: true, emtpySet: false, search: null, total: -1 };
    if (t == null && a.url && p.hasMore && p.search !== i) {
      let m = true, f = c.lang("Loading...");
      i.length < a.minLength && p.emptySet !== true && (f = c.lang("${count} letters or more...", { count: a.minLength }), m = false, i === "") && (f = c.lang(a.msgSearch)), n(r.box).find(".w2ui-no-items").html(f), p.search = i, a.items = [], r.tmp.remote = p, m && this.request(r, i, s).then((w) => {
        this.update(e, w), this.applyFilter(e, null, i).then((b) => {
          h(b);
        });
      }).catch((w) => {
        console.log("Server Request error", w);
      });
    } else {
      let m;
      t == null && (m = this.trigger("search", { search: i, overlay: r, prom: d, resolve: h, reject: o })).isCancelled === true || (t == null && (t = r.options.items), a.filter === false ? h({ count: -1, search: i }) : (t.forEach((f) => {
        let w = "", b = "";
        ["is", "begins", "begins with"].indexOf(a.match) !== -1 && (w = "^"), ["is", "ends", "ends with"].indexOf(a.match) !== -1 && (b = "$");
        try {
          new RegExp(w + i + b, "i").test(f.text) || f.text === "..." ? f.hidden = false : f.hidden = true;
        } catch {
        }
        a.hideSelected && u.includes(f.id) && (f.hidden = true), Array.isArray(f.items) && 0 < f.items.length && (delete f._noSearchInside, this.applyFilter(e, f.items, i).then((g) => {
          g = g.count, 0 < g && (l += g, f.hidden && (f._noSearchInside = true), i && (f.expanded = true), f.hidden = false);
        })), f.hidden !== true && l++;
      }), h({ count: l, search: i }), m == null ? void 0 : m.finish()));
    }
    return d;
  }
  request(e, t, i) {
    let s = e.options, l = e.tmp.remote, r, a;
    return (s.items.length === 0 && l.total !== 0 || l.total == s.cacheMax && t.length > l.search.length || t.length >= l.search.length && t.substr(0, l.search.length) !== l.search || t.length < l.search.length) && (l.controller && l.controller.abort(), l.loading = true, clearTimeout(l.timeout), l.timeout = setTimeout(() => {
      var h = s.url;
      let o = { search: t, max: s.cacheMax };
      Object.assign(o, s.postData);
      var d, u = this.trigger("request", { search: t, overlay: e, url: h, postData: o, httpMethod: s.method ?? "GET", httpHeaders: {} });
      u.isCancelled !== true && (h = new URL(u.detail.url, location), d = c.prepareParams(h, { method: u.detail.httpMethod, headers: u.detail.httpHeaders, body: u.detail.postData }), l.controller = new AbortController(), d.signal = l.controller.signal, fetch(h, d).then((p) => p.json()).then((p) => {
        l.controller = null;
        var m = e.trigger("load", { search: o.search, overlay: e, data: p });
        m.isCancelled !== true && (typeof (p = m.detail.data) == "string" && (p = JSON.parse(p)), (p = Array.isArray(p) ? { records: p } : p).records == null && p.items != null && (p.records = p.items, delete p.items), p.error || p.records != null || (p.records = []), Array.isArray(p.records) ? (p.records.length >= s.cacheMax ? (p.records.splice(s.cacheMax, p.records.length), l.hasMore = true) : l.hasMore = false, s.recId == null && s.recid != null && (s.recId = s.recid), (s.recId || s.recText) && p.records.forEach((f) => {
          typeof s.recId == "string" && (f.id = f[s.recId]), typeof s.recId == "function" && (f.id = s.recId(f)), typeof s.recText == "string" && (f.text = f[s.recText]), typeof s.recText == "function" && (f.text = s.recText(f));
        }), l.loading = false, l.search = t, l.total = p.records.length, l.lastError = "", l.emptySet = t === "" && p.records.length === 0, m.finish(), r(c.normMenu(p.records))) : console.error("ERROR: server did not return proper data structure", `
`, " - it should return", { records: [{ id: 1, text: "item" }] }, `
`, " - or just an array ", [{ id: 1, text: "item" }], `
`, " - or if errorr ", { error: true, message: "error message" }));
      }).catch((p) => {
        var m = this.trigger("error", { overlay: e, search: t, error: p });
        m.isCancelled !== true && ((p == null ? void 0 : p.name) !== "AbortError" && console.error("ERROR: Server communication failed.", `
`, " - it should return", { records: [{ id: 1, text: "item" }] }, `
`, " - or just an array ", [{ id: 1, text: "item" }], `
`, " - or if errorr ", { error: true, message: "error message" }), l.loading = false, l.search = "", l.total = -1, l.emptySet = true, l.lastError = m.detail.error || "Server communication failed", s.items = [], m.finish(), a());
      }), u.finish());
    }, i ? s.debounce ?? 350 : 0)), new Promise((h, o) => {
      r = h, a = o;
    });
  }
  getActiveChain(e, t, i = [], s = [], l) {
    var r = L.active[e.replace(/[\s\.#]/g, "_")];
    return r.tmp.activeChain != null ? r.tmp.activeChain : ((t = t ?? r.options.items).forEach((a, h) => {
      var _a;
      a.hidden || a.disabled || ((_a = a == null ? void 0 : a.text) == null ? void 0 : _a.startsWith("--")) || (s.push(i.concat([h]).join("-")), Array.isArray(a.items) && 0 < a.items.length && a.expanded && (i.push(h), this.getActiveChain(e, a.items, i, s, true), i.pop()));
    }), l == null && (r.tmp.activeChain = s), s);
  }
  menuDown(e, t, i, s) {
    e = e.options;
    let l = e.items;
    var r = n(t.delegate).find(".w2ui-icon");
    let a = n(t.target).closest(".w2ui-menu:not(.w2ui-sub-menu)"), h = (typeof s == "string" && s !== "" && s.split("-").forEach((o) => {
      l = l[o].items;
    }), l[i]);
    if (!h.disabled) {
      let o = (d, u) => {
        d.forEach((p, m) => {
          p.id != h.id && (p.group === h.group && p.checked && (a.find(`.w2ui-menu-item[index="${(u ? u + "-" : "") + m}"] .w2ui-icon`).removeClass("w2ui-icon-check").addClass("w2ui-icon-empty"), d[m].checked = false), Array.isArray(p.items)) && o(p.items, m);
        });
      };
      e.type !== "check" && e.type !== "radio" || h.group === false || n(t.target).hasClass("remove") || n(t.target).closest(".w2ui-menu-item").hasClass("has-sub-menu") || (h.checked = e.type == "radio" || !h.checked, h.checked ? (e.type === "radio" && n(t.target).closest(".w2ui-menu").find(".w2ui-icon").removeClass("w2ui-icon-check").addClass("w2ui-icon-empty"), e.type === "check" && h.group != null && o(e.items), r.removeClass("w2ui-icon-empty").addClass("w2ui-icon-check")) : e.type === "check" && r.removeClass("w2ui-icon-check").addClass("w2ui-icon-empty")), n(t.target).hasClass("remove") || (a.find(".w2ui-menu-item").removeClass("w2ui-selected"), n(t.delegate).addClass("w2ui-selected"));
    }
  }
  menuClick(e, t, i, s) {
    var l = e.options;
    let r = l.items;
    var a = n(t.delegate).closest(".w2ui-menu-item");
    let h = !l.hideOn.includes("select");
    (t.shiftKey || t.metaKey || t.ctrlKey) && (h = true), typeof s == "string" && s !== "" ? s.split("-").forEach((d) => {
      r = r[d].items;
    }) : s = null;
    var o = (r = typeof r == "function" ? r({ overlay: e, index: i, parentIndex: s, event: t }) : r)[i];
    if (!o.disabled || n(t.target).hasClass("remove")) {
      let d;
      if (n(t.target).hasClass("remove")) {
        if ((d = this.trigger("remove", { originalEvent: t, target: e.name, overlay: e, item: o, index: i, parentIndex: s, el: a[0] })).isCancelled === true) return;
        h = !l.hideOn.includes("item-remove"), a.remove();
      } else if (a.hasClass("has-sub-menu")) {
        if ((d = this.trigger("subMenu", { originalEvent: t, target: e.name, overlay: e, item: o, index: i, parentIndex: s, el: a[0] })).isCancelled === true) return;
        h = true, a.hasClass("expanded") ? (o.expanded = false, a.removeClass("expanded").addClass("collapsed"), n(a.get(0).nextElementSibling).hide()) : (o.expanded = true, a.addClass("expanded").removeClass("collapsed"), n(a.get(0).nextElementSibling).show()), e.selected = parseInt(a.attr("index"));
      } else {
        if (l = this.findChecked(l.items), e.selected = parseInt(a.attr("index")), (d = this.trigger("select", { originalEvent: t, target: e.name, overlay: e, item: o, index: i, parentIndex: s, selected: l, keepOpen: h, el: a[0] })).isCancelled === true) return;
        o.keepOpen != null && (h = o.keepOpen), ["INPUT", "TEXTAREA"].includes(e.anchor.tagName) && (e.anchor.dataset.selected = o.id, e.anchor.dataset.selectedIndex = e.selected);
      }
      h || this.hide(e.name), d.finish();
    }
  }
  findChecked(e) {
    let t = [];
    return e.forEach((i) => {
      i.checked && t.push(i), Array.isArray(i.items) && (t = t.concat(this.findChecked(i.items)));
    }), t;
  }
  keyUp(e, t) {
    var _a, _b;
    var i = e.options, s = t.target.value;
    let l = true, r = false;
    switch (t.keyCode) {
      case 46:
      case 8:
        s !== "" || e.displayed || (l = false);
        break;
      case 13:
        if (!e.displayed || !e.selected) return;
        var { index: h, parents: a } = this.getCurrent(e.name);
        t.delegate = n(e.box).find(".w2ui-selected").get(0), this.menuClick(e, t, parseInt(h), a), l = false;
        break;
      case 27:
        l = false, e.displayed ? this.hide(e.name) : (h = e.anchor, ["INPUT", "TEXTAREA"].includes(h.tagName) && (h.value = "", delete h.dataset.selected, delete h.dataset.selectedIndex));
        break;
      case 37: {
        if (!e.displayed) return;
        let { item: d, index: u, parents: p } = this.getCurrent(e.name);
        p && (d = i.items[p], u = parseInt(p), p = "", r = true), Array.isArray(d == null ? void 0 : d.items) && 0 < d.items.length && d.expanded && (t.delegate = n(e.box).find(`.w2ui-menu-item[index="${u}"]`).get(0), e.selected = u, this.menuClick(e, t, parseInt(u), p)), l = false;
        break;
      }
      case 39:
        if (!e.displayed) return;
        var { item: a, index: h, parents: o } = this.getCurrent(e.name);
        Array.isArray(a == null ? void 0 : a.items) && 0 < a.items.length && !a.expanded && (t.delegate = n(e.box).find(".w2ui-selected").get(0), this.menuClick(e, t, parseInt(h), o)), l = false;
        break;
      case 38:
        e.displayed && (a = this.getActiveChain(e.name), e.selected == null || ((_a = e.selected) == null ? void 0 : _a.length) == 0 ? e.selected = a[a.length - 1] : ((h = a.indexOf(e.selected)) == -1 && (e.selected = a[a.length - 1]), 0 < h && (e.selected = a[h - 1])), l = false, r = true, t.preventDefault());
        break;
      case 40:
        e.displayed && (o = this.getActiveChain(e.name), e.selected == null || ((_b = e.selected) == null ? void 0 : _b.length) == 0 ? e.selected = o[0] : ((a = o.indexOf(e.selected)) == -1 && (e.selected = o[0]), a < o.length - 1 && (e.selected = o[a + 1])), l = false, r = true, t.preventDefault());
    }
    l && e.displayed && (i.filter && t._searchType == "filter" || i.search && t._searchType == "search") && this.applyFilter(e.name, null, s, true).then((d) => {
      e.tmp.searchCount = d.count, e.tmp.search = d.search, d.count !== 0 && this.getActiveChain(e.name).includes(e.selected) || (e.selected = null), this.refreshSearch(e.name);
    }), r && this.refreshIndex(e.name);
  }
}
class at extends L {
  constructor() {
    super();
    var e = /* @__PURE__ */ new Date();
    this.daysCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], this.today = e.getFullYear() + "/" + (Number(e.getMonth()) + 1) + "/" + e.getDate(), this.defaults = c.extend({}, this.defaults, { position: "top|bottom", class: "w2ui-calendar", type: "date", format: "", value: "", start: null, end: null, blockDates: [], blockWeekdays: [], colored: {}, arrowSize: 12, autoResize: false, anchorClass: "w2ui-focus", autoShowOn: "focus", hideOn: ["doc-click", "focus-change"], onSelect: null });
  }
  attach(l, s) {
    let i;
    arguments.length == 1 && l.anchor ? l = (i = l).anchor : arguments.length === 2 && s != null && typeof s == "object" && ((i = s).anchor = l);
    var s = i.hideOn, l = (i = c.extend({}, this.defaults, i || {}), s && (i.hideOn = s), i.format || (l = c.settings.dateFormat, s = c.settings.timeFormat, i.type == "date" ? i.format = l : i.type == "time" ? i.format = s : i.format = l + "|" + s), i.type == "time" ? this.getHourHTML(i) : this.getMonthHTML(i));
    i.style += "; padding: 0;", i.html = l.html;
    let r = super.attach(i), a = r.overlay;
    return Object.assign(a.tmp, l), a.on("show.attach", (o) => {
      var o = o.detail.overlay, d = o.anchor, u = o.options;
      ["INPUT", "TEXTAREA"].includes(d.tagName) && !u.value && d.value && (o.tmp.initValue = d.value), delete o.newValue, delete o.newDate;
    }), a.on("show:after.attach", (h) => {
      var _a;
      ((_a = r.overlay) == null ? void 0 : _a.box) && this.initControls(r.overlay);
    }), a.on("update:after.attach", (h) => {
      var _a;
      ((_a = r.overlay) == null ? void 0 : _a.box) && this.initControls(r.overlay);
    }), a.on("hide.attach", (o) => {
      var o = o.detail.overlay, d = o.anchor;
      o.newValue != null && (o.newDate && (o.newValue = o.newDate + " " + o.newValue), ["INPUT", "TEXTAREA"].includes(d.tagName) && d.value != o.newValue && (d.value = o.newValue), (d = this.trigger("select", { date: o.newValue, target: o.name, overlay: o })).isCancelled !== true) && d.finish();
    }), r.select = (h) => (a.on("select.attach", (o) => {
      h(o);
    }), r), r;
  }
  initControls(e) {
    let t = e.options, i = (l) => {
      let { month: r, year: a } = e.tmp;
      12 < (r += l) && (r = 1, a++), r < 1 && (r = 12, a--), l = this.getMonthHTML(t, r, a), Object.assign(e.tmp, l), n(e.box).find(".w2ui-overlay-body").html(l.html), this.initControls(e);
    }, s = (l, r) => {
      n(l.target).parent().find(".w2ui-jump-month, .w2ui-jump-year").removeClass("w2ui-selected"), n(l.target).addClass("w2ui-selected"), l = /* @__PURE__ */ new Date();
      let { jumpMonth: a, jumpYear: h } = e.tmp;
      (a = r && (h == null && (h = l.getFullYear()), a == null) ? l.getMonth() + 1 : a) && h && (r = this.getMonthHTML(t, a, h), Object.assign(e.tmp, r), n(e.box).find(".w2ui-overlay-body").html(r.html), e.tmp.jump = false, this.initControls(e));
    };
    n(e.box).find(".w2ui-cal-title").off(".calendar").on("click.calendar", (l) => {
      var r, a;
      Object.assign(e.tmp, { jumpYear: null, jumpMonth: null }), e.tmp.jump ? ({ month: r, year: a } = e.tmp, r = this.getMonthHTML(t, r, a), n(e.box).find(".w2ui-overlay-body").html(r.html), e.tmp.jump = false) : (n(e.box).find(".w2ui-overlay-body .w2ui-cal-days").replace(this.getYearHTML()), (a = n(e.box).find(`[name="${e.tmp.year}"]`).get(0)) && a.scrollIntoView(true), e.tmp.jump = true), this.initControls(e), l.stopPropagation();
    }).find(".w2ui-cal-previous").off(".calendar").on("click.calendar", (l) => {
      i(-1), l.stopPropagation();
    }).parent().find(".w2ui-cal-next").off(".calendar").on("click.calendar", (l) => {
      i(1), l.stopPropagation();
    }), n(e.box).find(".w2ui-cal-now").off(".calendar").on("click.calendar", (l) => {
      t.type == "datetime" ? e.newDate ? e.newValue = c.formatTime(/* @__PURE__ */ new Date(), t.format.split("|")[1]) : e.newValue = c.formatDateTime(/* @__PURE__ */ new Date(), t.format) : t.type == "date" ? e.newValue = c.formatDate(/* @__PURE__ */ new Date(), t.format) : t.type == "time" && (e.newValue = c.formatTime(/* @__PURE__ */ new Date(), t.format)), this.hide(e.name);
    }), n(e.box).off(".calendar").on("click.calendar", { delegate: ".w2ui-day.w2ui-date" }, (l) => {
      t.type == "datetime" ? (e.newDate = n(l.target).attr("date"), n(e.box).find(".w2ui-overlay-body").html(this.getHourHTML(e.options).html), this.initControls(e)) : (e.newValue = n(l.target).attr("date"), this.hide(e.name));
    }).on("click.calendar", { delegate: ".w2ui-jump-month" }, (l) => {
      e.tmp.jumpMonth = parseInt(n(l.target).attr("name")), s(l);
    }).on("dblclick.calendar", { delegate: ".w2ui-jump-month" }, (l) => {
      e.tmp.jumpMonth = parseInt(n(l.target).attr("name")), s(l, true);
    }).on("click.calendar", { delegate: ".w2ui-jump-year" }, (l) => {
      e.tmp.jumpYear = parseInt(n(l.target).attr("name")), s(l);
    }).on("dblclick.calendar", { delegate: ".w2ui-jump-year" }, (l) => {
      e.tmp.jumpYear = parseInt(n(l.target).attr("name")), s(l, true);
    }).on("click.calendar", { delegate: ".w2ui-time.hour" }, (r) => {
      var r = n(r.target).attr("hour");
      let a = this.str2min(t.value) % 60;
      e.tmp.initValue && !t.value && (a = this.str2min(e.tmp.initValue) % 60), t.noMinutes ? (e.newValue = this.min2str(60 * r, t.format), this.hide(e.name)) : (e.newValue = r + ":" + a, r = this.getMinHTML(r, t).html, n(e.box).find(".w2ui-overlay-body").html(r), this.initControls(e));
    }).on("click.calendar", { delegate: ".w2ui-time.min" }, (l) => {
      l = 60 * Math.floor(this.str2min(e.newValue) / 60) + parseInt(n(l.target).attr("min")), e.newValue = this.min2str(l, t.format), this.hide(e.name);
    });
  }
  getMonthHTML(e, t, i) {
    var r = c.settings.fulldays.slice(), s = c.settings.shortdays.slice();
    c.settings.weekStarts !== "M" && (r.unshift(r.pop()), s.unshift(s.pop()));
    let l = /* @__PURE__ */ new Date();
    var r = e.type === "datetime" ? c.isDateTime(e.value, e.format, true) : c.isDate(e.value, e.format, true), a = c.formatDate(r);
    t != null && i != null || (i = (r || l).getFullYear(), t = r ? r.getMonth() + 1 : l.getMonth() + 1), 12 < t && (t -= 12, i++), (t < 1 || t === 0) && (t += 12, i--), i / 4 == Math.floor(i / 4) ? this.daysCount[1] = 29 : this.daysCount[1] = 28, e.current = t + "/" + i;
    let h = (l = new Date(i, t - 1, 1)).getDay(), o = "";
    var d = c.settings.weekStarts;
    for (let y = 0; y < s.length; y++) {
      var u = d == "M" && y == 5 || d != "M" && y == 6, p = d == "M" && y == 6 || d != "M" && y == 0;
      o += `<div class="w2ui-day w2ui-weekday ${u ? "w2ui-sunday" : ""} ${p ? "w2ui-saturday" : ""}">${s[y]}</div>`;
    }
    let m = `
            <div class="w2ui-cal-title">
                <div class="w2ui-cal-previous">
                    <div></div>
                </div>
                <div class="w2ui-cal-next">
                    <div></div>
                </div>
                ${c.settings.fullmonths[t - 1]}, ${i}
                <span class="arrow-down"></span>
            </div>
            <div class="w2ui-cal-days">
                ${o}
        `, f = /* @__PURE__ */ new Date(i + `/${t}/1`);
    r = (f = new Date(f.getTime() + 432e5)).getDay(), c.settings.weekStarts == "M" && h--, 0 < r && (f = new Date(f.getTime() - 864e5 * h));
    for (let y = 0; y < 42; y++) {
      var w = [], b = `${f.getFullYear()}/${f.getMonth() + 1}/` + f.getDate(), g = (f.getDay() === 6 && w.push("w2ui-saturday"), f.getDay() === 0 && w.push("w2ui-sunday"), f.getMonth() + 1 !== t && w.push("outside"), b == this.today && w.push("w2ui-today"), f.getDate());
      let v = "", _ = "", k, E;
      E = e.type === "datetime" ? (k = c.formatDateTime(b, e.format), c.formatDate(b, c.settings.dateFormat)) : k = c.formatDate(b, e.format), e.colored && e.colored[E] !== void 0 && (b = e.colored[E].split("|"), _ = "background-color: " + b[0] + ";", v = "color: " + b[1] + ";"), m += `<div class="w2ui-day ${this.inRange(k, e, true) ? "w2ui-date " + (E == a ? "w2ui-selected" : "") : "w2ui-blocked"} ${w.join(" ")}"
                       style="${v + _}" date="${E}" data-date="${f.getTime()}">
                            ${g}
                    </div>`, f = new Date(f.getTime() + 864e5);
    }
    return m += "</div>", e.btnNow && (r = c.lang("Today" + (e.type == "datetime" ? " & Now" : "")), m += `<div class="w2ui-cal-now">${r}</div>`), { html: m, month: t, year: i };
  }
  getYearHTML() {
    let e = "", t = "";
    for (let i = 0; i < c.settings.fullmonths.length; i++) e += `<div class="w2ui-jump-month" name="${i + 1}">${c.settings.shortmonths[i]}</div>`;
    for (let i = c.settings.dateStartYear; i <= c.settings.dateEndYear; i++) t += `<div class="w2ui-jump-year" name="${i}">${i}</div>`;
    return `<div class="w2ui-cal-jump">
            <div id="w2ui-jump-month">${e}</div>
            <div id="w2ui-jump-year">${t}</div>
        </div>`;
  }
  getHourHTML(e) {
    (e = e ?? {}).format || (e.format = c.settings.timeFormat);
    var t = -1 < e.format.indexOf("h24"), i = e.value || (e.anchor ? e.anchor.value : ""), s = [];
    for (let a = 0; a < 24; a++) {
      let h = (12 <= a && !t ? a - 12 : a) + ":00" + (t ? "" : a < 12 ? " am" : " pm"), o = (a != 12 || t || (h = "12:00 pm"), s[Math.floor(a / 8)] || (s[Math.floor(a / 8)] = ""), this.min2str(this.str2min(h))), d = this.min2str(this.str2min(h) + 59);
      e.type === "datetime" && (r = c.isDateTime(i, e.format, true), l = e.format.split("|")[0].trim(), o = c.formatDate(r, l) + " " + o, d = c.formatDate(r, l) + " " + d);
      var l, r = this.inRange(o, e) || this.inRange(d, e);
      s[Math.floor(a / 8)] += `<span hour="${a}"
                class="hour ${r ? "w2ui-time " : "w2ui-blocked"}">${h}</span>`;
    }
    return { html: `<div class="w2ui-calendar">
            <div class="w2ui-time-title">${c.lang("Select Hour")}</div>
            <div class="w2ui-cal-time">
                <div class="w2ui-cal-column">${s[0]}</div>
                <div class="w2ui-cal-column">${s[1]}</div>
                <div class="w2ui-cal-column">${s[2]}</div>
            </div>
            ${e.btnNow ? `<div class="w2ui-cal-now">${c.lang("Now")}</div>` : ""}
        </div>` };
  }
  getMinHTML(e, t) {
    e == null && (e = 0), (t = t ?? {}).format || (t.format = c.settings.timeFormat);
    var i = -1 < t.format.indexOf("h24"), s = t.value || (t.anchor ? t.anchor.value : ""), l = [];
    for (let d = 0; d < 60; d += 5) {
      var r = (12 < e && !i ? e - 12 : e) + ":" + (d < 10 ? 0 : "") + d + " " + (i ? "" : e < 12 ? "am" : "pm");
      let u = r;
      var a, h, o = d < 20 ? 0 : d < 40 ? 1 : 2;
      l[o] || (l[o] = ""), t.type === "datetime" && (a = c.isDateTime(s, t.format, true), h = t.format.split("|")[0].trim(), u = c.formatDate(a, h) + " " + u), l[o] += `<span min="${d}" class="min ${this.inRange(u, t) ? "w2ui-time " : "w2ui-blocked"}">${r}</span>`;
    }
    return { html: `<div class="w2ui-calendar">
            <div class="w2ui-time-title">${c.lang("Select Minute")}</div>
            <div class="w2ui-cal-time">
                <div class="w2ui-cal-column">${l[0]}</div>
                <div class="w2ui-cal-column">${l[1]}</div>
                <div class="w2ui-cal-column">${l[2]}</div>
            </div>
            ${t.btnNow ? `<div class="w2ui-cal-now">${c.lang("Now")}</div>` : ""}
        </div>` };
  }
  inRange(e, t, i) {
    let s = false;
    if (t.type === "date") {
      var l = c.isDate(e, t.format, true);
      if (l) {
        if (t.start || t.end) {
          var r = typeof t.start == "string" ? t.start : n(t.start).val(), a = typeof t.end == "string" ? t.end : n(t.end).val();
          let h = c.isDate(r, t.format, true), o = c.isDate(a, t.format, true);
          r = new Date(l), h = h || r, o = o || r, r >= h && r <= o && (s = true);
        } else s = true;
        Array.isArray(t.blockDates) && t.blockDates.includes(e) && (s = false), Array.isArray(t.blockWeekdays) && t.blockWeekdays.includes(l.getDay()) && (s = false);
      }
    } else if (t.type === "time") if (t.start || t.end) {
      a = this.str2min(e);
      let h = this.str2min(t.start), o = this.str2min(t.end);
      h = h || a, o = o || a, a >= h && a <= o && (s = true);
    } else s = true;
    else t.type === "datetime" && (r = c.isDateTime(e, t.format, true)) && (l = t.format.split("|").map((h) => h.trim()), i ? (a = c.formatDate(r, l[0]), e = c.extend({}, t, { type: "date", format: l[0] }), this.inRange(a, e) && (s = true)) : (i = c.formatTime(r, l[1]), a = { type: "time", format: l[1], start: t.startTime, end: t.endTime }, this.inRange(i, a) && (s = true)));
    return s;
  }
  str2min(e) {
    var t;
    return typeof e != "string" || (t = e.split(":")).length !== 2 ? null : (t[0] = parseInt(t[0]), t[1] = parseInt(t[1]), e.indexOf("pm") !== -1 && t[0] !== 12 && (t[0] += 12), e.includes("am") && t[0] == 12 && (t[0] = 0), 60 * t[0] + t[1]);
  }
  min2str(s, t) {
    1440 <= s && (s %= 1440), s < 0 && (s = 1440 + s);
    var i = Math.floor(s / 60), s = (s % 60 < 10 ? "0" : "") + s % 60;
    return t = t || c.settings.timeFormat, t.indexOf("h24") !== -1 ? i + ":" + s : (i <= 12 ? i : i - 12) + ":" + s + " " + (12 <= i ? "pm" : "am");
  }
}
let F = new L(), Y = new rt(), Ne = new lt(), re = new at();
class nt extends ie {
  constructor(e) {
    super(e.name), this.box = null, this.name = null, this.routeData = {}, this.items = [], this.right = "", this.tooltip = "top|left", this.onClick = null, this.onMouseDown = null, this.onMouseUp = null, this.onMouseEnter = null, this.onMouseLeave = null, this.onRender = null, this.onRefresh = null, this.onResize = null, this.onDestroy = null, this.item_template = { id: null, type: "button", text: null, html: "", tooltip: null, count: null, hidden: false, disabled: false, checked: false, icon: null, route: null, arrow: null, style: null, group: null, items: null, selected: null, color: null, overlay: { anchorClass: "" }, onClick: null, onRefresh: null }, this.last = { badge: {} };
    var t = e.items;
    delete e.items, Object.assign(this, e), Array.isArray(t) && this.add(t, true), e.items = t, typeof this.box == "string" && (this.box = n(this.box).get(0)), this.box && this.render(this.box);
  }
  add(e, t) {
    this.insert(null, e, t);
  }
  insert(e, t, i) {
    (t = Array.isArray(t) ? t : [t]).forEach((s, l, r) => {
      typeof s == "string" && (s = r[l] = { id: s, text: s });
      var a, h = ["button", "check", "radio", "drop", "menu", "menu-radio", "menu-check", "color", "text-color", "html", "break", "spacer", "new-line"];
      if (h.includes(String(s.type))) if (s.id != null || ["break", "spacer", "new-line"].includes(s.type)) {
        if (s.type == null) console.log('ERROR: The parameter "type" is required but not supplied.', s);
        else if (c.checkUniqueId(s.id, this.items, "toolbar", this.name)) {
          let o = c.extend({}, this.item_template, s);
          o.type == "menu-check" ? (Array.isArray(o.selected) || (o.selected = []), Array.isArray(o.items) && o.items.forEach((d) => {
            (d = typeof d == "string" ? r[l] = { id: d, text: d } : d).checked && !o.selected.includes(d.id) && o.selected.push(d.id), !d.checked && o.selected.includes(d.id) && (d.checked = true), d.checked == null && (d.checked = false);
          })) : o.type == "menu-radio" && Array.isArray(o.items) && o.items.forEach((d, u, p) => {
            (d = typeof d == "string" ? p[u] = { id: d, text: d } : d).checked && o.selected == null ? o.selected = d.id : d.checked = false, d.checked || o.selected != d.id || (d.checked = true), d.checked == null && (d.checked = false);
          }), e == null ? this.items.push(o) : (a = this.get(e, true), this.items = this.items.slice(0, a).concat([o], this.items.slice(a))), o.line = o.line ?? 1, i !== true && this.refresh(o.id);
        }
      } else console.log('ERROR: The parameter "id" is required but not supplied.', s);
      else console.log('ERROR: The parameter "type" should be one of the following:', h, `, but ${s.type} is supplied.`, s);
    }), i !== true && this.resize();
  }
  remove() {
    let e = 0;
    return Array.from(arguments).forEach((t) => {
      var i = this.get(t);
      i && String(t).indexOf(":") == -1 && (e++, n(this.box).find("#tb_" + this.name + "_item_" + c.escapeId(i.id)).remove(), (t = this.get(i.id, true)) != null) && this.items.splice(t, 1);
    }), this.resize(), e;
  }
  set(e, t) {
    var i = this.get(e);
    return i != null && (Object.assign(i, t), this.refresh(String(e).split(":")[0]), true);
  }
  get(e, t) {
    if (arguments.length === 0) {
      var i = [];
      for (let a = 0; a < this.items.length; a++) this.items[a].id != null && i.push(this.items[a].id);
      return i;
    }
    var s = String(e).split(":");
    for (let a = 0; a < this.items.length; a++) {
      var l = this.items[a];
      if (["menu", "menu-radio", "menu-check"].includes(l.type) && s.length == 2 && l.id == s[0]) {
        let h = l.items;
        typeof h == "function" && (h = h(this));
        for (let o = 0; o < h.length; o++) {
          var r = h[o];
          if (r.id == s[1] || r.id == null && r.text == s[1]) return t == 1 ? o : r;
          if (Array.isArray(r.items)) {
            for (let d = 0; d < r.items.length; d++) if (r.items[d].id == s[1] || r.items[d].id == null && r.items[d].text == s[1]) return t == 1 ? o : r.items[d];
          }
        }
      } else if (l.id == s[0]) return t == 1 ? a : l;
    }
    return null;
  }
  setCount(e, t, i, s) {
    var l = n(this.box).find(`#tb_${this.name}_item_${c.escapeId(e)} .w2ui-tb-count > span`);
    0 < l.length ? (l.removeClass().addClass(i ?? "").text(t).get(0).style.cssText = s ?? "", this.last.badge[e] = { className: i ?? "", style: s ?? "" }, this.get(e).count = t) : (this.set(e, { count: t }), this.setCount(...arguments));
  }
  show() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var i = this.get(t);
      i && (i.hidden = false, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t), this.resize();
      });
    }, 15), e;
  }
  hide() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var i = this.get(t);
      i && (i.hidden = true, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t), this.tooltipHide(t), this.resize();
      });
    }, 15), e;
  }
  enable() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var i = this.get(t);
      i && (i.disabled = false, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t);
      });
    }, 15), e;
  }
  disable() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var i = this.get(t);
      i && (i.disabled = true, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t), this.tooltipHide(t);
      });
    }, 15), e;
  }
  check() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var i = this.get(t);
      i && String(t).indexOf(":") == -1 && (i.checked = true, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t);
      });
    }, 15), e;
  }
  uncheck() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var i = this.get(t);
      i && String(t).indexOf(":") == -1 && (["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(i.type) && i.checked && F.hide(this.name + "-drop"), i.checked = false, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t);
      });
    }, 15), e;
  }
  click(e, t) {
    var i = String(e).split(":");
    let s = this.get(i[0]), l = s && s.items ? c.normMenu.call(this, s.items, s) : [];
    if (1 < i.length) (i = this.get(e)) && !i.disabled && this.menuClick({ name: this.name, item: s, subItem: i, originalEvent: t });
    else if (s && !s.disabled && (i = this.trigger("click", { target: e ?? this.name, item: s, object: s, originalEvent: t }), i.isCancelled !== true)) {
      l = s && s.items ? c.normMenu.call(this, s.items, s) : [];
      let h = "#tb_" + this.name + "_item_" + c.escapeId(s.id);
      if (n(this.box).find(h).removeClass("down"), s.type == "radio") {
        for (let o = 0; o < this.items.length; o++) {
          var r = this.items[o];
          r != null && r.id != s.id && r.type === "radio" && r.group == s.group && r.checked && (r.checked = false, this.refresh(r.id));
        }
        s.checked = true, n(this.box).find(h).addClass("checked");
      }
      if (["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(s.type)) {
        if (this.tooltipHide(e), s.checked) return void F.hide(this.name + "-drop");
        setTimeout(() => {
          var o = (u, p) => {
            let m = this;
            return function() {
              m.set(u, { checked: false });
            };
          }, d = n(this.box).find("#tb_" + this.name + "_item_" + c.escapeId(s.id));
          if (c.isPlainObject(s.overlay) || (s.overlay = {}), s.type == "drop" && F.show(c.extend({ html: s.html, class: "w2ui-white", hideOn: ["doc-click"] }, s.overlay, { anchor: d[0], name: this.name + "-drop", data: { item: s, btn: h } })).hide(o(s.id)), ["menu", "menu-radio", "menu-check"].includes(s.type)) {
            let u = "normal";
            s.type == "menu-radio" && (u = "radio", l.forEach((p) => {
              s.selected == p.id ? p.checked = true : p.checked = false;
            })), s.type == "menu-check" && (u = "check", l.forEach((p) => {
              Array.isArray(s.selected) && s.selected.includes(p.id) ? p.checked = true : p.checked = false;
            })), Y.show(c.extend({ items: l }, s.overlay, { type: u, name: this.name + "-drop", anchor: d[0], data: { item: s, btn: h } })).hide(o(s.id)).remove((p) => {
              this.menuClick({ name: this.name, remove: true, item: s, subItem: p.detail.item, originalEvent: p });
            }).select((p) => {
              this.menuClick({ name: this.name, item: s, subItem: p.detail.item, originalEvent: p });
            });
          }
          ["color", "text-color"].includes(s.type) && Ne.show(c.extend({ color: s.color }, s.overlay, { anchor: d[0], name: this.name + "-drop", data: { item: s, btn: h } })).hide(o(s.id)).select((u) => {
            u.detail.color != null && this.colorClick({ name: this.name, item: s, color: u.detail.color });
          });
        }, 0);
      }
      if (["check", "menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(s.type) && (s.checked = !s.checked, s.checked ? n(this.box).find(h).addClass("checked") : n(this.box).find(h).removeClass("checked")), s.route) {
        let o = ("/" + s.route).replace(/\/{2,}/g, "/");
        var a = c.parseRoute(o);
        if (0 < a.keys.length) for (let d = 0; d < a.keys.length; d++) o = o.replace(new RegExp(":" + a.keys[d].name, "g"), this.routeData[a.keys[d].name]);
        setTimeout(() => {
          window.location.hash = o;
        }, 1);
      }
      this.tooltipShow(e), i.finish();
    }
  }
  scroll(e, t, i) {
    return new Promise((s, l) => {
      var r = n(this.box).find(`.w2ui-tb-line:nth-child(${t}) .w2ui-scroll-wrapper`), a = r.get(0).scrollLeft, h = r.find(".w2ui-tb-right").get(0), o = r.parent().get(0).getBoundingClientRect().width, d = a + parseInt(h.offsetLeft) + parseInt(h.clientWidth);
      switch (e) {
        case "left":
          (scroll = a - o + 50) <= 0 && (scroll = 0), r.get(0).scrollTo({ top: 0, left: scroll, behavior: i ? "atuo" : "smooth" });
          break;
        case "right":
          (scroll = a + o - 50) >= d - o && (scroll = d - o), r.get(0).scrollTo({ top: 0, left: scroll, behavior: i ? "atuo" : "smooth" });
      }
      setTimeout(() => {
        this.resize(), s();
      }, i ? 0 : 500);
    });
  }
  render(e) {
    var t = Date.now(), i = (typeof e == "string" && (e = n(e).get(0)), this.trigger("render", { target: this.name, box: e ?? this.box }));
    if (i.isCancelled !== true && (e != null && (0 < n(this.box).find(".w2ui-scroll-wrapper .w2ui-tb-right").length && n(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-toolbar").html(""), this.box = e), this.box)) {
      Array.isArray(this.right) || (this.right = [this.right]);
      let l = "", r = 0;
      for (let a = 0; a < this.items.length; a++) {
        var s = this.items[a];
        s != null && (s.id == null && (s.id = "item_" + a), s.caption != null && console.log("NOTICE: toolbar item.caption property is deprecated, please use item.text. Item -> ", s), s.hint != null && console.log("NOTICE: toolbar item.hint property is deprecated, please use item.tooltip. Item -> ", s), a !== 0 && s.type != "new-line" || (r++, l += `
                    <div class="w2ui-tb-line">
                        <div class="w2ui-scroll-wrapper w2ui-eaction" data-mousedown="resize">
                            <div class="w2ui-tb-right">${this.right[r - 1] ?? ""}</div>
                        </div>
                        <div class="w2ui-scroll-left w2ui-eaction" data-click='["scroll", "left", "${r}"]'></div>
                        <div class="w2ui-scroll-right w2ui-eaction" data-click='["scroll", "right", "${r}"]'></div>
                    </div>
                `), s.line = r);
      }
      return n(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-toolbar").html(l), 0 < n(this.box).length && (n(this.box)[0].style.cssText += this.style), c.bindEvents(n(this.box).find(".w2ui-tb-line .w2ui-eaction"), this), this.last.observeResize = new ResizeObserver(() => {
        this.resize();
      }), this.last.observeResize.observe(this.box), this.refresh(), this.resize(), i.finish(), Date.now() - t;
    }
  }
  refresh(e) {
    var t = Date.now(), i = this.trigger("refresh", { target: e ?? this.name, item: this.get(e) });
    if (i.isCancelled !== true) {
      let h;
      if (e == null) for (let o = 0; o < this.items.length; o++) {
        var s = this.items[o];
        s.id == null && (s.id = "item_" + o), this.refresh(s.id);
      }
      else {
        var l = this.get(e);
        if (l == null) return false;
        if (typeof l.onRefresh != "function" || (h = this.trigger("refresh", { target: e, item: l, object: l })).isCancelled !== true) {
          var r = `#tb_${this.name}_item_` + c.escapeId(l.id);
          let o = n(this.box).find(r);
          var a = this.getItemHTML(l);
          if (this.tooltipHide(e), l.type == "spacer" && n(this.box).find(".w2ui-tb-line:nth-child(" + l.line).find(".w2ui-tb-right").css("width", "auto"), o.length === 0) {
            e = parseInt(this.get(e, true)) + 1;
            let d = n(this.box).find(`#tb_${this.name}_item_` + c.escapeId(this.items[e] ? this.items[e].id : ""));
            d.length == 0 ? d = n(this.box).find(".w2ui-tb-line:nth-child(" + l.line).find(".w2ui-tb-right").before(a) : d.after(a), c.bindEvents(n(this.box).find(r), this);
          } else {
            n(this.box).find(r).replace(n.html(a));
            let d = n(this.box).find(r).get(0), u = (c.bindEvents(d, this), F.get(true));
            Object.keys(u).forEach((p) => {
              u[p].anchor == o.get(0) && (u[p].anchor = d);
            });
          }
          if (["menu", "menu-radio", "menu-check"].includes(l.type) && l.checked) {
            let d = Array.isArray(l.selected) ? l.selected : [l.selected];
            l.items.forEach((u) => {
              d.includes(u.id) ? u.checked = true : u.checked = false;
            }), Y.update(this.name + "-drop", l.items);
          }
          return typeof l.onRefresh == "function" && h.finish(), i.finish(), Date.now() - t;
        }
      }
    }
  }
  resize() {
    var e = Date.now(), t = this.trigger("resize", { target: this.name });
    if (t.isCancelled !== true) return n(this.box).find(".w2ui-tb-line").each((s) => {
      var s = n(s), l = (s.find(".w2ui-scroll-left, .w2ui-scroll-right").hide(), s.find(".w2ui-scroll-wrapper").get(0)), a = s.find(".w2ui-tb-right"), r = s.get(0).getBoundingClientRect().width, a = 0 < a.length ? a[0].offsetLeft + a[0].clientWidth : 0;
      r < a && (0 < l.scrollLeft && s.find(".w2ui-scroll-left").show(), r < a - l.scrollLeft) && s.find(".w2ui-scroll-right").show();
    }), t.finish(), Date.now() - e;
  }
  destroy() {
    var _a;
    var e = this.trigger("destroy", { target: this.name });
    e.isCancelled !== true && (0 < n(this.box).find(".w2ui-scroll-wrapper  .w2ui-tb-right").length && n(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-toolbar").html(""), n(this.box).html(""), (_a = this.last.observeResize) == null ? void 0 : _a.disconnect(), delete Z[this.name], e.finish());
  }
  getItemHTML(e) {
    let t = "", i = (e.caption != null && e.text == null && (e.text = e.caption), e.text == null && (e.text = ""), e.tooltip == null && e.hint != null && (e.tooltip = e.hint), e.tooltip == null && (e.tooltip = ""), typeof e.get == "function" || !Array.isArray(e.items) && typeof e.items != "function" || (e.get = function(a) {
      let h = e.items;
      return (h = typeof h == "function" ? e.items(e) : h).find((o) => o.id == a);
    }), ""), s = typeof e.text == "function" ? e.text.call(this, e) : e.text;
    e.icon && (i = e.icon, typeof e.icon == "function" && (i = e.icon.call(this, e)), i = `<div class="w2ui-tb-icon">${i = String(i).slice(0, 1) !== "<" ? `<span class="${i}"></span>` : i}</div>`);
    var l = ["w2ui-tb-button"];
    switch (e.checked && l.push("checked"), e.disabled && l.push("disabled"), e.hidden && l.push("hidden"), i || l.push("no-icon"), e.type) {
      case "color":
      case "text-color":
        typeof e.color == "string" && (e.color.slice(0, 1) == "#" && (e.color = e.color.slice(1)), [3, 6, 8].includes(e.color.length)) && (e.color = "#" + e.color), e.type == "color" && (s = `<span class="w2ui-tb-color-box" style="background-color: ${e.color != null ? e.color : "#fff"}"></span>
                           ` + (e.text ? `<div style="margin-left: 17px;">${c.lang(e.text)}</div>` : "")), e.type == "text-color" && (s = '<span style="color: ' + (e.color != null ? e.color : "#444") + ';">' + (e.text ? c.lang(e.text) : "<b>Aa</b>") + "</span>");
      case "menu":
      case "menu-check":
      case "menu-radio":
      case "button":
      case "check":
      case "radio":
      case "drop":
        var r = e.arrow === true || e.arrow !== false && ["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(e.type);
        t = `
                    <div id="tb_${this.name}_item_${e.id}" style="${e.hidden ? "display: none" : ""}"
                        class="${l.join(" ")} ${e.class || ""}"
                        ${e.disabled ? "" : `data-click='["click","${e.id}"]'
                               data-mouseenter='["mouseAction", "event", "this", "Enter", "${e.id}"]'
                               data-mouseleave='["mouseAction", "event", "this", "Leave", "${e.id}"]'
                               data-mousedown='["mouseAction", "event", "this", "Down", "${e.id}"]'
                               data-mouseup='["mouseAction", "event", "this", "Up", "${e.id}"]'`}
                    >
                        ${i}
                        ${s != "" ? `<div class="w2ui-tb-text" style="${e.style || ""}">
                                    ${c.lang(s)}
                                    ${e.count != null ? c.stripSpaces(`<span class="w2ui-tb-count">
                                                <span class="${this.last.badge[e.id] ? this.last.badge[e.id].className ?? "" : ""}"
                                                    style="${this.last.badge[e.id] ? this.last.badge[e.id].style ?? "" : ""}"
                                                >${e.count}</span>
                                           </span>`) : ""}
                                    ${r ? '<span class="w2ui-tb-down"><span></span></span>' : ""}
                                </div>` : ""}
                    </div>
                `;
        break;
      case "break":
        t = `<div id="tb_${this.name}_item_${e.id}" class="w2ui-tb-break"
                            style="${e.hidden ? "display: none" : ""}; ${e.style || ""}">
                            &#160;
                        </div>`;
        break;
      case "spacer":
        t = `<div id="tb_${this.name}_item_${e.id}" class="w2ui-tb-spacer"
                            style="${e.hidden ? "display: none" : ""}; ${e.style || ""}">
                        </div>`;
        break;
      case "html":
        t = `<div id="tb_${this.name}_item_${e.id}" class="w2ui-tb-html ${l.join(" ")}"
                            style="${e.hidden ? "display: none" : ""}; ${e.style || ""}">
                            ${typeof e.html == "function" ? e.html.call(this, e) : e.html}
                        </div>`;
    }
    return t;
  }
  tooltipShow(e) {
    if (this.tooltip != null) {
      var t = n(this.box).find("#tb_" + this.name + "_item_" + c.escapeId(e)).get(0), e = this.get(e), i = this.tooltip;
      let l = e.tooltip;
      typeof l == "function" && (l = l.call(this, e)), ["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(e.type) && e.checked == 1 || F.show({ anchor: t, name: this.name + "-tooltip", html: l, position: i });
    }
  }
  tooltipHide(e) {
    this.tooltip != null && F.hide(this.name + "-tooltip");
  }
  menuClick(e) {
    if (e.item && !e.item.disabled) {
      var t = this.trigger(e.remove !== true ? "click" : "remove", { target: e.item.id + ":" + e.subItem.id, item: e.item, subItem: e.subItem, originalEvent: e.originalEvent });
      if (t.isCancelled !== true) {
        let l = e.subItem, r = this.get(e.item.id), a = r.items;
        if (typeof a == "function" && (a = r.items()), r.type == "menu" && (r.selected = l.id), r.type == "menu-radio" && (r.selected = l.id, Array.isArray(a) && a.forEach((h) => {
          h.checked === true && delete h.checked, Array.isArray(h.items) && h.items.forEach((o) => {
            o.checked === true && delete o.checked;
          });
        }), l.checked = true), r.type == "menu-check") {
          if (Array.isArray(r.selected) || (r.selected = []), l.group == null) {
            var i = r.selected.indexOf(l.id);
            i == -1 ? (r.selected.push(l.id), l.checked = true) : (r.selected.splice(i, 1), l.checked = false);
          } else if (l.group !== false) {
            let h = [];
            i = r.selected.indexOf(l.id);
            let o = (d) => {
              d.forEach((u) => {
                var p;
                u.group === l.group && (p = r.selected.indexOf(u.id)) != -1 && (u.id != l.id && h.push(u.id), r.selected.splice(p, 1)), Array.isArray(u.items) && o(u.items);
              });
            };
            o(a), i == -1 && (r.selected.push(l.id), l.checked = true);
          }
        }
        if (typeof l.route == "string") {
          let h = l.route !== "" ? ("/" + l.route).replace(/\/{2,}/g, "/") : "";
          var s = c.parseRoute(h);
          if (0 < s.keys.length) for (let o = 0; o < s.keys.length; o++) this.routeData[s.keys[o].name] != null && (h = h.replace(new RegExp(":" + s.keys[o].name, "g"), this.routeData[s.keys[o].name]));
          setTimeout(() => {
            window.location.hash = h;
          }, 1);
        }
        this.refresh(e.item.id), t.finish();
      }
    }
  }
  colorClick(e) {
    var t;
    e.item && !e.item.disabled && (t = this.trigger("click", { target: e.item.id, item: e.item, color: e.color, final: e.final, originalEvent: e.originalEvent })).isCancelled !== true && (e.item.color = e.color, this.refresh(e.item.id), t.finish());
  }
  mouseAction(r, t, i, s) {
    var l = this.get(s), r = this.trigger("mouse" + i, { target: s, item: l, object: l, originalEvent: r });
    if (r.isCancelled !== true && !l.disabled && !l.hidden) {
      switch (i) {
        case "Enter":
          n(t).addClass("over"), this.tooltipShow(s);
          break;
        case "Leave":
          n(t).removeClass("over down"), this.tooltipHide(s);
          break;
        case "Down":
          n(t).addClass("down");
          break;
        case "Up":
          n(t).removeClass("down");
      }
      r.finish();
    }
  }
}
class _t extends ie {
  constructor(e) {
    super(e.name), this.box = null, this.name = null, this.active = null, this.reorder = false, this.flow = "down", this.tooltip = "top|left", this.tabs = [], this.routeData = {}, this.last = {}, this.right = "", this.style = "", this.onClick = null, this.onMouseEnter = null, this.onMouseLeave = null, this.onMouseDown = null, this.onMouseUp = null, this.onClose = null, this.onRender = null, this.onRefresh = null, this.onResize = null, this.onDestroy = null, this.tab_template = { id: null, text: null, route: null, hidden: false, disabled: false, closable: false, tooltip: null, style: "", onClick: null, onRefresh: null, onClose: null };
    var t = e.tabs;
    delete e.tabs, Object.assign(this, e), Array.isArray(t) && this.add(t), e.tabs = t, typeof this.box == "string" && (this.box = n(this.box).get(0)), this.box && this.render(this.box);
  }
  add(e) {
    return this.insert(null, e);
  }
  insert(e, t) {
    Array.isArray(t) || (t = [t]);
    let i = [];
    return t.forEach((s) => {
      var l, r;
      s.id == null ? console.log(`ERROR: The parameter "id" is required but not supplied. (obj: ${this.name})`) : c.checkUniqueId(s.id, this.tabs, "tabs", this.name) && (s = Object.assign({}, this.tab_template, s), e == null ? (this.tabs.push(s), i.push(this.animateInsert(null, s))) : (l = this.get(e, true), r = this.tabs[l].id, this.tabs.splice(l, 0, s), i.push(this.animateInsert(r, s))));
    }), Promise.all(i);
  }
  remove() {
    let e = 0;
    return Array.from(arguments).forEach((t) => {
      t = this.get(t), t && (e++, this.tabs.splice(this.get(t.id, true), 1), n(this.box).find(`#tabs_${this.name}_tab_` + c.escapeId(t.id)).remove());
    }), this.resize(), e;
  }
  select(e) {
    return this.active != e && this.get(e) != null && (this.active = e, this.refresh(), true);
  }
  set(e, t) {
    var i = this.get(e, true);
    return i != null && (c.extend(this.tabs[i], t), this.refresh(e), true);
  }
  get(e, t) {
    if (arguments.length === 0) {
      var i = [];
      for (let s = 0; s < this.tabs.length; s++) this.tabs[s].id != null && i.push(this.tabs[s].id);
      return i;
    }
    for (let s = 0; s < this.tabs.length; s++) if (this.tabs[s].id == e) return t === true ? s : this.tabs[s];
    return null;
  }
  show() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      t = this.get(t), t && t.hidden !== false && (t.hidden = false, e.push(t.id));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t), this.resize();
      });
    }, 15), e;
  }
  hide() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      t = this.get(t), t && t.hidden !== true && (t.hidden = true, e.push(t.id));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t), this.resize();
      });
    }, 15), e;
  }
  enable() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      t = this.get(t), t && t.disabled !== false && (t.disabled = false, e.push(t.id));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t);
      });
    }, 15), e;
  }
  disable() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      t = this.get(t), t && t.disabled !== true && (t.disabled = true, e.push(t.id));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t);
      });
    }, 15), e;
  }
  dragMove(e) {
    if (this.last.reordering) {
      let h = function(o, d) {
        o += d;
        let u = a.tabs[o];
        return u = u && u.hidden ? h(o, d) : u;
      }, a = this;
      var t = this.last.moving, l = this.tabs[t.index], i = h(t.index, 1), s = h(t.index, -1), l = n(this.box).find("#tabs_" + this.name + "_tab_" + c.escapeId(l.id));
      if (0 < t.divX && i) {
        var r = n(this.box).find("#tabs_" + this.name + "_tab_" + c.escapeId(i.id));
        let o = parseInt(l.get(0).clientWidth), d = parseInt(r.get(0).clientWidth);
        if (o = o < d ? Math.floor(o / 3) : Math.floor(d / 3), d -= o, t.divX > d) return i = this.tabs.indexOf(i), this.tabs.splice(t.index, 0, this.tabs.splice(i, 1)[0]), t.$tab.before(r.get(0)), t.$tab.css("opacity", 0), void Object.assign(this.last.moving, { index: i, divX: -o, x: e.pageX + o, left: t.left + t.divX + o });
      }
      if (t.divX < 0 && s) {
        r = n(this.box).find("#tabs_" + this.name + "_tab_" + c.escapeId(s.id));
        let o = parseInt(l.get(0).clientWidth), d = parseInt(r.get(0).clientWidth);
        o = o < d ? Math.floor(o / 3) : Math.floor(d / 3), d -= o, Math.abs(t.divX) > d && (i = this.tabs.indexOf(s), this.tabs.splice(t.index, 0, this.tabs.splice(i, 1)[0]), r.before(t.$tab), t.$tab.css("opacity", 0), Object.assign(t, { index: i, divX: o, x: e.pageX - o, left: t.left + t.divX - o }));
      }
    }
  }
  mouseAction(e, t, i) {
    var s = this.get(t), l = this.trigger("mouse" + e, { target: t, tab: s, object: s, originalEvent: i });
    if (l.isCancelled !== true && !s.disabled && !s.hidden) {
      switch (e) {
        case "Enter":
          this.tooltipShow(t);
          break;
        case "Leave":
          this.tooltipHide(t);
          break;
        case "Down":
          this.initReorder(t, i);
      }
      l.finish();
    }
  }
  tooltipShow(i) {
    var t = this.get(i), i = n(this.box).find("#tabs_" + this.name + "_tab_" + c.escapeId(i)).get(0);
    if (this.tooltip != null && !t.disabled && !this.last.reordering) {
      var s = this.tooltip;
      let l = t.tooltip;
      typeof l == "function" && (l = l.call(this, t)), F.show({ anchor: i, name: this.name + "_tooltip", html: l, position: s });
    }
  }
  tooltipHide(e) {
    this.tooltip != null && F.hide(this.name + "_tooltip");
  }
  getTabHTML(e) {
    if (e = this.get(e, true), e = this.tabs[e], e == null) return false;
    e.text == null && e.caption != null && (e.text = e.caption), e.tooltip == null && e.hint != null && (e.tooltip = e.hint), e.caption != null && console.log("NOTICE: tabs tab.caption property is deprecated, please use tab.text. Tab -> ", e), e.hint != null && console.log("NOTICE: tabs tab.hint property is deprecated, please use tab.tooltip. Tab -> ", e);
    let t = e.text, i = ((t = typeof t == "function" ? t.call(this, e) : t) == null && (t = ""), ""), s = "";
    return e.hidden && (s += "display: none;"), e.disabled && (s += "opacity: 0.2;"), e.closable && !e.disabled && (i = `<div class="w2ui-tab-close w2ui-eaction ${this.active === e.id ? "active" : ""}"
                data-mousedown="stop" data-mouseup="clickClose|${e.id}|event">
            </div>`), `
            <div id="tabs_${this.name}_tab_${e.id}" style="${s} ${e.style}"
                class="w2ui-tab w2ui-eaction ${this.active === e.id ? "active" : ""} ${e.closable ? "closable" : ""} ${e.class || ""}"
                data-mouseenter="mouseAction|Enter|${e.id}|event]"
                data-mouseleave="mouseAction|Leave|${e.id}|event]"
                data-mousedown="mouseAction|Down|${e.id}|event"
                data-mouseup="mouseAction|Up|${e.id}|event"
                data-click="click|${e.id}|event"
               >
                    ${c.lang(t) + i}
            </div>`;
  }
  refresh(e) {
    var t = Date.now(), i = (this.flow == "up" ? n(this.box).addClass("w2ui-tabs-up") : n(this.box).removeClass("w2ui-tabs-up"), this.trigger("refresh", { target: e ?? this.name, object: this.get(e) }));
    if (i.isCancelled !== true) {
      if (e == null) for (let r = 0; r < this.tabs.length; r++) this.refresh(this.tabs[r].id);
      else {
        var s = "#tabs_" + this.name + "_tab_" + c.escapeId(e), l = n(this.box).find(s), e = this.getTabHTML(e);
        l.length === 0 ? n(this.box).find("#tabs_" + this.name + "_right").before(e) : n(this.box).find(".tab-animate-insert").length == 0 && l.replace(e), c.bindEvents(n(this.box).find(s + `, ${s} .w2ui-eaction`), this);
      }
      return n(this.box).find("#tabs_" + this.name + "_right").html(this.right), i.finish(), Date.now() - t;
    }
  }
  render(e) {
    var t = Date.now(), i = (typeof e == "string" && (e = n(e).get(0)), this.trigger("render", { target: this.name, box: e ?? this.box }));
    if (i.isCancelled !== true) return e != null && (0 < n(this.box).find("#tabs_" + this.name + "_right").length && n(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-tabs").html(""), this.box = e), !!this.box && (e = `
            <div class="w2ui-tabs-line"></div>
            <div class="w2ui-scroll-wrapper w2ui-eaction" data-mousedown="resize">
                <div id="tabs_${this.name}_right" class="w2ui-tabs-right">${this.right}</div>
            </div>
            <div class="w2ui-scroll-left w2ui-eaction" data-click='["scroll","left"]'></div>
            <div class="w2ui-scroll-right w2ui-eaction" data-click='["scroll","right"]'></div>`, n(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-tabs").html(e), 0 < n(this.box).length && (n(this.box)[0].style.cssText += this.style), c.bindEvents(n(this.box).find(".w2ui-eaction"), this), this.last.observeResize = new ResizeObserver(() => {
      this.resize();
    }), this.last.observeResize.observe(this.box), i.finish(), this.refresh(), this.resize(), Date.now() - t);
  }
  initReorder(e, t) {
    if (this.reorder) {
      let i = this, s = n(this.box).find("#tabs_" + this.name + "_tab_" + c.escapeId(e)), l = this.get(e, true), r = n(s.get(0).cloneNode(true)), a;
      r.attr("id", "#tabs_" + this.name + "_tab_ghost"), this.last.moving = { index: l, indexFrom: l, $tab: s, $ghost: r, divX: 0, left: s.get(0).getBoundingClientRect().left, parentX: n(this.box).get(0).getBoundingClientRect().left, x: t.pageX, opacity: s.css("opacity") }, n(document).off(".w2uiTabReorder").on("mousemove.w2uiTabReorder", function(h) {
        if (!i.last.reordering) {
          if ((a = i.trigger("reorder", { target: i.tabs[l].id, indexFrom: l, tab: i.tabs[l] })).isCancelled === true) return;
          F.hide(this.name + "_tooltip"), i.last.reordering = true, r.addClass("moving"), r.css({ "pointer-events": "none", position: "absolute", left: s.get(0).getBoundingClientRect().left }), s.css("opacity", 0), n(i.box).find(".w2ui-scroll-wrapper").append(r.get(0)), n(i.box).find(".w2ui-tab-close").hide();
        }
        i.last.moving.divX = h.pageX - i.last.moving.x, r.css("left", i.last.moving.left - i.last.moving.parentX + i.last.moving.divX + "px"), i.dragMove(h);
      }).on("mouseup.w2uiTabReorder", function() {
        n(document).off(".w2uiTabReorder"), r.css({ transition: "0.1s", left: i.last.moving.$tab.get(0).getBoundingClientRect().left - i.last.moving.parentX }), n(i.box).find(".w2ui-tab-close").show(), setTimeout(() => {
          r.remove(), s.css({ opacity: i.last.moving.opacity }), i.last.reordering && a.finish({ indexTo: i.last.moving.index }), i.last.reordering = false;
        }, 100);
      });
    }
  }
  scroll(e, t) {
    return new Promise((i, s) => {
      var l = n(this.box).find(".w2ui-scroll-wrapper"), r = l.get(0).scrollLeft, a = l.find(".w2ui-tabs-right").get(0), h = l.parent().get(0).getBoundingClientRect().width, o = r + parseInt(a.offsetLeft) + parseInt(a.clientWidth);
      switch (e) {
        case "left": {
          let d = r - h + 50;
          d <= 0 && (d = 0), l.get(0).scrollTo({ top: 0, left: d, behavior: t ? "atuo" : "smooth" });
          break;
        }
        case "right": {
          let d = r + h - 50;
          d >= o - h && (d = o - h), l.get(0).scrollTo({ top: 0, left: d, behavior: t ? "atuo" : "smooth" });
          break;
        }
      }
      setTimeout(() => {
        this.resize(), i();
      }, t ? 0 : 350);
    });
  }
  scrollIntoView(e, t) {
    return new Promise((i, s) => {
      e == null && (e = this.active), this.get(e) != null && (n(this.box).find("#tabs_" + this.name + "_tab_" + c.escapeId(e)).get(0).scrollIntoView({ block: "start", inline: "center", behavior: t ? "atuo" : "smooth" }), setTimeout(() => {
        this.resize(), i();
      }, t ? 0 : 500));
    });
  }
  resize() {
    var e = Date.now();
    if (this.box != null) {
      var t, i, s, l, r = this.trigger("resize", { target: this.name });
      if (r.isCancelled !== true) return (t = n(this.box)).find(".w2ui-scroll-left, .w2ui-scroll-right").hide(), i = t.find(".w2ui-scroll-wrapper").get(0), l = t.find(".w2ui-tabs-right"), (s = t.get(0).getBoundingClientRect().width) < (l = 0 < l.length ? l[0].offsetLeft + l[0].clientWidth : 0) && (0 < i.scrollLeft && t.find(".w2ui-scroll-left").show(), s < l - i.scrollLeft) && t.find(".w2ui-scroll-right").show(), r.finish(), Date.now() - e;
    }
  }
  destroy() {
    var _a;
    var e = this.trigger("destroy", { target: this.name });
    e.isCancelled !== true && (0 < n(this.box).find("#tabs_" + this.name + "_right").length && n(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-tabs").html(""), (_a = this.last.observeResize) == null ? void 0 : _a.disconnect(), delete Z[this.name], e.finish());
  }
  click(e, t) {
    var i = this.get(e);
    if (i == null || i.disabled || this.last.reordering) return false;
    if (e = this.trigger("click", { target: e, tab: i, object: i, originalEvent: t }), e.isCancelled !== true) {
      if (n(this.box).find("#tabs_" + this.name + "_tab_" + c.escapeId(this.active)).removeClass("active"), this.active = i.id, n(this.box).find("#tabs_" + this.name + "_tab_" + c.escapeId(this.active)).addClass("active"), typeof i.route == "string") {
        let l = i.route !== "" ? ("/" + i.route).replace(/\/{2,}/g, "/") : "";
        var s = c.parseRoute(l);
        if (0 < s.keys.length) for (let r = 0; r < s.keys.length; r++) this.routeData[s.keys[r].name] != null && (l = l.replace(new RegExp(":" + s.keys[r].name, "g"), this.routeData[s.keys[r].name]));
        setTimeout(() => {
          window.location.hash = l;
        }, 1);
      }
      e.finish();
    }
  }
  clickClose(e, t) {
    var i = this.get(e);
    if (i == null || i.disabled) return false;
    let s = this.trigger("close", { target: e, object: i, tab: i, originalEvent: t });
    s.isCancelled !== true && (this.animateClose(e).then(() => {
      this.remove(e), s.finish(), this.refresh();
    }), t) && t.stopPropagation();
  }
  animateClose(e) {
    return new Promise((t, i) => {
      var s = n(this.box).find("#tabs_" + this.name + "_tab_" + c.escapeId(e)), l = parseInt(s.get(0).clientWidth || 0);
      let r = s.replace(`<div class="tab-animate-close" style="display: inline-block; flex-shrink: 0; width: ${l}px; transition: width 0.25s"></div>`);
      setTimeout(() => {
        r.css({ width: "0px" });
      }, 1), setTimeout(() => {
        r.remove(), this.resize(), t();
      }, 500);
    });
  }
  animateInsert(e, t) {
    return new Promise((i, s) => {
      let l = n(this.box).find("#tabs_" + this.name + "_tab_" + c.escapeId(e)), r = n.html(this.getTabHTML(t.id));
      if (l.length == 0) (l = n(this.box).find("#tabs_tabs_right")).before(r), this.resize();
      else {
        r.css({ opacity: 0 }), n(this.box).find("#tabs_tabs_right").before(r.get(0));
        let a = n(this.box).find("#" + r.attr("id")).get(0).clientWidth ?? 0, h = n.html('<div class="tab-animate-insert" style="flex-shrink: 0; width: 0; transition: width 0.25s"></div>');
        l.before(h), r.hide(), h.before(r[0]), setTimeout(() => {
          h.css({ width: a + "px" });
        }, 1), setTimeout(() => {
          h.remove(), r.css({ opacity: 1 }).show(), this.refresh(t.id), this.resize(), i();
        }, 500);
      }
    });
  }
}
class Ct extends ie {
  constructor(e) {
    if (super(e.name), this.name = null, this.box = null, this.columns = [], this.columnGroups = [], this.records = [], this.summary = [], this.searches = [], this.toolbar = {}, this.ranges = [], this.contextMenu = [], this.searchMap = {}, this.searchData = [], this.sortMap = {}, this.sortData = [], this.savedSearches = [], this.defaultSearches = [], this.total = 0, this.recid = null, this.last = { field: "", label: "", logic: "AND", search: "", searchIds: [], selection: { indexes: [], columns: {} }, saved_sel: null, multi: false, scrollTop: 0, scrollLeft: 0, colStart: 0, colEnd: 0, fetch: { action: "", offset: null, start: 0, response: 0, options: null, controller: null, loaded: false, hasMore: false }, pull_more: false, pull_refresh: true, range_start: null, range_end: null, sel_ind: null, sel_col: null, sel_type: null, sel_recid: null, idCache: {}, move: null, cancelClick: null, inEditMode: false, _edit: null, kbd_timer: null, marker_timer: null, click_time: null, click_recid: null, bubbleEl: null, colResizing: false, tmp: null, copy_event: null, userSelect: "", columnDrag: false, state: null, show_extra: 0, toolbar_height: 0 }, this.header = "", this.url = "", this.limit = 100, this.offset = 0, this.postData = {}, this.routeData = {}, this.httpHeaders = {}, this.show = { header: false, toolbar: false, footer: false, columnMenu: true, columnHeaders: true, lineNumbers: false, expandColumn: false, selectColumn: false, emptyRecords: true, toolbarReload: true, toolbarColumns: false, toolbarSearch: true, toolbarAdd: false, toolbarEdit: false, toolbarDelete: false, toolbarSave: false, searchAll: true, searchLogic: true, searchHiddenMsg: false, searchSave: true, statusRange: true, statusBuffered: false, statusRecordID: true, statusSelection: true, statusResponse: true, statusSort: false, statusSearch: false, recordTitles: false, selectionBorder: true, skipRecords: true, saveRestoreState: true }, this.stateId = null, this.hasFocus = false, this.autoLoad = true, this.fixedBody = true, this.recordHeight = 32, this.lineNumberWidth = 34, this.keyboard = true, this.selectType = "row", this.liveSearch = false, this.multiSearch = true, this.multiSelect = true, this.multiSort = true, this.reorderColumns = false, this.reorderRows = false, this.showExtraOnSearch = 0, this.markSearch = true, this.columnTooltip = "top|bottom", this.disableCVS = false, this.nestedFields = true, this.vs_start = 150, this.vs_extra = 5, this.style = "", this.tabIndex = null, this.dataType = null, this.parser = null, this.advanceOnEdit = true, this.useLocalStorage = true, this.colTemplate = { text: "", field: "", size: null, min: 20, max: null, gridMinWidth: null, sizeCorrected: null, sizeCalculated: null, sizeOriginal: null, sizeType: null, hidden: false, sortable: false, sortMode: null, searchable: false, resizable: true, hideable: true, autoResize: null, attr: "", style: "", render: null, title: null, tooltip: null, editable: {}, frozen: false, info: null, clipboardCopy: false }, this.stateColProps = { text: false, field: true, size: true, min: false, max: false, gridMinWidth: false, sizeCorrected: false, sizeCalculated: true, sizeOriginal: true, sizeType: true, hidden: true, sortable: false, sortMode: true, searchable: false, resizable: false, hideable: false, autoResize: false, attr: false, style: false, render: false, title: false, tooltip: false, editable: false, frozen: true, info: false, clipboardCopy: false }, this.msgDelete = "Are you sure you want to delete ${count} ${records}?", this.msgNotJSON = "Returned data is not in valid JSON format.", this.msgHTTPError = "HTTP error. See console for more details.", this.msgServerError = "Server error", this.msgRefresh = "Refreshing...", this.msgNeedReload = "Your remote data source record count has changed, reloading from the first record.", this.msgEmpty = "", this.buttons = { reload: { type: "button", id: "w2ui-reload", icon: "w2ui-icon-reload", tooltip: "Reload data in the list" }, columns: { type: "menu-check", id: "w2ui-column-on-off", icon: "w2ui-icon-columns", tooltip: "Show/hide columns", overlay: { align: "none" } }, search: { type: "html", id: "w2ui-search", html: '<div class="w2ui-icon w2ui-icon-search w2ui-search-down w2ui-action" data-click="searchShowFields"></div>' }, add: { type: "button", id: "w2ui-add", text: "Add New", tooltip: "Add new record", icon: "w2ui-icon-plus" }, edit: { type: "button", id: "w2ui-edit", text: "Edit", tooltip: "Edit selected record", icon: "w2ui-icon-pencil", batch: 1, disabled: true }, delete: { type: "button", id: "w2ui-delete", text: "Delete", tooltip: "Delete selected records", icon: "w2ui-icon-cross", batch: true, disabled: true }, save: { type: "button", id: "w2ui-save", text: "Save", tooltip: "Save changed records", icon: "w2ui-icon-check" } }, this.operators = { text: ["is", "begins", "contains", "ends"], number: ["=", "between", ">", "<", ">=", "<="], date: ["is", { oper: "less", text: "before" }, { oper: "more", text: "since" }, "between"], list: ["is"], hex: ["is", "between"], color: ["is", "begins", "contains", "ends"], enum: ["in", "not in"] }, this.defaultOperator = { text: "begins", number: "=", date: "is", list: "is", enum: "in", hex: "begins", color: "begins" }, this.operatorsMap = { text: "text", int: "number", float: "number", money: "number", currency: "number", percent: "number", hex: "hex", alphanumeric: "text", color: "color", date: "date", time: "date", datetime: "date", list: "list", combo: "text", enum: "enum", file: "enum", select: "list", radio: "list", checkbox: "list", toggle: "list" }, this.onAdd = null, this.onEdit = null, this.onRequest = null, this.onLoad = null, this.onDelete = null, this.onSave = null, this.onSelect = null, this.onClick = null, this.onDblClick = null, this.onContextMenu = null, this.onContextMenuClick = null, this.onColumnClick = null, this.onColumnDblClick = null, this.onColumnContextMenu = null, this.onColumnResize = null, this.onColumnAutoResize = null, this.onSort = null, this.onSearch = null, this.onSearchOpen = null, this.onChange = null, this.onRestore = null, this.onExpand = null, this.onCollapse = null, this.onError = null, this.onKeydown = null, this.onToolbar = null, this.onColumnOnOff = null, this.onCopy = null, this.onPaste = null, this.onSelectionExtend = null, this.onEditField = null, this.onRender = null, this.onRefresh = null, this.onReload = null, this.onResize = null, this.onDestroy = null, this.onStateSave = null, this.onStateRestore = null, this.onFocus = null, this.onBlur = null, this.onReorderRow = null, this.onSearchSave = null, this.onSearchRemove = null, this.onSearchSelect = null, this.onColumnSelect = null, this.onColumnDragStart = null, this.onColumnDragEnd = null, this.onResizerDblClick = null, this.onMouseEnter = null, this.onMouseLeave = null, c.extend(this, e), Array.isArray(this.records)) {
      let t = [];
      this.records.forEach((i, s) => {
        var _a;
        i[this.recid] != null && (i.recid = i[this.recid]), i.recid == null && console.log("ERROR: Cannot add records without recid. (obj: " + this.name + ")"), ((_a = i.w2ui) == null ? void 0 : _a.summary) === true && (this.summary.push(i), t.push(s));
      }), t.sort();
      for (let i = t.length - 1; 0 <= i; i--) this.records.splice(t[i], 1);
    }
    Array.isArray(this.columns) && this.columns.forEach((t, i) => {
      if (t = c.extend({}, this.colTemplate, t), i = (this.columns[i] = t).searchable, i != null && i !== false && this.getSearch(t.field) == null) if (c.isPlainObject(i)) this.addSearch(c.extend({ field: t.field, label: t.text, type: "text" }, i));
      else {
        let s = t.searchable, l = "";
        t.searchable === true && (s = "text", l = 'size="20"'), this.addSearch({ field: t.field, label: t.text, type: s, attr: l });
      }
    }), Array.isArray(this.defaultSearches) && this.defaultSearches.forEach((t, i) => {
      t.id = "default-" + i, t.icon ?? (t.icon = "w2ui-icon-search");
    }), e = this.cache("searches"), Array.isArray(e) && e.forEach((t) => {
      this.savedSearches.push({ id: t.id ?? "none", text: t.text ?? "none", icon: "w2ui-icon-search", remove: true, logic: t.logic ?? "AND", data: t.data ?? [] });
    }), typeof this.box == "string" && (this.box = n(this.box).get(0)), this.box && this.render(this.box);
  }
  add(e, t) {
    var _a, _b;
    Array.isArray(e) || (e = [e]);
    let i = 0;
    for (let l = 0; l < e.length; l++) {
      var s = e[l];
      s[this.recid] != null && (s.recid = s[this.recid]), s.recid == null ? console.log("ERROR: Cannot add record without recid. (obj: " + this.name + ")") : (((_a = s.w2ui) == null ? void 0 : _a.summary) === true ? t ? this.summary.unshift(s) : this.summary.push(s) : t ? this.records.unshift(s) : this.records.push(s), i++);
    }
    return (((_b = this.url) == null ? void 0 : _b.get) ?? this.url) || (this.total = this.records.length, this.localSort(false, true), this.localSearch()), this.refresh(), i;
  }
  find(e, t, i) {
    var s, l = [];
    let r = false;
    for (s in e = e ?? {}) String(s).indexOf(".") != -1 && (r = true);
    var a = i ? this.last.range_start : 0;
    let h = i ? this.last.range_end + 1 : this.records.length;
    h > this.records.length && (h = this.records.length);
    for (let d = a; d < h; d++) {
      let u = true;
      for (var o in e) {
        let p = this.records[d][o];
        r && String(o).indexOf(".") != -1 && (p = this.parseField(this.records[d], o)), e[o] == "not-null" ? p != null && p !== "" || (u = false) : e[o] != p && (u = false);
      }
      u && t !== true && l.push(this.records[d].recid), u && t === true && l.push(d);
    }
    return l;
  }
  set(e, t, i) {
    if (typeof e == "object" && e !== null && (i = t, t = e, e = null), e == null) {
      for (let l = 0; l < this.records.length; l++) c.extend(this.records[l], t);
      i !== true && this.refresh();
    } else {
      var s = this.get(e, true);
      if (s == null) return false;
      !this.records[s] || this.records[s].recid != e ? c.extend(this.summary[s], t) : c.extend(this.records[s], t), i !== true && this.refreshRow(e, s);
    }
    return true;
  }
  get(e, t) {
    if (Array.isArray(e)) {
      var i = [];
      for (let r = 0; r < e.length; r++) {
        var s = this.get(e[r], t);
        s !== null && i.push(s);
      }
      return i;
    }
    {
      let r = this.last.idCache;
      r || (this.last.idCache = r = {});
      var l = r[e];
      if (typeof l == "number") {
        if (0 <= l && l < this.records.length && this.records[l].recid == e) return t === true ? l : this.records[l];
        if (0 <= (l = ~l) && l < this.summary.length && this.summary[l].recid == e) return t === true ? l : this.summary[l];
        this.last.idCache = r = {};
      }
      for (let a = 0; a < this.records.length; a++) if (this.records[a].recid == e) return r[e] = a, t === true ? a : this.records[a];
      for (let a = 0; a < this.summary.length; a++) if (this.summary[a].recid == e) return r[e] = ~a, t === true ? a : this.summary[a];
      return null;
    }
  }
  getFirst(e) {
    if (this.records.length == 0) return null;
    let t = this.records[0];
    var i = this.last.searchIds;
    return t = 0 < this.searchData.length ? Array.isArray(i) && 0 < i.length ? this.records[i[e || 0]] : null : t;
  }
  remove() {
    var _a;
    let e = 0;
    for (let t = 0; t < arguments.length; t++) {
      for (let i = this.records.length - 1; 0 <= i; i--) this.records[i].recid == arguments[t] && (this.records.splice(i, 1), e++);
      for (let i = this.summary.length - 1; 0 <= i; i--) this.summary[i].recid == arguments[t] && (this.summary.splice(i, 1), e++);
    }
    return (((_a = this.url) == null ? void 0 : _a.get) ?? this.url) || (this.localSort(false, true), this.localSearch()), this.refresh(), e;
  }
  addColumn(e, t) {
    let i = 0;
    arguments.length == 1 ? (t = e, e = this.columns.length) : (e = typeof e == "string" ? this.getColumn(e, true) : e) == null && (e = this.columns.length), Array.isArray(t) || (t = [t]);
    for (let l = 0; l < t.length; l++) {
      var s = c.extend({}, this.colTemplate, t[l]);
      if (this.columns.splice(e, 0, s), t[l].searchable) {
        let r = t[l].searchable, a = "";
        t[l].searchable === true && (r = "text", a = 'size="20"'), this.addSearch({ field: t[l].field, label: t[l].text, type: r, attr: a });
      }
      e++, i++;
    }
    return this.refresh(), i;
  }
  removeColumn() {
    let e = 0;
    for (let t = 0; t < arguments.length; t++) for (let i = this.columns.length - 1; 0 <= i; i--) this.columns[i].field == arguments[t] && (this.columns[i].searchable && this.removeSearch(arguments[t]), this.columns.splice(i, 1), e++);
    return this.refresh(), e;
  }
  getColumn(e, t) {
    if (arguments.length === 0) {
      var i = [];
      for (let s = 0; s < this.columns.length; s++) i.push(this.columns[s].field);
      return i;
    }
    for (let s = 0; s < this.columns.length; s++) if (this.columns[s].field == e) return t === true ? s : this.columns[s];
    return null;
  }
  updateColumn(e, t) {
    let i = 0;
    return (e = Array.isArray(e) ? e : [e]).forEach((s) => {
      this.columns.forEach((l) => {
        if (l.field == s) {
          let r = c.clone(t);
          Object.keys(r).forEach((a) => {
            typeof r[a] == "function" && (r[a] = r[a](l)), l[a] != r[a] && i++;
          }), c.extend(l, r);
        }
      });
    }), 0 < i && this.refresh(), i;
  }
  toggleColumn() {
    return this.updateColumn(Array.from(arguments), { hidden(e) {
      return !e.hidden;
    } });
  }
  showColumn() {
    return this.updateColumn(Array.from(arguments), { hidden: false });
  }
  hideColumn() {
    return this.updateColumn(Array.from(arguments), { hidden: true });
  }
  addSearch(e, t) {
    let i = 0;
    arguments.length == 1 ? (t = e, e = this.searches.length) : (e = typeof e == "string" ? this.getSearch(e, true) : e) == null && (e = this.searches.length), Array.isArray(t) || (t = [t]);
    for (let s = 0; s < t.length; s++) this.searches.splice(e, 0, t[s]), e++, i++;
    return this.searchClose(), i;
  }
  removeSearch() {
    let e = 0;
    for (let t = 0; t < arguments.length; t++) for (let i = this.searches.length - 1; 0 <= i; i--) this.searches[i].field == arguments[t] && (this.searches.splice(i, 1), e++);
    return this.searchClose(), e;
  }
  getSearch(e, t) {
    if (arguments.length === 0) {
      var i = [];
      for (let s = 0; s < this.searches.length; s++) i.push(this.searches[s].field);
      return i;
    }
    for (let s = 0; s < this.searches.length; s++) if (this.searches[s].field == e) return t === true ? s : this.searches[s];
    return null;
  }
  toggleSearch() {
    let e = 0;
    for (let t = 0; t < arguments.length; t++) for (let i = this.searches.length - 1; 0 <= i; i--) this.searches[i].field == arguments[t] && (this.searches[i].hidden = !this.searches[i].hidden, e++);
    return this.searchClose(), e;
  }
  showSearch() {
    let e = 0;
    for (let t = 0; t < arguments.length; t++) for (let i = this.searches.length - 1; 0 <= i; i--) this.searches[i].field == arguments[t] && this.searches[i].hidden !== false && (this.searches[i].hidden = false, e++);
    return this.searchClose(), e;
  }
  hideSearch() {
    let e = 0;
    for (let t = 0; t < arguments.length; t++) for (let i = this.searches.length - 1; 0 <= i; i--) this.searches[i].field == arguments[t] && this.searches[i].hidden !== true && (this.searches[i].hidden = true, e++);
    return this.searchClose(), e;
  }
  getSearchData(e) {
    for (let t = 0; t < this.searchData.length; t++) if (this.searchData[t].field == e) return this.searchData[t];
    return null;
  }
  localSort(e, t) {
    var _a, _b, _c;
    let i = this;
    if (((_a = this.url) == null ? void 0 : _a.get) ?? this.url) console.log("ERROR: grid.localSort can only be used on local data source, grid.url should be empty.");
    else if (Object.keys(this.sortData).length !== 0) {
      let h = function(u) {
        var p;
        return u.w2ui && u.w2ui.parent_recid != null ? u.w2ui._path || ((p = i.get(u.w2ui.parent_recid)) ? h(p).concat(u) : (console.log("ERROR: no parent record: " + u.w2ui.parent_recid), [u])) : [u];
      }, o = function(u, p) {
        if (u === p) return 0;
        for (let w = 0; w < i.sortData.length; w++) {
          var m = i.sortData[w].field, f = i.sortData[w].field_ || m;
          let b = u[f], g = p[f];
          if (String(m).indexOf(".") != -1 && (b = i.parseField(u, f), g = i.parseField(p, f)), f = i.getColumn(m), m = (f && 0 < Object.keys(f.editable).length && (c.isPlainObject(b) && b.text && (b = b.text), c.isPlainObject(g)) && g.text && (g = g.text), d(b, g, w, i.sortData[w].direction, f.sortMode || "default")), m !== 0) return m;
        }
        return d(u.recid, p.recid, 0, "asc");
      }, d = function(u, p, m, f, w) {
        if (u === p) return 0;
        if ((u == null || u === "") && p != null && p !== "") return 1;
        if (u != null && u !== "" && (p == null || p === "")) return -1;
        if (f = f.toLowerCase() === "asc" ? 1 : -1, typeof u != typeof p) return typeof p < typeof u ? f : -f;
        if (u.constructor.name != p.constructor.name) return u.constructor.name > p.constructor.name ? f : -f;
        u && typeof u == "object" && (u = u.valueOf()), p && typeof p == "object" && (p = p.valueOf());
        var b = {}.toString;
        switch (u && typeof u == "object" && u.toString != b && (u = String(u)), p && typeof p == "object" && p.toString != b && (p = String(p)), typeof u == "string" && (u = u.toLowerCase().trim()), typeof p == "string" && (p = p.toLowerCase().trim()), w) {
          case "natural":
            w = c.naturalCompare;
            break;
          case "i18n":
            w = c.i18nCompare;
        }
        return typeof w == "function" ? w(u, p) * f : p < u ? f : u < p ? -f : 0;
      }, a = Date.now();
      this.selectionSave(), this.prepareData(), t || this.reset();
      for (let u = 0; u < this.sortData.length; u++) {
        var s = this.getColumn(this.sortData[u].field);
        if (!s) return;
        typeof s.render == "string" && (["date", "age"].indexOf(s.render.split(":")[0]) != -1 && (this.sortData[u].field_ = s.field + "_"), ["time"].indexOf(s.render.split(":")[0]) != -1) && (this.sortData[u].field_ = s.field + "_");
      }
      for (let u = 0; u < i.records.length; u++) {
        var l = i.records[u];
        ((_b = l.w2ui) == null ? void 0 : _b.parent_recid) != null && (l.w2ui._path = h(l));
      }
      this.records.sort((u, p) => {
        if (!(u.w2ui && u.w2ui.parent_recid != null || p.w2ui && p.w2ui.parent_recid != null)) return o(u, p);
        var m = h(u), f = h(p);
        for (let b = 0; b < Math.min(m.length, f.length); b++) {
          var w = o(m[b], f[b]);
          if (w !== 0) return w;
        }
        return m.length > f.length ? 1 : m.length < f.length ? -1 : (console.log("ERROR: two paths should not be equal."), 0);
      });
      for (let u = 0; u < i.records.length; u++) {
        var r = i.records[u];
        ((_c = r.w2ui) == null ? void 0 : _c.parent_recid) != null && (r.w2ui._path = null);
      }
      return this.selectionRestore(t), a = Date.now() - a, e !== true && this.show.statusSort && setTimeout(() => {
        this.status(c.lang("Sorting took ${count} seconds", { count: a / 1e3 }));
      }, 10), a;
    }
  }
  localSearch(e) {
    var _a;
    let t = this;
    var i = ((_a = this.url) == null ? void 0 : _a.get) ?? this.url;
    if (i) console.log("ERROR: grid.localSearch can only be used on local data source, grid.url should be empty.");
    else {
      let l = Date.now(), r = {}.toString, a = {};
      if (this.total = this.records.length, this.last.searchIds = [], this.prepareData(), 0 < this.searchData.length && !i) {
        for (let h = this.total = 0; h < this.records.length; h++) {
          var s = this.records[h];
          if (function o(d) {
            var _a2, _b;
            let u = 0, p, m, f, w, b = false;
            for (let g = 0; g < t.searchData.length; g++) {
              let y = t.searchData[g], v = t.getSearch(y.field);
              if (y != null) {
                v == null && (v = { field: y.field, type: y.type });
                let _ = t.parseField(d, v.field);
                switch (p = _ == null || typeof _ == "object" && _.toString == r ? "" : String(_).toLowerCase(), y.value != null && (Array.isArray(y.value) ? (m = y.value[0], f = y.value[1]) : m = String(y.value).toLowerCase()), y.operator) {
                  case "=":
                  case "is":
                    t.parseField(d, v.field) == y.value ? u++ : v.type == "date" ? (w = t.parseField(d, v.field + "_") instanceof Date ? t.parseField(d, v.field + "_") : t.parseField(d, v.field), p = c.formatDate(w, "yyyy-mm-dd"), m = c.formatDate(c.isDate(m, c.settings.dateFormat, true), "yyyy-mm-dd"), p == m && u++) : v.type == "time" ? (w = t.parseField(d, v.field + "_") instanceof Date ? t.parseField(d, v.field + "_") : t.parseField(d, v.field), p = c.formatTime(w, "hh24:mi"), m = c.formatTime(m, "hh24:mi"), p == m && u++) : v.type == "datetime" && (w = t.parseField(d, v.field + "_") instanceof Date ? t.parseField(d, v.field + "_") : t.parseField(d, v.field), p = c.formatDateTime(w, "yyyy-mm-dd|hh24:mm:ss"), m = c.formatDateTime(c.isDateTime(m, c.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss"), p == m) && u++;
                    break;
                  case "between":
                    ["int", "float", "money", "currency", "percent"].indexOf(v.type) != -1 ? parseFloat(t.parseField(d, v.field)) >= parseFloat(m) && parseFloat(t.parseField(d, v.field)) <= parseFloat(f) && u++ : v.type == "date" ? (w = t.parseField(d, v.field + "_") instanceof Date ? t.parseField(d, v.field + "_") : t.parseField(d, v.field), p = c.isDate(w, c.settings.dateFormat, true), m = c.isDate(m, c.settings.dateFormat, true), (f = c.isDate(f, c.settings.dateFormat, true)) != null && (f = new Date(f.getTime() + 864e5)), p >= m && p < f && u++) : v.type == "time" ? (p = t.parseField(d, v.field + "_") instanceof Date ? t.parseField(d, v.field + "_") : t.parseField(d, v.field), m = c.isTime(m, true), f = c.isTime(f, true), m = (/* @__PURE__ */ new Date()).setHours(m.hours, m.minutes, m.seconds || 0, 0), f = (/* @__PURE__ */ new Date()).setHours(f.hours, f.minutes, f.seconds || 0, 0), p >= m && p < f && u++) : v.type == "datetime" && (p = t.parseField(d, v.field + "_") instanceof Date ? t.parseField(d, v.field + "_") : t.parseField(d, v.field), m = c.isDateTime(m, c.settings.datetimeFormat, true), f = (f = c.isDateTime(f, c.settings.datetimeFormat, true)) && new Date(f.getTime() + 864e5), p >= m) && p < f && u++;
                    break;
                  case "<=":
                    b = true;
                  case "<":
                  case "less":
                    ["int", "float", "money", "currency", "percent"].indexOf(v.type) != -1 ? (p = parseFloat(t.parseField(d, v.field)), m = parseFloat(y.value), (p < m || b && p === m) && u++) : v.type == "date" ? (w = t.parseField(d, v.field + "_") instanceof Date ? t.parseField(d, v.field + "_") : t.parseField(d, v.field), p = c.isDate(w, c.settings.dateFormat, true), m = c.isDate(m, c.settings.dateFormat, true), (p < m || b && p === m) && u++) : v.type == "time" ? (w = t.parseField(d, v.field + "_") instanceof Date ? t.parseField(d, v.field + "_") : t.parseField(d, v.field), p = c.formatTime(w, "hh24:mi"), m = c.formatTime(m, "hh24:mi"), (p < m || b && p === m) && u++) : v.type == "datetime" && (w = t.parseField(d, v.field + "_") instanceof Date ? t.parseField(d, v.field + "_") : t.parseField(d, v.field), p = c.formatDateTime(w, "yyyy-mm-dd|hh24:mm:ss"), m = c.formatDateTime(c.isDateTime(m, c.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss"), p.length == m.length) && (p < m || b && p === m) && u++;
                    break;
                  case ">=":
                    b = true;
                  case ">":
                  case "more":
                    ["int", "float", "money", "currency", "percent"].indexOf(v.type) != -1 ? (p = parseFloat(t.parseField(d, v.field)), m = parseFloat(y.value), (p > m || b && p === m) && u++) : v.type == "date" ? (w = t.parseField(d, v.field + "_") instanceof Date ? t.parseField(d, v.field + "_") : t.parseField(d, v.field), p = c.isDate(w, c.settings.dateFormat, true), m = c.isDate(m, c.settings.dateFormat, true), (p > m || b && p === m) && u++) : v.type == "time" ? (w = t.parseField(d, v.field + "_") instanceof Date ? t.parseField(d, v.field + "_") : t.parseField(d, v.field), p = c.formatTime(w, "hh24:mi"), m = c.formatTime(m, "hh24:mi"), (p > m || b && p === m) && u++) : v.type == "datetime" && (w = t.parseField(d, v.field + "_") instanceof Date ? t.parseField(d, v.field + "_") : t.parseField(d, v.field), p = c.formatDateTime(w, "yyyy-mm-dd|hh24:mm:ss"), m = c.formatDateTime(c.isDateTime(m, c.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss"), p.length == m.length) && (p > m || b && p === m) && u++;
                    break;
                  case "in":
                    w = y.value, (w = y.svalue ? y.svalue : w).indexOf(c.isFloat(_) ? parseFloat(_) : _) === -1 && w.indexOf(p) === -1 || u++;
                    break;
                  case "not in":
                    w = y.value, (w = y.svalue ? y.svalue : w).indexOf(c.isFloat(_) ? parseFloat(_) : _) === -1 && w.indexOf(p) === -1 && u++;
                    break;
                  case "begins":
                  case "begins with":
                    p.indexOf(m) === 0 && u++;
                    break;
                  case "contains":
                    0 <= p.indexOf(m) && u++;
                    break;
                  case "null":
                    t.parseField(d, v.field) == null && u++;
                    break;
                  case "not null":
                    t.parseField(d, v.field) != null && u++;
                    break;
                  case "ends":
                  case "ends with":
                    let k = p.lastIndexOf(m);
                    k !== -1 && k == p.length - m.length && u++;
                }
              }
            }
            if (t.last.logic == "OR" && u !== 0 || t.last.logic == "AND" && u == t.searchData.length) return true;
            if (((_a2 = d.w2ui) == null ? void 0 : _a2.children) && ((_b = d.w2ui) == null ? void 0 : _b.expanded) !== true) for (let g = 0; g < d.w2ui.children.length; g++) {
              let y = d.w2ui.children[g];
              if (o(y)) return true;
            }
            return false;
          }(s)) if ((s == null ? void 0 : s.w2ui) && function o(d) {
            let u = t.get(d, true);
            if (u == null || d == null || a[d] || t.last.searchIds.includes(u)) return;
            a[d] = true;
            let p = t.records[u];
            (p == null ? void 0 : p.w2ui) && o(p.w2ui.parent_recid), t.last.searchIds.push(u);
          }(s.w2ui.parent_recid), 0 < this.showExtraOnSearch) {
            let o = this.showExtraOnSearch, d = this.showExtraOnSearch;
            if (h < o && (o = h), h + d > this.records.length && (d = this.records.length - h), 0 < o) for (let u = h - o; u < h; u++) this.last.searchIds.indexOf(u) < 0 && this.last.searchIds.push(u);
            if (this.last.searchIds.indexOf(h) < 0 && this.last.searchIds.push(h), 0 < d) for (let u = h + 1; u <= h + d; u++) this.last.searchIds.indexOf(u) < 0 && this.last.searchIds.push(u);
          } else this.last.searchIds.push(h);
        }
        this.total = this.last.searchIds.length;
      }
      return l = Date.now() - l, e !== true && this.show.statusSearch && setTimeout(() => {
        this.status(c.lang("Search took ${count} seconds", { count: l / 1e3 }));
      }, 10), l;
    }
  }
  getRangeData(e, t) {
    var i = this.get(e[0].recid, true), s = this.get(e[1].recid, true), l = e[0].column, r = e[1].column, a = [];
    if (l == r) for (let f = i; f <= s; f++) {
      var h = this.records[f], o = h[this.columns[l].field] || null;
      a.push(t !== true ? o : { data: o, column: l, index: f, record: h });
    }
    else if (i == s) {
      var d = this.records[i];
      for (let f = l; f <= r; f++) {
        var u = d[this.columns[f].field] || null;
        a.push(t !== true ? u : { data: u, column: f, index: i, record: d });
      }
    } else for (let f = i; f <= s; f++) {
      var p = this.records[f];
      a.push([]);
      for (let w = l; w <= r; w++) {
        var m = p[this.columns[w].field];
        t !== true ? a[a.length - 1].push(m) : a[a.length - 1].push({ data: m, column: w, index: f, record: p });
      }
    }
    return a;
  }
  addRange(e) {
    let t = 0, i, s;
    if (this.selectType != "row") {
      Array.isArray(e) || (e = [e]);
      for (let r = 0; r < e.length; r++) {
        if (typeof e[r] != "object" && (e[r] = { name: "selection" }), e[r].name == "selection") {
          if (this.show.selectionBorder === false) continue;
          var l = this.getSelection();
          if (l.length === 0) {
            this.removeRange("selection");
            continue;
          }
          i = l[0], s = l[l.length - 1];
        } else i = e[r].range[0], s = e[r].range[1];
        if (i) {
          l = { name: e[r].name, range: [{ recid: i.recid, column: i.column }, { recid: s.recid, column: s.column }], style: e[r].style || "" };
          let a = false;
          for (let h = 0; h < this.ranges.length; h++) if (this.ranges[h].name == e[r].name) {
            a = h;
            break;
          }
          a !== false ? this.ranges[a] = l : this.ranges.push(l), t++;
        }
      }
      this.refreshRanges();
    }
    return t;
  }
  removeRange() {
    let e = 0;
    for (let i = 0; i < arguments.length; i++) {
      var t = arguments[i];
      n(this.box).find("#grid_" + this.name + "_" + t).remove(), n(this.box).find("#grid_" + this.name + "_f" + t).remove();
      for (let s = this.ranges.length - 1; 0 <= s; s--) this.ranges[s].name == t && (this.ranges.splice(s, 1), e++);
    }
    return e;
  }
  refreshRanges() {
    if (this.ranges.length !== 0) {
      let w = function(g) {
        var y = p.last.move;
        if (y && y.type == "expand") {
          y.divX = g.screenX - y.x, y.divY = g.screenY - y.y;
          let v, _, k = g.target;
          k.tagName.toUpperCase() != "TD" && (k = n(k).closest("td")[0]), (_ = n(k).attr("col") != null ? parseInt(n(k).attr("col")) : _) != null && (k = n(k).closest("tr")[0], v = p.records[n(k).attr("index")].recid, y.newRange[1].recid != v || y.newRange[1].column != _) && (g = c.clone(y.newRange), y.newRange = [{ recid: y.recid, column: y.column }, { recid: v, column: _ }], f.detail && (f.detail.newRange = c.clone(y.newRange), f.detail.originalRange = c.clone(y.originalRange)), (f = p.trigger("selectionExtend", f)).isCancelled === true ? (y.newRange = g, f.detail.newRange = g) : (p.removeRange("grid-selection-expand"), p.addRange({ name: "grid-selection-expand", range: y.newRange, style: "background-color: rgba(100,100,100,0.1); border: 2px dotted rgba(100,100,100,0.5);" })));
        }
      }, b = function(g) {
        p.removeRange("grid-selection-expand"), delete p.last.move, n("body").off(".w2ui-" + p.name), f.finish && f.finish();
      }, p = this, m;
      var e = Date.now(), t = n(this.box).find(`#grid_${this.name}_frecords`), i = n(this.box).find(`#grid_${this.name}_records`);
      for (let g = 0; g < this.ranges.length; g++) {
        var s = this.ranges[g], l = s.range[0], r = s.range[1];
        l.index == null && (l.index = this.get(l.recid, true)), r.index == null && (r.index = this.get(r.recid, true));
        let y = n(this.box).find("#grid_" + this.name + "_rec_" + c.escapeId(l.recid) + ' td[col="' + l.column + '"]'), v = n(this.box).find("#grid_" + this.name + "_rec_" + c.escapeId(r.recid) + ' td[col="' + r.column + '"]'), _ = n(this.box).find("#grid_" + this.name + "_frec_" + c.escapeId(l.recid) + ' td[col="' + l.column + '"]'), k = n(this.box).find("#grid_" + this.name + "_frec_" + c.escapeId(r.recid) + ' td[col="' + r.column + '"]'), E = r.column;
        l.column < this.last.colStart && r.column > this.last.colStart && (y = n(this.box).find("#grid_" + this.name + "_rec_" + c.escapeId(l.recid) + ' td[col="start"]')), l.column < this.last.colEnd && r.column > this.last.colEnd && (v = n(this.box).find("#grid_" + this.name + "_rec_" + c.escapeId(r.recid) + ' td[col="end"]'), E = '"end"');
        var o = parseInt(n(this.box).find("#grid_" + this.name + "_rec_top").next().attr("index")), d = parseInt(n(this.box).find("#grid_" + this.name + "_rec_bottom").prev().attr("index")), u = parseInt(n(this.box).find("#grid_" + this.name + "_frec_top").next().attr("index")), a = parseInt(n(this.box).find("#grid_" + this.name + "_frec_bottom").prev().attr("index"));
        y.length === 0 && l.index < o && r.index > o && (y = n(this.box).find("#grid_" + this.name + "_rec_top").next().find('td[col="' + l.column + '"]')), v.length === 0 && r.index > d && l.index < d && (v = n(this.box).find("#grid_" + this.name + "_rec_bottom").prev().find('td[col="' + E + '"]')), _.length === 0 && l.index < u && r.index > u && (_ = n(this.box).find("#grid_" + this.name + "_frec_top").next().find('td[col="' + l.column + '"]')), k.length === 0 && r.index > a && l.index < a && (k = n(this.box).find("#grid_" + this.name + "_frec_bottom").prev().find('td[col="' + r.column + '"]'));
        var h, o = n(this.box).find("#grid_" + this.name + "_editable").find(".w2ui-input"), d = o.attr("recid"), u = o.attr("column");
        s.name == "selection" && s.range[0].recid == d && s.range[0].column == u || (m = n(this.box).find("#grid_" + this.name + "_f" + s.name), (0 < _.length || 0 < k.length) && (m.length === 0 ? (t.append('<div id="grid_' + this.name + "_f" + s.name + '" class="w2ui-selection" style="' + s.style + '">' + (s.name == "selection" ? '<div id="grid_' + this.name + '_resizer" class="w2ui-selection-resizer"></div>' : "") + "</div>"), m = n(this.box).find("#grid_" + this.name + "_f" + s.name)) : (m.attr("style", s.style), m.find(".w2ui-selection-resizer").show()), k.length === 0 && ((k = n(this.box).find("#grid_" + this.name + "_frec_" + c.escapeId(r.recid) + " td:last-child")).length === 0 && (k = n(this.box).find("#grid_" + this.name + "_frec_bottom td:first-child")), m.css("border-right", "0px"), m.find(".w2ui-selection-resizer").hide()), l.recid != null) && r.recid != null && 0 < _.length && 0 < k.length ? (a = getComputedStyle(k[0]), o = _.prop("offsetTop") - _.prop("scrollTop"), d = _.prop("offsetLeft") + _.prop("scrollLeft"), u = k.prop("offsetTop") - k.prop("scrollTop"), h = k.prop("offsetLeft") + k.prop("scrollLeft"), m.show().css({ top: (0 < o ? o : 0) + "px", left: (0 < d ? d : 0) + "px", width: h - d + parseFloat(a.width) + 2 + "px", height: u - o + parseFloat(a.height) + 1 + "px" })) : m.hide(), m = n(this.box).find("#grid_" + this.name + "_" + s.name), (0 < y.length || 0 < v.length) && (m.length === 0 ? (i.append('<div id="grid_' + this.name + "_" + s.name + '" class="w2ui-selection" style="' + s.style + '">' + (s.name == "selection" ? '<div id="grid_' + this.name + '_resizer" class="w2ui-selection-resizer"></div>' : "") + "</div>"), m = n(this.box).find("#grid_" + this.name + "_" + s.name)) : m.attr("style", s.style), y.length === 0 && (y = n(this.box).find("#grid_" + this.name + "_rec_" + c.escapeId(l.recid) + " td:first-child")).length === 0 && (y = n(this.box).find("#grid_" + this.name + "_rec_top td:first-child")), k.length !== 0 && m.css("border-left", "0px"), l.recid != null) && r.recid != null && 0 < y.length && 0 < v.length ? (h = getComputedStyle(v[0]), d = y.prop("offsetTop") - y.prop("scrollTop"), u = y.prop("offsetLeft") + y.prop("scrollLeft"), o = v.prop("offsetTop") - v.prop("scrollTop"), a = v.prop("offsetLeft") + v.prop("scrollLeft"), m.show().css({ top: (0 < d ? d : 0) + "px", left: (0 < u ? u : 0) + "px", width: a - u + parseFloat(h.width) + 2 + "px", height: o - d + parseFloat(h.height) + 1 + "px" })) : m.hide());
      }
      n(this.box).find(".w2ui-selection-resizer").off(".resizer").on("mousedown.resizer", function(g) {
        var y = p.getSelection();
        p.last.move = { type: "expand", x: g.screenX, y: g.screenY, divX: 0, divY: 0, recid: y[0].recid, column: y[0].column, originalRange: [c.clone(y[0]), c.clone(y[y.length - 1])], newRange: [c.clone(y[0]), c.clone(y[y.length - 1])] }, n("body").off(".w2ui-" + p.name).on("mousemove.w2ui-" + p.name, w).on("mouseup.w2ui-" + p.name, b), g.preventDefault();
      }).on("dblclick.resizer", (g) => {
        g = this.trigger("resizerDblClick", { target: this.name, originalEvent: g }), g.isCancelled !== true && g.finish();
      });
      let f = { target: this.name, originalRange: null, newRange: null };
      return Date.now() - e;
    }
  }
  select() {
    if (arguments.length === 0) return 0;
    let e = 0;
    var t = this.last.selection;
    this.multiSelect || this.selectNone(true);
    let i = Array.from(arguments);
    Array.isArray(i[0]) && (i = i[0]);
    var s = { target: this.name }, s = (i.length == 1 ? (s.multiple = false, c.isPlainObject(i[0]) ? s.clicked = { recid: i[0].recid, column: i[0].column } : s.recid = i[0]) : (s.multiple = true, s.clicked = { recids: i }), this.trigger("select", s));
    if (s.isCancelled === true) return 0;
    if (this.selectType == "row") for (let g = 0; g < i.length; g++) {
      var l = typeof i[g] == "object" ? i[g].recid : i[g], r = this.get(l, true);
      if (r != null) {
        let y = null, v = null;
        (this.searchData.length !== 0 || r + 1 >= this.last.range_start && r + 1 <= this.last.range_end) && (y = n(this.box).find("#grid_" + this.name + "_frec_" + c.escapeId(l)), v = n(this.box).find("#grid_" + this.name + "_rec_" + c.escapeId(l))), this.selectType == "row" && t.indexes.indexOf(r) == -1 && (t.indexes.push(r), y && v && (y.addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected"), v.addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected"), y.find(".w2ui-grid-select-check").prop("checked", true)), e++);
      }
    }
    else {
      var a = {};
      for (let g = 0; g < i.length; g++) {
        var h = typeof i[g] == "object" ? i[g].recid : i[g], o = typeof i[g] == "object" ? i[g].column : null;
        if (a[h] = a[h] || [], Array.isArray(o)) a[h] = o;
        else if (c.isInt(o)) a[h].push(o);
        else for (let y = 0; y < this.columns.length; y++) this.columns[y].hidden || a[h].push(parseInt(y));
      }
      var d, u = [];
      for (d in a) {
        var p = this.get(d, true);
        if (p != null) {
          let g = null, y = null;
          p + 1 >= this.last.range_start && p + 1 <= this.last.range_end && (g = n(this.box).find("#grid_" + this.name + "_rec_" + c.escapeId(d)), y = n(this.box).find("#grid_" + this.name + "_frec_" + c.escapeId(d)));
          var m = t.columns[p] || [];
          t.indexes.indexOf(p) == -1 && t.indexes.push(p);
          for (let v = 0; v < a[d].length; v++) m.indexOf(a[d][v]) == -1 && m.push(a[d][v]);
          m.sort((v, _) => v - _);
          for (let v = 0; v < a[d].length; v++) {
            var f = a[d][v];
            u.indexOf(f) == -1 && u.push(f), g && (g.find("#grid_" + this.name + "_data_" + p + "_" + f).addClass("w2ui-selected"), g.find(".w2ui-col-number").addClass("w2ui-row-selected"), g.find(".w2ui-grid-select-check").prop("checked", true)), y && (y.find("#grid_" + this.name + "_data_" + p + "_" + f).addClass("w2ui-selected"), y.find(".w2ui-col-number").addClass("w2ui-row-selected"), y.find(".w2ui-grid-select-check").prop("checked", true)), e++;
          }
          t.columns[p] = m;
        }
      }
      for (let g = 0; g < u.length; g++) n(this.box).find("#grid_" + this.name + "_column_" + u[g] + " .w2ui-col-header").addClass("w2ui-col-selected");
    }
    t.indexes.sort((g, y) => g - y);
    var w = 0 < this.records.length && t.indexes.length == this.records.length, b = 0 < t.indexes.length && this.searchData.length !== 0 && t.indexes.length == this.last.searchIds.length;
    return w || b ? n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true) : n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.addRange("selection"), this.updateToolbar(t, w), s.finish(), e;
  }
  unselect() {
    let e = 0;
    var t = this.last.selection;
    let i = Array.from(arguments);
    Array.isArray(i[0]) && (i = i[0]);
    var s = { target: this.name }, s = (i.length == 1 ? (s.multiple = false, c.isPlainObject(i[0]) ? s.clicked = { recid: i[0].recid, column: i[0].column } : s.clicked = { recid: i[0] }) : (s.multiple = true, s.recids = i), this.trigger("select", s));
    if (s.isCancelled === true) return 0;
    for (let f = 0; f < i.length; f++) {
      var l = typeof i[f] == "object" ? i[f].recid : i[f], r = this.get(l);
      if (r != null) {
        var r = this.get(r.recid, true), a = n(this.box).find("#grid_" + this.name + "_frec_" + c.escapeId(l)), h = n(this.box).find("#grid_" + this.name + "_rec_" + c.escapeId(l));
        if (this.selectType == "row") t.indexes.indexOf(r) != -1 && (t.indexes.splice(t.indexes.indexOf(r), 1), a.removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected"), h.removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected"), a.length != 0 && (a[0].style.cssText = "height: " + this.recordHeight + "px; " + a.attr("custom_style"), h[0].style.cssText = "height: " + this.recordHeight + "px; " + h.attr("custom_style")), a.find(".w2ui-grid-select-check").prop("checked", false), e++);
        else {
          var o = i[f].column;
          if (!c.isInt(o)) {
            var d = [];
            for (let b = 0; b < this.columns.length; b++) this.columns[b].hidden || d.push({ recid: l, column: b });
            return this.unselect(d);
          }
          if (h = t.columns[r], Array.isArray(h) && h.indexOf(o) != -1) {
            h.splice(h.indexOf(o), 1), n(this.box).find(`#grid_${this.name}_rec_${c.escapeId(l)} > td[col="${o}"]`).removeClass("w2ui-selected w2ui-inactive"), n(this.box).find(`#grid_${this.name}_frec_${c.escapeId(l)} > td[col="${o}"]`).removeClass("w2ui-selected w2ui-inactive");
            let b = false, g = false;
            var u = this.getSelection();
            for (let y = 0; y < u.length; y++) u[y].column == o && (b = true), u[y].recid == l && (g = true);
            b || n(this.box).find(`.w2ui-grid-columns td[col="${o}"] .w2ui-col-header, .w2ui-grid-fcolumns td[col="${o}"] .w2ui-col-header`).removeClass("w2ui-col-selected"), g || n(this.box).find("#grid_" + this.name + "_frec_" + c.escapeId(l)).find(".w2ui-col-number").removeClass("w2ui-row-selected"), e++, h.length === 0 && (delete t.columns[r], t.indexes.splice(t.indexes.indexOf(r), 1), a.find(".w2ui-grid-select-check").prop("checked", false));
          }
        }
      }
    }
    var p = 0 < this.records.length && t.indexes.length == this.records.length, m = 0 < t.indexes.length && this.searchData.length !== 0 && t.indexes.length == this.last.searchIds.length;
    return p || m ? n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true) : n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.addRange("selection"), this.updateToolbar(t, p), s.finish(), e;
  }
  selectAll() {
    var _a;
    var e = Date.now();
    if (this.multiSelect !== false) {
      var t = ((_a = this.url) == null ? void 0 : _a.get) ?? this.url;
      let s = c.clone(this.last.selection);
      var i = [];
      for (let l = 0; l < this.columns.length; l++) i.push(l);
      if (s.indexes = [], t || this.searchData.length === 0) {
        let l = this.records.length;
        this.searchData.length == 0 || t || (l = this.last.searchIds.length);
        for (let r = 0; r < l; r++) s.indexes.push(r), this.selectType != "row" && (s.columns[r] = i.slice());
      } else for (let l = 0; l < this.last.searchIds.length; l++) s.indexes.push(this.last.searchIds[l]), this.selectType != "row" && (s.columns[this.last.searchIds[l]] = i.slice());
      if (t = this.trigger("select", { target: this.name, multiple: true, all: true, clicked: s }), t.isCancelled !== true) return this.last.selection = s, this.selectType == "row" ? (n(this.box).find(".w2ui-grid-records tr:not(.w2ui-empty-record)").addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected"), n(this.box).find(".w2ui-grid-frecords tr:not(.w2ui-empty-record)").addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected")) : (n(this.box).find(".w2ui-grid-columns td .w2ui-col-header, .w2ui-grid-fcolumns td .w2ui-col-header").addClass("w2ui-col-selected"), n(this.box).find(".w2ui-grid-records tr .w2ui-col-number").addClass("w2ui-row-selected"), n(this.box).find(".w2ui-grid-records tr:not(.w2ui-empty-record)").find(".w2ui-grid-data:not(.w2ui-col-select)").addClass("w2ui-selected"), n(this.box).find(".w2ui-grid-frecords tr .w2ui-col-number").addClass("w2ui-row-selected"), n(this.box).find(".w2ui-grid-frecords tr:not(.w2ui-empty-record)").find(".w2ui-grid-data:not(.w2ui-col-select)").addClass("w2ui-selected")), n(this.box).find("input.w2ui-grid-select-check").prop("checked", true), s = this.getSelection(true), this.addRange("selection"), n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true), this.status(), this.updateToolbar({ indexes: s }, true), t.finish(), Date.now() - e;
    }
  }
  selectNone(e) {
    var t, i = Date.now();
    let s;
    if (e || (s = this.trigger("select", { target: this.name, clicked: [] })).isCancelled !== true) return t = this.last.selection, this.selectType == "row" ? (n(this.box).find(".w2ui-grid-records tr.w2ui-selected").removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected"), n(this.box).find(".w2ui-grid-frecords tr.w2ui-selected").removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected")) : (n(this.box).find(".w2ui-grid-columns td .w2ui-col-header, .w2ui-grid-fcolumns td .w2ui-col-header").removeClass("w2ui-col-selected"), n(this.box).find(".w2ui-grid-records tr .w2ui-col-number").removeClass("w2ui-row-selected"), n(this.box).find(".w2ui-grid-frecords tr .w2ui-col-number").removeClass("w2ui-row-selected"), n(this.box).find(".w2ui-grid-data.w2ui-selected").removeClass("w2ui-selected w2ui-inactive")), n(this.box).find("input.w2ui-grid-select-check").prop("checked", false), t.indexes = [], t.columns = {}, this.removeRange("selection"), n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.updateToolbar(t, false), e || s.finish(), Date.now() - i;
  }
  updateToolbar(e) {
    let t = this, i = e && e.indexes ? e.indexes.length : 0;
    function s(l, r) {
      if (l.batch != null) {
        let a = false;
        l.batch === true ? 0 < i && (a = true) : typeof l.batch == "number" ? i === l.batch && (a = true) : typeof l.batch == "function" && (a = l.batch({ cnt: i, sel: e })), a ? t.toolbar.enable(r + l.id) : t.toolbar.disable(r + l.id);
      }
    }
    this.toolbar.items.forEach((l) => {
      s(l, ""), Array.isArray(l.items) && l.items.forEach((r) => {
        s(r, l.id + ":");
      });
    }), this.show.toolbarSave && (0 < this.getChanges().length ? this.toolbar.enable("w2ui-save") : this.toolbar.disable("w2ui-save"));
  }
  getSelection(e) {
    var t = [], i = this.last.selection;
    if (this.selectType == "row") for (let l = 0; l < i.indexes.length; l++) this.records[i.indexes[l]] && t.push(e === true ? i.indexes[l] : this.records[i.indexes[l]].recid);
    else for (let l = 0; l < i.indexes.length; l++) {
      var s = i.columns[i.indexes[l]];
      if (this.records[i.indexes[l]]) for (let r = 0; r < s.length; r++) t.push({ recid: this.records[i.indexes[l]].recid, index: parseInt(i.indexes[l]), column: s[r] });
    }
    return t;
  }
  search(e, t) {
    var _a;
    var i = ((_a = this.url) == null ? void 0 : _a.get) ?? this.url, s = [];
    let l = this.last.multi, r = this.last.logic, a = this.last.field, h = this.last.search, o = false;
    var d = n(`#w2overlay-${this.name}-search-overlay`);
    for (let C = 0; C < this.searches.length; C++) this.searches[C].hidden && this.searches[C].value != null && (s.push({ field: this.searches[C].field, operator: this.searches[C].operator || "is", type: this.searches[C].type, value: this.searches[C].value || "" }), o = true);
    if (arguments.length === 0 && d.length === 0 && (t = this.multiSearch ? (e = this.searchData, this.last.logic) : (e = this.last.field, this.last.search)), arguments.length === 0 && d.length !== 0) {
      this.focus(), r = d.find(`#grid_${this.name}_logic`).val(), h = "";
      for (let C = 0; C < this.searches.length; C++) {
        var u = this.searches[C], p = d.find("#grid_" + this.name + "_operator_" + C).val(), m = d.find("#grid_" + this.name + "_field_" + C), f = d.find("#grid_" + this.name + "_field2_" + C);
        let x = m.val(), $ = f.val(), I = null, N = null;
        if (["int", "float", "money", "currency", "percent"].indexOf(u.type) != -1 && (w = m[0]._w2field, f = f[0]._w2field, w && (x = w.clean(x)), f) && ($ = f.clean($)), ["list", "enum"].indexOf(u.type) != -1 || ["in", "not in"].indexOf(p) != -1) if (x = m[0]._w2field.selected || {}, Array.isArray(x)) {
          I = [];
          for (let H = 0; H < x.length; H++) I.push(c.isFloat(x[H].id) ? parseFloat(x[H].id) : String(x[H].id).toLowerCase()), delete x[H].hidden;
          Object.keys(x).length === 0 && (x = "");
        } else N = x.text || "", x = x.id || "";
        if (x !== "" && x != null || $ != null && $ !== "") {
          var w = { field: u.field, type: u.type, operator: p };
          p == "between" ? c.extend(w, { value: [x, $] }) : p == "in" && typeof x == "string" || p == "not in" && typeof x == "string" ? c.extend(w, { value: x.split(",") }) : c.extend(w, { value: x }), I && c.extend(w, { svalue: I }), N && c.extend(w, { text: N });
          try {
            u.type == "date" && p == "between" && (w.value[0] = x, w.value[1] = $), u.type == "date" && p == "is" && (w.value = x);
          } catch {
          }
          s.push(w), l = true;
        }
      }
    }
    if (typeof e == "string" && (arguments.length == 1 && (t = e, e = "all"), a = e, h = t, l = false, r = o ? "AND" : "OR", t != null)) if (e.toLowerCase() == "all") if (0 < this.searches.length) for (let C = 0; C < this.searches.length; C++) {
      var b, g = this.searches[C];
      if ((g.type == "text" || g.type == "alphanumeric" && c.isAlphaNumeric(t) || g.type == "int" && c.isInt(t) || g.type == "float" && c.isFloat(t) || g.type == "percent" && c.isFloat(t) || (g.type == "hex" || g.type == "color") && c.isHex(t) || g.type == "currency" && c.isMoney(t) || g.type == "money" && c.isMoney(t) || g.type == "date" && c.isDate(t) || g.type == "time" && c.isTime(t) || g.type == "datetime" && c.isDateTime(t) || g.type == "datetime" && c.isDate(t) || g.type == "enum" && c.isAlphaNumeric(t) || g.type == "list" && c.isAlphaNumeric(t)) && (b = this.defaultOperator[this.operatorsMap[g.type]], b = { field: g.field, type: g.type, operator: g.operator != null ? g.operator : b, value: t }, String(t).trim() != "") && s.push(b), ["int", "float", "money", "currency", "percent"].indexOf(g.type) != -1 && String(t).trim().split("-").length == 2 && (b = String(t).trim().split("-"), y = { field: g.field, type: g.type, operator: g.operator != null ? g.operator : "between", value: [b[0], b[1]] }, s.push(y)), ["list", "enum"].indexOf(g.type) != -1) {
        var y, v = [];
        g.options == null && (g.options = {}), Array.isArray(g.options.items) || (g.options.items = []);
        for (let x = 0; x < g.options.items; x++) {
          var _ = g.options.items[x];
          try {
            var k = new RegExp(t, "i");
            k.test(_) && v.push(x), _.text && k.test(_.text) && v.push(_.id);
          } catch {
          }
        }
        0 < v.length && (y = { field: g.field, type: g.type, operator: g.operator != null ? g.operator : "in", value: v }, s.push(y));
      }
    }
    else for (let C = 0; C < this.columns.length; C++) {
      var E = { field: this.columns[C].field, type: "text", operator: this.defaultOperator.text, value: t };
      s.push(E);
    }
    else {
      var T = d.find("#grid_" + this.name + "_search_all");
      let C = this.getSearch(e);
      if ((C = C ?? { field: e, type: "text" }).field == e && (this.last.label = C.label), t !== "") {
        let x = this.defaultOperator[this.operatorsMap[C.type]], $ = t;
        if (["date", "time", "datetime"].indexOf(C.type) != -1 && (x = "is"), ["list", "enum"].indexOf(C.type) != -1 && (x = "is", T = T._w2field.get(), $ = T && 0 < Object.keys(T).length ? T.id : ""), C.type == "int" && t !== "" && (x = "is", String(t).indexOf("-") != -1 && (T = t.split("-")).length == 2 && (x = "between", $ = [parseInt(T[0]), parseInt(T[1])]), String(t).indexOf(",") != -1)) {
          var S = t.split(",");
          x = "in", $ = [];
          for (let I = 0; I < S.length; I++) $.push(S[I]);
        }
        C.operator != null && (x = C.operator), T = { field: C.field, type: C.type, operator: x, value: $ }, s.push(T);
      }
    }
    if (Array.isArray(e)) {
      let C = "AND";
      typeof t == "string" && (C = t.toUpperCase()) != "OR" && C != "AND" && (C = "AND"), h = "", l = true, r = C;
      for (let x = 0; x < e.length; x++) {
        var R = e[x];
        typeof R.value == "number" && R.operator == null && (R.operator = this.defaultOperator.number), typeof R.value == "string" && R.operator == null && (R.operator = this.defaultOperator.text), Array.isArray(R.value) && R.operator == null && (R.operator = this.defaultOperator.enum), c.isDate(R.value) && R.operator == null && (R.operator = this.defaultOperator.date), s.push(R);
      }
    }
    T = this.trigger("search", { target: this.name, multi: arguments.length === 0, searchField: e || "multi", searchValue: e ? t : "multi", searchData: s, searchLogic: r }), T.isCancelled !== true && (this.searchData = T.detail.searchData, this.last.field = a, this.last.search = h, this.last.multi = l, this.last.logic = T.detail.searchLogic, this.last.scrollTop = 0, this.last.scrollLeft = 0, this.last.selection.indexes = [], this.last.selection.columns = {}, this.searchClose(), i ? (this.last.fetch.offset = 0, this.reload()) : (this.localSearch(), this.refresh()), T.finish());
  }
  searchOpen() {
    if (this.box && this.searches.length !== 0) {
      let e = this.trigger("searchOpen", { target: this.name });
      if (e.isCancelled !== true) {
        let t = n(this.toolbar.box).find(".w2ui-grid-search-input .w2ui-search-drop");
        t.addClass("checked"), F.show({ name: this.name + "-search-overlay", anchor: n(this.box).find("#grid_" + this.name + "_search_all").get(0), position: "bottom|top", html: this.getSearchesHTML(), align: "left", arrowSize: 12, class: "w2ui-grid-search-advanced", hideOn: ["doc-click"] }).then((i) => {
          this.initSearches(), this.last.search_opened = true;
          let s = n(`#w2overlay-${this.name}-search-overlay`);
          s.data("gridName", this.name).off(".grid-search").on("click.grid-search", () => {
            s.find("input, select").each((r) => {
              r = n(r).data("tooltipName"), r && r.forEach((a) => {
                F.hide(a);
              });
            });
          }), c.bindEvents(s.find("select, input, button"), this);
          var l = n(`#w2overlay-${this.name}-search-overlay *[rel=search]`);
          0 < l.length && l[0].focus(), e.finish();
        }).hide((i) => {
          t.removeClass("checked"), this.last.search_opened = false;
        });
      }
    }
  }
  searchClose() {
    F.hide(this.name + "-search-overlay");
  }
  searchFieldTooltip(s, t, i) {
    var s = this.searches[s], l = this.searchData[t];
    let r = l.operator, a = ((r = r == "more" && l.type == "date" ? "since" : r) == "less" && l.type == "date" && (r = "before"), ""), h = l.value;
    Array.isArray(l.value) ? (l.value.forEach((o) => {
      a += `<span class="value">${o.text || o}</span>`;
    }), l.type == "date" && (a = "", l.value.forEach((o) => {
      a += `<span class="value">${c.formatDate(o)}</span>`;
    }))) : l.type == "date" && (h = c.formatDateTime(h)), F.hide(this.name + "-search-props"), F.show({ name: this.name + "-search-props", anchor: i, class: "w2ui-white", hideOn: "doc-click", html: `
                <div class="w2ui-grid-search-single">
                    <span class="field">${s.label}</span>
                    <span class="operator">${c.lang(r)}</span>
                    ${Array.isArray(l.value) ? "" + a : `<span class="value">${h}</span>`}
                    <div class="buttons">
                        <button id="remove" class="w2ui-btn">${c.lang("Remove This Field")}</button>
                    </div>
                </div>` }).then((o) => {
      n(o.detail.overlay.box).find("#remove").on("click", () => {
        this.searchData.splice("" + t, 1), this.reload(), this.localSearch(), F.hide(this.name + "-search-props");
      });
    });
  }
  searchSuggest(e, t, i) {
    var _a, _b;
    clearTimeout(this.last.kbd_timer), clearTimeout(this.last.overlay_timer), this.searchShowFields(true), this.searchClose(), t === true ? F.hide(this.name + "-search-suggest") : 0 < n(`#w2overlay-${this.name}-search-suggest`).length || (e ? (t = n(this.box).find(`#grid_${this.name}_search_all`).get(0), e = [...this.defaultSearches ?? [], ...0 < ((_a = this.defaultSearches) == null ? void 0 : _a.length) && 0 < ((_b = this.savedSearches) == null ? void 0 : _b.length) ? ["--"] : [], ...this.savedSearches ?? []], Array.isArray(e) && 0 < e.length && Y.show({ name: this.name + "-search-suggest", anchor: t, align: "both", items: e, hideOn: ["doc-click", "sleect", "remove"], render(s) {
      let l = s.text;
      return l = s.isDefault ? `<b>${l}</b>` : l;
    } }).select((s) => {
      var l = this.trigger("searchSelect", { target: this.name, index: s.detail.index, item: s.detail.item });
      l.isCancelled === true ? s.preventDefault() : (s.detail.overlay.hide(), this.last.logic = s.detail.item.logic || "AND", this.last.search = "", this.last.label = "[Multiple Fields]", this.searchData = c.clone(s.detail.item.data), this.searchSelected = c.clone(s.detail.item, { exclude: ["icon", "remove"] }), this.reload(), l.finish());
    }).remove((s) => {
      let l = s.detail.item, r = this.trigger("searchRemove", { target: this.name, index: s.detail.index, item: l });
      r.isCancelled === true ? s.preventDefault() : (s.detail.overlay.hide(), this.confirm(c.lang('Do you want to delete search "${item}"?', { item: l.text })).yes((a) => {
        var h = this.savedSearches.findIndex((o) => o.id == l.id);
        h !== -1 && this.savedSearches.splice(h, 1), this.cacheSave("searches", this.savedSearches.map((o) => c.clone(o, { exclude: ["remove", "icon"] }))), a.detail.self.close(), r.finish();
      }).no((a) => {
        a.detail.self.close();
      }));
    })) : this.last.overlay_timer = setTimeout(() => {
      this.searchSuggest(true);
    }, 100));
  }
  searchSave() {
    let e = "", t = (this.searchSelected && (e = this.searchSelected.text), this.savedSearches.findIndex((s) => {
      var _a;
      return s.id == ((_a = this.searchSelected) == null ? void 0 : _a.id);
    })), i = this.trigger("searchSave", { target: this.name, saveLocalStorage: true });
    i.isCancelled !== true && this.message({ width: 350, height: 150, body: `<div class="w2ui-grid-save-search">
                        <span>${c.lang(t != -1 ? "Update Search" : "Save New Search")}</span>
                        <input class="search-name w2ui-input" placeholder="${c.lang("Search name")}">
                   </div>`, buttons: `
                <button id="grid-search-cancel" class="w2ui-btn">${c.lang("Cancel")}</button>
                <button id="grid-search-save" class="w2ui-btn w2ui-btn-blue" ${String(e).trim() == "" ? "disabled" : ""}>${c.lang("Save")}</button>
            ` }).open(async (s) => {
      n(s.detail.box).find("input, button").eq(0).val(e), await s.complete, n(s.detail.box).find("#grid-search-cancel").on("click", () => {
        this.message();
      }), n(s.detail.box).find("#grid-search-save").on("click", () => {
        var l = n(s.detail.box).find(".w2ui-message .search-name").val();
        this.searchSelected && t != -1 ? Object.assign(this.savedSearches[t], { id: l, text: l, logic: this.last.logic, data: c.clone(this.searchData) }) : this.savedSearches.push({ id: l, text: l, icon: "w2ui-icon-search", remove: true, logic: this.last.logic, data: this.searchData }), this.cacheSave("searches", this.savedSearches.map((r) => c.clone(r, { exclude: ["remove", "icon"] }))), this.message(), (this.searchSelected ? (this.searchSelected.text = l, n(this.box).find(`#grid_${this.name}_search_name .name-text`)) : (this.searchSelected = { text: l, logic: this.last.logic, data: c.clone(this.searchData) }, n(s.detail.box).find(`#grid_${this.name}_search_all`).val(" ").prop("readOnly", true), n(s.detail.box).find(`#grid_${this.name}_search_name`).show().find(".name-text"))).html(l), i.finish({ name: l });
      }), n(s.detail.box).find("input, button").off(".message").on("keydown.message", (l) => {
        var r = String(n(s.detail.box).find(".w2ui-message-body input").val()).trim();
        l.keyCode == 13 && r != "" && n(s.detail.box).find("#grid-search-save").trigger("click"), l.keyCode == 27 && this.message();
      }).eq(0).on("input.message", (l) => {
        var r = n(s.detail.box).closest(".w2ui-message").find("#grid-search-save");
        String(n(s.detail.box).val()).trim() === "" ? r.prop("disabled", true) : r.prop("disabled", false);
      }).get(0).focus();
    });
  }
  cache(e) {
    var _a;
    if (c.hasLocalStorage && this.useLocalStorage) try {
      var t = JSON.parse(localStorage.w2ui || "{}");
      return t[_a = this.stateId || this.name] ?? (t[_a] = {}), t[this.stateId || this.name][e];
    } catch {
    }
    return null;
  }
  cacheSave(e, t) {
    var _a;
    if (c.hasLocalStorage && this.useLocalStorage) try {
      var i = JSON.parse(localStorage.w2ui || "{}");
      return i[_a = this.stateId || this.name] ?? (i[_a] = {}), i[this.stateId || this.name][e] = t, localStorage.w2ui = JSON.stringify(i), true;
    } catch {
      delete localStorage.w2ui;
    }
    return false;
  }
  searchReset(e) {
    var t = [];
    let i = false;
    for (let r = 0; r < this.searches.length; r++) this.searches[r].hidden && this.searches[r].value != null && (t.push({ field: this.searches[r].field, operator: this.searches[r].operator || "is", type: this.searches[r].type, value: this.searches[r].value || "" }), i = true);
    var s = this.trigger("search", { reset: true, target: this.name, searchData: t });
    if (s.isCancelled !== true) {
      var l = n(this.box).find("#grid_" + this.name + "_search_all");
      if (this.searchData = s.detail.searchData, this.searchSelected = null, this.last.search = "", this.last.logic = i ? "AND" : "OR", l.next().hide(), 0 < this.searches.length) if (this.multiSearch && this.show.searchAll) this.last.field = "all", this.last.label = "All Fields", l.next().show();
      else {
        let r = 0;
        for (; r < this.searches.length && (this.searches[r].hidden || this.searches[r].simple === false); ) r++;
        r >= this.searches.length ? (this.last.field = "", this.last.label = "") : (this.last.field = this.searches[r].field, this.last.label = this.searches[r].label);
      }
      this.last.multi = false, this.last.fetch.offset = 0, this.last.scrollTop = 0, this.last.scrollLeft = 0, this.last.selection.indexes = [], this.last.selection.columns = {}, this.searchClose(), l = l.val("").get(0), (l == null ? void 0 : l._w2field) && l._w2field.reset(), e || this.reload(), s.finish();
    }
  }
  searchShowFields(e) {
    if (e === true) F.hide(this.name + "-search-fields");
    else {
      var t = [];
      for (let s = -1; s < this.searches.length; s++) {
        let l = this.searches[s];
        var i = l ? l.field : null, i = this.getColumn(i);
        let r = false, a = null;
        if (this.show.searchHiddenMsg == 1 && s != -1 && (i == null || i.hidden === true && i.hideable !== false) && (r = true, a = c.lang("This column " + (i == null ? "does not exist" : "is hidden"))), s == -1) {
          if (!this.multiSearch || !this.show.searchAll) continue;
          l = { field: "all", label: "All Fields" };
        } else if (i != null && i.hideable === false || l.hidden === true && (a = c.lang("This column is hidden"), l.simple === false)) continue;
        l.label == null && l.caption != null && (console.log("NOTICE: grid search.caption property is deprecated, please use search.label. Search ->", l), l.label = l.caption), t.push({ id: l.field, text: c.lang(l.label), search: l, tooltip: a, disabled: r, checked: l.field == this.last.field });
      }
      Y.show({ type: "radio", name: this.name + "-search-fields", anchor: n(this.box).find("#grid_" + this.name + "_search_name").parent().find(".w2ui-search-down").get(0), items: t, align: "none", hideOn: ["doc-click", "select"] }).select((s) => {
        this.searchInitInput(s.detail.item.search.field);
      });
    }
  }
  searchInitInput(e, t) {
    let i;
    var s = n(this.box).find("#grid_" + this.name + "_search_all");
    if (e == "all") i = { field: "all", label: c.lang("All Fields") };
    else if ((i = this.getSearch(e)) == null) return;
    this.last.search != "" ? (this.last.label = i.label, this.search(i.field, this.last.search)) : (this.last.field = i.field, this.last.label = i.label), s.attr("placeholder", c.lang("Search") + " " + c.lang(i.label || i.caption || i.field, true));
  }
  clear(e) {
    this.total = 0, this.records = [], this.summary = [], this.last.fetch.offset = 0, this.last.idCache = {}, this.last.selection = { indexes: [], columns: {} }, this.reset(true), e || this.refresh();
  }
  reset(e) {
    this.last.scrollTop = 0, this.last.scrollLeft = 0, this.last.range_start = null, this.last.range_end = null, n(this.box).find(`#grid_${this.name}_records`).prop("scrollTop", 0), e || this.refresh();
  }
  skip(e, t) {
    var _a;
    ((_a = this.url) == null ? void 0 : _a.get) ?? this.url ? (this.offset = parseInt(e), this.offset > this.total && (this.offset = this.total - this.limit), (this.offset < 0 || !c.isInt(this.offset)) && (this.offset = 0), this.clear(true), this.reload(t)) : console.log("ERROR: grid.skip() can only be called when you have remote data source.");
  }
  load(e, t) {
    return e == null ? (console.log('ERROR: You need to provide url argument when calling .load() method of "' + this.name + '" object.'), new Promise((i, s) => {
      s();
    })) : (this.clear(true), this.request("load", {}, e, t));
  }
  reload(e) {
    var _a;
    let t = this;
    var i = ((_a = this.url) == null ? void 0 : _a.get) ?? this.url;
    return t.selectionSave(), i ? this.load(i, () => {
      t.selectionRestore(), typeof e == "function" && e();
    }) : (this.reset(true), this.localSearch(), this.selectionRestore(), typeof e == "function" && e({ status: "success" }), new Promise((s) => {
      s();
    }));
  }
  request(e, t, i, s) {
    let l = this, r, a;
    var h = new Promise((m, f) => {
      r = m, a = f;
    });
    if (t == null && (t = {}), !(i = i || this.url)) return new Promise((m, f) => {
      f();
    });
    c.isInt(this.offset) || (this.offset = 0), c.isInt(this.last.fetch.offset) || (this.last.fetch.offset = 0);
    let o;
    var d = { limit: this.limit, offset: parseInt(this.offset) + parseInt(this.last.fetch.offset), searchLogic: this.last.logic, search: this.searchData.map((m) => (m = c.clone(m), this.searchMap && this.searchMap[m.field] && (m.field = this.searchMap[m.field]), m)), sort: this.sortData.map((m) => (m = c.clone(m), this.sortMap && this.sortMap[m.field] && (m.field = this.sortMap[m.field]), m)) };
    if (this.searchData.length === 0 && (delete d.search, delete d.searchLogic), this.sortData.length === 0 && delete d.sort, c.extend(d, this.postData), c.extend(d, t), e != "delete" && e != "save" || (delete d.limit, delete d.offset, (d.action = e) == "delete" && (d[this.recid || "recid"] = this.getSelection())), e == "load") {
      if ((o = this.trigger("request", { target: this.name, url: i, postData: d, httpMethod: "GET", httpHeaders: this.httpHeaders })).isCancelled === true) return new Promise((m, f) => {
        f();
      });
    } else o = { detail: { url: i, postData: d, httpMethod: e == "save" ? "PUT" : "DELETE", httpHeaders: this.httpHeaders } };
    if (this.last.fetch.offset === 0 && this.lock(c.lang(this.msgRefresh), true), this.last.fetch.controller) try {
      this.last.fetch.controller.abort();
    } catch {
    }
    switch (i = o.detail.url, e) {
      case "save":
        (i == null ? void 0 : i.save) && (i = i.save);
        break;
      case "delete":
        (i == null ? void 0 : i.remove) && (i = i.remove);
        break;
      default:
        i = (i == null ? void 0 : i.get) ?? i;
    }
    if (0 < Object.keys(this.routeData).length) {
      var u = c.parseRoute(i);
      if (0 < u.keys.length) for (let m = 0; m < u.keys.length; m++) this.routeData[u.keys[m].name] != null && (i = i.replace(new RegExp(":" + u.keys[m].name, "g"), this.routeData[u.keys[m].name]));
    }
    return i = new URL(i, location), t = c.prepareParams(i, { method: o.detail.httpMethod, headers: o.detail.httpHeaders, body: o.detail.postData }, this.dataType), Object.assign(this.last.fetch, { action: e, options: t, controller: new AbortController(), start: Date.now(), loaded: false }), t.signal = this.last.fetch.controller.signal, fetch(i, t).catch(p).then((m) => {
      m != null && ((m == null ? void 0 : m.status) != 200 ? p(m ?? {}) : (l.unlock(), m.json().catch(p).then((f) => {
        this.requestComplete(f, e, s, r, a);
      })));
    }), e == "load" && o.finish(), h;
    function p(m) {
      var f;
      (m == null ? void 0 : m.name) !== "AbortError" && (l.unlock(), (f = l.trigger("error", { response: m, lastFetch: l.last.fetch })).isCancelled !== true) && (m.status && m.status != 200 ? l.error(m.status + ": " + m.statusText) : (console.log("ERROR: Server communication failed.", `
   EXPECTED:`, { total: 5, records: [{ recid: 1, field: "value" }] }, `
         OR:`, { error: true, message: "error message" }), l.requestComplete({ error: true, message: c.lang(this.msgHTTPError), response: m }, e, s, r, a)), f.finish());
    }
  }
  requestComplete(e, t, i, s, l) {
    var _a;
    let r = e.error ?? false, a = (e.error == null && e.status === "error" && (r = true), this.last.fetch.response = (Date.now() - this.last.fetch.start) / 1e3, setTimeout(() => {
      this.show.statusResponse && this.status(c.lang("Server Response ${count} seconds", { count: this.last.fetch.response }));
    }, 10), this.last.pull_more = false, this.last.pull_refresh = true, "load");
    this.last.fetch.action == "save" && (a = "save"), this.last.fetch.action == "delete" && (a = "delete");
    var h = this.trigger(a, { target: this.name, error: r, data: e, lastFetch: this.last.fetch });
    if (h.isCancelled === true) l();
    else {
      if (r) this.error(c.lang(e.message ?? this.msgServerError)), l(e);
      else if (typeof this.parser == "function" ? typeof (e = this.parser(e)) != "object" && console.log("ERROR: Your parser did not return proper object") : e == null ? e = { error: true, message: c.lang(this.msgNotJSON) } : Array.isArray(e) && (e = { error: r, records: e, total: e.length }), t == "load") {
        if (e.total == null && (e.total = -1), e.records == null && (e.records = []), e.records.length == this.limit ? (l = this.records.length + e.records.length, this.last.fetch.hasMore = l != this.total) : (this.last.fetch.hasMore = false, this.total = this.offset + this.last.fetch.offset + e.records.length), this.last.fetch.hasMore || n(this.box).find("#grid_" + this.name + "_rec_more, #grid_" + this.name + "_frec_more").hide(), this.last.fetch.offset === 0) this.records = [], this.summary = [];
        else if (e.total != -1 && parseInt(e.total) != parseInt(this.total)) {
          let o = this;
          return this.message(c.lang(this.msgNeedReload)).ok(() => {
            delete o.last.fetch.offset, o.reload();
          }), new Promise((d) => {
            d();
          });
        }
        c.isInt(e.total) && (this.total = parseInt(e.total)), e.records && e.records.forEach((o) => {
          var _a2;
          this.recid && (o.recid = this.parseField(o, this.recid)), o.recid == null && (o.recid = "recid-" + this.records.length), (((_a2 = o.w2ui) == null ? void 0 : _a2.summary) === true ? this.summary : this.records).push(o);
        }), e.summary && (this.summary = [], e.summary.forEach((o) => {
          this.recid && (o.recid = this.parseField(o, this.recid)), o.recid == null && (o.recid = "recid-" + this.summary.length), this.summary.push(o);
        }));
      } else if (t == "delete") return this.reset(), this.reload();
      (((_a = this.url) == null ? void 0 : _a.get) ?? this.url) || (this.localSort(), this.localSearch()), this.total = parseInt(this.total), this.last.fetch.offset === 0 ? this.refresh() : (this.scroll(), this.resize()), typeof i == "function" && i(e), s(e), h.finish(), this.last.fetch.loaded = true;
    }
  }
  error(e) {
    var t = this.trigger("error", { target: this.name, message: e });
    t.isCancelled !== true && (this.message(e), t.finish());
  }
  getChanges(e) {
    var t = [];
    e === void 0 && (e = this.records);
    for (let l = 0; l < e.length; l++) {
      var i, s = e[l];
      (s == null ? void 0 : s.w2ui) && (s.w2ui.changes != null && ((i = {})[this.recid || "recid"] = s.recid, t.push(c.extend(i, s.w2ui.changes))), s.w2ui.expanded !== true) && s.w2ui.children && s.w2ui.children.length && t.push(...this.getChanges(s.w2ui.children));
    }
    return t;
  }
  mergeChanges() {
    var e = this.getChanges();
    for (let s = 0; s < e.length; s++) {
      var t, i = this.get(e[s][this.recid || "recid"]);
      for (t in e[s]) if (!(t == "recid" || this.recid && t == this.recid)) {
        typeof e[s][t] == "object" && (e[s][t] = e[s][t].text);
        try {
          (function l(r, a, h) {
            let o = a.split(".");
            o.length == 1 ? r[a] = h : (r = r[o[0]], o.shift(), l(r, o.join("."), h));
          })(i, t, e[s][t]);
        } catch (l) {
          console.log("ERROR: Cannot merge. ", l.message || "", l);
        }
        i.w2ui && delete i.w2ui.changes;
      }
    }
    this.refresh();
  }
  save(e) {
    var _a;
    var t = this.getChanges(), i = ((_a = this.url) == null ? void 0 : _a.save) ?? this.url;
    let s = this.trigger("save", { target: this.name, changes: t });
    s.isCancelled !== true && (i ? this.request("save", { changes: s.detail.changes }, null, (l) => {
      l.error || this.mergeChanges(), s.finish(), typeof e == "function" && e(l);
    }) : (this.mergeChanges(), s.finish()));
  }
  editField(e, t, i, s) {
    var _a, _b;
    let l = this;
    if (this.last.inEditMode === true) s && s.keyCode == 13 ? ({ index: r, column: a, value: h } = this.last._edit, this.editChange({ type: "custom", value: h }, r, a, s), this.editDone(r, a, s)) : 0 < (h = n(this.box).find("div.w2ui-edit-box .w2ui-input")).length && (h.get(0).tagName == "DIV" ? (h.text(h.text() + i), c.setCursorPosition(h.get(0), h.text().length)) : (h.val(h.val() + i), c.setCursorPosition(h.get(0), h.val().length)));
    else {
      let o = this.get(e, true), d = this.getCellEditable(o, t);
      if (d && !["checkbox", "check"].includes(d.type)) {
        let u = this.records[o], p = this.columns[t];
        var r = p.frozen === true ? "_f" : "_";
        if (["enum", "file"].indexOf(d.type) != -1) console.log('ERROR: input types "enum" and "file" are not supported in inline editing.');
        else {
          var a = this.trigger("editField", { target: this.name, recid: e, column: t, value: i, index: o, originalEvent: s });
          if (a.isCancelled !== true) {
            let v = function(_) {
              try {
                var k = getComputedStyle(_), E = _.tagName.toUpperCase() == "DIV" ? _.innerText : _.value, T = n(l.box).find("#grid_" + l.name + "_editable").get(0), S = `font-family: ${k["font-family"]}; font-size: ${k["font-size"]}; white-space: no-wrap;`, R = c.getStrWidth(E, S);
                R + 20 > T.clientWidth && n(T).css("width", R + 20 + "px");
              } catch {
              }
            };
            i = a.detail.value, this.last.inEditMode = true, this.last.editColumn = t, this.last._edit = { value: i, index: o, column: t, recid: e }, this.selectNone(true), this.select({ recid: e, column: t });
            var h = n(this.box).find("#grid_" + this.name + r + "rec_" + c.escapeId(e));
            let m = h.find('[col="' + t + '"] > div'), f = (this.last._edit.tr = h, this.last._edit.div = m, n(this.box).find("div.w2ui-edit-box").remove(), this.selectType != "row" && (n(this.box).find("#grid_" + this.name + r + "selection").attr("id", "grid_" + this.name + "_editable").removeClass("w2ui-selection").addClass("w2ui-edit-box").prepend('<div style="position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;"></div>').find(".w2ui-selection-resizer").remove(), m = n(this.box).find("#grid_" + this.name + "_editable > div:first-child")), d.attr = d.attr ?? "", d.text = d.text ?? "", d.style = d.style ?? "", d.items = d.items ?? [], ((_b = (_a = u.w2ui) == null ? void 0 : _a.changes) == null ? void 0 : _b[p.field]) != null ? c.stripTags(u.w2ui.changes[p.field]) : c.stripTags(l.parseField(u, p.field))), w = typeof (f = f ?? "") != "object" ? f : "", b = (a.detail.prevValue != null && (w = a.detail.prevValue), i != null && (f = i), p.style != null ? p.style + ";" : "");
            typeof p.render == "string" && ["number", "int", "float", "money", "percent", "size"].includes(p.render.split(":")[0]) && (b += "text-align: right;"), 0 < d.items.length && !c.isPlainObject(d.items[0]) && (d.items = c.normMenu(d.items));
            let g, y = ["date", "time", "datetime", "color", "list", "combo"];
            s = getComputedStyle(h.find('[col="' + t + '"] > div').get(0)), r = `font-family: ${s["font-family"]}; font-size: ${s["font-size"]};`, d.type === "div" ? (m.addClass("w2ui-editable").html(c.stripSpaces(`<div id="grid_${this.name}_edit_${e}_${t}" class="w2ui-input w2ui-focus"
                        contenteditable autocorrect="off" autocomplete="off" spellcheck="false"
                        style="${r + b + d.style}"
                        field="${p.field}" recid="${e}" column="${t}" ${d.attr}>
                    </div>` + d.text)), (g = m.find("div.w2ui-input").get(0)).innerText = typeof f != "object" ? f : "", i != null ? c.setCursorPosition(g, g.innerText.length) : c.setCursorPosition(g, 0, g.innerText.length)) : (m.addClass("w2ui-editable").html(c.stripSpaces(`<input id="grid_${this.name}_edit_${e}_${t}" class="w2ui-input"
                        autocorrect="off" autocomplete="off" spellcheck="false" type="text"
                        style="${r + b + d.style}"
                        field="${p.field}" recid="${e}" column="${t}" ${d.attr}>` + d.text)), g = m.find("input").get(0), d.type == "number" && (f = c.formatNumber(f)), d.type == "date" && (f = c.formatDate(c.isDate(f, d.format, true) || /* @__PURE__ */ new Date(), d.format)), g.value = typeof f != "object" ? f : "", h = (_) => {
              var _a2, _b2, _c, _d;
              var k = (_a2 = this.last._edit) == null ? void 0 : _a2.escKey;
              let E = false;
              var T = n(g).data("tooltipName");
              T && ((_b2 = F.get(T[0])) == null ? void 0 : _b2.selected) != null && (E = true), !this.last.inEditMode || k || !y.includes(d.type) || ((_c = _.detail.overlay.anchor) == null ? void 0 : _c.id) != ((_d = this.last._edit.input) == null ? void 0 : _d.id) && d.type != "list" || (this.editChange(), this.editDone(void 0, void 0, { keyCode: E ? 13 : 0 }));
            }, new me(c.extend({}, d, { el: g, selected: f, onSelect: h, onHide: h })), i == null && g && g.select()), Object.assign(this.last._edit, { input: g, edit: d }), n(g).off(".w2ui-editable").on("blur.w2ui-editable", (_) => {
              var k, E;
              this.last.inEditMode && (k = this.last._edit.edit.type, E = n(g).data("tooltipName"), y.includes(k) && E || (this.editChange(g, o, t, _), this.editDone()));
            }).on("mousedown.w2ui-editable", (_) => {
              _.stopPropagation();
            }).on("click.w2ui-editable", (_) => {
              v.call(g, _);
            }).on("paste.w2ui-editable", (_) => {
              _.preventDefault(), _ = _.clipboardData.getData("text/plain"), document.execCommand("insertHTML", false, _);
            }).on("keyup.w2ui-editable", (_) => {
              v.call(g, _);
            }).on("keydown.w2ui-editable", (_) => {
              switch (_.keyCode) {
                case 8:
                  d.type != "list" || g._w2field || _.preventDefault();
                  break;
                case 9:
                case 13:
                  _.preventDefault();
                  break;
                case 27:
                  var k = n(g).data("tooltipName");
                  k && 0 < k.length && (this.last._edit.escKey = true, F.hide(k[0]), _.preventDefault()), _.stopPropagation();
              }
              setTimeout(() => {
                var _a2, _b2;
                switch (_.keyCode) {
                  case 9:
                    var E = _.shiftKey ? l.prevCell(o, t, true) : l.nextCell(o, t, true);
                    E != null && (T = l.records[E.index].recid, this.editChange(g, o, t, _), this.editDone(o, t, _), l.selectType != "row" ? (l.selectNone(true), l.select({ recid: T, column: E.colIndex })) : l.editField(T, E.colIndex, null, _), _.preventDefault) && _.preventDefault();
                    break;
                  case 13: {
                    let S = false;
                    var T = n(g).data("tooltipName");
                    T && F.get(T[0]).selected != null && (S = true), T && S || (this.editChange(g, o, t, _), this.editDone(o, t, _));
                    break;
                  }
                  case 27: {
                    this.last._edit.escKey = false;
                    let S = l.parseField(u, p.field);
                    ((_b2 = (_a2 = u.w2ui) == null ? void 0 : _a2.changes) == null ? void 0 : _b2[p.field]) != null && (S = u.w2ui.changes[p.field]), g._prevValue != null && (S = g._prevValue), g.tagName == "DIV" ? g.innerText = S ?? "" : g.value = S ?? "", this.editDone(o, t, _), setTimeout(() => {
                      l.select({ recid: e, column: t });
                    }, 1);
                    break;
                  }
                }
                v(g);
              }, 1);
            }), g && (g._prevValue = w), d.type != "list" && setTimeout(() => {
              this.last.inEditMode && g && (g.focus(), clearTimeout(this.last.kbd_timer), (g.resize = v)(g));
            }, 50), a.finish({ input: g });
          }
        }
      }
    }
  }
  editChange(e, t, i, s) {
    var _a, _b, _c, _d;
    e = e ?? this.last._edit.input, t = t ?? this.last._edit.index, i = i ?? this.last._edit.column, s = s ?? {};
    var l = (t < 0 ? this.summary : this.records)[t = t < 0 ? -t - 1 : t], r = this.columns[i];
    let a = (e == null ? void 0 : e.tagName) == "DIV" ? e.innerText : e.value;
    var h = e._w2field, o = (h && (h.type == "list" && (a = h.selected), Object.keys(a).length !== 0 && a != null || (a = ""), c.isPlainObject(a) || (a = h.clean(a))), e.type == "checkbox" && (((_a = l.w2ui) == null ? void 0 : _a.editable) === false && (e.checked = !e.checked), a = e.checked), this.parseField(l, r.field)), d = ((_b = l.w2ui) == null ? void 0 : _b.changes) && l.w2ui.changes.hasOwnProperty(r.field) ? l.w2ui.changes[r.field] : o;
    let u = { target: this.name, input: e, recid: l.recid, index: t, column: i, originalEvent: s, value: { new: a, previous: d, original: o } }, p = (((_c = s.target) == null ? void 0 : _c._prevValue) != null && (u.value.previous = s.target._prevValue), 0);
    for (; p < 20; ) {
      if (p++, typeof (a = u.value.new) != "object" && String(o) != String(a) || typeof a == "object" && a && a.id != o && (typeof o != "object" || o == null || a.id != o.id)) {
        if ((u = this.trigger("change", u)).isCancelled !== true) {
          if (a !== u.detail.value.new) continue;
          (u.detail.value.new !== "" && u.detail.value.new != null || d !== "" && d != null) && (l.w2ui = l.w2ui ?? {}, l.w2ui.changes = l.w2ui.changes ?? {}, l.w2ui.changes[r.field] = u.detail.value.new), u.finish();
        }
      } else if ((u = this.trigger("restore", u)).isCancelled !== true) {
        if (a !== u.detail.value.new) continue;
        ((_d = l.w2ui) == null ? void 0 : _d.changes) && (delete l.w2ui.changes[r.field], Object.keys(l.w2ui.changes).length === 0) && delete l.w2ui.changes, u.finish();
      }
      break;
    }
  }
  editDone(e, t, i) {
    var _a, _b;
    if (e = e ?? this.last._edit.index, t = t ?? this.last._edit.column, i = i ?? {}, this.advanceOnEdit && i.keyCode == 13) {
      let h = i.shiftKey ? this.prevRow(e, t, 1) : this.nextRow(e, t, 1);
      h == null && (h = e), setTimeout(() => {
        this.selectType != "row" ? (this.selectNone(true), this.select({ recid: this.records[h].recid, column: t })) : this.editField(this.records[h].recid, t, null, i);
      }, 1);
    }
    var s = e < 0, l = n(this.last._edit.tr).find('[col="' + t + '"]'), r = this.records[e], a = this.columns[t];
    this.last.inEditMode = false, this.last._edit = null, s || (((_b = (_a = r.w2ui) == null ? void 0 : _a.changes) == null ? void 0 : _b[a.field]) != null ? l.addClass("w2ui-changed") : l.removeClass("w2ui-changed"), l.replace(this.getCellHTML(e, t, s))), n(this.box).find("div.w2ui-edit-box").remove(), this.updateToolbar(), setTimeout(() => {
      var h = n(this.box).find(`#grid_${this.name}_focus`).get(0);
      document.activeElement === h || this.last.inEditMode || h.focus();
    }, 10);
  }
  delete(e) {
    var _a;
    var t = this.trigger("delete", { target: this.name, force: e });
    if (e && this.message(), t.isCancelled !== true) {
      e = t.detail.force;
      var i = this.getSelection();
      if (i.length !== 0) if (this.msgDelete == "" || e) {
        if (typeof this.url != "object" ? this.url : this.url.remove) this.request("delete");
        else if (typeof i[0] != "object") this.selectNone(), this.remove.apply(this, i);
        else {
          for (let a = 0; a < i.length; a++) {
            var s = this.columns[i[a].column].field, l = this.get(i[a].recid, true), r = this.records[l];
            l != null && s != "recid" && (this.records[l][s] = "", (_a = r.w2ui) == null ? void 0 : _a.changes) && delete r.w2ui.changes[s];
          }
          this.update();
        }
        t.finish();
      } else this.confirm({ text: c.lang(this.msgDelete, { count: i.length, records: c.lang(i.length == 1 ? "record" : "records") }), width: 380, height: 170, yes_text: c.lang("Delete"), yes_class: "w2ui-btn-red", no_text: c.lang("Cancel") }).yes((a) => {
        a.detail.self.close(), this.delete(true);
      }).no((a) => {
        a.detail.self.close();
      });
    }
  }
  click(e, t) {
    var _a, _b, _c;
    var i = Date.now();
    let s = null;
    if (!(this.last.cancelClick == 1 || t && t.altKey)) if (typeof e == "object" && e !== null && (s = e.column, e = e.recid), t == null && (t = {}), i - parseInt(this.last.click_time) < 350 && this.last.click_recid == e && t.type == "click") this.dblClick(e, t);
    else {
      if (this.last.bubbleEl && (this.last.bubbleEl = null), this.last.click_time = i, i = this.last.click_recid, this.last.click_recid = e, s == null && t.target) {
        let u = t.target;
        u.tagName != "TD" && (u = n(u).closest("td")[0]), n(u).attr("col") != null && (s = parseInt(n(u).attr("col")));
      }
      var l = this.trigger("click", { target: this.name, recid: e, column: s, originalEvent: t });
      if (l.isCancelled !== true) {
        var r = this.getSelection(), a = (n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.get(e, true)), h = [];
        this.last.sel_ind = a, this.last.sel_col = s, this.last.sel_recid = e, this.last.sel_type = "click";
        let u, p, m, f;
        if (t.shiftKey && 0 < r.length && this.multiSelect) {
          if (r[0].recid) {
            u = this.get(r[0].recid, true), p = this.get(e, true), f = s > r[0].column ? (m = r[0].column, s) : (m = s, r[0].column);
            for (let w = m; w <= f; w++) h.push(w);
          } else u = this.get(i, true), p = this.get(e, true);
          var o = [], d = (u > p && (i = u, u = p, p = i), ((_a = this.url) == null ? void 0 : _a.get) ? this.url.get : this.url);
          for (let w = u; w <= p; w++) if (!(0 < this.searchData.length) || d || this.last.searchIds.includes(w)) if (this.selectType == "row") o.push(this.records[w].recid);
          else for (let b = 0; b < h.length; b++) o.push({ recid: this.records[w].recid, column: h[b] });
          this.select(o);
        } else {
          i = this.last.selection;
          let w = i.indexes.indexOf(a) != -1, b = false;
          n(t.target).closest("td").hasClass("w2ui-col-select") && (b = true), (t.ctrlKey || t.shiftKey || t.metaKey || b) && this.multiSelect || this.showSelectColumn ? (w = this.selectType == "row" || ((_b = i.columns[a]) == null ? void 0 : _b.includes(s)) ? w : false) === true ? this.unselect({ recid: e, column: s }) : this.select({ recid: e, column: s }) : (this.selectType == "row" || ((_c = i.columns[a]) == null ? void 0 : _c.includes(s)) || (w = false), this.selectNone(true), w === true && r.length == 1 ? this.unselect({ recid: e, column: s }) : this.select({ recid: e, column: s }));
        }
        this.status(), this.initResize(), l.finish();
      }
    }
  }
  columnClick(e, t) {
    if (this.last.colResizing !== true) {
      let r = this.trigger("columnClick", { target: this.name, field: e, originalEvent: t });
      if (r.isCancelled !== true) {
        if (this.selectType == "row") {
          var i = this.getColumn(e);
          i && i.sortable && this.sort(e, null, !(!t || !t.ctrlKey && !t.metaKey)), r.detail.field == "line-number" && (this.getSelection().length >= this.records.length ? this.selectNone() : this.selectAll());
        } else if (t.altKey && (i = this.getColumn(e)) && i.sortable && this.sort(e, null, !(!t || !t.ctrlKey && !t.metaKey)), r.detail.field == "line-number") this.getSelection().length >= this.records.length ? this.selectNone() : this.selectAll();
        else {
          t.shiftKey || t.metaKey || t.ctrlKey || this.selectNone(true);
          var i = this.getSelection(), e = this.getColumn(r.detail.field, true), s = [], l = [];
          if (i.length != 0 && t.shiftKey) {
            let o = e, d = i[0].column;
            o > d && (o = i[0].column, d = e);
            for (let u = o; u <= d; u++) l.push(u);
          } else l.push(e);
          if ((r = this.trigger("columnSelect", { target: this.name, columns: l })).isCancelled !== true) {
            for (let o = 0; o < this.records.length; o++) s.push({ recid: this.records[o].recid, column: l });
            this.select(s);
          }
          r.finish();
        }
        r.finish();
      }
    }
  }
  columnDblClick(e, t) {
    e = this.trigger("columnDblClick", { target: this.name, field: e, originalEvent: t }), e.isCancelled !== true && e.finish();
  }
  columnContextMenu(e, t) {
    e = this.trigger("columnContextMenu", { target: this.name, field: e, originalEvent: t }), e.isCancelled !== true && (this.show.columnMenu && (Y.show({ type: "check", anchor: document.body, originalEvent: t, items: this.initColumnOnOff() }).then(() => {
      n("#w2overlay-context-menu .w2ui-grid-skip").off(".w2ui-grid").on("click.w2ui-grid", (i) => {
        i.stopPropagation();
      }).on("keypress", (i) => {
        i.keyCode == 13 && (this.skip(i.target.value), this.toolbar.click("w2ui-column-on-off"));
      });
    }).select((i) => {
      var s = i.detail.item.id;
      ["w2ui-stateSave", "w2ui-stateReset"].includes(s) ? this[s.substring(5)]() : s != "w2ui-skip" && this.columnOnOff(i, i.detail.item.id), clearTimeout(this.last.kbd_timer);
    }), clearTimeout(this.last.kbd_timer)), t.preventDefault(), e.finish());
  }
  focus(e) {
    if (e = this.trigger("focus", { target: this.name, originalEvent: e }), e.isCancelled === true) return false;
    this.hasFocus = true, n(this.box).removeClass("w2ui-inactive").find(".w2ui-inactive").removeClass("w2ui-inactive"), setTimeout(() => {
      var t = n(this.box).find(`#grid_${this.name}_focus`).get(0);
      t && document.activeElement != t && t.focus();
    }, 10), e.finish();
  }
  blur(e) {
    if (e = this.trigger("blur", { target: this.name, originalEvent: e }), e.isCancelled === true) return false;
    this.hasFocus = false, n(this.box).addClass("w2ui-inactive").find(".w2ui-selected").addClass("w2ui-inactive"), n(this.box).find(".w2ui-selection").addClass("w2ui-inactive"), e.finish();
  }
  keydown(e) {
    let t = this, i = typeof this.url != "object" ? this.url : this.url.get;
    if (t.keyboard === true) {
      var s = t.trigger("keydown", { target: t.name, originalEvent: e });
      if (s.isCancelled !== true) if (0 < n(this.box).find(".w2ui-message").length) e.keyCode == 27 && this.message();
      else {
        let _ = function(S) {
          if (h && E(), !(b.length <= 0)) {
            let x = t.prevRow(f, t.selectType == "row" ? 0 : d[0].column, S);
            if ((x = v || x != null ? x : t.searchData.length == 0 || i ? 0 : t.last.searchIds[0]) != null) {
              if (v && t.multiSelect) {
                if (T()) return;
                if (t.selectType == "row") t.last.sel_ind > x && t.last.sel_ind != w ? t.unselect(t.records[w].recid) : t.select(t.records[x].recid);
                else if (t.last.sel_ind > x && t.last.sel_ind != w) {
                  x = w;
                  var R = [];
                  for (let $ = 0; $ < p.length; $++) R.push({ recid: t.records[x].recid, column: p[$] });
                  t.unselect(R);
                } else {
                  var C = [];
                  for (let $ = 0; $ < p.length; $++) C.push({ recid: t.records[x].recid, column: p[$] });
                  t.select(C);
                }
              } else t.selectNone(true), t.click({ recid: t.records[x].recid, column: p[0] }, e);
              t.scrollIntoView(x, null, true, S != 1), e.preventDefault && e.preventDefault();
            } else v || t.selectNone(true);
          }
        }, k = function(S) {
          if (h && E(), !(b.length <= 0)) {
            let x = t.nextRow(w, t.selectType == "row" ? 0 : d[0].column, S);
            if ((x = v || x != null ? x : t.searchData.length == 0 || i ? t.records.length - 1 : t.last.searchIds[t.last.searchIds.length - 1]) != null) {
              if (v && t.multiSelect) {
                if (T()) return;
                if (t.selectType == "row") t.last.sel_ind < x && t.last.sel_ind != f ? t.unselect(t.records[f].recid) : t.select(t.records[x].recid);
                else if (t.last.sel_ind < x && t.last.sel_ind != f) {
                  x = f;
                  var R = [];
                  for (let $ = 0; $ < p.length; $++) R.push({ recid: t.records[x].recid, column: p[$] });
                  t.unselect(R);
                } else {
                  var C = [];
                  for (let $ = 0; $ < p.length; $++) C.push({ recid: t.records[x].recid, column: p[$] });
                  t.select(C);
                }
              } else t.selectNone(true), t.click({ recid: t.records[x].recid, column: p[0] }, e);
              t.scrollIntoView(x, null, true, S != 1), g = true;
            } else v || t.selectNone(true);
          }
        }, E = function() {
          if (t.records && t.records.length !== 0) {
            let S = Math.floor(o[0].scrollTop / t.recordHeight) + 1;
            (!t.records[S] || S < 2) && (S = 0), t.records[S] !== void 0 && t.select({ recid: t.records[S].recid, column: 0 });
          }
        }, T = function() {
          if (t.last.sel_type == "click") {
            if (t.selectType == "row") return t.last.sel_type = "key", 1 < d.length && (d.splice(d.indexOf(t.records[t.last.sel_ind].recid), 1), t.unselect(d), 1);
            if (t.last.sel_type = "key", 1 < d.length) {
              for (let S = 0; S < d.length; S++) if (d[S].recid == t.last.sel_recid && d[S].column == t.last.sel_col) {
                d.splice(S, 1);
                break;
              }
              return t.unselect(d), 1;
            }
          }
        }, h = false, o = n(t.box).find("#grid_" + t.name + "_records"), d = t.getSelection(), u = (d.length === 0 && (h = true), d[0] || null), p = [], m = d[d.length - 1];
        if (typeof u == "object" && u != null) {
          u = d[0].recid, p = [];
          let S = 0;
          for (; !(!d[S] || d[S].recid != u); ) p.push(d[S].column), S++;
          m = d[d.length - 1].recid;
        }
        let f = t.get(u, true), w = t.get(m, true), b = n(t.box).find(`#grid_${t.name}_rec_` + (f != null ? c.escapeId(t.records[f].recid) : "none"));
        var l, r = Math.floor(o[0].clientHeight / t.recordHeight);
        let g = false, y = e.keyCode, v = e.shiftKey;
        switch (y) {
          case 8:
          case 46:
            t.delete(), g = true, e.stopPropagation();
            break;
          case 27:
            t.selectNone(), g = true;
            break;
          case 65:
            (e.metaKey || e.ctrlKey) && (t.selectAll(), g = true);
            break;
          case 13:
            if (this.selectType == "row" && t.show.expandColumn === true) {
              if (b.length <= 0) break;
              t.toggle(u, e), g = true;
            } else {
              for (let S = 0; S < this.columns.length; S++) if (this.getCellEditable(f, S)) {
                p.push(parseInt(S));
                break;
              }
              0 < (p = this.selectType == "row" && this.last._edit && this.last._edit.column ? [this.last._edit.column] : p).length && (t.editField(u, this.last.editColumn || p[0], null, e), g = true);
            }
            break;
          case 37:
            (function() {
              if (h) E();
              else {
                if (t.selectType == "row") {
                  if (b.length <= 0) return;
                  var S = t.records[f].w2ui || {};
                  !S || S.parent_recid == null || Array.isArray(S.children) && S.children.length !== 0 && S.expanded ? t.collapse(u, e) : (t.unselect(u), t.collapse(S.parent_recid, e), t.select(S.parent_recid));
                } else {
                  let $ = t.prevCell(f, p[0]);
                  if ($ = ($ == null ? void 0 : $.index) != f ? null : $ == null ? void 0 : $.colIndex, v || $ != null || (t.selectNone(true), $ = 0), $ != null) if (v && t.multiSelect) {
                    if (T()) return;
                    var R = [], C = [], x = [];
                    if (p.indexOf(t.last.sel_col) === 0 && 1 < p.length) {
                      for (let I = 0; I < d.length; I++) R.indexOf(d[I].recid) == -1 && R.push(d[I].recid), x.push({ recid: d[I].recid, column: p[p.length - 1] });
                      t.unselect(x), t.scrollIntoView(f, p[p.length - 1], true);
                    } else {
                      for (let I = 0; I < d.length; I++) R.indexOf(d[I].recid) == -1 && R.push(d[I].recid), C.push({ recid: d[I].recid, column: $ });
                      t.select(C), t.scrollIntoView(f, $, true);
                    }
                  } else t.click({ recid: u, column: $ }, e), t.scrollIntoView(f, $, true);
                  else v || t.selectNone(true);
                }
                g = true;
              }
            })();
            break;
          case 39:
            (function() {
              if (h) E();
              else {
                if (t.selectType == "row") {
                  if (b.length <= 0) return;
                  t.expand(u, e);
                } else {
                  let x = t.nextCell(f, p[p.length - 1]);
                  if (x = x.index != f ? null : x.colIndex, v || x != null || (t.selectNone(true), x = t.columns.length - 1), x != null) if (v && y == 39 && t.multiSelect) {
                    if (T()) return;
                    var S = [], R = [], C = [];
                    if (p.indexOf(t.last.sel_col) == p.length - 1 && 1 < p.length) {
                      for (let $ = 0; $ < d.length; $++) S.indexOf(d[$].recid) == -1 && S.push(d[$].recid), C.push({ recid: d[$].recid, column: p[0] });
                      t.unselect(C), t.scrollIntoView(f, p[0], true);
                    } else {
                      for (let $ = 0; $ < d.length; $++) S.indexOf(d[$].recid) == -1 && S.push(d[$].recid), R.push({ recid: d[$].recid, column: x });
                      t.select(R), t.scrollIntoView(f, x, true);
                    }
                  } else t.click({ recid: u, column: x }, e), t.scrollIntoView(f, x, true);
                  else v || t.selectNone(true);
                }
                g = true;
              }
            })();
            break;
          case 33:
            _(r);
            break;
          case 34:
            k(r);
            break;
          case 35:
            k(-1);
            break;
          case 36:
            _(-1);
            break;
          case 38:
            _(e.metaKey || e.ctrlKey ? -1 : 1);
            break;
          case 40:
            k(e.metaKey || e.ctrlKey ? -1 : 1);
            break;
          case 17:
          case 91:
            h || c.isSafari && (t.last.copy_event = t.copy(false, e), (l = n(t.box).find("#grid_" + t.name + "_focus")).val(t.last.copy_event.detail.text), l[0].select());
            break;
          case 67:
            (e.metaKey || e.ctrlKey) && (c.isSafari || (t.last.copy_event = t.copy(false, e), (l = n(t.box).find("#grid_" + t.name + "_focus")).val(t.last.copy_event.detail.text), l[0].select()), t.copy(t.last.copy_event, e));
            break;
          case 88:
            h || (e.ctrlKey || e.metaKey) && (c.isSafari || (t.last.copy_event = t.copy(false, e), (l = n(t.box).find("#grid_" + t.name + "_focus")).val(t.last.copy_event.detail.text), l[0].select()), t.copy(t.last.copy_event, e));
        }
        var a = [32, 187, 189, 192, 219, 220, 221, 186, 222, 188, 190, 191];
        for (let S = 48; S <= 111; S++) a.push(S);
        a.indexOf(y) == -1 || e.ctrlKey || e.metaKey || g || (p.length === 0 && p.push(0), g = false, setTimeout(() => {
          var S = n(t.box).find("#grid_" + t.name + "_focus"), R = S.val();
          S.val(""), t.editField(u, p[0], R, e);
        }, 1)), g && e.preventDefault && e.preventDefault(), s.finish();
      }
    }
  }
  scrollIntoView(e, t, i, s) {
    let l = this.records.length;
    if ((l = this.searchData.length == 0 || this.url ? l : this.last.searchIds.length) !== 0) {
      if (e == null) {
        var r = this.getSelection();
        if (r.length === 0) return;
        c.isPlainObject(r[0]) ? (e = r[0].index, t = r[0].column) : e = this.get(r[0], true);
      }
      var r = n(this.box).find(`#grid_${this.name}_records`), a = r[0].clientWidth, h = r[0].clientHeight, o = r[0].scrollTop, d = r[0].scrollLeft, u = this.last.searchIds.length;
      if (0 < u && (e = this.last.searchIds.indexOf(e)), r.css({ "scroll-behavior": i ? "auto" : "smooth" }), h < this.recordHeight * (0 < u ? u : l) && 0 < r.length && (u = (i = Math.floor(o / this.recordHeight)) + Math.floor(h / this.recordHeight), e == i && r.prop("scrollTop", o - h / 1.3), e == u && r.prop("scrollTop", o + h / 1.3), (e < i || u < e) && r.prop("scrollTop", (e - 1) * this.recordHeight), s === true) && r.prop("scrollTop", e * this.recordHeight), t != null) {
        let m = 0, f = 0;
        o = c.scrollBarSize();
        for (let w = 0; w <= t; w++) {
          var p = this.columns[w];
          p.frozen || p.hidden || (m = f, f += parseInt(p.sizeCalculated));
        }
        a < f - d ? r.prop("scrollLeft", m - o) : m < d && r.prop("scrollLeft", f - a + 2 * o);
      }
    }
  }
  scrollToColumn(e) {
    if (e != null) {
      let i = 0, s = false;
      for (let l = 0; l < this.columns.length; l++) {
        var t = this.columns[l];
        if (t.field == e) {
          s = true;
          break;
        }
        t.frozen || t.hidden || (t = parseInt(t.sizeCalculated || t.size), i += t);
      }
      s && (this.last.scrollLeft = i + 1, this.scroll());
    }
  }
  dblClick(e, t) {
    let i = null;
    if (typeof e == "object" && e !== null && (i = e.column, e = e.recid), t == null && (t = {}), i == null && t.target) {
      let a = t.target;
      a.tagName.toUpperCase() != "TD" && (a = n(a).closest("td")[0]), i = parseInt(n(a).attr("col"));
    }
    var s = this.get(e, true), l = this.records[s], r = this.trigger("dblClick", { target: this.name, recid: e, column: i, originalEvent: t });
    r.isCancelled !== true && (this.selectNone(true), this.getCellEditable(s, i) ? this.editField(e, i, null, t) : (this.select({ recid: e, column: i }), (this.show.expandColumn || l && l.w2ui && Array.isArray(l.w2ui.children)) && this.toggle(e)), r.finish());
  }
  showContextMenu(e, t, i) {
    if (this.last.userSelect != "text") {
      (i = i ?? { offsetX: 0, offsetY: 0, target: n(this.box).find(`#grid_${this.name}_rec_` + e)[0] }).offsetX == null && (i.offsetX = i.layerX - i.target.offsetLeft, i.offsetY = i.layerY - i.target.offsetTop), c.isFloat(e) && (e = parseFloat(e));
      var s = this.getSelection();
      if (this.selectType == "row") s.indexOf(e) == -1 && this.click(e);
      else {
        let r = false;
        for (let a = 0; a < s.length; a++) s[a].recid != e && s[a].column != t || (r = true);
        r || e == null || this.click({ recid: e, column: t }), r || t == null || this.columnClick(this.columns[t].field, i);
      }
      var l = this.trigger("contextMenu", { target: this.name, originalEvent: i, recid: e, column: t });
      l.isCancelled !== true && (0 < this.contextMenu.length && (Y.show({ anchor: document.body, originalEvent: i, items: this.contextMenu }).select((r) => {
        clearTimeout(this.last.kbd_timer), this.contextMenuClick(e, t, r);
      }), clearTimeout(this.last.kbd_timer)), i.preventDefault(), l.finish());
    }
  }
  contextMenuClick(e, t, i) {
    e = this.trigger("contextMenuClick", { target: this.name, recid: e, column: t, originalEvent: i.detail.originalEvent, menuEvent: i, menuIndex: i.detail.index, menuItem: i.detail.item }), e.isCancelled !== true && e.finish();
  }
  toggle(e) {
    var t = this.get(e);
    if (t != null) return t.w2ui = t.w2ui ?? {}, t.w2ui.expanded === true ? this.collapse(e) : this.expand(e);
  }
  expand(e, t) {
    var _a;
    var i = this.get(e, true);
    let s = this.records[i];
    s.w2ui = s.w2ui ?? {};
    var l = c.escapeId(e), r = s.w2ui.children;
    let a;
    if (Array.isArray(r)) {
      if (s.w2ui.expanded === true || r.length === 0 || (a = this.trigger("expand", { target: this.name, recid: e })).isCancelled === true) return false;
      s.w2ui.expanded = true, r.forEach((h) => {
        h.w2ui = h.w2ui ?? {}, h.w2ui.parent_recid = s.recid, h.w2ui.children == null && (h.w2ui.children = []);
      }), this.records.splice.apply(this.records, [i + 1, 0].concat(r)), this.total !== -1 && (this.total += r.length), (typeof this.url != "object" ? this.url : this.url.get) || (this.localSort(true, true), 0 < this.searchData.length && this.localSearch(true)), t !== true && this.refresh(), a.finish();
    } else {
      if (0 < n(this.box).find("#grid_" + this.name + "_rec_" + l + "_expanded_row").length || this.show.expandColumn !== true || s.w2ui.expanded == "none") return false;
      if (n(this.box).find("#grid_" + this.name + "_rec_" + l).after(`<tr id="grid_${this.name}_rec_${e}_expanded_row" class="w2ui-expanded-row">
                    <td colspan="100" class="w2ui-expanded2">
                        <div id="grid_${this.name}_rec_${e}_expanded"></div>
                    </td>
                    <td class="w2ui-grid-data-last"></td>
                </tr>`), n(this.box).find("#grid_" + this.name + "_frec_" + l).after(`<tr id="grid_${this.name}_frec_${e}_expanded_row" class="w2ui-expanded-row">
                    ${this.show.lineNumbers ? '<td class="w2ui-col-number"></td>' : ""}
                    <td class="w2ui-grid-data w2ui-expanded1" colspan="100">
                       <div id="grid_${this.name}_frec_${e}_expanded"></div>
                    </td>
                </tr>`), (a = this.trigger("expand", { target: this.name, recid: e, box_id: "grid_" + this.name + "_rec_" + e + "_expanded", fbox_id: "grid_" + this.name + "_frec_" + e + "_expanded" })).isCancelled === true) return n(this.box).find("#grid_" + this.name + "_rec_" + l + "_expanded_row").remove(), n(this.box).find("#grid_" + this.name + "_frec_" + l + "_expanded_row").remove(), false;
      i = n(this.box).find("#grid_" + this.name + "_rec_" + e + "_expanded"), r = n(this.box).find("#grid_" + this.name + "_frec_" + e + "_expanded"), t = ((_a = i.find(":scope div:first-child")[0]) == null ? void 0 : _a.clientHeight) ?? 50, i[0].clientHeight < t && i.css({ height: t + "px" }), r[0].clientHeight < t && r.css({ height: t + "px" }), n(this.box).find("#grid_" + this.name + "_rec_" + l).attr("expanded", "yes").addClass("w2ui-expanded"), n(this.box).find("#grid_" + this.name + "_frec_" + l).attr("expanded", "yes").addClass("w2ui-expanded"), n(this.box).find("#grid_" + this.name + "_cell_" + this.get(e, true) + "_expand div").html("-"), s.w2ui.expanded = true, a.finish(), this.resizeRecords();
    }
    return true;
  }
  collapse(e, t) {
    var i = this.get(e, true);
    let s = this.records[i], l = (s.w2ui = s.w2ui || {}, c.escapeId(e));
    var r = s.w2ui.children;
    let a;
    if (Array.isArray(r)) {
      if (s.w2ui.expanded !== true || (a = this.trigger("collapse", { target: this.name, recid: e })).isCancelled === true) return false;
      (function d(u) {
        u.w2ui.expanded = false;
        for (let p = 0; p < u.w2ui.children.length; p++) {
          let m = u.w2ui.children[p];
          m.w2ui.expanded && d(m);
        }
      })(s);
      var h = [];
      for (let d = s; d != null; d = this.get(d.w2ui.parent_recid)) h.push(d.w2ui.parent_recid);
      r = i + 1;
      let o = r;
      for (; !(this.records.length <= o + 1 || this.records[o + 1].w2ui == null || 0 <= h.indexOf(this.records[o + 1].w2ui.parent_recid)); ) o++;
      this.records.splice(r, o - r + 1), this.total !== -1 && (this.total -= o - r + 1), (typeof this.url != "object" ? this.url : this.url.get) || 0 < this.searchData.length && this.localSearch(true), t !== true && this.refresh(), a.finish();
    } else {
      if (n(this.box).find("#grid_" + this.name + "_rec_" + l + "_expanded_row").length === 0 || this.show.expandColumn !== true || (a = this.trigger("collapse", { target: this.name, recid: e, box_id: "grid_" + this.name + "_rec_" + e + "_expanded", fbox_id: "grid_" + this.name + "_frec_" + e + "_expanded" })).isCancelled === true) return false;
      n(this.box).find("#grid_" + this.name + "_rec_" + l).removeAttr("expanded").removeClass("w2ui-expanded"), n(this.box).find("#grid_" + this.name + "_frec_" + l).removeAttr("expanded").removeClass("w2ui-expanded"), n(this.box).find("#grid_" + this.name + "_cell_" + this.get(e, true) + "_expand div").html("+"), n(this.box).find("#grid_" + this.name + "_rec_" + l + "_expanded").css("height", "0px"), n(this.box).find("#grid_" + this.name + "_frec_" + l + "_expanded").css("height", "0px"), setTimeout(() => {
        n(this.box).find("#grid_" + this.name + "_rec_" + l + "_expanded_row").remove(), n(this.box).find("#grid_" + this.name + "_frec_" + l + "_expanded_row").remove(), s.w2ui.expanded = false, a.finish(), this.resizeRecords();
      }, 300);
    }
    return true;
  }
  sort(e, t, i) {
    var s = this.trigger("sort", { target: this.name, field: e, direction: t, multiField: i });
    if (s.isCancelled !== true) {
      if (e != null) {
        let l = this.sortData.length;
        for (let r = 0; r < this.sortData.length; r++) if (this.sortData[r].field == e) {
          l = r;
          break;
        }
        t == null && (t = this.sortData[l] != null && (this.sortData[l].direction == null && (this.sortData[l].direction = ""), this.sortData[l].direction.toLowerCase() === "asc") ? "desc" : "asc"), this.multiSort === false && (this.sortData = [], l = 0), i != 1 && (this.sortData = [], l = 0), this.sortData[l] == null && (this.sortData[l] = {}), this.sortData[l].field = e, this.sortData[l].direction = t;
      } else this.sortData = [];
      (typeof this.url != "object" ? this.url : this.url.get) ? (s.finish({ direction: t }), this.last.fetch.offset = 0, this.reload()) : (this.localSort(false, true), 0 < this.searchData.length && this.localSearch(true), this.last.scrollTop = 0, n(this.box).find(`#grid_${this.name}_records`).prop("scrollTop", 0), s.finish({ direction: t }), this.refresh());
    }
  }
  copy(e, t) {
    if (c.isPlainObject(e)) return e.finish(), e.text;
    var i = this.getSelection();
    if (i.length === 0) return "";
    let s = "";
    if (typeof i[0] == "object") {
      let d = i[0].column, u = i[0].column;
      var l = [];
      for (let p = 0; p < i.length; p++) i[p].column < d && (d = i[p].column), i[p].column > u && (u = i[p].column), l.indexOf(i[p].index) == -1 && l.push(i[p].index);
      l.sort((p, m) => p - m);
      for (let p = 0; p < l.length; p++) {
        var r = l[p];
        for (let m = d; m <= u; m++) this.columns[m].hidden !== true && (s += this.getCellCopy(r, m) + "	");
        s = s.substr(0, s.length - 1), s += `
`;
      }
    } else {
      for (let d = 0; d < this.columns.length; d++) {
        var a = this.columns[d];
        if (a.hidden !== true) {
          let u = a.text || a.field;
          a.text && a.text.length < 3 && a.tooltip && (u = a.tooltip), s += '"' + c.stripTags(u) + '"	';
        }
      }
      s = s.substr(0, s.length - 1), s += `
`;
      for (let d = 0; d < i.length; d++) {
        var h = this.get(i[d], true);
        for (let u = 0; u < this.columns.length; u++) this.columns[u].hidden !== true && (s += '"' + this.getCellCopy(h, u) + '"	');
        s = s.substr(0, s.length - 1), s += `
`;
      }
    }
    s = s.substr(0, s.length - 1);
    let o;
    return e == null ? (o = this.trigger("copy", { target: this.name, text: s, cut: t.keyCode == 88, originalEvent: t })).isCancelled === true ? "" : (s = o.detail.text, o.finish(), s) : e === false ? (o = this.trigger("copy", { target: this.name, text: s, cut: t.keyCode == 88, originalEvent: t })).isCancelled === true ? "" : (s = o.detail.text, o) : void 0;
  }
  getCellCopy(e, t) {
    return c.stripTags(this.getCellHTML(e, t));
  }
  paste(e, o) {
    var i = this.getSelection();
    let s = this.get(i[0].recid, true);
    var l, r, a, h = i[0].column, o = this.trigger("paste", { target: this.name, text: e, index: s, column: h, originalEvent: o });
    if (o.isCancelled !== true) {
      if (e = o.detail.text, this.selectType == "row" || i.length === 0) console.log("ERROR: You can paste only if grid.selectType = 'cell' and when at least one cell selected.");
      else {
        if (typeof e != "object") {
          var d = [];
          e = e.split(`
`);
          for (let f = 0; f < e.length; f++) {
            var u = e[f].split("	");
            let w = 0;
            var p = this.records[s], m = [];
            if (p != null) {
              for (let b = 0; b < u.length; b++) this.columns[h + w] && (l = p, r = this.columns[h + w].field, a = u[b], l.w2ui = l.w2ui ?? {}, l.w2ui.changes = l.w2ui.changes || {}, l.w2ui.changes[r] = a, m.push(h + w), w++);
              for (let b = 0; b < m.length; b++) d.push({ recid: p.recid, column: m[b] });
              s++;
            }
          }
          this.selectNone(true), this.select(d);
        } else this.selectNone(true), this.select([{ recid: this.records[s], column: h }]);
        this.refresh();
      }
      o.finish();
    }
  }
  resize() {
    var e = Date.now();
    if (this.box && n(this.box).attr("name") == this.name) {
      var t = this.trigger("resize", { target: this.name });
      if (t.isCancelled !== true) return this.resizeBoxes(), this.resizeRecords(), t.finish(), Date.now() - e;
    }
  }
  update({ cells: e, fullCellRefresh: t, ignoreColumns: i } = {}) {
    var s = Date.now();
    let l = this;
    if (this.box == null) return 0;
    if (Array.isArray(e)) for (let u = 0; u < e.length; u++) {
      var r = e[u].index, a = e[u].column;
      if (!(r < 0)) if (r == null || a == null) console.log("ERROR: Wrong argument for grid.update({ cells }), cells should be [{ index: X, column: Y }, ...]");
      else {
        var h = this.records[r] ?? {};
        h.w2ui = h.w2ui ?? {}, h.w2ui._update = h.w2ui._update ?? { cells: [] };
        let p = h.w2ui._update.row1, m = h.w2ui._update.row2;
        p != null && p.isConnected && m != null && m.isColSelected || (p = this.box.querySelector(`#grid_${this.name}_rec_` + c.escapeId(h.recid)), m = this.box.querySelector(`#grid_${this.name}_frec_` + c.escapeId(h.recid)), h.w2ui._update.row1 = p, h.w2ui._update.row2 = m), d(h, p, m, r, a);
      }
    }
    else for (let u = this.last.range_start - 1; u <= this.last.range_end; u++) {
      let p = u;
      p = 0 < this.last.searchIds.length ? this.last.searchIds[u] : u;
      var o = this.records[p];
      if (!(p < 0 || o == null)) {
        o.w2ui = o.w2ui ?? {}, o.w2ui._update = o.w2ui._update ?? { cells: [] };
        let m = o.w2ui._update.row1, f = o.w2ui._update.row2;
        m != null && m.isConnected && f != null && f.isColSelected || (m = this.box.querySelector(`#grid_${this.name}_rec_` + c.escapeId(o.recid)), f = this.box.querySelector(`#grid_${this.name}_frec_` + c.escapeId(o.recid)), o.w2ui._update.row1 = m, o.w2ui._update.row2 = f);
        for (let w = 0; w < this.columns.length; w++) d(o, m, f, p, w);
      }
    }
    return Date.now() - s;
    function d(u, p, m, f, w) {
      var b = l.columns[w];
      if (!Array.isArray(i) || !i.includes(w) && !i.includes(b.field)) {
        let _ = u.w2ui._update.cells[w];
        if (_ != null && _.isConnected || (_ = l.box.querySelector(`#grid_${l.name}_data_${f}_` + w), u.w2ui._update.cells[w] = _), _ != null) {
          if (t) n(_).replace(l.getCellHTML(f, w, false)), _ = l.box.querySelector(`#grid_${l.name}_data_${f}_` + w), u.w2ui._update.cells[w] = _;
          else {
            var g = _.children[0], { value: f, style: y, className: v } = l.getCellValue(f, w, false, true);
            if (g.innerHTML != f && (g.innerHTML = f), y != "" && _.style.cssText != y && (_.style.cssText = y), v != "") {
              let E = ["w2ui-grid-data"], T = [];
              g = v.split(" ").filter((S) => !!S), _.classList.forEach((S) => {
                E.includes(S) || T.push(S);
              }), _.classList.remove(...T), _.classList.add(...g);
            }
          }
          if (l.columns[w].style && l.columns[w].style != _.style.cssText && (_.style.cssText = l.columns[w].style ?? ""), u.w2ui.class != null) {
            if (typeof u.w2ui.class == "string") {
              let k = ["w2ui-odd", "w2ui-even", "w2ui-record"], E = [];
              f = u.w2ui.class.split(" ").filter((T) => !!T), p && m && (p.classList.forEach((T) => {
                k.includes(T) || E.push(T);
              }), p.classList.remove(...E), p.classList.add(...f), m.classList.remove(...E), m.classList.add(...f));
            }
            if (c.isPlainObject(u.w2ui.class) && typeof u.w2ui.class[b.field] == "string") {
              let k = ["w2ui-grid-data"], E = [];
              y = u.w2ui.class[b.field].split(" ").filter((T) => !!T), _.classList.forEach((T) => {
                k.includes(T) || E.push(T);
              }), _.classList.remove(...E), _.classList.add(...y);
            }
          }
          u.w2ui.style != null && (p && m && typeof u.w2ui.style == "string" && p.style.cssText !== u.w2ui.style && (p.style.cssText = "height: " + l.recordHeight + "px;" + u.w2ui.style, p.setAttribute("custom_style", u.w2ui.style), m.style.cssText = "height: " + l.recordHeight + "px;" + u.w2ui.style, m.setAttribute("custom_style", u.w2ui.style)), c.isPlainObject(u.w2ui.style)) && typeof u.w2ui.style[b.field] == "string" && _.style.cssText !== u.w2ui.style[b.field] && (_.style.cssText = u.w2ui.style[b.field]);
        }
      }
    }
  }
  refreshCell(l, s) {
    var i = this.get(l, true), s = this.getColumn(s, true), l = !this.records[i] || this.records[i].recid != l, r = n(this.box).find(`${l ? ".w2ui-grid-summary " : ""}#grid_${this.name}_data_${i}_` + s);
    return r.length != 0 && (r.replace(this.getCellHTML(i, s, l)), true);
  }
  refreshRow(e, t = null) {
    let i = n(this.box).find("#grid_" + this.name + "_frec_" + c.escapeId(e)), s = n(this.box).find("#grid_" + this.name + "_rec_" + c.escapeId(e));
    if (0 < i.length) {
      t == null && (t = this.get(e, true));
      var l = i.attr("line"), r = !this.records[t] || this.records[t].recid != e, a = typeof this.url != "object" ? this.url : this.url.get;
      if (0 < this.searchData.length && !a) for (let o = 0; o < this.last.searchIds.length; o++) this.last.searchIds[o] == t && (t = o);
      a = this.getRecordHTML(t, l, r), i.replace(a[0]), s.replace(a[1]);
      let h = this.records[t].w2ui ? this.records[t].w2ui.style : "";
      return typeof h == "string" && (i = n(this.box).find("#grid_" + this.name + "_frec_" + c.escapeId(e)), s = n(this.box).find("#grid_" + this.name + "_rec_" + c.escapeId(e)), i.attr("custom_style", h), s.attr("custom_style", h), i.hasClass("w2ui-selected") && (h = h.replace("background-color", "none")), i[0].style.cssText = "height: " + this.recordHeight + "px;" + h, s[0].style.cssText = "height: " + this.recordHeight + "px;" + h), r && this.resize(), true;
    }
    return false;
  }
  refresh() {
    var e = Date.now(), t = typeof this.url != "object" ? this.url : this.url.get;
    if (this.total <= 0 && !t && this.searchData.length === 0 && (this.total = this.records.length), this.box && (t = this.trigger("refresh", { target: this.name }), t.isCancelled !== true)) {
      this.show.header ? n(this.box).find(`#grid_${this.name}_header`).html(c.lang(this.header) + "&#160;").show() : n(this.box).find(`#grid_${this.name}_header`).hide(), this.show.toolbar ? n(this.box).find("#grid_" + this.name + "_toolbar").show() : n(this.box).find("#grid_" + this.name + "_toolbar").hide(), this.searchClose();
      var i = n(this.box).find("#grid_" + this.name + "_search_all");
      !this.multiSearch && this.last.field == "all" && 0 < this.searches.length && (this.last.field = this.searches[0].field, this.last.label = this.searches[0].label);
      for (let a = 0; a < this.searches.length; a++) this.searches[a].field == this.last.field && (this.last.label = this.searches[a].label);
      if (this.last.multi ? i.attr("placeholder", "[" + c.lang("Multiple Fields") + "]") : i.attr("placeholder", c.lang("Search") + " " + c.lang(this.last.label, true)), i.val() != this.last.search) {
        let a = this.last.search;
        var s = i._w2field;
        s && (a = s.format(a)), i.val(a);
      }
      this.refreshSearch(), this.refreshBody(), this.show.footer ? n(this.box).find(`#grid_${this.name}_footer`).html(this.getFooterHTML()).show() : n(this.box).find(`#grid_${this.name}_footer`).hide();
      var s = this.last.selection, i = 0 < this.records.length && s.indexes.length == this.records.length, s = 0 < s.indexes.length && this.searchData.length !== 0 && s.indexes.length == this.last.searchIds.length, l = (i || s ? n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true) : n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.find({ "w2ui.expanded": true }, true, true));
      for (let a = 0; a < l.length; a++) {
        var r = this.records[l[a]].w2ui;
        r && !Array.isArray(r.children) && (r.expanded = false);
      }
      return this.markSearch && setTimeout(() => {
        var a = [];
        for (let d = 0; d < this.searchData.length; d++) {
          var h = this.searchData[d], o = this.getSearch(h.field);
          o && !o.hidden && (o = this.getColumn(h.field, true), a.push({ field: h.field, search: h.value, col: o }));
        }
        0 < a.length && a.forEach((d) => {
          var u = n(this.box).find('td[col="' + d.col + '"]:not(.w2ui-head)');
          c.marker(u, d.search);
        });
      }, 50), this.updateToolbar(this.last.selection), t.finish(), this.resize(), this.addRange("selection"), setTimeout(() => {
        this.resize(), this.scroll();
      }, 1), this.reorderColumns && !this.last.columnDrag ? this.last.columnDrag = this.initColumnDrag() : !this.reorderColumns && this.last.columnDrag && this.last.columnDrag.remove(), Date.now() - e;
    }
  }
  refreshSearch() {
    if (this.multiSearch && 0 < this.searchData.length) {
      n(this.box).find(".w2ui-grid-searches").length == 0 && n(this.box).find(".w2ui-grid-toolbar").css("height", this.last.toolbar_height + 35 + "px").append(`<div id="grid_${this.name}_searches" class="w2ui-grid-searches"></div>`);
      let e = `
                <span id="grid_${this.name}_search_logic" class="w2ui-grid-search-logic"></span>
                <div class="grid-search-line"></div>`;
      this.searchData.forEach((t, i) => {
        var s = this.getSearch(t.field, true), l = this.searches[s];
        let r;
        if (r = Array.isArray(t.value) ? `<span class="grid-search-count">${t.value.length}</span>` : l && l.type == "list" && t.text && t.text !== t.value ? ": " + t.text : ": " + t.value, l && l.type == "date") if (t.operator == "between") {
          let a = t.value[0], h = t.value[1];
          Number(a) === a && (a = c.formatDate(a)), Number(h) === h && (h = c.formatDate(h)), r = `: ${a} - ` + h;
        } else {
          let a = t.value, h = (Number(a) == a && (a = c.formatDate(a)), t.operator);
          (h = (h = h == "more" ? "since" : h) == "less" ? "before" : h).substr(0, 5) == "more:" && (h = "since"), r = `: ${h} ` + a;
        }
        e += `<span class="w2ui-action" data-click="searchFieldTooltip|${s}|${i}|this">
                    ${l ? l.label : ""}
                    ${r}
                    <span class="icon-chevron-down"></span>
                </span>`;
      }), e += `
                ${this.show.searchSave ? `<div class="grid-search-line"></div>
                       <button class="w2ui-btn grid-search-btn" data-click="searchSave">${c.lang("Save")}</button>
                      ` : ""}
                <button class="w2ui-btn grid-search-btn btn-remove"
                    data-click="searchReset">X</button>
            `, n(this.box).find(`#grid_${this.name}_searches`).html(e), n(this.box).find(`#grid_${this.name}_search_logic`).html(c.lang(this.last.logic == "AND" ? "All" : "Any"));
    } else n(this.box).find(".w2ui-grid-toolbar").css("height", this.last.toolbar_height + "px").find(".w2ui-grid-searches").remove();
    this.searchSelected ? (n(this.box).find(`#grid_${this.name}_search_all`).val(" ").prop("readOnly", true), n(this.box).find(`#grid_${this.name}_search_name`).show().find(".name-text").html(this.searchSelected.text)) : (n(this.box).find(`#grid_${this.name}_search_all`).prop("readOnly", false), n(this.box).find(`#grid_${this.name}_search_name`).hide().find(".name-text").html("")), c.bindEvents(n(this.box).find(`#grid_${this.name}_searches .w2ui-action, #grid_${this.name}_searches button`), this);
  }
  refreshBody() {
    this.scroll();
    var t = this.getRecordsHTML(), e = this.getColumnsHTML(), t = '<div id="grid_' + this.name + '_frecords" class="w2ui-grid-frecords" style="margin-bottom: ' + (c.scrollBarSize() - 1) + 'px;">' + t[0] + '</div><div id="grid_' + this.name + '_records" class="w2ui-grid-records">' + t[1] + '</div><div id="grid_' + this.name + '_scroll1" class="w2ui-grid-scroll1" style="height: ' + c.scrollBarSize() + 'px"></div><div id="grid_' + this.name + '_fcolumns" class="w2ui-grid-fcolumns">    <table><tbody>' + e[0] + '</tbody></table></div><div id="grid_' + this.name + '_columns" class="w2ui-grid-columns">    <table><tbody>' + e[1] + `</tbody></table></div><div class="w2ui-intersection-marker" style="display: none; height: ${this.recordHeight - 5}px">
               <div class="top-marker"></div>
               <div class="bottom-marker"></div>
            </div>`;
    let i = n(this.box).find(`#grid_${this.name}_body`, this.box).html(t);
    e = n(this.box).find(`#grid_${this.name}_records`, this.box), t = n(this.box).find(`#grid_${this.name}_frecords`, this.box), this.selectType == "row" && (e.on("mouseover mouseout", { delegate: "tr" }, (s) => {
      var l = n(s.delegate).attr("recid");
      n(this.box).find(`#grid_${this.name}_frec_` + c.escapeId(l)).toggleClass("w2ui-record-hover", s.type == "mouseover");
    }), t.on("mouseover mouseout", { delegate: "tr" }, (s) => {
      var l = n(s.delegate).attr("recid");
      n(this.box).find(`#grid_${this.name}_rec_` + c.escapeId(l)).toggleClass("w2ui-record-hover", s.type == "mouseover");
    })), c.isIOS ? e.append(t).on("click", { delegate: "tr" }, (s) => {
      var l = n(s.delegate).attr("recid");
      this.dblClick(l, s);
    }) : e.add(t).on("click", { delegate: "tr" }, (s) => {
      var l = n(s.delegate).attr("recid");
      l != "-none-" && this.click(l, s);
    }).on("contextmenu", { delegate: "tr" }, (s) => {
      var l = n(s.delegate).attr("recid"), r = n(s.target).closest("td"), r = parseInt(r.attr("col") ?? -1);
      this.showContextMenu(l, r, s);
    }).on("mouseover", { delegate: "tr" }, (s) => {
      this.last.rec_out = false;
      let l = n(s.delegate).attr("index"), r = n(s.delegate).attr("recid");
      l !== this.last.rec_over && (this.last.rec_over = l, setTimeout(() => {
        delete this.last.rec_out, this.trigger("mouseEnter", { target: this.name, originalEvent: s, index: l, recid: r }).finish();
      }));
    }).on("mouseout", { delegate: "tr" }, (s) => {
      let l = n(s.delegate).attr("index"), r = n(s.delegate).attr("recid");
      this.last.rec_out = true, setTimeout(() => {
        let a = () => {
          this.trigger("mouseLeave", { target: this.name, originalEvent: s, index: l, recid: r }).finish();
        };
        l !== this.last.rec_over && a(), setTimeout(() => {
          this.last.rec_out && (delete this.last.rec_out, delete this.last.rec_over, a());
        });
      });
    }), i.data("scroll", { lastDelta: 0, lastTime: 0 }).find(".w2ui-grid-frecords").on("mousewheel DOMMouseScroll ", (a) => {
      a.preventDefault();
      var l = i.data("scroll"), r = i.find(".w2ui-grid-records"), a = typeof a.wheelDelta != null ? -a.wheelDelta : a.detail || a.deltaY, h = r.prop("scrollTop");
      l.lastDelta += a, a = Math.round(l.lastDelta), i.data("scroll", l), r.get(0).scroll({ top: h + a, behavior: "smooth" });
    }), e.off(".body-global").on("scroll.body-global", { delegate: ".w2ui-grid-records" }, (s) => {
      this.scroll(s);
    }), n(this.box).find(".w2ui-grid-body").off(".body-global").on("click.body-global dblclick.body-global contextmenu.body-global", { delegate: "td.w2ui-head" }, (s) => {
      var l = n(s.delegate).attr("col"), r = this.columns[l] ?? { field: l };
      switch (s.type) {
        case "click":
          this.columnClick(r.field, s);
          break;
        case "dblclick":
          this.columnDblClick(r.field, s);
          break;
        case "contextmenu":
          this.columnContextMenu(r.field, s);
      }
    }).on("mouseover.body-global", { delegate: ".w2ui-col-header" }, (s) => {
      let l = n(s.delegate).parent().attr("col");
      this.columnTooltipShow(l, s), n(s.delegate).off(".tooltip").on("mouseleave.tooltip", () => {
        this.columnTooltipHide(l, s);
      });
    }).on("click.body-global", { delegate: "input.w2ui-select-all" }, (s) => {
      s.delegate.checked ? this.selectAll() : this.selectNone(), s.stopPropagation(), clearTimeout(this.last.kbd_timer);
    }).on("click.body-global", { delegate: ".w2ui-show-children, .w2ui-col-expand" }, (s) => {
      s.stopPropagation(), this.toggle(n(s.target).parents("tr").attr("recid"));
    }).on("click.body-global mouseover.body-global", { delegate: ".w2ui-info" }, (s) => {
      var _a, _b;
      var l = n(s.delegate).closest("td"), r = l.parent(), a = this.columns[l.attr("col")], h = r.parents(".w2ui-grid-body").hasClass("w2ui-grid-summary");
      ["mouseenter", "mouseover"].includes((_b = (_a = a.info) == null ? void 0 : _a.showOn) == null ? void 0 : _b.toLowerCase()) && s.type == "mouseover" ? this.showBubble(r.attr("index"), l.attr("col"), h).then(() => {
        n(s.delegate).off(".tooltip").on("mouseleave.tooltip", () => {
          F.hide(this.name + "-bubble");
        });
      }) : s.type == "click" && (F.hide(this.name + "-bubble"), this.showBubble(r.attr("index"), l.attr("col"), h));
    }).on("mouseover.body-global", { delegate: ".w2ui-clipboard-copy" }, (s) => {
      if (!s.delegate._tooltipShow) {
        let r = n(s.delegate).parent(), a = r.parent();
        var l = this.columns[r.attr("col")];
        let h = a.parents(".w2ui-grid-body").hasClass("w2ui-grid-summary");
        F.show({ name: this.name + "-bubble", anchor: s.delegate, html: c.lang(typeof l.clipboardCopy == "string" ? l.clipboardCopy : "Copy to clipboard"), position: "top|bottom", offsetY: -2 }).hide((o) => {
          s.delegate._tooltipShow = false, n(s.delegate).off(".tooltip");
        }), n(s.delegate).off(".tooltip").on("mouseleave.tooltip", (o) => {
          F.hide(this.name + "-bubble");
        }).on("click.tooltip", (o) => {
          o.stopPropagation(), F.update(this.name + "-bubble", c.lang("Copied")), this.clipboardCopy(a.attr("index"), r.attr("col"), h);
        }), s.delegate._tooltipShow = true;
      }
    }).on("click.body-global", { delegate: ".w2ui-editable-checkbox" }, (s) => {
      var l = n(s.delegate).data();
      this.editChange.call(this, s.delegate, l.changeind, l.colind, s), this.updateToolbar();
    }), this.records.length === 0 && this.msgEmpty ? n(this.box).find(`#grid_${this.name}_body`).append(`<div id="grid_${this.name}_empty_msg" class="w2ui-grid-empty-msg"><div>${c.lang(this.msgEmpty)}</div></div>`) : 0 < n(this.box).find(`#grid_${this.name}_empty_msg`).length && n(this.box).find(`#grid_${this.name}_empty_msg`).remove(), 0 < this.summary.length ? (t = this.getSummaryHTML(), n(this.box).find(`#grid_${this.name}_fsummary`).html(t[0]).show(), n(this.box).find(`#grid_${this.name}_summary`).html(t[1]).show()) : (n(this.box).find(`#grid_${this.name}_fsummary`).hide(), n(this.box).find(`#grid_${this.name}_summary`).hide());
  }
  render(e) {
    var t = Date.now();
    let i = this;
    typeof e == "string" && (e = n(e).get(0));
    var s = this.trigger("render", { target: this.name, box: e ?? this.box });
    if (s.isCancelled !== true && (e != null && (0 < n(this.box).find(`#grid_${this.name}_body`).length && n(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-grid w2ui-inactive").html(""), this.box = e), this.box)) {
      let a = function(d) {
        var _a, _b;
        if (d.target.tagName) {
          var u = i.last.move;
          if (u && ["select", "select-column"].indexOf(u.type) != -1 && (u.divX = d.screenX - u.x, u.divY = d.screenY - u.y, !(Math.abs(u.divX) <= 1 && Math.abs(u.divY) <= 1))) if (i.last.cancelClick = true, i.reorderRows == 1 && i.last.move.reorder) {
            let k = n(d.target).parents("tr").attr("recid");
            (k = k == "-none-" ? "bottom" : k) != u.from && (m = n(i.box).find("#grid_" + i.name + "_rec_" + k), n(i.box).find(".insert-before"), m.addClass("insert-before"), u.lastY = d.screenY, u.to = k, m = { top: (_a = m.get(0)) == null ? void 0 : _a.offsetTop, left: (_b = m.get(0)) == null ? void 0 : _b.offsetLeft }, n(i.box).find("#grid_" + i.name + "_ghost_line").css({ top: m.top + "px", left: u.pos.left + "px", "border-top": "2px solid #769EFC" })), n(i.box).find("#grid_" + i.name + "_ghost").css({ top: u.pos.top + u.divY + "px", left: u.pos.left + "px" });
          } else {
            u.start && u.recid && (i.selectNone(), u.start = false);
            var p = [], m = (d.target.tagName.toUpperCase() == "TR" ? n(d.target) : n(d.target).parents("tr")).attr("recid");
            if (m == null) {
              if (i.selectType != "row" && (!i.last.move || i.last.move.type != "select")) {
                var f = parseInt(n(d.target).parents("td").attr("col"));
                if (isNaN(f)) i.removeRange("column-selection"), n(i.box).find(".w2ui-grid-columns .w2ui-col-header, .w2ui-grid-fcolumns .w2ui-col-header").removeClass("w2ui-col-selected"), n(i.box).find(".w2ui-col-number").removeClass("w2ui-row-selected"), delete u.colRange;
                else {
                  let k = f + "-" + f;
                  u.column < f && (k = u.column + "-" + f);
                  var w = [], b = (k = u.column > f ? f + "-" + u.column : k).split("-");
                  for (let E = parseInt(b[0]); E <= parseInt(b[1]); E++) w.push(E);
                  if (u.colRange != k && (r = i.trigger("columnSelect", { target: i.name, columns: w })).isCancelled !== true) {
                    u.colRange == null && i.selectNone();
                    var g = k.split("-");
                    n(i.box).find(".w2ui-grid-columns .w2ui-col-header, .w2ui-grid-fcolumns .w2ui-col-header").removeClass("w2ui-col-selected");
                    for (let E = parseInt(g[0]); E <= parseInt(g[1]); E++) n(i.box).find("#grid_" + i.name + "_column_" + E + " .w2ui-col-header").addClass("w2ui-col-selected");
                    n(i.box).find(".w2ui-col-number").not(".w2ui-head").addClass("w2ui-row-selected"), u.colRange = k, i.removeRange("column-selection"), i.addRange({ name: "column-selection", range: [{ recid: i.records[0].recid, column: g[0] }, { recid: i.records[i.records.length - 1].recid, column: g[1] }], style: "background-color: rgba(90, 145, 234, 0.1)" });
                  }
                }
              }
            } else {
              let k = i.get(u.recid, true);
              if (!(k == null || i.records[k] && i.records[k].recid != u.recid)) {
                let E = i.get(m, true);
                if (E != null) {
                  let T = parseInt(u.column), S = parseInt((d.target.tagName.toUpperCase() == "TD" ? n(d.target) : n(d.target).parents("td")).attr("col"));
                  isNaN(T) && isNaN(S) && (T = 0, S = i.columns.length - 1), k > E && (f = k, k = E, E = f);
                  var y, m = "ind1:" + k + ",ind2;" + E + ",col1:" + T + ",col2:" + S;
                  if (u.range != m) {
                    u.range = m;
                    for (let C = k; C <= E; C++) if (!(0 < i.last.searchIds.length && i.last.searchIds.indexOf(C) == -1)) if (i.selectType != "row") {
                      T > S && (y = T, T = S, S = y);
                      for (let x = T; x <= S; x++) i.columns[x].hidden || p.push({ recid: i.records[C].recid, column: parseInt(x) });
                    } else p.push(i.records[C].recid);
                    if (i.selectType != "row") {
                      var v = i.getSelection();
                      let C = [];
                      for (let x = 0; x < p.length; x++) {
                        let $ = false;
                        for (let I = 0; I < v.length; I++) p[x].recid == v[I].recid && p[x].column == v[I].column && ($ = true);
                        $ || C.push({ recid: p[x].recid, column: p[x].column });
                      }
                      i.select(C), C = [];
                      for (let x = 0; x < v.length; x++) {
                        let $ = false;
                        for (let I = 0; I < p.length; I++) p[I].recid == v[x].recid && p[I].column == v[x].column && ($ = true);
                        $ || C.push({ recid: v[x].recid, column: v[x].column });
                      }
                      i.unselect(C);
                    } else if (i.multiSelect) {
                      var _ = i.getSelection();
                      for (let C = 0; C < p.length; C++) _.indexOf(p[C]) == -1 && i.select(p[C]);
                      for (let C = 0; C < _.length; C++) p.indexOf(_[C]) == -1 && i.unselect(_[C]);
                    }
                  }
                }
              }
            }
          }
        }
      }, h = function(d) {
        var u = i.last.move;
        if (setTimeout(() => {
          delete i.last.cancelClick;
        }, 1), !n(d.target).parents().hasClass(".w2ui-head") && !n(d.target).hasClass(".w2ui-head")) {
          if (u && ["select", "select-column"].indexOf(u.type) != -1) {
            if (u.colRange != null && r.isCancelled !== true) {
              var p = u.colRange.split("-"), m = [];
              for (let b = 0; b < i.records.length; b++) {
                var f = [];
                for (let g = parseInt(p[0]); g <= parseInt(p[1]); g++) f.push(g);
                m.push({ recid: i.records[b].recid, column: f });
              }
              i.removeRange("column-selection"), r.finish(), i.select(m);
            }
            if (i.reorderRows == 1 && i.last.move.reorder) if (u.to != null) {
              if (d = i.trigger("reorderRow", { target: i.name, recid: u.from, moveBefore: u.to }), d.isCancelled === true) return o(), void delete i.last.move;
              var w = i.get(u.from, true);
              let b = i.get(u.to, true);
              u.to == "bottom" && (b = i.records.length), u = i.records[w], w != null && b != null && (i.records.splice(w, 1), w > b ? i.records.splice(b, 0, u) : i.records.splice(b - 1, 0, u)), i.sortData = [], n(i.box).find(`#grid_${i.name}_columns .w2ui-col-header`).removeClass("w2ui-col-sorted"), o(), d.finish();
            } else o();
          }
          delete i.last.move, n(document).off(".w2ui-" + i.name);
        }
      }, o = function() {
        n(i.box).find(`#grid_${i.name}_ghost`).remove(), n(i.box).find(`#grid_${i.name}_ghost_line`).remove(), i.refresh(), delete i.last.move;
      };
      if (e = typeof this.url != "object" ? this.url : this.url.get, this.reset(true), !this.last.field) if (this.multiSearch && this.show.searchAll) this.last.field = "all", this.last.label = "All Fields";
      else {
        let d = 0;
        for (; d < this.searches.length && (this.searches[d].hidden || this.searches[d].simple === false); ) d++;
        d >= this.searches.length ? (this.last.field = "", this.last.label = "") : (this.last.field = this.searches[d].field, this.last.label = this.searches[d].label);
      }
      if (n(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-grid w2ui-inactive").html('<div class="w2ui-grid-box">    <div id="grid_' + this.name + '_header" class="w2ui-grid-header"></div>    <div id="grid_' + this.name + '_toolbar" class="w2ui-grid-toolbar"></div>    <div id="grid_' + this.name + '_body" class="w2ui-grid-body"></div>    <div id="grid_' + this.name + '_fsummary" class="w2ui-grid-body w2ui-grid-summary"></div>    <div id="grid_' + this.name + '_summary" class="w2ui-grid-body w2ui-grid-summary"></div>    <div id="grid_' + this.name + '_footer" class="w2ui-grid-footer"></div>    <textarea id="grid_' + this.name + '_focus" class="w2ui-grid-focus-input" ' + (this.tabIndex ? 'tabindex="' + this.tabIndex + '"' : "") + (c.isIOS ? "readonly" : "") + "></textarea></div>"), this.selectType != "row" && n(this.box).addClass("w2ui-ss"), 0 < n(this.box).length && (n(this.box)[0].style.cssText += this.style), this.initToolbar(), this.toolbar != null && this.toolbar.render(n(this.box).find("#grid_" + this.name + "_toolbar")[0]), this.last.toolbar_height = n(this.box).find(`#grid_${this.name}_toolbar`).prop("offsetHeight"), this.last.field && this.last.field != "all") {
        let d = this.searchData;
        setTimeout(() => {
          this.searchInitInput(this.last.field, d.length == 1 ? d[0].value : null);
        }, 1);
      }
      n(this.box).find(`#grid_${this.name}_footer`).html(this.getFooterHTML()), this.last.state || (this.last.state = this.stateSave(true)), this.stateRestore(), e && (this.clear(), this.refresh());
      let l = false;
      for (let d = 0; d < this.searches.length; d++) if (this.searches[d].hidden) {
        l = true;
        break;
      }
      l ? (this.searchReset(false), e || setTimeout(() => {
        this.searchReset();
      }, 1)) : this.reload(), n(this.box).find(`#grid_${this.name}_focus`).on("focus", (d) => {
        clearTimeout(this.last.kbd_timer), this.hasFocus || this.focus();
      }).on("blur", (d) => {
        clearTimeout(this.last.kbd_timer), this.last.kbd_timer = setTimeout(() => {
          this.hasFocus && this.blur();
        }, 100);
      }).on("paste", (d) => {
        var u = d.clipboardData || null;
        if (u) {
          let f = u.items, w = [];
          for (var p in f = f.length == 2 && (f = f.length == 2 && f[1].kind == "file" ? [f[1]] : f).length == 2 && f[0].type == "text/plain" && f[1].type == "text/html" ? [f[1]] : f) if (p = f[p], p.kind === "file") {
            var m = p.getAsFile();
            w.push({ kind: "file", data: m });
          } else if (p.kind === "string" && (p.type === "text/plain" || p.type === "text/html")) {
            d.preventDefault();
            let b = u.getData("text/plain");
            b.indexOf("\r") != -1 && b.indexOf(`
`) == -1 && (b = b.replace(/\r/g, `
`)), w.push({ kind: p.type == "text/html" ? "html" : "text", data: b });
          }
          w.length === 1 && w[0].kind != "file" && (w = w[0].data), Z[this.name].paste(w, d), d.preventDefault();
        }
      }).on("keydown", function(d) {
        Z[i.name].keydown.call(Z[i.name], d);
      });
      let r;
      return n(this.box).off("mousedown.mouseStart").on("mousedown.mouseStart", function(d) {
        if (d.which == 1 && (i.last.userSelect == "text" && (i.last.userSelect = "", n(i.box).find(".w2ui-grid-body").css("user-select", "none")), !(i.selectType == "row" && (n(d.target).parents().hasClass("w2ui-head") || n(d.target).hasClass("w2ui-head")) || i.last.move && i.last.move.type == "expand"))) {
          if (d.altKey) n(i.box).find(".w2ui-grid-body").css("user-select", "text"), i.selectNone(), i.last.move = { type: "text-select" }, i.last.userSelect = "text";
          else {
            let g = d.target;
            var u = { x: d.offsetX - 10, y: d.offsetY - 10 };
            let y = false;
            for (; g && (!g.classList || !g.classList.contains("w2ui-grid")); ) g.tagName && g.tagName.toUpperCase() == "TD" && (y = true), g.tagName && g.tagName.toUpperCase() != "TR" && y == 1 && (u.x += g.offsetLeft, u.y += g.offsetTop), g = g.parentNode;
            i.last.move = { x: d.screenX, y: d.screenY, divX: 0, divY: 0, focusX: u.x, focusY: u.y, recid: n(d.target).parents("tr").attr("recid"), column: parseInt((d.target.tagName.toUpperCase() == "TD" ? n(d.target) : n(d.target).parents("td")).attr("col")), type: "select", ghost: false, start: true }, i.last.move.recid == null && (i.last.move.type = "select-column");
            let v = d.target, _ = n(i.box).find("#grid_" + i.name + "_focus");
            if (i.last.move) {
              let k = i.last.move.focusX, E = i.last.move.focusY;
              var p = n(v).parents("table").parent();
              (p.hasClass("w2ui-grid-records") || p.hasClass("w2ui-grid-frecords") || p.hasClass("w2ui-grid-columns") || p.hasClass("w2ui-grid-fcolumns") || p.hasClass("w2ui-grid-summary")) && (k = i.last.move.focusX - n(i.box).find("#grid_" + i.name + "_records").prop("scrollLeft"), E = i.last.move.focusY - n(i.box).find("#grid_" + i.name + "_records").prop("scrollTop")), (n(v).hasClass("w2ui-grid-footer") || 0 < n(v).parents("div.w2ui-grid-footer").length) && (E = n(i.box).find("#grid_" + i.name + "_footer").get(0).offsetTop), p.hasClass("w2ui-scroll-wrapper") && p.parent().hasClass("w2ui-toolbar") && (k = i.last.move.focusX - p.prop("scrollLeft")), _.css({ left: k - 10, top: E });
            }
            setTimeout(() => {
              var _a;
              i.last.inEditMode || (["INPUT", "TEXTAREA", "SELECT"].includes(v.tagName) ? v.focus() : _.get(0) !== document.active && ((_a = _.get(0)) == null ? void 0 : _a.focus({ preventScroll: true })));
            }, 50), i.multiSelect || i.reorderRows || i.last.move.type != "drag" || delete i.last.move;
          }
          if (i.reorderRows == 1) {
            let g = d.target;
            var m, f, w, b;
            g.tagName.toUpperCase() != "TD" && (g = n(g).parents("td")[0]), n(g).hasClass("w2ui-col-number") || n(g).hasClass("w2ui-col-order") ? (i.selectNone(), i.last.move.reorder = true, p = n(i.box).find(".w2ui-even.w2ui-empty-record").css("background-color"), m = n(i.box).find(".w2ui-odd.w2ui-empty-record").css("background-color"), n(i.box).find(".w2ui-even td").filter(":not(.w2ui-col-number)").css("background-color", p), n(i.box).find(".w2ui-odd td").filter(":not(.w2ui-col-number)").css("background-color", m), m = i.last.move, f = n(i.box).find(".w2ui-grid-records"), m.ghost || (w = n(i.box).find(`#grid_${i.name}_rec_` + m.recid), b = w.parents("table").find("tr:first-child").get(0).cloneNode(true), m.offsetY = d.offsetY, m.from = m.recid, m.pos = { top: w.get(0).offsetTop - 1, left: w.get(0).offsetLeft }, m.ghost = n(w.get(0).cloneNode(true)), m.ghost.removeAttr("id"), m.ghost.find("td").css({ "border-top": "1px solid silver", "border-bottom": "1px solid silver" }), w.find("td").remove(), w.append(`<td colspan="1000"><div class="w2ui-reorder-empty" style="height: ${i.recordHeight - 2}px"></div></td>`), f.append('<div id="grid_' + i.name + '_ghost_line" style="position: absolute; z-index: 999999; pointer-events: none; width: 100%;"></div>'), f.append('<table id="grid_' + i.name + '_ghost" style="position: absolute; z-index: 999998; opacity: 0.9; pointer-events: none;"></table>'), n(i.box).find("#grid_" + i.name + "_ghost").append(b).append(m.ghost)), n(i.box).find("#grid_" + i.name + "_ghost").css({ top: m.pos.top + "px", left: m.pos.left + "px" })) : i.last.move.reorder = false;
          }
          n(document).on("mousemove.w2ui-" + i.name, a).on("mouseup.w2ui-" + i.name, h), d.stopPropagation();
        }
      }), this.updateToolbar(), s.finish(), this.last.observeResize = new ResizeObserver(() => {
        this.resize();
      }), this.last.observeResize.observe(this.box), Date.now() - t;
    }
  }
  destroy() {
    var _a;
    var e = this.trigger("destroy", { target: this.name });
    e.isCancelled !== true && (n(this.box).off(), typeof this.toolbar == "object" && this.toolbar.destroy && this.toolbar.destroy(), 0 < n(this.box).find(`#grid_${this.name}_body`).length && n(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-grid w2ui-inactive").html(""), (_a = this.last.observeResize) == null ? void 0 : _a.disconnect(), delete Z[this.name], e.finish());
  }
  initColumnOnOff() {
    var e, t = [{ id: "line-numbers", text: "Line #", checked: this.show.lineNumbers }];
    for (let l = 0; l < this.columns.length; l++) {
      var i = this.columns[l];
      let r = this.columns[l].text;
      i.hideable !== false && (r = (r = !r && this.columns[l].tooltip ? this.columns[l].tooltip : r) || "- column " + (parseInt(l) + 1) + " -", t.push({ id: i.field, text: c.stripTags(r), checked: !i.hidden }));
    }
    ((typeof this.url != "object" ? this.url : this.url.get) && this.show.skipRecords || this.show.saveRestoreState) && t.push({ text: "--" }), this.show.skipRecords && (e = c.lang("Skip") + `<input id="${this.name}_skip" type="text" class="w2ui-input w2ui-grid-skip" value="${this.offset}">` + c.lang("records"), t.push({ id: "w2ui-skip", text: e, group: false, icon: "w2ui-icon-empty" })), this.show.saveRestoreState && t.push({ id: "w2ui-stateSave", text: c.lang("Save Grid State"), icon: "w2ui-icon-empty", group: false }, { id: "w2ui-stateReset", text: c.lang("Restore Default State"), icon: "w2ui-icon-empty", group: false });
    let s = [];
    return t.forEach((l) => {
      l.text = c.lang(l.text), l.checked && s.push(l.id);
    }), this.toolbar.set("w2ui-column-on-off", { selected: s, items: t }), t;
  }
  initColumnDrag(e) {
    if (this.columnGroups && this.columnGroups.length) throw "Draggable columns are not currently supported with column groups.";
    let t = this, i = { pressed: false, targetPos: null, columnHead: null }, s = (a, h) => {
      var o = ["w2ui-col-number", "w2ui-col-expand", "w2ui-col-select"];
      h !== true && o.push("w2ui-head-last");
      for (let d = 0; d < o.length; d++) if (n(a).closest(".w2ui-head").hasClass(o[d])) return true;
      return false;
    };
    function l(a) {
      var h, o, d, u;
      i.pressed && i.columnHead && (h = a.pageX, o = a.pageY, s(a.target, true) || (a = a, n(a.target).closest("td").length != 0 && (u = n(t.box).find(".w2ui-grid-body").get(0).getBoundingClientRect(), d = n(a.target).closest("td").get(0).getBoundingClientRect(), n(t.box).find(".w2ui-intersection-marker").show().css({ left: d.left - u.left + "px" }), d = n(a.target).closest("td"), i.targetPos = d.hasClass("w2ui-head-last") ? t.columns.length : parseInt(d.attr("col")))), u = h, a = o, n(i.ghost).css({ left: u - 10 + "px", top: a - 10 + "px" }).show());
    }
    function r(a) {
      if (i.pressed && i.columnHead) {
        i.pressed = false;
        var h, o, d = () => {
          var u = n(t.box).find(".w2ui-grid-ghost");
          n(t.box).find(".w2ui-intersection-marker").hide(), n(i.ghost).remove(), u.remove(), n(document).off(".colDrag"), i = {};
        };
        if (a.pageX == i.initialX && a.pageY == i.initialY) t.columnClick(t.columns[i.originalPos].field, a), d();
        else {
          if ((a = t.trigger("columnDragEnd", { originalEvent: a, target: i.columnHead[0], dragData: i })).isCancelled === true) return false;
          h = t.columns[i.originalPos], o = t.columns, i.originalPos != i.targetPos && i.targetPos != null && (o.splice(i.targetPos, 0, c.clone(h)), o.splice(o.indexOf(h), 1)), d(), t.refresh(), a.finish({ targetColumn: NaN });
        }
      }
    }
    return n(t.box).off(".colDrag").on("mousedown.colDrag", function(a) {
      if (!i.pressed && i.numberPreColumnsPresent !== 0 && a.button === 0) {
        var h, o;
        if (n(a.target).parents().hasClass("w2ui-head") && !s(a.target)) {
          if (i.pressed = true, i.initialX = a.pageX, i.initialY = a.pageY, i.numberPreColumnsPresent = n(t.box).find(".w2ui-head.w2ui-col-number, .w2ui-head.w2ui-col-expand, .w2ui-head.w2ui-col-select").length, i.columnHead = d = n(a.target).closest(".w2ui-head"), i.originalPos = o = parseInt(d.attr("col"), 10), (o = t.trigger("columnDragStart", { originalEvent: a, origColumnNumber: o, target: d[0] })).isCancelled === true) return false;
          h = i.columns = n(t.box).find(".w2ui-head:not(.w2ui-head-last)"), n(document).on("mouseup.colDrag", r), n(document).on("mousemove.colDrag", l);
          var d = t.columns[i.originalPos], d = c.lang(typeof d.text == "function" ? d.text(d) : d.text);
          i.ghost = n.html(`<span col="${i.originalPos}">${d}</span>`)[0], n(document.body).append(i.ghost), n(i.ghost).css({ display: "none", left: a.pageX, top: a.pageY, opacity: 1, margin: "3px 0 0 20px", padding: "3px", "background-color": "white", position: "fixed", "z-index": 999999 }).addClass(".w2ui-grid-ghost"), i.offsets = [];
          for (let p = 0, m = h.length; p < m; p++) {
            var u = h[p].getBoundingClientRect();
            i.offsets.push(u.left);
          }
          o.finish();
        }
      }
    }), { remove() {
      n(t.box).off(".colDrag"), t.last.columnDrag = false;
    } };
  }
  columnOnOff(e, t) {
    if (e = this.trigger("columnOnOff", { target: this.name, field: t, originalEvent: e }), e.isCancelled !== true) {
      var i = this.find({ "w2ui.expanded": true }, true);
      for (let l = 0; l < i.length; l++) {
        var s = this.records[l].w2ui;
        s && !Array.isArray(s.children) && (this.records[l].w2ui.expanded = false);
      }
      t == "line-numbers" ? (this.show.lineNumbers = !this.show.lineNumbers, this.refresh()) : (t = this.getColumn(t)).hidden ? this.showColumn(t.field) : this.hideColumn(t.field), e.finish();
    }
  }
  initToolbar() {
    if (this.toolbar.render == null) {
      let t = this.toolbar.items || [];
      var e;
      this.toolbar.items = [], this.toolbar = new nt(c.extend({}, this.toolbar, { name: this.name + "_toolbar", owner: this })), this.show.toolbarReload && this.toolbar.items.push(c.extend({}, this.buttons.reload)), this.show.toolbarColumns && this.toolbar.items.push(c.extend({}, this.buttons.columns)), this.show.toolbarSearch && (e = `
                <div class="w2ui-grid-search-input">
                    ${this.buttons.search.html}
                    <div id="grid_${this.name}_search_name" class="w2ui-grid-search-name">
                        <span class="name-icon w2ui-icon-search"></span>
                        <span class="name-text"></span>
                        <span class="name-cross w2ui-action" data-click="searchReset">x</span>
                    </div>
                    <input type="text" id="grid_${this.name}_search_all" class="w2ui-search-all" tabindex="-1"
                        autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                        placeholder="${c.lang(this.last.label, true)}" value="${this.last.search}"
                        data-focus="searchSuggest" data-click="stop"
                    >
                    <div class="w2ui-search-drop w2ui-action" data-click="searchOpen"
                            style="${this.multiSearch ? "" : "display: none"}">
                        <span class="w2ui-icon-drop"></span>
                    </div>
                </div>`, this.toolbar.items.push({ id: "w2ui-search", type: "html", html: e, onRefresh: async (s) => {
        await s.complete;
        var s = n(this.box).find(`#grid_${this.name}_search_all`), l = (c.bindEvents(n(this.box).find(`#grid_${this.name}_search_all, .w2ui-action`), this), c.debounce((r) => {
          var a = r.target.value;
          this.liveSearch && this.last.liveText != a && (this.last.liveText = a, this.search(this.last.field, a)), r.keyCode == 40 && this.searchSuggest(true);
        }, 250));
        s.on("change", (r) => {
          this.liveSearch || (this.search(this.last.field, r.target.value), this.searchSuggest(true, true, this));
        }).on("blur", () => {
          this.last.liveText = "";
        }).on("keyup", l);
      } })), Array.isArray(t) && (e = t.map((i) => i.id), this.show.toolbarAdd && !e.includes(this.buttons.add.id) && this.toolbar.items.push(c.extend({}, this.buttons.add)), this.show.toolbarEdit && !e.includes(this.buttons.edit.id) && this.toolbar.items.push(c.extend({}, this.buttons.edit)), this.show.toolbarDelete && !e.includes(this.buttons.delete.id) && this.toolbar.items.push(c.extend({}, this.buttons.delete)), this.show.toolbarSave && !e.includes(this.buttons.save.id) && ((this.show.toolbarAdd || this.show.toolbarDelete || this.show.toolbarEdit) && this.toolbar.items.push({ type: "break", id: "w2ui-break2" }), this.toolbar.items.push(c.extend({}, this.buttons.save))), t = t.map((i) => this.buttons[i.name] ? c.extend({}, this.buttons[i.name], i) : i)), this.toolbar.items.push(...t), this.toolbar.on("click", (i) => {
        var s = this.trigger("toolbar", { target: i.target, originalEvent: i });
        if (s.isCancelled !== true) {
          let r;
          switch (i.detail.item.id) {
            case "w2ui-reload":
              if ((r = this.trigger("reload", { target: this.name })).isCancelled === true) return false;
              this.reload(), r.finish();
              break;
            case "w2ui-column-on-off":
              i.detail.subItem ? (l = i.detail.subItem.id, ["w2ui-stateSave", "w2ui-stateReset"].includes(l) ? this[l.substring(5)]() : l != "w2ui-skip" && this.columnOnOff(i, i.detail.subItem.id)) : (this.initColumnOnOff(), setTimeout(() => {
                n(`#w2overlay-${this.name}_toolbar-drop .w2ui-grid-skip`).off(".w2ui-grid").on("click.w2ui-grid", (a) => {
                  a.stopPropagation();
                }).on("keypress", (a) => {
                  a.keyCode == 13 && (this.skip(a.target.value), this.toolbar.click("w2ui-column-on-off"));
                });
              }, 100));
              break;
            case "w2ui-add":
              if ((r = this.trigger("add", { target: this.name, recid: null })).isCancelled === true) return false;
              r.finish();
              break;
            case "w2ui-edit": {
              var l = this.getSelection();
              let a = null;
              if (l.length == 1 && (a = l[0]), (r = this.trigger("edit", { target: this.name, recid: a })).isCancelled === true) return false;
              r.finish();
              break;
            }
            case "w2ui-delete":
              this.delete();
              break;
            case "w2ui-save":
              this.save();
          }
          s.finish();
        }
      }), this.toolbar.on("refresh", (i) => {
        if (i.target == "w2ui-search") {
          let s = this.searchData;
          setTimeout(() => {
            this.searchInitInput(this.last.field, s.length == 1 ? s[0].value : null);
          }, 1);
        }
      });
    }
  }
  initResize() {
    let e = this;
    n(this.box).find(".w2ui-resizer").off(".grid-col-resize").on("click.grid-col-resize", function(t) {
      t.stopPropagation ? t.stopPropagation() : t.cancelBubble = true, t.preventDefault && t.preventDefault();
    }).on("mousedown.grid-col-resize", function(t) {
      t = t || window.event, e.last.colResizing = true, e.last.tmp = { x: t.screenX, y: t.screenY, gx: t.screenX, gy: t.screenY, col: parseInt(n(this).attr("name")) }, e.last.tmp.tds = n(e.box).find("#grid_" + e.name + '_body table tr:first-child td[col="' + e.last.tmp.col + '"]'), t.stopPropagation ? t.stopPropagation() : t.cancelBubble = true, t.preventDefault && t.preventDefault();
      for (let l = 0; l < e.columns.length; l++) e.columns[l].hidden || (e.columns[l].sizeOriginal == null && (e.columns[l].sizeOriginal = e.columns[l].size), e.columns[l].size = e.columns[l].sizeCalculated);
      let i = { phase: "before", type: "columnResize", target: e.name, column: e.last.tmp.col, field: e.columns[e.last.tmp.col].field };
      i = e.trigger(c.extend(i, { resizeBy: 0, originalEvent: t }));
      let s;
      n(document).off(".grid-col-resize").on("mousemove.grid-col-resize", function(l) {
        var r;
        e.last.colResizing == 1 && (l = l || window.event, (i = e.trigger(c.extend(i, { resizeBy: l.screenX - e.last.tmp.gx, originalEvent: l }))).isCancelled === true ? i.isCancelled = false : (e.last.tmp.x = l.screenX - e.last.tmp.x, e.last.tmp.y = l.screenY - e.last.tmp.y, r = parseInt(e.columns[e.last.tmp.col].size) + e.last.tmp.x + "px", e.columns[e.last.tmp.col].size = r, s && clearTimeout(s), s = setTimeout(() => {
          e.resizeRecords(), e.scroll();
        }, 100), e.last.tmp.tds.css({ width: r }), e.last.tmp.x = l.screenX, e.last.tmp.y = l.screenY));
      }).on("mouseup.grid-col-resize", function(l) {
        n(document).off(".grid-col-resize"), e.resizeRecords(), e.scroll(), i.finish({ originalEvent: l }), setTimeout(() => {
          e.last.colResizing = false;
        }, 1);
      });
    }).on("dblclick.grid-col-resize", function(t) {
      let i = parseInt(n(this).attr("name")), s = e.columns[i], l = 0;
      if (s.autoResize === false) return true;
      t.stopPropagation ? t.stopPropagation() : t.cancelBubble = true, t.preventDefault && t.preventDefault(), n(e.box).find('.w2ui-grid-records td[col="' + i + '"] > div', e.box).each(() => {
        var a = this.offsetWidth - this.scrollWidth;
        a < l && (l = a - 3);
      });
      var r = { phase: "before", type: "columnAutoResize", target: e.name, column: s, field: s.field };
      (r = e.trigger(c.extend(r, { resizeBy: Math.abs(l), originalEvent: t }))).isCancelled === true ? r.isCancelled = false : (l < 0 && (s.size = Math.min(parseInt(s.size) + Math.abs(l), s.max || 1 / 0) + "px", e.resizeRecords(), e.resizeRecords(), e.scroll()), r.finish({ originalEvent: t }));
    }).each((t) => {
      var i = n(t).get(0).parentNode;
      n(t).css({ height: i.clientHeight + "px", "margin-left": i.clientWidth - 3 + "px" });
    });
  }
  resizeBoxes() {
    var e = n(this.box).find(`#grid_${this.name}_header`), t = n(this.box).find(`#grid_${this.name}_toolbar`), i = n(this.box).find(`#grid_${this.name}_fsummary`), s = n(this.box).find(`#grid_${this.name}_summary`), l = n(this.box).find(`#grid_${this.name}_footer`), r = n(this.box).find(`#grid_${this.name}_body`);
    this.show.header && e.css({ top: "0px", left: "0px", right: "0px" }), this.show.toolbar && t.css({ top: 0 + (this.show.header ? c.getSize(e, "height") : 0) + "px", left: "0px", right: "0px" }), 0 < this.summary.length && (i.css({ bottom: 0 + (this.show.footer ? c.getSize(l, "height") : 0) + "px" }), s.css({ bottom: 0 + (this.show.footer ? c.getSize(l, "height") : 0) + "px", right: "0px" })), this.show.footer && l.css({ bottom: "0px", left: "0px", right: "0px" }), r.css({ top: 0 + (this.show.header ? c.getSize(e, "height") : 0) + (this.show.toolbar ? c.getSize(t, "height") : 0) + "px", bottom: 0 + (this.show.footer ? c.getSize(l, "height") : 0) + (0 < this.summary.length ? c.getSize(s, "height") : 0) + "px", left: "0px", right: "0px" });
  }
  resizeRecords() {
    var _a, _b, _c, _d, _e2, _f;
    let e = this;
    n(this.box).find(".w2ui-empty-record").remove();
    var t, i, s = n(this.box), l = n(this.box).find(":scope > div.w2ui-grid-box"), r = n(this.box).find(`#grid_${this.name}_header`), a = n(this.box).find(`#grid_${this.name}_toolbar`), h = n(this.box).find(`#grid_${this.name}_summary`), o = n(this.box).find(`#grid_${this.name}_fsummary`), d = n(this.box).find(`#grid_${this.name}_footer`), u = n(this.box).find(`#grid_${this.name}_body`), p = n(this.box).find(`#grid_${this.name}_columns`), m = n(this.box).find(`#grid_${this.name}_fcolumns`), f = n(this.box).find(`#grid_${this.name}_records`), w = n(this.box).find(`#grid_${this.name}_frecords`), b = n(this.box).find(`#grid_${this.name}_scroll1`);
    let g = 8 * String(this.total).length + 10, y = (g < 34 && (g = 34), this.lineNumberWidth != null && (g = this.lineNumberWidth), false), v = false, _ = 0;
    for (let A = 0; A < this.columns.length; A++) this.columns[A].frozen || this.columns[A].hidden || (t = parseInt(this.columns[A].sizeCalculated || this.columns[A].size), _ += t);
    ((_a = f[0]) == null ? void 0 : _a.clientWidth) < _ && (y = true), ((_b = u[0]) == null ? void 0 : _b.clientHeight) - (((_c = p[0]) == null ? void 0 : _c.clientHeight) ?? 0) < (((_d = n(f).find(":scope > table")[0]) == null ? void 0 : _d.clientHeight) ?? 0) + (y ? c.scrollBarSize() : 0) && (v = true), this.fixedBody ? (i = ((_e2 = l[0]) == null ? void 0 : _e2.clientHeight) - (this.show.header ? c.getSize(r, "height") : 0) - (this.show.toolbar ? c.getSize(a, "height") : 0) - (h.css("display") != "none" ? c.getSize(h, "height") : 0) - (this.show.footer ? c.getSize(d, "height") : 0), u.css("height", i + "px")) : (r = (i = c.getSize(p, "height") + c.getSize(n(this.box).find("#grid_" + this.name + "_records table"), "height") + (y ? c.scrollBarSize() : 0)) + (this.show.header ? c.getSize(r, "height") : 0) + (this.show.toolbar ? c.getSize(a, "height") : 0) + (h.css("display") != "none" ? c.getSize(h, "height") : 0) + (this.show.footer ? c.getSize(d, "height") : 0), l.css("height", r + "px"), u.css("height", i + "px"), s.css("height", c.getSize(l, "height") + "px"));
    let k = this.records.length;
    if (a = typeof this.url != "object" ? this.url : this.url.get, this.searchData.length == 0 || a || (k = this.last.searchIds.length), this.fixedBody || (v = false), y || v ? (p.find(":scope > table > tbody > tr:nth-child(1) td.w2ui-head-last").css("width", c.scrollBarSize() + "px").show(), f.css({ top: (0 < this.columnGroups.length && this.show.columns ? 1 : 0) + c.getSize(p, "height") + "px", "-webkit-overflow-scrolling": "touch", "overflow-x": y ? "auto" : "hidden", "overflow-y": v ? "auto" : "hidden" })) : (p.find(":scope > table > tbody > tr:nth-child(1) td.w2ui-head-last").hide(), f.css({ top: (0 < this.columnGroups.length && this.show.columns ? 1 : 0) + c.getSize(p, "height") + "px", overflow: "hidden" }), 0 < f.length && (this.last.scrollTop = 0, this.last.scrollLeft = 0)), y ? (w.css("margin-bottom", c.scrollBarSize() + "px"), b.show()) : (w.css("margin-bottom", 0), b.hide()), w.css({ overflow: "hidden", top: f.css("top") }), this.show.emptyRecords && !v) {
      let A = Math.floor((((_f = f[0]) == null ? void 0 : _f.clientHeight) ?? 0) / this.recordHeight) - 1, O = 0;
      if ((O = f[0] ? f[0].scrollHeight - A * this.recordHeight : O) >= this.recordHeight && (O -= this.recordHeight, A++), this.fixedBody) {
        for (let z = k; z < A; z++) E(z, this.recordHeight, this);
        E(A, O, this);
      }
    }
    function E(A, O, z) {
      let M = "", K = "";
      var W;
      M += '<tr class="' + (A % 2 ? "w2ui-even" : "w2ui-odd") + ' w2ui-empty-record" recid="-none-" style="height: ' + O + 'px">', K += '<tr class="' + (A % 2 ? "w2ui-even" : "w2ui-odd") + ' w2ui-empty-record" recid="-none-" style="height: ' + O + 'px">', z.show.lineNumbers && (M += '<td class="w2ui-col-number"></td>'), z.show.selectColumn && (M += '<td class="w2ui-grid-data w2ui-col-select"></td>'), z.show.expandColumn && (M += '<td class="w2ui-grid-data w2ui-col-expand"></td>'), K += '<td class="w2ui-grid-data-spacer" col="start" style="border-right: 0"></td>', z.reorderRows && (K += '<td class="w2ui-grid-data w2ui-col-order" col="order"></td>');
      for (let X = 0; X < z.columns.length; X++) {
        var V = z.columns[X];
        (V.hidden || X < z.last.colStart || X > z.last.colEnd) && !V.frozen || (W = '<td class="w2ui-grid-data" ' + (V.attr != null ? V.attr : "") + ' col="' + X + '"></td>', V.frozen ? M += W : K += W);
      }
      M += '<td class="w2ui-grid-data-last"></td> </tr>', K += '<td class="w2ui-grid-data-last" col="end"></td> </tr>', n(z.box).find("#grid_" + z.name + "_frecords > table").append(M), n(z.box).find("#grid_" + z.name + "_records > table").append(K);
    }
    let T, S;
    if (0 < u.length) {
      let A = parseInt(u[0].clientWidth) - (v ? c.scrollBarSize() : 0) - (this.show.lineNumbers ? g : 0) - (this.reorderRows ? 26 : 0) - (this.show.selectColumn ? 26 : 0) - (this.show.expandColumn ? 26 : 0) - 1, O = (T = A, false);
      for (let z = S = 0; z < this.columns.length; z++) {
        var R = this.columns[z];
        0 < R.gridMinWidth && (R.gridMinWidth > T && R.hidden !== true && (R.hidden = true, O = true), R.gridMinWidth < T) && R.hidden === true && (R.hidden = false, O = true);
      }
      if (O === true) return void this.refresh();
      for (let z = 0; z < this.columns.length; z++) {
        var C = this.columns[z];
        C.hidden || (String(C.size).substr(String(C.size).length - 2).toLowerCase() == "px" ? (A -= parseFloat(C.size), this.columns[z].sizeCalculated = C.size, this.columns[z].sizeType = "px") : (S += parseFloat(C.size), this.columns[z].sizeType = "%", delete C.sizeCorrected));
      }
      if (S != 100 && 0 < S) for (let z = 0; z < this.columns.length; z++) {
        var x = this.columns[z];
        x.hidden || x.sizeType == "%" && (x.sizeCorrected = Math.round(100 * parseFloat(x.size) * 100 / S) / 100 + "%");
      }
      for (let z = 0; z < this.columns.length; z++) {
        var $ = this.columns[z];
        $.hidden || $.sizeType == "%" && (this.columns[z].sizeCorrected != null ? this.columns[z].sizeCalculated = Math.floor(A * parseFloat($.sizeCorrected) / 100) - 1 + "px" : this.columns[z].sizeCalculated = Math.floor(A * parseFloat($.size) / 100) - 1 + "px");
      }
    }
    let I = 0;
    for (let A = 0; A < this.columns.length; A++) {
      var N = this.columns[A];
      N.hidden || (N.min == null && (N.min = 20), parseInt(N.sizeCalculated) < parseInt(N.min) && (N.sizeCalculated = N.min + "px"), parseInt(N.sizeCalculated) > parseInt(N.max) && (N.sizeCalculated = N.max + "px"), I += parseInt(N.sizeCalculated));
    }
    let H = parseInt(T) - parseInt(I);
    if (0 < H && 0 < S) {
      let A = 0;
      for (; ; ) {
        var B = this.columns[A];
        if (B == null) A = 0;
        else {
          if (!B.hidden && B.sizeType != "px" && (B.sizeCalculated = parseInt(B.sizeCalculated) + 1 + "px", --H === 0)) break;
          A++;
        }
      }
    } else 0 < H && p.find(":scope > table > tbody > tr:nth-child(1) td.w2ui-head-last").css("width", c.scrollBarSize() + "px").show();
    let j = 1;
    this.show.lineNumbers && (j += g), this.show.selectColumn && (j += 26), this.show.expandColumn && (j += 26);
    for (let A = 0; A < this.columns.length; A++) this.columns[A].hidden || this.columns[A].frozen && (j += parseInt(this.columns[A].sizeCalculated));
    m.css("width", j + "px"), w.css("width", j + "px"), o.css("width", j + "px"), b.css("width", j + "px"), p.css("left", j + "px"), f.css("left", j + "px"), h.css("left", j + "px"), p.find(":scope > table > tbody > tr:nth-child(1) td").add(m.find(":scope > table > tbody > tr:nth-child(1) td")).each((A) => {
      n(A).hasClass("w2ui-col-number") && n(A).css("width", g + "px");
      var O = n(A).attr("col");
      if (O != null) {
        if (O == "start") {
          let z = 0;
          for (let M = 0; M < e.last.colStart; M++) !e.columns[M] || e.columns[M].frozen || e.columns[M].hidden || (z += parseInt(e.columns[M].sizeCalculated));
          n(A).css("width", z + "px");
        }
        e.columns[O] && n(A).css("width", e.columns[O].sizeCalculated);
      }
      if (n(A).hasClass("w2ui-head-last")) if (e.last.colEnd + 1 < e.columns.length) {
        let z = 0;
        for (let M = e.last.colEnd + 1; M < e.columns.length; M++) !e.columns[M] || e.columns[M].frozen || e.columns[M].hidden || (z += parseInt(e.columns[M].sizeCalculated));
        n(A).css("width", z + "px");
      } else n(A).css("width", c.scrollBarSize() + (0 < H && S === 0 ? H : 0) + "px");
    }), p.find(":scope > table > tbody > tr").length == 3 && p.find(":scope > table > tbody > tr:nth-child(1) td").add(m.find(":scope > table > tbody > tr:nth-child(1) td")).html("").css({ height: "0", border: "0", padding: "0", margin: "0" }), f.find(":scope > table > tbody > tr:nth-child(1) td").add(w.find(":scope > table > tbody > tr:nth-child(1) td")).each((A) => {
      n(A).hasClass("w2ui-col-number") && n(A).css("width", g + "px");
      var O = n(A).attr("col");
      if (O != null) {
        if (O == "start") {
          let z = 0;
          for (let M = 0; M < e.last.colStart; M++) !e.columns[M] || e.columns[M].frozen || e.columns[M].hidden || (z += parseInt(e.columns[M].sizeCalculated));
          n(A).css("width", z + "px");
        }
        e.columns[O] && n(A).css("width", e.columns[O].sizeCalculated);
      }
      if (n(A).hasClass("w2ui-grid-data-last") && n(A).parents(".w2ui-grid-frecords").length === 0) if (e.last.colEnd + 1 < e.columns.length) {
        let z = 0;
        for (let M = e.last.colEnd + 1; M < e.columns.length; M++) !e.columns[M] || e.columns[M].frozen || e.columns[M].hidden || (z += parseInt(e.columns[M].sizeCalculated));
        n(A).css("width", z + "px");
      } else n(A).css("width", (0 < H && S === 0 ? H : 0) + "px");
    }), h.find(":scope > table > tbody > tr:nth-child(1) td").add(o.find(":scope > table > tbody > tr:nth-child(1) td")).each((A) => {
      n(A).hasClass("w2ui-col-number") && n(A).css("width", g + "px");
      var O = n(A).attr("col");
      if (O != null) {
        if (O == "start") {
          let z = 0;
          for (let M = 0; M < e.last.colStart; M++) !e.columns[M] || e.columns[M].frozen || e.columns[M].hidden || (z += parseInt(e.columns[M].sizeCalculated));
          n(A).css("width", z + "px");
        }
        e.columns[O] && n(A).css("width", e.columns[O].sizeCalculated);
      }
      n(A).hasClass("w2ui-grid-data-last") && n(A).parents(".w2ui-grid-frecords").length === 0 && n(A).css("width", c.scrollBarSize() + (0 < H && S === 0 ? H : 0) + "px");
    }), this.initResize(), this.refreshRanges(), (this.last.scrollTop || this.last.scrollLeft) && 0 < f.length && (p.prop("scrollLeft", this.last.scrollLeft), f.prop("scrollTop", this.last.scrollTop), f.prop("scrollLeft", this.last.scrollLeft)), p.css("will-change", "scroll-position");
  }
  getSearchesHTML() {
    let e = `
            <div class="search-title">
                ${c.lang("Advanced Search")}
                <span class="search-logic" style="${this.show.searchLogic ? "" : "display: none"}">
                    <select id="grid_${this.name}_logic" class="w2ui-input">
                        <option value="AND" ${this.last.logic == "AND" ? "selected" : ""}>${c.lang("All")}</option>
                        <option value="OR" ${this.last.logic == "OR" ? "selected" : ""}>${c.lang("Any")}</option>
                    </select>
                </span>
            </div>
            <table cellspacing="0"><tbody>
        `;
    for (let s = 0; s < this.searches.length; s++) {
      var t = this.searches[s];
      if (t.type = String(t.type).toLowerCase(), !t.hidden) {
        t.attr == null && (t.attr = ""), t.text == null && (t.text = ""), t.style == null && (t.style = ""), t.type == null && (t.type = "text"), t.label == null && t.caption != null && (console.log("NOTICE: grid search.caption property is deprecated, please use search.label. Search ->", t), t.label = t.caption);
        var i = `<select id="grid_${this.name}_operator_${s}" class="w2ui-input" data-change="initOperator|${s}">
                    ${this.getOperators(t.type, t.operators)}
                </select>`;
        e += `<tr>
                        <td class="caption">${c.lang(t.label) || ""}</td>
                        <td class="operator">${i}</td>
                        <td class="value">`;
        let l;
        switch (t.type) {
          case "text":
          case "alphanumeric":
          case "hex":
          case "color":
          case "list":
          case "combo":
          case "enum":
            l = "width: 250px;", ["hex", "color"].indexOf(t.type) != -1 && (l = "width: 90px;"), e += `<input rel="search" type="text" id="grid_${this.name}_field_${s}" name="${t.field}"
                               class="w2ui-input" style="${l + t.style}" ${t.attr}>`;
            break;
          case "int":
          case "float":
          case "money":
          case "currency":
          case "percent":
          case "date":
          case "time":
          case "datetime":
            l = "width: 90px;", t.type == "datetime" && (l = "width: 140px;"), e += `<input id="grid_${this.name}_field_${s}" name="${t.field}" ${t.attr} rel="search" type="text"
                                class="w2ui-input" style="${l + t.style}">
                            <span id="grid_${this.name}_range_${s}" style="display: none">&#160;-&#160;&#160;
                                <input rel="search" type="text" class="w2ui-input" style="${l + t.style}" id="grid_${this.name}_field2_${s}" name="${t.field}" ${t.attr}>
                            </span>`;
            break;
          case "select":
            e += `<select rel="search" class="w2ui-input" style="${t.style}" id="grid_${this.name}_field_${s}"
                                name="${t.field}" ${t.attr}></select>`;
        }
        e += t.text + "    </td></tr>";
      }
    }
    return e += `<tr>
            <td colspan="2" class="actions">
                <button type="button" class="w2ui-btn close-btn" data-click="searchClose">${c.lang("Close")}</button>
            </td>
            <td class="actions">
                <button type="button" class="w2ui-btn" data-click="searchReset">${c.lang("Reset")}</button>
                <button type="button" class="w2ui-btn w2ui-btn-blue" data-click="search">${c.lang("Search")}</button>
            </td>
        </tr></tbody></table>`;
  }
  getOperators(e, t) {
    let i = this.operators[this.operatorsMap[e]] || [], s = (t != null && Array.isArray(t) && (i = t), "");
    return i.forEach((l) => {
      let r = l, a = l;
      Array.isArray(l) ? (r = l[1], a = l[0]) : c.isPlainObject(l) && (r = l.text, a = l.oper), r == null && (r = l), s += `<option name="11" value="${a}">${c.lang(r)}</option>
`;
    }), s;
  }
  initOperator(e) {
    let t;
    var i = this.searches[e], s = this.getSearchData(i.field), l = n(`#w2overlay-${this.name}-search-overlay`), r = l.find(`#grid_${this.name}_range_` + e);
    let a = l.find(`#grid_${this.name}_field_` + e), h = l.find(`#grid_${this.name}_field2_` + e);
    var o = l.find(`#grid_${this.name}_operator_` + e).val();
    switch (a.show(), r.hide(), o) {
      case "between":
        r.show();
        break;
      case "null":
      case "not null":
        a.hide(), a.val(o), a.trigger("change");
    }
    switch (i.type) {
      case "text":
      case "alphanumeric":
        var d = a[0]._w2field;
        d && d.reset();
        break;
      case "int":
      case "float":
      case "hex":
      case "color":
      case "money":
      case "currency":
      case "percent":
      case "date":
      case "time":
      case "datetime":
        a[0]._w2field || (new me(i.type, { el: a[0], ...i.options }), new me(i.type, { el: h[0], ...i.options }), setTimeout(() => {
          a.trigger("keydown"), h.trigger("keydown");
        }, 1));
        break;
      case "list":
      case "combo":
      case "enum":
        t = i.options, i.type == "list" && (t.selected = {}), i.type == "enum" && (t.selected = []), s && (t.selected = s.value), a[0]._w2field || (d = new me(i.type, { el: a[0], ...t }), s && s.text != null && d.set({ id: s.value, text: s.text }));
        break;
      case "select":
        t = '<option value="">--</option>';
        for (let p = 0; p < i.options.items.length; p++) {
          var u = i.options.items[p];
          if (c.isPlainObject(i.options.items[p])) {
            let m = u.id, f = u.text;
            m == null && u.value != null && (m = u.value), f == null && u.text != null && (f = u.text), m == null && (m = ""), t += '<option value="' + m + '">' + f + "</option>";
          } else t += '<option value="' + u + '">' + u + "</option>";
        }
        a.html(t);
    }
  }
  initSearches() {
    var e = n(`#w2overlay-${this.name}-search-overlay`);
    for (let l = 0; l < this.searches.length; l++) {
      var i = this.searches[l], t = this.getSearchData(i.field);
      i.type = String(i.type).toLowerCase(), typeof i.options != "object" && (i.options = {});
      let r = i.operator, a = [...this.operators[this.operatorsMap[i.type]]];
      i.operators && (a = i.operators), c.isPlainObject(r) && (r = r.oper), a.forEach((h, o) => {
        c.isPlainObject(h) && (a[o] = h.oper);
      }), t && t.operator && (r = t.operator);
      var i = this.defaultOperator[this.operatorsMap[i.type]], i = (a.indexOf(r) == -1 && (r = i), e.find(`#grid_${this.name}_operator_` + l).val(r), this.initOperator(l), e.find(`#grid_${this.name}_field_` + l)), s = e.find(`#grid_${this.name}_field2_` + l);
      t != null && (Array.isArray(t.value) ? ["in", "not in"].includes(t.operator) ? i[0]._w2field.set(t.value) : (i.val(t.value[0]).trigger("change"), s.val(t.value[1]).trigger("change")) : t.value != null && i.val(t.value).trigger("change"));
    }
    e.find(".w2ui-grid-search-advanced *[rel=search]").on("keypress", (l) => {
      l.keyCode == 13 && (this.search(), F.hide(this.name + "-search-overlay"));
    });
  }
  getColumnsHTML() {
    let e = this, t = "", i = "";
    var s, l, r;
    return this.show.columnHeaders && (i = 0 < this.columnGroups.length ? (r = a(true), s = function() {
      let h = "<tr>", o = "<tr>", d = "", u = e.columnGroups.length - 1;
      e.columnGroups[u].text == null && e.columnGroups[u].caption != null && (console.log("NOTICE: grid columnGroup.caption property is deprecated, please use columnGroup.text. Group -> ", e.columnGroups[u]), e.columnGroups[u].text = e.columnGroups[u].caption), e.columnGroups[e.columnGroups.length - 1].text != "" && e.columnGroups.push({ text: "" }), e.show.lineNumbers && (h += '<td class="w2ui-head w2ui-col-number" col="line-number">    <div>&#160;</div></td>'), e.show.selectColumn && (h += '<td class="w2ui-head w2ui-col-select" col="select">    <div style="height: 25px">&#160;</div></td>'), e.show.expandColumn && (h += '<td class="w2ui-head w2ui-col-expand" col="expand">    <div style="height: 25px">&#160;</div></td>');
      let p = 0;
      o += `<td id="grid_${e.name}_column_start" class="w2ui-head" col="start" style="border-right: 0"></td>`, e.reorderRows && (o += '<td class="w2ui-head w2ui-col-order" col="order">    <div style="height: 25px">&#160;</div></td>');
      for (let b = 0; b < e.columnGroups.length; b++) {
        var m = e.columnGroups[b], f = e.columns[p] || {};
        m.colspan != null && (m.span = m.colspan), m.span != null && m.span == parseInt(m.span) || (m.span = 1), f.text == null && f.caption != null && (console.log("NOTICE: grid column.caption property is deprecated, please use column.text. Column ->", f), f.text = f.caption);
        let g = 0;
        for (let y = p; y < p + m.span; y++) e.columns[y] && !e.columns[y].hidden && g++;
        if (!((g = b == e.columnGroups.length - 1 ? 100 : g) <= 0)) {
          if (m.main === true) {
            let y = "";
            for (let _ = 0; _ < e.sortData.length; _++) e.sortData[_].field == f.field && ((e.sortData[_].direction || "").toLowerCase() === "asc" && (y = "w2ui-sort-up"), (e.sortData[_].direction || "").toLowerCase() === "desc") && (y = "w2ui-sort-down");
            let v = "";
            f.resizable !== false && (v = `<div class="w2ui-resizer" name="${p}"></div>`);
            var w = c.lang(typeof f.text == "function" ? f.text(f) : f.text);
            d = `<td id="grid_${e.name}_column_${p}" class="w2ui-head ${y}" col="${p}"     rowspan="2" colspan="${g}">` + v + `    <div class="w2ui-col-group w2ui-col-header ${y ? "w2ui-col-sorted" : ""}">        <div class="${y}"></div>` + (w || "&#160;") + "    </div></td>";
          } else w = c.lang(typeof m.text == "function" ? m.text(m) : m.text), d = `<td id="grid_${e.name}_column_${p}" class="w2ui-head" col="${p}" colspan="${g}">    <div class="w2ui-col-group" style="${m.style ?? ""}">${w || "&#160;"}</div></td>`;
          f && f.frozen ? h += d : o += d;
        }
        p += m.span;
      }
      return h += "<td></td></tr>", o += `<td id="grid_${e.name}_column_end" class="w2ui-head" col="end"></td></tr>`, [h, o];
    }(), l = a(false), t = r[0] + s[0] + l[0], r[1] + s[1] + l[1]) : (r = a(true), t = r[0], r[1])), [t, i];
    function a(h) {
      let o = "<tr>", d = "<tr>", u = (e.show.lineNumbers && (o += '<td class="w2ui-head w2ui-col-number" col="line-number">    <div>#</div></td>'), e.show.selectColumn && (o += `<td class="w2ui-head w2ui-col-select" col="select">    <div>        <input type="checkbox" id="grid_${e.name}_check_all" class="w2ui-select-all" tabindex="-1"            style="${e.multiSelect == 0 ? "display: none;" : ""}"        >    </div></td>`), e.show.expandColumn && (o += '<td class="w2ui-head w2ui-col-expand" col="expand">    <div>&#160;</div></td>'), 0), p = 0, m;
      d += `<td id="grid_${e.name}_column_start" class="w2ui-head" col="start" style="border-right: 0"></td>`, e.reorderRows && (d += '<td class="w2ui-head w2ui-col-order" col="order">    <div>&#160;</div></td>');
      for (let b = 0; b < e.columns.length; b++) {
        var f, w = e.columns[b];
        w.text == null && w.caption != null && (console.log("NOTICE: grid column.caption property is deprecated, please use column.text. Column -> ", w), w.text = w.caption), w.size == null && (w.size = "100%"), b == p && (m = e.columnGroups[u++] || {}, p += m.span), (b < e.last.colStart || b > e.last.colEnd) && !w.frozen || w.hidden || m.main === true && !h || (f = e.getColumnCellHTML(b), w && w.frozen ? o += f : d += f);
      }
      return o += '<td class="w2ui-head w2ui-head-last"><div>&#160;</div></td>', d += '<td class="w2ui-head w2ui-head-last" col="end"><div>&#160;</div></td>', o += "</tr>", d += "</tr>", [o, d];
    }
  }
  getColumnCellHTML(e) {
    var t = this.columns[e];
    if (t == null) return "";
    var i = !this.reorderColumns || this.columnGroups && this.columnGroups.length ? "" : " w2ui-col-reorderable ";
    let s = "";
    for (let o = 0; o < this.sortData.length; o++) this.sortData[o].field == t.field && ((this.sortData[o].direction || "").toLowerCase() === "asc" && (s = "w2ui-sort-up"), (this.sortData[o].direction || "").toLowerCase() === "desc") && (s = "w2ui-sort-down");
    var l, r = this.last.selection.columns;
    let a = false;
    for (l in r) for (let o = 0; o < r[l].length; o++) r[l][o] == e && (a = true);
    var h = c.lang(typeof t.text == "function" ? t.text(t) : t.text);
    return '<td id="grid_' + this.name + "_column_" + e + '" col="' + e + '" class="w2ui-head ' + s + i + '">' + (t.resizable !== false ? '<div class="w2ui-resizer" name="' + e + '"></div>' : "") + '    <div class="w2ui-col-header ' + (s ? "w2ui-col-sorted" : "") + " " + (a ? "w2ui-col-selected" : "") + '">        <div class="' + s + '"></div>' + (h || "&#160;") + "    </div></td>";
  }
  columnTooltipShow(s, t) {
    var i = n(this.box).find("#grid_" + this.name + "_column_" + s), s = this.columns[s], l = this.columnTooltip;
    F.show({ name: this.name + "-column-tooltip", anchor: i.get(0), html: s == null ? void 0 : s.tooltip, position: l });
  }
  columnTooltipHide(e, t) {
    F.hide(this.name + "-column-tooltip");
  }
  getRecordsHTML() {
    var _a;
    let e = this.records.length;
    var t = typeof this.url != "object" ? this.url : this.url.get, t = ((e = this.searchData.length == 0 || t ? e : this.last.searchIds.length) > this.vs_start ? this.last.show_extra = this.vs_extra : this.last.show_extra = this.vs_start, n(this.box).find(`#grid_${this.name}_records`));
    let i = Math.floor((((_a = t.get(0)) == null ? void 0 : _a.clientHeight) || 0) / this.recordHeight) + this.last.show_extra + 1;
    (!this.fixedBody || i > e) && (i = e);
    var s = this.getRecordHTML(-1, 0);
    let l = "<table><tbody>" + s[0], r = "<table><tbody>" + s[1];
    l += '<tr id="grid_' + this.name + '_frec_top" line="top" style="height: 0px">    <td colspan="2000"></td></tr>', r += '<tr id="grid_' + this.name + '_rec_top" line="top" style="height: 0px">    <td colspan="2000"></td></tr>';
    for (let a = 0; a < i; a++) s = this.getRecordHTML(a, a + 1), l += s[0], r += s[1];
    return t = (e - i) * this.recordHeight, l += '<tr id="grid_' + this.name + '_frec_bottom" rec="bottom" line="bottom" style="height: ' + t + 'px; vertical-align: top">    <td colspan="2000" style="border-right: 1px solid #D6D5D7;"></td></tr><tr id="grid_' + this.name + '_frec_more" style="display: none; ">    <td colspan="2000" class="w2ui-load-more"></td></tr></tbody></table>', r += '<tr id="grid_' + this.name + '_rec_bottom" rec="bottom" line="bottom" style="height: ' + t + 'px; vertical-align: top">    <td colspan="2000" style="border: 0"></td></tr><tr id="grid_' + this.name + '_rec_more" style="display: none">    <td colspan="2000" class="w2ui-load-more"></td></tr></tbody></table>', this.last.range_start = 0, this.last.range_end = i, [l, r];
  }
  getSummaryHTML() {
    if (this.summary.length !== 0) {
      var e = this.getRecordHTML(-1, 0);
      let t = "<table><tbody>" + e[0], i = "<table><tbody>" + e[1];
      for (let s = 0; s < this.summary.length; s++) e = this.getRecordHTML(s, s + 1, true), t += e[0], i += e[1];
      return t += "</tbody></table>", i += "</tbody></table>", [t, i];
    }
  }
  scroll(e) {
    let t = this;
    var i = typeof this.url != "object" ? this.url : this.url.get, s = n(this.box).find(`#grid_${this.name}_records`), l = n(this.box).find(`#grid_${this.name}_frecords`);
    e && (v = e.target.scrollTop, e = e.target.scrollLeft, this.last.scrollTop = v, this.last.scrollLeft = e, u = n(this.box).find(`#grid_${this.name}_columns`)[0], p = n(this.box).find(`#grid_${this.name}_summary`)[0], u && (u.scrollLeft = e), p && (p.scrollLeft = e), l[0]) && (l[0].scrollTop = v), this.last.bubbleEl && (F.hide(this.name + "-bubble"), this.last.bubbleEl = null);
    let r = null, a = null;
    if (this.disableCVS || 0 < this.columnGroups.length) r = 0, a = this.columns.length - 1;
    else {
      var h, o = s.prop("clientWidth");
      let C = 0;
      for (let x = 0; x < this.columns.length; x++) this.columns[x].frozen || this.columns[x].hidden || (h = parseInt(this.columns[x].sizeCalculated || this.columns[x].size), C + h + 30 > this.last.scrollLeft && r == null && (r = x), C + h - 30 > this.last.scrollLeft + o && a == null && (a = x), C += h);
      a == null && (a = this.columns.length - 1);
    }
    if (r != null && (r < 0 && (r = 0), a < 0 && (a = 0), r == a && (0 < r ? r-- : a++), r != this.last.colStart || a != this.last.colEnd)) {
      var d = n(this.box), u = Math.abs(r - this.last.colStart), p = Math.abs(a - this.last.colEnd);
      if (u < 5 && p < 5) {
        var m = d.find(`.w2ui-grid-columns #grid_${this.name}_column_start`), f = d.find(".w2ui-grid-columns .w2ui-head-last"), w = d.find(`#grid_${this.name}_records .w2ui-grid-data-spacer`), b = d.find(`#grid_${this.name}_records .w2ui-grid-data-last`), g = d.find(`#grid_${this.name}_summary .w2ui-grid-data-spacer`), y = d.find(`#grid_${this.name}_summary .w2ui-grid-data-last`);
        if (r > this.last.colStart) for (let C = this.last.colStart; C < r; C++) d.find("#grid_" + this.name + "_columns #grid_" + this.name + "_column_" + C).remove(), d.find("#grid_" + this.name + '_records td[col="' + C + '"]').remove(), d.find("#grid_" + this.name + '_summary td[col="' + C + '"]').remove();
        if (a < this.last.colEnd) for (let C = this.last.colEnd; C > a; C--) d.find("#grid_" + this.name + "_columns #grid_" + this.name + "_column_" + C).remove(), d.find("#grid_" + this.name + '_records td[col="' + C + '"]').remove(), d.find("#grid_" + this.name + '_summary td[col="' + C + '"]').remove();
        if (r < this.last.colStart) for (let C = this.last.colStart - 1; C >= r; C--) this.columns[C] && (this.columns[C].frozen || this.columns[C].hidden) || (m.after(this.getColumnCellHTML(C)), w.each((x) => {
          var $ = n(x).parent().attr("index");
          let I = '<td class="w2ui-grid-data" col="' + C + '" style="height: 0px"></td>';
          $ != null && (I = this.getCellHTML(parseInt($), C, false)), n(x).after(I);
        }), g.each((x) => {
          var $ = n(x).parent().attr("index");
          let I = '<td class="w2ui-grid-data" col="' + C + '" style="height: 0px"></td>';
          $ != null && (I = this.getCellHTML(parseInt($), C, true)), n(x).after(I);
        }));
        if (a > this.last.colEnd) for (let C = this.last.colEnd + 1; C <= a; C++) this.columns[C] && (this.columns[C].frozen || this.columns[C].hidden) || (f.before(this.getColumnCellHTML(C)), b.each((x) => {
          var $ = n(x).parent().attr("index");
          let I = '<td class="w2ui-grid-data" col="' + C + '" style="height: 0px"></td>';
          $ != null && (I = this.getCellHTML(parseInt($), C, false)), n(x).before(I);
        }), y.each((x) => {
          var $ = n(x).parent().attr("index") || -1, $ = this.getCellHTML(parseInt($), C, true);
          n(x).before($);
        }));
        this.last.colStart = r, this.last.colEnd = a;
      } else {
        this.last.colStart = r, this.last.colEnd = a;
        var e = this.getColumnsHTML(), v = this.getRecordsHTML(), u = this.getSummaryHTML(), p = d.find(`#grid_${this.name}_columns`);
        let I = d.find(`#grid_${this.name}_records`);
        var _ = d.find(`#grid_${this.name}_frecords`);
        let N = d.find(`#grid_${this.name}_summary`);
        p.find("tbody").html(e[1]), _.html(v[0]), I.prepend(v[1]), u != null && N.html(u[1]), setTimeout(() => {
          I.find(":scope > table").filter(":not(table:first-child)").remove(), N[0] && (N[0].scrollLeft = this.last.scrollLeft);
        }, 1);
      }
      this.resizeRecords();
    }
    let k = this.records.length;
    if (k > this.total && this.total !== -1 && (k = this.total), (k = this.searchData.length == 0 || i ? k : this.last.searchIds.length) !== 0 && s.length !== 0 && s.prop("clientHeight") !== 0) {
      k > this.vs_start ? this.last.show_extra = this.vs_extra : this.last.show_extra = this.vs_start;
      let C = Math.round(s.prop("scrollTop") / this.recordHeight + 1), x = C + (Math.round(s.prop("clientHeight") / this.recordHeight) - 1);
      if (C > k && (C = k), x >= k - 1 && (x = k), n(this.box).find("#grid_" + this.name + "_footer .w2ui-footer-right").html((this.show.statusRange ? c.formatNumber(this.offset + C) + "-" + c.formatNumber(this.offset + x) + (this.total != -1 ? " " + c.lang("of") + " " + c.formatNumber(this.total) : "") : "") + (i && this.show.statusBuffered ? " (" + c.lang("buffered") + " " + c.formatNumber(k) + (0 < this.offset ? ", skip " + c.formatNumber(this.offset) : "") + ")" : "")), i || this.fixedBody && !(this.total != -1 && this.total <= this.vs_start)) {
        let K = function() {
          t.markSearch && (clearTimeout(t.last.marker_timer), t.last.marker_timer = setTimeout(() => {
            var W = [];
            for (let q = 0; q < t.searchData.length; q++) {
              var V = t.searchData[q], X = t.getSearch(V.field);
              X && !X.hidden && (X = t.getColumn(V.field, true), W.push({ field: V.field, search: V.value, col: X }));
            }
            0 < W.length && W.forEach((q) => {
              var le = n(t.box).find('td[col="' + q.col + '"]:not(.w2ui-head)');
              c.marker(le, q.search);
            });
          }, 50));
        }, $ = Math.floor(s.prop("scrollTop") / this.recordHeight) - this.last.show_extra, I = $ + Math.floor(s.prop("clientHeight") / this.recordHeight) + 2 * this.last.show_extra + 1;
        $ < 1 && ($ = 1), I > this.total && this.total != -1 && (I = this.total);
        var E = s.find("#grid_" + this.name + "_rec_top"), T = s.find("#grid_" + this.name + "_rec_bottom"), S = l.find("#grid_" + this.name + "_frec_top"), R = l.find("#grid_" + this.name + "_frec_bottom"), p = (String(E.next().prop("id")).indexOf("_expanded_row") != -1 && (E.next().remove(), S.next().remove()), this.total > I && String(T.prev().prop("id")).indexOf("_expanded_row") != -1 && (T.prev().remove(), R.prev().remove()), parseInt(E.next().attr("line"))), e = parseInt(T.prev().attr("line"));
        let B, j, A, O, z;
        if (p < $ || p == 1 || this.last.pull_refresh) {
          if (I <= e + this.last.show_extra - 2 && I != this.total) return;
          for (this.last.pull_refresh = false; j = l.find("#grid_" + this.name + "_frec_top").next(), !((A = s.find("#grid_" + this.name + "_rec_top").next()).attr("line") == "bottom" || !(parseInt(A.attr("line")) < $)); ) j.remove(), A.remove();
          B = s.find("#grid_" + this.name + "_rec_bottom").prev(), (O = B.attr("line")) == "top" && (O = $);
          for (let W = parseInt(O) + 1; W <= I; W++) this.records[W - 1] && ((A = this.records[W - 1].w2ui) && !Array.isArray(A.children) && (A.expanded = false), z = this.getRecordHTML(W - 1, W), T.before(z[1]), R.before(z[0]));
        } else {
          if ($ >= p - this.last.show_extra + 2 && 1 < $) return;
          for (; j = l.find("#grid_" + this.name + "_frec_bottom").prev(), !((A = s.find("#grid_" + this.name + "_rec_bottom").prev()).attr("line") == "top" || !(parseInt(A.attr("line")) > I)); ) j.remove(), A.remove();
          B = s.find("#grid_" + this.name + "_rec_top").next(), (O = B.attr("line")) == "bottom" && (O = I);
          for (let W = parseInt(O) - 1; W >= $; W--) this.records[W - 1] && ((A = this.records[W - 1].w2ui) && !Array.isArray(A.children) && (A.expanded = false), z = this.getRecordHTML(W - 1, W), E.after(z[1]), S.after(z[0]));
        }
        K(), setTimeout(() => {
          this.refreshRanges();
        }, 0), _ = ($ - 1) * this.recordHeight;
        let M = (k - I) * this.recordHeight;
        M < 0 && (M = 0), E.css("height", _ + "px"), S.css("height", _ + "px"), T.css("height", M + "px"), R.css("height", M + "px"), this.last.range_start = $, this.last.range_end = I, Math.floor(s.prop("scrollTop") / this.recordHeight) + Math.floor(s.prop("clientHeight") / this.recordHeight) + 10 > k && this.last.pull_more !== true && (k < this.total - this.offset || this.total == -1 && this.last.fetch.hasMore) && (this.autoLoad === true && (this.last.pull_more = true, this.last.fetch.offset += this.limit, this.request("load")), n(this.box).find("#grid_" + this.name + "_rec_more, #grid_" + this.name + "_frec_more").show().eq(1).off(".load-more").on("click.load-more", function() {
          n(this).find("td").html('<div><div style="width: 20px; height: 20px;" class="w2ui-spinner"></div></div>'), t.last.pull_more = true, t.last.fetch.offset += t.limit, t.request("load");
        }).find("td").html(t.autoLoad ? '<div><div style="width: 20px; height: 20px;" class="w2ui-spinner"></div></div>' : '<div style="padding-top: 15px">' + c.lang("Load ${count} more...", { count: t.limit }) + "</div>"));
      }
    }
  }
  getRecordHTML(e, t, i) {
    var _a, _b, _c, _d, _e2;
    let s = "", l = "";
    var r = this.last.selection;
    let a;
    if (e == -1) {
      s += '<tr line="0">', l += '<tr line="0">', this.show.lineNumbers && (s += '<td class="w2ui-col-number" style="height: 0px"></td>'), this.show.selectColumn && (s += '<td class="w2ui-col-select" style="height: 0px"></td>'), this.show.expandColumn && (s += '<td class="w2ui-col-expand" style="height: 0px"></td>'), l += '<td class="w2ui-grid-data w2ui-grid-data-spacer" col="start" style="height: 0px; width: 0px"></td>', this.reorderRows && (l += '<td class="w2ui-col-order" style="height: 0px"></td>');
      for (let w = 0; w < this.columns.length; w++) {
        var h = this.columns[w], o = '<td class="w2ui-grid-data" col="' + w + '" style="height: 0px;"></td>';
        h.frozen && !h.hidden ? s += o : h.hidden || w < this.last.colStart || w > this.last.colEnd || (l += o);
      }
      s += '<td class="w2ui-grid-data-last" style="height: 0px"></td>', l += '<td class="w2ui-grid-data-last" col="end" style="height: 0px"></td>';
    } else {
      var d = typeof this.url != "object" ? this.url : this.url.get;
      if (i !== true) {
        if (0 < this.searchData.length && !d) {
          if (e >= this.last.searchIds.length) return "";
          e = this.last.searchIds[e];
        } else if (e >= this.records.length) return "";
        a = this.records[e];
      } else {
        if (e >= this.summary.length) return "";
        a = this.summary[e];
      }
      if (!a) return "";
      a.recid == null && this.recid != null && (d = this.parseField(a, this.recid)) != null && (a.recid = d);
      let w = false, b = (r.indexes.indexOf(e) != -1 && (w = true), a.w2ui ? a.w2ui.style : ""), g = (b != null && typeof b == "string" || (b = ""), a.w2ui ? a.w2ui.class : "");
      if (g != null && typeof g == "string" || (g = ""), s += '<tr id="grid_' + this.name + "_frec_" + a.recid + '" recid="' + a.recid + '" line="' + t + '" index="' + e + '"  class="' + (t % 2 == 0 ? "w2ui-even" : "w2ui-odd") + " w2ui-record " + g + (w && this.selectType == "row" ? " w2ui-selected" : "") + (a.w2ui && a.w2ui.editable === false ? " w2ui-no-edit" : "") + (a.w2ui && a.w2ui.expanded === true ? " w2ui-expanded" : "") + '"  style="height: ' + this.recordHeight + "px; " + (w || b == "" ? b.replace("background-color", "none") : b) + '" ' + (b != "" ? 'custom_style="' + b + '"' : "") + ">", l += '<tr id="grid_' + this.name + "_rec_" + a.recid + '" recid="' + a.recid + '" line="' + t + '" index="' + e + '"  class="' + (t % 2 == 0 ? "w2ui-even" : "w2ui-odd") + " w2ui-record " + g + (w && this.selectType == "row" ? " w2ui-selected" : "") + (a.w2ui && a.w2ui.editable === false ? " w2ui-no-edit" : "") + (a.w2ui && a.w2ui.expanded === true ? " w2ui-expanded" : "") + '"  style="height: ' + this.recordHeight + "px; " + (w || b == "" ? b.replace("background-color", "none") : b) + '" ' + (b != "" ? 'custom_style="' + b + '"' : "") + ">", this.show.lineNumbers && (s += '<td id="grid_' + this.name + "_cell_" + e + "_number" + (i ? "_s" : "") + '"    class="w2ui-col-number ' + (w ? " w2ui-row-selected" : "") + '"' + (this.reorderRows ? ' style="cursor: move"' : "") + ">" + (i !== true ? this.getLineHTML(t, a) : "") + "</td>"), this.show.selectColumn && (s += '<td id="grid_' + this.name + "_cell_" + e + "_select" + (i ? "_s" : "") + '" class="w2ui-grid-data w2ui-col-select">' + (i === true || a.w2ui && a.w2ui.hideCheckBox === true ? "" : '    <div>        <input class="w2ui-grid-select-check" type="checkbox" tabindex="-1" ' + (w ? 'checked="checked"' : "") + ' style="pointer-events: none"/>    </div>') + "</td>"), this.show.expandColumn) {
        let _ = "";
        _ = ((_a = a.w2ui) == null ? void 0 : _a.expanded) === true ? "-" : "+", ((_b = a.w2ui) == null ? void 0 : _b.expanded) != "none" && Array.isArray((_c = a.w2ui) == null ? void 0 : _c.children) && ((_d = a.w2ui) == null ? void 0 : _d.children.length) || (_ = "+"), ((_e2 = a.w2ui) == null ? void 0 : _e2.expanded) == "spinner" && (_ = '<div class="w2ui-spinner" style="width: 16px; margin: -2px 2px;"></div>'), s += '<td id="grid_' + this.name + "_cell_" + e + "_expand" + (i ? "_s" : "") + '" class="w2ui-grid-data w2ui-col-expand">' + (i !== true ? `<div>${_}</div>` : "") + "</td>";
      }
      l += '<td class="w2ui-grid-data-spacer" col="start" style="border-right: 0"></td>', this.reorderRows && (l += '<td id="grid_' + this.name + "_cell_" + e + "_order" + (i ? "_s" : "") + '" class="w2ui-grid-data w2ui-col-order" col="order">' + (i !== true ? '<div title="Drag to reorder">&nbsp;</div>' : "") + "</td>");
      let y = 0, v = 0;
      for (; ; ) {
        let _ = 1;
        var u, p = this.columns[y];
        if (p == null) break;
        if (p.hidden) y++, 0 < v && v--;
        else if (0 < v) {
          if (y++, this.columns[y] == null) break;
          a.w2ui.colspan[this.columns[y - 1].field] = 0, v--;
        } else {
          if (a.w2ui && (f = a.w2ui.colspan, u = this.columns[y].field, f) && f[u] === 0 && delete f[u], !(y < this.last.colStart || y > this.last.colEnd) || p.frozen) {
            if (a.w2ui && typeof a.w2ui.colspan == "object") {
              var m = parseInt(a.w2ui.colspan[p.field]) || null;
              if (1 < m) {
                let k = 0;
                for (let E = y; E < y + m && !(E >= this.columns.length); E++) this.columns[E].hidden && k++;
                _ = m - k, v = m - 1;
              }
            }
            var f = this.getCellHTML(e, y, i, _);
            p.frozen ? s += f : l += f;
          }
          y++;
        }
      }
      s += '<td class="w2ui-grid-data-last"></td>', l += '<td class="w2ui-grid-data-last" col="end"></td>';
    }
    return s += "</tr>", l += "</tr>", [s, l];
  }
  getLineHTML(e) {
    return "<div>" + e + "</div>";
  }
  getCellHTML(e, t, i, s) {
    var _a, _b, _c, _d;
    let l = this, r = this.columns[t];
    if (r == null) return "";
    let a = (i !== true ? this.records : this.summary)[e], { value: h, style: o, className: d, attr: u, divAttr: p } = this.getCellValue(e, t, i, true);
    var m = e !== -1 ? this.getCellEditable(e, t) : "";
    let f = "max-height: " + parseInt(this.recordHeight) + "px;" + (r.clipboardCopy ? "margin-right: 20px" : "");
    var w = !i && ((_a = a == null ? void 0 : a.w2ui) == null ? void 0 : _a.changes) && a.w2ui.changes[r.field] != null, b = this.last.selection;
    let g = false, y = "";
    if (b.indexes.indexOf(e) != -1 && (g = true), s == null && (s = ((_b = a == null ? void 0 : a.w2ui) == null ? void 0 : _b.colspan) && a.w2ui.colspan[r.field] ? a.w2ui.colspan[r.field] : 1), t === 0 && Array.isArray((_c = a == null ? void 0 : a.w2ui) == null ? void 0 : _c.children)) {
      let S = 0, R = this.get(a.w2ui.parent_recid, true);
      for (; R != null; ) {
        S++;
        var v = this.records[R].w2ui;
        if (v == null || v.parent_recid == null) break;
        R = this.get(v.parent_recid, true);
      }
      if (a.w2ui.parent_recid) for (let C = 0; C < S; C++) y += '<span class="w2ui-show-children w2ui-icon-empty"></span>';
      var _ = 0 < a.w2ui.children.length ? a.w2ui.expanded ? "w2ui-icon-collapse" : "w2ui-icon-expand" : "w2ui-icon-empty";
      y += `<span class="w2ui-show-children ${_}"></span>`;
    }
    if (r.info === true && (r.info = {}), r.info != null) {
      let S = "w2ui-icon-info", R = (typeof r.info.icon == "function" ? S = r.info.icon(a, { self: this, index: e, colIndex: t, summary: !!i }) : typeof r.info.icon == "object" ? S = r.info.icon[this.parseField(a, r.field)] || "" : typeof r.info.icon == "string" && (S = r.info.icon), r.info.style || "");
      typeof r.info.style == "function" ? R = r.info.style(a, { self: this, index: e, colIndex: t, summary: !!i }) : typeof r.info.style == "object" ? R = r.info.style[this.parseField(a, r.field)] || "" : typeof r.info.style == "string" && (R = r.info.style), y += `<span class="w2ui-info ${S}" style="${R}"></span>`;
    }
    let k = h, E = (m && ["checkbox", "check"].indexOf(m.type) != -1 && (f += "text-align: center;", k = `<input tabindex="-1" type="checkbox" class="w2ui-editable-checkbox"
                            data-changeInd="${i ? -(e + 1) : e}" data-colInd="${t}" ${k ? 'checked="checked"' : ""}>`, y = ""), (k = `<div style="${f}" ${function(S) {
      let R;
      return l.show.recordTitles && (r.title != null ? (typeof r.title == "function" && (R = r.title.call(l, a, { self: this, index: e, colIndex: t, summary: !!i })), typeof r.title == "string" && (R = r.title)) : R = c.stripTags(String(S).replace(/"/g, "''"))), R != null ? 'title="' + String(R) + '"' : "";
    }(k)} ${p}>${y}${String(k)}</div>`) == null && (k = ""), typeof r.render == "string" && (_ = r.render.toLowerCase().split(":"), ["number", "int", "float", "money", "currency", "percent", "size"].indexOf(_[0]) != -1) && (o += "text-align: right;"), (a == null ? void 0 : a.w2ui) && (typeof a.w2ui.style == "object" && (typeof a.w2ui.style[t] == "string" && (o += a.w2ui.style[t] + ";"), typeof a.w2ui.style[r.field] == "string") && (o += a.w2ui.style[r.field] + ";"), typeof a.w2ui.class == "object") && (typeof a.w2ui.class[t] == "string" && (d += a.w2ui.class[t] + " "), typeof a.w2ui.class[r.field] == "string") && (d += a.w2ui.class[r.field] + " "), false);
    g && ((_d = b.columns[e]) == null ? void 0 : _d.includes(t)) && (E = true);
    let T;
    return r.clipboardCopy && (T = '<span class="w2ui-clipboard-copy w2ui-icon-paste"></span>'), k = '<td class="w2ui-grid-data' + (E ? " w2ui-selected" : "") + " " + d + (w ? " w2ui-changed" : "") + '"    id="grid_' + this.name + "_data_" + e + "_" + t + '" col="' + t + '"    style="' + o + (r.style != null ? r.style : "") + '" ' + (r.attr != null ? r.attr : "") + u + (1 < s ? 'colspan="' + s + '"' : "") + ">" + k + (T && c.stripTags(k) ? T : "") + "</td>", k = e === -1 && i === true ? '<td class="w2ui-grid-data" col="' + t + '" style="height: 0px; ' + o + '" ' + (1 < s ? 'colspan="' + s + '"' : "") + "></td>" : k;
  }
  clipboardCopy(e, t, i) {
    var s = (i ? this.summary : this.records)[e], l = this.columns[t];
    let r = l ? this.parseField(s, l.field) : "";
    typeof l.clipboardCopy == "function" && (r = l.clipboardCopy(s, { self: this, index: e, colIndex: t, summary: !!i })), n(this.box).find("#grid_" + this.name + "_focus").text(r).get(0).select(), document.execCommand("copy");
  }
  showBubble(e, t, i) {
    var s = this.columns[t].info;
    if (s) {
      let p = "";
      var l = this.records[e], r = n(this.box).find(`${i ? ".w2ui-grid-summary" : ""} #grid_${this.name}_data_${e}_${t} .w2ui-info`);
      if (this.last.bubbleEl && F.hide(this.name + "-bubble"), this.last.bubbleEl = r, s.fields == null) {
        s.fields = [];
        for (let f = 0; f < this.columns.length; f++) {
          var a = this.columns[f];
          s.fields.push(a.field + (typeof a.render == "string" ? ":" + a.render : ""));
        }
      }
      let m = s.fields;
      if (typeof m == "function" && (m = m(l, { self: this, index: e, colIndex: t, summary: !!i })), typeof s.render == "function") p = s.render(l, { self: this, index: e, colIndex: t, summary: !!i });
      else if (Array.isArray(m)) {
        p = '<table cellpadding="0" cellspacing="0">';
        for (let f = 0; f < m.length; f++) {
          var h = String(m[f]).split(":");
          if (h[0] == "" || h[0] == "-" || h[0] == "--" || h[0] == "---") p += '<tr><td colspan=2><div style="border-top: ' + (h[0] == "" ? "0" : "1") + 'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>';
          else {
            let w = this.getColumn(h[0]), b = (w = w ?? { field: h[0], caption: h[0] }) ? this.parseField(l, w.field) : "";
            1 < h.length && (c.formatters[h[1]] ? b = c.formatters[h[1]](b, h[2] || null, l) : console.log('ERROR: w2utils.formatters["' + h[1] + '"] does not exists.')), (s.showEmpty === true || b != null && b != "") && (s.maxLength != null && typeof b == "string" && b.length > s.maxLength && (b = b.substr(0, s.maxLength) + "..."), p += "<tr><td>" + w.text + "</td><td>" + ((b === 0 ? "0" : b) || "") + "</td></tr>");
          }
        }
        p += "</table>";
      } else if (c.isPlainObject(m)) {
        for (var o in p = '<table cellpadding="0" cellspacing="0">', m) {
          var d = m[o];
          if (d == "" || d == "-" || d == "--" || d == "---") p += '<tr><td colspan=2><div style="border-top: ' + (d == "" ? "0" : "1") + 'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>';
          else {
            var u = String(d).split(":");
            let f = this.getColumn(u[0]), w = (f = f ?? { field: u[0], caption: u[0] }) ? this.parseField(l, f.field) : "";
            1 < u.length && (c.formatters[u[1]] ? w = c.formatters[u[1]](w, u[2] || null, l) : console.log('ERROR: w2utils.formatters["' + u[1] + '"] does not exists.')), typeof d == "function" && (w = d(l, { self: this, index: e, colIndex: t, summary: !!i })), (s.showEmpty === true || w != null && w != "") && (s.maxLength != null && typeof w == "string" && w.length > s.maxLength && (w = w.substr(0, s.maxLength) + "..."), p += "<tr><td>" + o + "</td><td>" + ((w === 0 ? "0" : w) || "") + "</td></tr>");
          }
        }
        p += "</table>";
      }
      return F.show(c.extend({ name: this.name + "-bubble", html: p, anchor: r.get(0), position: "top|bottom", class: "w2ui-info-bubble", style: "", hideOn: ["doc-click"] }, s.options ?? {})).hide(() => [this.last.bubbleEl = null]);
    }
  }
  getCellEditable(e, t) {
    var i = this.columns[t], s = this.records[e];
    if (!s || !i) return null;
    let l = s.w2ui ? s.w2ui.editable : null;
    return l === false ? null : (l != null && l !== true || typeof (l = 0 < Object.keys(i.editable ?? {}).length ? i.editable : null) == "function" && (i = this.getCellValue(e, t, false), l = l.call(this, s, { self: this, value: i, index: e, colIndex: t })), l);
  }
  getCellValue(e, t, i, s) {
    var _a, _b;
    var l = this.columns[t], r = (i !== true ? this.records : this.summary)[e];
    let a = this.parseField(r, l.field), h = "", o = "", d = "", u = "";
    if (((_b = (_a = r == null ? void 0 : r.w2ui) == null ? void 0 : _a.changes) == null ? void 0 : _b[l.field]) != null && (a = r.w2ui.changes[l.field]), l.render != null && e !== -1) {
      if (typeof l.render == "function" && r != null) {
        let p;
        try {
          p = l.render(r, { self: this, value: a, index: e, colIndex: t, summary: !!i });
        } catch (m) {
          throw new Error(`Render function for column "${l.field}" in grid "${this.name}": -- ` + m.message);
        }
        p != null && typeof p == "object" && typeof p != "function" ? (p.id != null && p.text != null ? a = p.text : typeof p.html == "string" ? a = (p.html || "").trim() : (a = "", console.log("ERROR: render function should return a primitive or an object of the following structure.", { html: "", attr: "", style: "", class: "", divAttr: "" })), d = p.attr ?? "", o = p.style ?? "", h = p.class ?? "", u = p.divAttr ?? "") : a = String(p || "").trim();
      }
      if (typeof l.render == "object" && (e = l.render[a]) != null && e !== "" && (a = e), typeof l.render == "string") {
        t = l.render.toLowerCase().indexOf(":"), i = [], t == -1 ? (i[0] = l.render.toLowerCase(), i[1] = "") : (i[0] = l.render.toLowerCase().substr(0, t), i[1] = l.render.toLowerCase().substr(t + 1));
        let p = c.formatters[i[0]];
        l.options && l.options.autoFormat === false && (p = null), a = typeof p == "function" ? p(a, i[1], r) : "";
      }
    }
    return a == null && (a = ""), s ? { value: a, attr: d, style: o, className: h, divAttr: u } : a;
  }
  getFooterHTML() {
    return '<div>    <div class="w2ui-footer-left"></div>    <div class="w2ui-footer-right"></div>    <div class="w2ui-footer-center"></div></div>';
  }
  status(e) {
    if (e != null) n(this.box).find(`#grid_${this.name}_footer`).find(".w2ui-footer-left").html(e);
    else {
      let t = "";
      if (e = this.getSelection(), 0 < e.length && (this.show.statusSelection && 1 < e.length && (t = String(e.length).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + c.settings.groupSymbol) + " " + c.lang("selected")), this.show.statusRecordID) && e.length == 1) {
        let i = e[0];
        typeof i == "object" && (i = i.recid + ", " + c.lang("Column") + ": " + i.column), t = c.lang("Record ID") + ": " + i + " ";
      }
      n(this.box).find("#grid_" + this.name + "_footer .w2ui-footer-left").html(t);
    }
  }
  lock(e, t) {
    let i = Array.from(arguments);
    i.unshift(this.box), setTimeout(() => {
      n(this.box).find("#grid_" + this.name + "_empty_msg").remove(), c.lock(...i);
    }, 10);
  }
  unlock(e) {
    setTimeout(() => {
      n(this.box).find(".w2ui-message").hasClass("w2ui-closing") || c.unlock(this.box, e);
    }, 25);
  }
  stateSave(e) {
    var t = { columns: [], show: c.clone(this.show), last: { search: this.last.search, multi: this.last.multi, logic: this.last.logic, label: this.last.label, field: this.last.field, scrollTop: this.last.scrollTop, scrollLeft: this.last.scrollLeft }, sortData: [], searchData: [] };
    let i;
    for (let l = 0; l < this.columns.length; l++) {
      let r = this.columns[l], a = {};
      Object.keys(this.stateColProps).forEach((h, o) => {
        this.stateColProps[h] && (i = r[h] !== void 0 ? r[h] : this.colTemplate[h] || null, a[h] = i);
      }), t.columns.push(a);
    }
    for (let l = 0; l < this.sortData.length; l++) t.sortData.push(c.clone(this.sortData[l]));
    for (let l = 0; l < this.searchData.length; l++) t.searchData.push(c.clone(this.searchData[l]));
    var s = this.trigger("stateSave", { target: this.name, state: t });
    if (s.isCancelled !== true) return e !== true && this.cacheSave("state", t), s.finish(), t;
  }
  stateRestore(e) {
    var _a, _b, _c;
    let t = typeof this.url != "object" ? this.url : this.url.get;
    e = e || this.cache("state");
    var i = this.trigger("stateRestore", { target: this.name, state: e });
    if (i.isCancelled !== true) {
      if (c.isPlainObject(e)) {
        c.extend(this.show, e.show ?? {}), c.extend(this.last, e.last ?? {});
        let r = this.last.scrollTop, a = this.last.scrollLeft;
        for (let h = 0; h < ((_a = e.columns) == null ? void 0 : _a.length); h++) {
          var s = e.columns[h], l = this.getColumn(s.field, true);
          l !== null && (c.extend(this.columns[l], s), h !== l) && this.columns.splice(h, 0, this.columns.splice(l, 1)[0]);
        }
        this.sortData.splice(0, this.sortData.length);
        for (let h = 0; h < ((_b = e.sortData) == null ? void 0 : _b.length); h++) this.sortData.push(e.sortData[h]);
        this.searchData.splice(0, this.searchData.length);
        for (let h = 0; h < ((_c = e.searchData) == null ? void 0 : _c.length); h++) this.searchData.push(e.searchData[h]);
        setTimeout(() => {
          t || (0 < this.sortData.length && this.localSort(), 0 < this.searchData.length && this.localSearch()), this.last.scrollTop = r, this.last.scrollLeft = a, this.refresh();
        }, 1), console.log(`INFO (w2ui): state restored for "${this.name}"`);
      }
      return i.finish(), true;
    }
  }
  stateReset() {
    this.stateRestore(this.last.state), this.cacheSave("state", null);
  }
  parseField(e, t) {
    if (this.nestedFields) {
      let s = "";
      try {
        s = e;
        var i = String(t).split(".");
        for (let l = 0; l < i.length; l++) s = s[i[l]];
      } catch {
        s = "";
      }
      return s;
    }
    return e ? e[t] : "";
  }
  prepareData() {
    let e = this;
    for (let t = 0; t < this.records.length; t++) (function i(s) {
      var _a, _b;
      for (let l = 0; l < e.columns.length; l++) {
        let r = e.columns[l];
        if (s[r.field] != null && typeof r.render == "string") {
          if (["number", "int", "float", "money", "currency", "percent"].indexOf(r.render.split(":")[0]) != -1 && typeof s[r.field] != "number" && (s[r.field] = parseFloat(s[r.field])), ["date", "age"].indexOf(r.render.split(":")[0]) != -1 && !s[r.field + "_"]) {
            let a = s[r.field];
            c.isInt(a) && (a = parseInt(a)), s[r.field + "_"] = new Date(a);
          }
          if (["time"].indexOf(r.render) != -1) if (c.isTime(s[r.field])) {
            let a = c.isTime(s[r.field], true), h = /* @__PURE__ */ new Date();
            h.setHours(a.hours, a.minutes, a.seconds || 0, 0), s[r.field + "_"] || (s[r.field + "_"] = h);
          } else {
            let a = s[r.field], h = (a = (a = c.isInt(a) ? parseInt(a) : a) != null ? new Date(a) : /* @__PURE__ */ new Date(), /* @__PURE__ */ new Date());
            h.setHours(a.getHours(), a.getMinutes(), a.getSeconds(), 0), s[r.field + "_"] || (s[r.field + "_"] = h);
          }
        }
      }
      if (((_a = s.w2ui) == null ? void 0 : _a.children) && ((_b = s.w2ui) == null ? void 0 : _b.expanded) !== true) for (let l = 0; l < s.w2ui.children.length; l++) {
        let r = s.w2ui.children[l];
        i(r);
      }
    })(this.records[t]);
  }
  nextCell(e, t, i) {
    if (t += 1, t >= this.columns.length) return (e = this.nextRow(e)) == null ? e : this.nextCell(e, -1, i);
    var l = this.records[e].w2ui, s = this.columns[t], l = l && l.colspan && !isNaN(l.colspan[s.field]) ? parseInt(l.colspan[s.field]) : 1;
    return s == null ? null : s && s.hidden || l === 0 ? this.nextCell(e, t, i) : i && (s = this.getCellEditable(e, t), s == null || ["checkbox", "check"].indexOf(s.type) != -1) ? this.nextCell(e, t, i) : { index: e, colIndex: t };
  }
  prevCell(e, t, i) {
    if (t -= 1, t < 0) return (e = this.prevRow(e)) == null ? e : this.prevCell(e, this.columns.length, i);
    if (t < 0) return null;
    var l = this.records[e].w2ui, s = this.columns[t], l = l && l.colspan && !isNaN(l.colspan[s.field]) ? parseInt(l.colspan[s.field]) : 1;
    return s == null ? null : s && s.hidden || l === 0 ? this.prevCell(e, t, i) : i && (s = this.getCellEditable(e, t), s == null || ["checkbox", "check"].indexOf(s.type) != -1) ? this.prevCell(e, t, i) : { index: e, colIndex: t };
  }
  nextRow(e, t, i) {
    var s = this.last.searchIds;
    let l = null;
    if ((i = i ?? 1) == -1) return this.records.length - 1;
    if (e + i < this.records.length && s.length === 0 || 0 < s.length && e < s[s.length - i]) {
      if (e += i, 0 < s.length) for (; !(s.includes(e) || e > this.records.length); ) e += i;
      var a = this.records[e].w2ui, r = this.columns[t], a = a && a.colspan && r != null && !isNaN(a.colspan[r.field]) ? parseInt(a.colspan[r.field]) : 1;
      l = a === 0 ? this.nextRow(e, t, i) : e;
    }
    return l;
  }
  prevRow(e, t, i) {
    var s = this.last.searchIds;
    let l = null;
    if ((i = i ?? 1) == -1) return 0;
    if (0 <= e - i && s.length === 0 || 0 < s.length && e > s[0]) {
      if (e -= i, 0 < s.length) for (; !(s.includes(e) || e < 0); ) e -= i;
      var a = this.records[e].w2ui, r = this.columns[t], a = a && a.colspan && r != null && !isNaN(a.colspan[r.field]) ? parseInt(a.colspan[r.field]) : 1;
      l = a === 0 ? this.prevRow(e, t, i) : e;
    }
    return l;
  }
  selectionSave() {
    return this.last.saved_sel = this.getSelection(), this.last.saved_sel;
  }
  selectionRestore(e) {
    var t, i = Date.now(), s = (this.last.selection = { indexes: [], columns: {} }, this.last.selection), l = this.last.saved_sel;
    if (l) for (let r = 0; r < l.length; r++) c.isPlainObject(l[r]) ? (t = this.get(l[r].recid, true)) != null && (s.indexes.indexOf(t) == -1 && s.indexes.push(t), s.columns[t] || (s.columns[t] = []), s.columns[t].push(l[r].column)) : (t = this.get(l[r], true)) != null && s.indexes.push(t);
    return delete this.last.saved_sel, e !== true && this.refresh(), Date.now() - i;
  }
  message(e) {
    return c.message({ owner: this, box: this.box, after: ".w2ui-grid-header" }, e);
  }
  confirm(e) {
    return c.confirm({ owner: this, box: this.box, after: ".w2ui-grid-header" }, e);
  }
}
class me extends ie {
  constructor(e, t) {
    super(), typeof e == "string" && t == null && (t = { type: e }), typeof e == "object" && t == null && (t = c.clone(e)), typeof e == "string" && typeof t == "object" && (t.type = e), t.type = String(t.type).toLowerCase(), this.el = t.el ?? null, this.selected = null, this.helpers = {}, this.type = t.type ?? "text", this.options = c.clone(t), this.onClick = t.onClick ?? null, this.onAdd = t.onAdd ?? null, this.onNew = t.onNew ?? null, this.onRemove = t.onRemove ?? null, this.onMouseEnter = t.onMouseEnter ?? null, this.onMouseLeave = t.onMouseLeave ?? null, this.onScroll = t.onScroll ?? null, this.tmp = {}, delete this.options.type, delete this.options.onClick, delete this.options.onMouseEnter, delete this.options.onMouseLeave, delete this.options.onScroll, this.el && this.render(this.el);
  }
  render(e) {
    e instanceof HTMLElement ? (e._w2field ? e._w2field.reset() : e._w2field = this, this.el = e, this.init()) : console.log("ERROR: Cannot init w2field on empty subject");
  }
  init() {
    let e = this.options, t;
    if (["INPUT", "TEXTAREA"].includes(this.el.tagName.toUpperCase())) {
      switch (this.type) {
        case "text":
        case "int":
        case "float":
        case "money":
        case "currency":
        case "percent":
        case "alphanumeric":
        case "bin":
        case "hex":
          t = { min: null, max: null, step: 1, autoFormat: true, autoCorrect: true, currencyPrefix: c.settings.currencyPrefix, currencySuffix: c.settings.currencySuffix, currencyPrecision: c.settings.currencyPrecision, decimalSymbol: c.settings.decimalSymbol, groupSymbol: c.settings.groupSymbol, arrow: false, keyboard: true, precision: null, prefix: "", suffix: "" }, this.options = c.extend({}, t, e), (e = this.options).numberRE = new RegExp("[" + e.groupSymbol + "]", "g"), e.moneyRE = new RegExp("[" + e.currencyPrefix + e.currencySuffix + e.groupSymbol + "]", "g"), e.percentRE = new RegExp("[" + e.groupSymbol + "%]", "g"), ["text", "alphanumeric", "hex", "bin"].includes(this.type) && (e.arrow = false, e.keyboard = false);
          break;
        case "color":
          t = { prefix: "#", suffix: `<div style="width: ${parseInt(getComputedStyle(this.el)["font-size"]) || 12}px">&#160;</div>`, arrow: false, advanced: null, transparent: true }, this.options = c.extend({}, t, e), e = this.options;
          break;
        case "date":
          t = { format: c.settings.dateFormat, keyboard: true, autoCorrect: true, start: null, end: null, blockDates: [], blockWeekdays: [], colored: {}, btnNow: true }, this.options = c.extend({ type: "date" }, t, e), e = this.options, n(this.el).attr("placeholder") == null && n(this.el).attr("placeholder", e.format);
          break;
        case "time":
          t = { format: c.settings.timeFormat, keyboard: true, autoCorrect: true, start: null, end: null, btnNow: true, noMinutes: false }, this.options = c.extend({ type: "time" }, t, e), e = this.options, n(this.el).attr("placeholder") == null && n(this.el).attr("placeholder", e.format);
          break;
        case "datetime":
          t = { format: c.settings.dateFormat + "|" + c.settings.timeFormat, keyboard: true, autoCorrect: true, start: null, end: null, startTime: null, endTime: null, blockDates: [], blockWeekdays: [], colored: {}, btnNow: true, noMinutes: false }, this.options = c.extend({ type: "datetime" }, t, e), e = this.options, n(this.el).attr("placeholder") == null && n(this.el).attr("placeholder", e.placeholder || e.format);
          break;
        case "list":
        case "combo":
          t = { items: [], selected: {}, url: null, recId: null, recText: null, method: null, debounce: 250, postData: {}, minLength: 1, cacheMax: 250, maxDropHeight: 350, maxDropWidth: null, minDropWidth: null, match: "begins", icon: null, iconStyle: "", align: "both", altRows: true, renderDrop: null, compare: null, filter: true, hideSelected: false, prefix: "", suffix: "", msgNoItems: "No matches", msgSearch: "Type to search...", openOnFocus: false, markSearch: false, onSearch: null, onRequest: null, onLoad: null, onError: null }, typeof e.items == "function" && (e._items_fun = e.items), e.items = c.normMenu.call(this, e.items), this.type === "list" && (n(this.el).addClass("w2ui-select"), !c.isPlainObject(e.selected)) && Array.isArray(e.items) && e.items.forEach((i) => {
            i && i.id === e.selected && (e.selected = c.clone(i));
          }), e = c.extend({}, t, e), this.options = e, c.isPlainObject(e.selected) || (e.selected = {}), this.selected = e.selected, n(this.el).attr("autocapitalize", "off").attr("autocomplete", "off").attr("autocorrect", "off").attr("spellcheck", "false"), e.selected.text != null && n(this.el).val(e.selected.text);
          break;
        case "enum":
          t = { items: [], selected: [], max: 0, url: null, recId: null, recText: null, debounce: 250, method: null, postData: {}, minLength: 1, cacheMax: 250, maxItemWidth: 250, maxDropHeight: 350, maxDropWidth: null, match: "contains", align: "", altRows: true, openOnFocus: false, markSearch: false, renderDrop: null, renderItem: null, compare: null, filter: true, hideSelected: true, style: "", msgNoItems: "No matches", msgSearch: "Type to search...", onSearch: null, onRequest: null, onLoad: null, onError: null, onClick: null, onAdd: null, onNew: null, onRemove: null, onMouseEnter: null, onMouseLeave: null, onScroll: null }, typeof (e = c.extend({}, t, e, { suffix: "" })).items == "function" && (e._items_fun = e.items), e.items = c.normMenu.call(this, e.items), e.selected = c.normMenu.call(this, e.selected), this.options = e, Array.isArray(e.selected) || (e.selected = []), this.selected = e.selected;
          break;
        case "file":
          t = { selected: [], max: 0, maxSize: 0, maxFileSize: 0, maxItemWidth: 250, maxDropHeight: 350, maxDropWidth: null, readContent: true, silent: true, align: "both", altRows: true, renderItem: null, style: "", onClick: null, onAdd: null, onRemove: null, onMouseEnter: null, onMouseLeave: null }, e = c.extend({}, t, e), this.options = e, Array.isArray(e.selected) || (e.selected = []), this.selected = e.selected, n(this.el).attr("placeholder") == null && n(this.el).attr("placeholder", c.lang("Attach files by dragging and dropping or Click to Select"));
      }
      n(this.el).css("box-sizing", "border-box").addClass("w2field w2ui-input").off(".w2field").on("change.w2field", (i) => {
        this.change(i);
      }).on("click.w2field", (i) => {
        this.click(i);
      }).on("focus.w2field", (i) => {
        this.focus(i);
      }).on("blur.w2field", (i) => {
        this.type !== "list" && this.blur(i);
      }).on("keydown.w2field", (i) => {
        this.keyDown(i);
      }).on("keyup.w2field", (i) => {
        this.keyUp(i);
      }), this.addPrefix(), this.addSuffix(), this.addSearch(), this.addMultiSearch(), this.change(new Event("change"));
    } else console.log("ERROR: w2field could only be applied to INPUT or TEXTAREA.", this.el);
  }
  get() {
    return ["list", "enum", "file"].indexOf(this.type) !== -1 ? this.selected : n(this.el).val();
  }
  set(e, t) {
    ["list", "enum", "file"].indexOf(this.type) !== -1 ? (this.type !== "list" && t ? (Array.isArray(this.selected) || (this.selected = []), this.selected.push(e), (t = Y.get(this.el.id + "_menu")) && (t.options.selected = this.selected)) : (e == null && (e = []), t = this.type !== "enum" || Array.isArray(e) ? e : [e], this.selected = t), n(this.el).trigger("input").trigger("change"), this.refresh()) : n(this.el).val(e);
  }
  setIndex(e, t) {
    if (["list", "enum"].indexOf(this.type) !== -1) {
      var i = this.options.items;
      if (i && i[e]) return this.type == "list" && (this.selected = i[e]), this.type == "enum" && (t || (this.selected = []), this.selected.push(i[e])), (t = Y.get(this.el.id + "_menu")) && (t.options.selected = this.selected), n(this.el).trigger("input").trigger("change"), this.refresh(), true;
    }
    return false;
  }
  refresh() {
    var _a, _b;
    let e = this.options;
    var t = Date.now(), i = getComputedStyle(this.el);
    if (this.type == "list") {
      if (n(this.el).parent().css("white-space", "nowrap"), this.helpers.prefix && this.helpers.prefix.hide(), !this.helpers.search) return;
      this.selected == null && e.icon ? e.prefix = `
                    <span class="w2ui-icon ${e.icon} "style="cursor: pointer; font-size: 14px;
                        display: inline-block; margin-top: -1px; color: #7F98AD; ${e.iconStyle}">
                    </span>` : e.prefix = "", this.addPrefix();
      let h = n(this.helpers.search_focus);
      var s = n(h[0].previousElementSibling);
      h.css({ outline: "none" }), h.val() === "" ? (h.css("opacity", 0), s.css("opacity", 0), ((_a = this.selected) == null ? void 0 : _a.id) ? (a = this.selected.text, r = this.findItemIndex(e.items, this.selected.id), a != null && n(this.el).val(c.lang(a)).data({ selected: a, selectedIndex: r[0] })) : (this.el.value = "", n(this.el).removeData("selected selectedIndex"))) : (h.css("opacity", 1), s.css("opacity", 1), n(this.el).val(""), setTimeout(() => {
        this.helpers.prefix && this.helpers.prefix.hide(), e.icon ? (h.css("margin-left", "17px"), n(this.helpers.search).find(".w2ui-icon-search").addClass("show-search")) : (h.css("margin-left", "0px"), n(this.helpers.search).find(".w2ui-icon-search").removeClass("show-search"));
      }, 1)), n(this.el).prop("readOnly") || n(this.el).prop("disabled") ? setTimeout(() => {
        this.helpers.prefix && n(this.helpers.prefix).css("opacity", "0.6"), this.helpers.suffix && n(this.helpers.suffix).css("opacity", "0.6");
      }, 1) : setTimeout(() => {
        this.helpers.prefix && n(this.helpers.prefix).css("opacity", "1"), this.helpers.suffix && n(this.helpers.suffix).css("opacity", "1");
      }, 1);
    }
    let l = this.helpers.multi;
    if (["enum", "file"].includes(this.type) && l) {
      let h = "";
      Array.isArray(this.selected) && this.selected.forEach((o, d) => {
        o != null && (h += `
                        <div class="li-item" index="${d}" style="max-width: ${parseInt(e.maxItemWidth)}px; ${o.style || ""}">
                        ${typeof e.renderItem == "function" ? e.renderItem(o, d, `<div class="w2ui-list-remove" index="${d}">&#160;&#160;</div>`) : `
                               ${o.icon ? `<span class="w2ui-icon ${o.icon}"></span>` : ""}
                               <div class="w2ui-list-remove" index="${d}">&#160;&#160;</div>
                               ${(this.type === "enum" ? o.text : o.name) ?? o.id ?? o}
                               ${o.size ? `<span class="file-size"> - ${c.formatSize(o.size)}</span>` : ""}
                            `}
                        </div>`);
      });
      var r, a = l.find(".w2ui-multi-items");
      e.style && l.attr("style", l.attr("style") + ";" + e.style), n(this.el).css("z-index", "-1"), n(this.el).prop("readOnly") || n(this.el).prop("disabled") ? setTimeout(() => {
        l[0].scrollTop = 0, l.addClass("w2ui-readonly").find(".li-item").css("opacity", "0.9").parent().find(".li-search").hide().find("input").prop("readOnly", true).closest(".w2ui-multi-items").find(".w2ui-list-remove").hide();
      }, 1) : setTimeout(() => {
        l.removeClass("w2ui-readonly").find(".li-item").css("opacity", "1").parent().find(".li-search").show().find("input").prop("readOnly", false).closest(".w2ui-multi-items").find(".w2ui-list-remove").show();
      }, 1), 0 < ((_b = this.selected) == null ? void 0 : _b.length) && n(this.el).attr("placeholder", ""), l.find(".w2ui-enum-placeholder").remove(), a.find(".li-item").remove(), h !== "" ? a.prepend(h) : n(this.el).attr("placeholder") != null && l.find("input").val() === "" && (r = c.stripSpaces(`
                    padding-top: ${i["padding-top"]};
                    padding-left: ${i["padding-left"]};
                    box-sizing: ${i["box-sizing"]};
                    line-height: ${i["line-height"]};
                    font-size: ${i["font-size"]};
                    font-family: ${i["font-family"]};
                `), l.prepend(`<div class="w2ui-enum-placeholder" style="${r}">${n(this.el).attr("placeholder")}</div>`)), l.off(".w2item").on("scroll.w2item", (o) => {
        o = this.trigger("scroll", { target: this.el, originalEvent: o }), o.isCancelled !== true && (F.hide(this.el.id + "_preview"), o.finish());
      }).find(".li-item").on("click.w2item", (o) => {
        var d = n(o.target).closest(".li-item"), u = d.attr("index"), p = this.selected[u];
        if (!n(d).hasClass("li-search")) {
          o.stopPropagation();
          let m;
          if (n(o.target).hasClass("w2ui-list-remove")) n(this.el).prop("readOnly") || n(this.el).prop("disabled") || (m = this.trigger("remove", { target: this.el, originalEvent: o, item: p })).isCancelled !== true && (this.selected.splice(u, 1), n(this.el).trigger("input").trigger("change"), n(o.target).remove());
          else if ((m = this.trigger("click", { target: this.el, originalEvent: o.originalEvent, item: p })).isCancelled !== true) {
            let f = p.tooltip;
            if (this.type === "file" && (/image/i.test(p.type) && (f = `
                                    <div class="w2ui-file-preview">
                                        <img src="${p.content ? "data:" + p.type + ";base64," + p.content : ""}"
                                            style="max-width: 300px">
                                    </div>`), f += `
                                <div class="w2ui-file-info">
                                    <div class="file-caption">${c.lang("Name")}:</div>
                                    <div class="file-value">${p.name}</div>
                                    <div class="file-caption">${c.lang("Size")}:</div>
                                    <div class="file-value">${c.formatSize(p.size)}</div>
                                    <div class="file-caption">${c.lang("Type")}:</div>
                                    <div class="file-value file-type">${p.type}</div>
                                    <div class="file-caption">${c.lang("Modified")}:</div>
                                    <div class="file-value">${c.date(p.modified)}</div>
                                </div>`), f) {
              let w = this.el.id + "_preview";
              F.show({ name: w, anchor: d.get(0), html: f, hideOn: ["doc-click"], class: "" }).show((b) => {
                n(`#w2overlay-${w} img`).on("load", function(g) {
                  var y = this.clientWidth, v = this.clientHeight;
                  y < 300 & v < 300 || (v <= y && 300 < y && n(this).css("width", "300px"), y < v && 300 < v && n(this).css("height", "300px"));
                }).on("error", function(g) {
                  this.style.display = "none";
                });
              });
            }
            m.finish();
          }
        }
      }).on("mouseenter.w2item", (o) => {
        var d = n(o.target).closest(".li-item");
        n(d).hasClass("li-search") || (d = this.selected[n(o.target).attr("index")], (o = this.trigger("mouseEnter", { target: this.el, originalEvent: o, item: d })).isCancelled !== true && o.finish());
      }).on("mouseleave.w2item", (o) => {
        var d = n(o.target).closest(".li-item");
        n(d).hasClass("li-search") || (d = this.selected[n(o.target).attr("index")], (o = this.trigger("mouseLeave", { target: this.el, originalEvent: o, item: d })).isCancelled !== true && o.finish());
      }), this.type === "enum" ? this.helpers.multi.find("input").css({ width: "15px" }) : this.helpers.multi.find(".li-search").hide(), this.resize();
    }
    return Date.now() - t;
  }
  resize() {
    var e = this.el.clientWidth, t = getComputedStyle(this.el), r = this.helpers.search, i = this.helpers.multi, s = this.helpers.suffix, l = this.helpers.prefix, r = (r && n(r).css("width", e), i && n(i).css("width", e - parseInt(t["margin-left"], 10) - parseInt(t["margin-right"], 10)), s && this.addSuffix(), l && this.addPrefix(), this.helpers.multi);
    if (["enum", "file"].includes(this.type) && r) {
      n(this.el).css("height", "auto");
      let a = n(r).find(":scope div.w2ui-multi-items").get(0).clientHeight + 5;
      (a = (a = a < 20 ? 20 : a) > this.tmp["max-height"] ? this.tmp["max-height"] : a) < this.tmp["min-height"] && (a = this.tmp["min-height"]), i = c.getSize(this.el, "height") - 2, i > a && (a = i), n(r).css({ height: a + "px", overflow: a == this.tmp["max-height"] ? "auto" : "hidden" }), n(r).css("height", a + "px"), n(this.el).css({ height: a + "px" });
    }
    this.tmp.current_width = e;
  }
  reset() {
    this.tmp != null && (n(this.el).css("height", "auto"), Array("padding-left", "padding-right", "background-color", "border-color").forEach((e) => {
      this.tmp && this.tmp["old-" + e] != null && (n(this.el).css(e, this.tmp["old-" + e]), delete this.tmp["old-" + e]);
    }), clearInterval(this.tmp.sizeTimer)), n(this.el).val(this.clean(n(this.el).val())).removeClass("w2field").removeData("selected selectedIndex").off(".w2field"), Object.keys(this.helpers).forEach((e) => {
      n(this.helpers[e]).remove();
    }), this.helpers = {};
  }
  clean(e) {
    var t;
    return e = typeof e != "number" && (t = this.options, e = String(e).trim(), ["int", "float", "money", "currency", "percent"].includes(this.type)) ? (e = typeof e == "string" ? (e = t.autoFormat && (["money", "currency"].includes(this.type) && (e = String(e).replace(t.moneyRE, "")), this.type === "percent" && (e = String(e).replace(t.percentRE, "")), ["int", "float"].includes(this.type)) ? String(e).replace(t.numberRE, "") : e).replace(/\s+/g, "").replace(new RegExp(t.groupSymbol, "g"), "").replace(t.decimalSymbol, ".") : e) !== "" && c.isFloat(e) ? Number(e) : "" : e;
  }
  format(e) {
    var t = this.options;
    if (t.autoFormat && e !== "") {
      switch (this.type) {
        case "money":
        case "currency":
          (e = c.formatNumber(e, t.currencyPrecision, true)) !== "" && (e = t.currencyPrefix + e + t.currencySuffix);
          break;
        case "percent":
          (e = c.formatNumber(e, t.precision, true)) !== "" && (e += "%");
          break;
        case "float":
          e = c.formatNumber(e, t.precision, true);
          break;
        case "int":
          e = c.formatNumber(e, 0, true);
      }
      var i = parseInt(1e3).toLocaleString(c.settings.locale, { useGrouping: true }).slice(1, 2);
      i !== this.options.groupSymbol && (e = e.replaceAll(i, this.options.groupSymbol));
    }
    return e;
  }
  change(e) {
    if (["int", "float", "money", "currency", "percent"].indexOf(this.type) !== -1) {
      var t = n(this.el).val(), i = this.format(this.clean(n(this.el).val()));
      if (t !== "" && t != i) return n(this.el).val(i), e.stopPropagation(), e.preventDefault(), false;
    }
    if (this.type === "color") {
      let s = n(this.el).val();
      s.substr(0, 3).toLowerCase() !== "rgb" && (s = "#" + s, (t = n(this.el).val().length) !== 8) && t !== 6 && t !== 3 && (s = ""), i = n(this.el).get(0).nextElementSibling, n(i).find("div").css("background-color", s), n(this.el).hasClass("has-focus") && this.updateOverlay();
    }
    if (["list", "enum", "file"].indexOf(this.type) !== -1 && this.refresh(), ["date", "time", "datetime"].indexOf(this.type) !== -1) {
      let s = parseInt(this.el.value);
      c.isInt(this.el.value) && 3e3 < s && (this.type === "time" && (s = c.formatTime(new Date(s), this.options.format)), this.type === "date" && (s = c.formatDate(new Date(s), this.options.format)), this.type === "datetime" && (s = c.formatDateTime(new Date(s), this.options.format)), n(this.el).val(s).trigger("input").trigger("change"));
    }
  }
  click(e) {
    ["list", "combo", "enum"].includes(this.type) && (n(this.el).hasClass("has-focus") || this.focus(e), this.type == "combo" && this.updateOverlay(), this.type == "list") && (this.updateOverlay(), e.stopPropagation()), ["date", "time", "datetime", "color"].includes(this.type) && this.updateOverlay();
  }
  focus(e) {
    if (this.type == "list" && document.activeElement == this.el) this.helpers.search_focus.focus();
    else {
      if (["color", "date", "time", "datetime"].indexOf(this.type) !== -1) {
        if (n(this.el).prop("readOnly") || n(this.el).prop("disabled")) return;
        this.updateOverlay();
      }
      if (["list", "combo", "enum"].indexOf(this.type) !== -1) {
        if (n(this.el).prop("readOnly") || n(this.el).prop("disabled")) return void n(this.el).addClass("has-focus");
        typeof this.options._items_fun == "function" && (this.options.items = c.normMenu.call(this, this.options._items_fun)), this.helpers.search && ((t = this.helpers.search_focus).value = "", t.select()), this.type == "enum" && (t = n(this.el.previousElementSibling).find(".li-search input").get(0), document.activeElement !== t) && t.focus(), this.resize(), e.showMenu === false || this.options.openOnFocus === false && !n(this.el).hasClass("has-focus") || setTimeout(() => {
          this.updateOverlay();
        }, 100);
      }
      var t;
      this.type == "file" && (t = n(this.el).get(0).previousElementSibling, n(t).addClass("has-focus")), n(this.el).addClass("has-focus");
    }
  }
  blur(e) {
    var _a;
    var t, i = n(this.el).val().trim();
    if (n(this.el).removeClass("has-focus"), ["int", "float", "money", "currency", "percent"].includes(this.type) && i !== "") {
      let s = i, l = "";
      this.isStrValid(i) ? (t = this.clean(i), this.options.min != null && t < this.options.min && (s = this.options.min, l = "Should be >= " + this.options.min), this.options.max != null && t > this.options.max && (s = this.options.max, l = "Should be <= " + this.options.max)) : s = "", this.options.autoCorrect && (n(this.el).val(s).trigger("input").trigger("change"), l) && (F.show({ name: this.el.id + "_error", anchor: this.el, html: l }), setTimeout(() => {
        F.hide(this.el.id + "_error");
      }, 3e3));
    }
    ["date", "time", "datetime"].includes(this.type) && this.options.autoCorrect && i !== "" && (t = this.type == "date" ? c.isDate : this.type == "time" ? c.isTime : c.isDateTime, re.inRange(this.el.value, this.options) && t.bind(c)(this.el.value, this.options.format) || n(this.el).val("").trigger("input").trigger("change")), this.type === "enum" && n(this.helpers.multi).find("input").val("").css("width", "15px"), this.type == "file" && (i = this.el.previousElementSibling, n(i).removeClass("has-focus")), this.type === "list" && (this.el.value = ((_a = this.selected) == null ? void 0 : _a.text) ?? "");
  }
  keyDown(e, l) {
    var i, s = this.options, l = e.keyCode || l && l.keyCode;
    let r = false, a, h, o, d, u, p;
    if (["int", "float", "money", "currency", "percent", "hex", "bin", "color", "alphanumeric"].includes(this.type) && !(e.metaKey || e.ctrlKey || e.altKey || this.isStrValid(e.key ?? "1", true) || [9, 8, 13, 27, 37, 38, 39, 40, 46].includes(e.keyCode))) return e.preventDefault(), e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true, false;
    if (["int", "float", "money", "currency", "percent"].includes(this.type)) {
      if (!s.keyboard || n(this.el).prop("readOnly") || n(this.el).prop("disabled")) return;
      switch (a = parseFloat(n(this.el).val().replace(s.moneyRE, "")) || 0, h = s.step, (e.ctrlKey || e.metaKey) && (h = 10 * s.step), l) {
        case 38:
          e.shiftKey || (u = a + h <= s.max || s.max == null ? Number((a + h).toFixed(12)) : s.max, n(this.el).val(u).trigger("input").trigger("change"), r = true);
          break;
        case 40:
          e.shiftKey || (u = a - h >= s.min || s.min == null ? Number((a - h).toFixed(12)) : s.min, n(this.el).val(u).trigger("input").trigger("change"), r = true);
      }
      r && (e.preventDefault(), this.moveCaret2end());
    }
    if (["date", "datetime"].includes(this.type)) {
      if (!s.keyboard || n(this.el).prop("readOnly") || n(this.el).prop("disabled")) return;
      var m = (this.type == "date" ? c.isDate : c.isDateTime).bind(c), f = (this.type == "date" ? c.formatDate : c.formatDateTime).bind(c);
      switch (o = 864e5, h = 1, (e.ctrlKey || e.metaKey) && (h = 10), (d = m(n(this.el).val(), s.format, true)) || (d = /* @__PURE__ */ new Date(), o = 0), l) {
        case 38:
          e.shiftKey || (h == 10 ? d.setMonth(d.getMonth() + 1) : d.setTime(d.getTime() + o), p = f(d.getTime(), s.format), n(this.el).val(p).trigger("input").trigger("change"), r = true);
          break;
        case 40:
          e.shiftKey || (h == 10 ? d.setMonth(d.getMonth() - 1) : d.setTime(d.getTime() - o), p = f(d.getTime(), s.format), n(this.el).val(p).trigger("input").trigger("change"), r = true);
      }
      r && (e.preventDefault(), this.moveCaret2end(), this.updateOverlay());
    }
    if (this.type === "time") {
      if (!s.keyboard || n(this.el).prop("readOnly") || n(this.el).prop("disabled")) return;
      h = e.ctrlKey || e.metaKey ? 60 : 1, a = n(this.el).val();
      let w = re.str2min(a) || re.str2min((/* @__PURE__ */ new Date()).getHours() + ":" + ((/* @__PURE__ */ new Date()).getMinutes() - 1));
      switch (l) {
        case 38:
          e.shiftKey || (w += h, r = true);
          break;
        case 40:
          e.shiftKey || (w -= h, r = true);
      }
      r && (e.preventDefault(), n(this.el).val(re.min2str(w)).trigger("input").trigger("change"), this.moveCaret2end());
    }
    if (["list", "enum"].includes(this.type)) switch (l) {
      case 8:
      case 46:
        this.type == "list" ? n(this.helpers.search_focus).val() == "" && (this.selected = null, Y.hide(this.el.id + "_menu"), n(this.el).val("").trigger("input").trigger("change")) : n(this.helpers.multi).find("input").val() == "" && (Y.hide(this.el.id + "_menu"), this.selected.pop(), (i = Y.get(this.el.id + "_menu")) && (i.options.selected = this.selected), this.refresh());
        break;
      case 9:
      case 16:
        break;
      case 27:
        Y.hide(this.el.id + "_menu"), this.refresh();
    }
  }
  keyUp(e) {
    var _a, _b;
    if (this.type == "list") {
      let s = n(this.helpers.search_focus);
      s.val() !== "" ? n(this.el).attr("placeholder", "") : n(this.el).attr("placeholder", this.tmp.pholder), e.keyCode == 13 && setTimeout(() => {
        s.val(""), Y.hide(this.el.id + "_menu"), this.refresh();
      }, 1), [38, 40].includes(e.keyCode) && !this.tmp.overlay.overlay.displayed && this.updateOverlay(), this.refresh();
    }
    var t, i;
    this.type == "combo" && this.updateOverlay(), this.type == "enum" && (t = this.helpers.multi.find("input"), i = getComputedStyle(t.get(0)), i = c.getStrWidth(t.val(), `font-family: ${i["font-family"]}; font-size: ${i["font-size"]};`), t.css({ width: i + 15 + "px" }), this.resize(), [38, 40].includes(e.keyCode)) && !((_b = (_a = this.tmp.overlay) == null ? void 0 : _a.overlay) == null ? void 0 : _b.displayed) && this.updateOverlay();
  }
  findItemIndex(e, t, i) {
    let s = [];
    var l;
    return i = i || [], ["list", "combo", "enum"].includes(this.type) && this.options.url && (l = Y.get(this.el.id + "_menu")) && (e = l.options.items, this.options.items = e), e.forEach((r, a) => {
      r.id === t && (s = i.concat([a]), this.options.index = [a]), s.length == 0 && r.items && 0 < r.items.length && (i.push(a), s = this.findItemIndex(r.items, t, i), i.pop());
    }), s;
  }
  updateOverlay(e) {
    let t = this.options;
    if (this.type === "color") {
      if (n(this.el).prop("readOnly") || n(this.el).prop("disabled")) return;
      Ne.show(c.extend({ name: this.el.id + "_color", anchor: this.el, transparent: t.transparent, advanced: t.advanced, color: this.el.value, liveUpdate: true }, this.options)).select((s) => {
        s = s.detail.color, n(this.el).val(s).trigger("input").trigger("change");
      }).liveUpdate((s) => {
        s = s.detail.color, n(this.helpers.suffix).find(":scope > div").css("background-color", "#" + s);
      });
    }
    if (["list", "combo", "enum"].includes(this.type)) {
      var i;
      this.el;
      let s = this.el;
      this.type === "enum" && (i = this.helpers.multi.get(0), s = n(i).find("input").get(0)), this.type === "list" && (i = this.selected, c.isPlainObject(i) && 0 < Object.keys(i).length && 0 < (i = this.findItemIndex(t.items, i.id)).length && (t.index = i), s = this.helpers.search_focus), !n(this.el).hasClass("has-focus") || this.el.readOnly || this.el.disabled || (i = c.extend({}, t, { name: this.el.id + "_menu", anchor: s, selected: this.selected, search: false, render: t.renderDrop, anchorClass: "", offsetY: 5, maxHeight: t.maxDropHeight, maxWidth: t.maxDropWidth, minWidth: t.minDropWidth }), this.tmp.overlay = Y.show(i).select((l) => {
        var _a;
        var r, a;
        ["list", "combo"].includes(this.type) ? (this.selected = l.detail.item, n(s).val(""), n(this.el).val(this.selected.text).trigger("input").trigger("change"), this.focus({ showMenu: false })) : (a = this.selected, (r = (_a = l.detail) == null ? void 0 : _a.item) && (l = this.trigger("add", { target: this.el, item: r, originalEvent: l })).isCancelled !== true && (a.length >= t.max && 0 < t.max && a.pop(), delete r.hidden, a.push(r), n(this.el).trigger("input").trigger("change"), n(this.helpers.multi).find("input").val(""), (a = Y.get(this.el.id + "_menu")) && (a.options.selected = this.selected), l.finish()));
      }));
    }
    !["date", "time", "datetime"].includes(this.type) || n(this.el).prop("readOnly") || n(this.el).prop("disabled") || re.show(c.extend({ name: this.el.id + "_date", anchor: this.el, value: this.el.value }, this.options)).select((s) => {
      s = s.detail.date, s != null && n(this.el).val(s).trigger("input").trigger("change");
    });
  }
  isStrValid(e, t) {
    let i = true;
    switch (this.type) {
      case "int":
        i = !(!t || !["-", this.options.groupSymbol].includes(e)) || c.isInt(e.replace(this.options.numberRE, ""));
        break;
      case "percent":
        e = e.replace(/%/g, "");
      case "float":
        i = !(!t || !["-", "", this.options.decimalSymbol, this.options.groupSymbol].includes(e)) || c.isFloat(e.replace(this.options.numberRE, ""));
        break;
      case "money":
      case "currency":
        i = !(!t || !["-", this.options.decimalSymbol, this.options.groupSymbol, this.options.currencyPrefix, this.options.currencySuffix].includes(e)) || c.isFloat(e.replace(this.options.moneyRE, ""));
        break;
      case "bin":
        i = c.isBin(e);
        break;
      case "color":
      case "hex":
        i = c.isHex(e);
        break;
      case "alphanumeric":
        i = c.isAlphaNumeric(e);
    }
    return i;
  }
  addPrefix() {
    var e, t;
    this.options.prefix && (t = getComputedStyle(this.el), this.tmp["old-padding-left"] == null && (this.tmp["old-padding-left"] = t["padding-left"]), this.helpers.prefix && n(this.helpers.prefix).remove(), n(this.el).before(`<div class="w2ui-field-helper">${this.options.prefix}</div>`), e = n(this.el).get(0).previousElementSibling, n(e).css({ color: t.color, "font-family": t["font-family"], "font-size": t["font-size"], height: this.el.clientHeight + "px", "padding-top": t["padding-top"], "padding-bottom": t["padding-bottom"], "padding-left": this.tmp["old-padding-left"], "padding-right": 0, "margin-top": parseInt(t["margin-top"], 10) + 2 + "px", "margin-bottom": parseInt(t["margin-bottom"], 10) + 1 + "px", "margin-left": t["margin-left"], "margin-right": 0, "z-index": 1 }), n(this.el).css("padding-left", e.clientWidth + "px !important"), this.helpers.prefix = e);
  }
  addSuffix() {
    if (this.options.suffix || this.options.arrow) {
      let i, s = this;
      var e = getComputedStyle(this.el), t = (this.tmp["old-padding-right"] == null && (this.tmp["old-padding-right"] = e["padding-right"]), parseInt(e["padding-right"] || 0));
      this.options.arrow && (this.helpers.arrow && n(this.helpers.arrow).remove(), n(this.el).after('<div class="w2ui-field-helper" style="border: 1px solid transparent">&#160;    <div class="w2ui-field-up" type="up">        <div class="arrow-up" type="up"></div>    </div>    <div class="w2ui-field-down" type="down">        <div class="arrow-down" type="down"></div>    </div></div>'), i = n(this.el).get(0).nextElementSibling, n(i).css({ color: e.color, "font-family": e["font-family"], "font-size": e["font-size"], height: this.el.clientHeight + "px", padding: 0, "margin-top": parseInt(e["margin-top"], 10) + 1 + "px", "margin-bottom": 0, "border-left": "1px solid silver", width: "16px", transform: "translateX(-100%)" }).on("mousedown", function(l) {
        n(l.target).hasClass("arrow-up") && s.keyDown(l, { keyCode: 38 }), n(l.target).hasClass("arrow-down") && s.keyDown(l, { keyCode: 40 });
      }), t += i.clientWidth, n(this.el).css("padding-right", t + "px !important"), this.helpers.arrow = i), this.options.suffix !== "" && (this.helpers.suffix && n(this.helpers.suffix).remove(), n(this.el).after(`<div class="w2ui-field-helper">${this.options.suffix}</div>`), i = n(this.el).get(0).nextElementSibling, n(i).css({ color: e.color, "font-family": e["font-family"], "font-size": e["font-size"], height: this.el.clientHeight + "px", "padding-top": e["padding-top"], "padding-bottom": e["padding-bottom"], "padding-left": 0, "padding-right": e["padding-right"], "margin-top": parseInt(e["margin-top"], 10) + 2 + "px", "margin-bottom": parseInt(e["margin-bottom"], 10) + 1 + "px", transform: "translateX(-100%)" }), n(this.el).css("padding-right", i.clientWidth + "px !important"), this.helpers.suffix = i);
    }
  }
  addSearch() {
    if (this.type === "list") {
      this.helpers.search && n(this.helpers.search).remove();
      let i = parseInt(n(this.el).attr("tabIndex")), s = (isNaN(i) || i === -1 || (this.tmp["old-tabIndex"] = i), (i = this.tmp["old-tabIndex"] ? this.tmp["old-tabIndex"] : i) != null && !isNaN(i) || (i = 0), "");
      var e = `
            <div class="w2ui-field-helper">
                <span class="w2ui-icon w2ui-icon-search"></span>
                <input ${s = n(this.el).attr("id") != null ? 'id="' + n(this.el).attr("id") + '_search"' : s} type="text" tabIndex="${i}" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"/>
            </div>`, e = (n(this.el).attr("tabindex", -1).before(e), n(this.el).get(0).previousElementSibling), t = (this.helpers.search = e, this.helpers.search_focus = n(e).find("input").get(0), getComputedStyle(this.el));
      n(e).css({ width: this.el.clientWidth + "px", "margin-top": t["margin-top"], "margin-left": t["margin-left"], "margin-bottom": t["margin-bottom"], "margin-right": t["margin-right"] }).find("input").css({ cursor: "default", width: "100%", opacity: 1, padding: t.padding, margin: t.margin, border: "1px solid transparent", "background-color": "transparent" }), n(e).find("input").off(".helper").on("focus.helper", (l) => {
        n(l.target).val(""), this.tmp.pholder = n(this.el).attr("placeholder") ?? "", this.focus(l), l.stopPropagation();
      }).on("blur.helper", (l) => {
        n(l.target).val(""), this.tmp.pholder != null && n(this.el).attr("placeholder", this.tmp.pholder), this.blur(l), l.stopPropagation();
      }).on("keydown.helper", (l) => {
        this.keyDown(l);
      }).on("keyup.helper", (l) => {
        this.keyUp(l);
      }), n(e).on("click", (l) => {
        n(l.target).find("input").focus();
      });
    }
  }
  addMultiSearch() {
    if (["enum", "file"].includes(this.type)) {
      n(this.helpers.multi).remove();
      let l = "";
      var e, t, i = getComputedStyle(this.el), s = c.stripSpaces(`
            margin-top: 0px;
            margin-bottom: 0px;
            margin-left: ${i["margin-left"]};
            margin-right: ${i["margin-right"]};
            width: ${c.getSize(this.el, "width") - parseInt(i["margin-left"], 10) - parseInt(i["margin-right"], 10)}px;
        `);
      this.tmp["min-height"] == null && (e = this.tmp["min-height"] = parseInt((i["min-height"] != "none" ? i["min-height"] : 0) || 0), t = parseInt(i.height), this.tmp["min-height"] = Math.max(e, t)), this.tmp["max-height"] == null && i["max-height"] != "none" && (this.tmp["max-height"] = parseInt(i["max-height"]));
      let r = "", a = (n(this.el).attr("id") != null && (r = `id="${n(this.el).attr("id")}_search"`), parseInt(n(this.el).attr("tabIndex"))), h = (isNaN(a) || a === -1 || (this.tmp["old-tabIndex"] = a), (a = this.tmp["old-tabIndex"] ? this.tmp["old-tabIndex"] : a) != null && !isNaN(a) || (a = 0), this.type === "enum" && (l = `
            <div class="w2ui-field-helper w2ui-list" style="${s}">
                <div class="w2ui-multi-items">
                    <div class="li-search">
                        <input ${r} type="text" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                            tabindex="${a}"
                            ${n(this.el).prop("readOnly") ? "readonly" : ""}
                            ${n(this.el).prop("disabled") ? "disabled" : ""}>
                    </div>
                </div>
            </div>`), this.type === "file" && (l = `
            <div class="w2ui-field-helper w2ui-list" style="${s}">
                <div class="w2ui-multi-file">
                    <input name="attachment" class="file-input" type="file" tabindex="-1"'
                        style="width: 100%; height: 100%; opacity: 0" title=""
                        ${this.options.max !== 1 ? "multiple" : ""}
                        ${n(this.el).prop("readOnly") || n(this.el).prop("disabled") ? "disabled" : ""}
                        ${n(this.el).attr("accept") ? ' accept="' + n(this.el).attr("accept") + '"' : ""}>
                </div>
                <div class="w2ui-multi-items">
                    <div class="li-search" style="display: none">
                        <input ${r} type="text" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                            tabindex="${a}"
                            ${n(this.el).prop("readOnly") ? "readonly" : ""}
                            ${n(this.el).prop("disabled") ? "disabled" : ""}>
                    </div>
                </div>
            </div>`), this.tmp["old-background-color"] = i["background-color"], this.tmp["old-border-color"] = i["border-color"], n(this.el).before(l).css({ "border-color": "transparent", "background-color": "transparent" }), n(this.el.previousElementSibling));
      this.helpers.multi = h, n(this.el).attr("tabindex", -1), h.on("click", (o) => {
        this.focus(o);
      }), h.find("input:not(.file-input)").on("click", (o) => {
        this.click(o);
      }).on("focus", (o) => {
        this.focus(o);
      }).on("blur", (o) => {
        this.blur(o);
      }).on("keydown", (o) => {
        this.keyDown(o);
      }).on("keyup", (o) => {
        this.keyUp(o);
      }), this.type === "file" && h.find("input.file-input").off(".drag").on("click.drag", (o) => {
        o.stopPropagation(), n(this.el).prop("readOnly") || n(this.el).prop("disabled") || this.focus(o);
      }).on("dragenter.drag", (o) => {
        n(this.el).prop("readOnly") || n(this.el).prop("disabled") || h.addClass("w2ui-file-dragover");
      }).on("dragleave.drag", (o) => {
        n(this.el).prop("readOnly") || n(this.el).prop("disabled") || h.removeClass("w2ui-file-dragover");
      }).on("drop.drag", (o) => {
        n(this.el).prop("readOnly") || n(this.el).prop("disabled") || (h.removeClass("w2ui-file-dragover"), Array.from(o.dataTransfer.files).forEach((d) => {
          this.addFile(d);
        }), this.focus(o), o.preventDefault(), o.stopPropagation());
      }).on("dragover.drag", (o) => {
        o.preventDefault(), o.stopPropagation();
      }).on("change.drag", (o) => {
        o.target.files !== void 0 && Array.from(o.target.files).forEach((d) => {
          this.addFile(d);
        }), this.focus(o);
      }), this.refresh();
    }
  }
  addFile(e) {
    var t = this.options, i = this.selected;
    let s = { name: e.name, type: e.type, modified: e.lastModifiedDate, size: e.size, content: null, file: e }, l = 0, r = 0, a = [], h = (Array.isArray(i) && i.forEach((o) => {
      o.name == e.name && o.size == e.size && a.push(c.lang('The file "${name}" (${size}) is already added.', { name: e.name, size: c.formatSize(e.size) })), l += o.size, r++;
    }), t.maxFileSize !== 0 && s.size > t.maxFileSize && a.push(c.lang("Maximum file size is ${size}", { size: c.formatSize(t.maxFileSize) })), t.maxSize !== 0 && l + s.size > t.maxSize && a.push(c.lang("Maximum total size is ${size}", { size: c.formatSize(t.maxSize) })), t.max !== 0 && r >= t.max && a.push(c.lang("Maximum number of files is ${count}", { count: t.max })), this.trigger("add", { target: this.el, file: s, total: r, totalSize: l, errors: a }));
    if (h.isCancelled !== true) if (t.silent !== true && 0 < a.length) F.show({ anchor: this.el, html: "Errors: " + a.join("<br>") }), console.log("ERRORS (while adding files): ", a);
    else if (i.push(s), typeof FileReader < "u" && t.readContent === true) {
      i = new FileReader();
      let o = this;
      i.onload = function(u) {
        var u = u.target.result, p = u.indexOf(",");
        s.content = u.substr(p + 1), o.refresh(), n(o.el).trigger("input").trigger("change"), h.finish();
      }, i.readAsDataURL(e);
    } else this.refresh(), n(this.el).trigger("input").trigger("change"), h.finish();
  }
  moveCaret2end() {
    setTimeout(() => {
      this.el.setSelectionRange(this.el.value.length, this.el.value.length);
    }, 0);
  }
}
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const Ce = globalThis, De = (D) => D, we = Ce.trustedTypes, Ie = we ? we.createPolicy("lit-html", { createHTML: (D) => D }) : void 0, Le = "$lit$", J = `lit$${Math.random().toFixed(9).slice(2)}$`, He = "?" + J, ot = `<${He}>`, te = document, ne = () => te.createComment(""), oe = (D) => D === null || typeof D != "object" && typeof D != "function", ke = Array.isArray, ht = (D) => ke(D) || typeof (D == null ? void 0 : D[Symbol.iterator]) == "function", xe = `[ 	
\f\r]`, ae = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Oe = /-->/g, Re = />/g, Q = RegExp(`>|${xe}(?:([^\\s"'>=/]+)(${xe}*=${xe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ze = /'/g, Me = /"/g, je = /^(?:script|style|textarea|title)$/i, dt = (D) => (e, ...t) => ({ _$litType$: D, strings: e, values: t }), ge = dt(1), he = Symbol.for("lit-noChange"), U = Symbol.for("lit-nothing"), Fe = /* @__PURE__ */ new WeakMap(), ee = te.createTreeWalker(te, 129);
function Pe(D, e) {
  if (!ke(D) || !D.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ie !== void 0 ? Ie.createHTML(e) : e;
}
const ct = (D, e) => {
  const t = D.length - 1, i = [];
  let s, l = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = ae;
  for (let a = 0; a < t; a++) {
    const h = D[a];
    let o, d, u = -1, p = 0;
    for (; p < h.length && (r.lastIndex = p, d = r.exec(h), d !== null); ) p = r.lastIndex, r === ae ? d[1] === "!--" ? r = Oe : d[1] !== void 0 ? r = Re : d[2] !== void 0 ? (je.test(d[2]) && (s = RegExp("</" + d[2], "g")), r = Q) : d[3] !== void 0 && (r = Q) : r === Q ? d[0] === ">" ? (r = s ?? ae, u = -1) : d[1] === void 0 ? u = -2 : (u = r.lastIndex - d[2].length, o = d[1], r = d[3] === void 0 ? Q : d[3] === '"' ? Me : ze) : r === Me || r === ze ? r = Q : r === Oe || r === Re ? r = ae : (r = Q, s = void 0);
    const m = r === Q && D[a + 1].startsWith("/>") ? " " : "";
    l += r === ae ? h + ot : u >= 0 ? (i.push(o), h.slice(0, u) + Le + h.slice(u) + J + m) : h + J + (u === -2 ? a : m);
  }
  return [Pe(D, l + (D[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class de {
  constructor({ strings: e, _$litType$: t }, i) {
    let s;
    this.parts = [];
    let l = 0, r = 0;
    const a = e.length - 1, h = this.parts, [o, d] = ct(e, t);
    if (this.el = de.createElement(o, i), ee.currentNode = this.el.content, t === 2 || t === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (s = ee.nextNode()) !== null && h.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const u of s.getAttributeNames()) if (u.endsWith(Le)) {
          const p = d[r++], m = s.getAttribute(u).split(J), f = /([.?@])?(.*)/.exec(p);
          h.push({ type: 1, index: l, name: f[2], strings: m, ctor: f[1] === "." ? pt : f[1] === "?" ? ft : f[1] === "@" ? mt : be }), s.removeAttribute(u);
        } else u.startsWith(J) && (h.push({ type: 6, index: l }), s.removeAttribute(u));
        if (je.test(s.tagName)) {
          const u = s.textContent.split(J), p = u.length - 1;
          if (p > 0) {
            s.textContent = we ? we.emptyScript : "";
            for (let m = 0; m < p; m++) s.append(u[m], ne()), ee.nextNode(), h.push({ type: 2, index: ++l });
            s.append(u[p], ne());
          }
        }
      } else if (s.nodeType === 8) if (s.data === He) h.push({ type: 2, index: l });
      else {
        let u = -1;
        for (; (u = s.data.indexOf(J, u + 1)) !== -1; ) h.push({ type: 7, index: l }), u += J.length - 1;
      }
      l++;
    }
  }
  static createElement(e, t) {
    const i = te.createElement("template");
    return i.innerHTML = e, i;
  }
}
function se(D, e, t = D, i) {
  var _a, _b;
  if (e === he) return e;
  let s = i !== void 0 ? (_a = t._$Co) == null ? void 0 : _a[i] : t._$Cl;
  const l = oe(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== l && ((_b = s == null ? void 0 : s._$AO) == null ? void 0 : _b.call(s, false), l === void 0 ? s = void 0 : (s = new l(D), s._$AT(D, t, i)), i !== void 0 ? (t._$Co ?? (t._$Co = []))[i] = s : t._$Cl = s), s !== void 0 && (e = se(D, s._$AS(D, e.values), s, i)), e;
}
class ut {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? te).importNode(t, true);
    ee.currentNode = s;
    let l = ee.nextNode(), r = 0, a = 0, h = i[0];
    for (; h !== void 0; ) {
      if (r === h.index) {
        let o;
        h.type === 2 ? o = new ce(l, l.nextSibling, this, e) : h.type === 1 ? o = new h.ctor(l, h.name, h.strings, this, e) : h.type === 6 && (o = new gt(l, this, e)), this._$AV.push(o), h = i[++a];
      }
      r !== (h == null ? void 0 : h.index) && (l = ee.nextNode(), r++);
    }
    return ee.currentNode = te, s;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class ce {
  get _$AU() {
    var _a;
    return ((_a = this._$AM) == null ? void 0 : _a._$AU) ?? this._$Cv;
  }
  constructor(e, t, i, s) {
    this.type = 2, this._$AH = U, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? true;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = se(this, e, t), oe(e) ? e === U || e == null || e === "" ? (this._$AH !== U && this._$AR(), this._$AH = U) : e !== this._$AH && e !== he && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ht(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== U && oe(this._$AH) ? this._$AA.nextSibling.data = e : this.T(te.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var _a;
    const { values: t, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = de.createElement(Pe(i.h, i.h[0]), this.options)), i);
    if (((_a = this._$AH) == null ? void 0 : _a._$AD) === s) this._$AH.p(t);
    else {
      const l = new ut(s, this), r = l.u(this.options);
      l.p(t), this.T(r), this._$AH = l;
    }
  }
  _$AC(e) {
    let t = Fe.get(e.strings);
    return t === void 0 && Fe.set(e.strings, t = new de(e)), t;
  }
  k(e) {
    ke(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, s = 0;
    for (const l of e) s === t.length ? t.push(i = new ce(this.O(ne()), this.O(ne()), this, this.options)) : i = t[s], i._$AI(l), s++;
    s < t.length && (this._$AR(i && i._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var _a;
    for ((_a = this._$AP) == null ? void 0 : _a.call(this, false, true, t); e !== this._$AB; ) {
      const i = De(e).nextSibling;
      De(e).remove(), e = i;
    }
  }
  setConnected(e) {
    var _a;
    this._$AM === void 0 && (this._$Cv = e, (_a = this._$AP) == null ? void 0 : _a.call(this, e));
  }
}
class be {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, s, l) {
    this.type = 1, this._$AH = U, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = l, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = U;
  }
  _$AI(e, t = this, i, s) {
    const l = this.strings;
    let r = false;
    if (l === void 0) e = se(this, e, t, 0), r = !oe(e) || e !== this._$AH && e !== he, r && (this._$AH = e);
    else {
      const a = e;
      let h, o;
      for (e = l[0], h = 0; h < l.length - 1; h++) o = se(this, a[i + h], t, h), o === he && (o = this._$AH[h]), r || (r = !oe(o) || o !== this._$AH[h]), o === U ? e = U : e !== U && (e += (o ?? "") + l[h + 1]), this._$AH[h] = o;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === U ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class pt extends be {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === U ? void 0 : e;
  }
}
class ft extends be {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== U);
  }
}
class mt extends be {
  constructor(e, t, i, s, l) {
    super(e, t, i, s, l), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = se(this, e, t, 0) ?? U) === he) return;
    const i = this._$AH, s = e === U && i !== U || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, l = e !== U && (i === U || s);
    s && this.element.removeEventListener(this.name, this, i), l && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var _a;
    typeof this._$AH == "function" ? this._$AH.call(((_a = this.options) == null ? void 0 : _a.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class gt {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    se(this, e);
  }
}
const wt = Ce.litHtmlPolyfillSupport;
wt == null ? void 0 : wt(de, ce), (Ce.litHtmlVersions ?? (Ce.litHtmlVersions = [])).push("3.3.2");
const bt = (D, e, t) => {
  const i = e;
  let s = i._$litPart$;
  return s === void 0 && (i._$litPart$ = s = new ce(e.insertBefore(ne(), null), null, void 0, {})), s._$AI(D), s;
};
function kt({ buttons: D, clickedButton: e, author: t, sourceCode: i }) {
  const s = document.createElement("div");
  function l() {
    return qe() === "dark" ? "\u2600" : "\u263E";
  }
  const r = ge`
    <div class="buttons-container">
      <button class="btn btn-icon" @click=${o}>
        ${vt()}
      </button>
      ${D == null ? void 0 : D.map((d) => ge`<button class="btn btn-text" @click=${a}>
            ${d}
          </button>`)}
      <button class="btn btn-text btn-theme" @click=${h} title="Toggle light/dark theme">
        ${l()}
      </button>
    </div>

    <div id="dropdown-menu" style="display: none;">
      <a
        href="${i || "https://github.com/GiorgioBurbanelli89/awatif-workspace"}"
        class="dropdown-link"
        >Hekatan Struct Lineal — Source Code</a
      >
      ${t ? ge`<a href="${t}" class="dropdown-link">Contact Author</a>` : ""}
      <a href="https://github.com/madil4/awatif/tree/v2.0.0" class="dropdown-link"
        >Based on awatif v2.0.0</a
      >
    </div>
  `;
  s.id = "toolbar", bt(r, s), _e((d) => {
    const u = s.querySelector(".btn-theme");
    u && (u.textContent = d === "dark" ? "\u2600" : "\u263E");
  });
  function a(d) {
    const u = d.target;
    e.val = "", setTimeout(() => e.val = u.innerText);
  }
  function h() {
    Ge();
  }
  function o(d) {
    const u = document.getElementById("dropdown-menu");
    u.style.display = u.style.display === "block" ? "none" : "block";
  }
  return s;
}
function vt() {
  return ge`<img src="${"/hekatan-struct-lineal/"}img/hekatan-lockup.png" alt="Hekatan Struct"
    style="height:28px;width:auto;border-radius:6px;display:block;">`;
}
export {
  U as A,
  bt as D,
  _t as a,
  nt as b,
  ge as c,
  xt as e,
  kt as g,
  Ct as w
};
