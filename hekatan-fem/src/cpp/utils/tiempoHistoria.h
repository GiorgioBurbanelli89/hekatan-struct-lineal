/**
 * tiempoHistoria.h — TIEMPO-HISTORIA LINEAL (30-sep-2026), los dos métodos de SAP2000/ETABS.
 *
 * Fuente del método: CSI Analysis Reference Manual, cap. 21 «Linear Time-History Analysis»
 * (registros/libros/csi_analysis_reference_cap21/cap21.txt):
 *   · r(t) = Σ fᵢ(t)·pᵢ (ec. 21-2): pᵢ = un patrón de fuerzas o una aceleración en la base
 *     (p = −M·ι, respuesta RELATIVA al terreno, §21.2).
 *   · Función: antes de su primer punto vale 0, después del último se mantiene (§21.2.2).
 *   · DIRECTA: condiciones iniciales nulas, CARGAS INCLUIDAS (§21.3): en t = 0 la carga vale 0 (a₀ = 0).
 *     MODAL: la carga vale f(0) desde t = 0. Las dos cosas medidas en SAP2000 el 30-sep-2026.
 *   · Se calcula también en cada punto de las funciones («load steps», §21.4), no solo en la salida.
 *   · MODAL (§21.5): integración CERRADA de cada modo con la carga LINEAL entre puntos — Chopra,
 *     Dinámica de Estructuras 4.ª ed., §5.2, fórmulas (5.2.5) y Tabla 5.2.1 (p.169). Amortiguamiento
 *     modal constante ξ, más el proporcional ξₘ = cM/(2ωₘ) + cK·ωₘ/2 si se da (§21.5.1).
 *   · DIRECTA (§21.6): HHT-α (Hilber-Hughes-Taylor; α = 0 es Newmark γ = ½, β = ¼, el defecto de
 *     CSI) con C = cM·M + cK·K (§21.6.2).
 *
 * Trabaja en las MISMAS coordenadas que el modal (diafragmas, apoyos, GDL sin rigidez fuera), así el
 * modelo del tiempo-historia es exactamente el del modal.
 */
#pragma once
#include <vector>
#include <map>
#include <cmath>
#include <algorithm>
#include <Eigen/Dense>
#include <Eigen/Sparse>

