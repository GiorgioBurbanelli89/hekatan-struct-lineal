"""Exportadores OpenSees (Tcl y OpenSeesPy) del modelo neutro de mesa_modelo.py.

NO se recalcula nada de fisica aqui: se toman nodes/shells/frames/secs/mat/
slabprop/restr/loads de M (el dict que arma mesa_modelo.build()) y se
traducen 1:1 a comandos OpenSees.  El vector de carga F de cada patron ya
viene tal cual lo aplica el solver Hekatan (mesa_modelo._loads): no hay que
rehacer tributarias, Hermite, etc.

Convenciones verificadas NUMERICAMENTE (no de memoria, ver
tests_convergencia/verificar_ejes.py):

- Barra: ElasticTimoshenkoBeam(E,G,A,Jx,Iy,Iz,Avy,Avz,transfTag) con
  Avy=Avz=5/6*A (igual regla que _frame_k de Hekatan cuando no hay As
  explicito).  geomTransf('Linear', tag, *vecxz):
    columna (eje local x = +Z global):  vecxz = (-1, 0, 0)
    viga horizontal (dir X o Y, local x horizontal): vecxz = (0, 0, 1)
  Verificado corriendo OpenSeesPy con carga uniforme local (eleLoad
  beamUniform Wy,Wz) y comparando la componente GLOBAL de desplazamiento
  resultante contra la tríada de hekatan_fem.utils.transformation.frame():
    columna vecxz=(-1,0,0): Wy->+Y global, Wz->-X global  (= local y=+Y,
      local z=-X de Hekatan)
    viga +X  vecxz=(0,0,1): Wy->+Y global, Wz->+Z global  (= identidad,
      igual que Hekatan para barra a lo largo de +X)
  Formula general confirmada (encaja en los dos casos):
      local_y = normalize(vecxz x local_x);  local_z = local_x x local_y

- Losa:
    shellthin -> ShellDKGQ + section ElasticMembranePlateSection
      (E, nu, t, rho=0).  CORRECCION (lo que decia antes aqui era FALSO):
      mesa_modelo.assemble_K() hace `MH.USE_DKQ = True; MH._apply_plate_element()`,
      que en mesa_hekatan.py REEMPLAZA `_st._bending_k_mzc` (el monkeypatch es
      un atributo de modulo, shell_thin.get_local_stiffness_shell_thin lo
      busca por nombre en cada llamada) por `_dkq_bending` = DKQ-Batoz de
      python_dkq.dkq_stiffness -- la flexion REAL de Hekatan Shell-Thin es
      DKQ-Batoz, NO MZC (MZC queda de fallback con USE_DKQ=False, que
      mesa_modelo nunca usa).  Verificado numericamente comparando
      get_local_stiffness_shell_thin() con USE_DKQ True/False para el mismo
      elemento: difieren (max|K_mzc-K_dkq| ~1111, K[2,2] 18472 vs 17361) ->
      son formulaciones distintas y la que corre es DKQ.  Por eso ShellDKGQ
      de OpenSees (tambien DKQ-Batoz) da la MISMA matriz de flexion, GP a GP,
      que Hekatan (ver mas abajo, "Recuperacion de Mxx/Mxy").  La membrana de
      OpenSees SI sigue siendo Q4 bilineal (GQ12 interno del DKGQ) contra el
      Q6 con 4 modos incompatibles de Wilson de Hekatan -> ahi si difieren en
      el plano (se cuantifica en tests_convergencia/test_opensees.py), pero
      la membrana no acopla con la flexion en una placa plana isotropa, asi
      que no contamina Mxx/Mxy.
    membrane -> mismo ShellDKGQ pero con el 5to parametro opcional Ep_mod
      de ElasticMembranePlateSection puesto en 1e-6.  Verificado
      numericamente (sec_check3/4.py): Ep_mod escala LINEAL e
      INDEPENDIENTEMENTE la rigidez de flexion (con Ep_mod=1e6 la flecha
      transversal se achica x1e6; con Ep_mod=1e-3 crece x1e3) sin tocar la
      rigidez de membrana (misma flecha axial para cualquier Ep_mod). Con
      1e-6 la flexion queda ~1e6 veces mas blanda que el caso shellthin,
      equivalente en la practica al bend=0 de Hekatan (y las cargas de
      mesa_modelo para slab="membrane" no ponen fuerza vertical en los
      nudos de losa, asi que el w residual es ~0 de cualquier forma).
    none -> sin shells.
    waffle -> NO SOPORTADO, se lanza WaffleNoSoportado al exportar (ver
      _check_waffle_soportado). Desde que mesa_modelo.mod_matrices() da Db y
      Em con los 10 modificadores CSI (m11,m22,m12 flexion; f11,f22,f12
      membrana), las razones Db/Em por canal (11, 22, 33=twist/shear) son
      INDEPENDIENTES entre si: medido en la mesa 1x1x1 default,
      Db11/Em11=Db22/Em22=1.7536e-3 pero Db33/Em33=2.5829e-4 (6.79x mas chico).
      Probado en OpenSees 3.7.1/3.8.0 (Tcl exe y openseespy):
      `nDMaterial ElasticOrthotropicPlaneStress` y `nDMaterial ElasticOrthotropic`
      + `nDMaterial PlateFiber` + `section LayeredShell` EXISTEN y funcionan,
      pero una capa (o un par simetrico offset +-c) de UN material da
      Db/Em = c^2 (+t^2/12) igual para los 3 canales por construccion (la
      misma matriz de material integrada con peso 1 para membrana y z^2 para
      flexion) -- no hay c que sirva para los 3 canales si sus razones
      difieren.  Se podria en teoria con 3 pares de capas independientes (una
      por canal, con E1=E2~0 salvo el canal que aisla), pero no esta
      implementado ni verificado numericamente -> no se fabrica.  `waffle`
      queda NO SOPORTADO hasta que se implemente y verifique esa capa
      multiple, o mesa_modelo deje de necesitar razones Db/Em independientes.

- Cargas: se aplica el vector combinado F = sum(fac*M["loads"][pat]["F"])
  del combo elegido como UN patron Plain/Linear con factor 1.0 (igual que
  hace mesa_modelo.solve).

Fuerzas de barra -- BUG real encontrado y corregido (no de memoria, medido en
tests_convergencia/): `ops.eleForce(tag)` para ElasticTimoshenkoBeam NO
devuelve [N,Vy,Vz,T,My,Mz] en ejes locales como en otros elementos de barra
de OpenSees -- devuelve las 6 componentes en ejes GLOBALES [Fx,Fy,Fz,Mx,My,Mz]
en cada nudo.  Se probo aplicando cargas puntuales unitarias en cada eje
global por separado a un voladizo y comparando el vector RAW devuelto contra
el resultado de resolver EXACTAMENTE el mismo voladizo con
hekatan_fem.utils.local_stiffness/_transformation (K local @ T @ u):
para una barra a lo largo de +X (donde local=global, caso degenerado) el
raw coincidia por casualidad con [N,Vy,Vz,T,My,Mz]; para una barra a lo largo
de +Y (donde local x=Y, local y=-X, local z=Z) el raw NO coincidia -- pero
SI coincidia exactamente con las fuerzas nodales en ejes GLOBALES.  Por eso
el exportador rota el vector crudo con la MISMA matriz 3x3 de
transformation.frame() (R, filas = ejes locales de Hekatan en globales):
local = R @ raw[0:3] (fuerzas), R @ raw[3:6] (momentos), por nudo.  Sin esta
correccion col_N_max salia 7.4x chico y viga_T_max se confundia con viga_M_max.

Recuperacion de Mxx/Mxy -- MISMA que mesa_modelo.shell_fields(envolvente=True):
`ops.eleResponse(tag,'stresses')` en ShellDKGQ da (4 puntos de Gauss) x
(8 = N11,N22,N12,M11,M22,M12,V13,V23).  Verificado GP a GP (no de memoria):
armé el mismo modelo en Hekatan y en OpenSeesPy, calculé G_hek = Db@B(xi,eta)@ud
en los 4 puntos _GP de mesa_hekatan.py (mismo orden [(-,-),(+,-),(+,+),(-,+)],
2x2 Gauss estandar) y comparé contra el `stresses` crudo de OpenSees para 3
shells con geometria/carga distintas: coincide EXACTO gauss a gauss, mismo
orden, con M11/M22/M12 de OpenSees = -1 * los de Hekatan (convencion de signo
de "M positivo" opuesta entre los dos, consistente en las 3 shells probadas).
Por eso el exportador hace G = -raw[:, [3,4,5]] y despues nod = _AEXT @ G
(la MISMA matriz de extrapolacion Gauss->nudo de mesa_hekatan._AEXT), acumula
por nudo de malla con la MISMA envolvente de |M| que shell_fields() (max |M|
entre los elementos que llegan a ese nudo, no promedio) y reporta el maximo
sobre toda la malla y todos los pisos /GRAV, igual que mesa_modelo.resumen().
Con esto Mxx/Mxy cierran a <0.1% contra Hekatan (ver test_opensees.py) --
el 15-31% que se reportaba antes (tomar el maximo |M| crudo en punto de
Gauss, sin extrapolar a nudo ni envolver) era un artefacto de MI metodo de
extraccion, no una diferencia de formulacion.

Limitacion medida que SI queda (no se pudo evitar): en un modelo de 1 SOLO
elemento aislado, `eleResponse(tag,'stresses')` devuelve ceros en este build
de OpenSeesPy (openseespywin 3.7.1.2) aunque los desplazamientos sean
correctos y no nulos; en el modelo COMPLETO (>1 elemento, el caso real de la
mesa) SI da valores no nulos y coincide con Hekatan como se describe arriba.
No se investigo la causa exacta (posible caso degenerado de 1 elemento); no
afecta al entregable porque la grilla de validacion siempre tiene >1 shell.
"""
from __future__ import annotations
import numpy as np
import mesa_modelo as MM
import mesa_hekatan as MH          # _AEXT, _GP: misma matriz/orden de recovery DKQ
from hekatan_fem.utils.transformation import get_transformation_matrix

