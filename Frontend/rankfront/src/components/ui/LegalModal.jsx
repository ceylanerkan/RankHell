/**
 * LegalModal — Hukuki metin okuma modalı
 * ─────────────────────────────────────────────────────────────────
 * Tasarım sistemi: Coal Light yüzey + Line kenarlığı.
 * Glow, blur, scale yok — yalnızca coal zemin + krema metin.
 * Backdrop: yarı saydam night-deep, tıklanınca kapanır.
 * Klavye: Escape ile kapanır, focus trap (ilk/son odaklanabilir öğe).
 * Scroll lock: modal açıkken body scroll kilitlenir.
 */

import { useEffect, useRef } from 'react'
import Button from './button/Button'

/**
 * @param {object} props
 * @param {boolean}  props.open       Modal açık mı?
 * @param {Function} props.onClose    Kapatma callback'i
 * @param {string}   props.title      Modal başlığı
 * @param {import('react').ReactNode} props.children  Modal içeriği
 */
export default function LegalModal({ open, onClose, title, children }) {
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)

  /* ── Scroll kilidi ─────────────────────────────────────────── */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
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

  /* ── Açılışta kapat butonuna odaklan ───────────────────────── */
  useEffect(() => {
    if (open && closeBtnRef.current) {
      closeBtnRef.current.focus()
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

  return (
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

        {/* Alt eylem çubuğu */}
        <div className="legal-modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Kapat
          </Button>
        </div>
      </div>
    </div>
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
