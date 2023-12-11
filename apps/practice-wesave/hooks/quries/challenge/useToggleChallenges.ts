import { useMutation } from 'react-query';
import ChallengeAPI from '@/api/challenge';
import { ChallengeResponse } from '@/common';
import { getAccessToken } from '@/utils';

export type ChallengeStatus = 'complete' | 'progress';

export const toggleChellenges = async (challengeId: ChallengeResponse['id'], status: boolean) => {
  const token = getAccessToken();
  if (!token) throw Error('token이 없습니다.');

  await new ChallengeAPI(token).toggleChallenges(challengeId, status);

  return null;
};

export function useToggleChallenges() {
  return useMutation({
    mutationFn: ({ id, status }: { id: ChallengeResponse['id']; status: boolean }) => toggleChellenges(id, status),
  });
}
