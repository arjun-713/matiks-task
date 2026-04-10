import { Easing } from 'react-native-reanimated';

export const Springs = {
  snappy: {
    damping: 12,
    stiffness: 180,
    mass: 1,
  },
  bouncy: {
    damping: 8,
    stiffness: 200,
    mass: 0.8,
  },
  gentle: {
    damping: 18,
    stiffness: 120,
    mass: 1,
  },
  press: {
    damping: 20,
    stiffness: 400,
    mass: 0.6,
  },
} as const;

export const Timing = {
  scoreCount: 2000,
  scoreOvershoot: 280,
  badgeEntry: 350,
  rankReveal: 500,
  shimmerCycle: 1600,
  flamePulse: 900,
  rankStagger: 200,
  pressDown: 80,
  pressUp: 200,
} as const;

export const Easings = {
  scoreCount: Easing.out(Easing.cubic),
  shimmer: Easing.linear,
  rankFade: Easing.out(Easing.quad),
} as const;
