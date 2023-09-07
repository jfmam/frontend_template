import { ButtonHTMLAttributes, MouseEvent, useState } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/DayButton.module.scss';

const cx = cn.bind(styles);

interface DayButtonProps {
  day: string;
}

export default function DayButton({
  day,
  onClick,
  ...props
}: DayButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const [toggle, setToggle] = useState(false);

  const onClickButton = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    setToggle(o => !o);
    if (onClick) onClick(e);
  };

  return (
    <button onClick={onClickButton} className={cx('day-button', { selected: toggle })} {...props}>
      {day}
    </button>
  );
}
