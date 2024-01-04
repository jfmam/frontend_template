import { ApiErrorBoundary, AchievementFetcher, AchievementContainer } from '@/components/template';
import { getAccessToken } from '@/utils';

export default function AchievementStatus() {
  const token = getAccessToken();
  return (
    <ApiErrorBoundary>
      <AchievementFetcher>
        <AchievementContainer token={token} />
      </AchievementFetcher>
    </ApiErrorBoundary>
  );
}
