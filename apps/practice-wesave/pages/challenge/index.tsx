import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';
import ChallengeLayoutMobile from '@/components/layout/challenge/ChallengeLayout';
import { ChallengeMenuContext, useChallengeMenuState } from '@/components/layout/challenge/ChallengeMenuContext';
import useMediaQuery from '@/hooks/useMediaQuery';

export default function Challenge() {
  const menu = useChallengeMenuState();

  return (
    <ChallengeMenuContext>
      <ChallengeLayout>dev</ChallengeLayout>
    </ChallengeMenuContext>
  );
}
