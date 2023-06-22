import { ReactElement } from 'react';
import cn from 'classnames/bind';
import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';
import { getAchivements, useFetchAchievements } from '@/hooks/quries/challenge/useFetchAchievements';
import { AchivementResponse } from '@/common/achievement';
import AchievementList from '@/components/Achieve/List/AchievementList';
import ChallengeRegister from '@/components/Challenge/ChallengeRegister';
import styles from '@/styles/achievement-status.module.scss';

const cx = cn.bind(styles);

export default function AchievementStatus({ initialData }: { initialData: AchivementResponse[] }) {
  const { data } = useFetchAchievements({ initialData });
  return (
    <>
      {data && data?.length !== 0 ? (
        <AchievementList className={cx('achievement-status')}>
          {data.map(v => (
            <AchievementList.Item item={v} key={v.id} />
          ))}
        </AchievementList>
      ) : (
        <ChallengeRegister />
      )}
    </>
  );
}

AchievementStatus.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};

export async function getServerSideProps() {
  return {
    props: {
      initialData: await getAchivements(),
    },
  };
}
