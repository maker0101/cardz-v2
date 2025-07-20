import {DatabaseType} from 'zero/zero.types';

export type CardGenerationDialogProps = {
  db: DatabaseType;
  onClose: () => void;
  initialPrompt: string;
};
