/**
 * Menu — dokununca açılan menü (dropdown)
 * ─────────────────────────────────────────────────────────────────
 * Sitedeki açılır menüler bu kabuktan geçer. DESIGN_SYSTEM.md §8'de
 * "dropdown and popover surfaces" henüz UNDEFINED; ikinci bir menü dili
 * türemesin diye tek kapı burada açılıyor.
 *
 * Yüzey: modal paneliyle aynı aile — coal-light + line kenar + 8px radius
 * + yüzen katman gölgesi. Kart sistemine çekilmez (exceptions.md §7:
 * yüzen katman kart yüzeyi diliyle karıştırılmaz).
 *
 * TETİKLEYİCİ Damga'dan geçer (variant="secondary") — o gerçek bir buton.
 * MENÜ SATIRLARI geçmez: onlar aksiyon butonu değil, menü öğesi
 * (role="menuitemradio" / "menuitemcheckbox"). Damga aksiyon butonları
 * sistemidir; menü satırı .duel-side / .tier-slot gibi kendi bileşen
 * sınıfıyla yaşar (stiller index.css'te .rh-menu-*).
 *
 * Klavye: Esc kapatır ve odağı tetikleyiciye döndürür, ok tuşları
 * satırlar arasında gezer, Home/End uçlara atlar.
 *
 * Kullanım:
 *   <Menu label="Net skor" title="Sırala">
 *     {({ close }) => (
 *       <Menu.Item selected onSelect={() => { seç(); close() }}>Net skor</Menu.Item>
 *     )}
 *   </Menu>
 */

import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import Button from './button/Button'

const ITEM_SELECTOR = '[role="menuitemradio"], [role="menuitemcheckbox"]'

/**
 * @param {object} props
 * @param {string}   props.label     Tetikleyicide yazan metin
 * @param {string}   props.title     Menünün erişilebilir adı (aria-label)
 * @param {number}   [props.count]   0'dan büyükse tetikleyicide sayı rozeti
 * @param {'start'|'end'} [props.align='start']  Panelin tetikleyiciye göre hizası
 * @param {Function|import('react').ReactNode} props.children  ({ close }) => içerik
 */
export default function Menu({ label, title, count = 0, align = 'start', children }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const panelId = useId()

  function close({ focusTrigger = true } = {}) {
    setOpen(false)
    if (focusTrigger) triggerRef.current?.focus()
  }

  /* ── Dışarı tıklama kapatır ─────────────────────────────────
     pointerdown (click değil): sayfadaki başka bir menü/butona
     basıldığında ikisi aynı anda açık kalmaz. */
  useEffect(() => {
    if (!open) return
    function onPointerDown(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  /* ── Escape ────────────────────────────────────────────────── */
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  /* ── Açılışta ilk satıra odak ──────────────────────────────── */
  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector(ITEM_SELECTOR)?.focus()
  }, [open])

  function onPanelKeyDown(e) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return
    const items = [...panelRef.current.querySelectorAll(ITEM_SELECTOR)]
    if (items.length === 0) return
    e.preventDefault()
    const at = items.indexOf(document.activeElement)
    const next =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? items.length - 1
          : e.key === 'ArrowDown'
            ? (at + 1) % items.length
            : (at - 1 + items.length) % items.length
    items[next].focus()
  }

  return (
    <div className="rh-menu" ref={wrapRef}>
      <Button
        ref={triggerRef}
        variant="secondary"
        size="sm"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        {count > 0 && <span className="rh-menu-count">{count}</span>}
        <ChevronDown size={15} className={`rh-menu-chev${open ? ' is-open' : ''}`} />
      </Button>

      {open && (
        <div
          id={panelId}
          ref={panelRef}
          role="menu"
          aria-label={title}
          className={`rh-menu-panel rh-menu-panel--${align}`}
          onKeyDown={onPanelKeyDown}
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>
      )}
    </div>
  )
}

// Menü başlığı — panelin ya da bir grubun üstünde duran etiket.
function MenuTitle({ children }) {
  return <p className="rh-menu-title">{children}</p>
}

// Gruplar arasına ayırıcı hat koyar (ilk grup hariç).
function MenuGroup({ children }) {
  return <div className="rh-menu-group">{children}</div>
}

/**
 * @param {object} props
 * @param {boolean} props.selected   Seçili mi? (sol kor şeridi + tik)
 * @param {boolean} [props.multi]    Çoklu seçim satırı mı? role'ü belirler
 * @param {Function} props.onSelect
 */
function MenuItem({ selected = false, multi = false, onSelect, children }) {
  return (
    <button
      type="button"
      role={multi ? 'menuitemcheckbox' : 'menuitemradio'}
      aria-checked={selected}
      className={`rh-menu-item${selected ? ' is-selected' : ''}`}
      onClick={onSelect}
    >
      <span>{children}</span>
      {selected && <Check size={16} aria-hidden="true" />}
    </button>
  )
}

// Panelin altındaki eylem şeridi (ör. "Filtreleri temizle").
function MenuFoot({ children }) {
  return <div className="rh-menu-foot">{children}</div>
}

Menu.Title = MenuTitle
Menu.Group = MenuGroup
Menu.Item = MenuItem
Menu.Foot = MenuFoot
