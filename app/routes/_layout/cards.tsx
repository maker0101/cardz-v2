import {HOTKEY_SCOPES} from '@/frontend/hooks/use-keyboard-shortcuts';
import {createFileRoute, useRouter} from '@tanstack/react-router';
import {useToolbar} from '@/frontend/hooks/use-toolbar';
import {useDialog} from '@/frontend/hooks/use-dialog';
import {
  useKeyboardShortcut,
  useHotkeyScope,
} from '@/frontend/hooks/use-keyboard-shortcuts';

import {
  useActiveCard,
  useSelectedCards,
  useCards,
  useRefineSelectionOnFilterChange,
  useTableSelection,
} from '@/domains/cards/cards.hooks';
import {useLabels} from '@/domains/labels/labels.hooks';
import {useCardFiltersStore} from '@/domains/cards/stores/useCardFiltersStore';
import {filterCards} from '@/domains/cards/cards.utils';

export const Route = createFileRoute('/_layout/cards')({
  component: CardsPage,
});

function CardsPage() {
  const {zero, session} = useRouter().options.context;
  const setActiveCardId = useActiveCard(state => state.setActiveCardId);
  const {isOpen, setIsOpen} = useToolbar();
  const {selectedCardIds, setSelectedCardIds} = useSelectedCards();

  const {cards, isLoading: isLoadingCards} = useCards(zero);
  const {labels, isLoading: isLoadingLabels} = useLabels(zero);

  const statusFilters = useCardFiltersStore(state => state.status);
  const labelFilters = useCardFiltersStore(state => state.labels);

  const filteredCards = filterCards(cards, {
    status: statusFilters,
    labels: labelFilters,
  });

  const {isSelected, toggleSelection, selectAll} = useTableSelection(cards);

  // When the user filters the cards, the selection should be refined to only include the cards that match the filter.
  useRefineSelectionOnFilterChange({
    filteredCards,
    selectedCardIds,
    setSelectedCardIds,
    isToolbarOpen: isOpen,
    setToolbarOpen: setIsOpen,
  });

  useHotkeyScope(HOTKEY_SCOPES.LIBRARY);

  const handleSelectAll = () => {
    if (!isOpen) setIsOpen(true);
    if (statusFilters.length > 0 || labelFilters.length > 0) {
      setSelectedCardIds(filteredCards.map(card => card.id));
    } else {
      selectAll();
    }
  };

  useKeyboardShortcut({
    name: 'Select All Cards',
    description: 'Select all cards in the library view',
    keys: 'mod+a',
    scope: HOTKEY_SCOPES.LIBRARY,
    action: handleSelectAll,
  });

  const {openDialog} = useDialog();

  const openCardDialog = (cardId?: string) => {
    openDialog('CardDialog', {
      props: {
        card: cardId ? (cards.find(card => card.id === cardId) ?? null) : null,
      },
      ...(cardId && {
        onOpen: () => setActiveCardId(cardId),
        onClose: () => setActiveCardId(null),
      }),
    });
  };

  return <div>Hello "/_layout/cards"!</div>;
}
