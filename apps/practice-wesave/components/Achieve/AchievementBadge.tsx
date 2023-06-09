import Image from 'next/image';
import cn from 'classnames/bind';
import styles from '@/styles/AchievementBadge.module.scss';
import { MouseEvent } from 'react';
import { BadgeType } from '@/common/challenge';

export type BadgeLengthType = 'small';

interface BadgeProps {
  type: BadgeType;
  onClick?: (e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  lengthType?: BadgeLengthType;
}

const imageSizeMap = {
  large: 99,
  small: 76.5,
};

const calcImageSize = (badgeLengthType?: BadgeLengthType) => {
  if (badgeLengthType === undefined) {
    return 99;
  }

  return imageSizeMap[badgeLengthType];
};

const cx = cn.bind(styles);

export default function AchievementBadge({ type, onClick, lengthType }: BadgeProps) {
  const clickBtn = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    if (onClick) onClick(e);
  };
  return (
    <button onClick={e => clickBtn(e)} className={cx('badge', { 'badge-small': lengthType === 'small' })}>
      <Image
        width={calcImageSize(lengthType)}
        height={calcImageSize(lengthType)}
        alt="badge"
        src={`/${type}.svg`}
        loading="lazy"
      />
    </button>
  );
}
