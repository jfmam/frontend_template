import { ReactElement } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import cookies from 'next-cookies';

import { getChellenges } from '@/hooks/quries/challenge/useFetchChallenges';
import {
  ApiErrorBoundary,
  TodayChallengeFetcher,
  TodayChallengeContainer,
  ChallengeLayout,
} from '@/components/template';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import withGetServerSideProps from '@/hooks/ssr/withGetServerSideProps';
import { AuthError } from '@/common';

interface Props {
  token: string;
}

export default function TodayChallenge({ token }: Props) {
  return (
    <ApiErrorBoundary>
      <TodayChallengeFetcher>
        <TodayChallengeContainer token={token} />
      </TodayChallengeFetcher>
    </ApiErrorBoundary>
  );
}

TodayChallenge.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};

export const getServerSideProps: GetServerSideProps = withGetServerSideProps(async (ctx: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();
  const { token } = cookies(ctx);

  if (!token) throw new AuthError();
  const challenges = await getChellenges(token);
  await queryClient.prefetchInfiniteQuery('challenges', () => challenges, { retry: false });

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      token,
    },
  };
});
