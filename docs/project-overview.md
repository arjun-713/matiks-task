# Matiks — Animated Score Reveal & Combo Streak UI
## Project Overview & Phased Build Plan

> **Assignment**: Post-game score reveal screen for Matiks multiplayer math duels  
> **Stack**: React Native (Expo) · Reanimated 3 · TypeScript  
> **Time Budget**: 3–4 hours  
> **Bonus**: @shopify/react-native-skia confetti burst

---

## Project Structure

```
matiks-score-reveal/
├── app/
│   └── index.tsx                  # Entry point — renders ScoreRevealScreen
├── components/
│   ├── ScoreCounter.tsx           # Phase 1 — animated number tick-up
│   ├── ComboStreakBadge.tsx       # Phase 2 — bounce-in badge + flame pulse
│   ├── RankReveal.tsx             # Phase 3 — slide-up + fade rank card
│   ├── ShareButton.tsx            # Phase 4 — shimmer CTA + press feedback
│   └── ConfettiCanvas.tsx         # Bonus — Skia particle burst
├── screens/
│   └── ScoreRevealScreen.tsx      # Orchestrates all phases + sequencing
├── hooks/
│   └── useAnimationSequence.ts    # Shared timing/sequencing logic
├── constants/
│   ├── theme.ts                   # Colors, spacing, typography tokens
│   └── animation.ts               # Spring configs, durations, easings
├── docs/
│   ├── project-overview.md        # This file
│   ├── design-language.md         # Visual & animation design system
│   └── tech-references.md         # All docs links for AI/dev reference
└── assets/
    └── fonts/                     # Any custom fonts used
```

---

## Phased Implementation Plan

### Phase 0 — Project Bootstrap *(~15 min)*

**Goal**: Get Expo running with Reanimated 3 correctly configured.

**Tasks**:
- [ ] `npx create-expo-app matiks-score-reveal --template blank-typescript`
- [ ] Install dependencies:
  ```bash
  npx expo install react-native-reanimated expo-haptics
  # Bonus only:
  npx expo install @shopify/react-native-skia
  ```
- [ ] Configure `babel.config.js` with Reanimated plugin (must be **last** plugin)
- [ ] Set up `constants/theme.ts` with Matiks brand tokens
- [ ] Set up `constants/animation.ts` with reusable spring/timing configs
- [ ] Scaffold all component files with empty exports

**Exit Criteria**: `npx expo start` runs, blank screen renders on device/emulator.

---

### Phase 1 — Score Counter Animation *(~35 min)*

**Component**: `components/ScoreCounter.tsx`

