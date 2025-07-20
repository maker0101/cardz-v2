import React, {useState} from 'react';
import {Button} from '@/frontend/ui/button';
import {Input} from '@/frontend/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/frontend/ui/dialog';
import {insertLabels as insertLabels} from '@/domains/labels/labels.db';
import {CreateLabelDialogProps} from '@/frontend/components/dialogs/dialogs.types';

export const CreateLabelDialog: React.FC<CreateLabelDialogProps> = ({
  db,
  onClose,
}) => {
  const [labelName, setLabelName] = useState('');

  const handleCreateLabel = async () => {
    if (!labelName.trim()) return;

    await insertLabels(db, {name: labelName.trim()});
    setLabelName('');
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new label</DialogTitle>
          <DialogDescription>
            Add a new label to organize your cards
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Label name
            </label>
            <Input
              id="name"
              value={labelName}
              onChange={e => setLabelName(e.target.value)}
              placeholder="Enter label name"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleCreateLabel();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateLabel} disabled={!labelName.trim()}>
            Create label
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
