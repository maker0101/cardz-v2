import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CardStudyState, CardStatus } from '@/domains/cards/cards.types';
import { algorithms } from '@/domains/algorithms/algorithms.core';
import {
  AlgorithmId,
  LeitnerScore,
  SuperMemo2Score,
  HalfLifeRegressionScore,
  SuperMemo18Score,
  SpacedRepetitionAlgorithm,
} from '@/domains/algorithms/algorithms.types';

/**
 * Calculates a new study state for a card using the specified algorithm.
 *
 * @param prevStudyState - The previous study state for the card, before the update
 * @param algorithmId - The ID of the algorithm to use for the study
 * @param score - The score rating selected by the user
 * @returns The study result, including updated algorithm-specific data
 */
export const newStudyState = (
  prevStudyState: CardStudyState,
  algorithmId: AlgorithmId,
  score: number,
): CardStudyState => {
  // Note: Switch statement needed to make type narrowing work
  switch (algorithmId) {
    case 'leitner':
      return algorithms['leitner'].study(prevStudyState, score as LeitnerScore);
    case 'sm2':
      return algorithms['sm2'].study(prevStudyState, score as SuperMemo2Score);
    case 'hlr':
      return algorithms['hlr'].study(
        prevStudyState,
        score as HalfLifeRegressionScore,
      );
    case 'sm18':
      return algorithms['sm18'].study(
        prevStudyState,
        score as SuperMemo18Score,
      );
    default:
      throw new Error('Unknown algorithm type');
  }
};

dayjs.extend(relativeTime);
export const nextStudyMessage = (
  nextStudiedAt: Date | null,
  status: CardStatus,
) => {
  switch (status) {
    case 'new':
      return '(next up in a day)';
    case 'due':
      return '(study now)';
    default:
      const distance = dayjs(nextStudiedAt).fromNow();
      return `(next up ${distance})`;
  }
};

// TODO: Fix any type
export const getProjectedNextStudy = (
  currentStudyState: CardStudyState,
  algorithm: SpacedRepetitionAlgorithm<any>,
  score: number,
) => {
  const projectedStudyState = algorithm.study(currentStudyState, score);
  const distance = dayjs(projectedStudyState.nextStudiedAt).fromNow();

  return `(next study ${distance})`;
};
