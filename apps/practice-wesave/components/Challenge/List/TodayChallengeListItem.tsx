import React, { useState } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/TodayChallengeButton.module.scss';
import { ChallengeResponse } from '@/common/challenge';
import CheakSelector from '@/components/button/CheckSelector';
import { ChallengeStatus } from '@/hooks/quries/challenge/useToggleChallenges';

interface ChallengeButtonProps {
  challengeListItem: ChallengeResponse;
  onClick?: (status: ChallengeStatus) => void;
}

const cx = cn.bind(styles);

export default function TodayChallengeButton({ challengeListItem, onClick }: ChallengeButtonProps) {
  const [toggle, setToggle] = useState(false);
  const { goal, type, name } = challengeListItem;

  const onClickBtn = (toggle: boolean) => {
    setToggle(origin => !origin);
    if (onClick) onClick(toggle ? 'complete' : 'progress');
  };

  return (
    <li className={cx('list-item')}>
      <button className={cx('button', { 'button-select': toggle })} onClick={() => onClickBtn(toggle)}>
        <div className={cx('name')}>{name}</div>
        <div className={cx('goal', { 'goal-selected': toggle })}>{type === 'save' ? `${goal}원` : goal}</div>
      </button>
      <span>
        <CheakSelector isSelect={toggle} onClick={() => onClickBtn(toggle)} />
      </span>
    </li>
  );
}
