import Image from 'next/image';
import cn from 'classnames/bind';
import styles from '@/styles/Badge.module.scss';
import { MouseEvent, useState } from 'react';

export type BadgeType = 'pig' | 'game' | 'present' | 'health' | 'money' | 'art' | 'rocket' | 'target' | 'award';

export type BadgeLengthType = 'large' | 'small' | 'medium';

interface BadgeProps {
  type: BadgeType;
  onClick?: (e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  lengthType?: BadgeLengthType;
  isSelected?: boolean;
}

const imageSizeMap = {
  large: 94,
  small: 48.25,
  medium: 60,
};

const calcImageSize = (badgeLengthType?: BadgeLengthType) => {
  if (badgeLengthType === undefined) {
    return 52;
  }

  return imageSizeMap[badgeLengthType];
};

const cx = cn.bind(styles);

export default function Badge({ type, onClick, lengthType, isSelected }: BadgeProps) {
  const clickBtn = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    if (onClick) onClick(e);
  };
  return (
    <button
      onClick={e => clickBtn(e)}
      className={cx(
        'badge',
        { [`${type}-bg`]: isSelected },
        { 'badge-small': lengthType === 'small' },
        { 'badge-large': lengthType === 'large' },
        { 'badge-medium': lengthType === 'medium' },
      )}
    >
      <Image
        width={calcImageSize(lengthType)}
        height={calcImageSize(lengthType)}
        alt="badge"
        src={`${type}.svg`}
        loading="lazy"
      />
    </button>
  );
}
