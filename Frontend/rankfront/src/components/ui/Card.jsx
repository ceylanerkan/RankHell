/**
 * RankHell — Kart Sistemi v1 · Card
 * ----------------------------------------------------------------
 * TEK KAPI: sitedeki her kart bu komponentten geçer.
 * Görünüm kuralları Card.jsx + ./card.css ikilisinde yaşar — alt
 * bileşenler kart görünümü (border/radius/hover/shadow) yazmaz.
 *
 * Sözleşme (docs/design/card-system.html + card-system-decisions.md):
 *   surface  × behavior — her kart ikisini birlikte alır.
 *   navigation → react-router <Link>, interactive/selectable → <button>,
 *   static/disabled → <div>. İç içe tıklanabilir öğe üretilmez: içinde
 *   buton taşıyan kart static kalmalı (kullanım kuralı, primitive
 *   bunu zorlamaz).
 *
 * Kullanım:
 *   <Card surface="raised" behavior="interactive" onClick={vote}>...</Card>
 *   <Card surface="neutral" behavior="navigation" to="/polls/1" padding="compact">...</Card>
 *   <Card surface="raised" behavior="selectable" selected={picked} onClick={toggle}>...</Card>
 *   <Card surface="ticket">
 *     <Card.Body>...</Card.Body>
 *     <Card.Perf />
 *     <Card.Stub>...</Card.Stub>
 *   </Card>
 */

import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const SURFACES = ['neutral', 'raised', 'ticket'];
const BEHAVIORS = ['static', 'interactive', 'navigation', 'selectable', 'disabled'];
const PADDINGS = ['compact', 'default', 'spacious'];

const Card = forwardRef(function Card(
  {
    surface = 'neutral',
    behavior = 'static',
    padding = 'default',
    selected,
    to,
    className = '',
    children,
    ...rest
  },
  ref
) {
  if (import.meta.env.DEV) {
    if (!SURFACES.includes(surface)) {
      console.warn(`[Card] bilinmeyen surface "${surface}", neutral'e düşüldü.`);
      surface = 'neutral';
    }
    if (!BEHAVIORS.includes(behavior)) {
      console.warn(`[Card] bilinmeyen behavior "${behavior}", static'e düşüldü.`);
      behavior = 'static';
    }
    if (!PADDINGS.includes(padding)) {
      console.warn(`[Card] bilinmeyen padding "${padding}", default'a düşüldü.`);
      padding = 'default';
    }
    if (surface === 'ticket' && behavior === 'selectable') {
      console.error('[Card] ticket+selectable reddedilir — static\'e düşüldü.');
      behavior = 'static';
    }
    if (surface === 'ticket' && behavior === 'navigation') {
      console.warn(
        '[Card] ticket+navigation whitelist dışında kullanılıyor olabilir — yalnızca ItemCard, kategori kutucuğu, "daha fazlası" kartı için izinli (card-system-decisions.md KARAR 3).'
      );
    }
    if (selected !== undefined && behavior !== 'selectable') {
      console.warn('[Card] "selected" yalnızca behavior="selectable" ile geçerli, yok sayıldı.');
    }
    if (to !== undefined && behavior !== 'navigation') {
      console.warn('[Card] "to" yalnızca behavior="navigation" ile geçerli, yok sayıldı.');
    }
    if (behavior === 'navigation' && to === undefined) {
      console.warn('[Card] behavior="navigation" için "to" prop\'u gerekli.');
    }
  }

  const isSelectable = behavior === 'selectable';
  const isNavigation = behavior === 'navigation' && to !== undefined;
  const isButton = behavior === 'interactive' || isSelectable;

  const cls = [
    'rh-card',
    `rh-card--s-${surface}`,
    `rh-card--b-${behavior}`,
    `rh-card--p-${padding}`,
    isSelectable && selected ? 'is-selected' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (isNavigation) {
    return (
      <Link ref={ref} to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  if (isButton) {
    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        aria-pressed={isSelectable ? Boolean(selected) : undefined}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      ref={ref}
      className={cls}
      aria-disabled={behavior === 'disabled' ? true : undefined}
      {...rest}
    >
      {children}
    </div>
  );
});

function CardBody({ className = '', children, ...rest }) {
  return (
    <div className={['rh-card-body', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

function CardPerf({ className = '', ...rest }) {
  return <hr className={['rh-card-perf', className].filter(Boolean).join(' ')} {...rest} />;
}

function CardStub({ className = '', children, ...rest }) {
  return (
    <div className={['rh-card-stub', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

Card.Body = CardBody;
Card.Perf = CardPerf;
Card.Stub = CardStub;

export default Card;
