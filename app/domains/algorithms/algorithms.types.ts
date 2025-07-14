import {Row} from '@rocicorp/zero';
import {CardStudyState} from '@/domains/cards/cards.types';
import {schema} from 'zero/schema.gen';

export type AlgorithmId = Row<typeof schema.tables.setting>['algorithm'];

export interface AnswerOption {
  text: string;
  score: number;
}

export interface SpacedRepetitionAlgorithm<Score> {
  id: AlgorithmId;
  name: string;
  description: string;
  answerOptions: AnswerOption[];
  study: (prevStudyState: CardStudyState, score: Score) => CardStudyState;
}

export type Algorithm =
  | SpacedRepetitionAlgorithm<LeitnerScore>
  | SpacedRepetitionAlgorithm<SuperMemo2Score>
  | SpacedRepetitionAlgorithm<HalfLifeRegressionScore>
  | SpacedRepetitionAlgorithm<SuperMemo18Score>;

export type LeitnerScore = 0 | 1;

export type SuperMemo2Score = 0 | 1 | 2;

export type HalfLifeRegressionScore = 0 | 1;

export type SuperMemo18Score = 0 | 1 | 2 | 3 | 4 | 5;
