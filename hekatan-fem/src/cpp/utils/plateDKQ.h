#pragma once
#include <cmath>
#include <Eigen/Dense>

// ─── DKQ con JACOBIANO REAL — el Shell-Thin de CSI, tambien distorsionado ───
//
// Batoz & Tahar (1982), IJNME 18:1655-1677, la referencia que cita el manual
// de CSI. **Medido contra la matriz de ETABS reconstruida por flexibilidad**
// (`galpon-bodega-electoral/celda_flexion12*.py`):
//
//   geometria         DKE (bounding box)   DKQ (jacobiano real)
//   cuadrado, nu 0-0.45     1e-09 %              1e-09 %
//   rectangulo 1x0.5        8e-10 %              8e-10 %
//   PARALELOGRAMO          37.021 %              2.0e-09 %
//   TRAPECIO               44.299 %              1.0e-09 %
//   IRREGULAR              23.638 %              1.3e-09 %
//
// ⚠️ El `getBendingK_DKE` que habia toma el **bounding box** del elemento
// (xmin/xmax, ymin/ymax) y usa area constante `a_h*b_h` en vez del jacobiano.
// Por eso clava en cuadrado y rectangulo —donde el bounding box ES el
// elemento— y se va hasta el 44 % en cuanto se distorsiona. Su propia cabecera
// lo avisaba: «valido para Q4 RECTANGULAR alineado con XY locales». Y en un
// modelo de verdad —losa con huecos, cubierta inclinada, malla adaptada— casi
// ningun elemento es un rectangulo perfecto.
//
// Aqui el jacobiano se evalua en CADA punto de Gauss con las coordenadas
// reales de los nudos, que es lo que hace que cierre tambien distorsionado.
//
// Convencion de GDL, la del resto del motor: por nudo [w, theta_x, theta_y],
// con beta_x = -theta_y y beta_y = +theta_x.
static void serendip8(double xi, double et, double N[8],
                      double dNxi[8], double dNet[8])
{
    const double xn[4] = {-1, 1, 1, -1}, yn[4] = {-1, -1, 1, 1};
    // esquinas
    for (int i = 0; i < 4; i++) {
        double xx = xn[i]*xi, yy = yn[i]*et;
        N[i]     = 0.25*(1+xx)*(1+yy)*(xx+yy-1);
        dNxi[i]  = 0.25*xn[i]*(1+yy)*(2*xx+yy);
        dNet[i]  = 0.25*yn[i]*(1+xx)*(xx+2*yy);
    }
    // puntos medios: 5 entre 1-2, 6 entre 2-3, 7 entre 3-4, 8 entre 4-1
    N[4] = 0.5*(1-xi*xi)*(1-et);   dNxi[4] = -xi*(1-et);        dNet[4] = -0.5*(1-xi*xi);
    N[5] = 0.5*(1+xi)*(1-et*et);   dNxi[5] =  0.5*(1-et*et);    dNet[5] = -et*(1+xi);
    N[6] = 0.5*(1-xi*xi)*(1+et);   dNxi[6] = -xi*(1+et);        dNet[6] =  0.5*(1-xi*xi);
    N[7] = 0.5*(1-xi)*(1-et*et);   dNxi[7] = -0.5*(1-et*et);    dNet[7] = -et*(1-xi);
}

