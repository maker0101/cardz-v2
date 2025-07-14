import {type Label} from './labels.types';
import {user} from 'shared/user';
import {useQuery} from '@rocicorp/zero/react';
import {ZeroType} from 'zero/zero.types';
import * as labelQueries from '@/domains/labels/labels.queries';

export const useLabels = (
  z: ZeroType,
): {
  labels: readonly Label[];
  isLoading: boolean;
} => {
  const query = labelQueries.getAll(z, user.id);

  const [labels, details] = useQuery(query);

  return {labels, isLoading: details.type !== 'complete'};
};
