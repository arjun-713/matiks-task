import { useCallback, useState } from 'react';

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

  const markScoreComplete = useCallback(() => {
    setScoreComplete(true);
    setRankVisible(true);
    setConfettiBurst(true);
  }, []);

  return { scoreComplete, rankVisible, confettiBurst, markScoreComplete };
};
