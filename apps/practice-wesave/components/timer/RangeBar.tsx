import { ReactNode, useEffect, useState } from 'react';
import classnames from 'classnames/bind';

import styles from '@/styles/RangeBar.module.scss';

const cx = classnames.bind(styles);

interface RangeBarProps {
  children: ReactNode;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  barColor: string;
  size: string;
}

/**
 * 컬러 값을 설정합니다.
 * @param {string} color - (예: '#080808')
 *
 * RangeBar의 height 크기 값을 설정합니다.
 * @param {string} size - (예: '100%')
 */
export default function RangeBar({ onMouseOut, onMouseOver, barColor, size, children }: RangeBarProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cx('chart')}>
      <div
        style={{ backgroundColor: barColor, height: isLoaded ? size : 0 }}
        className={cx('range-bar')}
        onMouseOut={onMouseOut}
        onMouseOver={onMouseOver}
      ></div>
      <div className={cx('bar-contents')}>{children}</div>
    </div>
  );
}
