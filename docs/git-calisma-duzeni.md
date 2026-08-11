# Git Çalışma Düzeni

Bu dosya, projede günlük git akışını tarif eder. Git bilgisi az olan biri için
yazıldı: ezberlemen gereken şey aslında **dört komut**.

## Temel kural

**`main` üzerinde asla çalışılmaz.** `main` = herkesin işinin toplandığı,
her zaman güncel tutulan taban. Sen ondan branch açarsın, işini orada
yaparsın, PR ile geri gönderirsin.

```
main ────●────────●────────────●──────>   (herkesin ortak hattı)
          \                   /
           ●────●────●───────/            (senin geçici branch'in → PR)
```

## Günlük akış

### 1. Yeni bir işe başlarken

```bash
git yeni-is feat/anket-oylama
```

Bu tek komut şunları yapar: uzak sunucudan çeker → `main`'i günceller →
güncel `main`'den yeni branch açar → o branch'e geçer.

Commit'lenmemiş işin varsa **uyarır ve durur** — yanlışlıkla iş kaybetmeyesin diye.

Branch isimlendirme:

| Ön ek | Ne zaman | Örnek |
|---|---|---|
| `feat/` | yeni özellik | `feat/anket-oylama` |
| `fix/` | hata düzeltme | `fix/login-401-hatasi` |
| `chore/` | bakım, temizlik | `chore/bagimlilik-guncelleme` |

### 2. Çalışırken

Normal şekilde commit at:

```bash
git add .
git commit -m "kısa ve net bir mesaj"
```

Nerede olduğunu unutursan:

```bash
git durum
```

Şunu gösterir: hangi branch'tesin, main'e göre kaç commit öndesin/geridesin,
neyi commit'lemedin, bu branch'te hangi commit'ler var.

### 3. Arkadaşlarının işini almak

```bash
git sync
```

`main`'i günceller ve seni bulunduğun branch'e geri bırakır. Uzun süren bir
işte ara ara çalıştır ki main'den çok uzaklaşma.

main'deki yenilikleri **kendi branch'ine** de katmak istersen:

```bash
git sync
git merge main
```

### 4. İşi gönderme

```bash
git gonder
```

Branch'i GitHub'a yollar. (Yanlışlıkla `main`'e push etmeye çalışırsan durdurur.)

Sonra GitHub'da çıkan linkten **Pull Request** aç. Arkadaşın inceleyip merge
eder; iş main'e o zaman girer.

### 5. İş bittikten sonra

PR merge edildiğinde geçici branch'in görevi biter:

```bash
git sync                          # main'e artık senin işin de dahil
git branch -d feat/anket-oylama   # yerel branch'i sil
```

## Kurulu kısayollar

| Komut | Ne yapar |
|---|---|
| `git yeni-is <ad>` | main'i güncelle + oradan yeni branch aç |
| `git sync` | main'i güncelle, bulunduğun branch'e geri dön |
| `git durum` | nerede olduğunun özeti |
| `git gonder` | branch'i GitHub'a it (main'i korur) |

Bunlar `~/.gitconfig` içinde global alias olarak tanımlı — bu makinede tüm
projelerde çalışır, ama başka bir makineye geçersen yeniden kurman gerekir.

## Sık sorulan durumlar

**"Yanlış branch'te çalışmaya başladım"**
Henüz commit atmadıysan: `git stash` → doğru branch'e geç → `git stash pop`.

**"main'de commit attım"**
Panik yok, commit kaybolmaz: `git switch -c feat/dogru-yer` (commit'lerin bu
yeni branch'e taşınır), sonra `git switch main` → `git reset --hard origin/main`.
Bu son komut yıkıcı, emin değilsen önce sor.

**"Merge çakışması çıktı"**
Aynı satırı iki kişi değiştirmiş demektir. Git dosyaya `<<<<<<<` işaretleri
koyar; hangisinin kalacağına sen karar verip işaretleri temizler, `git add` ile
çözüldüğünü söylersin. Emin değilsen sor — yanlış çözülen çakışma sessizce iş
kaybettirir.

**"Uzun süredir branch'teyim, main çok ilerledi"**
`git sync && git merge main`. Ne kadar geciktirirsen çakışma ihtimali o kadar
artar; günde bir yapmak iyi alışkanlık.
