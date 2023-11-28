import { useInfiniteQuery } from 'react-query';
import { AxiosError } from 'axios';
import AchievementAPI from '@/api/achievement';
import { PaginationResponse, AchivementResponse } from '@/common';
import { getAccessToken } from '@/utils';

const pageSize = 15;

export const getMyAchivements = async (offset = 1): Promise<PaginationResponse<AchivementResponse>> => {
  try {
    const token = getAccessToken();

    if (!token) throw Error('token이 없습니다.');
    const myAchievements = await new AchievementAPI(token.value).getMyAchievements({
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

export function useFetchMyAchievements() {
  return useInfiniteQuery<PaginationResponse<AchivementResponse>, AxiosError, PaginationResponse<AchivementResponse>>(
    'my-achievements',
    ({ pageParam }) => getMyAchivements(pageParam?.offset),
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
