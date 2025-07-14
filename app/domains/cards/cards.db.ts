import {nanoid} from 'nanoid';
import {Card, CardChangeSet, CardFormValues} from '@/domains/cards/cards.types';
import {user} from 'shared/user';
import {ZeroType} from 'zero/zero.types';
import {toCardFromCardDB} from '@/domains/cards/cards.utils';
import * as cardQueries from '@/domains/cards/cards.queries';
import {getAll as getAllLabels} from '@/domains/labels/labels.db';
import {getLabelsToUpdate, getNewLabels} from '@/domains/labels/labels.utils';

export const getOne = async (
  z: ZeroType,
  cardId: string,
): Promise<Card | undefined> => {
  const cardDB = await cardQueries.getOne(z, cardId);
  const labels = await getAllLabels(z);
  return cardDB ? toCardFromCardDB(cardDB, labels) : undefined;
};

export const getMany = async (
  z: ZeroType,
  cardIds: string[],
): Promise<Card[]> => {
  const cardsDB = await cardQueries.getMany(z, cardIds);
  const labels = await getAllLabels(z);
  return cardsDB.map(card => toCardFromCardDB(card, labels));
};

export const get = async (
  z: ZeroType,
  cardIds: string | string[],
): Promise<Card | Card[] | undefined> => {
  if (typeof cardIds === 'string') return getOne(z, cardIds);
  return getMany(z, cardIds);
};

export const insert = async (
  z: ZeroType,
  cardData: CardFormValues | CardFormValues[],
): Promise<Card[]> => {
  const cardsToInsert = Array.isArray(cardData) ? cardData : [cardData];

  for (const card of cardsToInsert) {
    if (!card.question || !card.answer) {
      throw new Error(
        'Card could not be created because it is missing question or answer',
      );
    }
  }

  const now = Date.now();
  const cardIds: string[] = [];

  const newCards = cardsToInsert.map(card => {
    const cardId = nanoid();
    cardIds.push(cardId);
    return {
      id: cardId,
      createdAt: now,
      updatedAt: now,
      question: card.question,
      answer: JSON.stringify(card.answer),
      userId: user.id,
      labels: card.labels,
    };
  });

  // Determine which labels need to be inserted before starting the transaction
  const allLabels = newCards.flatMap(card => card.labels || []);
  const existingLabels = await getAllLabels(z);
  const newLabels = getNewLabels(allLabels, existingLabels);

  await z.mutateBatch(async tx => {
    for (const label of newLabels) {
      await tx.label.insert({
        id: label.id,
        name: label.name,
        createdAt: label.createdAt,
        updatedAt: label.updatedAt,
        userId: label.userId,
      });
    }

    for (const newCard of newCards) {
      await tx.card.insert({
        id: newCard.id,
        createdAt: newCard.createdAt,
        updatedAt: newCard.updatedAt,
        question: newCard.question,
        answer: newCard.answer,
        userId: newCard.userId,
      });

      await tx.cardStudyState.insert({
        cardId: newCard.id,
        createdAt: now,
        updatedAt: now,
        lastStudiedAt: null,
        nextStudiedAt: null,
        box: null,
        interval: null,
        repetitions: null,
        easeFactor: null,
        difficulty: null,
        stability: null,
      });

      if (newCard.labels?.length) {
        await Promise.allSettled(
          newCard.labels.map(label =>
            tx.cardLabel.insert({cardId: newCard.id, labelId: label.id}),
          ),
        );
      }
    }
  });

  return getMany(z, cardIds);
};

