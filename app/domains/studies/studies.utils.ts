import {
  OnDemandStudyCard,
  OnDemandStudyMode,
} from '@/domains/studies/studies.types';
import { CardStudyState } from '@/domains/cards/cards.types';

export const computeQueueAndHistory = (
  existingStudyCards: readonly OnDemandStudyCard[],
  newCardIds: string[],
  mode: OnDemandStudyMode,
): { newQueueIds: string[]; newHistoryIds: string[] } => {
  const oldQueueIds = existingStudyCards
    .filter((row) => row.type === 'queue')
    .map((row) => row.cardId);

  if (mode === 'extend') {
    const union = new Set([...oldQueueIds, ...newCardIds]);
    return {
      newQueueIds: Array.from(union),
      newHistoryIds: oldQueueIds,
    };
  } else {
    return {
      newQueueIds: newCardIds,
      newHistoryIds: [],
    };
  }
};

export const defaultStudyState: CardStudyState = {
  cardId: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  lastStudiedAt: null,
  nextStudiedAt: null,
  box: null,
  interval: null,
  repetitions: null,
  easeFactor: null,
  difficulty: null,
  stability: null,
};
