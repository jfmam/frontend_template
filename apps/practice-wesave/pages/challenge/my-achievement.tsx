import { ReactElement, Suspense, useState } from 'react';
import cn from 'classnames/bind';

import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';
import styles from '@/styles/MyAchievement.module.scss';
import AchievementBadge from '@/components/Achieve/AchievementBadge';
import useMediaQuery from '@/hooks/useMediaQuery';
import { AchievementResponseMock } from '@/mocks/achievement';
import MyAchievementDetail from '@/components/Achieve/MyAchievementDetail';
import { AchivementResponse } from '@/common/achievement';

const cx = cn.bind(styles);
export default function MyAchievement() {
  const isLarge = useMediaQuery('(min-width: 1024px)');
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
  const achivementBadgeList = AchievementResponseMock.map(v => (
    <AchievementBadge
      onClick={() => onClickListItem(v)}
      key={v.id}
      type={v.badge}
      lengthType={isLarge ? undefined : 'small'}
    />
  ));

  return (
    <>
      <div className={cx('myachievement')}>
        <div className={cx('badge-container')}>{achivementBadgeList}</div>
      </div>
      {isOpenDetail && (
        <Suspense fallback={<div>Loading...</div>}>
          <MyAchievementDetail
            item={detailItem as AchivementResponse}
            onRequestClose={closeDetail}
            isOpen={isOpenDetail}
          />
        </Suspense>
      )}
    </>
  );
}

MyAchievement.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};
