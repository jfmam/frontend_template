import { AchivementResponse } from '@/common/achievement';

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
    createDate: new Date().toString(),
    updateDate: new Date().toString(),
  },
  {
    id: 2,
    actionDay: ['월', '화', '수', '목', '금', '토'],
    goal: '500000',
    name: '돈 모으기',
    type: 'spend',
    completedRatio: 80,
    badge: 'award',
    createDate: new Date().toString(),
    updateDate: new Date().toString(),
  },
];
