# Matiks — Design Language & Animation System

> This document defines the visual identity, animation principles, and component-level styling guidelines for the Score Reveal screen. Every design decision should feel consistent with Matiks: **energetic, clean, precision-competitive, and rewarding**.

---

## Brand Identity

Matiks positions itself as **mental math as esport** — think chess meets a quiz show, built for sharp competitive minds. The app is described by its own users as *"clean, smooth, and really enjoyable"* — not loud or cluttered. The visual language should reflect:

- **Arena energy** — dark backgrounds that make scores glow
- **Precision** — clean type, intentional spacing, no decoration for decoration's sake
- **Reward** — animations that feel *earned*, not gratuitous
- **Speed** — snappy spring physics, not floaty/laggy transitions

---

## Color Palette

```ts
// constants/theme.ts

export const Colors = {
  // Backgrounds
  backgroundDeep:   '#0D0E1A',   // Near-black with blue tint — arena darkness
  backgroundCard:   '#161828',   // Slightly lighter — card surfaces
  backgroundGlass:  '#1E2038',   // Glass-card fill (with opacity)

  // Brand primaries — electric, competitive
  brandPrimary:     '#6C63FF',   // Electric violet — Matiks signature
  brandSecondary:   '#FF6B6B',   // Warm coral-red — energy, streaks, fire
  brandAccent:      '#FFD166',   // Golden amber — rank, achievement, shimmer

  // Semantic
  scoreGold:        '#F4C430',   // Score number color — gold like a trophy
  comboBadgeBg:     '#2A1A0E',   // Dark amber bg for combo badge
  comboBadgeBorder: '#FF6B35',   // Fiery orange border
  rankBlue:         '#4FC3F7',   // Cool blue for rank text

  // Neutrals
  textPrimary:      '#F0F0FF',   // Soft white with purple tint
  textSecondary:    '#8B8FA8',   // Muted — labels, sublabels
  textMuted:        '#4A4E6B',   // Very muted — separators, borders

  // Share button
  shareButtonBg:    '#6C63FF',   // Primary violet
  shareButtonShimmer: 'rgba(255, 255, 255, 0.25)',  // Shimmer overlay

  // Confetti colors (Skia bonus)
  confetti: [
    '#6C63FF',  // violet
    '#FF6B6B',  // coral
    '#FFD166',  // gold
    '#06D6A0',  // mint-green
    '#118AB2',  // steel-blue
    '#FF9F1C',  // bright orange
  ],
};
```

---

## Typography

```ts
// constants/theme.ts (continued)

export const Typography = {
  // Score number — hero element, must feel BIG and impactful
  scoreValue: {
    fontSize: 72,
    fontWeight: '800' as const,
    letterSpacing: -2,
    color: Colors.scoreGold,
    fontFamily: 'System',    // Use system font — bold weight reads best
  },

  // Score label
  scoreLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    color: Colors.textSecondary,
  },

  // Combo badge text
  comboBadge: {
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    color: Colors.textPrimary,
  },

  // Rank primary
  rankPrimary: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.rankBlue,
    letterSpacing: -1,
  },

  // Rank label
  rankLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },

  // Share button
  shareButton: {
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: 1,
    color: '#FFFFFF',
  },
};
```

---

## Spacing System

```ts
// constants/theme.ts (continued)

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  sm:  8,
  md:  12,
  lg:  20,
  xl:  28,
  pill: 999,
};
```

---

## Animation System

```ts
// constants/animation.ts

import { Easing } from 'react-native-reanimated';

// ─── Spring Configs ────────────────────────────────────────────────

export const Springs = {
  // Snappy — for score overshoot and badge entry
  // Overshoots slightly before settling. Feels satisfying, competitive.
  snappy: {
    damping: 12,
    stiffness: 180,
    mass: 1,
  },

  // Bouncy — for combo badge scale (0 → 1.15 → 1.0)
  bouncy: {
    damping: 8,
    stiffness: 200,
    mass: 0.8,
  },

  // Gentle — for rank slide-up (graceful reveal, not jarring)
  gentle: {
    damping: 18,
    stiffness: 120,
    mass: 1,
  },

  // Press feedback — fast spring for button press
  press: {
    damping: 20,
    stiffness: 400,
    mass: 0.6,
  },
};

// ─── Timing / Easing ───────────────────────────────────────────────

export const Timing = {
  // Score counter total duration
  scoreCount: 2000,

  // Badge entry
  badgeEntry: 350,

  // Rank reveal
  rankReveal: 500,

  // Shimmer sweep — one full pass across button
  shimmerCycle: 1600,

  // Flame pulse cycle
  flamePulse: 900,

  // Stagger between score complete → rank reveal
  rankStagger: 200,

  // Press scale-down duration
  pressDown: 80,
  pressUp: 200,
};

export const Easings = {
  // Used for score counter — ease-out so early digits fly fast, last ones slow
  scoreCount: Easing.out(Easing.cubic),

  // Shimmer linear sweep
  shimmer: Easing.linear,

  // Rank fade-in
  rankFade: Easing.out(Easing.quad),
};
```

