#!/bin/bash
# ============================================================================
# Build plate_formulations.wasm + .js usando emscripten
# ============================================================================
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

EMCC="$HOME/emsdk/upstream/emscripten/emcc.bat"

if [ ! -f "$EMCC" ]; then
    echo "ERROR: emcc not found at $EMCC"
    exit 1
fi

echo "Building plate_formulations.wasm..."
"$EMCC" -O3 -std=c++17 \
    src/plate_formulations.cpp \
    -o built/plate_formulations.js \
    -s WASM=1 \
    -s MODULARIZE=1 \
    -s EXPORT_NAME="createPlateFormulations" \
    -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","HEAPF64"]' \
    -s EXPORTED_FUNCTIONS='["_wasm_solve","_malloc","_free"]' \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s ENVIRONMENT='web,worker' \
    -s SINGLE_FILE=1

echo "Output:"
ls -la built/plate_formulations.*
echo ""
echo "Done. Open viewer.html in a browser."
