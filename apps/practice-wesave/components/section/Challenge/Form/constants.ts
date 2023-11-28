import { BadgeType, Challenge } from '@/common';

export const days = ['월', '화', '수', '목', '금', '토', '일'];
export const badges: BadgeType[] = ['pig', 'game', 'present', 'health', 'money', 'art', 'rocket', 'target', 'award'];
export type InitialValuesType = Challenge & { badge: BadgeType | null };
