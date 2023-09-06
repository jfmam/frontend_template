import { useInfiniteQuery } from 'react-query';
import AchievementAPI from '@/api/achievement';
import { PaginationResponse } from '@/common/pagination';
import { AchivementResponse } from '@/common/achievement';
import { AxiosError } from 'axios';

const pageSize = 5;

export const getAchivements = async (offset = 1): Promise<PaginationResponse<AchivementResponse>> => {
  try {
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

export function useFetchAchievements() {
  return useInfiniteQuery<PaginationResponse<AchivementResponse>, AxiosError, PaginationResponse<AchivementResponse>>(
    'achievements',
    ({ pageParam }) => getAchivements(pageParam?.offset),
    {
      getNextPageParam: lastPage => {
        if (lastPage.isLastPage) return undefined;
        return { offset: lastPage.offset + 1 };
      },
      useErrorBoundary: true,
      suspense: true,
    },
  );
}
