import { k as S, V as d, l as m, T as u, m as E, n as P, o as p, p as w, P as O, q as x, j as A, r as R, s as j } from "./theme-U-6D_qyI.js";
const T = { type: "change" }, g = { type: "start" }, M = { type: "end" }, y = new w(), D = new O(), L = Math.cos(70 * x.DEG2RAD), r = new d(), l = 2 * Math.PI, a = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_PAN: 4, TOUCH_DOLLY_PAN: 5, TOUCH_DOLLY_ROTATE: 6 }, b = 1e-6;
class V extends S {
  constructor(t, e = null) {
    super(t, e), this.state = a.NONE, this.enabled = true, this.target = new d(), this.cursor = new d(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = false, this.dampingFactor = 0.05, this.enableZoom = true, this.zoomSpeed = 1, this.enableRotate = true, this.rotateSpeed = 1, this.enablePan = true, this.panSpeed = 1, this.screenSpacePanning = true, this.keyPanSpeed = 7, this.zoomToCursor = false, this.autoRotate = false, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: m.ROTATE, MIDDLE: m.DOLLY, RIGHT: m.PAN }, this.touches = { ONE: u.ROTATE, TWO: u.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new d(), this._lastQuaternion = new E(), this._lastTargetPosition = new d(), this._quat = new E().setFromUnitVectors(t.up, new d(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new P(), this._sphericalDelta = new P(), this._scale = 1, this._panOffset = new d(), this._rotateStart = new p(), this._rotateEnd = new p(), this._rotateDelta = new p(), this._panStart = new p(), this._panEnd = new p(), this._panDelta = new p(), this._dollyStart = new p(), this._dollyEnd = new p(), this._dollyDelta = new p(), this._dollyDirection = new d(), this._mouse = new p(), this._performCursorZoom = false, this._pointers = [], this._pointerPositions = {}, this._controlActive = false, this._onPointerMove = k.bind(this), this._onPointerDown = C.bind(this), this._onPointerUp = N.bind(this), this._onContextMenu = H.bind(this), this._onMouseWheel = U.bind(this), this._onKeyDown = Z.bind(this), this._onTouchStart = z.bind(this), this._onTouchMove = K.bind(this), this._onMouseDown = Y.bind(this), this._onMouseMove = I.bind(this), this._interceptControlDown = v.bind(this), this._interceptControlUp = X.bind(this), this.domElement !== null && this.connect(), this.update();
  }
  connect() {
    this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointercancel", this._onPointerUp), this.domElement.addEventListener("contextmenu", this._onContextMenu), this.domElement.addEventListener("wheel", this._onMouseWheel, { passive: false }), this.domElement.getRootNode().addEventListener("keydown", this._interceptControlDown, { passive: true, capture: true }), this.domElement.style.touchAction = "none";
  }
  disconnect() {
    this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.domElement.removeEventListener("pointercancel", this._onPointerUp), this.domElement.removeEventListener("wheel", this._onMouseWheel), this.domElement.removeEventListener("contextmenu", this._onContextMenu), this.stopListenToKeyEvents(), this.domElement.getRootNode().removeEventListener("keydown", this._interceptControlDown, { capture: true }), this.domElement.style.touchAction = "auto";
  }
  dispose() {
    this.disconnect();
  }
  getPolarAngle() {
    return this._spherical.phi;
  }
  getAzimuthalAngle() {
    return this._spherical.theta;
  }
  getDistance() {
    return this.object.position.distanceTo(this.target);
  }
  listenToKeyEvents(t) {
    t.addEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = t;
  }
  stopListenToKeyEvents() {
    this._domElementKeyEvents !== null && (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = null);
  }
  saveState() {
    this.target0.copy(this.target), this.position0.copy(this.object.position), this.zoom0 = this.object.zoom;
  }
  reset() {
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(T), this.update(), this.state = a.NONE;
  }
  update(t = null) {
    const e = this.object.position;
    r.copy(e).sub(this.target), r.applyQuaternion(this._quat), this._spherical.setFromVector3(r), this.autoRotate && this.state === a.NONE && this._rotateLeft(this._getAutoRotationAngle(t)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let s = this.minAzimuthAngle, o = this.maxAzimuthAngle;
    isFinite(s) && isFinite(o) && (s < -Math.PI ? s += l : s > Math.PI && (s -= l), o < -Math.PI ? o += l : o > Math.PI && (o -= l), s <= o ? this._spherical.theta = Math.max(s, Math.min(o, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (s + o) / 2 ? Math.max(s, this._spherical.theta) : Math.min(o, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === true ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
    let n = false;
    if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera) this._spherical.radius = this._clampDistance(this._spherical.radius);
    else {
      const h = this._spherical.radius;
      this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), n = h != this._spherical.radius;
    }
    if (r.setFromSpherical(this._spherical), r.applyQuaternion(this._quatInverse), e.copy(this.target).add(r), this.object.lookAt(this.target), this.enableDamping === true ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
      let h = null;
      if (this.object.isPerspectiveCamera) {
        const c = r.length();
        h = this._clampDistance(c * this._scale);
        const _ = c - h;
        this.object.position.addScaledVector(this._dollyDirection, _), this.object.updateMatrixWorld(), n = !!_;
      } else if (this.object.isOrthographicCamera) {
        const c = new d(this._mouse.x, this._mouse.y, 0);
        c.unproject(this.object);
        const _ = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), n = _ !== this.object.zoom;
        const f = new d(this._mouse.x, this._mouse.y, 0);
        f.unproject(this.object), this.object.position.sub(f).add(c), this.object.updateMatrixWorld(), h = r.length();
      } else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = false;
      h !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(h).add(this.object.position) : (y.origin.copy(this.object.position), y.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(y.direction)) < L ? this.object.lookAt(this.target) : (D.setFromNormalAndCoplanarPoint(this.object.up, this.target), y.intersectPlane(D, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const h = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), h !== this.object.zoom && (this.object.updateProjectionMatrix(), n = true);
    }
    return this._scale = 1, this._performCursorZoom = false, n || this._lastPosition.distanceToSquared(this.object.position) > b || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > b || this._lastTargetPosition.distanceToSquared(this.target) > b ? (this.dispatchEvent(T), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), true) : false;
  }
  _getAutoRotationAngle(t) {
    return t !== null ? l / 60 * this.autoRotateSpeed * t : l / 60 / 60 * this.autoRotateSpeed;
  }
  _getZoomScale(t) {
    const e = Math.abs(t * 0.01);
    return Math.pow(0.95, this.zoomSpeed * e);
  }
  _rotateLeft(t) {
    this._sphericalDelta.theta -= t;
  }
  _rotateUp(t) {
    this._sphericalDelta.phi -= t;
  }
  _panLeft(t, e) {
    r.setFromMatrixColumn(e, 0), r.multiplyScalar(-t), this._panOffset.add(r);
  }
  _panUp(t, e) {
    this.screenSpacePanning === true ? r.setFromMatrixColumn(e, 1) : (r.setFromMatrixColumn(e, 0), r.crossVectors(this.object.up, r)), r.multiplyScalar(t), this._panOffset.add(r);
  }
  _pan(t, e) {
    const s = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const o = this.object.position;
      r.copy(o).sub(this.target);
      let n = r.length();
      n *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * t * n / s.clientHeight, this.object.matrix), this._panUp(2 * e * n / s.clientHeight, this.object.matrix);
    } else this.object.isOrthographicCamera ? (this._panLeft(t * (this.object.right - this.object.left) / this.object.zoom / s.clientWidth, this.object.matrix), this._panUp(e * (this.object.top - this.object.bottom) / this.object.zoom / s.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = false);
  }
  _dollyOut(t) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale /= t : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = false);
  }
  _dollyIn(t) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale *= t : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = false);
  }
  _updateZoomParameters(t, e) {
    if (!this.zoomToCursor) return;
    this._performCursorZoom = true;
    const s = this.domElement.getBoundingClientRect(), o = t - s.left, n = e - s.top, h = s.width, c = s.height;
    this._mouse.x = o / h * 2 - 1, this._mouse.y = -(n / c) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
  }
  _clampDistance(t) {
    return Math.max(this.minDistance, Math.min(this.maxDistance, t));
  }
  _handleMouseDownRotate(t) {
    this._rotateStart.set(t.clientX, t.clientY);
  }
  _handleMouseDownDolly(t) {
    this._updateZoomParameters(t.clientX, t.clientX), this._dollyStart.set(t.clientX, t.clientY);
  }
  _handleMouseDownPan(t) {
    this._panStart.set(t.clientX, t.clientY);
  }
  _handleMouseMoveRotate(t) {
    this._rotateEnd.set(t.clientX, t.clientY), this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const e = this.domElement;
    this._rotateLeft(l * this._rotateDelta.x / e.clientHeight), this._rotateUp(l * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
  }
  _handleMouseMoveDolly(t) {
    this._dollyEnd.set(t.clientX, t.clientY), this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart), this._dollyDelta.y > 0 ? this._dollyOut(this._getZoomScale(this._dollyDelta.y)) : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)), this._dollyStart.copy(this._dollyEnd), this.update();
  }
  _handleMouseMovePan(t) {
    this._panEnd.set(t.clientX, t.clientY), this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd), this.update();
  }
  _handleMouseWheel(t) {
    this._updateZoomParameters(t.clientX, t.clientY), t.deltaY < 0 ? this._dollyIn(this._getZoomScale(t.deltaY)) : t.deltaY > 0 && this._dollyOut(this._getZoomScale(t.deltaY)), this.update();
  }
  _handleKeyDown(t) {
    let e = false;
    switch (t.code) {
      case this.keys.UP:
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateUp(l * this.rotateSpeed / this.domElement.clientHeight) : this._pan(0, this.keyPanSpeed), e = true;
        break;
      case this.keys.BOTTOM:
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateUp(-l * this.rotateSpeed / this.domElement.clientHeight) : this._pan(0, -this.keyPanSpeed), e = true;
        break;
      case this.keys.LEFT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateLeft(l * this.rotateSpeed / this.domElement.clientHeight) : this._pan(this.keyPanSpeed, 0), e = true;
        break;
      case this.keys.RIGHT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateLeft(-l * this.rotateSpeed / this.domElement.clientHeight) : this._pan(-this.keyPanSpeed, 0), e = true;
        break;
    }
    e && (t.preventDefault(), this.update());
  }
  _handleTouchStartRotate(t) {
    if (this._pointers.length === 1) this._rotateStart.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), s = 0.5 * (t.pageX + e.x), o = 0.5 * (t.pageY + e.y);
      this._rotateStart.set(s, o);
    }
  }
  _handleTouchStartPan(t) {
    if (this._pointers.length === 1) this._panStart.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), s = 0.5 * (t.pageX + e.x), o = 0.5 * (t.pageY + e.y);
      this._panStart.set(s, o);
    }
  }
  _handleTouchStartDolly(t) {
    const e = this._getSecondPointerPosition(t), s = t.pageX - e.x, o = t.pageY - e.y, n = Math.sqrt(s * s + o * o);
    this._dollyStart.set(0, n);
  }
  _handleTouchStartDollyPan(t) {
    this.enableZoom && this._handleTouchStartDolly(t), this.enablePan && this._handleTouchStartPan(t);
  }
  _handleTouchStartDollyRotate(t) {
    this.enableZoom && this._handleTouchStartDolly(t), this.enableRotate && this._handleTouchStartRotate(t);
  }
  _handleTouchMoveRotate(t) {
    if (this._pointers.length == 1) this._rotateEnd.set(t.pageX, t.pageY);
    else {
      const s = this._getSecondPointerPosition(t), o = 0.5 * (t.pageX + s.x), n = 0.5 * (t.pageY + s.y);
      this._rotateEnd.set(o, n);
    }
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const e = this.domElement;
    this._rotateLeft(l * this._rotateDelta.x / e.clientHeight), this._rotateUp(l * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd);
  }
  _handleTouchMovePan(t) {
    if (this._pointers.length === 1) this._panEnd.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), s = 0.5 * (t.pageX + e.x), o = 0.5 * (t.pageY + e.y);
      this._panEnd.set(s, o);
    }
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
  }
  _handleTouchMoveDolly(t) {
    const e = this._getSecondPointerPosition(t), s = t.pageX - e.x, o = t.pageY - e.y, n = Math.sqrt(s * s + o * o);
    this._dollyEnd.set(0, n), this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
    const h = (t.pageX + e.x) * 0.5, c = (t.pageY + e.y) * 0.5;
    this._updateZoomParameters(h, c);
  }
  _handleTouchMoveDollyPan(t) {
    this.enableZoom && this._handleTouchMoveDolly(t), this.enablePan && this._handleTouchMovePan(t);
  }
  _handleTouchMoveDollyRotate(t) {
    this.enableZoom && this._handleTouchMoveDolly(t), this.enableRotate && this._handleTouchMoveRotate(t);
  }
  _addPointer(t) {
    this._pointers.push(t.pointerId);
  }
  _removePointer(t) {
    delete this._pointerPositions[t.pointerId];
    for (let e = 0; e < this._pointers.length; e++) if (this._pointers[e] == t.pointerId) {
      this._pointers.splice(e, 1);
      return;
    }
  }
  _isTrackingPointer(t) {
    for (let e = 0; e < this._pointers.length; e++) if (this._pointers[e] == t.pointerId) return true;
    return false;
  }
  _trackPointer(t) {
    let e = this._pointerPositions[t.pointerId];
    e === void 0 && (e = new p(), this._pointerPositions[t.pointerId] = e), e.set(t.pageX, t.pageY);
  }
  _getSecondPointerPosition(t) {
    const e = t.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
    return this._pointerPositions[e];
  }
  _customWheelEvent(t) {
    const e = t.deltaMode, s = { clientX: t.clientX, clientY: t.clientY, deltaY: t.deltaY };
    switch (e) {
      case 1:
        s.deltaY *= 16;
        break;
      case 2:
        s.deltaY *= 100;
        break;
    }
    return t.ctrlKey && !this._controlActive && (s.deltaY *= 10), s;
  }
}
function C(i) {
  this.enabled !== false && (this._pointers.length === 0 && (this.domElement.setPointerCapture(i.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.domElement.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(i) && (this._addPointer(i), i.pointerType === "touch" ? this._onTouchStart(i) : this._onMouseDown(i)));
}
function k(i) {
  this.enabled !== false && (i.pointerType === "touch" ? this._onTouchMove(i) : this._onMouseMove(i));
}
function N(i) {
  switch (this._removePointer(i), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(i.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(M), this.state = a.NONE;
      break;
    case 1:
      const t = this._pointers[0], e = this._pointerPositions[t];
      this._onTouchStart({ pointerId: t, pageX: e.x, pageY: e.y });
      break;
  }
}
function Y(i) {
  let t;
  switch (i.button) {
    case 0:
      t = this.mouseButtons.LEFT;
      break;
    case 1:
      t = this.mouseButtons.MIDDLE;
      break;
    case 2:
      t = this.mouseButtons.RIGHT;
      break;
    default:
      t = -1;
  }
  switch (t) {
    case m.DOLLY:
      if (this.enableZoom === false) return;
      this._handleMouseDownDolly(i), this.state = a.DOLLY;
      break;
    case m.ROTATE:
      if (i.ctrlKey || i.metaKey || i.shiftKey) {
        if (this.enablePan === false) return;
        this._handleMouseDownPan(i), this.state = a.PAN;
      } else {
        if (this.enableRotate === false) return;
        this._handleMouseDownRotate(i), this.state = a.ROTATE;
      }
      break;
    case m.PAN:
      if (i.ctrlKey || i.metaKey || i.shiftKey) {
        if (this.enableRotate === false) return;
        this._handleMouseDownRotate(i), this.state = a.ROTATE;
      } else {
        if (this.enablePan === false) return;
        this._handleMouseDownPan(i), this.state = a.PAN;
      }
      break;
    default:
      this.state = a.NONE;
  }
  this.state !== a.NONE && this.dispatchEvent(g);
}
function I(i) {
  switch (this.state) {
    case a.ROTATE:
      if (this.enableRotate === false) return;
      this._handleMouseMoveRotate(i);
      break;
    case a.DOLLY:
      if (this.enableZoom === false) return;
      this._handleMouseMoveDolly(i);
      break;
    case a.PAN:
      if (this.enablePan === false) return;
      this._handleMouseMovePan(i);
      break;
  }
}
function U(i) {
  this.enabled === false || this.enableZoom === false || this.state !== a.NONE || (i.preventDefault(), this.dispatchEvent(g), this._handleMouseWheel(this._customWheelEvent(i)), this.dispatchEvent(M));
}
function Z(i) {
  this.enabled === false || this.enablePan === false || this._handleKeyDown(i);
}
function z(i) {
  switch (this._trackPointer(i), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case u.ROTATE:
          if (this.enableRotate === false) return;
          this._handleTouchStartRotate(i), this.state = a.TOUCH_ROTATE;
          break;
        case u.PAN:
          if (this.enablePan === false) return;
          this._handleTouchStartPan(i), this.state = a.TOUCH_PAN;
          break;
        default:
          this.state = a.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case u.DOLLY_PAN:
          if (this.enableZoom === false && this.enablePan === false) return;
          this._handleTouchStartDollyPan(i), this.state = a.TOUCH_DOLLY_PAN;
          break;
        case u.DOLLY_ROTATE:
          if (this.enableZoom === false && this.enableRotate === false) return;
          this._handleTouchStartDollyRotate(i), this.state = a.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = a.NONE;
      }
      break;
    default:
      this.state = a.NONE;
  }
  this.state !== a.NONE && this.dispatchEvent(g);
}
function K(i) {
  switch (this._trackPointer(i), this.state) {
    case a.TOUCH_ROTATE:
      if (this.enableRotate === false) return;
      this._handleTouchMoveRotate(i), this.update();
      break;
    case a.TOUCH_PAN:
      if (this.enablePan === false) return;
      this._handleTouchMovePan(i), this.update();
      break;
    case a.TOUCH_DOLLY_PAN:
      if (this.enableZoom === false && this.enablePan === false) return;
      this._handleTouchMoveDollyPan(i), this.update();
      break;
    case a.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === false && this.enableRotate === false) return;
      this._handleTouchMoveDollyRotate(i), this.update();
      break;
    default:
      this.state = a.NONE;
  }
}
function H(i) {
  this.enabled !== false && i.preventDefault();
}
function v(i) {
  i.key === "Control" && (this._controlActive = true, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: true, capture: true }));
}
function X(i) {
  i.key === "Control" && (this._controlActive = false, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: true, capture: true }));
}
class q extends A {
  constructor(t, e, s) {
    super();
    const o = 30;
    this.fontHeightPx = o * devicePixelRatio, this.material.map = F(t, this.fontHeightPx, e, s), this.material.depthTest = false, this.renderOrder = 99, this.scale.set(this.material.map.image.width / this.fontHeightPx, 1, 1);
  }
  updateScale(t) {
    var _a, _b;
    this.scale.set(((_b = (_a = this.material) == null ? void 0 : _a.map) == null ? void 0 : _b.image.width) / this.fontHeightPx * t, t, 1);
  }
  dispose() {
    var _a;
    this.geometry.dispose(), (_a = this.material.map) == null ? void 0 : _a.dispose(), this.material.dispose();
  }
}
function F(i, t, e, s) {
  const o = R(), n = document.createElement("canvas"), h = n.getContext("2d");
  if (h) {
    h.font = `${t}px Arial`, n.width = h.measureText(i).width, n.height = t, s != "transparent" && (h.fillStyle = s ?? o.textBackground), h.fillRect(0, 0, n.width, n.height), h.textAlign = "center", h.textBaseline = "middle", h.fillStyle = e ?? o.textColor;
    const _ = 0.9;
    h.font = `${t * _}px Arial`;
    const f = 0.08 * n.height;
    h.fillText(i, n.width / 2, n.height / 2 + f);
  }
  const c = new j(n);
  return c.needsUpdate = true, c;
}
export {
  V as O,
  q as T
};
