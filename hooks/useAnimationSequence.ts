import { useCallback, useState } from 'react';

export interface SequenceState {
  scoreComplete: boolean;
  rankVisible: boolean;
  markScoreComplete: () => void;
}

export const useAnimationSequence = (): SequenceState => {
  const [scoreComplete, setScoreComplete] = useState(false);
  const [rankVisible, setRankVisible] = useState(false);

  const markScoreComplete = useCallback(() => {
    setScoreComplete(true);
    setRankVisible(true);
  }, []);

  return { scoreComplete, rankVisible, markScoreComplete };
};
