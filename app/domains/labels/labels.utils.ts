import {get} from '@/domains/labels/labels.db';
import {type Label} from '@/domains/labels/labels.types';
import {nanoid} from 'nanoid';
import {user} from 'shared/user';
import {Card} from '@/domains/cards/cards.types';
import {type ZeroType} from 'zero/zero.types';

export const getLabelsByIds = async (
  z: ZeroType,
  labelIds: string[],
): Promise<Label[]> => {
  if (!labelIds.length) return [];
  const result = await get(z, labelIds);
  return Array.isArray(result) ? result : [];
};

export const areLabelsEqual = (labels1: Label[], labels2: Label[]) => {
  if (labels1.length !== labels2.length) return false;
  const ids1 = new Set(labels1.map(l => l.id));
  const ids2 = new Set(labels2.map(l => l.id));

  const setsHaveSameSize = ids1.size === ids2.size;
  const allIds1ExistInIds2 = Array.from(ids1).every(id => ids2.has(id));

  return setsHaveSameSize && allIds1ExistInIds2;
};

export const getLabelsToUpdate = (
  currentLabels: Label[],
  newLabels?: Label[],
): {insertLabels: Label[]; deleteLabels: Label[]} => {
  if (!newLabels) return {insertLabels: [], deleteLabels: []};

  const currentLabelIds = new Set(currentLabels.map(l => l.id));
  const newLabelIds = new Set(newLabels.map(l => l.id));

  return {
    insertLabels: newLabels.filter(l => !currentLabelIds.has(l.id)),
    deleteLabels: currentLabels.filter(l => !newLabelIds.has(l.id)),
  };
};

export const resolveLabelNames = (
  labelNames: string[],
  existingLabels: readonly Label[],
): Label[] => {
  if (!labelNames.length) return [];

  return labelNames.map(labelName => {
    const existingLabel = existingLabels.find(
      existing => existing.name.toLowerCase() === labelName.toLowerCase(),
    );

    if (existingLabel) {
      return {...existingLabel};
    } else {
      const now = Date.now();
      return {
        id: nanoid(),
        name: labelName,
        createdAt: now,
        updatedAt: now,
        userId: user.id,
      };
    }
  });
};

export const toLabels = (labelNames: string[] | undefined): Label[] =>
  labelNames?.map(labelName => ({
    id: nanoid(),
    name: labelName,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    userId: user.id,
  })) || [];

/**
 * Finds new labels that need to be inserted into the database.
 * Filters out labels that already exist and removes duplicates.
 */
export const getNewLabels = (
  labelsToCheck: Label[],
  existingLabels: readonly Label[],
): Label[] => {
  const existingLabelIds = new Set(existingLabels.map(label => label.id));
  const existingLabelNames = new Set(
    existingLabels.map(label => label.name.toLowerCase()),
  );

  const labelsToInsert = labelsToCheck.filter(
    label =>
      !existingLabelIds.has(label.id) &&
      !existingLabelNames.has(label.name.toLowerCase()),
  );

  // Remove duplicates by ID and by name (case-insensitive)
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  return labelsToInsert.filter(label => {
    const normalizedName = label.name.toLowerCase();
    if (seenIds.has(label.id) || seenNames.has(normalizedName)) {
      return false;
    }
    seenIds.add(label.id);
    seenNames.add(normalizedName);
    return true;
  });
};

/**
 * Sorts labels alphabetically by name in a locale-aware manner.
 * Creates a shallow copy to avoid mutating the original array.
 */
export const sortLabelsByName = (labels: readonly Label[]): Label[] => {
  return labels.slice().sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Gets the number of cards associated with each label.
 */
export const getLabelsCardCounts = (
  labels: readonly Label[],
  cards: Card[],
) => {
  const counts: Record<string, number> = {};
  labels.forEach(label => {
    counts[label.id] = cards.filter(card =>
      card.labels.some(l => l.id === label.id),
    ).length;
  });

  return counts;
};
