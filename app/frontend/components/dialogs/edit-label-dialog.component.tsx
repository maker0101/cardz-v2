'use client';

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
import {update as updateLabel} from '@/domains/labels/labels.db';
import {EditLabelDialogProps} from '@/frontend/components/dialogs/dialogs.types';

export const EditLabelDialog: React.FC<EditLabelDialogProps> = ({
  z,
  label,
  onClose,
}) => {
  const [labelName, setLabelName] = useState(label.name);

  const handleEditLabel = async () => {
    if (!labelName.trim()) return;
    await updateLabel(z, label.id, {name: labelName.trim()});
    setLabelName('');
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit label</DialogTitle>
          <DialogDescription>Update the label name</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="edit-name" className="text-sm font-medium">
              Label name
            </label>
            <Input
              id="edit-name"
              value={labelName}
              onChange={e => setLabelName(e.target.value)}
              placeholder="Enter label name"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleEditLabel();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleEditLabel} disabled={!labelName.trim()}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
