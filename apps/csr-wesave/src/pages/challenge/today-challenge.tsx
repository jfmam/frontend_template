import { ReactElement } from 'react';
import {
  ApiErrorBoundary,
  TodayChallengeFetcher,
  TodayChallengeContainer,
  ChallengeLayout,
} from '@/components/template';
import { getAccessToken } from '@/utils';

export default function TodayChallenge() {
  const token = getAccessToken();

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
