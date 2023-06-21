import { ChallengeResponse } from '@/common/challenge';

type ChallengeListItem = {
  name: string;
  targetAmount: number;
  targetPeriod: string[];
  percent: number;
  hasCheckBtn: boolean;
};

export const challengeResponseMock: ChallengeResponse[] = [
  {
    id: 1,
    actionDay: ['월', '화', '수', '목', '금', '토', '일'],
    badge: 'pig',
    createDate: new Date().toString(),
    endDate: new Date().toString(),
    goal: '500000',
    name: '돈 모으기',
    startDate: new Date().toString(),
    type: 'spend',
    updateDate: new Date().toString(),
  },
  {
    id: 2,
    actionDay: ['월', '화', '수', '목', '금', '일'],
    badge: 'pig',
    createDate: new Date().toString(),
    endDate: new Date().toString(),
    goal: '500000',
    name: '돈 모으기',
    startDate: new Date().toString(),
    type: 'spend',
    updateDate: new Date().toString(),
  },
];

export const challengeListMock: ChallengeListItem[] = [
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
  {
    hasCheckBtn: true,
    name: '오늘의 할일',
    percent: 100,
    targetAmount: 10000,
    targetPeriod: ['월', '화'],
  },
];
