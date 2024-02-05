import { ReactElement } from 'react';
import cookies from 'next-cookies';

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
  const { token } = cookies(ctx);
  
  if (!token) throw new AuthError();

  return {
    props: {
      token,
    },
  };
});
