import { AchivementResponse } from '@/common/achievement';
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
    completedRatio: 100,
    badge: 'art',
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    startDate: new Date(),
    endDate: addDays(new Date(), 3),
  },
  {
    id: 2,
    actionDay: ['월', '화', '수', '목', '금', '토'],
    goal: '500000',
    name: '돈 모으기',
    type: 'spend',
    completedRatio: 80,
    badge: 'award',
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    startDate: new Date(),
    endDate: addDays(new Date(), 300),
  },
];
