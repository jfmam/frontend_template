import { ReactElement } from 'react';
import { dehydrate, QueryClient } from 'react-query';

import ChallengeLayout from '@/components/template/layout/challenge/ChallengeLayout';
import { getMyAchivements } from '@/hooks/quries/challenge/useFetchMyAchievement';
import { ApiErrorBoundary, MyAchievementFetcher, MyAchievementContainer } from '@/components/template';
import cookies from 'next-cookies';
import { AuthError } from '@/common';
import withGetServerSideProps from '@/hooks/ssr/withGetServerSideProps';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

interface Props {
  token: string;
}

export default function MyAchievement({ token }: Props) {
  return (
    <ApiErrorBoundary>
      <MyAchievementFetcher>
        <MyAchievementContainer token={token} />
      </MyAchievementFetcher>
    </ApiErrorBoundary>
  );
}

MyAchievement.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};

export const getServerSideProps: GetServerSideProps = withGetServerSideProps(async (ctx: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();
  const { token } = cookies(ctx);

  if (!token) throw new AuthError();
  const myAchievements = await getMyAchivements(token);
  await queryClient.prefetchInfiniteQuery('my-achievements', () => myAchievements, { retry: false });

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      token,
    },
  };
});
