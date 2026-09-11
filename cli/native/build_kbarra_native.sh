#!/usr/bin/env bash
# Compila `kbarra_native`: la K de UNA barra, del mismo getLocalStiffnessMatrix
# que usa deform. getLocalStiffnessMatrix.cpp despacha tambien a las cascaras,
# por eso se enlazan sus fuentes aunque aqui solo se pida la barra.
#
#   bash cli/native/build_kbarra_native.sh
#   cli/native/kbarra_native.exe 0 0 0  3 0 0  25e6 10.4167e6 0.09 6.75e-4 6.75e-4 1.139e-3
set -e
cd "$(dirname "$0")/../.."
FEM=hekatan-fem/src/cpp
g++ -O2 -std=gnu++17 -static-libgcc -static-libstdc++ \
  -I "$FEM/eigen" -I "$FEM" \
  cli/native/kbarra_native.cpp \
  "$FEM/utils/getLocalStiffnessMatrix.cpp" \
  "$FEM/utils/getTransformationMatrix.cpp" \
  "$FEM/utils/shellQ4.cpp" \
  "$FEM/utils/shellThin.cpp" \
  "$FEM/utils/shellQ4_DKMQ.cpp" \
  "$FEM/utils/drillingHughesBrezzi.cpp" \
  -o cli/native/kbarra_native.exe
echo "compilado: cli/native/kbarra_native.exe"
