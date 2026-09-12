#!/usr/bin/env bash
# Compila `kensam_native`: la K ENSAMBLADA de una L (columna + viga) con
# getGlobalStiffnessMatrix, la misma que llama deform.cpp:160.
#
#   bash cli/native/build_kensam_native.sh
#   cli/native/kensam_native.exe            (la 18x18)
#   cli/native/kensam_native.exe barra 1    (Tt·k·T de la viga)
set -e
cd "$(dirname "$0")/../.."
FEM=hekatan-fem/src/cpp
g++ -O2 -std=gnu++17 -static-libgcc -static-libstdc++ \
  -I "$FEM/eigen" -I "$FEM" -I "$FEM/utils" \
  cli/native/kensam_native.cpp \
  "$FEM/utils/getGlobalStiffnessMatrix.cpp" \
  "$FEM/utils/getLocalStiffnessMatrix.cpp" \
  "$FEM/utils/getTransformationMatrix.cpp" \
  "$FEM/utils/shellQ4.cpp" \
  "$FEM/utils/shellThin.cpp" \
  "$FEM/utils/shellQ4_DKMQ.cpp" \
  "$FEM/utils/drillingHughesBrezzi.cpp" \
  -o cli/native/kensam_native.exe
echo "compilado: cli/native/kensam_native.exe"
