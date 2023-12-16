import { AchivementResponse } from '@/common';
import { addDays } from 'date-fns';

type AchievementMockType = {
  id: number;
  name: string;
  goal: string;
  type: string;
  actionDay: string[];
  completedRatio: number;
};

export const AchievementMock: AchievementMockType[] = [
  {
    id: 1,
    actionDay: ['월', '화', '수', '목', '금', '토', '일'],
    goal: '500000',
    name: '돈 모으기',
    type: 'spend',
    completedRatio: 100,
  },
  {
    id: 2,
    actionDay: ['월', '화', '수', '목', '금', '토'],
    goal: '500000',
    name: '돈 모으기',
    type: 'spend',
    completedRatio: 80,
  },
];

export const AchievementResponseMock: AchivementResponse[] = [
  {
    id: 1,
    actionDay: ['월', '화', '수', '목', '금', '토', '일'],
    goal: '500000',
    name: '돈 모으기',
    type: 'spend',
    badge: 'art',
    startDate: new Date(),
    endDate: addDays(new Date(), 3),
    completeRatio: 100,
  },
  {
    id: 2,
    actionDay: ['월', '화', '수', '목', '금', '토'],
    goal: '500000',
    name: '돈 모으기',
    type: 'spend',
    completeRatio: 80,
    badge: 'award',
    startDate: new Date(),
    endDate: addDays(new Date(), 300),
  },
];
