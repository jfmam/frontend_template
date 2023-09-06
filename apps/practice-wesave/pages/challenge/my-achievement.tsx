import { ReactElement } from 'react';
import { dehydrate, QueryClient } from 'react-query';

import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';
import { getMyAchivements, useFetchMyAchievements } from '@/hooks/quries/challenge/useFetchMyAchivement';
import ApiErrorBoundary from '@/components/error/boundary/ApiErrorBoundary';
import MyAchievementContainer from '@/components/container/MyAchievementContainer';
import MyAchievementFetcher from '@/components/Fetcher/MyAchievementFetcher';

export default function MyAchievement() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useFetchMyAchievements();

  return (
    <ApiErrorBoundary error={data?.pages[0].error}>
      <MyAchievementFetcher isLoading={isLoading}>
        <MyAchievementContainer
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </MyAchievementFetcher>
    </ApiErrorBoundary>
  );
}

MyAchievement.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery('my-achievements', () => getMyAchivements(), { retry: false });

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
