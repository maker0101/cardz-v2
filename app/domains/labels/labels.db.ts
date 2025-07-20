import {nanoid} from 'nanoid';
import {user} from 'shared/user';
import {
  Label,
  LabelFormValues,
  LabelChangeSet,
} from '@/domains/labels/labels.types';
import {DatabaseType} from 'zero/zero.types';
import * as labelQueries from '@/domains/labels/labels.queries';

export const getOneLabel = async (db: DatabaseType, labelId: string) => {
  return labelQueries.getOneLabel(db, labelId);
};

export const getManyLabels = async (db: DatabaseType, labelIds: string[]) => {
  return labelQueries.getManyLabels(db, labelIds);
};

export const getAllLabels = async (db: DatabaseType) => {
  return labelQueries.getAllLabels(db, user.id);
};

export const insertLabels = async (
  db: DatabaseType,
  labelData: LabelFormValues | LabelFormValues[],
) => {
  const labelsToInsert = Array.isArray(labelData) ? labelData : [labelData];

  const now = Date.now();
  const labelIds: string[] = [];

  const newLabels = labelsToInsert.map(label => {
    if (!label.name)
      throw new Error(
        'Label could not be created because it is missing a name',
      );

    const labelId = nanoid();
    labelIds.push(labelId);

    return {
      id: labelId,
      createdAt: now,
      updatedAt: now,
      name: label.name,
      userId: user.id,
    };
  });

  await db.mutateBatch(async tx => {
    for (const newLabel of newLabels) {
      await tx.label.insert(newLabel);
    }
  });

  return getManyLabels(db, labelIds);
};

const updateOneLabel = async (
  db: DatabaseType,
  labelId: string,
  changeSet: LabelChangeSet,
  options?: {
    tx?: any;
    skipReturn?: boolean;
  },
): Promise<Label | undefined> => {
  const now = Date.now();

  const labelResult = await getOneLabel(db, labelId);

  if (!labelResult || Array.isArray(labelResult))
    throw new Error('Label could not be updated because it was not found');

  const currentLabel = labelResult;

  const updateFn = async (tx: any) => {
    tx.labels.update({
      id: labelId,
      ...changeSet,
      createdAt: currentLabel.createdAt,
      updatedAt: now,
    });
  };

  if (options?.tx) {
    await updateFn(options.tx);
  } else {
    await db.mutateBatch(updateFn);
  }

  if (options?.skipReturn) return undefined;

  return getOneLabel(db, labelId);
};

export const updateLabels = async (
  db: DatabaseType,
  updates:
    | string
    | Array<{labelId: string; changeSet: LabelChangeSet}>
    | {labelId: string; changeSet: LabelChangeSet},
  changeSet?: LabelChangeSet,
  options?: {
    tx?: any;
    skipReturn?: boolean;
  },
): Promise<Label | Label[] | undefined> => {
  if (typeof updates === 'string' && changeSet) {
    return updateOneLabel(db, updates, changeSet, options);
  }

  const updatesArray = Array.isArray(updates)
    ? updates
    : [updates as {labelId: string; changeSet: LabelChangeSet}];

  await db.mutateBatch(async tx => {
    for (const {labelId, changeSet} of updatesArray) {
      await updateOneLabel(db, labelId, changeSet, {tx, skipReturn: true});
    }
  });

  return undefined;
};

export const deleteManyLabels = async (
  db: DatabaseType,
  labelIds: string | string[],
) => {
  const idsArray = Array.isArray(labelIds) ? labelIds : [labelIds];

  if (idsArray.length === 1) {
    const labelId = idsArray[0];
    const labelResult = await getOneLabel(db, labelId);

    if (!labelResult) {
      return {
        success: false,
        deletedId: labelId,
        error: 'Label could not be removed because it was not found',
      };
    }

    await db.mutate.label.delete({
      id: labelId,
    });

    return {
      success: true,
      deletedId: labelId,
      error: null,
    };
  } else {
    const labelsResult = await getManyLabels(db, idsArray);

    if (!labelsResult || !labelsResult.length) {
      return {
        success: false,
        count: 0,
        deletedIds: [],
        error: 'Labels could not be removed because they were not found',
      };
    }

    const existingLabels = labelsResult;

    await db.mutateBatch(async tx => {
      for (const label of existingLabels) {
        tx.label.delete({id: label.id});
      }
    });

    const deletedIds = existingLabels.map(l => l.id);

    return {
      success: true,
      count: deletedIds.length,
      deletedIds,
      error: null,
    };
  }
};
