import { BadgeType } from '@/common';
import Image from 'next/image';

interface BadgeProps {
  width: number;
  height: number;
  type: BadgeType;
}

export default function Badge({ width, height, type }: BadgeProps) {
  return <Image width={width} height={height} alt="badge" src={`/${type}.svg`} loading="lazy" />;
}
