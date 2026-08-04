import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/client'
import Button from '../components/ui/button/Button'
import Card from '../components/ui/Card'
import LegalModal from '../components/ui/LegalModal'
import { TermsContent, PrivacyContent, TERMS_TITLE, PRIVACY_TITLE } from '../lib/legalContent'

/* ── Hukuki metin kimlikleri ────────────────────────────────────── */
const MODAL_TERMS = 'terms'
const MODAL_PRIVACY = 'privacy'

export default function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  /* ── Onay kutucukları ───────────────────────────────────────── */
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)

  /* ── Modal durumu ───────────────────────────────────────────── */
  const [openModal, setOpenModal] = useState(null) // null | 'terms' | 'privacy'
  const closeModal = useCallback(() => setOpenModal(null), [])

  const canSubmit = acceptedTerms && acceptedPrivacy

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    // Backend validasyon kurallarının aynısı (User entity)
    if (username.trim().length < 3 || username.trim().length > 50)
      return setError('Kullanıcı adı 3-50 karakter arası olmalı')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Geçerli bir e-posta gir')
    if (password.length < 8) return setError('Şifre en az 8 karakter olmalı')

    setSubmitting(true)
    try {
      await register({ username: username.trim(), email, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <>
      <Card surface="raised" behavior="static" padding="spacious" className="mx-auto max-w-sm">
        <form onSubmit={handleSubmit}>
          <h1 className="mb-6 font-display text-2xl font-extrabold text-cream">Kayıt Ol</h1>

          <label className="mb-1 block text-sm font-semibold text-cream/90">Kullanıcı adı</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="3-50 karakter"
            className="input-dark mb-4"
          />

          <label className="mb-1 block text-sm font-semibold text-cream/90">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@mail.com"
            className="input-dark mb-4"
          />

          <label className="mb-1 block text-sm font-semibold text-cream/90">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="En az 8 karakter"
            className="input-dark mb-4"
          />

          {/* ── Onay kutucukları ───────────────────────────────── */}
          <div className="mb-4 mt-2">
            {/* Kullanım koşulları */}
            <div className="register-consent-row">
              <input
                id="consent-terms"
                type="checkbox"
                className="register-consent-checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <label htmlFor="consent-terms" className="register-consent-label">
                <span
                  role="button"
                  tabIndex={0}
                  className="register-consent-trigger"
                  onClick={() => setOpenModal(MODAL_TERMS)}
                  onKeyDown={(e) => e.key === 'Enter' && setOpenModal(MODAL_TERMS)}
                >KULLANIM KOŞULLARI VE ÜYELİK SÖZLEŞMESİ</span>{' '}'ni okudum ve kabul ediyorum.
              </label>
            </div>

            {/* KVKK / Gizlilik politikası */}
            <div className="register-consent-row">
              <input
                id="consent-privacy"
                type="checkbox"
                className="register-consent-checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
              />
              <label htmlFor="consent-privacy" className="register-consent-label">
                <span
                  role="button"
                  tabIndex={0}
                  className="register-consent-trigger"
                  onClick={() => setOpenModal(MODAL_PRIVACY)}
                  onKeyDown={(e) => e.key === 'Enter' && setOpenModal(MODAL_PRIVACY)}
                >KİŞİSEL VERİLERİN KORUNMASI VE GİZLİLİK POLİTİKASI (KVKK AYDINLATMA METNİ)</span>{' '}'ni okudum ve onaylıyorum.
              </label>
            </div>
          </div>

          {error && <p className="mb-4 text-sm text-cinder-soft">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={submitting}
            disabled={!canSubmit}
          >
            Kayıt Ol
          </Button>

          <p className="mt-4 text-center text-sm text-faded">
            Zaten hesabın var mı?{' '}
            <Button variant="link" as={Link} to="/login">
              Giriş yap
            </Button>
          </p>
        </form>
      </Card>

      {/* ── Kullanım Koşulları Modalı ────────────────────────────── */}
      <LegalModal
        open={openModal === MODAL_TERMS}
        onClose={closeModal}
        title={TERMS_TITLE}
      >
        <TermsContent />
      </LegalModal>

      {/* ── KVKK / Gizlilik Politikası Modalı ───────────────────── */}
      <LegalModal
        open={openModal === MODAL_PRIVACY}
        onClose={closeModal}
        title={PRIVACY_TITLE}
      >
        <PrivacyContent />
      </LegalModal>
    </>
  )
}
