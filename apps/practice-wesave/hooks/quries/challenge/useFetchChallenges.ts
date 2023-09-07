import { AxiosError } from 'axios';
import { useInfiniteQuery } from 'react-query';
import ChallengeAPI from '@/api/challenge';
import { ChallengeResponse, PaginationResponse } from '@/common';

const pageSize = 5;

export const getChellenges = async (offset = 1) => {
  try {
    const challenges = await new ChallengeAPI().getChallenges({
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
  } catch (e: any) {
    return {
      items: [],
      isLastPage: true,
      limit: pageSize,
      offset,
      error: { message: e.message, type: e.type },
    };
  }
};

export function useFetchChallenges() {
  return useInfiniteQuery<PaginationResponse<ChallengeResponse>, AxiosError, PaginationResponse<ChallengeResponse>>(
    'challenges',
    ({ pageParam }) => getChellenges(pageParam?.offset),
    {
      getNextPageParam: lastPage => {
        if (lastPage.isLastPage) return undefined;
        return { offset: lastPage.offset + 1 };
      },
      useErrorBoundary: true,
      // suspense: true,
    },
  );
}
