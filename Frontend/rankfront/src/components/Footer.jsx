import { useState } from 'react'
import { Link } from 'react-router-dom'
import Flame from './Flame'
import Button from './ui/button/Button'
import LegalModal from './ui/LegalModal'
import { TermsContent, PrivacyContent, TERMS_TITLE, PRIVACY_TITLE } from '../lib/legalContent'

// Sosyal medya ikonları — şimdilik hedefsiz butonlar, hesaplar açılınca href verilecek.
const socials = [
  {
    label: 'X',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'Instagram',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838a4 4 0 100 8 4 4 0 000-8zm0 6.6a2.6 2.6 0 110-5.2 2.6 2.6 0 010 5.2zm4.156-7.706a.96.96 0 100 1.92.96.96 0 000-1.92z',
  },
  {
    label: 'YouTube',
    path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    label: 'TikTok',
    path: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.3 0 .58.05.85.13V9.4a6.33 6.33 0 00-.85-.05 6.34 6.34 0 106.34 6.34V8.87a8.16 8.16 0 004.77 1.52v-3.45a4.85 4.85 0 01-1-.25z',
  },
  {
    label: 'Discord',
    path: 'M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z',
  },
]

const MODAL_TERMS = 'terms'
const MODAL_PRIVACY = 'privacy'
const MODAL_CONTACT = 'contact'

const linkStyle =
  'text-left text-faded transition hover:text-copper-soft'

export default function Footer() {
  const [openModal, setOpenModal] = useState(null)

  // Bağlantı sütunları. to olanlar gerçek rotalar; olmayanlar şimdilik boş butonlar.
  const columns = [
    {
      title: 'Keşfet',
      icon: (
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.24 6.35l-2.12 5.66a1 1 0 01-.59.59l-5.66 2.12 2.12-5.66a1 1 0 01.59-.59zM12 13a1 1 0 110-2 1 1 0 010 2z" />
      ),
      links: [
        { label: 'Tüm Öğeler', to: '/items' },
        { label: 'Tier Listesi', to: '/tiers' },
        { label: 'Trend' },
        { label: 'Kategoriler' },
        { label: 'En Yüksek Puanlılar' },
      ],
    },
    {
      title: 'Anketler',
      icon: (
        <path d="M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm3 12h2v-5H7zm4 0h2V8h-2zm4 0h2v-3h-2z" />
      ),
      links: [
        { label: 'Tüm Anketler', to: '/polls' },
        { label: 'Anket Oluştur', to: '/polls/new' },
        { label: 'Popüler' },
        { label: 'Nasıl Oynanır?' },
      ],
    },
    {
      title: 'Topluluk',
      icon: (
        <path d="M16 11a3 3 0 10-3-3 3 3 0 003 3zm-8 0a3 3 0 10-3-3 3 3 0 003 3zm0 2c-2.33 0-7 1.17-7 3.5V19h8v-2.5a4.36 4.36 0 012.06-3.42A11.9 11.9 0 008 13zm8 0c-.29 0-.62.02-.97.05A5.44 5.44 0 0117 16.5V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      ),
      links: [
        { label: 'Profil', to: '/profile' },
        { label: 'Leaderboard' },
        { label: 'Discord Sunucusu' },
      ],
    },
    {
      title: 'Bilgi',
      icon: (
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2zm0-8h-2V7h2z" />
      ),
      links: [
        { label: 'Gizlilik Politikası', onClick: () => setOpenModal(MODAL_PRIVACY) },
        { label: 'Kullanım Koşulları', onClick: () => setOpenModal(MODAL_TERMS) },
        { label: 'İletişim', onClick: () => setOpenModal(MODAL_CONTACT) },
      ],
    },
  ]

  return (
    <>
      <footer className="mt-16 border-t border-line/60 bg-night-deep/90 backdrop-blur">
        {/* Üst kenar: kömür üstünde kontrollü bakır detay şeridi */}
        <div className="h-1 bg-[repeating-linear-gradient(-45deg,var(--color-copper)_0_14px,var(--color-coal)_14px_28px)]" />

        <div className="mx-auto grid max-w-[1600px] gap-12 px-6 py-12 lg:grid-cols-[1.2fr_2fr]">
          {/* Sol: marka, tanıtım, sosyal medya, dil */}
          <div className="flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-2">
              <Flame className="h-8 w-8" />
              <span className="font-display text-3xl font-extrabold tracking-tight text-cream">
                Rank<span className="text-fire">Hell</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-faded">
              RankHell, acımasız sıralamaların dünyasıdır. Puanla, oyla, tartış —
              burada her şey cehennem sırasına girer!
            </p>

            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <Button
                  key={s.label}
                  variant="icon-line"
                  size="sm"
                  aria-label={s.label}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </Button>
              ))}
            </div>

            <div>
              <p className="mb-2 text-sm text-faded/70">Diller</p>
              <Button variant="ghost" size="sm">
                TR <span className="font-normal text-faded/70">(Türkçe)</span>
              </Button>
            </div>
          </div>

          {/* Sağ: bağlantı sütunları */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="rounded-lg bg-coal p-2 text-copper-soft ring-1 ring-line">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                      {col.icon}
                    </svg>
                  </span>
                  <h3 className="font-display text-base font-bold uppercase tracking-wide text-cream">
                    {col.title}
                  </h3>
                </div>
                <ul className="space-y-2.5 text-sm">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.to ? (
                        <Link to={link.to} className={linkStyle}>
                          {link.label}
                        </Link>
                      ) : link.onClick ? (
                        <button type="button" className={linkStyle} onClick={link.onClick}>
                          {link.label}
                        </button>
                      ) : (
                        <button type="button" className={linkStyle}>
                          {link.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Alt bar: telif + yukarı çık */}
        <div className="border-t border-line/40">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-5">
            <p className="text-sm text-faded/70">
              © {new Date().getFullYear()} · RankHell · Tüm hakları saklıdır
            </p>
            <Button
              variant="icon"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Yukarı çık"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M12 5l-8 8 1.41 1.41L11 8.83V20h2V8.83l5.59 5.58L20 13z" />
              </svg>
            </Button>
          </div>
        </div>
      </footer>

      {/* ── Kullanım Koşulları Modalı ── */}
      <LegalModal
        open={openModal === MODAL_TERMS}
        onClose={() => setOpenModal(null)}
        title={TERMS_TITLE}
      >
        <TermsContent />
      </LegalModal>

      {/* ── Gizlilik Politikası Modalı ── */}
      <LegalModal
        open={openModal === MODAL_PRIVACY}
        onClose={() => setOpenModal(null)}
        title={PRIVACY_TITLE}
      >
        <PrivacyContent />
      </LegalModal>
      {/* ── İletişim Modalı ── */}
      <LegalModal
        open={openModal === MODAL_CONTACT}
        onClose={() => setOpenModal(null)}
        title="İletişim"
      >
        <p>Bize ulaşmak için aşağıdaki e-posta adresini kullanabilirsiniz:</p>
        <p>
          <a
            href="mailto:support@rankhell.com"
            className="footer-contact-email"
          >
            support@rankhell.com
          </a>
        </p>
      </LegalModal>
    </>
  )
}
