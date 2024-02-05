import { FormikHandlers, FormikHelpers } from 'formik';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import cn from 'classnames/bind';

import { BadgeType } from '@/common';
import styles from '@/styles/ChallengeCreateForm.module.scss';
import badgeStyles from '@/styles/Badge.module.scss';

import { badges } from './constants';
import { Badge } from '@/components/atom';

const BadgeModal = dynamic(() => import('@/components/section/Modal/BadgeModal'), { ssr: false });
const cx = cn.bind(styles);
const badgeCx = cn.bind(badgeStyles);

interface BadgeSelectorProps {
  setFieldValue: FormikHelpers<unknown>['setFieldValue'];
  badge: BadgeType | null;
  handleChange: FormikHandlers['handleChange'];
}

export default function BadgeSelector({ setFieldValue, badge }: BadgeSelectorProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [badgeList, setBadgeList] = useState<BadgeType[]>(badges);

  const onClickBadge = useCallback(
    (selectBadge: BadgeType) => {
      if (selectBadge === badge) {
        return;
      }

      setFieldValue('badge', selectBadge);

      if (isOpenModal) {
        setBadgeList(prevBadges => {
          const updatedBadges = prevBadges.filter(v => v !== selectBadge);
          updatedBadges.unshift(selectBadge);
          return updatedBadges;
        });
      }
    },
    [badge, isOpenModal, setFieldValue],
  );

  return (
    <div>
      <label className={cx('label')}>뱃지 선택</label>
      <div className={cx('badge-container')}>
        {badgeList.slice(0, 3).map(b => (
          <Badge onClick={() => onClickBadge(b)} isSelected={badge === b} type={b} key={b} />
        ))}
        <button type='button' onClick={() => setIsOpenModal(true)} className={badgeCx('badge')}>
          더 보기
        </button>
      </div>
      {isOpenModal && (
        <BadgeModal
          isOpen={isOpenModal}
          onRequestClose={() => setIsOpenModal(false)}
          oldSelectedBadge={badge}
          onClickSelectBtn={(badge: BadgeType) => onClickBadge(badge)}
        />
      )}
    </div>
  );
}
