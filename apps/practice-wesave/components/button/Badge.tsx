import Image from 'next/image';
import cn from 'classnames/bind';
import styles from '@/styles/Badge.module.scss';
import { MouseEvent, useState } from 'react';

export type BadgeType = 'pig' | 'game' | 'present' | 'health' | 'money' | 'art' | 'rocket' | 'target' | 'award';

interface BadgeProps {
  type: BadgeType;
  onClick?: (e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
}

const cx = cn.bind(styles);

export default function Badge({ type, onClick }: BadgeProps) {
  const [selected, setSelected] = useState(false);

  const clickBtn = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    setSelected(origin => !origin);
    if (onClick) onClick(e);
  };
  return (
    <button onClick={e => clickBtn(e)} className={cx('badge', { [`${type}-bg`]: selected })}>
      <Image width={48} height={48} alt="badge" src={`${type}.svg`} loading="lazy" />
    </button>
  );
}
