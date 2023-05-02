import { ReactElement } from 'react';
import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';

export default function TodayChallenge() {
  return <>TodayChallenge</>;
}

TodayChallenge.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};
