import ChallengeAPI from '@/api/challenge';
import { ChallengeResponse } from '@/common/challenge';
import { useQuery, UseQueryOptions } from 'react-query';

export const getChellenges = async () => {
  const challenges = await new ChallengeAPI().getChallenges();

  return challenges;
};

export function useFetchChallenges({ initialData }: { initialData?: ChallengeResponse[] }) {
  return useQuery<ChallengeResponse[]>('challenges', getChellenges, {
    retry: 1,
    refetchOnWindowFocus: false,
    initialData,
  });
}
