import { TextStyle } from 'react-native';

export const Colors = {
  backgroundDeep: '#0D0E1A',
  backgroundCard: '#161828',
  backgroundGlass: 'rgba(30, 32, 56, 0.82)',
  backgroundBorder: 'rgba(139, 143, 168, 0.18)',
  brandPrimary: '#6C63FF',
  brandSecondary: '#FF6B6B',
  brandAccent: '#FFD166',
  scoreGold: '#F4C430',
  comboBadgeBg: '#2A1A0E',
  comboBadgeBorder: '#FF6B35',
  rankBlue: '#4FC3F7',
  textPrimary: '#F0F0FF',
  textSecondary: '#8B8FA8',
  textMuted: '#4A4E6B',
  shareButtonBg: '#6C63FF',
  shareButtonShimmer: 'rgba(255, 255, 255, 0.28)',
  confetti: ['#6C63FF', '#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#FF9F1C'],
} as const;

export const Typography = {
  logo: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
  } satisfies TextStyle,
  headline: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  } satisfies TextStyle,
  scoreValue: {
    fontSize: 76,
    fontWeight: '800',
    letterSpacing: -2.5,
    color: Colors.scoreGold,
  } satisfies TextStyle,
  scoreLabel: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
  } satisfies TextStyle,
  comboBadge: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: Colors.textPrimary,
  } satisfies TextStyle,
  rankPrimary: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.rankBlue,
    letterSpacing: -1,
  } satisfies TextStyle,
  rankLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  detail: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    letterSpacing: 0.2,
  } satisfies TextStyle,
  shareButton: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  } satisfies TextStyle,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const Shadows = {
  scoreGlow: {
    shadowColor: Colors.scoreGold,
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 14,
  },
} as const;
