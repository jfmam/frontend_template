import { useMutation } from 'react-query';
import ChallengeAPI from '@/api/challenge';
import { ChallengeResponse } from '@/common';

export type ChallengeStatus = 'complete' | 'progress';

export const toggleChellenges = async (challengeId: ChallengeResponse['id'], status: ChallengeStatus) => {
  const result = await new ChallengeAPI().toggleChallenges(challengeId);

  if (result.message === 'error' && status === 'complete') {
    throw new Error('챌린지 완료 등록에 실패 하였습니다.', { cause: result.status });
  }

  if (result.message === 'error' && status === 'progress') {
    throw new Error('챌린지 완료해제 등록에 실패 하였습니다.', { cause: result.status });
  }

  return null;
};

export function useToggleChallenges() {
  return useMutation({
    mutationFn: ({ id, status }: { id: ChallengeResponse['id']; status: ChallengeStatus }) =>
      toggleChellenges(id, status),
  });
}
