import {ZeroType} from 'zero/zero.types';

export const getAll = (z: ZeroType, userId: string) => {
  return z.query.card
    .where('userId', '=', userId)
    .orderBy('createdAt', 'desc')
    .related('cardLabels')
    .related('cardStudyState');
};

export const getOne = (z: ZeroType, cardId: string) => {
  return z.query.card
    .where('id', '=', cardId)
    .one()
    .related('cardLabels')
    .related('cardStudyState');
};

export const getMany = (z: ZeroType, cardIds: string[]) => {
  return z.query.card
    .where('id', 'IN', cardIds)
    .orderBy('createdAt', 'desc')
    .related('cardLabels')
    .related('cardStudyState');
};
