#!/bin/bash
# Versión YouTube de los vídeos de comprobación: SIN subtítulos quemados (YouTube hace los suyos;
# los .srt es/en quedan para subirlos como pista si se quiere). Uno detrás de otro: el montaje
# con voz y marca de agua se come la RAM y en paralelo se caen.
# - salta los vídeos que ya existen
# - borra frames_youtube al terminar cada uno: 700 MB de PNG por vídeo llenaron el disco (14-sep-2026)
# - el PUENTE no va: se rehace con cargas móviles HL-93 (Jorge: «ojo, el puente son cargas móviles»)
cd "$(dirname "$0")"
V="/c/Users/j-b-j/Documents/Hekatan Calc 1.0.0/hekatan-school/VIDEOS"
M="/c/Users/j-b-j/Documents/Hekatan Calc 1.0.0/hekatan-school/montar_tutorial.py"
export HK_SIN_SUBTITULOS=1 HK_FPS_MAX=45 PYTHONIOENCODING=utf-8
while read carpeta frames destino nombre; do
  salida="$V/$destino/${nombre}_youtube.mp4"
  if [ -f "$salida" ]; then echo "YA $nombre"; continue; fi
  echo "=== $nombre  $(date +%H:%M:%S)"
  python ../../rearmar_frames_youtube.py "$carpeta/$frames" "$carpeta/frames_youtube" < /dev/null \
    || { echo "FALLO frames $nombre"; rm -rf "$carpeta/frames_youtube"; continue; }
  python "$M" "$carpeta/frames_youtube" "$carpeta/guion.txt" "$salida" "$carpeta/guion_en.txt" \
    < /dev/null && echo "OK $nombre" || echo "FALLO $nombre"   # < /dev/null: ffmpeg se comía la lista del while
  rm -rf "$carpeta/frames_youtube"
done <<'EOF'
cupula_metalica frames_montaje comprobacion_cupula_metalica cupula_metalica_hekatan_sap2000
edificio_2p frames_montaje comprobacion_edificio_2p edificio_2p_hekatan_sap2000_etabs
mezanine_cft frames_montaje comprobacion_mezanine_cft mezanine_cft_hekatan_sap2000_etabs
mezanine_hueco frames_montaje comprobacion_mezanine_hueco mezanine_hueco_hekatan_sap2000_etabs
muro_corte frames_montaje comprobacion_muro_corte muro_corte_hekatan_sap2000_etabs
video_boveda frames_montaje_v2 comprobacion_boveda boveda_hekatan_sap2000_etabs
EOF
echo "=== FIN $(date +%H:%M:%S)"
