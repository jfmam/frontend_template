import { ReactNode } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/AchievementList.module.scss';

const cx = cn.bind(styles);

type AchievementMockType = {
  name: string;
  goal: string;
  type: string;
  actionDay: string[];
  completedRatio: number;
};

interface AchievementProps {
  children: ReactNode;
}

function AchievementList({ children }: AchievementProps) {
  return <ul className={cx('list')}>{children}</ul>;
}

interface AchievementItemProps {
  item: AchievementMockType;
  onClick?: () => void;
}

function AchievementItem({ item, onClick }: AchievementItemProps) {
  const { actionDay, completedRatio, goal, name, type } = item;
  const dueDay = actionDay.length !== 7 ? actionDay.join('·') : '매일';

  const onClickBtn = () => {
    if (onClick) onClick();
  };

  return (
    <li className={cx('list-item')}>
      <button className={cx('button', { 'button-complete': completedRatio === 100 })} onClick={() => onClickBtn()}>
        <div className={cx('name')}>{name}</div>
        <div className={cx('details', { 'details-completed': completedRatio === 100 })}>
          <span className={cx('details-goal')}>{type === 'save' ? `${goal}원` : goal}</span>
          <span>{dueDay}</span>
        </div>
        <div className={cx('percent')}>{`${completedRatio}%`}</div>
      </button>
    </li>
  );
}

AchievementList.Item = AchievementItem;
export default AchievementList;
