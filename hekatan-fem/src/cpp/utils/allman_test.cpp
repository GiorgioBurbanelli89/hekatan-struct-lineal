// =============================================================================
// allman_test.cpp — test STANDALONE (g++ nativo) de la membrana Allman/ITW
// antes de tocar el WASM. Verifica que la B reproduce la firma del binario de
// SAPFire: 0.6572, 0.1761, 0.2887 (=1/(2√3) = drilling en la fila γxy).
//
// Port de itw_membrane.py (que ya valida contra el binario).
//
// Compilar:  g++ -O2 -std=c++17 -I ../eigen allman_test.cpp -o /tmp/allman_test
// Correr:    /tmp/allman_test
// =============================================================================
#include <Eigen/Dense>
#include <cstdio>
#include <cmath>
#include <set>
#include <vector>

using Eigen::MatrixXd;
using Eigen::RowVectorXd;

// bilinear Q4
static void shapeN(double xi, double et, double N[4], double dNr[2][4]) {
    N[0]=0.25*(1-xi)*(1-et); N[1]=0.25*(1+xi)*(1-et);
    N[2]=0.25*(1+xi)*(1+et); N[3]=0.25*(1-xi)*(1+et);
    dNr[0][0]=-0.25*(1-et); dNr[0][1]= 0.25*(1-et); dNr[0][2]= 0.25*(1+et); dNr[0][3]=-0.25*(1+et);
    dNr[1][0]=-0.25*(1-xi); dNr[1][1]=-0.25*(1+xi); dNr[1][2]= 0.25*(1+xi); dNr[1][3]= 0.25*(1-xi);
}
// mid-side serendipity (Allman edge bubbles) N5..N8 y derivadas naturales
static void edgeM(double xi, double et, double M[4], double dMr[2][4]) {
    M[0]=0.5*(1-xi*xi)*(1-et); M[1]=0.5*(1+xi)*(1-et*et);
    M[2]=0.5*(1-xi*xi)*(1+et); M[3]=0.5*(1-xi)*(1-et*et);
    dMr[0][0]=0.5*(-2*xi*(1-et)); dMr[0][1]=0.5*(1-et*et);     dMr[0][2]=0.5*(-2*xi*(1+et)); dMr[0][3]=0.5*(-(1-et*et));
    dMr[1][0]=0.5*(-(1-xi*xi));   dMr[1][1]=0.5*(-2*et*(1+xi)); dMr[1][2]=0.5*(1-xi*xi);      dMr[1][3]=0.5*(-2*et*(1-xi));
}

// B (3x12) [ux,uy,θz]x4 + bOmega (1x12) Allman; XY = coords locales 2D
static void B_and_rot(const double X[4], const double Y[4], double xi, double et,
                      MatrixXd &B, RowVectorXd &bOm, RowVectorXd &bom, double &detJ) {
    double N[4], dNr[2][4]; shapeN(xi, et, N, dNr);
    double M[4], dMr[2][4]; edgeM(xi, et, M, dMr);
    // Jacobiano J = dNr * XY  (2x2)
    double J00=0,J01=0,J10=0,J11=0;
    for (int i=0;i<4;i++){ J00+=dNr[0][i]*X[i]; J01+=dNr[0][i]*Y[i]; J10+=dNr[1][i]*X[i]; J11+=dNr[1][i]*Y[i]; }
    detJ = J00*J11 - J01*J10;
    double inv=1.0/detJ;
    double Ji[2][2] = {{ J11*inv, -J01*inv}, {-J10*inv, J00*inv}};
    // dN/dx, dN/dy (2x4) y dM/dx,dM/dy (2x4)
    double dN[2][4], dM[2][4];
    for (int i=0;i<4;i++){
        dN[0][i]=Ji[0][0]*dNr[0][i]+Ji[0][1]*dNr[1][i];
        dN[1][i]=Ji[1][0]*dNr[0][i]+Ji[1][1]*dNr[1][i];
        dM[0][i]=Ji[0][0]*dMr[0][i]+Ji[0][1]*dMr[1][i];
        dM[1][i]=Ji[1][0]*dMr[0][i]+Ji[1][1]*dMr[1][i];
    }
    // gradientes dux, duy respecto a 12 GDL (2x12)
    MatrixXd dux = MatrixXd::Zero(2,12), duy = MatrixXd::Zero(2,12);
    for (int i=0;i<4;i++){
        dux(0,3*i)=dN[0][i]; dux(1,3*i)=dN[1][i];
        duy(0,3*i+1)=dN[0][i]; duy(1,3*i+1)=dN[1][i];
    }
    // realce Allman de borde
    int EI[4]={0,1,2,3}, EJ[4]={1,2,3,0};
    for (int e=0;e<4;e++){
        int I=EI[e], Jn=EJ[e];
        double ax=(Y[I]-Y[Jn])/8.0;   // (y_I - y_J)/8
        double ay=(X[Jn]-X[I])/8.0;   // (x_J - x_I)/8
        // u += M_e * a * (θ_I - θ_J)
        for (int k=0;k<2;k++){
            int nd = (k==0)?I:Jn; double s=(k==0)?+1.0:-1.0; int c=3*nd+2;
            dux(0,c)+=dM[0][e]*ax*s; dux(1,c)+=dM[1][e]*ax*s;
            duy(0,c)+=dM[0][e]*ay*s; duy(1,c)+=dM[1][e]*ay*s;
        }
    }
    B = MatrixXd::Zero(3,12);
    B.row(0)=dux.row(0);            // εxx = dux/dx
    B.row(1)=duy.row(1);            // εyy = duy/dy
    B.row(2)=dux.row(1)+duy.row(0); // γxy = dux/dy + duy/dx
    bOm = 0.5*(duy.row(0)-dux.row(1));  // Ω = 1/2(∂uy/∂x - ∂ux/∂y)
    bom = RowVectorXd::Zero(12);
    for (int i=0;i<4;i++) bom(3*i+2)=N[i];
}

