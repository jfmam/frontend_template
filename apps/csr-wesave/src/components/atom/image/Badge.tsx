import { BadgeType } from '@/common';

interface BadgeProps {
  type: BadgeType;
}

export default function Badge({ type }: BadgeProps) {
  return (
    <img
      width="100%"
      height="100%"
      sizes="(max-width: 425px) 250px, 456px "
      alt="badge"
      src={`/${type}.svg`}
      loading="lazy"
    />
  );
}
