import {DatabaseType} from 'zero/zero.types';

export const getOnDemandStudy = (db: DatabaseType, userId: string) => {
  return db.query.onDemandStudy
    .where('userId', '=', userId)
    .one()
    .related('onDemandStudyCards');
};