EP_MOD_MEMBRANA = 1e-6
GRAV = 9.80665


def _r(v):
    """repr() de un float PYTHON puro (nunca 'np.float64(...)': nodes/F son
    arrays de numpy y su repr no es valido ni en Tcl ni util en el .py)."""
    return repr(float(v))


def _frame_R(nodes, f):
    """3x3 (filas = ejes locales x,y,z de Hekatan en coords globales) para la barra f."""
    T = get_transformation_matrix([nodes[f["i"]], nodes[f["j"]]])
    return T[0:3, 0:3]


def _frame_feq(M, combo):
    """Por indice de barra -> vector feq(12,) NETO del combo, en la MISMA convencion
    local [N,Vy,Vz,T,My,Mz]_i,_j de Hekatan -- espejo EXACTO de la correccion que
    mesa_modelo.frame_forces() resta (`out[e] -= fac*feq`) para pasar de la fuerza
    "cruda" K_local@u a la fuerza de extremo real que reporta CSI.  Se necesita
    porque el exportador aplica el vector F de mesa_modelo como cargas NODALES (no
    como eleLoad distribuido): reacciones y desplazamientos quedan identicos a
    Hekatan por construccion, pero ops.eleForce() (= K_local@u puro, sin la nocion
    de "diagrama") no ve ni la carga distribuida en el tramo (vigas con tributaria
    a 45, slab='none'/'membrane') ni el salto de axial por peso propio de columna
    (`col_sw`: Hekatan reparte w/2 en cada nudo para RESOLVER, pero para REPORTAR
    el axil de extremo sigue el criterio CSI -- el diagrama varia w a lo largo de
    la barra aunque el modelo de cargas sea nodal).  Dos ramas, calcadas de
    mesa_modelo.frame_forces (misma formula, mismos signos):
      col_sw:  feq[0]=feq[6]=-w/2*ex_z   (ex_z = componente Z del eje local x)
      tributaria (Hermite): feq[2]=-Fi, feq[8]=-Fj, feq[4]=Mi, feq[10]=Mj
    """
    out = {}
    nodes = M["nodes"]
    for pn, fac in MM.COMBOS[combo].items():
        for (e, segs) in M["loads"][pn]["frame"]:
            f = M["frames"][e]
            a = float(np.linalg.norm(nodes[f["j"]] - nodes[f["i"]]))
            feq = np.zeros(12)
            if segs == "col_sw":
                w = M["mat"]["gamma"] * M["secs"][f["sec"]]["A"] * a
                ex = get_transformation_matrix([nodes[f["i"]], nodes[f["j"]]])[0, 0:3]
                feq[0] = -w / 2 * ex[2]
                feq[6] = -w / 2 * ex[2]
            else:
                Fi, Mi, Fj, Mj = MM._hermite_loads(a, segs)
                feq[2] = -Fi
                feq[8] = -Fj
                feq[4] = Mi
                feq[10] = Mj
            out[e] = out.get(e, np.zeros(12)) + fac * feq
    return out


