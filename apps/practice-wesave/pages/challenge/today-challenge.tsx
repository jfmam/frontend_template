import { ReactElement } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';
import { getChellenges, useFetchChallenges } from '@/hooks/quries/challenge/useFetchChallenges';
import ApiErrorBoundary from '@/components/error/boundary/ApiErrorBoundary';
import TodayChallengeFetcher from '@/components/Fetcher/TodayChallengeFetcher';
import TodayChallengeContainer from '@/components/container/TodayChallengeContainer';

export default function TodayChallenge() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useFetchChallenges();
  return (
    <ApiErrorBoundary error={data?.pages[0].error}>
      <TodayChallengeFetcher isLoading={isLoading}>
        <TodayChallengeContainer
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </TodayChallengeFetcher>
    </ApiErrorBoundary>
  );
}

TodayChallenge.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery('challenges', () => getChellenges(), { retry: false });

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
