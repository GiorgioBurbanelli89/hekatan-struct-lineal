#!/usr/bin/env bash
# Compila test_wilson_csi.exe (nativo, g++ + Eigen; NO es el WASM: el WASM solo con hekatan-fem/build_wasm.sh).
#   bash build_test_wilson_csi.sh && ./test_wilson_csi.exe && python test_wilson_csi_ref.py --check
set -e
cd "$(dirname "$0")"
CPP=..
g++ -O2 -std=gnu++17 -static-libgcc -static-libstdc++ \
  -I "$CPP/eigen" -I "$CPP" \
  test_wilson_csi.cpp \
  "$CPP/utils/shellQ4.cpp" "$CPP/utils/shellThin.cpp" "$CPP/utils/drillingHughesBrezzi.cpp" \
  -o test_wilson_csi.exe
echo "compilado: plate_q4/test_wilson_csi.exe"
