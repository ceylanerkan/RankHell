/**
 * RankHell — Damga v1 · Button
 * ----------------------------------------------------------------
 * TEK KAPI: sitedeki her buton bu komponentten geçer.
 * Ham <button>/<a> stillenmez, yeni buton stili yazılmaz.
 *
 * Stil dosyası: ./button.css
 * (src/index.css'e @import ile global bağlandı — bkz. migrasyon planı,
 *  Adım 1. Fontlar button.css içinde --font-sans / --font-display
 *  tokenlarından gelir; site genelinde Space Grotesk + Bricolage yüklü.)
 *
 * Kullanım:
 *   <Button variant="primary" size="lg" onClick={vote}>Oy ver</Button>
 *   <Button variant="hero-primary" href="/kesfet">Keşfetmeye Başla</Button>
 *   <Button variant="icon" aria-label="Ara"><SearchIcon /></Button>
 *   <Button variant="link" arrow href="/oylar">Tüm oyları incele</Button>
 *   <Button variant="danger" loading={deleting} onClick={confirmDelete}>Sil</Button>
 *
 * Router içi navigasyonda ham <a> yerine as={Link} + to kullan (SPA nav korunur):
 *   <Button variant="primary" as={Link} to="/polls/new">Yeni Anket</Button>
 */

import { forwardRef } from 'react';

const VARIANT_CLASS = {
  'hero-primary': 'rh-btn rh-hero',
  primary: 'rh-btn rh-primary',
  secondary: 'rh-btn rh-secondary',
  ghost: 'rh-btn rh-ghost',
  danger: 'rh-btn rh-danger',
  icon: 'rh-btn rh-ghost rh-icon',
  'icon-line': 'rh-btn rh-icon rh-icon--line',
  link: 'rh-link',
};

const SIZE_CLASS = { sm: 'sz-sm', md: '', lg: 'sz-lg' };

/* — Yerleşik ikonlar (çizgi, emoji yok) — */
function FlameIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function ArrowIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/**
 * @param {object} props
 * @param {'hero-primary'|'primary'|'secondary'|'ghost'|'danger'|'icon'|'icon-line'|'link'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']  link ve hero-primary boyut skalasına girmez
 * @param {boolean} [props.loading=false]     spinner değil: alt kenarda kor çizgisi + aria-busy
 * @param {boolean} [props.fullWidth=false]   mobil form altları için
 * @param {boolean} [props.arrow=false]       sadece link: ileri götüren ok
 * @param {import('react').ReactNode} [props.coinIcon]  sadece hero-primary: paranın ön yüzü (varsayılan: alev)
 * @param {string}  [props.href]              verilirse <a> olarak render edilir
 * @param {any}     [props.as]                polimorfik tag (ör. react-router Link); SPA nav için, `to` prop'u geçilir
 */
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    arrow = false,
    coinIcon,
    href,
    as,
    className = '',
    children,
    onClick,
    disabled = false,
    type,
    ...rest
  },
  ref
) {
  const isLink = variant === 'link';
  const isHero = variant === 'hero-primary';
  // as: polimorfik tag (ör. react-router Link) — SPA navigasyonu korunur.
  // Verilmezse: href varsa ham <a>, yoksa <button>.
  const Tag = as ?? (href ? 'a' : 'button');
  const isNativeButton = Tag === 'button';

  if (import.meta.env.DEV) {
    if ((variant === 'icon' || variant === 'icon-line') && !rest['aria-label']) {
      console.warn('[Button] icon varyantı aria-label olmadan kullanılamaz — Damga v1 kuralı.');
    }
    if (!VARIANT_CLASS[variant]) {
      console.warn(`[Button] bilinmeyen varyant "${variant}", primary'e düşüldü.`);
    }
  }

  const cls = [
    VARIANT_CLASS[variant] ?? VARIANT_CLASS.primary,
    !isLink && !isHero ? SIZE_CLASS[size] ?? '' : '',
    loading ? 'is-loading' : '',
    fullWidth ? 'rh-btn--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <Tag
      ref={ref}
      href={href}
      type={isNativeButton ? type ?? 'button' : undefined}
      className={cls}
      disabled={isNativeButton ? disabled || undefined : undefined}
      aria-disabled={!isNativeButton && disabled ? true : undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
      {...rest}
    >
      {isHero && (
        <span className="coin" aria-hidden="true">
          <span className="face">{coinIcon ?? <FlameIcon />}</span>
          <span className="face back">
            <ArrowIcon />
          </span>
        </span>
      )}
      {children}
      {isLink && arrow && (
        <span className="arr" aria-hidden="true">
          <ArrowIcon size={14} />
        </span>
      )}
    </Tag>
  );
});

export default Button;
export { FlameIcon, ArrowIcon };
