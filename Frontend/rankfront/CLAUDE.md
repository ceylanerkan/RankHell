# RankHell — Project Instructions

## Project identity

RankHell is a dark entertainment ranking and duel platform.

Its visual identity is based on:

- coal
- scorched metal
- controlled heat
- competition
- ranking
- industrial surfaces

The interface must feel deliberate, cohesive and professional.

Avoid:

- generic gaming interfaces
- excessive neon
- random accent colors
- excessive glow
- arbitrary gradients
- visually disconnected components
- generic AI-generated dashboard aesthetics

## Required design reference

Before making any frontend or visual change, read:

- `docs/DESIGN_SYSTEM.md`

All new and modified components must follow the current rules in that document.

Sections marked `LOCKED` must not be changed unless the user explicitly requests it.

Sections marked `PROVISIONAL` may evolve, but existing shared patterns must still be reused.

If a required component pattern is not defined:

1. Search for the closest existing component.
2. Follow its visual and interaction language.
3. Do not invent a disconnected design system.
4. Clearly report any assumption made.

## Color rules

Use only the centralized semantic color tokens defined by the project.

Do not introduce:

- new hex colors
- arbitrary RGB values
- arbitrary HSL or OKLCH values
- arbitrary Tailwind palette colors
- component-specific color palettes
- unapproved gradients

Do not place raw color values inside components when a project token exists.

Semantic color roles:

- Primary action and active state → Ember
- Warm secondary detail → Copper
- Ranking, reward and winner → Brass
- Neutral, passive and borders → Ash, Iron or Line
- Success → Moss
- Error and destructive action → Cinder Red
- Primary text → Cream
- Secondary text → Faded
- Backgrounds and surfaces → Night, Night Deep, Coal or Coal Light

If the current palette does not support a required state, do not create a new color without user approval.

Accent colors must have a semantic purpose. Do not use them only to make a component appear more decorative.

## Protected shader background

The existing shader background is a protected visual system.

Do not change its:

- colors
- gradients
- shader parameters
- animation
- opacity
- noise
- blur
- filters
- glow
- overlays
- background layers
- pseudo-elements

A global token change must not alter the existing shader appearance.

If a shared token change would affect the shader background, isolate the shader with its existing value instead of changing its appearance.

## Hero and navbar

The current hero and navbar structure is protected.

Unless explicitly requested, do not change their:

- layout
- spacing
- dimensions
- typography
- hierarchy
- component structure
- content
- animation behavior

Small color-token adjustments are allowed only when necessary for palette consistency.

Do not redesign the hero or navbar as part of an unrelated task.

## Component consistency

Before creating a new component:

1. Search for an existing component serving the same or a similar purpose.
2. Reuse existing shared components, tokens and variants.
3. Do not duplicate an existing button, card, badge, input or control pattern.
4. Keep hover, focus, active and disabled states consistent.
5. Prefer extending the shared component system over adding isolated styling.

Do not introduce one-off styling that cannot be reused or explained by the design system.

## Buttons — LOCKED (Damga v1)

Every button on the site goes through `src/components/ui/button/Button`
(`Button.jsx` + `button.css`). Do not style a raw `<button>`/`<a>`, and do not
write a new button style or a disconnected variant.

Variant decision tree:

- Landing/marketing showcase, single CTA on the page → `hero-primary`
- The view's primary action (vote, save, publish, submit) → `primary` (max 1 per view)
- The real secondary path next to the primary action → `secondary`
- In-card / toolbar / repeated, low-risk action → `ghost`
- Destructive, irreversible action → `danger` (always behind a confirmation step)
- Tight space, meaning is obvious → `icon` (`aria-label` required; use `icon-line` on busy/visual backgrounds)
- Inline / tertiary action → `link`

Rules:

- Async actions use the `loading` prop; no spinners.
- Colors come only from `button.css`'s `--btn-*` tokens (mapped to the shared
  palette); never override color for a single instance.
- Sizes: sm 32 / md 40 / lg 48. `hero-primary` uses its own 56px pill — that
  pill shape never appears on any other variant.
- For in-app navigation use `<Button as={Link} to=...>`, never a raw `<a>`
  (preserves SPA routing).
- The navbar is chrome: its `primary` (Kayıt Ol) is counted separately from
  page content and is exempt from the one-primary-per-view rule.
- When creating a new variant, do not modify or break the existing
  `primary`, `secondary`, `ghost`, `danger`, `icon`, `icon-line`, or `link` variants.

## Cards — PROVISIONAL

The card system is currently provisional.

Until it is marked as locked in `docs/DESIGN_SYSTEM.md`:

