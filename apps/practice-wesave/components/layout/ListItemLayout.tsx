import cn from 'classnames/bind';
import styles from '@/styles/ListItemLayout.module.scss';

import { dueDay } from '../utils/day';

const cx = cn.bind(styles);

interface ListItemLayout {
  name: string;
  completedRatio: number;
  type: string;
  actionDay: string[];
  goal: string;
}

export default function ListItemLayout({ actionDay, completedRatio, name, type, goal }: ListItemLayout) {
  return (
    <>
      <div className={cx('name')}>{name}</div>
      <div className={cx('details', { 'details-completed': completedRatio === 100 })}>
        <span className={cx('details-goal')}>{type === 'save' ? `${goal}원` : goal}</span>
        <span>{dueDay(actionDay)}</span>
      </div>
      <div className={cx('percent')}>{`${completedRatio}%`}</div>
    </>
  );
}
