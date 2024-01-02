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
    <ChallengeLayout>
      <ApiErrorBoundary>
        <TodayChallengeFetcher>
          <TodayChallengeContainer token={token} />
        </TodayChallengeFetcher>
      </ApiErrorBoundary>
    </ChallengeLayout>
  );
}

TodayChallenge.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};
