import json, sys
M="validation/modelos/vs_muros/mini"
def carga_e2k(f):
    E=json.load(open(f)); pts={p["n"]:(round(p["x"],4),round(p["y"],4),round(p["z"],4)) for p in E["puntos"]}
    return {pts[n]:u for n,u in E["disp_nudos"].items() if n in pts}
def carga_oapi(f):
    O=json.load(open(f)); return {(round(q["x"],4),round(q["y"],4),round(q["z"],4)):q["u"] for q in O["nudos"]}
def compara(a,b,tit):
    umax=max(abs(v) for u in b.values() for v in u[:3]); n=dentro=0; peor=[]
    for c,u in b.items():
        v=a.get(c)
        if v is None: continue
        for k in range(3):
            d=abs(u[k]-v[k])/umax*100; n+=1; dentro+=d<=0.01; peor.append((d,c,"xyz"[k],v[k],u[k]))
    peor.sort(reverse=True)
    print("%s: %d/%d dentro del 0.01 %% · peor %.3f %% en %s %s (e2k %.4e, oapi %.4e)"%(tit,dentro,n,peor[0][0],peor[0][1],peor[0][2],peor[0][3],peor[0][4]))
    return peor
compara(carga_e2k(f"{M}/etabs/m4_sinDiaf.json"), carga_oapi(f"{M}/oapi_etabs_slab.json"), "e2k D1 solo en POINTS vs OAPI diafragma de ejes")
compara(carga_e2k(f"{M}/etabs/m0_base.json"), carga_oapi(f"{M}/oapi_etabs_d2.json"), "e2k D1 en AREAS+POINTS vs OAPI diafragma toda la planta")
p=compara(carga_e2k(f"{M}/etabs/m0_base.json"), carga_oapi(f"{M}/oapi_etabs_slab.json"), "e2k D1 en AREAS+POINTS vs OAPI diafragma de ejes")