// B(xi,eta) del DKQ (3x12) en cartesianas locales; devuelve |J| en dJ. Una sola copia: la usan la K y la recuperacion.
static Eigen::Matrix<double, 3, 12> dkqBat(const double x[4], const double y[4], double xi, double et, double &dJ)
{
    // coeficientes por lado k (k = 0..3 -> lados 1-2, 2-3, 3-4, 4-1)
    double ak[4], bk[4], ck[4], dk[4], ek[4];
    for (int k = 0; k < 4; k++) {
        int i = k, j = (k+1) % 4;
        double xij = x[i]-x[j], yij = y[i]-y[j];
        double l2  = xij*xij + yij*yij;
        ak[k] = -xij/l2;
        bk[k] =  0.75*xij*yij/l2;
        ck[k] = (0.25*xij*xij - 0.5*yij*yij)/l2;
        dk[k] = -yij/l2;
        ek[k] = (0.25*yij*yij - 0.5*xij*xij)/l2;
    }

    double N[8], dNxi[8], dNet[8];
    serendip8(xi, et, N, dNxi, dNet);

    // jacobiano con las 4 esquinas (el DKQ usa geometria bilineal)
    double dNx4[4] = {-(1-et)/4, (1-et)/4, (1+et)/4, -(1+et)/4};
    double dNy4[4] = {-(1-xi)/4, -(1+xi)/4, (1+xi)/4, (1-xi)/4};
    double J11=0, J12=0, J21=0, J22=0;
    for (int i = 0; i < 4; i++) {
    J11 += dNx4[i]*x[i]; J12 += dNx4[i]*y[i];
    J21 += dNy4[i]*x[i]; J22 += dNy4[i]*y[i];
    }
    dJ = J11*J22 - J12*J21;
    double i11 =  J22/dJ, i12 = -J12/dJ, i21 = -J21/dJ, i22 = J11/dJ;

    // Hx y Hy en (xi,eta): 12 componentes cada uno, derivados en xi y eta
    Eigen::RowVectorXd Hx_x(12), Hx_e(12), Hy_x(12), Hy_e(12);
    Hx_x.setZero(); Hx_e.setZero(); Hy_x.setZero(); Hy_e.setZero();
    for (int i = 0; i < 4; i++) {
    int kp = (i+3) % 4;       // lado que ENTRA al nudo i
    int kn = i;           // lado que SALE del nudo i
    int m_p = 4 + kp, m_n = 4 + kn;   // sus puntos medios
    // Hx
    double c0x = 1.5*(ak[kn]*dNxi[m_n] - ak[kp]*dNxi[m_p]);
    double c0e = 1.5*(ak[kn]*dNet[m_n] - ak[kp]*dNet[m_p]);
    double c1x = bk[kn]*dNxi[m_n] + bk[kp]*dNxi[m_p];
    double c1e = bk[kn]*dNet[m_n] + bk[kp]*dNet[m_p];
    double c2x = dNxi[i] - ck[kn]*dNxi[m_n] - ck[kp]*dNxi[m_p];
    double c2e = dNet[i] - ck[kn]*dNet[m_n] - ck[kp]*dNet[m_p];
    Hx_x(3*i) = c0x; Hx_e(3*i) = c0e;
    Hx_x(3*i+1) = c1x; Hx_e(3*i+1) = c1e;
    Hx_x(3*i+2) = c2x; Hx_e(3*i+2) = c2e;
    // Hy
    double d0x = 1.5*(dk[kn]*dNxi[m_n] - dk[kp]*dNxi[m_p]);
    double d0e = 1.5*(dk[kn]*dNet[m_n] - dk[kp]*dNet[m_p]);
    double d1x = -dNxi[i] + ek[kn]*dNxi[m_n] + ek[kp]*dNxi[m_p];
    double d1e = -dNet[i] + ek[kn]*dNet[m_n] + ek[kp]*dNet[m_p];
    double d2x = -c1x, d2e = -c1e;
    Hy_x(3*i) = d0x; Hy_e(3*i) = d0e;
    Hy_x(3*i+1) = d1x; Hy_e(3*i+1) = d1e;
    Hy_x(3*i+2) = d2x; Hy_e(3*i+2) = d2e;
    }
    // a cartesianas
    Eigen::RowVectorXd Hx_X = i11*Hx_x + i12*Hx_e;
    Eigen::RowVectorXd Hx_Y = i21*Hx_x + i22*Hx_e;
    Eigen::RowVectorXd Hy_X = i11*Hy_x + i12*Hy_e;
    Eigen::RowVectorXd Hy_Y = i21*Hy_x + i22*Hy_e;

    Eigen::Matrix<double, 3, 12> B;
    B.row(0) = Hx_X;
    B.row(1) = Hy_Y;
    B.row(2) = Hx_Y + Hy_X;
    return B;
}

static Eigen::MatrixXd getBendingK_DKQ_D(const double x[4], const double y[4],
                                double E, double nu, double t,
                                double m11 = 1.0, double m22 = 1.0, double m12 = 1.0)
{
    double D0 = E*t*t*t/(12.0*(1.0-nu*nu));
    Eigen::Matrix3d Db;
    Db << D0*m11,        D0*nu*std::sqrt(m11*m22), 0,
          D0*nu*std::sqrt(m11*m22), D0*m22,        0,
          0,             0,        D0*(1-nu)/2.0*m12;

    Eigen::MatrixXd K = Eigen::MatrixXd::Zero(12, 12);
    const double gp[2] = {-0.5773502691896258, 0.5773502691896258};
    for (int ix = 0; ix < 2; ix++) for (int iy = 0; iy < 2; iy++) {
        double dJ;
        const Eigen::Matrix<double, 3, 12> B = dkqBat(x, y, gp[ix], gp[iy], dJ);
        K += B.transpose() * Db * B * std::abs(dJ);   // peso 1 en 2x2
    }
    return K;
}

// Envoltorio con los MODIFICADORES DIRECCIONALES (M11MOD M22MOD M12MOD), que
// van sobre la matriz constitutiva y no sobre la K ya ensamblada — el mismo
// sitio y la misma forma que en `getBendingK` de shellQ4.cpp, para que thin y
// thick respondan igual al mismo dato.
static Eigen::MatrixXd getBendingK_DKQ(const double x[4], const double y[4],
                                       double E, double nu, double t)
{ return getBendingK_DKQ_D(x, y, E, nu, t); }

static Eigen::MatrixXd getBendingK_DKQ_mod(const double x[4], const double y[4],
                                           double E, double nu, double t,
                                           const double *mod)
{
    if (!mod) return getBendingK_DKQ(x, y, E, nu, t);
    // K es lineal en cada termino de D, asi que se arma por partes: se evalua
    // con un nu equivalente no vale, hay que escalar cada termino. Se hace
    // combinando tres llamadas con constitutivas unitarias.
    //   D = D0 * [[1, nu, 0], [nu, 1, 0], [0, 0, (1-nu)/2]]
    // y los modificadores multiplican M11 (fila/col 1), M22 (2) y M12 (3).
    double m11 = mod[3], m22 = mod[4], m12 = mod[5];
    if (m11 == 1.0 && m22 == 1.0 && m12 == 1.0)
        return getBendingK_DKQ(x, y, E, nu, t);
    // caso general: se rehace la integracion con la D ya modificada
    return getBendingK_DKQ_D(x, y, E, nu, t, m11, m22, m12);
}
