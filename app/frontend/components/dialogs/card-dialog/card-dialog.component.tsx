'use client';

import {Controller, useForm} from 'react-hook-form';

import {Button} from '@/frontend/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/frontend/ui/dialog';
import Combobox from '@/frontend/components/combobox/combobox.component';
import {CardDialogProps} from './card-dialog.types';
import {CardFormValues} from '@/domains/cards/cards.types';
import {useLabels} from '@/domains/labels/labels.hooks';
// import {PlateEditor} from '@/frontend/components/editor/plate-editor';
import {Input} from '@/frontend/ui/input';
import {getLabelsByIds} from '@/domains/labels/labels.utils';
import {insertLabels as insertLabels} from '@/domains/labels/labels.db';
import {removeCards, upsertCard as upsertCard} from '@/domains/cards/cards.db';
import {Textarea} from '@/frontend/ui/textarea';

export const CardDialog: React.FC<
  CardDialogProps & {onClose: () => void}
> = props => {
  const {card, onClose, db} = props;

  const {labels} = useLabels(db);

  const {register, handleSubmit, setValue, control} = useForm<CardFormValues>({
    defaultValues: {
      question: card?.question,
      answer: card?.answer,
      labels: card?.labels || [],
    },
  });

  const onInsertLabel = async (labelName: string) => {
    const newLabels = await insertLabels(db, {name: labelName});
    if (newLabels.length > 0) return newLabels[0].id;
  };

  const onCardDelete = () => {
    if (card?.id) removeCards(db, [card.id]);
    onClose();
  };

  const onFormSubmit = async (cardData: CardFormValues) => {
    await upsertCard(db, cardData, card?.id);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <form>
        <DialogContent className="flex flex-col gap-4 p-0 sm:max-w-xl">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle className="text-sm font-normal text-[color:hsl(228,10.2%,90.39%)]">
              {!!card ? 'Edit card' : 'New card'}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="flex flex-col gap-4 px-3">
            <div className="flex flex-col gap-2 px-1">
              <Input
                id="question"
                placeholder="Question..."
                className="font-heading border-none bg-transparent px-0 text-xl font-bold focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                defaultValue={card?.question ?? undefined}
                {...register('question')}
              />
              <Textarea
                id="answer"
                placeholder="Answer..."
                className="font-heading border-none bg-transparent px-0 text-xl font-bold focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                defaultValue={card?.answer ?? undefined}
                {...register('answer')}
              />
            </div>
            <Combobox
              placeholder="Add Label"
              searchPlaceholder="Add labels"
              emptyMessage="Create new label"
              className="w-fit"
              options={labels.map(label => ({
                label: label.name,
                value: label.id,
              }))}
              // TODO: Allow multiple labels
              defaultValue={card?.labels.map(label => label.id)}
              onSelect={async labelIds => {
                const labels = await getLabelsByIds(db, labelIds);
                setValue('labels', labels);
              }}
              onCreate={onInsertLabel}
            />
          </div>

          <DialogFooter className="border-t-[0.5px] border-[color:hsl(220,7.44%,23.73%)] px-3 py-3">
            {!!card && (
              <Button variant="secondary" onClick={onCardDelete}>
                Delete card
              </Button>
            )}
            <Button
              variant="default"
              type="submit"
              onClick={handleSubmit(onFormSubmit)}
            >
              {card ? 'Save card' : 'Create card'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
