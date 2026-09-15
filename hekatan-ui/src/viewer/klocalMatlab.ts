/**
 * klocalMatlab.ts — script MATLAB (Hekatan Lab / Octave) con la MATRIZ DE RIGIDEZ LOCAL
 * 12×12 de UNA barra del modelo, para comprobar a mano lo que usa el motor.
 *
 * No calcula nada en la web: escribe los DATOS que recibe el motor (los mismos
 * `elementInputs`) y la fórmula término a término, copiada de
 * `hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp`:
 *   · getLocalStiffnessMatrixFrame  → Timoshenko φ = 12EI/(G·As·L²); As = 0 → 5/6·A; As < 0 → Bernoulli
 *   · applyPartialFixitySprings     → muelles sumados a la diagonal
 *   · applyReleases                 → condensación Kc = Krr − Krf·Kff⁻¹·Kfr (6 o 12 banderas)
 * El ángulo de eje local (`ang`) NO entra en la matriz local (gira T), ni los brazos
 * rígidos (se aplican al ensamblar). Si esa fórmula del C++ cambia, esto tiene que cambiar.
 *
 * Ejes y GDL de la barra (convención CSI del motor):
 *   1..6  nudo i: u1 u2 u3 θ1 θ2 θ3     7..12 nudo j
 *   Iz = I33 (flexión en el plano 1-2: V2, M3) · Iy = I22 (plano 1-3: V3, M2)
 */
interface MallaK {
  nodes?: { rawVal: number[][] };
  elements?: { rawVal: number[][] };
  elementInputs?: { rawVal: any };
}

const num = (v: number) => {
  if (!isFinite(v)) return "0";
  if (v === 0) return "0";
  const a = Math.abs(v);
  return a >= 1e-3 && a < 1e7 ? String(+v.toPrecision(15)) : v.toExponential(14);
};

