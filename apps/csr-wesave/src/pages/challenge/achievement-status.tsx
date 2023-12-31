import { ApiErrorBoundary, AchievementFetcher, AchievementContainer, ChallengeLayout } from '@/components/template';
import { getAccessToken } from '@/utils';

export default function AchievementStatus() {
  const token = getAccessToken();
  return (
    <ApiErrorBoundary>
      <AchievementFetcher>
        <ChallengeLayout>
          <AchievementContainer token={token} />
        </ChallengeLayout>
      </AchievementFetcher>
    </ApiErrorBoundary>
  );
}
