# APIs & Data Contracts

> This file defines all data interfaces, prop contracts, and internal APIs between components. Use this as the source of truth when wiring components together in `ScoreRevealScreen.tsx`.

---

## Screen-Level Data Model

```ts
// The root data object that drives the entire score reveal screen.
// In production, this would come from a game result API response.
// For this assignment, use the MOCK_GAME_RESULT below.

export interface GameResult {
  playerName: string;         // e.g. "Mallik"
  score: number;              // Final score — e.g. 2840
  comboStreak: number;        // Longest combo during the game — e.g. 7
  rank: number;               // Player's rank in this match — e.g. 3
  totalPlayers: number;       // Total players in match — e.g. 1200
  accuracy?: number;          // Optional — percentage correct — e.g. 94
  timeTaken?: number;         // Optional — seconds for the match — e.g. 45
}

// Mock data for development & submission demo
export const MOCK_GAME_RESULT: GameResult = {
  playerName: 'Mallik',
  score: 2840,
  comboStreak: 7,
  rank: 3,
  totalPlayers: 1200,
  accuracy: 94,
  timeTaken: 45,
};
```

---

## Component Prop Interfaces

### ScoreCounter

```ts
// components/ScoreCounter.tsx

export interface ScoreCounterProps {
  /** The final score to count up to. Animation starts from 0. */
  finalScore: number;

  /** Total duration of the count-up animation in ms. Default: 2000 */
  duration?: number;

  /**
   * Called when the counter fully settles on finalScore.
   * Use this to trigger RankReveal.
   * Internally: runOnJS(onComplete)() inside animation callback.
   */
  onComplete?: () => void;
}
```

### ComboStreakBadge

```ts
// components/ComboStreakBadge.tsx

export interface ComboStreakBadgeProps {
  /** The combo number to display — e.g. 7 → "🔥 7 Combo Streak!" */
  comboCount: number;

  /**
   * Whether the badge should be visible/animated.
   * When true, triggers entry animation (scale 0 → 1.15 → 1.0).
   * Default: true (animates on mount).
   */
  visible?: boolean;
}
```

### RankReveal

```ts
// components/RankReveal.tsx

export interface RankRevealProps {
  /** Player's rank in the match — e.g. 3 */
  rank: number;

  /** Total players in the match — e.g. 1200 */
  totalPlayers: number;

  /**
   * Controls whether the reveal animation plays.
   * Set to true by ScoreCounter's onComplete (after 200ms stagger).
   * When false: component is invisible and translated off-screen.
   * When true: animates in.
   */
  shouldReveal: boolean;
}
```

### ShareButton

```ts
// components/ShareButton.tsx

export interface ShareButtonProps {
  /**
   * Called when the button is pressed (after press animation completes).
   * In production: triggers React Native Share API.
   * For this assignment: can be a console.log or no-op.
   */
  onShare?: () => void;

  /** Optional label override. Default: "Share Result" */
  label?: string;
}
```

### ConfettiCanvas (Bonus)

```ts
// components/ConfettiCanvas.tsx

export interface ConfettiCanvasProps {
  /**
   * When true, triggers the confetti particle burst.
   * Should be set at the same time as shouldReveal in RankReveal
   * (i.e., when ScoreCounter's onComplete fires).
   */
  trigger: boolean;

  /** Number of particles to spawn. Default: 60 */
  particleCount?: number;
}
```

---

## ScoreRevealScreen — Orchestration Contract

```ts
// screens/ScoreRevealScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScoreCounter } from '../components/ScoreCounter';
import { ComboStreakBadge } from '../components/ComboStreakBadge';
import { RankReveal } from '../components/RankReveal';
import { ShareButton } from '../components/ShareButton';
import { MOCK_GAME_RESULT } from '../constants/mockData';

export const ScoreRevealScreen = () => {
  // ✅ ONLY useState in this file — not inside any animation callback
  const [shouldRevealRank, setShouldRevealRank] = useState(false);
  const [shouldBurst, setShouldBurst] = useState(false); // Bonus only

  const handleScoreComplete = () => {
    // Called via runOnJS from ScoreCounter animation callback
    // The 200ms stagger is handled inside RankReveal (withDelay)
    setShouldRevealRank(true);
    setShouldBurst(true); // Bonus
  };

  return (
    <View style={styles.screen}>
      <ScoreCounter
        finalScore={MOCK_GAME_RESULT.score}
        duration={2000}
        onComplete={handleScoreComplete}
      />
      <ComboStreakBadge comboCount={MOCK_GAME_RESULT.comboStreak} />
      <RankReveal
        rank={MOCK_GAME_RESULT.rank}
        totalPlayers={MOCK_GAME_RESULT.totalPlayers}
        shouldReveal={shouldRevealRank}
      />
      <ShareButton onShare={() => console.log('Share pressed')} />
      {/* Bonus: <ConfettiCanvas trigger={shouldBurst} /> */}
    </View>
  );
};
```

---

## Animation Sequencing Contract

The following defines the expected animation timeline from screen mount:

```
T+0ms      Screen mounts
T+0ms      ShareButton shimmer begins looping (independent, always on)
T+300ms    ComboStreakBadge entry animation begins (withDelay inside component)
T+0ms      ScoreCounter begins counting 0 → 2840 (starts on mount)
T+2000ms   ScoreCounter reaches final score (overshoots briefly)
T+2200ms   ScoreCounter settles, onComplete fires → setShouldRevealRank(true)
T+2400ms   RankReveal begins slide-up (+200ms stagger via withDelay inside component)
T+2400ms   [Bonus] Confetti burst triggers
```

---

## Internal Hooks

### useAnimationSequence (optional utility)

```ts
// hooks/useAnimationSequence.ts
// Optional: extract shared sequencing logic if ScoreRevealScreen becomes complex

export interface SequenceState {
  scoreComplete: boolean;
  rankVisible: boolean;
  confettiBurst: boolean;
  markScoreComplete: () => void;
}

export const useAnimationSequence = (): SequenceState => {
  const [scoreComplete, setScoreComplete] = useState(false);
  const [rankVisible, setRankVisible] = useState(false);
  const [confettiBurst, setConfettiBurst] = useState(false);

  const markScoreComplete = () => {
    setScoreComplete(true);
    setRankVisible(true);
    setConfettiBurst(true);
  };

  return { scoreComplete, rankVisible, confettiBurst, markScoreComplete };
};
```

---

## React Native Share API (for ShareButton production use)

```ts
// Not required for the assignment, but here's how onShare would work in prod:

import { Share, Platform } from 'react-native';

const handleShare = async () => {
  try {
    await Share.share({
      message: `I scored 2840 and ranked #3 of 1,200 on Matiks! 🔥 Can you beat me? https://matiks.in`,
      title: 'My Matiks Score',  // Android only
    });
  } catch (error) {
    console.error('Share failed:', error);
  }
};

// Share API docs: https://reactnative.dev/docs/share
```

---

## Notes for AI Agents

- Never import `Animated` from `react-native` — use `Animated` from `react-native-reanimated` only
- `useSharedValue` and `useAnimatedStyle` must be called at the **top level** of a component (React hooks rules)
- Worklet functions need `'worklet';` directive OR be defined inline inside `useAnimatedStyle` / `useDerivedValue`
- The `onComplete` callback pattern for ScoreCounter MUST use `runOnJS`:
  ```ts
  someValue.value = withTiming(final, config, (finished) => {
    'worklet';
    if (finished && onComplete) runOnJS(onComplete)();
  });
  ```
- Do not put `withRepeat` inside `useEffect` — set the shared value directly on component mount or in a `useEffect` that only runs once