import React, {useState} from 'react';
import {DialogTitle, DialogDescription} from '@/frontend/ui/dialog';
import {
  CommandDialog as CommandDialogUI,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/frontend/ui/command';
import {Checkbox} from '@/frontend/ui/checkbox';
import {useLabels} from '@/domains/labels/labels.hooks';
import {useCards} from '@/domains/cards/cards.hooks';
import {updateCard as updateCard} from '@/domains/cards/cards.db';
import {LabelsDialogProps} from './labels-dialog.types';
import {toast} from 'sonner';
import {cn} from '@/frontend/lib/utils';

export const LabelsDialog: React.FC<LabelsDialogProps> = ({
  db,
  cardIds,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState('');
  const {labels} = useLabels(db);
  const {cards} = useCards(db);

  const getLabelState = (labelId: string) => {
    const selectedCards = cards.filter(card => cardIds.includes(card.id));

    if (selectedCards.length === 0)
      return {isSelected: false, isIndeterminate: false};

    const cardsWithLabel = selectedCards.filter(card =>
      card.labels.some(l => l.id === labelId),
    ).length;

    if (cardsWithLabel === selectedCards.length)
      return {isSelected: true, isIndeterminate: false};
    if (cardsWithLabel > 0) return {isSelected: false, isIndeterminate: true};
    return {isSelected: false, isIndeterminate: false};
  };

  const toggleLabel = async (labelId: string) => {
    const {isSelected, isIndeterminate} = getLabelState(labelId);
    const shouldHaveLabel = isIndeterminate ? true : !isSelected;

    try {
      const cardsToUpdate = cards.filter(card => cardIds.includes(card.id));

      const updates = cardsToUpdate.map(card => ({
        cardId: card.id,
        changeSet: {
          labels: labels.filter(label => {
            if (label.id === labelId) return shouldHaveLabel;
            return card.labels.some(l => l.id === label.id);
          }),
        },
      }));

      if (updates.length > 0) {
        await updateCard(db, updates);
      }
    } catch (error) {
      toast.error('Failed to update labels.');
    }
  };

  return (
    <CommandDialogUI open onOpenChange={onClose} showCloseButton={false}>
      <DialogTitle />
      <DialogDescription />

      {cardIds.length > 0 && (
        <div className="p-3 pb-1">
          <span className="text-[color:hsl(220,5.66%,89.61%))] inline-flex items-center rounded-[5px] border-[0.5px] border-[color:hsl(222.86,7.37%,18.63%)] bg-[hsl(222.86,10.45%,13.14%)] px-2 py-1 text-xs">
            {`${cardIds.length} card${cardIds.length > 1 ? 's' : ''}`}
          </span>
        </div>
      )}

      <CommandInput
        placeholder="Change or add labels..."
        value={inputValue}
        onValueChange={setInputValue}
        className="ml-1"
      />

      <CommandList>
        <CommandEmpty>
          <div className="p-2 text-center text-sm">
            No matching labels found
          </div>
        </CommandEmpty>

        {labels.length > 0 && (
          <CommandGroup heading="Labels">
            {labels.map(label => {
              const {isSelected, isIndeterminate} = getLabelState(label.id);

              return (
                <CommandItem
                  key={label.id}
                  onSelect={() => toggleLabel(label.id)}
                  value={label.name}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={isSelected}
                    className={cn(
                      'mr-2',
                      isIndeterminate
                        ? 'bg-[color:hsl(234.26,55.56%,59.41%)] bg-opacity-50'
                        : '',
                    )}
                    onClick={e => e.stopPropagation()}
                  />
                  <span
                    className={
                      isSelected || isIndeterminate ? 'text-primary' : ''
                    }
                  >
                    {label.name}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialogUI>
  );
};
