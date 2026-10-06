#!/usr/bin/env bash
# Compila kglob_native (K global de getGlobalStiffnessMatrix, la del WASM) para proto_tri.py.
set -e
cd "$(dirname "$0")/../.."
FEM=hekatan-fem/src/cpp
g++ -O2 -std=gnu++17 -static-libgcc -static-libstdc++ \
  -I "$FEM/eigen" -I "$FEM" -I "$FEM/utils" \
  validation/pandeo_cascara/kglob_native.cpp \
  "$FEM/utils/getGlobalStiffnessMatrix.cpp" "$FEM/utils/getLocalStiffnessMatrix.cpp" \
  "$FEM/utils/getTransformationMatrix.cpp" "$FEM/utils/shellQ4.cpp" "$FEM/utils/shellThin.cpp" \
  "$FEM/utils/shellQ4_DKMQ.cpp" "$FEM/utils/drillingHughesBrezzi.cpp" "$FEM/utils/feHelpers.cpp" \
  -o "${KGLOB_OUT:-$TEMP/kglob_native.exe}"
echo "compilado: ${KGLOB_OUT:-$TEMP/kglob_native.exe}"
