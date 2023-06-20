import React, { useState } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/TodayChallengeButton.module.scss';
import { ChallengeResponse } from '@/common/challenge';
import CheakSelector from '@/components/button/CheckSelector';

interface ChallengeButtonProps {
  challengeListItem: ChallengeResponse;
  onClick?: () => void;
}

const cx = cn.bind(styles);

export default function TodayChallengeButton({ challengeListItem, onClick }: ChallengeButtonProps) {
  const [toggle, setToggle] = useState(false);
  const { goal, type, name } = challengeListItem;

  const onClickBtn = () => {
    setToggle(origin => !origin);
    if (onClick) onClick();
  };

  return (
    <li className={cx('list-item')}>
      <button className={cx('button', { 'button-select': toggle })} onClick={onClickBtn}>
        <div className={cx('name')}>{name}</div>
        <div className={cx('goal', { 'goal-selected': toggle })}>{type === 'save' ? `${goal}원` : goal}</div>
      </button>
      <span>
        <CheakSelector isSelect={toggle} onClick={onClickBtn} />
      </span>
    </li>
  );
}
