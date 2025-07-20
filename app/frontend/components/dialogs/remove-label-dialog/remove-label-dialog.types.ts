import {ZeroType} from 'zero/zero.types';

export interface RemoveLabelDialogProps {
  z: ZeroType;
  cardIds: string[];
  onClose: () => void;
}
