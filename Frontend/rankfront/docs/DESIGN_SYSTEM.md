# RankHell Design System

This document is the source of truth for RankHell’s visual language.

## Status labels

- `LOCKED`: Approved and must not change without an explicit request
- `PROVISIONAL`: Currently in use but may still be revised
- `UNDEFINED`: No final standard has been selected

---

## 1. Visual direction — LOCKED

RankHell uses a dark industrial visual language based on:

- coal
- scorched metal
- controlled heat
- ranking
- competition
- restrained mechanical details

The interface should feel deliberate, dense and professional rather than loud or generically futuristic.

Avoid:

- generic gaming UI
- excessive neon
- cyberpunk cyan or purple
- fluorescent green
- multiple competing accent colors
- large uncontrolled glow effects
- random decorative gradients
- components that look unrelated to each other
- generic AI-generated dashboard patterns

The primary visual formula is:

**dark coal surfaces + cream typography + controlled warm accents**

---

## 2. Color system — LOCKED

Only the following approved color tokens may be used.

### Background and surfaces

| Token | Color |
|---|---|
| Night | `#121212` |
| Night Deep | `#0B0B0D` |
| Coal | `#1A1A1D` |
| Coal Light | `#26262B` |
| Line | `#2E2E33` |

### Text

| Token | Color |
|---|---|
| Cream | `#F2F2EF` |
| Faded | `#A6A6B0` |

### Brand and primary action

| Token | Color |
|---|---|
| Ember | `#D94A1A` |
| Ember Soft | `#E86A3A` |
| Ember Deep | `#8F2F14` |
| Flame | `#F08A2A` |

### Warm secondary detail

| Token | Color |
|---|---|
| Copper | `#A8643A` |
| Copper Soft | `#C17A4D` |
| Copper Deep | `#694027` |

### Reward and ranking

| Token | Color |
|---|---|
| Brass | `#B9913F` |
| Brass Soft | `#D1B267` |
| Brass Deep | `#705725` |

### Neutral metal

| Token | Color |
|---|---|
| Ash | `#8B8883` |
| Ash Deep | `#66635F` |
| Iron | `#3A3938` |

### Success

| Token | Color |
|---|---|
| Moss | `#74945A` |
| Moss Soft | `#91AD72` |
| Moss Deep | `#435936` |

### Danger and destructive actions

| Token | Color |
|---|---|
| Cinder Red | `#D64535` |
| Cinder Soft | `#EF6655` |
| Cinder Deep | `#7A241C` |

### Semantic usage hierarchy

1. Ember — primary action and active state
2. Copper — warm secondary detail
3. Brass — reward, ranking and winner
4. Ash, Iron and Line — neutral and passive interface
5. Moss — success and confirmation only
6. Cinder Red — error, danger and destructive actions only

### Color restrictions

Do not use:

- `#FF3B5C`
- `#00FFFF`
- electric purple
- cyber cyan
- fluorescent green
- arbitrary Tailwind colors
- new raw colors without approval

Do not use Ember for every visual detail.

Ember should primarily appear in:

- primary CTA
- selected state
- active state
- strong focus
- essential brand emphasis

Use Copper for warm secondary details.

Use Brass only when the interface communicates:

- ranking
- reward
- winner
- achievement
- premium hierarchy

Use Line, Iron and Ash for most borders, passive icons and neutral controls.

---

## 3. Color balance — LOCKED

The interface should remain predominantly dark and neutral.

Approximate visual balance:

- 70–75% dark backgrounds and surfaces
- 15–20% text and neutral metal colors
- approximately 5% Ember
- approximately 2% Copper
- approximately 2% Brass
- approximately 1% semantic success and danger colors

These values are visual guidance, not strict code-level calculations.

Avoid using Ember simultaneously in:

- heading
- border
- icon
- glow
- button
- decorative line

within the same small component unless there is a clear hierarchy reason.

---

## 4. Cards — PROVISIONAL

The final card system has not yet been approved.

Until it is finalized:

- Prefer Coal or Coal Light surfaces.
- Use Line or Iron for standard borders.
- Do not give every card an Ember border.
- Do not use accent glow on ordinary cards.
- Use accent colors only for meaningful state or hierarchy.
- New cards should follow the closest existing card pattern.
- Avoid creating multiple unrelated card silhouettes.
- Neutral cards should remain visually quiet.

Final decisions still required:

- surface hierarchy
- border radius
- internal padding
- card header structure
- footer structure
- hover behavior
- interactive card treatment
- selected state
- winner variant
- ranking variant
- disabled state
- media placement

When the card system is approved, replace `PROVISIONAL` with `LOCKED` and document exact values and variants.

---

## 5. Shader background — LOCKED

The current shader background must remain unchanged unless explicitly requested.

Do not modify its:

- colors
- gradients
- animation
- shader parameters
- blur
- noise
- opacity
- glow
- overlays
- pseudo-elements
- background layers

Changes to the shared color system must not alter the shader’s existing appearance.

---

## 6. Hero and navbar — LOCKED STRUCTURE

The current hero and navbar are structurally approved.

The following properties are protected:

- layout
- spacing
- dimensions
- typography
- hierarchy
- content structure
- animation behavior

Small color-token adjustments are allowed only when required for palette consistency.

Do not redesign these sections as part of an unrelated component task.

---

## 7. Interaction states — PROVISIONAL

All interactive components should define:

- default
- hover
- focus-visible
- active
- disabled

Focus indicators must remain visible and accessible.

Do not use obsolete cyan focus colors.

Use semantic project tokens and maintain sufficient contrast against dark surfaces.

---

## 8. Pending decisions

The following systems are not yet finalized:

- button component system
- card component system
- input and form controls
- badge variants
- modal surfaces
- dropdown and popover surfaces
- toast and notification styling
- tables and ranking rows
- tooltips
- empty states
- loading and skeleton states

Until these systems are finalized, reuse the closest existing component and avoid inventing an independent visual language.
