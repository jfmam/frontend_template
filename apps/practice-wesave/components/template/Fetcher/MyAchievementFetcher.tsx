import { ReactNode, Suspense } from 'react';

interface MyAchievementFetcherProps {
  children: ReactNode;
}

export default function MyAchievementFetcher({ children }: MyAchievementFetcherProps) {
  return <Suspense fallback={<div>로딩 중...</div>}>{children}</Suspense>;
}
