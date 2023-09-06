import { ReactNode, Suspense } from 'react';

interface AchievementFetcherProps {
  isLoading: boolean;
  children: ReactNode;
  data: any;
}

export default function AchievementFetcher({ children }: AchievementFetcherProps) {
  return <Suspense fallback={<div>로딩 중...</div>}>{children}</Suspense>;
}