- every card goes through the `src/components/ui/Card.jsx` primitive (surface × behavior); see the "Kart Sistemi (Kor & Obsidyen)" section below plus `docs/design/card-system-decisions.md` and `docs/design/exceptions.md`
- do not create disconnected variants
- do not introduce new colors
- follow the closest existing pattern
- keep interaction states consistent
- avoid broad redesigns unless explicitly requested

## Scope discipline

Only change what the current task requires.

Do not perform unrelated:

- redesigns
- refactors
- dependency changes
- backend changes
- API changes
- file reorganizations
- naming migrations
- cleanup outside the requested scope

Do not modify unrelated areas merely to make them appear more consistent without approval.

## Validation

After frontend changes:

- run lint
- run build
- check for raw or unapproved colors
- verify responsive behavior
- verify hover, focus, active and disabled states
- confirm that the shader background was not affected
- confirm that unrelated components were not changed

At the end of each task, report:

- changed files
- important visual decisions
- lint and build results
- assumptions
- unresolved design decisions
- whether protected areas were affected

## Component Customization Rules

* When adding new features, use existing design system components first.
* Modify existing global variants only when a global change is explicitly requested.
* Do not apply a visual change requested for a specific section to other usages.
* For local changes, preserve the existing component and use either a dedicated variant or a limited local override.
* Add reusable custom designs to the design system as new variants.
* Keep designs intended for a single use local to the relevant component.
* Custom variants must preserve the base button dimensions, typography, accessibility states, and overall brand language.
* For the button variant list and which existing variants must not be broken, see "Buttons — LOCKED (Damga v1)" above.

## Kart Sistemi (Kor & Obsidyen)

Kaynak: `docs/design/card-system.html` (föy) ve `docs/design/card-system-decisions.md` (kararlar — çelişkide bu kazanır). İstisnalar: `docs/design/exceptions.md` (sisteme çekilmeyen bileşenler ve gerekçeleri). Emin değilsen önce bunları oku, uydurma.

**Sözleşme:** Her kart `src/components/ui/Card.jsx` primitive'inden türer:
`surface: neutral | raised | ticket` × `behavior: static | interactive | navigation | selectable | disabled`.
Behavior her zaman açık yazılır. `selected` yalnızca `selectable` ile. Alt bileşenler görünüm kuralı (border, radius, shadow, hover) yazmaz — kural Card.jsx + card.css'te yaşar. Token'lar `src/index.css` @theme'de; yeni token üretilmez.

**İhlal edilemez kurallar:**
- Radius tavanı 8px. `rounded-xl` ve üzeri kart bağlamında yasak. İç katman = dış − 4.
- Blur, glow, scale, hover'da yukarı kalkma yasak. Glow yalnızca primary buton + aktif düello kartında.
- Ember marker (sol 2px şerit) yalnızca interactive / navigation / selectable'da. Static ve disabled sinyal olarak kor göstermez; kor veri olarak (önde giden yüzde, bar) serbest.
- Kart başına tek kor. Brass tıklanabilir öğede kullanılmaz.
- Disabled: solid `--color-line` kenar. Kesikli kenar yalnızca dropzone / boş yuva / placeholder.
- Ticket yüzeyi: yalnızca oy/sonuç kartları ve navigation whitelist'i (ItemCard, "daha fazlası"). Auth, form, profil satırı, bilgi panelinde asla. `ticket+selectable` yasak (uyar + static'e düş). Sayfa başına tek bilet ailesi.
- Semantik: navigation = react-router Link, interactive/selectable = button, static/disabled = div. İç içe tıklanabilir öğe üretme; içinde buton taşıyan kart static kalır.
- Zemin: neutral=coal, raised/ticket=coal-light. Raised hover'da zemin DEĞİŞMEZ (sinyal: kenar line→iron + e-1 + marker); yeni ara kademe türetilmez.
- `--color-cinder` tehlike VE negatif delta/trend içindir (hata, yıkıcı aksiyon, ▼ düşüş). Kenar/yapı/kategori/dekorasyon için asla; yapı rolü line/iron/faded'dadır.
- `focus-visible`: etkileşimli davranışlarda 2px ember outline, offset 2. `outline:none` yazılmaz.
- Yeni renk/token üretme; yalnızca src/index.css @theme token'ları. Buton sistemine ve palet hex'lerine dokunma.
- Hata felsefesi: geçersiz kombinasyon asla render'ı kırmaz — dev'de console.warn/error basar, güvenli davranışa düşer.
- Sistem dışı bileşenler (DuelWidget, PodiumSpot, "Kendi arenanı kur" banner'ı, TierList satırları, navbar/footer bantları, toast/modal) sisteme çekilmez; listeye yazılmamış istisna üretilmez.
- card.css @layer components'tadır; tüketici layout utility'leri kart kökünde geçerlidir. Görünüm kuralı yine yalnızca Card'da yazılır.
