import ChallengeAPI from '@/api/challenge';
import { Challenge } from '@/common/challenge';
import { useMutation } from 'react-query';

export const registChellenges = async (challenge: Challenge) => {
  const result = await new ChallengeAPI().createChallenges(challenge);

  if (result.message === 'error') {
    throw new Error('챌린지 등록에 실패 하였습니다.', { cause: result.status });
  }

  return null;
};

export function useRegistChallenges() {
  return useMutation({
    mutationFn: (challenge: Challenge) => registChellenges(challenge),
  });
}
