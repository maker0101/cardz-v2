import {Row} from '@rocicorp/zero';
import {schema} from 'zero/schema.gen';

export type OnDemandStudy = Row<typeof schema.tables.onDemandStudy>;

export type OnDemandStudyCard = Row<typeof schema.tables.onDemandStudyCard>;

export type OnDemandStudyWithCards = OnDemandStudy & {
  onDemandStudyCards: readonly OnDemandStudyCard[];
};

export type OnDemandStudyMode = 'create' | 'extend';

export type StudyMode = 'due' | 'onDemand';
