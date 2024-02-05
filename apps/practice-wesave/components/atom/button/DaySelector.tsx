import { useState, MouseEvent } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/DaySelector.module.scss';

const cx = cn.bind(styles);

interface DaySelectorProps {
  day: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function DaySelector({ day, onClick, isSelected }: DaySelectorProps) {
  const [selected, setSelected] = useState(false);

  const clickBtn = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    setSelected(origin => !origin);
    if (onClick) onClick();
  };

  return (
    <button onClick={clickBtn} className={cx('day-btn', { selected: selected || isSelected })}>
      {day}
    </button>
  );
}
