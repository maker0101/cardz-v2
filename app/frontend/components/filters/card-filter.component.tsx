import React, {useState} from 'react';
import {ChevronLeftIcon, ChevronRightIcon, FilterIcon} from 'lucide-react';

import {Button} from '@/frontend/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/frontend/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/frontend/ui/popover';
import {Checkbox} from '@/frontend/ui/checkbox';
import {useCardFiltersStore} from '@/domains/cards/stores/useCardFiltersStore';
import {type Card} from '@/domains/cards/cards.types';
import {CARD_STATUSES} from '@/domains/cards/cards.constants';
import {getCardStatusIconPath, filterCards} from '@/domains/cards/cards.utils';
import {capitalize, cn} from '@/lib/utils';

const FILTER_VIEWS = [
  {id: 'main', name: 'Main'},
  {id: 'status', name: 'Status'},
  {id: 'labels', name: 'Labels'},
] as const;

type FilterView = (typeof FILTER_VIEWS)[number]['id'];

interface FilterBackButtonProps {
  onBack: () => void;
}

const FilterBackButton: React.FC<FilterBackButtonProps> = ({onBack}) => {
  return (
    <CommandItem
      onSelect={onBack}
      className="cursor-pointer"
      value="__back__" // Unique value for CMDK to avoid conflicts
    >
      <ChevronLeftIcon className="mr-2 h-4 w-4" />
      Back
    </CommandItem>
  );
};

interface CardFilterProps {
  allLabels: string[];
  disabled?: boolean;
  cards: Card[];
}

export const CardFilter: React.FC<CardFilterProps> = ({
  allLabels,
  disabled,
  cards,
}) => {
  const [filterView, setFilterView] = useState<FilterView>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);

  const {
    status: selectedStatuses,
    labels: selectedLabels,
    toggleStatus,
    toggleLabel,
  } = useCardFiltersStore();

  const navigateToView = (view: FilterView) => {
    setFilterView(view);
    setSearchQuery('');
  };

  const visibleFilters = FILTER_VIEWS.filter(
    item =>
      item.id !== 'main' &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredStatuses = CARD_STATUSES.filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredLabels = allLabels.filter(l =>
    l.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Popover
      open={popoverOpen}
      onOpenChange={open => {
        setPopoverOpen(open);
        if (!open) navigateToView('main');
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="mt-0" disabled={disabled}>
          <FilterIcon className="h-3.5 w-3.5" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command className="max-h-96">
          {filterView === 'main' && (
            <>
              <CommandInput
                placeholder="Filter..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="h-9"
                autoFocus
              />
              <CommandList>
                <CommandEmpty>No matching filter.</CommandEmpty>
                <CommandGroup>
                  {visibleFilters.map(filter => {
                    return (
                      <CommandItem
                        key={filter.id}
                        value={filter.name}
                        onSelect={() => navigateToView(filter.id)}
                        className="flex cursor-pointer items-center justify-between"
                      >
                        <div className="flex items-center">
                          <span>{filter.name}</span>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </>
          )}

          {filterView === 'status' && (
            <>
              <CommandInput
                placeholder="Filter status..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="h-9"
                autoFocus
              />
              <CommandList>
                <CommandEmpty>No status found.</CommandEmpty>
                <CommandGroup>
                  <FilterBackButton onBack={() => navigateToView('main')} />
                  {filteredStatuses.map(status => {
                    const count = filterCards(cards, {
                      status: [status],
                    }).length;
                    return (
                      <CommandItem
                        key={status}
                        value={status}
                        onSelect={() => toggleStatus(status)}
                        className={cn(
                          'group flex cursor-pointer items-center justify-between',
                        )}
                      >
                        <div className="flex items-center">
                          <img
                            src={getCardStatusIconPath(status)}
                            alt={status}
                            width={16}
                            height={16}
                            className="mr-2"
                          />
                          <span>{capitalize(status)}</span>
                          {count > 0 && (
                            <span className="ml-3 text-xs text-muted-foreground opacity-75">
                              {count} cards
                            </span>
                          )}
                        </div>
                        <Checkbox
                          checked={selectedStatuses.includes(status)}
                          className={cn(
                            'hidden',
                            'group-hover:block',
                            'group-aria-selected:block',
                            selectedStatuses.includes(status) && 'block',
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </>
          )}

          {filterView === 'labels' && (
            <>
              <CommandInput
                placeholder="Filter label..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="h-9"
                autoFocus
              />
              <CommandList>
                <CommandEmpty>No label found.</CommandEmpty>
                <CommandGroup>
                  <FilterBackButton onBack={() => navigateToView('main')} />
                  {allLabels.length === 0 && !searchQuery && (
                    <CommandItem
                      disabled
                      className="justify-center text-xs text-muted-foreground"
                    >
                      No labels exist yet.
                    </CommandItem>
                  )}
                  {filteredLabels.map(label => {
                    const count = filterCards(cards, {
                      labels: [label],
                    }).length;
                    return (
                      <CommandItem
                        key={label}
                        value={label}
                        onSelect={() => toggleLabel(label)}
                        className={cn(
                          'group flex cursor-pointer items-center justify-between',
                        )}
                      >
                        <div className="flex items-center">
                          <span>{label}</span>
                          {count > 0 && (
                            <span className="ml-3 text-xs text-muted-foreground opacity-75">
                              {count} cards
                            </span>
                          )}
                        </div>
                        <Checkbox
                          checked={selectedLabels.includes(label)}
                          className={cn(
                            'hidden',
                            'group-hover:block',
                            'group-aria-selected:block',
                            selectedLabels.includes(label) && 'block',
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
