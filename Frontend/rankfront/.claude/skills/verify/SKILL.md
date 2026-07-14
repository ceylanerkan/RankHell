---
name: verify
description: RankHell frontend'ini (React+Vite SPA) çalıştırıp görsel/işlevsel değişiklikleri ekran görüntüsüyle doğrulama tarifi.
---

# RankHell Frontend Doğrulama

Uygulama: `Frontend/rankfront/` — React 19 + Vite SPA, mock veri katmanı (backend gerekmez).

## Başlat

```bash
cd Frontend/rankfront
npm run dev -- --port 5199 --strictPort   # arkaplanda; 200 dönene kadar ~3sn bekle
```

## Ekran görüntüsü (headless Chrome, kurulum gerekmez)

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --window-size=1440,2600 --hide-scrollbars \
  --virtual-time-budget=6000 --screenshot=out.png "http://localhost:5199/<rota>"
```

`--virtual-time-budget=6000` şart: mock client ~400ms gecikme simüle ediyor, SPA'nın render olmasını bekletir.

## Gezilecek rotalar

`/`, `/items`, `/items/1`, `/items/999` (hata durumu), `/polls`, `/polls/1`, `/polls/new`, `/login`, `/register`, `/profile`.
`/profile` ve oy verme girişli akış ister; mock giriş: `arda@rankhell.dev` + herhangi 8+ karakter (localStorage `rankhell_user`).

## Notlar

- `npm run build` Tailwind v4'ün `@apply` içindeki bilinmeyen utility'lerini derleme hatasıyla yakalar — hızlı ön kontrol.
- Headless Chrome emoji'leri tek renk çizer; gerçek tarayıcıda renklidir, bug sanma.
- Eski palet kalıntısı taraması: `grep -rnE '(stone|slate)-[0-9]' src/`.
