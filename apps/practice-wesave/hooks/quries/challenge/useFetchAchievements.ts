import { useInfiniteQuery } from 'react-query';
import { AxiosError } from 'axios';
import AchievementAPI from '@/api/achievement';
import { PaginationResponse, AchivementResponse, UnknownError } from '@/common';

const pageSize = 5;

export const getAchivements = async (token: string, offset = 1): Promise<PaginationResponse<AchivementResponse>> => {
  const achievements = await new AchievementAPI(token).getAchievements({
    limit: pageSize,
    offset: offset,
  });

  throw new UnknownError();

  const result: PaginationResponse<AchivementResponse> = {
    items: achievements.items,
    isLastPage: achievements.isLastPage,
    limit: pageSize,
    offset,
  };
  return result;
};

export function useFetchAchievements(token: string) {
  return useInfiniteQuery<PaginationResponse<AchivementResponse>, AxiosError, PaginationResponse<AchivementResponse>>(
    'achievements',
    ({ pageParam }) => getAchivements(token, pageParam?.offset),
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
