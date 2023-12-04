import { AxiosError } from 'axios';
import { useInfiniteQuery } from 'react-query';
import ChallengeAPI from '@/api/challenge';
import { ChallengeResponse, PaginationResponse } from '@/common';

const pageSize = 5;

export const getChellenges = async (token: string, offset = 1) => {
  const challenges = await new ChallengeAPI(token).getChallenges({
    limit: pageSize,
    offset: offset,
  });

  const result: PaginationResponse<ChallengeResponse> = {
    items: challenges.items,
    isLastPage: challenges.isLastPage,
    limit: pageSize,
    offset,
  };

  return result;
};

export function useFetchChallenges(token: string) {
  return useInfiniteQuery<PaginationResponse<ChallengeResponse>, AxiosError, PaginationResponse<ChallengeResponse>>(
    'challenges',
    ({ pageParam }) => getChellenges(token, pageParam?.offset),
    {
      getNextPageParam: lastPage => {
        if (lastPage.isLastPage) return undefined;
        return { offset: lastPage.offset + 1 };
      },
      useErrorBoundary: false,
      suspense: true,
    },
  );
}
