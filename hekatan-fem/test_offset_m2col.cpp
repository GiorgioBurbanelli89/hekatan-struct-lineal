// =============================================================================
// Test C++ NATIVO — Mesa Torsión M2 col con end offsets (modos A/B/C)
//
// Llama directamente a getGlobalStiffnessMatrix() (la función que aplica la
// transformación R^T·K·R del rigid offset) con los MISMOS inputs que
// mesa_torsion_completa.py, para verificar paridad C++ ↔ Python SIN WASM.
//
// Python ref (Live M2 col): A=2.453  B=2.232  C=2.092 tonf·m   (ETABS=2.13)
// =============================================================================
#include <iostream>
#include <iomanip>
#include <vector>
#include <map>
#include <cmath>
#include <Eigen/Dense>
#include <Eigen/Sparse>
#include "src/cpp/data-model.h"

Eigen::SparseMatrix<double> getGlobalStiffnessMatrix(
    const std::vector<Node> &nodes,
    const std::vector<unsigned int> &element_indices,
    const std::vector<unsigned int> &elementSizes,
    const ElementInputs &elementInputs, int dof);
Eigen::MatrixXd getLocalStiffnessMatrix(
    const std::vector<Node> &nodes, const ElementInputs &elementInputs, int index);
Eigen::MatrixXd getTransformationMatrix(const std::vector<Node> &nodes);

// ── Geometría/material (idénticos a mesa_torsion_completa.py) ──
static const double Lx = 6.0, Ly = 6.0, H = 4.0, tLosa = 0.10;
static const double bC = 0.40, hC = 0.40, bV = 0.30, hV = 0.50;
static const double E = 24.85e6, nu = 0.20, Gmod = E / (2 * (1 + nu));
static const double gamma = 24.0, GRAV = 9.80665;
static const int N = 5, nPS = N + 1;
static const double dx = Lx / N, dy = Ly / N;
static const double IOFF_COL_TOP = hV / 2, IOFF_BEAM = bC / 2;

static double stv(double b, double h){ double a=std::max(b,h),s=std::min(b,h),r=s/a; return (1.0/3.0)*(1-0.21*r*(1-std::pow(r,4)/12))*a*s*s*s; }

struct Case { const char* name; double sw, q_scp, q_live; };
static Case CASES[5] = {
  {"Dead",1.0,0,0},{"Live",0,0,0.5},{"SCP",0,1.0,0},{"UDCon1",1.4,1.4,0},{"UDCon2",1.2,1.2,0.8}
};
static double ETABS[5] = {1.57, 2.13, 4.26, 8.16, 10.40};
static double PYREF[3][5] = {
  {1.816,2.453,4.906,9.411,11.991}, // A
  {1.611,2.232,4.463,8.504,10.859}, // B
  {1.510,2.092,4.184,7.972,10.181}, // C
};

