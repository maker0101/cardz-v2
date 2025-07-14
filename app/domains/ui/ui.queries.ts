import {ZeroType} from 'zero/zero.types';

export const getOne = (z: ZeroType, userId: string) => {
  return z.query.ui.where('userId', '=', userId).one();
};