def _combo_F(M, combo):
    F = np.zeros(6 * len(M["nodes"]))
    for pn, fac in MM.COMBOS[combo].items():
        F = F + fac * M["loads"][pn]["F"]
    return F


def _restr_flags(M):
    """dict nudo -> [6 bool] con TODOS los apoyos (restr no trae free-node keys),
    MAS el equivalente al fixed_dofs() de mesa_modelo para slab='membrane': los
    nudos de la malla de losa que no son extremo de NINGUNA barra no tienen
    ninguna otra fuente de rigidez en w,rx,ry cuando bend=0 (en Hekatan, K
    diagonal ~0 ahi -> se fijan).  Con el truco de Ep_mod=1e-6 en OpenSees esos
    GDL SI quedan con una rigidez de flexion residual (chica pero no nula) y sin
    fijarlos aparecen arrastrados varios mm por los nudos vecinos que si cargan
    (medido: uz de un nudo interior sin viga pasaba de 0.000 en Hekatan a
    -1.699 mm en OpenSees en la mesa 1x1x1 membrane/L) -> se fijan tambien aqui,
    replicando el resultado (no solo la intencion) de fixed_dofs()."""
    nn = len(M["nodes"])
    flags = [[False] * 6 for _ in range(nn)]
    for n, r in M["restr"].items():
        flags[n] = [bool(x) for x in r]
    if M["shells"] and M["slabprop"]["bend"] == 0.0:
        frame_nodes = set()
        for f in M["frames"]:
            frame_nodes.add(f["i"]); frame_nodes.add(f["j"])
        for n in range(nn):
            if n not in frame_nodes:
                flags[n][2] = flags[n][3] = flags[n][4] = True
    return flags


def _frame_vecxz(f):
    return (-1.0, 0.0, 0.0) if f["tipo"] == "col" else (0.0, 0.0, 1.0)


class WaffleNoSoportado(NotImplementedError):
    pass


