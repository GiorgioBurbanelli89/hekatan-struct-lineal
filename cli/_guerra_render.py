import json, os, sys
import numpy as np
from PIL import Image
OUT = "cli/shots/guerra"
def jet(t):
    t=max(0.0,min(1.0,t)); 
    r=np.clip(1.5-abs(4*t-3),0,1); g=np.clip(1.5-abs(4*t-2),0,1); b=np.clip(1.5-abs(4*t-1),0,1)
    return (int(255*r),int(255*g),int(255*b))
def render(idj):
    d=json.load(open(os.path.join(OUT,idj+".json"),encoding="utf-8"))
    N=np.array(d["nodes"]); S=np.array(d["sigma"]); ref=d["ref"]
    xs=sorted(set(round(x,4) for x,_ in N)); ys=sorted(set(round(y,4) for _,y in N))
    nx,ny=len(xs),len(ys); xi={v:i for i,v in enumerate(xs)}; yi={v:i for i,v in enumerate(ys)}
    G=np.full((ny,nx),np.nan)
    for (x,y),s in zip(N,S): G[yi[round(y,4)],xi[round(x,4)]]=s
    smax=np.nanmax(G); smin=np.nanmin(G)
    W=560; sc=max(1,W//nx); H=ny*sc; im=Image.new("RGB",(nx*sc,ny*sc),(20,20,20)); px=im.load()
    for j in range(ny):
        for i in range(nx):
            v=G[ny-1-j,i]
            if np.isnan(v): continue
            c=jet((v-smin)/(smax-smin+1e-9))
            for a in range(sc):
                for b in range(sc): px[i*sc+a,j*sc+b]=c
    im.save(os.path.join(OUT,idj+"_map.png"))
    # perfil por la franja central (y medio)
    jc=ny//2; prof=G[jc,:]
    return dict(id=idj, smax=round(float(smax),2), smin=round(float(smin),2),
               safe=ref.get("sigma_safe",{}).get("max"), manual=ref.get("sigma_manual",{}).get("max"),
               perfil_centro=[round(float(v),1) for v in prof], x=xs)
res=[render(i) for i in sys.argv[1:]]
for r in res:
    print(f"\n{r['id']}:  Hek s {r['smin']}..{r['smax']}  | SAFE-libro {r['safe']}  manual {r['manual']}")
    print("  perfil σ centro:", r['perfil_centro'])
