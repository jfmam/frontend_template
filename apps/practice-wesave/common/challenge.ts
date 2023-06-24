import { Response } from './response';
import { BadgeType } from './badge';

export interface Challenge {
  name: string;
  type: 'save' | 'spend';
  goal: string;
  startDate: string;
  endDate: string;
  actionDay: string[];
  badge: BadgeType;
}

export type ChallengeResponse = Challenge & Response & { badge: string; type: string };
