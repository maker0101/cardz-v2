import {user} from 'shared/user';
import {get as getCard, update as updateCard} from '@/domains/cards/cards.db';
import {newStudyState} from '@/domains/studies/studies.core';
import {AlgorithmId} from '@/domains/algorithms/algorithms.types';
import {getOne as getOneUi} from '@/domains/ui/ui.db';
import {nanoid} from 'nanoid';
import {ZeroType} from 'zero/zero.types';
import {
  OnDemandStudyMode,
  OnDemandStudyWithCards,
} from '@/domains/studies/studies.types';
import {computeQueueAndHistory} from '@/domains/studies/studies.utils';
import * as studyQueries from '@/domains/studies/studies.queries';

export const getOnDemandStudy = async (
  z: ZeroType,
): Promise<OnDemandStudyWithCards | undefined> => {
  const study = await studyQueries.getOnDemandStudy(z, user.id);
  return study || undefined;
};

export const insertOnDemandStudy = async (
  z: ZeroType,
): Promise<OnDemandStudyWithCards> => {
  const studyId = nanoid();
  const now = Date.now();

  const newStudy = {
    id: studyId,
    userId: user.id,
    createdAt: now,
    updatedAt: now,
  };

  await z.mutate.onDemandStudy.insert(newStudy);

  return {
    ...newStudy,
    onDemandStudyCards: [],
  };
};

export const queueCards = async (
  z: ZeroType,
  cardIds: string[],
  mode: OnDemandStudyMode = 'create',
): Promise<OnDemandStudyWithCards> => {
  const study = await fetchOrCreateStudy(z);

  const {newQueueIds, newHistoryIds} = computeQueueAndHistory(
    study.onDemandStudyCards,
    cardIds,
    mode,
  );

  await replaceOnDemandStudyCards(z, study, newQueueIds, newHistoryIds);

  await z.mutate.onDemandStudy.update({
    id: study.id,
    updatedAt: Date.now(),
  });

  return study;
};

// Helper functions
const fetchOrCreateStudy = async (
  z: ZeroType,
): Promise<OnDemandStudyWithCards> => {
  let study = await getOnDemandStudy(z);
  if (!study) {
    study = await insertOnDemandStudy(z);
  }
  return study;
};

const replaceOnDemandStudyCards = async (
  z: ZeroType,
  study: OnDemandStudyWithCards,
  newQueueIds: string[],
  newHistoryIds: string[],
): Promise<void> => {
  await z.mutateBatch(async tx => {
    // Delete existing onDemandStudyCards for this study
    for (const row of study.onDemandStudyCards) {
      tx.onDemandStudyCard.delete({
        studyId: row.studyId,
        cardId: row.cardId,
      });
    }

    // Insert new queue rows
    for (const cid of newQueueIds) {
      tx.onDemandStudyCard.insert({
        studyId: study.id,
        cardId: cid,
        type: 'queue',
      });
    }

    // Insert new history rows
    for (const cid of newHistoryIds) {
      tx.onDemandStudyCard.insert({
        studyId: study.id,
        cardId: cid,
        type: 'history',
      });
    }
  });
};

export const scoreCard = async (
  z: ZeroType,
  cardId: string,
  score: number,
  algorithmId: AlgorithmId,
) => {
  const cardResult = await getCard(z, cardId);
  const ui = await getOneUi(z, user.id);

  if (!cardResult || Array.isArray(cardResult)) return;

  const currentCard = cardResult;

  // Update the study state based on mode
  if (ui?.studyMode === 'due') {
    // Due mode: Update study state based on algorithm and score
    const updatedStudyState = newStudyState(
      currentCard.studyState,
      algorithmId,
      score,
    );

    await updateCard(z, cardId, {
      studyState: updatedStudyState,
      updatedAt: new Date(),
    });
  } else {
    await updateCard(z, cardId, {
      updatedAt: new Date(),
    });

    await moveCardToHistory(z, cardId);
  }
};

export const moveCardToHistory = async (
  z: ZeroType,
  cardId: string,
): Promise<boolean> => {
  const study = await getOnDemandStudy(z);
  if (!study) return false;

  const existingCard = study.onDemandStudyCards.find(
    card => card.cardId === cardId && card.type === 'queue',
  );

  if (existingCard) {
    await z.mutate.onDemandStudyCard.update({
      studyId: study.id,
      cardId: cardId,
      type: 'history',
    });

    await z.mutate.onDemandStudy.update({
      id: study.id,
      updatedAt: Date.now(),
    });

    return true;
  }

  return false;
};
