'use client';

import { ReactElement } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';
import { getAchivements, useFetchAchievements } from '@/hooks/quries/challenge/useFetchAchievements';
import ApiErrorBoundary from '@/components/error/boundary/ApiErrorBoundary';
import AchievementFetcher from '@/components/Fetcher/AchievementFetcher';
import AchievementContainer from '@/components/container/AchievementContainer';

export default function AchievementStatus() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useFetchAchievements();

  return (
    <ApiErrorBoundary error={data?.pages[0].error}>
      <AchievementFetcher data={data} isLoading={isLoading}>
        <AchievementContainer
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </AchievementFetcher>
    </ApiErrorBoundary>
  );
}

AchievementStatus.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery('achievements', () => getAchivements(), {
    retry: false,
  });

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
