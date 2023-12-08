import ChallengeAPI from '@/api/challenge';
import { Challenge } from '@/common';
import { useMutation } from 'react-query';

export const registChellenges = async (challenge: Challenge, token: string) => {
  if (!token) throw Error('token이 없습니다.');

  const result = await new ChallengeAPI(token).createChallenges(challenge);

  if (result.message === 'error') {
    throw new Error('챌린지 등록에 실패 하였습니다.', { cause: result.status });
  }

  return null;
};

export function useRegistChallenges(token: string) {
  return useMutation({
    mutationFn: (challenge: Challenge) => registChellenges(challenge, token),
  });
}
