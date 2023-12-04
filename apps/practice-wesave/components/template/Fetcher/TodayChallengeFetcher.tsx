import { ReactNode, Suspense } from 'react';

interface TodayChallengeFetcherProps {
  children: ReactNode;
}

export default function TodayChallengeFetcher({ children }: TodayChallengeFetcherProps) {
  return <Suspense fallback={<div>로딩 중...</div>}>{children}</Suspense>;
}
