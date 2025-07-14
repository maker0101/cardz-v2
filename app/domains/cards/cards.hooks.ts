import dayjs from 'dayjs';
import {useQuery} from '@rocicorp/zero/react';
import {create} from 'zustand';
import {user} from 'shared/user';
import {filterCards, toCardFromCardDB} from '@/domains/cards/cards.utils';
import {useLabels} from '@/domains/labels/labels.hooks';
import {
  ActiveCardState,
  CardDB,
  SelectedCardsState,
  type Card,
} from '@/domains/cards/cards.types';
import {useGetOnDemandStudy} from '@/domains/studies/studies.hooks';
import {useState, useEffect} from 'react';
import {useToolbar} from '@/frontend/hooks/use-toolbar';
import {useHotkeys} from 'react-hotkeys-hook';
import {ZeroType} from 'zero/zero.types';
import * as cardQueries from '@/domains/cards/cards.queries';

/* -------------------------------
 * Zustand store
 * ------------------------------- */

export const useActiveCard = create<ActiveCardState>(set => ({
  activeCardId: null,
  setActiveCardId: id => set({activeCardId: id}),
}));

export const useSelectedCards = create<SelectedCardsState>(set => ({
  selectedCardIds: [],
  setSelectedCardIds: (ids: string[]) => set({selectedCardIds: ids}),
}));

/* -------------------------------
 * Custom hooks
 * ------------------------------- */

const useGetCardsDB = (
  z: ZeroType,
): {
  cardsDB: readonly CardDB[];
  isLoading: boolean;
} => {
  const query = cardQueries.getAll(z, user.id);

  const [cardsDB, details] = useQuery(query);

  return {cardsDB, isLoading: details.type !== 'complete'};
};

export const useCards = (
  z: ZeroType,
): {
  cards: Card[];
  isLoading: boolean;
} => {
  const {cardsDB, isLoading: isLoadingCardsDB} = useGetCardsDB(z);
  const {labels, isLoading: isLoadingLabels} = useLabels(z);

  return {
    cards: cardsDB.map(card => toCardFromCardDB(card, labels)),
    isLoading: isLoadingCardsDB || isLoadingLabels,
  };
};

export const useDueCards = (
  z: ZeroType,
): {
  queue: Card[];
  history: Card[];
  isLoading: boolean;
} => {
  const {cards, isLoading} = useCards(z);

  const cardsDue = filterCards(cards, {status: ['due']});
  const cardsStudiedToday = filterCards(cards, {
    lastStudiedOnDay: dayjs().toDate(),
  });

  return {
    queue: cardsDue,
    history: cardsStudiedToday,
    isLoading,
  };
};

export const useOnDemandCards = (
  z: ZeroType,
): {
  queue: Card[];
  history: Card[];
  isLoading: boolean;
} => {
  const {cards, isLoading: isLoadingCards} = useCards(z);
  const {study, isLoading: isLoadingStudy} = useGetOnDemandStudy(z);

  if (!study) {
    return {
      queue: [],
      history: [],
      isLoading: isLoadingCards || isLoadingStudy,
    };
  }

  const queue = cards.filter(c =>
    study.onDemandStudyCards.some(
      rc => rc.cardId === c.id && rc.type === 'queue',
    ),
  );

  const history = cards.filter(c =>
    study.onDemandStudyCards.some(
      rc => rc.cardId === c.id && rc.type === 'history',
    ),
  );

  return {
    queue,
    history,
    isLoading: isLoadingCards || isLoadingStudy,
  };
};

/**
 * Custom hook for managing table selection with keyboard shortcuts
 */
export const useTableSelection = <T extends {id: string}>(items: T[]) => {
  const {selectedCardIds, setSelectedCardIds} = useSelectedCards();
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const {isOpen, setIsOpen} = useToolbar();

  const clearSelection = () => {
    if (selectedCardIds.length > 0) {
      setSelectedCardIds([]);
      setIsOpen(false);
    }
  };

  const selectAll = () => {
    const allItemIds = items.map(item => item.id);
    setSelectedCardIds(allItemIds);
    if (allItemIds.length > 0 && !isOpen) {
      setIsOpen(true);
    }
  };

  const toggleSelection = (
    selected: boolean,
    itemId: string,
    index: number,
    shiftKey = false,
  ) => {
    if (shiftKey && lastClickedIndex !== null && index !== lastClickedIndex) {
      // Handle shift+click to select a range
      const start = Math.min(lastClickedIndex, index);
      const end = Math.max(lastClickedIndex, index);
      const rangeIds = items.slice(start, end + 1).map(item => item.id);

      // Determine whether to select or deselect the range based on the current action
      if (selected) {
        const newSelectedIds = [...new Set([...selectedCardIds, ...rangeIds])];
        setSelectedCardIds(newSelectedIds);
        if (!isOpen) setIsOpen(true);
      } else {
        const newSelectedIds = selectedCardIds.filter(
          id => !rangeIds.includes(id),
        );
        setSelectedCardIds(newSelectedIds);
        if (newSelectedIds.length === 0) setIsOpen(false);
      }
    } else {
      // Handle regular selection
      if (selected) {
        setSelectedCardIds([...selectedCardIds, itemId]);
        if (!isOpen) setIsOpen(true);
      } else {
        const newSelectedIds = selectedCardIds.filter(id => itemId !== id);
        const close = newSelectedIds.length === 0;
        if (close) setIsOpen(false);
        setSelectedCardIds(newSelectedIds);
      }
      // Update last clicked index
      setLastClickedIndex(index);
    }
  };

  // Register Escape key for clearing selection
  useHotkeys('esc', clearSelection, {}, [clearSelection]);

  // Return the selection state and handlers
  return {
    isSelected: (id: string) => selectedCardIds.includes(id),
    toggleSelection,
    clearSelection,
    selectAll,
    hasSelection: selectedCardIds.length > 0,
  };
};

interface UseRefineSelectionOnFilterChangeProps {
  filteredCards: Card[];
  selectedCardIds: string[];
  setSelectedCardIds: (ids: string[]) => void;
  isToolbarOpen: boolean;
  setToolbarOpen: (isOpen: boolean) => void;
}

export const useRefineSelectionOnFilterChange = ({
  filteredCards,
  selectedCardIds,
  setSelectedCardIds,
  isToolbarOpen,
  setToolbarOpen,
}: UseRefineSelectionOnFilterChangeProps): void => {
  useEffect(() => {
    if (selectedCardIds.length > 0) {
      const newlyFilteredSelectedIds = selectedCardIds.filter(id =>
        filteredCards.some(card => card.id === id),
      );

      const selectionChanged =
        newlyFilteredSelectedIds.length !== selectedCardIds.length ||
        !newlyFilteredSelectedIds.every(id => selectedCardIds.includes(id));

      if (selectionChanged) {
        setSelectedCardIds(newlyFilteredSelectedIds);
      }

      if (newlyFilteredSelectedIds.length === 0 && isToolbarOpen) {
        setToolbarOpen(false);
      }
    }
  }, [
    filteredCards,
    selectedCardIds,
    setSelectedCardIds,
    isToolbarOpen,
    setToolbarOpen,
  ]);
};