def _check_waffle_soportado(M):
    """slab='waffle' en mesa_modelo (desde el cambio a modificadores CSI tipo ETABS,
    mod_matrices()) da Db (flexion) y Em (membrana) con las TRES razones canal a
    canal (11, 22, 33=twist/shear) INDEPENDIENTES entre si -- ver docstring del
    modulo, seccion "waffle NO soportado".  Ninguna seccion de shell de OpenSees
    3.7.1/3.8.0 (Tcl exe y openseespy, ambas probadas) puede reproducir eso.
    Se verifica en cada export (no solo una vez) porque la relacion exacta
    depende de la geometria del reticular (mods)."""
    if M["slabprop"]["tipo"] != "waffle":
        return
    E, nu, t = M["mat"]["E"], M["mat"]["nu"], M["slabprop"]["t"]
    Db, Em = MM.mod_matrices(E, nu, t, M["slabprop"]["mods"])
    r11 = Db[0, 0] / Em[0, 0]
    r33 = Db[2, 2] / Em[2, 2]
    if abs(r11 - r33) > 1e-9 * max(abs(r11), abs(r33)):
        raise WaffleNoSoportado(
            "slab='waffle' NO se puede exportar a OpenSees con una seccion de shell "
            "isotropa ni con una sola capa ortotropica (LayeredShell de 1 material): "
            "Db/Em difiere por canal -- Db11/Em11=%.6g pero Db33/Em33(shear/twist)=%.6g "
            "(razon %.3gx). Evidencia: probado nDMaterial('ElasticOrthotropicPlaneStress') "
            "y nDMaterial('ElasticOrthotropic') + PlateFiber + section LayeredShell en "
            "OpenSees 3.7.1/3.8.0 (Tcl exe y openseespy) -- existen, pero una capa "
            "homogenea (o un par simetrico a +-c) da Db/Em = c^2 (+t^2/12) IGUAL para "
            "los 3 canales E1,E2,G12 por construccion (misma matriz de material "
            "integrada con peso 1 para membrana y z^2 para flexion): no hay forma de "
            "poner una c distinta para el canal de corte/twist sin capas adicionales "
            "que aislen ese canal (E1=E2~0, G12 real) -- posible en teoria (3 pares de "
            "capas, una por canal) pero no implementado: no hay evidencia numerica de "
            "que funcione y no se va a fabricar. slab='waffle' queda NO SOPORTADO."
            % (r11, r33, r11 / r33 if r33 else float("inf")))


def _shell_section_kind(M):
    """'thin' (shellthin, Ep_mod=1) o 'membrane' (Ep_mod chico) o None (sin losa).
    'waffle' revienta antes en _check_waffle_soportado (no llega aqui)."""
    if not M["shells"]:
        return None
    return "membrane" if M["slabprop"]["bend"] == 0.0 else "thin"


def _np_mat_lit(A):
    rows = ["[" + ", ".join(_r(v) for v in row) + "]" for row in np.asarray(A)]
    return "np.array([" + ", ".join(rows) + "])"


