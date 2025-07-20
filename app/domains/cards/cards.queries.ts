import {DatabaseType} from 'zero/zero.types';

export const getOneCard = (db: DatabaseType, cardId: string) => {
  return db.query.card
    .where('id', '=', cardId)
    .one()
    .related('cardLabels')
    .related('cardStudyState');
};

export const getManyCards = (db: DatabaseType, cardIds: string[]) => {
  return db.query.card
    .where('id', 'IN', cardIds)
    .orderBy('createdAt', 'desc')
    .related('cardLabels')
    .related('cardStudyState');
};

export const getAllCards = (db: DatabaseType, userId: string) => {
  return db.query.card
    .where('userId', '=', userId)
    .orderBy('createdAt', 'desc')
    .related('cardLabels')
    .related('cardStudyState');
};
