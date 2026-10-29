#!/bin/sh
# Baut lokal.html neben einer Vorschau: dasselbe Dokumentgerüst, das der Artifact-Dienst um die Seite legt, plus index.html.
# Aufruf: sh huelle.sh <Ordner der Vorschau>   (danach: cd <Ordner> && python3 -m http.server 8790 --bind 127.0.0.1)
V="$1"
{ printf '%s' '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style></head><body>'; cat "$V/index.html"; printf '</body></html>'; } > "$V/lokal.html"
echo "lokal.html $(wc -c < "$V/lokal.html") Byte"
