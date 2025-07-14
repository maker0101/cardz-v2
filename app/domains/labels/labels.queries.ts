import {ZeroType} from 'zero/zero.types';

export const getAll = (z: ZeroType, userId: string) => {
  return z.query.label
    .where('userId', '=', userId)
    .orderBy('createdAt', 'desc');
};

export const getOne = (z: ZeroType, labelId: string) => {
  return z.query.label.where('id', '=', labelId).one();
};

export const getMany = (z: ZeroType, labelIds: string[]) => {
  return z.query.label.where('id', 'IN', labelIds).orderBy('createdAt', 'desc');
};
