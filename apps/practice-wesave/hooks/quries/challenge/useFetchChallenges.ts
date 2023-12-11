import { AxiosError } from 'axios';
import { useInfiniteQuery } from 'react-query';
import ChallengeAPI from '@/api/challenge';
import { ChallengeResponse, PaginationResponse } from '@/common';

const pageSize = 5;

export const getChellenges = async (token: string, options?: { lastKey?: string; offset?: number }) => {
  const challenges = await new ChallengeAPI(token).getChallenges({
    limit: pageSize,
    offset: options?.offset || 1,
    lastKey: options?.lastKey,
  });

  const result: PaginationResponse<ChallengeResponse> = {
    items: challenges.items,
    isLastPage: challenges.isLastPage,
    limit: pageSize,
    offset: options?.offset || 1,
    lastKey: challenges.lastKey,
  };

  return result;
};

export function useFetchChallenges(token: string) {
  return useInfiniteQuery<PaginationResponse<ChallengeResponse>, AxiosError, PaginationResponse<ChallengeResponse>>(
    'challenges',
    ({ pageParam }) =>
      getChellenges(token, {
        offset: pageParam?.offset,
        lastKey: pageParam?.lastKey,
      }),
    {
      getNextPageParam: lastPage => {
        if (!lastPage.lastKey && lastPage.offset !== 1) return undefined;
        return { offset: lastPage.offset + 1, lastKey: lastPage.lastKey };
      },
      useErrorBoundary: true,
      suspense: true,
    },
  );
}
