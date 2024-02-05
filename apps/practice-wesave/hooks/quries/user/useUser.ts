import { useMutation, useQuery } from 'react-query';
import UserAPI from '@/api/user';
import { getAccessToken } from '@/utils';

export type ChallengeStatus = 'complete' | 'progress';

export const deleteUser = async () => {
  const token = getAccessToken();

  const result = await new UserAPI(token).deleteUser();

  return result;
};

export function useResignUser() {
  return useMutation({
    mutationFn: () => deleteUser(),
  });
}

export const getUser = async (token?: string) => {
  const result = await new UserAPI(token).getUser();

  return result;
};

export function useFetchUser() {
  return useQuery('fetch-user', () => getUser(), {
    retry: false,
    useErrorBoundary: true,
  });
}
