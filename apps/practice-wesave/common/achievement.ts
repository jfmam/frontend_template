import { BadgeType } from './badge';
import { Response } from './response';

export interface Achievement {
  name: string;
  type: 'save' | 'spend';
  goal: string;
  actionDay: string[];
  badge: BadgeType;
  completedRatio: number;
  startDate: Date;
  endDate: Date;
}

export type AchivementResponse = Achievement & Response;
