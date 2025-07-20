'use client';

import {useMemo} from 'react';
import {
  DialogName,
  DialogPropsMap,
} from '@/frontend/components/dialogs/dialogs.types';
import {useDialog} from '@/frontend/components/dialogs/dialogs.hooks';
import {CardDialog} from '@/frontend/components/dialogs/card-dialog/card-dialog.component';
import {CommandDialog} from '@/frontend/components/dialogs/command-dialog/command-dialog.component';
import {CardGenerationDialog} from '@/frontend/components/dialogs/card-generation-dialog/card-generation-dialog.component';
import {LabelsDialog} from '@/frontend/components/dialogs/labels-dialog/labels-dialog.component';
import {RemoveLabelDialog} from '@/frontend/components/dialogs/remove-label-dialog/remove-label-dialog.component';
import {CreateLabelDialog} from '@/frontend/components/dialogs/create-label-dialog.component';
import {EditLabelDialog} from '@/frontend/components/dialogs/edit-label-dialog.component';

const createDialogComponent = (
  name: DialogName,
  props: DialogPropsMap[DialogName],
  onClose: () => void,
) => {
  switch (name) {
    case 'CardDialog':
      return (
        <CardDialog
          {...(props as DialogPropsMap['CardDialog'])}
          onClose={onClose}
        />
      );
    case 'CommandDialog':
      return (
        <CommandDialog
          {...(props as DialogPropsMap['CommandDialog'])}
          onClose={onClose}
        />
      );
    case 'CardGenerationDialog':
      return (
        <CardGenerationDialog
          {...(props as DialogPropsMap['CardGenerationDialog'])}
          onClose={onClose}
        />
      );
    case 'LabelsDialog':
      return (
        <LabelsDialog
          {...(props as DialogPropsMap['LabelsDialog'])}
          onClose={onClose}
        />
      );
    case 'RemoveLabelDialog':
      return (
        <RemoveLabelDialog
          {...(props as DialogPropsMap['RemoveLabelDialog'])}
          onClose={onClose}
        />
      );
    case 'CreateLabelDialog':
      return (
        <CreateLabelDialog
          {...(props as DialogPropsMap['CreateLabelDialog'])}
          onClose={onClose}
        />
      );
    case 'EditLabelDialog':
      return (
        <EditLabelDialog
          {...(props as DialogPropsMap['EditLabelDialog'])}
          onClose={onClose}
        />
      );
    default:
      return null;
  }
};

const DialogManager = () => {
  const {dialog, closeDialog} = useDialog();

  const dialogComponent = useMemo(() => {
    if (!dialog) return null;
    return createDialogComponent(dialog.name, dialog.props, closeDialog);
  }, [dialog, closeDialog]);

  return dialogComponent;
};

export default DialogManager;
