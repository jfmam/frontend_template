import Image from 'next/image';
import { MouseEvent } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/AchievementBadge.module.scss';
import { BadgeType } from '@/common';

export type BadgeLengthType = 'small';

interface BadgeProps {
  type: BadgeType;
  onClick?: (e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  lengthType?: BadgeLengthType;
}

const cx = cn.bind(styles);

export default function AchievementBadge({ type, onClick, lengthType }: BadgeProps) {
  const clickBtn = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    if (onClick) onClick(e);
  };
  return (
    <button onClick={e => clickBtn(e)} className={cx('badge', { 'badge-small': lengthType === 'small' })}>
      <Image sizes="(max-width: 1024px) 76.5px, 99px " fill alt="badge" src={`/${type}.svg`} loading="eager" />
    </button>
  );
}