---

## Layout Principles

### Screen Layout (Score Reveal)

```
┌─────────────────────────────────┐
│                                 │
│   MATIKS LOGO / HEADER          │  — top 15% — branding context
│                                 │
│         ┌──────────────┐        │
│         │  2840        │        │  — center stage — SCORE (hero)
│         │  YOUR SCORE  │        │
│         └──────────────┘        │
│                                 │
│      🔥 7 Combo Streak!         │  — badge below score
│                                 │
│         ┌──────────────┐        │
│         │  #3 of 1,200 │        │  — rank card (slides in)
│         └──────────────┘        │
│                                 │
│      [ Share Result → ]         │  — CTA at bottom
│                                 │
└─────────────────────────────────┘
```

**Rules**:
- Score number is the visual anchor — everything else orbits it
- Dark background makes score glow (don't fight the contrast)
- Keep vertical rhythm: `Spacing.xl` between each card section
- No horizontal padding smaller than `Spacing.lg` (24px)

---

## Component-Level Design Specs

### ScoreCounter

- Number text: `Typography.scoreValue` — 72px, 800 weight, gold
- Label below: `"YOUR SCORE"` — `Typography.scoreLabel`
- Optional subtle glow: `textShadowColor: Colors.scoreGold, textShadowRadius: 20`

### ComboStreakBadge

- Container: pill shape (`BorderRadius.pill`), background `Colors.comboBadgeBg`, border `1.5px solid Colors.comboBadgeBorder`
- Padding: `Spacing.sm` vertical, `Spacing.lg` horizontal
- Flame emoji font size: `24` (slightly bigger than badge text)
- Text: `Typography.comboBadge`
- **Do not** put glow on the badge itself — the flame provides the energy

### RankReveal

- Card: `BorderRadius.lg`, background `Colors.backgroundCard`, border `1px solid Colors.textMuted`
- Rank number: `Typography.rankPrimary` — steel blue, 32px
- Label: `"RANK"` — `Typography.rankLabel`
- Subtle separator line between rank number and "of 1,200"

### ShareButton

- Height: `56px`, full `BorderRadius.pill`
- Background: `Colors.shareButtonBg` (violet)
- Shimmer: absolutely positioned `View`, width `60px`, skewed `rotateZ('20deg')`, opacity `0.25–0.35`
- Arrow icon `→` after text (use emoji or vector, not a library)
- Shadow: `elevation: 8` on Android, `boxShadow`-equivalent on iOS

---

## Animation Design Principles

### 1. Earn the animation
Every animation should make the user feel something — score ticking up creates anticipation, badge bounce rewards combo play, rank reveal gives context, shimmer invites sharing. No animation is decorative without purpose.

### 2. Physics over tweens
Prefer `withSpring` over `withTiming` wherever something is "snapping into place". Springs feel alive; linear timing feels like a PowerPoint. Use `withTiming` only for things that should feel mechanical (counter, shimmer sweep).

### 3. Overshoot = satisfaction
The score counter going slightly past the final number before springing back mirrors the psychology of achievement — you momentarily exceed the target before it settles. This is intentional.

### 4. Staggering creates narrative
The deliberate 200ms stagger between score completing and rank revealing tells a story: *first you learn your score, THEN you learn where you stood*. This sequencing builds emotional impact.

### 5. Looping animations must be subtle
Flame pulse and shimmer both loop forever. They must be subtle enough to not distract from the primary content. If a user can't stop looking at the loop instead of reading the score — it's too strong. Reduce opacity or scale amplitude.

### 6. UI thread is non-negotiable
All animations run on the UI thread. `setState` never happens inside `runOnWorklet`. The only exception: `runOnJS` for triggering `onComplete` callback or `Haptics`. This is both a technical requirement and a quality bar — UI thread animations never jank.

---

## Do's and Don'ts

| ✅ Do | ❌ Don't |
|---|---|
| Use dark background — score should glow | Use white/light backgrounds — kills the energy |
| Spring physics for interactive elements | Linear tweens for "snapping" elements |
| Gold for score, blue for rank — distinct reads | Use the same color for multiple data points |
| Tight letter-spacing on big numbers | Default loose spacing — kills typographic precision |
| Subtle shimmer that rewards attention | Blinking/flashing animations that feel like ads |
| `withRepeat` with `reverse: true` for pulse | Abrupt loop restarts — must feel continuous |
| Haptic feedback on share press | Sound effects (not in scope, and jarring) |
| Keep Badge border fiery (orange) | Generic grey borders — kills the combo energy |