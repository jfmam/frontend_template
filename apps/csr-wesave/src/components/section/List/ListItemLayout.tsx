import { ReactNode } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/ListItemLayout.module.scss';

import { dueDay } from '../../utils/day';

const cx = cn.bind(styles);

interface ListItemLayout {
  children: ReactNode;
}

function ListItemLayout({ children }: ListItemLayout) {
  return <>{children}</>;
}

interface NameProps {
  name: string;
}

function Name({ name }: NameProps) {
  return <div className={cx('name')}>{name}</div>;
}

interface DetailProps {
  completedRatio: number;
  type: string;
  actionDay: string[];
  goal: string;
  disabled?: boolean;
}

function Detail({ actionDay, completedRatio, goal, type, disabled }: DetailProps) {
  return (
    <div className={cx('details', { 'details-completed': !disabled && completedRatio === 100 })}>
      <span className={cx('details-goal')}>{type === 'save' ? `${goal}원` : goal}</span>
      <span>{dueDay(actionDay)}</span>
    </div>
  );
}

interface CompleteRatioProps {
  completedRatio: number;
}

function CompleteRatio({ completedRatio }: CompleteRatioProps) {
  return <div className={cx('percent')}>{`${completedRatio}%`}</div>;
}

ListItemLayout.Name = Name;
ListItemLayout.Detail = Detail;
ListItemLayout.ComplteRatio = CompleteRatio;

export default ListItemLayout;
