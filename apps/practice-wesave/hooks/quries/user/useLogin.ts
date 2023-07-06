import { useMutation } from 'react-query';
import UserAPI from '@/api/user';
import { UserLoginType } from '@/common/user';

export type ChallengeStatus = 'complete' | 'progress';

export const login = async (params: UserLoginType) => {
  const result = await new UserAPI().login(params);

  return result;
};

export function useLogin() {
  return useMutation({
    mutationFn: (params: UserLoginType) => login(params),
  });
}
