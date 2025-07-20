import {user} from 'shared/user';
import {useQuery} from '@rocicorp/zero/react';
import {getOneSetting} from '@/domains/settings/settings.queries';
import {DatabaseType} from 'zero/zero.types';

export const useGetSettings = (db: DatabaseType) => {
  const query = getOneSetting(db, user.id);
  const [settings, details] = useQuery(query);

  return {settings, isLoading: details.type !== 'complete'};
};
