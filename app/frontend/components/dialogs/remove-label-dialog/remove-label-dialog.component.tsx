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
import {useLabels} from '@/domains/labels/labels.hooks';
import {useCards} from '@/domains/cards/cards.hooks';
import {updateCard as updateCard} from '@/domains/cards/cards.db';
import {RemoveLabelDialogProps} from '@/frontend/components/dialogs/remove-label-dialog/remove-label-dialog.types';
import {toast} from 'sonner';

export const RemoveLabelDialog: React.FC<RemoveLabelDialogProps> = ({
  db,
  cardIds,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState('');
  const {labels} = useLabels(db);
  const {cards} = useCards(db);

  const selectedCards = cards.filter(card => cardIds.includes(card.id));

  const labelIdsInSelection = new Set<string>();

  if (selectedCards.length > 0) {
    selectedCards.forEach(card => {
      card.labels.forEach(label => labelIdsInSelection.add(label.id));
    });
  }

  const relevantLabels = labels.filter(label =>
    labelIdsInSelection.has(label.id),
  );

  const removeLabel = async (labelIdToRemove: string) => {
    try {
      const cardsToUpdate = cards.filter(card => cardIds.includes(card.id));

      const updates = cardsToUpdate
        .filter(card => card.labels.some(l => l.id === labelIdToRemove))
        .map(card => ({
          cardId: card.id,
          changeSet: {
            labels: card.labels.filter(label => label.id !== labelIdToRemove),
          },
        }));

      if (updates.length > 0) {
        await updateCard(db, updates);
      }
    } catch (error) {
      toast.error('Failed to remove label.');
    } finally {
      onClose();
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
        placeholder="Select a label to remove..."
        value={inputValue}
        onValueChange={setInputValue}
        className="ml-1"
      />

      <CommandList>
        <CommandEmpty>
          <div className="p-2 text-center text-sm">
            {relevantLabels.length === 0
              ? 'Selected cards have no common labels to remove.'
              : 'No matching labels found.'}
          </div>
        </CommandEmpty>

        {relevantLabels.length > 0 && (
          <CommandGroup heading="Labels to remove">
            {relevantLabels
              .filter(label =>
                label.name.toLowerCase().includes(inputValue.toLowerCase()),
              )
              .map(label => (
                <CommandItem
                  key={label.id}
                  onSelect={() => removeLabel(label.id)}
                  value={label.name} // Keep value for filtering
                  className="flex cursor-pointer items-center gap-2"
                >
                  {/* Removed Checkbox */}
                  {/* Icon can be added here if desired, e.g., <TagIcon className="h-4 w-4 mr-2" /> */}
                  <span>{label.name}</span>
                </CommandItem>
              ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialogUI>
  );
};
