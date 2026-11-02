# -*- coding: utf-8 -*-
r"""«assumed shear strains + INCOMPATIBLE BENDING MODES» (descripcion publicada
del elemento de Ibrahimbegovic 1993). Se combinan las dos familias de modos
incompatibles de flexion que hay —las burbujas alfa (1-xi^2, 1-eta^2) y los
Delta_psi de LADO de Wilson— con el cortante MITC4, y con/sin la restriccion de
cortante constante."""
import json, os, sys
import numpy as np
SP=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,SP)
G2=1/np.sqrt(3); GP=[(-G2,-G2),(G2,-G2),(G2,G2),(-G2,G2)]
def N4(r,s): return np.array([(1-r)*(1-s),(1+r)*(1-s),(1+r)*(1+s),(1-r)*(1+s)])/4.0
def dN4(r,s): return (np.array([-(1-s),(1-s),(1+s),-(1+s)])/4.0,
                      np.array([-(1-r),-(1+r),(1+r),(1-r)])/4.0)
def dNh(r,s): return (np.array([-r*(1-s),(1-s*s)/2,-r*(1+s),-(1-s*s)/2]),
                      np.array([-(1-r*r)/2,-s*(1+r),(1-r*r)/2,-s*(1-r)]))
def K(pts,E,nu,t,modo="lado",pt=True,alpha=0.0):
    x=np.array([p[0] for p in pts],float); y=np.array([p[1] for p in pts],float)
    ca=np.zeros(4); sa=np.zeros(4)
    for k in range(4):
        j=(k+1)%4; dx=x[j]-x[k]; dy=y[j]-y[k]; L=np.hypot(dx,dy)
        ca[k]=dx/L; sa[k]=dy/L
    D0=E*t**3/(12*(1-nu*nu))
    Db=np.array([[D0,nu*D0,0],[nu*D0,D0,0],[0,0,D0*(1-nu)/2]])
    Gs=5*E*t/(12*(1+nu)); n=16
    dx0,ds0=dN4(0,0); J0=np.array([[dx0@x,dx0@y],[ds0@x,ds0@y]])
    dJ0=np.linalg.det(J0); Ji0=np.linalg.inv(J0)
    # MITC4 covariante para el cortante (sobre los 12 nodales)
    Bt=[]
    for xp,ep in ((0,-1),(0,1),(-1,0),(1,0)):
        N=N4(xp,ep); d1,d2=dN4(xp,ep)
        J=np.array([[d1@x,d1@y],[d2@x,d2@y]]); Ji=np.linalg.inv(J)
        ddx=Ji[0,0]*d1+Ji[0,1]*d2; ddy=Ji[1,0]*d1+Ji[1,1]*d2
        B=np.zeros((2,n))
        for i in range(4):
            B[0,3*i]=ddx[i]; B[0,3*i+2]=N[i]
            B[1,3*i]=ddy[i]; B[1,3*i+1]=-N[i]
        Bt.append(J@B)
    def curv(r,s,Ji,dJ):
        d1,d2=dN4(r,s); h1,h2=dNh(r,s)
        gx=Ji[0,0]*d1+Ji[0,1]*d2; gy=Ji[1,0]*d1+Ji[1,1]*d2
        B=np.zeros((3,n))
        for i in range(4):
            B[0,3*i+2]-=gx[i]; B[1,3*i+1]+=gy[i]
            B[2,3*i+1]+=gx[i]; B[2,3*i+2]-=gy[i]
        if modo=="lado":
            hx=Ji[0,0]*h1+Ji[0,1]*h2; hy=Ji[1,0]*h1+Ji[1,1]*h2
            for k in range(4):
                B[0,12+k]-=(-ca[k])*hx[k]; B[1,12+k]+=(sa[k])*hy[k]
                B[2,12+k]+=(sa[k])*hx[k]-(-ca[k])*hy[k]
        else:                                    # burbujas alfa, Taylor
            d5x=Ji0[0,0]*(-2*r); d5y=Ji0[1,0]*(-2*r)
            d6x=Ji0[0,1]*(-2*s); d6y=Ji0[1,1]*(-2*s)
            f=dJ0/dJ
            B[0,14]=-d5x*f; B[0,15]=-d6x*f
            B[1,12]= d5y*f; B[1,13]= d6y*f
            B[2,12]= d5x*f; B[2,13]= d6x*f; B[2,14]=-d5y*f; B[2,15]=-d6y*f
        return B
    bm=np.zeros((3,4)); A=0.0; Bm=np.zeros((2,n))
    for r,s in GP:
        d1,d2=dN4(r,s); J=np.array([[d1@x,d1@y],[d2@x,d2@y]]); dJ=np.linalg.det(J)
        bm+=curv(r,s,np.linalg.inv(J),dJ)[:,12:]*abs(dJ); A+=abs(dJ)
        Bc=np.zeros((2,n))
        Bc[0]=0.5*(1-s)*Bt[0][0]+0.5*(1+s)*Bt[1][0]
        Bc[1]=0.5*(1-r)*Bt[2][1]+0.5*(1+r)*Bt[3][1]
        Bm+=(np.linalg.inv(J)@Bc)*abs(dJ)
    bm/=A; Bm/=A
    KK=np.zeros((n,n))
    for r,s in GP:
        d1,d2=dN4(r,s); J=np.array([[d1@x,d1@y],[d2@x,d2@y]]); dJ=np.linalg.det(J)
        Ji=np.linalg.inv(J)
        B=curv(r,s,Ji,dJ)
        if pt: B[:,12:]-=bm
        KK+=B.T@Db@B*abs(dJ)
        Bc=np.zeros((2,n))
        Bc[0]=0.5*(1-s)*Bt[0][0]+0.5*(1+s)*Bt[1][0]
        Bc[1]=0.5*(1-r)*Bt[2][1]+0.5*(1+r)*Bt[3][1]
        Bs=Ji@Bc
        KK+=Gs*Bs.T@Bs*abs(dJ)
        if alpha:
            Bd=Bs-Bm; KK+=alpha*Gs*Bd.T@Bd*abs(dJ)
    K11=KK[:12,:12]; K12=KK[:12,12:]; K22=KK[12:,12:]
    if abs(np.linalg.det(K22))<1e-25: return K11
    return K11-K12@np.linalg.inv(K22)@K12.T
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
v=kd["k_thick_nu00"]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
D=E*t**3/(12*(1-nu*nu)); Ke=np.array(v["K"]); Ke=(Ke+Ke.T)/2
we=np.sort(np.linalg.eigvalsh(Ke))[3:]/D
print(" %-26s %s" % ("ETABS"," ".join("%9.4f"%z for z in we)))
import numpy as np
print("
 barrido fino de la restriccion (modo=lado, pt=1):")
mejor=(1e9,None)
for al in np.concatenate([np.linspace(0,1,11),np.linspace(1.2,6,25)]):
    M=K(pts,E,nu,t,"lado",True,al); M=(M+M.T)/2
    w=np.sort(np.linalg.eigvalsh(M))[3:]/D
    d=np.linalg.norm(Ke-M)/np.linalg.norm(Ke)*100
    # cuantos modos de ETABS tienen pareja por VALOR bajo el 1%
    usados=set(); ok=0
    for a in we:
        c=[(abs(b/a-1),j) for j,b in enumerate(w) if j not in usados]
        if c:
            dif,j=min(c); usados.add(j); ok+= dif*100<=1
    if d<mejor[0]: mejor=(d,al,ok)
    if al in (0.0,0.5,1.0,2.0,3.0,4.0,5.0) or abs(al-3.4)<0.11:
        print("  a=%5.2f  %s  ||dK||=%6.2f%%  modos<1%%: %d/9"
              % (al," ".join("%8.3f"%z for z in w), d, ok))
print("
  mejor ||dK||: %.2f %% con alpha=%.3f  (%d/9 modos)"
      % (mejor[0],mejor[1],mejor[2]))