# ============================================================
#  OpenSeesPy — script autonomo
# ============================================================
def to_openseespy(M, path, combo="L"):
    _check_waffle_soportado(M)
    nodes = M["nodes"]; nn = len(nodes)
    shells = M["shells"]; frames = M["frames"]
    mat, sl, secs = M["mat"], M["slabprop"], M["secs"]
    F = _combo_F(M, combo)
    flags = _restr_flags(M)
    base_nodes = sorted(M["restr"].keys())
    skind = _shell_section_kind(M)

    lines = []
    w = lines.append
    w("#!/usr/bin/env python3")
    w('"""Exportado por mesa_export_opensees.to_openseespy(). Autonomo: arma,')
    w('resuelve el combo "%s" e imprime/guarda resumen.json con los mismos' % combo)
    w('campos que mesa_modelo.resumen() (kN, m, tonf donde corresponda)."""')
    w("import json, sys")
    w("import numpy as np")
    w("import openseespy.opensees as ops")
    w("")
    w("COMBO = %r" % combo)
    w("")
    w("ops.wipe()")
    w("ops.model('basic', '-ndm', 3, '-ndf', 6)")
    w("")
    w("# ---- nudos ----")
    for i, (x, y, z) in enumerate(nodes):
        w(f"ops.node({i+1}, {_r(x)}, {_r(y)}, {_r(z)})")
    w("")
    w("# ---- apoyos ----")
    for i, fl in enumerate(flags):
        if any(fl):
            w(f"ops.fix({i+1}, {', '.join('1' if b else '0' for b in fl)})")
    w("")
    if skind is not None:
        w("# ---- seccion de losa ----")
        E, nu, t = mat["E"], mat["nu"], sl["t"]
        if skind == "thin":
            w(f"ops.section('ElasticMembranePlateSection', 1, {_r(E)}, {_r(nu)}, {_r(t)}, 0.0)")
        else:
            w(f"ops.section('ElasticMembranePlateSection', 1, {_r(E)}, {_r(nu)}, {_r(t)}, 0.0, {_r(EP_MOD_MEMBRANA)})")
        w("")
        w("# ---- shells (ShellDKGQ) ----")
        for e, s in enumerate(shells):
            n = [x + 1 for x in s["n"]]
            w(f"ops.element('ShellDKGQ', {e+1}, {n[0]}, {n[1]}, {n[2]}, {n[3]}, 1)")
        w("")
    ns = len(shells)
    w("# ---- transformaciones geometricas de barra ----")
    w("ops.geomTransf('Linear', 1, -1.0, 0.0, 0.0)   # columnas (local x=+Z)")
    w("ops.geomTransf('Linear', 2, 0.0, 0.0, 1.0)    # vigas horizontales (local z=+Z)")
    w("")
    w("# ---- barras (ElasticTimoshenkoBeam) ----")
    w("frame_tipo = {}")
    for k, f in enumerate(frames):
        tag = ns + k + 1
        s = secs[f["sec"]]
        E, G = mat["E"], mat["G"]
        A, Iy, Iz, J = s["A"], s["Iy"], s["Iz"], s["J"]
        Avy = Avz = 5.0 / 6.0 * A
        transf = 1 if f["tipo"] == "col" else 2
        w(f"ops.element('ElasticTimoshenkoBeam', {tag}, {f['i']+1}, {f['j']+1}, "
          f"{_r(E)}, {_r(G)}, {_r(A)}, {_r(J)}, {_r(Iy)}, {_r(Iz)}, {_r(Avy)}, {_r(Avz)}, {transf})")
        w(f"frame_tipo[{tag}] = {f['tipo']!r}")
    w("")
    w("# ---- carga: combo %s, vector nodal equivalente de mesa_modelo ----" % combo)
    w("ops.timeSeries('Linear', 1)")
    w("ops.pattern('Plain', 1, 1)")
    for i in range(nn):
        Fi = F[6 * i:6 * i + 6]
        if np.any(np.abs(Fi) > 1e-12):
            w(f"ops.load({i+1}, {', '.join(repr(float(v)) for v in Fi)})")
    w("")
    w("ops.system('BandGeneral')")
    w("ops.numberer('RCM')")
    w("ops.constraints('Plain')")
    w("ops.integrator('LoadControl', 1.0)")
    w("ops.algorithm('Linear')")
    w("ops.analysis('Static')")
    w("ok = ops.analyze(1)")
    w("if ok != 0:")
    w("    print('ANALYZE FALLO, ok=', ok, file=sys.stderr)")
    w("    sys.exit(1)")
    w("")
    w("nn = %d" % nn)
    w("uz = np.array([ops.nodeDisp(i+1, 3) for i in range(nn)])")
    w("base_nodes = %r" % base_nodes)
    w("Rz_total = 0.0")
    w("ops.reactions()")
    w("for n in base_nodes:")
    w("    Rz_total += ops.nodeReaction(n+1, 3)")
    w("")
    w("def _local_ff(raw, R):")
    w("    # raw = [Fx,Fy,Fz,Mx,My,Mz]_i,[...]_j EN EJES GLOBALES (ver docstring:")
    w("    # bug medido de ElasticTimoshenkoBeam.eleForce). R = ejes locales Hekatan")
    w("    # (filas x,y,z) en globales -> local = R @ componente.")
    w("    raw = np.asarray(raw, dtype=float)")
    w("    Ni = R @ raw[0:3];  Mi = R @ raw[3:6]")
    w("    Nj = R @ raw[6:9];  Mj = R @ raw[9:12]")
    w("    return [Ni[0], Ni[1], Ni[2], Mi[0], Mi[1], Mi[2],")
    w("            Nj[0], Nj[1], Nj[2], Mj[0], Mj[1], Mj[2]]   # [N,Vy,Vz,T,My,Mz]_i,_j")
    w("")
    feq = _frame_feq(M, combo)
    w("col_N = []; col_M = []; vig_M = []; vig_T = []; vig_V = []")
    for k, f in enumerate(frames):
        tag = ns + k + 1
        R = _frame_R(nodes, f)
        Rlit = "np.array([[%r,%r,%r],[%r,%r,%r],[%r,%r,%r]])" % tuple(float(v) for v in R.ravel())
        w(f"ff = _local_ff(ops.eleForce({tag}), {Rlit})")
        if k in feq:
            fq = [float(v) for v in feq[k]]
            sets = "; ".join(f"ff[{i}] -= {_r(v)}" for i, v in enumerate(fq) if abs(v) > 1e-15)
            if sets:
                w(sets + "  # correccion feq (ver _frame_feq: tributaria Hermite o col_sw)")
        if f["tipo"] == "col":
            w("col_N += [abs(ff[0]), abs(ff[6])]")
            w("col_M += [abs(ff[4]), abs(ff[5]), abs(ff[10]), abs(ff[11])]")
        else:
            w("vig_M += [abs(ff[4]), abs(ff[10])]")
            w("vig_T += [abs(ff[3]), abs(ff[9])]")
            w("vig_V += [abs(ff[2]), abs(ff[8])]")
    w("")
    w("losa_Mxx = None; losa_Mxy = None; losa_nota = None")
    if skind is not None:
        gx, gy = M["gx"], M["gy"]
        pisos = int(M["P"]["pisos"])
        shell_meta = [(int(s["piso"]), int(s["gi"]), int(s["gj"])) for s in shells]
        w("# Misma recuperacion que mesa_modelo.shell_fields(envolvente=True):")
        w("# ShellDKGQ da M en 4 Gauss [(-,-),(+,-),(+,+),(-,+)], IGUAL orden que")
        w("# mesa_hekatan._GP (verificado GP a GP, ver docstring); signo de M opuesto")
        w("# al de Hekatan (verificado) -> se niega antes de extrapolar con _AEXT.")
        w(f"_AEXT = {_np_mat_lit(MH._AEXT)}")
        w(f"_SHELL_META = {shell_meta!r}   # (piso, gi, gj) por indice de shell")
        w(f"_GX, _GY, _PISOS = {gx}, {gy}, {pisos}")
        w("_CORNERS = [(0,0),(1,0),(1,1),(0,1)]")
        w("try:")
        w("    env_xx = {p: np.zeros((_GY, _GX)) for p in range(1, _PISOS+1)}")
        w("    env_xy = {p: np.zeros((_GY, _GX)) for p in range(1, _PISOS+1)}")
        w("    any_val = False")
        w(f"    for e in range(1, {ns}+1):")
        w("        s = np.array(ops.eleResponse(e, 'stresses'))")
        w("        if not s.size:")
        w("            continue")
        w("        s = s.reshape(-1, 8)")
        w("        G = -s[:, [3, 4, 5]]           # (4,3) M11,M22,M12 convencion Hekatan")
        w("        nod = _AEXT @ G                 # (4,3) valores en los 4 nudos del shell")
        w("        piso, gi, gj = _SHELL_META[e-1]")
        w("        for c4, (di, dj) in enumerate(_CORNERS):")
        w("            ii, jj = gi + di, gj + dj")
        w("            vxx, vxy = nod[c4, 0], nod[c4, 2]")
        w("            any_val = any_val or abs(vxx) > 1e-9 or abs(vxy) > 1e-9")
        w("            if abs(vxx) > abs(env_xx[piso][jj, ii]): env_xx[piso][jj, ii] = vxx")
        w("            if abs(vxy) > abs(env_xy[piso][jj, ii]): env_xy[piso][jj, ii] = vxy")
        w("    if not any_val:")
        w("        losa_nota = ('eleResponse stresses devuelve 0 (visto en modelos de 1 '")
        w("                     'solo elemento en este build de OpenSeesPy) -- ver docstring')")
        w("    else:")
        w("        losa_Mxx = max(np.abs(env_xx[p]).max() for p in env_xx) / %r" % GRAV)
        w("        losa_Mxy = max(np.abs(env_xy[p]).max() for p in env_xy) / %r" % GRAV)
        w("except Exception as ex:")
        w("    losa_nota = f'recovery Mxx/Mxy fallo: {ex}'")
    w("")
    w("out = dict(")
    w("    uz_min_mm=float(uz.min() * 1000),")
    w("    Rz_total_kN=float(Rz_total),")
    w("    col_N_max_kN=float(max(col_N)) if col_N else None,")
    w("    col_M_max_kNm=float(max(col_M)) if col_M else None,")
    w("    viga_M_max_kNm=float(max(vig_M)) if vig_M else None,")
    w("    viga_T_max_kNm=float(max(vig_T)) if vig_T else None,")
    w("    viga_V_max_kN=float(max(vig_V)) if vig_V else None,")
    w("    losa_Mxx_max_tonfm=losa_Mxx,")
    w("    losa_Mxy_max_tonfm=losa_Mxy,")
    w("    losa_nota=losa_nota,")
    w(")")
    w("print(json.dumps(out, indent=1))")
    w("import os")
    w("with open(os.path.splitext(__file__)[0] + '.json', 'w') as fh:")
    w("    json.dump(out, fh, indent=1)")
    w("")
    with open(path, "w") as fh:
        fh.write("\n".join(lines) + "\n")
    return path


