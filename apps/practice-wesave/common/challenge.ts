import { Response } from './response';

export type BadgeType = 'pig' | 'game' | 'present' | 'health' | 'money' | 'art' | 'rocket' | 'target' | 'award';

export interface Challenge {
  name: string;
  type: 'save' | 'spend';
  goal: string;
  startDate: string;
  endDate: string;
  actionDay: string[];
  badge: BadgeType | null;
}

export type ChallengeResponse = Challenge & Response & { badge: string; type: string };
