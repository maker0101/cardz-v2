import {type Label} from './labels.types';
import {user} from 'shared/user';
import {useQuery} from '@rocicorp/zero/react';
import {DatabaseType} from 'zero/zero.types';
import {getAllLabels} from '@/domains/labels/labels.queries';

export const useLabels = (
  db: DatabaseType,
): {
  labels: readonly Label[];
  isLoading: boolean;
} => {
  const query = getAllLabels(db, user.id);

  const [labels, details] = useQuery(query);

  return {labels, isLoading: details.type !== 'complete'};
};
