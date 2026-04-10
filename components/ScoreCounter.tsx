import { useEffect } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Easings, Springs, Timing } from '../constants/animation';
import { Colors, Shadows, Spacing, Typography } from '../constants/theme';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export interface ScoreCounterProps {
  finalScore: number;
  duration?: number;
  onComplete?: () => void;
}

export const ScoreCounter = ({
  finalScore,
  duration = Timing.scoreCount,
  onComplete,
}: ScoreCounterProps) => {
  const score = useSharedValue(0);
  const haloScale = useSharedValue(0.88);
  const haloOpacity = useSharedValue(0.2);

  const animatedProps = useAnimatedProps(() => {
    const value = Math.round(score.value);
    return {
      text: value.toLocaleString(),
      value: value.toLocaleString(),
    } as never;
  });

  const scoreShadowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: haloScale.value }],
    opacity: haloOpacity.value,
  }));

  const scorePlateStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.98 + haloOpacity.value * 0.03 }],
  }));

  useDerivedValue(() => score.value);

  useEffect(() => {
    haloScale.value = withSequence(
      withTiming(1.06, { duration: duration * 0.7, easing: Easings.scoreCount }),
      withSpring(1, Springs.snappy),
    );
    haloOpacity.value = withSequence(
      withTiming(0.42, { duration: duration * 0.55, easing: Easings.scoreCount }),
      withTiming(0.26, { duration: Timing.scoreOvershoot }),
    );
    score.value = withSequence(
      withTiming(finalScore * 1.08, { duration, easing: Easings.scoreCount }),
      withSpring(finalScore, Springs.snappy, (finished) => {
        'worklet';
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      }),
    );
  }, [duration, finalScore, haloOpacity, haloScale, onComplete, score]);

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.scoreHalo, scoreShadowStyle]} />
      <Animated.View style={[styles.scorePlate, scorePlateStyle]}>
        <AnimatedTextInput
          editable={false}
          animatedProps={animatedProps}
          style={styles.scoreValue}
          underlineColorAndroid="transparent"
          pointerEvents="none"
        />
        <Text style={styles.scoreLabel}>Your Score</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
  },
  scoreHalo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.brandPrimary,
  },
  scorePlate: {
    minWidth: '100%',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  scoreValue: {
    ...Typography.scoreValue,
    ...Shadows.scoreGlow,
    padding: 0,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  scoreLabel: {
    ...Typography.scoreLabel,
    marginTop: Spacing.sm,
  },
});
