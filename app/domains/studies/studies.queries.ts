import {ZeroType} from 'zero/zero.types';

export const getOnDemandStudy = (z: ZeroType, userId: string) => {
  return z.query.onDemandStudy
    .where('userId', '=', userId)
    .one()
    .related('onDemandStudyCards');
};
