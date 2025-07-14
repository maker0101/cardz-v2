import {DEFAULT_ALGORITHM_ID} from '@/domains/algorithms/algorithms.constants';
import {algorithms} from '@/domains/algorithms/algorithms.core';
import {useGetSettings} from '@/domains/settings/settings.hooks';
import {ZeroType} from 'zero/zero.types';

export const useGetAlgorithm = (z: ZeroType) => {
  const {settings, isLoading} = useGetSettings(z);
  const algorithmId = settings?.algorithm ?? DEFAULT_ALGORITHM_ID;

  return {algorithm: algorithms[algorithmId], isLoading};
};
