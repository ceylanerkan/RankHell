/**
 * Modal — yüzen katman kabuğu
 * ─────────────────────────────────────────────────────────────────
 * Sitedeki modallar bu kabuktan geçer. Kart sistemi dışıdır
 * (docs/design/exceptions.md §7): overlay'in kendi gölge katmanı var,
 * kart yüzeyi diliyle karıştırılmaz.
 *
 * Taşıdığı davranış: backdrop tıklaması, Escape, focus trap, açılışta
 * kapat butonuna odak, açıkken body scroll kilidi.
 *
 * Tasarım: Coal Light yüzey + Line kenarlığı. Glow, blur, scale yok.
 *
 * NOT: sınıf adları bilerek `legal-modal-*` kaldı. Bu kabuk LegalModal'dan
 * çıkarıldı ve stiller index.css'te aynı adlarla yaşıyor; yeniden
 * adlandırmak kayıt akışındaki çalışan ekrana dokunmayı gerektirirdi.
 * Sınıflar içerikten bağımsız (backdrop / panel / header / body / footer).
 */

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * @param {object} props
 * @param {boolean}  props.open      Modal açık mı?
 * @param {Function} props.onClose   Kapatma callback'i
 * @param {string}   props.title     Başlık çubuğundaki metin (aria-label olarak da kullanılır)
 * @param {import('react').ReactNode} [props.footer]  Alt eylem çubuğu — verilmezse çubuk çizilmez
 * @param {import('react').ReactNode} props.children  Gövde içeriği
 */
export default function Modal({ open, onClose, title, footer, children }) {
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)

  /* ── Scroll kilidi ───────────────────────────────────────────
     `overflow: hidden` DEĞİL, body'yi olduğu yere sabitleme tekniği.
     overflow:hidden body'den viewport'a propagate olur ve tarayıcıya göre
     scroll konumunu koruyabildiği gibi kaydırabiliyor da — modal açılınca
     sayfanın bambaşka bir yerine atlıyorduk.

     Burada body `position: fixed` + `top: -<scrollY>px` alır: içerik tam
     bulunulan yerde donar, çünkü kaydırma miktarı negatif top'a çevrilir.
     Sayfa hiç scroll edemediği için kayma da imkânsız hale gelir.
     Kapanışta stiller aynen geri konur ve scroll eski değerine döner. */
  useEffect(() => {
    if (!open) return
    const body = document.body

    // StrictMode geliştirmede effect'i mount → cleanup → mount diye iki kez
    // çalıştırır. İkinci mount'ta body zaten sabitlenmiş olabilir; o anda
    // window.scrollY 0 okunur ve `top: -0px` yazılıp sayfa başa atlardı.
    // Kilitliyse gerçek konum negatif top'tan geri okunur.
    const kilitli = body.style.position === 'fixed'
    const y = kilitli ? -parseInt(body.style.top || '0', 10) : window.scrollY

    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    const onceki = kilitli
      ? null // içteki kilit dıştakinin stillerini geri koymaz
      : {
          position: body.style.position,
          top: body.style.top,
          left: body.style.left,
          right: body.style.right,
          width: body.style.width,
          paddingRight: body.style.paddingRight,
        }

    body.style.position = 'fixed'
    body.style.top = `-${y}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    // Klasik scrollbar'lı platformlarda (macOS'un overlay scrollbar'ında 0)
    // scrollbar kaybolunca içerik yatayda sıçramasın.
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    return () => {
      if (!onceki) return
      body.style.position = onceki.position
      body.style.top = onceki.top
      body.style.left = onceki.left
      body.style.right = onceki.right
      body.style.width = onceki.width
      body.style.paddingRight = onceki.paddingRight
      window.scrollTo(0, y)
    }
  }, [open])

  /* ── Escape ile kapama ─────────────────────────────────────── */
  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  /* ── Açılışta kapat butonuna odaklan ─────────────────────────
     preventScroll: odaklanma tarayıcıyı elemanı görünür kılmak için
     kaydırmaya itebilir; modal zaten viewport'ta, o kaydırma yalnızca
     arkadaki sayfayı oynatır. */
  useEffect(() => {
    if (open && closeBtnRef.current) {
      closeBtnRef.current.focus({ preventScroll: true })
    }
  }, [open])

  /* ── Focus trap ──────────────────────────────────────────────
     Tab/Shift+Tab sıkışınca dialog dışına çıkmaz. */
  function handleDialogKeyDown(e) {
    if (e.key !== 'Tab') return
    const dialog = dialogRef.current
    if (!dialog) return
    const focusable = Array.from(
      dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.disabled)
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  if (!open) return null

  /* PORTAL ZORUNLU — modal body'ye taşınır, React ağacında kaldığı yerde
     render EDİLMEZ. <main> üzerinde `animate-rise`'ın `both` fill-mode ile
     bıraktığı kalıcı `transform: translateY(0)` var; transform taşıyan bir
     ata, position:fixed çocuğun containing block'unu viewport'tan kendine
     çeker. O halde backdrop viewport'u değil main'in tamamını kaplıyor
     (ölçüldü: top -814px, yükseklik 2413px) ve panel sayfanın ortasına
     düşüyordu — kullanıcı nerede olursa olsun modal başka yerde açılıyordu.
     Portal bu zinciri kestiği için fixed yeniden viewport'a bağlanır. */
  return createPortal(
    /* Backdrop */
    <div
      className="legal-modal-backdrop"
      aria-modal="true"
      role="dialog"
      aria-label={title}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Panel */}
      <div
        ref={dialogRef}
        className="legal-modal-panel"
        onKeyDown={handleDialogKeyDown}
      >
        {/* Başlık çubuğu */}
        <div className="legal-modal-header">
          <h2 className="legal-modal-title">{title}</h2>
          <button
            ref={closeBtnRef}
            type="button"
            className="legal-modal-close"
            aria-label="Kapat"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        {/* İçerik alanı */}
        <div className="legal-modal-body">
          {children}
        </div>

        {/* Alt eylem çubuğu — yalnızca istendiğinde */}
        {footer && <div className="legal-modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