**What to build**:
- Animated number that ticks from `0` → `finalScore` (e.g. `2840`)
- Uses a `useSharedValue` driven by `withTiming` to interpolate display value
- "Overshoot" effect: animate to `finalScore * 1.08`, then spring back to `finalScore`
- Display value derived with `useDerivedValue` → formatted with `useAnimatedProps` on a Text node (use `react-native-reanimated`'s `AnimatedText` approach via `createAnimatedComponent`)
- Trigger a callback (`onComplete`) when counter finishes — used to sequence Phase 3

**Key Reanimated APIs used**:
- `useSharedValue`, `useDerivedValue`
- `withTiming`, `withSequence`, `withSpring`
- `runOnJS` (only for the `onComplete` callback — no setState in animation callbacks)

**Props interface**:
```ts
interface ScoreCounterProps {
  finalScore: number;       // e.g. 2840
  duration?: number;        // default 2000ms
  onComplete?: () => void;  // fires when counter finishes
}
```

**Exit Criteria**: Number animates smoothly from 0→2840 with visible overshoot and spring-back. `onComplete` fires reliably.

---

### Phase 2 — Combo Streak Badge *(~30 min)*

**Component**: `components/ComboStreakBadge.tsx`

**What to build**:
- Badge showing `🔥 7 Combo Streak!`
- **Entry animation**: scale `0 → 1.15 → 1.0` using `withSequence(withSpring(1.15), withSpring(1.0))`
- **Flame pulse**: separate `useSharedValue` on the emoji — looping `scale + opacity` oscillation using `withRepeat(withSequence(...))`
- Badge should animate in ~300ms after screen mounts (use `withDelay`)

**Key Reanimated APIs used**:
- `useSharedValue`, `useAnimatedStyle`
- `withSpring`, `withSequence`, `withRepeat`, `withTiming`, `withDelay`

**Props interface**:
```ts
interface ComboStreakBadgeProps {
  comboCount: number;       // e.g. 7
  visible?: boolean;        // controls entry trigger
}
```

**Exit Criteria**: Badge bounces in with spring, flame emoji visibly pulses on loop in a natural "breathing" rhythm.

---

### Phase 3 — Rank Reveal *(~25 min)*

**Component**: `components/RankReveal.tsx`

**What to build**:
- Shows: `#3 of 1,200 players`
- Entry: slides up from `translateY: +60` → `0` simultaneously with `opacity: 0 → 1`
- Must be **staggered 200ms after Phase 1's `onComplete`** fires
- Use `withDelay(200, withSpring(...))` or trigger via a shared boolean ref from parent

**Key Reanimated APIs used**:
- `useSharedValue`, `useAnimatedStyle`
- `withSpring`, `withTiming`, `withDelay`

**Props interface**:
```ts
interface RankRevealProps {
  rank: number;             // e.g. 3
  totalPlayers: number;     // e.g. 1200
  shouldReveal: boolean;    // set to true by ScoreCounter's onComplete
}
```

**Exit Criteria**: Rank card is invisible until `shouldReveal` becomes true, then slides in exactly 200ms later with smooth spring.

---

### Phase 4 — Share Button with Shimmer *(~30 min)*

**Component**: `components/ShareButton.tsx`

**What to build**:
- "Share Result" button
- **Shimmer/glint**: looping gradient-like highlight that sweeps across the button using an animated `translateX` on an absolutely-positioned overlay `View` (no LinearGradient dep required — use a semi-transparent white View with a skewed transform)
- **Press feedback**: `onPressIn` → `scale: 1.0 → 0.94` · `onPressOut` → `scale: 0.94 → 1.02 → 1.0` (haptic-feel via spring)
- Trigger `Haptics.impactAsync(ImpactFeedbackStyle.Medium)` on press (from `expo-haptics`)

**Key Reanimated APIs used**:
- `useSharedValue`, `useAnimatedStyle`
- `withRepeat`, `withTiming`, `withSequence`, `withSpring`
- `runOnJS` for haptic call

**Props interface**:
```ts
interface ShareButtonProps {
  onShare?: () => void;
}
```

**Exit Criteria**: Shimmer sweeps visibly and continuously. Press produces a satisfying spring bounce with haptic on real device.

---

### Phase 5 — Screen Orchestration *(~20 min)*

**Screen**: `screens/ScoreRevealScreen.tsx`

**What to build**:
- Compose all 4 components in correct layout
- Manage `shouldRevealRank` state (the only `useState` in the screen — OK since it's not inside an animation callback)
- Pass mock data props:
  ```ts
  const MOCK_RESULT = {
    score: 2840,
    combo: 7,
    rank: 3,
    totalPlayers: 1200,
  };
  ```
- Background: dark gradient matching Matiks arena aesthetic (see `design-language.md`)
- Optionally: fade in the whole screen on mount with a subtle `opacity: 0 → 1`

**Exit Criteria**: Full screen renders, all animations sequence correctly end-to-end in the right order.

---

### Phase 6 — Polish & Parity *(~25 min)*

**Tasks**:
- [ ] Test on Android emulator — check spring physics feel identical
- [ ] Test on iOS simulator (if on Mac) — verify no jank
- [ ] Adjust spring configs if animations feel sluggish on Android (increase `damping`/`stiffness`)
- [ ] Check `useNativeDriver` equivalence — Reanimated 3 runs on UI thread by default, verify no JS thread animations snuck in
- [ ] Add `accessibilityLabel` to Share button
- [ ] Clean up any `console.log` statements

---

### Phase 7 — Bonus: Skia Confetti *(~30 min, optional)*

**Component**: `components/ConfettiCanvas.tsx`

**What to build**:
- Full-screen `<Canvas>` overlay from `@shopify/react-native-skia`
- On score counter completion, burst N particles (e.g. 60) from screen center
- Each particle: randomized `dx`, `dy` velocity, rotation, color (from Matiks palette), fade-out `opacity`
- Animate using Skia's `useValue` / `useTouchHandler` — or drive via Reanimated shared values passed into Skia via `useSharedValueEffect`
- Particles should gravity-fall with a decelerating arc

**Exit Criteria**: Colorful confetti bursts from score area when counter completes, particles scatter and fade naturally.

---

## Component Sequencing Diagram

```
Screen Mounts
     │
     ├─► [Phase 2] ComboStreakBadge animates IN (300ms delay from mount)
     │
     ├─► [Phase 1] ScoreCounter begins ticking 0 → 2840 (~2000ms)
     │                   │
     │                   └─► onComplete fires
     │                              │
     │                              ├─► [Phase 3] RankReveal slides in (+200ms stagger)
     │                              │
     │                              └─► [Bonus] Confetti burst triggers
     │
     └─► [Phase 4] ShareButton shimmer loops from mount (independent)
```

---

## Evaluation Checklist

| Criteria | Weight | What to verify |
|---|---|---|
| Correct Reanimated 3 API usage (UI thread safety) | 30% | No JS thread animations, no `setState` in callbacks, use `runOnJS` correctly |
| Animation feel (timing, easing, spring config) | 25% | Overshoot feels natural, bounce has right damping, shimmer is smooth |
| Code structure & readability | 20% | Components are single-responsibility, constants extracted, no magic numbers |
| iOS + Android parity | 15% | Test on both — spring configs may need tuning per platform |
| Bonus: Skia confetti | 10% | Particles have random trajectory, rotation, and fade-out |

---

## Mock Data Reference

```ts
// Use this in ScoreRevealScreen.tsx for demo
export const MOCK_GAME_RESULT = {
  playerName: 'Mallik',
  score: 2840,
  comboStreak: 7,
  rank: 3,
  totalPlayers: 1200,
  accuracy: 94,          // % — optional display
  timeTaken: 45,         // seconds — optional display
};
```