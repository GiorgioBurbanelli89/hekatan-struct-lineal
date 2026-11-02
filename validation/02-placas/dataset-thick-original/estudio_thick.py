# -*- coding: utf-8 -*-
r"""ESTUDIO de la matriz ORIGINAL del Shell-Thick de ETABS.

No para copiarla: para entender QUE TIENE que la nuestra no tiene. Se disecciona
en cinco cortes, cada uno aislando una cosa:

  1. el ESPECTRO (autovalores/D) — numeros puros, sin convenciones
  2. como escala con el ESPESOR — separa flexion (t^3) de cortante (t)
  3. como escala con nu — la constitutiva
  4. como escala con la GEOMETRIA — el jacobiano
  5. el RESIDUO contra la nuestra — que le sobra y que le falta
"""
import json, os, subprocess, sys
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
KEL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct\cli\native\kelem_native.exe"
os.environ["PATH"] = r"C:\Program Files\GNU Octave\Octave-10.1.0\mingw64\bin" + os.pathsep + os.environ["PATH"]
IDX=[6*n+2+k for n in range(4) for k in range(3)]
def hek(pts,E,nu,t,tp):
    a=[KEL]
    for (x,y) in pts: a+=[repr(float(x)),repr(float(y)),"0"]
    a+=[repr(E),repr(nu),repr(t),"8","0.4",str(tp)]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode,o.stderr
    K=np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])
    return K[np.ix_(IDX,IDX)]
d=json.load(open(os.path.join(GAL,"dataset_thick.json"),encoding="utf-8"))
def esp(K,D): return np.sort(np.linalg.eigvalsh((K+K.T)/2))[3:]/D
print("="*80); print(" 1 · EL ESPECTRO (autovalor/D) — la huella del elemento"); print("="*80)
print(" %-16s %-5s %s" % ("caso","tipo"," ".join("%9s"%("m%d"%i) for i in range(4,13))))
for k,v in d.items():
    D=v["E"]*v["t"]**3/(12*(1-v["nu"]**2))
    w=esp(np.array(v["K"]),D)
    print(" %-16s %-5s %s" % (k,"thin" if v["tipo"]==1 else "thick",
          " ".join("%9.4f"%z for z in w)))
print()
print("="*80); print(" 2 · ESPESOR (cuadrado nu=0): que escala como t^3 y que como t"); print("="*80)
ts=[]
for k,v in sorted(d.items()):
    if not k.startswith("t_") and k!="g_cuad_thick": continue
    if v["tipo"]!=2: continue
    D=v["E"]*v["t"]**3/(12*(1-v["nu"]**2)); ts.append((v["t"],esp(np.array(v["K"]),D)))
if "g_cuad_thick" in d:
    v=d["g_cuad_thick"]; D=v["E"]*v["t"]**3/12; ts.append((v["t"],esp(np.array(v["K"]),D)))
for t,w in sorted(set((a,tuple(b)) for a,b in ts)):
    print("  t=%.2f  %s" % (t," ".join("%9.4f"%z for z in w)))
print("  -> el que NO cambia va con D (flexion); el que crece al adelgazar, con el cortante")
print()
print("="*80); print(" 5 · CONTRA LA NUESTRA — que le sobra y que le falta"); print("="*80)
for k,v in d.items():
    if v["tipo"]!=2: continue
    pts,E,nu,t=v["pts"],v["E"],v["nu"],v["t"]
    D=E*t**3/(12*(1-nu*nu))
    Ke=np.array(v["K"]); Ke=(Ke+Ke.T)/2
    Kh=hek(pts,E,nu,t,0); Kh=(Kh+Kh.T)/2
    R=Ke-Kh; w=np.linalg.eigvalsh(R); tol=abs(w).max()*1e-9
    pos=int(np.sum(w>tol)); neg=int(np.sum(w<-tol))
    we=esp(Ke,D); wh=esp(Kh,D); us=set(); ok=0
    for a in we:
        c=[(abs(b/a-1),j) for j,b in enumerate(wh) if j not in us]
        if c:
            dd,j=min(c); us.add(j); ok+= dd*100<=1
    print("  %-16s ||dK||=%7.2f%%  residuo: %d+ %d-  (%s)  modos<1%%: %d/9"
          % (k, np.linalg.norm(R)/np.linalg.norm(Ke)*100, pos, neg,
             "SUMABLE" if neg==0 or abs(w.min())/abs(w).max()<1e-3 else "no sumable", ok))
