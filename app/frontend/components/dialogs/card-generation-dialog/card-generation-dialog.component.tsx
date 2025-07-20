'use client';

import {useState, useMemo} from 'react';
import {experimental_useObject as useObject} from '@ai-sdk/react';
import {DialogTitle} from '@/frontend/ui/dialog';
import {
  Card,
  GeneratedCard,
  generatedCardsSchema,
} from '@/domains/cards/cards.types';
import {API_ROUTES} from 'shared/routes';
import {Button} from '@/frontend/ui/button';
import {toast} from 'sonner';
import {Loader2, Layers} from 'lucide-react';
import {
  CommandDialog,
  CommandItem,
  CommandList,
  CommandInput,
  CommandEmpty,
} from '@/frontend/ui/command';
import {Checkbox} from '@/frontend/ui/checkbox';
import {Badge} from '@/frontend/ui/badge';
import {cn} from '@/frontend/lib/utils';
import {useCards} from '@/domains/cards/cards.hooks';
import {useLabels} from '@/domains/labels/labels.hooks';
import {Label} from '@/domains/labels/labels.types';
import {resolveLabelNames} from '@/domains/labels/labels.utils';
import {
  useGeneratedCardSelection,
  buildCardGenerationPrompt,
} from '@/domains/cards/cards.utils';
import {CardGenerationDialogProps} from '@/frontend/components/dialogs/card-generation-dialog/card-generation-dialog.types';
import {insert as insertCards} from '@/domains/cards/cards.db';

export const CardGenerationDialog = (props: CardGenerationDialogProps) => {
  const {z, onClose, initialPrompt} = props;
  const [message, setMessage] = useState(initialPrompt);
  const {cards, isLoading: isLoadingCards} = useCards(z);
  const {labels, isLoading: isLoadingLabels} = useLabels(z);

  const {
    object: generatedCards,
    submit,
    isLoading: isGenerating,
  } = useObject({
    api: API_ROUTES.Cards.Generate,
    schema: generatedCardsSchema,
  });

  const {
    cards: validGeneratedCards,
    selectedCards,
    selectedCount,
    hasSelection,
    isSelected,
    toggle,
    deselectAll,
  } = useGeneratedCardSelection(generatedCards);

  // Create a centralized label resolution map to ensure consistency
  const labelResolutionMap = useMemo(() => {
    const map = new Map<string, Label>();

    // Collect all unique label names from generated cards
    const allLabelNames = new Set<string>();
    validGeneratedCards.forEach(card => {
      card.labels?.forEach(labelName => {
        allLabelNames.add(labelName.toLowerCase());
      });
    });

    // Resolve each unique label name once
    Array.from(allLabelNames).forEach(labelName => {
      const resolved = resolveLabelNames([labelName], labels)[0];
      if (resolved) {
        map.set(labelName, resolved);
      }
    });

    return map;
  }, [validGeneratedCards, labels]);

  const handleSubmitInput = (text: string) => {
    if (!text.trim()) return;

    submit({prompt: buildCardGenerationPrompt(text, cards, labels)});
  };

  const handleSaveSelectedCards = async () => {
    if (!hasSelection || validGeneratedCards.length === 0) return;

    try {
      const cardsToInsert = selectedCards.map(card => ({
        question: card.question,
        answer: card.answer,
        labels: (card.labels || [])
          .map(labelName => labelResolutionMap.get(labelName.toLowerCase()))
          .filter((label): label is Label => label !== undefined),
      }));

      await insertCards(z, cardsToInsert);

      deselectAll();
      onClose();
    } catch (error) {
      toast.error('Failed to save cards. Please try again.');
    }
  };

  return (
    <CommandDialog
      open={true}
      onOpenChange={isOpen => {
        if (!isOpen) {
          deselectAll();
          onClose();
        }
      }}
      // shouldFilter={false}
    >
      <DialogTitle className="px-4 pb-2 pt-4 text-sm font-normal text-[color:hsl(228,10.2%,90.39%)]">
        Generate Cards
      </DialogTitle>

      <div className="flex w-full items-center justify-between px-0 py-3">
        <div className="flex-grow">
          <CommandInput
            value={message}
            onValueChange={setMessage}
            placeholder="Type to generate cards..."
            onKeyDown={e => {
              if (
                e.key === 'Enter' &&
                !isGenerating &&
                !isLoadingCards &&
                !isLoadingLabels &&
                message.trim()
              ) {
                handleSubmitInput(message);
              }
            }}
            className="mx-1 h-8 text-sm"
            disabled={isGenerating || isLoadingCards || isLoadingLabels}
          />
        </div>
      </div>

      <CommandList className="max-h-[calc(80vh-140px)]">
        {validGeneratedCards.map((generatedCard, index) => {
          const resolvedLabels = (generatedCard.labels || [])
            .map(labelName => labelResolutionMap.get(labelName.toLowerCase()))
            .filter((label): label is Label => label !== undefined);
          const cardIsSelected = isSelected(index);

          return (
            <CommandItem
              key={`generated-card-${index}`}
              onSelect={() => {
                toggle(index);
              }}
              value={`${generatedCard.question} ${generatedCard.answer} ${resolvedLabels.map((label: Label) => label.name).join(' ')}`}
              className={cn(
                'group relative flex cursor-default select-none items-start rounded-sm px-2 py-2.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
              )}
            >
              <div className="flex w-full items-start space-x-3">
                <Checkbox
                  checked={cardIsSelected}
                  onCheckedChange={() => {
                    toggle(index);
                  }}
                  aria-label={`Select card: ${generatedCard.question}`}
                  id={`select-generated-card-${index}`}
                  className="mt-1"
                  onClick={e => {
                    e.stopPropagation();
                  }}
                />
                <div className="mt-0.5 flex flex-grow items-center gap-4 overflow-hidden">
                  <p className="truncate font-medium leading-snug">
                    {generatedCard.question}
                  </p>
                  <p className="truncate text-muted-foreground">
                    {generatedCard.answer}
                  </p>
                </div>

                <div className="flex shrink-0 items-center justify-start">
                  {resolvedLabels && resolvedLabels.length > 0 && (
                    <>
                      {resolvedLabels.slice(0, 2).map((label: Label) => (
                        <Badge
                          key={label.id}
                          variant="outline"
                          className="mb-1 px-1.5 py-0.5 text-xs"
                        >
                          {label.name}
                        </Badge>
                      ))}
                      {resolvedLabels.length > 2 && (
                        <Badge
                          variant="outline"
                          className="px-1.5 py-0.5 text-xs"
                        >
                          +{resolvedLabels.length - 2} more
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CommandItem>
          );
        })}
        <CommandEmpty>
          {isGenerating ? (
            <div className="flex h-24 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex h-24 flex-col items-center justify-center text-muted-foreground">
              <Layers className="mb-2 h-8 w-8" />
              <p>Your generated cards will appear here</p>
            </div>
          )}
        </CommandEmpty>
      </CommandList>

      {validGeneratedCards.length > 0 && (
        <div className="mt-auto flex justify-end border-t-[0.5px] border-[color:hsl(220,7.44%,23.73%)] px-3 py-3">
          <Button
            onClick={handleSaveSelectedCards}
            disabled={!hasSelection || isGenerating}
            className="h-8"
          >
            {isGenerating && hasSelection ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {`Add ${selectedCount} card${selectedCount !== 1 ? 's' : ''}`}
          </Button>
        </div>
      )}
    </CommandDialog>
  );
};
