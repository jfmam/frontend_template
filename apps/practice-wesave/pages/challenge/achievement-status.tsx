import { ReactElement, Suspense, useState } from 'react';
import cn from 'classnames/bind';
import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';
import { getAchivements, useFetchAchievements } from '@/hooks/quries/challenge/useFetchAchievements';
import { AchivementResponse } from '@/common/achievement';
import AchievementList from '@/components/Achieve/List/AchievementList';
import ChallengeRegister from '@/components/Challenge/ChallengeRegister';
import styles from '@/styles/achievement-status.module.scss';
import AchievementStatusDetail from '@/components/Achieve/AchievementStatusDetail';

const cx = cn.bind(styles);

export default function AchievementStatus({ initialData }: { initialData: AchivementResponse[] }) {
  const { data } = useFetchAchievements({ initialData });
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [detailItem, setDetailItem] = useState<AchivementResponse | null>(null);

  const onClickListItem = (value: AchivementResponse) => {
    setIsOpenDetail(true);
    setDetailItem(value);
  };

  const closeDetail = () => {
    setIsOpenDetail(false);
    setDetailItem(null);
  };

  return (
    <>
      {data && data?.length !== 0 ? (
        <>
          <AchievementList className={cx('achievement-status')}>
            {data.map(v => (
              <AchievementList.Item item={v} key={v.id} onClick={() => onClickListItem(v)} />
            ))}
          </AchievementList>
          {isOpenDetail && (
            <Suspense fallback={<div>Loading...</div>}>
              <AchievementStatusDetail
                item={detailItem as AchivementResponse}
                onRequestClose={closeDetail}
                isOpen={isOpenDetail}
              />
            </Suspense>
          )}
        </>
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
