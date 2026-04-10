import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ComboStreakBadge } from '../components/ComboStreakBadge';
import { RankReveal } from '../components/RankReveal';
import { ScoreCounter } from '../components/ScoreCounter';
import { ShareButton } from '../components/ShareButton';
import { MOCK_GAME_RESULT } from '../constants/mockData';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../constants/theme';
import { useAnimationSequence } from '../hooks/useAnimationSequence';

const StatChip = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.statChip}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const ScoreRevealScreen = () => {
  const { rankVisible, markScoreComplete } = useAnimationSequence();
  const orbShift = useSharedValue(0);

  useEffect(() => {
    orbShift.value = withTiming(1, { duration: 900 });
  }, [orbShift]);

  const leftOrbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -18 + orbShift.value * 18 }, { scale: 1 + orbShift.value * 0.06 }],
  }));

  const rightOrbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: 12 - orbShift.value * 16 }, { scale: 1.04 - orbShift.value * 0.04 }],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.screen}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <Text style={styles.logo}>Matiks Arena</Text>
          <Text style={styles.headline}>Match complete. Your final burst landed hard.</Text>
        </Animated.View>

        <Animated.View style={[styles.ambientOrb, styles.leftOrb, leftOrbStyle]} />
        <Animated.View style={[styles.ambientOrb, styles.rightOrb, rightOrbStyle]} />

        <View style={styles.centerStage}>
          <ScoreCounter
            finalScore={MOCK_GAME_RESULT.score}
            duration={2000}
            onComplete={markScoreComplete}
          />
          <ComboStreakBadge comboCount={MOCK_GAME_RESULT.comboStreak} />
          <RankReveal
            rank={MOCK_GAME_RESULT.rank}
            totalPlayers={MOCK_GAME_RESULT.totalPlayers}
            shouldReveal={rankVisible}
          />
          <View style={styles.metricsRow}>
            <StatChip label="Accuracy" value={`${MOCK_GAME_RESULT.accuracy}%`} />
            <StatChip label="Time" value={`${MOCK_GAME_RESULT.timeTaken}s`} />
          </View>
          <ShareButton
            onShare={() =>
              Alert.alert(
                'Share Result',
                `I scored ${MOCK_GAME_RESULT.score.toLocaleString()} and ranked #${MOCK_GAME_RESULT.rank} on Matiks.`,
              )
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundDeep,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundDeep,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    gap: Spacing.sm,
    zIndex: 2,
  },
  logo: {
    ...Typography.logo,
  },
  headline: {
    ...Typography.headline,
    maxWidth: 320,
    lineHeight: 24,
  },
  centerStage: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 2,
  },
  ambientOrb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.16,
  },
  leftOrb: {
    width: 220,
    height: 220,
    left: -40,
    top: 120,
    backgroundColor: Colors.brandPrimary,
  },
  rightOrb: {
    width: 180,
    height: 180,
    right: -30,
    bottom: 140,
    backgroundColor: Colors.brandSecondary,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  statChip: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.backgroundBorder,
    backgroundColor: Colors.backgroundGlass,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    ...Shadows.card,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    ...Typography.rankLabel,
    marginTop: Spacing.xs,
  },
});
