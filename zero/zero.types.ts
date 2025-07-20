import {Zero} from '@rocicorp/zero';
import {Schema} from './schema.gen';
import {Mutators} from './mutators';

export type DatabaseType = Zero<Schema, Mutators>;
