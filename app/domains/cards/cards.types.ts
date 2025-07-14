import {Row} from '@rocicorp/zero';
import {schema} from 'zero/schema.gen';
import {type Label} from '@/domains/labels/labels.types';
import {z} from 'zod';
import {CARD_STATUSES} from '@/domains/cards/cards.constants';

export type CardLabelDB = Row<typeof schema.tables.cardLabel>;

export type CardStudyStateDB = Row<typeof schema.tables.cardStudyState>;

export type CardDB = Row<typeof schema.tables.card> & {
  cardLabels: readonly CardLabelDB[];
  cardStudyState: CardStudyStateDB | null | undefined;
};

export type Card = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  question: string;
  answer: string;
  studyState: CardStudyState;
  labels: Label[];
};

export type CardChangeSet = Partial<Card>;

export type CardFormValues = Omit<
  Card,
  'id' | 'createdAt' | 'updatedAt' | 'answerType' | 'studyState' | 'userId'
>;

export type CardStatus = (typeof CARD_STATUSES)[number];

export const cardStudyStateSchema = z.object({
  cardId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastStudiedAt: z.date().nullable(),
  nextStudiedAt: z.date().nullable(),
  box: z.number().nullable(),
  interval: z.number().nullable(),
  repetitions: z.number().nullable(),
  easeFactor: z.number().nullable(),
  difficulty: z.number().nullable(),
  stability: z.number().nullable(),
});

export type CardStudyState = z.infer<typeof cardStudyStateSchema>;

export interface ActiveCardState {
  activeCardId: string | null;
  setActiveCardId: (id: string | null) => void;
}

export interface SelectedCardsState {
  selectedCardIds: string[];
  setSelectedCardIds: (ids: string[]) => void;
}

export const generatedCardSchema = z.object({
  question: z.string(),
  answer: z.string(),
  labels: z.array(z.string()),
});

export const generatedCardsSchema = z.array(generatedCardSchema);

export type GeneratedCard = z.infer<typeof generatedCardSchema>;

export type StreamingGeneratedCard =
  | Partial<GeneratedCard>
  | Record<string, unknown>
  | undefined
  | null;
