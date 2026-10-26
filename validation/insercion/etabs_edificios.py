# Los 20 edificios del estudio del Tu en ETABS 22: tres situaciones (Centroid / Top marcada / Top desmarcada), cargas D, L, EX, EY nodales
# idénticas a las de Struct (edificios_estudio.mjs) y combinaciones ACI calculadas aquí. kN, m. Sin agrietar.
# uso (desde hekatan-struct): python validation/insercion/etabs_edificios.py [ids...]  ->  validation/insercion/etabs_edificios.json
import json, math, os, sys, time
import numpy as np
import comtypes.client
comtypes.client.CreateObject("ETABSv1.Helper")
import comtypes.gen.ETABSv1 as E

COMBOS = [("1.4D", 1.4, 0, 0, 0), ("1.2D+1.6L", 1.2, 1.6, 0, 0)]
for e, nm in (("EX", "X"), ("EY", "Y")):
    for sg in (1, -1):
        c1 = [1.2, 1.0, 0, 0]; c2 = [0.9, 0, 0, 0]
        c1[2 if e == "EX" else 3] = sg; c2[2 if e == "EX" else 3] = sg
        COMBOS += [("1.2D+L%sE%s" % ("+" if sg > 0 else "-", nm), *c1), ("0.9D%sE%s" % ("+" if sg > 0 else "-", nm), *c2)]
FC = 28.0
ids = sys.argv[1:] or ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "R10", "I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8", "I9", "I10"]
salida = "validation/insercion/etabs_edificios.json"
res = json.load(open(salida)) if os.path.exists(salida) else {}
h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(E.cHelper)
o = h.CreateObjectProgID("CSI.ETABS.API.ETABSObject"); o.ApplicationStart()
sm = o.SapModel
for bid in ids:
    t0 = time.time()
    meta = json.load(open("validation/insercion/etabs/edificios/e_%s.json" % bid))
    sm.InitializeNewModel(6)
    print(bid, "abrir", sm.File.OpenFile(os.path.abspath("validation/insercion/etabs/edificios/e_%s.e2k" % bid)), flush=True)
    sm.SetPresentUnits(6)
    sm.File.Save(os.path.abspath("validation/insercion/etabs/edificios/e_%s.EDB" % bid))
    frames = list(sm.FrameObj.GetNameList(0, [])[1])
    for nm in frames: sm.FrameObj.SetEndLengthOffset(nm, False, 0.0, 0.0, 0.0)
    for nm in sm.AreaObj.GetNameList(0, [])[1]: sm.AreaObj.SetEdgeConstraint(nm, False, 0)
    coord = {}
    def z(p):
        if p not in coord: coord[p] = sm.PointObj.GetCoordCartesian(p)
        return coord[p][2]
    vigas = []
    for f in frames:
        p = sm.FrameObj.GetPoints(f)
        if abs(z(p[0]) - z(p[1])) < 1e-6: vigas.append(f)
    # patrones y cargas nodales
    for pat in ("EX", "EY"): sm.LoadPatterns.Add(pat, 8, 0.0, True)
    pats = {"D": "Dead", "L": "Live", "EX": "EX", "EY": "EY"}
    # los puntos del e2k son POR POSICION EN PLANTA y cada piso tiene su objeto: se asignan las cargas por COORDENADAS
    mapa = {}
    for nm in sm.PointObj.GetNameList(0, [])[1]:
        c = sm.PointObj.GetCoordCartesian(nm); mapa[(round(c[0], 2), round(c[1], 2), round(c[2], 2))] = nm
    faltan = 0
    for lc, pat in pats.items():
        for x, y, zz, fx, fy, fz in meta["cargas"][lc]:
            nm = mapa.get((round(x, 2), round(y, 2), round(zz, 2)))
            if nm is None: faltan += 1; continue
            sm.PointObj.SetLoadForce(nm, pat, [fx, fy, fz, 0.0, 0.0, 0.0], False, "Global", 0)
    print(bid, "puntos", len(mapa), "cargas sin punto:", faltan, flush=True)
    nlc = len(vigas)
    bb, bh = meta["bb"], meta["bh"]
    Acp, pcp = bb * bh * 1e6, 2 * (bb + bh) * 1e3
    Tth = 0.75 * 0.083 * math.sqrt(FC) * Acp ** 2 / pcp / 1e6; Tcr = 0.75 * 0.33 * math.sqrt(FC) * Acp ** 2 / pcp / 1e6
    res[bid] = {}
    for nombre, (card, transf) in {"1_centroid": (10, False), "2_top_marcada": (8, False), "3_top_desmarcada": (8, True)}.items():
        sm.SetModelIsLocked(False)
        for f in vigas:
            r = sm.FrameObj.GetInsertionPoint_1(f)
            sm.FrameObj.SetInsertionPoint_1(f, card, r[1], r[2], bool(transf), list(r[4]), list(r[5]), r[6])
        sm.Analyze.SetRunCaseFlag("", False, True)
        for pat in pats.values(): sm.Analyze.SetRunCaseFlag(pat, True)
        ok = sm.Analyze.RunAnalysis()
        Tc = {}
        for lc, pat in pats.items():
            sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(pat)
            Tc[lc] = [np.array(sm.Results.FrameForce(v, 0, 0, [], [], [], [], [], [], [], [], [], [], [], [], [])[11]) for v in vigas]
        Tu = TuG = TuS = 0.0; ctrl = ""; nth = ncr = 0
        for k in range(nlc):
            mx = 0.0
            for (nm, cD, cL, cX, cY) in COMBOS:
                v = float(np.max(np.abs(cD * Tc["D"][k] + cL * Tc["L"][k] + cX * Tc["EX"][k] + cY * Tc["EY"][k])))
                mx = max(mx, v)
                if v > Tu: Tu, ctrl = v, nm
                if cX == 0 and cY == 0: TuG = max(TuG, v)
                else: TuS = max(TuS, v)
            nth += mx > Tth; ncr += mx > Tcr
        res[bid][nombre] = {"run": ok, "Tu": Tu, "TuGrav": TuG, "TuSism": TuS, "combo": ctrl, "nVigas": nlc, "nSobreUmbral": int(nth), "nSobreTcr": int(ncr)}
        print(bid, nombre, json.dumps(res[bid][nombre]), "%.0f s" % (time.time() - t0), flush=True)
    json.dump(res, open(salida, "w"), indent=1)
try: o.ApplicationExit(False)
except Exception: pass
