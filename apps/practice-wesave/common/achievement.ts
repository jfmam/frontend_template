import { BadgeType } from './challenge';
import { Response } from './response';

export interface Achievement {
  name: string;
  type: 'save' | 'spend';
  goal: string;
  actionDay: string[];
  badge: BadgeType;
  completedRatio: number;
}

export type AchivementResponse = Achievement & Response;
