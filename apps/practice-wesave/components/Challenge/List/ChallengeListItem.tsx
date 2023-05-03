import React, { LiHTMLAttributes, useState } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/ChallengeListItem.module.scss';
import { ChallengeResponse } from '@/common/challenge';

interface ChallengeListItemProps {
  challengeListItem: ChallengeResponse;
}

const listItemStyle = cn.bind(styles);

export default function ChallengeListItem({
  challengeListItem,
  onClick,
  ...props
}: ChallengeListItemProps & LiHTMLAttributes<HTMLLIElement>) {
  const [toggle, setToggle] = useState(false);
  const { goal, type, name } = challengeListItem;

  const onClickBtn = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    setToggle(origin => !origin);
    if (onClick) onClick(e);
  };

  return (
    <li className={listItemStyle('list-item', { complete: toggle })} onClick={onClickBtn} {...props}>
      <div className={listItemStyle('name')}>{name}</div>
      <div className={listItemStyle('goal')}>{type === 'save' ? `${goal}원` : goal}</div>
    </li>
  );
}
