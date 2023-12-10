import { useInfiniteQuery } from 'react-query';
import { AxiosError } from 'axios';
import AchievementAPI from '@/api/achievement';
import { PaginationResponse, AchivementResponse } from '@/common';

const pageSize = 5;

export const getAchivements = async (
  token: string,
  options?: { lastKey?: string; offset?: number },
): Promise<PaginationResponse<AchivementResponse>> => {
  const achievements = await new AchievementAPI(token).getAchievements({
    limit: pageSize,
    offset: options?.offset || 1,
    lastKey: options?.lastKey,
  });

  const result: PaginationResponse<AchivementResponse> = {
    items: achievements.items,
    isLastPage: achievements.isLastPage,
    limit: pageSize,
    offset: options?.offset || 1,
    lastKey: achievements.lastKey,
  };
  return result;
};

export function useFetchAchievements(token: string) {
  return useInfiniteQuery<PaginationResponse<AchivementResponse>, AxiosError, PaginationResponse<AchivementResponse>>(
    'achievements',
    ({ pageParam }) => getAchivements(token, pageParam?.offset),
    {
      getNextPageParam: lastPage => {
        if (lastPage.items.length === 0) return undefined;
        return { offset: lastPage.offset + 1, lastKey: lastPage.lastKey };
      },
      useErrorBoundary: true,
      suspense: true,
    },
  );
}
