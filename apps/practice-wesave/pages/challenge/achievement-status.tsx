import { ReactElement } from 'react';
import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';

export default function AchievementStatus() {
  return <>AchievementStatus</>;
}

AchievementStatus.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};
