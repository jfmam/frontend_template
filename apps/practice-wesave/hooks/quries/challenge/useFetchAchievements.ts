import { useQuery } from 'react-query';
import { AchivementResponse } from '@/common/achievement';
import AchievementAPI from '@/api/achievement';

export const getAchivements = async () => {
  const achievements = await new AchievementAPI().getAchievements();

  return achievements;
};

export function useFetchAchievements({ initialData }: { initialData?: AchivementResponse[] }) {
  return useQuery<AchivementResponse[]>('achievements', getAchivements, {
    retry: 1,
    refetchOnWindowFocus: false,
    initialData,
  });
}
