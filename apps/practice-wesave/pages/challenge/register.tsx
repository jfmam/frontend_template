import { ReactElement } from 'react';
import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';

export default function Register() {
  return <>Register</>;
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};
