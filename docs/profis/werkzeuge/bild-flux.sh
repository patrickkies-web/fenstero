#!/bin/sh
# Bild erzeugen über api.bfl.ai (Proxy). Aufruf: sh flux.sh <ausgabe.jpg> <seitenverhältnis> <prompt-datei> [seed]
OUT="$1"; AR="$2"; PF="$3"; SEED="$4"
BODY=$(python3 -c "import json,sys; d={'prompt':open(sys.argv[1]).read().strip(),'aspect_ratio':sys.argv[2],'raw':True,'output_format':'jpeg','safety_tolerance':2}
if sys.argv[3]: d['seed']=int(sys.argv[3])
print(json.dumps(d))" "$PF" "$AR" "$SEED")
R=$(curl -sS -m 60 -X POST https://api.bfl.ai/v1/flux-pro-1.1-ultra -H 'Content-Type: application/json' -d "$BODY")
P=$(echo "$R" | python3 -c "import json,sys; print(json.load(sys.stdin).get('polling_url',''))")
[ -z "$P" ] && { echo "Fehler: $R"; exit 1; }
i=0; while [ $i -lt 90 ]; do
  sleep 2; i=$((i+1))
  J=$(curl -sS -m 30 "$P")
  ST=$(echo "$J" | python3 -c "import json,sys; print(json.load(sys.stdin).get('status',''))")
  if [ "$ST" = "Ready" ]; then U=$(echo "$J" | python3 -c "import json,sys; print(json.load(sys.stdin)['result']['sample'])"); curl -sS -m 60 -o "$OUT" "$U"; echo "ok $OUT"; exit 0; fi
  case "$ST" in Pending|Processing|Queued|"Task not found") ;; *) echo "Status $ST: $J"; exit 1;; esac
done; echo zeit; exit 1
