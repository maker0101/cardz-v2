import {nanoid} from 'nanoid';
import {user} from 'shared/user';
import {
  OnDemandStudyMode,
  OnDemandStudyWithCards,
} from '@/domains/studies/studies.types';
import {computeQueueAndHistory} from '@/domains/studies/studies.utils';
import {ZeroType} from 'zero/zero.types';
import * as studyQueries from '@/domains/studies/studies.queries';

export const get = async (
  z: ZeroType,
): Promise<OnDemandStudyWithCards | undefined> => {
  const study = await studyQueries.getOnDemandStudy(z, user.id);
  return study || undefined;
};

export const insert = async (z: ZeroType): Promise<OnDemandStudyWithCards> => {
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
  let study = await get(z);
  if (!study) {
    study = await insert(z);
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
