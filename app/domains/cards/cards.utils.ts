import {useState, useEffect, useMemo} from 'react';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import {nanoid} from 'nanoid';
import {
  CardStudyState,
  CardStudyStateDB,
  type Card,
  type CardDB,
  type CardStatus,
  type GeneratedCard,
  type StreamingGeneratedCard,
} from '@/domains/cards/cards.types';
import {type Label} from '@/domains/labels/labels.types';
import {defaultStudyState} from '@/domains/studies/studies.utils';
import {user} from 'shared/user';
import {toLabels} from '@/domains/labels/labels.utils';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export function toCardStudyState(rowDB: CardStudyStateDB): CardStudyState {
  return {
    cardId: rowDB.cardId,
    createdAt: new Date(rowDB.createdAt),
    updatedAt: new Date(rowDB.updatedAt),
    lastStudiedAt: rowDB.lastStudiedAt ? new Date(rowDB.lastStudiedAt) : null,
    nextStudiedAt: rowDB.nextStudiedAt ? new Date(rowDB.nextStudiedAt) : null,
    box: rowDB.box ? Number(rowDB.box) : null,
    interval: rowDB.interval ? Number(rowDB.interval) : null,
    repetitions: rowDB.repetitions ? Number(rowDB.repetitions) : null,
    easeFactor: rowDB.easeFactor ? Number(rowDB.easeFactor) : null,
    difficulty: rowDB.difficulty ? Number(rowDB.difficulty) : null,
    stability: rowDB.stability ? Number(rowDB.stability) : null,
  };
}

export const toCardFromCardDB = (
  cardDB: CardDB,
  labels: readonly Label[],
): Card => {
  const {cardLabels, createdAt, updatedAt, cardStudyState, answer} = cardDB;

  const matchedCardLabels = cardLabels
    .map(cardlabel => {
      const label = labels.find(label => label.id === cardlabel.labelId);
      return label && {...label}; // Note: needed to remove readonly from zero
    })
    .filter(label => !!label);

  const studyState = cardStudyState
    ? toCardStudyState(cardStudyState)
    : {...defaultStudyState, cardId: cardDB.id};

  return {
    ...cardDB,
    createdAt: new Date(createdAt), // Note: needed until zero supports dates
    updatedAt: new Date(updatedAt), // Note: needed until zero supports dates
    labels: matchedCardLabels,
    answer: JSON.parse(answer),
    studyState,
  };
};

export const toCardFromGenerated = (generatedCard: GeneratedCard): Card => {
  const cardId = nanoid();
  const now = new Date();
  return {
    id: cardId,
    userId: user.id,
    createdAt: now,
    updatedAt: now,
    question: generatedCard.question,
    answer: generatedCard.answer,
    studyState: {...defaultStudyState, cardId},
    labels: toLabels(generatedCard.labels),
  };
};

export const getCardStatusIconPath = (status: CardStatus) => {
  switch (status) {
    case 'new':
      return '/card-status/new.svg';
    case 'due':
      return '/card-status/due.svg';
    case 'done':
      return '/card-status/done.svg';
    case 'later':
      return '/card-status/later.svg';
    default:
      return '/card-status/later.svg';
  }
};

export const getCardStatus = (
  createdAt: Date,
  lastStudiedAt: Date | null,
  nextStudiedAt: Date | null,
): CardStatus => {
  const now = dayjs();

  if (now.isSame(createdAt, 'day')) {
    return 'new';
  }
  if (lastStudiedAt && now.isSame(lastStudiedAt, 'day')) {
    return 'done';
  }
  if (nextStudiedAt === null || now.isSameOrAfter(nextStudiedAt, 'day')) {
    return 'due';
  }
  return 'later';
};

export interface CardFilterOptions {
  status?: CardStatus[];
  labels?: string[];
  lastStudiedOnDay?: Date;
}

