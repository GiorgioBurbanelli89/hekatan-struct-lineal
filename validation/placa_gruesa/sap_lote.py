# -*- coding: utf-8 -*-
"""Lote para SAP2000 24 (UNA sola instancia): estaticos desde volcados de Struct (misma malla nudo a nudo,
mismas cargas nodales) en Shell-Thick y Shell-Thin, y pandeo Thick con mallas refinadas.
    python sap_lote.py estatico dump1.json dump2.json ...   -> res_sap/<nombre>_<thick|thin>.json
    python sap_lote.py pandeo                                -> res_sap/pandeo_thick.json"""
import json, os, sys, time
import comtypes.client
import comtypes.gen.SAP2000v1 as S
AQUI = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(AQUI, "res_sap"); os.makedirs(OUT, exist_ok=True)
SDB = os.path.join(AQUI, "sap_tmp", "m.sdb"); os.makedirs(os.path.dirname(SDB), exist_ok=True)
modo = sys.argv[1]
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
for intento in range(6):
    try:
        o = h.CreateObject(r"C:\Program Files\Computers and Structures\SAP2000 24\SAP2000.exe")
        o.ApplicationStart(6, False, ""); sm = o.SapModel; sm.GetVersion(); break
    except Exception as ex:
        print("arranque fallido", intento, ex, flush=True); time.sleep(20)
print("SAP arriba", flush=True)

def todos_desp(caso, n):
    R = sm.Results; R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetCaseSelectedForOutput(caso)
    r = R.JointDispl("ALL", 2, 0, [], [], [], [], [], [], [], [], [], [], [])
    U = [None] * n
    for k in range(r[0]):
        nm = r[1][k]
        if nm.startswith("N"): U[int(nm[1:])] = [r[q][k] for q in range(6, 12)]
    return U

if modo == "estatico":
    for dump in sys.argv[2:]:
        D = json.load(open(dump)); ei = D["elementInputs"]; ni = D["nodeInputs"]
        base = os.path.splitext(os.path.basename(dump))[0]
        for tipo, nmT in ((2, "thick"), (1, "thin")):
            dest = os.path.join(OUT, "%s_%s.json" % (base, nmT))
            if os.path.exists(dest): continue
            t0 = time.time()
            sm.InitializeNewModel(6); sm.File.NewBlank(); sm.SetPresentUnits(6)
            Ev, nu, t = ei["elasticities"]["0"], ei["poissonsRatios"]["0"], ei["thicknesses"]["0"]
            sm.PropMaterial.SetMaterial("M", 1); sm.PropMaterial.SetMPIsotropic("M", float(Ev), float(nu), 1e-5)
            sm.PropMaterial.SetWeightAndMass("M", 1, 0.0)
            sm.PropArea.SetShell_1("SH", tipo, True, "M", 0.0, float(t), float(t))
            for i, (x, y, z) in enumerate(D["nodes"]): sm.PointObj.AddCartesian(float(x), float(y), float(z), "", "N%d" % i)
            for k, el in enumerate(D["elements"]): sm.AreaObj.AddByPoint(len(el), ["N%d" % j for j in el], "", "SH", "A%d" % k)
            for i, s_ in ni["supports"].items(): sm.PointObj.SetRestraint("N%d" % int(i), [bool(v) for v in s_])
            kmu = {}
            spr = ni.get("springs") or []
            if isinstance(spr, dict):
                for i, kk in spr.items(): kmu[int(i)] = [float(v) for v in kk[:6]]
            else:
                for s_ in spr:
                    n_, d_, k_ = (s_["node"], s_["dof"], s_["k"]) if isinstance(s_, dict) else (s_[0], s_[1], s_[2])
                    kmu.setdefault(int(n_), [0.0] * 6)[int(d_)] += float(k_)
            for i, kk in kmu.items(): sm.PointObj.SetSpring("N%d" % i, kk)
            sm.LoadPatterns.SetSelfWTMultiplier("DEAD", 0.0)
            sz = 0.0
            for i, f in ni["loads"].items():
                if any(abs(v) > 0 for v in f): sm.PointObj.SetLoadForce("N%d" % int(i), "DEAD", [float(v) for v in f]); sz += f[2]
            sm.File.Save(SDB); sm.Analyze.SetRunCaseFlag("MODAL", False); sm.Analyze.RunAnalysis()
            U = todos_desp("DEAD", len(D["nodes"]))
            res = {"dump": base, "tipo": nmT, "u": U, "nodes": D["nodes"], "sumFz": sz,
                   "joints_analisis": int(sm.PointElm.Count()), "areas_analisis": int(sm.AreaElm.Count())}
            json.dump(res, open(dest, "w"))
            wmin = min((u[2] for u in U if u), default=0)
            print("%s %s: %d nudos (anal %d), %d areas (anal %d), wmin %.6e, %.0f s" % (base, nmT, len(D["nodes"]), res["joints_analisis"],
                  len(D["elements"]), res["areas_analisis"], wmin, time.time() - t0), flush=True)
