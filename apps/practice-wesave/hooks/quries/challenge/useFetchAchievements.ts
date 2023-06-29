import { useInfiniteQuery } from 'react-query';
import AchievementAPI from '@/api/achievement';
import { PaginationResponse } from '@/common/pagination';
import { AchivementResponse } from '@/common/achievement';

const pageSize = 5;

export const getAchivements = async (offset = 1): Promise<PaginationResponse<AchivementResponse>> => {
  const achievements = await new AchievementAPI().getAchievements({
    limit: pageSize,
    offset: offset,
  });

  const result: PaginationResponse<AchivementResponse> = {
    items: achievements.items,
    isLastPage: achievements.isLastPage,
    limit: pageSize,
    offset,
  };

  return result;
};

export function useFetchAchievements() {
  return useInfiniteQuery('achievements', ({ pageParam }) => getAchivements(pageParam?.offset), {
    getNextPageParam: lastPage => {
      if (lastPage.isLastPage) return undefined;
      return { offset: lastPage.offset + 1 };
    },
    staleTime: 1000,
  });
}
