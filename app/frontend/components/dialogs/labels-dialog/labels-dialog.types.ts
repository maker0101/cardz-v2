import {DatabaseType} from 'zero/zero.types';

export type LabelsDialogProps = {
  db: DatabaseType;
  cardIds: string[];
  onClose: () => void;
};
