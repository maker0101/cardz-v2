import {useQuery} from '@rocicorp/zero/react';
import {user} from 'shared/user';
import {useDueCards, useOnDemandCards} from '@/domains/cards/cards.hooks';
import * as queries from '@/domains/studies/studies.queries';
import {useGetUi} from '@/domains/ui/ui.hooks';
import {upsertOneUi} from '@/domains/ui/ui.db';
import {StudyMode} from '@/domains/studies/studies.types';
import {DatabaseType} from 'zero/zero.types';

export const useStudyCards = (db: DatabaseType) => {
  const {mode} = useStudyMode(db);

  const {
    queue: cardsDue,
    history: dueHistory,
    isLoading: isLoadingDueCards,
  } = useDueCards(db);

  const {
    queue: onDemandCards,
    history: onDemandHistory,
    isLoading: isLoadingOnDemandCards,
  } = useOnDemandCards(db);

  return {
    cards: {
      current: mode === 'due' ? cardsDue.at(0) : onDemandCards.at(0),
      queue: mode === 'due' ? cardsDue : onDemandCards,
      history: mode === 'due' ? dueHistory : onDemandHistory,
    },
    progress: {
      done: mode === 'due' ? dueHistory.length + 1 : onDemandHistory.length + 1,
      total:
        mode === 'due'
          ? cardsDue.length + dueHistory.length
          : onDemandCards.length + onDemandHistory.length,
    },
    isLoading: isLoadingDueCards || isLoadingOnDemandCards,
  };
};

export const useGetOnDemandStudy = (db: DatabaseType) => {
  const studyQuery = queries.getOnDemandStudy(db, user.id);
  const [study, details] = useQuery(studyQuery);

  return {study, isLoading: details.type !== 'complete'};
};

export const useStudyMode = (db: DatabaseType) => {
  const {ui, isLoading} = useGetUi(db);

  return {
    mode: ui?.studyMode,
    setMode: async (mode: StudyMode) => {
      await upsertOneUi(db, user.id, {mode});
    },
    isLoading,
  };
};
