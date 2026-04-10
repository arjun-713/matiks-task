import { Platform } from 'react-native';
import { Easing } from 'react-native-reanimated';

const isAndroid = Platform.OS === 'android';

export const Springs = {
  snappy: {
    damping: isAndroid ? 14 : 12,
    stiffness: isAndroid ? 210 : 180,
    mass: 1,
  },
  bouncy: {
    damping: isAndroid ? 10 : 8,
    stiffness: isAndroid ? 220 : 200,
    mass: 0.8,
  },
  gentle: {
    damping: isAndroid ? 20 : 18,
    stiffness: isAndroid ? 138 : 120,
    mass: 1,
  },
  press: {
    damping: isAndroid ? 22 : 20,
    stiffness: isAndroid ? 430 : 400,
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
