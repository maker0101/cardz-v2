import {user} from 'shared/user';
import {useQuery} from '@rocicorp/zero/react';
import {ZeroType} from 'zero/zero.types';
import * as uiQueries from '@/domains/ui/ui.queries';

export const useGetUi = (z: ZeroType) => {
  const uiQuery = uiQueries.getOne(z, user.id);
  const [ui, details] = useQuery(uiQuery);

  return {ui, isLoading: details.type !== 'complete'};
};
