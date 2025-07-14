import {user} from 'shared/user';
import {nanoid} from 'nanoid';
import {
  Label,
  LabelFormValues,
  LabelChangeSet,
} from '@/domains/labels/labels.types';
import {ZeroType} from 'zero/zero.types';
import * as labelQueries from '@/domains/labels/labels.queries';

export const getOne = async (
  z: ZeroType,
  labelId: string,
): Promise<Label | undefined> => {
  return labelQueries.getOne(z, labelId);
};

export const getMany = async (
  z: ZeroType,
  labelIds: string[],
): Promise<Label[]> => {
  return labelQueries.getMany(z, labelIds);
};

export const get = async (
  z: ZeroType,
  labelIds: string | string[],
): Promise<Label | Label[] | undefined> => {
  if (typeof labelIds === 'string') return getOne(z, labelIds);
  return getMany(z, labelIds);
};

export const getAll = async (z: ZeroType): Promise<readonly Label[]> => {
  return labelQueries.getAll(z, user.id);
};

export const insert = async (
  z: ZeroType,
  labelData: LabelFormValues | LabelFormValues[],
): Promise<Label[]> => {
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

  await z.mutateBatch(async tx => {
    for (const newLabel of newLabels) {
      await tx.label.insert(newLabel);
    }
  });

  return getMany(z, labelIds);
};

const updateOne = async (
  z: ZeroType,
  labelId: string,
  changeSet: LabelChangeSet,
  options?: {
    tx?: any;
    skipReturn?: boolean;
  },
): Promise<Label | undefined> => {
  const now = Date.now();

  const labelResult = await getOne(z, labelId);

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
    await z.mutateBatch(updateFn);
  }

  if (options?.skipReturn) return undefined;

  return getOne(z, labelId);
};

export const update = async (
  z: ZeroType,
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
    return updateOne(z, updates, changeSet, options);
  }

  const updatesArray = Array.isArray(updates)
    ? updates
    : [updates as {labelId: string; changeSet: LabelChangeSet}];

  await z.mutateBatch(async tx => {
    for (const {labelId, changeSet} of updatesArray) {
      await updateOne(z, labelId, changeSet, {tx, skipReturn: true});
    }
  });

  return undefined;
};

export const deleteMany = async (z: ZeroType, labelIds: string | string[]) => {
  const idsArray = Array.isArray(labelIds) ? labelIds : [labelIds];

  if (idsArray.length === 1) {
    const labelId = idsArray[0];
    const labelResult = await getOne(z, labelId);

    if (!labelResult) {
      return {
        success: false,
        deletedId: labelId,
        error: 'Label could not be removed because it was not found',
      };
    }

    await z.mutate.label.delete({
      id: labelId,
    });

    return {
      success: true,
      deletedId: labelId,
      error: null,
    };
  } else {
    const labelsResult = await getMany(z, idsArray);

    if (!labelsResult || !labelsResult.length) {
      return {
        success: false,
        count: 0,
        deletedIds: [],
        error: 'Labels could not be removed because they were not found',
      };
    }

    const existingLabels = labelsResult;

    await z.mutateBatch(async tx => {
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
