# -*- coding: utf-8 -*-
r"""Valida el canal de medida de B: compara la D.B que reporta ETABS en los 4
nudos contra la de nuestro DKE (thin), que ya cierra a 1e-15 contra su K.

Si coincide, el canal sirve y lo que diga del THICK vale.
"""
import json, os, numpy as np
import dse_wilson as W

GAL=os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
d=json.load(open(os.path.join(GAL,"b_directa.json"),encoding="utf-8"))

def B_nuestro(pts,E,nu,t,rs,thin):
    """La B de curvatura 3x12 en el punto natural rs, con la misma tuberia que K_DSE."""
    x=np.array([p[0] for p in pts],float); y=np.array([p[1] for p in pts],float)
    ca=np.zeros(4); sa=np.zeros(4); LL=np.zeros(4)
    for k in range(4):
        j=(k+1)%4; dx=x[j]-x[k]; dy=y[j]-y[k]; L=np.hypot(dx,dy)
        ca[k]=dx/L; sa[k]=dy/L; LL[k]=L
    G2=1/np.sqrt(3); GP=[(-G2,-G2),(G2,-G2),(G2,G2),(-G2,G2)]
    # media para (8.17)
    b12m=np.zeros((3,4)); A=0.0
    for r,s in GP:
        dx4,ds4=W.dN4(r,s); dxh,dsh=W.dNh(r,s)
        J=np.array([[dx4@x,dx4@y],[ds4@x,ds4@y]]); dJ=np.linalg.det(J); Ji=np.linalg.inv(J)
        hx=Ji[0,0]*dxh+Ji[0,1]*dsh; hy=Ji[1,0]*dxh+Ji[1,1]*dsh
        b=np.zeros((3,4))
        for k in range(4):
            b[0,k]=(-ca[k])*hx[k]; b[1,k]=-(sa[k])*hy[k]
            b[2,k]=(-ca[k])*hy[k]-(sa[k])*hx[k]
        b12m+=b*abs(dJ); A+=abs(dJ)
    b12m/=A
    r,s=rs
    dx4,ds4=W.dN4(r,s); dxh,dsh=W.dNh(r,s)
    J=np.array([[dx4@x,dx4@y],[ds4@x,ds4@y]]); Ji=np.linalg.inv(J)
    gx=Ji[0,0]*dx4+Ji[0,1]*ds4; gy=Ji[1,0]*dx4+Ji[1,1]*ds4
    hx=Ji[0,0]*dxh+Ji[0,1]*dsh; hy=Ji[1,0]*dxh+Ji[1,1]*dsh
    B=np.zeros((3,16))
    for i in range(4):
        B[0,3*i+2]+=gx[i]; B[1,3*i+1]-=gy[i]
        B[2,3*i+2]+=gy[i]; B[2,3*i+1]-=gx[i]
    for k in range(4):
        B[0,12+k]+=(-ca[k])*hx[k]; B[1,12+k]-=(sa[k])*hy[k]
        B[2,12+k]+=(-ca[k])*hy[k]-(sa[k])*hx[k]
    B[:,12:]-=b12m
    if thin:
        T=np.zeros((16,12)); T[:12,:12]=np.eye(12)
        for k in range(4):
            j=(k+1)%4
            T[12+k,3*j+0]+=1.5/LL[k]; T[12+k,3*k+0]-=1.5/LL[k]
            T[12+k,3*k+1]-=0.75*sa[k]; T[12+k,3*j+1]-=0.75*sa[k]
            T[12+k,3*k+2]+=0.75*ca[k]; T[12+k,3*j+2]+=0.75*ca[k]
        return B@T
    return None

NAT=[(-1,-1),(1,-1),(1,1),(-1,1)]     # los 4 nudos en coordenadas naturales
for caso in ("b_thin_cuad",):
    v=d[caso]; pts=[tuple(p) for p in v["pts"]]; E=v["E"]; nu=v["nu"]; t=v["t"]
    D0=E*t**3/(12*(1-nu*nu))
    Db=np.array([[D0,nu*D0,0],[nu*D0,D0,0],[0,0,D0*(1-nu)/2]])
    M=np.array([v["DB"]["M11"],v["DB"]["M22"],v["DB"]["M12"]])   # (3, npts, 12)
    print("== %s ==  D0=%.5f" % (caso,D0))
    for q in range(M.shape[1]):
        Bn=B_nuestro(pts,E,nu,t,NAT[q],thin=True)
        med=M[:,q,:]                      # 3x12 medido
        nue=Db@Bn                         # 3x12 nuestro
        # buscar el factor de escala/signo global que mejor los alinea
        num=float(np.sum(med*nue)); den=float(np.sum(nue*nue))
        f=num/den if den else 0.0
        err=np.linalg.norm(med-f*nue)/max(np.linalg.norm(med),1e-30)
        print("  punto %d  factor=%+9.5f   error relativo tras escalar = %.3e" % (q,f,err))
    print("  (si el factor sale +-1 y el error ~1e-12, el canal es directo)")
    print("\n  fila M11 medida, punto 0:", " ".join("%9.3g"%z for z in M[0,0,:]))
    Bn=B_nuestro(pts,E,nu,t,NAT[0],thin=True)
    print("  fila M11 nuestra,punto 0:", " ".join("%9.3g"%z for z in (Db@Bn)[0,:]))
