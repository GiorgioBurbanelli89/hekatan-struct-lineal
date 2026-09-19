"""SAP2000 (juez): la misma alcantarilla por OAPI, un patrón/caso estático lineal por posición del camión.

Modelo PLANO (grados activos UX, UZ, RY), secciones RECTANGULARES de SAP (1 m × t: SAP calcula A, I33 y
As2 = 5/6·A por su cuenta), hormigón isotrópico E, ν. Muelles nodales U3 = k del .heks. Sin brazos rígidos.
Mismas cargas nodales que Hekatan (los ejes caen en nudo).
uso: python sap2000_alcantarilla.py [ejemplo|plantilla]  -> sap2000_<cual>.json
Salida por posición: U[n] = [ux, uz, ry]; F[e] = [P_i, P_j, V2_i, V2_j, M3_i, M3_j] (diagrama de SAP, estaciones extremas).
"""
import json, sys, time
import comtypes.client

cual = sys.argv[1] if len(sys.argv) > 1 else "ejemplo"
M = json.load(open(f"modelo_{cual}.json"))
t0 = time.time()
import comtypes.gen.SAP2000v1 as S  # noqa: E402  (generado por comtypes la primera vez)
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject")
o.ApplicationStart(6, True)   # visible: para las capturas
sm = o.SapModel
try:
    sm.InitializeNewModel(6)          # kN, m, C
    sm.File.NewBlank()
    sm.SetPresentUnits(6)
    sm.Analyze.SetActiveDOF([True, False, True, False, True, False])
    sm.PropMaterial.SetMaterial("HORM", 2)
    sm.PropMaterial.SetMPIsotropic("HORM", float(M["E"]), float(M["nu"]), 1e-5)
    secs = {}
    def seccion(t):
        k = round(t, 6)
        if k not in secs:
            nm = f"R{int(round(t * 1000))}"
            sm.PropFrame.SetRectangle(nm, "HORM", float(t), 1.0)   # T3 = canto (eje 2), T2 = ancho 1 m
            secs[k] = nm
        return secs[k]
    # canto de cada barra: I = t³/12 (b = 1)
    nom = []
    for x, z in M["nudos"]:
        r = sm.PointObj.AddCartesian(float(x), 0.0, float(z), "", "")
        nom.append(r[0])
    for e, b in enumerate(M["barras"]):
        t = (12 * b["I"]) ** (1 / 3)
        r = sm.FrameObj.AddByPoint(nom[b["i"]], nom[b["j"]], "", seccion(t), f"B{e + 1}")
        sm.FrameObj.SetEndLengthOffset(f"B{e + 1}", False, 0.0, 0.0, 0.0)
    for s in M["muelles"]:
        sm.PointObj.SetSpring(nom[s["nudo"]], [0.0, 0.0, float(s["k"]), 0.0, 0.0, 0.0])
    for n in M["apoyoUx"]:
        sm.PointObj.SetRestraint(nom[n], [True, False, False, False, False, False])
    todos = M["casos"] + M.get("casosIL", [])   # los unitarios: para rehacer la envolvente de pantalla
    for c in todos:
        sm.LoadPatterns.Add(c["nombre"], 8, 0.0, True)
        for nd, P in c["cargas"]:
            sm.PointObj.SetLoadForce(nom[nd], c["nombre"], [0.0, 0.0, -float(P), 0.0, 0.0, 0.0])
    # la envolvente de todas las posiciones como combinación (tipo 1 = Envelope), para verla en SAP
    sm.RespCombo.Add("ENV_CAMION", 1)
    for c in M["casos"]:
        sm.RespCombo.SetCaseList("ENV_CAMION", 0, c["nombre"], 1.0)
    sm.File.Save(__import__("os").path.abspath(f"sap_{cual}.sdb"))
    print("modelo", len(nom), "nudos", len(M["barras"]), "barras", len(M["casos"]), "casos", f"{time.time() - t0:.0f} s", flush=True)
    print("run", sm.Analyze.RunAnalysis(), f"{time.time() - t0:.0f} s", flush=True)
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
    for c in todos:
        sm.Results.Setup.SetCaseSelectedForOutput(c["nombre"])
    idx = {n: i for i, n in enumerate(nom)}
    res = {c["nombre"]: {"U": [[0, 0, 0] for _ in nom], "F": [[0] * 6 for _ in M["barras"]]} for c in todos}
    r = sm.Results.JointDispl("ALL", 2, 0, [], [], [], [], [], [], [], [], [], [], [])
    nR, obj, caso, U1, U3, R2 = r[0], r[1], r[3], r[6], r[8], r[10]
    for k in range(nR):
        if caso[k] in res and obj[k] in idx:
            res[caso[k]]["U"][idx[obj[k]]] = [U1[k], U3[k], R2[k]]
    r = sm.Results.FrameForce("ALL", 2, 0, [], [], [], [], [], [], [], [], [], [], [], [], [])
    nR, obj, sta, caso, P, V2, M3 = r[0], r[1], r[2], r[5], r[8], r[9], r[13]
    ext = {}
    for k in range(nR):
        e = int(obj[k][1:]) - 1
        key = (caso[k], e)
        a = ext.setdefault(key, [None, None])
        if a[0] is None or sta[k] < a[0][0]: a[0] = (sta[k], P[k], V2[k], M3[k])
        if a[1] is None or sta[k] > a[1][0]: a[1] = (sta[k], P[k], V2[k], M3[k])
    for (cs, e), (i, j) in ext.items():
        if cs in res:
            res[cs]["F"][e] = [i[1], j[1], i[2], j[2], i[3], j[3]]
    json.dump(res, open(f"sap2000_{cual}.json", "w"))
    print(f"SAP2000 {cual}: {len(res)} posiciones · {time.time() - t0:.0f} s", flush=True)
    # HK_ESPERA=<fichero>: SAP queda abierto para las capturas hasta que aparezca ese fichero
    espera = __import__("os").environ.get("HK_ESPERA")
    if espera:
        print("ESPERANDO capturas; crear", espera, "para cerrar", flush=True)
        while not __import__("os").path.exists(espera):
            time.sleep(2)
finally:
    o.ApplicationExit(False)
