import { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Canvas, Group, RoundedRect } from '@shopify/react-native-skia';
import Animated, {
  Easing,
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '../constants/theme';

export interface ConfettiCanvasProps {
  trigger: boolean;
  particleCount?: number;
}

interface ParticleSeed {
  color: string;
  width: number;
  height: number;
  radius: number;
  dx: number;
  dy: number;
  gravity: number;
  spin: number;
  delay: number;
}

const seededRandom = (seed: number) => {
  const value = Math.sin(seed * 999.91) * 10000;
  return value - Math.floor(value);
};

const buildParticle = (
  index: number,
  width: number,
  height: number,
): ParticleSeed => {
  const color = Colors.confetti[index % Colors.confetti.length];
  const widthFactor = 8 + seededRandom(index + 1.1) * 8;
  const heightFactor = 12 + seededRandom(index + 2.7) * 14;

  return {
    color,
    width: widthFactor,
    height: heightFactor,
    radius: 2 + seededRandom(index + 3.3) * 4,
    dx: (seededRandom(index + 4.9) - 0.5) * width * 0.72,
    dy: -(height * (0.2 + seededRandom(index + 5.2) * 0.2)),
    gravity: height * (0.32 + seededRandom(index + 6.4) * 0.22),
    spin: (seededRandom(index + 7.8) - 0.5) * 6.5,
    delay: seededRandom(index + 8.6) * 0.16,
  };
};

const ConfettiParticle = ({
  particle,
  progress,
  active,
  startX,
  startY,
}: {
  particle: ParticleSeed;
  progress: SharedValue<number>;
  active: SharedValue<number>;
  startX: number;
  startY: number;
}) => {
  const localProgress = useDerivedValue(() => {
    const delayed = (progress.value - particle.delay) / (1 - particle.delay);
    return Math.max(0, Math.min(1, delayed));
  });

  const opacity = useDerivedValue(() => {
    const t = localProgress.value;
    if (!active.value || t <= 0) {
      return 0;
    }
    return Math.max(0, 1 - t * 1.18);
  });

  const transform = useDerivedValue(() => {
    const t = localProgress.value;
    const translateX = startX + particle.dx * t;
    const translateY = startY + particle.dy * t + particle.gravity * t * t;

    return [
      { translateX },
      { translateY },
      { rotate: particle.spin * t },
      { scale: 1 - t * 0.18 },
    ];
  });

  return (
    <Group opacity={opacity} transform={transform}>
      <RoundedRect
        x={-particle.width / 2}
        y={-particle.height / 2}
        width={particle.width}
        height={particle.height}
        r={particle.radius}
        color={particle.color}
      />
    </Group>
  );
};

export const ConfettiCanvas = ({
  trigger,
  particleCount = 60,
}: ConfettiCanvasProps) => {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);
  const active = useSharedValue(0);

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, index) =>
        buildParticle(index + 1, width || 1, height || 1),
      ),
    [height, particleCount, width],
  );

  useEffect(() => {
    if (!trigger) {
      return;
    }

    active.value = 1;
    progress.value = 0;
    progress.value = withTiming(
      1,
      {
        duration: 1800,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        'worklet';
        if (finished) {
          active.value = 0;
        }
      },
    );
  }, [active, progress, trigger]);

  const startX = width * 0.5;
  const startY = height * 0.3;

  return (
    <View pointerEvents="none" style={styles.overlay}>
      <Canvas style={styles.overlay}>
        {particles.map((particle, index) => (
          <ConfettiParticle
            key={`${index}-${particle.color}`}
            particle={particle}
            progress={progress}
            active={active}
            startX={startX}
            startY={startY}
          />
        ))}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