int main(){
  auto ix=[&](int i,int j){return 4 + j*nPS + i;};
  // Nodes
  std::vector<Node> nodes = {{0,0,0},{Lx,0,0},{Lx,Ly,0},{0,Ly,0}};
  for(int j=0;j<nPS;j++)for(int i=0;i<nPS;i++) nodes.push_back({i*dx,j*dy,H});
  int dof = 6*nodes.size();
  // Elements
  std::vector<std::vector<unsigned int>> elements;
  for(int j=0;j<N;j++)for(int i=0;i<N;i++) elements.push_back({(unsigned)ix(i,j),(unsigned)ix(i+1,j),(unsigned)ix(i+1,j+1),(unsigned)ix(i,j+1)});
  int sc = elements.size();
  elements.push_back({0,(unsigned)ix(0,0)}); elements.push_back({1,(unsigned)ix(N,0)});
  elements.push_back({2,(unsigned)ix(N,N)}); elements.push_back({3,(unsigned)ix(0,N)});
  int cs=sc, ce=elements.size();
  for(int i=0;i<N;i++) elements.push_back({(unsigned)ix(i,0),(unsigned)ix(i+1,0)});
  for(int j=0;j<N;j++) elements.push_back({(unsigned)ix(N,j),(unsigned)ix(N,j+1)});
  for(int i=0;i<N;i++) elements.push_back({(unsigned)ix(i,N),(unsigned)ix(i+1,N)});
  for(int j=0;j<N;j++) elements.push_back({(unsigned)ix(0,j),(unsigned)ix(0,j+1)});
  int bs=ce, be=elements.size();
  // Flat arrays for getGlobalStiffnessMatrix
  std::vector<unsigned int> flat, sizes;
  for(auto&el:elements){ sizes.push_back(el.size()); for(auto n:el) flat.push_back(n); }

  // Base element inputs (sin offset)
  double Ac=bC*hC, Iyc=bC*std::pow(hC,3)/12, Jc=stv(bC,hC);
  double Av=bV*hV, Iyv=bV*std::pow(hV,3)/12, Izv=hV*std::pow(bV,3)/12, Jv=stv(bV,hV);
  auto makeEI=[&](bool useOff){
    ElementInputs ei;
    for(int e=0;e<sc;e++){ ei.thicknesses[e]=tLosa; ei.elasticities[e]=E; ei.poissonsRatios[e]=nu; ei.plateFormulations[e]=1; ei.drillingTypes[e]=0; }
    for(int e=cs;e<ce;e++){ ei.elasticities[e]=E; ei.poissonsRatios[e]=nu; ei.shearModuli[e]=Gmod; ei.areas[e]=Ac; ei.momentsOfInertiaY[e]=Iyc; ei.momentsOfInertiaZ[e]=Iyc; ei.torsionalConstants[e]=Jc; }
    for(int e=bs;e<be;e++){ ei.elasticities[e]=E; ei.poissonsRatios[e]=nu; ei.shearModuli[e]=Gmod; ei.areas[e]=Av; ei.momentsOfInertiaY[e]=Iyv; ei.momentsOfInertiaZ[e]=Izv; ei.torsionalConstants[e]=Jv; }
    if(useOff){
      for(int e=cs;e<ce;e++) ei.rigidOffsets[e] = {0.0, IOFF_COL_TOP/H};
      double segL=Lx/N;
      for(int e=bs;e<be;e++){ int pos=(e-bs)%N; double oI=(pos==0)?IOFF_BEAM/segL:0, oJ=(pos==N-1)?IOFF_BEAM/segL:0; if(oI>0||oJ>0) ei.rigidOffsets[e]={oI,oJ}; }
    }
    return ei;
  };

  auto buildF=[&](const Case&c){
    Eigen::VectorXd F=Eigen::VectorXd::Zero(dof);
    if(c.sw!=0){
      for(int j=0;j<N;j++)for(int i=0;i<N;i++){ double W=tLosa*dx*dy*gamma*c.sw; for(int n:{ix(i,j),ix(i+1,j),ix(i+1,j+1),ix(i,j+1)}) F(n*6+2)-=W/4; }
      double Wcol=Ac*H*gamma*c.sw;
      int corners[4][2]={{0,ix(0,0)},{1,ix(N,0)},{2,ix(N,N)},{3,ix(0,N)}};
      for(auto&cc:corners){ F(cc[0]*6+2)-=Wcol/2; F(cc[1]*6+2)-=Wcol/2; }
      for(size_t e=bs;e<(size_t)be;e++){ double Ws=Av*dx*gamma*c.sw; F(elements[e][0]*6+2)-=Ws/2; F(elements[e][1]*6+2)-=Ws/2; }
    }
    double q=(c.q_scp+c.q_live)*GRAV;
    if(q!=0) for(int j=0;j<nPS;j++)for(int i=0;i<nPS;i++){ bool xe=(i==0||i==N),ye=(j==0||j==N); double f=(xe&&ye)?0.25:((xe||ye)?0.5:1.0); F(ix(i,j)*6+2)-=q*dx*dy*f; }
    return F;
  };

  // M2 col pick (face: M2_J -= V3_J*0.25)
  auto m2col=[&](const ElementInputs&ei, const Eigen::VectorXd&u, bool face){
    double mx=0;
    for(int e=cs;e<ce;e++){
      std::vector<Node> elN={nodes[elements[e][0]],nodes[elements[e][1]]};
      Eigen::MatrixXd kL=getLocalStiffnessMatrix(elN,ei,e);
      Eigen::MatrixXd T=getTransformationMatrix(elN);
      Eigen::VectorXd uG(12);
      for(int ni=0;ni<2;ni++)for(int d=0;d<6;d++) uG(ni*6+d)=u(elements[e][ni]*6+d);
      Eigen::VectorXd fL=kL*(T*uG);
      double mI=fL(4), mJ=fL(10);
      if(face) mJ = mJ - fL(8)*IOFF_COL_TOP; // oI=0 base, oJ=0.25 top
      mx=std::max(mx,std::max(std::abs(mI),std::abs(mJ)));
    }
    return mx/GRAV;
  };

  // BCs: pinned bases (fix 0,1,2 of nodes 0-3)
  std::vector<bool> fixed(dof,false);
  for(int n:{0,1,2,3}) for(int d=0;d<3;d++) fixed[n*6+d]=true;
  std::vector<int> freeI; for(int i=0;i<dof;i++) if(!fixed[i]) freeI.push_back(i);
  int nf=freeI.size(); std::map<int,int> g2r; for(int i=0;i<nf;i++) g2r[freeI[i]]=i;

  double res[3][5];
  const char* mlabel[3]={"A: sin offset","B: offset en K","C: offset K + cara"};
  for(int mode=0; mode<3; mode++){
    bool useOff=(mode>=1), face=(mode==2);
    ElementInputs ei=makeEI(useOff);
    Eigen::SparseMatrix<double> K=getGlobalStiffnessMatrix(nodes,flat,sizes,ei,dof);
    // reduce
    std::vector<Eigen::Triplet<double>> rT;
    for(int k=0;k<K.outerSize();k++) for(Eigen::SparseMatrix<double>::InnerIterator it(K,k);it;++it){
      auto ri=g2r.find(it.row()),ci=g2r.find(it.col());
      if(ri!=g2r.end()&&ci!=g2r.end()) rT.emplace_back(ri->second,ci->second,it.value());
    }
    Eigen::SparseMatrix<double> Kr(nf,nf); Kr.setFromTriplets(rT.begin(),rT.end());
    Eigen::SparseLU<Eigen::SparseMatrix<double>> solver; solver.compute(Kr);
    for(int c=0;c<5;c++){
      Eigen::VectorXd F=buildF(CASES[c]);
      Eigen::VectorXd Fr(nf); for(int i=0;i<nf;i++) Fr(i)=F(freeI[i]);
      Eigen::VectorXd ur=solver.solve(Fr);
      Eigen::VectorXd u=Eigen::VectorXd::Zero(dof); for(int i=0;i<nf;i++) u(freeI[i])=ur(i);
      res[mode][c]=m2col(ei,u,face);
    }
  }

  std::cout<<std::fixed<<std::setprecision(3);
  std::cout<<"\n  C++ NATIVO — Mesa Torsion M2 col (tonf.m) vs Python vs ETABS\n";
  for(int mode=0;mode<3;mode++){
    std::cout<<"\n  --- Modo "<<mlabel[mode]<<" ---\n";
    std::cout<<"  Caso       C++     Python    ETABS   d(cpp-py)   d(vs ETABS)\n";
    for(int c=0;c<5;c++){
      double cpp=res[mode][c], py=PYREF[mode][c], et=ETABS[c];
      double dpy=(cpp-py)/py*100, det=(cpp-et)/et*100;
      std::cout<<"  "<<std::left<<std::setw(8)<<CASES[c].name<<std::right
               <<std::setw(8)<<cpp<<std::setw(9)<<py<<std::setw(9)<<et
               <<std::setw(9)<<std::showpos<<dpy<<"%"<<std::setw(9)<<det<<"%"<<std::noshowpos<<"\n";
    }
  }
  std::cout<<"\n";
  return 0;
}
