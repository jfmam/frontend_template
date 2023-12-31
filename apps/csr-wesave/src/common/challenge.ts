import { Response } from './response';
import { BadgeType } from './badge';

export interface Challenge {
  name: string;
  type: 'save' | 'spend';
  goal: string;
  startDate: Date;
  endDate: Date;
  actionDay: string[];
  badge: BadgeType;
}

export type ChallengeResponse = Challenge &
  Response & { badge: string; type: string; todayCompleteStatus: boolean; totalDays: number; completeCount: number };
