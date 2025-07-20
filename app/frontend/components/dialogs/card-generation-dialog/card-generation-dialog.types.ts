import {ZeroType} from 'zero/zero.types';

export type CardGenerationDialogProps = {
  z: ZeroType;
  onClose: () => void;
  initialPrompt: string;
};
