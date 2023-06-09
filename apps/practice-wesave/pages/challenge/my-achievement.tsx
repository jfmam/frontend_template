import { ReactElement } from 'react';
import cn from 'classnames/bind';

import ChallengeLayout from '@/components/layout/challenge/ChallengeLayout';
import styles from '@/styles/MyAchievement.module.scss';
import { myAchievementMock } from '@/mocks/my-acievement';
import AchievementBadge from '@/components/Achieve/AchievementBadge';
import useMediaQuery from '@/hooks/useMediaQuery';

const cx = cn.bind(styles);
export default function MyAchievement() {
  const isLarge = useMediaQuery('(min-width: 1024px)');
  const achivementBadgeList = myAchievementMock.map(v => (
    <AchievementBadge key={v.id} type={v.badge} lengthType={isLarge ? undefined : 'small'} />
  ));

  return (
    <div className={cx('myachievement')}>
      <div className={cx('badge-container')}>{achivementBadgeList}</div>
    </div>
  );
}

MyAchievement.getLayout = function getLayout(page: ReactElement) {
  return <ChallengeLayout>{page}</ChallengeLayout>;
};
