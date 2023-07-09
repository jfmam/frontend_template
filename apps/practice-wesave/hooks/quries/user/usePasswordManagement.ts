import { useMutation } from 'react-query';
import UserAPI from '@/api/user';

export const findUser = async (email: string) => {
  const result = await new UserAPI().findUserByEmail(email);

  return result;
};

export function useFindUser() {
  return useMutation({
    mutationFn: (email: string) => findUser(email),
  });
}

export const resetPassword = async (password: string) => {
  const result = await new UserAPI().resetPassword(password);

  return result;
};

export function useResetPassword() {
  return useMutation({
    mutationFn: (password: string) => resetPassword(password),
  });
}