const updateOne = async (
  z: ZeroType,
  cardId: string,
  changeSet: CardChangeSet,
  options?: {
    tx?: any;
    skipReturn?: boolean;
  },
): Promise<Card | undefined> => {
  const {labels, studyState, ...rest} = changeSet;
  const now = Date.now();

  const cardResult = await getOne(z, cardId);

  if (!cardResult)
    throw new Error('Card could not be updated because it was not found');

  const currentCard = cardResult;

  const {insertLabels, deleteLabels} = getLabelsToUpdate(
    currentCard.labels,
    labels,
  );

  const updateFn = async (tx: any) => {
    tx.card.update({
      id: cardId,
      ...rest,
      answer: JSON.stringify(changeSet.answer ?? currentCard.answer),
      createdAt: currentCard.createdAt.getTime(),
      updatedAt: now,
    });

    if (studyState) {
      tx.cardStudyState.update({
        cardId,
        lastStudiedAt: studyState.lastStudiedAt?.getTime(),
        nextStudiedAt: studyState.nextStudiedAt?.getTime(),
        box: studyState.box?.toString(),
        interval: studyState.interval?.toString(),
        repetitions: studyState.repetitions?.toString(),
        easeFactor: studyState.easeFactor?.toString(),
        difficulty: studyState.difficulty?.toString(),
        stability: studyState.stability?.toString(),
      });
    }

    for (const label of insertLabels) {
      tx.cardLabel.insert({cardId, labelId: label.id});
    }

    for (const label of deleteLabels) {
      tx.cardLabel.delete({cardId, labelId: label.id});
    }
  };

  if (options?.tx) {
    await updateFn(options.tx);
  } else {
    await z.mutateBatch(updateFn);
  }

  if (options?.skipReturn) return undefined;

  return getOne(z, cardId);
};

export const update = async (
  z: ZeroType,
  updates:
    | string
    | Array<{cardId: string; changeSet: CardChangeSet}>
    | {cardId: string; changeSet: CardChangeSet},
  changeSet?: CardChangeSet,
  options?: {
    tx?: any;
    skipReturn?: boolean;
  },
): Promise<Card | Card[] | undefined> => {
  // Handle single update case
  if (typeof updates === 'string' && changeSet) {
    return updateOne(z, updates, changeSet, options);
  }

  // Handle multiple updates case
  const updatesArray = Array.isArray(updates)
    ? updates
    : [updates as {cardId: string; changeSet: CardChangeSet}];

  await z.mutateBatch(async tx => {
    for (const {cardId, changeSet} of updatesArray) {
      try {
        await updateOne(z, cardId, changeSet, {tx, skipReturn: true});
      } catch (error) {
        console.error(`Failed to update card ${cardId}:`, error);
      }
    }
  });

  return undefined;
};

export const upsert = async (
  z: ZeroType,
  cardData: CardFormValues | CardFormValues[],
  cardIds?: string | string[],
): Promise<Card | Card[]> => {
  const cardsArray = Array.isArray(cardData) ? cardData : [cardData];
  const idsArray = cardIds
    ? Array.isArray(cardIds)
      ? cardIds
      : [cardIds]
    : [];

  if (idsArray.length > 0) {
    // Update existing cards
    const updates = cardsArray.map((data, index) => ({
      cardId: idsArray[index] || idsArray[0], // Use first ID if not enough IDs provided
      changeSet: data,
    }));
    await update(z, updates);
    const result = await getMany(z, idsArray);

    if (!result) {
      throw new Error('Failed to retrieve updated cards');
    }

    if (Array.isArray(cardData)) {
      return Array.isArray(result) ? result : [result];
    } else {
      return Array.isArray(result) ? result[0] : result;
    }
  } else {
    const result = await insert(z, cardData);
    return Array.isArray(cardData) ? result : result[0];
  }
};

export const deleteCards = async (z: ZeroType, cardIds: string | string[]) => {
  const idsArray = Array.isArray(cardIds) ? cardIds : [cardIds];

  if (idsArray.length === 1) {
    const cardId = idsArray[0];
    const cardResult = await getOne(z, cardId);

    if (!cardResult) {
      return {
        success: false,
        deletedId: cardId,
        error: 'Card could not be removed because it was not found',
      };
    }

    await z.mutate.card.delete({
      id: cardId,
    });

    await z.mutate.cardStudyState.delete({
      cardId,
    });

    return {
      success: true,
      deletedId: cardId,
      error: null,
    };
  } else {
    const cardsResult = get(z, idsArray);

    if (!cardsResult || !Array.isArray(cardsResult) || !cardsResult.length) {
      return {
        success: false,
        count: 0,
        deletedIds: [],
        error: 'Cards could not be removed because they were not found',
      };
    }

    const existingCards = cardsResult;

    await z.mutateBatch(async tx => {
      for (const card of existingCards) {
        tx.card.delete({id: card.id});
      }
    });

    const deletedIds = existingCards.map(c => c.id);

    return {
      success: true,
      count: deletedIds.length,
      deletedIds,
      error: null,
    };
  }
};