export function scriptKLocalBarra(mesh: MallaK, idx: number): { nombre: string; texto: string } {
  const N = mesh.nodes?.rawVal ?? [];
  const E = mesh.elements?.rawVal ?? [];
  const el = E[idx];
  if (!el || el.length !== 2) throw new Error(`El elemento ${idx} no es una barra (2 nudos).`);
  const ei = mesh.elementInputs?.rawVal ?? {};
  const val = (m: string, d = 0) => (ei[m]?.get?.(idx) ?? d) as number;
  const a = N[el[0]], b = N[el[1]];
  const rel = ei.momentReleases?.get?.(idx) as boolean[] | undefined;
  const spr = ei.partialFixitySprings?.get?.(idx) as number[] | undefined;
  const ang = val("localAngles", 0);
  const L: string[] = [];
  const p = (s = "") => L.push(s);

  p(`% ============================================================`);
  p(`%  MATRIZ DE RIGIDEZ LOCAL 12x12 — barra ${idx + 1} (índice ${idx} del motor)`);
  p(`%  Generado por Hekatan Struct con los datos que recibe el motor.`);
  p(`%  Fórmula = hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp`);
  p(`%  GDL: 1-6 nudo i [u1 u2 u3 t1 t2 t3], 7-12 nudo j. Unidades del modelo (kN, m).`);
  p(`% ============================================================`);
  p();
  p(`% --- Datos de la barra -------------------------------------------------`);
  p(`xi = [${a.map(num).join(" ")}];      % nudo i (${el[0]})`);
  p(`xj = [${b.map(num).join(" ")}];      % nudo j (${el[1]})`);
  p(`E  = ${num(val("elasticities"))};      % módulo de elasticidad`);
  p(`G  = ${num(val("shearModuli"))};      % módulo de cortante`);
  p(`A  = ${num(val("areas"))};      % área`);
  p(`Iz = ${num(val("momentsOfInertiaZ"))};      % I33: flexión en el plano 1-2 (V2, M3)`);
  p(`Iy = ${num(val("momentsOfInertiaY"))};      % I22: flexión en el plano 1-3 (V3, M2)`);
  p(`J  = ${num(val("torsionalConstants"))};      % constante de torsión`);
  p(`AsY = ${num(val("shearAreasY"))};     % área de cortante asociada a Iy (0 = 5/6*A, <0 = Bernoulli)`);
  p(`AsZ = ${num(val("shearAreasZ"))};     % área de cortante asociada a Iz (0 = 5/6*A, <0 = Bernoulli)`);
  if (ang) p(`% ang = ${num(ang)} grados: gira la sección en T, NO cambia esta matriz local.`);
  p();
  p(`L = sqrt(sum((xj - xi).^2));`);
  p();
  p(`% --- Timoshenko: phi = 12EI/(G*As*L^2) --------------------------------`);
  p(`bernY = AsY < 0;   bernZ = AsZ < 0;`);
  p(`if ~bernY && AsY < 1e-15 && A > 1e-15 && G > 1e-15, AsY = 5/6*A; end`);
  p(`if ~bernZ && AsZ < 1e-15 && A > 1e-15 && G > 1e-15, AsZ = 5/6*A; end`);
  p(`phiZ = 0;  if ~bernZ && AsZ > 0 && G > 0, phiZ = 12*E*Iz/(G*AsZ*L^2); end`);
  p(`phiY = 0;  if ~bernY && AsY > 0 && G > 0, phiY = 12*E*Iy/(G*AsY*L^2); end`);
  p();
  p(`EA_L = E*A/L;          % axial`);
  p(`GJ_L = G*J/L;          % torsión`);
  p(`tz = (12*E*Iz/L^3)/(1+phiZ);             bz = (6*E*Iz/L^2)/(1+phiZ);`);
  p(`kz = (4*E*Iz/L)*(1+phiZ/4)/(1+phiZ);     az = (2*E*Iz/L)*(1-phiZ/2)/(1+phiZ);`);
  p(`ty = (12*E*Iy/L^3)/(1+phiY);             by = (6*E*Iy/L^2)/(1+phiY);`);
  p(`ky = (4*E*Iy/L)*(1+phiY/4)/(1+phiY);     ay = (2*E*Iy/L)*(1-phiY/2)/(1+phiY);`);
  p();
  p(`% --- Matriz local (misma disposición que el C++) ----------------------`);
  p(`K = [ EA_L   0    0    0     0    0   -EA_L   0    0    0     0    0 ;`);
  p(`       0    tz   0    0     0   bz     0   -tz   0    0     0   bz ;`);
  p(`       0    0   ty    0   -by    0     0    0  -ty    0   -by    0 ;`);
  p(`       0    0    0  GJ_L    0    0     0    0    0 -GJ_L    0    0 ;`);
  p(`       0    0  -by    0    ky    0     0    0   by    0    ay    0 ;`);
  p(`       0   bz    0    0     0   kz     0  -bz    0    0     0   az ;`);
  p(`     -EA_L  0    0    0     0    0    EA_L   0    0    0     0    0 ;`);
  p(`       0  -tz    0    0     0  -bz     0   tz    0    0     0  -bz ;`);
  p(`       0    0  -ty    0    by    0     0    0   ty    0    by    0 ;`);
  p(`       0    0    0 -GJ_L    0    0     0    0    0  GJ_L    0    0 ;`);
  p(`       0    0  -by    0    ay    0     0    0   by    0    ky    0 ;`);
  p(`       0   bz    0    0     0   az     0  -bz    0    0     0   kz ];`);
  if (spr && spr.some((s) => s > 1e-12)) {
    p();
    p(`% --- Muelles de empotramiento parcial (se suman a la diagonal) --------`);
    p(`kres = [${spr.slice(0, 12).map(num).join(" ")}];`);
    p(`for i = 1:numel(kres), if kres(i) > 1e-12, K(i,i) = K(i,i) + kres(i); end, end`);
  }
  if (rel && rel.some(Boolean)) {
    const libres = rel.length >= 12
      ? rel.slice(0, 12).map((r, i) => (r ? i + 1 : 0)).filter(Boolean)
      : rel.slice(0, 6).map((r, i) => (r ? [4, 5, 6, 10, 11, 12][i] : 0)).filter(Boolean);
    p();
    p(`% --- Liberaciones: condensación estática  Kc = Krr - Krf*inv(Kff)*Kfr --`);
    p(`f = [${libres.join(" ")}];              % GDL liberados`);
    p(`r = setdiff(1:12, f);                % GDL que quedan`);
    p(`Kc = zeros(12);`);
    p(`Kc(r,r) = K(r,r) - K(r,f) * inv(K(f,f)) * K(f,r);`);
    p(`K = Kc;`);
  }
  p();
  p(`% --- Resultado ---------------------------------------------------------`);
  p(`fprintf('Barra ${idx + 1}:  L = %.4f   phiZ = %.6f   phiY = %.6f\\n', L, phiZ, phiY);`);
  p(`disp('K local (12x12):');`);
  p(`disp(K);`);
  return { nombre: `K_local_barra_${idx + 1}.m`, texto: L.join("\n") + "\n" };
}
