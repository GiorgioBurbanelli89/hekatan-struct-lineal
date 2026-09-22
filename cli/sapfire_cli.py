# -*- coding: utf-8 -*-
"""sapfire_cli — llama al SOLVER SAPFire real (ETABS OAPI), computa y devuelve resultados JSON.

Es el oraculo de validacion para Hekatan Struct: misma geometria -> compara desplazamientos.
Benchmark por defecto: voladizo horizontal con carga puntual en la punta (solucion exacta PL^3/3EI).

Uso:
  python sapfire_cli.py                       # voladizo default, imprime JSON
  python sapfire_cli.py --L 4 --P 10 --E 2.1e8 --b 0.3 --h 0.5
  python sapfire_cli.py --json out.json
"""
import sys, json, argparse, time, os, tempfile
import comtypes.client

ETABS_EXE = r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--L", type=float, default=4.0, help="luz [m]")
    ap.add_argument("--P", type=float, default=10.0, help="carga punta [kN] (hacia -Z)")
    ap.add_argument("--E", type=float, default=2.1e8, help="modulo E [kN/m2]")
    ap.add_argument("--b", type=float, default=0.30, help="ancho seccion [m]")
    ap.add_argument("--h", type=float, default=0.50, help="alto seccion [m]")
    ap.add_argument("--json", default=None)
    a = ap.parse_args()

    t0 = time.time()
    helper = comtypes.client.CreateObject("ETABSv1.Helper")
    helper = helper.QueryInterface(comtypes.gen.ETABSv1.cHelper)
    etabs = helper.CreateObject(ETABS_EXE)
    etabs.ApplicationStart()
    sm = etabs.SapModel
    sm.InitializeNewModel(6)            # 6 = kN_m_C
    sm.File.NewBlank()

    # material elastico
    sm.PropMaterial.SetMaterial("MAT", 1)        # 1 = Steel-ish generic
    sm.PropMaterial.SetMPIsotropic("MAT", a.E, 0.3, 1e-5)
    sm.PropMaterial.SetWeightAndMass("MAT", 1, 78.5)  # peso propio acero (prueba gravedad)
    # seccion rectangular
    sm.PropFrame.SetRectangle("SEC", "MAT", a.h, a.b)

    # puntos explicitos (nombres controlados) + frame por puntos
    rp1 = sm.PointObj.AddCartesian(0.0, 0.0, 0.0, "", "P1", "Global")
    rp2 = sm.PointObj.AddCartesian(a.L, 0.0, 0.0, "", "P2", "Global")
    p1 = rp1[0]; p2 = rp2[0]
    rf = sm.FrameObj.AddByPoint(p1, p2, "", "SEC", "B1")
    dbg = {"rp1": list(rp1), "rp2": list(rp2), "rf": list(rf), "p1": p1, "p2": p2}
    rr = sm.PointObj.SetRestraint(p1, [True]*6)       # empotrado
    dbg["restraint_ret"] = rr

    # patron de carga + carga puntual en la punta (-Z)
    sm.LoadPatterns.Add("PUNTA", 8, 0, True)     # 8 = Other, sin auto-peso
    lr = sm.PointObj.SetLoadForce(p2, "PUNTA", [0,0,-a.P,0,0,0])
    dbg["load_ret"] = lr
    # load CASE estatico lineal que aplica el patron PUNTA (sin esto, U=0)
    sm.LoadCases.StaticLinear.SetCase("PUNTA")
    cl = sm.LoadCases.StaticLinear.SetLoads("PUNTA", 1, ["Load"], ["PUNTA"], [1.0])
    dbg["case_loads_ret"] = cl
    dbg["points"] = list(sm.PointObj.GetNameList()[1])
    dbg["frames"] = list(sm.FrameObj.GetNameList()[1])
    try: dbg["B1_points"] = list(sm.FrameObj.GetPoints("B1"))
    except Exception as e: dbg["B1_points"] = str(e)
    try: dbg["B1_section"] = list(sm.FrameObj.GetSection("B1"))
    except Exception as e: dbg["B1_section"] = str(e)
    # reaplicar carga con args explicitos (Replace=True, CSys Global)
    lr2 = sm.PointObj.SetLoadForce(p2, "PUNTA", [0,0,-a.P,0,0,0], True, "Global", 0)
    dbg["load_ret2"] = lr2
    import sys as _s; print("DBG:", json.dumps(dbg, default=str), file=_s.stderr)

    # GUARDAR antes de correr (obligatorio en OAPI) + correr (SAPFire)
    edb = os.path.join(tempfile.gettempdir(), "sapfire_cli_voladizo.EDB")
    sm.File.Save(edb)
    sm.Analyze.SetRunCaseFlag("", True, True)
    t_solve = time.time()
    runret = sm.Analyze.RunAnalysis()
    solve_dt = time.time() - t_solve

    # leer desplazamiento de la punta
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
    sm.Results.Setup.SetCaseSelectedForOutput("PUNTA")
    res = sm.Results.JointDispl(p2, 0)   # ObjectElm
    import sys as _s
    print("DBG res JointDispl P2:", json.dumps(list(res), default=str), file=_s.stderr)
    try:
        rea = sm.Results.JointReact(p1, 0)
        print("DBG react P1:", json.dumps(list(rea), default=str), file=_s.stderr)
    except Exception as e:
        print("DBG react err", e, file=_s.stderr)
    try:
        cnt = sm.Results.Setup  # noqa
        st = sm.Analyze.GetCaseStatus()
        print("DBG case status:", json.dumps(list(st), default=str), file=_s.stderr)
    except Exception as e:
        print("DBG status err", e, file=_s.stderr)
    # res: (NumberResults, Obj, Elm, LoadCase, StepType, StepNum, U1,U2,U3,R1,R2,R3, ret)
    n = res[0]
    U3 = res[8][0] if n else None     # desplazamiento Z [m]
    R2 = res[11][0] if n else None    # giro Ry

    # teoria
    I = a.b * a.h**3 / 12.0
    delta_teor = a.P * a.L**3 / (3.0 * a.E * I)

    out = {
        "engine": "SAPFire (ETABS 22 OAPI)",
        "model": {"L": a.L, "P": a.P, "E": a.E, "b": a.b, "h": a.h, "I": I},
        "tip_U3_m": U3,
        "tip_R2_rad": R2,
        "teoria_PL3_3EI_m": -delta_teor,
        "error_pct": (abs(U3 + delta_teor) / delta_teor * 100.0) if U3 is not None else None,
        "solve_s": round(solve_dt, 3),
        "total_s": round(time.time() - t0, 3),
    }
    print(json.dumps(out, indent=2, ensure_ascii=False))
    if a.json:
        open(a.json, "w").write(json.dumps(out, indent=2, ensure_ascii=False))
    etabs.ApplicationExit(False)

if __name__ == "__main__":
    main()
