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
import {Card} from '@/domains/cards/cards.types';
import {Spinner} from '@/frontend/ui/spinner';
import {Button} from '@/frontend/ui/button';
import {PlusIcon} from 'lucide-react';
import {Table, TableBody, TableCell, TableRow} from '@/frontend/ui/table';
import {CardTitle} from '@/frontend/ui/card';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/frontend/ui/tooltip';
import {Toolbar} from '@/frontend/components/toolbar/toolbar.component';
import {CardFilter} from '@/frontend/components/filters/card-filter.component';
import {ActiveFilters} from '@/frontend/components/filters/active-filters.component';
import {
  getCardStatus,
  getCardStatusIconPath,
} from '@/domains/cards/cards.utils';
import {capitalize} from '@/lib/utils';
import {sortLabelsByName} from '@/domains/labels/labels.utils';
import {cn} from '@/lib/utils';
import {ZeroType} from 'zero/zero.types';
import {Checkbox} from '@/frontend/ui/checkbox';
import {nextStudyMessage} from '@/domains/studies/studies.core';
import {Badge} from '@/frontend/ui/badge';
import {AppPageLayout} from '@/frontend/layouts/app-page-layout';

export const Route = createFileRoute('/_layout/cards')({
  component: CardsPage,
});

function CardsPage() {
  const {zero} = useRouter().options.context;
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

  return (
    <AppPageLayout
      header={<LibraryHeader onAddCard={() => openCardDialog()} />}
      subheader={
        <LibrarySubHeader
          allLabels={labels.map(label => label.name).sort()}
          isFilterDisabled={isLoadingLabels}
          cards={cards}
        />
      }
    >
      <LibraryContent
        z={zero}
        isLoading={isLoadingCards || isLoadingLabels}
        cards={cards}
        filteredCards={filteredCards}
        openCardDialog={openCardDialog}
        isSelected={isSelected}
        toggleSelection={toggleSelection}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </AppPageLayout>
  );
}

interface LibraryContentProps {
  z: ZeroType;
  isLoading: boolean;
  cards: Card[];
  filteredCards: Card[];
  openCardDialog: (cardId?: string) => void;
  isSelected: (cardId: string) => boolean;
  toggleSelection: (
    selected: boolean,
    cardId: string,
    index: number,
    shiftKey?: boolean,
  ) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const LibraryContent: React.FC<LibraryContentProps> = props => {
  const {
    z,
    isLoading,
    cards,
    filteredCards,
    openCardDialog,
    isSelected,
    toggleSelection,
    isOpen,
    setIsOpen,
  } = props;

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Spinner className="animate-fade-in text-accent-foreground/10" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-sm text-[color:hsl(228,10.2%,90.39%)]">
          No cards yet. Start creating some.
        </p>
        <Button onClick={() => openCardDialog()}>
          <PlusIcon className="m-0 h-3.5 w-3.5 p-0" />
          Create card
        </Button>
      </div>
    );
  }

  if (filteredCards.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-sm text-[color:hsl(228,10.2%,90.39%)]">
          No cards match the current filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableBody>
          {filteredCards.map((card, index) => (
            <CardRow
              key={card.id}
              card={card}
              index={index}
              selected={isSelected(card.id)}
              onSelect={(selected, shiftKey) =>
                toggleSelection(selected, card.id, index, shiftKey)
              }
              onClick={() => openCardDialog(card.id)}
            />
          ))}
        </TableBody>
      </Table>

      <Toolbar
        z={z}
        isOpen={isOpen}
        onOpen={() => {}}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export interface LibraryHeaderProps {
  onAddCard: () => void;
}

const LibraryHeader: React.FC<LibraryHeaderProps> = props => {
  const {onAddCard} = props;

  return (
    <div className="flex w-full items-center justify-between">
      <CardTitle className="text-sm">Library</CardTitle>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="mt-0"
            onClick={onAddCard}
          >
            <PlusIcon className="h-3.5 w-3.5 text-[#969799]" />
            <span>Create card</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Create new card</TooltipContent>
      </Tooltip>
    </div>
  );
};

export interface LibrarySubHeaderProps {
  allLabels: string[];
  isFilterDisabled?: boolean;
  cards: Card[];
}

const LibrarySubHeader: React.FC<LibrarySubHeaderProps> = props => {
  const {allLabels, isFilterDisabled, cards} = props;

  return (
    <div className="flex h-full items-center gap-2">
      <CardFilter
        allLabels={allLabels}
        disabled={isFilterDisabled}
        cards={cards}
      />
      <ActiveFilters />
    </div>
  );
};

export interface CardRowProps {
  card: Card;
  index: number;
  selected: boolean;
  onSelect: (selected: boolean, shiftKey?: boolean) => void;
  onClick: () => void;
}

const CardRow = (props: CardRowProps) => {
  const {card, selected, onSelect, onClick} = props;

  const status = getCardStatus(
    card.createdAt,
    card.studyState.lastStudiedAt,
    card.studyState.nextStudiedAt,
  );

  return (
    <TableRow
      className={cn(
        'flex h-[45px] cursor-default items-center py-0 pr-2',
        selected &&
          'bg-[color:hsl(234,35%,16%)] bg-opacity-70 hover:bg-[color:hsl(234,35%,16%)] hover:bg-opacity-100',
      )}
      onClick={onClick}
    >
      <TableCell
        className="group h-8 w-9 flex-none cursor-default pl-2.5"
        onClick={e => {
          e.stopPropagation();
          onSelect(!selected, e.shiftKey);
        }}
      >
        <Checkbox
          checked={selected}
          className={selected ? 'block' : 'hidden group-hover:block'}
        />
      </TableCell>

      <TableCell className="w-8 flex-none px-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <img
              src={getCardStatusIconPath(status)}
              alt="Card status"
              width={18}
              height={18}
              className="select-none"
            />
          </TooltipTrigger>
          <TooltipContent side="right">
            {capitalize(status)}{' '}
            {nextStudyMessage(card.studyState.nextStudiedAt, status)}
          </TooltipContent>
        </Tooltip>
      </TableCell>

      <TableCell className="min-w-0 flex-grow border-none px-0">
        <div className="select-none truncate">{card.question}</div>
      </TableCell>

      <TableCell className="flex items-center gap-1.5">
        {sortLabelsByName(card.labels).map(label => (
          <Badge
            key={label.id}
            variant="outline"
            className="select-none whitespace-nowrap"
          >
            {label.name}
          </Badge>
        ))}
      </TableCell>
    </TableRow>
  );
};
