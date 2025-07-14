import {schema} from 'zero/schema.gen';
import {Row} from '@rocicorp/zero';

export type Label = Row<typeof schema.tables.label>;

export type LabelChangeSet = Partial<Omit<Label, 'id' | 'userId'>>;

export type LabelFormValues = Omit<
  Label,
  'id' | 'createdAt' | 'updatedAt' | 'userId'
>;
