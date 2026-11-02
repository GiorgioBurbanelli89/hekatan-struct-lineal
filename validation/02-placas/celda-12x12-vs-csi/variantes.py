# -*- coding: utf-8 -*-
"""Todas las formulaciones de flexion que tiene el motor, contra la
flexibilidad medida del Shell-Thick de ETABS. Una fila por variante: asi se ve
QUE PIEZA acerca y cual no."""
import json, os, subprocess, sys
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
SP  = sys.argv[1]
os.environ["PATH"] = r"C:\Program Files\GNU Octave\Octave-10.1.0\mingw64\bin" + os.pathsep + os.environ["PATH"]

VAR = [
    ("MITC4 + alfa (el motor)", "kb12b.exe",       0),
    ("MITC4 SIN modos alfa",    "kb12_noalpha.exe",0),
    ("DSE (Wilson cap.8)",      "kb12_dse.exe",    0),
    ("DSE_FULL",                "kb12_dsefull.exe",0),
    ("DKMQ (Katili)",           "kb12b.exe",       3),
    ("DKQ = el Shell-Thin",     "kb12b.exe",       1),
]
def K12(exe,form,E,nu,t,pts):
    a=[os.path.join(SP,exe),str(form),repr(E),repr(nu),repr(t)]+["1.0"]*5
    for (x,y) in pts: a+=[repr(float(x)),repr(float(y))]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode,o.stderr
    return np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])
def F_de(K,lib):
    fi=[3*n+k for (n,k) in lib]; return np.linalg.inv(K[np.ix_(fi,fi)])
def dif(A,B): return np.linalg.norm(A-B)/np.linalg.norm(A)*100

d=json.load(open(os.path.join(GAL,"flex12.json"),encoding="utf-8"))
CASOS=["cuad_nu00","cuad_nu20","cuad_nu45","rect_1x05","rect_1x025","parale","trapecio"]
print("contra el Shell-THICK medido de ETABS 22 (= SAP2000 24), t=0.20")
print(" %-24s %s" % ("variante"," ".join("%-9s"%c[:9] for c in CASOS)))
for nom,exe,form in VAR:
    fila=[]
    for k in CASOS:
        v=d[k]; lib=[tuple(x) for x in v["libres"]]
        try: fila.append("%8.2f%%" % dif(np.array(v["F"]), F_de(K12(exe,form,v["E"],v["nu"],v["t"],v["pts"]),lib)))
        except Exception: fila.append("   ERROR ")
    print(" %-24s %s" % (nom," ".join(fila)))

print("\ny contra el Shell-THIN medido (control: aqui el DKQ tiene que dar 0)")
dt=json.load(open(os.path.join(GAL,"flex12_thin.json"),encoding="utf-8"))
CT=[k for k,v in dt.items() if v["tipo"]==1]
print(" %-24s %s" % ("variante"," ".join("%-9s"%c[:9] for c in CT)))
for nom,exe,form in VAR:
    fila=[]
    for k in CT:
        v=dt[k]; lib=[tuple(x) for x in v["libres"]]
        try: fila.append("%8.2f%%" % dif(np.array(v["F"]), F_de(K12(exe,form,v["E"],v["nu"],v["t"],v["pts"]),lib)))
        except Exception: fila.append("   ERROR ")
    print(" %-24s %s" % (nom," ".join(fila)))
