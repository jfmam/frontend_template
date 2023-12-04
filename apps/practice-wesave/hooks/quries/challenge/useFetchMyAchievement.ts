import { useInfiniteQuery } from 'react-query';
import { AxiosError } from 'axios';
import AchievementAPI from '@/api/achievement';
import { PaginationResponse, AchivementResponse } from '@/common';

const pageSize = 15;

export const getMyAchivements = async (token: string, offset = 1): Promise<PaginationResponse<AchivementResponse>> => {
  const myAchievements = await new AchievementAPI(token).getMyAchievements({
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

export function useFetchMyAchievements(token: string) {
  return useInfiniteQuery<PaginationResponse<AchivementResponse>, AxiosError, PaginationResponse<AchivementResponse>>(
    'my-achievements',
    ({ pageParam }) => getMyAchivements(token, pageParam?.offset),
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
