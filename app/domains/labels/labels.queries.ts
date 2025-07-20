import {DatabaseType} from 'zero/zero.types';

export const getOneLabel = (db: DatabaseType, labelId: string) => {
  return db.query.label.where('id', '=', labelId).one();
};

export const getManyLabels = (db: DatabaseType, labelIds: string[]) => {
  return db.query.label
    .where('id', 'IN', labelIds)
    .orderBy('createdAt', 'desc');
};

export const getAllLabels = (db: DatabaseType, userId: string) => {
  return db.query.label
    .where('userId', '=', userId)
    .orderBy('createdAt', 'desc');
};
