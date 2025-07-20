import {Card} from '@/domains/cards/cards.types';
import {DatabaseType} from 'zero/zero.types';

export interface CardDialogProps {
  db: DatabaseType;
  card: Card | null;
}
