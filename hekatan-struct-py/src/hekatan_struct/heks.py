"""Lector de `.heks` — el MISMO texto que come el motor TS (`cliModeler.ts`).

Por qué un lector y no un builder en Python: el árbitro tiene que resolver el
modelo que resuelve el motor, letra por letra. Si el modelo se vuelve a escribir
a mano en Python, lo que se compara son dos modelos parecidos, no dos motores.

    from hekatan_struct.heks import leer_heks, resolver_heks
    modelo = leer_heks("galpon_bodega.heks")
    res = resolver_heks(modelo)

Comandos soportados (los que usa el galpón):
    node ID X Y Z
    frame ID nI nJ E A I22 I33 J nu rho [D B]   (# NOMBRE al final, opcional)
    support ID fixed|pinned|uxuyuz...
    load ID FX FY FZ MX MY MZ
    frameload ID WX WY WZ        (kN/m, ejes GLOBALES)
    ang ID grados                (local axis angle CSI)
    as  ID As2 As3               (áreas de cortante, m2)
    release ID <12 bits> | pin fix
    shell ID n1 n2 n3 n4 t E [q] [rho]      (cáscara Q4; q = carga de superficie)
    areaload ID q                (kN/m2 sobre la cáscara, + hacia +z)
    deck etabs                   (panos MEMBRANA como los pisos de ETABS: se parten en sus
                                  nudos de borde y su peso/areaload va a las barras de borde
                                  por area tributaria; sin esto = SAP2000)
    shellmod ID mem bend | ID F11 F22 F12 M11 M22 M12 V13 V23
    shellang ID grados           (se guarda; el solver NO lo usa, ni éste ni el TS)
    shelltype ID thin|thick      (thin = Kirchhoff DKE, thick = Mindlin MITC4)
    spring ID uz|ux|...|0..5 k   (muelle nodal de Winkler, kN/m)
    springarea shellID ks        (muelle de AREA, consistente ks*int N^T N dA sobre uz, como SAFE)
    areaobj ID n1 n2 n3 n4 desde hasta      (agrupa celdas; solo trazabilidad)
    solve / reset                (se ignoran: aquí se resuelve al llamar)

⚠️ El orden de los tokens de `frame` NO es el que sugiere el nombre: el 6º es
I22 (plano 1-3, V3/M2) y el 7º es I33 (plano 1-2, V2/M3 — el del CANTO). Es como
lo lee `cliModeler.ts`; cambiarlo aquí cruzaría las inercias.

⚠️ Lo que el lector NO monta queda CONTADO en `ModeloHeks.ignorados` y avisa
por `errores`. Un modelo que no se lee entero da flecha 0 y báscula perfecta
(0 = 0): el silencio se leería como "se leyó bien".
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field

from .data_model import ElementInputs, NodeInputs
from .solver import analyze, deform


@dataclass
class ModeloHeks:
    nodes: list[tuple[float, float, float]] = field(default_factory=list)
    elements: list[list[int]] = field(default_factory=list)
    node_inputs: NodeInputs = field(default_factory=NodeInputs)
    element_inputs: ElementInputs = field(default_factory=ElementInputs)
    # trazabilidad: ID del .heks <-> índice interno
    node_id: list[int] = field(default_factory=list)
    frame_id: list[int] = field(default_factory=list)
    frame_sec: list[str] = field(default_factory=list)
    shell_id: list[int] = field(default_factory=list)
    # q de superficie de cada cáscara, en kN/m2. El lector la reparte a los
    # cuatro nudos y el solver ya no la necesita, pero el EXPORTADOR sí: ETABS
    # la escribe como `AREALOAD` sobre el objeto, y si se exporta ya repartida
    # queda clavada en los nudos y deja de redistribuirse al cambiar la malla.
    shell_load: dict[int, float] = field(default_factory=dict)
    # índice interno de cada cáscara dentro de `elements`
    shell_idx: dict[int, int] = field(default_factory=dict)
    # multiplicador de PESO PROPIO del comando `selfweight` (0 = no se aplica).
    # Es el patrón `Dead` de ETABS: el acero de las barras y el peso de las
    # cáscaras. Con `endoffset`, las VIGAS pesan por su luz libre.
    selfweight: float = 0.0
    # Los `load` EXPLICITOS del fichero (por indice interno). `ni.loads` lleva
    # ademas lo que el lector reparte (areaload, selfweight); el ESCRITOR tiene
    # que sacar solo estos, o al releer la carga se cuenta dos veces.
    cargas_explicitas: dict[int, tuple] = field(default_factory=dict)
    errores: list[str] = field(default_factory=list)
    # comandos que el lector NO monta (hoy: `spring`, `mass`, `diaph`, y
    # cualquiera que se añada al .heks). Antes se saltaban en silencio: el
    # mezanine, que carga por `areaload` sobre 90 cáscaras, salía con 0 nudos
    # cargados, flecha 0.000 mm y un cierre de báscula perfecto — porque 0 = 0.
    # Un modelo que no se lee entero tiene que DECIRLO.
    ignorados: dict[str, int] = field(default_factory=dict)


# Comandos que el estático NO usa y el motor TS/C++ tampoco: `deform.cpp` no
# los mira, solo `modalCpp`. Se cuentan igual, pero se avisan aparte.
_SOLO_MODAL = {"mass"}

# Igual que `DOF_NAMES` de `cliModeler.ts`: el muelle se puede pedir por el
# nombre del desplazamiento o por el de la fuerza.
_DOF_NOMBRE = {"ux": 0, "uy": 1, "uz": 2, "rx": 3, "ry": 4, "rz": 5,
               "fx": 0, "fy": 1, "fz": 2, "mx": 3, "my": 4, "mz": 5}


def _support_flags(spec: str) -> tuple[bool, bool, bool, bool, bool, bool]:
    s = spec.strip().lower().replace(" ", "")
    if s in ("fixed", "empotrado", "fix"):
        return (True,) * 6
    if s in ("pinned", "articulado", "pin"):
        return (True, True, True, False, False, False)
    if s in ("free", "libre", ""):
        return (False,) * 6
    if set(s) <= {"0", "1"} and len(s) == 6:
        return tuple(c == "1" for c in s)  # type: ignore[return-value]
    keys = ("ux", "uy", "uz", "rx", "ry", "rz")
    return tuple(k in s for k in keys)  # type: ignore[return-value]


def leer_heks(ruta: str) -> ModeloHeks:
    """Parsea un `.heks` y devuelve el modelo listo para `deform`."""
    nodos: dict[int, tuple[float, float, float]] = {}
    frames: list[dict] = []
    sup: dict[int, tuple] = {}
    cargas: dict[int, list[float]] = {}
    fl: dict[int, tuple[float, float, float]] = {}
    angs: dict[int, float] = {}
    ashear: dict[int, tuple[float, float]] = {}
    # `cft ID b h t Ec [nuC]`: tubo de acero relleno; pisa A, I, J y As con las
    # propiedades de CSI (ver cft.py)
    cft_de: dict[int, tuple[float, float, float, float, float]] = {}
    cftc_de: dict[int, tuple[float, float, float, float]] = {}     # `cftc ID D t Ec [nuC]`: tubo REDONDO relleno
    rels: dict[int, list[bool]] = {}
    endoffs: dict[int, tuple[float, float, float]] = {}   # (offI, offJ, rz)
    sw_mult = [0.0]                        # multiplicador de peso propio
    ej_flag = [True]                       # etabsjoint: por DEFECTO como ETABS; `etabsjoint 0` la apaga (modo SAP2000)
    de_flag = [False]                      # `deck etabs`: panos membrana como los pisos de ETABS (ver deck_etabs.py)
    ow_flag = [False]                      # `deck etabs oneway`: reparto en un sentido (eje local 1)
    tf = [1.0]                             # `torsion safe` (=0.1) o `torsion <f>`: SAFE analiza las vigas con 0.1*J (medido 5-sep-2026)
    shells: list[dict] = []
    solidos: list[dict] = []          # `hex ID n1..n8 [E nu rho]`: hexaedros H8
    diafr: dict[int, int] = {}        # `diaph ID grupo`: diafragma rigido por nudo
    inc_flag = [True]                 # `incompatible 0/1`: modos de Wilson–Taylor del H8
    q_area: dict[int, float] = {}          # carga de superficie por shell ID
    smod: dict[int, tuple[float, float]] = {}      # shellmod escalar
    smod_dir: dict[int, list[float]] = {}          # shellmod direccional (8)
    sang: dict[int, float] = {}
    stipo: dict[int, int] = {}             # shelltype: 1 = thin, 0 = thick
    muelles: list[tuple[int, int, float]] = []   # (ID de nudo, GDL, k)
    # `areaspring shellID ks [nodal]` (alias `springarea`, `winkler`, `winklerarea`): Winkler de AREA.
    # Por defecto CONSISTENTE (ks*int N^T N dA, el de SAFE); con `nodal` se reparte a los nudos por
    # int N_i dA, que es lo que hacen SAP2000 y ETABS (medido el 8-sep-2026: SAFE tambien).
    # OJO: hasta el 8-sep-2026 Python solo entendia `springarea` y el TS solo `areaspring`, asi que
    # el MISMO .heks no se leia igual en los dos motores. Ahora los cuatro nombres valen en ambos.
    muelles_area: dict[int, float] = {}
    muelles_area_nodal: set[int] = set()
    # `edge etabs`: los nudos COLGADOS sobre la arista de una cascara se atan a esa arista
    # (w por Hermite cubica con los giros de los extremos, resto lineal), como la restriccion
    # interpolada de ETABS. Sin la directiva quedan sueltos, que es lo que hace SAP2000.
    edge_flag = [False]
    errores: list[str] = []
    ignorados: dict[str, int] = {}

    with open(ruta, encoding="utf-8", errors="replace") as fh:
        for linea in fh:
            t = linea.split()
            if not t or t[0].startswith("#"):
                continue
            cmd = t[0].lower()
            # Comentario INLINE. `cliModeler.ts` no lo quita: cada `parseFloat`
            # de un token opcional le sale NaN y el `isFinite` lo descarta. Aqui
            # se corta la linea, que da lo mismo y no revienta — sin esto, un
            # `shell ... 2.17e7   # SHELL-LOSA` tiraba ValueError y las 1175
            # cascaras de losas_maciza se quedaban FUERA del modelo.
            # `frame` se queda con la linea entera: de ahi saca el nombre de la
            # seccion, que necesita el exportador.
            if cmd not in ("frame", "beam", "column", "f") and "#" in t:
                t = t[:t.index("#")]
            try:
                if cmd == "node" or cmd == "n":
                    nodos[int(t[1])] = (float(t[2]), float(t[3]), float(t[4]))
                elif cmd in ("frame", "beam", "column", "f"):
                    i_com = t.index("#") if "#" in t else len(t)
                    sec = t[i_com + 1] if i_com + 1 < len(t) else ""
                    tk = t[:i_com]

                    def opt(k):
                        return float(tk[k]) if len(tk) > k else None

                    A = float(tk[5]) if len(tk) > 5 else 0.16
                    I22 = float(tk[6]) if len(tk) > 6 else 0.001
                    I33 = opt(7)
                    J = opt(8)
                    frames.append(dict(
                        id=int(tk[1]), nI=int(tk[2]), nJ=int(tk[3]),
                        E=float(tk[4]) if len(tk) > 4 else 25e6,
                        A=A, I22=I22,
                        I33=I33 if I33 is not None else I22,
                        J=J if J is not None else 0.14 * (math.sqrt(A) ** 4),
                        nu=opt(9) if opt(9) is not None else 0.2,
                        rho=opt(10) if opt(10) is not None else 2.45,
                        sec=sec,
                    ))
                elif cmd in ("support", "fix"):
                    sup[int(t[1])] = _support_flags(" ".join(t[2:]))
                elif cmd == "load":
                    v = [float(x) for x in t[2:8]]
                    v += [0.0] * (6 - len(v))
                    a = cargas.setdefault(int(t[1]), [0.0] * 6)
                    for k in range(6):
                        a[k] += v[k]
                elif cmd == "frameload":
                    fl[int(t[1])] = (float(t[2]), float(t[3]), float(t[4]))
                elif cmd == "ang":
                    angs[int(t[1])] = float(t[2])
                elif cmd == "as":
                    ashear[int(t[1])] = (float(t[2]), float(t[3]))
                elif cmd == "cftc":
                    cftc_de[int(t[1])] = (float(t[2]), float(t[3]),
                                          float(t[4]) if len(t) > 4 else 25e6,
                                          float(t[5]) if len(t) > 5 else 0.2)
                elif cmd == "cft":
                    cft_de[int(t[1])] = (float(t[2]), float(t[3]), float(t[4]),
                                         float(t[5]) if len(t) > 5 else 25e6,
                                         float(t[6]) if len(t) > 6 else 0.2)
                elif cmd in ("selfweight", "peso", "sw"):
                    # selfweight [mult]  — el PESO PROPIO, como el patrón `Dead`
                    # de ETABS (selfweight x 1). Hekatan no lo aplicaba nunca en
                    # el estático: había que meterlo a mano en las cargas, y en
                    # el galpón simplemente NO estaba (faltaban 385.5 kN de
                    # acero + la losa). Con esto el .heks puede traer el caso
                    # Dead de verdad.
                    sw_mult[0] = float(t[1]) if len(t) > 1 else 1.0
                elif cmd in ("endoffset", "offset", "lengthoff"):
                    # endoffset ID offI offJ [rz]   — el END LENGTH OFFSET de CSI.
                    # `rz` es el rigid-zone factor (0-1); ETABS trae 0 por
                    # defecto, y con 0 el offset NO rigidiza: solo descuenta el
                    # peso propio de las vigas y mueve la estacion de esfuerzos.
                    endoffs[int(t[1])] = (float(t[2]), float(t[3]),
                                          float(t[4]) if len(t) > 4 else 0.0)
                elif cmd == "release":
                    if len(t) >= 3 and set("".join(t[2:])) <= {"0", "1"}:
                        bits = "".join(t[2:])
                        rels[int(t[1])] = [c == "1" for c in bits]
                    else:  # forma corta: pin / fix por extremo
                        pal = [x.lower() for x in t[2:4]]
                        r = [False] * 12
                        if len(pal) > 0 and pal[0] == "pin":
                            r[4] = r[5] = True
                        if len(pal) > 1 and pal[1] == "pin":
                            r[10] = r[11] = True
                        rels[int(t[1])] = r
                elif cmd in ("diaph", "diaphragm"):
                    # diaph <nodeID> <grupo>  — diafragma rigido (ETABS "Rigid"); 0 lo quita
                    diafr[int(t[1])] = int(float(t[2])) if len(t) > 2 else 1
                elif cmd in ("hex", "solid", "h8"):
                    # hex ID n1 n2 n3 n4 n5 n6 n7 n8 [E] [nu] [rho]  (orden del H8 de Hekatan)
                    solidos.append(dict(id=int(t[1]), pts=[int(x) for x in t[2:10]],
                                        E=float(t[10]) if len(t) > 10 else 25e6,
                                        nu=float(t[11]) if len(t) > 11 else 0.2,
                                        rho=float(t[12]) if len(t) > 12 else 2.45))
                elif cmd == "incompatible":
                    inc_flag[0] = (t[1] if len(t) > 1 else "1").lower() not in ("0", "no", "off", "false")
                elif cmd in ("shell", "plate", "s"):
                    # shell ID n1 n2 n3 n4 t E [q] [rho]
                    sid = int(t[1])
                    pts = [int(t[2]), int(t[3]), int(t[4]), int(t[5])]
                    esp = float(t[6]) if len(t) > 6 else 0.20
                    Esh = float(t[7]) if len(t) > 7 else 25e6
                    # token 8: carga de superficie del propio shell.
                    # token 9: densidad — el DECK colaborante pesa menos que
                    # una losa maciza del mismo canto (loseta + nervios).
                    if len(t) > 8:
                        qv = float(t[8])
                        if qv != 0:
                            q_area[sid] = qv
                    rho_sh = float(t[9]) if len(t) > 9 else 2.45
                    shells.append(dict(id=sid, pts=pts, t=esp, E=Esh, rho=rho_sh))
                elif cmd in ("areaload", "qarea"):
                    q_area[int(t[1])] = float(t[2])
                elif cmd == "shellmod":
                    sid = int(t[1])
                    vals = [float(v) for v in t[2:]]
                    if len(vals) >= 8:
                        smod_dir[sid] = vals[:8]
                    elif len(vals) >= 2:
                        smod[sid] = (vals[0], vals[1])
                elif cmd == "shellang":
                    sang[int(t[1])] = float(t[2])
                elif cmd in ("springarea", "winklerarea", "areaspring", "winkler"):
                    muelles_area[int(t[1])] = float(t[2])
                    if any(x.lower() in ("nodal", "lumped", "sap", "etabs") for x in t[3:]):
                        muelles_area_nodal.add(int(t[1]))
                elif cmd in ("edge", "edgeconstraint"):
                    v = (t[1] if len(t) > 1 else "etabs").lower()
                    edge_flag[0] = v in ("etabs", "1", "on", "si", "hermite")
                elif cmd in ("deck", "deckmode"):
                    v = (t[1] if len(t) > 1 else "etabs").lower()
                    de_flag[0] = v in ("etabs", "1", "on", "si")
                    ow_flag[0] = any(x.lower() in ("oneway", "1way", "unidireccional") for x in t[2:])
                elif cmd in ("torsion", "jmod"):
                    v = (t[1] if len(t) > 1 else "safe").lower()
                    tf[0] = 0.1 if v == "safe" else float(v)
                elif cmd in ("etabsjoint", "etabswalljoint"):
                    # etabsjoint [0|1] -> la penalizacion viga-muro de ETABS
                    ej_flag[0] = (len(t) < 2) or (t[1].strip().lower() not in ("0", "no", "off", "false"))
                elif cmd in ("shelltype", "plateform"):
                    q = t[2].lower() if len(t) > 2 else ""
                    if q in ("thin", "delgada", "kirchhoff", "1"):
                        stipo[int(t[1])] = 1
                    elif q in ("thick", "gruesa", "mindlin", "0"):
                        stipo[int(t[1])] = 0
                    else:
                        errores.append(f"shelltype {t[1]}: se esperaba thin o thick")
                elif cmd == "spring":
                    # spring nodoID uz 15000   — GDL por nombre o por número
                    nom = t[2].lower() if len(t) > 2 else "uz"
                    dof = _DOF_NOMBRE.get(nom)
                    if dof is None:
                        dof = int(nom) if nom.isdigit() and int(nom) < 6 else 2
                    muelles.append((int(t[1]), dof,
                                    float(t[3]) if len(t) > 3 else 1000.0))
                elif cmd == "areaobj":
                    continue        # agrupa celdas para el exportador, no da rigidez
                elif cmd in ("solve", "reset"):
                    continue        # no aportan modelo: no son un hueco
                else:
                    # shell, areaload, shellang, shellmod, spring, mass, diaph…
                    # y cualquier comando futuro: se cuentan, no se callan.
                    ignorados[cmd] = ignorados.get(cmd, 0) + 1
            except (IndexError, ValueError) as e:
                errores.append(f"{linea.strip()!r}: {e}")

    # `deck etabs`: partir los panos membrana en sus nudos de borde y llevar su peso/areaload
    # a las barras de borde por area tributaria (lo que hace ETABS). Antes de montar nada.
    tribut: set[int] = set()
    if de_flag[0]:
        from .deck_etabs import aplicar_deck_etabs
        tribut = aplicar_deck_etabs(nodos, frames, shells, smod_dir, smod, q_area, sang, stipo,
                                    cargas, sw_mult[0], oneway=ow_flag[0])
    m = ModeloHeks(errores=errores, ignorados=ignorados)
    ids = sorted(nodos)                       # mismo orden que cliModeler.ts
    idx_de = {nid: k for k, nid in enumerate(ids)}
    m.node_id = ids
    m.nodes = [nodos[i] for i in ids]

    ei, ni = m.element_inputs, m.node_inputs
    for f in frames:
        if f["nI"] not in idx_de or f["nJ"] not in idx_de:
            m.errores.append(f"frame {f['id']}: nodo inexistente")
            continue
        k = len(m.elements)
        m.elements.append([idx_de[f["nI"]], idx_de[f["nJ"]]])
        m.frame_id.append(f["id"])
        m.frame_sec.append(f["sec"])
        nu = f["nu"]
        ei.elasticities[k] = f["E"]
        ei.shear_moduli[k] = f["E"] / (2 * (1 + nu))
        ei.poissons_ratios[k] = nu
        ei.areas[k] = f["A"]
        ei.moments_of_inertia_y[k] = f["I22"]    # token 6 -> I22 (plano 1-3)
        ei.moments_of_inertia_z[k] = f["I33"]    # token 7 -> I33 (plano 1-2)
        ei.torsional_constants[k] = f["J"] * tf[0]
        ei.densities[k] = f["rho"]
        if f["id"] in angs:
            ei.local_angles[k] = angs[f["id"]]
        if f["id"] in ashear:
            As2, As3 = ashear[f["id"]]
            ei.shear_areas_z[k] = As2   # As2 -> V2, va con I33 (=moments_z)
            ei.shear_areas_y[k] = As3   # As3 -> V3, va con I22 (=moments_y)
        if f["id"] in cftc_de:
            from .cft import cftc_props
            cD, ct, Ec, nuC = cftc_de[f["id"]]
            c = cftc_props(cD, ct, f["E"], nu, Ec, nuC)
            ei.areas[k] = c["A"]
            ei.moments_of_inertia_y[k] = c["I22"]
            ei.moments_of_inertia_z[k] = c["I33"]
            ei.torsional_constants[k] = c["J"] * tf[0]
            ei.shear_areas_z[k] = c["As2"]
            ei.shear_areas_y[k] = c["As3"]
        if f["id"] in cft_de:
            from .cft import cft_props
            cb, ch, ct, Ec, nuC = cft_de[f["id"]]
            c = cft_props(cb, ch, ct, f["E"], nu, Ec, nuC)
            ei.areas[k] = c["A"]
            ei.moments_of_inertia_y[k] = c["I22"]
            ei.moments_of_inertia_z[k] = c["I33"]
            ei.torsional_constants[k] = c["J"] * tf[0]
            ei.shear_areas_z[k] = c["As2"]
            ei.shear_areas_y[k] = c["As3"]
        if f["id"] in rels:
            ei.moment_releases[k] = rels[f["id"]]
        if f["id"] in endoffs:
            ei.end_offsets[k] = endoffs[f["id"]]
        if f["id"] in fl:
            ei.frame_loads[k] = fl[f["id"]]

    # ── CÁSCARAS ────────────────────────────────────────────────────────
    # Van DESPUÉS de las barras, como en `cliModeler.ts`: el índice interno de
    # un elemento es su posición en `elements`, y si el orden no es el mismo
    # los dos motores no están numerando lo mismo.
    for sh in shells:
        if any(p not in idx_de for p in sh["pts"]):
            m.errores.append(f"shell {sh['id']}: algún nodo inexistente")
            continue
        k = len(m.elements)
        m.elements.append([idx_de[p] for p in sh["pts"]])
        m.shell_id.append(sh["id"])
        m.shell_idx[sh["id"]] = k
        ei.elasticities[k] = sh["E"]
        ei.shear_moduli[k] = sh["E"] / (2 * 1.2)   # nu = 0.2, como cliModeler
        ei.poissons_ratios[k] = 0.2
        ei.thicknesses[k] = sh["t"]
        ei.densities[k] = sh["rho"]
        if sh["id"] in smod_dir:
            d = smod_dir[sh["id"]]
            ei.shell_modifiers[k] = d
            # Y ADEMÁS el par escalar equivalente, que es lo único que mira el
            # modal: si aquí no se pone, el estático arma el deck con flexión 0
            # y el modal con flexión 1 — dos rigideces para el MISMO modelo.
            ei.membrane_modifiers[k] = (d[0] + d[1]) / 2
            ei.bending_modifiers[k] = (d[3] + d[4]) / 2
        elif sh["id"] in smod:
            ei.membrane_modifiers[k] = smod[sh["id"]][0]
            ei.bending_modifiers[k] = smod[sh["id"]][1]
        if sh["id"] in sang:
            ei.shell_angles[k] = sang[sh["id"]]
        if sh["id"] in stipo:
            ei.plate_formulations[k] = stipo[sh["id"]]
        if sh["id"] in q_area:
            m.shell_load[k] = q_area[sh["id"]]

    for nid, flags in sup.items():
        if nid in idx_de:
            ni.supports[idx_de[nid]] = flags
    for nid, v in cargas.items():
        if nid in idx_de:
            ni.loads[idx_de[nid]] = tuple(v)  # type: ignore[assignment]
            m.cargas_explicitas[idx_de[nid]] = tuple(v)

    # ── CARGA DE SUPERFICIE -> vector de fuerzas nodales CONSISTENTE ────────
    # Una carga de área entra al FEM por un único camino: f_i = ∫ N_i·q·dA. No
    # hay otro, así que calcularlo aquí da lo MISMO que hacerlo dentro del
    # kernel: es la definición, no un atajo. Port de `cliModeler.ts`.
    #
    # Se integra con Gauss 2x2 y el jacobiano REAL (el módulo del producto
    # vectorial de las tangentes, que vale para un paño en cualquier plano, no
    # solo horizontal). En un rectángulo sale q·A/4 en cada nudo; en un
    # cuadrilátero deformado NO, y ahí está la diferencia con repartir el área
    # entre cuatro.
    g2 = 1.0 / math.sqrt(3.0)
    gauss = ((-g2, -g2), (g2, -g2), (g2, g2), (-g2, g2))
    for sh in shells:
        q = q_area.get(sh["id"])
        if not q:
            continue
        if any(p not in idx_de for p in sh["pts"]):
            continue                       # ya avisado al montar la cáscara
        idx4 = [idx_de[p] for p in sh["pts"]]
        P = [m.nodes[i] for i in idx4]
        f = [0.0, 0.0, 0.0, 0.0]
        for xi, eta in gauss:
            N = (0.25 * (1 - xi) * (1 - eta), 0.25 * (1 + xi) * (1 - eta),
                 0.25 * (1 + xi) * (1 + eta), 0.25 * (1 - xi) * (1 + eta))
            dNx = (-0.25 * (1 - eta), 0.25 * (1 - eta),
                   0.25 * (1 + eta), -0.25 * (1 + eta))
            dNe = (-0.25 * (1 - xi), -0.25 * (1 + xi),
                   0.25 * (1 + xi), 0.25 * (1 - xi))
            a = [sum(dNx[i] * P[i][c] for i in range(4)) for c in range(3)]
            b = [sum(dNe[i] * P[i][c] for i in range(4)) for c in range(3)]
            cr = (a[1] * b[2] - a[2] * b[1],
                  a[2] * b[0] - a[0] * b[2],
                  a[0] * b[1] - a[1] * b[0])
            detJ = math.sqrt(cr[0] ** 2 + cr[1] ** 2 + cr[2] ** 2)  # dA real
            for i in range(4):
                f[i] += N[i] * q * detJ
        for i, k in enumerate(idx4):
            prev = list(ni.loads.get(k, (0.0,) * 6))
            prev[2] += f[i]                                        # Fz
            ni.loads[k] = tuple(prev)  # type: ignore[assignment]

    for so in solidos:
        if any(p not in idx_de for p in so["pts"]):
            m.errores.append(f"hex {so['id']}: algún nodo inexistente")
            continue
        k = len(m.elements)
        m.elements.append([idx_de[p] for p in so["pts"]])
        ei.elasticities[k] = so["E"]
        ei.poissons_ratios[k] = so["nu"]
        ei.shear_moduli[k] = so["E"] / (2 * (1 + so["nu"]))
        ei.densities[k] = so["rho"]
    ei.solid_incompatible = inc_flag[0]
    for nid, g in diafr.items():
        if nid in idx_de and g > 0:
            m.node_inputs.diaphragms[idx_de[nid]] = g
    huerfanas_q = set(q_area) - {sh["id"] for sh in shells}
    if huerfanas_q:
        m.errores.append(f"areaload sin cáscara: {sorted(huerfanas_q)[:10]}")
    for sid, ks in muelles_area.items():
        if sid in m.shell_idx:
            ni.area_springs[m.shell_idx[sid]] = ks
            if sid in muelles_area_nodal:
                ni.area_springs_nodal.add(m.shell_idx[sid])
        else:
            m.errores.append(f"areaspring sin cáscara: {sid}")
    # `edge etabs`: buscar los nudos colgados sobre aristas de cascara y anotarlos
    if edge_flag[0]:
        ni.hanging_nodes = _nudos_colgados(m.nodes, m.elements)
    huerfanos_muelle = []
    for nid, dof, kk in muelles:
        if nid in idx_de:
            ni.springs.append((idx_de[nid], dof, kk))
        else:
            huerfanos_muelle.append(nid)
    if huerfanos_muelle:
        m.errores.append(f"spring sin nudo: {sorted(set(huerfanos_muelle))[:10]}")

    huerfanos_tipo = set(stipo) - {sh["id"] for sh in shells}
    if huerfanos_tipo:
        m.errores.append(f"shelltype sin cáscara: {sorted(huerfanos_tipo)[:10]}")

    huerfanas = set(fl) - {f["id"] for f in frames}
    if huerfanas:
        m.errores.append(f"frameload sin barra: {sorted(huerfanas)[:10]}")
    if ignorados:
        # `mass` y `diaph` no entran en el estático NI en el motor TS/C++
        # (`deform.cpp` no los mira; solo `modalCpp`). Decirlo aparte, porque
        # meterlos en la misma lista que un hueco de verdad haría dudar de un
        # resultado que está bien.
        modal = {k: v for k, v in ignorados.items() if k in _SOLO_MODAL}
        resto = {k: v for k, v in ignorados.items() if k not in _SOLO_MODAL}
        if resto:
            detalle = ", ".join(f"{k}x{v}" for k, v in sorted(resto.items()))
            m.errores.append(f"comandos NO montados: {detalle}")
        if modal:
            detalle = ", ".join(f"{k}x{v}" for k, v in sorted(modal.items()))
            m.errores.append(
                f"solo para el modal, no afectan a este cálculo: {detalle}")
    # PESO PROPIO (`selfweight`). Se aplica al final, cuando ya están montados
    # los elementos: barras por su LUZ LIBRE si tienen `endoffset` (regla de
    # ETABS) y cáscaras por su área. Va a `node_inputs.loads`, o sea que se
    # suma a las cargas del fichero como un patrón `Dead` más.
    if sw_mult[0]:
        from .extensions import apply_selfweight
        apply_selfweight(m.nodes, m.elements, ei, ni, sw_multiplier=sw_mult[0],
                         skip_elements={m.shell_idx[sid] for sid in tribut if sid in m.shell_idx})
        m.selfweight = sw_mult[0]
    ei.etabs_wall_joint = ej_flag[0]
    if not ni.loads and not ei.frame_loads:
        m.errores.append("modelo SIN carga: la deformada va a salir 0")
    return m


def _nudos_colgados(nodes, elements, tol: float = 1e-6):
    """Nudos que caen DENTRO de una arista de una cascara sin ser vertice suyo (malla no conforme).

    Devuelve [(idx_elemento, idx_nudo)]. Solo se anotan los nudos que pertenecen a OTRO elemento:
    un nudo suelto de verdad no hay que atarlo, hay que avisarlo (y `deform` ya lo hace).
    Es el `edge etabs` de Hekatan; espejo de `springsExtra.h` en el C++.
    """
    import numpy as np
    N = np.asarray(nodes, float)
    shells = [(e, list(c)) for e, c in enumerate(elements) if len(c) in (3, 4)]
    de_algun_elem = set()
    for c in elements:
        de_algun_elem.update(int(x) for x in c)
    out: list[tuple[int, int]] = []
    for e, conn in shells:
        P = N[conn]
        lo, hi = P.min(axis=0) - tol, P.max(axis=0) + tol
        for h in range(len(N)):
            if h in conn or h not in de_algun_elem:
                continue
            X = N[h]
            if np.any(X < lo) or np.any(X > hi):
                continue
            for k in range(len(conn)):
                A, B = P[k], P[(k + 1) % len(conn)]
                d = B - A
                L2 = float(d @ d)
                if L2 < 1e-24:
                    continue
                t = float((X - A) @ d) / L2
                if t <= tol or t >= 1 - tol:
                    continue
                if np.linalg.norm((X - A) - t * d) <= tol * np.sqrt(L2):
                    # el nudo tiene que estar en OTRO elemento para que atarlo signifique algo
                    if any(h in list(c) for i2, c in enumerate(elements) if i2 != e):
                        out.append((e, h))
                    break
    return out


def resolver_heks(m: ModeloHeks):
    """`deform` sobre un modelo ya leído."""
    return deform(m.nodes, m.elements, m.node_inputs, m.element_inputs)


def esfuerzos_heks(m: ModeloHeks, res):
    """`analyze` sobre un modelo ya leído."""
    return analyze(m.nodes, m.elements, m.element_inputs, res)


def escribir_heks(m: ModeloHeks, ruta: str | None = None) -> str:
    """El camino de vuelta: un `ModeloHeks` -> el texto `.heks`.

    Para qué, si ya hay lector: para tener un SEGUNDO camino hasta ETABS. El
    `.heks` lo lee `cliModeler` y de ahí sale el `.e2k` con `exportE2k`; o sea
    que escribiendo el modelo se puede montar el mismo caso en ETABS **por
    fichero**, sin tocar la OAPI. Y falta hace: en un solo día la OAPI dio nueve
    fallos MUDOS (métodos que no existen, firmas que revientan desde dentro de
    comtypes, un `RunAnalysis` que corre sin guardar y devuelve cero filas).
    Con dos caminos independientes, si los dos dan el mismo número la medida es
    sólida; si no, el montaje estaba mal y no el programa.

    Lo que escribe: `node`, `frame` (+ `ang`, `as`, `release`, `frameload`),
    `endoffset`, `shell` (+ `shellmod`, `shellang`, `shelltype`), `support`, `load`,
    `spring`. O sea todo lo que el lector monta — lo que no monta tampoco se
    inventa aquí.

    ⚠️ El 6º token de `frame` es **I22** y el 7º **I33**, y en `as` va **As2**
    primero. Escribirlos al revés no da error: da otra estructura.
    """
    ei, ni = m.element_inputs, m.node_inputs
    L = ["# escrito por hekatan_struct.heks.escribir_heks",
         "# node ID X Y Z"]
    ids_n = m.node_id if len(m.node_id) == len(m.nodes) else list(
        range(1, len(m.nodes) + 1))
    for i, p in enumerate(m.nodes):
        L.append("node %d %.6f %.6f %.6f" % (ids_n[i], p[0], p[1], p[2]))

    L.append("# frame ID nI nJ E A I22 I33 J nu rho")
    n_frame = 0
    ids_f = {}
    for k, c in enumerate(m.elements):
        if len(c) != 2:
            continue
        n_frame += 1
        fid = m.frame_id[n_frame - 1] if len(m.frame_id) >= n_frame else n_frame
        ids_f[k] = fid
        nu = ei.poissons_ratios.get(k, 0.2)
        sec = (m.frame_sec[n_frame - 1]
               if len(m.frame_sec) >= n_frame else "")
        L.append("frame %d %d %d %.6g %.8g %.8g %.8g %.8g %.4g %.6g%s"
                 % (fid, ids_n[c[0]], ids_n[c[1]], ei.elasticities.get(k, 25e6),
                    ei.areas.get(k, 0.0), ei.moments_of_inertia_y.get(k, 0.0),
                    ei.moments_of_inertia_z.get(k, 0.0),
                    ei.torsional_constants.get(k, 0.0), nu,
                    ei.densities.get(k, 2.45),
                    ("   # " + sec) if sec else ""))
    for k, fid in ids_f.items():
        if k in ei.local_angles:
            L.append("ang %d %.6g" % (fid, ei.local_angles[k]))
    for k, fid in ids_f.items():
        if k in ei.shear_areas_z or k in ei.shear_areas_y:
            L.append("as %d %.8g %.8g"
                     % (fid, ei.shear_areas_z.get(k, 0.0),
                        ei.shear_areas_y.get(k, 0.0)))
    if getattr(m, "selfweight", 0.0):
        L.append("selfweight %.4g" % m.selfweight)
    if not getattr(ei, "etabs_wall_joint", True):
        L.append("etabsjoint 0")      # el defecto es 1 (como ETABS): solo se escribe el apagado
    for k, fid in ids_f.items():
        if k in ei.end_offsets:
            L.append("endoffset %d %.6g %.6g %.4g" % ((fid,) + tuple(ei.end_offsets[k])))
    for k, fid in ids_f.items():
        if k in ei.moment_releases:
            L.append("release %d %s"
                     % (fid, " ".join("1" if b else "0"
                                      for b in ei.moment_releases[k])))
    for k, fid in ids_f.items():
        if k in ei.frame_loads:
            w = ei.frame_loads[k]
            L.append("frameload %d %.8g %.8g %.8g" % (fid, w[0], w[1], w[2]))

    n_sh = 0
    ids_s = {}
    for k, c in enumerate(m.elements):
        if len(c) != 4:
            continue
        n_sh += 1
        sid = m.shell_id[n_sh - 1] if len(m.shell_id) >= n_sh else n_sh
        ids_s[k] = sid
        if n_sh == 1:
            L.append("# shell ID n1 n2 n3 n4 t E [q] [rho]")
        # Los tokens 8 y 9 son `q` y `rho`. La DENSIDAD hay que escribirla
        # siempre que se conozca: si se omite, el lector pone 2.45 por defecto
        # y una cáscara que se metió con densidad 0 —o con la equivalente de un
        # deck nervado— vuelve a leerse con otro peso.
        rho_sh = ei.densities.get(k)
        L.append("shell %d %d %d %d %d %.8g %.6g%s"
                 % (sid, ids_n[c[0]], ids_n[c[1]], ids_n[c[2]], ids_n[c[3]],
                    ei.thicknesses.get(k, 0.20), ei.elasticities.get(k, 25e6),
                    ("" if rho_sh is None
                     else " %.8g %.10g" % (m.shell_load.get(k, 0.0), rho_sh))))
        if k in m.shell_load:
            L.append("areaload %d %.8g" % (sid, m.shell_load[k]))
    for k, sid in ids_s.items():
        d = ei.shell_modifiers.get(k)
        if d:
            L.append("shellmod %d %s" % (sid, " ".join("%.6g" % v for v in d)))
        elif k in ei.membrane_modifiers or k in ei.bending_modifiers:
            L.append("shellmod %d %.6g %.6g"
                     % (sid, ei.membrane_modifiers.get(k, 1.0),
                        ei.bending_modifiers.get(k, 1.0)))
        if k in ei.shell_angles:
            L.append("shellang %d %.6g" % (sid, ei.shell_angles[k]))
        if k in ei.plate_formulations:
            L.append("shelltype %d %s"
                     % (sid, "thin" if ei.plate_formulations[k] == 1 else "thick"))

    for i, fl in sorted(ni.supports.items()):
        L.append("support %d %s" % (ids_n[i], "".join("1" if f else "0"
                                                      for f in fl)))
    # Solo los `load` explicitos: `ni.loads` ya lleva repartidos `areaload` y
    # `selfweight`, que se escriben aparte. Escribirlo todo doblaba la carga al
    # releer (mezanine: 3473 -> 6946 kN). Si el modelo no viene de un fichero
    # (no hay explicitas) se escriben las nodales tal cual.
    fuente = m.cargas_explicitas if (m.cargas_explicitas or m.shell_load
                                      or getattr(m, "selfweight", 0.0)) else ni.loads
    for i, v in sorted(fuente.items()):
        L.append("load %d %.8g %.8g %.8g %.8g %.8g %.8g"
                 % (ids_n[i], v[0], v[1], v[2], v[3], v[4], v[5]))
    _DOF = ("ux", "uy", "uz", "rx", "ry", "rz")
    for i, d, kk in ni.springs:
        L.append("spring %d %s %.8g" % (ids_n[i], _DOF[d], kk))
    L.append("solve")
    texto = "\n".join(L) + "\n"
    if ruta:
        with open(ruta, "w", encoding="utf-8") as fh:
            fh.write(texto)
    return texto
