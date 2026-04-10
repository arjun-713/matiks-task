import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Springs, Timing } from '../constants/animation';
import { BorderRadius, Colors, Spacing, Typography } from '../constants/theme';

export interface ComboStreakBadgeProps {
  comboCount: number;
  visible?: boolean;
}

export const ComboStreakBadge = ({
  comboCount,
  visible = true,
}: ComboStreakBadgeProps) => {
  const entryScale = useSharedValue(0);
  const entryOpacity = useSharedValue(0);
  const flameScale = useSharedValue(1);
  const flameOpacity = useSharedValue(1);

  useEffect(() => {
    if (!visible) {
      entryScale.value = 0;
      entryOpacity.value = 0;
      return;
    }

    entryScale.value = withDelay(
      300,
      withSequence(withSpring(1.15, Springs.bouncy), withSpring(1, Springs.snappy)),
    );
    entryOpacity.value = withDelay(300, withTiming(1, { duration: Timing.badgeEntry }));
    flameScale.value = withDelay(
      420,
      withRepeat(
        withSequence(
          withTiming(1.15, { duration: Timing.flamePulse / 2 }),
          withTiming(0.96, { duration: Timing.flamePulse / 2 }),
        ),
        -1,
        true,
      ),
    );
    flameOpacity.value = withDelay(
      420,
      withRepeat(
        withSequence(
          withTiming(1, { duration: Timing.flamePulse / 2 }),
          withTiming(0.72, { duration: Timing.flamePulse / 2 }),
        ),
        -1,
        true,
      ),
    );
  }, [entryOpacity, entryScale, flameOpacity, flameScale, visible]);

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: entryOpacity.value,
    transform: [{ scale: entryScale.value }],
  }));

  const flameStyle = useAnimatedStyle(() => ({
    opacity: flameOpacity.value,
    transform: [{ scale: flameScale.value }],
  }));

  return (
    <Animated.View style={[styles.badge, badgeStyle]}>
      <Animated.Text style={[styles.flame, flameStyle]}>🔥</Animated.Text>
      <View style={styles.textWrap}>
        <Text style={styles.badgeText}>{comboCount} Combo Streak!</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.comboBadgeBorder,
    backgroundColor: Colors.comboBadgeBg,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
  },
  flame: {
    fontSize: 22,
  },
  textWrap: {
    justifyContent: 'center',
  },
  badgeText: {
    ...Typography.comboBadge,
  },
});
