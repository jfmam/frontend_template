import { ReactElement } from 'react';
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
  const { token } = cookies(ctx);

  if (!token) throw new AuthError();

  return {
    props: {
      token,
    },
  };
});
