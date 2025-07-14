import {Zero} from '@rocicorp/zero';
import {Schema} from './schema.gen';
import {Mutators} from './mutators';

export type ZeroType = Zero<Schema, Mutators>;
