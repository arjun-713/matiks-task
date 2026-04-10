import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Easings, Springs, Timing } from '../constants/animation';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../constants/theme';

export interface RankRevealProps {
  rank: number;
  totalPlayers: number;
  shouldReveal: boolean;
}

export const RankReveal = ({
  rank,
  totalPlayers,
  shouldReveal,
}: RankRevealProps) => {
  const translateY = useSharedValue(60);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!shouldReveal) {
      translateY.value = 60;
      opacity.value = 0;
      return;
    }

    translateY.value = withDelay(Timing.rankStagger, withSpring(0, Springs.gentle));
    opacity.value = withDelay(
      Timing.rankStagger,
      withTiming(1, { duration: Timing.rankReveal, easing: Easings.rankFade }),
    );
  }, [opacity, shouldReveal, translateY]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      <Text style={styles.rankLabel}>Rank Reveal</Text>
      <Text style={styles.rankValue}>
        #{rank} <Text style={styles.rankDetail}>of {totalPlayers.toLocaleString()} players</Text>
      </Text>
      <View style={styles.divider} />
      <Text style={styles.rankMeta}>Top {(rank / totalPlayers * 100).toFixed(1)}% finish</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.backgroundBorder,
    backgroundColor: Colors.backgroundGlass,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    ...Shadows.card,
  },
  rankLabel: {
    ...Typography.rankLabel,
    marginBottom: Spacing.sm,
  },
  rankValue: {
    ...Typography.rankPrimary,
  },
  rankDetail: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.backgroundBorder,
    marginVertical: Spacing.md,
  },
  rankMeta: {
    ...Typography.detail,
  },
});
