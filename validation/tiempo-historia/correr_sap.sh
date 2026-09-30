#!/usr/bin/env bash
# SAP2000 con el tiempo-historia de la plantilla dual (modal y directa). Salida a fichero (SAP hereda la tubería).
cd "$(dirname "$0")/../.."
for met in modal directa; do
  python -u ../galpon-bodega-electoral/csi_desde_dump.py sap validation/tiempo-historia/dual_sap.json \
    validation/tiempo-historia/sap_$met.json --th validation/tiempo-historia/spec_$met.json \
    > validation/tiempo-historia/sap_$met.log 2>&1
done
echo fin
