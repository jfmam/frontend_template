import { ReactElement } from 'react';

import ChallengeLayout from '@/components/template/layout/challenge/ChallengeLayout';
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
  const { token } = cookies(ctx);

  if (!token) throw new AuthError();

  return {
    props: {
      token,
    },
  };
});
