import {UiConfigType} from '@/domains/ui/ui.types';
import {nanoid} from 'nanoid';
import {DatabaseType} from 'zero/zero.types';
import * as uiQueries from '@/domains/ui/ui.queries';

export const getOneUi = async (db: DatabaseType, userId: string) => {
  return uiQueries.getOne(db, userId);
};

export const insertOneUi = async (
  db: DatabaseType,
  userId: string,
  config: UiConfigType,
) => {
  const uiId = nanoid();
  const now = Date.now();

  return db.mutate.ui.insert({
    id: uiId,
    userId,
    studyMode: config.mode ?? 'due',
    createdAt: now,
    updatedAt: now,
  });
};

export const updateOneUi = async (
  db: DatabaseType,
  userId: string,
  config: UiConfigType,
) => {
  const ui = await getOneUi(db, userId);

  if (!ui) {
    throw new Error('UI not found');
  }

  const now = Date.now();
  return db.mutate.ui.update({
    id: ui.id,
    userId,
    studyMode: config.mode ?? 'due',
    updatedAt: now,
  });
};

export const upsertOneUi = async (
  db: DatabaseType,
  userId: string,
  config: UiConfigType,
) => {
  const ui = await getOneUi(db, userId);

  if (!ui) {
    return insertOneUi(db, userId, config);
  }
  return updateOneUi(db, userId, config);
};
