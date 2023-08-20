import { useInfiniteQuery } from 'react-query';
import AchievementAPI from '@/api/achievement';
import { PaginationResponse } from '@/common/pagination';
import { AchivementResponse } from '@/common/achievement';

const pageSize = 15;

export const getMyAchivements = async (offset = 1): Promise<PaginationResponse<AchivementResponse>> => {
  const myAchievements = await new AchievementAPI().getMyAchievements({
    limit: pageSize,
    offset: offset,
  });

  const result: PaginationResponse<AchivementResponse> = {
    items: myAchievements.items,
    isLastPage: myAchievements.isLastPage,
    limit: pageSize,
    offset,
  };

  return result;
};

export function useFetchMyAchievements() {
  return useInfiniteQuery('my-achievements', ({ pageParam }) => getMyAchivements(pageParam?.offset), {
    getNextPageParam: lastPage => {
      if (lastPage.isLastPage) return undefined;
      return { offset: lastPage.offset + 1 };
    },
  });
}
