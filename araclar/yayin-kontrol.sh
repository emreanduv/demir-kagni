#!/usr/bin/env bash
# Yayın öncesi kontrol: mağazaya giden her derleme bundan geçer. Bir şey eksikse derleme DURUR.
# Etiketle (ios-v*) başlatılan derlemede etiketin işaret ettiği işleme main dalında olmalı.
set -u
hata=0
dal="${GITHUB_REF_NAME:-$(git rev-parse --abbrev-ref HEAD)}"
if [ "${GITHUB_REF_TYPE:-branch}" = "tag" ]; then
  git fetch -q origin main 2>/dev/null || true
  if git merge-base --is-ancestor HEAD origin/main; then echo "✓ Etiket main dalında ($dal)"; else echo "::error::Etiket main dalında değil ($dal)"; hata=1; fi
elif [ "$dal" != "main" ]; then echo "::error::Mağaza derlemesi yalnız main dalından alınır (bu dal: $dal)"; hata=1; fi
kontrol() { if ! grep -q -- "$2" "$1"; then echo "::error::Eksik: $3 ($1 içinde '$2' yok)"; hata=1; else echo "✓ $3"; fi; }
kontrol www/index.html 'Bir Mr. Anduv! yapımıdır.' 'Ana ekranda imza'
kontrol www/index.html "let state='lang'" 'İlk ekranda dil seçimi'
kontrol www/index.html 'src="kabuk.js"' 'Ortak kabuk yüklü'
kontrol www/kabuk.js "id=\"dkOvHelp\"" 'Nasıl Oynanır'
kontrol www/kabuk.js "id=\"dkShare\"" 'Arkadaşına öner'
kontrol www/kabuk.js "id=\"setRate\"" 'Puan ver (Ayarlar)'
kontrol www/kabuk.js "id=\"setFeed\"" 'Bize yaz (Ayarlar)'
kontrol www/kabuk.js "id=\"setErase\"" 'Verilerimi sil (Ayarlar)'
kontrol www/kabuk.js 'function coachTick' 'Rehber (ipucu kartları)'
kontrol www/kabuk.js 'InAppReview' 'Uygulama içi puan'
kontrol www/kabuk.js 'TAM_URUN' 'Tam Sürüm (G70)'
kontrol www/kabuk.js 'wakeLock' 'Ekran uyanık (G75)'
kontrol ios/App/App/AppDelegate.swift 'isIdleTimerDisabled = true' 'iOS ekran uyanık'
kontrol package.json '@capacitor-community/in-app-review' 'In-App Review eklentisi'
kontrol package.json '@capacitor/share' 'Paylaş eklentisi'
kontrol package.json '@capgo/native-purchases' 'Satın alma eklentisi'
if [ -n "${SURUM:-}" ] && [ -f store/SON-SURUM ]; then
  son=$(cat store/SON-SURUM)
  if [ "$(printf '%s\n%s\n' "$son" "$SURUM" | sort -V | head -1)" != "$son" ]; then echo "::error::Sürüm geri gidiyor: $SURUM < $son"; hata=1; else echo "✓ Sürüm $SURUM ≥ $son"; fi
fi
if python3 araclar/turkce-yazi-kontrol.py www; then :; else hata=1; fi
[ $hata -eq 0 ] && echo "Yayın kontrolü geçti." || { echo "Yayın kontrolü BAŞARISIZ — derleme durduruldu."; exit 1; }
