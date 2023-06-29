import { useInfiniteQuery } from 'react-query';
import ChallengeAPI from '@/api/challenge';
import { ChallengeResponse } from '@/common/challenge';
import { PaginationResponse } from '@/common/pagination';

const pageSize = 5;

export const getChellenges = async (offset = 1) => {
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
};

export function useFetchChallenges() {
  return useInfiniteQuery('challenges', ({ pageParam }) => getChellenges(pageParam?.offset), {
    getNextPageParam: lastPage => {
      if (lastPage.isLastPage) return undefined;
      return { offset: lastPage.offset + 1 };
    },
  });
}
