import { ApiErrorBoundary, MyAchievementFetcher, MyAchievementContainer } from '@/components/template';
import { getAccessToken } from '@/utils';

export default function MyAchievement() {
  const token = getAccessToken();
  return (
    <ApiErrorBoundary>
      <MyAchievementFetcher>
        <MyAchievementContainer token={token} />
      </MyAchievementFetcher>
    </ApiErrorBoundary>
  );
}
