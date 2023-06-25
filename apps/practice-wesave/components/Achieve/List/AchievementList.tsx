import { ReactNode } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/AchievementList.module.scss';
import { AchivementResponse } from '@/common/achievement';
import ListItemLayout from '@/components/layout/ListItemLayout';

const cx = cn.bind(styles);

interface AchievementProps {
  children: ReactNode;
  className?: string;
}

function AchievementList({ children, className }: AchievementProps) {
  return <ul className={cx('list', className)}>{children}</ul>;
}

interface AchievementItemProps {
  item: AchivementResponse;
  onClick?: () => void;
}

function AchievementItem({ item, onClick }: AchievementItemProps) {
  const { actionDay, completedRatio, goal, name, type } = item;

  const onClickBtn = () => {
    if (onClick) onClick();
  };

  return (
    <li className={cx('list-item')}>
      <button className={cx('button', { 'button-complete': completedRatio === 100 })} onClick={() => onClickBtn()}>
        <ListItemLayout actionDay={actionDay} completedRatio={completedRatio} goal={goal} name={name} type={type} />
      </button>
    </li>
  );
}

AchievementList.Item = AchievementItem;
export default AchievementList;
