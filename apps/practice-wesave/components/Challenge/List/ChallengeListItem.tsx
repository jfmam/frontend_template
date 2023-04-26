import React, { LiHTMLAttributes, useState } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/ChallengeListItem.module.scss';

export type ChallengeListItemType = {
  name: string;
  targetAmount: number;
  targetPeriod: string[];
  percent: number;
  hasCheckBtn: boolean;
};

interface ChallengeListItemProps {
  challengeListItem: ChallengeListItemType;
}

const listItemStyle = cn.bind(styles);

export default function ChallengeListItem({
  challengeListItem,
  onClick,
  ...props
}: ChallengeListItemProps & LiHTMLAttributes<HTMLLIElement>) {
  const [toggle, setToggle] = useState(false);
  const { hasCheckBtn, name, percent, targetAmount, targetPeriod } = challengeListItem;

  const onClickBtn = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    setToggle(origin => !origin);
    if (onClick) onClick(e);
  };

  const selectedDayOfWeek = targetPeriod.length === 7 ? '매일' : targetPeriod.toString().replace(/,/g, '·');

  return (
    <li className={listItemStyle('list-item', { complete: toggle })} onClick={onClickBtn} {...props}>
      <div className={listItemStyle('name')}>{name}</div>
      <div className={listItemStyle('detail')}>
        <div>
          <span className={listItemStyle('amount')}>{targetAmount}원</span>
          <span className={listItemStyle('period')}>{selectedDayOfWeek}</span>
        </div>
        <span className={listItemStyle('percentage')}>{percent}%</span>
      </div>
    </li>
  );
}