int main(){
    // elemento de prueba (igual a itw_membrane.py main): cuadrado 1.2x1.2
    double X[4]={0,1.2,1.2,0}, Y[4]={0,0,1.2,1.2};
    double E=2534564.0, nu=0.2, t=0.10;
    double G=E/(2*(1+nu));
    Eigen::Matrix3d D;
    double c=E/(1-nu*nu)*t;
    D << c, c*nu, 0,  c*nu, c, 0,  0, 0, c*(1-nu)/2.0; // plane stress * t

    const double GP=1.0/std::sqrt(3.0);
    double gp[4][2]={{-GP,-GP},{GP,-GP},{GP,GP},{-GP,GP}};

    std::set<double> vals;
    MatrixXd K=MatrixXd::Zero(12,12);
    for (int g=0; g<4; g++){
        MatrixXd B; RowVectorXd bOm,bom; double detJ;
        B_and_rot(X,Y,gp[g][0],gp[g][1],B,bOm,bom,detJ);
        K += B.transpose()*D*B*detJ;
        // recolectar |valores| de la fila de cortante γxy (row 2) — ahi vive el drilling
        for (int j=0;j<12;j++){ double v=std::abs(B(2,j)); if(v>0.01) vals.insert(std::round(v*1e4)/1e4); }
    }
    printf("=== firma de la B de Allman (fila gamma_xy, |valores|>0.01) ===\n  ");
    for (double v: vals) printf("%.4f ", v);
    printf("\n");
    double target=1.0/(2*std::sqrt(3.0));
    bool found=false; for(double v:vals) if(std::abs(v-target)<1e-3) found=true;
    printf("1/(2*sqrt3)=%.4f  -> presente en B? %s\n", target, found?"SI ✓":"NO ✗");
    printf("0.6572 presente? %s   0.1761 presente? %s\n",
           vals.count(0.6572)?"SI":"(buscar cerca)", vals.count(0.1761)?"SI":"(buscar cerca)");

    // penalidad Hughes-Brezzi para estabilizar el modo espurio (gamma = scale*G*t)
    double scale=0.49;  // valor EXTRAIDO de SAPFire
    MatrixXd B0; RowVectorXd bOm0,bom0; double dJ0;
    B_and_rot(X,Y,0.0,0.0,B0,bOm0,bom0,dJ0);
    double area=0; for(int g=0;g<4;g++){MatrixXd Bx;RowVectorXd a,b;double dj;B_and_rot(X,Y,gp[g][0],gp[g][1],Bx,a,b,dj);area+=dj;}
    RowVectorXd d=bOm0-bom0;
    K += scale*G*t*area*(d.transpose()*d);
    printf("\nK[θz0,θz0] (drilling, GDL 2) = %.4f\n", K(2,2));
    printf("(itw_membrane.py daba K[2,2]=20065.298 con scale=1.0)\n");

    // ===== VALIDACIÓN vs SAPFire: elemento del MURO (N, mm) =====
    // capture_coupled_K: K[RY,RY]_interior extraido = 3.5471e10 (nudo de 4 elementos)
    printf("\n=== validacion vs SAPFire (elemento muro 0.25m, E=24850 N/mm2) ===\n");
    double Xw[4]={0,250,250,0}, Yw[4]={0,0,250,250};   // 250x250 mm
    double Ew=24850.0, nuw=0.2, tw=250.0;
    double cw=Ew/(1-nuw*nuw)*tw;
    Eigen::Matrix3d Dw; Dw << cw, cw*nuw,0, cw*nuw,cw,0, 0,0,cw*(1-nuw)/2.0;
    // dos variantes: Allman FULL (θz en 3 filas) vs SHEAR-ONLY (θz solo en γxy, = binario)
    for (int variant=0; variant<2; variant++){
        MatrixXd Kw=MatrixXd::Zero(12,12);
        for (int g=0; g<4; g++){
            MatrixXd B; RowVectorXd bOm,bom; double detJ;
            B_and_rot(Xw,Yw,gp[g][0],gp[g][1],B,bOm,bom,detJ);
            if (variant==1) { // SHEAR-ONLY: anular θz en filas εxx, εyy (rows 0,1)
                for (int i=0;i<4;i++){ B(0,3*i+2)=0; B(1,3*i+2)=0; }
            }
            Kw += B.transpose()*Dw*B*detJ;
        }
        double interior = 4.0*Kw(2,2);
        printf("  [%s] K[θz,θz] interior(×4) = %.4e   ratio/SAPFire = %.3f\n",
               variant==0?"Allman FULL ":"SHEAR-ONLY ", interior, interior/3.5471e10);
    }
    printf("  SAPFire extraido = 3.5471e+10\n");

    // SHEAR-ONLY Allman + estabilizacion HB calibrada → reproducir 3.5471e10
    double Gw=Ew/(2*(1+nuw)), hw=250.0;
    double K_shear_interior = 2.6964e10;     // de arriba
    double need = 3.5471e10 - K_shear_interior;
    double stabScale = need / (Gw*tw*4.0*hw*hw/9.0);
    printf("\n  → B = SHEAR-ONLY Allman + HB stab scale=%.4f → total = %.4e (target 3.5471e10)\n",
           stabScale, K_shear_interior + stabScale*Gw*tw*4.0*hw*hw/9.0);
    return 0;
}
