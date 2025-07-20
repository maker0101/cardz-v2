import {nanoid} from 'nanoid';
import {user} from 'shared/user';
import {getOneCard, updateCard as updateCard} from '@/domains/cards/cards.db';
import {newStudyState} from '@/domains/studies/studies.core';
import {AlgorithmId} from '@/domains/algorithms/algorithms.types';
import {getOneUi as getOneUi} from '@/domains/ui/ui.db';
import {DatabaseType} from 'zero/zero.types';
import {
  OnDemandStudyMode,
  OnDemandStudyWithCards,
} from '@/domains/studies/studies.types';
import {computeQueueAndHistory} from '@/domains/studies/studies.utils';
import {getOnDemandStudy as getOnDemandStudyQuery} from '@/domains/studies/studies.queries';

export const getOnDemandStudy = async (
  db: DatabaseType,
): Promise<OnDemandStudyWithCards | undefined> => {
  const study = await getOnDemandStudyQuery(db, user.id);
  return study || undefined;
};

export const insertOnDemandStudy = async (
  db: DatabaseType,
): Promise<OnDemandStudyWithCards> => {
  const studyId = nanoid();
  const now = Date.now();

  const newStudy = {
    id: studyId,
    userId: user.id,
    createdAt: now,
    updatedAt: now,
  };

  await db.mutate.onDemandStudy.insert(newStudy);

  return {
    ...newStudy,
    onDemandStudyCards: [],
  };
};

export const queueCards = async (
  db: DatabaseType,
  cardIds: string[],
  mode: OnDemandStudyMode = 'create',
): Promise<OnDemandStudyWithCards> => {
  const study = await fetchOrCreateStudy(db);

  const {newQueueIds, newHistoryIds} = computeQueueAndHistory(
    study.onDemandStudyCards,
    cardIds,
    mode,
  );

  await replaceOnDemandStudyCards(db, study, newQueueIds, newHistoryIds);

  await db.mutate.onDemandStudy.update({
    id: study.id,
    updatedAt: Date.now(),
  });

  return study;
};

// Helper functions
const fetchOrCreateStudy = async (
  db: DatabaseType,
): Promise<OnDemandStudyWithCards> => {
  let study = await getOnDemandStudy(db);
  if (!study) {
    study = await insertOnDemandStudy(db);
  }
  return study;
};

const replaceOnDemandStudyCards = async (
  db: DatabaseType,
  study: OnDemandStudyWithCards,
  newQueueIds: string[],
  newHistoryIds: string[],
): Promise<void> => {
  await db.mutateBatch(async tx => {
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
  db: DatabaseType,
  cardId: string,
  score: number,
  algorithmId: AlgorithmId,
) => {
  const cardResult = await getOneCard(db, cardId);
  const ui = await getOneUi(db, user.id);

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

    await updateCard(db, cardId, {
      studyState: updatedStudyState,
      updatedAt: new Date(),
    });
  } else {
    await updateCard(db, cardId, {
      updatedAt: new Date(),
    });

    await moveCardToHistory(db, cardId);
  }
};

export const moveCardToHistory = async (
  db: DatabaseType,
  cardId: string,
): Promise<boolean> => {
  const study = await getOnDemandStudy(db);
  if (!study) return false;

  const existingCard = study.onDemandStudyCards.find(
    card => card.cardId === cardId && card.type === 'queue',
  );

  if (existingCard) {
    await db.mutate.onDemandStudyCard.update({
      studyId: study.id,
      cardId: cardId,
      type: 'history',
    });

    await db.mutate.onDemandStudy.update({
      id: study.id,
      updatedAt: Date.now(),
    });

    return true;
  }

  return false;
};
