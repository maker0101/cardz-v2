import {Card} from '@/domains/cards/cards.types';
import {ZeroType} from 'zero/zero.types';

export interface CardDialogProps {
  card: Card | null;
  z: ZeroType;
}
