import {CardDialogProps} from '@/frontend/components/dialogs/card-dialog/card-dialog.types';
import {CommandDialogProps} from '@/frontend/components/dialogs/command-dialog/command-dialog.types';
import {CardGenerationDialogProps} from '@/frontend/components/dialogs/card-generation-dialog/card-generation-dialog.types';
import {LabelsDialogProps} from '@/frontend/components/dialogs/labels-dialog/labels-dialog.types';
import {RemoveLabelDialogProps} from '@/frontend/components/dialogs/remove-label-dialog/remove-label-dialog.types';
import {Label} from '@/domains/labels/labels.types';
import {ZeroType} from 'zero/zero.types';

export type DialogName =
  | 'CardDialog'
  | 'CommandDialog'
  | 'CardGenerationDialog'
  | 'LabelsDialog'
  | 'RemoveLabelDialog'
  | 'CreateLabelDialog'
  | 'EditLabelDialog';

export type CreateLabelDialogProps = {
  z: ZeroType;
  onClose: () => void;
};

export type EditLabelDialogProps = {
  z: ZeroType;
  label: Label;
  onClose: () => void;
};

export type DialogPropsMap = {
  CardDialog: CardDialogProps;
  CommandDialog: CommandDialogProps;
  CardGenerationDialog: CardGenerationDialogProps;
  LabelsDialog: LabelsDialogProps;
  RemoveLabelDialog: RemoveLabelDialogProps;
  CreateLabelDialog: CreateLabelDialogProps;
  EditLabelDialog: EditLabelDialogProps;
};

export interface DialogUtils {
  openDialog: <T extends DialogName>(
    name: T,
    options: {
      props: DialogPropsMap[T];
      onClose?: () => void;
      onOpen?: () => void;
    },
  ) => void;
  closeDialog: () => void;
}

export interface DialogState extends DialogUtils {
  dialog: {
    name: DialogName;
    props: DialogPropsMap[DialogName];
    onClose?: () => void;
    onOpen?: () => void;
  } | null;
}
