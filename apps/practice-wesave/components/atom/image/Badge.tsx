import { BadgeType } from '@/common';
import Image from 'next/image';

interface BadgeProps {
  type: BadgeType;
}

export default function Badge({ type }: BadgeProps) {
  return <Image sizes="(max-width: 425px) 250px, 456px " fill alt="badge" src={`/${type}.svg`} loading="lazy" />;
}