# ============================================================
#  OpenSees Tcl
# ============================================================
def to_tcl(M, path, combo="L"):
    _check_waffle_soportado(M)
    nodes = M["nodes"]; nn = len(nodes)
    shells = M["shells"]; frames = M["frames"]
    mat, sl, secs = M["mat"], M["slabprop"], M["secs"]
    F = _combo_F(M, combo)
    flags = _restr_flags(M)
    base_nodes = sorted(M["restr"].keys())
    skind = _shell_section_kind(M)

    lines = []
    w = lines.append
    w("# Exportado por mesa_export_opensees.to_tcl(). Combo: %s" % combo)
    w("wipe")
    w("model basic -ndm 3 -ndf 6")
    w("")
    w("# ---- nudos ----")
    for i, (x, y, z) in enumerate(nodes):
        w(f"node {i+1} {_r(x)} {_r(y)} {_r(z)}")
    w("")
    w("# ---- apoyos ----")
    for i, fl in enumerate(flags):
        if any(fl):
            w(f"fix {i+1} {' '.join('1' if b else '0' for b in fl)}")
    w("")
    if skind is not None:
        E, nu, t = mat["E"], mat["nu"], sl["t"]
        w("# ---- seccion de losa ----")
        if skind == "thin":
            w(f"section ElasticMembranePlateSection 1 {_r(E)} {_r(nu)} {_r(t)} 0.0")
        else:
            w(f"section ElasticMembranePlateSection 1 {_r(E)} {_r(nu)} {_r(t)} 0.0 {_r(EP_MOD_MEMBRANA)}")
        w("")
        w("# ---- shells (ShellDKGQ) ----")
        for e, s in enumerate(shells):
            n = [x + 1 for x in s["n"]]
            w(f"element ShellDKGQ {e+1} {n[0]} {n[1]} {n[2]} {n[3]} 1")
        w("")
    ns = len(shells)
    w("# ---- transformaciones geometricas ----")
    w("geomTransf Linear 1 -1.0 0.0 0.0")
    w("geomTransf Linear 2 0.0 0.0 1.0")
    w("")
    w("# ---- barras (ElasticTimoshenkoBeam) ----")
    for k, f in enumerate(frames):
        tag = ns + k + 1
        s = secs[f["sec"]]
        E, G = mat["E"], mat["G"]
        A, Iy, Iz, J = s["A"], s["Iy"], s["Iz"], s["J"]
        Avy = Avz = 5.0 / 6.0 * A
        transf = 1 if f["tipo"] == "col" else 2
        w(f"element ElasticTimoshenkoBeam {tag} {f['i']+1} {f['j']+1} "
          f"{_r(E)} {_r(G)} {_r(A)} {_r(J)} {_r(Iy)} {_r(Iz)} {_r(Avy)} {_r(Avz)} {transf}")
    w("")
    w("# ---- carga: combo %s ----" % combo)
    w("timeSeries Linear 1")
    w("pattern Plain 1 1 {")
    for i in range(nn):
        Fi = F[6 * i:6 * i + 6]
        if np.any(np.abs(Fi) > 1e-12):
            w(f"    load {i+1} {' '.join(repr(float(v)) for v in Fi)}")
    w("}")
    w("")
    w("system BandGeneral")
    w("numberer RCM")
    w("constraints Plain")
    w("integrator LoadControl 1.0")
    w("algorithm Linear")
    w("analysis Static")
    w("set ok [analyze 1]")
    w("if {$ok != 0} { puts \"ANALYZE FALLO ok=$ok\"; exit 1 }")
    w("")
    w("reactions")
    w("set Rz_total 0.0")
    for n in base_nodes:
        w(f"set Rz_total [expr {{$Rz_total + [nodeReaction {n+1} 3]}}]")
    w("puts \"Rz_total_kN $Rz_total\"")
    w("set uz_min 1e18")
    for i in range(nn):
        w(f"set uzi [nodeDisp {i+1} 3]")
        w(f"if {{$uzi < $uz_min}} {{ set uz_min $uzi }}")
    w("puts \"uz_min_mm [expr {$uz_min*1000}]\"")
    w("# NOTA (bug medido, ver docstring de mesa_export_opensees.py): eleForce de")
    w("# ElasticTimoshenkoBeam da [Fx,Fy,Fz,Mx,My,Mz] en ejes GLOBALES por nudo, NO")
    w("# [N,Vy,Vz,T,My,Mz] locales.  Se rota con R (ejes locales Hekatan, filas x,y,z).")
    w("proc local_ff {ff r00 r01 r02 r10 r11 r12 r20 r21 r22} {")
    w("    set Fxi [lindex $ff 0]; set Fyi [lindex $ff 1]; set Fzi [lindex $ff 2]")
    w("    set Mxi [lindex $ff 3]; set Myi [lindex $ff 4]; set Mzi [lindex $ff 5]")
    w("    set Fxj [lindex $ff 6]; set Fyj [lindex $ff 7]; set Fzj [lindex $ff 8]")
    w("    set Mxj [lindex $ff 9]; set Myj [lindex $ff 10]; set Mzj [lindex $ff 11]")
    w("    set N_i  [expr {$r00*$Fxi + $r01*$Fyi + $r02*$Fzi}]")
    w("    set Vy_i [expr {$r10*$Fxi + $r11*$Fyi + $r12*$Fzi}]")
    w("    set Vz_i [expr {$r20*$Fxi + $r21*$Fyi + $r22*$Fzi}]")
    w("    set T_i  [expr {$r00*$Mxi + $r01*$Myi + $r02*$Mzi}]")
    w("    set My_i [expr {$r10*$Mxi + $r11*$Myi + $r12*$Mzi}]")
    w("    set Mz_i [expr {$r20*$Mxi + $r21*$Myi + $r22*$Mzi}]")
    w("    set N_j  [expr {$r00*$Fxj + $r01*$Fyj + $r02*$Fzj}]")
    w("    set Vy_j [expr {$r10*$Fxj + $r11*$Fyj + $r12*$Fzj}]")
    w("    set Vz_j [expr {$r20*$Fxj + $r21*$Fyj + $r22*$Fzj}]")
    w("    set T_j  [expr {$r00*$Mxj + $r01*$Myj + $r02*$Mzj}]")
    w("    set My_j [expr {$r10*$Mxj + $r11*$Myj + $r12*$Mzj}]")
    w("    set Mz_j [expr {$r20*$Mxj + $r21*$Myj + $r22*$Mzj}]")
    w("    return [list $N_i $Vy_i $Vz_i $T_i $My_i $Mz_i $N_j $Vy_j $Vz_j $T_j $My_j $Mz_j]")
    w("}")
    w("")
    feq = _frame_feq(M, combo)
    w("set col_N_max 0.0; set col_M_max 0.0")
    w("set vig_M_max 0.0; set vig_T_max 0.0; set vig_V_max 0.0")
    for k, f in enumerate(frames):
        tag = ns + k + 1
        R = _frame_R(nodes, f)
        rargs = " ".join(repr(float(v)) for v in R.ravel())
        w(f"set ffraw [eleForce {tag}]")
        w(f"set ff [local_ff $ffraw {rargs}]")
        if k in feq:
            for i, v in enumerate(float(x) for x in feq[k]):
                if abs(v) > 1e-15:
                    w(f"set ff [lreplace $ff {i} {i} [expr {{[lindex $ff {i}] - ({_r(v)})}}]]")
        w(f"set N_i [expr {{abs([lindex $ff 0])}}]; set N_j [expr {{abs([lindex $ff 6])}}]")
        w(f"set My_i [expr {{abs([lindex $ff 4])}}]; set Mz_i [expr {{abs([lindex $ff 5])}}]")
        w(f"set My_j [expr {{abs([lindex $ff 10])}}]; set Mz_j [expr {{abs([lindex $ff 11])}}]")
        w(f"set Vy_i [expr {{abs([lindex $ff 1])}}]; set Vz_i [expr {{abs([lindex $ff 2])}}]")
        w(f"set T_i [expr {{abs([lindex $ff 3])}}]")
        if f["tipo"] == "col":
            w("foreach v [list $N_i $N_j] { if {$v > $col_N_max} { set col_N_max $v } }")
            w("foreach v [list $My_i $Mz_i $My_j $Mz_j] { if {$v > $col_M_max} { set col_M_max $v } }")
        else:
            # BUG corregido (encontrado por Jorge corriendo OpenSees.exe real): resumen()
            # usa My (ff[4],ff[10] -- viga horizontal, z local=vertical, My = flexion
            # FUERTE), no Mz. Aqui se habia puesto Mz por error (eje debil, ~0.1 en vez
            # de ~30 kN.m).
            w("foreach v [list $My_i $My_j] { if {$v > $vig_M_max} { set vig_M_max $v } }")
            w("if {$T_i > $vig_T_max} { set vig_T_max $T_i }")
            w("if {$Vz_i > $vig_V_max} { set vig_V_max $Vz_i }")
    w("puts \"col_N_max_kN $col_N_max\"")
    w("puts \"col_M_max_kNm $col_M_max\"")
    w("puts \"viga_M_max_kNm $vig_M_max\"")
    w("puts \"viga_T_max_kNm $vig_T_max\"")
    w("puts \"viga_V_max_kN $vig_V_max\"")
    if skind is not None:
        a, b, c = float(MH._AEXT[0, 0]), float(MH._AEXT[0, 1]), float(MH._AEXT[0, 2])
        w("")
        w("# ---- Mxx/Mxy: misma recuperacion que mesa_modelo.shell_fields(envolvente=True) ----")
        w("# ShellDKGQ da M en 4 Gauss [(-,-),(+,-),(+,+),(-,+)] = mismo orden que")
        w("# mesa_hekatan._GP (verificado GP a GP); signo de M opuesto al de Hekatan.")
        w("array set envxx {}; array set envxy {}")
        w("set losa_any 0")
        for e, s in enumerate(shells):
            piso, gi, gj = int(s["piso"]), int(s["gi"]), int(s["gj"])
            w(f"set st [eleResponse {e+1} stresses]")
            w("set M11 {}; set M12 {}")
            for gp in range(4):
                w(f"lappend M11 [expr {{-1.0*[lindex $st {gp*8+3}]}}]")
                w(f"lappend M12 [expr {{-1.0*[lindex $st {gp*8+5}]}}]")
            corners = [(0, 0), (1, 0), (1, 1), (0, 1)]
            coefs = [[a, b, c, b], [b, a, b, c], [c, b, a, b], [b, c, b, a]]
            for c4, (di, dj) in enumerate(corners):
                ii, jj = gi + di, gj + dj
                cf = coefs[c4]
                w(f"set vxx [expr {{{_r(cf[0])}*[lindex $M11 0] + {_r(cf[1])}*[lindex $M11 1] + "
                  f"{_r(cf[2])}*[lindex $M11 2] + {_r(cf[3])}*[lindex $M11 3]}}]")
                w(f"set vxy [expr {{{_r(cf[0])}*[lindex $M12 0] + {_r(cf[1])}*[lindex $M12 1] + "
                  f"{_r(cf[2])}*[lindex $M12 2] + {_r(cf[3])}*[lindex $M12 3]}}]")
                key = f"{piso},{jj},{ii}"
                w(f'if {{[expr {{abs($vxx)}}] > 1e-9 || [expr {{abs($vxy)}}] > 1e-9}} {{ set losa_any 1 }}')
                w(f'if {{![info exists envxx({key})]}} {{ set envxx({key}) 0.0 }}')
                w(f'if {{![info exists envxy({key})]}} {{ set envxy({key}) 0.0 }}')
                w(f'if {{[expr {{abs($vxx)}}] > [expr {{abs($envxx({key}))}}]}} {{ set envxx({key}) $vxx }}')
                w(f'if {{[expr {{abs($vxy)}}] > [expr {{abs($envxy({key}))}}]}} {{ set envxy({key}) $vxy }}')
        w("set losa_Mxx_max 0.0; set losa_Mxy_max 0.0")
        w("foreach k [array names envxx] { set v [expr {abs($envxx($k))}]; if {$v > $losa_Mxx_max} { set losa_Mxx_max $v } }")
        w("foreach k [array names envxy] { set v [expr {abs($envxy($k))}]; if {$v > $losa_Mxy_max} { set losa_Mxy_max $v } }")
        w(f"set losa_Mxx_max [expr {{$losa_Mxx_max / {_r(GRAV)}}}]")
        w(f"set losa_Mxy_max [expr {{$losa_Mxy_max / {_r(GRAV)}}}]")
        w('if {$losa_any} { puts "losa_Mxx_max_tonfm $losa_Mxx_max"; puts "losa_Mxy_max_tonfm $losa_Mxy_max" '
          '} else { puts "losa_nota eleResponse_stresses_en_cero" }')
    w("")
    with open(path, "w") as fh:
        fh.write("\n".join(lines) + "\n")
    return path


if __name__ == "__main__":
    import sys, os
    sys.path.insert(0, os.path.dirname(__file__))
    P = dict(nx=1, ny=1, pisos=1, slab="shellthin", support="pin")
    M = MM.build(P)
    to_openseespy(M, "tests_convergencia/export/demo_1x1x1_shellthin.py", combo="L")
    to_tcl(M, "tests_convergencia/export/demo_1x1x1_shellthin.tcl", combo="L")
    print("OK, exportados a tests_convergencia/export/")
