import { ReactNode, useState } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/ChallengeList.module.scss';
import { ChallengeResponse } from '@/common/challenge';

import { ChallengeStatus } from '@/hooks/quries/challenge/useToggleChallenges';
import { CheckSelector } from '@/components/atom';

const cx = cn.bind(styles);

interface ChallengeListProps {
  children: ReactNode;
}

function ChallengeList({ children }: ChallengeListProps) {
  return <ul className={cx('list')}>{children}</ul>;
}

interface ChallengeItemProps {
  item: ChallengeResponse;
  onClick?: (status: ChallengeStatus) => void;
}

function ChallengeItem({ item, onClick }: ChallengeItemProps) {
  const { goal, type, name } = item;
  const [toggle, setToggle] = useState(false);

  const onClickBtn = () => {
    setToggle(origin => !origin);
    if (onClick) onClick(toggle ? 'complete' : 'progress');
  };

  return (
    <li className={cx('list-item')}>
      <button className={cx('button', { 'button-select': toggle })} onClick={() => onClickBtn()}>
        <div className={cx('name')}>{name}</div>
        <div className={cx('goal', { 'goal-selected': toggle })}>{type === 'save' ? `${goal}원` : goal}</div>
      </button>
      <span>
        <CheckSelector isSelect={toggle} onClick={() => onClickBtn()} />
      </span>
    </li>
  );
}

ChallengeList.Item = ChallengeItem;
export default ChallengeList;