export const filterCards = (cards: Card[], options?: CardFilterOptions) => {
  if (!cards) return [];

  const statusFilters = options?.status;
  const labelFilters = options?.labels;
  const lastStudiedOnDayFilter = options?.lastStudiedOnDay;

  return cards.filter(card => {
    const currentCardStatus = getCardStatus(
      new Date(card.createdAt),
      card.studyState.lastStudiedAt,
      card.studyState.nextStudiedAt,
    );

    const statusMatch =
      !statusFilters ||
      statusFilters.length === 0 ||
      statusFilters.includes(currentCardStatus);

    const labelMatch =
      !labelFilters ||
      labelFilters.length === 0 ||
      card.labels.some(label => labelFilters.includes(label.name));

    const lastStudiedMatch =
      !lastStudiedOnDayFilter ||
      (card.studyState.lastStudiedAt &&
        dayjs(card.studyState.lastStudiedAt).isSame(
          dayjs(lastStudiedOnDayFilter),
          'day',
        ));

    return statusMatch && labelMatch && lastStudiedMatch;
  });
};

/**
 * Type guard to check if a streaming generated card is complete and valid.
 */
export const isCompleteGeneratedCard = (
  item: StreamingGeneratedCard,
): item is GeneratedCard => {
  if (!item || typeof item !== 'object') {
    return false;
  }

  const candidate = item as Record<string, unknown>;

  return (
    typeof candidate.question === 'string' &&
    typeof candidate.answer === 'string' &&
    Array.isArray(candidate.labels) &&
    candidate.labels.every((label: unknown) => typeof label === 'string')
  );
};

/**
 * Hook for managing selection state of generated cards during the streaming generation process.
 */
export const useGeneratedCardSelection = (
  generatedCards?: StreamingGeneratedCard[],
  options: {
    autoSelectAll?: boolean;
  } = {},
) => {
  const {autoSelectAll = true} = options;

  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set(),
  );

  const cards = useMemo(
    () => generatedCards?.filter(isCompleteGeneratedCard) || [],
    [generatedCards],
  );

  // Auto-select behavior
  useEffect(() => {
    if (autoSelectAll && cards.length > 0) {
      setSelectedIndices(new Set(cards.map((_, index) => index)));
    }
  }, [cards, autoSelectAll]);

  const selectedCards = useMemo(
    () => cards.filter((_, index) => selectedIndices.has(index)),
    [cards, selectedIndices],
  );

  const selectedCount = selectedIndices.size;
  const isEmpty = cards.length === 0;
  const hasSelection = selectedCount > 0;
  const isAllSelected = cards.length > 0 && selectedCount === cards.length;

  const select = (index: number) => {
    setSelectedIndices(prev => new Set(prev).add(index));
  };

  const deselect = (index: number) => {
    setSelectedIndices(prev => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const toggle = (index: number) => {
    setSelectedIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIndices(new Set(cards.map((_, index) => index)));
  };

  const deselectAll = () => {
    setSelectedIndices(new Set());
  };

  const isSelected = (index: number) => selectedIndices.has(index);

  return {
    // Data
    cards,
    selectedCards,
    selectedCount,

    // State
    isEmpty,
    hasSelection,
    isAllSelected,

    // Actions
    select,
    deselect,
    toggle,
    selectAll,
    deselectAll,

    // Utilities
    isSelected,
  };
};

/**
 * Build a context-aware prompt for generating cards that considers existing cards and labels.
 */
export const buildCardGenerationPrompt = (
  userPrompt: string,
  cards: readonly Card[],
  labels: readonly Label[],
) => {
  const simplifiedCards = cards.slice(0, 100).map(card => ({
    question: card.question,
    answer: card.answer,
    labels: card.labels.map(label => label.name),
  }));

  const labelNames = labels.map(label => label.name);

  return `
I need to generate flashcards based on the following user prompt: "${userPrompt}"

EXISTING CONTEXT:
${simplifiedCards.length > 0 ? `- Existing cards (${cards.length}, showing ${simplifiedCards.length}): ${JSON.stringify(simplifiedCards)}` : '- No existing cards'}
${labelNames.length > 0 ? `- Existing labels (${labelNames.length}): ${JSON.stringify(labelNames)}` : '- No existing labels'}

INSTRUCTIONS:
1. Generate relevant flashcards with clear questions and concise answers
2. Reuse existing labels when appropriate to maintain consistency
3. Only create new labels when absolutely necessary for topics not covered by existing labels
4. Try to keep total labels per card to 3 or fewer
5. Make sure each card has at least one label
6. Ensure all label names start with a capitalized first letter (e.g., "Mathematics", "History", "Science")

FORMAT:
Return an array of objects with 'question', 'answer', and 'labels' fields.
`;
};
