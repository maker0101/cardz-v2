import {DatabaseType} from 'zero/zero.types';

export interface RemoveLabelDialogProps {
  db: DatabaseType;
  cardIds: string[];
  onClose: () => void;
}
