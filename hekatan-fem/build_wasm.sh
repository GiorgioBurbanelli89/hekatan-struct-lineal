#!/usr/bin/env bash
# Build del WASM. Igual al script "build" de package.json MÁS dos flags:
#
#   -fexceptions          El OOM de Eigen (std::bad_alloc) hoy no se puede atrapar: emscripten
#                         lo convierte en abort() irrecuperable con "Exception thrown, but
#                         exception catching is not enabled". Con esto pasa a ser un error JS
#                         normal que el panel puede mostrar (ver cli/DIAGNOSTICO_MODAL.md).
#   -s MAXIMUM_MEMORY=... WASM32 direcciona hasta 4 GB; emscripten pone 2 GB por defecto.
#                         Lo dejamos en 2 GB A PROPÓSITO: la máquina tiene 5-6 GB de RAM y
#                         una pestaña de 4 GB la ahoga. Se declara explícito para que el
#                         techo sea una decisión visible y no un default oculto.
#
# En Git-Bash `source emsdk_env.sh` NO funciona → se invoca emcc.bat vía cmd.
set -e
cd "$(dirname "$0")"

EMCC="C:\\Users\\j-b-j\\emsdk\\upstream\\emscripten\\emcc.bat"

SRCS="./src/cpp/deform.cpp ./src/cpp/modal.cpp ./src/cpp/modal_paz.cpp ./src/cpp/didactic.cpp \
./src/cpp/plate_q4_wasm.cpp ./src/cpp/plate_q4/kirchhoff_q4.cpp ./src/cpp/slope.cpp \
./src/cpp/nonlinear.cpp ./src/cpp/cyclic_pushover.cpp ./src/cpp/hex8_wasm.cpp \
./src/cpp/utils/feHelpers.cpp ./src/cpp/utils/getGlobalStiffnessMatrix.cpp \
./src/cpp/utils/getLocalStiffnessMatrix.cpp ./src/cpp/utils/getTransformationMatrix.cpp \
./src/cpp/utils/shellQ4.cpp ./src/cpp/utils/shellQ4_DKMQ.cpp ./src/cpp/utils/shellThin.cpp \
./src/cpp/utils/drillingHughesBrezzi.cpp ./src/cpp/utils/getLocalMassMatrix.cpp \
./src/cpp/utils/getGlobalMassMatrix.cpp ./src/cpp/utils/getLocalMassMatrixPaz.cpp \
./src/cpp/utils/getGlobalMassMatrixPaz.cpp"

EXPORTS="_malloc,_free,_deform,_modal,_assembled_joint_mass,_set_niveles_piso,_modal_paz,_didactic_solve,_plate_q4_solve,\
_slopeStabilitySolver,_slopeAllocDouble,_nonlinear_dynamic,_steel02_test,_cyclic_pushover,\
_concrete02_test,_hex8_solve,_hex8_stress"

ARGS="$SRCS -o ./src/cpp/built/deform.js -O3 -s ASSERTIONS -s ALLOW_MEMORY_GROWTH \
-s MAXIMUM_MEMORY=2147483648 -fexceptions -s STACK_SIZE=2097152 -s MODULARIZE -s EXPORT_ES6 \
-s EXPORTED_FUNCTIONS=$EXPORTS -s EXPORTED_RUNTIME_METHODS=HEAPF64,HEAPU32,HEAPU8 -I ./src/cpp/eigen/"

echo "compilando WASM (esto tarda unos minutos)…"
cmd //c "$EMCC $ARGS"
echo "listo → src/cpp/built/deform.{js,wasm}"
ls -la src/cpp/built/deform.js src/cpp/built/deform.wasm
