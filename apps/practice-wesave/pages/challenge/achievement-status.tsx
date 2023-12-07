import { ReactElement } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { getAchivements } from '@/hooks/quries/challenge/useFetchAchievements';
import { ApiErrorBoundary, AchievementFetcher, AchievementContainer, ChallengeLayout } from '@/components/template';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import withGetServerSideProps from '@/hooks/ssr/withGetServerSideProps';
import cookies from 'next-cookies';
import { AuthError } from '@/common';

interface Props {
  token: string;
}

export default function AchievementStatus({ token }: Props) {
  return (
    <ApiErrorBoundary>
      <AchievementFetcher>
        <AchievementContainer token={token} />
      </AchievementFetcher>
    </ApiErrorBoundary>
  );
}

AchievementStatus.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};

export const getServerSideProps: GetServerSideProps = withGetServerSideProps(async (ctx: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();
  const { token } = cookies(ctx);

  if (!token) throw new AuthError();
  const achievements = await getAchivements(token);
  await queryClient.prefetchInfiniteQuery('achievements', () => achievements, { retry: false });

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      token,
    },
  };
});
