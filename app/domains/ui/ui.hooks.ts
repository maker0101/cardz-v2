import {user} from 'shared/user';
import {useQuery} from '@rocicorp/zero/react';
import {DatabaseType} from 'zero/zero.types';
import * as uiQueries from '@/domains/ui/ui.queries';

export const useGetUi = (db: DatabaseType) => {
  const uiQuery = uiQueries.getOne(db, user.id);
  const [ui, details] = useQuery(uiQuery);

  return {ui, isLoading: details.type !== 'complete'};
};
