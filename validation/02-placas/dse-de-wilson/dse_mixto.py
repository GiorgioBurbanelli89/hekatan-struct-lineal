# -*- coding: utf-8 -*-
r"""DOS FAMILIAS de modos internos.

Lo observado: con f=2/3 (el acoplamiento Delta_psi <-> cortante de Wilson) salen
los 13.686 de ETABS; con f=0 salen su 0.8878 y su ~93. **ETABS tiene los dos a
la vez.** Asi que se prueban 8 internos: cuatro acoplados al cortante (f=2/3) y
cuatro NO acoplados (f=0) — el interno tangencial, que Wilson anula, no tiene
por que acoplarse al cortante NORMAL del lado.
"""
import json, os, sys
import numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
G2=1/np.sqrt(3); GP=[(-G2,-G2),(G2,-G2),(G2,G2),(-G2,G2)]
def N4(r,s): return np.array([(1-r)*(1-s),(1+r)*(1-s),(1+r)*(1+s),(1-r)*(1+s)])/4.0
def dN4(r,s): return (np.array([-(1-s),(1-s),(1+s),-(1+s)])/4.0,
                      np.array([-(1-r),-(1+r),(1+r),(1-r)])/4.0)
def dNh(r,s): return (np.array([-r*(1-s),(1-s*s)/2,-r*(1+s),-(1-s*s)/2]),
                      np.array([-(1-r*r)/2,-s*(1+r),(1-r*r)/2,-s*(1-r)]))
def K(pts,E,nu,t,fa,fb,pt=True):
    x=np.array([p[0] for p in pts],float); y=np.array([p[1] for p in pts],float)
    ca=np.zeros(4); sa=np.zeros(4); LL=np.zeros(4)
    for k in range(4):
        j=(k+1)%4; dx=x[j]-x[k]; dy=y[j]-y[k]; L=np.hypot(dx,dy)
        ca[k]=dx/L; sa[k]=dy/L; LL[k]=L
    D0=E*t**3/(12*(1-nu*nu))
    Db=np.array([[D0,nu*D0,0],[nu*D0,D0,0],[0,0,D0*(1-nu)/2]])
    Ds=np.eye(2)*(5*E*t/(12*(1+nu))); n=20
    Bl=np.zeros((4,n))
    for k in range(4):
        j=(k+1)%4
        Bl[k,3*j]+=1/LL[k]; Bl[k,3*k]-=1/LL[k]
        Bl[k,3*k+1]-=sa[k]/2; Bl[k,3*j+1]-=sa[k]/2
        Bl[k,3*k+2]+=ca[k]/2; Bl[k,3*j+2]+=ca[k]/2
        Bl[k,12+k]-=fa; Bl[k,16+k]-=fb
    Bn=np.zeros((4,2,n))
    for i in range(4):
        a=i; b=(i-1)%4; det=ca[a]*sa[b]-ca[b]*sa[a]
        Bn[i]=(np.array([[sa[b],-ca[b]],[-sa[a],ca[a]]])/det)@np.vstack([Bl[a],Bl[b]])
    def curv(r,s,Ji):
        dx4,ds4=dN4(r,s); dxh,dsh=dNh(r,s)
        gx=Ji[0,0]*dx4+Ji[0,1]*ds4; gy=Ji[1,0]*dx4+Ji[1,1]*ds4
        hx=Ji[0,0]*dxh+Ji[0,1]*dsh; hy=Ji[1,0]*dxh+Ji[1,1]*dsh
        B=np.zeros((3,n))
        for i in range(4):
            B[0,3*i+2]+=gx[i]; B[1,3*i+1]-=gy[i]
            B[2,3*i+2]+=gy[i]; B[2,3*i+1]-=gx[i]
        for k in range(4):
            B[0,12+k]+=(-ca[k])*hx[k]; B[1,12+k]-=(sa[k])*hy[k]
            B[2,12+k]+=(-ca[k])*hy[k]-(sa[k])*hx[k]
            B[0,16+k]+=( sa[k])*hx[k]; B[1,16+k]-=(ca[k])*hy[k]
            B[2,16+k]+=( sa[k])*hy[k]-(ca[k])*hx[k]
        return B
    bm=np.zeros((3,8)); A=0.0
    for r,s in GP:
        dx4,ds4=dN4(r,s); J=np.array([[dx4@x,dx4@y],[ds4@x,ds4@y]])
        dJ=np.linalg.det(J); bm+=curv(r,s,np.linalg.inv(J))[:,12:]*abs(dJ); A+=abs(dJ)
    bm/=A
    KK=np.zeros((n,n))
    for r,s in GP:
        N=N4(r,s); dx4,ds4=dN4(r,s)
        J=np.array([[dx4@x,dx4@y],[ds4@x,ds4@y]]); dJ=np.linalg.det(J)
        B=curv(r,s,np.linalg.inv(J))
        if pt: B[:,12:]-=bm
        KK+=B.T@Db@B*abs(dJ)
        Bs=np.zeros((2,n))
        for i in range(4): Bs+=N[i]*Bn[i]
        KK+=Bs.T@Ds@Bs*abs(dJ)
    K11=KK[:12,:12]; K12=KK[:12,12:]; K22=KK[12:,12:]
    return K11-K12@np.linalg.pinv(K22)@K12.T
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
v=kd["k_thick_nu00"]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
D=E*t**3/(12*(1-nu*nu)); Ke=np.array(v["K"]); Ke=(Ke+Ke.T)/2
we=np.sort(np.linalg.eigvalsh(Ke))[3:]/D
print(" %-22s %s" % ("ETABS"," ".join("%9.4f"%z for z in we)))
for fa,fb in ((2/3,0.0),(2/3,2/3),(0.0,2/3)):
    for pt in (True,False):
        w=np.sort(np.linalg.eigvalsh((K(pts,E,nu,t,fa,fb,pt)+K(pts,E,nu,t,fa,fb,pt).T)/2))[3:]/D
        print(" %-22s %s" % ("fa=%.3f fb=%.3f pt=%s"%(fa,fb,int(pt)),
              " ".join("%9.4f"%z for z in w)))
