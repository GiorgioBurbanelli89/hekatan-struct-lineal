# -*- coding: utf-8 -*-
"""El AREA UNITARIA: las funciones de forma de ETABS contra las nuestras.

Con los 4 nudos empotrados y presion q=1, la reaccion ES el vector de cargas
consistente:   f_i = int N_i dA.  Sin constitutiva, sin rigidez, sin inversas:
es la funcion de forma integrada, medida directamente.
"""
import json, os
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
G=1/np.sqrt(3); GP=[(-G,-G),(G,-G),(G,G),(-G,G)]
def Nf(xi,et): return np.array([0.25*(1-xi)*(1-et),0.25*(1+xi)*(1-et),
                                0.25*(1+xi)*(1+et),0.25*(1-xi)*(1+et)])
def dNf(xi,et):
    return (np.array([-0.25*(1-et),0.25*(1-et),0.25*(1+et),-0.25*(1+et)]),
            np.array([-0.25*(1-xi),-0.25*(1+xi),0.25*(1+xi),0.25*(1-xi)]))
def nuestro(pts,q=1.0):
    x=np.array([p[0] for p in pts]); y=np.array([p[1] for p in pts])
    f=np.zeros(4)
    for xi,et in GP:
        dx,de=dNf(xi,et)
        J=np.array([[dx@x,dx@y],[de@x,de@y]])
        f += Nf(xi,et)*q*np.linalg.det(J)
    return f
def area(p):
    a=0.0
    for i in range(len(p)):
        j=(i+1)%len(p); a+=p[i][0]*p[j][1]-p[j][0]*p[i][1]
    return abs(a)/2

p=os.path.join(GAL,"area_unitaria.json")
if not os.path.exists(p):
    raise SystemExit("todavia no hay medida: corre celda_area_unitaria.py")
d=json.load(open(p,encoding="utf-8"))
print("=== 1 · validar la medida sola: sum(f_w) tiene que ser q*A EXACTO ===")
for k,v in d.items():
    f=np.array(v["f"]); A=area(v["pts"])
    print("  %-13s area %.6f   sum|F3| %.8f   dif %.2e"
          % (k, A, abs(f[:,0].sum()), abs(abs(f[:,0].sum())/(v["q"]*A)-1)))

print("\n=== 2 · el REPARTO: que fraccion de q*A va a cada nudo ===")
print("  %-13s %-5s  %s" % ("caso","","nudo1     nudo2     nudo3     nudo4"))
for k,v in d.items():
    f=np.array(v["f"]); A=area(v["pts"]); s=f[:,0].sum()
    fh=nuestro(v["pts"], v["q"])
    print("  %-13s ETABS  %s" % (k, "  ".join("%8.6f"%x for x in f[:,0]/s)))
    print("  %-13s Hekat  %s   ||df||/||f|| = %.3e" %
          ("", "  ".join("%8.6f"%x for x in fh/fh.sum()),
           np.linalg.norm(np.abs(f[:,0])-fh)/np.linalg.norm(fh)))

print("\n=== 3 · los MOMENTOS nodales: el que separa las familias ===")
print("  un Mindlin BILINEAL no reparte ninguno (la presion solo trabaja")
print("  contra w). Un Kirchhoff discreto tipo DKQ SI.")
print("  %-13s %12s %12s   %s" % ("caso","max|M1|","max|M2|","respecto a q*A*L"))
for k,v in d.items():
    f=np.array(v["f"]); A=area(v["pts"])
    L=np.sqrt(A)
    print("  %-13s %12.5e %12.5e   %.4f %% / %.4f %%"
          % (k, np.abs(f[:,1]).max(), np.abs(f[:,2]).max(),
             np.abs(f[:,1]).max()/(v["q"]*A*L)*100,
             np.abs(f[:,2]).max()/(v["q"]*A*L)*100))

print("\n=== 4 · thin contra thick: reparten IGUAL? ===")
for g in ["cuad","rect","paral","trape","irreg","t002"]:
    a,b = d.get("thin_"+g), d.get("thick_"+g)
    if not a or not b: continue
    fa=np.array(a["f"]); fb=np.array(b["f"])
    print("  %-7s  ||f_thin - f_thick|| / ||f_thin|| = %.3e"
          % (g, np.linalg.norm(fa-fb)/np.linalg.norm(fa)))