elif modo == "pandeo":
    sys.path.insert(0, r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\hekatan-struct-casos\validation\pandeo_cascara")
    from modelos import placa, muro, losa, variante, E, NU
    MS = ([variante(placa(2 * k, k, t=0.05, qx=1000.0), "k", tipo=2) for k in (2, 4, 8, 16)] +
          [variante(losa(n), "k", tipo=2) for n in (4, 8, 16, 32)] +
          [variante(muro(2 * k, 3 * k), "k", tipo=2) for k in (1, 2, 4, 8)])
    if len(sys.argv) > 3:
        J = json.load(open(sys.argv[2])); MS = J["modelos"]
        for M in MS: M["apoyos"] = {int(k): v for k, v in M["apoyos"].items()}; M["cargas"] = {int(k): v for k, v in M["cargas"].items()}
    dest = os.path.join(OUT, sys.argv[3] if len(sys.argv) > 3 else "pandeo_thick.json")
    out = json.load(open(dest)) if os.path.exists(dest) else {}
    json.dump(dict(E=E, nu=NU, modelos=MS), open(os.path.join(OUT, "pandeo_modelos.json"), "w"))
    for M in MS:
        if M["nombre"] in out: continue
        sm.InitializeNewModel(6); sm.File.NewBlank(); sm.SetPresentUnits(6)
        sm.PropMaterial.SetMaterial("AC", 1); sm.PropMaterial.SetMPIsotropic("AC", E, NU, 1.2e-5)
        sm.PropMaterial.SetWeightAndMass("AC", 1, 0.0)
        sm.PropArea.SetShell_1("SH", 2, True, "AC", 0, M["t"], M["t"])
        for q, p in enumerate(M["nodos"]): sm.PointObj.AddCartesian(p[0], p[1], p[2], "", "N%d" % q)
        for e, c in enumerate(M["panos"]): sm.AreaObj.AddByPoint(len(c), ["N%d" % k for k in c], "", "SH", "A%d" % e)
        for q, s in M["apoyos"].items(): sm.PointObj.SetRestraint("N%d" % q, [bool(x) for x in s])
        sm.LoadPatterns.Add("P", 8, 0, True)
        for q, c in M["cargas"].items(): sm.PointObj.SetLoadForce("N%d" % q, "P", [float(x) for x in c], True)
        sm.LoadCases.Buckling.SetCase("BUCK"); sm.LoadCases.Buckling.SetLoads("BUCK", 1, ["Load"], ["P"], [1.0])
        sm.LoadCases.Buckling.SetParameters("BUCK", 4, 1e-12)
        sm.File.Save(SDB); sm.Analyze.SetRunCaseFlag("MODAL", False); sm.Analyze.RunAnalysis()
        R = sm.Results; R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetCaseSelectedForOutput("BUCK")
        r = R.BucklingFactor(0, [], [], [], [])
        out[M["nombre"] + "_%d" % len(M["panos"])] = dict(factores=list(r[4]), analitico=M["analitico"], n=len(M["panos"]))
        print(M["nombre"], len(M["panos"]), ["%.6f" % x for x in r[4]], "analitico %.4f" % (M["analitico"] or 0), flush=True)
        json.dump(out, open(dest, "w"), indent=1)
o.ApplicationExit(False)
