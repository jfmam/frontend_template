import ChallengeLayout from '@/components/template/layout/challenge/ChallengeLayout';

import { ApiErrorBoundary, MyAchievementFetcher, MyAchievementContainer } from '@/components/template';
import { getAccessToken } from '@/utils';

export default function MyAchievement() {
  const token = getAccessToken();
  return (
    <ApiErrorBoundary>
      <MyAchievementFetcher>
        <ChallengeLayout>
          <MyAchievementContainer token={token} />
        </ChallengeLayout>
      </MyAchievementFetcher>
    </ApiErrorBoundary>
  );
}
