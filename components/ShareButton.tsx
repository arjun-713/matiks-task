import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
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

export interface ShareButtonProps {
  onShare?: () => void;
  label?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const triggerHaptics = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
};

export const ShareButton = ({
  onShare,
  label = 'Share Result',
}: ShareButtonProps) => {
  const scale = useSharedValue(1);
  const shimmer = useSharedValue(-220);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(220, { duration: Timing.shimmerCycle, easing: Easings.shimmer }),
      -1,
      false,
    );
  }, [shimmer]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmer.value }, { rotate: '16deg' }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.94, { duration: Timing.pressDown });
    triggerHaptics();
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withSpring(1.02, Springs.press),
      withSpring(1, Springs.press),
    );
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Shares your Matiks match result"
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onShare}
      style={[styles.button, buttonStyle]}
    >
      <Animated.View pointerEvents="none" style={[styles.shimmer, shimmerStyle]} />
      <Text style={styles.label}>{label}</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.shareButtonBg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.xxxl,
    ...Shadows.card,
  },
  shimmer: {
    position: 'absolute',
    left: 0,
    top: -24,
    bottom: -24,
    width: 64,
    backgroundColor: Colors.shareButtonShimmer,
  },
  label: {
    ...Typography.shareButton,
  },
});
