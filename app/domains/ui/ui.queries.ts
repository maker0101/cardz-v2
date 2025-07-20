import {DatabaseType} from 'zero/zero.types';

export const getOne = (db: DatabaseType, userId: string) => {
  return db.query.ui.where('userId', '=', userId).one();
};
