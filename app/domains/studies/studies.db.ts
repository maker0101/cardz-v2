import {user} from 'shared/user';
import {get as getCard, update as updateCard} from '@/domains/cards/cards.db';
import {newStudyState} from '@/domains/studies/studies.core';
import {AlgorithmId} from '@/domains/algorithms/algorithms.types';
import {getOne as getOneUi} from '@/domains/ui/ui.db';
import {get as getOnDemandStudy} from '@/domains/studies/on-demand-studies.db';
import {ZeroType} from 'zero/zero.types';

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
