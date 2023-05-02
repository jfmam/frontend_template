import { ReactElement } from 'react';
import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';

export default function MyAchievement() {
  return <>MyAchievement</>;
}

MyAchievement.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};
