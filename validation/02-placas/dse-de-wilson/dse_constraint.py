# -*- coding: utf-8 -*-
r"""La pieza que faltaba, del abstract de Ibrahimbegovic (1993):

  «...based on Reissner-Mindlin plate theory and an ENHANCED DISPLACEMENT
   INTERPOLATION... The CONSTRAINT ON THE CONSTANT SHEAR STRAIN IS ENFORCED
   EXPLICITLY, thus eliminating the shear locking phenomena.»

Condensar ABLANDA (K11 - K12 K22^-1 K12^T resta algo semidefinido positivo), y
por eso ninguna variante del DSE llegaba a los modos altos de ETABS. Pero una
RESTRICCION impuesta con penalizacion SUMA una matriz semidefinida positiva —
que es exactamente lo medido: `K_ETABS - K_DSE` sale semidefinida positiva y de
RANGO 4.

Aqui se penaliza la parte NO CONSTANTE del cortante:

    K += alpha * sum_gp (gamma - gamma_media)^T (gamma - gamma_media) dA
"""
import json, os, sys
import numpy as np
SP=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,SP)
G2=1/np.sqrt(3); GP=[(-G2,-G2),(G2,-G2),(G2,G2),(-G2,G2)]
def N4(r,s): return np.array([(1-r)*(1-s),(1+r)*(1-s),(1+r)*(1+s),(1-r)*(1+s)])/4.0
def dN4(r,s): return (np.array([-(1-s),(1-s),(1+s),-(1+s)])/4.0,
                      np.array([-(1-r),-(1+r),(1+r),(1-r)])/4.0)
def dNh(r,s): return (np.array([-r*(1-s),(1-s*s)/2,-r*(1+s),-(1-s*s)/2]),
                      np.array([-(1-r*r)/2,-s*(1+r),(1-r*r)/2,-s*(1-r)]))
def K_DSEc(pts,E,nu,t,alpha=0.0,f23=2.0/3.0,pt=True,thin=False):
    x=np.array([p[0] for p in pts],float); y=np.array([p[1] for p in pts],float)
    ca=np.zeros(4); sa=np.zeros(4); LL=np.zeros(4)
    for k in range(4):
        j=(k+1)%4; dx=x[j]-x[k]; dy=y[j]-y[k]; L=np.hypot(dx,dy)
        ca[k]=dx/L; sa[k]=dy/L; LL[k]=L
    D0=E*t**3/(12*(1-nu*nu))
    Db=np.array([[D0,nu*D0,0],[nu*D0,D0,0],[0,0,D0*(1-nu)/2]])
    Gs=5*E*t/(12*(1+nu)); Ds=np.eye(2)*Gs; n=16
    Bl=np.zeros((4,n))
    for k in range(4):
        j=(k+1)%4
        Bl[k,3*j]+=1/LL[k]; Bl[k,3*k]-=1/LL[k]
        Bl[k,3*k+1]-=sa[k]/2; Bl[k,3*j+1]-=sa[k]/2
        Bl[k,3*k+2]+=ca[k]/2; Bl[k,3*j+2]+=ca[k]/2
        Bl[k,12+k]-=f23
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
        return B
    bm=np.zeros((3,4)); A=0.0; Bs_m=np.zeros((2,n))
    for r,s in GP:
        N=N4(r,s); dx4,ds4=dN4(r,s)
        J=np.array([[dx4@x,dx4@y],[ds4@x,ds4@y]]); dJ=np.linalg.det(J)
        bm+=curv(r,s,np.linalg.inv(J))[:,12:]*abs(dJ); A+=abs(dJ)
        Bsg=np.zeros((2,n))
        for i in range(4): Bsg+=N[i]*Bn[i]
        Bs_m+=Bsg*abs(dJ)
    bm/=A; Bs_m/=A                      # el cortante MEDIO del elemento
    K=np.zeros((n,n))
    for r,s in GP:
        N=N4(r,s); dx4,ds4=dN4(r,s)
        J=np.array([[dx4@x,dx4@y],[ds4@x,ds4@y]]); dJ=np.linalg.det(J)
        B=curv(r,s,np.linalg.inv(J))
        if pt: B[:,12:]-=bm
        K+=B.T@Db@B*abs(dJ)
        Bsg=np.zeros((2,n))
        for i in range(4): Bsg+=N[i]*Bn[i]
        K+=Bsg.T@Ds@Bsg*abs(dJ)
        if alpha:                        # LA RESTRICCION de cortante constante
            Bd=Bsg-Bs_m
            K+=alpha*Gs*Bd.T@Bd*abs(dJ)
    K11=K[:12,:12]; K12=K[:12,12:]; K22=K[12:,12:]
    return K11-K12@np.linalg.inv(K22)@K12.T
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
v=kd["k_thick_nu00"]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
D=E*t**3/(12*(1-nu*nu)); Ke=np.array(v["K"]); Ke=(Ke+Ke.T)/2
we=np.sort(np.linalg.eigvalsh(Ke))[3:]/D
print(" %-14s %s" % ("ETABS"," ".join("%9.4f"%z for z in we)))
for a in (0,1,3,10,30,100,300,1000,1e4,1e6):
    K=K_DSEc(pts,E,nu,t,a); K=(K+K.T)/2
    w=np.sort(np.linalg.eigvalsh(K))[3:]/D
    d=np.linalg.norm(Ke-K)/np.linalg.norm(Ke)*100
    print(" alpha=%-8g %s   ||dK||=%6.2f%%" % (a," ".join("%9.4f"%z for z in w),d))
