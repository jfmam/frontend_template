import { ReactNode } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/AchievementList.module.scss';
import { AchivementResponse } from '@/common';

import ListItemLayout from './ListItemLayout';

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
  const { actionDay, completeRatio, goal, name, type } = item;

  const onClickBtn = () => {
    if (onClick) onClick();
  };

  return (
    <li className={cx('list-item')}>
      <button className={cx('button', { 'button-complete': completeRatio === 100 })} onClick={() => onClickBtn()}>
        <ListItemLayout>
          <ListItemLayout.Name name={name} />
          <ListItemLayout.Detail actionDay={actionDay} completedRatio={completeRatio} goal={goal} type={type} />
          <ListItemLayout.ComplteRatio completedRatio={completeRatio} />
        </ListItemLayout>
      </button>
    </li>
  );
}

AchievementList.Item = AchievementItem;
export default AchievementList;
