import {user} from 'shared/user';
import {useQuery} from '@rocicorp/zero/react';
import * as settingQueries from '@/domains/settings/settings.queries';
import {ZeroType} from 'zero/zero.types';

export const useGetSettings = (z: ZeroType) => {
  const query = settingQueries.getOne(z, user.id);
  const [settings, details] = useQuery(query);

  return {settings, isLoading: details.type !== 'complete'};
};
