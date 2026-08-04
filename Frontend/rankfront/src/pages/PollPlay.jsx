import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star, EyeOff, GitFork, Swords, User, Radio, Play } from 'lucide-react'
import { getPoll } from '../api/client'
import { Loading, ErrorState } from '../components/States'
import Button from '../components/ui/button/Button'
import Card from '../components/ui/Card'
import CategoryBadge from '../components/CategoryBadge'
import PollStats from '../components/poll/PollStats'
import ClassicPlay from '../components/poll/play/ClassicPlay'
import PlayResult from '../components/poll/play/PlayResult'
import { PLAY_MODES, pollModeLabel, roundOptionsFor, defaultRoundFor } from '../lib/pollModes'

// Anket oynama sayfası. Üç faz tek route'ta yaşar (kurulum seçimleri elde
// kalsın diye ayrı route açılmadı):
//   setup   → oyuncu tipi / oyun modu / tur sayısı seçilir
//   playing → ClassicPlay, tur tur puanlama
//   result  → PlayResult, podyum + sıralı liste
// Şimdilik yalnızca Klasik Puanlama oynanabilir; diğer üç modda BAŞLA pasif.
// Damga v1 "view başına tek primary" kuralı faz başına korunur: kurulumda
// BAŞLA, oyun ekranında primary yok, sonuçta "Tekrar oyna".

// İkon ve açıklama sunum bilgisi, o yüzden sayfada yaşar; etiket ve sıra
// src/lib/pollModes.js'ten gelir (tek sözlük).
const MODE_ICON = {
  classic: Star,
  blind: EyeOff,
  bracket: GitFork,
  duel: Swords,
}

const MODE_HINT = {
  classic: 'Her seçeneğe tek tek puan ver, sıra puanlardan çıksın.',
  blind: 'Puanları görmeden sırala; sadece kendi tercihin konuşsun.',
  bracket: 'Eşleşmeler eleye eleye ilerlesin, tek şampiyon kalsın.',
  duel: 'İkili karşılaşmalar: her turda sadece biri devam eder.',
}

const PLAYER_MODES = [
  { key: 'solo', label: 'Solo', hint: 'Tek başına oyna', icon: User },
  { key: 'stream', label: 'Yayında oyna', hint: 'İzleyicilerinle birlikte oyna', icon: Radio },
]

function SectionTitle({ children }) {
  return (
    <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-faded">{children}</h2>
  )
}

// Oyuncu kartı: ikon + başlık + tek satır açıklama. Görünüm kuralı Card'da
// yaşar, burada yalnızca yerleşim utility'leri var.
function PickCard({ icon: Icon, label, hint, selected, onSelect }) {
  return (
    <Card
      surface="raised"
      behavior="selectable"
      selected={selected}
      onClick={onSelect}
      padding="compact"
      className="flex items-start gap-3"
    >
      <Icon className="mt-0.5 h-5 w-5 flex-none text-ash" aria-hidden="true" />
      <span className="flex-1">
        <span className="block text-sm font-bold text-cream">{label}</span>
        <span className="mt-0.5 block text-xs leading-snug text-faded">{hint}</span>
      </span>
      <span className="rh-card-pick mt-0.5" aria-hidden="true" />
    </Card>
  )
}

// Mod kartı: dört mod tek sıraya sığsın diye yalnızca ikon + ad taşır.
// Açıklama sağ üstteki "?" işaretinin üzerine gelince açılır (.play-tip);
// "?" tıklanabilir değil — Card zaten <button>, içine ikinci tıklanabilir
// öğe konmaz. Klavyede kart odaklanınca da balon açılır.
function ModeCard({ modeKey, selected, onSelect }) {
  const Icon = MODE_ICON[modeKey]
  const tipId = `mod-ipucu-${modeKey}`

  return (
    <Card
      surface="raised"
      behavior="selectable"
      selected={selected}
      onClick={onSelect}
      padding="compact"
      aria-describedby={tipId}
      className="flex flex-col items-center gap-2 py-4 text-center"
    >
      <span className="play-hint" aria-hidden="true">
        ?
      </span>
      <Icon className="h-6 w-6 text-ash" aria-hidden="true" />
      <span className="text-sm font-bold text-cream">{pollModeLabel(modeKey)}</span>
      <span className="play-tip" id={tipId} role="tooltip">
        {MODE_HINT[modeKey]}
      </span>
    </Card>
  )
}

function Cover({ src, alt }) {
  if (!src) {
    return (
      <div
        className="flex aspect-video w-full items-center justify-center rounded bg-coal-light text-sm text-faded"
        role="img"
        aria-label="Kapak görseli yok"
      >
        Kapak yok
      </div>
    )
  }
  return <img src={src} alt={alt} className="aspect-video w-full rounded object-cover" />
}

