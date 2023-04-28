import cn from 'classnames/bind';
import styles from '@/styles/DaySelector.module.scss';
import { useState } from 'react';

const cx = cn.bind(styles);

interface DaySelectorProps {
  day: string;
  onClick?: () => void;
}

export default function DaySelector({ day, onClick }: DaySelectorProps) {
  const [selected, setSelected] = useState(false);

  const clickBtn = () => {
    setSelected(origin => !origin);
    if (onClick) onClick();
  };

  return (
    <button onClick={clickBtn} className={cx('day-btn', { selected: selected })}>
      {day}
    </button>
  );
}
