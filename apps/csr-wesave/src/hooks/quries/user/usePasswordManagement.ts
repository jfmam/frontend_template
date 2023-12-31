import { useMutation } from 'react-query';
import UserAPI from '@/api/user';
import { AuthError } from '@/components/section';

export const findUser = async (email: string) => {
  const result = await new UserAPI().forgotPassword(email);

  return result;
};

export function useFindUser() {
  return useMutation({
    mutationFn: (email: string) => findUser(email),
  });
}

export const resetPassword = async (password: string, token?: string | string[]) => {
  if (!token || Array.isArray(token)) throw AuthError();

  const result = await new UserAPI(token).resetPassword(password);

  return result;
};

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ password, token }: { password: string; token?: string | string[] }) =>
      resetPassword(password, token),
  });
}
