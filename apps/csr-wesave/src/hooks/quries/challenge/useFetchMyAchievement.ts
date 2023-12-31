import { useInfiniteQuery } from 'react-query';
import { AxiosError } from 'axios';
import AchievementAPI from '@/api/achievement';
import { PaginationResponse, AchivementResponse } from '@/common';

const pageSize = 15;

export const getMyAchivements = async (
  token: string,
  options?: { lastKey?: string; offset?: number },
): Promise<PaginationResponse<AchivementResponse>> => {
  const myAchievements = await new AchievementAPI(token).getMyAchievements({
    limit: pageSize,
    offset: options?.offset || 1,
    lastKey: options?.lastKey,
  });

  const result: PaginationResponse<AchivementResponse> = {
    items: myAchievements.items,
    limit: pageSize,
    offset: options?.offset || 1,
    lastKey: myAchievements.lastKey,
  };

  return result;
};

export function useFetchMyAchievements(token: string) {
  return useInfiniteQuery<PaginationResponse<AchivementResponse>, AxiosError, PaginationResponse<AchivementResponse>>(
    'my-achievements',
    ({ pageParam }) =>
      getMyAchivements(token, {
        offset: pageParam?.offset,
        lastKey: pageParam?.lastKey,
      }),
    {
      getNextPageParam: lastPage => {
        if (!lastPage.lastKey) return undefined;
        return { offset: lastPage.offset + 1, lastKey: lastPage.lastKey };
      },
      useErrorBoundary: true,
      suspense: true,
    },
  );
}
