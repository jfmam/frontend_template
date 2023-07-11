import { useMutation, useQuery } from 'react-query';
import UserAPI from '@/api/user';

export type ChallengeStatus = 'complete' | 'progress';

export const deleteUser = async (userId: number) => {
  const result = await new UserAPI().deleteUser(userId);

  return result;
};

export function useResignUser() {
  return useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
  });
}

export const getUser = async () => {
  const result = await new UserAPI().getUser();

  return result;
};

export function useFetchUser() {
  return useQuery('fetch-user', () => getUser());
}
