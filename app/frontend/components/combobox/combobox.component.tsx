'use client';

import React from 'react';
import {PlusIcon, TagIcon} from 'lucide-react';
import {cn} from '@/lib/utils';
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
import {ComboboxOption} from './combobox.types';
import {useCombobox} from './combobox.hooks';
import {EMPTY_COMBOBOX_VALUE} from './combobox.core';

interface ComboboxProps {
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onSelect: (values: string[]) => void;
  onCreate: (labelName: string) => Promise<string | undefined>;
  className?: string;
  defaultValue?: string[];
}

const Combobox = (props: ComboboxProps) => {
  const {
    options,
    placeholder = 'Select options...',
    searchPlaceholder = 'Search options...',
    emptyMessage = 'Create new option',
    onSelect,
    onCreate,
    className,
    defaultValue = [],
  } = props;

  const {
    open,
    setOpen,
    values,
    search,
    setSearch,
    filteredOptions,
    handleSelect,
  } = useCombobox({
    options,
    defaultValue,
    onSelect,
    onCreate,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-controls="combobox"
          aria-expanded={open}
          className={cn(
            'flex min-h-11 w-full cursor-default items-center justify-between gap-2 rounded-md px-3 py-1.5 text-sm ring-offset-background hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <TagIcon className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <div className="truncate text-muted-foreground">
              {values.length === 0 ? (
                placeholder
              ) : (
                <div className="flex max-w-full flex-wrap items-center gap-1">
                  {values.map(value => {
                    const option = options.find(opt => opt.value === value);
                    if (!option) return null;

                    return (
                      <div
                        key={option.value}
                        className="flex items-center gap-1 rounded-2xl border bg-secondary/30 px-3 py-1 text-sm text-white"
                      >
                        <span className="truncate">{option.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-[200px] p-0">
        <Command className="border-none" shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
            onValueChange={setSearch}
            value={search}
          />
          <CommandList>
            <CommandGroup>
              {filteredOptions.map(option => {
                const checked = values.includes(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    className="group"
                  >
                    <div className="flex h-6 w-6 items-center">
                      <Checkbox
                        checked={checked}
                        className={cn(
                          checked
                            ? 'pointer-events-none block'
                            : 'pointer-events-none opacity-0 group-hover:opacity-100',
                        )}
                      />
                    </div>
                    {option.label}
                  </CommandItem>
                );
              })}

              {filteredOptions.length === 0 && (
                <CommandItem
                  key={EMPTY_COMBOBOX_VALUE}
                  value={EMPTY_COMBOBOX_VALUE}
                  onSelect={handleSelect}
                  className="aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <PlusIcon className="mr-2 h-4 w-4 opacity-50" />
                  {`${emptyMessage}${!!search ? ': ' : ''} `}&nbsp;
                  {!!search && (
                    <span className="text-muted-foreground">{`"${search}"`}</span>
                  )}
                </CommandItem>
              )}
            </CommandGroup>
            <CommandEmpty className="hidden" />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