namespace th {

/** Una función de tiempo (puntos t, v), escalada. Antes de t0 → 0; después de tn → vn. */
struct Funcion {
  std::vector<double> t, v;
  double sf = 1.0;
  double en(double x) const {
    if (t.empty() || x < t.front()) return 0.0;
    if (x >= t.back()) return sf * v.back();
    const auto it = std::upper_bound(t.begin(), t.end(), x);
    const size_t j = (size_t)(it - t.begin());   // t[j-1] <= x < t[j]
    const double a = t[j - 1], b = t[j];
    return sf * (v[j - 1] + (v[j] - v[j - 1]) * (x - a) / (b - a));
  }
};

/** Un término de r(t): vector espacial (en GDL reducidos) × función. */
struct Carga {
  Eigen::VectorXd p;
  Funcion f;
};

struct Config {
  int metodo = 1;          // 1 modal, 2 directa
  double dt = 0.01;
  int nsteps = 0;
  double xi = 0.0;         // modal: amortiguamiento constante
  double cM = 0.0, cK = 0.0;
  double alpha = 0.0, gamma = 0.5, beta = 0.25;   // directa (HHT; α = 0 → Newmark)
  int envolvente = 0;
  int paso = 1;            // guardar la serie cada `paso` pasos de salida
  int semantica = 0;       // 0 SAP2000, 1 ETABS (reacción en la base de la DIRECTA con el amortiguamiento cK·K·v)
};

/** Tabla 5.2.1 de Chopra (p.169): u_{i+1} = A u + B v + C p_i + D p_{i+1}; v_{i+1} = A' u + B' v + C' p_i + D' p_{i+1}. */
struct Coef { double A, B, C, D, Ap, Bp, Cp, Dp; };
inline Coef coefChopra(double wn, double z, double k, double dt) {
  const double wd = wn * std::sqrt(1.0 - z * z), e = std::exp(-z * wn * dt);
  const double s = std::sin(wd * dt), c = std::cos(wd * dt), r = std::sqrt(1.0 - z * z);
  Coef q;
  q.A  = e * (z / r * s + c);
  q.B  = e * (s / wd);
  q.C  = (1.0 / k) * (2.0 * z / (wn * dt) + e * (((1.0 - 2.0 * z * z) / (wd * dt) - z / r) * s - (1.0 + 2.0 * z / (wn * dt)) * c));
  q.D  = (1.0 / k) * (1.0 - 2.0 * z / (wn * dt) + e * ((2.0 * z * z - 1.0) / (wd * dt) * s + 2.0 * z / (wn * dt) * c));
  q.Ap = -e * (wn / r * s);
  q.Bp = e * (c - z / r * s);
  q.Cp = (1.0 / k) * (-1.0 / dt + e * ((wn / r + z / (dt * r)) * s + 1.0 / dt * c));
  q.Dp = (1.0 / (k * dt)) * (1.0 - e * (z / r * s + c));
  return q;
}

/** Tiempos donde se calcula: salidas k·dt ∪ puntos de las funciones dentro de (0, T]. */
inline std::vector<double> rejilla(const Config &cfg, const std::vector<Carga> &cargas) {
  const double T = cfg.dt * cfg.nsteps;
  std::vector<double> g;
  for (int k = 0; k <= cfg.nsteps; ++k) g.push_back(k * cfg.dt);
  for (const auto &c : cargas)
    for (double x : c.f.t) if (x > 0.0 && x < T) g.push_back(x);
  std::sort(g.begin(), g.end());
  std::vector<double> u;
  for (double x : g) if (u.empty() || x - u.back() > 1e-9 * std::max(1.0, cfg.dt)) u.push_back(x);
  return u;
}

/** r(t) en GDL reducidos. En t = 0 la carga es NULA (§21.3). */
inline Eigen::VectorXd cargaEn(double t, const std::vector<Carga> &cargas, int n) {
  Eigen::VectorXd r = Eigen::VectorXd::Zero(n);
  if (t <= 0.0) return r;
  for (const auto &c : cargas) { const double f = c.f.en(t); if (f != 0.0) r += f * c.p; }
  return r;
}

/**
 * MODAL. phi: modos M-ortonormales (columnas, GDL reducidos), w: ω. Devuelve q (nOut × nModos) en los
 * tiempos de salida (cada `paso` pasos) y los tiempos.
 */
inline void modal(const Config &cfg, const std::vector<Carga> &cargas, const Eigen::MatrixXd &phi,
                  const std::vector<double> &w, Eigen::MatrixXd &qOut, std::vector<double> &tOut,
                  Eigen::MatrixXd &qTodos) {
  const int nm = (int)w.size();
  // fuerza modal de cada término: cᵢₘ = φₘᵀ pᵢ
  Eigen::MatrixXd cm(cargas.size(), nm);
  for (size_t i = 0; i < cargas.size(); ++i) cm.row(i) = (phi.transpose() * cargas[i].p).transpose();
  const std::vector<double> g = rejilla(cfg, cargas);
  auto Pm = [&](double t) {
    Eigen::VectorXd P = Eigen::VectorXd::Zero(nm);
    // En el MODAL la carga SÍ vale f(0) en t = 0 (medido 30-sep-2026: SAP2000 ModHistLinear da el pórtico del
    // Paz 8.1 con u1 = 0.67318, la exacta con F(0) = F0; con la carga nula al inicio saldría 0.6606). La carga
    // nula en t = 0 (§21.3) es cosa del DIRECTO.
    for (size_t i = 0; i < cargas.size(); ++i) { const double f = cargas[i].f.en(t); if (f != 0.0) P += f * cm.row(i).transpose(); }
    return P;
  };
  std::vector<double> xi(nm);
  for (int m = 0; m < nm; ++m) xi[m] = std::min(0.999, cfg.xi + cfg.cM / (2.0 * w[m]) + cfg.cK * w[m] / 2.0);
  Eigen::VectorXd q = Eigen::VectorXd::Zero(nm), v = Eigen::VectorXd::Zero(nm);
  Eigen::VectorXd Pi = Pm(0.0);
  const int nOut = cfg.nsteps / cfg.paso + 1;
  qOut.resize(nOut, nm); tOut.clear();
  qTodos.resize(cfg.envolvente ? cfg.nsteps + 1 : 0, nm);
  int kOut = 0;
  qOut.row(0).setZero(); tOut.push_back(0.0); ++kOut;
  if (cfg.envolvente) qTodos.row(0).setZero();
  std::map<long long, std::vector<Coef>> cache;
  for (size_t s = 1; s < g.size(); ++s) {
    const double h = g[s] - g[s - 1];
    const long long key = std::llround(h * 1e12);
    auto it = cache.find(key);
    if (it == cache.end()) {
      std::vector<Coef> cs(nm);
      for (int m = 0; m < nm; ++m) cs[m] = coefChopra(w[m], xi[m], w[m] * w[m], h);   // k = ω² (φᵀMφ = 1)
      it = cache.emplace(key, cs).first;
    }
    const Eigen::VectorXd Pn = Pm(g[s]);
    for (int m = 0; m < nm; ++m) {
      const Coef &c = it->second[m];
      const double qn = c.A * q[m] + c.B * v[m] + c.C * Pi[m] + c.D * Pn[m];
      const double vn = c.Ap * q[m] + c.Bp * v[m] + c.Cp * Pi[m] + c.Dp * Pn[m];
      q[m] = qn; v[m] = vn;
    }
    Pi = Pn;
    // ¿es un tiempo de salida?
    const double kd = g[s] / cfg.dt;
    const long long k = std::llround(kd);
    if (std::abs(kd - (double)k) < 1e-6) {
      if (cfg.envolvente) qTodos.row(k) = q.transpose();
      if (k % cfg.paso == 0 && kOut < nOut) { qOut.row(kOut) = q.transpose(); tOut.push_back(k * cfg.dt); ++kOut; }
    }
  }
}

/**
 * DIRECTA, HHT-α (Hilber, Hughes & Taylor 1977): M a₊ + (1+α)(C v₊ + K u₊) − α(C v + K u) = (1+α) r₊ − α r,
 * con Newmark u₊ = u + Δt v + Δt²[(½−β) a + β a₊], v₊ = v + Δt[(1−γ) a + γ a₊]. α = 0 → Newmark.
 * K, M: sobre los GDL libres. a₀ = 0 (§21.3). Devuelve u en los tiempos de salida (y todos, si envolvente).
 */
inline bool directa(const Config &cfg, const std::vector<Carga> &cargas, const Eigen::SparseMatrix<double> &K,
                    const Eigen::SparseMatrix<double> &M, Eigen::MatrixXd &uOut, std::vector<double> &tOut,
                    Eigen::MatrixXd &uTodos, Eigen::MatrixXd *vOut = nullptr) {
  const int n = (int)K.rows();
  // paso interno: la salida partida para que caigan los puntos de las funciones (§21.4)
  double hmin = cfg.dt;
  for (const auto &c : cargas)
    for (size_t j = 1; j < c.f.t.size(); ++j) { const double d = c.f.t[j] - c.f.t[j - 1]; if (d > 1e-12) hmin = std::min(hmin, d); }
  const int nsub = std::max(1, (int)std::ceil(cfg.dt / hmin - 1e-9));
  const double h = cfg.dt / nsub, a = cfg.alpha, b = cfg.beta, gm = cfg.gamma;
  Eigen::SparseMatrix<double> C = cfg.cM * M + cfg.cK * K;
  Eigen::SparseMatrix<double> Ks = (1.0 + a) * K + ((1.0 + a) * gm / (b * h)) * C + (1.0 / (b * h * h)) * M;
  Eigen::SimplicialLDLT<Eigen::SparseMatrix<double>> ldlt(Ks);
  if (ldlt.info() != Eigen::Success) return false;
  Eigen::VectorXd u = Eigen::VectorXd::Zero(n), v = u, ac = u;
  Eigen::VectorXd r = cargaEn(0.0, cargas, n);
  const int nOut = cfg.nsteps / cfg.paso + 1;
  uOut.resize(nOut, n); uOut.row(0).setZero(); tOut.assign(1, 0.0);
  if (vOut) { vOut->resize(nOut, n); vOut->row(0).setZero(); }
  uTodos.resize(cfg.envolvente ? cfg.nsteps + 1 : 0, n);
  if (cfg.envolvente) uTodos.row(0).setZero();
  int kOut = 1;
  for (int k = 1; k <= cfg.nsteps; ++k) {
    for (int s = 1; s <= nsub; ++s) {
      const double t = ((k - 1) * nsub + s) * h;
      const Eigen::VectorXd rn = cargaEn(t, cargas, n);
      // lado derecho: (1+α) r₊ − α r + α(C v + K u) + M·[u/(βh²) + v/(βh) + (1/(2β) − 1) a]
      //               + (1+α) C·[γ u/(βh) + (γ/β − 1) v + h(γ/(2β) − 1) a]
      Eigen::VectorXd rhs = (1.0 + a) * rn - a * r + a * (C * v + K * u)
                            + M * (u / (b * h * h) + v / (b * h) + (1.0 / (2.0 * b) - 1.0) * ac)
                            + (1.0 + a) * (C * (gm * u / (b * h) + (gm / b - 1.0) * v + h * (gm / (2.0 * b) - 1.0) * ac));
      const Eigen::VectorXd un = ldlt.solve(rhs);
      const Eigen::VectorXd an = (un - u) / (b * h * h) - v / (b * h) - (1.0 / (2.0 * b) - 1.0) * ac;
      const Eigen::VectorXd vn = v + h * ((1.0 - gm) * ac + gm * an);
      u = un; v = vn; ac = an; r = rn;
    }
    if (cfg.envolvente) uTodos.row(k) = u.transpose();
    if (k % cfg.paso == 0 && kOut < nOut) { uOut.row(kOut) = u.transpose(); if (vOut) vOut->row(kOut) = v.transpose(); tOut.push_back(k * cfg.dt); ++kOut; }
  }
  return true;
}

}  // namespace th
