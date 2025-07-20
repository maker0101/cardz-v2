import {CommandDialog} from '@/frontend/components/dialogs/command-dialog/command-dialog.component';
import {CommandDialogProps} from '@/frontend/components/dialogs/command-dialog/command-dialog.types';
import {CardDialog} from '@/frontend/components/dialogs/card-dialog/card-dialog.component';
import {CardDialogProps} from '@/frontend/components/dialogs/card-dialog/card-dialog.types';
import {CardGenerationDialog} from '@/frontend/components/dialogs/card-generation-dialog/card-generation-dialog.component';
import {CardGenerationDialogProps} from '@/frontend/components/dialogs/card-generation-dialog/card-generation-dialog.types';
import {LabelsDialog} from '@/frontend/components/dialogs/labels-dialog/labels-dialog.component';
import {LabelsDialogProps} from '@/frontend/components/dialogs/labels-dialog/labels-dialog.types';
import {RemoveLabelDialog} from '@/frontend/components/dialogs/remove-label-dialog/remove-label-dialog.component';
import {RemoveLabelDialogProps} from '@/frontend/components/dialogs/remove-label-dialog/remove-label-dialog.types';

export type Dialogs =
  | 'CommandDialog'
  | 'CardDialog'
  | 'CardGenerationDialog'
  | 'LabelsDialog'
  | 'RemoveLabelDialog';

export type DialogPropsMap = {
  CommandDialog: CommandDialogProps;
  CardDialog: CardDialogProps;
  CardGenerationDialog: CardGenerationDialogProps;
  LabelsDialog: LabelsDialogProps;
  RemoveLabelDialog: RemoveLabelDialogProps;
};

export const dialogsMap: Record<Dialogs, React.ComponentType<any>> = {
  CommandDialog,
  CardDialog,
  CardGenerationDialog,
  LabelsDialog,
  RemoveLabelDialog,
};
