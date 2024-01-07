import { useMutation } from 'react-query';
import UserAPI from '@/api/user';
import { UserLoginType, OAuthLoginType } from '@/common';
import { setAccessToken } from '@/utils';

export type ChallengeStatus = 'complete' | 'progress';

export const login = async (params: UserLoginType) => {
  const result = await new UserAPI().login(params);
  setAccessToken(result.token);

  return result;
};

export const kakaoLogin = async (code: string) => {
  const result = await new UserAPI().kakaoLogin(code);
  setAccessToken(result.token);

  return result;
};


export function useLogin() {
  return useMutation({
    mutationFn: (params: UserLoginType) => login(params),
  });
}
