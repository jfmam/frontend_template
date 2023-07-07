import { useMutation } from 'react-query';
import UserAPI from '@/api/user';
import { SignUpType } from '@/common/user';

export type ChallengeStatus = 'complete' | 'progress';

export const createUser = async (params: SignUpType) => {
  const result = await new UserAPI().creaetUser(params);

  return result;
};

export function useSignUp() {
  return useMutation({
    mutationFn: (params: SignUpType) => createUser(params),
  });
}
