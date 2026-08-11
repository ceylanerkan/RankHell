/**
 * LegalModal — Hukuki metin okuma modalı
 * ─────────────────────────────────────────────────────────────────
 * Kabuğun tamamı (backdrop, Escape, focus trap, scroll kilidi) artık
 * ./Modal içinde yaşıyor; burada yalnızca hukuki metne özgü olan şey
 * kaldı: alt çubuktaki "Kapat" butonu.
 */

import Button from './button/Button'
import Modal from './Modal'

/**
 * @param {object} props
 * @param {boolean}  props.open       Modal açık mı?
 * @param {Function} props.onClose    Kapatma callback'i
 * @param {string}   props.title      Modal başlığı
 * @param {import('react').ReactNode} props.children  Modal içeriği
 */
export default function LegalModal({ open, onClose, title, children }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Kapat
        </Button>
      }
    >
      {children}
    </Modal>
  )
}