export default function PollPlay() {
  const { id } = useParams()
  const [poll, setPoll] = useState(null)
  const [error, setError] = useState(null)
  const [playerMode, setPlayerMode] = useState('solo')
  const [mode, setMode] = useState(PLAY_MODES[0])
  const [round, setRound] = useState(null)
  const [phase, setPhase] = useState('setup')
  // BAŞLA'ya basıldığı andaki seçimler dondurulur: oyun sürerken kurulum
  // state'i değişse bile (geri gelip başka mod seçmek) oynanan tur bozulmaz.
  const [config, setConfig] = useState(null)
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    getPoll(id).then(setPoll).catch((e) => setError(e.message))
  }, [id])

  // ClassicPlay'in effect bağımlılığı: kimliği sabit kalmalı, yoksa sonuç
  // devri her render'da yeniden tetiklenir.
  const handleFinish = useCallback((result) => {
    setSummary(result)
    setPhase('result')
  }, [])

  const backToSetup = useCallback(() => {
    setSummary(null)
    setPhase('setup')
  }, [])

  // Havuz: getPoll çözülmüş items döner, yoksa ham pollItems sayılır.
  const itemCount = poll?.items?.length ?? poll?.pollItems?.length ?? 0
  const roundOptions = useMemo(() => roundOptionsFor(mode, itemCount), [mode, itemCount])
  // Mod değişince liste değişir: seçili değer artık yoksa varsayılana düşülür.
  const activeRound = roundOptions.some((option) => option.value === round)
    ? round
    : defaultRoundFor(mode, roundOptions)

  // Yalnızca klasik puanlama oynanabilir; diğer modlarda BAŞLA pasif kalır.
  const canStart = mode === 'classic' && roundOptions.length > 0

  if (error) return <ErrorState message={error} />
  if (!poll) return <Loading label="Anket yükleniyor..." />

  if (phase === 'playing') {
    return (
      <ClassicPlay
        poll={poll}
        roundCount={config.round}
        onFinish={handleFinish}
        onQuit={backToSetup}
      />
    )
  }

  if (phase === 'result') {
    return (
      <PlayResult
        poll={poll}
        results={summary.results}
        average={summary.average}
        onReplay={() => setPhase('playing')}
        onSetup={backToSetup}
      />
    )
  }

  return (
    <div>
      {/* İki sütunun oranı Quizei kurulum ekranından birebir alındı: sol künye
          kolonu 480px sabit (içerik genişliğinin ~%34'ü), araya 20px boşluk. */}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">
        <Card surface="neutral" behavior="static">
          <Cover src={poll.coverUrl} alt={`${poll.title} kapak görseli`} />

          <p className="mt-4 text-sm text-faded">
            Oluşturan{' '}
            <span className="font-bold text-cream">@{poll.creator?.username ?? 'anonim'}</span>
          </p>

          {poll.category && (
            <div className="mt-3">
              <CategoryBadge name={poll.category.name} />
            </div>
          )}

          <div className="mt-4">
            <PollStats poll={poll} />
          </div>
        </Card>

        {/* Sağ sütun da künye gibi tek nötr kutuda: dikey ritim space-y ile
            kartın kökünden verilir, bölümler kendi mt'sini taşımaz. */}
        <Card surface="neutral" behavior="static" className="space-y-5">
          <div className="pb-1">
            <p className="text-xs font-bold uppercase tracking-widest text-faded">Anket</p>
            <h1 className="title-copper mt-1 font-display text-3xl font-extrabold leading-tight text-cream">
              {poll.title}
            </h1>
          </div>

          <div role="group" aria-label="Oyuncu modu">
            <SectionTitle>Oyuncu</SectionTitle>
            <div className="grid gap-2 sm:grid-cols-2">
              {PLAYER_MODES.map((option) => (
                <PickCard
                  key={option.key}
                  icon={option.icon}
                  label={option.label}
                  hint={option.hint}
                  selected={playerMode === option.key}
                  onSelect={() => setPlayerMode(option.key)}
                />
              ))}
            </div>
          </div>

          <div role="group" aria-label="Oyun modu">
            <SectionTitle>Oyun Modu</SectionTitle>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PLAY_MODES.map((key) => (
                <ModeCard
                  key={key}
                  modeKey={key}
                  selected={mode === key}
                  onSelect={() => setMode(key)}
                />
              ))}
            </div>
          </div>

          <div role="group" aria-label="Tur sayısı">
            <SectionTitle>Turlar</SectionTitle>
            {roundOptions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {roundOptions.map((option) => (
                  <Card
                    key={option.value}
                    surface="raised"
                    behavior="selectable"
                    selected={activeRound === option.value}
                    onClick={() => setRound(option.value)}
                    padding="compact"
                    className="w-auto min-w-[60px] text-center text-base font-bold text-cream"
                  >
                    {option.label}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-faded">
                Bu ankette oynanacak kadar seçenek yok (en az 2 gerekli).
              </p>
            )}
          </div>

          {/* Aksiyon bloğu seçimlerden bir tık daha ayrı dursun diye tek
              ekstra üst boşluk alır (space-y-5 + pt-1). */}
          <div className="pt-1">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canStart}
              onClick={() => {
                setConfig({ mode, playerMode, round: activeRound })
                setPhase('playing')
              }}
            >
              <Play className="h-5 w-5" aria-hidden="true" />
              Başla
            </Button>
            {mode !== 'classic' && (
              <p className="mt-2 text-center text-xs text-faded">
                Bu mod henüz hazır değil — şimdilik Klasik Puanlama oynanabilir.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
