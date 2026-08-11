# Sektör fotoğrafları — kaynak ve lisans

`Sektöre Hoş Geldin` bölümündeki kişilerin fotoğrafları buraya bırakılır.
Bu dosya aynı zamanda klasörü depoda var eden dosyadır (boş klasör commit edilemez).

## Nasıl eklenir

1. jpg'yi bu klasöre koy.
2. Dosya adı `src/api/mock/data.js`'teki `photoUrl` ile birebir aynı olmalı
   (ör. `photoUrl: '/personas/ayse-yildiz.jpg'` → `public/personas/ayse-yildiz.jpg`).
3. Aşağıdaki tabloya bir satır ekle.

Kodda değişiklik gerekmez: dosya yokken kart kişinin baş harfini taşıyan
monograma düşer, dosya konduğu an fotoğraf görünür
(`src/components/sector/PersonaPhoto.jsx`).

## Kurallar

- Gerçek kişilerin fotoğrafı kullanılacaksa izin/lisans durumu net olmalı.
- Ticari kullanıma açık lisans (CC BY / CC BY-SA / CC0 / kamu malı) tercih edilir.
- CC BY ve CC BY-SA görsellerde yazar adı ve lisans bu tabloda korunur.
- Kare (1:1) kırpım en iyi sonucu verir; kart kapağı `aspect-square`.

Geçici mock veridir; backend hazır olunca fotoğraflar gerçek API'den gelecek.

## Fotoğraflar

| Dosya | Kişi | Yazar | Lisans | Kaynak |
|-------|------|-------|--------|--------|
| _(henüz eklenmedi)_ | | | | |
