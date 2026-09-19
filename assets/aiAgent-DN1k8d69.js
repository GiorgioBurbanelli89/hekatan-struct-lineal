var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { u as J, r as ft, _ as gt, L as bt, B as Fe, b as vt, f as yt, D as wt, M as xt, v as Ce, F as ke, a4 as Pe, a5 as _t, a3 as Ct } from "./theme-C-zoknmI.js";
const kt = new J(16746496), $t = new J(52428), Ve = new J(52292), Ke = new J(3377407), Ge = new J(16763904);
function Je(x, e) {
  const t = Math.abs(e[0] - x[0]), s = Math.abs(e[1] - x[1]), i = Math.abs(e[2] - x[2]);
  return i > t && i > s || s > t && s > i;
}
function St(x, e, t, s) {
  const i = [e[0] - x[0], e[1] - x[1], e[2] - x[2]], a = [s[0] - x[0], s[1] - x[1], s[2] - x[2]], r = i[1] * a[2] - i[2] * a[1], l = i[2] * a[0] - i[0] * a[2], h = i[0] * a[1] - i[1] * a[0], o = Math.sqrt(r * r + l * l + h * h);
  return o < 1e-12 ? false : Math.abs(h / o) < 0.5;
}
function $e(x) {
  return x <= 1e-3;
}
function Tt(x, e, t, s, i, a, r = 8) {
  const l = (A, O) => {
    const z = O ?? [0, 0, 0];
    return [A[0] + (z[0] || 0) * i, A[1] + (z[1] || 0) * i, A[2] + (z[2] || 0) * a];
  }, h = l(x, t), o = l(e, s), c = t && t.length >= 6 ? [t[3], t[4], t[5]] : null, d = s && s.length >= 6 ? [s[3], s[4], s[5]] : null;
  if (!c && !d) return [h, o];
  const p = [e[0] - x[0], e[1] - x[1], e[2] - x[2]], f = Math.hypot(p[0], p[1], p[2]);
  if (f < 1e-9) return [h, o];
  p[0] /= f, p[1] /= f, p[2] /= f;
  const m = Math.abs(p[2]) > 0.98 ? [0, 1, 0] : [0, 0, 1], b = (A, O) => [A[1] * O[2] - A[2] * O[1], A[2] * O[0] - A[0] * O[2], A[0] * O[1] - A[1] * O[0]];
  let v = b(m, p);
  const g = Math.hypot(v[0], v[1], v[2]) || 1;
  v = [v[0] / g, v[1] / g, v[2] / g];
  const y = b(p, v), w = (A, O) => A[0] * O[0] + A[1] * O[1] + A[2] * O[2], C = (A) => {
    const O = A ?? [0, 0, 0];
    return [(O[0] || 0) * i, (O[1] || 0) * i, (O[2] || 0) * a];
  }, $ = C(t), I = C(s), E = w($, v), T = w(I, v), R = w($, y), k = w(I, y), _ = c ? w(c, y) * i : 0, S = d ? w(d, y) * i : 0, D = c ? w(c, v) * i : 0, N = d ? w(d, v) * i : 0, H = w($, p), U = w(I, p), P = [];
  for (let A = 0; A <= r; A++) {
    const O = A / r, z = 1 - 3 * O * O + 2 * O * O * O, M = f * (O - 2 * O * O + O * O * O), G = 3 * O * O - 2 * O * O * O, Y = f * (-O * O + O * O * O), V = z * E + M * _ + G * T + Y * S, X = z * R - M * D + G * k - Y * N, Z = H + (U - H) * O, me = [x[0] + p[0] * (O * f + Z), x[1] + p[1] * (O * f + Z), x[2] + p[2] * (O * f + Z)];
    P.push([me[0] + v[0] * V + y[0] * X, me[1] + v[1] * V + y[1] * X, me[2] + v[2] * V + y[2] * X]);
  }
  return P;
}
function ns(x, e, t) {
  const s = ft(), i = new gt(), a = new bt(new Fe(), new vt({ color: s.elementLine, vertexColors: false, depthTest: false, transparent: true, opacity: 1 }));
  Pe((d, p) => {
    a.material.color.setHex(p.elementLine);
  }), a.frustumCulled = false, a.renderOrder = 3, i.add(a);
  const r = new yt({ vertexColors: true, transparent: true, opacity: s.shellOpacity, side: wt, depthWrite: false, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }), l = new xt(new Fe(), r);
  l.frustumCulled = false, l.userData.isShellArea = true, l.name = "__hekatan_shell_area", i.add(l);
  let h = new J(s.shellWall), o = new J(s.shellSlab), c = new J(s.shellTri);
  return Pe((d, p) => {
    h = new J(p.shellWall), o = new J(p.shellSlab), c = new J(p.shellTri), r.opacity = p.shellOpacity, r.needsUpdate = true;
  }), Ce.derive(() => {
    var _a, _b, _c, _d, _e2, _f, _g, _h;
    if (e.deformedShape.val, e.elemColumns.val, e.elemBeams.val, (_a = e.elemFrames) == null ? void 0 : _a.val, (_b = e.elemZapatas) == null ? void 0 : _b.val, (_c = e.elemLosas) == null ? void 0 : _c.val, (_d = e.colorByType) == null ? void 0 : _d.val, !e.elements.val) return;
    const d = e.elemFrames ? e.elemFrames.rawVal : true, p = e.elemColumns.rawVal, f = e.elemBeams.rawVal, m = e.elemZapatas ? e.elemZapatas.rawVal : true, b = e.elemLosas ? e.elemLosas.rawVal : true, v = e.colorByType ? e.colorByType.rawVal : false, g = t.val, y = ((_e2 = x.elements) == null ? void 0 : _e2.val) || [], w = (k) => {
      if (k.length === 2) {
        if (!d) return false;
        const _ = g[k[0]], S = g[k[1]];
        return !_ || !S ? true : Je(_, S) ? p : f;
      }
      if (k.length === 4) {
        const _ = k.map((D) => g[D]).filter(Boolean);
        if (_.length < 4) return true;
        const S = (_[0][2] + _[1][2] + _[2][2] + _[3][2]) / 4;
        return $e(S) ? m : b;
      }
      if (k.length === 3) {
        const _ = k.map((D) => g[D]).filter(Boolean);
        if (_.length < 3) return true;
        const S = (_[0][2] + _[1][2] + _[2][2]) / 3;
        return $e(S) ? m : b;
      }
      return true;
    }, C = [], $ = [];
    for (const k of y) {
      if (!w(k)) continue;
      let _ = null;
      if (v) if (k.length === 2) {
        const S = g[k[0]], D = g[k[1]];
        S && D && (_ = Je(S, D) ? kt : $t);
      } else if (k.length === 4) {
        const S = k.map((D) => g[D]).filter(Boolean);
        if (S.length === 4) {
          const D = (S[0][2] + S[1][2] + S[2][2] + S[3][2]) / 4;
          _ = $e(D) ? Ve : Ke;
        }
      } else k.length === 3 && (_ = Ge);
      if (k.length === 2 && e.deformedShape.val) {
        const S = ((_f = x.nodes) == null ? void 0 : _f.val) ?? [], D = (_h = (_g = x.deformOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.deformations, N = S[k[0]], H = S[k[1]];
        if (N && H && D) {
          const U = Number.isFinite(e.deformScale.val) ? e.deformScale.val : 1, P = U * (Number.isFinite(e.deformScaleZ.val) ? e.deformScaleZ.val : 1), A = Tt(N, H, D.get(k[0]), D.get(k[1]), U, P);
          for (let O = 0; O < A.length - 1; O++) C.push(...A[O], ...A[O + 1]), v && _ && ($.push(_.r, _.g, _.b), $.push(_.r, _.g, _.b));
          continue;
        }
      }
      for (const S of Et(k)) {
        const D = g[S[0]], N = g[S[1]];
        !D || !N || (C.push(...D, ...N), v && _ && ($.push(_.r, _.g, _.b), $.push(_.r, _.g, _.b)));
      }
    }
    a.geometry.setAttribute("position", new ke(C, 3)), v && $.length === C.length ? (a.geometry.setAttribute("color", new ke($, 3)), a.material.vertexColors = true, a.material.needsUpdate = true) : (a.geometry.deleteAttribute("color"), a.material.vertexColors = false, a.material.needsUpdate = true);
    const I = [], E = [], T = [], R = [];
    for (let k = 0; k < y.length; k++) {
      const _ = y[k];
      if (w(_)) {
        if (_.length === 3) {
          const [S, D, N] = _;
          if (g[S] && g[D] && g[N]) {
            T.push(k), R.push(0), I.push(...g[S], ...g[D], ...g[N]);
            const H = v ? Ge : c;
            for (let U = 0; U < 3; U++) E.push(H.r, H.g, H.b);
          }
        } else if (_.length === 4) {
          const [S, D, N, H] = _;
          if (g[S] && g[D] && g[N] && g[H]) {
            let U;
            if (v) {
              const P = (g[S][2] + g[D][2] + g[N][2] + g[H][2]) / 4;
              U = $e(P) ? Ve : Ke;
            } else U = St(g[S], g[D], g[N], g[H]) ? h : o;
            I.push(...g[S], ...g[D], ...g[N]), I.push(...g[S], ...g[N], ...g[H]), T.push(k, k), R.push(0, 1);
            for (let P = 0; P < 6; P++) E.push(U.r, U.g, U.b);
          }
        }
      }
    }
    l.userData.faceToElem = T, l.userData.faceLocal = R, I.length > 0 ? (l.geometry.dispose(), l.geometry = new Fe(), l.geometry.setAttribute("position", new ke(I, 3)), l.geometry.setAttribute("color", new ke(E, 3)), l.geometry.computeVertexNormals(), l.visible = e.faces ? e.faces.rawVal : true) : l.visible = false;
  }), Ce.derive(() => {
    i.visible = e.elements.val;
  }), Ce.derive(() => {
    e.edges && (a.visible = e.edges.val);
  }), Ce.derive(() => {
    var _a, _b;
    if (!e.faces) return;
    const d = e.faces.val, p = (((_a = e.shellResults) == null ? void 0 : _a.val) ?? "none") !== "none", f = (((_b = e.solidResults) == null ? void 0 : _b.val) ?? "none") !== "none", m = p || f;
    l.geometry.attributes.position ? l.visible = d && !m : d || (l.visible = false);
  }), i;
}
function Et(x) {
  if (x.length === 2) return [x];
  if (x.length === 8) {
    const t = x;
    return [[t[0], t[1]], [t[1], t[2]], [t[2], t[3]], [t[3], t[0]], [t[4], t[5]], [t[5], t[6]], [t[6], t[7]], [t[7], t[4]], [t[0], t[4]], [t[1], t[5]], [t[2], t[6]], [t[3], t[7]]];
  }
  const e = [];
  for (let t = 0; t < x.length; t++) e.push([x[t], x[(t + 1) % x.length]]);
  return e;
}
class Ze {
  constructor(e, t) {
    Object.assign(this, { type: t.type ?? null, detail: t, owner: e, target: t.target ?? null, phase: t.phase ?? "before", object: t.object ?? null, execute: null, isStopped: false, isCancelled: false, onComplete: null, listeners: [] }), delete t.type, delete t.target, delete t.object, this.complete = new Promise((s, i) => {
      this._resolve = s, this._reject = i;
    }), this.complete.catch(() => {
    });
  }
  finish(e) {
    e && u.extend(this.detail, e), this.phase = "after", this.owner.trigger.call(this.owner, this);
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
class he {
  constructor(e) {
    if (this.activeEvents = [], this.listeners = [], e !== void 0) {
      if (!u.checkName(e)) return;
      ie[e] = this;
    }
    this.debug = false;
  }
  on(e, t) {
    return (e = typeof e == "string" ? e.split(/[,\s]+/) : [e]).forEach((s) => {
      var i, a, r, l = typeof s == "string" ? s : s.type + ":" + s.execute + "." + s.scope;
      typeof s == "string" && ([a, i] = s.split("."), [a, r] = a.replace(":complete", ":after").replace(":done", ":after").split(":"), s = { type: a, execute: r ?? "before", scope: i }), (s = u.extend({ type: null, execute: "before", onComplete: null }, s)).type ? t ? (Array.isArray(this.listeners) || (this.listeners = []), this.listeners.push({ name: l, edata: s, handler: t }), this.debug && console.log("w2base: add event", { name: l, edata: s, handler: t })) : console.log("ERROR: You must specify event handler function when calling .on() method of " + this.name) : console.log("ERROR: You must specify event type when calling .on() method of " + this.name);
    }), this;
  }
  off(e, t) {
    return (e = typeof e == "string" ? e.split(/[,\s]+/) : [e]).forEach((s) => {
      var i, a, r, l = typeof s == "string" ? s : s.type + ":" + s.execute + "." + s.scope;
      if (typeof s == "string" && ([a, i] = s.split("."), [a, r] = a.replace(":complete", ":after").replace(":done", ":after").split(":"), s = { type: a || "*", execute: r || "", scope: i || "" }), (s = u.extend({ type: null, execute: null, onComplete: null }, s)).type || s.scope) {
        t = t || null;
        let h = 0;
        this.listeners = this.listeners.filter((o) => s.type !== "*" && s.type !== o.edata.type || s.execute !== "" && s.execute !== o.edata.execute || s.scope !== "" && s.scope !== o.edata.scope || s.handler != null && s.handler !== o.edata.handler || (h++, false)), this.debug && console.log(`w2base: remove event (${h})`, { name: l, edata: s, handler: t });
      } else console.log("ERROR: You must specify event type when calling .off() method of " + this.name);
    }), this;
  }
  trigger(e, t) {
    if (arguments.length == 1 ? t = e : (t.type = e, t.target = t.target ?? this), u.isPlainObject(t) && t.phase == "after") {
      if (!(t = this.activeEvents.find((r) => r.type == t.type && r.target == t.target))) return void console.log(`ERROR: Cannot find even handler for "${t.type}" on "${t.target}".`);
      console.log(`NOTICE: This syntax "edata.trigger({ phase: 'after' })" is outdated. Use edata.finish() instead.`);
    } else t instanceof Ze || (t = new Ze(this, t), this.activeEvents.push(t));
    let s, i, a;
    Array.isArray(this.listeners) || (this.listeners = []), this.debug && console.log(`w2base: trigger "${t.type}:${t.phase}"`, t);
    for (let r = this.listeners.length - 1; 0 <= r; r--) {
      let l = this.listeners[r];
      if (!(l == null || l.edata.type !== t.type && l.edata.type !== "*" || l.edata.target !== t.target && l.edata.target != null || l.edata.execute !== t.phase && l.edata.execute !== "*" && l.edata.phase !== "*") && (Object.keys(l.edata).forEach((h) => {
        t[h] == null && l.edata[h] != null && (t[h] = l.edata[h]);
      }), s = [], a = new RegExp(/\((.*?)\)/).exec(String(l.handler).split("=>")[0]), (s = a ? a[1].split(/\s*,\s*/) : s).length === 2 ? (l.handler.call(this, t.target, t), this.debug && console.log(" - call (old)", l.handler)) : (l.handler.call(this, t), this.debug && console.log(" - call", l.handler)), t.isStopped === true || t.stop === true)) return t;
    }
    if (e = "on" + t.type.substr(0, 1).toUpperCase() + t.type.substr(1), !(t.phase === "before" && typeof this[e] == "function" && (i = this[e], s = [], a = new RegExp(/\((.*?)\)/).exec(String(i).split("=>")[0]), (s = a ? a[1].split(/\s*,\s*/) : s).length === 2 ? (i.call(this, t.target, t), this.debug && console.log(" - call: on[Event] (old)", i)) : (i.call(this, t), this.debug && console.log(" - call: on[Event]", i)), t.isStopped === true || t.stop === true) || t.object != null && t.phase === "before" && typeof t.object[e] == "function" && (i = t.object[e], s = [], a = new RegExp(/\((.*?)\)/).exec(String(i).split("=>")[0]), (s = a ? a[1].split(/\s*,\s*/) : s).length === 2 ? (i.call(this, t.target, t), this.debug && console.log(" - call: edata.object (old)", i)) : (i.call(this, t), this.debug && console.log(" - call: edata.object", i)), t.isStopped === true || t.stop === true) || t.phase !== "after")) {
      typeof t.onComplete == "function" && t.onComplete.call(this, t);
      for (let r = 0; r < t.listeners.length; r++) typeof t.listeners[r] == "function" && (t.listeners[r].call(this, t), this.debug) && console.log(" - call: done", i);
      t._resolve(t), this.debug && console.log(`w2base: trigger "${t.type}:${t.phase}"`, t);
    }
    return t;
  }
}
const Ne = { locale: "en-US", dateFormat: "m/d/yyyy", timeFormat: "hh:mi pm", datetimeFormat: "m/d/yyyy|hh:mi pm", currencyPrefix: "$", currencySuffix: "", currencyPrecision: 2, groupSymbol: ",", decimalSymbol: ".", shortmonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], fullmonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], shortdays: ["M", "T", "W", "T", "F", "S", "S"], fulldays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], weekStarts: "S", phrases: { "${count} letters or more...": "---", "Add new record": "---", "Add New": "---", "Advanced Search": "---", after: "---", "AJAX error. See console for more details.": "---", "All Fields": "---", All: "---", Any: "---", "Are you sure you want to delete ${count} ${records}?": "---", "Attach files by dragging and dropping or Click to Select": "---", before: "---", "begins with": "---", begins: "---", between: "---", buffered: "---", Cancel: "---", Close: "---", Column: "---", Confirmation: "---", contains: "---", Copied: "---", "Copy to clipboard": "---", "Current Date & Time": "---", "Delete selected records": "---", Delete: "---", 'Do you want to delete search item "${item}"?': "---", "Edit selected record": "---", Edit: "---", "Empty list": "---", "ends with": "---", ends: "---", "Field should be at least ${count} characters.": "---", Hide: "---", in: "---", "is not": "---", is: "---", "less than": "---", "Line #": "---", "Load ${count} more...": "---", "Loading...": "---", "Maximum number of files is ${count}": "---", "Maximum total size is ${count}": "---", Modified: "---", "more than": "---", "Multiple Fields": "---", Name: "---", "No items found": "---", "No matches": "---", No: "---", none: "---", "Not a float": "---", "Not a hex number": "---", "Not a valid date": "---", "Not a valid email": "---", "Not alpha-numeric": "---", "Not an integer": "---", "Not in money format": "---", "not in": "---", Notification: "---", of: "---", Ok: "---", Opacity: "---", "Record ID": "---", record: "---", records: "---", "Refreshing...": "---", "Reload data in the list": "---", Remove: "---", "Remove This Field": "---", "Request aborted.": "---", "Required field": "---", Reset: "---", "Restore Default State": "---", "Returned data is not in valid JSON format.": "---", "Save changed records": "---", "Save Grid State": "---", Save: "---", "Saved Searches": "---", "Saving...": "---", "Search took ${count} seconds": "---", Search: "---", "Select Hour": "---", "Select Minute": "---", selected: "---", "Server Response ${count} seconds": "---", "Show/hide columns": "---", Show: "---", Size: "---", Skip: "---", "Sorting took ${count} seconds": "---", "Type to search...": "---", Type: "---", Yes: "---", Yesterday: "---", "Your remote data source record count has changed, reloading from the first record.": "---" } };
const _B = class _B {
  constructor(e, t, s) {
    this.context = t ?? document, this.previous = s ?? null;
    let i = [];
    if (Array.isArray(e)) i = e;
    else if (e instanceof Node || e instanceof Window) i = [e];
    else if (e instanceof _B) i = e.nodes;
    else if (typeof e == "string") {
      if (typeof this.context.querySelector != "function") throw new Error("Invalid context");
      i = Array.from(this.context.querySelectorAll(e));
    } else if (e == null) i = [];
    else {
      if (t = Array.from(e ?? []), typeof e != "object" || !Array.isArray(t)) throw new Error(`Invalid selector "${e}"`);
      i = t;
    }
    this.nodes = i, this.length = i.length, this.each((a, r) => {
      this[r] = a;
    });
  }
  static _fragment(e) {
    let t = document.createElement("template");
    return t.innerHTML = e, t.content.childNodes.forEach((s) => {
      var i = _B._scriptConvert(s);
      i != s && t.content.replaceChild(i, s);
    }), t.content;
  }
  static _scriptConvert(e) {
    let t = (s) => {
      var i = s.ownerDocument.createElement("script"), a = (i.text = s.text, s.attributes);
      for (let r = 0; r < a.length; r++) i.setAttribute(a[r].name, a[r].value);
      return i;
    };
    return (e = e.tagName == "SCRIPT" ? t(e) : e).querySelectorAll && e.querySelectorAll("script").forEach((s) => {
      s.parentNode.replaceChild(t(s), s);
    }), e;
  }
  static _fixProp(e) {
    var t = { cellpadding: "cellPadding", cellspacing: "cellSpacing", class: "className", colspan: "colSpan", contenteditable: "contentEditable", for: "htmlFor", frameborder: "frameBorder", maxlength: "maxLength", readonly: "readOnly", rowspan: "rowSpan", tabindex: "tabIndex", usemap: "useMap" };
    return t[e] || e;
  }
  _insert(e, t) {
    let s = [], i = this.length;
    if (!(i < 1)) {
      let a = this;
      if (typeof t == "string") this.each((r) => {
        var l = _B._fragment(t);
        s.push(...l.childNodes), r[e](l);
      });
      else if (t instanceof _B) {
        let r = i == 1;
        t.each((l) => {
          this.each((h) => {
            var o = r ? l : l.cloneNode(true);
            s.push(o), h[e](o), _B._scriptConvert(o);
          });
        }), r || t.remove();
      } else {
        if (!(t instanceof Node)) throw new Error(`Incorrect argument for "${e}(html)". It expects one string argument.`);
        this.each((r) => {
          var l = i === 1 ? t : _B._fragment(t.outerHTML);
          s.push(...i === 1 ? [t] : l.childNodes), r[e](l);
        }), 1 < i && t.remove();
      }
      return a = e == "replaceWith" ? new _B(s, this.context, this) : a;
    }
  }
  _save(e, t, s) {
    e._mQuery = e._mQuery ?? {}, Array.isArray(s) ? (e._mQuery[t] = e._mQuery[t] ?? [], e._mQuery[t].push(...s)) : s != null ? e._mQuery[t] = s : delete e._mQuery[t];
  }
  get(e) {
    var t = this[e = e < 0 ? this.length + e : e];
    return t || (e != null ? null : this.nodes);
  }
  eq(e) {
    let t = [this[e = e < 0 ? this.length + e : e]];
    return t[0] == null && (t = []), new _B(t, this.context, this);
  }
  then(e) {
    return e = e(this), e ?? this;
  }
  find(e) {
    let t = [];
    return this.each((s) => {
      s = Array.from(s.querySelectorAll(e)), 0 < s.length && t.push(...s);
    }), new _B(t, this.context, this);
  }
  filter(e) {
    let t = [];
    return this.each((s) => {
      (s === e || typeof e == "string" && s.matches && s.matches(e) || typeof e == "function" && e(s)) && t.push(s);
    }), new _B(t, this.context, this);
  }
  next() {
    let e = [];
    return this.each((t) => {
      t = t.nextElementSibling, t && e.push(t);
    }), new _B(e, this.context, this);
  }
  prev() {
    let e = [];
    return this.each((t) => {
      t = t.previousElementSibling, t && e.push(t);
    }), new _B(e, this.context, this);
  }
  shadow(e) {
    let t = [];
    this.each((i) => {
      i.shadowRoot && t.push(i.shadowRoot);
    });
    var s = new _B(t, this.context, this);
    return e ? s.find(e) : s;
  }
  closest(e) {
    let t = [];
    return this.each((s) => {
      s = s.closest(e), s && t.push(s);
    }), new _B(t, this.context, this);
  }
  host(e) {
    let t = [], s = (a) => a.parentNode ? s(a.parentNode) : a, i = (a) => {
      a = s(a), t.push(a.host || a), a.host && e && i(a.host);
    };
    return this.each((a) => {
      i(a);
    }), new _B(t, this.context, this);
  }
  parent(e) {
    return this.parents(e, true);
  }
  parents(e, t) {
    let s = [], i = (r) => {
      if (s.indexOf(r) == -1 && s.push(r), !t && r.parentNode) return i(r.parentNode);
    };
    this.each((r) => {
      r.parentNode && i(r.parentNode);
    });
    var a = new _B(s, this.context, this);
    return e ? a.filter(e) : a;
  }
  add(e) {
    return e = e instanceof _B ? e.nodes : Array.isArray(e) ? e : [e], new _B(this.nodes.concat(e), this.context, this);
  }
  each(e) {
    return this.nodes.forEach((t, s) => {
      e(t, s, this);
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
    let s = e;
    var i, a = arguments.length;
    return a === 0 || a === 1 && typeof e == "string" ? this[0] ? (a = this[0].style, typeof e == "string" ? (i = a.getPropertyPriority(e), a.getPropertyValue(e) + (i ? "!" + i : "")) : Object.fromEntries(this[0].style.cssText.split(";").filter((r) => !!r).map((r) => r.split(":").map((l) => l.trim())))) : void 0 : (typeof e != "object" && ((s = {})[e] = t), this.each((r, l) => {
      Object.keys(s).forEach((h) => {
        var o = String(s[h]).toLowerCase().includes("!important") ? "important" : "";
        r.style.setProperty(h, String(s[h]).replace(/\!important/i, ""), o);
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
    return typeof e == "string" && (e = e.split(/[,\s]+/)), this.each((s) => {
      let i = e;
      (i = i == null && t === false ? Array.from(s.classList) : i).forEach((a) => {
        if (a !== "") {
          let r = t != null ? t ? "add" : "remove" : "toggle";
          s.classList[r](a);
        }
      });
    }), this;
  }
  hasClass(e) {
    if ((e = typeof e == "string" ? e.split(/[,\s]+/) : e) == null && 0 < this.length) return Array.from(this[0].classList);
    let t = false;
    return this.each((s) => {
      t = t || e.every((i) => Array.from(s.classList ?? []).includes(i));
    }), t;
  }
  on(e, t, s) {
    typeof t == "function" && (s = t, t = void 0);
    let i;
    return (t == null ? void 0 : t.delegate) && (i = t.delegate, delete t.delegate), (e = e.split(/[,\s]+/)).forEach((a) => {
      let [r, l] = String(a).toLowerCase().split(".");
      if (i) {
        let h = s;
        s = (o) => {
          var c = n(o.target).parents(i);
          0 < c.length ? o.delegate = c[0] : o.delegate = o.target, (o.target.matches(i) || 0 < c.length) && h(o);
        };
      }
      this.each((h) => {
        this._save(h, "events", [{ event: r, scope: l, callback: s, options: t }]), h.addEventListener(r, s, t);
      });
    }), this;
  }
  off(e, t, s) {
    return typeof t == "function" && (s = t, t = void 0), (e = (e ?? "").split(/[,\s]+/)).forEach((i) => {
      let [a, r] = String(i).toLowerCase().split(".");
      this.each((l) => {
        var _a;
        if (Array.isArray((_a = l._mQuery) == null ? void 0 : _a.events)) for (let o = l._mQuery.events.length - 1; 0 <= o; o--) {
          var h = l._mQuery.events[o];
          r == null || r === "" ? h.event != a && a !== "" || h.callback != s && s != null || (l.removeEventListener(h.event, h.callback, h.options), l._mQuery.events.splice(o, 1)) : h.event != a && a !== "" || h.scope != r || (l.removeEventListener(h.event, h.callback, h.options), l._mQuery.events.splice(o, 1));
        }
      });
    }), this;
  }
  trigger(e, t) {
    let s;
    return s = e instanceof Event || e instanceof CustomEvent ? e : new (["click", "dblclick", "mousedown", "mouseup", "mousemove"].includes(e) ? MouseEvent : ["keydown", "keyup", "keypress"].includes(e) ? KeyboardEvent : Event)(e, t), this.each((i) => {
      i.dispatchEvent(s);
    }), this;
  }
  attr(e, t) {
    if (t === void 0 && typeof e == "string") return this[0] ? this[0].getAttribute(e) : void 0;
    {
      let s = {};
      return typeof e == "object" ? s = e : s[e] = t, this.each((i) => {
        Object.entries(s).forEach(([a, r]) => {
          i.setAttribute(a, r);
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
      let s = {};
      return typeof e == "object" ? s = e : s[e] = t, this.each((i) => {
        Object.entries(s).forEach(([a, r]) => {
          a = _B._fixProp(a), i[a] = r, a == "innerHTML" && _B._scriptConvert(i);
        });
      }), this;
    }
  }
  removeProp() {
    return this.each((e) => {
      Array.from(arguments).forEach((t) => {
        delete e[_B._fixProp(t)];
      });
    }), this;
  }
  data(e, t) {
    if (e instanceof Object) Object.entries(e).forEach((s) => {
      this.data(s[0], s[1]);
    });
    else {
      if (e && e.indexOf("-") != -1 && console.error(`Key "${e}" contains "-" (dash). Dashes are not allowed in property names. Use camelCase instead.`), !(arguments.length < 2)) return this.each((s) => {
        t != null ? s.dataset[e] = t instanceof Object ? JSON.stringify(t) : t : delete s.dataset[e];
      }), this;
      if (this[0]) {
        let s = Object.assign({}, this[0].dataset);
        return Object.keys(s).forEach((i) => {
          if (s[i].startsWith("[") || s[i].startsWith("{")) try {
            s[i] = JSON.parse(s[i]);
          } catch {
          }
        }), e ? s[e] : s;
      }
    }
  }
  removeData(e) {
    return typeof e == "string" && (e = e.split(/[,\s]+/)), this.each((t) => {
      e.forEach((s) => {
        delete t.dataset[s];
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
      var s, i = t.style.display, a = getComputedStyle(t).display, r = i == "none" || a == "none";
      !r || e != null && e !== true || (s = t instanceof HTMLTableRowElement ? "table-row" : t instanceof HTMLTableCellElement ? "table-cell" : "block", t.style.display = ((_a = t._mQuery) == null ? void 0 : _a.prevDisplay) ?? (i == a && a != "none" ? "" : s), this._save(t, "prevDisplay", null)), r || e != null && e !== false || (a != "none" && this._save(t, "prevDisplay", a), t.style.setProperty("display", "none"));
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
__publicField(_B, "version", 0.7);
let B = _B;
let n = function(x, e) {
  if (typeof x != "function") return new B(x, e);
  document.readyState == "complete" ? x() : window.addEventListener("load", x);
}, ie = (n.html = (x) => (x = B._fragment(x), n(x.children, x)), n.version = B.version, {});
class At {
  constructor() {
    this.version = "2.0.x", this.tmp = {}, this.settings = this.extend({}, { dataType: "HTTPJSON", dateStartYear: 1950, dateEndYear: 2030, macButtonOrder: false, warnNoPhrase: false }, Ne, { phrases: null }), this.i18nCompare = Intl.Collator().compare, this.hasLocalStorage = function() {
      var e = "w2ui_test";
      try {
        return localStorage.setItem(e, e), localStorage.removeItem(e), true;
      } catch {
        return false;
      }
    }(), this.isMac = /Mac/i.test(navigator.platform), this.isMobile = /(iphone|ipod|ipad|mobile|android)/i.test(navigator.userAgent), this.isIOS = /(iphone|ipod|ipad)/i.test(navigator.platform), this.isAndroid = /(android)/i.test(navigator.userAgent), this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent), this.formatters = { number(e, t) {
      return 20 < parseInt(t) && (t = 20), parseInt(t) < 0 && (t = 0), e == null || e === "" ? "" : u.formatNumber(parseFloat(e), t, true);
    }, float(e, t) {
      return u.formatters.number(e, t);
    }, int(e, t) {
      return u.formatters.number(e, 0);
    }, money(e, t) {
      return e == null || e === "" ? "" : (e = u.formatNumber(Number(e), u.settings.currencyPrecision), (u.settings.currencyPrefix || "") + e + (u.settings.currencySuffix || ""));
    }, currency(e, t) {
      return u.formatters.money(e, t);
    }, percent(e, t) {
      return e == null || e === "" ? "" : u.formatNumber(e, t || 1) + "%";
    }, size(e, t) {
      return e == null || e === "" ? "" : u.formatSize(parseInt(e));
    }, date(e, t) {
      if (t === "" && (t = u.settings.dateFormat), e == null || e === 0 || e === "") return "";
      let s = u.isDateTime(e, t, true);
      return '<span title="' + (s = s === false ? u.isDate(e, t, true) : s) + '">' + u.formatDate(s, t) + "</span>";
    }, datetime(e, t) {
      if (t === "" && (t = u.settings.datetimeFormat), e == null || e === 0 || e === "") return "";
      let s = u.isDateTime(e, t, true);
      return '<span title="' + (s = s === false ? u.isDate(e, t, true) : s) + '">' + u.formatDateTime(s, t) + "</span>";
    }, time(e, t) {
      if (t === "" && (t = u.settings.timeFormat), e == null || e === 0 || e === "") return "";
      let s = u.isDateTime(e, t = (t = t === "h12" ? "hh:mi pm" : t) === "h24" ? "h24:mi" : t, true);
      return '<span title="' + (s = s === false ? u.isDate(e, t, true) : s) + '">' + u.formatTime(e, t) + "</span>";
    }, timestamp(e, t) {
      if (t === "" && (t = u.settings.datetimeFormat), e == null || e === 0 || e === "") return "";
      let s = u.isDateTime(e, t, true);
      return (s = s === false ? u.isDate(e, t, true) : s).toString ? s.toString() : "";
    }, gmt(e, t) {
      if (t === "" && (t = u.settings.datetimeFormat), e == null || e === 0 || e === "") return "";
      let s = u.isDateTime(e, t, true);
      return (s = s === false ? u.isDate(e, t, true) : s).toUTCString ? s.toUTCString() : "";
    }, age(e, t) {
      if (e == null || e === 0 || e === "") return "";
      let s = u.isDateTime(e, null, true);
      return '<span title="' + (s = s === false ? u.isDate(e, null, true) : s) + '">' + u.age(e) + (t ? " " + t : "") + "</span>";
    }, interval(e, t) {
      return e == null || e === 0 || e === "" ? "" : u.interval(e) + (t ? " " + t : "");
    }, toggle(e, t) {
      return e ? "Yes" : "";
    }, password(e, t) {
      let s = "";
      for (let i = 0; i < e.length; i++) s += "*";
      return s;
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
    var t, s;
    return typeof e != "object" && e !== "" && (!!this.isFloat(e) || (t = this.settings, s = new RegExp("^" + (t.currencyPrefix ? "\\" + t.currencyPrefix + "?" : "") + "[-+]?" + (t.currencyPrefix ? "\\" + t.currencyPrefix + "?" : "") + "[0-9]*[\\" + t.decimalSymbol + "]?[0-9]+" + (t.currencySuffix ? "\\" + t.currencySuffix + "?" : "") + "$", "i"), typeof e == "string" && (e = e.replace(new RegExp(t.groupSymbol, "g"), "")), s.test(e)));
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
  isDate(e, t, s) {
    if (!e) return false;
    var i = "Invalid Date";
    let a, r, l;
    if (t == null && (t = this.settings.dateFormat), typeof e.getFullYear == "function") l = e.getFullYear(), a = e.getMonth() + 1, r = e.getDate();
    else if (parseInt(e) == e && 0 < parseInt(e)) e = new Date(parseInt(e)), l = e.getFullYear(), a = e.getMonth() + 1, r = e.getDate();
    else {
      if (e = String(e), new RegExp("mon", "ig").test(t)) {
        t = t.replace(/month/gi, "m").replace(/mon/gi, "m").replace(/dd/gi, "d").replace(/[, ]/gi, "/").replace(/\/\//g, "/").toLowerCase(), e = e.replace(/[, ]/gi, "/").replace(/\/\//g, "/").toLowerCase();
        for (let d = 0, p = this.settings.fullmonths.length; d < p; d++) {
          var h = this.settings.fullmonths[d];
          e = e.replace(new RegExp(h, "ig"), parseInt(d) + 1).replace(new RegExp(h.substr(0, 3), "ig"), parseInt(d) + 1);
        }
      }
      var o = e.replace(/-/g, "/").replace(/\./g, "/").toLowerCase().split("/"), t = t.replace(/-/g, "/").replace(/\./g, "/").toLowerCase();
      t === "mm/dd/yyyy" && (a = o[0], r = o[1], l = o[2]), t === "m/d/yyyy" && (a = o[0], r = o[1], l = o[2]), t === "dd/mm/yyyy" && (a = o[1], r = o[0], l = o[2]), t === "d/m/yyyy" && (a = o[1], r = o[0], l = o[2]), t === "yyyy/dd/mm" && (a = o[2], r = o[1], l = o[0]), t === "yyyy/d/m" && (a = o[2], r = o[1], l = o[0]), t === "yyyy/mm/dd" && (a = o[1], r = o[2], l = o[0]), t === "yyyy/m/d" && (a = o[1], r = o[2], l = o[0]), t === "mm/dd/yy" && (a = o[0], r = o[1], l = o[2]), t === "m/d/yy" && (a = o[0], r = o[1], l = parseInt(o[2]) + 1900), t === "dd/mm/yy" && (a = o[1], r = o[0], l = parseInt(o[2]) + 1900), t === "d/m/yy" && (a = o[1], r = o[0], l = parseInt(o[2]) + 1900), t === "yy/dd/mm" && (a = o[2], r = o[1], l = parseInt(o[0]) + 1900), t === "yy/d/m" && (a = o[2], r = o[1], l = parseInt(o[0]) + 1900), t === "yy/mm/dd" && (a = o[1], r = o[2], l = parseInt(o[0]) + 1900), t === "yy/m/d" && (a = o[1], r = o[2], l = parseInt(o[0]) + 1900);
    }
    return !!this.isInt(l) && !!this.isInt(a) && !!this.isInt(r) && (l = +l, a = +a, r = +r, (i = new Date(l, a - 1, r)).setFullYear(l), a != null) && String(i) !== "Invalid Date" && i.getMonth() + 1 === a && i.getDate() === r && i.getFullYear() === l && (s !== true || i);
  }
  isTime(l, t) {
    if (l == null) return false;
    let s, i, a;
    i = 0 <= (l = (l = String(l)).toUpperCase()).indexOf("AM");
    var r = (a = 0 <= l.indexOf("PM")) || i, l = (s = r ? 12 : 24, (l = l.replace("AM", "").replace("PM", "").trim()).split(":"));
    let h = parseInt(l[0] || 0), o = parseInt(l[1] || 0), c = parseInt(l[2] || 0);
    return (r && l.length === 1 || l.length === 2 || l.length === 3) && !(l[0] === "" || h < 0 || h > s || !this.isInt(l[0]) || 2 < l[0].length || 1 < l.length && (l[1] === "" || o < 0 || 59 < o || !this.isInt(l[1]) || l[1].length !== 2) || 2 < l.length && (l[2] === "" || c < 0 || 59 < c || !this.isInt(l[2]) || l[2].length !== 2) || !(r || s !== h || o === 0 && c === 0) || r && l.length === 1 && h === 0) && (t !== true || (a && h !== 12 && (h += 12), i && h === 12 && (h += 12), { hours: h, minutes: o, seconds: c }));
  }
  isDateTime(e, t, s) {
    var i;
    return typeof e.getFullYear == "function" ? s !== true || e : (i = parseInt(e)) === e ? !(i < 0) && (s !== true || new Date(i)) : (i = String(e).indexOf(" ")) < 0 ? !(String(e).indexOf("T") < 0 || String(new Date(e)) == "Invalid Date") && (s !== true || new Date(e)) : (t = (t = t ?? this.settings.datetimeFormat).split("|"), e = [e.substr(0, i), e.substr(i).trim()], t[0] = t[0].trim(), t[1] && (t[1] = t[1].trim()), i = this.isDate(e[0], t[0], true), t = this.isTime(e[1], true), i !== false && t !== false && (s !== true || (i.setHours(t.hours), i.setMinutes(t.minutes), i.setSeconds(t.seconds), i)));
  }
  age(e) {
    let t;
    if (e === "" || e == null || (t = typeof e.getFullYear == "function" ? e : parseInt(e) == e && 0 < parseInt(e) ? new Date(parseInt(e)) : new Date(e), String(t) === "Invalid Date")) return "";
    e = ((/* @__PURE__ */ new Date()).getTime() - t.getTime()) / 1e3;
    let s = "", i = "";
    return e < 0 ? (s = 0, i = "sec") : e < 60 ? (s = Math.floor(e), i = "sec", e < 0 && (s = 0, i = "sec")) : e < 3600 ? (s = Math.floor(e / 60), i = "min") : e < 86400 ? (s = Math.floor(e / 60 / 60), i = "hour") : e < 2592e3 ? (s = Math.floor(e / 24 / 60 / 60), i = "day") : e < 31536e3 ? (s = Math.floor(e / 30 / 24 / 60 / 60 * 10) / 10, i = "month") : e < 126144e3 ? (s = Math.floor(e / 365 / 24 / 60 / 60 * 10) / 10, i = "year") : 126144e3 <= e && (s = Math.floor(e / 365.25 / 24 / 60 / 60 * 10) / 10, i = "year"), s + " " + i + (1 < s ? "s" : "");
  }
  interval(e) {
    return e < 100 ? "< 0.01 sec" : e < 1e3 ? Math.floor(e / 10) / 100 + " sec" : e < 1e4 ? Math.floor(e / 100) / 10 + " sec" : e < 6e4 ? Math.floor(e / 1e3) + " secs" : e < 36e5 ? Math.floor(e / 6e4) + " mins" : e < 864e5 ? Math.floor(e / 36e5 * 10) / 10 + " hours" : e < 2628e6 ? Math.floor(e / 864e5 * 10) / 10 + " days" : e < 31536e6 ? Math.floor(e / 2628e6 * 10) / 10 + " months" : Math.floor(e / 31536e5) / 10 + " years";
  }
  date(a) {
    if (a === "" || a == null || typeof a == "object" && !a.getMonth) return "";
    let t = new Date(a);
    if (this.isInt(a) && (t = new Date(Number(a))), String(t) === "Invalid Date") return "";
    var a = this.settings.shortmonths, i = /* @__PURE__ */ new Date(), r = /* @__PURE__ */ new Date(), s = (r.setTime(r.getTime() - 864e5), a[t.getMonth()] + " " + t.getDate() + ", " + t.getFullYear()), i = a[i.getMonth()] + " " + i.getDate() + ", " + i.getFullYear(), a = a[r.getMonth()] + " " + r.getDate() + ", " + r.getFullYear(), r = t.getHours() - (12 < t.getHours() ? 12 : 0) + ":" + (t.getMinutes() < 10 ? "0" : "") + t.getMinutes() + " " + (12 <= t.getHours() ? "pm" : "am");
    let l = s == i ? r : s;
    return '<span title="' + s + " " + (t.getHours() - (12 < t.getHours() ? 12 : 0) + ":" + (t.getMinutes() < 10 ? "0" : "") + t.getMinutes() + ":" + (t.getSeconds() < 10 ? "0" : "") + t.getSeconds() + " " + (12 <= t.getHours() ? "pm" : "am")) + '">' + (l = s == a ? this.lang("Yesterday") : l) + "</span>";
  }
  formatSize(e) {
    var t;
    return this.isFloat(e) && e !== "" ? (e = parseFloat(e)) === 0 ? 0 : (t = parseInt(Math.floor(Math.log(e) / Math.log(1024))), (Math.floor(e / Math.pow(1024, t) * 10) / 10).toFixed(t === 0 ? 0 : 1) + " " + (["Bt", "KB", "MB", "GB", "TB", "PB", "EB", "ZB"][t] || "??")) : "";
  }
  formatNumber(e, t, s) {
    return e == null || e === "" || typeof e == "object" ? "" : (s = { minimumFractionDigits: parseInt(t), maximumFractionDigits: parseInt(t), useGrouping: !!s }, (t == null || t < 0) && (s.minimumFractionDigits = 0, s.maximumFractionDigits = 20), parseFloat(e).toLocaleString(this.settings.locale, s));
  }
  formatDate(e, t) {
    if (t = t || this.settings.dateFormat, e === "" || e == null || typeof e == "object" && !e.getMonth) return "";
    let s = new Date(e);
    var i, a;
    return this.isInt(e) && (s = new Date(Number(e))), String(s) === "Invalid Date" ? "" : (e = s.getFullYear(), i = s.getMonth(), a = s.getDate(), t.toLowerCase().replace("month", this.settings.fullmonths[i]).replace("mon", this.settings.shortmonths[i]).replace(/yyyy/g, ("000" + e).slice(-4)).replace(/yyy/g, ("000" + e).slice(-4)).replace(/yy/g, ("0" + e).slice(-2)).replace(/(^|[^a-z$])y/g, "$1" + e).replace(/mm/g, ("0" + (i + 1)).slice(-2)).replace(/dd/g, ("0" + a).slice(-2)).replace(/th/g, a == 1 ? "st" : "th").replace(/th/g, a == 2 ? "nd" : "th").replace(/th/g, a == 3 ? "rd" : "th").replace(/(^|[^a-z$])m/g, "$1" + (i + 1)).replace(/(^|[^a-z$])d/g, "$1" + a));
  }
  formatTime(e, t) {
    if (t = t || this.settings.timeFormat, e === "" || e == null || typeof e == "object" && !e.getMonth) return "";
    let s = new Date(e);
    if (this.isInt(e) && (s = new Date(Number(e))), this.isTime(e) && (e = this.isTime(e, true), (s = /* @__PURE__ */ new Date()).setHours(e.hours), s.setMinutes(e.minutes)), String(s) === "Invalid Date") return "";
    let i = "am", a = s.getHours();
    e = s.getHours();
    let r = s.getMinutes(), l = s.getSeconds();
    return r < 10 && (r = "0" + r), l < 10 && (l = "0" + l), t.indexOf("am") === -1 && t.indexOf("pm") === -1 || (12 <= a && (i = "pm"), 12 < a && (a -= 12), a === 0 && (a = 12)), t.toLowerCase().replace("am", i).replace("pm", i).replace("hhh", a < 10 ? "0" + a : a).replace("hh24", e < 10 ? "0" + e : e).replace("h24", e).replace("hh", a).replace("mm", r).replace("mi", r).replace("ss", l).replace(/(^|[^a-z$])h/g, "$1" + a).replace(/(^|[^a-z$])m/g, "$1" + r).replace(/(^|[^a-z$])s/g, "$1" + l);
  }
  formatDateTime(e, t) {
    let s;
    return e === "" || e == null || typeof e == "object" && !e.getMonth ? "" : (typeof t != "string" ? s = [this.settings.dateFormat, this.settings.timeFormat] : ((s = t.split("|"))[0] = s[0].trim(), s[1] = 1 < s.length ? s[1].trim() : this.settings.timeFormat), s[1] === "h12" && (s[1] = "h:m pm"), s[1] === "h24" && (s[1] = "h24:m"), this.formatDate(e, s[0]) + " " + this.formatTime(e, s[1]));
  }
  stripSpaces(e) {
    if (e != null) switch (typeof e) {
      case "number":
        break;
      case "string":
        e = String(e).replace(/(?:\r\n|\r|\n)/g, " ").replace(/\s\s+/g, " ").trim();
        break;
      case "object":
        Array.isArray(e) ? (e = this.extend([], e)).forEach((t, s) => {
          e[s] = this.stripSpaces(t);
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
        Array.isArray(e) ? (e = this.extend([], e)).forEach((t, s) => {
          e[s] = this.stripTags(t);
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
        Array.isArray(e) ? (e = this.extend([], e)).forEach((t, s) => {
          e[s] = this.encodeTags(t);
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
        Array.isArray(e) ? (e = this.extend([], e)).forEach((t, s) => {
          e[s] = this.decodeTags(t);
        }) : (e = this.extend({}, e), Object.keys(e).forEach((t) => {
          e[t] = this.decodeTags(e[t]);
        }));
    }
    return e;
  }
  escapeId(e) {
    return e === "" || e == null ? "" : (e + "").replace(/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, (t, s) => s ? t === "\0" ? "\uFFFD" : t.slice(0, -1) + "\\" + t.charCodeAt(t.length - 1).toString(16) + " " : "\\" + t);
  }
  unescapeId(e) {
    return e === "" || e == null ? "" : e.replace(/\\[\da-fA-F]{1,6}[\x20\t\r\n\f]?|\\([^\r\n\f])/g, (t, s) => (t = "0x" + t.slice(1) - 65536, s || (t < 0 ? String.fromCharCode(65536 + t) : String.fromCharCode(t >> 10 | 55296, 1023 & t | 56320))));
  }
  base64encode(e) {
    return btoa(e);
  }
  base64decode(e) {
    return atob(e);
  }
  async sha256(e) {
    return e = new TextEncoder().encode(e), crypto.subtle.digest("SHA-256", e).then((t) => Array.from(new Uint8Array(t)).map((s) => s.toString(16).padStart(2, "0")).join(""));
  }
  transition(e, t, s, i) {
    return new Promise((a, r) => {
      var l = getComputedStyle(e);
      let h = parseInt(l.width), o = parseInt(l.height);
      if (e && t) {
        switch (e.parentNode.style.cssText += "perspective: 900px; overflow: hidden;", e.style.cssText += "; position: absolute; z-index: 1019; backface-visibility: hidden", t.style.cssText += "; position: absolute; z-index: 1020; backface-visibility: hidden", s) {
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
          s === "slide-down" && (n(e).css("z-index", "1019"), n(t).css("z-index", "1020")), t && n(t).css({ opacity: "1" }).css({ transition: "", transform: "" }), e && n(e).css({ opacity: "1" }).css({ transition: "", transform: "" }), typeof i == "function" && i(), a();
        }, 500);
      } else console.log("ERROR: Cannot do transition when one of the divs is null");
    });
  }
  lock(e, t = {}) {
    if (e != null) {
      typeof t == "string" && (t = { msg: t }), arguments[2] && (t.spinner = arguments[2]), t = this.extend({ spinner: false }, t), (e == null ? void 0 : e[0]) instanceof Node && (e = Array.isArray(e) ? e : e.get()), t.msg || t.msg === 0 || (t.msg = ""), this.unlock(e);
      var s = n(e).get(0);
      let i = s.scrollWidth, a = s.scrollHeight, r = (s.tagName == "BODY" && (i < innerWidth && (i = innerWidth), a < innerHeight) && (a = innerHeight), n(e).prepend(`<div class="w2ui-lock" style="height: ${a}px; width: ${i}px"></div><div class="w2ui-lock-msg"></div>`), n(e).find(".w2ui-lock"));
      s = n(e).find(".w2ui-lock-msg"), e = (t.msg || s.css({ "background-color": "transparent", "background-image": "none", border: "0px", "box-shadow": "none" }), t.spinner === true && (t.msg = `<div class="w2ui-spinner" ${t.msg ? "" : 'style="width: 35px; height: 35px"'}></div>` + t.msg), t.msg ? s.html(t.msg).css("display", "block") : s.remove(), t.opacity != null && r.css("opacity", t.opacity), r.css({ display: "block" }), t.bgColor && r.css({ "background-color": t.bgColor }), getComputedStyle(r.get(0)));
      let l = e.opacity ?? 0.15;
      r.on("mousedown", function() {
        typeof t.onClick == "function" ? t.onClick() : r.css({ transition: ".2s", opacity: 1.5 * l });
      }).on("mouseup", function() {
        typeof t.onClick != "function" && r.css({ transition: ".2s", opacity: l });
      }).on("mousewheel", function(h) {
        h && (h.stopPropagation(), h.preventDefault());
      });
    }
  }
  unlock(e, t) {
    var s;
    e != null && (clearTimeout(e._prevUnlock), (e == null ? void 0 : e[0]) instanceof Node && (e = Array.isArray(e) ? e : e.get()), this.isInt(t) && 0 < t ? (n(e).find(".w2ui-lock").css({ transition: t / 1e3 + "s", opacity: 0 }), s = n(e).get(0), clearTimeout(s._prevUnlock), s._prevUnlock = setTimeout(() => {
      n(e).find(".w2ui-lock").remove();
    }, t)) : n(e).find(".w2ui-lock").remove(), n(e).find(".w2ui-lock-msg").remove());
  }
  message(e, t) {
    var _a, _b;
    let s, i, a;
    var r = () => {
      var _a2;
      var m = n(e == null ? void 0 : e.box).find(".w2ui-message");
      m.length != 0 && typeof ((_a2 = t = m.get(0)._msg_options || {}) == null ? void 0 : _a2.close) == "function" && t.close();
    };
    let l = (m) => {
      var _a2, _b2;
      var b, v = m.box._msg_prevFocus;
      n(e.box).find(".w2ui-message").length <= 1 ? e.owner ? e.owner.unlock(e.param, 150) : this.unlock(e.box, 150) : n(e.box).find(`#w2ui-message-${(_a2 = e.owner) == null ? void 0 : _a2.name}-` + (m.msgIndex - 1)).css("z-index", 1500), v ? 0 < (b = n(v).closest(".w2ui-message")).length ? b.get(0)._msg_options.setFocus(v) : v.focus() : typeof ((_b2 = e.owner) == null ? void 0 : _b2.focus) == "function" && e.owner.focus(), n(m.box).remove(), m.msgIndex === 0 && (f.css("z-index", m.tmp.zIndex), n(e.box).css("overflow", m.tmp.overflow)), m.trigger && a.finish();
    };
    if (typeof (t = typeof t != "string" && typeof t != "number" ? t : { width: String(t).length < 300 ? 350 : 550, height: String(t).length < 300 ? 170 : 250, text: String(t) }) != "object") return void r();
    t.text != null && (t.body = `<div class="w2ui-centered w2ui-msg-text">${t.text}</div>`), t.width == null && (t.width = 350), t.height == null && (t.height = 170), t.hideOn == null && (t.hideOn = ["esc"]), t.on == null && (c = t, t = new he(), u.extend(t, c)), t.on("open", (m) => {
      u.bindEvents(n(t.box).find(".w2ui-eaction"), t), n(m.detail.box).find("button, input, textarea, [name=hidden-first]").off(".message").on("keydown.message", function(b) {
        b.keyCode == 27 && t.hideOn.includes("esc") && (t.cancelAction ? t.action(t.cancelAction) : t.close());
      }), setTimeout(() => t.setFocus(t.focus), 300);
    }), t.off(".prom");
    let h = { self: t, action(m) {
      return t.on("action.prom", m), h;
    }, close(m) {
      return t.on("close.prom", m), h;
    }, open(m) {
      return t.on("open.prom", m), h;
    }, then(m) {
      return t.on("open:after.prom", m), h;
    } }, o = (t.actions == null && t.buttons == null && t.html == null && (t.actions = { Ok(m) {
      m.detail.self.close();
    } }), t.off(".buttons"), t.actions != null && (t.buttons = "", Object.keys(t.actions).forEach((m) => {
      var b = t.actions[m];
      let v = m;
      typeof b == "function" && (t.buttons += `<button class="w2ui-btn w2ui-eaction" data-click='["action","${m}","event"]' name="${m}">${m}</button>`), typeof b == "object" && (t.buttons += `<button class="w2ui-btn w2ui-eaction ${b.class || ""}" name="${m}" data-click='["action","${m}","event"]'
                        style="${b.style ?? ""}" ${b.attrs ?? ""}>${b.text || m}</button>`, v = Array.isArray(t.actions) ? b.text : m), typeof b == "string" && (t.buttons += `<button class="w2ui-btn w2ui-eaction" name="${b}" data-click='["action","${b}","event"]'>${b}</button>`, v = b), typeof v == "string" && (v = v[0].toLowerCase() + v.substr(1).replace(/\s+/g, "")), h[v] = function(g) {
        return t.on("action.buttons", (y) => {
          y.detail.action[0].toLowerCase() + y.detail.action.substr(1).replace(/\s+/g, "") == v && g(y);
        }), h;
      };
    })), Array("html", "body", "buttons").forEach((m) => {
      t[m] = String(t[m] ?? "").trim();
    }), t.body === "" && t.buttons === "" || (t.html = `
                <div class="w2ui-message-body">${t.body || ""}</div>
                <div class="w2ui-message-buttons">${t.buttons || ""}</div>
            `), getComputedStyle(n(e.box).get(0)));
    var c = parseFloat(o.width), d = parseFloat(o.height);
    let p = 0, f = (0 < n(e.after).length && (o = getComputedStyle(n(e.after).get(0)), p = parseInt(o.display != "none" ? parseInt(o.height) : 0)), t.width > c && (t.width = c - 10), t.height > d - p && (t.height = d - 10 - p), t.originalWidth = t.width, t.originalHeight = t.height, parseInt(t.width) < 0 && (t.width = c + t.width), parseInt(t.width) < 10 && (t.width = 10), parseInt(t.height) < 0 && (t.height = d + t.height - p), parseInt(t.height) < 10 && (t.height = 10), t.originalHeight < 0 && (t.height = d + t.originalHeight - p), t.originalWidth < 0 && (t.width = c + 2 * t.originalWidth), n(e.box).find(e.after));
    return t.tmp || (t.tmp = { zIndex: f.css("z-index"), overflow: o.overflow }), t.html === "" && t.body === "" && t.buttons === "" ? r() : (t.msgIndex = n(e.box).find(".w2ui-message").length, t.msgIndex === 0 && typeof this.lock == "function" && (n(e.box).css("overflow", "hidden"), e.owner ? e.owner.lock(e.param) : this.lock(e.box)), n(e.box).find(".w2ui-message").css("z-index", 1390), f.css("z-index", 1501), d = `
                <div id="w2ui-message-${(_a = e.owner) == null ? void 0 : _a.name}-${t.msgIndex}" class="w2ui-message" data-mousedown="stop"
                    style="z-index: 1500; left: ${(c - t.width) / 2}px; top: ${p}px;
                        width: ${t.width}px; height: ${t.height}px; transform: translateY(-${t.height}px)"
                    ${t.hideOn.includes("click") ? e.param ? `data-click='["message", "${e.param}"]` : 'data-click="message"' : ""}>
                    <span name="hidden-first" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
                    ${t.html}
                    <span name="hidden-last" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
                </div>`, 0 < n(e.after).length ? n(e.box).find(e.after).after(d) : n(e.box).prepend(d), t.box = n(e.box).find(`#w2ui-message-${(_b = e.owner) == null ? void 0 : _b.name}-` + t.msgIndex)[0], u.bindEvents(t.box, this), n(t.box).addClass("animating"), (t.box._msg_options = t).box._msg_prevFocus = document.activeElement, setTimeout(() => {
      var _a2;
      (a = t.trigger("open", { target: this.name, box: t.box, self: t })).isCancelled === true ? (n(e.box).find(`#w2ui-message-${(_a2 = e.owner) == null ? void 0 : _a2.name}-` + t.msgIndex).remove(), t.msgIndex === 0 && (f.css("z-index", t.tmp.zIndex), n(e.box).css("overflow", t.tmp.overflow))) : n(t.box).css({ transition: "0.3s", transform: "translateY(0px)" });
    }, 0), i = setTimeout(() => {
      var _a2;
      n(e.box).find(`#w2ui-message-${(_a2 = e.owner) == null ? void 0 : _a2.name}-` + t.msgIndex).removeClass("animating").css({ transition: "0s" }), a.finish();
    }, 300)), t.action = (m, b) => {
      let v = t.actions[m];
      v instanceof Object && v.onClick && (v = v.onClick), m = t.trigger("action", { target: this.name, action: m, self: t, originalEvent: b, value: t.input ? t.input.value : null }), m.isCancelled !== true && (typeof v == "function" && v(m), m.finish());
    }, t.close = () => {
      var _a2;
      (a = t.trigger("close", { target: "self", box: t.box, self: t })).isCancelled !== true && (clearTimeout(i), n(t.box).hasClass("animating") ? (clearTimeout(s), l(t)) : (n(t.box).addClass("w2ui-closing animating").css({ transition: "0.15s", transform: "translateY(-" + t.height + "px)" }), t.msgIndex !== 0 && n(e.box).find(`#w2ui-message-${(_a2 = e.owner) == null ? void 0 : _a2.name}-` + (t.msgIndex - 1)).css("z-index", 1499), s = setTimeout(() => {
        l(t);
      }, 150)));
    }, t.setFocus = (m) => {
      var _a2, _b2;
      var b = n(e.box).find(".w2ui-message").length - 1;
      let v = n(e.box).find(`#w2ui-message-${(_a2 = e.owner) == null ? void 0 : _a2.name}-` + b), g = "input, button, select, textarea, [contentEditable], .w2ui-input";
      (_b2 = m != null ? isNaN(m) ? v.find(g).filter(m).get(0) : v.find(g).get(m) : v.find("[name=hidden-first]").get(0)) == null ? void 0 : _b2.focus(), n(e.box).find(".w2ui-message").find(g + ",[name=hidden-first],[name=hidden-last]").off(".keep-focus"), n(v).find(g + ",[name=hidden-first],[name=hidden-last]").on("blur.keep-focus", function(y) {
        setTimeout(() => {
          var _a3, _b3, _c;
          var w = document.activeElement, C = 0 < n(v).find(g).filter(w).length, $ = n(w).attr("name");
          !C && w && w !== document.body && ((_a3 = n(v).find(g).get(0)) == null ? void 0 : _a3.focus()), $ == "hidden-last" && ((_b3 = n(v).find(g).get(0)) == null ? void 0 : _b3.focus()), $ == "hidden-first" && ((_c = n(v).find(g).get(-1)) == null ? void 0 : _c.focus());
        }, 1);
      });
    }, h;
  }
  notify(e, t) {
    return new Promise((s) => {
      if (typeof e == "object" && (e = (t = e).text), (t = t || {}).where = t.where ?? document.body, t.timeout = t.timeout ?? 15e3, typeof this.tmp.notify_resolve == "function" && (this.tmp.notify_resolve(), n(this.tmp.notify_where).find("#w2ui-notify").remove()), this.tmp.notify_resolve = s, this.tmp.notify_where = t.where, clearTimeout(this.tmp.notify_timer), e) {
        if (typeof t.actions == "object") {
          let a = {};
          Object.keys(t.actions).forEach((r) => {
            a[r] = `<a class="w2ui-notify-link" value="${r}">${r}</a>`;
          }), e = this.execTemplate(e, a);
        }
        var i = `
                    <div id="w2ui-notify">
                        <div class="${t.class} ${t.error ? "w2ui-notify-error" : ""}">
                            ${e}
                            <span class="w2ui-notify-close w2ui-icon-cross"></span>
                        </div>
                    </div>`;
        n(t.where).append(i), n(t.where).find("#w2ui-notify").find(".w2ui-notify-close").on("click", (a) => {
          n(t.where).find("#w2ui-notify").remove(), s();
        }), t.actions && n(t.where).find("#w2ui-notify .w2ui-notify-link").on("click", (a) => {
          a = n(a.target).attr("value"), t.actions[a](), n(t.where).find("#w2ui-notify").remove(), s();
        }), 0 < t.timeout && (this.tmp.notify_timer = setTimeout(() => {
          n(t.where).find("#w2ui-notify").remove(), s();
        }, t.timeout));
      }
    });
  }
  confirm(e, t) {
    return u.normButtons(t = typeof t == "string" ? { text: t } : t, { yes: "Yes", no: "No" }), e = u.message(e, t), e && e.action((s) => {
      s.detail.self.close();
    }), e;
  }
  normButtons(e, t) {
    e.actions = e.actions ?? {};
    var s = Object.keys(t);
    return s.forEach((i) => {
      var a = e["btn_" + i];
      a && (t[i] = { text: u.lang(a.text ?? ""), class: a.class ?? "", style: a.style ?? "", attrs: a.attrs ?? "" }, delete e["btn_" + i]), Array("text", "class", "style", "attrs").forEach((r) => {
        e[i + "_" + r] && (typeof t[i] == "string" && (t[i] = { text: t[i] }), t[i][r] = e[i + "_" + r], delete e[i + "_" + r]);
      });
    }), s.includes("yes") && s.includes("no") && (u.settings.macButtonOrder ? u.extend(e.actions, { no: t.no, yes: t.yes }) : u.extend(e.actions, { yes: t.yes, no: t.no })), s.includes("ok") && s.includes("cancel") && (u.settings.macButtonOrder ? u.extend(e.actions, { cancel: t.cancel, ok: t.ok }) : u.extend(e.actions, { ok: t.ok, cancel: t.cancel })), e;
  }
  getSize(e, t) {
    let s = 0;
    if (0 < (e = n(e)).length) {
      e = e[0];
      var i = getComputedStyle(e);
      switch (t) {
        case "width":
          s = parseFloat(i.width), i.width === "auto" && (s = 0);
          break;
        case "height":
          s = parseFloat(i.height), i.height === "auto" && (s = 0);
          break;
        default:
          s = parseFloat(i[t] ?? 0) || 0;
      }
    }
    return s;
  }
  getStrWidth(e, t) {
    return n("body").append(`
            <div id="_tmp_width" style="position: absolute; top: -9000px; ${t || ""}">
                ${this.encodeTags(e)}
            </div>`), t = n("#_tmp_width")[0].clientWidth, n("#_tmp_width").remove(), t;
  }
  execTemplate(e, t) {
    return typeof e == "string" && t && typeof t == "object" ? e.replace(/\${([^}]+)?}/g, function(s, i) {
      return t[i] || i;
    }) : e;
  }
  marker(e, t, s = { onlyFirst: false, wholeWord: false }) {
    Array.isArray(t) || (t = t != null && t !== "" ? [t] : []);
    let i = s.wholeWord;
    n(e).each((a) => {
      for (var r = a, l = /\<span class=\"w2ui\-marker\"\>((.|\n|\r)*)\<\/span\>/gi; r.innerHTML.indexOf('<span class="w2ui-marker"') !== -1; ) r.innerHTML = r.innerHTML.replace(l, "$1");
      t.forEach((h) => {
        h = (h = typeof h != "string" ? String(h) : h).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").replace(/&/g, "&amp;").replace(/</g, "&gt;").replace(/>/g, "&lt;"), h = new RegExp((i ? "\\b" : "") + h + (i ? "\\b" : "") + "(?!([^<]+)?>)", "i" + (s.onlyFirst ? "" : "g")), a.innerHTML = a.innerHTML.replace(h, (o) => '<span class="w2ui-marker">' + o + "</span>");
      });
    });
  }
  lang(e, t) {
    if (!e || this.settings.phrases == null || typeof e != "string" || "<=>=".includes(e)) return this.execTemplate(e, t);
    let s = this.settings.phrases[e];
    return s == null ? (s = e, this.settings.warnNoPhrase && (this.settings.missing || (this.settings.missing = {}), this.settings.missing[e] = "---", this.settings.phrases[e] = "---", console.log(`Missing translation for "%c${e}%c", see %c w2utils.settings.phrases %c with value "---"`, "color: orange", "", "color: #999", ""))) : s !== "---" || this.settings.warnNoPhrase || (s = e), s === "---" && (s = `<span ${this.tooltip(e)}>---</span>`), this.execTemplate(s, t);
  }
  locale(e, t, s) {
    return new Promise((i, a) => {
      if (Array.isArray(e)) {
        this.settings.phrases = {};
        let r = [], l = {};
        e.forEach((h, o) => {
          h.length === 5 && (h = "locale/" + h.toLowerCase() + ".json", e[o] = h), r.push(this.locale(h, true, false));
        }), Promise.allSettled(r).then((h) => {
          h.forEach((o) => {
            o.value && (l[o.value.file] = o.value.data);
          }), e.forEach((o) => {
            this.settings = this.extend({}, this.settings, l[o]);
          }), i();
        });
      } else (e = e || "en-us") instanceof Object ? this.settings = this.extend({}, this.settings, Ne, e) : (e.length === 5 && (e = "locale/" + e.toLowerCase() + ".json"), fetch(e, { method: "GET" }).then((r) => r.json()).then((r) => {
        s !== true && (this.settings = t ? this.extend({}, this.settings, r) : this.extend({}, this.settings, Ne, { phrases: {} }, r)), i({ file: e, data: r });
      }).catch((r) => {
        console.log("ERROR: Cannot load locale " + e), a(r);
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
    return e == null ? (console.log('ERROR: Property "name" is required but not supplied.'), false) : ie[e] != null ? (console.log(`ERROR: Object named "${e}" is already registered as w2ui.${e}.`), false) : !!this.isAlphaNumeric(e) || (console.log('ERROR: Property "name" has to be alpha-numeric (a-z, 0-9, dash and underscore).'), false);
  }
  checkUniqueId(e, t, s, i) {
    Array.isArray(t) || (t = [t]);
    let a = true;
    return t.forEach((r) => {
      r.id === e && (console.log(`ERROR: The item id="${e}" is not unique within the ${s} "${i}".`, t), a = false);
    }), a;
  }
  encodeParams(e, t = "") {
    let s = "";
    return Object.keys(e).forEach((i) => {
      s != "" && (s += "&"), typeof e[i] == "object" ? s += this.encodeParams(e[i], t + i + (t ? "]" : "") + "[") : s += "" + t + i + (t ? "]" : "") + "=" + e[i];
    }), s;
  }
  parseRoute(e) {
    let t = [];
    return e = e.replace(/\/\(/g, "(?:/").replace(/\+/g, "__plus__").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, (s, i, a, r, l, h) => (t.push({ name: r, optional: !!h }), i = i || "", (h ? "" : i) + "(?:" + (h ? i : "") + (a || "") + (l || (a ? "([^/.]+?)" : "([^/]+?)")) + ")" + (h || ""))).replace(/([\/.])/g, "\\$1").replace(/__plus__/g, "(.+)").replace(/\*/g, "(.*)"), { path: new RegExp("^" + e + "$", "i"), keys: t };
  }
  getCursorPosition(e) {
    if (e == null) return null;
    let t = 0;
    var s, i = e.ownerDocument || e.document, a = i.defaultView || i.parentWindow;
    let r;
    return ["INPUT", "TEXTAREA"].includes(e.tagName) ? t = e.selectionStart : a.getSelection ? 0 < (r = a.getSelection()).rangeCount && ((s = (a = r.getRangeAt(0)).cloneRange()).selectNodeContents(e), s.setEnd(a.endContainer, a.endOffset), t = s.toString().length) : (r = i.selection) && r.type !== "Control" && (a = r.createRange(), (s = i.body.createTextRange()).moveToElementText(e), s.setEndPoint("EndToEnd", a), t = s.text.length), t;
  }
  setCursorPosition(e, t, s) {
    if (e != null) {
      var i = document.createRange();
      let a, r = window.getSelection();
      if (["INPUT", "TEXTAREA"].includes(e.tagName)) e.setSelectionRange(t, s ?? t);
      else {
        for (let l = 0; l < e.childNodes.length; l++) {
          let h = n(e.childNodes[l]).text();
          if (t <= (h = e.childNodes[l].tagName ? (h = n(e.childNodes[l]).html()).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ") : h).length) {
            (a = (a = e.childNodes[l]).childNodes && 0 < a.childNodes.length ? a.childNodes[0] : a).childNodes && 0 < a.childNodes.length && (a = a.childNodes[0]);
            break;
          }
          t -= h.length;
        }
        a != null && (t > a.length && (t = a.length), i.setStart(a, t), s ? i.setEnd(a, s) : i.collapse(true), r.removeAllRanges(), r.addRange(i));
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
      var s = e.replace("RGB", "").replace(/\(/g, "").replace(/\)/g, "").split(",");
      t = { r: parseInt(s[0], 10), g: parseInt(s[1], 10), b: parseInt(s[2], 10), a: 1 };
    } else {
      if (!(5 < e.length && e.substr(0, 5) === "RGBA(")) return null;
      s = e.replace("RGBA", "").replace(/\(/g, "").replace(/\)/g, "").split(","), t = { r: parseInt(s[0], 10), g: parseInt(s[1], 10), b: parseInt(s[2], 10), a: parseFloat(s[3]) };
    }
    return t;
  }
  hsv2rgb(e, t, s, i) {
    let a, r, l, h, o, c, d, p;
    switch (arguments.length === 1 && (t = e.s, s = e.v, i = e.a, e = e.h), c = (s /= 100) * (1 - (t /= 100)), d = s * (1 - (o = 6 * (e /= 360) - (h = Math.floor(6 * e))) * t), p = s * (1 - (1 - o) * t), h % 6) {
      case 0:
        a = s, r = p, l = c;
        break;
      case 1:
        a = d, r = s, l = c;
        break;
      case 2:
        a = c, r = s, l = p;
        break;
      case 3:
        a = c, r = d, l = s;
        break;
      case 4:
        a = p, r = c, l = s;
        break;
      case 5:
        a = s, r = c, l = d;
    }
    return { r: Math.round(255 * a), g: Math.round(255 * r), b: Math.round(255 * l), a: i ?? 1 };
  }
  rgb2hsv(e, t, s, i) {
    arguments.length === 1 && (t = e.g, s = e.b, i = e.a, e = e.r);
    let a = Math.max(e, t, s), r = Math.min(e, t, s), l = a - r, h, o = a === 0 ? 0 : l / a, c = a / 255;
    switch (a) {
      case r:
        h = 0;
        break;
      case e:
        h = t - s + l * (t < s ? 6 : 0), h /= 6 * l;
        break;
      case t:
        h = s - e + 2 * l, h /= 6 * l;
        break;
      case s:
        h = e - t + 4 * l, h /= 6 * l;
    }
    return { h: Math.round(360 * h), s: Math.round(100 * o), v: Math.round(100 * c), a: i ?? 1 };
  }
  tooltip(e, t) {
    let s = "mouseenter", i = "mouseleave";
    return t = (t = typeof e == "object" ? e : t) || {}, typeof e == "string" && (t.html = e), t.showOn && (s = t.showOn, delete t.showOn), t.hideOn && (i = t.hideOn, delete t.hideOn), t.name || (t.name = "no-name"), ` on${s}="w2tooltip.show(this, JSON.parse(w2utils.base64decode('${this.base64encode(JSON.stringify(t))}')))" on${i}="w2tooltip.hide('${t.name}')"`;
  }
  isPlainObject(e) {
    return e != null && Object.prototype.toString.call(e) === "[object Object]" && (e.constructor === void 0 || (e = Object.getPrototypeOf(e)) === null || e === Object.prototype);
  }
  clone(e, t) {
    let s;
    return t = Object.assign({ functions: true, elements: true, events: true, exclude: [] }, t ?? {}), Array.isArray(e) ? (s = Array.from(e)).forEach((i, a) => {
      s[a] = this.clone(i, t);
    }) : this.isPlainObject(e) ? (s = {}, Object.assign(s, e), t.exclude && t.exclude.forEach((i) => {
      delete s[i];
    }), Object.keys(s).forEach((i) => {
      s[i] = this.clone(s[i], t), s[i] === void 0 && delete s[i];
    })) : e instanceof Function && !t.functions || e instanceof Node && !t.elements || e instanceof Event && !t.events || (s = e), s;
  }
  extend(e, t) {
    if (Array.isArray(e)) {
      if (!Array.isArray(t)) throw new Error("Arrays can be extended with arrays only");
      e.splice(0, e.length), t.forEach((s) => {
        e.push(this.clone(s));
      });
    } else {
      if (e instanceof Node || e instanceof Event) throw new Error("HTML elmenents and events cannot be extended");
      if (e && typeof e == "object" && t != null) {
        if (typeof t != "object") throw new Error("Object can be extended with other objects only.");
        Object.keys(t).forEach((s) => {
          var i;
          e[s] != null && typeof e[s] == "object" && t[s] != null && typeof t[s] == "object" ? (i = this.clone(t[s]), e[s] instanceof Node || e[s] instanceof Event ? e[s] = i : (Array.isArray(e[s]) && this.isPlainObject(i) && (e[s] = {}), this.extend(e[s], i))) : e[s] = this.clone(t[s]);
        });
      } else if (t != null) throw new Error("Object is not extendable, only {} or [] can be extended.");
    }
    if (2 < arguments.length) for (let s = 2; s < arguments.length; s++) this.extend(e, arguments[s]);
    return e;
  }
  naturalCompare(e, t) {
    let s, i, a = 1, r = 0, l = 0, h = String.alphabet;
    function o(c, d, p) {
      if (p) {
        for (s = d; (p = o(c, s)) < 76 && 65 < p; ) ++s;
        return +c.slice(d - 1, s);
      }
      return -1 < (p = h && h.indexOf(c.charAt(d))) ? p + 76 : (p = c.charCodeAt(d) || 0) < 45 || 127 < p ? p : p < 46 ? 65 : p < 48 ? p - 1 : p < 58 ? p + 18 : p < 65 ? p - 11 : p < 91 ? p + 11 : p < 97 ? p - 37 : p < 123 ? p + 5 : p - 63;
    }
    if ((e += "") != (t += "")) {
      for (; a; ) if (i = o(e, r++), a = o(t, l++), i < 76 && a < 76 && 66 < i && 66 < a && (i = o(e, r, r), a = o(t, l, r = s), l = s), i != a) return i < a ? -1 : 1;
    }
    return 0;
  }
  normMenu(e, t) {
    return Array.isArray(e) ? (e.forEach((s, i) => {
      typeof s == "string" || typeof s == "number" ? e[i] = { id: s, text: String(s) } : s != null ? (s.caption != null && s.text == null && (s.text = s.caption), s.text != null && s.id == null && (s.id = s.text), s.text == null && s.id != null && (s.text = s.id)) : e[i] = { id: null, text: "null" };
    }), e) : typeof e == "function" ? (t = e.call(this, e, t), u.normMenu.call(this, t)) : typeof e == "object" ? Object.keys(e).map((s) => ({ id: s, text: e[s] })) : void 0;
  }
  prepareParams(e, t, s) {
    s = s ?? u.settings.dataType;
    let i = t.body;
    switch (s) {
      case "HTTPJSON":
        i = { request: i }, ["PUT", "DELETE"].includes(t.method) && (t.method = "POST"), a();
        break;
      case "HTTP":
        ["PUT", "DELETE"].includes(t.method) && (t.method = "POST"), a();
        break;
      case "RESTFULL":
        ["PUT", "DELETE"].includes(t.method) ? t.headers["Content-Type"] = "application/json" : a();
        break;
      case "JSON":
        t.method == "GET" ? (i = { request: i }, a()) : (t.headers["Content-Type"] = "application/json", t.method = "POST");
    }
    return t.body = typeof t.body == "string" ? t.body : JSON.stringify(t.body), t;
    function a() {
      Object.keys(i).forEach((r) => {
        let l = i[r];
        typeof l == "object" && (l = JSON.stringify(l)), e.searchParams.append(r, l);
      }), delete t.body;
    }
  }
  bindEvents(e, t) {
    e.length != 0 && ((e == null ? void 0 : e[0]) instanceof Node && (e = Array.isArray(e) ? e : e.get()), n(e).each((s) => {
      let i = n(s).data();
      Object.keys(i).forEach((a) => {
        if (["click", "dblclick", "mouseenter", "mouseleave", "mouseover", "mouseout", "mousedown", "mousemove", "mouseup", "contextmenu", "focus", "focusin", "focusout", "blur", "input", "change", "keydown", "keyup", "keypress"].indexOf(String(a).toLowerCase()) != -1) {
          let r = i[a], l = (r = typeof r == "string" ? r.split("|").map((h) => {
            (h = (h = (h = h === "true" ? true : h) === "false" ? false : h) === "undefined" ? void 0 : h) === "null" && (h = null);
            var o = ["'", '"', "`"];
            return h = typeof (h = parseFloat(h) == h ? parseFloat(h) : h) == "string" && o.includes(h[0]) && o.includes(h[h.length - 1]) ? h.substring(1, h.length - 1) : h;
          }) : r)[0];
          r = r.slice(1), n(s).off(a + ".w2utils-bind").on(a + ".w2utils-bind", function(h) {
            switch (l) {
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
                if (t[l] == null) throw new Error(`Cannot dispatch event as the method "${l}" does not exist.`);
                t[l].apply(t, r.map((o, c) => {
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
    let s;
    return (...i) => {
      clearTimeout(s), s = setTimeout(() => {
        e(...i);
      }, t);
    };
  }
}
var u = new At();
class It extends he {
  constructor() {
    super(), this.defaults = { title: "", text: "", body: "", buttons: "", width: 450, height: 250, focus: null, actions: null, style: "", speed: 0.3, modal: false, maximized: false, keyboard: true, showClose: true, showMax: false, transition: null, openMaximized: false, moved: false }, this.name = "popup", this.status = "closed", this.onOpen = null, this.onClose = null, this.onMax = null, this.onMin = null, this.onToggle = null, this.onKeydown = null, this.onAction = null, this.onMove = null, this.tmp = {}, this.handleResize = (e) => {
      this.options.moved || this.center(void 0, void 0, true);
    };
  }
  open(e) {
    let t = this;
    this.status != "closing" && !n("#w2ui-popup").hasClass("animating") || this.close(true);
    var s = this.options;
    (e = ["string", "number"].includes(typeof e) ? u.extend({ title: "Notification", body: `<div class="w2ui-centered">${e}</div>`, actions: { Ok() {
      t.close();
    } }, cancelAction: "ok" }, arguments[1] ?? {}) : e).text != null && (e.body = `<div class="w2ui-centered w2ui-msg-text">${e.text}</div>`), e = Object.assign({}, this.defaults, s, { title: "", body: "" }, e, { maximized: false }), this.options = e, n("#w2ui-popup").length === 0 && (this.off("*"), Object.keys(this).forEach((c) => {
      c.startsWith("on") && c != "on" && (this[c] = null);
    })), Object.keys(e).forEach((c) => {
      c.startsWith("on") && c != "on" && e[c] && (this[c] = e[c]);
    }), e.width = parseInt(e.width), e.height = parseInt(e.height);
    let i, a, r;
    var { top: l, left: h } = this.center();
    let o = { self: this, action(c) {
      return t.on("action.prom", c), o;
    }, close(c) {
      return t.on("close.prom", c), o;
    }, then(c) {
      return t.on("open:after.prom", c), o;
    } };
    if (e.actions == null || e.buttons || (e.buttons = "", Object.keys(e.actions).forEach((c) => {
      var d = e.actions[c];
      let p = c;
      typeof d == "function" && (e.buttons += `<button class="w2ui-btn w2ui-eaction" data-click='["action","${c}","event"]'>${c}</button>`), typeof d == "object" && (e.buttons += `<button class="w2ui-btn w2ui-eaction ${d.class || ""}" name="${c}" data-click='["action","${c}","event"]'
                        style="${d.style}" ${d.attrs}>${d.text || c}</button>`, p = Array.isArray(e.actions) ? d.text : c), typeof d == "string" && (e.buttons += `<button class="w2ui-btn w2ui-eaction" data-click='["action","${d}","event"]'>${d}</button>`, p = d), typeof p == "string" && (p = p[0].toLowerCase() + p.substr(1).replace(/\s+/g, "")), o[p] = function(f) {
        return t.on("action.buttons", (m) => {
          m.detail.action[0].toLowerCase() + m.detail.action.substr(1).replace(/\s+/g, "") == p && f(m);
        }), o;
      };
    })), n("#w2ui-popup").length === 0) {
      if ((i = this.trigger("open", { target: "popup", present: false })).isCancelled === true) return;
      this.status = "opening", u.lock(document.body, { opacity: 0.3, onClick: e.modal ? null : () => {
        this.close();
      } });
      let c = "";
      e.showClose && (c += `<div class="w2ui-popup-button w2ui-popup-close">
                            <span class="w2ui-icon w2ui-icon-cross w2ui-eaction" data-mousedown="stop" data-click="close"></span>
                        </div>`), e.showMax && (c += `<div class="w2ui-popup-button w2ui-popup-max">
                            <span class="w2ui-icon w2ui-icon-box w2ui-eaction" data-mousedown="stop" data-click="toggle"></span>
                        </div>`), h = `
                left: ${h}px;
                top: ${l}px;
                width: ${parseInt(e.width)}px;
                height: ${parseInt(e.height)}px;
                transition: ${e.speed}s
            `, a = `<div id="w2ui-popup" class="w2ui-popup w2ui-anim-open animating" style="${u.stripSpaces(h)}"></div>`, n("body").append(a), n("#w2ui-popup")[0]._w2popup = { self: this, created: new Promise((d) => {
        this._promCreated = d;
      }), opened: new Promise((d) => {
        this._promOpened = d;
      }), closing: new Promise((d) => {
        this._promClosing = d;
      }), closed: new Promise((d) => {
        this._promClosed = d;
      }) }, h = `${e.title ? "" : "top: 0px !important;"} ` + (e.buttons ? "" : "bottom: 0px !important;"), a = `
                <span name="hidden-first" tabindex="0" style="position: absolute; top: -100px"></span>
                <div class="w2ui-popup-title-btns">${c}</div>
                <div class="w2ui-popup-title" style="${e.title ? "" : "display: none"}"></div>
                <div class="w2ui-box" style="${h}">
                    <div class="w2ui-popup-body ${!e.title || " w2ui-popup-no-title"}
                        ${!e.buttons || " w2ui-popup-no-buttons"}" style="${e.style}">
                    </div>
                </div>
                <div class="w2ui-popup-buttons" style="${e.buttons ? "" : "display: none"}"></div>
                <span name="hidden-last" tabindex="0" style="position: absolute; top: -100px"></span>
            `, n("#w2ui-popup").html(a), e.title && n("#w2ui-popup .w2ui-popup-title").append(u.lang(e.title)), e.buttons && n("#w2ui-popup .w2ui-popup-buttons").append(e.buttons), e.body && n("#w2ui-popup .w2ui-popup-body").append(e.body), setTimeout(() => {
        n("#w2ui-popup").css("transition", e.speed + "s").removeClass("w2ui-anim-open"), u.bindEvents("#w2ui-popup .w2ui-eaction", this), n("#w2ui-popup").find(".w2ui-popup-body").show(), this._promCreated();
      }, 1), clearTimeout(this._timer), this._timer = setTimeout(() => {
        this.status = "open", t.setFocus(e.focus), i.finish(), this._promOpened(), n("#w2ui-popup").removeClass("animating");
      }, 1e3 * e.speed);
    } else {
      if ((i = this.trigger("open", { target: "popup", present: true })).isCancelled === true) return;
      this.status = "opening", s != null && (s.maximized || s.width == e.width && s.height == e.height || this.resize(e.width, e.height), e.prevSize = e.width + "px:" + e.height + "px", e.maximized = s.maximized), l = n("#w2ui-popup .w2ui-box").get(0).cloneNode(true), n(l).removeClass("w2ui-box").addClass("w2ui-box-temp").find(".w2ui-popup-body").empty().append(e.body), n("#w2ui-popup .w2ui-box").after(l), e.buttons ? (n("#w2ui-popup .w2ui-popup-buttons").show().html("").append(e.buttons), n("#w2ui-popup .w2ui-popup-body").removeClass("w2ui-popup-no-buttons"), n("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("bottom", "")) : (n("#w2ui-popup .w2ui-popup-buttons").hide().html(""), n("#w2ui-popup .w2ui-popup-body").addClass("w2ui-popup-no-buttons"), n("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("bottom", "0px")), e.title ? (n("#w2ui-popup .w2ui-popup-title").show().html((e.showClose ? `<div class="w2ui-popup-button w2ui-popup-close">
                                <span class="w2ui-icon w2ui-icon-cross w2ui-eaction" data-mousedown="stop" data-click="close"></span>
                            </div>` : "") + (e.showMax ? `<div class="w2ui-popup-button w2ui-popup-max">
                                <span class="w2ui-icon w2ui-icon-box w2ui-eaction" data-mousedown="stop" data-click="toggle"></span>
                            </div>` : "")).append(e.title), n("#w2ui-popup .w2ui-popup-body").removeClass("w2ui-popup-no-title"), n("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("top", "")) : (n("#w2ui-popup .w2ui-popup-title").hide().html(""), n("#w2ui-popup .w2ui-popup-body").addClass("w2ui-popup-no-title"), n("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("top", "0px"));
      let c = n("#w2ui-popup .w2ui-box")[0], d = n("#w2ui-popup .w2ui-box-temp")[0];
      n("#w2ui-popup").addClass("animating"), u.transition(c, d, e.transition, () => {
        n(c).remove(), n(d).removeClass("w2ui-box-temp").addClass("w2ui-box");
        var p = n(d).find(".w2ui-popup-body");
        p.length == 1 && (p[0].style.cssText = e.style, p.show()), t.setFocus(e.focus), n("#w2ui-popup").removeClass("animating");
      }), this.status = "open", i.finish(), u.bindEvents("#w2ui-popup .w2ui-eaction", this), n("#w2ui-popup").find(".w2ui-popup-body").show();
    }
    return e.openMaximized && this.max(), e._last_focus = document.activeElement, e.keyboard && n(document.body).on("keydown", (c) => {
      this.keydown(c);
    }), n(window).on("resize", this.handleResize), r = { resizing: false, mvMove: function(c) {
      r.resizing == 1 && (c = c || window.event, r.div_x = c.screenX - r.x, r.div_y = c.screenY - r.y, (c = t.trigger("move", { target: "popup", div_x: r.div_x, div_y: r.div_y, originalEvent: c })).isCancelled !== true) && (n("#w2ui-popup").css({ transition: "none", transform: "translate3d(" + r.div_x + "px, " + r.div_y + "px, 0px)" }), t.options.moved = true, c.finish());
    }, mvStop: function(c) {
      r.resizing != 1 || (c = c || window.event, t.status = "open", r.div_x = c.screenX - r.x, r.div_y = c.screenY - r.y, n("#w2ui-popup").css({ left: r.pos_x + r.div_x + "px", top: r.pos_y + r.div_y + "px" }).css({ transition: "none", transform: "translate3d(0px, 0px, 0px)" }), r.resizing = false, n(document.body).off(".w2ui-popup"), r.isLocked) || t.unlock();
    } }, n("#w2ui-popup .w2ui-popup-title").on("mousedown", function(c) {
      var d;
      t.options.maximized || (c = (c = c) || window.event, t.status = "moving", d = n("#w2ui-popup").get(0).getBoundingClientRect(), Object.assign(r, { resizing: true, isLocked: n("#w2ui-popup > .w2ui-lock").length == 1, x: c.screenX, y: c.screenY, pos_x: d.x, pos_y: d.y }), r.isLocked || t.lock({ opacity: 0 }), n(document.body).on("mousemove.w2ui-popup", r.mvMove).on("mouseup.w2ui-popup", r.mvStop), c.stopPropagation ? c.stopPropagation() : c.cancelBubble = true, c.preventDefault && c.preventDefault());
    }), o;
  }
  load(e) {
    return new Promise((t, s) => {
      if ((e = typeof e == "string" ? { url: e } : e).url == null) console.log("ERROR: The url is not defined."), s("The url is not defined");
      else {
        this.status = "loading";
        let [i, a] = String(e.url).split("#");
        i && fetch(i).then((r) => r.text()).then((r) => {
          t(this.template(r, a, e));
        });
      }
    });
  }
  template(e, t, s = {}) {
    let i;
    try {
      i = n(e);
    } catch {
      i = n.html(e);
    }
    return t && (i = i.filter("#" + t)), Object.assign(s, { width: parseInt(n(i).css("width")), height: parseInt(n(i).css("height")), title: n(i).find("[rel=title]").html(), body: n(i).find("[rel=body]").html(), buttons: n(i).find("[rel=buttons]").html(), style: n(i).find("[rel=body]").get(0).style.cssText }), this.open(s);
  }
  action(e, t) {
    let s = this.options.actions[e];
    s instanceof Object && s.onClick && (s = s.onClick), e = this.trigger("action", { action: e, target: "popup", self: this, originalEvent: t, value: this.input ? this.input.value : null }), e.isCancelled !== true && (typeof s == "function" && s.call(this, t), e.finish());
  }
  keydown(e) {
    var t;
    this.options && !this.options.keyboard || (t = this.trigger("keydown", { target: "popup", originalEvent: e })).isCancelled !== true && (e.keyCode === 27 && (e.preventDefault(), n("#w2ui-popup .w2ui-message").length == 0) && (this.options.cancelAction ? this.action(this.options.cancelAction) : this.close()), t.finish());
  }
  close(e) {
    let t = this.trigger("close", { target: "popup" });
    var s;
    t.isCancelled !== true && (s = () => {
      n("#w2ui-popup").remove(), this.options._last_focus && 0 < this.options._last_focus.length && this.options._last_focus.focus(), this.status = "closed", this.options = {}, t.finish(), this._promClosed();
    }, n("#w2ui-popup").length !== 0) && this.status != "closed" && (this.status == "opening" && (e = true), this.status == "closing" && e === true ? (s(), clearTimeout(this.tmp.closingTimer), u.unlock(document.body, 0)) : (this.status = "closing", n("#w2ui-popup").css("transition", this.options.speed + "s").addClass("w2ui-anim-close animating"), u.unlock(document.body, 300), this._promClosing(), e ? s() : this.tmp.closingTimer = setTimeout(s, 1e3 * this.options.speed), this.options.keyboard && n(document.body).off("keydown", this.keydown), n(window).off("resize", this.handleResize)));
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
    return u.message({ owner: this, box: n("#w2ui-popup").get(0), after: ".w2ui-popup-title" }, e);
  }
  confirm(e) {
    return u.confirm({ owner: this, box: n("#w2ui-popup"), after: ".w2ui-popup-title" }, e);
  }
  setFocus(e) {
    var _a;
    let t = n("#w2ui-popup"), s = "input, button, select, textarea, [contentEditable], .w2ui-input";
    e != null ? (_a = isNaN(e) ? t.find(s).filter(e).get(0) : t.find(s).get(e)) == null ? void 0 : _a.focus() : (e = t.find("[name=hidden-first]").get(0)) && e.focus(), n(t).find(s + ",[name=hidden-first],[name=hidden-last]").off(".keep-focus").on("blur.keep-focus", function(i) {
      setTimeout(() => {
        var _a2, _b, _c;
        var a = document.activeElement, r = 0 < n(t).find(s).filter(a).length, l = n(a).attr("name");
        !r && a && a !== document.body && ((_a2 = n(t).find(s).get(0)) == null ? void 0 : _a2.focus()), l == "hidden-last" && ((_b = n(t).find(s).get(0)) == null ? void 0 : _b.focus()), l == "hidden-first" && ((_c = n(t).find(s).get(-1)) == null ? void 0 : _c.focus());
      }, 1);
    });
  }
  lock(e, t) {
    var s = Array.from(arguments);
    s.unshift(n("#w2ui-popup")), u.lock(...s);
  }
  unlock(e) {
    u.unlock(n("#w2ui-popup"), e);
  }
  center(e, t, s) {
    let i, a;
    a = window.innerHeight == null ? (i = parseInt(document.documentElement.offsetWidth), parseInt(document.documentElement.offsetHeight)) : (i = parseInt(window.innerWidth), parseInt(window.innerHeight)), e = parseInt(e ?? this.options.width), t = parseInt(t ?? this.options.height), this.options.maximized === true && (e = i, t = a), i - 10 < e && (e = i - 10), a - 10 < t && (t = a - 10);
    var r = (a - t) / 2, l = (i - e) / 2;
    return s && (n("#w2ui-popup").css({ transition: "none", top: r + "px", left: l + "px", width: e + "px", height: t + "px" }), this.resizeMessages()), { top: r, left: l, width: e, height: t };
  }
  resize(a, r, s) {
    let i = this;
    this.options.speed == null && (this.options.speed = 0);
    var { top: a, left: r, width: l, height: h } = this.center(a, r), o = this.options.speed;
    n("#w2ui-popup").css({ transition: o + `s width, ${o}s height, ${o}s left, ${o}s top`, top: a + "px", left: r + "px", width: l + "px", height: h + "px" });
    let c = setInterval(() => {
      i.resizeMessages();
    }, 10);
    setTimeout(() => {
      clearInterval(c), i.resizeMessages(), typeof s == "function" && s();
    }, 1e3 * this.options.speed + 50);
  }
  resizeMessages() {
    n("#w2ui-popup .w2ui-message").each((e) => {
      var t = e._msg_options, s = n("#w2ui-popup"), a = (parseInt(t.width) < 10 && (t.width = 10), parseInt(t.height) < 10 && (t.height = 10), s[0].getBoundingClientRect()), s = parseInt(s.find(".w2ui-popup-title")[0].clientHeight), i = parseInt(a.width), a = parseInt(a.height);
      t.width = t.originalWidth, t.width > i - 10 && (t.width = i - 10), t.height = t.originalHeight, t.height > a - s - 5 && (t.height = a - s - 5), t.originalHeight < 0 && (t.height = a + t.originalHeight - s), t.originalWidth < 0 && (t.width = i + 2 * t.originalWidth), n(e).css({ left: (i - t.width) / 2 + "px", width: t.width + "px", height: t.height + "px" });
    });
  }
}
new It();
const _j = class _j {
  constructor() {
    this.defaults = { name: null, html: "", style: "", class: "", position: "top|bottom", align: "", anchor: null, anchorClass: "", anchorStyle: "", autoShow: false, autoShowOn: null, autoHideOn: null, arrowSize: 8, margin: 0, margin: 1, screenMargin: 2, autoResize: true, offsetX: 0, offsetY: 0, maxWidth: null, maxHeight: null, watchScroll: null, watchResize: null, hideOn: null, onThen: null, onShow: null, onHide: null, onUpdate: null, onMove: null };
  }
  trigger(e, t) {
    var s;
    if (arguments.length == 2 && (s = e, (e = t).type = s), e.overlay) return e.overlay.trigger(e);
    console.log("ERROR: cannot find overlay where to trigger events");
  }
  get(e) {
    return arguments.length == 0 ? Object.keys(_j.active) : e === true ? _j.active : _j.active[e.replace(/[\s\.#]/g, "_")];
  }
  attach(e, t) {
    let s, i, a = this;
    if (arguments.length != 0) {
      arguments.length == 1 && e.anchor ? e = (s = e).anchor : arguments.length === 2 && typeof t == "string" ? t = (s = { anchor: e, html: t }).html : arguments.length === 2 && t != null && typeof t == "object" && (t = (s = t).html), s = u.extend({}, this.defaults, s || {}), !(t = !t && s.text ? s.text : t) && s.html && (t = s.html), delete s.anchor;
      let r = s.name || e.id;
      e != document && e != document.body || (e = document.body, r = "context-menu"), r || (r = "noname-" + Object.keys(_j.active).length, console.log("NOTICE: name property is not defined for tooltip, could lead to too many instances")), r = r.replace(/[\s\.#]/g, "_"), _j.active[r] ? ((i = _j.active[r]).prevOptions = i.options, i.options = s, i.anchor = e, i.prevOptions.html == i.options.html && i.prevOptions.class == i.options.class && i.prevOptions.style == i.options.style || (i.needsUpdate = true), s = i.options) : (i = new he(), Object.assign(i, { id: "w2overlay-" + r, name: r, options: s, anchor: e, displayed: false, tmp: { observeResize: new ResizeObserver(() => {
        this.resize(i.name);
      }) }, hide() {
        a.hide(r);
      } }), _j.active[r] = i), Object.keys(i.options).forEach((h) => {
        var o = i.options[h];
        h.startsWith("on") && typeof o == "function" && (i[h] = o, delete i.options[h]);
      }), s.autoShow === true && (s.autoShowOn = s.autoShowOn ?? "mouseenter", s.autoHideOn = s.autoHideOn ?? "mouseleave", s.autoShow = false), s.autoShowOn && (t = "autoShow-" + i.name, n(e).off("." + t).on(s.autoShowOn + "." + t, (h) => {
        a.show(i.name), h.stopPropagation();
      }), delete s.autoShowOn), s.autoHideOn && (t = "autoHide-" + i.name, n(e).off("." + t).on(s.autoHideOn + "." + t, (h) => {
        a.hide(i.name), h.stopPropagation();
      }), delete s.autoHideOn), i.off(".attach");
      let l = { overlay: i, then: (h) => (i.on("show:after.attach", (o) => {
        h(o);
      }), l), show: (h) => (i.on("show.attach", (o) => {
        h(o);
      }), l), hide: (h) => (i.on("hide.attach", (o) => {
        h(o);
      }), l), update: (h) => (i.on("update.attach", (o) => {
        h(o);
      }), l), move: (h) => (i.on("move.attach", (o) => {
        h(o);
      }), l) };
      return l;
    }
  }
  update(e, t) {
    var s = _j.active[e];
    s ? (s.needsUpdate = true, s.options.html = t, this.show(e)) : console.log(`Tooltip "${e}" is not displayed. Cannot update it.`);
  }
  show(e) {
    if (e instanceof HTMLElement || e instanceof Object) {
      let l = e, h = (e instanceof HTMLElement && ((l = arguments[1] || {}).anchor = e), this.attach(l));
      return n(h.overlay.anchor).off(".autoShow-" + h.overlay.name).off(".autoHide-" + h.overlay.name), setTimeout(() => {
        this.show(h.overlay.name), this.initControls && this.initControls(h.overlay);
      }, 1), h;
    }
    let t, s = this, i = _j.active[e.replace(/[\s\.#]/g, "_")];
    if (i) {
      let l = i.options;
      if (!i || i.displayed && !i.needsUpdate) this.resize(i == null ? void 0 : i.name);
      else {
        var a = l.position.split("|"), a = ["top", "bottom"].includes(a[0]);
        let h = l.align == "both" && a ? "" : "white-space: nowrap;";
        if (l.maxWidth && u.getStrWidth(l.html, "") > l.maxWidth && (h = "width: " + l.maxWidth + "px; white-space: inherit; overflow: auto;"), h += " max-height: " + (l.maxHeight || window.innerHeight - 40) + "px;", l.html !== "" && l.html != null) {
          if (i.box) {
            if ((t = this.trigger("update", { target: e, overlay: i })).isCancelled === true) return void (i.prevOptions && (i.options = i.prevOptions, delete i.prevOptions));
            n(i.box).find(".w2ui-overlay-body").attr("style", (l.style || "") + "; " + h).removeClass().addClass("w2ui-overlay-body " + l.class).html(l.html);
          } else {
            if ((t = this.trigger("show", { target: e, overlay: i })).isCancelled === true) return;
            n("body").append(`<div id="${i.id}" name="${e}" style="display: none; pointer-events: none" class="w2ui-overlay"
                        data-click="stop" data-focusin="stop">
                    <style></style>
                    <div class="w2ui-overlay-body ${l.class}" style="${l.style || ""}; ${h}">
                        ${l.html}
                    </div>
                </div>`), i.box = n("#" + u.escapeId(i.id))[0], i.displayed = true, a = n(i.anchor).data("tooltipName") ?? [], a.push(e), n(i.anchor).data("tooltipName", a), u.bindEvents(i.box, {}), i.tmp.originalCSS = "", 0 < n(i.anchor).length && (i.tmp.originalCSS = n(i.anchor)[0].style.cssText);
          }
          this.resize(i.name), l.anchorStyle && (i.anchor.style.cssText += ";" + l.anchorStyle), !l.anchorClass || l.anchorClass == "w2ui-focus" && i.anchor == document.body || n(i.anchor).addClass(l.anchorClass), typeof l.hideOn == "string" && (l.hideOn = [l.hideOn]), Array.isArray(l.hideOn) || (l.hideOn = []), Object.assign(i.tmp, { scrollLeft: document.body.scrollLeft, scrollTop: document.body.scrollTop });
          {
            let o = (p) => {
              s.hide(i.name);
            }, c = n(i.anchor), d = "tooltip-" + i.name;
            n("body").off("." + d), l.hideOn.includes("doc-click") && (["INPUT", "TEXTAREA"].includes(i.anchor.tagName) && c.off(`.${d}-doc`).on(`click.${d}-doc`, (p) => {
              p.stopPropagation();
            }), n("body").on("click." + d, o)), l.hideOn.includes("focus-change") && n("body").on("focusin." + d, (p) => {
              document.activeElement != i.anchor && s.hide(i.name);
            }), ["INPUT", "TEXTAREA"].includes(i.anchor.tagName) && (c.off("." + d), l.hideOn.forEach((p) => {
              ["doc-click", "focus-change"].indexOf(p) == -1 && c.on(p + "." + d, { once: true }, o);
            }));
          }
          {
            var r = document.body;
            let o = "tooltip-" + i.name, c = r;
            r.tagName == "BODY" && (c = r.ownerDocument), n(c).off("." + o).on("scroll." + o, (d) => {
              Object.assign(i.tmp, { scrollLeft: r.scrollLeft, scrollTop: r.scrollTop }), s.resize(i.name);
            });
          }
          return n(i.box).show(), i.tmp.observeResize.observe(i.box), _j.observeRemove.observe(document.body, { subtree: true, childList: true }), n(i.box).css("opacity", 1).find(".w2ui-overlay-body").html(l.html), setTimeout(() => {
            n(i.box).css({ "pointer-events": "auto" }).data("ready", "yes");
          }, 100), delete i.needsUpdate, i.box.overlay = i, t && t.finish(), { overlay: i };
        }
        s.hide(e);
      }
    }
  }
  hide(e) {
    var _a;
    let t;
    if (arguments.length == 0) Object.keys(_j.active).forEach((a) => {
      this.hide(a);
    });
    else if (e instanceof HTMLElement) (n(e).data("tooltipName") ?? []).forEach((a) => {
      this.hide(a);
    });
    else if (typeof e == "string" && (e = e.replace(/[\s\.#]/g, "_"), t = _j.active[e]), t && t.box && (delete _j.active[e], e = this.trigger("hide", { target: e, overlay: t }), e.isCancelled !== true)) {
      var s = "tooltip-" + t.name;
      (_a = t.tmp.observeResize) == null ? void 0 : _a.disconnect(), t.options.watchScroll && n(t.options.watchScroll).off(".w2scroll-" + t.name);
      let a = 0;
      Object.keys(_j.active).forEach((r) => {
        _j.active[r].displayed && a++;
      }), a == 0 && _j.observeRemove.disconnect(), n("body").off("." + s), n(document).off("." + s), t.box.remove(), t.box = null, t.displayed = false;
      var i = n(t.anchor).data("tooltipName") ?? [];
      i.indexOf(t.name) != -1 && i.splice(i.indexOf(t.name), 1), i.length == 0 ? n(t.anchor).removeData("tooltipName") : n(t.anchor).data("tooltipName", i), t.anchor.style.cssText = t.tmp.originalCSS, n(t.anchor).off("." + s).removeClass(t.options.anchorClass), e.finish();
    }
  }
  resize(e) {
    if (arguments.length == 0) Object.keys(_j.active).forEach((i) => {
      i = _j.active[i], i.displayed && this.resize(i.name);
    });
    else {
      var t = _j.active[e.replace(/[\s\.#]/g, "_")];
      let i = this.getPosition(t.name);
      var s = i.left + "x" + i.top;
      let a;
      t.tmp.lastPos != s && (a = this.trigger("move", { target: e, overlay: t, pos: i })), n(t.box).css({ left: i.left + "px", top: i.top + "px" }).then((r) => {
        i.width != null && r.css("width", i.width + "px").find(".w2ui-overlay-body").css("width", "100%"), i.height != null && r.css("height", i.height + "px").find(".w2ui-overlay-body").css("height", "100%");
      }).find(".w2ui-overlay-body").removeClass("w2ui-arrow-right w2ui-arrow-left w2ui-arrow-top w2ui-arrow-bottom").addClass(i.arrow.class).closest(".w2ui-overlay").find("style").text(i.arrow.style), t.tmp.lastPos != s && a && (t.tmp.lastPos = s, a.finish());
    }
  }
  getPosition(e) {
    let t = _j.active[e.replace(/[\s\.#]/g, "_")];
    if (t && t.box) {
      let d = t.options;
      (t.tmp.resizedY || t.tmp.resizedX) && n(t.box).css({ width: "", height: "", scroll: "auto" });
      var e = u.scrollBarSize(), s = document.body.scrollWidth != document.body.clientWidth, i = document.body.scrollHeight != document.body.clientHeight;
      let f = { width: window.innerWidth - (i ? e : 0), height: window.innerHeight - (s ? e : 0) };
      var a, r = (d.position == "auto" ? "top|bottom|right|left" : d.position).split("|");
      let m = ["top", "bottom"].includes(r[0]), b = t.box.getBoundingClientRect(), v = t.anchor.getBoundingClientRect(), g = (t.anchor == document.body && ({ x: l, y: h, width: o, height: c } = d.originalEvent, v = { left: l - 2, top: h - 4, width: o, height: c, arrow: "none" }), d.arrowSize), y = (v.arrow == "none" && (g = 0), { top: v.top, bottom: f.height - (v.top + v.height) - +(s ? e : 0), left: v.left, right: f.width - (v.left + v.width) + (i ? e : 0) });
      b.width < 22 && (b.width = 22), b.height < 14 && (b.height = 14);
      let w, C, $, I, E = "", T = { offset: 0, class: "", style: `#${t.id} { --tip-size: ${g}px; }` }, R = { left: 0, top: 0 }, k = { posX: "", x: 0, posY: "", y: 0 };
      r.forEach((_) => {
        ["top", "bottom"].includes(_) && (!E && b.height + g / 1.893 < y[_] && (E = _), y[_] > k.y) && Object.assign(k, { posY: _, y: y[_] }), ["left", "right"].includes(_) && (!E && b.width + g / 1.893 < y[_] && (E = _), y[_] > k.x) && Object.assign(k, { posX: _, x: y[_] });
      }), E = E || (m ? k.posY : k.posX), d.autoResize && (["top", "bottom"].includes(E) && (b.height > y[E] ? (I = y[E], t.tmp.resizedY = true) : t.tmp.resizedY = false), ["left", "right"].includes(E)) && (b.width > y[E] ? ($ = y[E], t.tmp.resizedX = true) : t.tmp.resizedX = false);
      var l = E;
      switch (T.class = v.arrow || "w2ui-arrow-" + l, l) {
        case "top":
          w = v.left + (v.width - ($ ?? b.width)) / 2, C = v.top - (I ?? b.height) - g / 1.5 + 1;
          break;
        case "bottom":
          w = v.left + (v.width - ($ ?? b.width)) / 2, C = v.top + v.height + g / 1.25 + 1;
          break;
        case "left":
          w = v.left - ($ ?? b.width) - g / 1.2 - 1, C = v.top + (v.height - (I ?? b.height)) / 2;
          break;
        case "right":
          w = v.left + v.width + g / 1.2 + 1, C = v.top + (v.height - (I ?? b.height)) / 2;
      }
      m && (d.align == "left" && (R.left = v.left - w, w = v.left), d.align == "right" && (R.left = v.left + v.width - ($ ?? b.width) - w, w = v.left + v.width - ($ ?? b.width)), ["top", "bottom"].includes(E) && d.align.startsWith("both") && (a = d.align.split(":")[1] ?? 50, v.width >= a) && (w = v.left, $ = v.width), d.align == "top" && (R.top = v.top - C, C = v.top), d.align == "bottom" && (R.top = v.top + v.height - (I ?? b.height) - C, C = v.top + v.height - (I ?? b.height)), ["left", "right"].includes(E) && d.align.startsWith("both") && (a = d.align.split(":")[1] ?? 50, v.height >= a) && (C = v.top, I = v.height));
      {
        let _;
        (["left", "right"].includes(d.align) && v.width < ($ ?? b.width) || ["top", "bottom"].includes(d.align) && v.height < (I ?? b.height)) && (_ = true);
        var h = E == "right" ? g : d.screenMargin, o = E == "bottom" ? g : d.screenMargin, c = f.width - ($ ?? b.width) - (E == "left" ? g : d.screenMargin), s = f.height - (I ?? b.height) - (E == "top" ? g : d.screenMargin) + 3;
        (["top", "bottom"].includes(E) || d.autoResize) && (w < h && (_ = true, R.left -= w, w = h), w > c) && (_ = true, R.left -= w - c, w += c - w), (["left", "right"].includes(E) || d.autoResize) && (C < o && (_ = true, R.top -= C, C = o), C > s) && (_ = true, R.top -= C - s, C += s - C), _ && (h = m ? "left" : "top", c = m ? "width" : "height", T.offset = -R[h], o = b[c] / 2 - g, Math.abs(T.offset) > o + g && (T.class = ""), Math.abs(T.offset) > o && (T.offset = T.offset < 0 ? -o : o), T.style = u.stripSpaces(`#${t.id} .w2ui-overlay-body:after,
                            #${t.id} .w2ui-overlay-body:before {
                                --tip-size: ${g}px;
                                margin-${h}: ${T.offset}px;
                            }`));
      }
      return i = E == "top" ? -d.margin : E == "bottom" ? d.margin : 0, e = E == "left" ? -d.margin : E == "right" ? d.margin : 0, C = Math.floor(100 * (C + parseFloat(d.offsetY) + parseFloat(i))) / 100, { left: w = Math.floor(100 * (w + parseFloat(d.offsetX) + parseFloat(e))) / 100, top: C, arrow: T, adjust: R, width: $, height: I, pos: E };
    }
  }
};
__publicField(_j, "active", {});
__publicField(_j, "observeRemove", new MutationObserver((e) => {
  let t = 0;
  Object.keys(_j.active).forEach((s) => {
    s = _j.active[s], s.displayed && (s.anchor && s.anchor.isConnected ? t++ : s.hide());
  }), t === 0 && _j.observeRemove.disconnect();
}));
let j = _j;
class Dt extends j {
  constructor() {
    super(), this.palette = [["000000", "333333", "555555", "777777", "888888", "999999", "AAAAAA", "CCCCCC", "DDDDDD", "EEEEEE", "F7F7F7", "FFFFFF"], ["FF011B", "FF9838", "FFC300", "FFFD59", "86FF14", "14FF7A", "2EFFFC", "2693FF", "006CE7", "9B24F4", "FF21F5", "FF0099"], ["FFEAEA", "FCEFE1", "FCF4DC", "FFFECF", "EBFFD9", "D9FFE9", "E0FFFF", "E8F4FF", "ECF4FC", "EAE6F4", "FFF5FE", "FCF0F7"], ["F4CCCC", "FCE5CD", "FFF1C2", "FFFDA1", "D5FCB1", "B5F7D0", "BFFFFF", "D6ECFF", "CFE2F3", "D9D1E9", "FFE3FD", "FFD9F0"], ["EA9899", "F9CB9C", "FFE48C", "F7F56F", "B9F77E", "84F0B1", "83F7F7", "B5DAFF", "9FC5E8", "B4A7D6", "FAB9F6", "FFADDE"], ["E06666", "F6B26B", "DEB737", "E0DE51", "8FDB48", "52D189", "4EDEDB", "76ACE3", "6FA8DC", "8E7CC3", "E07EDA", "F26DBD"], ["CC0814", "E69138", "AB8816", "B5B20E", "6BAB30", "27A85F", "1BA8A6", "3C81C7", "3D85C6", "674EA7", "A14F9D", "BF4990"], ["99050C", "B45F17", "80650E", "737103", "395E14", "10783D", "13615E", "094785", "0A5394", "351C75", "780172", "782C5A"]], this.defaults = u.extend({}, this.defaults, { advanced: false, transparent: true, position: "top|bottom", class: "w2ui-white", color: "", liveUpdate: true, arrowSize: 12, autoResize: false, anchorClass: "w2ui-focus", autoShowOn: "focus", hideOn: ["doc-click", "focus-change"], onSelect: null, onLiveUpdate: null });
  }
  attach(e, t) {
    let s;
    arguments.length == 1 && e.anchor ? e = (s = e).anchor : arguments.length === 2 && t != null && typeof t == "object" && ((s = t).anchor = e), t = s.hideOn, s = u.extend({}, this.defaults, s || {}), t && (s.hideOn = t), s.style += "; padding: 0;", s.transparent && this.palette[0][1] == "333333" && (this.palette[0].splice(1, 1), this.palette[0].push("")), s.transparent || this.palette[0][1] == "333333" || (this.palette[0].splice(1, 0, "333333"), this.palette[0].pop()), s.color && (s.color = String(s.color).toUpperCase()), typeof s.color == "string" && s.color.substr(0, 1) === "#" && (s.color = s.color.substr(1)), this.index = [-1, -1];
    let i = super.attach(s), a = i.overlay;
    return a.options.html = this.getColorHTML(a.name, s), a.on("show.attach", (l) => {
      var l = l.detail.overlay, h = l.anchor, o = l.options;
      ["INPUT", "TEXTAREA"].includes(h.tagName) && !o.color && h.value && (l.tmp.initColor = h.value), delete l.newColor;
    }), a.on("show:after.attach", (r) => {
      var _a;
      var l;
      ((_a = i.overlay) == null ? void 0 : _a.box) && (l = n(i.overlay.box).find(".w2ui-eaction"), u.bindEvents(l, this), this.initControls(i.overlay));
    }), a.on("update:after.attach", (r) => {
      var _a;
      var l;
      ((_a = i.overlay) == null ? void 0 : _a.box) && (l = n(i.overlay.box).find(".w2ui-eaction"), u.bindEvents(l, this), this.initControls(i.overlay));
    }), a.on("hide.attach", (l) => {
      var l = l.detail.overlay, o = l.anchor, h = l.newColor ?? l.options.color ?? "", o = (["INPUT", "TEXTAREA"].includes(o.tagName) && o.value != h && (o.value = h), this.trigger("select", { color: h, target: l.name, overlay: l }));
      o.isCancelled !== true && o.finish();
    }), i.liveUpdate = (r) => (a.on("liveUpdate.attach", (l) => {
      r(l);
    }), i), i.select = (r) => (a.on("select.attach", (l) => {
      r(l);
    }), i), i;
  }
  select(e, a) {
    let s;
    this.index = [-1, -1], typeof a != "string" && (s = a.target, this.index = n(s).attr("index").split(":"), a = n(s).closest(".w2ui-overlay").attr("name"));
    var i = this.get(a), a = this.trigger("liveUpdate", { color: e, target: a, overlay: i, param: arguments[1] });
    a.isCancelled !== true && (["INPUT", "TEXTAREA"].includes(i.anchor.tagName) && i.options.liveUpdate && n(i.anchor).val(e), i.newColor = e, n(i.box).find(".w2ui-selected").removeClass("w2ui-selected"), s && n(s).addClass("w2ui-selected"), a.finish());
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
  tabClick(e, s) {
    typeof s != "string" && (s = n(s.target).closest(".w2ui-overlay").attr("name"));
    var s = this.get(s), i = n(s.box).find(`.w2ui-color-tab:nth-child(${e})`);
    n(s.box).find(".w2ui-color-tab").removeClass("w2ui-selected"), n(i).addClass("w2ui-selected"), n(s.box).find(".w2ui-tab-content").hide().closest(".w2ui-colors").find(".tab-" + e).show();
  }
  getColorHTML(e, t) {
    let s = `
            <div class="w2ui-colors">
                <div class="w2ui-tab-content tab-1">`;
    for (let a = 0; a < this.palette.length; a++) {
      s += '<div class="w2ui-color-row">';
      for (let r = 0; r < this.palette[a].length; r++) {
        var i = this.palette[a][r];
        let l = i === "FFFFFF" ? "; border: 1px solid #efefef" : "";
        s += `
                    <div class="w2ui-color w2ui-eaction ${i === "" ? "w2ui-no-color" : ""} ${t.color == i ? "w2ui-selected" : ""}"
                        style="background-color: #${i + l};" name="${i}" index="${a}:${r}"
                        data-mousedown="select|'${i}'|event" data-mouseup="hide|${e}">&nbsp;
                    </div>`;
      }
      s += "</div>", a < 2 && (s += '<div style="height: 8px"></div>');
    }
    return s = (s = (s += "</div>") + `
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
                        <span>${u.lang("Opacity")}</span>
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
    let t, s = this;
    var i = e.options;
    let a = u.parseColor(i.color || e.tmp.initColor), r = (a == null && (a = { r: 140, g: 150, b: 160, a: 1 }), u.rgb2hsv(a));
    i.advanced === true && this.tabClick(2, e.name), o(r, true, true), n(e.box).find("input").off(".w2color").on("change.w2color", (v) => {
      v = n(v.target);
      let m = parseFloat(v.val());
      var b = parseFloat(v.attr("max")), b = (isNaN(m) && (m = 0, v.val(0)), 1 < b && (m = parseInt(m)), 0 < b && m > b && (v.val(b), m = b), m < 0 && (v.val(0), m = 0), v.attr("name")), v = {};
      ["r", "g", "b", "a"].indexOf(b) !== -1 ? (a[b] = m, r = u.rgb2hsv(a)) : ["h", "s", "v"].indexOf(b) !== -1 && (v[b] = m), o(v, true);
    }), n(e.box).find(".color-original").off(".w2color").on("click.w2color", (f) => {
      f = u.parseColor(n(f.target).css("background-color")), f != null && (a = f, o(r = u.rgb2hsv(a), true));
    }), i = `${u.isIOS ? "touchstart" : "mousedown"}.w2color`;
    let l = `${u.isIOS ? "touchend" : "mouseup"}.w2color`, h = `${u.isIOS ? "touchmove" : "mousemove"}.w2color`;
    function o(f, m, b) {
      var _a;
      f.h != null && (r.h = f.h), f.s != null && (r.s = f.s), f.v != null && (r.v = f.v), f.a != null && (a.a = f.a, r.a = f.a);
      let v = "rgba(" + (a = u.hsv2rgb(r)).r + "," + a.g + "," + a.b + "," + a.a + ")", g = [Number(a.r).toString(16).toUpperCase(), Number(a.g).toString(16).toUpperCase(), Number(a.b).toString(16).toUpperCase(), Math.round(255 * Number(a.a)).toString(16).toUpperCase()];
      var y, w;
      g.forEach((C, $) => {
        C.length === 1 && (g[$] = "0" + C);
      }), v = g[0] + g[1] + g[2] + g[3], a.a === 1 && (v = g[0] + g[1] + g[2]), n(e.box).find(".color-preview").css("background-color", "#" + v), n(e.box).find("input").each((C) => {
        C.name && (a[C.name] != null && (C.value = a[C.name]), r[C.name] != null && (C.value = r[C.name]), C.name === "a") && (C.value = a.a);
      }), b ? (f = ((_a = e.tmp) == null ? void 0 : _a.initColor) || v, n(e.box).find(".color-original").css("background-color", "#" + f), n(e.box).find(".w2ui-colors .w2ui-selected").removeClass("w2ui-selected"), n(e.box).find(`.w2ui-colors [name="${f}"]`).addClass("w2ui-selected"), v.length == 8 && s.tabClick(2, e.name)) : s.select(v, e.name), m && (b = n(e.box).find(".palette .value1"), f = n(e.box).find(".rainbow .value2"), m = n(e.box).find(".alpha .value2"), y = parseInt(b[0].clientWidth) / 2, w = parseInt(f[0].clientWidth) / 2, b.css({ left: 150 * r.s / 100 - y + "px", top: 125 * (100 - r.v) / 100 - y + "px" }), f.css("left", r.h / 2.4 - w + "px"), m.css("left", 150 * a.a - w + "px"), c());
    }
    function c() {
      var f = u.hsv2rgb(r.h, 100, 100), f = `${f.r},${f.g},` + f.b;
      n(e.box).find(".palette").css("background-image", `linear-gradient(90deg, rgba(${f},0) 0%, rgba(${f},1) 100%)`);
    }
    function d(f) {
      n("body").off(".w2color");
    }
    function p(g) {
      var w = t.el, v = g.pageX - t.x, g = g.pageY - t.y;
      let m = t.left + v, b = t.top + g;
      var v = parseInt(w.prop("clientWidth")) / 2, g = (m < -v && (m = -v), b < -v && (b = -v), m > t.width - v && (m = t.width - v), b > t.height - v && (b = t.height - v), w.hasClass("move-x") && w.css({ left: m + "px" }), w.hasClass("move-y") && w.css({ top: b + "px" }), n(w.get(0).parentNode).attr("name")), y = parseInt(w.css("left")) + v, w = parseInt(w.css("top")) + v;
      g === "palette" && o({ s: Math.round(y / t.width * 100), v: Math.round(100 - w / t.height * 100) }), g === "rainbow" && (o({ h: Math.round(2.4 * y) }), c()), g === "alpha" && o({ a: parseFloat(Number(y / 150).toFixed(2)) });
    }
    n(e.box).find(".palette, .rainbow, .alpha").off(".w2color").on(i + ".w2color", function(f) {
      var m = n(this).find(".value1, .value2"), b = parseInt(m.prop("clientWidth")) / 2;
      m.hasClass("move-x") && m.css({ left: f.offsetX - b + "px" }), m.hasClass("move-y") && m.css({ top: f.offsetY - b + "px" }), t = { el: m, x: f.pageX, y: f.pageY, width: m.prop("parentNode").clientWidth, height: m.prop("parentNode").clientHeight, left: parseInt(m.css("left")), top: parseInt(m.css("top")) }, p(f), n("body").off(".w2color").on(h, p).on(l, d);
    });
  }
}
class Ot extends j {
  constructor() {
    super(), this.defaults = u.extend({}, this.defaults, { type: "normal", items: [], index: null, render: null, spinner: false, msgNoItems: u.lang("No items found"), topHTML: "", menuStyle: "", filter: false, markSearch: false, match: "contains", search: false, altRows: false, arrowSize: 10, align: "left", position: "bottom|top", class: "w2ui-white", anchorClass: "w2ui-focus", autoShowOn: "focus", hideOn: ["doc-click", "focus-change", "select"], onSelect: null, onSubMenu: null, onRemove: null });
  }
  attach(e, t) {
    let s;
    arguments.length == 1 && e.anchor ? e = (s = e).anchor : arguments.length === 2 && t != null && typeof t == "object" && ((s = t).anchor = e), t = s.hideOn, s = u.extend({}, this.defaults, s || {}), t && (s.hideOn = t), s.style += "; padding: 0;", s.items == null && (s.items = []), s.html = this.getMenuHTML(s);
    let i = super.attach(s), a = i.overlay;
    return a.on("show:after.attach, update:after.attach", (r) => {
      var _a;
      if ((_a = i.overlay) == null ? void 0 : _a.box) {
        let h = "";
        a.selected = null, a.options.items = u.normMenu(a.options.items), ["INPUT", "TEXTAREA"].includes(a.anchor.tagName) && (h = a.anchor.value, a.selected = a.anchor.dataset.selectedIndex);
        var l = n(i.overlay.box).find(".w2ui-eaction");
        u.bindEvents(l, this), this.applyFilter(a.name, null, h).then((o) => {
          a.tmp.searchCount = o.count, a.tmp.search = o.search, this.refreshSearch(a.name), this.initControls(i.overlay), this.refreshIndex(a.name);
        });
      }
    }), a.on("hide:after.attach", (r) => {
      F.hide(a.name + "-tooltip");
    }), i.select = (r) => (a.on("select.attach", (l) => {
      r(l);
    }), i), i.remove = (r) => (a.on("remove.attach", (l) => {
      r(l);
    }), i), i.subMenu = (r) => (a.on("subMenu.attach", (l) => {
      r(l);
    }), i), i;
  }
  update(e, t) {
    var s, i = j.active[e];
    i ? ((s = i.options).items != t && (s.items = t), t = this.getMenuHTML(s), s.html != t && (s.html = t, i.needsUpdate = true, this.show(e))) : console.log(`Tooltip "${e}" is not displayed. Cannot update it.`);
  }
  initControls(e) {
    n(e.box).find(".w2ui-menu:not(.w2ui-sub-menu)").off(".w2menu").on("mouseDown.w2menu", { delegate: ".w2ui-menu-item" }, (t) => {
      var s = t.delegate.dataset;
      this.menuDown(e, t, s.index, s.parents);
    }).on((u.isIOS ? "touchStart" : "click") + ".w2menu", { delegate: ".w2ui-menu-item" }, (t) => {
      var s = t.delegate.dataset;
      this.menuClick(e, t, parseInt(s.index), s.parents);
    }).find(".w2ui-menu-item").off(".w2menu").on("mouseEnter.w2menu", (t) => {
      var _a;
      var s = t.target.dataset, s = (_a = e.options.items[s.index]) == null ? void 0 : _a.tooltip;
      s && F.show({ name: e.name + "-tooltip", anchor: t.target, html: s, position: "right|left", hideOn: ["doc-click"] });
    }).on("mouseLeave.w2menu", (t) => {
      F.hide(e.name + "-tooltip");
    }), ["INPUT", "TEXTAREA"].includes(e.anchor.tagName) && n(e.anchor).off(".w2menu").on("input.w2menu", (t) => {
    }).on("keyup.w2menu", (t) => {
      t._searchType = "filter", this.keyUp(e, t);
    }), e.options.search && n(e.box).find("#menu-search").off(".w2menu").on("keyup.w2menu", (t) => {
      t._searchType = "search", this.keyUp(e, t);
    });
  }
  getCurrent(l, a) {
    var l = j.active[l.replace(/[\s\.#]/g, "_")], s = l.options;
    let i = (a || (l.selected ?? "")).split("-");
    var a = i.length - 1, l = i[a], r = i.slice(0, i.length - 1).join("-"), l = u.isInt(l) ? parseInt(l) : 0;
    let h = s.items;
    return i.forEach((o, c) => {
      c < i.length - 1 && (h = h[o].items);
    }), { last: a, index: l, items: h, item: h[l], parents: r };
  }
  getMenuHTML(e, t, s, i) {
    if (e.spinner) return `
            <div class="w2ui-menu">
                <div class="w2ui-no-items">
                    <div class="w2ui-spinner"></div>
                    ${u.lang("Loading...")}
                </div>
            </div>`;
    i = i || [], t == null && (t = e.items), Array.isArray(t) || (t = []);
    let a = 0, r = null, l = "", h = (!s && e.search && (l += `
                <div class="w2ui-menu-search">
                    <span class="w2ui-icon w2ui-icon-search"></span>
                    <input id="menu-search" class="w2ui-input" type="text"/>
                </div>`, t.forEach((o) => o.hidden = false)), !s && e.topHTML && (l += `<div class="w2ui-menu-top">${e.topHTML}</div>`), `
            ${l}
            <div class="w2ui-menu ${s ? "w2ui-sub-menu" : ""}" ${s ? "" : `style="${e.menuStyle}"`}
                data-parent="${i}">
        `);
    return t.forEach((o, c) => {
      r = o.icon;
      var d = (0 < i.length ? i.join("-") + "-" : "") + c;
      if (r == null && (r = null), ["radio", "check"].indexOf(e.type) == -1 || Array.isArray(o.items) || o.group === false || (r = o.checked === true ? "w2ui-icon-check" : "w2ui-icon-empty"), o.hidden !== true) {
        let f = o.text, m = "", b = "";
        if (typeof (f = typeof e.render == "function" ? e.render(o, e) : f) == "function" && (f = f(o, e)), r && (String(r).slice(0, 1) !== "<" && (r = `<span class="w2ui-icon ${r}"></span>`), m = `<div class="menu-icon">${r}</span></div>`), o.type !== "break" && f != null && f !== "" && String(f).substr(0, 2) != "--") {
          var p = ["w2ui-menu-item"];
          e.altRows == 1 && p.push(a % 2 == 0 ? "w2ui-even" : "w2ui-odd");
          let v = 1, g = (m === "" && v++, o.count == null && o.hotkey == null && o.remove !== true && o.items == null && v++, o.tooltip == null && o.hint != null && (o.tooltip = o.hint), "");
          if (o.remove === true) g = '<span class="remove">x</span>';
          else if (o.items != null) {
            let y = [];
            typeof o.items == "function" ? y = o.items(o) : Array.isArray(o.items) && (y = o.items), g = "<span></span>", b = `
                            <div class="w2ui-sub-menu-box" style="${o.expanded ? "" : "display: none"}">
                                ${this.getMenuHTML(e, y, true, i.concat(c))}
                            </div>`;
          } else o.count != null && (g += "<span>" + o.count + "</span>"), o.hotkey != null && (g += '<span class="hotkey">' + o.hotkey + "</span>");
          o.disabled === true && p.push("w2ui-disabled"), o._noSearchInside === true && p.push("w2ui-no-search-inside"), b !== "" && (p.push("has-sub-menu"), o.expanded ? p.push("expanded") : p.push("collapsed")), h += `
                        <div index="${d}" class="${p.join(" ")}" style="${o.style || ""}"
                            data-index="${c}" data-parents="${i.join("-")}">
                                <div style="width: ${(s ? 20 : 0) + parseInt(o.indent ?? 0)}px"></div>
                                ${m}
                                <div class="menu-text" colspan="${v}">${u.lang(f)}</div>
                                <div class="menu-extra">${g}</div>
                        </div>
                        ` + b, a++;
        } else p = (f ?? "").replace(/^-+/g, ""), h += `
                        <div index="${d}" class="w2ui-menu-divider ${p != "" ? "has-text" : ""}">
                            <div class="line"></div>
                            ${p ? `<div class="text">${p}</div>` : ""}
                        </div>`;
      }
      t[c] = o;
    }), a === 0 && e.msgNoItems && (h += `
                <div class="w2ui-no-items">
                    ${u.lang(e.msgNoItems)}
                </div>`), h += "</div>";
  }
  refreshIndex(i) {
    var t, s, i = j.active[i.replace(/[\s\.#]/g, "_")];
    i && (i.displayed || this.show(i.name), t = n(i.box).find(".w2ui-overlay-body").get(0), s = n(i.box).find(".w2ui-menu-search, .w2ui-menu-top").get(0), n(i.box).find(".w2ui-menu-item.w2ui-selected").removeClass("w2ui-selected"), i = n(i.box).find(`.w2ui-menu-item[index="${i.selected}"]`).addClass("w2ui-selected").get(0)) && (i.offsetTop + i.clientHeight > t.clientHeight + t.scrollTop && i.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" }), i.offsetTop < t.scrollTop + (s ? s.clientHeight : 0)) && i.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
  }
  refreshSearch(e) {
    var _a, _b;
    let t = j.active[e.replace(/[\s\.#]/g, "_")];
    t && (t.displayed || this.show(t.name), n(t.box).find(".w2ui-no-items").hide(), n(t.box).find(".w2ui-menu-item, .w2ui-menu-divider").each((s) => {
      var _a2, _b2;
      var i;
      ((_a2 = this.getCurrent(e, s.getAttribute("index")).item) == null ? void 0 : _a2.hidden) ? n(s).hide() : ((i = (_b2 = t.tmp) == null ? void 0 : _b2.search) && t.options.markSearch && u.marker(s, i, { onlyFirst: t.options.match == "begins" }), n(s).show());
    }), n(t.box).find(".w2ui-sub-menu").each((s) => {
      var i = n(s).find(".w2ui-menu-item").get().some((a) => a.style.display != "none");
      this.getCurrent(e, s.dataset.parent).item.expanded && (i ? n(s).parent().show() : n(s).parent().hide());
    }), t.tmp.searchCount != 0 && ((_b = (_a = t.options) == null ? void 0 : _a.items) == null ? void 0 : _b.length) != 0 || (n(t.box).find(".w2ui-no-items").length == 0 && n(t.box).find(".w2ui-menu:not(.w2ui-sub-menu)").append(`
                    <div class="w2ui-no-items">
                        ${u.lang(t.options.msgNoItems)}
                    </div>`), n(t.box).find(".w2ui-no-items").show()));
  }
  applyFilter(e, t, s, i) {
    var _a;
    let a = 0;
    var r = j.active[e.replace(/[\s\.#]/g, "_")];
    let l = r.options, h, o;
    var c = new Promise((f, m) => {
      h = f, o = m;
    });
    s == null && (s = ["INPUT", "TEXTAREA"].includes(r.anchor.tagName) ? r.anchor.value : "");
    let d = [];
    l.selected && (Array.isArray(l.selected) ? d = l.selected.map((f) => (f == null ? void 0 : f.id) ?? f) : ((_a = l.selected) == null ? void 0 : _a.id) && (d = [l.selected.id])), r.tmp.activeChain = null;
    var p = r.tmp.remote ?? { hasMore: true, emtpySet: false, search: null, total: -1 };
    if (t == null && l.url && p.hasMore && p.search !== s) {
      let f = true, m = u.lang("Loading...");
      s.length < l.minLength && p.emptySet !== true && (m = u.lang("${count} letters or more...", { count: l.minLength }), f = false, s === "") && (m = u.lang(l.msgSearch)), n(r.box).find(".w2ui-no-items").html(m), p.search = s, l.items = [], r.tmp.remote = p, f && this.request(r, s, i).then((b) => {
        this.update(e, b), this.applyFilter(e, null, s).then((v) => {
          h(v);
        });
      }).catch((b) => {
        console.log("Server Request error", b);
      });
    } else {
      let f;
      t == null && (f = this.trigger("search", { search: s, overlay: r, prom: c, resolve: h, reject: o })).isCancelled === true || (t == null && (t = r.options.items), l.filter === false ? h({ count: -1, search: s }) : (t.forEach((m) => {
        let b = "", v = "";
        ["is", "begins", "begins with"].indexOf(l.match) !== -1 && (b = "^"), ["is", "ends", "ends with"].indexOf(l.match) !== -1 && (v = "$");
        try {
          new RegExp(b + s + v, "i").test(m.text) || m.text === "..." ? m.hidden = false : m.hidden = true;
        } catch {
        }
        l.hideSelected && d.includes(m.id) && (m.hidden = true), Array.isArray(m.items) && 0 < m.items.length && (delete m._noSearchInside, this.applyFilter(e, m.items, s).then((g) => {
          g = g.count, 0 < g && (a += g, m.hidden && (m._noSearchInside = true), s && (m.expanded = true), m.hidden = false);
        })), m.hidden !== true && a++;
      }), h({ count: a, search: s }), f == null ? void 0 : f.finish()));
    }
    return c;
  }
  request(e, t, s) {
    let i = e.options, a = e.tmp.remote, r, l;
    return (i.items.length === 0 && a.total !== 0 || a.total == i.cacheMax && t.length > a.search.length || t.length >= a.search.length && t.substr(0, a.search.length) !== a.search || t.length < a.search.length) && (a.controller && a.controller.abort(), a.loading = true, clearTimeout(a.timeout), a.timeout = setTimeout(() => {
      var h = i.url;
      let o = { search: t, max: i.cacheMax };
      Object.assign(o, i.postData);
      var c, d = this.trigger("request", { search: t, overlay: e, url: h, postData: o, httpMethod: i.method ?? "GET", httpHeaders: {} });
      d.isCancelled !== true && (h = new URL(d.detail.url, location), c = u.prepareParams(h, { method: d.detail.httpMethod, headers: d.detail.httpHeaders, body: d.detail.postData }), a.controller = new AbortController(), c.signal = a.controller.signal, fetch(h, c).then((p) => p.json()).then((p) => {
        a.controller = null;
        var f = e.trigger("load", { search: o.search, overlay: e, data: p });
        f.isCancelled !== true && (typeof (p = f.detail.data) == "string" && (p = JSON.parse(p)), (p = Array.isArray(p) ? { records: p } : p).records == null && p.items != null && (p.records = p.items, delete p.items), p.error || p.records != null || (p.records = []), Array.isArray(p.records) ? (p.records.length >= i.cacheMax ? (p.records.splice(i.cacheMax, p.records.length), a.hasMore = true) : a.hasMore = false, i.recId == null && i.recid != null && (i.recId = i.recid), (i.recId || i.recText) && p.records.forEach((m) => {
          typeof i.recId == "string" && (m.id = m[i.recId]), typeof i.recId == "function" && (m.id = i.recId(m)), typeof i.recText == "string" && (m.text = m[i.recText]), typeof i.recText == "function" && (m.text = i.recText(m));
        }), a.loading = false, a.search = t, a.total = p.records.length, a.lastError = "", a.emptySet = t === "" && p.records.length === 0, f.finish(), r(u.normMenu(p.records))) : console.error("ERROR: server did not return proper data structure", `
`, " - it should return", { records: [{ id: 1, text: "item" }] }, `
`, " - or just an array ", [{ id: 1, text: "item" }], `
`, " - or if errorr ", { error: true, message: "error message" }));
      }).catch((p) => {
        var f = this.trigger("error", { overlay: e, search: t, error: p });
        f.isCancelled !== true && ((p == null ? void 0 : p.name) !== "AbortError" && console.error("ERROR: Server communication failed.", `
`, " - it should return", { records: [{ id: 1, text: "item" }] }, `
`, " - or just an array ", [{ id: 1, text: "item" }], `
`, " - or if errorr ", { error: true, message: "error message" }), a.loading = false, a.search = "", a.total = -1, a.emptySet = true, a.lastError = f.detail.error || "Server communication failed", i.items = [], f.finish(), l());
      }), d.finish());
    }, s ? i.debounce ?? 350 : 0)), new Promise((h, o) => {
      r = h, l = o;
    });
  }
  getActiveChain(e, t, s = [], i = [], a) {
    var r = j.active[e.replace(/[\s\.#]/g, "_")];
    return r.tmp.activeChain != null ? r.tmp.activeChain : ((t = t ?? r.options.items).forEach((l, h) => {
      var _a;
      l.hidden || l.disabled || ((_a = l == null ? void 0 : l.text) == null ? void 0 : _a.startsWith("--")) || (i.push(s.concat([h]).join("-")), Array.isArray(l.items) && 0 < l.items.length && l.expanded && (s.push(h), this.getActiveChain(e, l.items, s, i, true), s.pop()));
    }), a == null && (r.tmp.activeChain = i), i);
  }
  menuDown(e, t, s, i) {
    e = e.options;
    let a = e.items;
    var r = n(t.delegate).find(".w2ui-icon");
    let l = n(t.target).closest(".w2ui-menu:not(.w2ui-sub-menu)"), h = (typeof i == "string" && i !== "" && i.split("-").forEach((o) => {
      a = a[o].items;
    }), a[s]);
    if (!h.disabled) {
      let o = (c, d) => {
        c.forEach((p, f) => {
          p.id != h.id && (p.group === h.group && p.checked && (l.find(`.w2ui-menu-item[index="${(d ? d + "-" : "") + f}"] .w2ui-icon`).removeClass("w2ui-icon-check").addClass("w2ui-icon-empty"), c[f].checked = false), Array.isArray(p.items)) && o(p.items, f);
        });
      };
      e.type !== "check" && e.type !== "radio" || h.group === false || n(t.target).hasClass("remove") || n(t.target).closest(".w2ui-menu-item").hasClass("has-sub-menu") || (h.checked = e.type == "radio" || !h.checked, h.checked ? (e.type === "radio" && n(t.target).closest(".w2ui-menu").find(".w2ui-icon").removeClass("w2ui-icon-check").addClass("w2ui-icon-empty"), e.type === "check" && h.group != null && o(e.items), r.removeClass("w2ui-icon-empty").addClass("w2ui-icon-check")) : e.type === "check" && r.removeClass("w2ui-icon-check").addClass("w2ui-icon-empty")), n(t.target).hasClass("remove") || (l.find(".w2ui-menu-item").removeClass("w2ui-selected"), n(t.delegate).addClass("w2ui-selected"));
    }
  }
  menuClick(e, t, s, i) {
    var a = e.options;
    let r = a.items;
    var l = n(t.delegate).closest(".w2ui-menu-item");
    let h = !a.hideOn.includes("select");
    (t.shiftKey || t.metaKey || t.ctrlKey) && (h = true), typeof i == "string" && i !== "" ? i.split("-").forEach((c) => {
      r = r[c].items;
    }) : i = null;
    var o = (r = typeof r == "function" ? r({ overlay: e, index: s, parentIndex: i, event: t }) : r)[s];
    if (!o.disabled || n(t.target).hasClass("remove")) {
      let c;
      if (n(t.target).hasClass("remove")) {
        if ((c = this.trigger("remove", { originalEvent: t, target: e.name, overlay: e, item: o, index: s, parentIndex: i, el: l[0] })).isCancelled === true) return;
        h = !a.hideOn.includes("item-remove"), l.remove();
      } else if (l.hasClass("has-sub-menu")) {
        if ((c = this.trigger("subMenu", { originalEvent: t, target: e.name, overlay: e, item: o, index: s, parentIndex: i, el: l[0] })).isCancelled === true) return;
        h = true, l.hasClass("expanded") ? (o.expanded = false, l.removeClass("expanded").addClass("collapsed"), n(l.get(0).nextElementSibling).hide()) : (o.expanded = true, l.addClass("expanded").removeClass("collapsed"), n(l.get(0).nextElementSibling).show()), e.selected = parseInt(l.attr("index"));
      } else {
        if (a = this.findChecked(a.items), e.selected = parseInt(l.attr("index")), (c = this.trigger("select", { originalEvent: t, target: e.name, overlay: e, item: o, index: s, parentIndex: i, selected: a, keepOpen: h, el: l[0] })).isCancelled === true) return;
        o.keepOpen != null && (h = o.keepOpen), ["INPUT", "TEXTAREA"].includes(e.anchor.tagName) && (e.anchor.dataset.selected = o.id, e.anchor.dataset.selectedIndex = e.selected);
      }
      h || this.hide(e.name), c.finish();
    }
  }
  findChecked(e) {
    let t = [];
    return e.forEach((s) => {
      s.checked && t.push(s), Array.isArray(s.items) && (t = t.concat(this.findChecked(s.items)));
    }), t;
  }
  keyUp(e, t) {
    var _a, _b;
    var s = e.options, i = t.target.value;
    let a = true, r = false;
    switch (t.keyCode) {
      case 46:
      case 8:
        i !== "" || e.displayed || (a = false);
        break;
      case 13:
        if (!e.displayed || !e.selected) return;
        var { index: h, parents: l } = this.getCurrent(e.name);
        t.delegate = n(e.box).find(".w2ui-selected").get(0), this.menuClick(e, t, parseInt(h), l), a = false;
        break;
      case 27:
        a = false, e.displayed ? this.hide(e.name) : (h = e.anchor, ["INPUT", "TEXTAREA"].includes(h.tagName) && (h.value = "", delete h.dataset.selected, delete h.dataset.selectedIndex));
        break;
      case 37: {
        if (!e.displayed) return;
        let { item: c, index: d, parents: p } = this.getCurrent(e.name);
        p && (c = s.items[p], d = parseInt(p), p = "", r = true), Array.isArray(c == null ? void 0 : c.items) && 0 < c.items.length && c.expanded && (t.delegate = n(e.box).find(`.w2ui-menu-item[index="${d}"]`).get(0), e.selected = d, this.menuClick(e, t, parseInt(d), p)), a = false;
        break;
      }
      case 39:
        if (!e.displayed) return;
        var { item: l, index: h, parents: o } = this.getCurrent(e.name);
        Array.isArray(l == null ? void 0 : l.items) && 0 < l.items.length && !l.expanded && (t.delegate = n(e.box).find(".w2ui-selected").get(0), this.menuClick(e, t, parseInt(h), o)), a = false;
        break;
      case 38:
        e.displayed && (l = this.getActiveChain(e.name), e.selected == null || ((_a = e.selected) == null ? void 0 : _a.length) == 0 ? e.selected = l[l.length - 1] : ((h = l.indexOf(e.selected)) == -1 && (e.selected = l[l.length - 1]), 0 < h && (e.selected = l[h - 1])), a = false, r = true, t.preventDefault());
        break;
      case 40:
        e.displayed && (o = this.getActiveChain(e.name), e.selected == null || ((_b = e.selected) == null ? void 0 : _b.length) == 0 ? e.selected = o[0] : ((l = o.indexOf(e.selected)) == -1 && (e.selected = o[0]), l < o.length - 1 && (e.selected = o[l + 1])), a = false, r = true, t.preventDefault());
    }
    a && e.displayed && (s.filter && t._searchType == "filter" || s.search && t._searchType == "search") && this.applyFilter(e.name, null, i, true).then((c) => {
      e.tmp.searchCount = c.count, e.tmp.search = c.search, c.count !== 0 && this.getActiveChain(e.name).includes(e.selected) || (e.selected = null), this.refreshSearch(e.name);
    }), r && this.refreshIndex(e.name);
  }
}
class Rt extends j {
  constructor() {
    super();
    var e = /* @__PURE__ */ new Date();
    this.daysCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], this.today = e.getFullYear() + "/" + (Number(e.getMonth()) + 1) + "/" + e.getDate(), this.defaults = u.extend({}, this.defaults, { position: "top|bottom", class: "w2ui-calendar", type: "date", format: "", value: "", start: null, end: null, blockDates: [], blockWeekdays: [], colored: {}, arrowSize: 12, autoResize: false, anchorClass: "w2ui-focus", autoShowOn: "focus", hideOn: ["doc-click", "focus-change"], onSelect: null });
  }
  attach(a, i) {
    let s;
    arguments.length == 1 && a.anchor ? a = (s = a).anchor : arguments.length === 2 && i != null && typeof i == "object" && ((s = i).anchor = a);
    var i = s.hideOn, a = (s = u.extend({}, this.defaults, s || {}), i && (s.hideOn = i), s.format || (a = u.settings.dateFormat, i = u.settings.timeFormat, s.type == "date" ? s.format = a : s.type == "time" ? s.format = i : s.format = a + "|" + i), s.type == "time" ? this.getHourHTML(s) : this.getMonthHTML(s));
    s.style += "; padding: 0;", s.html = a.html;
    let r = super.attach(s), l = r.overlay;
    return Object.assign(l.tmp, a), l.on("show.attach", (o) => {
      var o = o.detail.overlay, c = o.anchor, d = o.options;
      ["INPUT", "TEXTAREA"].includes(c.tagName) && !d.value && c.value && (o.tmp.initValue = c.value), delete o.newValue, delete o.newDate;
    }), l.on("show:after.attach", (h) => {
      var _a;
      ((_a = r.overlay) == null ? void 0 : _a.box) && this.initControls(r.overlay);
    }), l.on("update:after.attach", (h) => {
      var _a;
      ((_a = r.overlay) == null ? void 0 : _a.box) && this.initControls(r.overlay);
    }), l.on("hide.attach", (o) => {
      var o = o.detail.overlay, c = o.anchor;
      o.newValue != null && (o.newDate && (o.newValue = o.newDate + " " + o.newValue), ["INPUT", "TEXTAREA"].includes(c.tagName) && c.value != o.newValue && (c.value = o.newValue), (c = this.trigger("select", { date: o.newValue, target: o.name, overlay: o })).isCancelled !== true) && c.finish();
    }), r.select = (h) => (l.on("select.attach", (o) => {
      h(o);
    }), r), r;
  }
  initControls(e) {
    let t = e.options, s = (a) => {
      let { month: r, year: l } = e.tmp;
      12 < (r += a) && (r = 1, l++), r < 1 && (r = 12, l--), a = this.getMonthHTML(t, r, l), Object.assign(e.tmp, a), n(e.box).find(".w2ui-overlay-body").html(a.html), this.initControls(e);
    }, i = (a, r) => {
      n(a.target).parent().find(".w2ui-jump-month, .w2ui-jump-year").removeClass("w2ui-selected"), n(a.target).addClass("w2ui-selected"), a = /* @__PURE__ */ new Date();
      let { jumpMonth: l, jumpYear: h } = e.tmp;
      (l = r && (h == null && (h = a.getFullYear()), l == null) ? a.getMonth() + 1 : l) && h && (r = this.getMonthHTML(t, l, h), Object.assign(e.tmp, r), n(e.box).find(".w2ui-overlay-body").html(r.html), e.tmp.jump = false, this.initControls(e));
    };
    n(e.box).find(".w2ui-cal-title").off(".calendar").on("click.calendar", (a) => {
      var r, l;
      Object.assign(e.tmp, { jumpYear: null, jumpMonth: null }), e.tmp.jump ? ({ month: r, year: l } = e.tmp, r = this.getMonthHTML(t, r, l), n(e.box).find(".w2ui-overlay-body").html(r.html), e.tmp.jump = false) : (n(e.box).find(".w2ui-overlay-body .w2ui-cal-days").replace(this.getYearHTML()), (l = n(e.box).find(`[name="${e.tmp.year}"]`).get(0)) && l.scrollIntoView(true), e.tmp.jump = true), this.initControls(e), a.stopPropagation();
    }).find(".w2ui-cal-previous").off(".calendar").on("click.calendar", (a) => {
      s(-1), a.stopPropagation();
    }).parent().find(".w2ui-cal-next").off(".calendar").on("click.calendar", (a) => {
      s(1), a.stopPropagation();
    }), n(e.box).find(".w2ui-cal-now").off(".calendar").on("click.calendar", (a) => {
      t.type == "datetime" ? e.newDate ? e.newValue = u.formatTime(/* @__PURE__ */ new Date(), t.format.split("|")[1]) : e.newValue = u.formatDateTime(/* @__PURE__ */ new Date(), t.format) : t.type == "date" ? e.newValue = u.formatDate(/* @__PURE__ */ new Date(), t.format) : t.type == "time" && (e.newValue = u.formatTime(/* @__PURE__ */ new Date(), t.format)), this.hide(e.name);
    }), n(e.box).off(".calendar").on("click.calendar", { delegate: ".w2ui-day.w2ui-date" }, (a) => {
      t.type == "datetime" ? (e.newDate = n(a.target).attr("date"), n(e.box).find(".w2ui-overlay-body").html(this.getHourHTML(e.options).html), this.initControls(e)) : (e.newValue = n(a.target).attr("date"), this.hide(e.name));
    }).on("click.calendar", { delegate: ".w2ui-jump-month" }, (a) => {
      e.tmp.jumpMonth = parseInt(n(a.target).attr("name")), i(a);
    }).on("dblclick.calendar", { delegate: ".w2ui-jump-month" }, (a) => {
      e.tmp.jumpMonth = parseInt(n(a.target).attr("name")), i(a, true);
    }).on("click.calendar", { delegate: ".w2ui-jump-year" }, (a) => {
      e.tmp.jumpYear = parseInt(n(a.target).attr("name")), i(a);
    }).on("dblclick.calendar", { delegate: ".w2ui-jump-year" }, (a) => {
      e.tmp.jumpYear = parseInt(n(a.target).attr("name")), i(a, true);
    }).on("click.calendar", { delegate: ".w2ui-time.hour" }, (r) => {
      var r = n(r.target).attr("hour");
      let l = this.str2min(t.value) % 60;
      e.tmp.initValue && !t.value && (l = this.str2min(e.tmp.initValue) % 60), t.noMinutes ? (e.newValue = this.min2str(60 * r, t.format), this.hide(e.name)) : (e.newValue = r + ":" + l, r = this.getMinHTML(r, t).html, n(e.box).find(".w2ui-overlay-body").html(r), this.initControls(e));
    }).on("click.calendar", { delegate: ".w2ui-time.min" }, (a) => {
      a = 60 * Math.floor(this.str2min(e.newValue) / 60) + parseInt(n(a.target).attr("min")), e.newValue = this.min2str(a, t.format), this.hide(e.name);
    });
  }
  getMonthHTML(e, t, s) {
    var r = u.settings.fulldays.slice(), i = u.settings.shortdays.slice();
    u.settings.weekStarts !== "M" && (r.unshift(r.pop()), i.unshift(i.pop()));
    let a = /* @__PURE__ */ new Date();
    var r = e.type === "datetime" ? u.isDateTime(e.value, e.format, true) : u.isDate(e.value, e.format, true), l = u.formatDate(r);
    t != null && s != null || (s = (r || a).getFullYear(), t = r ? r.getMonth() + 1 : a.getMonth() + 1), 12 < t && (t -= 12, s++), (t < 1 || t === 0) && (t += 12, s--), s / 4 == Math.floor(s / 4) ? this.daysCount[1] = 29 : this.daysCount[1] = 28, e.current = t + "/" + s;
    let h = (a = new Date(s, t - 1, 1)).getDay(), o = "";
    var c = u.settings.weekStarts;
    for (let y = 0; y < i.length; y++) {
      var d = c == "M" && y == 5 || c != "M" && y == 6, p = c == "M" && y == 6 || c != "M" && y == 0;
      o += `<div class="w2ui-day w2ui-weekday ${d ? "w2ui-sunday" : ""} ${p ? "w2ui-saturday" : ""}">${i[y]}</div>`;
    }
    let f = `
            <div class="w2ui-cal-title">
                <div class="w2ui-cal-previous">
                    <div></div>
                </div>
                <div class="w2ui-cal-next">
                    <div></div>
                </div>
                ${u.settings.fullmonths[t - 1]}, ${s}
                <span class="arrow-down"></span>
            </div>
            <div class="w2ui-cal-days">
                ${o}
        `, m = /* @__PURE__ */ new Date(s + `/${t}/1`);
    r = (m = new Date(m.getTime() + 432e5)).getDay(), u.settings.weekStarts == "M" && h--, 0 < r && (m = new Date(m.getTime() - 864e5 * h));
    for (let y = 0; y < 42; y++) {
      var b = [], v = `${m.getFullYear()}/${m.getMonth() + 1}/` + m.getDate(), g = (m.getDay() === 6 && b.push("w2ui-saturday"), m.getDay() === 0 && b.push("w2ui-sunday"), m.getMonth() + 1 !== t && b.push("outside"), v == this.today && b.push("w2ui-today"), m.getDate());
      let w = "", C = "", $, I;
      I = e.type === "datetime" ? ($ = u.formatDateTime(v, e.format), u.formatDate(v, u.settings.dateFormat)) : $ = u.formatDate(v, e.format), e.colored && e.colored[I] !== void 0 && (v = e.colored[I].split("|"), C = "background-color: " + v[0] + ";", w = "color: " + v[1] + ";"), f += `<div class="w2ui-day ${this.inRange($, e, true) ? "w2ui-date " + (I == l ? "w2ui-selected" : "") : "w2ui-blocked"} ${b.join(" ")}"
                       style="${w + C}" date="${I}" data-date="${m.getTime()}">
                            ${g}
                    </div>`, m = new Date(m.getTime() + 864e5);
    }
    return f += "</div>", e.btnNow && (r = u.lang("Today" + (e.type == "datetime" ? " & Now" : "")), f += `<div class="w2ui-cal-now">${r}</div>`), { html: f, month: t, year: s };
  }
  getYearHTML() {
    let e = "", t = "";
    for (let s = 0; s < u.settings.fullmonths.length; s++) e += `<div class="w2ui-jump-month" name="${s + 1}">${u.settings.shortmonths[s]}</div>`;
    for (let s = u.settings.dateStartYear; s <= u.settings.dateEndYear; s++) t += `<div class="w2ui-jump-year" name="${s}">${s}</div>`;
    return `<div class="w2ui-cal-jump">
            <div id="w2ui-jump-month">${e}</div>
            <div id="w2ui-jump-year">${t}</div>
        </div>`;
  }
  getHourHTML(e) {
    (e = e ?? {}).format || (e.format = u.settings.timeFormat);
    var t = -1 < e.format.indexOf("h24"), s = e.value || (e.anchor ? e.anchor.value : ""), i = [];
    for (let l = 0; l < 24; l++) {
      let h = (12 <= l && !t ? l - 12 : l) + ":00" + (t ? "" : l < 12 ? " am" : " pm"), o = (l != 12 || t || (h = "12:00 pm"), i[Math.floor(l / 8)] || (i[Math.floor(l / 8)] = ""), this.min2str(this.str2min(h))), c = this.min2str(this.str2min(h) + 59);
      e.type === "datetime" && (r = u.isDateTime(s, e.format, true), a = e.format.split("|")[0].trim(), o = u.formatDate(r, a) + " " + o, c = u.formatDate(r, a) + " " + c);
      var a, r = this.inRange(o, e) || this.inRange(c, e);
      i[Math.floor(l / 8)] += `<span hour="${l}"
                class="hour ${r ? "w2ui-time " : "w2ui-blocked"}">${h}</span>`;
    }
    return { html: `<div class="w2ui-calendar">
            <div class="w2ui-time-title">${u.lang("Select Hour")}</div>
            <div class="w2ui-cal-time">
                <div class="w2ui-cal-column">${i[0]}</div>
                <div class="w2ui-cal-column">${i[1]}</div>
                <div class="w2ui-cal-column">${i[2]}</div>
            </div>
            ${e.btnNow ? `<div class="w2ui-cal-now">${u.lang("Now")}</div>` : ""}
        </div>` };
  }
  getMinHTML(e, t) {
    e == null && (e = 0), (t = t ?? {}).format || (t.format = u.settings.timeFormat);
    var s = -1 < t.format.indexOf("h24"), i = t.value || (t.anchor ? t.anchor.value : ""), a = [];
    for (let c = 0; c < 60; c += 5) {
      var r = (12 < e && !s ? e - 12 : e) + ":" + (c < 10 ? 0 : "") + c + " " + (s ? "" : e < 12 ? "am" : "pm");
      let d = r;
      var l, h, o = c < 20 ? 0 : c < 40 ? 1 : 2;
      a[o] || (a[o] = ""), t.type === "datetime" && (l = u.isDateTime(i, t.format, true), h = t.format.split("|")[0].trim(), d = u.formatDate(l, h) + " " + d), a[o] += `<span min="${c}" class="min ${this.inRange(d, t) ? "w2ui-time " : "w2ui-blocked"}">${r}</span>`;
    }
    return { html: `<div class="w2ui-calendar">
            <div class="w2ui-time-title">${u.lang("Select Minute")}</div>
            <div class="w2ui-cal-time">
                <div class="w2ui-cal-column">${a[0]}</div>
                <div class="w2ui-cal-column">${a[1]}</div>
                <div class="w2ui-cal-column">${a[2]}</div>
            </div>
            ${t.btnNow ? `<div class="w2ui-cal-now">${u.lang("Now")}</div>` : ""}
        </div>` };
  }
  inRange(e, t, s) {
    let i = false;
    if (t.type === "date") {
      var a = u.isDate(e, t.format, true);
      if (a) {
        if (t.start || t.end) {
          var r = typeof t.start == "string" ? t.start : n(t.start).val(), l = typeof t.end == "string" ? t.end : n(t.end).val();
          let h = u.isDate(r, t.format, true), o = u.isDate(l, t.format, true);
          r = new Date(a), h = h || r, o = o || r, r >= h && r <= o && (i = true);
        } else i = true;
        Array.isArray(t.blockDates) && t.blockDates.includes(e) && (i = false), Array.isArray(t.blockWeekdays) && t.blockWeekdays.includes(a.getDay()) && (i = false);
      }
    } else if (t.type === "time") if (t.start || t.end) {
      l = this.str2min(e);
      let h = this.str2min(t.start), o = this.str2min(t.end);
      h = h || l, o = o || l, l >= h && l <= o && (i = true);
    } else i = true;
    else t.type === "datetime" && (r = u.isDateTime(e, t.format, true)) && (a = t.format.split("|").map((h) => h.trim()), s ? (l = u.formatDate(r, a[0]), e = u.extend({}, t, { type: "date", format: a[0] }), this.inRange(l, e) && (i = true)) : (s = u.formatTime(r, a[1]), l = { type: "time", format: a[1], start: t.startTime, end: t.endTime }, this.inRange(s, l) && (i = true)));
    return i;
  }
  str2min(e) {
    var t;
    return typeof e != "string" || (t = e.split(":")).length !== 2 ? null : (t[0] = parseInt(t[0]), t[1] = parseInt(t[1]), e.indexOf("pm") !== -1 && t[0] !== 12 && (t[0] += 12), e.includes("am") && t[0] == 12 && (t[0] = 0), 60 * t[0] + t[1]);
  }
  min2str(i, t) {
    1440 <= i && (i %= 1440), i < 0 && (i = 1440 + i);
    var s = Math.floor(i / 60), i = (i % 60 < 10 ? "0" : "") + i % 60;
    return t = t || u.settings.timeFormat, t.indexOf("h24") !== -1 ? s + ":" + i : (s <= 12 ? s : s - 12) + ":" + i + " " + (12 <= s ? "pm" : "am");
  }
}
let F = new j(), W = new Ot(), ct = new Dt(), fe = new Rt();
class zt extends he {
  constructor(e) {
    super(e.name), this.box = null, this.name = null, this.routeData = {}, this.items = [], this.right = "", this.tooltip = "top|left", this.onClick = null, this.onMouseDown = null, this.onMouseUp = null, this.onMouseEnter = null, this.onMouseLeave = null, this.onRender = null, this.onRefresh = null, this.onResize = null, this.onDestroy = null, this.item_template = { id: null, type: "button", text: null, html: "", tooltip: null, count: null, hidden: false, disabled: false, checked: false, icon: null, route: null, arrow: null, style: null, group: null, items: null, selected: null, color: null, overlay: { anchorClass: "" }, onClick: null, onRefresh: null }, this.last = { badge: {} };
    var t = e.items;
    delete e.items, Object.assign(this, e), Array.isArray(t) && this.add(t, true), e.items = t, typeof this.box == "string" && (this.box = n(this.box).get(0)), this.box && this.render(this.box);
  }
  add(e, t) {
    this.insert(null, e, t);
  }
  insert(e, t, s) {
    (t = Array.isArray(t) ? t : [t]).forEach((i, a, r) => {
      typeof i == "string" && (i = r[a] = { id: i, text: i });
      var l, h = ["button", "check", "radio", "drop", "menu", "menu-radio", "menu-check", "color", "text-color", "html", "break", "spacer", "new-line"];
      if (h.includes(String(i.type))) if (i.id != null || ["break", "spacer", "new-line"].includes(i.type)) {
        if (i.type == null) console.log('ERROR: The parameter "type" is required but not supplied.', i);
        else if (u.checkUniqueId(i.id, this.items, "toolbar", this.name)) {
          let o = u.extend({}, this.item_template, i);
          o.type == "menu-check" ? (Array.isArray(o.selected) || (o.selected = []), Array.isArray(o.items) && o.items.forEach((c) => {
            (c = typeof c == "string" ? r[a] = { id: c, text: c } : c).checked && !o.selected.includes(c.id) && o.selected.push(c.id), !c.checked && o.selected.includes(c.id) && (c.checked = true), c.checked == null && (c.checked = false);
          })) : o.type == "menu-radio" && Array.isArray(o.items) && o.items.forEach((c, d, p) => {
            (c = typeof c == "string" ? p[d] = { id: c, text: c } : c).checked && o.selected == null ? o.selected = c.id : c.checked = false, c.checked || o.selected != c.id || (c.checked = true), c.checked == null && (c.checked = false);
          }), e == null ? this.items.push(o) : (l = this.get(e, true), this.items = this.items.slice(0, l).concat([o], this.items.slice(l))), o.line = o.line ?? 1, s !== true && this.refresh(o.id);
        }
      } else console.log('ERROR: The parameter "id" is required but not supplied.', i);
      else console.log('ERROR: The parameter "type" should be one of the following:', h, `, but ${i.type} is supplied.`, i);
    }), s !== true && this.resize();
  }
  remove() {
    let e = 0;
    return Array.from(arguments).forEach((t) => {
      var s = this.get(t);
      s && String(t).indexOf(":") == -1 && (e++, n(this.box).find("#tb_" + this.name + "_item_" + u.escapeId(s.id)).remove(), (t = this.get(s.id, true)) != null) && this.items.splice(t, 1);
    }), this.resize(), e;
  }
  set(e, t) {
    var s = this.get(e);
    return s != null && (Object.assign(s, t), this.refresh(String(e).split(":")[0]), true);
  }
  get(e, t) {
    if (arguments.length === 0) {
      var s = [];
      for (let l = 0; l < this.items.length; l++) this.items[l].id != null && s.push(this.items[l].id);
      return s;
    }
    var i = String(e).split(":");
    for (let l = 0; l < this.items.length; l++) {
      var a = this.items[l];
      if (["menu", "menu-radio", "menu-check"].includes(a.type) && i.length == 2 && a.id == i[0]) {
        let h = a.items;
        typeof h == "function" && (h = h(this));
        for (let o = 0; o < h.length; o++) {
          var r = h[o];
          if (r.id == i[1] || r.id == null && r.text == i[1]) return t == 1 ? o : r;
          if (Array.isArray(r.items)) {
            for (let c = 0; c < r.items.length; c++) if (r.items[c].id == i[1] || r.items[c].id == null && r.items[c].text == i[1]) return t == 1 ? o : r.items[c];
          }
        }
      } else if (a.id == i[0]) return t == 1 ? l : a;
    }
    return null;
  }
  setCount(e, t, s, i) {
    var a = n(this.box).find(`#tb_${this.name}_item_${u.escapeId(e)} .w2ui-tb-count > span`);
    0 < a.length ? (a.removeClass().addClass(s ?? "").text(t).get(0).style.cssText = i ?? "", this.last.badge[e] = { className: s ?? "", style: i ?? "" }, this.get(e).count = t) : (this.set(e, { count: t }), this.setCount(...arguments));
  }
  show() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var s = this.get(t);
      s && (s.hidden = false, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t), this.resize();
      });
    }, 15), e;
  }
  hide() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var s = this.get(t);
      s && (s.hidden = true, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t), this.tooltipHide(t), this.resize();
      });
    }, 15), e;
  }
  enable() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var s = this.get(t);
      s && (s.disabled = false, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t);
      });
    }, 15), e;
  }
  disable() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var s = this.get(t);
      s && (s.disabled = true, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t), this.tooltipHide(t);
      });
    }, 15), e;
  }
  check() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var s = this.get(t);
      s && String(t).indexOf(":") == -1 && (s.checked = true, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t);
      });
    }, 15), e;
  }
  uncheck() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var s = this.get(t);
      s && String(t).indexOf(":") == -1 && (["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(s.type) && s.checked && F.hide(this.name + "-drop"), s.checked = false, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t);
      });
    }, 15), e;
  }
  click(e, t) {
    var s = String(e).split(":");
    let i = this.get(s[0]), a = i && i.items ? u.normMenu.call(this, i.items, i) : [];
    if (1 < s.length) (s = this.get(e)) && !s.disabled && this.menuClick({ name: this.name, item: i, subItem: s, originalEvent: t });
    else if (i && !i.disabled && (s = this.trigger("click", { target: e ?? this.name, item: i, object: i, originalEvent: t }), s.isCancelled !== true)) {
      a = i && i.items ? u.normMenu.call(this, i.items, i) : [];
      let h = "#tb_" + this.name + "_item_" + u.escapeId(i.id);
      if (n(this.box).find(h).removeClass("down"), i.type == "radio") {
        for (let o = 0; o < this.items.length; o++) {
          var r = this.items[o];
          r != null && r.id != i.id && r.type === "radio" && r.group == i.group && r.checked && (r.checked = false, this.refresh(r.id));
        }
        i.checked = true, n(this.box).find(h).addClass("checked");
      }
      if (["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(i.type)) {
        if (this.tooltipHide(e), i.checked) return void F.hide(this.name + "-drop");
        setTimeout(() => {
          var o = (d, p) => {
            let f = this;
            return function() {
              f.set(d, { checked: false });
            };
          }, c = n(this.box).find("#tb_" + this.name + "_item_" + u.escapeId(i.id));
          if (u.isPlainObject(i.overlay) || (i.overlay = {}), i.type == "drop" && F.show(u.extend({ html: i.html, class: "w2ui-white", hideOn: ["doc-click"] }, i.overlay, { anchor: c[0], name: this.name + "-drop", data: { item: i, btn: h } })).hide(o(i.id)), ["menu", "menu-radio", "menu-check"].includes(i.type)) {
            let d = "normal";
            i.type == "menu-radio" && (d = "radio", a.forEach((p) => {
              i.selected == p.id ? p.checked = true : p.checked = false;
            })), i.type == "menu-check" && (d = "check", a.forEach((p) => {
              Array.isArray(i.selected) && i.selected.includes(p.id) ? p.checked = true : p.checked = false;
            })), W.show(u.extend({ items: a }, i.overlay, { type: d, name: this.name + "-drop", anchor: c[0], data: { item: i, btn: h } })).hide(o(i.id)).remove((p) => {
              this.menuClick({ name: this.name, remove: true, item: i, subItem: p.detail.item, originalEvent: p });
            }).select((p) => {
              this.menuClick({ name: this.name, item: i, subItem: p.detail.item, originalEvent: p });
            });
          }
          ["color", "text-color"].includes(i.type) && ct.show(u.extend({ color: i.color }, i.overlay, { anchor: c[0], name: this.name + "-drop", data: { item: i, btn: h } })).hide(o(i.id)).select((d) => {
            d.detail.color != null && this.colorClick({ name: this.name, item: i, color: d.detail.color });
          });
        }, 0);
      }
      if (["check", "menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(i.type) && (i.checked = !i.checked, i.checked ? n(this.box).find(h).addClass("checked") : n(this.box).find(h).removeClass("checked")), i.route) {
        let o = ("/" + i.route).replace(/\/{2,}/g, "/");
        var l = u.parseRoute(o);
        if (0 < l.keys.length) for (let c = 0; c < l.keys.length; c++) o = o.replace(new RegExp(":" + l.keys[c].name, "g"), this.routeData[l.keys[c].name]);
        setTimeout(() => {
          window.location.hash = o;
        }, 1);
      }
      this.tooltipShow(e), s.finish();
    }
  }
  scroll(e, t, s) {
    return new Promise((i, a) => {
      var r = n(this.box).find(`.w2ui-tb-line:nth-child(${t}) .w2ui-scroll-wrapper`), l = r.get(0).scrollLeft, h = r.find(".w2ui-tb-right").get(0), o = r.parent().get(0).getBoundingClientRect().width, c = l + parseInt(h.offsetLeft) + parseInt(h.clientWidth);
      switch (e) {
        case "left":
          (scroll = l - o + 50) <= 0 && (scroll = 0), r.get(0).scrollTo({ top: 0, left: scroll, behavior: s ? "atuo" : "smooth" });
          break;
        case "right":
          (scroll = l + o - 50) >= c - o && (scroll = c - o), r.get(0).scrollTo({ top: 0, left: scroll, behavior: s ? "atuo" : "smooth" });
      }
      setTimeout(() => {
        this.resize(), i();
      }, s ? 0 : 500);
    });
  }
  render(e) {
    var t = Date.now(), s = (typeof e == "string" && (e = n(e).get(0)), this.trigger("render", { target: this.name, box: e ?? this.box }));
    if (s.isCancelled !== true && (e != null && (0 < n(this.box).find(".w2ui-scroll-wrapper .w2ui-tb-right").length && n(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-toolbar").html(""), this.box = e), this.box)) {
      Array.isArray(this.right) || (this.right = [this.right]);
      let a = "", r = 0;
      for (let l = 0; l < this.items.length; l++) {
        var i = this.items[l];
        i != null && (i.id == null && (i.id = "item_" + l), i.caption != null && console.log("NOTICE: toolbar item.caption property is deprecated, please use item.text. Item -> ", i), i.hint != null && console.log("NOTICE: toolbar item.hint property is deprecated, please use item.tooltip. Item -> ", i), l !== 0 && i.type != "new-line" || (r++, a += `
                    <div class="w2ui-tb-line">
                        <div class="w2ui-scroll-wrapper w2ui-eaction" data-mousedown="resize">
                            <div class="w2ui-tb-right">${this.right[r - 1] ?? ""}</div>
                        </div>
                        <div class="w2ui-scroll-left w2ui-eaction" data-click='["scroll", "left", "${r}"]'></div>
                        <div class="w2ui-scroll-right w2ui-eaction" data-click='["scroll", "right", "${r}"]'></div>
                    </div>
                `), i.line = r);
      }
      return n(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-toolbar").html(a), 0 < n(this.box).length && (n(this.box)[0].style.cssText += this.style), u.bindEvents(n(this.box).find(".w2ui-tb-line .w2ui-eaction"), this), this.last.observeResize = new ResizeObserver(() => {
        this.resize();
      }), this.last.observeResize.observe(this.box), this.refresh(), this.resize(), s.finish(), Date.now() - t;
    }
  }
  refresh(e) {
    var t = Date.now(), s = this.trigger("refresh", { target: e ?? this.name, item: this.get(e) });
    if (s.isCancelled !== true) {
      let h;
      if (e == null) for (let o = 0; o < this.items.length; o++) {
        var i = this.items[o];
        i.id == null && (i.id = "item_" + o), this.refresh(i.id);
      }
      else {
        var a = this.get(e);
        if (a == null) return false;
        if (typeof a.onRefresh != "function" || (h = this.trigger("refresh", { target: e, item: a, object: a })).isCancelled !== true) {
          var r = `#tb_${this.name}_item_` + u.escapeId(a.id);
          let o = n(this.box).find(r);
          var l = this.getItemHTML(a);
          if (this.tooltipHide(e), a.type == "spacer" && n(this.box).find(".w2ui-tb-line:nth-child(" + a.line).find(".w2ui-tb-right").css("width", "auto"), o.length === 0) {
            e = parseInt(this.get(e, true)) + 1;
            let c = n(this.box).find(`#tb_${this.name}_item_` + u.escapeId(this.items[e] ? this.items[e].id : ""));
            c.length == 0 ? c = n(this.box).find(".w2ui-tb-line:nth-child(" + a.line).find(".w2ui-tb-right").before(l) : c.after(l), u.bindEvents(n(this.box).find(r), this);
          } else {
            n(this.box).find(r).replace(n.html(l));
            let c = n(this.box).find(r).get(0), d = (u.bindEvents(c, this), F.get(true));
            Object.keys(d).forEach((p) => {
              d[p].anchor == o.get(0) && (d[p].anchor = c);
            });
          }
          if (["menu", "menu-radio", "menu-check"].includes(a.type) && a.checked) {
            let c = Array.isArray(a.selected) ? a.selected : [a.selected];
            a.items.forEach((d) => {
              c.includes(d.id) ? d.checked = true : d.checked = false;
            }), W.update(this.name + "-drop", a.items);
          }
          return typeof a.onRefresh == "function" && h.finish(), s.finish(), Date.now() - t;
        }
      }
    }
  }
  resize() {
    var e = Date.now(), t = this.trigger("resize", { target: this.name });
    if (t.isCancelled !== true) return n(this.box).find(".w2ui-tb-line").each((i) => {
      var i = n(i), a = (i.find(".w2ui-scroll-left, .w2ui-scroll-right").hide(), i.find(".w2ui-scroll-wrapper").get(0)), l = i.find(".w2ui-tb-right"), r = i.get(0).getBoundingClientRect().width, l = 0 < l.length ? l[0].offsetLeft + l[0].clientWidth : 0;
      r < l && (0 < a.scrollLeft && i.find(".w2ui-scroll-left").show(), r < l - a.scrollLeft) && i.find(".w2ui-scroll-right").show();
    }), t.finish(), Date.now() - e;
  }
  destroy() {
    var _a;
    var e = this.trigger("destroy", { target: this.name });
    e.isCancelled !== true && (0 < n(this.box).find(".w2ui-scroll-wrapper  .w2ui-tb-right").length && n(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-toolbar").html(""), n(this.box).html(""), (_a = this.last.observeResize) == null ? void 0 : _a.disconnect(), delete ie[this.name], e.finish());
  }
  getItemHTML(e) {
    let t = "", s = (e.caption != null && e.text == null && (e.text = e.caption), e.text == null && (e.text = ""), e.tooltip == null && e.hint != null && (e.tooltip = e.hint), e.tooltip == null && (e.tooltip = ""), typeof e.get == "function" || !Array.isArray(e.items) && typeof e.items != "function" || (e.get = function(l) {
      let h = e.items;
      return (h = typeof h == "function" ? e.items(e) : h).find((o) => o.id == l);
    }), ""), i = typeof e.text == "function" ? e.text.call(this, e) : e.text;
    e.icon && (s = e.icon, typeof e.icon == "function" && (s = e.icon.call(this, e)), s = `<div class="w2ui-tb-icon">${s = String(s).slice(0, 1) !== "<" ? `<span class="${s}"></span>` : s}</div>`);
    var a = ["w2ui-tb-button"];
    switch (e.checked && a.push("checked"), e.disabled && a.push("disabled"), e.hidden && a.push("hidden"), s || a.push("no-icon"), e.type) {
      case "color":
      case "text-color":
        typeof e.color == "string" && (e.color.slice(0, 1) == "#" && (e.color = e.color.slice(1)), [3, 6, 8].includes(e.color.length)) && (e.color = "#" + e.color), e.type == "color" && (i = `<span class="w2ui-tb-color-box" style="background-color: ${e.color != null ? e.color : "#fff"}"></span>
                           ` + (e.text ? `<div style="margin-left: 17px;">${u.lang(e.text)}</div>` : "")), e.type == "text-color" && (i = '<span style="color: ' + (e.color != null ? e.color : "#444") + ';">' + (e.text ? u.lang(e.text) : "<b>Aa</b>") + "</span>");
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
                        class="${a.join(" ")} ${e.class || ""}"
                        ${e.disabled ? "" : `data-click='["click","${e.id}"]'
                               data-mouseenter='["mouseAction", "event", "this", "Enter", "${e.id}"]'
                               data-mouseleave='["mouseAction", "event", "this", "Leave", "${e.id}"]'
                               data-mousedown='["mouseAction", "event", "this", "Down", "${e.id}"]'
                               data-mouseup='["mouseAction", "event", "this", "Up", "${e.id}"]'`}
                    >
                        ${s}
                        ${i != "" ? `<div class="w2ui-tb-text" style="${e.style || ""}">
                                    ${u.lang(i)}
                                    ${e.count != null ? u.stripSpaces(`<span class="w2ui-tb-count">
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
        t = `<div id="tb_${this.name}_item_${e.id}" class="w2ui-tb-html ${a.join(" ")}"
                            style="${e.hidden ? "display: none" : ""}; ${e.style || ""}">
                            ${typeof e.html == "function" ? e.html.call(this, e) : e.html}
                        </div>`;
    }
    return t;
  }
  tooltipShow(e) {
    if (this.tooltip != null) {
      var t = n(this.box).find("#tb_" + this.name + "_item_" + u.escapeId(e)).get(0), e = this.get(e), s = this.tooltip;
      let a = e.tooltip;
      typeof a == "function" && (a = a.call(this, e)), ["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(e.type) && e.checked == 1 || F.show({ anchor: t, name: this.name + "-tooltip", html: a, position: s });
    }
  }
  tooltipHide(e) {
    this.tooltip != null && F.hide(this.name + "-tooltip");
  }
  menuClick(e) {
    if (e.item && !e.item.disabled) {
      var t = this.trigger(e.remove !== true ? "click" : "remove", { target: e.item.id + ":" + e.subItem.id, item: e.item, subItem: e.subItem, originalEvent: e.originalEvent });
      if (t.isCancelled !== true) {
        let a = e.subItem, r = this.get(e.item.id), l = r.items;
        if (typeof l == "function" && (l = r.items()), r.type == "menu" && (r.selected = a.id), r.type == "menu-radio" && (r.selected = a.id, Array.isArray(l) && l.forEach((h) => {
          h.checked === true && delete h.checked, Array.isArray(h.items) && h.items.forEach((o) => {
            o.checked === true && delete o.checked;
          });
        }), a.checked = true), r.type == "menu-check") {
          if (Array.isArray(r.selected) || (r.selected = []), a.group == null) {
            var s = r.selected.indexOf(a.id);
            s == -1 ? (r.selected.push(a.id), a.checked = true) : (r.selected.splice(s, 1), a.checked = false);
          } else if (a.group !== false) {
            let h = [];
            s = r.selected.indexOf(a.id);
            let o = (c) => {
              c.forEach((d) => {
                var p;
                d.group === a.group && (p = r.selected.indexOf(d.id)) != -1 && (d.id != a.id && h.push(d.id), r.selected.splice(p, 1)), Array.isArray(d.items) && o(d.items);
              });
            };
            o(l), s == -1 && (r.selected.push(a.id), a.checked = true);
          }
        }
        if (typeof a.route == "string") {
          let h = a.route !== "" ? ("/" + a.route).replace(/\/{2,}/g, "/") : "";
          var i = u.parseRoute(h);
          if (0 < i.keys.length) for (let o = 0; o < i.keys.length; o++) this.routeData[i.keys[o].name] != null && (h = h.replace(new RegExp(":" + i.keys[o].name, "g"), this.routeData[i.keys[o].name]));
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
  mouseAction(r, t, s, i) {
    var a = this.get(i), r = this.trigger("mouse" + s, { target: i, item: a, object: a, originalEvent: r });
    if (r.isCancelled !== true && !a.disabled && !a.hidden) {
      switch (s) {
        case "Enter":
          n(t).addClass("over"), this.tooltipShow(i);
          break;
        case "Leave":
          n(t).removeClass("over down"), this.tooltipHide(i);
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
class os extends he {
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
    let s = [];
    return t.forEach((i) => {
      var a, r;
      i.id == null ? console.log(`ERROR: The parameter "id" is required but not supplied. (obj: ${this.name})`) : u.checkUniqueId(i.id, this.tabs, "tabs", this.name) && (i = Object.assign({}, this.tab_template, i), e == null ? (this.tabs.push(i), s.push(this.animateInsert(null, i))) : (a = this.get(e, true), r = this.tabs[a].id, this.tabs.splice(a, 0, i), s.push(this.animateInsert(r, i))));
    }), Promise.all(s);
  }
  remove() {
    let e = 0;
    return Array.from(arguments).forEach((t) => {
      t = this.get(t), t && (e++, this.tabs.splice(this.get(t.id, true), 1), n(this.box).find(`#tabs_${this.name}_tab_` + u.escapeId(t.id)).remove());
    }), this.resize(), e;
  }
  select(e) {
    return this.active != e && this.get(e) != null && (this.active = e, this.refresh(), true);
  }
  set(e, t) {
    var s = this.get(e, true);
    return s != null && (u.extend(this.tabs[s], t), this.refresh(e), true);
  }
  get(e, t) {
    if (arguments.length === 0) {
      var s = [];
      for (let i = 0; i < this.tabs.length; i++) this.tabs[i].id != null && s.push(this.tabs[i].id);
      return s;
    }
    for (let i = 0; i < this.tabs.length; i++) if (this.tabs[i].id == e) return t === true ? i : this.tabs[i];
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
      let h = function(o, c) {
        o += c;
        let d = l.tabs[o];
        return d = d && d.hidden ? h(o, c) : d;
      }, l = this;
      var t = this.last.moving, a = this.tabs[t.index], s = h(t.index, 1), i = h(t.index, -1), a = n(this.box).find("#tabs_" + this.name + "_tab_" + u.escapeId(a.id));
      if (0 < t.divX && s) {
        var r = n(this.box).find("#tabs_" + this.name + "_tab_" + u.escapeId(s.id));
        let o = parseInt(a.get(0).clientWidth), c = parseInt(r.get(0).clientWidth);
        if (o = o < c ? Math.floor(o / 3) : Math.floor(c / 3), c -= o, t.divX > c) return s = this.tabs.indexOf(s), this.tabs.splice(t.index, 0, this.tabs.splice(s, 1)[0]), t.$tab.before(r.get(0)), t.$tab.css("opacity", 0), void Object.assign(this.last.moving, { index: s, divX: -o, x: e.pageX + o, left: t.left + t.divX + o });
      }
      if (t.divX < 0 && i) {
        r = n(this.box).find("#tabs_" + this.name + "_tab_" + u.escapeId(i.id));
        let o = parseInt(a.get(0).clientWidth), c = parseInt(r.get(0).clientWidth);
        o = o < c ? Math.floor(o / 3) : Math.floor(c / 3), c -= o, Math.abs(t.divX) > c && (s = this.tabs.indexOf(i), this.tabs.splice(t.index, 0, this.tabs.splice(s, 1)[0]), r.before(t.$tab), t.$tab.css("opacity", 0), Object.assign(t, { index: s, divX: o, x: e.pageX - o, left: t.left + t.divX - o }));
      }
    }
  }
  mouseAction(e, t, s) {
    var i = this.get(t), a = this.trigger("mouse" + e, { target: t, tab: i, object: i, originalEvent: s });
    if (a.isCancelled !== true && !i.disabled && !i.hidden) {
      switch (e) {
        case "Enter":
          this.tooltipShow(t);
          break;
        case "Leave":
          this.tooltipHide(t);
          break;
        case "Down":
          this.initReorder(t, s);
      }
      a.finish();
    }
  }
  tooltipShow(s) {
    var t = this.get(s), s = n(this.box).find("#tabs_" + this.name + "_tab_" + u.escapeId(s)).get(0);
    if (this.tooltip != null && !t.disabled && !this.last.reordering) {
      var i = this.tooltip;
      let a = t.tooltip;
      typeof a == "function" && (a = a.call(this, t)), F.show({ anchor: s, name: this.name + "_tooltip", html: a, position: i });
    }
  }
  tooltipHide(e) {
    this.tooltip != null && F.hide(this.name + "_tooltip");
  }
  getTabHTML(e) {
    if (e = this.get(e, true), e = this.tabs[e], e == null) return false;
    e.text == null && e.caption != null && (e.text = e.caption), e.tooltip == null && e.hint != null && (e.tooltip = e.hint), e.caption != null && console.log("NOTICE: tabs tab.caption property is deprecated, please use tab.text. Tab -> ", e), e.hint != null && console.log("NOTICE: tabs tab.hint property is deprecated, please use tab.tooltip. Tab -> ", e);
    let t = e.text, s = ((t = typeof t == "function" ? t.call(this, e) : t) == null && (t = ""), ""), i = "";
    return e.hidden && (i += "display: none;"), e.disabled && (i += "opacity: 0.2;"), e.closable && !e.disabled && (s = `<div class="w2ui-tab-close w2ui-eaction ${this.active === e.id ? "active" : ""}"
                data-mousedown="stop" data-mouseup="clickClose|${e.id}|event">
            </div>`), `
            <div id="tabs_${this.name}_tab_${e.id}" style="${i} ${e.style}"
                class="w2ui-tab w2ui-eaction ${this.active === e.id ? "active" : ""} ${e.closable ? "closable" : ""} ${e.class || ""}"
                data-mouseenter="mouseAction|Enter|${e.id}|event]"
                data-mouseleave="mouseAction|Leave|${e.id}|event]"
                data-mousedown="mouseAction|Down|${e.id}|event"
                data-mouseup="mouseAction|Up|${e.id}|event"
                data-click="click|${e.id}|event"
               >
                    ${u.lang(t) + s}
            </div>`;
  }
  refresh(e) {
    var t = Date.now(), s = (this.flow == "up" ? n(this.box).addClass("w2ui-tabs-up") : n(this.box).removeClass("w2ui-tabs-up"), this.trigger("refresh", { target: e ?? this.name, object: this.get(e) }));
    if (s.isCancelled !== true) {
      if (e == null) for (let r = 0; r < this.tabs.length; r++) this.refresh(this.tabs[r].id);
      else {
        var i = "#tabs_" + this.name + "_tab_" + u.escapeId(e), a = n(this.box).find(i), e = this.getTabHTML(e);
        a.length === 0 ? n(this.box).find("#tabs_" + this.name + "_right").before(e) : n(this.box).find(".tab-animate-insert").length == 0 && a.replace(e), u.bindEvents(n(this.box).find(i + `, ${i} .w2ui-eaction`), this);
      }
      return n(this.box).find("#tabs_" + this.name + "_right").html(this.right), s.finish(), Date.now() - t;
    }
  }
  render(e) {
    var t = Date.now(), s = (typeof e == "string" && (e = n(e).get(0)), this.trigger("render", { target: this.name, box: e ?? this.box }));
    if (s.isCancelled !== true) return e != null && (0 < n(this.box).find("#tabs_" + this.name + "_right").length && n(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-tabs").html(""), this.box = e), !!this.box && (e = `
            <div class="w2ui-tabs-line"></div>
            <div class="w2ui-scroll-wrapper w2ui-eaction" data-mousedown="resize">
                <div id="tabs_${this.name}_right" class="w2ui-tabs-right">${this.right}</div>
            </div>
            <div class="w2ui-scroll-left w2ui-eaction" data-click='["scroll","left"]'></div>
            <div class="w2ui-scroll-right w2ui-eaction" data-click='["scroll","right"]'></div>`, n(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-tabs").html(e), 0 < n(this.box).length && (n(this.box)[0].style.cssText += this.style), u.bindEvents(n(this.box).find(".w2ui-eaction"), this), this.last.observeResize = new ResizeObserver(() => {
      this.resize();
    }), this.last.observeResize.observe(this.box), s.finish(), this.refresh(), this.resize(), Date.now() - t);
  }
  initReorder(e, t) {
    if (this.reorder) {
      let s = this, i = n(this.box).find("#tabs_" + this.name + "_tab_" + u.escapeId(e)), a = this.get(e, true), r = n(i.get(0).cloneNode(true)), l;
      r.attr("id", "#tabs_" + this.name + "_tab_ghost"), this.last.moving = { index: a, indexFrom: a, $tab: i, $ghost: r, divX: 0, left: i.get(0).getBoundingClientRect().left, parentX: n(this.box).get(0).getBoundingClientRect().left, x: t.pageX, opacity: i.css("opacity") }, n(document).off(".w2uiTabReorder").on("mousemove.w2uiTabReorder", function(h) {
        if (!s.last.reordering) {
          if ((l = s.trigger("reorder", { target: s.tabs[a].id, indexFrom: a, tab: s.tabs[a] })).isCancelled === true) return;
          F.hide(this.name + "_tooltip"), s.last.reordering = true, r.addClass("moving"), r.css({ "pointer-events": "none", position: "absolute", left: i.get(0).getBoundingClientRect().left }), i.css("opacity", 0), n(s.box).find(".w2ui-scroll-wrapper").append(r.get(0)), n(s.box).find(".w2ui-tab-close").hide();
        }
        s.last.moving.divX = h.pageX - s.last.moving.x, r.css("left", s.last.moving.left - s.last.moving.parentX + s.last.moving.divX + "px"), s.dragMove(h);
      }).on("mouseup.w2uiTabReorder", function() {
        n(document).off(".w2uiTabReorder"), r.css({ transition: "0.1s", left: s.last.moving.$tab.get(0).getBoundingClientRect().left - s.last.moving.parentX }), n(s.box).find(".w2ui-tab-close").show(), setTimeout(() => {
          r.remove(), i.css({ opacity: s.last.moving.opacity }), s.last.reordering && l.finish({ indexTo: s.last.moving.index }), s.last.reordering = false;
        }, 100);
      });
    }
  }
  scroll(e, t) {
    return new Promise((s, i) => {
      var a = n(this.box).find(".w2ui-scroll-wrapper"), r = a.get(0).scrollLeft, l = a.find(".w2ui-tabs-right").get(0), h = a.parent().get(0).getBoundingClientRect().width, o = r + parseInt(l.offsetLeft) + parseInt(l.clientWidth);
      switch (e) {
        case "left": {
          let c = r - h + 50;
          c <= 0 && (c = 0), a.get(0).scrollTo({ top: 0, left: c, behavior: t ? "atuo" : "smooth" });
          break;
        }
        case "right": {
          let c = r + h - 50;
          c >= o - h && (c = o - h), a.get(0).scrollTo({ top: 0, left: c, behavior: t ? "atuo" : "smooth" });
          break;
        }
      }
      setTimeout(() => {
        this.resize(), s();
      }, t ? 0 : 350);
    });
  }
  scrollIntoView(e, t) {
    return new Promise((s, i) => {
      e == null && (e = this.active), this.get(e) != null && (n(this.box).find("#tabs_" + this.name + "_tab_" + u.escapeId(e)).get(0).scrollIntoView({ block: "start", inline: "center", behavior: t ? "atuo" : "smooth" }), setTimeout(() => {
        this.resize(), s();
      }, t ? 0 : 500));
    });
  }
  resize() {
    var e = Date.now();
    if (this.box != null) {
      var t, s, i, a, r = this.trigger("resize", { target: this.name });
      if (r.isCancelled !== true) return (t = n(this.box)).find(".w2ui-scroll-left, .w2ui-scroll-right").hide(), s = t.find(".w2ui-scroll-wrapper").get(0), a = t.find(".w2ui-tabs-right"), (i = t.get(0).getBoundingClientRect().width) < (a = 0 < a.length ? a[0].offsetLeft + a[0].clientWidth : 0) && (0 < s.scrollLeft && t.find(".w2ui-scroll-left").show(), i < a - s.scrollLeft) && t.find(".w2ui-scroll-right").show(), r.finish(), Date.now() - e;
    }
  }
  destroy() {
    var _a;
    var e = this.trigger("destroy", { target: this.name });
    e.isCancelled !== true && (0 < n(this.box).find("#tabs_" + this.name + "_right").length && n(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-tabs").html(""), (_a = this.last.observeResize) == null ? void 0 : _a.disconnect(), delete ie[this.name], e.finish());
  }
  click(e, t) {
    var s = this.get(e);
    if (s == null || s.disabled || this.last.reordering) return false;
    if (e = this.trigger("click", { target: e, tab: s, object: s, originalEvent: t }), e.isCancelled !== true) {
      if (n(this.box).find("#tabs_" + this.name + "_tab_" + u.escapeId(this.active)).removeClass("active"), this.active = s.id, n(this.box).find("#tabs_" + this.name + "_tab_" + u.escapeId(this.active)).addClass("active"), typeof s.route == "string") {
        let a = s.route !== "" ? ("/" + s.route).replace(/\/{2,}/g, "/") : "";
        var i = u.parseRoute(a);
        if (0 < i.keys.length) for (let r = 0; r < i.keys.length; r++) this.routeData[i.keys[r].name] != null && (a = a.replace(new RegExp(":" + i.keys[r].name, "g"), this.routeData[i.keys[r].name]));
        setTimeout(() => {
          window.location.hash = a;
        }, 1);
      }
      e.finish();
    }
  }
  clickClose(e, t) {
    var s = this.get(e);
    if (s == null || s.disabled) return false;
    let i = this.trigger("close", { target: e, object: s, tab: s, originalEvent: t });
    i.isCancelled !== true && (this.animateClose(e).then(() => {
      this.remove(e), i.finish(), this.refresh();
    }), t) && t.stopPropagation();
  }
  animateClose(e) {
    return new Promise((t, s) => {
      var i = n(this.box).find("#tabs_" + this.name + "_tab_" + u.escapeId(e)), a = parseInt(i.get(0).clientWidth || 0);
      let r = i.replace(`<div class="tab-animate-close" style="display: inline-block; flex-shrink: 0; width: ${a}px; transition: width 0.25s"></div>`);
      setTimeout(() => {
        r.css({ width: "0px" });
      }, 1), setTimeout(() => {
        r.remove(), this.resize(), t();
      }, 500);
    });
  }
  animateInsert(e, t) {
    return new Promise((s, i) => {
      let a = n(this.box).find("#tabs_" + this.name + "_tab_" + u.escapeId(e)), r = n.html(this.getTabHTML(t.id));
      if (a.length == 0) (a = n(this.box).find("#tabs_tabs_right")).before(r), this.resize();
      else {
        r.css({ opacity: 0 }), n(this.box).find("#tabs_tabs_right").before(r.get(0));
        let l = n(this.box).find("#" + r.attr("id")).get(0).clientWidth ?? 0, h = n.html('<div class="tab-animate-insert" style="flex-shrink: 0; width: 0; transition: width 0.25s"></div>');
        a.before(h), r.hide(), h.before(r[0]), setTimeout(() => {
          h.css({ width: l + "px" });
        }, 1), setTimeout(() => {
          h.remove(), r.css({ opacity: 1 }).show(), this.refresh(t.id), this.resize(), s();
        }, 500);
      }
    });
  }
}
class cs extends he {
  constructor(e) {
    if (super(e.name), this.name = null, this.box = null, this.columns = [], this.columnGroups = [], this.records = [], this.summary = [], this.searches = [], this.toolbar = {}, this.ranges = [], this.contextMenu = [], this.searchMap = {}, this.searchData = [], this.sortMap = {}, this.sortData = [], this.savedSearches = [], this.defaultSearches = [], this.total = 0, this.recid = null, this.last = { field: "", label: "", logic: "AND", search: "", searchIds: [], selection: { indexes: [], columns: {} }, saved_sel: null, multi: false, scrollTop: 0, scrollLeft: 0, colStart: 0, colEnd: 0, fetch: { action: "", offset: null, start: 0, response: 0, options: null, controller: null, loaded: false, hasMore: false }, pull_more: false, pull_refresh: true, range_start: null, range_end: null, sel_ind: null, sel_col: null, sel_type: null, sel_recid: null, idCache: {}, move: null, cancelClick: null, inEditMode: false, _edit: null, kbd_timer: null, marker_timer: null, click_time: null, click_recid: null, bubbleEl: null, colResizing: false, tmp: null, copy_event: null, userSelect: "", columnDrag: false, state: null, show_extra: 0, toolbar_height: 0 }, this.header = "", this.url = "", this.limit = 100, this.offset = 0, this.postData = {}, this.routeData = {}, this.httpHeaders = {}, this.show = { header: false, toolbar: false, footer: false, columnMenu: true, columnHeaders: true, lineNumbers: false, expandColumn: false, selectColumn: false, emptyRecords: true, toolbarReload: true, toolbarColumns: false, toolbarSearch: true, toolbarAdd: false, toolbarEdit: false, toolbarDelete: false, toolbarSave: false, searchAll: true, searchLogic: true, searchHiddenMsg: false, searchSave: true, statusRange: true, statusBuffered: false, statusRecordID: true, statusSelection: true, statusResponse: true, statusSort: false, statusSearch: false, recordTitles: false, selectionBorder: true, skipRecords: true, saveRestoreState: true }, this.stateId = null, this.hasFocus = false, this.autoLoad = true, this.fixedBody = true, this.recordHeight = 32, this.lineNumberWidth = 34, this.keyboard = true, this.selectType = "row", this.liveSearch = false, this.multiSearch = true, this.multiSelect = true, this.multiSort = true, this.reorderColumns = false, this.reorderRows = false, this.showExtraOnSearch = 0, this.markSearch = true, this.columnTooltip = "top|bottom", this.disableCVS = false, this.nestedFields = true, this.vs_start = 150, this.vs_extra = 5, this.style = "", this.tabIndex = null, this.dataType = null, this.parser = null, this.advanceOnEdit = true, this.useLocalStorage = true, this.colTemplate = { text: "", field: "", size: null, min: 20, max: null, gridMinWidth: null, sizeCorrected: null, sizeCalculated: null, sizeOriginal: null, sizeType: null, hidden: false, sortable: false, sortMode: null, searchable: false, resizable: true, hideable: true, autoResize: null, attr: "", style: "", render: null, title: null, tooltip: null, editable: {}, frozen: false, info: null, clipboardCopy: false }, this.stateColProps = { text: false, field: true, size: true, min: false, max: false, gridMinWidth: false, sizeCorrected: false, sizeCalculated: true, sizeOriginal: true, sizeType: true, hidden: true, sortable: false, sortMode: true, searchable: false, resizable: false, hideable: false, autoResize: false, attr: false, style: false, render: false, title: false, tooltip: false, editable: false, frozen: true, info: false, clipboardCopy: false }, this.msgDelete = "Are you sure you want to delete ${count} ${records}?", this.msgNotJSON = "Returned data is not in valid JSON format.", this.msgHTTPError = "HTTP error. See console for more details.", this.msgServerError = "Server error", this.msgRefresh = "Refreshing...", this.msgNeedReload = "Your remote data source record count has changed, reloading from the first record.", this.msgEmpty = "", this.buttons = { reload: { type: "button", id: "w2ui-reload", icon: "w2ui-icon-reload", tooltip: "Reload data in the list" }, columns: { type: "menu-check", id: "w2ui-column-on-off", icon: "w2ui-icon-columns", tooltip: "Show/hide columns", overlay: { align: "none" } }, search: { type: "html", id: "w2ui-search", html: '<div class="w2ui-icon w2ui-icon-search w2ui-search-down w2ui-action" data-click="searchShowFields"></div>' }, add: { type: "button", id: "w2ui-add", text: "Add New", tooltip: "Add new record", icon: "w2ui-icon-plus" }, edit: { type: "button", id: "w2ui-edit", text: "Edit", tooltip: "Edit selected record", icon: "w2ui-icon-pencil", batch: 1, disabled: true }, delete: { type: "button", id: "w2ui-delete", text: "Delete", tooltip: "Delete selected records", icon: "w2ui-icon-cross", batch: true, disabled: true }, save: { type: "button", id: "w2ui-save", text: "Save", tooltip: "Save changed records", icon: "w2ui-icon-check" } }, this.operators = { text: ["is", "begins", "contains", "ends"], number: ["=", "between", ">", "<", ">=", "<="], date: ["is", { oper: "less", text: "before" }, { oper: "more", text: "since" }, "between"], list: ["is"], hex: ["is", "between"], color: ["is", "begins", "contains", "ends"], enum: ["in", "not in"] }, this.defaultOperator = { text: "begins", number: "=", date: "is", list: "is", enum: "in", hex: "begins", color: "begins" }, this.operatorsMap = { text: "text", int: "number", float: "number", money: "number", currency: "number", percent: "number", hex: "hex", alphanumeric: "text", color: "color", date: "date", time: "date", datetime: "date", list: "list", combo: "text", enum: "enum", file: "enum", select: "list", radio: "list", checkbox: "list", toggle: "list" }, this.onAdd = null, this.onEdit = null, this.onRequest = null, this.onLoad = null, this.onDelete = null, this.onSave = null, this.onSelect = null, this.onClick = null, this.onDblClick = null, this.onContextMenu = null, this.onContextMenuClick = null, this.onColumnClick = null, this.onColumnDblClick = null, this.onColumnContextMenu = null, this.onColumnResize = null, this.onColumnAutoResize = null, this.onSort = null, this.onSearch = null, this.onSearchOpen = null, this.onChange = null, this.onRestore = null, this.onExpand = null, this.onCollapse = null, this.onError = null, this.onKeydown = null, this.onToolbar = null, this.onColumnOnOff = null, this.onCopy = null, this.onPaste = null, this.onSelectionExtend = null, this.onEditField = null, this.onRender = null, this.onRefresh = null, this.onReload = null, this.onResize = null, this.onDestroy = null, this.onStateSave = null, this.onStateRestore = null, this.onFocus = null, this.onBlur = null, this.onReorderRow = null, this.onSearchSave = null, this.onSearchRemove = null, this.onSearchSelect = null, this.onColumnSelect = null, this.onColumnDragStart = null, this.onColumnDragEnd = null, this.onResizerDblClick = null, this.onMouseEnter = null, this.onMouseLeave = null, u.extend(this, e), Array.isArray(this.records)) {
      let t = [];
      this.records.forEach((s, i) => {
        var _a;
        s[this.recid] != null && (s.recid = s[this.recid]), s.recid == null && console.log("ERROR: Cannot add records without recid. (obj: " + this.name + ")"), ((_a = s.w2ui) == null ? void 0 : _a.summary) === true && (this.summary.push(s), t.push(i));
      }), t.sort();
      for (let s = t.length - 1; 0 <= s; s--) this.records.splice(t[s], 1);
    }
    Array.isArray(this.columns) && this.columns.forEach((t, s) => {
      if (t = u.extend({}, this.colTemplate, t), s = (this.columns[s] = t).searchable, s != null && s !== false && this.getSearch(t.field) == null) if (u.isPlainObject(s)) this.addSearch(u.extend({ field: t.field, label: t.text, type: "text" }, s));
      else {
        let i = t.searchable, a = "";
        t.searchable === true && (i = "text", a = 'size="20"'), this.addSearch({ field: t.field, label: t.text, type: i, attr: a });
      }
    }), Array.isArray(this.defaultSearches) && this.defaultSearches.forEach((t, s) => {
      t.id = "default-" + s, t.icon ?? (t.icon = "w2ui-icon-search");
    }), e = this.cache("searches"), Array.isArray(e) && e.forEach((t) => {
      this.savedSearches.push({ id: t.id ?? "none", text: t.text ?? "none", icon: "w2ui-icon-search", remove: true, logic: t.logic ?? "AND", data: t.data ?? [] });
    }), typeof this.box == "string" && (this.box = n(this.box).get(0)), this.box && this.render(this.box);
  }
  add(e, t) {
    var _a, _b;
    Array.isArray(e) || (e = [e]);
    let s = 0;
    for (let a = 0; a < e.length; a++) {
      var i = e[a];
      i[this.recid] != null && (i.recid = i[this.recid]), i.recid == null ? console.log("ERROR: Cannot add record without recid. (obj: " + this.name + ")") : (((_a = i.w2ui) == null ? void 0 : _a.summary) === true ? t ? this.summary.unshift(i) : this.summary.push(i) : t ? this.records.unshift(i) : this.records.push(i), s++);
    }
    return (((_b = this.url) == null ? void 0 : _b.get) ?? this.url) || (this.total = this.records.length, this.localSort(false, true), this.localSearch()), this.refresh(), s;
  }
  find(e, t, s) {
    var i, a = [];
    let r = false;
    for (i in e = e ?? {}) String(i).indexOf(".") != -1 && (r = true);
    var l = s ? this.last.range_start : 0;
    let h = s ? this.last.range_end + 1 : this.records.length;
    h > this.records.length && (h = this.records.length);
    for (let c = l; c < h; c++) {
      let d = true;
      for (var o in e) {
        let p = this.records[c][o];
        r && String(o).indexOf(".") != -1 && (p = this.parseField(this.records[c], o)), e[o] == "not-null" ? p != null && p !== "" || (d = false) : e[o] != p && (d = false);
      }
      d && t !== true && a.push(this.records[c].recid), d && t === true && a.push(c);
    }
    return a;
  }
  set(e, t, s) {
    if (typeof e == "object" && e !== null && (s = t, t = e, e = null), e == null) {
      for (let a = 0; a < this.records.length; a++) u.extend(this.records[a], t);
      s !== true && this.refresh();
    } else {
      var i = this.get(e, true);
      if (i == null) return false;
      !this.records[i] || this.records[i].recid != e ? u.extend(this.summary[i], t) : u.extend(this.records[i], t), s !== true && this.refreshRow(e, i);
    }
    return true;
  }
  get(e, t) {
    if (Array.isArray(e)) {
      var s = [];
      for (let r = 0; r < e.length; r++) {
        var i = this.get(e[r], t);
        i !== null && s.push(i);
      }
      return s;
    }
    {
      let r = this.last.idCache;
      r || (this.last.idCache = r = {});
      var a = r[e];
      if (typeof a == "number") {
        if (0 <= a && a < this.records.length && this.records[a].recid == e) return t === true ? a : this.records[a];
        if (0 <= (a = ~a) && a < this.summary.length && this.summary[a].recid == e) return t === true ? a : this.summary[a];
        this.last.idCache = r = {};
      }
      for (let l = 0; l < this.records.length; l++) if (this.records[l].recid == e) return r[e] = l, t === true ? l : this.records[l];
      for (let l = 0; l < this.summary.length; l++) if (this.summary[l].recid == e) return r[e] = ~l, t === true ? l : this.summary[l];
      return null;
    }
  }
  getFirst(e) {
    if (this.records.length == 0) return null;
    let t = this.records[0];
    var s = this.last.searchIds;
    return t = 0 < this.searchData.length ? Array.isArray(s) && 0 < s.length ? this.records[s[e || 0]] : null : t;
  }
  remove() {
    var _a;
    let e = 0;
    for (let t = 0; t < arguments.length; t++) {
      for (let s = this.records.length - 1; 0 <= s; s--) this.records[s].recid == arguments[t] && (this.records.splice(s, 1), e++);
      for (let s = this.summary.length - 1; 0 <= s; s--) this.summary[s].recid == arguments[t] && (this.summary.splice(s, 1), e++);
    }
    return (((_a = this.url) == null ? void 0 : _a.get) ?? this.url) || (this.localSort(false, true), this.localSearch()), this.refresh(), e;
  }
  addColumn(e, t) {
    let s = 0;
    arguments.length == 1 ? (t = e, e = this.columns.length) : (e = typeof e == "string" ? this.getColumn(e, true) : e) == null && (e = this.columns.length), Array.isArray(t) || (t = [t]);
    for (let a = 0; a < t.length; a++) {
      var i = u.extend({}, this.colTemplate, t[a]);
      if (this.columns.splice(e, 0, i), t[a].searchable) {
        let r = t[a].searchable, l = "";
        t[a].searchable === true && (r = "text", l = 'size="20"'), this.addSearch({ field: t[a].field, label: t[a].text, type: r, attr: l });
      }
      e++, s++;
    }
    return this.refresh(), s;
  }
  removeColumn() {
    let e = 0;
    for (let t = 0; t < arguments.length; t++) for (let s = this.columns.length - 1; 0 <= s; s--) this.columns[s].field == arguments[t] && (this.columns[s].searchable && this.removeSearch(arguments[t]), this.columns.splice(s, 1), e++);
    return this.refresh(), e;
  }
  getColumn(e, t) {
    if (arguments.length === 0) {
      var s = [];
      for (let i = 0; i < this.columns.length; i++) s.push(this.columns[i].field);
      return s;
    }
    for (let i = 0; i < this.columns.length; i++) if (this.columns[i].field == e) return t === true ? i : this.columns[i];
    return null;
  }
  updateColumn(e, t) {
    let s = 0;
    return (e = Array.isArray(e) ? e : [e]).forEach((i) => {
      this.columns.forEach((a) => {
        if (a.field == i) {
          let r = u.clone(t);
          Object.keys(r).forEach((l) => {
            typeof r[l] == "function" && (r[l] = r[l](a)), a[l] != r[l] && s++;
          }), u.extend(a, r);
        }
      });
    }), 0 < s && this.refresh(), s;
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
    let s = 0;
    arguments.length == 1 ? (t = e, e = this.searches.length) : (e = typeof e == "string" ? this.getSearch(e, true) : e) == null && (e = this.searches.length), Array.isArray(t) || (t = [t]);
    for (let i = 0; i < t.length; i++) this.searches.splice(e, 0, t[i]), e++, s++;
    return this.searchClose(), s;
  }
  removeSearch() {
    let e = 0;
    for (let t = 0; t < arguments.length; t++) for (let s = this.searches.length - 1; 0 <= s; s--) this.searches[s].field == arguments[t] && (this.searches.splice(s, 1), e++);
    return this.searchClose(), e;
  }
  getSearch(e, t) {
    if (arguments.length === 0) {
      var s = [];
      for (let i = 0; i < this.searches.length; i++) s.push(this.searches[i].field);
      return s;
    }
    for (let i = 0; i < this.searches.length; i++) if (this.searches[i].field == e) return t === true ? i : this.searches[i];
    return null;
  }
  toggleSearch() {
    let e = 0;
    for (let t = 0; t < arguments.length; t++) for (let s = this.searches.length - 1; 0 <= s; s--) this.searches[s].field == arguments[t] && (this.searches[s].hidden = !this.searches[s].hidden, e++);
    return this.searchClose(), e;
  }
  showSearch() {
    let e = 0;
    for (let t = 0; t < arguments.length; t++) for (let s = this.searches.length - 1; 0 <= s; s--) this.searches[s].field == arguments[t] && this.searches[s].hidden !== false && (this.searches[s].hidden = false, e++);
    return this.searchClose(), e;
  }
  hideSearch() {
    let e = 0;
    for (let t = 0; t < arguments.length; t++) for (let s = this.searches.length - 1; 0 <= s; s--) this.searches[s].field == arguments[t] && this.searches[s].hidden !== true && (this.searches[s].hidden = true, e++);
    return this.searchClose(), e;
  }
  getSearchData(e) {
    for (let t = 0; t < this.searchData.length; t++) if (this.searchData[t].field == e) return this.searchData[t];
    return null;
  }
  localSort(e, t) {
    var _a, _b, _c;
    let s = this;
    if (((_a = this.url) == null ? void 0 : _a.get) ?? this.url) console.log("ERROR: grid.localSort can only be used on local data source, grid.url should be empty.");
    else if (Object.keys(this.sortData).length !== 0) {
      let h = function(d) {
        var p;
        return d.w2ui && d.w2ui.parent_recid != null ? d.w2ui._path || ((p = s.get(d.w2ui.parent_recid)) ? h(p).concat(d) : (console.log("ERROR: no parent record: " + d.w2ui.parent_recid), [d])) : [d];
      }, o = function(d, p) {
        if (d === p) return 0;
        for (let b = 0; b < s.sortData.length; b++) {
          var f = s.sortData[b].field, m = s.sortData[b].field_ || f;
          let v = d[m], g = p[m];
          if (String(f).indexOf(".") != -1 && (v = s.parseField(d, m), g = s.parseField(p, m)), m = s.getColumn(f), f = (m && 0 < Object.keys(m.editable).length && (u.isPlainObject(v) && v.text && (v = v.text), u.isPlainObject(g)) && g.text && (g = g.text), c(v, g, b, s.sortData[b].direction, m.sortMode || "default")), f !== 0) return f;
        }
        return c(d.recid, p.recid, 0, "asc");
      }, c = function(d, p, f, m, b) {
        if (d === p) return 0;
        if ((d == null || d === "") && p != null && p !== "") return 1;
        if (d != null && d !== "" && (p == null || p === "")) return -1;
        if (m = m.toLowerCase() === "asc" ? 1 : -1, typeof d != typeof p) return typeof p < typeof d ? m : -m;
        if (d.constructor.name != p.constructor.name) return d.constructor.name > p.constructor.name ? m : -m;
        d && typeof d == "object" && (d = d.valueOf()), p && typeof p == "object" && (p = p.valueOf());
        var v = {}.toString;
        switch (d && typeof d == "object" && d.toString != v && (d = String(d)), p && typeof p == "object" && p.toString != v && (p = String(p)), typeof d == "string" && (d = d.toLowerCase().trim()), typeof p == "string" && (p = p.toLowerCase().trim()), b) {
          case "natural":
            b = u.naturalCompare;
            break;
          case "i18n":
            b = u.i18nCompare;
        }
        return typeof b == "function" ? b(d, p) * m : p < d ? m : d < p ? -m : 0;
      }, l = Date.now();
      this.selectionSave(), this.prepareData(), t || this.reset();
      for (let d = 0; d < this.sortData.length; d++) {
        var i = this.getColumn(this.sortData[d].field);
        if (!i) return;
        typeof i.render == "string" && (["date", "age"].indexOf(i.render.split(":")[0]) != -1 && (this.sortData[d].field_ = i.field + "_"), ["time"].indexOf(i.render.split(":")[0]) != -1) && (this.sortData[d].field_ = i.field + "_");
      }
      for (let d = 0; d < s.records.length; d++) {
        var a = s.records[d];
        ((_b = a.w2ui) == null ? void 0 : _b.parent_recid) != null && (a.w2ui._path = h(a));
      }
      this.records.sort((d, p) => {
        if (!(d.w2ui && d.w2ui.parent_recid != null || p.w2ui && p.w2ui.parent_recid != null)) return o(d, p);
        var f = h(d), m = h(p);
        for (let v = 0; v < Math.min(f.length, m.length); v++) {
          var b = o(f[v], m[v]);
          if (b !== 0) return b;
        }
        return f.length > m.length ? 1 : f.length < m.length ? -1 : (console.log("ERROR: two paths should not be equal."), 0);
      });
      for (let d = 0; d < s.records.length; d++) {
        var r = s.records[d];
        ((_c = r.w2ui) == null ? void 0 : _c.parent_recid) != null && (r.w2ui._path = null);
      }
      return this.selectionRestore(t), l = Date.now() - l, e !== true && this.show.statusSort && setTimeout(() => {
        this.status(u.lang("Sorting took ${count} seconds", { count: l / 1e3 }));
      }, 10), l;
    }
  }
  localSearch(e) {
    var _a;
    let t = this;
    var s = ((_a = this.url) == null ? void 0 : _a.get) ?? this.url;
    if (s) console.log("ERROR: grid.localSearch can only be used on local data source, grid.url should be empty.");
    else {
      let a = Date.now(), r = {}.toString, l = {};
      if (this.total = this.records.length, this.last.searchIds = [], this.prepareData(), 0 < this.searchData.length && !s) {
        for (let h = this.total = 0; h < this.records.length; h++) {
          var i = this.records[h];
          if (function o(c) {
            var _a2, _b;
            let d = 0, p, f, m, b, v = false;
            for (let g = 0; g < t.searchData.length; g++) {
              let y = t.searchData[g], w = t.getSearch(y.field);
              if (y != null) {
                w == null && (w = { field: y.field, type: y.type });
                let C = t.parseField(c, w.field);
                switch (p = C == null || typeof C == "object" && C.toString == r ? "" : String(C).toLowerCase(), y.value != null && (Array.isArray(y.value) ? (f = y.value[0], m = y.value[1]) : f = String(y.value).toLowerCase()), y.operator) {
                  case "=":
                  case "is":
                    t.parseField(c, w.field) == y.value ? d++ : w.type == "date" ? (b = t.parseField(c, w.field + "_") instanceof Date ? t.parseField(c, w.field + "_") : t.parseField(c, w.field), p = u.formatDate(b, "yyyy-mm-dd"), f = u.formatDate(u.isDate(f, u.settings.dateFormat, true), "yyyy-mm-dd"), p == f && d++) : w.type == "time" ? (b = t.parseField(c, w.field + "_") instanceof Date ? t.parseField(c, w.field + "_") : t.parseField(c, w.field), p = u.formatTime(b, "hh24:mi"), f = u.formatTime(f, "hh24:mi"), p == f && d++) : w.type == "datetime" && (b = t.parseField(c, w.field + "_") instanceof Date ? t.parseField(c, w.field + "_") : t.parseField(c, w.field), p = u.formatDateTime(b, "yyyy-mm-dd|hh24:mm:ss"), f = u.formatDateTime(u.isDateTime(f, u.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss"), p == f) && d++;
                    break;
                  case "between":
                    ["int", "float", "money", "currency", "percent"].indexOf(w.type) != -1 ? parseFloat(t.parseField(c, w.field)) >= parseFloat(f) && parseFloat(t.parseField(c, w.field)) <= parseFloat(m) && d++ : w.type == "date" ? (b = t.parseField(c, w.field + "_") instanceof Date ? t.parseField(c, w.field + "_") : t.parseField(c, w.field), p = u.isDate(b, u.settings.dateFormat, true), f = u.isDate(f, u.settings.dateFormat, true), (m = u.isDate(m, u.settings.dateFormat, true)) != null && (m = new Date(m.getTime() + 864e5)), p >= f && p < m && d++) : w.type == "time" ? (p = t.parseField(c, w.field + "_") instanceof Date ? t.parseField(c, w.field + "_") : t.parseField(c, w.field), f = u.isTime(f, true), m = u.isTime(m, true), f = (/* @__PURE__ */ new Date()).setHours(f.hours, f.minutes, f.seconds || 0, 0), m = (/* @__PURE__ */ new Date()).setHours(m.hours, m.minutes, m.seconds || 0, 0), p >= f && p < m && d++) : w.type == "datetime" && (p = t.parseField(c, w.field + "_") instanceof Date ? t.parseField(c, w.field + "_") : t.parseField(c, w.field), f = u.isDateTime(f, u.settings.datetimeFormat, true), m = (m = u.isDateTime(m, u.settings.datetimeFormat, true)) && new Date(m.getTime() + 864e5), p >= f) && p < m && d++;
                    break;
                  case "<=":
                    v = true;
                  case "<":
                  case "less":
                    ["int", "float", "money", "currency", "percent"].indexOf(w.type) != -1 ? (p = parseFloat(t.parseField(c, w.field)), f = parseFloat(y.value), (p < f || v && p === f) && d++) : w.type == "date" ? (b = t.parseField(c, w.field + "_") instanceof Date ? t.parseField(c, w.field + "_") : t.parseField(c, w.field), p = u.isDate(b, u.settings.dateFormat, true), f = u.isDate(f, u.settings.dateFormat, true), (p < f || v && p === f) && d++) : w.type == "time" ? (b = t.parseField(c, w.field + "_") instanceof Date ? t.parseField(c, w.field + "_") : t.parseField(c, w.field), p = u.formatTime(b, "hh24:mi"), f = u.formatTime(f, "hh24:mi"), (p < f || v && p === f) && d++) : w.type == "datetime" && (b = t.parseField(c, w.field + "_") instanceof Date ? t.parseField(c, w.field + "_") : t.parseField(c, w.field), p = u.formatDateTime(b, "yyyy-mm-dd|hh24:mm:ss"), f = u.formatDateTime(u.isDateTime(f, u.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss"), p.length == f.length) && (p < f || v && p === f) && d++;
                    break;
                  case ">=":
                    v = true;
                  case ">":
                  case "more":
                    ["int", "float", "money", "currency", "percent"].indexOf(w.type) != -1 ? (p = parseFloat(t.parseField(c, w.field)), f = parseFloat(y.value), (p > f || v && p === f) && d++) : w.type == "date" ? (b = t.parseField(c, w.field + "_") instanceof Date ? t.parseField(c, w.field + "_") : t.parseField(c, w.field), p = u.isDate(b, u.settings.dateFormat, true), f = u.isDate(f, u.settings.dateFormat, true), (p > f || v && p === f) && d++) : w.type == "time" ? (b = t.parseField(c, w.field + "_") instanceof Date ? t.parseField(c, w.field + "_") : t.parseField(c, w.field), p = u.formatTime(b, "hh24:mi"), f = u.formatTime(f, "hh24:mi"), (p > f || v && p === f) && d++) : w.type == "datetime" && (b = t.parseField(c, w.field + "_") instanceof Date ? t.parseField(c, w.field + "_") : t.parseField(c, w.field), p = u.formatDateTime(b, "yyyy-mm-dd|hh24:mm:ss"), f = u.formatDateTime(u.isDateTime(f, u.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss"), p.length == f.length) && (p > f || v && p === f) && d++;
                    break;
                  case "in":
                    b = y.value, (b = y.svalue ? y.svalue : b).indexOf(u.isFloat(C) ? parseFloat(C) : C) === -1 && b.indexOf(p) === -1 || d++;
                    break;
                  case "not in":
                    b = y.value, (b = y.svalue ? y.svalue : b).indexOf(u.isFloat(C) ? parseFloat(C) : C) === -1 && b.indexOf(p) === -1 && d++;
                    break;
                  case "begins":
                  case "begins with":
                    p.indexOf(f) === 0 && d++;
                    break;
                  case "contains":
                    0 <= p.indexOf(f) && d++;
                    break;
                  case "null":
                    t.parseField(c, w.field) == null && d++;
                    break;
                  case "not null":
                    t.parseField(c, w.field) != null && d++;
                    break;
                  case "ends":
                  case "ends with":
                    let $ = p.lastIndexOf(f);
                    $ !== -1 && $ == p.length - f.length && d++;
                }
              }
            }
            if (t.last.logic == "OR" && d !== 0 || t.last.logic == "AND" && d == t.searchData.length) return true;
            if (((_a2 = c.w2ui) == null ? void 0 : _a2.children) && ((_b = c.w2ui) == null ? void 0 : _b.expanded) !== true) for (let g = 0; g < c.w2ui.children.length; g++) {
              let y = c.w2ui.children[g];
              if (o(y)) return true;
            }
            return false;
          }(i)) if ((i == null ? void 0 : i.w2ui) && function o(c) {
            let d = t.get(c, true);
            if (d == null || c == null || l[c] || t.last.searchIds.includes(d)) return;
            l[c] = true;
            let p = t.records[d];
            (p == null ? void 0 : p.w2ui) && o(p.w2ui.parent_recid), t.last.searchIds.push(d);
          }(i.w2ui.parent_recid), 0 < this.showExtraOnSearch) {
            let o = this.showExtraOnSearch, c = this.showExtraOnSearch;
            if (h < o && (o = h), h + c > this.records.length && (c = this.records.length - h), 0 < o) for (let d = h - o; d < h; d++) this.last.searchIds.indexOf(d) < 0 && this.last.searchIds.push(d);
            if (this.last.searchIds.indexOf(h) < 0 && this.last.searchIds.push(h), 0 < c) for (let d = h + 1; d <= h + c; d++) this.last.searchIds.indexOf(d) < 0 && this.last.searchIds.push(d);
          } else this.last.searchIds.push(h);
        }
        this.total = this.last.searchIds.length;
      }
      return a = Date.now() - a, e !== true && this.show.statusSearch && setTimeout(() => {
        this.status(u.lang("Search took ${count} seconds", { count: a / 1e3 }));
      }, 10), a;
    }
  }
  getRangeData(e, t) {
    var s = this.get(e[0].recid, true), i = this.get(e[1].recid, true), a = e[0].column, r = e[1].column, l = [];
    if (a == r) for (let m = s; m <= i; m++) {
      var h = this.records[m], o = h[this.columns[a].field] || null;
      l.push(t !== true ? o : { data: o, column: a, index: m, record: h });
    }
    else if (s == i) {
      var c = this.records[s];
      for (let m = a; m <= r; m++) {
        var d = c[this.columns[m].field] || null;
        l.push(t !== true ? d : { data: d, column: m, index: s, record: c });
      }
    } else for (let m = s; m <= i; m++) {
      var p = this.records[m];
      l.push([]);
      for (let b = a; b <= r; b++) {
        var f = p[this.columns[b].field];
        t !== true ? l[l.length - 1].push(f) : l[l.length - 1].push({ data: f, column: b, index: m, record: p });
      }
    }
    return l;
  }
  addRange(e) {
    let t = 0, s, i;
    if (this.selectType != "row") {
      Array.isArray(e) || (e = [e]);
      for (let r = 0; r < e.length; r++) {
        if (typeof e[r] != "object" && (e[r] = { name: "selection" }), e[r].name == "selection") {
          if (this.show.selectionBorder === false) continue;
          var a = this.getSelection();
          if (a.length === 0) {
            this.removeRange("selection");
            continue;
          }
          s = a[0], i = a[a.length - 1];
        } else s = e[r].range[0], i = e[r].range[1];
        if (s) {
          a = { name: e[r].name, range: [{ recid: s.recid, column: s.column }, { recid: i.recid, column: i.column }], style: e[r].style || "" };
          let l = false;
          for (let h = 0; h < this.ranges.length; h++) if (this.ranges[h].name == e[r].name) {
            l = h;
            break;
          }
          l !== false ? this.ranges[l] = a : this.ranges.push(a), t++;
        }
      }
      this.refreshRanges();
    }
    return t;
  }
  removeRange() {
    let e = 0;
    for (let s = 0; s < arguments.length; s++) {
      var t = arguments[s];
      n(this.box).find("#grid_" + this.name + "_" + t).remove(), n(this.box).find("#grid_" + this.name + "_f" + t).remove();
      for (let i = this.ranges.length - 1; 0 <= i; i--) this.ranges[i].name == t && (this.ranges.splice(i, 1), e++);
    }
    return e;
  }
  refreshRanges() {
    if (this.ranges.length !== 0) {
      let b = function(g) {
        var y = p.last.move;
        if (y && y.type == "expand") {
          y.divX = g.screenX - y.x, y.divY = g.screenY - y.y;
          let w, C, $ = g.target;
          $.tagName.toUpperCase() != "TD" && ($ = n($).closest("td")[0]), (C = n($).attr("col") != null ? parseInt(n($).attr("col")) : C) != null && ($ = n($).closest("tr")[0], w = p.records[n($).attr("index")].recid, y.newRange[1].recid != w || y.newRange[1].column != C) && (g = u.clone(y.newRange), y.newRange = [{ recid: y.recid, column: y.column }, { recid: w, column: C }], m.detail && (m.detail.newRange = u.clone(y.newRange), m.detail.originalRange = u.clone(y.originalRange)), (m = p.trigger("selectionExtend", m)).isCancelled === true ? (y.newRange = g, m.detail.newRange = g) : (p.removeRange("grid-selection-expand"), p.addRange({ name: "grid-selection-expand", range: y.newRange, style: "background-color: rgba(100,100,100,0.1); border: 2px dotted rgba(100,100,100,0.5);" })));
        }
      }, v = function(g) {
        p.removeRange("grid-selection-expand"), delete p.last.move, n("body").off(".w2ui-" + p.name), m.finish && m.finish();
      }, p = this, f;
      var e = Date.now(), t = n(this.box).find(`#grid_${this.name}_frecords`), s = n(this.box).find(`#grid_${this.name}_records`);
      for (let g = 0; g < this.ranges.length; g++) {
        var i = this.ranges[g], a = i.range[0], r = i.range[1];
        a.index == null && (a.index = this.get(a.recid, true)), r.index == null && (r.index = this.get(r.recid, true));
        let y = n(this.box).find("#grid_" + this.name + "_rec_" + u.escapeId(a.recid) + ' td[col="' + a.column + '"]'), w = n(this.box).find("#grid_" + this.name + "_rec_" + u.escapeId(r.recid) + ' td[col="' + r.column + '"]'), C = n(this.box).find("#grid_" + this.name + "_frec_" + u.escapeId(a.recid) + ' td[col="' + a.column + '"]'), $ = n(this.box).find("#grid_" + this.name + "_frec_" + u.escapeId(r.recid) + ' td[col="' + r.column + '"]'), I = r.column;
        a.column < this.last.colStart && r.column > this.last.colStart && (y = n(this.box).find("#grid_" + this.name + "_rec_" + u.escapeId(a.recid) + ' td[col="start"]')), a.column < this.last.colEnd && r.column > this.last.colEnd && (w = n(this.box).find("#grid_" + this.name + "_rec_" + u.escapeId(r.recid) + ' td[col="end"]'), I = '"end"');
        var o = parseInt(n(this.box).find("#grid_" + this.name + "_rec_top").next().attr("index")), c = parseInt(n(this.box).find("#grid_" + this.name + "_rec_bottom").prev().attr("index")), d = parseInt(n(this.box).find("#grid_" + this.name + "_frec_top").next().attr("index")), l = parseInt(n(this.box).find("#grid_" + this.name + "_frec_bottom").prev().attr("index"));
        y.length === 0 && a.index < o && r.index > o && (y = n(this.box).find("#grid_" + this.name + "_rec_top").next().find('td[col="' + a.column + '"]')), w.length === 0 && r.index > c && a.index < c && (w = n(this.box).find("#grid_" + this.name + "_rec_bottom").prev().find('td[col="' + I + '"]')), C.length === 0 && a.index < d && r.index > d && (C = n(this.box).find("#grid_" + this.name + "_frec_top").next().find('td[col="' + a.column + '"]')), $.length === 0 && r.index > l && a.index < l && ($ = n(this.box).find("#grid_" + this.name + "_frec_bottom").prev().find('td[col="' + r.column + '"]'));
        var h, o = n(this.box).find("#grid_" + this.name + "_editable").find(".w2ui-input"), c = o.attr("recid"), d = o.attr("column");
        i.name == "selection" && i.range[0].recid == c && i.range[0].column == d || (f = n(this.box).find("#grid_" + this.name + "_f" + i.name), (0 < C.length || 0 < $.length) && (f.length === 0 ? (t.append('<div id="grid_' + this.name + "_f" + i.name + '" class="w2ui-selection" style="' + i.style + '">' + (i.name == "selection" ? '<div id="grid_' + this.name + '_resizer" class="w2ui-selection-resizer"></div>' : "") + "</div>"), f = n(this.box).find("#grid_" + this.name + "_f" + i.name)) : (f.attr("style", i.style), f.find(".w2ui-selection-resizer").show()), $.length === 0 && (($ = n(this.box).find("#grid_" + this.name + "_frec_" + u.escapeId(r.recid) + " td:last-child")).length === 0 && ($ = n(this.box).find("#grid_" + this.name + "_frec_bottom td:first-child")), f.css("border-right", "0px"), f.find(".w2ui-selection-resizer").hide()), a.recid != null) && r.recid != null && 0 < C.length && 0 < $.length ? (l = getComputedStyle($[0]), o = C.prop("offsetTop") - C.prop("scrollTop"), c = C.prop("offsetLeft") + C.prop("scrollLeft"), d = $.prop("offsetTop") - $.prop("scrollTop"), h = $.prop("offsetLeft") + $.prop("scrollLeft"), f.show().css({ top: (0 < o ? o : 0) + "px", left: (0 < c ? c : 0) + "px", width: h - c + parseFloat(l.width) + 2 + "px", height: d - o + parseFloat(l.height) + 1 + "px" })) : f.hide(), f = n(this.box).find("#grid_" + this.name + "_" + i.name), (0 < y.length || 0 < w.length) && (f.length === 0 ? (s.append('<div id="grid_' + this.name + "_" + i.name + '" class="w2ui-selection" style="' + i.style + '">' + (i.name == "selection" ? '<div id="grid_' + this.name + '_resizer" class="w2ui-selection-resizer"></div>' : "") + "</div>"), f = n(this.box).find("#grid_" + this.name + "_" + i.name)) : f.attr("style", i.style), y.length === 0 && (y = n(this.box).find("#grid_" + this.name + "_rec_" + u.escapeId(a.recid) + " td:first-child")).length === 0 && (y = n(this.box).find("#grid_" + this.name + "_rec_top td:first-child")), $.length !== 0 && f.css("border-left", "0px"), a.recid != null) && r.recid != null && 0 < y.length && 0 < w.length ? (h = getComputedStyle(w[0]), c = y.prop("offsetTop") - y.prop("scrollTop"), d = y.prop("offsetLeft") + y.prop("scrollLeft"), o = w.prop("offsetTop") - w.prop("scrollTop"), l = w.prop("offsetLeft") + w.prop("scrollLeft"), f.show().css({ top: (0 < c ? c : 0) + "px", left: (0 < d ? d : 0) + "px", width: l - d + parseFloat(h.width) + 2 + "px", height: o - c + parseFloat(h.height) + 1 + "px" })) : f.hide());
      }
      n(this.box).find(".w2ui-selection-resizer").off(".resizer").on("mousedown.resizer", function(g) {
        var y = p.getSelection();
        p.last.move = { type: "expand", x: g.screenX, y: g.screenY, divX: 0, divY: 0, recid: y[0].recid, column: y[0].column, originalRange: [u.clone(y[0]), u.clone(y[y.length - 1])], newRange: [u.clone(y[0]), u.clone(y[y.length - 1])] }, n("body").off(".w2ui-" + p.name).on("mousemove.w2ui-" + p.name, b).on("mouseup.w2ui-" + p.name, v), g.preventDefault();
      }).on("dblclick.resizer", (g) => {
        g = this.trigger("resizerDblClick", { target: this.name, originalEvent: g }), g.isCancelled !== true && g.finish();
      });
      let m = { target: this.name, originalRange: null, newRange: null };
      return Date.now() - e;
    }
  }
  select() {
    if (arguments.length === 0) return 0;
    let e = 0;
    var t = this.last.selection;
    this.multiSelect || this.selectNone(true);
    let s = Array.from(arguments);
    Array.isArray(s[0]) && (s = s[0]);
    var i = { target: this.name }, i = (s.length == 1 ? (i.multiple = false, u.isPlainObject(s[0]) ? i.clicked = { recid: s[0].recid, column: s[0].column } : i.recid = s[0]) : (i.multiple = true, i.clicked = { recids: s }), this.trigger("select", i));
    if (i.isCancelled === true) return 0;
    if (this.selectType == "row") for (let g = 0; g < s.length; g++) {
      var a = typeof s[g] == "object" ? s[g].recid : s[g], r = this.get(a, true);
      if (r != null) {
        let y = null, w = null;
        (this.searchData.length !== 0 || r + 1 >= this.last.range_start && r + 1 <= this.last.range_end) && (y = n(this.box).find("#grid_" + this.name + "_frec_" + u.escapeId(a)), w = n(this.box).find("#grid_" + this.name + "_rec_" + u.escapeId(a))), this.selectType == "row" && t.indexes.indexOf(r) == -1 && (t.indexes.push(r), y && w && (y.addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected"), w.addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected"), y.find(".w2ui-grid-select-check").prop("checked", true)), e++);
      }
    }
    else {
      var l = {};
      for (let g = 0; g < s.length; g++) {
        var h = typeof s[g] == "object" ? s[g].recid : s[g], o = typeof s[g] == "object" ? s[g].column : null;
        if (l[h] = l[h] || [], Array.isArray(o)) l[h] = o;
        else if (u.isInt(o)) l[h].push(o);
        else for (let y = 0; y < this.columns.length; y++) this.columns[y].hidden || l[h].push(parseInt(y));
      }
      var c, d = [];
      for (c in l) {
        var p = this.get(c, true);
        if (p != null) {
          let g = null, y = null;
          p + 1 >= this.last.range_start && p + 1 <= this.last.range_end && (g = n(this.box).find("#grid_" + this.name + "_rec_" + u.escapeId(c)), y = n(this.box).find("#grid_" + this.name + "_frec_" + u.escapeId(c)));
          var f = t.columns[p] || [];
          t.indexes.indexOf(p) == -1 && t.indexes.push(p);
          for (let w = 0; w < l[c].length; w++) f.indexOf(l[c][w]) == -1 && f.push(l[c][w]);
          f.sort((w, C) => w - C);
          for (let w = 0; w < l[c].length; w++) {
            var m = l[c][w];
            d.indexOf(m) == -1 && d.push(m), g && (g.find("#grid_" + this.name + "_data_" + p + "_" + m).addClass("w2ui-selected"), g.find(".w2ui-col-number").addClass("w2ui-row-selected"), g.find(".w2ui-grid-select-check").prop("checked", true)), y && (y.find("#grid_" + this.name + "_data_" + p + "_" + m).addClass("w2ui-selected"), y.find(".w2ui-col-number").addClass("w2ui-row-selected"), y.find(".w2ui-grid-select-check").prop("checked", true)), e++;
          }
          t.columns[p] = f;
        }
      }
      for (let g = 0; g < d.length; g++) n(this.box).find("#grid_" + this.name + "_column_" + d[g] + " .w2ui-col-header").addClass("w2ui-col-selected");
    }
    t.indexes.sort((g, y) => g - y);
    var b = 0 < this.records.length && t.indexes.length == this.records.length, v = 0 < t.indexes.length && this.searchData.length !== 0 && t.indexes.length == this.last.searchIds.length;
    return b || v ? n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true) : n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.addRange("selection"), this.updateToolbar(t, b), i.finish(), e;
  }
  unselect() {
    let e = 0;
    var t = this.last.selection;
    let s = Array.from(arguments);
    Array.isArray(s[0]) && (s = s[0]);
    var i = { target: this.name }, i = (s.length == 1 ? (i.multiple = false, u.isPlainObject(s[0]) ? i.clicked = { recid: s[0].recid, column: s[0].column } : i.clicked = { recid: s[0] }) : (i.multiple = true, i.recids = s), this.trigger("select", i));
    if (i.isCancelled === true) return 0;
    for (let m = 0; m < s.length; m++) {
      var a = typeof s[m] == "object" ? s[m].recid : s[m], r = this.get(a);
      if (r != null) {
        var r = this.get(r.recid, true), l = n(this.box).find("#grid_" + this.name + "_frec_" + u.escapeId(a)), h = n(this.box).find("#grid_" + this.name + "_rec_" + u.escapeId(a));
        if (this.selectType == "row") t.indexes.indexOf(r) != -1 && (t.indexes.splice(t.indexes.indexOf(r), 1), l.removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected"), h.removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected"), l.length != 0 && (l[0].style.cssText = "height: " + this.recordHeight + "px; " + l.attr("custom_style"), h[0].style.cssText = "height: " + this.recordHeight + "px; " + h.attr("custom_style")), l.find(".w2ui-grid-select-check").prop("checked", false), e++);
        else {
          var o = s[m].column;
          if (!u.isInt(o)) {
            var c = [];
            for (let v = 0; v < this.columns.length; v++) this.columns[v].hidden || c.push({ recid: a, column: v });
            return this.unselect(c);
          }
          if (h = t.columns[r], Array.isArray(h) && h.indexOf(o) != -1) {
            h.splice(h.indexOf(o), 1), n(this.box).find(`#grid_${this.name}_rec_${u.escapeId(a)} > td[col="${o}"]`).removeClass("w2ui-selected w2ui-inactive"), n(this.box).find(`#grid_${this.name}_frec_${u.escapeId(a)} > td[col="${o}"]`).removeClass("w2ui-selected w2ui-inactive");
            let v = false, g = false;
            var d = this.getSelection();
            for (let y = 0; y < d.length; y++) d[y].column == o && (v = true), d[y].recid == a && (g = true);
            v || n(this.box).find(`.w2ui-grid-columns td[col="${o}"] .w2ui-col-header, .w2ui-grid-fcolumns td[col="${o}"] .w2ui-col-header`).removeClass("w2ui-col-selected"), g || n(this.box).find("#grid_" + this.name + "_frec_" + u.escapeId(a)).find(".w2ui-col-number").removeClass("w2ui-row-selected"), e++, h.length === 0 && (delete t.columns[r], t.indexes.splice(t.indexes.indexOf(r), 1), l.find(".w2ui-grid-select-check").prop("checked", false));
          }
        }
      }
    }
    var p = 0 < this.records.length && t.indexes.length == this.records.length, f = 0 < t.indexes.length && this.searchData.length !== 0 && t.indexes.length == this.last.searchIds.length;
    return p || f ? n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true) : n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.addRange("selection"), this.updateToolbar(t, p), i.finish(), e;
  }
  selectAll() {
    var _a;
    var e = Date.now();
    if (this.multiSelect !== false) {
      var t = ((_a = this.url) == null ? void 0 : _a.get) ?? this.url;
      let i = u.clone(this.last.selection);
      var s = [];
      for (let a = 0; a < this.columns.length; a++) s.push(a);
      if (i.indexes = [], t || this.searchData.length === 0) {
        let a = this.records.length;
        this.searchData.length == 0 || t || (a = this.last.searchIds.length);
        for (let r = 0; r < a; r++) i.indexes.push(r), this.selectType != "row" && (i.columns[r] = s.slice());
      } else for (let a = 0; a < this.last.searchIds.length; a++) i.indexes.push(this.last.searchIds[a]), this.selectType != "row" && (i.columns[this.last.searchIds[a]] = s.slice());
      if (t = this.trigger("select", { target: this.name, multiple: true, all: true, clicked: i }), t.isCancelled !== true) return this.last.selection = i, this.selectType == "row" ? (n(this.box).find(".w2ui-grid-records tr:not(.w2ui-empty-record)").addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected"), n(this.box).find(".w2ui-grid-frecords tr:not(.w2ui-empty-record)").addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected")) : (n(this.box).find(".w2ui-grid-columns td .w2ui-col-header, .w2ui-grid-fcolumns td .w2ui-col-header").addClass("w2ui-col-selected"), n(this.box).find(".w2ui-grid-records tr .w2ui-col-number").addClass("w2ui-row-selected"), n(this.box).find(".w2ui-grid-records tr:not(.w2ui-empty-record)").find(".w2ui-grid-data:not(.w2ui-col-select)").addClass("w2ui-selected"), n(this.box).find(".w2ui-grid-frecords tr .w2ui-col-number").addClass("w2ui-row-selected"), n(this.box).find(".w2ui-grid-frecords tr:not(.w2ui-empty-record)").find(".w2ui-grid-data:not(.w2ui-col-select)").addClass("w2ui-selected")), n(this.box).find("input.w2ui-grid-select-check").prop("checked", true), i = this.getSelection(true), this.addRange("selection"), n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true), this.status(), this.updateToolbar({ indexes: i }, true), t.finish(), Date.now() - e;
    }
  }
  selectNone(e) {
    var t, s = Date.now();
    let i;
    if (e || (i = this.trigger("select", { target: this.name, clicked: [] })).isCancelled !== true) return t = this.last.selection, this.selectType == "row" ? (n(this.box).find(".w2ui-grid-records tr.w2ui-selected").removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected"), n(this.box).find(".w2ui-grid-frecords tr.w2ui-selected").removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected")) : (n(this.box).find(".w2ui-grid-columns td .w2ui-col-header, .w2ui-grid-fcolumns td .w2ui-col-header").removeClass("w2ui-col-selected"), n(this.box).find(".w2ui-grid-records tr .w2ui-col-number").removeClass("w2ui-row-selected"), n(this.box).find(".w2ui-grid-frecords tr .w2ui-col-number").removeClass("w2ui-row-selected"), n(this.box).find(".w2ui-grid-data.w2ui-selected").removeClass("w2ui-selected w2ui-inactive")), n(this.box).find("input.w2ui-grid-select-check").prop("checked", false), t.indexes = [], t.columns = {}, this.removeRange("selection"), n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.updateToolbar(t, false), e || i.finish(), Date.now() - s;
  }
  updateToolbar(e) {
    let t = this, s = e && e.indexes ? e.indexes.length : 0;
    function i(a, r) {
      if (a.batch != null) {
        let l = false;
        a.batch === true ? 0 < s && (l = true) : typeof a.batch == "number" ? s === a.batch && (l = true) : typeof a.batch == "function" && (l = a.batch({ cnt: s, sel: e })), l ? t.toolbar.enable(r + a.id) : t.toolbar.disable(r + a.id);
      }
    }
    this.toolbar.items.forEach((a) => {
      i(a, ""), Array.isArray(a.items) && a.items.forEach((r) => {
        i(r, a.id + ":");
      });
    }), this.show.toolbarSave && (0 < this.getChanges().length ? this.toolbar.enable("w2ui-save") : this.toolbar.disable("w2ui-save"));
  }
  getSelection(e) {
    var t = [], s = this.last.selection;
    if (this.selectType == "row") for (let a = 0; a < s.indexes.length; a++) this.records[s.indexes[a]] && t.push(e === true ? s.indexes[a] : this.records[s.indexes[a]].recid);
    else for (let a = 0; a < s.indexes.length; a++) {
      var i = s.columns[s.indexes[a]];
      if (this.records[s.indexes[a]]) for (let r = 0; r < i.length; r++) t.push({ recid: this.records[s.indexes[a]].recid, index: parseInt(s.indexes[a]), column: i[r] });
    }
    return t;
  }
  search(e, t) {
    var _a;
    var s = ((_a = this.url) == null ? void 0 : _a.get) ?? this.url, i = [];
    let a = this.last.multi, r = this.last.logic, l = this.last.field, h = this.last.search, o = false;
    var c = n(`#w2overlay-${this.name}-search-overlay`);
    for (let k = 0; k < this.searches.length; k++) this.searches[k].hidden && this.searches[k].value != null && (i.push({ field: this.searches[k].field, operator: this.searches[k].operator || "is", type: this.searches[k].type, value: this.searches[k].value || "" }), o = true);
    if (arguments.length === 0 && c.length === 0 && (t = this.multiSearch ? (e = this.searchData, this.last.logic) : (e = this.last.field, this.last.search)), arguments.length === 0 && c.length !== 0) {
      this.focus(), r = c.find(`#grid_${this.name}_logic`).val(), h = "";
      for (let k = 0; k < this.searches.length; k++) {
        var d = this.searches[k], p = c.find("#grid_" + this.name + "_operator_" + k).val(), f = c.find("#grid_" + this.name + "_field_" + k), m = c.find("#grid_" + this.name + "_field2_" + k);
        let _ = f.val(), S = m.val(), D = null, N = null;
        if (["int", "float", "money", "currency", "percent"].indexOf(d.type) != -1 && (b = f[0]._w2field, m = m[0]._w2field, b && (_ = b.clean(_)), m) && (S = m.clean(S)), ["list", "enum"].indexOf(d.type) != -1 || ["in", "not in"].indexOf(p) != -1) if (_ = f[0]._w2field.selected || {}, Array.isArray(_)) {
          D = [];
          for (let H = 0; H < _.length; H++) D.push(u.isFloat(_[H].id) ? parseFloat(_[H].id) : String(_[H].id).toLowerCase()), delete _[H].hidden;
          Object.keys(_).length === 0 && (_ = "");
        } else N = _.text || "", _ = _.id || "";
        if (_ !== "" && _ != null || S != null && S !== "") {
          var b = { field: d.field, type: d.type, operator: p };
          p == "between" ? u.extend(b, { value: [_, S] }) : p == "in" && typeof _ == "string" || p == "not in" && typeof _ == "string" ? u.extend(b, { value: _.split(",") }) : u.extend(b, { value: _ }), D && u.extend(b, { svalue: D }), N && u.extend(b, { text: N });
          try {
            d.type == "date" && p == "between" && (b.value[0] = _, b.value[1] = S), d.type == "date" && p == "is" && (b.value = _);
          } catch {
          }
          i.push(b), a = true;
        }
      }
    }
    if (typeof e == "string" && (arguments.length == 1 && (t = e, e = "all"), l = e, h = t, a = false, r = o ? "AND" : "OR", t != null)) if (e.toLowerCase() == "all") if (0 < this.searches.length) for (let k = 0; k < this.searches.length; k++) {
      var v, g = this.searches[k];
      if ((g.type == "text" || g.type == "alphanumeric" && u.isAlphaNumeric(t) || g.type == "int" && u.isInt(t) || g.type == "float" && u.isFloat(t) || g.type == "percent" && u.isFloat(t) || (g.type == "hex" || g.type == "color") && u.isHex(t) || g.type == "currency" && u.isMoney(t) || g.type == "money" && u.isMoney(t) || g.type == "date" && u.isDate(t) || g.type == "time" && u.isTime(t) || g.type == "datetime" && u.isDateTime(t) || g.type == "datetime" && u.isDate(t) || g.type == "enum" && u.isAlphaNumeric(t) || g.type == "list" && u.isAlphaNumeric(t)) && (v = this.defaultOperator[this.operatorsMap[g.type]], v = { field: g.field, type: g.type, operator: g.operator != null ? g.operator : v, value: t }, String(t).trim() != "") && i.push(v), ["int", "float", "money", "currency", "percent"].indexOf(g.type) != -1 && String(t).trim().split("-").length == 2 && (v = String(t).trim().split("-"), y = { field: g.field, type: g.type, operator: g.operator != null ? g.operator : "between", value: [v[0], v[1]] }, i.push(y)), ["list", "enum"].indexOf(g.type) != -1) {
        var y, w = [];
        g.options == null && (g.options = {}), Array.isArray(g.options.items) || (g.options.items = []);
        for (let _ = 0; _ < g.options.items; _++) {
          var C = g.options.items[_];
          try {
            var $ = new RegExp(t, "i");
            $.test(C) && w.push(_), C.text && $.test(C.text) && w.push(C.id);
          } catch {
          }
        }
        0 < w.length && (y = { field: g.field, type: g.type, operator: g.operator != null ? g.operator : "in", value: w }, i.push(y));
      }
    }
    else for (let k = 0; k < this.columns.length; k++) {
      var I = { field: this.columns[k].field, type: "text", operator: this.defaultOperator.text, value: t };
      i.push(I);
    }
    else {
      var E = c.find("#grid_" + this.name + "_search_all");
      let k = this.getSearch(e);
      if ((k = k ?? { field: e, type: "text" }).field == e && (this.last.label = k.label), t !== "") {
        let _ = this.defaultOperator[this.operatorsMap[k.type]], S = t;
        if (["date", "time", "datetime"].indexOf(k.type) != -1 && (_ = "is"), ["list", "enum"].indexOf(k.type) != -1 && (_ = "is", E = E._w2field.get(), S = E && 0 < Object.keys(E).length ? E.id : ""), k.type == "int" && t !== "" && (_ = "is", String(t).indexOf("-") != -1 && (E = t.split("-")).length == 2 && (_ = "between", S = [parseInt(E[0]), parseInt(E[1])]), String(t).indexOf(",") != -1)) {
          var T = t.split(",");
          _ = "in", S = [];
          for (let D = 0; D < T.length; D++) S.push(T[D]);
        }
        k.operator != null && (_ = k.operator), E = { field: k.field, type: k.type, operator: _, value: S }, i.push(E);
      }
    }
    if (Array.isArray(e)) {
      let k = "AND";
      typeof t == "string" && (k = t.toUpperCase()) != "OR" && k != "AND" && (k = "AND"), h = "", a = true, r = k;
      for (let _ = 0; _ < e.length; _++) {
        var R = e[_];
        typeof R.value == "number" && R.operator == null && (R.operator = this.defaultOperator.number), typeof R.value == "string" && R.operator == null && (R.operator = this.defaultOperator.text), Array.isArray(R.value) && R.operator == null && (R.operator = this.defaultOperator.enum), u.isDate(R.value) && R.operator == null && (R.operator = this.defaultOperator.date), i.push(R);
      }
    }
    E = this.trigger("search", { target: this.name, multi: arguments.length === 0, searchField: e || "multi", searchValue: e ? t : "multi", searchData: i, searchLogic: r }), E.isCancelled !== true && (this.searchData = E.detail.searchData, this.last.field = l, this.last.search = h, this.last.multi = a, this.last.logic = E.detail.searchLogic, this.last.scrollTop = 0, this.last.scrollLeft = 0, this.last.selection.indexes = [], this.last.selection.columns = {}, this.searchClose(), s ? (this.last.fetch.offset = 0, this.reload()) : (this.localSearch(), this.refresh()), E.finish());
  }
  searchOpen() {
    if (this.box && this.searches.length !== 0) {
      let e = this.trigger("searchOpen", { target: this.name });
      if (e.isCancelled !== true) {
        let t = n(this.toolbar.box).find(".w2ui-grid-search-input .w2ui-search-drop");
        t.addClass("checked"), F.show({ name: this.name + "-search-overlay", anchor: n(this.box).find("#grid_" + this.name + "_search_all").get(0), position: "bottom|top", html: this.getSearchesHTML(), align: "left", arrowSize: 12, class: "w2ui-grid-search-advanced", hideOn: ["doc-click"] }).then((s) => {
          this.initSearches(), this.last.search_opened = true;
          let i = n(`#w2overlay-${this.name}-search-overlay`);
          i.data("gridName", this.name).off(".grid-search").on("click.grid-search", () => {
            i.find("input, select").each((r) => {
              r = n(r).data("tooltipName"), r && r.forEach((l) => {
                F.hide(l);
              });
            });
          }), u.bindEvents(i.find("select, input, button"), this);
          var a = n(`#w2overlay-${this.name}-search-overlay *[rel=search]`);
          0 < a.length && a[0].focus(), e.finish();
        }).hide((s) => {
          t.removeClass("checked"), this.last.search_opened = false;
        });
      }
    }
  }
  searchClose() {
    F.hide(this.name + "-search-overlay");
  }
  searchFieldTooltip(i, t, s) {
    var i = this.searches[i], a = this.searchData[t];
    let r = a.operator, l = ((r = r == "more" && a.type == "date" ? "since" : r) == "less" && a.type == "date" && (r = "before"), ""), h = a.value;
    Array.isArray(a.value) ? (a.value.forEach((o) => {
      l += `<span class="value">${o.text || o}</span>`;
    }), a.type == "date" && (l = "", a.value.forEach((o) => {
      l += `<span class="value">${u.formatDate(o)}</span>`;
    }))) : a.type == "date" && (h = u.formatDateTime(h)), F.hide(this.name + "-search-props"), F.show({ name: this.name + "-search-props", anchor: s, class: "w2ui-white", hideOn: "doc-click", html: `
                <div class="w2ui-grid-search-single">
                    <span class="field">${i.label}</span>
                    <span class="operator">${u.lang(r)}</span>
                    ${Array.isArray(a.value) ? "" + l : `<span class="value">${h}</span>`}
                    <div class="buttons">
                        <button id="remove" class="w2ui-btn">${u.lang("Remove This Field")}</button>
                    </div>
                </div>` }).then((o) => {
      n(o.detail.overlay.box).find("#remove").on("click", () => {
        this.searchData.splice("" + t, 1), this.reload(), this.localSearch(), F.hide(this.name + "-search-props");
      });
    });
  }
  searchSuggest(e, t, s) {
    var _a, _b;
    clearTimeout(this.last.kbd_timer), clearTimeout(this.last.overlay_timer), this.searchShowFields(true), this.searchClose(), t === true ? F.hide(this.name + "-search-suggest") : 0 < n(`#w2overlay-${this.name}-search-suggest`).length || (e ? (t = n(this.box).find(`#grid_${this.name}_search_all`).get(0), e = [...this.defaultSearches ?? [], ...0 < ((_a = this.defaultSearches) == null ? void 0 : _a.length) && 0 < ((_b = this.savedSearches) == null ? void 0 : _b.length) ? ["--"] : [], ...this.savedSearches ?? []], Array.isArray(e) && 0 < e.length && W.show({ name: this.name + "-search-suggest", anchor: t, align: "both", items: e, hideOn: ["doc-click", "sleect", "remove"], render(i) {
      let a = i.text;
      return a = i.isDefault ? `<b>${a}</b>` : a;
    } }).select((i) => {
      var a = this.trigger("searchSelect", { target: this.name, index: i.detail.index, item: i.detail.item });
      a.isCancelled === true ? i.preventDefault() : (i.detail.overlay.hide(), this.last.logic = i.detail.item.logic || "AND", this.last.search = "", this.last.label = "[Multiple Fields]", this.searchData = u.clone(i.detail.item.data), this.searchSelected = u.clone(i.detail.item, { exclude: ["icon", "remove"] }), this.reload(), a.finish());
    }).remove((i) => {
      let a = i.detail.item, r = this.trigger("searchRemove", { target: this.name, index: i.detail.index, item: a });
      r.isCancelled === true ? i.preventDefault() : (i.detail.overlay.hide(), this.confirm(u.lang('Do you want to delete search "${item}"?', { item: a.text })).yes((l) => {
        var h = this.savedSearches.findIndex((o) => o.id == a.id);
        h !== -1 && this.savedSearches.splice(h, 1), this.cacheSave("searches", this.savedSearches.map((o) => u.clone(o, { exclude: ["remove", "icon"] }))), l.detail.self.close(), r.finish();
      }).no((l) => {
        l.detail.self.close();
      }));
    })) : this.last.overlay_timer = setTimeout(() => {
      this.searchSuggest(true);
    }, 100));
  }
  searchSave() {
    let e = "", t = (this.searchSelected && (e = this.searchSelected.text), this.savedSearches.findIndex((i) => {
      var _a;
      return i.id == ((_a = this.searchSelected) == null ? void 0 : _a.id);
    })), s = this.trigger("searchSave", { target: this.name, saveLocalStorage: true });
    s.isCancelled !== true && this.message({ width: 350, height: 150, body: `<div class="w2ui-grid-save-search">
                        <span>${u.lang(t != -1 ? "Update Search" : "Save New Search")}</span>
                        <input class="search-name w2ui-input" placeholder="${u.lang("Search name")}">
                   </div>`, buttons: `
                <button id="grid-search-cancel" class="w2ui-btn">${u.lang("Cancel")}</button>
                <button id="grid-search-save" class="w2ui-btn w2ui-btn-blue" ${String(e).trim() == "" ? "disabled" : ""}>${u.lang("Save")}</button>
            ` }).open(async (i) => {
      n(i.detail.box).find("input, button").eq(0).val(e), await i.complete, n(i.detail.box).find("#grid-search-cancel").on("click", () => {
        this.message();
      }), n(i.detail.box).find("#grid-search-save").on("click", () => {
        var a = n(i.detail.box).find(".w2ui-message .search-name").val();
        this.searchSelected && t != -1 ? Object.assign(this.savedSearches[t], { id: a, text: a, logic: this.last.logic, data: u.clone(this.searchData) }) : this.savedSearches.push({ id: a, text: a, icon: "w2ui-icon-search", remove: true, logic: this.last.logic, data: this.searchData }), this.cacheSave("searches", this.savedSearches.map((r) => u.clone(r, { exclude: ["remove", "icon"] }))), this.message(), (this.searchSelected ? (this.searchSelected.text = a, n(this.box).find(`#grid_${this.name}_search_name .name-text`)) : (this.searchSelected = { text: a, logic: this.last.logic, data: u.clone(this.searchData) }, n(i.detail.box).find(`#grid_${this.name}_search_all`).val(" ").prop("readOnly", true), n(i.detail.box).find(`#grid_${this.name}_search_name`).show().find(".name-text"))).html(a), s.finish({ name: a });
      }), n(i.detail.box).find("input, button").off(".message").on("keydown.message", (a) => {
        var r = String(n(i.detail.box).find(".w2ui-message-body input").val()).trim();
        a.keyCode == 13 && r != "" && n(i.detail.box).find("#grid-search-save").trigger("click"), a.keyCode == 27 && this.message();
      }).eq(0).on("input.message", (a) => {
        var r = n(i.detail.box).closest(".w2ui-message").find("#grid-search-save");
        String(n(i.detail.box).val()).trim() === "" ? r.prop("disabled", true) : r.prop("disabled", false);
      }).get(0).focus();
    });
  }
  cache(e) {
    var _a;
    if (u.hasLocalStorage && this.useLocalStorage) try {
      var t = JSON.parse(localStorage.w2ui || "{}");
      return t[_a = this.stateId || this.name] ?? (t[_a] = {}), t[this.stateId || this.name][e];
    } catch {
    }
    return null;
  }
  cacheSave(e, t) {
    var _a;
    if (u.hasLocalStorage && this.useLocalStorage) try {
      var s = JSON.parse(localStorage.w2ui || "{}");
      return s[_a = this.stateId || this.name] ?? (s[_a] = {}), s[this.stateId || this.name][e] = t, localStorage.w2ui = JSON.stringify(s), true;
    } catch {
      delete localStorage.w2ui;
    }
    return false;
  }
  searchReset(e) {
    var t = [];
    let s = false;
    for (let r = 0; r < this.searches.length; r++) this.searches[r].hidden && this.searches[r].value != null && (t.push({ field: this.searches[r].field, operator: this.searches[r].operator || "is", type: this.searches[r].type, value: this.searches[r].value || "" }), s = true);
    var i = this.trigger("search", { reset: true, target: this.name, searchData: t });
    if (i.isCancelled !== true) {
      var a = n(this.box).find("#grid_" + this.name + "_search_all");
      if (this.searchData = i.detail.searchData, this.searchSelected = null, this.last.search = "", this.last.logic = s ? "AND" : "OR", a.next().hide(), 0 < this.searches.length) if (this.multiSearch && this.show.searchAll) this.last.field = "all", this.last.label = "All Fields", a.next().show();
      else {
        let r = 0;
        for (; r < this.searches.length && (this.searches[r].hidden || this.searches[r].simple === false); ) r++;
        r >= this.searches.length ? (this.last.field = "", this.last.label = "") : (this.last.field = this.searches[r].field, this.last.label = this.searches[r].label);
      }
      this.last.multi = false, this.last.fetch.offset = 0, this.last.scrollTop = 0, this.last.scrollLeft = 0, this.last.selection.indexes = [], this.last.selection.columns = {}, this.searchClose(), a = a.val("").get(0), (a == null ? void 0 : a._w2field) && a._w2field.reset(), e || this.reload(), i.finish();
    }
  }
  searchShowFields(e) {
    if (e === true) F.hide(this.name + "-search-fields");
    else {
      var t = [];
      for (let i = -1; i < this.searches.length; i++) {
        let a = this.searches[i];
        var s = a ? a.field : null, s = this.getColumn(s);
        let r = false, l = null;
        if (this.show.searchHiddenMsg == 1 && i != -1 && (s == null || s.hidden === true && s.hideable !== false) && (r = true, l = u.lang("This column " + (s == null ? "does not exist" : "is hidden"))), i == -1) {
          if (!this.multiSearch || !this.show.searchAll) continue;
          a = { field: "all", label: "All Fields" };
        } else if (s != null && s.hideable === false || a.hidden === true && (l = u.lang("This column is hidden"), a.simple === false)) continue;
        a.label == null && a.caption != null && (console.log("NOTICE: grid search.caption property is deprecated, please use search.label. Search ->", a), a.label = a.caption), t.push({ id: a.field, text: u.lang(a.label), search: a, tooltip: l, disabled: r, checked: a.field == this.last.field });
      }
      W.show({ type: "radio", name: this.name + "-search-fields", anchor: n(this.box).find("#grid_" + this.name + "_search_name").parent().find(".w2ui-search-down").get(0), items: t, align: "none", hideOn: ["doc-click", "select"] }).select((i) => {
        this.searchInitInput(i.detail.item.search.field);
      });
    }
  }
  searchInitInput(e, t) {
    let s;
    var i = n(this.box).find("#grid_" + this.name + "_search_all");
    if (e == "all") s = { field: "all", label: u.lang("All Fields") };
    else if ((s = this.getSearch(e)) == null) return;
    this.last.search != "" ? (this.last.label = s.label, this.search(s.field, this.last.search)) : (this.last.field = s.field, this.last.label = s.label), i.attr("placeholder", u.lang("Search") + " " + u.lang(s.label || s.caption || s.field, true));
  }
  clear(e) {
    this.total = 0, this.records = [], this.summary = [], this.last.fetch.offset = 0, this.last.idCache = {}, this.last.selection = { indexes: [], columns: {} }, this.reset(true), e || this.refresh();
  }
  reset(e) {
    this.last.scrollTop = 0, this.last.scrollLeft = 0, this.last.range_start = null, this.last.range_end = null, n(this.box).find(`#grid_${this.name}_records`).prop("scrollTop", 0), e || this.refresh();
  }
  skip(e, t) {
    var _a;
    ((_a = this.url) == null ? void 0 : _a.get) ?? this.url ? (this.offset = parseInt(e), this.offset > this.total && (this.offset = this.total - this.limit), (this.offset < 0 || !u.isInt(this.offset)) && (this.offset = 0), this.clear(true), this.reload(t)) : console.log("ERROR: grid.skip() can only be called when you have remote data source.");
  }
  load(e, t) {
    return e == null ? (console.log('ERROR: You need to provide url argument when calling .load() method of "' + this.name + '" object.'), new Promise((s, i) => {
      i();
    })) : (this.clear(true), this.request("load", {}, e, t));
  }
  reload(e) {
    var _a;
    let t = this;
    var s = ((_a = this.url) == null ? void 0 : _a.get) ?? this.url;
    return t.selectionSave(), s ? this.load(s, () => {
      t.selectionRestore(), typeof e == "function" && e();
    }) : (this.reset(true), this.localSearch(), this.selectionRestore(), typeof e == "function" && e({ status: "success" }), new Promise((i) => {
      i();
    }));
  }
  request(e, t, s, i) {
    let a = this, r, l;
    var h = new Promise((f, m) => {
      r = f, l = m;
    });
    if (t == null && (t = {}), !(s = s || this.url)) return new Promise((f, m) => {
      m();
    });
    u.isInt(this.offset) || (this.offset = 0), u.isInt(this.last.fetch.offset) || (this.last.fetch.offset = 0);
    let o;
    var c = { limit: this.limit, offset: parseInt(this.offset) + parseInt(this.last.fetch.offset), searchLogic: this.last.logic, search: this.searchData.map((f) => (f = u.clone(f), this.searchMap && this.searchMap[f.field] && (f.field = this.searchMap[f.field]), f)), sort: this.sortData.map((f) => (f = u.clone(f), this.sortMap && this.sortMap[f.field] && (f.field = this.sortMap[f.field]), f)) };
    if (this.searchData.length === 0 && (delete c.search, delete c.searchLogic), this.sortData.length === 0 && delete c.sort, u.extend(c, this.postData), u.extend(c, t), e != "delete" && e != "save" || (delete c.limit, delete c.offset, (c.action = e) == "delete" && (c[this.recid || "recid"] = this.getSelection())), e == "load") {
      if ((o = this.trigger("request", { target: this.name, url: s, postData: c, httpMethod: "GET", httpHeaders: this.httpHeaders })).isCancelled === true) return new Promise((f, m) => {
        m();
      });
    } else o = { detail: { url: s, postData: c, httpMethod: e == "save" ? "PUT" : "DELETE", httpHeaders: this.httpHeaders } };
    if (this.last.fetch.offset === 0 && this.lock(u.lang(this.msgRefresh), true), this.last.fetch.controller) try {
      this.last.fetch.controller.abort();
    } catch {
    }
    switch (s = o.detail.url, e) {
      case "save":
        (s == null ? void 0 : s.save) && (s = s.save);
        break;
      case "delete":
        (s == null ? void 0 : s.remove) && (s = s.remove);
        break;
      default:
        s = (s == null ? void 0 : s.get) ?? s;
    }
    if (0 < Object.keys(this.routeData).length) {
      var d = u.parseRoute(s);
      if (0 < d.keys.length) for (let f = 0; f < d.keys.length; f++) this.routeData[d.keys[f].name] != null && (s = s.replace(new RegExp(":" + d.keys[f].name, "g"), this.routeData[d.keys[f].name]));
    }
    return s = new URL(s, location), t = u.prepareParams(s, { method: o.detail.httpMethod, headers: o.detail.httpHeaders, body: o.detail.postData }, this.dataType), Object.assign(this.last.fetch, { action: e, options: t, controller: new AbortController(), start: Date.now(), loaded: false }), t.signal = this.last.fetch.controller.signal, fetch(s, t).catch(p).then((f) => {
      f != null && ((f == null ? void 0 : f.status) != 200 ? p(f ?? {}) : (a.unlock(), f.json().catch(p).then((m) => {
        this.requestComplete(m, e, i, r, l);
      })));
    }), e == "load" && o.finish(), h;
    function p(f) {
      var m;
      (f == null ? void 0 : f.name) !== "AbortError" && (a.unlock(), (m = a.trigger("error", { response: f, lastFetch: a.last.fetch })).isCancelled !== true) && (f.status && f.status != 200 ? a.error(f.status + ": " + f.statusText) : (console.log("ERROR: Server communication failed.", `
   EXPECTED:`, { total: 5, records: [{ recid: 1, field: "value" }] }, `
         OR:`, { error: true, message: "error message" }), a.requestComplete({ error: true, message: u.lang(this.msgHTTPError), response: f }, e, i, r, l)), m.finish());
    }
  }
  requestComplete(e, t, s, i, a) {
    var _a;
    let r = e.error ?? false, l = (e.error == null && e.status === "error" && (r = true), this.last.fetch.response = (Date.now() - this.last.fetch.start) / 1e3, setTimeout(() => {
      this.show.statusResponse && this.status(u.lang("Server Response ${count} seconds", { count: this.last.fetch.response }));
    }, 10), this.last.pull_more = false, this.last.pull_refresh = true, "load");
    this.last.fetch.action == "save" && (l = "save"), this.last.fetch.action == "delete" && (l = "delete");
    var h = this.trigger(l, { target: this.name, error: r, data: e, lastFetch: this.last.fetch });
    if (h.isCancelled === true) a();
    else {
      if (r) this.error(u.lang(e.message ?? this.msgServerError)), a(e);
      else if (typeof this.parser == "function" ? typeof (e = this.parser(e)) != "object" && console.log("ERROR: Your parser did not return proper object") : e == null ? e = { error: true, message: u.lang(this.msgNotJSON) } : Array.isArray(e) && (e = { error: r, records: e, total: e.length }), t == "load") {
        if (e.total == null && (e.total = -1), e.records == null && (e.records = []), e.records.length == this.limit ? (a = this.records.length + e.records.length, this.last.fetch.hasMore = a != this.total) : (this.last.fetch.hasMore = false, this.total = this.offset + this.last.fetch.offset + e.records.length), this.last.fetch.hasMore || n(this.box).find("#grid_" + this.name + "_rec_more, #grid_" + this.name + "_frec_more").hide(), this.last.fetch.offset === 0) this.records = [], this.summary = [];
        else if (e.total != -1 && parseInt(e.total) != parseInt(this.total)) {
          let o = this;
          return this.message(u.lang(this.msgNeedReload)).ok(() => {
            delete o.last.fetch.offset, o.reload();
          }), new Promise((c) => {
            c();
          });
        }
        u.isInt(e.total) && (this.total = parseInt(e.total)), e.records && e.records.forEach((o) => {
          var _a2;
          this.recid && (o.recid = this.parseField(o, this.recid)), o.recid == null && (o.recid = "recid-" + this.records.length), (((_a2 = o.w2ui) == null ? void 0 : _a2.summary) === true ? this.summary : this.records).push(o);
        }), e.summary && (this.summary = [], e.summary.forEach((o) => {
          this.recid && (o.recid = this.parseField(o, this.recid)), o.recid == null && (o.recid = "recid-" + this.summary.length), this.summary.push(o);
        }));
      } else if (t == "delete") return this.reset(), this.reload();
      (((_a = this.url) == null ? void 0 : _a.get) ?? this.url) || (this.localSort(), this.localSearch()), this.total = parseInt(this.total), this.last.fetch.offset === 0 ? this.refresh() : (this.scroll(), this.resize()), typeof s == "function" && s(e), i(e), h.finish(), this.last.fetch.loaded = true;
    }
  }
  error(e) {
    var t = this.trigger("error", { target: this.name, message: e });
    t.isCancelled !== true && (this.message(e), t.finish());
  }
  getChanges(e) {
    var t = [];
    e === void 0 && (e = this.records);
    for (let a = 0; a < e.length; a++) {
      var s, i = e[a];
      (i == null ? void 0 : i.w2ui) && (i.w2ui.changes != null && ((s = {})[this.recid || "recid"] = i.recid, t.push(u.extend(s, i.w2ui.changes))), i.w2ui.expanded !== true) && i.w2ui.children && i.w2ui.children.length && t.push(...this.getChanges(i.w2ui.children));
    }
    return t;
  }
  mergeChanges() {
    var e = this.getChanges();
    for (let i = 0; i < e.length; i++) {
      var t, s = this.get(e[i][this.recid || "recid"]);
      for (t in e[i]) if (!(t == "recid" || this.recid && t == this.recid)) {
        typeof e[i][t] == "object" && (e[i][t] = e[i][t].text);
        try {
          (function a(r, l, h) {
            let o = l.split(".");
            o.length == 1 ? r[l] = h : (r = r[o[0]], o.shift(), a(r, o.join("."), h));
          })(s, t, e[i][t]);
        } catch (a) {
          console.log("ERROR: Cannot merge. ", a.message || "", a);
        }
        s.w2ui && delete s.w2ui.changes;
      }
    }
    this.refresh();
  }
  save(e) {
    var _a;
    var t = this.getChanges(), s = ((_a = this.url) == null ? void 0 : _a.save) ?? this.url;
    let i = this.trigger("save", { target: this.name, changes: t });
    i.isCancelled !== true && (s ? this.request("save", { changes: i.detail.changes }, null, (a) => {
      a.error || this.mergeChanges(), i.finish(), typeof e == "function" && e(a);
    }) : (this.mergeChanges(), i.finish()));
  }
  editField(e, t, s, i) {
    var _a, _b;
    let a = this;
    if (this.last.inEditMode === true) i && i.keyCode == 13 ? ({ index: r, column: l, value: h } = this.last._edit, this.editChange({ type: "custom", value: h }, r, l, i), this.editDone(r, l, i)) : 0 < (h = n(this.box).find("div.w2ui-edit-box .w2ui-input")).length && (h.get(0).tagName == "DIV" ? (h.text(h.text() + s), u.setCursorPosition(h.get(0), h.text().length)) : (h.val(h.val() + s), u.setCursorPosition(h.get(0), h.val().length)));
    else {
      let o = this.get(e, true), c = this.getCellEditable(o, t);
      if (c && !["checkbox", "check"].includes(c.type)) {
        let d = this.records[o], p = this.columns[t];
        var r = p.frozen === true ? "_f" : "_";
        if (["enum", "file"].indexOf(c.type) != -1) console.log('ERROR: input types "enum" and "file" are not supported in inline editing.');
        else {
          var l = this.trigger("editField", { target: this.name, recid: e, column: t, value: s, index: o, originalEvent: i });
          if (l.isCancelled !== true) {
            let w = function(C) {
              try {
                var $ = getComputedStyle(C), I = C.tagName.toUpperCase() == "DIV" ? C.innerText : C.value, E = n(a.box).find("#grid_" + a.name + "_editable").get(0), T = `font-family: ${$["font-family"]}; font-size: ${$["font-size"]}; white-space: no-wrap;`, R = u.getStrWidth(I, T);
                R + 20 > E.clientWidth && n(E).css("width", R + 20 + "px");
              } catch {
              }
            };
            s = l.detail.value, this.last.inEditMode = true, this.last.editColumn = t, this.last._edit = { value: s, index: o, column: t, recid: e }, this.selectNone(true), this.select({ recid: e, column: t });
            var h = n(this.box).find("#grid_" + this.name + r + "rec_" + u.escapeId(e));
            let f = h.find('[col="' + t + '"] > div'), m = (this.last._edit.tr = h, this.last._edit.div = f, n(this.box).find("div.w2ui-edit-box").remove(), this.selectType != "row" && (n(this.box).find("#grid_" + this.name + r + "selection").attr("id", "grid_" + this.name + "_editable").removeClass("w2ui-selection").addClass("w2ui-edit-box").prepend('<div style="position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;"></div>').find(".w2ui-selection-resizer").remove(), f = n(this.box).find("#grid_" + this.name + "_editable > div:first-child")), c.attr = c.attr ?? "", c.text = c.text ?? "", c.style = c.style ?? "", c.items = c.items ?? [], ((_b = (_a = d.w2ui) == null ? void 0 : _a.changes) == null ? void 0 : _b[p.field]) != null ? u.stripTags(d.w2ui.changes[p.field]) : u.stripTags(a.parseField(d, p.field))), b = typeof (m = m ?? "") != "object" ? m : "", v = (l.detail.prevValue != null && (b = l.detail.prevValue), s != null && (m = s), p.style != null ? p.style + ";" : "");
            typeof p.render == "string" && ["number", "int", "float", "money", "percent", "size"].includes(p.render.split(":")[0]) && (v += "text-align: right;"), 0 < c.items.length && !u.isPlainObject(c.items[0]) && (c.items = u.normMenu(c.items));
            let g, y = ["date", "time", "datetime", "color", "list", "combo"];
            i = getComputedStyle(h.find('[col="' + t + '"] > div').get(0)), r = `font-family: ${i["font-family"]}; font-size: ${i["font-size"]};`, c.type === "div" ? (f.addClass("w2ui-editable").html(u.stripSpaces(`<div id="grid_${this.name}_edit_${e}_${t}" class="w2ui-input w2ui-focus"
                        contenteditable autocorrect="off" autocomplete="off" spellcheck="false"
                        style="${r + v + c.style}"
                        field="${p.field}" recid="${e}" column="${t}" ${c.attr}>
                    </div>` + c.text)), (g = f.find("div.w2ui-input").get(0)).innerText = typeof m != "object" ? m : "", s != null ? u.setCursorPosition(g, g.innerText.length) : u.setCursorPosition(g, 0, g.innerText.length)) : (f.addClass("w2ui-editable").html(u.stripSpaces(`<input id="grid_${this.name}_edit_${e}_${t}" class="w2ui-input"
                        autocorrect="off" autocomplete="off" spellcheck="false" type="text"
                        style="${r + v + c.style}"
                        field="${p.field}" recid="${e}" column="${t}" ${c.attr}>` + c.text)), g = f.find("input").get(0), c.type == "number" && (m = u.formatNumber(m)), c.type == "date" && (m = u.formatDate(u.isDate(m, c.format, true) || /* @__PURE__ */ new Date(), c.format)), g.value = typeof m != "object" ? m : "", h = (C) => {
              var _a2, _b2, _c, _d;
              var $ = (_a2 = this.last._edit) == null ? void 0 : _a2.escKey;
              let I = false;
              var E = n(g).data("tooltipName");
              E && ((_b2 = F.get(E[0])) == null ? void 0 : _b2.selected) != null && (I = true), !this.last.inEditMode || $ || !y.includes(c.type) || ((_c = C.detail.overlay.anchor) == null ? void 0 : _c.id) != ((_d = this.last._edit.input) == null ? void 0 : _d.id) && c.type != "list" || (this.editChange(), this.editDone(void 0, void 0, { keyCode: I ? 13 : 0 }));
            }, new Se(u.extend({}, c, { el: g, selected: m, onSelect: h, onHide: h })), s == null && g && g.select()), Object.assign(this.last._edit, { input: g, edit: c }), n(g).off(".w2ui-editable").on("blur.w2ui-editable", (C) => {
              var $, I;
              this.last.inEditMode && ($ = this.last._edit.edit.type, I = n(g).data("tooltipName"), y.includes($) && I || (this.editChange(g, o, t, C), this.editDone()));
            }).on("mousedown.w2ui-editable", (C) => {
              C.stopPropagation();
            }).on("click.w2ui-editable", (C) => {
              w.call(g, C);
            }).on("paste.w2ui-editable", (C) => {
              C.preventDefault(), C = C.clipboardData.getData("text/plain"), document.execCommand("insertHTML", false, C);
            }).on("keyup.w2ui-editable", (C) => {
              w.call(g, C);
            }).on("keydown.w2ui-editable", (C) => {
              switch (C.keyCode) {
                case 8:
                  c.type != "list" || g._w2field || C.preventDefault();
                  break;
                case 9:
                case 13:
                  C.preventDefault();
                  break;
                case 27:
                  var $ = n(g).data("tooltipName");
                  $ && 0 < $.length && (this.last._edit.escKey = true, F.hide($[0]), C.preventDefault()), C.stopPropagation();
              }
              setTimeout(() => {
                var _a2, _b2;
                switch (C.keyCode) {
                  case 9:
                    var I = C.shiftKey ? a.prevCell(o, t, true) : a.nextCell(o, t, true);
                    I != null && (E = a.records[I.index].recid, this.editChange(g, o, t, C), this.editDone(o, t, C), a.selectType != "row" ? (a.selectNone(true), a.select({ recid: E, column: I.colIndex })) : a.editField(E, I.colIndex, null, C), C.preventDefault) && C.preventDefault();
                    break;
                  case 13: {
                    let T = false;
                    var E = n(g).data("tooltipName");
                    E && F.get(E[0]).selected != null && (T = true), E && T || (this.editChange(g, o, t, C), this.editDone(o, t, C));
                    break;
                  }
                  case 27: {
                    this.last._edit.escKey = false;
                    let T = a.parseField(d, p.field);
                    ((_b2 = (_a2 = d.w2ui) == null ? void 0 : _a2.changes) == null ? void 0 : _b2[p.field]) != null && (T = d.w2ui.changes[p.field]), g._prevValue != null && (T = g._prevValue), g.tagName == "DIV" ? g.innerText = T ?? "" : g.value = T ?? "", this.editDone(o, t, C), setTimeout(() => {
                      a.select({ recid: e, column: t });
                    }, 1);
                    break;
                  }
                }
                w(g);
              }, 1);
            }), g && (g._prevValue = b), c.type != "list" && setTimeout(() => {
              this.last.inEditMode && g && (g.focus(), clearTimeout(this.last.kbd_timer), (g.resize = w)(g));
            }, 50), l.finish({ input: g });
          }
        }
      }
    }
  }
  editChange(e, t, s, i) {
    var _a, _b, _c, _d;
    e = e ?? this.last._edit.input, t = t ?? this.last._edit.index, s = s ?? this.last._edit.column, i = i ?? {};
    var a = (t < 0 ? this.summary : this.records)[t = t < 0 ? -t - 1 : t], r = this.columns[s];
    let l = (e == null ? void 0 : e.tagName) == "DIV" ? e.innerText : e.value;
    var h = e._w2field, o = (h && (h.type == "list" && (l = h.selected), Object.keys(l).length !== 0 && l != null || (l = ""), u.isPlainObject(l) || (l = h.clean(l))), e.type == "checkbox" && (((_a = a.w2ui) == null ? void 0 : _a.editable) === false && (e.checked = !e.checked), l = e.checked), this.parseField(a, r.field)), c = ((_b = a.w2ui) == null ? void 0 : _b.changes) && a.w2ui.changes.hasOwnProperty(r.field) ? a.w2ui.changes[r.field] : o;
    let d = { target: this.name, input: e, recid: a.recid, index: t, column: s, originalEvent: i, value: { new: l, previous: c, original: o } }, p = (((_c = i.target) == null ? void 0 : _c._prevValue) != null && (d.value.previous = i.target._prevValue), 0);
    for (; p < 20; ) {
      if (p++, typeof (l = d.value.new) != "object" && String(o) != String(l) || typeof l == "object" && l && l.id != o && (typeof o != "object" || o == null || l.id != o.id)) {
        if ((d = this.trigger("change", d)).isCancelled !== true) {
          if (l !== d.detail.value.new) continue;
          (d.detail.value.new !== "" && d.detail.value.new != null || c !== "" && c != null) && (a.w2ui = a.w2ui ?? {}, a.w2ui.changes = a.w2ui.changes ?? {}, a.w2ui.changes[r.field] = d.detail.value.new), d.finish();
        }
      } else if ((d = this.trigger("restore", d)).isCancelled !== true) {
        if (l !== d.detail.value.new) continue;
        ((_d = a.w2ui) == null ? void 0 : _d.changes) && (delete a.w2ui.changes[r.field], Object.keys(a.w2ui.changes).length === 0) && delete a.w2ui.changes, d.finish();
      }
      break;
    }
  }
  editDone(e, t, s) {
    var _a, _b;
    if (e = e ?? this.last._edit.index, t = t ?? this.last._edit.column, s = s ?? {}, this.advanceOnEdit && s.keyCode == 13) {
      let h = s.shiftKey ? this.prevRow(e, t, 1) : this.nextRow(e, t, 1);
      h == null && (h = e), setTimeout(() => {
        this.selectType != "row" ? (this.selectNone(true), this.select({ recid: this.records[h].recid, column: t })) : this.editField(this.records[h].recid, t, null, s);
      }, 1);
    }
    var i = e < 0, a = n(this.last._edit.tr).find('[col="' + t + '"]'), r = this.records[e], l = this.columns[t];
    this.last.inEditMode = false, this.last._edit = null, i || (((_b = (_a = r.w2ui) == null ? void 0 : _a.changes) == null ? void 0 : _b[l.field]) != null ? a.addClass("w2ui-changed") : a.removeClass("w2ui-changed"), a.replace(this.getCellHTML(e, t, i))), n(this.box).find("div.w2ui-edit-box").remove(), this.updateToolbar(), setTimeout(() => {
      var h = n(this.box).find(`#grid_${this.name}_focus`).get(0);
      document.activeElement === h || this.last.inEditMode || h.focus();
    }, 10);
  }
  delete(e) {
    var _a;
    var t = this.trigger("delete", { target: this.name, force: e });
    if (e && this.message(), t.isCancelled !== true) {
      e = t.detail.force;
      var s = this.getSelection();
      if (s.length !== 0) if (this.msgDelete == "" || e) {
        if (typeof this.url != "object" ? this.url : this.url.remove) this.request("delete");
        else if (typeof s[0] != "object") this.selectNone(), this.remove.apply(this, s);
        else {
          for (let l = 0; l < s.length; l++) {
            var i = this.columns[s[l].column].field, a = this.get(s[l].recid, true), r = this.records[a];
            a != null && i != "recid" && (this.records[a][i] = "", (_a = r.w2ui) == null ? void 0 : _a.changes) && delete r.w2ui.changes[i];
          }
          this.update();
        }
        t.finish();
      } else this.confirm({ text: u.lang(this.msgDelete, { count: s.length, records: u.lang(s.length == 1 ? "record" : "records") }), width: 380, height: 170, yes_text: u.lang("Delete"), yes_class: "w2ui-btn-red", no_text: u.lang("Cancel") }).yes((l) => {
        l.detail.self.close(), this.delete(true);
      }).no((l) => {
        l.detail.self.close();
      });
    }
  }
  click(e, t) {
    var _a, _b, _c;
    var s = Date.now();
    let i = null;
    if (!(this.last.cancelClick == 1 || t && t.altKey)) if (typeof e == "object" && e !== null && (i = e.column, e = e.recid), t == null && (t = {}), s - parseInt(this.last.click_time) < 350 && this.last.click_recid == e && t.type == "click") this.dblClick(e, t);
    else {
      if (this.last.bubbleEl && (this.last.bubbleEl = null), this.last.click_time = s, s = this.last.click_recid, this.last.click_recid = e, i == null && t.target) {
        let d = t.target;
        d.tagName != "TD" && (d = n(d).closest("td")[0]), n(d).attr("col") != null && (i = parseInt(n(d).attr("col")));
      }
      var a = this.trigger("click", { target: this.name, recid: e, column: i, originalEvent: t });
      if (a.isCancelled !== true) {
        var r = this.getSelection(), l = (n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.get(e, true)), h = [];
        this.last.sel_ind = l, this.last.sel_col = i, this.last.sel_recid = e, this.last.sel_type = "click";
        let d, p, f, m;
        if (t.shiftKey && 0 < r.length && this.multiSelect) {
          if (r[0].recid) {
            d = this.get(r[0].recid, true), p = this.get(e, true), m = i > r[0].column ? (f = r[0].column, i) : (f = i, r[0].column);
            for (let b = f; b <= m; b++) h.push(b);
          } else d = this.get(s, true), p = this.get(e, true);
          var o = [], c = (d > p && (s = d, d = p, p = s), ((_a = this.url) == null ? void 0 : _a.get) ? this.url.get : this.url);
          for (let b = d; b <= p; b++) if (!(0 < this.searchData.length) || c || this.last.searchIds.includes(b)) if (this.selectType == "row") o.push(this.records[b].recid);
          else for (let v = 0; v < h.length; v++) o.push({ recid: this.records[b].recid, column: h[v] });
          this.select(o);
        } else {
          s = this.last.selection;
          let b = s.indexes.indexOf(l) != -1, v = false;
          n(t.target).closest("td").hasClass("w2ui-col-select") && (v = true), (t.ctrlKey || t.shiftKey || t.metaKey || v) && this.multiSelect || this.showSelectColumn ? (b = this.selectType == "row" || ((_b = s.columns[l]) == null ? void 0 : _b.includes(i)) ? b : false) === true ? this.unselect({ recid: e, column: i }) : this.select({ recid: e, column: i }) : (this.selectType == "row" || ((_c = s.columns[l]) == null ? void 0 : _c.includes(i)) || (b = false), this.selectNone(true), b === true && r.length == 1 ? this.unselect({ recid: e, column: i }) : this.select({ recid: e, column: i }));
        }
        this.status(), this.initResize(), a.finish();
      }
    }
  }
  columnClick(e, t) {
    if (this.last.colResizing !== true) {
      let r = this.trigger("columnClick", { target: this.name, field: e, originalEvent: t });
      if (r.isCancelled !== true) {
        if (this.selectType == "row") {
          var s = this.getColumn(e);
          s && s.sortable && this.sort(e, null, !(!t || !t.ctrlKey && !t.metaKey)), r.detail.field == "line-number" && (this.getSelection().length >= this.records.length ? this.selectNone() : this.selectAll());
        } else if (t.altKey && (s = this.getColumn(e)) && s.sortable && this.sort(e, null, !(!t || !t.ctrlKey && !t.metaKey)), r.detail.field == "line-number") this.getSelection().length >= this.records.length ? this.selectNone() : this.selectAll();
        else {
          t.shiftKey || t.metaKey || t.ctrlKey || this.selectNone(true);
          var s = this.getSelection(), e = this.getColumn(r.detail.field, true), i = [], a = [];
          if (s.length != 0 && t.shiftKey) {
            let o = e, c = s[0].column;
            o > c && (o = s[0].column, c = e);
            for (let d = o; d <= c; d++) a.push(d);
          } else a.push(e);
          if ((r = this.trigger("columnSelect", { target: this.name, columns: a })).isCancelled !== true) {
            for (let o = 0; o < this.records.length; o++) i.push({ recid: this.records[o].recid, column: a });
            this.select(i);
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
    e = this.trigger("columnContextMenu", { target: this.name, field: e, originalEvent: t }), e.isCancelled !== true && (this.show.columnMenu && (W.show({ type: "check", anchor: document.body, originalEvent: t, items: this.initColumnOnOff() }).then(() => {
      n("#w2overlay-context-menu .w2ui-grid-skip").off(".w2ui-grid").on("click.w2ui-grid", (s) => {
        s.stopPropagation();
      }).on("keypress", (s) => {
        s.keyCode == 13 && (this.skip(s.target.value), this.toolbar.click("w2ui-column-on-off"));
      });
    }).select((s) => {
      var i = s.detail.item.id;
      ["w2ui-stateSave", "w2ui-stateReset"].includes(i) ? this[i.substring(5)]() : i != "w2ui-skip" && this.columnOnOff(s, s.detail.item.id), clearTimeout(this.last.kbd_timer);
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
    let t = this, s = typeof this.url != "object" ? this.url : this.url.get;
    if (t.keyboard === true) {
      var i = t.trigger("keydown", { target: t.name, originalEvent: e });
      if (i.isCancelled !== true) if (0 < n(this.box).find(".w2ui-message").length) e.keyCode == 27 && this.message();
      else {
        let C = function(T) {
          if (h && I(), !(v.length <= 0)) {
            let _ = t.prevRow(m, t.selectType == "row" ? 0 : c[0].column, T);
            if ((_ = w || _ != null ? _ : t.searchData.length == 0 || s ? 0 : t.last.searchIds[0]) != null) {
              if (w && t.multiSelect) {
                if (E()) return;
                if (t.selectType == "row") t.last.sel_ind > _ && t.last.sel_ind != b ? t.unselect(t.records[b].recid) : t.select(t.records[_].recid);
                else if (t.last.sel_ind > _ && t.last.sel_ind != b) {
                  _ = b;
                  var R = [];
                  for (let S = 0; S < p.length; S++) R.push({ recid: t.records[_].recid, column: p[S] });
                  t.unselect(R);
                } else {
                  var k = [];
                  for (let S = 0; S < p.length; S++) k.push({ recid: t.records[_].recid, column: p[S] });
                  t.select(k);
                }
              } else t.selectNone(true), t.click({ recid: t.records[_].recid, column: p[0] }, e);
              t.scrollIntoView(_, null, true, T != 1), e.preventDefault && e.preventDefault();
            } else w || t.selectNone(true);
          }
        }, $ = function(T) {
          if (h && I(), !(v.length <= 0)) {
            let _ = t.nextRow(b, t.selectType == "row" ? 0 : c[0].column, T);
            if ((_ = w || _ != null ? _ : t.searchData.length == 0 || s ? t.records.length - 1 : t.last.searchIds[t.last.searchIds.length - 1]) != null) {
              if (w && t.multiSelect) {
                if (E()) return;
                if (t.selectType == "row") t.last.sel_ind < _ && t.last.sel_ind != m ? t.unselect(t.records[m].recid) : t.select(t.records[_].recid);
                else if (t.last.sel_ind < _ && t.last.sel_ind != m) {
                  _ = m;
                  var R = [];
                  for (let S = 0; S < p.length; S++) R.push({ recid: t.records[_].recid, column: p[S] });
                  t.unselect(R);
                } else {
                  var k = [];
                  for (let S = 0; S < p.length; S++) k.push({ recid: t.records[_].recid, column: p[S] });
                  t.select(k);
                }
              } else t.selectNone(true), t.click({ recid: t.records[_].recid, column: p[0] }, e);
              t.scrollIntoView(_, null, true, T != 1), g = true;
            } else w || t.selectNone(true);
          }
        }, I = function() {
          if (t.records && t.records.length !== 0) {
            let T = Math.floor(o[0].scrollTop / t.recordHeight) + 1;
            (!t.records[T] || T < 2) && (T = 0), t.records[T] !== void 0 && t.select({ recid: t.records[T].recid, column: 0 });
          }
        }, E = function() {
          if (t.last.sel_type == "click") {
            if (t.selectType == "row") return t.last.sel_type = "key", 1 < c.length && (c.splice(c.indexOf(t.records[t.last.sel_ind].recid), 1), t.unselect(c), 1);
            if (t.last.sel_type = "key", 1 < c.length) {
              for (let T = 0; T < c.length; T++) if (c[T].recid == t.last.sel_recid && c[T].column == t.last.sel_col) {
                c.splice(T, 1);
                break;
              }
              return t.unselect(c), 1;
            }
          }
        }, h = false, o = n(t.box).find("#grid_" + t.name + "_records"), c = t.getSelection(), d = (c.length === 0 && (h = true), c[0] || null), p = [], f = c[c.length - 1];
        if (typeof d == "object" && d != null) {
          d = c[0].recid, p = [];
          let T = 0;
          for (; !(!c[T] || c[T].recid != d); ) p.push(c[T].column), T++;
          f = c[c.length - 1].recid;
        }
        let m = t.get(d, true), b = t.get(f, true), v = n(t.box).find(`#grid_${t.name}_rec_` + (m != null ? u.escapeId(t.records[m].recid) : "none"));
        var a, r = Math.floor(o[0].clientHeight / t.recordHeight);
        let g = false, y = e.keyCode, w = e.shiftKey;
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
              if (v.length <= 0) break;
              t.toggle(d, e), g = true;
            } else {
              for (let T = 0; T < this.columns.length; T++) if (this.getCellEditable(m, T)) {
                p.push(parseInt(T));
                break;
              }
              0 < (p = this.selectType == "row" && this.last._edit && this.last._edit.column ? [this.last._edit.column] : p).length && (t.editField(d, this.last.editColumn || p[0], null, e), g = true);
            }
            break;
          case 37:
            (function() {
              if (h) I();
              else {
                if (t.selectType == "row") {
                  if (v.length <= 0) return;
                  var T = t.records[m].w2ui || {};
                  !T || T.parent_recid == null || Array.isArray(T.children) && T.children.length !== 0 && T.expanded ? t.collapse(d, e) : (t.unselect(d), t.collapse(T.parent_recid, e), t.select(T.parent_recid));
                } else {
                  let S = t.prevCell(m, p[0]);
                  if (S = (S == null ? void 0 : S.index) != m ? null : S == null ? void 0 : S.colIndex, w || S != null || (t.selectNone(true), S = 0), S != null) if (w && t.multiSelect) {
                    if (E()) return;
                    var R = [], k = [], _ = [];
                    if (p.indexOf(t.last.sel_col) === 0 && 1 < p.length) {
                      for (let D = 0; D < c.length; D++) R.indexOf(c[D].recid) == -1 && R.push(c[D].recid), _.push({ recid: c[D].recid, column: p[p.length - 1] });
                      t.unselect(_), t.scrollIntoView(m, p[p.length - 1], true);
                    } else {
                      for (let D = 0; D < c.length; D++) R.indexOf(c[D].recid) == -1 && R.push(c[D].recid), k.push({ recid: c[D].recid, column: S });
                      t.select(k), t.scrollIntoView(m, S, true);
                    }
                  } else t.click({ recid: d, column: S }, e), t.scrollIntoView(m, S, true);
                  else w || t.selectNone(true);
                }
                g = true;
              }
            })();
            break;
          case 39:
            (function() {
              if (h) I();
              else {
                if (t.selectType == "row") {
                  if (v.length <= 0) return;
                  t.expand(d, e);
                } else {
                  let _ = t.nextCell(m, p[p.length - 1]);
                  if (_ = _.index != m ? null : _.colIndex, w || _ != null || (t.selectNone(true), _ = t.columns.length - 1), _ != null) if (w && y == 39 && t.multiSelect) {
                    if (E()) return;
                    var T = [], R = [], k = [];
                    if (p.indexOf(t.last.sel_col) == p.length - 1 && 1 < p.length) {
                      for (let S = 0; S < c.length; S++) T.indexOf(c[S].recid) == -1 && T.push(c[S].recid), k.push({ recid: c[S].recid, column: p[0] });
                      t.unselect(k), t.scrollIntoView(m, p[0], true);
                    } else {
                      for (let S = 0; S < c.length; S++) T.indexOf(c[S].recid) == -1 && T.push(c[S].recid), R.push({ recid: c[S].recid, column: _ });
                      t.select(R), t.scrollIntoView(m, _, true);
                    }
                  } else t.click({ recid: d, column: _ }, e), t.scrollIntoView(m, _, true);
                  else w || t.selectNone(true);
                }
                g = true;
              }
            })();
            break;
          case 33:
            C(r);
            break;
          case 34:
            $(r);
            break;
          case 35:
            $(-1);
            break;
          case 36:
            C(-1);
            break;
          case 38:
            C(e.metaKey || e.ctrlKey ? -1 : 1);
            break;
          case 40:
            $(e.metaKey || e.ctrlKey ? -1 : 1);
            break;
          case 17:
          case 91:
            h || u.isSafari && (t.last.copy_event = t.copy(false, e), (a = n(t.box).find("#grid_" + t.name + "_focus")).val(t.last.copy_event.detail.text), a[0].select());
            break;
          case 67:
            (e.metaKey || e.ctrlKey) && (u.isSafari || (t.last.copy_event = t.copy(false, e), (a = n(t.box).find("#grid_" + t.name + "_focus")).val(t.last.copy_event.detail.text), a[0].select()), t.copy(t.last.copy_event, e));
            break;
          case 88:
            h || (e.ctrlKey || e.metaKey) && (u.isSafari || (t.last.copy_event = t.copy(false, e), (a = n(t.box).find("#grid_" + t.name + "_focus")).val(t.last.copy_event.detail.text), a[0].select()), t.copy(t.last.copy_event, e));
        }
        var l = [32, 187, 189, 192, 219, 220, 221, 186, 222, 188, 190, 191];
        for (let T = 48; T <= 111; T++) l.push(T);
        l.indexOf(y) == -1 || e.ctrlKey || e.metaKey || g || (p.length === 0 && p.push(0), g = false, setTimeout(() => {
          var T = n(t.box).find("#grid_" + t.name + "_focus"), R = T.val();
          T.val(""), t.editField(d, p[0], R, e);
        }, 1)), g && e.preventDefault && e.preventDefault(), i.finish();
      }
    }
  }
  scrollIntoView(e, t, s, i) {
    let a = this.records.length;
    if ((a = this.searchData.length == 0 || this.url ? a : this.last.searchIds.length) !== 0) {
      if (e == null) {
        var r = this.getSelection();
        if (r.length === 0) return;
        u.isPlainObject(r[0]) ? (e = r[0].index, t = r[0].column) : e = this.get(r[0], true);
      }
      var r = n(this.box).find(`#grid_${this.name}_records`), l = r[0].clientWidth, h = r[0].clientHeight, o = r[0].scrollTop, c = r[0].scrollLeft, d = this.last.searchIds.length;
      if (0 < d && (e = this.last.searchIds.indexOf(e)), r.css({ "scroll-behavior": s ? "auto" : "smooth" }), h < this.recordHeight * (0 < d ? d : a) && 0 < r.length && (d = (s = Math.floor(o / this.recordHeight)) + Math.floor(h / this.recordHeight), e == s && r.prop("scrollTop", o - h / 1.3), e == d && r.prop("scrollTop", o + h / 1.3), (e < s || d < e) && r.prop("scrollTop", (e - 1) * this.recordHeight), i === true) && r.prop("scrollTop", e * this.recordHeight), t != null) {
        let f = 0, m = 0;
        o = u.scrollBarSize();
        for (let b = 0; b <= t; b++) {
          var p = this.columns[b];
          p.frozen || p.hidden || (f = m, m += parseInt(p.sizeCalculated));
        }
        l < m - c ? r.prop("scrollLeft", f - o) : f < c && r.prop("scrollLeft", m - l + 2 * o);
      }
    }
  }
  scrollToColumn(e) {
    if (e != null) {
      let s = 0, i = false;
      for (let a = 0; a < this.columns.length; a++) {
        var t = this.columns[a];
        if (t.field == e) {
          i = true;
          break;
        }
        t.frozen || t.hidden || (t = parseInt(t.sizeCalculated || t.size), s += t);
      }
      i && (this.last.scrollLeft = s + 1, this.scroll());
    }
  }
  dblClick(e, t) {
    let s = null;
    if (typeof e == "object" && e !== null && (s = e.column, e = e.recid), t == null && (t = {}), s == null && t.target) {
      let l = t.target;
      l.tagName.toUpperCase() != "TD" && (l = n(l).closest("td")[0]), s = parseInt(n(l).attr("col"));
    }
    var i = this.get(e, true), a = this.records[i], r = this.trigger("dblClick", { target: this.name, recid: e, column: s, originalEvent: t });
    r.isCancelled !== true && (this.selectNone(true), this.getCellEditable(i, s) ? this.editField(e, s, null, t) : (this.select({ recid: e, column: s }), (this.show.expandColumn || a && a.w2ui && Array.isArray(a.w2ui.children)) && this.toggle(e)), r.finish());
  }
  showContextMenu(e, t, s) {
    if (this.last.userSelect != "text") {
      (s = s ?? { offsetX: 0, offsetY: 0, target: n(this.box).find(`#grid_${this.name}_rec_` + e)[0] }).offsetX == null && (s.offsetX = s.layerX - s.target.offsetLeft, s.offsetY = s.layerY - s.target.offsetTop), u.isFloat(e) && (e = parseFloat(e));
      var i = this.getSelection();
      if (this.selectType == "row") i.indexOf(e) == -1 && this.click(e);
      else {
        let r = false;
        for (let l = 0; l < i.length; l++) i[l].recid != e && i[l].column != t || (r = true);
        r || e == null || this.click({ recid: e, column: t }), r || t == null || this.columnClick(this.columns[t].field, s);
      }
      var a = this.trigger("contextMenu", { target: this.name, originalEvent: s, recid: e, column: t });
      a.isCancelled !== true && (0 < this.contextMenu.length && (W.show({ anchor: document.body, originalEvent: s, items: this.contextMenu }).select((r) => {
        clearTimeout(this.last.kbd_timer), this.contextMenuClick(e, t, r);
      }), clearTimeout(this.last.kbd_timer)), s.preventDefault(), a.finish());
    }
  }
  contextMenuClick(e, t, s) {
    e = this.trigger("contextMenuClick", { target: this.name, recid: e, column: t, originalEvent: s.detail.originalEvent, menuEvent: s, menuIndex: s.detail.index, menuItem: s.detail.item }), e.isCancelled !== true && e.finish();
  }
  toggle(e) {
    var t = this.get(e);
    if (t != null) return t.w2ui = t.w2ui ?? {}, t.w2ui.expanded === true ? this.collapse(e) : this.expand(e);
  }
  expand(e, t) {
    var _a;
    var s = this.get(e, true);
    let i = this.records[s];
    i.w2ui = i.w2ui ?? {};
    var a = u.escapeId(e), r = i.w2ui.children;
    let l;
    if (Array.isArray(r)) {
      if (i.w2ui.expanded === true || r.length === 0 || (l = this.trigger("expand", { target: this.name, recid: e })).isCancelled === true) return false;
      i.w2ui.expanded = true, r.forEach((h) => {
        h.w2ui = h.w2ui ?? {}, h.w2ui.parent_recid = i.recid, h.w2ui.children == null && (h.w2ui.children = []);
      }), this.records.splice.apply(this.records, [s + 1, 0].concat(r)), this.total !== -1 && (this.total += r.length), (typeof this.url != "object" ? this.url : this.url.get) || (this.localSort(true, true), 0 < this.searchData.length && this.localSearch(true)), t !== true && this.refresh(), l.finish();
    } else {
      if (0 < n(this.box).find("#grid_" + this.name + "_rec_" + a + "_expanded_row").length || this.show.expandColumn !== true || i.w2ui.expanded == "none") return false;
      if (n(this.box).find("#grid_" + this.name + "_rec_" + a).after(`<tr id="grid_${this.name}_rec_${e}_expanded_row" class="w2ui-expanded-row">
                    <td colspan="100" class="w2ui-expanded2">
                        <div id="grid_${this.name}_rec_${e}_expanded"></div>
                    </td>
                    <td class="w2ui-grid-data-last"></td>
                </tr>`), n(this.box).find("#grid_" + this.name + "_frec_" + a).after(`<tr id="grid_${this.name}_frec_${e}_expanded_row" class="w2ui-expanded-row">
                    ${this.show.lineNumbers ? '<td class="w2ui-col-number"></td>' : ""}
                    <td class="w2ui-grid-data w2ui-expanded1" colspan="100">
                       <div id="grid_${this.name}_frec_${e}_expanded"></div>
                    </td>
                </tr>`), (l = this.trigger("expand", { target: this.name, recid: e, box_id: "grid_" + this.name + "_rec_" + e + "_expanded", fbox_id: "grid_" + this.name + "_frec_" + e + "_expanded" })).isCancelled === true) return n(this.box).find("#grid_" + this.name + "_rec_" + a + "_expanded_row").remove(), n(this.box).find("#grid_" + this.name + "_frec_" + a + "_expanded_row").remove(), false;
      s = n(this.box).find("#grid_" + this.name + "_rec_" + e + "_expanded"), r = n(this.box).find("#grid_" + this.name + "_frec_" + e + "_expanded"), t = ((_a = s.find(":scope div:first-child")[0]) == null ? void 0 : _a.clientHeight) ?? 50, s[0].clientHeight < t && s.css({ height: t + "px" }), r[0].clientHeight < t && r.css({ height: t + "px" }), n(this.box).find("#grid_" + this.name + "_rec_" + a).attr("expanded", "yes").addClass("w2ui-expanded"), n(this.box).find("#grid_" + this.name + "_frec_" + a).attr("expanded", "yes").addClass("w2ui-expanded"), n(this.box).find("#grid_" + this.name + "_cell_" + this.get(e, true) + "_expand div").html("-"), i.w2ui.expanded = true, l.finish(), this.resizeRecords();
    }
    return true;
  }
  collapse(e, t) {
    var s = this.get(e, true);
    let i = this.records[s], a = (i.w2ui = i.w2ui || {}, u.escapeId(e));
    var r = i.w2ui.children;
    let l;
    if (Array.isArray(r)) {
      if (i.w2ui.expanded !== true || (l = this.trigger("collapse", { target: this.name, recid: e })).isCancelled === true) return false;
      (function c(d) {
        d.w2ui.expanded = false;
        for (let p = 0; p < d.w2ui.children.length; p++) {
          let f = d.w2ui.children[p];
          f.w2ui.expanded && c(f);
        }
      })(i);
      var h = [];
      for (let c = i; c != null; c = this.get(c.w2ui.parent_recid)) h.push(c.w2ui.parent_recid);
      r = s + 1;
      let o = r;
      for (; !(this.records.length <= o + 1 || this.records[o + 1].w2ui == null || 0 <= h.indexOf(this.records[o + 1].w2ui.parent_recid)); ) o++;
      this.records.splice(r, o - r + 1), this.total !== -1 && (this.total -= o - r + 1), (typeof this.url != "object" ? this.url : this.url.get) || 0 < this.searchData.length && this.localSearch(true), t !== true && this.refresh(), l.finish();
    } else {
      if (n(this.box).find("#grid_" + this.name + "_rec_" + a + "_expanded_row").length === 0 || this.show.expandColumn !== true || (l = this.trigger("collapse", { target: this.name, recid: e, box_id: "grid_" + this.name + "_rec_" + e + "_expanded", fbox_id: "grid_" + this.name + "_frec_" + e + "_expanded" })).isCancelled === true) return false;
      n(this.box).find("#grid_" + this.name + "_rec_" + a).removeAttr("expanded").removeClass("w2ui-expanded"), n(this.box).find("#grid_" + this.name + "_frec_" + a).removeAttr("expanded").removeClass("w2ui-expanded"), n(this.box).find("#grid_" + this.name + "_cell_" + this.get(e, true) + "_expand div").html("+"), n(this.box).find("#grid_" + this.name + "_rec_" + a + "_expanded").css("height", "0px"), n(this.box).find("#grid_" + this.name + "_frec_" + a + "_expanded").css("height", "0px"), setTimeout(() => {
        n(this.box).find("#grid_" + this.name + "_rec_" + a + "_expanded_row").remove(), n(this.box).find("#grid_" + this.name + "_frec_" + a + "_expanded_row").remove(), i.w2ui.expanded = false, l.finish(), this.resizeRecords();
      }, 300);
    }
    return true;
  }
  sort(e, t, s) {
    var i = this.trigger("sort", { target: this.name, field: e, direction: t, multiField: s });
    if (i.isCancelled !== true) {
      if (e != null) {
        let a = this.sortData.length;
        for (let r = 0; r < this.sortData.length; r++) if (this.sortData[r].field == e) {
          a = r;
          break;
        }
        t == null && (t = this.sortData[a] != null && (this.sortData[a].direction == null && (this.sortData[a].direction = ""), this.sortData[a].direction.toLowerCase() === "asc") ? "desc" : "asc"), this.multiSort === false && (this.sortData = [], a = 0), s != 1 && (this.sortData = [], a = 0), this.sortData[a] == null && (this.sortData[a] = {}), this.sortData[a].field = e, this.sortData[a].direction = t;
      } else this.sortData = [];
      (typeof this.url != "object" ? this.url : this.url.get) ? (i.finish({ direction: t }), this.last.fetch.offset = 0, this.reload()) : (this.localSort(false, true), 0 < this.searchData.length && this.localSearch(true), this.last.scrollTop = 0, n(this.box).find(`#grid_${this.name}_records`).prop("scrollTop", 0), i.finish({ direction: t }), this.refresh());
    }
  }
  copy(e, t) {
    if (u.isPlainObject(e)) return e.finish(), e.text;
    var s = this.getSelection();
    if (s.length === 0) return "";
    let i = "";
    if (typeof s[0] == "object") {
      let c = s[0].column, d = s[0].column;
      var a = [];
      for (let p = 0; p < s.length; p++) s[p].column < c && (c = s[p].column), s[p].column > d && (d = s[p].column), a.indexOf(s[p].index) == -1 && a.push(s[p].index);
      a.sort((p, f) => p - f);
      for (let p = 0; p < a.length; p++) {
        var r = a[p];
        for (let f = c; f <= d; f++) this.columns[f].hidden !== true && (i += this.getCellCopy(r, f) + "	");
        i = i.substr(0, i.length - 1), i += `
`;
      }
    } else {
      for (let c = 0; c < this.columns.length; c++) {
        var l = this.columns[c];
        if (l.hidden !== true) {
          let d = l.text || l.field;
          l.text && l.text.length < 3 && l.tooltip && (d = l.tooltip), i += '"' + u.stripTags(d) + '"	';
        }
      }
      i = i.substr(0, i.length - 1), i += `
`;
      for (let c = 0; c < s.length; c++) {
        var h = this.get(s[c], true);
        for (let d = 0; d < this.columns.length; d++) this.columns[d].hidden !== true && (i += '"' + this.getCellCopy(h, d) + '"	');
        i = i.substr(0, i.length - 1), i += `
`;
      }
    }
    i = i.substr(0, i.length - 1);
    let o;
    return e == null ? (o = this.trigger("copy", { target: this.name, text: i, cut: t.keyCode == 88, originalEvent: t })).isCancelled === true ? "" : (i = o.detail.text, o.finish(), i) : e === false ? (o = this.trigger("copy", { target: this.name, text: i, cut: t.keyCode == 88, originalEvent: t })).isCancelled === true ? "" : (i = o.detail.text, o) : void 0;
  }
  getCellCopy(e, t) {
    return u.stripTags(this.getCellHTML(e, t));
  }
  paste(e, o) {
    var s = this.getSelection();
    let i = this.get(s[0].recid, true);
    var a, r, l, h = s[0].column, o = this.trigger("paste", { target: this.name, text: e, index: i, column: h, originalEvent: o });
    if (o.isCancelled !== true) {
      if (e = o.detail.text, this.selectType == "row" || s.length === 0) console.log("ERROR: You can paste only if grid.selectType = 'cell' and when at least one cell selected.");
      else {
        if (typeof e != "object") {
          var c = [];
          e = e.split(`
`);
          for (let m = 0; m < e.length; m++) {
            var d = e[m].split("	");
            let b = 0;
            var p = this.records[i], f = [];
            if (p != null) {
              for (let v = 0; v < d.length; v++) this.columns[h + b] && (a = p, r = this.columns[h + b].field, l = d[v], a.w2ui = a.w2ui ?? {}, a.w2ui.changes = a.w2ui.changes || {}, a.w2ui.changes[r] = l, f.push(h + b), b++);
              for (let v = 0; v < f.length; v++) c.push({ recid: p.recid, column: f[v] });
              i++;
            }
          }
          this.selectNone(true), this.select(c);
        } else this.selectNone(true), this.select([{ recid: this.records[i], column: h }]);
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
  update({ cells: e, fullCellRefresh: t, ignoreColumns: s } = {}) {
    var i = Date.now();
    let a = this;
    if (this.box == null) return 0;
    if (Array.isArray(e)) for (let d = 0; d < e.length; d++) {
      var r = e[d].index, l = e[d].column;
      if (!(r < 0)) if (r == null || l == null) console.log("ERROR: Wrong argument for grid.update({ cells }), cells should be [{ index: X, column: Y }, ...]");
      else {
        var h = this.records[r] ?? {};
        h.w2ui = h.w2ui ?? {}, h.w2ui._update = h.w2ui._update ?? { cells: [] };
        let p = h.w2ui._update.row1, f = h.w2ui._update.row2;
        p != null && p.isConnected && f != null && f.isColSelected || (p = this.box.querySelector(`#grid_${this.name}_rec_` + u.escapeId(h.recid)), f = this.box.querySelector(`#grid_${this.name}_frec_` + u.escapeId(h.recid)), h.w2ui._update.row1 = p, h.w2ui._update.row2 = f), c(h, p, f, r, l);
      }
    }
    else for (let d = this.last.range_start - 1; d <= this.last.range_end; d++) {
      let p = d;
      p = 0 < this.last.searchIds.length ? this.last.searchIds[d] : d;
      var o = this.records[p];
      if (!(p < 0 || o == null)) {
        o.w2ui = o.w2ui ?? {}, o.w2ui._update = o.w2ui._update ?? { cells: [] };
        let f = o.w2ui._update.row1, m = o.w2ui._update.row2;
        f != null && f.isConnected && m != null && m.isColSelected || (f = this.box.querySelector(`#grid_${this.name}_rec_` + u.escapeId(o.recid)), m = this.box.querySelector(`#grid_${this.name}_frec_` + u.escapeId(o.recid)), o.w2ui._update.row1 = f, o.w2ui._update.row2 = m);
        for (let b = 0; b < this.columns.length; b++) c(o, f, m, p, b);
      }
    }
    return Date.now() - i;
    function c(d, p, f, m, b) {
      var v = a.columns[b];
      if (!Array.isArray(s) || !s.includes(b) && !s.includes(v.field)) {
        let C = d.w2ui._update.cells[b];
        if (C != null && C.isConnected || (C = a.box.querySelector(`#grid_${a.name}_data_${m}_` + b), d.w2ui._update.cells[b] = C), C != null) {
          if (t) n(C).replace(a.getCellHTML(m, b, false)), C = a.box.querySelector(`#grid_${a.name}_data_${m}_` + b), d.w2ui._update.cells[b] = C;
          else {
            var g = C.children[0], { value: m, style: y, className: w } = a.getCellValue(m, b, false, true);
            if (g.innerHTML != m && (g.innerHTML = m), y != "" && C.style.cssText != y && (C.style.cssText = y), w != "") {
              let I = ["w2ui-grid-data"], E = [];
              g = w.split(" ").filter((T) => !!T), C.classList.forEach((T) => {
                I.includes(T) || E.push(T);
              }), C.classList.remove(...E), C.classList.add(...g);
            }
          }
          if (a.columns[b].style && a.columns[b].style != C.style.cssText && (C.style.cssText = a.columns[b].style ?? ""), d.w2ui.class != null) {
            if (typeof d.w2ui.class == "string") {
              let $ = ["w2ui-odd", "w2ui-even", "w2ui-record"], I = [];
              m = d.w2ui.class.split(" ").filter((E) => !!E), p && f && (p.classList.forEach((E) => {
                $.includes(E) || I.push(E);
              }), p.classList.remove(...I), p.classList.add(...m), f.classList.remove(...I), f.classList.add(...m));
            }
            if (u.isPlainObject(d.w2ui.class) && typeof d.w2ui.class[v.field] == "string") {
              let $ = ["w2ui-grid-data"], I = [];
              y = d.w2ui.class[v.field].split(" ").filter((E) => !!E), C.classList.forEach((E) => {
                $.includes(E) || I.push(E);
              }), C.classList.remove(...I), C.classList.add(...y);
            }
          }
          d.w2ui.style != null && (p && f && typeof d.w2ui.style == "string" && p.style.cssText !== d.w2ui.style && (p.style.cssText = "height: " + a.recordHeight + "px;" + d.w2ui.style, p.setAttribute("custom_style", d.w2ui.style), f.style.cssText = "height: " + a.recordHeight + "px;" + d.w2ui.style, f.setAttribute("custom_style", d.w2ui.style)), u.isPlainObject(d.w2ui.style)) && typeof d.w2ui.style[v.field] == "string" && C.style.cssText !== d.w2ui.style[v.field] && (C.style.cssText = d.w2ui.style[v.field]);
        }
      }
    }
  }
  refreshCell(a, i) {
    var s = this.get(a, true), i = this.getColumn(i, true), a = !this.records[s] || this.records[s].recid != a, r = n(this.box).find(`${a ? ".w2ui-grid-summary " : ""}#grid_${this.name}_data_${s}_` + i);
    return r.length != 0 && (r.replace(this.getCellHTML(s, i, a)), true);
  }
  refreshRow(e, t = null) {
    let s = n(this.box).find("#grid_" + this.name + "_frec_" + u.escapeId(e)), i = n(this.box).find("#grid_" + this.name + "_rec_" + u.escapeId(e));
    if (0 < s.length) {
      t == null && (t = this.get(e, true));
      var a = s.attr("line"), r = !this.records[t] || this.records[t].recid != e, l = typeof this.url != "object" ? this.url : this.url.get;
      if (0 < this.searchData.length && !l) for (let o = 0; o < this.last.searchIds.length; o++) this.last.searchIds[o] == t && (t = o);
      l = this.getRecordHTML(t, a, r), s.replace(l[0]), i.replace(l[1]);
      let h = this.records[t].w2ui ? this.records[t].w2ui.style : "";
      return typeof h == "string" && (s = n(this.box).find("#grid_" + this.name + "_frec_" + u.escapeId(e)), i = n(this.box).find("#grid_" + this.name + "_rec_" + u.escapeId(e)), s.attr("custom_style", h), i.attr("custom_style", h), s.hasClass("w2ui-selected") && (h = h.replace("background-color", "none")), s[0].style.cssText = "height: " + this.recordHeight + "px;" + h, i[0].style.cssText = "height: " + this.recordHeight + "px;" + h), r && this.resize(), true;
    }
    return false;
  }
  refresh() {
    var e = Date.now(), t = typeof this.url != "object" ? this.url : this.url.get;
    if (this.total <= 0 && !t && this.searchData.length === 0 && (this.total = this.records.length), this.box && (t = this.trigger("refresh", { target: this.name }), t.isCancelled !== true)) {
      this.show.header ? n(this.box).find(`#grid_${this.name}_header`).html(u.lang(this.header) + "&#160;").show() : n(this.box).find(`#grid_${this.name}_header`).hide(), this.show.toolbar ? n(this.box).find("#grid_" + this.name + "_toolbar").show() : n(this.box).find("#grid_" + this.name + "_toolbar").hide(), this.searchClose();
      var s = n(this.box).find("#grid_" + this.name + "_search_all");
      !this.multiSearch && this.last.field == "all" && 0 < this.searches.length && (this.last.field = this.searches[0].field, this.last.label = this.searches[0].label);
      for (let l = 0; l < this.searches.length; l++) this.searches[l].field == this.last.field && (this.last.label = this.searches[l].label);
      if (this.last.multi ? s.attr("placeholder", "[" + u.lang("Multiple Fields") + "]") : s.attr("placeholder", u.lang("Search") + " " + u.lang(this.last.label, true)), s.val() != this.last.search) {
        let l = this.last.search;
        var i = s._w2field;
        i && (l = i.format(l)), s.val(l);
      }
      this.refreshSearch(), this.refreshBody(), this.show.footer ? n(this.box).find(`#grid_${this.name}_footer`).html(this.getFooterHTML()).show() : n(this.box).find(`#grid_${this.name}_footer`).hide();
      var i = this.last.selection, s = 0 < this.records.length && i.indexes.length == this.records.length, i = 0 < i.indexes.length && this.searchData.length !== 0 && i.indexes.length == this.last.searchIds.length, a = (s || i ? n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true) : n(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.find({ "w2ui.expanded": true }, true, true));
      for (let l = 0; l < a.length; l++) {
        var r = this.records[a[l]].w2ui;
        r && !Array.isArray(r.children) && (r.expanded = false);
      }
      return this.markSearch && setTimeout(() => {
        var l = [];
        for (let c = 0; c < this.searchData.length; c++) {
          var h = this.searchData[c], o = this.getSearch(h.field);
          o && !o.hidden && (o = this.getColumn(h.field, true), l.push({ field: h.field, search: h.value, col: o }));
        }
        0 < l.length && l.forEach((c) => {
          var d = n(this.box).find('td[col="' + c.col + '"]:not(.w2ui-head)');
          u.marker(d, c.search);
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
      this.searchData.forEach((t, s) => {
        var i = this.getSearch(t.field, true), a = this.searches[i];
        let r;
        if (r = Array.isArray(t.value) ? `<span class="grid-search-count">${t.value.length}</span>` : a && a.type == "list" && t.text && t.text !== t.value ? ": " + t.text : ": " + t.value, a && a.type == "date") if (t.operator == "between") {
          let l = t.value[0], h = t.value[1];
          Number(l) === l && (l = u.formatDate(l)), Number(h) === h && (h = u.formatDate(h)), r = `: ${l} - ` + h;
        } else {
          let l = t.value, h = (Number(l) == l && (l = u.formatDate(l)), t.operator);
          (h = (h = h == "more" ? "since" : h) == "less" ? "before" : h).substr(0, 5) == "more:" && (h = "since"), r = `: ${h} ` + l;
        }
        e += `<span class="w2ui-action" data-click="searchFieldTooltip|${i}|${s}|this">
                    ${a ? a.label : ""}
                    ${r}
                    <span class="icon-chevron-down"></span>
                </span>`;
      }), e += `
                ${this.show.searchSave ? `<div class="grid-search-line"></div>
                       <button class="w2ui-btn grid-search-btn" data-click="searchSave">${u.lang("Save")}</button>
                      ` : ""}
                <button class="w2ui-btn grid-search-btn btn-remove"
                    data-click="searchReset">X</button>
            `, n(this.box).find(`#grid_${this.name}_searches`).html(e), n(this.box).find(`#grid_${this.name}_search_logic`).html(u.lang(this.last.logic == "AND" ? "All" : "Any"));
    } else n(this.box).find(".w2ui-grid-toolbar").css("height", this.last.toolbar_height + "px").find(".w2ui-grid-searches").remove();
    this.searchSelected ? (n(this.box).find(`#grid_${this.name}_search_all`).val(" ").prop("readOnly", true), n(this.box).find(`#grid_${this.name}_search_name`).show().find(".name-text").html(this.searchSelected.text)) : (n(this.box).find(`#grid_${this.name}_search_all`).prop("readOnly", false), n(this.box).find(`#grid_${this.name}_search_name`).hide().find(".name-text").html("")), u.bindEvents(n(this.box).find(`#grid_${this.name}_searches .w2ui-action, #grid_${this.name}_searches button`), this);
  }
  refreshBody() {
    this.scroll();
    var t = this.getRecordsHTML(), e = this.getColumnsHTML(), t = '<div id="grid_' + this.name + '_frecords" class="w2ui-grid-frecords" style="margin-bottom: ' + (u.scrollBarSize() - 1) + 'px;">' + t[0] + '</div><div id="grid_' + this.name + '_records" class="w2ui-grid-records">' + t[1] + '</div><div id="grid_' + this.name + '_scroll1" class="w2ui-grid-scroll1" style="height: ' + u.scrollBarSize() + 'px"></div><div id="grid_' + this.name + '_fcolumns" class="w2ui-grid-fcolumns">    <table><tbody>' + e[0] + '</tbody></table></div><div id="grid_' + this.name + '_columns" class="w2ui-grid-columns">    <table><tbody>' + e[1] + `</tbody></table></div><div class="w2ui-intersection-marker" style="display: none; height: ${this.recordHeight - 5}px">
               <div class="top-marker"></div>
               <div class="bottom-marker"></div>
            </div>`;
    let s = n(this.box).find(`#grid_${this.name}_body`, this.box).html(t);
    e = n(this.box).find(`#grid_${this.name}_records`, this.box), t = n(this.box).find(`#grid_${this.name}_frecords`, this.box), this.selectType == "row" && (e.on("mouseover mouseout", { delegate: "tr" }, (i) => {
      var a = n(i.delegate).attr("recid");
      n(this.box).find(`#grid_${this.name}_frec_` + u.escapeId(a)).toggleClass("w2ui-record-hover", i.type == "mouseover");
    }), t.on("mouseover mouseout", { delegate: "tr" }, (i) => {
      var a = n(i.delegate).attr("recid");
      n(this.box).find(`#grid_${this.name}_rec_` + u.escapeId(a)).toggleClass("w2ui-record-hover", i.type == "mouseover");
    })), u.isIOS ? e.append(t).on("click", { delegate: "tr" }, (i) => {
      var a = n(i.delegate).attr("recid");
      this.dblClick(a, i);
    }) : e.add(t).on("click", { delegate: "tr" }, (i) => {
      var a = n(i.delegate).attr("recid");
      a != "-none-" && this.click(a, i);
    }).on("contextmenu", { delegate: "tr" }, (i) => {
      var a = n(i.delegate).attr("recid"), r = n(i.target).closest("td"), r = parseInt(r.attr("col") ?? -1);
      this.showContextMenu(a, r, i);
    }).on("mouseover", { delegate: "tr" }, (i) => {
      this.last.rec_out = false;
      let a = n(i.delegate).attr("index"), r = n(i.delegate).attr("recid");
      a !== this.last.rec_over && (this.last.rec_over = a, setTimeout(() => {
        delete this.last.rec_out, this.trigger("mouseEnter", { target: this.name, originalEvent: i, index: a, recid: r }).finish();
      }));
    }).on("mouseout", { delegate: "tr" }, (i) => {
      let a = n(i.delegate).attr("index"), r = n(i.delegate).attr("recid");
      this.last.rec_out = true, setTimeout(() => {
        let l = () => {
          this.trigger("mouseLeave", { target: this.name, originalEvent: i, index: a, recid: r }).finish();
        };
        a !== this.last.rec_over && l(), setTimeout(() => {
          this.last.rec_out && (delete this.last.rec_out, delete this.last.rec_over, l());
        });
      });
    }), s.data("scroll", { lastDelta: 0, lastTime: 0 }).find(".w2ui-grid-frecords").on("mousewheel DOMMouseScroll ", (l) => {
      l.preventDefault();
      var a = s.data("scroll"), r = s.find(".w2ui-grid-records"), l = typeof l.wheelDelta != null ? -l.wheelDelta : l.detail || l.deltaY, h = r.prop("scrollTop");
      a.lastDelta += l, l = Math.round(a.lastDelta), s.data("scroll", a), r.get(0).scroll({ top: h + l, behavior: "smooth" });
    }), e.off(".body-global").on("scroll.body-global", { delegate: ".w2ui-grid-records" }, (i) => {
      this.scroll(i);
    }), n(this.box).find(".w2ui-grid-body").off(".body-global").on("click.body-global dblclick.body-global contextmenu.body-global", { delegate: "td.w2ui-head" }, (i) => {
      var a = n(i.delegate).attr("col"), r = this.columns[a] ?? { field: a };
      switch (i.type) {
        case "click":
          this.columnClick(r.field, i);
          break;
        case "dblclick":
          this.columnDblClick(r.field, i);
          break;
        case "contextmenu":
          this.columnContextMenu(r.field, i);
      }
    }).on("mouseover.body-global", { delegate: ".w2ui-col-header" }, (i) => {
      let a = n(i.delegate).parent().attr("col");
      this.columnTooltipShow(a, i), n(i.delegate).off(".tooltip").on("mouseleave.tooltip", () => {
        this.columnTooltipHide(a, i);
      });
    }).on("click.body-global", { delegate: "input.w2ui-select-all" }, (i) => {
      i.delegate.checked ? this.selectAll() : this.selectNone(), i.stopPropagation(), clearTimeout(this.last.kbd_timer);
    }).on("click.body-global", { delegate: ".w2ui-show-children, .w2ui-col-expand" }, (i) => {
      i.stopPropagation(), this.toggle(n(i.target).parents("tr").attr("recid"));
    }).on("click.body-global mouseover.body-global", { delegate: ".w2ui-info" }, (i) => {
      var _a, _b;
      var a = n(i.delegate).closest("td"), r = a.parent(), l = this.columns[a.attr("col")], h = r.parents(".w2ui-grid-body").hasClass("w2ui-grid-summary");
      ["mouseenter", "mouseover"].includes((_b = (_a = l.info) == null ? void 0 : _a.showOn) == null ? void 0 : _b.toLowerCase()) && i.type == "mouseover" ? this.showBubble(r.attr("index"), a.attr("col"), h).then(() => {
        n(i.delegate).off(".tooltip").on("mouseleave.tooltip", () => {
          F.hide(this.name + "-bubble");
        });
      }) : i.type == "click" && (F.hide(this.name + "-bubble"), this.showBubble(r.attr("index"), a.attr("col"), h));
    }).on("mouseover.body-global", { delegate: ".w2ui-clipboard-copy" }, (i) => {
      if (!i.delegate._tooltipShow) {
        let r = n(i.delegate).parent(), l = r.parent();
        var a = this.columns[r.attr("col")];
        let h = l.parents(".w2ui-grid-body").hasClass("w2ui-grid-summary");
        F.show({ name: this.name + "-bubble", anchor: i.delegate, html: u.lang(typeof a.clipboardCopy == "string" ? a.clipboardCopy : "Copy to clipboard"), position: "top|bottom", offsetY: -2 }).hide((o) => {
          i.delegate._tooltipShow = false, n(i.delegate).off(".tooltip");
        }), n(i.delegate).off(".tooltip").on("mouseleave.tooltip", (o) => {
          F.hide(this.name + "-bubble");
        }).on("click.tooltip", (o) => {
          o.stopPropagation(), F.update(this.name + "-bubble", u.lang("Copied")), this.clipboardCopy(l.attr("index"), r.attr("col"), h);
        }), i.delegate._tooltipShow = true;
      }
    }).on("click.body-global", { delegate: ".w2ui-editable-checkbox" }, (i) => {
      var a = n(i.delegate).data();
      this.editChange.call(this, i.delegate, a.changeind, a.colind, i), this.updateToolbar();
    }), this.records.length === 0 && this.msgEmpty ? n(this.box).find(`#grid_${this.name}_body`).append(`<div id="grid_${this.name}_empty_msg" class="w2ui-grid-empty-msg"><div>${u.lang(this.msgEmpty)}</div></div>`) : 0 < n(this.box).find(`#grid_${this.name}_empty_msg`).length && n(this.box).find(`#grid_${this.name}_empty_msg`).remove(), 0 < this.summary.length ? (t = this.getSummaryHTML(), n(this.box).find(`#grid_${this.name}_fsummary`).html(t[0]).show(), n(this.box).find(`#grid_${this.name}_summary`).html(t[1]).show()) : (n(this.box).find(`#grid_${this.name}_fsummary`).hide(), n(this.box).find(`#grid_${this.name}_summary`).hide());
  }
  render(e) {
    var t = Date.now();
    let s = this;
    typeof e == "string" && (e = n(e).get(0));
    var i = this.trigger("render", { target: this.name, box: e ?? this.box });
    if (i.isCancelled !== true && (e != null && (0 < n(this.box).find(`#grid_${this.name}_body`).length && n(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-grid w2ui-inactive").html(""), this.box = e), this.box)) {
      let l = function(c) {
        var _a, _b;
        if (c.target.tagName) {
          var d = s.last.move;
          if (d && ["select", "select-column"].indexOf(d.type) != -1 && (d.divX = c.screenX - d.x, d.divY = c.screenY - d.y, !(Math.abs(d.divX) <= 1 && Math.abs(d.divY) <= 1))) if (s.last.cancelClick = true, s.reorderRows == 1 && s.last.move.reorder) {
            let $ = n(c.target).parents("tr").attr("recid");
            ($ = $ == "-none-" ? "bottom" : $) != d.from && (f = n(s.box).find("#grid_" + s.name + "_rec_" + $), n(s.box).find(".insert-before"), f.addClass("insert-before"), d.lastY = c.screenY, d.to = $, f = { top: (_a = f.get(0)) == null ? void 0 : _a.offsetTop, left: (_b = f.get(0)) == null ? void 0 : _b.offsetLeft }, n(s.box).find("#grid_" + s.name + "_ghost_line").css({ top: f.top + "px", left: d.pos.left + "px", "border-top": "2px solid #769EFC" })), n(s.box).find("#grid_" + s.name + "_ghost").css({ top: d.pos.top + d.divY + "px", left: d.pos.left + "px" });
          } else {
            d.start && d.recid && (s.selectNone(), d.start = false);
            var p = [], f = (c.target.tagName.toUpperCase() == "TR" ? n(c.target) : n(c.target).parents("tr")).attr("recid");
            if (f == null) {
              if (s.selectType != "row" && (!s.last.move || s.last.move.type != "select")) {
                var m = parseInt(n(c.target).parents("td").attr("col"));
                if (isNaN(m)) s.removeRange("column-selection"), n(s.box).find(".w2ui-grid-columns .w2ui-col-header, .w2ui-grid-fcolumns .w2ui-col-header").removeClass("w2ui-col-selected"), n(s.box).find(".w2ui-col-number").removeClass("w2ui-row-selected"), delete d.colRange;
                else {
                  let $ = m + "-" + m;
                  d.column < m && ($ = d.column + "-" + m);
                  var b = [], v = ($ = d.column > m ? m + "-" + d.column : $).split("-");
                  for (let I = parseInt(v[0]); I <= parseInt(v[1]); I++) b.push(I);
                  if (d.colRange != $ && (r = s.trigger("columnSelect", { target: s.name, columns: b })).isCancelled !== true) {
                    d.colRange == null && s.selectNone();
                    var g = $.split("-");
                    n(s.box).find(".w2ui-grid-columns .w2ui-col-header, .w2ui-grid-fcolumns .w2ui-col-header").removeClass("w2ui-col-selected");
                    for (let I = parseInt(g[0]); I <= parseInt(g[1]); I++) n(s.box).find("#grid_" + s.name + "_column_" + I + " .w2ui-col-header").addClass("w2ui-col-selected");
                    n(s.box).find(".w2ui-col-number").not(".w2ui-head").addClass("w2ui-row-selected"), d.colRange = $, s.removeRange("column-selection"), s.addRange({ name: "column-selection", range: [{ recid: s.records[0].recid, column: g[0] }, { recid: s.records[s.records.length - 1].recid, column: g[1] }], style: "background-color: rgba(90, 145, 234, 0.1)" });
                  }
                }
              }
            } else {
              let $ = s.get(d.recid, true);
              if (!($ == null || s.records[$] && s.records[$].recid != d.recid)) {
                let I = s.get(f, true);
                if (I != null) {
                  let E = parseInt(d.column), T = parseInt((c.target.tagName.toUpperCase() == "TD" ? n(c.target) : n(c.target).parents("td")).attr("col"));
                  isNaN(E) && isNaN(T) && (E = 0, T = s.columns.length - 1), $ > I && (m = $, $ = I, I = m);
                  var y, f = "ind1:" + $ + ",ind2;" + I + ",col1:" + E + ",col2:" + T;
                  if (d.range != f) {
                    d.range = f;
                    for (let k = $; k <= I; k++) if (!(0 < s.last.searchIds.length && s.last.searchIds.indexOf(k) == -1)) if (s.selectType != "row") {
                      E > T && (y = E, E = T, T = y);
                      for (let _ = E; _ <= T; _++) s.columns[_].hidden || p.push({ recid: s.records[k].recid, column: parseInt(_) });
                    } else p.push(s.records[k].recid);
                    if (s.selectType != "row") {
                      var w = s.getSelection();
                      let k = [];
                      for (let _ = 0; _ < p.length; _++) {
                        let S = false;
                        for (let D = 0; D < w.length; D++) p[_].recid == w[D].recid && p[_].column == w[D].column && (S = true);
                        S || k.push({ recid: p[_].recid, column: p[_].column });
                      }
                      s.select(k), k = [];
                      for (let _ = 0; _ < w.length; _++) {
                        let S = false;
                        for (let D = 0; D < p.length; D++) p[D].recid == w[_].recid && p[D].column == w[_].column && (S = true);
                        S || k.push({ recid: w[_].recid, column: w[_].column });
                      }
                      s.unselect(k);
                    } else if (s.multiSelect) {
                      var C = s.getSelection();
                      for (let k = 0; k < p.length; k++) C.indexOf(p[k]) == -1 && s.select(p[k]);
                      for (let k = 0; k < C.length; k++) p.indexOf(C[k]) == -1 && s.unselect(C[k]);
                    }
                  }
                }
              }
            }
          }
        }
      }, h = function(c) {
        var d = s.last.move;
        if (setTimeout(() => {
          delete s.last.cancelClick;
        }, 1), !n(c.target).parents().hasClass(".w2ui-head") && !n(c.target).hasClass(".w2ui-head")) {
          if (d && ["select", "select-column"].indexOf(d.type) != -1) {
            if (d.colRange != null && r.isCancelled !== true) {
              var p = d.colRange.split("-"), f = [];
              for (let v = 0; v < s.records.length; v++) {
                var m = [];
                for (let g = parseInt(p[0]); g <= parseInt(p[1]); g++) m.push(g);
                f.push({ recid: s.records[v].recid, column: m });
              }
              s.removeRange("column-selection"), r.finish(), s.select(f);
            }
            if (s.reorderRows == 1 && s.last.move.reorder) if (d.to != null) {
              if (c = s.trigger("reorderRow", { target: s.name, recid: d.from, moveBefore: d.to }), c.isCancelled === true) return o(), void delete s.last.move;
              var b = s.get(d.from, true);
              let v = s.get(d.to, true);
              d.to == "bottom" && (v = s.records.length), d = s.records[b], b != null && v != null && (s.records.splice(b, 1), b > v ? s.records.splice(v, 0, d) : s.records.splice(v - 1, 0, d)), s.sortData = [], n(s.box).find(`#grid_${s.name}_columns .w2ui-col-header`).removeClass("w2ui-col-sorted"), o(), c.finish();
            } else o();
          }
          delete s.last.move, n(document).off(".w2ui-" + s.name);
        }
      }, o = function() {
        n(s.box).find(`#grid_${s.name}_ghost`).remove(), n(s.box).find(`#grid_${s.name}_ghost_line`).remove(), s.refresh(), delete s.last.move;
      };
      if (e = typeof this.url != "object" ? this.url : this.url.get, this.reset(true), !this.last.field) if (this.multiSearch && this.show.searchAll) this.last.field = "all", this.last.label = "All Fields";
      else {
        let c = 0;
        for (; c < this.searches.length && (this.searches[c].hidden || this.searches[c].simple === false); ) c++;
        c >= this.searches.length ? (this.last.field = "", this.last.label = "") : (this.last.field = this.searches[c].field, this.last.label = this.searches[c].label);
      }
      if (n(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-grid w2ui-inactive").html('<div class="w2ui-grid-box">    <div id="grid_' + this.name + '_header" class="w2ui-grid-header"></div>    <div id="grid_' + this.name + '_toolbar" class="w2ui-grid-toolbar"></div>    <div id="grid_' + this.name + '_body" class="w2ui-grid-body"></div>    <div id="grid_' + this.name + '_fsummary" class="w2ui-grid-body w2ui-grid-summary"></div>    <div id="grid_' + this.name + '_summary" class="w2ui-grid-body w2ui-grid-summary"></div>    <div id="grid_' + this.name + '_footer" class="w2ui-grid-footer"></div>    <textarea id="grid_' + this.name + '_focus" class="w2ui-grid-focus-input" ' + (this.tabIndex ? 'tabindex="' + this.tabIndex + '"' : "") + (u.isIOS ? "readonly" : "") + "></textarea></div>"), this.selectType != "row" && n(this.box).addClass("w2ui-ss"), 0 < n(this.box).length && (n(this.box)[0].style.cssText += this.style), this.initToolbar(), this.toolbar != null && this.toolbar.render(n(this.box).find("#grid_" + this.name + "_toolbar")[0]), this.last.toolbar_height = n(this.box).find(`#grid_${this.name}_toolbar`).prop("offsetHeight"), this.last.field && this.last.field != "all") {
        let c = this.searchData;
        setTimeout(() => {
          this.searchInitInput(this.last.field, c.length == 1 ? c[0].value : null);
        }, 1);
      }
      n(this.box).find(`#grid_${this.name}_footer`).html(this.getFooterHTML()), this.last.state || (this.last.state = this.stateSave(true)), this.stateRestore(), e && (this.clear(), this.refresh());
      let a = false;
      for (let c = 0; c < this.searches.length; c++) if (this.searches[c].hidden) {
        a = true;
        break;
      }
      a ? (this.searchReset(false), e || setTimeout(() => {
        this.searchReset();
      }, 1)) : this.reload(), n(this.box).find(`#grid_${this.name}_focus`).on("focus", (c) => {
        clearTimeout(this.last.kbd_timer), this.hasFocus || this.focus();
      }).on("blur", (c) => {
        clearTimeout(this.last.kbd_timer), this.last.kbd_timer = setTimeout(() => {
          this.hasFocus && this.blur();
        }, 100);
      }).on("paste", (c) => {
        var d = c.clipboardData || null;
        if (d) {
          let m = d.items, b = [];
          for (var p in m = m.length == 2 && (m = m.length == 2 && m[1].kind == "file" ? [m[1]] : m).length == 2 && m[0].type == "text/plain" && m[1].type == "text/html" ? [m[1]] : m) if (p = m[p], p.kind === "file") {
            var f = p.getAsFile();
            b.push({ kind: "file", data: f });
          } else if (p.kind === "string" && (p.type === "text/plain" || p.type === "text/html")) {
            c.preventDefault();
            let v = d.getData("text/plain");
            v.indexOf("\r") != -1 && v.indexOf(`
`) == -1 && (v = v.replace(/\r/g, `
`)), b.push({ kind: p.type == "text/html" ? "html" : "text", data: v });
          }
          b.length === 1 && b[0].kind != "file" && (b = b[0].data), ie[this.name].paste(b, c), c.preventDefault();
        }
      }).on("keydown", function(c) {
        ie[s.name].keydown.call(ie[s.name], c);
      });
      let r;
      return n(this.box).off("mousedown.mouseStart").on("mousedown.mouseStart", function(c) {
        if (c.which == 1 && (s.last.userSelect == "text" && (s.last.userSelect = "", n(s.box).find(".w2ui-grid-body").css("user-select", "none")), !(s.selectType == "row" && (n(c.target).parents().hasClass("w2ui-head") || n(c.target).hasClass("w2ui-head")) || s.last.move && s.last.move.type == "expand"))) {
          if (c.altKey) n(s.box).find(".w2ui-grid-body").css("user-select", "text"), s.selectNone(), s.last.move = { type: "text-select" }, s.last.userSelect = "text";
          else {
            let g = c.target;
            var d = { x: c.offsetX - 10, y: c.offsetY - 10 };
            let y = false;
            for (; g && (!g.classList || !g.classList.contains("w2ui-grid")); ) g.tagName && g.tagName.toUpperCase() == "TD" && (y = true), g.tagName && g.tagName.toUpperCase() != "TR" && y == 1 && (d.x += g.offsetLeft, d.y += g.offsetTop), g = g.parentNode;
            s.last.move = { x: c.screenX, y: c.screenY, divX: 0, divY: 0, focusX: d.x, focusY: d.y, recid: n(c.target).parents("tr").attr("recid"), column: parseInt((c.target.tagName.toUpperCase() == "TD" ? n(c.target) : n(c.target).parents("td")).attr("col")), type: "select", ghost: false, start: true }, s.last.move.recid == null && (s.last.move.type = "select-column");
            let w = c.target, C = n(s.box).find("#grid_" + s.name + "_focus");
            if (s.last.move) {
              let $ = s.last.move.focusX, I = s.last.move.focusY;
              var p = n(w).parents("table").parent();
              (p.hasClass("w2ui-grid-records") || p.hasClass("w2ui-grid-frecords") || p.hasClass("w2ui-grid-columns") || p.hasClass("w2ui-grid-fcolumns") || p.hasClass("w2ui-grid-summary")) && ($ = s.last.move.focusX - n(s.box).find("#grid_" + s.name + "_records").prop("scrollLeft"), I = s.last.move.focusY - n(s.box).find("#grid_" + s.name + "_records").prop("scrollTop")), (n(w).hasClass("w2ui-grid-footer") || 0 < n(w).parents("div.w2ui-grid-footer").length) && (I = n(s.box).find("#grid_" + s.name + "_footer").get(0).offsetTop), p.hasClass("w2ui-scroll-wrapper") && p.parent().hasClass("w2ui-toolbar") && ($ = s.last.move.focusX - p.prop("scrollLeft")), C.css({ left: $ - 10, top: I });
            }
            setTimeout(() => {
              var _a;
              s.last.inEditMode || (["INPUT", "TEXTAREA", "SELECT"].includes(w.tagName) ? w.focus() : C.get(0) !== document.active && ((_a = C.get(0)) == null ? void 0 : _a.focus({ preventScroll: true })));
            }, 50), s.multiSelect || s.reorderRows || s.last.move.type != "drag" || delete s.last.move;
          }
          if (s.reorderRows == 1) {
            let g = c.target;
            var f, m, b, v;
            g.tagName.toUpperCase() != "TD" && (g = n(g).parents("td")[0]), n(g).hasClass("w2ui-col-number") || n(g).hasClass("w2ui-col-order") ? (s.selectNone(), s.last.move.reorder = true, p = n(s.box).find(".w2ui-even.w2ui-empty-record").css("background-color"), f = n(s.box).find(".w2ui-odd.w2ui-empty-record").css("background-color"), n(s.box).find(".w2ui-even td").filter(":not(.w2ui-col-number)").css("background-color", p), n(s.box).find(".w2ui-odd td").filter(":not(.w2ui-col-number)").css("background-color", f), f = s.last.move, m = n(s.box).find(".w2ui-grid-records"), f.ghost || (b = n(s.box).find(`#grid_${s.name}_rec_` + f.recid), v = b.parents("table").find("tr:first-child").get(0).cloneNode(true), f.offsetY = c.offsetY, f.from = f.recid, f.pos = { top: b.get(0).offsetTop - 1, left: b.get(0).offsetLeft }, f.ghost = n(b.get(0).cloneNode(true)), f.ghost.removeAttr("id"), f.ghost.find("td").css({ "border-top": "1px solid silver", "border-bottom": "1px solid silver" }), b.find("td").remove(), b.append(`<td colspan="1000"><div class="w2ui-reorder-empty" style="height: ${s.recordHeight - 2}px"></div></td>`), m.append('<div id="grid_' + s.name + '_ghost_line" style="position: absolute; z-index: 999999; pointer-events: none; width: 100%;"></div>'), m.append('<table id="grid_' + s.name + '_ghost" style="position: absolute; z-index: 999998; opacity: 0.9; pointer-events: none;"></table>'), n(s.box).find("#grid_" + s.name + "_ghost").append(v).append(f.ghost)), n(s.box).find("#grid_" + s.name + "_ghost").css({ top: f.pos.top + "px", left: f.pos.left + "px" })) : s.last.move.reorder = false;
          }
          n(document).on("mousemove.w2ui-" + s.name, l).on("mouseup.w2ui-" + s.name, h), c.stopPropagation();
        }
      }), this.updateToolbar(), i.finish(), this.last.observeResize = new ResizeObserver(() => {
        this.resize();
      }), this.last.observeResize.observe(this.box), Date.now() - t;
    }
  }
  destroy() {
    var _a;
    var e = this.trigger("destroy", { target: this.name });
    e.isCancelled !== true && (n(this.box).off(), typeof this.toolbar == "object" && this.toolbar.destroy && this.toolbar.destroy(), 0 < n(this.box).find(`#grid_${this.name}_body`).length && n(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-grid w2ui-inactive").html(""), (_a = this.last.observeResize) == null ? void 0 : _a.disconnect(), delete ie[this.name], e.finish());
  }
  initColumnOnOff() {
    var e, t = [{ id: "line-numbers", text: "Line #", checked: this.show.lineNumbers }];
    for (let a = 0; a < this.columns.length; a++) {
      var s = this.columns[a];
      let r = this.columns[a].text;
      s.hideable !== false && (r = (r = !r && this.columns[a].tooltip ? this.columns[a].tooltip : r) || "- column " + (parseInt(a) + 1) + " -", t.push({ id: s.field, text: u.stripTags(r), checked: !s.hidden }));
    }
    ((typeof this.url != "object" ? this.url : this.url.get) && this.show.skipRecords || this.show.saveRestoreState) && t.push({ text: "--" }), this.show.skipRecords && (e = u.lang("Skip") + `<input id="${this.name}_skip" type="text" class="w2ui-input w2ui-grid-skip" value="${this.offset}">` + u.lang("records"), t.push({ id: "w2ui-skip", text: e, group: false, icon: "w2ui-icon-empty" })), this.show.saveRestoreState && t.push({ id: "w2ui-stateSave", text: u.lang("Save Grid State"), icon: "w2ui-icon-empty", group: false }, { id: "w2ui-stateReset", text: u.lang("Restore Default State"), icon: "w2ui-icon-empty", group: false });
    let i = [];
    return t.forEach((a) => {
      a.text = u.lang(a.text), a.checked && i.push(a.id);
    }), this.toolbar.set("w2ui-column-on-off", { selected: i, items: t }), t;
  }
  initColumnDrag(e) {
    if (this.columnGroups && this.columnGroups.length) throw "Draggable columns are not currently supported with column groups.";
    let t = this, s = { pressed: false, targetPos: null, columnHead: null }, i = (l, h) => {
      var o = ["w2ui-col-number", "w2ui-col-expand", "w2ui-col-select"];
      h !== true && o.push("w2ui-head-last");
      for (let c = 0; c < o.length; c++) if (n(l).closest(".w2ui-head").hasClass(o[c])) return true;
      return false;
    };
    function a(l) {
      var h, o, c, d;
      s.pressed && s.columnHead && (h = l.pageX, o = l.pageY, i(l.target, true) || (l = l, n(l.target).closest("td").length != 0 && (d = n(t.box).find(".w2ui-grid-body").get(0).getBoundingClientRect(), c = n(l.target).closest("td").get(0).getBoundingClientRect(), n(t.box).find(".w2ui-intersection-marker").show().css({ left: c.left - d.left + "px" }), c = n(l.target).closest("td"), s.targetPos = c.hasClass("w2ui-head-last") ? t.columns.length : parseInt(c.attr("col")))), d = h, l = o, n(s.ghost).css({ left: d - 10 + "px", top: l - 10 + "px" }).show());
    }
    function r(l) {
      if (s.pressed && s.columnHead) {
        s.pressed = false;
        var h, o, c = () => {
          var d = n(t.box).find(".w2ui-grid-ghost");
          n(t.box).find(".w2ui-intersection-marker").hide(), n(s.ghost).remove(), d.remove(), n(document).off(".colDrag"), s = {};
        };
        if (l.pageX == s.initialX && l.pageY == s.initialY) t.columnClick(t.columns[s.originalPos].field, l), c();
        else {
          if ((l = t.trigger("columnDragEnd", { originalEvent: l, target: s.columnHead[0], dragData: s })).isCancelled === true) return false;
          h = t.columns[s.originalPos], o = t.columns, s.originalPos != s.targetPos && s.targetPos != null && (o.splice(s.targetPos, 0, u.clone(h)), o.splice(o.indexOf(h), 1)), c(), t.refresh(), l.finish({ targetColumn: NaN });
        }
      }
    }
    return n(t.box).off(".colDrag").on("mousedown.colDrag", function(l) {
      if (!s.pressed && s.numberPreColumnsPresent !== 0 && l.button === 0) {
        var h, o;
        if (n(l.target).parents().hasClass("w2ui-head") && !i(l.target)) {
          if (s.pressed = true, s.initialX = l.pageX, s.initialY = l.pageY, s.numberPreColumnsPresent = n(t.box).find(".w2ui-head.w2ui-col-number, .w2ui-head.w2ui-col-expand, .w2ui-head.w2ui-col-select").length, s.columnHead = c = n(l.target).closest(".w2ui-head"), s.originalPos = o = parseInt(c.attr("col"), 10), (o = t.trigger("columnDragStart", { originalEvent: l, origColumnNumber: o, target: c[0] })).isCancelled === true) return false;
          h = s.columns = n(t.box).find(".w2ui-head:not(.w2ui-head-last)"), n(document).on("mouseup.colDrag", r), n(document).on("mousemove.colDrag", a);
          var c = t.columns[s.originalPos], c = u.lang(typeof c.text == "function" ? c.text(c) : c.text);
          s.ghost = n.html(`<span col="${s.originalPos}">${c}</span>`)[0], n(document.body).append(s.ghost), n(s.ghost).css({ display: "none", left: l.pageX, top: l.pageY, opacity: 1, margin: "3px 0 0 20px", padding: "3px", "background-color": "white", position: "fixed", "z-index": 999999 }).addClass(".w2ui-grid-ghost"), s.offsets = [];
          for (let p = 0, f = h.length; p < f; p++) {
            var d = h[p].getBoundingClientRect();
            s.offsets.push(d.left);
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
      var s = this.find({ "w2ui.expanded": true }, true);
      for (let a = 0; a < s.length; a++) {
        var i = this.records[a].w2ui;
        i && !Array.isArray(i.children) && (this.records[a].w2ui.expanded = false);
      }
      t == "line-numbers" ? (this.show.lineNumbers = !this.show.lineNumbers, this.refresh()) : (t = this.getColumn(t)).hidden ? this.showColumn(t.field) : this.hideColumn(t.field), e.finish();
    }
  }
  initToolbar() {
    if (this.toolbar.render == null) {
      let t = this.toolbar.items || [];
      var e;
      this.toolbar.items = [], this.toolbar = new zt(u.extend({}, this.toolbar, { name: this.name + "_toolbar", owner: this })), this.show.toolbarReload && this.toolbar.items.push(u.extend({}, this.buttons.reload)), this.show.toolbarColumns && this.toolbar.items.push(u.extend({}, this.buttons.columns)), this.show.toolbarSearch && (e = `
                <div class="w2ui-grid-search-input">
                    ${this.buttons.search.html}
                    <div id="grid_${this.name}_search_name" class="w2ui-grid-search-name">
                        <span class="name-icon w2ui-icon-search"></span>
                        <span class="name-text"></span>
                        <span class="name-cross w2ui-action" data-click="searchReset">x</span>
                    </div>
                    <input type="text" id="grid_${this.name}_search_all" class="w2ui-search-all" tabindex="-1"
                        autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                        placeholder="${u.lang(this.last.label, true)}" value="${this.last.search}"
                        data-focus="searchSuggest" data-click="stop"
                    >
                    <div class="w2ui-search-drop w2ui-action" data-click="searchOpen"
                            style="${this.multiSearch ? "" : "display: none"}">
                        <span class="w2ui-icon-drop"></span>
                    </div>
                </div>`, this.toolbar.items.push({ id: "w2ui-search", type: "html", html: e, onRefresh: async (i) => {
        await i.complete;
        var i = n(this.box).find(`#grid_${this.name}_search_all`), a = (u.bindEvents(n(this.box).find(`#grid_${this.name}_search_all, .w2ui-action`), this), u.debounce((r) => {
          var l = r.target.value;
          this.liveSearch && this.last.liveText != l && (this.last.liveText = l, this.search(this.last.field, l)), r.keyCode == 40 && this.searchSuggest(true);
        }, 250));
        i.on("change", (r) => {
          this.liveSearch || (this.search(this.last.field, r.target.value), this.searchSuggest(true, true, this));
        }).on("blur", () => {
          this.last.liveText = "";
        }).on("keyup", a);
      } })), Array.isArray(t) && (e = t.map((s) => s.id), this.show.toolbarAdd && !e.includes(this.buttons.add.id) && this.toolbar.items.push(u.extend({}, this.buttons.add)), this.show.toolbarEdit && !e.includes(this.buttons.edit.id) && this.toolbar.items.push(u.extend({}, this.buttons.edit)), this.show.toolbarDelete && !e.includes(this.buttons.delete.id) && this.toolbar.items.push(u.extend({}, this.buttons.delete)), this.show.toolbarSave && !e.includes(this.buttons.save.id) && ((this.show.toolbarAdd || this.show.toolbarDelete || this.show.toolbarEdit) && this.toolbar.items.push({ type: "break", id: "w2ui-break2" }), this.toolbar.items.push(u.extend({}, this.buttons.save))), t = t.map((s) => this.buttons[s.name] ? u.extend({}, this.buttons[s.name], s) : s)), this.toolbar.items.push(...t), this.toolbar.on("click", (s) => {
        var i = this.trigger("toolbar", { target: s.target, originalEvent: s });
        if (i.isCancelled !== true) {
          let r;
          switch (s.detail.item.id) {
            case "w2ui-reload":
              if ((r = this.trigger("reload", { target: this.name })).isCancelled === true) return false;
              this.reload(), r.finish();
              break;
            case "w2ui-column-on-off":
              s.detail.subItem ? (a = s.detail.subItem.id, ["w2ui-stateSave", "w2ui-stateReset"].includes(a) ? this[a.substring(5)]() : a != "w2ui-skip" && this.columnOnOff(s, s.detail.subItem.id)) : (this.initColumnOnOff(), setTimeout(() => {
                n(`#w2overlay-${this.name}_toolbar-drop .w2ui-grid-skip`).off(".w2ui-grid").on("click.w2ui-grid", (l) => {
                  l.stopPropagation();
                }).on("keypress", (l) => {
                  l.keyCode == 13 && (this.skip(l.target.value), this.toolbar.click("w2ui-column-on-off"));
                });
              }, 100));
              break;
            case "w2ui-add":
              if ((r = this.trigger("add", { target: this.name, recid: null })).isCancelled === true) return false;
              r.finish();
              break;
            case "w2ui-edit": {
              var a = this.getSelection();
              let l = null;
              if (a.length == 1 && (l = a[0]), (r = this.trigger("edit", { target: this.name, recid: l })).isCancelled === true) return false;
              r.finish();
              break;
            }
            case "w2ui-delete":
              this.delete();
              break;
            case "w2ui-save":
              this.save();
          }
          i.finish();
        }
      }), this.toolbar.on("refresh", (s) => {
        if (s.target == "w2ui-search") {
          let i = this.searchData;
          setTimeout(() => {
            this.searchInitInput(this.last.field, i.length == 1 ? i[0].value : null);
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
      for (let a = 0; a < e.columns.length; a++) e.columns[a].hidden || (e.columns[a].sizeOriginal == null && (e.columns[a].sizeOriginal = e.columns[a].size), e.columns[a].size = e.columns[a].sizeCalculated);
      let s = { phase: "before", type: "columnResize", target: e.name, column: e.last.tmp.col, field: e.columns[e.last.tmp.col].field };
      s = e.trigger(u.extend(s, { resizeBy: 0, originalEvent: t }));
      let i;
      n(document).off(".grid-col-resize").on("mousemove.grid-col-resize", function(a) {
        var r;
        e.last.colResizing == 1 && (a = a || window.event, (s = e.trigger(u.extend(s, { resizeBy: a.screenX - e.last.tmp.gx, originalEvent: a }))).isCancelled === true ? s.isCancelled = false : (e.last.tmp.x = a.screenX - e.last.tmp.x, e.last.tmp.y = a.screenY - e.last.tmp.y, r = parseInt(e.columns[e.last.tmp.col].size) + e.last.tmp.x + "px", e.columns[e.last.tmp.col].size = r, i && clearTimeout(i), i = setTimeout(() => {
          e.resizeRecords(), e.scroll();
        }, 100), e.last.tmp.tds.css({ width: r }), e.last.tmp.x = a.screenX, e.last.tmp.y = a.screenY));
      }).on("mouseup.grid-col-resize", function(a) {
        n(document).off(".grid-col-resize"), e.resizeRecords(), e.scroll(), s.finish({ originalEvent: a }), setTimeout(() => {
          e.last.colResizing = false;
        }, 1);
      });
    }).on("dblclick.grid-col-resize", function(t) {
      let s = parseInt(n(this).attr("name")), i = e.columns[s], a = 0;
      if (i.autoResize === false) return true;
      t.stopPropagation ? t.stopPropagation() : t.cancelBubble = true, t.preventDefault && t.preventDefault(), n(e.box).find('.w2ui-grid-records td[col="' + s + '"] > div', e.box).each(() => {
        var l = this.offsetWidth - this.scrollWidth;
        l < a && (a = l - 3);
      });
      var r = { phase: "before", type: "columnAutoResize", target: e.name, column: i, field: i.field };
      (r = e.trigger(u.extend(r, { resizeBy: Math.abs(a), originalEvent: t }))).isCancelled === true ? r.isCancelled = false : (a < 0 && (i.size = Math.min(parseInt(i.size) + Math.abs(a), i.max || 1 / 0) + "px", e.resizeRecords(), e.resizeRecords(), e.scroll()), r.finish({ originalEvent: t }));
    }).each((t) => {
      var s = n(t).get(0).parentNode;
      n(t).css({ height: s.clientHeight + "px", "margin-left": s.clientWidth - 3 + "px" });
    });
  }
  resizeBoxes() {
    var e = n(this.box).find(`#grid_${this.name}_header`), t = n(this.box).find(`#grid_${this.name}_toolbar`), s = n(this.box).find(`#grid_${this.name}_fsummary`), i = n(this.box).find(`#grid_${this.name}_summary`), a = n(this.box).find(`#grid_${this.name}_footer`), r = n(this.box).find(`#grid_${this.name}_body`);
    this.show.header && e.css({ top: "0px", left: "0px", right: "0px" }), this.show.toolbar && t.css({ top: 0 + (this.show.header ? u.getSize(e, "height") : 0) + "px", left: "0px", right: "0px" }), 0 < this.summary.length && (s.css({ bottom: 0 + (this.show.footer ? u.getSize(a, "height") : 0) + "px" }), i.css({ bottom: 0 + (this.show.footer ? u.getSize(a, "height") : 0) + "px", right: "0px" })), this.show.footer && a.css({ bottom: "0px", left: "0px", right: "0px" }), r.css({ top: 0 + (this.show.header ? u.getSize(e, "height") : 0) + (this.show.toolbar ? u.getSize(t, "height") : 0) + "px", bottom: 0 + (this.show.footer ? u.getSize(a, "height") : 0) + (0 < this.summary.length ? u.getSize(i, "height") : 0) + "px", left: "0px", right: "0px" });
  }
  resizeRecords() {
    var _a, _b, _c, _d, _e2, _f;
    let e = this;
    n(this.box).find(".w2ui-empty-record").remove();
    var t, s, i = n(this.box), a = n(this.box).find(":scope > div.w2ui-grid-box"), r = n(this.box).find(`#grid_${this.name}_header`), l = n(this.box).find(`#grid_${this.name}_toolbar`), h = n(this.box).find(`#grid_${this.name}_summary`), o = n(this.box).find(`#grid_${this.name}_fsummary`), c = n(this.box).find(`#grid_${this.name}_footer`), d = n(this.box).find(`#grid_${this.name}_body`), p = n(this.box).find(`#grid_${this.name}_columns`), f = n(this.box).find(`#grid_${this.name}_fcolumns`), m = n(this.box).find(`#grid_${this.name}_records`), b = n(this.box).find(`#grid_${this.name}_frecords`), v = n(this.box).find(`#grid_${this.name}_scroll1`);
    let g = 8 * String(this.total).length + 10, y = (g < 34 && (g = 34), this.lineNumberWidth != null && (g = this.lineNumberWidth), false), w = false, C = 0;
    for (let A = 0; A < this.columns.length; A++) this.columns[A].frozen || this.columns[A].hidden || (t = parseInt(this.columns[A].sizeCalculated || this.columns[A].size), C += t);
    ((_a = m[0]) == null ? void 0 : _a.clientWidth) < C && (y = true), ((_b = d[0]) == null ? void 0 : _b.clientHeight) - (((_c = p[0]) == null ? void 0 : _c.clientHeight) ?? 0) < (((_d = n(m).find(":scope > table")[0]) == null ? void 0 : _d.clientHeight) ?? 0) + (y ? u.scrollBarSize() : 0) && (w = true), this.fixedBody ? (s = ((_e2 = a[0]) == null ? void 0 : _e2.clientHeight) - (this.show.header ? u.getSize(r, "height") : 0) - (this.show.toolbar ? u.getSize(l, "height") : 0) - (h.css("display") != "none" ? u.getSize(h, "height") : 0) - (this.show.footer ? u.getSize(c, "height") : 0), d.css("height", s + "px")) : (r = (s = u.getSize(p, "height") + u.getSize(n(this.box).find("#grid_" + this.name + "_records table"), "height") + (y ? u.scrollBarSize() : 0)) + (this.show.header ? u.getSize(r, "height") : 0) + (this.show.toolbar ? u.getSize(l, "height") : 0) + (h.css("display") != "none" ? u.getSize(h, "height") : 0) + (this.show.footer ? u.getSize(c, "height") : 0), a.css("height", r + "px"), d.css("height", s + "px"), i.css("height", u.getSize(a, "height") + "px"));
    let $ = this.records.length;
    if (l = typeof this.url != "object" ? this.url : this.url.get, this.searchData.length == 0 || l || ($ = this.last.searchIds.length), this.fixedBody || (w = false), y || w ? (p.find(":scope > table > tbody > tr:nth-child(1) td.w2ui-head-last").css("width", u.scrollBarSize() + "px").show(), m.css({ top: (0 < this.columnGroups.length && this.show.columns ? 1 : 0) + u.getSize(p, "height") + "px", "-webkit-overflow-scrolling": "touch", "overflow-x": y ? "auto" : "hidden", "overflow-y": w ? "auto" : "hidden" })) : (p.find(":scope > table > tbody > tr:nth-child(1) td.w2ui-head-last").hide(), m.css({ top: (0 < this.columnGroups.length && this.show.columns ? 1 : 0) + u.getSize(p, "height") + "px", overflow: "hidden" }), 0 < m.length && (this.last.scrollTop = 0, this.last.scrollLeft = 0)), y ? (b.css("margin-bottom", u.scrollBarSize() + "px"), v.show()) : (b.css("margin-bottom", 0), v.hide()), b.css({ overflow: "hidden", top: m.css("top") }), this.show.emptyRecords && !w) {
      let A = Math.floor((((_f = m[0]) == null ? void 0 : _f.clientHeight) ?? 0) / this.recordHeight) - 1, O = 0;
      if ((O = m[0] ? m[0].scrollHeight - A * this.recordHeight : O) >= this.recordHeight && (O -= this.recordHeight, A++), this.fixedBody) {
        for (let z = $; z < A; z++) I(z, this.recordHeight, this);
        I(A, O, this);
      }
    }
    function I(A, O, z) {
      let M = "", G = "";
      var Y;
      M += '<tr class="' + (A % 2 ? "w2ui-even" : "w2ui-odd") + ' w2ui-empty-record" recid="-none-" style="height: ' + O + 'px">', G += '<tr class="' + (A % 2 ? "w2ui-even" : "w2ui-odd") + ' w2ui-empty-record" recid="-none-" style="height: ' + O + 'px">', z.show.lineNumbers && (M += '<td class="w2ui-col-number"></td>'), z.show.selectColumn && (M += '<td class="w2ui-grid-data w2ui-col-select"></td>'), z.show.expandColumn && (M += '<td class="w2ui-grid-data w2ui-col-expand"></td>'), G += '<td class="w2ui-grid-data-spacer" col="start" style="border-right: 0"></td>', z.reorderRows && (G += '<td class="w2ui-grid-data w2ui-col-order" col="order"></td>');
      for (let X = 0; X < z.columns.length; X++) {
        var V = z.columns[X];
        (V.hidden || X < z.last.colStart || X > z.last.colEnd) && !V.frozen || (Y = '<td class="w2ui-grid-data" ' + (V.attr != null ? V.attr : "") + ' col="' + X + '"></td>', V.frozen ? M += Y : G += Y);
      }
      M += '<td class="w2ui-grid-data-last"></td> </tr>', G += '<td class="w2ui-grid-data-last" col="end"></td> </tr>', n(z.box).find("#grid_" + z.name + "_frecords > table").append(M), n(z.box).find("#grid_" + z.name + "_records > table").append(G);
    }
    let E, T;
    if (0 < d.length) {
      let A = parseInt(d[0].clientWidth) - (w ? u.scrollBarSize() : 0) - (this.show.lineNumbers ? g : 0) - (this.reorderRows ? 26 : 0) - (this.show.selectColumn ? 26 : 0) - (this.show.expandColumn ? 26 : 0) - 1, O = (E = A, false);
      for (let z = T = 0; z < this.columns.length; z++) {
        var R = this.columns[z];
        0 < R.gridMinWidth && (R.gridMinWidth > E && R.hidden !== true && (R.hidden = true, O = true), R.gridMinWidth < E) && R.hidden === true && (R.hidden = false, O = true);
      }
      if (O === true) return void this.refresh();
      for (let z = 0; z < this.columns.length; z++) {
        var k = this.columns[z];
        k.hidden || (String(k.size).substr(String(k.size).length - 2).toLowerCase() == "px" ? (A -= parseFloat(k.size), this.columns[z].sizeCalculated = k.size, this.columns[z].sizeType = "px") : (T += parseFloat(k.size), this.columns[z].sizeType = "%", delete k.sizeCorrected));
      }
      if (T != 100 && 0 < T) for (let z = 0; z < this.columns.length; z++) {
        var _ = this.columns[z];
        _.hidden || _.sizeType == "%" && (_.sizeCorrected = Math.round(100 * parseFloat(_.size) * 100 / T) / 100 + "%");
      }
      for (let z = 0; z < this.columns.length; z++) {
        var S = this.columns[z];
        S.hidden || S.sizeType == "%" && (this.columns[z].sizeCorrected != null ? this.columns[z].sizeCalculated = Math.floor(A * parseFloat(S.sizeCorrected) / 100) - 1 + "px" : this.columns[z].sizeCalculated = Math.floor(A * parseFloat(S.size) / 100) - 1 + "px");
      }
    }
    let D = 0;
    for (let A = 0; A < this.columns.length; A++) {
      var N = this.columns[A];
      N.hidden || (N.min == null && (N.min = 20), parseInt(N.sizeCalculated) < parseInt(N.min) && (N.sizeCalculated = N.min + "px"), parseInt(N.sizeCalculated) > parseInt(N.max) && (N.sizeCalculated = N.max + "px"), D += parseInt(N.sizeCalculated));
    }
    let H = parseInt(E) - parseInt(D);
    if (0 < H && 0 < T) {
      let A = 0;
      for (; ; ) {
        var U = this.columns[A];
        if (U == null) A = 0;
        else {
          if (!U.hidden && U.sizeType != "px" && (U.sizeCalculated = parseInt(U.sizeCalculated) + 1 + "px", --H === 0)) break;
          A++;
        }
      }
    } else 0 < H && p.find(":scope > table > tbody > tr:nth-child(1) td.w2ui-head-last").css("width", u.scrollBarSize() + "px").show();
    let P = 1;
    this.show.lineNumbers && (P += g), this.show.selectColumn && (P += 26), this.show.expandColumn && (P += 26);
    for (let A = 0; A < this.columns.length; A++) this.columns[A].hidden || this.columns[A].frozen && (P += parseInt(this.columns[A].sizeCalculated));
    f.css("width", P + "px"), b.css("width", P + "px"), o.css("width", P + "px"), v.css("width", P + "px"), p.css("left", P + "px"), m.css("left", P + "px"), h.css("left", P + "px"), p.find(":scope > table > tbody > tr:nth-child(1) td").add(f.find(":scope > table > tbody > tr:nth-child(1) td")).each((A) => {
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
      } else n(A).css("width", u.scrollBarSize() + (0 < H && T === 0 ? H : 0) + "px");
    }), p.find(":scope > table > tbody > tr").length == 3 && p.find(":scope > table > tbody > tr:nth-child(1) td").add(f.find(":scope > table > tbody > tr:nth-child(1) td")).html("").css({ height: "0", border: "0", padding: "0", margin: "0" }), m.find(":scope > table > tbody > tr:nth-child(1) td").add(b.find(":scope > table > tbody > tr:nth-child(1) td")).each((A) => {
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
      } else n(A).css("width", (0 < H && T === 0 ? H : 0) + "px");
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
      n(A).hasClass("w2ui-grid-data-last") && n(A).parents(".w2ui-grid-frecords").length === 0 && n(A).css("width", u.scrollBarSize() + (0 < H && T === 0 ? H : 0) + "px");
    }), this.initResize(), this.refreshRanges(), (this.last.scrollTop || this.last.scrollLeft) && 0 < m.length && (p.prop("scrollLeft", this.last.scrollLeft), m.prop("scrollTop", this.last.scrollTop), m.prop("scrollLeft", this.last.scrollLeft)), p.css("will-change", "scroll-position");
  }
  getSearchesHTML() {
    let e = `
            <div class="search-title">
                ${u.lang("Advanced Search")}
                <span class="search-logic" style="${this.show.searchLogic ? "" : "display: none"}">
                    <select id="grid_${this.name}_logic" class="w2ui-input">
                        <option value="AND" ${this.last.logic == "AND" ? "selected" : ""}>${u.lang("All")}</option>
                        <option value="OR" ${this.last.logic == "OR" ? "selected" : ""}>${u.lang("Any")}</option>
                    </select>
                </span>
            </div>
            <table cellspacing="0"><tbody>
        `;
    for (let i = 0; i < this.searches.length; i++) {
      var t = this.searches[i];
      if (t.type = String(t.type).toLowerCase(), !t.hidden) {
        t.attr == null && (t.attr = ""), t.text == null && (t.text = ""), t.style == null && (t.style = ""), t.type == null && (t.type = "text"), t.label == null && t.caption != null && (console.log("NOTICE: grid search.caption property is deprecated, please use search.label. Search ->", t), t.label = t.caption);
        var s = `<select id="grid_${this.name}_operator_${i}" class="w2ui-input" data-change="initOperator|${i}">
                    ${this.getOperators(t.type, t.operators)}
                </select>`;
        e += `<tr>
                        <td class="caption">${u.lang(t.label) || ""}</td>
                        <td class="operator">${s}</td>
                        <td class="value">`;
        let a;
        switch (t.type) {
          case "text":
          case "alphanumeric":
          case "hex":
          case "color":
          case "list":
          case "combo":
          case "enum":
            a = "width: 250px;", ["hex", "color"].indexOf(t.type) != -1 && (a = "width: 90px;"), e += `<input rel="search" type="text" id="grid_${this.name}_field_${i}" name="${t.field}"
                               class="w2ui-input" style="${a + t.style}" ${t.attr}>`;
            break;
          case "int":
          case "float":
          case "money":
          case "currency":
          case "percent":
          case "date":
          case "time":
          case "datetime":
            a = "width: 90px;", t.type == "datetime" && (a = "width: 140px;"), e += `<input id="grid_${this.name}_field_${i}" name="${t.field}" ${t.attr} rel="search" type="text"
                                class="w2ui-input" style="${a + t.style}">
                            <span id="grid_${this.name}_range_${i}" style="display: none">&#160;-&#160;&#160;
                                <input rel="search" type="text" class="w2ui-input" style="${a + t.style}" id="grid_${this.name}_field2_${i}" name="${t.field}" ${t.attr}>
                            </span>`;
            break;
          case "select":
            e += `<select rel="search" class="w2ui-input" style="${t.style}" id="grid_${this.name}_field_${i}"
                                name="${t.field}" ${t.attr}></select>`;
        }
        e += t.text + "    </td></tr>";
      }
    }
    return e += `<tr>
            <td colspan="2" class="actions">
                <button type="button" class="w2ui-btn close-btn" data-click="searchClose">${u.lang("Close")}</button>
            </td>
            <td class="actions">
                <button type="button" class="w2ui-btn" data-click="searchReset">${u.lang("Reset")}</button>
                <button type="button" class="w2ui-btn w2ui-btn-blue" data-click="search">${u.lang("Search")}</button>
            </td>
        </tr></tbody></table>`;
  }
  getOperators(e, t) {
    let s = this.operators[this.operatorsMap[e]] || [], i = (t != null && Array.isArray(t) && (s = t), "");
    return s.forEach((a) => {
      let r = a, l = a;
      Array.isArray(a) ? (r = a[1], l = a[0]) : u.isPlainObject(a) && (r = a.text, l = a.oper), r == null && (r = a), i += `<option name="11" value="${l}">${u.lang(r)}</option>
`;
    }), i;
  }
  initOperator(e) {
    let t;
    var s = this.searches[e], i = this.getSearchData(s.field), a = n(`#w2overlay-${this.name}-search-overlay`), r = a.find(`#grid_${this.name}_range_` + e);
    let l = a.find(`#grid_${this.name}_field_` + e), h = a.find(`#grid_${this.name}_field2_` + e);
    var o = a.find(`#grid_${this.name}_operator_` + e).val();
    switch (l.show(), r.hide(), o) {
      case "between":
        r.show();
        break;
      case "null":
      case "not null":
        l.hide(), l.val(o), l.trigger("change");
    }
    switch (s.type) {
      case "text":
      case "alphanumeric":
        var c = l[0]._w2field;
        c && c.reset();
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
        l[0]._w2field || (new Se(s.type, { el: l[0], ...s.options }), new Se(s.type, { el: h[0], ...s.options }), setTimeout(() => {
          l.trigger("keydown"), h.trigger("keydown");
        }, 1));
        break;
      case "list":
      case "combo":
      case "enum":
        t = s.options, s.type == "list" && (t.selected = {}), s.type == "enum" && (t.selected = []), i && (t.selected = i.value), l[0]._w2field || (c = new Se(s.type, { el: l[0], ...t }), i && i.text != null && c.set({ id: i.value, text: i.text }));
        break;
      case "select":
        t = '<option value="">--</option>';
        for (let p = 0; p < s.options.items.length; p++) {
          var d = s.options.items[p];
          if (u.isPlainObject(s.options.items[p])) {
            let f = d.id, m = d.text;
            f == null && d.value != null && (f = d.value), m == null && d.text != null && (m = d.text), f == null && (f = ""), t += '<option value="' + f + '">' + m + "</option>";
          } else t += '<option value="' + d + '">' + d + "</option>";
        }
        l.html(t);
    }
  }
  initSearches() {
    var e = n(`#w2overlay-${this.name}-search-overlay`);
    for (let a = 0; a < this.searches.length; a++) {
      var s = this.searches[a], t = this.getSearchData(s.field);
      s.type = String(s.type).toLowerCase(), typeof s.options != "object" && (s.options = {});
      let r = s.operator, l = [...this.operators[this.operatorsMap[s.type]]];
      s.operators && (l = s.operators), u.isPlainObject(r) && (r = r.oper), l.forEach((h, o) => {
        u.isPlainObject(h) && (l[o] = h.oper);
      }), t && t.operator && (r = t.operator);
      var s = this.defaultOperator[this.operatorsMap[s.type]], s = (l.indexOf(r) == -1 && (r = s), e.find(`#grid_${this.name}_operator_` + a).val(r), this.initOperator(a), e.find(`#grid_${this.name}_field_` + a)), i = e.find(`#grid_${this.name}_field2_` + a);
      t != null && (Array.isArray(t.value) ? ["in", "not in"].includes(t.operator) ? s[0]._w2field.set(t.value) : (s.val(t.value[0]).trigger("change"), i.val(t.value[1]).trigger("change")) : t.value != null && s.val(t.value).trigger("change"));
    }
    e.find(".w2ui-grid-search-advanced *[rel=search]").on("keypress", (a) => {
      a.keyCode == 13 && (this.search(), F.hide(this.name + "-search-overlay"));
    });
  }
  getColumnsHTML() {
    let e = this, t = "", s = "";
    var i, a, r;
    return this.show.columnHeaders && (s = 0 < this.columnGroups.length ? (r = l(true), i = function() {
      let h = "<tr>", o = "<tr>", c = "", d = e.columnGroups.length - 1;
      e.columnGroups[d].text == null && e.columnGroups[d].caption != null && (console.log("NOTICE: grid columnGroup.caption property is deprecated, please use columnGroup.text. Group -> ", e.columnGroups[d]), e.columnGroups[d].text = e.columnGroups[d].caption), e.columnGroups[e.columnGroups.length - 1].text != "" && e.columnGroups.push({ text: "" }), e.show.lineNumbers && (h += '<td class="w2ui-head w2ui-col-number" col="line-number">    <div>&#160;</div></td>'), e.show.selectColumn && (h += '<td class="w2ui-head w2ui-col-select" col="select">    <div style="height: 25px">&#160;</div></td>'), e.show.expandColumn && (h += '<td class="w2ui-head w2ui-col-expand" col="expand">    <div style="height: 25px">&#160;</div></td>');
      let p = 0;
      o += `<td id="grid_${e.name}_column_start" class="w2ui-head" col="start" style="border-right: 0"></td>`, e.reorderRows && (o += '<td class="w2ui-head w2ui-col-order" col="order">    <div style="height: 25px">&#160;</div></td>');
      for (let v = 0; v < e.columnGroups.length; v++) {
        var f = e.columnGroups[v], m = e.columns[p] || {};
        f.colspan != null && (f.span = f.colspan), f.span != null && f.span == parseInt(f.span) || (f.span = 1), m.text == null && m.caption != null && (console.log("NOTICE: grid column.caption property is deprecated, please use column.text. Column ->", m), m.text = m.caption);
        let g = 0;
        for (let y = p; y < p + f.span; y++) e.columns[y] && !e.columns[y].hidden && g++;
        if (!((g = v == e.columnGroups.length - 1 ? 100 : g) <= 0)) {
          if (f.main === true) {
            let y = "";
            for (let C = 0; C < e.sortData.length; C++) e.sortData[C].field == m.field && ((e.sortData[C].direction || "").toLowerCase() === "asc" && (y = "w2ui-sort-up"), (e.sortData[C].direction || "").toLowerCase() === "desc") && (y = "w2ui-sort-down");
            let w = "";
            m.resizable !== false && (w = `<div class="w2ui-resizer" name="${p}"></div>`);
            var b = u.lang(typeof m.text == "function" ? m.text(m) : m.text);
            c = `<td id="grid_${e.name}_column_${p}" class="w2ui-head ${y}" col="${p}"     rowspan="2" colspan="${g}">` + w + `    <div class="w2ui-col-group w2ui-col-header ${y ? "w2ui-col-sorted" : ""}">        <div class="${y}"></div>` + (b || "&#160;") + "    </div></td>";
          } else b = u.lang(typeof f.text == "function" ? f.text(f) : f.text), c = `<td id="grid_${e.name}_column_${p}" class="w2ui-head" col="${p}" colspan="${g}">    <div class="w2ui-col-group" style="${f.style ?? ""}">${b || "&#160;"}</div></td>`;
          m && m.frozen ? h += c : o += c;
        }
        p += f.span;
      }
      return h += "<td></td></tr>", o += `<td id="grid_${e.name}_column_end" class="w2ui-head" col="end"></td></tr>`, [h, o];
    }(), a = l(false), t = r[0] + i[0] + a[0], r[1] + i[1] + a[1]) : (r = l(true), t = r[0], r[1])), [t, s];
    function l(h) {
      let o = "<tr>", c = "<tr>", d = (e.show.lineNumbers && (o += '<td class="w2ui-head w2ui-col-number" col="line-number">    <div>#</div></td>'), e.show.selectColumn && (o += `<td class="w2ui-head w2ui-col-select" col="select">    <div>        <input type="checkbox" id="grid_${e.name}_check_all" class="w2ui-select-all" tabindex="-1"            style="${e.multiSelect == 0 ? "display: none;" : ""}"        >    </div></td>`), e.show.expandColumn && (o += '<td class="w2ui-head w2ui-col-expand" col="expand">    <div>&#160;</div></td>'), 0), p = 0, f;
      c += `<td id="grid_${e.name}_column_start" class="w2ui-head" col="start" style="border-right: 0"></td>`, e.reorderRows && (c += '<td class="w2ui-head w2ui-col-order" col="order">    <div>&#160;</div></td>');
      for (let v = 0; v < e.columns.length; v++) {
        var m, b = e.columns[v];
        b.text == null && b.caption != null && (console.log("NOTICE: grid column.caption property is deprecated, please use column.text. Column -> ", b), b.text = b.caption), b.size == null && (b.size = "100%"), v == p && (f = e.columnGroups[d++] || {}, p += f.span), (v < e.last.colStart || v > e.last.colEnd) && !b.frozen || b.hidden || f.main === true && !h || (m = e.getColumnCellHTML(v), b && b.frozen ? o += m : c += m);
      }
      return o += '<td class="w2ui-head w2ui-head-last"><div>&#160;</div></td>', c += '<td class="w2ui-head w2ui-head-last" col="end"><div>&#160;</div></td>', o += "</tr>", c += "</tr>", [o, c];
    }
  }
  getColumnCellHTML(e) {
    var t = this.columns[e];
    if (t == null) return "";
    var s = !this.reorderColumns || this.columnGroups && this.columnGroups.length ? "" : " w2ui-col-reorderable ";
    let i = "";
    for (let o = 0; o < this.sortData.length; o++) this.sortData[o].field == t.field && ((this.sortData[o].direction || "").toLowerCase() === "asc" && (i = "w2ui-sort-up"), (this.sortData[o].direction || "").toLowerCase() === "desc") && (i = "w2ui-sort-down");
    var a, r = this.last.selection.columns;
    let l = false;
    for (a in r) for (let o = 0; o < r[a].length; o++) r[a][o] == e && (l = true);
    var h = u.lang(typeof t.text == "function" ? t.text(t) : t.text);
    return '<td id="grid_' + this.name + "_column_" + e + '" col="' + e + '" class="w2ui-head ' + i + s + '">' + (t.resizable !== false ? '<div class="w2ui-resizer" name="' + e + '"></div>' : "") + '    <div class="w2ui-col-header ' + (i ? "w2ui-col-sorted" : "") + " " + (l ? "w2ui-col-selected" : "") + '">        <div class="' + i + '"></div>' + (h || "&#160;") + "    </div></td>";
  }
  columnTooltipShow(i, t) {
    var s = n(this.box).find("#grid_" + this.name + "_column_" + i), i = this.columns[i], a = this.columnTooltip;
    F.show({ name: this.name + "-column-tooltip", anchor: s.get(0), html: i == null ? void 0 : i.tooltip, position: a });
  }
  columnTooltipHide(e, t) {
    F.hide(this.name + "-column-tooltip");
  }
  getRecordsHTML() {
    var _a;
    let e = this.records.length;
    var t = typeof this.url != "object" ? this.url : this.url.get, t = ((e = this.searchData.length == 0 || t ? e : this.last.searchIds.length) > this.vs_start ? this.last.show_extra = this.vs_extra : this.last.show_extra = this.vs_start, n(this.box).find(`#grid_${this.name}_records`));
    let s = Math.floor((((_a = t.get(0)) == null ? void 0 : _a.clientHeight) || 0) / this.recordHeight) + this.last.show_extra + 1;
    (!this.fixedBody || s > e) && (s = e);
    var i = this.getRecordHTML(-1, 0);
    let a = "<table><tbody>" + i[0], r = "<table><tbody>" + i[1];
    a += '<tr id="grid_' + this.name + '_frec_top" line="top" style="height: 0px">    <td colspan="2000"></td></tr>', r += '<tr id="grid_' + this.name + '_rec_top" line="top" style="height: 0px">    <td colspan="2000"></td></tr>';
    for (let l = 0; l < s; l++) i = this.getRecordHTML(l, l + 1), a += i[0], r += i[1];
    return t = (e - s) * this.recordHeight, a += '<tr id="grid_' + this.name + '_frec_bottom" rec="bottom" line="bottom" style="height: ' + t + 'px; vertical-align: top">    <td colspan="2000" style="border-right: 1px solid #D6D5D7;"></td></tr><tr id="grid_' + this.name + '_frec_more" style="display: none; ">    <td colspan="2000" class="w2ui-load-more"></td></tr></tbody></table>', r += '<tr id="grid_' + this.name + '_rec_bottom" rec="bottom" line="bottom" style="height: ' + t + 'px; vertical-align: top">    <td colspan="2000" style="border: 0"></td></tr><tr id="grid_' + this.name + '_rec_more" style="display: none">    <td colspan="2000" class="w2ui-load-more"></td></tr></tbody></table>', this.last.range_start = 0, this.last.range_end = s, [a, r];
  }
  getSummaryHTML() {
    if (this.summary.length !== 0) {
      var e = this.getRecordHTML(-1, 0);
      let t = "<table><tbody>" + e[0], s = "<table><tbody>" + e[1];
      for (let i = 0; i < this.summary.length; i++) e = this.getRecordHTML(i, i + 1, true), t += e[0], s += e[1];
      return t += "</tbody></table>", s += "</tbody></table>", [t, s];
    }
  }
  scroll(e) {
    let t = this;
    var s = typeof this.url != "object" ? this.url : this.url.get, i = n(this.box).find(`#grid_${this.name}_records`), a = n(this.box).find(`#grid_${this.name}_frecords`);
    e && (w = e.target.scrollTop, e = e.target.scrollLeft, this.last.scrollTop = w, this.last.scrollLeft = e, d = n(this.box).find(`#grid_${this.name}_columns`)[0], p = n(this.box).find(`#grid_${this.name}_summary`)[0], d && (d.scrollLeft = e), p && (p.scrollLeft = e), a[0]) && (a[0].scrollTop = w), this.last.bubbleEl && (F.hide(this.name + "-bubble"), this.last.bubbleEl = null);
    let r = null, l = null;
    if (this.disableCVS || 0 < this.columnGroups.length) r = 0, l = this.columns.length - 1;
    else {
      var h, o = i.prop("clientWidth");
      let k = 0;
      for (let _ = 0; _ < this.columns.length; _++) this.columns[_].frozen || this.columns[_].hidden || (h = parseInt(this.columns[_].sizeCalculated || this.columns[_].size), k + h + 30 > this.last.scrollLeft && r == null && (r = _), k + h - 30 > this.last.scrollLeft + o && l == null && (l = _), k += h);
      l == null && (l = this.columns.length - 1);
    }
    if (r != null && (r < 0 && (r = 0), l < 0 && (l = 0), r == l && (0 < r ? r-- : l++), r != this.last.colStart || l != this.last.colEnd)) {
      var c = n(this.box), d = Math.abs(r - this.last.colStart), p = Math.abs(l - this.last.colEnd);
      if (d < 5 && p < 5) {
        var f = c.find(`.w2ui-grid-columns #grid_${this.name}_column_start`), m = c.find(".w2ui-grid-columns .w2ui-head-last"), b = c.find(`#grid_${this.name}_records .w2ui-grid-data-spacer`), v = c.find(`#grid_${this.name}_records .w2ui-grid-data-last`), g = c.find(`#grid_${this.name}_summary .w2ui-grid-data-spacer`), y = c.find(`#grid_${this.name}_summary .w2ui-grid-data-last`);
        if (r > this.last.colStart) for (let k = this.last.colStart; k < r; k++) c.find("#grid_" + this.name + "_columns #grid_" + this.name + "_column_" + k).remove(), c.find("#grid_" + this.name + '_records td[col="' + k + '"]').remove(), c.find("#grid_" + this.name + '_summary td[col="' + k + '"]').remove();
        if (l < this.last.colEnd) for (let k = this.last.colEnd; k > l; k--) c.find("#grid_" + this.name + "_columns #grid_" + this.name + "_column_" + k).remove(), c.find("#grid_" + this.name + '_records td[col="' + k + '"]').remove(), c.find("#grid_" + this.name + '_summary td[col="' + k + '"]').remove();
        if (r < this.last.colStart) for (let k = this.last.colStart - 1; k >= r; k--) this.columns[k] && (this.columns[k].frozen || this.columns[k].hidden) || (f.after(this.getColumnCellHTML(k)), b.each((_) => {
          var S = n(_).parent().attr("index");
          let D = '<td class="w2ui-grid-data" col="' + k + '" style="height: 0px"></td>';
          S != null && (D = this.getCellHTML(parseInt(S), k, false)), n(_).after(D);
        }), g.each((_) => {
          var S = n(_).parent().attr("index");
          let D = '<td class="w2ui-grid-data" col="' + k + '" style="height: 0px"></td>';
          S != null && (D = this.getCellHTML(parseInt(S), k, true)), n(_).after(D);
        }));
        if (l > this.last.colEnd) for (let k = this.last.colEnd + 1; k <= l; k++) this.columns[k] && (this.columns[k].frozen || this.columns[k].hidden) || (m.before(this.getColumnCellHTML(k)), v.each((_) => {
          var S = n(_).parent().attr("index");
          let D = '<td class="w2ui-grid-data" col="' + k + '" style="height: 0px"></td>';
          S != null && (D = this.getCellHTML(parseInt(S), k, false)), n(_).before(D);
        }), y.each((_) => {
          var S = n(_).parent().attr("index") || -1, S = this.getCellHTML(parseInt(S), k, true);
          n(_).before(S);
        }));
        this.last.colStart = r, this.last.colEnd = l;
      } else {
        this.last.colStart = r, this.last.colEnd = l;
        var e = this.getColumnsHTML(), w = this.getRecordsHTML(), d = this.getSummaryHTML(), p = c.find(`#grid_${this.name}_columns`);
        let D = c.find(`#grid_${this.name}_records`);
        var C = c.find(`#grid_${this.name}_frecords`);
        let N = c.find(`#grid_${this.name}_summary`);
        p.find("tbody").html(e[1]), C.html(w[0]), D.prepend(w[1]), d != null && N.html(d[1]), setTimeout(() => {
          D.find(":scope > table").filter(":not(table:first-child)").remove(), N[0] && (N[0].scrollLeft = this.last.scrollLeft);
        }, 1);
      }
      this.resizeRecords();
    }
    let $ = this.records.length;
    if ($ > this.total && this.total !== -1 && ($ = this.total), ($ = this.searchData.length == 0 || s ? $ : this.last.searchIds.length) !== 0 && i.length !== 0 && i.prop("clientHeight") !== 0) {
      $ > this.vs_start ? this.last.show_extra = this.vs_extra : this.last.show_extra = this.vs_start;
      let k = Math.round(i.prop("scrollTop") / this.recordHeight + 1), _ = k + (Math.round(i.prop("clientHeight") / this.recordHeight) - 1);
      if (k > $ && (k = $), _ >= $ - 1 && (_ = $), n(this.box).find("#grid_" + this.name + "_footer .w2ui-footer-right").html((this.show.statusRange ? u.formatNumber(this.offset + k) + "-" + u.formatNumber(this.offset + _) + (this.total != -1 ? " " + u.lang("of") + " " + u.formatNumber(this.total) : "") : "") + (s && this.show.statusBuffered ? " (" + u.lang("buffered") + " " + u.formatNumber($) + (0 < this.offset ? ", skip " + u.formatNumber(this.offset) : "") + ")" : "")), s || this.fixedBody && !(this.total != -1 && this.total <= this.vs_start)) {
        let G = function() {
          t.markSearch && (clearTimeout(t.last.marker_timer), t.last.marker_timer = setTimeout(() => {
            var Y = [];
            for (let Z = 0; Z < t.searchData.length; Z++) {
              var V = t.searchData[Z], X = t.getSearch(V.field);
              X && !X.hidden && (X = t.getColumn(V.field, true), Y.push({ field: V.field, search: V.value, col: X }));
            }
            0 < Y.length && Y.forEach((Z) => {
              var me = n(t.box).find('td[col="' + Z.col + '"]:not(.w2ui-head)');
              u.marker(me, Z.search);
            });
          }, 50));
        }, S = Math.floor(i.prop("scrollTop") / this.recordHeight) - this.last.show_extra, D = S + Math.floor(i.prop("clientHeight") / this.recordHeight) + 2 * this.last.show_extra + 1;
        S < 1 && (S = 1), D > this.total && this.total != -1 && (D = this.total);
        var I = i.find("#grid_" + this.name + "_rec_top"), E = i.find("#grid_" + this.name + "_rec_bottom"), T = a.find("#grid_" + this.name + "_frec_top"), R = a.find("#grid_" + this.name + "_frec_bottom"), p = (String(I.next().prop("id")).indexOf("_expanded_row") != -1 && (I.next().remove(), T.next().remove()), this.total > D && String(E.prev().prop("id")).indexOf("_expanded_row") != -1 && (E.prev().remove(), R.prev().remove()), parseInt(I.next().attr("line"))), e = parseInt(E.prev().attr("line"));
        let U, P, A, O, z;
        if (p < S || p == 1 || this.last.pull_refresh) {
          if (D <= e + this.last.show_extra - 2 && D != this.total) return;
          for (this.last.pull_refresh = false; P = a.find("#grid_" + this.name + "_frec_top").next(), !((A = i.find("#grid_" + this.name + "_rec_top").next()).attr("line") == "bottom" || !(parseInt(A.attr("line")) < S)); ) P.remove(), A.remove();
          U = i.find("#grid_" + this.name + "_rec_bottom").prev(), (O = U.attr("line")) == "top" && (O = S);
          for (let Y = parseInt(O) + 1; Y <= D; Y++) this.records[Y - 1] && ((A = this.records[Y - 1].w2ui) && !Array.isArray(A.children) && (A.expanded = false), z = this.getRecordHTML(Y - 1, Y), E.before(z[1]), R.before(z[0]));
        } else {
          if (S >= p - this.last.show_extra + 2 && 1 < S) return;
          for (; P = a.find("#grid_" + this.name + "_frec_bottom").prev(), !((A = i.find("#grid_" + this.name + "_rec_bottom").prev()).attr("line") == "top" || !(parseInt(A.attr("line")) > D)); ) P.remove(), A.remove();
          U = i.find("#grid_" + this.name + "_rec_top").next(), (O = U.attr("line")) == "bottom" && (O = D);
          for (let Y = parseInt(O) - 1; Y >= S; Y--) this.records[Y - 1] && ((A = this.records[Y - 1].w2ui) && !Array.isArray(A.children) && (A.expanded = false), z = this.getRecordHTML(Y - 1, Y), I.after(z[1]), T.after(z[0]));
        }
        G(), setTimeout(() => {
          this.refreshRanges();
        }, 0), C = (S - 1) * this.recordHeight;
        let M = ($ - D) * this.recordHeight;
        M < 0 && (M = 0), I.css("height", C + "px"), T.css("height", C + "px"), E.css("height", M + "px"), R.css("height", M + "px"), this.last.range_start = S, this.last.range_end = D, Math.floor(i.prop("scrollTop") / this.recordHeight) + Math.floor(i.prop("clientHeight") / this.recordHeight) + 10 > $ && this.last.pull_more !== true && ($ < this.total - this.offset || this.total == -1 && this.last.fetch.hasMore) && (this.autoLoad === true && (this.last.pull_more = true, this.last.fetch.offset += this.limit, this.request("load")), n(this.box).find("#grid_" + this.name + "_rec_more, #grid_" + this.name + "_frec_more").show().eq(1).off(".load-more").on("click.load-more", function() {
          n(this).find("td").html('<div><div style="width: 20px; height: 20px;" class="w2ui-spinner"></div></div>'), t.last.pull_more = true, t.last.fetch.offset += t.limit, t.request("load");
        }).find("td").html(t.autoLoad ? '<div><div style="width: 20px; height: 20px;" class="w2ui-spinner"></div></div>' : '<div style="padding-top: 15px">' + u.lang("Load ${count} more...", { count: t.limit }) + "</div>"));
      }
    }
  }
  getRecordHTML(e, t, s) {
    var _a, _b, _c, _d, _e2;
    let i = "", a = "";
    var r = this.last.selection;
    let l;
    if (e == -1) {
      i += '<tr line="0">', a += '<tr line="0">', this.show.lineNumbers && (i += '<td class="w2ui-col-number" style="height: 0px"></td>'), this.show.selectColumn && (i += '<td class="w2ui-col-select" style="height: 0px"></td>'), this.show.expandColumn && (i += '<td class="w2ui-col-expand" style="height: 0px"></td>'), a += '<td class="w2ui-grid-data w2ui-grid-data-spacer" col="start" style="height: 0px; width: 0px"></td>', this.reorderRows && (a += '<td class="w2ui-col-order" style="height: 0px"></td>');
      for (let b = 0; b < this.columns.length; b++) {
        var h = this.columns[b], o = '<td class="w2ui-grid-data" col="' + b + '" style="height: 0px;"></td>';
        h.frozen && !h.hidden ? i += o : h.hidden || b < this.last.colStart || b > this.last.colEnd || (a += o);
      }
      i += '<td class="w2ui-grid-data-last" style="height: 0px"></td>', a += '<td class="w2ui-grid-data-last" col="end" style="height: 0px"></td>';
    } else {
      var c = typeof this.url != "object" ? this.url : this.url.get;
      if (s !== true) {
        if (0 < this.searchData.length && !c) {
          if (e >= this.last.searchIds.length) return "";
          e = this.last.searchIds[e];
        } else if (e >= this.records.length) return "";
        l = this.records[e];
      } else {
        if (e >= this.summary.length) return "";
        l = this.summary[e];
      }
      if (!l) return "";
      l.recid == null && this.recid != null && (c = this.parseField(l, this.recid)) != null && (l.recid = c);
      let b = false, v = (r.indexes.indexOf(e) != -1 && (b = true), l.w2ui ? l.w2ui.style : ""), g = (v != null && typeof v == "string" || (v = ""), l.w2ui ? l.w2ui.class : "");
      if (g != null && typeof g == "string" || (g = ""), i += '<tr id="grid_' + this.name + "_frec_" + l.recid + '" recid="' + l.recid + '" line="' + t + '" index="' + e + '"  class="' + (t % 2 == 0 ? "w2ui-even" : "w2ui-odd") + " w2ui-record " + g + (b && this.selectType == "row" ? " w2ui-selected" : "") + (l.w2ui && l.w2ui.editable === false ? " w2ui-no-edit" : "") + (l.w2ui && l.w2ui.expanded === true ? " w2ui-expanded" : "") + '"  style="height: ' + this.recordHeight + "px; " + (b || v == "" ? v.replace("background-color", "none") : v) + '" ' + (v != "" ? 'custom_style="' + v + '"' : "") + ">", a += '<tr id="grid_' + this.name + "_rec_" + l.recid + '" recid="' + l.recid + '" line="' + t + '" index="' + e + '"  class="' + (t % 2 == 0 ? "w2ui-even" : "w2ui-odd") + " w2ui-record " + g + (b && this.selectType == "row" ? " w2ui-selected" : "") + (l.w2ui && l.w2ui.editable === false ? " w2ui-no-edit" : "") + (l.w2ui && l.w2ui.expanded === true ? " w2ui-expanded" : "") + '"  style="height: ' + this.recordHeight + "px; " + (b || v == "" ? v.replace("background-color", "none") : v) + '" ' + (v != "" ? 'custom_style="' + v + '"' : "") + ">", this.show.lineNumbers && (i += '<td id="grid_' + this.name + "_cell_" + e + "_number" + (s ? "_s" : "") + '"    class="w2ui-col-number ' + (b ? " w2ui-row-selected" : "") + '"' + (this.reorderRows ? ' style="cursor: move"' : "") + ">" + (s !== true ? this.getLineHTML(t, l) : "") + "</td>"), this.show.selectColumn && (i += '<td id="grid_' + this.name + "_cell_" + e + "_select" + (s ? "_s" : "") + '" class="w2ui-grid-data w2ui-col-select">' + (s === true || l.w2ui && l.w2ui.hideCheckBox === true ? "" : '    <div>        <input class="w2ui-grid-select-check" type="checkbox" tabindex="-1" ' + (b ? 'checked="checked"' : "") + ' style="pointer-events: none"/>    </div>') + "</td>"), this.show.expandColumn) {
        let C = "";
        C = ((_a = l.w2ui) == null ? void 0 : _a.expanded) === true ? "-" : "+", ((_b = l.w2ui) == null ? void 0 : _b.expanded) != "none" && Array.isArray((_c = l.w2ui) == null ? void 0 : _c.children) && ((_d = l.w2ui) == null ? void 0 : _d.children.length) || (C = "+"), ((_e2 = l.w2ui) == null ? void 0 : _e2.expanded) == "spinner" && (C = '<div class="w2ui-spinner" style="width: 16px; margin: -2px 2px;"></div>'), i += '<td id="grid_' + this.name + "_cell_" + e + "_expand" + (s ? "_s" : "") + '" class="w2ui-grid-data w2ui-col-expand">' + (s !== true ? `<div>${C}</div>` : "") + "</td>";
      }
      a += '<td class="w2ui-grid-data-spacer" col="start" style="border-right: 0"></td>', this.reorderRows && (a += '<td id="grid_' + this.name + "_cell_" + e + "_order" + (s ? "_s" : "") + '" class="w2ui-grid-data w2ui-col-order" col="order">' + (s !== true ? '<div title="Drag to reorder">&nbsp;</div>' : "") + "</td>");
      let y = 0, w = 0;
      for (; ; ) {
        let C = 1;
        var d, p = this.columns[y];
        if (p == null) break;
        if (p.hidden) y++, 0 < w && w--;
        else if (0 < w) {
          if (y++, this.columns[y] == null) break;
          l.w2ui.colspan[this.columns[y - 1].field] = 0, w--;
        } else {
          if (l.w2ui && (m = l.w2ui.colspan, d = this.columns[y].field, m) && m[d] === 0 && delete m[d], !(y < this.last.colStart || y > this.last.colEnd) || p.frozen) {
            if (l.w2ui && typeof l.w2ui.colspan == "object") {
              var f = parseInt(l.w2ui.colspan[p.field]) || null;
              if (1 < f) {
                let $ = 0;
                for (let I = y; I < y + f && !(I >= this.columns.length); I++) this.columns[I].hidden && $++;
                C = f - $, w = f - 1;
              }
            }
            var m = this.getCellHTML(e, y, s, C);
            p.frozen ? i += m : a += m;
          }
          y++;
        }
      }
      i += '<td class="w2ui-grid-data-last"></td>', a += '<td class="w2ui-grid-data-last" col="end"></td>';
    }
    return i += "</tr>", a += "</tr>", [i, a];
  }
  getLineHTML(e) {
    return "<div>" + e + "</div>";
  }
  getCellHTML(e, t, s, i) {
    var _a, _b, _c, _d;
    let a = this, r = this.columns[t];
    if (r == null) return "";
    let l = (s !== true ? this.records : this.summary)[e], { value: h, style: o, className: c, attr: d, divAttr: p } = this.getCellValue(e, t, s, true);
    var f = e !== -1 ? this.getCellEditable(e, t) : "";
    let m = "max-height: " + parseInt(this.recordHeight) + "px;" + (r.clipboardCopy ? "margin-right: 20px" : "");
    var b = !s && ((_a = l == null ? void 0 : l.w2ui) == null ? void 0 : _a.changes) && l.w2ui.changes[r.field] != null, v = this.last.selection;
    let g = false, y = "";
    if (v.indexes.indexOf(e) != -1 && (g = true), i == null && (i = ((_b = l == null ? void 0 : l.w2ui) == null ? void 0 : _b.colspan) && l.w2ui.colspan[r.field] ? l.w2ui.colspan[r.field] : 1), t === 0 && Array.isArray((_c = l == null ? void 0 : l.w2ui) == null ? void 0 : _c.children)) {
      let T = 0, R = this.get(l.w2ui.parent_recid, true);
      for (; R != null; ) {
        T++;
        var w = this.records[R].w2ui;
        if (w == null || w.parent_recid == null) break;
        R = this.get(w.parent_recid, true);
      }
      if (l.w2ui.parent_recid) for (let k = 0; k < T; k++) y += '<span class="w2ui-show-children w2ui-icon-empty"></span>';
      var C = 0 < l.w2ui.children.length ? l.w2ui.expanded ? "w2ui-icon-collapse" : "w2ui-icon-expand" : "w2ui-icon-empty";
      y += `<span class="w2ui-show-children ${C}"></span>`;
    }
    if (r.info === true && (r.info = {}), r.info != null) {
      let T = "w2ui-icon-info", R = (typeof r.info.icon == "function" ? T = r.info.icon(l, { self: this, index: e, colIndex: t, summary: !!s }) : typeof r.info.icon == "object" ? T = r.info.icon[this.parseField(l, r.field)] || "" : typeof r.info.icon == "string" && (T = r.info.icon), r.info.style || "");
      typeof r.info.style == "function" ? R = r.info.style(l, { self: this, index: e, colIndex: t, summary: !!s }) : typeof r.info.style == "object" ? R = r.info.style[this.parseField(l, r.field)] || "" : typeof r.info.style == "string" && (R = r.info.style), y += `<span class="w2ui-info ${T}" style="${R}"></span>`;
    }
    let $ = h, I = (f && ["checkbox", "check"].indexOf(f.type) != -1 && (m += "text-align: center;", $ = `<input tabindex="-1" type="checkbox" class="w2ui-editable-checkbox"
                            data-changeInd="${s ? -(e + 1) : e}" data-colInd="${t}" ${$ ? 'checked="checked"' : ""}>`, y = ""), ($ = `<div style="${m}" ${function(T) {
      let R;
      return a.show.recordTitles && (r.title != null ? (typeof r.title == "function" && (R = r.title.call(a, l, { self: this, index: e, colIndex: t, summary: !!s })), typeof r.title == "string" && (R = r.title)) : R = u.stripTags(String(T).replace(/"/g, "''"))), R != null ? 'title="' + String(R) + '"' : "";
    }($)} ${p}>${y}${String($)}</div>`) == null && ($ = ""), typeof r.render == "string" && (C = r.render.toLowerCase().split(":"), ["number", "int", "float", "money", "currency", "percent", "size"].indexOf(C[0]) != -1) && (o += "text-align: right;"), (l == null ? void 0 : l.w2ui) && (typeof l.w2ui.style == "object" && (typeof l.w2ui.style[t] == "string" && (o += l.w2ui.style[t] + ";"), typeof l.w2ui.style[r.field] == "string") && (o += l.w2ui.style[r.field] + ";"), typeof l.w2ui.class == "object") && (typeof l.w2ui.class[t] == "string" && (c += l.w2ui.class[t] + " "), typeof l.w2ui.class[r.field] == "string") && (c += l.w2ui.class[r.field] + " "), false);
    g && ((_d = v.columns[e]) == null ? void 0 : _d.includes(t)) && (I = true);
    let E;
    return r.clipboardCopy && (E = '<span class="w2ui-clipboard-copy w2ui-icon-paste"></span>'), $ = '<td class="w2ui-grid-data' + (I ? " w2ui-selected" : "") + " " + c + (b ? " w2ui-changed" : "") + '"    id="grid_' + this.name + "_data_" + e + "_" + t + '" col="' + t + '"    style="' + o + (r.style != null ? r.style : "") + '" ' + (r.attr != null ? r.attr : "") + d + (1 < i ? 'colspan="' + i + '"' : "") + ">" + $ + (E && u.stripTags($) ? E : "") + "</td>", $ = e === -1 && s === true ? '<td class="w2ui-grid-data" col="' + t + '" style="height: 0px; ' + o + '" ' + (1 < i ? 'colspan="' + i + '"' : "") + "></td>" : $;
  }
  clipboardCopy(e, t, s) {
    var i = (s ? this.summary : this.records)[e], a = this.columns[t];
    let r = a ? this.parseField(i, a.field) : "";
    typeof a.clipboardCopy == "function" && (r = a.clipboardCopy(i, { self: this, index: e, colIndex: t, summary: !!s })), n(this.box).find("#grid_" + this.name + "_focus").text(r).get(0).select(), document.execCommand("copy");
  }
  showBubble(e, t, s) {
    var i = this.columns[t].info;
    if (i) {
      let p = "";
      var a = this.records[e], r = n(this.box).find(`${s ? ".w2ui-grid-summary" : ""} #grid_${this.name}_data_${e}_${t} .w2ui-info`);
      if (this.last.bubbleEl && F.hide(this.name + "-bubble"), this.last.bubbleEl = r, i.fields == null) {
        i.fields = [];
        for (let m = 0; m < this.columns.length; m++) {
          var l = this.columns[m];
          i.fields.push(l.field + (typeof l.render == "string" ? ":" + l.render : ""));
        }
      }
      let f = i.fields;
      if (typeof f == "function" && (f = f(a, { self: this, index: e, colIndex: t, summary: !!s })), typeof i.render == "function") p = i.render(a, { self: this, index: e, colIndex: t, summary: !!s });
      else if (Array.isArray(f)) {
        p = '<table cellpadding="0" cellspacing="0">';
        for (let m = 0; m < f.length; m++) {
          var h = String(f[m]).split(":");
          if (h[0] == "" || h[0] == "-" || h[0] == "--" || h[0] == "---") p += '<tr><td colspan=2><div style="border-top: ' + (h[0] == "" ? "0" : "1") + 'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>';
          else {
            let b = this.getColumn(h[0]), v = (b = b ?? { field: h[0], caption: h[0] }) ? this.parseField(a, b.field) : "";
            1 < h.length && (u.formatters[h[1]] ? v = u.formatters[h[1]](v, h[2] || null, a) : console.log('ERROR: w2utils.formatters["' + h[1] + '"] does not exists.')), (i.showEmpty === true || v != null && v != "") && (i.maxLength != null && typeof v == "string" && v.length > i.maxLength && (v = v.substr(0, i.maxLength) + "..."), p += "<tr><td>" + b.text + "</td><td>" + ((v === 0 ? "0" : v) || "") + "</td></tr>");
          }
        }
        p += "</table>";
      } else if (u.isPlainObject(f)) {
        for (var o in p = '<table cellpadding="0" cellspacing="0">', f) {
          var c = f[o];
          if (c == "" || c == "-" || c == "--" || c == "---") p += '<tr><td colspan=2><div style="border-top: ' + (c == "" ? "0" : "1") + 'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>';
          else {
            var d = String(c).split(":");
            let m = this.getColumn(d[0]), b = (m = m ?? { field: d[0], caption: d[0] }) ? this.parseField(a, m.field) : "";
            1 < d.length && (u.formatters[d[1]] ? b = u.formatters[d[1]](b, d[2] || null, a) : console.log('ERROR: w2utils.formatters["' + d[1] + '"] does not exists.')), typeof c == "function" && (b = c(a, { self: this, index: e, colIndex: t, summary: !!s })), (i.showEmpty === true || b != null && b != "") && (i.maxLength != null && typeof b == "string" && b.length > i.maxLength && (b = b.substr(0, i.maxLength) + "..."), p += "<tr><td>" + o + "</td><td>" + ((b === 0 ? "0" : b) || "") + "</td></tr>");
          }
        }
        p += "</table>";
      }
      return F.show(u.extend({ name: this.name + "-bubble", html: p, anchor: r.get(0), position: "top|bottom", class: "w2ui-info-bubble", style: "", hideOn: ["doc-click"] }, i.options ?? {})).hide(() => [this.last.bubbleEl = null]);
    }
  }
  getCellEditable(e, t) {
    var s = this.columns[t], i = this.records[e];
    if (!i || !s) return null;
    let a = i.w2ui ? i.w2ui.editable : null;
    return a === false ? null : (a != null && a !== true || typeof (a = 0 < Object.keys(s.editable ?? {}).length ? s.editable : null) == "function" && (s = this.getCellValue(e, t, false), a = a.call(this, i, { self: this, value: s, index: e, colIndex: t })), a);
  }
  getCellValue(e, t, s, i) {
    var _a, _b;
    var a = this.columns[t], r = (s !== true ? this.records : this.summary)[e];
    let l = this.parseField(r, a.field), h = "", o = "", c = "", d = "";
    if (((_b = (_a = r == null ? void 0 : r.w2ui) == null ? void 0 : _a.changes) == null ? void 0 : _b[a.field]) != null && (l = r.w2ui.changes[a.field]), a.render != null && e !== -1) {
      if (typeof a.render == "function" && r != null) {
        let p;
        try {
          p = a.render(r, { self: this, value: l, index: e, colIndex: t, summary: !!s });
        } catch (f) {
          throw new Error(`Render function for column "${a.field}" in grid "${this.name}": -- ` + f.message);
        }
        p != null && typeof p == "object" && typeof p != "function" ? (p.id != null && p.text != null ? l = p.text : typeof p.html == "string" ? l = (p.html || "").trim() : (l = "", console.log("ERROR: render function should return a primitive or an object of the following structure.", { html: "", attr: "", style: "", class: "", divAttr: "" })), c = p.attr ?? "", o = p.style ?? "", h = p.class ?? "", d = p.divAttr ?? "") : l = String(p || "").trim();
      }
      if (typeof a.render == "object" && (e = a.render[l]) != null && e !== "" && (l = e), typeof a.render == "string") {
        t = a.render.toLowerCase().indexOf(":"), s = [], t == -1 ? (s[0] = a.render.toLowerCase(), s[1] = "") : (s[0] = a.render.toLowerCase().substr(0, t), s[1] = a.render.toLowerCase().substr(t + 1));
        let p = u.formatters[s[0]];
        a.options && a.options.autoFormat === false && (p = null), l = typeof p == "function" ? p(l, s[1], r) : "";
      }
    }
    return l == null && (l = ""), i ? { value: l, attr: c, style: o, className: h, divAttr: d } : l;
  }
  getFooterHTML() {
    return '<div>    <div class="w2ui-footer-left"></div>    <div class="w2ui-footer-right"></div>    <div class="w2ui-footer-center"></div></div>';
  }
  status(e) {
    if (e != null) n(this.box).find(`#grid_${this.name}_footer`).find(".w2ui-footer-left").html(e);
    else {
      let t = "";
      if (e = this.getSelection(), 0 < e.length && (this.show.statusSelection && 1 < e.length && (t = String(e.length).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + u.settings.groupSymbol) + " " + u.lang("selected")), this.show.statusRecordID) && e.length == 1) {
        let s = e[0];
        typeof s == "object" && (s = s.recid + ", " + u.lang("Column") + ": " + s.column), t = u.lang("Record ID") + ": " + s + " ";
      }
      n(this.box).find("#grid_" + this.name + "_footer .w2ui-footer-left").html(t);
    }
  }
  lock(e, t) {
    let s = Array.from(arguments);
    s.unshift(this.box), setTimeout(() => {
      n(this.box).find("#grid_" + this.name + "_empty_msg").remove(), u.lock(...s);
    }, 10);
  }
  unlock(e) {
    setTimeout(() => {
      n(this.box).find(".w2ui-message").hasClass("w2ui-closing") || u.unlock(this.box, e);
    }, 25);
  }
  stateSave(e) {
    var t = { columns: [], show: u.clone(this.show), last: { search: this.last.search, multi: this.last.multi, logic: this.last.logic, label: this.last.label, field: this.last.field, scrollTop: this.last.scrollTop, scrollLeft: this.last.scrollLeft }, sortData: [], searchData: [] };
    let s;
    for (let a = 0; a < this.columns.length; a++) {
      let r = this.columns[a], l = {};
      Object.keys(this.stateColProps).forEach((h, o) => {
        this.stateColProps[h] && (s = r[h] !== void 0 ? r[h] : this.colTemplate[h] || null, l[h] = s);
      }), t.columns.push(l);
    }
    for (let a = 0; a < this.sortData.length; a++) t.sortData.push(u.clone(this.sortData[a]));
    for (let a = 0; a < this.searchData.length; a++) t.searchData.push(u.clone(this.searchData[a]));
    var i = this.trigger("stateSave", { target: this.name, state: t });
    if (i.isCancelled !== true) return e !== true && this.cacheSave("state", t), i.finish(), t;
  }
  stateRestore(e) {
    var _a, _b, _c;
    let t = typeof this.url != "object" ? this.url : this.url.get;
    e = e || this.cache("state");
    var s = this.trigger("stateRestore", { target: this.name, state: e });
    if (s.isCancelled !== true) {
      if (u.isPlainObject(e)) {
        u.extend(this.show, e.show ?? {}), u.extend(this.last, e.last ?? {});
        let r = this.last.scrollTop, l = this.last.scrollLeft;
        for (let h = 0; h < ((_a = e.columns) == null ? void 0 : _a.length); h++) {
          var i = e.columns[h], a = this.getColumn(i.field, true);
          a !== null && (u.extend(this.columns[a], i), h !== a) && this.columns.splice(h, 0, this.columns.splice(a, 1)[0]);
        }
        this.sortData.splice(0, this.sortData.length);
        for (let h = 0; h < ((_b = e.sortData) == null ? void 0 : _b.length); h++) this.sortData.push(e.sortData[h]);
        this.searchData.splice(0, this.searchData.length);
        for (let h = 0; h < ((_c = e.searchData) == null ? void 0 : _c.length); h++) this.searchData.push(e.searchData[h]);
        setTimeout(() => {
          t || (0 < this.sortData.length && this.localSort(), 0 < this.searchData.length && this.localSearch()), this.last.scrollTop = r, this.last.scrollLeft = l, this.refresh();
        }, 1), console.log(`INFO (w2ui): state restored for "${this.name}"`);
      }
      return s.finish(), true;
    }
  }
  stateReset() {
    this.stateRestore(this.last.state), this.cacheSave("state", null);
  }
  parseField(e, t) {
    if (this.nestedFields) {
      let i = "";
      try {
        i = e;
        var s = String(t).split(".");
        for (let a = 0; a < s.length; a++) i = i[s[a]];
      } catch {
        i = "";
      }
      return i;
    }
    return e ? e[t] : "";
  }
  prepareData() {
    let e = this;
    for (let t = 0; t < this.records.length; t++) (function s(i) {
      var _a, _b;
      for (let a = 0; a < e.columns.length; a++) {
        let r = e.columns[a];
        if (i[r.field] != null && typeof r.render == "string") {
          if (["number", "int", "float", "money", "currency", "percent"].indexOf(r.render.split(":")[0]) != -1 && typeof i[r.field] != "number" && (i[r.field] = parseFloat(i[r.field])), ["date", "age"].indexOf(r.render.split(":")[0]) != -1 && !i[r.field + "_"]) {
            let l = i[r.field];
            u.isInt(l) && (l = parseInt(l)), i[r.field + "_"] = new Date(l);
          }
          if (["time"].indexOf(r.render) != -1) if (u.isTime(i[r.field])) {
            let l = u.isTime(i[r.field], true), h = /* @__PURE__ */ new Date();
            h.setHours(l.hours, l.minutes, l.seconds || 0, 0), i[r.field + "_"] || (i[r.field + "_"] = h);
          } else {
            let l = i[r.field], h = (l = (l = u.isInt(l) ? parseInt(l) : l) != null ? new Date(l) : /* @__PURE__ */ new Date(), /* @__PURE__ */ new Date());
            h.setHours(l.getHours(), l.getMinutes(), l.getSeconds(), 0), i[r.field + "_"] || (i[r.field + "_"] = h);
          }
        }
      }
      if (((_a = i.w2ui) == null ? void 0 : _a.children) && ((_b = i.w2ui) == null ? void 0 : _b.expanded) !== true) for (let a = 0; a < i.w2ui.children.length; a++) {
        let r = i.w2ui.children[a];
        s(r);
      }
    })(this.records[t]);
  }
  nextCell(e, t, s) {
    if (t += 1, t >= this.columns.length) return (e = this.nextRow(e)) == null ? e : this.nextCell(e, -1, s);
    var a = this.records[e].w2ui, i = this.columns[t], a = a && a.colspan && !isNaN(a.colspan[i.field]) ? parseInt(a.colspan[i.field]) : 1;
    return i == null ? null : i && i.hidden || a === 0 ? this.nextCell(e, t, s) : s && (i = this.getCellEditable(e, t), i == null || ["checkbox", "check"].indexOf(i.type) != -1) ? this.nextCell(e, t, s) : { index: e, colIndex: t };
  }
  prevCell(e, t, s) {
    if (t -= 1, t < 0) return (e = this.prevRow(e)) == null ? e : this.prevCell(e, this.columns.length, s);
    if (t < 0) return null;
    var a = this.records[e].w2ui, i = this.columns[t], a = a && a.colspan && !isNaN(a.colspan[i.field]) ? parseInt(a.colspan[i.field]) : 1;
    return i == null ? null : i && i.hidden || a === 0 ? this.prevCell(e, t, s) : s && (i = this.getCellEditable(e, t), i == null || ["checkbox", "check"].indexOf(i.type) != -1) ? this.prevCell(e, t, s) : { index: e, colIndex: t };
  }
  nextRow(e, t, s) {
    var i = this.last.searchIds;
    let a = null;
    if ((s = s ?? 1) == -1) return this.records.length - 1;
    if (e + s < this.records.length && i.length === 0 || 0 < i.length && e < i[i.length - s]) {
      if (e += s, 0 < i.length) for (; !(i.includes(e) || e > this.records.length); ) e += s;
      var l = this.records[e].w2ui, r = this.columns[t], l = l && l.colspan && r != null && !isNaN(l.colspan[r.field]) ? parseInt(l.colspan[r.field]) : 1;
      a = l === 0 ? this.nextRow(e, t, s) : e;
    }
    return a;
  }
  prevRow(e, t, s) {
    var i = this.last.searchIds;
    let a = null;
    if ((s = s ?? 1) == -1) return 0;
    if (0 <= e - s && i.length === 0 || 0 < i.length && e > i[0]) {
      if (e -= s, 0 < i.length) for (; !(i.includes(e) || e < 0); ) e -= s;
      var l = this.records[e].w2ui, r = this.columns[t], l = l && l.colspan && r != null && !isNaN(l.colspan[r.field]) ? parseInt(l.colspan[r.field]) : 1;
      a = l === 0 ? this.prevRow(e, t, s) : e;
    }
    return a;
  }
  selectionSave() {
    return this.last.saved_sel = this.getSelection(), this.last.saved_sel;
  }
  selectionRestore(e) {
    var t, s = Date.now(), i = (this.last.selection = { indexes: [], columns: {} }, this.last.selection), a = this.last.saved_sel;
    if (a) for (let r = 0; r < a.length; r++) u.isPlainObject(a[r]) ? (t = this.get(a[r].recid, true)) != null && (i.indexes.indexOf(t) == -1 && i.indexes.push(t), i.columns[t] || (i.columns[t] = []), i.columns[t].push(a[r].column)) : (t = this.get(a[r], true)) != null && i.indexes.push(t);
    return delete this.last.saved_sel, e !== true && this.refresh(), Date.now() - s;
  }
  message(e) {
    return u.message({ owner: this, box: this.box, after: ".w2ui-grid-header" }, e);
  }
  confirm(e) {
    return u.confirm({ owner: this, box: this.box, after: ".w2ui-grid-header" }, e);
  }
}
class Se extends he {
  constructor(e, t) {
    super(), typeof e == "string" && t == null && (t = { type: e }), typeof e == "object" && t == null && (t = u.clone(e)), typeof e == "string" && typeof t == "object" && (t.type = e), t.type = String(t.type).toLowerCase(), this.el = t.el ?? null, this.selected = null, this.helpers = {}, this.type = t.type ?? "text", this.options = u.clone(t), this.onClick = t.onClick ?? null, this.onAdd = t.onAdd ?? null, this.onNew = t.onNew ?? null, this.onRemove = t.onRemove ?? null, this.onMouseEnter = t.onMouseEnter ?? null, this.onMouseLeave = t.onMouseLeave ?? null, this.onScroll = t.onScroll ?? null, this.tmp = {}, delete this.options.type, delete this.options.onClick, delete this.options.onMouseEnter, delete this.options.onMouseLeave, delete this.options.onScroll, this.el && this.render(this.el);
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
          t = { min: null, max: null, step: 1, autoFormat: true, autoCorrect: true, currencyPrefix: u.settings.currencyPrefix, currencySuffix: u.settings.currencySuffix, currencyPrecision: u.settings.currencyPrecision, decimalSymbol: u.settings.decimalSymbol, groupSymbol: u.settings.groupSymbol, arrow: false, keyboard: true, precision: null, prefix: "", suffix: "" }, this.options = u.extend({}, t, e), (e = this.options).numberRE = new RegExp("[" + e.groupSymbol + "]", "g"), e.moneyRE = new RegExp("[" + e.currencyPrefix + e.currencySuffix + e.groupSymbol + "]", "g"), e.percentRE = new RegExp("[" + e.groupSymbol + "%]", "g"), ["text", "alphanumeric", "hex", "bin"].includes(this.type) && (e.arrow = false, e.keyboard = false);
          break;
        case "color":
          t = { prefix: "#", suffix: `<div style="width: ${parseInt(getComputedStyle(this.el)["font-size"]) || 12}px">&#160;</div>`, arrow: false, advanced: null, transparent: true }, this.options = u.extend({}, t, e), e = this.options;
          break;
        case "date":
          t = { format: u.settings.dateFormat, keyboard: true, autoCorrect: true, start: null, end: null, blockDates: [], blockWeekdays: [], colored: {}, btnNow: true }, this.options = u.extend({ type: "date" }, t, e), e = this.options, n(this.el).attr("placeholder") == null && n(this.el).attr("placeholder", e.format);
          break;
        case "time":
          t = { format: u.settings.timeFormat, keyboard: true, autoCorrect: true, start: null, end: null, btnNow: true, noMinutes: false }, this.options = u.extend({ type: "time" }, t, e), e = this.options, n(this.el).attr("placeholder") == null && n(this.el).attr("placeholder", e.format);
          break;
        case "datetime":
          t = { format: u.settings.dateFormat + "|" + u.settings.timeFormat, keyboard: true, autoCorrect: true, start: null, end: null, startTime: null, endTime: null, blockDates: [], blockWeekdays: [], colored: {}, btnNow: true, noMinutes: false }, this.options = u.extend({ type: "datetime" }, t, e), e = this.options, n(this.el).attr("placeholder") == null && n(this.el).attr("placeholder", e.placeholder || e.format);
          break;
        case "list":
        case "combo":
          t = { items: [], selected: {}, url: null, recId: null, recText: null, method: null, debounce: 250, postData: {}, minLength: 1, cacheMax: 250, maxDropHeight: 350, maxDropWidth: null, minDropWidth: null, match: "begins", icon: null, iconStyle: "", align: "both", altRows: true, renderDrop: null, compare: null, filter: true, hideSelected: false, prefix: "", suffix: "", msgNoItems: "No matches", msgSearch: "Type to search...", openOnFocus: false, markSearch: false, onSearch: null, onRequest: null, onLoad: null, onError: null }, typeof e.items == "function" && (e._items_fun = e.items), e.items = u.normMenu.call(this, e.items), this.type === "list" && (n(this.el).addClass("w2ui-select"), !u.isPlainObject(e.selected)) && Array.isArray(e.items) && e.items.forEach((s) => {
            s && s.id === e.selected && (e.selected = u.clone(s));
          }), e = u.extend({}, t, e), this.options = e, u.isPlainObject(e.selected) || (e.selected = {}), this.selected = e.selected, n(this.el).attr("autocapitalize", "off").attr("autocomplete", "off").attr("autocorrect", "off").attr("spellcheck", "false"), e.selected.text != null && n(this.el).val(e.selected.text);
          break;
        case "enum":
          t = { items: [], selected: [], max: 0, url: null, recId: null, recText: null, debounce: 250, method: null, postData: {}, minLength: 1, cacheMax: 250, maxItemWidth: 250, maxDropHeight: 350, maxDropWidth: null, match: "contains", align: "", altRows: true, openOnFocus: false, markSearch: false, renderDrop: null, renderItem: null, compare: null, filter: true, hideSelected: true, style: "", msgNoItems: "No matches", msgSearch: "Type to search...", onSearch: null, onRequest: null, onLoad: null, onError: null, onClick: null, onAdd: null, onNew: null, onRemove: null, onMouseEnter: null, onMouseLeave: null, onScroll: null }, typeof (e = u.extend({}, t, e, { suffix: "" })).items == "function" && (e._items_fun = e.items), e.items = u.normMenu.call(this, e.items), e.selected = u.normMenu.call(this, e.selected), this.options = e, Array.isArray(e.selected) || (e.selected = []), this.selected = e.selected;
          break;
        case "file":
          t = { selected: [], max: 0, maxSize: 0, maxFileSize: 0, maxItemWidth: 250, maxDropHeight: 350, maxDropWidth: null, readContent: true, silent: true, align: "both", altRows: true, renderItem: null, style: "", onClick: null, onAdd: null, onRemove: null, onMouseEnter: null, onMouseLeave: null }, e = u.extend({}, t, e), this.options = e, Array.isArray(e.selected) || (e.selected = []), this.selected = e.selected, n(this.el).attr("placeholder") == null && n(this.el).attr("placeholder", u.lang("Attach files by dragging and dropping or Click to Select"));
      }
      n(this.el).css("box-sizing", "border-box").addClass("w2field w2ui-input").off(".w2field").on("change.w2field", (s) => {
        this.change(s);
      }).on("click.w2field", (s) => {
        this.click(s);
      }).on("focus.w2field", (s) => {
        this.focus(s);
      }).on("blur.w2field", (s) => {
        this.type !== "list" && this.blur(s);
      }).on("keydown.w2field", (s) => {
        this.keyDown(s);
      }).on("keyup.w2field", (s) => {
        this.keyUp(s);
      }), this.addPrefix(), this.addSuffix(), this.addSearch(), this.addMultiSearch(), this.change(new Event("change"));
    } else console.log("ERROR: w2field could only be applied to INPUT or TEXTAREA.", this.el);
  }
  get() {
    return ["list", "enum", "file"].indexOf(this.type) !== -1 ? this.selected : n(this.el).val();
  }
  set(e, t) {
    ["list", "enum", "file"].indexOf(this.type) !== -1 ? (this.type !== "list" && t ? (Array.isArray(this.selected) || (this.selected = []), this.selected.push(e), (t = W.get(this.el.id + "_menu")) && (t.options.selected = this.selected)) : (e == null && (e = []), t = this.type !== "enum" || Array.isArray(e) ? e : [e], this.selected = t), n(this.el).trigger("input").trigger("change"), this.refresh()) : n(this.el).val(e);
  }
  setIndex(e, t) {
    if (["list", "enum"].indexOf(this.type) !== -1) {
      var s = this.options.items;
      if (s && s[e]) return this.type == "list" && (this.selected = s[e]), this.type == "enum" && (t || (this.selected = []), this.selected.push(s[e])), (t = W.get(this.el.id + "_menu")) && (t.options.selected = this.selected), n(this.el).trigger("input").trigger("change"), this.refresh(), true;
    }
    return false;
  }
  refresh() {
    var _a, _b;
    let e = this.options;
    var t = Date.now(), s = getComputedStyle(this.el);
    if (this.type == "list") {
      if (n(this.el).parent().css("white-space", "nowrap"), this.helpers.prefix && this.helpers.prefix.hide(), !this.helpers.search) return;
      this.selected == null && e.icon ? e.prefix = `
                    <span class="w2ui-icon ${e.icon} "style="cursor: pointer; font-size: 14px;
                        display: inline-block; margin-top: -1px; color: #7F98AD; ${e.iconStyle}">
                    </span>` : e.prefix = "", this.addPrefix();
      let h = n(this.helpers.search_focus);
      var i = n(h[0].previousElementSibling);
      h.css({ outline: "none" }), h.val() === "" ? (h.css("opacity", 0), i.css("opacity", 0), ((_a = this.selected) == null ? void 0 : _a.id) ? (l = this.selected.text, r = this.findItemIndex(e.items, this.selected.id), l != null && n(this.el).val(u.lang(l)).data({ selected: l, selectedIndex: r[0] })) : (this.el.value = "", n(this.el).removeData("selected selectedIndex"))) : (h.css("opacity", 1), i.css("opacity", 1), n(this.el).val(""), setTimeout(() => {
        this.helpers.prefix && this.helpers.prefix.hide(), e.icon ? (h.css("margin-left", "17px"), n(this.helpers.search).find(".w2ui-icon-search").addClass("show-search")) : (h.css("margin-left", "0px"), n(this.helpers.search).find(".w2ui-icon-search").removeClass("show-search"));
      }, 1)), n(this.el).prop("readOnly") || n(this.el).prop("disabled") ? setTimeout(() => {
        this.helpers.prefix && n(this.helpers.prefix).css("opacity", "0.6"), this.helpers.suffix && n(this.helpers.suffix).css("opacity", "0.6");
      }, 1) : setTimeout(() => {
        this.helpers.prefix && n(this.helpers.prefix).css("opacity", "1"), this.helpers.suffix && n(this.helpers.suffix).css("opacity", "1");
      }, 1);
    }
    let a = this.helpers.multi;
    if (["enum", "file"].includes(this.type) && a) {
      let h = "";
      Array.isArray(this.selected) && this.selected.forEach((o, c) => {
        o != null && (h += `
                        <div class="li-item" index="${c}" style="max-width: ${parseInt(e.maxItemWidth)}px; ${o.style || ""}">
                        ${typeof e.renderItem == "function" ? e.renderItem(o, c, `<div class="w2ui-list-remove" index="${c}">&#160;&#160;</div>`) : `
                               ${o.icon ? `<span class="w2ui-icon ${o.icon}"></span>` : ""}
                               <div class="w2ui-list-remove" index="${c}">&#160;&#160;</div>
                               ${(this.type === "enum" ? o.text : o.name) ?? o.id ?? o}
                               ${o.size ? `<span class="file-size"> - ${u.formatSize(o.size)}</span>` : ""}
                            `}
                        </div>`);
      });
      var r, l = a.find(".w2ui-multi-items");
      e.style && a.attr("style", a.attr("style") + ";" + e.style), n(this.el).css("z-index", "-1"), n(this.el).prop("readOnly") || n(this.el).prop("disabled") ? setTimeout(() => {
        a[0].scrollTop = 0, a.addClass("w2ui-readonly").find(".li-item").css("opacity", "0.9").parent().find(".li-search").hide().find("input").prop("readOnly", true).closest(".w2ui-multi-items").find(".w2ui-list-remove").hide();
      }, 1) : setTimeout(() => {
        a.removeClass("w2ui-readonly").find(".li-item").css("opacity", "1").parent().find(".li-search").show().find("input").prop("readOnly", false).closest(".w2ui-multi-items").find(".w2ui-list-remove").show();
      }, 1), 0 < ((_b = this.selected) == null ? void 0 : _b.length) && n(this.el).attr("placeholder", ""), a.find(".w2ui-enum-placeholder").remove(), l.find(".li-item").remove(), h !== "" ? l.prepend(h) : n(this.el).attr("placeholder") != null && a.find("input").val() === "" && (r = u.stripSpaces(`
                    padding-top: ${s["padding-top"]};
                    padding-left: ${s["padding-left"]};
                    box-sizing: ${s["box-sizing"]};
                    line-height: ${s["line-height"]};
                    font-size: ${s["font-size"]};
                    font-family: ${s["font-family"]};
                `), a.prepend(`<div class="w2ui-enum-placeholder" style="${r}">${n(this.el).attr("placeholder")}</div>`)), a.off(".w2item").on("scroll.w2item", (o) => {
        o = this.trigger("scroll", { target: this.el, originalEvent: o }), o.isCancelled !== true && (F.hide(this.el.id + "_preview"), o.finish());
      }).find(".li-item").on("click.w2item", (o) => {
        var c = n(o.target).closest(".li-item"), d = c.attr("index"), p = this.selected[d];
        if (!n(c).hasClass("li-search")) {
          o.stopPropagation();
          let f;
          if (n(o.target).hasClass("w2ui-list-remove")) n(this.el).prop("readOnly") || n(this.el).prop("disabled") || (f = this.trigger("remove", { target: this.el, originalEvent: o, item: p })).isCancelled !== true && (this.selected.splice(d, 1), n(this.el).trigger("input").trigger("change"), n(o.target).remove());
          else if ((f = this.trigger("click", { target: this.el, originalEvent: o.originalEvent, item: p })).isCancelled !== true) {
            let m = p.tooltip;
            if (this.type === "file" && (/image/i.test(p.type) && (m = `
                                    <div class="w2ui-file-preview">
                                        <img src="${p.content ? "data:" + p.type + ";base64," + p.content : ""}"
                                            style="max-width: 300px">
                                    </div>`), m += `
                                <div class="w2ui-file-info">
                                    <div class="file-caption">${u.lang("Name")}:</div>
                                    <div class="file-value">${p.name}</div>
                                    <div class="file-caption">${u.lang("Size")}:</div>
                                    <div class="file-value">${u.formatSize(p.size)}</div>
                                    <div class="file-caption">${u.lang("Type")}:</div>
                                    <div class="file-value file-type">${p.type}</div>
                                    <div class="file-caption">${u.lang("Modified")}:</div>
                                    <div class="file-value">${u.date(p.modified)}</div>
                                </div>`), m) {
              let b = this.el.id + "_preview";
              F.show({ name: b, anchor: c.get(0), html: m, hideOn: ["doc-click"], class: "" }).show((v) => {
                n(`#w2overlay-${b} img`).on("load", function(g) {
                  var y = this.clientWidth, w = this.clientHeight;
                  y < 300 & w < 300 || (w <= y && 300 < y && n(this).css("width", "300px"), y < w && 300 < w && n(this).css("height", "300px"));
                }).on("error", function(g) {
                  this.style.display = "none";
                });
              });
            }
            f.finish();
          }
        }
      }).on("mouseenter.w2item", (o) => {
        var c = n(o.target).closest(".li-item");
        n(c).hasClass("li-search") || (c = this.selected[n(o.target).attr("index")], (o = this.trigger("mouseEnter", { target: this.el, originalEvent: o, item: c })).isCancelled !== true && o.finish());
      }).on("mouseleave.w2item", (o) => {
        var c = n(o.target).closest(".li-item");
        n(c).hasClass("li-search") || (c = this.selected[n(o.target).attr("index")], (o = this.trigger("mouseLeave", { target: this.el, originalEvent: o, item: c })).isCancelled !== true && o.finish());
      }), this.type === "enum" ? this.helpers.multi.find("input").css({ width: "15px" }) : this.helpers.multi.find(".li-search").hide(), this.resize();
    }
    return Date.now() - t;
  }
  resize() {
    var e = this.el.clientWidth, t = getComputedStyle(this.el), r = this.helpers.search, s = this.helpers.multi, i = this.helpers.suffix, a = this.helpers.prefix, r = (r && n(r).css("width", e), s && n(s).css("width", e - parseInt(t["margin-left"], 10) - parseInt(t["margin-right"], 10)), i && this.addSuffix(), a && this.addPrefix(), this.helpers.multi);
    if (["enum", "file"].includes(this.type) && r) {
      n(this.el).css("height", "auto");
      let l = n(r).find(":scope div.w2ui-multi-items").get(0).clientHeight + 5;
      (l = (l = l < 20 ? 20 : l) > this.tmp["max-height"] ? this.tmp["max-height"] : l) < this.tmp["min-height"] && (l = this.tmp["min-height"]), s = u.getSize(this.el, "height") - 2, s > l && (l = s), n(r).css({ height: l + "px", overflow: l == this.tmp["max-height"] ? "auto" : "hidden" }), n(r).css("height", l + "px"), n(this.el).css({ height: l + "px" });
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
    return e = typeof e != "number" && (t = this.options, e = String(e).trim(), ["int", "float", "money", "currency", "percent"].includes(this.type)) ? (e = typeof e == "string" ? (e = t.autoFormat && (["money", "currency"].includes(this.type) && (e = String(e).replace(t.moneyRE, "")), this.type === "percent" && (e = String(e).replace(t.percentRE, "")), ["int", "float"].includes(this.type)) ? String(e).replace(t.numberRE, "") : e).replace(/\s+/g, "").replace(new RegExp(t.groupSymbol, "g"), "").replace(t.decimalSymbol, ".") : e) !== "" && u.isFloat(e) ? Number(e) : "" : e;
  }
  format(e) {
    var t = this.options;
    if (t.autoFormat && e !== "") {
      switch (this.type) {
        case "money":
        case "currency":
          (e = u.formatNumber(e, t.currencyPrecision, true)) !== "" && (e = t.currencyPrefix + e + t.currencySuffix);
          break;
        case "percent":
          (e = u.formatNumber(e, t.precision, true)) !== "" && (e += "%");
          break;
        case "float":
          e = u.formatNumber(e, t.precision, true);
          break;
        case "int":
          e = u.formatNumber(e, 0, true);
      }
      var s = parseInt(1e3).toLocaleString(u.settings.locale, { useGrouping: true }).slice(1, 2);
      s !== this.options.groupSymbol && (e = e.replaceAll(s, this.options.groupSymbol));
    }
    return e;
  }
  change(e) {
    if (["int", "float", "money", "currency", "percent"].indexOf(this.type) !== -1) {
      var t = n(this.el).val(), s = this.format(this.clean(n(this.el).val()));
      if (t !== "" && t != s) return n(this.el).val(s), e.stopPropagation(), e.preventDefault(), false;
    }
    if (this.type === "color") {
      let i = n(this.el).val();
      i.substr(0, 3).toLowerCase() !== "rgb" && (i = "#" + i, (t = n(this.el).val().length) !== 8) && t !== 6 && t !== 3 && (i = ""), s = n(this.el).get(0).nextElementSibling, n(s).find("div").css("background-color", i), n(this.el).hasClass("has-focus") && this.updateOverlay();
    }
    if (["list", "enum", "file"].indexOf(this.type) !== -1 && this.refresh(), ["date", "time", "datetime"].indexOf(this.type) !== -1) {
      let i = parseInt(this.el.value);
      u.isInt(this.el.value) && 3e3 < i && (this.type === "time" && (i = u.formatTime(new Date(i), this.options.format)), this.type === "date" && (i = u.formatDate(new Date(i), this.options.format)), this.type === "datetime" && (i = u.formatDateTime(new Date(i), this.options.format)), n(this.el).val(i).trigger("input").trigger("change"));
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
        typeof this.options._items_fun == "function" && (this.options.items = u.normMenu.call(this, this.options._items_fun)), this.helpers.search && ((t = this.helpers.search_focus).value = "", t.select()), this.type == "enum" && (t = n(this.el.previousElementSibling).find(".li-search input").get(0), document.activeElement !== t) && t.focus(), this.resize(), e.showMenu === false || this.options.openOnFocus === false && !n(this.el).hasClass("has-focus") || setTimeout(() => {
          this.updateOverlay();
        }, 100);
      }
      var t;
      this.type == "file" && (t = n(this.el).get(0).previousElementSibling, n(t).addClass("has-focus")), n(this.el).addClass("has-focus");
    }
  }
  blur(e) {
    var _a;
    var t, s = n(this.el).val().trim();
    if (n(this.el).removeClass("has-focus"), ["int", "float", "money", "currency", "percent"].includes(this.type) && s !== "") {
      let i = s, a = "";
      this.isStrValid(s) ? (t = this.clean(s), this.options.min != null && t < this.options.min && (i = this.options.min, a = "Should be >= " + this.options.min), this.options.max != null && t > this.options.max && (i = this.options.max, a = "Should be <= " + this.options.max)) : i = "", this.options.autoCorrect && (n(this.el).val(i).trigger("input").trigger("change"), a) && (F.show({ name: this.el.id + "_error", anchor: this.el, html: a }), setTimeout(() => {
        F.hide(this.el.id + "_error");
      }, 3e3));
    }
    ["date", "time", "datetime"].includes(this.type) && this.options.autoCorrect && s !== "" && (t = this.type == "date" ? u.isDate : this.type == "time" ? u.isTime : u.isDateTime, fe.inRange(this.el.value, this.options) && t.bind(u)(this.el.value, this.options.format) || n(this.el).val("").trigger("input").trigger("change")), this.type === "enum" && n(this.helpers.multi).find("input").val("").css("width", "15px"), this.type == "file" && (s = this.el.previousElementSibling, n(s).removeClass("has-focus")), this.type === "list" && (this.el.value = ((_a = this.selected) == null ? void 0 : _a.text) ?? "");
  }
  keyDown(e, a) {
    var s, i = this.options, a = e.keyCode || a && a.keyCode;
    let r = false, l, h, o, c, d, p;
    if (["int", "float", "money", "currency", "percent", "hex", "bin", "color", "alphanumeric"].includes(this.type) && !(e.metaKey || e.ctrlKey || e.altKey || this.isStrValid(e.key ?? "1", true) || [9, 8, 13, 27, 37, 38, 39, 40, 46].includes(e.keyCode))) return e.preventDefault(), e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true, false;
    if (["int", "float", "money", "currency", "percent"].includes(this.type)) {
      if (!i.keyboard || n(this.el).prop("readOnly") || n(this.el).prop("disabled")) return;
      switch (l = parseFloat(n(this.el).val().replace(i.moneyRE, "")) || 0, h = i.step, (e.ctrlKey || e.metaKey) && (h = 10 * i.step), a) {
        case 38:
          e.shiftKey || (d = l + h <= i.max || i.max == null ? Number((l + h).toFixed(12)) : i.max, n(this.el).val(d).trigger("input").trigger("change"), r = true);
          break;
        case 40:
          e.shiftKey || (d = l - h >= i.min || i.min == null ? Number((l - h).toFixed(12)) : i.min, n(this.el).val(d).trigger("input").trigger("change"), r = true);
      }
      r && (e.preventDefault(), this.moveCaret2end());
    }
    if (["date", "datetime"].includes(this.type)) {
      if (!i.keyboard || n(this.el).prop("readOnly") || n(this.el).prop("disabled")) return;
      var f = (this.type == "date" ? u.isDate : u.isDateTime).bind(u), m = (this.type == "date" ? u.formatDate : u.formatDateTime).bind(u);
      switch (o = 864e5, h = 1, (e.ctrlKey || e.metaKey) && (h = 10), (c = f(n(this.el).val(), i.format, true)) || (c = /* @__PURE__ */ new Date(), o = 0), a) {
        case 38:
          e.shiftKey || (h == 10 ? c.setMonth(c.getMonth() + 1) : c.setTime(c.getTime() + o), p = m(c.getTime(), i.format), n(this.el).val(p).trigger("input").trigger("change"), r = true);
          break;
        case 40:
          e.shiftKey || (h == 10 ? c.setMonth(c.getMonth() - 1) : c.setTime(c.getTime() - o), p = m(c.getTime(), i.format), n(this.el).val(p).trigger("input").trigger("change"), r = true);
      }
      r && (e.preventDefault(), this.moveCaret2end(), this.updateOverlay());
    }
    if (this.type === "time") {
      if (!i.keyboard || n(this.el).prop("readOnly") || n(this.el).prop("disabled")) return;
      h = e.ctrlKey || e.metaKey ? 60 : 1, l = n(this.el).val();
      let b = fe.str2min(l) || fe.str2min((/* @__PURE__ */ new Date()).getHours() + ":" + ((/* @__PURE__ */ new Date()).getMinutes() - 1));
      switch (a) {
        case 38:
          e.shiftKey || (b += h, r = true);
          break;
        case 40:
          e.shiftKey || (b -= h, r = true);
      }
      r && (e.preventDefault(), n(this.el).val(fe.min2str(b)).trigger("input").trigger("change"), this.moveCaret2end());
    }
    if (["list", "enum"].includes(this.type)) switch (a) {
      case 8:
      case 46:
        this.type == "list" ? n(this.helpers.search_focus).val() == "" && (this.selected = null, W.hide(this.el.id + "_menu"), n(this.el).val("").trigger("input").trigger("change")) : n(this.helpers.multi).find("input").val() == "" && (W.hide(this.el.id + "_menu"), this.selected.pop(), (s = W.get(this.el.id + "_menu")) && (s.options.selected = this.selected), this.refresh());
        break;
      case 9:
      case 16:
        break;
      case 27:
        W.hide(this.el.id + "_menu"), this.refresh();
    }
  }
  keyUp(e) {
    var _a, _b;
    if (this.type == "list") {
      let i = n(this.helpers.search_focus);
      i.val() !== "" ? n(this.el).attr("placeholder", "") : n(this.el).attr("placeholder", this.tmp.pholder), e.keyCode == 13 && setTimeout(() => {
        i.val(""), W.hide(this.el.id + "_menu"), this.refresh();
      }, 1), [38, 40].includes(e.keyCode) && !this.tmp.overlay.overlay.displayed && this.updateOverlay(), this.refresh();
    }
    var t, s;
    this.type == "combo" && this.updateOverlay(), this.type == "enum" && (t = this.helpers.multi.find("input"), s = getComputedStyle(t.get(0)), s = u.getStrWidth(t.val(), `font-family: ${s["font-family"]}; font-size: ${s["font-size"]};`), t.css({ width: s + 15 + "px" }), this.resize(), [38, 40].includes(e.keyCode)) && !((_b = (_a = this.tmp.overlay) == null ? void 0 : _a.overlay) == null ? void 0 : _b.displayed) && this.updateOverlay();
  }
  findItemIndex(e, t, s) {
    let i = [];
    var a;
    return s = s || [], ["list", "combo", "enum"].includes(this.type) && this.options.url && (a = W.get(this.el.id + "_menu")) && (e = a.options.items, this.options.items = e), e.forEach((r, l) => {
      r.id === t && (i = s.concat([l]), this.options.index = [l]), i.length == 0 && r.items && 0 < r.items.length && (s.push(l), i = this.findItemIndex(r.items, t, s), s.pop());
    }), i;
  }
  updateOverlay(e) {
    let t = this.options;
    if (this.type === "color") {
      if (n(this.el).prop("readOnly") || n(this.el).prop("disabled")) return;
      ct.show(u.extend({ name: this.el.id + "_color", anchor: this.el, transparent: t.transparent, advanced: t.advanced, color: this.el.value, liveUpdate: true }, this.options)).select((i) => {
        i = i.detail.color, n(this.el).val(i).trigger("input").trigger("change");
      }).liveUpdate((i) => {
        i = i.detail.color, n(this.helpers.suffix).find(":scope > div").css("background-color", "#" + i);
      });
    }
    if (["list", "combo", "enum"].includes(this.type)) {
      var s;
      this.el;
      let i = this.el;
      this.type === "enum" && (s = this.helpers.multi.get(0), i = n(s).find("input").get(0)), this.type === "list" && (s = this.selected, u.isPlainObject(s) && 0 < Object.keys(s).length && 0 < (s = this.findItemIndex(t.items, s.id)).length && (t.index = s), i = this.helpers.search_focus), !n(this.el).hasClass("has-focus") || this.el.readOnly || this.el.disabled || (s = u.extend({}, t, { name: this.el.id + "_menu", anchor: i, selected: this.selected, search: false, render: t.renderDrop, anchorClass: "", offsetY: 5, maxHeight: t.maxDropHeight, maxWidth: t.maxDropWidth, minWidth: t.minDropWidth }), this.tmp.overlay = W.show(s).select((a) => {
        var _a;
        var r, l;
        ["list", "combo"].includes(this.type) ? (this.selected = a.detail.item, n(i).val(""), n(this.el).val(this.selected.text).trigger("input").trigger("change"), this.focus({ showMenu: false })) : (l = this.selected, (r = (_a = a.detail) == null ? void 0 : _a.item) && (a = this.trigger("add", { target: this.el, item: r, originalEvent: a })).isCancelled !== true && (l.length >= t.max && 0 < t.max && l.pop(), delete r.hidden, l.push(r), n(this.el).trigger("input").trigger("change"), n(this.helpers.multi).find("input").val(""), (l = W.get(this.el.id + "_menu")) && (l.options.selected = this.selected), a.finish()));
      }));
    }
    !["date", "time", "datetime"].includes(this.type) || n(this.el).prop("readOnly") || n(this.el).prop("disabled") || fe.show(u.extend({ name: this.el.id + "_date", anchor: this.el, value: this.el.value }, this.options)).select((i) => {
      i = i.detail.date, i != null && n(this.el).val(i).trigger("input").trigger("change");
    });
  }
  isStrValid(e, t) {
    let s = true;
    switch (this.type) {
      case "int":
        s = !(!t || !["-", this.options.groupSymbol].includes(e)) || u.isInt(e.replace(this.options.numberRE, ""));
        break;
      case "percent":
        e = e.replace(/%/g, "");
      case "float":
        s = !(!t || !["-", "", this.options.decimalSymbol, this.options.groupSymbol].includes(e)) || u.isFloat(e.replace(this.options.numberRE, ""));
        break;
      case "money":
      case "currency":
        s = !(!t || !["-", this.options.decimalSymbol, this.options.groupSymbol, this.options.currencyPrefix, this.options.currencySuffix].includes(e)) || u.isFloat(e.replace(this.options.moneyRE, ""));
        break;
      case "bin":
        s = u.isBin(e);
        break;
      case "color":
      case "hex":
        s = u.isHex(e);
        break;
      case "alphanumeric":
        s = u.isAlphaNumeric(e);
    }
    return s;
  }
  addPrefix() {
    var e, t;
    this.options.prefix && (t = getComputedStyle(this.el), this.tmp["old-padding-left"] == null && (this.tmp["old-padding-left"] = t["padding-left"]), this.helpers.prefix && n(this.helpers.prefix).remove(), n(this.el).before(`<div class="w2ui-field-helper">${this.options.prefix}</div>`), e = n(this.el).get(0).previousElementSibling, n(e).css({ color: t.color, "font-family": t["font-family"], "font-size": t["font-size"], height: this.el.clientHeight + "px", "padding-top": t["padding-top"], "padding-bottom": t["padding-bottom"], "padding-left": this.tmp["old-padding-left"], "padding-right": 0, "margin-top": parseInt(t["margin-top"], 10) + 2 + "px", "margin-bottom": parseInt(t["margin-bottom"], 10) + 1 + "px", "margin-left": t["margin-left"], "margin-right": 0, "z-index": 1 }), n(this.el).css("padding-left", e.clientWidth + "px !important"), this.helpers.prefix = e);
  }
  addSuffix() {
    if (this.options.suffix || this.options.arrow) {
      let s, i = this;
      var e = getComputedStyle(this.el), t = (this.tmp["old-padding-right"] == null && (this.tmp["old-padding-right"] = e["padding-right"]), parseInt(e["padding-right"] || 0));
      this.options.arrow && (this.helpers.arrow && n(this.helpers.arrow).remove(), n(this.el).after('<div class="w2ui-field-helper" style="border: 1px solid transparent">&#160;    <div class="w2ui-field-up" type="up">        <div class="arrow-up" type="up"></div>    </div>    <div class="w2ui-field-down" type="down">        <div class="arrow-down" type="down"></div>    </div></div>'), s = n(this.el).get(0).nextElementSibling, n(s).css({ color: e.color, "font-family": e["font-family"], "font-size": e["font-size"], height: this.el.clientHeight + "px", padding: 0, "margin-top": parseInt(e["margin-top"], 10) + 1 + "px", "margin-bottom": 0, "border-left": "1px solid silver", width: "16px", transform: "translateX(-100%)" }).on("mousedown", function(a) {
        n(a.target).hasClass("arrow-up") && i.keyDown(a, { keyCode: 38 }), n(a.target).hasClass("arrow-down") && i.keyDown(a, { keyCode: 40 });
      }), t += s.clientWidth, n(this.el).css("padding-right", t + "px !important"), this.helpers.arrow = s), this.options.suffix !== "" && (this.helpers.suffix && n(this.helpers.suffix).remove(), n(this.el).after(`<div class="w2ui-field-helper">${this.options.suffix}</div>`), s = n(this.el).get(0).nextElementSibling, n(s).css({ color: e.color, "font-family": e["font-family"], "font-size": e["font-size"], height: this.el.clientHeight + "px", "padding-top": e["padding-top"], "padding-bottom": e["padding-bottom"], "padding-left": 0, "padding-right": e["padding-right"], "margin-top": parseInt(e["margin-top"], 10) + 2 + "px", "margin-bottom": parseInt(e["margin-bottom"], 10) + 1 + "px", transform: "translateX(-100%)" }), n(this.el).css("padding-right", s.clientWidth + "px !important"), this.helpers.suffix = s);
    }
  }
  addSearch() {
    if (this.type === "list") {
      this.helpers.search && n(this.helpers.search).remove();
      let s = parseInt(n(this.el).attr("tabIndex")), i = (isNaN(s) || s === -1 || (this.tmp["old-tabIndex"] = s), (s = this.tmp["old-tabIndex"] ? this.tmp["old-tabIndex"] : s) != null && !isNaN(s) || (s = 0), "");
      var e = `
            <div class="w2ui-field-helper">
                <span class="w2ui-icon w2ui-icon-search"></span>
                <input ${i = n(this.el).attr("id") != null ? 'id="' + n(this.el).attr("id") + '_search"' : i} type="text" tabIndex="${s}" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"/>
            </div>`, e = (n(this.el).attr("tabindex", -1).before(e), n(this.el).get(0).previousElementSibling), t = (this.helpers.search = e, this.helpers.search_focus = n(e).find("input").get(0), getComputedStyle(this.el));
      n(e).css({ width: this.el.clientWidth + "px", "margin-top": t["margin-top"], "margin-left": t["margin-left"], "margin-bottom": t["margin-bottom"], "margin-right": t["margin-right"] }).find("input").css({ cursor: "default", width: "100%", opacity: 1, padding: t.padding, margin: t.margin, border: "1px solid transparent", "background-color": "transparent" }), n(e).find("input").off(".helper").on("focus.helper", (a) => {
        n(a.target).val(""), this.tmp.pholder = n(this.el).attr("placeholder") ?? "", this.focus(a), a.stopPropagation();
      }).on("blur.helper", (a) => {
        n(a.target).val(""), this.tmp.pholder != null && n(this.el).attr("placeholder", this.tmp.pholder), this.blur(a), a.stopPropagation();
      }).on("keydown.helper", (a) => {
        this.keyDown(a);
      }).on("keyup.helper", (a) => {
        this.keyUp(a);
      }), n(e).on("click", (a) => {
        n(a.target).find("input").focus();
      });
    }
  }
  addMultiSearch() {
    if (["enum", "file"].includes(this.type)) {
      n(this.helpers.multi).remove();
      let a = "";
      var e, t, s = getComputedStyle(this.el), i = u.stripSpaces(`
            margin-top: 0px;
            margin-bottom: 0px;
            margin-left: ${s["margin-left"]};
            margin-right: ${s["margin-right"]};
            width: ${u.getSize(this.el, "width") - parseInt(s["margin-left"], 10) - parseInt(s["margin-right"], 10)}px;
        `);
      this.tmp["min-height"] == null && (e = this.tmp["min-height"] = parseInt((s["min-height"] != "none" ? s["min-height"] : 0) || 0), t = parseInt(s.height), this.tmp["min-height"] = Math.max(e, t)), this.tmp["max-height"] == null && s["max-height"] != "none" && (this.tmp["max-height"] = parseInt(s["max-height"]));
      let r = "", l = (n(this.el).attr("id") != null && (r = `id="${n(this.el).attr("id")}_search"`), parseInt(n(this.el).attr("tabIndex"))), h = (isNaN(l) || l === -1 || (this.tmp["old-tabIndex"] = l), (l = this.tmp["old-tabIndex"] ? this.tmp["old-tabIndex"] : l) != null && !isNaN(l) || (l = 0), this.type === "enum" && (a = `
            <div class="w2ui-field-helper w2ui-list" style="${i}">
                <div class="w2ui-multi-items">
                    <div class="li-search">
                        <input ${r} type="text" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                            tabindex="${l}"
                            ${n(this.el).prop("readOnly") ? "readonly" : ""}
                            ${n(this.el).prop("disabled") ? "disabled" : ""}>
                    </div>
                </div>
            </div>`), this.type === "file" && (a = `
            <div class="w2ui-field-helper w2ui-list" style="${i}">
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
                            tabindex="${l}"
                            ${n(this.el).prop("readOnly") ? "readonly" : ""}
                            ${n(this.el).prop("disabled") ? "disabled" : ""}>
                    </div>
                </div>
            </div>`), this.tmp["old-background-color"] = s["background-color"], this.tmp["old-border-color"] = s["border-color"], n(this.el).before(a).css({ "border-color": "transparent", "background-color": "transparent" }), n(this.el.previousElementSibling));
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
        n(this.el).prop("readOnly") || n(this.el).prop("disabled") || (h.removeClass("w2ui-file-dragover"), Array.from(o.dataTransfer.files).forEach((c) => {
          this.addFile(c);
        }), this.focus(o), o.preventDefault(), o.stopPropagation());
      }).on("dragover.drag", (o) => {
        o.preventDefault(), o.stopPropagation();
      }).on("change.drag", (o) => {
        o.target.files !== void 0 && Array.from(o.target.files).forEach((c) => {
          this.addFile(c);
        }), this.focus(o);
      }), this.refresh();
    }
  }
  addFile(e) {
    var t = this.options, s = this.selected;
    let i = { name: e.name, type: e.type, modified: e.lastModifiedDate, size: e.size, content: null, file: e }, a = 0, r = 0, l = [], h = (Array.isArray(s) && s.forEach((o) => {
      o.name == e.name && o.size == e.size && l.push(u.lang('The file "${name}" (${size}) is already added.', { name: e.name, size: u.formatSize(e.size) })), a += o.size, r++;
    }), t.maxFileSize !== 0 && i.size > t.maxFileSize && l.push(u.lang("Maximum file size is ${size}", { size: u.formatSize(t.maxFileSize) })), t.maxSize !== 0 && a + i.size > t.maxSize && l.push(u.lang("Maximum total size is ${size}", { size: u.formatSize(t.maxSize) })), t.max !== 0 && r >= t.max && l.push(u.lang("Maximum number of files is ${count}", { count: t.max })), this.trigger("add", { target: this.el, file: i, total: r, totalSize: a, errors: l }));
    if (h.isCancelled !== true) if (t.silent !== true && 0 < l.length) F.show({ anchor: this.el, html: "Errors: " + l.join("<br>") }), console.log("ERRORS (while adding files): ", l);
    else if (s.push(i), typeof FileReader < "u" && t.readContent === true) {
      s = new FileReader();
      let o = this;
      s.onload = function(d) {
        var d = d.target.result, p = d.indexOf(",");
        i.content = d.substr(p + 1), o.refresh(), n(o.el).trigger("input").trigger("change"), h.finish();
      }, s.readAsDataURL(e);
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
const Ye = globalThis, Qe = (x) => x, De = Ye.trustedTypes, et = De ? De.createPolicy("lit-html", { createHTML: (x) => x }) : void 0, ht = "$lit$", se = `lit$${Math.random().toFixed(9).slice(2)}$`, dt = "?" + se, Mt = `<${dt}>`, ce = document, ve = () => ce.createComment(""), ye = (x) => x === null || typeof x != "object" && typeof x != "function", qe = Array.isArray, Ft = (x) => qe(x) || typeof (x == null ? void 0 : x[Symbol.iterator]) == "function", Le = `[ 	
\f\r]`, ge = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, tt = /-->/g, st = />/g, ae = RegExp(`>|${Le}(?:([^\\s"'>=/]+)(${Le}*=${Le}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), it = /'/g, at = /"/g, ut = /^(?:script|style|textarea|title)$/i, Nt = (x) => (e, ...t) => ({ _$litType$: x, strings: e, values: t }), Ie = Nt(1), we = Symbol.for("lit-noChange"), q = Symbol.for("lit-nothing"), rt = /* @__PURE__ */ new WeakMap(), le = ce.createTreeWalker(ce, 129);
function pt(x, e) {
  if (!qe(x) || !x.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return et !== void 0 ? et.createHTML(e) : e;
}
const Lt = (x, e) => {
  const t = x.length - 1, s = [];
  let i, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = ge;
  for (let l = 0; l < t; l++) {
    const h = x[l];
    let o, c, d = -1, p = 0;
    for (; p < h.length && (r.lastIndex = p, c = r.exec(h), c !== null); ) p = r.lastIndex, r === ge ? c[1] === "!--" ? r = tt : c[1] !== void 0 ? r = st : c[2] !== void 0 ? (ut.test(c[2]) && (i = RegExp("</" + c[2], "g")), r = ae) : c[3] !== void 0 && (r = ae) : r === ae ? c[0] === ">" ? (r = i ?? ge, d = -1) : c[1] === void 0 ? d = -2 : (d = r.lastIndex - c[2].length, o = c[1], r = c[3] === void 0 ? ae : c[3] === '"' ? at : it) : r === at || r === it ? r = ae : r === tt || r === st ? r = ge : (r = ae, i = void 0);
    const f = r === ae && x[l + 1].startsWith("/>") ? " " : "";
    a += r === ge ? h + Mt : d >= 0 ? (s.push(o), h.slice(0, d) + ht + h.slice(d) + se + f) : h + se + (d === -2 ? l : f);
  }
  return [pt(x, a + (x[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class xe {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let a = 0, r = 0;
    const l = e.length - 1, h = this.parts, [o, c] = Lt(e, t);
    if (this.el = xe.createElement(o, s), le.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = le.nextNode()) !== null && h.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(ht)) {
          const p = c[r++], f = i.getAttribute(d).split(se), m = /([.?@])?(.*)/.exec(p);
          h.push({ type: 1, index: a, name: m[2], strings: f, ctor: m[1] === "." ? Ht : m[1] === "?" ? Pt : m[1] === "@" ? Bt : ze }), i.removeAttribute(d);
        } else d.startsWith(se) && (h.push({ type: 6, index: a }), i.removeAttribute(d));
        if (ut.test(i.tagName)) {
          const d = i.textContent.split(se), p = d.length - 1;
          if (p > 0) {
            i.textContent = De ? De.emptyScript : "";
            for (let f = 0; f < p; f++) i.append(d[f], ve()), le.nextNode(), h.push({ type: 2, index: ++a });
            i.append(d[p], ve());
          }
        }
      } else if (i.nodeType === 8) if (i.data === dt) h.push({ type: 2, index: a });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(se, d + 1)) !== -1; ) h.push({ type: 7, index: a }), d += se.length - 1;
      }
      a++;
    }
  }
  static createElement(e, t) {
    const s = ce.createElement("template");
    return s.innerHTML = e, s;
  }
}
function pe(x, e, t = x, s) {
  var _a, _b;
  if (e === we) return e;
  let i = s !== void 0 ? (_a = t._$Co) == null ? void 0 : _a[s] : t._$Cl;
  const a = ye(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== a && ((_b = i == null ? void 0 : i._$AO) == null ? void 0 : _b.call(i, false), a === void 0 ? i = void 0 : (i = new a(x), i._$AT(x, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = pe(x, i._$AS(x, e.values), i, s)), e;
}
class jt {
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
    const { el: { content: t }, parts: s } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? ce).importNode(t, true);
    le.currentNode = i;
    let a = le.nextNode(), r = 0, l = 0, h = s[0];
    for (; h !== void 0; ) {
      if (r === h.index) {
        let o;
        h.type === 2 ? o = new _e(a, a.nextSibling, this, e) : h.type === 1 ? o = new h.ctor(a, h.name, h.strings, this, e) : h.type === 6 && (o = new Ut(a, this, e)), this._$AV.push(o), h = s[++l];
      }
      r !== (h == null ? void 0 : h.index) && (a = le.nextNode(), r++);
    }
    return le.currentNode = ce, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class _e {
  get _$AU() {
    var _a;
    return ((_a = this._$AM) == null ? void 0 : _a._$AU) ?? this._$Cv;
  }
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = q, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? true;
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
    e = pe(this, e, t), ye(e) ? e === q || e == null || e === "" ? (this._$AH !== q && this._$AR(), this._$AH = q) : e !== this._$AH && e !== we && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ft(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== q && ye(this._$AH) ? this._$AA.nextSibling.data = e : this.T(ce.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var _a;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = xe.createElement(pt(s.h, s.h[0]), this.options)), s);
    if (((_a = this._$AH) == null ? void 0 : _a._$AD) === i) this._$AH.p(t);
    else {
      const a = new jt(i, this), r = a.u(this.options);
      a.p(t), this.T(r), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = rt.get(e.strings);
    return t === void 0 && rt.set(e.strings, t = new xe(e)), t;
  }
  k(e) {
    qe(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const a of e) i === t.length ? t.push(s = new _e(this.O(ve()), this.O(ve()), this, this.options)) : s = t[i], s._$AI(a), i++;
    i < t.length && (this._$AR(s && s._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var _a;
    for ((_a = this._$AP) == null ? void 0 : _a.call(this, false, true, t); e !== this._$AB; ) {
      const s = Qe(e).nextSibling;
      Qe(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var _a;
    this._$AM === void 0 && (this._$Cv = e, (_a = this._$AP) == null ? void 0 : _a.call(this, e));
  }
}
class ze {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, a) {
    this.type = 1, this._$AH = q, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = a, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = q;
  }
  _$AI(e, t = this, s, i) {
    const a = this.strings;
    let r = false;
    if (a === void 0) e = pe(this, e, t, 0), r = !ye(e) || e !== this._$AH && e !== we, r && (this._$AH = e);
    else {
      const l = e;
      let h, o;
      for (e = a[0], h = 0; h < a.length - 1; h++) o = pe(this, l[s + h], t, h), o === we && (o = this._$AH[h]), r || (r = !ye(o) || o !== this._$AH[h]), o === q ? e = q : e !== q && (e += (o ?? "") + a[h + 1]), this._$AH[h] = o;
    }
    r && !i && this.j(e);
  }
  j(e) {
    e === q ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ht extends ze {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === q ? void 0 : e;
  }
}
class Pt extends ze {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== q);
  }
}
class Bt extends ze {
  constructor(e, t, s, i, a) {
    super(e, t, s, i, a), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = pe(this, e, t, 0) ?? q) === we) return;
    const s = this._$AH, i = e === q && s !== q || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, a = e !== q && (s === q || i);
    i && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var _a;
    typeof this._$AH == "function" ? this._$AH.call(((_a = this.options) == null ? void 0 : _a.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ut {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    pe(this, e);
  }
}
const Yt = Ye.litHtmlPolyfillSupport;
Yt == null ? void 0 : Yt(xe, _e), (Ye.litHtmlVersions ?? (Ye.litHtmlVersions = [])).push("3.3.2");
const qt = (x, e, t) => {
  const s = e;
  let i = s._$litPart$;
  return i === void 0 && (s._$litPart$ = i = new _e(e.insertBefore(ve(), null), null, void 0, {})), i._$AI(x), i;
};
function hs({ buttons: x, clickedButton: e, author: t, sourceCode: s }) {
  const i = document.createElement("div");
  function a() {
    return Ct() === "dark" ? "\u2600" : "\u263E";
  }
  const r = Ie`
    <div class="buttons-container">
      <button class="btn btn-icon" @click=${o}>
        ${Wt()}
      </button>
      ${x == null ? void 0 : x.map((c) => Ie`<button class="btn btn-text" @click=${l}>
            ${c}
          </button>`)}
      <button class="btn btn-text btn-theme" @click=${h} title="Toggle light/dark theme">
        ${a()}
      </button>
    </div>

    <div id="dropdown-menu" style="display: none;">
      <a
        href="${s || "https://github.com/GiorgioBurbanelli89/awatif-workspace"}"
        class="dropdown-link"
        >Hekatan Struct Lineal — Source Code</a
      >
      ${t ? Ie`<a href="${t}" class="dropdown-link">Contacto · Jorge Burbano (LinkedIn)</a>` : ""}
      <a href="https://github.com/madil4/awatif/tree/v2.0.0" class="dropdown-link"
        >Based on awatif v2.0.0</a
      >
    </div>
  `;
  i.id = "toolbar", qt(r, i), Pe((c) => {
    const d = i.querySelector(".btn-theme");
    d && (d.textContent = c === "dark" ? "\u2600" : "\u263E");
  });
  function l(c) {
    const d = c.target;
    e.val = "", setTimeout(() => e.val = d.innerText);
  }
  function h() {
    _t();
  }
  function o(c) {
    const d = document.getElementById("dropdown-menu");
    d.style.display = d.style.display === "block" ? "none" : "block";
  }
  return i;
}
function Wt() {
  return Ie`<img src="${"/hekatan-struct-lineal/"}img/hekatan-lockup.png" alt="Hekatan Struct"
    style="height:28px;width:auto;border-radius:6px;display:block;">`;
}
const Xt = { id: "ollama", name: "\u{1F999} Ollama (local, gratis)", supportsVision: true, models: [{ id: "qwen2.5-coder:7b", name: "Qwen 2.5 Coder 7B (c\xF3digo)", vision: false }, { id: "llama3.2-vision:11b", name: "Llama 3.2 Vision 11B", vision: true }, { id: "llava:7b", name: "LLaVA 7B (vision)", vision: true }, { id: "qwen2.5:7b", name: "Qwen 2.5 7B", vision: false }, { id: "llama3.1:8b", name: "Llama 3.1 8B", vision: false }], defaultModel: "qwen2.5-coder:7b", requiresKey: false, requiresLocal: true, async send({ msg: x, system: e, model: t }) {
  var _a, _b;
  const s = { role: "user", content: x.text };
  ((_a = x.images) == null ? void 0 : _a.length) && (s.images = x.images.map((r) => r.base64));
  let i;
  try {
    i = await fetch("http://localhost:11434/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ model: t, messages: [{ role: "system", content: e }, s], stream: false }) });
  } catch {
    throw new Error(`Ollama no est\xE1 corriendo en localhost:11434.

Para usar Ollama:
1. Descargalo de ollama.com/download
2. Instal\xE1 un modelo: ollama pull ` + t + `
3. Verific\xE1 que est\xE9 activo (Ollama corre como servicio en background)

O cambi\xE1 a otro provider (Gemini/Groq/OpenRouter) que solo requiere API key.`);
  }
  if (!i.ok) {
    const r = await i.text();
    throw i.status === 404 ? new Error(`Modelo "${t}" no instalado. Ejecut\xE1: ollama pull ${t}`) : new Error(`Ollama error ${i.status}: ${r}`);
  }
  return ((_b = (await i.json()).message) == null ? void 0 : _b.content) ?? "";
} };
async function ds() {
  try {
    const x = new AbortController(), e = setTimeout(() => x.abort(), 1500), t = await fetch("http://localhost:11434/api/tags", { signal: x.signal }).catch(() => null);
    return clearTimeout(e), !t || !t.ok ? [] : ((await t.json()).models ?? []).map((i) => i.name);
  } catch {
    return [];
  }
}
let Te = null;
function us() {
  if (Te) return Te;
  const x = typeof location < "u" ? location.hostname : "";
  return Te = x === "localhost" || x === "127.0.0.1" || x === "" || location.protocol === "file:" ? Vt() : Promise.resolve(false), Te;
}
async function Vt() {
  try {
    const x = new AbortController(), e = setTimeout(() => x.abort(), 1e3), t = await fetch("http://localhost:11434/api/tags", { signal: x.signal }).catch(() => null);
    return clearTimeout(e), !!t && t.ok;
  } catch {
    return false;
  }
}
const Kt = { id: "gemini", name: "\u2728 Gemini Flash (free tier)", supportsVision: true, models: [{ id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (m\xE1s nuevo)", vision: true }, { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (estable)", vision: true }, { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (mejor calidad)", vision: true }], defaultModel: "gemini-2.0-flash-exp", requiresKey: true, requiresLocal: false, async send({ msg: x, system: e, apiKey: t, model: s }) {
  var _a, _b, _c, _d, _e2;
  const i = [{ text: x.text }];
  for (const l of x.images ?? []) i.push({ inline_data: { mime_type: l.mimeType, data: l.base64 } });
  const a = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${s}:generateContent?key=${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ systemInstruction: { parts: [{ text: e }] }, contents: [{ role: "user", parts: i }], generationConfig: { temperature: 0.2, maxOutputTokens: 4096 } }) });
  if (!a.ok) throw new Error(`Gemini error ${a.status}: ${await a.text()}`);
  return ((_e2 = (_d = (_c = (_b = (_a = (await a.json()).candidates) == null ? void 0 : _a[0]) == null ? void 0 : _b.content) == null ? void 0 : _c.parts) == null ? void 0 : _d[0]) == null ? void 0 : _e2.text) ?? "";
} }, Gt = { id: "groq", name: "\u26A1 Groq (r\xE1pido, free)", supportsVision: true, models: [{ id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (m\xE1s capaz)", vision: false }, { id: "llama-3.2-90b-vision-preview", name: "Llama 3.2 90B Vision", vision: true }, { id: "llama-3.1-70b-versatile", name: "Llama 3.1 70B", vision: false }, { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", vision: false }], defaultModel: "llama-3.3-70b-versatile", requiresKey: true, requiresLocal: false, async send({ msg: x, system: e, apiKey: t, model: s }) {
  var _a, _b, _c, _d;
  const i = [{ type: "text", text: x.text }];
  for (const l of x.images ?? []) i.push({ type: "image_url", image_url: { url: `data:${l.mimeType};base64,${l.base64}` } });
  const a = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { Authorization: `Bearer ${t}`, "content-type": "application/json" }, body: JSON.stringify({ model: s, messages: [{ role: "system", content: e }, { role: "user", content: ((_a = x.images) == null ? void 0 : _a.length) ? i : x.text }], temperature: 0.2, max_tokens: 4096 }) });
  if (!a.ok) throw new Error(`Groq error ${a.status}: ${await a.text()}`);
  return ((_d = (_c = (_b = (await a.json()).choices) == null ? void 0 : _b[0]) == null ? void 0 : _c.message) == null ? void 0 : _d.content) ?? "";
} }, Jt = { id: "openrouter", name: "\u{1F310} OpenRouter (modelos free)", supportsVision: true, models: [{ id: "deepseek/deepseek-chat-v3:free", name: "DeepSeek V3 free (excelente c\xF3digo)", vision: false }, { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B free", vision: false }, { id: "meta-llama/llama-3.2-90b-vision-instruct:free", name: "Llama 3.2 90B Vision free", vision: true }, { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash free", vision: true }, { id: "qwen/qwen-2.5-coder-32b-instruct:free", name: "Qwen 2.5 Coder 32B free", vision: false }], defaultModel: "deepseek/deepseek-chat-v3:free", requiresKey: true, requiresLocal: false, async send({ msg: x, system: e, apiKey: t, model: s }) {
  var _a, _b, _c, _d;
  const i = [{ type: "text", text: x.text }];
  for (const l of x.images ?? []) i.push({ type: "image_url", image_url: { url: `data:${l.mimeType};base64,${l.base64}` } });
  const a = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { Authorization: `Bearer ${t}`, "content-type": "application/json", "HTTP-Referer": "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/", "X-Title": "Hekatan Struct Lineal" }, body: JSON.stringify({ model: s, messages: [{ role: "system", content: e }, { role: "user", content: ((_a = x.images) == null ? void 0 : _a.length) ? i : x.text }], temperature: 0.2, max_tokens: 4096 }) });
  if (!a.ok) throw new Error(`OpenRouter error ${a.status}: ${await a.text()}`);
  return ((_d = (_c = (_b = (await a.json()).choices) == null ? void 0 : _b[0]) == null ? void 0 : _c.message) == null ? void 0 : _d.content) ?? "";
} }, Zt = [Xt, Kt, Gt, Jt];
function ps(x) {
  return Zt.find((e) => e.id === x) ?? null;
}
const de = "hekatan_ai_", te = { getKey(x) {
  return localStorage.getItem(`${de}key_${x}`) ?? "";
}, setKey(x, e) {
  localStorage.setItem(`${de}key_${x}`, e);
}, getProvider() {
  return localStorage.getItem(`${de}provider`) ?? "ollama";
}, setProvider(x) {
  localStorage.setItem(`${de}provider`, x);
}, getModel(x) {
  return localStorage.getItem(`${de}model_${x}`) ?? "";
}, setModel(x, e) {
  localStorage.setItem(`${de}model_${x}`, e);
} };
function ms(x) {
  return new Promise((e, t) => {
    const s = new FileReader();
    s.onload = () => {
      const i = s.result, a = i.indexOf(",");
      e(a >= 0 ? i.slice(a + 1) : i);
    }, s.onerror = () => t(s.error), s.readAsDataURL(x);
  });
}
const fs = `Eres un asistente experto en estructuras y FEM que ayuda al usuario a generar modelos
en Hekatan Struct Lineal. Tu salida debe ser SIEMPRE un script CLI ejecutable, sin
explicaciones extra (a menos que el user pida explicaci\xF3n).

DSL CLI de Hekatan:
\u2500 NODOS:        node <id>  <x>  <y>  <z>
\u2500 FRAMES:       frame <id>  <nodeI>  <nodeJ>  <E>  <A>  <Iy>  [Iz]  [J]
                Ejemplo: frame 1  1 2  25e6  0.16  0.0021
\u2500 SHELLS Q4:    shell <id>  <n1> <n2> <n3> <n4>  <thickness>  <E>
\u2500 APOYOS:       support <nodeId>  <Ux>  <Uy>  <Uz>  <Rx>  <Ry>  <Rz>
                (1 = restringido, 0 = libre)
\u2500 CARGAS:       load <nodeId>  <Fx>  <Fy>  <Fz>  <Mx>  <My>  <Mz>
\u2500 COMENTARIOS:  # comentario libre

Convenci\xF3n de ejes (Z-up):
\u2500 X: horizontal este
\u2500 Y: horizontal norte
\u2500 Z: vertical (gravedad = -Z)

Materiales t\xEDpicos (E = MPa = N/mm\xB2 \xD7 1e6 = Pa, en unidades SI):
\u2500 Hormig\xF3n: E = 25e9 Pa (25 GPa, f'c=210 kg/cm\xB2)
\u2500 Acero:    E = 210e9 Pa
\u2500 Madera:   E = 12e9 Pa (var\xEDa por especie)

Secciones t\xEDpicas:
\u2500 Columna 40\xD740: A=0.16 m\xB2, Iy=Iz=2.13e-3 m\u2074
\u2500 Viga 25\xD740:   A=0.10 m\xB2, Iy=1.33e-3, Iz=5.21e-4
\u2500 HEB-240:      A=0.0106, Iy=1.13e-4, Iz=3.92e-5
\u2500 IPE-300:      A=0.00538, Iy=8.36e-5, Iz=6.04e-6

Si el user pega una IMAGEN (croquis, plano, foto):
\u2500 Identific\xE1 geometr\xEDa, dimensiones, ejes, apoyos, cargas visibles
\u2500 Gener\xE1 el script CLI completo con coordenadas extra\xEDdas
\u2500 Si las dimensiones no son legibles, us\xE1 valores t\xEDpicos y comenta tu suposici\xF3n

REGLAS DE SALIDA:
1. Devuelve SOLO el script CLI, sin markdown, sin \`\`\`, sin comillas.
2. Cada l\xEDnea = un comando. Comentarios con #.
3. IDs sucesivos comenzando desde 1.
4. Si necesit\xE1s aclaraciones, ponelas como # comentario al final.

Ejemplo de salida t\xEDpica para "p\xF3rtico 1 vano, 4m vano, 3m altura, empotrado":
# P\xF3rtico 1 vano 4m \xD7 3m, empotrado en la base
node 1   0   0   0
node 2   0   0   3
node 3   4   0   3
node 4   4   0   0
frame 1  1 2   25e9  0.16  2.13e-3   # columna izq
frame 2  2 3   25e9  0.10  1.33e-3   # viga
frame 3  3 4   25e9  0.16  2.13e-3   # columna der
support 1  1 1 1 1 1 1
support 4  1 1 1 1 1 1`, L = () => window, ue = [{ id: "ollama", nombre: "\u{1F999} Ollama (local)", url: "http://localhost:11434/v1/chat/completions", clave: false, modelos: ["qwen2.5:7b", "qwen2.5:3b", "llama3.1:8b", "qwen3:8b"], pista: "Local y gratis: ollama.com \u2192 ollama pull qwen2.5:7b. Desde la web p\xFAblica, arrancar Ollama con OLLAMA_ORIGINS=* (si no, bloquea la p\xE1gina)." }, { id: "gemini", nombre: "\u2728 Gemini", url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", clave: true, modelos: ["gemini-2.5-flash", "gemini-2.0-flash"], pista: "Clave gratis: aistudio.google.com/apikey" }, { id: "groq", nombre: "\u26A1 Groq", url: "https://api.groq.com/openai/v1/chat/completions", clave: true, modelos: ["llama-3.3-70b-versatile", "qwen/qwen3-32b"], pista: "Clave gratis: console.groq.com/keys" }, { id: "openrouter", nombre: "\u{1F310} OpenRouter", url: "https://openrouter.ai/api/v1/chat/completions", clave: true, modelos: ["deepseek/deepseek-chat-v3-0324:free", "qwen/qwen-2.5-72b-instruct:free"], pista: "Clave: openrouter.ai/keys (sufijo :free = gratis)" }], Be = [{ name: "obtener_modelo", description: "Resumen del modelo abierto: plantilla, par\xE1metros, n\xFAmero de nudos, barras, c\xE1scaras, apoyos, cargas y dimensiones. \xDAsala al empezar si el usuario habla del modelo actual.", parameters: { type: "object", properties: {}, required: [] } }, { name: "listar_plantillas", description: "Busca plantillas param\xE9tricas del programa (edificios, p\xF3rticos, galpones, zapatas, losas, muros\u2026). Devuelve id, nombre y categor\xEDa.", parameters: { type: "object", properties: { filtro: { type: "string", description: "palabra a buscar, p. ej. 'edificio', 'zapata', 'galpon'. Vac\xEDo = todas." } }, required: [] } }, { name: "cargar_plantilla", description: "Abre una plantilla por su id y opcionalmente le pone par\xE1metros. Devuelve la lista de par\xE1metros de la plantilla con sus valores, para poder ajustarlos despu\xE9s.", parameters: { type: "object", properties: { id: { type: "string", description: "id de la plantilla (de listar_plantillas)" }, parametros: { type: "object", description: 'clave \u2192 valor num\xE9rico, p. ej. {"nFloors": 4}' } }, required: ["id"] } }, { name: "cambiar_parametros", description: "Cambia par\xE1metros num\xE9ricos de la plantilla abierta y recalcula.", parameters: { type: "object", properties: { parametros: { type: "object", description: "clave \u2192 valor num\xE9rico" } }, required: ["parametros"] } }, { name: "modelar_heks", description: "Construye un modelo a medida con comandos .heks (nudos, barras, c\xE1scaras, apoyos, cargas) y lo resuelve. Devuelve conteos, errores de sintaxis, flecha m\xE1xima y suma de reacciones.", parameters: { type: "object", properties: { script: { type: "string", description: "comandos .heks, uno por l\xEDnea; terminar con 'solve'" }, modo: { type: "string", enum: ["nuevo", "agregar"], description: "nuevo = reemplaza el modelo; agregar = a\xF1ade al modelo actual" } }, required: ["script"] } }, { name: "resultados", description: "Resultados del an\xE1lisis est\xE1tico: desplazamientos m\xE1ximos (mm) con su nudo y suma de reacciones (kN). \xDAsala para comprobar el modelo.", parameters: { type: "object", properties: {}, required: [] } }, { name: "analisis_modal", description: "Corre el an\xE1lisis modal y anima el modo 1. Devuelve periodos (s) y participaci\xF3n de masa UX, UY, RZ de los primeros modos.", parameters: { type: "object", properties: {}, required: [] } }, { name: "vista", description: "Cambia la vista 3D: c\xE1mara, deformada y campo de colores de c\xE1scaras.", parameters: { type: "object", properties: { camara: { type: "string", enum: ["iso", "plan", "elevX", "elevY"] }, deformada: { type: "boolean" }, campo_cascara: { type: "string", enum: ["none", "displacementZ", "bendingXX", "bendingYY", "membraneXX", "membraneYY", "vonMises"] } }, required: [] } }, { name: "deshacer", description: "Vuelve el modelo al estado anterior al \xFAltimo cambio hecho por el agente.", parameters: { type: "object", properties: {}, required: [] } }], Qt = `Eres el agente de Hekatan Struct, un programa de an\xE1lisis estructural por elementos finitos.
No escribes el modelo en el chat: lo CONSTRUYES llamando a las herramientas, y compruebas cada paso.

Unidades: kN, m, s. Ejes: Z hacia arriba, gravedad = -Z.

C\xF3mo trabajar:
1. Si piden una tipolog\xEDa est\xE1ndar (edificio, p\xF3rtico, galp\xF3n, zapata, losa, muro\u2026), busca con
   listar_plantillas, \xE1brela con cargar_plantilla y ajusta los par\xE1metros que devuelve.
   Edificio de p\xF3rticos de hormig\xF3n \u2192 edificio-aporticado; claves: nPisos, nVanosX, nVanosY,
   spanX, spanY (luces en m), hPiso (m). Usa SIEMPRE las claves exactas que devuelve la herramienta.
2. Si es una estructura a medida, usa modelar_heks.
3. Despu\xE9s de modelar, llama a resultados (y a analisis_modal si preguntan por periodos o sismo).
   Si hay errores, flecha absurda o la suma de reacciones no equilibra la carga, corrige y repite.
4. Termina con 2-4 l\xEDneas en espa\xF1ol: qu\xE9 modelaste y los n\xFAmeros clave (flecha, periodo).
   No inventes n\xFAmeros: usa solo los que devolvieron las herramientas.

Sintaxis .heks (un comando por l\xEDnea, # comentario):
node <id> <x> <y> <z>
frame <id> <nI> <nJ> <E> <A> <I22> <I33>      E en kN/m\xB2 (hormig\xF3n 25e6, acero 2e8)
shell <id> <n1> <n2> <n3> <n4> <t> <E>          losa/muro Q4, nudos en orden de giro
support <nudo> fixed | pinned | roller          o seis 0/1: support 1 1 1 1 1 1 1
load <nudo> <Fx> <Fy> <Fz> <Mx> <My> <Mz>       kN (hacia abajo = Fz negativo)
frameload <barra> <wx> <wy> <wz>                kN/m globales
areaload <shell> <q>                            kN/m\xB2 (+z; gravedad negativa)
selfweight 1                                    peso propio
solve                                           al final, siempre

Parte las vigas en 4 tramos o m\xE1s si quieres ver su flecha: el resultado es solo en nudos.
Secciones t\xEDpicas: columna 40\xD740 A=0.16 I=0.002133; viga 30\xD750 A=0.15 I22=0.001125 I33=0.003125.
Ejemplo p\xF3rtico de un vano 5 m \xD7 3 m empotrado:
node 1 0 0 0
node 2 0 0 3
node 3 5 0 3
node 4 5 0 0
frame 1 1 2 25e6 0.16 0.002133 0.002133
frame 2 2 3 25e6 0.15 0.001125 0.003125
frame 3 3 4 25e6 0.16 0.002133 0.002133
support 1 fixed
support 4 fixed
frameload 2 0 0 -20
solve`, Oe = (x) => new Promise((e) => setTimeout(e, x)), Re = () => new Promise((x) => requestAnimationFrame(() => requestAnimationFrame(x))), Ee = [];
function je() {
  var _a, _b, _c, _d;
  return { ex: ((_b = (_a = L()).__hekatanExample) == null ? void 0 : _b.call(_a)) ?? null, params: { ...((_d = (_c = L()).__hekatanGetParams) == null ? void 0 : _d.call(_c)) ?? {} }, script: L().__hekatanCliScript ?? "" };
}
async function He(x) {
  var _a, _b, _c, _d, _e2, _f;
  ((_b = (_a = L()).__hekatanExample) == null ? void 0 : _b.call(_a)) === x ? (_d = (_c = L()).__hekatanRebuild) == null ? void 0 : _d.call(_c) : (_f = (_e2 = L()).__hekatanLoadExampleById) == null ? void 0 : _f.call(_e2, x), await Re(), await Oe(150);
}
async function lt(x) {
  var _a, _b, _c, _d;
  if (!x || !Object.keys(x).length) return [];
  const e = (_b = (_a = L()).__hekatanParams) == null ? void 0 : _b.call(_a);
  if (!e) return ["no hay plantilla abierta"];
  const t = [];
  for (const [s, i] of Object.entries(x)) {
    const a = typeof i == "boolean" ? i ? 1 : 0 : Number(i);
    if (!(s in e)) {
      t.push(`par\xE1metro desconocido: ${s}`);
      continue;
    }
    if (!Number.isFinite(a)) {
      t.push(`${s}: valor no num\xE9rico`);
      continue;
    }
    e[s] = a;
  }
  return (_d = (_c = L()).__hekatanRebuild) == null ? void 0 : _d.call(_c), await Re(), await Oe(150), t;
}
function Ae() {
  var _a, _b, _c, _d, _e2;
  const x = L().__hekatanStates;
  if (!x) return null;
  const e = ((_a = x.nodes) == null ? void 0 : _a.val) ?? [], t = ((_b = x.elements) == null ? void 0 : _b.val) ?? [], s = ((_c = x.nodeInputs) == null ? void 0 : _c.val) ?? {}, i = [1 / 0, 1 / 0, 1 / 0, -1 / 0, -1 / 0, -1 / 0];
  for (const r of e) for (let l = 0; l < 3; l++) i[l] = Math.min(i[l], r[l]), i[l + 3] = Math.max(i[l + 3], r[l]);
  const a = (r) => +r.toFixed(1);
  return { nudos: e.length, barras: t.filter((r) => r.length === 2).length, cascaras: t.filter((r) => r.length >= 3).length, apoyos: ((_d = s.supports) == null ? void 0 : _d.size) ?? 0, cargas_nodales: ((_e2 = s.loads) == null ? void 0 : _e2.size) ?? 0, dimensiones_m: e.length ? { x: a(i[3] - i[0]), y: a(i[4] - i[1]), z: a(i[5] - i[2]) } : null };
}
function es() {
  var _a, _b, _c;
  const x = (_b = (_a = L().__hekatanStates) == null ? void 0 : _a.deformOutputs) == null ? void 0 : _b.val;
  if (!((_c = x == null ? void 0 : x.deformations) == null ? void 0 : _c.size)) return { error: "no hay resultados: el modelo no se resolvi\xF3 (\xBFfalta solve, apoyos o cargas?)" };
  const e = [0, 0, 0], t = [0, 0, 0];
  for (const [a, r] of x.deformations) for (let l = 0; l < 3; l++) Math.abs(r[l]) > Math.abs(e[l]) && (e[l] = r[l], t[l] = a);
  const s = [0, 0, 0];
  for (const [, a] of x.reactions ?? /* @__PURE__ */ new Map()) for (let r = 0; r < 3; r++) s[r] += a[r] || 0;
  const i = (a) => +(a * 1e3).toFixed(3);
  return { ux_max_mm: i(e[0]), indice_nudo_ux: t[0], uy_max_mm: i(e[1]), indice_nudo_uy: t[1], uz_max_mm: i(e[2]), indice_nudo_uz: t[2], suma_reacciones_kN: { Fx: +s[0].toFixed(2), Fy: +s[1].toFixed(2), Fz: +s[2].toFixed(2) } };
}
function nt() {
  var _a, _b, _c, _d;
  const x = ((_b = (_a = L()).__hekatanParamDefs) == null ? void 0 : _b.call(_a)) ?? {}, e = ((_d = (_c = L()).__hekatanGetParams) == null ? void 0 : _d.call(_c)) ?? {}, t = {};
  for (const [s, i] of Object.entries(e)) {
    const a = x[s], r = (a == null ? void 0 : a.label) ? String(a.label).slice(0, 28) : "", l = (a == null ? void 0 : a.options) ? Object.entries(a.options) : [], h = l.length && l.length <= 4 ? "; " + l.map(([o, c]) => `${c}=${String(o).slice(0, 14)}`).join(", ") : "";
    t[s] = r || h ? `${i} (${r}${h})` : String(i);
  }
  return t;
}
async function We(x, e) {
  var _a, _b, _c, _d, _e2, _f, _g, _h, _i, _j2, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t2, _u, _v;
  switch (x) {
    case "obtener_modelo": {
      const t = (_b = (_a = L()).__hekatanExample) == null ? void 0 : _b.call(_a), s = { plantilla: t, ...Ae() };
      return t === "cli-modeler" ? s.script = String(L().__hekatanCliScript ?? "").slice(0, 3e3) : t && (s.parametros = nt()), s;
    }
    case "listar_plantillas": {
      const t = L().__hekatanExamples ?? [], s = String((e == null ? void 0 : e.filtro) ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""), i = t.filter((a) => !s || `${a.id} ${a.name} ${a.category}`.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(s));
      return { total: i.length, plantillas: i.slice(0, 30).map((a) => `${a.id} \u2014 ${a.name} [${a.category}]`) };
    }
    case "cargar_plantilla": {
      const t = String((e == null ? void 0 : e.id) ?? "");
      if (!(L().__hekatanExamples ?? []).some((i) => i.id === t)) return { error: `no existe la plantilla '${t}'. Usa listar_plantillas.` };
      Ee.push(je()), await He(t);
      const s = await lt(e == null ? void 0 : e.parametros);
      return { ok: true, plantilla: t, ...Ae(), avisos: s, parametros: nt(), siguiente: s.length ? "Hay claves que no existen. Llama cambiar_parametros usando SOLO claves de 'parametros'." : "Ajusta con cambiar_parametros si hace falta y luego llama resultados." };
    }
    case "cambiar_parametros": {
      Ee.push(je());
      const t = await lt(e == null ? void 0 : e.parametros);
      return { ok: t.length === 0, avisos: t, ...Ae(), ...t.length ? { claves_validas: Object.keys(((_d = (_c = L()).__hekatanGetParams) == null ? void 0 : _d.call(_c)) ?? {}) } : {} };
    }
    case "modelar_heks": {
      let t = String((e == null ? void 0 : e.script) ?? "").replace(/^```[a-z]*\n?/i, "").replace(/\n?```\s*$/, "");
      if ((e == null ? void 0 : e.modo) === "agregar") {
        const a = (_f = (_e2 = L()).__hekatanExample) == null ? void 0 : _f.call(_e2);
        t = String(a === "cli-modeler" ? L().__hekatanCliScript ?? "" : ((_h = (_g = L()).__hekatanModeloAHeks) == null ? void 0 : _h.call(_g)) ?? "").replace(/^\s*solve\s*$/gim, "") + `
` + t;
      }
      /^\s*solve\s*$/im.test(t) || (t += `
solve`), Ee.push(je()), L().__hekatanCliStats = null, L().__hekatanCliScript = t, await He("cli-modeler");
      for (let a = 0; a < 20 && !L().__hekatanCliStats; a++) await Oe(100);
      const s = L().__hekatanCliStats ?? {}, i = L().__hekatanCliErrors ?? [];
      return { nudos: s.nodes, barras: s.frames, cascaras: s.shells, apoyos: s.supports, cargas: s.loads, resuelto: !!s.solved, uz_max_mm: s.maxUzMm, suma_Rz_kN: s.sumRz, errores: i.slice(0, 8) };
    }
    case "resultados":
      return es();
    case "analisis_modal": {
      const t = (_j2 = (_i = L()).__hekatanModalResults) == null ? void 0 : _j2.call(_i);
      if (typeof L().__hekatanRunModalAnimate != "function") return { error: "esta plantilla no tiene an\xE1lisis modal" };
      L().__hekatanRunModalAnimate();
      let s = null;
      for (let r = 0; r < 100; r++) {
        await Oe(150);
        const l = (_l = (_k = L()).__hekatanModalResults) == null ? void 0 : _l.call(_k);
        if (l && l !== t && ((_m = l.frequencies) == null ? void 0 : _m.length)) {
          s = l;
          break;
        }
      }
      if (!s) return { error: "el modal no devolvi\xF3 modos (\xBFmodelo sin masa o sin apoyos?)" };
      const i = Math.min(6, s.frequencies.length), a = [];
      for (let r = 0; r < i; r++) {
        const l = s.frequencies[r], h = ((_n = s.massParticipation) == null ? void 0 : _n[r]) ?? [];
        a.push({ modo: r + 1, T_s: +(1 / l).toFixed(4), UX: +((h[0] ?? 0) * 100).toFixed(1), UY: +((h[1] ?? 0) * 100).toFixed(1), RZ: +((h[5] ?? 0) * 100).toFixed(1) });
      }
      return { modos: a, nota: "UX/UY/RZ = % de masa participante" };
    }
    case "vista": {
      const t = (_p = (_o = L()).__hekatanSettings) == null ? void 0 : _p.call(_o);
      return (e == null ? void 0 : e.deformada) !== void 0 && (t == null ? void 0 : t.deformedShape) && (t.deformedShape.val = !!e.deformada), (e == null ? void 0 : e.campo_cascara) && (t == null ? void 0 : t.shellResults) && (t.shellResults.val = e.campo_cascara), (e == null ? void 0 : e.camara) && ((_r = (_q = L()).__hekatanSetView) == null ? void 0 : _r.call(_q, e.camara)), await Re(), { ok: true };
    }
    case "deshacer": {
      const t = Ee.pop();
      if (!(t == null ? void 0 : t.ex)) return { error: "no hay nada que deshacer" };
      if (t.ex === "cli-modeler" && (L().__hekatanCliScript = t.script), await He(t.ex), t.ex !== "cli-modeler") {
        const s = (_t2 = (_s = L()).__hekatanParams) == null ? void 0 : _t2.call(_s);
        s && (Object.assign(s, t.params), (_v = (_u = L()).__hekatanRebuild) == null ? void 0 : _v.call(_u), await Re());
      }
      return { ok: true, plantilla: t.ex, ...Ae() };
    }
  }
  return { error: `herramienta desconocida: ${x}` };
}
const ot = 14, be = [];
async function ts(x, e, t, s) {
  var _a, _b, _c;
  const i = { "content-type": "application/json" };
  x.clave && (i.Authorization = `Bearer ${t}`), x.id === "openrouter" && (i["HTTP-Referer"] = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/", i["X-Title"] = "Hekatan Struct");
  const a = x.id === "ollama", r = [{ role: "system", content: Qt }, ...be], l = a ? { model: e, stream: false, options: { temperature: 0.1, num_ctx: 16384 }, tools: Be.map((c) => ({ type: "function", function: c })), messages: r.map((c) => c.tool_calls ? { ...c, tool_calls: c.tool_calls.map((d) => ({ function: { name: d.function.name, arguments: typeof d.function.arguments == "string" ? JSON.parse(d.function.arguments || "{}") : d.function.arguments } })) } : c) } : { model: e, messages: r, temperature: 0.1, tool_choice: "auto", tools: Be.map((c) => ({ type: "function", function: c })) }, h = await fetch(a ? "http://localhost:11434/api/chat" : x.url, { method: "POST", headers: i, signal: s, body: JSON.stringify(l) }).catch((c) => {
    throw (c == null ? void 0 : c.name) === "AbortError" ? c : new Error(x.id === "ollama" ? "Ollama no responde en localhost:11434. \xC1brelo o instala: ollama.com \u2192 ollama pull qwen2.5:7b" + (location.hostname !== "localhost" ? `
Desde esta web hace falta permitirla: variable de entorno OLLAMA_ORIGINS=* y reiniciar Ollama.` : "") : `sin conexi\xF3n con ${x.nombre}: ${(c == null ? void 0 : c.message) ?? c}`);
  });
  if (!h.ok) {
    const c = (await h.text()).slice(0, 400);
    throw x.id === "ollama" && h.status === 404 ? new Error(`Modelo \xAB${e}\xBB no instalado: ollama pull ${e}`) : new Error(`${x.nombre} ${h.status}: ${c}`);
  }
  const o = await h.json();
  if (a) {
    const c = o.message ?? { role: "assistant", content: "" };
    return ((_a = c.tool_calls) == null ? void 0 : _a.length) && (c.tool_calls = c.tool_calls.map((d, p) => ({ id: d.id ?? `t${Date.now()}${p}`, type: "function", function: { name: d.function.name, arguments: JSON.stringify(d.function.arguments ?? {}) } }))), c;
  }
  return ((_c = (_b = o.choices) == null ? void 0 : _b[0]) == null ? void 0 : _c.message) ?? { role: "assistant", content: "" };
}
function ss(x) {
  const e = [], t = /\{[^{}]*"name"\s*:\s*"([a-z_]+)"[^{}]*"arguments"\s*:\s*(\{[\s\S]*?\})\s*\}/g;
  let s;
  for (; s = t.exec(x); ) Be.some((i) => i.name === s[1]) && e.push({ id: `t${Date.now()}${e.length}`, type: "function", function: { name: s[1], arguments: s[2] } });
  return e;
}
function mt(x, e) {
  var _a, _b, _c, _d;
  if (e == null ? void 0 : e.error) return `\u2717 ${e.error}`;
  switch (x) {
    case "listar_plantillas":
      return `${e.total} plantillas`;
    case "cargar_plantilla":
    case "cambiar_parametros":
    case "deshacer":
      return `${e.nudos} nudos \xB7 ${e.barras} barras \xB7 ${e.cascaras} c\xE1scaras` + (((_a = e.avisos) == null ? void 0 : _a.length) ? ` \xB7 \u26A0 ${e.avisos[0]}` : "");
    case "modelar_heks":
      return `${e.nudos} nudos \xB7 ${e.barras} barras \xB7 ${e.cascaras} c\xE1scaras \xB7 Uz ${e.uz_max_mm} mm \xB7 \u03A3Rz ${e.suma_Rz_kN} kN` + (((_b = e.errores) == null ? void 0 : _b.length) ? ` \xB7 \u26A0 ${e.errores.length} errores` : "");
    case "resultados":
      return `Uz ${e.uz_max_mm} mm \xB7 Ux ${e.ux_max_mm} mm \xB7 \u03A3Fz ${(_c = e.suma_reacciones_kN) == null ? void 0 : _c.Fz} kN`;
    case "analisis_modal":
      return (_d = e.modos) == null ? void 0 : _d.slice(0, 3).map((t) => `T${t.modo} = ${t.T_s} s`).join(" \xB7 ");
    case "obtener_modelo":
      return `${e.plantilla ?? "vac\xEDo"} \xB7 ${e.nudos ?? 0} nudos`;
    default:
      return "\u2713";
  }
}
let ee = null, oe, K, re, ne = null;
function Me() {
  ee && !document.body.contains(ee) && document.body.appendChild(ee);
}
function Q(x, e) {
  Me();
  const t = document.createElement("div"), s = { user: "align-self:flex-end;background:#0e7490;color:#fff;border-radius:10px 10px 2px 10px;", ia: "align-self:flex-start;background:#1f2937;color:#e5e7eb;border-radius:10px 10px 10px 2px;", paso: "align-self:stretch;background:#111827;color:#93c5fd;border-left:3px solid #22d3ee;font-family:Consolas,monospace;font-size:11px;", error: "align-self:stretch;background:#3f1d1d;color:#fca5a5;border-left:3px solid #ef4444;" };
  return t.style.cssText = "padding:6px 9px;max-width:92%;white-space:pre-wrap;word-break:break-word;line-height:1.35;" + s[x], t.textContent = e, oe.appendChild(t), oe.scrollTop = oe.scrollHeight, t;
}
function is(x) {
  const e = JSON.stringify(x ?? {});
  return (x == null ? void 0 : x.script) ? `(${String(x.script).split(`
`).filter((t) => t.trim() && !t.trim().startsWith("#")).length} l\xEDneas .heks)` : e.length > 90 ? e.slice(0, 87) + "\u2026" : e;
}
async function Ue() {
  const x = K.value.trim();
  if (!x || ne) return;
  const e = te.getProvider(), t = ue.find((c) => c.id === e) ?? ue[0], s = te.getKey(t.id), i = te.getModel(`agente_${t.id}`) || t.modelos[0];
  if (t.clave && !s) {
    Q("error", `${t.nombre} necesita clave. ${t.pista}`);
    return;
  }
  K.value = "", Q("user", x), be.push({ role: "user", content: x }), ne = new AbortController(), re.textContent = "\u25A0 Parar";
  const a = Q("ia", "\u2026"), r = /* @__PURE__ */ new Set(["cargar_plantilla", "cambiar_parametros", "modelar_heks"]);
  let l = false, h = false, o = 0;
  try {
    for (let c = 0; c < ot; c++) {
      const d = await ts(t, i, s, ne.signal);
      let p = d.tool_calls ?? [];
      if (!p.length && d.content && (p = ss(d.content)), be.push({ role: "assistant", content: p.length ? d.content ?? "" : d.content, tool_calls: p.length ? p : void 0 }), !p.length && l && !h && o < 2) {
        o++, be.push({ role: "user", content: "(Hekatan) Todav\xEDa no comprobaste el modelo. Corrige los avisos con cambiar_parametros si los hubo, llama resultados (y analisis_modal si se pidi\xF3 el periodo) y responde en 2-4 l\xEDneas con esos n\xFAmeros." });
        continue;
      }
      if (!p.length) {
        a.remove(), Q("ia", (d.content ?? "").trim() || "(sin respuesta)");
        return;
      }
      for (const f of p) {
        let m = {};
        try {
          m = typeof f.function.arguments == "string" ? JSON.parse(f.function.arguments || "{}") : f.function.arguments;
        } catch {
          m = null;
        }
        const b = Q("paso", `\u{1F527} ${f.function.name} ${m ? is(m) : "(argumentos inv\xE1lidos)"}`);
        oe.insertBefore(b, a);
        let v;
        try {
          v = m ? await We(f.function.name, m) : { error: "JSON de argumentos inv\xE1lido" };
        } catch (g) {
          v = { error: String((g == null ? void 0 : g.message) ?? g) };
        }
        Me(), b.textContent += `
   \u2192 ${mt(f.function.name, v)}`, r.has(f.function.name) && (l = true, h = false), (f.function.name === "resultados" || f.function.name === "analisis_modal") && (h = true), be.push({ role: "tool", tool_call_id: f.id, content: JSON.stringify(v).slice(0, 6e3) });
      }
    }
    a.remove(), Q("error", `Par\xE9 tras ${ot} pasos. P\xEDdeme que siga si hace falta.`);
  } catch (c) {
    a.remove(), (c == null ? void 0 : c.name) !== "AbortError" ? Q("error", String((c == null ? void 0 : c.message) ?? c)) : Q("error", "Detenido.");
  } finally {
    ne = null, re.textContent = "Enviar \u25B6";
  }
}
function as() {
  const x = document.createElement("div");
  x.id = "hk-agente-ia", x.style.cssText = ["position:fixed", "right:16px", "bottom:96px", "width:380px", "height:540px", "max-height:calc(100vh - 150px)", "max-width:calc(100vw - 32px)", "z-index:9000", "display:flex", "flex-direction:column", "background:#0b1220", "border:1px solid #334155", "border-radius:10px", "box-shadow:0 12px 40px rgba(0,0,0,.5)", "font:13px system-ui,Segoe UI,sans-serif", "color:#e5e7eb"].join(";");
  const e = document.createElement("div");
  e.style.cssText = "display:flex;align-items:center;gap:6px;padding:8px 10px;border-bottom:1px solid #1e293b;cursor:move;", e.innerHTML = '<b style="flex:1">\u{1F916} Agente IA \xB7 Hekatan Struct</b>';
  const t = document.createElement("button");
  t.textContent = "\u2715", t.title = "Cerrar", t.style.cssText = "background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;", t.onclick = () => {
    x.style.display = "none";
  }, e.appendChild(t);
  const s = document.createElement("div");
  s.style.cssText = "display:flex;flex-wrap:wrap;gap:4px;padding:6px 10px;border-bottom:1px solid #1e293b;";
  const i = "background:#111827;color:#e5e7eb;border:1px solid #334155;border-radius:4px;padding:3px 5px;font-size:12px;", a = document.createElement("select");
  a.style.cssText = i + "flex:1 1 120px;";
  for (const y of ue) a.add(new Option(y.nombre, y.id));
  const r = document.createElement("input");
  r.style.cssText = i + "flex:1 1 140px;", r.setAttribute("list", "hk-agente-modelos");
  const l = document.createElement("datalist");
  l.id = "hk-agente-modelos";
  const h = document.createElement("input");
  h.type = "password", h.placeholder = "API key", h.style.cssText = i + "flex:1 1 100%;";
  const o = document.createElement("div");
  o.style.cssText = "flex:1 1 100%;color:#64748b;font-size:11px;";
  const c = () => {
    const y = ue.find((w) => w.id === a.value) ?? ue[0];
    l.innerHTML = y.modelos.map((w) => `<option value="${w}">`).join(""), r.value = te.getModel(`agente_${y.id}`) || y.modelos[0], h.style.display = y.clave ? "" : "none", h.value = te.getKey(y.id), o.textContent = y.pista;
  }, d = te.getProvider();
  a.value = ue.some((y) => y.id === d) ? d : "ollama", a.onchange = () => {
    te.setProvider(a.value), c();
  }, r.onchange = () => te.setModel(`agente_${a.value}`, r.value.trim()), h.onchange = () => te.setKey(a.value, h.value.trim()), s.append(a, r, l, h, o), c(), oe = document.createElement("div"), oe.style.cssText = "flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding:10px;";
  const p = document.createElement("div");
  p.style.cssText = "display:flex;gap:6px;padding:8px 10px;border-top:1px solid #1e293b;", K = document.createElement("textarea"), K.rows = 2, K.placeholder = "Ej.: edificio de 4 pisos, 3\xD72 vanos de 5 m; dime la flecha y el periodo", K.style.cssText = i + "flex:1;resize:none;font-size:13px;", ["keydown", "keyup", "keypress"].forEach((y) => K.addEventListener(y, (w) => w.stopPropagation())), K.addEventListener("keydown", (y) => {
    y.key === "Enter" && !y.shiftKey && (y.preventDefault(), Ue());
  });
  const f = document.createElement("div");
  f.style.cssText = "display:flex;flex-direction:column;gap:4px;", re = document.createElement("button"), re.textContent = "Enviar \u25B6", re.style.cssText = "background:#22d3ee;color:#000;border:none;border-radius:4px;padding:6px 10px;font-weight:600;cursor:pointer;", re.onclick = () => {
    ne ? ne.abort() : Ue();
  };
  const m = document.createElement("button");
  m.textContent = "\u21B6 Deshacer", m.title = "Vuelve el modelo al estado anterior al \xFAltimo cambio del agente", m.style.cssText = "background:#334155;color:#e5e7eb;border:none;border-radius:4px;padding:4px 8px;cursor:pointer;font-size:12px;", m.onclick = async () => {
    if (ne) return;
    const y = await We("deshacer", {});
    Q("paso", `\u21B6 deshacer \u2192 ${mt("deshacer", y)}`);
  }, f.append(re, m), p.append(K, f), x.append(e, s, oe, p), document.body.appendChild(x);
  let b = 0, v = 0, g = false;
  return e.addEventListener("pointerdown", (y) => {
    if (y.target.tagName === "BUTTON") return;
    g = true;
    const w = x.getBoundingClientRect();
    b = y.clientX - w.left, v = y.clientY - w.top, e.setPointerCapture(y.pointerId);
  }), e.addEventListener("pointermove", (y) => {
    g && (x.style.left = Math.max(0, y.clientX - b) + "px", x.style.top = Math.max(0, y.clientY - v) + "px", x.style.right = "auto", x.style.bottom = "auto");
  }), e.addEventListener("pointerup", () => {
    g = false;
  }), Q("ia", "Hola. P\xEDdeme una estructura y la armo en el visor, paso a paso: plantilla o .heks, c\xE1lculo, resultados y modal."), x;
}
function Xe(x) {
  Me(), ee || (ee = as()), ee.style.display = "flex", x && (K.value = x), K.focus();
}
function gs() {
  if (Me(), document.getElementById("hk-agente-lanzador")) return;
  const x = document.createElement("button");
  x.id = "hk-agente-lanzador", x.textContent = "\u{1F916}", x.title = "Agente IA: p\xEDdele una estructura y la modela", x.style.cssText = ["position:fixed", "right:16px", "bottom:100px", "z-index:8999", "width:44px", "height:44px", "border-radius:50%", "border:1px solid #22d3ee", "background:#0b1220", "font-size:22px", "cursor:pointer", "box-shadow:0 4px 14px rgba(0,0,0,.4)"].join(";"), x.onclick = () => {
    ee && ee.style.display !== "none" && document.body.contains(ee) ? ee.style.display = "none" : Xe();
  }, document.body.appendChild(x);
}
async function rs(x) {
  Xe(), K.value = x, await Ue();
}
typeof window < "u" && (L().__hekatanAgenteIA = Xe, L().__hekatanPedirAgente = rs, L().__hekatanAgenteTool = We);
export {
  q as A,
  qt as D,
  fs as H,
  Zt as P,
  os as a,
  zt as b,
  Ie as c,
  te as d,
  ns as e,
  Xe as f,
  hs as g,
  ps as h,
  us as i,
  ms as j,
  ds as l,
  gs as m,
  cs as w
};
