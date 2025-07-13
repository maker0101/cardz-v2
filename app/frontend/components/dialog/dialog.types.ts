// TODO: Fix

// import { CardDialogProps } from '@/components/dialogs/card-dialog/card-dialog.types';
// import { CommandDialogProps } from '@/components/dialogs/command-dialog/command-dialog.types';
// import { CardGenerationDialogProps } from '@/components/dialogs/card-generation-dialog/card-generation-dialog.types';
// import { LabelsDialogProps } from '@/components/dialogs/labels-dialog/labels-dialog.types';
// import { RemoveLabelDialogProps } from '@/components/dialogs/remove-label-dialog/remove-label-dialog.types';
// import { Label } from '@/domains/labels/labels.types';

export type DialogName =
  | 'CardDialog'
  | 'CommandDialog'
  | 'CardGenerationDialog'
  | 'LabelsDialog'
  | 'RemoveLabelDialog'
  | 'CreateLabelDialog'
  | 'EditLabelDialog';

export type CreateLabelDialogProps = {
  onClose: () => void;
};

// export type EditLabelDialogProps = {
//   label: Label;
//   onClose: () => void;
// };

export type DialogPropsMap = {
  // CardDialog: CardDialogProps;
  // CommandDialog: CommandDialogProps;
  // CardGenerationDialog: CardGenerationDialogProps;
  // LabelsDialog: LabelsDialogProps;
  // RemoveLabelDialog: RemoveLabelDialogProps;
  // CreateLabelDialog: CreateLabelDialogProps;
  // EditLabelDialog: EditLabelDialogProps;
  CardDialog: any;
  CommandDialog: any;
  CardGenerationDialog: any;
  LabelsDialog: any;
  RemoveLabelDialog: any;
  CreateLabelDialog: any;
  EditLabelDialog: any;
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
