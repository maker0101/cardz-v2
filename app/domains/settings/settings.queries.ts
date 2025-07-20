import {DatabaseType} from 'zero/zero.types';

export const getOneSetting = (db: DatabaseType, userId: string) => {
  return db.query.setting.where('userId', '=', userId).one();
};
