import {UiConfigType} from '@/domains/ui/ui.types';
import {nanoid} from 'nanoid';
import {ZeroType} from 'zero/zero.types';
import * as uiQueries from '@/domains/ui/ui.queries';

export const getOne = async (z: ZeroType, userId: string) => {
  return uiQueries.getOne(z, userId);
};

export const insertOne = async (
  z: ZeroType,
  userId: string,
  config: UiConfigType,
) => {
  const uiId = nanoid();
  const now = Date.now();

  return z.mutate.ui.insert({
    id: uiId,
    userId,
    studyMode: config.mode ?? 'due',
    createdAt: now,
    updatedAt: now,
  });
};

export const updateOne = async (
  z: ZeroType,
  userId: string,
  config: UiConfigType,
) => {
  const ui = await getOne(z, userId);

  if (!ui) {
    throw new Error('UI not found');
  }

  const now = Date.now();
  return z.mutate.ui.update({
    id: ui.id,
    userId,
    studyMode: config.mode ?? 'due',
    updatedAt: now,
  });
};

export const upsertOne = async (
  z: ZeroType,
  userId: string,
  config: UiConfigType,
) => {
  const ui = await getOne(z, userId);

  if (!ui) {
    return insertOne(z, userId, config);
  }
  return updateOne(z, userId, config);
};
